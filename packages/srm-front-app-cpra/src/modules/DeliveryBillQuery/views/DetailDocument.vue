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
          <srm-button size="small" type="info" icon="icon-truck" @click="showLogisticsPop">
            <!-- <span class="srm-icon icon-truck" style="font-size: 12px; margin-right: 2px" /> -->
            <span>{{ $T('sinv.supplierDelivery.view.message.title.logistics').$D('物流信息') }}</span>
          </srm-button>
          <srm-button size="small" type="success" icon="icon-printer" @click="printHandler">
            <!-- <span class="srm-icon icon-printer" style="font-size: 12px; margin-right: 2px" /> -->
            <span>{{ $T('ssrc.inquiryHall.view.message.button.print').$D('打印') }}</span>
          </srm-button>
        </div>
      </srm-detail-head>

      <!-- 内容区域 -->
      <srm-tab class="content">
        <srm-tab-pane :label="$T('sinv.purchaserDelivery.view.message.title.deliveryHeaderInfo').$D('送货单头信息')" >
          <customize ref="headInfo" :need-padding="true" code="SMBL.DELIVERY_BILL_QUERY.HEAD_INFO" :data-source="headInfo" :columns="getOrderHeadInfoColumns" />
        </srm-tab-pane>
        <srm-tab-pane :label="$T('hipspfm.deliveryQuery.view.message.title.deliveryLineInfo').$D('送货单行信息')" >
          <div v-for="(item, index) in lineInfo" :key="index" @click="showLineDetail(item)">
            <customize ref="orderLineInfo" :need-padding="true" code="SMBL.DELIVERY_BILL_QUERY.LINE_INFO" :data-source="item" :columns="getOrderLineInfoColumns" />
          </div>
        </srm-tab-pane>
      </srm-tab>
    </div>

    <srm-bottom-handler :btn-arr="getBtnArr" />

    <!-- 物流信息弹窗 -->
    <logistics-info v-if="logisticsPop" :id="asnHeaderId" v-model="logisticsPop" :logistics-info="headInfo" />

    <!-- 行信息弹窗 -->
    <srm-popup :visible.sync="visible" height="100%" position="right" :title="$T('hipspfm.common.view.message.title.itemsInfo').$D('物料信息')">
      <div style="height: 100%; overflow: auto;">
        <customize-detail v-if="isMallOrder" :need-padding="true" code="SMBL.DELIVERY_BILL_QUERY.MALL_LINE_DETAIL_INFO" :data-source="currentLineInfo" :columns="getMallOrderLineDetailInfoColumns" />
        <customize-detail v-else :need-padding="true" code="SMBL.DELIVERY_BILL_QUERY.LINE_DETAIL_INFO" :data-source="currentLineInfo" :columns="getOrderLineDetailInfoColumns" />
      </div>
    </srm-popup>

    <!-- 门店信息 -->
    <srm-popup
      v-if="storeInfoFlag"
      :visible.sync="storeInfoFlag"
      :title="$T('hipspfm.common.model.common.storeDetail').$D('门店明细')">
      <srm-list :data-set="storeInfoDs" :columns="getModelColumns" />
    </srm-popup>

    <!-- 历史记录弹窗 -->
    <history-record
      v-model="operationPopup"
      :action-data="operationArr"
      operator-field-name="processUser"
      operation-meaning-field-name="processStatusMeaning" />
  </div>
</template>

<script>
import { saveMaintainDeliveryApi, logSave, getOrderHeadInfo, getOrderLineInfo, getOperationRecordsApi, saveFileUUIDApi, getPrintFileApi, getPrintFileDownloadeApi } from "../api/index";
import uuid from "uuid";
import { DataSet, SrmUtil } from "srm-mobile-ui";
import HistoryRecord from "@/components/HistoryRecord";
import LogisticsInfo from "../components/LogisticsInfo";
import { storeInfoDs, logisticInfoDS } from "../datasource/indexDS.js";

import { dateFormat } from "@/utils/index";

export default {
  modules: [ "hipspfm.common", "sinv.purchaseReception", "sinv.common", "sinv.deliveryClosed", "ssrc.inquiryHall", "sinv.supplierDelivery", "sinv.purchaserDelivery", "hipspfm.deliveryQuery", "sinv.sodr", "entity.supplier", "spcm.common", "sodr.common", "hzero.common", "ssta.invoicePool", "hipspfm.createDelivery" ],
  name: "RfxHallDetail",
  components: {
    LogisticsInfo,
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
      downloadUrl: "", //附件下载地址
      visible: false, //行信息弹窗
      storeInfoFlag: false, //门店信息弹窗
      currentLineInfo: {}, //当前行信息
      storeInfoDs: {},
      logDataSet: null,
    };
  },
  computed: {
    fileArr() {
      if (!Object.keys(this.headInfo).length) {
        return [];
      }
      const { headInfo: { approveAttachmentUuid = uuid(), reviewAttachmentUuid = uuid(), supplierAttachmentUuid = uuid(), otherAttachmentUuid } } = this;

      return [
        { title: this.$T("hipspfm.common.view.message.title.auditFile").$D("审核附件"), attachmentUuid: approveAttachmentUuid, readOnly: true },
        { title: this.$T("hipspfm.common.view.message.title.reviewFile").$D("复核附件"), attachmentUuid: reviewAttachmentUuid, readOnly: true },
        { title: this.$T("hipspfm.common.view.message.title.otherFile").$D("其它附件"), attachmentUuid: otherAttachmentUuid, readOnly: false },
        { title: this.$T("hipspfm.common.view.message.title.supplierFile").$D("供应商附件"), attachmentUuid: supplierAttachmentUuid, readOnly: true },
      ];
    },
    isMallOrder() {
      return this.headInfo.asnTypeCode === "E_COMMERCE_DELIVERY_LIST";
    },
    isSanJiang() {
      return SrmUtil.getTenantNum() === "SRM-SANJIANG";
    },
    checkValidate() {
      return !this.$refs.headInfo.validate() || !this.$refs.orderLineInfo.every((item) => item.validate());
    },
    // 按钮
    getBtnArr() {
      return [
        {
          fill: true,
          title: this.$T("hipspfm.common.view.message.title.wlxxbl").$D("物流信息补录"),
          handler: this.logisticsRepairPop,
        },
        {
          fill: true,
          title: this.$T("hipspfm.common.view.message.title.save").$D("保存"),
          handler: this.handleSave,
        },
      ];
    },
    // 详情头
    getDetailHeadColumns() {
      const columns = [
        {
          fieldName: this.$T("sinv.purchaseReception.view.message.asnNum").$D("送货单号"),
          fieldCode: "asnNum",
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
          fieldName: this.$T("sinv.common.myPickList.modal.companyName").$D("客户"),
          fieldCode: "companyName",
        },
        {
          fieldName: this.$T("sinv.common.model.common.vendorCode").$D("供应商"),
          fieldCode: "supplierCompanyName",
        },
        {
          fieldName: this.$T("sinv.common.model.model.common.organizationName").$D("收货组织"),
          fieldCode: "organizationName",
        },
        {
          fieldName: this.$T("sinv.common.model.common.agentName").$D("采购员"),
          fieldCode: "purchaseAgentName",
          render: () => this.purchaseAgentName
        },
        {
          fieldName: this.$T("sinv.common.model.common.shipDate").$D("发货日期"),
          fieldCode: "shipDate",
          render: (val) => dateFormat(val),
        },
        {
          fieldName: this.$T("sinv.common.model.common.shipAddress").$D("收货地点"),
          fieldCode: "shipToLocationAddress",
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
            <span slot="right">{ this.$T("sinv.purchaseReception.view.message.lineNum").$D("行号") }：{item.asnLineNum}</span>
          </SrmListHeader>
        },
        {
          fieldName: this.$T("sinv.common.model.common.itemCode").$D("物料编码"),
          fieldCode: "itemCode",
        },
        {
          fieldName: this.$T("sinv.common.model.common.displayLineLocationNum").$D("发运号"),
          fieldCode: "displayLineLocationNum",
        },
        // {
        //   fieldName: "数量",
        //   fieldCode: "quantity",
        //   langCode: "sinv.common.model.common.amount",
        // },
        {
          fieldName: this.$T("sinv.common.model.common.sendQuantity").$D("发货数量"),
          fieldCode: "shipQuantity",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: this.$T("sinv.common.model.common.uomName").$D("单位"),
          fieldCode: "uomName",
          render: (val, item) => Number(item.unitCodeIsShow) ? `${item.uomCode}/${val}` : val,
        },
        {
          fieldName: this.$T("sinv.common.model.common.neededDate").$D("需求日期"),
          fieldCode: "neededDate",
          render: (val) => dateFormat(val)
        }
      ];

      return columns;
    },
    // 送货单行详细信息
    getMallOrderLineDetailInfoColumns() {
      const { isSanJiang } = this;
      const columns = [
        {
          fieldName: this.$T("sinv.common.model.common.asnLineNum").$D("行号"),
          fieldCode: "asnLineNum",
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
          fieldName: this.$T("sinv.common.model.common.sendQuantity").$D("发货数量"),
          fieldCode: "shipQuantity",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: this.$T("sinv.common.model.common.receiveQuantity").$D("已接收"),
          fieldCode: "receiveQuantity",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: this.$T("sinv.common.model.common.uomName").$D("单位"),
          fieldCode: "uomName",
          render: (val, item) => Number(item.unitCodeIsShow) ? `${item.uomCode}/${val}` : val,
        },
        {
          fieldName: this.$T("sinv.common.model.common.displayPoNum").$D("订单号"),
          fieldCode: "displayPoNum",
        },

        {
          fieldName: this.$T("sinv.common.model.common.displayLineNum").$D("订单行号"),
          fieldCode: "displayAsnLineNum",
        },
        {
          fieldName: this.$T("sinv.common.model.common.neededDate").$D("需求日期"),
          fieldCode: "neededDate",
          render: (val) => dateFormat(val)
        },
        {
          fieldName: this.$T("sinv.common.model.common.purchaseRemark").$D("采购方行备注"),
          fieldCode: "purchaseRemark",
          render: (val) => val ? val : this.$T("hipspfm.common.currency.none").$D("无")
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
    // 送货单行详细信息
    getOrderLineDetailInfoColumns() {
      const { isSanJiang } = this;
      const columns = [
        {
          fieldName: this.$T("sinv.common.model.common.asnLineNum").$D("行号"),
          fieldCode: "asnLineNum",
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
          fieldName: this.$T("sinv.common.model.common.sendQuantity").$D("发货数量"),
          fieldCode: "shipQuantity",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: this.$T("sinv.common.model.common.receiveQuantity").$D("已接收"),
          fieldCode: "receiveQuantity",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: this.$T("sinv.common.model.common.uomName").$D("单位"),
          fieldCode: "uomName",
          render: (val, item) => Number(item.unitCodeIsShow) ? `${item.uomCode}/${val}` : val,
        },
        {
          fieldName: this.$T("sinv.common.model.common.displayPoNum").$D("订单号"),
          fieldCode: "displayPoNum",
        },

        {
          fieldName: this.$T("sinv.common.model.common.displayLineNum").$D("订单行号"),
          fieldCode: "displayAsnLineNum",
        },
        {
          fieldName: this.$T("sinv.common.model.common.displayLineLocationNum").$D("发运号"),
          fieldCode: "displayLineLocationNum",
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
          fieldName: this.$T("sinv.common.model.common.purchaseRemark").$D("采购方行备注"),
          fieldCode: "purchaseRemark",
          render: (val) => val ? val : this.$T("hipspfm.common.currency.none").$D("无")
        },
        {
          fieldName: this.$T("sinv.common.model.common.supplierRemark").$D("供应商行备注"),
          fieldCode: "supplierRemark",
          render: (val) => val ? val : this.$T("hipspfm.common.currency.none").$D("无")
        },
        isSanJiang && {
          fieldName: this.$T("sinv.common.model.common.materialBarcode").$D("物料条码"),
          fieldCode: "attributeVarchar4",
        },
        isSanJiang && {
          fieldName: this.$T("sinv.common.model.common.specifications").$D("规格"),
          fieldCode: "attributeVarchar6",
        },
        isSanJiang && {
          fieldName: this.$T("sinv.common.model.common.packageQuantity").$D("件数"),
          fieldCode: "attributeBigint1",
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
        {
          fieldName: this.$T("sinv.sodr.common.view.button.attachment").$D("附件"),
          fieldCode: "attachmentUuid",
          render: (val) => <SrmUpload color="blue" descTitle={this.$T("sinv.deliveryClosed.view.button.attachment").$D("附件查看")} showIcon={false} attachmentUuid={val} />
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
    }
  },
  async mounted() {
    this.asnHeaderId = this.$route.query.asnHeaderId;
    // this.organizationName = this.$route.query.organizationName;
    this.purchaseAgentName = this.$route.query.purchaseAgentName;
    await this.getOrderHeader();
    await this.getOrderLine();
    this.getOperationRecords();
  },
  methods: {
    // 保存
    async handleSave(next) {
      if (this.checkValidate) {
        return;
      }
      // eslint-disable-next-line consistent-this
      const self = this;
      self.$loading.show();
      // eslint-disable-next-line no-undef
      saveMaintainDeliveryApi({
        ...self.headInfo,
        asnHeaderId: this.asnHeaderId,
        asnLineList: this.lineInfo,
      }).then((res) => {
        self.$loading.hide();
        if (res && res.failed) {
          //请求拦截已做处理
        } else {
          this.getOrderHeader();
          this.getOrderLine();
          this.$notification.open({
            message: this.$T("hipspfm.common.message.saveSuccess").$D("保存成功"),
          });
          if (self.refreshScrollData) {
            self.refreshScrollData();
          }
          if (typeof next === "function") {
            return next();
          }
        }
      });
    },
    refreshScrollData() {},
    showOperationPop() {
      this.operationPopup = !this.operationPopup;
    },
    // 查看物流信息
    showLogisticsPop() {
      this.logisticsPop = !this.logisticsPop;
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
    // 打印
    printHandler() {
      this.$loading.show();
      const { asnHeaderId } = this.headInfo;
      const downloadUrl = getPrintFileDownloadeApi(asnHeaderId);

      this.downloadUrl = downloadUrl;
      getPrintFileApi(asnHeaderId).then((res) => {
        this.$loading.hide();
        this.$previewFile({ preUrl: res, showDownbtn: true, downloadUrl, vm: this });
      }).finally(() => {
        this.$loading.hide();
      });
    },
    // 跳转物流信息补录
    logisticsRepairPop() {
      const { asnHeaderId } = this.headInfo;
      this.logDataSet = new DataSet(logisticInfoDS());
      this.logDataSet.addPathParameter("asnHeaderId", asnHeaderId);
      this.logDataSet.addQueryParameter("customizeUnitCode", "SINV.SUPPLIER_DELIVERY.DETAIL.ADD_LOGISTICS,SINV.PURCHASER_DELIVERY.DETAIL.HEADER,SINV.SUPPLIER_DELIVERY.DETAIL.LOGISTICS,SINV.PURCHASER_DELIVERY.DETAIL.HEADERSHIP");
      this.logDataSet.addQueryParameter("userCampCode", "PURCHASER");
      this.logDetailPopup = this.$popup({
        showHeader: true,
        showClose: true,
        position: "bottom",
        showBack: false,
        height: "100%",
        rounded:true,
        content: <SrmForm
          style={{ padding: "0 15px" }}
          customizeType="detail"
          customizeCode="SMBL.SUPPLIER_DELIVERY.DETAIL_HEAD.DETAIL"
          dataSet={this.logDataSet}
          buttons={this.logButtons()}
          columns={this.getColumns()}
        />,
      });
    },
    // 物流信息补录信息
    getColumns() {
      return [
        { fieldCode: "logisticsCompany" },
        { fieldCode: "logisticsStaff" },
        { fieldCode: "logisticsContactInfo" },
        { fieldCode: "expressNum" },
        { fieldCode: "logisticsCost" },
        { fieldCode: "logisticsPhoneNum", prefixField:{
          fieldCode: "internationalTelCode",
          lovCode: "HPFM.IDD",
          fieldType: "SELECT",
          defaultValue: { value: "+86", meaning: `${this.$T("hipspfm.common.view.message.title.internationalTelCode").$D("中国大陆")}+86` },
        } },
        { fieldCode: "logisticsReceiptStatus" },
        { fieldCode: "carNumber" },
      ];
    },
    // 物流信息补录按钮
    logButtons() {
      return [
        {
          text: this.$T("ssta.invoicePool.model.status.cancel").$D("取消"),
          type: "primary",
          fill: false,
          bordered: true,
          // visible: true,
          handler: () => {
            this.logDetailPopup.closePopup(); // 关闭弹框
            // this.logDataSet.refresh(); // 重新查询
          }
        },
        {
          text: this.$T("hipspfm.common.button.ok").$D("确定"),
          type: "primary",
          fill: true,
          // visible: true,
          handler: () => {
            this.logSaveData();
          }
        },
      ];
    },
    // 保存物流信息修改
    async logSaveData() {
      const { asnHeaderId } = this.headInfo;
      const customizeUnitCode = "SINV.SUPPLIER_DELIVERY.DETAIL.ADD_LOGISTICS";
      let data = this.logDataSet?.current?.toData();
      const validHeadFlag = await this.logDataSet.validate();
      if (validHeadFlag) {
        this.$loading.show();
        logSave(asnHeaderId, customizeUnitCode, { ...data }).then(() => {
          this.logDataSet.refresh();
        }).catch((e) => {
        // eslint-disable-next-line no-console
          console.info(e);
        }).finally(() => {
          this.$loading.hide();
          this.logDetailPopup.closePopup(); // 关闭弹框
          this.getOrderHeader();
        });
      }

    },
    // 获取头信息
    async getOrderHeader() {
      try {
        let param = {
          customizeUnitCode: "SINV.PURCHASER_DELIVERY.DETAIL.HEADER,SINV.SUPPLIER_DELIVERY.DETAIL.LOGISTICS,SINV.PURCHASER_DELIVERY.DETAIL.HEADERSHIP"
        };
        const headInfo = await getOrderHeadInfo(this.asnHeaderId, param) || {};

        this.organizationName = headInfo.organizationName;

        if (!headInfo.otherAttachmentUuid) {
          headInfo.otherAttachmentUuid = uuid();
          const uuParms = {
            _token: headInfo._token,
            asnHeaderId: headInfo.asnHeaderId,
            otherAttachmentUuid: headInfo.otherAttachmentUuid,
            objectVersionNumber: headInfo.objectVersionNumber,
          };

          await saveFileUUIDApi(uuParms);
        }
        this.headInfo = headInfo;
      } catch (err) {
        console.log(err);
      }
    },
    //获取订单行信息
    async getOrderLine() {
      this.$loading.show();
      let param = {
        customizeUnitCode: "SINV.PURCHASER_DELIVERY.DETAIL.BASIC,SINV.PURCHASER_DELIVERY.DETAIL.OTHER"
      };

      await getOrderLineInfo(this.asnHeaderId, param).then((res) => {
        this.$loading.hide();
        if (!res.empty) {
          this.lineInfo = res.content;
        }
      });
    },
    // 获取操作记录
    getOperationRecords() {
      const params = {
        asnHeaderId: this.asnHeaderId
      };

      getOperationRecordsApi(params).then((res) => {
        this.operationArr = res.content;
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
