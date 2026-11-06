/*
 * @Date: 2024-03-12 11:42:39
 * @Author: LXM <xiaomei.lv@going-link.com>
 * @Version: 0.0.1
 * @Copyright: Copyright (c) 2021, Hand
 */
import { forEach, camelCase } from "lodash";

// 调查表表单类型
export const investigateForm = [
  "sslmInvestgBasic", // 基本信息
  "sslmInvestgBusiness", // 业务信息
  "sslmInvestgRd", // 研发能力
  "sslmInvestgProduce", // 生产能力
  "sslmInvestgQa", // 质保能力
  "sslmInvestgCustservice", // 售后服务
  "sslmInvestgReserve3", // 预留表单1
  "sslmInvestgReserve4", // 预留表单2
  "sslmInvestgReserve10", // 预留表单3
  "sslmInvestgReserve11", // 预留表单4
  "sslmInvestgReserve12", // 预留表单5
  "sslmInvestgReserve13", // 预留表单6
  "sslmInvestgReserve14", // 预留表单7
];

// 处理调查表模板配置查询出的属性
export const dealConfigData = (config) => {
  const { investigateConfigHeaders = [], investigateConfigLines = [] } = config;
  const configHeaders = {};
  const configList = [];
  forEach(investigateConfigHeaders, (header) => {
    const { investgCfHeaderId } = header;
    configHeaders[investgCfHeaderId] = header;
    configHeaders[investgCfHeaderId].lines = [];
    header.type = investigateForm.includes(header.configName) ? "FORM" : "LIST";
    configList.push(header);
  });

  const configLines = {};
  forEach(investigateConfigLines, (line) => {
    const { investgCfHeaderId, investgCfLineId, fieldCode } = line;
    const formatFieldCode = camelCase(fieldCode);
    configLines[investgCfLineId] = line;
    configLines[investgCfLineId].fieldCode = formatFieldCode;
    const lines = configHeaders[investgCfHeaderId] && configHeaders[investgCfHeaderId].lines;
    if (lines) {
      lines.push(line);
    }
  });

  return configList;
};