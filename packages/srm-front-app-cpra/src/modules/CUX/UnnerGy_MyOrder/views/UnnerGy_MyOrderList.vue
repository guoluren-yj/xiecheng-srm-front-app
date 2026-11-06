<template>
  <!-- 我发出的订单 - 合众新能源（二开） -->
  <div style="height: 100vh">
    <srm-list :data-set="getDateSet"
              customize-code="SMBL.MY_ORDER.LIST"
              :columns="getColumns"
              :buttons="getButtons"
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
  name: "UnnerGyMyOrderList",
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
                item.urgentFlag === 1 && <span class="srm-span-slot">{ this.$T("sodr.sendOrder.view.message.urgent").$D("加急") }</span>
              }
              <span slot="right" class={ clsaaStyle }>{item.statusCodeMeaning}</span>
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
                <span>{val}</span>
                <span style="color: #fd4b4b;margin-left: 15px;font-size: 10px;line-height: 18px;background: rgba(253, 75, 75, 0.1);border-radius: 2px;padding: 2px 8px;font-weight: normal;">
                  {this.$T("smbl.common.view.unread.coun", [ Number(record.unreadCount) ]).$D("{count}条未读消息")}
                </span>
              </div>;
            }
            return val;
          }
        },
      ];
    },
    getButtons() {
      return [
        {
          text: this.$T("sodr.sendOrder.view.form.reSubmit").$D("重新提交"),
          fill: true,
          disabled: (checkedList) => checkedList.length === 0,
          callback: () => {
            if (this.type === "ALL") {
              this.dataSet0.submitSelected();
            }
            // if (this.type === "TO_BE_CONFIRMED") {
            //   this.dataSet1.submitSelected();
            // }
            // if (this.type === "CONFIRMED") {
            //   this.dataSet2.submitSelected();
            // }
          },
        }
      ];
    },
  },
  methods: {
    // tab栏切换
    onTabIndexChange(index) {
      if (index === 1) {
        this.type = "TO_BE_CONFIRMED";
        this.dataSet1.editable = false;
        this.dataSet1.refresh();
      } else if (index === 2) {
        this.type = "CONFIRMED";
        this.dataSet2.editable = false;
        this.dataSet2.refresh();
      } else {
        this.type = "ALL";
        this.dataSet0.editable = true;
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
        name: "UnnerGyMyOrderDetail",
        query: { poHeaderId, orgName, unreadCount, displayPoNum }
      });
    },
  },
};
</script>

<style lang="stylus" scoped>

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
