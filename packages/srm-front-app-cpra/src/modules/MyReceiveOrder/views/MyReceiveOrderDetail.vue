<template>
  <div v-if="showPage" style="height: 100vh;">
    <div class="main-info">
      <!-- 头信息 -->
      <srm-detail-head :data-source="headInfo" :columns="getDetailHeadColumns" customize-code="SMBL.MY_RECEIVE_ORDER.HEAD_DETAIL_INFO">
        <div class="button-right-margin">
          <srm-button size="small" icon="icon-paperclip">
            <!-- <img src="@/assets/DeliveryBill/icon_Button_paperclip_highlight@3x.png"> -->
            <srm-upload :is-tab="true" :show-icon="false" :show-count="false" color="blue" :file-arr="fileArr" :desc-title="$T('ssrc.inquiryHall.button.inquiryHall.file').$D('详情附件')" />
          </srm-button>
          <srm-button size="small" type="warn" icon="icon-clock" @click="showOperationPop">
            <span>{{ $T('hipspfm.common.message.title.operationRecord').$D('操作记录') }}</span>
          </srm-button>
          <srm-button size="small" icon="icon-notes" @click="showBoardPop">
            <span>{{ $T('hipspfm.common.message.board').$D('留言板') }}</span>
          </srm-button>
          <srm-button v-if="userInfo.tenantNum === 'SRM-SANJIANG' && headInfo.statusCode === 'CONFIRMED'" size="small" icon="icon-scan" @click="showQrCode">
            <span>{{ $T('hipspfm.common.message.title.receiveQrCode').$D('收货二维码') }}</span>
          </srm-button>
        </div>
      </srm-detail-head>
      <!-- 内容区域 -->
      <srm-scroll-tab>
        <srm-scroll-tab-item :label="$T('hipspfm.common.view.message.title.orderHeaderInfo').$D('订单头信息')" >
          <customize style="padding: 16px 15px" code="SMBL.MY_RECEIVE_ORDER.HEAD_INFO" :data-source="headInfo" :columns="getOrderHeadInfoColumns" />
        </srm-scroll-tab-item>
        <srm-scroll-tab-item :label="$T('hipspfm.common.view.message.title.orderLineInfo').$D('订单行信息')" >
          <div v-for="(item, index) in lineInfo" :key="index" @click="showLineDetail(item)">
            <customize style="padding: 16px 15px" code="SMBL.MY_RECEIVE_ORDER.LINE_INFO" :data-source="item" :columns="getOrderLineInfoColumns" />
          </div>
        </srm-scroll-tab-item>
        <srm-scroll-tab-item v-if="isMallOrder" :label="$T('hipspfm.common.view.message.title.receiptGoodsAndOrders').$D('收货收单')" >
          <customize style="padding: 16px 15px" code="SMBL.MY_RECEIVE_ORDER.RECEIPT_GOODS_AND_ORDERS_INFO" :data-source="headInfo" :columns="getGoodsAndOrdersInfoColumns" />
        </srm-scroll-tab-item>
        <srm-scroll-tab-item v-if="isMallOrder" :label="$T('hipspfm.common.view.message.title.billingInfo').$D('开票信息')" >
          <customize style="padding: 16px 15px" code="SMBL.MY_RECEIVE_ORDER.BILL_INFO" :data-source="headInfo" :columns="getBillInfoColumns" />
        </srm-scroll-tab-item>
      </srm-scroll-tab>
    </div>

    <!-- 行信息弹窗 -->
    <srm-popup :visible.sync="visible" height="100%" position="right" :title="$T('hipspfm.orderApproval.view.message.title.orderDetail').$D('订单详情')">
      <div style="height: 100%; overflow: auto;">
        <customize-detail :need-padding="true" code="SMBL.MY_RECEIVE_ORDER.LINE_INFO_DETAIL" :data-source="currentLineInfo" :columns="getOrderLineDetailInfoColumns" />
      </div>
    </srm-popup>
    <!-- 验收标准信息弹窗 -->
    <srm-popup :visible.sync="acceptabilityShow" height="90%" :title="$T('sodr.common.model.acceptabilityCriteria').$D('验收标准')">
      <div style="height: 100%; overflow: auto;">
        <customize-detail :need-padding="true" code="SMBL.MY_RECEIVE_ORDER.ACCEPTABILITY_CRITERIA_INFO" :data-source="acceptabilityCriteriaInfo" :columns="getAcceptaBilityCriteriaInfoColumns" />
      </div>
    </srm-popup>
    <srm-bottom-handler v-if="headInfo.statusCode === 'CONFIRMED'" :btn-arr="getBtnArr" />

    <!-- 历史记录弹窗 -->
    <history-record
      v-model="operationPopup"
      :action-data="operationArr"
      :remark-label="$T('smbl.common.view.title.operationRemark').$D('操作说明')"
      process-remark-field-name="processRemark"
      operator-field-name="processUserName"
      operation-meaning-field-name="processTypeMeaning"
      process-date-field-name="processedDate"/>
    <!-- 留言板弹窗 -->
    <message-board
      v-if="boardPop"
      v-model="boardPop"
      :po-header-id="String(poHeaderId)"
      user-camp-code="SUPPLIER"/>
  </div>
</template>

<script>
/* eslint-disable no-invalid-this */
import HistoryRecord from "@/components/HistoryRecord";
import uuid from "uuid";
import { debounce, isEmpty } from "lodash";
import MessageBoard from "@/components/MessageBoard/MessageBoard";
import {
  getOpRecordApi,
  submitOrderApi,
  getOrderLineApi,
  getOrderHeaderApi,
  getSanjiangOrderLineApi,
  getAcceptabilityCriteria,
  queryDoubleUomConfigApi,
  calculateDoubleUomApi,
  saveFileUUIDApi,
} from "../api";
import { SrmUtil, SrmMath } from "srm-mobile-ui";
import BigNumber from "bignumber.js";
import { maxValiDatorForTen, getDynamicLabel } from "@/utils";

export default {
  modules: [ "hipspfm.common", "sodr.orderApproval", "hipspfm.orderApproval", "spuc.common", "ssrc.inquiryHall", "smbl.common", "sodr.receivedOrder", "hipspfm.receivedOrder", "sodr.common", "hzero.common", "sprm.common", "sodr.workspace" ],
  name: "DeliveryBillDetail",
  components: {
    HistoryRecord,
    MessageBoard,
  },
  data() {
    return {
      orgName: "", //业务实体
      poHeaderId:"",
      operationArr: [], // 操作记录
      headInfo: {}, //头信息
      lineInfo: [], //行信息
      operationPopup: false, //操作记录弹窗标识
      logisticsPop: false, //物流信息标识
      visible: false, //行信息弹窗
      currentLineInfo: {}, //当前行信息
      userInfo: {},
      unreadCount: 0,
      displayPoNum: "", //订单号
      boardPop: false,
      acceptabilityCriteriaInfo: {}, //验收标准
      acceptabilityShow: false, //验收标准展示标识
      showPage: false,
      isDoubleUnit: false,
    };
  },
  computed: {
    // remarkLabel() {
    //   return this.$T("smbl.common.view.description").$D("说明");
    // },
    isMallOrder() {
      return this.headInfo.poSourcePlatform === "E-COMMERCE";
    },
    isSanJiang() {
      return SrmUtil.getTenantNum() === "SRM-SANJIANG";
    },
    getTenantNum() {
      return SrmUtil.getTenantNum();
    },
    fileArr() {
      if (!Object.keys(this.headInfo).length) {
        return [];
      }
      // const { headInfo: { purchaserAttachmentUuid = uuid(), supplierAttachmentUuid = uuid() } } = this;
      return [
        { title: this.$T("sodr.receivedOrder.model.receivedOrder.purchaserAttachment").$D("采购方附件"), attachmentUuid: this.purchaserAttachmentUuid, readOnly: true },
        { title: this.$T("sodr.receivedOrder.model.receivedOrder.supplierAttachment").$D("供应商附件"), attachmentUuid: this.supplierAttachmentUuid, readOnly: false },
      ];
    },
    // 按钮
    getBtnArr() {
      return [
        {
          title: this.$T("smbl.common.button.submit").$D("提交"),
          handler: () => this.handlerPre("submit"),
        },
      ];
    },
    // 详情头
    getDetailHeadColumns() {
      const columns = [
        {
          // fieldName: "送货单号",
          fieldCode: "displayPoNum",
          // langCode: "sinv.purchaseReception.view.message.asnNum",
        },
        {
          fieldName: this.$T("sodr.receivedOrder.model.receivedOrder.taxedAmount").$D("含税金额"),
          fieldCode: "taxIncludeAmount",
          render: (val, record) => {
            const length = this.$options.filters.calcCurrencyPrecision(this.headInfo.currencyCode, "financialPrecision");
            return String(record.currencyCode) + " " + this.$options.filters.calcMultipleDelimiter(new BigNumber(val), length);
          }
        },
        {
          fieldName: this.$T("sodr.receivedOrder.model.receivedOrder.latestVersion").$D("版本号"),
          fieldCode: "versionNum",
        },
      ];

      return columns;
    },
    // 送货单头信息
    getOrderHeadInfoColumns() {
      const columns = [
        {
          fieldName: this.$T("hipspfm.common.message.company").$D("公司"),
          fieldCode: "companyName",
        },
        {
          fieldName: this.$T("sodr.receivedOrder.model.receivedOrder.orgName").$D("业务实体"),
          fieldCode: "ouName",
        },
        {
          fieldName: this.$T("sodr.receivedOrder.model.receivedOrder.supplierName").$D("供应商"),
          fieldCode: "supplierName",
        },
        {
          fieldName: this.$T("hipspfm.receivedOrder.model.receivedOrder.poTypeDesc").$D("订单类型"),
          fieldCode: "poTypeDesc",
        },
        {
          fieldName: this.$T("sodr.receivedOrder.model.receivedOrder.purOrganizationName").$D("采购组织"),
          fieldCode: "purchaseOrgName",
        },
        {
          fieldName: this.$T("sodr.receivedOrder.model.receivedOrder.agentName").$D("采购员"),
          fieldCode: "agentName",
        },
        {
          fieldName: this.$T("sodr.receivedOrder.model.receivedOrder.releaseDate").$D("发布日期"),
          fieldCode: "releasedDate",
        },
        {
          fieldName: this.$T("sodr.receivedOrder.model.receivedOrder.dataSourceCode").$D("来源平台"),
          fieldCode: "poSourcePlatformMeaning",
        },
        {
          fieldName: this.$T("sodr.receivedOrder.model.receivedOrder.comments").$D("订单摘要"),
          fieldCode: "remark",
          render:(val) => val ? val : this.$T("hipspfm.common.currency.none").$D("无")
        }
      ];
      return columns;
    },
    // 订单行信息
    getOrderLineInfoColumns() {
      const columns = [
        {
          formRow: 0,
          fieldCode: "customHeader",
          fieldType: "EMPTY",
          langCode: "sodr.orderApproval.model.common.displayLineNum",
          render: (val, item) => <SrmListHeader>
            <span>{item.itemName}</span>
            <span slot="right">{ this.$T("sodr.receivedOrder.model.receivedOrder.lineNum").$D("行号") }：{item.lineNum}</span>
          </SrmListHeader>
        },
        {
          fieldName: this.$T("sodr.receivedOrder.model.receivedOrder.itemCode").$D("物料编码"),
          fieldCode: "itemCode",
        },
        {
          fieldName: this.$T("sodr.receivedOrder.model.receivedOrder.shipmentNum").$D("发运号"),
          fieldCode: "displayLineLocationNum",
        },
        this.isDoubleUnit && {
          fieldName: this.$T("hipspfm.receivedOrder.model.receivedOrder.quantity").$D("数量"),
          fieldCode: "secondaryQuantity",
          fieldType: "INPUT_NUMBER",
          validator:(val) => maxValiDatorForTen(val),
          inputChange: (val, item) => this.lineQuantityChange(val, item, "secondaryQuantity"),
          editor: (val, record) => {
            if (record.quantityEditFlag === 1) {
              return true;
            }
            return false;
          },
          required:(val, record) => {
            if (record.quantityEditFlag === 1) {
              return true;
            }
            return false;
          },
          editLimit:(val, record) => {
            if (record.quantityEditFlag === 1) {
              return true;
            }
            return false;
          },
          precision: (val, record) => {
            if (record.quantityEditFlag === 1) {
              // erp订单及电商申请转订单不做精度控制
              // erp订单：sourceCode="SRM"&&poSourcePlatform="ERP"
              const erpFlag = record.sourceCode === "SRM" && record.poSourcePlatform === "ERP";
              // 电商申请转订单：sourceCode="SAP"&&poSourcePlatform="E-COMMERCE"
              const sapFlag = record.sourceCode === "SAP" && record.poSourcePlatform === "E-COMMERCE";
              if (!erpFlag && !sapFlag) {
                return Number(record.uomPrecision);
              }
              return null;
            }
            return null;
          }
        },
        {
          fieldName: getDynamicLabel(this.isDoubleUnit, "quantity"),
          fieldCode: "quantity",
          fieldType: "INPUT_NUMBER",
          validator:(val) => maxValiDatorForTen(val),
          inputChange: (val, item) => this.lineQuantityChange(val, item, "quantity"),
          editor: (val, record) => {
            if (!this.isDoubleUnit || record.quantityEditFlag === 1) {
              return true;
            }
            return false;
          },
          required:(val, record) => {
            if (record.quantityEditFlag === 1) {
              return true;
            }
            return false;
          },
          editLimit:(val, record) => {
            if (!this.isDoubleUnit && record.quantityEditFlag === 1) {
              return true;
            }
            return false;
          },
          precision: (val, record) => {
            if (record.quantityEditFlag === 1) {
              // erp订单及电商申请转订单不做精度控制
              // erp订单：sourceCode="SRM"&&poSourcePlatform="ERP"
              const erpFlag = record.sourceCode === "SRM" && record.poSourcePlatform === "ERP";
              // 电商申请转订单：sourceCode="SAP"&&poSourcePlatform="E-COMMERCE"
              const sapFlag = record.sourceCode === "SAP" && record.poSourcePlatform === "E-COMMERCE";
              if (!erpFlag && !sapFlag) {
                return Number(record.uomPrecision);
              }
              return null;
            }
            return null;
          }
        },
        {
          fieldName: this.$T("hipspfm.receivedOrder.model.receivedOrder.unitPrice").$D("单价"),
          fieldType: "INPUT_NUMBER",
          fieldCode: "enteredTaxIncludedPrice",
          editor: false,
        },
        {
          fieldName: this.$T("sodr.receivedOrder.model.receivedOrder.needByDate").$D("需求日期"),
          fieldCode: "needByDate",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters.CalcDate(val)
        },
        {
          fieldName: this.$T("sodr.receivedOrder.model.receivedOrder.committedDeliveryDate").$D("承诺交货日期"),
          fieldType: "DATE_PICKER",
          fieldCode: "promiseDeliveryDate",
          disabled:(val, record) => {
            if (record.deliveryDateEditFlag === 1) {
              return false;
            } else if (record.deliveryDateEditFlag === 0) {
              return true;
            }
            return true;
          },
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters.CalcDate(val)
        }
      ];
      return columns;
    },
    // 收货收单信息
    getGoodsAndOrdersInfoColumns() {
      const columns = [
        {
          fieldName: this.$T("hipspfm.receivedOrder.model.receivedOrder.receiverContactName").$D("收货联系人"),
          fieldCode: "shipToLocContName",
        },
        {
          fieldName: this.$T("hipspfm.receivedOrder.model.receivedOrder.receiverTelNum").$D("收货联系电话"),
          fieldCode: "shipToLocTelNum",
        },
        {
          fieldName: this.$T("hipspfm.receivedOrder.model.receivedOrder.shippingAddress").$D("收货地址"),
          fieldCode: "shipToLocationAddress",
        },
        {
          fieldName: this.$T("hipspfm.receivedOrder.model.receivedOrder.invoiceContactName").$D("收单联系人"),
          fieldCode: "billToLocContName",
        },
        {
          fieldName: this.$T("hipspfm.receivedOrder.model.receivedOrder.invoiceTelNum").$D("收单联系电话"),
          fieldCode: "billToLocTelNum",
        },
        {
          fieldName: this.$T("hipspfm.receivedOrder.model.receivedOrder.receiverEmail").$D("收单邮箱"),
          fieldCode: "receiverEmailAddress",
        },
        {
          fieldName: this.$T("hipspfm.receivedOrder.model.receivedOrder.acquiringAddress").$D("收单地址"),
          fieldCode: "billToLocationAddress",
        },
      ];
      return columns;
    },
    // 开票信息
    getBillInfoColumns() {
      const columns = [
        {
          fieldName: this.$T("hipspfm.receivedOrder.model.receivedOrder.invoiceCompanyName").$D("开票公司名称"),
          fieldCode: "invoiceTitle",
        },
        {
          fieldName: this.$T("hipspfm.receivedOrder.model.receivedOrder.taxRegisterNum").$D("税号"),
          fieldCode: "taxRegisterNum",
        },
        {
          fieldName: this.$T("hipspfm.receivedOrder.model.receivedOrder.invoiceType").$D("发票类型"),
          fieldCode: "invoiceTitleTypeName",
        },
        {
          fieldName: this.$T("hipspfm.receivedOrder.model.receivedOrder.invoiceMethod").$D("开票方式"),
          fieldCode: "invoiceMethodName",
        },
        {
          fieldName: this.$T("hipspfm.receivedOrder.model.receivedOrder.invoiceTitleTypeMeaning").$D("发票形式"),
          fieldCode: "invoiceTypeName",
        },
        {
          fieldName: this.$T("hipspfm.receivedOrder.model.receivedOrder.invoiceDetail").$D("发票明细"),
          fieldCode: "invoiceDetailTypeName",
        }
      ];
      return columns;
    },
    // 验收标准
    getAcceptaBilityCriteriaInfoColumns() {
      const columns = [
        {
          fieldName: this.$T("sodr.common.model.operatingPeriod").$D("经营期"),
          fieldCode: "operatingPeriod",
        },
        {
          fieldName: this.$T("sodr.common.model.handleVine").$D("柄(藤)"),
          fieldCode: "handleVine",
        },
        {
          fieldName: this.$T("sodr.common.model.mainOrigin").$D("主要产地"),
          fieldCode: "mainOrigin",
        },
        {
          fieldName: this.$T("sodr.common.model.smell").$D("气味"),
          fieldCode: "smell",
        },
        {
          fieldName: this.$T("sodr.common.model.shape").$D("外形"),
          fieldCode: "shape",
        },
        {
          fieldName: this.$T("sodr.common.model.gloss").$D("光泽度"),
          fieldCode: "gloss",
        },
        {
          fieldName: this.$T("sodr.common.model.packingMethod").$D("包装方式"),
          fieldCode: "packingMethod",
        },
        {
          fieldName: this.$T("sodr.common.model.color").$D("颜色"),
          fieldCode: "color",
        },
        {
          fieldName: this.$T("sodr.common.model.tenderOrTough").$D("老嫩"),
          fieldCode: "tenderOrTough",
        },
        {
          fieldName: this.$T("sodr.common.model.productSpecifications").$D("商品规格"),
          fieldCode: "productSpecifications",
        },
        {
          fieldName: this.$T("sodr.common.model.hardness").$D("硬度"),
          fieldCode: "hardness",
        },
        {
          fieldName: this.$T("sodr.common.model.stackingConditions").$D("堆放条件"),
          fieldCode: "stackingConditions",
        },
        {
          fieldName: this.$T("sodr.common.model.storageConditions").$D("储存条件"),
          fieldCode: "storageConditions",
        },
        {
          fieldName: this.$T("sodr.common.model.baselineDefectRateFrom").$D("基准残次率从"),
          fieldCode: "baselineDefectRateFrom",
        },
        {
          fieldName: this.$T("sodr.common.model.baselineDefectRateTo").$D("基准残次率至"),
          fieldCode: "baselineDefectRateTo",
        },
        {
          fieldName: this.$T("sodr.common.model.otherSubstandardFeatures").$D("其他未达标特征"),
          fieldCode: "otherSubstandardFeatures",
        },
        {
          fieldName: this.$T("sodr.common.model.numberOfSamples").$D("抽检件数"),
          fieldCode: "numberOfSamples",
        },
        {
          fieldName: this.$T("sodr.common.model.receivingStandardDescription").$D("收货标准文描"),
          fieldCode: "receivingStandardDescription",
        },
      ];
      return columns;
    },
    // 送货单行详细信息
    getOrderLineDetailInfoColumns() {
      const isBJGD = SrmUtil.getTenantNum() === "SRM-BJHL";
      const isSANJIANG = SrmUtil.getTenantNum() === "SRM-SANJIANG";
      const columns = [
        {
          fieldName: this.$T("sodr.receivedOrder.model.receivedOrder.lineNum").$D("行号"),
          fieldCode: "lineNum",
        },
        {
          fieldName: this.$T("sodr.receivedOrder.model.receivedOrder.shipmentNum").$D("发运号"),
          fieldCode: "displayLineLocationNum",
        },
        {
          fieldName: this.$T("sodr.receivedOrder.model.receivedOrder.itemCode").$D("物料编码"),
          fieldCode: "itemCode",
        },
        {
          fieldName: this.$T("sodr.receivedOrder.model.receivedOrder.itemDescription").$D("物料名称"),
          fieldCode: "itemName",
        },
        this.isDoubleUnit && {
          fieldName: this.$T("sodr.receivedOrder.model.receivedOrder.uomName").$D("单位"),
          fieldCode: "secondaryUomCodeAndName",
        },
        this.isDoubleUnit && {
          fieldName: this.$T("sodr.receivedOrder.model.receivedOrder.quantity").$D("数量"),
          fieldCode: "secondaryQuantity",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: getDynamicLabel(this.isDoubleUnit, "uom"),
          fieldCode: "uomCodeAndName",
        },
        {
          fieldName: getDynamicLabel(this.isDoubleUnit, "quantity"),
          fieldCode: "quantity",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: this.$T("sodr.receivedOrder.model.receivedOrder.taxRate").$D("税率"),
          fieldCode: "taxRate",
        },
        {
          fieldName: this.$T("sodr.receivedOrder.model.receivedOrder.taxedEnteredUnitPrice").$D("原币含税单价"),
          fieldType: "INPUT_NUMBER",
          fieldCode: "enteredTaxIncludedPrice",
          editor: false,
        },
        {
          fieldName: this.$T("sodr.receivedOrder.model.receivedOrder.taxedLineAmount").$D("含税行金额"),
          fieldType: "INPUT_NUMBER",
          fieldCode: "taxIncludedLineAmount",
          editor: false,
          precision: (val, record) => {
            // erp订单及电商申请转订单不做精度控制
            // erp订单：sourceCode="SRM"&&poSourcePlatform="ERP"
            const erpFlag = record.sourceCode === "SRM" && record.poSourcePlatform === "ERP";
            // 电商申请转订单：sourceCode="SAP"&&poSourcePlatform="E-COMMERCE"
            const sapFlag = record.sourceCode === "SAP" && record.poSourcePlatform === "E-COMMERCE";
            if (!erpFlag && !sapFlag) {
              return Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision"));
            }
          },
        },
        {
          fieldName: this.$T("sodr.receivedOrder.model.receivedOrder.needByDate").$D("需求日期"),
          fieldCode: "needByDate",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters.CalcDate(val)
        },
        {
          fieldName: this.$T("sodr.receivedOrder.model.receivedOrder.committedDeliveryDate").$D("承诺交货日期"),
          fieldCode: "promiseDeliveryDate",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters.CalcDate(val)
        },
        isBJGD && {
          fieldName: this.$T("spuc.common.model.common.bjhlpolineexportdto.attributeVarchar1").$D("年级"),
          fieldCode: "attributeVarchar1Meaning",
        },
        isBJGD && {
          fieldName: this.$T("spuc.common.model.common.bjhlpolineexportdto.attributeVarchar2").$D("学科"),
          fieldCode: "attributeVarchar2Meaning",
        },
        isBJGD && {
          fieldName: this.$T("spuc.common.model.common.bjhlpolineexportdto.attributeVarchar3").$D("课程类别"),
          fieldCode: "attributeVarchar3Meaning",
        },
        isBJGD && {
          fieldName: this.$T("spuc.common.model.common.bjhlpolineexportdto.attributeVarchar4").$D("总页码"),
          fieldCode: "attributeVarchar4",
        },
        isBJGD && {
          fieldName: this.$T("spuc.common.model.common.bjhlpolineexportdto.attributeVarchar5").$D("封面用纸"),
          fieldCode: "attributeVarchar5",
        },
        isBJGD && {
          fieldName: this.$T("spuc.common.model.common.bjhlpolineexportdto.attributeVarchar6").$D("封面印色"),
          fieldCode: "attributeVarchar6Meaning",
        },
        isBJGD && {
          fieldName: this.$T("spuc.common.model.common.bjhlpolineexportdto.attributeVarchar7").$D("内文用纸"),
          fieldCode: "attributeVarchar7",
        },
        isBJGD && {
          fieldName: this.$T("spuc.common.model.common.bjhlpolineexportdto.attributeVarchar8").$D("内文印色"),
          fieldCode: "attributeVarchar8Meaning",
        },
        isBJGD && {
          fieldName: this.$T("spuc.common.model.common.bjhlpolineexportdto.attributeVarchar9").$D("规格尺寸"),
          fieldCode: "attributeVarchar9",
        },
        isBJGD && {
          fieldName: this.$T("spuc.common.model.common.bjhlpolineexportdto.attributeVarchar10").$D("装订方式"),
          fieldCode: "attributeVarchar10Meaning",
        },
        isBJGD && {
          fieldName: this.$T("spuc.common.model.common.bjhlpolineexportdto.attributeVarchar11").$D("工艺"),
          fieldCode: "attributeVarchar11",
        },
        {
          fieldName: this.$T("sodr.receivedOrder.model.receivedOrder.purchaserComments").$D("采购方行备注"),
          fieldCode: "remark",
        },
        {
          fieldName: this.$T("sodr.receivedOrder.model.receivedOrder.feedbacks").$D("反馈信息"),
          fieldCode: "feedback",
        },
        isSANJIANG && {
          fieldName: this.$T("sodr.receivedOrder.model.receivedOrder.specifications").$D("规格"),
          fieldCode: "specifications",
        },
        isSANJIANG && {
          fieldName: this.$T("sodr.common.model.outputCapacity").$D("产成率"),
          fieldCode: "attributeVarchar5",
        },
        isSANJIANG && {
          fieldName: this.$T("sodr.common.model.commission").$D("代办"),
          fieldCode: "attributeVarchar19",
        },
        isSANJIANG && {
          fieldName: this.$T("sodr.common.model.acceptabilityCriteria").$D("验收标准"),
          fieldCode: "itemId",
          render:() => <span>{this.$T("sodr.common.model.clickToView").$D("点击查看")}</span>,
          callBack:(record) => {
            this.checkAcceptabilityCriteriaAction(record.itemId);
          }
        },
      ];

      return columns;
    },
  },
  async mounted() {
    this.$loading.show();
    const {
      orgName,
      poHeaderId,
      unreadCount,
      displayPoNum
    } = this.$route.query;
    this.orgName = orgName;
    this.displayPoNum = displayPoNum;
    this.poHeaderId = poHeaderId;
    this.unreadCount = unreadCount;
    this.userInfo = SrmUtil.getUserInfo();
    await this.queryDoubleUomConfig();
    await this.getOrderHeader();
    await this.getOrderLine();
    await this.getOperationRecords();
    this.$loading.hide();
    //当前页面分享埋点
    if (parent.srmShare) {
      parent.srmShare({
        linkCode: "MY_RECEIVE_ORDER_DETAIL",
        innerFlag: 0,
        data: { orgName:orgName, poHeaderId:poHeaderId, unreadCount:unreadCount ? unreadCount : 0, displayPoNum:displayPoNum, tenantId:SrmUtil.getTenantId() }
      });
    }
  },
  methods: {
    //收货二维码显示
    showQrCode() {
      this.$router.push({ name:"MyReceiveOrderQrCode", query:{ poHeaderId: this.poHeaderId } });
    },
    //留言板显示
    showBoardPop() {
      this.boardPop = !this.boardPop;
      this.unreadCount = 0;
    },
    //验收标准显示
    checkAcceptabilityCriteriaAction(lineItemId) {
      this.acceptabilityCriteriaInfo = {};
      this.acceptabilityShow = true;
      getAcceptabilityCriteria(lineItemId).then((res = {}) => {
        this.acceptabilityCriteriaInfo = res;
      });
    },
    //操作记录显示
    showOperationPop() {
      this.operationPopup = !this.operationPopup;
    },
    // 查看行详情
    showLineDetail(item) {
      this.visible = !this.visible;
      this.currentLineInfo = item;
    },
    //获取订单头信息
    async getOrderHeader() {
      let params = {
        camp: 2,
        customizeUnitCode: "SODR.RECEIVED_ORDER_DETAIL.HEADER,SODR.RECEIVED_ORDER_DETAIL.DELIVERY_CATA",
      }; //1采购方2供应商
      const headInfo = await getOrderHeaderApi(this.poHeaderId, params);
      this.headInfo = headInfo;
      // 错误提示 已发布/订单反馈审核中/订单反馈审核拒绝/已确认/部分反馈
      if (![ "PUBLISHED", "DELIVERY_DATE_REVIEW", "DELIVERY_DATE_REJECT", "CONFIRMED", "PART_FEED_BACK" ].includes(this.headInfo.statusCode)) {
        let f = true;
        // 取消发布且订单头发布标识为1
        if (this.headInfo.statusCode === "PUBLISH_CANCEL" && this.headInfo.releasedFlag === 1) {
          f = false;
        }
        // 已取消且订单头发布标识为1
        if (this.headInfo.statusCode === "CANCELED" && this.headInfo.releasedFlag === 1) {
          f = false;
        }
        // 已关闭且订单头发布标识为1
        if (this.headInfo.statusCode === "CLOSED" && this.headInfo.releasedFlag === 1) {
          f = false;
        }
        // 取消审批中且订单头发布标识为1
        if (this.headInfo.statusCode === "CANCELING" && this.headInfo.releasedFlag === 1) {
          f = false;
        }
        // 关闭审批中且订单头发布标识为1
        if ((this.headInfo.statusCode === "CLOSEING" || this.headInfo.closedFlag === 2) && this.headInfo.releasedFlag === 1) {
          f = false;
        }
        if (f) {
          this.$notification.open({
            message: this.$T("hzero.common.notification.noShow.tips").$D("该单据当前状态不可查看"),
            description: "",
            class: "notification",
          });
          return;
        }
      }
      this.showPage = true;

      const {
        attachmentUuid,
        supplierAttachmentUuid,
      } = headInfo;
      this.purchaserAttachmentUuid = attachmentUuid ? attachmentUuid : uuid();
      this.supplierAttachmentUuid = supplierAttachmentUuid ? supplierAttachmentUuid : uuid();
      if (!supplierAttachmentUuid) {
        const uuParms = {
          uuidType: 2,
          uuid: this.supplierAttachmentUuid,
          poHeaderId: headInfo.poHeaderId
        };
        saveFileUUIDApi(uuParms);
      }
    },
    //获取订单行信息
    getOrderLine() {
      let params = {
        camp: 2, //1采购方2供应商
        page: this.page,
        size: this.size,
        sortType: 5, //排序类型
        customizeUnitCode: "SODR.RECEIVED_ORDER_DETAIL.BASIC,SODR.RECEIVED_ORDER_DETAIL.OTHER"
      };
      if (this.getTenantNum === "SRM-SANJIANG") {
        params.userId = SrmUtil.getUserInfo().id;
        // console.log("三江参数", params);
        getSanjiangOrderLineApi(this.poHeaderId, params).then((res) => {
          if (res) {
            this.lineInfo = res.content;
          }
        });
      } else {
        getOrderLineApi(this.poHeaderId, params).then((res) => {
          if (res) {
            this.lineInfo = res.content;
          }
        });
      }
    },
    // 获取业务规则定义-双单位配置
    async queryDoubleUomConfig() {
      await queryDoubleUomConfigApi().then((res) => {
        if (res) {
          this.isDoubleUnit = Number(res);
        }
      });
    },
    // 获取操作记录
    async getOperationRecords() {
      let params = {
        page: 0,
        size: 0,
      };
      await getOpRecordApi(this.poHeaderId, params).then((res) => {
        // this.operationArr = res.content || [];
        if (res && !res.failed) {
          // 操作记录数据处理
          /**
       * 动作为【新增行/删除行】的操作记录直接隐藏，
       * 动作为【更新】的操作记录需要按单号+时间进行合并（目前是按照对几个字段进行了更新就显示几个更新记录），
       * 动作为【取消中】之后的【拒绝】需要按单号+时间进行合并（目前是有几行就显示了几+1几条记录）
       * 动作为【分配】的操作记录不允许合并
       * 动作为【更新/变更】的操作记录 对字段进行合并记录
       */
          let data = [];
          res.content.map((item) => {
            if (item.processTypeCode === "UPDATE" || item.processTypeCode === "CHANGE" || item.processTypeCode === "ROLLBACK") {
              if (data.findIndex((val) => val.poProcessActionId === item.poProcessActionId) === -1) {
                // 拼接更新的信息
                let updateRecords = [];
                res.content.map((val) => {
                  if (val.poProcessActionId === item.poProcessActionId) {
                    updateRecords.push(val);
                  }
                });
                let processRemarks = updateRecords.map((u) => u.processTypeCode === "UPDATE" && !u.changeFieldNameMeaning ? "" : `\n${u.processUserName ?? ""} ${u.processRemark ? u.processRemark : `${this.$T("sodr.workspace.model.operationRecord.take").$D("将")}【${u.changeFieldNameMeaning ?? ""}】${this.$T("sodr.workspace.model.operationRecord.cause").$D("由")}【${u.priceShieldFlag ? "******" : u.oldValue ?? ""}】${this.$T("sodr.workspace.model.operationRecord.change").$D("改变为")}【${u.priceShieldFlag ? "******" : u.newValue ?? ""}】 ${u.changeTableName === "SODR_PO_HEADER" ? "" : `${this.$T("sodr.workspace.model.common.displayLineNum").$D("行号")}【${u.displayLineNum ?? ""}】`}`}`
                ) || [];
                data.push({ ...item, processRemark: processRemarks.join("\n") });
              }
            } else {
              data.push(item);
            }
          });
          this.operationArr = data.map((e) => {
            e.processTypeMeaning = {
              text: e.processTypeMeaning,
              type: "primary"
            };
            if (e.processTypeCode === "SUBMIT") {
              e.processTypeMeaning.type = "primary";
            } else if (e.processTypeCode === "APV_REJECT") {
              e.processTypeMeaning.type = "danger";
            } else if (e.processTypeCode === "NEW") {
              e.processTypeMeaning.type = "info";
            }
            return e;
          });
        }

      });
    },
    // 根据数量换算基本数量
    async conversionUpdate({
      record,
      clearQuantity = true,
      isDoubleUnit,
    }) {
      const {
        itemId,
        uomId: doublePrimaryUomId,
        secondaryQuantity,
        secondaryUomId
      } = record;
      if (!(itemId && doublePrimaryUomId && secondaryQuantity && secondaryUomId)) {
        return false;
      }
      const itemOrgUom = {
        itemId,
        secondaryUomId,
        secondaryQuantity,
        doublePrimaryUomId,
        businessKey: "-9999"
      };
      this.$loading.show();
      if (isDoubleUnit) {
        try {
          const list = await calculateDoubleUomApi([ itemOrgUom ]);
          if (list?.failed) {
            this.$notification.open({
              message: list?.message,
              description: "",
              // eslint-disable-next-line no-undef
              key,
              class: "notification"
            });
            record.__calculateError__ = true;
            if (clearQuantity) {
              this.$set(record, "quantity", null);
            }
            return Promise.reject();
          }
          if (!isEmpty(list)) {
            const target = list.find(
              (j) => j.businessKey === record.businessKey
            );
            if (target && target.primaryQuantity) {
              this.$set(record, "quantity", target.primaryQuantity);
            }
            // eslint-disable-next-line no-param-reassign
            record.__calculateError__ = false;
          }
          return Promise.resolve(list);
        } catch (error) {
          return Promise.reject(error);
        } finally {
          this.$loading.hide();
        }
      }
    },
    calcAmount: function (item) {
      const isBasicPriceTypeTaxInclude = item.benchmarkPriceType === "TAX_INCLUDED_PRICE";
      if (isBasicPriceTypeTaxInclude) {
        /**
         * 基准价=含税：
         * 不含税单价=不含税金额/数量*每，单价精度=含税单价/(1+税率)，单价精度
         * 含税金额= 含税单价*数量/每，金额精度 1.数量不动，调整含税单价；2.税额、不含税金额、不含税单价联动调整
         * 税额=含税金额/（1+税率）*税率，金额精度 1.含税金额不动，调整不含税金额；2.税额、不含税单价联动调整
         * 不含税金额=含税金额-税额，金额精度 1.含税金额不动，调整税额；2.不含税单价联动调整
         */
        item.taxIncludedLineAmount = SrmMath.div(SrmMath.times(new BigNumber(item.quantity), new BigNumber(item.enteredTaxIncludedPrice)), item.unitPriceBatch && !SrmMath.isZero(item.unitPriceBatch) ? new BigNumber(item.unitPriceBatch) : new BigNumber(1));
        const taxAmount = SrmMath.div(SrmMath.div(SrmMath.times(item.taxIncludedLineAmount, new BigNumber(item.taxRate)), new BigNumber(100.0)), SrmMath.plus(new BigNumber(1), SrmMath.div(new BigNumber(item.taxRate), new BigNumber(100.0))));
        const _lineAmount = SrmMath.div(SrmMath.minus(SrmMath.times(item.taxIncludedLineAmount, new BigNumber(1000)), SrmMath.times(taxAmount, new BigNumber(1000))), new BigNumber(1000));
        item.lineAmount = SrmMath.toFixed(_lineAmount, Number(item.financialPrecision || 10));
      } else {
        /**
         * 基准价=不含税：
         * 含税单价=含税金额/数量*每  1.不含税金额不动，调整税额；2.含税单价联动调整
         * 不含税金额=不含税单价*数量/每  1.数量不动，调整不含税单价； 2.税额、含税金额、含税单价联动调整
         * 税额=不含税金额*税率  1.不含税金额不动，调整含税金额；2.税额、含税单价联动调整
         * 含税金额=不含税金额+税额=不含税单价*(1+税率)，单价精度
         */
        item.lineAmount = SrmMath.div(SrmMath.times(new BigNumber(item.quantity), new BigNumber(item.unitPrice)), item.unitPriceBatch && !SrmMath.isZero(item.unitPriceBatch) ? new BigNumber(item.unitPriceBatch) : new BigNumber(1));
        const taxAmount = SrmMath.div(SrmMath.times(item.lineAmount, new BigNumber(item.taxRate)), new BigNumber(100.0));
        const _taxIncludedLineAmount = SrmMath.plus(SrmMath.times(item.lineAmount, new BigNumber(1000)), SrmMath.div(SrmMath.times(taxAmount, new BigNumber(1000)), new BigNumber(1000)));
        item.taxIncludedLineAmount = SrmMath.toFixed(_taxIncludedLineAmount, Number(item.financialPrecision || 10));
      }
      let taxIncludeAmount = new BigNumber(0);
      taxIncludeAmount = this.lineInfo.reduce((total, cur) => SrmMath.plus(total, new BigNumber(cur.taxIncludedLineAmount)), new BigNumber(0));
      this.$set(this.headInfo, "taxIncludeAmount", taxIncludeAmount);
    },
    //行数据，数量变动触发方法
    lineQuantityChange: debounce(async function(val, item, changeField) {
      if (changeField === "quantity") {
        if (!this.isDoubleUnit && item.quantity && !SrmMath.isZero(item.quantity) && SrmMath.gt(new BigNumber(item.quantity), new BigNumber(item.originalQuantity))) {
          item.quantity = item.originalQuantity;
        }
        if (!this.isDoubleUnit) {
          this.$set(item, "secondaryQuantity", item.quantity);
          item.secondaryQuantity = item.quantity;
        }
      } else if (changeField === "secondaryQuantity" && this.isDoubleUnit) {
        const { itemCode } = item;
        if (item.quantity && !SrmMath.isZero(item.quantity) && SrmMath.gt(new BigNumber(item.quantity), new BigNumber(item.originalQuantity))) {
          item.secondaryQuantity = item.originalQuantity;
        }
        if (itemCode) {
          const result = await this.conversionUpdate({ value:val, record: item, isDoubleUnit: this.isDoubleUnit, clearQuantity: true });
          if (!result) {
            return false;
          }
        } else {
          this.$set(item, "quantity", item.quantity);
          item.quantity = item.secondaryQuantity;
        }
      }
      this.calcAmount(item);
    }, 600),
    //审批处理方法
    handlerPre(type) {
      if (type === "submit") {
        this.handleSubmit();
      }
    },
    // 提交该订单
    handleSubmit() {
      const that = this;
      let f = false;
      this.lineInfo.find((res) => {
        if (!res.quantity) {
          f = true;
        }
      });
      if (f) {
        this.$notification.open({
          message: this.$T("hipspfm.orderApproval.view.message.quaRequired").$D("数量必输"),
          duration: 1000
        });
        return;
      }
      let params = {
        poHeaderDetailDTO: this.headInfo,
        poLineDetailDTOs: this.lineInfo
      };
      this.$dialog({
        content: that.$T("hipspfm.orderApproval.view.message.passOrderOrNot").$D("是否通过该订单") + "?",
        onOk() {
          that.$loading.show();
          submitOrderApi(params).then((res) => {
            if (res && res.failed) {
              that.$notification.open({
                message: res.message,
                duration: 1500
              });
            } else {
              that.$notification.open({
                // eslint-disable-next-line rulesdir/check_modules
                message: that.$T("hipspfm.common.view.validation.sumbitSuccess").$D("提交成功"),
                duration: 1000
              });
              setTimeout(() => {
                that.$router.back();
              }, 1000);
            }
          }).finally(() => {
            that.$loading.hide();
          });
        },
      });
    },
  },
};
</script>

<style lang="stylus" scoped>
.main-info {
  height: 100%;
  overflow-y: auto;
  background: #f6f6f6;
  padding-bottom: 75px;
  padding-bottom: calc(75px + constant(safe-area-inset-bottom));
  padding-bottom: calc(75px + env(safe-area-inset-bottom));
}
</style>
