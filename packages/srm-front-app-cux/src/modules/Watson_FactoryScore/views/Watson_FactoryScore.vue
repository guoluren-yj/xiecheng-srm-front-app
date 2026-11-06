<template>
  <div style="height: 100vh;">
    <srm-list :data-set="dataSet" :columns="getColumns" @itemClick="onItemClick">
      <div slot="searchLeft" class="srm-right-button" @click="goBack" >
        <span class="srm-icon icon-chevron-left" />
      </div>
    </srm-list>
  </div>
</template>

<script>
import uuid from "uuid";
import { DataSet } from "srm-mobile-ui";
import { indexDs, templateDs } from "../datasource/indexDs";
import { getSupplierDataApi } from "../api";
import WatsonFactoryScore from "./Watson_FactoryScoreDetail";

export default {
  modules: [ "smbl.common", "hipspfm.common", "scux.common", "sslm.common", "sinv.common", "ssrc.bidHall" ],
  name: "WatsonStoreScore",
  components: {
    // eslint-disable-next-line vue/no-unused-components
    WatsonFactoryScore
  },
  data() {
    return {
      dataSet: new DataSet(indexDs()),
      templateDataSet: new DataSet(templateDs()),
      type: "supplier",
      supplierObj: {},
      listPop: false,
      detailPop: false,
      scorePop: false,
    };
  },
  computed: {
    getColumns() {
      return [
        {
          fieldCode: this.type === "supplier" ? "companyName" : "secondCategoryName",
          fieldType: "EMPTY",
          render: (val) => <SrmFlex justify="between">
            <span>{val}</span>
          </SrmFlex>
        },
      ];
    }
  },
  methods: {
    onItemClick(record) {
      if (this.type === "supplier") {
        this.supplierObj = { ...record.data };
        this.templateDataSet.refresh();
        this.type = "";
        this.listPop = this.$popup({
          title: this.supplierObj.companyName,
          showHeader: true,
          showClose: true,
          showBack: true,
          height: "100vh",
          position: "right",
          onClose: () => {
            this.type = "supplier";
            this.templateDataSet.refresh();
          },
          content: <div style="height: 100vh;">
            <srm-list data-set={this.templateDataSet}
              columns={this.getColumns}
              onItemClick={(r) => {
                this.onItemClick(r);
              }}/>
          </div>
        });
        return;
      }
      let data = { ...record.data };
      // 先查询数据，然后封装好数据
      this.$loading.show();
      getSupplierDataApi({
        secondCategoryCode: data.secondCategoryCode,
        storeTemplate: "0",
        status: "1",
      }).then((res) => {
        let list = this.jsonByData(res.content);
        this.$loading.hide();
        this.detailPop = this.$popup({
          title: `${this.supplierObj.companyName.slice(0, 18)}${this.supplierObj.companyName.length > 18 ? "..." : ""}-${data.secondCategoryName}`,
          showHeader: true,
          showClose: true,
          showBack: true,
          height: "100vh",
          position: "right",
          onClose: () => {
            this.type = "";
            this.templateDataSet.refresh();
          },
          content: <WatsonFactoryScore list={list} title={`${this.supplierObj.companyName}-${data.secondCategoryName}`} onClose={this.closePopUp}/>
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
      this.listPop.closePopup();
      this.listPop = false;
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

.srm-right-button {
  img {
    margin-right: 12px;
    height: 24px;
    width: 24px;
  }
}
</style>