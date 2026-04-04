import { module01 } from "../content/modules/module-01.js";
import { module02 } from "../content/modules/module-02.js";
import { module03 } from "../content/modules/module-03.js";
import { module04 } from "../content/modules/module-04.js";
import { module05 } from "../content/modules/module-05.js";
import { module06 } from "../content/modules/module-06.js";
import { module07 } from "../content/modules/module-07.js";
import { module08 } from "../content/modules/module-08.js";
import { module09 } from "../content/modules/module-09.js";

export const MODULES = [
  module01, module02, module03,
  module04, module05, module06,
  module07, module08, module09,
];

export const MODULES_BY_ID = Object.fromEntries(
  MODULES.map(m => [m.id, m])
);
