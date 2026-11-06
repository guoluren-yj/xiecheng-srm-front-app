<template>
  <settle-list :ds-obj="dsObj" :check-ds="checkDs" role="supplier"/>
</template>

<script>
import { DataSet } from "srm-mobile-ui";
import SettleList from "../components/SettleList";
import { wholeTableDS, checkDS } from "../datasource/supplySettleListDS";
export default {
  modules: [ "hzero.common", "ssta.purchaseSettle", "ssta.supplySettle", "ssta.common", "smbl.common" ],
  name: "SupplySettleList",
  components: { SettleList },
  data() {
    return {
      dsObj: {
        ALL: new DataSet(wholeTableDS("ALL")),
        APPROVE: new DataSet(wholeTableDS("APPROVE")),
      },
      checkDs: new DataSet(checkDS()),
    };
  },
};
</script>