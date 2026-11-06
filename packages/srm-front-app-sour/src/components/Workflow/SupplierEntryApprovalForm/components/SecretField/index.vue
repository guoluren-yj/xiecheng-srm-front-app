<template>
  <div>
    <span>{{ showValue }}</span>
    <srm-button v-if="encryptionFlag" style="marginLeft: 5px" size="small" icon="icon-info-circle" plain @click="showSecretFieldPopup"/>
  </div>
</template>

<script>
import {
  checkCaptchaApi,
  desensitizeCaptchaApi,
} from "./api";
import { SrmUtil } from "srm-mobile-ui";
export default {
  modules: [ "smbl.common", "spfm.enterprise", "spfm.bank", "ssrc.inquiryHall" ],
  name: "SecretField",
  props: {
    value: {
      type: String
    },
    lineToken: {
      type: String
    },
    title: {
      type: String
    },
  },
  data() {
    return {
      encryptionFlag:false,
      userInfo: SrmUtil.getUserInfo(),
      showValue: "",
      secretInfo:{
        type:"", //验证方式选择
        verificationNumber:"", //验证号码
        captcha:"", //验证码
        captchaKey:"",
        _token: this.lineToken,
      },
    };
  },
  computed:{
    getSecretColumns() {
      return [
        {
          fieldName:this.$T("smbl.common.view.verificationModeSelection").$D("验证方式选择"),
          fieldCode: "type",
          fieldType: "SELECT",
          options: {
            displayField: "meaning",
            valueField: "value",
            listData: [
              { value: "phone", meaning: this.$T("smbl.common.view.mobilePhone").$D("电话"), orderSeq: 1 },
              { value: "email", meaning: this.$T("smbl.common.view.email").$D("邮箱"), orderSeq: 2 },
            ],
            callback:(val) => {
              this.secretInfo.type = val[0].value;
              this.setVerificationNumber();
            }
          },
          defaultValue:{
            value: "phone",
            meaning: this.$T("smbl.common.view.mobilePhone").$D("电话")
          }
        },
        {
          fieldName:this.$T("smbl.common.view.verificationNumber").$D("验证号码"),
          fieldCode: "verificationNumber",
          fieldType: "INPUT",
          disabled:true,
        },
        {
          fieldName:this.$T("smbl.common.view.captcha").$D("验证码"),
          fieldCode: "captcha",
          fieldType: "EMPTY",
          render: () => <srm-flex justify="between">
            <srm-input-field style={{ width: "60%" }} v-model={this.secretInfo.captcha} placeholder={this.$T("smbl.common.view.captcha").$D("验证码") + ":"} show-icon={false}/>
            <div onClick={() => this.desensitizeCaptcha()} class="srm-captcha-text">{ this.$T("smbl.common.view.getCaptcha").$D("获取验证码") }</div>
          </srm-flex>
        },
      ];
    },
  },
  mounted() {
    this.showValue = this.value;
    // 判断是否加密数据
    if (this.showValue.indexOf("**") !== -1) {
      this.setEncryptionFlag(true);
    }
  },
  methods: {
    setEncryptionFlag(val = false) {
      this.encryptionFlag = val;
    },
    // 获取验证码
    desensitizeCaptcha() {
      const { type } = this.secretInfo;
      const params = {
        type,
      };
      desensitizeCaptchaApi(params).then((res) => {
        if (res) {
          if (res.failed) {
            this.$notification.open({
              message: res.message,
              class: "notification"
            });
          } else {
            const { captchaKey, success } = res;
            this.secretInfo.captchaKey = captchaKey;
            if (success) {
              this.$notification.open({
                message: this.$T("smbl.common.view.message.captchaSendSuccess").$D("发送验证码成功，请注意查收！"),
                class: "notification"
              });
            }
          }
        }
      });
    },
    // 检验验证码
    checkCaptchaInfo() {
      const { type, captcha, captchaKey, _token } = this.secretInfo;
      const params = {
        type,
        captcha,
        captchaKey,
        _token,
        action:"query",
        fieldName:"bankAccountNum",
      };
      if (captchaKey) {
        checkCaptchaApi(params).then((res) => {
          if (res) {
            if (res.failed) {
              this.$notification.open({
                message: res.message,
                class: "notification"
              });
            } else {
              this.showValue = res;
              this.setEncryptionFlag(false);
            }
          }
        });
      } else {
        this.$notification.open({
          message: this.$T("smbl.common.view.message.pleaseGetCaptcha").$D("请先获取验证码"),
          class: "notification"
        });
      }
    },
    // 切换验证号码
    setVerificationNumber() {
      const { type } = this.secretInfo;
      const verificationNumberTemp = type === "email" ? this.userInfo.email : this.userInfo.phone;
      this.secretInfo.verificationNumber = verificationNumberTemp;
    },
    showSecretFieldPopup() {
      this.setVerificationNumber();
      this.$dialog({
        title: this.title,
        content: <srm-flex class="approve-form" direction="column">
          <srm-flex class="approve-remark-box" direction="column" align="start">
            <srm-flex style="margin-bottom: 60px;">
              <customize ref="inputView" need-padding={true} data-source={this.secretInfo} columns={this.getSecretColumns} />
            </srm-flex>
          </srm-flex>
        </srm-flex>,
        onOk: () => {
          this.checkCaptchaInfo();
        },
      });
    },
  }
};
</script>

<style lang="stylus" scoped>
.approve-form {
  font-size: 14px;
  padding 20px 0;
}

.approve-remark-box {
  padding 0 15px 0 10px;

  h5 {
    color: #1B1E2B;
    line-height: 20px;
    font-weight: bold;
    margin-left 5px;
  }
}

.srm-captcha-text {
  font-size: 12px;
  color: #276EF1;
  line-height: 16px;
  font-weight: 500;
}
</style>
