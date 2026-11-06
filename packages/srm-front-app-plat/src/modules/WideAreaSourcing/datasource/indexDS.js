import { $T } from "srm-mobile-ui";

function indexDS(vm, data) {
  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    enableQuery: false,
    data: [],
    fields: [],
    bodyParameter: {
      // eslint-disable-next-line rulesdir/check_js
      customerName: "上海甄云信息技术有限公司",
      pageNum: 1,
      pageSize: 10,
      sortType: "DESC",
      type: 1,
    },
    fastQueryField: {
      fieldCode: "keyword",
      fieldType: "TEXT",
      fieldName: $T("smbl.wideArea.view.productName").$D("商品名称"),
    },
    // 查询表单字段
    queryFields: [
      {
        fieldCode: "areaCode",
        fieldType: "SELECT",
        fieldName: $T("smbl.wideArea.model.localArea").$D("所在地区"),
        options: {
          displayField: "meaning",
          subDisplayField: "value",
          valueField: "value",
          listData: data.areaCodeList,
        },
      },
      {
        fieldCode: "capitalType",
        fieldType: "SELECT",
        fieldName: $T("smbl.wideArea.model.registeredCapitalWithUnit").$D("注册资本"),
        options: {
          displayField: "meaning",
          subDisplayField: "value",
          valueField: "value",
          listData: data.capitalTypeList,
        },
      },
    ],
    events: {
      beforeQuery: (ds, params, pathParams, bodyParameter) => {
        const { areaCode, capitalType } = params;
        bodyParameter["areaCode"] = areaCode;
        bodyParameter["capitalType"] = capitalType;
        if (!bodyParameter["searchName"]) {
          bodyParameter["searchName"] = "undefined";
        }
      }
    },
    transport: {
      read: {
        url: `/spfm/v1/${localStorage.getItem("organizationId")}/wide-area-sourcing/supplier`,
        method: "post",
      },
    },
  };
}

export default indexDS;
