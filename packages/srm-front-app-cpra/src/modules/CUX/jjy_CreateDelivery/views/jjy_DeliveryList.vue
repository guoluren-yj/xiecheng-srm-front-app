<template>
  <hips-view>
    <hips-nav-bar v-if="!choseConfirmPopup" :have-border="false" >
      <div v-if="showBackFlag" slot="left" class="left-button" @click="goBack">
        <img src="@/assets/CUX/back@3x.png" class="image-black-default">
      </div>
      <div slot="center" class="header">
        <span :class="active===0?'active':''" @click="checkTab(0)">{{ $T('hipspfm.createDelivery.view.tab.cretae').$D('创建') }}</span>
        <span :class="active===1?'active':''" @click="checkTab(1)">{{ $T('hipspfm.createDelivery.view.tab.maintain').$D('维护') }}</span>
      </div>
      <div slot="right" class="right-button">
        <img
          src="@/assets/CUX/editor_normal@3x.png"
          class="image-black-default"
          alt
          @click="showEditPop">
        <i @click="showPopup"><img class="image-black-default" src="@/assets/CUX/screen_normal@3x.png" alt ></i>
      </div>
    </hips-nav-bar>
    <hips-nav-bar v-else :have-border="false" >
      <div slot="left" class="left-button">
        <span @click="showEditPop">{{ $T('hipspfm.common.button.cancle').$D('取消') }}</span>
      </div>
    </hips-nav-bar>
    <hips-tabs v-model="active" color="var(--color-other-default-b)" @click="checkTab">
      <hips-tab :title="multipleLanguage.tabTitle">
        <div class="content">
          <Searchs
            v-model="searchVal"
            :handle-search="handleSearch"
            :placeholder="$T('hipspfm.common.view.message.handlerPoNum').$D('请输入订单号查询')"/>
          <TotalCount :list-len="list.length" :count="totalCount" :info="$T('hipspfm.common.message.documentInfo').$D('单据信息')"/>
          <div class="scrollWrap">
            <hips-scroll
              v-if="!choseConfirmPopup && list.length"
              ref="scrollA"
              :data="[list]"
              :scroll-options="scrollOption"
              @pulling-down="loadRefresh"
              @pulling-up="loadMore">
              <div
                v-for="(li,index) in list"
                :key="index"
                class="card"
                @click="toDetail(li)">
                <h3>
                  <span class="code"><span class="block"/>{{ li.displayPoNum }}</span>
                  <span class="unCheck">{{ $T('sinv.common.model.common.displayLineNum').$D('订单行号') }}：{{ li.displayLineNum }}</span>
                </h3>
                <ul>
                  <li>
                    <span>{{ $T('hipspfm.createDelivery.model.createDelivery.itemName').$D('原材料') }}：{{ li.itemName }}</span>
                  </li>
                  <li>
                    <span>{{ $T('sinv.common.model.common.shippableQuantity').$D('可发货数量') }}：<span>{{ li.canAsnQuantity }}</span></span>
                    <span>{{ $T('sinv.common.model.common.neededDate').$D('需求日期') }}：<span>{{ li.needByDate|CalcDate }}</span></span>
                  </li>
                  <li>
                    <span>{{ $T('hipspfm.createDelivery.model.createDelivery.invOrganizationName').$D('客户收货组织名称') }}： {{ li.invOrganizationName }}</span>
                  </li>
                </ul>
              </div>
            </hips-scroll>

            <!-- 可选择列表 -->
            <hips-scroll
              v-if="choseConfirmPopup && list.length"
              ref="scroll"
              :data="[list]">
              <div class="checkWrap" style="padding-bottom: 13.333vw">
                <hips-checkbox-group
                  v-model="createDeliveryList"
                  :checkbox-border="false">
                  <hips-checkbox v-for="(li,index) in list" :key="index" :option="{value: li}">
                    <div class="card cards">
                      <h3>
                        <span class="code">{{ li.displayPoNum }}</span>
                        <span class="unCheck">{{ $T('sinv.common.model.common.displayLineNum').$D('订单行号') }}：{{ li.displayLineNum }}</span>
                      </h3>
                      <ul>
                        <li>
                          <span>{{ $T('hipspfm.createDelivery.model.createDelivery.itemName').$D('原材料') }}：{{ li.itemName }}</span>
                        </li>
                        <li>
                          <span>{{ $T('sinv.common.model.common.shippableQuantity').$D('可发货数量') }}：<span>{{ li.canAsnQuantity }}</span></span>
                          <span>{{ $T('sinv.common.model.common.neededDate').$D('需求日期') }}：<span>{{ li.needByDate|CalcDate }}</span></span>
                        </li>
                        <li>
                          <span>{{ $T('hipspfm.createDelivery.model.createDelivery.invOrganizationName').$D('客户收货组织名称') }}： {{ li.invOrganizationName }}</span>
                        </li>
                      </ul>
                    </div>
                  </hips-checkbox>
                </hips-checkbox-group>
              </div>
            </hips-scroll>

            <!-- 空白页 -->
            <NoContent v-else-if="list.length===0&&!loading" :title="$T('hipspfm.createDelivery.view.message.noDeliveryNote').$D('暂无送货单')" :refresh="loadRefresh" img-src="NoOrder@3x.png" />
          </div>
        </div>
      </hips-tab>
      <hips-tab :title="$T('hipspfm.createDelivery.view.tab.maintain').$D('维护')">
        <div class="content">
          <Searchs
            v-model="searchVals"
            :handle-search="handleSearchs"
            :placeholder="$T('hipspfm.common.view.message.handlerPoNum').$D('请输入订单号查询')"/>
          <TotalCount :list-len="maintainList.length" :count="totalMainCount" :info="$T('hipspfm.common.message.documentInfo').$D('单据信息')"/>
          <div class="scrollWrap">
            <hips-scroll
              v-if="!choseConfirmPopup && maintainList.length"
              ref="scrollB"
              :data="[maintainList]"
              :scroll-options="scrollOption"
              @pulling-down="loadRefreshs"
              @pulling-up="loadMores">
              <div
                v-for="(li,index) in maintainList"
                :key="index"
                class="card"
                @click="toDetails(li.asnHeaderId)">
                <h3>
                  <span class="code"><span class="block"/>{{ li.asnNum }}</span>
                  <span class="unCheck">{{ $T('hipspfm.createDelivery.model.createDelivery.standardDeliveryNote').$D('标准送货单') }}</span>
                </h3>
                <ul>
                  <li>
                    <span>{{ $T('sinv.common.model.common.customer').$D('客户') }}：</span>
                    <span>{{ li.companyName }}</span>
                  </li>
                  <li>
                    <span>{{ $T('sinv.common.model.common.creationDate').$D('创建日期') }}：<span>{{ li.creationDate|CalcDate }}</span></span>
                  </li>
                  <li>
                    <span>{{ $T('sinv.common.model.common.organizationName').$D('收货组织') }}： {{ li.organizationName }}</span>
                  </li>
                </ul>
              </div>
            </hips-scroll>

            <!-- 可选择列表 -->
            <hips-scroll
              v-if="choseConfirmPopup && maintainList.length"
              ref="scroll"
              :data="[maintainList]">
              <div class="checkWrap" style="padding-bottom: 13.333vw">
                <hips-checkbox-group
                  v-model="mainTainDeliveryList"
                  :checkbox-border="false">
                  <hips-checkbox v-for="(li,index) in maintainList" :key="index" :option="{value: li}">
                    <div class="card cards">
                      <h3>
                        <span class="code">{{ li.asnNum }}</span>
                        <span class="unCheck">{{ $T('hipspfm.createDelivery.model.createDelivery.standardDeliveryNote').$D('标准送货单') }}</span>
                      </h3>
                      <ul>
                        <li>
                          <span>{{ $T('sinv.common.model.common.customer').$D('客户') }}：</span>
                          <span>{{ li.companyName }}</span>
                        </li>
                        <li>
                          <span>{{ $T('sinv.common.model.common.creationDate').$D('创建日期') }}：<span>{{ li.creationDate|CalcDate }}</span></span>
                        </li>
                        <li>
                          <span>{{ $T('sinv.common.model.common.organizationName').$D('收货组织') }}： {{ li.organizationName }}</span>
                        </li>
                      </ul>
                    </div>
                  </hips-checkbox>
                </hips-checkbox-group>
              </div>
            </hips-scroll>

            <!-- 空白页 -->
            <NoContent v-else-if="maintainList.length===0&&!loadings" :title="$T('hipspfm.createDelivery.view.message.noDeliveryNote').$D('暂无送货单')" :refresh="loadRefreshs" img-src="NoOrder@3x.png" />
          </div>
        </div>
      </hips-tab>
    </hips-tabs>
    <!-- 筛选弹窗 -->
    <hips-popup v-model="show" position="top">
      <div class="filterWrap">
        <li>{{ $T('sinv.common.model.common.neededDate').$D('需求日期') }}</li>
        <div class="dateWrap">
          <span class="date-item" @click="choseData('date1')">{{ date1 ? date1: $T('hipspfm.common.message.startTime').$D('开始日期') }}</span>
          <span>~</span>
          <span class="date-item" @click="choseData('date2')">{{ date2 ? date2: $T('hipspfm.common.message.endTime').$D('截至日期') }}</span>
          <span>
            <img src="@/assets/CUX/icon_screenlist_right_normal@3x.png" class="image-gray-default" alt="">
          </span>
          <!-- 日期弹窗 -->
          <DateChooser v-model="datePopup" @submitDate="handleConfirm" />
        </div>

        <DateTip :date-clear-flag="dateClearFlag" :chose-date-handler="choseDateHandler" />

        <li>{{ $T('sinv.common.model.common.customer').$D('客户') }}</li>
        <div class="supplier" @click="showBuyerPop">
          <span v-show="!buyerValue.companyName">{{ $T('hipspfm.common.view.message.selectCustomer').$D('请选择客户') }}</span>
          <div>
            <div
              v-show="buyerValue.companyName"
              class="supplier-item">
              {{ buyerValue.companyName }}
            </div>
          </div>
          <span v-show="buyerValue.companyName" @click.stop="clearBuyer">
            <img src="@/assets/CUX/icon_screenlist_delete_normal@3x.png" class="image-gray-default" alt="">
          </span>
          <span>
            <img src="@/assets/CUX/icon_screenlist_right_normal@3x.png" class="image-gray-default" alt="">
          </span>
          <!-- <Lov v-model="buyerPopup" code="SINV.ASN_CUSTOMER" @submitValue="GetBuyer" :clearFlag="clearFlag" /> -->
        </div>
        <li>{{ $T('sinv.common.model.common.item').$D('物料') }}</li>
        <div class="order-status">
          <hips-input v-model="materielValue" class="search" :placeholder="$T('hipspfm.createDelivery.view.message.handlerItem').$D('请输入物料')" type="text" />
        </div>
      </div>
      <div class="handlerWrap">
        <span class="reset" @click="handleReset">{{ $T('hipspfm.common.button.reset').$D('重置') }}</span>
        <span class="submit" @click="submit">{{ $T("hipspfm.common.button.complete").$D("完成") }}</span>
      </div>
    </hips-popup>

    <Lov v-model="buyerPopup" code="SINV.ASN_CUSTOMER" :clear-flag="clearFlag" @submitValue="GetBuyer" />
    <!-- 全选弹窗 -->
    <div v-show="choseConfirmPopup" class="confirmWrap">
      <div class="editModal">
        <hips-checkbox v-if="active===0" v-model="checkAllFlag" :border="false" :disabled="!this.list.length">
          <span style="fontSize: 16px;">{{ $T('hipspfm.common.message.selectAll').$D('全选') }}</span>
        </hips-checkbox>
        <hips-checkbox v-else v-model="checkAllFlags" :border="false" :disabled="!this.maintainList.length">
          <span style="fontSize: 16px;">{{ $T('hipspfm.common.message.selectAll').$D('全选') }}</span>
        </hips-checkbox>
        <div v-if="active===0">
          <span v-if="createDeliveryList.length===0" :class="createDeliveryList.length?'':'disable-color'" >{{ $T('hipspfm.createDelivery.view.tab.cretae').$D('创建') }}</span>
          <span v-else :class="createDeliveryList.length?'':'disable-color'" @click="createDelivery">{{ $T('hipspfm.createDelivery.view.tab.cretae').$D('创建') }}</span>
        </div>
        <div v-else>
          <span v-if="createDeliveryList.length===0" :class="mainTainDeliveryList.length?'submitBtn':'disable-color submitBtn'" >{{ $T('hipspfm.common.button.submit').$D('提交') }}</span>
          <span v-else :class="mainTainDeliveryList.length?'submitBtn':'disable-color submitBtn'" @click="subMaintainDelivery">{{ $T('hipspfm.common.button.submit').$D('提交') }}</span>
          <span v-if="createDeliveryList.length===0" :class="mainTainDeliveryList.length?'delBtn':'disable-color  delBtn'" >{{ $T('hipspfm.common.button.delete').$D('删除') }}</span>
          <span v-else :class="mainTainDeliveryList.length?'delBtn':'disable-color  delBtn'" @click="delMaintainDelivery">{{ $T('hipspfm.common.button.delete').$D('删除') }}</span>
        </div>
      </div>
    </div>
    <!-- 全选弹窗结束 -->
  </hips-view>
</template>

<script>
import {
  Tab,
  Tabs,
  View,
  Input,
  Popup,
  NavBar,
  Scroll,
  Checkbox,
  CheckboxGroup
} from "hips";
import Lov from "@/components/Lov";
import DateTip from "@/components/DateTip";
import Searchs from "@/components/Searchs";
import NoContent from "@/components/NoContent";
import { closeWebView } from "srm-mobile-ui/src/utils/jsBridge";
import TotalCount from "srm-mobile-ui/packages/srm-list/TotalCount";
import DateChooser from "@/components/DateChooser";
import SelectSupplier from "@/components/SelectSupplier";
import {
  getBuyerApi,
  createDeliveryApi,
  deleteDeliveryApi,
  getDeliveryListApi,
  submitMaintainDeliveryApi,
  getMaintainDeliveryListApi,
} from "../api/index";
export default {
  modules: [ "hipspfm.createDelivery","hipspfm.common","sinv.common" ],
  name: "jjy_DeliveryList",
  components: {
    Lov,
    DateTip,
    Searchs,
    NoContent,
    TotalCount,
    DateChooser,
    SelectSupplier,
    [Tab.name]: Tab,
    [View.name]: View,
    [Tabs.name]: Tabs,
    [Input.name]: Input,
    [Popup.name]: Popup,
    [NavBar.name]: NavBar,
    [Scroll.name]: Scroll,
    [Checkbox.name]: Checkbox,
    [CheckboxGroup.name]: CheckboxGroup,
  },
  data() {
    return {
      active: 0,
      show: false, //筛选弹窗
      loading: false,
      loadings: false,
      supplierLoading: false,
      datePopup: false, //日期弹窗
      checkAllFlag: false, //创建全选标志
      checkAllFlags: false, //维护全选标志
      buyerPopup:false, //购买方弹窗状态
      orderStatusPopup: false, //送货单状态弹窗
      choseConfirmPopup: false, //全选编辑弹窗
      createDeliveryList: [], //创建送货单选中值
      mainTainDeliveryList: [], //创建送货单选中值
      materielValue: "", //物料输入值
      buyerValue: {}, //购买方选中值
      searchVal: "", //创建送货单订单号
      searchVals: "", //维护送货单订单号
      date1: "",
      date2: "",
      choseedDate: "", //选中的时间
      changeDate: "",
      list: [],
      maintainList: [],
      totalCount: 0,
      totalMainCount: 0,
      currentPage: 0, //页码
      currentPages: 0, //页码
      supplierTotalCount: "",
      buyerParams: {
        page: 0,
        size: 10,
        companyName: "",
      },
      clearFlag: false, //重置状态传入组件里
      dateClearFlag: false,
      multipleLanguage: {
        tabTitle: this.$T("hipspfm.createDelivery.view.tab.cretae").$D("创建")
      }
    };
  },
  watch: {
    checkAllFlag(value) {
      if (value) {
        this.createDeliveryList = [ ...this.list ];
      } else if (this.createDeliveryList.length === this.list.length && !value) {
        this.createDeliveryList = [];
      }
    },
    checkAllFlags(value) {
      if (value) {
        this.mainTainDeliveryList = [ ...this.maintainList ];
      } else if (this.mainTainDeliveryList.length === this.maintainList.length && !value) {
        this.mainTainDeliveryList = [];
      }
    },
    createDeliveryList(value) {
      if (value.length === this.list.length && value.length) {
        this.checkAllFlag = true;
      } else {
        this.checkAllFlag = false;
      }
    },
    mainTainDeliveryList(value) {
      if (value.length === this.maintainList.length && value.length) {
        this.checkAllFlags = true;
      } else {
        this.checkAllFlags = false;
      }
    }
  },
  async activated() {
    try {
      this.$loading.show();
      this.list = [];
      this.maintainList = [];
      await this.fetchData();
      await this.fetchMaintainData();
      this.loading = true;
      this.$loading.hide();
    } catch (err) {
      this.loading = true;
      this.$loading.hide();
      console.log(err,"error");
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
    //切换Tab
    checkTab(index) {
      this.active = index;
    },
    // 显示/隐藏筛选弹窗
    showPopup() {
      this.show = !this.show;
    },
    // 显示/隐藏筛选弹窗
    showBuyerPop() {
      this.buyerPopup = !this.buyerPopup;
    },
    // 显示编辑弹窗
    showEditPop() {
      this.choseConfirmPopup = !this.choseConfirmPopup;
      if (!this.choseConfirmPopup) {
        this.checkAllFlag = false;
        this.createDeliveryList = [];
      }
    },
    // 跳转详情页
    toDetail(item) {
      this.$router.push({
        name: "jjy_CreateDeliveryDetail",
        query: item
      });
    },
    toDetails(asnHeaderId) {
      this.$router.push({
        name: "jjy_DeliveryDetail",
        query: { asnHeaderId }
      });
    },
    // 搜索框搜索
    handleSearch() {
      this.list = [];
      this.currentPage = 0;
      this.fetchData();
    },
    // 搜索框搜索
    handleSearchs() {
      this.maintainList = [];
      this.currentPages = 0;
      this.fetchMaintainData();
    },

    //确认购买方
    GetBuyer(val) {
      this.clearFlag = false;
      this.buyerValue = val.length ? val[0] : {};
    },
    //清除购买方的值
    clearBuyer() {
      this.buyerValue = {};
      this.clearFlag = true;
    },
    // 快捷选择时间
    choseDateHandler(startDate, endDate) {
      this.date1 = startDate;
      this.date2 = endDate;
      this.dateClearFlag = false;
    },

    // 加载刷新数据
    async loadRefresh() {
      this.currentPage = 0;
      this.list = [];
      await this.fetchData();
    },
    // 加载刷新数据
    async loadRefreshs() {
      this.currentPages = 0;
      this.maintainList = [];
      await this.fetchMaintainData();
    },
    // 加载更多数据
    async loadMore() {
      if (this.list.length < this.totalCount) {
        this.currentPage++;
        await this.fetchData();
      } else {
        this.$nextTick(() => {
          this.$refs.scrollA.forceUpdate();
        });
      }
    },
    // 加载更多数据
    async loadMores() {
      if (this.maintainList.length < this.totalMainCount) {
        this.currentPages++;
        await this.fetchMaintainData();
      } else {
        this.$nextTick(() => {
          this.$refs.scrollB.forceUpdate();
        });
      }
    },
    // 请求创建送货单数据
    fetchData() {
      const params = {
        size: 10,
        companyId: this.buyerValue.companyId, //客户
        page: this.currentPage,
        itemName:this.materielValue, //物料
        displayPoNum: this.searchVal, //订单号
        needByDateStart: this.date1 ? this.date1 + " 00:00:00" : "", //开票日期从
        needByDateEnd: this.date2 ? this.date2 + " 00:00:00" : "", //开票日期至
        supplierTenantId: window.localStorage.supplierTenantId, //供应商租户ID
      };
      this.loading = true;
      this.$loading.show();
      getDeliveryListApi(params).then(({ content = [], totalElements = 0 } = {}) => {
        this.loading = false;
        this.$loading.hide();
        this.list = [ ...this.list, ...content ];
        console.log(this.list.length === 0,this.loading);
        this.totalCount = totalElements;
      });
    },
    // 请求维护送货单数据
    fetchMaintainData() {
      const params = {
        size: 10,
        page: this.currentPages,
        displayPoNum: this.searchVals,
        companyId: this.buyerValue.companyId, //客户
        supplierTenantId: window.localStorage.supplierTenantId, //供应商租户ID
      };
      this.loadings = true;
      this.$loading.show();
      getMaintainDeliveryListApi(params).then(({ content = [], totalElements = 0 } = {}) => {
        this.loadings = false;
        this.$loading.hide();
        this.totalMainCount = totalElements;
        this.maintainList = [ ...this.maintainList, ...content ];
      });
    },

    //选择时间
    handleConfirm(value) {
      this.choseedDate = value;
      this[this.changeDate] = this.choseedDate;
      this.datePopup = false;
    },

    //选择日期
    choseData(type) {
      this.changeDate = type;
      this.datePopup = true;
    },
    // 完成按钮搜索
    submit() {
      if (this.date1 && this.date2 && this.date1 > this.date2) {
        this.$notification.open({
          message:this.$T("hipspfm.common.validation.startIsBefore").$D("开始日期不能大于截止日期"),
          description: "",
          class:"notification",
          duration: 3,
        });
      } else {
        this.show = false;
        if (this.active === 0) {
          this.list = [];
          this.currentPage = 0;
          this.fetchData();
        } else {
          this.maintainList = [];
          this.currentPages = 0;
          this.fetchMaintainData();
        }
      }
    },
    // 创建送货单
    createDelivery() {
      this.$loading.show();
      createDeliveryApi(this.createDeliveryList).then((res)=>{
        this.$loading.hide();
        if (res.failed) {
          this.$hips.dialog.alert({
            title: this.$T("hipspfm.createDelivery.view.message.creationFailed").$D("创建失败"),
            content: res.message,
            okText: this.$T("hipspfm.common.view.button.gotIt").$D("我知道了"),
          });
        } else {
          const asnHeaderId = res[0].asnHeaderId;
          this.active = 1;
          this.choseConfirmPopup = false;
          this.$router.push({ name: "jjy_DeliveryDetail",query: { asnHeaderId } });
        }
      });
    },
    // 提交维护送货单
    subMaintainDelivery() {
      const self = this;
      self.$hips.dialog.confirm({
        closable: false,
        content: this.$T("sinv.common.model.common.confirmSubmit").$D("是否确认提交送货单"),
        okText: this.$T("hipspfm.common.button.ok").$D("确定"),
        cancelText: this.$T("hipspfm.common.button.cancle").$D("取消"),
        onOk() {
          self.$loading.show();
          submitMaintainDeliveryApi(self.mainTainDeliveryList).then((res)=>{
            self.mainTainDeliveryList = [];
            self.$loading.hide();
            if (res && res.failed) {
              self.$hips.dialog.alert({
                title: this.$T("hipspfm.createDelivery.view.message.submitFailed").$D("提交失败"),
                content: res.message,
                okText: this.$T("hipspfm.common.view.button.gotIt").$D("我知道了")
              });
            } else {
              self.list = [];
              self.fetchData();
              self.$notification.open({
                message:self.$T("hipspfm.createDelivery.view.message.submitSuccessed").$D("提交成功"),
                description: "",
                class:"notification",
              });
            }
          });
        },
      });
    },
    // 删除维护送货单
    delMaintainDelivery() {
      const self = this;
      this.$hips.dialog.confirm({
        closable: false,
        content: this.$T("sinv.common.model.common.confirmDelete").$D("是否确认删除送货单"),
        okText: this.$T("hipspfm.common.button.ok").$D("确定"),
        cancelText: this.$T("hipspfm.common.button.cancle").$D("取消"),
        onOk() {
          self.$loading.show();
          deleteDeliveryApi(self.mainTainDeliveryList).then((res)=>{
            self.$loading.hide();
            if (res && res.failed) {
              self.$hips.dialog.alert({
                title: this.$T("hipspfm.createDelivery.view.message.deleteFailed").$D("删除失败"),
                content: res.message,
                okText: this.$T("hipspfm.common.view.button.gotIt").$D("我知道了")
              });
            } else {
              self.maintainList = [];
              self.fetchMaintainData();
              self.$notification.open({
                message:self.$T("hipspfm.common.message.deleteSuccess").$D("删除成功"),
                description: "",
                class:"notification",
              });
            }
          });
        }
      });
    },
    // 重置
    handleReset() {
      this.date1 = "";
      this.date2 = "";
      this.buyerValue = {};
      this.materielValue = "";
      this.clearFlag = true;
      this.dateClearFlag = true;
    },
  }
};
</script>

<style lang="stylus" scoped>
$color-blue = #6699FF;

.disable-color{
  background-color: var(--color-bg-default-f) !important;
}

>>> .hips-cell {
  line-height 4.4vw !important;
}
>>> .hips-ellipsis {
  font-size: 16px;
}
>>> .hips-tab__panel {
  padding: 0;
}
>>> .hips-tab {
  color:var(--color-font-default-b);
}
.header {
  span{
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color:var(--color-font-default-b);
    letter-spacing: 0;
    text-align: center;
    line-height: 32px;
    display: inline-block;
    margin-right: 24px;
    font-weight: bold;
  }
  .active{
    font-size: 16px;
    color:var(--color-font-default);
    border-bottom: 2px solid var(--color-other-default-b);
  }
}

>>> .hips-thinline--bottom{
  display: none;
}
>>> .hips-tabs{
  padding-top: 0;
}

.right-button {
  display: flex;
  align-items: center;
  margin-right: 12px;
  color: var(--color-font-default);

  img {
    height: 24px;
    width: 24px;
    margin-right: 8px;
  }
}


.content {
  height: 100%;
  overflow auto;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  .scrollWrap {
    height: calc(100vh - 120px);
    font-size: 14px;
    >>> .hips-checkbox__checked {
      position: absolute !important;
      top: 4vw !important;
      left: 20px !important;
    }
    >>> .hips-cell {
      padding: 0 !important;
    }
    .checkWrap {
      height: 100%;
      overflow auto;
      .card {
        border-bottom: 0;
      }
    }
    .card {
      padding-left: 20px;
      background:var(--color-bg-default);
      border-bottom:8px solid var(--color-border-default);
      line-height: 22px;
      h3 {
        display: flex;
        justify-content: space-between;
        padding: 15px 20px 11px 0px;
        border-bottom:1px solid var(--color-border-default);
        .block {
          display: inline-block;
          height: 14px;
          width: 6px;
          background: var(--color-other-default-b);
          margin-right 8px;
        }
        .code {
          font-size: 16px;
          color:var(--color-font-default);
          font-weight: bold;
        }
        .unCheck {
          color: var(--color-font-default-e);
        }
      }
      li {
          color:var(--color-font-default);
          font-family: PingFangSC-Regular;
          padding-top 12px;
        &:nth-child(1) {
          padding-top 13px;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
          padding-right: 20px;
        }
        &:nth-child(2) {
          display:flex;
          justify-content: space-between;
          padding-right: 20px;
        }
        &:last-child {
          margin-top: 13px;
          padding: 12px 0px;
          color:var(--color-font-default);
          font-weight: bold;
          border-top:1px solid var(--color-border-default);
        }
      }
    }
    .cards {
      width: 100%;
      margin: 0;
      padding-left: 20px;
      h3 {
        padding-left: 32px;
      }
    }
    >>> .hips-group {
      border-bottom: 8px solid var(--color-border-default) !important;
    }
    >>> .hips-group:last-child {
      border-bottom: 0 !important;
    }
  }

}

.filterWrap {
  padding: 16px 20px;
  font-size: 16px;
  margin-bottom: 16px;

  li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    // line-height: 26px;
    font-size: 18px;
    color:var(--color-font-default);
    font-weight: bold;
    margin-top: 28px;
    height: 26px;
    line-height: 26px;

    &:nth-child(1) {
      margin-top: 0;
    }
  }

  .dateWrap, .supplier, .order-status {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom:1px solid var(--color-border-default);
    font-size: 16px;
    color:var(--color-font-default-b);
    // line-height: 34px;
    padding: 8px 0px 4px 0px;
    font-family: PingFangSC-Regular;


    >>> .hips-input {
      padding: 0;
      padding-left: 2px;
      height: 30px;
    }
    >>> .hips-input__input-value input {
      margin: 5px 0px;
      font-size: 16px;
    }
    >>> .hips-input__input-value input::-webkit-input-placeholder {
      font-size: 16px;
      color:var(--color-font-default-b) !important;
    }


    .date-item {
      width: 27vw;
      text-align: left;
      margin-top: 4px;
    }

    .supplier-item {
      width: 265px;
      color:var(--color-font-default);
    }

    .status-item {
      width: 80%;
      display flex;
      flex-wrap wrap;

      .status {
        border-radius: 18px;
        margin-right 10px;
        color: var(--color-other-default-b);
        background: #EEFBFA;
        height: 28px;
        line-height 28px;
        font-size: 12px;
        padding: 0px 0px 5px 12px;
      }

      .delete {
        display: inline-block;
        margin-left: 4px;
        height: 12px;
        width: 12px;
        color: var(--color-font-default-e);
      }
    }
  }

  .search {
      >>> .hips-search__input {
        border: 1px solid #C6CAD6;
        border-radius: 16px;
        background-color: #0000;
      }

      >>> .hips-input__input-value input {
        margin: 5px 0px;
        background-color: #0000;
      }
    }
}


.handlerWrap {
  display: flex;

  span {
    flex: 1;
    font-family: PingFangSC-Regular;
    font-size: 16px;
    color:var(--color-font-default-b);
    line-height: 56px;
    text-align: center;

    &:nth-child(2) {
      color:var(--color-font-default-d);
      background: var(--color-other-default-b);
    }
  }
}

.confirmWrap {
  width: 100%;
  background-color:var(--color-font-default-d);
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 666;

  .editModal {
    display: flex;
    align-items: center;
    background:var(--color-bg-default);
    box-shadow: 0 -1px 2px 0 rgba(27,30,43,0.10);
    height: calc(49px + constant(safe-area-inset-bottom));
    height: calc(49px + env(safe-area-inset-bottom));
    >>> .hips-cell{
      padding-left: 20px;
    }
    div {
      flex: 1;

      &:nth-child(2) {
        text-align: right;
        padding-right: 20px;

        span {
          display: inline-block;
          width: 64px;
          line-height: 34px;
          border-radius: 2px;
          background: var(--color-other-default-b);
          font-family: PingFangSC-Regular;
          font-size: 16px;
          color:var(--color-font-default-d);
          text-align: center;
          margin-left: 12px;
        }
        .delBtn{
          background: var(--color-other-default);
        }
      }
    }
  }
}
>>> .bscroll-indicator{
  display: none !important;
}
</style>
