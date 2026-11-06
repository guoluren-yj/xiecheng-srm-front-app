import { $T, SrmUtil } from "srm-mobile-ui";

function paymentRecordListDS(ticketStates) {
  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    enableQuery: true,
    data: [],
    fastQueryField: {
      fieldCode: "paymentNo",
      fieldType: "TEXT",
      fieldName: $T("spfm.supplierInvoic.model.paymentNo").$D("缴费编号"),
    },
    fields: [ {
      fieldCode: "paymentHeader",
      fieldType: "EMPTY",
      render: (val, item) => <srm-list-header>
        <span>{item.paymentNo}</span>
        <span slot="right" style={{
          color: item.ticketState === "UNINVOICED" ?
            "var(--font-color-disable)" :
            item.ticketState === "INVOICE_TICKET" ? "var(--color-success)" : "var(--color-warn)",
        }}>{item.ticketStateMeaning}</span>
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
      fieldCode: "coreTenantCode",
      fieldType: "TEXT",
      fieldName: $T("spfm.supplierInvoic.model.customerCode").$D("客户编码"),
      visible: () => {
        const userInfo = SrmUtil.getUserInfo();
        return String(SrmUtil.getTenantId()) !== String(userInfo.organizationId);
      },
    }, {
      fieldCode: "coreTenantName",
      fieldType: "TEXT",
      fieldName: $T("spfm.supplierInvoic.model.customerName").$D("客户名称"),
      visible: () => {
        const userInfo = SrmUtil.getUserInfo();
        return String(SrmUtil.getTenantId()) !== String(userInfo.organizationId);
      },
    }, {
      fieldCode: "supplierTenantCode",
      fieldType: "TEXT",
      fieldName: $T("spfm.supplierInvoic.model.supplierCode").$D("供应商编码"),
      visible: () => {
        const userInfo = SrmUtil.getUserInfo();
        return String(SrmUtil.getTenantId()) === String(userInfo.organizationId);
      },
    }, {
      fieldCode: "supplierTenantName",
      fieldType: "TEXT",
      fieldName: $T("spfm.supplierInvoic.model.supplierName").$D("供应商名称"),
      visible: () => {
        const userInfo = SrmUtil.getUserInfo();
        return String(SrmUtil.getTenantId()) === String(userInfo.organizationId);
      },
    }, {
      fieldCode: "paymentFee",
      fieldType: "INPUT_NUMBER",
      editor: false,
      fieldName: $T("spfm.supplierInvoic.model.paymentAmount").$D("缴费金额"),
    }, {
      fieldCode: "paymentDate",
      fieldType: "TEXT",
      fieldName: $T("spfm.supplierInvoic.model.paymentDate").$D("缴费时间"),
    }, {
      fieldCode: "startDate",
      fieldType: "TEXT",
      fieldName: $T("spfm.supplierInvoic.model.startDate").$D("有效期从"),
      render: (val) => SrmUtil.dateFormat(val),
    }, {
      fieldCode: "endDate",
      fieldType: "TEXT",
      fieldName: $T("spfm.supplierInvoic.model.endDate").$D("有效期至"),
      render: (val) => SrmUtil.dateFormat(val),
    }, ],
    // 查询表单字段
    queryFields: [
      {
        fieldCode: "ticketState",
        fieldType: "SELECT",
        fieldName: $T("spfm.supplierInvoic.model.invoicingStatus").$D("开票状态"),
        options: {
          displayField: "meaning",
          valueField: "value",
          listData: ticketStates,
        }
      }, {
        fieldCode: "coreTenantCode",
        fieldType: "LOV",
        fieldName: $T("spfm.supplierInvoic.model.customer").$D("客户"),
        lovCode: "SPFM.PAYMENT_CORE_TENANT_LIST",
        visible: () => {
          const userInfo = SrmUtil.getUserInfo();
          return String(SrmUtil.getTenantId()) !== String(userInfo.organizationId);
        },
        options: {
          valueField: "coreTenantNum"
        }
      }, {
        fieldCode: "supplierTenantCode",
        fieldType: "LOV",
        fieldName: $T("spfm.supplierInvoic.model.supplierName").$D("供应商名称"),
        lovCode: "SPFM.PAYMENT_SUPPLIER_LIST",
        visible: () => {
          const userInfo = SrmUtil.getUserInfo();
          return String(SrmUtil.getTenantId()) === String(userInfo.organizationId);
        },
        options: {
          valueField: "supplierTenantCode"
        }
      }, {
        fieldCode: "paymentDate",
        fieldType: "DATE_PICKER",
        fieldName: $T("spfm.supplierInvoic.model.paymentDate").$D("缴费时间"),
      }, {
        fieldCode: "startDate",
        fieldType: "DATE_PICKER",
        fieldName: $T("spfm.supplierInvoic.model.startDate").$D("有效期从"),
      }, {
        fieldCode: "endDate",
        fieldType: "DATE_PICKER",
        fieldName: $T("spfm.supplierInvoic.model.endDate").$D("有效期至"),
      },
    ],
    transport: {
      read: {
        url: `/spfm/v1/${SrmUtil.getTenantId()}/supplier-payment/purchase-payment-list`,
        method: "get",
      },
    },
  };
}

export default paymentRecordListDS;
