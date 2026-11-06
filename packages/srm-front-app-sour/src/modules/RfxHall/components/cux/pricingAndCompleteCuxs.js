/**
 * 核价，核价明细，核价审批 二开函数，按照租户编码判断二开逻辑
 * */

import { $T, SrmTextarea } from "srm-mobile-ui";

import ShanyingSupplierTable from "@/modules/RfxHall/components/cux/ShanyingSupplierTable";

import {
  getSilicaCheckPriceBaseFormFieldsCux,
  getCUXPricingBasicInfoColumnsSilica,
} from "./silicaCheckPriceCUX";

import { open3SBIOComparisonPop } from "./3SBIOCUX/3SBIOCheckPriceCUX";

import { getCUXPricingBasicInfoColumnsAKBL } from "./AKBLCUX/AKBLCheckPriceCUX";

const getTenantNum = () => window.localStorage.getItem("tenantNum");

// 核价基础信息
const getCUXPricingBasicInfoColumns = (options) => {
  let cuxField = [];
  const currentTenantNum = getTenantNum();

  // 硅翔 src-60130
  if (currentTenantNum === "SRM-SILICA") {
    cuxField = getSilicaCheckPriceBaseFormFieldsCux(options);
  }

  // shanying src-58086
  if (currentTenantNum === "SRM-SHANYING") {
    cuxField = [
      {
        formRow: 80,
        fieldCode: "attributeLongtext50",
        fieldName: $T("sscux.ssrc.view.shanying.supplierListCux").$D("供应商列表"),
        render: (_, record) => {
          const { sourceMethod } = record || {};
          if (sourceMethod && sourceMethod !== "INVITE") {
            return "-";
          }
          return (
            <ShanyingSupplierTable
              record={record}
              name="attributeLongtext50"
            />
          );
        },
      },
    ];
  }

  // 3SBIO cdp-132271
  if (currentTenantNum === "SRM-3SBIO") {
    cuxField = options?.from === "compare" ? [
      {
        formRow: 80,
        fieldCode: "_cuxChangeComparison",
        fieldName: $T("sscux.ssrc.view.3sbio.cuxChangeComparison").$D("变更对比"),
        render: (_, record) => {
          const { rfxHeaderId, rfxId } = record || {};
          return (
            <srm-button type="primary" size="small" plain rect disabled={!(rfxHeaderId || rfxId)} onClick={() => open3SBIOComparisonPop(rfxId || rfxHeaderId, options?.that)}>{ $T("ssrc.inquiryHall.view.message.button.view").$D("查看") }</srm-button>
          );
        },
      },
    ] : [];
  }

  return cuxField;
};

// 核价基础信息
const getNewCUXPricingBasicInfoColumns = (fields, options) => {
  let cuxField = fields || [];
  const currentTenantNum = getTenantNum();

  if (currentTenantNum === "SRM-AKBL") {
    cuxField = cuxField.map((field) => {
      if (field && field.fieldCode === "checkRemark") {
        return {
          ...field,
          render: (val) => {
            if (!val) {
              return "";
            }
            return (
              <SrmTextarea editor={false} autoSize={{ minRows: 1, maxRows: 10 }} value={val} />
            );
          },
        };
      }
      if (field && field.fieldCode === "checkAttachmentUuid") {
        return {
          ...field,
          showCount: true,
        };
      }
      return field;
    });
  }

  return cuxField;
};

/**
 * 核价所有表格 通用二开增加字段
 */
const getAllTabTableCommonColumnsCUX = (options) => {
  let cuxField = [];
  const currentTenantNum = getTenantNum();

  // 硅翔 src-60130
  if (currentTenantNum === "SRM-SILICA") {
    cuxField = getCUXPricingBasicInfoColumnsSilica(options);
  }

  if (currentTenantNum === "SRM-AKBL") {
    cuxField = getCUXPricingBasicInfoColumnsAKBL(options);
  }

  return cuxField;
};

export {
  getCUXPricingBasicInfoColumns,
  getAllTabTableCommonColumnsCUX,
  getNewCUXPricingBasicInfoColumns,
};
