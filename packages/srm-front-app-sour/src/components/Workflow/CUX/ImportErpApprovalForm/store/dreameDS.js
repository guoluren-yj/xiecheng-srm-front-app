import { $T } from "srm-mobile-ui";

const storage = window.localStorage;

const formDS = () => ({
  fields: [
    {
      fieldCode: "priceAttachmentId",
      fieldName: $T("ssrc.priceLibraryNew.model.library.attachmentUpload").$D("附件上传"),
      fieldType: "UPLOAD",
      disabled: true,
      bucketName: "private-bucket",
    },
    {
      fieldCode: "priceRemark",
      fieldName: $T("ssrc.priceLibraryNew.model.library.remark").$D("备注"),
      fieldType: "TEXT",
    },
    {
      fieldCode: "attributeVarchar1Meaning",
      fieldName: $T("ssrc.priceLibraryNew.cux.dreame.group").$D("组别"),
      fieldType: "TEXT",
    },
  ],
});

const listDS = () => ({
  fields: [],
  queryFields: [],
  enableQuery: false,
  transport: {
    read: {
      url: `/spc/v1/${storage.getItem("organizationId")}/price-lib-mains`,
      method: "get",
    },
  },
});

const ladderQuotationDS = () => ({
  enableQuery: false,
  fields: [
    {
      fieldCode: "ladderLineNum",
      fieldName: $T("ssrc.priceLibraryNew.model.library.ladderLineNum").$D("行号"),
    },
    {
      fieldCode: "ladderFrom",
      fieldName: $T("ssrc.priceLibraryNew.model.library.numRanger").$D("数量范围"),
    },
    {
      fieldCode: "ladderPrice",
      fieldName: $T("ssrc.priceLibraryNew.model.library.price").$D("价格"),
    },
    {
      fieldCode: "cumulativeFlag",
      type: "Boolean",
      trueValue: 1,
      falseValue: 0,
      defaultValue: 0,
      fieldName: $T("ssrc.priceLibraryNew.model.library.cumulative").$D("是否累计阶梯"),
    },
    {
      fieldCode: "ladderPriceRemark",
      fieldName: $T("ssrc.priceLibraryNew.model.library.remark").$D("备注"),
    },
  ],
  transport: {
    read: {
      url: `spc/v1/${storage.getItem("organizationId")}/price-lib-req-ladders`,
      method: "get",
    },
  },
});

export { formDS, listDS, ladderQuotationDS };