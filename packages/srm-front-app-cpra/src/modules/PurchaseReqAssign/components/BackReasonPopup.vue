<!--
 * @Descripttion:
 * @version:
 * @Author: yanglin
 * @Date: 2022-07-06 17:08:57
 * @LastEditors: yanglin
 * @LastEditTime: 2022-07-12 11:38:19
-->
<template>
  <srm-popup
    :show-header="false"
    height="40%"
    :title="title"
    :visible="visible"
    position="top"
    @onClose="onCancel()">
    <div class="poppup-content">
      <srm-textarea-field v-model="backToUnassignReason" :placeholder="placeholder" class="poppup-content-textarea"/>
      <span v-if="requiredFlag" class="required-text" >{{ requiredText }}</span>
      <div class="poppup-bottom-btns">
        <srm-button class="footer-button footer-button-left" size="large" rect full-width @click="onCancel()" >{{ cancelText }}</srm-button>
        <srm-button class="footer-button" type="primary" size="large" fill rect full-width @click="onSuspend()" >{{ okText }}</srm-button>
      </div>
    </div>
  </srm-popup>
</template>

<script>
import { SrmUtil, $T } from "srm-mobile-ui";
import { returntoassign } from "../api";
const { isEmpty } = SrmUtil;

export default {
  name: "BackReasonPopup",
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
      title: $T("sprm.common.view.btn.returntoassign").$D("退回至待分配"),
      okText: $T("sprm.common.view.btn.returntoassign").$D("退回至待分配"),
      cancelText: $T("hzero.common.button.cancel").$D("取消"),
      placeholder: $T("sprm.purchaseRequisitionAssign.view.message.enterBackReason").$D("请输入退回原因"),
      visible: false,
      backToUnassignReason: "",
      requiredFlag: false,
      requiredText: $T("sprm.purchaseRequisitionAssign.view.message.backReasonRequired").$D("退回原因必输"),
    };
  },
  watch: {
    value(val) {
      this.visible = val;
    },
    backToUnassignReason(val) {
      if (val) {
        this.requiredFlag = false;
      } else {
        this.requiredFlag = true;
      }
    }
  },
  methods: {
    onCancel() {
      this.backToUnassignReason = "";
      this.$emit("input", false);
    },
    onSuspend() {
      if (!this.backToUnassignReason) {
        this.requiredFlag = true;
      } else {
        this.$loading.show();
        returntoassign({
          prLineVOS: this.checkedList.map((ele) => ele.toData()),
          values:{
            backToUnassignReason: this.backToUnassignReason,
          }
        }).then((res) => {
          if (res && !res.failed || isEmpty(res)) {
            this.$notification.open({
              message: this.$T("smbl.common.message.acction.success").$D("操作成功"),
              class: "notification"
            });
            this.onCancel();
            this.$emit("onSuccess");
          }
        }).finally(() => {
          this.$loading.hide();
        });
      }
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

.required-text {
    margin-left: 4px;
    position: absolute;
    bottom: 50px;
    z-index: 9999;
    font-size: 14px;
    color: red;
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
