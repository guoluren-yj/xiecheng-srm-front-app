// 物料定制属性
import { SrmUtil, $T } from "srm-mobile-ui";

function customAttributeDS(itemId, prLineId) {
  return {
    autoQuery: false,
    pageSize: 10,
    editable: false,
    editFlag: false,
    enableQuery: false,
    fields: [ {
      fieldCode: "attributeName",
      fieldName: $T("sprm.common.model.common.componentName").$D("属性名称"),
      fieldType: "TEXT",
    }, {
      fieldCode: "attributeValue",
      fieldName: $T("sprm.common.model.common.cpValue").$D("属性值"),
      fieldType: "TEXT",
    }, ],
    queryParameter: {
      customMadeFlag: 1,
      itemId,
      prLineId,
    },
    transport: {
      read: {
        url: `/sprm/v1/${SrmUtil.getTenantId()}/purchase-requests/custom-attribute`,
        method: "get",
      },
    }
  };
}

export {
  customAttributeDS,
};