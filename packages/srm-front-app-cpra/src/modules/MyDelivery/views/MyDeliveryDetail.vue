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
          <srm-button size="small" type="success" icon="icon-printer" @click="printHandler">
            <!-- <span class="srm-icon icon-printer" style="font-size: 12px; margin-right: 2px" /> -->
            <span>{{ $T('ssrc.inquiryHall.view.message.button.print').$D('打印') }}</span>
          </srm-button>
        </div>
      </srm-detail-head>

      <!-- 内容区域 -->
      <srm-tab class="content">
        <srm-tab-pane :label="$T('sinv.purchaserDelivery.view.message.title.deliveryHeaderInfo').$D('送货单头信息')" >
          <customize :need-padding="true" code="SMBL.MYDELIVERY.HEADINFO" :data-source="headInfo" :columns="getOrderHeadInfoColumns" />
        </srm-tab-pane>
        <srm-tab-pane :label="$T('hipspfm.deliveryQuery.view.message.title.deliveryLineInfo').$D('送货单行信息')" >
          <div v-for="(item, index) in lineInfo" :key="index" @click="showLineDetail(item)">
            <customize :need-padding="true" code="SMBL.MYDELIVERY.LINE_INFO" :data-source="item" :columns="getOrderLineInfoColumns" />
          </div>
        </srm-tab-pane>
        <srm-tab-pane :label="$T('sinv.supplierDelivery.view.message.title.logistics').$D('物流信息')" >
          <customize :need-padding="true" code="SMBL.MYDELIVERY.LOGISTIC_INFO" :data-source="logisticInfo" :columns="getLogisticInfoColumns" />
        </srm-tab-pane>
      </srm-tab>
    </div>

    <srm-bottom-handler :btn-arr="getBtnArr" />

    <!-- 行信息弹窗 -->
    <srm-popup :visible.sync="visible" height="100%" position="right" :title="$T('hipspfm.common.view.message.title.itemsInfo').$D('物料信息')">
      <div style="height: 100%; overflow: auto;">
        <customize-detail :need-padding="true" code="SMBL.MYDELIVERY.LINE_DETAIL_INFO" :data-source="currentLineInfo" :columns="getOrderLineDetailInfoColumns" />
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
import uuid from "uuid";
import { DataSet, SrmUtil } from "srm-mobile-ui";
import HistoryRecord from "@/components/HistoryRecord";
import { storeInfoDs, logisticInfoDS } from "../datasource/indexDS.js";
import { dateFormat } from "@/utils/index";

import { logSave, getOrderHeadInfo, getOrderLineInfo, getOperationRecordsApi, getPrintFileApi, getPrintFileDownloadeApi, saveApi } from "../api/index";

export default {
  modules: [ "hipspfm.common", "sinv.common", "sinv.deliveryClosed", "ssrc.inquiryHall", "sinv.purchaserDelivery", "hipspfm.deliveryQuery", "sinv.supplierDelivery", "sinv.purchaseReception", "sinv.sodr", "ssta.invoicePool" ],
  name: "RfxHallDetail",
  components: {
    HistoryRecord,
  },
  data() {
    return {
      asnHeaderId: "",
      organizationName: "",
      // purchaseAgentName: "",// 采购员
      operationArr: [], // 操作记录
      headInfo: {}, //头信息
      lineInfo: [], //行信息
      operationPopup: false, //操作记录弹窗标识
      downloadUrl: "", //附件下载地址
      visible: false, //行信息弹窗
      storeInfoFlag: false, //门店信息弹窗
      currentLineInfo: {}, //当前行信息
      storeInfoDs: {},
      logisticInfo: {
        logisticsCompany: "", //物流公司
        logisticsStaff: "", // 配送人员
        logisticsContactInfo: "", // 联系方式
        logisticsCost: "", // 物流费用
        expressNum: "", //快递单号
      },
      logDataSet:null,
    };
  },
  computed: {
    fileArr() {
      if (!Object.keys(this.headInfo).length) {
        return [];
      }
      const { headInfo: { approveAttachmentUuid = uuid(), reviewAttachmentUuid = uuid(), supplierAttachmentUuid = uuid(), otherAttachmentUuid = uuid() } } = this;

      return [
        { title: this.$T("hipspfm.common.view.message.title.auditFile").$D("审核附件"), attachmentUuid: approveAttachmentUuid, readOnly: true },
        { title: this.$T("hipspfm.common.view.message.title.reviewFile").$D("复核附件"), attachmentUuid: reviewAttachmentUuid, readOnly: true },
        { title: this.$T("hipspfm.common.view.message.title.otherFile").$D("其它附件"), attachmentUuid: otherAttachmentUuid, readOnly: true },
        { title: this.$T("hipspfm.common.view.message.title.supplierFile").$D("供应商附件"), attachmentUuid: supplierAttachmentUuid, readOnly: true },
      ];
    },
    // 按钮
    getBtnArr() {
      return [
        {
          title: this.$T("hipspfm.common.button.save").$D("保存"),
          handler: this.saveHandler
        },
        {
          fill: true,
          title: this.$T("hipspfm.common.view.message.title.wlxxbl").$D("物流信息补录"),
          handler: this.logisticsRepairPop,
        }
      ];
    },
    isSanJiang() {
      return SrmUtil.getTenantNum() === "SRM-SANJIANG";
    },
    // 详情头
    getDetailHeadColumns() {
      const columns = [
        {
          fieldCode: "asnNum",
        },
        {
          fieldName: this.$T("sinv.common.model.common.customer").$D("客户"),
          fieldCode: "companyName",
        }
      ];

      return columns;
    },
    // 送货单头信息
    getOrderHeadInfoColumns() {
      const isSanJiang = SrmUtil.getTenantNum() === "SRM-SANJIANG";
      const columns = [
        {
          fieldName: this.$T("sinv.common.model.common.vendorCode").$D("供应商"),
          fieldCode: "supplierCompanyName",
        },
        {
          fieldName: this.$T("sinv.common.model.model.common.organizationName").$D("收货组织"),
          fieldCode: "organizationName",
        },
        {
          fieldName: this.$T("sinv.common.model.common.shipDate").$D("发货日期"),
          fieldCode: "shipDate",
          render: (val) => dateFormat(val),
        },
        {
          fieldName: this.$T("sinv.common.model.common.immedShippedFlag").$D("是否直发"),
          fieldCode: "immedShippedFlag",
          render: (val) => val ? this.$T("hipspfm.common.status.yes").$D("是") : this.$T("hipspfm.common.status.no").$D("否")
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
            <span slot="right">
              {
                item.cancelledFlag === 1 ?
                  this.$T("sinv.common.model.common.cancelledFlag").$D("已取消") :
                  item.closedFlag === 1 ? this.$T("sinv.common.model.common.closedFlag").$D("已关闭") : ""
              }
            </span>
          </SrmListHeader>
        },
        {
          fieldName: this.$T("sinv.common.model.common.itemCode").$D("物料编码"),
          fieldCode: "itemCode",
        },
        {
          fieldName: this.$T("sinv.purchaseReception.view.message.lineNum").$D("行号"),
          fieldCode: "asnLineNum",
        },
        {
          fieldName: this.$T("sinv.supplierDelivery.model.supplierDelivery.shipQuantity").$D("发货数量"),
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
          fieldName: this.$T("sinv.supplierDelivery.model.supplierDelivery.receiveQuantity").$D("已接收"),
          fieldCode: "receiveQuantity",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: this.$T("sinv.common.model.common.receiveStatus").$D("接收状态"),
          fieldCode: "receiveStatusMeaning",
        }
      ];

      return columns;
    },
    // 物流信息
    getLogisticInfoColumns() {
      const columns = [
        {
          fieldName: this.$T("sinv.common.model.common.logisticsCompany").$D("物流公司"),
          fieldCode: "logisticsCompany",
          // fieldType: "INPUT",
        },
        {
          fieldName: this.$T("sinv.common.model.common.logisticsStaff").$D("配送人员"),
          fieldCode: "logisticsStaff",
          // fieldType: "INPUT",
        },
        {
          fieldName: this.$T("sinv.common.model.common.logisticsContactInfo").$D("联系方式"),
          fieldCode: "logisticsContactInfo",
          // fieldType: "INPUT",
        },
        {
          fieldName: this.$T("sinv.common.model.common.logisticsCost").$D("物流费用"),
          fieldCode: "logisticsCost",
          // fieldType: "INPUT",
        },
        {
          fieldName: this.$T("sinv.common.model.common.expressNum").$D("快递单号"),
          fieldCode: "expressNum",
          // fieldType: "INPUT",
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
          fieldName: this.$T("sinv.common.model.common.uomName").$D("单位"),
          fieldCode: "uomName",
          render: (val, item) => Number(item.unitCodeIsShow) ? `${item.uomCode}/${val}` : val,
        },
        {
          fieldName: this.$T("sinv.common.model.common.receiveStatus").$D("接收状态"),
          fieldCode: "receiveStatusMeaning",
        },
        {
          fieldName: this.$T("sinv.common.model.common.receiveQuantity").$D("已接收"),
          fieldCode: "receiveQuantity",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: this.$T("sinv.common.model.common.displayPoNum").$D("订单号"),
          fieldCode: "displayPoNum",
        },

        // {
        //   fieldName: "订单行号",
        //   fieldCode: "displayAsnLineNum",
        //   langCode: "sinv.common.model.common.displayLineNum",
        // },
        // {
        //   fieldName: "订单发运号",
        //   fieldCode: "displayLineLocationNum",
        //   langCode: "sinv.common.model.common.displayLineLocationNum",
        // },
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
          fieldName: this.$T("sinv.sodr.common.view.button.attachment").$D("附件"),
          fieldCode: "attachmentUuid",
          render: (val) => <SrmUpload color="blue" descTitle={this.$T("sinv.deliveryClosed.view.button.attachment").$D("附件查看")} showIcon={false} attachmentUuid={val} />
        },
        {
          fieldName: this.$T("sinv.common.model.common.product.number").$D("商品编码"),
          fieldCode: "productNum",
        },
        {
          fieldName: this.$T("sinv.common.model.common.catalog.name").$D("商品目录"),
          fieldCode: "catalogName",
        },
        {
          fieldName: this.$T("sinv.common.model.common.product.name").$D("商品名称"),
          fieldCode: "productName",
        },
        {
          fieldName: this.$T("sinv.common.model.common.purchaseRemark").$D("采购方行备注"),
          fieldCode: "purchaseRemark",
          render: (val) => val ? val : this.$T("hipspfm.common.currency.none").$D("无")
        },
        isSanJiang && {
          fieldName: this.$T("sinv.common.model.common.materialBarcode").$D("物料条码"),
          fieldCode: "attributeVarchar4",
        },
        // isSanJiang && {
        //   fieldName: "规格",
        //   fieldCode: "attributeVarchar6",
        //   langCode: "sinv.common.model.common.specifications",
        // },
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
    // this.purchaseAgentName = this.$route.query.purchaseAgentName;
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
      this.logDataSet.addQueryParameter("customizeUnitCode", "SINV.SUPPLIER_DELIVERY.DETAIL.HEADER,SINV.SUPPLIER_DELIVERY.DETAIL.ADD_LOGISTICS,SINV.SUPPLIER_DELIVERY.DETAIL.HEADERSHIP");
      this.logDataSet.addQueryParameter("userCampCode", "SUPPLIER");
      this.logDataSet.refresh();
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
        { fieldCode: "logisticsPhoneNum",
          prefixField:{
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
          visible: true,
          handler: () => {
            this.logDetailPopup.closePopup(); // 关闭弹框
            // this.logDataSet.refresh(); // 重新查询
          }
        },
        {
          text: this.$T("hipspfm.common.button.ok").$D("确定"),
          type: "primary",
          fill: true,
          visible: true,
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
    // 保存
    saveHandler() {
      let params = {
        ...this.logisticInfo,
        asnHeaderId: this.headInfo.asnHeaderId,
        objectVersionNumber: this.headInfo.objectVersionNumber ?
          this.headInfo.objectVersionNumber :
          "",
        _token: this.headInfo._token,
        ...this.headInfo,
        asnLineList:this.lineInfo,
      };

      saveApi(params).then((res) => {
        if (res && !res.failed) {
          this.$notification.open({
            message: this.$T("hipspfm.common.message.saveSuccess").$D("保存成功"),
          });
       this.getOrderHeader();
     this.getOrderLine();
          // setTimeout(() => {
          //   this.$router.replace({ name: "MyDeliveryList" });
          // }, 1000);
        }
      });
    },
    // 获取头信息
    async getOrderHeader() {
      try {
        let param = {
          customizeUnitCode: "SINV.PURCHASER_DELIVERY.DETAIL.HEADER,SINV.SUPPLIER_DELIVERY.DETAIL.LOGISTICS,SINV.PURCHASER_DELIVERY.DETAIL.HEADERSHIP"
        };
        const headInfo = await getOrderHeadInfo(this.asnHeaderId, param) || {};

        this.organizationName = headInfo.organizationName;

        // if (!headInfo.otherAttachmentUuid) {
        //   headInfo.otherAttachmentUuid = uuid();
        //   const uuParms = {
        //     _token: headInfo._token,
        //     asnHeaderId: headInfo.asnHeaderId,
        //     otherAttachmentUuid: headInfo.otherAttachmentUuid,
        //     objectVersionNumber: headInfo.objectVersionNumber,
        //   };

        //   await saveFileUUIDApi(uuParms);
        // }
        const { logisticsCompany = "", logisticsStaff = "", logisticsContactInfo = "", logisticsCost = "", expressNum = "" } = headInfo;

        this.logisticInfo = { logisticsCompany, logisticsStaff, logisticsContactInfo, logisticsCost, expressNum };
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
