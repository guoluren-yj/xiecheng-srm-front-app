<template>
  <div style="height: 100vh">
    <!-- 导航栏 -->
    <nav-head
      :title="$T('ssrc.inquiryHall.view.message.title.basicPriceComfirm').$D('基准价确认')"
      @goBack="goBack"
      @goClose="goClose"/>
    <srm-list
      :data-set="dataSet"
      :columns="getColumns()"/>
  </div>
</template>

<script>
import { DataSet, SrmUtil } from "srm-mobile-ui";
import NavHead from "@/components/NavHead";
import { closeWebView } from "srm-mobile-ui/src/utils/jsBridge";
import { confirmBasicPriceDataSource } from "../datasource/confirmBasicPriceDataSource";

export default {
  modules: [ "ssrc.inquiryHall", "hipspfm.order" ],
  name: "AksConfirmBasicPriceList",
  components: { NavHead },
  data() {
    return {
      dataSet: new DataSet(confirmBasicPriceDataSource()),
    };
  },
  beforeMount() {
    this.dataSet.refresh();
  },
  methods: {
    getColumns() {
      return [ {
        fieldCode: "customHeader",
        fieldType: "EMPTY",
        render: (val, item) => <SrmListHeader>
          <span>{item.rfxNum}</span>
          <span slot="right">{item.benchmarkStatusMeaning}</span>
        </SrmListHeader>
      },
      {
        fieldName: this.$T("hipspfm.order.model.line.title").$D("标题"),
        fieldCode: "rfxTitle",
      },
      {
        fieldName: this.$T("").$D("招标状态"),
        fieldCode: "rfxStatusMeaning",
        labelCode: "ssrc.inquiryHall.model.inquiryHall.inviteStatus",
      },
      {
        fieldCode: "button",
        fieldType: "EMPTY",
        render: (val, item) => {
          const user = SrmUtil.getUserInfo();
          const userId = user.id || 0;
          let f = item.benchmarkStatus === "DEFEND" ||
              (
                item.benchmarkStatus === "INSTANCE" ||
                item.benchmarkStatus === "REVIEWED"
              ) &&
              (
                item.reviewedBy === item.approvedBy ||
                !item.approvedBy ||
                  item.reviewedBy !== item.approvedBy &&
                  userId === item.approvedBy
              );
          if (f) {
            return (
              <SrmFlex justify="end" style="width: 100%; border-top: 1px solid #f5f6fa; margin-top: 10px;">
                <li class="foot-li">
                  <span onClick={() => {
                    this.toDetail(item, 1);
                  }}>{this.$T("ssrc.inquiryHall.view.message.title.rfxReportDetail").$D("RFX单据详情")}</span>
                  <span onClick={() => {
                    this.toDetail(item, 2);
                  }}>{this.$T("ssrc.inquiryHall.view.message.button.comfirmBasicPrice").$D("确认基准价")}</span>
                </li>
              </SrmFlex>
            );
          }
          return (
            <SrmFlex justify="end" style="width: 100%; border-top: 1px solid #f5f6fa; margin-top: 10px;">
              <li class="foot-li">
                <span onClick={() => {
                  this.toDetail(item, 1);
                }}>{this.$T("ssrc.inquiryHall.view.message.title.rfxReportDetail").$D("RFX单据详情")}</span>
                <span onClick={() => {
                  this.toDetail({ ...item, readonly: true }, 2);
                }}>{this.$T("ssrc.inquiryHall.view.message.button.lookBasicPrice").$D("查看基准价")}</span>
              </li>
            </SrmFlex>
          );
        }
      } ];
    },
    // 返回
    goBack() {
      try {
        closeWebView();
      } catch (err) {
        this.$router.back();
      }
    },
    // 退出子应用
    goClose() {
      try {
        closeWebView();
      } catch (err) {
        this.$router.back();
      }
    },
    toDetail(item, f) {
      if (f === 2) {
        // 判断当前是基准价(审核)，还是基准价(审批)
        if (item.benchmarkStatus === "DEFEND") {
          item["reviewedPriceFlag"] = true;
        } else {
          item["reviewedPriceFlag"] = false;
        }
        const user = SrmUtil.getUserInfo();
        const userId = user.id || 0;
        let flag = item.benchmarkStatus === "DEFEND" ||
                  (
                    item.benchmarkStatus === "INSTANCE" ||
                    item.benchmarkStatus === "REVIEWED"
                  ) &&
                  (
                    item.reviewedBy === item.approvedBy ||
                    !item.approvedBy ||

                      item.reviewedBy !== item.approvedBy &&
                      userId === item.approvedBy
                  );
        if (flag) {
          item["showApprovedPrice"] = true;
        } else {
          item["showApprovedPrice"] = false;
        }
        this.$router.push({
          name: "aks_ConfirmBasicPrice",
          query: { benchmarkData: { ...item } },
        });
      }
      if (f === 1) {
        this.$router.push({
          name: "aks_RfxReportDetail",
          query: { rfxHeaderInfo: item },
        });
      }
    },
    // 筛选框 打开/关闭
    clickFilterPopup() {
      this.showFilterPopupFlag = !this.showFilterPopupFlag;
    },
    // 筛选框 提交
    onFilterSubmit(query = {}) {
      this.clickFilterPopup();
      this.queryParameter = query;
      this.getBasicPriceList();
    },
    // 筛选框 重置
    onFilterReset() {
      this.clickFilterPopup();
      this.queryParameter = {
        rfxNum: "",
        rfxTitle: "",
        benchmarkStatus: "", // 基准价状态
        finishedFlag: "" // 过滤已完成状态
      };
      this.getBasicPriceList();
    },
  }
};
</script>

<style lang="stylus" scoped>
>>> .srm-list-item-card {
  padding: 0 15px 0 15px;
  .customize-item {
    margin-top: 4px !important;
  }
  .srm-list-item-card-head-left {
    margin-left: 0;
  }
}
>>> .srm-check-box-button {
  display: none;
}
>>> .srm-list-tool-button-wrap {
  display: none;
}

.foot-li {
  height: 44px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-family: PingFangSC-Medium;
  font-size: 14px;
  color: var(--color-other-default-b);

  span {
    border: 1px solid var(--color-other-default-b);
    border-radius: 18px;
    height: 28px;
    line-height: 20px;
    font-weight: normal;
    display: flex;
    align-items: center;
    padding: 0 12px 0 12px;
  }

  span:nth-child(even) {
    background: var(--color-other-default-b);
    color: white;
    margin-left: 12px;
  }
}
.srm-list-search-line {
  padding: 4px 0;
  padding-right 5px;

  .srm-list-icon-search {
    font-size 28px;
    color #cbcbcb;
    padding 5px;
  }
}
.flex-row {
  padding-top: 8px;
  line-height: 20px;
}

.tab-box {
  display: flex;
  flex-direction: row;
  padding: 15px 20px;
  border-bottom: 1px solid #f5f6fa;

  .tab-item {
    flex 1;
    text-align center;
    margin-right: 15px;
    color: #1B1E2B
  }

  .tab-item-active {
    flex 1;
    text-align center;
    margin-right: 15px;
    color: #1B1E2B;
    font-weight bold;
  }
}
</style>
