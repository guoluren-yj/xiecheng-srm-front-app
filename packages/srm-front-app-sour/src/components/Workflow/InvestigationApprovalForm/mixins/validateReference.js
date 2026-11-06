/* eslint-disable valid-jsdoc */
// import { SrmButton, SrmFlex } from "srm-mobile-ui";
// import uuid from "uuid";
export default {
  data() {
    return {
      config: [], // 调查表配置
      // 存储【参考区间】的检验信息
      referenceRangeMessage: {},
      // 存储【参考区间】的检验字段code
      referenceRangeCode: {},
      // 存储不合符【参考区间】的字段
      referenceRangeErrorList: {},
    };
  },
  methods: {
    // 字段下划线转驼峰
    toHump(name) {
      // eslint-disable-next-line no-useless-escape
      return name.replace(/\_(\w)/g, function(all, letter) {
        return letter.toUpperCase();
      });
    },
    // 区间判断
    inRange(x, min, max) {
      return Boolean(x > min && x < max);
    },
    /**
     * 处理config
     */
    dealConfigData(config) {
      const { configIgnore = "" } = this;
      const configHeaders = {};
      const configLines = {};
      const headers = [];
      // 处理头 处理 tab
      config.investigateConfigHeaders && config.investigateConfigHeaders.forEach((header) => {
        if (header.configName !== configIgnore) {
          configHeaders[header.investgCfHeaderId] = header;
          configHeaders[header.investgCfHeaderId].lines = [];
          headers.push(header);
        }
      });

      // 处理行 处理字段
      config.investigateConfigLines && config.investigateConfigLines.forEach((line) => {
        configLines[line.investgCfLineId] = line;
        configLines[line.investgCfLineId].fieldCode = line.fieldCode;
        const lines =
        configHeaders[line.investgCfHeaderId] && configHeaders[line.investgCfHeaderId].lines;
        if (lines) {
          lines.push(line);
          configLines[line.investgCfLineId].props = [];
        }
      });

      // 处理属性
      config.investigateConfigComponents && config.investigateConfigComponents.forEach((componentProp) => {
        const props =
        configLines[componentProp.investgCfLineId] &&
        configLines[componentProp.investgCfLineId].props;
        if (props) {
          props.push(componentProp);
        }
      });
      return headers;
    },
    // 调查表信息
    /**
   * 校验后端返回的数据是否在指定区间内
   * @param {*} referenceRange 模板配置的区间值
   * @param {*} dataSourceRange 后端数据返回的区间值
   */
    validateRange({ referenceRange, dataSourceRange }) {
      let validateFlag = true;
      // 区间值
      const rangeData = referenceRange.slice(1, -1)?.split(",");
      const leftNum = Number(rangeData[0]);
      const rightNum = Number(rangeData[1]);
      // 左操作符
      const leftOperator = referenceRange.substr(0, 1);
      // 右操作符
      const rightOperator = referenceRange.substr(-1, 1);
      switch (leftOperator) {
      case "(":
        if (rightOperator === ")") {
          validateFlag = this.inRange(dataSourceRange, leftNum, rightNum);
        }
        if (rightOperator === "]") {
          validateFlag = this.inRange(dataSourceRange, leftNum, rightNum + 0.1);
        }
        break;
      case "[":
        if (rightOperator === ")") {
          validateFlag = this.inRange(dataSourceRange, leftNum + 0.1, rightNum);
        }
        if (rightOperator === "]") {
          validateFlag = this.inRange(dataSourceRange, leftNum + 0.1, rightNum + 0.1);
        }
        break;
      default:
        break;
      }
      return validateFlag;
    },
    /**
   * 校验【数值】类型字段是否在模板设定的【参考区间】内
   * @param {*} data 当前页签数据源
   * @param {*} configName 当前页签的configName
   */
    validateReferenceRange(data, configName) {
      // if (configName !== "sslmInvestgProservice") {
      //   return;
      // }
      const { config } = this;
      // console.log("config:", config);
      // 获取当前页签配置项
      const currentTabConfig = config.filter((n) => n.configName === configName)[0] || {};
      // console.log("currentTabConfig:", currentTabConfig);
      const { lines = [] } = currentTabConfig;
      // 存储当前页签的props属性
      const currentAttribute = {};
      // console.log("lines:", lines);
      // eslint-disable-next-line no-unused-vars
      for (const line of lines) {
        const { fieldCode, fieldDescription, props } = line;
        // eslint-disable-next-line no-unused-vars
        for (const prop of props) {
          currentAttribute[fieldCode] = {
            ...currentAttribute[fieldCode],
            fieldCode,
            fieldDescription,
            [prop.attributeName]: prop.attributeValue,
          };
        }
      }
      this.referenceRangeMessage[configName] = [];
      this.referenceRangeErrorList[configName] = [];
      this.referenceRangeCode[configName] = [];
      // console.log("currentAttribute:", currentAttribute);
      // 属性维度的遍历
      // eslint-disable-next-line no-unused-vars
      for (const attribute in currentAttribute) {
        if (Object.hasOwnProperty.call(currentAttribute, attribute)) {
          const attributeElement = currentAttribute[attribute];
          const { referenceRange, validateRules, fieldCode, fieldDescription } = attributeElement;
          const toHumpFieldCode = this.toHump(fieldCode);
          if (validateRules === "weakCheck" && referenceRange) {
            if (Array.isArray(data)) {
              // 表格数据，有一行不满足区间范围就提示
              // eslint-disable-next-line no-loop-func
              data.forEach((n) => {
                const validateFlag = this.validateRange({
                  referenceRange,
                  dataSourceRange: n[toHumpFieldCode],
                });
                if (!validateFlag) {
                  const message = `【${fieldDescription}】${this.$T("sslm.investigCorrelat.model.validate.referenceRange", [ referenceRange ]).$D("维护的数值不在【${referenceRange}参考区间】内，请审核是否符合要求")}`;
                  if (!this.referenceRangeCode[configName].includes(fieldCode)) {
                    this.referenceRangeMessage[configName].push(message);
                    this.referenceRangeCode[configName].push(fieldCode);
                  }
                }
              });
              // console.log("referenceRangeMessage1:", this.referenceRangeMessage);
            } else {
              const validateFlag = this.validateRange({
                referenceRange,
                dataSourceRange: data[toHumpFieldCode],
              });
              if (!validateFlag) {
                const message = `【${fieldDescription}】${this.$T("sslm.investigCorrelat.model.validate.referenceRange", [ referenceRange ]).$D("维护的数值不在【${referenceRange}参考区间】内，请审核是否符合要求")}`;
                this.referenceRangeMessage[configName].push(message);
                this.referenceRangeErrorList[configName].push(fieldCode);
                this.referenceRangeCode[configName].push(fieldCode);
              }
              // console.log("referenceRangeMessage2:", this.referenceRangeMessage);
              // console.log("referenceRangeErrorList2:", this.referenceRangeErrorList);
            }
          }
        }
      }
    }
  }
};

