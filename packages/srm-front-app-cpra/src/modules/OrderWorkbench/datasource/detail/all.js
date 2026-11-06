import { SrmUtil } from "srm-mobile-ui";

// 订单基础信息和采买组织信息共用Ds
function basicInfoDs() {
  return {
    autoQuery: false,
    selection: Infinity,
    pageSize: 1000,
    editable: false,
    enableQuery: false,
    showTotalCount: false,
    fields: [],
    pathParameter: {
      tenantId: SrmUtil.getTenantId()
    },
    transport: {
      read: {
        url: "spuc/v1/{tenantId}/po-header/{poHeaderId}/detail",
        method: "get"
      }
    }
  };
}

// 订单行Ds
function lineDs() {
  return {
    autoQuery: false,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    editFlag: false,
    enableQuery: false,
    fields: [],
    pathParameter: {
      tenantId: SrmUtil.getTenantId(),
      poHeaderId: null
    },
    transport: {
      read: {
        url: "spuc/v1/{tenantId}/po-line/{poHeaderId}/detail",
        method: "get"
      }
    },
    events: {
      // 查询数据后操作
      // afterQuery(ds, result) {
      //   // 业务规则配置
      //   Promise.all([
      //     // 物料限定范围规则
      //     getCreationApi("SITE.SPUC.PR.CREATION.ITEM_LIMIT", [
      //       { fullPathCode: "SITE.SPUC.PR.CREATION.ITEM_LIMIT" }
      //     ]),
      //     // 单位显示
      //     getCreationApi("SITE.SMDM.UOM_DISPLAY_CONFIGURATION", [
      //       { fullPathCode: "SITE.SMDM.UOM_DISPLAY_CONFIGURATION" }
      //     ])
      //   ]).then((list) => {
      //     const [itemLimit] = list[0];
      //     const [uomDisplay] = list[1];
      //     result.map((res) => {
      //       // 物料根据库存组织和物料分类选择
      //       res["itemLimit"] = itemLimit;
      //       // 单位显示格式 单位编码/单位名称
      //       res["uomDisplay"] = uomDisplay;
      //       // 价格隐藏
      //       if (res.linePriceHiddenFlag === 1) {
      //         // 预估单价(含税)
      //         res["taxIncludedUnitPriceMeaning"] = "***";
      //         // localCurrencyTaxSum
      //         res["localCurrencyTaxSumMeaning"] = "***";
      //       }
      //     });
      //   });
      // }
    }
  };
}

export { basicInfoDs, lineDs };
