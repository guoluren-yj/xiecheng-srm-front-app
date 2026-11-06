/*
 * @Date: 2024-08-28 10:31:02
 * @Author: CDJ
 * @Version: 0.0.1
 * @Copyright: Copyright (c) 2021, Hand
 */
import { $T } from "srm-mobile-ui";
import { yesOrNoRenderer } from "@/utils/renderer";
import { dateFormat } from "@/utils/index";

// 头信息
export const getHeaderInfoColumns = () => [
  {
    fieldCode: "evalPlanDescription",
    fieldType: "EMPTY",
    render: (val, item) => <SrmListHeader showOpenTag={false}>
      <span style={{ fontWeight:600 }}>{val || "-"}</span>
      <span slot="right" >
        {item.evalStatus ?
          <SrmTag
            style={{
              color: "#FC8800",
              backgroundColor: "rgb(252, 136, 0, 0.15)",
            }}
          >
            {item.evalStatusMeaning}
          </SrmTag> :
          ""
        }
      </span>
    </SrmListHeader>,
  },
  {
    fieldCode: "evalPlanNum",
    fieldName: $T("sslm.vendorEvaluationPlanDetail.form.label.evalPlanNum").$D("评估计划单号"),
  },
  {
    fieldCode: "strategyName",
    fieldName: $T("sslm.vendorEvaluationPlanDetail.form.label.defaultEvalPlanStrategyId").$D("默认评估策略"),
  },
  {
    fieldCode: "groupFlag",
    fieldName: $T("sslm.vendorEvaluationPlanDetail.form.label.groupFlag").$D("是否集团级"),
    render: (val) => yesOrNoRenderer(val),
  },
  {
    fieldCode: "companyName",
    fieldName: $T("sslm.vendorEvaluationPlanDetail.form.label.companyName").$D("公司"),
    visible: (val, item) => item.groupFlag !== 1,
  },
  {
    fieldCode: "realName",
    fieldName: $T("sslm.vendorEvaluationPlanDetail.form.label.realName").$D("创建人"),
  },
  {
    fieldCode: "creationDate",
    fieldName: $T("sslm.vendorEvaluationPlanDetail.form.label.creationDate").$D("创建时间"),
  },
  {
    fieldCode: "creatorUnitName",
    fieldName: $T("sslm.vendorEvaluationPlanDetail.form.label.creatorUnit").$D("创建人部门"),
  },
  {
    fieldCode: "assessTypeMeaning",
    fieldName: $T("sslm.vendorEvaluationPlanDetail.form.label.assessType").$D("评估类型"),
  },
  {
    fieldCode: "planRemark",
    fieldName: $T("sslm.vendorEvaluationPlanDetail.form.label.planRemark").$D("评估计划补充说明"),
  },
];

// 评估计划行
export const getPlanLineColumns = ({ groupFlag = 0, detailModalFlag = false } = {}) => [
  detailModalFlag ?
    {
      fieldCode: "supplierCompanyName",
      fieldName: $T("sslm.vendorEvaluationPlanDetail.table.column.label.supplierName").$D("供应商"),
    } :
    {
      fieldCode: "supplierCompanyName",
      fieldType: "EMPTY",
      render: (val) => <SrmListHeader showOpenTag={false}>
        <span style={{ fontWeight:600 }}>{val || "-"}</span>
        <span slot="right" >
          <span class="srm-icon icon-chevron-right" style={{ fontSize:"16px", color: "#333" }}/>
        </span>
      </SrmListHeader>,
    },
  {
    fieldCode: "supplierCategoryName",
    fieldName: $T("sslm.vendorEvaluationPlanDetail.table.column.label.supplierClassification").$D("供应商分类"),
  },
  {
    fieldCode: "strategyName",
    fieldName: $T("sslm.vendorEvaluationPlanDetail.form.label.evalPlanStrategyId").$D("评估策略"),
  },
  {
    fieldCode: "investigationTypeMeaning",
    fieldName: $T("sslm.vendorEvaluationPlanDetail.form.label.investigationType").$D("考察方式"),
  },
  {
    fieldCode: "evalPrincipalName",
    fieldName: $T("sslm.vendorEvaluationPlanDetail.table.column.label.evalPrincipal").$D("评估负责人"),
  },
  {
    fieldCode: "planMonth",
    fieldName: $T("sslm.vendorEvaluationPlanDetail.table.column.label.planMonth").$D("计划评估起始月份"),
    render: (val, item) => dateFormat(item.planDateFrom) || "-",
  },
  {
    fieldCode: "planDateFrom",
    fieldName: $T("sslm.vendorEvaluationPlanDetail.table.column.label.planDateFrom").$D("计划评估日期从"),
    render:(val) => dateFormat(val) || "-",
  },
  {
    fieldCode: "planDateTo",
    fieldName: $T("sslm.vendorEvaluationPlanDetail.table.column.label.planDateTo").$D("计划评估日期至"),
    render:(val) => dateFormat(val) || "-",
  },
  {
    fieldCode: "supplierContacts",
    fieldName: $T("sslm.vendorEvaluationPlanDetail.table.column.label.supplierContacts").$D("供应商联系人"),
  },
  {
    fieldCode: "mobilephoneField",
    fieldName: $T("sslm.vendorEvaluationPlanDetail.table.column.label.supplierTelephone")
      .$D("供应商联系电话"),
    render:(val, item) => {
      const { internationalTelMeaning, telephone } = item;
      return <span>
        {telephone ? `${internationalTelMeaning} | ${telephone}` : "-"}
      </span>;
    }
  },
  {
    fieldCode: "email",
    fieldName: $T("sslm.vendorEvaluationPlanDetail.table.column.label.supplierEmail")
      .$D("供应商联系邮箱"),
  },
  {
    fieldCode: "supplierAddress",
    fieldName: $T("sslm.vendorEvaluationPlanDetail.table.column.label.supplierAddress").$D("供应商注册地址"),
  },
  {
    fieldCode: "evalRemark",
    fieldName: $T("sslm.vendorEvaluationPlanDetail.table.column.label.evalRemark").$D("评估说明"),
  },
  {
    fieldCode: "lineNumber",
    fieldName: $T("sslm.vendorEvaluationPlanDetail.table.column.label.lineNumber").$D("行号"),
  },
  {
    fieldCode: "evalStatusMeaning",
    fieldName: $T("sslm.vendorEvaluationPlanDetail.table.column.label.lineStatus").$D("行状态"),
  },
  {
    fieldCode: "executeStatusMeaning",
    fieldName: $T("sslm.vendorEvaluationPlanDetail.table.column.label.executeStatus").$D("计划执行状态"),
  },
  {
    fieldCode: "progressStatusMeaning",
    fieldName: $T("sslm.vendorEvaluationPlanDetail.table.column.label.assessmentProgress").$D("评估进度"),
  },
  {
    fieldCode: "finalScore",
    fieldName: $T("sslm.vendorEvaluationPlanDetail.table.column.label.evaluationScore").$D("评估得分"),
  },
  {
    fieldCode: "resultsFlagMeaning",
    fieldName: $T("sslm.vendorEvaluationPlanDetail.table.column.label.evaluationResult").$D("评估结果"),
  },
  {
    fieldCode: "grade",
    fieldName: $T("sslm.vendorEvaluationPlanDetail.table.column.label.grade").$D("评估等级"),
  },
  {
    fieldCode: "approveDate",
    fieldName: $T("sslm.vendorEvaluationPlanDetail.table.column.label.assessmentCompletionDate").$D("评估完成时间"),
  },
  {
    fieldCode: "ouName",
    fieldName: $T("sslm.vendorEvaluationPlanDetail.table.column.label.ouName").$D("业务实体"),
    visible: groupFlag !== 1,
  },
  {
    fieldCode: "invOrganizationName",
    fieldName: $T("sslm.vendorEvaluationPlanDetail.table.column.label.invOrganization").$D("库存组织"),
    visible: groupFlag !== 1,
  },
  {
    fieldCode: "inventoryName",
    fieldName: $T("sslm.vendorEvaluationPlanDetail.table.column.label.inventory").$D("库房"),
    visible: groupFlag !== 1,
  },
  {
    fieldCode: "supplierCompanyNum",
    fieldName: $T("sslm.vendorEvaluationPlanDetail.table.column.label.supplierCompanyNum").$D("平台供应商编码"),
  },
  {
    fieldCode: "supplierNum",
    fieldName: $T("sslm.vendorEvaluationPlanDetail.table.column.label.erpSupplierNum").$D("erp供应商编码"),
  },
  {
    fieldCode: "categoryCode",
    fieldName: $T("sslm.vendorEvaluationPlanDetail.table.column.label.categoryCode").$D("品类编码"),
  },
  {
    fieldCode: "categoryName",
    fieldName: $T("sslm.vendorEvaluationPlanDetail.table.column.label.categoryName").$D("品类名称"),
  },
  {
    fieldCode: "itemCode",
    fieldName: $T("sslm.vendorEvaluationPlanDetail.table.column.label.itemCode").$D("物料编码"),
  },
  {
    fieldCode: "itemName",
    fieldName: $T("sslm.vendorEvaluationPlanDetail.table.column.label.itemName").$D("物料名称"),
  },
];

// 附件信息
export const getAttachmentColumns = () => [
  {
    fieldCode: "attachmentUuid",
    fieldType: "EMPTY",
    render: (val, item) => <SrmFlex
      class="attachment-uuid-field"
    >
      <span class="srm-icon icon-other"/>
      <SrmAttachmentButton
        showTotal
        attachments={[
          {
            attachmentUuid: item.attachmentUuid,
            bucketName: "private-bucket",
            readonly:true,
            showInfo: true,
            uploadButton:"none",
          },
        ]}
      />
      <span class="srm-icon icon-chevron-right" />
    </SrmFlex>,
  },
];