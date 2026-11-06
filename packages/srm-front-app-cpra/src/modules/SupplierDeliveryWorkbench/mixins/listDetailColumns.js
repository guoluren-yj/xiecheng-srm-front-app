
export default {
  data() {
    return {};
  },
  methods: {
    getListDetailColumns(nodeTemplateCode, tab) {
      switch (nodeTemplateCode) {
      case "ASN":
        if (tab === "affirm") {
          return [
            {
              fieldCode: "lineStatusMeaning",
            },
            {
              fieldCode: "displayAsnNumAndLineNum",
              render: (val, item) => <span>{ item.displayAsnNum }-{ item.displayAsnLineNum }</span>
            },
            {
              fieldCode: "itemCode",
            },
            {
              fieldCode: "itemName",
            },
            {
              fieldCode: "displayUom",
            },
            {
              fieldCode: "actualQuantity",
            },
            {
              fieldCode: "quantity",
            },
            {
              fieldCode: "unitPackageQuantity",
            },
            {
              fieldCode: "packageQuantity",
            },
            {
              fieldCode: "remainderQuantity",
            },
            {
              fieldCode: "netWeight",
            },
            {
              fieldCode: "grossWeight",
            },
            {
              fieldCode: "lotNum",
            },
            {
              fieldCode: "productionDate",
              render: (val, item) => val && <span>{ item.productionDate.CalcDate }</span>
            },
            {
              fieldCode: "shelfLife",
            },
            {
              fieldCode: "lotExpirationDate",
            },
            {
              fieldCode: "serialNum",
            },
            {
              fieldCode: "purchaseLineRemark",
            },
            {
              fieldCode: "supplierLineRemark",
            },
            {
              fieldCode: "companyName",
            },
            {
              fieldCode: "supplierCompanyName",
            },
            {
              fieldCode: "fromDisplayPoNum",
              render: (val, item) => item.fromDisplayPoNum ? <span>{val}-{item.fromDisplayPoLineNum}</span> : "-",
            },
            {
              fieldCode: "sourceDisplayNum",
              render: (val, item) => item.sourceDisplayNum ? <span>{val}-{item.sourceDisplayLineNum}</span> : "-",
            },
            {
              fieldCode: "sourceNodeConfigName",
            },
            {
              fieldCode: "shipToLocContName",
            },
            {
              fieldCode: "shipToLocTelNum",
            },
            {
              fieldCode: "productNum",
            },
            {
              fieldCode: "productName",
            },
            {
              fieldCode: "catalogName",
            },
            {
              fieldCode: "splitFlagMeaning",
            },
            {
              fieldCode: "creationDate",
            },
            {
              fieldCode: "createdName",
            },
            {
              fieldCode: "updatedName",
            },
          ];
        } else if (tab === "all") {
          return [
            {
              fieldCode: "lineStatusMeaning",
            },
            {
              fieldCode: "displayAsnNumAndLineNum",
              render: (val, item) => <span>{ item.displayAsnNum }-{ item.displayAsnLineNum }</span>
            },
            {
              fieldCode: "itemCode",
            },
            {
              fieldCode: "itemName",
            },
            {
              fieldCode: "displayUom",
            },
            {
              fieldCode: "actualQuantity",
            },
            {
              fieldCode: "quantity",
            },
            {
              fieldCode: "receiveQuantity",
            },
            {
              fieldCode: "receiveStatusMeaning",
            },
            {
              fieldCode: "unitPackageQuantity",
            },
            {
              fieldCode: "packageQuantity",
            },
            {
              fieldCode: "remainderQuantity",
            },
            {
              fieldCode: "netWeight",
            },
            {
              fieldCode: "grossWeight",
            },
            {
              fieldCode: "lotNum",
            },
            {
              fieldCode: "productionDate",
            },
            {
              fieldCode: "shelfLife",
            },
            {
              fieldCode: "lotExpirationDate",
            },
            {
              fieldCode: "serialNum",
            },
            {
              fieldCode: "purchaseLineRemark",
            },
            {
              fieldCode: "supplierLineRemark",
            },
            {
              fieldCode: "companyName",
            },
            {
              fieldCode: "supplierCompanyName",
            },
            {
              fieldCode: "fromDisplayPoNum",
              render: (val, item) => item.fromDisplayPoNum ? <span>{val}-{item.fromDisplayPoLineNum}</span> : "-",
            },
            {
              fieldCode: "sourceDisplayNum",
              render: (val, item) => item.sourceDisplayNum ? <span>{val}-{item.sourceDisplayLineNum}</span> : "-",
            },
            {
              fieldCode: "sourceNodeConfigName",
            },
            {
              fieldCode: "shipToLocContName",
            },
            {
              fieldCode: "shipToLocTelNum",
            },
            {
              fieldCode: "splitFlagMeaning",
            },
            {
              fieldCode: "creationDate",
            },
            {
              fieldCode: "createdName",
            },
            {
              fieldCode: "updatedName",
            },
            {
              fieldCode: "strategyName",
            },
            {
              fieldCode: "strategyDataVersion",
            }
          ];
        }
        return [
          {
            fieldCode: "itemName",
          },
          {
            fieldCode: "itemCode",
          },
          {
            fieldCode: "displayUom",
          },
          {
            fieldCode: "sourceQuantity",
          },
          {
            fieldCode: "canCreateQuantity",
          },
          {
            fieldCode: "receiveQuantity",
          },
          {
            fieldCode: "fromDisplayPoNum",
            render: (val, item) => <span>{val} - {item.fromDisplayPoLineNum}</span>
          },
          {
            fieldCode: "fromDisplayPoLocationNum",
          },
          {
            fieldCode: "sourceDisplayNum",
            render: (val, item) => <span>{val} - {item.sourceDisplayLineNum}</span>
          },
          {
            fieldCode: "sourceNodeConfigName",
          },
          {
            fieldCode: "poTypeName",
          },
          {
            fieldCode: "fromDisplayPoReleaseNum",
          },
          {
            fieldCode: "supplierCompanyName",
          },
          {
            fieldCode: "companyName",
          },
          {
            fieldCode: "poSourcePlatformMeaning",
          },
          {
            fieldCode: "neededDate",
            // eslint-disable-next-line new-cap
            render: (val) => val ? this.$options.filters.CalcDate(val) : "",
          },
          {
            fieldCode: "promisedDate",
            // eslint-disable-next-line new-cap
            render: (val) => val ? this.$options.filters.CalcDate(val) : "",
          },
          {
            fieldCode: "immedShippedFlag",
            render: (val) => Number(val) === 1 ? this.$T("hipspfm.common.status.yes").$D("是") : this.$T("hipspfm.common.status.no").$D("否"),
          },
          {
            fieldCode: "purchaseOrgName",
          },
          {
            fieldCode: "invOrganizationName",
          },
          {
            fieldCode: "deliveryAddress",
          },
          {
            fieldCode: "receiveAddress",
          },
          {
            fieldCode: "inventoryName",
          },
          {
            fieldCode: "locationName",
          },
          {
            fieldCode: "shipToLocContName",
          },
          {
            fieldCode: "shipToLocTelNum",
          },
          {
            fieldCode: "agentName",
          },
          {
            fieldCode: "categoryName",
          },
          {
            fieldCode: "productNum",
          },
          {
            fieldCode: "productName",
          },
          {
            fieldCode: "catalogName",
          },
        ];
      case "PLAN":
        if (tab === "affirm") {
          return [
            {
              fieldCode: "lineStatusMeaning",
            },
            {
              fieldCode: "displayPlanNumAndLineNum",
              render: (val, item) => <span>{ item.displayPlanNum }-{ item.displayPlanLineNum }</span>
            },
            {
              fieldCode: "itemCode",
            },
            {
              fieldCode: "itemName",
            },
            {
              fieldCode: "displayUom",
            },
            {
              fieldCode: "actualQuantity",
            },
            {
              fieldCode: "plannedArrivalDate",
              // eslint-disable-next-line new-cap
              render: (val) => val ? this.$options.filters.CalcDate(val) : "",
            },
            {
              fieldCode: "quantity",
            },
            //下面为最新-检查ds
            {
              fieldCode: "confirmArrivalDate",
              // eslint-disable-next-line new-cap
              render: (val) => val ? this.$options.filters.CalcDate(val) : "",
            },
            {
              fieldCode: "fromDisplayPoNum",
              render: (val, item) => <span>{ item.fromDisplayPoNum }-{ item.fromDisplayPoLineNum }</span>
            },
            {
              fieldCode: "sourceDisplayNum",
              render: (val, item) => <span>{ item.sourceDisplayNum }-{ item.sourceDisplayLineNum }</span>
            },
            {
              fieldCode: "sourceNodeConfigName",
            },
            {
              fieldCode: "neededDate",
              // eslint-disable-next-line new-cap
              render: (val) => val ? this.$options.filters.CalcDate(val) : "",
            },
            {
              fieldCode: "promisedDate",
              // eslint-disable-next-line new-cap
              render: (val) => val ? this.$options.filters.CalcDate(val) : "",
            },
            {
              fieldCode: "purchaseLineRemark", // 采购方行备注
            },
            {
              fieldCode: "supplierLineRemark", // 供应商行备注
            },
            {
              fieldCode: "companyName", // 公司
            },
            {
              fieldCode: "supplierCompanyName", // 供应商
            },
            {
              fieldCode: "agentName",
            },
            {
              fieldCode: "categoryName",
            },
            {
              fieldCode: "invOrganizationName",
            },
            {
              fieldCode: "receiveAddress",
            },
            {
              fieldCode: "splitFlagMeaning", // 拆分标记
            },
            {
              fieldCode: "createdName", // 创建人
            },
            {
              fieldCode: "updatedName",
            },
          ];
        }
        if (tab === "all") {
          return [
            {
              fieldCode: "lineStatusMeaning",
            },
            {
              fieldCode: "displayPlanNumAndLineNum",
              render: (val, item) => <span>{ item.displayPlanNum }-{ item.displayPlanLineNum }</span>
            },
            {
              fieldCode: "itemCode",
            },
            {
              fieldCode: "itemName",
            },
            {
              fieldCode: "displayUom",
            },
            {
              fieldCode: "actualQuantity",
            },
            {
              fieldCode: "plannedArrivalDate",
              // eslint-disable-next-line new-cap
              render: (val) => val ? this.$options.filters.CalcDate(val) : "",
            },
            {
              fieldCode: "quantity",
            },
            //下面为最新-检查ds
            {
              fieldCode: "confirmArrivalDate",
              // eslint-disable-next-line new-cap
              render: (val) => val ? this.$options.filters.CalcDate(val) : "",
            },
            {
              fieldCode: "downstreamNodeInfoList",
            },
            {
              fieldCode: "receiveQuantity",
            },
            {
              fieldCode: "receiveStatusMeaning",
            },
            {
              fieldCode: "fromDisplayPoNum",
              render: (val, item) => item.fromDisplayPoNum ? <span>{val}-{item.fromDisplayPoLineNum}</span> : "-",
            },
            {
              fieldCode: "sourceDisplayNum",
              render: (val, item) => item.sourceDisplayNum ? <span>{val}-{item.sourceDisplayLineNum}</span> : "-",
            },
            {
              fieldCode: "sourceNodeConfigName",
            },
            {
              fieldCode: "poTypeName", // 订单类型
            },
            {
              fieldCode: "neededDate", // 需求日期
              // eslint-disable-next-line new-cap
              render: (val) => val ? this.$options.filters.CalcDate(val) : "",
            },
            {
              fieldCode: "promisedDate", // 承诺交货日期
              // eslint-disable-next-line new-cap
              render: (val) => val ? this.$options.filters.CalcDate(val) : "",
            },
            {
              fieldCode: "purchaseLineRemark", // 采购方行备注
            },
            {
              fieldCode: "supplierLineRemark", // 供应商行备注
            },
            {
              fieldCode: "companyName", // 公司
            },
            {
              fieldCode: "supplierCompanyName", // 供应商
            },
            {
              fieldCode: "agentName",
            },
            {
              fieldCode: "categoryName",
            },
            {
              fieldCode: "invOrganizationName",
            },
            {
              fieldCode: "receiveAddress",
            },
            {
              fieldCode: "splitFlagMeaning",
            },
            {
              fieldCode: "createdName",
            },
            {
              fieldCode: "updatedName",
            },
            {
              fieldCode: "strategyName", // 发货策略
            },
            {
              fieldCode: "strategyDataVersion", // 发货策略版本
            },
          ];
        }
        return [
          {
            fieldCode: "itemName",
          },
          {
            fieldCode: "itemCode",
          },
          {
            fieldCode: "displayUom",
          },
          {
            fieldCode: "canCreateQuantity",
          },
          {
            fieldCode: "fromDisplayPoNum",
            render: (val, item) => <span>{val} - {item.fromDisplayPoLineNum}</span>
          },
          {
            fieldCode: "neededDate",
            // eslint-disable-next-line new-cap
            render: (val) => val ? this.$options.filters.CalcDate(val) : "",
          },
          {
            fieldCode: "promisedDate",
            // eslint-disable-next-line new-cap
            render: (val) => val ? this.$options.filters.CalcDate(val) : "",
          },
          {
            fieldCode: "invOrganizationName",
          },
          {
            fieldCode: "companyName",
          },
          {
            fieldCode: "supplierCompanyName",
          },
        ];
      default:
        return [];
      }
    },
  }
};
