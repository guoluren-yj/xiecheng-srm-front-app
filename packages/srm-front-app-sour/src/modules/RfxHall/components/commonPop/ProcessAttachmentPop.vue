<template>
  <!-- 过程附件弹框 -->
  <srm-popup height="100%" :visible.sync="processAttachmentPop" :show-header="false">
    <srm-list :scrollable="false"
              height="auto"
              style="height: auto"
              :data-set="processAttachmentData"
              :columns="getProcessAttachmentDetailColumns"/>
  </srm-popup>
</template>
<script>
import { DataSet } from "srm-mobile-ui";
import { processAttachmentDs } from "../../datasource/processAttachmentDs";
export default {
  modules: [ "ssrc.inquiryHall", "ssrc.common", "hipspfm.common" ],
  name: "ProcessAttachmentPop",
  props: {
  },
  data() {
    return {
    //过程附件
      processAttachmentData: new DataSet(), //过程附件信息
      processAttachmentPop: false, //过程附件弹窗
    };
  },
  computed: {
    //过程附件详情字段
    getProcessAttachmentDetailColumns() {
      return [
        {
          formRow: 10,
          fieldCode: "nodeMeaning",
          fieldName: this.$T("ssrc.common.model.common.node").$D("节点")
        },
        {
          formRow: 10,
          fieldCode: "type",
          fieldName: this.$T("ssrc.common.model.common.attachmentType").$D("附件类型")
        },
        {
          formRow: 20,
          fieldCode: "realName",
          fieldName: this.$T("ssrc.common.model.common.uploadBy").$D("上传人")
        },
        {
          formRow: 20,
          fieldCode: "creationDate",
          fieldName: this.$T("ssrc.common.model.common.creationDate").$D("上传时间")
        },
        {
          formRow: 30,
          fieldCode: "rfxHeaderId",
          fieldName: this.$T("ssrc.inquiryHall.view.message.title.downloadAttachments").$D("附件下载"),
          render: (val, item) =>
            <span style="color: var(--color-other-default-b);"
              on-click={(e) => {
                e.stopPropagation();
                // eslint-disable-next-line no-undef
                this.downloadlFileHandler(item);
              }}>
              { this.$T("ssrc.inquiryHall.view.message.title.downloadAttachments").$D("附件下载") }
            </span>,
        },
      ];
    },
  },
  methods:{
    //获取过程附件信息
    getProcessAttachmentDetailInfo(item) {
      this.processAttachmentPop = false;
      this.processAttachmentData = new DataSet(processAttachmentDs(item.rfxHeaderId));
      this.processAttachmentData.refresh();
      this.processAttachmentPop = true;
    },
    //过程附件下载
    downloadlFileHandler(item) {
      let rfxProcessAttachmentDTOS = item.rfxProcessAttachmentDTOS;
      this.$showFileList({
        fileList: rfxProcessAttachmentDTOS.map((e) => ({
          fileUrl: e.fileUrl,
          fileName: e.fileName,
          fileSize: e.fileSize,
          creationDate: e.creationDate,
          bucketName: "private-bucket",
        }))
      });
    },
  }
};
</script>
<style lang="stylus" scoped>
</style>
