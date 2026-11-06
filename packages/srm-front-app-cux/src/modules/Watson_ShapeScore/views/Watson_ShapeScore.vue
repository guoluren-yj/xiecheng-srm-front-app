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
import { DataSet } from "srm-mobile-ui";
import { indexDs, kindDs } from "../datasource/indexDs";
import { getScoreDataApi } from "../api";
import WatsonShapeScoreDetail from "./Watson_ShapeScoreDetail";

export default {
  modules: [ "smbl.common", "ssrc.bidHall", "scux.common", "sslm.common", "sinv.common", "hipspfm.common" ],
  name: "WatsonShapeScore",
  components: {
    // eslint-disable-next-line vue/no-unused-components
    WatsonShapeScoreDetail
  },
  data() {
    return {
      dataSet: new DataSet(indexDs()),
      kindSet: new DataSet(kindDs()),
      supplierObj:{},
      detailPop: false,
      kindPop: false,
      scorePop: false,
      comFlag: true,
    };
  },
  computed: {
    getColumns() {
      return [
        {
          fieldCode: this.comFlag ? "companyName" : "secondCategoryName",
          fieldType: "EMPTY",
          render: (val) => <SrmFlex justify="between">
            <span>{val}</span>
          </SrmFlex>
        }
      ];
    }
  },
  methods: {
    onItemClick(record) {
      //判断当前是第几层
      if (this.comFlag) {
        this.supplierObj = { ...record.data };
        this.comFlag = false;
        this.kindPop = this.$popup({
          title: `${this.supplierObj.companyName.slice(0, 18)}${this.supplierObj.companyName.length > 18 ? "..." : ""}`,
          showHeader: true,
          showClose: true,
          showBack: true,
          height: "100vh",
          position: "right",
          onClose: () => {
            this.comFlag = true;
          },
          content: <div style="height: 100vh;">
            <srm-list data-set={this.kindSet}
              columns={this.getColumns}
              onItemClick={(r) => {
                this.onItemClick(r);
              }}/>
          </div>
        });
        return;
      }
      //点击品类
      let kdata = { ...record.data };
      // 先查询数据，然后封装好数据
      this.$loading.show();
      getScoreDataApi({
        secondCategoryCode: kdata.secondCategoryCode,
        storeTemplate: "1",
        status: "1"
      }).then((res) => {
        let list = this.jsonByData(res.content);
        this.$loading.hide();
        this.detailPop = this.$popup({
          title: `${this.supplierObj.companyName}-${kdata.secondCategoryName}`,
          showHeader: true,
          showClose: true,
          showBack: true,
          height: "100vh",
          position: "right",
          onClose: () => {
            this.comFlag = false;
          },
          content: <WatsonShapeScoreDetail list={list} title={`${this.supplierObj.companyName}-${kdata.secondCategoryName}`} onClose={this.closePopUp}/>
        });
      }).finally(() => {
        this.$loading.hide();
      });
    },
    goBack() {
      this.$router.back();
    },
    closePopUp() {
      this.detailPop.closePopup();
      this.detailPop = false;
      this.kindPop.closePopup();
      this.kindPop = false;
    },
    jsonByData(list) {
      let dd = [];
      list.map((res) => {
        dd.push({
          provisionId: res.provisionId,
          supplierId: this.supplierObj.supplierCompanyId || "",
          supplierCode: this.supplierObj.companyNum || "",
          supplierName: this.supplierObj.companyName || "",
          tenantId: res.tenantId || "",
          secondCategoryId: res.secondCategoryId || "",
          secondCategoryCode: res.secondCategoryCode || "",
          secondCategoryName: res.secondCategoryName || "",
          categoryScore: res.categoryScore || "", // 指标得分
          indexCode: res.indexCode || "",
          indexName: res.indexName || "",
          indexScore: [ 0 ], // 品类得分
          indexScoreCopy: [ 0 ],
          remarks: res.remarks || "",
          attachmentUuid: res.attachmentUuid || uuid(),
          rater: res.rater || "",
          scoreDate: res.scoreDate,
          storeTemplate: res.storeTemplate,
          fileList: [],
        });
      });
      return dd;
    }
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