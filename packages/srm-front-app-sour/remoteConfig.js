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
  "./H5Table": "./src/components/Table/H5Table.vue",
  "./SupplierInfoChangeApproval":
    "./src/components/Workflow/SupplierInfoChangeApprovalForm/SupplierInfoChangeApproval.vue",
  "./SupplierInfoApprovalNew":
    "./src/components/Workflow/SupplierInfoApprovalForm/SupplierInfoApprovalNew.vue",
  "./EnterpriseInformationConfirmForm":
    "./src/components/Workflow/EnterpriseInformationConfirmForm/EnterpriseInformationConfirmForm.vue",
  "./EnterpriseInformTenantApproval":
    "./src/components/Workflow/EnterpriseInformTenantApproval/EnterpriseInformTenantApproval.vue",
  "./DominosEnterpriseInformTenantApproval":
    "./src/components/Workflow/CUX/DominosEnterpriseInformTenantApproval/EnterpriseInformTenantApproval.vue",
  "./RfxApprovalNew":
    "./src/components/Workflow/RfxApprovalNewForm/RfxApprovalNew.vue",
  "./SampleReqConfirmSubmitApproval":
    "./src/components/Workflow/SampleReqConfirmSubmitApprovalForm/SampleReqConfirmSubmitApproval.vue",
  "./PotentialApproval":
    "./src/components/Workflow/PotentialApprovalForm/PotentialApproval.vue",
  "./RfxBargainApproval":
    "./src/components/Workflow/RfxBargainApprovalForm/RfxBargainApproval.vue",
  "./RfxBargainApprovalNew":
    "./src/components/Workflow/RfxBargainApprovalForm/RfxBargainApprovalNew.vue",
  "./BiddingBillsApproval":
    "./src/components/Workflow/BiddingBillsApprovalForm/BiddingBillsApproval.vue",
  "./AuxBidPlanApprovalForm":
    "./src/components/Workflow/CUX/BidPlanApprovalForm/AuxBidPlanApprovalForm.vue",
  "./StarBucksQualifiedApproval":
    "./src/components/Workflow/CUX/StarBucksQualifiedApprovalForm/StarBucksQualifiedApproval.vue",
  "./JINKOBiddingBillsApproval":
    "./src/components/Workflow/CUX/BiddingBillsApprovalForm/JINKOBiddingBillsApproval.vue",
  "./StarBucksContractApproval":
    "./src/components/Workflow/CUX/StarBucksContractApprovalForm/StarBucksContractApproval.vue",
  "./JIALANPurchaseRecordApproval":
    "./src/components/Workflow/CUX/PurchaseRecordApprovalForm/JIALANPurchaseRecordApproval.vue",
  "./Jin-RfxApproval":
    "./src/components/Workflow/CUX/RfxApprovalForm/Jin-RfxApproval.vue",
  "./JINKORfxApproval":
    "./src/components/Workflow/CUX/RfxApprovalForm/JINKORfxApproval.vue",
  "./AuxRfxApproval":
    "./src/components/Workflow/CUX/RfxApprovalForm/AuxRfxApproval.vue",
  "./YHL-RfxApproval":
    "./src/components/Workflow/CUX/RfxApprovalForm/YHL-RfxApproval.vue",
  "./Jin-PricingApproval":
    "./src/components/Workflow/CUX/PricingApprovalForm/Jin-PricingApproval.vue",
  "./HongHe-PricingApproval":
    "./src/components/Workflow/CUX/PricingApprovalForm/HongHe-PricingApproval.vue",
  "./SOBUTEPricingApproval":
    "./src/components/Workflow/CUX/PricingApprovalForm/SOBUTEPricingApproval.vue",
  "./YHL-PricingApproval":
    "./src/components/Workflow/CUX/PricingApprovalForm/YHL-PricingApproval.vue",
  "./JINKOPricingApproval":
    "./src/components/Workflow/CUX/PricingApprovalForm/JINKOPricingApproval.vue",
  "./CCTEGHZCGPricingApprovalNewComplete":
    "./src/components/Workflow/CUX/PricingApprovalForm/CCTEGHZCGPricingApprovalNewComplete.vue",
  "./BTN-PricingApproval":
    "./src/components/Workflow/CUX/PricingApprovalForm/BTN-PricingApproval.vue",
  "./Jin-SupplierApproval":
    "./src/components/Workflow/CUX/SupplierApprovalForm/Jin-SupplierApproval.vue",
  "./JINKOCalibrationApproval":
    "./src/components/Workflow/CUX/CalibrationApprovalForm/JINKOCalibrationApproval.vue",
  "./SanShengAgreementApproval":
    "./src/components/Workflow/CUX/AgreementApprovalForm/SanShengAgreementApproval.vue",
  "./ChangShunAgreementApproval":
    "./src/components/Workflow/CUX/AgreementApprovalForm/ChangShunAgreementApproval.vue",
  "./ChangHuaAgreementApproval":
    "./src/components/Workflow/CUX/AgreementApprovalForm/ChangHuaAgreementApproval.vue",
  "./JiuliAgreementApproval":
    "./src/components/Workflow/CUX/AgreementApprovalForm/JiuliAgreementApproval.vue",
  "./HygyAgreementApproval":
    "./src/components/Workflow/CUX/AgreementApprovalForm/HygyAgreementApproval.vue",
  "./YHL-AgreementApproval":
    "./src/components/Workflow/CUX/AgreementApprovalForm/YHL-AgreementApproval.vue",
  "./Jin-AgreementApproval":
    "./src/components/Workflow/CUX/AgreementApprovalForm/Jin-AgreementApproval.vue",
  "./APG-AgreementApproval":
    "./src/components/Workflow/CUX/AgreementApprovalForm/APG-AgreementApproval.vue",
  "./YXBiddingOpenApproval":
    "./src/components/Workflow/CUX/BiddingOpenApprovalForm/YXBiddingOpenApprovalForm.vue",
  "./YXPrequalificationApproval":
    "./src/components/Workflow/CUX/PrequalificationApprovalForm/YXPrequalificationApprovalForm.vue",
  "./StarBucksPBContractGroupApproval":
    "./src/components/Workflow/CUX/StarBucksPBContractGroupApprovalForm/StarBucksPBContractGroupApproval.vue",
  "./YONGXIANGConfirmCandidateApproval":
    "./src/components/Workflow/CUX/ConfirmCandidateForm/YongXiangApproval.vue",
  "./TestComponentFlow": "./src/components/Workflow/TestComponentFlow.vue",
  "./PrepareApproval":
    "./src/components/Workflow/PrepareApprovalForm/PrepareApproval.vue",
  "./NewPriceApproval":
    "./src/components/Workflow/NewPriceApprovalForm/NewPriceApproval.vue",
  "./PriceAdjustmentApproval":
    "./src/components/Workflow/PriceAdjustmentApprovalForm/PriceAdjustmentApproval.vue",
  "./DownGradeApproval":
    "./src/components/Workflow/DownGradeApprovalForm/DownGradeApproval.vue",
  "./RfxApproval": "./src/components/Workflow/RfxApprovalForm/RfxApproval.vue",
  "./RfxSourceProjectApproval":
    "./src/components/Workflow/RfxSourceProjectApprovalForm/RfxSourceProjectApproval.vue",
  "./PricingApproval":
    "./src/components/Workflow/PricingApprovalForm/PricingApproval.vue",
  "./ConfirmCandidateApproval":
    "./src/components/Workflow/ConfirmCandidateApprovalForm/ConfirmCandidateApproval.vue",
  "./CAICConfirmCandidateApproval":
    "./src/components/Workflow/CUX/ConfirmCandidateApprovalForm/CAICConfirmCandidateApproval.vue",
  "./RecommendApproval":
    "./src/components/Workflow/RecommendApprovalForm/RecommendApproval.vue",
  "./RectifyReportApproval":
    "./src/components/Workflow/RectifyReportApprovalForm/RectifyReportApproval.vue",
  "./EliminateApproval":
    "./src/components/Workflow/EliminateApprovalForm/EliminateApproval.vue",
  "./QualifiedApproval":
    "./src/components/Workflow/QualifiedApprovalForm/QualifiedApproval.vue",
  "./SupplierApproval":
    "./src/components/Workflow/SupplierApprovalForm/SupplierApproval.vue",
  "./CalibrationApproval":
    "./src/components/Workflow/CalibrationApprovalForm/CalibrationApproval.vue",
  "./SupplierCategoryAlterApproval":
    "./src/components/Workflow/SupplierCategoryAlterApprovalForm/SupplierCategoryAlterApproval.vue",
  "./RfIdentifySuppliersApproval":
    "./src/components/Workflow/RfIdentifySuppliersApprovalForm/RfIdentifySuppliersApproval.vue",
  "./SupplierWarehouseApproval":
    "./src/components/Workflow/SupplierWarehouseApprovalForm/SupplierWarehouseApproval.vue",
  "./SupplyAbilityApproval":
    "./src/components/Workflow/SupplyAbilityApprovalForm/SupplyAbilityApproval.vue",
  "./SupplyAbilityDocApproval":
    "./src/components/Workflow/SupplyAbilityApprovalDocForm/SupplyAbilityApprovalDoc.vue",
  "./ProcessChangedApproval":
    "./src/components/Workflow/ProcessChangedApprovalForm/ProcessChangedApproval.vue",
  "./ProjectInfoMaintainApproval":
    "./src/components/Workflow/ProjectInfoMaintainApprovalForm/ProjectInfoMaintainApproval.vue",
  "./MaterielApplicationApproval":
    "./src/components/Workflow/MaterielApplicationApprovalForm/MaterielApplicationApproval.vue",
  "./KpiEvalDetailApproval":
    "./src/components/Workflow/KpiEvalDetailApprovalForm/KpiEvalDetailApproval.vue",
  "./AgreementApproval":
    "./src/components/Workflow/AgreementApprovalForm/AgreementApproval.vue",
  "./SiteInspectionApproval":
    "./src/components/Workflow/SiteInspectionApprovalForm/SiteInspectionApproval.vue",
  "./RfxCloseApproval":
    "./src/components/Workflow/RfxCloseApprovalForm/RfxCloseApproval.vue",
  "./InvestigationApproval":
    "./src/components/Workflow/InvestigationApprovalForm/InvestigationApproval.vue",
  "./SupplierAblilityDefinition":
    "./src/components/Workflow/SupplierAblilityDefinitionForm/SupplierAblilityDefinition.vue",
  "./WeiLongAgreementApproval":
    "/src/components/Workflow/CUX/AgreementApprovalForm/WeiLongAgreementApproval.vue",
  "./DreameImportErpApproval":
    "./src/components/Workflow/CUX/ImportErpApprovalForm/dreameForm.vue",
  "./ArchiveFillingApproval":
    "./src/components/Workflow/ArchiveFillingApprovalForm/ArchiveFillingApproval.vue",
  "./SiteInvesteReportApproval":
    "./src/components/Workflow/SiteInvesteReportApprovalForm/SiteInvesteReportApproval.vue",
  "./HHCLAgreementApproval":
    "./src/components/Workflow/CUX/AgreementApprovalForm/HHCLAgreementApproval.vue",
  "./StarbucksTrialApprovalForm":
    "./src/components/Workflow/CUX/SupplierLifeApprovalForm/StarbucksTrialApproval.vue",
  "./StarbucksLeadApproval":
    "./src/components/Workflow/CUX/SupplierLifeApprovalForm/StarbucksLeadApproval.vue",
  "./StarbucksDevelopApproval":
    "./src/components/Workflow/CUX/SupplierLifeApprovalForm/StarbucksDevelopApproval.vue",
  "./SupplierQuotaManageApproval":
    "./src/components/Workflow/SupplierQuotaManageApprovalForm/SupplierQuotaManageApproval.vue",
  "./CertificationDealApproval":
    "./src/components/Workflow/CertificationDealApprovalForm/CertificationDealApproval.vue",
  "./SupplierEntryApproval":
    "./src/components/Workflow/SupplierEntryApprovalForm/SupplierEntryApproval.vue",
  "./SupplierLifeCycleDetail":
    "./src/modules/SupplierLifeCycle/views/SupplierLifeCycleDetail.vue",
  "./SiteInvestigationReportDetailMaintain":
    "./src/modules/SiteInvestigationReport/views/SiteInvestigationReportDetailMaintain.vue",
  "./ExpertRegistrationApproval":
    "./src/components/Workflow/ExpertRegistrationApprovalForm/ExpertRegistrationApproval.vue",
  "./RfxHallDetail": "./src/modules/RfxHall/views/RfxDetail.vue",
  "./PricingApprovalNew":
    "./src/components/Workflow/PricingApprovalForm/PricingApprovalNew.vue",
  "./PricingApprovalNewComplete":
    "./src/components/Workflow/PricingApprovalForm/PricingApprovalNewComplete.vue",
  "./PricingClarificationApproval":
    "./src/components/Workflow/PricingClarificationApprovalForm/PricingClarificationApproval.vue",
  "./BidHallDetail": "./src/modules/NewBidHall/views/HallDetail.vue",
  "./ContractDetail": "./src/modules/Contract/views/ContractDetail.vue",
  "./LifeCycleApprove":
    "./src/components/Workflow/LifeCycleApproveForm/LifeCycleApprove.vue",
  // 新绩效-新建审批
  "./AppraisalNewApprove":
    "./src/components/Workflow/AppraisalPurchaserForm/NewApprove.vue",
  // 新绩效-分数汇总审批
  "./SummaryScoreApprove":
    "./src/components/Workflow/AppraisalPurchaserForm/SummaryScoreApprove.vue",
  // 新绩效-评分审批
  "./DominosScoreApprove":
    "./src/components/Workflow/CUX/AppraisalPurchaserForm/DominosScoreApprove.vue",
  // 新绩效-评分审批
  "./ScoreApprove":
    "./src/components/Workflow/AppraisalPurchaserForm/ScoreApprove.vue",
  // 新绩效-申诉审批
  "./AppealApprove":
    "./src/components/Workflow/AppraisalPurchaserForm/AppealApprove.vue",
  "./RfxDepositApprovalForm":
    "./src/components/Workflow/RfxDepositApprovalForm/RfxDepositApproval.vue",
  "./RfxWholeApproval":
    "./src/components/Workflow/RfxWholeApprovalForm/RfxWholeApproval.vue",
  "./PurEvaluationApproval":
    "./src/components/Workflow/PurEvaluationApprovalForm/PurEvaluationApproval.vue",
  "./SheDeBoqFormApprovalForm":
    "./src/components/Workflow/CUX/SheDeBoqFormApprovalForm/SheDeBoqFormApprovalForm.vue",
  // 立项关闭审批
  "./RfxSourceProjectCloseApproval":
    "./src/components/Workflow/RfxSourceProjectCloseApprovalForm/RfxSourceProjectCloseApproval.vue",
  "./RfxClarificationLetterApproval":
    "./src/components/Workflow/RfxClarificationLetterApprovalForm/RfxClarificationLetterApproval.vue", // 澄清答疑澄清函发布审批
  // 供应商评估计划审批表单
  "./VendorEvaluationPlanApproval":
    "./src/components/Workflow/VendorEvaluationPlanApprovalForm/VendorEvaluationPlanApproval.vue",
  "./RiskScan": "./src/modules/RiskScan/views/RiskScan.vue",
  // 核价退回审批
  "./BackToCheckPriceApproval": "./src/components/Workflow/PricingApprovalForm/BackToCheckPriceApproval.vue",
  "./QJMTAgreementApproval":
    "./src/components/Workflow/CUX/AgreementApprovalForm/QIMTAgreementApproval.vue",
  "./DEYESupQuotaBatchApproval": "./src/components/Workflow/CUX/DEYESupQuotaBatchApprovalForm/SupQuotaBatchApprovalForm.vue",
  "./3SBIOBatchReqForm":"./src/components/Workflow/CUX/3SBIO_BatchReqForm/BatchReqForm.vue",
  "./AKANSupplierInfoChangeApproval": "./src/components/Workflow/CUX/SupplierInfoChangeApprovalForm/AKANSupplierInfoChangeApproval.vue",
  "./HAISCORDPricingApprovalNew": "./src/components/Workflow/CUX/PricingApprovalForm/HAISCORDPricingApprovalNew.vue",
  './GUYUPurEvaluationApprovalDetailForm': './src/components/Workflow/CUX/GUYUPurEvaluationApprovalDetailForm/PurEvaluationApprovalDetailForm.vue',
};

/**
 * 远程调用配置
 * @type {{}}
 */
const remotes = {
  appCpra: `appCpra@${mobileSrmHost}/appCpra/CpraRemoteEntry.js`,
  // serviceName: `serviceName@${mobileSrmHost}/serviceName/SourRemoteEntry.js`,
};

module.exports = {
  exposes,
  remotes,
  mobileSrmHost,
};
