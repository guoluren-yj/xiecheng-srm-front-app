<template>
  <div>
    <div v-loading="popupLoading">
      <srm-scroll-tab>
        <srm-scroll-tab-item :label="$T('ssrc.inquiryHall.view.message.panel.basicInfos').$D('基础信息')">
          <srm-form :data-set="formDs"
                    :columns="getFormColumns" />
        </srm-scroll-tab-item>
        <srm-scroll-tab-item :label="$T('ssrc.inquiryHall.view.card.subtitle.quotationInfo').$D('报价信息')" >
          <div v-if="header.moduleRule === 'NO_DISTINCTION'">
            <srm-list
              :data-set="tableDsBox[header.templateId]"
              :scrollable="false"
              :columns="getLineColumns(header.templateId)">
              <div slot="filter">
                <div class="module-title">{{ header.templateName }}</div>
              </div>
            </srm-list>
          </div>
          <div v-else-if="header.moduleRule === 'SUB_MODULE'">
            <div v-for="(item, index) in header.moduleList" :key="item.templateId">
              <srm-list
                :data-set="tableDsBox[item.templateId]"
                :scrollable="false"
                :columns="getLineColumns(item.templateId)"
                :class="index > 0 ? 'module-divider' : null ">
                <div slot="filter">
                  <div class="module-title">{{ item.templateName }}</div>
                </div>
              </srm-list>
            </div>
          </div>
        </srm-scroll-tab-item>
      </srm-scroll-tab>
    </div>
    <srm-popup
      v-loading="twoPopupLoading"
      :visible="twoPopupVisible"
      height="100%"
      position="bottom"
      :show-back="true"
      :show-close="true"
      :show-header="true"
      :title="$T('spfm.dashboard.model.supplierTodoWorkflow.task').$D('待办事项')"
      @onClose="onTwoPopupClose">
      <srm-list
        :data-set="twoTableDs"
        :columns="getTwoLineColumns(current.templateId)" />
    </srm-popup>
  </div>
</template>

<script>
import { DataSet, $T } from "srm-mobile-ui";
import moment from "moment";
import { isEmpty } from "@/utils";
import { formDS, tableDS, twoTableDS } from "./storeDS";
import { fetchHeaderData } from "./api";
export default {
  modules: [ "ssrc.common", "ssrc.inquiryHall", "hipspfm.common", "hzero.button", "spfm.dashboard" ],
  name: "QuotationDetailContent",
  props: {
    rowData: {
      type: Object,
      default: null,
    },
    sourceFrom: {
      type: String,
      default: "RFX",
    },
    sourceResultId: {
      // 协议通过sourceResultId查询报价明细，暂预留口子
      type: String | Number,
      default: "",
    },
    allowSupplierViewFlag: { // 阵营供应商标志(ps: 阵营分为采购方和供应商，默认采购方)
      type: Boolean,
      default: false,
    },
    sourceHeaderId: {
      type: String | Number,
      default: "",
    },
    tenantId: {
      type: String | Number,
      default: "",
    },
    rowKeyId: {
      type: String,
      default: "",
    },
    currentPageType: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      popupLoading: false, // 页面加载标志
      header: {}, // 头数据
      formDs: new DataSet(formDS()),
      tableDsBox: {}, // 表格ds盒子
      dynamicColumns: {}, // 动态列
      twoPopupVisible: false, // 二级要素弹框显隐
      current: {}, // 一级要素当前数据，打开二级弹框时赋值
      twoTableDs: new DataSet(twoTableDS({ rowKeyId: this.rowKeyId })), // 二级要素tableDs
      twoPopupLoading: false, // 二级要素页面加载标志
    };
  },
  computed: {
    // 未报价前，采购方看供应商附件是否必传，供应商查看附件(此时并无附件)
    // 报价之后，采购方和供应商都看报价附件
    // 通过是否有quotationLineId判断是否已报价
    getFormColumns() {
      return [
        {
          formRow: 10,
          fieldCode: "templateName",
        },
        this.rowData?.quotationLineId ? {
          formRow: 20,
          fieldCode: "quoDetailAttachmentUuid",
        } : {
          formRow: 20,
          fieldCode: "attachmentNeedFlag",
          render:(val) => Number(val) === 1 ? this.$T("hipspfm.common.status.yes").$D("是") : this.$T("hipspfm.common.status.no").$D("否")
        },
        {
          formRow: 30,
          fieldCode: "allowCreateFlag",
          render:(val) => Number(val) === 1 ? this.$T("hipspfm.common.status.yes").$D("是") : this.$T("hipspfm.common.status.no").$D("否")
        },
        {
          formRow: 40,
          fieldCode: "attachmentUuid",
        },
      ];
    },
    // 获取列信息
    getLineColumns() {
      return (templateId) => [
        {
          formRow: 10,
          fieldCode: "configCode",
        },
        {
          formRow: 20,
          fieldCode: "configName",
        },
        {
          formRow: 30,
          fieldName: $T("ssrc.common.model.common.nextQuotationDetails").$D("下级报价明细"),
          render: (_, item) => {
            if (item.childFlag) {
              return <a style="color: #276EF1" onClick={() => this.onTwoPopupOpen(item)}>{$T("hzero.button.button.look").$D("查看")}</a>;
            }
            return "-";
          },
        },
        ...this.dynamicColumns?.[templateId] || [],
      ].filter(Boolean);
    },
    // 获取二级列信息
    getTwoLineColumns() {
      return (templateId) => [
        {
          formRow: 10,
          fieldCode: "configCode",
          fieldType: "EMPTY",
          render: (val, record) => <srm-list-header show-open-tag={false}>
            <span style="marginRight: 12px">{$T("ssrc.common.model.common.configCode").$D("报价明细项编码")}:</span>{ record.configCode }
          </srm-list-header>,
        },
        {
          formRow: 20,
          fieldCode: "configName",
        },
        ...this.dynamicColumns?.[templateId] || [],
      ].filter(Boolean);
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init(parameter = {}) {
      const {
        itemId,
        itemCategoryId,
        quotationLineId,
        quotationHeaderId,
        quotationTemplateId,
        rfxHeaderId,
        bidHeaderId,
        sourceProjectId,
        rfxLineItemId,
        bidLineItemId,
        projectLineItemId,
        recordId,
      } = this.rowData || {};
      const { currentRowKeyId, } = parameter || {};
      const params = {
        sourceResultId: this.sourceResultId,
        sourceFrom: this.sourceFrom,
        itemId,
        tenantId: this.tenantId,
        itemCategoryId,
        quotationLineId,
        quotationHeaderId,
        quotationTemplateId,
        rfxHeaderId:
          rfxHeaderId || bidHeaderId || this.sourceHeaderId || sourceProjectId,
        rfxLineItemId: rfxLineItemId || bidLineItemId || projectLineItemId,
        recordId,
        level: 1,
        pageType: this.currentPageType,
        sourceMobileEndFlag: 1,
        ...parameter,
      };
      parameter.level === 2 ? this.twoPopupLoading = true : this.popupLoading = true;
      fetchHeaderData(params)
        .then((res) => {
          if (res && !res.failed) {
            // 二级要素查询
            if (parameter.level === 2) {
              let levelApiData = this.handleDataSource(res?.supQuotationDetailPage?.content || []);
              if (!isEmpty(levelApiData) && currentRowKeyId) {
                levelApiData = levelApiData.filter((levelTwo) => levelTwo.parentDetailId === currentRowKeyId);
              }
              // 赋值数据
              this.twoTableDs.setData(levelApiData);
            } else { // 一级要素初始化
              const { moduleList = [] } = res;
              // 缓存头数据
              this.header = res;
              this.formDs?.create?.(res);
              // 分模块
              if (res.moduleRule === "SUB_MODULE") {
                let columns = {};
                // 缓存ds
                moduleList.forEach((i) => {
                  this.tableDsBox = {
                    ...this.tableDsBox,
                    [i.templateId]: new DataSet(
                      tableDS({ rowKeyId: this.rowKeyId, queryParams: params, templateId: i.templateId, handleDataSource: this.handleDataSource })
                    ),
                  };
                  columns = { ...columns, [i.templateId]: this.handleDynamicColumns(i) };
                  // 分ds查询
                  this.tableDsBox[i.templateId].addQueryParameter("templateId", i.templateId);
                });
                // 设置动态列
                this.dynamicColumns = columns;
              } else if (res.moduleRule === "NO_DISTINCTION") { // 不区分模块
                // 不区分模块
                this.tableDsBox = {
                  [res.templateId]: new DataSet(
                    tableDS({ rowKeyId: this.rowKeyId, queryParams: params, templateId: res.templateId, handleDataSource: this.handleDataSource })
                  ),
                };
                this.tableDsBox[res.templateId].addQueryParameter("templateId", res.templateId);

                // 设置动态列
                this.dynamicColumns = { [res.templateId]: this.handleDynamicColumns(res) };
              }
            }
          }
        })
        .finally(() => {
          if (parameter.level === 2) {
            this.twoPopupLoading = false;
          } else {
            this.popupLoading = false;
          }
        });
    },
    // 处理数据
    handleDataSource(source = []) {
      if (isEmpty(source)) {
        return [];
      }
      const restructureSource = source.map((item) => {
        let elementValue = {};
        const { quotationColumns = [], ...otherItem } = item;
        quotationColumns.forEach((newItem) => {
          elementValue = {
            ...elementValue,
            [newItem.columnCode]: this.renderColumnValue(item, newItem),
          };
        });
        return {
          ...otherItem,
          ...elementValue,
          quotationColumns,
        };
      });
      return restructureSource;
    },
    // 渲染单元格值
    renderColumnValue (item = {}, elementItem = {}) {
      let value = elementItem.supQuotationColumnValue;
      const meaningFlag =
      elementItem.componentType === "Lov" || elementItem.componentType === "ValueList";
      if (item.quotationDetailType === "NO") {
        value = elementItem.disabled ?
          elementItem.columnDefaultValue :
          item.supQuotationDetailId ?
            meaningFlag ?
              elementItem.supQuotationColumnValueMeaning :
              elementItem.supQuotationColumnValue :
            meaningFlag ?
              elementItem.supColumnDefaultValueMeaning :
              elementItem.supColumnDefaultValue;
        value = item.supQuotationDetailId ?
          meaningFlag ?
            elementItem.supQuotationColumnValueMeaning :
            elementItem.supQuotationColumnValue :
          meaningFlag ?
            elementItem.supColumnDefaultValueMeaning :
            elementItem.supColumnDefaultValue;
      }
      return value;
    },
    // 设置动态列
    handleDynamicColumns (data = {}) {
      const { quotationColumns = [] } = data || {};
      const columns = [];
      quotationColumns.forEach((item, index) => {
        const flag = this.allowSupplierViewFlag ? // 内外部是否可见
          item.visible === 0 || item.visible === 1 :
          item.visible === 1 || item.visible === 2;
        // visible过滤
        if (flag) {
          const { componentType, columnName, columnCode } = item;
          const column = {
            fieldName: columnName,
            fieldCode: columnCode,
            formRow: 40 + index * 10,
            ...this.renderFieldConfig(item),
          };
          if ([ "Switch", "Checkbox", "DatePicker", "DateTimePicker" ].includes(componentType)) {
            Object.assign(column, {
              render: (_, record) => this.renderDisplay(item, record),
            });
          }
          columns.push(column);
        }
      });
      return columns;
    },
    // 渲染field配置
    renderFieldConfig (field = {}) {
      let fieldConfig = {};
      switch (field.componentType) {
      case "Input":
      case "TextArea":
      case "Lov":
      case "ValueList":
      case "InputNumber":
      case "DateTimePicker":
      case "DatePicker":
      case "Switch":
      case "Checkbox":
        fieldConfig = {
          fieldType: "TEXT",
        };
        break;
      case "Upload":
        fieldConfig = {
          fieldType: "UPLOAD",
          bucketName: field?.quotationColumnCmpts?.find?.((e) => e.attributeName === "bucketName")
                ?.attributeValue || "private-bucket",
          bucketDirectory: field?.quotationColumnCmpts?.find?.((e) => e.attributeName === "bucketDirectory")
                ?.attributeValue
        };
        break;
      default:
        fieldConfig = {
          fieldType: "TEXT",
        };
        break;
      }
      return fieldConfig;
    },
    // 处理显示单元格
    renderDisplay (field, record) {
      const { componentType, columnCode } = field;
      const displayValue = record[columnCode];
      let display;
      switch (componentType) {
      case "Switch":
      case "Checkbox":
        display = Number(displayValue) === 1 ? this.$T("hipspfm.common.status.yes").$D("是") : this.$T("hipspfm.common.status.no").$D("否");
        break;
      case "DatePicker":
        display = displayValue && moment(displayValue).format("YYYY-MM-DD");
        break;
      case "DateTimePicker":
        display = displayValue && moment(displayValue).format("YYYY-MM-DD HH:mm:ss");
        break;
      default:
        display = displayValue;
        break;
      }
      return display;
    },
    // 打开二级要素弹框
    onTwoPopupOpen(item) {
      const { templateId, supQuotationDetailId, } = item || {};
      const params = {
        level: 2,
        currentRowKeyId: supQuotationDetailId,
        // [this.rowKeyId]: item[this.rowKeyId], // supQuotationDetailId ，数据库报错 后端pc已不存在该字段
        moduleTemplateId: templateId,
      };

      this.init(params);
      this.current = item;
      this.twoPopupVisible = true;
    },
    // 关闭二级要素弹框
    onTwoPopupClose() {
      this.twoPopupVisible = false;
      this.current = {};
      this.twoTableDs.reset();
    },
  },
};
</script>
<style scoped lang="stylus">
.module-title {
    padding: 12px 15px 16px;
    font-size: 12px;
    line-height: 16px;
    border-bottom: 1px solid var(--color-border-default);
    color: var(--color-font-default);
}
.module-divider {
  border-top: 16px solid var(--background-color-empty-second);
}
</style>