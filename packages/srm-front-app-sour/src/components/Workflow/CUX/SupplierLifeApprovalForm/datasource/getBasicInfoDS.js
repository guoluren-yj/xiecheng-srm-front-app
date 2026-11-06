/*
 * @Date: 2022-11-21 10:58:59
 * @Author: LXM <xiaomei.lv@going-link.com>
 * @Version: 0.0.1
 * @Copyright: Copyright (c) 2021, Hand
 */
import { $T, SrmUtil } from "srm-mobile-ui";

const organizationId = SrmUtil.getTenantId();

export const getBasicInfoDS = ({ requisitionId }) => ({
  editable: false,
  fields:[
    {
      fieldCode: "attributeVarchar23Meaning",
      fieldName: $T("scux.supplierQuery.modal.headerInfo.applicationType").$D("申请类型"),
    },
    {
      fieldCode: "qualifiedNumber",
      fieldName: $T("scux.supplierQuery.modal.headerInfo.reqNum").$D("申请单编号"),
    },
    {
      fieldCode: "supplierCompanyName",
      fieldName: $T("scux.starbucks.modal.headerInfo.supplierName").$D("供应商名称"),
    },
    {
      fieldCode: "attributeVarchar8Meaning",
      fieldName: $T("scux.supplierQuery.modal.headerInfo.businessType").$D("供应商业务类型"),
    },
    {
      fieldCode: "attributeBigint7Meaning",
      fieldName: $T("scux.supplierQuery.modal.headerInfo.contractSupplier").$D("合同供应商"),
    },
    {
      fieldCode: "attributeVarchar3Meaning",
      fieldName: $T("scux.supplierQuery.modal.headerInfo.purpose").$D("开发目的"),
    },
    {
      fieldCode: "attributeVarchar13Meaning",
      fieldName: $T("scux.supplierQuery.modal.headerInfo.scope").$D("范围"),
    },
    {
      fieldCode: "attributeVarchar12",
      fieldName: $T("scux.supplierQuery.modal.headerInfo.projectName").$D("项目名称"),
    },
    {
      fieldCode: "attributeVarchar16Meaning",
      fieldName: $T("scux.supplierQuery.modal.headerInfo.supplierNature").$D("供应商性质"),
    },
    {
      fieldCode: "attributeVarchar17Meaning",
      fieldName: $T("scux.supplierQuery.modal.headerInfo.storageConditions").$D("储运条件"),
    },
    {
      fieldCode: "attributeVarchar4Meaning",
      fieldName: $T("scux.supplierQuery.modal.headerInfo.isPass").$D("是否已通过项目会"),
    },
    {
      fieldCode: "attributeDate1",
      fieldName: $T("scux.supplierQuery.modal.headerInfo.expectedEntryDate").$D("预期准入日期"),
    },
    {
      fieldCode: "attributeVarchar14",
      fieldName: $T("scux.supplierQuery.modal.headerInfo.productionLine").$D("产线"),
    },
    {
      fieldCode: "remark",
      fieldName: $T("scux.supplierQuery.modal.headerInfo.detailedPurpose").$D("新供应商理由详述"),
    },
    {
      fieldCode: "attributeTinyint1",
      fieldName: $T("scux.supplierQuery.modal.headerInfo.globalAPApproved").$D("Global/AP Approved"),
    },
    {
      fieldCode: "attributeVarchar15",
      fieldName: $T("scux.supplierQuery.modal.headerInfo.remark").$D("备注"),
    },
  ],
  transport:{
    read:{
      url: `/sslm/v1/${organizationId}/life-cycle/qualified/${requisitionId}`,
      method: "GET"
    },
  },
});