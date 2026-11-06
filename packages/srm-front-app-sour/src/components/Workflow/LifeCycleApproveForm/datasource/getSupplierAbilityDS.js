/*
 * @Date: 2023-10-10 14:31:32
 * @Author: LXM <xiaomei.lv@going-link.com>
 * @Version: 0.0.1
 * @Copyright: Copyright (c) 2021, Hand
 */
import { $T, SrmUtil } from "srm-mobile-ui";
const organizationId = SrmUtil.getTenantId();

export const getSupplierAbilityDS = ({ requisitionId }) => ({
  selection: Infinity,
  pageSize: 5,
  autoQuery: true,
  editable: false,
  enableQuery: false,
  fields: [
    {
      fieldCode: "itemCode",
      fieldName: $T("sslm.supplyAbility.model.supplyAbility.itemCode").$D("物料编码"),
    },
    {
      fieldCode: "itemName",
      fieldName: $T("sslm.common.item.itemName").$D("物料名称"),
    },
    {
      fieldCode: "itemCategoryCode",
      fieldName: $T("sslm.common.category.categoryCode").$D("品类编码"),
    },
    {
      fieldCode: "itemCategoryName",
      fieldName: $T("sslm.supplyAbility.model.supplyAbility.categoryName").$D("品类名称"),
    },
    {
      fieldCode: "supplyFlag",
      fieldName: $T("sslm.supplyAbility.model.supplyAbility.supplyFlag").$D("是否可供"),
    },
    {
      fieldCode: "adapterProducts",
      fieldName: $T("sslm.supplyAbility.model.supplyAbility.adapterProducts").$D("适配产品"),
    },
    {
      fieldCode: "countryIdMeaning",
      fieldName: $T("sslm.supplyAbility.model.supplyAbility.countryIdMeaning").$D("服务国家"),
    },
    {
      fieldCode: "regionIdMeaning",
      fieldName: $T("sslm.supplyAbility.model.supplyAbility.regionIdMeaning").$D("服务地区"),
    },
    {
      fieldCode: "cityIdMeaning",
      fieldName: $T("sslm.supplyAbility.model.supplyAbility.cityIdMeaning").$D("服务城市"),
    },
    {
      fieldCode: "dateFrom",
      fieldName: $T("sslm.supplyAbility.model.supplyAbility.dateFrom").$D("有效期从"),
    },
    {
      fieldCode: "dateTo",
      fieldName: $T("sslm.supplyAbility.model.supplyAbility.dateTo").$D("有效期至"),
    },
    {
      fieldCode: "supplyStatus",
      fieldName: $T("sslm.supplyAbility.model.supplyAbility.supplyStatus").$D("可供状态"),
    },
    {
      fieldCode: "psaEvaluationLevel",
      fieldName: $T("sslm.supplyAbility.model.supplyAbility.psaEvaluationLevel").$D("PSA评级"),
    },
    {
      fieldCode: "psaEvaluationScore",
      fieldName: $T("sslm.supplyAbility.model.supplyAbility.psaEvaluationScore").$D("PSA评分"),
    },
    {
      fieldCode: "psaFinishDate",
      fieldName: $T("sslm.supplyAbility.model.supplyAbility.psaFinishDate").$D("PSA完成时间"),
    },
    {
      fieldCode: "spaEvaluationLevel",
      fieldName: $T("sslm.supplyAbility.model.supplyAbility.spaLevel").$D("SPA评级"),
    },
    {
      fieldCode: "spaEvaluationScore",
      fieldName: $T("sslm.supplyAbility.model.supplyAbility.spaScore").$D("SPA评分"),
    },
    {
      fieldCode: "spaFinishDate",
      fieldName: $T("sslm.supplyAbility.model.supplyAbility.spaFinishDate").$D("SPA完成时间"),
    },
    {
      fieldCode: "evaluateRemark",
      fieldName: $T("sslm.common.model.evaluateRemark").$D("评价信息"),
    },
    {
      fieldCode: "inventoryOrganizationMeaning",
      fieldName: $T("sslm.supplyAbility.model.supplyAbility.inventoryOrganization")
        .$D("库存组织"),
    },
    {
      fieldCode: "purchaseOrganizationName",
      fieldName: $T("sslm.supplyAbility.model.supplyAbility.purchasingOrganization")
        .$D("采购组织"),
    },
    {
      fieldCode: "manufacturer",
      fieldName: $T("sslm.supplyAbility.model.supplyAbility.manufacturer").$D("生产厂家"),
    },
    {
      fieldCode: "attachment",
      fieldName: $T("hzero.common.upload.modal.title").$D("附件"),
    },
  ],
  transport: {
    read: {
      url: `sslm/v1/${organizationId}/life-cycle-change-supply-recs/${requisitionId}`,
      method: "GET",
      params:{ customizeUnitCode:"SSLM.LIFE_CYCLE.DOCUMENTS_DETAIL.SUPPLIER_ABILITY" }
    },
  },
})
;
