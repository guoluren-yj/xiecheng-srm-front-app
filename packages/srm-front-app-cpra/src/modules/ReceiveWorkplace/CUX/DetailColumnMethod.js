import { SrmUtil } from "srm-mobile-ui";
import { SrmMath } from "srm-mobile-ui";

const getCUXLineColumns = (columns, that) => {
  const userInfo = SrmUtil.getUserInfo();
  if (userInfo.tenantNum === "SRM-LDJT") {
    columns.push(
      {
        fieldCode: "attributeDecimal2",
        fieldType: "INPUT_NUMBER",
        editor: false,
      },
      {
        fieldCode: "attributeDecimal1",
        fieldType: "INPUT_NUMBER",
        editor: (val, item) => {
          const rcvStatusCode = that.headDataSet.data[0]["rcvStatusCode"];
          return (
            ![ "20_SUBMITTED", "40_FINISHED" ].includes(rcvStatusCode) &&
            item.subjectType === "QUANTITY" &&
            !(
              [ "30_SUP_REJECTED", "30_REJECTED" ].includes(
                that.headDataSet?.data[0]?.rcvStatusCode
              ) &&
              ![ "SRM", "SRM-MALL" ].includes(
                that.headDataSet?.data[0]?.sourceCode
              )
            )
          );
        },
        inputChange: (value, record) => {
          const { quantity, attributeVarchar4 } = record || {};
          const data1 = SrmMath.times(Number(value), Number(quantity));
          const data2 = SrmMath.times(Number(data1), Number(attributeVarchar4));
          const data3 = SrmMath.times(Number(data2), 0.01);
          const data4 = SrmMath.toFixed(data3, 2);
          that.$set(record, "attributeDecimal2", data4);
        },
      }
    );
    return columns.map((item) => {
      if (item.fieldCode === "quantity") {
        return {
          ...item,
          inputChange: (value, record) => {
            const { attributeDecimal1, attributeVarchar4 } = record || {};
            const data1 = SrmMath.times(
              Number(value),
              Number(attributeDecimal1)
            );
            const data2 = SrmMath.times(
              Number(data1),
              Number(attributeVarchar4)
            );
            const data3 = SrmMath.times(Number(data2), 0.01);
            const data4 = SrmMath.toFixed(data3, 2);
            that.$set(record, "attributeDecimal2", data4);
          },
        };
      }
      return item;
    });
  }
  return columns;
};

const getCuxLineDetailColumns = (columns) => columns;

export { getCUXLineColumns, getCuxLineDetailColumns };
