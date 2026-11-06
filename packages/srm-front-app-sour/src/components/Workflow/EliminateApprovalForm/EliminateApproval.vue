<template>
  <srm-scroll-tab v-if="headInfo" content-scroll customize-code="SMBL.WORKFLOW.DOWN_GRADE_APPROVAL.TABS">
    <srm-scroll-tab-item :label="$T('hipspfm.workFlow.view.message.applicationHeader').$D('申请头信息')" code="header">
      <customize
        style="padding-top: 10px"
        :columns="columns" code="SMBL.WORKFLOW.DOWN_GRADE_APPROVAL.HEADER" :data-source="headInfo"
        need-padding/>
    </srm-scroll-tab-item>
    <srm-scroll-tab-item v-if="isShowSupplyCategory" :label="$T('sslm.supplierDetail.view.message.title.supplierClass').$D('供应商分类')" code="supplierClass">
      <srm-list :data-set="supplyCategoryDS"
                :scrollable="false"
                :columns="getSupplyCategoryColumns()"
                customize-code="SMBL.WORKFLOW.QUALITY_APPROVAL.SUPPLY_CATEGORY"/>
    </srm-scroll-tab-item>
  </srm-scroll-tab>
</template>

<script>
import { getOrderHeadInfoApi } from "./api";
import supplyCategoryDS from "../QualifiedApprovalForm/datasource/SupplyCategoryDS";
import { DataSet } from "srm-mobile-ui";
import SupplierRelatedForm from "../../SupplierRelatedDoc/SupplierRelatedForm";

export default {
  modules: [ "hipspfm.common", "hipspfm.workFlow", "sslm.supplierDetail", "sslm.commonApplication", "sslm.common", "sslm.supplierReview", "sslm.sample", "sslm.siteEvalHeader", "sslm.siteInvestigateReport", "spcm.common", "spcm.purchaseContractView", "spcm.contractTemplate", "sslm.investigationCorrelation", "spcm.purchaseContractType", "smbl.common", "ssrc.inquiryHall", "sqam.common", "hzero.button", "sslm.evaluationQuery", "sslm.supplierDocManage", "sslm.evaluationRecord", "sslm.supplierManage", "sslm.workbench", "sslm.evaluationTemplate", "entity.supplier", "entity.company", "entity.organization", "entity.item", "entity.roles", "hzero.common", "sslm.material", "ssrc.supplyInfoChange", "sagm.common", "spcm.purchaseRequisitionCreation", "ssrc.common", "hipspfm.workFlowAgrement", "sodr.common", "small.common", "entity.attachment", "sqam.inquiryHall", "ssrc.bidHall", "ssrc.priceLibrary", "ssrc.supplierQuotation", "ssrc.queryRfq", "hipspfm.expertScoring", "hipspfm.invoiceBill", "ssrc.bidHall", "smbl.inquiryHall" ],
  name: "EliminateApproval",
  filters: {},
  props: {
    changeReqId: {
      type: String | Number,
      default: ""
    },
    showFilePop: {
      type: Function
    }
  },
  data() {
    return {
      supplyCategoryDS: new DataSet(supplyCategoryDS(this)),
      headInfo: {},
      degradeAttachmentLines: [],
      isShowSupplyCategory: true,
      columns: [ {
        fieldCode: "degradeNumber",
        fieldName: this.$T("sslm.commonApplication.model.coApp.applicationNumber").$D("申请单编号"),
      }, {
        fieldCode: "supplierCompanyNum",
        fieldName: this.$T("sslm.commonApplication.model.coApp.supplierCompanyNum").$D("供应商编码"),
        render:(val, record) => <a style={{ color: "var(--font-color-primary)" }} onClick={() => this.jumpTo360(record)}>{val}</a>,
      }, {
        fieldCode: "supplierCompanyName",
        fieldName: this.$T("sslm.commonApplication.model.commonApplication.supplierCompanyName").$D("供应商名称"),
      }, {
        fieldCode: "creationDate",
        fieldName: this.$T("sslm.commonApplication.model.conApp.createDate").$D("创建日期"),
      }, {
        fieldCode: "realName",
        fieldName: this.$T("sslm.commonApplication.model.coApp.LoginName").$D("创建人"),
      }, {
        fieldCode: "stageDescription",
        fieldName: this.$T("sslm.commonApplication.model.coApp.stageDescription").$D("当前阶段"),
      }, {
        fieldCode: "targetStageDescription",
        fieldName: this.$T("sslm.commonApplication.model.coApp.targetStageDesc").$D("目标阶段"),
      }, {
        fieldCode: "companyName",
        fieldName: this.$T("sslm.commonApplication.model.commonApplication.companyName").$D("公司名称"),
      }, {
        fieldCode: "degradeTypeMeaning",
        fieldName: this.$T("sslm.commonApplication.model.coApp.degradeTypeMeaning").$D("操作类型"),
      }, {
        fieldCode: "blacklistFlag",
        fieldName: this.$T("sslm.commonApplication.model.commonApplication.blacklistFlag").$D("加入黑名单"),
        render: (val) => val ? this.$T("hipspfm.common.status.yes").$D("是") : this.$T("hipspfm.common.status.no").$D("否")
      }, {
        fieldCode: "foreverBlacklistFlag",
        fieldName: this.$T("sslm.commonApplication.model.coApp.foreverBlacklistFlag").$D("永久黑名单"),
        render: (val) => val ? this.$T("hipspfm.common.status.yes").$D("是") : this.$T("hipspfm.common.status.no").$D("否")
      }, {
        fieldCode: "blacklistExpiryDate",
        fieldName: this.$T("sslm.commonApplication.model.commonApplication.blacklistExpiryDate").$D("黑名单失效时间"),
      }, {
        fieldCode: "authorizeFlag",
        fieldName: this.$T("sslm.commonApplication.model.supplier.authorized").$D("是否特准"),
        render: (val) => val ? this.$T("hipspfm.common.status.yes").$D("是") : this.$T("hipspfm.common.status.no").$D("否"),
      }, {
        fieldCode: "processStatusMeaning",
        fieldName: this.$T("sslm.commonApplication.model.commonApplication.procStatus").$D("状态"),
      }, {
        fieldCode: "remark",
        fieldName: this.$T("sslm.commonApplication.model.commonApplication.remark").$D("说明"),
      }, {
        fieldName: this.$T("sslm.supplierDetail.button.relatedForm").$D("关联单据"),
        fieldCode: "relatedForm",
        render: () => <SrmButton plain rect onClick={this.showRelatedForm}>
          {
            this.$T("sslm.supplierDetail.button.seeRelatedForm").$D("查看关联单据")
          }
        </SrmButton>
      }, {
        fieldName: this.$T("sslm.supplierDetail.title.attachment").$D("附件信息"),
        fieldCode: "viewAttachment",
        render: () => <SrmButton plain rect onClick={() => this.showHeaderAttachment()}>
          {
            this.$T("sslm.supplierDetail.button.viewAttachment").$D("查看附件")
          }
        </SrmButton>
      }, ],
    };
  },
  async mounted() {
    if (this.changeReqId) {
      try {
        this.$loading.show();
        await this.getDownGradeOrderHead();
        this.$loading.hide();
      } catch (err) {
        this.$loading.hide();
        console.log(err, "error");
      }
    }
    this.$emit(
      "GetApprovalTitle",
      this.$T("hipspfm.workFlow.view.message.title.eliminateApproval").$D(
        "淘汰供应商审批"
      )
    );
  },
  methods: {
    showHeaderAttachment() {
      this.$showFileList({
        fileList: this.degradeAttachmentLines.map((e) => ({
          fileUrl: e.attachmentUrl,
          fileName: e.attachmentDesc,
          fileSize: e.attachmentSize,
          creationDate: e.creationDate,
          bucketName: "private-bucket",
        }))
      });
    },
    showRelatedForm() {
      this.$popup({
        title: this.$T("sslm.supplierDetail.button.relatedForm").$D("关联单据"),
        showHeader: true,
        showClose: false,
        position: "right",
        showBack: true,
        content: <SupplierRelatedForm
          supplierCompanyId={this.headInfo.supplierCompanyId}
          requisitionId={this.headInfo.requisitionId}
          toStageId={this.headInfo.toStageId}
          companyId={this.headInfo.companyId}
          parentRouter={this.$router}
        />,
      });
    },
    getSupplyCategoryColumns() {
      return [
        {
          fieldCode: "categoryDescription",
          fieldType: "EMPTY",
          render: (val, item) => <SrmListHeader>
            <span>{item.categoryDescription}</span>
          </SrmListHeader>
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.coApp.processStatus").$D("状态"),
          fieldCode: "enabledFlag",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.commonApplication.evaluationLevel").$D("分类评级"),
          fieldCode: "evaluationLevel",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.commonApplication.evaluationScore").$D("分类评分"),
          fieldCode: "evaluationScore",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.coApp.alterDate").$D("变更时间"),
          fieldCode: "alterDate",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.coApp.alterUserName").$D("变更人"),
          fieldCode: "realName",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.coApp.alterReason").$D("变更理由"),
          fieldCode: "alterReason",
          fieldType: "TEXT",
        },
      ];
    },
    // 获取淘汰单头信息
    async getDownGradeOrderHead() {
      await getOrderHeadInfoApi("degrade", this.changeReqId).then(
        ({ degradeHeader = {}, degradeAttachmentLines = [], supplierCategoryAlterLines = [] } = res) => {
          this.degradeAttachmentLines = degradeAttachmentLines || [];
          this.headInfo = degradeHeader;
          this.supplyCategoryDS.setData(supplierCategoryAlterLines || []);
          this.isShowSupplyCategory = this.headInfo.supplierTenantId && this.supplyCategoryDS && this.supplyCategoryDS.data.length > 0;
        }
      );
    },
    // 跳转360详情
    jumpTo360(record) {
      const {
        spfmCompanyId,
        spfmPartnerCompanyId,
        tenantId,
        companyId,
        supplierCompanyId,
        supplierTenantId
      } = record;
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
    }
  }
};
</script>

<style scoped lang="stylus">
.title {
  padding: 12px 15px;
  font-weight: 700;
  font-size: 16px;
  text-align: left;
  color: #333;
  line-height: 22px;
  background: #f6f6f6;
}
</style>
