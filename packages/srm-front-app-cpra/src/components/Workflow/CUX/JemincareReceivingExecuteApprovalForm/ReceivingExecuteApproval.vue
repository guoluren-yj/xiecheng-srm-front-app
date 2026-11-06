<template>
  <srm-scroll-tab>
    <srm-scroll-tab-item :label="$T('sinv.receiptExecution.view.headInfo').$D('接收明细头信息')">
      <srm-list :scrollable="false"
                height="auto"
                style="height: auto"
                customize-code="SMBL.WORKFLOW.RECEIPTEXECUTION.HEAD"
                :data-set="headDataSet"
                :columns="headColumns"/>
    </srm-scroll-tab-item>
    <srm-scroll-tab-item :label="$T('sinv.receiptExecution.view.lineInfo').$D('接收明细行信息')">
      <srm-list :scrollable="false"
                height="auto"
                style="height: auto"
                customize-code="SMBL.WORKFLOW.RECEIPTEXECUTION.LINE"
                :data-set="lineDataSet"
                :columns="lineColumns"/>
    </srm-scroll-tab-item>
  </srm-scroll-tab>
</template>

<script>
import { downloadFile } from "srm-mobile-ui/src/utils/jsBridge";
import { buildImgUrl } from "srm-mobile-ui/src/utils";
import {
  getReceivingExecuteApprovalHeadDetail,
  saveApi
  // getReceivingExecuteLineDetail,
} from "./api";
import uuid from "uuid";
import { commonDs, lineDs } from "./dataSource";
import { DataSet } from "srm-mobile-ui";
export default {
  modules: [ "hipspfm.common", "sinv.receiptExecution" ],
  name: "ReceivingExecuteApproval",
  props: {
    changeReqId: {
      type: String | Number,
      default: ""
    },
    parameters: {
      type: Object,
      default: null,
    }
  },
  data() {
    return {
      head: {},
      lineData: [],
      headUuid: null,
      localHeadUuid: null, // 标记新的uuid
      headDataSet: new DataSet(commonDs()),
      lineDataSet: new DataSet(lineDs()),
      nodeIndex: null,
      editFlag: false,
    };
  },
  computed: {
    headColumns() {
      return [ {
        fieldCode: "displayTrxNum",
        formRow: 1,
        render: (val) => <srm-list-header show-open-tag={true}>
          <span>{ val }</span>
        </srm-list-header>
      }, {
        fieldCode: "rcvTypeName",
        formRow: 10,
      }, {
        fieldCode: "companyName",
        formRow: 20,
      }, {
        fieldCode: "supplierName",
        formRow: 30,
      }, {
        fieldCode: "creationName",
        formRow: 40,
      }, {
        fieldCode: "creationDate",
        formRow: 40,
      }, {
        fieldCode: "totalQuantity",
        formRow: 50,
      }, {
        fieldCode: "returnedFlag",
        formRow: 50,
        render: (val) => Number(val) === 1 ? this.$T("hipspfm.common.status.yes").$D("是") : this.$T("hipspfm.common.status.no").$D("否"),
      }, {
        fieldCode: "attachmentTemplateUuid",
        formRow: 60,
        render: () => <SrmUpload showIcon={false}
          style="font-weight: bold;"
          color="var(--color-other-default-b)"
          descTitle={this.$T("sinv.receiptExecution.model.templateDownload").$D("模板下载")}
          attachmentUuid={this.headUuid} />,
      }, {
        fieldCode: "sinvHeaderAttachmentUuid",
        formRow: 60,
        render: () => <SrmUpload showIcon={false}
          style="font-weight: bold;"
          color="var(--color-other-default-b)"
          descTitle={this.$T("sinv.receiptExecution.model.receipt.fileCheck").$D("附件查看")}
          attachmentUuid={this.headUuid} />,
      }, {
        fieldCode: "remark",
        formRow: 70,
      }, {
        fieldCode: "attributeLongtext1",
        formRow: 80,
      }, ];
    },
    lineColumns() {
      return [ {
        fieldName: "itemCode",
        fieldType: "EMPTY",
        fieldCode: "itemCode",
        formRow: 1,
        render: (val) => <srm-list-header show-open-tag={true}>
          <span>{ val }</span>
        </srm-list-header>
      }, {
        fieldName: this.$T("sinv.receiptExecution.model.receipt.itemName").$D("物料名称"),
        fieldType: "TEXT",
        fieldCode: "itemName",
        formRow: 10,
      }, {
        fieldName: this.$T("sinv.receiptExecution.model.receipt.change").$D("移动类型"),
        fieldType: "TEXT",
        fieldCode: "rcvTypeName",
        formRow: 20,
      }, {
        fieldName: this.$T("sinv.receiptExecution.model.receipt.lineNum").$D("行号"),
        fieldType: "TEXT",
        fieldCode: "trxLineNum",
        formRow: 20,
      }, {
        fieldName: this.$T("sinv.receiptExecution.model.receipt.leftQuantity").$D("可执行数量"),
        fieldType: "INPUT_NUMBER",
        fieldCode: "leftQuantity",
        formRow: 30,
        editor:false
      }, {
        fieldName: this.$T("sinv.receiptExecution.model.receipt.exec.quantity").$D("执行数量"),
        fieldType: "INPUT_NUMBER",
        fieldCode: "quantity",
        formRow: 30,
        editor:false
      }, {
        fieldName: this.$T("sinv.receiptExecution.model.receipt.reverseQuantity").$D("执行退回数量"),
        fieldType: "INPUT_NUMBER",
        fieldCode: "executeReverseQuantity",
        formRow: 40,
        editor:false
      }, {
        fieldName: this.$T("sinv.receiptExecution.model.receipt.reverseNode").$D("执行退回节点"),
        fieldType: "TEXT",
        fieldCode: "executeReverseNodeConfigName",
        formRow: 40,
      }, {
        fieldName: this.$T("sinv.receiptExecution.model.receipt.leftTaxAmount.tax").$D("可执行金额(含税)"),
        fieldType: "INPUT_NUMBER",
        fieldCode: "leftTaxAmount",
        formRow: 50,
        editor: false,
        precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision")),
      }, {
        fieldName: this.$T("sinv.receiptExecution.model.receipt.taxIncludedAmount").$D("执行金额(含税)"),
        fieldType: "INPUT_NUMBER",
        fieldCode: "taxIncludedAmount",
        formRow: 60,
        editor: false,
        precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision")),
      }, {
        fieldName: this.$T("sinv.receiptExecution.model.receipt.taxId").$D("税率"),
        fieldType: "TEXT",
        fieldCode: "taxRate",
        formRow: 60,
      }, {
        fieldName: this.$T("sinv.receiptExecution.model.receipt.netPrice").$D("含税单价"),
        fieldType: "INPUT_NUMBER",
        fieldCode: "taxIncludedPrice",
        formRow: 70,
        editor: false,
      }, {
        fieldName: this.$T("sinv.receiptExecution.model.receipt.not.netPrice").$D("未税单价"),
        fieldType: "INPUT_NUMBER",
        fieldCode: "netPrice",
        formRow: 70,
        editor: false,
      }, {
        fieldName: this.$T("sinv.receiptExecution.model.receipt.inventoryName").$D("库房"),
        fieldType: "TEXT",
        fieldCode: "inventoryName",
        formRow: 80,
      }, {
        fieldName: this.$T("sinv.receiptExecution.model.receipt.locationName").$D("库位"),
        fieldType: "TEXT",
        fieldCode: "locationName",
        formRow: 90,
      }, {
        fieldName: this.$T("sinv.receiptExecution.model.receipt.lineUuid").$D("行附件"),
        fieldType: "TEXT",
        fieldCode: "sinvLineAttachmentUuid",
        formRow: 90,
        render: (val) => <SrmUpload showIcon={false}
          style="font-weight: bold;"
          color="var(--color-other-default-b)"
          descTitle={this.$T("sinv.receiptExecution.model.receipt.fileCheck").$D("附件查看")}
          attachmentUuid={val} />,
      }, {
        fieldName: this.$T("sinv.receiptExecution.model.receipt.lineRemark").$D("行备注"),
        fieldType: "TEXT",
        fieldCode: "remark",
        formRow: 100,
      }, ];
    }
  },
  mounted() {
    this.nodeIndex = this.parameters.nodeIndex;
    this.editFlag = this.parameters.type && this.parameters.type === "edit";
    this.getApprovalDetail();
  },
  methods: {
    async getApprovalDetail() {
      getReceivingExecuteApprovalHeadDetail(this.parameters.rcvTrxHeaderId, this.nodeIndex).then((res) => {
        this.head = res;
        if (this.head.sinvHeaderAttachmentUuid) {
          this.headUuid = this.head.sinvHeaderAttachmentUuid;
        } else {
          this.headUuid = uuid();
          this.localHeadUuid = this.headUuid;
          this.head.sinvHeaderAttachmentUuid = this.headUuid;
        }
        this.headDataSet.setData([ { ...this.head, editorFlag:  this.editFlag } ]);
      });
      this.lineDataSet.addQueryParameter("customizeUnitCode", "SINV.RECEIPT_EXECUTE_DETAIL.LINE_" + this.nodeIndex);
      this.lineDataSet.addPathParameter("id", this.parameters.rcvTrxHeaderId);
      this.lineDataSet.refresh();
      // this.$emit("GetApprovalTitle", this.$T("sinv.receiptExecution.view.title.receiptExecution").$D("新事务中心事务非自审批"));
      // const { content } = await getReceivingExecuteLineDetail(this.parameters.rcvTrxHeaderId, this.parameters.nodeIndex);
      // this.lineData = content;
    },
    downloadlFileHandler(fileUrl, bucketName) {
      const router = this.vm ? this.vm.$router : this.$router;
      const downloadUrl = buildImgUrl(fileUrl, bucketName);

      try {
        downloadFile(downloadUrl);
      } catch (e) {
        router.push({
          path: `downLoad?downLoadUrl=${encodeURIComponent(downloadUrl)}`,
        });
      }
    },
    // 审批前校验
    beforeApprove() {
      if (this.editFlag) {
        if (!this.headDataSet.validate()) {
          console.log("头校验不通过");
          return false;
        }
        if (!this.lineDataSet.validate()) {
          console.log("行校验不通过");
          return false;
        }
        // 保存数据
        return new Promise((resolve, reject) => {
          saveApi(
            `customizeUnitCode=SINV.RECEIPT_WORKBENCH_THING.DETAIL.${this.nodeIndex}%2CSINV.RECEIPT_WORKBENCH_THING.DETAIL.LINE_${this.nodeIndex}%2CSINV.RECEIPT_WORKBENCH_THING.DETAIL.RATE_${this.nodeIndex}`,
            {
              ...this.headDataSet.toData()[0],
              sinvRcvTrxLineDTOS: this.lineDataSet.toData(),
              saveMethod: 'WFL' ,
            }).then((res) => {
            if (res && res.failed) {
              reject(false);
            }
            resolve(true);
          }).catch(() => {
            reject(false);
          });
        });
      }
      console.log("不需要校验");
      return true;
    }
  }
};
</script>

<style lang="stylus" scoped>
.receiving-execute-approval {
  width: 100%;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  >>> .srm-line-tab {
    height: 100%;
  }
  >>> .srm-line-tab-content {
    background-color: var(--color-border-default);
  }

  >>> .srm-tab-pane {
    background-color: var(--color-border-default);
  }
  >>> .srm-tab-pane-title {
    background-color: var(--color-border-default);
  }
}
</style>
