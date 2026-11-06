<!--
 * @Descripttion:
 * @version:
 * @Author: yanglin
 * @Date: 2022-07-06 17:08:57
 * @LastEditors: yanglin
 * @LastEditTime: 2022-07-12 11:37:02
-->
<template>
  <srm-popup
    height="40%"
    :show-header="false"
    :title="title"
    :visible="visible"
    position="top"
    @onClose="onCancel()">
    <div class="poppup-content">
      <srm-textarea-field v-model="suspendRemark" :placeholder="placeholder" class="poppup-content-textarea" />
      <div class="poppup-bottom-btns">
        <srm-button class="footer-button footer-button-left" size="large" rect full-width @click="onCancel()" >{{ cancelText }}</srm-button>
        <srm-button class="footer-button" type="primary" size="large" fill rect full-width @click="onSuspend()" >{{ okText }}</srm-button>
      </div>
    </div>
  </srm-popup>
</template>

<script>
import { $T } from "srm-mobile-ui";
import { saveSuspendConfigure } from "../api";
export default {
  name: "SuspendPopup",
  modules: [ "sprm.purchaseRequisitionAssign", "sprm.common", "smbl.common" ],
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    checkedList: {
      type: Array,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: [],
    }
  },
  data() {
    return {
      title: $T("sprm.purchaseRequisitionAssign.view.button.suspend").$D("暂挂"),
      okText: $T("sprm.purchaseRequisitionAssign.view.button.suspend").$D("暂挂"),
      cancelText: $T("hzero.common.button.cancel").$D("取消"),
      placeholder: $T("sprm.purchaseRequisitionAssign.view.message.enterSuspendRemark").$D("请输入暂挂原因"),
      visible: false,
      suspendRemark: "",
    };
  },
  watch: {
    value(val) {
      this.visible = val;
    },
  },
  methods: {
    onCancel() {
      this.suspendRemark = "";
      this.$emit("input", false);
    },
    onSuspend() {
      this.$loading.show();
      saveSuspendConfigure({
        prLineVOS: this.checkedList.map((ele) => ele.toData()),
        values:{
          suspendRemark: this.suspendRemark,
        }
      }).then((res) => {
        if (res && !res.failed) {
          this.$notification.open({
            message: this.$T("smbl.common.message.acction.success").$D("操作成功"),
            class: "notification"
          });
          this.$emit("onSuccess");
          this.onCancel();
        }
      }).finally(() => {
        this.$loading.hide();
      });
    },
  }
};
</script>

<style lang="stylus" scoped>

.poppup-content{
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.poppup-content-textarea{
    height: calc( 100% - 48px );
}

.poppup-bottom-btns{
    display: flex;
    width: 100%;
}

.footer-button{
    height: 48px;
    border-radius: initial !important;
}

.footer-button-left{
    background: #FFFFFF !important;
    color: #AFAFAF !important;
}

>>> .srm-field-wrapper{
    height: 100% !important;
}

>>> .srm-textarea-parent-empty{
    height: 100% !important;
}

>>> .srm-textarea {
    height: 100% !important;
}

</style>
