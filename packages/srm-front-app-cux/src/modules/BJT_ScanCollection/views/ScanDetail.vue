<template>
  <hips-view v-if="show">
    <hips-nav-bar v-if="showBackFlag" slot="header" :have-border="false">
      <div slot="left" class="left-button" @click="goBack">
        <img src="@/assets/back@3x.png" class="image-black-default" >
      </div>
      <div
        slot="center"
        class="header">
        {{ $T("hipspfm.scanCollection.view.message.title.scanCollection").$D("扫码收货") }}
      </div>
    </hips-nav-bar>
    <div v-if="topInfo" class="headInfo">
      <div>
        <span
          :class="topInfo.exemptInspectionFlag?'isCheck':'noCheck'">{{ topInfo.exemptInspectionFlag?'免检':'不免检' }}</span>
        {{ topInfo.supplierName }}
      </div>
      <div>{{ topInfo.asnNum }}</div>
    </div>
    <div class="content" :style="showBackFlag?contentHight['app']:contentHight['other']">
      <div v-for="(item,index) in headInfo" :key="index" class="list-item">
        <li>
          <div>
            <span class="tri-left"/>
            <span>{{ $T("hipspfm.scanCollection.view.message.asnLineNum").$D("送货行号") }}：{{ item.asnLineNum }}</span>
            <span class="tri-right"/>
          </div>
          <div>{{ item.itemName }}（{{ item.itemCode }}）</div>
          <div>{{ $T("hipspfm.scanCollection.view.message.poNum").$D("订单号") }} | {{ $T("hipspfm.scanCollection.view.message.poLineNum").$D("行号") }}：{{ item.poNum }} | {{ item.poLineNum }}</div>
        </li>
        <li>
          <div class="left">
            <span>{{ $T("hipspfm.scanCollection.view.message.shipQuantity").$D("送货数量") }}：</span>
          </div>
          <div class="right">
            <span>{{ item.shipQuantity }}</span>
          </div>
        </li>
        <li>
          <div class="left">
            <span>{{ $T("hipspfm.scanCollection.view.message.enableReceiveQuantity").$D("收货数量") }}：</span>
          </div>
          <div class="right">
            <hips-input v-model="item.enableReceiveQuantity" type="number" pattern="number">
              <div slot="right">
                <img class="image-gray-default" src="@/assets/icon_editor@3x.png" alt >
              </div>
            </hips-input>
          </div>
        </li>
        <li @click="showInventoryPop(index)">
          <div class="left">
            <span>{{ $T("sinv.common.model.common.inventoryName").$D("库房") }}：</span>
          </div>
          <div class="right">
            <span v-if="item.inventoryName">{{ item.inventoryName }}</span>
            <span v-else>{{ $T("sinv.common.view.choose.common.inventoryName").$D("可选择库房") }}</span>
          </div>
          <div>
            <img class="image-gray-default" src="@/assets/icon_screenlist_right_normal@3x.png" alt >
          </div>
        </li>
        <li @click="showLocationPop(index)">
          <div class="left">
            <span>{{ $T("hipspfm.scanCollection.view.message.location").$D("库位") }}：</span>
          </div>
          <div class="right">
            <span v-if="item.locationName">{{ item.locationName }}</span>
            <span v-else>{{ $T("hipspfm.scanCollection.view.message.selectLocation").$D("可选择库位") }}</span>
          </div>
          <div>
            <img class="image-gray-default" src="@/assets/icon_screenlist_right_normal@3x.png" alt >
          </div>
        </li>
      </div>
      <div class="no-more"/>
    </div>
    <!-- 库房弹窗 -->
    <Lov
      v-model="inventoryPop"
      code="SODR.INVENTORY"
      :query-params="{tenantId,lovCode:'SODR.INVENTORY'}"
      :clear-flag="clearFlag1"
      @submitValue="GetInventory"/>
    <!-- 库位弹窗 -->
    <Lov
      v-if="locationPop"
      v-model="locationPop"
      code="SRPM.LOCATION_BY_ORG_INV"
      :query-params="{tenantId,inventoryId,enabledFlag:1}"
      :clear-flag="clearFlag2"
      @submitValue="GetLocation"/>
    <BottomHandler id="NoNeed" :btn-arr="btnArr" position="absolute" />
  </hips-view>
</template>

<script>
import Lov from "@/components/Lov";
import { View, Input, NavBar } from "hips";
import BottomHandler from "@/components/BottomHandler";
import { closeWebView, scanBridge } from "srm-mobile-ui/src/utils/jsBridge";
import SrmAppCore from "srm-front-app-core";
import { scanQueryApi, receiveDataApi, getWxInfoApi } from "../api/index";
export default {
  modules: [ "sinv.common","hipspfm.invoiceInspection","hipspfm.scanCollection","smbl.common" ],
  name: "ScanDetail",
  components: {
    Lov,
    BottomHandler,
    [View.name]: View,
    [Input.name]: Input,
    [NavBar.name]: NavBar
  },
  data() {
    return {
      show: false,
      clearFlag1: false,
      clearFlag2: false,
      locationPop: false,
      inventoryPop: false,
      locationIndex: 0,
      inventoryIndex: 0,
      inventoryId: null,
      count: 0,
      topInfo: {},
      headInfo: {},
      lastInfo: {},
      locationInfo: {},
      tenantId: window.localStorage.tenantId,
      contentHight: {
        app: "height: calc(100vh - 128px)",
        other: "height: calc(100vh - 84px)"
      }
    };
  },
  computed: {
    btnArr() {
      let arr = [
        {
          title: this.$T("sinv.common.button.receive.item").$D("收料"),
          color: "var(--color-other-default-b)",
          handler: () => {
            this.receiveData("RECEIPT");
          }
        }
      ];
      if (this.topInfo.exemptInspectionFlag) {
        arr.push({
          title: this.$T("sinv.common.button.put.warehouse").$D("入库"),
          color: "var(--color-other-default-b)",
          handler: () => {
            this.receiveData("WAREHOUSE");
          }
        });
      }
      return arr;
    }
  },
  watch: {},
  async mounted() {
    // 账号 13960430340/hand1234
    try {
      this.$loading.show();
      await this.goScanner();
      // this.scanQuery("ASN20200722000005");
      this.loading = true;
      this.$loading.hide();
    } catch (err) {
      this.loading = true;
      this.$loading.hide();
      console.log(err, "error");
    }
  },
  methods: {
    //退出子应用
    goBack() {
      try {
        closeWebView();
      } catch (err) {
        this.$router.back();
      }
    },
    //扫一扫
    async goScanner() {
      let _this = this;
      SrmAppCore.scanQrCode(function (result) {
        console.info("result:", result);
        _this.scanQuery(result);
      }, function (error) {
        console.log("scanerr", err);
        _this.$notification.open({
          message: _this
              .$T("hipspfm.invoiceInspection.view.message.scanAbnormal")
              .$D("扫码异常"),
          key,
          class: "notification",
          duration: 3
        });
      });
      // const navigatorInfo = navigator.userAgent.toLowerCase();
      // /** 微信 **/
      // if (navigatorInfo.indexOf("micromessenger") !== -1) {
      //   await this.getWxScan();
      // } else {
      //   /** APP **/
      //   await this.getAppScan();
      // }
    },
    // 微信扫码
    // async getWxScan() {
    //   let _this = this;
    //   const wx = parent.wxBridge || parent.jWeixin;
    //   if (!wx) {
    //     _this.$notification.open({
    //       message: _this
    //         .$T("hipspfm.invoiceInspection.view.message.scanAbnormal")
    //         .$D("扫码异常"),
    //       key,
    //       class: "notification",
    //       duration: 3
    //     });
    //   }
    //   wx.scanQRCode({
    //     needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
    //     scanType: [ "qrCode" ], // 可以指定扫二维码还是一维码，默认二者都有
    //     success: function(resC) {
    //       // console.log("扫描单号", resC.resultStr);
    //       let asnNum = resC.resultStr; // 当needResult 为 1 时，扫码返回的结果
    //       _this.scanQuery(asnNum);
    //     },
    //     fail: function(err) {
    //       console.log("scanerr", err);
    //       _this.$notification.open({
    //         message: _this
    //           .$T("hipspfm.invoiceInspection.view.message.scanAbnormal")
    //           .$D("扫码异常"),
    //         key,
    //         class: "notification",
    //         duration: 3
    //       });
    //     },
    //     cancel: function(resE) {
    //       // console.log("cancel", resE);
    //       _this.goBack();
    //     }
    //   });
    // },
    // // APP扫码
    // async getAppScan() {
    //   let _this = this;
    //   await scanBridge()
    //     .then((res) => {
    //       let asnNum = JSON.parse(res).result;
    //       _this.scanQuery(asnNum);
    //     })
    //     .catch((err) => {
    //       this.$notification.open({
    //         message: this.$T(
    //           "hipspfm.scanCollection.view.message.scanAbnormal"
    //         ).$D("扫码异常"),
    //         key,
    //         class: "notification",
    //         duration: 3
    //       });
    //     });
    // },
    //扫码查询
    async scanQuery(asnNum) {
      this.$loading.show();
      let _this = this;
      await scanQueryApi(asnNum).then((res) => {
        _this.$loading.hide();
        const {
          asnNum,
          supplierName,
          bjtQueryLineDTOList,
          exemptInspectionFlag,
        } = res;
        // console.log("扫码接口查询结果", res);
        if (res.failed) {
          _this.$notification.open({
            message: res.message,
            key,
            class: "notification",
            duration: 3
          });
        } else {
          _this.show = true;
          _this.topInfo = {
            asnNum,
            supplierName,
            exemptInspectionFlag
          };
          _this.headInfo = bjtQueryLineDTOList;
        }
      });
    },
    //确认数据接收
    async receiveData(receiptType) {
      this.lastInfo = this.headInfo.map((item) => {
        return {
          asnLineNum: item.asnLineNum,
          receiveQuantity: item.enableReceiveQuantity,
          locationCode: item.locationCode,
          inventoryCode: item.inventoryCode
        };
      });
      const params = {
        receiptType,
        asnNumber: this.topInfo.asnNum,
        bjtAsnReceiveLineDTOS: this.lastInfo
      };
      this.$loading.show();
      await receiveDataApi(params).then((res) => {
        this.$loading.hide();
        if (res.failed) {
          this.$notification.open({
            message: res.message,
            key,
            class: "notification",
            duration: 3
          });
        } else {
          this.$notification.open({
            message: this.$T("smbl.common.message.acction.success").$D("操作成功"),
            key,
            class: "notification",
            duration: 3
          });
          setTimeout(() => {
            try {
              closeWebView();
            } catch (err) {
              this.$router.back();
            }
          }, 1500);
        }
      });
    },
    //库房弹窗显示关闭
    showInventoryPop(index) {
      this.inventoryIndex = index;
      this.inventoryPop = !this.inventoryPop;
    },
    //库位弹窗显示关闭
    showLocationPop(index) {
      this.locationIndex = index;
      let flag = this.headInfo.every((item) => {
        return !item.inventoryName;
      });
      if (flag) {
        this.$notification.open({
          message: this.$T().$D("请先选择库房"),
          key,
          class: "notification",
          duration: 3
        });
      } else {
        this.locationPop = !this.locationPop;
      }
    },
    //确认库房
    GetInventory(val) {
      if (val[0]) {
        const { inventoryName, inventoryCode, inventoryId } = val[0];
        this.inventoryId = inventoryId;
        if (!this.count) {
          this.headInfo.map((item) => {
            item.inventoryName = inventoryName;
            item.inventoryCode = inventoryCode;
          });
          this.count++;
          this.clearFlag1 = true;
        } else {
          this.headInfo[this.inventoryIndex].inventoryName = inventoryName;
          this.headInfo[this.inventoryIndex].inventoryCode = inventoryCode;
        }
      }
    },
    //确认库位
    GetLocation(val) {
      if (val[0]) {
        const { locationName, locationCode } = val[0];
        this.headInfo[this.locationIndex].locationName = locationName;
        this.headInfo[this.locationIndex].locationCode = locationCode;
        this.clearFlag2 = true;
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
.header {
  font-size: 18px;
  line-height: 26px;
  font-weight: bold;
  color: var(--color-font-default);
}

.headInfo {
  padding: 12px 20px;
  font-family: PingFangSC-Medium;
  font-size: 16px;
  color: var(--color-font-default);
  line-height: 24px;
  font-weight: bold;
  border-bottom: 8px solid var(--color-border-default);

  &:nth-child(1) {
    .isCheck, .noCheck {
      border-radius: 2px;
      font-size: 10px;
      line-height: 18px;
      padding: 2px 8px;
      margin-right: 8px;
    }

    .isCheck {
      color: var(--color-other-default-b);
      background: var(--color-bg-default-c);
    }

    .noCheck {
      color: var(--color-font-default-c);
      background: rgba(65, 70, 96, 0.1);
    }
  }

  div:nth-child(1) {
    margin-bottom: 4px;
  }
}

.content {
  overflow: auto;

  img {
    height: 16px;
    width: 16px;
  }

  .list-item {
    border-bottom: 8px solid var(--color-border-default);
    padding-left: 20px;
    position: relative;

    li {
      &:nth-child(1) {
        padding: 15px 20px 14px 0px;

        div:nth-child(1) {
          display: flex;
          position: absolute;
          color: var(--color-other-default-b);
          font-size: 10px;
          right: 0;
          top: 0;

          span {
            display: inline-block;

            &:nth-child(2) {
              height: 19px;
              line-height: 19px;
              background: var(--color-bg-default-c);
            }
          }

          .tri-left {
            width: 0;
            height: 0;
            border-top: 9px solid #e6faf9;
            border-left: 7px solid white;
            border-bottom: 9px solid white;
            border-right: 7px solid #e6faf9;
          }

          .tri-right {
            width: 0;
            height: 0;
            border-top: 9px solid #e6faf9;
            border-left: 7px solid #e6faf9;
            border-bottom: 9px solid transparent;
            border-right: 7px solid transparent;
          }
        }

        div:nth-child(2) {
          font-weight: bold;
          font-size: 16px;
          color: var(--color-font-default);
          line-height: 24px;
          word-break: break-all;
        }

        div:nth-child(3) {
          font-size: 14px;
          color: var(--color-font-default);
          line-height: 22px;
        }
      }

      border-bottom: 1px solid var(--color-border-default);

      &:nth-child(2), &:nth-child(3), &:nth-child(4), &:nth-child(5) {
        display: flex;
        align-items: center;
        line-height: 22px;
        padding: 16px 20px 15px 0px;
      }

      .left {
        width: 70px;
        color: var(--color-font-default);
        font-size: 14px;
      }

      .right {
        font-size: 14px;
        color: var(--color-font-default-b);
        align-items: center;
        width: 249px;

        >>> .hips-input {
          padding: 0 !important;
          width: 265px !important;
          height: 22px;
          line-height: 22px;
        }

        >>> .hips-input__body .hips-input__input-value input {
          color: var(--color-font-default-b) !important;
          font-size: 14px !important;
        }
      }
    }
  }
}
</style>
