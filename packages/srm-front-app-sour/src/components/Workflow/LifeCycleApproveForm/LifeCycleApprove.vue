<!--
 * @Date: 2023-10-10 10:21:54
 * @Author: LXM <xiaomei.lv@going-link.com>
 * @Version: 0.0.1
 * @Copyright: Copyright (c) 2021, Hand
-->
<template>
  <section>
    <srm-scroll-tab customize-code="SMBL.WORKFLOW.LIFECYCLE_APPROVAL.TABS">
      <ai-tip-section
        v-if="baseInfoData.aiApproveStatus"
        key="aiTipSection"
        :ai-approve-status="baseInfoData.aiApproveStatus"
        :ai-review-params="baseInfoData.aiApproveDTOList" />
      <srm-scroll-tab-item
        code="baseInfo"
        :label="$T('sslm.common.view.title.baseInfo').$D('基础信息')">
        <div class="life-cycle-supplier">
          <div class="life-cycle-supplier-top">
            <div>
              <img src="@/assets/life_cycle_supplier.svg" >
            </div>
            <div>
              <div class="life-cycle-supplier-name" @click="jumpTo360">
                {{ baseInfoData.supplierCompanyName }}
              </div>
              <div class="life-cycle-company-name">
                <span>{{ $T('sslm.common.view.company.name').$D('公司') }}：{{ baseInfoData.companyName||"-" }}</span>
              </div>
            </div>
          </div>
          <div class="life-cycle-supplier-bottom">
            {{ baseInfoData.fromStageDescription }}
            <img v-if="baseInfoData.gradeType === 'DEGRADE'" src="@/assets/degraded.svg" >
            <img v-if="baseInfoData.gradeType !== 'DEGRADE'" src="@/assets/upgrade.svg" >
            {{ baseInfoData.toStageDescription }}
          </div>
        </div>
        <customize
          need-padding
          :data-source="baseInfoData"
          :columns="baseInfoColumns"
          code="SMBL.WORKFLOW.LIFECYCLE_APPROVAL.BASIC"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        v-if="baseInfoData.toStageCode === 'ELIMINATED'"
        code="statusInfo"
        :label="$T('sslm.common.view.title.statusInfo').$D('状态信息')">
        <customize
          need-padding
          :data-source="baseInfoData"
          :columns="statusInfoColumns"
          code="SMBL.WORKFLOW.LIFECYCLE_APPROVAL.STATUS"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        code="otherInfo"
        :label="$T('sslm.common.view.title.otherInfo').$D('其他信息')">
        <customize
          need-padding
          :data-source="baseInfoData"
          :columns="otherInfoColumns"
          code="SMBL.WORKFLOW.LIFECYCLE_APPROVAL.OTHERS"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        code="supplierAbility"
        :label="$T('sslm.common.view.supplier.ability').$D('供货能力清单')">
        <srm-list
          :data-set="supplierAbilityDs"
          :scrollable="false"
          :columns="supplierAbilityColumns"
          customize-code="SMBL.WORKFLOW.LIFECYCLE_APPROVAL.SUPPLIER_ABILITY"
          @itemClick="handleAbilityItemClick"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        code="supplierClassify"
        :show-title="false"
        :label="$T('sslm.common.view.supplier.class').$D('供应商分类')">
        <div
          class="srm-scroll-tab-item-title"
          style="display: flex; justify-content: space-between">
          {{ $T('sslm.common.view.supplier.class').$D('供应商分类') }}
          <span v-if="workFlowEdit" class="new">
            <em class="srm-icon icon-plus" @click="addClassify"/>
          </span>
        </div>
        <srm-list
          :data-set="supplierClassifyDs"
          :scrollable="false"
          :columns="supplierClassifyColumns"
          customize-code="SMBL.WORKFLOW.LIFECYCLE_APPROVAL.SUPPLIER_CLASS"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        code="purchaseInfo"
        :label="$T('sslm.common.view.title.purchaseInfo').$D('采购财务信息')">
        <customize
          need-padding
          :data-source="purchaseHeaderData"
          :columns="purchaseHeaderColumns"
          code="SMBL.WORKFLOW.LIFECYCLE_APPROVAL.PURCHASE_HEADER"/>
        <srm-list
          :data-set="purchaseLineDS"
          :scrollable="false"
          :columns="purchaseColumns"
          customize-code="SMBL.WORKFLOW.LIFECYCLE_APPROVAL.PURCHASE_LINES"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        v-if="supplierSourceDescFlag"
        code="supplierSourceDesc"
        :label="$T('sslm.common.cux.tqly.supplierSourceDesc').$D('供应商来源说明')">
        <customize
          need-padding
          :data-source="baseInfoData"
          :columns="supplierSourceDescColumns"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        code="attachmentInfo"
        :label="$T('sslm.common.model.evaluation.attachment').$D('附件')">
        <customize
          need-padding
          :data-source="baseInfoData"
          :columns="attachmentColumns"/>
      </srm-scroll-tab-item>
      <component :is="renderCuxTabItem()" />
    </srm-scroll-tab>
  </section>
</template>

<script>
import { isEmpty } from "lodash";
import { $T, DataSet, SrmUtil } from "srm-mobile-ui";
import { fetchBasicInfoApi, fetchAbilityAttachment, fetchPurchaseHeader, deleteClassify, saveApplication, shedeCheckApplication } from "./api/index";
import { getSupplierAbilityDS } from "./datasource/getSupplierAbilityDS";
import { getSupplierClassifyDS } from "./datasource/getSupplierClassifyDS";
import { getPurchaseLineDS } from "./datasource/getPurchaseInfoDS";
import SupplierRelatedForm from "@/components/SupplierRelatedDoc/SupplierRelatedForm";
import { enableRender } from "@/components/utils/render";
import AiTipSection from "@/components/AiTipSection/AiTipSection.vue";
import { getBaseInfoColumns, getStatusInfoColumns, getOtherInfoColumns, getSupplierAbilityColumns, getSupplierAbilityAllColumns, getAttachmentColumns, getPurchaseColumns, getPurchaseHeaderColumns, getSupplierSourceDescColumns } from "./utils";
import { getCUXTabItem } from "./components/cux/index.js";

export default {
  modules: [ "hipspfm.common", "hipspfm.workFlow", "sslm.commonApplication", "sslm.supplyAbility", "sslm.supplierDetail", "sslm.common", "sslm.supplierReview", "sslm.sample", "sslm.siteInvestigateReport", "spcm.common", "spcm.purchaseContractView", "spcm.contractTemplate", "spcm.purchaseContractType", "sslm.investigationCorrelation", "smbl.common", "sslm.evaluationQuery", "sslm.supplierDocManage", "sslm.evaluationRecord", "sslm.supplierManage", "sslm.workbench", "sslm.evaluationTemplate", "ssrc.inquiryHall", "sqam.common", "entity.supplier", "entity.company", "entity.organization", "entity.item", "entity.roles", "hzero.common", "sslm.material", "hzero.button", "sslm.investigationCorrelation", "sslm.common", "sslm.supplierReview", "sslm.sample", "sslm.siteEvalHeader", "sslm.siteInvestigateReport", "ssrc.supplyInfoChange", "sslm.evaluationQuery", "sslm.supplierDocManage", "sslm.evaluationRecord", "sslm.supplierManage", "sslm.workbench", "sslm.evaluationTemplate", "ssrc.inquiryHall", "sqam.common", "entity.supplier", "entity.company", "entity.organization", "entity.item", "entity.roles", "hzero.common", "sslm.material", "hzero.button", "sslm.investigationCorrelation", "sslm.common", "sslm.supplierReview", "sslm.sample", "sslm.siteInvestigateReport", "spcm.purchaseContractType", "scux.relationSupplier", "sslm.supplierLifeManage", "sslm.supplierInform", "spfm.importErp", "sslm.supplierWarehouse", "sslm.purchaserEvaluation", "sslm.purchaserEvaluationDetail" ],
  name: "LifeCycleApprove",
  components: { AiTipSection },
  props:{
    parameters: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      baseInfoData:{},
      purchaseHeaderData:{},
      documentType:this.parameters.documentType,
      requisitionId:this.parameters.requisitionId,
      baseInfoColumns:getBaseInfoColumns({ onRelatedForm:this.showRelatedForm }),
      statusInfoColumns: getStatusInfoColumns(),
      otherInfoColumns: getOtherInfoColumns(),
      supplierSourceDescColumns:getSupplierSourceDescColumns(),
      supplierAbilityColumns:getSupplierAbilityColumns({ onAttachment:this.handleAbilityAttachment }),
      supplierAbilityAllColumns:getSupplierAbilityAllColumns({ onAttachment:this.handleAbilityAttachment }),
      attachmentColumns: getAttachmentColumns(),
      purchaseColumns: getPurchaseColumns(),
      purchaseHeaderColumns: getPurchaseHeaderColumns(),
      supplierAbilityDs: new DataSet(getSupplierAbilityDS({ requisitionId:this.parameters.requisitionId })),
      supplierClassifyDs: new DataSet(getSupplierClassifyDS({ requisitionId:this.parameters.requisitionId })),
      purchaseLineDS: new DataSet(getPurchaseLineDS({ requisitionId:this.parameters.requisitionId })),
      unitCodeList:[
        "SSLM.LIFE_CYCLE.DOCUMENTS_DETAIL.BASE_INFO",
        "SSLM.LIFE_CYCLE.DOCUMENTS_DETAIL.OTHER_INFO",
        "SSLM.LIFE_CYCLE.DOCUMENTS_DETAIL.STATUS_INFO",
        "SSLM.LIFE_CYCLE.DOCUMENTS_DETAIL.SUPPLIER_ABILITY",
        "SSLM.LIFE_CYCLE.DOCUMENTS_DETAIL.SUPPLIER_CLASSIFY",
        "SSLM.LIFE_CYCLE.DOCUMENTS_DETAIL.PURCHASE_INFO",
        "SSLM.LIFE_CYCLE.DOCUMENTS_DETAIL.PURCHASE_LINE",
      ],
    };
  },
  computed:{
    getTenantNum() {
      return window.localStorage.getItem("tenantNum");
    },
    // 舍得基于标准二开，供应商分类可编辑（src-39795）
    workFlowEdit() {
      return SrmUtil.getTenantNum() === "SRM-SHEDE" && Number(this.parameters.pubEdit) === 1;
    },
    // 仅天齐锂业展示供应商来源说明(src-42169)
    supplierSourceDescFlag() {
      return SrmUtil.getTenantNum() === "SRM-TQLY";
    },
    // 供应商分类Columns
    supplierClassifyColumns () {
      return [
        {
          fieldCode: "categoryDescription",
          editor:this.workFlowEdit,
          fieldType: this.workFlowEdit ? "TREE" : "EMPTY",
          render: (val, item) => <div style="width:100%;display: flex;align-items: center;">
            <span style={{ fontWeight:600 }}>{item.categoryDescription}</span>
            {!this.workFlowEdit && <span style={{ marginLeft:"auto" }}> {enableRender(item.enabledFlag)}</span>}
          </div>
        },
        {
          fieldCode: "evaluationLevel",
          editor:this.workFlowEdit,
        },
        {
          fieldCode: "evaluationScore",
          editor:this.workFlowEdit,
        },
        this.workFlowEdit && {
          fieldCode: "enabledFlag",
          editor:this.workFlowEdit,
        },
        {
          fieldCode: "alterDate",
        },
        {
          fieldCode: "alterReason",
          editor:this.workFlowEdit,
          fieldType:this.workFlowEdit ? "TEXT_AREA" : "TEXT",
          placeholder:" ",
        },
        {
          fieldCode: "realName",
        },
        {
          formRow: 99999,
          fieldType: "EMPTY",
          visible: (val, item) => !item.isRequisitionAddFlag && this.workFlowEdit,
          render: (val, record) => <srm-flex justify="end">
            <srm-button style="margin-right: 5px" type="primary" size="mid" bordered onClick={() => this.deleteCheck("classify", record)}>
              { $T("smbl.common.button.delete").$D("删除")}
            </srm-button>
          </srm-flex>
        },
      ];
    }
  },
  mounted() {
    if (this.requisitionId) {
      this.getBaseInfoData();
      this.getPurchaseHeader();
    }
  },
  methods: {
    // 审批前调用保存
    beforeApprove(approveResult) {
      return new Promise((resolve, reject) => {
        if (approveResult === "Approved") {
          const validateFlag = this.supplierClassifyDs.validate();
          if (!validateFlag) {
            reject(false);
          } else {
            // 舍得审批通过增加分类至少维护一条的校验
            if (this.workFlowEdit) {
              const classifyData = this.supplierClassifyDs.toData();
              if (isEmpty(classifyData)) {
                shedeCheckApplication(); // 前端无法自定义报错，后端报错
                reject(false);
                return false;
              }
            }
            const payload = {
              ...this.baseInfoData,
              customizeUnitCode: this.unitCodeList.join(","),
              lifeCycleChangeCtgAlterLines: this.supplierClassifyDs.data,
            };
            saveApplication(payload).then((res) => {
              if (res) {
                resolve(true);
              } else {
                reject(false);
              }
            });
          }
        } else {
          resolve(true);
        }
      });
    },
    // 查询基础信息
    getBaseInfoData() {
      fetchBasicInfoApi(this.requisitionId).then((response) => {
        this.baseInfoData = response;
      });
    },
    // 查询采购财务头信息
    getPurchaseHeader() {
      fetchPurchaseHeader(this.requisitionId).then((response) => {
        this.purchaseHeaderData = response;
      });
    },
    // 供货能力清单详情
    handleAbilityItemClick(item) {
      this.$popup({
        title: this.$T("sslm.common.view.supplier.ability").$D("供货能力清单"),
        showHeader: true,
        showClose: false,
        position: "right",
        headerAlign: "center",
        showBack: true,
        content:<customize-detail
          need-padding
          data-source={item.data}
          columns={this.supplierAbilityAllColumns}
          code="SMBL.WORKFLOW.LIFECYCLE_APPROVAL.SUPPLIER_ABILITY_DETAIL"
        />
      });
    },
    // 查看供货能力清单附件
    handleAbilityAttachment(record) {
      fetchAbilityAttachment({
        requisitionId: record.requisitionId,
        supplyRecordId: record.supplyRecordId,
      }).then((response) => {
        if (response) {
          this.$showFileList({
            fileList: response.content.map((e) => ({
              fileUrl: e.attachmentUrl,
              fileName: e.attachmentDesc,
              fileSize: e.attachmentSize,
              creationDate: e.creationDate,
              bucketName: "private-bucket",
            }))
          });
        }
      });
    },
    // 跳转360详情
    jumpTo360() {
      const {
        spfmCompanyId,
        spfmPartnerCompanyId,
        tenantId,
        companyId,
        supplierCompanyId,
        supplierTenantId
      } = this.baseInfoData;
      this.$router.push({
        path: "/appSour/SupplierLifeCycleDetail",
        query: {
          spfmCompanyId,
          tenantId,
          companyId,
          supplierCompanyId,
          partnerTenantId:supplierTenantId,
          spfmSupplierCompanyId:spfmPartnerCompanyId,
        }
      });
    },
    // 查看关联单据
    showRelatedForm() {
      this.$popup({
        title: this.$T("sslm.supplierDetail.button.relatedForm").$D("关联单据"),
        showHeader: true,
        showClose: false,
        position: "right",
        showBack: true,
        content: <SupplierRelatedForm
          supplierCompanyId={this.baseInfoData.supplierCompanyId}
          requisitionId={this.baseInfoData.requisitionId}
          toStageId={this.baseInfoData.toStageId}
          companyId={this.baseInfoData.companyId}
          parentRouter={this.$router}
        />,
      });
    },
    // 新建供应商分类
    addClassify() {
      this.supplierClassifyDs.create({
        enabledFlag:1,
      }, 0);
    },
    // tab页删除数据二次确认提示
    deleteCheck(type, record) {
      const that = this;
      this.$dialog({
        content:
          this.$T("smbl.common.message.confirm.delete").$D("确认删除吗?"),
        closable: false,
        onOk() {
          that.deleteHandle(type, record);
        }
      });
    },
    // tab页删除数据提示
    deleteHandle(type, record) {
      if (type === "classify") {
        // 删除供应商分类
        this.deleteClassify(record);
      }
    },
    deleteClassify(record) {
      if (typeof record.categoryAlterLineId === "undefined") {
        this.supplierClassifyDs.removeLocalRecords([ this.supplierClassifyDs.current ]);
      } else {
        const params = {
          requisitionId:this.requisitionId,
          data: [ record.categoryAlterLineId ]
        };
        deleteClassify(params).then(() => {
          this.supplierClassifyDs.refresh();
        });
      }
    },
    renderCuxTabItem() {
      return getCUXTabItem({
        baseInfoData:this.baseInfoData,
        parameters:this.parameters,
      });
    }
  }
};
</script>

<style lang="stylus" scoped>
  .life-cycle-supplier{
    margin: 0 16px;
    padding: 16px 0 0;
    display: flex;
    flex-direction: column;
    .life-cycle-supplier-top{
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      >div{
        &:first-child{
          width: 36px;
          margin-right: 8px;
          img{
            width:100%;
            height:100%;
          }
        }
      }
      .life-cycle-supplier-name{
        font-size: 14px;
        color: #276EF1;
        font-weight: 600;
        margin-bottom: 2px;
      }
      .life-cycle-company-name{
        font-size: 12px;
        color: #868D9C;
        line-height: 20px;
        font-weight: 400;
      }
    }
    .life-cycle-supplier-bottom{
      text-align: center;
      background: #F7F8FA;
      border-radius: 2px;
      padding: 12px 0;
      font-size: 16px;
      color: #333333;
      font-weight: 600;
      >img{
        margin: 0 70px;
      }
    }
  }
  >>> .attachment-uuid-field{
    height:34px;
    .srm-icon.icon-other{
      color: #febf43;
      font-size: 28px;
    }
    .srm-attachment-button{
      margin-left:8px;
      flex-grow: 1;
      display:flex;
      .srm-button{
        flex-grow: 1;
        text-align: left;
        font-weight: 400;
        .srm-button-text{
          font-size: 14px;
          color: #333;
          font-weight: 400;
          width: 100%;
        }
      }
    }
  }
</style>
