<template>
  <div style="height: 100vh">
    <srm-list
      class="detail-list"
      :data-set="letterDataSet"
      :columns="getLetterColumns()"/>
  </div>
</template>

<script>
import { DataSet } from "srm-mobile-ui";
import { letterData } from "../dataSource/detailDs";

import ListColumns from "../mixins/ListColumns";

export default {
  modules: [ "scux.summaryReceipt", "hzero.common" ],
  name: "AttachmentLetterDetail",
  components: {
  },
  mixins: [ ListColumns ],
  props: {
    itemCode: {
      type: String,
    },
  },
  data() {
    return {
      letterDataSet: new DataSet(letterData(this.itemCode)),
    };
  },
  mounted() {
    if (this.itemCode) {
      // this.badProjectDataSet.addQueryParameter("headerId", this.headerId);
      // this.badProjectDataSet.addQueryParameter("spotCheckCount", this.spotCheckCount);
      this.letterDataSet.refresh();
    }
  },
  methods: {
  }
};
</script>