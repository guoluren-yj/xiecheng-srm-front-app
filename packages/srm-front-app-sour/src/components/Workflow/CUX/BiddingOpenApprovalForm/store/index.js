import { $T } from "srm-mobile-ui";

const storage = window.localStorage;

export const baseInfoDS = ({ rfxHeaderId }) => ({
  autoQuery: true,
  fields: [
    {
      fieldCode: "rfxNum",
      fieldType: "TEXT",
    },
    {
      fieldName: $T("ssrc.biddingOpen.model.rfxTitle").$D("招标书标题"),
      fieldType: "TEXT",
      fieldCode: "rfxTitle",
    },
    {
      fieldName: $T("ssrc.biddingOpen.model.companyName").$D("公司"),
      fieldType: "TEXT",
      fieldCode: "companyName",
    },
    {
      fieldName: $T("ssrc.biddingOpen.model.quotationStartDate").$D(
        "投标开始时间"
      ),
      fieldType: "TEXT",
      fieldCode: "quotationStartDate",
    },
    {
      fieldName: $T("ssrc.biddingOpen.model.quotationEndDate").$D(
        "投标截止时间"
      ),
      fieldType: "TEXT",
      fieldCode: "quotationEndDate",
    },
    {
      fieldName: $T("ssrc.biddingOpen.model.rfxRemark").$D("备注"),
      fieldType: "TEXT",
      fieldCode: "rfxRemark",
    },
    {
      fieldName: $T("ssrc.biddingOpen.view.application.illustrate").$D(
        "申请说明"
      ),
      fieldType: "TEXT",
      fieldCode: "attributeLongtext7",
    },
  ],
  transport: {
    read: {
      url: `/scux/v1/${storage.getItem(
        "organizationId"
      )}/yongxiang/rfx/simple/${rfxHeaderId}`,
      method: "get",
    },
  },
});

export const supplierDS = ({ rfxHeaderId }) => ({
  autoQuery: true,
  pageSize: 10,
  editable: false,
  enableQuery: false,
  fields: [
    {
      fieldName: $T("ssrc.biddingOpen.model.supplierCompanyNum").$D(
        "供应商编码"
      ),
      fieldType: "TEXT",
      fieldCode: "supplierCompanyNum",
    },
    {
      fieldName: $T("ssrc.biddingOpen.model.supplierCompanyName").$D(
        "供应商名称"
      ),
      fieldType: "TEXT",
      fieldCode: "supplierCompanyName",
    },
    {
      fieldName: $T("ssrc.biddingOpen.model.companyIpRate").$D("重合率"),
      fieldType: "TEXT",
      fieldCode: "companyIpRate",
    },
    {
      fieldName: $T("ssrc.biddingOpen.model.readFlag").$D("是否已读"),
      fieldType: "TEXT",
      fieldCode: "readFlag",
    },
    {
      fieldName: $T("ssrc.biddingOpen.model.feedbackStatusMeaning").$D(
        "是否参与"
      ),
      fieldType: "TEXT",
      fieldCode: "feedbackStatusMeaning",
    },
    {
      fieldName: $T("ssrc.biddingOpen.model.quotedCount").$D("报价行数"),
      fieldType: "TEXT",
      fieldCode: "quotedCount",
    },
    {
      fieldName: $T("ssrc.biddingOpen.model.submitPrequalificationFlag").$D(
        "是否资格预审"
      ),
      fieldType: "TEXT",
      fieldCode: "submitPrequalificationFlag",
    },
  ],
  transport: {
    read: {
      url: `/ssrc/v1/${storage.getItem(
        "organizationId"
      )}/rfx/${rfxHeaderId}/suppliers`,
      method: "get",
    },
  },
});

export const itemLineDS = () => ({
  autoQuery: false,
  pageSize: 10,
  editable: false,
  enableQuery: false,
  fields: [
    {
      fieldType: "TEXT",
      fieldCode: "rfxLineItemNum",
    },
    {
      fieldType: "TEXT",
      fieldCode: "itemCode",
    },
    {
      fieldType: "TEXT",
      fieldCode: "itemName",
    },
    {
      fieldName: $T("ssrc.biddingOpen.model.specifications").$D("规格"),
      fieldType: "TEXT",
      fieldCode: "specifications",
    },
    {
      fieldName: $T("ssrc.biddingOpen.model.model").$D("材质"),
      fieldType: "TEXT",
      fieldCode: "model",
    },
    {
      fieldName: $T("ssrc.biddingOpen.model.rfxQuantity").$D("需求数量"),
      fieldType: "TEXT",
      fieldCode: "rfxQuantity",
    },
    {
      fieldName: $T("ssrc.biddingOpen.model.uomName").$D("单位"),
      fieldType: "TEXT",
      fieldCode: "uomName",
    },
  ],
  transport: {
    read: {
      url: `/scux/v1/${storage.getItem(
        "organizationId"
      )}/yongxiang/rfx/quotation/datail`,
      method: "GET",
    },
  },
});

export const ipCompanyIpRateDS = ({ rfxHeaderId }) => ({
  autoQuery: false,
  editable: false,
  enableQuery: false,
  paging: false,
  fields: [
    {
      fieldName: $T("ssrc.biddingOpen.model.supplierCompanyName").$D("公司"),
      fieldType: "TEXT",
      fieldCode: "supplierCompanyName",
    },
    {
      fieldName: $T("ssrc.biddingOpen.model.supplierCompanyIp").$D("投标IP"),
      fieldType: "TEXT",
      fieldCode: "supplierCompanyIp",
    },
    {
      fieldName: $T("ssrc.biddingOpen.model.companyIpRate").$D("最高重合率"),
      fieldType: "TEXT",
      fieldCode: "companyIpRate",
    },
    {
      fieldName: $T("ssrc.biddingOpen.model.coincidenceCompanyName").$D("重合公司"),
      fieldType: "TEXT",
      fieldCode: "coincidenceCompanyName",
    },
    {
      fieldName: $T("ssrc.biddingOpen.model.coincidenceSupplierIp").$D("重合IP"),
      fieldType: "TEXT",
      fieldCode: "coincidenceSupplierIp",
    },
  ],
  transport: {
    read: {
      url: `/ssrc/v1/${storage.getItem(
        "organizationId"
      )}/rfx/quotation/${rfxHeaderId}/Ip`,
      method: "GET",
    },
  },
});
