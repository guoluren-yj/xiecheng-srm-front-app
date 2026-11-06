<template>
  <div ref="priceExecute" class="price-execute-approval">
    <srm-scroll-tab>
      <srm-scroll-tab-item
        :label="
          $T('scux.orforOrderAllocationApproval.view.title.baseInfo').$D(
            '分配单头信息'
          )
        ">
        <srm-form :data-set="headerDataDs" :columns="getHeaderColumns" />
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        :label="
          $T('scux.orforOrderAllocationApproval.view.title.linInfo').$D(
            '分配单行信息'
          )
        ">
        <srm-list :data-set="lineInfoDataSet" :columns="lineColumns" />
      </srm-scroll-tab-item>
    </srm-scroll-tab>
  </div>
</template>

<script>
import { DataSet } from "srm-mobile-ui";
import { lineInfoDs, headerData } from "./dataSource/index";

export default {
  modules: [ "scux.orforOrderAllocationApproval", "hipspfm.workFlow" ],
  name: "OrforOrderAllocationApproval",
  props: {
    changeReqId: {
      type: String || Number,
      default: "",
    },
  },
  data() {
    return {
      fileUuid: "",
      fileUrl: "",
      headerDataDs: new DataSet(headerData()),
      lineInfoDataSet: new DataSet(lineInfoDs()),
    };
  },
  computed: {
    fileArr() {
      return [
        {
          attachmentUuid: this.fileUuid,
          readonly: true,
          uploadButton: "none",
          bucketName: "private-bucket",
        },
      ];
    },
    getHeaderColumns() {
      return [
        {
          fieldCode: "num",
        },
        {
          fieldCode: "statusMeaning",
        },
        {
          fieldCode: "processId",
        },
        {
          fieldCode: "createdByMeaning",
        },
        {
          fieldCode: "creationDate",
        },
        {
          fieldCode: "prTypeName",
        },
        {
          fieldCode: "fileUuid",
          render: () =>
            <div>
              {/* <SrmUpload
                attachmentUuid={this.fileUuid}
                show-count={false}
                show-icon={false}
                title={this.$T("scux.orforOrderAllocationApproval.title.orforOrderAllocationApproval.fileUuid").$D(
                  "分配单行明细附件"
                )}
                desc-title={this.$T(
                  "scux.orforOrderAllocationApproval.model.orforOrderAllocationApproval.view.button.viewUpload"
                ).$D("查看附件")}
              /> */}
              {/* <srm-button size="small" icon="icon-paperclip">
                <srm-attachment-button
                  attachments={this.fileArr} />
              </srm-button> */}
              <srm-attachment attachment-uuid={this.fileUuid} displayType="list" readonly />
            </div>
          ,
        },
      ];
    },
    lineColumns() {
      return [
        {
          fieldName: this.$T("scux.orforOrderAllocationApproval.model.orforOrderAllocationApproval.itemName").$D("物料"),
          fieldType: "EMPTY",
          render: (val, record) => <srm-list-header>
            <span>{`${record.itemCode}/${record.itemName}`}</span>
          </srm-list-header>
        },
        {
          fieldCode: "lastSupplierCompanyNum",
        },
        {
          fieldCode: "supplierCompanyIdMeaning",
        },
        {
          fieldCode: "poQuantity",
        },
        {
          fieldCode: "totalArbitrage",
        },
        {
          fieldCode: "taxIncludedLineAmount",
        },
      ];
    },
  },
  async mounted() {
    this.headerDataDs.setQueryParameter({ id: this.changeReqId });
    await this.headerDataDs.refresh();
    this.lineInfoDataSet.setQueryParameter({ id: this.changeReqId });
    await this.lineInfoDataSet.refresh();
    const { fileUuid, fileUrl } = this.lineInfoDataSet.toData()?.[0] || {};
    this.fileUuid = fileUuid;
    this.fileUrl = fileUrl;
  },
};
</script>

<style scoped lang="stylus">
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
