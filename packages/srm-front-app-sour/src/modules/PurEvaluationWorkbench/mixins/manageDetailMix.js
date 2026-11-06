import { $T, DataSet, SrmUtil } from "srm-mobile-ui";
import { dateFormat } from "@/utils/index";
import { isEmpty } from "lodash";
import { commonDs } from "../datasource/detailDs";
import { renderStatus } from "@/utils/sslmUtils";
import IndicatorMaintain from "../component/IndicatorMaintain.vue";
import { yesOrNoRender } from "@/utils/sslmUtils.js";
import AssignedRater from "../component/AssignedRater.vue";
import { getFields } from "@/utils/utils";

export default {
  components: { IndicatorMaintain, AssignedRater },
  data() {
    return {
      editStyle: {
        transform: "translateX(27px)",
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "row",
        width: "93%",
        alignItems: "center",
        paddingLeft: "4px",
        background: "#eff3fe"
      },
      unEditStyle: {
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "row",
        width: "100%",
        alignItems: "center",
        paddingLeft: "4px",
        background: "#eff3fe"
      },
    };
  },
  computed:{
    // 详情头
    getHeaderColumns() {
      return [
        {
          fieldCode: "evalDescription",
          render: (val, data) => <div style="width: 100%;">
            {data.evalDescription}-{data.investigationTypeMeaning}
          </div>
        },
        {
          fieldCode: "evalDate",
          render: (val, data) => `${dateFormat(data.evalDateFrom)}~${dateFormat(data.evalDateTo)}`
        }
      ];
    },
    // 基础信息
    getBasicColumns() {
      const columns = this.isEditList.basic && !this.isEditList.basicDisabledFlag ? [
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.form.label.evalDescription").$D("评估报告描述"),
          fieldCode: "evalDescription",
          fieldType: "INPUT",
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.form.label.strategyName").$D("评估策略"),
          fieldCode: "strategyId",
          fieldType: "LOV",
          lovCode: "SSLM.EVAL_PLAN_STRATEGY_LIST",
          displayField: "strategyName", // 外层描述显示字段
          required: (val, record) => this.getBasicInfoRequire({ record, isCreate: this.isCreate, readOnly: this.readOnly }),
          disabled: (val, record) => !isEmpty(record.evalHeaderId),
          options: {
            multiple: false,
            queryField: "strategyCode", // 查询
            displayField: "strategyName", // 描述显示字段
            subDisplayField: "strategyCode", // 编码显示字段
            valueField: "strategyId",
            queryParams: {
              strategyStatus: "RELEASED",
            },
            onClear: (ds) => {
              const evalTplId = ds.current && ds.current.getField("evalTplId");
              const evalTplCode = ds.current && ds.current.getField("evalTplCode");
              const evalTplName = ds.current && ds.current.getField("evalTplName");
              const needFeedbackFlag = ds.current && ds.current.getField("needFeedbackFlag");
              const autoPushVendorFlag = ds.current && ds.current.getField("autoPushVendorFlag");
              const evalType = ds.current && ds.current.getField("evalType");
              const evalTypeMeaning = ds.current && ds.current.getField("evalTypeMeaning");
              const assessType = ds.current && ds.current.getField("assessType");
              const assessTypeMeaning = ds.current && ds.current.getField("assessTypeMeaning");
              evalTplId.setData(null);
              evalTplCode.setData(null);
              evalTplName.setData(null);
              needFeedbackFlag.setData(null);
              autoPushVendorFlag.setData(null);
              evalType.setData(null);
              evalTypeMeaning.setData(null);
              assessType.setData(null);
              assessTypeMeaning.setData(null);
            },
            callback: (val, fieldCode, display, ds) => {
              let item = {};
              if (val.length) {
                item = val[0];
              }
              const evalTplId = ds.current && ds.current.getField("evalTplId");
              const evalTplCode = ds.current && ds.current.getField("evalTplCode");
              const evalTplName = ds.current && ds.current.getField("evalTplName");
              const needFeedbackFlag = ds.current && ds.current.getField("needFeedbackFlag");
              const autoPushVendorFlag = ds.current && ds.current.getField("autoPushVendorFlag");
              const evalType = ds.current && ds.current.getField("evalType");
              const evalTypeMeaning = ds.current && ds.current.getField("evalTypeMeaning");
              const assessType = ds.current && ds.current.getField("assessType");
              const assessTypeMeaning = ds.current && ds.current.getField("assessTypeMeaning");
              evalTplId.setData(item.evalTplId);
              evalTplCode.setData(item.evalTplCode);
              evalTplName.setData(item.evalTplName);
              needFeedbackFlag.setData(item.needFeedbackFlag);
              autoPushVendorFlag.setData(item.autoPushVendorFlag);
              evalType.setData(item.evalType);
              evalTypeMeaning.setData(item.evalTypeMeaning);
              assessType.setData(item.assessType);
              assessTypeMeaning.setData(item.assessTypeMeaning);
            },
          },
        },
        {
          formRow: 99999,
          fieldType: "EMPTY",
          render: (val, record) => <srm-flex justify="end">
            <srm-button type="primary" fill onClick={() => this.handleToDetail(record, "basic")}> { this.$T("smbl.common.button.moreDetails").$D("更多详情") } </srm-button>
          </srm-flex>
        },
      ] : [
        {
          formRow: 0,
          fieldCode: "evalNum",
          fieldType: "EMPTY",
          render: (val, record) => {
            const color = renderStatus(record.reportStatus);
            return <SrmListHeader showOpenTag={true}>
              <span>{val}</span>
              <span slot="right" style={{ color: `${color}` }}>{record.reportStatusMeaning}</span>
            </SrmListHeader>;
          },
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.form.label.evalDescription").$D("评估报告描述"),
          fieldCode: "evalDescription",
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.form.label.strategyName").$D("评估策略"),
          fieldCode: "strategyId",
          render: (val, record) => record.strategyName,
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.form.label.assessType").$D("评估类型"),
          fieldCode: "assessType",
          render: (val, record) => record.assessTypeMeaning,
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.form.label.investigationType").$D("考察方式"),
          fieldCode: "investigationType",
          render: (val, record) => record.investigationTypeMeaning,
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.form.label.evalRemark").$D("评估说明"),
          fieldCode: "evalRemark",
        },
      ];
      return columns;
    },
    // 基础详情信息
    getBasicDetailColumns() {
      const columns = [
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.form.label.evalDescription").$D("评估报告描述"),
          fieldCode: "evalDescription",
          fieldType: "INPUT",
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.form.label.evalNum").$D("评估报告编号"),
          fieldCode: "evalNum",
          fieldType: "TEXT",
        },
        {
          fieldName: $T("hzero.common.status").$D("状态"),
          fieldCode: "reportStatusMeaning",
          fieldType: "TEXT",
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.form.label.creationType").$D("创建方式"),
          fieldCode: "sourceTypeMeaning",
          fieldType: "TEXT",
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.form.label.documentOrigin").$D("来源单据"),
          fieldCode: "evalPlanNum",
          fieldType: "TEXT",
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.form.label.creationDate").$D("创建时间"),
          fieldCode: "creationDate",
          fieldType: "TEXT",
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.form.label.realName").$D("创建人"),
          fieldCode: "realName",
          fieldType: "TEXT",
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.form.label.unitName").$D("创建人部门"),
          fieldCode: "unitName",
          fieldType: "TEXT",
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.form.label.strategyName").$D("评估策略"),
          fieldCode: "strategyId",
          fieldType: "LOV",
          lovCode: "SSLM.EVAL_PLAN_STRATEGY_LIST",
          displayField: "strategyName", // 外层描述显示字段
          required: (val, record) => this.getBasicInfoRequire({ record, isCreate: this.isCreate, readOnly: this.readOnly }),
          disabled: (val, record) => !isEmpty(record.evalHeaderId),
          options: {
            multiple: false,
            queryField: "strategyCode", // 查询
            displayField: "strategyName", // 描述显示字段
            subDisplayField: "strategyCode", // 编码显示字段
            valueField: "strategyId",
            queryParams: {
              strategyStatus: "RELEASED",
            },
            onClear: (ds) => {
              const evalTplId = ds.current && ds.current.getField("evalTplId");
              const evalTplCode = ds.current && ds.current.getField("evalTplCode");
              const evalTplName = ds.current && ds.current.getField("evalTplName");
              const needFeedbackFlag = ds.current && ds.current.getField("needFeedbackFlag");
              const autoPushVendorFlag = ds.current && ds.current.getField("autoPushVendorFlag");
              const evalType = ds.current && ds.current.getField("evalType");
              const evalTypeMeaning = ds.current && ds.current.getField("evalTypeMeaning");
              const assessType = ds.current && ds.current.getField("assessType");
              const assessTypeMeaning = ds.current && ds.current.getField("assessTypeMeaning");
              evalTplId.setData(null);
              evalTplCode.setData(null);
              evalTplName.setData(null);
              needFeedbackFlag.setData(null);
              autoPushVendorFlag.setData(null);
              evalType.setData(null);
              evalTypeMeaning.setData(null);
              assessType.setData(null);
              assessTypeMeaning.setData(null);
            },
            callback: (val, fieldCode, display, ds) => {
              let item = {};
              if (val.length) {
                item = val[0];
              }
              const evalTplId = ds.current && ds.current.getField("evalTplId");
              const evalTplCode = ds.current && ds.current.getField("evalTplCode");
              const evalTplName = ds.current && ds.current.getField("evalTplName");
              const needFeedbackFlag = ds.current && ds.current.getField("needFeedbackFlag");
              const autoPushVendorFlag = ds.current && ds.current.getField("autoPushVendorFlag");
              const evalType = ds.current && ds.current.getField("evalType");
              const evalTypeMeaning = ds.current && ds.current.getField("evalTypeMeaning");
              const assessType = ds.current && ds.current.getField("assessType");
              const assessTypeMeaning = ds.current && ds.current.getField("assessTypeMeaning");
              evalTplId.setData(item.evalTplId);
              evalTplCode.setData(item.evalTplCode);
              evalTplName.setData(item.evalTplName);
              needFeedbackFlag.setData(item.needFeedbackFlag);
              autoPushVendorFlag.setData(item.autoPushVendorFlag);
              evalType.setData(item.evalType);
              evalTypeMeaning.setData(item.evalTypeMeaning);
              assessType.setData(item.assessType);
              assessTypeMeaning.setData(item.assessTypeMeaning);
            },
          },
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.form.label.evalTpl").$D("评分模板"),
          fieldCode: "evalTplId",
          fieldType: "LOV",
          lovCode: "SSLM.SITE_EVAL_TPL",
          displayField: "evalTplName", // 外层描述显示字段
          options: {
            multiple: false,
            displayField: "evalTplName", // 描述显示字段
            subDisplayField: "evalTplCode", // 编码显示字段
            valueField: "evalTplId",
            queryParams: {
              tenantId: localStorage.getItem("tenantId"),
            },
          },
          visible:false,
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.scoreType").$D("评分方式"),
          fieldCode: "evalType",
          fieldType: "SELECT",
          lovCode: "SSLM.SITE_EVAL_TYPE",
          visible:false,
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.form.label.evalDateFrom").$D("评估日期从"),
          fieldCode: "evalDateFrom",
          fieldType: "DATE_PICKER",
          required: (val, record) => this.getBasicInfoRequire({ record, isCreate: this.isCreate, readOnly: this.readOnly }),
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.form.label.evalDateTo").$D("评估日期至"),
          fieldCode: "evalDateTo",
          fieldType: "DATE_PICKER",
          required: (val, record) => this.getBasicInfoRequire({ record, isCreate: this.isCreate, readOnly: this.readOnly }),
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.form.label.assessType").$D("评估类型"),
          fieldCode: "assessType",
          fieldType: "SELECT",
          lovCode: "SSLM_EVAL_PLAN_TYPE",
          disabled: true,
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.form.label.investigationType").$D("考察方式"),
          fieldCode: "investigationType",
          fieldType: "SELECT",
          lovCode: "SSLM.INVESTIGATION_TYPE",
          options: {
            displayField: "meaning",
            valueField: "value",
          },
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.form.label.evalRemark").$D("评估说明"),
          fieldCode: "evalRemark",
          fieldType: "INPUT",
        },
      ];
      // 只读页面，禁用编辑
      if (!this.isEditList.basic || this.isEditList.basicDisabledFlag) {
        columns.forEach((record) => {
          Object.assign(record, { disabled: true });
        });
      }
      return columns;
    },
    // 公司信息
    getCompanyColumns() {
      const { evalType, evalTplId } = this.basicDs?.current?.data || {};
      const columns = this.isEditList.basic && !this.isEditList.basicDisabledFlag ? [
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.form.label.groupFlag").$D("是否集团级"),
          fieldCode: "groupFlag",
          fieldType: "SELECT",
          lovCode: "HPFM.FLAG",
          required: (val, record) => this.getBasicInfoRequire({ record, isCreate: this.isCreate, readOnly: this.readOnly }),
          options: {
            onClear: (ds) => {
              const {
                companyId,
                companyCode,
                companyName,
                ouId,
                ouName,
                invOrganizationId,
                organizationName,
                inventoryId,
                inventoryName,
              } = getFields(ds, [
                "companyId",
                "companyCode",
                "companyName",
                "ouId",
                "ouName",
                "invOrganizationId",
                "organizationName",
                "inventoryId",
                "inventoryName",
              ]);
              companyId.setData(null);
              companyCode.setData(null);
              companyName.setData(null);
              ouId.setData(null);
              ouName.setData(null);
              invOrganizationId.setData(null);
              organizationName.setData(null);
              inventoryId.setData(null);
              inventoryName.setData(null);
            },
          },
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.form.label.companyName").$D("公司"),
          fieldCode: "companyId",
          fieldType: "LOV",
          lovCode: evalType === "ONLINE" ? "SSLM.EVAL_PLAN_STRATEGY_TPL_COMPANY" : "SPCM.USER_AUTH.COMPANY",
          displayField: "companyName", // 外层描述显示字段
          required: (val, record) => this.getBasicInfoRequire({ record, isCreate: this.isCreate, readOnly: this.readOnly }) && record.strategyId ? !Number(record.groupFlag) : false,
          disabled: (val, record) => record.strategyId ? Boolean(Number(record.groupFlag)) : true,
          visible: (val, record) => record.strategyId ? Boolean(!Number(record.groupFlag)) : false,
          options: {
            multiple: false,
            displayField: "companyName", // 描述显示字段
            subDisplayField: "companyCode", // 编码显示字段
            valueField: "companyId",
            queryParams:{
              tplId: evalTplId,
              templateId: evalTplId,
              lovCode: "SSLM.EVAL_PLAN_STRATEGY_TPL_COMPANY",
            },
          },
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.ouName").$D("业务实体"),
          fieldCode: "ouId",
          fieldType: "LOV",
          lovCode: "SPFM.USER_AUTH.OU",
          displayField: "ouName", // 外层描述显示字段
          disabled: (val, record) => Boolean(!record.companyId),
          visible: (val, record) => record.strategyId ? Boolean(!Number(record.groupFlag)) : false,
          options: {
            multiple: false,
            displayField: "ouName", // 描述显示字段
            valueField: "ouId",
            queryParams:{
              tenantId: localStorage.getItem("tenantId"),
              companyId: this.basicDs?.current?.companyId,
            },
          },
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.invOrganization").$D("库存组织"),
          fieldCode: "invOrganizationId",
          fieldType: "LOV",
          lovCode: "HPFM.INV_ORG",
          displayField: "organizationName", // 外层描述显示字段
          disabled: (val, record) => Boolean(!record.ouId),
          visible: (val, record) => record.strategyId ? Boolean(!Number(record.groupFlag)) : false,
          options: {
            multiple: false,
            displayField: "organizationName", // 描述显示字段
            valueField: "invOrganizationId",
            queryParams:{
              tenantId: localStorage.getItem("tenantId"),
              ouId: this.basicDs?.current?.ouId,
            },
          },
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.inventory").$D("库房"),
          fieldCode: "inventoryId",
          fieldType: "LOV",
          lovCode: "SODR.INVENTORY",
          displayField: "inventoryName", // 外层描述显示字段
          disabled: (val, record) => Boolean(!record.invOrganizationId),
          visible: (val, record) => record.strategyId ? Boolean(!Number(record.groupFlag)) : false,
          options: {
            multiple: false,
            displayField: "inventoryName", // 描述显示字段
            valueField: "inventoryId",
            queryParams:{
              organizationId: this.basicDs?.current?.invOrganizationId,
              tenantId: localStorage.getItem("tenantId"),
            },
          },
        },
        {
          formRow: 99999,
          fieldType: "EMPTY",
          render: (val, record) => <srm-flex justify="end">
            <srm-button type="primary" fill onClick={() => this.handleToDetail(record, "company")}> { this.$T("smbl.common.button.moreDetails").$D("更多详情") } </srm-button>
          </srm-flex>
        },
      ] : [
        {
          formRow: 0,
          fieldName: $T("sslm.purchaserEvaluationDetail.form.label.groupFlag").$D("是否集团级"),
          fieldCode: "groupFlag",
          fieldType: "EMPTY",
          render: (val) => <SrmListHeader showOpenTag={true}>
            <span>{$T("sslm.purchaserEvaluationDetail.form.label.groupFlag").$D("是否集团级")}：</span>
            <span>{yesOrNoRender(val)}</span>
          </SrmListHeader>,
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.form.label.companyName").$D("公司"),
          fieldCode: "companyId",
          visible: (val, record) => record.strategyId ? Boolean(!Number(record.groupFlag)) : false,
          render: (val, record) => record.companyName
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.ouName").$D("业务实体"),
          fieldCode: "ouId",
          visible: (val, record) => record.strategyId ? Boolean(!Number(record.groupFlag)) : false,
          render: (val, record) => record.ouName
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.invOrganization").$D("库存组织"),
          fieldCode: "invOrganizationId",
          visible: (val, record) => record.strategyId ? Boolean(!Number(record.groupFlag)) : false,
          render: (val, record) => record.organizationName
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.inventory").$D("库房"),
          fieldCode: "inventoryId",
          visible: (val, record) => record.strategyId ? Boolean(!Number(record.groupFlag)) : false,
          render: (val, record) => record.inventoryName
        },
      ];
      return columns;
    },
    // 公司详情信息
    getCompanyDetailColumns() {
      const { evalType, evalTplId } = this.basicDs?.current?.data || {};
      const columns = [
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.form.label.groupFlag").$D("是否集团级"),
          fieldCode: "groupFlag",
          fieldType: "SELECT",
          lovCode: "HPFM.FLAG",
          required: (val, record) => this.getBasicInfoRequire({ record, isCreate: this.isCreate, readOnly: this.readOnly }),
          options: {
            onClear: (ds) => {
              const {
                companyId,
                companyCode,
                companyName,
                ouId,
                ouName,
                invOrganizationId,
                organizationName,
                inventoryId,
                inventoryName,
              } = getFields(ds, [
                "companyId",
                "companyCode",
                "companyName",
                "ouId",
                "ouName",
                "invOrganizationId",
                "organizationName",
                "inventoryId",
                "inventoryName",
              ]);
              companyId.setData(null);
              companyCode.setData(null);
              companyName.setData(null);
              ouId.setData(null);
              ouName.setData(null);
              invOrganizationId.setData(null);
              organizationName.setData(null);
              inventoryId.setData(null);
              inventoryName.setData(null);
            },
          },
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.form.label.companyName").$D("公司"),
          fieldCode: "companyId",
          fieldType: "LOV",
          lovCode: evalType === "ONLINE" ? "SSLM.EVAL_PLAN_STRATEGY_TPL_COMPANY" : "SPCM.USER_AUTH.COMPANY",
          displayField: "companyName", // 外层描述显示字段
          required: (val, record) => this.getBasicInfoRequire({ record, isCreate: this.isCreate, readOnly: this.readOnly }) && record.strategyId ? !Number(record.groupFlag) : false,
          disabled: (val, record) => record.strategyId ? Boolean(Number(record.groupFlag)) : true,
          options: {
            multiple: false,
            displayField: "companyName", // 描述显示字段
            subDisplayField: "companyCode", // 编码显示字段
            valueField: "companyId",
            queryParams:{
              tplId: evalTplId,
              templateId: evalTplId,
              lovCode: "SSLM.EVAL_PLAN_STRATEGY_TPL_COMPANY",
            },
          },
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.ouName").$D("业务实体"),
          fieldCode: "ouId",
          fieldType: "LOV",
          lovCode: "SPFM.USER_AUTH.OU",
          displayField: "ouName", // 外层描述显示字段
          disabled: (val, record) => Boolean(!record.companyId),
          options: {
            multiple: false,
            displayField: "ouName", // 描述显示字段
            valueField: "ouId",
            queryParams:{
              tenantId: localStorage.getItem("tenantId"),
              companyId: this.basicDs?.current?.companyId,
            },
          },
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.invOrganization").$D("库存组织"),
          fieldCode: "invOrganizationId",
          fieldType: "LOV",
          lovCode: "HPFM.INV_ORG",
          displayField: "organizationName", // 外层描述显示字段
          disabled: (val, record) => Boolean(!record.ouId),
          options: {
            multiple: false,
            displayField: "organizationName", // 描述显示字段
            valueField: "invOrganizationId",
            queryParams:{
              tenantId: localStorage.getItem("tenantId"),
              ouId: this.basicDs?.current?.ouId,
            },
          },
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.inventory").$D("库房"),
          fieldCode: "inventoryId",
          fieldType: "LOV",
          lovCode: "SODR.INVENTORY",
          displayField: "inventoryName", // 外层描述显示字段
          disabled: (val, record) => Boolean(!record.invOrganizationId),
          options: {
            multiple: false,
            displayField: "inventoryName", // 描述显示字段
            valueField: "inventoryId",
            queryParams:{
              organizationId: this.basicDs?.current?.invOrganizationId,
              tenantId: localStorage.getItem("tenantId"),
            },
          },
        },
      ];
      // 只读页面，禁用编辑
      if (!this.isEditList.basic || this.isEditList.basicDisabledFlag) {
        columns.forEach((record) => {
          Object.assign(record, { disabled: true });
        });
      }
      return columns;
    },
    // 供应商信息
    getSupplierColumns() {
      const { companyId, needFeedbackFlag } = this.basicDs?.current?.data || {};
      const columns = this.isEditList.basic && !this.isEditList.basicDisabledFlag ? [
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.supplierName").$D("供应商"),
          fieldCode: "dataId",
          fieldType: "LOV",
          lovCode: "SSLM.SITE_SUPPLIER",
          displayField: "supplierName", // 外层描述显示字段
          disabled: (val, record) => Boolean(record.evalHeaderId),
          required: (val, record) => this.getBasicInfoRequire({ record, isCreate: this.isCreate, readOnly: this.readOnly }),
          options: {
            multiple: false,
            valueField: "dataId",
            queryParams:{
              tenantId: localStorage.getItem("tenantId"),
              companyId: companyId,
              needFeedbackFlag: needFeedbackFlag || 0,
            },
            onClear: (ds) => {
              const {
                supplierContactor,
                supplierContactPhone,
                supplierContactMail,
                supplierRegisteredAddress,
                supplierCompanyId,
                supplierCompanyNum,
                supplierCompanyName,
                supplierId,
                supplierTenantId,
                supplierNum,
                supplierName,
              } = getFields(ds, [
                "supplierContactor",
                "supplierContactPhone",
                "supplierContactMail",
                "supplierRegisteredAddress",
                "supplierCompanyId",
                "supplierCompanyNum",
                "supplierCompanyName",
                "supplierId",
                "supplierTenantId",
                "supplierNum",
                "supplierName",
              ]);
              supplierContactor.setData(null);
              supplierContactPhone.setData(null);
              supplierContactMail.setData(null);
              supplierRegisteredAddress.setData(null);
              supplierCompanyId.setData(null);
              supplierCompanyNum.setData(null);
              supplierCompanyName.setData(null);
              supplierTenantId.setData(null);
              supplierId.setData(null);
              supplierNum.setData(null);
              supplierName.setData(null);
            },
            callback: (val, fieldCode, display, ds) => {
              let item = {};
              if (val.length) {
                item = val[0];
              }
              const {
                supplierContactor,
                supplierContactPhone,
                supplierContactMail,
                supplierRegisteredAddress,
                supplierCompanyId,
                supplierCompanyNum,
                supplierCompanyName,
                supplierId,
                supplierTenantId,
                supplierNum,
                supplierName,
              } = getFields(ds, [
                "supplierContactor",
                "supplierContactPhone",
                "supplierContactMail",
                "supplierRegisteredAddress",
                "supplierCompanyId",
                "supplierCompanyNum",
                "supplierCompanyName",
                "supplierId",
                "supplierTenantId",
                "supplierNum",
                "supplierName",
              ]);
              supplierContactor.setData(item.name);
              supplierContactPhone.setData(item.mobilephone);
              supplierContactMail.setData(item.mail);
              supplierRegisteredAddress.setData(item.addressDetail);
              supplierCompanyId.setData(item.supplierCompanyId);
              supplierCompanyNum.setData(item.supplierCompanyNum);
              supplierCompanyName.setData(item.supplierCompanyName);
              supplierTenantId.setData(item.supplierTenantId);
              supplierId.setData(item.supplierId);
              supplierNum.setData(item.supplierNum);
              supplierName.setData(item.supplierName || item.supplierCompanyName);
            },
          },
        },
        {
          formRow: 99999,
          fieldType: "EMPTY",
          render: (val, record) => <srm-flex justify="end">
            <srm-button type="primary" fill onClick={() => this.handleToDetail(record, "supplier")}> { this.$T("smbl.common.button.moreDetails").$D("更多详情") } </srm-button>
          </srm-flex>
        },
      ] : [
        {
          formRow: 0,
          fieldCode: "supplierCompanyId",
          fieldType: "EMPTY",
          render: (val, record) => <SrmListHeader showOpenTag={true}>
            <span>{$T("sslm.purchaserEvaluationDetail.table.column.label.supplierName").$D("供应商")}：</span>
            <span>{record.supplierName}</span>
          </SrmListHeader>,
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.form.label.supplierType").$D("供应商类型"),
          fieldCode: "supplierType",
          render: (val, record) => record.supplierTypeMeaning,
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.supplierContacts").$D("供应商联系人"),
          fieldCode: "supplierContactor",
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.supplierTelephone").$D("供应商联系电话"),
          fieldCode: "supplierContactPhone",
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.supplierEmail").$D("供应商联系邮箱"),
          fieldCode: "supplierContactMail",
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.supplierAddress").$D("供应商注册地址"),
          fieldCode: "supplierRegisteredAddress",
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.form.label.supplierOverview").$D("供应商概况"),
          fieldCode: "supplierOverview",
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.form.label.evalAddress").$D("实际考察地址"),
          fieldCode: "evalAddress",
        },
      ];
      return columns;
    },
    // 供应商详情信息
    getSupplierDetailColumns() {
      const { companyId, needFeedbackFlag } = this.basicDs?.current?.data || {};
      const columns = [
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.supplierName").$D("供应商"),
          fieldCode: "dataId",
          fieldType: "LOV",
          lovCode: "SSLM.SITE_SUPPLIER",
          displayField: "supplierName", // 外层描述显示字段
          disabled: (val, record) => Boolean(record.evalHeaderId),
          required: (val, record) => this.getBasicInfoRequire({ record, isCreate: this.isCreate, readOnly: this.readOnly }),
          options: {
            multiple: false,
            valueField: "dataId",
            queryParams:{
              tenantId: localStorage.getItem("tenantId"),
              companyId: companyId,
              needFeedbackFlag: needFeedbackFlag || 0,
            },
            onClear: (ds) => {
              const {
                supplierContactor,
                supplierContactPhone,
                supplierContactMail,
                supplierRegisteredAddress,
                supplierCompanyId,
                supplierCompanyNum,
                supplierCompanyName,
                supplierId,
                supplierTenantId,
                supplierNum,
                supplierName,
              } = getFields(ds, [
                "supplierContactor",
                "supplierContactPhone",
                "supplierContactMail",
                "supplierRegisteredAddress",
                "supplierCompanyId",
                "supplierCompanyNum",
                "supplierCompanyName",
                "supplierId",
                "supplierTenantId",
                "supplierNum",
                "supplierName",
              ]);
              supplierContactor.setData(null);
              supplierContactPhone.setData(null);
              supplierContactMail.setData(null);
              supplierRegisteredAddress.setData(null);
              supplierCompanyId.setData(null);
              supplierCompanyNum.setData(null);
              supplierCompanyName.setData(null);
              supplierTenantId.setData(null);
              supplierId.setData(null);
              supplierNum.setData(null);
              supplierName.setData(null);
            },
            callback: (val, fieldCode, display, ds) => {
              let item = {};
              if (val.length) {
                item = val[0];
              }
              const {
                supplierContactor,
                supplierContactPhone,
                supplierContactMail,
                supplierRegisteredAddress,
                supplierCompanyId,
                supplierCompanyNum,
                supplierCompanyName,
                supplierId,
                supplierTenantId,
                supplierNum,
                supplierName,
              } = getFields(ds, [
                "supplierContactor",
                "supplierContactPhone",
                "supplierContactMail",
                "supplierRegisteredAddress",
                "supplierCompanyId",
                "supplierCompanyNum",
                "supplierCompanyName",
                "supplierId",
                "supplierTenantId",
                "supplierNum",
                "supplierName",
              ]);
              supplierContactor.setData(item.name);
              supplierContactPhone.setData(item.mobilephone);
              supplierContactMail.setData(item.mail);
              supplierRegisteredAddress.setData(item.addressDetail);
              supplierCompanyId.setData(item.supplierCompanyId);
              supplierCompanyNum.setData(item.supplierCompanyNum);
              supplierCompanyName.setData(item.supplierCompanyName);
              supplierTenantId.setData(item.supplierTenantId);
              supplierId.setData(item.supplierId);
              supplierNum.setData(item.supplierNum);
              supplierName.setData(item.supplierName || item.supplierCompanyName);
            },
          },
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.form.label.supplierType").$D("供应商类型"),
          fieldCode: "supplierType",
          fieldType: "SELECT",
          lovCode: "SSLM.SUPPLIER_TYPE",
          displayField:"supplierTypeMeaning",
          options: {
            multiple: false,
            displayField: "meaning", // 描述显示字段
            valueField: "value",
          },
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.supplierContacts").$D("供应商联系人"),
          fieldCode: "supplierContactor",
          fieldType: "INPUT",
          disabled: (val, record) => Boolean(!record.supplierId) || Boolean(record.supplierCompanyId),
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.supplierTelephone").$D("供应商联系电话"),
          fieldCode: "supplierContactPhone",
          fieldType: "INPUT",
          disabled: (val, record) => Boolean(!record.supplierId) || Boolean(record.supplierCompanyId),
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.supplierEmail").$D("供应商联系邮箱"),
          fieldCode: "supplierContactMail",
          fieldType: "INPUT",
          disabled: (val, record) => Boolean(!record.supplierId) || Boolean(record.supplierCompanyId),
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.supplierAddress").$D("供应商注册地址"),
          fieldCode: "supplierRegisteredAddress",
          fieldType: "INPUT",
          disabled: true,
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.form.label.supplierOverview").$D("供应商概况"),
          fieldCode: "supplierOverview",
          fieldType: "INPUT",
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.form.label.evalAddress").$D("实际考察地址"),
          fieldCode: "evalAddress",
          fieldType: "INPUT",
        },
      ];
      return columns;
    },
    // 评估物料/品类信息
    getItemCategoryColumns() {
      const columns = this.isEditList.itemCategory ? [
        {
          formRow: 0,
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.itemCode").$D("物料编码"),
          fieldCode: "itemCode",
          fieldType: "EMPTY",
          render: (val, record, property, _dataSet) => {
            const { dataSet: _ds } = _dataSet;
            const { fieldName, fieldCode } = property;
            // 兼容行编辑图标样式
            return <div style={ this.itemCategoryDs.editFlag ? this.editStyle : this.unEditStyle}>
              <span style={{ marginRight: "8px" }}>{fieldName}:</span>
              <div style={{ flex: 1 }}>
                <srm-lov-field
                  key={fieldCode}
                  display={record.itemCode}
                  v-model={record.itemCode}
                  code="SSLM.RELATED_CATEGORY_ITEM"
                  placeholder={this.$T("smbl.common.tab.pleaseSelect").$D("请选择") + fieldName}
                  options={{
                    displayField: "itemCode", // lov选择后显示字段
                    queryParams:{
                      tenantId: localStorage.getItem("tenantId"),
                    },
                    callback: (lovRecord) => {
                      const lovList = lovRecord[0] || {};
                      const { itemCategoryId, itemName, itemCategoryCode, itemCategoryName, itemId, itemCode } = getFields(_ds, [ "itemCategoryId", "itemName", "itemCategoryCode", "itemCategoryName", "itemId", "itemCode" ]);
                      itemCategoryCode.setLovParam({
                        itemId: lovList.itemId,
                        supplierCompanyId: lovList.supplierId,
                        tenantId: localStorage.getItem("tenantId"),
                        enabledFlag: 1,
                        businessObjectCode: "SRM_C_SRM_SSLM_SITE_EVAL_HEADER",
                      });
                      itemName.setData(lovList.itemName);
                      itemId.setData(lovList.itemId);
                      itemCode.setData(lovList.itemCode);
                      itemCategoryId.setData(lovList.categoryId || null);
                      itemCategoryCode.setData(lovList.categoryCode || null);
                      itemCategoryName.setData(lovList.categoryName || null);
                    },
                    onClear: () => {
                      const { itemCategoryId, itemName, itemCategoryCode, itemCategoryName, itemId, itemCode } = getFields(_ds, [ "itemCategoryId", "itemName", "itemCategoryCode", "itemCategoryName", "itemId", "itemCode" ]);
                      itemCategoryCode.setLovParam({
                        tenantId: localStorage.getItem("tenantId"),
                        enabledFlag: 1,
                        businessObjectCode: "SRM_C_SRM_SSLM_SITE_EVAL_HEADER",
                      });
                      itemId.setData(null);
                      itemName.setData(null);
                      itemCode.setData(null);
                      itemCategoryId.setData(null);
                      itemCategoryCode.setData(null);
                      itemCategoryName.setData(null);
                    }
                  }}
                />
              </div>
            </div>;
          },
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.itemName").$D("物料名称"),
          fieldCode: "itemName",
          fieldType: "INPUT",
          disabled: (val, record) => Boolean(record.itemCode),
        },
        {
          fieldCode: "itemCategoryCode",
          fieldType: "TREE",
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.categoryCode").$D("品类编码"),
          // lovCode: "SMDM.CATEGORY.LEVEL_CONTROL_TREE",
          lovCode: "SMDM.TREE_ITEM_CATEGORY",
          options: {
            valueField: "categoryCode",
            displayField: "categoryCode", // lov选择后显示字段
            queryParams: {
              tenantId: localStorage.getItem("tenantId"),
              enabledFlag: 1,
              businessObjectCode: "SRM_C_SRM_SSLM_SITE_EVAL_HEADER",
            },
            onClear: (ds) => {
              const itemId = ds.current && ds.current.getField("itemId");
              itemId.setLovParam({
                tenantId: localStorage.getItem("tenantId"),
              });
              const itemCategoryName = ds.current && ds.current.getField("itemCategoryName");
              const itemCategoryId = ds.current && ds.current.getField("itemCategoryId");
              const itemCategoryCode = ds.current && ds.current.getField("itemCategoryCode");
              itemCategoryCode.setData(null);
              itemCategoryName.setData(null);
              itemCategoryId.setData(null);
            },
            callback: (val, fieldCode, display, ds) => {
              let item = {};
              if (val.length) {
                item = val[0];
              }
              const itemId = ds.current && ds.current.getField("itemId");
              itemId.setLovParam({ categoryId: item.categoryId, supplierCompanyId: item.supplierId });
              const itemCategoryName = ds.current && ds.current.getField("itemCategoryName");
              const itemCategoryId = ds.current && ds.current.getField("itemCategoryId");
              itemCategoryName.setData(item.categoryName);
              itemCategoryId.setData(item.categoryId);
            },
          }
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.categoryName").$D("品类名称"),
          fieldCode: "itemCategoryName",
          fieldType: "INPUT",
          disabled: (val, record) => Boolean(record.itemCategoryCode),
        },
        {
          formRow: 99999,
          fieldType: "EMPTY",
          render: (val, record) => <srm-flex justify="end">
            <srm-button type="primary" fill onClick={() => this.handleToDetail(record, "itemCategory")}> { this.$T("smbl.common.button.moreDetails").$D("更多详情") } </srm-button>
          </srm-flex>
        },
      ] : [
        {
          formRow: 10,
          fieldCode: "itemCode",
          fieldType: "EMPTY",
          render: (val, record) => <SrmListHeader showOpenTag={true}>
            <span>{$T("sslm.purchaserEvaluationDetail.table.column.label.itemCode").$D("物料编码")}：</span>
            <span>{record.itemCode}</span>
          </SrmListHeader>,
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.itemName").$D("物料名称"),
          fieldCode: "itemName",
          formRow: 20,
          formCol: 10,
        },
        {
          fieldCode: "itemCategoryCode",
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.categoryCode").$D("品类编码"),
          formRow: 30,
          formCol: 10,
          disabled: (val, record) => record.itemCategoryCode,
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.categoryName").$D("品类名称"),
          fieldCode: "itemCategoryName",
          formRow: 30,
          formCol: 20,
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.brand").$D("品牌"),
          fieldCode: "brand",
          formRow: 40,
          formCol: 10,
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.remark").$D("备注"),
          fieldCode: "remark",
          formRow: 50,
          formCol: 10,
        },
      ];
      return columns;
    },
    // 评估小组Columns
    getAssessmentPanelColumns() {
      const columns = this.isEditList.assessmentPanel ? [
        {
          formRow: 0,
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.Account").$D("账户"),
          fieldCode: "userId",
          fieldType: "EMPTY",
          render: (val, record, property, _dataSet) => {
            const { dataSet: _ds } = _dataSet;
            const { fieldName, fieldCode } = property;
            const { userType, evalGroupId, scoreStatus } = record || {};
            const supplierFlag = userType === "SUPPLIER" || isEmpty(userType);
            const disabledFlag = Boolean(supplierFlag || scoreStatus || evalGroupId);
            // 兼容行编辑图标样式
            return <div style={ this.assessmentPanelDs.editFlag ? this.editStyle : this.unEditStyle }>
              <span style={{ marginRight: "8px" }}>{fieldName}:</span>
              <div style={{ flex: 1 }}>
                <srm-lov-field
                  key={fieldCode}
                  display={record.loginName}
                  v-model={record.loginName}
                  code="SSLM.TENANT.SUB.ACCOUNT"
                  disabled={disabledFlag}
                  placeholder={this.$T("smbl.common.tab.pleaseSelect").$D("请选择") + fieldName}
                  options={{
                    displayField: "loginName", // lov选择后显示字段
                    queryParams:{
                      tenantId: localStorage.getItem("tenantId"),
                    },
                    callback: (lovRecord) => {
                      const lovList = lovRecord[0] || {};
                      const { member, department, post, email, internationalTelCode, phone, loginName, userId } = getFields(_ds, [ "member", "department", "post", "email", "internationalTelCode", "phone", "loginName", "userId" ]);
                      member.setData(lovList.name);
                      department.setData(lovList.unitName);
                      post.setData(lovList.positionName);
                      email.setData(lovList.email);
                      internationalTelCode.setData(lovList.internationalTelCode);
                      phone.setData(lovList.mobile);
                      loginName.setData(lovList.loginName);
                      userId.setData(lovList.id);
                    },
                    onClear: () => {
                      const { member, department, post, email, internationalTelCode, phone, loginName, userId } = getFields(_ds, [ "member", "department", "post", "email", "internationalTelCode", "phone", "loginName", "userId" ]);
                      userId.setData(null);
                      loginName.setData(null);
                      member.setData(null);
                      department.setData(null);
                      post.setData(null);
                      email.setData(null);
                      internationalTelCode.setData(null);
                      phone.setData(null);
                    }
                  }}
                />
              </div>
            </div>;
          },
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.member").$D("名称"),
          fieldCode: "member",
          fieldType: "INPUT",
          disabled: (val, record) => {
            const { progressStatus } = this.basicInfo || {};
            const { scoreStatus } = record || {};
            const editorFlag = progressStatus === "EVAL_RESULT" ? !scoreStatus : true;
            return !editorFlag;
          }
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.evaluationIndex").$D("评估指标"),
          fieldCode: "scoreStatus",
          fieldType: "TEXT",
          render: (value, record) => {
            if (value) {
              return <SrmButton plain rect onClick={() => this.onEvaluationClick(record)}>
                {this.$T("sslm.common.view.message.view").$D("查看")}
              </SrmButton>;
            }
            return "-";
          },
        },
        {
          fieldName: this.$T("sslm.purchaserEvaluationDetail.table.column.label.siteLocation").$D("现场定位"),
          fieldCode: "siteLocation",
          fieldType: "TEXT",
        },
        {
          formRow: 99999,
          fieldType: "EMPTY",
          render: (val, record) => <srm-flex justify="end">
            <srm-button type="primary" fill onClick={() => this.handleToDetail(record, "assessmentPanel")}> { this.$T("smbl.common.button.moreDetails").$D("更多详情") } </srm-button>
          </srm-flex>
        },
      ] : [
        {
          formRow: 10,
          fieldCode: "userType",
          fieldType: "EMPTY",
          render: (val, record) => <SrmListHeader showOpenTag={true}>
            <span>{$T("sslm.purchaserEvaluationDetail.table.column.label.userType").$D("代表方")}：</span>
            <span>{record.userTypeMeaning}</span>
          </SrmListHeader>,
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.supplierContacts").$D("供应商联系人"),
          fieldCode: "supplierUserId",
          formRow: 20,
          formCol: 10,
          render: (val, record) => record.member,
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.Account").$D("账户"),
          fieldCode: "userId",
          formRow: 30,
          formCol: 10,
          render: (val, record) => record.loginName,
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.member").$D("名称"),
          fieldCode: "member",
          formRow: 30,
          formCol: 20,
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.department").$D("部门"),
          fieldCode: "department",
          formRow: 40,
          formCol: 10,
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.station").$D("岗位"),
          fieldCode: "post",
          formRow: 40,
          formCol: 20,
        },
        {
          fieldName: this.$T("sslm.purchaserEvaluationDetail.table.column.label.supplierTelephone").$D("供应商联系电话"),
          fieldCode: "phone",
          formRow: 50,
          formCol: 10,
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.email").$D("邮箱"),
          fieldCode: "email",
          formRow: 60,
          formCol: 10,
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.isLeader").$D("是否组长"),
          fieldCode: "leaderFlag",
          render: (val) => yesOrNoRender(val),
          formRow: 70,
          formCol: 10,
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.evaluationIndex").$D("评估指标"),
          fieldCode: "scoreStatus",
          formRow: 80,
          formCol: 20,
          render: (value, record) => {
            if (value) {
              return <SrmButton plain rect onClick={() => this.onEvaluationClick(record)}>
                {this.$T("sslm.common.view.message.view").$D("查看")}
              </SrmButton>;
            }
            return "-";
          },
        },
        {
          fieldName: this.$T("sslm.purchaserEvaluationDetail.table.column.label.siteLocation").$D("现场定位"),
          fieldCode: "siteLocation",
          fieldType: "TEXT",
          formRow: 90,
          formCol: 10,
        },
      ];
      return columns;
    },
    // 评估信息Columns
    getAssessmentColumns() {
      const { needFeedbackFlag, progressStatus, evalType, selfIndicatorType } = this.basicInfo || {};
      // 评估策略为勾选‘按照指标类型自评’，‘供应商自评’且为线上打分，显示字段
      const showSelfEvaluation = evalType === "ONLINE" && needFeedbackFlag && selfIndicatorType;
      const columns = [
        {
          fieldCode: "indicatorCode",
          fieldType: "EMPTY",
          formRow: 0,
          render: (val) => <srm-list-header show-open-tag={true}>
            <span>{ val }</span>
          </srm-list-header>,
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.indicatorName").$D("评估项目名称"),
          fieldCode: "indicatorName",
          fieldType: "TEXT",
          formRow: 10,
          formCol: 10,
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.scoreType").$D("评分方式"),
          fieldCode: "scoreTypeMeaning",
          fieldType: "TEXT",
          formRow: 20,
          formCol: 10,
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.indicatorType").$D("评估项目类型"),
          fieldCode: "indicatorTypeMeaning",
          fieldType: "TEXT",
          formRow: 20,
          formCol: 20,
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.evalStandard").$D("评分标准"),
          fieldCode: "evalStandard",
          fieldType: "TEXT",
          formRow: 30,
          formCol: 10,
        },
        this.isEditList.assessment ? {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.supplierEvalFlag").$D("供应商自评指标"),
          fieldCode: "supplierEvalFlag",
          fieldType: "SELECT",
          lovCode: "SSLM_IS_TRUE",
          visible: needFeedbackFlag,
          formRow: 40,
          formCol: 10,
        } : {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.supplierEvalFlag").$D("供应商自评指标"),
          fieldCode: "supplierEvalFlag",
          fieldType: "TEXT",
          formRow: 40,
          formCol: 10,
          visible: needFeedbackFlag,
          render: (val, record) => record.supplierEvalFlagMeaning
        },
        {
          fieldCode: "supplierScore",
          fieldType: "TEXT",
          fieldName: this.$T("sslm.siteInvestigateReport.modal.mange.supplierScore").$D("供应商自评得分"),
          visible:() => needFeedbackFlag && ![ "EVAL_PREPARE" ].includes(progressStatus) && !showSelfEvaluation,
          formRow: 50,
          formCol: 10,
        },
        {
          fieldCode: "selfSupplierScore",
          fieldType: "TEXT",
          fieldName: this.$T("sslm.purchaserEvaluationDetail.table.column.label.selfSupplierScore").$D("供应商自评打分"),
          visible:() => showSelfEvaluation,
          formRow: 50,
          formCol: 10,
        },
        {
          fieldCode: "selfIsStandard",
          fieldName: this.$T("sslm.purchaserEvaluationDetail.table.column.label.selfIsStandard").$D("供应商自评符合评分标准"),
          fieldType: "TEXT",
          render: (val, record) => yesOrNoRender(record.selfIsStandard),
          visible:() => showSelfEvaluation,
          formRow: 60,
          formCol: 10,
        },
        {
          fieldCode: "selfIsVeto",
          fieldName: this.$T("sslm.purchaserEvaluationDetail.table.column.label.selfIsVeto").$D("供应商自评否决该项"),
          fieldType: "TEXT",
          render: (val, record) => yesOrNoRender(record.selfIsStandard),
          visible:() => showSelfEvaluation,
          formRow: 70,
          formCol: 10,
        },
        {
          fieldCode: "selfIndOptId",
          fieldName: this.$T("sslm.purchaserEvaluationDetail.table.column.label.selfIndOptId").$D("供应商自评评分选项"),
          fieldType: "TEXT",
          render: (val, record) => record.selfIndOptName,
          visible:() => showSelfEvaluation,
          formRow: 80,
          formCol: 10,
        },
        {
          fieldCode: "supplierRemarks",
          fieldType: "TEXT",
          fieldName: this.$T("sslm.siteInvestigateReport.modal.mange.supplierRemarks").$D("供应商自评意见"),
          visible:() => needFeedbackFlag && ![ "EVAL_PREPARE" ].includes(progressStatus),
          formRow: 90,
          formCol: 10,
        },
        {
          fieldCode: "attachmentUuid",
          fieldType: "UPLOAD",
          fieldName: this.$T("sslm.siteInvestigateReport.modal.mange.supplierAttachement").$D("供应商反馈附件"),
          showCount: true,
          visible:() => needFeedbackFlag && ![ "EVAL_PREPARE" ].includes(progressStatus),
          formRow: 100,
          formCol: 10,
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.evalWeight").$D("指标权重"),
          fieldCode: "evalWeight",
          fieldType: "TEXT",
          formRow: 110,
          formCol: 10,
        },
        {
          fieldName: this.$T("sslm.purchaserEvaluationDetail.table.column.label.scorer").$D("评分人"),
          fieldCode: "scorer",
          fieldType: "TEXT",
          formRow: 120,
          formCol: 10,
          visible: this.isEditList.assessment,
          render: (val, record) => {
            // 评分信息
            const { leafFlag, scoreType, evalResps } = record || {};
            const evalRespsNum = evalResps && evalResps.filter((e) => e.isSelect).length || 0;
            return scoreType === "SYSTEM" ?
              <span> { this.$T("sslm.common.modal.grade.systemRate").$D("系统评分") } </span> :
              !leafFlag ? "-" : <srm-button plain onClick={(e) => {
                e.stopPropagation();
                this.openAssignedRater(record, false);
              }}>
                { this.$T("sslm.common.model.message.assign").$D("分配") }{`(${evalRespsNum})`}
              </srm-button>;
          }
        },
        {
          fieldName: this.$T("sslm.purchaserEvaluationDetail.table.column.label.indicatorStatus").$D("指标评估状态"),
          fieldCode: "completeFlag",
          fieldType: "TEXT",
          formRow: 130,
          formCol: 10,
          render: (val, record) => {
            const { leafFlag, scoreType } = record || {};
            const flag = !leafFlag || scoreType === "SYSTEM"; // 顶级指标和系统评分不展示
            return flag ? "-" : <srm-button plain onClick={(e) => {
              e.stopPropagation();
              this.viewIndicatorStatus(record, false);
            }}>
              { this.$T("smbl.common.view.button.view").$D("查看") }
            </srm-button>;
          }
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.chidrenMaintain").$D("下级指标"),
          fieldCode: "chidrenMaintain",
          fieldType: "TEXT",
          formRow: 140,
          formCol: 10,
          render: (val, record) => {
            const showFlag = record.children && record.children.length > 0;
            return showFlag ? <srm-button
              plain
              onClick={() => {
                this.maintainChildrenAction(record, this.isEditList.assessment);
              }}>
              {this.isEditList.assessment ? this.$T("sslm.purchaserEvaluationDetail.table.column.label.maintain").$D("编辑") : this.$T("smbl.common.view.button.view").$D("查看")}
            </srm-button> : "-";
          },
        }
      ];
      return columns;
    },
    // 评估结果
    getResultsColumns() {
      const { evalType } = this.basicInfo || {};
      const isOnLine = evalType === "ONLINE";
      const columns = this.isEditList.results ? [
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.form.label.finalScore").$D("最后得分"),
          fieldCode: "finalScore",
          fieldType: isOnLine ? "TEXT" : "INPUT",
          formRow: 10,
          formCol: 10,
          disabled: (val, record) => record.evalType === "ONLINE",
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.form.label.level").$D("等级"),
          fieldCode: "grade",
          fieldType: isOnLine ? "TEXT" : "INPUT",
          formRow: 20,
          formCol: 10,
          disabled: (val, record) => record.evalType === "ONLINE",
        },
        {
          formRow: 30,
          formCol: 10,
          fieldName: $T("sslm.purchaserEvaluationDetail.form.label.resultsFlag").$D("评估结果"),
          fieldCode: "resultsFlag",
          fieldType: "SELECT",
          lovCode: "SSLM.INVESTIGATION.RESULTS",
          required: (val, record) => {
            const { progressStatus } = record || {};
            return !this.readOnly && (this.resultConfirm || progressStatus === "EVAL_RESULT");
          },
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.form.label.opinion").$D("综合意见"),
          fieldCode: "opinion",
          fieldType: "TEXT_AREA",
          formRow: 40,
          formCol: 10,
          required: (val, record) => {
            const { progressStatus } = record || {};
            return !this.readOnly && (this.resultConfirm || progressStatus === "EVAL_RESULT");
          },
        },
        {
          fieldName: $T("sslm.common.model.field.ratersSynthesizeOpinions").$D("评分人综合意见"),
          fieldCode: "respUserRemarks",
          fieldType: "TEXT_AREA",
          disabled: true,
          formRow: 50,
          formCol: 10,
        },
        {
          formRow: 60,
          formCol: 10,
          fieldName: $T("sslm.purchaserEvaluationDetail.form.label.copyTo").$D("抄送"),
          fieldCode: "informUserIds",
          fieldType: "LOV",
          lovCode: "SPUC.ACCEPT_USER",
          // displayField: "itemCode", // 外层描述显示字段
          options: {
            multiple: true,
            // valueField: "itemCode",
            queryParams:{
              tenantId: localStorage.getItem("tenantId"),
            },
          },
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.form.label.resultLinkAtt").$D("审查结果附件"),
          fieldCode: "resultLinkUuid",
          fieldType: "UPLOAD",
          bucketName: "private-bucket",
          canUpload: true,
          formRow: 70,
          formCol: 10,
        },
      ] : [
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.form.label.finalScore").$D("最后得分"),
          fieldCode: "finalScore",
          formRow: 10,
          formCol: 10,
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.form.label.level").$D("等级"),
          fieldCode: "grade",
          formRow: 20,
          formCol: 10,
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.form.label.resultsFlag").$D("评估结果"),
          fieldCode: "resultsFlag",
          formRow: 30,
          formCol: 10,
          render: (val, record) => record.resultsFlagMeaning,
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.form.label.opinion").$D("综合意见"),
          fieldCode: "opinion",
          formRow: 40,
          formCol: 10,
        },
        {
          fieldName: $T("sslm.common.model.field.ratersSynthesizeOpinions").$D("评分人综合意见"),
          fieldCode: "respUserRemarks",
          formRow: 50,
          formCol: 10,
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.form.label.sendTo").$D("抄送"),
          fieldCode: "sendTo",
          formRow: 60,
          formCol: 10,
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.form.label.resultLinkAtt").$D("审查结果附件"),
          fieldCode: "resultLinkUuid",
          fieldType: "UPLOAD",
          bucketName: "private-bucket",
          formRow: 60,
          formCol: 20,
        },
      ];
      return columns;
    },
    // 质量整改
    getReformColumns() {
      const columns = this.isEditList.reformIsView ? [
        {
          formRow: 0,
          fieldName: $T("sslm.purchaserEvaluationDetail.scoreTable.label.reformContent").$D("整改内容"),
          fieldCode: "reformContent",
          fieldType: "EMPTY",
          required: true,
          render: (val, record, property) => {
            const { fieldName } = property;
            // 兼容行编辑图标样式
            return <div style={ this.reformDs.editFlag ? this.editStyle : this.unEditStyle }>
              <span style={{ marginRight: "8px" }}>{fieldName}:</span>
              <div style={{ flex: 1 }}>
                <srm-input-field
                  disabled={!this.isEditList.reform}
                  v-model={record.reformContent}
                  placeholder={this.$T("smbl.common.tab.pleaseSelect").$D("请选择") + fieldName}/>
              </div>
            </div>;
          },
        },
      ] : [
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.scoreTable.label.problemStatusMeaning").$D("单据状态"),
          fieldCode: "problemStatusMeaning",
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.scoreTable.label.opteration").$D("操作"),
          fieldCode: "opteration",
          render: (val, record) => {
            const { problemNum } = record;
            if (!problemNum) {
              return <srm-button plain={true} onClick={(e) => {
                e.stopPropagation();
                this.toReformDetail(record, "create");
              }}>
                { $T("sslm.supplierDocManage.view.button.qualityRectification").$D("发起质量整改") }
              </srm-button>;
            }
            return "-";
          }
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.scoreTable.label.problemNum").$D("整改报告编号"),
          fieldCode: "problemNum",
          render: (val, record) => {
            if (val) {
              return <srm-button plain={true} onClick={(e) => {
                e.stopPropagation();
                this.toReformDetail(record, "view");
              }}>
                { val }
              </srm-button>;
            }
            return "-";
          }
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.scoreTable.label.problemTitle").$D("整改报告标题"),
          fieldCode: "problemTitle",
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.scoreTable.label.reformContent").$D("整改内容"),
          fieldCode: "reformContent",
        },
      ];
      return columns;
    },
    // 评估指标pop信息Columns
    getEvaluationColumns() {
      const columns = [
        {
          formRow: 0,
          fieldCode: "indicatorCode",
          fieldType: "EMPTY",
          render: (val, record) => {
            const color = renderStatus(record.reportStatus);
            return <SrmListHeader showOpenTag={true}>
              <span>{val}</span>
              <span slot="right" style={{ color: `${color}` }}>{record.completeFlagMeaning}</span>
            </SrmListHeader>;
          },
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.indicatorName").$D("评估项目名称"),
          fieldCode: "indicatorName",
          fieldType: "TEXT",
          formRow: 10,
          formCol: 10,
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.respWeight").$D("评分人权重"),
          fieldCode: "respWeight",
          fieldType: "TEXT",
          formRow: 20,
          formCol: 10,
          render: (val) => `${val}%`
        },
        {
          fieldName: $T("sslm.common.model.archiveFilled.score").$D("得分"),
          fieldCode: "score",
          fieldType: "TEXT",
          formRow: 30,
          formCol: 10,
        },
      ];
      return columns;
    },
    // 指标评估状态
    getIndicatorColumns() {
      const columns = [
        {
          formRow: 0,
          fieldCode: "realName",
          fieldType: "EMPTY",
          render: (val, record) => {
            const color = renderStatus(record.completeFlag);
            return <SrmListHeader showOpenTag={true}>
              <span>{val}</span>
              <span slot="right" style={{ color: `${color}` }}>{record.completeFlagMeaning}</span>
            </SrmListHeader>;
          },
        },
        {
          fieldName: this.$T("sslm.common.modal.grade.description").$D("评分描述"),
          fieldCode: "indicatorName",
          fieldType: "TEXT",
          formRow: 10,
          formCol: 10,
        },
        {
          fieldName: this.$T("sslm.purchaserEvaluationDetail.table.column.label.respWeight").$D("评分人权重"),
          fieldCode: "respWeight",
          fieldType: "TEXT",
          formRow: 20,
          formCol: 10,
        },
        {
          fieldName: this.$T("sslm.common.modal.grade.defaultScore").$D("缺省分值"),
          fieldCode: "defaultScore",
          fieldType: "TEXT",
          formRow: 30,
          formCol: 10,
        },
        {
          fieldName: this.$T("sslm.purchaserEvaluationDetail.table.column.label.siteLocation").$D("现场定位"),
          fieldCode: "siteLocation",
          fieldType: "TEXT",
          formRow: 40,
          formCol: 10,
        },
      ];
      return columns;
    },
    // 退回评分
    getBackScoreColumns() {
      const columns = [
        {
          formRow: 0,
          fieldCode: "indicatorCode",
          fieldType: "EMPTY",
          render: (val, record) => <SrmListHeader showOpenTag={true}>
            <span>{val}</span>
            <span slot="right">{record.completeFlagMeaning}</span>
          </SrmListHeader>,
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.indicatorName").$D("评估项目名称"),
          fieldCode: "indicatorName",
          fieldType: "TEXT",
          formRow: 10,
          formCol: 10,
        },
        {
          fieldName: $T("sslm.common.view.scorer").$D("评分人"),
          fieldCode: "userName",
          fieldType: "TEXT",
          formRow: 20,
          formCol: 10,
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.respWeight").$D("评分人权重"),
          fieldCode: "respWeight",
          fieldType: "TEXT",
          formRow: 20,
          formCol: 20,
        },
        {
          fieldName: $T("sslm.commonApplication.view.message.score").$D("得分"),
          fieldCode: "score",
          fieldType: "TEXT",
          formRow: 30,
          formCol: 10,
        },
        {
          fieldName: $T("sslm.commonApplication.model.message.backReason").$D("退回原因"),
          fieldCode: "backReason",
          fieldType: "INPUT",
          formRow: 40,
          formCol: 10,
        },
      ];
      return columns;
    },
  },
  methods:{
    // 指标评估状态
    viewIndicatorStatus(record) {
      const indicatorDataSet = new DataSet(commonDs());
      const { evalResps, indicatorName, indicatorCode } = record || {};
      indicatorDataSet.setData(evalResps || []);
      this.$popup({
        title: this.$T("sslm.purchaserEvaluationDetail.table.column.label.indicatorStatus").$D("指标评估状态"),
        showHeader: true,
        showClose: false,
        position: "right",
        headerAlign: "start",
        showBack: true,
        content: <div class="srm-assessment-panel">
          <div class="srm-assessment-panel-header">
            <span class="srm-assessment-header-left">
              <span>{this.$T("sslm.purchaserEvaluationDetail.table.column.label.indicatorCode").$D("评估项目代码")}：</span>
              <span>{indicatorCode}</span>
            </span>
            <span class="srm-assessment-header-right">
              <span>{this.$T("sslm.purchaserEvaluationDetail.table.column.label.indicatorName").$D("评估项目名称")}：</span>
              <span>{indicatorName}</span>
            </span>
          </div>
          <div class="srm-assessment-panel-division"/>
          <srm-list
            customize-code="SMBL.PUR_EVALUATION_WORKBENCH.MANAGE.DETAIL.ASSESSMENT.IND_STATUS"
            columns={this.getIndicatorColumns}
            dataSet={indicatorDataSet}/>
        </div>,
      });
    },
    // record：行数据 ｜ batchFlag：批量分配
    openAssignedRater(record, batchFlag = false) {
      const { evalHeaderId } = record || {};
      this.scorePopRef = this.$popup({
        title: this.$T("sslm.purchaserEvaluationDetail.scoreTable.label.isSelect").$D("分配评分人"),
        showHeader: true,
        showClose: true,
        position: "bottom",
        height: "70vh",
        rounded: true,
        content: <AssignedRater
          assessmentDs={this.assessmentDs}
          curRecord={record}
          basicDs={this.basicDs}
          evalHeaderId={evalHeaderId}
          on-closePop={() => {
            this.assessmentDs.refresh();
            this.assessmentPanelDs.refresh();
            this.scorePopRef.closePopup();
            this.handleEdit(this.tabType.assessment, false);
          }}
          batchFlag={batchFlag}/>,
      });
    },
    // 跳转详情页
    handleToDetail(recordData, tabType, isList = false) {
      let record = {};
      if (isList) {
        record = recordData.data;
      } else {
        record = recordData;
      }
      switch (tabType) {
      case "basic":
        this.basePopupFlag = !this.basePopupFlag;
        break;
      case "company":
        this.companyPopupFlag = !this.companyPopupFlag;
        break;
      case "supplier":
        this.supplierPopupFlag = !this.supplierPopupFlag;
        break;
      case "itemCategory":
        this.itemCategoryDetail = record;
        this.itemCategoryPopupFlag = !this.itemCategoryPopupFlag;
        break;
      case "assessmentPanel":
        this.assessmentPanelDetail = record;
        this.assessmentPanelPopupFlag = !this.assessmentPanelPopupFlag;
        break;
      default:
        return false;
      }
    },
    // 处理基础信息的必输问题
    getBasicInfoRequire ({ record, isCreate, readOnly }) {
      const { progressStatus, reportStatus } = record || {};
      return (
        isCreate ||
        !readOnly &&
        [ "EVAL_PREPARE" ].includes(progressStatus) &&
        [ "NEW", "REJECTED" ].includes(reportStatus)
      );
    },
    // 评估指标回调
    onEvaluationClick(record) {
      const evaluationDataSet = new DataSet(commonDs());
      const { siteEvalLineResps, loginName, member } = record || {};
      evaluationDataSet.setData(siteEvalLineResps || []);
      this.$popup({
        title: $T("sslm.purchaserEvaluationDetail.view.content.assessmentPanel").$D("评估小组"),
        showHeader: true,
        showClose: false,
        position: "right",
        headerAlign: "start",
        showBack: true,
        content: <div class="srm-assessment-panel">
          <div class="srm-assessment-panel-header">
            <span class="srm-assessment-header-left">
              <span>{$T("sslm.purchaserEvaluationDetail.table.column.label.Account").$D("账户")}：</span>
              <span>{loginName}</span>
            </span>
            <span class="srm-assessment-header-right">
              <span>{$T("sslm.purchaserEvaluationDetail.table.column.label.member").$D("名称")}：</span>
              <span>{member}</span>
            </span>
          </div>
          <div class="srm-assessment-panel-division"/>
          <srm-list
            columns={this.getEvaluationColumns}
            dataSet={evaluationDataSet}/>
        </div>,
      });
    },
    // 下级指标
    maintainChildrenAction(record, editFlag) {
      this.maintainPopRef = this.$popup({
        title: this.$T("smbl.common.view.detail").$D("详情"),
        showHeader: true,
        showClose: false,
        position: "right",
        headerAlign: "start",
        showBack: true,
        content: <IndicatorMaintain
          indicatorInfo={record}
          basicDs={this.basicDs}
          editFlag={editFlag}
          on-closeIndicatorMaintainPop={() => {
            this.maintainPopRef?.closePopup();
            this.assessmentDs.refresh();
            this.assessmentPanelDs.refresh();
          }}/>,
      });
    },
    // 评估物料/品类详情信息
    getItemCategoryDetailColumns(lineRecord = {}) {
      const columns = [
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.itemCode").$D("物料编码"),
          fieldCode: "itemCode",
          fieldType: "LOV",
          lovCode: "SSLM.RELATED_CATEGORY_ITEM",
          // displayField: "itemCode", // 外层描述显示字段
          options: {
            multiple: false,
            valueField: "itemCode",
            queryParams:{
              tenantId: localStorage.getItem("tenantId"),
              supplierCompanyId: lineRecord?.supplierId || null,
              categoryId: lineRecord?.itemCategoryId || null,
            },
            onClear: () => {
              lineRecord.itemName = null;
              lineRecord.itemCode = null;
              lineRecord.itemId = null;
              lineRecord.itemCategoryId = null;
              lineRecord.itemCategoryCode = null;
              lineRecord.itemCategoryName = null;
            },
            callback: (val) => {
              const item = val.length ? val[0] : {};
              const { itemId, itemName, categoryId, categoryCode, categoryName } = item;
              lineRecord.itemId = itemId;
              lineRecord.itemName = itemName;
              lineRecord.itemCategoryId = categoryId;
              lineRecord.itemCategoryCode = categoryCode;
              lineRecord.itemCategoryName = categoryName;
            },
          },
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.itemName").$D("物料名称"),
          fieldCode: "itemName",
          fieldType: "INPUT",
          disabled: (val, record) => Boolean(record.itemCode),
        },
        {
          fieldCode: "itemCategoryCode",
          fieldType: "TREE",
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.categoryCode").$D("品类编码"),
          lovCode: "SMDM.CATEGORY.LEVEL_CONTROL_TREE",
          options: {
            valueField: "categoryCode",
            displayField: "categoryCode", // lov选择后显示字段
            queryParams: {
              tenantId: localStorage.getItem("tenantId"),
              supplierCompanyId: lineRecord?.supplierCompanyId || null,
              itemId: lineRecord?.itemId || null,
              enabledFlag: 1,
              businessObjectCode: "SRM_C_SRM_SSLM_SITE_EVAL_HEADER",
            },
            onClear: () => {
              lineRecord.itemCategoryName = null;
              lineRecord.itemCategoryId = null;
              lineRecord.itemCategoryCode = null;
            },
            callback: (val) => {
              const item = val.length ? val[0] : {};
              const { categoryId, categoryName } = item;
              lineRecord.itemCategoryName = categoryName;
              lineRecord.itemCategoryId = categoryId;
            },
          }
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.categoryName").$D("品类名称"),
          fieldCode: "itemCategoryName",
          fieldType: "INPUT",
          disabled: (val, record) => Boolean(record.itemCategoryCode),
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.brand").$D("品牌"),
          fieldCode: "brand",
          fieldType: "INPUT",
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.remark").$D("备注"),
          fieldCode: "remark",
          fieldType: "INPUT",
        },
      ];
      return columns;
    },
    // 评估小组详情Columns
    getAssePanelDetailColumns(lineRecord = {}) {
      const { companyId, supplierTenantId, supplierCompanyId, progressStatus } = this.basicDs?.current?.data || {};
      const { scoreStatus } = lineRecord || {};
      const editorFlag = progressStatus === "EVAL_RESULT" ? !scoreStatus : true;
      const columns = [
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.userType").$D("代表方"),
          fieldCode: "userType",
          fieldType: "SELECT",
          lovCode: "SSLM.SITE_GROUP_TYPE",
          displayField: "userTypeMeaning",
          options: {
            displayField: "meaning",
            valueField: "value",
          },
          disabled: (val, record) => {
            const { supplierUserId, userId, templateAddFlag, evalGroupId } = record || {};
            let supplierUserIdFlag = false;
            let userIdFlag = false;
            if (typeof supplierUserId === "number") {
              supplierUserIdFlag = Number(supplierUserId);
            } else {
              supplierUserIdFlag = !isEmpty(supplierUserId);
            }
            if (typeof userId === "number") {
              userIdFlag = Number(userId);
            } else {
              userIdFlag = !isEmpty(userId);
            }
            return Boolean(supplierUserIdFlag || userIdFlag || templateAddFlag || evalGroupId);
          },
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.supplierContacts").$D("供应商联系人"),
          fieldCode: "supplierUserId",
          fieldType: "LOV",
          lovCode: "SSLM.SUPPLIER_MAIN_DATA_CONTACT",
          displayField: "member", // 外层描述显示字段-初始调用接口数据显示字段
          options: {
            multiple: false,
            valueField: "id",
            displayField: "name", // lov选择后显示字段
            queryParams:{
              companyId: companyId,
              partnerTenantId: supplierTenantId,
              partnerCompanyId: supplierCompanyId,
            },
            onClear: () => {
              lineRecord.member = null;
              lineRecord.department = null;
              lineRecord.post = null;
              lineRecord.email = null;
              lineRecord.internationalTelCode = null;
              lineRecord.phone = null;
            },
            callback: (val) => {
              const item = val.length ? val[0] : {};
              const { name, department, position, mail, internationalTelCode, mobilephone } = item;
              lineRecord.member = name;
              lineRecord.department = department;
              lineRecord.post = position;
              lineRecord.email = mail;
              lineRecord.internationalTelCode = internationalTelCode;
              lineRecord.phone = mobilephone;
            },
          },
          disabled: (val, record) => {
            const { userType, templateAddFlag, evalGroupId } = record || {};
            const purchaserFlag =
              userType === "PURCHASER" || templateAddFlag || evalGroupId || isEmpty(userType);
            return Boolean(purchaserFlag);
          },
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.Account").$D("账户"),
          fieldCode: "userId",
          fieldType: "LOV",
          lovCode: "SSLM.TENANT.SUB.ACCOUNT",
          // displayField: "loginName", // 外层描述显示字段-初始调用接口数据显示字段
          options: {
            multiple: false,
            valueField: "id",
            displayField: "loginName", // lov选择后显示字段
            queryParams:{
              tenantId: localStorage.getItem("tenantId"),
            },
            onClear: () => {
              lineRecord.userId = null;
              lineRecord.loginName = null;
              lineRecord.member = null;
              lineRecord.department = null;
              lineRecord.post = null;
              lineRecord.email = null;
              lineRecord.internationalTelCode = null;
              lineRecord.phone = null;
            },
            callback: (val) => {
              const item = val.length ? val[0] : {};
              const { name, unitName, positionName, email, internationalTelCode, mobile } = item;
              lineRecord.member = name;
              lineRecord.department = unitName;
              lineRecord.post = positionName;
              lineRecord.email = email;
              lineRecord.internationalTelCode = internationalTelCode;
              lineRecord.phone = mobile;
            },
          },
          disabled: (val, record) => {
            const { userType, evalGroupId, scoreStatus: curScoreStatus } = record || {};
            const supplierFlag = userType === "SUPPLIER" || isEmpty(userType);
            return Boolean(supplierFlag || curScoreStatus || evalGroupId);
          },
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.member").$D("名称"),
          fieldCode: "member",
          fieldType: "INPUT",
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.department").$D("部门"),
          fieldCode: "department",
          fieldType: "INPUT",
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.station").$D("岗位"),
          fieldCode: "post",
          fieldType: "INPUT",
        },
        {
          fieldName: this.$T("sslm.purchaserEvaluationDetail.table.column.label.supplierTelephone").$D("供应商联系电话"),
          fieldCode: "phone",
          fieldType: "INPUT_NUMBER",
          prefixField:{
            lovCode:"HPFM.IDD",
            defaultValue:{ value: "+86", meaning:this.$T("smbl.common.message.internationalTel.china86").$D("中国大陆 +86") },
            // displayField:"internationalTelCodeMeaning",
            fieldCode:"internationalTelCode",
            fieldType: "SELECT"
          },
          validator: (val) => {
            if (val !== null && val !== "") {
              if (!SrmUtil.isMobileNumber(val)) {
                return this.$T("smbl.small.message.sale.notMobile.customerMobilePhone").$D("手机号码格式不正确！");
              }
            }
          },
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.email").$D("邮箱"),
          fieldCode: "email",
          fieldType: "INPUT",
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.isLeader").$D("是否组长"),
          fieldCode: "leaderFlag",
          fieldType: "SWITCH",
          defaultValue:"0"
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.evaluationIndex").$D("评估指标"),
          fieldCode: "scoreStatus",
          fieldType: "TEXT",
          render: (value, record) => {
            if (value) {
              return <SrmButton plain rect onClick={() => this.onEvaluationClick(record)}>
                {this.$T("sslm.common.view.message.view").$D("查看")}
              </SrmButton>;
            }
            return "-";
          },
        },
        {
          fieldName: this.$T("sslm.purchaserEvaluationDetail.table.column.label.siteLocation").$D("现场定位"),
          fieldCode: "siteLocation",
          fieldType: "TEXT",
        },
      ];
      // 只读页面，禁用编辑
      if (!editorFlag) {
        columns.forEach((record) => {
          Object.assign(record, { disabled: true });
        });
      }
      return columns;
    },
  }
};