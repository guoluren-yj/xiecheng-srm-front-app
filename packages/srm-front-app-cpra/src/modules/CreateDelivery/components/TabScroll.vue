<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div>
    <section v-if="headInfo" class="mainDetail">
      <div class="navWrap">
        <ul class="navContent">
          <li
            v-for="(item,index) in getNavArr"
            :key="index"
            :class="{'active': navIndex === index}"
            @click="$changeNav(index)">
            {{ item.title }}
          </li>
        </ul>
      </div>
      <div ref="wrapper" class="contentWrap wrapper">
        <div ref="content" class="content">
          <!-- 头信息 -->
          <div ref="headInfo" class="infoContent headInfo">
            <h3>{{ $T('sprm.common.model.common.prHeader').$D('采购申请头信息') }}</h3>
            <ul>
              <li>
                <span>{{ $T('sinv.common.model.common.organizationName').$D('收货组织') }}：</span>
                <span>{{ headInfo.organizationName }}</span>
              </li>
              <li @click="showEditDatePop('shipDate')">
                <span>
                  <span style="color:var(--color-other-default)">*</span>
                  {{ $T('sinv.common.model.common.shipDate').$D('发货日期') }}：
                </span>
                <span
                  v-if="!headInfo.shipDate"
                  style="color: var(--color-font-default-e)">{{ $T('hipspfm.createDelivery.message.validation.handlerDate').$D('请选择日期') }}</span>
                <span v-else>{{ headInfo.shipDate|CalcDate }}</span>
                <span>
                  <img src="@/assets/icon_list_date_normals@3x.png" class="image-gray-default" alt >
                </span>
              </li>
              <li @click="showExpectedArriveDate">
                <span>
                  <span style="color:var(--color-other-default)">*</span>
                  {{ $T('sinv.common.model.common.expectedArriveDate').$D('预计到货日期') }}：
                </span>
                <span
                  v-if="!headInfo.expectedArriveDate"
                  style="color: var(--color-font-default-e)">{{ $T('sinv.common.view.please.choose.date').$D('请选择日期') }}</span>
                <span v-else>{{ headInfo.expectedArriveDate }}</span>
                <span>
                  <img src="@/assets/icon_list_date_normals@3x.png" class="image-gray-default" alt >
                </span>
              </li>
              <li>
                <span>{{ $T('sinv.common.model.common.remark').$D('备注') }}：</span>
                <span>
                  <hips-input v-model="headInfo.remark"
                              :placeholder="' '+$T('hipspfm.createDelivery.message.validation.handlerRemake').$D('请填写备注信息')"
                              @on-focus="inputFocus"
                              @on-blur="inputLoseFocus">
                    <div slot="right" style="align-items: center">
                      <img src="@/assets/icon_editor@3x.png" class="input-edit image-gray-default" >
                    </div>
                  </hips-input>
                </span>
              </li>
            </ul>
          </div>
          <!-- 行信息 -->
          <div ref="lineInfo" class="infoContent lineInfo">
            <h3>{{ $T('hipspfm.common.view.message.title.lineInfo').$D('行信息') }}</h3>
            <ul
              v-for="(line,index) in lineInfo"
              :key="index"
              @click="showLineInfoDetail(line,index)">
              <li>
                <span class="materiel-name">
                  <span class="block"/>
                  {{ line.itemName }}
                </span>
                <span>{{ $T('sinv.common.model.common.asnLineNum').$D('行号') }}：{{ line.asnLineNum }}</span>
              </li>
              <li>
                <span>{{ $T('sinv.common.model.common.itemCode').$D('物料编码') }}：{{ line.itemCode }}</span>
              </li>
              <li>
                <span>{{ $T('sinv.common.model.common.anyShipQuantity').$D('剩余可发货数') }}：{{ line.canShipQuantity }}</span>
                <span>{{ $T('sinv.common.model.common.unit').$D('单位') }}：{{ line.uomName }}</span>
              </li>
              <li @click.stop>
                <div class="left">
                  <span>{{ $T('sinv.common.model.common.theShipQuantity').$D('本次发货') }}：</span>
                  <span>
                    <hips-input
                      v-model="line.shipQuantity"
                      :placeholder="$T('hipspfm.createDelivery.message.validation.handlerTheShipQuantity').$D('输入发货数量')"
                      type="number"
                      @on-focus="inputFocus"
                      @on-blur="inputLoseFocus">
                      <div slot="right" class="img-icon">
                        <img src="@/assets/icon_editor@3x.png" class="input-edit image-gray-default" >
                      </div>
                    </hips-input>
                  </span>
                </div>
                <div class="right">
                  <span
                    class="op"
                    @click="splitDelivery(line,index)">{{ $T('hipspfm.createDelivery.view.button.demolitionOrder').$D('拆单') }}</span>
                  <span
                    class="op"
                    @click="removeDelivery(line,index)">{{ $T('hipspfm.common.button.delete').$D('删除') }}</span>
                </div>
              </li>
            </ul>
          </div>
          <!-- 物流信息 -->
          <div id="footInfo" ref="footInfo" class="infoContent footInfo logisticsInfo">
            <h3>{{ $T('sinv.common.view.title.logisticsInfo').$D('物流信息') }}</h3>
            <ul>
              <li @click="showlogisticsPopup">
                <span>{{ $T('sinv.common.model.common.logisticsCompany').$D('物流公司') }}：</span>
                <span class="logistics">
                  <span v-if="headInfo.logisticsCompany">
                    {{ headInfo.logisticsCompanyMeaning }}
                  </span>
                  <span v-else class="font-gray">
                    {{ $T('hipspfm.createDelivery.message.validation.handlerLogisticsCompany').$D('输入物流公司') }}
                  </span>
                  <img class="" src="@/assets/icon_list_right_highlight@3x.png" >
                  <!-- <hips-input
                    @on-focus="inputFocus"
                    @on-blur="inputLoseFocus"
                    v-model="headInfo.logisticsCompany"
                    :placeholder="' '+$T('hipspfm.createDelivery.message.validation.handlerLogisticsCompany').$D('输入物流公司')"
                  >
                    <div slot="right" style="align-items: center">
                      <img src="@/assets/icon_editor@3x.png" class="input-edit image-gray-default" />
                    </div>
                  </hips-input> -->
                </span>

                <lov
                  v-model="logisticsPopup"
                  :title="$T('sinv.common.model.common.logisticsCompany').$D('物流公司')"
                  code="SINV.ASN_SHIPPER_NAME"
                  :clear-flag="clearFlag"
                  :query-params="{lovCode:'SINV.ASN_SHIPPER_NAME'}"
                  @submitValue="GetLogistics"/>
              </li>
              <li>
                <span>{{ $T('sinv.common.model.common.logisticsStaff').$D('配送人员') }}：</span>
                <span>
                  <hips-input
                    v-model="headInfo.logisticsStaff"
                    :placeholder="' '+$T('hipspfm.createDelivery.message.validation.handlerLogisticsStaff').$D('输入配送人员')"
                    @on-focus="inputFocus"
                    @on-blur="inputLoseFocus">
                    <div slot="right" style="align-items: center">
                      <img src="@/assets/icon_editor@3x.png" class="input-edit image-gray-default" >
                    </div>
                  </hips-input>
                </span>
              </li>
              <li>
                <span>{{ $T('sinv.common.model.common.logisticsContactInfo').$D(' 联系方式') }}：</span>
                <span>
                  <hips-input
                    v-model="headInfo.logisticsContactInfo"
                    :placeholder="' '+$T('hipspfm.createDelivery.message.validation.handlerLogisticsContactInfo').$D('输入联系方式')"
                    @on-focus="inputFocus"
                    @on-blur="inputLoseFocus">
                    <div slot="right" style="align-items: center">
                      <img src="@/assets/icon_editor@3x.png" class="input-edit image-gray-default" >
                    </div>
                  </hips-input>
                </span>
              </li>
              <li>
                <span>{{ $T('sinv.common.model.common.logisticsCost').$D('物流费用') }}：</span>
                <span>
                  <hips-input
                    v-model="headInfo.logisticsCost"
                    :placeholder="' '+$T('hipspfm.createDelivery.message.validation.handlerLogisticsCost').$D('输入物流费用')"
                    type="number"
                    @on-focus="inputFocus"
                    @on-blur="inputLoseFocus">
                    <div slot="right" style="align-items: center">
                      <img src="@/assets/icon_editor@3x.png" class="input-edit image-gray-default" >
                    </div>
                  </hips-input>
                </span>
              </li>
              <li>
                <span>{{ $T('sinv.common.model.common.expressNum').$D('快递单号') }}：</span>
                <span>
                  <hips-input
                    v-model="headInfo.expressNum"
                    :placeholder="' '+$T('hipspfm.createDelivery.message.validation.handlerExpressNum').$D('输入快递单号')"
                    type="number"
                    @on-focus="inputFocus"
                    @on-blur="inputLoseFocus">
                    <div slot="right" style="align-items: center">
                      <img src="@/assets/icon_editor@3x.png" class="input-edit image-gray-default" >
                    </div>
                  </hips-input>
                </span>
              </li>
              <li>
                <span>{{ $T('sinv.common.model.common.logisticsPhoneNum').$D('收件人手机号') }}：</span>
                <span>
                  <hips-input
                    v-model="headInfo.logisticsPhoneNum"
                    :class="phoneFlag ? '':'font-red'"
                    :placeholder="' '+$T('sslm.investigationMaintain.view.investigationMaintain.partnerContactPhone').$D('输入收件人手机号')"
                    type="number"
                    @on-focus="inputFocus"
                    @on-blur="inputLoseFocus">
                    <div slot="right" style="align-items: center">
                      <img src="@/assets/icon_editor@3x.png" class="input-edit image-gray-default" >
                    </div>
                  </hips-input>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <!-- 日期弹窗 -->
      <date-chooser v-model="showEditDate" @submitDate="handleConfirm" />

      <!-- 编辑预计到货日期弹窗开始 -->
      <hips-popup
        v-if="expectedArriveDateFlag"
        v-model="expectedArriveDateFlag"
        style="height:40%;width:100%"
        position="bottom"
        class="top-boder-radius">
        <div class="lineInfoDetail">
          <hips-datetime-picker
            format="yyyy-MM-dd HH:mm:ss"
            :title="$T('smbl.common.message.pleaseChoseTime').$D('选择时间')"
            @confirm="comfirmExpectedArriveDate"
            @cancel="showExpectedArriveDate"/>
        </div>
      </hips-popup>
      <!-- 编辑预计到货日期弹窗结束 -->
    </section>

    <!-- 物料信息start -->
    <hips-popup v-model="meteriaPopups" style="height:100%;width:100%" position="top">
      <delivery-material-info
        :show-line-info-detail="showLineInfoDetail"
        :line-info-detail="lineInfoDetail"
        :show-edit-date-pop="showEditDatePop"
        :save-delivery="saveDelivery"
        :phone-flag="phoneFlag"/>
    </hips-popup>
    <!-- 物料信息end -->

    <!-- 底部操作按钮 -->
    <div id="FootButton" class="supplier-confirm">
      <span
        @click="saveDelivery()">{{ $T('hipspfm.common.button.save').$D('保存') }}</span>
      <span @click="submitDelivery">{{ $T('hipspfm.common.button.submit').$D('提交') }}</span>
    </div>
  </div>
</template>

<script>
import BScroll from "better-scroll";
import Lov from "@/components/Lov";
import { Popup, Icon, NavBar, Input, DatetimePicker } from "hips";
// import { toast } from "@/utils/index";
import DateChooser from "@/components/DateChooser";
import DeliveryMaterialInfo from "./DeliveryMaterialInfo";
import { isEmpty, Exception } from "../../../utils/index";

import {
  deleteDeliveryLineInfoApi,
  submitMaintainDeliveryApi,
  saveMaintainDeliveryApi
} from "../api";

export default {
  modules: [ "hipspfm.createDelivery", "hipspfm.common", "sinv.common", "hzero.common", "sprm.common", "sslm.investigationMaintain", "smbl.common" ],
  name: "TabScroll",
  components: {
    DateChooser,
    DeliveryMaterialInfo,
    Lov,
    [Icon.name]: Icon,
    [Input.name]: Input,
    [Popup.name]: Popup,
    [NavBar.name]: NavBar,
    [DatetimePicker.name]: DatetimePicker
  },
  props: {
    headInfo: {
      type: Object,
      default: () => ({})
    },
    asnHeaderId: {
      type: Number | String,
      default: ""
    },
    lineInfo: Array,
    getOrderLine: Function
  },
  data() {
    return {
      scroll: "",
      navIndex: 0,
      meteriaPopups: false,
      showEditDate: false,
      expectedArriveDateFlag: false,
      contentLenArr: [],
      lineInfoDetail: {},
      promiseDate: "",
      currentIndex: 0,
      changeDate: "",
      changeType: "",
      logisticsPopup:false,
      clearFlag:false
    };
  },
  computed:{
    getNavArr() {
      let navArr = [
        {
          title: this.$T("hipspfm.common.view.message.title.headInfo").$D("头信息"),
          ref: "headInfo",
        },
        {
          title: this.$T("hipspfm.common.view.message.title.lineInfo").$D("行信息"),
          ref: "lineInfo",
        },
        {
          title:  this.$T("sinv.common.view.title.logisticsInfo").$D("物流信息"),
          ref: "footInfo",
        },
      ];

      return navArr;
    },
    phoneFlag() {
      return /^1[3|5|7|8][0-9]\d{4,8}$/.test(this.headInfo.logisticsPhoneNum);
    }
  },
  watch: {
    lineInfo: {
      handler() {
        this.$nextTick(() => {
          this.contentLenArr = [
            this.$refs.headInfo.offsetHeight,
            this.$refs.lineInfo ? this.$refs.lineInfo.offsetHeight : 0,
            this.$refs.footInfo ? this.$refs.footInfo.offsetHeight : 0
          ];
          const oHeight = this.contentLenArr.reduce((a, b) => a + b) + 250;

          this.$refs.content.style.height = 100 / 667 * oHeight + "vh";
          this.$refs.content.style.top = 0;
          this.scroll && this.scroll.refresh();
        });
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.scroll = new BScroll(this.$refs.wrapper, {
        scrollY: true,
        tab: true,
        probeType: 3,
        observeDOM: false,
        //useTransform: false,
        eventPassthrough: "horizontal"
      });
      this.scroll.on("scroll", this.handlerScroll);
    });
  },
  methods: {
    //物料信息显示或隐藏
    showLineInfoDetail(item, index) {
      this.currentIndex = index;
      this.lineInfoDetail = item;
      this.meteriaPopups = !this.meteriaPopups;
    },
    // 显示日期弹窗
    showEditDatePop(fieldName, type = "headInfo") {
      this.changeDate = fieldName;
      this.changeType = type;
      this.showEditDate = true;
    },
    // 关闭日期弹窗
    closeEditDatePop() {
      this.showEditDate = false;
    },
    // 显示预计到货日期弹窗
    showExpectedArriveDate() {
      this.expectedArriveDateFlag = !this.expectedArriveDateFlag;
    },
    // 提交预计到货日期
    comfirmExpectedArriveDate(value) {
      // eslint-disable-next-line vue/no-mutating-props
      this.headInfo.expectedArriveDate = value;
      this.expectedArriveDateFlag = false;
    },
    //物流弹窗显示或隐藏
    showlogisticsPopup() {
      this.logisticsPopup = !this.logisticsPopup;
      if (this.logisticsPopup !== true) {
        this.clearFlag = false;
      }
    },
    GetLogistics(val) {
      // eslint-disable-next-line vue/no-mutating-props
      this.headInfo.logisticsCompany = val.length ? val[0].value : "";
      // eslint-disable-next-line vue/no-mutating-props
      this.headInfo.logisticsCompanyMeaning = val.length ? val[0].meaning : "";
      // console.log(1111,val)
    },
    // 提交预计到货日期
    handleConfirm(value) {
      this.promiseDate = value + " 00:00:00";
      this.showEditDate = false;
      if (this.changeType === "headInfo") {
        // eslint-disable-next-line vue/no-mutating-props
        this.headInfo[this.changeDate] = this.promiseDate;
      } else {
        this.$set(
          this.lineInfo[this.currentIndex],
          this.changeDate,
          this.promiseDate
        );
      }
    },
    // 拆单
    splitDelivery(item, index) {
      const newItem = JSON.parse(JSON.stringify(item));

      newItem.newFlag = true;
      newItem.shipQuantity = 0;
      newItem.asnLineId = null;
      newItem.displayAsnLineNum = null;
      newItem._token = null;
      // eslint-disable-next-line vue/no-mutating-props
      this.lineInfo.splice(index + 1, 0, newItem);
    },
    // 删除拆单数据
    removeDelivery(item, index) {
      // eslint-disable-next-line consistent-this
      const self = this;

      if (item.newFlag) {
        // eslint-disable-next-line vue/no-mutating-props
        this.lineInfo.splice(index, 1);
      } else {
        deleteDeliveryLineInfoApi(this.asnHeaderId, [ item ]).then(() => {
          self.getOrderLine();
        });
      }
    },
    //数据校验
    checkData() {
    //   if(!this.phoneFlag){
    //      Exception(this,
    //      this.$T("hzero.common.validation.notNull").$D("{name}不能为空"),
    //      [this.$T('sinv.common.model.common.logisticsPhoneNum').$D('收件人手机号')]);
    //   }
      if (!this.headInfo.shipDate) {
        // eslint-disable-next-line new-cap
        Exception(this,
          this.$T("hzero.common.validation.notNull").$D("{name}不能为空"),
          [ this.$T("sinv.common.model.common.shipDate").$D("发货日期") ]);
      }

      if (!this.headInfo.expectedArriveDate) {
        // eslint-disable-next-line new-cap
        Exception(this,
          this.$T("hzero.common.validation.notNull").$D("{name}不能为空"),
          [ this.$T("sinv.common.model.common.expectedArriveDate").$D("预计到货日期") ]);
      }
      //校验数量
      this.lineInfo.forEach((item) => {
        if (isEmpty(item.shipQuantity)) {
          // eslint-disable-next-line new-cap
          Exception(this,
            item.asnLineNum + "," + this.$T("hzero.common.validation.notNull").$D("{name}不能为空"),
            [ this.$T("sinv.common.model.common.theShipQuantity").$D("本次发货") ]);
        }
      });
    },
    // 保存送货单
    saveDelivery(next) {
      //校验数据
      this.checkData();
      // eslint-disable-next-line consistent-this
      const self = this;

      self.$loading.show();
      // eslint-disable-next-line vue/no-mutating-props
      self.headInfo.shipDate += " 00:00:00";
      saveMaintainDeliveryApi({
        ...self.headInfo,
        asnHeaderId: this.asnHeaderId,
        asnLineList: this.lineInfo
      }).then((res) => {
        self.$loading.hide();
        if (res && res.failed) {
          //请求拦截已做处理
        } else if (res) {
          const asnLineList = res.asnLineList || [];
          let msgArr = asnLineList.map((element, index) => `${self
            .$T("hipspfm.createDelivery.view.message.the")
            .$D("第")}${index + 1}${self
            .$T("hipspfm.createDelivery.view.message.line")
            .$D("行")},${self
            .$T("sinv.common.model.common.asnLineNum")
            .$D("行号")}: ${index + 1}, ${self
            .$T("hipspfm.createDelivery.view.message.displayAsnLineNum2")
            .$D("本次发货数量大于可发货数量")}`);
          let msg = msgArr.join(";");

          self.$notification.open({
            message: msg,
            description: "",
            class: "notification"
          });
        } else {
          self.$notification.open({
            message: self
              .$T("hipspfm.common.message.saveSuccess")
              .$D("保存成功"),
            description: "",
            class: "notification"
          });
          this.$emit("refreshScrollData");
          if (typeof next === "function") {
            next();
          }
        }
      });
    },
    // 提交维护送货单
    submitDelivery() {
      //校验数据
      this.checkData();
      // eslint-disable-next-line consistent-this
      const self = this;

      // eslint-disable-next-line vue/no-mutating-props
      self.headInfo.shipDate += " 00:00:00";
      this.$hips.dialog.confirm({
        closable: false,
        content: self
          .$T("sinv.common.model.common.confirmSubmit")
          .$D("是否确认提交送货单"),
        okText: this.$T("hipspfm.common.button.ok").$D("确定"),
        cancelText: this.$T("hipspfm.common.button.cancle").$D("取消"),
        onOk() {
          self.$loading.show({
            svgSrc: require("@/assets/Spinner-1s-48px.svg")
          });
          const params = [ { ...self.headInfo, asnLineList: self.lineInfo } ];

          submitMaintainDeliveryApi(params).then((res) => {
            self.$loading.hide();
            if (res && res.failed) {
              self.$hips.dialog.alert({
                title: this.$T(
                  "hipspfm.createDelivery.view.message.submitFailed"
                ).$D("提交失败"),
                content: res.message,
                okText: this.$T("hipspfm.createDelivery.view.message.gotIt").$D(
                  "我知道了"
                ),
                onOk() {}
              });
            } else if (res && res.length) {
              const asnLineList = res[0].asnLineList || [];
              let msgArr = asnLineList.map((element, index) =>
                `${self
                  .$T("hipspfm.createDelivery.view.message.the")
                  .$D("第")}${index + 1}${self
                  .$T("hipspfm.createDelivery.view.message.line")
                  .$D("行")},${self
                  .$T("sinv.common.model.common.asnLineNum")
                  .$D("行号")}: ${index + 1}, ${self
                  .$T("hipspfm.createDelivery.view.message.displayAsnLineNum2")
                  .$D("本次发货数量大于可发货数量")}`
                // return `第${index+1}行,行号: ${index+1}, 本次发货数量大于可发货数量`;
              );
              let msg = msgArr.join(";");

              self.$hips.toast({ message: msg, duration: 3000 });
            } else {
              self.$hips.toast(
                self
                  .$T("hipspfm.createDelivery.view.message.submitSuccessed")
                  .$D("提交成功")
              );
              self.$router.replace({
                name: "DeliveryList",
                params: { saveFlag: true }
              });
            }
          });
        },
        onCancel() {}
      });
    },
    // 切换tab
    changeNav(index) {
      const newArr = this.contentLenArr.slice(0, index);
      const offsetLen = newArr.length ? newArr.reduce((a, b) => a + b) : 0;

      this.$nextTick(() => {
        this.scroll.scrollTo(0, -offsetLen, 200, "bounce");
      });
    },
    // 滚动事件
    handlerScroll({ y }) {
      const len1 = -this.contentLenArr[0];
      const len2 = len1 - this.contentLenArr[1];
      const len3 = len2 - this.contentLenArr[2];

      if (y > len1 && y < 100) {
        this.navIndex = 0;
      } else if (y > len2 && y <= len1) {
        this.navIndex = 1;
      } else if (y >= len3 && y <= len2) {
        this.navIndex = 2;
      } else {
        this.navIndex = 3;
      }
    },
    inputFocus() {
      // console.log(111)
    },
    inputLoseFocus() {
      //this.$refreshScroll();
    }
  }
};
</script>

<style scoped  lang="stylus">
.redFont {
  color: var(--color-other-default) !important;
}

.imgIcon {
  width: 20px !important;
  height: 20px !important;
  vertical-align: middle !important;
}
.font-red{
  color:var(--color-other-default) !important
}

.mainDetail {
  .navWrap {
    width: 100%;
    height: 44px;
    overflow: hidden;
    position: relative;
    z-index: 999;

    .navContent {
      height: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: center;

      li {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color:var(--color-font-default-b);
        letter-spacing: 0;
        text-align: center;
        line-height: 24px;
        text-align: center;
        position: relative;
        margin-left: 20px;

        &.active {
          font-size: 16px;
          color:var(--color-font-default);
        }

        &.active::before {
          position: absolute;
          left: 0;
          bottom: -10px;
          width: 100%;
          height: 2px;
          background-color: var(--color-other-default-b);
          content: '';
        }
      }
    }
  }

  .contentWrap {
    font-family: PingFangSC-Medium;
    height: calc(100vh - 137px);
    overflow: hidden;
    position: relative;

    .content {
      background:var(--color-bg-default);
      position: absolute;
      width: 100%;

      .logisticsInfo {
        ul {
          border-bottom: 0 !important;
        }
      }

      .infoContent {
        background-color:var(--color-font-default-d);

        .materiel-name {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        >>> .hips-input__input-value input::-webkit-input-placeholder {
          color: var(--color-font-default-e) !important;
        }

        h3 {
          padding: 20px 20px 12px 20px;
          margin-bottom: 4px;
          font-size: 18px;
          color:var(--color-font-default);
          line-height: 26px;
          font-weight: 700;
          background: var(--color-bg-default-b);
        }

        ul {
          padding-left: 20px;
          border-bottom:8px solid var(--color-border-default);

          li {
            padding: 16px 20px 15px 0px;
            border-bottom:1px solid var(--color-border-default);
            line-height: 22px;

            &:first-child {
              span:nth-child(2) {
                width: 100px;
                // text-align:right
              }
            }

            &:last-child {
              // border-bottom: 0;
            }

            span {
              font-size: 14px;
              color:var(--color-font-default);
              line-height: 22px;

              img {
                height: 16px;
                width: 16px;
                margin-left: 8px;
              }
            }
          }
        }
      }

      .headInfo {
        ul {
          li {
            display: flex;

            span:nth-child(1) {
              width: 110px;
            }

            span:nth-child(2) {
              flex: 1;

              >>> .hips-input {
                height: 22px !important;
                padding: 0 !important;
                font-size: 14px;
              }
            }
          }
        }
      }

      .lineInfo {
        ul {
          padding-left: 20px;

          li {
            color:var(--color-font-default);
            padding: 12px 20px 12px 0px;
            line-height: 22px;

            &:nth-child(1) {
              padding: 15px 20px 11px 0px;
              line-height: 24px;

              span:nth-child(2) {
                color: var(--color-font-default-e);
                font-size: 14px;
              }

              span:nth-child(1) {
                font-size: 16px;
                font-weight: bold;
                color:var(--color-font-default);
              }
            }

            &:nth-child(2) {
              border-bottom: 0;
            }

            .block {
              display: inline-block;
              height: 14px;
              width: 6px;
              background: var(--color-other-default-b);
              margin-right: 8px;
            }

            &:nth-child(1) {
              display: flex;
              justify-content: space-between;
            }

            &:nth-child(3) {
              span {
                &:nth-child(2) {
                  margin-left: 27px;
                }
              }
            }

            &:nth-child(4) {
              display: flex;
              align-items: center;

              .left {
                flex: 1;
                display: flex;
                align-items: center;

                span {
                  >>> .hips-input {
                    height: 22px !important;
                    width: 110px !important;
                    padding: 0 !important;
                    font-size: 14px;

                    .img-icon {
                      display: flex;
                      align-items: center;
                    }
                  }

                  >>> .hips-input:first-child:after {
                    border: none;
                  }

                  &:nth-child(2) {
                    display: flex;
                    align-items: center;
                  }
                }
              }

              .right {
                .op {
                  font-size: 12px;
                  padding: 6px 16px;
                  color:var(--color-font-default-d);
                  line-height: 20px;
                  border-radius: 16px;
                }

                span {
                  &:nth-child(1) {
                    background: var(--color-other-default-b);
                  }

                  &:nth-child(2) {
                    background: var(--color-other-default);
                    margin-left: 12px;
                  }
                }
              }
            }
          }
        }
      }

      .footInfo {
        ul {
          li {
            display: flex;

            span:nth-child(2) {
              flex: 1;

              >>> .hips-input {
                height: 22px !important;
                padding: 0 !important;
                font-size: 14px;
              }
            }
          }
        }
        .font-gray{
          color:var(--color-bg-default-f);
          margin-left:4px;
        }
        .logistics{
          display:flex;
          justify-content: space-between;
          align-items: center;
        }
      }
    }
  }
}

>>> .hips-input__input-value input::-webkit-input-placeholder {
  font-size: 14px;
  line-height: 20px;
  color:var(--color-font-default-b) !important;
}

.lineInfoDetail {
  .lineHead :nth-child(2) {
    margin-bottom: 8px;
  }

  background: #FAFBFC;
  height: 100%;

  .header {
    font-size: 20px;
    line-height: 32px;
  }

  .left-button {
    // margin-left: 12px;
  }

  div {
    padding: 8px 20px 12px;
    background-color:var(--color-font-default-d);

    li {
      padding: 0;
      margin-bottom: 12px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      span {
        color:var(--color-font-default-b);
        line-height: 24px;
        font-size: 16px;
      }

      &:nth-child(2) {
        margin-bottom: 0;

        span {
          color:var(--color-font-default);
        }
      }
    }

    p {
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color:var(--color-font-default);
      line-height: 24px;
    }
  }

  > li {
    display: flex;
    justify-content: space-between;
    padding: 5px 20px;
    margin-bottom: 2px;

    &:nth-of-type(1) {
      padding-top: 9px;
    }

    span {
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color:var(--color-font-default);
      line-height: 22px;

      &:nth-child(2) {
        color:var(--color-font-default-b);
        display: inline-block;
        width: 60%;
        text-align: right;
        word-wrap: break-word;
        word-break: break-all;
      }
    }
  }
}

// .no-more{
// width: 100%;
// height: 80px;
// line-height: 80px;
// color: var(--color-font-default-e);
// text-align: center;
// }
.supplier-confirm {
  width: 100%;
  text-align: center;
  line-height: 49px;
  height: calc(49px + constant(safe-area-inset-bottom));
  height: calc(49px + env(safe-area-inset-bottom));
  font-size: 18px;
  background:var(--color-bg-default);
  color: var(--color-other-default-b);// var(--color-other-default-b);
  box-shadow: 0 -1px 2px 0 rgba(27, 30, 43, 0.1);
  position: fixed;
  bottom: 0;
  display: flex;

  span {
    flex: 1;
    font-weight: bold;
    border-right: 1px solid var(--color-border-default);
  }

  span:nth-child(odd) {
    color: var(--color-other-default);
  }
}
</style>
