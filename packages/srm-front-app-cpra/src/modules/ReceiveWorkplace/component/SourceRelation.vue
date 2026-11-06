<template>
  <srm-list customize-code=""
            :data-set="sourceRelationDataSet"
            :columns="getSourceRelationColumns()"
            @itemClick="onListItemClick">
    <srm-flex v-if="steps.length!==0" slot="filter" direction="column">
      <srm-step-progress justify="start" :steps="steps" @indexChange="onIndexChange"/>
      <srm-blank size="1px" theme="fill"/>
    </srm-flex>
  </srm-list>
</template>

<script>

import { DataSet } from "srm-mobile-ui";
import { sourceRelationDs } from "@/modules/ReceiveWorkplace/datasource/sourceRelationDS";
import { getReceiveNodeInfo } from "../api";
import SourceRelationColumns from "../mixins/SourceRelationColumns";
export default {
  modules: [ "sinv.receiptWorkbench", "sinv.receiptExecution", "sinv.receipWorkbench" ],
  name: "SourceRelation",
  mixins: [ SourceRelationColumns ],
  props: {
    sourceHeaderNum: {
      type: String,
      default: "",
    },
    sourceLineNum: {
      type: String,
      default: "",
    },
    strategyHeaderId: {
      type: String,
      default: "",
    },
    hidePriceFlag:{
      type: Number,
    },
    isDoubleUnit:{
      type: Number,
    }
  },
  data() {
    return {
      sourceRelationDataSet:new DataSet(sourceRelationDs(this.isDoubleUnit)),
      // nodeSeq:1,nodeDes:"接收",nodeState:-1 } ,{ nodeSeq:2,nodeDes:"入库",nodeState:0
      steps:  [],
    };
  },
  async mounted() {
    await this.fetchCategoryList();
    let activeIndex = this.steps.findIndex((i) => i.nodeState === 0);
    if (activeIndex === -1) {
      activeIndex === 0;
    }
    const firstStep = this.steps[activeIndex];
    if (!firstStep) {
      return;
    }
    this.sourceRelationDataSet.addQueryParameter("nodeConfigId", firstStep.nodeConfigId);
    this.sourceRelationDataSet.addQueryParameter("sourceHeaderNum", this.sourceHeaderNum);
    this.sourceRelationDataSet.addQueryParameter("sourceLineNum", this.sourceLineNum);
    this.sourceRelationDataSet.refresh();
  },
  methods: {
    //打开详情弹窗
    onListItemClick(item) {
      // this.detailPopup = this.$popup({
      //   title: item.data.displayTrxHeaderAndLineNum,
      //   showHeader: true,
      //   showClose: true,
      //   position: "bottom",
      //   showBack: true,
      //   height: "565px",
      //   rounded:true,
      //   content: <SrmForm
      //     style={{ padding: "0 15px" }}
      //     customizeType="detail"
      //     customizeCode=""
      //     dataSet={this.sourceRelationDataSet}
      //     columns={this.getSourceRelationDetailColumns()}
      //     onDelete={() => this.detailPopup.closePopup()}
      //     onUpdate={() => this.detailPopup.closePopup()}
      //     onSubmit={() => this.detailPopup.closePopup()}
      //   />,
      // });
    },
    //切换按钮处理
    onIndexChange(index, oldIndex) {
      console.info(index, oldIndex);
      if (!oldIndex) {
        return;
      }
      console.info(oldIndex.nodeConfigId, this.sourceHeaderNum, this.sourceLineNum);
      this.sourceRelationDataSet.addQueryParameter("nodeConfigId", oldIndex.nodeConfigId);
      this.sourceRelationDataSet.addQueryParameter("sourceHeaderNum", this.sourceHeaderNum);
      this.sourceRelationDataSet.addQueryParameter("sourceLineNum", this.sourceLineNum);
      this.sourceRelationDataSet.refresh();
    },
    async fetchCategoryList() {
      const param = {
        sourceHeaderNum: this.sourceHeaderNum,
        sourceLineNum: this.sourceLineNum,
        strategyHeaderId: this.strategyHeaderId
      };
      this.$loading.show();
      await getReceiveNodeInfo(param).then((res) => {
        if (res && !res.failed) {
          res.forEach((item, index) => {
            let nodeState;
            //-1 已完成当前节点，0执行中当前节点，1未到达当前节点
            if (item.quantityPercent === 1) {
              nodeState = -1;
            } else if (item.quantityPercent === 0) {
              nodeState = 1;
            } else {
              nodeState = 0;
            }
            const step = {
              nodeSeq:index + 1,
              nodeDes:item.nodeConfigName,
              nodeState: nodeState,
              ...item
            };
            this.steps.push(step);
          });
        }
        console.log(this.steps, "this.steps.");
      }).finally(() => {
        this.$loading.hide();
      });
    }
  }
}
;
</script>

<style lang="stylus" scoped>

@import "~srm-mobile-ui/src/style/var.styl"

</style>
