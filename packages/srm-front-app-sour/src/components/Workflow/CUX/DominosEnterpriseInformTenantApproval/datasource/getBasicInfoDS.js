/*
 * @Date: 2023-04-11 09:12:34
 * @Author: LXM <xiaomei.lv@going-link.com>
 * @Version: 0.0.1
 * @Copyright: Copyright (c) 2021, Hand
 */

import { $T } from "srm-mobile-ui";
// import { renderRedNode, renderUpdateTag } from "../utils/utils";

export const getBasicInfoDS = () => ({
  // autoCreate: true,
  // autoQuery: false,
  // editable: false,
  // paging: false,
  autoQuery: true,
  fields: [
    // {
    //   fieldName: $T("sslm.enterpriseInform.model.application.attributeLongtext1").$D("变更类型"),
    //   fieldCode: "attributeLongtext1",
    //   fieldType: "SELECT",
    //   lovCode: "DOMINOS_SUPPLIER_CHANGE_TYPE",
    //   // displayField: "meaning", // 选择后展示值
    //   // valueField: "value",
    //   editor: true,
    //   options: {
    //     multiple: true,
    //     callback: (val, fieldCode, display, ds) => {
    //       getAttributeLongtext1(val.map(item => item.value).join(','));
    //       console.log(val, fieldCode, display, ds);
    //     },
    //   }
    // },
  ],
});

