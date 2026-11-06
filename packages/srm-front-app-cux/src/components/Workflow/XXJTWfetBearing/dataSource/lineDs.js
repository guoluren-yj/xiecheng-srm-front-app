import { SrmUtil, $T } from "srm-mobile-ui";

function lineInfoDs() {
  return {
    autoQuery: false,
    pageSize: 10,
    editable: false,
    editFlag: false,
    enableQuery: false,
    // pathParameter: {
    //   tenantId: SrmUtil.getTenantId(),
    // },
    fields: [
      {
        fieldCode: "lineNum",
        fieldType: "TEXT",
        fieldName: $T(
          "scux.xxjtWfetBearing.model.xxjtWfetBearing.lineNum"
        ).$D("序号"),
      },
      {
        fieldCode: "bidWinner",
        fieldType: "TEXT",
        fieldName: $T(
          "scux.xxjtWfetBearing.model.xxjtWfetBearing.bidWinner"
        ).$D("中标单位"),
      },
      {
        fieldCode: "bidAmount",
        fieldType: "TEXT",
        fieldName: $T(
          "scux.xxjtWfetBearing.model.xxjtWfetBearing.bidAmount"
        ).$D("中标金额(元)"),
      },
      {
        fieldCode: "oneTimeCharge",
        fieldType: "TEXT",
        fieldName: $T(
          "scux.xxjtWfetBearing.model.xxjtWfetBearing.oneTimeCharge"
        ).$D("服务费金额(元)"),
      },
      {
        fieldCode: "remarks",
        fieldType: "TEXT",
        fieldName: $T(
          "scux.xxjtWfetBearing.model.xxjtWfetBearing.remarks"
        ).$D("备注"),
      },
    ],
    transport: {
      read: {
        url: `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/BUln7A73rne71rqfiaGicM5F4Vh8hMbUxdBfdOC2e6VEq3Je2O4daOIPty0LLia2o3u?bidPreWinReviewId={bidPreWinReviewId}`,
        method: "get",
      },
    },
  };
}

function lineContractDs() {
  return {
    autoQuery: false,
    pageSize: 10,
    editable: false,
    editFlag: false,
    enableQuery: false,
    fields: [
      {
        fieldCode: "lineNum",
        fieldType: "TEXT",
        fieldName: $T(
          "scux.xxjtWfetBearing.model.xxjtWfetBearing.lineNum"
        ).$D("行号"),
      },
      {
        fieldCode: "bidWinner",
        fieldType: "TEXT",
        fieldName: $T(
          "scux.xxjtWfetBearing.model.xxjtWfetBearing.bidWinner"
        ).$D("中标单位"),
      },
      {
        fieldCode: "contractAmount",
        fieldType: "TEXT",
        fieldName: $T(
          "scux.xxjtWfetBearing.model.xxjtWfetBearing.contractAmount"
        ).$D("合同金额（元）"),
      },
      {
        fieldCode: "pcNum",
        fieldType: "TEXT",
        fieldName: $T(
          "scux.xxjtWfetBearing.model.xxjtWfetBearing.pcNum"
        ).$D("合同号"),
      },
      {
        fieldCode: "isNoContract",
        fieldType: "TEXT",
        fieldName: $T(
          "scux.xxjtWfetBearing.model.xxjtWfetBearing.isNoContract"
        ).$D("不签约"),
      },
      {
        fieldCode: "remarks",
        fieldType: "TEXT",
        fieldName: $T(
          "scux.xxjtWfetBearing.model.xxjtWfetBearing.remarks"
        ).$D("备注"),
      },
    ],
    transport: {
      read: {
        url: `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/MEibBxVIEs486GmuxplNx0kyo83H7qLceCVb71ouj4nA?contractReviewId={contractReviewId}`,
        method: "get",
      },
    },
  };
}

function bidLineDs() {
  return {
    autoQuery: false,
    pageSize: 10,
    editable: false,
    editFlag: false,
    enableQuery: false,
    fields: [
      {
        fieldCode: "id",
        fieldType: "TEXT",
      },
      {
        fieldCode: "targetCode",
        fieldType: "TEXT",
        fieldName: $T(
          "scux.xxjtWfetBearing.model.bidApplication.targetCode"
        ).$D("标的编码"),
      },
      {
        fieldCode: "targetName",
        fieldType: "TEXT",
        fieldName: $T(
          "scux.xxjtWfetBearing.model.bidApplication.targetName"
        ).$D("标的名称"),
      },
      {
        fieldCode: "lastFlagMeaning",
        fieldType: "TEXT",
        fieldName: $T(
          "scux.xxjtWfetBearing.model.bidApplication.lastFlag"
        ).$D("是否为末级"),
      },
      {
        fieldCode: "lastUpdateUserMeaning",
        fieldType: "TEXT",
        fieldName: $T(
          "scux.xxjtWfetBearing.model.bidApplication.lastUpdateUserMeaning"
        ).$D("发起人"),
      },
      {
        fieldCode: "enableFlagMeaning",
        fieldType: "TEXT",
        fieldName: $T(
          "scux.xxjtWfetBearing.model.bidApplication.enableFlag"
        ).$D("启用/禁用"),
      },
      {
        fieldCode: "targetStatusMeaning",
        fieldType: "TEXT",
        fieldName: $T(
          "scux.xxjtWfetBearing.model.bidApplication.status"
        ).$D("状态"),
      },
      {
        fieldCode: "approveStatusMeaning",
        fieldType: "TEXT",
        fieldName: $T(
          "scux.xxjtWfetBearing.model.bidApplication.approveStatus"
        ).$D("审批状态"),
      },
      {
        fieldCode: "approvelComment",
        fieldType: "TEXT",
        fieldName: $T(
          "scux.xxjtWfetBearing.model.bidApplication.last.approvelComment"
        ).$D("最新审批意见"),
      },
      {
        fieldCode: "modifyReason",
        fieldType: "TEXT",
        fieldName: $T(
          "scux.xxjtWfetBearing.model.bidApplication.remark"
        ).$D("备注"),
      },
    ],
  };
}

function formLineDs() {
  return {
    autoQuery: false,
    pageSize: 10,
    editable: false,
    editFlag: false,
    enableQuery: false,
    fields: [
      {
        fieldCode: "targetClassMeaning",
        fieldType: "TEXT",
        fieldName: $T(
          "scux.xxjtWfetBearing.model.bidApplication.targetClass"
        ).$D("标的分级"),
      },
      {
        fieldCode: "targetClassScope",
        fieldType: "TEXT",
        fieldName: $T(
          "scux.xxjtWfetBearing.model.bidApplication.targetClassScope"
        ).$D("分级适用范围"),
      },
      {
        fieldCode: "professQualification",
        fieldType: "TEXT",
        fieldName: $T(
          "scux.xxjtWfetBearing.model.bidApplication.professQualification"
        ).$D("专业资质"),
      },
      {
        fieldCode: "lastYearRevenue",
        fieldType: "NUMBER",
        fieldName: $T(
          "scux.xxjtWfetBearing.model.bidApplication.lastYearRevenue"
        ).$D("上年营业收入大于等于(万元)"),
      },
      {
        fieldCode: "achievement",
        fieldType: "TEXT",
        fieldName: $T(
          "scux.xxjtWfetBearing.model.bidApplication.achievement"
        ).$D("近三年业绩数量"),
      },
      {
        fieldCode: "registeredCapital",
        fieldType: "NUMBER",
        fieldName: $T(
          "scux.xxjtWfetBearing.model.bidApplication.registeredCapital"
        ).$D("注册资金(万元)"),
      },
      {
        fieldCode: "industryRanking",
        fieldType: "TEXT",
        fieldName: $T(
          "scux.xxjtWfetBearing.model.bidApplication.industryRanking"
        ).$D("行业排名"),
      },
      {
        fieldCode: "enterpriseNatureMeaning",
        fieldType: "TEXT",
        fieldName: $T(
          "scux.xxjtWfetBearing.model.bidApplication.enterpriseNature"
        ).$D("企业性质"),
      },
      {
        fieldCode: "enterpriseCertificationMeaning",
        fieldType: "TEXT",
        fieldName: $T(
          "scux.xxjtWfetBearing.model.bidApplication.enterpriseCertification"
        ).$D("体系认证"),
      },
    ],
  };
}

export { lineInfoDs, lineContractDs, bidLineDs, formLineDs };
