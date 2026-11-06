/*
 * @Description:
 * @Date: 2022-09-27 10:19:24
 * @Author: MYT<yitian.mao@going-link.com>
 * @Version: 1.0.0
 * @Copyright: Copyright (c) 2021, ZhenYun
 */
import { $T } from "srm-mobile-ui";

// 根据双单位配置开启返回显示名称 开启:基本单位，基本数量, 不开启:单位,数量
export function getDynamicLabel(config = 0, field) {
  switch (field) {
  case "quantity":
    return !config ?
      $T("spcm.common.model.common.quantity").$D("数量") :
      $T("spcm.common.model.common.base.quantity").$D("基本数量");
  case "taxIncludedUnitPrice":
    return !config ?
      $T("spcm.common.model.common.inculdeTaxUnitPrice").$D("原币单价(含税)") :
      $T("spcm.common.model.common.base.inculdeTaxUnitPrice").$D("基本原币单价(含税)");
  case "unitPrice":
    return !config ?
      $T("spcm.common.model.common.unitPrice").$D("原币单价(不含税)") :
      $T("spcm.common.model.common.base.unitPrice").$D("基本原币单价(不含税)");
  case "purchasePriceNoTax":
    return !config ?
      $T("spcm.common.model.common.purchasePriceNoTax").$D("进价(不含税)") :
      $T("spcm.common.model.common.base.purchasePriceNoTax").$D("基本进价(不含税)");
  case "purchasePriceTax":
    return !config ?
      $T("spcm.common.model.common.purchasePriceTax").$D("进价(含税)") :
      $T("spcm.common.model.common.base.purchasePriceTax").$D("基本进价(含税)");
  default:
    return !config ?
      $T("spcm.common.model.common.unit").$D("单位") :
      $T("spcm.common.model.common.base.unit").$D("基本单位");
  }
}
