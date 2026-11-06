<template>
  <div style="width: 100%; height: 100vh;">
    <nav-head :title="$T('smbl.common.view.title.packingMaterialManage').$D('包材管理')"/>
    <srm-list :columns="getColumns()" :data-set="dataSet" @itemClick="onItemClick" />
  </div>
</template>

<script>
import NavHead from "@/components/NavHead";
import { DataSet } from "srm-mobile-ui";
import packingMaterialsManageDatasource from "../datasource/XBPackingMaterialsManageDS";

export default {
  modules: [ "smbl.common" ],
  name: "XBPackingMaterialManage",
  components: {
    NavHead,
  },
  data() {
    return {
      dataSet: new DataSet(packingMaterialsManageDatasource()),
      subCompany: {},
    };
  },
  beforeMount() {
    this.dataSet.addQueryParameter("supplierTenantId", localStorage.getItem("organizationId"));
  },
  methods: {
    getColumns() {
      return [ {
        fieldType: "EMPTY",
        render: (val, item) => {
          return (
            <div class="content-item">
              <div class="asn-num">{item.asnNum}</div>
              <div class="supplier-company-name">{item.supplierCompanyName}</div>
            </div>
          );
        },
      }, ];
    },
    onItemClick(item) {
      this.$router.push({
        path: "/XBPackingMaterialsDetail",
        query: { asnHeaderId: item.data.asnHeaderId },
      });
    }
  },
};
</script>

<style lang="stylus" scoped>
.content-item {
  width: 100%;
  .asn-num {
    font-size: 16px;
    color: var(--color-font-default);
    line-height: 22px;
  }
  .supplier-company-name {
    font-size: 14px;
    color: var(--font-color-disable);
    line-height: 20px;
    margin-top: 2px;
  }
}
.search-button {
  height: 40px;
  border-radius: 8px;
  margin: 12px 15px 0 15px;
  width: auto;
  .left {
    color: var(--color-font-default);
    font-size: 12px;
    font-weight: bold;
  }
}
</style>
