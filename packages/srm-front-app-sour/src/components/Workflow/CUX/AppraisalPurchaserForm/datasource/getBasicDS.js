/*
 * @Date: 2024-08-12 16:04:41
 * @Author: LXM <xiaomei.lv@going-link.com>
 * @Version: 0.0.1
 * @Copyright: Copyright (c) 2021, Hand
 */
import { isEmpty } from "lodash";
import { $T, SrmUtil } from "srm-mobile-ui";

import { SRM_SSLM } from "@/utils/utils";
import { renderStatus } from "@/components/utils/render";

const organizationId = SrmUtil.getTenantId();

export const getBasicDs = ({ evalHeaderId } = {}) => ({
  paging: false,
  autoQuery: true,
  editable: false,
  queryParameter:{
    customizeUnitCode: "SSLM.APPRAISAL_PURCHASER_DETAIL.BASIC"
  },
  fields: [
    {
      fieldCode: "evalName",
      fieldName: $T("sslm.supplierDocManage.model.evalDocManage.docDescription").$D("档案描述"),
    },
    {
      fieldCode: "evalNum",
      fieldName: $T("sslm.supplierDocManage.model.evaluationDocManage.docCode").$D("档案编码"),
    },
    {
      fieldCode: "evalTplName",
      fieldName: $T("sslm.supplierDocManage.model.evalDocManage.evalModel").$D("考评模板"),
    },
    {
      fieldCode: "createdUserName",
      fieldName: $T("sslm.supplierDocManage.model.evaluationDocManage.createdUserName")
        .$D("创建人"),
    },
    {
      fieldCode: "evalDimensionMeaning",
      fieldName: $T("sslm.supplierDocManage.model.evalDocManage.evalLevel").$D("考评维度"),
    },
    {
      fieldCode: "evalDimensionValueMeaning",
      fieldName: $T("sslm.supplierDocManage.model.evalDocManage.levelValue").$D("维度值"),
    },
    {
      fieldCode: "evalCycleMeaning",
      fieldName: $T("sslm.supplierDocManage.model.evaluationDocManage.evalCycle").$D("考评周期"),
    },
    {
      fieldCode: "kpiMethodMeaning",
      fieldName: $T("sslm.supplierDocManage.model.evaluationDocManage.kpiMethod").$D("考评方式"),
    },
    {
      fieldCode: "creationDate",
      fieldName: $T("sslm.supplierDocManage.model.evalDocManage.createTime").$D("建档时间"),
    },
    {
      fieldCode: "evalDateFrom",
      fieldName:$T("sslm.supplierDocManage.model.evalDocManage.evalDateFrom").$D("考评日期从")
    },
    {
      fieldCode: "evalDateTo",
      fieldName:$T("sslm.supplierDocManage.model.evalDocManage.evalDateTo").$D("考评日期至")
    },
    {
      fieldCode: "evalRuleRemark",
      fieldName: $T("sslm.supplierDocManage.model.evalDocManage.ruleDesc").$D("考评规则说明"),
    },
    {
      fieldCode: "remark",
      fieldName: $T("sslm.supplierDocManage.model.evaluationDocManage.description").$D("考评说明"),
    },
    {
      fieldCode: "evalResultRemark",
      fieldName: $T("sslm.supplierDocManage.model.evalDocManage.evalResultRemark")
        .$D("考评结果说明"),
    },
    {
      fieldCode: "evalAttUuid",
      fieldName: $T("sslm.supplierDocManage.model.evalDocManage.evalAttUuid").$D("考评结果附件"),
    },
    // 参评供应商范围
    {
      fieldCode: "trxLineFlagsMeaning",
      fieldName: $T("sslm.common.model.field.evaluateScope").$D("参评供应商范围"),
    },
    {
      fieldCode: "inventoryTimes",
      fieldName: $T("sslm.supplierDocManage.model.evalDocManage.inventoryTimes").$D("接收入库次数（≥）"),
    },
    {
      fieldCode: "cooperationDays",
      fieldName: $T("sslm.supplierDocManage.model.evalDocManage.cooperationDay").$D("合作天数"),
    },
    {
      fieldCode: "categoryIds",
      fieldName: $T("sslm.common.view.supplier.class").$D("供应商分类"),
    },
    {
      fieldCode: "itemCategoryIds",
      fieldName: $T("sslm.supplierDocManage.model.evalDocManage.supplierProduct").$D("供货品类"),
    },
    {
      fieldCode: "stageIds",
      fieldName: $T("sslm.common.model.stageDescription").$D("生命周期阶段"),
    },
    {
      fieldCode: "deliveryTimes",
      fieldName: $T("sslm.supplierDocManage.model.evalDocManage.deliveryTimes").$D("送货单次数（≥）"),
    },
    {
      fieldCode: "purchaseAgentIds",
      fieldName: $T("sslm.common.model.buyer").$D("采购员"),
    },
    // 评分人
    {
      fieldCode: "evalRespRuleMeaning",
      fieldName: $T("sslm.common.model.scorer.addRaterRule").$D("添加评分人规则"),
    },
  ],
  transport: {
    read: {
      url: `${SRM_SSLM}/v1/${organizationId}/eval-headers/detail/${evalHeaderId}`,
      method: "GET",
    },
  },
});

// 基础信息Columns
export const basicColumns = () => [
  {
    fieldCode: "evalName",
    fieldType:"EMPTY",
    formRow: 10,
    render: (val) => <SrmListHeader showOpenTag={false} >
      <span>{val}</span>
    </SrmListHeader>
  },
  {
    fieldCode: "evalNum",
    fieldName: $T("sslm.supplierDocManage.model.evaluationDocManage.docCode").$D("档案编码"),
    formRow: 20,
  },
  {
    fieldCode: "evalTplName",
    fieldName: $T("sslm.supplierDocManage.model.evalDocManage.evalModel").$D("考评模板"),
    formRow: 30,
    formCol:1,
  },
  {
    fieldCode: "createdUserName",
    fieldName: $T("sslm.supplierDocManage.model.evaluationDocManage.createdUserName")
      .$D("创建人"),
    formRow: 30,
    formCol:2,
  },
  {
    fieldCode: "evalDimensionMeaning",
    fieldName: $T("sslm.supplierDocManage.model.evalDocManage.evalLevel").$D("考评维度"),
    formRow: 40,
    formCol:1,
  },
  {
    fieldCode: "evalDimensionValueMeaning",
    fieldName: $T("sslm.supplierDocManage.model.evalDocManage.levelValue").$D("维度值"),
    formRow: 40,
    formCol:2,
  },
  {
    fieldCode: "evalCycleMeaning",
    fieldName: $T("sslm.supplierDocManage.model.evaluationDocManage.evalCycle").$D("考评周期"),
    formRow: 50,
    formCol:1,
  },
  {
    fieldCode: "kpiMethodMeaning",
    fieldName: $T("sslm.supplierDocManage.model.evaluationDocManage.kpiMethod").$D("考评方式"),
    formRow: 50,
    formCol:2,
  },
  {
    fieldCode: "creationDate",
    fieldName: $T("sslm.supplierDocManage.model.evalDocManage.createTime").$D("建档时间"),
    formRow: 60,
  },
  {
    fieldCode: "evalDateFrom",
    fieldName: $T("sslm.common.model.evaluation.evalDate").$D("考评日期"),
    formRow: 70,
    formCol:1,
    render:(val, data) => {
      const { evalDateFrom, evalDateTo } = data;
      const newEvalDateFrom = SrmUtil.dateFormat(evalDateFrom, "yyyy-MM-dd");
      const newEvalDateTo = SrmUtil.dateFormat(evalDateTo, "yyyy-MM-dd");
      return !newEvalDateFrom && !newEvalDateTo ? "-" : `${newEvalDateFrom || "-"} ~ ${newEvalDateTo || "-"}`;
    }
  },
  {
    fieldCode: "evalRuleRemark",
    fieldName: $T("sslm.supplierDocManage.model.evalDocManage.ruleDesc").$D("考评规则说明"),
    formRow: 80,
  },
  {
    fieldCode: "remark",
    fieldName: $T("sslm.supplierDocManage.model.evaluationDocManage.description").$D("考评说明"),
    formRow: 90,
  },
  {
    fieldCode: "evalResultRemark",
    fieldName: $T("sslm.supplierDocManage.model.evalDocManage.evalResultRemark")
      .$D("考评结果说明"),
    formRow: 100,
  },
];

// 评分Columns
export const scoreBasicColumns = [
  {
    fieldCode: "evalName",
    fieldType:"EMPTY",
    formRow: 10,
    render: (val, data) => <SrmListHeader showOpenTag={false} >
      <span>{val}</span>
      <span slot="right">{renderStatus(data.evalStatus, data.evalStatusMeaning)}</span>
    </SrmListHeader>
  },
  {
    fieldCode: "evalNum",
    formRow: 20,
  },
  {
    fieldCode: "evalTplName",
    formRow: 30,
    formCol:1,
  },
  {
    fieldCode: "evalDimensionMeaning",
    formRow: 30,
    formCol:2,
  },
  {
    fieldCode: "evalDimensionValueMeaning",
    formRow: 40,
  },
  {
    fieldCode: "evalCycleMeaning",
    formRow: 50,
    formCol:1,
  },
  {
    fieldCode: "createdUserName",
    formRow: 50,
    formCol:2,
  },
];

// 附件
export const attachmentColumns = [
  {
    fieldCode: "evalAttUuid",
    fieldType: "EMPTY",
    render: (val) => <SrmFlex
      class="attachment-uuid-field"
    >
      <span class="srm-icon icon-other"/>
      <SrmAttachmentButton
        showTotal
        attachments={[
          {
            attachmentUuid: val,
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

// 参评供应商表单
export const participSupplierFormColumns = () => [
  {
    fieldCode: "trxLineFlagsMeaning",
    fieldName: $T("sslm.common.model.field.evaluateScope").$D("参评供应商范围"),
    formRow: 10,
  },
  {
    fieldCode: "inventoryTimes",
    fieldName: $T("sslm.supplierDocManage.model.evalDocManage.inventoryTimes").$D("接收入库次数（≥）"),
    formRow: 20,
    formCol:1,
    visible:(val, data) => data.trxLineFlags?.split(",")?.includes("1"),
  },
  {
    fieldCode: "cooperationDays",
    fieldName: $T("sslm.supplierDocManage.model.evalDocManage.cooperationDay").$D("合作天数"),
    formRow: 20,
    formCol:2,
    visible:(val, data) => data.trxLineFlags?.split(",")?.includes("2"),
  },
  {
    fieldCode: "categoryIds",
    fieldName: $T("sslm.common.view.supplier.class").$D("供应商分类"),
    formRow: 30,
    visible:(val, data) => data.trxLineFlags?.split(",")?.includes("3"),
    render:(val, data) => {
      const { categoryDescriptionMap } = data;
      if (!isEmpty(categoryDescriptionMap)) {
        return categoryDescriptionMap.map((n) => n.categoryDescription).join("、");
      }
      return "-";
    }
  },
  {
    fieldCode: "itemCategoryIds",
    fieldName: $T("sslm.supplierDocManage.model.evalDocManage.supplierProduct").$D("供货品类"),
    formRow: 40,
    visible:(val, data) => data.trxLineFlags?.split(",")?.includes("4"),
    render:(val, data) => {
      const { itemCategoryNameMap } = data;
      if (!isEmpty(itemCategoryNameMap)) {
        return itemCategoryNameMap.map((n) => n.categoryName).join("、");
      }
      return "-";
    }
  },
  {
    fieldCode: "stageIds",
    fieldName: $T("sslm.common.model.stageDescription").$D("生命周期阶段"),
    formRow: 50,
    render:(val, data) => data.stageDescriptions,
    visible:(val, data) => data.trxLineFlags?.split(",")?.includes("5"),
  },
  {
    fieldCode: "deliveryTimes",
    fieldName: $T("sslm.supplierDocManage.model.evalDocManage.deliveryTimes").$D("送货单次数（≥）"),
    formRow: 60,
    visible:(val, data) => data.trxLineFlags?.split(",")?.includes("6"),
  },
  {
    fieldCode: "purchaseAgentIds",
    fieldName: $T("sslm.common.model.buyer").$D("采购员"),
    formRow: 70,
    visible:(val, data) => data.trxLineFlags?.split(",")?.includes("7"),
    render:(val, data) => {
      const { purchaseAgentNames } = data;
      if (!isEmpty(purchaseAgentNames)) {
        return purchaseAgentNames.map((n) => n.purchaseAgentName).join("、");
      }
      return "-";
    }
  },
];

// 评分人表单
export const personFormColumns = () => [
  {
    fieldCode:"evalRespRuleMeaning",
    fieldName: $T("sslm.common.model.scorer.addRaterRule").$D("添加评分人规则"),
  }
];
