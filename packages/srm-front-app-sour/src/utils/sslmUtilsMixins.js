/* eslint-disable valid-jsdoc */
import { $T } from "srm-mobile-ui";
export default {
  methods: {
    /**
     * 认证地区转换成中文描述
     * @param {*} domesticForeignRelation 认证地址编码
     * @return 处理值
     */
    handleCertificationArea(domesticForeignRelation) {
      //domesticForeignRelation 认证地区(境内:1 | 境外：0 | 个人：2)
      switch (Number(domesticForeignRelation)) {
      case 0:
        return $T("smbl.common.view.model.overseas").$D("境外");
      case 1:
        return $T("smbl.common.view.model.domestic").$D("境内");
      case 2:
        return $T("smbl.common.view.model.individual").$D("个人");
      default:
        break;
      }
    },
    /**
     * 经营性质处理
     * @param {*} record 当前行数据
     * @returnVal 处理值
     */
    serviceTypeMerge(record = {}) {
      //经营性质
      let businessNature = "";
      let arr = [];
      if (record.manufacturerFlag === 1) {
        arr.push($T("smbl.common.view.manufacturer").$D("制造商"));
      }
      if (record.traderFlag === 1) {
        arr.push($T("smbl.common.view.trader").$D("贸易商"));
      }
      if (record.servicerFlag === 1) {
        arr.push($T("smbl.common.view.servicer").$D("服务商"));
      }
      if (record.agentFlag === 1) {
        arr.push($T("smbl.common.view.agent").$D("代理商"));
      }
      if (record.integrationFlag === 1) {
        arr.push($T("smbl.common.view.integration").$D("集成商"));
      }
      if (record.contractorFlag === 1) {
        arr.push($T("smbl.common.view.contractor").$D("承包商"));
      }
      if (arr.length > 1) {
        businessNature = arr.join("/");
      } else if (arr.length === 1) {
        businessNature = arr[0];
      }
      return businessNature;
    },
    /**
     * 主要身份处理
     * @param {*} record 当前行数据
     * @returnVal 处理值
     */
    primaryIdentityMerge(record = {}) {
      //经营性质
      let primaryIdentity = "";
      let arr = [];
      if (record.saleFlag === 1) {
        arr.push($T("smbl.common.view.saleFlag").$D("我要销售"));
      }
      if (record.purchaseFlag === 1) {
        arr.push($T("smbl.common.view.purchaseFlag").$D("我要采购"));
      }
      if (arr.length > 1) {
        primaryIdentity = arr.join("/");
      } else if (arr.length === 1) {
        primaryIdentity = arr[0];
      }
      return primaryIdentity;
    }
  }
};
