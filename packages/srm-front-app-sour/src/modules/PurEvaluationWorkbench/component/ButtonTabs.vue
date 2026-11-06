<!-- 查看评分人，评分要素维度，评分人按钮组组件 -->
<template>
  <div style="width: 100%;">
    <srm-flex style="overflow-x: auto">
      <div v-for="(data, index) in evalRespsInfo.evalResps" :key="index" class="srm-line-button">
        <srm-button
          size="mini"
          :type="activiteTab === index ? 'primary' : 'info'"
          @click="onClick(data, index)">
          <span v-if="data.completeFlag === 4">
            {{ data.realName }} {{ $T("sslm.purchaserEvaluationDetail.table.column.label.abandon").$D("已放弃") }}
          </span>
          <span v-else>
            {{ averageFlag ? `${data.realName} ${data.score || 0}${unitName}` : `${data.realName}(${data.respWeight}%) ${data.score || 0}${unitName}` }}
          </span>
        </srm-button>
      </div>
    </srm-flex>
    <div class="srm-line-division"/>
    <srm-flex style="width: 100%;">
      <div style="min-height: 20px; margin-top: 10px;">
        <customize :columns="getColumns" :data-source="evalRespsInfo.scoreInfo" />
      </div>
    </srm-flex>
  </div>
</template>

<script>
import { isNil } from "lodash";

export default {
  modules: [ "smbl.common", "sslm.purchaserEvaluationDetail", "hzero.common", "sslm.common" ],
  name: "ButtonTabs",
  props:{
    basicInfo: {
      type: Object,
      default: () => {},
    },
    // 行数据
    record: {
      type: Object,
      default: () => {},
    },
    label: {
      type: String,
      default: "",
    }
  },
  data() {
    const { averageFlag } = this.basicInfo || {};
    return {
      averageFlag: averageFlag, // 平均式计算标识
      activiteTab: 0,
      unitName: this.$T("smbl.common.view.message.points").$D("分"),
    };
  },
  computed:{
    getColumns() {
      const columns = [
        {
          fieldName: this.$T("sslm.purchaserEvaluationDetail.table.column.label.score").$D("得分"),
          fieldCode: "score",
          fieldType: "TEXT",
          visible:() => this.evalRespsInfo.indicatorType === "SCORE",
        },
        {
          fieldName: this.$T("sslm.purchaserEvaluationDetail.table.column.label.isVeto").$D("否决该项"),
          fieldCode: "isVeto",
          fieldType: "TEXT",
          visible:() => this.evalRespsInfo.indicatorType === "VETO",
          render: (val, record) => isNil(record.isVeto) ? "" : record.isStandard ? this.$T("smbl.common.view.yes").$D("是") : this.$T("smbl.common.view.no").$D("否") || "",
        },
        {
          fieldName: this.$T("sslm.purchaserEvaluationDetail.table.column.label.isStandard").$D("符合评分标准"),
          fieldCode: "isStandard",
          fieldType: "TEXT",
          visible:() => this.evalRespsInfo.indicatorType === "TICK",
          render: (val, record) => isNil(record.isStandard) ? "" : record.isStandard ? this.$T("smbl.common.view.yes").$D("是") : this.$T("smbl.common.view.no").$D("否") || "",
        },
        {
          fieldName: this.$T("sslm.purchaserEvaluationDetail.table.column.label.indOptName").$D("评分选项"),
          fieldCode: "indOptName",
          fieldType: "TEXT",
          visible:() => this.evalRespsInfo.indicatorType === "OPT",
        },
        {
          fieldName: this.$T("hzero.common.remark").$D("备注"),
          fieldCode: "respRemarks",
        },
        {
          fieldCode: "scoreAttachmentUuid",
          fieldType: "UPLOAD",
          fieldName: this.$T("hzero.common.upload.modal.title").$D("附件"),
        },
      ];
      return columns;
    },
    evalRespsInfo () {
      const { evalResps, indicatorType } = this.record || {};
      // 切换指标，自动定位到第一个打分人信息
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.activiteTab = 0;
      return {
        evalResps,
        indicatorType,
        scoreInfo: evalResps && evalResps[0] || {}, // 默认显示第一个打分人信息
      };
    },
  },
  methods: {
    onClick(data, index) {
      this.activiteTab = index;
      this.evalRespsInfo.scoreInfo = data;
      this.$emit("itemClick", data, index);
    },
    // 附件回调
    handleAttachment(record, readonly) {
      this.$attachment({
        attachments: [
          {
            attachmentUuid: record.scoreAttachmentUuid,
            title: this.$T("smbl.common.message.title.viewAttachment").$D("查看附件"),
            readonly: readonly, // 隐藏删除按钮
            showInfo: true,
            uploadButton: readonly ? "none" : "default", // 上传按钮
          },
        ],
      });
    },
  }
};
</script>

<style lang="stylus" scoped>
.srm-line-button {
  margin-right: 8px;
  >>>.srm-button-mini {
    padding: 4px 8px;
  }
}
.srm-line-division {
  height: 1px;
  background: #F6F6F6;
  width: 100%;
  margin: 8px 0;
}
</style>
