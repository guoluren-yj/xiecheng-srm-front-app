<template>
  <div v-if="showPage">
    <srm-scroll-tab>
      <!-- 订单头信息 -->
      <srm-scroll-tab-item :label="getLanguageDefine('orderHeadInfo')">
        <srm-list
          :scrollable="false"
          height="auto"
          style="height: auto"
          :data-set="commonDataSet"
          :columns="getColumns('orderHeadInfo')"
          :customize-code="getCodeDefine('orderHeadInfo')"
          @itemClick="clickOrderHeadInfo"/>
      </srm-scroll-tab-item>
      <!-- 订单行信息 -->
      <srm-scroll-tab-item :label="getLanguageDefine('basicInfo')">
        <div
          v-show="
            commonDataSet.current && commonDataSet.current.get('changeFlag')
          ">
          <srm-tab-bar
            :tabs="tabs"
            class="change-tabs"
            @indexChange="onIndexChange"/>
        </div>
        <srm-list
          :scrollable="false"
          height="auto"
          style="height: auto"
          class="approval-line-list"
          :data-set="orderLineDataSet"
          :columns="getColumns('basicInfo')"
          :customize-code="getCodeDefine('basicInfo')"
          @itemClick="clickBasicInfo"/>
      </srm-scroll-tab-item>
      <!-- 附件 -->
      <srm-scroll-tab-item :label="getLanguageDefine('attachInfo')">
        <srm-list
          :scrollable="false"
          height="auto"
          style="height: auto"
          :data-set="commonDataSet"
          :columns="getColumns('attachInfo')"/>
      </srm-scroll-tab-item>
      <!-- 操作记录 -->
      <srm-scroll-tab-item :label="getLanguageDefine('operationRecord')">
        <div class="record-container">
          <history-record-tiled
            :show-remark="false"
            :loading="false"
            :action-data="actionRecordList"
            operation-meaning-field-name="status"
            process-date-field-name="processedDate"
            operator-field-name="processUserName"
            process-remark-field-name="processRemark"
            :remark-label="
              $T('smbl.common.view.title.operationRemark').$D('操作说明')
            "
            process-remark-info-field-name="unknown"/>
        </div>
        <div class="bottom-button-space" />
      </srm-scroll-tab-item>
    </srm-scroll-tab>

    <!-- 弹框 -->
    <srm-popup
      :visible.sync="visiblePopup"
      :position="'right'"
      :show-header="false"
      :height="'100%'">
      <!-- 详情tab -->
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
import HistoryRecordTiled from "@/components/HistoryRecordTiled";
import mixin from "../../OrderApprovalFormNew/mixin/orderMx";

export default {
  modules: [ "sodr.common", "smbl.common", "hzero.common" ],
  name: "OrderApprovalPo",
  components: { HistoryRecordTiled },
  // 订单页面共享
  mixins: [ mixin ],
  props: {
    poHeaderId: String | Number,
  },
  data() {
    return {
      headCustomizeUnitCode:
          "SODR.WORKSPACE_ORDERAPPROVAL_DETAIL.BASICINFO,SODR.WORKSPACE_ORDERAPPROVAL_DETAIL.ORGANIZATIONINFO,SODR.WORKSPACE_ORDERAPPROVAL_DETAIL.RECEIPTINFO,SODR.WORKSPACE_ORDERAPPROVAL_DETAIL.BILLINGINFO,SODR.WORKSPACE_ORDERAPPROVAL_DETAIL.ATTACHMENTINFO,SODR.WORKSPACE_ORDERAPPROVAL_DETAIL.ATTACHMENTINFO_EXTERNAL",
      lineCustomizeUnitCode: "SODR.WORKSPACE_ORDERAPPROVAL_DETAIL.DETAILINFO",
      approvalType: null
    };
  },
  beforeMount() {
    // this.headCustomizeUnitCode =
    //       "SODR.ORDER_APPROVE_LINE_LIST.HEADER,SODR.ORDER_APPROVE_LINE_LIST.DELIVERY_CATA";
    // this.lineCustomizeUnitCode =
    //       "SODR.ORDER_APPROVE_LINE_LIST.APPROVE,SODR.ORDER_APPROVE_LINE_LIST.OTHER";
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
  .change-line-tip{
    width: 100%;
    height: 24px;
    line-height: 24px;
    text-align: center;
    color: #E11900;
    font-size: 12px;
    font-weight: 500;
    background: #FFEFED;
    position: absolute;
    left:0;
    top:0;
  }
  .change-tabs{
    >>>.srm-tab-bar{
      height:32px;
      .srm-tab-bar-box{
        max-width: 134px;
        height: 20px;
        margin: 6px 0 0 6px;
        background: #EEEEEE;
        border-radius: 20px;
      }
      .srm-tab-bar-button{
        height:20px;
        padding: 0 6px;
        font-size:12px;
      }
      .srm-tab-bar-button-active{
        color: #000;
        background: #FFF;
        border:1px solid rgba(226,226,226,1);
        border-radius: 20px;
      }
    }
  }
  </style>
