/* eslint-disable no-useless-catch */

import {
  isEmpty,
  forEach,
} from "lodash";
import { SrmUtil } from "srm-mobile-ui";
import crypto from "crypto-js";

import { queryEnableDoubleUnit, calculateQuantity, batchBusinessRules, ssrcBatchBusinessRules, queryPrecision, queryCustomizePost } from "./api";

const { currentRoleId, id, tenantId } = SrmUtil.getUserInfo();
const storage = window.localStorage;

// 模块接口前缀
const SRM_MDM = "/smdm";
const SRM_PLATFORM = "/spfm";
const SRM_SSLM = "/sslm";
const SRM_SPUC = "/spuc";
const SRM_SQAM = "/sqam";
const SRM_SSRC = "/ssrc";
const SRM_SPCM = "/spcm";
const SRM_CUSTOMIZATION = "/scux";
const SRM_SMBL = "/smbl";
const SRM_MALL = "/smal";
const SRM_SCUX = "/scux";
const SRM_SMPC = "/smpc";
const SRM_HPFM = "/hpfm";
const SRM_MARMOT = "/marmot";

export { SRM_MDM, SRM_PLATFORM, SRM_SSLM, SRM_SPUC, SRM_SQAM, SRM_SSRC, SRM_SPCM, SRM_CUSTOMIZATION, SRM_SMBL, SRM_MALL, SRM_SCUX, SRM_SMPC, SRM_HPFM, SRM_MARMOT };

// 查询双单位是否开启
export async function queryDoubleUnit(params) {
  const { businessModule = "RFX", tenantId = storage.getItem("organizationId"), ...others } = params;
  const res = await queryEnableDoubleUnit({
    ...others,
    tenantId,
    businessModule,
  });
  if (res && !res.failed) {
    return Boolean(Number(res));
  }
  return false;
}

// 计算基本数量api
export async function calculateBasicQty(params) {
  const res = await calculateQuantity([ params ]);
  if (res && !res.failed) {
    return res[0].primaryQuantity;
  }
  // eslint-disable-next-line no-undefined
  return undefined;
}

// 查业务规则定义-批量
export const batchQueryBusinessRules = async (params = {}) => {
  const { data = [], currentOrganizationId } = params || {};
  if (isEmpty(data)) {
    return null;
  }

  const orgId = SrmUtil.getOrganizationId();

  let result = null;
  try {
    result = await batchBusinessRules({
      ...params,
      organizationId: currentOrganizationId || orgId,
    });
  } catch (e) {
    throw e;
  }

  return result;
};

// 查询业务规则定义-金额计算方式
export const amountCalcType = async (params = {}) => {
  const { organizationId: currentOrganizationId, purTenantId, supplierFlag } = params || {};
  let result = null;
  const data = [
    {
      fullPathCode: "SITE.SPFM.CALCULATION_METHOD",
      cnfParamDTOs: [ {} ],
    },
  ];

  try {
    if (supplierFlag === 0) {
      result = await batchQueryBusinessRules({ data, currentOrganizationId });
    }
    if (supplierFlag === 1) {
      const supplierData = {
        organizationId: SrmUtil.getOrganizationId(),
        data: {
          cnfParamBatchDTOS: data,
          purTenantId,
        },
      };
      result = await ssrcBatchBusinessRules(supplierData);
    }
  } catch (e) {
    throw e;
  }

  return result?.["SITE.SPFM.CALCULATION_METHOD"] || [];
};

// 查询精度
export const fetchCurrentPrecision = async (data = {}) => {
  const { currencyCodes, uomIds = [], purTenantId } = data || {};
  if (!currencyCodes && !uomIds) {
    return;
  }

  const params = {
    uomIds,
    currencyCodes,
    financialCodes: currencyCodes,
    purTenantId,
  };

  const precisionObject = {};
  try {
    let result = await queryPrecision(params);
    if (result && result.failed) {
      return;
    }

    if (isEmpty(result)) {
      return;
    }

    result.forEach((item = {}) => {
      const { precisionType, precision } = item || {};

      switch (precisionType) {
      case "NUM":
        precisionObject.uom = precision;
        break;
      case "PRICE":
        precisionObject.currency = precision;
        break;
      case "FINANCE":
        precisionObject.financial = precision;
        break;
      default:
        break;
      }
    });
  } catch (e) {
    throw e;
  }

  return precisionObject;
};

/**
 * 批量获取ds字段
 * @param {*} dataSet 数据源ds
 * @param {*} fields 要获取的字段编码数组
 * @returns
 */
export const getFields = (dataSet = {}, fields = []) => {
  const fieldList = {};
  forEach(fields, (field) => {
    const fieldValue = dataSet.current && dataSet.current.getField(`${field}`);
    fieldList[`${field}`] = fieldValue;
  });
  return fieldList;
};

/**
 * 获取个性化字段配置信息
 * targetUnitCode为空时，返回所有查询的个性化编码配置，不为空时，获取指定个性化编码属性
 * @param {*} unitCode 查询的个性化单元编码
 * @param {*} targetUnitCode 要获取的个性化单元编码
 * @returns
 */
export const getCustomizeFields = async (unitCode, targetUnitCode) => {
  let resultData = null;
  await queryCustomizePost(unitCode).then(async (res) => {
    if (targetUnitCode && res[targetUnitCode]) {
      let property = {};
      const unitCodeData = res[unitCode];
      forEach(unitCodeData.fields || [], (fiel) => {
        property[`${fiel.fieldCode}`] = fiel;
      });
      resultData = property;
    } else {
      resultData = res;
    }
  });
  return resultData;
};

// 价格库列表查询md5加密
export const encryptMd5 = (params, str) => {
  /* 如果没有 str 字段，则默认如下方式进行加密 */
  if (!str) {
    return crypto.MD5(`fadc147bab4eea6097136669a6a7bd98+${tenantId}+${id}+${currentRoleId}+${params?.templateCode}`).toString(crypto.enc.Hex);
  }
  /* 如果没有 str 字段，则按照str参数进行加密 */
  return crypto.MD5(str).toString(crypto.enc.Hex);
};
