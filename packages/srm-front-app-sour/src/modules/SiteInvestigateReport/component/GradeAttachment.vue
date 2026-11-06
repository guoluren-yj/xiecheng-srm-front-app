<template>
  <div style="height: 521px">
    <srm-list customize-code=""
              :data-set="gradeAttachmentDataSet"
              :columns="getColumns()" :buttons="getListButtons" />
  </div>
</template>

<script>
import {
  saveGradeAttachment
} from "../api/index";
import { DataSet, SrmButton, SrmUtil, $T } from "srm-mobile-ui";
import { gradeAttachmentDS } from "../datasource/gradeAttachmentDS";

export default {
  modules: [ "hzero.common", "smbl.common", "sslm.siteInvestigateReport" ],
  name: "GradeAttachment",
  // mixins: [ gradeAttachmentDS ],
  props: {
    evalLineId: {
      type: String,
      default: "",
    },
    evalHeaderId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      gradeAttachmentDataSet: new DataSet(gradeAttachmentDS()),
      userInfo:{},
    };
  },
  computed:{
    //操作按钮
    getListButtons() {
      return [
        {
          text: this.$T("hzero.common.button.creat").$D("新建"),
          type: "primary",
          fill: true,
          visible: true,
          callback: () => {
            this.$attachment({
              attachments: [ { directory: "sslm-supplyAbility" } ],
              onFileUpload: this.onFileUpload
            });
          }
        },
        {
          text:this.$T("smbl.common.button.delete").$D("删除"),
          type: "danger",
          fill: true,
          visible: true,
          callback: () => {
            this.gradeAttachmentDataSet.removeSelect();
          }
        }
      ];
    },
  },
  async mounted() {
    this.userInfo = SrmUtil.getUserInfo();
    this.init();
  },
  methods: {
    init() {
      this.gradeAttachmentDataSet.addQueryParameter("evalLineId", this.evalLineId);
      this.gradeAttachmentDataSet.addQueryParameter("uploadUserId", this.userInfo.id);
      this.gradeAttachmentDataSet.refresh();
    },
    //监听文件变化,保存
    onFileUpload(file) {
      const data = [];
      data.push({
        attachmentName: file.fileName + "." + file.extension,
        attachmentUrl: file.fileUrl,
        evalHeaderId: this.evalHeaderId,
        evalLineId: this.evalLineId,
        loginName: this.userInfo.loginName,
        uploadUserId: this.userInfo.id,
        uploadUserName: this.userInfo.realName,
      });
      this.$loading.show();
      saveGradeAttachment(data).then((res) => {
        if (res && res.length > 0) {
          this.init();
        }
      }).catch((e) => {
        console.info(e);
      }).finally(() => {
        this.$loading.hide();
      });
    },
    //下载
    downLoad(item) {
      const downLoadUrl = SrmUtil.buildImgUrl(item.attachmentUrl, SrmUtil.getDefaultBucketName());
      let flag = SrmUtil.downloadFile(downLoadUrl);
      if (!flag) {
        this.$copyText(downLoadUrl).then(() => {
          this.$notification.open({ message: this.$T("smbl.common.message.app.download.forbid").$D("已为您复制下载链接，请使用手机浏览器进行下载，当前App禁止下载") });
        }, () => {
          this.$notification.open({ message: this.$T("smbl.common.view.copy.error").$D("复制失败") });
        });
      }
    },
    //判断是否可预览
    judgeCanPreview(attachmentName) {
      return SrmUtil.judgePreview(attachmentName
        .split(".")
        .reverse()[0]
        .toLowerCase());
    },
    //预览
    preview(item) {
      console.info(item);
      const file = {
        fileName:item.attachmentName,
        fileUrl:item.attachmentUrl,
        bucketName:SrmUtil.getDefaultBucketName(),
      };
      SrmUtil.previewFile(file);
    },
    getColumns() {
      return [
        {
          formRow: 5,
          seq: 10,
          fieldCode: "header",
          fieldType: "EMPTY",
          render: (val, item) => <SrmListHeader>
            <SrmButton plain rect style={{ fontWeight: "bold" }}
              type="primary">
              {item.uploadUserName}
            </SrmButton>
          </SrmListHeader>
        },
        {
          formRow: 10,
          seq: 10,
          fieldCode: "uploadUserName",
        },
        {
          formRow: 20,
          seq: 10,
          fieldCode: "attachmentName",
        },
        {
          formRow: 30,
          seq: 10,
          fieldCode: "uploadTime",
        },
        {
          formRow: 40,
          seq: 10,
          fieldCode: "remark",
        },
        {
          formRow: 1000,
          fieldCode: "bottom",
          fieldType: "EMPTY",
          render: (val, item) => <div style="display:flex">
            <SrmButton slot="right" style={{ fontWeight: "bold" }} fill type="primary" onClick={() => this.downLoad(item)}>{$T("smbl.common.view.button.download}").$D("下载")}</SrmButton>
            {this.judgeCanPreview(item.attachmentName) && <SrmButton slot="right" onClick={() => this.preview(item)} style={{ fontWeight: "bold", marginLeft:"5px" }} type="primary">{$T("smbl.common.message.preview}").$D("预览")}</SrmButton>}
          </div>
        },
      ];
    }
  }
};

</script>

<style lang="stylus" scoped>

@import "~srm-mobile-ui/src/style/var.styl"

</style>
