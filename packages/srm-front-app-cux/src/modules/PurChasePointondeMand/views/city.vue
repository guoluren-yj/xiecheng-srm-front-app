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
import { cityDs } from "../datasource/index";
import { SrmButton } from "srm-mobile-ui";

export default {
  modules: [
    "scux.City",
    "scux.PointondeMandList",
    "scux.PurChasePointondeMandList",
    "scux.PurChaseMandPlaceList",
    "scux.Province",
    "scux.MonitData",
    "scux.PointondeMandDetails",
    "scux.PurChasePointondeMandDetails",
  ],
  name: "City",
  data() {
    const {
      app: {
        _route: {
          query: { province, querys },
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
      province,
      querypara: JSON.parse(querys),
      lineDataDs: new DataSet(cityDs(province)),
      currentRoleCode,
      winNumArr,
      roleArr,
    };
  },
  computed: {
    getLineDataColumns() {
      return [
        {
          fieldCode: "cityName",
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
              <SrmButton
                class="historyLook"
                onClick={() => this.onItemClick(record)}
              >
                {$T("scux.City.button.hisoryUploads").$D("查看点位信息")}
              </SrmButton>
            </div>
          ,
        },
      ];
    },
  },
  created() {
    const queryData = JSON.parse(this.querypara);
    this.lineDataDs.setQueryParameter({
      province: this.province,
      currPage: "city",
      ...queryData,
    });
  },
  methods: {
    onItemClick(record) {
      const queryPara =
        this.querypara === "{}" ?
          JSON.stringify(this.lineDataDs.queryParameter) :
          this.querypara;

      const { city } = record;
      this.$router.push({
        name: "PurChasePointondeMandList",
        query: { city, querys: queryPara },
      });
    },
  },
};
</script>

