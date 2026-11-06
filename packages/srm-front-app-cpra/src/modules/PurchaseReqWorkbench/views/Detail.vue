<template>
  <!-- 采购申请工作台 -->
  <div class="detail-container">
    <srm-scroll-tab :class="type !== 'readOnly' ? 'detail-container-tab' : ''"
                    :customize-code="type === 'readOnly' ? 'SMBL.PURCHASE_REQ_WORKBENCH.COLLAPSE_INQUIRY' : 'SMBL.PURCHASE_REQ_WORKBENCH.COLLAPSE_EDIT'">
      <!-- 申请基础信息 -->
      <srm-scroll-tab-item key="basicInfo" :label="getLanguageDefine('basicInfo')" code="basicInfo">
        <srm-list :scrollable="false" height="auto" style="height: auto" :data-set="commonDataSet"
                  :columns="type === 'readOnly' ? getColumns('basicInfo') : getEditColumns('basicInfo')"
                  :customize-code="getCodeDefine('basicInfo')" @itemClick="clickDetailInfo('one')" />
      </srm-scroll-tab-item>
      <!-- 外部ERP不显示 采购方及采买组织信息 -->
      <srm-scroll-tab-item v-if="prSourcePlatform !== 'ERP'" key="organization" :label="getLanguageDefine('organization')"
                           code="organization">
        <srm-list :scrollable="false" height="auto" style="height: auto" :data-set="commonDataSet"
                  :columns="type === 'readOnly' ? getColumns('organization') : getEditColumns('organization')"
                  :customize-code="getCodeDefine('organization')" @itemClick="clickDetailInfo('two')" />
      </srm-scroll-tab-item>
      <!-- 仅电商来源展示 收货/收单信息 -->
      <srm-scroll-tab-item v-if="prSourcePlatform === 'E-COMMERCE'" key="deliveryInfo"
                           :label="$T('sprm.common.view.panel.deliveryInfo').$D('收货/收单信息')" code="deliveryInfo">
        <srm-list :scrollable="false" height="auto" style="height: auto" :data-set="commonDataSet"
                  :columns="type === 'readOnly' ? getColumns('deliveryInfo') : getEditColumns('deliveryInfo')"
                  :customize-code="getCodeDefine('deliveryInfo')" @itemClick="clickDetailInfo('four')" />
      </srm-scroll-tab-item>
      <!-- 仅电商来源展示开票信息 -->
      <srm-scroll-tab-item v-if="prSourcePlatform === 'E-COMMERCE'" key="billingInfo"
                           :label="$T('sprm.common.view.panel.billingInfo').$D('开票信息')" code="billingInfo">
        <srm-list :scrollable="false" height="auto" style="height: auto" :data-set="commonDataSet"
                  :columns="type === 'readOnly' ? getColumns('billingInfo') : getEditColumns('billingInfo')"
                  :customize-code="getCodeDefine('billingInfo')" @itemClick="clickDetailInfo('five')" />
      </srm-scroll-tab-item>
      <!-- 申请明细信息 -->
      <srm-scroll-tab-item key="detailInfo" :label="getLanguageDefine('detailInfo')" :show-title="type === 'readOnly'"
                           code="detailInfo">
        <div v-if="type !== 'readOnly'" class="srm-scroll-tab-item-title line-filter">
          {{ getLanguageDefine('detailInfo') }}
          <srm-flex v-if="!detailInfoDataSet.editFlag" class="list-tool-tab">
            <div class="icon-edit srm-icon" @click="toggleOrderLineEdit" />
            <div class="icon-plus srm-icon" @click="toggleOrderLineAdd" />
          </srm-flex>
          <srm-button v-else plain rect @click="toggleOrderLineEdit">
            {{ $T("hipspfm.common.button.cancle").$D("取消") }}
          </srm-button>
        </div>
        <srm-list :scrollable="false" height="auto" style="height: auto" :show-bottom-bar="false"
                  :data-set="detailInfoDataSet"
                  :columns="type === 'readOnly' ? getColumns('detailInfo') : getEditColumns('detailInfo')"
                  :customize-code="getCodeDefine('detailInfo')" @itemClick="clickDetailInfo('three')" />
      </srm-scroll-tab-item>
      <!-- 附件 -->
      <srm-scroll-tab-item key="attachInfo" :label="getLanguageDefine('attachInfo')" code="attachInfo">
        <srm-list :scrollable="false" height="auto" style="height: auto" :data-set="commonDataSet"
                  :columns="getColumns('attachInfo')"
                  :customize-code="type === 'readOnly' ? 'SMBL.PURCHASE_REQ_WORKBENCH.ATTACHMENT_INQUIRY' : 'SMBL.PURCHASE_REQ_WORKBENCH.ATTACHMENT_EDIT'" />
      </srm-scroll-tab-item>
      <!-- 操作记录 -->
      <srm-scroll-tab-item v-if="type !== 'add'" key="operationRecord" :label="getLanguageDefine('operationRecord')"
                           code="operationRecord">
        <div class="record-container">
          <history-record-tiled :show-remark="false" :loading="false" :action-data="actionRecordList"
                                operation-meaning-field-name="status" operator-field-name="processUserName"
                                process-date-field-name="processedDate" process-remark-field-name="processRemark"
                                :remark-label="$T('smbl.common.view.title.operationRemark').$D('操作说明')"
                                process-remark-info-field-name="unknown" />
        </div>
        <div class="bottom-button-space" />
      </srm-scroll-tab-item>
      <!-- 审批记录 -->
      <srm-scroll-tab-item v-if="type !== 'add' && approveRecordList.length > 0" key="approveRecord"
                           :label="getLanguageDefine('approveRecord')" code="approveRecord">
        <history-record-tiled :action-data="approveRecordList" operator-field-name="assigneeName"
                              operation-meaning-field-name="name" process-date-field-name="endTime" process-remark-field-name="comment" />
      </srm-scroll-tab-item>
      <!-- <div v-if="type!=='readOnly'" class="approval-detail-bottom"/> -->
    </srm-scroll-tab>
    <!-- 行信息的删除和批量编辑按钮 -->
    <srm-list-bottom-bar :data-set="detailInfoDataSet" :buttons="getDetailInfoButtons" />

    <!-- 详情按钮 -->
    <srm-bottom-handler v-if="!detailInfoDataSet.editFlag && type !== 'readOnly'" :btn-arr="getButtons" type="tooltip"
                        :class="type !== 'readOnly' ? 'bottom-button' : ''">
      <div v-if="deleteFlag" slot="left"
           style="height: 48px;width: 48px;display: flex;justify-content: center;align-items: center;margin-right: 10px"
           @click="deleteRecord()">
        <em class="srm-icon icon-trash" style="font-size: 24px;color: #cbcbcb" />
      </div>
    </srm-bottom-handler>

    <!-- 详情弹框 -->
    <srm-popup :visible.sync="visiblePopup" :position="'right'" :show-header="false" :height="'100%'">
      <srm-form v-if="visiblePopup" customize-type="detail" :data-set="popupData.data"
                :columns="type === 'readOnly' ? getColumns(popupData.columns) : getEditColumns(popupData.columns)"
                :customize-code="getCodeDefine(popupData.code)" />
    </srm-popup>
    <!-- 批量编辑行 -->
    <srm-popup :visible.sync="batchVisible" :title="popupData.title" :position="'bottom'" :height="'80%'" rounded>
      <srm-list v-if="batchVisible" :scrollable="false" height="auto" style="height: auto" :data-set="batchDataSet"
                :columns="getEditColumns(popupData.columns)" :customize-code="getCodeDefine(popupData.code)" />
      <!-- 批量编辑按钮 -->
      <srm-bottom-handler v-if="batchVisible" :btn-arr="getBatchButtons" />
    </srm-popup>
    <!-- 执行单据详情 -->
    <srm-popup :visible.sync="executorVisible" :title="executorPopupData.title" :position="'bottom'" :height="'80%'"
               rounded>
      <srm-list v-if="executorVisible" :scrollable="false" height="auto" style="height: auto" :data-set="executorDataSet"
                :columns="getColumns(executorPopupData.columns)" :customize-code="getCodeDefine(executorPopupData.code)" />
    </srm-popup>
    <!-- 物料定制属性 -->
    <srm-popup :visible.sync="customVisible" :title="customPopupData.title" :position="'bottom'" :height="'80%'" rounded>
      <srm-list v-if="customVisible" :scrollable="false" height="auto" style="height: auto"
                :data-set="customAttributeDataSet" :columns="getColumns(customPopupData.columns)"
                :customize-code="getCodeDefine(customPopupData.code)" />
    </srm-popup>
    <!-- 定制品属性 -->
    <srm-popup :visible.sync="customSpecsVisiable" :title="customSpecsPopup.title" :position="'bottom'" :height="'80%'"
               rounded>
      <srm-list v-if="customSpecsVisiable" :scrollable="false" height="auto" style="height: auto"
                :data-set="customSpecsDataSet" :columns="getColumns(customSpecsPopup.columns)"
                :customize-code="getCodeDefine(customSpecsPopup.code)" />
    </srm-popup>
  </div>
</template>

<script>

import HistoryRecordTiled from "@/components/HistoryRecordTiled";
import { $T } from "srm-mobile-ui";
import editMx from "../mixin/editMx";
import mixin from "../mixin/mixin";
import CuxMethods from "../../CUX/PReqWorkbench_Cux/minxin";
export default {
  modules: [ "sprm.common", "sprm.purchasePlatform", "hipspfm.common", "smbl.common", "hzero.common", "sodr.common" ],
  name: "PurchaseReqWorkbenchDetail",
  components: {
    HistoryRecordTiled
  },
  extends: CuxMethods,
  mixins: [ mixin, editMx ],
  props: {
    parameters: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      headerInfo: {},
      type: "readOnly", // add/新增 edit/编辑 readOnly/只读
      prHeaderId: null,
      popupData: {},
      visiblePopup: false,
    };
  },
  beforeMount() {
    console.log(this.$route, this.$route.path);
    this.type = this.$route.path.includes("PurchaseReqWorkbenchQuery") ? "readOnly" : this.$route.query.type || this.parameters.type;
    this.prHeaderId = this.$route.query.prHeaderId || this.parameters.prHeaderId || "";
  },
  methods: {
    // 获取 多语言配置
    getLanguageDefine(key) {
      const languageList = {
        "basicInfo": $T("sprm.common.view.panel.basicInfo").$D("申请基础信息"),
        "organization": $T("sprm.common.view.panel.organization").$D("采购方及采买组织信息"),
        "detailInfo": $T("sprm.common.view.panel.detailInfo").$D("申请明细信息"),
        "deliveryInfo": $T("sprm.common.title.deliveryInfo").$D("收货/收单信息"),
        "billingInfo": $T("sprm.common.title.BillingInfo").$D("开票信息"),
        "attachInfo": $T("sprm.common.view.panel.attachmentInfo").$D("附件"),
        "operationRecord": $T("sprm.common.view.tab.operateRecord").$D("操作记录"),
        "approveRecord": $T("sprm.common.view.tab.approveRecord").$D("审批记录"),
        "customAttributeList": $T("sprm.common.view.title.customAttributeList").$D("物料定制属性"),
        "executorRecordDetail": $T("sprm.common.view.title.executorRecordDetail").$D("执行单据详情"),
        "customSpecsJson": $T("sprm.common.model.common.customSpecsJson").$D("定制品属性"),
        "batchEdit": $T("sprm.common.view.button.editMany").$D("批量编辑"),
      };
      return languageList[key] || key;
    },
    // 获取 个性化配置
    getCodeDefine(key) {
      const codeList = {
        "basicInfo": this.type === "readOnly" ? "SMBL.PURCHASE_REQ_WORKBENCH.BASIC_INFO" : this.type === "edit" ? "SMBL.PURCHASE_REQ_WORKBENCH.BASIC_INFO.EDIT" : "SMBL.PURCHASE_REQ_WORKBENCH.BASIC_INFO.CREATE",
        "organization": this.type === "readOnly" ? "SMBL.PURCHASE_REQ_WORKBENCH.ORGANIZATION" : this.type === "edit" ? "SMBL.PURCHASE_REQ_WORKBENCH.ORGANIZATION.EDIT" : "SMBL.PURCHASE_REQ_WORKBENCH.ORGANIZATION.CREATE",
        "detailInfo": this.type === "readOnly" ? "SMBL.PURCHASE_REQ_WORKBENCH.DETAIL_INFO" : this.type === "edit" ? "SMBL.PURCHASE_REQ_WORKBENCH.DETAIL_INFO.EDIT" : "SMBL.PURCHASE_REQ_WORKBENCH.DETAIL_INFO.CREATE",
        "deliveryInfo": "SMBL.PURCHASE_REQ_WORKBENCH.DELIVERY_INFO",
        "deliveryInfoDetail": "SMBL.PURCHASE_REQ_WORKBENCH.DELIVERY_INFO_DETAIL",
        "billingInfo": this.type === "readOnly" ? "SMBL.PURCHASE_REQ_WORKBENCH.BILLING_INFO" : "SMBL.PURCHASE_REQ_WORKBENCH.BILLING_INFO.EDIT",
        "billingInfoDetail": this.type === "readOnly" ? "SMBL.PURCHASE_REQ_WORKBENCH.BILLING_INFO_DETAIL" : "SMBL.PURCHASE_REQ_WORKBENCH.BILLING_INFO.EDIT_DETAIL",
        "basicInfoDetail": this.type === "readOnly" ? "SMBL.PURCHASE_REQ_WORKBENCH.BASIC_INFO.DETAIL" : this.type === "edit" ? "SMBL.PURCHASE_REQ_WORKBENCH.BASIC_INFO.DETAIL_EDIT" : "SMBL.PURCHASE_REQ_WORKBENCH.BASIC_INFO.DETAIL_CREATE",
        "organizationDetail": this.type === "readOnly" ? "SMBL.PURCHASE_REQ_WORKBENCH.ORGANIZATION.DETAIL" : this.type === "edit" ? "SMBL.PURCHASE_REQ_WORKBENCH.ORGANIZATION.DETAIL_EDIT" : "SMBL.PURCHASE_REQ_WORKBENCH.ORGANIZATION.DETAIL_CREATE",
        "detailInfoDetail": this.type === "readOnly" ? "SMBL.PURCHASE_REQ_WORKBENCH.DETAIL_INFO.DETAIL" : this.type === "edit" ? "SMBL.PURCHASE_REQ_WORKBENCH.DETAIL_INFO.DETAIL_EDIT" : "SMBL.PURCHASE_REQ_WORKBENCH.DETAIL_INFO.DETAIL_CREATE",
      };
      return codeList[key] || key;
    },
    // 点击 tab 块
    clickDetailInfo(name) {
      switch (name) {
      case "one":
        if (this.type === "readOnly") {
          this.openDetailPopup("basicInfoDetail", this.commonDataSet);
        }
        break;
      case "two":
        if (this.type === "readOnly") {
          this.openDetailPopup("organizationDetail", this.commonDataSet);
        }
        break;
      case "three":
        if (this.type === "readOnly") {
          this.openDetailPopup("detailInfoDetail", this.detailInfoDataSet);
        }
        break;
      case "four":
        if (this.type === "readOnly") {
          this.openDetailPopup("deliveryInfoDetail", this.commonDataSet);
        }
        break;
      case "five":
        if (this.type === "readOnly") {
          this.openDetailPopup("billingInfoDetail", this.commonDataSet);
        }
        break;
      default:
        break;
      }
    },
    // 详情弹框
    async openDetailPopup(name, item) {
      this.popupData = {
        data: item,
        columns: name,
        code: name,
      };
      this.visiblePopup = true;
    },
  }
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