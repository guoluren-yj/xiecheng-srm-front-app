import { $T, SrmUtil } from "srm-mobile-ui";
// import { isNil } from "lodash";
// 基本信息
function formDs() {
  return {
    autoQuery: false,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    enableQuery: false,
    showTotalCount: false,
    forceValidate: true,
    fields: [
      {
        fieldCode: "serviceFeeSettleNum",
        fieldName: $T("small.common.model.common.cuxserviceFeeSettleNum").$D(
          "服务费结算单号"
        ),
      },
      {
        fieldCode: "associateNum",
        fieldName: $T("small.common.model.common.cuxassociateNum").$D(
          "关联单据号"
        ),
      },
      {
        fieldCode: "title",
        fieldName: $T("small.common.model.common.cuxtitle").$D("标题"),
      },
      {
        fieldCode: "statusMeaning",
        // lookupCode: "SCUX.XXJT.BID_REVIEW_STATUS",
        fieldName: $T("small.common.model.common.cuxstatus").$D("状态"),
      },
      {
        fieldCode: "tendereeMeaning",
        fieldName: $T("small.common.model.common.cuxtendereeMeaning").$D(
          "招标经理"
        ),
      },
      {
        fieldCode: "biddingPlanNum",
        fieldName: $T("small.common.model.common.cuxbiddingPlanNum").$D(
          "招标计划单号"
        ),
      },
      {
        fieldCode: "subjectName",
        fieldName: $T("small.common.model.common.cuxsubjectName").$D(
          "标的名称"
        ),
      },
      {
        fieldCode: "subjectTypeMeaning",
        // lookupCode: "SCUX_XXJT_TARGET_TYPE",
        fieldName: $T("small.common.model.common.cuxsubjectType").$D(
          "标的类型"
        ),
      },
      {
        fieldCode: "projectCompanyIdMeaning",
        fieldName: $T(
          "small.common.model.common.cuxprojectCompanyIdMeaning"
        ).$D("项目公司"),
      },
      // {
      //   fieldCode: "specialSurrenderFlag",
      //   lookupCode: "XXJT_SF",
      //   fieldName: $T("small.common.model.common.cuxspecialSurrenderFlag").$D(
      //     "是否特殊退保"
      //   ),
      // },
      {
        fieldCode: "illustrate",
        fieldName: $T("small.common.model.common.cuxillustrate").$D("说明"),
      },
      {
        fieldCode: "refundSituationMeaning",
        // lookupCode: "SCUX.XXJT.WC_JS_DEPOSIT_STATUS",
        fieldName: $T("small.common.model.common.cuxrefundSituation").$D(
          "中标单位投标保证金退还情况"
        ),
      },
      {
        fieldCode: "serviceFeeCollectionMeaning",
        // lookupCode: "SCUX.XXJT.WC_JS_SERVICE_FEE_STATUS",
        fieldName: $T("small.common.model.common.cuxserviceFeeCollection").$D(
          "服务费收取"
        ),
      },
      {
        fieldCode: "attachmentUuid",
        fieldName: $T("small.common.model.common.cuxxiexinattachmentUuid").$D(
          "支撑性文件"
        ),
      },
    ],
  };
}
function lineDs() {
  return {
    autoQuery: false,
    selection: Infinity,
    pageSize: 100,
    editable: true,
    enableQuery: false,
    showTotalCount: false,
    // 模型字段
    fields: [
      {
        fieldCode: "lineNum",
        fieldName: $T("small.common.model.common.cuxlineNum").$D("行号"),
      },
      {
        fieldCode: "bidWinner",
        fieldName: $T("small.common.model.common.cuxbidWinner").$D("中标单位"),
      },
      {
        fieldCode: "pcNum",
        fieldName: $T("small.common.model.common.cuxpcNum").$D("合同号"),
      },
      {
        fieldCode: "oneTimeChargeFlagMeaning",
        fieldName: $T("small.common.model.common.cuxoneTimeChargeFlag").$D(
          "是否一次性服务费"
        ),
        // lookupCode: "XXJT_SF",
      },
      {
        fieldCode: "pcAmountSum",
        // fieldType: "INPUT_NUMBER",
        fieldName: $T("small.common.model.common.cuxpcAmountSum").$D(
          "累计合同金额"
        ),
      },
      {
        fieldCode: "serviceFeeAmonutSum",
        // fieldType: "INPUT_NUMBER",
        fieldName: $T("small.common.model.common.cuxserviceFeeAmonutSum").$D(
          "累计服务费金额"
        ),
      },
      {
        fieldCode: "isSettledFlagMeaning",
        // lookupCode: "XXJT_SF",
        fieldName: $T("small.common.model.common.cuxisSettledFlag").$D(
          "是否结清"
        ),
      },
    ],
    // transport: {
    //   read: {
    //     url: `/sada/v1/${SrmUtil.getTenantId()}/rel-table-records/scux_srm_xxjt_service_fee_settle_line/page?serviceFeeSettleId={serviceFeeSettleId}`,
    //     method: "post",
    //   },
    // },
  };
}
// 合同
function pcDs() {
  return {
    autoQuery: false,
    selection: Infinity,
    pageSize: 5,
    editable: true,
    enableQuery: false,
    showTotalCount: false,
    // 模型字段
    fields: [
      {
        fieldCode: "lineNum",
        fieldName: $T("small.common.model.common.cuxlineNum").$D("行号"),
      },
      {
        fieldCode: "bidWinner",
        fieldName: $T("small.common.model.common.cuxbidWinner").$D("中标单位"),
      },
      {
        fieldCode: "pcNum",
        fieldName: $T("small.common.model.common.cuxpcNum").$D("合同号"),
      },
      {
        fieldCode: "pcAmount",
        // fieldType: "INPUT_NUMBER",
        fieldName: $T("small.common.model.common.cuxpcAmount").$D("合同金额"),
      },
      {
        fieldCode: "executedAmount",
        // fieldType: "INPUT_NUMBER",
        fieldName: $T("small.common.model.common.cuxexecutedAmount").$D(
          "已执行金额"
        ),
      },
      {
        fieldCode: "poAmount",
        fieldName: $T("small.common.model.common.cuxpoAmount").$D("订单金额"),
      },
      {
        fieldCode: "invoiceAmount",
        fieldName: $T("small.common.model.common.cuxinvoiceAmount").$D(
          "开票金额"
        ),
      },
      {
        fieldCode: "executedTime",
        fieldName: $T("small.common.model.common.cuxexecutedTime").$D(
          "执行时间"
        ),
      },
    ],
    transport: {
      read: {
        url: `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/E5N59LtO05lFnibKaA2tqSwsN2hvgemU9hITHBHZB6cbaWGefT6NKXlzLGvRjibKuztyXtjuHWjiaD7ctCy4tqN7g?serviceFeeSettleId={serviceFeeSettleId}`,
        method: "get",
      },
    },
  };
}

// 操作记录
function opartionDs() {
  return {
    autoQuery: false,
    selection: Infinity,
    pageSize: 5,
    editable: true,
    enableQuery: false,
    showTotalCount: false,
    // 模型字段
    fields: [
      {
        fieldCode: "processUserIdMeaning",
        fieldName: $T("small.common.model.common.cuxprocessUserIdMeaning").$D(
          "操作人"
        ),
      },
      {
        fieldCode: "processDate",
        fieldName: $T("small.common.model.common.cuxxxxprocessDate").$D(
          "操作时间"
        ),
      },
      {
        fieldCode: "processActionMeaning",
        fieldName: $T("small.common.model.common.cuxdz").$D("动作"),
      },
    ],
    transport: {
      read: {
        url: `/sada/v1/${SrmUtil.getTenantId()}/rel-table-records/scux_srm_xxjt_service_fee_settle_action/page?serviceFeeSettleId={serviceFeeSettleId}`,
        method: "post",
      },
    },
  };
}

// 审批记录
function approvalDs() {
  return {
    autoQuery: false,
    selection: Infinity,
    pageSize: 5,
    editable: true,
    enableQuery: false,
    showTotalCount: false,
    // 模型字段
    fields: [
      {
        fieldCode: "startTime",
        fieldName: $T("small.common.model.common.cuxstartTime").$D("审批时间"),
      },
      {
        fieldCode: "nodeStatus",
        fieldName: $T("small.common.model.common.cuxnodeStatus").$D("审批动作"),
      },
      {
        fieldCode: "name",
        fieldName: $T("small.common.model.common.namecux").$D("审批环节"),
      },
      {
        fieldCode: "assigneeName",
        fieldName: $T("small.common.model.common.cuxassigneeName").$D("审批人"),
      },
      {
        fieldCode: "comment",
        fieldName: $T("small.common.model.common.cuxcomment").$D("审批意见"),
      },
    ],
    transport: {
      read: {
        url: `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/E5N59LtO05lFnibKaA2tqSicNUzOdLnO5pyjPnrpUGIy9aOFgOum4kfSjeeoT60nP4?id={serviceFeeSettleId}`,
        method: "get",
      },
    },
  };
}

export { formDs, lineDs, pcDs, opartionDs, approvalDs };
