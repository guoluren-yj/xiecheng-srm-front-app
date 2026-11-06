import { $T } from "srm-mobile-ui";

const formDs = () => ({
  autoQuery: false,
  selection: Infinity,
  pageSize: 5,
  editable: false,
  showTotalCount: true,
  enableQuery:false,
  fields: [
    { fieldCode: "realName", fieldType: "TEXT", fieldName: $T("smpc.product.view.createByName").$D("创建人") },
    { fieldCode: "lastUpdateDate", fieldType: "TEXT", fieldName: $T("hzero.common.date.createdDate").$D("创建时间") },
    { fieldCode: "approveRemark", fieldType: "TEXT", fieldName: $T("smpc.product.model.remark").$D("备注") },
  ],
});

export default formDs;