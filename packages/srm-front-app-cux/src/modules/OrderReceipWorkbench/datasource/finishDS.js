import { $T, SrmUtil } from "srm-mobile-ui";
// import { getLabelName } from "../_utils/index";

//待收货
function finishDS() {
  return {
    autoQuery: false,
    selection: Infinity,
    pageSize: 10,
    enableQuery: true,
    data: [],
    showTotalCount: true,
    editable:false,
    // editFlag: true,
    queryParameter: { customizeFilterComparison: "itemCode:=,itemName:LIKE,invOrganizationId:=,companyId:=,agentId:=" },
    fields:  [
      {
        fieldCode: "acceptStatusMeaning",
        fieldType: "TEXT",
        fieldName: $T("sinv.receiptExecution.model.receipt.orderTypeName.rcvStatusCodeMeaning").$D("状态"),
      },
      {
        fieldCode: "acceptNum",
        fieldType: "TEXT",
        fieldName: $T("sinv.receiptExecution.model.receipt.rcvTypeName.acceptNum").$D("验收单号"),
      },
      {
        fieldCode: "displaySupplierName",
        fieldType: "TEXT",
        fieldName: $T("sinv.receiptExecution.model.receipt.supplierCompanyName").$D("供应商"),
      },
      {
        fieldCode: "companyName",
        fieldType: "TEXT",
        fieldName: $T("sinv.receipWorkbench.model.receipt.companyName").$D("公司"),
      },
      {
        fieldCode: "displayPoNum",
        fieldType: "TEXT",
        fieldName: $T("scux.acceptBench.model.receipt.orderTypeName.displayPoNum").$D("订单号"),
      },
      {
        fieldCode: "taxIncludeAmount",
        fieldType: "TEXT",
        fieldName: $T("sinv.receiptExecution.model.receipt.taxIncludeAmounts").$D("订单总额"),
      },
      {
        fieldCode: "termMeaning",
        fieldType: "TEXT",
        fieldName: $T("sinv.receiptExecution.model.receipt.termMeaning").$D("付款条款"),
      },
      {
        fieldCode: "stageDesc",
        fieldType: "TEXT",
        fieldName: $T("sinv.receiptExecution.model.receipt.stageDesc").$D("本次验收阶段"),
      },
      {
        fieldCode: "acceptTotalAmount",
        fieldType: "TEXT",
        fieldName: $T("scux.acceptBench.model.receipt.acceptTotalAmount").$D("本次验收金额"),
      },
      {
        fieldCode: "stageTotalAmount",
        fieldType: "TEXT",
        fieldName: $T("scux.acceptBench.model.receipt.stageTotalAmount").$D("阶段总额参考"),
      },
      {
        fieldCode: "creationName",
        fieldType: "TEXT",
        fieldName: $T("sinv.receipWorkbench.model.receipt.creationName").$D("创建人"),
      },
      {
        fieldCode: "unitName",
        fieldName: $T("scux.acceptBench.model.view.unitName").$D("创建人部门"),
      },
      {
        fieldCode: "creationDate",
        fieldType: "DATE_PICKER",
        fieldName: $T("sinv.receiptExecution.model.receipt.creationDateTime").$D("创建时间"),
        timePicker: true,
        editor:false,
      },
      {
        fieldCode: "title",
        fieldType: "TEXT",
        fieldName: $T("scux.acceptBench.model.receipt.orderTypeName.title").$D("验收标题"),
      },
      {
        fieldCode: "currencyCode",
        fieldName: $T("scux.acceptBench.model.view.currencyCode").$D("币种"),
      },
      {
        fieldCode: "acceptTypeCodeMeaning",
        fieldType: "TEXT",
        fieldName: $T("sinv.receiptExecution.model.receipt.acceptTypeCodeMeaning").$D("验收类型"),
      },
      {
        fieldCode: "name",
        fieldName: $T("sinv.receiptExecution.model.receipt.name").$D("审批人"),
      },
      {
        fieldCode: "acceptStageCompleteFlag",
        fieldName: $T("sinv.receiptExecution.model.receipt.acceptStageCompleteFlag").$D("是否阶段完成验收"),
      },
      {
        fieldCode: "totalScore",
        fieldName: $T("sinv.receiptExecution.model.receipt.score").$D("评分汇总"),
      },
      {
        fieldCode: "organizationName",
        fieldName: $T("sinv.receiptExecution.model.receipt.organizationNamees").$D("采购部门"),
      },
      {
        fieldCode: "agentName",
        fieldName: $T("sinv.receiptExecution.model.receipt.agentName").$D("采购员"),
      },
    ],
    fastQueryField:{
      fieldCode: "acceptNum",
      fieldType: "TEXT",
      fieldName: $T("sinv.receiptExecution.model.receipt.rcvTypeName.acceptNum").$D("验收单号"),
    },
    // 查询表单字段
    //查询条件
    queryFields: [
      {
        fieldCode: "acceptStatus",
        fieldType: "SELECT",
        lovCode: "SCUX.LDJT_ACCEPT_STATUS",
        fieldName: $T("scux.acceptBench.model.view.acceptStatus").$D("状态"),
      },
      {
        fieldCode: "acceptNum",
        fieldType: "TEXT",
        fieldName: $T("scux.acceptBench.model.view.acceptNum").$D("单据编号"),
      },
      {
        fieldCode: "companyId",
        fieldType: "LOV",
        lovCode: "SPFM.USER_AUTH.COMPANY",
        fieldName: $T("sinv.receipWorkbench.model.receipt.companyName").$D("公司"),
        options:{
          displayField: "companyName",
          subDisplayField: "companyNum"
        }
      },
      {
        fieldCode: "tempKey",
        fieldType: "LOV",
        lovCode: "SSLM.SUPPLIER_CHOOSE",
        fieldName: $T("sinv.receiptExecution.model.receipt.supplierCompanyName").$D("供应商"),
        options:{
          displayField: "supplierCompanyName",
          subDisplayField: "supplierCompanyNum"
        }
      },
      {
        fieldCode: "totalScoreOpr",
        fieldType: "SELECT",
        fieldName: $T("scux.acceptBench.model.view.totalScoreOpr").$D("评分总额筛选方式"),
        lovCode: "SCUX_LDJT_ACCPET_QUERY_OPR",
        defaultValue: {
          value: "=",
          meaning: $T("scux.acceptBench.model.view.dengyu").$D("等于")
        }
      },
      {
        fieldCode: "totalScore",
        fieldType: "INPUT_NUMBER",
        fieldName: $T("scux.acceptBench.model.view.score").$D("评分汇总"),
      },
      {
        fieldCode: "creationName",
        fieldType: "TEXT",
        fieldName: $T("scux.acceptBench.model.view.creationName").$D("创建人"),
      },
      {
        fieldCode: "currencyCode",
        fieldType: "LOV",
        lovCode: "SMDM.CURRENCY_CODE",
        fieldName: $T("scux.acceptBench.model.view.currencyCode").$D("币种"),
      },
      {
        fieldCode: "creationDateRange",
        endDateFieldCode: "creationDateRange",
        fieldType: "DATE_PICKER",
        selectType: "start-end",
        fieldName: $T("scux.acceptBench.model.view.creationDate").$D("创建时间"),
      },
      {
        fieldCode: "title",
        fieldType: "TEXT",
        fieldName: $T("scux.acceptBench.model.view.title").$D("验收标题"),
      },
      {
        fieldCode: "displayPoNum",
        fieldType: "TEXT",
        fieldName: $T("scux.acceptBench.model.view.displayPoNum").$D("订单号"),
      },
      {
        fieldCode: "termId",
        fieldType: "LOV",
        lovCode: "SMDM.PAYMENT.TERM",
        fieldName: $T("scux.acceptBench.model.view.termIds").$D("付款条款"),
        // options:{
        //   displayField: "companyName",
        //   subDisplayField: "companyNum"
        // }
      },
      {
        fieldCode: "acceptTypeCode",
        fieldType: "SELECT",
        fieldName: $T("scux.acceptBench.model.view.acceptTypeCode").$D("验收类型"),
        lovCode: "SCUX_LDJT_ACCEPT_TYPE",
      },
      {
        fieldCode: "acceptTypeCode",
        fieldType: "SELECT",
        fieldName: $T("scux.acceptBench.model.view.acceptTypeCode").$D("验收类型"),
        lovCode: "HPFM.FLAG",
      },
      {
        fieldCode: "approveEmployeeId",
        fieldType: "LOV",
        lovCode: "HPFM.ON_EMPLOYEE",
        fieldName: $T("scux.acceptBench.model.view.approveEmployeeId").$D("审批人"),
      },
      {
        fieldCode: "stageDesc",
        fieldType: "TEXT",
        fieldName: $T("scux.acceptBench.model.view.stageDesc").$D("本次验收阶段"),
      },
      {
        fieldCode: "unitId",
        fieldType: "LOV",
        lovCode: "SPUC.USER_AUTHORITY_UNIT",
        fieldName: $T("scux.acceptBench.model.view.unitId").$D("创建部门"),
      },
      {
        fieldCode: "taxIncludeAmountOpr",
        fieldType: "SELECT",
        fieldName: $T("scux.acceptBench.model.view.acceptOrderAmountOpr").$D("订单总额筛选方式"),
        lovCode: "SCUX_LDJT_ACCPET_QUERY_OPR",
        defaultValue: {
          value: "=",
          meaning: $T("scux.acceptBench.model.view.dengyu").$D("等于")
        }
      },
      {
        fieldCode: "taxIncludeAmount",
        fieldType: "INPUT_NUMBER",
        fieldName: $T("scux.acceptBench.model.view.taxIncludeAmounts").$D("订单总额"),
      },
      {
        fieldCode: "acceptTotalAmountOpr",
        fieldType: "SELECT",
        fieldName: $T("scux.acceptBench.model.view.acceptTotalAmountOpr").$D("本次验收金额筛选方式"),
        lovCode: "SCUX_LDJT_ACCPET_QUERY_OPR",
        defaultValue: {
          value: "=",
          meaning: $T("scux.acceptBench.model.view.dengyu").$D("等于")
        }
      },
      {
        fieldCode: "acceptTotalAmount",
        fieldType: "INPUT_NUMBER",
        fieldName: $T("scux.acceptBench.model.view.acceptTotalAmount").$D("本次验收金额"),
      },
      {
        fieldCode: "stageTotalAmountOpr",
        fieldType: "SELECT",
        fieldName: $T("scux.acceptBench.model.view.stageTotalAmountOpr").$D("阶段总额参考筛选方式"),
        lovCode: "SCUX_LDJT_ACCPET_QUERY_OPR",
        defaultValue: {
          value: "=",
          meaning: $T("scux.acceptBench.model.view.dengyu").$D("等于")
        }
      },
      {
        fieldCode: "stageTotalAmount",
        fieldType: "INPUT_NUMBER",
        fieldName: $T("scux.acceptBench.model.receipt.stageTotalAmount").$D("阶段总额参考"),
      },
      {
        fieldCode: "purchaseOrgId",
        fieldType: "LOV",
        lovCode: "SPFM.USER_AUTH.PURCHASE_ORG",
        fieldName: $T("scux.acceptBench.model.view.organizationNamees").$D("采购部门"),
      },
      {
        fieldCode: "agentId",
        fieldType: "LOV",
        lovCode: "SPFM.USER_AUTH.PURCHASE_AGENT",
        fieldName: $T("scux.acceptBench.model.view.agentId").$D("采购员"),
      },
    ],
    transport: {
      read: {
        url: `/scux2/v1/${SrmUtil.getTenantId()}/ldjt/all`,
        method: "get",
      },
    },
    events: {
    }
  };
}
export { finishDS };
