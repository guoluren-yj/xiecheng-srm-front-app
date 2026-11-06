<template>
  <div style="height: 100vh">
    <srm-search
      v-model="queryParams"
      :placeholder="$T('scux.lngQualificationList.view.placeholder.input.queryparams').$D('请输入查询内容')"
      :field="queryField"
      :single-query-fields="true"
      @search="handleSearch"
      @clear="handleSearch"/>
    <srm-tab-bar display="justify">
      <srm-tab-item :label="$T('scux.lngQualificationList.view.tab.materialQualification').$D('物料资质')" code="materialQualification">
        <srm-list
          :data-set="materialQualificationListDataSet"
          :columns="getQualificationColumns"
          :scrollable="false"
          @itemClick="onMaterialItemClick"/>
      </srm-tab-item>
      <srm-tab-item :label="$T('scux.lngQualificationList.view.tab.manufacturer').$D('生产商')" code="manufacturer">
        <srm-list
          :data-set="manufacturerDataSet"
          :columns="manufacturerColumns"
          :scrollable="false"
          @itemClick="onManufacturerItemClick"/>
      </srm-tab-item>
      <srm-tab-item :label="$T('scux.lngQualificationList.view.tab.distributor').$D('物料资质')" code="distributor">
        <srm-list
          :data-set="distributorDataSet"
          :columns="distributorColumns"
          :scrollable="false"
          @itemClick="onDistributorItemClick"/>
      </srm-tab-item>
    </srm-tab-bar>
  </div>
</template>

<script>
import { DataSet, $T } from "srm-mobile-ui";
import debounce from "lodash/debounce";
import { materialQualificationList, manufacturerList, distributorList } from "../datasource/index";
import { fetchQualification } from "../api/index";
import { filterNullObject } from "../utils/index";
import MaterialQualification from "./MaterialQualification.vue";
import Distributor from "./Distributor.vue";

export default {
  modules: [ "scux.lngQualificationList", "hzero.common" ],
  name: "LNGQualificationList",
  data() {
    return {
      // tabs: [ $T("scux.lngQualificationList.view.tab.materialQualification").$D("物料资质"), $T("scux.lngQualificationList.view.tab.manufacturer").$D("生产商"), $T("scux.lngQualificationList.view.tab.distributor").$D("经销商") ],
      tabKey: 0,
      queryParams: {},
      queryField: [
        {
          fieldType: "LOV",
          fieldCode: "itemIds",
          fieldName: $T("scux.lngQualificationList.model.itemName").$D("物料"),
          lovCode: "SMDM.CUSTOMER_ITEM",
          options: {
            multiple: true,
            singleQueryFields: true,
          },
        },
        {
          fieldType: "LOV",
          fieldCode: "supplierCompanyId",
          fieldName: $T("scux.lngQualificationList.model.supplierCompanyId").$D("合作供应商"),
          lovCode: "SSLM.USER_AUTH.SUPPLIER",
          options: {
            singleQueryFields: true,
          },
        },
        {
          fieldType: "TEXT",
          fieldCode: "reserveName",
          fieldName: $T("scux.lngQualificationList.model.reserveName").$D("生产商"),
        }
      ],
      materialQualificationListDataSet: new DataSet(materialQualificationList()),
      manufacturerDataSet: new DataSet(manufacturerList()),
      distributorDataSet: new DataSet(distributorList()),
    };
  },
  computed: {
    getQualificationColumns() {
      return [ {
        fieldCode: "itemCode",
      }, {
        fieldCode: "itemName",
      }, {
        fieldCode: "itemCategoryName",
      }, {
        fieldCode: "specifications",
      }, {
        fieldCode: "sellByDate",
      }, {
        fieldCode: "reserveName",
      }, ];
    },
    manufacturerColumns() {
      return [ {
        fieldCode: "supplierCompanyNum",
        fieldType: "EMPTY",
        formRow:0,
        render: (val) => <SrmListHeader>
          <span> {val}</span>
        </SrmListHeader>,
      }, {
        fieldCode: "reserveName",
      }, {
        fieldCode: "supplierCompanyName",
      }, ];
    },
    distributorColumns() {
      return [ {
        fieldCode: "supplierCompanyNum",
        fieldType: "EMPTY",
        formRow:0,
        render: (val) => <SrmListHeader>
          <span> {val}</span>
        </SrmListHeader>,
      }, {
        fieldCode: "supplierCompanyName",
      }, ];
    }
  },
  methods: {
    // 页签切换展示对应的数据
    // onIndexChange(index) {
    //   console.log(index);
    //   this.tabKey = index;
    // },
    // 三个页签数据查询
    async handleFetchQualification(params = {}) {
      this.$loading.show();
      try {
        const response = await fetchQualification(params);
        if (response && !response.failed) {
          const { items, reserves, suppliers } = response;
          this.materialQualificationListDataSet.reset();
          this.materialQualificationListDataSet.setData(items);
          this.manufacturerDataSet.reset();
          this.manufacturerDataSet.setData(reserves);
          this.distributorDataSet.reset();
          this.distributorDataSet.setData(suppliers);
        }
      } finally {
        this.$loading.hide();
      }
    },
    /* eslint-disable */
    // 防抖搜索
    handleSearch: debounce(function() {
      const filterPrarms = filterNullObject(this.queryParams);
      if(Object.keys(filterPrarms).length !== 0) {
        this.handleFetchQualification(filterPrarms);
      } else {
          this.materialQualificationListDataSet.reset();
          this.materialQualificationListDataSet.setData([]);
          this.manufacturerDataSet.reset();
          this.manufacturerDataSet.setData([]);
          this.distributorDataSet.reset();
          this.distributorDataSet.setData([]);
      }
    }, 500),
    // 物料资质跳转查询
    onMaterialItemClick(item) {
      const { data: { itemId, itemName, reserveName } } = item || {};
      const params = { itemId, itemName, reserveName };
      this.$popup({
        title: $T("scux.lngQualificationList.view.title.materialQualification").$D("物料资质"),
        showHeader: true,
        showClose: true,
        showBack: true,
        height: "100vh",
        position: "bottom",
        content: <MaterialQualification params={params} keyComponent="materialQualification" />
      });
    },
    // 生产商跳转查询
    onManufacturerItemClick(item) {
      const { data: { reserveName, supplierCompanyName, supplierCompanyNum, reserveId } } = item || {};
      const params = { supplierCompanyName, supplierCompanyNum, reserveId, reserveName };
      this.$popup({
        title: $T("scux.lngQualificationList.view.tab.manufacturer").$D("生产商"),
        showHeader: true,
        showClose: true,
        showBack: true,
        height: "100vh",
        position: "bottom",
        content: <MaterialQualification params={params} keyComponent="manufacturer" />
      });
    },
    // 经销商跳转查询
    onDistributorItemClick(item) {
      const { data: { supplierCompanyId } } = item || {};
      const params = { supplierCompanyId };
      this.$popup({
        title: $T("scux.lngQualificationList.view.supplier.life").$D("供应商生命周期汇总查询"),
        showHeader: true,
        showClose: true,
        showBack: true,
        height: "100vh",
        position: "bottom",
        content: <Distributor params={params} />
      });
    }
  },
};
</script>