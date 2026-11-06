<template>
  <div ref="purchase" class="purchase-record-approval">
    <srm-tab class="tab-view" @changeTab="changeTab">
      <srm-tab-pane :label="$T('ssrc.priceExpandStrategy.view.tab.basicInfos&quot').$D('基础信息')">
        <div style="width: 100%;" @click="showHeadDetail">
          <customize v-if="priceHead" :columns="getBaseInfoColumns" :data-source="priceHead" type="list"/>
        </div>
      </srm-tab-pane>
      <srm-tab-pane :label="$T('ssrc.inquiryHall.view.message.tab.itemsInfo').$D('物料信息')">
        <div v-for="(item, index) in materialsList" :key="index" class="materials-item" @click="showLineDetail(item)">
          <customize :columns="getMaterialItemsColumns" :data-source="item" type="list"/>
          <div class="materials-line" />
        </div>
      </srm-tab-pane>
      <srm-tab-pane :label="$T('sprm.purchaseRequest.view.message.title.furtherRelevantInformation').$D('其他相关信息')">
        <div class="other-info">
          <srm-flex direction="column" align="start" class="attachment-content">
            <srm-upload v-if="otherInfo.purchaseRecUuid"
                        class="attachment file"
                        :attachment-uuid="otherInfo.purchaseRecUuid"
                        :show-icon="false"
                        :show-count="false"
                        :desc-title="$T('smbl.common.model.purchaseInfoAttachment').$D('采购信息记录相关附件')"/>
            <srm-upload v-if="otherInfo.thirdPurchaseRecUuid"
                        class="attachment third-file"
                        :attachment-uuid="otherInfo.thirdPurchaseRecUuid"
                        :show-icon="false"
                        :show-count="false"
                        :desc-title="$T('smbl.common.model.thirtyPurchaseInfoAttachment').$D('主数据及第三方采购信息附件')"/>
          </srm-flex>
          <div class="desc">
            <div class="remark-title">{{ $T('smbl.common.view.description').$D('说明') }}</div>
            <div class="remark">{{ otherInfo.remark }}</div>
          </div>
          <div class="desc">
            <div class="remark-title">{{ $T('smbl.common.view.sysMaintainDescription').$D('系统维护需求描述') }}</div>
            <div class="remark">{{ otherInfo.demandRemark }}</div>
          </div>
          <div class="blank-view" />
        </div>
      </srm-tab-pane>
    </srm-tab>
    <srm-popup height="80%" :visible.sync="isHeadInfoShowFlag" :title="$T('smbl.common.view.headDetail').$D('表头详情')" rounded>
      <customize-detail v-if="priceHead" :columns="getHeadDetailColumns" :data-source="priceHead"/>
    </srm-popup>
    <srm-popup height="80%" :visible.sync="isLineInfoShowFlag" :title="$T('smbl.common.view.materialsDetail').$D('物料详情')" rounded>
      <customize-detail v-if="priceHead" :columns="getLineDetailColumns" :data-source="currentLineInfo"/>
    </srm-popup>
    <srm-popup height="60%" :visible.sync="isPriceLadsShowFlag" :title="$T('scux.purchaseRecordApproval.model.priceLad').$D('阶梯价')" rounded>
      <div class="price-lads-content">
        <div v-for="(priceLad, index) in priceLadsData" :key="index" class="card">
          <customize :columns="getPriceLadsColumns" :data-source="priceLad" type="list"/>
        </div>
      </div>
    </srm-popup>
  </div>
</template>

<script>
// import {
//   getPurchaseBaseInfoApi,
//   getPriceRecordMaterialInfo,
//   getPriceRecordOtherInfo,
//   getPriceLads,
// } from "../../api/JiaLanPurchaseRecordApi";
import {
  getPurchaseBaseInfoApi,
  getPriceRecordMaterialInfo,
  getPriceRecordOtherInfo,
  getPriceLads,
} from "./api/JiaLanPurchaseRecordApi";

export default {
  modules: [ "scux.purchaseRecordApproval", "smbl.common", "ssrc.priceExpandStrategy", "ssrc.inquiryHall", "sprm.purchaseRequest" ],
  name: "JIALANPurchaseRecordApproval",
  filters: {},
  props: {
    changeReqId: {
      type: String,
      default: "",
    }
  },
  data() {
    return {
      priceHead: null,
      materialsList: [],
      otherInfo: {},
      isHeadInfoShowFlag: false,
      isLineInfoShowFlag: false,
      isPriceLadsShowFlag: false,
      currentLineInfo: {},
      priceLadsData: [],
    };
  },
  computed: {
    getBaseInfoColumns() {
      let columns = [ {
        fieldType: "EMPTY",
        fieldCode: "unitName",
        langCode: "scux.purchaseRecordApproval.model.unitName",
        render: (val) => <div class="first-item">
          <span class="block"/>
          <span class="text">{this.$T("scux.purchaseRecordApproval.model.unitName").$D("提报部门")}：{val}</span>
        </div>,
      }, {
        fieldName: this.$T("scux.purchaseRecordApproval.model.createdName").$D("提报人"),
        fieldType: "TEXT",
        fieldCode: "createdName",
      }, {
        fieldName: this.$T("scux.purchaseRecordApproval.model.priceType").$D("类型"),
        fieldType: "TEXT",
        fieldCode: "priceTypeMeaning",
      }, ];

      if (this.priceHead.priceType === "MODIFY_MATERIAL" || this.priceHead.priceType === "MODIFY_NON_MATERIAL") {
        columns.push({
          fieldName: this.$T("scux.purchaseRecordApproval.model.risePriceFlag").$D("是否涨价"),
          fieldType: "TEXT",
          fieldCode: "risePriceFlagMeaning",
        });
      }
      columns.push({
        fieldName: this.$T("scux.purchaseRecordApproval.model.syncSapFlag").$D("是否录入SAP系统"),
        fieldType: "TEXT",
        fieldCode: "syncSapFlagMeaning",
      });
      columns.push({
        fieldName: this.$T("scux.purchaseRecordApproval.model.infoCategory").$D("信息类别"),
        fieldType: "TEXT",
        fieldCode: "infoCategoryMeaning",
      });
      columns.push({
        fieldName: this.$T("scux.purchaseRecordApproval.model.purchaser").$D("采购组"),
        fieldType: "TEXT",
        fieldCode: "purchaser",
      });
      columns.push({
        fieldName: this.$T("scux.purchaseRecordApproval.model.validDateFrom").$D("价格生效时间从"),
        fieldType: "TEXT",
        fieldCode: "validDateFrom",
        render: (val) => {
          if (typeof val !== "undefined" && typeof val !== "object") {
            return val.substring(0, 10);
          }
          return val;
        },
      });
      columns.push({
        fieldName: this.$T("scux.purchaseRecordApproval.model.validDateTo").$D("价格生效时间至"),
        fieldType: "TEXT",
        fieldCode: "validDateTo",
        render: (val) => {
          if (typeof val !== "undefined" && typeof val !== "object") {
            return val.substring(0, 10);
          }
          return val;
        },
      });
      columns.push({
        fieldName: this.$T("scux.purchaseRecordApproval.model.reportFlag").$D("是否已报批预审单/合同"),
        fieldType: "TEXT",
        fieldCode: "reportFlagMeaning",
      });
      columns.push({
        fieldName: this.$T("scux.purchaseRecordApproval.model.relationNum").$D("关联单据号"),
        fieldType: "TEXT",
        fieldCode: "relationNum",
      });
      if (this.priceHead.priceType === "MODIFY_MATERIAL" || this.priceHead.priceType === "MODIFY_NON_MATERIAL") {
        columns.push({
          fieldName: this.$T("scux.purchaseRecordApproval.model.executeNewPrice").$D("价格生效期内未结算采购订单是否全部执行新价格"),
          fieldType: "TEXT",
          fieldCode: "executeNewPriceMeaning",
        });
        columns.push({
          fieldName: this.$T("scux.purchaseRecordApproval.model.oldPricePoNum").$D("不执行新价格采购订单编号"),
          fieldType: "TEXT",
          fieldCode: "oldPricePoNum",
        });
      }
      return columns;
    },
    getHeadDetailColumns() {
      let isModify = this.priceHead.priceType === "MODIFY_MATERIAL" || this.priceHead.priceType === "MODIFY_NON_MATERIAL";

      const columns = [ {
        fieldName: this.$T("scux.purchaseRecordApproval.model.reqNum").$D("申请编号"),
        fieldType: "TEXT",
        fieldCode: "reqNum",
        formRow: 10,
      }, {
        fieldName: this.$T("scux.purchaseRecordApproval.model.creationDate").$D("提报日期"),
        fieldType: "TEXT",
        fieldCode: "creationDate",
        formRow: 20,
        render: (val) => {
          if (typeof val !== "undefined" && typeof val !== "object") {
            return val.substring(0, 10);
          }
          return val;
        },
      }, {
        fieldName: this.$T("scux.purchaseRecordApproval.model.unitName").$D("提报部门"),
        fieldType: "TEXT",
        fieldCode: "unitName",
        formRow: 30,
      }, {
        fieldName: this.$T("scux.purchaseRecordApproval.model.createdName").$D("提报人"),
        fieldType: "TEXT",
        fieldCode: "createdName",
        formRow: 40,
      }, {
        fieldName: this.$T("scux.purchaseRecordApproval.model.priceType").$D("类型"),
        fieldType: "TEXT",
        fieldCode: "priceTypeMeaning",
        formRow: 50,
      }, isModify ? {
        fieldName: this.$T("scux.purchaseRecordApproval.model.risePriceFlag").$D("是否涨价"),
        fieldType: "SWITCH",
        disabled: true,
        fieldCode: "risePriceFlag",
        formRow: 60,
      } : null, {
        fieldName: this.$T("scux.purchaseRecordApproval.model.syncSapFlag").$D("是否录入SAP系统"),
        fieldType: "SWITCH",
        disabled: true,
        fieldCode: "syncSapFlag",
        formRow: 70,
      }, {
        fieldName: this.$T("scux.purchaseRecordApproval.model.infoCategory").$D("信息类型"),
        fieldType: "TEXT",
        fieldCode: "infoCategoryMeaning",
        formRow: 80,
      }, {
        fieldName: this.$T("scux.purchaseRecordApproval.model.purOrganizationName").$D("采购组织"),
        fieldType: "TEXT",
        fieldCode: "purOrganizationName",
        formRow: 90,
      }, {
        fieldName: this.$T("scux.purchaseRecordApproval.model.purchaser").$D("采购组"),
        fieldType: "TEXT",
        fieldCode: "purchaser",
        formRow: 100,
      }, {
        fieldName: this.$T("scux.purchaseRecordApproval.model.validDateFrom").$D("价格生效时间从"),
        fieldType: "TEXT",
        fieldCode: "validDateFrom",
        formRow: 110,
        render: (val) => {
          if (typeof val !== "undefined" && typeof val !== "object") {
            return val.substring(0, 10);
          }
          return val;
        },
      }, {
        fieldName: this.$T("scux.purchaseRecordApproval.model.validDateTo").$D("价格生效时间至"),
        fieldType: "TEXT",
        fieldCode: "validDateTo",
        formRow: 120,
        render: (val) => {
          if (typeof val !== "undefined" && typeof val !== "object") {
            return val.substring(0, 10);
          }
          return val;
        },
      }, {
        fieldName: this.$T("scux.purchaseRecordApproval.model.reportFlag").$D("是否已报批预审单/合同"),
        fieldType: "SWITCH",
        disabled: true,
        fieldCode: "reportFlag",
        formRow: 130,
      }, {
        fieldName: this.$T("scux.purchaseRecordApproval.model.relationNum").$D("关联单据号"),
        fieldType: "TEXT",
        fieldCode: "relationNum",
        formRow: 140,
      }, isModify ? null : {
        fieldName: this.$T("scux.purchaseRecordApproval.model.maintainSourceFlag").$D("是否维护货源清单"),
        fieldType: "SWITCH",
        disabled: true,
        fieldCode: "maintainSourceFlag",
        formRow: 150,
      }, isModify ? {
        fieldName: this.$T("scux.purchaseRecordApproval.model.executeNewPrice").$D("价格生效期内未结算采购订单是否全部执行新价格"),
        fieldType: "SWITCH",
        disabled: true,
        fieldCode: "executeNewPrice",
        formRow: 160,
      } : null, isModify ? {
        fieldName: this.$T("scux.purchaseRecordApproval.model.oldPricePoNum").$D("不执行新价格采购订单编号"),
        fieldType: "TEXT",
        fieldCode: "oldPricePoNum",
        formRow: 170,
      } : null, {
        fieldName: this.$T("scux.purchaseRecordApproval.model.projectCode").$D("项目编码"),
        fieldType: "TEXT",
        fieldCode: "projectNum",
        formRow: 180,
      }, {
        fieldName: this.$T("scux.purchaseRecordApproval.model.projectWBS").$D("项目WBS"),
        fieldType: "TEXT",
        fieldCode: "wbsName",
        formRow: 190,
      }, ];

      return columns;
    },
    getMaterialItemsColumns() {
      return [ {
        fieldType: "EMPTY",
        fieldCode: "itemCode",
        render: (val) => <div class="first-item">
          <span class="block"/>
          <span class="text">{this.$T("scux.purchaseRecordApproval.model.materialsCode").$D("物料编码")}：{val}</span>
        </div>,
      }, {
        fieldName: this.$T("scux.purchaseRecordApproval.model.itemName").$D("物料名称"),
        fieldType: "TEXT",
        fieldCode: "itemName",
      }, {
        fieldName: this.$T("scux.purchaseRecordApproval.model.supplierCompanyNum").$D("供应商代码"),
        fieldType: "TEXT",
        fieldCode: "supplierCompanyNum",
      }, {
        fieldName: this.$T("scux.purchaseRecordApproval.model.supplierCompanyName").$D("供应商名称"),
        fieldType: "TEXT",
        fieldCode: "supplierCompanyName",
      }, {
        fieldName: this.$T("scux.purchaseRecordApproval.model.uomName").$D("单位"),
        fieldType: "TEXT",
        fieldCode: "uomName",
      }, {
        fieldName: this.$T("scux.purchaseRecordApproval.model.taxRate").$D("税率"),
        fieldType: "TEXT",
        fieldCode: "taxRate",
      }, {
        fieldName: this.$T("scux.purchaseRecordApproval.model.taxIncludedPrice").$D("含税单价(元)"),
        fieldType: "TEXT",
        fieldCode: "taxIncludedPrice",
      }, ];
    },
    getLineDetailColumns() {
      let columns = [ {
        fieldName: this.$T("scux.purchaseRecordApproval.model.supplierCompanyNum").$D("供应商代码"),
        fieldType: "TEXT",
        fieldCode: "supplierCompanyNum",
        formRow: 10,
      }, {
        fieldName: this.$T("scux.purchaseRecordApproval.model.supplierCompanyName").$D("供应商名称"),
        fieldType: "TEXT",
        fieldCode: "supplierCompanyName",
        formRow: 20,
      }, {
        fieldName: this.$T("scux.purchaseRecordApproval.model.itemCode").$D("物料编码"),
        fieldType: "TEXT",
        fieldCode: "itemCode",
        formRow: 30,
      }, {
        fieldName: this.$T("scux.purchaseRecordApproval.model.itemName").$D("物料名称"),
        fieldType: "TEXT",
        fieldCode: "itemName",
        formRow: 40,
      }, {
        fieldName: this.$T("scux.purchaseRecordApproval.model.specifications").$D("规格"),
        fieldType: "TEXT",
        fieldCode: "specifications",
        formRow: 50,
      }, {
        fieldName: this.$T("scux.purchaseRecordApproval.model.categoryName").$D("品类"),
        fieldType: "TEXT",
        fieldCode: "itemCategoryName",
        formRow: 60,
      }, {
        fieldName: this.$T("scux.purchaseRecordApproval.model.uomName").$D("单位"),
        fieldType: "TEXT",
        fieldCode: "uomName",
        formRow: 70,
      }, {
        fieldName: this.$T("scux.purchaseRecordApproval.model.taxRate").$D("税率"),
        fieldType: "TEXT",
        fieldCode: "taxRate",
        formRow: 80,
      }, {
        fieldName: this.$T("scux.purchaseRecordApproval.model.taxIncludedPrice").$D("含税单价"),
        fieldType: "TEXT",
        fieldCode: "taxIncludedPrice",
        formRow: 90,
      }, {
        fieldName: this.$T("scux.purchaseRecordApproval.model.ladderQuotationFlags").$D("是否阶梯价"),
        fieldType: "TEXT",
        fieldCode: "ladderQuotationFlag",
        formRow: 100,
        render: (val) => Number(val) === 1 ? this.$T("smbl.common.view.yes").$D("是") : this.$T("smbl.common.view.no").$D("否"),
      }, {
        fieldName: this.$T("scux.purchaseRecordApproval.model.priceLad").$D("阶梯价"),
        fieldType: "TEXT",
        fieldCode: "priceLad",
        formRow: 110,
        render: (val, item) => <div class="click-view-button" onClick={(e) => {
          if (!item.ladderQuotationFlag) {
            return;
          }
          this.clickToViewPriceLads(item.priceItemId);
          e.stopPropagation();
        }}>
          { item.ladderQuotationFlag ? this.$T("smbl.common.view.clickToView").$D("点击查看") : null }
        </div>,
      }, ];

      // 新建-原料
      if (this.priceHead.priceType === "NEW_MATERIAL") {
        columns.push({
          fieldName: this.$T("scux.purchaseRecordApproval.model.minOrderQuantity").$D("最小起订量"),
          fieldType: "TEXT",
          fieldCode: "minOrderQuantity",
          formRow: 111,
        });
        columns.push({
          fieldName: this.$T("scux.purchaseRecordApproval.model.purchaseCycles").$D("采购周期(天)"),
          fieldType: "TEXT",
          fieldCode: "purchaseCycle",
          formRow: 112,
        });
        columns.push({
          fieldName: this.$T("scux.purchaseRecordApproval.model.manufacturer").$D("生产商"),
          fieldType: "TEXT",
          fieldCode: "manufacturer",
          formRow: 113,
        });
        columns.push({
          fieldName: this.$T("scux.purchaseRecordApproval.model.levelRequirement").$D("级别要求"),
          fieldType: "TEXT",
          fieldCode: "levelRequirementMeaning",
          formRow: 114,
        });
        columns.push({
          fieldName: this.$T("scux.purchaseRecordApproval.model.securityLevel").$D("保密等级"),
          fieldType: "TEXT",
          fieldCode: "securityLevel",
          formRow: 115,
        });
      } else if (this.priceHead.priceType === "MODIFY_MATERIAL") {
        // 调价-原料
        columns.push({
          fieldName: this.$T("scux.purchaseRecordApproval.model.manufacturer").$D("生产商"),
          fieldType: "TEXT",
          fieldCode: "manufacturer",
          formRow: 111,
        });
        columns.push({
          fieldName: this.$T("scux.purchaseRecordApproval.model.levelRequirement").$D("级别要求"),
          fieldType: "TEXT",
          fieldCode: "levelRequirementMeaning",
          formRow: 112,
        });
        columns.push({
          fieldName: this.$T("scux.purchaseRecordApproval.model.securityLevel").$D("保密等级"),
          fieldType: "TEXT",
          fieldCode: "securityLevel",
          formRow: 113,
        });
        columns.push({
          fieldName: this.$T("scux.purchaseRecordApproval.model.lastPurPrices").$D("原单价"),
          fieldType: "TEXT",
          fieldCode: "lastPurPrices",
          formRow: 114,
        });
        columns.push({
          fieldName: this.$T("scux.purchaseRecordApproval.model.compares").$D("阶梯价对比"),
          fieldType: "TEXT",
          fieldCode: "compares",
          formRow: 115,
          render: () => this.$T("scux.purchaseRecordApproval.model.comparesDetail").$D("详情请在电脑端查看"),
        });
      } else if (this.priceHead.priceType === "NEW_NON_MATERIAL") {
        // 新建-非原料
        columns.push({
          fieldName: this.$T("scux.purchaseRecordApproval.model.minOrderQuantity").$D("最小起订量"),
          fieldType: "TEXT",
          fieldCode: "minOrderQuantity",
          formRow: 111,
        });
        columns.push({
          fieldName: this.$T("scux.purchaseRecordApproval.model.purWorthCode").$D("采购价值代码"),
          fieldType: "TEXT",
          fieldCode: "purWorthCode",
          formRow: 112,
        });
        columns.push({
          fieldName: this.$T("scux.purchaseRecordApproval.model.purchaseCycles").$D("采购周期(天)"),
          fieldType: "TEXT",
          fieldCode: "purchaseCycle",
          formRow: 113,
        });
        columns.push({
          fieldName: this.$T("scux.purchaseRecordApproval.model.retailPrice").$D("零售定价"),
          fieldType: "TEXT",
          fieldCode: "retailPrice",
          formRow: 114,
        });
      } else if (this.priceHead.priceType === "MODIFY_NON_MATERIAL") {
        // 调价-非原料
        columns.push({
          fieldName: this.$T("scux.purchaseRecordApproval.model.lastPurPrices").$D("原单价"),
          fieldType: "TEXT",
          fieldCode: "lastPurPrices",
          formRow: 111,
        });
        columns.push({
          fieldName: this.$T("scux.purchaseRecordApproval.model.compares").$D("阶梯价对比"),
          fieldType: "TEXT",
          fieldCode: "compares",
          formRow: 112,
          render: () => this.$T("scux.purchaseRecordApproval.model.comparesDetail").$D("详情请在电脑端查看"),
        });
      }
      columns.push({
        fieldName: this.$T("scux.purchaseRecordApproval.model.lineRemark").$D("备注"),
        fieldType: "TEXT",
        fieldCode: "lineRemark",
        formRow: 120,
      });
      columns.push({
        fieldName: this.$T("scux.purchaseRecordApproval.model.sourceNum").$D("寻源单号"),
        fieldType: "TEXT",
        fieldCode: "sourceNum",
        formRow: 130,
      });

      return columns;
    },
    getPriceLadsColumns() {
      let columns = [ {
        fieldName: this.$T("scux.purchaseRecordApproval.model.priceLibrary.ladderLineNum").$D("行号"),
        fieldType: "TEXT",
        fieldCode: "ladderLineNum",
      }, {
        fieldName: this.$T("scux.purchaseRecordApproval.model.priceLibrary.ladderFrom").$D("数量从(>=)"),
        fieldType: "TEXT",
        fieldCode: "ladderFrom",
      }, {
        fieldName: this.$T("scux.purchaseRecordApproval.model.priceLibrary.ladderTo").$D("数量至(<)"),
        fieldType: "TEXT",
        fieldCode: "ladderTo",
      }, {
        fieldName: this.$T("scux.purchaseRecordApproval.model.priceLibrary.ladderPrice").$D("含税单价"),
        fieldType: "TEXT",
        fieldCode: "ladderPrice",
      }, ];

      return columns;
    }
  },
  async mounted() {
    this.priceHead = await getPurchaseBaseInfoApi(this.changeReqId);
    let { content = [] } = await getPriceRecordMaterialInfo(this.changeReqId);

    this.materialsList = content;
    this.otherInfo = await getPriceRecordOtherInfo(this.changeReqId);
    this.resizePurchaseContent();
    this.$emit(
      "GetApprovalTitle",
      this.$T("smbl.common.view.title.priceRecordApproval").$D(
        "价格信息记录审批"
      ),
    );
  },
  methods: {
    async clickToViewPriceLads(priceItemId) {
      this.$loading.show();
      this.isPriceLadsShowFlag = true;
      this.priceLadsData = [];
      this.priceLadsData = await getPriceLads(priceItemId);
      this.$loading.hide();
    },
    resizePurchaseContent() {
      // 计算本页面的高度
      // 起因：srm-tab需要固定高度，head高度不固定（可能显示多行），无法准确得到内容高度值。
      // 找到更优方案后，删除该方案
      let headInfoEle = document.querySelectorAll(".headInfo");

      if (headInfoEle.length === 0) {
        return;
      }
      let headHeight = headInfoEle[0].offsetHeight; // 头部的高度

      let contentOffset = headHeight + 50 + 60; // 出去srm-tab的总高度

      let height = `calc(100vh - ${ contentOffset }px)`; // 高度描述

      this.$refs.purchase.style.height = height;
    },
    changeTab() {},
    showHeadDetail() {
      this.isHeadInfoShowFlag = true;
    },
    showLineDetail(item) {
      this.currentLineInfo = item;
      this.isLineInfoShowFlag = true;
    },
  },
};
</script>

<style lang="stylus" scoped>
.purchase-record-approval {
    width: 100%;
    >>> .srm-line-tab {
      height: 100%;
    }
    >>> .srm-line-tab-content {
      min-height: 200px;
      height: calc(100% - 44px);
      overflow: scroll;
    }
}
.first-item {
    display: flex;
    align-items: center;
    margin-top: 16px;
    .block {
        width: 7px;
        height: 10px;
        background-color: var(--color-other-default-b);
    }
    .text {
        margin-left: 8px;
        line-height: 20px;
        font-size: 14px;
        color: var(--color-font-default);
        font-weight: bold;
    }
}
>>> .customize-item {
    padding: 0 15px;
    &:first-child {
        padding: 0 15px 0 0;
    }
}

.materials-item {
    .materials-line {
        width: 100%;
        height: 8px;
        margin-top: 16px;
        background-color: var(--color-bg-default-b);
    }
}

.tab-view {
    width: 100%;
    height: 100%;
    flex: 1;
    flex-shrink: 1;
}

.detail-remark {
  width: 100%;
  >>> .srm-field-wrapper-container {
    margin-top: 0px !important;
  }
}
.other-info {
  padding: 0 15px 0 15px;
  .blank-view {
    width: 100%;
    height: constant(safe-area-inset-bottom);
    height: env(safe-area-inset-bottom);
  }
  .desc {
    padding-bottom: 16px;
    border-top: 1px solid var(--color-bg-default-b);
    .remark-title {
      margin-top: 16px;
      font-size: 12px;
      font-weight: bold;
      color: #AFAFAF;
    }
    .remark {
      background-color: #F6F6F6;
      border-radius: 4px;
      padding: 8px;
      margin: 8px 0px 15px 0px;
      min-height: 50px;
      font-size: 14px;
      color: #333333;
    }
  }

  .attachment-content {
    margin-top: 12px;
  }
  .attachment {
    margin-bottom: 12px;
    >>> .srm-upload-title {
      font-size: 14px;
      border-radius: 14px;
      line-height: 28px;
      padding: 0 14px;
      color: white;
    }
  }
  .file {
    >>> .srm-upload-title {
      background-color: #276EF1;
    }
  }
  .third-file {
    margin-bottom: 12px;
    >>> .srm-upload-title {
      background-color: #05944F;
    }
  }
}

>>> .customize-detail {
  padding-left: 15px;
}

>>> .srm-popup-content {
  overflow: scroll;
}

.price-lads-content {
  >>> .srm-popup-content {
    overflow: hidden;
  }
  >>> .customize-item {
    padding: 0 15px;
    &:first-child {
      padding: 0 15px;
    }
  }
  .card {
    padding: 8px 0px;
    background-color: #fff;
    border-bottom: 1px solid #f6f6f6;
    &:last-child {
      margin-bottom: 100px;
    }
  }
  background-color: #f6f6f6;
  width: 100%;
  height: 100%;
  overflow: scroll;
}

</style>
