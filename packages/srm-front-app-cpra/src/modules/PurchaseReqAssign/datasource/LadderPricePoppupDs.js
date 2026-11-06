/*
 * @Descripttion:
 * @version:
 * @Author: yanglin
 * @Date: 2022-07-04 16:39:37
 * @LastEditors: yanglin
 * @LastEditTime: 2022-07-11 01:51:30
 */
// 参考价格列表
import { $T } from "srm-mobile-ui";

function ladderPriceListDs() {
  return {
    autoQuery: false,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    editFlag: false,
    enableQuery: false,
    data: [],
    showTotalCount: true,
    queryParameter: {
      customizeUnitCode: "SPRM.PURCHASE_EXECUTION.C7NLADDERPRICEMODAL",
    },
    fields: [
      {
        fieldCode: "ladderLineNum",
        fieldName: $T("ssrc.priceLibrary.model.priceLibrary.ladderLineNum").$D("行号"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "numberRange",
        fieldName: $T("ssrc.priceLibrary.model.priceLibrary.numberRange").$D("数量范围"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "ladderPrice",
        fieldName: $T("ssrc.priceLibrary.model.priceLibrary.price").$D("价格"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "ladderPriceRemark",
        fieldName: $T("ssrc.priceLibrary.model.priceLibrary.ladderPriceRemark").$D("备注"),
        fieldType: "TEXT",
      },
    ],
  };
}

export {
  ladderPriceListDs,
};