import {
  take,
  isNil,
  isObject,
  isArray,
  isString,
  isFunction,
} from "lodash";
import { $T, SrmMath, SrmUtil } from "srm-mobile-ui";

export const PRIVATE_BUCKET = "private-bucket";
export const BUCKET_DIRECTORY = "payment-workbench";

export function formatListColumns(fieldsList, options = {}) {
  const { endRow = 10, showLabelTop, editorFlag = false, onItemClick } = options;
  const filterList = fieldsList.filter((item) => item);
  const takeList = take(filterList, endRow).reduce((total, item, formRow) => {
    const currentList = [];
    if (isArray(item)) {
      item.forEach((childItem, formCol) => {
        if (isObject(childItem)) {
          currentList.push({ formRow, formCol, ...childItem });
        } else if (isString(childItem)) {
          currentList.push({ formRow, formCol, fieldCode: childItem });
        }
      });
    } else if (isObject(item)) {
      currentList.push({ formRow, ...item });
    } else if (isString(item)) {
      if (formRow === 0 && showLabelTop?.header !== false) {
        currentList.push({
          formRow,
          fieldCode: item,
          fieldType: "EMPTY",
          render: (value, _, field) => {
            const content = showLabelTop ?
              `${field.fieldName}：${value || "-"}` :
              value || "-";
            return <SrmListHeader>{content}</SrmListHeader>;
          },
        });
      } else {
        currentList.push({ formRow, fieldCode: item });
      }
    }
    return total.concat(currentList);
  }, []);
  if (isFunction(onItemClick) && filterList.length > endRow) {
    takeList.push({
      fieldCode: "handleMore",
      fieldType: "EMPTY",
      render: () =>
        <div style={{ width: "calc(100% + 30px)", margin: "0 -15px" }}>
          <srm-flex justify="end" align="center" style={{ padding: "20px 15px 0 0", borderTop: "1px solid #E9E9E9" }}>
            <SrmButton fill onClick={onItemClick}>
              {editorFlag ?
                $T("smbl.common.view.button.editMore").$D("编辑更多") :
                $T("smbl.common.view.button.viewMore").$D("查看更多")
              }
            </SrmButton>
          </srm-flex>
        </div>
    });
  }
  return takeList;
}
export function formatDetailColumns(fieldsList) {
  const filterList = fieldsList.filter((item) => item && item !== "selectBox");
  const newList = filterList.reduce((total, item) => {
    const currentList = [];
    if (isArray(item)) {
      item.forEach((childItem) => {
        if (isObject(childItem)) {
          currentList.push(item);
        } else if (isString(childItem)) {
          currentList.push({ fieldCode: childItem });
        }
      });
    } else if (isObject(item)) {
      currentList.push(item);
    } else if (isString(item)) {
      currentList.push({ fieldCode: item });
    }
    return total.concat(currentList);
  }, []);
  return newList;
}

export function formatColumns(fieldsList, options = {}) {
  const { takeFlag, editorFlag = false } = options;
  const newList = takeFlag ? formatListColumns(fieldsList, options) : formatDetailColumns(fieldsList, options);
  if (editorFlag === false) {
    return newList.map((item) => ({ editor: false, disabled: true, ...item }));
  }
  return newList;
}

export function transformSearchBarData(dataSet, params) {
  const comparisonList = [];
  const { queryFields } = dataSet;
  // eslint-disable-next-line no-unused-vars
  for (const key in params) {
    const value = params[key];
    // 在queryFields中寻找目标字段
    const findField = queryFields.find(({ fieldCode }) => fieldCode === key);
    // 不在queryFields中的字段不处理（包含范围日期字段endDateFieldCode字段会在实体字段中处理）
    if (!findField) {
      continue;
    }
    const { fieldType, virtualFlag, selectType, endDateFieldCode, options: { multiple } = {} } = findField;
    // 虚拟字段不处理
    if (virtualFlag) {
      continue;
    } else { // 实体字段
      let comparison = "";
      // 日期范围字段
      if (selectType === "start-end" && endDateFieldCode) {
        params[`${key}_range`] = [ value, params[endDateFieldCode] ].join();
        comparison = "~";
        delete params[key];
        delete params[endDateFieldCode];
        // 多选字段
      } else if (multiple) {
        comparison = "IN";
        params[`${key}_range`] = value;
        delete params[key];
      } else {
        // 文本字段
        // eslint-disable-next-line no-undefined
        comparison = [ "TEXT", "INPUT", "INPUT_NUMBER", undefined ].includes(fieldType) ? "LIKE" : "=";
      }
      comparisonList.push(`${key}:${comparison}`);
    }
  }
  if (comparisonList.length !== 0) {
    params.customizeFilterComparison = comparisonList.join();
  }
}

export function formatNumber(value, precision) {
  if (isNil(value) || SrmMath.isZero(value)) {
    return value;
  }
  return SrmUtil.getNumberPrecision(SrmUtil.getNumberLocalized(value), precision);
}