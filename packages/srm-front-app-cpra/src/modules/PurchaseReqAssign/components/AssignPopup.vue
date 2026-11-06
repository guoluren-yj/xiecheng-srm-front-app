<!--
 * @Descripttion:
 * @version:
 * @Author: yanglin
 * @Date: 2022-07-06 17:08:57
 * @LastEditors: yanglin
 * @LastEditTime: 2022-07-13 13:58:42
-->
<template>
  <srm-popup
    :title="title"
    :visible="visible"
    position="bottom"
    rounded
    @onClose="$emit('input', false)">
    <srm-scroll class="purchase-requisition-assign-poppup-content" height="100%" :refreshable="false">
      <srm-form v-if="visible" customize-type="detail" :data-set="dataSet" :columns="getColumns" customize-code="SMBL.PURCHASEREQ.ASSIGN.ASSIGN.POPUP"/>
    </srm-scroll>
    <srm-bottom-handler :btn-arr="getButtons" type="action-sheet"/>
  </srm-popup>
</template>

<script>
import { assignPopupDS } from "../datasource/AssignPopupDs";
import { DataSet, SrmUtil, $T } from "srm-mobile-ui";
import { queryExecutedBys } from "../api/config";
import { saveAssignmentConfigure } from "../api";
const { isEmpty } = SrmUtil;

export default {
  name: "AssignPopup",
  modules: [ "sprm.purchaseRequisitionAssign", "sprm.common", "smbl.common" ],
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    config: {
      type: Object,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: {}
    },
    checkedList: {
      type: Array,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: [],
    }
  },
  data() {
    return {
      title: $T("sprm.purchaseRequisitionAssign.view.title.applyAssign").$D("需求分配"),
      dataSet: new DataSet(assignPopupDS(this.config)),
      visible: false,
    };
  },
  computed: {
    getButtons() {
      return [
        {
          text: $T("hzero.common.button.cancel").$D("取消"),
          bordered: true,
          visible: true,
          disabled: false,
          size: "large",
          handler: () => {
            this.$emit("input", false);
          },
        },
        {
          text: $T("sprm.purchaseRequisitionAssign.view.button.assign").$D("分配"),
          fill: true,
          size: "large",
          type: "primary",
          handler: () => {
            if (this.dataSet.validate()) {
              const data = this.dataSet.toData()[0] || {};
              const {
                executedBys,
                executorName,
                purchaseAgentId,
                executionStrategyCode,
                secondLevelStrategyCode,
                assignedRemark,
                ...attributeObj
              } = data;
              const prLineVOS = this.checkedList
                .map((ele) => ele.toData())
                .map((item) => ({
                  ...item,
                  ...attributeObj,
                  executionStrategyCode,
                  // executionStrategyMeaning: data.executionStrategyMeaning,
                }));
              this.$loading.show();
              queryExecutedBys({ purchaseAgentId }).then((res) => {
                if (isEmpty(res?.content)) {
                  this.$notification.open({
                    message: $T("sprm.common.model.common.buyerNoUser").$D("该采购员未维护用户，请更换采购员"),
                    class: "notification",
                  });
                  this.$loading.hide();
                } else if (res && !res.failed) {
                  saveAssignmentConfigure({
                    prLineVOS,
                    values: {
                      executionStrategyCode,
                      secondLevelStrategyCode,
                      assignedRemark,
                      ...data,
                      customizeUnitCode: "SPRM.PURCHASE_EXECUTION.NOTASSIGN.MODAL",
                      executedBys: isEmpty(executedBys) ? executedBys : executedBys.split(","),
                      executorName: isEmpty(executorName) ? executorName : executorName.split(","),
                    },
                  }).then((result) => {
                    if (result && !result.failed) {
                      this.$notification.open({
                        message: this.$T("smbl.common.message.acction.success").$D("操作成功"),
                        class: "notification"
                      });
                      this.$emit("onSuccess");
                      this.$emit("input", false);
                    }
                  }).finally(() => {
                    this.$loading.hide();
                  });
                }
              });
            }
          },
        },
      ];
    },
    getColumns() {
      return [
        {
          fieldCode: "purchaseAgentId",
        },
        {
          fieldCode: "executedBys",
        },
        {
          fieldCode: "executionStrategyCode",
        },
        {
          fieldCode: "secondLevelStrategyCode",
        },
        {
          fieldCode: "assignedRemark",
        }
      ];
    },
  },
  watch: {
    value(val) {
      this.visible = val;
    },
    config(val) {
      const newDataSet = new DataSet(assignPopupDS(val));
      newDataSet.create({
        ...val?.defaultValue || {},
      }, 0);
      newDataSet.locate(0);
      this.dataSet = newDataSet;
    },
  },
};
</script>

<style lang="stylus" scoped>

.purchase-requisition-assign-poppup-content{
  height: 100%;
  padding-bottom: 60px;
}

</style>
