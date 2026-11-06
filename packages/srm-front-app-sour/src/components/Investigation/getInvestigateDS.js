/*
 * @Date: 2024-03-12 11:39:13
 * @Author: LXM <xiaomei.lv@going-link.com>
 * @Version: 0.0.1
 * @Copyright: Copyright (c) 2021, Hand
 */
import { isNil } from "lodash";
import { $T, SrmUtil } from "srm-mobile-ui";

import { SRM_SSLM } from "@/utils/utils";
import { yesOrNoRenderer } from "@/utils/renderer";

import { getOperationUrl } from "./utils";

// 产品及服务的url附件
const hanldeProserviceAtt = (record, _this) => {
  _this.$showFileList({
    fileList: (record.attachment || []).map((e) => ({
      fileUrl: e.attachmentUrl,
      fileName: e.attachmentDesc,
      fileSize: e.attachmentSize,
      creationDate: e.creationDate,
      bucketName: "private-bucket",
    }))
  });
};

export const getInvestigateDS = (config, queryParameter = {}) => {
  const { lines, configName } = config;
  const interfaceName = getOperationUrl(configName);
  return {
    editable: false,
    enableQuery: false,
    pageSize:5,
    fields: lines.map((line) => ({
      fieldCode:line.fieldCode,
      fieldName:  line.fieldDescription,
      fieldType:line.componentType === "Upload" ? "UPLOAD" : "TEXT",
    })),
    queryParameter,
    transport: {
      read: {
        url: `${SRM_SSLM}/v1/${SrmUtil.getTenantId()}/${interfaceName}`,
        method: "GET",
      },
    },
  };
};

export const getInvestigateColums = (config, _this) => {
  const { lines } = config;
  const colums = lines.map((line) => {
    const { configName, fieldCode, fieldDescription, componentType } = line;
    // 产品及服务附件特殊处理
    if (configName === "sslm_investg_proservice" && fieldCode === "attachment") {
      return {
        fieldCode,
        fieldName: fieldDescription,
        fieldType: "TEXT",
        render:(val, record) => <a style={{ color: "var(--font-color-primary)" }} onClick={(e) => {
          e.stopPropagation();
          hanldeProserviceAtt(record, _this);
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
        let renderText = item[code] || item[fieldCode];
        if ([ "Switch", "Checkbox", ].includes(componentType)) {
          renderText = yesOrNoRenderer(val);
        } else if (configName === "sslm_investg_attachment" && fieldCode === "attachmentType") {
          renderText = item[`${fieldCode}Meaning`] || item[fieldCode];
        }
        return isNil(renderText) ? "-" : renderText;
      },
    };
  });
  return colums;
};

