<template>
  <div class="srm-order-attachment">
    <srm-attachment-button
      v-if="dataSet?.current"
      group
      :show-total="true"
      :title="$T('sodr.common.view.enterAttachment').$D(
        '内部附件'
      )"
      :attachments="[
        {
          directory:'sodr-order',
          attachmentUuid: dataSet.current?.get('purchaserInnerAttachmentUuid') || purchaserInnerAttachmentUuid,
          showInfo: true,
          displayType: 'list',
          readonly: config.readOnly[0],
          uploadButton: config.readOnly[0] ? 'none' : 'fixed',
        },
      ]"
      @fileUpload="()=>onFileUpload(true)()"/>
    <srm-attachment-button
      v-if="dataSet?.current"
      group
      :show-total="true"
      :title="$T(
        'sodr.workspace.model.common.mobileAttachmentUUID'
      ).$D('外部附件-采购方')"
      :attachments="[
        {
          directory:'sodr-order',
          attachmentUuid: dataSet?.current?.get('attachmentUuid') || attachmentUuid,
          showInfo: true,
          displayType: 'list',
          readonly: config.readOnly[1],
          uploadButton: config.readOnly[1] ? 'none' : 'fixed',
        },
      ]"
      @fileUpload="()=>onFileUpload()()"/>
    <srm-attachment-button
      v-if="dataSet?.current"
      group
      :show-total="true"
      :title="$T(
        'sodr.workspace.model.common.mobileSupplierAttachmentId'
      ).$D('外部附件-供应商')"
      :attachments="[
        {
          directory:'sodr-order',
          attachmentUuid: dataSet.current?.get('supplierAttachmentUuid'),
          showInfo: true,
          displayType: 'list',
          readonly: config.readOnly[2],
          uploadButton: config.readOnly[2] ? 'none' : 'fixed',
        },
      ]"/>
  </div>
</template>

<script>
import { SrmAttachmentButton, SrmFlex } from "srm-mobile-ui";
import uuid from "uuid";
import { isNumber } from "lodash";
import { getPermissions } from "./utils";
import { saveAttachmentUUID } from "../api";
export default {
  modules: [ "sodr.workspace", "sodr.common", "hipspfm.common" ],
  name: "AttachmentInfo",
  props: {
    dataSet: {
      type: Object,
      default: null,
    },
    config: {
      type: Object,
      default:() => ({
        readOnly: [ true, true, true ],
      }),
    },
    // permissionCodes:{
    //   type: Array,
    //   default: []
    //   test:[ "srm.po-admin.po.order-workspace.ps.button.createdmanually.insideattachment",
    //   "srm.po-admin.po.order-workspace.ps.button.createdmanually.externalattachment" ]
    // }
  },
  data() {
    return {
      permissionMap: new Map(),
      attachmentUuid: uuid(),
      purchaserInnerAttachmentUuid: uuid(),
    };
  },
  computed: {
    getColumns() {
      const {
        config: { readOnly },
        dataSet,
      } = this;
      const bucketName = "private-bucket";
      const bucketDirectory = "sodr-order";
      // permissionMap.get(permissionCodes[0])
      // const bucketName = SrmUtil.getDefaultBucketName()
      return [
        {
          fieldType: "EMPTY",
          formRow: 10,
          fieldCode: "purchaserInnerAttachmentUuid",
          render: (val, item) =>
            <SrmFlex class="attachment" justify="between">
              <SrmFlex>
                <span class="srm-icon icon-other" />
                <SrmAttachmentButton
                  showTotal={true}
                  title={this.$T("sodr.common.view.enterAttachment").$D(
                    "内部附件"
                  )}
                  attachments={[
                    {
                      bucketName,
                      bucketDirectory,
                      attachmentUuid: val || this.purchaserInnerAttachmentUuid,
                      showInfo: true,
                      displayType: "list",
                      readonly: readOnly[0],
                      uploadButton: readOnly[0] ? "none" : "fixed",
                    },
                  ]}
                  onFileUpload={() => {
                    const { poHeaderId, purchaserInnerAttachmentUuid } = item;
                    if (poHeaderId && !purchaserInnerAttachmentUuid) {
                      const params = {
                        poHeaderId,
                        uuidType: 3,
                        uuid: this.purchaserInnerAttachmentUuid,
                      };
                      saveAttachmentUUID(params).then((res) => {
                        const basicCurrent = dataSet.current;
                        if (isNumber(res) && !res.failed) {
                          basicCurrent.set(
                            "purchaserInnerAttachmentUuid",
                            this.purchaserInnerAttachmentUuid
                          );
                          basicCurrent.set("objectVersionNumber", res);
                        }
                      });
                    }
                  }}
                />
              </SrmFlex>
              <span class="srm-icon icon-chevron-right" />
            </SrmFlex>
          ,
        },
        {
          fieldType: "EMPTY",
          formRow: 20,
          fieldCode: "attachmentUuid",
          render: (val, item) =>
            <SrmFlex class="attachment" justify="between">
              <SrmFlex>
                <span class="srm-icon icon-other" />
                <SrmAttachmentButton
                  showTotal={true}
                  title={this.$T(
                    "sodr.workspace.model.common.mobileAttachmentUUID"
                  ).$D("外部附件-采购方")}
                  attachments={[
                    {
                      bucketName,
                      directory: bucketDirectory,
                      showInfo: true,
                      displayType: "list",
                      readonly: readOnly[1],
                      attachmentUuid: val || this.attachmentUuid,
                      uploadButton: readOnly[1] ? "none" : "fixed",
                    },
                  ]}
                  onFileUpload={() => {
                    const { poHeaderId, attachmentUuid } = item;
                    if (poHeaderId && !attachmentUuid) {
                      const params = {
                        poHeaderId,
                        uuidType: 1,
                        uuid: this.attachmentUuid,
                      };
                      saveAttachmentUUID(params).then((res) => {
                        const basicCurrent = dataSet.current;
                        if (isNumber(res) && !res.failed) {
                          basicCurrent.set(
                            "attachmentUuid",
                            this.attachmentUuid
                          );
                          basicCurrent.set("objectVersionNumber", res);
                        }
                      });
                    }
                  }}
                />
              </SrmFlex>
              <span class="srm-icon icon-chevron-right" />
            </SrmFlex>
          ,
        },
        {
          fieldType: "EMPTY",
          formRow: 30,
          fieldCode: "supplierAttachmentUuid",
          render: (val) =>
            <SrmFlex class="attachment" justify="between">
              <SrmFlex>
                <span class="srm-icon icon-other" />
                <SrmAttachmentButton
                  showTotal={true}
                  title={this.$T(
                    "sodr.workspace.model.common.mobileSupplierAttachmentId"
                  ).$D("外部附件-供应商")}
                  attachments={[
                    {
                      bucketName,
                      bucketDirectory,
                      showInfo: true,
                      displayType: "list",
                      readonly: readOnly[0],
                      uploadButton: readOnly[0] ? "none" : "fixed",
                      attachmentUuid: val || this.supplierAttachmentUuid,
                    },
                  ]}
                />
              </SrmFlex>
              <span class="srm-icon icon-chevron-right" />
            </SrmFlex>
          ,
        },
      ];
    },
  },
  mounted() {
    // if (this.permissionCodes.length) {
    //   await this.fetchPermissions();
    // }
  },
  methods: {
    fetchPermissions: async function () {
      const res = await getPermissions(this.permissionCodes);
      if (res && !res.failed) {
        this.permissionMap = res;
      }
    },
    onFileUpload(isInner) {
      return () => {
        const basicCurrent = this.dataSet.current;
        const { poHeaderId, purchaserInnerAttachmentUuid } = basicCurrent?.toData() || {};
        if (poHeaderId && !purchaserInnerAttachmentUuid) {
          const params = {
            poHeaderId,
            uuidType:isInner ? 3 : 1,
            uuid:isInner ? this.purchaserInnerAttachmentUuid : this.attachmentUuid,
          };
          if (isInner ? !this.dataSet?.current?.get("purchaserInnerAttachmentUuid") : !this.dataSet?.current?.get("attachmentUuid")) {
            saveAttachmentUUID(params).then((res) => {
              if (isNumber(res) && !res.failed) {
                if (isInner) {
                  basicCurrent.set(
                    "purchaserInnerAttachmentUuid",
                    this.purchaserInnerAttachmentUuid
                  );
                } else {
                  basicCurrent.set(
                    "attachmentUuid",
                    this.attachmentUuid
                  );
                }
                basicCurrent.set("objectVersionNumber", res);
              }
            });
          }
        }
      };
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
    align-content: space-evenly;
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
