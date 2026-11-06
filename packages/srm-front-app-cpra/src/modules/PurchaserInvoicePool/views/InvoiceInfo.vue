<template>
  <!-- 发票详情 -->
  <div class="approval-detail-container">
    <div class="approval-detail-scroll-el">
      <srm-detail-head ref="headInfoHeight" :columns="getHeaderColumns()" :data-source="info">
        <srm-button class="approval-button" size="small" icon="icon-paperclip" fill bordered @click="showAttachRecords(1)">
          {{ $T("ssta.invoicePool.model.status.attach").$D("附件") }}
        </srm-button>
        <srm-button v-if="info.ocrFileUrl" class="approval-button" size="small" icon="icon-paperclip" bordered @click="showAttachRecords()">
          {{ $T("ssta.invoicePool.model.status.ocrFile").$D("OCR文件") }}
        </srm-button>
        <srm-button class="approval-button" size="small" icon="icon-clock" bordered @click="showHistoryRecords">
          {{ $T("ssta.invoicePool.model.status.operationRecord").$D("操作记录") }}
        </srm-button>
      </srm-detail-head>

      <invoice-approval-form v-if="info.invoiceHeaderId" :change-req-id="info.invoiceHeaderId"/>
    </div>

    <!-- 操作记录 -->
    <history-record
      v-model="showHistoryRecord"
      :loading="historyRecordLoading"
      :action-data="historyRecords"
      operation-meaning-field-name="processStatusMeaning"
      operator-field-name="processUser"
      process-remark-info-field-name="processRemark"/>
  </div>
</template>

<script>
import HistoryRecord from "@/components/HistoryRecord";
import InvoiceApprovalForm from "../component/invoiceApprovalForm";
import { getHistory } from "../api";
import { previewFile } from "srm-mobile-ui/src/utils/index";
export default {
  name: "InvoiceInfo",
  components: { HistoryRecord, InvoiceApprovalForm },
  modules: [ "smbl.common", "hwfp.common", "smbl.workFlow", "hipspfm.workFlow", "hipspfm.common", "scux.demandContactFrom", "hzero.common", "ssta.invoicePool", "ssta.purchaseInvoicePool" ],
  data() {
    return {
      historyRecords: [],
      showHistoryRecord: false,
      historyRecordLoading: false,
      info: {},
      initLoading: false,
      loading: false,
    };
  },
  mounted() {
    this.info = this.$route.params.data;
  },
  methods: {
    showHistoryRecords() {
      this.showHistoryRecord = true;
      this.historyRecordLoading = true;
      getHistory(this.info.invoiceHeaderId).then((res) => {
        if (res && res.content) {
          this.historyRecords = res.content;
        }
      }).finally(() => {
        this.historyRecordLoading = false;
      });
    },
    getHeaderColumns() {
      return [ {
        fieldCode: "invoiceNum",
        render: (val) => val
      }, {
        fieldCode: "belongCompanyName",
        render: (val) => <span>{ this.$T("ssta.invoicePool.model.status.belongCompany").$D("所属公司") }：{ val }</span>
      } ];
    },
    // 发票补充文件
    showAttachRecords(flag) {
      if (flag === 1) {
        this.$showFileList({
          title: this.$T("ssta.invoicePool.model.status.attach").$D("附件"),
          attachmentUuid: this.info.attachmentUuid,
        });
      } else {
        previewFile({
          bucketName: "private-bucket",
          fileUrl: this.info.ocrFileUrl,
          fileName: "xxx.png",
        });
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
.approval-detail-container {
  height 100vh;
  width 100%;
  background: #f0f2f5;
}

.approval-detail-scroll-el {
  height 100%;
  width 100%;
  overflow-y scroll;
  overflow-x hidden;
}

.approval-detail-bottom {
  height 72px;
  width 100%;
  background white;
  margin-bottom: constant(safe-area-inset-top);
  margin-bottom: env(safe-area-inset-top);
}

.approval-from-loading {
  width 100%;
  padding 100px 50px;
  text-align center;
}

.approval-button {
  margin-right 10px;
}
</style>
