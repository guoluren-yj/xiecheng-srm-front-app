<template>
  <div style="height: 100vh">
    <srm-list
      :data-set="type === 'UNCHECKED' ? dataSet1 : dataSet2"
      customize-code="SMBL.PURCHASER_INVOICE.LIST"
      :columns="getListColumns"
      :buttons="getListButtons"
      @itemClick="onItemClick">
      <srm-tab-bar
        slot="filter"
        :tabs="[
          $T('ssta.invoicePool.view.message.tab.toBeReleased').$D('待查验'),
          $T('ssta.invoicePool.view.message.tab.finisheds').$D('已查验'),
        ]"
        display="justify"
        @indexChange="onTabIndexChange"/>
      <srm-flex slot="bottom" class="round-btn-box" justify="end">
        <srm-button
          class="round-btn"
          size="x-large"
          circle
          type="primary"
          fill
          @click="openPopup">
          <em class="srm-icon icon-plus" />
        </srm-button>
      </srm-flex>
    </srm-list>

    <!-- 操作记录 -->
    <history-record
      v-model="showHistoryRecord"
      :loading="historyRecordLoading"
      :action-data="historyRecords"
      operation-meaning-field-name="processStatusMeaning"
      operator-field-name="processUser"
      process-remark-info-field-name="processRemark"/>
  </div>
</template>

<script>
import uuid from "uuid";
import { isEmpty, isNil } from "lodash";
import indexDS from "../datasource";
import { DataSet, SrmUtil } from "srm-mobile-ui";
import {
  cancelInvoice,
  checkInvoice,
  getHistory,
  ocrApi,
  editInvoiceApi,
  createInvoiceApi,
  uploadAttachApi,
  getAttachApi,
} from "../api";
import HistoryRecord from "@/components/HistoryRecord";
import SrmFileList from "@/components/SrmFileList";
import { previewFile } from "srm-mobile-ui/src/utils/index";
import scoreUpload from "../component/score-upload.vue";

export default {
  modules: [
    "sodr.common",
    "ssrc.bidHall",
    "ssrc.inquiryHall",
    "sodr.scheduleSheet",
    "smbl.common",
    "ssta.invoicePool",
    "ssta.invoiceSheet",
    "ssta.purchaseInvoicePool",
    "hmde.common",
    "hipspfm.common",
  ],
  name: "PurchaserInvoicePool",
  // eslint-disable-next-line vue/no-unused-components
  components: { HistoryRecord, SrmFileList, scoreUpload },
  data() {
    return {
      type: "UNCHECKED",
      dataSet1: new DataSet(indexDS("UNCHECKED")), // 待查验
      dataSet2: new DataSet(indexDS("CHECKED")), // 已查验
      createPopup: false,
      createOnePopup: false,
      editPopup: false,
      ocrPopup: false,
      pop: false,
      editImg: require("@/assets/PurchaserInvoicePool/edit.svg"),
      pencilImg: require("@/assets/PurchaserInvoicePool/icon_Establishlist_editor_normal@3x.png"),
      cameraImg: require("@/assets/PurchaserInvoicePool/camera-plus.svg"),
      historyRecords: [],
      showHistoryRecord: false,
      historyRecordLoading: false,
      attachmentUuid: "",
      data: {},
    };
  },
  computed: {
    // 列表行数据
    getListColumns() {
      return [
        {
          formRow: 1,
          fieldCode: "header",
          fieldType: "EMPTY",
          render: (val, item) => {
            const invoiceStatus = item.invoiceStatus;
            const statusType = {
              NORMAL: "success",
              NEGATIVE: "danger",
              INVALID: "info",
            };
            return (
              <SrmListHeader>
                {item.invoiceNum}
                <SrmButton
                  slot="right"
                  plain
                  rect
                  style={{ fontWeight: "bold" }}
                  type={statusType[invoiceStatus]}
                >
                  {item.invoiceStatusMeaning}
                </SrmButton>
              </SrmListHeader>
            );
          },
        },
        { fieldCode: "invoiceCode", required: false },
        { fieldCode: "invoiceTypeMeaning", required: false },
        { fieldCode: "belongCompanyName", required: false },
        { fieldCode: "belongSupplierCompanyName", required: false },
      ];
    },
    // 选中按钮操作
    getListButtons() {
      return [
        {
          text: this.$T("ssta.invoicePool.model.status.cancel").$D("取消"),
          type: "primary",
          fill: false,
          bordered: true,
          visible: true,
          disabled: (checkedList) => checkedList.length === 0,
          callback: (checkedList) => {
            let list = [];
            checkedList.map((res) => {
              if (res.data && res.data.cancelledFlag === 0) {
                list.push(res.data);
              }
            });
            if (list.length === 0) {
              return;
            }
            this.$loading.show();
            cancelInvoice(list)
              .then((res) => {
                this.dataSet1.refresh();
                this.dataSet2.refresh();
                if (res && res.failed) {
                  this.$notification.open({
                    message: res.message,
                    duration: 1000,
                  });
                } else {
                  this.$notification.open({
                    message: this.$T(
                      "ssta.invoicePool.model.status.optionSuccess"
                    ).$D("操作成功"),
                    duration: 1000,
                  });
                }
              })
              .finally(() => {
                this.$loading.hide();
              });
          },
        },
        {
          text: this.$T("ssta.invoicePool.model.status.checkInvoice").$D(
            "查验发票"
          ),
          type: "primary",
          fill: true,
          visible: true,
          disabled: (checkedList) => checkedList.length === 0,
          callback: (checkedList) => {
            let list = [];
            checkedList.map((res) => {
              if (res.data && res.data.enableCheckFlag === 1) {
                list.push(res.data);
              }
            });
            if (list.length === 0) {
              return;
            }
            this.$loading.show();
            list.map((item) => {
              item.invoicingDate = item.invoicingDate ?
                SrmUtil.dateFormat(item.invoicingDate, "yyyy-MM-dd hh:mm:ss") :
                item.invoicingDate;
            });
            checkInvoice(list)
              .then((res) => {
                this.dataSet1.refresh();
                this.dataSet2.refresh();
                if (res && res.failed) {
                  this.$notification.open({
                    message: res.message,
                    duration: 3000,
                  });
                  return;
                }
                if (!isEmpty(res)) {
                  const desc = Object.values(res)
                    .map((item) => item.desc)
                    .join();
                  this.$notification.open({
                    message: desc,
                    duration: 3000,
                  });
                  return;
                }
                this.$notification.open({
                  message: this.$T("smbl.common.message.acction.success").$D(
                    "操作成功"
                  ),
                  duration: 3000,
                });
              })
              .finally(() => {
                this.$loading.hide();
              });
          },
        },
      ];
    },
  },
  methods: {
    // tab栏切换
    onTabIndexChange(index) {
      if (index === 0) {
        this.type = "UNCHECKED";
        this.dataSet1.refresh();
      } else {
        this.type = "CHECKED";
        this.dataSet2.refresh();
      }
    },
    // 点击详情
    onItemClick(item) {
      if (this.type === "UNCHECKED") {
        this.dataSet1.current.data = this.formateData(item.data);
        let flag = true;
        if (
          item.data.documentStatus === "ASSOCIATED" ||
          item.data.cancelledFlag === 1
        ) {
          flag = false;
        }
        this.openEditPopup(flag);
      } else if (this.type === "CHECKED") {
        this.$router.push({ name: "InvoiceInfo", params: { data: item.data } });
      }
    },
    // 点击新增弹框
    openCreatePopup() {
      this.dataSet1.create({}, 0);
      this.dataSet1.locate(0);
      this.createOnePopup = this.$popup({
        title: this.$T("ssta.invoicePool.model.status.handCreate").$D(
          "手工录入"
        ),
        showHeader: true,
        showClose: false,
        position: "right",
        showBack: true,
        onClose: () => {
          this.dataSet1.refresh();
          this.createPopup.closePopup();
        },
        content:
          <SrmForm
            style={{ padding: "0 15px" }}
            customizeType="detail"
            customize-code="SMBL.PURCHASER_INVOICE.EDIT"
            dataSet={this.dataSet1}
            buttons={this.getCreateButtons()}
            columns={this.getCreateColumns()}
            onDelete={() => this.createOnePopup.closePopup()}
            onUpdate={() => this.createOnePopup.closePopup()}
            onSubmit={() => this.createOnePopup.closePopup()}
          />
        ,
      });
    },
    // 点击编辑弹框
    openEditPopup(f) {
      if (f) {
        this.editPopup = this.$popup({
          showHeader: false,
          showClose: false,
          position: "right",
          showBack: true,
          content:
            <SrmForm
              style={{ padding: "0 15px" }}
              customizeType="detail"
              customize-code="SMBL.PURCHASER_INVOICE.EDIT"
              dataSet={
                this.type === "UNCHECKED" ? this.dataSet1 : this.dataSet2
              }
              buttons={this.getEditButtons()}
              columns={this.getEditColumns()}
              onDelete={() => this.editPopup.closePopup()}
              onUpdate={() => this.editPopup.closePopup()}
              onSubmit={() => this.editPopup.closePopup()}
            />
          ,
        });
      } else {
        this.editPopup = this.$popup({
          showHeader: false,
          showClose: false,
          position: "right",
          showBack: true,
          content:
            <SrmForm
              style={{ padding: "0 15px" }}
              customizeType="detail"
              customize-code="SMBL.PURCHASER_INVOICE.EDIT"
              dataSet={
                this.type === "UNCHECKED" ? this.dataSet1 : this.dataSet2
              }
              buttons={[]}
              columns={this.getDetailColumns()}
              onDelete={() => this.editPopup.closePopup()}
              onUpdate={() => this.editPopup.closePopup()}
              onSubmit={() => this.editPopup.closePopup()}
            />
          ,
        });
      }
    },
    getEditButtons() {
      return [
        {
          text: this.$T("ssta.invoicePool.model.status.cancel").$D("取消"),
          type: "primary",
          fill: false,
          bordered: true,
          visible: true,
          handler: () => {
            this.editPopup.closePopup();
            this.dataSet1.refresh();
          },
        },
        {
          text: this.$T("ssta.invoicePool.model.status.finish").$D("完成"),
          type: "primary",
          fill: true,
          visible: true,
          handler: () => {
            if (this.type === "UNCHECKED") {
              if (
                this.validate({
                  ...this.dataSet1.current.data,
                  ...this.data,
                })
              ) {
                return;
              }
              this.$loading.show();
              uploadAttachApi({
                attachmentUuid: this.dataSet1.current.data.attachmentUuid,
                invoiceCode: this.dataSet1.current.data.invoiceCode,
                invoiceHeaderId: this.dataSet1.current.data.invoiceHeaderId,
                invoiceNum: this.dataSet1.current.data.invoiceNum,
                objectVersionNumber:
                  this.dataSet1.current.data.objectVersionNumber,
              })
                .then((res) => {
                  if (res && res.failed) {
                    this.$notification.open({
                      message: res.message,
                      duration: 3000,
                    });
                  } else {
                    this.dataSet1.current.data.objectVersionNumber =
                      res.objectVersionNumber;
                  }
                })
                .finally(() => {
                  editInvoiceApi({
                    ...this.dataSet1.current.data,
                    ...this.data,
                  })
                    .then((res) => {
                      if (res && res.failed) {
                        this.$notification.open({
                          message: res.message,
                          duration: 3000,
                        });
                      } else {
                        this.$notification.open({
                          message: this.$T(
                            "ssta.invoicePool.model.status.optionSuccess"
                          ).$D("操作成功"),
                          duration: 1000,
                        });
                      }
                      this.$loading.hide();
                      this.data = {};
                      this.editPopup.closePopup();
                      this.dataSet1.refresh();
                    })
                    .finally(() => {
                      this.$loading.hide();
                    });
                });
            }
          },
        },
      ];
    },
    getDetailColumns() {
      return [
        {
          formRow: 1,
          fieldCode: "header",
          fieldType: "EMPTY",
          render: (val, item) =>
            <SrmFlex>
              <SrmButton
                fill
                bordered
                onClick={() => {
                  this.showAttachRecords(1, item);
                }}
              >
                {this.$T("ssta.invoicePool.model.status.attach").$D("附件")}
              </SrmButton>
              <SrmButton
                v-show={item.ocrFileUrl}
                bordered
                style={{ marginLeft: "10px" }}
                onClick={() => {
                  this.showAttachRecords(2, item);
                }}
              >
                {this.$T("ssta.invoicePool.model.status.ocrFile").$D("OCR文件")}
              </SrmButton>
              <SrmButton
                bordered
                style={{ marginLeft: "10px" }}
                onClick={() => {
                  this.showHistoryRecords(item.invoiceHeaderId);
                }}
              >
                {this.$T("sodr.common.view.button.operationRecord").$D(
                  "操作记录"
                )}
              </SrmButton>
            </SrmFlex>
          ,
        },
        {
          fieldCode: "invoiceType",
          fieldType: "TEXT",
          render: (val, item) =>
            item.invoiceTypeMeaning ? item.invoiceTypeMeaning : "-",
        },
        {
          fieldCode: "invoiceCode",
          fieldType: "TEXT",
          render: (val) => val ? val : "-",
        },
        {
          fieldCode: "invoiceNum",
          fieldType: "TEXT",
          render: (val) => val ? val : "-",
        },
        {
          fieldCode: "invoicingDate",
          fieldType: "TEXT",
          render: (val) => val ? val : "-",
        },
        {
          fieldCode: "netAmount",
          fieldType: "TEXT",
          render: (val) => val ? val : "-",
        },
        {
          fieldCode: "taxAmount",
          fieldType: "TEXT",
          render: (val) => val ? val : "-",
        },
        {
          fieldCode: "belongCompanyName",
          fieldType: "TEXT",
          render: (val) => val ? val : "-",
        },
        {
          fieldCode: "belongSupplierCompanyName",
          fieldType: "TEXT",
          render: (val) => val ? val : "-",
        },
        {
          fieldCode: "companyName",
          fieldType: "TEXT",
          render: (val) => val ? val : "-",
        },
        {
          fieldCode: "supplierCompanyName",
          fieldType: "TEXT",
          render: (val) => val ? val : "-",
        },
        {
          fieldCode: "checkCode",
          fieldType: "TEXT",
          render: (val) => val ? val : "-",
        },
        {
          fieldCode: "memo",
          fieldType: "TEXT",
          render: (val) => val ? val : "-",
        },
      ];
    },
    getEditColumns() {
      return [
        {
          formRow: 1,
          fieldCode: "header",
          fieldType: "EMPTY",
          render: (val, item) =>
            <SrmFlex>
              <SrmButton
                fill
                bordered
                onClick={() => {
                  this.showAttachRecords(1, item);
                }}
              >
                {this.$T("ssta.invoicePool.model.status.attach").$D("附件")}
              </SrmButton>
              <SrmButton
                v-show={item.ocrFileUrl}
                bordered
                style={{ marginLeft: "10px" }}
                onClick={() => {
                  this.showAttachRecords(2, item);
                }}
              >
                {this.$T("ssta.invoicePool.model.status.ocrFile").$D("OCR文件")}
              </SrmButton>
              <SrmButton
                bordered
                style={{ marginLeft: "10px" }}
                onClick={() => {
                  this.showHistoryRecords(item.invoiceHeaderId);
                }}
              >
                {this.$T("sodr.common.view.button.operationRecord").$D(
                  "操作记录"
                )}
              </SrmButton>
            </SrmFlex>
          ,
        },
        { fieldCode: "invoiceType" },
        { fieldCode: "invoiceCode", fieldType: "INPUT" },
        { fieldCode: "invoiceNum", fieldType: "INPUT" },
        { fieldCode: "invoicingDate" },
        { fieldCode: "netAmount" },
        { fieldCode: "taxAmount" },
        {
          fieldCode: "belongCompanyId",
          displayField: "belongCompanyName",
          options: {
            multiple: false,
            subDisplayField: "companyNum",
            jsonByField: this.jsonByField,
            callback: (val) => {
              if (val && val[0]) {
                this.jsonByField(val, "companyId1");
              }
            },
          },
        },
        {
          fieldCode: "belongSupplierCompanyId",
          displayField: "belongSupplierCompanyName",
          options: {
            multiple: false,
            subDisplayField: "supplierCompanyNum",
            jsonByField: this.jsonByField,
            callback: (val) => {
              if (val && val[0]) {
                this.jsonByField(val, "companyId2");
              }
            },
          },
        },
        {
          fieldCode: "companyId",
          options: {
            multiple: false,
            subDisplayField: "unifiedSocialCode",
            jsonByField: this.jsonByField,
            callback: (val) => {
              if (val && val[0]) {
                this.jsonByField(val, "companyId3");
              }
            },
          },
        },
        {
          fieldCode: "supplierCompanyId",
          options: {
            multiple: false,
            subDisplayField: "unifiedSocialCode",
            jsonByField: this.jsonByField,
            callback: (val) => {
              if (val && val[0]) {
                this.jsonByField(val, "companyId4");
              }
            },
          },
        },
        { fieldCode: "checkCode" },
        { fieldCode: "memo" },
      ];
    },
    getCreateButtons() {
      return [
        {
          text: this.$T("ssta.invoicePool.model.status.finish").$D("完成"),
          type: "primary",
          fill: false,
          bordered: true,
          visible: true,
          handler: () => {
            let params = [];
            params.push({
              checkCode: this.dataSet1.current.data.checkCode,
              invoiceCode: this.dataSet1.current.data.invoiceCode,
              invoiceNum: this.dataSet1.current.data.invoiceNum,
              invoiceType: this.dataSet1.current.data.invoiceType,
              invoicingDate: this.dataSet1.current.data.invoicingDate,
              netAmount: this.dataSet1.current.data.netAmount,
              taxAmount: this.dataSet1.current.data.taxAmount,
              memo: this.dataSet1.current.data.memo,
              __dirty: true,
              invoiceSource: "MOBILE",
              ...this.data,
              camp: "PURCHASER",
            });
            if (this.validate(params[0])) {
              return;
            }
            this.$loading.show();
            createInvoiceApi(params)
              .then((res) => {
                if (res && res.failed) {
                  this.$notification.open({
                    message: res.message,
                    duration: 3000,
                  });
                } else {
                  this.$loading.hide();
                  this.$notification.open({
                    message: this.$T(
                      "ssta.invoicePool.model.status.addSuccess"
                    ).$D("新增成功"),
                    duration: 1000,
                  });
                  this.data = {};
                  this.createOnePopup.closePopup();
                  this.dataSet1.refresh();
                }
              })
              .finally(() => {
                this.$loading.hide();
              });
          },
        },
        {
          text: this.$T("ssta.invoicePool.model.status.finishAndContinue").$D(
            "完成并继续录入"
          ),
          type: "primary",
          fill: true,
          visible: true,
          handler: () => {
            let params = [];
            params.push({
              checkCode: this.dataSet1.current.data.checkCode,
              invoiceCode: this.dataSet1.current.data.invoiceCode,
              invoiceNum: this.dataSet1.current.data.invoiceNum,
              invoiceType: this.dataSet1.current.data.invoiceType,
              invoicingDate: this.dataSet1.current.data.invoicingDate,
              netAmount: this.dataSet1.current.data.netAmount,
              taxAmount: this.dataSet1.current.data.taxAmount,
              memo: this.dataSet1.current.data.memo,
              __dirty: true,
              invoiceSource: "MOBILE",
              ...this.data,
            });
            if (this.validate(params[0])) {
              return;
            }
            this.$loading.show();
            createInvoiceApi(params)
              .then((res) => {
                if (res && res.failed) {
                  this.$notification.open({
                    message: res.message,
                    duration: 3000,
                  });
                } else {
                  this.$loading.hide();
                  this.$notification.open({
                    message: this.$T(
                      "ssta.invoicePool.model.status.addSuccess"
                    ).$D("新增成功"),
                    duration: 1000,
                  });
                  this.data = {};
                  this.dataSet1.create({}, 0);
                }
              })
              .finally(() => {
                this.$loading.hide();
              });
          },
        },
      ];
    },
    getCreateColumns() {
      return [
        { fieldCode: "invoiceType" },
        { fieldCode: "invoiceCode", fieldType: "INPUT" },
        { fieldCode: "invoiceNum", fieldType: "INPUT" },
        { fieldCode: "invoicingDate" },
        { fieldCode: "netAmount" },
        { fieldCode: "taxAmount" },
        {
          fieldCode: "belongCompanyId",
          displayField: "belongCompanyName",
          options: {
            multiple: false,
            subDisplayField: "companyNum",
            jsonByField: this.jsonByField,
            callback: (val) => {
              if (val && val[0]) {
                this.jsonByField(val, "companyId1");
              }
            },
          },
        },
        {
          fieldCode: "belongSupplierCompanyId",
          displayField: "belongSupplierCompanyName",
          options: {
            multiple: false,
            subDisplayField: "supplierCompanyNum",
            jsonByField: this.jsonByField,
            callback: (val) => {
              if (val && val[0]) {
                this.jsonByField(val, "companyId2");
              }
            },
          },
        },
        {
          fieldCode: "companyId",
          options: {
            multiple: false,
            subDisplayField: "unifiedSocialCode",
            jsonByField: this.jsonByField,
            callback: (val) => {
              if (val && val[0]) {
                this.jsonByField(val, "companyId3");
              }
            },
          },
        },
        {
          fieldCode: "supplierCompanyId",
          options: {
            multiple: false,
            subDisplayField: "unifiedSocialCode",
            jsonByField: this.jsonByField,
            callback: (val) => {
              if (val && val[0]) {
                this.jsonByField(val, "companyId4");
              }
            },
          },
        },
        { fieldCode: "checkCode" },
        { fieldCode: "memo" },
      ];
    },
    // 封装新增和编辑的字段
    jsonByField([ val ], valueField) {
      if (valueField === "companyId1") {
        this.data["belongCompanyIdLov"] = { ...val };
        this.data["belongCompanyId"] = `${val.companyId}`;
        this.data["belongCompanyName"] = val.companyName;
      }
      if (valueField === "companyId2") {
        this.data["belongSupplierCompanyIdLov"] = { ...val };
        this.data["belongSupplierCompanyId"] = `${
          val.supplierId ? val.supplierId : val.supplierCompanyId
        }`;
        this.data["belongSupplierCompanyName"] = val.supplierName ?
          val.supplierName :
          val.supplierCompanyName;
        this.data["belongSupplierId"] = val.supplierId;
      }
      if (valueField === "companyId3") {
        this.data["companyNameLov"] = { ...val };
        this.data["companyId"] = `${val.companyId}`;
        this.data["companyName"] = val.companyName;
      }
      if (valueField === "companyId4") {
        this.data["supplierCompanyNameLov"] = { ...val };
        this.data["supplierCompanyId"] = val.supplierCompanyId;
        this.data["supplierCompanyName"] = val.supplierCompanyName;
        this.data["supplierTenantId"] = val.supplierTenantId;
      }
    },
    // 封装数据
    formateData(item) {
      return {
        ...item,
        belongCompanyIdLov: {
          companyId: item.belongCompanyId,
          companyName: item.belongCompanyName,
        },
        belongSupplierCompanyIdLov: {
          companyId: item.belongSupplierCompanyId,
          companyName: item.belongSupplierCompanyName,
        },
        companyNameLov: {
          companyId: item.companyId,
          companyName: item.companyName,
          unifiedSocialCode: item.purUnifiedSocialCode,
        },
        supplierCompanyNameLov: {
          companyId: item.companyId,
          companyName: item.companyName,
          supplierTenantId: item.supplierTenantId,
          tenantId: item.tenantId,
          unifiedSocialCode: item.supUnifiedSocialCode,
        },
        __dirty: true,
      };
    },
    validate(item) {
      let msg = "";
      if (!item.invoiceType) {
        let subMsg = this.$T(
          "ssta.purchaseInvoicePool.model.purchaseInvoicePool.invoiceTypeList"
        ).$D("发票类型");
        msg = this.$T("smbl.common.view.pleaseInput", [ subMsg ]).$D(
          "请输入发票类型"
        );
      } else if (
        item.invoiceType !== "17" &&
        item.invoiceType !== "18" &&
        item.invoiceType !== "19" &&
        !item.invoiceCode
      ) {
        let subMsg = this.$T(
          "ssta.purchaseInvoicePool.model.purchaseInvoicePool.invoiceCode"
        ).$D("发票代码");
        msg = this.$T("smbl.common.view.pleaseInput", [ subMsg ]).$D(
          "请输入发票代码"
        );
      } else if (!item.invoiceNum) {
        let subMsg = this.$T(
          "ssta.purchaseInvoicePool.model.purchaseInvoicePool.invoiceNum"
        ).$D("发票号码");
        msg = this.$T("smbl.common.view.pleaseInput", [ subMsg ]).$D(
          "请输入发票号码"
        );
      } else if (!item.invoicingDate) {
        let subMsg = this.$T(
          "ssta.purchaseInvoicePool.model.purchaseInvoicePool.invoicingDate"
        ).$D("开票日期");
        msg = this.$T("smbl.common.view.pleaseInput", [ subMsg ]).$D(
          "请输入开票日期"
        );
      } else if (isNil(item.netAmount)) {
        let subMsg = this.$T(
          "ssta.purchaseInvoicePool.model.purchaseInvoicePool.netAmount"
        ).$D("不含税金额");
        msg = this.$T("smbl.common.view.pleaseInput", [ subMsg ]).$D(
          "请输入不含税金额"
        );
      } else if (isNil(item.taxAmount)) {
        let subMsg = this.$T(
          "ssta.purchaseInvoicePool.model.purchaseInvoicePool.taxAmount"
        ).$D("税额");
        msg = this.$T("smbl.common.view.pleaseInput", [ subMsg ]).$D(
          "请输入税额"
        );
      } else if (!item.belongCompanyId) {
        let subMsg = this.$T(
          "ssta.purchaseInvoicePool.model.purchaseInvoicePool.belongCompanyName2"
        ).$D("所属公司");
        msg = this.$T("smbl.common.view.pleaseInput", [ subMsg ]).$D(
          "请输入所属公司"
        );
      } else if (!item.belongSupplierCompanyId) {
        let subMsg = this.$T(
          "ssta.purchaseInvoicePool.model.purchaseInvoicePool.belongSupplierCompanyName2"
        ).$D("所属供应商");
        msg = this.$T("smbl.common.view.pleaseInput", [ subMsg ]).$D(
          "请输入所属供应商"
        );
      } else if (item.checkCode && !/^[a-zA-Z\d]+$/.test(item.checkCode)) {
        let subMsg = this.$T(
          "ssta.purchaseInvoicePool.view.validation.CodeonlyDigitOrLetter"
        ).$D("校验码只能是字母或者数字");
        msg = subMsg;
      }
      if (msg) {
        this.$notification.open({
          message: msg,
          duration: 1000,
        });
        return true;
      }
      return false;
    },
    // 操作记录
    showHistoryRecords(id) {
      this.showHistoryRecord = true;
      this.historyRecordLoading = true;
      getHistory(id)
        .then((res) => {
          if (res && res.content) {
            this.historyRecords = res.content;
          }
        })
        .finally(() => {
          this.historyRecordLoading = false;
        });
    },
    // 发票补充文件
    showAttachRecords(flag, item) {
      if (flag === 1) {
        if (!item.attachmentUuid) {
          item.attachmentUuid = uuid();
        }
        this.$showFileList({
          title: this.$T("smbl.common.view.attachment").$D("附件"),
          attachmentUuid: item.attachmentUuid,
          readOnly: false,
          canUpload: true,
          canDelete: true,
        });
      } else if (flag === 2) {
        previewFile({
          bucketName: "private-bucket",
          fileUrl: item.ocrFileUrl,
          fileName: "xxx.png",
        });
      }
    },
    // 手工新建 / ocr识别
    openPopup() {
      this.createPopup = this.$popup({
        title: this.$T("ssta.invoicePool.view.title.createInvoice").$D(
          "新建发票"
        ),
        showHeader: true,
        showClose: false,
        rounded: true,
        height: "40vh",
        position: "bottom",
        content:
          <div class="invoice-popup">
            <div
              onClick={() => {
                this.openCreatePopup();
              }}
            >
              <p style="background: #FF6937">
                <img src={this.editImg} width="28" />
              </p>
              <span>
                {this.$T("ssta.invoicePool.model.status.handCreate").$D(
                  "手工录入"
                )}
              </span>
            </div>
            <div
              onClick={() => {
                this.openOcrPopup();
              }}
            >
              <p style="background: #276EF1">
                <img src={this.cameraImg} width="28" />
              </p>
              <span>
                {this.$T("ssta.invoiceSheet.view.button.ocrDistinguish").$D(
                  "OCR识别"
                )}
              </span>
            </div>
          </div>
        ,
      });
    },
    // ocr识别
    openOcrPopup() {
      this.ocrPopup = this.$popup({
        title: this.$T("ssta.invoiceSheet.view.button.ocrDistinguish").$D(
          "OCR识别"
        ),
        showHeader: true,
        showBack: true,
        showClose: true,
        height: "100vh",
        position: "bottom",
        onClose: () => {
          this.createPopup.closePopup();
        },
        content:
          <div class="ocr-popup">
            <scoreUpload
              style="height: calc(100vh - 120px);overflow: hidden;overflow-y: scroll;"
              attachmentUuid={
                this.attachmentUuid ?
                  this.attachmentUuid :
                  this.attachmentUuid = uuid()
              }
            ></scoreUpload>
            <SrmFlex
              justify="between"
              align="center"
              style="position: fixed; bottom: 20px; padding: 0 15px;"
            >
              <SrmButton
                bordered
                size="x-large"
                style={{ marginLeft: "10px" }}
                onClick={() => {
                  this.ocrPopup.closePopup();
                }}
              >
                {this.$T("ssta.invoicePool.model.status.cancel").$D("取消")}
              </SrmButton>
              <SrmButton
                fill
                bordered
                style={{ marginLeft: "10px" }}
                size="x-large"
                onClick={() => {
                  this.ocrImport();
                }}
              >
                {this.$T("ssta.invoiceSheet.view.button.ocrDistinguish").$D(
                  "OCR识别"
                )}
              </SrmButton>
            </SrmFlex>
          </div>
        ,
      });
    },
    // ocr识别接口
    async ocrImport() {
      this.$loading.show();
      let data = await getAttachApi(this.attachmentUuid, "private-bucket");
      if (data.length === 0) {
        this.$loading.hide();
        return;
      }
      let params = data.map((res) => res.fileUrl);
      let msg = [];
      ocrApi(params, "PURCHASER")
        .then((res) => {
          if (res && res.failed) {
            this.$notification.open({
              message: res.message,
              duration: 3000,
            });
            return;
          }
          Object.keys(res).map((key) => {
            msg.push(`${key}: ${res[key].desc}`);
          });
          this.dataSet1.refresh();
          this.attachmentUuid = uuid();
          this.ocrPopup.closePopup();
        })
        .finally(() => {
          this.$loading.hide();
          setTimeout(() => {
            if (msg.length > 0) {
              this.$popup({
                title: this.$T("ssta.invoicePool.model.status.failedList").$D(
                  "失败列表"
                ),
                visible: this.pop,
                showHeader: true,
                showClose: true,
                height: "60vh",
                position: "bottom",
                content:
                  <srm-flex direction="column" align="start">
                    {msg.map((r) =>
                      <srm-flex-item
                        flex="1"
                        style="padding: 16px 15px; border-bottom: 1px solid #F6F6F6;; width: 100%;"
                      >
                        <span style="font-size: 12px; color: #333333;">
                          {r}
                        </span>
                      </srm-flex-item>
                    )}
                  </srm-flex>
                ,
              });
            }
          }, 500);
        });
    },
  },
};
</script>

<style scoped lang="stylus">
.round-btn {
  padding: 0;
  line-height: normal;
  pointer-events: auto;

  .srm-icon {
    font-size: 28px;
  }
}

.round-btn-box {
  background: transparent;
  padding-bottom: 60px;
  padding-right: 15px;
}

.invoice-popup {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin-top: 32px;

  div {
    height: 75px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    p {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      border-radius: 24px;
    }

    span {
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #333333;
      text-align: center;
      line-height: 20px;
      font-weight: 400;
    }
  }
}

.ocr-popup {
  // background: #eee;
  .attached-file-upload {
    position: fixed;
    display: flex;
    align-items: center;
    color: $srm-font-color-default;
    bottom: 60px;
    right: 15px;
    z-index: 1;
  }

  >>> .ant-upload {
    width: 180px !important;
    height: 156px !important;
  }

  >>> .file-list-item-container {
    background-color: #ffffff;

    .file-list-item {
      padding-top: 15px !important;
    }
  }
}
</style>
