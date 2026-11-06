<template>
  <div>
    <div class="ssrc-file-template-list-scroll-tab-item-title">
      <span>{{ $T('ssrc.inquiryHall.view.message.tab.attachmentList').$D('附件列表') }}</span>
      <span v-if="!!editorFlag" class="ssrc-scroll-tab-item-right">
        <div v-loading="deleteLoading" class="ssrc-scroll-tab-item-right-delete"><em class="srm-icon icon-trash" @click="handleDeleteFileItem"/></div>
        <em class="srm-icon icon-plus" @click="handleAddFileItem"/>
      </span>
    </div>
    <srm-list v-if="fileTempAttachmentDS" :data-set="fileTempAttachmentDS"
              :columns="getFileTempAttachmentColumns"
              :scrollable="false"
              :show-select-all="false"
              :customize-code="customizeUnitCode"/>
  </div>
</template>

<script>
import { DataSet, $T, SrmListHeader, SrmUtil, SrmButton, SrmUpload } from "srm-mobile-ui";
import { isNil, isEmpty, throttle, } from "lodash";

import { fileTemplateAttachmentDs } from "./store/ds";
import { generateAttTemplate, deleteAttachmentLine } from "./api";
import { getCustomizeUnitCode } from "./utils";

export default {
  modules: [ "ssrc.inquiryHall", "ssrc.common", "smbl.common", "hipspfm.common" ],
  name: "FileTempAttachment",
  props: {
    headInfo: { // 头信息
      type: Object,
      default: () => {},
      required: true,
    },
    editorFlag: { // 是否可编辑
      type: Boolean,
      default: false,
    },
    unitCodeSymbol: { // 个性化code
      type: String,
      default: "",
    },
    bidFlag: { // 招标标识
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      fileTempAttachmentDS: null,
      deleteLoading: false, // 删除loading
      customizeUnitCode: getCustomizeUnitCode({ type: this.unitCodeSymbol, bidFlag: this.bidFlag }),
    };
  },
  computed: {
    getFileTempAttachmentColumns() {
      return [
        this.editorFlag ? {
          formRow: 1,
          fieldCode: "attachmentType",
        } : {
          formRow: 1,
          fieldType:"EMPTY",
          fieldCode: "attachmentType",
          render: (val, item) => <SrmListHeader showOpenTag={false}>{item.attachmentTypeMeaning || "-"}</SrmListHeader>
        },
        {
          formRow: 10,
          fieldCode: "templateAttachment",
          render: (val, item, field, record) => {
            const { fileManageId, tempAttachmentUuid } = item || {};
            const generateAttachLoading = record && record.get("generateAttachLoading");
            if (fileManageId) {
              if (!this.editorFlag) {
                return "-";
              }
              // 来自于寻源模板的招标文件管理中的
              return <SrmButton class="ssrc-file-template-title-button" plain rect loading={generateAttachLoading} onClick={throttle(() => this.handleGenerateAttachment(item, record), 1000)}>
                {$T("ssrc.inquiryHall.model.fileTemplateAttachment.generateAttachment").$D("生成附件")}
              </SrmButton>;
            } else if (tempAttachmentUuid) {
              // 来自于寻源模板的上传本地附件
              return <SrmUpload attachmentUuid={tempAttachmentUuid} descTitle={this.$T("hipspfm.common.button.viewAttachments").$D("查看附件")} readOnly={true} showIcon={false} bucketName="private-bucket" bucketDirectory="ssrc-template-requirement" ></SrmUpload>;
            }
            return "";
          },
        },
        {
          formRow: 10,
          fieldCode: "attachmentUuid",
          render: (val, item, field, record) => {
            const readOnly = !this.editorFlag || record.get("editableFlag") === 1;
            const descTitle = readOnly ? this.$T("hipspfm.common.button.viewAttachments").$D("查看附件") : this.$T("hipspfm.common.button.uploadAttachment").$D("上传附件");
            return (
              <SrmUpload
                attachmentUuid={val}
                readOnly={readOnly}
                showIcon={false}
                descTitle={descTitle}
                canDelete={!readOnly}
                canUpload={!readOnly}
                bucketName="private-bucket"
                bucketDirectory="ssrc-template-requirement"
              />
            );
          }
        },
        {
          formRow: 20,
          fieldCode: "remark",
        },
      ];
    },
  },
  watch: {
    headInfo: {
      handler(newValue, oldValue) {
        const { rfxHeaderId: sourceId, secondarySourceCategory } = newValue || {};
        const { rfxHeaderId: oldSourceId } = oldValue || {};
        if ((oldSourceId || oldSourceId !== sourceId) && !this.fileTempAttachmentDS) {
          this.fileTempAttachmentDS = new DataSet(fileTemplateAttachmentDs({ editorFlag: this.editorFlag, node: this.getSourceNode(), getHeaderFieldsValue: this.getHeaderFieldsValue, getErrorMessage: this.getErrorMessage }));
          this.fileTempAttachmentDS.setQueryParameter({ customizeUnitCode: this.customizeUnitCode });
          this.fileTempAttachmentDS.setBodyParameter({
            sourceNode: this.getSourceNode(),
            // customizeUnitCode: this.customizeUnitCode,
            sourceCategory: "RFX",
            sourceId: sourceId || oldSourceId,
          });
          this.fileTempAttachmentDS.addQueryFieldParameter("attachmentType", "sourceCategory", secondarySourceCategory);
          this.fileTempAttachmentDS.query();
        }
      },
      immediate: true
    },
  },
  methods: {
    getSourceNode() {
      const node = "CHECK";
      return node;
    },
    // 获取头接口字段值
    getHeaderFieldsValue() {
      return this.headInfo;
    },
    getErrorMessage(res) {
      if (res && res.failed) {
        this.$notification.open({
          message: res.message,
          class: "notification"
        });
      }
    },
    // 删除文件行
    handleDeleteFileItem() {
      const selected = this.fileTempAttachmentDS.selected;
      if (isEmpty(selected)) {
        this.$notification.open({
          message: this.$T("ssrc.common.view.message.attachment-line.select.tip").$D("请先勾选附件行"),
          duration: 2000
        });
        return;
      }
      const localRecords = selected.filter((r) => !r.get("attachmentLineId"));
      if (localRecords.length) {
        this.fileTempAttachmentDS.removeLocalRecords(localRecords);
      }
      const attachmentLineIds = selected.map((r) => r.get("attachmentLineId")).filter((id) => !isNil(id));
      if (attachmentLineIds.length) {
        const { rfxHeaderId: sourceId } = this.headInfo || {};
        this.$dialog({
          content: this.$T("smbl.common.message.confirm.delete").$D("确认删除吗？"),
          onOk: () => {
            this.deleteLoading = true;
            deleteAttachmentLine({
              sourceNode: this.getSourceNode(),
              sourceCategory: "RFX",
              sourceId,
              attachmentLineIds,
            }).then((res) => {
              this.fileTempAttachmentDS.refresh();
              if (res && res.failed) {
                this.getErrorMessage(res);
                return;
              }
              this.$notification.open({
                message: this.$T("smbl.common.message.acction.success").$D("操作成功"),
                duration: 2000
              });
            }).finally(() => {
              this.deleteLoading = false;
            });
          }
        });
      } else {
        this.deleteLoading = false;
      }
    },
    // 新增文件行
    handleAddFileItem() {
      this.fileTempAttachmentDS.create({}, 0);
    },
    // 生成附件
    handleGenerateAttachment(item, record) {
      const { rfxHeaderId } = this.headInfo || {};
      const { fileManageId, attachmentUuid: lineUuid = null, editableFlag } = item || {};
      if (!fileManageId) {
        return;
      }
      record.set("generateAttachLoading", true);
      const params = {
        fileManageId,
        sourceCategory: "RFX",
        sourceId: rfxHeaderId,
        ...editableFlag === 1 ? {} : { attachmentUuid: lineUuid }, // 注意：editableFlag为1 表示寻源模板上的附件要求【限制文件不可修改】= 1
        organizationId: SrmUtil.getTenantId(),
      };
      record.set("attachmentUuid", null);
      return generateAttTemplate(params).then((result) => {
        if (result && result.failed) {
          this.getErrorMessage(result);
          record.set("attachmentUuid", lineUuid);
          record.set("generateAttachLoading", false);
          return;
        }

        this.$notification.open({
          message: this.$T("smbl.common.message.acction.success").$D("操作成功"),
          duration: 2000
        });

        const { attachmentUuid } = result || {};
        record.set("attachmentUuid", attachmentUuid);
        record.set("generateAttachLoading", false);
      });
    },
  }
};
</script>

<style lang="stylus" scoped>
.ssrc-file-template-list-scroll-tab-item-title {
  -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    background: var(--background-color-empty-second);
    color: var(--font-color-default);
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    font-size: 3.733vw;
    font-weight: 600;
    line-height: 5.333vw;
    padding: 2.667vw 4vw;
    justify-content: space-between;
}
.ssrc-scroll-tab-item-right {
  font-weight: 400;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
}
.ssrc-scroll-tab-item-right-delete {
  margin-right: 8px;
}
>>> .srm-attachment-button > .srm-button-plain > .srm-button-text {
  font-family: PingFangSC-Regular;
}
.ssrc-file-template-title-button {
  font-size: 3.2vw;
  font-weight: 400;
  font-family: PingFangSC-Regular;
}
>>> .srm-list-tool-button-wrap {
  display: none;
}
</style>