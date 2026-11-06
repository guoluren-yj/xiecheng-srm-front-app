<template>
  <div style="height: 100vh">
    <!-- 导航 -->
    <nav-head title="验收报告提交" @goBack="goBack" @goClose="goBack"/>
    <!-- 列表 -->
    <!-- <srm-list :data-source="dataSource" customize-code="SMBL.SUMEC.INSPECTNOTICE.LIST" @onItemClick="goToDetail"/> -->
    <SrmList style="height: calc(100vh - 44px)" :data-set="dataSet" :columns="getColumns()"
             @itemClick="goToDetail"/>
  </div>
</template>

<script>
import { DataSet } from "srm-mobile-ui";
import NavHead from "@/components/NavHead";
import InspectNoticeListDS from "../datasource/InspectNoticeListDS";

export default {
  modules: [ "smbl.common","hwfl.common","spuc.scheduleReleases" ],
  name: "InspectNoticeList",
  components: { NavHead },
  data() {
    return {
      dataSet: new DataSet(InspectNoticeListDS()),
      // dataSource: InspectNoticeListDS(this),
    };
  },
  methods: {
    getColumns() {
      return [
        {
          fieldCode: "inspectNoticeHeader",
          fieldType: "EMPTY",
          render: (val, item) => {
            return <SrmListHeader>
              <span>{item.qqcNum}</span>
              <span slot="right">{item.statusCodeMeaning}</span>
            </SrmListHeader>;
          }
        },
        {
          fieldCode: "currentNodeMeaning",
        },
        {
          fieldCode: "quantity",
        },
        {
          fieldCode: "qqcTypeMeaning",
        },
        {
          fieldCode: "productVendorName",
        },
        {
          fieldCode: "materialVendorName",
        },
        {
          fieldCode: "qaUserName",
        },
        {
          fieldCode: "businessUserName",
        },
        {
          fieldCode: "salePoNum",
        },
        {
          fieldCode: "reqDescription",
        },
        {
          fieldCode: "reqTime",

        },
      ];
    },
    onItemClick(item) {
      console.log(item);
    },
    //跳转详情页
    goToDetail(item) {
      this.$router.push({
        name: "InspectNoticeDetail",
        query: { inspectHeaderInfo: item.data },
      });
      // this.$store.commit("setTenderHallList", item);
    },
    // 退出子应用
    goBack() {
      try {
        closeWebView();
      } catch (err) {
        this.$router.back();
      }
    },
    //回到顶部
    goTop() {
      this.$refs.scroll.scrollTo(0, 0);
    },
  }
};
</script>

<style scoped lang="stylus">
</style>
