<template>
  <div>
    <srm-scroll-tab class="content main-tab detail-container-tab" customize-code="SMBL.PROJECT_INFO.TABS">
      <srm-scroll-tab-item key="basicInfo" :label="$T('sprm.purchaseRequest.title.baseinfo').$D('基本信息')"
        code="basicInfo">
        <div @click="showBasicInfoDetail">
          <srm-form v-if="basicInfoDataSet" :data-set="basicInfoDataSet" :columns="getBasicInfoColumns"
            :customize-code="getBasicInfoColumnsCode" />
        </div>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item key="taskCost" :label="$T('sprm.project.model.common.taskCost').$D('任务成本')" code="taskCost">
        <srm-list :scrollable="false" height="auto" style="height: auto" :data-set="taskDataSet" v-if="taskDataSet"
          :columns="getTaskColumns" :customize-code="getTaskColumnsCode" />
      </srm-scroll-tab-item>
      <srm-scroll-tab-item key="purPartsList" :label="$T('sprm.project.model.common.purPartsList').$D('采购类清单')"
        code="purPartsList">
        <srm-list :scrollable="false" height="auto" style="height: auto" :data-set="purPartListDataSet"
          v-if="purPartListDataSet" :columns="getPurPartColumns" :customize-code="getPurPartColumnsCode"
          @itemClick="showPurInfoDetail" />
      </srm-scroll-tab-item>
      <!-- 效益预估 -->
      <srm-scroll-tab-item key="cuxBenefitEstimation"
        :label="$T('sprm.common.view.panel.cux.cuxBenefitEstimation').$D('效益预估')" style="position: relative;"
        code="cuxBenefitEstimation">
        <srm-list v-if="benefitEstimationDataSet" class="scoll-list" :scrollable="false"
          :columns="getBenefitEstimationColumns" :data-set="benefitEstimationDataSet" />
      </srm-scroll-tab-item>
      <!-- 效益复盘 -->
      <srm-scroll-tab-item key="benefitReview" :label="$T('sprm.common.view.panel.cux.benefitReview').$D('效益复盘')"
        v-if="benefitReviewDataSet && ['REVIEWING', 'REJECTED', 'APPROVAL'].includes(basicInfo.attributeVarchar1)"
        style="position: relative;" code="benefitReview">

        <srm-list
          v-if="benefitReviewDataSet && ['REVIEWING', 'REJECTED', 'APPROVAL'].includes(basicInfo.attributeVarchar1)"
          class="scoll-list" :scrollable="false" :columns="getBenefitReviewColumns" :data-set="benefitReviewDataSet" />
      </srm-scroll-tab-item>
      <srm-scroll-tab-item key="supplier" :label="$T('sprm.project.model.common.supplier').$D('供应商')" code="supplier">
        <srm-list :scrollable="false" height="auto" style="height: auto" :data-set="supplierDataSet"
          v-if="supplierDataSet" :columns="getSupplierColumns" :customize-code="getSupplierColumnsCode" />
      </srm-scroll-tab-item>
    </srm-scroll-tab>
  </div>
</template>

<script>
import { getProDetailApi } from "../api/index";
import { DataSet, SrmUtil } from "srm-mobile-ui";
// import { SrmUtil, DataSet } from "srm-mobile-ui";
import { isArray } from "lodash";
import { taskDs, purListDs, supplierDs, benefitReviewDs, benefitEstimationDs } from "../datasource/allDataSet";
import { formDS } from "../datasource/FormDS";
import ListHeader from "@/components/ListHeader";
import HistoryRecordTiled from "@/components/HistoryRecordTiled";
import uuid from "uuid";
export default {
  modules: ["sprm.common", "hipspfm.common", "sprm.purchaseRequest", "scux.shiyue", "sprm.project", "smbl.common", "spcm.common", "sodr.common", "hzero.common", "entity.supplier", "entity.order"],
  name: "ProjectApprovalDetail",
  components: {
    HistoryRecordTiled
  },
  props: {
    parameters: {
      type: Object,
      default: null,
    }
  },
  data() {
    return {
      projectId: null,
      basicInfo: null,
      attachmentsItems: [], // 附件列表
      externalAttachmentFlag: false, // 是否显示外部附件
      taskDataSet: null, // 行信息
      purPartListDataSet: null,
      supplierDataSet: null,
      benefitEstimationDataSet: null,  // 效益预估
      benefitReviewDataSet: null, // 效益复盘
      basicInfoDataSet: new DataSet(formDS()), // 基本信息
      // 操作记录
      actionRecordList: [],
      // 审批记录
      approveRecordList: [],
      // 变更前\变更后按钮标记
      changedButtonsFlag: "after", // after\before
      // 行-详情
      lineDetailFlag: false,
      lineDetailDataSet: null,
    };
  },
  computed: {
    lineDetailChangeStateButtons() {
      return [{
        text: this.$T("sprm.common.view.button.beforeChange").$D("变更前"),
        bordered: true,
        visible: true,
        fill: this.changedButtonsFlag === "before",
        type: "warn",
        handler: () => {
          this.beforeChangeAction();
        }
      }, {
        text: this.$T("sprm.common.view.button.afterChange").$D("变更后"),
        bordered: true,
        visible: true,
        fill: this.changedButtonsFlag === "after",
        type: "danger",
        handler: () => {
          this.afterChangeAction();
        }
      },];
    },
    // 基本信息-Columns
    getBasicInfoColumns() {
      return [{
        fieldCode: "projectNum",
        fieldType: "EMPTY",
        render: (val) => <ListHeader showTitle>{val}</ListHeader>,
      }, {
        fieldCode: "projectName",
        fieldType: "TEXT",
        fieldName: this.$T("sprm.project.model.common.projectName").$D("项目名称"),
      }, {
        fieldCode: "companyName",
        fieldType: "TEXT",
        fieldName: this.$T("sprm.common.model.common.companyName").$D("公司"),
      }, {
        fieldCode: "ouName",
        fieldType: "TEXT",
        fieldName: this.$T("sprm.common.model.common.ouName").$D("业务实体"),
      }, {
        fieldCode: "purchaseOrganizationName",
        fieldType: "TEXT",
        fieldName: this.$T("sprm.common.model.common.purchaseOrgName").$D("采购组织"),
      }, {
        fieldCode: "departmentName",
        fieldType: "TEXT",
        fieldName: this.$T("sprm.common.model.common.department").$D("部门"),
      }, {
        fieldCode: "principalUserName",
        fieldType: "TEXT",
        fieldName: this.$T("sprm.project.model.common.principalUserId").$D("项目负责人"),
      },];
    },
    // 任务成本-Columns
    getTaskColumns() {
      return [{
        fieldCode: "level",
        fieldType: "EMPTY",
        render: (val) => <ListHeader showTitle>{val}</ListHeader>,
      }, {
        fieldCode: "taskNum",
        fieldType: "TEXT",
      }, {
        fieldCode: "taskName",
        fieldType: "TEXT",
      }, {
        fieldCode: "principalUserId",
        fieldType: "TEXT",
        render: (_, item) => item.principalUserName,
      }, {
        fieldCode: "budgetAmount",
      }, {
        fieldCode: "taskExplanation",
      }];
    },
    // 采购类清单-Columns
    getPurPartColumns() {
      return [
        { fieldCode: "virtualLineNum", },
        { fieldCode: "cancelStatus", },
        { fieldCode: "itemCode", },
        { fieldCode: "itemName" },
        { fieldCode: "categoryName", },
        { fieldCode: "model", },
        { fieldCode: "specifications", },
        { fieldCode: "demandDate", },
      ];
    },
    // 供应商-Columns
    getSupplierColumns() {
      return [{
        fieldCode: "supplierCompanyCode",
        fieldType: "EMPTY",
        render: (val, item) => <ListHeader showTitle>{val || item.supplierNum}</ListHeader>,
      }, {
        fieldCode: "displaySupplierName",
        fieldType: "TEXT",
        render: (val, item) => val || item.supplierName,
      }, {
        fieldCode: "contact",
        fieldType: "TEXT",
      }, {
        fieldCode: "contactPhone",
        fieldType: "TEXT",
        render: (val, item) => `${item.internationalTelCode}-${val}`
      }, {
        fieldCode: "contactEmail",
      },];
    },
    getBasicInfoColumnsCode() {
      return "SMBL.PROJECT_INFO.BASEINFO";
    },
    getTaskColumnsCode() {
      return "SMBL.PROJECT_INFO.TASKCOST";
    },
    getPurPartColumnsCode() {
      return "SMBL.PROJECT_INFO.PURLIST";
    },
    getSupplierColumnsCode() {
      return "SMBL.PROJECT_INFO.SUPPLIER";
    },
    // 基本信息详情-Columns
    getBasicInfoDetailColumns() {
      return [{
        fieldCode: "projectNum",
        fieldName: this.$T("sprm.project.model.common.projectNum").$D("项目编码"),
      }, {
        fieldCode: "projectName",
        fieldType: "TEXT",
        fieldName: this.$T("sprm.project.model.common.projectName").$D("项目名称"),
      }, {
        fieldCode: "companyName",
        fieldType: "TEXT",
        fieldName: this.$T("sprm.common.model.common.companyName").$D("公司"),
      }, {
        fieldCode: "ouName",
        fieldType: "TEXT",
        fieldName: this.$T("sprm.common.model.common.ouName").$D("业务实体"),
      }, {
        fieldCode: "purchaseOrganizationName",
        fieldType: "TEXT",
        fieldName: this.$T("sprm.common.model.common.purchaseOrgName").$D("采购组织"),
      }, {
        fieldCode: "departmentName",
        fieldType: "TEXT",
        fieldName: this.$T("sprm.common.model.common.department").$D("部门"),
      }, {
        fieldCode: "projectTypeName",
        fieldType: "TEXT",
        fieldName: this.$T("entity.order.type.typeDescription").$D("项目类型"),
      }, {
        fieldCode: "principalUserName",
        fieldType: "TEXT",
        fieldName: this.$T("sprm.project.model.common.principalUserId").$D("项目负责人"),
      }, {
        fieldCode: "projectTeamUserList",
        fieldType: "TEXT",
        fieldName: this.$T("sprm.common.project.projectTeamUserList").$D("项目团队成员"),
        render: (val) => val && val?.length > 0 ? val?.map(i => i.userName)?.join(',') : '-',
      }, { fieldCode: 'creationDate', fieldName: this.$T('hzero.common.creationDate').$D('创建时间') },
      {
        fieldCode: 'projectStatus',
        fieldName: this.$T('hzero.common.status').$D('状态'),
        render: (val, item) => item.projectStatusMeaning
      },
      {
        fieldCode: 'sourcePlatform',
        fieldName: this.$T('sprm.common.model.common.prSourcePlatform').$D('单据来源'),
        render: (val, item) => item.sourcePlatformMeaning
      },
      {
        fieldCode: 'createdByName',
        fieldType: "TEXT",
        fieldName: this.$T('hzero.common.creationName').$D('创建人'),
      }, {
        fieldCode: 'sourceDocument',
        fieldType: "TEXT",
        fieldName: this.$T('sprm.common.model.common.sourceDocumentAndLineNum').$D('来源单号-行号'),
      }, {
        fieldCode: 'projectExplanation',
        fieldType: "TEXT",
        fieldName: this.$T('sprm.common.model.common.projectExplanation').$D('项目说明'),
      }, {
        fieldCode: 'attachmentUuid',
        fieldType: "UPLOAD",
        fieldName: this.$T('sprm.purchaseRequest.title.attachment').$D('附件'),
      }
      ];
    },
    getPurPartDetailColumns() {
      return [
        { fieldCode: "virtualLineNum", },
        { fieldCode: "cancelStatus", render: (val, item) => item.cancelStatusMeaning || val, },
        { fieldCode: "itemCode", },
        { fieldCode: "itemName" },
        { fieldCode: "categoryName", },
        { fieldCode: "model", },
        { fieldCode: "specifications", },
        { fieldCode: "quantity", },
        { fieldCode: "estimatedUnitPrice", },
        { fieldCode: "estimatedLineAmount", },
        { fieldCode: "level", },
        { fieldCode: "taskNum" },
        { fieldCode: "demandDate", },
        { fieldCode: "uomName", },
        { fieldCode: "sourceDocument", },
        { fieldCode: "remark", },
      ];
    },
    // 效益预估-columns
    getBenefitEstimationColumns() {
      return [
        { fieldCode: 'benefitIndex', },
        { fieldCode: 'indexType' },
        { fieldCode: 'isCoreIndex', },
        { fieldCode: 'historyActivityReference', },
        { fieldCode: 'historyExpenses', },
        { fieldCode: 'historyBenefitReachSituation', },
        { fieldCode: 'thisExpenses', },
        { fieldCode: 'thisBenefitEvaluation', },
        { fieldCode: 'remark', },
      ];
    },
    // 效益复盘-columns
    getBenefitReviewColumns() {
      return [
        {
          fieldCode: 'benefitIndex',
          render: (val, item) => <SrmListHeader showOpenTag={true}>
            {item.benefitIndexMeaning}
            <SrmButton style={{ fontWeight: "bold" }} plain slot="right">{this.basicInfo.attributeVarchar2Meaning}</SrmButton>
          </SrmListHeader>
        },
        { fieldCode: 'indexType', },
        { fieldCode: 'isCoreIndex' },
        {
          fieldCode: 'evaluation',
        },
        {
          fieldCode: 'actual',
        },
        { fieldCode: 'difference', },
        {
          fieldCode: 'differenceReasons',
        },
        { fieldCode: 'reachSituation' },
        {
          fieldCode: 'remark',
        },];
    },
  },
  beforeMount() {
    if (this.parameters) {
      // 审批页面过来的，不可显示审批按钮
      this.projectId = this.parameters.projectId || '__-XicJlP4Of7-0VtDKnPEOxw-__';
      this.projectReqId = this.parameters.projectReqId || '__-Lur3g_dGcn8m5ruf09YHVA-__';
      this.reqType = this.parameters.reqType || 'others';
    }
    this.requestData();
  },
  methods: {
    async requestData() {
      // 请求网络
      let baseInfo = await getProDetailApi(this.projectId, this.projectReqId, this.reqType);
      // 构建基本信息tab的数据
      this.basicInfo = baseInfo;
      this.basicInfoDataSet = new DataSet(formDS());
      // 保留_token
      let _token = this.basicInfo._token;
      this.basicInfoDataSet.create(this.basicInfo, 0);
      this.basicInfo._token = _token;
      // 行数据 taskDs, purListDs, supplierDs
      this.taskDataSet = new DataSet(taskDs(this.projectId, this.projectReqId, this.reqType));
      this.purPartListDataSet = new DataSet(purListDs(this.projectId, this.projectReqId, this.reqType));
      this.supplierDataSet = new DataSet(supplierDs(this.projectId, this.projectReqId, this.reqType));
      // 效益复盘数据 benefitReviewDs,benefitEstimationDs
      this.benefitReviewDataSet = new DataSet(benefitReviewDs(this.projectId, this.projectReqId, this.reqType));
      // 效益预估数据
      this.benefitEstimationDataSet = new DataSet(benefitEstimationDs(this.projectId, this.projectReqId, this.reqType));
      // 附件数据构建

      if (!baseInfo["attachmentUuid"]) {
        baseInfo["attachmentUuid"] = uuid();
      }
      if (!baseInfo["externalAttachmentUuid"]) {
        baseInfo["externalAttachmentUuid"] = uuid();
      }

      this.attachmentsItems.push({
        isExternalFlag: false,
        title: this.$T("sprm.common.view.button.headAttachment").$D("头附件"),
        uuid: this.basicInfo.attachmentUuid,
        code: "attachmentUuid",
      });
    },
    // 基础信息弹框
    showBasicInfoDetail() {
      this.$popup({
        title: this.$T("sprm.common.view.panel.basicInfo").$D("申请基础信息"),
        showHeader: false,
        showClose: false,
        rounded: false,
        height: "100vh",
        position: "right",
        content: <customize-detail
          columns={this.getBasicInfoDetailColumns}
          data-source={this.basicInfo}
          type="list"
          need-padding={true}
          code="SMBL.PROJECT_INFO.BASE_DETAIL" />,
      });
    },
    // 基础信息弹框
    showPurInfoDetail() {
      this.$popup({
        showHeader: false,
        showClose: true,
        position: "right",
        showBack: false,
        content: <SrmForm
          customizeCode="SMBL.PROJECT_INFO.PUR_DETAIL"
          style={{ padding: "0 15px" }}
          customizeType="detail"
          dataSet={this.purPartListDataSet}
          columns={this.getPurPartDetailColumns}
        />
      });
    },
    afterChangeAction() {
      this.prLineDataSet.records.forEach((record) => {
        if (record.data.changeState === 2) {
          record.data.changeState = 1;
        }
      });
      this.changedButtonsFlag = "after";
    },
    beforeChangeAction() {
      this.prLineDataSet.records.forEach((record) => {
        if (record.data.changeState === 1) {
          record.data.changeState = 2;
        }
      });
      this.changedButtonsFlag = "before";
    },
    // 行点击-查看行详情
    // lineItemClick(record) {
    //   this.lineDetailDataSet = new DataSet(prLineDetailDS());
    //   this.lineDetailDataSet.create(record.data, 0);
    //   this.lineDetailFlag = true;
    // },


    // 移动端审批前校验
    // beforeApprove() {
    //   console.log(11, this, this.over$getApproveCheck);
    //   if (this.over$getApproveCheck && typeof this.over$getApproveCheck === "function") {
    //     const checkFlag = this.over$getApproveCheck();
    //     return checkFlag;
    //   }
    //   return true;
    // }
  },
};
</script>

<style lang="stylus" scoped>
.detail-container-tab {
  >>> .srm-scroll-content {
    height: calc(100% - 72px);
   }
  }
.bottom-button {
  height: 72px;
  border-top: 1px solid #f0f2f5;
}
.change-buttons {
  position: absolute;
  height: 54px;
  top: 0px;
  right: 15px;
  z-index: 1;
  .change-button {
    margin-left: 8px;
  }
}

.attachment-container {
  .attachment-form {
    min-height: 58px;
    padding: 0;
  }
}

.attachment-card {
  position: relative;
  height: 54px;
  border-bottom: 1px solid var(--color-border-default);
  >>> .srm-upload {
    position: absolute;
    height: 100%;
    width: 100%;
  }
  .right-icon {
    position: absolute;
    right: 15px;
    top: 15px;
    color: var(--font-color-disable);
    font-size: 20px;
  }
  .attachment-container {
    pointer-events: none;
    height: 100%;
    .icon {
      color: var(--color-warn);
      margin-left: 15px;
      font-size: 28px;
    }
    .title {
      margin-left: 8px;
    }
    .attachment-type {
      margin-left: 8px;
    }
  }
}

// UI校对
.main-tab {
  // 列表的颜色改回
  .scoll-list {
    >>> .srm-scroll {
      background: var(--background-color-empty);
    }
  }
  // 操作记录最小高度
  >>> .srm-history-record-content {
    min-height: 0px;
  }
}

.approval-detail-bottom {
  height 72px;
  width 100%;
  margin-bottom: constant(safe-area-inset-top);
  margin-bottom: env(safe-area-inset-top);
  background: var(--background-color-empty-second);
}

>>> .srm-scroll-tab-item-title {
  display: flex;
  justify-content: space-between !important;

}

.line-filter {
  .list-tool-tab {
    width: 100px;
    justify-content flex-end;
  }
  .srm-icon {
    color var(--font-color-disable);
    font-size 20px;
    margin-left: 10px;
  }
}
</style>