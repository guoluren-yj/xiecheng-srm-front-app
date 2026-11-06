<template>
  <div style="height: 100vh">
    <nav-head :title="$T('sslm.supplierManage.view.message.title').$D('生命周期查询')" @goBack="goBack" />
    <srm-list :data-set="dataSet"
              customize-code="SMBL.SUPPLIER_LIFE_CYCLE.LIST"
              :columns="getColumns"
              @itemClick="goToDetail">
      <srm-tab-bar v-if="lifeCycleStageLanesDes.length > 0"
                   slot="filter"
                   :tabs="lifeCycleStageLanesDes"
                   display="justify"
                   @indexChange="onTabIndexChange"/>
    </srm-list>
  </div>
</template>

<script>

import indexDS from "../datasource/indexDS";
import { DataSet, SrmUtil } from "srm-mobile-ui";
import { getNavApi } from "../api/index";

export default {
  modules: [ "hipspfm.common", "sodr.receivedOrder", "sodr.sendOrder", "smbl.common", "hipspfm.receivedOrder", "sslm.common", "sslm.supplierManage" ],
  name: "MyReceiveOrderList",
  components: {
  },
  data() {
    return {
      dataSet: new DataSet(indexDS()),
      lifeCycleStageLanes: [], //菜单信息
      lifeCycleStageLanesDes: [], //菜单名称
    };
  },
  computed: {
    getColumns() {
      return [
        {
          formRow: 0,
          fieldCode: "supplierCompanyNum",
          fieldType: "EMPTY",
          render: (val, item) => <SrmListHeader>
            <span>{item.supplierCompanyNum}</span>
            {
              item.authorizeFlag === 1 && <span slot="right" class="srm-span-right-unCheck srm-span-right-blue-name">{ this.$T("sslm.supplierManage.model.supplierManage.specialSupplier").$D("特准供应商") }</span>
            }
            {
              item.blacklistFlag === 1 && <span slot="right" class="srm-span-right-unCheck srm-span-right-black-name">{ this.$T("sslm.supplierManage.model.supplierManage.blacklistFlag").$D("黑名单供应商") }</span>
            }
          </SrmListHeader>
        },
        {
          fieldName: this.$T("sslm.common.view.supplier.supplierCompany").$D("供应商"),
          fieldCode: "supplierCompanyName",
        },
        {
          fieldName: this.$T("sslm.common.view.company.name").$D("公司"),
          fieldCode: "companyNameMeaning",
        },
        {
          fieldName: this.$T("sslm.supplierManage.model.supplierManage.erpFlag").$D("ERP供应商"),
          fieldCode: "erpFlagMeaning",
        },
        {
          fieldName: this.$T("sslm.common.view.supplier.class").$D("供应商分类"),
          fieldCode: "invOrganizationName",
          render: (val, record) => record.categoryName
        },
      ];
    },
  },
  async mounted() {
    this.lifeCycleStageLanes = [];
    this.lifeCycleStageLanesDes = [];
    await this.getNavArr();
  },
  methods: {
    // 获取tab菜单
    async getNavArr() {
      await getNavApi().then((res) => {
        if (res) {
          this.lifeCycleStageLanes[0] = {
            stageDescription:this.$T("sslm.supplierManage.view.messaege.title.tab.all").$D("全部"),
            stageId:""
          };
          this.lifeCycleStageLanes = [ ...this.lifeCycleStageLanes, ...res.lifeCycleStageLanes ];
          this.lifeCycleStageLanesDes = this.lifeCycleStageLanes.map((item) => item.stageDescription);
        }
      });
    },
    // tab栏切换
    onTabIndexChange(index) {
      const currentStageId = this.lifeCycleStageLanes[index].stageId.toString() || "";
      const params = {
        size: 10,
        page: 0,
        tenantId: Number(SrmUtil.getTenantId()),
        organizationId: Number(SrmUtil.getOrganizationId),
        stageId: currentStageId, //分类ID
      };
      this.dataSet.bodyParameter = params;
      this.dataSet.refresh();
    },
    goToDetail(item) {
      const { data } = item;
      const { spfmCompanyId,
        spfmSupplierCompanyId,
        tenantId,
        companyId,
        supplierCompanyId,
        supplierTenantId } = data;

      this.$router.push({
        name: "SupplierLifeCycleDetail",
        query: { spfmCompanyId, spfmSupplierCompanyId, tenantId, companyId, supplierCompanyId, partnerTenantId:supplierTenantId }
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

.srm-span-right-slot-yellow {
  margin-right: 15px;
  color: var(--color-other-default-c);
}

.srm-span-right-slot-blue {
  margin-right: 15px;
  color: var(--color-other-default-b);
}

.srm-span-right-slot-red {
  margin-right: 15px;
  color: var(--color-other-default);
}

.srm-span-right-unCheck {
  font-family: PingFangSC-Regular;
  display: inline-block;
  padding: 0 8px;
  margin-left: 4px;
  line-height: 24px;
  font-size: 14px;
  color: var(--color-other-default-b);
  font-weight: 700;
}

.srm-span-right-blue-name {
  color:var(--color-other-default-b);
  border: 1px solid #276EF1;
}

.srm-span-right-black-name {
  color:var(--color-font-default-b);
  border: 1px solid #82879E;
}

</style>
