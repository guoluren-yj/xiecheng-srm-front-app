/*
 * @Date: 2023-04-11 16:55:29
 * @Author: LXM <xiaomei.lv@going-link.com>
 * @Version: 0.0.1
 * @Copyright: Copyright (c) 2021, Hand
 */
import { $T } from "srm-mobile-ui";
import { getRedFlag, renderRedNode, renderUpdateTag } from "../utils/utils";
import { yesOrNoRenderer } from "@/utils/renderer";

export const getSupplyAbilityDS = () => ({
  editable: false,
  enableQuery: false,
  paging: false,
  fields: [
    {
      fieldCode: "itemCode",
      fieldName:  $T("sslm.supplyAbility.model.supplyAbility.itemCode").$D("物料编码"),
    },
    {
      fieldCode: "itemName",
      fieldName:  $T("sslm.supplyAbility.model.supplyAbility.itemName").$D("物料描述"),
    },
    {
      fieldCode: "categoryCode",
      fieldName:  $T("sslm.supplyAbility.model.supplyAbility.itemCategoryCode").$D("品类代码"),
    },
    {
      fieldCode: "categoryName",
      fieldName:  $T("sslm.supplyAbility.model.supplyAbility.itemCategoryDesc").$D("品类描述"),
    },
    {
      fieldCode: "oneTimeFlag",
      fieldName:  $T("sslm.supplyAbility.model.supplyAbility.oneTimeFlag").$D("是否一次性供货"),
    },
    {
      fieldCode: "adapterProducts",
      fieldName:  $T("sslm.supplyAbility.model.supplyAbility.adapterProducts").$D("适配产品"),
    },
    {
      fieldCode: "countryId",
      fieldName:  $T("sslm.supplyAbility.model.supplyAbility.countryIdMeaning").$D("服务国家"),
    },
    {
      fieldCode: "regionId",
      fieldName:  $T("sslm.supplyAbility.model.supplyAbility.regionIdMeaning").$D("服务地区"),
    },
    {
      fieldCode: "cityId",
      fieldName:  $T("sslm.supplyAbility.model.supplyAbility.cityIdMeaning").$D("服务城市"),
    },
    {
      fieldCode: "dateFrom",
      fieldName:  $T("sslm.supplyAbility.model.supplyAbility.dateFrom").$D("有效期从"),
    },
    {
      fieldCode: "dateTo",
      fieldName:  $T("sslm.supplyAbility.model.supplyAbility.dateTo").$D("有效期至"),
    },
    {
      fieldCode: "inventoryOrganizationId",
      fieldName:  $T("sslm.supplyAbility.model.supplyAbility.inventoryOrganization").$D("库存组织"),
    },
    {
      fieldCode: "purchaseOrganizationId",
      fieldName:  $T("sslm.supplyAbility.model.supplyAbility.purchasingOrganization")
        .$D("采购组织"),
    },
    {
      fieldCode: "manufacturer",
      fieldName:  $T("sslm.supplyAbility.model.supplyAbility.manufacturer").$D("生产厂家"),
    },
    {
      fieldCode: "attachment",
      fieldName:  $T("hzero.common.upload.modal.label").$D("附件"),
    },
    {
      fieldCode: "remark",
      fieldName:  $T("hzero.common.remark").$D("备注"),
    },
  ],
});

export const getSupplyAbilityColums = (onAttachment) => [
  {
    fieldCode: "itemCode",
    render: (val, item) => {
      const updateTag = renderUpdateTag(item);
      return (
        <SrmListHeader showOpenTag={false}>
          <span style={{ fontWeight:400 }}>{renderRedNode({ name: "itemCode", record:item })}</span>
          <span slot="right">
            <SrmTag
              type={item.supplyFlag ? "success" : "danger"}
              style={{ marginRight: updateTag ? "8px" : "0px" }}
            >
              {item.supplyFlag ? $T("ssrc.supplyInfoChange.model.supplyed").$D("可供") : $T("ssrc.supplyInfoChange.model.unsupplyed").$D("不可供")}
            </SrmTag>
            {renderUpdateTag(item)}
          </span>
        </SrmListHeader>
      );
    },
  },
  {
    fieldCode: "itemName",
  },
  {
    fieldCode: "categoryCode",
  },
  {
    fieldCode: "categoryName",
  },
  {
    fieldCode: "oneTimeFlag",
    render: (val, item, field) => {
      const redFlag = getRedFlag({ name: field.fieldCode, record:item });
      return <span style={{ color: redFlag && "red" }}>
        {yesOrNoRenderer(val)}
      </span>;
    }
  },
  {
    fieldCode: "adapterProducts",
  },
  {
    fieldCode: "countryId",
    code:"countryIdMeaning",
  },
  {
    fieldCode: "regionId",
    code:"regionIdMeaning",
  },
  {
    fieldCode: "cityId",
    code:"cityIdMeaning",
  },
  {
    fieldCode: "dateFrom",
  },
  {
    fieldCode: "dateTo",
  },
  {
    fieldCode: "inventoryOrganizationId",
    code:"inventoryOrganizationIdMeaning",
  },
  {
    fieldCode: "purchaseOrganizationId",
    code:"purchaseOrganizationName",
  },
  {
    fieldCode: "manufacturer",
  },
  {
    fieldCode: "attachment",
    render:(_, record) => <a style={{ color: "var(--font-color-primary)" }} onClick={(e) => {
      e.stopPropagation();
      onAttachment(record);
    }}>{`${$T("hipspfm.common.button.viewAttachments").$D("查看附件")} (${record.fileCount || 0})`}</a>,
  },
  {
    fieldCode: "remark",
  },
].map((col) => ({ render: (val, item, field) => renderRedNode({ name: field.fieldCode, record:item, code:col.code }), ...col, }));
