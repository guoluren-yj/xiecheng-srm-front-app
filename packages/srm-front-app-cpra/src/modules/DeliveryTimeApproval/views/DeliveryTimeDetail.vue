<template>
  <div style="height: 100vh;">
    <div class="main-info">
      <!-- 头信息 -->
      <srm-detail-head :data-source="headInfo" :columns="getDetailHeadColumns">
        <div class="button-right-margin">
          <srm-button size="small" icon="icon-paperclip">
            <srm-upload :is-tab="true" :show-icon="false" :show-count="false" color="blue" :file-arr="fileArr" :desc-title="$T('ssrc.inquiryHall.button.inquiryHall.file').$D('详情附件')" />
          </srm-button>
          <srm-button size="small" type="warn" icon="icon-clock" @click="showOperationPop">
            <span>{{ $T('hipspfm.common.message.title.operationRecord').$D('操作记录') }}</span>
          </srm-button>
          <srm-button size="small" icon="icon-notes" @click="showBoardPop">
            <span>{{ $T('hipspfm.common.message.board').$D('留言板') }}</span>
          </srm-button>
        </div>
      </srm-detail-head>

      <!-- 内容区域 -->
      <srm-scroll-tab class="content">
        <srm-scroll-tab-item :label="$T('hipspfm.common.view.message.title.orderHeaderInfo').$D('订单头信息')" >
          <customize :need-padding="true" code="SMBL.DELIVERY_TIME.HEADER_INFO" :data-source="headInfo" :columns="getOrderHeadInfoColumns" />
        </srm-scroll-tab-item>
        <srm-scroll-tab-item :label="$T('hipspfm.orderConfirmation.view.message.title.orderLineInfo').$D('行信息')" >
          <div v-for="(item, index) in lineInfo" :key="index" @click="showLineDetail(item)">
            <customize :need-padding="true" code="SMBL.DELIVERY_TIME.LINE_INFO" :data-source="item" :columns="getOrderLineInfoColumns" />
          </div>
        </srm-scroll-tab-item>
      </srm-scroll-tab>
    </div>

    <!-- 行信息弹窗 -->
    <srm-popup :visible.sync="visible" height="100%" position="right" :title="$T('hipspfm.orderConfirmation.view.message.title.orderDetail').$D('订单详情')">
      <div style="height: 100%; overflow: auto;">
        <customize-detail :need-padding="true" code="SMBL.DELIVERY_TIME.LINE_INFO_DETAIL" :data-source="currentLineInfo" :columns="getOrderLineDetailInfoColumns" />
      </div>
    </srm-popup>
    <srm-bottom-handler :btn-arr="getBtnArr" />

    <!-- 历史记录弹窗 -->
    <history-record
      v-model="operationPopup"
      :remark-label="$T('smbl.common.view.title.operationRemark').$D('操作说明')"

      :action-data="operationArr"
      operator-field-name="processUserName"
      process-remark-field-name="processRemark"
      operation-meaning-field-name="processTypeMeaning"
      process-date-field-name="processedDate"/>

    <!-- 留言板弹窗 -->
    <message-board v-if="poHeaderId" v-model="boardPop" :po-header-id="poHeaderId" user-camp-code="PURCHASE" />
  </div>
</template>

<script>
import HistoryRecord from "@/components/HistoryRecord";
import MessageBoard from "@/components/MessageBoard/MessageBoard";
import { getDynamicLabel } from "../../../utils";
import uuid from "uuid";
import {
  queryDoubleUomConfigApi,
  getOrderHeaderApi,
  getOrderLineApi,
  getOpRecordApi,
  someAdoptApi,
  someRejectApi } from "../api/index";
import BigNumber from "bignumber.js";
import { SrmMath, SrmUtil } from "srm-mobile-ui";

export default {
  modules: [ "smbl.common", "sodr.sendOrder", "sodr.common", "hipspfm.common", "sodr.deliveryDateReview", "spuc.common", "hzero.common", "sodr.confirmOrder", "ssrc.inquiryHall", "hipspfm.orderConfirmation", "smbl.common", "sprm.common", "sodr.workspace", "sinv.receiptWorkbench", "sinv.receiptExecution", "sinv.receipWorkbench" ],
  name: "DeliveryBillDetail",
  components: {
    HistoryRecord,
    MessageBoard,
  },
  data() {
    return {
      orgName:"",
      poHeaderId:"",
      operationArr: [], // 操作记录
      headInfo: {}, //头信息
      lineInfo: [], //行信息
      operationPopup: false, //操作记录弹窗标识
      visible: false, //行信息弹窗
      currentLineInfo: {}, //当前行信息
      boardPop: false,
      purchaserAttachmentUuid:"", //采购方附件uuid
      supplierAttachmentUuid:"", //供应商附件uuid
      isDoubleUnit: false,
    };
  },
  computed: {
    fileArr() {
      if (!Object.keys(this.headInfo).length) {
        return [];
      }

      return [
        { title: this.$T("sodr.sendOrder.model.sendOrder.purchaserAttachment").$D("采购方附件"), attachmentUuid: this.purchaserAttachmentUuid, readOnly: false },
        { title: this.$T("sodr.sendOrder.model.sendOrder.supplierAttachment").$D("供应商附件"), attachmentUuid: this.supplierAttachmentUuid, readOnly: true },
      ];
    },
    isMallOrder() {
      return this.headInfo.asnTypeCode === "E_COMMERCE_DELIVERY_LIST";
    },
    isSanJiang() {
      return SrmUtil.getTenantNum() === "SRM-SANJIANG";
    },
    // 详情头
    getDetailHeadColumns() {
      const columns = [
        {
          fieldCode: "displayPoNum",
        },
        {
          fieldName: this.$T("sodr.common.model.common.totalAmountIncludingTax").$D("含税总金额"),
          fieldCode: "taxIncludeAmount",
          render:(val, record) => {
            // erp订单及电商申请转订单不做精度控制
            // erp订单：sourceCode="SRM"&&poSourcePlatform="ERP"
            const erpFlag = record.sourceCode === "SRM" && record.poSourcePlatform === "ERP";
            // 电商申请转订单：sourceCode="SAP"&&poSourcePlatform="E-COMMERCE"
            const sapFlag = record.sourceCode === "SAP" && record.poSourcePlatform === "E-COMMERCE";
            const length = this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision");
            if (!erpFlag && !sapFlag) {
              return String(record.currencyCode) + " " + this.$options.filters.calcMultipleDelimiter(new BigNumber(val), length);
              // const currentTaxIncludeAmount = this.$options.filters.calcMultipleDelimiter(val,length);
              // return <span class="srm-money-sign">{ record.currencyCode + " " }</span>
              //         <span class="srm-money">{ currentTaxIncludeAmount }</span>;
            }
            return val;
          }
        },
        {
          fieldName: this.$T("sodr.common.model.common.latestVersionNum").$D("版本号"),
          fieldCode: "versionNum",
        },
      ];

      return columns;
    },
    // 订单头信息
    getOrderHeadInfoColumns() {
      const columns = [
        {
          fieldName: this.$T("hipspfm.common.message.company").$D("公司"),
          fieldType: "TEXT",
          fieldCode: "companyName",
        },
        {
          fieldName: this.$T("sodr.deliveryDateReview.model.deliveryDateReview.orgName").$D("业务实体"),
          fieldType: "TEXT",
          fieldCode: "ouName",
        },
        {
          fieldName: this.$T("sodr.deliveryDateReview.model.common.supplierId").$D("供应商"),
          fieldType: "TEXT",
          fieldCode: "supplierName",
        },
        {
          fieldName: this.$T("sodr.deliveryDateReview.model.deliveryDateReview.poTypeCode").$D("订单类型"),
          fieldType: "TEXT",
          fieldCode: "poTypeDesc",
        },
        {
          fieldName: this.$T("sodr.deliveryDateReview.model.deliveryDateReview.purOrganizationName").$D("采购组织"),
          fieldType: "TEXT",
          fieldCode: "purchaseOrgName",
        },
        {
          fieldName: this.$T("sodr.deliveryDateReview.model.deliveryDateReview.agentName").$D("采购员"),
          fieldType: "TEXT",
          fieldCode: "agentName",
        },
        {
          fieldName: this.$T("sodr.sendOrder.model.common.releaseTime").$D("发布时间"),
          fieldType: "TEXT",
          fieldCode: "releasedDate",
        },
        {
          fieldName: this.$T("sodr.sendOrder.model.common.supplierSite").$D("供应商地址"),
          fieldType: "TEXT",
          fieldCode: "supplierSiteName",
        },
        {
          fieldName: this.$T("sodr.deliveryDateReview.model.common.receiverAddressName").$D("收货方地址"),
          fieldType: "TEXT",
          fieldCode: "shipToLocationAddress",
        },
        {
          fieldName: this.$T("sodr.deliveryDateReview.model.common.billToLocationAddress").$D("收单方地址"),
          fieldType: "TEXT",
          fieldCode: "billToLocationAddress",
        },
        {
          fieldName: this.$T("sodr.deliveryDateReview.model.common.termsName").$D("付款条款"),
          fieldType: "TEXT",
          fieldCode: "termsName",
        },
        {
          fieldName: this.$T("sodr.deliveryDateReview.model.deliveryDateReview.comments").$D("订单摘要"),
          fieldType: "TEXT",
          fieldCode: "remark",
        },
      ];
      return columns;
    },
    // 订单行信息
    getOrderLineInfoColumns() {
      const columns = [
        {
          formRow: 0,
          fieldCode: "itemName",
          fieldType: "EMPTY",
          render: (val, item) => <SrmListHeader>
            <span>{item.itemName}</span>
            <span slot="right">{ this.$T("sodr.deliveryDateReview.model.deliveryDateReview.lineNum").$D("行号") }：{item.displayLineNum}</span>
          </SrmListHeader>
        },
        {
          fieldName: this.$T("sodr.deliveryDateReview.model.common.originalQuantity").$D("原需求数量"),
          fieldType: "INPUT_NUMBER",
          fieldCode: "originalQuantity",
          editor: false,
        },
        {
          fieldName: this.$T("sodr.deliveryDateReview.model.deliveryDateReview.shipmentNum").$D("发运号"),
          fieldType: "TEXT",
          fieldCode: "displayLineLocationNum",
        },
        {
          fieldName: this.$T("sodr.common.model.common.enteredTaxIncludedPrice").$D("含税单价"),
          fieldType: "INPUT_NUMBER",
          fieldCode: "enteredTaxIncludedPrice",
          editor: false,
        },
        {
          fieldName: this.$T("sodr.deliveryDateReview.model.common.needByDate").$D("需求日期"),
          fieldType: "TEXT",
          fieldCode: "needByDate",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters.CalcDate(val)
        },
        {
          fieldName: this.$T("sodr.deliveryDateReview.model.common.promiseDeliveryDate").$D("承诺交货日期"),
          fieldCode: "promiseDeliveryDate",
          fieldType: "TEXT",
          render: (val, record) => {
            if (record.needByDate !== record.promiseDeliveryDate) {
              // eslint-disable-next-line new-cap
              return <span style="color: red">{ this.$options.filters.CalcDate(val) }</span>;
            }
            // eslint-disable-next-line new-cap
            return this.$options.filters.CalcDate(val);
          }
        },
        // {
        //   fieldName: "数量",
        //   fieldCode: "quantity",
        //   langCode: "sodr.deliveryDateReview.model.deliveryDateReview.quantity",
        //   fieldType: "INPUT_NUMBER",
        //   editor: false,
        // },
        this.isDoubleUnit && {
          fieldCode: "secondaryQuantity",
          fieldName: this.$T("sodr.common.model.common.newQuantity").$D("数量"),
          render:(val, record) => {
            // erp订单及电商申请转订单不做精度控制
            // erp订单：sourceCode="SRM"&&poSourcePlatform="ERP"
            const erpFlag = record.sourceCode === "SRM" && record.poSourcePlatform === "ERP";
            // 电商申请转订单：sourceCode="SAP"&&poSourcePlatform="E-COMMERCE"
            const sapFlag = record.sourceCode === "SAP" && record.poSourcePlatform === "E-COMMERCE";
            if (!SrmMath.isZero(SrmMath.minus(new BigNumber(val), new BigNumber(record.originalQuantity)))) {
              if (!erpFlag && !sapFlag) {
                return <span style="color: red">{ this.$options.filters.calcMultipleDelimiter(val) }</span>;
              }
              return <span style="color: red">{ val }</span>;
            }
            if (!erpFlag && !sapFlag) {
              return this.$options.filters.calcMultipleDelimiter(new BigNumber(val));
            }
            return val;
          }
        },
        {
          fieldName: getDynamicLabel(this.isDoubleUnit, "quantity"),
          // fieldName: this.$T("sodr.deliveryDateReview.model.deliveryDateReview.quantity").$D("数量"),
          fieldCode: "quantity",
          render:(val, record) => {
            // erp订单及电商申请转订单不做精度控制
            // erp订单：sourceCode="SRM"&&poSourcePlatform="ERP"
            const erpFlag = record.sourceCode === "SRM" && record.poSourcePlatform === "ERP";
            // 电商申请转订单：sourceCode="SAP"&&poSourcePlatform="E-COMMERCE"
            const sapFlag = record.sourceCode === "SAP" && record.poSourcePlatform === "E-COMMERCE";
            if (!SrmMath.isZero(SrmMath.minus(new BigNumber(val), new BigNumber(record.originalQuantity))) && !this.isDoubleUnit) {
              if (!erpFlag && !sapFlag) {
                return <span style="color: red">{ this.$options.filters.calcMultipleDelimiter(val) }</span>;
              }
              return <span style="color: red">{ val }</span>;
            }
            if (!erpFlag && !sapFlag) {
              return this.$options.filters.calcMultipleDelimiter(new BigNumber(val));
            }
            return val;
          }
        },
      ];
      return columns;
    },
    // 送货单行详细信息
    getOrderLineDetailInfoColumns() {
      const isBJHL = SrmUtil.getTenantNum() === "SRM-BJHL";
      const columns = [
        {
          fieldName: this.$T("sodr.deliveryDateReview.model.deliveryDateReview.lineNum").$D("行号"),
          fieldCode: "displayLineNum",
        },
        {
          fieldName: this.$T("sodr.deliveryDateReview.model.deliveryDateReview.shipmentNum").$D("发运号"),
          fieldCode: "displayLineLocationNum",
        },
        {
          fieldName: this.$T("sodr.deliveryDateReview.model.common.code").$D("物料编码"),
          fieldCode: "itemCode",
        },
        {
          fieldName: this.$T("sodr.deliveryDateReview.model.common.description").$D("物料名称"),
          fieldCode: "itemName",
        },
        // {
        //   fieldName: "数量",
        //   fieldCode: "quantity",
        //   langCode: "sodr.deliveryDateReview.model.deliveryDateReview.quantity",
        //   fieldType: "INPUT_NUMBER",
        //   editor: false,
        // },
        this.isDoubleUnit && {
          fieldCode: "secondaryQuantity",
          fieldName: this.$T("sodr.common.model.common.newQuantity").$D("数量"),
          render:(val, record) => {
            // erp订单及电商申请转订单不做精度控制
            // erp订单：sourceCode="SRM"&&poSourcePlatform="ERP"
            const erpFlag = record.sourceCode === "SRM" && record.poSourcePlatform === "ERP";
            // 电商申请转订单：sourceCode="SAP"&&poSourcePlatform="E-COMMERCE"
            const sapFlag = record.sourceCode === "SAP" && record.poSourcePlatform === "E-COMMERCE";
            if (!SrmMath.isZero(SrmMath.minus(new BigNumber(val), new BigNumber(record.originalQuantity)))) {
              if (!erpFlag && !sapFlag) {
                return <span style="color: red">{ this.$options.filters.calcMultipleDelimiter(val) }</span>;
              }
              return <span style="color: red">{ val }</span>;
            }
            if (!erpFlag && !sapFlag) {
              return this.$options.filters.calcMultipleDelimiter(new BigNumber(val));
            }
            return val;
          }
        },
        {
          fieldName: this.$T("sodr.deliveryDateReview.model.deliveryDateReview.quantity").$D("数量"),
          fieldCode: "quantity",
          render:(val, record) => {
            // erp订单及电商申请转订单不做精度控制
            // erp订单：sourceCode="SRM"&&poSourcePlatform="ERP"
            const erpFlag = record.sourceCode === "SRM" && record.poSourcePlatform === "ERP";
            // 电商申请转订单：sourceCode="SAP"&&poSourcePlatform="E-COMMERCE"
            const sapFlag = record.sourceCode === "SAP" && record.poSourcePlatform === "E-COMMERCE";
            if (!SrmMath.isZero(SrmMath.minus(new BigNumber(val), new BigNumber(record.originalQuantity))) && !this.isDoubleUnit) {
              if (!erpFlag && !sapFlag) {
                return <span style="color: red">{ this.$options.filters.calcMultipleDelimiter(val) }</span>;
              }
              return <span style="color: red">{ val }</span>;
            }
            if (!erpFlag && !sapFlag) {
              return this.$options.filters.calcMultipleDelimiter(new BigNumber(val));
            }
            return val;
          }
        },
        {
          fieldName: this.$T("sodr.deliveryDateReview.model.common.originalQuantity").$D("原需求数量"),
          fieldType: "INPUT_NUMBER",
          fieldCode: "originalQuantity",
          editor: false,
        },
        this.isDoubleUnit && {
          fieldName: this.$T("sodr.common.model.common.uomCodeAndName").$D("单位"),
          fieldCode: "secondaryUomCodeAndName",
        },
        {
          fieldName: getDynamicLabel(this.isDoubleUnit, "uom"),
          // fieldName: this.$T("sodr.deliveryDateReview.model.common.unit").$D("单位"),
          fieldCode: "uomCodeAndName",
        },
        {
          fieldName: this.$T("sodr.deliveryDateReview.model.deliveryDateReview.taxedEnteredUnitPrice").$D("原币含税单价"),
          fieldType: "INPUT_NUMBER",
          fieldCode: "enteredTaxIncludedPrice",
          editor: false,
        },
        {
          fieldName: this.$T("sodr.deliveryDateReview.model.deliveryDateReview.needByDate").$D("需求日期"),
          fieldCode: "needByDate",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters.CalcDate(val)
        },
        {
          fieldName: this.$T("sodr.deliveryDateReview.model.deliveryDateReview.committedDeliveryDate").$D("承诺交货日期"),
          fieldCode: "promiseDeliveryDate",
          fieldType: "TEXT",
          render: (val, record) => {
            if (record.needByDate !== record.promiseDeliveryDate) {
              // eslint-disable-next-line new-cap
              return <span style="color: red">{ this.$options.filters.CalcDate(val) }</span>;
            }
            // eslint-disable-next-line new-cap
            return this.$options.filters.CalcDate(val);
          }
        },
        isBJHL && {
          fieldName: this.$T("spuc.common.model.common.bjhlpolineexportdto.attributeVarchar1").$D("年级"),
          fieldCode: "attributeVarchar1Meaning",
        },
        isBJHL && {
          fieldName: this.$T("spuc.common.model.common.bjhlpolineexportdto.attributeVarchar2").$D("学科"),
          fieldCode: "attributeVarchar2Meaning",
        },
        isBJHL && {
          fieldName: this.$T("spuc.common.model.common.bjhlpolineexportdto.attributeVarchar3").$D("课程类别"),
          fieldCode: "attributeVarchar3Meaning",
        },
        isBJHL && {
          fieldName: this.$T("spuc.common.model.common.bjhlpolineexportdto.attributeVarchar4").$D("总页码"),
          fieldCode: "attributeVarchar4",
        },
        isBJHL && {
          fieldName: this.$T("spuc.common.model.common.bjhlpolineexportdto.attributeVarchar5").$D("封面用纸"),
          fieldCode: "attributeVarchar5",
        },
        isBJHL && {
          fieldName: this.$T("spuc.common.model.common.bjhlpolineexportdto.attributeVarchar6").$D("封面印色"),
          fieldCode: "attributeVarchar6Meaning",
        },
        isBJHL && {
          fieldName: this.$T("spuc.common.model.common.bjhlpolineexportdto.attributeVarchar7").$D("内文用纸"),
          fieldCode: "attributeVarchar7",
        },
        isBJHL && {
          fieldName: this.$T("spuc.common.model.common.bjhlpolineexportdto.attributeVarchar8").$D("内文印色"),
          fieldCode: "attributeVarchar8Meaning",
        },
        isBJHL && {
          fieldName: this.$T("spuc.common.model.common.bjhlpolineexportdto.attributeVarchar9").$D("规格尺寸"),
          fieldCode: "attributeVarchar9",
        },
        isBJHL && {
          fieldName: this.$T("spuc.common.model.common.bjhlpolineexportdto.attributeVarchar10").$D("装订方式"),
          fieldCode: "attributeVarchar10Meaning",
        },
        isBJHL && {
          fieldName: this.$T("spuc.common.model.common.bjhlpolineexportdto.attributeVarchar11").$D("工艺"),
          fieldCode: "attributeVarchar11",
        },
        {
          fieldName: this.$T("sodr.deliveryDateReview.model.common.taxedLinePrice").$D("含税行金额"),
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
          fieldName: this.$T("sodr.deliveryDateReview.model.common.lineAmount").$D("不含税行金额"),
          fieldType: "INPUT_NUMBER",
          fieldCode: "lineAmount",
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
          fieldName: this.$T("sodr.common.model.common.taxrate").$D("税率(%)"),
          fieldCode: "taxRate",
          render:(val) => val ? val : "0"
        },
        {
          fieldName: this.$T("sodr.deliveryDateReview.model.common.purchaserRemark").$D("采购方行备注"),
          fieldCode: "remark",
        },
      ];

      return columns;
    },
    // 按钮
    getBtnArr() {
      return [
        {
          type: "danger",
          title: this.$T("sodr.deliveryDateReview.view.button.sendBack").$D("退回"),
          handler: () => this.handlerPre("reject")
        },
        {
          title: this.$T("sodr.deliveryDateReview.view.button.agree").$D("同意"),
          handler: () => this.handlerPre("confirm"),
        },
      ];
    },
    getTenantNum() {
      return SrmUtil.getTenantNum();
    }
  },
  async mounted() {
    const { orgName, poHeaderId, unreadCount } = this.$route.query;
    this.orgName = orgName;
    this.poHeaderId = poHeaderId;
    this.unreadCount = unreadCount;
    this.getOrderHeader();
    this.getOrderLine();
    this.getDoubleUnitUom();
    this.getOperationRecords();
  },
  methods: {
    // 获取业务规则定义-双单位配置
    async getDoubleUnitUom() {
      await queryDoubleUomConfigApi().then((res) => {
        if (res) {
          this.isDoubleUnit = Number(res);
        }
      });
    },
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
      const params = {
        camp: 1
      };
      const headInfo = await getOrderHeaderApi(this.poHeaderId, params);
      this.loading = true;
      if (headInfo && headInfo.failed) {
        this.$hips.toast(headInfo.message);
      }
      this.headInfo = { orgName: this.orgName, ...headInfo };
      const {
        attachmentUuid,
        supplierAttachmentUuid,
      } = headInfo;
      this.purchaserAttachmentUuid = attachmentUuid ? attachmentUuid : uuid();
      this.supplierAttachmentUuid = supplierAttachmentUuid ? supplierAttachmentUuid : uuid();
    },
    //获取订单行信息
    async getOrderLine() {
      this.$loading.show();
      let params = {};
      //跟谁学二开
      if (this.getTenantNum === "SRM-BJHL") {
        params = {
          camp: 1,
          page: 0,
          size: 10,
          sortType: 3,
          poEntryPoint: "OERDER_FEEDBACK",
          customizeUnitCode: "SODR.ORDER_DELIVERY_LINE_LIST.DELIVERY_LINE,SODR.ORDER_DELIVERY_LINE_LIST.OTHER"
        };
      } else {
        params = {
          camp: 1,
          page: 0,
          size: 10,
          sortType: 3
        };
      }
      getOrderLineApi(this.poHeaderId, params).then((res) => {
        this.$loading.hide();
        if (res && !res.empty) {
          this.lineInfo = res.content;
        }
      });
    },
    // 获取操作记录
    async getOperationRecords() {
      this.oploading = true;
      await getOpRecordApi(this.poHeaderId).then((res) => {
        this.oploading = false;
        // this.operationArr = res.content;
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
    //审批处理方法
    handlerPre(type) {
      if (type === "reject") {
        this.handleReject();
      } else {
        this.handleAdopt();
      }
    },
    // 退回该订单
    handleReject() {
      const that = this;
      this.$hips.dialog.confirm({
        title:"",
        content: that.$T("sodr.deliveryDateReview.view.message.confirmReject").$D("是否退回交期审核") + "?",
        okText: that.$T("hipspfm.common.button.ok").$D("确定"),
        cancelText: that.$T("hipspfm.common.button.cancle").$D("取消"),
        closable: false,
        onOk() {
          // const params = self.buildParams();
          const params = [];
          params.push(that.headInfo);
          someRejectApi(params).then((res) => {
            if (res) {
              if (res && res.length) {
                that.$notification.open({
                  message:that.$T("hipspfm.common.message.operationSuccessful").$D("操作成功"),
                  description: "",
                  class:"notification",
                  duration: 1.5,
                });
                setTimeout(() => {
                  that.$router.push({ name: "DeliveryTimeList" });
                }, 1500);
              } else {
                that.$notification.open({
                  message:res.message,
                  description: "",
                  class:"notification",
                  duration: 1.5,
                });
              }
            }
          });
        },
        onCancel() {
        }
      });
    },
    // 通过该订单
    handleAdopt() {
      const that = this;
      this.$hips.dialog.confirm({
        title:"",
        content: that.$T("sodr.deliveryDateReview.view.message.confirmAgree").$D("是否同意交期审核") + "？",
        okText: that.$T("hipspfm.common.button.ok").$D("确定"),
        cancelText: that.$T("hipspfm.common.button.cancle").$D("取消"),
        closable: false,
        onOk() {
          // const params = self.buildParams();
          const params = [];
          params.push(that.headInfo);
          someAdoptApi(params).then((res) => {
            if (res) {
              if (res.length) {
                that.$notification.open({
                  message:that.$T("hipspfm.common.message.operationSuccessful").$D("操作成功"),
                  description: "",
                  class:"notification",
                  duration: 1.5,
                });
                setTimeout(() => {
                  that.$router.replace({ name: "DeliveryTimeList" });
                }, 1000);
              } else {
                that.$notification.open({
                  message:res.message,
                  description: "",
                  class:"notification",
                  duration: 1.5,
                });
              }
            }
          });
        },
        onCancel() {
        }
      });
    },
    showBoardPop() {
      this.boardPop = !this.boardPop;
      // this.unreadCount = 0;
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
