<template>
  <div v-if="showPage" style="height: 100vh;">
    <div class="main-info">
      <!-- 头信息 -->
      <srm-detail-head :data-source="headInfo" :columns="getDetailHeadColumns" customize-code="SMBL.ORDER_CONFIRMATION.HEAD_DETAIL_INFO">
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
          <customize style="padding: 16px 15px" code="SMBL.ORDER_CONFIRMATION.HEADER_INFO" :data-source="headInfo" :columns="getOrderHeadInfoColumns" />
        </srm-scroll-tab-item>
        <srm-scroll-tab-item :label="$T('hipspfm.orderConfirmation.view.message.title.orderLineInfo').$D('行信息')" >
          <srm-list :data-set="lineDataSet" :scrollable="false" :columns="getOrderLineInfoColumns" customize-code="SMBL.ORDER_CONFIRMATION.LINE_INFO" @itemClick="showLineDetail"/>
          <!--          <div v-for="(item, index) in lineInfo" :key="index" @click="showLineDetail(item)"> -->
          <!--            <Customize style="padding: 16px 15px" code="SMBL.ORDER_CONFIRMATION.LINE_INFO" :data-source="item" :columns="getOrderLineInfoColumns" /> -->
          <!--          </div> -->
        </srm-scroll-tab-item>
      </srm-scroll-tab>
    </div>

    <!-- 行信息弹窗 -->
    <srm-popup :visible.sync="visible" height="100%" position="right" :title="$T('hipspfm.orderConfirmation.view.message.title.orderDetail').$D('订单详情')">
      <srm-form :data-set="lineDataSet" customize-type="detail" customize-code="SMBL.ORDER_CONFIRMATION.LINE_INFO_DETAIL" :columns="getOrderLineDetailInfoColumns" />
    </srm-popup>
    <srm-bottom-handler v-if="headInfo.statusCode !=='CONFIRMED'" :btn-arr="getBtnArr" />

    <!-- 历史记录弹窗 -->
    <history-record
      v-model="operationPopup"
      :action-data="operationArr"
      :remark-label="$T('smbl.common.view.title.operationRemark').$D('操作说明')"
      operator-field-name="processUserName"
      process-remark-field-name="processRemark"
      operation-meaning-field-name="processTypeMeaning"
      process-date-field-name="processedDate"/>

    <!-- 留言板弹窗 -->
    <message-board v-if="poHeaderId" v-model="boardPop" :po-header-id="poHeaderId" user-camp-code="SUPPLIER"/>
  </div>
</template>

<script>
import { debounce } from "lodash";
import { SrmUtil, DataSet } from "srm-mobile-ui";
import HistoryRecord from "@/components/HistoryRecord";
import MessageBoard from "@/components/MessageBoard/MessageBoard";
import uuid from "uuid";
import { isEmpty, Exception } from "../../../utils/index";
import {
  getOrderHeadInfo,
  getOrderLineInfo,
  //getOrderLineInfoBJHL,
  getOperationRecordsApi,
  confirmDetailApi,
  saveDetailApi,
  saveFileUUIDApi,
  queryDoubleUomConfigApi,
  calculateDoubleUomApi,
  getOrderConfirmField } from "../api/index";
import { getDynamicLabel } from "../../../utils";
import lineDS from "../datasource/lineDS";
import BigNumber from "bignumber.js";
import { SrmMath } from "srm-mobile-ui";
import { maxValiDatorForTen } from "@/utils";
/* eslint-disable no-invalid-this */
export default {
  modules: [ "sodr.sendOrder", "hzero.common", "spuc.common", "sodr.confirmOrder", "hipspfm.common", "sodr.common", "hipspfm.orderConfirmation", "ssrc.inquiryHall", "smbl.common", "sprm.common", "sodr.workspace", "sinv.receiptWorkbench", "sinv.receiptExecution", "sinv.receipWorkbench" ],
  name: "DeliveryBillDetail",
  components: {
    HistoryRecord,
    MessageBoard,
  },
  data() {
    return {
      mValue:"123456",
      orgName:"",
      poHeaderId:"",
      operationArr: [], // 操作记录
      headInfo: {}, //头信息
      lineInfo: [], //行信息
      operationPopup: false, //操作记录弹窗标识
      logisticsPop: false, //物流信息标识
      visible: false, //行信息弹窗
      currentLineInfo: {}, //当前行信息
      storeInfoFlag: false, //门店信息弹窗
      storeInfoDs: {},
      fieldConfigMap: this.$store.getters["OrderConfirmation/getFieldConfigMap"],
      boardPop: false,
      showPage: false, //展示页面
      lineDataSet: new DataSet(lineDS()),
      isDoubleUnit: false,
    };
  },
  computed: {
    fileArr() {
      if (!Object.keys(this.headInfo).length) {
        return [];
      }
      // const { headInfo: { purchaserAttachmentUuid = uuid(), supplierAttachmentUuid = uuid() } } = this;

      return [
        { title: this.$T("sodr.sendOrder.model.sendOrder.purchaserAttachment").$D("采购方附件"), attachmentUuid: this.purchaserAttachmentUuid, readOnly: true },
        { title: this.$T("sodr.sendOrder.model.sendOrder.supplierAttachment").$D("供应商附件"), attachmentUuid: this.supplierAttachmentUuid, readOnly: false },
      ];
    },
    isMallOrder() {
      return this.headInfo.asnTypeCode === "E_COMMERCE_DELIVERY_LIST";
    },
    isSanJiang() {
      return SrmUtil.getTenantNum() === "SRM-SANJIANG";
    },
    isBasicPriceTypeTaxInclude() {
      //TAX_INCLUDED_PRICE/NET_PRICE
      return this.headInfo.benchmarkPriceType === "TAX_INCLUDED_PRICE";
    },
    // 详情头
    getDetailHeadColumns() {
      const columns = [
        {
          fieldCode: "displayPoNum",
        },
        {
          fieldName: this.$T("sodr.confirmOrder.model.confirmOrder.taxedAmount").$D("含税金额"),
          fieldCode: "taxIncludeAmount",
          render:(val, record) => {
            // erp订单及电商申请转订单不做精度控制
            // erp订单：sourceCode="SRM"&&poSourcePlatform="ERP"
            const erpFlag = record.sourceCode === "SRM" && record.poSourcePlatform === "ERP";
            // 电商申请转订单：sourceCode="SAP"&&poSourcePlatform="E-COMMERCE"
            const sapFlag = record.sourceCode === "SAP" && record.poSourcePlatform === "E-COMMERCE";
            const length = record.financialPrecision || this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision");
            if (!erpFlag && !sapFlag) {
              return SrmUtil.getNumberPrecision(new BigNumber(val), length);
            }
          }
        },
        {
          fieldName: this.$T("sodr.confirmOrder.model.confirmOrder.amount").$D("不含税金额"),
          fieldCode: "amount",
          render:(val, record) => {
            // erp订单及电商申请转订单不做精度控制
            // erp订单：sourceCode="SRM"&&poSourcePlatform="ERP"
            const erpFlag = record.sourceCode === "SRM" && record.poSourcePlatform === "ERP";
            // 电商申请转订单：sourceCode="SAP"&&poSourcePlatform="E-COMMERCE"
            const sapFlag = record.sourceCode === "SAP" && record.poSourcePlatform === "E-COMMERCE";
            const length = record.financialPrecision || this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision");
            if (!erpFlag && !sapFlag) {
              return SrmUtil.getNumberPrecision(new BigNumber(val), length);
            }
          }
        },
        {
          fieldName: this.$T("hipspfm.orderConfirmation.message.orderConfirmation.versionNumber").$D("版本号"),
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
          fieldName: this.$T("sodr.confirmOrder.model.confirmOrder.orgId").$D("业务实体"),
          fieldType: "TEXT",
          fieldCode: "orgName",
        },
        {
          fieldName: this.$T("sodr.common.model.common.supplierId").$D("供应商"),
          fieldType: "TEXT",
          fieldCode: "supplierName",
        },
        {
          fieldName: this.$T("sodr.confirmOrder.model.common.poTypeCode").$D("订单类型"),
          fieldType: "TEXT",
          fieldCode: "poTypeDesc",
        },
        {
          fieldName: this.$T("sodr.confirmOrder.model.common.purOrganizationId").$D("采购组织"),
          fieldType: "TEXT",
          fieldCode: "purchaseOrgName",
        },
        {
          fieldName: this.$T("sodr.confirmOrder.model.confirmOrder.agentName").$D("采购员"),
          fieldType: "TEXT",
          fieldCode: "agentName",
        },
        {
          fieldName: this.$T("sodr.confirmOrder.model.confirmOrder.releaseDate").$D("发布日期"),
          fieldType: "TEXT",
          fieldCode: "releasedDate",
        },
        {
          fieldName: this.$T("sodr.common.model.common.sourcePlatform").$D("来源平台"),
          fieldType: "TEXT",
          fieldCode: "poSourcePlatformMeaning",
        },
        {
          fieldName: this.$T("sodr.common.model.common.termsName").$D("付款条款"),
          fieldType: "TEXT",
          fieldCode: "termsName",
        },
        {
          fieldName: this.$T("sodr.common.model.commonder.orderRemark").$D("订单摘要"),
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
            <span slot="right">{ this.$T("sodr.confirmOrder.model.common.displayLineNum").$D("行号") }：{item.lineNum}</span>
          </SrmListHeader>
        },
        {
          fieldName: this.$T("sodr.confirmOrder.model.confirmOrder.itemCode").$D("物品编码"),
          fieldType: "TEXT",
          fieldCode: "itemCode",
        },
        {
          fieldName: this.$T("sodr.common.model.common.displayLineLocationNum").$D("发运号"),
          fieldType: "TEXT",
          fieldCode: "displayLineLocationNum",
        },
        this.isDoubleUnit && {
          fieldName: this.$T("sodr.confirmOrder.model.common.quantity").$D("数量"),
          fieldCode: "secondaryQuantity",
          fieldType: "INPUT_NUMBER",
          required: (val, record) => record.quantityEnableFlag,
          disabled:(val, record) => !record.quantityEditFlag,
          validator:(val) => maxValiDatorForTen(val),
          editLimit:true,
          inputChange: (val, record) => this.lineQuantityChange(val, record, "secondaryQuantity"),
          precision: (val, record) => {
            // erp订单及电商申请转订单不做精度控制
            // erp订单：sourceCode="SRM"&&poSourcePlatform="ERP"
            const erpFlag = record.sourceCode === "SRM" && record.poSourcePlatform === "ERP";
            // 电商申请转订单：sourceCode="SAP"&&poSourcePlatform="E-COMMERCE"
            const sapFlag = record.sourceCode === "SAP" && record.poSourcePlatform === "E-COMMERCE";
            if (!erpFlag && !sapFlag) {
              return Number(record.uomPrecision);
            }
          }
        },
        {
          fieldName: getDynamicLabel(this.isDoubleUnit, "quantity"),
          fieldCode: "quantity",
          fieldType: "INPUT_NUMBER",
          required: (val, record) => record.quantityEnableFlag,
          disabled: (val, record) => this.isDoubleUnit || !record.quantityEditFlag,
          validator: (val) => maxValiDatorForTen(val),
          editLimit: true,
          inputChange:(val, record) => {
            this.lineQuantityChange(val, record, "quantity");
          },
          precision: (val, record) => {
            // erp订单及电商申请转订单不做精度控制
            // erp订单：sourceCode="SRM"&&poSourcePlatform="ERP"
            const erpFlag = record.sourceCode === "SRM" && record.poSourcePlatform === "ERP";
            // 电商申请转订单：sourceCode="SAP"&&poSourcePlatform="E-COMMERCE"
            const sapFlag = record.sourceCode === "SAP" && record.poSourcePlatform === "E-COMMERCE";
            if (!erpFlag && !sapFlag) {
              return Number(record.uomPrecision);
            }
          }
        },
        {
          fieldName: this.$T("sodr.confirmOrder.model.common.originalQuantity").$D("原需求数量"),
          fieldType: "INPUT_NUMBER",
          fieldCode: "originalQuantity",
          editor: false,
        },
        {
          fieldName: this.$T("sodr.confirmOrder.model.confirmOrder.needByDate").$D("需求日期"),
          fieldType: "TEXT",
          fieldCode: "needByDate",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters.CalcDate(val)
        },
        {
          fieldName: this.$T("hipspfm.common.category.price").$D("单价"),
          fieldType: "INPUT_NUMBER",
          fieldCode: "enteredTaxIncludedPrice",
          editor: false,
        },
        {
          fieldName: this.$T("sodr.common.model.common.promiseDeliveryDate").$D("承诺交货日期"),
          fieldCode: "promiseDeliveryDate",
          fieldType: "DATE",
          required: (val, record) => record.deliveryDateEnableFlag,
          disabled:(val, record) => !record.deliveryDateEditFlag,
          render: (val) => {
            // eslint-disable-next-line new-cap
            this.$options.filters.CalcDate(val);
          }
        },
        {
          fieldName: this.$T("sodr.confirmOrder.model.common.feedback").$D("反馈信息"),
          fieldCode: "feedback",
          fieldType: "INPUT",
          placeholder: this.$T("hipspfm.orderConfirmation.view.message.handlerFeedback").$D("请输入反馈信息"),
        },
      ];
      return columns;
    },
    // 送货单行详细信息
    getOrderLineDetailInfoColumns() {
      const isBJHL = SrmUtil.getTenantNum() === "SRM-BJHL";
      const columns = [
        {
          fieldName: this.$T("sodr.common.model.common.displayAsnLineNum").$D("行号"),
          fieldCode: "lineNum",
        },
        {
          fieldName: this.$T("sodr.common.model.common.displayLineLocationNum").$D("发运号"),
          fieldCode: "displayLineLocationNum",
        },
        {
          fieldName: this.$T("sodr.common.model.common.itemCode").$D("物料编码"),
          fieldCode: "itemCode",
        },
        {
          fieldName: this.$T("sodr.common.model.common.itemName").$D("物料名称"),
          fieldCode: "itemName",
        },
        this.isDoubleUnit && {
          fieldName: this.$T("sodr.common.model.common.unitName").$D("单位"),
          fieldCode: "secondaryUomCodeAndName",
        },
        this.isDoubleUnit && {
          fieldName: this.$T("sodr.confirmOrder.model.common.quantity").$D("数量"),
          fieldCode: "secondaryQuantity",
          fieldType: "INPUT_NUMBER",
          required: (val, record) => record.quantityEnableFlag,
          disabled:(val, record) => !record.quantityEditFlag,
          validator:(val) => maxValiDatorForTen(val),
          editLimit:true,
          inputChange:(val, record) => {
            this.lineQuantityChange(val, record, "secondaryQuantity");
          },
          precision: (val, record) => {
            // erp订单及电商申请转订单不做精度控制
            // erp订单：sourceCode="SRM"&&poSourcePlatform="ERP"
            const erpFlag = record.sourceCode === "SRM" && record.poSourcePlatform === "ERP";
            // 电商申请转订单：sourceCode="SAP"&&poSourcePlatform="E-COMMERCE"
            const sapFlag = record.sourceCode === "SAP" && record.poSourcePlatform === "E-COMMERCE";
            if (!erpFlag && !sapFlag) {
              return Number(record.secondaryUomPrecision);
            }
          }
        },
        {
          fieldName: getDynamicLabel(this.isDoubleUnit, "uom"),
          fieldCode: "uomCodeAndName",
        },
        {
          fieldName: getDynamicLabel(this.isDoubleUnit, "quantity"),
          fieldCode: "quantity",
          fieldType: "INPUT_NUMBER",
          required: (val, record) => record.quantityEnableFlag,
          disabled:(val, record) => this.isDoubleUnit || !record.quantityEditFlag,
          validator:(val) => maxValiDatorForTen(val),
          editLimit:true,
          inputChange:(val, record) => {
            this.lineQuantityChange(val, record, "quantity");
          },
          precision: (val, record) => {
            // erp订单及电商申请转订单不做精度控制
            // erp订单：sourceCode="SRM"&&poSourcePlatform="ERP"
            const erpFlag = record.sourceCode === "SRM" && record.poSourcePlatform === "ERP";
            // 电商申请转订单：sourceCode="SAP"&&poSourcePlatform="E-COMMERCE"
            const sapFlag = record.sourceCode === "SAP" && record.poSourcePlatform === "E-COMMERCE";
            if (!erpFlag && !sapFlag) {
              return Number(record.uomPrecision);
            }
          }
        },
        {
          fieldName: this.$T("sodr.confirmOrder.model.common.originalQuantity").$D("原需求数量"),
          fieldType: "INPUT_NUMBER",
          fieldCode: "originalQuantity",
          editor: false,
        },
        {
          fieldName: this.$T("sodr.confirmOrder.model.common.taxedEnteredUnitPrice").$D("原币含税单价"),
          fieldType: "INPUT_NUMBER",
          fieldCode: "enteredTaxIncludedPrice",
          editor: false,
        },
        {
          fieldName: this.$T("sodr.confirmOrder.model.confirmOrder.taxedLineAmount").$D("含税行金额"),
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
          fieldName: this.$T("sodr.confirmOrder.model.confirmOrder.lineAmount").$D("不含税行金额"),
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
          fieldName: this.$T("sodr.confirmOrder.model.common.needByDate").$D("需求日期"),
          fieldCode: "needByDate",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters.CalcDate(val)
        },
        {
          fieldName: this.$T("sodr.common.model.common.promiseDeliveryDate").$D("承诺交货日期"),
          fieldCode: "promiseDeliveryDate",
          fieldType: "DATE",
          required: (val, record) => record.deliveryDateEnableFlag,
          disabled:(val, record) => !record.deliveryDateEditFlag,
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters.CalcDate(val)
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
          fieldName: this.$T("sodr.confirmOrder.model.common.feedback").$D("反馈信息"),
          fieldCode: "feedback",
          fieldType: "INPUT",
        },
        {
          fieldName: this.$T("sodr.common.model.common.purchaserRemark").$D("采购方行备注"),
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
          title: this.$T("sodr.common.button.supplierScheduleSheet.save").$D("保存"),
          handler: () => this.handlerPre("save")
        },
        {
          title: this.$T("sodr.common.model.view.button.backConfirm").$D("反馈/确认"),
          handler: () => this.handlerPre("confirm"),
        },
      ];
    },
    getTenantNum() {
      return SrmUtil.getTenantNum();
    }
  },
  beforeMount() {
    const { poHeaderId } = this.$route.query;
    this.poHeaderId = poHeaderId;
    this.lineDataSet.addPathParameter("poHeaderId", poHeaderId);
  },
  async mounted() {
    this.getOrderConfirmFieldConfig();
    await this.initData();
  },
  methods: {
    showOperationPop() {
      this.operationPopup = !this.operationPopup;
    },
    // 查看行详情
    showLineDetail(record) {
      this.visible = !this.visible;
      this.currentLineInfo = record.data;
    },
    //获取订单头信息
    async getOrderHeader() {
      this.$loading.show();

      const headInfo = await getOrderHeadInfo(this.poHeaderId);
      if (!headInfo) {
        return;
      }
      this.$loading.hide();
      this.headInfo = { orgName: this.orgName, ...headInfo };
      // 错误提示 订单反馈审核拒绝/已发布/部分反馈
      if (![ "DELIVERY_DATE_REJECT", "PUBLISHED", "PART_FEED_BACK" ].includes(this.headInfo.statusCode)) {
        let f = true;
        // 订单头：订单反馈审核中
        if (this.headInfo.statusCode === "DELIVERY_DATE_REVIEW") {
          // 订单行：存在订单反馈审核拒绝
          await getOrderLineInfo({ poHeaderId: this.poHeaderId }).then((res) => {
            if (res && res.content && res.content.findIndex((val) => val.displayStatusCode === "DELIVERY_DATE_REJECT") > -1) {
              f = false;
            }
          });
        }
        if (f) {
          this.$notification.open({
            message: this.$T("hzero.common.notification.repeat.tips").$D("单据已被处理,不能重复操作"),
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
        saveFileUUIDApi(uuParms).then((res) => {
          this.headInfo.objectVersionNumber = res || this.headInfo.objectVersionNumber;
        });
      }
    },
    //获取订单行信息
    async getOrderLine(poHeaderId) {
      this.$loading.show();
      //标准接口补充个性化参数，与二开一直，技术开发误以为和标准的不一致值，新开了二开逻辑，当前bug修复注释这段逻辑，20211210
      //跟谁学二开
      // if (this.getTenantNum === "SRM-BJHL") {
      //   const params = {
      //     page: 0,
      //     size: 1000,
      //     camp: 2,
      //     customizeUnitCode: "SODR.CONFIRM_ORDER_DETAIL.BASIC,SODR.CONFIRM_ORDER_DETAIL.OTHER",
      //     poEntryPoint: "PURCHASE_PO_CONFIRM",
      //     sortType: 4
      //   };
      //
      //   await getOrderLineInfoBJHL(poHeaderId, params).then((res) => {
      //     this.$loading.hide();
      //     if (!res.empty) {
      //       this.lineInfo = res.content;
      //     }
      //   });
      // } else {
      await getOrderLineInfo({ poHeaderId }).then((res) => {
        if (res && !res.empty) {
          this.lineInfo = res.content;
        }
      }).catch((e) => {
        console.info("error", e);
      }).finally(() => {
        this.$loading.hide();
      });
      // }
    },
    // 获取操作记录
    async getOperationRecords() {
      // const params = {
      //   poHeaderId: this.poHeaderId
      // };

      this.oploading = true;
      await getOperationRecordsApi(this.poHeaderId).then((res) => {
        this.oploading = false;
        //this.operationArr = res.content;

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
      if (type === "save") {
        this.saveHandler();
      } else {
        this.confirmDetailInfo();
      }
    },
    // 保存明细信息
    async saveHandler() {
      const that = this;
      const saveParams = that.buildParams("save");
      // console.log("params1111111=>",saveParams);
      this.$loading.show();
      saveDetailApi(saveParams).then((res) => {
        if (res.failed) {
          this.$notification.open({
            message: res.message,
            description: "",
            key,
            class: "notification",
          });
        } else {
          this.initData();
          this.$notification.open({
            message: this.$T("hzero.common.notification.success").$D(
              "操作成功"
            ),
            description: "",
            key,
            class: "notification",
          });
        }
      }).finally(() => {
        this.$loading.hide();
      });
    },
    // 确认明细信息
    confirmDetailInfo() {
      const that = this;

      this.$dialog({
        content:
          this.$T("sodr.confirmOrder.view.message.backConfirmOrder").$D(
            "是否反馈/确认订单"
          ) + "?",
        onOk() {
          const params = that.buildParams();

          this.$loading.show();
          confirmDetailApi(params).then((res) => {
            if (res) {
              if (res.length) {
                this.$notification.open({
                  message: this.$T("hzero.common.notification.success").$D(
                    "操作成功"
                  ),
                  description: "",
                  key,
                  class: "notification",
                });
                setTimeout(() => {
                //跳转页面，不在入栈，push会入栈
                  that.$router.replace({ name: "OrderConfirmationList" });
                }, 1000);
              } else {
                this.$notification.open({
                  message: res.message,
                  description: "",
                  key,
                  class: "notification",
                });
              }
            }
          }).finally(() => {
            this.$loading.hide();
          });
        },
        onCancel() {
        },
      });
    },
    // 处理传参
    buildParams(type) {
      let params;
      //校验必输
      // console.log("this.lineInfo=>",this.lineInfo);
      this.lineInfo = this.lineDataSet.data;
      this.lineInfo.forEach((item) => {
        //校验数量是否输入
        if (item.quantityEnableFlag) {
          if (isEmpty(item.quantity)) {
            // eslint-disable-next-line new-cap
            Exception(this, this.$T("hzero.common.validation.notNull").$D("{name}不能为空"),
              [ this.$T("sodr.confirmOrder.model.common.quantity").$D("数量") ]);
          }
        }
        //校验承诺交货日期是否输入
        if (item.deliveryDateEnableFlag) {
          if (isEmpty(item.promiseDeliveryDate)) {
            // eslint-disable-next-line new-cap
            Exception(this, this.$T("hzero.common.validation.notNull").$D("{name}不能为空"),
              [ this.$T("sodr.common.model.common.promiseDeliveryDate").$D("承诺交货日期") ]);
          }
        }
      });
      //保存封装数据格式不同
      if (type === "save") {
        params = {
          poLineDetailDTOs: this.lineInfo,
          poHeaderDetailDTO: this.headInfo,
        };
      } else {
        params = [
          {
            poLineDetailDTOs: this.lineInfo,
            poHeaderDetailDTO: this.headInfo,
          },
        ];
      }
      return params;
    },
    showBoardPop() {
      this.boardPop = !this.boardPop;
      // this.unreadCount = 0;
    },
    //字段是否必输
    requiredFlagFunction(field, defaultNature) {
      console.info(this.fieldConfigMap);
      if (this.fieldConfigMap === null) {
        return defaultNature;
      }
      if (this.fieldConfigMap.get(field).requiredFlag === 1) {
        return true;
      }
      return false;

    },
    //字段是否可编辑,field字段名，defaultNature默认属性，当没有配置数据的时候，返回的值
    editFlagFunction(field, defaultNature) {
      if (this.fieldConfigMap === null) {
        return defaultNature;
      }
      if (this.fieldConfigMap.get(field).editFlag === 1) {
        return true;
      }
      return false;

    },
    //加载字段属性配置，考虑是否加入判断，如果已经存在了缓存数据，不在调用接口
    getOrderConfirmFieldConfig() {
      getOrderConfirmField().then((res) => {
        if (res && res.length > 0) {
          let tempMap = new Map();

          res.forEach((filedItem) => {
            tempMap.set(filedItem.fieldName, filedItem);
          });
          this.fieldConfigMap = tempMap;
          this.$store.commit("OrderConfirmation/setFieldConfigMap", tempMap);
        }
      });
    },
    async initData() {
      const { poHeaderId, orgName, unreadCount } = this.$route.query;
      this.orgName = orgName;
      this.poHeaderId = poHeaderId;
      this.unreadCount = unreadCount;
      try {
        this.$loading.show();
        await this.queryDoubleUomConfig();
        await this.getOrderHeader();
        this.lineDataSet.refresh();
        // await this.getOrderLine(poHeaderId);
        await this.getOperationRecords();
        this.$loading.hide();
      } catch (err) {
        this.$loading.hide();
        console.log(err, "error");
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
              (j) => j.businessKey === itemOrgUom.businessKey
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
      if (this.isBasicPriceTypeTaxInclude) {
        /**
         * 基准价=含税：
         * 不含税单价=不含税金额/数量*每，单价精度=含税单价/(1+税率)，单价精度
         * 含税金额= 含税单价*数量/每，金额精度 1.数量不动，调整含税单价；2.税额、不含税金额、不含税单价联动调整
         * 税额=含税金额/（1+税率）*税率，金额精度 1.含税金额不动，调整不含税金额；2.税额、不含税单价联动调整
         * 不含税金额=含税金额-税额，金额精度 1.含税金额不动，调整税额；2.不含税单价联动调整
         */
        item.taxIncludedLineAmount = SrmMath.div(SrmMath.times(new BigNumber(item.quantity), new BigNumber(item.enteredTaxIncludedPrice)), item.unitPriceBatch && !SrmMath.isZero(item.unitPriceBatch) ? new BigNumber(item.unitPriceBatch) : new BigNumber(1));
        const taxAmount = SrmMath.times(SrmMath.div(item.taxIncludedLineAmount, SrmMath.plus(new BigNumber(1), SrmMath.div(new BigNumber(item.taxRate), new BigNumber(100.0)))), SrmMath.div(new BigNumber(item.taxRate), new BigNumber(100.0)));
        item.lineAmount = SrmMath.minus(item.taxIncludedLineAmount, taxAmount);
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
        item.taxIncludedLineAmount = SrmMath.plus(item.lineAmount, taxAmount);
      }
      let taxIncludeAmount = new BigNumber(0);
      taxIncludeAmount = this.lineDataSet.records.reduce((total, cur) => SrmMath.plus(total, SrmMath.isZero(new BigNumber(cur.get("taxIncludedLineAmount"))) ? new BigNumber(cur.get("taxIncludedLineAmount")) : new BigNumber(0)), new BigNumber(0));
      let amount = new BigNumber(0);
      amount = this.lineDataSet.records.reduce((total, cur) => SrmMath.plus(total, SrmMath.isZero(new BigNumber(cur.get("lineAmount"))) ? new BigNumber(cur.get("lineAmount")) : new BigNumber(0)), new BigNumber(0));
      this.$set(this.headInfo, "taxIncludeAmount", taxIncludeAmount);
      this.$set(this.headInfo, "amount", amount);
    },
    //行数据，数量变动触发方法
    lineQuantityChange: debounce(async function(val, item, changeField) {
      // 换算
      if (changeField === "quantity") {
        if (isEmpty(item.taxIncludedLineAmount) || isEmpty(item.lineAmount) || isEmpty(item.quantity)) {
          return;
        }
        if (!isEmpty(item.quantity)) {
          if (!this.isDoubleUnit && item.quantity && !SrmMath.isZero(item.quantity) && SrmMath.gt(new BigNumber(item.quantity), new BigNumber(item.originalQuantity))) {
            item.quantity = item.originalQuantity;
          }
          if (!this.isDoubleUnit) {
            this.$set(item, "secondaryQuantity", item.quantity);
            item.secondaryQuantity = item.quantity;
          }
        }
        this.calcAmount(item);

      } else if (changeField === "secondaryQuantity" && this.isDoubleUnit) {
        if (isEmpty(item.taxIncludedLineAmount) || isEmpty(item.lineAmount) || isEmpty(val)) {
          return;
        }
        if (!isEmpty(item.secondaryQuantity)) {
          if (item.secondaryQuantity && !SrmMath.isZero(item.secondaryQuantity) && SrmMath.gt(new BigNumber(item.secondaryQuantity), new BigNumber(item.originalQuantity))) {
            item.secondaryQuantity = item.originalQuantity;
          }
        }
        const { itemCode } = item;
        if (itemCode) {
          const result = await this.conversionUpdate({ value:val, record: item, isDoubleUnit: this.isDoubleUnit, clearQuantity: true });
          if (!result) {
            return false;
          }
        } else {
          this.$set(item, "quantity", item.quantity);
          item.quantity = item.secondaryQuantity;
        }
        this.calcAmount(item);
      }
    }, 500),
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
