import { SrmUtil } from "srm-mobile-ui";
import { getOmronTabItem } from "./omronCux";

const getCUXTabItem = (props) => {
  const currentTenantNum = SrmUtil?.getTenantNum();
  if (currentTenantNum === "SRM-OMRON") {
    return getOmronTabItem(props);
  }
  return null;
};

export {
  getCUXTabItem
};