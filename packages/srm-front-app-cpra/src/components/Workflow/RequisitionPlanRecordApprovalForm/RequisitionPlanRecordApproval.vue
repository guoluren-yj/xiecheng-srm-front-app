<template>
  <!-- 需求计划单审批 - 标准工作流 -->
  <div class="detail-container">
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
      <!-- <srm-scroll-tab-item :label="getLanguageDefine('attachInfo')">
        <srm-list :scrollable="false"
                  height="auto"
                  style="height: auto"
                  :data-set="commonDataSet"
                  :columns="getColumns('attachInfo')"/>
      </srm-scroll-tab-item> -->
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
    <!-- 来源单据弹框 -->
    <srm-popup :visible.sync="sourceNumVisiblePopup"
               :title="sourceNumPopupData.title"
               :position="'bottom'"
               :show-header="true"
               :height="'80%'">
      <srm-list
        :scrollable="false"
        height="auto"
        style="height: auto"
        :data-set="sourceNumDataSet"
        :customize-code="getCodeDefine(sourceNumPopupData.code)"
        :columns="getColumns(sourceNumPopupData.columns)"/>
    </srm-popup>
  </div>
</template>

<script>
import mixin from "./mixin/requisitionPlanRecordMx";
import { $T } from "srm-mobile-ui";

export default {
  modules: [ "sprm.common", "hipspfm.common", "hzero.common" ],
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
      blHeaderId: null,
      popupData: {},
      visiblePopup: false,
      headCustomizeUnitCode: "SRPM.RP_EXECUTE_PLATFORM_DETAIL.BASEINFO,SRPM.RP_EXECUTE_PLATFORM_DETAIL.LINEINFO,SRPM.RP_EXECUTE_PLATFORM_DETAIL.PURCHASEORGINFO",
      lineCustomizeUnitCode: "SRPM.RP_EXECUTE_PLATFORM_DETAIL.LINEINFO",
    };
  },
  beforeMount() {
    this.blHeaderId = this.$route.query.blHeaderId || this.parameters.blHeaderId;
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
        "basicInfo": "SMBL.WORKFLOW.REQUISITION_PLAN_RECORD_APPROVAL.HEAD",
        "organization": "SMBL.WORKFLOW.REQUISITION_PLAN_RECORD_APPROVAL.ORGANIZATION",
        "detailInfo": "SMBL.WORKFLOW.REQUISITION_PLAN_RECORD_APPROVAL.LINE",
        "basicInfoDetail": "SMBL.WORKFLOW.REQUISITION_PLAN_RECORD_APPROVAL.HEAD_DETAIL",
        "organizationDetail": "SMBL.WORKFLOW.REQUISITION_PLAN_RECORD_APPROVAL.ORGANIZATION_DETAIL",
        "detailInfoDetail": "SMBL.WORKFLOW.REQUISITION_PLAN_RECORD_APPROVAL.LINE_DETAIL",
        "attachInfo": "SMBL.WORKFLOW.REQUISITION_PLAN_RECORD_APPROVAL.ATTACH_INFO",
        "rpNum": "SMBL.WORKFLOW.REQUISITION_PLAN_RECORD_APPROVAL.SOURCE_RECORD" // 来源单据
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
</style>
