<template>
  <div style="height: 100vh">
    <srm-list :data-set="dataSet"
              customize-code="SMBL.ORDER_CONFIRMATION.LIST"
              :columns="getColumns"
              :buttons="getButtons"
              @itemClick="goToDetail"/>
  </div>
</template>

<script>

import indexDS from "../datasource/indexDS";
import { DataSet } from "srm-mobile-ui";
import { confirmOrderListApi, getOrderConfirmField } from "../api/index";

export default {
  modules: [ "hipspfm.orderConfirmation", "sodr.sendOrder", "sodr.confirmOrder", "hipspfm.common", "sodr.common", "smbl.common", "entity.customer", "entity.order", "sodr.orderApproval", "hipspfm.orderApproval" ],
  name: "OrderConfirmationList",
  components: {
  },
  data() {
    return {
      dataSet: new DataSet(indexDS()),
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
            if (item.statusCode === "DELIVERY_DATE_REJECT" || item.cancelledFlag === 1) {
              clsaaStyle = "srm-span-right-slot-red";
            } else if (item.publishCancelFlag === 1) {
              clsaaStyle = "srm-span-right-slot-yellow";
            } else {
              clsaaStyle = "srm-span-right-slot-green";
            }
            return <SrmListHeader>
              <span>{item.displayPoNum}</span>
              {
                item.urgentFlag === 1 && <span class="srm-span-slot">{ this.$T("sodr.confirmOrder.view.message.urgent").$D("加急") }</span>
              }
              <span slot="right" class={ clsaaStyle }>{item.statusCodeMeaning}</span>
            </SrmListHeader>;
          }
        },
        {
          fieldName: this.$T("entity.customer.tag").$D("客户"),
          fieldCode: "companyName",
        },
        {
          fieldName: this.$T("sodr.confirmOrder.model.confirmOrder.taxedAmount").$D("含税金额"),
          fieldType: "INPUT_NUMBER",
          fieldCode: "taxIncludeAmount",
          editor: false,
          precision: (val, item, field, record) => {
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
          fieldName: this.$T("sodr.common.model.common.releasedDate").$D("发布日期"),
          fieldCode: "releasedDate",
          render:(val, record) => {
            if (Number(record.unreadCount) > 0) {
              return <div>
                <span>{ val }</span>
                <span style="color: #fd4b4b;margin-left: 15px;font-size: 10px;line-height: 18px;background: rgba(253, 75, 75, 0.1);border-radius: 2px;padding: 2px 8px;font-weight: normal;">
                  { this.$T("smbl.common.view.unread.count", [ Number(record.unreadCount) ]).$D("{count}条未读消息") }
                </span>
              </div>;
            }
            return val;
          }
        },
      ];
    },
    // 按钮
    getButtons() {
      return [
        {
          text: this.$T("sodr.confirmOrder.view.message.confirm").$D("确认"),
          fill: true,
          // type: "danger",
          visible: true,
          disabled: (checkedList) => checkedList.length === 0,
          callback: (checkedList) => {
            const checkedListData = checkedList.map((v) => v.data);
            this.clickConfirm(checkedListData);
          },
        },
        // {
        //   text: this.$T("hipspfm.common.message.pass").$D("通过"),
        //   fill: true,
        //   visible: true,
        //   disabled: (checkedList) => {
        //     return checkedList.length === 0;
        //   },
        //   callback: (checkedList) => {
        //     const checkedListData = checkedList.map((v) => v.data);

        //     this.clickAdopt(checkedListData);
        //   },
        // },
      ];
    },
  },
  async activated() {
    try {
      this.$loading.show();
      //加载订单确认字段属性配置
      await this.getOrderConfirmFieldConfig();
      this.dataSet.refresh();
      this.$loading.hide();
    } catch (err) {
      this.$loading.hide();
      console.log(err, "error");
    }
  },
  methods: {
    goToDetail(item) {
      const { data } = item;
      const { poHeaderId, orgName } = data;

      this.$router.push({
        name: "OrderConfirmationDetail",
        query: { poHeaderId, orgName }
      });
    },
    // 点击确认
    clickConfirm(checkedList) {
      const that = this;
      this.$dialog({
        content:
          this.$T("hipspfm.orderApproval.view.message.passOrderOrNot").$D(
            "是否通过该订单"
          ) + "?",
        closable: false,
        onOk() {
          that.someConfirmList(checkedList);
        }
      });
    },
    //确认通过
    someConfirmList(checkedList) {
      confirmOrderListApi(checkedList).then((res) => {
        if (res) {
          if (res.failed) {
            this.$notification.open({
              message: res.message,
              description: "",
              // eslint-disable-next-line no-undef
              key,
              class: "notification"
            });
          } else {
            this.$notification.open({
              message: this.$T(
                "hipspfm.orderConfirmation.view.message.orderConfirmSuccess"
              ).$D("订单确认成功"),
              description: "",
              // eslint-disable-next-line no-undef
              key,
              class: "notification"
            });
            this.dataSet.refresh();
          }
        }
      });
    },
    //加载字段属性配置，考虑是否加入判断，如果已经存在了缓存数据，不在调用接口
    async getOrderConfirmFieldConfig() {
      await getOrderConfirmField().then((res) => {
        // eslint-disable-next-line no-undefined
        if (res !== undefined && res.length > 0) {
          let tempMap = new Map();
          res.forEach((filedItem) => {
            tempMap.set(filedItem.fieldName, filedItem);
          });
          this.$store.commit("OrderConfirmation/setFieldConfigMap", tempMap);
        }
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

.srm-span-slot{
    border-radius: 2px;
    margin-left: 8px;
    font-size: 10px;
    padding: 1px 10px;
    line-height: 18px;
    width: 30px;
    height: 18px;
    color: var(--color-other-default);
    background: var(--color-bg-default-e);
}

.srm-span-right-slot-yellow {
  margin-right: 15px;
  color: var(--color-other-default-c);
}

.srm-span-right-slot-green {
  margin-right: 15px;
  color: var(--color-other-default-b);
}

.srm-span-right-slot-red {
  margin-right: 15px;
  color: var(--color-other-default);
}

</style>
