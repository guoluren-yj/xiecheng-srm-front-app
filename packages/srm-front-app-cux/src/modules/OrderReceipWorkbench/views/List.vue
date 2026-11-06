<template>
  <div style="height: 100vh">
    <srm-list
      :data-set="getDataSet"
      :columns="getColumns"
      @itemClick="clickListToDetail">
      <srm-flex slot="filter" direction="column" align="start">
        <srm-tab-bar
          display="justify"
          @indexChange="onTabIndexChange">
          <srm-tab-item :label="$T('sinv.receiptExecution.model.receipt.executeCount').$D('执行中')" code="execute"/>
          <srm-tab-item :label="$T('slod.common.model.node.allName').$D('全部')" code="finished"/>
        </srm-tab-bar>
        <srm-blank size="1px" theme="fill"/>
      </srm-flex>
      <!-- <srm-flex v-if="currentTab === 'wait'" slot="bottom" class="round-btn-box" justify="end">
        <srm-button class="round-btn" size="x-large" circle type="primary" fill @click="scanCodeForReceive">
          <em class="srm-icon icon-scan"/>
        </srm-button>
      </srm-flex> -->
    </srm-list>
    <!-- 创建按钮 -->
    <srm-bottom-handler v-if="currentTab === 'execute'" :btn-arr="getListButtons()" type="tooltip" >
      <div slot="left"
           style="height: 48px;width: 48px;display: flex;justify-content: center;align-items: center;margin-right: 10px"
           @click="scanCodeForReceive">
        <em class="srm-icon icon-scan" style="font-size: 24px;color: #cbcbcb"/>
      </div>
    </srm-bottom-handler>
  </div>
</template>

<script>
// import Vue from "vue";
import { DataSet } from "srm-mobile-ui";
import { doingDS } from "../datasource/doingDS";
import { finishDS } from "../datasource/finishDS";
import { importDS } from "../datasource/importDS";
import DoingColumns from "../mixins/DoingColumns";
import FinishColumns from "../mixins/FinishColumns";
// import scanCode from "@/mixin/scanCode";
import { created } from "../api";

import SrmAppCore from "srm-front-app-core";

export default {
  modules: [ "hzero.common", "sinv.receiptWorkbench", "sinv.receiptExecution", "sinv.receipWorkbench", "sinv.common", "scux.acceptBench", "smbl.common", "hipspfm.invoiceInspection", "slod.common" ],
  name: "OrderReceipWorkbench",
  mixins: [ DoingColumns, FinishColumns ],
  data() {
    return {
      isDoubleUnit:0,
      doingDataSet: new DataSet(doingDS()),
      finishDataSet: new DataSet(finishDS()),
      importDataSet: new DataSet(importDS()),
      nodeConfig: null,
      nodesInfos: [],
      currentTab: "execute",
      chooseFirstFlag: true,
      scanFlag:false, //扫码开启表示
      taxIncludedAmountWait:null, // 组件用不了V-model手动赋值
    };
  },
  computed: {
    getDataSet() {
      if (this.currentTab === "execute") {
        return this.doingDataSet;
      } else if (this.currentTab === "finished") {
        return this.finishDataSet;
      }
      return this.doingDataSet;
    },
    nodesInfosByIdMap() {
      const map = new Map();
      if (this.nodesInfos && this.nodesInfos.length > 0) {
        this.nodesInfos.forEach((item) => {
          map.set(item.nodeConfigId, item.nodeConfigIndexAbc);
        });
      }
      return map;
    },
    nodesInfosByIndexMap() {
      const map = new Map();
      if (this.nodesInfos && this.nodesInfos.length > 0) {
        this.nodesInfos.forEach((item) => {
          map.set(item.nodeConfigIndex, item.nodeConfigIndexAbc);
        });
      }
      return map;
    },
    //获取列表字段
    getColumns() {
      if (this.currentTab === "execute") {
        return this.getDoingColumns();
      } else if (this.currentTab === "finished") {
        return this.getFinishColumns();
      }
      // return null;
      return this.getDoingColumns();
    },
  },
  activated() {
  },
  beforeMount() {
    this.currentTab = this.$store.getters["OrderReceipWorkbench/getTabPosition"];
    this.chooseFirstFlag = this.$store.getters["OrderReceipWorkbench/getSecondTabFirstFlag"];
  },
  mounted() {
    this.getDataSet.refresh();
  },
  methods: {
    //扫码收货
    scanCodeForReceive() {
      let that = this;
      SrmAppCore.scanQrCode(function (result) {
        console.info("result:", result);
        created({ displayPoNum: result }).then((res) => {
          if (res && !res.failed) {
            that.jumpDetail(res.acceptHeaderId, "1", "0");
            that.$notification.open({
              message: that.$T("slod.common.view.message.optionSuccess").$D("操作成功"),
              duration: 1000,
            });
          } else {
            that.$notification.open({
              message: res.message,
              duration: 2000,
            });
          }
        });
      }, function (error) {
        console.info(that.$T("hipspfm.invoiceInspection.view.message.scanAbnormal").$D("扫码异常"), error);
        that.$notification.open({
          message: that.$T("hipspfm.invoiceInspection.view.message.scanAbnormal").$D("扫码异常") + (error ? JSON.stringify(error) : ""),
          key,
          class: "notification",
        });
      });
    },
    //列表操作按钮
    getListButtons() {
      return [
        {
          text: this.$T("hzero.common.button.creat").$D("新建"),
          type: "primary",
          fill: true,
          handler: () => {
            this.createDetail();
          }
        }
      ];
    },
    createDetail() {
      this.jumpDetail(null, "1", "1");
    },
    // 选择某个单据
    clickListToDetail(record) {
      const acceptHeaderId = record.data.acceptHeaderId;
      const editor = this.currentTab === "execute" ? "1" : "0";
      this.jumpDetail(acceptHeaderId, editor);
    },
    //跳转详情
    jumpDetail(acceptHeaderId, editor = "0", creation = "0") {
      this.$router.push({
        name: "OrderReceipWorkbenchDetail",
        query: {
          acceptHeaderId: acceptHeaderId,
          editor: editor,
          creation: creation,
        }
      });
    },
    //一级tab切换
    onTabIndexChange(index, oldIndex, code) {
      this.currentTab = code;
      if (this.nodeConfig && this.nodeConfig.nodeConfigId !== -1) {
        this.getDataSet.addQueryParameter("nodeConfigId", this.nodeConfig.nodeConfigId);
      }
      this.getDataSet.refresh();
    },
    //执行中状态按钮颜色
    getDoingStatusType(rcvStatusCode) {
      let buttonType = "success";
      switch (rcvStatusCode) {
      case "10_NEW":
        buttonType = "warn";
        break;
      case "30_REJECTED":
        buttonType = "danger";
        break;
      default:
        buttonType = "success";
        break;
      }
      return buttonType;
    },
  }
};
</script>

  <style lang="stylus" scoped>

  .receive-workplace-list-second-tab {
    width 375px;
    height 40px;

    .first-button {
      margin-top 8px;
      margin-left 15px;
      margin-right 8px;
    }

    .second-button {
      margin-top 8px;

    }

    .no-active {
      background white;
      color #333333;
    }
  }
  .round-btn {
    line-height normal;
    pointer-events auto;

    .srm-icon {
      font-size 28px;
    }
  }

  .round-btn-box {
    background transparent;
    padding-bottom 80px;
    padding-right 15px;
  }

  >>> .srm-upload{
    color:var(--font-color-white);
  }
  </style>
