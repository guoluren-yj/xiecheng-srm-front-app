import { SrmUtil, $T } from "srm-mobile-ui";
import { isNil } from "lodash";

const tenantId = SrmUtil.getTenantId();

export const listUnitCodes = {
  LIST: "SQAM.CREATE_8D_LIST.GRID",
  SEARCH: "SQAM.CREATE_8D_LIST.FILTER",
};

export const listDS = () => ({
  autoQuery: true,
  selection: Infinity,
  editable: true,
  fields: [
    {
      fieldCode: "problemNum",
      fieldType: "TEXT",
      fieldName: $T("sqam.common.model.qualityRectification.code").$D("整改报告编号"),
    },
    {
      fieldType: "TEXT",
      fieldCode: "problemStatusMeaning",
      fieldName: $T("sqam.common.model.qualityRectification.status").$D("状态"),
    },
    {
      fieldCode: "problemTitle",
      fieldType: "TEXT",
      fieldName: $T("sqam.common.model.qualityRectification.title").$D("整改报告标题"),
    },
    {
      fieldCode: "problemTypeCodeMeaning",
      fieldType: "TEXT",
      fieldName: $T("sqam.common.model.qualityRectification.issue").$D("问题类型"),
    },
    {
      fieldCode: "problemImportanceCodeMeaning",
      fieldType: "TEXT",
      fieldName: $T("sqam.common.model.qualityRectification.significance").$D("重视度"),
    },
    {
      fieldCode: "problemUrgencyCodeMeaning",
      fieldType: "TEXT",
      fieldName: $T("sqam.common.model.qualityRectification.urgency").$D("紧急度"),
    },
    {
      fieldCode: "associateProblemNums",
      fieldType: "TEXT",
      fieldName: $T("sqam.common.model.common.relatedRectification").$D("关联整改报告"),
    },
    {
      fieldCode: "supplierNum",
      fieldType: "TEXT",
      fieldName: $T("entity.supplier.code").$D("供应商编码"),
    },
    {
      fieldCode: "supplierName",
      fieldType: "TEXT",
      fieldName: $T("entity.supplier.name").$D("供应商名称"),
    },
    {
      fieldCode: "companyName",
      fieldType: "TEXT",
      fieldName: $T("entity.company.tag").$D("公司"),
    },
    {
      fieldCode: "ouName",
      fieldType: "TEXT",
      fieldName: $T("entity.business.tag").$D("业务实体"),
    },
    {
      fieldCode: "invOrganizationName",
      fieldType: "TEXT",
      fieldName: $T("entity.organization.class.inventory").$D("库存组织"),
    },
    {
      fieldCode: "itemCode",
      fieldType: "TEXT",
      fieldName: $T("entity.item.code").$D("物料编码"),
    },
    {
      fieldCode: "itemName",
      fieldType: "TEXT",
      fieldName: $T("entity.item.name").$D("物料名称"),
    },
    {
      fieldCode: "sourceCodeMeaning",
      fieldType: "TEXT",
      fieldName: $T("sqam.common.model.qualityRectification.dataSource").$D("创建方式"),
    },
    {
      fieldCode: "sourceNum",
      fieldType: "TEXT",
      fieldName: $T("sqam.common.model.qualityRectification.sourceNum").$D("来源单据编号"),
    },
    {
      fieldCode: "createdName",
      fieldType: "TEXT",
      fieldName: $T("entity.roles.creator").$D("创建人"),
    },
    {
      fieldCode: "creationDate",
      fieldType: "DATE_PICKER",
      fieldName: $T("hzero.common.date.creation").$D("创建日期"),
      options: { format: "yyyy-MM-dd" },
      editor: false,
    },
    {
      fieldCode: "rectifyTypeCodeMeaning",
      fieldType: "TEXT",
      fieldName: $T("sqam.common.model.qualityRectification.rectifyTypeCodeMeaning").$D("整改单类型"),
    },
  ],
  fastQueryField: [
    {
      fieldCode: "problemNum",
      fieldType: "TEXT",
      fieldName: $T("sqam.common.model.qualityRectification.code").$D("整改报告编号"),
    }
  ],
  queryFields: [
    {
      fieldCode: "problemTitle",
      fieldType: "TEXT",
      fieldName: $T("sqam.common.model.qualityRectification.title").$D("整改报告标题"),
    },
    {
      fieldCode: "problemTypeCode",
      fieldType: "SELECT",
      fieldName: $T("sqam.common.model.qualityRectification.issue").$D("问题类型"),
      lovCode: "SQAM.PROBLEM_TYPE",
    },
    {
      fieldCode: "problemImportanceCode",
      fieldType: "SELECT",
      fieldName: $T("sqam.common.model.qualityRectification.significance").$D("重视度"),
      lovCode: "SQAM.PROBLEM_IMPORTANCE",
    },
    {
      fieldCode: "problemUrgencyCode",
      fieldType: "SELECT",
      fieldName: $T("sqam.common.model.qualityRectification.urgency").$D("紧急度"),
      lovCode: "SQAM.PROBLEM_URGENCY",
    },
    {
      fieldCode: "companyId",
      fieldType: "LOV",
      fieldName: $T("entity.company.tag").$D("公司"),
      lovCode: "HPFM.COMPANY",
      options: {
        callback: (selected, valueField, displayField, dataSet) => {
          dataSet.addQueryFieldParameter("invOrganizationId", "companyId", selected?.[0]?.[valueField]);
        }
      },
    },
    {
      fieldCode: "invOrganizationId",
      fieldType: "LOV",
      fieldName: $T("entity.organization.class.inventory").$D("库存组织"),
      lovCode: "SQAM.INVORGNIZATION",
      disabled: (_, item) => isNil(item?.companyId),
      options: {}, // 框架判断有误，options不能传空，不然companyId参数无法生效
    },
    {
      fieldCode: "supplierId",
      fieldType: "LOV",
      fieldName: $T("entity.supplier.tag").$D("供应商"),
      lovCode: "SQAM.CLAIM_SEARCH_SUPPLIER",
      options: {
        valueField: "supplierId",
        textField: "erpSupplierName",
        callback: (selected, valueField, displayField, dataSet) => {
          const val = selected?.[0] || {};
          const {
            supplierId = null,
            supplierCompanyId = null,
            erpSupplierName = null,
            supplierCompanyName = null,
          } = val;
          dataSet.addQueryParameter("extSupplierId", supplierId);
          dataSet.addQueryParameter("supplierCompanyId", supplierCompanyId);
          dataSet.addQueryParameter("erpSupplierName", erpSupplierName || supplierCompanyName);
        },
        onClear: (dataSet) => {
          dataSet.addQueryParameter("extSupplierId", null);
          dataSet.addQueryParameter("supplierCompanyId", null);
          dataSet.addQueryParameter("erpSupplierName", null);
        }
      },
    },
    {
      fieldCode: "itemId",
      fieldType: "LOV",
      fieldName: $T("entity.item.code").$D("物料编码"),
      lovCode: "SQAM.ITEM",
      options: {
        valueField: "itemId",
      }
    },
    {
      fieldCode: "createTimeAfter",
      fieldType: "DATE_PICKER",
      selectType: "start-end",
      endDateFieldCode: "createTimeBefore",
      fieldName: $T("hzero.common.date.creation").$D("创建时间"),
    },
    {
      fieldCode: "createdName",
      fieldType: "TEXT",
      fieldName: $T("entity.roles.creator").$D("创建人"),
    },
    {
      fieldCode: "inspectionNum",
      fieldType: "TEXT",
      fieldName: $T("sqam.common.model.qualityRectification.sourceNum").$D("来源单据编号"),
    },
    {
      fieldCode: "rectifyTypeCode",
      fieldType: "SELECT",
      fieldName: $T("sqam.common.model.qualityRectification.rectifyTypeCode").$D("整改单类型"),
      lovCode: "SQAM.RECTIFY_TYPE",
    },
    {
      fieldCode: "erpProblemNum",
      fieldType: "TEXT",
      fieldName: $T("sqam.common.model.common.erpProblemNum").$D("外部系统单据编号"),
    },
  ],
  queryParameter: {
    tenantId,
    pageEntryPoint: "CUSTOMER_CREATE",
    customizeUnitCode: Object.values(listUnitCodes).join(),
  },
  transport: {
    read: {
      url: `/sqam/v1/${tenantId}/problem-headers`,
      method: "get",
    },
  },
});