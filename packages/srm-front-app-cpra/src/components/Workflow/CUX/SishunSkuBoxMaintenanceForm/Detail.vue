<template>
  <div ref="receiptWorkbench" class="create-receive-detail-container">
    <div class="create-receive-detail-scroll-el">
      <srm-scroll-tab >
        <srm-scroll-tab-item :label="$T('smbl.workFlow.view.title.detail.receipHeaderInfo').$D('基础信息')">
          <div>
            <srm-form style="padding:0 15px 10px 15px;min-height: 264px;margin-bottom: 0px;" :data-set="headDataSet" :columns="getBasicColumns()" />
          </div>
        </srm-scroll-tab-item>
        <srm-scroll-tab-item :label="$T('smbl.workFlow.view.title.detail.receipLineInfo').$D('明细行信息')" :show-title="false">
          <srm-flex style="background:#f0f2f5;height: 54px " justify="between">
            <div style="margin-left: 15px ;font-family: PingFangSC-Semibold;font-size: 16px;color: #333333;font-weight: 600;">{{ $T('smbl.workFlow.view.title.detail.receipLineInfo').$D('收货单明细行信息') }}</div>
          </srm-flex>
          <srm-list :show-bottom-bar="false" :auto-hide-bottom="true" :scrollable="false" :data-set="lineDataSet"
                    :columns="getLineColumns()" />
        </srm-scroll-tab-item>
        <!-- 操作记录 -->
        <srm-scroll-tab-item :label="$T('sinv.receipWorkbench.model.receipt.operating').$D('操作记录')">
          <div class="record-container">
            <history-record-tiled
              :action-data="operatingData"
              :remark-label="$T('slod.common.model.common.remark').$D('备注')"
              operation-meaning-field-name="processStatusMeaning"
              process-remark-field-name="name"
              operator-field-name="processedByName"
              process-date-field-name="creationDate"/>
          </div>
          <div class="bottom-button-space" />
        </srm-scroll-tab-item>
      </srm-scroll-tab>
    </div>
  </div>
</template>

<script>
import { DataSet } from "srm-mobile-ui";
import { isEmpty } from "lodash";
import HistoryRecordTiled from "@/components/HistoryRecordTiled";
import { headerDs } from "./datasource/receiveHeaderDS";
import { lineDs } from "./datasource/receiveLineDS";
import Mixin from "./mixin/DetailColumns";
import { getOperationRecord, queryData } from "./api";

export default {
  name: "SkuBoxMaintenanceForm",
  components: { HistoryRecordTiled },
  mixins: [ Mixin ],
  props: {
    parameters: {
      type: Object
    }
  },
  modules: [ "smbl.workFlow", "hzero.common", "smbl.common", "sinv.receiptWorkbench", "sinv.receiptExecution", "sinv.receipWorkbench", "slod.common" ],
  data() {
    return {
      id: "",
      approveNumber: "",
      lineDataSet: new DataSet(lineDs(this)),
      headDataSet: new DataSet(headerDs(this)),
      dataSource: [],
      operationColorMap: {
        "30_REJECTED": "danger",
        "10_NEW": "primary",
      },
      actionColorMap: {
        Approved: "success",
        Rejected: "danger",
        Delegate: "info",
        AddSign: "info",
        ApproveAndAddSign: "info",
      },
      approveResultMap: {
        Approved: "Approved",
        Rejected: "Rejected",
        AddSign: "Approved",
        ApproveAndAddSign: "Approved",
      },
      // 操作记录
      operatingData: [],
    };
  },
  computed: {},
  async beforeMount() {
    const { uniqueKey } = this.parameters;
    this.approveNumber = uniqueKey;
    this.refresh();
  },
  async mounted() {},
  methods: {
    async refresh() {
      this.headDataSet.reset();
      const res = await queryData({ approveNumber: this.approveNumber });
      if (res && !res.failed && !isEmpty(res.content)) {
        this.dataSource = res.content[0] || {};
        this.id = this.dataSource?.id || "";
        this.headDataSet.setData([ { ...this.dataSource } ]);
        this.headDataSet.locate(0);
        this.lineDataSet.setData(res.content || []);
        this.queryOperatingRecord();
      }

    },
    // 操作记录
    queryOperatingRecord() {
      getOperationRecord({ id: this.id }).then((res) => {
        if (res.length > 0) {
          this.operatingData = [];
          res.forEach((item) => {
            item.process = { text:item.processStatusMeaning, type:this.operationColorMap[item.processStatus] || "success" };
            this.operatingData.push(item);
          });
        }
      });
    }
  },
};
</script>

<style lang="stylus" scoped>
@import "~srm-mobile-ui/src/style/var.styl"
.create-receive-detail-container {
  height 100vh;
  .create-receive-detail-scroll-el {
    height 100%;
    overflow-y scroll;
    overflow-x hidden;
    padding-bottom 80px;
    .create-receive-detail-button {
      margin-right 10px;
    }
    .override-btn-group {
      display: flex;
      >>> .srm-button {
        margin-right: 10px;
        &:last-child {
          margin-right: 0;
        }
      }
    }
  }
}
.create-receive-detail-define{
  height:100%;
  .create-receive-detail-define-button{
    position:relative;
    top:30px;
    margin-left:15px;
    margin-right:15px;
  }
}
.create-receive-detail-receive-check{
  .create-receive-detail-receive-check-title{
    height: 32px;
    background: #F6F6F6;
    align-items: center;
    display: flex;
    padding-left: 15px ;
    ont-family: PingFangSC-Medium;
    font-size: 12px;
    color: #333333;
    line-height: 16px;
    font-weight: 500;
  }
  .create-receive-detail-receive-check-list{
    height: 54px;
    align-items: center;
    display: flex;
    padding-left: 15px;
    border-bottom: #F6F6F6 solid 1px;
    font-family: PingFangSC-Regular;
    font-size: 16px;
    color: #333333;
    //line-height: 22px;
    font-weight: 400;
  }
}
>>> .srm-upload{
  color:var(--font-color-white);
}
</style>
