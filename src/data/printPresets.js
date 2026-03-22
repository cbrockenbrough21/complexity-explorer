export const PRINT_PRESETS = [
  {
    id: "square",
    label: "Square",
    width: 3000,
    height: 3000
  },
  {
    id: "a3Portrait",
    label: "A3 portrait",
    width: 3508,
    height: 4961
  },
  {
    id: "a2Portrait",
    label: "A2 portrait",
    width: 4961,
    height: 7016
  }
];

export const DEFAULT_PRINT_PRESET_ID = "a3Portrait";

/**
 * @param {string} presetId
 * @returns {{id:string,label:string,width:number,height:number}|undefined}
 */
export function getPrintPresetById(presetId) {
  return PRINT_PRESETS.find((preset) => preset.id === presetId);
}
