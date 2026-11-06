<template>
  <div style="height: 100vh" class="aps-delivery-plan">
    <nav-head
      :title="$T('smbl.common.view.title.APSDeliveryPlan').$D('APS送货计划')"
      @goTop="goTop"
      @goClose="goClose"
      @goBack="goBack"/>
    <div class="delivery-selection">
      <!--分公司-->
      <srm-lov-field
        v-model="organizationId"
        code="SCUX.XB_SUPPLIER_INV_ORG"
        :placeholder="
          $T('smbl.common.view.selectSubCompany').$D('请选择分公司')
        "
        theme="fill"
        :options="{
          valueField:'organizationId',
          queryField: 'organizationName',
          displayField: 'organizationName',
          subDisplayField: 'organizationCode',
        }"
        @inputChange="onSelectedCompany"
        @clear="clearContent(1)">
        <span slot="left">{{ $T("smbl.common.view.subCompany").$D("分公司") }}：</span>
      </srm-lov-field>
      <srm-blank size="mid"/>
      <div class="bottom">
        <div class="left">
          <!--计划送货日期--->
          <srm-calendar-field
            v-model="deliveredDate"
            placeholder=""
            @inputChange="onSelectedDeliveryDate"
            @clear="clearContent(0)">
            <span slot="left">{{
              $T("smbl.common.view.PlanDeliveryDate").$D("计划送货日期")
            }}:</span>
          </srm-calendar-field>
          <srm-blank size="mid"/>
          <!-- 采购订单号 -->
          <div class="orderNum" @click="showOrderNumPop">
            <span class="label">{{ $T("smbl.common.view.purchasePoNum").$D("采购单号") }}：{{
              orderNums
            }}</span>
            <span class="srm-icon icon-chevron-right" />
          </div>
          <srm-blank size="mid"/>
        </div>
        <div class="right" @click="goScanner">
          <div>
            <img src="@/assets/scan.png" >
            <span class="scan-title">{{
              $T("smbl.common.view.scan").$D("扫码")
            }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="material-detail">
      <div class="scan-tab">
        <div
          v-for="item in tabList"
          :key="item.id"
          :class="{ 'tab-active-color': selectedTabIndex == item.id }">
          {{ item.name }}
        </div>
      </div>
      <div v-if="marterialDetail" class="material-content">
        <span class="material-name">{{ marterialDetail.itemName }}</span>
        <span class="material-code">{{
          $T("scux.purchaseRecordApproval.model.materialsCode").$D(
            "物料编码"
          )
        }}:{{ marterialDetail.itemCode }}</span>
        <div class="count">
          <div class="amount">
            <div>
              <span class="title">{{
                $T("scux.specialSize.model.number").$D("数量")
              }}</span>
              <span class="number">{{ marterialDetail.quantity }}</span>
            </div>
          </div>
          <div class="scan-count">
            <div>
              <span class="title">{{
                $T("smbl.common.model.scanNum").$D("扫描数")
              }}</span>
              <span class="number">{{ packingQuantity }}</span>
            </div>
          </div>
        </div>
        <div class="specification">
          <span class="title">{{
            $T("smbl.common.mode.specifications").$D("规格")
          }}</span>
          <div class="content">
            {{ marterialDetail.specifications }}
          </div>
        </div>
        <div class="number-detail">
          <span class="order-number">{{ $T("smbl.common.view.purchasePoNum").$D("采购单号") }}：{{
            marterialDetail.displayPoNum
          }}</span>
          <span class="demand-classification">{{
            $T("sinv.common.myPickList.modal.reqCategoryNum").$D(
              "需求分类号"
            )
          }}:{{ marterialDetail.attributeVarchar10 }}</span>
          <span class="line-number">{{ $T("scux.sendBill.model.lineNum").$D("行号") }}:{{
            marterialDetail.lineNum
          }}</span>
        </div>
      </div>
    </div>
    <!-- 底部按钮 -->
    <BottomHandler :btn-arr="getBtnArr" />
    <!-- 采购订单号弹窗 -->
    <srm-popup
      :visible.sync="isPurchaseOrderNumVisible"
      :title="
        $T('ssta.purchaseSettle.view.title.selectedOrderNum').$D('选择订单号')
      "
      rounded>
      <!-- 搜索组件 -->
      <srm-search
        v-model="lovParams.searchValue"
        :placeholder="$T('smbl.common.view.orderNum').$D('订单号')"
        @search="handleSearch(lovParams.searchValue)"
        @clear="handleSearch"/>
      <srm-checkbox-group :selection="1">
        <srm-checkbox
          v-for="(item, index) in xbAppPoInfoDTOList"
          :key="index"
          v-model="item.checked"
          position="right">
          <div class="order-card">
            <div class="display-ponum" :class="{ activeColor: item.checked }">
              {{ item.displayPoNum }}—{{ item.lineNum }}
            </div>
            <div class="tag">
              <srm-tag size="small" :type="item.checked ? 'primary' : 'info'">
                {{ $T("smbl.common.model.materialsCode").$D("物料编码") }}:{{
                  item.itemCode
                }}
              </srm-tag>
              <srm-tag size="small" :type="item.checked ? 'primary' : 'info'">
                {{ $T("smbl.common.model.materialsName").$D("物料名称") }}:{{
                  item.itemName
                }}
              </srm-tag>
            </div>
          </div>
        </srm-checkbox>
      </srm-checkbox-group>
      <SrmButton type="primary" fill @click="confirm">
        {{ $T("hipspfm.common.validation.confirmSelect").$D("确认选择") }}
      </SrmButton>
    </srm-popup>
  </div>
</template>

<script>
import NavHead from "@/components/NavHead";
import {
  SrmLovField,
  SrmSearch,
  SrmPopup,
  SrmCheckboxGroup,
  SrmCheckbox,
  SrmTag,
  SrmButton,
  SrmCalendarField,
} from "srm-mobile-ui";
import * as dd from "dingtalk-jsapi";
import { closeWebView, scanBridge } from "srm-mobile-ui/src/utils/jsBridge";
import {
  getPurchaseNumListApi,
  getMaterialDetailListApi,
  getPackingQuantityApi,
  createDeliveryApi,
} from "../api/index";
import BottomHandler from "@/components/V5/BottomHandler";
import moment from "moment";
import SrmAppCore from "srm-front-app-core";
export default {
  modules: [ "smbl.common","hipspfm.invoiceInspection","hipspfm.scanCollection","scux.purchaseRecordApproval","scux.specialSize","sinv.common","scux.sendBill","ssta.purchaseSettle","hipspfm.common" ],
  name: "APSDeliveryPlan",
  components: {
    NavHead,
    SrmLovField,
    SrmCalendarField,
    SrmSearch,
    SrmPopup,
    SrmCheckboxGroup,
    SrmCheckbox,
    SrmTag,
    SrmButton,
    BottomHandler,
  },
  data() {
    return {
      organizationId: "", //库存组织ID
      poLineId: "", //订单行ID
      deliveredDate: "", //计划送货日期
      xbAppPoInfoDTOList: [], //订单列表
      marterialDetail: "", //物料详情
      selectedTabIndex: 0, //tab下标
      isPurchaseOrderNumVisible: false, //订单号详情是否显示
      orderNums: "", //采购单号
      orderNumsList: [], //采购单号列表
      barCodeNumber: "", //条码号
      barBoxCodeNumberList: [], //条码号列表
      packingQuantity: 0, //装箱数量
      boxNumber: "", //箱号
      lovParams: {
        //LOV筛选条件
        page: 0,
        size: 10,
        searchValue: "",
      },
      isScan: false,
      submitMaterialList: [],
    };
  },
  computed: {
    tabList() {
      return [
        {
          id: 0,
          name: this.$T("smbl.common.view.unscan").$D("未扫描"),
        },
        {
          id: 1,
          name: this.$T("smbl.common.view.scaned").$D("已扫描"),
        },
      ];
    },
    getBtnArr() {
      const arr = [
        {
          title: this.$T("smbl.common.button.generateDelivery").$D(
            "生成送货单"
          ),
          color: "var(--color-font-default-d)",
          background: "var(--color-other-default-b)",
          handler: () => {
            if (this.isScan) {
              const that = this;

              this.$hips.dialog.confirm({
                closable: false,
                title: this.$T("smbl.common.message.tip").$D("提示"),
                content: this.$T(
                  "smbl.common.message.confirm.generateDelivery"
                ).$D("确认生成送货单"),
                okText: this.$T("smbl.common.button.confirm").$D("确定"),
                cancelText: this.$T("smbl.common.view.button.cancel").$D(
                  "取消"
                ),
                onOk() {
                  that.createDelivery();
                },
                onCancel() {
                  // on cancel
                },
              });
            } else if (this.marterialDetail) {
              this.$hips.dialog.alert({
                title: this.$T("smbl.common.message.tip").$D("提示"),
                content: this.$T("smbl.common.message.scanFirst").$D(
                  "请先扫码"
                ),
                okText: this.$T("smbl.common.button.confirm").$D("确定"),
                closable: false,
              });
            } else {
              this.$hips.dialog.alert({
                title: this.$T("smbl.common.message.tip").$D("提示"),
                content: this.$T("smbl.common.message.selectedRequireOrder").$D(
                  "请先选择需要送货的订单"
                ),
                okText: this.$T("smbl.common.button.confirm").$D("确定"),
                closable: false,
              });
            }
          },
        },
      ];

      return arr;
    },
  },
  methods: {
    //选中公司的回调函数
    onSelectedCompany(val) {
      console.log(val,"val");
      this.organizationId = val;
      this.deliveredDate && this.getPurchaseNumList();
      this.marterialDetail = "";
    },
    //选中送货时间的回调
    onSelectedDeliveryDate(val) {
      this.deliveredDate = val;
      this.organizationId && this.getPurchaseNumList();
      this.marterialDetail = "";
    },
    //获取采购单号列表
    async getPurchaseNumList() {
      const params = {
        organizationId: this.organizationId,
        deliveredDate: this.deliveredDate,
      };

      await getPurchaseNumListApi(params).then((res) => {
        this.orderNumsList =
            res.xbAppPoInfoDTOList &&
            res.xbAppPoInfoDTOList.map((item) => {
              return item.displayPoNum;
            });
        this.orderNums = this.orderNumsList && this.orderNumsList.join(",");
        res.xbAppPoInfoDTOList &&
          res.xbAppPoInfoDTOList.forEach((item) => {
            item.checked = false;
          });
        this.xbAppPoInfoDTOList = res.xbAppPoInfoDTOList;
      });
    },
    //通过送货单号获取物料详情列表
    async getMaterialDetailList() {
      this.$loading.show();
      await getMaterialDetailListApi(this.poLineId).then((res) => {
        this.submitMaterialList.push(res[0]);
        this.marterialDetail = res[0];
        this.$loading.hide();
      });
    },
    //获取装箱数量
    async getPackingQuantity() {
      await getPackingQuantityApi(this.barCodeNumber, this.boxNumber).then(
        (res) => {
          this.packingQuantity = this.packingQuantity + res;
          this.isScan = true;
        }
      );
    },
    //处理采购订单搜索
    async handleSearch(val) {
      await this.getPurchaseNumList();
      this.xbAppPoInfoDTOList = this.xbAppPoInfoDTOList.filter((item) => {
        return (
          item.displayPoNum.toLowerCase().includes(val.toLowerCase()) ||
          item.itemCode.toLowerCase().includes(val.toLowerCase()) ||
          item.itemName.toLowerCase().includes(val.toLowerCase())
        );
      });
    },
    //清空订单
    clearContent(flag) {
      flag ? this.organizationId = "" : this.deliveredDate = "";
      this.orderNums = "";
      this.marterialDetail = "";
    },
    //显示订单弹窗
    showOrderNumPop() {
      if (!this.organizationId || !this.deliveredDate) {
        this.$hips.dialog.alert({
          title: this.$T("smbl.common.message.tip").$D("提示"),
          content: this.$T(
            "smbl.common.message.selectedCompanyAndDeliveryDateAlert"
          ).$D("请先选择分公司和送货日期"),
          okText: this.$T("smbl.common.button.confirm").$D("确定"),
          closable: false,
        });
      } else {
        if (!this.xbAppPoInfoDTOList) {
          return;
        }
        this.isPurchaseOrderNumVisible = true;
      }
    },
    //确认选择
    confirm() {
      let obj = this.xbAppPoInfoDTOList.find((item) => {
        return item.checked;
      });

      if (obj) {
        this.poLineId = obj.poLineId;
      }
      if (this.poLineId) {
        this.isPurchaseOrderNumVisible = false;
        this.getMaterialDetailList();
      } else {
        this.isPurchaseOrderNumVisible = false;
        this.$hips.dialog.alert({
          title: this.$T("smbl.common.message.tip").$D("提示"),
          content: this.$T("smbl.common.message.selectedFirst").$D("请先选择"),
          okText: this.$T("smbl.common.button.confirm").$D("确定"),
          closable: false,
        });
      }
    },
    //扫一扫
    async goScanner() {
      if (!this.orderNums) {
        this.$hips.dialog.alert({
          title: this.$T("smbl.common.message.tip").$D("提示"),
          content: this.$T("smbl.common.message.selectDeliveryOrderAlert").$D(
            "请先选择需要送货的订单"
          ),
          okText: this.$T("smbl.common.button.confirm").$D("确定"),
          closable: false,
        });
        return;
      }
      let that = this;
      SrmAppCore.scanQrCode(async function (result) {
        console.info("result:", result);
        await that.scanQuery(asnNum);
      }, function (error) {
        that.$notification.open({
          message: that
              .$T("hipspfm.invoiceInspection.view.message.scanAbnormal")
              .$D("扫码异常"),
          key,
          class: "notification",
        });
      });

      // const navigatorInfo = navigator.userAgent.toLowerCase();
      //
      // if (
      //   navigatorInfo.includes("welink") ||
      //     navigatorInfo.includes("cloudlink")
      // ) {
      //   /** welink **/
      //   await this.getWlScan();
      // } else if (navigatorInfo.indexOf("micromessenger") !== -1) {
      //   /** 微信 **/
      //   await this.getWxScan();
      // } else if (dd.env.platform !== "notInDingTalk") {
      //   /** 钉钉 **/
      //   await this.getDdScan();
      // } else {
      //   /** APP **/
      //   await this.getAppScan();
      // }
    },
    // welink扫码
    // getWlScan() {
    //   let that = this;
    //
    //   // eslint-disable-next-line no-undef
    //   HWH5.scanCode({ needResult: 1 })
    //     .then(async (res) => {
    //       let asnNum = JSON.parse(res).result;
    //
    //       await that.scanQuery(asnNum);
    //     })
    //     .catch(() => {
    //       that.$notification.open({
    //         message: that
    //           .$T("hipspfm.invoiceInspection.view.message.scanAbnormal")
    //           .$D("扫码异常"),
    //         // eslint-disable-next-line no-undef
    //         key,
    //         class: "notification",
    //       });
    //     });
    // },
    // // 微信扫码
    // async getWxScan() {
    //   let that = this;
    //   const wx = parent.wxBridge || parent.jWeixin;
    //
    //   if (!wx) {
    //     that.$notification.open({
    //       message: that
    //         .$T("hipspfm.invoiceInspection.view.message.scanAbnormal")
    //         .$D("扫码异常"),
    //       // eslint-disable-next-line no-undef
    //       key,
    //       class: "notification",
    //     });
    //   }
    //   wx.scanQRCode({
    //     needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
    //     scanType: [ "qrCode", "barCode" ], // 可以指定扫二维码还是一维码，默认二者都有
    //     success: async function (resC) {
    //       let asnNum = resC.resultStr; // 当needResult 为 1 时，扫码返回的结果
    //       const arr = asnNum.split(",");
    //
    //       asnNum = arr[arr.length - 1];
    //       await that.scanQuery(asnNum);
    //     },
    //     fail: function (err) {
    //       console.log("scanerr", err);
    //       that.$notification.open({
    //         message: that
    //           .$T("hipspfm.invoiceInspection.view.message.scanAbnormal")
    //           .$D("扫码异常"),
    //         // eslint-disable-next-line no-undef
    //         key,
    //         class: "notification",
    //       });
    //     },
    //     cancel: function (resE) {
    //       console.log("cancel", resE);
    //       // that.goBack();
    //     },
    //   });
    // },
    // // APP扫码
    // async getAppScan() {
    //   let that = this;
    //
    //   await scanBridge()
    //     .then(async (res) => {
    //       // eslint-disable-next-line rulesdir/check_modules
    //       console.log("APP扫码：" + res);
    //       let asnNum = JSON.parse(res).result;
    //
    //       await that.scanQuery(asnNum);
    //     })
    //     .catch(() => {
    //       this.$notification.open({
    //         message: this.$T(
    //           "hipspfm.scanCollection.view.message.scanAbnormal"
    //         ).$D("扫码异常"),
    //         key,
    //         class: "notification",
    //       });
    //     });
    // },
    // // 钉钉扫码
    // getDdScan() {
    //   let that = this;
    //
    //   dd.ready(function () {
    //     dd.biz.util.scan({
    //       type: "all",
    //       onSuccess: async function (data) {
    //         let asnNum = data.text;
    //
    //         await that.scanQuery(asnNum);
    //       },
    //       onFail: function (err) {
    //         if (Number(err.errorCode) === 10) {
    //           that.$router.push({ name: "ReceiptExecutionList" });
    //         } else {
    //           that.$notification.open({
    //             message: that
    //               .$T("hipspfm.invoiceInspection.view.message.scanAbnormal")
    //               .$D("扫码异常"),
    //             key,
    //             class: "notification",
    //           });
    //         }
    //       },
    //     });
    //   });
    // },
    // 处理扫码结果
    async scanQuery(val) {
      let barCode = val.replace("-","_");
      let barCodeList = barCode.split("-");
      const orderNum = barCodeList[0].replace("_","-");
      const lineNum = barCodeList[2];
      console.log(val,"val",orderNum,"ordernum",this.marterialDetail,"detail");
      if (
        orderNum !== this.marterialDetail.displayPoNum ||
        lineNum !== this.marterialDetail.lineNum
      ) {
        this.$hips.dialog.alert({
          title: this.$T("smbl.common.message.tip").$D("提示"),
          content: this.$T(
            "smbl.common.message.scanOrderNumAndMaterialCode"
          ).$D("请扫描订单号—行号对应的物料条码"),
          okText: this.$T("smbl.common.button.confirm").$D("确定"),
          closable: false,
        });
      } else {
        this.selectedTabIndex = 1;
        this.barCodeNumber = val;
        this.boxNumber = barCodeList[3];
        let barBoxCode = val + "," + this.boxNumber;

        if (this.barBoxCodeNumberList.includes(barBoxCode)) {
          this.$hips.dialog.alert({
            title: this.$T("smbl.common.message.tip").$D("提示"),
            content: this.$T("smbl.common.message.unableScanRepeat").$D(
              "请勿重复扫码"
            ),
            okText: this.$T("smbl.common.button.confirm").$D("确定"),
            closable: false,
          });
        } else {
          this.barBoxCodeNumberList.push(barBoxCode);
          this.getPackingQuantity();
        }
      }
    },
    //生成送货单
    async createDelivery() {
      this.$loading.show();
      let submitObj = this.submitMaterialList[0];

      submitObj.shipDate = moment().format("YYYY-MM-DD hh:mm:ss");
      submitObj.expectedArriveDate = moment().add(5,"d").format("YYYY-MM-DD hh:mm:ss");
      submitObj.quantity = this.packingQuantity;
      submitObj.externalServiceFlag = 1;
      submitObj.extAsnLine = { attributeDate1: submitObj.needDate };
      await createDeliveryApi(this.submitMaterialList).then(() => {
        this.$loading.hide();
        this.$notification.open({
          message: this.$T("smbl.common.message.createDelivery").$D(
            "生成送货单成功"
          ),
          key,
          class: "notification",
        });
        this.clearContent(0);
        this.clearContent(1);
        this.packingQuantity = 0;
        this.selectedTabIndex = 0;
      });
    },
    goBack() {
      this.$router.back();
    },
    //退出子应用
    goClose() {
      try {
        closeWebView();
      } catch (err) {
        this.$router.back();
      }
    },
    //回到顶部
    goTop() {
      this.$nextTick(() => {
        this.$refs.content.scrollTop = 0;
      });
    },
  },
};
</script>

<style lang="stylus" scoped>
.tab-active-color {
  color: var(--color-other-default-b) !important;
}

>>> .delivery-selection>.srm-field-wrapper-container {
  .srm-field-wrapper {
    background: #f6f6f6;

    .srm-lov-placeholder {
      color: #afafaf;
    }
  }
}

>>> .srm-field-wrapper-empty {
  background: #eff3fe !important;
}

>>> .srm-field-wrapper-container {

  .srm-field-wrapper {
    height: 40px;

    .srm-lov-placeholder, .srm-date-placeholder {
      font-size: 12px;
      font-family: PingFangSC, PingFangSC-Medium;
      font-weight: 500;
      color: #333;
    }

    .icon-chevron-right::before {
      color: #afafaf;
    }
  }
}

>>> .srm-check-box-group {
  padding: 0 15px;
  box-sizing: border-box;
}

>>> .srm-tag-info {
  font-family: PingFangSC-Medium;
  font-size: 10px;
  color: #333333;
  line-height: 12px;
  background: #F6F6F6;
}

>>> .srm-button-fill-primary {
  position: fixed;
  right: 15px;
}

>>> .activeColor {
  color: #276ef1 !important;
}

.order-card {
  padding: 16px 0;
  box-sizing: border-box;
  border-bottom: 1px solid #F6F6F6;

  .display-ponum {
    font-family: PingFangSC-Regular;
    font-size: 16px;
    color: #333333;
    line-height: 22px;
  }
}

.aps-delivery-plan {
  background: #f0f2f5;
  overflow: scroll;

  .delivery-selection {
    box-sizing: border-box;
    margin-bottom: 8px;
    box-sizing: border-box;
    padding: 16px 15px 16px 15px;
    background-color: var(--color-bg-default);

    .bottom {
      display: flex;
      justify-content: space-between;

      .left {
        flex: 1;

        .orderNum {
          display: flex;
          justify-content: space-between;
          height: 40px;
          background: #eff3fe;
          border-radius: 8px;
          line-height: 40px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;

          .label {
            margin-left: 16px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            width: 205px;
          }

          .icon-chevron-right {
            font-size: 20px;
            color: #afafaf;
          }
        }
      }

      .right {
        width: 63px;
        height: 92px;
        background: var(--color-bg-default);
        border-radius: 8px;
        box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.08);
        margin-left: 16px;
        display: flex;
        justify-content: center;
        align-items: center;

        div {
          display: flex;
          flex-direction: column;

          img {
            width: 24px;
            height: 24px;
          }

          .scan-title {
            margin: 0;
            font-size: 12px;
            font-family: PingFangSC, PingFangSC-Medium;
            font-weight: 500;
            text-align: left;
            color: #276ef1;
          }
        }
      }
    }

    span {
      font-size: 12px;
      font-family: PingFangSC, PingFangSC-Medium;
      font-weight: 500;
      color: #333333;
      margin-left: 12px;
      margin-right: 5px;
    }
  }

  .material-detail {
    background: var(--color-bg-default);

    .scan-tab {
      display: flex;
      border: 1px solid #f6f6f6;

      div {
        height: 44px;
        text-align: center;
        line-height: 44px;
        flex: 1;
        font-size: 14px;
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        text-align: center;
        color: #afafaf;
      }
    }

    .material-content {
      box-sizing: border-box;
      padding: 16px 15px 16px 15px;
      display: flex;
      flex-direction: column;

      span {
        font-size: 14px;
        color: #1f1f1f;
        margin-bottom: 12px;

        &.material-name {
          font-family: PingFangSC, PingFangSC-Medium;
          font-weight: 500;
        }

        &.material-code {
          font-family: PingFangSC, PingFangSC-Regular;
          font-weight: 400;
        }
      }

      .count {
        display: flex;
        height: 68px;
        border: 1px solid #f6f6f6;

        div {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;

          .title {
            font-size: 12px;
            font-family: PingFangSC, PingFangSC-Regular;
            font-weight: 400;
            color: #757575;
          }

          .number {
            font-size: 18px;
            font-family: PingFangSC, PingFangSC-Semibold;
            font-weight: 600;
            text-align: center;
            color: #333333;
          }

          &.amount {
            border-right: 1px solid #f6f6f6;
          }

          &.scan-count {
            .number {
              color: #276ef1;
            }
          }
        }
      }

      .specification {
        box-sizing: border-box;
        padding: 16px 0;

        .title {
          font-size: 12px;
          font-family: Alibaba, Alibaba-PuHuiTi;
          font-weight: PuHuiTi;
          color: #afafaf;
        }

        .content {
          box-sizing: border-box;
          padding: 8px 12px;
          background: #f6f6f6 !important;
          border-radius: 4px;
          font-size: 14px;
          font-family: Alibaba, Alibaba-PuHuiTi;
          font-weight: PuHuiTi;
          color: #afafaf;
          margin: 16px 0;
        }
      }

      .number-detail {
        box-sizing: border-box;
        padding-top: 12px;
        line-height: 20px;
        display: flex;
        flex-direction: column;

        span {
          font-size: 14px;
          font-family: PingFangSC, PingFangSC-Regular;
          font-weight: 400;
          text-align: left;
          color: #1f1f1f;

          &.line-number {
            margin: 0;
          }
        }
      }
    }
  }

  .bottom-handler {
    height: 72px;
  }
}
</style>
