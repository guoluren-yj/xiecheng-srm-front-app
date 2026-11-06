import { SrmUtil, SrmTag, $T } from "srm-mobile-ui";
import { isObject, isEmpty } from "lodash";

import { greenStatus, grayStatus, redStatus, customizeUnitCode } from "../constant";

// 获取Tag组件color
const getTagColor = (status) => {
  const color = greenStatus.includes(status) ?
    "success" : // 绿色
    redStatus.includes(status) ?
      "danger" : // 红色
      grayStatus.includes(status) ?
        "info" : // 灰色
        "warn"; // 橙色
  return color;
};

// 基础信息
const getBasicFields = () => [
  // {
  //   formRow: 0,
  //   fieldType: "EMPTY",
  //   fieldName: $T("sslm.purchaserEvaluationDetail.form.label.evalDescription").$D("评估报告描述"),
  //   fieldCode: "evalDescription",
  //   render: (val) => <SrmListHeader showOpenTag={false}>
  //     <span>{val}</span>
  //     <span slot="right" class="srm-icon icon-chevron-right" style={{ fontSize:"16px", color:"var(--color-font-default)" }}/>
  //   </SrmListHeader>,
  // },
  {
    fieldCode: "evalNum",
    fieldName: $T("sslm.purchaserEvaluationDetail.form.label.evalNum").$D("评估报告编号"),
  },
  {
    fieldCode: "reportStatus",
    fieldName: $T("sslm.purchaserEvaluationDetail.form.label.reportStatus").$D("报告状态"),
    render: (val, record) => <SrmTag size="small" type={getTagColor(val)}>{record.reportStatusMeaning}</SrmTag>,
  },
  {
    fieldCode: "sourceTypeMeaning",
    fieldName: $T("sslm.purchaserEvaluationDetail.form.label.creationType").$D("创建方式"),
  },
  {
    fieldCode: "creationDate",
    fieldName: $T("sslm.purchaserEvaluationDetail.form.label.creationDate").$D("创建时间"),
  },
  {
    fieldCode: "realName",
    fieldName: $T("sslm.purchaserEvaluationDetail.form.label.realName").$D("创建人"),
  },
  {
    fieldCode: "strategyName",
    fieldName: $T("sslm.purchaserEvaluationDetail.form.label.strategyName").$D("评估策略"),
  },
  {
    fieldCode: "evalDateFrom",
    fieldName: $T("sslm.purchaserEvaluationDetail.form.label.evalDateFrom").$D("评估日期从"),
    render: (val) => val ? SrmUtil.dateFormat(val) : "-",
  },
  {
    fieldCode: "evalDateTo",
    fieldName: $T("sslm.purchaserEvaluationDetail.form.label.evalDateTo").$D("评估日期至"),
    render: (val) => val ? SrmUtil.dateFormat(val) : "-",
  },
  {
    fieldCode: "attributeVarchar19",
    fieldName: $T("scux.purchaserEvaluationDetail.form.label.guyu.responsibleProductType").$D("供应商负责产品类型"),
    // fieldType: 'SELECT', lovCode: 'GY-CPLX', editor: false,
    render: (_, item) => item.attributeVarchar19Meaning || "-",
  },
  {
    fieldCode: "attributeVarchar1",
    fieldName: $T("scux.purchaserEvaluationDetail.form.label.guyu.supplierType").$D("供应商类型"),
    // fieldType: 'SELECT', lovCode: 'GY-YSLX', editor: false,
    render: (_, item) => item.attributeVarchar1Meaning || "-",
  },
  {
    fieldCode: "attributeVarchar2",
    fieldName: $T("scux.purchaserEvaluationDetail.form.label.guyu.isNewMaterial").$D("是否为引入新原料"),
    // fieldType: 'SELECT', lovCode: 'GY-SF', editor: false,
    visible: (_, record) =>
    // attributeVarchar1=原料且assessType=准入审厂字段assessType值集：SSLM_EVAL_PLAN_TYPE
      record.attributeVarchar1 === "YL" && record.assessType === "PERMIT_EVAL",
    render: (_, item) => item.attributeVarchar2Meaning || "-",
  },
  {
    fieldCode: "attributeVarchar3",
    fieldName: $T("scux.purchaserEvaluationDetail.form.label.guyu.reserveReason").$D("储备原因&预计合作内容"),
    visible: (_, record) =>
    // assessType=准入审厂字段assessType值集：SSLM_EVAL_PLAN_TYPE
      record.assessType === "PERMIT_EVAL"
    ,
  },
  {
    fieldCode: "attributeVarchar20",
    fieldName: $T("scux.purchaserEvaluationDetail.form.label.guyu.isSupplier").$D("是否为服务商"),
    // fieldType: 'SELECT', lovCode: 'GY-SF', editor: false,
    visible: (_, record) =>
    /**
         * 条件1：assessType=准入审厂
         * 条件2：attributeVarchar1=原料||包材||服务
         * 执行逻辑：条件1且条件2
         */
      record.assessType === "PERMIT_EVAL" && [ "YL", "BZ", "FW" ].includes(record.attributeVarchar1),
    render: (_, item) => item.attributeVarchar20Meaning || "-",
  },
  {
    fieldCode: "attributeDecimal1",
    fieldName: $T("scux.purchaserEvaluationDetail.form.label.guyu.expectedPurchaseAmount").$D("预计可能的年采购金额（元）"),
    visible: (_, record) =>
    // assessType=准入审厂字段assessType值集：SSLM_EVAL_PLAN_TYPE
      record.assessType === "PERMIT_EVAL"
    ,
  },
  {
    fieldCode: "attributeVarchar7",
    fieldName: $T("scux.purchaserEvaluationDetail.form.label.guyu.isSubcontract").$D("是否代采合作"),
    // fieldType: 'SELECT', lovCode: 'GY-SF', editor: false,
    render: (_, item) => item.attributeVarchar7Meaning || "-",
  },
  {
    fieldCode: "attributeVarchar10",
    fieldName: $T("scux.purchaserEvaluationDetail.form.label.guyu.evalType").$D("评审类型"),
    // fieldType: 'SELECT', lovCode: 'GY-PSLX', editor: false,
    visible: (_, record) =>
    // assessType=有因审厂字段assessType值集：SSLM_EVAL_PLAN_TYPE
      record.assessType === "UPDATED_EVAL",
    render: (_, item) => item.attributeVarchar10Meaning || "-",
  },
  {
    fieldCode: "attributeVarchar11",
    fieldName: $T("scux.purchaserEvaluationDetail.form.label.guyu.evalFocus").$D("评审侧重点/评审原因说明"),
    visible: (_, record) =>
    // assessType=有因审厂字段assessType值集：SSLM_EVAL_PLAN_TYPE
      record.assessType === "UPDATED_EVAL"
  },
  {
    fieldCode: "attributeVarchar12",
    fieldName: $T("scux.purchaserEvaluationDetail.form.label.guyu.newMaterialApplication").$D("关联新原料入库申请"),
    fieldType: "UPLOAD",
    bucketName: SrmUtil.getDefaultBucketName(),
    bucketDirectory: "sslm-evaluation",
    visible: (_, record) =>
    // attributeVarchar2（是否为引入新原料）=是
      record.attributeVarchar2 === "Y"
  },
];

// 供应商信息
const getSupplierFields = () => [
  {
    fieldCode: "supplierName",
    fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.supplierName").$D("供应商"),
  },
  {
    fieldCode: "supplierType",
    fieldName: $T("sslm.purchaserEvaluationDetail.form.label.supplierType").$D("供应商类型"),
    render: (_, item) => item.supplierTypeMeaning || "-",
  },
  {
    fieldCode: "supplierContactor",
    fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.supplierContacts").$D("供应商联系人"),
  },
  {
    fieldCode: "supplierContactPhone",
    fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.supplierTelephone").$D("供应商联系电话"),
    render: (val, item) => {
      const { internationalTelCode } = item;
      if (internationalTelCode && val) {
        return `${internationalTelCode} ${val}`;
      }
      return val || "-";
    },
  },
  // {
  //   fieldCode: "attributeVarchar8",
  //   fieldName: $T("scux.purchaserEvaluationDetail.form.label.guyu.investigationTable").$D("关联调查表"),
  //   render: (_, item) => item.attributeVarchar9 || "-",
  // },
  // {
  //   fieldCode: "attributeVarchar9",
  //   fieldName: $T("scux.purchaserEvaluationDetail.form.label.guyu.investigationTableNum").$D("关联调查表单号"),
  // },
];

// 公司信息
const getCompanyFields = () => [
  {
    fieldCode: "companyName",
    fieldName: $T("sslm.purchaserEvaluationDetail.form.label.companyName").$D("公司"),
  },
];

// 评估结果
const getEvaluationFields = ({ pageType }) => {
  /**
   * pageType 评估结果页面类型
   * readOnly-只读
   * teamLeaderEditor-仅组长可编辑
   * groupMembersEditor-仅组员可编辑，组长不可编辑
   * designateApprover-指定审批人
   */
  const { loginName } = SrmUtil.getUserInfo();
  return [
    pageType === "teamLeaderEditor" && [ "GY1228", "GY4671" ].includes(loginName) ? {
      fieldCode: "attributeVarchar13",
      fieldName: $T("scux.purchaserEvaluationDetail.form.label.guyu.evalPersonGroupLeader").$D("审厂人员-组长"),
      fieldType: "LOV",
      lovCode: "SSLM.EMPLOYEE",
      editor: true, // 组长且指定子账户为GY1228, GY4671可编辑
      required: true,
    } : {
      fieldCode: "attributeVarchar13",
      fieldName: $T("scux.purchaserEvaluationDetail.form.label.guyu.evalPersonGroupLeader").$D("审厂人员-组长"),
      render: (_, item) => item.attributeVarchar13Meaning || "-",
    },
    pageType === "teamLeaderEditor" ? {
      fieldCode: "attributeVarchar14",
      fieldName: $T("scux.purchaserEvaluationDetail.form.label.guyu.evalPersonGroupMembers").$D("审厂人员-组员"),
      fieldType: "LOV",
      lovCode: "SSLM.EMPLOYEE",
      editor: true,
      required: [ "GY1228", "GY4671" ].includes(loginName),
      options: {
        multiple: true,
      },
    } : {
      fieldCode: "attributeVarchar14",
      fieldName: $T("scux.purchaserEvaluationDetail.form.label.guyu.evalPersonGroupMembers").$D("审厂人员-组员"),
      render: (_, item) => {
        if (isObject(item.attributeVarchar14Meaning) && !isEmpty(item.attributeVarchar14Meaning)) {
          const itemValuesArr = Object.values(item.attributeVarchar14Meaning);
          return itemValuesArr.length > 0 ? itemValuesArr.join("、") : "-";
        }
        return item.attributeVarchar14Meaning || "-";
      },
    },
    pageType === "teamLeaderEditor" && [ "GY1228", "GY4671" ].includes(loginName) ? {
      fieldCode: "attributeVarchar22",
      fieldName: $T("scux.purchaserEvaluationDetail.form.label.guyu.attributeVarchar22").$D("审厂方式"),
      fieldType: "SELECT",
      lovCode: "GY-SHFS",
      required: true,
      editor: true,
    } : {
      fieldCode: "attributeVarchar22",
      fieldName: $T("scux.purchaserEvaluationDetail.form.label.guyu.attributeVarchar22").$D("审厂方式"),
      render: (_, item) => item.attributeVarchar22Meaning || "-",
    },
    pageType === "groupMembersEditor" ? {
      fieldCode: "attributeLongtext1",
      fieldName: $T("scux.purchaserEvaluationDetail.form.label.guyu.firstEvaluationResult").$D("第一次评估结果"),
      fieldType: "SELECT",
      lovCode: "SSLM.INVESTIGATION.RESULTS",
      editor: true,
      required: true,
    } : {
      fieldCode: "attributeLongtext1",
      fieldName: $T("scux.purchaserEvaluationDetail.form.label.guyu.firstEvaluationResult").$D("第一次评估结果"),
      render: (_, item) => item.attributeLongtext1Meaning || "-",
    },
    {
      fieldCode: "attributeLongtext3",
      fieldName: $T("scux.purchaserEvaluationDetail.form.label.guyu.firstEvaluationAttachment").$D("第一次评估附件"),
      fieldType: "UPLOAD",
      bucketName: SrmUtil.getDefaultBucketName(),
      bucketDirectory: "sslm-evaluation",
      disabled: pageType !== "groupMembersEditor",
      required: pageType === "groupMembersEditor",
    },
    {
      fieldCode: "attributeLongtext2",
      fieldName: $T("scux.purchaserEvaluationDetail.form.label.guyu.firstEvaluationSummary").$D("第一次综合意见"),
      fieldType: "INPUT",
      editor: pageType === "groupMembersEditor",
      required: pageType === "groupMembersEditor",
    },
    pageType === "groupMembersEditor" ? {
      fieldCode: "attributeVarchar5",
      fieldName: $T("scux.purchaserEvaluationDetail.form.label.guyu.firstEvaluationValidity").$D("第一次审厂结果有效期"),
      fieldType: "INPUT",
      editor: true,
      required: true,
    } : {
      fieldCode: "attributeVarchar5",
      fieldName: $T("scux.purchaserEvaluationDetail.form.label.guyu.firstEvaluationValidity").$D("第一次审厂结果有效期"),
    },
    pageType === "groupMembersEditor" ? {
      fieldCode: "attributeVarchar6",
      fieldName: $T("scux.purchaserEvaluationDetail.form.label.guyu.firstEvaluationSupplierRatingHZP").$D("第一次评估报告中供应商评级（化妆品）"),
      fieldType: "SELECT",
      lovCode: "GY-PGBGDJ",
      editor: true,
      required: (_, item) => item.attributeVarchar19 === "HZP", // 化妆品时必输
    } : {
      fieldCode: "attributeVarchar6",
      fieldName: $T("scux.purchaserEvaluationDetail.form.label.guyu.firstEvaluationSupplierRatingHZP").$D("第一次评估报告中供应商评级（化妆品）"),
      render: (_, item) => item.attributeVarchar6Meaning || "-",
    },
    pageType === "groupMembersEditor" ? {
      fieldCode: "attributeVarchar23",
      fieldName: $T("scux.purchaserEvaluationDetail.form.label.guyu.firstEvaluationSupplierRatingSP").$D("第一次评估报告中供应商评级（食品）"),
      fieldType: "SELECT",
      lovCode: "GY-HZPPJ",
      editor: true,
      required: (_, item) => item.attributeVarchar19 === "SP", // 食品时必输
    } : {
      fieldCode: "attributeVarchar23",
      fieldName: $T("scux.purchaserEvaluationDetail.form.label.guyu.firstEvaluationSupplierRatingSP").$D("第一次评估报告中供应商评级（食品）"),
      render: (_, item) => item.attributeVarchar23Meaning || "-",
    },
    pageType === "designateApprover" ? {
      fieldCode: "attributeVarchar17",
      fieldName: $T("scux.purchaserEvaluationDetail.form.label.guyu.isNeedReevaluate").$D("发起人判断是否需要复审"),
      fieldType: "SELECT",
      lovCode: "GY-SF",
      editor: true,
      required: true,
    } : {
      fieldCode: "attributeVarchar17",
      fieldName: $T("scux.purchaserEvaluationDetail.form.label.guyu.isNeedReevaluate").$D("发起人判断是否需要复审"),
      render: (_, item) => item.attributeVarchar17Meaning || "-",
    },
    pageType === "groupMembersEditor" ? {
      fieldCode: "attributeLongtext4",
      fieldName: $T("scux.purchaserEvaluationDetail.form.label.guyu.secondEvaluationResult").$D("第二次评估结果"),
      fieldType: "SELECT",
      lovCode: "SSLM.INVESTIGATION.RESULTS",
      editor: true,
    } : {
      fieldCode: "attributeLongtext4",
      fieldName: $T("scux.purchaserEvaluationDetail.form.label.guyu.secondEvaluationResult").$D("第二次评估结果"),
      render: (_, item) => item.attributeLongtext4Meaning || "-",
    },
    {
      fieldCode: "attributeLongtext5",
      fieldName: $T("scux.purchaserEvaluationDetail.form.label.guyu.secondEvaluationAttachment").$D("第二次评估附件"),
      fieldType: "UPLOAD",
      bucketName: SrmUtil.getDefaultBucketName(),
      bucketDirectory: "sslm-evaluation",
      disabled: pageType !== "groupMembersEditor",
    },
    {
      fieldCode: "attributeLongtext6",
      fieldName: $T("scux.purchaserEvaluationDetail.form.label.guyu.secondEvaluationSummary").$D("第二次评估综合意见"),
      fieldType: "INPUT",
      editor: pageType === "groupMembersEditor",
    },
    pageType === "groupMembersEditor" ? {
      fieldCode: "attributeVarchar15",
      fieldName: $T("scux.purchaserEvaluationDetail.form.label.guyu.secondEvaluationValidity").$D("第二次审厂结果有效期"),
      fieldType: "INPUT",
      editor: true,
    } : {
      fieldCode: "attributeVarchar15",
      fieldName: $T("scux.purchaserEvaluationDetail.form.label.guyu.secondEvaluationValidity").$D("第二次审厂结果有效期"),
    },
    pageType === "groupMembersEditor" ? {
      fieldCode: "attributeVarchar16",
      fieldName: $T("scux.purchaserEvaluationDetail.form.label.guyu.secondEvaluationSupplierRatingHZP").$D("第二次评估报告中供应商评级（化妆品）"),
      fieldType: "SELECT",
      lovCode: "GY-PGBGDJ",
      editor: true,
    } : {
      fieldCode: "attributeVarchar16",
      fieldName: $T("scux.purchaserEvaluationDetail.form.label.guyu.secondEvaluationSupplierRatingHZP").$D("第二次评估报告中供应商评级（化妆品）"),
      render: (_, item) => item.attributeVarchar16Meaning || "-",
    },
    pageType === "groupMembersEditor" ? {
      fieldCode: "attributeVarchar24",
      fieldName: $T("scux.purchaserEvaluationDetail.form.label.guyu.secondEvaluationSupplierRatingSP").$D("第二次评估报告中供应商评级（食品）"),
      fieldType: "SELECT",
      lovCode: "GY-HZPPJ",
      editor: true,
    } : {
      fieldCode: "attributeVarchar24",
      fieldName: $T("scux.purchaserEvaluationDetail.form.label.guyu.secondEvaluationSupplierRatingSP").$D("第二次评估报告中供应商评级（食品）"),
      render: (_, item) => item.attributeVarchar24Meaning || "-",
    },
  ];
};

// 基础信息\评估结果
const formDS = ({ evalHeaderId, pageType }) => ({
  autoQuery: false,
  editable: false,
  enableQuery: false,
  paging: false,
  forceValidate: true,
  queryParameter: {
    customizeUnitCode: customizeUnitCode.join(","),
  },
  transport: {
    read: {
      url: `/sslm/v1/${SrmUtil.getTenantId()}/site-eval-headers/eval-report/${evalHeaderId}`,
      method: "GET",
    },
  },
  fields: [
    ...getBasicFields(),
    ...getSupplierFields(),
    ...getCompanyFields(),
    ...getEvaluationFields({ pageType }),
  ],
});

// 整改不符合项
const rectifyDS = ({ evalHeaderId, pageType }) => ({
  autoQuery: false,
  editFlag: pageType === "groupMembersEditor",
  paging: true,
  pageSize: 5,
  hasMore: true,
  enableQuery: false,
  editable: pageType === "groupMembersEditor",
  queryParameter: {
    customizeUnitCode: "SSLM.PURCHASER_ASSESS_DETAIL.QUALITY_RECTIFICATION", // 不可动位置，存在后面覆盖前面的情况
  },
  bodyParameter: {
    orderSource: "reportEval",
  },
  transport: {
    read: {
      url: `/sslm/v1/${SrmUtil.getTenantId()}/site_eval_external_orders/eval-report/${evalHeaderId}`,
      method: "POST",
    },
    destroy: {
      url: `/sslm/v1/${SrmUtil.getTenantId()}/site_eval_external_orders/${evalHeaderId}/batch-delete`,
      method: "DELETE",
    }
  },
  fields: [
    {
      fieldCode: "opteration",
      fieldName: $T("scux.purchaserEvaluationDetail.form.label.guyu.operation").$D("操作"),
    },
    {
      fieldCode: "problemNum",
      fieldName: $T("scux.purchaserEvaluationDetail.form.label.guyu.problemNum").$D("整改报告编号"),
    },
    {
      fieldCode: "attributeLongtext1",
      fieldType: "INPUT",
      fieldName: $T("scux.purchaserEvaluationDetail.form.label.guyu.rectifyNewContent").$D("整改内容-新"),
      editor: pageType === "groupMembersEditor",
    },
    {
      fieldCode: "attributeLongtext2",
      fieldName: $T("scux.purchaserEvaluationDetail.form.label.guyu.rectifyOldContent").$D("整改不符合项附件"),
      fieldType: "UPLOAD",
      bucketName: SrmUtil.getDefaultBucketName(),
      disabled: pageType !== "groupMembersEditor",
    },
  ],
});

export {
  formDS,
  rectifyDS,
};