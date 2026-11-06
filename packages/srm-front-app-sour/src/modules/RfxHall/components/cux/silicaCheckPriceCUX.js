import { $T, } from "srm-mobile-ui";
import { isNil, } from "lodash";

const RED = "#F06200";

const cusRenderer = (text) =>
  <span style={{ color: RED, }}>
    {text ?? "-"}
  </span>
  ;

const getSilicaCheckPriceBaseFormFieldsCux = (options) => {
  const {
    editor = false,
  } = options || {};

  const fields = [
    {
      formRow: 80,
      fieldCode: "attributeVarchar3",
      fieldType: editor ? "SELECT" : "TEXT",
      lovCode: "SILICA.SFTJ",
      fieldName: $T("sscux.ssrc.view.cux.silica.whetherFuturesOrNot").$D("是否期货"),
      editor,
      displayField: "attributeVarchar3Meaning",
      render: (_, record) => {
        const { attributeVarchar3Meaning } = record || {};
        return cusRenderer(attributeVarchar3Meaning);
      },
    },
    {
      formRow: 90,
      fieldCode: "attributeVarchar13",
      fieldType: editor ? "SELECT" : "TEXT",
      lovCode: "SILICA.SFTJ",
      fieldName: $T("sscux.ssrc.view.cux.silica.whetherAdjustPrice").$D("是否调价"),
      render: (_, record) => {
        const { attributeVarchar13Meaning } = record || {};
        return cusRenderer(attributeVarchar13Meaning);
      },
      displayField: "attributeVarchar13Meaning",
    },
    {
      formRow: 100,
      fieldCode: "attributeVarchar6",
      fieldName: $T("sscux.ssrc.view.cux.silica.rfqTypes").$D("询价类型"),
      fieldType: editor ? "SELECT" : "TEXT",
      lovCode: "SILICA_XJLX",
      render: (_, record) => {
        const { attributeVarchar6Meaning } = record || {};
        return cusRenderer(attributeVarchar6Meaning);
      },
      displayField: "attributeVarchar6Meaning",
    },
  ];

  return fields;
};

const getCUXPricingBasicInfoColumnsSilica = () => {
  const fields = [
    {
      fieldCode: "attributeVarchar13",
      fieldName: $T("sscux.ssrc.silica.view.cux.priceCheckPrice").$D("涨跌幅"),
      render: (_, record) => {
        const { attributeVarchar13 } = record || {};
        // attributeVarchar13（涨跌幅字段）只是正数标红 负数不标红
        if (isNil(attributeVarchar13)) {
          return "-";
        }
        let strVal = (attributeVarchar13 || 0).toString();
        const positiveNumber = attributeVarchar13 && /^\d/.test(strVal);
        return positiveNumber ? cusRenderer(attributeVarchar13) : attributeVarchar13;
      }
    },
    {
      fieldCode: "attributeDecimal20",
      fieldName: $T("sscux.ssrc.silica.view.cux.minPrice").$D("最低价"),
      render: (_, record) => {
        const { attributeDecimal20 } = record || {};
        return cusRenderer(attributeDecimal20);
      }
    },
  ];

  return fields;
};

export {
  getSilicaCheckPriceBaseFormFieldsCux,
  getCUXPricingBasicInfoColumnsSilica,
};
