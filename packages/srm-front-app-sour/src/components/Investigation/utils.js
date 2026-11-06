/*
 * @Date: 2024-10-15 11:38:45
 * @Author: LXM <xiaomei.lv@going-link.com>
 * @Version: 0.0.1
 * @Copyright: Copyright (c) 2021, Hand
 */
import { forEach, camelCase } from "lodash";

// 处理调查表模板配置查询出的属性
export const dealConfigData = (config) => {
  const { investigateConfigHeaders, investigateConfigLines, investigateConfigComponents } = config;
  const configHeaders = {};
  const configList = [];
  const tabValidate = {};
  const tabDescription = {};
  forEach(investigateConfigHeaders, (header) => {
    const { investgCfHeaderId, configName, validated, configDescription } = header;
    configHeaders[investgCfHeaderId] = header;
    configHeaders[investgCfHeaderId].lines = [];
    tabValidate[configName] = validated;
    tabDescription[configName] = configDescription;
    configList.push(header);
  });

  const configLines = {};
  forEach(investigateConfigLines, (line) => {
    const { investgCfHeaderId, investgCfLineId, componentType, fieldCode } = line;
    const formatFieldCode = camelCase(fieldCode);
    configLines[investgCfLineId] = line;
    configLines[investgCfLineId].fieldCode = formatFieldCode;
    configLines[investgCfLineId].props = [];
    configLines[investgCfLineId].fxProps = [];
    const lines = configHeaders[investgCfHeaderId] && configHeaders[investgCfHeaderId].lines;
    switch (formatFieldCode) {
    case "attachmentType":
      if (componentType === "ValueList") {
        configLines[investgCfLineId].componentType = "Cascader";
      }
      break;
    default:
      break;
    }
    if (lines) {
      lines.push(line);
    }
  });

  // 后端不返回组件属性为空的组件属性
  forEach(investigateConfigComponents, (prop) => {
    const { investgCfLineId } = prop;
    const props = configLines[investgCfLineId] && configLines[investgCfLineId].props;
    if (props) {
      props.push(prop);
    }
    const fieldCode =
      configLines[prop.investgCfLineId] && configLines[prop.investgCfLineId].fieldCode;
    if (fieldCode) {
      if (prop.attributeName === "toValueListFlag" && prop.attributeValue) {
        configLines[prop.investgCfLineId].componentType = "ValueList";
        switch (fieldCode) {
        case "attachmentType":
          configLines[prop.investgCfLineId].lovCode = "SPFM.COMPANY.SUB_ATTACHMENT";
          break;
        case "authenticationType":
          configLines[prop.investgCfLineId].lovCode = "SSLM.QUALIFICATION_AUTHENTICATION_TYPE";
          break;
        default:
          break;
        }
      }
    }
  });
  // 处理fx属性
  forEach(config.investigateConfigLineFXs, (fieldFxProp) => {
    const fxProps =
      configLines[fieldFxProp.investgCfLineId] && configLines[fieldFxProp.investgCfLineId].fxProps;
    if (fxProps) {
      fxProps.push(fieldFxProp);
    }
  });
  return {
    configList,
    tabValidate,
    tabDescription,
  };
};

// 获取查询、删除url
export const getOperationUrl = (configName, type = "query") => {
  switch (configName) {
  // 基础信息
  case "sslmInvestgBasic":
    return "investigate-basics";
    // 业务信息
  case "sslmInvestgBusiness":
    return "investigate-businesses";
    // 产品及服务
  case "sslmInvestgProservice":
    return type === "query" ? "investigate-proservices/page" : "investigate-proservices";
    // 供应商分类
  case "sslmInvestgSupplierCate":
    return "investg-supplier-cates";
    // 近三年财务状况
  case "sslmInvestgFin":
    return "investigate-finances";
    // 分支机构
  case "sslmInvestgFinBranch":
    return "investigate-finances-branchs";
    // 资质信息
  case "sslmInvestgAuth":
    return "investigate-authes";
    // 联系人信息
  case "sslmInvestgContact":
    return "investigate-contacts";
    // 地址信息
  case "sslmInvestgAddress":
    return "investigate-addresses";
    // 开户行信息
  case "sslmInvestgBankAccount":
    return "investigate-bank-accounts";
    // 主要客户情况
  case "sslmInvestgCustomer":
    return "investigate-customers";
    // 分供方情况
  case "sslmInvestgSubSupplier":
    return "investigate-sub-suppliers";
    // 设备信息
  case "sslmInvestgEquipment":
    return "investigate-equipments";
    // 研发能力
  case "sslmInvestgRd":
    return "investigate-rds";
    // 生产能力
  case "sslmInvestgProduce":
    return "investigate-produces";
    // 质保能力
  case "sslmInvestgQa":
    return "investigate-qas";
    // 售后服务
  case "sslmInvestgCustservice":
    return "investigate-custservices";
    // 附件信息
  case "sslmInvestgAttachment":
    return "investigate-attachments";
    // 预留表格页签1
  case "sslmInvestgReserve1":
    return "investg-reserve1s";
    // 预留表格页签2
  case "sslmInvestgReserve2":
    return "investg-reserve2s";
  // 预留表格页签3
  case "sslmInvestgReserve5":
    return "investg-reserve5s";
    // 预留表格页签4
  case "sslmInvestgReserve6":
    return "investg-reserve6s";
    // 预留表格页签5
  case "sslmInvestgReserve7":
    return "investg-reserve7s";
    // 预留表格页签6
  case "sslmInvestgReserve8":
    return "investg-reserve8s";
    // 预留表格页签7
  case "sslmInvestgReserve9":
    return "investg-reserve9s";
    // 预留表单页签1
  case "sslmInvestgReserve3":
    return "investg-reserve3s";
    // 预留表单页签2
  case "sslmInvestgReserve4":
    return "investg-reserve4s";
    // 预留表单页签3
  case "sslmInvestgReserve10":
    return "investg-reserve10s";
    // 预留表单页签4
  case "sslmInvestgReserve11":
    return "investg-reserve11s";
    // 预留表单页签5
  case "sslmInvestgReserve12":
    return "investg-reserve12s";
    // 预留表单页签6
  case "sslmInvestgReserve13":
    return "investg-reserve13s";
    // 预留表单页签7
  case "sslmInvestgReserve14":
    return "investg-reserve14s";
  default:
    return "";
  }
};

// 判断哪些是form
export const questionnaireForm = {
  sslmInvestgBasic: true, // 基本信息
  sslmInvestgBusiness: true, // 业务信息
  sslmInvestgRd: true, // 研发能力
  sslmInvestgProduce: true, // 生产能力
  sslmInvestgQa: true, // 质保能力
  sslmInvestgCustservice: true, // 售后服务
  sslmInvestgReserve3: true, // 预留表单1
  sslmInvestgReserve4: true, // 预留表单2
  sslmInvestgReserve10: true, // 预留表单3
  sslmInvestgReserve11: true, // 预留表单4
  sslmInvestgReserve12: true, // 预留表单5
  sslmInvestgReserve13: true, // 预留表单6
  sslmInvestgReserve14: true, // 预留表单7
};

// 调查表页签configName
export const questionnaireConfigName = [
  "sslmInvestgBasic",
  "sslmInvestgBusiness",
  "sslmInvestgProservice",
  "sslmInvestgSupplierCate",
  "sslmInvestgFin",
  "sslmInvestgFinBranch",
  "sslmInvestgAuth",
  "sslmInvestgContact",
  "sslmInvestgAddress",
  "sslmInvestgBankAccount",
  "sslmInvestgCustomer",
  "sslmInvestgSubSupplier",
  "sslmInvestgEquipment",
  "sslmInvestgRd",
  "sslmInvestgProduce",
  "sslmInvestgQa",
  "sslmInvestgCustservice",
  "sslmInvestgAttachment",
  "sslmInvestgReserve1",
  "sslmInvestgReserve2",
  "sslmInvestgReserve3",
  "sslmInvestgReserve4",
  "sslmInvestgReserve5",
  "sslmInvestgReserve6",
  "sslmInvestgReserve7",
  "sslmInvestgReserve8",
  "sslmInvestgReserve9",
  "sslmInvestgReserve10",
  "sslmInvestgReserve11",
  "sslmInvestgReserve12",
  "sslmInvestgReserve13",
  "sslmInvestgReserve14",
];