<template>
  <div ref="receiptWorkbench" class="create-receive-detail-container">
    <div class="create-receive-detail-scroll-el">
      <srm-scroll-tab >
        <srm-scroll-tab-item :label="getLineDetailTitleName('header')">
          <div @click="onBasicItemClick()">
            <srm-form style="padding:15px 15px 15px 15px;min-height: 264px;margin-bottom: 0px;" :data-set="headDataSet" :columns="getBasicColumns()" customize-code="SMBL.WORKFLOW.RECEIVE_WORKPLACE.HEAD" />
          </div>
        </srm-scroll-tab-item>
        <srm-scroll-tab-item :label="getLineDetailTitleName('line')">
          <!-- <srm-flex style="background:#f0f2f5;height: 54px " justify="between">
            <div style="margin-left: 15px ;font-family: PingFangSC-Semibold;font-size: 16px;color: #333333;font-weight: 600;">{{ $T('sinv.receiptWorkbench.view.title.detail.receipLineInfo').$D('收货单明细行信息') }}</div>
          </srm-flex> -->
          <srm-list :show-bottom-bar="false" :auto-hide-bottom="true" :scrollable="false" :data-set="lineDataSet" :customize-code="getLineCustomizeCode"
                    :columns="getLineColumns()" @itemClick="onLineItemClick()"/>
        </srm-scroll-tab-item>
        <!-- 附件 -->
        <srm-scroll-tab-item :label="getLineDetailTitleName('attrment')">
          <srm-list :scrollable="false"
                    height="auto"
                    style="height: auto"
                    :data-set="headDataSet"
                    :columns="attachColumns()"/>
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
import { $T, DataSet, SrmUtil } from "srm-mobile-ui";
import HistoryRecordTiled from "@/components/HistoryRecordTiled";
import { receiveHeaderDs } from "./datasource/receiveHeaderDS";
import { receiveLineDs } from "./datasource/receiveLineDS";
import Mixin from "./mixin/DetailColumns";
import CustomSpecsColumns from "./mixin/CustomSpecsColumns";
import ReceiverWorkplaceDetailMethod from "../../../modules/CUX_PART/Method/ReceiverWorkplaceDetailMethod";
import { getOperationRecord, queryDoubleUomConfig, saveReceive } from "./api";
import { getLanguage } from "./utils";

export default {
  name: "ReceiverWorkDetailForm",
  components: { HistoryRecordTiled },
  extends: ReceiverWorkplaceDetailMethod,
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
      scoreMobileCustomizeCode: "SMBL.RECEIVE_WORKPLACE.SCORE.DETAIL",
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
    getLineDetailTitleName(type) {
      // 星巴克埋点-工作流标题展示替换
      if (this.over$onDetailTitleShow && typeof this.over$onDetailTitleShow === "function") {
        const res = this.over$onDetailTitleShow();
        return type ? res[type] : "";
      }
      return getLanguage(type);
    },
    async queryDoubleUomConfig() {
      await queryDoubleUomConfig().then((res) => {
        this.isDoubleUnit = Number(res);
        this.refresh();
      });
    },
    refresh() {
      this.headDataSet.addPathParameter("rcvTrxHeaderId", this.rcvTrxHeaderId);
      this.headDataSet.addQueryParameter("customizeUnitCode", `${this.customizeUnitCodes[this.returnFlag].header + this.nodeConfigIndexAbc},SMBL.WORKFLOW.RECEIVE_WORKPLACE.HEAD`);
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
          // render: (val, item) => <SrmFlex class="attachment" justify="between" nativeOnClick={() => {
          //   this.$attachment({
          //     attachments: [ {
          //       attachmentUuid: item.attachmentTemplateUuid,
          //       tenantId: SrmUtil.getTenantId(),
          //       title: $T("sinv.receiptExecution.model.attachmentTemplateUuid").$D("附件模板"),
          //       displayType: "list",
          //       readonly: true,
          //       showInfo: true,
          //       uploadButton: "none",
          //     } ]
          //   });
          // }}>
          //   <SrmFlex>
          //     <span class="srm-icon icon-other"/>
          //     <srm-button type="primary" plain>{$T("sinv.receiptExecution.model.attachmentTemplateUuid").$D("附件模板")}</srm-button>
          //   </SrmFlex>
          //   <span class="srm-icon icon-chevron-right"/>
          // </SrmFlex>,
          render: (val) => <SrmFlex class="attachment" justify="between">
            <SrmFlex>
              <span class="srm-icon icon-other" />
              <SrmAttachmentButton
                showTotal={true}
                title={$T("sinv.receiptExecution.model.attachmentTemplateUuid").$D("附件模板")}
                attachments={[
                  {
                    attachmentUuid: val,
                    readonly: true,
                    showInfo: true,
                    displayType: "list",
                    uploadButton: "none",
                    bucketName: "private-bucket",
                  },
                ]}
              />
            </SrmFlex>
            <span class="srm-icon icon-chevron-right" />
          </SrmFlex>,
          formRow: 10,
        },
        {
          fieldType: "EMPTY",
          render: () => <srm-blank size="1px" theme="fill"/>,
          formRow: 20,
        },
        {
          fieldType: "EMPTY",
          fieldCode: "sinvHeaderAttachmentUuid",
          // render: (val, item) => <SrmFlex class="attachment" justify="between" nativeOnClick={() => {
          //   this.$attachment({
          //     attachments: [ {
          //       attachmentUuid: item.sinvHeaderAttachmentUuid,
          //       tenantId: SrmUtil.getTenantId(),
          //       title: $T("sinv.receiptExecution.model.receiptFile").$D("收货附件"),
          //       displayType: "list",
          //       readonly: true,
          //       showInfo: true,
          //       uploadButton: "none",
          //     } ]
          //   });
          // }}>
          //   <SrmFlex>
          //     <span class="srm-icon icon-other"/>
          //     <srm-button type="primary" plain>{$T("sinv.receiptExecution.model.receiptFile").$D("收货附件")}</srm-button>
          //   </SrmFlex>
          //   <span class="srm-icon icon-chevron-right"/>
          // </SrmFlex>,
          render: (val) => <SrmFlex class="attachment" justify="between">
            <SrmFlex>
              <span class="srm-icon icon-other" />
              <SrmAttachmentButton
                showTotal={true}
                title={$T("sinv.receiptExecution.model.receiptFile").$D("收货附件")}
                attachments={[
                  {
                    attachmentUuid: val,
                    readonly: true,
                    showInfo: true,
                    displayType: "list",
                    uploadButton: "none",
                    bucketName: "private-bucket",
                  },
                ]}
              />
            </SrmFlex>
            <span class="srm-icon icon-chevron-right" />
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
  }
};
</script>

<style lang="stylus" scoped>
@import "~srm-mobile-ui/src/style/var.styl"
.create-receive-detail-container {
  // height 100%;
  .create-receive-detail-scroll-el {
  //   height 100%;
  //   overflow-y scroll;
  //   overflow-x hidden;
  //   padding-bottom 80px;
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

.text{
  font-weight: 600;
}
.tag-ste{
  padding: 2px 4px !important;
  font-size: 12px !important;
}
.title-text{
  font-weight:400;
}

.srm-icon {
  color var(--font-color-disable);
  font-size 20px;
  margin-left: 10px;
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
</style>
