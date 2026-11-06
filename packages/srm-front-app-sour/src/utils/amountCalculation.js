// import { isNumber } from "lodash";
import BigNumber from "bignumber.js";
import { SrmMath } from "srm-mobile-ui";

/**
 * 判断是不是 NaN
 * @param n1 string | number | BigNumber
 * @return boolean
 */

export const validNaN = function validNaN(n1) {
  return (BigNumber.isBigNumber(n1) ? n1 : new BigNumber(n1)).isNaN();
};

/**
 * 判断是不是 isInfinity
 * @param n1 string | number | BigNumber
 * @return boolean
 */

/**
 * 此工具类废弃，改为平台模块工具函数
 * this.$options.filters["amountCalculation"](COMMONS) || {};
 * 
 * 金额计算逻辑
 * @param {{hasTax: boolean, hasMount: boolean, options:{ taxUnitPrice: number, netUnitPrice: number, quantity:number, each: number, taxRate:number, financialPrecision:number, defaultPrecision:number, }}}
 * @param options.hasTax {boolean} 基准价类型是否为含税单价
 * @param options.hasMount {boolean} 单据是否有金额
 * @param options.taxUnitPrice {number}  含税单价 基准价类型为不含税单价可不传
 * @param options.netUnitPrice {number} 不含税单价 基准价类型为含税单价可不传
 * @param options.quantity {number} 数量
 * @param options.each {number} 每 不传或传null默认为1
 * @param options.taxRate {number}  税率  不传或传null默认为0
 * @param options.financialPrecision {number} 金额精度
 * @param options.defaultPrecision {number} 单位精度
 * @param options.caclRule {string} 业务规则定义 "Amount"| "Price" 默认为"Amount"
 * @param options.stageRule {string} "normal"| "asQuantity" | "asPrice" | "noQuantity" 默认为"normal"
 *
 * @returns {{taxAmount: number, netAmount: number, taxQuota: number, taxUnitPrice: number, netUnitPrice: number}}
 * @returns calcTaxAmount {number} 含税金额
 * @returns calcNetAmount {number} 不含税金额
 * @returns calcTaxQuota {number} 税额
 * @returns calcTaxUnitPrice {number} 含税单价
 * @returns calcNetUnitPrice {number} 不含税单价
 *
 * @example
 * 代码来自 import { amountCalculation } from "srm-front-boot/lib/utils/utils";
 */

export function amountCalculation(options) {
  const _option = options || {};
  const {
    hasTax,
    hasMount,
    quantity,
    each = 1,
    taxRate = 0,
    caclRule = "Amount",
    financialPrecision = 10,
    defaultPrecision = 10,
    stageRule = "normal",
  } = _option;

  const getBigNumber = (val) =>
    val && !SrmMath.isZero(val) && !validNaN(val) ? new BigNumber(val) : val;
  const isValidNum = (num) => !validNaN(num) && !SrmMath.isInfinity(num);
  const toFixedNum = (num, precision) => new BigNumber(SrmMath.toFixed(num, Number(precision)));

  const bigQuantity = getBigNumber(quantity);
  const bigEach = getBigNumber(each || 1);
  const bigTaxRate = getBigNumber(taxRate || 0);
  const _taxRate = SrmMath.div(bigTaxRate, 100);

  if (stageRule === "noQuantity") {
    const { taxUnitPrice } = _option;
    const bigTaxUnitPrice = getBigNumber(taxUnitPrice);
    if (hasTax) {
      if (!isValidNum(bigTaxUnitPrice)) {
        return {};
      }

      const calcNetUnitPrice = toFixedNum(
        SrmMath.div(bigTaxUnitPrice, SrmMath.plus(1, _taxRate)),
        defaultPrecision
      );
      return { calcNetUnitPrice };
    }

    const { netUnitPrice } = _option;
    const bigNetUnitPrice = getBigNumber(netUnitPrice);
    if (!isValidNum(bigNetUnitPrice)) {
      return {};
    }
    const calcTaxUnitPrice = toFixedNum(
      SrmMath.times(bigNetUnitPrice, SrmMath.plus(1, _taxRate)),
      defaultPrecision
    );
    return { calcTaxUnitPrice };
  } else if (stageRule === "normal") {
    if (hasTax) {
      let calcNetAmount;
      let calcNetUnitPrice;
      const { taxUnitPrice } = _option;
      const bigTaxUnitPrice = getBigNumber(taxUnitPrice);

      if (!isValidNum(bigQuantity) || !isValidNum(bigTaxUnitPrice)) {
        return {};
      }
      if (hasMount) {
        const calcTaxAmount = toFixedNum(
          SrmMath.div(SrmMath.times(bigTaxUnitPrice, bigQuantity), bigEach),
          financialPrecision
        );
        const calcTaxQuota = toFixedNum(
          SrmMath.times(SrmMath.div(calcTaxAmount, SrmMath.plus(1, _taxRate)), _taxRate),
          financialPrecision
        );
        if (caclRule === "Amount") {
          calcNetAmount = toFixedNum(SrmMath.minus(calcTaxAmount, calcTaxQuota), financialPrecision);
          calcNetUnitPrice = SrmMath.isZero(calcNetAmount) ? 0 : toFixedNum(
            SrmMath.times(SrmMath.div(calcNetAmount, bigQuantity), bigEach),
            defaultPrecision
          );
        } else {
          calcNetUnitPrice = toFixedNum(
            SrmMath.div(bigTaxUnitPrice, SrmMath.plus(1, _taxRate)),
            defaultPrecision
          );
          calcNetAmount = toFixedNum(
            SrmMath.div(SrmMath.times(calcNetUnitPrice, bigQuantity), bigEach),
            financialPrecision
          );
        }
        return {
          calcTaxAmount,
          calcTaxQuota,
          calcNetAmount,
          calcNetUnitPrice: SrmMath.isZero(taxRate) ? taxUnitPrice : calcNetUnitPrice,
        };
      }

      if (SrmMath.isZero(taxRate)) {
        return { calcNetUnitPrice: taxUnitPrice };
      }
      calcNetUnitPrice = toFixedNum(
        SrmMath.div(bigTaxUnitPrice, SrmMath.plus(1, _taxRate)),
        defaultPrecision
      );
      return { calcNetUnitPrice: SrmMath.isZero(taxRate) ? taxUnitPrice : calcNetUnitPrice };
    }

    let calcTaxAmount;
    let calcTaxUnitPrice;
    const { netUnitPrice } = _option;
    const bigNetUnitPrice = getBigNumber(netUnitPrice);
    if (!isValidNum(bigQuantity) || !isValidNum(bigNetUnitPrice)) {
      return {};
    }

    if (hasMount) {
      const calcNetAmount = toFixedNum(
        SrmMath.div(SrmMath.times(bigNetUnitPrice, bigQuantity), bigEach),
        financialPrecision
      );
      const calcTaxQuota = toFixedNum(
        SrmMath.times(calcNetAmount, _taxRate),
        financialPrecision
      );
      if (caclRule === "Amount") {
        calcTaxAmount = toFixedNum(SrmMath.plus(calcNetAmount, calcTaxQuota), financialPrecision);
        calcTaxUnitPrice = SrmMath.isZero(calcTaxAmount) ? 0 : toFixedNum(
          SrmMath.times(SrmMath.div(calcTaxAmount, bigQuantity), bigEach),
          defaultPrecision
        );
      } else {
        calcTaxUnitPrice = toFixedNum(
          SrmMath.times(bigNetUnitPrice, SrmMath.plus(1, _taxRate)),
          defaultPrecision
        );
        calcTaxAmount = toFixedNum(
          SrmMath.div(SrmMath.times(calcTaxUnitPrice, bigQuantity), bigEach),
          financialPrecision
        );
      }
      return {
        calcNetAmount,
        calcTaxQuota,
        calcTaxAmount,
        calcTaxUnitPrice: SrmMath.isZero(taxRate) ? netUnitPrice : calcTaxUnitPrice,
      };
    }

    calcTaxUnitPrice = toFixedNum(
      SrmMath.times(bigNetUnitPrice, SrmMath.plus(1, _taxRate)),
      defaultPrecision
    );
    return { calcTaxUnitPrice: SrmMath.isZero(taxRate) ? netUnitPrice : calcTaxUnitPrice };
  }
}