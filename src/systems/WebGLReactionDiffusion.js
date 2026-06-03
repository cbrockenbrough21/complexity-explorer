import { ISimulation } from "./ISimulation.js";
import { ReactionDiffusion } from "./ReactionDiffusion.js";

const DEFAULT_CONFIG = {
  width: 256,
  height: 256,
  feed: 0.055,
  kill: 0.062,
  dA: 1.0,
  dB: 0.5,
  dt: 1.0,
  stepsPerFrame: 8,
  patchCount: 24,
  patchSizeMin: 6,
  patchSizeMax: 20
};

const VERT_SRC = `#version 300 es
layout(location = 0) in vec2 aPosition;
out vec2 vUv;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

// Gray-Scott simulation fragment shader.
// Reads A from .r, B from .g. Uses REPEAT wrap mode for toroidal boundaries.
const SIM_FRAG_SRC = `#version 300 es
precision highp float;
uniform sampler2D uState;
uniform vec2 uResolution;
uniform float uFeed;
uniform float uKill;
uniform float uDA;
uniform float uDB;
uniform float uDT;
in vec2 vUv;
out vec4 fragColor;

void main() {
  vec2 texel = 1.0 / uResolution;
  vec2 ab = texture(uState, vUv).rg;
  float A = ab.r;
  float B = ab.g;

  // 8-neighbor weighted discrete Laplacian matching ReactionDiffusion.js exactly.
  // REPEAT wrap mode handles toroidal boundaries automatically.
  float lapA =
    -A
    + 0.2 * (texture(uState, vUv + vec2(-texel.x,     0.0)).r
           + texture(uState, vUv + vec2( texel.x,     0.0)).r
           + texture(uState, vUv + vec2(     0.0, -texel.y)).r
           + texture(uState, vUv + vec2(     0.0,  texel.y)).r)
    + 0.05 * (texture(uState, vUv + vec2(-texel.x, -texel.y)).r
            + texture(uState, vUv + vec2( texel.x, -texel.y)).r
            + texture(uState, vUv + vec2(-texel.x,  texel.y)).r
            + texture(uState, vUv + vec2( texel.x,  texel.y)).r);

  float lapB =
    -B
    + 0.2 * (texture(uState, vUv + vec2(-texel.x,     0.0)).g
           + texture(uState, vUv + vec2( texel.x,     0.0)).g
           + texture(uState, vUv + vec2(     0.0, -texel.y)).g
           + texture(uState, vUv + vec2(     0.0,  texel.y)).g)
    + 0.05 * (texture(uState, vUv + vec2(-texel.x, -texel.y)).g
            + texture(uState, vUv + vec2( texel.x, -texel.y)).g
            + texture(uState, vUv + vec2(-texel.x,  texel.y)).g
            + texture(uState, vUv + vec2( texel.x,  texel.y)).g);

  float reaction = A * B * B;
  float newA = A + (uDA * lapA - reaction + uFeed * (1.0 - A)) * uDT;
  float newB = B + (uDB * lapB + reaction - (uKill + uFeed) * B) * uDT;

  fragColor = vec4(clamp(newA, 0.0, 1.0), clamp(newB, 0.0, 1.0), 0.0, 1.0);
}`;

// Display fragment shader: same color mapping as CanvasRenderer.js #drawReactionDiffusion.
// CPU path: val = clamp((A - B) * 255, 0, 255), R = val, G = clamp(val+30, 0,255), B = 220.
const DISPLAY_FRAG_SRC = `#version 300 es
precision highp float;
uniform sampler2D uState;
in vec2 vUv;
out vec4 fragColor;

void main() {
  vec2 ab = texture(uState, vUv).rg;
  float val = clamp(ab.r - ab.g, 0.0, 1.0);
  fragColor = vec4(val, clamp(val + 30.0 / 255.0, 0.0, 1.0), 220.0 / 255.0, 1.0);
}`;

/**
 * GPU-accelerated Gray-Scott reaction-diffusion using WebGL 2 ping-pong textures.
 * Falls back to ReactionDiffusion (CPU) if WebGL 2 or RGBA32F is unavailable.
 * Implements ISimulation exactly — drop-in replacement for ReactionDiffusion.
 */
export class WebGLReactionDiffusion extends ISimulation {
  /** @param {Object} [config] */
  constructor(config = {}) {
    super();
    this._fallback = null;
    this._gl = null;
    this._simProgram = null;
    this._displayProgram = null;
    this._simUniforms = null;
    this._displayUniforms = null;
    this._textures = [null, null];
    this._fbos = [null, null];
    this._quadVAO = null;
    this._vbo = null;
    this._current = 0;
    this.config = { ...DEFAULT_CONFIG };
    this.init(config);
  }

  /** @param {Object} [config] */
  init(config = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };

    if (this._fallback) {
      this._fallback.init(this.config);
      return;
    }

    this._destroyGLResources();

    if (this._gl) {
      this._buildGLResources();
    } else if (!this._initGL()) {
      this._fallback = new ReactionDiffusion(this.config);
    }
  }

  /** Advance simulation by stepsPerFrame GPU passes. */
  step() {
    if (this._fallback) {
      this._fallback.step();
      return;
    }
    for (let i = 0; i < this.config.stepsPerFrame; i += 1) {
      this._simStep();
    }
  }

  /**
   * Returns current state. For the WebGL path, renders the display shader to
   * gl.canvas first so CanvasRenderer can blit it via drawImage.
   * @returns {{type:string, width:number, height:number, texture:WebGLTexture, gl:WebGL2RenderingContext}
   *          |{type:string, width:number, height:number, A:Float32Array, B:Float32Array}}
   */
  getState() {
    if (this._fallback) return this._fallback.getState();

    this._renderDisplay();

    return {
      type: 'reaction-diffusion',
      width: this.config.width,
      height: this.config.height,
      texture: this._textures[this._current],
      gl: this._gl
    };
  }

  /** Delete all WebGL resources. */
  destroy() {
    if (this._fallback) {
      this._fallback.destroy();
      this._fallback = null;
      return;
    }

    const gl = this._gl;
    if (!gl) return;

    this._destroyGLResources();

    if (this._simProgram) gl.deleteProgram(this._simProgram);
    if (this._displayProgram) gl.deleteProgram(this._displayProgram);
    if (this._quadVAO) gl.deleteVertexArray(this._quadVAO);
    if (this._vbo) gl.deleteBuffer(this._vbo);

    this._simProgram = null;
    this._displayProgram = null;
    this._quadVAO = null;
    this._vbo = null;
    this._gl = null;
  }

  // ─── Private ──────────────────────────────────────────────────────────────

  _initGL() {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2');
      if (!gl) return false;
      if (!gl.getExtension('EXT_color_buffer_float')) return false;

      this._gl = gl;
      this._compilePrograms();
      this._setupQuad();
      this._buildGLResources();
      return true;
    } catch (_) {
      return false;
    }
  }

  _compilePrograms() {
    this._simProgram = this._compileProgram(VERT_SRC, SIM_FRAG_SRC);
    this._displayProgram = this._compileProgram(VERT_SRC, DISPLAY_FRAG_SRC);

    const gl = this._gl;
    this._simUniforms = {
      uState:      gl.getUniformLocation(this._simProgram, 'uState'),
      uResolution: gl.getUniformLocation(this._simProgram, 'uResolution'),
      uFeed:       gl.getUniformLocation(this._simProgram, 'uFeed'),
      uKill:       gl.getUniformLocation(this._simProgram, 'uKill'),
      uDA:         gl.getUniformLocation(this._simProgram, 'uDA'),
      uDB:         gl.getUniformLocation(this._simProgram, 'uDB'),
      uDT:         gl.getUniformLocation(this._simProgram, 'uDT')
    };
    this._displayUniforms = {
      uState: gl.getUniformLocation(this._displayProgram, 'uState')
    };
  }

  _setupQuad() {
    const gl = this._gl;
    // Two triangles covering clip space [-1,1]^2
    const vertices = new Float32Array([
      -1, -1,  1, -1, -1,  1,
      -1,  1,  1, -1,  1,  1
    ]);

    this._quadVAO = gl.createVertexArray();
    gl.bindVertexArray(this._quadVAO);

    this._vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this._vbo);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    gl.bindVertexArray(null);
  }

  _buildGLResources() {
    const gl = this._gl;
    const { width, height } = this.config;

    gl.canvas.width = width;
    gl.canvas.height = height;

    this._textures[0] = this._createTexture(width, height);
    this._textures[1] = this._createTexture(width, height);
    this._fbos[0] = this._createFBO(this._textures[0]);
    this._fbos[1] = this._createFBO(this._textures[1]);

    this._current = 0;
    this._seedTextures();
  }

  _destroyGLResources() {
    const gl = this._gl;
    if (!gl) return;

    for (let i = 0; i < 2; i += 1) {
      if (this._textures[i]) {
        gl.deleteTexture(this._textures[i]);
        this._textures[i] = null;
      }
      if (this._fbos[i]) {
        gl.deleteFramebuffer(this._fbos[i]);
        this._fbos[i] = null;
      }
    }
  }

  _createTexture(width, height) {
    const gl = this._gl;
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, width, height, 0, gl.RGBA, gl.FLOAT, null);
    return tex;
  }

  _createFBO(texture) {
    const gl = this._gl;
    const fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return fbo;
  }

  /**
   * Seeds the initial state with A=1 everywhere, then places patchCount square
   * patches of B=1/A=0 with random centers and half-widths in [patchSizeMin, patchSizeMax].
   * Matches #seedRandomPatches in ReactionDiffusion.js exactly (toroidal wrapping, square patch).
   */
  _seedTextures() {
    const gl = this._gl;
    const { width, height, patchCount, patchSizeMin, patchSizeMax } = this.config;
    const data = new Float32Array(width * height * 4);

    for (let i = 0; i < width * height; i += 1) {
      data[i * 4 + 0] = 1.0; // A
      data[i * 4 + 1] = 0.0; // B
    }

    for (let p = 0; p < patchCount; p += 1) {
      const cx = Math.floor(Math.random() * width);
      const cy = Math.floor(Math.random() * height);
      const sizeRange = patchSizeMax - patchSizeMin;
      const radius = patchSizeMin + Math.floor(Math.random() * (sizeRange + 1));

      for (let dy = -radius; dy <= radius; dy += 1) {
        for (let dx = -radius; dx <= radius; dx += 1) {
          const nx = (cx + dx + width) % width;
          const ny = (cy + dy + height) % height;
          const idx = ny * width + nx;
          data[idx * 4 + 0] = 0.0; // A = 0
          data[idx * 4 + 1] = 1.0; // B = 1
        }
      }
    }

    gl.bindTexture(gl.TEXTURE_2D, this._textures[0]);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, width, height, 0, gl.RGBA, gl.FLOAT, data);

    // Clear the second texture to A=1, B=0
    const blank = new Float32Array(width * height * 4);
    for (let i = 0; i < width * height; i += 1) {
      blank[i * 4 + 0] = 1.0;
    }
    gl.bindTexture(gl.TEXTURE_2D, this._textures[1]);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, width, height, 0, gl.RGBA, gl.FLOAT, blank);
  }

  _simStep() {
    const gl = this._gl;
    const { width, height, feed, kill, dA, dB, dt } = this.config;
    const readTex = this._textures[this._current];
    const writeFBO = this._fbos[(this._current + 1) % 2];

    gl.bindFramebuffer(gl.FRAMEBUFFER, writeFBO);
    gl.viewport(0, 0, width, height);
    gl.useProgram(this._simProgram);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, readTex);
    gl.uniform1i(this._simUniforms.uState, 0);
    gl.uniform2f(this._simUniforms.uResolution, width, height);
    gl.uniform1f(this._simUniforms.uFeed, feed);
    gl.uniform1f(this._simUniforms.uKill, kill);
    gl.uniform1f(this._simUniforms.uDA, dA);
    gl.uniform1f(this._simUniforms.uDB, dB);
    gl.uniform1f(this._simUniforms.uDT, dt);

    gl.bindVertexArray(this._quadVAO);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    gl.bindVertexArray(null);

    this._current = (this._current + 1) % 2;
  }

  _renderDisplay() {
    const gl = this._gl;
    const { width, height } = this.config;

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, width, height);
    gl.useProgram(this._displayProgram);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this._textures[this._current]);
    gl.uniform1i(this._displayUniforms.uState, 0);

    gl.bindVertexArray(this._quadVAO);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    gl.bindVertexArray(null);
  }

  _compileProgram(vertSrc, fragSrc) {
    const gl = this._gl;

    const vert = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vert, vertSrc);
    gl.compileShader(vert);

    const frag = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(frag, fragSrc);
    gl.compileShader(frag);

    const program = gl.createProgram();
    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);

    gl.deleteShader(vert);
    gl.deleteShader(frag);

    return program;
  }
}
