import { SrmUtil, $T } from "srm-mobile-ui";
import { isEmpty } from "@/utils";

// 处理数据
const handleDataSource = (source = []) => {
  if (isEmpty(source)) {
    return [];
  }
  const restructureSource = source.map((item) => {
    let elementValue = {};
    const { quotationColumns = [], ...otherItem } = item;
    quotationColumns.forEach((newItem) => {
      elementValue = {
        ...elementValue,
        [newItem.columnCode]: newItem.supQuotationColumnValue || newItem.supQuotationColumnValueMeaning || newItem.supColumnDefaultValue || newItem.supColumnDefaultValueMeaning,
      };
    });

    return {
      ...otherItem,
      ...elementValue,
      quotationColumns,
    };
  });
  return restructureSource;
};

function quotationDetailsdS() {
  return {
    autoQuery: false,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    enableQuery: false,
    pathParameter: { tenantId: SrmUtil.getTenantId() },
    fields: [
      {
        fieldName: $T("ssrc.common.jht.configCode").$D("报价明细编码"),
        fieldCode: "configCode",
      },
      {
        fieldName: $T("ssrc.common.jht.configName").$D("报价明细名称"),
        fieldCode: "configName",
      },
      {
        fieldName: $T("ssrc.common.jht.Quantity").$D("数量"),
        fieldCode: "Quantity",
        fieldType: "INPUT_NUMBER",
      },
      {
        fieldName: $T("ssrc.common.jht.material.Price").$D("单价"),
        fieldCode: "Price",
        fieldType: "INPUT_NUMBER",
        required: true,
      },
      {
        fieldName: $T("ssrc.common.jht.material.Remark").$D("备注"),
        fieldType: "TEXT_AREA",
        fieldCode: "Remark",
      },
    ],
    transport: {
      read: {
        url: "/ssrc/v2/{tenantId}/rfx/sup-dtl",
        method: "get",
        transformResponse: ({ response }) => {
          if (response && !response.failed) {
            const {
              supQuotationDtlCurPage: { content = [], ...pages },
            } = response;
            const data = handleDataSource(content);
            return { ...pages, content: data };
          }
        },
      },
    },
  };
}

export default quotationDetailsdS;
