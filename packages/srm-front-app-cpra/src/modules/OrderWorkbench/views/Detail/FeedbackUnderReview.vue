<template>
  <!-- 订单工作台 -->
  <div class="detail-container">
    <srm-scroll-tab>
      <!-- 订单基础信息 -->
      <srm-scroll-tab-item :label="getLanguageDefine('basicInfo')">
        <srm-list
          :scrollable="false"
          height="auto"
          style="height: auto"
          :data-set="basicInfoDataSet"
          :columns="getColumns('basicInfo')"
          :customize-code="getCodeDefine('basicInfo')"
          @itemClick="clickDetailInfo('basicInfo')"/>
      </srm-scroll-tab-item>
      <!-- 采购方及采买组织信息 -->
      <srm-scroll-tab-item :label="getLanguageDefine('organization')">
        <srm-list
          :scrollable="false"
          height="auto"
          style="height: auto"
          :data-set="basicInfoDataSet"
          :columns="getColumns('organization')"
          :customize-code="getCodeDefine('organization')"
          @itemClick="clickDetailInfo('organization')"/>
      </srm-scroll-tab-item>
      <!-- 订单明细信息 -->
      <srm-scroll-tab-item
        :label="getLanguageDefine('detailInfo')" class="detail-info-scroll">
        <!-- <div v-if="!detailInfoDataSet.editFlag" class="line-edit icon-edit srm-icon" @click="toggleOrderLineEdit"/>
        <srm-button v-else plain rect class="line-edit" @click="toggleOrderLineEdit">
          {{ $T("hipspfm.common.button.cancle").$D("取消") }}
        </srm-button> -->
        <srm-list
          :scrollable="false"
          height="auto"
          style="height: auto"
          :show-bottom-bar="false"
          :data-set="detailInfoDataSet"
          :columns="getColumns('detailInfo')"
          :customize-code="getCodeDefine('detailInfo')"
          @itemClick="clickDetailInfo('detailInfo')"/>
      </srm-scroll-tab-item>
      <!-- 收货/收单信息 -->
      <srm-scroll-tab-item v-if="['CATALOGUE','E-COMMERCE'].includes(headerInfo.poSourcePlatform)" :label="getLanguageDefine('receiptInfo')">
        <receipt-info
          :customize-code="getCodeDefine('receiptInfo')"
          :customize-detail-code="getCodeDefine('receiptDetailInfo')"
          :data-source="headerInfo"/>
      </srm-scroll-tab-item>
      <!-- 开票信息 -->
      <srm-scroll-tab-item v-if="['E-COMMERCE'].includes(headerInfo.poSourcePlatform)" :label="getLanguageDefine('billingInfo')">
        <billing-info
          :customize-code="getCodeDefine('billingInfo')"
          :customize-detail-code="getCodeDefine('billingDetailInfo')"
          :data-source="headerInfo"/>
      </srm-scroll-tab-item>
      <!-- 附件 -->
      <srm-scroll-tab-item :label="getLanguageDefine('attachInfo')">
        <attachment-info
          :data-set="basicInfoDataSet"
          :config="{readOnly:[true, false, true ]}"/>
      </srm-scroll-tab-item>
      <!-- 操作记录 -->
      <srm-scroll-tab-item
        :label="getLanguageDefine('operationRecord')">
        <div class="record-container">
          <history-record-tiled
            :action-data="operatingData"
            :remark-label="$T('sodr.common.view.tab.operationRecord').$D('操作说明')"
            operation-meaning-field-name="processTypeMeaning"
            process-remark-field-name="processRemark"
            operator-field-name="processUserName"
            process-date-field-name="processedDate"/>
        </div>
      </srm-scroll-tab-item>
      <!-- 留言板弹窗 -->
      <srm-scroll-tab-item
        class="srm-scroll-tab-message"
        :label="getLanguageDefine('messageBoard')">
        <div @click="showBoardPop">
          <srm-flex justify="between" align="center" class="message-container" style="padding: 0px 20px">
            <div>
              <span class="srm-icon icon-mail"/>
              <span class="message-text">{{ getLanguageDefine('boardMessage') }}</span>
              <span v-show="unreadCount" class="message-badge">{{ unreadCount }}</span>
            </div>
            <span class="srm-icon icon-chevron-right"/>
          </srm-flex>
        </div>
      </srm-scroll-tab-item>
      <div style="margin-bottom: 75px;border-top:1px solid var(--split-line-color-primary)"/>
    </srm-scroll-tab>
    <!-- 详情弹框 -->
    <srm-popup
      :visible.sync="visiblePopup"
      :position="'right'"
      :show-header="false"
      :height="'100%'">
      <srm-form
        v-if="visiblePopup"
        customize-type="detail"
        :data-set="popupData.data"
        :columns="getColumns(popupData.columns)"
        :customize-code="getCodeDefine(popupData.code)"/>
    </srm-popup>
    <!-- BOM弹框 -->
    <srm-popup
      :visible.sync="visibleBom"
      :position="'bottom'"
      :height="'100%'">
      <bom
        v-if="visibleBom"
        :data-source="bomData"
        :customize-code="getCodeDefine('bom')"/>
    </srm-popup>
    <!-- 留言板弹窗 -->
    <message-board
      v-model="boardPop"
      :po-header-id="String(poHeaderId)"
      user-camp-code="PURCHASE"/>
    <!-- 底部按钮-发布 -->
    <srm-bottom-handler :btn-arr="getButtons" type="tooltip"/>
  </div>
</template>

<script>
import moment from "moment";
import BigNumber from "bignumber.js";
import { isEmpty, isArray } from "lodash";
import { dateFormat } from "@/utils/index";
import { DataSet, $T, SrmBottomHandler, SrmMath } from "srm-mobile-ui";

import { getDynamicLabel } from "../../../../utils";
import Bom from "@/modules/OrderWorkbench/components/Bom";
import HistoryRecordTiled from "@/components/HistoryRecordTiled";
import MessageBoard from "@/modules/OrderWorkbench/components/MessageBoard/MessageBoard";
import ReceiptInfo from "@/modules/OrderWorkbench/components/ReceiptInfo";
import BillingInfo from "@/modules/OrderWorkbench/components/BillingInfo";
import AttachmentInfo from "@/modules/OrderWorkbench/components/AttachmentInfo.vue";
import OrderWorkbenchFeedbackMethod from "@/modules/CUX_PART/Method/OrderWorkbenchAllMethod";

import { getActionsRecordApi, queryDoubleUomConfigApi, agreeApi, rejectApi } from "../../api";
import { basicInfoDs, lineDs } from "../../datasource/detail/feedbackUnderReview";
import { STATUS_COLOR_MAP, amountRender, getRecord } from "../../components/utils/index";
export default {
  modules: [ "sodr.workspace", "sodr.common", "hipspfm.common", "hzero.common", "smbl.common", "sprm.common", "sinv.receiptWorkbench", "sinv.receiptExecution", "sinv.receipWorkbench" ],
  name: "FeedbackUnderReviewDetail",
  components: {
    HistoryRecordTiled,
    SrmBottomHandler,
    AttachmentInfo,
    MessageBoard,
    ReceiptInfo,
    BillingInfo,
    Bom
  },
  extends:OrderWorkbenchFeedbackMethod,
  props: {
    parameters: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      poHeaderId: null,
      basicInfoDataSet: new DataSet(basicInfoDs()), // 订单基础信息
      detailInfoDataSet: new DataSet(lineDs()), // 订单明细信息
      operatingData:[], // 操作记录
      boardPop: false,
      boardDetailPop:true,
      visiblePopup: false,
      visibleBom: false,
      popupData: {},
      bomData:{},
      unreadCount:0,
      isDoubleUnit: false,
    };
  },
  computed: {
    getButtons() {
      return [
        {
          name: "reject",
          type: "danger",
          size: "small",
          handler: () => {
            this.action("reject");
          },
          text: this.$T("sodr.workspace.view.button.return").$D("退回"),
        },
        {
          name: "agree",
          size: "small",
          handler: () => {
            this.action("agree");
          },
          text: this.$T("sodr.workspace.view.button.agree").$D("同意"),
        }
      ];
    },
    headerInfo() {
      return this.basicInfoDataSet.current && this.basicInfoDataSet.current.toData() || {};
    },
  },
  beforeMount() {
    this.type = this.$route.query.type || this.parameters.type;
    this.poHeaderId =
      this.$route.query.poHeaderId || this.parameters.poHeaderId || "";
  },
  mounted() {
    // 编辑/详情
    if (this.poHeaderId) {
      this.init();
    } else {
      this.showPage = false;
      this.$notification.open({
        message: $T("hzero.common.notification.noShow.tips").$D(
          "该单据当前状态不可查看"
        )
      });
    }
  },
  methods: {
    async init() {
      try {
        this.getPoHeader();
        this.getPoLine();
        this.getActionsRecord();
        await this.queryDoubleUomConfig();
      } catch (error) {
        this.$notification.open({
          message: error,
        });
      }
    },
    // 行编辑
    toggleOrderLineEdit() {
      this.detailInfoDataSet.editFlag = !this.detailInfoDataSet.editFlag;
    },
    //留言板显示
    showBoardPop() {
      this.boardPop = !this.boardPop;
      this.unreadCount = 0;
    },
    // 获取业务规则定义-双单位配置
    async queryDoubleUomConfig() {
      await queryDoubleUomConfigApi().then((res) => {
        if (res) {
          this.isDoubleUnit = Number(res);
        }
      });
    },
    //返回上一页
    goBack() {
      this.$router.back();
    },
    boolRender(val) {
      return Number(val) === 1 ? this.$T("hipspfm.common.status.yes").$D("是") : this.$T("hipspfm.common.status.no").$D("否");
    },
    //订单同意/退回
    action(type) {
      // eslint-disable-next-line consistent-this
      const self = this;
      const actionApiMap = {
        agree: agreeApi,
        reject: rejectApi,
      };
      const basicInfo = this.basicInfoDataSet.toData()[0];
      const isAgree = type === "agree";
      const byLine = basicInfo.collByLineFlag;
      const selectedData = this.detailInfoDataSet.selected.map((i) => i.toData());
      const lineData = isEmpty(selectedData) ? this.detailInfoDataSet.toData() : selectedData;
      const data = [
        {
          ...basicInfo,
          checkFlag: byLine ? 1 : 0,
          poWorkbenchFlag: 1,
          poLineLocationList: lineData.map((i) => isAgree ?
            { ...i, objectVersionNumber: i.locationVersionNumber } :
            { ...i, objectVersionNumber: i.locationVersionNumber, deliveryDateRejectFlag: 1 }),
        },
      ];
      const actionApi = actionApiMap[type];
      const codes = [
        this.getHeaderCuzCodes(),
        this.getLineCuzCodes(),
      ].toString();
      self.$loading.show();
      actionApi(data, codes).then((res) => {
        if (res) {
          if (res && res.failed) {
            self.$notification.open({ message: res.message });
          } else {
            self.$notification.open({
              message: self.$T("hzero.common.notification.success").$D("操作成功"),
            });
            setTimeout(() => {
              self.goBack();
            }, 200);
          }
        }
      }).finally(() => {
        self.$loading.hide();
      });
    },
    getHeaderCuzCodes() {
      return [
        this.getCodeDefine("basicInfo"),
        this.getCodeDefine("basicInfoDetail"),
        this.getCodeDefine("organization"),
        this.getCodeDefine("organizationDetail"),
        this.getCodeDefine("receiptInfo"),
        this.getCodeDefine("receiptDetailInfo"),
        this.getCodeDefine("billingInfo"),
        this.getCodeDefine("billingDetailInfo"),
      ].toString();
    },
    getLineCuzCodes() {
      return [ this.getCodeDefine("detailInfo"), this.getCodeDefine("detailInfoDetail") ].toString();
    },
    // 多语言配置
    getLanguageDefine(key) {
      const languageList = {
        basicInfo: $T("sodr.workspace.view.panel.orderBasicInfo").$D("订单基础信息"),
        organization: $T("sodr.workspace.view.panel.organization").$D(
          "交易方及采买组织信息"
        ),
        detailInfo: $T("sodr.workspace.view.panel.detailInfo").$D("订单明细信息"),
        receiptInfo:$T("sodr.workspace.view.panel.receiptInfo").$D("收货/收单信息"),
        billingInfo:$T("sodr.workspace.view.panel.billingInfo").$D("开票信息"),
        attachInfo: $T("sodr.workspace.model.common.attachmentUuid").$D("附件"),
        messageBoard: $T("sodr.common.view.button.messageBoard").$D("留言板"),
        boardMessage: $T("sodr.common.view.button.boardMessage").$D("留言板消息"),
        operationRecord:$T("sodr.workspace.view.title.operationHistory").$D("操作记录"),
      };
      return languageList[key] || key;
    },
    // 个性化配置
    getCodeDefine(key) {
      const prefix = "SMBL.ORDER_WORKBENCH.FEEDBACKUNDERREVIEW";
      const codeMap = {
        bom:`${prefix}.BOM`,
        basicInfo:`${prefix}.BASICINFO`,
        basicInfoDetail:`${prefix}.BASICINFO_DETAIL`,
        detailInfo: `${prefix}.LINEINFO`,
        detailInfoDetail:`${prefix}.LINEINFO_DETAIL`,
        organization:`${prefix}.ORGANIZATIONINFO`,
        organizationDetail:`${prefix}.ORGANIZATION_DETAIL`,
        receiptInfo:`${prefix}.RECEIPTINFO`,
        receiptDetailInfo:`${prefix}.RECEIPTINFO_DETAIL`,
        billingInfo:`${prefix}.BILLINGINFO`,
        billingDetailInfo:`${prefix}.BILLINGINFO_DETAIL`,
      };
      return codeMap[key] || key;
    },
    // 查询头信息
    async getPoHeader() {
      this.basicInfoDataSet.addPathParameter("poHeaderId", this.poHeaderId);
      this.basicInfoDataSet.setQueryParameter({
        camp: 1,
        poHeaderId:this.poHeaderId,
        customizeUnitCode: this.getHeaderCuzCodes()
      });
      this.basicInfoDataSet.refresh();
      this.unreadCount = this.headerInfo.unreadCount;
    },
    // 查询行信息
    async getPoLine() {
      this.detailInfoDataSet.addPathParameter("poHeaderId", this.poHeaderId);
      this.detailInfoDataSet.setQueryParameter({
        camp: 2,
        sortType: 0,
        poEntryPoint: "OERDER_FEEDBACK",
        customizeUnitCode:  this.getLineCuzCodes(),
      });
      this.detailInfoDataSet.refresh();
    },
    // 操作记录查询
    async getActionsRecord() {
      const res = await getActionsRecordApi(this.poHeaderId);
      if (res && !res.failed && isArray(res.content)) {
        this.operatingData = getRecord(res.content);
      }
    },
    // 点击tab块
    clickDetailInfo(name) {
      switch (name) {
      case "basicInfo":
        this.openDetailPopup("basicInfoDetail", this.basicInfoDataSet);
        break;
      case "organization":
        this.openDetailPopup("organizationDetail", this.basicInfoDataSet);
        break;
      case "detailInfo":
        this.openDetailPopup("detailInfoDetail", this.detailInfoDataSet);
        break;
      default:
        break;
      }
    },
    // 查看BOM
    openBom(record) {
      this.visibleBom = true;
      this.bomData = record;
    },
    // 详情弹框
    async openDetailPopup(name, item) {
      this.popupData = {
        data: item,
        columns: name,
        code: name
      };
      this.visiblePopup = true;
    },
    getColumns(name) {
      let cuxdetailInfoDetail = [];
      // 标准二开埋点
      if (this.over$cuxGetColumns && typeof this.over$cuxGetColumns === "function") {
        cuxdetailInfoDetail = this.over$cuxGetColumns();
      }
      switch (name) {
      case "basicInfo":
        return [
          {
            fieldCode: "displayPoNum",
            fieldType: "EMPTY",
            // fieldName: $T("sodr.workspace.model.common.displayPoNum").$D("订单编号"),
            render: (val, item) =>
              <SrmListHeader>
                <span>{item.displayPoNum || "-"}</span>
              </SrmListHeader>,
          },
          {
            fieldCode: "poTypeDesc",
            fieldName: $T("sodr.workspace.model.common.poTypeId").$D("订单类型"),
            fieldType: "TEXT",
          },
          {
            fieldCode: "currencyCode",
            fieldName: $T("sodr.workspace.model.common.currencyCode").$D("币种"),
          },
          {
            fieldCode: "amount",
            fieldName: $T("sodr.workspace.model.common.amounts").$D("总金额(不含税)"),
            // fieldType: "INPUT_NUMBER",
            // editor: false,
            render: this.handleAmountRender,
          },
          {
            fieldCode: "taxIncludeAmount",
            fieldName: $T("sodr.workspace.model.common.amountTaxInclude").$D("总金额(含税)"),
            // fieldType: "INPUT_NUMBER",
            // editor: false,
            render: this.handleAmountRender,
          },
          {
            fieldCode: "quantityTotal",
            fieldName: $T("sodr.workspace.model.common.quantityTotal").$D("总数量"),
            fieldType: "INPUT_NUMBER",
            editor: false,
          },
          {
            fieldCode: "creationDate",
            fieldName: $T("sodr.workspace.model.common.creationTime").$D(
              "创建时间"
            ),
            render: (val) => <span>{dateFormat(val)}</span>,
          },
          {
            fieldCode: "poSourcePlatformMeaning",
            fieldName: $T("sodr.workspace.model.common.poSourcePlatform").$D(
              "来源平台"
            ),
          },
          {
            fieldCode: "remark",
            fieldName: $T("sodr.workspace.model.common.remark").$D(
              "备注"
            ),
            editor: false,
          },
          // 默认隐藏字段
          // {
          //   fieldCode: "domesticTaxIncludeAmount",
          //   fieldName: $T("sodr.workspace.model.common.domesticTaxIncludeAmounts").$D(
          //     "本币金额(含税)"
          //   ),
          //   render: amountRender,
          // },
          // {
          //   fieldCode: "domesticAmount",
          //   fieldName: $T("sodr.workspace.model.common.domesticAmounts").$D(
          //     "本币金额(不含税)"
          //   ),
          //   render: amountRender,
          // },
        ];
      case "organization":
        return [
          {
            fieldCode: "companyName",
            fieldType: "EMPTY",
            fieldName: $T("sodr.workspace.model.common.company").$D("公司"),
            render: (val, item) =>
              <SrmListHeader>
                <span>{ $T("sodr.workspace.model.common.company").$D("公司")}:</span>
                <span>{item.companyName || "-"}</span>
              </SrmListHeader>,
          },
          {
            fieldCode: "supplierName",
            fieldName: $T("sodr.workspace.model.common.supplier").$D("供应商"),
          },
          {
            fieldCode: "ouName",
            fieldName: $T("sodr.workspace.model.common.ouId").$D("业务实体"),
            editor: false,
          },
          {
            fieldCode: "purchaseOrgName",
            editor:false,
            fieldName: $T("sodr.workspace.model.common.purchaseOrgId").$D("采购组织"),
          },
          {
            fieldCode: "agentName",
            fieldName: $T("sodr.workspace.model.common.agentId").$D("采购员"),
          },
        ];
      case "detailInfo":
        return [
          {
            formRow: 10,
            fieldCode: "itemName",
            fieldType: "EMPTY",
            render: (val, item) =>
              <SrmListHeader>
                <span>{item.itemName || "-"}</span>
                <SrmButton
                  rect
                  plain
                  slot='right'
                  style={{ fontWeight: "bold" }}
                  type={STATUS_COLOR_MAP[item.statusCode]}
                >
                  {item.displayStatusMeaning || ""}
                </SrmButton>
              </SrmListHeader>,
          },
          {
            formRow: 20,
            fieldCode: "displayLineNum",
            fieldName: $T("sodr.workspace.model.common.displayLineNum").$D("行号"),
          },
          {
            formRow: 30,
            fieldCode: "itemCode",
            fieldName: $T("sodr.workspace.model.common.itemCode").$D("物料编码"),
          },
          {
            formRow: 40,
            fieldCode: "displayLineLocationNum",
            fieldName: $T("sodr.workspace.model.common.displayLineLocationNum").$D("发运号"),
          },
          this.isDoubleUnit && {
            formRow: 45,
            fieldName: this.$T("sodr.workspace.model.common.quantity").$D(
              "数量"
            ),
            fieldCode: "secondaryQuantity",
            render: (val, item, field, record) => {
              const dom = amountRender(val, item, field, record);
              const notEqual = !SrmMath.isZero(SrmMath.minus(new BigNumber(val), new BigNumber(item.originalQuantity)));
              if (notEqual) {
                return <span style="color: red">{dom}</span>;
              }
              return dom;
            },
          },
          {
            formRow: 50,
            fieldCode: "quantity",
            fieldName: getDynamicLabel(this.isDoubleUnit, "quantity"),
            render: (val, item, field, record) => {
              const dom = amountRender(val, item, field, record);
              const notEqual = !SrmMath.isZero(SrmMath.minus(new BigNumber(val), new BigNumber(item.originalQuantity)));
              if (!this.isDoubleUnit && notEqual) {
                return <span style="color: red">{dom}</span>;
              }
              return dom;
            },
          },
          {
            formRow: 50,
            fieldCode: "originalQuantity",
            fieldName: $T("sodr.workspace.model.common.originalQuantity").$D("原需求数量"),
            render: amountRender
          },
          {
            formRow: 60,
            fieldCode: "unitPrice",
            fieldName: $T("sodr.workspace.model.common.unitPrices").$D("单价(不含税)"),
            render: amountRender,
          },
          {
            formRow: 60,
            fieldCode: "enteredTaxIncludedPrice",
            fieldName: $T("sodr.workspace.model.common.enteredTaxIncludedPrices").$D("单价(含税)"),
            render: amountRender,
          },
          {
            formRow: 70,
            fieldCode: "promiseDeliveryDate",
            fieldName: $T("sodr.workspace.model.common.promiseDeliveryDate").$D("承诺交货日期"),
            render:(val, item) => {
              const time = <span>{dateFormat(val)}</span>;
              const dom = moment(item.needByDate).diff(val) ? <div style="color: rgb(245, 102, 73)"> {time}</div> : time;
              return dom;
            }
          },
          {
            formRow: 80,
            fieldCode: "needByDate",
            fieldName: $T("sodr.workspace.model.common.needByDate").$D("需求日期"),
            render: (val) => <span>{dateFormat(val)}</span>,
          },
        ].filter((i) => i)?.concat(cuxdetailInfoDetail);
      case "basicInfoDetail":
        return [
          {
            fieldCode: "displayPoNum",
            fieldName: $T("sodr.workspace.model.common.displayPoNum").$D("订单编号"),
          },
          {
            fieldCode: "poTypeDesc",
            fieldName: $T("sodr.workspace.model.common.poTypeId").$D("订单类型"),
          },
          {
            fieldCode: "amount",
            fieldName: $T("sodr.workspace.model.common.amounts").$D("总金额(不含税)"),
            // fieldType: "INPUT_NUMBER",
            // editor: false,
            render: this.handleAmountRender,
          },
          {
            fieldCode: "taxIncludeAmount",
            fieldName: $T("sodr.workspace.model.common.amountTaxInclude").$D("总金额(含税)"),
            // fieldType: "INPUT_NUMBER",
            // editor: false,
            render: this.handleAmountRender,
          },
          {
            fieldCode: "quantityTotal",
            fieldName: $T("sodr.workspace.model.common.quantityTotal").$D("总数量"),
            fieldType: "INPUT_NUMBER",
            editor: false,
          },
          {
            fieldCode: "currencyCode",
            fieldName: $T("sodr.workspace.model.common.currencyCode").$D("币种"),
          },
          {
            fieldCode: "creationDate",
            fieldName: $T("sodr.workspace.model.common.creationTime").$D(
              "创建时间"
            ),
          },
          {
            fieldCode: "termsName",
            fieldName: $T("sodr.workspace.model.common.termsId").$D(
              "付款条款"
            ),
          },
          {
            fieldCode: "poSourcePlatformMeaning",
            fieldName: $T("sodr.workspace.model.common.poSourcePlatform").$D(
              "来源平台"
            ),
          },
          {
            fieldCode: "remark",
            fieldName: $T("sodr.workspace.model.common.remark").$D(
              "备注"
            ),
            editor: false,
          },
        ];
      case "organizationDetail":
        return [
          {
            fieldCode: "companyName",
            fieldName: $T("sodr.workspace.model.common.company").$D("公司"),
          },
          {
            fieldCode: "supplierName",
            fieldName: $T("sodr.workspace.model.common.supplier").$D("供应商"),
          },
          {
            fieldCode: "ouName",
            fieldName: $T("sodr.workspace.model.common.ouId").$D("业务实体"),
            editor: false,
          },
          {
            fieldCode: "purchaseOrgName",
            editor:false,
            fieldName: $T("sodr.workspace.model.common.purchaseOrgId").$D("采购组织"),
          },
          {
            fieldCode: "agentName",
            fieldName: $T("sodr.workspace.model.common.agentId").$D("采购员"),
          },
        ];
      case "detailInfoDetail":
        return [
          {
            fieldCode: "displayStatusMeaning",
            fieldName: $T("sodr.workspace.model.common.displayStatusCode").$D("状态"),
          },
          {
            fieldCode: "displayLineNum",
            fieldName: $T("sodr.workspace.model.common.displayLineNum").$D("行号"),
          },
          {
            fieldCode: "displayLineLocationNum",
            fieldName: $T("sodr.workspace.model.common.displayLineLocationNum").$D("发运号"),
          },
          {
            fieldCode: "itemName",
            fieldName: $T("sodr.workspace.model.common.itemName").$D("物料名称"),
          },
          {
            fieldCode: "itemCode",
            fieldName: $T("sodr.workspace.model.common.itemCode").$D("物料编码"),
          },
          this.isDoubleUnit && {
            formRow: 45,
            fieldName: this.$T("sodr.workspace.model.common.quantity").$D(
              "数量"
            ),
            fieldCode: "secondaryQuantity",
            render: (val, item, field, record) => {
              const dom = amountRender(val, item, field, record);
              const notEqual = !SrmMath.isZero(SrmMath.minus(new BigNumber(val), new BigNumber(item.originalQuantity)));
              if (notEqual) {
                return <span style="color: red">{dom}</span>;
              }
              return dom;
            },
          },
          this.isDoubleUnit && {
            fieldName: this.$T("sodr.workspace.model.common.uomId").$D("单位"),
            fieldCode: "secondaryUomCodeAndName",
          },
          {
            fieldCode: "quantity",
            fieldName: getDynamicLabel(this.isDoubleUnit, "quantity"),
            render: (val, item, field, record) => {
              const dom = amountRender(val, item, field, record);
              const notEqual = !SrmMath.isZero(SrmMath.minus(new BigNumber(val), new BigNumber(item.originalQuantity)));
              if (!this.isDoubleUnit && notEqual) {
                return <span style="color: red">{dom}</span>;
              }
              return dom;
            },
          },
          {
            fieldCode: "originalQuantity",
            fieldName: $T("sodr.workspace.model.common.originalQuantity").$D("原需求数量"),
            render: amountRender
          },
          {
            fieldCode: "uomCodeAndName",
            fieldName: getDynamicLabel(this.isDoubleUnit, "uom"),
          },
          {
            fieldCode: "needByDate",
            fieldName: $T("sodr.workspace.model.common.needByDate").$D("需求日期"),
            render: (val) => <span>{dateFormat(val)}</span>,
          },
          {
            fieldCode: "unitPrice",
            fieldName: $T("sodr.workspace.model.common.unitPrices").$D("单价(不含税)"),
            render: amountRender,
          },
          {
            fieldCode: "lineAmount",
            fieldName: $T("sodr.workspace.model.common.lineAmounts").$D("行金额(不含税)"),
            // fieldType: "INPUT_NUMBER",
            // editor: false,
            render: this.handleAmountRender,
          },
          {
            fieldCode: "enteredTaxIncludedPrice",
            fieldName: $T("sodr.workspace.model.common.enteredTaxIncludedPrices").$D("单价(含税)"),
            render: amountRender,
          },
          {
            fieldCode: "taxIncludedLineAmount",
            fieldName: $T("sodr.workspace.model.common.taxIncludedLineAmounts").$D("行金额(含税)"),
            // fieldType: "INPUT_NUMBER",
            // editor: false,
            render: this.handleAmountRender,
          },
          {
            fieldCode: "taxRate",
            fieldName: $T("sodr.workspace.model.common.taxId").$D("税率"),
            fieldType: "INPUT_NUMBER",
            editor: false,
          },
          {
            fieldCode: "unitPriceBatch",
            fieldName: $T("sodr.workspace.model.common.unitPriceBatch").$D("每"),
            fieldType: "INPUT_NUMBER",
            editor: false,
          },
          {
            fieldCode: "currencyCode",
            fieldName: $T("sodr.workspace.model.common.currencyCode").$D("币种"),
          },
          {
            fieldCode: "promiseDeliveryDate",
            fieldName: $T("sodr.workspace.model.common.promiseDeliveryDate").$D("承诺交货日期"),
            render:(val, item) => {
              const time = <span>{dateFormat(val)}</span>;
              const dom = moment(item.needByDate).diff(val) ? <div style="color: rgb(245, 102, 73)">{time}</div> : time;
              return dom;
            }
          },
          {
            fieldCode: "categoryName",
            fieldName: $T("sodr.workspace.model.common.categoryId").$D("物料分类"),
          },
          {
            fieldCode: "invOrganizationName",
            fieldName: $T("sodr.workspace.model.common.invOrganizationId").$D("库存组织"),
          },
          {
            fieldCode: "inventoryName",
            fieldName: $T("sodr.workspace.model.common.invInventoryId").$D("收货库房"),
          },
          {
            fieldCode: "locationName",
            fieldName: $T("sodr.workspace.model.common.invLocationId").$D("收货库位"),
          },
          {
            fieldCode: "bom",
            fieldName: $T("sodr.workspace.model.common.bom").$D("外协BOM"),
            render: (val, item) => <span style='color: var(--color-other-default-b)' onClick={(e) => {
              e.stopPropagation(); this.openBom(item);
            }}>
              {$T("hzero.common.button.look").$D("查看")}
            </span>
          },
          {
            fieldCode: "remark",
            fieldName: $T("sodr.workspace.model.common.remark").$D("备注"),
          },
          {
            fieldCode: "feedback",
            fieldName: $T("sodr.common.model.common.feedback").$D("反馈信息"),
          },
        ].filter((i) => i)?.concat(cuxdetailInfoDetail);
      default:
        return [];
      }
    },
    handleAmountRender(...args) {
      if (this.over$handleAmountRender && typeof this.over$handleAmountRender === "function") {
        return this.over$handleAmountRender()(...args);
      }
      return amountRender(...args);
    },
  }
};
</script>

<style lang="stylus" scoped>
.approval-detail-bottom {
  height 72px;
  width 100%;
  margin-bottom: constant(safe-area-inset-top);
  margin-bottom: env(safe-area-inset-top);
  background: var(--background-color-empty-second);
}

>>> .srm-scroll-tab-item-title {
  display: flex;
  justify-content: space-between !important;

}

.detail-info-scroll{
  position: relative;
  .line-edit{
    position: absolute;
    top: 18px;
    right: 26px;
  }
  .srm-icon {
    color var(--font-color-disable);
    font-size 20px;
  }
}
.srm-scroll-tab-message {
  position: relative;
  .message-container{
    height: 60px;
    .message-badge{
      display: inline-block;
      padding: 0 4px;
      height: 18px;
      min-width: 20px;
      line-height: 18px;
      font-weight: 500;
      border-radius: 10px;
      background: #E11900;
      font-family: PingFangSC-Medium;
      font-size: 10px;
      color: #FFFFFF;
    }
    .message-text{
      font-size: 14px;
      margin: 0 10px;
    }
    .srm-icon{
      font-size: 16px;
    }
    .icon-mail {
      color: #276EF1;
    }
  }
}

</style>
