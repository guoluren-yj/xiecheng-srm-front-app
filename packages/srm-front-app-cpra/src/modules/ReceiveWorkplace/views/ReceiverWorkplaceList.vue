<!-- eslint-disable no-invalid-this -->
<!-- eslint-disable no-invalid-this -->
<template>
  <div style="height: 100vh">
    <srm-list v-if="getDataSet" :customize-code="getListCustomizeCode" :data-set="getDataSet"
              :columns="getColumns" :buttons="getListButtons" @itemClick="onListItemClick()">
      <srm-dropdown slot="searchLeft" v-model="nodeConfig" :value="nodeConfig" type="tooltip"
                    :text="$T('sinv.receiptWorkbench.view.receipt.nodeTextAll').$D('全部')" @select="nodeConfigSelect()">
        <div class="receive-workplace-list-dropdown" direction="column">
          <srm-dropdown-item v-for="i in nodesInfos" :key="i.nodeConfigIndexAbc" :value="i" :text="i.nodeConfigName"/>
        </div>
      </srm-dropdown>
      <srm-flex slot="filter" direction="column" align="start">
        <!-- :tabs="[
            $T('sinv.receiptExecution.model.receipt.waitCount').$D('待收货'),
            $T('sinv.receiptExecution.model.receipt.returnsCount').$D('可退回'),
            $T('sinv.receiptExecution.model.receipt.executeCount').$D('执行中'),
            $T('sinv.receiptExecution.model.receipt.okCount').$D('已完成')
          ]"
          display="justify"
          :active-index="currentTab"
          @indexChange="onTabIndexChange" -->
        <srm-tab-bar
          display="justify"
          customize-code="SMBL.RECEIVE_WORKPLACE.TAB"
          @indexChange="onTabIndexChange">
          <srm-tab-item :label="$T('sinv.receiptExecution.model.receipt.waitCount').$D('待收货')" code="wait"/>
          <srm-tab-item :label=" $T('sinv.receiptExecution.model.receipt.returnsCount').$D('可退回')" code="returns"/>
          <srm-tab-item :label="$T('sinv.receiptExecution.model.receipt.executeCount').$D('执行中')" code="execute"/>
          <srm-tab-item :label="$T('sinv.receiptExecution.model.receipt.okCount').$D('已完成')" code="finished"/>
        </srm-tab-bar>
        <div v-if="currentTab === 'execute'||currentTab === 'finished'" class="receive-workplace-list-second-tab">
          <srm-button :class="['first-button',{'no-active':!chooseFirstFlag}]" size="small" type="primary"
                      @click="onSecondTabIndexChange(true)">
            {{ $T('sinv.receiptExecution.model.receipt.aggregateTableView').$D('按收货单') }}
          </srm-button>
          <srm-button :class="[{'no-active':chooseFirstFlag}]" size="small" type="primary"
                      @click="onSecondTabIndexChange(false)">
            {{ $T('sinv.receiptExecution.model.receipt.flatTableView').$D('按收货行') }}
          </srm-button>
        </div>
        <srm-blank size="1px" theme="fill"/>
      </srm-flex>
      <srm-flex v-if="currentTab === 'wait'" slot="bottom" class="round-btn-box" justify="end">
        <srm-button class="round-btn" size="x-large" circle type="primary" fill :disabled="btnDisabled" @click="scanCodeForReceive">
          <em class="srm-icon icon-scan"/>
        </srm-button>
      </srm-flex>
    </srm-list>
    <!--    <srm-button style="position: absolute;top: 30px" @click="scanCodeTest">测试按钮</srm-button> -->
  </div>
</template>

<script>
import { debounce, isNil, isEmpty } from "lodash";
import { DataSet, SrmUtil, SrmMath } from "srm-mobile-ui";
import { reverseDs } from "../datasource/reverseDS";
import { waitingDS } from "../datasource/waitingDS";
import { doingByLineDS, doingDS } from "../datasource/doingDS";
import { finishByLineDS, finishDS } from "../datasource/finishDS";
import { importDS } from "../datasource/importDS";
import { createReceive, getAllNodeInfo, reverseExecute, submit, repost, getReverseNode, queryDoubleUomConfig, validateAsnNum } from "../api";
import SourceRelation from "../component/SourceRelation";
import { Exception } from "@/utils";
import BigNumber from "bignumber.js";
import WaitingColumns from "../mixins/WaitingColumns";
import ReverseColumns from "../mixins/ReverseColumns";
import DoingColumns from "../mixins/DoingColumns";
import FinishColumns from "../mixins/FinishColumns";
import ImportColumns from "../mixins/ImportColumns";
import CustomSpecsColumns from "../mixins/CustomSpecsColumns";
import ReceiverWorkplaceListMethod from "../../CUX_PART/Method/ReceiverWorkplaceListMethod";

// import scanCode from "@/mixin/scanCode";
import SrmAppCore from "srm-front-app-core";
import Vue from "vue";

export default {
  modules: [ "slod.deliveryWorkbench", "slod.common", "smbl.common", "hzero.common", "sinv.receiptWorkbench", "sinv.receiptExecution", "sinv.receipWorkbench", "sinv.common", "hipspfm.invoiceInspection" ],
  name: "ReceiverWorkplaceList",
  extends: ReceiverWorkplaceListMethod,
  mixins: [ WaitingColumns, ReverseColumns, DoingColumns, FinishColumns, ImportColumns, CustomSpecsColumns ],
  data() {
    return {
      waitingDataSet: null,
      reverseDataSet: null,
      doingDataSet: null,
      doingByLineDataSet: null,
      finishDataSet: null,
      finishByLineDataSet: null,
      importDataSet: new DataSet(importDS(this)),
      nodeConfig: null,
      nodesInfos: [],
      currentTab: "wait",
      chooseFirstFlag: true,
      scanFlag:false, //扫码开启表示
      isDoubleUnit:0,
      taxIncludedAmountWait:null, // 组件用不了V-model手动赋值
      btnDisabled: true,
    };
  },
  computed: {
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
    getDataSet() {
      if (this.currentTab === "wait") {
        return this.waitingDataSet;
      } else if (this.currentTab === "returns") {
        return this.reverseDataSet;
      } else if (this.currentTab === "execute") {
        if (this.chooseFirstFlag) {
          return this.doingDataSet;
        }
        return this.doingByLineDataSet;
      } else if (this.currentTab === "finished") {
        if (this.chooseFirstFlag) {
          return this.finishDataSet;
        }
        return this.finishByLineDataSet;
      }
      return this.waitingDataSet;
    },
    //获取列表字段
    getColumns() {
      if (this.currentTab === "wait") {
        return this.getWaitingColumns();
      } else if (this.currentTab === "returns") {
        return this.getReverseColumns();
      } else if (this.currentTab === "execute") {
        if (this.chooseFirstFlag) {
          return this.getDoingColumns();
        }
        return this.getDoingByLineColumns();
      } else if (this.currentTab === "finished") {
        if (this.chooseFirstFlag) {
          return this.getFinishColumns();
        }
        return this.getFinishByLineColumns();
      }
      return null;
    },
    //获取明细字段
    getDetailColumns() {
      if (this.currentTab === "wait") {
        return this.getWaitingDetailColumns();
      } else if (this.currentTab === "returns") {
        return this.getReverseDetailColumns();
      } else if (this.currentTab === "execute") {
        if (this.chooseFirstFlag) {
          return this.getDoingDetailColumns();
        }
        return this.getDoingByLineDetailColumns();
      } else if (this.currentTab === "finished") {
        if (this.chooseFirstFlag) {
          return this.getFinishDetailColumns();
        }
        return this.getFinishByLineDetailColumns();
      }
      return null;
    },
    //列表操作按钮
    getListButtons() {
      if (this.currentTab === "wait") {
        return [
          {
            text: this.$T("hzero.common.button.creat").$D("新建"),
            type: "primary",
            fill: true,
            visible: true,
            disabled: (checkedList) => checkedList.length === 0,
            callback: () => {
              this.createReceive();
            }
          }
        ];
      } else if (this.currentTab === "returns") {
        return [
          {
            text: this.$T("sinv.receiptWorkbench.model.receipt.sendBack").$D("退回"),
            type: "danger",
            fill: true,
            visible: true,
            disabled: (checkedList) => checkedList.length === 0,
            callback: () => {
              this.reverse();
            }
          }
        ];
      } else if (this.currentTab === "execute") {
        if (this.chooseFirstFlag) {
          return [
            {
              text: this.$T("smbl.common.button.delete").$D("删除"),
              type: "danger",
              bordered: true,
              visible: true,
              disabled: (checkedList) => {
                let disabledFlag = false;
                if (checkedList.length === 0) {
                  disabledFlag = true;
                  return disabledFlag;
                }
                checkedList.forEach((item) => {
                  if (item.data.rcvStatusCode === "20_SUBMITTED") {
                    disabledFlag = true;
                    return;
                  }
                });
                return disabledFlag;
              },
              callback: () => {
                this.submitData("50_DELETED");
              }
            },
            {
              text: this.$T("smbl.common.button.submit").$D("提交"),
              type: "primary",
              fill: true,
              visible: true,
              disabled: (checkedList) => {
                let disabledFlag = false;
                if (checkedList.length === 0) {
                  disabledFlag = true;
                }
                checkedList.forEach((item) => {
                  if (item.data.rcvStatusCode === "20_SUBMITTED") {
                    disabledFlag = true;
                    return;
                  }
                });
                return disabledFlag;
              },
              callback: () => {
                this.submitData("40_FINISHED");
              }
            }
          ];
        }
      }
      return [];
    },
    //详情页按钮
    getDetailButtons() {
      let buttons = [];
      if (this.currentTab === "wait") {
        return [ {
          title: this.$T("hzero.common.button.ok").$D("确定"),
          type: "primary",
          bordered: true,
          size: "small",
          handler: () => {
            this.detailPopup.closePopup();
          }
        },
        {
          title: this.$T("hzero.common.button.creat").$D("新建"),
          fill: true,
          type: "primary",
          size: "small",
          handler: () => {
            this.waitingDataSet.select(this.waitingDataSet.current);
            this.detailPopup.closePopup();
            this.createReceive();
          }
        } ];
      } else if (this.currentTab === "returns") {
        return [
        //     {
        //   title: this.$T("hzero.common.button.ok").$D("确定"),
        //   type: "primary",
        //   bordered: true,
        //   size: "small",
        //   handler: () => {
        //     this.detailPopup.closePopup();
        //   }
        // },
          {
            title: this.$T("sinv.receiptWorkbench.model.receipt.sendBack").$D("退回"),
            fill: true,
            type: "primary",
            size: "small",
            handler: () => {
              this.reverseDataSet.unSelectAll();
              this.reverseDataSet.select(this.reverseDataSet.current);
              this.detailPopup.closePopup();
              this.reverse();
            }
          }
        ];
      } else if (this.currentTab === "execute" && this.chooseFirstFlag) {
        return [ {
          title: this.$T("smbl.common.button.delete").$D("删除"),
          type: "danger",
          bordered: true,
          size: "small",
          handler: () => {
            this.doingDataSet.select(this.doingDataSet.current);
            this.detailPopup.closePopup();
            this.submitData("50_DELETED");
          }
        },
        {
          title: this.$T("smbl.common.button.submit").$D("提交"),
          fill: true,
          type: "primary",
          size: "small",
          handler: () => {
            this.doingDataSet.select(this.doingDataSet.current);
            this.detailPopup.closePopup();
            this.submitData("40_FINISHED");
          }
        } ];
      }

      return buttons;
    },
    //获取列表个性化
    getListCustomizeCode() {
      if (this.currentTab === "wait") {
        return "SMBL.RECEIVE_WORKPLACE.WAITIN_LIST.K";
      } else if (this.currentTab === "returns") {
        return "SMBL.RECEIVE_WORKPLACE.REVERSE_LIST.K";
      } else if (this.currentTab === "execute") {
        if (this.chooseFirstFlag) {
          return "SMBL.RECEIVE_WORKPLACE.DOING_LIST.K";
        }
        return "SMBL.RECEIVE_WORKPLACE.DOING_LIST_LINE.K";
      } else if (this.currentTab === "finished") {
        if (this.chooseFirstFlag) {
          return "SMBL.RECEIVE_WORKPLACE.FINISH_LIST.K";
        }
        return "SMBL.RECEIVE_WORKPLACE.FINISH_LIST_LINE.K";
      }
      return null;
    },
    //获取明细个性化编码
    getDetailCustomizeCode() {
      if (this.currentTab === "wait") {
        return "SMBL.RECEIVE_WORKPLACE.WAITING_LIST_DETAIL.K";
      } else if (this.currentTab === "returns") {
        return "SMBL.RECEIVE_WORKPLACE.REVERSE_LIST_DETAIL.K";
      } else if (this.currentTab === "execute") {
        return "SMBL.RECEIVE_WORKPLACE.DOING_LIST_DETAIL.K";
      } else if (this.currentTab === "finished") {
        return "SMBL.RECEIVE_WORKPLACE.FINISH_LIST_DETAIL.K";
      }
      return null;
    },
    apiCustomizeUnitCode() {
      if (this.currentTab === "wait") {
        return this.nodeConfig ? "SINV.RECEIPT_WORKBENCH_THING.WAIT." + this.nodeConfig.nodeConfigIndexAbc + ",SINV.RECEIPT_WORKBENCH_THING.WAIT_SEARCH" : "SINV.RECEIPT_WORKBENCH_THING.WAIT.K,SINV.RECEIPT_WORKBENCH_THING.WAIT_SEARCH";
      } else if (this.currentTab === "returns") {
        return this.nodeConfig ? "SINV.RECEIPT_WORKBENCH_THING.RETURN." + this.nodeConfig.nodeConfigIndexAbc + ",SINV.RECEIPT_WORKBENCH_THING.RETURN_SEARCH" : "SINV.RECEIPT_WORKBENCH_THING.RETURN.K,SINV.RECEIPT_WORKBENCH_THING.RETURN_SEARCH";
      } else if (this.currentTab === "execute") {
        if (this.chooseFirstFlag) {
          return this.nodeConfig ? "SINV.RECEIPT_WORKBENCH_THING.COURSE." + this.nodeConfig.nodeConfigIndexAbc + ",SINV.RECEIPT_WORKBENCH_THING.COURSE_SEARCH" : "SINV.RECEIPT_WORKBENCH_THING.COURSE.K,SINV.RECEIPT_WORKBENCH_THING.COURSE_SEARCH";
        }
        return this.nodeConfig ? "SINV.RECEIPT_WORKBENCH_THING.COURSE.ASN" + this.nodeConfig.nodeConfigIndexAbc + ",SINV.RECEIPT_WORKBENCH_THING.COURSE_SEARCH" : "SINV.RECEIPT_WORKBENCH_THING.COURSE.ASN.K,SINV.RECEIPT_WORKBENCH_THING.COURSE_SEARCH";
      } else if (this.currentTab === "finished") {
        if (this.chooseFirstFlag) {
          return this.nodeConfig ? "SINV.RECEIPT_WORKBENCH_THING.END.DAN." + this.nodeConfig.nodeConfigIndexAbc + ",SMBL.RECEIVE_WORKPLACE.FINISH_LIST.SEARCH" : "SINV.RECEIPT_WORKBENCH_THING.END.DAN.K,SMBL.RECEIVE_WORKPLACE.FINISH_LIST.SEARCH";
        }
        return this.nodeConfig ? "SINV.RECEIPT_WORKBENCH_THING.END.HAN." + this.nodeConfig.nodeConfigIndexAbc + ",SMBL.RECEIVE_WORKPLACE.FINISH_LIST_LINE.SEARCH" : "SINV.RECEIPT_WORKBENCH_THING.END.HAN.K,SMBL.RECEIVE_WORKPLACE.FINISH_LIST_LINE.SEARCH";
      }
      return null;
    }
  },
  activated() {
    this.currentTab = this.$store.getters["ReceiveWorkplace/getTabPosition"];
    this.chooseFirstFlag = this.$store.getters["ReceiveWorkplace/getSecondTabFirstFlag"];
    // this.getDataSet.addQueryParameter("customizeUnitCode", this.apiCustomizeUnitCode);
    // this.getDataSet.refresh();
    this.queryDoubleUomConfig();
  },
  beforeMount() {
    this.queryDoubleUomConfig();
  },
  mounted() {
    this.getAllNodeInfo();
  },
  methods: {
    // 根据数量换算基本数量
    async conversionUpdate({
      record,
      isDoubleUnit,
      value,
      changeField,
    }) {
      const {
        itemId,
        secondaryQuantity,
        secondaryUomRate,
      } = record;
      const val = value && value?.charAt(value.length - 1);
      if (changeField === "secondaryQuantity" && this.isDoubleUnit) {
        if (isDoubleUnit) {
          try {
          // 订单来源系统为【电商商城、目录化商城】
            if (record.poSourcePlatform === "CATALOGUE" || record.poSourcePlatform === "E-COMMERCE") {
              if (record.subjectType === "QUANTITY") {
                const secData = SrmUtil.getNumberPrecision(value, isNil(record?.secondaryUomPrecision) ? 10 : record?.secondaryUomPrecision);
                const dataNum = SrmUtil.getNumberPrecision(new BigNumber(secondaryQuantity * secondaryUomRate), isNil(record?.uomPrecision) ? 10 : record?.uomPrecision);
                const num = SrmMath.toFormat(dataNum);
                const secNum = SrmMath.toFormat(secData);
                if (val !== ".") {
                  this.$set(record, "secondaryQuantity", secNum);
                  this.$set(record, "quantity", num);
                } else {
                  console.log("小数点处理");
                }
              }
              return false;
            }
            if (itemId && value) {
              const secData = SrmUtil.getNumberPrecision(value, isNil(record?.secondaryUomPrecision) ? 10 : record?.secondaryUomPrecision);
              const dataNum = SrmUtil.getNumberPrecision(SrmMath.times(new BigNumber(value), secondaryUomRate), isNil(record?.uomPrecision) ? 10 : record?.uomPrecision);
              const num = SrmMath.toFormat(dataNum);
              const secNum = SrmMath.toFormat(secData);
              if (val !== ".") {
                this.$set(record, "secondaryQuantity", secNum);
                this.$set(record, "quantity", num);
              } else {
                console.log("小数点处理");
              }
            } else {
              const secData = SrmUtil.getNumberPrecision(value, isNil(record?.secondaryUomPrecision) ? 10 : record?.secondaryUomPrecision);
              const dataNum = SrmUtil.getNumberPrecision(record.secondaryQuantity, isNil(record?.uomPrecision) ? 10 : record?.uomPrecision);
              const num = SrmMath.toFormat(dataNum);
              const secNum = SrmMath.toFormat(secData);
              if (val !== ".") {
                this.$set(record, "secondaryQuantity", secNum);
                this.$set(record, "quantity", num);
              } else {
                console.log("小数点处理");
              }
            }
          } finally {
          // this.$loading.hide();
          }
        }
      } else if (changeField === "taxIncludedAmount") {
        // 根据金额反算基本数量
        if (record.orderTypeCode === "PC" && record.payRatio && value) {
          const quality = SrmMath.div(SrmMath.times(SrmMath.times(value, record.unitPriceBatch), 100000000), SrmMath.times(SrmMath.times(record.taxIncludedPrice, record.payRatio), 1000000));
          this.$set(record, "quantity", parseFloat(SrmUtil.getNumberPrecision(quality, isNil(record?.uomPrecision) ? 10 : record?.uomPrecision)));
          if (this.isDoubleUnit && record.subjectType === "AMOUNT") {
            // ->再由基本算辅助数量
            const secondaryQuality = SrmMath.div(quality, record.secondaryUomRate);
            this.$set(record, "secondaryQuantity", parseFloat(SrmUtil.getNumberPrecision(secondaryQuality, isNil(record?.secondaryUomPrecision) ? 10 : record?.secondaryUomPrecision)));
          }
        } else {
          const otherQuality = SrmMath.div(SrmMath.times(SrmMath.times(value, record.unitPriceBatch), 1000000), SrmMath.times(record.taxIncludedPrice, 1000000));
          this.$set(record, "quantity", parseFloat(SrmUtil.getNumberPrecision(otherQuality, isNil(record?.uomPrecision) ? 10 : record?.uomPrecision)));
          if (this.isDoubleUnit && record.subjectType === "AMOUNT") {
            // ->再由基本算辅助数量
            const secondaryQuality = SrmMath.div(otherQuality, record.secondaryUomRate);
            this.$set(record, "secondaryQuantity", parseFloat(SrmUtil.getNumberPrecision(secondaryQuality, isNil(record?.secondaryUomPrecision) ? 10 : record?.secondaryUomPrecision)));
          }
        }
      }
    },
    amountRender({
      value,
      record,
      precision,
      changeField,
    }) {
      const val = value && value?.charAt(value.length - 1);
      const dataNum = SrmUtil.getNumberPrecision(new BigNumber(value), isNil(precision) ? 10 : precision);
      const num = SrmMath.toFormat(dataNum);
      if (val !== ".") {
        this.$set(record, [ changeField ], num);
      } else {
        console.log("小数点处理");
      }
    },
    // 行数量变更
    lineNameChange: debounce(async function(val, item, changeField, precision) {
      setTimeout(async function() {
        // 换算
        // eslint-disable-next-line no-invalid-this
        if (changeField === "secondaryQuantity" && this.isDoubleUnit) {
          await this.conversionUpdate({ value:val, record: item, isDoubleUnit: this.isDoubleUnit, changeField });
        }
        if (changeField === "quantity") {
          this.amountRender({ value:val, record: item, isDoubleUnit: this.isDoubleUnit, changeField, precision });
        }
      // eslint-disable-next-line no-invalid-this
      }.bind(this), 0);
    }, 500),
    // 行金额变更
    lineAmountChange: debounce(async function(val, item, changeField) {
      setTimeout(async function() {
        // this.taxIncludedAmountWait = val;
        item.taxIncludedAmount = val;
        // 换算
        // eslint-disable-next-line no-invalid-this
        if (changeField === "taxIncludedAmount" && this.isDoubleUnit) {
          await this.conversionUpdate({ value:val, record: item, isDoubleUnit: this.isDoubleUnit, changeField });
        }

      // eslint-disable-next-line no-invalid-this
      }.bind(this), 0);
    }, 500),
    // 查询双单位
    async queryDoubleUomConfig() {
      await queryDoubleUomConfig().then((res) => {
        this.isDoubleUnit = Number(res);
        this.waitingDataSet = new DataSet(waitingDS(this, this.isDoubleUnit));
        this.reverseDataSet = new DataSet(reverseDs(this.isDoubleUnit));
        this.doingDataSet = new DataSet(doingDS(this.isDoubleUnit));
        this.doingByLineDataSet = new DataSet(doingByLineDS(this.isDoubleUnit));
        this.finishDataSet = new DataSet(finishDS(this.isDoubleUnit));
        this.finishByLineDataSet = new DataSet(finishByLineDS(this.isDoubleUnit));
        this.getDataSet.addQueryParameter("customizeUnitCode", this.apiCustomizeUnitCode);
        this.getDataSet.refresh();
      });
    },
    //节点选择筛选
    nodeConfigSelect() {
      if (this.nodeConfig && this.nodeConfig.nodeConfigId !== -1) {
        this.getDataSet.addQueryParameter("nodeConfigId", this.nodeConfig.nodeConfigId);
      } else {
        this.nodeConfig = null;
        this.getDataSet.addQueryParameter("nodeConfigId", null);
      }
      this.getDataSet.addQueryParameter("customizeUnitCode", this.apiCustomizeUnitCode);
      this.getDataSet.refresh();
    },
    //基于为收货的数据新建收货单
    createReceive(data) {
      const bodys = [];
      //data有值的情况，不是在当前页面勾选创建，来自于扫码后查询出来的结果直接进行创建
      if (data) {
        data.forEach((item) => {
          // 龙大埋点
          if (this.over$validateHange && typeof this.over$validateHange === "function") {
            const response = this.over$validateHange();
            if (response) {
              bodys.push({ ...item, attributeVarchar3: "2" });
            } else {
              bodys.push(item);
            }
          } else {
            bodys.push(item);
          }
        });
      } else {
        this.waitingDataSet.selected.forEach((record) => {
          // 龙大埋点
          if (this.over$validateHange && typeof this.over$validateHange === "function") {
            const response = this.over$validateHange();
            if (response) {
              bodys.push({ ...record.data, attributeVarchar3: "2" });
            } else {
              bodys.push(record.data);
            }
          } else {
            bodys.push(record.data);
          }
        });
      }
      this.$loading.show();
      console.log(bodys, "bodys");
      createReceive(bodys).then((res) => {
        const result = Array.isArray(res) && res.length && res[0];
        if (result) {
          this.$router.push({
            name: "ReceiverWorkplaceDetail",
            query: {
              rcvTrxHeaderId: result.rcvTrxHeaderId,
              returnFlag: 0,
              nodeConfigIndexAbc: this.nodesInfosByIdMap.get(result.nodeConfigId),
              cacheKey: result.cacheKey,
              isDoubleUnit:this.isDoubleUnit
            }
          });
        }
      }).catch((e) => {
        console.info(e);
      }).finally(() => {
        this.$loading.hide();
      });
    },
    //打开收货状态关联单
    onSourceStatusItemClick(data) {
      let titleTemp = "【" + data.orderTypeName + "】";
      if (data.orderTypeCode === "ORDER") {
        titleTemp = titleTemp + data.fromDisplayPoHeaderAndLineNum;
      }
      if (data.orderTypeCode === "ASN") {
        titleTemp = titleTemp + data.fromDisplayAsnHeaderAndLineNum;
      }
      if (data.orderTypeCode === "PC") {
        titleTemp = titleTemp + data.fromPcHeaderAndLineNum;
      }
      this.$popup({
        title: titleTemp,
        showHeader: true,
        showClose: true,
        height: "565px",
        rounded: true,
        content: <SourceRelation sourceHeaderNum={data.sourceHeaderNum} sourceLineNum={data.sourceLineNum} isDoubleUnit={this.isDoubleUnit}
          strategyHeaderId={data.strategyHeaderId.toString()} hidePriceFlag={data.hidePriceFlag}/>
      });
    },
    //打开待收货详情弹窗
    onListItemClick() {
      // this.detailShowFlag = true;
      if (this.currentTab === "execute" && this.chooseFirstFlag || this.currentTab === "finished" && this.chooseFirstFlag) {
        this.jumpDetail(this.getDataSet.current.data.rcvTrxHeaderId, this.getDataSet.current.data.returnedFlag, this.getDataSet.current.data.nodeConfigIndex, this.isDoubleUnit);
      } else {
        this.detailPopup = this.$popup({
          showHeader: true,
          position: "right",
          showBack: true,
          content: <SrmForm
            style={{ padding: "0 15px" }}
            customizeType="detail"
            customizeCode={this.getDetailCustomizeCode}
            dataSet={this.getDataSet}
            buttons={this.getDetailButtons}
            columns={this.getDetailColumns}
          />,
        });
      }
    },
    //打开已完成导入状态列表
    onImportItemClick(data) {
      this.importDataSet.addQueryParameter("id", data.rcvTrxLineId);
      this.importDataSet.addQueryParameter("headerId", data.rcvTrxHeaderId);
      this.importDataSet.addPathParameter("rcvTrxLineId", data.rcvTrxLineId);
      this.importDataSet.addPathParameter("rcvTrxHeaderId", data.rcvTrxHeaderId);
      this.$popup({
        title: this.$T("sinv.common.view.title.detailStatus").$D("状态明细"),
        showHeader: true,
        showClose: true,
        height: "565px",
        rounded: true,
        content: <SrmList data-set={this.importDataSet} columns={this.getImportColumns()}/>
      });
    },
    //导入失败数据重新执行
    repostFail(data) {
      this.$loading.show();
      repost(data.rcvTrxHeaderId, data.rcvTrxLineId, data).then((res) => {
        if (res && !res.failed) {
          this.importDataSet.refresh();
        }
      }).catch((e) => {
        console.info(e);
      }).finally(() => {
        this.$loading.hide();
      });
    },
    //回退
    reverse() {
      let nodeConfigId = this.reverseDataSet.selected[0].data.nodeConfigId;
      let strategyLineIds = "";
      this.reverseDataSet.selected.map((item) => {
        if (nodeConfigId !== item.data.nodeConfigId) {
          // eslint-disable-next-line new-cap
          Exception(this, this.$T("sinv.receipWorkbench.model.receipt.sendBackWarning").$D("策略节点不一致，请重新选择！"), []);
        }
        strategyLineIds = item.data.strategyLineId + (strategyLineIds ? "," + strategyLineIds : "");
      });
      this.$loading.show();
      getReverseNode(nodeConfigId, strategyLineIds).then((res) => {
        if (res && !res.failed) {
          if (res.content.length === 1) {
            this.reverseExecute(res.content);
          } else {
            this.$lov("SPUC.SINV_REVERSE_NODE_URL", this.reverseExecute, {
              multiple: false,
              subDisplayField: "rcvTypeCode",
              queryParams: {
                nodeConfigId: nodeConfigId,
                tenantId: SrmUtil.getTenantId(),
                strategyLineIds: strategyLineIds
              },
            });
          }
        }
      }).catch((res) => {
        console.info(res);
      }).finally(() => {
        this.$loading.hide();
      });

    },
    //回退执行
    reverseExecute(checkedValue) {
      let bodyList = this.reverseDataSet.selected.map((item) => item.data);
      this.$loading.show();
      reverseExecute(checkedValue[0].rcvTrxTypeId, checkedValue[0].nodeConfigId, bodyList).then((res) => {
        //跳转详情页
        if (res && res.rcvTrxHeaderId) {
          this.$router.push({
            name: "ReceiverWorkplaceDetail",
            query: {
              isDoubleUnit: this.isDoubleUnit,
              rcvTrxHeaderId: res.rcvTrxHeaderId,
              returnFlag: 1,
              nodeConfigIndexAbc: this.nodesInfosByIdMap.get(res?.nodeConfigId)
            }
          });
        }
      }).catch((e) => {
        console.info(e);
      }).finally(() => {
        this.$loading.hide();
      });
    },
    //提交
    submitData(sugRcvStatusCode) {
      let bodyList = this.doingDataSet.selected.map((item) => item.data);
      if (sugRcvStatusCode === "50_DELETED") {
        Vue.prototype.$dialog({
          title: Vue.prototype.$T("smbl.common.message.tip").$D("提示"),
          content: Vue.prototype.$T("smbl.common.message.confirmDelete", [ bodyList.length ]).$D("是否确认删除{count}条数据？"),
          onOk: () => {
            this.$loading.show();
            submit(sugRcvStatusCode, bodyList).then(() => {
              this.doingDataSet.refresh();
            }).catch((e) => {
              console.info(e);
            }).finally(() => {
              this.$loading.hide();
            });
          },
          onCancel: () => {
            this.doingDataSet.unSelectAll();
          }
        });
      } else {
        this.$loading.show();
        submit(sugRcvStatusCode, bodyList).then(() => {
          this.doingDataSet.refresh();
        }).catch((e) => {
          console.info(e);
        }).finally(() => {
          this.$loading.hide();
        });
      }
    },
    //跳转详情
    jumpDetail(rcvTrxHeaderId, returnFlag, nodeConfigIndex, isDoubleUnit) {
      this.$router.push({
        name: "ReceiverWorkplaceDetail",
        query: {
          isDoubleUnit: isDoubleUnit,
          rcvTrxHeaderId: rcvTrxHeaderId,
          returnFlag: returnFlag,
          nodeConfigIndexAbc: this.nodesInfosByIndexMap.get(nodeConfigIndex)
        }
      });
    },
    //一级tab切换
    onTabIndexChange(index, oldIndex, code) {
      this.currentTab = code;
      console.info(this.$store, "ggggg");
      this.$store.commit("ReceiveWorkplace/setTabPosition", this.currentTab);
      if (this.nodeConfig && this.nodeConfig.nodeConfigId !== -1) {
        this.getDataSet.addQueryParameter("nodeConfigId", this.nodeConfig.nodeConfigId);
      }
      this.getDataSet.addQueryParameter("customizeUnitCode", this.apiCustomizeUnitCode);
      this.getDataSet.refresh();
    },
    //二级tab切换
    async onSecondTabIndexChange(val) {
      this.chooseFirstFlag = val;
      this.$store.commit("ReceiveWorkplace/setSecondTabFirstFlag", this.chooseFirstFlag);
      if (this.nodeConfig && this.nodeConfig.nodeConfigId !== -1) {
        this.getDataSet.addQueryParameter("nodeConfigId", this.nodeConfig.nodeConfigId);
      }
      this.getDataSet.addQueryParameter("customizeUnitCode", this.apiCustomizeUnitCode);
      this.getDataSet.refresh();
    },
    //获取节点
    getAllNodeInfo() {
      getAllNodeInfo().then((res) => {
        if (Array.isArray(res) && res.length) {
          this.nodesInfos.push({ nodeConfigId:-1, nodeConfigIndex:-1, nodeConfigName:this.$T("smbl.common.view.all").$D("全部") });
          res.forEach((item) => {
            this.nodesInfos.push(item);
          });
        }
      }).finally(() => {
      });
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
    //扫码收货
    scanCodeForReceive() {
      let that = this;
      SrmAppCore.scanQrCode(function (result) {
        console.log(result, "result");
        if (result) {
          that.scanFlag = true;
          that.waitingDataSet.addQueryParameter("allSource", result);
          that.waitingDataSet.addQueryParameter("size", "100000");
          that.waitingDataSet.refresh();
          if (that.over$validateHange && typeof that.over$validateHange === "function") {
            const response = that.over$validateHange();
            if (response) {
              that.waitingDataSet.query().then(() => {
                const lineDatas = that.waitingDataSet?.toData() || [];
                if (isEmpty(lineDatas)) {
                  validateAsnNum(result).then((rlt) => {
                    if (rlt?.failed) {
                      that.$notification.open({
                        message: rlt.message,
                        key,
                        class: "notification",
                      });
                    }
                    that.queryDoubleUomConfig();
                  });
                }
              });
            }
            // that.waitingDataSet.addQueryParameter("allSource", null);
            // that.waitingDataSet.addQueryParameter("size", that.waitingDataSet.pageSize);
            // return response;
          }
          that.waitingDataSet.addQueryParameter("allSource", null);
          that.waitingDataSet.addQueryParameter("size", that.waitingDataSet.pageSize);
        }
      }, function (error) {
        console.info(that.$T("hipspfm.invoiceInspection.view.message.scanAbnormal").$D("扫码异常"), error);
        that.$notification.open({
          message: that.$T("hipspfm.invoiceInspection.view.message.scanAbnormal").$D("扫码异常") + (error ? JSON.stringify(error) : ""),
          key,
          class: "notification",
        });
      });
    }
  }
};
</script>

<style lang="stylus" scoped>

.receive-workplace-list-dropdown {
  height: 300px;
  overflow scroll;
}

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
