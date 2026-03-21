import { describe, expect, it } from "vitest";
import { GameOfLife } from "../src/systems/GameOfLife.js";

const empty5x5 = () =>
  Array.from({ length: 5 }, () => Array.from({ length: 5 }, () => 0));

describe("GameOfLife rules", () => {
  it("underpopulation: a live cell with fewer than 2 neighbors dies", () => {
    const grid = empty5x5();
    grid[2][2] = 1;
    grid[2][3] = 1;

    const gol = new GameOfLife({ seedGrid: grid, initialDensity: 0 });
    gol.step();

    expect(gol.getState()[2][2]).toBe(0);
  });

  it("survival: a live cell with 2-3 neighbors lives", () => {
    const grid = empty5x5();
    grid[2][2] = 1;
    grid[2][1] = 1;
    grid[2][3] = 1;

    const gol = new GameOfLife({ seedGrid: grid, initialDensity: 0 });
    gol.step();

    expect(gol.getState()[2][2]).toBe(1);
  });

  it("overcrowding: a live cell with more than 3 neighbors dies", () => {
    const grid = empty5x5();
    grid[2][2] = 1;
    grid[2][1] = 1;
    grid[2][3] = 1;
    grid[1][2] = 1;
    grid[3][2] = 1;

    const gol = new GameOfLife({ seedGrid: grid, initialDensity: 0 });
    gol.step();

    expect(gol.getState()[2][2]).toBe(0);
  });

  it("birth: a dead cell with exactly 3 neighbors becomes alive", () => {
    const grid = empty5x5();
    grid[2][1] = 1;
    grid[2][3] = 1;
    grid[1][2] = 1;

    const gol = new GameOfLife({ seedGrid: grid, initialDensity: 0 });
    gol.step();

    expect(gol.getState()[2][2]).toBe(1);
  });
});
