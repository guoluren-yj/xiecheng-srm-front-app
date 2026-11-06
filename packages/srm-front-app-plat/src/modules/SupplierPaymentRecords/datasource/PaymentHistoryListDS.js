// 缴费历史

import { $T, SrmUtil } from "srm-mobile-ui";

function paymentHistoryListDS(coreTenantCode, supplierTenantCode) {
  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    enableQuery: false,
    data: [],
    queryParameter: {
      coreTenantCode,
      supplierTenantCode,
    },
    fields: [ {
      fieldCode: "paymentHeader",
      fieldType: "EMPTY",
      render: (val, item) => <srm-list-header show-open-tag={false}>
        <span>{item.paymentNo}</span>
        <span style={{
          color: item.ticketState === "UNINVOICED" ?
            "var(--font-color-disable)" :
            item.ticketState === "INVOICE_TICKET" ? "var(--color-success)" : "var(--color-warn)",
        }} slot="right">{item.ticketStateMeaning}</span>
      </srm-list-header>,
    }, {
      fieldCode: "paymentNo",
      fieldType: "TEXT",
      fieldName: $T("spfm.supplierInvoic.model.paymentNo").$D("缴费编号"),
    }, {
      fieldCode: "ticketStateMeaning",
      fieldType: "TEXT",
      fieldName: $T("spfm.supplierInvoic.model.ticketState").$D("开票状态"),
    }, {
      fieldCode: "paymentFee",
      fieldType: "INPUT_NUMBER",
      editor: false,
      fieldName: $T("spfm.supplierInvoic.model.paymentAmount").$D("缴费金额"),
    }, {
      fieldCode: "paymentDate",
      fieldType: "TEXT",
      fieldName: $T("spfm.supplierInvoic.model.paymentDate").$D("缴费时间"),
      render: (val) => SrmUtil.dateFormat(val)
    }, {
      fieldCode: "startDate",
      fieldType: "TEXT",
      fieldName: $T("spfm.supplierInvoic.model.activePeriod").$D("有效期"),
      render: (val, item) => `${SrmUtil.dateFormat(val) || "-"} ${$T("spfm.supplierInvoic.view.title.toFlag").$D("至")} ${SrmUtil.dateFormat(item.endDate) || "-"}`,
    }, ],
    transport: {
      read: {
        url: `/spfm/v1/${SrmUtil.getTenantId()}/supplier-payment/payment-list`,
        method: "get",
      },
    },
  };
}

export default paymentHistoryListDS;