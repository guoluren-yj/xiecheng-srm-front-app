<template>
  <div style="height: 100vh">
    <srm-tab-bar
      :tabs="tabsJustify"
      display="justify"
      @indexChange="onIndexChange"/>
    <srm-list
      :data-set="lineDataDs"
      :columns="getLineDataColumns"
      @itemClick="onItemClick"/>
  </div>
</template>

<script>
import { DataSet, $T } from "srm-mobile-ui";
import { lineDs } from "../datasource/index";
export default {
  modules: [
    "scux.PointondeMandList",
    "scux.MonitData",
    "scux.PointondeMandDetails",
  ],
  name: "PointondeMandList",
  data() {
    return {
      tabFlag: 0,
      tabsJustify: [
        $T("scux.PointondeMandList.button.tomonit").$D("待监播"),
        $T("scux.PointondeMandList.button.finished").$D("已监播"),
        $T("scux.PointondeMandList.button.closed").$D("已完成"),
      ],
      lineDataDs: new DataSet(lineDs()),
    };
  },
  computed: {
    getLineDataColumns() {
      return [
        {
          fieldCode: "pointPositionNumber",
          fieldType: "EMPTY",
          formRow: 0,
          render: (val, record) =>
            <SrmListHeader>
              <span>{val}</span>
              <span slot="left" style="color:#276EF1;">
                {record.pointPositionNumber}
              </span>
              <span slot="right" style="color:#276EF1;">
                {record.pointPositionStatusMeaning}
              </span>
            </SrmListHeader>
          ,
        },

        {
          fieldCode: "pointLocation",
        },
        {
          fieldCode: "journalPositionStatusMeaning",
        },
      ];
    },
  },
  created() {
    this.lineDataDs.setQueryParameter({ runningStatus: "running" });
    this.lineDataDs.refresh();
  },
  methods: {
    onIndexChange(index) {
      this.tabFlag = index;
      this.lineDataDs.setQueryParameter({
        ...this.lineDataDs.queryParameter,
        runningStatus:
          index === 0 ? "running" : index === 1 ? "finished" : "closed",
      });
      this.lineDataDs.refresh();
    },
    onItemClick() {
      const { pointPositionId } = this.lineDataDs.current.data;
      this.$router.push({
        name: "PointondeMandDetails",
        query: {
          pointPositionId,
          tabFlag: this.tabFlag,
        },
      });
    },
  },
};
</script>