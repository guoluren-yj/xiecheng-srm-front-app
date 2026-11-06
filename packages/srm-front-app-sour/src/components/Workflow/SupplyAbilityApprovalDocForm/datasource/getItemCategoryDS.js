/*
 * @Date: 2024-08-28 14:31:32
 * @Author: CDJ
 * @Version: 0.0.1
 * @Copyright: Copyright (c) 2021, Hand
 */
import { $T, SrmUtil } from "srm-mobile-ui";
const organizationId = SrmUtil.getTenantId();

export const getItemCategoryDS = ({ abilityReqId }) => ({
  selection: Infinity,
  pageSize: 5,
  autoQuery: true,
  editable: false,
  enableQuery: false,
  fields: [
    {
      fieldCode: "operationTypeMeaning",
      fieldName: $T("sslm.common.view.common.operateType").$D("操作类型"),
    },
    {
      fieldCode: "itemCode",
      fieldName: $T("sslm.supplyAbility.model.supplyAbility.itemCode").$D("物料编码"),
    },
    {
      fieldCode: "itemName",
      fieldName: $T("sslm.common.item.itemName").$D("物料名称"),
    },
    {
      fieldCode: "supItemDesc",
      fieldName: $T("sslm.supplyAbilityDoc.model.supplyAbility.supItemDesc").$D("供方物料描述"),
    },
    {
      fieldCode: "supItemCategoryDesc",
      fieldName: $T("sslm.supplyAbilityDoc.model.supplyAbility.supCategoryDesc").$D("供方品类描述"),
    },
    {
      fieldCode: "itemCategoryCode",
      fieldName: $T("sslm.supplyAbility.model.supplyAbility.itemCategoryCode").$D("品类代码"),
    },
    {
      fieldCode: "itemCategoryName",
      fieldName: $T("sslm.common.category.categoryName").$D("品类名称"),
    },
    {
      fieldCode: "supplyFlag",
      fieldName: $T("sslm.supplyAbility.model.supplyAbility.availableFor").$D("可供"),
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
      fieldCode: "purchaseOrganizationName",
      fieldName: $T("sslm.supplyAbility.model.supplyAbility.purchasingOrganization")
        .$D("采购组织"),
    },
    {
      fieldCode: "inventoryOrganizationIdMeaning",
      fieldName: $T("sslm.supplyAbility.model.supplyAbility.inventoryOrganization")
        .$D("库存组织"),
    },
    {
      fieldCode: "manufacturer",
      fieldName: $T("sslm.supplyAbility.model.supplyAbility.manufacturer").$D("生产厂家"),
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
      fieldCode: "remark",
      fieldName: $T("hzero.common.remark").$D("备注"),
    },
  ],
  transport: {
    read: {
      url: `sslm/v1/${organizationId}/supply-ability-change-lines/${abilityReqId}`,
      method: "POST",
      params:{ customizeUnitCode:"SUPPLY_ABILITY_DOC.PURCHASER_DETAIL.CATEGORYS_LIST", editPageFlag: 0 }
    },
  },
})
;
