// 校验筛选逻辑是否合法
function isErrConExpression(exp) {
  const leftBracketNum = (exp.match(/\(/g) || []).length;
  const rightBracketNum = (exp.match(/\)/g) || []).length;
  // 暂时不支持10个以上条件配置
  const ruleConNo = /\s*\d+\s*\d+\s*/g.test(exp);
  const ruleConLogic = /\s*(AND|OR)\s*(AND|OR)\s*/g.test(exp);
  const illegalChar = /^(?!AND|OR|\(|\)|\d)/g.test(exp);
  if (leftBracketNum !== rightBracketNum || ruleConNo || ruleConLogic || illegalChar) {
    return true;
  }
  return false;
}

// 条件拼接
function logicCompute(type, left, right) {
  switch (type) {
  case "=":
    return left === right;
  case ">=":
    return left >= right;
  case "<=":
    return left <= right;
  case "!=":
    return left !== right;
  case ">":
    return left > right;
  case "<":
    return left < right;
  default:
    return false;
  }
}

// 拆分条件
function calculateExpression(conditionList, { targetForm, record }) {
  const result = {};
  conditionList.forEach((i) => {
    const { conCode, sourceFieldCode = "", conExpression, targetFieldCode = "", targetValue } = i;
    let right = targetValue;
    const targetAllValue = {
      ...record,
      ...targetForm ? targetForm.getFieldsValue() : {},
    };
    const left = targetAllValue[sourceFieldCode];
    // 方便以后使用
    if (targetFieldCode) {
      right = targetAllValue[targetFieldCode];
    }
    result[conCode] = logicCompute(conExpression, left, right);
  });
  return result;
}

export function coverConfig(originConfig = {}, fieldProperty = [], config = {}) {
  const newConfig = originConfig;
  if (fieldProperty) {
    fieldProperty.forEach((i) => {
      newConfig[i.fieldPropertyCode] = Boolean(Number(i.fieldPropertyValue));
      let { conExpression = "" } = i;
      if (conExpression !== "") {
        const isErr = isErrConExpression(conExpression);
        if (!isErr) {
          const conNoReg = /(\d+)/g;
          const result = calculateExpression(i.lines || [], config);
          if ((i.lines || []).length > 0) {
            conExpression = conExpression.replace(conNoReg, (_, m) => result[m] || false);
            conExpression = conExpression.replace(/AND/g, "&&").replace(/OR/g, "||");
            // eslint-disable-next-line no-new-func
            newConfig[i.fieldPropertyCode] = new Function(`return ${conExpression};`)() ? 1 : 0;
          }
        }
      }
    });
  }
  return newConfig;
}

export function coverMobileConfig(originConfig = {}, fieldProperty = []) {
  const newConfig = originConfig;
  if (fieldProperty) {
    fieldProperty.forEach((i) => {
      newConfig[i.fieldPropertyCode] = Boolean(Number(i.fieldPropertyValue));
    });
  }
  return newConfig;
}
