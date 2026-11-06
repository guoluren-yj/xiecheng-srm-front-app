import { $T } from "srm-mobile-ui";
// 头信息
function setLinkDS() {
  return {
    autoQuery: false,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    enableQuery: false,
    showTotalCount: false,
    forceValidate:true,
    fields: [
      {
        required: true,
        fieldType: "INPUT",
        fieldCode: "userName",
        fieldName: $T("sinv.purchaserDelivery.model.common.userNames").$D("项目经理名字"),
      },
      {
        required: true,
        fieldType: "INPUT",
        fieldCode: "mobilephone",
        fieldName: $T("sinv.purchaserDelivery.model.common.mobilephones").$D("项目经理电话"),
        pattern: /^1[3-9]\d{9}$/,
        errorMessage: $T("sinv.purchaserDelivery.model.common.phonesFormat").$D("电话格式不正确")
      },
    ]
  };
}

export default setLinkDS;