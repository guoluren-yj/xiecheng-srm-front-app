<template>
  <div style="height: 100vh;">
    <div class="main-info">
      <!-- 头信息 -->
      <srm-detail-head :data-source="headInfo" :columns="getDetailHeadColumns">
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
        </div>
      </srm-detail-head>

      <!-- 内容区域 -->
      <srm-scroll-tab class="content">
        <srm-scroll-tab-item :label="$T('hipspfm.common.view.message.title.orderHeaderInfo').$D('订单头信息')" >
          <customize :need-padding="true" code="SMBL.MY_RECEIVE_ORDER.HEAD_INFO" :data-source="headInfo" :columns="getOrderHeadInfoColumns" />
        </srm-scroll-tab-item>
        <srm-scroll-tab-item :label="$T('hipspfm.common.view.message.title.orderLineInfo').$D('订单行信息')" >
          <div v-for="(item, index) in lineInfo" :key="index" @click="showLineDetail(item)">
            <customize :need-padding="true" code="SMBL.MY_RECEIVE_ORDER.LINE_INFO" :data-source="item" :columns="getOrderLineInfoColumns" />
          </div>
        </srm-scroll-tab-item>
        <srm-scroll-tab-item v-if="isMallOrder" :label="$T('hipspfm.common.view.message.title.receiptGoodsAndOrders').$D('收货收单')" >
          <customize :need-padding="true" code="SMBL.MY_RECEIVE_ORDER.RECEIPT_GOODS_AND_ORDERS_INFO" :data-source="headInfo" :columns="getGoodsAndOrdersInfoColumns" />
        </srm-scroll-tab-item>
        <srm-scroll-tab-item v-if="isMallOrder" :label="$T('hipspfm.common.view.message.title.billingInfo').$D('开票信息')" >
          <customize :need-padding="true" code="SMBL.MY_RECEIVE_ORDER.BILL_INFO" :data-source="headInfo" :columns="getBillInfoColumns" />
        </srm-scroll-tab-item>
      </srm-scroll-tab>
    </div>

    <!-- 行信息弹窗 -->
    <srm-popup :visible.sync="visible" height="100%" position="right" :title="$T('hipspfm.orderApproval.view.message.title.orderDetail').$D('订单详情')">
      <div style="height: 100%; overflow: auto;">
        <customize-detail :need-padding="true" code="SMBL.MY_RECEIVE_ORDER.LINE_INFO_DETAIL" :data-source="currentLineInfo" :columns="getOrderLineDetailInfoColumns" />
      </div>
    </srm-popup>

    <!-- 历史记录弹窗 -->
    <history-record
      v-model="operationPopup"
      :action-data="operationArr"
      :remark-label="$T('smbl.common.view.title.operationRemark').$D('操作说明')"
      operator-field-name="processUserName"
      operation-meaning-field-name="processTypeMeaning"
      process-remark-field-name="processRemark"
      process-date-field-name="processedDate"/>
    <!-- 留言板弹窗 -->
    <message-board
      v-if="boardPop"
      v-model="boardPop"
      :po-header-id="String(poHeaderId)"
      user-camp-code="PURCHASE"/>
  </div>
</template>

<script>

import { SrmUtil } from "srm-mobile-ui";
import HistoryRecord from "@/components/HistoryRecord";
import uuid from "uuid";
import MessageBoard from "@/components/MessageBoard/MessageBoard";
import {
  getOpRecordApi,
  getOrderLineApi,
  getOrderHeaderApi,
  saveFileUUIDApi,
  queryDoubleUomConfigApi,
} from "../api";
import { getDynamicLabel } from "../../../utils";
import BigNumber from "bignumber.js";

export default {
  modules: [ "hipspfm.common", "sodr.orderApproval", "hipspfm.orderApproval", "spuc.common", "ssrc.inquiryHall", "smbl.common", "sodr.receivedOrder", "hipspfm.receivedOrder", "sodr.common", "hipspfm.sendOrder", "sodr.sendOrder", "sprm.common", "sodr.workspace", "sinv.receiptWorkbench", "sinv.receiptExecution", "sinv.receipWorkbench" ],
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
      // const { headInfo: { purchaserAttachmentUuid = this.purchaserAttachmentUuid, supplierAttachmentUuid = this.supplierAttachmentUuid } } = this;
      return [
        { title: this.$T("sodr.receivedOrder.model.receivedOrder.purchaserAttachment").$D("采购方附件"), attachmentUuid: this.purchaserAttachmentUuid, readOnly: false },
        { title: this.$T("sodr.receivedOrder.model.receivedOrder.supplierAttachment").$D("供应商附件"), attachmentUuid: this.supplierAttachmentUuid, readOnly: true },
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
          render:(val, record) => {
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
          fieldName: this.$T("hipspfm.sendOrder.model.sendOrder.company").$D("公司"),
          fieldCode: "companyName",
        },
        {
          fieldName: this.$T("sodr.sendOrder.model.sendOrder.orgName").$D("业务实体"),
          fieldCode: "ouName",
        },
        {
          fieldName: this.$T("sodr.sendOrder.model.sendOrder.supplierId").$D("供应商"),
          fieldCode: "supplierName",
        },
        {
          fieldName: this.$T("sodr.sendOrder.model.sendOrder.poTypeCode").$D("订单类型"),
          fieldCode: "poTypeDesc",
        },
        {
          fieldName: this.$T("sodr.sendOrder.model.sendOrder.purOrganizationId").$D("采购组织"),
          fieldCode: "purchaseOrgName",
        },
        {
          fieldName: this.$T("sodr.sendOrder.model.sendOrder.agentId").$D("采购员"),
          fieldCode: "agentName",
        },
        {
          fieldName: this.$T("sodr.sendOrder.model.sendOrder.releaseDate").$D("发布时间"),
          fieldCode: "releasedDate",
        },
        {
          fieldName: this.$T("hipspfm.sendOrder.model.sendOrder.sourcePlatform").$D("来源平台"),
          fieldCode: "poSourcePlatformMeaning",
        },
        {
          fieldName: this.$T("sodr.sendOrder.model.sendOrder.comments").$D("订单摘要"),
          fieldCode: "remark",
          render:(val) => val ? val : this.$T("hipspfm.common.currency.none").$D("无")
        }
      ];
      return columns;
    },
    // 订单行信息
    getOrderLineInfoColumns() {
      const isSANJIANG = SrmUtil.getTenantNum() === "SRM-SANJIANG";
      const columns = [
        {
          formRow: 0,
          fieldCode: "customHeader",
          fieldType: "EMPTY",
          langCode: "sodr.orderApproval.model.common.displayLineNum",
          render: (val, item) => <SrmListHeader>
            <span>{item.itemName}</span>
            <span slot="right">{ this.$T("sodr.sendOrder.model.sendOrder.poLineNum").$D("行号") }：{item.lineNum}</span>
          </SrmListHeader>
        },
        {
          fieldName: this.$T("sodr.sendOrder.model.sendOrder.itemCode").$D("物料编码"),
          fieldCode: "itemCode",
        },
        {
          fieldName: this.$T("sodr.sendOrder.model.sendOrder.shipmentNum").$D("发运号"),
          fieldCode: "displayLineLocationNum",
        },
        this.isDoubleUnit && {
          fieldName: this.$T("sodr.sendOrder.model.sendOrder.quantity").$D("数量"),
          fieldCode: "secondaryQuantity",
          fieldType: "INPUT_NUMBER",
          editor: false
        },
        {
          fieldName: getDynamicLabel(this.isDoubleUnit, "quantity"),
          fieldCode: "quantity",
          fieldType: "INPUT_NUMBER",
          editor: false
        },
        {
          fieldName: this.$T("sodr.sendOrder.model.common.enteredTaxIncludedPrice").$D("单价"),
          fieldType: "INPUT_NUMBER",
          fieldCode: "enteredTaxIncludedPrice",
          editor: false,
        },
        isSANJIANG && {
          fieldName: this.$T("sodr.sendOrder.model.common.specifications").$D("规格"),
          fieldCode: "specifications",
        },
        isSANJIANG && {
          fieldName: this.$T("sodr.sendOrder.model.common.outputCapacity").$D("产成率"),
          fieldCode: "attributeVarchar5",
        },
        {
          fieldName: this.$T("sodr.sendOrder.model.sendOrder.needByDate").$D("需求日期"),
          fieldCode: "needByDate",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters.CalcDate(val)
        },
      ];
      return columns;
    },
    // 收货收单信息
    getGoodsAndOrdersInfoColumns() {
      const columns = [
        {
          fieldName: this.$T("hipspfm.sendOrder.model.sendOrder.receiverContactName").$D("收货联系人"),
          fieldCode: "shipToLocContName",
        },
        {
          fieldName: this.$T("hipspfm.sendOrder.model.sendOrder.receiverTelNum").$D("收货联系电话"),
          fieldCode: "shipToLocTelNum",
        },
        {
          fieldName: this.$T("hipspfm.sendOrder.model.sendOrder.shippingAddress").$D("收货地址"),
          fieldCode: "shipToLocationAddress",
        },
        {
          fieldName: this.$T("hipspfm.sendOrder.model.sendOrder.invoiceContactName").$D("收单联系人"),
          fieldCode: "billToLocContName",
        },
        {
          fieldName: this.$T("hipspfm.sendOrder.model.sendOrder.invoiceContactTel").$D("收单联系电话"),
          fieldCode: "billToLocTelNum",
        },
        {
          fieldName: this.$T("hipspfm.sendOrder.model.sendOrder.receiverEmail").$D("收单邮箱"),
          fieldCode: "receiverEmailAddress",
        },
        {
          fieldName: this.$T("hipspfm.sendOrder.model.sendOrder.receiverAddress").$D("收单地址"),
          fieldCode: "billToLocationAddress",
        },
      ];
      return columns;
    },
    // 开票信息
    getBillInfoColumns() {
      const columns = [
        {
          fieldName: this.$T("sodr.sendOrder.model.common.invoiceCompanyName").$D("开票公司名称"),
          fieldCode: "invoiceTitle",
        },
        {
          fieldName: this.$T("hipspfm.sendOrder.model.sendOrder.taxRegisterNum").$D("税号"),
          fieldCode: "taxRegisterNum",
        },
        {
          fieldName: this.$T("sodr.sendOrder.model.common.invoiceType").$D("发票类型"),
          fieldCode: "invoiceTitleTypeName",
        },
        {
          fieldName: this.$T("sodr.sendOrder.model.common.invoiceMethod").$D("开票方式"),
          fieldCode: "invoiceMethodName",
        },
        {
          fieldName: this.$T("sodr.sendOrder.model.common.invoiceTitleTypeMeaning").$D("发票形式"),
          fieldCode: "invoiceTypeName",
        },
        {
          fieldName: this.$T("sodr.sendOrder.model.common.invoiceDetail").$D("发票明细"),
          fieldCode: "invoiceDetailTypeName",
        }
      ];
      return columns;
    },
    // 送货单行详细信息
    getOrderLineDetailInfoColumns() {
      const isBJHL = SrmUtil.getTenantNum() === "SRM-BJHL";
      const isSANJIANG = SrmUtil.getTenantNum() === "SRM-SANJIANG";
      const columns = [
        {
          fieldName: this.$T("sodr.sendOrder.model.sendOrder.poLineNum").$D("行号"),
          fieldCode: "lineNum",
        },
        {
          fieldName: this.$T("sodr.sendOrder.model.sendOrder.shipmentNum").$D("发运号"),
          fieldCode: "displayLineLocationNum",
        },
        {
          fieldName: this.$T("sodr.sendOrder.model.sendOrder.itemCode").$D("物料编码"),
          fieldCode: "itemCode",
        },
        {
          fieldName: this.$T("sodr.sendOrder.model.sendOrder.itemDescription").$D("物料名称"),
          fieldCode: "itemName",
        },
        this.isDoubleUnit && {
          fieldName: this.$T("sodr.sendOrder.model.sendOrder.uomName").$D("单位"),
          fieldCode: "secondaryUomCodeAndName",
        },
        this.isDoubleUnit && {
          fieldName: this.$T("sodr.sendOrder.model.sendOrder.quantity").$D("数量"),
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
          fieldName: this.$T("sodr.sendOrder.model.sendOrder.taxRate").$D("税率"),
          fieldCode: "taxRate",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: this.$T("sodr.sendOrder.model.sendOrder.taxedEnteredUnitPrice").$D("原币含税单价"),
          fieldType: "INPUT_NUMBER",
          fieldCode: "enteredTaxIncludedPrice",
          editor: false,
        },
        {
          fieldName: this.$T("sodr.sendOrder.model.sendOrder.taxedLineAmount").$D("含税行金额"),
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
          fieldName: this.$T("sodr.sendOrder.model.sendOrder.needByDate").$D("需求日期"),
          fieldCode: "needByDate",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters.CalcDate(val)
        },
        {
          fieldName: this.$T("sodr.sendOrder.model.sendOrder.committedDeliveryDate").$D("承诺交货日期"),
          fieldCode: "promiseDeliveryDate",
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
          fieldName: this.$T("sodr.sendOrder.model.sendOrder.purchaserComments").$D("采购方行备注"),
          fieldCode: "remark",
        },
        {
          fieldName: this.$T("sodr.sendOrder.model.sendOrder.feedbacks").$D("反馈信息"),
          fieldCode: "feedback",
        },
        isSANJIANG && {
          fieldName: this.$T("sodr.sendOrder.model.common.specifications").$D("规格"),
          fieldCode: "specifications",
        },
        isSANJIANG && {
          fieldName: this.$T("sodr.sendOrder.model.common.outputCapacity").$D("产成率"),
          fieldCode: "attributeVarchar5",
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
    try {
      await this.getOrderHeader();
      await this.getOrderLine();
      await this.getOperationRecords();
      await this.queryDoubleUomConfig();
    } finally {
      this.$loading.hide();
    }
  },
  methods: {
    //留言板显示
    showBoardPop() {
      this.boardPop = !this.boardPop;
      this.unreadCount = 0;
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
      const headInfo = await getOrderHeaderApi(this.poHeaderId);
      if (!headInfo) {
        return;
      }
      this.headInfo = headInfo;

      const {
        attachmentUuid,
        supplierAttachmentUuid,
      } = headInfo;
      this.supplierAttachmentUuid = supplierAttachmentUuid ? supplierAttachmentUuid : uuid();
      this.purchaserAttachmentUuid = attachmentUuid ? attachmentUuid : uuid();
      if (!attachmentUuid) {
        const uuParms = {
          uuidType: 1,
          uuid: this.purchaserAttachmentUuid,
          poHeaderId: headInfo.poHeaderId
        };
        saveFileUUIDApi(uuParms);
      }
    },
    //获取订单行信息
    getOrderLine() {
      let params = {
        camp: 1, //1采购方2供应商
        page: this.page,
        size: this.size,
        sortType: 0, //排序类型
        customizeUnitCode: "SODR.SEND_ORDER_DETAIL.BASIC,SODR.SEND_ORDER_DETAIL.OTHER"
      };
      getOrderLineApi(this.poHeaderId, params).then((res) => {
        if (res) {
          this.lineInfo = res.content;
        }
      });
    },
    // 获取操作记录
    async getOperationRecords() {
      let params = {
        page:0,
        size: 0,
        tenantId: SrmUtil.getTenantId()
      };
      await getOpRecordApi(this.poHeaderId, params).then((res) => {
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
    // 获取业务规则定义-双单位配置
    async queryDoubleUomConfig() {
      await queryDoubleUomConfigApi().then((res) => {
        if (res) {
          this.isDoubleUnit = Number(res);
        }
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
