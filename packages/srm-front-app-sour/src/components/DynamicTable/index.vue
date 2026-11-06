<script>
import { SrmUtil, DataSet } from "srm-mobile-ui";
import { isEmpty } from "@/utils";
import uuid from "uuid";
import {
  queryRelTableConfig,
  // queryTableData,
  // queryLifecycleModelData,
  saveData,
  deleteData,
} from "./api";
import { dynamicDS, dynamicBySourceDS, commonDs } from "./datasource/DynamicDS";
import { coverMobileConfig } from "./utils";

const MobileFieldType = {
  textField: "TEXT",
  input:"INPUT",
  dateTimePicker:"DATE_PICKER",
  lookup:"SELECT",
  lov:"LOV",
  checkBox:"SWITCH",
};

export default {
  modules: [ "smbl.common" ],
  name: "DynamicTable",
  props: {
    modelTable: {
      type:Object,
      default: () => ({})
    },
    relationId: {
      type:String,
      default: ""
    },
    readOnly: {
      type:Boolean,
      default:false,
    },
  },
  data() {
    return {
      definitionList: [], // 列配置
      dataSource: [], // 配置表数据
      rowKey: "dataId",
      dynDataDs: new DataSet(commonDs()),
      viewOnlyFlag:true,
    };
  },
  mounted() {
    this.rowKey = this.relationId ? "dataId" : "virtualUUid";
    const { editorFlag = 1 } = this.modelTable;
    this.viewOnlyFlag = !editorFlag;
    // 通过code查询列配置
    this.fetchTableColConfig().then(() => {
      // relationId 有值查询申请单接口
      if (this.relationId) {
        this.queryDynamicTable();
      } else {
        // relationId 无值查询主数据带值接口
        this.queryLifecycleModelData();
      }
    });
  },
  methods:{
    // 刷新数据
    refreshData() {
      this.dynDataDs.refresh();
    },
    // 查询动态表格列配置
    async fetchTableColConfig() {
      const { tableCode, uniqueCode } = this.modelTable;
      const params = {
        tableCode,
        uniqueCode,
      };
      this.$loading.show();
      await queryRelTableConfig(params).then((res) => {
        if (res && Array.isArray(res)) {
          this.definitionList = res || [];
        }
      }).finally(() => {
        this.$loading.hide();
      });
    },
    // 查询表格数据
    queryDynamicTable() {
      const { uniqueCode, companyId, supplierCompanyId } = this.modelTable;
      const payload = {
        tenantId: SrmUtil.getTenantId(),
        relationId: this.relationId,
        tableCode: uniqueCode,
        definitionList:this.definitionList,
        // compare,
        companyId: companyId || null,
        supplierCompanyId,
      };
      this.dynDataDs = new DataSet(dynamicDS(payload));
      this.dynDataDs.editFlag = false;
      this.dynDataDs.reset();
      this.dynDataDs.refresh();
    },
    // 查询生命周期第一次新建模型表数据
    queryLifecycleModelData() {
      this.dynDataDs = new DataSet(dynamicBySourceDS());
      this.dynDataDs.reset();
      this.dynDataDs.refresh();
    },
    // 处理字段显示隐藏，1-显示返回false；0-隐藏返回true
    handleFieldDisplay(fieldProps = []) {
      const { fieldPropertyValue = true } =
        fieldProps.find((item) => item.fieldPropertyCode === "display") || {};
      const displayFlag = Boolean(Number(fieldPropertyValue));
      return !displayFlag;
    },
    // 处理条件配置渲染
    handleConditionConfig(params = {}) {
      const { config = {} } = params;
      const originConfig = {
        required: config.required,
        disabled: config.disabled,
      };
      const newConfig = coverMobileConfig(originConfig, config.fieldProperty);
      const { required, disabled } = newConfig;
      return { required, disabled };
    },
    // 处理动态表格列
    handleColumns(colList = []) {
      const readOnlyFlag = this.viewOnlyFlag || this.readOnly;
      const columns = colList.map((e) => {
        const newFieldProperty = e.fieldProperty || [];
        const { required, disabled } = this.handleConditionConfig({ config: e });
        // 处理隐藏
        if (e.fieldProperty && this.handleFieldDisplay(newFieldProperty)) {
          return {};
        }
        if (e._component === "checkBox") {
          if (readOnlyFlag) {
            return {
              fieldCode:e.name,
              fieldName:e.label,
              fieldType:MobileFieldType["textField"],
              render: (val) => Number(val) === 1 ? this.$T("smbl.common.view.yes").$D("是") : this.$T("smbl.common.view.no").$D("否"),
            };
          }
          return {
            fieldCode:e.name,
            fieldName:e.label,
            fieldType:MobileFieldType["checkBox"],
            disabled:(val, record) => ![ "update", "create" ].includes(record._itemStatus) || disabled,
            required: required,
            defaultValue: "0",
          };
        } else if (e._component === "lov") {
          if (readOnlyFlag) {
            return {
              fieldCode:e.name,
              fieldName:e.label,
              fieldType:MobileFieldType["textField"],
              render:(val, item, files) => item[`${files["fieldCode"]}` + "Meaning"] || val
            };
          }
          return {
            fieldCode:e.name,
            fieldName:e.label,
            fieldType:MobileFieldType["lov"],
            lovCode: e.lovCode,
            disabled:(val, record) => ![ "update", "create" ].includes(record._itemStatus) || disabled,
            required: required,
            options: {
              valueField: e.valueField,
              displayField: e.textField,
            },
          };
        } else if (e._component === "lookup") {
          if (readOnlyFlag) {
            return {
              fieldCode:e.name,
              fieldName:e.label,
              fieldType:MobileFieldType["textField"],
              render:(val, item, files) => item[`${files["fieldCode"]}` + "Meaning"] || val
            };
          }
          return {
            fieldCode:e.name,
            fieldName:e.label,
            fieldType:MobileFieldType["lookup"],
            lovCode: e.lookupCode,
            disabled:(val, record) => ![ "update", "create" ].includes(record._itemStatus) || disabled,
            required: required,
          };
        } else if ([ "dateTimePicker", "datePicker" ].includes(e._component)) {
          if (readOnlyFlag) {
            return {
              fieldCode:e.name,
              fieldName:e.label,
              fieldType:MobileFieldType["textField"],
            };
          }
          return {
            fieldCode:e.name,
            fieldName:e.label,
            fieldType:MobileFieldType["dateTimePicker"],
            disabled:(val, record) => ![ "update", "create" ].includes(record._itemStatus) || disabled,
            required: required,
            options: {
              format: "yyyy-MM-dd",
              valueFormat: "yyyy-MM-dd",
            },
          };
        }
        if (readOnlyFlag) {
          return {
            fieldCode:e.name,
            fieldName:e.label,
            fieldType:MobileFieldType["textField"],
          };
        }
        return {
          fieldCode:e.name,
          fieldName:e.label,
          fieldType:MobileFieldType["input"],
          disabled:(val, record) => ![ "update", "create" ].includes(record._itemStatus) || disabled,
          required: required,
        };
      });
      const newColumns = columns.filter((n) => !isEmpty(n));
      if (!readOnlyFlag) {
        const editBtn = {
          fieldCode:"operationBtn",
          fieldType:"EMPTY",
          render:(val, item, v, record) => <srm-flex justify='end'>
            { item._itemStatus === "create" && <srm-button style="margin-right:2px" type="danger" bordered onClick={() => this.cleanHandle(record)}>{ this.$T("smbl.common.button.clean").$D("清除") }</srm-button>}
            { item._itemStatus !== "create" && <srm-button style="margin-right:2px" type="danger" bordered onClick={() => this.deleteHandle(item)}>{ this.$T("smbl.common.button.delete").$D("删除") }</srm-button> }
            { item._itemStatus === "update" && <srm-button type="primary" bordered onClick={() => this.editHandle(false, item)}>{ this.$T("smbl.common.button.cancel").$D("取消") }</srm-button> }
            { item._itemStatus !== "create" && item._itemStatus !== "update" && <srm-button type="primary" bordered onClick={() => this.editHandle(true, item)}>{ this.$T("smbl.common.button.edit").$D("编辑")}</srm-button> }
          </srm-flex>
        };
        newColumns.push(editBtn);
      }
      return newColumns;
    },
    // 编辑回调
    editHandle(flag, record) {
      record._itemStatus = flag ? "update" : "";
    },
    // 新增回调
    addHandle() {
      const { uniqueCode } = this.modelTable;
      this.dynDataDs.create({
        _itemStatus:"create",
        relationId:this.relationId,
        tableCode: uniqueCode,
        [this.rowKey]: uuid(),
      }, 0);
    },
    // 清除回调
    cleanHandle(record) {
      this.dynDataDs.removeRecords([ record ]);
    },
    // 删除回调
    deleteHandle(record) {
      const params = [ { ...record } ];
      this.$loading.show();
      deleteData(params).then((res) => {
        if (res.failed) {
          this.$notification.open({
            message: res.message,
            description: "",
            class: "notification"
          });
        } else {
          this.$notification.open({
            message: this.$T("smbl.common.message.acction.success").$D("操作成功"),
            description: "",
            class: "notification"
          });
          this.refreshData();
        }
      }).finally(() => {
        this.$loading.hide();
      });
    },
    // 保存回调
    saveHandle() {
      if (!this.dynDataDs.validate()) {
        return;
      }
      const params = this.dynDataDs && this.dynDataDs.data ? this.dynDataDs.data : [];
      const saveParams = params.filter((e) => [ "create", "update" ].includes(e._itemStatus)).map((e) => {
        // eslint-disable-next-line no-unused-vars
        const { dataId, _defaultValueInitialize, _itemStatus, _status, ...other } = e;
        return other;
      });
      this.$loading.show();
      saveData(saveParams).then((res) => {
        if (res.failed) {
          this.$notification.open({
            message: res.message,
            description: "",
            class: "notification"
          });
        } else {
          this.$notification.open({
            message: this.$T("smbl.common.message.acction.success").$D("操作成功"),
            description: "",
            class: "notification"
          });
          this.refreshData();
        }
      }).finally(() => {
        this.$loading.hide();
      });
    },
    // 给父组件返回表单数据
    getDynamicTableData() {
      const dynamicTableObj = {
        checkDataFlag:this.dynDataDs.validate() || true,
        dynamicTableList:this.dynDataDs.data || [],
      };
      return dynamicTableObj;
    }
  },
  render() {
    const { tableName:labelName = "" } = this.modelTable;
    const columns = this.handleColumns(this.definitionList);
    const readOnlyFlag = this.viewOnlyFlag || this.readOnly;
    return <div>
      { !readOnlyFlag &&
          <div style="display: flex; justify-content: space-between; height: 54px; padding: 0 15px; align-items: center; font-weight: bold; font-size: 16px; color: var(--font-color-default); background: var(--background-color-empty-tab-title);">
            { labelName }
            <span>
              <srm-button onClick={() => this.addHandle()}>{this.$T("smbl.common.button.new").$D("新建")}</srm-button>
              <srm-button style="margin-left: 2px;" type="primary" onClick={() => this.saveHandle()}>{this.$T("smbl.common.button.save").$D("保存")}</srm-button>
            </span>
          </div>
      }
      {
        this.dynDataDs && columns && <srm-list data-set={this.dynDataDs} scrollable={false} columns={columns} show-bottom-bar={false}/>
      }
    </div>;
  }
};
</script>
<style lang="stylus" scoped>

</style>