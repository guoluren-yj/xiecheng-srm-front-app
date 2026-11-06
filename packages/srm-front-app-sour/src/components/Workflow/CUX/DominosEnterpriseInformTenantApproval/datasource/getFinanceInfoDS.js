/*
 * @Date: 2023-04-12 14:34:31
 * @Author: CDJ
 * @Version: 0.0.1
 * @Copyright: Copyright (c) 2021, Hand
 */
import { $T } from "srm-mobile-ui";
import { getRedFlag, renderRedNode, renderUpdateTag } from "../utils/utils";

export const getFinanceInfoDS = () => ({
  editable: false,
  enableQuery: false,
  paging: false,
  fields: [
    {
      fieldName: $T("sslm.enterpriseInform.view.model.financial.year").$D(
        "年份"
      ),
      fieldCode: "year",
    },
    {
      fieldName: $T(
        "sslm.enterpriseInform.view.model.financial.currencyName"
      ).$D("币种"),
      fieldCode: "currencyName",
    },
    {
      fieldName: $T(
        "sslm.enterpriseInform.view.model.financial.totalAssets"
      ).$D("企业总资产(万)"),
      fieldCode: "totalAssets",
    },
    {
      fieldName: $T(
        "sslm.enterpriseInform.view.model.financial.totalLiabilities"
      ).$D("总负债(万)"),
      fieldCode: "totalLiabilities",
    },
    {
      fieldName: $T(
        "sslm.enterpriseInform.view.model.financial.currentAssets"
      ).$D("流动资产(万)"),
      fieldCode: "currentAssets",
    },
    {
      fieldName: $T(
        "sslm.enterpriseInform.view.model.financial.currentLiabilities"
      ).$D("流动负债(万)"),
      fieldCode: "currentLiabilities",
    },
    {
      fieldName: $T("sslm.enterpriseInform.view.model.financial.revenue").$D(
        "营业收入(万)"
      ),
      fieldCode: "revenue",
    },
    {
      fieldName: $T("sslm.enterpriseInform.view.model.financial.netProfit").$D(
        "净利润(万)"
      ),
      fieldCode: "netProfit",
    },
    {
      fieldName: $T(
        "sslm.enterpriseInform.view.model.financial.assetLiabilityRatio"
      ).$D("资产负债率"),
      fieldCode: "assetLiabilityRatio",
    },
    {
      fieldName: $T(
        "sslm.enterpriseInform.view.model.financial.currentRatio"
      ).$D("流动比率"),
      fieldCode: "currentRatio",
    },
    {
      fieldName: $T(
        "sslm.enterpriseInform.view.model.financial.totalAssetsEarningsRatio"
      ).$D("总资产收益率"),
      fieldCode: "totalAssetsEarningsRatio",
    },
    {
      fieldName: $T("sslm.enterpriseInform.view.model.financial.remark").$D(
        "备注"
      ),
      fieldCode: "remark",
    },
  ],
});

export const getFinanceInfoColums = () =>
  [
    {
      fieldName: $T("sslm.enterpriseInform.view.model.financial.year").$D(
        "年份"
      ),
      fieldCode: "year",
      render: (val, item) => <SrmListHeader showOpenTag={false}>
        <span style={{ fontWeight:400 }}>{renderRedNode({ name: "year", record:item })}</span>
        <span slot="right">{renderUpdateTag(item)}</span>
      </SrmListHeader>,
    },
    {
      fieldName: $T(
        "sslm.enterpriseInform.view.model.financial.currencyName"
      ).$D("币种"),
      fieldCode: "currencyName",
    },
    {
      fieldName: $T(
        "sslm.enterpriseInform.view.model.financial.totalAssets"
      ).$D("企业总资产(万)"),
      fieldCode: "totalAssets",
    },
    {
      fieldName: $T(
        "sslm.enterpriseInform.view.model.financial.totalLiabilities"
      ).$D("总负债(万)"),
      fieldCode: "totalLiabilities",
    },
    {
      fieldName: $T(
        "sslm.enterpriseInform.view.model.financial.currentAssets"
      ).$D("流动资产(万)"),
      fieldCode: "currentAssets",
    },
    {
      fieldName: $T(
        "sslm.enterpriseInform.view.model.financial.currentLiabilities"
      ).$D("流动负债(万)"),
      fieldCode: "currentLiabilities",
    },
    {
      fieldName: $T("sslm.enterpriseInform.view.model.financial.revenue").$D(
        "营业收入(万)"
      ),
      fieldCode: "revenue",
    },
    {
      fieldName: $T("sslm.enterpriseInform.view.model.financial.netProfit").$D(
        "净利润(万)"
      ),
      fieldCode: "netProfit",
    },
    {
      fieldName: $T(
        "sslm.enterpriseInform.view.model.financial.assetLiabilityRatio"
      ).$D("资产负债率"),
      fieldCode: "assetLiabilityRatio",
      render:(val, item, field) => {
        const redFlag = getRedFlag({ name:field.fieldCode, record:item });
        return <span style={{ color: redFlag && "red" }}>
          {Number((val || 0) * 100).toFixed(2) + "%"}
        </span>;
      },
    },
    {
      fieldName: $T(
        "sslm.enterpriseInform.view.model.financial.currentRatio"
      ).$D("流动比率"),
      fieldCode: "currentRatio",
      render:(val, item, field) => {
        const redFlag = getRedFlag({ name:field.fieldCode, record:item });
        return <span style={{ color: redFlag && "red" }}>
          {Number((val || 0) * 100).toFixed(2) + "%"}
        </span>;
      },
    },
    {
      fieldName: $T(
        "sslm.enterpriseInform.view.model.financial.totalAssetsEarningsRatio"
      ).$D("总资产收益率"),
      fieldCode: "totalAssetsEarningsRatio",
      render:(val, item, field) => {
        const redFlag = getRedFlag({ name:field.fieldCode, record:item });
        return <span style={{ color: redFlag && "red" }}>
          {Number((val || 0) * 100).toFixed(2) + "%"}
        </span>;
      },
    },
    {
      fieldName: $T("sslm.enterpriseInform.view.model.financial.remark").$D(
        "备注"
      ),
      fieldCode: "remark",
    },
  ].map((col) => ({
    render: (val, item, field) =>
      renderRedNode({ name: field.fieldCode, record: item, code: col.code }),
    ...col,
  }));
