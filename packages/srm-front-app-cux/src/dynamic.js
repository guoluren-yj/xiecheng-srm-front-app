/**
 * 本地开发，动态菜单配置文件，applications存放调试阶段，子应用入口路径
 * includeArray存放keep alive 路由
 * @type {({route: string, name: string}|{route: string, name: string})[]}
 */
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
    name: "专家回复",
    route: "ExpertReplyList",
  },
  {
    name: "合同工作台",
    route: "WuLing_ContractWorkbench/List",
  },
  {
    name: "订单验收工作台",
    route: "OrderVerificationReceipWorkbench",
  },
  {
    name: "送货单查询",
    route: "CuxDeliveryBillQueryList",
  },
  {
    name: "审批表单验证",
    route: `ApprovalFormVerify?mobileFormUrl=${encodeURIComponent(
      "/SducksProductsApprovalForm/SducksProductsForm?changeReqId=393778346632508879&hiddenSku=y&req=workflowApprove"
    )}`,
  },
  {
    name: "扫码收货",
    route: "ScanDetail",
  },
  {
    name: "供货明细查询",
    route: "SJSupplyItemDetailList",
  },
  {
    name: "供货明细确认",
    route: "SJSupplyItemDetailConfirm",
  },
  {
    name: "货款确认",
    route: "sj_MyPaymentList",
  },
  // {
  //   name: "供货单创建",
  //   route: "SupplyItemDetailList"
  // },
  {
    name: "二维码查看",
    route: "QRCodeList",
  },
  {
    name: "采购方案审批",
    route: "PurchasingSchemeApproveList",
  },
  {
    name: "采购决议审批",
    route: "Hygy_PurchaseResolutionApproval",
  },
  {
    name: "评标报告审批",
    route: "Hygy_EvaluationReportsApproval",
  },
  {
    name: "评标报告审批",
    route: "Hygy_EvaluationReportsApproval",
  },
  {
    name: "采购合同审批",
    route: "PurchasingAgreementApproveList",
  },
  {
    name: "基准价确认",
    route: "aks_ConfirmBasicPriceList",
  },
  {
    name: "需求联络单分配",
    route: "DemandContactDistributeList",
  },
  {
    name: "需求联络单发布",
    route: "DemandContactReleaseList",
  },
  {
    name: "非商城采购申请",
    route: "EasyPreparePurchasingApproveList",
  },
  {
    name: "Aux我的待办",
    route: "Aux_workflowList",
  },
  {
    name: "店Q评分-屈臣氏",
    route: "Watson_StoreScore",
  },
  {
    name: "供应商准入申请单审批",
    route: "Hygy_SuppliersAdmissionApprovalList",
  },
  {
    name: "供应商淘汰申请单",
    route: "Hygy_SuppliersObsoleteApprovalList",
  },
  {
    name: "绩效综合评估",
    route: "EvaluationDocApproveList",
  },
  {
    name: "华友协议审批",
    route: "PurchasingAgreementApproveList",
  },
  {
    name: "订单发布审批",
    route: "Hygy_OrderPublishApprovalList",
  },
  {
    name: "订单变更审批",
    route: "Hygy_OrderChangeApprovalList",
  },
  {
    name: "厂Q评分-屈臣氏",
    route: "Watson_FactoryScore",
  },
  {
    name: "样Q评分-屈臣氏",
    route: "Watson_ShapeScore",
  },

  {
    name: "供货单明细创建",
    route: "SJSupplyItemDetailCreate",
  },
  {
    name: "验收通知单",
    route: "InspectNoticeList",
  },
  {
    name: "装箱/柜通知确认",
    route: "PackingConfirmNoticeList",
  },
  {
    name: "装箱/柜通知确认",
    route: "PackingConfirmNoticeList",
  },
  {
    name: "订单执行进度",
    route: "SumeidaOrderProgressList",
  },
  {
    name: "我发出的订单",
    route: "UnnerGyMyOrderList",
  },
  {
    name: "订单审批",
    route: "Weilong_OrderApproval",
  },
  {
    name: "xiabao送货单创建",
    route: "Xinbao_DeliveryCreation",
  },
  {
    name: "送货单计划",
    route: "APSDeliveryPlan",
  },
  {
    name: "送货单计划",
    route: "APSDeliverySign",
  },
  {
    name: "包材管理",
    route: "XBPackingMaterialManage",
  },
  {
    name: "质检分配",
    route: "PCIQualityInspectionList",
  },
  {
    name: "质检质检",
    route: "PCISubmitInspectionList",
  },
  {
    name: "点位管理",
    route: "PointondeMandList",
  },
  {
    name: "点位管理(采)",
    route: "PurChaseMandPlaceList",
  },
  {
    name: "质检单填写",
    route: "SummaryReceiptsList",
  },
  {
    name: "资质查询",
    route: "LNGQualificationList",
  },
  {
    name: "供应商点赞",
    route: "SupplierGiveThumbsUp",
  },
  {
    name: "供应商临时审批",
    route: "Hygy_SuppliersTemporaryApprovalList",
  },
  {
    name: "箱码绑定",
    route: "BoxCodeBinding",
  },
  {
    name: "箱码解绑",
    route: "BoxCodeUnbind",
  },
  {
    name: "供应商/专家提前参与",
    route: "SupplierParticipatio",
  },
  {
    name: "协鑫供应商标的管理详情页",
    route: "XxjtSupplierApplication",
  },
  {
    name: "计划分配",
    route: "XXJTPlannedDistribute",
  },
  {
    name: "收货执行",
    route: "PciReceiptForm",
  },
];

const includeArray = ["ApprovalList", "ReceiverWorkplaceList"];
export { includeArray, applications };
