<template>
  <div>
    <srm-form
      class="attachment-form"
      :data-set="headerDs"
      :columns="getColumns"/>
  </div>
</template>

<script>
import uuid from "uuid";
import { saveAttachment } from "../api";
export default {
  modules: [ "entity.attachment", "sqam.common" ],
  name: "AttachmentInfo",
  inject: [
    "headerDs",
    "isPageMap",
  ],
  data() {
    return {
      attachmentUuid: uuid(),
      attachmentInterUuid: uuid(),
      supplierAttachmentUuid: uuid(),
    };
  },
  computed: {
    getColumns() {
      const bucketName = "private-bucket";
      return [
        {
          fieldType: "EMPTY",
          formRow: 10,
          fieldCode: "attachmentUuid",
          fieldName: this.$T("entity.attachment.type.purchaser").$D("采购方附件"),
          render: (val, _, field) => <SrmFlex class="attachment" justify="between">
            <SrmFlex justify="between">
              <SrmFlex>
                <span class="srm-icon icon-other" />
                <srm-attachment-button
                  attachments={[ {
                    bucketName,
                    directory: "sqam-ed-att",
                    attachmentUuid: val || this.attachmentUuid,
                    title: `${field.fieldName}(${this.$T("sqam.common.view.button.outerAttachment").$D("外部附件")})`,
                    readonly: !this.isPageMap.creation,
                    showInfo: true,
                    uploadButton: this.isPageMap.creation ? "fixed" : "none",
                  } ]}
                  show-total
                  title={field.fieldName}
                  onFileUpload={() => {
                    this.handleFileUpload("attachmentUuid", 1);
                  }}/>
              </SrmFlex>
              <SrmTag class="attachment-tag" type="danger">
                {this.$T("sqam.common.view.button.outerAttachment").$D("外部附件")}
              </SrmTag>
            </SrmFlex>
            <span class="srm-icon icon-chevron-right" />
          </SrmFlex>,
        },
        {
          fieldType: "EMPTY",
          formRow: 20,
          fieldCode: "attachmentInterUuid",
          fieldName: this.$T("entity.attachment.type.purchaser").$D("采购方附件"),
          render: (val, _, field) => <SrmFlex class="attachment" justify="between">
            <SrmFlex justify="between">
              <SrmFlex>
                <span class="srm-icon icon-other" />
                <srm-attachment-button
                  attachments={[ {
                    bucketName,
                    directory: "sqam-ed-inter-att",
                    attachmentUuid: val || this.attachmentInterUuid,
                    title: `${field.fieldName}(${this.$T("sqam.common.view.button.innerAttachment").$D("内部附件")})`,
                    readonly: !this.isPageMap.creation,
                    showInfo: true,
                    uploadButton: this.isPageMap.creation ? "fixed" : "none",
                  } ]}
                  show-total
                  title={field.fieldName}
                  onFileUpload={() => {
                    this.handleFileUpload("attachmentInterUuid", 3);
                  }}
                />
              </SrmFlex>
              <SrmTag class="attachment-tag" type="success">
                {this.$T("sqam.common.view.button.innerAttachment").$D("内部附件")}
              </SrmTag>
            </SrmFlex>
            <span class="srm-icon icon-chevron-right" />
          </SrmFlex>,
        },
        !this.isPageMap.creation && {
          fieldType: "EMPTY",
          formRow: 30,
          fieldCode: "supplierAttachmentUuid",
          fieldName: this.$T("entity.attachment.type.supplier").$D("供应商附件"),
          render: (val, _, field) => <SrmFlex class="attachment" justify="between">
            <SrmFlex justify="between">
              <span class="srm-icon icon-other" />
              <srm-attachment-button
                attachments={[ {
                  bucketName,
                  bucketDirectory: "sqam-ed-supplieratt",
                  attachmentUuid: val || this.supplierAttachmentUuid,
                  title: field.fieldName,
                  readonly: !this.isPageMap.creation,
                  showInfo: true,
                  uploadButton: this.isPageMap.creation ? "fixed" : "none",
                } ]}
                show-total
                title={field.fieldName}
                onFileUpload={() => {
                  this.handleFileUpload("supplierAttachmentUuid", 2);
                }}/>
            </SrmFlex>
            <span class="srm-icon icon-chevron-right" />
          </SrmFlex>,
        },
      ].filter(Boolean);
    },
  },
  methods: {
    async handleFileUpload(fieldCode, uuidType) {
      const oldUuid = this.headerDs.current?.get(fieldCode);
      const problemHeaderId = this.headerDs.current?.get("problemHeaderId");
      const newUuid = this[fieldCode];
      if (!oldUuid) {
        const res = await saveAttachment({
          uuid: newUuid,
          uuidType,
          problemHeaderId,
        }).catch((err) => {
          throw err;
        });
        if (res && !res.failed) {
          this.headerDs.current.set(fieldCode, newUuid);
          this.headerDs.current.set("objectVersionNumber", res);
        }
      }
    }
  },
};
</script>

<style lang="stylus" scoped>

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

.attachment-form {
  padding-top: 0;
  padding-bottom: 0;
  min-height: 120px;
   ::v-deep {
    .customize-item {
      height: 60px;
      margin-bottom: 0;
      &:not(:first-child) {
        border-top: 1px solid var(--split-line-color-primary);
      }
    }
    .srm-attachment-button {
      display: flex;
      flex-grow: 1;
      .srm-button {
        flex-grow: 1;
        justify-content: left;
      }
    }
  }
}
</style>
