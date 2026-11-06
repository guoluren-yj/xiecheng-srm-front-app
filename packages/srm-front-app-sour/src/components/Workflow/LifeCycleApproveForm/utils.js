/*
 * @Date: 2023-10-10 11:42:16
 * @Author: LXM <xiaomei.lv@going-link.com>
 * @Version: 0.0.1
 * @Copyright: Copyright (c) 2021, Hand
 */
import { $T } from "srm-mobile-ui";
import { supplyRender } from "../../utils/render";

// 基础信息Columns
export const getBaseInfoColumns = ({ onRelatedForm }) => [
  {
    fieldCode: "realName",
    fieldName: $T("sslm.common.view.creator.name").$D("创建人"),
  },
  {
    fieldCode: "documentNumber",
    fieldName: $T("sslm.common.model.applicationNumber").$D("申请单号"),
  },
  {
    fieldCode: "creationDate",
    fieldName: $T("hzero.common.date.creation").$D("创建时间"),
  },
  {
    fieldCode: "documentFrom",
    fieldName: $T("sslm.common.view.document.source").$D("单据来源"),
    render:(val, record) => record.documentFromMeaning || $T("sslm.common.documentFrom.manualCreation").$D("手工创建"),
  },
  {
    fieldCode: "documentType",
    fieldName: $T("sslm.common.view.document.type").$D("单据类型"),
    render:(val, record) => record.documentTypeMeaning || (val === "NORMAL" ? $T("sslm.common.documentType.normal").$D("升降级申请") : $T("sslm.common.documentType.special").$D("特批申请")),
  },
  {
    fieldCode: "dimensionCode",
    fieldName: $T("sslm.supplierLifeManage.model.supplier.dimension").$D("管控维度"),
    render:(val, record) => record.dimensionCodeMeaning || (val === "COMPANY" ? $T("sslm.common.dimension.company").$D("公司级") : $T("sslm.common.dimension.group").$D("集团级")),
  },
  {
    fieldCode: "remark",
    fieldName: $T("sslm.common.model.instructions").$D("说明"),
    render:(val) => <span style={{ whiteSpace: "pre-wrap" }}>{val || "-"}</span>,
  },
  {
    fieldName: $T("sslm.supplierDetail.button.relatedForm").$D("关联单据"),
    fieldCode: "relatedForm",
    render: () => <SrmButton plain rect onClick={onRelatedForm} size="small">
      {
        $T("sslm.supplierDetail.button.seeRelatedForm").$D("查看关联单据")
      }
    </SrmButton>
  }
];

// 状态信息Columns
export const getStatusInfoColumns = () => [
  {
    fieldCode: "blacklistFlag",
    fieldName: $T("sslm.common.model.blacklist").$D("黑名单"),
    visible:(val, record) => record.toStageCode === "ELIMINATED",
    render: (val) => Number(val) === 1 ? $T("smbl.common.view.yes").$D("是") : $T("smbl.common.view.no").$D("否"),
  },
  {
    fieldCode: "blacklistDateTypeMeaning",
    fieldName: $T("sslm.common.model.timeLimit").$D("期限"),
    visible:(val, record) => record.toStageCode === "ELIMINATED",
  },
  {
    fieldCode: "blacklistStartDate",
    fieldName: $T("sslm.common.model.dateFrom").$D("有效期从"),
    visible:(val, record) => record.toStageCode === "ELIMINATED",
  },
  {
    fieldCode: "blacklistEndDate",
    fieldName: $T("sslm.common.model.dateTo").$D("有效期至"),
    visible:(val, record) => record.toStageCode === "ELIMINATED",
  },
  {
    fieldCode: "tempFlag",
    fieldName: $T("sslm.common.stage.temporary").$D("临时"),
    render: (val) => Number(val) === 1 ? $T("smbl.common.view.yes").$D("是") : $T("smbl.common.view.no").$D("否"),
  },
  {
    fieldCode: "tempEndDate",
    fieldName: $T("sslm.common.model.dateTo").$D("有效期至"),
  },
];

// 其他信息Columns
export const getOtherInfoColumns = () => [
  {
    fieldCode: "purchaseAgentIdMeaning",
    fieldName: $T("sslm.common.model.buyer").$D("采购员"),
    render:(_, record) => {
      const purchaseAgentNames = (record.purchaseAgentIdMeaning || []).map((n) => n.purchaseAgentName).join("、");
      return purchaseAgentNames;
    },
  },
  {
    fieldCode: "termIdMeaning",
    fieldName: $T("sslm.common.model.paymentTerms").$D("付款条款"),
  },
  {
    fieldCode: "typeCodeMeaning",
    fieldName: $T("sslm.common.model.paymentWay").$D("付款方式"),
  },
];

// 供货能力清单Columns
export const getSupplierAbilityColumns = ({ onAttachment }) => [
  {
    fieldCode: "customHeader",
    fieldType: "EMPTY",
    render: (val, item) => <div style="width:100%;display: flex;align-items: center;">
      <span style={{ fontWeight:600 }}>{item.itemName || "-"}</span>
      <div style="display: flex;align-items: center;marginLeft:auto">
        <span style={{ marginRight:"8px" }}>{supplyRender(item.supplyFlag)}</span>
        <span class="srm-icon icon-chevron-right" style={{ fontSize:"16px" }}/>
      </div>
    </div>
  },
  {
    fieldCode: "itemCode",
  },
  {
    fieldCode: "itemCategoryCode",
  },
  {
    fieldCode: "itemCategoryName",
  },
  {
    fieldCode: "attachment",
    render:(_, record) => <a style={{ color: "var(--font-color-primary)" }} onClick={(e) => {
      e.stopPropagation();
      onAttachment(record);
    }}>{$T("hipspfm.common.button.viewAttachments").$D("查看附件")}({record.fileCount || 0})</a>,
  },
];

// 供货能力清单明细Columns
export const getSupplierAbilityAllColumns = ({ onAttachment }) => [
  {
    fieldCode: "itemCode",
    fieldName: $T("sslm.supplyAbility.model.supplyAbility.itemCode").$D("物料编码"),
  },
  {
    fieldCode: "itemName",
    fieldName: $T("sslm.common.item.itemName").$D("物料名称"),
  },
  {
    fieldCode: "itemCategoryCode",
    fieldName: $T("sslm.common.category.categoryCode").$D("品类编码"),
  },
  {
    fieldCode: "itemCategoryName",
    fieldName: $T("sslm.supplyAbility.model.supplyAbility.categoryName").$D("品类名称"),
  },
  {
    fieldCode: "supplyFlag",
    fieldName: $T("sslm.supplyAbility.model.supplyAbility.supplyFlag").$D("是否可供"),
    render: (val) => Number(val) === 1 ? $T("smbl.common.view.yes").$D("是") : $T("smbl.common.view.no").$D("否"),
  },
  {
    fieldCode: "adapterProducts",
    fieldName: $T("sslm.supplyAbility.model.supplyAbility.adapterProducts").$D("适配产品"),
  },
  {
    fieldCode: "countryIdMeaning",
    fieldName: $T("sslm.supplyAbility.model.supplyAbility.countryIdMeaning").$D("服务国家"),
  },
  {
    fieldCode: "regionIdMeaning",
    fieldName: $T("sslm.supplyAbility.model.supplyAbility.regionIdMeaning").$D("服务地区"),
  },
  {
    fieldCode: "cityIdMeaning",
    fieldName: $T("sslm.supplyAbility.model.supplyAbility.cityIdMeaning").$D("服务城市"),
  },
  {
    fieldCode: "dateFrom",
    fieldName: $T("sslm.supplyAbility.model.supplyAbility.dateFrom").$D("有效期从"),
  },
  {
    fieldCode: "dateTo",
    fieldName: $T("sslm.supplyAbility.model.supplyAbility.dateTo").$D("有效期至"),
  },
  {
    fieldCode: "supplyStatus",
    fieldName: $T("sslm.supplyAbility.model.supplyAbility.supplyStatus").$D("可供状态"),
  },
  {
    fieldCode: "psaEvaluationLevel",
    fieldName: $T("sslm.supplyAbility.model.supplyAbility.psaEvaluationLevel").$D("PSA评级"),
  },
  {
    fieldCode: "psaEvaluationScore",
    fieldName: $T("sslm.supplyAbility.model.supplyAbility.psaEvaluationScore").$D("PSA评分"),
  },
  {
    fieldCode: "psaFinishDate",
    fieldName: $T("sslm.supplyAbility.model.supplyAbility.psaFinishDate").$D("PSA完成时间"),
  },
  {
    fieldCode: "spaEvaluationLevel",
    fieldName: $T("sslm.supplyAbility.model.supplyAbility.spaLevel").$D("SPA评级"),
  },
  {
    fieldCode: "spaEvaluationScore",
    fieldName: $T("sslm.supplyAbility.model.supplyAbility.spaScore").$D("SPA评分"),
  },
  {
    fieldCode: "spaFinishDate",
    fieldName: $T("sslm.supplyAbility.model.supplyAbility.spaFinishDate").$D("SPA完成时间"),
  },
  {
    fieldCode: "evaluateRemark",
    fieldName: $T("sslm.common.model.evaluateRemark").$D("评价信息"),
  },
  {
    fieldCode: "inventoryOrganizationPrint",
    fieldName: $T("sslm.supplyAbility.model.supplyAbility.inventoryOrganization")
      .$D("库存组织"),
  },
  {
    fieldCode: "purchaseOrganizationName",
    fieldName: $T("sslm.supplyAbility.model.supplyAbility.purchasingOrganization")
      .$D("采购组织"),
  },
  {
    fieldCode: "manufacturer",
    fieldName: $T("sslm.supplyAbility.model.supplyAbility.manufacturer").$D("生产厂家"),
  },
  {
    fieldCode: "attachment",
    fieldName: $T("hzero.common.upload.modal.title").$D("附件"),
    render:(_, record) => <a style={{ color: "var(--font-color-primary)" }} onClick={(e) => {
      e.stopPropagation();
      onAttachment(record);
    }}>{$T("hipspfm.common.button.viewAttachments").$D("查看附件")}({record.fileCount || 0})</a>,
  },
];

// 采购财务头信息Columns
export const getPurchaseHeaderColumns = () => [
  {
    fieldCode: "purchaseHeaderInfo",
    fieldType: "EMPTY",
    render: () => <div style="width:100%;display: flex;align-items: center;font-weight:600">
      {$T("sslm.common.view.title.purchaseHeaderInfo").$D("采购财务头信息")}
    </div>
  },
  {
    fieldCode: "programmeGroupsMeaning",
    fieldName: $T("spfm.importErp.model.importErp.planGroups").$D("计划组"),
    formRow: 10,
  },
  {
    fieldCode: "schemeGroup",
    fieldName: $T("sslm.supplierInform.model.supplierInform.schemeGroup").$D("方案组"),
    formRow: 10,
  },
  {
    fieldCode: "accountGroupMeaning",
    fieldName: $T("sslm.supplierInform.model.supplierInform.accountGroup").$D("账户组"),
    formRow: 20,
  },
  {
    fieldCode: "reconciliationAccountMeaning",
    fieldName: $T("sslm.supplierInform.model.supplierInform.controlAccount").$D("统驭科目"),
    formRow: 30,
  },
  {
    fieldCode: "ouCode",
    fieldName: $T("sslm.supplierInform.model.supplierInform.erpCompanyCode").$D("erp公司代码"),
    formRow: 40,
  },
  {
    fieldCode: "termIdMeaning",
    fieldName: $T("sslm.common.model.paymentTerms").$D("付款条款"),
    formRow: 50,
  },
  {
    fieldCode: "frozenFlag",
    fieldName: $T("sslm.supplierInform.model.supplierInform.accountFlag").$D("记账冻结"),
    formRow: 60,
    render: (val) => Number(val) === 1 ? $T("smbl.common.view.yes").$D("是") : $T("smbl.common.view.no").$D("否"),
  },
  {
    fieldCode: "paymentFrozenMeaning",
    fieldName: $T("spfm.importErp.model.importErp.paymentFreezeCode").$D("记账冻结代码"),
    formRow: 60,
  },
];

// 采购财务行信息Columns
export const getPurchaseColumns = () => [
  {
    fieldCode: "purchaseLineInfo",
    fieldType: "EMPTY",
    render: () => <div style="width:100%;display: flex;align-items: center;font-weight:600">
      {$T("sslm.common.view.title.purchaseLineInfo").$D("采购财务行信息")}
    </div>
  },
  {
    fieldCode: "organizationName",
    fieldType: "EMPTY",
    formRow: 10,
    render: (val, item) => <SrmListHeader showOpenTag={false} style={{ fontWeight:600 }}>
      <span>{item.organizationName}</span>
    </SrmListHeader>
  },
  {
    fieldCode: "purchaseAgentName",
    formRow: 20,
  },
  {
    fieldCode: "termName",
    formRow: 30,
  },
  {
    fieldCode: "typeName",
    formRow: 30,
  },
  {
    fieldCode: "tradeTermsMeaning",
    formRow: 40,
  },
  {
    fieldCode: "tradeTermsSite",
    formRow: 40,
  },
  {
    fieldCode: "currencyName",
    formRow: 50,
  },
  {
    fieldCode: "reconciliationAccountMeaning",
    formRow: 60,
  },
  {
    fieldCode: "sortNumber",
    formRow: 70,
  },
  {
    fieldCode: "frozenFlag",
    formRow: 70,
    render: (val) => Number(val) === 1 ? $T("smbl.common.view.yes").$D("是") : $T("smbl.common.view.no").$D("否"),
  },
];

// 附件信息Columns
export const getAttachmentColumns = () => [
  {
    fieldCode: "attachmentUuid",
    fieldType: "EMPTY",
    render: (val, item) => <SrmFlex
      class="attachment-uuid-field"
    >
      <span class="srm-icon icon-other"/>
      <SrmAttachmentButton
        showTotal
        attachments={[
          {
            attachmentUuid: item.attachmentUuid,
            bucketName: "private-bucket",
            readonly:true,
            showInfo: true,
            uploadButton:"none",
          },
        ]}
      />
      <span class="srm-icon icon-chevron-right" />
    </SrmFlex>,
  },
];

// 天齐锂业 == 供应商来源说明
export const getSupplierSourceDescColumns = () => [
  {
    fieldCode: "attributeVarchar5Meaning",
    fieldName: $T("sslm.common.cux.tqly.supplierSource").$D("供应商来源"),
  },
  {
    fieldCode: "attributeVarchar6",
    fieldType: "UPLOAD",
    bucketName: "private-bucket",
    fieldName: $T("sslm.common.cux.tqly.sourceAttachment").$D("来源附件"),
  },
  {
    fieldCode: "attributeLongtext3",
    fieldName: $T("sslm.common.cux.tqly.sourceDesc").$D("来源说明"),
  },
];