/*
 * @Date: 2025-04-22 15:40:33
 * @Author: LXM <xiaomei.lv@going-link.com>
 * @Version: 0.0.1
 * @Copyright: Copyright (c) 2024, Hand
 */
import { forEach, camelCase } from "lodash";
import { getRedFlag, renderRedNode } from "./utils";
import { yesOrNoRenderer } from "@/utils/renderer";

// 处理调查表模板配置查询出的属性
export const dealConfigData = (config) => {
  const { investigateConfigHeaders = [], investigateConfigLines = [] } = config;
  const configHeaders = {};
  const configList = [];
  forEach(investigateConfigHeaders, (header) => {
    const { investgCfHeaderId } = header;
    configHeaders[investgCfHeaderId] = header;
    configHeaders[investgCfHeaderId].lines = [];
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

export const getInvestigateColums = (config) => {
  const { lines } = config;
  const colums = lines.map((line) => {
    const { configName, fieldCode, fieldDescription, componentType } = line;
    return {
      fieldCode,
      fieldName: fieldDescription,
      fieldType:fieldCode !== "attachment" && componentType === "Upload" ? "UPLOAD" : "TEXT",
      render:(val, item) => {
        const getCode = () => {
          if (configName === "sslm_investg_fin_branch" && fieldCode === "regionId") {
            return "regionIdMeaning";
          } else if (configName === "sslm_investg_address" && fieldCode === "regionId") {
            return "regionPathName";
          } else if ([ "TransferLov", "ValueList", "Lov" ].includes(componentType)) {
            return `${fieldCode}Meaning`;
          }
          return null;
        };
        const code = getCode();
        let renderText = renderRedNode({ name: fieldCode, record:item, code });
        if ([ "Switch", "Checkbox", ].includes(componentType)) {
          const redFlag = getRedFlag({ name: fieldCode, record:item });
          renderText = <span style={{ color: redFlag && "red" }}>
            {yesOrNoRenderer(val)}
          </span>;
        } else if (fieldCode === "attachment") {
          // 资质附件暂无对比接口
          renderText = "-";
        }
        return renderText;
      },
    };
  });
  return colums;
};