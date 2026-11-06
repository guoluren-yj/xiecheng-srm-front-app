<template>
  <div ref="receiptWorkbench" class="create-receive-detail-container">
    <div class="create-receive-detail-scroll-el">
      <srm-scroll-tab >
        <srm-scroll-tab-item :label="$T('sinv.receiptWorkbench.view.title.detail.receipHeaderInfo').$D('收货单基础信息')">
          <div @click="onBasicItemClick()">
            <srm-form style="padding:0 15px 10px 15px;min-height: 264px;margin-bottom: 0px;" :data-set="headDataSet" :columns="getBasicColumns()" customize-code="SMBL.WORKFLOW.RECEIVE_WORKPLACE.HEAD" />
          </div>
        </srm-scroll-tab-item>
        <srm-scroll-tab-item :label="$T('sinv.receiptWorkbench.view.title.detail.receipLineInfo').$D('收货单明细行信息')" :show-title="false">
          <srm-flex style="background:#f0f2f5;height: 54px " justify="between">
            <div style="margin-left: 15px ;font-family: PingFangSC-Semibold;font-size: 16px;color: #333333;font-weight: 600;">{{ $T('sinv.receiptWorkbench.view.title.detail.receipLineInfo').$D('收货单明细行信息') }}</div>
          </srm-flex>
          <srm-list :show-bottom-bar="false" :auto-hide-bottom="true" :scrollable="false" :data-set="lineDataSet" :customize-code="getLineCustomizeCode"
                    :columns="getLineColumns()" @itemClick="onLineItemClick()"/>
        </srm-scroll-tab-item>
        <!-- 附件 -->
        <srm-scroll-tab-item :label="$T('sinv.receiptWorkbench.view.title.detail.attrmentch').$D('附件')" :show-title="false">
          <srm-flex style="background:#f0f2f5;height: 54px " justify="between">
            <div style="margin-left: 15px ;font-family: PingFangSC-Semibold;font-size: 16px;color: #333333;font-weight: 600;">{{ $T('sinv.receiptWorkbench.view.title.detail.attrmentch').$D('附件') }}</div>
          </srm-flex>
          <srm-list :scrollable="false"
                    height="auto"
                    style="height: auto"
                    :data-set="headDataSet"
                    :columns="attachColumns()"/>
          <!-- <div style="background-color: #f0f2f5;height: 100px;width: 100%"/> -->
        </srm-scroll-tab-item>
        <!-- 操作记录 -->
        <srm-scroll-tab-item :label="$T('sinv.receipWorkbench.model.receipt.operating').$D('操作记录')">
          <div class="record-container">
            <history-record-tiled
              :action-data="operatingData"
              :remark-label="$T('slod.common.model.common.remark').$D('备注')"
              operation-meaning-field-name="processStatusMeaning"
              process-remark-field-name="processRemark"
              operator-field-name="processUserName"
              process-date-field-name="processDate"/>
          </div>
          <div class="bottom-button-space" />
        </srm-scroll-tab-item>
      </srm-scroll-tab>
    </div>
  </div>
</template>

<script>
import { $T, DataSet, SrmUtil, SrmMath } from "srm-mobile-ui";
import { debounce, isNil } from "lodash";
import BigNumber from "bignumber.js";
import HistoryRecordTiled from "@/components/HistoryRecordTiled";
import { receiveHeaderDs } from "./datasource/receiveHeaderDS";
import { receiveLineDs } from "./datasource/receiveLineDS";
import Mixin from "./mixin/DetailColumns";
import CustomSpecsColumns from "./mixin/CustomSpecsColumns";
import { getOperationRecord, queryDoubleUomConfig, saveReceive } from "./api";

export default {
  name: "ReceiverWorkDetailForm",
  components: { HistoryRecordTiled },
  mixins: [ Mixin, CustomSpecsColumns ],
  props: {
    parameters: {
      type: Object
    }
  },
  modules: [ "smbl.workFlow", "sinv.receiptWorkbench", "hzero.common", "smbl.common", "sinv.receiptExecution", "sinv.receipWorkbench", "hipspfm.common", "hwfp.common", "slod.common" ],
  data() {
    return {
      isDoubleUnit:0,
      rcvTrxHeaderId: "",
      currentTab :null,
      lineDataSet: new DataSet(receiveLineDs(this, this.isDoubleUnit)),
      headDataSet: new DataSet(receiveHeaderDs(this, this.isDoubleUnit)),
      processInstance:{},
      defineData:{ trxDate:null, invOrganizationId:null, invOrganizationSameFlag:true, invOrganizationCode:null, inventoryId:null, inventorySameFlag:true, inventoryCode:null, inventoryName:null, locatorId:null, locationName:null },
      lineEditFlag:false,
      lineEditButton: this.$T("smbl.common.view.button.edit").$D("编辑"),
      showBottom:true,
      scorePopupFlag:false,
      rcvTrxScore:null,
      operationRecord:[],
      operationPopupFlag:false,
      operationPopupLoadingFlag:false,
      operationColorMap: {
        "30_REJECTED": "danger",
        "10_NEW": "primary",
      },
      approvePopupFlag:false,
      approvePopupLoadingFlag:false,
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
      returnFlag: 0,
      nodeConfigIndexAbc:"",
      checkReceivePopupFlag:false,
      checkReceiveList:[],
      batchHandlePopupFlag:false,
      batchCount:0,
      batchCheckAllFlag:false,
      batchAction: "",
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
      // 操作记录
      operatingData: [],
      scoreMobileCustomizeCode:"SMBL.RECEIVE_WORKPLACE.SCORE.DETAIL"
    };
  },
  computed: {
    getLineCustomizeCode() {
      if (this.returnFlag === 0) {
        return "SMBL.WORKFLOW.RECEIVE_WORKPLACE.LINE_RECEIVE";
      }
      if (this.returnFlag === 1) {
        return "SMBL.WORKFLOW.RECEIVE_WORKPLACE.LINE_REVERSE";
      }
      return null;
    },
    getLineDetailCustomizeCode() {
      if (this.returnFlag === 0) {
        return "SMBL.WORKFLOW.RECEIVE_WORKPLACE.LINE_RECEIVE.DETAIL";
      }
      if (this.returnFlag === 1) {
        return "SMBL.WORKFLOW.RECEIVE_WORKPLACE.LINE_REVERSE.DETAIL";
      }
      return null;
    },
  },
  async beforeMount() {
    const { rcvTrxHeaderId = "", returnFlag = 0, nodeConfigIndexAbc = "" } = this.parameters;
    this.rcvTrxHeaderId = rcvTrxHeaderId;
    this.returnFlag = returnFlag ? Number(returnFlag) : returnFlag;
    this.nodeConfigIndexAbc = nodeConfigIndexAbc;
    this.queryDoubleUomConfig();
    await SrmUtil.getValueSetBatch({ actionMeaningMap: "HWFP.APPROVAL.ACTION" }, this);
  },
  async mounted() {
    // 操作记录
    getOperationRecord(this.rcvTrxHeaderId).then((res) => {
      if (res.length > 0) {
        this.operatingData = [];
        res.forEach((item) => {
          item.process = { text:item.processStatusMeaning, type:this.operationColorMap[item.processStatus] || "success" };
          this.operatingData.push(item);

        });
      }
    });
  },
  methods: {
    async queryDoubleUomConfig() {
      await queryDoubleUomConfig().then((res) => {
        this.isDoubleUnit = Number(res);
        this.refresh();
      });
    },
    refresh() {
      this.headDataSet.addPathParameter("rcvTrxHeaderId", this.rcvTrxHeaderId);
      this.headDataSet.addQueryParameter("customizeUnitCode", this.customizeUnitCodes[this.returnFlag].header + this.nodeConfigIndexAbc);
      this.headDataSet.refresh();
    },
    //沟通提交和保存数据
    async buildData() {
      const validHeadFlag = this.headDataSet.validate();
      if (!validHeadFlag) {
        return;
      }
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

      const tempArr = Array.isArray(this.lineDataSet.data) && this.lineDataSet.data.length && this.lineDataSet.data.map((i) => ({ ...i, taxIncludedAmount:Number(i.taxIncludedAmount) }));
      const body = { ...this.headDataSet.data[0], cacheKey: this.cacheKey, totalTaxIncludedAmount:Number(totalTaxIncludedAmount), sinvRcvTrxLineDTOS:tempArr, unitAll:unitAll, saveMethod: "WFL" };
      return body;
    },
    async beforeApprove() {
      // eslint-disable-next-line no-async-promise-executor
      return new Promise(async (resolve, reject) => {
        const body = await this.buildData();
        if (!body) {
          return;
        }
        const customizeUnitCode = this.customizeUnitCodes[this.returnFlag].header + this.nodeConfigIndexAbc +
      "," + this.customizeUnitCodes[this.returnFlag].line + this.nodeConfigIndexAbc +
      "," + this.customizeUnitCodes[this.returnFlag].score ? this.customizeUnitCodes[this.returnFlag].score + this.nodeConfigIndexAbc : "";
        this.$loading.show();
        const res = await saveReceive(body, customizeUnitCode);
        if (res && !res.failed) {
          resolve();
        } else {
          reject();
        }
        this.$loading.hide();
      });
    },
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
        if (changeField === "secondaryQuantity") {
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
        if (changeField === "taxIncludedAmount") {
          await this.conversionUpdate({ value:val, record: item, isDoubleUnit: this.isDoubleUnit, changeField });
        }

      // eslint-disable-next-line no-invalid-this
      }.bind(this), 0);
    }, 500),
    //打开待收货详情弹窗
    onBasicItemClick() {
      this.detailPopup = this.$popup({
        position: "right",
        content: <SrmForm
          style={{ padding: "0 15px" }}
          customizeType="detail"
          customizeCode="SMBL.WORKFLOW.RECEIVE_WORKPLACE.HEAD_DETAIL"
          dataSet={this.headDataSet}
          buttons={ this.headDataSet.current.data["rcvStatusCode"] !== "40_FINISHED" ? [ { title: this.$T("hzero.common.button.ok").$D("确定"), fill:true, type: "primary", bordered: true, handler: () => {
            this.detailPopup.closePopup();
          } } ] : []}
          columns={this.getBasicDetailColumns()}
        />,
      });
    },
    //打开待收货详情弹窗
    onLineItemClick() {
      this.detailPopup = this.$popup({
        title: this.$T("sinv.receiptWorkbench.view.title.detail.receipLineInfo").$D("收货单明细行信息"),
        position: "right",
        content: <SrmForm
          style={{ padding: "0 15px" }}
          customizeType="detail"
          customizeCode={this.getLineDetailCustomizeCode}
          dataSet={this.lineDataSet}
          columns={this.getLineDetailColumns()}
          onDelete={() => this.detailPopup.closePopup()}
          onUpdate={() => this.detailPopup.closePopup()}
          onSubmit={() => this.detailPopup.closePopup()}
        />,
      });
    },
    //附件
    attachColumns() {
      return [
        {
          fieldType: "EMPTY",
          fieldCode: "attachmentTemplateUuid",
          render: (val, item) => <SrmFlex class="attachment" justify="between" nativeOnClick={() => {
            this.$attachment({
              attachments: [ {
                attachmentUuid: item.attachmentTemplateUuid,
                tenantId: SrmUtil.getTenantId(),
                title: $T("sinv.receiptExecution.model.attachmentTemplateUuid").$D("附件模板"),
                displayType: "list",
                readonly: true,
                showInfo: true,
                uploadButton: "none",
              } ]
            });
          }}>
            <SrmFlex>
              <span class="srm-icon icon-other"/>
              <srm-button type="primary" plain>{$T("sinv.receiptExecution.model.attachmentTemplateUuid").$D("附件模板")}</srm-button>
            </SrmFlex>
            <span class="srm-icon icon-chevron-right"/>
          </SrmFlex>,
          formRow: 10,
        },
        {
          fieldType: "EMPTY",
          fieldCode: "sinvHeaderAttachmentUuid",
          render: (val, item) => <SrmFlex class="attachment" justify="between" nativeOnClick={() => {
            this.$attachment({
              attachments: [ {
                attachmentUuid: item.sinvHeaderAttachmentUuid,
                tenantId: SrmUtil.getTenantId(),
                title: $T("sinv.receiptExecution.model.receiptFile").$D("收货附件"),
                displayType: "list",
                readonly: true,
                showInfo: true,
                uploadButton: "none",
              } ]
            });
          }}>
            <SrmFlex>
              <span class="srm-icon icon-other"/>
              <srm-button type="primary" plain>{$T("sinv.receiptExecution.model.receiptFile").$D("收货附件")}</srm-button>
            </SrmFlex>
            <span class="srm-icon icon-chevron-right"/>
          </SrmFlex>,
          formRow: 30,
        },
      ];
    },
    // 时间分割
    captureTime(fullTime) {
      if (fullTime) {
        const timeArr = fullTime.replace(" ", ":").replace(/:/g, "-").split("-");
        //   const nian = timeArr[0];
        const yue = timeArr[1];
        const ri = timeArr[2];
        const shi = timeArr[3];
        const fen = timeArr[4];
        const miao = timeArr[5];
        const month = yue + "-" + ri;
        const time = shi + ":" + fen + ":" + miao;
        return { month, time };
      }
      return { month: "-", time:"-" };

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
