<template>
  <div ref="receivingExecute" class="receiving-execute-approval">
    <srm-scroll-tab>
      <srm-scroll-tab-item :label="$T('sinv.receiptExecution.view.headInfo').$D('接收明细头信息')">
        <div style="background-color: #fff;padding-top: 16px;">
          <customize :columns="headColumns" :need-padding="true" :data-source="head" code="SMBL.WORKFLOW.RECEIPTEXECUTION.HEAD" />
        </div>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item :label="$T('sinv.receiptExecution.view.lineInfo').$D('接收明细行信息')">
        <div v-for="(item, index) in lineData" :key="index" style="margin-bottom: 8px;padding-top: 16px;background-color: #fff">
          <customize :columns="lineColumns" :need-padding="true" :data-source="item" code="SMBL.WORKFLOW.RECEIPTEXECUTION.LINE" />
        </div>
      </srm-scroll-tab-item>
    </srm-scroll-tab>
  </div>
</template>

<script>
import { downloadFile } from "srm-mobile-ui/src/utils/jsBridge";
import { buildImgUrl } from "srm-mobile-ui/src/utils";
import {
  getReceivingExecuteApprovalHeadDetail,
  getReceivingExecuteLineDetail,
} from "./api";
import {
  getStatusCodeColor,
} from "./utils/index";
import uuid from "uuid";
export default {
  modules: [ "hipspfm.common", "sinv.receiptExecution", "sinv.receipWorkbench" ],
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
    };
  },
  computed: {
    headColumns() {
      return [ {
        fieldName: this.$T("sinv.receiptExecution.model.receipt.displayTrxNum").$D("单据编号"),
        fieldType: "TEXT",
        fieldCode: "displayTrxNum",
        formRow: 1,
        render: (val, item) => <srm-list-header show-open-tag={false}>
          <span class="title-text">{val}</span>
          <srm-tag class="tag-ste" slot="right" size="large" type={getStatusCodeColor(item.rcvStatusCode)}>{item.rcvStatusCodeMeaning}</srm-tag>
          <span slot="right" style={{ marginLeft: "8px", color:"rgb(51, 51, 51)", fontSize: "16px" }} class="srm-icon icon-chevron-right"/>
        </srm-list-header>,
      }, {
        fieldName: this.$T("sinv.receiptExecution.model.receipt.rcvTypeName").$D("事务类型"),
        fieldType: "TEXT",
        fieldCode: "rcvTypeName",
        formRow: 10,
      }, {
        fieldName: this.$T("sinv.receiptExecution.model.receipt.companyName").$D("公司"),
        fieldType: "TEXT",
        fieldCode: "companyName",
        formRow: 20,
      }, {
        fieldName: this.$T("sinv.receiptExecution.model.receipt.supplierName").$D("供应商"),
        fieldType: "TEXT",
        fieldCode: "supplierName",
        formRow: 30,
      }, {
        fieldName: this.$T("sinv.receiptExecution.model.receipt.creationName").$D("单据创建人"),
        fieldType: "TEXT",
        fieldCode: "creationName",
        formRow: 40,
      }, {
        fieldName: this.$T("sinv.receiptExecution.model.receipt.creationDate").$D("创建日期"),
        fieldType: "TEXT",
        fieldCode: "creationDate",
        formRow: 40,
      }, {
        fieldName: this.$T("sinv.receiptExecution.model.receipt.totalQuantity").$D("汇总数量"),
        fieldType: "INPUT_NUMBER",
        fieldCode: "totalQuantity",
        formRow: 50,
        editor: false,
      }, {
        fieldName: this.$T("sinv.receiptExecution.model.receipt.returnedFlag").$D("是否退回"),
        fieldType: "TEXT",
        fieldCode: "returnedFlag",
        formRow: 50,
        render: (val) => Number(val) === 1 ? this.$T("hipspfm.common.status.yes").$D("是") : this.$T("hipspfm.common.status.no").$D("否"),
      }, {
        fieldName: this.$T("sinv.receiptExecution.model.receipt.attachmentTemplateUuid").$D("附件模板"),
        fieldType: "TEXT",
        fieldCode: "attachmentTemplateUuid",
        formRow: 60,
        render: () => <SrmUpload showIcon={false}
          style="font-weight: bold;"
          color="var(--color-other-default-b)"
          descTitle={this.$T("sinv.receiptExecution.model.templateDownload").$D("模板下载")}
          attachmentUuid={this.headUuid} />,
      }, {
        fieldName: this.$T("sinv.receiptExecution.model.receipt.fileCheck").$D("附件查看"),
        fieldType: "TEXT",
        fieldCode: "sinvHeaderAttachmentUuid",
        formRow: 60,
        render: () => <SrmUpload showIcon={false}
          style="font-weight: bold;"
          color="var(--color-other-default-b)"
          descTitle={this.$T("sinv.receiptExecution.model.receipt.fileCheck").$D("附件查看")}
          attachmentUuid={this.headUuid} />,
      }, {
        fieldName: this.$T("sinv.receiptExecution.model.receipt.remark").$D("备注"),
        fieldType: "TEXT",
        fieldCode: "remark",
        formRow: 70,
      }, ];
    },
    lineColumns() {
      return [ {
        fieldName: this.$T("sinv.receipWorkbench.model.receipt.itemName").$D("物料名称"),
        fieldType: "TEXT",
        fieldCode: "itemCode",
        formRow: 1,
        render: (val) => <srm-list-header show-open-tag={false}>
          <span class="title-text">{ val || "-" }</span>
          {/* <srm-tag class="tag-ste" slot="right" size="large" type={getStatusCodeColor(item.rcvStatusCode)}>{item.rcvStatusCodeMeaning}</srm-tag> */}
          {/* <span slot="right" style={{ marginLeft: "8px", color:"rgb(51, 51, 51)", fontSize: "16px" }} class="srm-icon icon-chevron-right"/> */}
        </srm-list-header>,
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
    this.getApprovalDetail();
  },
  methods: {
    async getApprovalDetail() {
      this.head = await getReceivingExecuteApprovalHeadDetail(this.parameters.rcvTrxHeaderId, this.parameters.nodeIndex);
      if (this.head.sinvHeaderAttachmentUuid) {
        this.headUuid = this.head.sinvHeaderAttachmentUuid;
      } else {
        this.headUuid = uuid();
        this.localHeadUuid = this.headUuid;
        this.head.sinvHeaderAttachmentUuid = this.headUuid;
      }
      this.$emit(
        "GetApprovalTitle",
        this.$T("sinv.receiptExecution.view.title.receiptExecution").$D(
          "新事务中心事务非自审批"
        )
      );
      const { content } = await getReceivingExecuteLineDetail(this.parameters.rcvTrxHeaderId, this.parameters.nodeIndex);

      this.lineData = content;
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
</style>
