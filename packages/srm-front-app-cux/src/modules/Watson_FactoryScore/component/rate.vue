<template>
  <div style="width: 100%">
    <srm-checkbox-group v-model="checkScore"
                        class="override-check-group-2"
                        :selection="1"
                        content-selectable>
      <srm-checkbox :option="Number(0)">N/A</srm-checkbox>
      <srm-checkbox :option="Number(1)">1</srm-checkbox>
      <srm-checkbox :option="Number(2)">2</srm-checkbox>
      <srm-checkbox :option="Number(3)">3</srm-checkbox>
      <srm-checkbox :option="Number(4)">4</srm-checkbox>
      <srm-checkbox :option="Number(5)">5</srm-checkbox>
    </srm-checkbox-group>
    <div style="border-bottom: 8px solid #f5f5f5;">
      <p class="score-word">{{ $T("scux.common.view.message.button.rate").$D("评价") }}</p>
      <srm-textarea-field v-model="remarks"
                          style="padding-left: 15px; padding-top: 8px;"
                          :placeholder="$T('scux.common.view.message.placeholder.rateContent').$D('请输入评价内容')"/>
    </div>
    <div>
      <p class="score-word">{{ $T("sslm.common.model.evaluation.attachment").$D("附件") }}</p>
      <srm-attachment
        v-if="attachmentUuid"
        :attachment-uuid="attachmentUuid"
        display-type="grid"
        :cols="3"
        @fileListChange="onFileListChange"/>
    </div>
  </div>
</template>

<script>
import uuid from "uuid";
export default {
  modules: [ "scux.common", "sslm.common" ],
  props: {
    data: {
      type: Object
    }
  },
  data() {
    return {
      item: {},
      // 初始评分
      initScore: 0,
      checkScore: [],
      remarks: "",
      attachmentUuid: uuid(),
      fileList: [],
    };
  },
  watch: {
    checkScore: {
      handler(val) {
        if (this.initScore !== val[0]) {
          this.attachmentUuid = null;
          this.remarks = "";
          this.fileList = [];
          setTimeout(() => {
            this.attachmentUuid = uuid();
          }, 0);
        }
        this.initScore = val[0];
        this.$emit("saveRate", {
          indexScore: val,
          indexScoreCopy: [ ...val ],
          remarks: this.remarks,
          attachmentUuid: this.attachmentUuid,
          fileList: this.fileList
        });
      },
      deep: true,
    },
    remarks: {
      handler(val) {
        if (val) {
          this.$emit("saveRate", {
            indexScore: this.checkScore,
            indexScoreCopy: [ ...this.checkScore ],
            remarks: val,
            attachmentUuid: this.attachmentUuid,
            fileList: this.fileList
          });
        }
      },
      deep: true,
    },
    attachmentUuid: {
      handler(val) {
        if (val) {
          this.$emit("saveRate", {
            indexScore: this.checkScore,
            indexScoreCopy: [ ...this.checkScore ],
            remarks: this.remarks,
            attachmentUuid: val,
            fileList: this.fileList
          });
        }
      },
      deep: true,
    },
    fileList: {
      handler(val) {
        if (val) {
          this.$emit("saveRate", {
            indexScore: this.checkScore,
            indexScoreCopy: [ ...this.checkScore ],
            remarks: this.remarks,
            attachmentUuid: this.attachmentUuid,
            fileList: val
          });
        }
      },
      deep: true,
    }
  },
  mounted() {
    this.item = { ...this.data };
    this.initScore = this.item["indexScore"][0];
    this.checkScore = [ this.item["indexScore"][0] ];
    this.fileList = this.item["fileList"];
    this.attachmentUuid = this.item["fileList"].length === 0 ? uuid() : this.item["attachmentUuid"];
    this.remarks = this.item["remarks"];
  },
  methods: {
    //监听文件变化
    onFileListChange(fileList) {
      this.fileList = fileList;
    },
  }
};
</script>

<style lang="stylus" scoped>
.override-check-group-2 {
  flex-direction: row;
  padding: 24px 0px 24px 19px;
  >>> .srm-check-box-content {
    margin-left: 6px;
    font-size: 14px;
  }
  border-bottom: 8px solid #f5f5f5;
}
.score-word {
  height: 32px;
  display: flex;
  align-items: center;
  padding-left: 15px;
  font-size: 12px;
  color: #333333;
  border-bottom: 1px solid #f5f5f5;
}
</style>