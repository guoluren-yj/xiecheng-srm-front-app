<!-- eslint-disable vue/valid-v-for -->
<template>
  <div style="height: 100%">
    <srm-flex class="srm-box-num-container" direction="column" align="start">
      <div class="srm-box-num-container-input">
        <input ref="inputLabelCode" v-model.trim="labelCode" class="srm-box-num-container-input-out"
               type="text" :placeholder="$T('scux.BoxCodeBinding.model.labelCode').$D('箱码')"
               autofocus
               @keyup.enter="()=>setLabelCode('labelCode')">
        <em slot="right" class="srm-icon icon-scan" style="font-size: 24px" @click="scanCodeForBoxNum()"/>
      </div>
      <div class="srm-box-num-container-input" style="margin-top: 10px">
        <input ref="inputUniqueNum" v-model.trim="uniqueNum"
               class="srm-box-num-container-input-inner" :placeholder="$T('scux.BoxCodeBinding.model.uniqueNum').$D('唯一码')" type="text" @keyup.enter="()=>setLabelCode('uniqueNum')">
        <em slot="right" class="srm-icon icon-scan" style="font-size: 24px" @click="scanCodeForUniqueNum()"/>
      </div>
      <span class="srm-box-num-container-detail">{{
        $T("scux.BoxCodeBinding.modal.boxNum").$D("扫描明细：(")
      }}{{ boxNow }}{{ "/" }}{{ boxMax }}{{ ")" }}</span>
      <div class="srm-box-num-container-check">
        <srm-checkbox-group v-for="item in boxArr" :value="chooseUniqueNumItems" :selection="100">
          <srm-checkbox :show-checkbox="false" style="margin-bottom: 5px" :option="item">{{ item }}</srm-checkbox>
        </srm-checkbox-group>
      </div>
    </srm-flex>
    <srm-button-group class="srm-box-num-container-button"
                      :buttons="getBtnArr"/>
  </div>
</template>

<script>
import { DataSet, $T, } from "srm-mobile-ui";
import { boxBindApi } from "../api/index";
import { closeWebView } from "srm-mobile-ui/src/utils/jsBridge";
import SrmAppCore from "srm-front-app-core";
import { isEmpty } from "@/utils/index";
import { formDs, listDs } from "../datasource/index";
export default {
  modules: [ "scux.BoxCodeBinding" ],
  name: "BoxCodeBinding",
  data() {
    return {
      focusFlag: true,
      boxArr: [],
      fullFlag: false,
      boxNow: 0,
      boxMax: 0,
      labelCode: "",
      uniqueNum: "",
      code: "",
      formDataDs: new DataSet(formDs()),
      listDataDs: new DataSet(listDs()),
      uniqueNumItems: [],
      chooseUniqueNumItems:[],
      beforeCode: "", // 记录上一次扫的箱码
    };
  },
  computed:{
    getBtnArr() {
      return [
        {
          name: "cancel",
          text: $T("scux.BoxCodeBinding.button.cancel").$D("取消"),
          type: "danger",
          bordered: true,
          visible:true,
          size: "x-large",
          callback: () => {
            this.handleCancel();
          }
        },
        {
          name: "bind",
          text:  $T("scux.BoxCodeBinding.button.bind").$D("绑定"),
          type: "primary",
          bordered: true,
          visible:true,
          size: "x-large",
          callback: () => {
            this.bindSave();
          }
        }
      ];
    },
  },
  created() {
    this.formDataDs.create({
    }, 0);
  },
  mounted() {
  },
  methods: {
    getListColumns() {
      return [
        {
          fieldCode: "uniqueNum",
        },
      ];
    },
    getFormColumns() {
      return [
        {
          fieldCode: "labelCode",
          editor: true,
          render: (val, item, field) =>
            <srm-input-field
              name="labelCode"
              showIcon={false}
              ref="labelCode"
              autoFocus={this.focusFlag}
              theme="fill"
              onEnter={(value) => {
                const { fieldCode } = field;
                this.setLabelCode(fieldCode, value);
              }}
            >
              <span slot="left" class="srm-field-left-label">
                <span class="srm-input-prefix">
                  <span style="margin-right: 12px;">
                    {$T("scux.BoxCodeBinding.model.labelCodeInput").$D("箱码: ")}
                  </span>
                </span>
              </span>
              <em slot="right" class="srm-icon icon-scan" onclick={this.scanCodeForBoxNum}/>
            </srm-input-field>
        },
        {
          fieldCode: "uniqueNum",
          editor: true,
          render: (val, item, field) =>
            <srm-input-field
              name="uniqueNum"
              showIcon={false}
              autoFocus={!this.focusFlag}
              ref="uniqueNum"
              theme="fill"
              onEnter={(value) => {
                const { fieldCode } = field;
                this.setLabelCode(fieldCode, value);
              }}
            >
              <span slot="left" class="srm-field-left-label">
                <span class="srm-input-prefix">
                  <span style="margin-right: 12px;">
                    {$T("scux.BoxCodeBinding.model.uniqueNums").$D("唯一码: ")}
                  </span>
                </span>
              </span>
              <em slot="right" class="srm-icon icon-scan" onclick={this.scanCodeForUniqueNum}/>
            </srm-input-field>
        },
        {
          fieldCode: "fullFlag",
          editor: false,
        },
      ];
    },
    // 扫描后事件，根据不同输入框，触发不同事件
    setLabelCode(fieldCode) {
      if (fieldCode === "labelCode") {
        // 判断是否扫上
        if (isEmpty(this.labelCode)) {
          this.$notification.open({
            message: $T(
              "scux.BoxCodeBinding.message.please.enter.scanCodeError"
            ).$D("设备扫码失败，请点击输入框，重新扫码！"),
            class: "notification",
          });
          this.$refs.inputLabelCode.focus();
          return;
        }
        // 判断是否二次扫了箱码
        if (!isEmpty(this.beforeCode)) {
          this.$notification.open({
            message: $T(
              "scux.BoxCodeBinding.message.please.enter.twoScanCodeNo"
            ).$D("请勿重复扫描箱码！"),
            class: "notification",
          });
          this.labelCode = this.beforeCode;
          this.$refs.inputUniqueNum.focus();
          return;
        }
        this.beforeCode = this.labelCode;

        // this.labelCode = code;
        // 调请求，获取箱内数量，设置boxMax
        const data = {
          labelCode: this.labelCode,
          operation: "QUERY",
        };
        boxBindApi(data).then((res) => {
          if (res.failed) {
            this.$notification.open({
              message: res.message,
              class: "notification",
            });
            return;
          }
          this.boxMax = res?.unitPackageQuantity;
          this.listDataDs.setQueryParameter({ labelCode: this.labelCode });
          this.listDataDs.refresh();
          this.listDataDs.query().then(() => {
            this.boxArr = this.listDataDs.toData().map((item) => item.uniqueNum);
            this.boxNow = this.listDataDs.toData().length;
            if (Number(this.boxMax) === this.boxNow) {
              this.fullFlag = true;
              this.formDataDs.create({
                "labelCode": this.labelCode,
                "uniqueNum": "",
                "fullFlag": this.fullFlag,
              }, 0);
            }
            this.$refs.inputUniqueNum.focus();
          });
        });
      } else {
        if (isEmpty(this.uniqueNum)) {
          this.$notification.open({
            message: $T(
              "scux.BoxCodeBinding.message.please.enter.scanCodeError"
            ).$D("设备扫码失败，请点击输入框，重新扫码！"),
            class: "notification",
          });
          this.$refs.inputUniqueNum.focus();
          return;
        }
        let code = this.uniqueNum.trim();
        this.uniqueNum = null;
        if (this.boxNow >= this.boxMax) {
          this.$notification.open({
            message: $T(
              "scux.BoxCodeBinding.message.please.enter.changeDetail"
            ).$D("已经满箱！"),
            class: "notification",
          });
          return;
        }
        // 校验是否已经扫描过
        for (let i = 0; i < this.boxArr.length; i++) {
          if (this.boxArr[i] === code) {
            this.$notification.open({
              message: $T(
                "scux.BoxCodeBinding.message.please.enter.repeatScanCode"
              ).$D("该唯一码已扫描过，请勿重复扫描！"),
              class: "notification",
            });
            return;
          }
        }
        // 将code加到下方列表
        this.uniqueNumItems.push({ uniqueNum: code }); // 每次新增的
        this.boxArr.push(code); // 新老一起的
        this.boxNow++; // 箱内数量加1
        if (Number(this.boxNow) === Number(this.boxMax)) {
          this.fullFlag = true;
          this.bindSave();
        }
      }
    },
    // 绑定保存
    bindSave() {
      const data = {
        labelCode: this.labelCode,
        fullFlag: this.fullFlag ? "1" : "0",
        uniqueNums: this.uniqueNumItems,
      };
      this.$loading.show();
      boxBindApi(data).then((res) => {
        if (res.failed) {
          this.$notification.open({
            message: res.message,
            class: "notification",
          });
          this.$loading.hide();
          return;
        }
        this.$notification.open({
          message: $T(
            "scux.BoxCodeBinding.message.please.enter.saveSuccess"
          ).$D("装箱绑定成功！"),
          class: "notification",
        });
        this.$loading.hide();
        this.boxArr = [];
        this.fullFlag = false;
        this.labelCode = null;
        this.beforeCode = null;
        this.uniqueNumItems = [];
        this.boxNow = 0;
        this.$refs.inputLabelCode.focus();
      });
    },
    // 取消
    handleCancel() {
      // this.$router.push({
      //   name: "MenuApplication",
      // });
      try {
        closeWebView();
      } catch (err) {
        this.$router.back();
      }
    },
    // 扫唯一码
    scanCodeForUniqueNum() {
      let that = this;
      SrmAppCore.scanQrCode(function (result) {
        if (result) {
          let code = result;
          if (result.indexOf(",") !== -1) {
            code = result.split(",")[1];
          }
          if (that.boxNow + 1 > that.boxMax) {
            that.$notification.open({
              message: $T(
                "scux.BoxCodeBinding.message.please.enter.changeDetail"
              ).$D("已经满箱！"),
              class: "notification",
            });
            return;
          }
          // 校验是否已经扫描过
          for (let i = 0; i < that.boxArr.length; i++) {
            if (that.boxArr[i] === code) {
              that.$notification.open({
                message: $T(
                  "scux.BoxCodeBinding.message.please.enter.repeatScanCode"
                ).$D("该唯一码已扫描过，请勿重复扫描！"),
                class: "notification",
              });
              return;
            }
          }
          // 将code加到下方列表
          that.uniqueNumItems.push({ uniqueNum: code }); // 每次新增的
          that.boxArr.push(code); // 新老一起的
          that.boxNow++; // 箱内数量加1
          if (Number(that.boxNow) === Number(that.boxMax)) {
            that.fullFlag = true;
            that.formDataDs.create({
              "labelCode": that.labelCode,
              "uniqueNum": "",
              "fullFlag": that.fullFlag,
            }, 0);
            that.bindSave();
          } else {
            that.$refs.inputUniqueNum.focus();
          }
        } else {
          that.$notification.open({
            message: $T(
              "scux.BoxCodeBinding.message.please.enter.reScanCode"
            ).$D("未扫上，请重新扫码！"),
            class: "notification",
          });
        }
      }, function (error) {
        // console.log(that.$T("scux.BoxCodeBinding.view.message.scanAbnormal").$D("扫码异常"), error);
        that.$notification.open({
          message: that.$T("scux.BoxCodeBinding.view.message.scanAbnormal").$D("扫码异常") + (error ? JSON.stringify(error) : ""),
          // key,
          class: "notification",
        });
      });
    },
    // 扫箱码
    scanCodeForBoxNum() {
      let that = this;
      SrmAppCore.scanQrCode(function (result) {
        if (result) {
          let code = result;
          // console.log("result:", result);
          if (result.indexOf(",") !== -1) {
            code = result.split(",")[1];
          }
          that.formDataDs.create({
            "labelCode": code,
          }, 0);
          that.labelCode = code;
          // 调请求，获取箱内数量，设置boxMax
          const data = {
            labelCode: code,
            operation: "QUERY",
          };
          boxBindApi(data).then((res) => {
            if (res.failed) {
              that.$notification.open({
                message: res.message,
                class: "notification",
              });
              return;
            }
            that.boxMax = res?.unitPackageQuantity;
            that.listDataDs.setQueryParameter({ labelCode: that.labelCode });
            that.listDataDs.refresh();
            that.listDataDs.query().then(() => {
              that.boxArr = that.listDataDs.toData().map((item) => item.uniqueNum);
              that.boxNow = that.listDataDs.toData().length;
              if (Number(that.boxMax) === that.boxNow) {
                that.fullFlag = true;
                that.formDataDs.create({
                  "labelCode": that.labelCode,
                  "uniqueNum": "",
                  "fullFlag": that.fullFlag,
                }, 0);
              }
              that.$refs.inputUniqueNum.focus();
            });
          });
        } else {
          that.$notification.open({
            message: $T(
              "scux.BoxCodeBinding.message.please.enter.reScanCode"
            ).$D("未扫上，请重新扫码！"),
            class: "notification",
          });
        }
      }, function (error) {
        // console.log(that.$T("scux.BoxCodeBinding.view.message.scanAbnormal").$D("扫码异常"), error);
        that.$notification.open({
          message: that.$T("scux.BoxCodeBinding.view.message.scanAbnormal").$D("扫码异常") + (error ? JSON.stringify(error) : ""),
          // key,
          class: "notification",
        });
      });
    },
  },
};
</script>
<style scoped lang="stylus">
.srm-box-num-container {
  margin-left 10px;
  margin-top 10px;
  margin-right  10px;
  width: 100%;
  height: 100%;

  .srm-box-num-container-input {
    width 90%;
    background: #eff3fe;
    border-radius :4px;
    .srm-box-num-container-input-out {
      width: 90%;
      height : 35px;
    }

    .srm-box-num-container-input-inner {
      width: 90%;
      height : 35px;
    }
  }
  .srm-box-num-container-detail{
    margin-top: 20px;
    margin-bottom: 20px
  }
  .srm-box-num-container-check {
    overflow-y: scroll;
    height: 55%
  }
}
.srm-box-num-container-button {
  display: flex;
  justify-content: space-between;
  position: absolute;
  bottom: 5%
}
</style>