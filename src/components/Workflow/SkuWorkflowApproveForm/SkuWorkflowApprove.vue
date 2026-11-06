<template>
  <srm-scroll-tab customize-code="SMBL.WORKFLOW.PUR.SKU_FLOW_COLLAPSE">
    <!-- ② 基础信息 -->
    <srm-scroll-tab-item :label="$T('smpc.product.view.baseInfo1').$D('基础信息')" code="baseInfo">
      <srm-form :data-set="baseInfoDS" :columns="getBaseInfoColumns" customize-code="SMBL.WORKFLOW.PUR.SKU_FLOW_BASE_INFO" />
    </srm-scroll-tab-item>

    <!-- ③ 价格信息 - 卡片列表 -->
    <srm-scroll-tab-item :label="$T('smpc.product.view.priceInfo').$D('价格信息')" code="priceInfo">
      <srm-list
        :scrollable="false"
        height="auto"
        style="height: auto"
        :data-set="priceDS"
        :columns="getPriceColumns"
        customize-code="SMBL.WORKFLOW.PUR.SKU_FLOW_PRICE_INFO"
        @itemClick="clickPriceInfo" />
    </srm-scroll-tab-item>

    <!-- ④ 商品属性 -->
    <srm-scroll-tab-item :label="$T('smpc.product.view.productAttr').$D('商品属性')" code="skuAttr">
      <!-- 基本属性 -->
      <div class="little-title">{{ $T('smpc.product.view.baseInfoAttr').$D('基本属性') }}</div>
      <srm-list :scrollable="false" height="auto" style="height: auto" :data-set="basicAttrDS" :columns="getBasicAttrColumns" customize-code="SMBL.WORKFLOW.PUR.SKU_FLOW_BASIC_ATTR" />
      <!-- 销售属性 -->
      <div class="little-title">{{ $T('smpc.product.view.saleAttr').$D('销售属性') }}</div>
      <srm-list :scrollable="false" height="auto" style="height: auto" :data-set="saleAttrDS" :columns="getSaleAttrColumns" />
      <!-- 规格属性 -->
      <div class="little-title">{{ $T('smpc.product.view.specAttr').$D('规格属性') }}</div>
      <srm-list :scrollable="false" height="auto" style="height: auto" :data-set="specsAttrDS" :columns="getSpecsAttrColumns" />
    </srm-scroll-tab-item>

    <!-- ⑤ 物料信息 -->
    <srm-scroll-tab-item :label="$T('smpc.product.model.itemInfo').$D('物料信息')" code="skuItemInfo">
      <srm-form :data-set="itemDS" :columns="getItemColumns" />
    </srm-scroll-tab-item>

    <!-- 弹窗：商品描述 -->
    <srm-popup
      :visible.sync="descriptionVisible"
      :title="$T('smpc.product.view.title.skuDescription').$D('商品描述')"
      :position="'bottom'"
      :height="'80%'"
      rounded>
      <html-view :html="descHtml" />
    </srm-popup>

    <!-- 弹窗：定制品信息 -->
    <srm-popup
      :visible.sync="customInfoVisible"
      :title="$T('smpc.product.view.customSku').$D('定制品信息')"
      :position="'bottom'"
      :height="'80%'"
      rounded>
      <div class="custom-pop-content">
        <div v-for="(item, index) in customAttrData" :key="index">
          <div class="custom-group-title">{{ item.attrGroupName }}</div>
          <srm-list
            :scrollable="false"
            height="auto"
            style="height: auto"
            :data-set="groupDataSet[item.groupId]"
            :columns="getCustomSkuColumns(item)" />
          <srm-blank v-if="index !== customAttrData.length - 1" size="large" theme="fill" />
        </div>
      </div>
    </srm-popup>

    <!-- 弹窗：阶梯价格 -->
    <srm-popup
      :visible.sync="ladderPriceVisible"
      :title="$T('smpc.product.view.ladderPrice').$D('阶梯价格')"
      :position="'bottom'"
      :height="'80%'"
      rounded>
      <srm-list
        :scrollable="false"
        height="auto"
        style="height: auto"
        :data-set="ladderPriceDS"
        :columns="getLadderPriceColumns" />
    </srm-popup>

    <!-- 弹窗：送货区域 -->
    <srm-popup
      :visible.sync="postRegionVisible"
      :title="$T('smpc.product.view.postRegion').$D('送货区域')"
      :position="'bottom'"
      :height="'80%'"
      rounded>
      <srm-list
        :scrollable="false"
        height="auto"
        style="height: auto"
        :data-set="postRegionDS"
        :columns="getPostRegionColumns" />
    </srm-popup>

    <!-- 弹窗：采买组织 -->
    <srm-popup
      :visible.sync="skuSalesUnitsVisible"
      :title="$T('smpc.product.view.buyOrganizations').$D('采买组织')"
      :position="'bottom'"
      :height="'80%'"
      rounded>
      <srm-list
        :scrollable="false"
        height="auto"
        style="height: auto"
        :data-set="skuSalesUnitsDS"
        :columns="getSkuSalesUnitsColumns" />
    </srm-popup>
  </srm-scroll-tab>
</template>

<script>
import { $T, DataSet } from "srm-mobile-ui";
import { commonDs, formDs } from "./datasource/formDs";
import Image from "../../Image.vue";
import HtmlView from "@/modules/SkuPreview/components/HtmlView.vue";
import NewSrmListHeader from "../../NewSrmListHeader.vue";
import { fetchInfoWorkflowApprove, fetchTypeSpecs } from "./api";
import colors from "./datasource/colors";

export default {
  modules: ["hzero.common", "smpc.product", "sagm.common", "hipspfm.common", "smpc.workbench"],
  name: "SkuWorkflowApprove",
  components: { HtmlView },
  props: {
    parameters: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      // DataSet 实例
      basicDS: new DataSet(commonDs()), // 基本信息头部
      baseInfoDS: new DataSet(formDs()), // 基础信息（使用完整 fields）
      priceDS: new DataSet(commonDs()), // 价格信息
      basicAttrDS: new DataSet(commonDs()), // 基本属性
      saleAttrDS: new DataSet(commonDs()), // 销售属性
      specsAttrDS: new DataSet(commonDs()), // 规格属性
      itemDS: new DataSet(commonDs()), // 物料信息
      ladderPriceDS: new DataSet(commonDs()), // 阶梯价格
      postRegionDS: new DataSet(commonDs()), // 送货区域
      skuSalesUnitsDS: new DataSet(commonDs()), // 采买组织
      // 状态
      isSup: false,
      formData: {},
      skuData: {},
      skuTemporaryId: null,
      skuId: null,
      // 弹窗控制
      descriptionVisible: false,
      descHtml: "",
      customInfoVisible: false,
      ladderPriceVisible: false,
      postRegionVisible: false,
      skuSalesUnitsVisible: false,
      // 定制品数据
      customAttrData: [],
      groupDataSet: {},
      // 商品属性列
      basicAttrColumns: [],
      saleAttrColumns: [],
      specsAttrColumns: [],
    };
  },
  computed: {
    // ② 基础信息
    getBaseInfoColumns() {
      return [
        {
          fieldCode: "skuName",
          fieldName: $T("smpc.product.view.skuName").$D("商品名称"),
          formRow: 10,
        },
        {
          fieldCode: "skuCode",
          fieldName: $T("smpc.product.view.skuCode").$D("商品编码"),
          formRow: 20,
        },
        {
          fieldCode: "skuTitle",
          fieldName: $T("smpc.product.view.skuTitle").$D("副标题"),
          formRow: 30,
        },
        {
          fieldCode: "primaryImagePath",
          fieldName: $T("smpc.product.view.skuImage").$D("商品图片"),
          formRow: 40,
          render: (val, record) => {
            const skuImageList = record.skuImageList || [];
            if (skuImageList.length > 0) {
              return <div class="sku-image-list">
                {skuImageList.map((img, idx) => {
                  const src = img.largeImagePath || img.mediaPath || "";
                  return <Image key={idx} src={src} width={60} height={60} />;
                })}
              </div>;
            }
            return <Image src={val} width={60} height={60} />;
          },
        },
        {
          fieldCode: "supplierCompanyName",
          fieldName: $T("smpc.product.model.supplier").$D("供应商"),
          formRow: 50,
        },
        {
          fieldCode: "categoryNamePath",
          fieldName: $T("sagm.common.model.plateformCategory").$D("平台分类"),
          formRow: 60,
        },
        {
          fieldCode: "catalogName",
          fieldName: $T("smpc.product.model.productCatalog").$D("商城目录"),
          formRow: 70,
        },
        {
          fieldCode: "labels",
          fieldName: $T("smpc.product.view.skuLabel").$D("商品标签"),
          formRow: 80,
          render: (_, item) =>
            <div class="sku-labels" style="width: 90%">
              {
                item.labels && item.labels.length > 0 && item.labels.map((m) => <p
                  style={{
                    color: colors[m.labelColorCode] ? colors[m.labelColorCode]["label-preview-color"] : "",
                    borderColor: colors[m.labelColorCode] ? colors[m.labelColorCode]["label-preview-border-color"] : "",
                    backgroundColor: colors[m.labelColorCode] ? colors[m.labelColorCode]["label-preview-background-color"] : "",
                  }}
                  class="sku-label word"
                >
                  {m.labelName}
                </p>) || "-"
              }
            </div>,
        },
        {
          fieldCode: "introductions",
          fieldName: $T("smpc.product.view.title.skuDescription").$D("商品描述"),
          formRow: 90,
          render: (val, record) => <SrmButton onClick={() => this.handleShowDescription(record)} plain rect style={{ fontSize: "14px" }}>
            {this.$T("hipspfm.common.button.view").$D("查看")}
          </SrmButton>,
        },
        {
          fieldCode: "customFlagInfo",
          fieldName: $T("smpc.product.view.customSku").$D("定制品信息"),
          formRow: 100,
          render: (val, record) => {
            if (record.customFlag) {
              return <SrmButton onClick={() => this.handleShowCustomInfo(record)} plain rect style={{ fontSize: "14px" }}>
                {this.$T("hipspfm.common.button.view").$D("查看")}
              </SrmButton>;
            }
            return "-";
          },
        },
      ];
    },
    // ③ 价格信息 - 卡片列表
    getPriceColumns() {
      const isSup = this.isSup;
      return [
        {
          formRow: 1,
          fieldCode: "header",
          fieldType: "EMPTY",
          render: (val, item) => {
            const statusType = {
              NEW: "warn",
              WAITING: "warn",
              VALID: "success",
              INVALID: "default",
              VALID_ERROR: "danger",
            };
            return <NewSrmListHeader>
              <span>
                {$T("smpc.product.view.displayOrderSeq").$D("序号")}：{item.lineNum}
              </span>
              <SrmButton slot="right" plain rect style={{ fontWeight: "bold" }} type={statusType[item.skuPriceStatus]}>
                {item.skuPriceStatusMeaning || "-"}
              </SrmButton>
            </NewSrmListHeader>;
          },
        },
        {
          formRow: 2,
          fieldCode: "agreementTaxedPrice",
          fieldName: $T("smpc.product.view.taxedPrice").$D("协议价格(含税)"),
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          formRow: 2,
          fieldCode: "agreementPrice",
          fieldName: $T("smpc.product.view.noTaxedPrice").$D("协议价格(不含税)"),
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          formRow: 3,
          fieldCode: "uomName",
          fieldName: $T("smpc.product.view.uom").$D("单位"),
        },
        {
          formRow: 3,
          fieldCode: "tax",
          fieldName: $T("smpc.product.view.taxRate").$D("税率"),
        },
        {
          formRow: 4,
          fieldCode: "currencyName",
          fieldName: $T("smpc.product.view.currency").$D("币种"),
        },
        {
          formRow: 4,
          fieldCode: "priceBatchQuantity",
          fieldName: $T("smpc.product.view.priceBatchQuantity").$D("价格批量"),
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          formRow: 5,
          fieldCode: "priceTypeMeaning",
          fieldName: $T("smpc.product.view.priceType").$D("价格类型"),
          render: (val, item) => item.priceType === "LADDER_PRICE" ?
            <span style="color: var(--color-other-default-b);">{$T("smpc.product.view.ladderPrice").$D("阶梯价格")}</span> :
            val || "-",
          callBack: (item) => {
            if (item.priceType === "LADDER_PRICE") {
              this.openLadderPricePopup(item.skuSalesLadders);
            }
          },
        },
        {
          formRow: 5,
          fieldCode: "priceHiddenFlagMeaning",
          fieldName: $T("smpc.product.view.priceHidden").$D("隐藏价格"),
        },
        {
          formRow: 6,
          fieldCode: "freightLov",
          fieldName: $T("smpc.product.view.freightRule").$D("运费规则"),
          render: (val, item) => item.freeShippingFlag === 1 ?
            $T("smpc.product.view.freeShipping").$D("包邮") :
            item.shippingRuleName || "-",
        },
        {
          formRow: 6,
          fieldCode: "installName",
          fieldName: $T("smpc.product.view.installExpense").$D("安装费"),
        },
        {
          formRow: 7,
          fieldCode: "orderQuantity",
          fieldName: $T("smpc.product.view.orderQuantity").$D("起订量"),
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          formRow: 7,
          fieldCode: "minPackageQuantity",
          fieldName: $T("smpc.product.view.minPackageQuantity").$D("最小包装量"),
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          formRow: 8,
          fieldCode: "skuSalesRegions",
          fieldName: $T("smpc.product.view.postRegion").$D("送货区域"),
          render: (val, item) => {
            if (item.allRegionFlag === 1) {
              return $T("smpc.product.model.allRegion").$D("所有区域");
            }
            return item.skuSalesRegions && item.skuSalesRegions.length > 0 ?
              <span style="color: var(--color-other-default-b);">{$T("smpc.product.button.lookPostRegion").$D("查看区域")}</span> :
              "-";
          },
          callBack: (item) => {
            if (item.allRegionFlag !== 1 && item.skuSalesRegions && item.skuSalesRegions.length > 0) {
              this.openPostRegionPopup(item.skuSalesRegions);
            }
          },
        },
        {
          formRow: 8,
          fieldCode: "skuSalesUnits",
          fieldName: $T("smpc.product.view.buyOrganizations").$D("采买组织"),
          render: (val, item) => {
            if (item.allUnitFlag === 1) {
              return $T("smpc.product.model.allOrganizations").$D("所有组织");
            }
            return item.skuSalesUnits && item.skuSalesUnits.length > 0 ?
              <span style="color: var(--color-other-default-b);">{$T("smpc.product.button.lookSkuSalesUnits").$D("查看采买组织")}</span> :
              "-";
          },
          callBack: (item) => {
            if (item.allUnitFlag !== 1 && item.skuSalesUnits && item.skuSalesUnits.length > 0) {
              this.openSkuSalesUnitsPopup(item.skuSalesUnits);
            }
          },
        },
        {
          formRow: 9,
          fieldCode: "validDateField",
          fieldName: $T("smpc.product.view.validDate").$D("有效期"),
          render: (val, item) => {
            const from = item.validDateFrom || "";
            const to = item.validDateTo || "";
            return `${from} ~ ${to}`;
          },
        },
        ...isSup ? [] : [{
          formRow: 10,
          fieldCode: "priceLibNumber",
          fieldName: $T("smpc.product.view.proceLinNum").$D("引用价格库编码"),
        }],
        {
          formRow: 10,
          fieldCode: "deliveryDay",
          fieldName: $T("smpc.product.view.deliveryDayC").$D("供货周期(天)"),
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          formRow: 11,
          fieldCode: "guaranteeDay",
          fieldName: $T("smpc.product.view.guaranteeDayC").$D("质保期(天)"),
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          formRow: 12,
          fieldCode: "remarkMeaning",
          fieldName: $T("smpc.product.view.remark").$D("备注"),
        },
      ];
    },
    // ④ 商品属性 - 基本属性
    getBasicAttrColumns() {
      return this.basicAttrColumns;
    },
    // ④ 商品属性 - 销售属性
    getSaleAttrColumns() {
      return this.saleAttrColumns;
    },
    // ④ 商品属性 - 规格属性
    getSpecsAttrColumns() {
      return this.specsAttrColumns;
    },
    // ⑤ 物料信息
    getItemColumns() {
      return [
        {
          fieldCode: "itemCode",
          fieldName: $T("smpc.product.model.itemCode").$D("物料编码"),
          formRow: 10,
        },
        {
          fieldCode: "itemName",
          fieldName: $T("smpc.product.model.itemName").$D("物料名称"),
          formRow: 20,
        },
        {
          fieldCode: "itemCategoryCode",
          fieldName: $T("smpc.product.view.itemCategoryCode").$D("品类编码"),
          formRow: 30,
        },
        {
          fieldCode: "itemCategoryName",
          fieldName: $T("smpc.product.view.itemCategoryName").$D("品类名称"),
          formRow: 40,
        },
      ];
    },
    // 阶梯价格列
    getLadderPriceColumns() {
      return [
        {
          formRow: 1,
          fieldCode: "ladderFrom",
          fieldName: $T("smpc.product.view.ladderFrom").$D("起购数量"),
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          formRow: 1,
          fieldCode: "ladderTo",
          fieldName: $T("smpc.product.view.ladderTo").$D("结束数量"),
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          formRow: 2,
          fieldCode: "unitPrice",
          fieldName: $T("smpc.product.model.noTaxPrice").$D("未税单价"),
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          formRow: 2,
          fieldCode: "taxPrice",
          fieldName: $T("smpc.product.model.taxPrice").$D("含税单价"),
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
      ];
    },
    // 送货区域列
    getPostRegionColumns() {
      return [
        {
          formRow: 1,
          fieldCode: "regionCode",
          fieldType: "EMPTY",
          render: (val) => <srm-flex>
            <span style="font-weight: 600;">{$T("smpc.product.view.regionCode").$D("区域编码")}: {val}</span>
          </srm-flex>
        },
        {
          formRow: 2,
          fieldCode: "regionName",
          fieldName: $T("smpc.product.view.regionName").$D("区域名称"),
        },
      ];
    },
    // 采买组织列
    getSkuSalesUnitsColumns() {
      return [
        {
          formRow: 1,
          fieldCode: "unitCode",
          fieldType: "EMPTY",
          render: (val) => <srm-flex>
            <span style="font-weight: 600;">{$T("smpc.product.view.unitCode").$D("组织编码")}: {val}</span>
          </srm-flex>
        },
        {
          formRow: 2,
          fieldCode: "unitName",
          fieldName: $T("smpc.product.view.unitName").$D("组织名称"),
        },
      ];
    },
  },
  watch: {
    descriptionVisible(val) {
      if (val) {
        // 先置空再赋值，制造 html prop 变化，触发 HtmlView 的 watch.html
        this.descHtml = "";
        this.$nextTick(() => {
          this.descHtml = this.skuData.introduction || "";
        });
      }
    },
  },
  beforeMount() {
    const { skuTemporaryId, skuId } = this.parameters || {};
    this.skuTemporaryId = skuTemporaryId;
    this.skuId = skuId;
    // 通过路径判断是否为供应商视图（路径含 -sup）
    const path = window.location.href || "";
    this.isSup = path.includes("-sup");
  },
  mounted() {
    this.loadData();
  },
  methods: {
    // 加载数据
    async loadData() {
      try {
        this.$loading.show();
        const params = {
          skuTemporaryId: this.skuTemporaryId,
          skuId: this.skuId,
          customizeUnitCode: "SMBL.WORKFLOW.SKU_APPROVE.BASE_INFO",
        };

        const res = await fetchInfoWorkflowApprove(params);
        if (res) {
          this.formData = res;

          // ① 基本信息头部
          const skuData = res.skuList && res.skuList.length > 0 ?
            res.skuList.length === 1 ? res.skuList[0] : res.skuList.find((v) => v.skuId === this.skuId) || res.skuList[0] :
            res;
          this.skuData = skuData;

          // sourceFrom/customFlag 使用 SPU 级别覆盖 SKU 级别（文档 4.1）
          const spuBase = {
            customFlag: res.customFlag,
            sourceFrom: res.sourceFrom,
            supplierCompanyName: res.supplierCompanyName,
            categoryNamePath: res.categoryNamePath,
            catalogName: res.catalogName,
          };

          // ① 基本信息头部：SKU 数据 + SPU 覆盖
          this.basicDS.create({ ...skuData, ...spuBase });

          // ② 基础信息：SKU 数据，supplierCompanyName/categoryNamePath/catalogName 取 SPU 级别（文档 4.2.1）
          this.baseInfoDS.create({ ...skuData, ...spuBase });

          // ③ 价格信息 - 为每条记录添加序号
          const priceList = skuData.skuSalesInfos || [];
          priceList.forEach((item, index) => {
            item.lineNum = index + 1;
          });
          this.priceDS = new DataSet(commonDs());
          this.priceDS.setData(priceList);
          // ④ 商品属性
          this.loadAttrs(res, skuData);

          // ⑤ 物料信息
          this.itemDS.create({ ...skuData });
        }
      } catch (e) {
        console.error("加载工作流审批数据失败:", e);
      } finally {
        this.$loading.hide();
      }
    },
    // 加载商品属性
    async loadAttrs(res, skuData) {
      const categoryId = res.categoryId || skuData.categoryId;
      if (!categoryId) {
        this.buildAttrsFromSku(skuData);
        return;
      }

      try {
        const specsData = await fetchTypeSpecs(categoryId);
        this.buildAttrs(skuData, specsData || []);
      } catch (e) {
        console.error("加载规格属性失败:", e);
        this.buildAttrsFromSku(skuData);
      }
    },
    // 按 attrType 获取属性（与 PC 端 getAttrs 完全一致）
    getAttrsByType(attrType, _skuAttrList = [], _skuAttrExtendList = [], specsData = []) {
      const attrs = [];
      // 遍历 specsData，在 skuAttrList 中按 attrId 匹配
      (specsData || []).forEach((f) => {
        const attr = (_skuAttrList || []).filter((v) => v.attrId === f.attrId);
        const _attrType = (attr[0] || {}).attrType || (f.baseAttrFlag ? 2 : 0);
        if (_attrType === attrType) {
          const attrValues = attrType !== 1 && f.operationType === 0 ?
            attr.map((i) => i.attrValueName || i.description) :
            attr[0] || {};
          attrs.push({ ...f, attrValues });
        }
      });
      // 追加 skuAttrExtendList
      if (_skuAttrExtendList) {
        _skuAttrExtendList.forEach((f) => {
          if (f.attrType === attrType) {
            attrs.push(f);
          }
        });
      }
      return attrs;
    },
    // 构建属性列和数据
    buildAttrs(skuData, specsData) {
      const { skuAttrList = [], skuAttrExtendList = [], brandName, model, packingList } = skuData;

      const baseIsSale = (code) => (skuAttrList || []).some((s) => s.attributeCode === code && s.attrType === 1);

      // 构建动态属性（与 PC 端 buildFields 一致）
      const buildFields = (attrType) => {
        const attrs = this.getAttrsByType(attrType, skuAttrList, skuAttrExtendList, specsData);
        return attrs.map((attr) => {
          const attrId = attr.attrId || attr.attrName;
          const attrName = attr.attrName || attr.attributeName || "";
          const attributeCode = attr.attributeCode;
          let val;
          if (Array.isArray(attr.attrValues)) {
            val = attr.attrValues.join(",");
          } else if (attr.attrValues && typeof attr.attrValues === "object") {
            val = attr.attrValues.attrValueName || attr.attrValues.description || attr.attrValues.attrValue || "";
          } else {
            val = attr.attrValue || attr.attrValueName || attr.description || "";
          }
          const show = ["000000000001", "000000000002"].includes(attributeCode) ? baseIsSale(attributeCode) : true;
          return { show, attrCode: attrId || attrName, attrName, val: this.formatAttrValue(attributeCode, val) };
        });
      };

      // 从 skuAttrList 中提取固定字段值
      const getAttrListValue = (code) => {
        const attr = (skuAttrList || []).find((a) => a.attributeCode === code);
        return attr ? attr.attrValueName || attr.description || attr.attrValue || "" : "";
      };

      // 基本属性 = 固定字段 + 动态基本属性
      const basicAttrVal = {};
      const basicAttrFields = [];
      // 品牌（优先 skuData 顶层，回退 skuAttrList）
      if (!baseIsSale("000000000001")) {
        basicAttrVal.brandName = brandName || getAttrListValue("000000000001");
        basicAttrFields.push({ formRow: basicAttrFields.length + 1, fieldCode: "brandName", fieldName: $T("smpc.product.view.brand").$D("品牌") });
      }
      // 型号
      if (!baseIsSale("000000000002")) {
        basicAttrVal.model = model || getAttrListValue("000000000002");
        basicAttrFields.push({ formRow: basicAttrFields.length + 1, fieldCode: "model", fieldName: $T("smpc.product.view.model").$D("型号") });
      }
      // 包装规格
      basicAttrVal.packingList = packingList || "";
      basicAttrFields.push({ formRow: basicAttrFields.length + 1, fieldCode: "packingList", fieldName: $T("smpc.product.view.packingList").$D("包装规格（清单）") });
      // 动态基本属性
      buildFields(2).forEach((attr) => {
        if (!attr.show) {
          return;
        }
        basicAttrVal[attr.attrCode] = attr.val;
        basicAttrFields.push({ formRow: this.getNextFormRow(basicAttrFields), fieldCode: attr.attrCode, fieldName: attr.attrName });
      });

      // 销售属性
      const saleAttrVal = {};
      const saleAttrFields = [];
      buildFields(1).forEach((attr) => {
        if (!attr.show) {
          return;
        }
        saleAttrVal[attr.attrCode] = attr.val;
        this.pushAttrColumn(saleAttrFields, attr.attrCode, attr.attrName);
      });

      // 规格属性
      const specsAttrVal = {};
      const specsAttrFields = [];
      buildFields(3).forEach((attr) => {
        if (!attr.show) {
          return;
        }
        specsAttrVal[attr.attrCode] = attr.val;
        this.pushAttrColumn(specsAttrFields, attr.attrCode, attr.attrName);
      });

      this.basicAttrColumns = basicAttrFields;
      this.saleAttrColumns = saleAttrFields;
      this.specsAttrColumns = specsAttrFields;

      this.basicAttrDS.setData([basicAttrVal]);
      if (Object.keys(saleAttrVal).length > 0) {
        this.saleAttrDS.setData([saleAttrVal]);
      }
      if (Object.keys(specsAttrVal).length > 0) {
        this.specsAttrDS.setData([specsAttrVal]);
      }
    },
    // 无规格数据时的降级处理
    buildAttrsFromSku(skuData) {
      this.buildAttrs(skuData, []);
    },
    // 推入属性列（单列布局，一行一个）
    pushAttrColumn(fields, code, name) {
      const formRow = fields.length + 1;
      fields.push({ formRow, fieldCode: code, fieldName: name });
    },
    // 获取下一个 formRow（单列递增）
    getNextFormRow(fields) {
      return fields.length + 1;
    },
    // 特殊值格式化
    formatAttrValue(code, value) {
      if (!value) {
        return "";
      }
      switch (code) {
      case "000000000008": // 税率
        return `${value}%`;
      case "000000000006": // 重量
        return value.split(",").join("");
      case "000000000007": // 包装尺寸
        return `${value.split(",").join(" x ")} mm`;
      default:
        return value;
      }
    },
    // 价格信息卡片点击
    clickPriceInfo() {},
    // 显示商品描述
    handleShowDescription() {
      this.descriptionVisible = true;
    },
    // 显示定制品信息
    handleShowCustomInfo() {
      this.customInfoVisible = true;
    },
    // 打开阶梯价格弹窗
    openLadderPricePopup(data) {
      this.ladderPriceDS = new DataSet(commonDs());
      this.ladderPriceDS.setData(data || []);
      this.ladderPriceVisible = true;
    },
    // 打开送货区域弹窗
    openPostRegionPopup(data) {
      this.postRegionDS = new DataSet(commonDs());
      this.postRegionDS.setData(data || []);
      this.postRegionVisible = true;
    },
    // 打开采买组织弹窗
    openSkuSalesUnitsPopup(data) {
      this.skuSalesUnitsDS = new DataSet(commonDs());
      this.skuSalesUnitsDS.setData(data || []);
      this.skuSalesUnitsVisible = true;
    },
    // 定制品列渲染
    getCustomSkuColumns() {
      return [
        {
          formRow: 1,
          fieldCode: "componentName",
          fieldName: $T("smpc.product.view.name").$D("名称"),
        },
        {
          formRow: 1,
          fieldCode: "componentTypeMeaning",
          fieldName: $T("smpc.product.view.componentType").$D("组件类型"),
        },
        {
          formRow: 2,
          fieldCode: "requiredFlag",
          fieldName: $T("smpc.product.view.ynRequired").$D("是否必填"),
          render: (val) => val ? this.$T("hipspfm.common.status.yes").$D("是") : this.$T("hipspfm.common.status.no").$D("否"),
        },
      ];
    },
  },
};
</script>

<style lang="stylus" scoped>
.little-title {
  width: 100%;
  border-bottom: 1px solid #F6F6F6;
  padding: 10px 15px;
  font-size: 12px;
  color: #333333;
}

.sku-image-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.sku-labels {
  display: flex;
  flex-wrap: wrap;
  .sku-label {
    border-radius: 2px;
    padding: 0 5px;
    height: 18px;
    font-size: 12px;
    line-height: 18px;
    border: 1px solid;
    margin-right: 5px;
    margin-top: 4px;
  }
  .word {
    max-width: 100px;
    overflow-x: hidden;
    min-width: 40px;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}

.custom-pop-content {
  padding: 16px 15px;
  .custom-group-title {
    font-size: 14px;
    font-weight: 600;
    color: #333;
    padding: 10px 0;
    border-bottom: 1px solid #F6F6F6;
  }
}
</style>
