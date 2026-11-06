<!-- eslint-disable rulesdir/no_hips -->
<template>
  <hips-view class="receipt-list">
    <div class="content">
      <div class="search-line">
        <searchs
          v-model="searchVal"
          :handle-search="handleSearch"
          :placeholder="$T('sinv.receiptExecution.view.search.orderNumberAndItemcode').$D('请输入订单/协议号/物料编码查询')"/>
        <!-- <span v-if="(treeList[activeKey] || {children:[{}]}).children[activeNode].actionCode === 'WAITING'"
              class="scanner" @click="goScanner">
          <img src="@/assets/ReceiptExecution/icon_16px_line_scan_highlight@3x.png">
        </span> -->
      </div>
      <drop-nav-wrap
        :nav-arr="navArr"
        :active-key="activeKey"
        :drop-img="dropPop"
        @changeNavTab="changeNavTab"
        @DropNavTab="DropNavTab">
        <div class="nav-show">
          <div class="nav-block" @click="showAllType">
            <img src="@/assets/ReceiptExecution/icon_12px_line_list_highlight@3x.png">
            <span>{{ $T("sinv.sodr.common.view.message.title.all").$D("全部") }}</span>
          </div>
        </div>
      </drop-nav-wrap>
      <div
        v-show="
          treeList[activeKey] &&
            nowNode.actionCode === 'FINISHED'
        "
        class="doing-tab">
        <span
          :class="fishedType ? 'active-doing' : ''"
          @click="changefishedType(true)">{{ $T('sinv.receiptExecution.view.message.detailSearch').$D('按明细查询') }}</span>
        <span
          :class="!fishedType ? 'active-doing' : ''"
          @click="changefishedType(false)">{{ $T('sinv.receiptExecution.view.message.listSearch').$D('按单查询') }}</span>
      </div>
      <total-count
        class="float-total"
        :list-len="list.length"
        :count="totalCount"
        :info="$T('hipspfm.common.message.documentInfo').$D('单据信息')"/>
      <div
        v-if="list.length"
        class="scrollWrap"
        style="height: calc(100vh - 140px)">
        <hips-scroll
          ref="scroll"
          :data="[list]"
          :scroll-options="scrollOption"
          @pulling-down="loadRefresh"
          @pulling-up="loadMore">
          <wait-card
            v-if="
              treeList[activeKey] &&
                nowNode.actionCode === 'WAITING'
            "
            :lists="list"
            :now-node="nowNode"
            :check-list="checkList"
            class="scrollWrap"/>
          <doing-card
            v-if="
              treeList[activeKey] &&
                nowNode.actionCode === 'DOING'
            "
            :lists="list"
            :display="display"
            :now-node="nowNode"
            :check-list="checkList"
            class="scrollWrap"/>
          <line-card
            v-if="
              treeList[activeKey] &&
                nowNode.actionCode ===
                'FINISHED' &&
                fishedType
            "
            :lists="list"
            :display="display"
            :now-node="nowNode"
            class="scrollWrap"
            @handleExce="handleExce"/>
          <head-card
            v-if="
              treeList[activeKey] &&
                nowNode.actionCode ===
                'FINISHED' &&
                !fishedType
            "
            :now-node="nowNode"
            :lists="list"
            class="scrollWrap"/>
        </hips-scroll>
      </div>
      <no-content
        v-else-if="list.length === 0 && !loading"
        :title="$T('smbl.common.view.noDocumentInformation').$D('暂无单据信息')"
        :refresh="loadRefresh"
        img-src="NoOrder@3x.png"/>

      <div class="content-bottom"/>
      <srm-flex v-if="(treeList[activeKey] || {children:[{}]}).children[activeNode].actionCode === 'WAITING'" slot="bottom" class="round-btn-box" justify="end">
        <srm-button class="round-btn" size="x-large" circle type="primary" fill @click="goScanner">
          <em class="srm-icon icon-scan"/>
        </srm-button>
      </srm-flex>
    </div>

    <!-- 下拉筛选弹窗 -->
    <srm-popup :visible.sync="dropPop" width="100%" :show-header="false" position="free" :top="showBackFlag ? 130 : 92">
      <div class="drop-pop" @click.stop>
        <div class="drop-pop-status">
          <span
            v-for="(item, index) in (treeList[activeKey] || {}).children || []"
            :key="index"
            :class="
              index === activeNode
                ? 'active-line-block line-block'
                : 'line-block'
            "
            @click="changeNode(index)">
            <span :class="item.actionCode === 'WAITING'?'line-val wait-line-val':'line-val'">{{ item.actionName + " " }} {{
              item.actionCount
            }}</span>
            <!-- <span v-if="item.actionCode === 'WAITING'" class="scanner" @click="goScanner">
              <img src="@/assets/ReceiptExecution/icon_16px_line_scan_highlight@3x.png" >
            </span> -->
          </span>
        </div>
        <div class="seach-pop">
          <div class="seach">
            <div class="seach-label">
              <srm-dropdown
                v-model="seachType"
                :text="$T('sinv.receiptExecution.model.receipt.trxNum').$D('单据编号')"
                type="tooltip">
                <srm-flex direction="column">
                  <srm-dropdown-item
                    value="trxNum"
                    :text="$T('sinv.receiptExecution.model.receipt.trxNum').$D('单据编号')"/>
                  <srm-dropdown-item
                    value="supplierCompanyId"
                    :text="$T('sinv.receiptExecution.model.receipt.supplierName').$D('供应商')"/>
                  <srm-dropdown-item
                    value="itemId"
                    :text="$T('sinv.receiptExecution.model.receipt.item').$D('物料')"/>
                </srm-flex>
              </srm-dropdown>
            </div>
            <srm-input-field v-if="seachType === 'trxNum'"
                             v-model="trxNum"
                             :placeholder="$T('sinv.receiptExecution.model.receipt.trxNum').$D('单据编号')"/>
            <srm-lov-field v-else-if="seachType === 'supplierCompanyId'"
                           key="supplierCompanyId"
                           v-model="supplierData.supplierCompanyId"
                           code="SPRM.SUPPLIER"
                           :options="{ valueField: 'supplierCompanyId' }"
                           :placeholder="$T('sinv.receiptExecution.model.receipt.supplierName').$D('供应商')"
                           :display.sync="supplierData.supplierCompanyName"/>
            <srm-lov-field v-else
                           key="supplierCompanyId"
                           v-model="itemData.itemId"
                           code="SMDM.ITEM"
                           :placeholder="$T('sinv.receiptExecution.model.receipt.item').$D('物料')"
                           :display.sync="itemData.itemName"/>
          </div>
          <span class="seach-pop-btn" @click="handleDropSearch">{{
            $T("hipspfm.common.message.search").$D("查询")
          }}</span>
        </div>
      </div>
    </srm-popup>

    <!-- 全部类型弹窗 -->
    <hips-popup
      v-model="allTypePop"
      position="right"
      class="filter-pop"
      style="width: 80%">
      <div class="filter-wrap">
        <div v-for="(li, key) in treeList" :key="key" class="filter-line">
          <div class="line-title">
            {{ li.nodeConfigName }}
            <i v-show="inSearch && getTipVal(li)">({{ getTipVal(li) }})</i>
          </div>
          <div class="line-content">
            <span
              v-for="(item, index) in li.children"
              :key="index"
              :class="
                index === activeNode && key === activeKey
                  ? 'active-line-block line-block'
                  : 'line-block'
              "
              @click="changeNode(index, key)">
              <span class="line-val">{{ item.actionName + " " }} {{ item.actionCount }}</span></span>
          </div>
        </div>
      </div>
      <div class="filter-pop-bottom" @click="showAllType">
        {{ $T("hipspfm.common.button.cancle").$D("取消") }}
      </div>
    </hips-popup>

    <div
      v-show="treeList[activeKey] && nowNode.actionCode !== 'FINISHED'"
      class="bottom-op">
      <div class="editModal">
        <hips-checkbox
          v-model="checkAllFlag"
          :border="false"
          :disabled="!list.length">
          <span style="fontsize: 16px">{{
            $T("hipspfm.common.message.selectAll").$D("全选")
          }}</span>
        </hips-checkbox>
        <div>
          <span v-if="nowNode.actionCode === 'WAITING'" class="pass-btn-left"
                @click="handleAllExce">{{ $T("sinv.receiptExecution.model.receipt.execution.all").$D("全选执行") }}</span>
          <span class="pass-btn" @click="handleExce">{{
            $T("sinv.receiptExecution.model.receipt.execution").$D("执行")
          }}</span>
        </div>
      </div>
    </div>

    <lov
      v-if="catalogPop"
      v-model="catalogPop"
      :code="cataLovCode"
      :query-params="{ lovCode: cataLovCode, tenantId,nodeConfigId, strategyLineIds}"
      :query-field="['rcvTypeCode', 'rcvTypeName']"
      @submitValue="GetCatalogValue"/>
    <lov
      v-if="catalogAllPop"
      v-model="catalogAllPop"
      :code="cataLovCode"
      :query-params="{ lovCode: cataLovCode, tenantId,nodeConfigId }"
      :query-field="['rcvTypeCode', 'rcvTypeName']"
      @submitValue="GetCatalogAllValue"/>
  </hips-view>
</template>

<script>
import DropNavWrap from "@/components/DropNavWrap";
import WaitCard from "../components/WaitCard";
import DoingCard from "../components/DoingCard";
import LineCard from "../components/LineCard";
import HeadCard from "../components/HeadCard";
import Lov from "@/components/Lov";
import Searchs from "@/components/SearchsV4";
import NoContent from "@/components/NoContent";
import { closeWebView, scanBridge } from "srm-mobile-ui/src/utils/jsBridge";
import mixin from "../mixin/index.js";
import TotalCount from "srm-mobile-ui/packages/srm-list/TotalCount";
import { Icon, View, Popup, Input, NavBar, Scroll, Checkbox } from "hips";
import * as dd from "dingtalk-jsapi";
import {
  getTreeListApi,
  getWaitListApi,
  getHeaderListApi,
  getLineListApi,
  getDoingListApi,
  getProgressApi,
} from "../api/index";
import SrmAppCore from "srm-front-app-core";

export default {
  modules: [ "hipspfm.invoiceInspection", "hipspfm.scanCollection", "sinv.receiptExecution", "sinv.sodr", "hipspfm.common", "smbl.common", "hipspfm.expertScoring", "hzero.common", "sinv.purchaseReception", "hezro.common" ],
  name: "ReceiptExecutionList",
  components: {
    Lov,
    WaitCard,
    DoingCard,
    LineCard,
    HeadCard,
    DropNavWrap,
    Searchs,
    NoContent,
    TotalCount,
    [View.name]: View,
    [Icon.name]: Icon,
    [Input.name]: Input,
    [Popup.name]: Popup,
    [NavBar.name]: NavBar,
    [Checkbox.name]: Checkbox,
    [Scroll.name]: Scroll,
  },
  mixins: [ mixin ],
  data() {
    return {
      loading: false, // 加载状态
      treeList: [],
      list: [], // 列表数据
      searchVal: "", // 搜索条件
      dropSearchVal: "", // 下拉搜索条件
      totalCount: 0, // 数量
      allTypePop: false, // 全部类型弹窗
      checkList: { arr: [] }, // 选中的数组
      checkAllFlag: false, //全选标志
      dropPop: false, // 下拉弹窗标志
      fishedType: true, // 已完成查询tab
      activeKey: 0, // 上方节点
      activeNode: 0, // 选中的最下节点
      page: 0, // 记录当前页
      showCount: false, // 展示总计数量
      queryParams: {
        trxNum: "",
        itemId: "",
        supplierCompanyId: "",
      }, // 下拉搜索参数
      seachType: "trxNum", // 下拉搜索类型
      trxNum: "", // 下拉搜索-单据编号
      supplierData: {}, // 下拉搜索-供应商
      itemData: {}, // 下拉搜索-物料
      clearFlag: false,
      clearFlagA: false,
      tenantId: window.localStorage.getItem("tenantId"),
      inSearch: false,
    };
  },
  computed: {
    navArr() {
      // return
      const data = this.treeList.map((i) => ({
        title: i.nodeConfigName,
        haveTip: this.inSearch && this.getTipVal(i),
        tipVal: this.getTipVal(i)
      }));

      return data || [];
    },
    // 判断是否存在tip
    getTipVal() {
      return (data = {}) => (data.waitingCount || 0) + (data.doingCount || 0) + (data.finishedCount || 0);
    },
    // 部分展示逻辑判断
    display() {
      const { authorityCode = [], actionCode = "", reverseEnable = 0 } = this.nowNode || {};

      return authorityCode &&
        authorityCode.includes("UPDATE") &&
        (actionCode === "FINISHED" ? Boolean(reverseEnable) : true) || false;
    },
    // 当前节点对象
    nowNode() {
      return this.treeList.length ? (this.treeList[this.activeKey] || {}).children[this.activeNode] : [];
    }
  },
  watch: {
    checkAllFlag(value) {
      if (value) {
        this.checkList.arr = [ ...this.list ];
      } else if (this.checkList.arr.length === this.list.length && !value) {
        this.checkList.arr = [];
      }
    },
    checkList: {
      handler(value) {
        if (value.arr.length === this.list.length && value.arr.length) {
          this.checkAllFlag = true;
        } else {
          this.checkAllFlag = false;
        }
      },
      deep: true,
    },
  },
  async activated() {
    try {
      this.$loading.show();
      this.list = [];
      this.loading = true;
      await this.getTreeList();
      // await this.getExecList()
      await this.changeNavTab(0);
      this.$loading.hide();
    } catch (err) {
      this.loading = false;
      this.$loading.hide();
    }
  },
  methods: {
    //筛选弹窗
    showPopup() {
      this.show = !this.show;
    },
    showAllType() {
      this.allTypePop = !this.allTypePop;
      this.dropPop = false;
    },
    // 改变tab
    async changeNavTab(index, node = 0) {
      this.dropPop = false;
      this.activeKey = index;
      this.activeNode = node || 0;
      this.fishedType = true;
      this.clearSearch();
      await this.loadRefresh();
    },
    // 改变下方节点
    async changeNode(index, key) {
      this.activeNode = index;
      this.activeKey = key || key === 0 ? key : this.activeKey;
      this.fishedType = true;
      this.allTypePop = false;
      this.dropPop = false;
      this.clearSearch();
      await this.loadRefresh();
    },
    // 计算搜索后有数据的第一栏node
    calcNode() {
      for (let i = 0; i < this.treeList.length; i++) {
        if (this.treeList[i].waitingCount) {
          this.activeKey = i;
          this.activeNode = 0;
          return;
        }
        if (this.treeList[i].doingCount) {
          this.activeKey = i;
          this.activeNode = 1;
          return;
        }
        if (this.treeList[i].finishedCount) {
          this.activeKey = i;
          this.activeNode = 2;
          return;
        }
      }
    },
    // 改变已完成查询类型
    async changefishedType(val) {
      this.fishedType = val;
      this.clearSearch();
      await this.loadRefresh();
    },
    // 重复点击
    DropNavTab() {
      this.dropPop = !this.dropPop;
    },
    goToDetail() {
      // this.$router.push({
      //   name: "RfxHallDetail",
      //   query: { rfxHeaderInfo:li }
      // });
      // this.$store.commit("setTenderHallList", li);
    },
    // 获取供应商数据
    GetSupplierValue(val) {
      this.supplierData = val[0];
    },
    // 获取物料数据
    GetItemValue(val) {
      this.itemData = val[0];
    },
    // 搜索框搜索
    async handleSearch() {
      await this.getTreeList();
      this.calcNode();
      await this.changeNavTab(this.activeKey, this.activeNode);
    },
    async handleExce(arr) {
      let selectArr = this.checkList.arr;

      if (arr.length) {
        selectArr = arr;
      }

      const success = async (res) => {
        if (this.nowNode.actionCode === "WAITING") {
          this.$router.push({
            name: "ReceiptExecDoingDetail",
            query: {
              rcvTrxHeaderId: res.rcvTrxHeaderId,
              nodeConfigIndexAbc: this.nowNode.nodeConfigIndexAbc,
              canEdit: 1
            }
          });
        } else {
          await this.changeNavTab(this.activeKey);
        }
      };
      await this.handleExceFun(selectArr, this.nowNode, success);
    },
    //全部执行
    async handleAllExce() {
      const success = async (res) => {
        if (this.nowNode.actionCode === "WAITING") {
          this.$router.push({
            name: "ReceiptExecDoingDetail",
            query: {
              rcvTrxHeaderId: res.rcvTrxHeaderId,
              nodeConfigIndexAbc: this.nowNode.nodeConfigIndexAbc,
              canEdit: 1
            }
          });
        } else {
          await this.changeNavTab(this.activeKey);
        }
      };

      await this.handleAllExceFun(this.nowNode, success);
    },
    // 加载刷新数据
    async loadRefresh() {
      this.page = 0;
      this.loading = true;
      this.checkList.arr = [];
      this.list = [];
      await this.getExecList();
    },
    // 加载更多数据
    async loadMore() {
      if (this.list.length < this.totalCount) {
        this.page++;
        await this.getExecList(true);
      } else {
        this.$nextTick(() => {
          this.$refs.scroll.forceUpdate();
        });
      }
    },
    // 获取树结构
    async getTreeList() {
      this.inSearch = false;
      const params = {
        allSource: this.searchVal,
      };

      await getTreeListApi(params).then((res) => {
        if (res && !res.failed) {
          const data = res.map((i) => {
            if (i.children) {
              const children = i.children.map((j) => ({
                ...j,
                ...params,
                title: `${j.actionName}(${j.actionCount || 0})`,
                parentId: j.nodeConfigId,
              }));

              return {
                ...i,
                parentId: null,
                pkId: i.nodeConfigId,
                children,
              };
            }
            return { ...i, parentId: null, pkId: i.nodeConfigId };
          });

          this.treeList = data;
        }
      });
    },
    // 获取列表
    async getExecList(needLoad = false) {
      needLoad || this.$loading.show();
      const {
        actionCode = "",
        nodeConfigIndexAbc,
        nodeConfigId,
      } = this.nowNode;

      let params = {
        page: this.page,
        size: 10,
        nodeConfigId,
        allSource: this.searchVal,
        customizeUnitCode: `SINV.RECEIPT_EXECUTE_${actionCode}.${nodeConfigIndexAbc}`,
      };

      if (this.searchVal) {
        this.inSearch = true;
      }
      params = { ...params, ...this.queryParams };
      const resFunc = async ({ content = [], totalElements = 0 } = {}) => {
        const promiseArr = content.map((i, key) => new Promise((resolve) => {
          const newParams = {
            rcvTrxHeaderId: i.rcvTrxHeaderId,
            rcvTrxLineId: i.rcvTrxLineId,
          };
          const urlParam =
            this.nowNode
              .actionCode === "WAITING" ?
              "waiting-top-tree" :
              "top-tree";

          getProgressApi(urlParam, newParams).then((res) => {
            if (res && !res.failed && !res.error) {
              content[key].processList = res;
            }
            resolve();
          }).catch((err) => {
            // 接口报错
            content[key].processList = {};
            resolve(err);
          });
        }));
        // 批量获取进度

        await Promise.all(promiseArr)
          .then(() => {
            this.list = [ ...this.list, ...content ];
            this.totalCount = totalElements;
            if (!needLoad) {
              this.showCount = true;

              setTimeout(() => {
                this.showCount = false;
              }, 3000);
            }
          })
          .catch((err) => {
            console.log(err, 222);
          })
          .finally(() => {
            needLoad || this.$loading.hide();
            this.loading = false;
          });
      };

      switch (actionCode) {
      case "DOING":
        await getDoingListApi(params).then(async (res) => resFunc(res));
        break;
      case "FINISHED":
        if (this.fishedType) {
          await getLineListApi(params).then(async (res) => resFunc(res));
        } else {
          params.customizeUnitCode = `SINV.RECEIPT_EXECUTE_ALL_${actionCode}.${nodeConfigIndexAbc}`;
          await getHeaderListApi(params).then(async (res) => resFunc(res));
        }
        break;
      default:
        await getWaitListApi(params).then(async (res) => resFunc(res));
        break;
      }
    },
    // 下拉完成按钮搜索
    async handleDropSearch() {
      this.queryParams.trxNum = this.trxNum;
      this.queryParams.itemId = this.itemData.itemId || "";
      this.queryParams.supplierCompanyId = this.supplierData.supplierCompanyId || "";
      this.dropPop = false;
      await this.loadRefresh();
    },
    // 单个清除下拉框搜索值
    clearDropSearch() {
      switch (this.seachType) {
      case "supplierCompanyId":
        this.supplierData = {};
        break;
      case "itemId":
        this.itemData = {};
        break;
      default:
        this.trxNum = "";
        break;
      }
    },
    // 清除搜索及各种状态
    clearSearch() {
      // this.seachType = "trxNum";
      this.trxNum = "";
      this.supplierData = {};
      this.itemData = {};
      this.queryParams = {
        trxNum: "",
        itemId: "",
        supplierCompanyId: "",
      };
      this.clearFlag = true;
      this.clearFlagA = true;
    },
    // 退出子应用
    goBack() {
      try {
        closeWebView();
      } catch (err) {
        this.$router.back();
      }
    },
    //回到顶部
    goTop() {
      this.$refs.scroll.scrollTo(0, 0);
    },
    //扫一扫
    async goScanner() {
      let _this = this;
      SrmAppCore.scanQrCode(async function (result) {
        console.info(result);
        await _this.scanQuery(result);
      },function (){
        _this.$notification.open({
          message: _this
              .$T("hipspfm.invoiceInspection.view.message.scanAbnormal")
              .$D("扫码异常"),
          key,
          class: "notification",
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
    //   HWH5.scanCode({ needResult: 1 })
    //     .then(async (res) => {
    //       let asnNum = JSON.parse(res).result;
    //       await that.scanQuery(asnNum);
    //     })
    //     .catch(() => {
    //       that.$notification.open({
    //         message: that
    //           .$T("hipspfm.invoiceInspection.view.message.scanAbnormal")
    //           .$D("扫码异常"),
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
    //         key,
    //         class: "notification",
    //       });
    //     },
    //     cancel: function (resE) {
    //       console.log("cancel", resE);
    //       // that.goBack();
    //     }
    //   });
    // },
    // // APP扫码
    // async getAppScan() {
    //   let that = this;
    //
    //   await scanBridge()
    //     .then(async (res) => {
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
    //         console.log("钉钉扫码结果", data);
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
    //       }
    //     });
    //   });
    // },
    // 处理扫码结果
    async scanQuery(val) {
      this.clearSearch();
      this.trxNum = val;
      await this.handleDropSearch();
      if (this.list.length) {
        // this.$router.push({
        //   name:'ReceiptExecWaitDetail',
        //   query:{itemData:this.list[0],nowNode:this.nowNode}
        // })
        // 跳转改为执行
        await this.handleExce(this.list);
      }
    }
  },
};
</script>

<style lang="stylus" >
.receipt-list {
  .hips-checkbox__checked {
    position: absolute !important;
    top: 13px !important;
    left: 15px !important;
    z-index: 1;
    border: 2px solid #afafaf !important;
    width: 18px !important;
    height: 18px !important;
  }

  .hips-checkbox__checked--active {
    border: 0 !important;
  }

  .navWrap {
    border-bottom 1px solid var(--color-bg-default-b)
  }

  .content {
    .doing-tab {
      width: 100%;
      display: flex;
      padding: 8px 15px;
      border-bottom: 1px solid #f6f6f6;
      font-size: 10px;
      font-weight: bold;
      color: #333333;
      line-height: 12px;
      position: relative;
      z-index: 999;
      background: var(--color-bg-default);

      span {
        padding: 6px 8px;
        margin-right: 12px;
      }

      .active-doing {
        color: var(--color-other-default-b);
        background: #eff3fe;
        border-radius: 16px;
      }
    }

    .searchWrap {
      padding: 4px 15px;
      height: auto;

      .hips-search {
        width: auto;
      }

      .hips-input__input-value {
        input {
          color: var(--color-font-default);
        }
        input:

        :-webkit-input-placeholder {
          font-size: 14px !important
          text-align: left;
          color: #afafaf !important
          line-height: 20px !important
        }

      }
    }

    .nav-show {
      position: absolute;
      top: 0;
      right: 0;
      width: 69px;
      height: 44px;
      background: var(--color-bg-default);
      box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.08);
      padding: 12px 15px 12px 12px;

      .nav-block {
        width: 42px;
        height: 20px;
        border: 1px solid var(--color-other-default-b);
        color: var(--color-other-default-b);
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        font-weight: bold;
        text-align: left;
        line-height: 12px;

        img {
          width: 12px;
          height: 12px;
        }
      }
    }

    .float-total {
      // position: absolute;
      // z-index: 10;
      // opacity: 0.8;
      // transition: all 0.2s ease;
      // transform: translate(0, 0);

      .srm-total-count-wrap {
        opacity .8
        z-index 10
      }
    }

    .hide-total {
      transform: translate(0, -34px);
    }

    .scrollWrap {
      font-size: 14px;
      background: #f0f2f5

      .hips-cell, .hips-thinline {
        padding: 0;
      }

      .hips-checkbox {
        background-color: var(--color-bg-default-b) !important;
      }

      .card {
        margin-bottom: 8px;
        position: relative;
        width: 100vw;
        background: var(--color-bg-default);

        .code-type {
          height: 16px;
          margin-right: 8px;
          padding: 2px;
          background: #eff3fe;
          border-radius: 2px;
          font-size: 10px;
          font-weight: bold;
          text-align: center;
          color: #276ef1;
          line-height: 12px;
        }

        ul {
          padding: 0 15px 12px 15px;
          border-bottom: 1px solid var(--color-bg-default-b);

          li {
            display: flex;
            justify-content: space-between;
            margin-top: 8px;
            font-size: 14px;
            color: #1B1E2B;

            // &:nth-child(2) span {
            //   line-height: 22px;

            //   &:nth-child(1) {
            //     width: 224px;
            //   }
            // }

            span {
              display: inline-block;
              line-height: 20px;
            }
          }

          .card-b {
            span {
              flex: 1;
            }
          }

          .can-edit {
            width: 353px;
            height: 28px;
            background: #eff3fe;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: relative;
            left: -4px;

            span {
              margin-left: 4px;
              flex: 1;
              display: flex;
              align-items: center;
            }

            img {
              width: 20px;
              height: 20px;
              margin-right: 4px;
            }
          }

          .code {
            font-weight: bold;
            margin-left: 25px;
            height 44px;
            margin-top 0;

            .code-span-type {
              color: var(--color-other-default-b);
            }

            span {
              display: flex;
              align-items: center;
            }
          }

          .code-before:before {
            content: '';
            width: 7px;
            height: 10px;
            background: #276ef1;
            position: absolute;
            top: 16px;
            left: 0;
          }

          .code-before {
            margin-left: 0;
          }
        }

        .card-bottom {
          font-size: 10px;
          color: #cbcbcb;
          line-height: 12px;
          // padding: 8px 15px 8px 11px;
          display: flex;
          align-items: center;
          justify-content: space-between;

          .bottom-status {
            display: flex;
            align-items: center;
            max-width: 280px;
            overflow: auto;
            margin: 12px 0px 12px 15px;

            span {
              border: 1px solid #cbcbcb;
              border-radius: 10px;
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding: 2px 4px 2px 3px;
              margin-right: 12px;
              flex-shrink: 0;

              i {
                width: 14px;
                height: 14px;
                background: #cbcbcb;
                color: var(--color-font-default-d);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 2px;
              }
            }

            span:nth-last-child(1) {
              margin-right: 0;
            }

            .active {
              color: var(--color-other-default-b);
              border: 1px solid var(--color-other-default-b);

              i {
                background: var(--color-other-default-b);
              }
            }
          }

          .bottom-status::-webkit-scrollbar {
            height: 0 !important;
          }

          .card-btn {
            width: 56px;
            height: 28px;
            background: var(--color-other-default-b);
            border-radius: 14px;
            font-size: 12px;
            font-weight: bold;
            text-align: center;
            color: var(--color-font-default-d);
            line-height: 28px;
            margin 8px 15px 8px 0
          }
        }
      }

      >>> .hips-group:last-child {
        border-bottom: 0 !important;
      }
    }
  }

  .li-input {
    flex-grow: 1;
    border: 0;
    outline: none;
    background-color: rgba(0, 0, 0, 0);
  }
}

.drop-pop {
  .drop-pop-status {
    padding: 24px 15px;
    width: 375px;
    display: flex;
    align-items: center;
    background: var(--color-bg-default-b);
    overflow auto

    .line-block {
      margin-right: 16px;
    }

    .wait-line-val {
      margin 8px 9px 8px 12px
    }

    .scanner {
      width: 28px;
      height: 28px;
      margin-right: 2px;
      background: var(--color-bg-default);
      border-radius: 50%;
      display flex
      align-items center
      justify-content center

      img {
        width 16px
        height 16px
      }
    }
  }

  .seach-pop {
    font-size: 14px;
    color: #333333;
    line-height: 20px;
    background: var(--color-bg-default);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 15px;

    .seach-pop-btn {
      background: var(--color-other-default-b);
      border: 1px solid var(--color-other-default-b);
      border-radius: 18px;
      margin-left: 16px;
      font-weight: bold;
      color: #ffffff;
      padding: 8px 16px;
      flex-shrink: 0;
    }

    .seach {
      display: flex;
      align-items: center;
      background: var(--color-bg-default-b);
      border-radius: 18px;
      padding: 2px;
      width: 268px;

      .li-input {
        max-width: 146px;
        margin-left: 8px;
      }
    }

    .seach-span {
      height: 20px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      flex 1;
    }

    .clear-img {
      width 24px
      height 24px
      margin 4px 0
    }
  }
}

.line-block {
  font-size: 12px;
  color: var(--color-font-default-d);
  line-height: 16px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  border: 1px solid #afafaf;
  color: #afafaf;

  .line-val {
    margin 8px 12px
  }
}

.active-line-block {
  // width: 78px;
  height: 32px;
  border: 1px solid var(--color-other-default-b);
  background: var(--color-other-default-b);
  color: #ffffff;
}

.filter-pop {
  height: 100vh;

  .filter-wrap {
    max-height: calc(100% - 80px);
    overflow: auto;
    padding: 16px 15px 0 0;

    .line-title {
      font-size: 14px;
      font-weight: bold;
      text-align: left;
      color: var(--color-font-default);
      margin-bottom: 12px;
      line-height: 20px;
      margin-left 16px
      position relative
    }

    .filter-line {
      .line-val {
        margin 8px
      }

      .drop-nav-tip::before {
        content: ''
        width 6px
        height 6px
        background #EC0C0C
        border-radius 50%
        position absolute
        margin-left 2px
      }
    }

    .line-content {
      display: flex;
      align-items: center;
      // justify-content: space-between;
      margin-bottom: 16px;
      flex-wrap wrap

      .line-block {
        margin-bottom 12px
        margin-left 16px
      }
    }
  }

  .filter-pop-bottom {
    position: absolute;
    bottom: 12;
    bottom: calc(12px + constant(safe-area-inset-bottom));
    bottom: calc(12px + env(safe-area-inset-bottom));
    width: calc(100% - 32px);
    display: flex;
    align-items: center;
    justify-content: center;
    height: 48px;
    margin-left: 15px;
    background: #f6f6f6;
    border-radius: 24px;
    font-size: 14px;
    font-weight: bold;
    color: #333333;
    line-height: 20px;
  }
}

.bottom-op {
  line-height: 49px;
  // height: 60px;
  width: 100%;
  background-color: var(--color-font-default-d);
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 100;
  box-shadow: 0px -2px 6px 0px rgba(0, 0, 0, 0.06);

  .editModal {
    width: 100%;
    height: 100%;
    padding: 12px 15px;
    padding-bottom: calc(12px + constant(safe-area-inset-bottom));
    padding-bottom: calc(12px + env(safe-area-inset-bottom));
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    font-weight: bold;
    color: #afafaf;
    line-height: 20px;

    .hips-checkbox__checked {
      position: unset !important;
    }

    .hips-cell {
      padding: 0 !important;
    }

    .pass-btn-left {
      background: var(--color-other-default-b);
      // border: 1px solid var(--color-other-default-b);
      border-radius: 18px;
      padding: 8px 16px;
      color: var(--color-font-default-d);
      margin-right: 5px;
    }

    .pass-btn {
      background: var(--color-other-default-b);
      // border: 1px solid var(--color-other-default-b);
      border-radius: 18px;
      padding: 8px 16px;
      color: var(--color-font-default-d);
    }

    div:nth-child(2) {
      display flex
    }
  }
}

.search-line {
  width: 100%;
  height: 44px;
  display: flex;

  .scanner {
    width: 44px;
    height: 44px;
    margin-right: 15px;
    background-color: blue;
    background: var(--color-bg-default);
    border-radius: 50%;
    flex-shrink: 0;
    display: flex;
    align-self: center;
    align-items: center;
    justify-content: center;

    img {
      width 32px
      height 32px
    }
  }
}

.round-btn {
  line-height normal;
  pointer-events auto;

  .srm-icon {
    font-size 28px;
  }
}
  .round-btn-box {
       background transparent;
       margin-bottom: 21.333vw;
       padding-right 15px;
       position: fixed!important;
       bottom: 5.6vw;
       right: 5.333vw;
       z-index: 1000;
    }

</style>
<style lang="stylus" scoped>
>>> .srm-dropdown {
  height auto;

  .srm-dropdown-button-tooltip {
    background var(--background-color-empty);
  }
}
</style>
