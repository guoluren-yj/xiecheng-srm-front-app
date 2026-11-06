<template>
  <div class="sub-account">
    <srm-list
      :data-set="dataSet"
      :columns="getColumns"
      customize-code="SMBL.SUB_ACCOUNT.ACCOUNT.LIST"
      @itemClick="showSubAccountDetail"/>
  </div>
</template>

<script>
import { DataSet } from "srm-mobile-ui";
import listDataSource from "../datasource/indexDS";
export default {
  modules: [ "smbl.workFlow", "hiam.subAccount", "smbl.common" ],
  name: "SubAccountList",
  data() {
    return {
      dataSet: new DataSet(listDataSource()),
    };
  },
  computed: {
    getColumns() {
      return [ {
        fieldCode: "loginName",
        fieldType: "EMPTY",
        formRow: 10,
        render: (val, item) => <srm-list-header show-open-tag={true}>
          <span>{val}</span>
          <span style="margin-left: 8px;">{item.realName}</span>
        </srm-list-header>,
      }, {
        fieldCode: "phone",
        formRow: 20,
      }, {
        fieldCode: "email",
        formRow: 30,
      }, {
        fieldCode: "startDateActive",
        formRow: 40,
        formCol: 10,
      }, {
        fieldCode: "enabled",
        formRow: 40,
        formCol: 20,
      } ];
    }
  },
  methods: {
    showSubAccountDetail(record) {
      let id = record && record.data && record.data.id;
      this.$router.push({
        path: "/SubAccountSiteDetail",
        query: {
          id
        }
      });
    }
  }
};
</script>

<style lang="stylus" scoped>

.sub-account {
  height: 100vh;
}

</style>