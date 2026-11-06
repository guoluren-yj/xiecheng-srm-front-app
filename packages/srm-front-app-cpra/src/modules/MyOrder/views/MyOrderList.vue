<template>
  <div style="height: 100vh">
    <srm-list :data-set="getDateSet"
              customize-code="SMBL.MY_ORDER.LIST"
              :columns="getColumns"
              @itemClick="goToDetail">
      <srm-tab-bar slot="filter"
                   :tabs="[
                     $T('hipspfm.receivedOrder.view.tab.allOrders').$D('全部订单'),
                     $T('hipspfm.receivedOrder.view.tab.toBeConfirmed').$D('待确认'),
                     $T('sodr.receivedOrder.view.message.confirmedFlag').$D('已确认')
                   ]"
                   display="justify"
                   @indexChange="onTabIndexChange"/>
    </srm-list>
  </div>
</template>

<script>

import indexDS from "../datasource/indexDS";
import { DataSet } from "srm-mobile-ui";

export default {
  modules: [ "hipspfm.common", "sodr.receivedOrder", "sodr.sendOrder", "smbl.common", "hipspfm.receivedOrder" ],
  name: "MyReceiveOrderList",
  components: {
  },
  data() {
    return {
      type: "ALL",
      dataSet0: new DataSet(indexDS(this, "ALL", false)),
      dataSet1: new DataSet(indexDS(this, "TO_BE_CONFIRMED", true)),
      dataSet2: new DataSet(indexDS(this, "CONFIRMED", true)),
    };
  },
  computed: {
    getDateSet() {
      return this.type === "ALL" ? this.dataSet0 : this.type === "TO_BE_CONFIRMED" ? this.dataSet1 : this.dataSet2;
    },
    getColumns() {
      return [
        {
          formRow: 0,
          fieldCode: "itemName",
          fieldType: "EMPTY",
          render: (val, item) => {
            let clsaaStyle;
            if (item.statusCode === "REJECTED" || item.statusCode === "DELIVERY_DATE_REJECT") {
              clsaaStyle = "srm-span-right-slot-red";
            } else if (item.statusCode === "PENDING" || item.statusCode === "DELIVERY_DATE_REVIEW" ||
            item.statusCode === "CLOSEING" || item.statusCode === "CANCELING" || item.statusCode === "CANCELLED_PARTIAL" ||
            item.statusCode === "CLOSETOBECOMFIRMED" ||
            item.statusCode === "CANCELTOBECOMFIRMED") {
              clsaaStyle = "srm-span-right-slot-yellow";
            } else if (item.statusCode === "CLOSED" || item.statusCode === "CANCELED" || item.statusCode === "PUBLISH_CANCEL") {
              clsaaStyle = "srm-span-right-slot-grey";
            } else if (item.statusCode === "APPROVED" || item.statusCode === "PUBLISHED" || item.statusCode === "CONFIRMED" ||
            item.statusCode === "PART_FEED_BACK" || item.statusCode === "SUBMITTED" || item.statusCode === "SUBMITTED_WFL") {
              clsaaStyle = "srm-span-right-slot-green";
            }
            return <SrmListHeader>
              <span>{item.displayPoNum}</span>
              {
                item.urgentFlag === 1 && <span class="srm-span-slot">{ this.$T("sodr.sendOrder.view.message.urgent").$D("加急") }</span>
              }
              <srm-flex slot="right" >
               <span class={ clsaaStyle }>{item.statusCodeMeaning}</span>
               <ActionBar direction="vertical" data={{cardInfo:{cardCode:"PO_CONFIRM_DETAIL",data:{...item,unreadCount:0,ouName:item.ouCode}}}}/>
              </srm-flex>

            </SrmListHeader>;
          }
        },
        {
          fieldName: this.$T("sodr.sendOrder.model.sendOrder.supplierId").$D("供应商"),
          fieldCode: "supplierName",
        },
        {
          fieldName: this.$T("sodr.sendOrder.model.sendOrder.taxedAmount").$D("含税金额"),
          fieldType: "INPUT_NUMBER",
          fieldCode: "taxIncludeAmount",
          editor: false,
          precision: (val, record) => {
            // erp订单及电商申请转订单不做精度控制
            // erp订单：sourceCode="SRM"&&poSourcePlatform="ERP"
            const erpFlag = record.sourceCode === "SRM" && record.poSourcePlatform === "ERP";
            // 电商申请转订单：sourceCode="SAP"&&poSourcePlatform="E-COMMERCE"
            const sapFlag = record.sourceCode === "SAP" && record.poSourcePlatform === "E-COMMERCE";
            if (!erpFlag && !sapFlag) {
              return Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision"));
            }
          }
        },
        {
          fieldName: this.$T("sodr.sendOrder.model.sendOrder.releaseDate").$D("发布时间"),
          fieldCode: "releasedDate",
          render:(val, record) => {
            if (Number(record.unreadCount) > 0) {
              return <div>
                <span>{ val }</span>
                <span style="color: #fd4b4b;margin-left: 15px;font-size: 10px;line-height: 18px;background: rgba(253, 75, 75, 0.1);border-radius: 2px;padding: 2px 8px;font-weight: normal;">
                  { this.$T("smbl.common.view.unread.coun", [ Number(record.unreadCount) ]).$D("{count}条未读消息") }
                </span>
              </div>;
            }
            return val;
          }
        },
        /**
         * 智能应用需求，将当前功能作为卡片发送到企业微信或其他第三方聊天平台
         */
        // {
        //   formRow: 100,
        //   fieldCode: "sendMessage",
        //   fieldType: "EMPTY",
        //   render: (val,record) => <SrmFlex justify="end">
        //     <ActionBar data={{cardInfo:{cardCode:"PO_CONFIRM_DETAIL",data:{...record,unreadCount:0,ouName:record.ouCode}}}}/>
        //   </SrmFlex>
        // }
      ];
    },
  },
  methods: {
    // tab栏切换
    onTabIndexChange(index) {
      if (index === 1) {
        this.type = "TO_BE_CONFIRMED";
        this.dataSet1.refresh();
      } else if (index === 2) {
        this.type = "CONFIRMED";
        this.dataSet2.refresh();
      } else {
        this.type = "ALL";
        this.dataSet0.refresh();
      }
    },
    goToDetail(item) {
      const { data } = item;
      const { orgName,
        poHeaderId,
        unreadCount,
        displayPoNum } = data;

      this.$router.push({
        name: "MyOrderDetail",
        query: { poHeaderId, orgName, unreadCount, displayPoNum }
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

.srm-span-right-slot-yellow {
  margin-right: 5px;
  color: #FFC043;
}

.t-slot-blue {
  margin-right: 15px;
  color: var(--color-other-default-b);
}

.srm-span-right-slot-red {
  margin-right: 5px;
  color:#E11900;
}
.srm-span-right-slot-green {
  margin-right: 5px;
  color:#05944F;
}
.srm-span-right-slot-grey {
  margin-right: 5px;
  color:#757575;
}
</style>
