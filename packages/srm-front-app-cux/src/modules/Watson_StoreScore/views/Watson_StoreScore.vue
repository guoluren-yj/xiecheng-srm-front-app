<template>
  <div style="height: 100vh;">
    <srm-list :data-set="dataSet"
              :columns="getColumns"
              @itemClick="onItemClick">
      <div slot="searchLeft" class="srm-right-button" @click="goBack" >
        <span class="srm-icon icon-chevron-left" />
      </div>
    </srm-list>
  </div>
</template>

<script>
import uuid from "uuid";
import { DataSet, $T } from "srm-mobile-ui";
import indexDs from "../datasource/indexDs";
import { getDataByCeApi } from "../api";
import SrmTextarea from "@/components/V5/SrmTextarea";
import WatsonStoreScoreDetail from "./Watson_StoreScoreDetail";

export default {
  modules: [ "smbl.common", "scux.common", "sslm.common", "sinv.common", "hipspfm.common", "mallf.common" ],
  name: "WatsonStoreScore",
  components: {
    // eslint-disable-next-line vue/no-unused-components
    SrmTextarea,
    // eslint-disable-next-line vue/no-unused-components
    WatsonStoreScoreDetail
  },
  data() {
    return {
      dataSet: new DataSet(indexDs()),
      detailPop: false,
      scorePop: false,
    };
  },
  computed: {
    getColumns() {
      return [
        {
          fieldCode: "organizationName",
          fieldType: "EMPTY",
          render: (val) => <SrmListHeader>{val}</SrmListHeader>
        },
        {
          fieldCode: "projectName",
          fieldType: "EMPTY",
          render: (val, item) => `${item.attributeVarchar10 || ""}-${item.projectName || "s"}`
        },
        // {
        //   fieldCode: "remark",
        //   fieldType: "EMPTY",
        //   render: (val) => val
        // }
      ];
    }
  },
  methods: {
    onItemClick() {
      if (!this.dataSet.current.data.attributeVarchar10) {
        return;
      }
      this.$loading.show();
      let data = this.dataSet.current.data;
      // 先查询数据，然后封装好数据
      getDataByCeApi({
        attributeVarchar10: data.attributeVarchar10,
        orderScore: "N/A",
      }).then((res) => {
        let list = this.jsonByData(res.content);
        this.$loading.hide();
        if (list.length === 0) {
          this.$notification.open({
            message: $T("scux.common.view.message.noRateContent").$D("没有可打分的品类！"),
            duration: 1000,
          });
          return;
        }
        this.detailPop = this.$popup({
          title: data.attributeVarchar10,
          showHeader: true,
          showClose: true,
          showBack: true,
          height: "100vh",
          position: "right",
          onClose: () => {
            this.dataSet.refresh();
          },
          content: <WatsonStoreScoreDetail list={list} title={data.remark} attributeVarchar10={data.attributeVarchar10} onClose={this.closePopUp}/>
        });
      }).finally(() => {
        this.$loading.hide();
      });
    },
    jsonByData(list) {
      let dd = [];
      list.map((res) => {
        if (res.poLineList && res.poLineList.length > 0) {
          res.poLineList.map((item) => {
            dd.push({
              scoreNumber: res.scoreNumber || "",
              scoreType: "2",
              poHeaderId: res.poHeaderId || "",
              orderNumber: res.poNum || "",
              supplierId: res.supplierId || "",
              supplierCode: res.supplierCode || "",
              supplierName: res.supplierName || "",
              releaseDate: res.releasedDate || "",
              poLineId: item.poLineId || "",
              categorySecondary: item.categoryBySecondCode || "",
              categorySecondaryName: item.categoryBySecondName || "",
              categoryThree: item.categoryByThirdCode || "",
              categoryThreeName: item.categoryByThirdName || "",
              attachmentUuid: item.attachmentUUID || uuid(),
              remarks: "",
              orderScore: [ 0 ],
              orderScoreCopy: [ 0 ],
              fileList: [],
              organizationName: res.organizationName,
            });
          });
        }
      });
      return dd;
    },
    goBack() {
      this.$router.back();
    },
    closePopUp() {
      this.detailPop.closePopup();
      this.detailPop = false;
    },
  }
};
</script>

<style lang="stylus" scoped>
>>> .customize-item-field {
  .srm-list-item-card-head-left{
    max-width: 100% !important;
    white-space: pre-wrap !important;
  }
  .srm-list-item-card-head-right{
    min-width: 0px !important;
  }
}

>>> .srm-popup-header-title {
  flex-wrap: wrap;
  overflow: hidden;
}
</style>