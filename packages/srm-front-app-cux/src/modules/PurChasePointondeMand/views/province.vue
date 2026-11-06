<template>
  <div style="height: 100vh">
    <srm-list
      :data-set="lineDataDs"
      :columns="getLineDataColumns"
      @itemClick="onItemClick"/>
  </div>
</template>

<script>
import { DataSet, $T, SrmUtil } from "srm-mobile-ui";
import { proviceDs } from "../datasource/index";
import { SrmButton } from "srm-mobile-ui";

export default {
  modules: [
    "scux.Province",
    "scux.PointondeMandList",
    "scux.PurChasePointondeMandList",
    "scux.PurChaseMandPlaceList",
    "scux.City",
    "scux.MonitData",
    "scux.PointondeMandDetails",
    "scux.PurChasePointondeMandDetails",
  ],
  name: "Province",
  data() {
    const {
      app: {
        _route: {
          query: { region, querys },
        },
      },
    } = this.$router;
    const { currentRoleCode } = SrmUtil.getUserInfo();

    // 点位中标金额
    const winNumArr = [
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
    // 点位实际执行金额（万元）
    const roleArr = [
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
      "leader",
    ];
    return {
      region,
      lineDataDs: new DataSet(proviceDs(region)),
      querys,
      winNumArr,
      roleArr,
      currentRoleCode
    };
  },
  computed: {
    getLineDataColumns() {
      return [
        {
          fieldCode: "provinceName",
          fieldType: "EMPTY",
          formRow: 0,
          render: (val) =>
            <SrmListHeader>
              <span>{val}</span>
            </SrmListHeader>
          ,
        },

        {
          fieldCode: "pointAmount",
        },
        this.currentRoleCode.indexOf("bsc") === -1 && !this.winNumArr.includes(this.currentRoleCode) && {
          fieldCode: "winBidAmount",
        },
        this.currentRoleCode.indexOf("bsc") === -1 && !this.roleArr.includes(this.currentRoleCode) && {
          fieldCode: "actualExecutAmount",
        },
        {
          fieldCode: "buttons",
          render: (_, record) =>
            <div>
              <SrmButton onClick={() => this.onItemClick(record, "location")}>
                {$T("scux.Province.button.citys").$D("查看下辖城市")}
              </SrmButton>
              <SrmButton
                class="historyLook"
                onClick={() => this.onItemClick(record, "point")}
              >
                {$T("scux.Province.button.hisoryUploads").$D("查看点位信息")}
              </SrmButton>
            </div>
          ,
        },
      ];
    },
  },
  created() {
    this.lineDataDs.setQueryParameter({
      region: this.region,
      currPage: "province",
      ...JSON.parse(this.querys),
    });
  },
  methods: {
    onItemClick(record, flag) {
      if (flag === "location") {
        const { province } = record;
        this.$router.push({
          name: "cityList",
          query: { province, querys: JSON.stringify(this.querys) },
        });
      } else {
        const queryPara =
          this.querys === "{}" ?
            JSON.stringify(this.lineDataDs.queryParameter) :
            this.querys;
        const { province } = record;
        this.$router.push({
          name: "PurChasePointondeMandList",
          query: { province, querys: queryPara },
        });
      }
    },
  },
};
</script>

