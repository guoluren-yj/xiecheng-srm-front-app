/*
 * @Date: 2024-03-12 11:39:13
 * @Author: LXM <xiaomei.lv@going-link.com>
 * @Version: 0.0.1
 * @Copyright: Copyright (c) 2021, Hand
 */
import { $T } from "srm-mobile-ui";

import { getRedFlag, renderRedNode, renderUpdateTag } from "../utils/utils";
import { investigateForm } from "../utils/investigate";

import { yesOrNoRenderer } from "@/utils/renderer";

export const getInvestigateDS = (config) => {
  const { lines } = config;
  return {
    editable: false,
    enableQuery: false,
    paging: false,
    fields: lines.map((line) => ({
      fieldCode:line.fieldCode,
      fieldName:  line.fieldDescription,
      fieldType:line.componentType === "Upload" ? "UPLOAD" : "TEXT",
    })),
  };
};

export const getInvestigateColums = (config, viewChange, onAttachment) => {
  const { lines, configName: formatConfigName } = config;
  const colums = lines.map((line, index) => {
    const { configName, fieldCode, fieldDescription, componentType } = line;
    // 产品及服务附件特殊处理
    if (formatConfigName === "sslmInvestgProservice" && fieldCode === "attachment") {
      return {
        fieldCode,
        fieldName: fieldDescription,
        fieldType: "TEXT",
        render:(val, record) => <a style={{ color: "var(--font-color-primary)" }} onClick={(e) => {
          e.stopPropagation();
          onAttachment(record);
        }}>{$T("hipspfm.common.button.viewAttachments").$D("查看附件")}</a>,
      };
    }
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
        // 全部页签第一个字段展示tag，仅变更表单不展示tag
        if (index === 0) {
          if (!viewChange || !investigateForm.includes(formatConfigName)) {
            return <SrmListHeader showOpenTag={false}>
              <span style={{ fontWeight:400 }}>{renderText}</span>
              <span slot="right" >{renderUpdateTag(item, formatConfigName)}</span>
            </SrmListHeader>;
          }
        }
        return renderText;
      },
      visible: (val, item) => {
        // 表单隐藏未变更的字段
        if (viewChange && investigateForm.includes(formatConfigName)) {
          let changeFlag = getRedFlag({ name: fieldCode, record:item });
          return changeFlag;
        }
        return true;
      },
    };
  });
  return colums;
};

