<template>
  <srm-popup :visible.sync="popFlag" width="100%" height="100%" :title="$T('sslm.siteInvestigateReport.modal.common.gradeAttachment').$D('评分附件')">
    <srm-list v-if="dataSet" :data-set="dataSet" :columns="getColumns" style="padding-bottom: 72px;" />
    <srm-bottom-handler v-if="canEdit" :btn-arr="bottomButtons"/>
  </srm-popup>
</template>

<script>
import { scoreAttachmentDS } from "../datasource/ScoreAttachmentDS";
import { DataSet, SrmUtil } from "srm-mobile-ui";
export default {
  modules: [ "sslm.siteInvestigateReport", "smbl.common", "sslm.commonApplication", "sslm.common", "hzero.common" ],
  name: "ScorerAttchmentView",
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    evalLineId: null,
    evalHeaderId: null,
    canEdit: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      dataSet: null,
      popFlag: false,
    };
  },
  computed: {
    getColumns() {
      return [ {
        fieldCode: "attachmentName",
      }, {
        fieldCode: "uploadUserName",
      }, {
        fieldCode: "uploadTime",
      }, {
        fieldCode: "remark",
        editor: this.canEdit,
      }, {
        fieldCode: "delete",
        fieldType: "EMPTY",
        render: (val, item, v, record) => <srm-flex justify="end" style="padding: 0px 15px;">
          {this.canEdit ? <srm-button class="att-button" size="mid" bordered type="danger" onClick={() => {
            this.dataSet.removeRecords([ record ]);
          }}>{this.$T("smbl.common.button.delete").$D("删除")}</srm-button> : null}
          <srm-button class="att-button" size="mid" bordered onClick={() => {
            this.$downloadFile(item.attachmentUrl, SrmUtil.getDefaultBucketName(), "sslm-report");
          }}>{this.$T("smbl.common.view.button.download").$D("下载")}</srm-button>
          <srm-button class="att-button" size="mid" bordered onClick={() => {
            SrmUtil.previewFile({
              fileName: item.attachmentName,
              fileUrl: item.attachmentUrl,
              bucketName: SrmUtil.getDefaultBucketName(),
            });
          }}>{this.$T("hzero.common.preview").$D("预览")}</srm-button>
        </srm-flex>,
      } ];
    },
    bottomButtons() {
      return [
        {
          title: this.$T("smbl.common.view.add").$D("新建"),
          handler: () => {
            this.$attachment({
              attachments: [ { directory: "sslm-report", readonly:true } ],
              //监听文件变化
              onFileListChange: () => {
              },
              onFileUpload: (e) => {
                this.dataSet.create({
                  attachmentName: e.fileName + "." + e.extension,
                  attachmentUrl: e.fileUrl,
                  uploadTime: e.creationDate,
                  uploadUserId: SrmUtil.getUserInfo().id,
                  uploadUserName: SrmUtil.getUserInfo().realName,
                  evalHeaderId: this.evalHeaderId,
                  createdBy: SrmUtil.getUserInfo().id,
                  remark: null,
                }, 0);
              }
            });
          },
        },
        {
          title: this.$T("smbl.common.view.save").$D("保存"),
          fill: true,
          handler: () => {
            this.dataSet.submit();
          },
        }
      ];
    },
  },
  watch: {
    value(newVal) {
      if (newVal) {
        this.dataSet = new DataSet(scoreAttachmentDS(this.evalLineId, this.evalHeaderId));
        this.dataSet.editFlag = false;
        this.dataSet.reset();
        this.popFlag = true;
        this.dataSet.refresh();
      }
    },
    popFlag(newVal) {
      if (!newVal) {
        this.$emit("input", false);
      }
    }
  },
  beforeMount() {
  },
  methods: {
    deleteItem(record) {
      this.dataSet.removeRecords([ record ]);
    }
  }
};
</script>

<style lang="stylus" scoped>
.att-button {
  margin-left: 8px;
}
</style>
