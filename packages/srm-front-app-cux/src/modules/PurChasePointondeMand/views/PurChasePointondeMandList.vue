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
import { DataSet, $T, SrmUtil } from "srm-mobile-ui";
import { purchaselineDs } from "../datasource/index";
export default {
  modules: [
    "scux.PurChasePointondeMandList",
    "scux.PointondeMandList",
    "scux.PurChaseMandPlaceList",
    "scux.Province",
    "scux.City",
    "scux.MonitData",
    "scux.PurChasePointondeMandDetails",
  ],
  name: "PurChasePointondeMandList",
  data() {
    const {
      app: {
        _route: {
          query: { region, province, city, querys },
        },
      },
    } = this.$router;
    // 供应商,点位中标金额字段权限
    const supplierArr = [
      "hndq",
      "sddq",
      "cydq",
      "jsdq",
      "gqddq",
      "dbmddq",
      "xqzdq",
      "yhdq",
      "sgnmxdq",
      "xygdq",
      "xygdq",
      "shdq",
      "ahdq",
      "jjdq",
      "zmdq",
      "jingjdq",
      "hndq",
      "yybry",
      "scglry",

    ];
    const { currentRoleCode } = SrmUtil.getUserInfo();
    return {
      tabFlag:0,
      tabsJustify: [
        $T("scux.PurChasePointondeMandList.button.tomonit").$D("待监播"),
        $T("scux.PurChasePointondeMandList.button.finished").$D("已监播"),
        $T("scux.PurChasePointondeMandList.button.closed").$D("已完成"),
      ],
      lineDataDs: new DataSet(purchaselineDs()),
      region,
      province,
      city,
      querys,
      supplierArr,
      currentRoleCode,
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
        this.currentRoleCode.indexOf("bsc") === -1 && !this.supplierArr.includes(this.currentRoleCode) && {
          fieldCode: "supplierName",
        },
        {
          fieldCode: "journalPositionStatusMeaning",
        },
      ];
    },
  },
  created() {
    const querysData = JSON.parse(this.querys);
    this.lineDataDs.setQueryParameter({
      runningStatus: "running",
      region: this.region,
      city: this.city,
      province: this.province,
      ...querysData,
    });
    this.lineDataDs.refresh();
  },
  methods: {
    onItemClick() {
      const { pointPositionId } = this.lineDataDs.current.data;
      this.$router.push({
        name: "PurChasePointondeMandDetails",
        query: { pointPositionId, tabFlag: this.tabFlag, },
      });
    },
    onIndexChange(index) {
      const obj = JSON.parse(this.querys);
      this.tabFlag = index;

      this.lineDataDs.setQueryParameter({
        region: this.region,
        city: this.city,
        province: this.province,
        ...obj,
        ...this.lineDataDs.queryParameter,
        runningStatus:
          index === 0 ? "running" : index === 1 ? "finished" : "closed",
      });
      this.lineDataDs.refresh();
    },
  },
};
</script>