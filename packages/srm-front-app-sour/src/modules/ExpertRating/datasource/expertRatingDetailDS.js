import { $T } from "srm-mobile-ui";

const storage = window.localStorage;

const eleTabSupplierDS = () => ({
  autoQuery: false,
  editable: false,
  paging: false,
  enableQuery: false,
  primaryKey: "quotationHeaderId",
  // forceValidate: true,
  fields: [
    {
      fieldCode: "supplierCompanyNum",
      fieldType: "TEXT",
    },
    {
      fieldCode: "supplierCompanyName",
      fieldType: "TEXT",
    },
    {
      fieldCode: "quotationAmount",
      fieldType: "TEXT",
    },
    {
      fieldName: $T("ssrc.bidHall.model.bidHall.supplierScore").$D("供应商分数"),
      fieldCode: "indicScore",
      fieldType: "NUMBER",
    },
    {
      fieldName: $T("ssrc.bidHall.model.bidHall.pass").$D("是否通过"),
      fieldCode: "passStatus",
    },
    {
      fieldName: $T("ssrc.bidHall.model.bidHall.attachment").$D("附件"),
      fieldCode: "attachmentUuid",
      fieldType: "TEXT",
    },
  ],
  transport: {
    read: {
      url: `/ssrc/v1/${storage.getItem("organizationId")}/evaluate-indics/scoring-supplier/list`,
      method: "post",
    },
  },
});

export { eleTabSupplierDS };