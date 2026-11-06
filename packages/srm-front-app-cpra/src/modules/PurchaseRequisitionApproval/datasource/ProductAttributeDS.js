// 商品属性
import { $T } from "srm-mobile-ui";

function productAttributeDS() {
  return {
    autoQuery: false,
    pageSize: 10,
    editable: false,
    editFlag: false,
    enableQuery: false,
    fields: [ {
      fieldCode: "pName",
      fieldName: $T("sprm.common.model.common.pName").$D("属性名称"),
      fieldType: "TEXT",
    }, {
      fieldCode: "pValue",
      fieldName: $T("sprm.common.model.common.cpValue").$D("属性值"),
      fieldType: "TEXT",
    }, ],
  };
}

export {
  productAttributeDS,
};