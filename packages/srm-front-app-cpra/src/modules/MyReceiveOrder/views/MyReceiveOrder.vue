<template>
  <div style="height: 100vh">
    <srm-list :data-set="type === 'ALL' ? dataSet0 : type === 'TO_BE_CONFIRMED' ? dataSet1 : dataSet2"
              customize-code="SMBL.MY_RECEIVE_ORDER.LIST"
              :columns="getColumns"
              @itemClick="goToDetail">
      <srm-tab-bar slot="filter"
                   :tabs="[
                     $T('hipspfm.receivedOrder.view.tab.allOrders').$D('全部订单'),
                     $T('hipspfm.receivedOrder.view.tab.toBeConfirmed').$D('待确认'),
                     $T('sodr.receivedOrder.view.message.confirmedFlag').$D('已确认')
                   ]"
                   display="auto"
                   class="order-receive-tab"
                   @indexChange="onTabIndexChange"/>
    </srm-list>
  </div>
</template>

<script>

import indexDS from "../datasource/indexDS";
import { DataSet } from "srm-mobile-ui";

export default {
  modules: [ "hipspfm.common", "sodr.receivedOrder", "smbl.common", "hipspfm.receivedOrder", "sodr.sendOrder" ],
  name: "MyReceiveOrderList",
  components: {
  },
  data() {
    return {
      type: "ALL",
      dataSet0: new DataSet(indexDS(this, "ALL")),
      dataSet1: new DataSet(indexDS(this, "TO_BE_CONFIRMED")),
      dataSet2: new DataSet(indexDS(this, "CONFIRMED")),
    };
  },
  computed: {
    getColumns() {
      return [
        {
          formRow: 0,
          fieldCode: "itemName",
          fieldType: "EMPTY",
          render: (val, item) => {
            let clsaaStyle;
            if (item.statusCode === "CANCELED") {
              clsaaStyle = "srm-span-right-slot-red";
            } else if (item.statusCode === "DELIVERY_DATE_REVIEW") {
              clsaaStyle = "srm-span-right-slot-yellow";
            } else {
              clsaaStyle = "srm-span-right-slot-blue";
            }
            return <SrmListHeader>
              <span>{item.displayPoNum}</span>
              {
                item.urgentFlag === 1 && <span class="srm-span-slot">{ this.$T("sodr.receivedOrder.view.message.urgent").$D("加急") }</span>
              }
              <span slot="right" class={ clsaaStyle }>{item.statusCodeMeaning}</span>
            </SrmListHeader>;
          }
        },
        {
          fieldName: this.$T("sodr.receivedOrder.model.receivedOrder.companyId").$D("客户"),
          fieldCode: "companyName",
        },
        {
          fieldName: this.$T("sodr.receivedOrder.model.receivedOrder.taxedAmount").$D("含税金额"),
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
          },
        },
        {
          fieldName: this.$T("sodr.receivedOrder.model.receivedOrder.releaseDate").$D("发布日期"),
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
        name: "MyReceiveOrderDetail",
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

.order-receive-tab {
  >>> .srm-tab-bar-button-normal {
    min-width: 33.3%;
  }
}

.srm-span-right-slot-yellow {
  margin-right: 15px;
  color: var(--color-other-default-c);
}

.srm-span-right-slot-blue {
  margin-right: 15px;
  color: var(--color-other-default-b);
}

.srm-span-right-slot-red {
  margin-right: 15px;
  color: var(--color-other-default);
}

</style>
