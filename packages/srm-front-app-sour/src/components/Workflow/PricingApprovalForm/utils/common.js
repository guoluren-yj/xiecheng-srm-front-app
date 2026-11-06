import { isNil } from "lodash";

const isNilVal = (val = null) => {
  const flag = isNil(val) || val === "undefined" || val === "null";
  return flag;
};

export {
  isNilVal,
};
