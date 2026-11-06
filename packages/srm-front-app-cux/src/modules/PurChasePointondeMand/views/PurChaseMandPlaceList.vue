<template>
  <div style="height: 100vh">
    <srm-form
      v-if="currentRoleCode.indexOf('bsc')===-1&&!nationwideArr.includes(currentRoleCode)"
      :data-set="lineDataDs"
      :columns="getHeaderDataColumns"/>
    <srm-list :data-set="lineDataDs" :columns="getLineDataColumns" />
  </div>
</template>

<script>
import { DataSet, $T, SrmUtil } from "srm-mobile-ui";
import { placeDs, statisticsDs } from "../datasource/index";
import { queryApi } from "../api/index";
import { SrmButton } from "srm-mobile-ui";
export default {
  modules: [
    "scux.PurChaseMandPlaceList",
    "scux.PointondeMandList",
    "scux.PurChasePointondeMandList",
    "scux.Province",
    "scux.City",
    "scux.MonitData",
    "scux.PointondeMandDetails",
    "scux.PurChasePointondeMandDetails",
  ],
  name: "PurChaseMandPlaceList",
  data() {
    const { currentRoleCode } = SrmUtil.getUserInfo();
    // 全国模块
    const nationwideArr = [
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
    ];
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
      queryArr: [],
      lineDataDs: new DataSet(placeDs()),
      headerDs: new DataSet(statisticsDs()),
      currentRoleCode,
      roleArr,
      nationwideArr,
      winNumArr,
    };
  },
  computed: {
    getLineDataColumns() {
      return [
        {
          fieldCode: "regionName",
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
                {$T("scux.PurChaseMandPlaceList.button.uploads").$D(
                  "查看下辖省份"
                )}
              </SrmButton>
              <SrmButton
                class="historyLook"
                onClick={() => this.onItemClick(record, "point")}
              >
                {$T("scux.PurChaseMandPlaceList.button.hisoryUploads").$D(
                  "查看点位信息"
                )}
              </SrmButton>
            </div>
          ,
        },
      ];
    },
    getHeaderDataColumns() {
      return [
        {
          fieldCode: "regionNum",
          fieldType: "EMPTY",
          formRow: 0,
          render: () =>
            <SrmListHeader>
              <span>
                {$T("scux.PurChaseMandPlaceList.title.reginNameSums").$D(
                  "全国汇总"
                )}
              </span>
            </SrmListHeader>
          ,
        },
        {
          fieldCode: "totalPointAmount",
        },
        !this.winNumArr.includes(this.currentRoleCode) && {
          fieldCode: "totalWinBidAmount",
        },
        !this.roleArr.includes(this.currentRoleCode) && {
          fieldCode: "totalActualExecutAmount",
        },
      ];
    },
  },
  mounted() {
    // this.lineDataDs.setQueryParameter({ runingStatus: "running" });
    // this.lineDataDs.refresh();
    this.querys();
  },
  methods: {
    onItemClick(record, flag) {
      const { region } = record;
      this.$router.push({
        name: flag === "location" ? "proviceList" : "PurChasePointondeMandList",
        query: {
          region,
          querys: JSON.stringify(this.lineDataDs.queryParameter),
        },
      });
    },
    async querys() {
      // const ress = await queryApi();
      // console.log(ress, "resss");
      // if (ress && !ress.failed) {
      //   this.queryArr = ress.content.map((item) => ({
      //     value: item.region,
      //     meaning: item.regionName,
      //   }));
      // }
      // console.log(JSON.parse(JSON.stringify(this.queryArr)), "111");
      // this.lineDataDs.queryFields[0].options.listData = JSON.parse(
      //   JSON.stringify(this.queryArr)
      // );
      await queryApi().then((res) => {
        if (res && res.content) {
          this.lineDataDs.queryFields[0].options.listData = res.content;
        }
      });
    },
  },
};
</script>
<style lang="stylus" scoped>
.srm-form[data-v-4393c2b0] {
  padding: 12px 15px 16px 15px;
  min-height: 0;
}
</style>

