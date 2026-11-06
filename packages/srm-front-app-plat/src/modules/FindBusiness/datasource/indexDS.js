import { $T } from "srm-mobile-ui";

function indexDS(vm) {
  return {
    autoQuery: false,
    selection: Infinity,
    pageSize: 20,
    editable: false,
    enableQuery: false,
    data: [],
    fields: [],
    bodyParameter: {},
    fastQueryField: {
      fieldCode: "keyword",
      fieldType: "TEXT",
      fieldName: $T("smbl.wideArea.view.productName").$D("商品名称"),
    },
    // 查询表单字段
    queryFields: [
      {
        fieldCode: "province",
        fieldType: "SELECT",
        lovCode: "SPFM.WIDE_AREA_LIST",
        fieldName: $T("smbl.wideArea.model.localArea").$D("所在地区"),
        options: {
          displayField: "meaning",
          subDisplayField: "value2",
          valueField: "meaning",
          // listData: batchData.areaCodeList,
          callback: (data) => {
            vm.province = data[0].value !== "all" ? data[0].meaning : "";
          }
        },
      },
      {
        fieldCode: "registeredCapital",
        fieldType: "SELECT",
        lovCode: "SMBL.SUPPLIER_REGISTEREDCAPITAL",
        fieldName: $T("smbl.wideArea.model.registeredCapitalWithUnit").$D("注册资本"),
        options: {
          displayField: "meaning",
          subDisplayField: "value2",
          valueField: "value",
        },
      },
      {
        fieldCode: "industryCategoryName",
        fieldType: "LOV",
        lovCode: "SMBL.SUPPLIER_INDUSTRY",
        fieldName: $T("smbl.wideArea.model.industry").$D("行业"),
        options: {
          subDisplayField: "industry_category_name",
          queryParams: {
            itemName: ""
          },
        },
      },
    ],
    events: {
      beforeQuery: (ds, params, _, bodyParameter) => {
        vm.showLoading = true;
        if (!params["itemName"]) {
          params["itemName"] = "";
        }
        if (params["province"]) {
          params["province"] = vm.province;
        } else {
          params["province"] = "";
        }
        const pageParams = { page: ds.currentPage, size: ds.pageSize };
        Object.keys({ ...pageParams, ...params }).forEach((key) => {
          bodyParameter[key] = params[key] || pageParams[key];
          params[key] = "";
        });
      },
      afterQuery: (ds) => {
        const { itemName, registeredCapital, industryCategoryName } = ds.queryParameter;
        vm.getSupplierAreaInfo(itemName, registeredCapital, industryCategoryName);
      }
    },
    transport: {
      read: {
        url: `/smbl/v1/${localStorage.getItem("organizationId")}/source/search`,
        method: "post",
      },
    },
  };
}

export default indexDS;
