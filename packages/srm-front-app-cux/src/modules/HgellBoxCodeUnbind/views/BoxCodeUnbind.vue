<template>
  <div style="height: 100vh; overflow-y: scroll">
    <div class="form" style="height: 20vh; min-height: 10vh">
      <srm-form style="min-height: 10vh" :data-set="formDataDs" :columns="getFormColumns()"/>
      <span>{{ $T("scux.BoxCodeUnbind.modal.boxNum").$D("扫描明细：(") }}{{ boxNow }}{{ "/" }}{{ boxMax }}{{ ")" }}</span>
    </div>
    <div style="height: 60vh">
      <srm-list :data-set="listDataDs"
                :columns="getListColumns()"/>
    </div>
    <div style="height: 15vh">
      <srm-bottom-handler :btn-arr="getBtnArr()" type="action-sheet" />
    </div>
  </div>
</template>

<script>
import { DataSet, $T, } from "srm-mobile-ui";
import { boxBindApi } from "../api/index";
import SrmAppCore from "srm-front-app-core";
import { closeWebView } from "srm-mobile-ui/src/utils/jsBridge";
import { isEmpty } from "@/utils/index";
import { formDs, listDs } from "../datasource/index";
export default {
  modules: [ "scux.BoxCodeUnbind" ],
  name: "BoxCodeUnbind",
  data() {
    return {
      boxNow: 0,
      boxMax: 0,
      labelCode: "",
      code: "",
      formDataDs: new DataSet(formDs()),
      listDataDs: new DataSet(listDs()),
    };
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
              theme="fill"
              autoFocus
              onEnter={(value) => {
                const { fieldCode } = field;
                this.setLabelCode(fieldCode, value);
              }}
            >
              <span slot="left" class="srm-field-left-label">
                <span class="srm-input-prefix">
                  <span style="margin-right: 12px;">
                    {$T("scux.BoxCodeUnbind.model.labelCodes").$D("箱码: ")}
                  </span>
                </span>
              </span>
              <em slot="right" class="srm-icon icon-scan" onclick={this.scanCodeForBoxNum}/>
            </srm-input-field>
        },
      ];
    },
    getBtnArr() {
      return [
        {
          title: $T("scux.BoxCodeUnbind.button.cancel").$D("取消"),
          handler: this.handleCancel,
        },
        {
          title: $T("scux.BoxCodeUnbind.button.unBind").$D("解绑"),
          handler: this.unbind,
        }
      ];
    },
    // 扫描后事件，根据不同输入框，触发不同事件
    setLabelCode(fieldCode, code) {
      if (isEmpty(code)) {
        this.$notification.open({
          message: $T(
            "scux.BoxCodeUnbind.message.please.enter.reScanCode"
          ).$D("未扫上，请重新扫码！"),
          class: "notification",
        });
        return;
      }
      if (fieldCode === "labelCode") {
        // this.code = code;
        this.formDataDs.create({
          "labelCode": code,
        }, 0);
        this.labelCode = code;
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
            this.boxNow = this.listDataDs.toData().length;
          });
        });
      }
    },
    // 解绑
    unbind() {
      const data = {
        operation: "DELETE",
        labelCode: this.labelCode,
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
            "scux.BoxCodeUnbind.message.please.enter.unbindSuccess"
          ).$D("解绑成功！"),
          class: "notification",
        });
        this.$loading.hide();
        try {
          closeWebView();
        } catch (err) {
          this.$router.back();
        }
        // this.listDataDs.setBodyParameter({ labelCode: this.labelCode });
        // this.listDataDs.refresh();
        // this.listDataDs.query().then(() => {
        //   this.boxNow = this.listDataDs.toData().length;
        // });
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
    // 扫箱码
    scanCodeForBoxNum() {
      let that = this;
      SrmAppCore.scanQrCode(function (result) {
        if (result) {
          // console.log("result:", result);
          let code = result;
          if (result.indexOf(",") !== -1) {
            code = result.split(",")[1];
          }
          that.formDataDs.create({
            "labelCode": code,
          }, 0);
          that.labelCode = code;
          // 调请求，获取箱内数量，设置boxMax
          const data = {
            labelCode: that.labelCode,
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
              that.boxNow = that.listDataDs.toData().length;
            });
          });
        } else {
          that.$notification.open({
            message: $T(
              "scux.BoxCodeUnbind.message.please.enter.reScanCode"
            ).$D("未扫上，请重新扫码！"),
            class: "notification",
          });
        }
      }, function (error) {
        // console.log(that.$T("scux.BoxCodeUnbind.view.message.scanAbnormal").$D("扫码异常"), error);
        that.$notification.open({
          message: that.$T("scux.BoxCodeUnbind.view.message.scanAbnormal").$D("扫码异常") + (error ? JSON.stringify(error) : ""),
          // key,
          class: "notification",
        });
      });
    },
  },
};
</script>