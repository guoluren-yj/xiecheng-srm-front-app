<template>
  <div>
    <!-- 导航 -->
    <nav-head :title="$T('ssrc.inquiryHall.view.title.checkPriceDetail').$D('核价详情')" @goBack="goBack"/>

    <div v-if="finishLoad" class="rfxprice-detail">
      <!-- 头信息 -->
      <srm-detail-head
        :columns="getHeadColumn"
        :data-source="headInfo">
        <div class="button-right-margin">
          <srm-button size="small" icon="icon-paperclip" @click="showHeadFilePop">
            <!-- <img src="@/assets/4.0/icon_Button_paperclip_highlight@3x.png"> -->
            <span>{{ $T('ssrc.inquiryHall.button.inquiryHall.file').$D('详情附件') }}</span>
          </srm-button>
          <srm-button size="small" icon="icon-clock" type="warn" @click="showOperationPop">
            <!-- <img src="@/assets/4.0/icon_Button_clock_highlight@3x.png"> -->
            <span>{{ $T('hzero.common.status.history').$D('历史记录') }}</span>
          </srm-button>
          <srm-button size="small" type="primary" @click="goHeadInfoDetail">
            <!-- <img src="@/assets/4.0/icon_Button_clock_highlight@3x.png"> -->
            <span>{{ $T("ssrc.inquiryHall.view.inquiryHall.headerDetail").$D("表头详情") }}</span>
          </srm-button>
        </div>
      </srm-detail-head>

      <!-- 内容区 -->
      <srm-scroll-tab v-if="JSON.stringify(headInfo) !== '{}'" class="content" no-all @tabChange="changeTab">
        <!-- 物料明细 -->
        <srm-scroll-tab-item v-if="onlyAllowAllWinBids===0" :label="$T('ssrc.inquiryHall.view.message.tab.itemLine').$D('物料明细')" prop-key="itemLine">
          <div class="content-item">
            <div v-for="item in itemHeadData" :key="item.rfxLineItemNum" style="padding:15px 0">
              <srm-collapse :max-open="1">
                <srm-collapse-item v-model="item.isShow" :name="item.rfxLineItemNum">
                  <div class="title" @click.stop>
                    <customize :columns="getMaterialTitleColumns" :data-source="item" />
                  </div>
                  <div slot="content" class="content-body">
                    <div class="list">
                      <div
                        v-for="(line, index) in item.checkData"
                        :key="index"
                        class="list-item">
                        <div class="list-content">
                          <!-- 个性化组件替换后的代码 -->
                          <customize ref="customize" :columns="getColumns('itemLine')" :data-source="line" code="SMBL.INQUIRY_HALL.LIST.TAB_ITEM_DTL" />
                        <!-- 原本的代码 -->
                        </div>
                        <div class="bottom-btn">
                          <div
                            class="look-detail"
                            @click="goDetail(line, 'itemHeadData')">
                            {{
                              $T(
                                "ssrc.bidHall.view.message.button.viewDetail"
                              ).$D("查看详情")
                            }}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      v-if="item.checkData && !item.checkData.length"
                      class="no-data">
                      {{
                        $T("hipspfm.common.view.message.title.noData").$D(
                          "暂无数据"
                        )
                      }}
                    </div>
                  </div>
                </srm-collapse-item>
              </srm-collapse>
            </div>
          </div>
        </srm-scroll-tab-item>
        <!-- 供应商列表 -->
        <srm-scroll-tab-item :label="$T('ssrc.inquiryHall.view.tab.supplierList').$D('供应商列表')" prop-key="supplierList">
          <div class="content-item" >
            <div v-for="(item, index) in supplierData" :key="index" style="padding:15px 0">
              <srm-collapse :max-open="1">
                <srm-collapse-item
                  v-model="item.isShow"
                  :name="item.rfxLineSupplierId"
                  :disabled="Boolean(item.invalidFlag)">
                  <div class="title" @click.stop>
                    <customize :columns="getSupplierTitleColumns" :data-source="item" />
                  </div>
                  <div slot="content" class="content-body">
                    <div class="list">
                      <div
                        v-for="(line, indexCheckData) in item.checkData"
                        :key="indexCheckData"
                        class="list-item">
                        <div class="list-content">
                          <!-- 个性化组件替换后的代码 -->
                          <customize :columns="getColumns('supplierList')" :data-source="line" code="SMBL.INQUIRY_HALL.LIST.TAB_ITEM_DTL" />
                        </div>
                        <div class="bottom-btn">
                          <div
                            class="look-detail"
                            @click="goDetail(line, 'supplierData')">
                            {{
                              $T(
                                "ssrc.bidHall.view.message.button.viewDetail"
                              ).$D("查看详情")
                            }}
                          </div>
                        </div>
                      </div>
                      <div
                        v-if="item.checkData && !item.checkData.length"
                        class="no-data">
                        {{
                          $T("hipspfm.common.view.message.title.noData").$D(
                            "暂无数据"
                          )
                        }}
                      </div>
                    </div>
                  </div>
                </srm-collapse-item>
              </srm-collapse>
            </div>
          </div>
        </srm-scroll-tab-item>
        <!-- 全部报价明细 -->
        <srm-scroll-tab-item v-if="onlyAllowAllWinBids===0" :label="$T('ssrc.inquiryHall.view.tab.allQuotationDetails').$D('全部报价明细')" prop-key="allQuotationDetails">
          <div class="content-item" >
            <!-- 头部筛选 -->
            <div class="filter-wrap">
              <div class="filter-body">
                <div :class="[switchFilterIndex===0 ? 'filter-item active': 'filter-item' ]" @click="switchFilter(0)">{{ $T('ssrc.inquiryHall.model.inquiryHall.chooseUse').$D('自行选用') }}</div>
                <div :class="[switchFilterIndex===1 ? 'filter-item active': 'filter-item' ]" @click="switchFilter(1)">{{ $T('ssrc.inquiryHall.model.inquiryHall.complete').$D('全部选用') }}</div>
                <div :class="[switchFilterIndex===2 ? 'filter-item active': 'filter-item' ]" @click="switchFilter(2)">{{ $T('ssrc.inquiryHall.model.inquiryHall.lowest').$D('最低价策略') }}</div>
              </div>
            </div>
            <div
              v-for="(line, index) in allCheckData"
              :key="index"
              class="content-body">
              <div class="list">
                <div class="list-item">
                  <div class="list-content">
                    <!-- 个性化组件替换后的代码 -->
                    <customize :columns="getColumns('allQuotationDetails')" :data-source="line" code="SMBL.INQUIRY_HALL.LIST.TAB_ITEM_DTL" />
                  </div>
                  <div class="bottom-btn">
                    <div
                      class="look-detail"
                      @click="goDetail(line, 'allCheckData')">
                      {{
                        $T("ssrc.bidHall.view.message.button.viewDetail").$D(
                          "查看详情"
                        )
                      }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </srm-scroll-tab-item>
        <!-- 附件列表 -->
        <srm-scroll-tab-item v-if="fileTemplateManageFlag" :show-title="false" :label="$T('ssrc.inquiryHall.view.message.tab.attachmentList').$D('附件列表')" prop-key="attachmentList">
          <file-temp-attachment ref="fileTempAttachmentRef" :head-info="headInfo" :editor-flag="true" unit-code-symbol="fileTempAttach-update"/>
        </srm-scroll-tab-item>
      </srm-scroll-tab>
    </div>

    <!-- 底部按钮 -->
    <bottom-handler :btn-arr="getBtnArr" />

    <!-- 头信息弹窗 -->
    <rfx-price-result :visible="headInfoFlag" :item-data="headInfo" @changeVisible="changeVisible" />

    <!-- 行信息弹窗 -->
    <rfx-price-line-info
      :visible="lineInfoFlag"
      :item-data="lineDetailData"
      :double-unit-flag="doubleUnitFlag"
      :price-type-code="headInfo.priceTypeCode"
      @changeVisible="changeVisible"
      @submit="saveHandler"
      @showPriceDetail="showPriceDetail"
      @showLadderPriceDetail="showLadderPriceDetail"/>

    <!-- 阶梯报价弹窗 -->
    <new-ladder-quotation-detail v-if="ladderInfoFlag" :visible="ladderInfoFlag" :query-params="ladderQueryParams" :double-unit-flag="doubleUnitFlag" :price-type-code="headInfo.priceTypeCode" @changePopVisible="changePopVisible" />

    <!-- 报价明细弹窗 -->
    <!-- <NewQuotationDetail v-model="detailInfoFlag" :queryParams="queryParams" /> -->

    <!-- 报价明细弹窗 -->
    <quote-details-pop v-if="detailInfoFlag" :visible="detailInfoFlag" :materiel-info="queryParams" :rfx-header-id="String(rfxHeaderId)" current-page-type="CHECK_PRICE" @changePopVisible="changePopVisible"/>

    <!-- 历史记录弹窗 -->
    <history-record v-model="historyFlag" :action-data="actionData" />

    <!-- 退回至评审表单弹窗 -->
    <back-form-pop :visible="backFormPopFlag" @submit="backToReviewHandler" @changeVisible="changeVisible" />

    <!-- 附件弹窗 -->
    <attached-file
      v-model="filePopup"
      :title="$T('hipspfm.common.message.title.viewAttachment').$D('附件查看')"
      :query-params="queryFileParams"
      :attachment-uuid="attachmentUuid"/>

    <!-- 附件弹窗 -->
    <attached-files
      v-model="headFilePopup"
      :title="$T('hipspfm.common.message.title.viewAttachment').$D('附件查看')"
      :file-arr="headFileArr"
      :query-params="queryFileParams"/>
  </div>
</template>

<script>
import {
  getBatchApi,
  getRfxHeaderApi,
  saveCheckDataApi,
  getItemDataApi,
  getCheckDataApi,
  getActionDataApi,
  inquiryAgainApi,
  // eslint-disable-next-line no-unused-vars
  submitValidateApi,
  getSupplierDataApi,
  submitCheckDataApi,
  supplierAllSuggestApi,
  beginRoundQuotationApi,
  submitReturnToPretrialApi,
} from "../api/RfxPrice";
import uuid from "uuid";
import { DataSet, $T } from "srm-mobile-ui";
import { isEmpty } from "@/utils";
import HistoryRecord from "@/components/HistoryRecord";
import BottomHandler from "@/components/V5/BottomHandler";
import AttachedFile from "@/components/File/AttachedFile";
import AttachedFiles from "@/components/File/AttachedFiles";
import NavHead from "@/components/NavHead";
import ButtonSwitch from "@/components/V5/ButtonSwitch";
import FileTempAttachment from "@/components/FileTempAttachment";
import { queryBidFileTemplateConfig, getCustomizeUnitCode } from "@/components/FileTempAttachment/utils";
import { queryDoubleUnit, calculateBasicQty } from "@/utils/utils";
import { getAllottedQuantity, getNetPriceName, getPriceName } from "@/utils/doubleUnit";
import BackFormPop from "../components/rfxPricePop/BackFormPop";
import RfxPriceLineInfo from "../components/rfxPricePop/RfxPriceLineInfo";
import NewQuotationDetail from "../components/rfxPricePop/NewQuotationDetail";
// eslint-disable-next-line rulesdir/check_modules
import QuoteDetailsPop from "../components/rfxPricePop/QuoteDetailsPop";
import NewLadderQuotationDetail from "../components/rfxPricePop/NewLadderQuotationDetail";
import { SrmListHeader } from "srm-mobile-ui";
import RfxPriceResult from "../components/rfxPricePop/RfxPriceResult";

import { getAllTabTableCommonColumnsCUX } from "@/modules/RfxHall/components/cux/pricingAndCompleteCuxs.js";

export default {
  modules: [ "hipspfm.common", "ssrc.inquiryHall", "hzero.common", "ssrc.bidHall", "hipspfm.supplierQuotation", "ssrc.common", "hipspfm.workFlow", "ssrc.queryRfq", "ssrc.priceLibrary", "smbl.common", "sscux.ssrc", ],
  name: "RfxPriceDetail",
  components: {
    NavHead,
    RfxPriceLineInfo,
    BottomHandler,
    AttachedFile,
    AttachedFiles,
    RfxPriceResult,
    // eslint-disable-next-line vue/no-unused-components
    ButtonSwitch,
    HistoryRecord,
    BackFormPop,
    QuoteDetailsPop,
    // eslint-disable-next-line vue/no-unused-components
    NewQuotationDetail,
    NewLadderQuotationDetail,
    FileTempAttachment,
  },
  beforeRouteLeave(to, from, next) {
    if ((this.lineInfoFlag || this.headInfoFlag) && to.name === "RfxHallList") {
      if (this.ladderInfoFlag) {
        this.ladderInfoFlag = false;
      } else if (this.detailInfoFlag) {
        this.detailInfoFlag = false;
      } else if (this.lineInfoFlag) {
        this.lineInfoFlag = false;
      } else {
        this.headInfoFlag = false;
      }
      next(false);
    } else {
      next();
    }
  },
  data() {
    return {
      filePopup: false,
      headFilePopup: false, //头附件弹窗
      attachmentUuid: [],
      headInfo: {},
      activeName: [],
      actionData: [],
      rfxHeaderId: "",
      switchFilterIndex: 0,
      switchFilterFlag: true, //全部物料筛选，true为全部/false为最低策略
      backFormPopFlag: false, //退回至评审表单弹窗
      headInfoFlag: false,
      lineInfoFlag: false,
      itemHeadData: [], //物料头信息
      supplierData: [], //供应商信息
      allCheckData: [], //全部物料明细
      lineDetailData: {}, //行详细信息
      historyFlag: false,
      ladderInfoFlag: false,
      detailInfoFlag: false,
      ladderQueryParams: {},
      queryParams: {},
      headFileArr: [], //头附件信息
      queryFileParams: {
        //附件查询参数
        tenantId: localStorage.getItem("tenantId"),
      },
      propKey: "itemLine",
      finishLoad: false,
      onlyAllowAllWinBids: 0, //模板配置允许整单中标
      doubleUnitFlag: false, // 判断是否开启双单位
      fileTemplateManageFlag: false, // 是否开启招标文件模板管理
    };
  },
  computed: {
    // 详情头
    getHeadColumn() {
      return [
        {
          fieldType: "TEXT", // 默认TEXT,可选 TEXT/TAG
          fieldCode: "rfxTitle",
        },
        {
          fieldCode: "rfxNum",
        },
        {
          fieldName:$T("ssrc.inquiryHall.bargain.roundNumber").$D("轮次"),
          fieldCode: "quotationRoundNumber",
        }
      ];
    },
    getMaterialTitleColumns() {
      const columns = [
        {
          fieldCode: "itemName",
          fieldType:"EMPTY",
          formRow:0,
          render:(val) => <SrmListHeader showOpenTag={false}>
            {val}
          </SrmListHeader>
        },
        {
          fieldCode: "tips",
          fieldType:"EMPTY",
          render:(val, record) => <div class="tips-wrap">
            <span class="tips-count tips">{this.$T("ssrc.inquiryHall.model.inqueryHall.quantity").$D("数量")
            }:{this.doubleUnitFlag ? record.secondaryQuantity : record.rfxQuantity}</span>
            {
              !record.taxRate &&
                      <span class="tips-tax tips">{
                        this.$T("ssrc.inquiryHall.model.inquiryHall.noTaxRate").$D(
                          "不含税"
                        )
                      }</span>
            }
            <span class="tips-rounds tips">{
              this.$T(
                "ssrc.inquiryHall.model.inquiryHall.lineNumber"
              ).$D("行号")
            }：{ record.rfxLineItemNum }</span>
          </div>
        },
        {
          fieldCode: "btn",
          fieldType:"EMPTY",
          render:(val, record) => <div class="btn-wrap">
            <div
              class="file-btn btn"
              onClick={() => this.showFilePop(record.attachmentUuid)}>
              <img
                src={require("@/assets/4.0/icon_Button_paperclip_highlight@3x.png")}
                alt=""/>
              {
                this.$T(
                  "ssrc.inquiryHall.view.message.title.attachment"
                ).$D("附件")
              }
            </div>
            <srm-dropdown
              value={record.selectionStrategy}
              text={record.selectionStrategy}
              type="tooltip"
              class="dropdown-action"
              onSelect={(value) => this.dropDownChange(value, record)}>
              <srm-flex direction="column">
                <srm-dropdown-item
                  value="RECOMMENDATION"
                  text={this.$T("ssrc.inquiryHall.dropdown.recommendation").$D("推荐供应商")}/>
                <srm-dropdown-item
                  value="RELEASE" text={this.$T("ssrc.inquiryHall.dropdown.release").$D("取消询价")}/>
                <srm-dropdown-item
                  value="CANCEL" text={this.$T("ssrc.inquiryHall.dropdown.cancel").$D("完成询价")}/>
              </srm-flex>
            </srm-dropdown>
          </div>
        },
      ];
      return columns;
    },
    getSupplierTitleColumns() {
      const columns = [
        {
          fieldCode: "supplierCompanyName",
          fieldType:"EMPTY",
          formRow:0,
          render:(val, record) => <SrmListHeader showOpenTag={false}>
            {val}（{
              record.supplierCompanyNum
            }）
          </SrmListHeader>
        },
        {
          fieldCode: "tips",
          fieldType:"EMPTY",
          render:(val, record) => <div class="tips-wrap">
            <span class="tips-applove tips">{
              record.invalidFlag ? this.$T("ssrc.inquiryHall.model.inquiryHall.invalid").$D("无效") : record.feedbackStatusMeaning
            }</span>
            <span class="tips-price-count tips">{
              this.$T(
                "ssrc.inquiryHall.model.inquiryHall.supplierTotalPrice"
              ).$D("报价总价")
            }：{ record.supplierTotalAmount}</span>
            <span class="tips-price-hang tips">{
              this.$T("ssrc.inquiryHall.model.inquiryHall.selectedNumber").$D("选用行数")
            }：{record.quotationNumber}</span>
          </div>
        },
        {
          fieldCode: "btn",
          fieldType:"EMPTY",
          render:(val, record) => <div class="btn-wrap">
            <div
              class="file-btn btn"
              onClick={() => this.showFilePop(record.attachmentUuid)}>
              <img
                src={require("@/assets/4.0/icon_Button_paperclip_highlight@3x.png")} />
              {
                this.$T(
                  "ssrc.inquiryHall.view.message.title.attachment"
                ).$D("附件")
              }
            </div>
            <ButtonSwitch
              value={record.wholeSuggestFlag}
              record={record}
              btn-arr={[
                this.$T("ssrc.inquiryHall.model.inquiryHall.recommend").$D(
                  "推荐"
                ),
                this.$T("ssrc.inquiryHall.model.inquiryHall.noRecommend").$D("不推荐"),
              ]}
              disabled={Boolean(record.invalidFlag)}
              onChange={this.allSuggest}/>
          </div>
        },
      ];
      return columns;
    },
    getBtnArr() {
      const {
        roundQuotationRule,
        roundHeaderStatus,
        rfxStatus,
        pretrialFlag,
        bargainClosedFlag,
      } = this.headInfo;
      const arr = [
        {
          title: this.$T("ssrc.inquiryHall.model.inquiryHall.save").$D("保存"),
          color: "#276EF1",
          background: "#EFF3FE",
          disabled: false,
          handler: () => {
            this.saveHandler("save");
          },
        },
        {
          title: this.$T("hzero.common.button.submit").$D("提交"),
          color:rfxStatus === "ROUND_QUOTATION" ? "#aaa" : "#276EF1",
          background: "#EFF3FE",
          disabled: rfxStatus === "ROUND_QUOTATION",
          handler: () => {
            this.saveHandler("submit");
          },
        },
        {
          title: this.$T(
            "ssrc.inquiryHall.view.message.button.inquiryAgain"
          ).$D("再次询价"),
          color: "var(--color-font-default-d)",
          background: "var(--color-other-default-b)",
          disabled: false,
          handler: () => {
            this.againEnquiry();
          },
        },
        pretrialFlag && {
          title: this.$T(
            "ssrc.inquiryHall.view.message.title.returnToPretrial"
          ).$D("退回至初审"),
          color: "var(--color-font-default-d)",
          background: "var(--color-other-default-b)",
          handler: () => {
            this.backToReview();
          },
        },
      ].filter(Boolean);
      if ([ "CHECK", "AUTO_CHECK" ].includes(roundQuotationRule)) {
        arr.push({
          title: this.$T(
            "ssrc.inquiryHall.view.message.button.roundQuotation"
          ).$D("发起多轮报价"),
          color: "var(--color-font-default-d)",
          background: "var(--color-other-default-b)",
          disabled: roundHeaderStatus === "CLOSED" || bargainClosedFlag === 0,
          handler: () => {
            this.goMultiRoundQuotation();
          },
        });
      }
      return arr;
    },
  },
  async mounted() {
    const { rfxHeaderId } = this.$route.query;
    this.rfxHeaderId = rfxHeaderId;
    try {
      this.$loading.show();
      this.doubleUnitFlag = await queryDoubleUnit({
        businessModule: "RFX",
      });
      this.fetchBidFileTemplateConfig();
      await this.getHeadInfo();
      await this.getActionInfo();
      await this.getSupplierData();
      await this.getItemData();
      await this.getAllCheckData();
      this.finishLoad = true;
      this.$loading.hide();
    } catch (err) {
      this.finishLoad = true;
      this.$loading.hide();
      console.log(err, "error");
    }
  },
  methods: {
    // 查询招标文件模板是否启用
    async fetchBidFileTemplateConfig() {
      const flag = await queryBidFileTemplateConfig();
      this.fileTemplateManageFlag = flag;
    },
    getColumns(type) {
      const columns = [
        {
          fieldCode:"title",
          fieldType:"EMPTY",
          formRow:0,
          render:(val, record) => <SrmListHeader showOpenTag={false}>
            <div class="list-txt noWrap">
              {
                this.$T("ssrc.inquiryHall.model.inquiryHall.itemMean").$D(
                  "物料名称"
                )
              }｜{
                this.$T("ssrc.inquiryHall.model.inquiryHall.itemCode").$D(
                  "物料编码"
                )
              }：{record.itemName}｜{record.itemCode}
            </div>
            <div slot="right">
              <ButtonSwitch
                value={record.suggestedFlag}
                btn-arr={[
                  this.$T("ssrc.inquiryHall.model.inquiryHall.suggestedFlag").$D(
                    "选用"
                  ),
                  this.$T("ssrc.inquiryHall.model.inquiryHall.suggestedNoFlag").$D("不选用"),
                ]}
                onChange={($event) => this.buttonswitchChange($event, record)}/>
            </div>
          </SrmListHeader>
        },
        this.doubleUnitFlag ? this.headInfo.priceTypeCode === "NET_PRICE" ? {
          fieldName: $T("ssrc.common.model.common.netPrice").$D("单价(不含税)"),
          fieldCode: "validNetSecondaryPrice",
        } : {
          fieldName: $T("ssrc.common.model.common.taxPrice").$D("单价(含税)"),
          fieldCode: "validQuotationSecPrice",
        } : null,
        this.headInfo.priceTypeCode === "NET_PRICE" ? {
          fieldName: getNetPriceName(this.doubleUnitFlag),
          fieldCode: "validNetPrice",
        } : {
          fieldName: getPriceName(this.doubleUnitFlag),
          fieldCode: "validQuotationPrice",
        },
        {
          fieldName:$T("ssrc.inquiryHall.model.inquiryHall.taxInclude").$D("是否含税"),
          fieldCode: "taxIncludedFlag",
          render: (val) => val ? this.$T("hipspfm.common.status.yes").$D("是") : this.$T("hipspfm.common.status.no").$D("否"),
        },
        {
          fieldName:$T("ssrc.common.taxRate").$D("税率"),
          fieldCode: "taxRate",
        },
        this.doubleUnitFlag ? {
          fieldName:$T("ssrc.inquiryHall.model.checkPrice.allottedQuantity").$D("分配数量"),
          fieldCode: "allottedSecondaryQuantity",
          fieldType: "INPUT_NUMBER",
          required: (val, record) => record.suggestedFlag,
          editor: (val, record) => record.suggestedFlag, //控制是否可编辑
          editLimit: (val, record) => record.suggestedFlag,
          precision: (val, record) => Number(record.uomPrecision),
          inputChange: (val, record) => {
            if (type === "itemLine" && this.propKey !== "itemLine") {
              this.changeTab(0);
            } else if (type === "supplierList" && this.propKey !== "supplierList") {
              this.changeTab(1);
            } else if (type === "allQuotationDetails" && this.propKey !== "allDetail") {
              this.changeTab(2);
            }
            if (this.doubleUnitFlag && record.itemId) {
              calculateBasicQty({
                secondaryQuantity: val,
                itemId: record.itemId,
                businessKey: record.quotationLineId || record.id,
                doublePrimaryUomId: record.uomId,
                secondaryUomId: record.secondaryUomId,
              }).then((res) => {
                record.allottedQuantity = res;
              });
            } else {
              record.allottedQuantity = val;
            }
          },
        } : null,
        {
          fieldName: getAllottedQuantity(this.doubleUnitFlag),
          fieldCode: "allottedQuantity",
          fieldType: "INPUT_NUMBER",
          required: (val, record) => this.doubleUnitFlag ? false : record.suggestedFlag,
          editor: (val, record) => this.doubleUnitFlag ? false : record.suggestedFlag, //控制是否可编辑
          disabled: Boolean(this.doubleUnitFlag),
          editLimit: (val, record) => record.suggestedFlag,
          precision: (val, record) => Number(record.uomPrecision),
          inputChange: () => {
            if (type === "itemLine" && this.propKey !== "itemLine") {
              this.changeTab(0);
            } else if (type === "supplierList" && this.propKey !== "supplierList") {
              this.changeTab(1);
            } else if (type === "allQuotationDetails" && this.propKey !== "allDetail") {
              this.changeTab(2);
            }
          },
        },
        {
          fieldName:$T("ssrc.inquiryHall.model.inquiryHall.priceQuantity").$D("价格批量"),
          fieldCode: "priceBatchQuantity",
          fieldType: "INPUT_NUMBER",
          required: (val, record) => record.suggestedFlag,
          editor: (val, record) => record.suggestedFlag, //控制是否可编辑
          editLimit: (val, record) => record.suggestedFlag,
          precision: (val, record) => Number(record.uomPrecision),
          inputChange: () => {
            if (type === "itemLine" && this.propKey !== "itemLine") {
              this.changeTab(0);
            } else if (type === "supplierList" && this.propKey !== "supplierList") {
              this.changeTab(1);
            } else if (type === "allQuotationDetails" && this.propKey !== "allDetail") {
              this.changeTab(2);
            }
          },
        },
        {
          fieldName:$T("ssrc.inquiryHall.model.checkPrice.suggestedRemark").$D("选用理由"),
          fieldType: "INPUT",
          required:(val, record) => record.suggestedFlag,
          disabled: (val, record) => !record.suggestedFlag,
          fieldCode: "suggestedRemark",
          inputChange: () => {
            if (type === "itemLine" && this.propKey !== "itemLine") {
              this.changeTab(0);
            } else if (type === "supplierList" && this.propKey !== "supplierList") {
              this.changeTab(1);
            } else if (type === "allQuotationDetails" && this.propKey !== "allDetail") {
              this.changeTab(2);
            }
          },
        },
        {
          fieldName:$T("ssrc.inquiryHall.model.inquiryHall.quotationDescription").$D("报价说明"),
          fieldCode: "validQuotationRemark",
        },
        ...getAllTabTableCommonColumnsCUX({ type, editor: true, }), // cux
      ];
      return columns;
    },
    changeTab(index) {
      if (index === 0) {
        this.propKey = "itemLine";
      } else if (index === 1) {
        this.propKey = "supplierList";
      } else {
        this.propKey = "allDetail";
      }
    },
    // 下拉框回调
    dropDownChange(value, otherParams) {
      if (value !== "RECOMMENDATION") {
        otherParams.checkData && otherParams.checkData.forEach((item) => {
          item.suggestedFlag = 0;
        });
      }
      otherParams.selectionStrategy = value;
    },
    // switchButton改变回调
    buttonswitchChange(e, record) {
      if (e.value) {
        record.allottedQuantity = record.rfxQuantity;
      } else {
        record.allottedQuantity = "";
        record.suggestedRemark = "";
      }
    },
    // 打开报价详情页面
    showPriceDetail({ detailInfoFlag, queryParams }) {
      queryParams.rfxTitle = this.headInfo.rfxTitle;
      this.queryParams = queryParams;
      this.detailInfoFlag = detailInfoFlag;
    },
    // 打开阶梯报价
    showLadderPriceDetail({ ladderInfoFlag, ladderQueryParams }) {
      // console.log("ladderInfoFlag", ladderInfoFlag);
      this.ladderInfoFlag = ladderInfoFlag;
      this.ladderQueryParams = ladderQueryParams;
    },
    // 全部物料筛选
    switchFilter(index) {
      // console.log(index, 333);
      this.switchFilterIndex = index;
      if (index === 1 || index === 2) {
        const selectStrategy = this.switchFilterIndex === 1 ? "ALL" : "MINIMUM";
        this.batch(selectStrategy);
      }
    },
    // 全部筛选
    batch(selectStrategy) {
      const params = {
        selectStrategy,
        rfxHeaderId: this.rfxHeaderId,
        rfxQuotationLineList: this.allCheckData,
      };
      this.$loading.show();
      // eslint-disable-next-line no-unused-vars
      getBatchApi(params).then((res) => {
        this.$loading.hide();
        this.getHeadInfo();
        this.getItemData();
        this.getSupplierData();
        this.getAllCheckData();
        this.refreshAttachmentListTable();
      });
    },
    // 获取头信息
    getHeadInfo() {
      const rfxHeaderId = this.rfxHeaderId;
      const params = {
        customizeUnitCode:
          "SSRC.INQUIRY_HALL_CHECK_PRICE.HEADER_INFO,SSRC.INQUIRY_HALL_CHECK_PRICE.QUOTATION_BATCH_MAINTAIN_FROM,SMBL.INQUIRY_HALL.LIST.RFXPRICE_RFXPRICE_HEADER_DETAIL",
      };
      getRfxHeaderApi(params, rfxHeaderId).then((res) => {
        this.headInfo = res;
        const { onlyAllowAllWinBids = 0 } = res;
        this.onlyAllowAllWinBids = onlyAllowAllWinBids;
        if (onlyAllowAllWinBids === 1) {
          this.propKey = "supplierList";
        }
        this.headFileArr = [
          {
            readOnly: true,
            title: this.$T("ssrc.bidHall.model.bidHall.businessAttachments").$D(
              "商务附件"
            ),
            attachmentUuid: res.businessAttachmentUuid || uuid(),
          },
          {
            readOnly: true,
            title: this.$T("ssrc.bidHall.model.bidHall.techAttachments").$D(
              "技术附件"
            ),
            attachmentUuid: res.techAttachmentUuid || uuid(),
          },
        ];
      });
    },
    // 获取操作记录数据
    getActionInfo() {
      const rfxHeaderId = this.rfxHeaderId;
      getActionDataApi(rfxHeaderId).then(({ content = [] }) => {
        this.actionData = content;
      });
    },
    // 获取物料头数据
    getItemData() {
      const params = {
        page: 0,
        size: 10,
        rfxHeaderId: this.rfxHeaderId,
        customizeUnitCode: "SSRC.INQUIRY_HALL_CHECK_PRICE.TAB_ITEM_DTL",
        sourceMobileEndFlag: 1,
      };
      getItemDataApi(params).then(({ content = [] }) => {
        // eslint-disable-next-line no-unused-vars
        for (let item of content) {
          item.isShow = false;
        }
        this.itemHeadData = content;
        this.getItemCheckData();
      });
    },
    // 获取供应商数据
    getSupplierData() {
      const rfxHeaderId = this.rfxHeaderId;
      getSupplierDataApi(rfxHeaderId).then(({ content = [] }) => {
        this.supplierData = content;
        this.getSupplierCheckData();
      });
    },
    // 获取物料明细数据
    getCheckData(otherParams = {}) {
      const { rfxHeaderId } = this;
      return new Promise((resolve) => {
        const params = {
          page: 0,
          size: 10,
          rfxHeaderId,
          customizeUnitCode: "SSRC.INQUIRY_HALL_CHECK_PRICE.TAB_ITEM_DTL",
          sourceMobileEndFlag: 1,
          ...otherParams,
        };
        getCheckDataApi(params).then(({ content = [] }) => {
          const newData = content.map((item) => ({
            ...item,
            suggestedRemark: item.suggestedFlag ? item.suggestedRemark || "" : "",
            allottedQuantity: item.suggestedFlag ? item.allottedQuantity || item.rfxQuantity : "",
          }));
          resolve(newData);
        });
      });
    },
    // 获取物料明细数据
    getItemCheckData() {
      const { itemHeadData } = this;
      itemHeadData.forEach(async (item, index) => {
        const newData = await this.getCheckData({
          rfxLineItemId: item.rfxLineItemId,
          sourceMobileEndFlag: 1,
        });
        const temp = { ...item, checkData: newData };
        this.$set(this.itemHeadData, index, temp);
      });
    },
    // 获取供应商物料明细数据
    getSupplierCheckData() {
      const { supplierData } = this;
      supplierData.forEach(async (item, index) => {
        const newData = await this.getCheckData({
          rfxLineSupplierId: item.rfxLineSupplierId,
          customizeUnitCode: "SSRC.INQUIRY_HALL_CHECK_PRICE.TAB_SUPPLIER",
          sourceMobileEndFlag: 1,
        });
        const temp = {
          ...item,
          checkData: newData,
        };
        this.$set(this.supplierData, index, temp);
      });
    },
    // 获取全部物料明细数据
    getAllCheckData() {
      const params = {
        page: 0,
        size: 10,
        rfxHeaderId: this.rfxHeaderId,
        customizeUnitCode:
          "SSRC.INQUIRY_HALL_CHECK_PRICE.TAB_ALL_QUOTATION_DETAIL",
        sourceMobileEndFlag: 1,
      };
      getCheckDataApi(params).then(({ content = [] }) => {
        this.allCheckData = content;
      });
    },
    // 发起多轮报价
    goMultiRoundQuotation() {
      const { roundHeaderStatus } = this.headInfo;

      if (roundHeaderStatus === "ROUND_CHECK") {
        // eslint-disable-next-line rulesdir/no_hips
        this.$hips.dialog.confirm({
          title: "",
          content: this.$T("ssrc.inquiryHall.view.message.button.isRoundQuotation").$D("是否开启多轮报价"),
          okText: this.$T("hipspfm.common.button.ok").$D("确定"),
          cancelText: this.$T("hipspfm.common.button.cancle").$D("取消"),
          onOk: () => {
            this.$loading.show();
            const rfxHeaderId = this.rfxHeaderId;
            // eslint-disable-next-line no-unused-vars
            beginRoundQuotationApi(rfxHeaderId).then((res) => {
              this.$loading.hide();
              this.$router.push({ name: "MultiRoundQuotation", query:{ headerId:rfxHeaderId } });
            });
          },
        });
      } else if (roundHeaderStatus === "ROUND_CHECKING") {
        this.$loading.show();
        const rfxHeaderId = this.rfxHeaderId;
        beginRoundQuotationApi(rfxHeaderId).then(() => {
          this.$loading.hide();
          this.$router.push({ name: "MultiRoundQuotation", query: { headerId: rfxHeaderId } });
        });
      }
    },
    // 再次询价
    againEnquiry() {
      // eslint-disable-next-line rulesdir/no_hips
      this.$hips.dialog.confirm({
        title: "",
        content: this.$T(
          "ssrc.inquiryHall.view.message.confirm.inquiryAgain"
        ).$D("确认是否再次询价"),
        asyncClose: false,
        closable: false,
        okText: this.$T("hipspfm.common.button.ok").$D("确定"),
        cancelText: this.$T("hipspfm.common.button.cancle").$D("取消"),
        onOk: async () => {
          const rfxHeaderId = this.rfxHeaderId;
          // eslint-disable-next-line no-unused-vars
          const res = await inquiryAgainApi(rfxHeaderId);
          const { rfxTitle, rfxNum } = this.headInfo;
          // eslint-disable-next-line rulesdir/no_hips
          this.$hips.dialog.close();
          // eslint-disable-next-line rulesdir/no_hips
          this.$hips.dialog.confirm({
            title: "",
            content: `${this.$T("ssrc.inquiryHall.view.message.confirm.RFQ").$D(
              "询价单"
            )}【${rfxNum}-${rfxTitle}】${this.$T(
              "ssrc.inquiryHall.view.message.confirm.WaitingMaintenance"
            ).$D("状态已变为再次询价，请等待创建人维护并发布询价单")}`,
            asyncClose: true,
            closable: false,
            okText: this.$T("hipspfm.common.button.ok").$D("确定"),
            cancelText: this.$T("hipspfm.common.button.cancle").$D("取消"),
            onOk: () => {
              // eslint-disable-next-line rulesdir/no_hips
              this.$hips.dialog.close();
              this.$router.back();
            },
          });
        },
      });
    },
    // 2020120500021
    // 退回评审
    backToReview() {
      this.backFormPopFlag = true;
    },
    backToReviewHandler(reason) {
      const rfxHeaderId = this.rfxHeaderId;
      const { objectVersionNumber } = this.headInfo;
      const params = {
        rfxHeaderId,
        objectVersionNumber,
        backPretrialRemark: reason,
        organizationId: localStorage.getItem("organizationId"),
      };
      this.$loading.show();
      submitReturnToPretrialApi(params).then(() => {
        this.$loading.hide();
        this.goBack();
      });
    },
    // 显示操作记录
    showOperationPop() {
      this.historyFlag = true;
    },
    // 查看头附件
    showHeadFilePop() {
      this.headFilePopup = !this.headFilePopup;
    },
    // 查看附件
    showFilePop(attachmentUuid) {
      this.attachmentUuid = attachmentUuid || uuid();
      this.filePopup = !this.filePopup;
    },
    // 跳转详情页
    goDetail(line) {
      this.lineInfoFlag = !this.lineInfoFlag;
      // console.log(this.lineInfoFlag);
      this.lineDetailData = line;
      // this.lineDetailData = { ...line, formType: type };
      // this.$router.push({ name: 'RfxPriceLineInfo', query: { itemData: JSON.stringify(line)} });
    },
    // 跳转头信息详情页
    goHeadInfoDetail() {
      this.headInfoFlag = true;
      // this.$router.push({ name: 'RfxPriceResult' });
    },
    // 供应商整包推荐
    allSuggest(item) {
      const { value, record } = item;
      const {
        rfxHeaderId,
        rfxLineItemId,
        supplierTenantId,
        quotationHeaderId,
        rfxLineSupplierId,
        objectVersionNumber,
      } = record;
      const params = {
        rfxHeaderId,
        rfxLineItemId,
        rfxLineSupplierId,
        supplierTenantId,
        quotationHeaderId,
        objectVersionNumber,
        allSelectFlag: Number(value),
      };
      this.$loading.show();
      supplierAllSuggestApi(params).then(() => {
        this.$loading.hide();
        this.getSupplierData();
      });
    },
    // 保存
    async saveHandler(type = "save") {
      const {
        propKey,
        rfxHeaderId,
        itemHeadData,
        supplierData,
        allCheckData,
      } = this;
      const {
        totalCost,
        costRemark,
        totalPrice,
        checkRemark,
        overCostFlag,
        overCostPrice,
        overCostScale,
        objectVersionNumber,
        checkAttachmentUuid,
      } = this.headInfo;

      let checkPriceDTOLineList = [];
      if (propKey === "itemLine") {
        // 物料明细保存
        checkPriceDTOLineList = itemHeadData.map((item) => ({
          type: "ITEM",
          rfxLineItemId: item.rfxLineItemId,
          objectVersionNumber: item.objectVersionNumber,
          selectionStrategy: item.selectionStrategy,
          quotationLineList: item.checkData,
        }));
      } else if (propKey === "supplierList") {
        // 供应商明细保存
        checkPriceDTOLineList = supplierData.map((item) => ({
          type: "SUPPLIER",
          supplierTenantId: item.supplierTenantId,
          wholeSuggestFlag: item.wholeSuggestFlag,
          supplierName: item.supplierCompanyName,
          rfxLineSupplierId: item.rfxLineSupplierId,
          quotationHeaderId: item.quotationHeaderId,
          quotationLineList: item.checkData,
        }));
      } else {
        // 全部明细保存
        checkPriceDTOLineList = [
          {
            type: "DETAIL",
            quotationLineList: allCheckData,
          },
        ];
      }
      // 附件列表数据
      const attachmentLineList = this.getAttachmentListTableData() || [];

      const params = {
        ...this.headInfo,
        totalCost,
        totalPrice,
        costRemark,
        checkRemark,
        rfxHeaderId,
        overCostFlag,
        overCostScale,
        overCostPrice,
        checkAttachmentUuid,
        objectVersionNumber,
        checkPriceDTOLineList,
        attachmentLineList,
        customizeUnitCode: getCustomizeUnitCode({ type: "fileTempAttach-update", bidFlag: false }),
      };
      // 校验数据非空
      if (type !== "save" && this.verify(checkPriceDTOLineList)) {
        return;
      }
      if (!await this.validateAttachmentListTableDS(type)) {
        return;
      }
      // 校验数据非空
      // eslint-disable-next-line no-unused-vars
      // 校验数据分配数量是否超出
      if (type === "save") {
        this.$loading.show();
        saveCheckDataApi(params).then(() => {
          this.$loading.hide();
          this.getHeadInfo();
          this.getItemData();
          this.getSupplierData();
          this.getAllCheckData();
          this.refreshAttachmentListTable();
          this.activeName = [];
          this.$notification.open({
            key,
            message: this.$T("hzero.common.notification.success.save").$D(
              "保存成功"
            ),
            class: "notification",
          });
        }).catch((err) => {
          console.log(err, 3333333);
        });
      } else {
        this.handleSubmit(params);
      }
    },
    // 保存前非空校验
    verify(data, type = 1) {
      // const _this = this;
      const flag = data.some((value) => {
        const { quotationLineList } = value;
        // eslint-disable-next-line no-unused-vars
        return quotationLineList.some((item, key) => {
          if (type === 1 && item.suggestedFlag) {
            if (!item.allottedQuantity) {
              this.alertValidate(this.$T("ssrc.inquiryHall.model.checkPrice.allottedQuantity").$D("分配数量"));
            } else if (!item.priceBatchQuantity) {
              this.alertValidate(this.$T("ssrc.inquiryHall.model.inquiryHall.priceQuantity").$D("价格批量"));
            } else if (this.propKey !== "supplier" && !item.suggestedRemark) {
              this.alertValidate(this.$T("ssrc.inquiryHall.model.checkPrice.suggestedRemark").$D("选用理由"));
            }
            return (
              item.suggestedFlag &&
              (!item.allottedQuantity ||
                !item.priceBatchQuantity ||
                isEmpty(item.suggestedRemark))
            );
          }
          return (
            item.suggestedFlag &&
              item.allottedQuantity > item.validQuotationQuantity
          );

        });
      });
      console.log(flag, 444444);
      return flag;
    },
    // 校验附件列表数据
    async validateAttachmentListTableDS(type) {
      if (!this.fileTemplateManageFlag) {
        return true;
      }
      const fileTempAttachmentDS = (this.$refs.fileTempAttachmentRef || {}).fileTempAttachmentDS;

      if (!fileTempAttachmentDS) {
        return true;
      }

      const attachmentTableValidate = await fileTempAttachmentDS.validate();

      if (!attachmentTableValidate) {
        const message = type === "save" ? this.$T("ssrc.inquiryHall.view.inquiryHall.saveNeedValidateAllTable").$D("请填写完整表格数据再保存") : this.$T("ssrc.inquiryHall.view.inquiryHall.inputSubmitRfxUpdate").$D("提交前请填写完整相关信息");

        this.$notification.open({
          message:`${this.$T("ssrc.inquiryHall.view.message.tab.attachmentList").$D("附件列表")}: ${message}`,
          class: "notification",
        });
      }

      return attachmentTableValidate;
    },
    // 获取附件列表数据
    getAttachmentListTableData() {
      if (!this.fileTemplateManageFlag) {
        return [];
      }
      const fileTempAttachmentDS = (this.$refs.fileTempAttachmentRef || {}).fileTempAttachmentDS;

      if (!fileTempAttachmentDS) {
        return [];
      }
      return fileTempAttachmentDS.toData();
    },
    // 刷新附件列表数据
    refreshAttachmentListTable() {
      if (!this.fileTemplateManageFlag) {
        return;
      }
      const fileTempAttachmentDS = (this.$refs.fileTempAttachmentRef || {}).fileTempAttachmentDS;

      if (fileTempAttachmentDS) {
        fileTempAttachmentDS.refresh();
      }
    },
    // 提交
    handleSubmit(params) {
      // console.log("提交..");
      const { propKey } = this;

      const relativeCodeMap = {
        itemLine: "SSRC.INQUIRY_HALL_CHECK_PRICE.TAB_ITEM_DT",
        supplierList: "SSRC.INQUIRY_HALL_CHECK_PRICE.TAB_SUPPLIER",
        allQuotationDetails: "SSRC.INQUIRY_HALL_CHECK_PRICE.TAB_ALL_QUOTATION_DETAIL",
      };
      const relativeCode = relativeCodeMap[propKey];

      // 提交前的校验
      // eslint-disable-next-line no-unused-vars
      const newParams = {
        ...params,
        customizeUnitCode: relativeCode ?
          `${"SSRC.INQUIRY_HALL_CHECK_PRICE.HEADER_INFO,"}${relativeCode},${params.customizeUnitCode}` :
          `SSRC.INQUIRY_HALL_CHECK_PRICE.HEADER_INFO,${params.customizeUnitCode}`,
      };
      this.$loading.show();
      // eslint-disable-next-line no-unused-vars
      submitCheckDataApi(newParams).then((resp) => {
        // console.log(resp, "resp");
        if (resp && resp.failed) {
          this.$notification.open({
            message: resp.message,
            class: "notification"
          });
        } else if ([ 1, 2, 3 ].includes(resp)) {
          this.$notification.open({
            message: this.$T(
              "hipspfm.supplierQuotation.view.message.supplementItem"
            ).$D(
              "提交失败，失败原因是该单存在没有物料编码的物料，需要补充/创建物料编码，请在PC端操作"
            ),
            class: "notification",
          });
        } else {
          this.$notification.open({
            message: this.$T(
              "hipspfm.supplierQuotation.view.message.submitSuccessed"
            ).$D("提交成功"),
            class: "notification",
          });
          this.goBack();
        }
      }).catch((err) => {
        console.log(err, 3333333);
      }).finally(() => {
        this.$loading.hide();
      });
      // console.log(333332);
      // submitValidateApi(newParams).then(res => { });
    },
    // 返回
    goBack() {
      this.$router.back();
    },
    //退出子应用
    // goClose() {
    //   try {
    //     closeWebView();
    //   } catch (err) {
    //     this.$router.back();
    //   }
    // },
    //回到顶部
    goTop() {
      this.$nextTick(() => {
        this.scroll.scrollTo(0, 0, 600, "bounce");
      });
    },
    //回到顶部
    goTopA() {
      this.$refs.headDetail.scrollTop = 0;
    },
    //关闭阶梯报价、报价明细pop
    changePopVisible(visible) {
      this.detailInfoFlag = visible;
      this.ladderInfoFlag = visible;
    },
    changeVisible(visible) {
      this.lineInfoFlag = visible;
      this.detailInfoFlag = visible;
      this.ladderInfoFlag = visible;
      this.headInfoFlag = visible;
      this.backFormPopFlag = visible;
    },
    alertValidate(columeName) {
      this.$notification.open({
        key,
        message: `${this.$T("ssrc.common.view.validation.fillRequire").$D("请填写")}${columeName}`,
        class: "notification",
      });
    }
  },
};
</script>

<style lang="stylus" scoped>
>>> .hips-cell__title{
  min-width:100px;
}
.rfxprice-detail {
  width: 100%;
  height calc(100vh - 44px);
  overflow-y: auto;
}
.content {
  padding-bottom: 70px;
  .content-item {
    >>>.hips-cell {
      padding 16px 15px;
    }
    .filter-wrap {
      width 100%;
      height: 48px;
      display: flex;
      justify-content center;
      align-items center;
      .filter-body {
        width: 345px;
        height: 32px;
        display: flex;
        justify-content space-around;
        align-items center;
        border-radius: 16px;
        padding 2px;
        background: #eeeeee;
        .filter-item {
          flex 1;
          text-align: center;
          font-size: 12px;
          color: #333333;
          line-height: 28px;
          border-radius: 16px;
          &.active {
            background: #ffffff;
          }
        }
      }
    }

    .tips-wrap {
      display: flex;
      flex-wrap: wrap;

      .tips {
        margin-top: 4px;
        font-size: 10px;
        line-height: 12px;
        display: inline-block;
        padding: 2px;
        border-radius: 2px;
        margin-right: 8px;
        border: 1px solid rgba(243, 99, 49, 0.08);
      }

      .tips-count {
        color: #05944f;
        background: rgba(5, 148, 79, 0.08);
      }

      .tips-tax {
        color: #f36331;
        background: rgba(243, 99, 49, 0.08);
      }

      .tips-rounds {
        color: #1f1f1f;
        background: #eeeeee;
        border: 1px solid #eeeeee;
      }

      .tips-applove {
        color: #ffffff;
        background: #276EF1;
      }

      .tips-line {
        color: #ffffff;
        background: #05944F;
      }

      .tips-price-count {
        color: #F36331;
        background: rgba(243,99,49,0.08);
      }

      .tips-price-hang {
        color: #1f1f1f;
        background: #eeeeee;
      }
    }

    .btn-wrap {
      display: flex;
      margin-top: 8px;

      .btn {
        border-radius: 10px;
        margin-right: 8px;
        padding: 4px 8px;
        line-height: 12px;
        font-size: 10px;
        display: flex;
        align-items: center;

        img {
          width: 12px;
          height: 12px;
        }
      }

      .file-btn {
        border: 1px solid #276ef1;
        color: #276ef1;
      }

      .supplier-btn {
        border: 1px solid #1f1f1f;
        color: #1f1f1f;
      }
    }
    .content-body {
      width:100%;
      .list {
        .list-item {
          padding: 16px 15px;
          .list-tit {
            display: flex;
            position relative;
            justify-content space-between;
            &::before {
              content: '';
              width 7px;
              height: 10px;
              background #276ef1;
              position: absolute;
              left -15px;
              top: 5px;
            }
            .list-txt {
              width 239px;
              line-height: 20px;
              font-size 14px;
              color: #1f1f1f;
              font-weight 700;
            }
          }
          .list-content {
            .item {
              display flex;
              justify-content space-between;
              li {
                flex 1;
                display: flex;
                margin-top 8px;
                color: #1f1f1f;
                font-size 14px;
                line-height: 20px;
              }
              .edit-li {
                background: #eff3fe;
                padding 4px;
                border-radius 4px;
                order: 1px solid #eff3fe;

                &:nth-child(2) {
                  margin-left: 7px;
                }

                .label {
                  width: 70px;
                }

                .li-input {
                  width 55px;
                  margin-left 12px;
                  border: 0; // 去除未选中状态边框
                  outline: none; // 去除选中状态边框
                  background-color: rgba(0, 0, 0, 0); // 透明背景
                }

                .single {
                  width: 70%;
                }

                .edit-icon {
                  width 20px;
                  height 20px;
                }
              }

            }
          }

          .bottom-btn {
            margin-top 12px;
            width 100%;
            display: flex;
            align-items center;
            justify-content center;

            .look-detail {
              background: #276ef1;
              border: 1px solid #276ef1;
              border-radius: 12px;
              padding 4px 8px;
              font-size 12px;
              color: #ffffff;
              line-height: 16px;
            }
          }
        }
      }
    }

    .no-data {
      width 100%;
      line-height 40px;
      background: #eee;
      font-size 14px;
      text-align center;
    }
  }
}

.bounce-enter-active {
  animation: bounce-in .3s;
}

.bounce-leave-active {
  animation: bounce-in .3s reverse;
}

@keyframes bounce-in {
  0% {
    transform: translateY(4px);
    opacity: 0;
  }
  100% {
    transform: translateY(-4px);
    opacity: 1;
  }
}

>>> .srm-list-item-card-head-right {
  display: none !important;
}
.dropdown-action {
  height auto;
}

>>> .srm-dropdown {

  .srm-button {
    height auto;
    width auto;
  }
  .srm-dropdown-button-text {
    max-width initial;
  }
}
>>> .bottom-handler{
  width:100% !important;
}
</style>
