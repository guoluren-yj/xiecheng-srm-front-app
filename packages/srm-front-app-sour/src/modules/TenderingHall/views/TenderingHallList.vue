<template>
  <div style="height: 100vh">
    <nav-head
      :title="$T('ssrc.bidHall.view.title.bidHall').$D('招标大厅')"
      @goBack="goBack"/>
    <srm-list
      :data-set="dataSet"
      :columns="getColumns"
      customize-code="SMBL.TENDERING.HALL.LIST"
      @itemClick="goToDetail"/>
  </div>
</template>

<script>
import indexDS from "../datasource/indexDS";
import { getTenderApi } from "../api/index";
import { DataSet } from "srm-mobile-ui";
export default {
  modules: [ "hipspfm.bidHall", "ssrc.bidHall" ],
  name: "TenderingHallList",
  components: {},
  data() {
    return {
      dataSet: new DataSet(indexDS()),
    };
  },
  computed: {
    getOpenFlag() {
      return (status) => status === "OPEN_BID_PENDING";
    },
    getColumns() {
      return [
        {
          formRow: 0,
          fieldCode: "bidNum",
          fieldType: "EMPTY",
          render: (val, record) =>
            <SrmListHeader>
              <span>{val}</span>
              <span class="status" slot="right">
                {record.bidStatusMeaning}
              </span>
            </SrmListHeader>
          ,
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.bidTitle").$D(
            "招标事项"
          ),
          fieldCode: "bidTitle",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.companyName").$D(
            "公司"
          ),
          fieldCode: "companyName",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.QuotationDeadLine").$D(
            "招标截止时间"
          ),
          fieldCode: "quotationEndDate",
        },
        {
          fieldCode: "bidOpenDate",
          fieldType: "EMPTY",
          render: (val, record) =>
            <SrmListHeader showOpenTag={false}>
              <span>
                {this.$T("ssrc.bidHall.model.bidHall.bidOpenDate").$D(
                  "开标时间"
                )}
                ：{record.bidOpenDate}
              </span>
              {this.getOpenFlag(record.bidStatus) &&
                <span
                  class="bottom-button"
                  slot="right"
                  onClick={() => this.showTenderPop(record.bidHeaderId)}
                >
                  {this.$T("ssrc.bidHall.model.bidHall.openingBid").$D("开标")}
                </span>
              }
            </SrmListHeader>
          ,
        },
      ];
    },
  },
  methods: {
    goToDetail(item) {
      const { bidOpenDate, bidHeaderId, sourceHeaderId } = item.data;

      this.$router.push({
        name: "BiddingBillsDetailA",
        query: { bidOpenDate, bidHeaderId, sourceHeaderId }
      });
    },
    //开标弹窗
    showTenderPop(bidHeader) {
      this.tenderPopup = !this.tenderPopup;
      if (this.tenderPopup === true) {
        this.getTender(bidHeader);
      }
    },
    // 获取开标信息
    getTender(bidHeaderId) {
      this.bidHeaderId = bidHeaderId;
      this.$loading.show();
      getTenderApi(bidHeaderId).then((res) => {
        this.tenderArr = res;
        this.$loading.hide();
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
.status {
  display: inline-block;
  height: 22px;
  line-height: 22px;
  text-align: center;
  font-family: PingFangSC-Medium;
  font-size: 14px;
  color: var(--color-font-default-b);
}

.bottom-button {
  background: var(--color-other-default-b);
  border-radius: 2px;
  font-size: 14px;
  color: var(--color-font-default-d);
  line-height: 20px;
  display: inline-block;
  text-align: center;
  width: 16vw;
  height: 20px;
}
</style>
