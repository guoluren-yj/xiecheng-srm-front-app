<template>
  <div style="height: 100vh; overflow: auto;">
    <div class="main-info">
      <!-- 头信息 -->
      <srm-detail-head :data-source="headInfo" :columns="getDetailHeadColumns">
        <div class="button-right-margin">
          <srm-button size="small" icon="icon-paperclip">
            <!-- <img src="@/assets/DeliveryBill/icon_Button_paperclip_highlight@3x.png"> -->
            <srm-upload :is-tab="true" :show-icon="false" :show-count="false" color="blue" :file-arr="fileArr" :desc-title="$T('ssrc.inquiryHall.button.inquiryHall.file').$D('详情附件')" />
          </srm-button>
          <srm-button size="small" type="warn" icon="icon-clock" @click="showOperationPop">
            <!-- <img src="@/assets/DeliveryBill/icon_Button_clock_highlight@3x.png"> -->
            <span>{{ $T('hipspfm.common.message.title.operationRecord').$D('操作记录') }}</span>
          </srm-button>
        </div>
      </srm-detail-head>

      <!-- 内容区域 -->
      <srm-tab class="content">
        <srm-tab-pane :label="$T('sinv.purchaserDelivery.view.message.title.deliveryHeaderInfo').$D('送货单头信息')" >
          <customize :need-padding="true" code="SMBL.DELIVERY_BILL_APPROVAL.HEAD_INFO" :data-source="headInfo" :columns="getOrderHeadInfoColumns" />
        </srm-tab-pane>
        <srm-tab-pane :label="$T('hipspfm.deliveryQuery.view.message.title.deliveryLineInfo').$D('送货单行信息')" >
          <div v-for="(item, index) in lineInfo" :key="index" @click="showLineDetail(item)">
            <customize :need-padding="true" code="SMBL.DELIVERY_BILL_APPROVAL.LINE_INFO" :data-source="item" :columns="getOrderLineInfoColumns" />
          </div>
        </srm-tab-pane>
        <srm-tab-pane :label="$T('sinv.common.view.message.title.logistics').$D('物流信息')" >
          <customize :need-padding="true" code="SMBL.DELIVERY_BILL_APPROVAL.LOGISTIC_INFO" :data-source="headInfo" :columns="getLogisticColumns" />
        </srm-tab-pane>
      </srm-tab>
    </div>

    <!-- 行信息弹窗 -->
    <srm-popup :visible.sync="visible" height="100%" position="right" :title="$T('hipspfm.common.view.message.title.itemsInfo').$D('物料信息')">
      <div style="height: 100%; overflow: auto;">
        <customize-detail :need-padding="true" code="SMBL.DELIVERY_BILL_APPROVAL.LINE_DETAIL_INFO" :data-source="currentLineInfo" :columns="getOrderLineDetailInfoColumns" />
      </div>
    </srm-popup>

    <!-- 门店信息 -->
    <srm-popup
      v-if="storeInfoFlag"
      :visible.sync="storeInfoFlag"
      :title="$T('hipspfm.common.model.common.storeDetail').$D('门店明细')">
      <srm-list :data-set="storeInfoDs" :columns="getModelColumns" />
    </srm-popup>

    <srm-bottom-handler :btn-arr="getBtnArr" />

    <!-- 历史记录弹窗 -->
    <history-record
      v-model="operationPopup"
      :action-data="operationArr"
      operator-field-name="processUser"
      operation-meaning-field-name="processStatusMeaning" />
  </div>
</template>

<script>
import uuid from "uuid";
import { DataSet, SrmUtil } from "srm-mobile-ui";
import HistoryRecord from "@/components/HistoryRecord";
import { storeInfoDs } from "../datasource/indexDS.js";
import { adoptApi, rejectApi } from "../api";
import { dateFormat } from "@/utils/index";

import {
  getOpRecordApi,
  getOrderLineApi,
  getOrderHeaderApi
} from "../api/index";

export default {
  modules: [ "sinv.common", "hipspfm.common", "sinv.purchaseReception", "sinv.deliveryApproved", "hipspfm.deliveryApproved", "ssrc.inquiryHall", "sinv.purchaserDelivery", "hipspfm.deliveryQuery", "validation.message", "hipspfm.workFlow" ],
  name: "DeliveryBillDetail",
  components: {
    HistoryRecord,
  },
  data() {
    return {
      asnHeaderId: "",
      organizationName: "",
      purchaseAgentName: "", // 采购员
      operationArr: [], // 操作记录
      headInfo: {}, //头信息
      lineInfo: [], //行信息
      operationPopup: false, //操作记录弹窗标识
      logisticsPop: false, //物流信息标识
      visible: false, //行信息弹窗
      currentLineInfo: {}, //当前行信息
      storeInfoFlag: false, //门店信息弹窗
      storeInfoDs: {},
    };
  },
  computed: {
    fileArr() {
      if (!Object.keys(this.headInfo).length) {
        return [];
      }
      const { headInfo: { approveAttachmentUuid = uuid(), reviewAttachmentUuid = uuid(), supplierAttachmentUuid = uuid(), otherAttachmentUuid = uuid() } } = this;

      return [
        { title: this.$T("sinv.common.purchasersAuditAttachment").$D("审核附件"), attachmentUuid: approveAttachmentUuid, readOnly: false },
        { title: this.$T("sinv.common.view.purchaserReviewAttachment").$D("复核附件"), attachmentUuid: reviewAttachmentUuid, readOnly: true },
        { title: this.$T("sinv.common.view.otherAttachment").$D("采购方其他附件"), attachmentUuid: otherAttachmentUuid, readOnly: true },
        { title: this.$T("sinv.common.view.supplierAttachment").$D("供应商附件"), attachmentUuid: supplierAttachmentUuid, readOnly: true },
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
          // fieldName: "送货单号",
          fieldCode: "asnNum",
          // langCode: "sinv.purchaseReception.view.message.asnNum",
        },
        {
          fieldName: this.$T("sinv.purchaseReception.view.message.expectedArriveTimeFrom").$D("预计到货时间"),
          fieldCode: "expectedArriveDate",
        }
      ];

      return columns;
    },
    // 送货单头信息
    getOrderHeadInfoColumns() {
      const isSanJiang = SrmUtil.getTenantNum() === "SRM-SANJIANG";
      const columns = [
        {
          fieldName: this.$T("sinv.purchaseReception.view.message.asnTypeCode").$D("送货单类型"),
          fieldCode: "asnTypeCodeMeaning",
        },
        {
          fieldName: this.$T("sinv.common.model.common.vendorCode").$D("供应商"),
          fieldCode: "supplierCompanyName",
        },
        {
          fieldName: this.$T("sinv.common.myPickList.modal.companyName").$D("客户"),
          fieldCode: "companyName",
        },
        {
          fieldName: this.$T("sinv.common.model.model.common.organizationName").$D("收货组织"),
          fieldCode: "organizationName",
        },
        {
          fieldName: this.$T("sinv.common.model.common.shipToLocationAddress").$D("收货地点"),
          fieldCode: "shipToLocationAddress",
        },
        {
          fieldName: this.$T("sinv.common.model.common.supplierSiteName").$D("发货地点"),
          fieldCode: "supplierSiteName",
        },
        {
          fieldName: this.$T("sinv.common.model.common.immedShippedFlag").$D("是否直发"),
          fieldCode: "immedShippedFlag",
          render: (val) => val ? this.$T("hipspfm.common.status.yes").$D("是") : this.$T("hipspfm.common.status.no").$D("否")
        },
        {
          fieldName: this.$T("sinv.common.model.common.actualReceiverName").$D("送达方"),
          fieldCode: "actualReceiverName",
        },
        {
          fieldName: this.$T("sinv.common.model.common.shipmentsTotalQuantity").$D("发货总数"),
          fieldCode: "totalQuantity",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: this.$T("sinv.common.model.common.shipDate").$D("发货日期"),
          fieldCode: "shipDate",
          render: (val) => dateFormat(val),
        },
        {
          fieldName: this.$T("sinv.common.model.common.remark").$D("备注"),
          fieldCode: "remark",
          render: (val) => val ? val : this.$T("hipspfm.common.currency.none").$D("无")
        },
        isSanJiang && {
          fieldName: this.$T("sinv.common.model.common.oldItemCode22").$D("订单需求日期"),
          fieldCode: "attributeDate1",
          render: (val) => val ? val : this.$T("hipspfm.common.currency.none").$D("无")
        },
        isSanJiang && {
          fieldName: this.$T("sinv.common.model.common.contactInfo").$D("联系人"),
          fieldCode: "attributeVarchar2",
          render: (val) => val ? val : this.$T("hipspfm.common.currency.none").$D("无")
        },
        isSanJiang && {
          fieldName: this.$T("sinv.common.model.common.contactPhone").$D("联系人电话"),
          fieldCode: "attributeVarchar3",
          render: (val) => val ? val : this.$T("hipspfm.common.currency.none").$D("无")
        },
        isSanJiang && {
          fieldName: this.$T("sinv.common.model.common.transportType").$D("运输类型"),
          fieldCode: "transportTypeMeaning",
          render: (val) => val ? val : this.$T("hipspfm.common.currency.none").$D("无")
        },
      ];

      return columns;
    },
    // 送货单行信息
    getOrderLineInfoColumns() {
      const columns = [
        {
          formRow: 0,
          fieldCode: "customHeader",
          fieldType: "EMPTY",
          langCode: "sinv.common.myPickList.modal.companyName",
          render: (val, item) => <SrmListHeader>
            <span>{item.itemName}</span>
            <span slot="right">{ this.$T("sinv.purchaseReception.view.message.lineNum").$D("行号") }：{item.displayAsnLineNum}</span>
          </SrmListHeader>
        },
        {
          fieldName: this.$T("sinv.common.model.common.itemCode").$D("物料编码"),
          fieldCode: "itemCode",
        },
        {
          fieldName: this.$T("sinv.common.model.common.uomName").$D("单位"),
          fieldCode: "uomName",
          render: (val, item) => Number(item.unitCodeIsShow) ? `${item.uomCode}/${val}` : val,
        },
        {
          fieldName: this.$T("sinv.common.model.common.theShipQuantity").$D("本次发货"),
          fieldCode: "shipQuantity",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: this.$T("sinv.common.model.common.promiseDeliveryDate").$D("承诺交货日期"),
          fieldCode: "promisedDate",
          render: (val) => dateFormat(val)
        }
      ];

      return columns;
    },
    // 送货单行详细信息
    getOrderLineDetailInfoColumns() {
      const { isSanJiang } = this;
      const columns = [
        {
          fieldName: this.$T("sinv.common.model.common.asnLineNum").$D("行号"),
          fieldCode: "displayAsnLineNum",
        },
        {
          fieldName: this.$T("sinv.common.model.common.itemCode").$D("物料编码"),
          fieldCode: "itemCode",
        },
        {
          fieldName: this.$T("sinv.common.model.common.itemName").$D("物料名称"),
          fieldCode: "itemName",
        },
        {
          fieldName: this.$T("sinv.common.model.common.num").$D("数量"),
          fieldCode: "quantity",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: this.$T("sinv.common.model.common.canShipQuantity").$D("可发货"),
          fieldCode: "canShipQuantity",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: this.$T("sinv.common.model.common.uomName").$D("单位"),
          fieldCode: "uomName",
          render: (val, item) => Number(item.unitCodeIsShow) ? `${item.uomCode}/${val}` : val,
        },
        {
          fieldName: this.$T("sinv.common.model.common.theShipQuantity").$D("本次发货"),
          fieldCode: "shipQuantity",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: this.$T("sinv.common.model.common.unitPackageQuantity").$D("单包装数"),
          fieldCode: "unitPackageQuantity",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: this.$T("sinv.common.model.common.packageQuantity").$D("件数"),
          fieldCode: "packageQuantity",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: this.$T("sinv.common.model.common.remainderQuantity").$D("尾数"),
          fieldCode: "remainderQuantity",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: this.$T("sinv.common.model.common.lotNum").$D("批次号"),
          fieldCode: "lotNum",
        },
        {
          fieldName: this.$T("sinv.purchaseReception.message.lotExpirationDate").$D("批次有效期"),
          fieldCode: "lotExpirationDate",
          render: (val) => dateFormat(val)
        },
        {
          fieldName: this.$T("sinv.common.model.common.productionDate").$D("生产日期"),
          fieldCode: "productionDate",
          render: (val) => dateFormat(val)
        },
        {
          fieldName: this.$T("sinv.common.model.common.shelfLife").$D("保质期"),
          fieldCode: "shelfLife",
          render: (val) => dateFormat(val)
        },
        {
          fieldName: this.$T("sinv.common.model.common.neededDate").$D("需求日期"),
          fieldCode: "neededDate",
          render: (val) => dateFormat(val)
        },
        {
          fieldName: this.$T("sinv.common.model.common.promiseDeliveryDate").$D("承诺交货日期"),
          fieldCode: "promisedDate",
          render: (val) => dateFormat(val)
        },
        {
          fieldName: this.$T("sinv.common.model.common.displayPoNum").$D("订单号"),
          fieldCode: "displayPoNum",
        },
        {
          fieldName: this.$T("sinv.common.model.common.displayLineNum").$D("订单行号"),
          fieldCode: "displayLineNum",
        },
        {
          fieldName: this.$T("sinv.common.model.common.serialNum").$D("序列号"),
          fieldCode: "serialNum",
        },
        {
          fieldName: this.$T("sinv.common.model.common.displayReleaseNum").$D("发放号"),
          fieldCode: "displayReleaseNum",
        },
        {
          fieldName: this.$T("sinv.common.model.common.versionNum").$D("版本"),
          fieldCode: "versionNum",
        },
        {
          fieldName: this.$T("sinv.common.model.common.contactInfo").$D("联系人"),
          fieldCode: "contactInfo",
        },
        {
          fieldName: this.$T("sinv.common.model.common.invoiceNum").$D("发票号"),
          fieldCode: "invoiceNum",
        },
        {
          fieldName: this.$T("sinv.common.model.common.purchaseRemark").$D("采购方行备注"),
          fieldCode: "purchaseRemark",
        },
        {
          fieldName: this.$T("sinv.common.model.common.suppliersRemark").$D("供应商备注"),
          fieldCode: "remark",
        },
        {
          fieldName: this.$T("sinv.common.model.common.lineAattachment").$D("行附件"),
          fieldCode: "attachmentUuid",
          fieldType: "UPLOAD",
        },
        {
          fieldName: this.$T("sinv.common.model.common.product.number").$D("商品编码"),
          fieldCode: "productNum",
        },
        {
          fieldName: this.$T("sinv.common.model.common.product.name").$D("商品名称"),
          fieldCode: "productName",
        },
        {
          fieldName: this.$T("sinv.common.model.common.catalog.name").$D("商品目录"),
          fieldCode: "catalogName",
        },

        isSanJiang && {
          fieldName: this.$T("sinv.common.model.common.materialBarcode").$D("物料条码"),
          fieldCode: "attributeVarchar4",
        },
        isSanJiang && {
          fieldName: this.$T("sinv.common.model.common.packageQuantity").$D("件数"),
          fieldCode: "attributeBigint1",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        isSanJiang && {
          fieldName: this.$T("sinv.common.model.common.poUnitPrice").$D("含税单价"),
          fieldCode: "attributeDecimal3",
        },
        isSanJiang && {
          fieldName: this.$T("sinv.common.model.common.taxIncludedUnitPrice").$D("含税行金额"),
          fieldCode: "attributeDecimal4",
        },
        isSanJiang && {
          fieldName: this.$T("sinv.common.model.common.excludingTaxPrice").$D("不含税行金额"),
          fieldCode: "attributeDecimal5",
        },
        isSanJiang && {
          fieldName: this.$T("sinv.common.model.common.storeDetail").$D("门店明细"),
          fieldCode: "storeDetail",
          render: (val, record) => <span style="color: blue" onClick={() => this.clickToViewStoreDetail(record.asnLineId)} >{ this.$T("sinv.common.model.common.clickToView").$D("点击查看") }</span>
        },
      ];

      return columns;
    },
    // 物流信息
    getLogisticColumns() {
      const columns = [
        {
          fieldName: this.$T("sinv.common.model.common.logisticsCompany").$D("物流公司"),
          fieldCode: "logisticsCompany",
        },
        {
          fieldName: this.$T("sinv.common.model.common.logisticsStaff").$D("配送人员"),
          fieldCode: "logisticsStaff",
        },
        {
          fieldName: this.$T("sinv.common.model.common.logisticsContactInfo").$D("联系方式"),
          fieldCode: "logisticsContactInfo",
        },
        {
          fieldName: this.$T("sinv.common.model.common.logisticsCost").$D("物流费用"),
          fieldCode: "logisticsCost",
        },
        {
          fieldName: this.$T("sinv.common.model.common.expressNum").$D("快递单号"),
          fieldCode: "expressNum",
        },
      ];

      return columns;
    },
    // 门店信息
    getModelColumns() {
      const columns = [
        {
          fieldName: this.$T("sinv.common.model.common.storeName").$D("门店名称"),
          fieldCode: "storeName",
        },
        {
          fieldName: this.$T("sinv.common.model.common.shippedQuantitys").$D("需求数量"),
          fieldCode: "needQuantity",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: this.$T("sinv.common.model.common.sendQuantity").$D("发货数量"),
          fieldCode: "shipQuantity",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
      ];

      return columns;
    },
    // 按钮
    getBtnArr() {
      return [
        {
          title: this.$T("hipspfm.common.message.pass").$D("通过"),
          handler: () => this.handlerPre("pass"),
        },
        {
          type: "danger",
          title: this.$T("hipspfm.common.message.reject").$D("拒绝"),
          handler: () => this.handlerPre("reject")
        },
      ];
    }
  },
  async mounted() {
    this.asnHeaderId = this.$route.query.asnHeaderId;
    this.organizationName = this.$route.query.organizationName;
    this.purchaseAgentName = this.$route.query.purchaseAgentName;
    await this.getOrderHeader();
    await this.getOrderLine();
    this.getOperationRecords();
  },
  methods: {
    showOperationPop() {
      this.operationPopup = !this.operationPopup;
    },
    // 查看行详情
    showLineDetail(item) {
      this.visible = !this.visible;
      this.currentLineInfo = item;
    },
    // 打开门店信息
    clickToViewStoreDetail(asnLineId) {
      this.storeInfoDs = new DataSet(storeInfoDs(asnLineId));
      this.storeInfoFlag = !this.storeInfoFlag;
    },
    // 获取头信息
    async getOrderHeader() {
      try {
        let param = {
          customizeUnitCode: "SINV.PURCHASER_DELIVERY.DETAIL.HEADER,SINV.SUPPLIER_DELIVERY.DETAIL.LOGISTICS,SINV.PURCHASER_DELIVERY.DETAIL.HEADERSHIP"
        };

        this.$loading.show();

        const headInfo = await getOrderHeaderApi(this.asnHeaderId, param);

        this.$loading.hide();
        this.headInfo = headInfo;
        const {
          approveAttachmentUuid = uuid(),
          otherAttachmentUuid = uuid(),
          reviewAttachmentUuid = uuid(),
          supplierAttachmentUuid = uuid()
        } = headInfo;

        this.approveAttachmentUuid = approveAttachmentUuid;
        this.otherAttachmentUuid = otherAttachmentUuid;
        this.reviewAttachmentUuid = reviewAttachmentUuid;
        this.supplierAttachmentUuid = supplierAttachmentUuid;
      } catch (err) {
        this.$loading.hide();
      }
    },
    //获取订单行信息
    async getOrderLine() {
      const params = {
        page: 0,
        size: 1000,
        customizeUnitCode: "SINV.PURCHASER_DELIVERY.DETAIL.BASIC,SINV.PURCHASER_DELIVERY.DETAIL.OTHER"
      };

      this.$loading.show();
      getOrderLineApi(this.asnHeaderId, params).then((res) => {
        this.$loading.hide();
        if (!res.empty) {
          this.lineInfo = res.content || [];
        }
      });
    },
    // 获取操作记录
    getOperationRecords() {
      this.$loading.show();
      getOpRecordApi(this.asnHeaderId).then((res) => {
        this.$loading.hide();
        this.operationArr = res.content || [];
      });
    },
    handlerPre(type) {
      if (type === "pass") {
        this.$confirm({
          title: this.$T("sinv.deliveryApproved.model.deliveryApproved.approveRemark").$D("审批意见"),
          onOk: (remark, close) => {
            close();
            this.passHandler(remark);
          }
        });
      } else {
        this.$confirm({
          required: true,
          title: this.$T("sinv.deliveryApproved.model.deliveryApproved.approveRemark").$D("审批意见"),
          onOk: (remark, close) => {
            close();
            this.rejectHandler(remark);
          }
        });
      }

    },
    // 通过
    passHandler(approvedRemark) {
      // eslint-disable-next-line consistent-this
      const self = this;

      this.$dialog({
        content: this.$T("validation.message.refuseDeliveryBill").$D("是否通过该送货单") + "？",
        closable: false,
        onOk() {
          const params = self.buildParams(approvedRemark);

          this.$loading.show();
          adoptApi(params).then((res) => {
            this.$loading.hide();
            if (res.length) {
              self.$notification.open({
                message: this.$T(
                  "hipspfm.common.view.validation.approvelSuccess"
                ).$D("审批通过成功"),
                description: "",
                key: "approvel",
                class: "notification",
                duration: 3
              });
              setTimeout(() => {
                self.$router.replace({ name: "DeliveryBillList" });
              }, 1000);
            }
          });
        },
      });
    },
    // 拒绝
    rejectHandler(approvedRemark) {
      // eslint-disable-next-line consistent-this
      const self = this;

      this.$dialog({
        content: this.$T("hipspfm.deliveryApproved.validation.message.refusesDeliveryBill").$D("是否拒绝该送货单?"),
        closable: false,
        onOk() {
          const params = self.buildParams(approvedRemark);

          this.$loading.show();
          rejectApi(params).then((res) => {
            this.$loading.hide();
            if (res.length) {
              self.$notification.open({
                message: this.$T("hipspfm.common.view.validation.rejectSuccess").$D("审批拒绝成功"),
                description: "",
                key: "refuse",
                class: "notification",
                duration: 3
              });
              setTimeout(() => {
                self.$router.replace({ name: "DeliveryBillList" });
              }, 1000);
            }
          });
        },
      });
    },
    // 处理传参
    buildParams(approvedRemark) {
      const { _token, asnHeaderId, objectVersionNumber } = this.headInfo;
      const params = [
        {
          _token,
          asnHeaderId,
          objectVersionNumber,
        }
      ];

      if (approvedRemark) {
        params[0].approvedRemark = approvedRemark;
      }
      return params;
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
