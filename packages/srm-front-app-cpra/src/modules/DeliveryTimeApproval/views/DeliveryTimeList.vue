<template>
  <div style="height: 100vh">
    <srm-list
      :data-set="dataSet"
      customize-code="SMBL.DELIVERY_TIME.LIST"
      :columns="getColumns"
      :buttons="getButtons"
      @itemClick="goToDetail"/>
  </div>
</template>

<script>
import indexDS from "../datasource/indexDS";
import { DataSet } from "srm-mobile-ui";
import { someAdoptApi, someRejectApi } from "../api/index";

export default {
  modules: [
    "hipspfm.common",
    "sodr.deliveryDateReview",
    "sodr.sendOrder",
    "smbl.common",
  ],
  name: "OrderConfirmationList",
  components: {},
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
          render: (val, item) =>
            <SrmListHeader>
              <span>{item.displayPoNum}</span>
            </SrmListHeader>
          ,
        },
        {
          fieldName: this.$T(
            "sodr.deliveryDateReview.model.common.supplierId"
          ).$D("供应商"),
          fieldCode: "supplierName",
        },
        {
          fieldName: this.$T(
            "sodr.deliveryDateReview.model.deliveryDateReview.agentName"
          ).$D("采购员"),
          fieldCode: "agentName",
        },
        {
          fieldName: this.$T(
            "sodr.deliveryDateReview.model.common.taxIncludeAmount"
          ).$D("含税金额"),
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
              return Number(
                this.$options.filters.calcCurrencyPrecision(
                  record.currencyCode,
                  "financialPrecision"
                )
              );
            }
          },
        },
        // {
        //   fieldName: "承诺交货日期",
        //   fieldCode: "feedbackDate",
        //   labelCode: "sodr.common.model.common.promiseDeliveryDate",
        //   render:(val,record)=>{
        //     if (Number(record.unreadCount) > 0) {
        //       return <span>{ val + " " }</span>
        //               <span style="color: #fd4b4b;margin-left: 15px;font-size: 10px;line-height: 18px;background: rgba(253, 75, 75, 0.1);border-radius: 2px;padding: 2px 8px;font-weight: normal;">
        //                 { this.$T("smbl.common.view.unread.count",[ Number(record.unreadCount) ]).$D("{count}条未读消息") }
        //               </span>;
        //     }
        //     return val;
        //   }
        // },
        {
          fieldName: this.$T(
            "sodr.deliveryDateReview.model.common.feedbackTime"
          ).$D("交期反馈时间"),
          fieldCode: "feedbackDate",
          render: (val, record) => {
            if (Number(record.unreadCount) > 0) {
              return <div>
                <span>{val}</span>
                <span style="color: #fd4b4b;margin-left: 15px;font-size: 10px;line-height: 18px;background: rgba(253, 75, 75, 0.1);border-radius: 2px;padding: 2px 8px;font-weight: normal;">
                  {this.$T("smbl.common.view.unread.count", [
                    Number(record.unreadCount),
                  ]).$D("{count}条未读消息")}
                </span>
              </div>;
            }
            return val;
          },
        },
      ];
    },
    // 按钮
    getButtons() {
      return [
        {
          text: this.$T("hipspfm.common.action.approved").$D("同意"),
          fill: true,
          // type: "danger",
          visible: true,
          disabled: (checkedList) => checkedList.length === 0,
          callback: (checkedList) => {
            const checkedListData = checkedList.map((v) => v.data);
            this.clickAdopt(checkedListData);
          },
        },
        {
          text: this.$T("sodr.deliveryDateReview.view.button.sendBack").$D(
            "退回"
          ),
          fill: true,
          type: "danger",
          visible: true,
          disabled: (checkedList) => checkedList.length === 0,
          callback: (checkedList) => {
            const checkedListData = checkedList.map((v) => v.data);
            this.clickReject(checkedListData);
          },
        },
      ];
    },
  },
  activated() {
    this.dataSet.query();
  },
  methods: {
    goToDetail(item) {
      const { data } = item;
      const { poHeaderId, orgName } = data;

      this.$router.push({
        name: "DeliveryTimeDetail",
        query: { poHeaderId, orgName },
      });
    },
    // 点击同意
    clickAdopt(checkedList) {
      const that = this;
      this.$hips.dialog.confirm({
        content:this.$T("sodr.deliveryDateReview.view.message.confirmAgree").$D("是否同意交期审核") + "？",
        okText: this.$T("hipspfm.common.button.ok").$D("确定"),
        cancelText: this.$T("hipspfm.common.button.cancle").$D("取消"),
        closable: false,
        onOk() {
          that.someAdoptList(checkedList);
        },
      });
    },
    //确认通过
    someAdoptList(checkedList) {
      someAdoptApi(checkedList).then((res) => {
        if (res) {
          if (res.failed) {
            this.$notification.open({
              message: res.message,
              description: "",
              class: "notification",
              duration: 1.5,
            });
          } else {
            this.$notification.open({
              message: this.$T("hipspfm.common.message.operationSuccessful").$D(
                "操作成功"
              ),
              description: "",
              class: "notification",
              duration: 1.5,
            });
            this.dataSet.refresh();
          }
        }
      });
    },
    //点击退回
    clickReject(checkedList) {
      const that = this;
      this.$hips.dialog.confirm({
        content:this.$T("sodr.deliveryDateReview.view.message.confirmReject").$D("是否退回交期审核"
        ) + "?",
        okText: this.$T("hipspfm.common.button.ok").$D("确定"),
        cancelText: this.$T("hipspfm.common.button.cancle").$D("取消"),
        closable: false,
        onOk() {
          that.someRejectList(checkedList);
        },
      });
    },
    //确认拒绝
    someRejectList(checkedList) {
      someRejectApi(checkedList).then((res) => {
        if (res) {
          if (res.failed) {
            this.$notification.open({
              message: res.message,
              description: "",
              class: "notification",
              duration: 1.5,
            });
          } else {
            this.$notification.open({
              message: this.$T("hipspfm.common.message.operationSuccessful").$D(
                "操作成功"
              ),
              description: "",
              class: "notification",
              duration: 1.5,
            });
            this.dataSet.refresh();
          }
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

.srm-red {
  color: #fd4b4b;
    text-align: right;
    font-size: 10px;
    line-height: 18px;
    background: rgba(253, 75, 75, 0.1);
    border-radius: 2px;
    padding: 2px 8px;
    font-weight: normal;
}
</style>
