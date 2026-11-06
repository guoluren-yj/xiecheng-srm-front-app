<template>
  <div class="sub-account-detail">
    <srm-scroll-tab>
      <srm-scroll-tab-item :label="$T('smbl.common.view.title.accountInfo').$D('账号信息')">
        <srm-form v-if="baseInfoDataSet" :data-set="baseInfoDataSet" :columns="getBaseInfoColumns" customize-code="SMBL.SUB_ACCOUNT.ACCOUNT.BASEINFO"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item :label="$T('smbl.common.view.title.roleInfo').$D('角色')">
        <srm-list v-if="roleDataSet" :data-set="roleDataSet" :columns="getRolesColumns" :scrollable="false" customize-code="SMBL.SUB_ACCOUNT.ACCOUNT.ROLE" />
      </srm-scroll-tab-item>
    </srm-scroll-tab>
  </div>
</template>

<script>
import { DataSet } from "srm-mobile-ui";
import { baseInfoDS, roleListDS } from "../datasource/DetailDS";
export default {
  modules: [ "smbl.common", "hiam.subAccount", "hzero.common" ],
  name: "SubAccountDetail",
  data() {
    return {
      userId: null,
      baseInfoDataSet: null,
      roleDataSet: null,
    };
  },
  computed: {
    getBaseInfoColumns() {
      return [ {
        fieldCode: "loginName",
        formRow: 10,
        formCol: 10,
      }, {
        fieldCode: "realName",
        formRow: 10,
        formCol: 20,
      }, {
        fieldCode: "nickname",
        formRow: 20,
        formCol: 10,
      }, {
        fieldCode: "gender",
        formRow: 20,
        formCol: 20,
      }, {
        fieldCode: "birthday",
        formRow: 25,
      }, {
        fieldCode: "countryName",
        formRow: 30,
        formCol: 10,
      }, {
        fieldCode: "regionName",
        formRow: 30,
        formCol: 20,
      }, {
        fieldCode: "addressDetail",
        formRow: 40,
      }, {
        fieldCode: "phone",
        formRow: 50,
      }, {
        fieldCode: "email",
        formRow: 60,
      }, {
        fieldCode: "startDateActive",
        formRow: 70,
        formCol: 10,
      }, {
        fieldCode: "enabled",
        formRow: 70,
        formCol: 20,
      } ];
    },
    getRolesColumns() {
      return [ {
        fieldCode: "name",
        formRow: 10,
      }, {
        fieldCode: "tenantName",
        formRow: 20,
      }, {
        fieldCode: "startDateActive",
        formRow: 30,
      } ];
    }
  },
  mounted() {
    this.userId = this.$route.query.id;
    this.baseInfoDataSet = new DataSet(baseInfoDS(this.userId));
    this.baseInfoDataSet.refresh();
    this.roleDataSet = new DataSet(roleListDS(this.userId));
    this.roleDataSet.refresh();
  }
};
</script>

<style lang="stylus" scoped>
.sub-account-detail {
  height: 100vh;
}
</style>
