/*
 * @Date: 2022-11-21 16:17:14
 * @Author: LXM <xiaomei.lv@going-link.com>
 * @Version: 0.0.1
 * @Copyright: Copyright (c) 2021, Hand
 */
import { $T } from "srm-mobile-ui";

export const getCategoryDS = () => ({
  editable: false,
  enableQuery: false,
  fields:[
    {
      fieldCode: "itemCategoryName",
      fieldName: $T("scux.supplierQuery.modal.supplierQuery.categoryName").$D("品类名称"),
    },
    {
      fieldCode: "attributeVarchar2Meaning",
      fieldName: $T("hzero.common.status").$D("状态"),
    },
    {
      fieldCode: "adapterProducts",
      fieldName: $T("scux.supplierQuery.modal.supplierQuery.supportProduct").$D("支持产品"),
    },
    {
      fieldCode: "attributeVarchar3",
      fieldName: $T("scux.supplierQuery.modal.supplierQuery.researchAdvantage").$D("研发能力优势"),
    },
    {
      fieldCode: "attributeVarchar4",
      fieldName: $T("scux.supplierQuery.modal.supplierQuery.qualitySafetySystem").$D("质量安全体系"),
    },
    {
      fieldCode: "attributeVarchar5",
      fieldName: $T("scux.supplierQuery.modal.supplierQuery.spareCapacity").$D("空闲产能"),
    },
    {
      fieldCode: "attributeVarchar6",
      fieldName: $T("scux.supplierQuery.modal.supplierQuery.availableCapacity").$D("星巴克时间阶段可用产能"),
    },
  ],
});