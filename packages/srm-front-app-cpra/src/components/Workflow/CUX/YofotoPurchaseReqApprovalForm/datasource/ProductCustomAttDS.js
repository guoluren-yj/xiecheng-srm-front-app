// 商品定制属性/定制品属性
import { $T } from "srm-mobile-ui";
function productCustomAttDS() {
  return {
    autoQuery: false,
    pageSize: 10,
    editable: false,
    editFlag: false,
    enableQuery: false,
    fields: [ {
      fieldCode: "componentName",
      fieldName: $T("sprm.common.model.common.pName").$D("属性名称"),
      fieldType: "TEXT",
    }, {
      fieldCode: "other",
      fieldName: $T("sprm.common.model.common.cpValue").$D("属性值"),
      fieldType: "TEXT",
      // 除图片外使用text
      visible: (val, item) => item.componentType !== "UPLOAD" && item.componentType !== "IMAGE",
      render: (val, item) => item.cpValue,
    }, {
      fieldCode: "cpValue",
      fieldName: $T("sprm.common.model.common.cpValue").$D("属性值"),
      fieldType: "UPLOAD",
      canUpload: false,
      // 除图片外使用text
      visible: (val, item) => item.componentType === "UPLOAD" || item.componentType === "IMAGE",
    }, ],
  };
}

export {
  productCustomAttDS,
};