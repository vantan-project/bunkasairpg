const assetBgColorMap = {
  slash: "bg-slash",
  blow: "bg-blow",
  shoot: "bg-shoot",
  neutral: "bg-neutral",
  flame: "bg-flame",
  water: "bg-water",
  wood: "bg-wood",
  shine: "bg-shine",
  dark: "bg-dark",
  heal: "bg-heal",
  buff: "bg-buff",
  debuff: "bg-debuff",
};

type AssetType = keyof typeof assetBgColorMap;

export function assetBgColor(type: AssetType): string {
  return assetBgColorMap[type];
}
