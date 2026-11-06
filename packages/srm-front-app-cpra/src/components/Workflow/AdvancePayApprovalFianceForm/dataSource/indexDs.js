import { SrmUtil, $T, SrmMath } from "srm-mobile-ui";

const tenantId = SrmUtil.getTenantId();

const promptCode = "sfin.advancePaymentRecord.model.common";

export const headerDS = (paymentHeaderId) => ({
  autoQuery: false,
  editable: false,
  enableQuery: false,
  fields: [
    {
      fieldCode: "paymentNum",
      fieldType: "TEXT",
      fieldName: $T("sfin.payment.common.payApproveNo").$D("付款申请单号"),
    },
    {
      fieldType: "TEXT",
      fieldCode: "companyName",
      fieldName: $T("entity.company.tag").$D("公司"),
    },
    {
      fieldCode: "ouName",
      fieldType: "TEXT",
      fieldName: $T("sfin.payment.common.ouName").$D("业务实体"),
    },
    {
      fieldCode: "supplierCompanyName",
      fieldType: "TEXT",
      fieldName: $T("entity.supplier.tag").$D("供应商"),
    },
    {
      fieldCode: "paymentSourceTypeCodeMeaning",
      fieldType: "TEXT",
      fieldName: $T("sfin.payment.common.paymentSourceTypeCodeMeaning").$D("付款类型"),
    },
    {
      fieldCode: "bankName",
      fieldType: "TEXT",
      fieldName: $T("sfin.payment.common.bankName").$D("银行名称"),
    },
    {
      fieldCode: "bankBranchName",
      fieldType: "TEXT",
      fieldName: $T("sfin.payment.common.bankBranchName").$D("开户行名称"),
    },
    {
      fieldCode: "bankAccountName",
      fieldType: "TEXT",
      fieldName: $T("sfin.payment.common.bankAccountName").$D("账户名称"),
    },
    {
      fieldCode: "bankAccountNum",
      fieldType: "TEXT",
      fieldName: $T("sfin.payment.common.acceptListTypeId").$D("银行账号"),
    },
    {
      fieldCode: "typeName",
      fieldType: "TEXT",
      fieldName: $T("sfin.payment.common.sourceCode").$D("付款方式"),
    },
    {
      fieldCode: "paymentDate",
      fieldType: "TEXT",
      fieldName: $T("sfin.payment.common.paymentDate").$D("付款日期"),
    },
    {
      fieldCode: "paymentAmount",
      fieldType: "TEXT",
      fieldName: $T("sfin.payment.common.payMoney").$D("付款金额"),
      render: (val, item) => SrmUtil.getNumberLocalized(SrmMath.toFixed(val, item.amountPrecision)),
    },
    {
      fieldCode: "currencyCode",
      fieldType: "TEXT",
      fieldName: $T("sfin.payment.common.currencyCode").$D("币种"),
    },
    {
      fieldCode: "creationDate",
      fieldType: "TEXT",
      fieldName: $T("sfin.payment.common.createdate").$D("创建日期"),
    },
    {
      fieldCode: "createdByName",
      fieldType: "TEXT",
      fieldName: $T("sfin.payment.common.createdByName").$D("申请人"),
    },
    {
      fieldCode: "remark",
      fieldType: "TEXT",
      fieldName: $T("hzero.common.remark").$D("备注"),
    },
    {
      fieldCode: "advanceRatio",
      fieldType: "TEXT",
      fieldName: $T("sfin.payment.common.advanceRatio").$D("本次预付比例"),
    },
  ],
  queryParameter: {
    customizeUnitCode: "SFIN.PAY_QUERY_DETAIL.HEADER",
  },
  transport: {
    read: {
      url: `/sfin/v1/${tenantId}/payment-headers/query-header/${paymentHeaderId}`,
      method: "GET",
    },
  },
});

export const lineDS = (paymentHeaderId) => ({
  autoQuery: false,
  editable: false,
  fields: [
    // 供应商
    {
      fieldCode: "lineNum",
      fieldType: "TEXT",
      fieldName: $T(`${promptCode}.lineNum`).$D("行号"),
    },
    {
      fieldType: "TEXT",
      fieldCode: "paymentAdvanceAmount",
      fieldName: $T(`${promptCode}.paymentAdvanceAmount`).$D("本次付款金额"),
      render: (val, item) => SrmUtil.getNumberLocalized(SrmMath.toFixed(val, item.amountPrecision)),
    },
    {
      fieldCode: "paymentReason",
      fieldType: "TEXT",
      fieldName: $T(`${promptCode}.paymentReason`).$D("付款事由"),
    },
    {
      fieldCode: "remark",
      fieldType: "TEXT",
      fieldName: $T(`${promptCode}.remark`).$D("备注"),
    },
    // 协议
    {
      fieldCode: "displayNum",
      fieldType: "TEXT",
      fieldName: $T(`${promptCode}.displayNums`).$D("采购协议编号"),
    },
    {
      fieldCode: "pcName",
      fieldType: "TEXT",
      fieldName: $T(`${promptCode}.pcName`).$D("采购协议名称"),
    },
    {
      fieldCode: "taxIncludedAmount",
      fieldType: "TEXT",
      fieldName: $T(`${promptCode}.taxIncludedAmount`).$D("协议总额"),
      render: (val, item) => SrmUtil.getNumberLocalized(SrmMath.toFixed(val, item.amountPrecision)),
    },
    {
      fieldCode: "amount",
      fieldType: "TEXT",
      fieldName: $T(`${promptCode}.amount`).$D("不含税金额"),
      render: (val, item) => SrmUtil.getNumberLocalized(SrmMath.toFixed(val, item.amountPrecision)),
    },
    {
      fieldCode: "paymentAmount",
      fieldType: "TEXT",
      fieldName: $T(`${promptCode}.paymentAmount`).$D("剩余可付金额"),
      render: (val, item) => SrmUtil.getNumberLocalized(SrmMath.toFixed(val, item.amountPrecision)),
    },
    {
      fieldCode: "advanceRatio",
      fieldType: "TEXT",
      fieldName: $T(`${promptCode}.advanceRatio`).$D("本次预付比例"),
    },
    {
      fieldCode: "paymentAdvanceAmount",
      fieldType: "TEXT",
      fieldName: $T(`${promptCode}.paymentAdvanceAmount`).$D("本次付款金额"),
      render: (val, item) => SrmUtil.getNumberLocalized(SrmMath.toFixed(val, item.amountPrecision)),
    },
    {
      fieldCode: "pcTypeName",
      fieldType: "TEXT",
      fieldName: $T(`${promptCode}.pcTypeName`).$D("协议类型"),
    },
    {
      fieldCode: "startDateActive",
      fieldType: "TEXT",
      fieldName: $T(`${promptCode}.startDateActive`).$D("协议起始日期"),
    },
    {
      fieldCode: "endDateActive",
      fieldType: "TEXT",
      fieldName: $T(`${promptCode}.endDateActive`).$D("协议终止日期"),
    },
    {
      fieldCode: "realName",
      fieldType: "TEXT",
      fieldName: $T(`${promptCode}.realName`).$D("创建人"),
    },
    {
      fieldCode: "creationDate",
      fieldType: "TEXT",
      fieldName: $T(`${promptCode}.creationDate`).$D("创建时间"),
    },
    {
      fieldCode: "confirmedDate",
      fieldType: "TEXT",
      fieldName: $T(`${promptCode}.confirmedDate`).$D("生效时间"),
    },
    // 订单
    {
      fieldCode: "orderTypeName",
      fieldType: "TEXT",
      fieldName: $T(`${promptCode}.orderTypeName`).$D("采购订单类型"),
    },
    {
      fieldCode: "ouName",
      fieldType: "TEXT",
      fieldName: $T(`${promptCode}.ouName`).$D("业务实体"),
    },
    {
      fieldCode: "organizationName",
      fieldType: "TEXT",
      fieldName: $T(`${promptCode}.organizationName`).$D("采购组织"),
    },
    {
      fieldCode: "purchaseAgentName",
      fieldType: "TEXT",
      fieldName: $T(`${promptCode}.purchaseAgentName`).$D("采购员"),
    },
    {
      fieldCode: "creationDate",
      fieldType: "TEXT",
      fieldName: $T(`${promptCode}.creationDate`).$D("创建时间"),
    },
    {
      fieldCode: "releasedDate",
      fieldType: "TEXT",
      fieldName: $T(`${promptCode}.releasedDate`).$D("发布时间"),
    },
    // 订单行
    {
      fieldCode: "displayLineNum",
      fieldType: "TEXT",
      fieldName: $T(`${promptCode}.displayLineNum`).$D("订单行号"),
    },
    {
      fieldCode: "itemCode",
      fieldType: "TEXT",
      fieldName: $T(`${promptCode}.itemCode`).$D("物料编码"),
    },
    {
      fieldCode: "itemName",
      fieldType: "TEXT",
      fieldName: $T(`${promptCode}.itemName`).$D("物料名称"),
    },
  ],
  transport: {
    read: {
      url: `/sfin/v1/${tenantId}/payment-advance-lines/${paymentHeaderId}/lines`,
      method: "GET",
    },
  },
});

