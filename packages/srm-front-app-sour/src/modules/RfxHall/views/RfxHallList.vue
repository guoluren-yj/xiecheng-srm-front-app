<template>
  <div style="height: 100vh">
    <srm-list :data-set="dataSet"
              customize-code="SMBL.INQUIRY_HALL.LIST.LIST"
              :columns="getColumns()"
              @itemClick="goToDetail"/>
  </div>
</template>

<script>
import { indexDS } from "../datasource/indexDS";
import { DataSet, SrmUtil } from "srm-mobile-ui";

import ActionBarWrapper from "@/modules/RfxHall/components/ActionBarWrapper";

export default {
  modules: [ "ssrc.inquiryHall", "ssrc.queryRfq", "smbl.common", "hipspfm.common" ],
  name: "RfxHallList",
  // eslint-disable-next-line vue/no-unused-components
  components: { ActionBarWrapper },
  data() {
    return {
      dataSet: new DataSet(indexDS()),
    };
  },
  activated() {
    this.dataSet.refresh();
  },
  methods: {
    getColumns() {
      return [
        {
          formRow: 0,
          fieldCode: "customHeader",
          fieldType: "EMPTY",
          render: (val, item) => <SrmListHeader>
            <span>{item.rfxNum}</span>
            <span slot="right">
              <SrmFlex>
                {item.rfxStatusMeaning}
                <span style="margin-left: 4px;">
                  <action-bar-wrapper record={item} />
                </span>
              </SrmFlex>
            </span>
          </SrmListHeader>
        }, {
          fieldCode: "rfxTitle",
        }, {
          fieldCode: "companyName",
        }, {
          fieldCode: "quotationStartDate",
        }, {
          fieldCode: "quotationEndDate",
        }, {
          fieldCode: "createByName",
        },
        {
          formRow: 1000,
          fieldCode: "customBottom",
          fieldType: "EMPTY",
          render: (val, item) => {
            const { checkedEnabledFlag = 0, } = item || {};
            const checkFlag = checkedEnabledFlag === 1 || checkedEnabledFlag === "1";

            const flag = (item.rfxStatus === "CHECK_PENDING" ||
                    item.rfxStatus === "CHECK_REJECTED" ||
                    item.rfxStatus === "ROUND_QUOTATION") &&
                    checkFlag;
            if (flag) {
              return <SrmFlex justify="end" ><SrmButton fill onClick={ () => this.goToPricing(item) }> { this.$T("ssrc.inquiryHall.view.message.title.checkPrice").$D("核价")} </SrmButton></SrmFlex>;
            }
          }
        },
        /**
         * 智能应用需求，将当前功能作为卡片发送到企业微信或其他第三方聊天平台
         * */
        // {
        //   formRow: 1100,
        //   fieldCode: "sendMessage",
        //   fieldType: "EMPTY",
        //   render: (_, record) =>
        //     <SrmFlex justify="end">
        //       <action-bar-wrapper record={record} />
        //     </SrmFlex>
        //   ,
        // },
      ];
    },
    goToDetail(item) {
      const { data } = item;
      this.$router.push({
        name: "RfxHall",
        query: { rfxHeaderId: data.rfxHeaderId },
      });
      this.$store.commit("setTenderHallList", data);
    },
    goToPricing(item) {
      const { rfxHeaderId } = item;
      this.$router.push({
        name: "RfxPrice",
        query: { rfxHeaderId },
      });
    },
  },
};
</script>
