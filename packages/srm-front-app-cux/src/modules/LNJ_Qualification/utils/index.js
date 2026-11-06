import { isEmpty } from "@/utils/index";
import { $T } from "srm-mobile-ui";

// 对象值为空，undefined进行过滤
const filterNullObject = (data = {}) => {
  const params = Object.keys(data).filter((key) => !isEmpty(data[key])).reduce((acc, key) => ({ ...acc, [key]: data[key] }), {});
  return params;
};

// 字符是或者否渲染
const renderYesOrNo = (val) => {
  const value = [ "1", 1, "yes", "Y", "y" ].includes(val);
  return value ? <span>{$T("hzero.common.model.yes").$D("是")}</span> : <span>{$T("hzero.common.model.yes").$D("否")}</span>;
};

export { filterNullObject, renderYesOrNo };