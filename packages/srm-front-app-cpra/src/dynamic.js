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
    name: "思顺SKU工作流表单验证-二开",
    route: `ApprovalFormVerify?mobileFormUrl=${encodeURIComponent(
      "/CUX/SishunSkuBoxMaintenanceForm/Detail?uniqueKey=XGSP2026052600001"
    )}`,
  },
  {
    name: "申请工作流表单验证-二开",
    route: `ApprovalFormVerify?mobileFormUrl=${encodeURIComponent(
      "/DemandApprovalForm/DemandApproval?prHeaderId=__-vHItOJI6zNhJMtBZBfrtUcLEHUCQiINREzeU2V-LajY-__"
    )}`,
  },
  {
    name: "订单验收审批表单验证-二开",
    route: `ApprovalFormVerify?mobileFormUrl=${encodeURIComponent(
      "/CUX/LdjtOrderAcceptApprovalForm/OrderAcceptApproval?acceptHeaderId=76"
    )}`,
  },
  {
    name: "物料认证审批表单验证",
    route: `ApprovalFormVerify?mobileFormUrl=${encodeURIComponent(
      "/MaterialCertificationDetail?node=MATERIAL_RECOGNITION&itemAuthReqHeaderId=__-kLgW4tK3CaUX9wMVzRcjLw-__"
    )}`,
  },
  {
    name: "长华二开订单审批表单验证",
    route: `ApprovalFormVerify?mobileFormUrl=${encodeURIComponent(
      "/CUX/OrderApprovalFormNew/Changhua/OrderApproval?poHeaderId=3271657791136"
    )}`,
  },
  {
    name: "老订单审批表单验证",
    route: `ApprovalFormVerify?mobileFormUrl=${encodeURIComponent(
      "/OrderApprovalForm/OrderApproval?poHeaderId=3271657791136"
    )}`,
  },
  {
    name: "订单审批表单验证",
    route: `ApprovalFormVerify?mobileFormUrl=${encodeURIComponent(
      "/OrderApprovalFormNew/OrderApproval?poHeaderId=3271657791136"
    )}`,
  },
  {
    name: "长顺审批表单验证",
    route: `ApprovalFormVerify?mobileFormUrl=${encodeURIComponent(
      "/CUX/OrderApprovalFormNew/Changshun/OrderApproval?poHeaderId=__-Y955A2zKxqdJ52DTILdVdbFrT0cA6IuyfVqla-DKCTg-__"
    )}`,
  },
  {
    name: "审批表单验证-二开",
    route: `ApprovalFormVerify?mobileFormUrl=${encodeURIComponent(
      "/CUX/JemincareReceivingExecuteApprovalForm/ReceivingExecuteApproval?rcvTrxHeaderId=758334&nodeIndex=B&type=readOnly"
    )}`,
  },
  {
    name: "收货工作台审批表单",
    route: `ApprovalFormVerify?mobileFormUrl=${encodeURIComponent(
      "/ReceiveWorkplaceForm/ReceiverWorkDetailForm?rcvTrxHeaderId=1141878&returnFlag=0&nodeConfigIndexAbc=D&isDoubleUnit=0"
    )}`,
  },
  {
    name: "卫龙New-收货工作台审批表单",
    route: `ApprovalFormVerify?mobileFormUrl=${encodeURIComponent(
      "/ReceiveWorkplaceWlFormNew/ReceiverWorkDetailFormWl?rcvTrxHeaderId=230683312&returnFlag=0&nodeConfigIndexAbc=I&isDoubleUnit=0"
    )}`,
  },
  {
    name: "司顺-供应商主数据变更申请单审批表单",
    route: `ApprovalFormVerify?mobileFormUrl=${encodeURIComponent(
      "/SupplierMasterRequestForm/Detail?id=7310"
    )}`,
  },
  {
    name: "发货工作台审批表单",
    route: `ApprovalFormVerify?mobileFormUrl=${encodeURIComponent(
      "/DeliveryWorkbenchForm/Detail?deliveryHeaderId=215302&node=ASN&nodeConfigId=13913"
    )}`,
  },
  {
    name: "协鑫-结算单",
    route: `ApprovalFormVerify?mobileFormUrl=${encodeURIComponent(
      "/ScuxWeftbearingWorkspaceForm/Detail?id=__-S29IxoQu-yhVnXfgR2zwsw-__"
    )}`,
  },
  {
    name: "预算详情",
    route: "BudgetApprovalDetail",
  },
  {
    name: "冲销",
    route: "ReverseList",
  },
  {
    name: "采购方发货工作台",
    route: "DeliveryWorkbenchList",
  },
  {
    name: "销售方发货工作台",
    route: "SupplierDeliveryWorkbenchList",
  },
  {
    name: "创建应收发票",
    route: "CreateInvoiceList",
  },
  {
    name: "发票查验",
    route: "InvoiceInspection",
  },
  {
    name: "审核应付发票",
    route: "CheckPayableInvoiceList",
  },
  {
    name: "我发出的订单",
    route: "MyOrderList",
  },
  {
    name: "我收到的订单",
    route: "MyReceiveOrder",
  },
  {
    name: "我的送货单",
    route: "MyDeliveryList",
  },
  {
    name: "接收",
    route: "ReceiveList",
  },
  {
    name: "收货工作台",
    route: "ReceiverWorkplaceList",
  },
  {
    name: "收货执行",
    route: "ReceiptExecutionList",
  },
  {
    name: "计划排程创建",
    route: "ScheduleSheetCreate",
  },
  {
    name: "计划排程确认",
    route: "ScheduleSheetConfirm",
  },
  {
    name: "计划排程创建-供应商",
    route: "ScheduleSheetCreateBySupplier",
  },
  {
    name: "计划排程确认-供应商",
    route: "ScheduleSheetConfirmBySupplier",
  },
  {
    name: "交期审核",
    route: "DeliveryTimeList",
  },
  {
    name: "订单发布",
    route: "OrderReleaseList",
  },
  {
    name: "订单审批",
    route: "OrderApprovalList",
  },
  {
    name: "订单确认",
    route: "OrderConfirmationList",
  },
  {
    name: "送货单关闭",
    route: "DeliveryBillCloseList",
  },
  {
    name: "送货单创建",
    route: "DeliveryList",
  },
  {
    name: "送货单取消",
    route: "DeliveryBillCancelList",
  },
  {
    name: "送货单复审",
    route: "DeliveryBillReviewList",
  },
  {
    name: "送货单审批",
    route: "DeliveryBillList",
  },
  {
    name: "送货单查询",
    route: "DeliveryBillQueryList",
  },
  {
    name: "采购方发票池",
    route: "PurchaserInvoicePool",
  },
  {
    name: "销售方发票池",
    route: "VendorInvoicePool",
  },
  {
    name: "采购申请审批",
    route: "PurchaseRequisitionApprovalList",
  },
  {
    name: "采购申请工作台",
    route: "PurchaseReqWorkbenchList",
  },
  {
    name: "采购方对账单工作台",
    route: "StatementReviewList",
  },
  {
    name: "销售方对账单工作台",
    route: "StatementReviewBySupplierList",
  },
  {
    name: "预算调拨",
    route: "BudgetList",
  },
  {
    name: "需求执行-分配",
    route: "PurchaseReqAssignList",
  },
  {
    name: "采购方结算单工作台",
    route: "PurchaseSettleList",
  },
  {
    name: "销售方结算单工作台",
    route: "SupplySettleList",
  },
  {
    name: "我发起的索赔单",
    route: "MyInitiatedClaimList",
  },
  {
    name: "质量整改创建",
    route: "QIReportCreationList",
  },
  {
    name: "我发起的质量整改",
    route: "QIReportInitiatedList",
  },
  {
    name: "采购方订单工作台",
    route: "OrderWorkbenchList",
  },
  {
    name: "销售方订单工作台",
    route: "SellerOrderWorkbenchList",
  },
  {
    name: "采购方物料认证工作台",
    route: "MaterialCertificationDetail",
  },
  {
    name: "模具主数据审批",
    route: "MouldData",
  },
  {
    name: "模具台账审批",
    route: "MouldAccount",
  },
  {
    name: "物料反馈工作台",
    route: "MaterialFeedBackDetail",
  },
  {
    name: "项目信息工作台",
    route: "ProjectApprovalDetail",
  },
];

const includeArray = [
  "ReverseList",
  "CreateInvoiceList",
  "CheckPayableInvoiceList",
  "MyOrderList",
  "MyReceiveOrder",
  "MyDeliveryList",
  "ReceiveList",
  "ScheduleSheetConfirmBySupplier",
  "DeliveryTimeList",
  "OrderApprovalList",
  "OrderApprovalList",
  "OrderConfirmationList",
  "DeliveryBillCloseList",
  "DeliveryList",
  "DeliveryBillCancelList",
  "DeliveryBillList",
  "DeliveryBillQueryList",
  "PurchaserInvoicePool",
  "VendorInvoicePool",
  "PurchaseRequisitionApprovalList",
  "PurchaseReqWorkbenchList",
  "StatementReviewList",
  "StatementReviewBySupplierList",
  "DeliveryWorkbenchList",
  "SupplierDeliveryWorkbenchList",
  "BudgetList",
  "ReceiptExecutionList",
  "ReceiverWorkplaceList",
  "SDCBudgetList",
  "BudgetAdjustList",
  "PurchaseReqAssignList",
  "PurchaseSettleList",
  "SupplySettleList",
  "MyInitiatedClaimList",
  "OrderWorkbenchList",
  "SellerOrderWorkbenchList",
  "MouldData",
  "MouldAccount",
  "QIReportCreationList",
  "QIReportInitiatedList",
  "ProjectApprovalDetail",
];
export { includeArray, applications };
