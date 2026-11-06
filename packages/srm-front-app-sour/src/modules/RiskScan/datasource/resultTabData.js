import { $T } from "srm-mobile-ui";

export function getResultTab() {
  return [
    {
      id: 18,
      title: $T("sdat.riskScanReport.view.title.industrialChanges").$D(
        "工商变更风险-工商变更"
      ),
      url: "/change-records",
      fields: [
        {
          fieldName: "serialNo",
          label: $T("hzero.common.view.serialNumber").$D("序号"),
        },
        {
          fieldName: "riskLevel",
          label: $T("sdat.riskScanReport.view.title.riskLevel").$D("风险等级"),
        },
        {
          fieldName: "stdType",
          label: $T("sdat.riskScanReport.view.title.changeType").$D("变更类型"),
        },
        {
          fieldName: "stdChangeDate",
          label: $T("sdat.riskScanReport.view.title.changeDate").$D("变更日期"),
        },
        {
          fieldName: "stdChangeItem",
          label: $T("sdat.riskScanReport.view.title.changeItem").$D("变更项目"),
        },
        {
          fieldName: "stdBeforeContent",
          label: $T("sdat.riskScanReport.view.title.beforeChange").$D(
            "变更前内容"
          ),
        },
        {
          fieldName: "stdAfterContent",
          label: $T("sdat.riskScanReport.view.title.afterChange").$D(
            "变更后内容"
          ),
        },
      ],
    },

    {
      id: 5,
      title: $T("sdat.riskScanReport.view.title.openingAnnouncement").$D(
        "司法风险-开庭公告"
      ),
      url: "/court-notice",
      fields: [
        {
          fieldName: "serialNo",
          label: $T("hzero.common.view.serialNumber").$D("序号"),
        },
        {
          fieldName: "riskLevel",
          label: $T("sdat.riskScanReport.view.title.riskLevel").$D("风险等级"),
        },
        {
          fieldName: "stdHearingDate",
          label: $T("sdat.riskScanReport.view.title.courtDate").$D("开庭日期"),
        },
        {
          fieldName: "stdCaseNo",
          label: $T("sdat.riskScanReport.view.title.caseNo").$D("案号"),
        },
        {
          fieldName: "stdCaseReason",
          label: $T("sdat.riskScanReport.view.title.causeAction").$D("案由"),
        },
        {
          fieldName: "stdPlaintiff",
          label: $T("sdat.riskScanReport.view.title.plaintiff").$D(
            "上诉人，原告"
          ),
        },
        {
          fieldName: "stdDefendant",
          label: $T("sdat.riskScanReport.view.title.$Defendant").$D(
            "被上诉人，被告"
          ),
        },
        {
          fieldName: "stdPureRole",
          label: $T("sdat.riskScanReport.view.title.partyIdentity").$D(
            "当事人身份"
          ),
        },
        {
          fieldName: "stdCourt",
          label: $T("sdat.riskScanReport.view.title.court").$D("法院"),
        },
      ],
    },

    {
      id: 3,
      title: $T("sdat.riskScanReport.view.title.judicialAnnouncement").$D(
        "司法风险-法院公告"
      ),
      url: "/notice-list",
      fields: [
        {
          fieldName: "serialNo",
          label: $T("hzero.common.view.serialNumber").$D("序号"),
        },
        {
          fieldName: "riskLevel",
          label: $T("sdat.riskScanReport.view.title.riskLevel").$D("风险等级"),
        },
        {
          fieldName: "stdDate",
          label: $T("sdat.riskScanReport.view.title.publishDate").$D(
            "发布日期"
          ),
        },
        {
          fieldName: "stdType",
          label: $T("sdat.riskScanReport.view.title.announcementType").$D(
            "公告类型"
          ),
        },
        {
          fieldName: "stdCourt",
          label: $T("sdat.riskScanReport.view.title.court").$D("法院"),
        },
        {
          fieldName: "stdContent",
          label: $T("sdat.riskScanReport.view.title.content").$D("内容"),
        },
        {
          fieldName: "stdPerson",
          label: $T("sdat.riskScanReport.view.title.party").$D("当事人"),
        },
      ],
    },

    {
      id: 1,
      title: $T("sdat.riskScanReport.view.title.judicialFilingInfo").$D(
        "司法风险-立案信息"
      ),
      url: "/case-detail",
      fields: [
        {
          fieldName: "serialNo",
          label: $T("hzero.common.view.serialNumber").$D("序号"),
        },
        {
          fieldName: "riskLevel",
          label: $T("sdat.riskScanReport.view.title.riskLevel").$D("风险等级"),
        },
        {
          fieldName: "stdStartDate",
          label: $T("sdat.riskScanReport.view.title.caseFilingTime").$D(
            "立案时间"
          ),
        },
        {
          fieldName: "stdCaseNo",
          label: $T("sdat.riskScanReport.view.title.caseNo").$D("案号"),
        },
        {
          fieldName: "stdCaseCause",
          label: $T("sdat.riskScanReport.view.title.causeAction").$D("案由"),
        },
        {
          fieldName: "stdRolePlaintiff",
          label: $T("sdat.riskScanReport.view.title.plaintiff").$D(
            "上诉人，原告"
          ),
        },
        {
          fieldName: "stdRoleDefendant",
          label: $T("sdat.riskScanReport.view.title.$Defendant").$D(
            "被上诉人，被告"
          ),
        },
        {
          fieldName: "stdRoleOther",
          label: $T("sdat.riskScanReport.view.title.other").$D("其他"),
        },
        {
          fieldName: "stdCourt",
          label: $T("sdat.riskScanReport.view.title.court").$D("法院"),
        },
        {
          fieldName: "stdCaseStatus",
          label: $T("sdat.riskScanReport.view.title.caseStatus").$D("案件状态"),
        },
      ],
    },

    {
      id: 2,
      title: $T("sdat.riskScanReport.view.title.judicialCase").$D(
        "司法风险-终本案件"
      ),
      url: "/termination-case",
      fields: [
        {
          fieldName: "serialNo",
          label: $T("hzero.common.view.serialNumber").$D("序号"),
        },
        {
          fieldName: "riskLevel",
          label: $T("sdat.riskScanReport.view.title.riskLevel").$D("风险等级"),
        },
        {
          fieldName: "stdFilingDate",
          label: $T("sdat.riskScanReport.view.title.filingDate").$D("立案日期"),
        },
        {
          fieldName: "stdTerminateDate",
          label: $T("sdat.riskScanReport.view.title.finalDate").$D("终本日期"),
        },
        {
          fieldName: "stdCaseNoTerminal",
          label: $T("sdat.riskScanReport.view.title.executionNo").$D(
            "执行案号"
          ),
        },
        {
          fieldName: "stdCaseNoOrigin",
          label: $T("sdat.riskScanReport.view.title.accordingNo").$D(
            "执行依据案号"
          ),
        },
        {
          fieldName: "stdAmount",
          label: $T("sdat.riskScanReport.view.title.executionTarget").$D(
            "执行标的"
          ),
        },
        {
          fieldName: "stdFailPerformAmount",
          label: $T("sdat.riskScanReport.view.title.unfulfilledAmount").$D(
            "未履行金额"
          ),
        },
        {
          fieldName: "stdCourt",
          label: $T("sdat.riskScanReport.view.title.executionCourt").$D(
            "执行法院"
          ),
        },
        {
          fieldName: "stdStatus",
          label: $T("sdat.riskScanReport.view.title.status").$D("状态"),
        },
      ],
    },

    {
      id: 4,
      title: $T("sdat.riskScanReport.view.title.judicialCompany").$D(
        "司法风险-被执行企业"
      ),
      url: "/executed-person-list",
      fields: [
        {
          fieldName: "serialNo",
          label: $T("hzero.common.view.serialNumber").$D("序号"),
        },
        {
          fieldName: "riskLevel",
          label: $T("sdat.riskScanReport.view.title.riskLevel").$D("风险等级"),
        },
        {
          fieldName: "stdCaseDate",
          label: $T("sdat.riskScanReport.view.title.filingDate").$D("立案日期"),
        },
        {
          fieldName: "stdCaseNumber",
          label: $T("sdat.riskScanReport.view.title.$DocumentNumber").$D(
            "执行依据文号"
          ),
        },
        {
          fieldName: "stdAmount",
          label: $T("sdat.riskScanReport.view.title.executionAmount").$D(
            "执行金额"
          ),
        },
        {
          fieldName: "stdCourt",
          label: $T("sdat.riskScanReport.view.title.executionCourt").$D(
            "执行法院"
          ),
        },
        {
          fieldName: "stdStatus",
          label: $T("sdat.riskScanReport.view.title.executionStatus").$D(
            "执行状态"
          ),
        },
      ],
    },

    {
      id: 6,
      title: $T("sdat.riskScanReport.view.title.enterprisesDishonesty").$D(
        "司法风险-失信被执行企业"
      ),
      url: "/execution-list",
      fields: [
        {
          fieldName: "serialNo",
          label: $T("hzero.common.view.serialNumber").$D("序号"),
        },
        {
          fieldName: "riskLevel",
          label: $T("sdat.riskScanReport.view.title.riskLevel").$D("风险等级"),
        },
        {
          fieldName: "stdDate",
          label: $T("sdat.riskScanReport.view.title.caseFilingTime").$D(
            "立案时间"
          ),
        },
        {
          fieldName: "stdDocNumber",
          label: $T("sdat.riskScanReport.view.title.$DocumentNumber").$D(
            "执行依据文号"
          ),
        },
        {
          fieldName: "stdCaseNumber",
          label: $T("sdat.riskScanReport.view.title.caseNo").$D("案号"),
        },
        {
          fieldName: "stdExecutionDesc",
          label: $T("sdat.riskScanReport.view.title.specificSituation").$D(
            "失信被执行人行为具体情形"
          ),
        },
        {
          fieldName: "stdAmount",
          label: $T("sdat.riskScanReport.view.title.executionTarget").$D(
            "执行标的"
          ),
        },
        {
          fieldName: "stdCourt",
          label: $T("sdat.riskScanReport.view.title.executionCourt").$D(
            "执行法院"
          ),
        },
        {
          fieldName: "stdExecutionStatus",
          label: $T("sdat.riskScanReport.view.title.performance").$D(
            "被执行人履行情况"
          ),
        },
      ],
    },

    {
      id: 22,
      title: $T("sdat.riskScanReport.view.title.judgmentDocuments").$D(
        "司法风险-裁判文书"
      ),
      url: "/judgment-document",
      fields: [
        {
          fieldName: "serialNo",
          label: $T("hzero.common.view.serialNumber").$D("序号"),
        },
        {
          fieldName: "riskLevel",
          label: $T("sdat.riskScanReport.view.title.riskLevel").$D("风险等级"),
        },
        {
          fieldName: "stdDate",
          label: $T("sdat.riskScanReport.view.title.judgmentDate").$D(
            "判决日期"
          ),
        },
        {
          fieldName: "stdCaseNo",
          label: $T("sdat.riskScanReport.view.title.caseNo").$D("案号"),
        },
        {
          fieldName: "stdCaseCause",
          label: $T("sdat.riskScanReport.view.title.causeAction").$D("案由"),
        },
        {
          fieldName: "stdRole",
          label: $T("sdat.riskScanReport.view.title.roleStr").$D("角色"),
        },
        {
          fieldName: "stdCourt",
          label: $T("sdat.riskScanReport.view.title.court").$D("法院"),
        },
        {
          fieldName: "stdTitle",
          label: $T("sdat.riskScanReport.view.title.title").$D("标题"),
        },
        {
          fieldName: "stdSubAmount",
          label: $T("sdat.riskScanReport.view.title.judgmentAmount").$D(
            "判决金额"
          ),
        },
        {
          fieldName: "stdVerdictType",
          label: $T("sdat.riskScanReport.view.title.judgmentType").$D(
            "判决书类型"
          ),
        },
      ],
    },

    {
      id: 23,
      title: $T("sdat.riskScanReport.view.title.highConsumption").$D(
        "司法风险-限制高消费"
      ),
      url: "/restricted-consumer",
      fields: [
        {
          fieldName: "serialNo",
          label: $T("hzero.common.view.serialNumber").$D("序号"),
        },
        {
          fieldName: "riskLevel",
          label: $T("sdat.riskScanReport.view.title.riskLevel").$D("风险等级"),
        },
        {
          fieldName: "stdFilingDate",
          label: $T("sdat.riskScanReport.view.title.filingDate").$D("立案日期"),
        },
        {
          fieldName: "stdCaseNo",
          label: $T("sdat.riskScanReport.view.title.caseNo").$D("案号"),
        },
        {
          fieldName: "stdCaseReason",
          label: $T("sdat.riskScanReport.view.title.causeAction").$D("案由"),
        },
        {
          fieldName: "stdCourt",
          label: $T("sdat.riskScanReport.view.title.court").$D("法院"),
        },
        {
          fieldName: "stdName",
          label: $T("sdat.riskScanReport.view.title.restrictSpenders").$D(
            "限制高消费人"
          ),
        },
        {
          fieldName: "stdContent",
          label: $T("sdat.riskScanReport.view.title.mainText").$D("限消正文"),
        },
      ],
    },

    {
      id: 16,
      title: $T("sdat.riskScanReport.view.title.equityFreeze").$D(
        "经营风险-股权冻结"
      ),
      url: "/judicial-freeze",
      fields: [
        {
          fieldName: "serialNo",
          label: $T("hzero.common.view.serialNumber").$D("序号"),
        },
        {
          fieldName: "riskLevel",
          label: $T("sdat.riskScanReport.view.title.riskLevel").$D("风险等级"),
        },
        {
          fieldName: "stdPublicDate",
          label: $T("sdat.riskScanReport.view.title.announcementDate").$D(
            "公示日期"
          ),
        },
        {
          fieldName: "stdNumber",
          label: $T("sdat.riskScanReport.view.title.execuDocNo").$D(
            "执行通知书文号"
          ),
        },
        {
          fieldName: "stdAmount",
          label: $T("sdat.riskScanReport.view.title.equityAmount").$D(
            "股权数额"
          ),
        },
        {
          fieldName: "stdFreezeStartDate",
          label: $T("sdat.riskScanReport.view.title.freezeStartDate").$D(
            "冻结开始日期"
          ),
        },
        {
          fieldName: "stdFreezeYearMonth",
          label: $T("sdat.riskScanReport.view.title.freezePeriod").$D(
            "冻结期限（月）"
          ),
        },
        {
          fieldName: "stdObjName",
          label: $T("sdat.riskScanReport.view.title.targetParty").$D("标的方"),
        },
        {
          fieldName: "stdStatus",
          label: $T("sdat.riskScanReport.view.title.status").$D("状态"),
        },
      ],
    },

    {
      id: 13,
      title: $T("sdat.riskScanReport.view.title.protectionPenalties").$D(
        "经营风险-环保处罚"
      ),
      url: "/ep-list",
      fields: [
        {
          fieldName: "serialNo",
          label: $T("hzero.common.view.serialNumber").$D("序号"),
        },
        {
          fieldName: "riskLevel",
          label: $T("sdat.riskScanReport.view.title.riskLevel").$D("风险等级"),
        },
        {
          fieldName: "stdPunishmentDate",
          label: $T("sdat.riskScanReport.view.title.punishmentDate").$D(
            "处罚日期"
          ),
        },
        {
          fieldName: "stdDocumentNo",
          label: $T("sdat.riskScanReport.view.title.$DocumentNo").$D("文书号"),
        },
        {
          fieldName: "stdPunishmentType",
          label: $T("sdat.riskScanReport.view.title.punishmentType").$D(
            "环保处罚类型"
          ),
        },
        {
          fieldName: "stdPunishAmnt",
          label: $T("sdat.riskScanReport.view.title.punishmentAmount").$D(
            "处罚金额"
          ),
        },
        {
          fieldName: "stdPunishmentDept",
          label: $T("sdat.riskScanReport.view.title.penaltyUnit").$D(
            "处罚单位"
          ),
        },
        {
          fieldName: "stdPunishmentBasis",
          label: $T("sdat.riskScanReport.view.title.penaltyReason").$D(
            "处罚依据"
          ),
        },
        {
          fieldName: "stdPunishmentResult",
          label: $T("sdat.riskScanReport.view.title.penaltyCommon").$D(
            "处罚措施"
          ),
        },
      ],
    },

    {
      id: 11,
      title: $T("sdat.riskScanReport.view.title.arrearsInfo").$D(
        "经营风险-欠税信息"
      ),
      url: "/over-due-tax",
      fields: [
        {
          fieldName: "serialNo",
          label: $T("hzero.common.view.serialNumber").$D("序号"),
        },
        {
          fieldName: "riskLevel",
          label: $T("sdat.riskScanReport.view.title.riskLevel").$D("风险等级"),
        },
        {
          fieldName: "stdPubDate",
          label: $T("sdat.riskScanReport.view.title.publishDate").$D(
            "发布日期"
          ),
        },
        {
          fieldName: "stdPubDepartment",
          label: $T("sdat.riskScanReport.view.title.issued").$D("发布单位"),
        },
        {
          fieldName: "stdOverdueType",
          label: $T("sdat.riskScanReport.view.title.taxesArrears").$D(
            "欠税税种"
          ),
        },
        {
          fieldName: "stdOverdueAmount",
          label: $T("sdat.riskScanReport.view.title.taxesAmount").$D(
            "欠税余额"
          ),
        },
        {
          fieldName: "stdCurrOverdueAmount",
          label: $T("sdat.riskScanReport.view.title.happenTaxesAmount").$D(
            "当前发生的欠税余额"
          ),
        },
        {
          fieldName: "stdOverduePeriod",
          label: $T("sdat.riskScanReport.view.title.arrearsPeriod").$D(
            "欠税所属期"
          ),
        },
      ],
    },

    {
      id: 12,
      title: $T("sdat.riskScanReport.view.title.operaPledge").$D(
        "经营风险-股权出质"
      ),
      url: "/equity-qualities",
      fields: [
        {
          fieldName: "serialNo",
          label: $T("hzero.common.view.serialNumber").$D("序号"),
        },
        {
          fieldName: "riskLevel",
          label: $T("sdat.riskScanReport.view.title.riskLevel").$D("风险等级"),
        },
        {
          fieldName: "stdDate",
          label: $T("sdat.riskScanReport.view.title.regisDate").$D("登记日期"),
        },
        {
          fieldName: "stdPledgor",
          label: $T("sdat.riskScanReport.view.title.pledgor").$D("出质人"),
        },
        {
          fieldName: "stdPledgorAmount",
          label: $T("sdat.riskScanReport.view.title.sharesNumber").$D(
            "出质股权数"
          ),
        },
        {
          fieldName: "stdPawnee",
          label: $T("sdat.riskScanReport.view.title.pledgee").$D("质权人"),
        },
        {
          fieldName: "stdStatus",
          label: $T("sdat.riskScanReport.view.title.status").$D("状态"),
        },
      ],
    },

    {
      id: 0,
      title: $T("sdat.riskScanReport.view.title.businessViolations").$D(
        "经营风险-重大税收违法"
      ),
      url: "/tax-case",
      fields: [
        {
          fieldName: "serialNo",
          label: $T("hzero.common.view.serialNumber").$D("序号"),
        },
        {
          fieldName: "riskLevel",
          label: $T("sdat.riskScanReport.view.title.riskLevel").$D("风险等级"),
        },
        {
          fieldName: "stdTime",
          label: $T("sdat.riskScanReport.view.title.occurrenceTime").$D(
            "发生时间"
          ),
        },
        {
          fieldName: "stdProperty",
          label: $T("sdat.riskScanReport.view.title.caseNature").$D("案件性质"),
        },
        {
          fieldName: "stdIllegalFact",
          label: $T("sdat.riskScanReport.view.title.illegalFacts").$D(
            "主要违法事实"
          ),
        },
        {
          fieldName: "stdResult",
          label: $T("sdat.riskScanReport.view.title.punishment").$D(
            "相关法律依据及,税务处理处罚情况"
          ),
        },
        {
          fieldName: "stdFinanceOfficer",
          label: $T("sdat.riskScanReport.view.title.financialManager").$D(
            "负有直接责任的财务负责人"
          ),
        },
        {
          fieldName: "stdUpdatedTime",
          label: $T("sdat.riskScanReport.view.title.updateTime").$D("更新时间"),
        },
      ],
    },

    {
      id: 7,
      title: $T("sdat.riskScanReport.view.title.businessPenalties").$D(
        "经营风险-行政处罚"
      ),
      url: "/admin-punish",
      fields: [
        {
          fieldName: "serialNo",
          label: $T("hzero.common.view.serialNumber").$D("序号"),
        },
        {
          fieldName: "riskLevel",
          label: $T("sdat.riskScanReport.view.title.riskLevel").$D("风险等级"),
        },
        {
          fieldName: "stdDate",
          label: $T("sdat.riskScanReport.view.title.punishmentDate").$D(
            "处罚日期"
          ),
        },
        {
          fieldName: "stdNumber",
          label: $T("sdat.riskScanReport.view.title.$DetermineNo").$D(
            "决定书文号"
          ),
        },
        {
          fieldName: "stdIllegalType",
          label: $T("sdat.riskScanReport.view.title.illegalType").$D(
            "违法行为类型"
          ),
        },
        {
          fieldName: "stdContent",
          label: $T("sdat.riskScanReport.view.title.penaltyContent").$D(
            "行政处罚内容"
          ),
        },
        {
          fieldName: "stdDepartment",
          label: $T("sdat.riskScanReport.view.title.makingAuthority").$D(
            "决定机关名称"
          ),
        },
        {
          fieldName: "stdDate",
          label: $T("sdat.riskScanReport.view.title.penaltyDecisionDate").$D(
            "处罚决定日期"
          ),
        },
        {
          fieldName: "stdPunishAmnt",
          label: $T("sdat.riskScanReport.view.title.penalty").$D(
            "罚款金额(万元)"
          ),
        },
      ],
    },

    {
      id: 8,
      title: $T("sdat.riskScanReport.view.title.businessAbnormality").$D(
        "经营风险-经营异常"
      ),
      url: "/abnormal",
      fields: [
        {
          fieldName: "serialNo",
          label: $T("hzero.common.view.serialNumber").$D("序号"),
        },
        {
          fieldName: "riskLevel",
          label: $T("sdat.riskScanReport.view.title.riskLevel").$D("风险等级"),
        },
        {
          fieldName: "stdInDate",
          label: $T("sdat.riskScanReport.view.title.inTime").$D("列入时间"),
        },
        {
          fieldName: "stdInReason",
          label: $T("sdat.riskScanReport.view.title.inclusionReason").$D(
            "列入原因"
          ),
        },
        {
          fieldName: "stdInDepartment",
          label: $T("sdat.riskScanReport.view.title.inMakingAuthority").$D(
            "列入异常做出决定机关"
          ),
        },
        {
          fieldName: "stdOutDate",
          label: $T("sdat.riskScanReport.view.title.outTime").$D("移出时间"),
        },
        {
          fieldName: "stdOutReason",
          label: $T("sdat.riskScanReport.view.title.removalReason").$D(
            "移出原因"
          ),
        },
        {
          fieldName: "stdOutDepartment",
          label: $T("sdat.riskScanReport.view.title.outMakingAuthority").$D(
            "移出异常做出决定机关"
          ),
        },
      ],
    },

    {
      id: 15,
      title: $T("sdat.riskScanReport.view.title.chattelMortgage").$D(
        "经营风险-动产抵押"
      ),
      url: "/mortgages",
      fields: [
        {
          fieldName: "serialNo",
          label: $T("hzero.common.view.serialNumber").$D("序号"),
        },
        {
          fieldName: "riskLevel",
          label: $T("sdat.riskScanReport.view.title.riskLevel").$D("风险等级"),
        },
        {
          fieldName: "stdDate",
          label: $T("sdat.riskScanReport.view.title.regisDate").$D("登记日期"),
        },
        {
          fieldName: "stdNumber",
          label: $T("sdat.riskScanReport.view.title.regisNo").$D("登记编号"),
        },
        {
          fieldName: "stdDepartment",
          label: $T("sdat.riskScanReport.view.title.regisAuthority").$D(
            "登记机关"
          ),
        },
        {
          fieldName: "stdDebitScope",
          label: $T("sdat.riskScanReport.view.title.guaranteeScope").$D(
            "担保范围"
          ),
        },
        {
          fieldName: "stdAmount",
          label: $T("sdat.riskScanReport.view.title.guaranteeAmount").$D(
            "被担保债权数额"
          ),
        },
        {
          fieldName: "stdDebitType",
          label: $T("sdat.riskScanReport.view.title.guaranteeType").$D(
            "被担保债券种类"
          ),
        },
        {
          fieldName: "stdStatus",
          label: $T("sdat.riskScanReport.view.title.status").$D("状态"),
        },
        {
          fieldName: "stdDebitPeriod",
          label: $T("sdat.riskScanReport.view.title.guaranteePeriod").$D(
            "担保期限"
          ),
        },
      ],
    },

    {
      id: 9,
      title: $T("sdat.riskScanReport.view.title.businessLaws").$D(
        "经营风险-严重违法"
      ),
      url: "/serious-illegal",
      fields: [
        {
          fieldName: "serialNo",
          label: $T("hzero.common.view.serialNumber").$D("序号"),
        },
        {
          fieldName: "riskLevel",
          label: $T("sdat.riskScanReport.view.title.riskLevel").$D("风险等级"),
        },
        {
          fieldName: "stdInDate",
          label: $T("sdat.riskScanReport.view.title.inTime").$D("列入时间"),
        },
        {
          fieldName: "stdInReason",
          label: $T("sdat.riskScanReport.view.title.inclusionReason").$D(
            "列入原因"
          ),
        },
        {
          fieldName: "stdInDepartment",
          label: $T("sdat.riskScanReport.view.title.inMakingAuthority").$D(
            "列入异常做出决定机关"
          ),
        },
        {
          fieldName: "stdOutDate",
          label: $T("sdat.riskScanReport.view.title.outTime").$D("移出时间"),
        },
        {
          fieldName: "stdOutReason",
          label: $T("sdat.riskScanReport.view.title.removalReason").$D(
            "移出原因"
          ),
        },
        {
          fieldName: "stdOutDepartment",
          label: $T("sdat.riskScanReport.view.title.outMakingAuthority").$D(
            "移出异常做出决定机关"
          ),
        },
      ],
    },

    {
      id: 14,
      title: $T("sdat.riskScanReport.view.title.bankruptcy").$D(
        "经营风险-破产公告"
      ),
      url: "/bankruptcy-list",
      fields: [
        {
          fieldName: "serialNo",
          label: $T("hzero.common.view.serialNumber").$D("序号"),
        },
        {
          fieldName: "riskLevel",
          label: $T("sdat.riskScanReport.view.title.riskLevel").$D("风险等级"),
        },
        {
          fieldName: "stdPubDate",
          label: $T("sdat.riskScanReport.view.title.publicTime").$D("公开时间"),
        },
        {
          fieldName: "stdCaseTitle",
          label: $T("sdat.riskScanReport.view.title.caseTitle").$D("案件标题"),
        },
        {
          fieldName: "stdCaseNo",
          label: $T("sdat.riskScanReport.view.title.caseNo").$D("案号"),
        },
        {
          fieldName: "stdAppName",
          label: $T("sdat.riskScanReport.view.title.applicant").$D("申请人"),
        },
        {
          fieldName: "stdName",
          label: $T("sdat.riskScanReport.view.title.respondent").$D("被申请人"),
        },
        {
          fieldName: "stdCaseKind",
          label: $T("sdat.riskScanReport.view.title.caseType").$D("案件类型"),
        },
        {
          fieldName: "stdCourt",
          label: $T("sdat.riskScanReport.view.title.court").$D("法院"),
        },
        {
          fieldName: "stdContent",
          label: $T("sdat.riskScanReport.view.title.comment").$D("正文"),
        },
      ],
    },

    {
      id: 19,
      title: $T("sdat.riskScanReport.view.title.certifications").$D(
        "经营风险-资质证书"
      ),
      url: "/certificate",
      fields: [
        {
          fieldName: "serialNo",
          label: $T("hzero.common.view.serialNumber").$D("序号"),
        },
        {
          fieldName: "riskLevel",
          label: $T("sdat.riskScanReport.view.title.riskLevel").$D("风险等级"),
        },
        {
          fieldName: "stdNum",
          label: $T("sdat.riskScanReport.view.title.certificateNo").$D(
            "证书编号"
          ),
        },
        {
          fieldName: "stdType",
          label: $T("sdat.riskScanReport.view.title.certificateType").$D(
            "资质证书类型"
          ),
        },
        {
          fieldName: "stdIssueDate",
          label: $T("sdat.riskScanReport.view.title.issuingTime").$D(
            "发证时间"
          ),
        },
        {
          fieldName: "stdValidityEnd",
          label: $T("sdat.riskScanReport.view.title.validEndDate").$D(
            "截止时间"
          ),
        },
        {
          fieldName: "stdExpireStatus",
          label: $T("sdat.riskScanReport.view.title.status").$D("状态"),
        },
        {
          fieldName: "stdRemarks",
          label: $T("sdat.riskScanReport.view.title.$Description").$D("备注"),
        },
      ],
    },

    {
      id: 20,
      title: $T("sdat.riskScanReport.view.title.equityPledge").$D(
        "经营风险-股权质押"
      ),
      url: "/stock-pledge",
      fields: [
        {
          fieldName: "serialNo",
          label: $T("hzero.common.view.serialNumber").$D("序号"),
        },
        {
          fieldName: "riskLevel",
          label: $T("sdat.riskScanReport.view.title.riskLevel").$D("风险等级"),
        },
        {
          fieldName: "stdShareholderName",
          label: $T("sdat.riskScanReport.view.title.shareholderName").$D(
            "股东名称"
          ),
        },
        {
          fieldName: "stdNoticeDate",
          label: $T("sdat.riskScanReport.view.title.announDate").$D("公告日期"),
        },
        {
          fieldName: "stdSharesNum",
          label: $T("sdat.riskScanReport.view.title.sharesCount").$D(
            "所持股数"
          ),
        },
        // {
        //   fieldName: 'stdShareholderCode',
        //   label: $T('sdat.riskScanReport.view.title.shareholderCode').$D('股东代码'),
        // },
        {
          fieldName: "stdInvAmount",
          label: $T("sdat.riskScanReport.view.title.amountInvolved").$D(
            "涉及金额"
          ),
        },
        {
          fieldName: "stdFallingClosingLine",
          label: $T("sdat.riskScanReport.view.title.isTouches").$D(
            "是否触及/跌破平仓线"
          ),
        },
        {
          fieldName: "stdFrozenSharesNum",
          label: $T("sdat.riskScanReport.view.title.pledgedCount").$D(
            "质押/冻结股数"
          ),
        },
      ],
    },

    {
      id: 21,
      title: $T("sdat.riskScanReport.view.title.officialBlacklist").$D(
        "经营风险-官方黑名单"
      ),
      url: "/external-blacklist",
      fields: [
        {
          fieldName: "serialNo",
          label: $T("hzero.common.view.serialNumber").$D("序号"),
        },
        {
          fieldName: "riskLevel",
          label: $T("sdat.riskScanReport.view.title.riskLevel").$D("风险等级"),
        },
        {
          fieldName: "stdBlacklistType",
          label: $T("sdat.riskScanReport.view.title.blackType").$D(
            "黑名单类型"
          ),
        },
        {
          fieldName: "stdMaintainDepartment",
          label: $T(
            "sdat.riskScanReport.view.title.certificationDepartment"
          ).$D("认定部门"),
        },
        {
          fieldName: "stdBlacklistBasis",
          label: $T("sdat.riskScanReport.view.title.blackDeterBasis").$D(
            "黑名单认定依据"
          ),
        },
        {
          fieldName: "stdInListsDate",
          label: $T("sdat.riskScanReport.view.title.blacklistedDate").$D(
            "列入黑名单日期"
          ),
        },
        {
          fieldName: "stdOutListsDate",
          label: $T("sdat.riskScanReport.view.title.removalDate").$D(
            "移除黑名单日期"
          ),
        },
        {
          fieldName: "stdPunishmentResult",
          label: $T("sdat.riskScanReport.view.title.penaltyResult").$D(
            "处罚结果"
          ),
        },
        {
          fieldName: "stdDetails",
          label: $T("sdat.riskScanReport.view.title.$Dishonesty").$D(
            "失信情形"
          ),
        },
      ],
    },

    {
      id: 17,
      title: $T("sdat.riskScanReport.view.title.badNews").$D(
        "经营风险-负面新闻"
      ),
      url: "/negative-news",
      fields: [
        {
          fieldName: "serialNo",
          label: $T("hzero.common.view.serialNumber").$D("序号"),
        },
        {
          fieldName: "riskLevel",
          label: $T("sdat.riskScanReport.view.title.riskLevel").$D("风险等级"),
        },
        {
          fieldName: "stdTime",
          label: $T("sdat.riskScanReport.view.title.publishDate").$D(
            "发布日期"
          ),
        },
        {
          fieldName: "stdTitle",
          label: $T("sdat.riskScanReport.view.title.title").$D("标题"),
        },
        {
          fieldName: "stdContent",
          label: $T("sdat.riskScanReport.view.title.easyComment").$D("简介"),
        },
        {
          fieldName: "stdTag",
          label: $T("sdat.riskScanReport.view.title.opinionLabel").$D(
            "舆情标签"
          ),
        },
        {
          fieldName: "stdNegIndex",
          label: $T("sdat.riskScanReport.view.title.negativeIndex").$D(
            "负面指数"
          ),
        },
        {
          fieldName: "stdSentiment",
          label: $T("sdat.riskScanReport.view.title.emotionalAttributes").$D(
            "情感属性"
          ),
        },
        {
          fieldName: "stdSource",
          label: $T("sdat.riskScanReport.view.title.source").$D("来源"),
        },
      ],
    },
  ];
}
