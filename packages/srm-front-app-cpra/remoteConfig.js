/**
 *
 * @date: 2022-04-12
 * @author: yuyu.chang@going-link.com
 * 联邦模式，组件曝露，远程调用配置
 */

/**
 * 联邦模式打包是曝露域名，线上打包使用环境变量，线下自定义
 * @type {string}
 */
const mobileSrmHost = process.env.VUE_APP_SRM_HOST;
/**
 * 组件曝露
 * @type {{}}
 */
const exposes = {
  "./MouldDataDetail": "./src/modules/MouldData/views/Detail.vue",
  "./MouldAccountDetail": "./src/modules/MouldAccount/views/Detail.vue",
  "./MaterialCertificationDetail":
    "./src/modules/MaterialCertification/views/Detail.vue",
  "./MaterialFeedBackDetail": "./src/modules/MaterialFeedBack/views/Detail.vue",
  "./ProjectApprovalDetail":
    "./src/modules/ProjectApproval/views/ProjectApprovalDetail.vue",
  "./BudgetApprovalDetail":
    "./src/modules/Budget/views/BudgetApprovalDetail.vue",
  "./AdvancePayApproval":
    "./src/components/Workflow/AdvancePayApprovalForm/AdvancePayApproval.vue",
  "./OrderApproval":
    "./src/components/Workflow/OrderApprovalForm/OrderApproval.vue",
  "./ReceivingExecuteApproval":
    "./src/components/Workflow/ReceivingExecuteApprovalForm/ReceivingExecuteApproval.vue",
  "./Jemincare-ReceivingExecuteApproval":
    "./src/components/Workflow/CUX/JemincareReceivingExecuteApprovalForm/ReceivingExecuteApproval.vue",
  "./CheckPayInvApproval":
    "./src/components/Workflow/CheckPayInvApprovalFrom/CheckPayInvApproval.vue",
  "./DeliveryBillApproval":
    "./src/components/Workflow/DeliveryBillApprovalForm/DeliveryBillApproval.vue",
  "./DemandApproval":
    "./src/components/Workflow/DemandApprovalForm/DemandApproval.vue",
  "./SettleSubmitApproval":
    "./src/components/Workflow/SettleApproval/SettleSubmitApproval.vue",
  "./SettleBatchSubmitApproval":
    "./src/components/Workflow/SettleApproval/SettleBatchSubmitApproval.vue",
  "./BTN-OrderApproval":
    "./src/components/Workflow/CUX/OrderApprovalForm/BTN-OrderApproval.vue",
  "./Sw-OrderApproval":
    "./src/components/Workflow/CUX/OrderApprovalForm/Sw-OrderApproval.vue",
  "./Changshun-OrderApprovalNew":
    "./src/components/Workflow/CUX/OrderApprovalFormNew/Changshun/OrderApproval.vue",
  "./Changhua-OrderApprovalNew":
    "./src/components/Workflow/CUX/OrderApprovalFormNew/Changhua/OrderApproval.vue",
  "./ALD-OrderApprovalNew":
    "./src/components/Workflow/CUX/OrderApprovalFormNew/ALD/OrderApproval.vue",
  "./YHL-OrderApproval":
    "./src/components/Workflow/CUX/OrderApprovalForm/YHL-OrderApproval.vue",
  "./YHL-DemandApproval":
    "./src/components/Workflow/CUX/DemandApprovalForm/YHL-DemandApproval.vue",
  "./Jin-DemandApproval":
    "./src/components/Workflow/CUX/DemandApprovalForm/Jin-DemandApproval.vue",
  "./BTN-DemandApproval":
    "./src/components/Workflow/CUX/DemandApprovalForm/BTN-DemandApproval.vue",
  "./QCS-DemandApproval":
    "./src/components/Workflow/CUX/DemandApprovalForm/QCS-DemandApproval.vue",
  "./YofotoPurchaseReqApproval":
    "./src/components/Workflow/CUX/YofotoPurchaseReqApprovalForm/YofotoPurchaseReqApproval.vue",
  "./YHL-CataMallReqApproval":
    "./src/components/Workflow/CUX/CataMallReqApprovalFrom/YHL-CataMallReqApproval.vue",
  "./SDCCataMallReqApproval":
    "./src/components/Workflow/CUX/CataMallReqApprovalFrom/SDCCataMallReqApproval.vue",
  "./ERPPurchaseRequisitionApproval":
    "./src/components/Workflow/ERPPurchaseRequisitionApprovalForm/ERPPurchaseRequisitionApproval.vue",
  "./PayApplyApproval":
    "./src/components/Workflow/PayApplyApprovalForm/PayApplyApproval.vue",
  "./RequisitionPlanRecordApproval":
    "./src/components/Workflow/RequisitionPlanRecordApprovalForm/RequisitionPlanRecordApproval.vue",
  "./OrderApprovalNew":
    "./src/components/Workflow/OrderApprovalFormNew/OrderApproval.vue",
  "./StatementReviewApprovalForm":
    "./src/components/Workflow/StatementReviewForm/StatementReviewApprovalForm.vue",
  "./ClaimRevisionApproval":
    "./src/components/Workflow/ClaimRevisionApprovalFrom/ClaimRevisionApproval.vue",
  "./EcMallReqApproval":
    "./src/components/Workflow/EcMallReqApprovalForm/EcMallReqApproval.vue",
  "./FreeDeductionApply":
    "./src/components/Workflow/FreeDeductionApplyForm/FreeDeductionApply.vue",
  "./ReceiptApproval":
    "./src/components/Workflow/ReceiptApprovalForm/ReceiptApproval.vue",
  "./RequisitionPlanApproval":
    "./src/components/Workflow/RequisitionPlanApprovalForm/RequisitionPlanApproval.vue",
  "./CataMallReqApproval":
    "./src/components/Workflow/CataMallReqApprovalFrom/CataMallReqApproval.vue",
  "./PurchaseRequisitionApprovalDetail":
    "./src/modules/PurchaseRequisitionApproval/views/PurchaseRequisitionApprovalDetail",
  "./YongxiangPayApplyApproval":
    "./src/components/Workflow/CUX/YongxiangPayApplyApprovalForm/YongxiangPayApplyApprovalForm.vue",
  "./YongxiangCostSettleApproval":
    "./src/components/Workflow/CUX/YongxiangCostSettleApprovalForm/YongxiangCostSettleApprovalForm.vue",
  "./EcInvoiceApproval":
    "./src/components/Workflow/EcInvoiceApprovalForm/EcInvoiceApproval.vue",
  "./YONGXIANG-EcInvoiceApproval":
    "./src/components/Workflow/CUX/EcInvoiceApprovalForm/YONGXIANG-EcInvoiceApproval.vue",
  "./StarBucks-SettleSubmitApproval":
    "./src/components/Workflow/CUX/SettleApproval/StarBucksSettleSubmitApproval.vue",
  "./StarBucks-AdvancePayApproval":
    "./src/components/Workflow/CUX/AdvancePayApprovalForm/StarBucksAdvancePayApproval.vue",
  "./ReceiverWorkDetailForm":
    "./src/components/Workflow/ReceiveWorkplaceForm/ReceiverWorkDetailForm.vue",
  "./ReceiverWorkDetailFormWl":
    "./src/components/Workflow/ReceiveWorkplaceWlForm/ReceiverWorkDetailFormWl.vue", // 卫龙专用
  "./ReceiverWorkDetailFormWlNew":
    "./src/components/Workflow/ReceiveWorkplaceWlFormNew/ReceiverWorkDetailFormWl.vue", // 卫龙专用-new
  "./PurchaseReqWorkbenchDetail":
    "./src/modules/PurchaseReqWorkbench/views/Detail.vue",
  "./PurchaseReqWorkbenchQuery":
    "./src/modules/PurchaseReqWorkbench/views/Detail.vue",
  "./DeliveryWorkbenchForm":
    "./src/components/Workflow/DeliveryWorkbenchForm/Detail.vue",
  "./ScheduleSheetApprovalForm":
    "./src/components/Workflow/ScheduleSheetApprovalForm/Detail.vue", //计划排程审批表单
  "./OrderReceiptDetailForm":
    "./src/components/Workflow/CUX/LdjtOrderAcceptApprovalForm/OrderAcceptApproval.vue", // 订单验收审批二开表单
  "./PrApproveDetail":
    "./src/components/Workflow/CUX/ShiyuePurchaseReqApproval/PurchaseRequisitionApprovalDetail.vue", // 诗悦审批采购申请二开表单
  "./ProjectCuxApproveDetail":
    "./src/components/Workflow/CUX/ShiyueProjectApprovalForm/views/ProjectApprovalDetail.vue", // 诗悦审批采购申请二开表单
  "./AdvancePayApprovalFiance":
    "./src/components/Workflow/AdvancePayApprovalFianceForm/AdvancePayApprovalFiance.vue", // 老财务预付款审批
  "./MyOrderDetail": "./src/modules/MyOrder/views/MyOrderDetail.vue",
  "./MyReceiveOrderDetail":
    "./src/modules/MyReceiveOrder/views/MyReceiveOrderDetail.vue",
  "./OrderWorkbenchDetail/All":
    "./src/modules/OrderWorkbench/views/Detail/All.vue",
  "./SellerOrderWorkbenchDetail":
    "./src/modules/SellerOrderWorkbench/views/Detail.vue",
  "./PurchaseSettleDetail":
    "./src/modules/SettleWorkbench/views/PurchaseSettleDetail.vue",
  "./PayDocApproval":
    "./src/components/Workflow/PayDocApprovalForm/PayDocApproval.vue",
  "./PayDocBatchApproval":
    "./src/components/Workflow/PayDocApprovalForm/PayDocBatchApproval.vue",
  "./SupplierMasterRequestForm":
    "./src/components/Workflow/SupplierMasterRequestForm/Detail.vue", // 司顺-供应商主数据变更申请单审批表单
  "./ScuxCentralizeManageForm":
    "./src/components/Workflow/ScuxCentralizeManageForm/Detail.vue", // 拼单策略定义
  "./ScuxWeftbearingWorkspaceForm":
    "./src/components/Workflow/ScuxWeftbearingWorkspaceForm/Detail.vue", // 协鑫科技 二开
  "./ToBeSubmittedDetail": "./src/modules/CUX/GEISHI_MyOrder/views/ToBeSubmittedDetail", // 支持二开跳转
  "./SishunSkuBoxMaintenanceForm": "./src/components/Workflow/CUX/SishunSkuBoxMaintenanceForm/Detail.vue" // 司顺-SKU盒子维护
};

/**
 * 远程调用配置
 * @type {{}}
 */
const remotes = {
  // appSour: "appSour@http://localhost:9598/SourRemoteEntry.js",
  // appSour: `appSour@${mobileSrmHost}/appSour/SourRemoteEntry.js`,
};

module.exports = {
  exposes,
  remotes,
  mobileSrmHost,
};
