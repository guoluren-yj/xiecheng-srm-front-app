<template>
  <!-- 需求计划提报单审批 - 标准工作流 -->
  <div>
    <srm-scroll-tab>
      <!-- 基本信息 -->
      <srm-scroll-tab-item :label="getLanguageDefine('basicInfo')">
        <srm-list :scrollable="false"
                  height="auto"
                  style="height: auto"
                  :data-set="commonDataSet"
                  :columns="getColumns('basicInfo')"
                  :customize-code="getCodeDefine('basicInfo')"
                  @itemClick="clickTabInfo('one')"/>
      </srm-scroll-tab-item>
      <!-- 采购方及采买组织信息 -->
      <srm-scroll-tab-item :label="getLanguageDefine('organization')">
        <srm-list :scrollable="false"
                  height="auto"
                  style="height: auto"
                  :data-set="commonDataSet"
                  :columns="getColumns('organization')"
                  :customize-code="getCodeDefine('organization')"
                  @itemClick="clickTabInfo('two')"/>
      </srm-scroll-tab-item>
      <!-- 需求计划明细信息 -->
      <srm-scroll-tab-item :label="getLanguageDefine('detailInfo')">
        <srm-list :scrollable="false"
                  height="auto"
                  style="height: auto"
                  :show-bottom-bar="false"
                  :data-set="lineDataSet"
                  :columns="getColumns('detailInfo')"
                  :customize-code="getCodeDefine('detailInfo')"
                  @itemClick="clickTabInfo('three')"/>
      </srm-scroll-tab-item>
      <!-- 附件 -->
      <srm-scroll-tab-item :label="getLanguageDefine('attachInfo')" class="attachment-container">
         <srm-form
                  :row-col-to-seq="true"
                  class="attachment-form"
                  :data-set="commonDataSet"
                  :columns="getColumns('attachInfo')"/>
      </srm-scroll-tab-item>
    </srm-scroll-tab>

    <!-- 详情弹框 -->
    <srm-popup :visible.sync="visiblePopup"
               :position="'right'"
               :show-header="false"
               :height="'100%'">
      <srm-form
        v-if="visiblePopup"
        customize-type="detail"
        :data-set="popupData.data"
        :columns="getColumns(popupData.columns)"
        :customize-code="getCodeDefine(popupData.code)"/>
    </srm-popup>
  </div>
</template>

<script>
import mixin from "./mixin/requisitionPlanMx";
import { $T } from "srm-mobile-ui";

export default {
  modules: [ "sprm.common", "hzero.common", "srpm.common" ],
  name: "OrderApproval",
  // 需求计划页面共享
  mixins: [ mixin ],
  props: {
    parameters: {
      type: Object,
    },
  },
  data() {
    return {
      rpHeaderId: null,
      popupData: {},
      visiblePopup: false,
      headCustomizeUnitCode: "SRPM.RP_PLATFORM_READONLY.BASEINFO,SRPM.RP_PLATFORM_READONLY.LINEINFO,SRPM.RP_PLATFORM_READONLY.PURCHASEORGINFO,SRPM.RP_PLATFORM_READONLY.ATTACHMENT",
      lineCustomizeUnitCode: "SRPM.RP_PLATFORM_READONLY.LINEINFO",
    };
  },
  beforeMount() {
    this.rpHeaderId = this.$route.query.rpHeaderId || this.parameters.rpHeaderId;
    // 获取移动表单URL上的参数（个性化配置编码）
    if (this.parameters.headCode) {
      this.headCustomizeUnitCode = this.parameters.headCode;
    }
    if (this.parameters.lineCode) {
      this.lineCustomizeUnitCode = this.parameters.lineCode;
    }
  },
  methods: {
    // 获取 多语言配置
    getLanguageDefine(key) {
      const languageList = {
        "basicInfo": $T("sprm.common.view.panel.basic").$D("基础信息"),
        "organization": $T("sprm.common.view.panel.organization").$D("采购方及采买组织信息"),
        "detailInfo": $T("sprm.common.view.panel.requisitionDetailInfo").$D("需求计划明细信息"),
        "attachInfo": $T("sprm.common.view.panel.attachmentInfo").$D("附件"),
      };
      return languageList[key] || key;
    },
    // 获取 个性化配置
    getCodeDefine(key) {
      const codeList = {
        "basicInfo": "SMBL.WORKFLOW.REQUISITION_PLAN_APPROVAL.HEAD",
        "organization": "SMBL.WORKFLOW.REQUISITION_PLAN_APPROVAL.ORGANIZATION",
        "detailInfo": "SMBL.WORKFLOW.REQUISITION_PLAN_APPROVAL.LINE",
        "basicInfoDetail": "SMBL.WORKFLOW.REQUISITION_PLAN_APPROVAL.HEAD_DETAIL",
        "organizationDetail": "SMBL.WORKFLOW.REQUISITION_PLAN_APPROVAL.ORGANIZATION_DETAIL",
        "detailInfoDetail": "SMBL.WORKFLOW.REQUISITION_PLAN_APPROVAL.LINE_DETAIL",
        "attachInfo": "SMBL.WORKFLOW.REQUISITION_PLAN_APPROVAL.ATTACH_INFO",
      };
      return codeList[key] || key;
    },
    // 点击 tab 块
    clickTabInfo(tab) {
      switch (tab) {
      case "one":
        this.openDetailPopup("basicInfoDetail", this.commonDataSet);
        break;
      case "two":
        this.openDetailPopup("organizationDetail", this.commonDataSet);
        break;
      case "three":
        this.openDetailPopup("detailInfoDetail", this.lineDataSet);
        break;
      default:
        break;
      }
    },
    // 打开详情页面
    async openDetailPopup(name, item) {
      this.popupData = {
        data: item,
        columns: name,
        code: name,
      };
      this.visiblePopup = true;
    }
  }
};
</script>

<style lang="stylus" scoped>
/** 附件样式 */
.attachment {
  height 28px;
  font-size 14px;
  color #333333;
  line-height 20px;

  .icon-other {
    font-size 28px;
    color #FEBF43;
    margin-right 8px;
  }

  .icon-chevron-right {
    font-size 16px;
    color val(--color-font-default-b);
  }
  >>> .srm-button-primary {
    color #333 !important;
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

</style>
