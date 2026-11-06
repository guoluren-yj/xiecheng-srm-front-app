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
  // "./NoContent": "./src/components/NoContent.vue"
  "./AuxRuleObsoleteApproval":
    "./src/components/Workflow/AUXRuleObsoleteApprovalForm/AuxRuleObsoleteApproval.vue",
  "./JiaLan_DemandContactApproval":
    "./src/components/Workflow/JiaLan_DemandContactApprovalForm/JiaLan_DemandContactApproval.vue",
  "./ShanTuiDrawingApplyApproval":
    "./src/components/Workflow/ShanTuiDrawingApplyApprovalForm/ShanTuiDrawingApplyApproval.vue",
  "./JialanCommercialTermsPreApproval":
    "./src/components/Workflow/JialanCommercialTermsPreApprovalForm/JialanCommercialTermsPreApproval.vue",
  "./SupplyAbilityUpgradeApporoval":
    "./src/components/Workflow/SupplyAbilityUpgradeApporovalForm/SupplyAbilityUpgradeApporoval.vue",
  "./TrialCoopSumReportApproval":
    "./src/components/Workflow/TrialCoopSumReportApprovalForm/TrialCoopSumReportApproval.vue",
  "./LoveStudyRFXCheckApproval":
    "./src/components/Workflow/LoveStudyRFXCheckApprovalForm/LoveStudyRFXCheckApproval.vue",
  "./AnswerApproval":
    "./src/components/Workflow/AnswerApprovalForm/AnswerApproval.vue",
  "./SupplierOpenAccountApproval":
    "./src/components/Workflow/SupplierOpenAccountApprovalForm/SupplierOpenAccountApproval.vue",
  "./EaglerisePriceApproval":
    "./src/components/Workflow/EaglerisePriceApprovalForm/EaglerisePriceApproval.vue",
  "./EasyPreparePurchasingApproval":
    "./src/components/Workflow/EasyPreparePurchasingApprovalForm/EasyPreparePurchasingApproval.vue",
  "./NoOnSiteReviewApproval":
    "./src/components/Workflow/NoOnSiteReviewApprovalForm/NoOnSiteReviewApproval.vue",
  "./BindInquiryAnswerSheetApproval":
    "./src/components/Workflow/BindInquiryAnswerSheetApprovalForm/BindInquiryAnswerSheetApproval.vue",
  // "./BidEvaluationReportForm":"./src/components/Workflow/HYPurchasingApproveForm/BidEvaluationReportForm.vue",
  "./PurchasingChemeApproveForm":
    "./src/components/Workflow/HYPurchasingApproveForm/PurchasingChemeApproveForm.vue",
  // "./PurchasingDecisionApproveForm":"./src/components/Workflow/HYPurchasingApproveForm/PurchasingDecisionApproveForm.vue",
  "./LsMaterialRequisitionApproval":
    "./src/components/Workflow/LsMaterialRequisitionApprovalForm/LsMaterialRequisitionApproval.vue",
  "./AuxSupplierStockInApproval":
    "./src/components/Workflow/AUXSupplierStockInApproveForm/AuxSupplierStockInApproval.vue",
  "./YXMarginTransferApproval":
    "./src/components/Workflow/YXMarginTransferApprovalForm/YXMarginTransferApproval.vue",
  "./YXMarginManagementApproval":
    "./src/components/Workflow/YXMarginManagementApprovalForm/YXMarginManagementApproval.vue",
  "./YXMarginPaymentApproval":
    "./src/components/Workflow/YXMarginPaymentApprovalForm/YXMarginPaymentApproval.vue",
  "./JiaDuReceiptApproval":
    "./src/components/Workflow/JiaDuReceiptApprovalForm/JiaDuReceiptApproval.vue",
  "./BidEvaluationReportForm":
    "./src/modules/Hygy_EvaluationReportsApproval/components/BidEvaluationReport.vue",
  "./PurchasingDecisionApproveForm":
    "./src/modules/Hygy_PurchaseResolutionApproval/components/ProcurementDecision.vue",
  "./PackingMaterial":
    "./src/components/Workflow/PackingMaterial/PointondeMandDetails.vue",
  "./AdvanceRawMaterials":
    "./src/components/Workflow/AdvanceRawMaterials/views/PointondeMandDetails.vue",
  "./ConsolidatedPpprovalFrom":
    "./src/components/Workflow/ConsolidatedPpprovalFrom/ConsolidatedPpproval.vue",
  "./XXJTBiddingApproval":
    "./src/components/Workflow/XXJTBidding/XXJTBiddingApproval.vue",
  "./XxjtSupplierApplicationApproval":
    "./src/components/Workflow/XxjtSupplierApplicationForm/XxjtSupplierApplicationApproval.vue",
  "./XxjtSupplierApplication":
    "./src/modules/XxjtSupplierApplication/XxjtSupplierApplicationApproval.vue",
  "./XXJTWfetBearingApproval":
    "./src/components/Workflow/XXJTWfetBearing/XXJTWfetBearingApproval.vue",
  "./XXJTBiddingReviewApproval":
    "./src/components/Workflow/XXJTWfetBearing/XXJTBiddingReviewApproval.vue",
  "./XXJTContractApproval":
    "./src/components/Workflow/XXJTWfetBearing/XXJTContractApproval.vue",
  "./XXJTBidApplicationFormApproval":
    "./src/components/Workflow/XXJTWfetBearing/XXJTBidApplicationFormApproval.vue",
  "./MagePriceApproval":
    "./src/components/Workflow/MagePriceApproval/MagePriceApproval.vue",
  "./XxjtBidApplication":
    "./src/modules/XxjtBidApplication/XxjtBidApplicationApproval.vue",
  "./YXCapitalPlanSummaryApproval":
    "./src/components/Workflow/YXCapitalPlanSummaryApprovalForm/YXCapitalPlanSummaryApproval.vue",
  "./YXCapitalPlanSummaryDetailApproval":
    "./src/components/Workflow/YXCapitalPlanSummaryApprovalForm/YXCapitalPlanSummaryDetailApproval.vue",
  "./HbsrmReviewSelectForm":
    "./src/components/Workflow/HbsrmReviewSelectApproveForm/views/HbsrmReviewSelectForm.vue",
  "./HbsrmReviewReadForm":
    "./src/components/Workflow/HbsrmReviewReadApproveForm/views/HbsrmReviewReadForm.vue",
  "./NonCollaborativeApproval":
    "./src/components/Workflow/HaiLiangNonCollaborativeApprovalForm/NonCollaborativeApproval.vue",
  "./DqCorporateSourcingApproval":
    "./src/components/Workflow/DqCorporateSourcingApprovalForm/DqCorporateSourcingApproval.vue",
  "./TargetedBargaining3sbio":
    "./src/components/Workflow/TargetedBargaining3sbio/views/TargetedBargaining3sbio.vue",
  "./StarPaymentConbinedApproveForm":
    "./src/components/Workflow/StarPaymentConbinedApproveForm/views/StarPaymentConbinedApproveForm.vue",
  "./JianJiMassProductionNotice":
    "./src/components/Workflow/JianJiMassProductionNotice/JianJiMassProductionNotice.vue",
  "./JianJiMaterialApprovalForm":
      "./src/components/Workflow/JianJiMaterialApprovalForm/JianJiMaterialApproval.vue",
  "./JianJiQualityApprovalForm":"./src/components/Workflow/JianJiQualityApprovalForm/JianJiQualityApproval.vue",
  "./TopStarPriceLibraryApproval":"./src/components/Workflow/TopStarPriceLibraryApprovalForm/TopStarPriceLibraryApproval.vue",
  "./AuxBidPlanApprovalFormAll": "./src/components/Workflow/AUXBidPlanApprovalFormAll/AuxBidPlanApprovalFormAll.vue",
  "./OrforOrderAllocationApproval":"./src/components/Workflow/OrforOrderAllocationApprovalForm/OrforOrderAllocationApproval.vue",
  "./AuxBenchPriceMaintainApproval": "./src/components/Workflow/AUXBenchPriceMaintainApprovalForm/AuxBenchPriceMaintainApproval.vue",
  "./DqsolarApproval": "./src/components/Workflow/DqsolarApprovalForm/DqsolarApproval.vue",
  "./SducksProductsForm": "./src/components/Workflow/SducksProductsApprovalForm/SducksProductsForm.vue",
  "./IhgAccrAmortFormApproval": "./src/components/Workflow/IhgAccrAmortApprovalForm/IhgAccrAmortForm.vue",
  "./IhgStockTakingApproval": "./src/components/Workflow/IhgStockTakingApprovalForm/IhgStockTakingApproval.vue",
  "./SiShunChangeOrderApproval": "./src/components/Workflow/SiShunChangeOrder/SiShunChangeOrderApproval.vue",
  "./EcrChangeRequset":
    "./src/components/Workflow/JianJiEcrChangeRequsetForm/JianJiEcrChangeRequsetFormApproval.vue",
  "./PylontechOrderBatchSubmitForm": "./src/components/Workflow/PylontechOrderBatchSubmit/PylontechOrderBatchSubmitForm.vue",
  "./SiShunSubjectMappingTable": "./src/components/Workflow/SiShunSubjectMappingTable/SiShunSubjectMappingTableApprove.vue",
  "./HAISCOAssetCodeRequestApproval":
    "./src/components/Workflow/HAISCOAssetCodeRequest/AssetCodeRequest.vue",
    // 电商商品上架审批
  "./EcommerceProductApproval": "./src/components/Workflow/EcommerceProductApproval/EcommerceProductApproval.vue",
  "./PylontechSettlementBatchStatementSubmitForm": "./src/components/Workflow/PylontechSettlementBatchStatementSubmit/PylontechSettlementBatchStatementSubmitForm.vue",
};

/**
 * 远程调用配置
 * @type {{}}
 */
const remotes = {
  appPlat: `appPlat@${mobileSrmHost}/appPlat/PlatRemoteEntry.js`,
  appCpra: `appCpra@${mobileSrmHost}/appCpra/CpraRemoteEntry.js`,
  appSour: `appSour@${mobileSrmHost}/appSour/SourRemoteEntry.js`,
  appCux: `appCux@${mobileSrmHost}/appCux/CuxRemoteEntry.js`,
};

module.exports = {
  exposes,
  remotes,
  mobileSrmHost,
};
