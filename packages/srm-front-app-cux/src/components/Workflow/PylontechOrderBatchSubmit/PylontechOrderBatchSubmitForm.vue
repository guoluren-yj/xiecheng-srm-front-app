<template>
  <div ref="priceExecute" class="price-execute-approval">
    <srm-scroll-tab>
      <srm-scroll-tab-item :label="$T('scux.PylontechOrderBatchSubmitForm.view.title.baseInfo').$D(
        '基本信息'
      )">
        <srm-form :data-set="headerDataDs" :columns="getGroupInfoColumns" />
      </srm-scroll-tab-item>
      <srm-scroll-tab-item :label="$T('scux.PylontechOrderBatchSubmitForm.view.title.lineInfo').$D(
        '行明细'
      )">
        <srm-list :data-set="lineInfoDataSet" :columns="lineColumns" :scrollable="false" />
      </srm-scroll-tab-item>
      <srm-scroll-tab-item :label="$T('scux.PylontechOrderBatchSubmitForm.view.title.attachement').$D(
        '附件信息'
      )">
        <srm-form :data-set="headerDataDs" :columns="getAttachmentColumns" />
      </srm-scroll-tab-item>
    </srm-scroll-tab>
  </div>
</template>

<script>
import { DataSet } from "srm-mobile-ui";
import { lineInfoDs, headerData } from "./dataSource/index";

export default {
  modules: [ "scux.PylontechOrderBatchSubmitForm" ],
  name: "PylontechOrderBatchSubmitForm",
  props: {
    changeReqId: {
      type: String || Number,
      default: "",
    },
    parameters: {
      type: Object,
    },
  },
  data() {
    return {
      headerDataDs: new DataSet(headerData()),
      lineInfoDataSet: new DataSet(lineInfoDs()),
    };
  },
  computed: {
    // 基本信息
    getGroupInfoColumns() {
      return [
        {
          fieldCode: "attributeVarchar40",
        },
        {
          fieldCode: "createdByMeaning",
        },
        {
          fieldCode: "createdUnitIdMeaning",
        },
        {
          fieldCode: "companyName",
        },
        {
          fieldCode: "totalTaxIncludeAmount",
        },
        {
          fieldCode: "maxTaxIncludeAmount",
        },
        {
          fieldCode: "currencyCode",
        },
        {
          fieldCode: "attributeVarchar1Meaning",
        },
        {
          fieldCode: "attributeVarchar7Meaning",
        },
        {
          fieldCode: "attributeVarchar3Meaning",
        },
      ];
    },
    // 行信息
    lineColumns() {
      return [
        {
          fieldCode: "index",
        },
        {
          fieldCode: "displayPoNum",
          render: (val, item) => <a onClick={() => this.hanldeJumpDetails(item)}>{val}</a>,
        },
        {
          fieldCode: "supplierIdMeaning",
        },
        {
          fieldCode: "taxIncludeAmount",
        },
        {
          fieldCode: "attachmentUuid",
          render: (val) =>
            <div>
              <SrmUpload
                attachment-uuid={val}
                show-count={false}
                show-icon={false}
                title={this.$T(
                  "scux.PylontechOrderBatchSubmitForm.model.attributeLongtext1"
                ).$D("附件")}
                desc-title={this.$T("scux.PylontechOrderBatchSubmitForm.model.check").$D(
                  "查看"
                )}
              />
            </div>,
        },
      ];
    },
    // 附件信息
    getAttachmentColumns() {
      return [
        {
          fieldCode: "attributeLongtext1",
          render: (val) =>
            <div>
              <SrmUpload
                attachment-uuid={val}
                show-count={false}
                show-icon={false}
                title={this.$T(
                  "scux.PylontechOrderBatchSubmitForm.model.attributeLongtext1"
                ).$D("附件")}
                desc-title={this.$T("scux.PylontechOrderBatchSubmitForm.model.check").$D(
                  "查看"
                )}
              />
            </div>,
        },
        {
          fieldCode: "attributeLongtext8",
        },
      ];
    }
  },
  async mounted() {
    const { bussinessKey } = this.parameters;
    this.headerDataDs.setQueryParameter({ bussinessKey });
    this.headerDataDs.refresh();
    this.lineInfoDataSet.setQueryParameter({ bussinessKey });
    this.lineInfoDataSet.refresh();
  },
  methods: {
    hanldeJumpDetails(item) {
      const { poHeaderId, poSourcePlatform, sourceBillTypeCode } = item || {};
      this.$router.push({
        path: "/appCpra/ToBeSubmittedDetail",
        query: { poHeaderId, poSourcePlatform, sourceBillTypeCode },
      });
    },
  },
};
</script>

<style scoped lang="stylus">
.preserve-format {
   white-space: pre-line; /* 保留换行，合并连续空格 */
}
.price-execute-approval {
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
