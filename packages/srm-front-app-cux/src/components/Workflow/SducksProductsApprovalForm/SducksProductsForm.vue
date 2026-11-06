<template>
  <div ref="priceExecute" class="price-execute-approval">
    <srm-scroll-tab>
      <srm-scroll-tab-item :label="$T('scux.SducksProductsForm.view.title.product.group.information').$D(
        '商品组信息'
      )
        ">
        <srm-form :data-set="headerDataDs" :columns="getGroupInfoColumns" />
      </srm-scroll-tab-item>
      <srm-scroll-tab-item :label="$T('scux.SducksProductsForm.view.title.product.details').$D(
        '商品详情'
      )
        ">
        <srm-form :data-set="headerDataDs" :columns="getProductDetailsColumns" />
      </srm-scroll-tab-item>
      <srm-scroll-tab-item :label="$T('scux.SducksProductsForm.view.title.product.attributes').$D(
        '商品属性'
      )
        ">
        <div>
          <div>{{ $T('scux.SducksProductsForm.view.title.basic.attributes').$D(
            '基本属性'
          ) }}</div>
          <srm-form :data-set="headerDataDs" :columns="getBasicAttributesColumns" />
        </div>
        <div>
          <div>{{ $T('scux.SducksProductsForm.view.title.specifications.attributes').$D(
            '规格属性'
          ) }}</div>
          <srm-form :data-set="headerDataDs" :columns="specificationsAttributes" />
        </div>
        <div>
          <div>{{ $T('scux.SducksProductsForm.view.title.sales.attributes').$D(
            '销售属性'
          ) }}</div>
          <srm-form :data-set="headerDataDs" :columns="salesAttributes" />
        </div>

      </srm-scroll-tab-item>
      <srm-scroll-tab-item :label="$T('scux.SducksProductsForm.view.title.after-sales.service').$D(
        '售后服务'
      )
        ">
        <srm-form :data-set="headerDataDs" :columns="getAfterSalesColumns" />
      </srm-scroll-tab-item>
      <srm-scroll-tab-item :label="$T('scux.SducksProductsForm.view.title.third-party.information').$D(
        '第三方信息'
      )
        ">
        <srm-form :data-set="headerDataDs" :columns="getThirdPartyColumns" />
      </srm-scroll-tab-item>
      <srm-scroll-tab-item :label="$T('scux.SducksProductsForm.view.title.third-party.itemInfo').$D(
        '物料信息'
      )
        ">
        <srm-form :data-set="headerDataDs" :columns="getItemColumns" />
      </srm-scroll-tab-item>
      <srm-scroll-tab-item :label="$T('scux.SducksProductsForm.view.title.purchase.price').$D(
        '采购价格'
      )
        ">
        <srm-list :data-set="lineInfoDataSet" :columns="lineColumns" :scrollable="false" />
      </srm-scroll-tab-item>
    </srm-scroll-tab>
  </div>
</template>

<script>
import { DataSet } from "srm-mobile-ui";
import { lineInfoDs, headerData } from "./dataSource/index";
import { fetchFieldsInfo } from "./api/index";

export default {
  modules: ["scux.SducksProductsForm", "hipspfm.workFlow"],
  name: "SducksProductsForm",
  props: {
    changeReqId: {
      type: String || Number,
      default: "",
    },
  },
  data() {
    return {
      fileUuid: "",
      fileUrl: "",
      imageList: [],
      basicAttributes: [], // 基本属性
      specificationsAttributes: [], // 规格属性
      salesAttributes: [], // 销售属性
      headerDataDs: new DataSet(headerData(this.changeReqId)),
      lineInfoDataSet: new DataSet(lineInfoDs(this.changeReqId)),
    };
  },
  computed: {
    // 商品组信息
    getGroupInfoColumns() {
      return [
        {
          fieldCode: "initImgUrl",
          render: (val, record) => {
            const { primaryImagePath, largePrimaryImagePath } = record;
            const skuImageList = [{
              mediaPath: primaryImagePath || largePrimaryImagePath,
            }];
            // return (
            //   <div style="text-align: justify;height: 60px;align-items: center;display: flex">
            //     {primaryVideoPath ? <video controls style="width: 60px; height: 60px; display: inline-block;">
            //       <source src={primaryVideoPath} type="video/mp4" />
            //     </video> : <img style="width: 60px; height: 60px; display: inline-block;" src={largePrimaryImagePath || primaryImagePath} alt="预览" />}
            //   </div>
            // );
            return (
              <div style="text-align: justify;height: 60px;align-items: center;display: flex">
                <div onClick={() => this.showPreview(skuImageList)}><img style="width: 60px; height: 60px; display: inline-block;" src={largePrimaryImagePath || primaryImagePath} alt /></div>
              </div>
            );
          },
        },
        {
          fieldCode: "spuName",
          render: (val, record) => {
            const { spuName, spuCode } = record;
            return (
              <span>{spuName ? `${spuName}-${spuCode}` : `${spuCode}`}</span>
            );
          },
        },
        {
          fieldCode: "categoryNamePath",
        },
        {
          fieldCode: "catalogName",
        },
        {
          fieldCode: "supplierCompanyName",
        },
        {
          fieldCode: "companyName",
        },
      ];
    },
    // 商品详情
    getProductDetailsColumns() {
      return [
        {
          fieldCode: "initImgUrl",
          render: (val, record) => {
            const { skuImageList = [] } = record;
            const { mediaPath, thumbnailPath } = skuImageList?.[0] || {};
            // return (
            //   <div style="text-align: justify;height: 60px;align-items: center;display: flex">
            //     {primaryVideoPath ? <video controls style="width: 60px; height: 60px; display: inline-block;">
            //       <source src={primaryVideoPath} type="video/mp4" />
            //     </video> : <div onClick={() => this.showPreview(skuImageList)}><img style="width: 60px; height: 60px; display: inline-block;" src={mediaPath || thumbnailPath} alt /></div>}
            //   </div>
            // );
            return (
              <div style="text-align: justify;height: 60px;align-items: center;display: flex">
                <div onClick={() => this.showPreview(skuImageList)}><img style="width: 60px; height: 60px; display: inline-block;" src={mediaPath || thumbnailPath} alt /></div>
              </div>
            );
          },
        },
        {
          fieldCode: "skuName",
        },
        {
          fieldCode: "skuCode",
        },
        {
          fieldCode: "purSkuStatusMeaning",
        },
        {
          fieldCode: "labelName",
          render: (val, record) => {
            const { labels } = record;
            return (
              <p>{labels?.[0]?.labelName}</p>
            );
          },
        },
        {
          fieldCode: "skuTitle",
        },
        {
          fieldCode: "thirdSkuCode",
        },
        {
          fieldCode: "marketPrice",
        },
        {
          fieldCode: "skuStock",
        },
        {
          fieldCode: "itemCode",
        },
        {
          fieldCode: "itemName",
        },
        {
          fieldCode: "itemCategoryName",
        },
        {
          fieldCode: "customFlag",
        },
        {
          fieldCode: "introduction",
          render: (val) => {
            return <div>{val.replace(/<[^>]*>/g, "")
              .replace(/\r?\n/g, "")}</div>;
          },
        },
      ];
    },
    // 商品属性 - 基本属性
    getBasicAttributesColumns() {
      return [
        {
          fieldCode: "brandName",
        },
        {
          fieldCode: "model",
        },
        {
          fieldCode: "packingList",
        },
        ...this.basicAttributes,
      ];
    },
    // 售后服务
    getAfterSalesColumns() {
      return [
        {
          fieldCode: "returnSpecial",
          render: (val, record) => {
            const { returnDesc, returnSpecial, returnDuration } = record;
            if (returnDesc) {
              return returnDesc;
            }
            return returnSpecial === 2
              ? this.$T('scux.SducksProductsForm.view.noLimitRefunds').$D('该商品支持不限次数退货')
              : returnSpecial === 1
                ? this.$T('scux.SducksProductsForm.view.noRefunds').$D('特殊商品，一经签收不予退货')
                : returnSpecial === 0 && returnDuration
                  ? this.$T('scux.SducksProductsForm.view.returnDuration', { name: returnDuration })
                    .$D(`确认收货后${returnDuration}日内出现质量问题可申请退货`)
                  : '-';
          },
        },
        {
          fieldCode: "changeSpecial",
          render: (val, record) => {
            const { changeDesc, changeSpecial, changeDuration } = record;
            if (changeDesc) {
              return changeDesc;
            }
            return changeSpecial === 2
              ? this.$T('scux.SducksProductsForm.view.noLimitExchange').$D('该商品支持不限次数换货')
              : changeSpecial === 1
                ? this.$T('scux.SducksProductsForm.view.noExchange').$D('特殊商品，一经签收不予换货')
                : changeSpecial === 0 && changeDuration
                  ? this.$T('scux.SducksProductsForm.view.changeDuration', { name: changeDuration })
                    .$D(`确认收货后${changeDuration}日内出现质量问题可申请换货`)
                  : '-';
          },
        },
        {
          fieldCode: "qualityDuration",
          render: (val, record) => {
            const { qualityDesc, qualityDuration } = record;
            if (qualityDesc) return qualityDesc;
            else {
              return qualityDuration
                ? this.$T('scux.SducksProductsForm.view.qualityDuration', { name: qualityDuration })
                  .$D(`质保限期${qualityDuration}个月`)
                : '-';
            }
          },
        },
        {
          fieldCode: "instruction",
          render: (val, record) => record.afterSaleSpecial ? record.instruction : '-',
        },
      ];
    },
    // 第三方服务
    getThirdPartyColumns() {
      return [
        {
          fieldCode: "supplierItemCode",
        },
        {
          fieldCode: "supplierItemName",
        },
        {
          fieldCode: "manufacturerItemCode",
        },
        {
          fieldCode: "manufacturerItemName",
        },
        {
          fieldCode: "manufacturerInfo",
        },
      ];
    },
    // 物料信息
    getItemColumns() {
      return [
        {
          fieldCode: "itemCode",
        },
        {
          fieldCode: "itemName",
        },
        {
          fieldCode: "itemCategoryCode",
        },
        {
          fieldCode: "itemCategoryName",
        },
      ];
    },
    // 采购价格
    lineColumns() {
      return [
        {
          fieldCode: "skuPriceStatusMeaning",
        },
        {
          fieldCode: "shelfErrorMessageMeaning",
        },
        {
          fieldCode: "uomName",
        },
        {
          fieldCode: "tax",
        },
        {
          fieldCode: "currencyName",
        },
        {
          fieldCode: "agreementTaxedPrice",
        },
        {
          fieldCode: "agreementPrice",
        },
        {
          fieldCode: "priceBatchQuantity",
        },
        {
          fieldCode: "priceTypeMeaning",
        },
        {
          fieldCode: "skuSalesLadders",
        },
        {
          fieldCode: "priceHiddenFlagMeaning",
        },
        {
          fieldCode: "validDateFrom",
        },
        {
          fieldCode: "validDateTo",
        },
        {
          fieldCode: "freightLov",
          render: (val, record) => {
            const { freeShippingFlag } = record;
            return freeShippingFlag === 1 ? "包邮" : record.postageName;
          },
        },
        {
          fieldCode: "postageName",
        },
        {
          fieldCode: "orderQuantity",
        },
        {
          fieldCode: "minPackageQuantity",
        },
        {
          fieldCode: "skuSalesRegions",
          render: (val, record) => {
            const { allRegionFlag, skuSalesRegions } = record;
            const all = {
              regionCode: "ALL",
              regionName: "所有区域",
            };
            const list = allRegionFlag === 1 ? [all] : skuSalesRegions?.map((m) => m);
            const newList = list.map((item) => item.regionName)?.join(";");
            return newList;
          },
        },
        {
          fieldCode: "skuSalesUnits",
          render: (val, record) => {
            const { allUnitFlag, skuSalesUnits } = record;
            const allUnit = {
              unitId: "ALL",
              unitName: "所有组织",
            };
            const list = allUnitFlag === 1 ? [allUnit] : skuSalesUnits;
            const list1 = list
              ? list.map((m) => ({
                ...m,
                unitCodeName: m.unitCode ? `${m.unitCode}-${m.unitName}` : m.unitName,
              }))
              : list;
            const newList = list1.map((item) => item.unitCodeName)?.join(";");
            return newList;
          },
        },
        {
          fieldCode: "priceLibNumber",
        },
        {
          fieldCode: "deliveryDay",
        },
        {
          fieldCode: "guaranteeDay",
        },
        {
          fieldCode: "remarkMeaning",
        },
      ];
    },
  },
  async mounted() {
    this.headerDataDs.setQueryParameter({ skuTemporaryId: this.changeReqId, customizeUnitCode: "SMPC.WORKBENCH_PUR.BASE_INFO_READ,SMPC.WORKBENCH_PUR.BASE_INFO_COMPARE,SMPC.WORKBENCH_PUR.SKU_INFO_READ,SMPC.WORKBENCH_PUR.SKU_INFO_COMPARE,SMPC.WORKBENCH_PUR.SKU_PRICEINFO_READ,SMPC.WORKBENCH_PUR.SKU_FLOW_PRICE_INFO_READ,SMPC.WORKBENCH_PUR.SKU_ATTRS_READ,SMPC.WORKBENCH_SUP.BASE_INFO_READ,SMPC.WORKBENCH_SUP.BASE_INFO_COMPARE,SMPC.WORKBENCH_SUP.SKU_INFO_READ,SMPC.WORKBENCH_SUP.SKU_INFO_COMPARE,SMPC.WORKBENCH_SUP.SKU_PRICEINFO_READ,SMPC.WORKBENCH_SUP.SKU_ATTRS_READ,SMPC.WORKBENCH_SUP.BTNS" });
    await this.headerDataDs.refresh();
    const { skuList, categoryId, spuAttrExtendList } = this.headerDataDs.toData()[0];
    const { skuSalesInfos, skuAttrList } = skuList[0] || {};
    const newBasicAttributes = [];
    const newSpecificationsAttributes = [];
    const newSalesAttributes = [];
    // 销售属性
    spuAttrExtendList?.forEach((item) => {
      newSalesAttributes.push({ fieldCode: `${item.attrType}`, fieldName: item.attrName });
      this.salesAttributes = newSalesAttributes;
    });
    fetchFieldsInfo({ categoryId, enabledFlag: 1 }, categoryId).then((res) => {
      if (res && !res.failed) {
        const newAttr = res.sort((a, b) => b.orderSeq - a.orderSeq) || [];
        newAttr?.forEach((item) => {
          if ([0, "0"].includes(item.baseAttrFlag)) {
            newSpecificationsAttributes.push({ fieldCode: item.attrId, fieldName: item.attributeName });
            this.specificationsAttributes = newSpecificationsAttributes;
          } else if ([1, "1"].includes(item.baseAttrFlag)) {
            // const flag = skuAttrList.some((v) => v.attrId === item.attrId);
            // if (!flag) {
            if (!(["品牌", "型号"].includes(item.attributeName))) {
              newBasicAttributes.push({ fieldCode: item.attrId, fieldName: item.attributeName });
            }
            this.basicAttributes = newBasicAttributes;
            // }
          }
        });
      }
    });

    this.lineInfoDataSet.setData(skuSalesInfos);
  },
  methods: {
    showPreview(comment, index) {
      this.imageList = [];
      comment.forEach((e) => {
        this.imageList.push(e.mediaPath || e.thumbnailPath);
      });
      // #ifdef H5
      this.$previewImage(this.imageList, { index });
      // #endif
    }
  },
};
</script>

<style scoped lang="stylus">
.preserve-format {
   white-space: pre-line; /* 保留换行，合并连续空格 */
}
.price-execute-approval {
  width: 100%;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  >>> .srm-line-tab {
    height: 100%;
  }
  >>> .srm-line-tab-content {
    background-color: var(--color-border-default);
  }

  >>> .srm-tab-pane {
    background-color: var(--color-border-default);
  }
  >>> .srm-tab-pane-title {
    background-color: var(--color-border-default);
  }
}
</style>
