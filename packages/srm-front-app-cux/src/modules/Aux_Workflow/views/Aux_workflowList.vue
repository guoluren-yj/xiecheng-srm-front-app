<template>
  <div style="height: 100vh">
    <!-- 导航 -->
    <NavHead :title="$T('ssrc.inquiryHall.view.message.title.inquiryHall').$D('寻源大厅')" @goBack="goBack" />

    <SrmList :data-set="dataSet" :columns="getColumns()" @itemClick="goToDetail"/>
  </div>
</template>

<script>

// import { closeWebView } from "@/utils/jsBridge";
// eslint-disable-next-line rulesdir/check_modules
import indexDS from "../datasource/indexDS";
import { DataSet, JsBridge } from "srm-mobile-ui";
import NavHead from "@/components/NavHead";

export default {
  modules: [ "ssrc.inquiryHall","sprm.common","hipspfm.common","hwfp.common" ],
  name: "RfxHallList",
  components: {
    NavHead,
  },
  data() {
    return {
      dataSource: indexDS(this),
      dataSet: new DataSet(indexDS(this)),
    };
  },
  activated() {
    this.dataSet.refresh();
  },
  methods: {
    getColumns() {
      return [
        // {
        //   fieldName: "流程分类",
        //   fieldCode: "modelIdMeaning",
        //   labelCode: "",
        // },
        {
          fieldName: "申请人",
          fieldCode: "creatorName",
          langCode: "sprm.common.model.common.prRequestedName",
        },
        {
          fieldName: "创建时间",
          fieldCode: "createTime",
          langCode: "hipspfm.common.message.createTime",
        },
        {
          fieldName: "流程名称",
          fieldCode: "docSubject",
          langCode: "hwfp.common.model.process.name",
        },
        {
          fieldName: "实例ID",
          fieldCode: "processId",
          langCode: "",
        }
      ];
    },
    goToDetail(item) {
      const { data: { processId } } = item;

      this.$router.push({
        name: "Aux_workflowDetail",
        query: { processInstanceId: processId },
      });
    },
    // 退出子应用
    goBack() {
      this.$router.back();
    },
  },
};
</script>

<style lang="stylus" scoped>

</style>
