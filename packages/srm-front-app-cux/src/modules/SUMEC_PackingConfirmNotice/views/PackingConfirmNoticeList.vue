<template>
  <div style="height: 100vh">
    <!-- 导航 -->
    <nav-head title="装箱/装柜通知确认" @goBack="goBack" @goClose="goBack"/>
    <!-- 列表 -->
    <SrmList style="height: calc(100vh - 44px)" :data-set="dataSet" :columns="getColumns()"
             @itemClick="goToDetail"/>
    <!-- <srm-list :data-source="dataSource" customize-code="SMBL.SUMEC.PACKINGCONFIRMATIONNOTICE.LIST" @onItemClick="goToDetail"/> -->
  </div>
</template>

<script>
import { DataSet } from "srm-mobile-ui";
import NavHead from "@/components/NavHead";
import PackingConfirmNoticeListDS from "../datasource/PackingConfirmNoticeListDS";

export default {
  modules: [ "smbl.common","spuc.common" ],
  name: "PackingConfirmNoticeList",
  components: { NavHead },
  data() {
    return {
      dataSet: new DataSet(PackingConfirmNoticeListDS()),
      // dataSource: PackingConfirmNoticeListDS(this),
    };
  },
  methods: {
    getColumns() {
      return [
        {
          fieldCode: "customHeader",
          fieldType: "EMPTY",
          render: (val, item) => {
            return <SrmListHeader>
              <span>{item.encasementNumber}</span>
              <span slot="right">{item.encasementHeaderStatusMeaning}</span>
            </SrmListHeader>;
          }
        },
        {
          fieldCode: "encasementHeaderStatusMeaning",
        },
        {
          fieldCode: "companyName",
        },
        {
          fieldCode: "supplierCompanyName",
        },
        {
          fieldCode: "containerNumber",
        },
        {
          fieldCode: "vessel",
        },
        {
          fieldCode: "invoiceNumber",
        },
        {
          fieldCode: "billLadingNumber",
        },
        {
          fieldCode: "contractNumber",
        },
        {
          fieldCode: "createdByName",
        },
        {
          fieldCode: "creationDate",
        },
      ];
    },
    //跳转详情页
    goToDetail(item) {
      this.$router.push({
        name: "PackingConfirmNoticeDetail",
        query: { packConfirmNoticeInfo: item.data },
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
