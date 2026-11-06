import { $T } from "srm-mobile-ui";

// 获取多语言翻译-中文
export const getLanguage = (key) => {
  const config = {
    basicInfo: $T("small.common.view.panel.basicInfos").$D("基本信息"),
    lineInfo: $T("small.common.view.panel.lineInfos").$D("行信息"),
  };
  return key ? config[key] : "";
};
