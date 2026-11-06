<template>
  <div style="height: 100vh">
    <srm-list
      :data-set="dataSet"
      customize-code="SMBL.RECEIVE.LIST"
      :buttons="getButtons"
      :columns="getColumns">
      <div slot="filter" class="tab-box">
        <span
          class="tab-item"
          :class="{ 'tab-item-active': currentTabIndex === 0 }"
          @click="selectTabAtIndex(0)">{{ $T("sinv.common.title.asn").$D("送货单") }}</span>
        <span
          class="tab-item"
          :class="{ 'tab-item-active': currentTabIndex === 1 }"
          @click="selectTabAtIndex(1)">{{
            $T("sinv.common.title.po").$D("订单")
          }}</span>
      </div>
    </srm-list>
    <!-- 扫码窗 -->
    <div v-show="currentTabIndex===0" class="scan-content">
      <img
        class="img-scan"
        src="@/assets/Receive/icon_Scan@3x.png"
        alt
        @click="goScanner">
    </div>
  </div>
</template>

<script>
import { DataSet } from "srm-mobile-ui";
import { indexDS } from "../datasource/indexDS";
import { scanBridge } from "srm-mobile-ui/src/utils/jsBridge";
import * as dd from "dingtalk-jsapi";
import SrmAppCore from "srm-front-app-core";
export default {
  modules: [ "sinv.common", "hipspfm.invoiceInspection", "hipspfm.scanCollection", "smbl.common" ],
  name: "ReceiveList",
  data() {
    return {
      dataSet: new DataSet(indexDS("asnNum")),
      currentTabIndex: 0,
    };
  },
  computed:{
    // 按钮
    getButtons() {
      return [
        {
          text: this.$T("smbl.common.button.create").$D("创建"),
          fill: true,
          visible: true,
          disabled: (checkedList) => checkedList.length === 0,
          callback: (checkedList) => {
            const checkedListData = checkedList.map((v) => v.data);
            this.toDetail(checkedListData);
          },
        },
      ];
    },
    getColumns() {
      const columns = [
        {
          fieldType: "EMPTY",
          fieldCode: "num",
          formRow: 0,
          render: (val, item) =>
            <SrmListHeader>
              <span>{ this.currentTabIndex === 0 ? item.asnNum : item.displayPoNum }</span>
            </SrmListHeader>
          ,
        },
        {
          fieldName: this.$T("sinv.common.model.row.itemName").$D("物料名称"),
          fieldType: "TEXT",
          fieldCode: "itemName",
        },
        {
          fieldName: this.$T("sinv.common.model.common.supplierCompanyName").$D("供应商"),
          fieldType: "TEXT",
          fieldCode: "supplierCompanyName",
        },
        {
          fieldName: this.$T("sinv.common.model.can.receive.quantity").$D("可接收数量"),
          fieldCode: "canReceiveQuantity",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: this.$T("sinv.common.model.common.organizationName").$D("收货组织"),
          fieldType: "TEXT",
          fieldCode: "invOrganizationName",
        },
        {
          fieldName: this.$T("sinv.common.model.common.displayLineNum").$D("订单行号"),
          fieldType: "EMPTY",
          fieldCode: "displayLineNum",
          render:(val, record) => <span class="display-line-num">{this.$T("sinv.common.model.common.displayLineNum").$D("订单行号")}：{record.displayLineNum }</span>
        },
      ];
      return columns;
    },
  },
  activated() {
    this.dataSet.setQueryParameter({ receiveOrderType:"ASN" });
  },
  methods: {
    selectTabAtIndex(index) {
      this.currentTabIndex = index;
      if (index === 1) {
        this.dataSet = new DataSet(indexDS("displayPoNum"));
        this.dataSet.setQueryParameter({ receiveOrderType: "ORDER" });
      } else {
        this.dataSet = new DataSet(indexDS("asnNum"));
        this.dataSet.setQueryParameter({ receiveOrderType:"ASN" });
      }
      this.dataSet.refresh();
    },
    toDetail(checkedListData) {
      //筛选同一供应商
      const sameFlag = checkedListData.every((item, index) => {
        if (index !== 0) {
          return (
            item.supplierCompanyName ===
            checkedListData[index - 1].supplierCompanyName
          );
        }
        return true;

      });
      if (sameFlag) {
        this.$router.push({
          name: "ReceiveDetail",
          query: {
            list: checkedListData,
            receiveOrderType: this.currentTabIndex === 0 ? "ASN" : "ORDER"
          }
        });
      } else {
        this.$notification.open({
          message: this.$T("sinv.common.message.please.check.same.supplier.receive").$D("请勾选来自同一供应商的送货单进行接收"),
          key,
          class: "notification",
          duration: 3
        });
      }
    },
    //扫一扫
    async goScanner() {
      let _this = this;
      SrmAppCore.scanQrCode(function (result) {
        console.info(result);
        _this.scanQuery(result);
        },function (){
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
      // if (
      //   navigatorInfo.includes("welink") ||
      //   navigatorInfo.includes("cloudlink")
      // ) {
      //   /** welink **/
      //   await this.getWlScan();
      // } else if (navigatorInfo.indexOf("micromessenger") !== -1) {
      //   /** 微信 **/
      //   await this.getWxScan();
      // } else if (dd.env.platform !== "notInDingTalk") {
      //   console.log("钉钉扫码");
      //   /** 钉钉 **/
      //   await this.getDdScan();
      // } else {
      //   /** APP **/
      //   await this.getAppScan();
      // }
    },
    // welink扫码
    // getWlScan() {
    //   // eslint-disable-next-line consistent-this
    //   let _this = this;
    //   HWH5.scanCode({ needResult: 1 })
    //     .then((res) => {
    //       let asnNum = JSON.parse(res).result;
    //       console.log(res);
    //       _this.scanQuery(asnNum);
    //     })
    //     .catch(() => {
    //       _this.$notification.open({
    //         message: _this
    //           .$T("hipspfm.invoiceInspection.view.message.scanAbnormal")
    //           .$D("扫码异常"),
    //         key,
    //         class: "notification",
    //         duration: 3
    //       });
    //     });
    // },
    // // 微信扫码
    // async getWxScan() {
    //   // eslint-disable-next-line consistent-this
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
    //       console.log("asnNum", resC.resultStr);
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
    //       console.log("cancel", resE);
    //       _this.goBack();
    //     }
    //   });
    // },
    // // APP扫码
    // async getAppScan() {
    //   // eslint-disable-next-line consistent-this
    //   let _this = this;
    //   await scanBridge()
    //     .then((res) => {
    //       let asnNum = JSON.parse(res).result;
    //       _this.scanQuery(asnNum);
    //     })
    //     .catch(() => {
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
    // // 钉钉扫码
    // getDdScan() {
    //   // eslint-disable-next-line consistent-this
    //   let _this = this;
    //   dd.ready(function() {
    //     dd.biz.util.scan({
    //       type: "all",
    //       onSuccess: function(data) {
    //         console.log("扫码结果", data);
    //         let asnNum = data.text;
    //         _this.scanQuery(asnNum);
    //       },
    //       onFail: function(err) {
    //         if (Number(err.errorCode) === 10) {
    //           _this.$router.push({ name: "InvoiceInspection" });
    //         } else {
    //           _this.$notification.open({
    //             message: _this
    //               .$T("hipspfm.invoiceInspection.view.message.scanAbnormal")
    //               .$D("扫码异常"),
    //             key,
    //             class: "notification",
    //             duration: 3
    //           });
    //         }
    //       }
    //     });
    //   });
    // },
    //扫码查询
    async scanQuery(asnNum) {
      this.dataSet.reset();
      this.dataSet.setQueryParameter({ asnNum });
      let result = this.dataSet.refresh();
      if (result) {
        result = await result;
        const data = this.dataSet.toData();
        console.log(data, "data");
        //匹配扫码单据
        //有数据跳转详情页
        if (data.length) {
          this.$router.push({
            name: "ReceiveDetail",
            query: {
              list: data,
              receiveOrderType: "ASN"
            }
          });
        } else {
          //无数据返回提示信息
          this.$notification.open({
            message: this.$T("smbl.common.message.data.none").$D("暂无数据"),
            class: "notification",
            duration: 3
          });
        }
      }
    }
  },
};
</script>
<style lang="stylus" scoped>
.tab-box {
  display: flex;
  flex-direction: row;
  padding: 15px 20px;

  .tab-item {
    flex: 1;
    text-align: center;
    margin-right: 15px;
    color: #1B1E2B;
  }

  .tab-item-active {
    flex: 1;
    text-align: center;
    margin-right: 15px;
    color: #1B1E2B;
    font-weight: bold;
  }
}
.display-line-num{
    background: rgba(65, 70, 96, 0.1);
    border-radius: 2px;
    width: 77px;
    height: 22px;
    font-size: 10px;
    color: #414660;
    line-height: 22px;
    text-align: center;
    margin-bottom: 12px;
}
.scan-content{
    background: var(--color-img-default-d);
    position: fixed;
    bottom: 74px;
    right: 22px;
    padding: 12px;
    border-radius: 50%;
    z-index 100;

    .img-scan {
    width: 28px;
    height: 28px;
  }
}
</style>
