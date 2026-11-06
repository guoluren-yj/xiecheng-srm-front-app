/**
 * 本地开发，动态菜单配置文件，applications存放调试阶段，子应用入口路径
 * includeArray存放keep alive 路由
 * @type {({route: string, name: string}|{route: string, name: string})[]}
 */
// /appSour/RfxApprovalNew?rfxHeaderId=91890960797051186&secondarySourceCategory=NEW_BID
const applications = [
  /**
   * 审批表单验证，我们为您提供工作流表单验证界面，审批工作台可能不在当前服务
   * 如果验证开发的审批表单是否正常，可替换mobileFormUrl为当前开发的工作流审批表单路径，
   * 若当前界面验证正常，审批工作台可正常展示，开发完成后将mobileFormUrl组件通过remoteConfig.js曝露
   * 出去供审批工作台服务调用即可
   * eg：当前例子曝漏出去的配置为"./OrderApproval":"./src/components/Workflow/OrderApprovalFormNew/OrderApproval.vue"
   * 工作流表单配置，移动端url配置则为/appCpra/OrderApprovalFormNew?poHeaderId=${poHeaderId}
   * appCpra(请使用对应服务联邦模式简称，当前以协同为例，勿直接copy)
   */
  {
    name: "三生批量申请单工作流表单验证-二开",
    route: `ApprovalFormVerify?mobileFormUrl=${encodeURIComponent(
      "/CUX/3SBIO_BatchReqForm/BatchReqForm?plNum=PL202511260002",
    )}`,
  },
  {
    name: "批量申请单工作流表单验证-二开",
    route: `ApprovalFormVerify?mobileFormUrl=${encodeURIComponent(
      "/CUX/DEYESupQuotaBatchApprovalForm/SupQuotaBatchApprovalForm?businessKey=528752",
    )}`,
  },
  {
    name: "审批表单验证",
    // route: `ApprovalFormVerify?mobileFormUrl=${encodeURIComponent("/OrderApprovalFormNew/OrderApproval?poHeaderId=3271657791136")}`,
    // route: `ApprovalFormVerify?mobileFormUrl=${encodeURIComponent("/CUX/ConfirmCandidateApprovalForm/CAICConfirmCandidateApproval?sourceHeaderId=194107")}`,
    route: `ApprovalFormVerify?mobileFormUrl=${encodeURIComponent(
      "/CUX/StarBucksContractApprovalForm/StarBucksContractApproval?pcHeaderId=__-CfWAZodUrhrYaT_dpqDlJW8ZQ2vnPYiYUowXcBTocW0-__&isTermination=1&isCheck=1",
    )}`,
    // route: `ApprovalFormVerify?mobileFormUrl=${encodeURIComponent("/RfxApprovalNewForm/RfxApprovalNew?rfxHeaderId=91890960797051186&secondarySourceCategory=NEW_BID")}`,
    // route: `ApprovalFormVerify?mobileFormUrl=${encodeURIComponent("/RfxBargainApprovalForm/RfxBargainApprovalNew?rfxHeaderId=3701")}`,
  },
  {
    name: "价格澄清-移动端表单验证",
    route: `ApprovalFormVerify?mobileFormUrl=${encodeURIComponent(
      "/PricingClarificationApprovalForm/PricingClarificationApproval?clarifyNotifyId=__-mwPf583XDAu3WPxGQDvWbw-__&sourceHeaderId=__-qF_5uWeVJ8-78Mz8q8SJj0c-uquMzaDB5tx5SZXNkhg-__&secondarySourceCategory=RFQ",
    )}`,
  },
  {
    name: "供应商评估工作台",
    route: "PurEvaluationList",
  },
  {
    name: "企业信息变更审批",
    route: "EnterpriseInformConfirmList",
  },
  {
    name: "调查表审批",
    route: "InvestigationApprovalList",
  },
  {
    name: "企业邀约汇总",
    route: "InvitationSummaryList",
  },
  {
    name: "供应商生命周期汇总查询",
    route: "SupplierLifeCycleList",
  },
  {
    name: "全量监控企业管理",
    route: "MonitorList",
  },
  {
    name: "发现供应商",
    route: "SupplierDiscoveryList",
  },
  {
    name: "发现采购商",
    route: "FindPurchaserList",
  },
  {
    name: "现场考察报告",
    route: "SiteInvestigationReportManage",
  },
  {
    name: "现场考察报告填制",
    route: "SiteInvestigateReportList",
  },
  {
    name: "简易供应商入库及变更",
    route: "SimpleSupWarehouseList",
  },
  {
    name: "考评档案管理",
    route: "EvaluateArchivesList",
  },
  {
    name: "考评档案填制",
    route: "EvaluateArchivesFillList",
  },
  {
    name: "送样申请反馈",
    route: "SampleFeedbackList",
  },
  {
    name: "专家评分",
    route: "ExpertRatingList",
  },
  {
    name: "招标大厅",
    route: "TenderingHallList",
  },
  {
    name: "供应商报价",
    route: "SupplierQuotationList",
  },
  {
    name: "寻源大厅",
    route: "RfxHallList",
  },
  {
    name: "招标工作台",
    route: "NewBidHallList",
  },
  {
    name: "投标工作台",
    route: "NewSupplierBidding",
  },
  {
    name: "价格库",
    route: "PricePoolManageList",
  },
  {
    name: "供应商回复",
    route: "ListApply",
  },
  {
    name: "投标工作台(新)",
    route: "ListBidding",
  },
];

const includeArray = [
  "EnterpriseInformConfirmList",
  "ApprovalList",
  "ReceiverWorkplaceList",
  "InvitationSummaryList",
  "SupplierLifeCycleList",
  "MonitorList",
  "SupplierDiscoveryList",
  "FindPurchaserList",
  "SiteInvestigationReportManage",
  "SiteInvestigateReportList",
  "SimpleSupWarehouseList",
  "EvaluateArchivesList",
  "EvaluateArchivesFillList",
  "SampleFeedbackList",
  "ExpertRatingList",
  "TenderingHallList",
  "SupplierQuotationList",
  "RfxHallList",
  "NewBidHallList",
  "NewSupplierBidding",
  "ListApply",
  "ListBidding",
  "PricePoolManageList",
  "InvestigationApprovalList",
  "PurEvaluationList",
  "RiskScan",
];
export { includeArray, applications };
