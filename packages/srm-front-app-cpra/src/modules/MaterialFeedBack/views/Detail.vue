<template>
  <!-- 物料认证反馈单详情 -->
  <div class="detail-container">
    <srm-scroll-tab>
      <!-- 基础信息 -->
      <srm-scroll-tab-item key="basicInfo" :label="getLanguageDefine('basicInfo')" code="basicInfo">
        <srm-list :scrollable="false"
                  height="auto"
                  style="height: auto"
                  :data-set="headerInfoDs"
                  :is-template="isTemplate"
                  :template="templateInfo"
                  :page-code="nodeCode"
                  :stage-code="stageCode"
                  :refreshable="false"
                  :columns="getColumns('basicInfo')"
                  :customize-code="getCodeDefine('basicInfo')"
                  @itemClick="clickDetailInfo('one')"/>
      </srm-scroll-tab-item>
      <!-- 明细信息 -->
      <srm-scroll-tab-item key="datailInfo" :label="getLanguageDefine('datailInfo')" code="datailInfo">
        <srm-list :scrollable="false"
                  height="auto"
                  style="height: auto"
                  :show-bottom-bar="false"
                  :data-set="detailInfoDs"
                  :is-template="isTemplate"
                  :template="templateInfo"
                  :page-code="nodeCode"
                  :stage-code="stageCode"
                  :refreshable="false"
                  :columns="getColumns('datailInfo')"
                  :customize-code="getCodeDefine('datailInfo')"
                  @itemClick="clickDetailInfo('two')"/>
      </srm-scroll-tab-item>
      <!-- 样品信息 -->
      <srm-scroll-tab-item v-if="testingResultEnterFlag === 1" key="sampleInfo" :label="getLanguageDefine('sampleInfo')" code="sampleInfo">
        <srm-list :scrollable="false"
                  height="auto"
                  style="height: auto"
                  :show-bottom-bar="false"
                  :data-set="sampleInfoDs"
                  :is-template="isTemplate"
                  :template="templateInfo"
                  :page-code="nodeCode"
                  :stage-code="stageCode"
                  :refreshable="false"
                  :columns="getColumns('sampleInfo')"
                  :customize-code="getCodeDefine('sampleInfo')"
                  @itemClick="clickDetailInfo('four')"/>
      </srm-scroll-tab-item>
      <!-- 阶段信息 -->
      <srm-scroll-tab-item key="nodeInfo" :label="getLanguageDefine('nodeInfo')" code="nodeInfo">
        <srm-list :scrollable="false"
                  height="auto"
                  style="height: auto"
                  :show-bottom-bar="false"
                  :data-set="stageInfoDs"
                  :is-template="isTemplate"
                  :template="templateInfo"
                  :page-code="nodeCode"
                  :stage-code="stageCode"
                  :refreshable="false"
                  :columns="getColumns('nodeInfo')"
                  :customize-code="getCodeDefine('nodeInfo')"
                />
      </srm-scroll-tab-item>
      <!-- 操作记录 -->
      <srm-scroll-tab-item key="operationRecord" :label="getLanguageDefine('operationRecord')" code="operationRecord">
        <div class="record-container">
          <history-record-tiled
            :show-remark="false"
            :loading="false"
            :action-data="actionRecordList"
            operation-meaning-field-name="status"
            operator-field-name="processUserName"
            process-date-field-name="creationDate"
            process-remark-field-name="processRemark"
            :remark-label="$T('smbl.common.view.title.operationRemark').$D('操作说明')"
            process-remark-info-field-name="unknown"/>
        </div>
        <div class="bottom-button-space" />
      </srm-scroll-tab-item>
      <!-- 审批记录 -->
      <!-- <srm-scroll-tab-item
        v-if="type !== 'add'&&approveRecordList.length > 0"
        key="approveRecord"
        :label="getLanguageDefine('approveRecord')" code="approveRecord">
        <history-record-tiled
          :action-data="approveRecordList"
          operator-field-name="assigneeName"
          operation-meaning-field-name="name"
          process-date-field-name="endTime"
          process-remark-field-name="comment" />
      </srm-scroll-tab-item> -->
      <!-- <div v-if="type!=='readOnly'" class="approval-detail-bottom"/> -->
    </srm-scroll-tab>
    <!-- 行信息的删除和批量编辑按钮 -->
    <!-- <srm-list-bottom-bar :data-set="detailInfoDataSet" :buttons="getDetailInfoButtons"/> -->

    <!-- 详情按钮 -->
    <!-- <srm-bottom-handler v-if="!detailInfoDataSet.editFlag && type!=='readOnly'" :btn-arr="getButtons" type="tooltip" :class="type!=='readOnly'?'bottom-button': ''">
      <div slot="left"
           style="height: 48px;width: 48px;display: flex;justify-content: center;align-items: center;margin-right: 10px"
           @click="deleteRecord()">
        <em class="srm-icon icon-trash" style="font-size: 24px;color: #cbcbcb"/>
      </div>
    </srm-bottom-handler> -->

    <!-- 详情弹框 -->
    <srm-popup :visible.sync="visiblePopup"
               :position="'right'"
               :show-header="false"
               :height="'100%'">
      <srm-form
        v-if="visiblePopup"
        customize-type="detail"
        :data-set="popupData.data"
        :is-template="isTemplate"
        :template="templateInfo"
        :page-code="nodeCode"
        :stage-code="stageCode"
        :columns="getColumns(popupData.columns)"
        :customize-code="getCodeDefine(popupData.code)"/>
    </srm-popup>
  </div>
</template>

<script>

import HistoryRecordTiled from "@/components/HistoryRecordTiled";
import { $T } from "srm-mobile-ui";
import mixin from "../mixin/mixin";
import { getActionsRecordApi } from "../api/index";
export default {
  modules: [ "smdm.common", "hipspfm.common", "smbl.common", "hzero.common" ],
  name: "MaterialFeedBackDetail",
  components: {
    HistoryRecordTiled
  },
  mixins: [ mixin ],
  props: {
    parameters: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      popupData: {},
      visiblePopup: false,
      actionRecordList:[],
    };
  },
  beforeMount() {
    this.requestData();
  },
  methods: {
    // 获取 多语言配置
    getLanguageDefine(key) {
      const languageList = {
        "basicInfo": $T("smdm.common.model.common.baseInfo").$D("基本信息"),
        "datailInfo": $T("smdm.common.model.common.detailInfo").$D("明细信息"),
        "nodeInfo": $T("smdm.common.model.common.nodeInfo").$D("阶段信息"),
        "sampleInfo": $T("smdm.common.model.common.sampleInfo").$D("样品信息"),
        "operationRecord": $T("hzero.common.view.message.operateHistory").$D("操作记录"),
        "approveRecord": $T("hzero.common.button.approveHistory").$D("审批记录"),
      };
      return languageList[key] || key;
    },
    // 获取 个性化配置
    getCodeDefine(key) {
      const codeList = {
        "basicInfo": "SMBL.MATERIAL.FEEDBACK.WORKBENCH.BASEINFO",
        "datailInfo": "SMBL.MATERIAL.FEEDBACK.WORKBENCH.DETAILINFO",
        "nodeInfo": "SMBL.MATERIAL.FEEDBACK.WORKBENCH.NODEINFO",
        "sampleInfo": "SMBL.MATERIAL.FEEDBACK.WORKBENCH.SAMPLE",
        "basicInfoDetail": "SMBL.MATERIAL.FEEDBACK.WORKBENCH.BASEINFO_DETAIL",
        "datailInfoDetail": "SMBL.MATERIAL.FEEDBACK.WORKBENCH.DETALIINFO_DETAIL",
        "nodeInfoDetail": "SMBL.MATERIAL.FEEDBACK.WORKBENCH.NODEINFO_DETAIL",
        "sampleInfoDetail": "SMBL.MATERIAL.FEEDBACK.WORKBENCH.SAMPLE_DETAIL",
      };
      return codeList[key] || key;
    },
    // 点击 tab 块
    clickDetailInfo(name) {
      switch (name) {
      case "one":
        this.openDetailPopup("basicInfoDetail", this.headerInfoDs);
        break;
      case "two":
        this.openDetailPopup("datailInfoDetail", this.detailInfoDs);
        break;
      case "three":
        this.openDetailPopup("nodeInfoDetail", this.stageInfoDs);
        break;
      case "four":
        this.openDetailPopup("sampleInfoDetail", this.sampleInfoDs);
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
    async requestData() {
    // 获取操作记录
      let records = await getActionsRecordApi(this.itemAuthFeeHeaderId);
      this.actionRecordList = records.map((item) => ({
        ...item,
        status: {
          type: "info",
          text: item.processTypeMeaning,
        }
      }));
    }
  }
};
</script>

<style lang="stylus" scoped>
.detail-container-tab {
>>> .srm-scroll-content {
  height: calc(100% - 72px);
 }
}
  // 操作记录最小高度
  >>> .srm-history-record-content {
    min-height: 0px;
  }
.bottom-button {
  height: 72px;
  border-top: 1px solid #f0f2f5;
}
.feed-num-header{
  >>> .srm-list-item-card-head-left{
    max-width: 50% !important;
  }
  >>> .srm-list-item-card-head-right{
    max-width: 50% !important;
  }
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

  // 操作记录最小高度
  >>> .srm-history-record-content {
    min-height: 0px;
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