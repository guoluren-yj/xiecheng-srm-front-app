<template>
  <div class="create-receive-detail-container">
    <div class="create-receive-detail-scroll-el">
      <srm-scroll-tab>
        <srm-scroll-tab-item :label="$T('scux.acceptBench.view.basicInfo').$D('基本信息')">
          <div @click="onBasicItemClick('one')">
            <srm-form :scrollable="false" height="auto" style="height: auto" :data-set="headDataSet"
              :columns="getBasicColumns().basic" />
          </div>

        </srm-scroll-tab-item>

        <srm-scroll-tab-item :label="$T('scux.acceptBench.view.currentInfo').$D('本次验收信息')">
          <div @click="onBasicItemClick('two')">
            <srm-form :scrollable="false" height="auto" style="height: auto" :data-set="headDataSet"
              :columns="getAcceptColumns().basic" />
          </div>
        </srm-scroll-tab-item>
        <srm-scroll-tab-item :label="$T('scux.acceptBench.view.orderInfo').$D('订单验收信息')">
          <div @click="onBasicItemClick('three')">
            <srm-form :scrollable="false" height="auto" style="height: auto" :data-set="headDataSet"
              :columns="getOrderColumns().basic" />
          </div>

        </srm-scroll-tab-item>

        <srm-scroll-tab-item :label="$T('scux.acceptBench.view.acceptLineInfo').$D('验收单行信息')">
          <srm-list :scrollable="false" height="auto" style="height: auto" :data-set="lineDataSet"
            :columns="getLineColumns().basic" @itemClick="clickTabInfo('one')" />
        </srm-scroll-tab-item>


        <srm-scroll-tab-item :label="$T('scux.acceptBench.view.rateLineInfo').$D('验收/抽检评价')">
          <srm-list :scrollable="false" height="auto" style="height: auto" :data-set="rateDataSet"
            :columns="getLineRateColumns().basic" @itemClick="clickTabInfo('two')" />
        </srm-scroll-tab-item>

        <!-- 附件 -->
        <srm-scroll-tab-item :label="$T('scux.acceptBench.view.message.attachment').$D('附件')">
          <srm-list :scrollable="false" height="auto" style="height: auto" :data-set="headDataSet"
            :columns="getAttachColumns()" />
        </srm-scroll-tab-item>


      </srm-scroll-tab>


      <!-- 详情弹框 -->
      <srm-popup :visible.sync="visiblePopup" :position="'right'" :show-header="false" :height="'100%'">
        <srm-form v-if="visiblePopup" customize-type="detail" :data-set="popupData.data" :columns="popupData.columns" />
      </srm-popup>
    </div>
  </div>
</template>

<script>
import {
  getOrderAcceptApprovalHeadDetail,
} from "./api";
import { commonDs, lineDs, rateDs } from "./dataSource";
import Mixin from "./mixin/DetailColumns";

import { DataSet } from "srm-mobile-ui";
export default {
  modules: ["hipspfm.common", "scux.acceptBench"],
  name: "OrderAcceptApproval",
  mixins: [Mixin],
  props: {
    parameters: {
      type: Object,
      default: null,
    }
  },
  data() {
    return {
      headDataSet: new DataSet(commonDs()),
      lineDataSet: new DataSet(lineDs()),
      rateDataSet: new DataSet(rateDs()),
      visiblePopup: false,
    };
  },
  computed: {
  },
  async mounted() {
    this.acceptHeaderId = this.parameters.acceptHeaderId;
    if (this.acceptHeaderId) {
      try {
        this.$loading.show();
        await this.getApprovalDetail();
        this.$loading.hide();
      } catch (err) {
        this.$loading.hide();
      }
    }
  },
  methods: {
    // 头明细弹窗
    onBasicItemClick(key) {
      let columns = [];
      switch (key) {
        case "one":
          columns = this.getBasicColumns().detail
          break;
        case "two":
          columns = this.getAcceptColumns().detail
          break;
        case "three":
          columns = this.getOrderColumns().detail
          break;
        default:
          break;
      }
      this.detailPopup = this.$popup({
        showHeader: true,
        showClose: true,
        position: "right",
        showBack: false,
        height: "100%",
        rounded: false,
        content: <SrmForm
          customizeType="detail"
          style={{ padding: "0 15px" }}
          dataSet={this.headDataSet}
          columns={columns}
        />,
      });
    },
    // 打开详情页面
    async openDetailPopup(name, item) {
      this.popupData = {
        data: item,
        columns: name,
      };
      this.visiblePopup = true;
    },

    clickTabInfo(tabItem) {
      console.log(tabItem, 'tabItem')
      switch (tabItem) {
        case "one":
          this.openDetailPopup(this.getLineColumns().detail, this.lineDataSet);
          break;
        case "two":
          this.openDetailPopup(this.getLineRateColumns().detail, this.rateDataSet);
          break;
        default:
          break;
      }
    },

    // 请求数据
    async getApprovalDetail() {
      getOrderAcceptApprovalHeadDetail(this.acceptHeaderId).then(res => {
        this.headDataSet.create(res || {});
        this.rateDataSet.setData(res?.ldjtAcceptScoreList);
      })
      this.lineDataSet.addPathParameter("id", this.acceptHeaderId);
      this.lineDataSet.refresh();
    },
  }
};
</script>

<style lang="stylus" scoped>
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
</style>
