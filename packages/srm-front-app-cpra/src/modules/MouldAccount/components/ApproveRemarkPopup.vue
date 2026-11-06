<template>
  <srm-popup
    height="40%"
    :show-header="false"
    :title="title"
    :visible="visible"
    position="top"
    @onClose="onCancel()">
    <div class="poppup-content">
      <srm-textarea-field v-model="approvedRemark" :placeholder="placeholder" class="poppup-content-textarea" />
      <span v-if="showRequiredFlag" class="required-text" >{{ requiredText }}</span>
      <div class="poppup-bottom-btns">
        <srm-button class="footer-button footer-button-left" size="large" rect full-width @click="onCancel()" >{{ cancelText }}</srm-button>
        <srm-button class="footer-button" type="primary" size="large" fill rect full-width @click="onSure()" >{{ okText }}</srm-button>
      </div>
    </div>
  </srm-popup>
</template>

<script>
import { $T } from "srm-mobile-ui";
export default {
  name: "ApproveRemarkPopup",
  modules: [ "siec.mould", "hzero.common", "smbl.common" ],
  props: {
    value: {
      type: Boolean,
      default: true,
    },
    requiredFlag: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      title: $T("siec.mould.model.common.approveRemark").$D("审批意见"),
      okText: $T("hzero.common.button.ok").$D("确定"),
      cancelText: $T("hzero.common.button.cancel").$D("取消"),
      requiredText: $T("siec.mould.view.message.approveRemark").$D("请输入审批意见"),
      placeholder: $T("siec.mould.view.message.approveRemark").$D("请输入审批意见"),
      visible: false,
      showRequiredFlag: false,
      approvedRemark: "",
    };
  },
  watch: {
    value(val) {
      this.visible = val;
    },
    approvedRemark(val){
        if(val){
            this.showRequiredFlag = false;
        }
    }
  },
  methods: {
    onCancel() {
      this.approvedRemark = "";
      this.$emit("input", false);
    },
    onSure() {
      if(this.requiredFlag && !this.approvedRemark){
        this.showRequiredFlag = true;
        return;
      }else{
        this.$emit("onSuccess", this.approvedRemark);
      }
    //   this.$loading.show();
    //   saveSuspendConfigure({
    //     prLineVOS: this.checkedList.map((ele) => ele.toData()),
    //     values:{
    //       approvedRemark: this.approvedRemark,
    //     }
    //   }).then((res) => {
    //     if (res && !res.failed) {
    //       this.$notification.open({
    //         message: this.$T("smbl.common.message.acction.success").$D("操作成功"),
    //         class: "notification"
    //       });
    //       this.$emit("onSuccess");
    //       this.onCancel();
    //     }
    //   }).finally(() => {
    //     this.$loading.hide();
    //   });
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

