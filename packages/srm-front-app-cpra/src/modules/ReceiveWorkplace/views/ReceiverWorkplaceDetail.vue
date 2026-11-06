<template>
  <div class="create-receive-detail-container">
    <div class="create-receive-detail-scroll-el">
      <srm-detail-head ref="headInfoHeight" :columns="getHeaderColumns()" :data-source="headDataSet.data[0]?headDataSet.data[0]:{}">
        <div>
          <!-- 等dataSet加载完再判断 -->
          <srm-button-group v-if="headDataSet.data.length"
                            customize-code="SMBL.RECEIVE_WORKPLACE.DETAIL_TOP_BUTTON"
                            :buttons="getTopBtn"
                            class="override-btn-group"/>
        </div>
      </srm-detail-head>
      <srm-scroll-tab >
        <srm-scroll-tab-item :label="$T('sinv.receiptWorkbench.view.title.detail.receipHeaderInfo').$D('收货单基础信息')">
          <div @click="onBasicItemClick()">
            <srm-form style="padding:0 15px 10px 15px;min-height: 264px;margin-bottom: 0px;" :data-set="headDataSet" :columns="getBasicColumns()" customize-code="SMBL.RECEIVE_WORKPLACE.DETAIL_HEAD"/>
          </div>
        </srm-scroll-tab-item>
        <srm-scroll-tab-item :label="$T('sinv.receiptWorkbench.view.title.detail.receipLineInfo').$D('收货单明细行信息')" :show-title="false">
          <srm-flex style="background:#f0f2f5;height: 54px " justify="between">
            <div style="margin-left: 15px ;font-family: PingFangSC-Semibold;font-size: 16px;color: #333333;font-weight: 600;">{{ $T('sinv.receiptWorkbench.view.title.detail.receipLineInfo').$D('收货单明细行信息') }}</div>
            <srm-button v-if="(headDataSet.data[0] && headDataSet.data[0]['rcvStatusCode'] !=='40_FINISHED') && ( headDataSet.data[0] && headDataSet.data[0]['rcvStatusCode'] !=='20_SUBMITTED')" plain rect type="primary" style="margin-right: 15px" @click="lineEdit()">{{ lineEditButton }}</srm-button>
          </srm-flex>
          <srm-list :customize-code="getLineCustomizeCode" :show-bottom-bar="false" :auto-hide-bottom="true" :scrollable="false" :data-set="lineDataSet"
                    :columns="getLineColumns()" @itemClick="onLineItemClick()"/>
          <div style="background-color: #f0f2f5;height: 100px;width: 100%"/>
        </srm-scroll-tab-item>
      </srm-scroll-tab>
    </div>
    <srm-list-bottom-bar :data-set="lineDataSet" :buttons="getLineButs()" customize-code="SMBL.RECEIVE_WORKPLACE.DETAIL_LINE_BOTTOM_BUTTON"/>
    <srm-bottom-handler v-if="showBottom" :btn-arr="getBtnArr()" type="tooltip">
      <div v-if="headDataSet.data[0] && headDataSet.data[0]['rcvStatusCode'] !=='40_FINISHED'" slot="left" style="height: 48px;width: 48px;display: flex;justify-content: center;align-items: center;margin-right: 10px" @click="deleteCurrent()">
        <em class="srm-icon icon-trash" style="font-size: 24px;color: #cbcbcb"/>
      </div>
    </srm-bottom-handler>
    <!--    使用动态返回弹窗，会导致内部样式渲染延迟，此处直接构造节点，在页面加载的时候渲染节点，控制其显示或者隐藏 -->
    <srm-popup :visible="scorePopupFlag" width="100%" :title="$T('smbl.common.data.estimate').$D('单据评价')" :show-header="true" :show-back="true" :show-close="true" position="right" :before-close="scorePopupCloseBefore">
      <srm-form customize-type="detail" :columns="getScoreColumns()" :data-set="scoreDataSet" :buttons="getScoreButs()" :customize-code="scoreMobileCustomizeCode"/>
    </srm-popup>

    <!--    单据切换 -->
    <srm-popup class="create-receive-detail-receive-check" :rounded="true" :visible="checkReceivePopupFlag" height="520px" :title="$T('sinv.receiptWorkbench.button.check.number').$D('切换单号')" :show-header="true" :show-close="true" position="bottom" :on-close="()=>checkReceivePopupFlag=false">
      <div v-for="item in checkReceiveList" :key="item.nodeConfigId">
        <div class="create-receive-detail-receive-check-title">{{ item.nodeConfigName }}</div>
        <div v-for="receiveData in item.children" :key="receiveData.rcvTrxHeaderId" class="create-receive-detail-receive-check-list" @click="checkReceiveNum(receiveData)">
          <customize :data-source="receiveData" :columns="getBatchReceiveColumns()"/>
        </div>
      </div>
    </srm-popup>
    <!--    单据批量处理 -->
    <srm-popup class="create-receive-detail-receive-check" :rounded="true" :visible="batchHandlePopupFlag" height="520px" :title="$T('sinv.receiptWorkbench.button.check.number').$D('切换单号')" :show-header="true" :show-close="true" position="bottom" :on-close="()=>batchHandlePopupFlag=false">
      <div style="height: 380px;overflow: scroll">
        <div v-for="item in checkReceiveList" :key="item.nodeConfigId">
          <div class="create-receive-detail-receive-check-title">{{ item.nodeConfigName }}</div>
          <div v-for="receiveData in item.children" :key="receiveData.rcvTrxHeaderId" class="create-receive-detail-receive-check-list">
            <srm-checkbox v-model="receiveData.checkFlag" @input="singleCheck"><customize style="padding-left:8px" :data-source="receiveData" :columns="getBatchReceiveColumns()"/></srm-checkbox>
          </div>
        </div>
      </div>
      <div style="background:#FFFFFF;height: 60px;width: 100%;position: absolute;bottom: 34px;display: flex;justify-content: space-between;align-items: center">
        <srm-checkbox v-model="batchCheckAllFlag" style="width: auto;margin-left: 15px" @input="batchCheck"><span style="padding-left: 8px">{{ $T("smbl.common.message.selectAll").$D("全选") }}</span></srm-checkbox>
        <srm-button :disabled="batchButtonDisable" style="margin-right: 15px" size="large" :type="batchAction === 'S'?'primary':'danger'" fill @click="batchActionButton">{{ batchAction === 'S'?$T("hzero.common.button.submit").$D("提交") :$T("smbl.common.button.delete").$D("删除") }}</srm-button>
      </div>
    </srm-popup>
    <!--    操作记录 -->
    <history-record
      v-model="operationPopupFlag"
      :title="$T('smbl.common.message.OperationRecord').$D('操作记录')"
      operator-field-name="processUserName"
      operation-meaning-field-name="process"
      process-date-field-name="processDate"
      process-remark-field-name="processRemark"
      :action-data="operationRecord"
      :loading="operationPopupLoadingFlag"
      :remark-label="$T('smbl.common.view.operation.show').$D('操作说明')"/>
    <!--    审批记录 -->
    <history-record
      v-model="approvePopupFlag"
      :title="$T('smbl.common.button.taskDetail.record').$D('审批记录')"
      operator-field-name="assigneeName"
      operation-meaning-field-name="action"
      process-date-field-name="startTime"
      process-remark-field-name="comment"
      :loading="approvePopupLoadingFlag"
      :action-data="approveRecord"/>
  </div>
</template>
<script>
import { $T, DataSet, SrmUtil, SrmMath } from "srm-mobile-ui";
import { receiveHeaderDs } from "../datasource/receiveHeaderDS";
import { receiveLineDs } from "../datasource/receiveLineDS";
import { scoreDs } from "../datasource/scoreDS";
import { deleteReceive, saveReceive, deleteReceiveLine, submitReceive, getOperationRecord, getApproveRecord, checkReceiveListGet, batchDeleteReceive, batchSubmitReceive, savScore } from "../api";
import Vue from "vue";
import { Exception } from "@/utils/index.js";
import HistoryRecord from "@/components/HistoryRecord";
import Mixin from "../mixins/DetailColumns";
import CustomSpecsColumns from "../mixins/CustomSpecsColumns";
import { debounce, isNil } from "lodash";
import BigNumber from "bignumber.js";
import ReceiverWorkplaceDetailMethod from "../../CUX_PART/Method/ReceiverWorkplaceDetailMethod";

export default {
  name: "ReceiverWorkplaceDetail",
  modules: [ "smbl.workFlow", "sinv.receiptWorkbench", "hzero.common", "smbl.common", "sinv.receiptExecution", "sinv.receipWorkbench", "hipspfm.common", "hwfp.common" ],
  components:{ HistoryRecord },
  extends: ReceiverWorkplaceDetailMethod,
  mixins: [ Mixin, CustomSpecsColumns ],
  data() {
    return {
      autoReceiveLocationAddress: null,
      isDoubleUnit:0,
      rcvTrxHeaderId: null,
      currentTab :null,
      lineDataSet: new DataSet(receiveLineDs(this, this.isDoubleUnit)),
      headDataSet:new DataSet(receiveHeaderDs(this)),
      scoreDataSet: new DataSet(scoreDs(this)),
      processInstance:{},
      defineData:{ trxDate:null, invOrganizationId:null, invOrganizationSameFlag:true, invOrganizationCode:null, inventoryId:null, inventorySameFlag:true, inventoryCode:null, inventoryName:null, locatorId:null, locationName:null },
      lineEditFlag:false,
      lineEditButton: this.$T("smbl.common.view.button.edit").$D("编辑"),
      showBottom:true,
      scorePopupFlag:false,
      rcvTrxScore:null,
      // attachmentMappingResult:null,
      operationRecord:[],
      operationPopupFlag:false,
      operationPopupLoadingFlag:false,
      operationColorMap: {
        // "60_WFL_SUBMIT": "success",
        "30_REJECTED": "danger",
        "10_NEW": "primary",
      },
      approvePopupFlag:false,
      approvePopupLoadingFlag:false,
      approveRecord:[],
      actionMeaningMap: {},
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
      //收货/退回，0代表收货类型，1代表退回类型
      customizeUnitCodes: {
        0: {
          header: "SINV.RECEIPT_WORKBENCH_THING.DETAIL.",
          line: "SINV.RECEIPT_WORKBENCH_THING.DETAIL.LINE_",
          score: "SINV.RECEIPT_WORKBENCH_THING.DETAIL.RATE_"
        },
        1: {
          header: "SINV.RECEIPT_WORKBENCH_THING.RETURN_DETAIL.",
          line: "SINV.RECEIPT_WORKBENCH_THING.RETURN_DETAIL.LINE_",
        }
      },
      returnFlag:null,
      nodeConfigIndexAbc:"",
      cacheKey:"",
      checkReceivePopupFlag:false,
      checkReceiveList:[],
      batchHandlePopupFlag:false,
      batchCount:0,
      batchCheckAllFlag:false,
      batchAction:"",
      scoreMobileCustomizeCode:"SMBL.RECEIVE_WORKPLACE.SCORE.DETAIL"
    };
  },
  computed:{
    getTenantNum() {
      return SrmUtil.getTenantNum();
    },
    batchButtonDisable() {
      let flag = true;
      if (this.checkReceiveList) {
        this.checkReceiveList.forEach((o) => {
          o.children.forEach((p) => {
            if (p["checkFlag"]) {
              flag = false;
            }
          });
        });
      }
      return flag;
    },
    getLineCustomizeCode() {
      if (this.returnFlag === 0) {
        return "SMBL.RECEIVE_WORKPLACE.DETAIL_LINE.RECEIVE";
      }
      if (this.returnFlag === 1) {
        return "SMBL.RECEIVE_WORKPLACE.DETAIL_LINE.REVERSE";
      }
      return null;
    },
    getLineDetailCustomizeCode() {
      if (this.returnFlag === 0) {
        return "SMBL.RECEIVE_WORKPLACE.DETAIL_LINE.RECEIVE.DETAIL";
      }
      if (this.returnFlag === 1) {
        return "SMBL.RECEIVE_WORKPLACE.DETAIL_LINE.REVERSE.DETAIL";
      }
      return null;
    },
    getTopBtn() {
      const cacheKey = !this.cacheKey;
      const estimate = !(this.headDataSet.data[0] && this.headDataSet.data[0]["returnedFlag"] === 0);
      return [
        {
          name: "viewAttachment",
          type: "primary",
          size: "small",
          fill: true,
          visible: true,
          rightSlot:<srm-upload
            desc-title={this.$T("smbl.common.button.viewAttachment").$D("查看附件")}
            style="margin-right: 0"
            show-count={false}
            show-icon={true}
            is-tab={true}
            file-arr={this.headDataSet.data[0] ? this.headDataSet.data[0].mobileHeaderAttachmentUuids : []}/>,
        },
        {
          name: "estimate",
          text: this.$T("smbl.common.data.estimate").$D("单据评价"),
          type: "warn",
          size: "small",
          bordered: true,
          visible: !estimate,
          icon: "icon-brand-messenger",
          callback: () => {
            this.scorePopupOpen();
          }
        },
        {
          name: "checkNum",
          text: this.$T("sinv.receiptWorkbench.button.check.number").$D("切换单号"),
          type: "primary",
          size: "small",
          bordered: true,
          visible: !cacheKey,
          icon: "icon-a-b",
          callback: () => {
            this.openCheckReceive();
          }
        },
        {
          name: "operating",
          text: this.$T("sinv.receipWorkbench.model.receipt.operating").$D("操作记录"),
          type: "primary",
          size: "small",
          bordered: true,
          visible: true,
          icon: "icon-clock",
          callback: () => {
            this.onOperationPopup();
          }
        },
        {
          name: "approved",
          text: this.$T("sinv.receiptExecution.model.receipt.approved").$D("审批记录"),
          type: "primary",
          size: "small",
          bordered: true,
          visible: true,
          icon: "icon-clock",
          callback: () => {
            this.onApprovePopup();
          }
        },
      ];
    }
  },
  async beforeMount() {
    const { rcvTrxHeaderId, returnFlag, nodeConfigIndexAbc, cacheKey, isDoubleUnit = 0 } = this.$route.query;
    this.rcvTrxHeaderId = rcvTrxHeaderId;
    this.returnFlag = returnFlag ? Number(returnFlag) : returnFlag;
    this.nodeConfigIndexAbc = nodeConfigIndexAbc;
    this.isDoubleUnit = Number(isDoubleUnit);
    this.cacheKey = cacheKey;
    await SrmUtil.getValueSetBatch({ actionMeaningMap: "HWFP.APPROVAL.ACTION" }, this);
    this.init();
  },
  mounted() {
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
                // setTimeout(() => {
                //   this.$set(record, "secondaryQuantity", secNum);
                //   this.$set(record, "quantity", num);
                // }, 200);
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
              // setTimeout(() => {
              //   this.$set(record, "secondaryQuantity", secNum);
              //   this.$set(record, "quantity", num);
              // }, 200);
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
      // setTimeout(() => this.$set(record, [ changeField ], num), 200);
    },
    // 行数量变更
    lineNameChange: debounce(async function (val, item, changeField, precision) {
      setTimeout(async function () {
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
        // 换算
        // eslint-disable-next-line no-invalid-this
        if (changeField === "taxIncludedAmount" && this.isDoubleUnit) {
          await this.conversionUpdate({ value:val, record: item, isDoubleUnit: this.isDoubleUnit, changeField });
        }

      // eslint-disable-next-line no-invalid-this
      }.bind(this), 0);
    }, 500),
    scorePopupOpen() {
      this.scorePopupFlag = true;
      // this.scoreDataSet.refresh();
    },
    scorePopupCloseBefore() {
      if (this.scoreDataSet.dirty) {
        this.$dialog({
          content: this.$T("smbl.common.view.message.nowDataNotSave").$D("当前数据未保存，继续此操作将造成数据丢失，是否继续？"),
          onOk: () => {
            this.scoreDataSet.refresh();
            this.scorePopupFlag = !this.scorePopupFlag;
          },
          onCancel: () => {
            console.log("onCancel");
          }
        });
      } else {
        this.scorePopupFlag = false;
        return true;
      }
      return false;
    },
    //单个勾选
    singleCheck() {
      let flag = true;
      if (this.checkReceiveList) {
        this.checkReceiveList.forEach((o) => {
          o.children.forEach((p) => {
            if (!p["checkFlag"]) {
              flag = false;
            }
          });
        });
        this.batchCheckAllFlag = flag;
      }
    },
    //批量勾选全选触发
    batchCheck() {
      if (this.checkReceiveList) {
        this.checkReceiveList.forEach((o) => {
          o.children.forEach((p) => {
            p["checkFlag"] = this.batchCheckAllFlag;
          });
        });
      }
    },
    //打开单据选择弹窗
    openCheckReceive() {
      this.checkReceivePopupFlag = true;
    },
    //选择单据
    checkReceiveNum(item) {
      this.rcvTrxHeaderId = item.rcvTrxHeaderId;
      this.nodeConfigIndexAbc = item.nodeConfigIndexAbc;
      this.checkReceivePopupFlag = !this.checkReceivePopupFlag;
      this.refresh();
    },
    //init
    init() {
      if (this.cacheKey) {
        this.$loading.show();
        checkReceiveListGet(this.cacheKey).then((item) => {
          this.checkReceiveList = [];
          this.batchCount = 0;
          item.forEach((o) => {
            o.children.forEach((p) => {
              p["checkFlag"] = false;
            });
            this.checkReceiveList.push(o);
            this.batchCount = this.batchCount + o.children.length;
          });
          this.rcvTrxHeaderId = item[0].children[0].rcvTrxHeaderId;
          this.nodeConfigIndexAbc = item[0].children[0].nodeConfigIndexAbc;
          this.refresh();
        }).catch((e) => {
          console.info(e);
        }).finally(() => {
          this.$loading.hide();
        });
      } else {
        this.refresh();
      }
    },
    refresh() {
      this.headDataSet.addPathParameter("rcvTrxHeaderId", this.rcvTrxHeaderId);
      this.headDataSet.addQueryParameter("customizeUnitCode", this.customizeUnitCodes[this.returnFlag].header + this.nodeConfigIndexAbc);
      this.headDataSet.refresh();
      //行数据对头数据有依赖，行数据放到headDataSet查询后回调事件执行
      // this.lineDataSet.addPathParameter("rcvTrxHeaderId",this.rcvTrxHeaderId);
      // this.lineDataSet.refresh();
      this.scoreDataSet.addQueryParameter("customizeUnitCode", this.customizeUnitCodes[this.returnFlag].score ? this.customizeUnitCodes[this.returnFlag].score + this.nodeConfigIndexAbc : "");
      this.scoreDataSet.addPathParameter("rcvTrxHeaderId", this.rcvTrxHeaderId);
      this.scoreDataSet.refresh();
    },
    getBtnArr() {
      if (this.headDataSet.current && this.headDataSet.current.data["rcvStatusCode"] !== "40_FINISHED") {
        return [ {
          title: this.$T("hzero.common.save").$D("保存"),
          type: "primary",
          bordered: true,
          disabled: this.headDataSet.current.data["rcvStatusCode"] === "20_SUBMITTED",
          handler: () => {
            this.savaCurrent();
          }
        }, {
          title: this.$T("hzero.common.button.submit").$D("提交"),
          type: "primary",
          fill: true,
          disabled: this.headDataSet.current.data["rcvStatusCode"] === "20_SUBMITTED",
          handler: () => {
            if (this.batchCount > 1) {
              this.batchHandlePopupFlag = true;
              this.batchAction = "S";
            } else {
              this.submitReceive();
            }
          }
        } ];
      }
      return [ {
        title: this.$T("hzero.common.save").$D("保存"),
        type: "primary",
        fill: true,
        handler: () => {
          this.savaCurrent();
        }
      } ];
    },
    getLineButs() {
      // 标准二开埋点
      if (this.over$getLineButs && typeof this.over$getLineButs === "function") {
        const response = this.over$getLineButs();
        return response;
      }
      if (this.headDataSet.current && this.headDataSet.current.data["returnedFlag"] === 0) {
        return [
          {
            name:"delete",
            text: this.$T("smbl.common.button.delete").$D("删除"),
            type: "danger",
            bordered: true,
            visible:true,
            size:"small",
            disabled:!(this.lineDataSet.selected && this.lineDataSet.selected.length > 0),
            callback: () => {
              const sinvRcvTrxLineDTOS = this.lineDataSet.selected.map((item) => item.data);
              this.deleteLine(sinvRcvTrxLineDTOS);
            }
          },
          {
            name:"batchEdit",
            text: this.$T("smbl.common.view.button.batch.editMany").$D("批量编辑"),
            type: "primary",
            fill: true,
            visible:true,
            callback: () => {
              this.onLineOpenClick();
            }
          }
        ];
      }
      return [ {
        name:"delete",
        text: this.$T("smbl.common.button.delete").$D("删除"),
        type: "danger",
        bordered: true,
        visible:true,
        size:"small",
        disabled:!(this.lineDataSet.selected && this.lineDataSet.selected.length > 0),
        callback: () => {
          const sinvRcvTrxLineDTOS = this.lineDataSet.selected.map((item) => item.data);
          this.deleteLine(sinvRcvTrxLineDTOS);
        }
      } ];

    },
    getLineDetailButs() {
      if (this.headDataSet.current && this.headDataSet.current.data["rcvStatusCode"] !== "40_FINISHED") {
        return [ {
          text: this.$T("smbl.common.button.delete").$D("删除"),
          type: "danger",
          bordered: true,
          handler: () => {
            const sinvRcvTrxLineDTOS = [];
            sinvRcvTrxLineDTOS.push(this.lineDataSet.current.data);
            this.deleteLine(sinvRcvTrxLineDTOS);
          }
        }, {
          text: this.$T("hzero.common.button.ok").$D("确定"),
          type: "primary",
          fill: true,
          handler: () => {
            this.detailPopup.closePopup();
          }
        } ];
      }
    },
    getScoreButs() {
      const buttons = [ {
        title: this.$T("hzero.common.save").$D("保存"),
        type: "primary",
        fill: true,
        handler: () => {
          this.saveScore();
        }
      } ];
      return buttons;
    },
    //打开操作记录
    onOperationPopup() {
      this.operationPopupFlag = true;
      this.operationPopupLoadingFlag = true;
      getOperationRecord(this.rcvTrxHeaderId).then((res) => {
        if (res.length > 0) {
          this.operationRecord = [];
          res.forEach((item) => {
            item.process = { text:item.processStatusMeaning, type:this.operationColorMap[item.processStatus] || "success" };
            this.operationRecord.push(item);
          });
        }
        this.operationPopupLoadingFlag = false;
      });
    },
    //打开审批记录
    onApprovePopup() {
      this.approvePopupFlag = true;
      this.approvePopupLoadingFlag = true;
      getApproveRecord(this.rcvTrxHeaderId).then((res) => {
        if (Array.isArray(res) && res.length > 0) {
          this.approveRecord = [];
          res[0].historicTaskExtList.forEach((item) => {
            const { name, action, actType } = item;
            let nodeName = name;
            if (actType === "startEvent") {
              nodeName = this.$T("hwfp.common.status.start").$D("开始");
            } else if (actType === "endEvent") {
              nodeName = this.$T("hwfp.common.status.end").$D("结束");
            } else if (!action && !name) {
              nodeName = this.$T("hwfp.common.view.message.approvaling").$D("审批中");
            } else {
              let text = this.actionMeaningMap[item.action] || this.$T("hwfp.common.view.message.approvaling").$D("审批中");
              let type = this.actionColorMap[item.action] || "info";
              item.action = { type, text };
            }
            item.nodeName = nodeName;
            this.approveRecord.push(item);
          });
        }
        this.approvePopupLoadingFlag = false;
      });
    },
    // //附件组件初始化回调
    // attachmentInitCall(mappingResult) {
    //   this.attachmentMappingResult = mappingResult;
    // },
    // //附件关闭回调
    // attachmentOnClose(result, mappingResult) {
    //   this.attachmentMappingResult = mappingResult;
    // },
    //分数保存
    saveScore() {
      if (!this.scoreDataSet.validate()) {
        return;
      }
      this.$loading.show();
      savScore(this.rcvTrxHeaderId, this.scoreDataSet.current.data).then((res) => {
        if (res && res._token) {
          this.scoreDataSet.refresh();
          this.scorePopupFlag = !this.scorePopupFlag;
        }
      }).catch((e) => {
        console.info(e);
      }).finally(() => {
        this.$loading.hide();
      });
    },
    //沟通提交和保存数据
    async buildData() {
      const validHeadFlag = this.headDataSet.validate();
      if (!validHeadFlag) {
        return;
      }
      //校验评价
      if (this.headDataSet.data.length && this.headDataSet.data[0]["returnedFlag"] === 0 && !this.scoreDataSet.validate()) {
        // eslint-disable-next-line new-cap
        Exception(this, this.$T("smbl.common.messge.wait.write").$D("{}存在待填项"), [ this.$T("smbl.common.data.estimate").$D("单据评价") ]);
      }
      //校验附件
      // this.attachmentMappingResult.forEach((item) => {
      //   //新建的才需要校验
      //   if (item.required && (!item.result || item.result.length === 0) && this.currentTab === 0) {
      //     // eslint-disable-next-line new-cap
      //     Exception(this, this.$T("smbl.common.validation.notNull").$D("{name}不能为空"), [ item.title ]);
      //   }
      // });
      //如果头上面的金额字段进行了隐藏，保存的时候，需要还原为对应字段;使用过度字段totalTaxIncludedAmount，不直接修改headDataSet对应的字段值，防止界面瞬间出现未隐藏金额
      let totalTaxIncludedAmount = Array.isArray(this.headDataSet.data) && this.headDataSet.data.length && this.headDataSet.data[0]["totalTaxIncludedAmount"];
      if (totalTaxIncludedAmount === "***") {
        totalTaxIncludedAmount = this.headDataSet.data.length && this.headDataSet.data[0]["totalTaxIncludedAmountTemp"];
      }
      // 部门
      let unitIds = this.headDataSet.data.length && this.headDataSet.data[0]["unitIds"];
      let unitAll = [];
      if (unitIds) {
        let unitIdArray = unitIds.split(",");
        for (let i = 0; i < unitIdArray.length; i++) {
          unitAll.push({ unitId:unitIdArray[i] });
        }
      }

      const tempArr = Array.isArray(this.lineDataSet.data) && this.lineDataSet.data.length ? this.lineDataSet.data.map((i) => ({ ...i, taxIncludedAmount:Number(i.taxIncludedAmount) })) : [];
      const body = { ...this.headDataSet.data[0], cacheKey: this.cacheKey, totalTaxIncludedAmount:Number(totalTaxIncludedAmount), sinvRcvTrxLineDTOS:tempArr, unitAll:unitAll, receiveLocationAddress:this.autoReceiveLocationAddress || this.headDataSet?.data?.[0]?.["receiveLocationAddress"], };
      return body;
    },
    //提交
    async submitReceive() {
      const body = await this.buildData();
      if (!body) {
        return;
      }
      const returnedFlag0 = this.customizeUnitCodes[this.returnFlag].header + this.nodeConfigIndexAbc +
      "," + this.customizeUnitCodes[this.returnFlag].line + this.nodeConfigIndexAbc +
        "," + this.customizeUnitCodes[this.returnFlag].score + this.nodeConfigIndexAbc;

      const returnedFlag1 = this.customizeUnitCodes[this.returnFlag].header + this.nodeConfigIndexAbc +
      "," + this.customizeUnitCodes[this.returnFlag].line + this.nodeConfigIndexAbc;
      const customizeUnitCode = this.returnFlag === 0 ? returnedFlag0 : returnedFlag1;
      this.$loading.show();
      submitReceive(body, customizeUnitCode).then((res) => {
        if (res && !res.failed) {
          this.$router.back();
        }
      }).finally(() => {
        this.$loading.hide();
      });
    },
    //保存当前单据
    async savaCurrent() {
      const body = await this.buildData();
      if (!body) {
        return;
      }
      const customizeUnitCode = this.customizeUnitCodes[this.returnFlag].header + this.nodeConfigIndexAbc +
      "," + this.customizeUnitCodes[this.returnFlag].line + this.nodeConfigIndexAbc +
      "," + this.customizeUnitCodes[this.returnFlag].score ? this.customizeUnitCodes[this.returnFlag].score + this.nodeConfigIndexAbc : "";
      this.$loading.show();
      saveReceive(body, customizeUnitCode).then((res) => {
        if (res && !res.failed) {
          console.info(res);
          this.init();
        }
      }).finally(() => {
        this.$loading.hide();
      });
    },
    //批量删除
    batchActionButton() {
      const list = [];
      this.checkReceiveList.forEach((item) => {
        item.children.forEach((o) => {
          if (o["checkFlag"]) {
            list.push({ rcvTrxHeaderId:o.rcvTrxHeaderId });
          }
        });
      });
      this.batchHandlePopupFlag = false;
      if (this.batchAction === "D") {
        console.log(this.batchCount, "此处批量删除判断batchCount");
        console.log(list.length, "此处批量删除list长度");
        this.$loading.show();
        batchDeleteReceive(this.cacheKey, list).then((res) => {
          if (res && !res.failed) {
            if (this.batchCount === list.length) {
              this.$router.back();
            } else {
              this.init();
            }
          }
        }).catch((e) => {
          console.info(e);
        }).finally(() => {
          this.$loading.hide();
        });
      } else {
        console.log(this.batchCount, "this.batchCount333");
        this.$loading.show();
        batchSubmitReceive(this.cacheKey, list).then((res) => {
          if (res && !res.failed) {
            if (this.batchCount === list.length) {
              this.$router.back();
            } else {
              this.init();
            }
          }
        }).catch((e) => {
          console.info(e);
        }).finally(() => {
          this.$loading.hide();
        });
      }
    },
    //删除当前单据
    deleteCurrent() {
      //如果头上面的金额字段进行了隐藏，删除的时候，需要还原为对应字段
      if (this.headDataSet.data.length && this.headDataSet.data[0]["totalTaxIncludedAmount"] === "***") {
        this.headDataSet.data[0]["totalTaxIncludedAmount"] = this.headDataSet.data[0]["totalTaxIncludedAmountTemp"];
      }
      //提提交的的数据，禁止删除、保存、提交
      if (this.headDataSet.data[0] && this.headDataSet.data[0]["rcvStatusCode"] === "20_SUBMITTED") {
        return;
      }
      if (this.batchCount > 1) {
        this.batchHandlePopupFlag = true;
        this.batchAction = "D";
        console.log(this.batchCount, "此处删除当前单据判断batchCount");
      } else {
        this.$loading.show();
        deleteReceive(this.headDataSet.data[0]).then((res) => {
          if (res) {
            console.log(res, "此处删除当前单据的返回值");
            // this.$router.back();
            this.$router.replace({
              name:"ReceiverWorkplaceList",
            });
          }
        }).finally(() => {
          this.$loading.hide();
        });
      }
    },
    //头字段
    getHeaderColumns() {
      return [ {
        fieldCode: "displayTrxNum",
      }, {
        fieldCode: "creationName",
        render:(val) => <span>{$T("sinv.receipWorkbench.model.receipt.creationName").$D("创建人") + ": " + val}</span>
      } ];
    },
    //打开待收货详情弹窗
    onBasicItemClick() {
      this.detailPopup = this.$popup({
        title: $T("sinv.receiptWorkbench.view.title.detail.receipHeaderInfo").$D("收货单基础信息"),
        showHeader: true,
        showClose: true,
        position: "bottom",
        showBack: false,
        height: "100%",
        rounded: false,
        content: <SrmForm
          style={{ padding: "0 15px" }}
          customizeType="detail"
          customizeCode="SMBL.RECEIVE_WORKPLACE.DETAIL_HEAD.DETAIL"
          dataSet={this.headDataSet}
          buttons={ this.headDataSet.current.data["rcvStatusCode"] !== "40_FINISHED" ? [ { title: this.$T("hzero.common.button.ok").$D("确定"), fill:true, type: "primary", bordered: true, handler: () => {
            this.detailPopup.closePopup();
          } } ] : []}
          columns={this.getBasicDetailColumns()}
        />,
      });
    },
    //行勾选编辑
    lineEdit() {
      this.lineEditFlag = !this.lineEditFlag;
      this.lineEditButton = this.lineEditFlag ? this.$T("smbl.common.view.button.cancel").$D("取消") : this.$T("smbl.common.view.button.edit").$D("编辑");
      this.lineDataSet.editFlag = this.lineEditFlag;
      this.showBottom = !this.lineEditFlag;
    },
    //打开待收货详情弹窗
    onLineItemClick() {
      this.detailPopup = this.$popup({
        title: this.$T("sinv.receiptWorkbench.view.title.detail.receipLineInfo").$D("收货单明细行信息"),
        showHeader: true,
        showClose: true,
        position: "bottom",
        showBack: false,
        height: "100%",
        rounded: false,
        content: <SrmForm
          style={{ padding: "0 15px" }}
          customizeType="detail"
          customizeCode={this.getLineDetailCustomizeCode}
          dataSet={this.lineDataSet}
          buttons={this.getLineDetailButs()}
          columns={this.getLineDetailColumns()}
          onDelete={() => this.detailPopup.closePopup()}
          onUpdate={() => this.detailPopup.closePopup()}
          onSubmit={() => this.detailPopup.closePopup()}
        />,
      });
    },
    //打开批量维护弹窗
    onLineOpenClick() {
      this.defineData.invOrganizationSameFlag = true;
      this.defineData.inventorySameFlag = true;
      const itemList = [];
      if (this.lineDataSet.selected.length > 0) {
        this.lineDataSet.selected.forEach((record) => {
          itemList.push(record.data);
        });
      } else {
        this.lineDataSet.data.forEach((item) => {
          itemList.push(item);
        });
      }
      itemList.forEach((item) => {
        //构造库存组织
        if (this.defineData.invOrganizationId && this.defineData.invOrganizationId !== item.invOrganizationId) {
          this.defineData.invOrganizationSameFlag = false;
          this.defineData.invOrganizationId = null;
        } else {
          this.defineData.invOrganizationId = item.invOrganizationId;
        }
        //构造库房
        if (this.defineData.inventoryCode && this.defineData.inventoryCode !== item.inventoryCode) {
          console.info(this.defineData.inventoryCode, item.inventoryCode, "aaa");
          this.defineData.inventorySameFlag = false;
          this.defineData.inventoryId = null;
          this.defineData.inventoryName = null;
          this.defineData.inventoryCode = null;
        } else {
          console.info(this.defineData.inventoryCode, item.inventoryCode, "sss");
          this.defineData.inventoryId = item.inventoryId;
          this.defineData.inventoryName = item.inventoryName;
          this.defineData.inventoryCode = item.inventoryCode;
        }
      });
      this.detailPopup = this.$popup({
        title: this.$T("sinv.receiptExecution.model.receipt.batchMaintenance").$D("批量维护"),
        showHeader: true,
        showClose: true,
        showBack:true,
        position: "right",
        content: <div class="create-receive-detail-define"><CustomizeDetail ref="testVal"
          needPadding={true}
          dataSource={this.defineData}
          columns={this.getReceiveLineDefineColumns(this)}
        />
        <div class="create-receive-detail-define-button">
          <srm-button onClick={this.lineDefineDataConfirm} fill size="x-large" full-width type="primary">{this.$T("hzero.common.button.ok").$D("确定")}</srm-button>
        </div>
        </div>,
      });
      setTimeout(() => {
        console.info(this.$refs?.testVal?.validate(), "dddddd");
      }, 400);
    },
    //批量数据维护,如果有勾选批量维护勾选的数据，不勾选进行批量维护，则默认维护到所有数据
    lineDefineDataConfirm() {
      if (this.lineDataSet.selected.length > 0) {
        this.lineDataSet.selected.forEach((item) => {
          if (this.defineData.trxDate) {
            item.data.trxDate = this.defineData.trxDate;
          }
          if (this.defineData.inventoryId) {
            item.data.inventoryId = this.defineData.inventoryId;
            item.data.inventoryName = this.defineData.inventoryName;
          }
          if (this.defineData.locatorId) {
            item.data.locatorId = this.defineData.locatorId;
            item.data.locationName = this.defineData.locationName;
          }
        });
      } else {
        this.lineDataSet.data.forEach((item) => {
          if (this.defineData.trxDate) {
            item.trxDate = this.defineData.trxDate;
          }
          if (this.defineData.inventoryId) {
            item.inventoryId = this.defineData.inventoryId;
            item.inventoryName = this.defineData.inventoryName;
          }
          if (this.defineData.locatorId) {
            item.locatorId = this.defineData.locatorId;
            item.locationName = this.defineData.locationName;
          }
        });
      }
      this.detailPopup.closePopup();
      this.lineEdit();
    },
    //删除行数据
    deleteLine(sinvRcvTrxLineDTOS) {
      console.info(sinvRcvTrxLineDTOS, "ffffffff");
      Vue.prototype.$dialog({
        title: Vue.prototype.$T("smbl.common.message.tip").$D("提示"),
        content: Vue.prototype.$T("smbl.common.message.confirmDelete", [ sinvRcvTrxLineDTOS.length ]).$D("是否确认删除{count}条数据？"),
        onOk: () => {
          let totalTaxIncludedAmount = this.headDataSet.data[0]["totalTaxIncludedAmount"];
          if (totalTaxIncludedAmount === "***") {
            totalTaxIncludedAmount = this.headDataSet.data[0]["totalTaxIncludedAmountTemp"];
          }
          const deleteData = { ...this.headDataSet.data[0], totalTaxIncludedAmount: totalTaxIncludedAmount, sinvRcvTrxLineDTOS:sinvRcvTrxLineDTOS };
          this.$loading.show();
          deleteReceiveLine(deleteData).then((res) => {
            if (res && !res.failed) {
              // 更新头上的objectVersionNumber, 方便提交/保存
              this.headDataSet.current.setField("objectVersionNumber", res.objectVersionNumber);
              this.lineDataSet.refresh();
            }
          }).finally(() => {});
          this.$loading.hide();
        },
        onCancel: () => {}
      });
    },
  }
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
