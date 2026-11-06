import { isString, isObject } from "lodash";

export function transformSupplierData(mergeSupplierId, { supCompanyPropCode = "supplierCompanyId", supPropCode = "supplierId" } = {}) {
  if (!mergeSupplierId || typeof mergeSupplierId !== "string") {
    return {};
  }
  const [ supplierCompanyId, supplierId ] = mergeSupplierId.split("_");
  let tempUndefined;
  return {
    [supCompanyPropCode]: supplierCompanyId || tempUndefined,
    [supPropCode]: supplierId || tempUndefined,
  };
}

export function transformSearchBarData(dataSet, params, pathParams, bodyParameter) {
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
    // 供应商字段默认虚拟字段，特殊处理
    if (key === "supplierCompanyId_supplierId") {
      Object.assign(params, transformSupplierData(value));
      delete params[key];
      continue;
    }
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
  const readMethod = dataSet.transport?.read?.method;
  const postFlag = isString(readMethod) ? readMethod.toUpperCase() === "POST" : false;
  if (postFlag && isObject(bodyParameter)) {
    Object.assign(bodyParameter, params);
  }
}