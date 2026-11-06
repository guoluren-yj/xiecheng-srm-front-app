<template>
  <div style="height: 100vh">
    <srm-list :data-set="dataSet"
              :columns="getColumns"
              :buttons="getButtons"
              @itemCheck="onItemCheck"
              @itemClick="onItemClick"/>

    <!-- 详情弹框 -->
    <srm-popup :visible.sync="visiblePopup"
               :position="'right'"
               :show-header="false"
               :height="'100%'">
      <srm-form
        v-if="visiblePopup"
        customize-type="detail"
        :data-set="popupData.data"
        :columns="getDetailColumns"/>
    </srm-popup>
  </div>
</template>

<script>
import { dateFormat } from "@/utils/index";
import indexDS from "../datasource/indexDS";
import { DataSet, $T } from "srm-mobile-ui";
import { someAdoptApi, someRejectApi } from "../api/index";

export default {
  modules: [ "hzero.common", "hipspfm.common", "sodr.orderApproval", "hipspfm.workFlow", "sinv.deliveryApproved" ],
  name: "OrderApprovalList",
  data() {
    return {
      dataSet: new DataSet(indexDS()),
      visiblePopup: false,
      popupData: {},
    };
  },
  computed: {
    getColumns() {
      return [
        {
          formRow: 10,
          fieldCode: "head",
          fieldType: "EMPTY",
          render: (val, item) => <SrmListHeader>
            <span>{item.displayPoNum}-{item.displayLineNum}</span>
            <span slot="right" style="color: #333;">{$T("sodr.orderApproval.model.common.supplier").$D("供应商")}：{item.supplierName}</span>
          </SrmListHeader>
        },
        {
          fieldName: $T("sodr.orderApproval.model.common.items").$D("物料"),
          fieldCode: "itemName",
          formRow: 20,
        },
        {
          fieldName: `${$T("sodr.orderApproval.model.common.quantity").$D("数量")}/${$T("sodr.orderApproval.model.common.uomName").$D("单位")}`,
          fieldCode: "quantity",
          formRow: 20,
          render:(val, item) => `${val} ${item.uomCode}`
        },
        {
          fieldName: `${$T("sodr.orderApproval.model.common.price").$D("单价")}/${$T("sodr.orderApproval.model.common.unitPriceBatch").$D("每")}`,
          fieldCode: "enteredTaxIncludedPrice",
          formRow: 30,
          render:(val, item) => `${val}/${item.unitPriceBatch}`
        },
        {
          fieldName: $T("sodr.orderApproval.model.common.lineAmountNew").$D("行金额"),
          fieldCode: "taxIncludedLineAmount",
          fieldType: "INPUT_NUMBER",
          editor: false,
          formRow: 30,
        },
      ];
    },
    getDetailColumns() {
      return [
        {
          fieldCode: "displayPoNum",
          fieldName: $T("sodr.orderApproval.model.common.displayPoNum").$D("订单号"),
        },
        {
          fieldCode: "displayLineNum",
          fieldName: $T("sodr.orderApproval.model.common.displayLineNum").$D("行号"),
        },
        {
          fieldCode: "agentName",
          fieldName: $T("sodr.orderApproval.model.common.agentName").$D("采购员"),
        },
        {
          fieldCode: "creationDate",
          fieldName: $T("sodr.orderApproval.model.common.creationDate").$D("订单创建时间"),
        },
        {
          fieldCode: "taxIncludeAmount",
          fieldName: $T("sodr.orderApproval.model.common.taxIncludeAmount").$D("含税金额"),
        },
        {
          fieldCode: "supplierName",
          fieldName: $T("sodr.orderApproval.model.common.supplier").$D("供应商"),
        },
        {
          fieldCode: "itemCode",
          fieldName: $T("sodr.orderApproval.model.common.itemCode").$D("物料编码"),
        },
        {
          fieldCode: "itemName",
          fieldName: $T("sodr.orderApproval.model.common.itemName").$D("物料名称"),
        },
        {
          fieldCode: "quantity",
          fieldName: $T("sodr.orderApproval.model.common.quantity").$D("需求数量"),
        },
        {
          fieldCode: "uomCode",
          fieldName: $T("sodr.orderApproval.model.common.uomCode").$D("单位"),
        },
        {
          fieldCode: "needByDate",
          fieldName: $T("sodr.orderApproval.model.common.needByDate").$D("需求日期"),
          render: (val) => val ? dateFormat(val) : "-",
        },
        // {
        //   fieldCode: "",
        //   fieldName: $T("sodr.orderApproval.model.common.").$D("最近一次采购价"),
        // },
        {
          fieldCode: "unitPrice",
          fieldName: $T("sodr.orderApproval.model.common.unitPrice").$D("不含税单价"),
        },
        {
          fieldCode: "enteredTaxIncludedPrice",
          fieldName: $T("sodr.orderApproval.model.common.enteredTaxIncludedPrice").$D("含税单价"),
        },
        {
          fieldCode: "unitPriceBatch",
          fieldName: $T("sodr.orderApproval.model.common.unitPriceBatch").$D("每"),
        },
        {
          fieldCode: "lineAmount",
          fieldName: $T("sodr.orderApproval.model.common.lineAmount").$D("不含税行金额"),
        },
        {
          fieldCode: "taxIncludedLineAmount",
          fieldName: $T("sodr.orderApproval.model.common.taxIncludedLineAmount").$D("含税行金额"),
        },
        {
          fieldCode: "taxRate",
          fieldName: $T("sodr.orderApproval.model.common.taxRate").$D("税率"),
        },
        {
          fieldCode: "currencyCode",
          fieldName: $T("sodr.orderApproval.model.common.currencyName").$D("币种"),
        },
        // {
        //   fieldCode: "invOrganizationName",
        //   fieldName: $T("sodr.orderApproval.model.common.invOrganizationName").$D("收货组织"),
        // },
        // {
        //   fieldCode: "remark",
        //   fieldName: $T("sodr.orderApproval.model.common.remark").$D("备注"),
        // },
      ];
    },
    // 按钮
    getButtons() {
      return [
        {
          text: $T("hipspfm.common.button.approvalReject").$D("审批拒绝"),
          fill: true,
          type: "danger",
          visible: true,
          disabled: (checkedList) => checkedList.length === 0,
          callback: (checkedList) => {
            // const that = this;
            // that.$dialog({
            //   content: $T("sodr.orderApproval.model.common.confirmRejectedText", [ checkedList.length ]).$D("您勾选的订单一共包含{length}个订单行,是否确认审批拒绝订单") + "?",
            //   onOk() {
            //     that.patchApi("", checkedList.map((res) => res.data));
            //   },
            //   onCancel() {
            //   },
            // });
            this.$confirm({
              required: true,
              title: this.$T("sodr.orderApproval.view.message.panel.approveInfo").$D("审批信息"),
              placeholder:$T("sodr.orderApproval.model.common.confirmRejectedText", [ checkedList.length ]).$D("您勾选的订单一共包含{length}个订单行,是否确认审批拒绝订单") + "?",
              onOk: (remark, close) => {
                close();
                this.patchApi("", checkedList.map((res) => res.data), remark);
              }
            });
          },
        },
        {
          text: $T("hipspfm.common.button.approved").$D("审批通过"),
          fill: true,
          visible: true,
          disabled: (checkedList) => checkedList.length === 0,
          callback: (checkedList) => {
            const that = this;
            that.$dialog({
              content: $T("sodr.orderApproval.model.common.confirmApprovaledText", [ checkedList.length ]).$D("您勾选的订单一共包含{length}个订单行,是否确认审批通过订单") + "?",
              onOk() {
                that.patchApi("approved", checkedList.map((res) => res.data));
              },
              onCancel() {
              },
            });
          },
        },
      ];
    },
  },
  methods: {
    patchApi(type, list, remark) {
      let poHeaderIds = list.map((res) => res.poHeaderId);
      if (type === "approved") {
        this.$loading.show();
        someAdoptApi({
          poHeaderIds: poHeaderIds
        }).then((res) => {
          if (res && res.failed) {
            this.$notification.open({
              message: this.$T("hipspfm.workFlow.view.message.approvalFailed").$D("审批通过失败"),
              description: res.message,
              class: "notification",
              duration: 3
            });
          } else {
            this.$notification.open({
              message: this.$T("hipspfm.common.view.validation.approvelSuccess").$D("审批通过成功"),
              class: "notification",
              duration: 3
            });
            this.dataSet.refresh();
          }
        }).finally(() => {
          this.$loading.hide();
        });
      } else {
        this.$loading.show();
        someRejectApi({
          poHeaderIds: poHeaderIds,
          rejectRemark:remark
        }).then((res) => {
          if (res && res.failed) {
            this.$notification.open({
              message: this.$T("hipspfm.workFlow.view.message.approvalRefuseFailed").$D("审批拒绝失败"),
              description: res.message,
              class: "notification",
              duration: 3
            });
          } else {
            this.$notification.open({
              message: this.$T("hipspfm.common.view.validation.rejectSuccess").$D("审批拒绝成功"),
              class: "notification",
              duration: 3
            });
            this.dataSet.refresh();
          }
        }).finally(() => {
          this.$loading.hide();
        });
      }
    },
    onItemCheck(selected, checkFlag, item) {
      if (checkFlag) {
        this.dataSet.select(this.dataSet.records.reduce((init, current) => {
          if (current.data.displayPoNum === item.data.displayPoNum) {
            init.push(current);
          }
          return init;
        }, []));
      } else {
        this.dataSet.unSelect(this.dataSet.records.reduce((init, current) => {
          if (current.data.displayPoNum === item.data.displayPoNum) {
            init.push(current);
          }
          return init;
        }, []));
      }
    },
    onItemClick() {
      this.popupData = {
        data: this.dataSet
      };
      this.visiblePopup = true;
    },
  },
};
</script>

<style lang="stylus" scoped>
>>> .customize-detail .form-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .value {
    max-width: 80%;
  }
}
>>> .srm-list-item-card-head .srm-list-item-card-head-right {
  max-width: 50%;
  width: 50%;
  white-space: pre-wrap;
  height: auto;
  text-align: left;
  justify-content: flex-start;
}
</style>