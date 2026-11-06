<template>
  <div>
    <srm-form
      class="attachment-form"
      :data-set="dataSet"
      :columns="columns"/>
  </div>
</template>

<script>
import uuid from "uuid";
import { DataSet } from "srm-mobile-ui";
export default {
  modules: [ "smbl.common" ],
  name: "AttachmentInfo",
  props: {
    dataSet: {
      type: Object,
      default: () => new DataSet({}),
    },
    directory: {
      type: String,
      default: "",
    }
  },
  data() {
    return {
      attachmentUuid: uuid(),
    };
  },
  computed: {
    columns() {
      return [
        {
          fieldType: "EMPTY",
          formRow: 10,
          fieldCode: "attachmentUuid",
          fieldName: this.$T("smbl.common.view.button.checkAttachmentList").$D("查看附件列表"),
          render: (val, _, field) => <SrmFlex class="attachment" justify="between">
            <SrmFlex justify="between">
              <SrmFlex>
                <span class="srm-icon icon-other" />
                <srm-attachment-button
                  attachments={[ {
                    bucketName: "private-bucket",
                    directory: this.directory,
                    attachmentUuid: val,
                    title: field.fieldName,
                    readonly: true,
                    showInfo: true,
                    uploadButton: "none",
                  } ]}
                  show-total
                  title={field.fieldName}/>
              </SrmFlex>
            </SrmFlex>
            <span class="srm-icon icon-chevron-right" />
          </SrmFlex>,
        },
      ];
    },
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
  min-height: 60px;
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
