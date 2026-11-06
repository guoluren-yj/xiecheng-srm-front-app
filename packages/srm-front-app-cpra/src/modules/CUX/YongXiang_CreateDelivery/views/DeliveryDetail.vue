<template>
  <div style="height: 100vh; overflow: auto;">
    <div class="main-info">
      <!-- 头信息 -->
      <srm-detail-head :data-source="headInfo" :columns="getDetailHeadColumns">
        <div class="button-right-margin">
          <srm-button size="small" icon="icon-paperclip">
            <!-- <img src="@/assets/4.0/icon_Button_paperclip_highlight@3x.png"> -->
            <srm-upload
              :show-icon="false"
              :can-upload="true"
              :can-delete="true"
              :attachment-uuid="attachmentUuid"
              :show-count="false" color="blue"
              :title="$T('hipspfm.createDelivery.view.title.maintainAttachment').$D('维护明细附件')"
              :desc-title="$T('ssrc.inquiryHall.button.inquiryHall.file').$D('详情附件')" />
          </srm-button>
          <srm-button size="small" type="warn" icon="icon-clock" @click="showOperationPop">
            <!-- <img src="@/assets/4.0/icon_Button_clock_highlight@3x.png"> -->
            <span>{{ $T('hipspfm.common.message.title.operationRecord').$D('操作记录') }}</span>
          </srm-button>
          <srm-button size="small" type="danger" icon="icon-trash" @click="deleteDelivery">
            <!-- <span class="srm-icon icon-truck" style="font-size: 12px; margin-right: 2px" /> -->
            <span>{{ $T('hipspfm.createDelivery.view.message.deleteDetail').$D('删除明细') }}</span>
          </srm-button>
        </div>
      </srm-detail-head>

      <!-- 内容区域 -->
      <div class="detail-wrap">
        <srm-scroll-tab class="content">
          <srm-scroll-tab-item :label="$T('hipspfm.common.view.message.title.headInfo').$D('头信息')" >
            <customize ref="headInfo" code="SMBL.CREATE_DELIVERY.HEAD_INFO" :need-padding="true" :data-source="headInfo" :columns="getOrderHeadInfoColumns" />
          </srm-scroll-tab-item>
          <srm-scroll-tab-item :label="$T('hipspfm.common.view.message.title.lineInfo').$D('行信息')" >
            <div v-for="(item, index) in lineInfo" :key="index" @click="showLineDetail(item)">
              <customize ref="orderLineInfo" code="SMBL.CREATE_DELIVERY.LINE_INFO" :need-padding="true" :data-source="item" :columns="getOrderLineInfoColumns(index)" />
            </div>
          </srm-scroll-tab-item>
          <srm-scroll-tab-item :label="$T('sinv.common.view.title.logisticsInfo').$D('物流信息')" >
            <customize ref="logisticsInfo" code="SMBL.CREATE_DELIVERY.LOGISTIC_INFO" :need-padding="true" :data-source="headInfo" :columns="getLogsticColumns" />
          </srm-scroll-tab-item>
        </srm-scroll-tab>
      </div>
    </div>

    <!-- 行信息弹窗 -->
    <srm-popup :visible.sync="visible" height="100%" position="right" :title="$T('hipspfm.common.view.message.title.itemsInfo').$D('物料信息')">
      <div style="height: 100%; overflow: auto;">
        <customize-detail code="SMBL.CREATE_DELIVERY.LINE_INFO_DETAIL" :need-padding="true" :data-source="currentLineInfo" :columns="getOrderLineDetailInfoColumns" />
      </div>
    </srm-popup>

    <!-- 拆分弹框 -->
    <srm-popup :visible.sync="splitVisible" rounded :title="$T('sinv.common.view.title.splitsRule').$D('拆分细则')" class="popClass" :style="{height: obj.popHeight}" position="top"
               @onClose="clearInput">
      <srm-flex direction="column" justify="between" class="pop-body">
        <srm-flex direction="column" align="start" class="pop-content">
          <srm-flex-item>
            <srm-input-field v-model="obj.shipQuantity" type="number" :placeholder="$T('hipspfm.common.message.pleaseEnter').$D('请输入')"
                             :error="obj.quantityError" :error-message="obj.quantityErrorMessage" @blur="popBlur(1)">
              <span slot="left"><span style="color: red">*</span>{{ $T('sinv.common.view.title.quality').$D('到货车辆数量：') }}</span>
            </srm-input-field>
          </srm-flex-item>
          <srm-flex-item>
            <srm-input-field v-model="obj.weight" type="number" :placeholder="$T('hipspfm.common.message.pleaseEnter').$D('请输入')"
                             :error="obj.weightError" :error-message="obj.weightErrorMessage" @blur="popBlur(2)">
              <span slot="left"><span style="color: red">*</span>{{ $T('sinv.common.view.title.weight').$D('每车重量') }}：</span>
            </srm-input-field>
          </srm-flex-item>
        </srm-flex>
        <srm-flex justify="end" class="pop-bottom">
          <srm-button fill>
            <span @click="popupSure">{{ $T('sinv.common.view.button.sure').$D('确认') }}</span>
          </srm-button>
        </srm-flex>
      </srm-flex>
    </srm-popup>

    <!-- 历史记录弹窗 -->
    <history-record
      v-model="operationPopup"
      :action-data="operationArr"
      operator-field-name="processUser"
      operation-meaning-field-name="processStatusMeaning" />

    <srm-bottom-handler :btn-arr="getBtnArr" />
  </div>
</template>

<script>
import uuid from "uuid";
import HistoryRecord from "@/components/HistoryRecord";
import { dateFormat } from "@/utils/index";
import {
  getDetailHeadInfoApi,
  getDetailLineInfoApi,
  getOpRecordApi,
  deleteDeliveryApi,
  getAttachmentUuidApi,
  flashAttachmentUuidApi,
  submitMaintainDeliveryApi,
  deleteDeliveryLineInfoApi,
  saveMaintainDeliveryApi,
  flashAttachmentLineUuidApi,
  inspectionApi
} from "../api";

export default {
  modules: [ "sinv.common", "hipspfm.createDelivery", "hipspfm.common", "hzero.common", "ssrc.inquiryHall" ],
  name: "YongXiangDeliveryDetail",
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
      visible: false, //行信息弹窗
      currentLineInfo: {}, //当前行信息
      attachmentUuid: "",
      obj:{
        shipQuantity: null,
        quantityError: false,
        quantityErrorMessage: this.$T("sinv.common.view.message.placeholderQuantity").$D("请输入到货车辆数量"),
        weight: null,
        weightError: false,
        weightErrorMessage: this.$T("sinv.common.view.message.placeholderWeight").$D("请输入每车重量"),
        popHeight: "260px",
        item: null,
      },
      splitVisible: false,
    };
  },
  computed: {
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
      const columns = [
        {
          fieldName: this.$T("sinv.common.model.common.organizationName").$D("收货组织"),
          fieldCode: "organizationName",
        },
        {
          fieldName: this.$T("sinv.common.model.common.shipDate").$D("发货日期"),
          fieldCode: "shipDate",
          fieldType: "DATE",
          required: true,
        },
        {
          fieldName: this.$T("sinv.common.model.common.expectedArriveDate").$D("预计到货日期"),
          fieldCode: "expectedArriveDate",
          fieldType: "DATE",
          timePicker: true,
          required: true,
        },
        {
          fieldName: this.$T("sinv.common.model.common.remark").$D("备注"),
          fieldCode: "remark",
          fieldType: "INPUT",
        },
      ];

      return columns;
    },
    // 送货单行信息
    getOrderLineInfoColumns() {
      return (lineIndex) => [
        {
          formRow: 0,
          fieldCode: "customHeader",
          fieldType: "EMPTY",
          render: (val, item) => <SrmListHeader>
            <span>{item.itemName}</span>
            <span slot="right">{this.$T("sinv.common.model.common.asnLineNum").$D("行号")}：{item.asnLineNum}</span>
          </SrmListHeader>
        },
        {
          fieldName: this.$T("sinv.common.model.common.itemCode").$D("物料编码"),
          fieldCode: "itemCode",
        },
        {
          fieldName: this.$T("sinv.common.model.common.anyShipQuantity").$D("剩余可发货数"),
          fieldCode: "canShipQuantity",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: this.$T("sinv.common.model.common.unit").$D("单位"),
          fieldCode: "uomName",
          render: (val, item) => Number(item.unitCodeIsShow) ? `${item.uomCode}/${val}` : val,
        },
        {
          fieldName: this.$T("sinv.common.model.common.theShipQuantity").$D("本次发货"),
          fieldCode: "shipQuantity",
          fieldType: "INPUT_NUMBER",
          editor: true,
          editLimit: true,
          required: true,
          precision: (val, item) => typeof item.uomPrecision !== "undefined" ? Number(item.uomPrecision) : null,
        },
        {
          formRow: 10000,
          fieldCode: "customBottom",
          fieldType: "EMPTY",
          render: (val, record) => <SrmFlex justify="end">
            <SrmButton fill style="margin-right: 20px;" onClick={ () => this.splitDelivery(record, lineIndex)}>{ this.$T("hipspfm.createDelivery.view.button.demolitionOrders").$D("拆分") }</SrmButton>
            <SrmButton type="danger" fill onClick={ () => this.removeDelivery(record, lineIndex)} >{ this.$T("hipspfm.common.button.delete").$D("删除") }</SrmButton>
          </SrmFlex>
        },
      ];

    },
    // 行信息详情
    getOrderLineDetailInfoColumns() {
      return [
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
          fieldName: this.$T("hipspfm.createDelivery.model.createDelivery.quantityOfShipment").$D("本次发货数"),
          fieldCode: "shipQuantity",
          fieldType: "INPUT_NUMBER",
          editor: true,
          editLimit: true,
          precision: (val, item) => typeof item.uomPrecision !== "undefined" ? Number(item.uomPrecision) : null,
        },
        {
          fieldName: this.$T("sinv.common.model.common.anyShipQuantity").$D("剩余可发货数"),
          fieldCode: "canShipQuantity",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: this.$T("sinv.common.model.common.unit").$D("单位"),
          fieldCode: "uomName",
          render: (val, item) => Number(item.unitCodeIsShow) ? `${item.uomCode}/${val}` : val,
        },
        {
          fieldName: this.$T("sinv.common.model.common.displayPoNum").$D("订单号"),
          fieldCode: "displayPoNum",
        },
        {
          fieldName: this.$T("sinv.common.model.common.displayLineLocationNum").$D("发运号"),
          fieldCode: "displayLineLocationNum",
        },
        {
          fieldName: this.$T("sinv.common.model.common.displayReleaseNum").$D("发放号"),
          fieldCode: "releaseNum",
        },
        {
          fieldName: this.$T("sinv.common.model.common.displayLineNum").$D("订单行号"),
          fieldCode: "displayLineNum",
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
          fieldName: this.$T("sinv.common.model.common.productNum").$D("商品编码"),
          fieldCode: "productNum",
        },
        {
          fieldName: this.$T("sinv.common.model.common.productName").$D("商品名称"),
          fieldCode: "productName",
        },
        {
          fieldName: this.$T("sinv.common.model.common.catalog.name").$D("商品目录"),
          fieldCode: "catalogName",
        },
        {
          fieldName: this.$T("sinv.common.model.common.purchaseRemark").$D("采购方行备注"),
          fieldCode: "purchaseRemark",
          fieldType: "TEXT_AREA",
        },
        {
          fieldName: this.$T("sinv.common.model.common.supplierRemark").$D("供应商行备注"),
          fieldCode: "supplierRemark",
          fieldType: "TEXT_AREA",
        },
        {
          fieldName: this.$T("sinv.common.model.common.unitPackageQuantity").$D("单包装数"),
          fieldCode: "unitPackageQuantity",
          fieldType: "INPUT_NUMBER",
          precision: (val, item) => typeof item.uomPrecision !== "undefined" ? item.uomPrecision : null,
        },
        {
          fieldName: this.$T("sinv.common.model.common.packageQuantity").$D("件数"),
          fieldCode: "packageQuantity",
          fieldType: "INPUT_NUMBER",
          precision: (val, item) => typeof item.uomPrecision !== "undefined" ? item.uomPrecision : null,
        },
        {
          fieldName: this.$T("sinv.common.model.common.remainderQuantity").$D("尾数"),
          fieldCode: "remainderQuantity",
          fieldType: "INPUT_NUMBER",
          precision: (val, item) => typeof item.uomPrecision !== "undefined" ? item.uomPrecision : null,
        },
        // 批次号校验，不可输入中文
        {
          fieldName: this.$T("sinv.common.model.common.lotNum").$D("批次号"),
          fieldCode: "lotNum",
          fieldType: "INPUT",
          inputChange: (val, record) => {
            // 正则匹配中文，截取掉中文
            if (/[\u4e00-\u9fa5]/.test(val)) {
              setTimeout(() => {
                this.currentLineInfo["lotNum"] = val.replaceAll(/[\u4e00-\u9fa5]/g, "");
                this.lineInfo.find((item) => item.asnLineNum === record.asnLineNum)["lotNum"] = val.replaceAll(/[\u4e00-\u9fa5]/g, "");
                this.currentLineInfo = { ...this.currentLineInfo };
              }, 0);
            }
          },
        },
        {
          fieldName: this.$T("sinv.common.model.common.productionDate").$D("生产日期"),
          fieldCode: "productionDate",
          fieldType: "DATE",
        },
        {
          fieldName: this.$T("sinv.common.model.common.shelfLife").$D("保质期"),
          fieldCode: "shelfLife",
          fieldType: "INPUT",
        },
        {
          fieldName: this.$T("sinv.common.model.common.lotExpirationDate").$D("批次有效期"),
          fieldCode: "lotExpirationDate",
          fieldType: "DATE",
        },
        {
          fieldName: this.$T("sinv.common.model.common.serialNum").$D("序列号"),
          fieldCode: "serialNum",
          fieldType: "INPUT",
        },
        {
          fieldName: this.$T("sinv.common.model.common.invoiceNum").$D("发票号"),
          fieldCode: "invoiceNum",
          fieldType: "INPUT",
        },
        {
          fieldName: this.$T("sinv.common.model.common.lineAttachmentUuid").$D("行附件"),
          fieldCode: "attachmentUuid",
          render: (val, record) => <SrmUpload
            color="blue"
            attachmentUuid={val}
            canUpload={true}
            showIcon={false}
            onShowFilePopup={() => this.updateLineUuid(val, record)}
            title={this.$T("sinv.common.model.common.lineAttachmentUuid").$D("行附件")}
            descTitle={this.$T("hipspfm.common.button.uploadAttachment").$D("上传附件")} />
        }
      ];
    },
    // 物流信息
    getLogsticColumns() {
      return [
        {
          fieldName: this.$T("sinv.common.model.common.logisticsCompany").$D("物流公司"),
          fieldCode: "logisticsCompany",
          displayField: "logisticsCompanyMeaning",
          fieldType: "LOV",
          lovCode: "SINV.ASN_SHIPPER_NAME",
          options: {
            queryParams: { lovCode:"SINV.ASN_SHIPPER_NAME" }
          },
        },
        {
          fieldName: this.$T("sinv.common.model.common.logisticsStaff").$D("配送人员"),
          fieldCode: "logisticsStaff",
          fieldType: "INPUT",
        },
        {
          fieldName: this.$T("sinv.common.model.common.logisticsContactInfo").$D("联系方式"),
          fieldCode: "logisticsContactInfo",
          fieldType: "INPUT",
          inputType: "number",
        },
        {
          fieldName: this.$T("sinv.common.model.common.logisticsCost").$D("物流费用"),
          fieldCode: "logisticsCost",
          fieldType: "INPUT",
          inputType: "number",
        },
        {
          fieldName: this.$T("sinv.common.model.common.expressNum").$D("快递单号"),
          fieldCode: "expressNum",
          fieldType: "INPUT",
          // inputType: "number",
        },
        {
          fieldName: this.$T("sinv.common.model.common.logisticsPhoneNum").$D("收件人手机号"),
          fieldCode: "logisticsPhoneNum",
          fieldType: "INPUT",
          inputType: "number",
        },
      ];
    },
    // 按钮
    getBtnArr() {
      return [
        {
          type: "success",
          title: this.$T("hipspfm.common.button.save").$D("保存"),
          handler: this.saveDelivery
        },
        {
          title: this.$T("hipspfm.common.button.submit").$D("提交"),
          handler: this.submitDelivery
        },
      ];
    },
    getPopUpButtons() {
      return [
        {
          text: this.$T("sinv.common.view.button.canceled").$D("取消"),
          type: "danger",
          bordered: true,
          handler: () => {
          },
        },
        {
          text: this.$T("sinv.common.view.button.sure").$D("确定"),
          type: "primary",
          fill: true,
          handler: () => {
          },
        }
      ];
    },
    checkValidate() {
      return !this.$refs.headInfo.validate() || !this.$refs.logisticsInfo.validate() || !this.$refs.orderLineInfo.every((item) => item.validate());
    }
  },
  async mounted() {
    this.asnHeaderId = this.$route.query.asnHeaderId;
    await this.getOrderHeader();
    await this.getOrderLine();
    await this.getOpRecord();
  },
  methods: {
    // 查看操作记录
    showOperationPop() {
      this.operationPopup = !this.operationPopup;
    },
    // 查看行详情
    showLineDetail(item) {
      this.visible = !this.visible;
      this.currentLineInfo = item;
    },
    // 设置行上传附件uuid
    async updateLineUuid(val, line) {
      if (!val) {
        const UUID = uuid();
        const params = {
          _token: line._token,
          attachmentUuid: UUID,
          asnLineId: line.asnLineId,
          objectVersionNumber: line.objectVersionNumber,
        };

        flashAttachmentLineUuidApi(params).then((res) => {
          line.attachmentUuid = res.attachmentUuid;
          line.objectVersionNumber = res.objectVersionNumber;
        });
      }
    },
    //获取订单头信息
    async getOrderHeader() {
      const headInfo = await getDetailHeadInfoApi(this.asnHeaderId);

      this.headInfo = this.mergeHeadInfo(headInfo);
      this.oldData = JSON.stringify(this.headInfo);
      if (headInfo.asnHeaderId) {
        if (!headInfo.attachmentUuid && !headInfo.supplierAttachmentUuid) {
          const { content } = await getAttachmentUuidApi();

          this.attachmentUuid = content;
          const uuParms = {
            _token: headInfo._token,
            attachmentUuid: content,
            supplierAttachmentUuid: content,
            asnHeaderId: headInfo.asnHeaderId,
            objectVersionNumber: headInfo.objectVersionNumber,
          };

          await flashAttachmentUuidApi(uuParms);
          const newHeadInfo = await getDetailHeadInfoApi(this.asnHeaderId);

          this.headInfo = this.mergeHeadInfo(newHeadInfo);
          this.oldData = JSON.stringify(this.headInfo);
        } else {
          this.attachmentUuid = headInfo.attachmentUuid || headInfo.supplierAttachmentUuid;
        }
      }
    },
    // 合并头信息属性
    mergeHeadInfo(data) {
      return {
        logisticsContactInfo: "",
        logisticsCompany: "",
        logisticsStaff: "",
        logisticsCost: "",
        expressNum: "",
        ...data,
      };
    },
    // 刷新数据
    refreshScrollData() {
      this.getOrderHeader();
      this.getOrderLine();
    },
    //获取订单行信息
    getOrderLine() {
      this.$loading.show();
      getDetailLineInfoApi(this.asnHeaderId).then((res = []) => {
        this.$loading.hide();
        if (res && !res.failed) {
          this.lineInfo = res.map((item) => ({ attachmentUuid: "", ...item }));
        }
      });
    },
    //获取操作记录
    async getOpRecord() {
      let params = {
        page: 0,
        size: 10,
      };

      await getOpRecordApi(this.asnHeaderId, params).then(({ content = [] } = {}) => {
        this.operationArr = content;
      });
    },
    // 删除送货单
    deleteDelivery() {
      // eslint-disable-next-line consistent-this
      const self = this;

      this.$dialog({
        closable: false,
        content: self.$T("sinv.common.model.common.confirmDelete").$D("是否确认删除送货单"),
        onOk() {
          self.$loading.show();
          deleteDeliveryApi([ self.headInfo ]).then((res) => {
            self.$loading.hide();
            // eslint-disable-next-line no-empty
            if (res && res.failed) { } else {
              self.notify(self.$T("hipspfm.common.message.deleteSuccess").$D("删除成功"));
              self.deleteFlag = true;
              self.$router.replace({ name: "YongXiangDeliveryList" });
            }
          });
        }
      });
    },
    // 拆分
    // splitDelivery(item, index) {
    //   const newItem = JSON.parse(JSON.stringify(item));
    //   newItem.newFlag = true;
    //   newItem.shipQuantity = 0;
    //   newItem.asnLineId = null;
    //   newItem.displayAsnLineNum = null;
    //   newItem._token = null;
    //   // eslint-disable-next-line vue/no-mutating-props
    //   this.lineInfo.splice(index + 1, 0, newItem);
    // },
    // 拆分 - 永祥二开拆分逻辑：弹框1、到货车辆数量 2、每车重量
    splitDelivery(item) {
      if (this.checkValidate) {
        return;
      }
      this.splitVisible = true;
      this.obj.item = item;
    },
    clearInput() {
      this.obj.shipQuantity = null;
      this.obj.weight = null;
    },
    // 拆分规则
    popupSure() {
      // 到货车辆数量大于1才需要拆
      if (!this.obj.shipQuantity || !this.obj.weight || Number(this.obj.shipQuantity) < 1) {
        return;
      }
      // 后端判断 拆分总数不得超过可送货总数
      this.$loading.show();
      // 调用接口
      inspectionApi(
        {
          commonMap: {
            ...this.headInfo,
            shipDate: this.headInfo.shipDate + " 00:00:00",
            cars: Number(this.obj.shipQuantity),
            eachCarNum: Number(this.obj.weight),
            asnLineList: this.lineInfo,
            splitAsnLineId: this.obj.item.asnLineId,
          }
        }
      ).then((res) => {
        if (res && res.failed) {
          this.$notification.open({
            message: res.message,
          });
        } else {
          this.clearInput();
          this.splitVisible = false;
          // 更新行上信息
          this.getOrderLine();
          // 更新头上发货总数和版本号
          getDetailHeadInfoApi(this.asnHeaderId).then((headInfo) => {
            this.headInfo["totalQuantity"] = headInfo.totalQuantity;
            this.headInfo["objectVersionNumber"] = headInfo.objectVersionNumber;
          });
        }
      }).catch(() => {
      }).finally(() => {
        this.$loading.hide();
      });
    },
    popBlur(flag) {
      if (flag === 1 && !this.obj.shipQuantity) {
        this.obj.quantityError = true;
        this.obj.popHeight = "300px";
      } else {
        this.obj.quantityError = false;
      }
      if (flag === 2 && !this.obj.weight) {
        this.obj.weightError = true;
        this.obj.popHeight = "300px";
      } else {
        this.obj.weightError = false;
      }
      if (this.obj.shipQuantity && this.obj.weight) {
        this.obj.popHeight = "260px";
      }
    },
    // 删除拆分数据
    removeDelivery(item, index) {
      // eslint-disable-next-line consistent-this
      const self = this;

      if (item.newFlag) {
        // eslint-disable-next-line vue/no-mutating-props
        this.lineInfo.splice(index, 1);
      } else {
        deleteDeliveryLineInfoApi(this.asnHeaderId, [ item ]).then(() => {
          self.getOrderLine();
        });
      }
    },
    // 保存送货单
    saveDelivery(next) {
      if (this.checkValidate) {
        return;
      }
      // eslint-disable-next-line consistent-this
      const self = this;

      self.$loading.show();

      saveMaintainDeliveryApi({
        ...self.headInfo,
        shipDate: self.headInfo.shipDate + " 00:00:00",
        asnHeaderId: this.asnHeaderId,
        asnLineList: this.lineInfo
      }).then((res) => {
        self.$loading.hide();
        if (res && res.failed) {
          //请求拦截已做处理
        } else if (res) {
          const asnLineList = res.asnLineList || [];
          let msgArr = asnLineList.map((element, index) => `${self
            .$T("hipspfm.createDelivery.view.message.the")
            .$D("第")}${index + 1}${self
            .$T("hipspfm.createDelivery.view.message.line")
            .$D("行")},${self
            .$T("sinv.common.model.common.asnLineNum")
            .$D("行号")}: ${index + 1}, ${self
            .$T("hipspfm.createDelivery.view.message.displayAsnLineNum2")
            .$D("本次发货数量大于可发货数量")}`);
          let msg = msgArr.join(";");

          self.notify(msg);
        } else {
          self.notify(self.$T("hipspfm.common.message.saveSuccess").$D("保存成功"));
          self.refreshScrollData();
          if (typeof next === "function") {
            return next();
          }
        }
      });
    },
    // 提交维护送货单
    submitDelivery() {
      if (this.checkValidate) {
        return;
      }
      // eslint-disable-next-line consistent-this
      const self = this;

      this.$dialog({
        closable: false,
        content: self
          .$T("sinv.common.model.common.confirmSubmit")
          .$D("是否确认提交送货单"),
        onOk() {
          self.$loading.show();
          const params = [ { ...self.headInfo, shipDate: self.headInfo.shipDate + " 00:00:00", asnLineList: self.lineInfo } ];

          submitMaintainDeliveryApi(params).then((res) => {
            self.$loading.hide();
            if (res && res.length) {
              const asnLineList = res[0].asnLineList || [];
              let msgArr = asnLineList.map((element, index) =>
                `${self
                  .$T("hipspfm.createDelivery.view.message.the")
                  .$D("第")}${index + 1}${self
                  .$T("hipspfm.createDelivery.view.message.line")
                  .$D("行")},${self
                  .$T("sinv.common.model.common.asnLineNum")
                  .$D("行号")}: ${index + 1}, ${self
                  .$T("hipspfm.createDelivery.view.message.displayAsnLineNum2")
                  .$D("本次发货数量大于可发货数量")}`
                // return `第${index+1}行,行号: ${index+1}, 本次发货数量大于可发货数量`;
              );
              let msg = msgArr.join(";");

              this.$notification.open({
                message: msg,
                class: "notification"
              });
              // self.$hips.toast({ message: msg, duration: 3000 });
            // eslint-disable-next-line no-empty
            } else if (res && res.failed) {} else {
              this.$notification.open({
                message: self.$T("hipspfm.createDelivery.view.message.submitSuccessed").$D("提交成功"),
                class: "notification"
              });
              self.$router.replace({
                name: "YongXiangDeliveryList",
                params: { saveFlag: true }
              });
            }
          });
        },
      });
    },
    // 提示信息
    notify(msg) {
      this.$notification.open({
        message: msg,
        description: "",
        class: "notification"
      });
    },
  },
};
</script>

<style lang="stylus" scoped>

.main-info {
  height: 100%;
  overflow: scroll;
  padding-bottom: 75px;
  padding-bottom: calc(75px + constant(safe-area-inset-bottom));
  padding-bottom: calc(75px + env(safe-area-inset-bottom));
  .detail-wrap {
  height: calc(100vh - 100px);
  overflow: scroll;
  }
}

.popClass {
  width: 80%;
  left: 10%;
  top: 40%;
  >>> .srm-popup-top-border-radius {
    border-radius: 10px;
  }
  .pop-body {
    padding: 0 20px;
    height: 100%
  }
  .pop-content {
    margin: 10px 0
  }
  .pop-bottom {
    margin: 10px 0;
  }
}
</style>
