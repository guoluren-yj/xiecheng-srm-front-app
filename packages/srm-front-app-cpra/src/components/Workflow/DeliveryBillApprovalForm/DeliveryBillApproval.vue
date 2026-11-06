<template>
  <!-- 送货单提交审批 - 标准工作流 -->
  <div v-if="showPage">
    <srm-scroll-tab>
      <!-- 发货信息 -->
      <srm-scroll-tab-item :label="getLanguageDefine('basicInfo')">
        <srm-list :scrollable="false"
                  height="auto"
                  style="height: auto"
                  :data-set="commonDataSet"
                  :columns="getColumns('basicInfo')"
                  :customize-code="getCodeDefine('basicInfo')"/>
      </srm-scroll-tab-item>
      <!-- 行信息 -->
      <srm-scroll-tab-item :label="getLanguageDefine('itemLineInfo')">
        <srm-list :scrollable="false"
                  height="auto"
                  style="height: auto"
                  :data-set="lineDataSet"
                  :columns="getColumns('itemLineInfo')"
                  :customize-code="getCodeDefine('itemLineInfo')"
                  @itemClick="clickTabInfo('two')"/>
      </srm-scroll-tab-item>
      <!-- 物流信息 -->
      <srm-scroll-tab-item :label="getLanguageDefine('logistics')">
        <srm-list :scrollable="false"
                  height="auto"
                  style="height: auto"
                  :data-set="commonDataSet"
                  :columns="getColumns('logistics')"
                  :customize-code="getCodeDefine('logistics')"/>
      </srm-scroll-tab-item>
      <!-- 附件管理 -->
      <srm-scroll-tab-item :label="getLanguageDefine('attachInfo')">
        <srm-list :scrollable="false"
                  height="auto"
                  style="height: auto"
                  :data-set="commonDataSet"
                  :columns="getColumns('attachInfo')"/>
      </srm-scroll-tab-item>
      <!-- 操作记录 -->
      <srm-scroll-tab-item :label="getLanguageDefine('operationRecord')">
        <history-record-tiled
          :show-remark="false"
          :loading="false"
          :action-data="historyData"
          operation-meaning-field-name="processStatusMeaning"
          operator-field-name="processUser"
          process-date-field-name="processDate"
          process-remark-field-name="processRemark"
          :remark-label="getLanguageDefine('remark')"/>
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
import mixin from "./mixin/deliveryBillMx";
import { $T } from "srm-mobile-ui";
import HistoryRecordTiled from "@/components/HistoryRecordTiled";

export default {
  modules: [ "sprm.common", "sinv.common", "sinv.purchaseReception", "hipspfm.common", "hzero.common", "smbl.common" ],
  name: "DeliveryBillApproval",
  components: { HistoryRecordTiled },
  mixins: [ mixin ],
  props: {
    parameters: {
      type: Object,
    },
  },
  data() {
    return {
      asnHeaderId: null,
      popupData: {},
      visiblePopup: false,
      headCustomizeUnitCode: "SINV.DELIVERY_APPROVED_DETAIL.HEADER,SINV.SUPPLIER_DELIVERY.DETAIL.LOGISTICS,SINV.DELIVERY_APPROVED_DETAIL.HEADERSHIP,SINV.DELIVERY_APPROVED_DETAIL.LOGISTICS",
      lineCustomizeUnitCode: "SINV.DELIVERY_APPROVED_DETAIL.BASIC",
      historyData: [],
    };
  },
  beforeMount() {
    this.asnHeaderId = this.$route.query.asnHeaderId || this.parameters.asnHeaderId;
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
        "basicInfo": $T("sinv.common.view.panel.deliveryHeaderInfo").$D("送货单头信息"),
        "itemLineInfo": $T("sinv.common.view.panel.deliveryLineInfo").$D("送货单行信息"),
        "logistics": $T("sinv.common..view.panel.title.logistics").$D("物流信息"),
        "attachInfo": $T("sinv.common.view.panel.attachment").$D("附件管理"),
        "operationRecord": $T("hzero.common.view.button.operationRecord").$D("操作记录"),
        "remark": $T("sinv.common.model.common.desc").$D("说明"),
      };
      return languageList[key] || key;
    },
    // 获取 个性化配置
    getCodeDefine(key) {
      const codeList = {
        "basicInfo": "SMBL.DELIVERY_BILL_APPROVAL.HEAD_INFO",
        "itemLineInfo": "SMBL.DELIVERY_BILL_APPROVAL.LINE_INFO",
        "basicInfoDetail": "SMBL.DELIVERY_BILL_APPROVAL.HEAD_DETAIL",
        "itemLineInfoDetail": "SMBL.DELIVERY_BILL_APPROVAL.LINE_DETAIL_INFO",
        "logistics": "SMBL.DELIVERY_BILL_APPROVAL.LOGISTIC_INFO",
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
        this.openDetailPopup("itemLineInfoDetail", this.lineDataSet);
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
</style>
