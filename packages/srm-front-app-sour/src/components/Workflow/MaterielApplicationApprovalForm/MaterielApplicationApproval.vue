<template>
  <div class="materiel-application-approval">
    <srm-scroll-tab v-if="loadingfinishFlag" class="content">
      <srm-scroll-tab-item v-if="baseInfoTabsConfig.base !== 0" :label="$T('smdm.materiel.view.message.base').$D('基础信息')">
        <div v-if="baseInfo" class="customize-card">
          <customize :need-padding="true" :columns="baseInfoColumns" :data-source="baseInfo" code="SMBL.WORKFLOW.MATERIELAPPLICATION.BASEINFO"/>
        </div>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item v-if="baseInfoTabsConfig.attribute !== 0" :label="$T('smdm.materiel.view.message.attribute').$D('物料属性')">
        <div v-if="baseInfo" class="customize-card">
          <customize :need-padding="true" :columns="materielAttributeColumns" :data-source="baseInfo" code="SMBL.WORKFLOW.MATERIELAPPLICATION.ITEMATTRIBUTED"/>
        </div>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item v-if="baseInfoTabsConfig.explainTitle !== 0" :label="$T('smdm.materiel.view.message.explainTitle').$D('物料说明')">
        <div v-if="baseInfo" class="customize-card">
          <customize :need-padding="true" :columns="materielDescColumns" :data-source="baseInfo" code="SMBL.WORKFLOW.MATERIELAPPLICATION.BASEINFO.MATERIELDESC"/>
        </div>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item v-if="baseInfoTabsConfig.commondity !== 0" :label="$T('smdm.materiel.view.message.commodity').$D('税收商品信息')">
        <div v-if="baseInfo" class="customize-card">
          <customize :need-padding="true" :columns="commodityColumns" :data-source="baseInfo" code="SMBL.WORKFLOW.MATERIELAPPLICATION.COMMODITY"/>
        </div>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item v-if="Number(tabsConfig['attributeTable']) !== 0" :label="$T('smdm.materiel.view.message.tab.attributeTable').$D('自定义物料属性')">
        <div v-for="(item, index) in customItemAttributes" :key="index" class="customize-card" :style="{'border-bottom': index === (customItemAttributes.length - 1) ? '' : '2px solid var(--split-line-color-primary)'}">
          <customize :need-padding="true" :columns="customItemAttributeColumns" :data-source="item" code="SMBL.WORKFLOW.MATERIELAPPLICATION.CUSTOMITEMATTRIBUTE"/>
        </div>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item v-if="Number(tabsConfig['categoryTable']) !== 0" :label="$T('smdm.materiel.view.message.tab.categoryTable').$D('自主品类分配物料')">
        <div v-for="(item, index) in allotMaterialList" :key="index" class="customize-card" :style="{'border-bottom': index === (allotMaterialList.length - 1) ? '' : '2px solid var(--split-line-color-primary)'}">
          <customize :need-padding="true" :columns="allotMaterialColumns" :data-source="item" code="SMBL.WORKFLOW.MATERIELAPPLICATION.CATEGORYASSIGN"/>
        </div>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item v-if="Number(tabsConfig['affiliatedOrgTable']) !== 0" :label="$T('smdm.materiel.view.message.tab.affiliatedOrgTable').$D('所属组织')">
        <div v-for="(item, index) in organizationList"
             :key="index" class="customize-card"
             :style="{'border-bottom': index === (organizationList.length - 1) ? '' : '2px solid var(--split-line-color-primary)'}">
          <customize :need-padding="true" :columns="organizationColumns" :data-source="item" code="SMBL.WORKFLOW.MATERIELAPPLICATION.ORGANIZATION"/>
        </div>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item v-if="Number(tabsConfig['itemOrgUomTable']) !== 0 && itemOrganizationUomList.length > 0" :label="$T('smdm.materiel.view.message.tab.itemOrgUomTable').$D('单位转换关系')">
        <div v-for="(item, index) in itemOrganizationUomList" :key="index" class="customize-card" :style="{'border-bottom': index === (itemOrganizationUomList.length - 1) ? '' : '2px solid var(--split-line-color-primary)'}">
          <customize :need-padding="true" :columns="itemOrganizationUomColumns" :data-source="item" code="SMBL.WORKFLOW.MATERIELAPPLICATION.ORGANIZATIONUOM"/>
        </div>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item v-if="Number(tabsConfig['enclosure']) !== 0" :label="$T('smbl.common.view.attachment').$D('附件')">
        <div class="attachment-container">
            <srm-attachment-button
              group
              show-total
              :desc-title="$T('smbl.common.view.button.checkAttachmentList').$D('查看附件列表')"
              :attachments="[{attachmentUuid: baseInfo.attachmentUuid,
                              readonly: true,
                              showInfo: true,
                              uploadButton: 'none'}]"/>
        </div>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item v-if="Number(tabsConfig['componentTable']) !== 0 && componentList.length > 0" :label="$T('smdm.materiel.view.message.tab.componentTable').$D('组件清单')">
        <div v-for="(item, index) in componentList" :key="index" class="customize-card" :style="{'border-bottom': index === (componentList.length - 1) ? '' : '2px solid var(--split-line-color-primary)'}">
          <customize :need-padding="true" :columns="itemComponentColumns" :data-source="item" code="SMBL.WORKFLOW.MATERIELAPPLICATION.COMPONENT"/>
        </div>
      </srm-scroll-tab-item>
    </srm-scroll-tab>
    <!-- 基础信息-详情弹框 -->
    <srm-popup :visible.sync="baseInfoDetailPopupFlag" position="bottom" height="80%" :title="$T('smdm.materiel.view.message.base.detail').$D('基础信息详情')" show-close rounded>
      <customize-detail :need-padding="true" :columns="baseInfoDetailColumns" :data-source="baseInfo" code="SMBL.WORKFLOW.MATERIELAPPLICATION.BASEINFO.DETAIL" />
    </srm-popup>
    <!-- 所属组织行-详情弹框 -->
    <srm-popup :visible.sync="organizationDetailPopupFlag" position="bottom" height="80%" :title="$T('smdm.materiel.view.message.tab.affiliatedOrgTable.detail').$D('所属组织详情')" show-close rounded>
      <customize-detail :need-padding="true" :columns="organizationDetailColumns" :data-source="displayOrganizationItem" code="SMBL.WORKFLOW.MATERIELAPPLICATION.ORGANIZATION.DETAIL" />
    </srm-popup>
  </div>
</template>

<script>
import {
  getItemReqsApi,
  getItemCategoryAssignApi,
  getItemOrganizationApi,
  getItemAttachmentApi,
  getUICustomizeApi,
  getItemAttributesApi,
  getItemOrganizationUomApi,
  getItemComponentsApi,
} from "./api/index";
export default {
  modules: [ "smdm.materiel", "smdm.materielApplication", "smdm.materiel", "smbl.common", "smdm.materialApplication", "hzero.common" ],
  name: "MaterielApplicationApproval",
  props: {
    parameters: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      baseInfo: {},
      allotMaterialList: [],
      organizationList: [],
      attachmentsList: [],
      loadingfinishFlag: false,
      tabsConfig: {},
      baseInfoTabsConfig: {},
      customItemAttributes: [],
      itemOrganizationUomList: [],
      componentList: [],
      // flags
      baseInfoDetailPopupFlag: false, // 基础信息详情弹框flag
      organizationDetailPopupFlag: false, // 组织行详情弹框
      displayOrganizationItem: {},
    };
  },
  computed: {
    baseInfoColumns() {
      return [
        {
          fieldName: this.$T("smdm.materielApplication.model.materiel.itemName").$D("物料名称"),
          fieldCode: "itemName",
          fieldType: "EMPTY",
          formRow: 1,
          render: (val) => <srm-list-header show-open-tag={false}>
            <span>{ val }</span>
          </srm-list-header>,
        },
        {
          fieldName: this.$T("smdm.materielApplication.model.materiel.itemCode").$D("物料编码"),
          fieldCode: "itemCode",
          formRow: 10,
        }, {
          fieldName: this.$T("smdm.materielApplication.model.materiel.itemReqHeaderNum").$D("物料申请单号"),
          fieldCode: "itemReqHeaderNum",
          formRow: 20,
        }, {
          fieldName: this.$T("smdm.materielApplication.model.materiel.createdName").$D("创建人"),
          fieldCode: "createdName",
          formRow: 30,
          formCol: 10,
        }, {
          fieldName: this.$T("smdm.materielApplication.model.materiel.creationDate").$D("创建时间"),
          fieldCode: "creationDate",
          formRow: 30,
          formCol: 20,
        }, {
          fieldName: this.$T("smdm.materielApplication.model.materiel.primaryUomName").$D("基本计量单位"),
          fieldCode: "primaryUomName",
          formRow: 40,
          formCol: 10,
        }, {
          fieldName: this.$T("smdm.materiel.model.materiel.secondaryUomName").$D("辅助计量单位"),
          fieldCode: "secondaryUomName",
          formRow: 40,
          formCol: 20,
        }, {
          fieldName: this.$T("smdm.materiel.model.materiel.purchaseAgentRealName").$D("采购员"),
          fieldCode: "purchaseAgentName",
          formRow: 50,
          formCol: 10,
        }, {
          fieldName: this.$T("smdm.materiel.model.materiel.taxDescription").$D("默认税种/税率"),
          fieldCode: "taxDescription",
          formRow: 60,
          formCol: 10,
          render: (val, item) => val + (item.taxRate ? ` - ${item.taxRate}` : "")
        },
      ];
    },
    materielAttributeColumns() {
      return [
        {
          fieldName: this.$T("smdm.materiel.model.materiel.specifications").$D("规格"),
          fieldCode: "specifications",
          formRow: 1,
          formCol: 1,
        }, {
          fieldName: this.$T("smdm.materiel.model.materiel.brand").$D("品牌"),
          fieldCode: "brand",
          formRow: 10,
          formCol: 10,
        }, {
          fieldName: this.$T("smdm.materiel.model.materiel.manufacturerCompanyName").$D("制造商"),
          fieldCode: "manufacturerCompanyName",
          formRow: 20,
          formCol: 10,
        },
      ];
    },
    materielDescColumns() {
      return [ {
        fieldName: this.$T("smdm.materiel.model.materiel.eanCode").$D("商品流通码"),
        fieldCode: "eanCode",
        formRow: 1,
        formCol: 10,
      }, {
        fieldName: this.$T("smdm.materiel.model.materiel.itemManageMethod").$D("物料管理方式"),
        fieldCode: "itemManageMethod",
        formRow: 10,
        formCol: 10,
      }, {
        fieldName: this.$T("smdm.materiel.model.materiel.quotaManageType").$D("物料配额管理类型"),
        fieldCode: "quotaManageType",
        formRow: 20,
        formCol: 10,
      }, {
        fieldName: this.$T("smdm.materiel.model.materiel.lotNumberingRule").$D("批号规则"),
        fieldCode: "lotNumberingRule",
        formRow: 30,
        formCol: 10,
      }, {
        fieldName: this.$T("smdm.materiel.model.materiel.usedItemCode").$D("旧物料号"),
        fieldCode: "usedItemCode",
        formRow: 40,
        formCol: 10,
      }, {
        fieldName: this.$T("smdm.materiel.model.materiel.productHierarchies").$D("产品层次"),
        fieldCode: "productHierarchies",
        formRow: 50,
        formCol: 10,
      }, {
        fieldName: this.$T("smdm.materiel.model.materiel.explainTitle").$D("物料说明"),
        fieldCode: "remark",
        formRow: 60,
        formCol: 10,
      }, ];
    },
    customItemAttributeColumns() {
      return [ {
        fieldName: this.$T("smdm.materiel.model.materiel.attributeName").$D("属性描述"),
        fieldCode: "attributeName",
        fieldType: "EMPTY",
        render: (val) => <srm-list-header show-open-tag={false}>
          <span>{ val || "-"}</span>
        </srm-list-header>,
        formRow: 1,
        formCol: 10,
      }, {
        fieldName: this.$T("smdm.materiel.model.materiel.attributeNameCode").$D("属性编码"),
        fieldCode: "attributeNameCode",
        formRow: 10,
        formCol: 10,
      }, {
        fieldName: this.$T("smdm.materiel.model.materiel.attributeValueCode").$D("属性值编码"),
        fieldCode: "attributeValueCode",
        formRow: 20,
        formCol: 10,
      }, {
        fieldName: this.$T("smdm.materiel.model.materiel.attributeValue").$D("属性值"),
        fieldCode: "attributeValue",
        formRow: 30,
        formCol: 10,
      }, ];
    },
    allotMaterialColumns() {
      return [
        {
          fieldName: this.$T("smdm.materiel.model.materiel.categoryName").$D("品类名称"),
          fieldCode: "categoryName",
          fieldType: "EMPTY",
          formRow: 1,
          render: (val) => <srm-list-header show-open-tag={false}>
            <span>{ val }</span>
          </srm-list-header>,
        },
        {
          fieldName: this.$T("smdm.materiel.model.materiel.categoryCode").$D("品类编号"),
          fieldCode: "categoryCode",
          formRow: 10,
          formCol: 10,
        }, {
          fieldName: this.$T("smdm.materiel.model.materiel.defaultFlag").$D("是否主品类"),
          fieldCode: "defaultFlag",
          formRow: 20,
          formCol: 10,
          render: (val) => val ? this.$T("smbl.common.view.yes").$D("是") : this.$T("smbl.common.view.no").$D("否")
        },
      ];
    },
    organizationColumns() {
      return [ {
        fieldName: this.$T("smdm.materiel.model.materiel.organizationName").$D("库存组织描述"),
        fieldCode: "organizationName",
        render: (val) => <srm-list-header show-open-tag={false}>
          <span>{ val || "-" }</span>
        </srm-list-header>,
        fieldType: "EMPTY",
        formRow: 1,
        formCol: 10,
      },
      {
        fieldName: this.$T("smdm.materiel.model.materiel.organizationCode").$D("库存组织编码"),
        fieldCode: "organizationCode",
        formRow: 10,
        formCol: 10,
      }, {
        fieldName: this.$T("smdm.materiel.model.materiel.companyName").$D("公司"),
        fieldCode: "companyName",
        formRow: 20,
        formCol: 10,
      }, {
        fieldName: this.$T("smdm.materiel.model.materiel.view.dimensionQc").$D("质检维度"),
        fieldCode: "dimensionQc",
        formRow: 30,
        formCol: 10,
      }, {
        fieldName: this.$T("smdm.materiel.model.materiel.inventory").$D("库房"),
        fieldCode: "multiInventoryName",
        formRow: 30,
        formCol: 20,
      }, {
        fieldName: this.$T("smdm.materialApplication.model.materialApplication.minimumPackage").$D("最小包装量"),
        fieldType: "INPUT_NUMBER",
        editor: false,
        fieldCode: "minPackQuantity",
        formRow: 40,
        formCol: 10,
      }, {
        fieldName: this.$T("smdm.materiel.model.materiel.leadDays").$D("前置时间（天）"),
        fieldCode: "leadDays",
        formRow: 40,
        formCol: 20,
      }, {
        fieldName: this.$T("smdm.materiel.model.materiel.minOrderQuantity").$D("最小订货量"),
        fieldType: "INPUT_NUMBER",
        editor: false,
        fieldCode: "minOrderQuantity",
        formRow: 50,
        formCol: 10,
      }, {
        fieldName: this.$T("smdm.materiel.model.materiel.checkInterval").$D("检查间隔"),
        fieldType: "INPUT_NUMBER",
        editor: false,
        fieldCode: "checkInterval",
        formRow: 50,
        formCol: 20,
      }, {
        fieldName: this.$T("smdm.materiel.model.materiel.allowExcessAmount").$D("允许超收数量比例"),
        fieldType: "INPUT_NUMBER",
        editor: false,
        fieldCode: "allowExcessAmount",
        formRow: 60,
        formCol: 10,
      }, {
        fieldName: this.$T("smdm.materiel.model.materiel.receiveProcess").$D("收货处理时间（天）"),
        fieldType: "INPUT_NUMBER",
        editor: false,
        fieldCode: "receiveProcess",
        formRow: 60,
        formCol: 20,
      }, {
        fieldName: this.$T("smdm.materiel.model.materiel.plannedDelivery").$D("计划交货时间"),
        fieldCode: "plannedDelivery",
        formRow: 70,
        formCol: 10,
      }, ];
    },
    itemOrganizationUomColumns() {
      return [ {
        fieldName: "primaryUomName",
        fieldCode: "primaryUomName",
        fieldType: "EMPTY",
        formRow: 1,
        render: (val) => <srm-list-header show-open-tag={false}>
          <span>{ val }</span>
        </srm-list-header>,
      }, {
        fieldName: "X",
        fieldCode: "optionalAmount",
        langCode: "smdm.materiel.model.ItemOrgUom.optionalAmount",
        formRow: 10,
        formCol: 10,
      }, {
        fieldName: "Y",
        fieldCode: "primaryAmount",
        langCode: "smdm.materiel.model.ItemOrgUom.primaryAmount",
        formRow: 10,
        formCol: 20,
      }, {
        fieldName: this.$T("smdm.materiel.model.ItemOrgUom.uomName").$D("可选计量单位"),
        fieldCode: "uomName",
        formRow: 20,
        formCol: 10,
      }, {
        fieldName: this.$T("hzero.common.model.common.enableFlag").$D("是否启用"),
        fieldCode: "enabledFlag",
        formRow: 30,
        formCol: 10,
        render: (val) => val ? this.$T("smbl.common.view.yes").$D("是") : this.$T("smbl.common.view.no").$D("否"),
      }, ];
    },
    itemComponentColumns() {
      return [ {
        fieldName: "componentCode",
        fieldCode: "componentCode",
        fieldType: "EMPTY",
        formRow: 1,
        render: (val, item) => <srm-list-header show-open-tag={false}>
          <span>{ item.lineNumber }-{ item.componentCode }</span>
        </srm-list-header>,
      }, {
        fieldName: this.$T("smdm.materiel.model.materiel.componentLocalName").$D("组件本地名称"),
        fieldCode: "componentLocalName",
        formRow: 10,
        formCol: 10,
      }, {
        fieldName: this.$T("smdm.materiel.model.materiel.quantity").$D("数量"),
        fieldCode: "quantity",
        fieldType: "INPUT_NUMBER",
        editor: false,
        formRow: 20,
        formCol: 10,
      }, {
        fieldName: this.$T("smdm.materiel.model.materiel.uomName").$D("单位"),
        fieldCode: "uomName",
        formRow: 20,
        formCol: 20,
      }, {
        fieldName: this.$T("smdm.materiel.model.materiel.originCountry").$D("生产国家"),
        fieldCode: "originCountry",
        formRow: 30,
        formCol: 10,
      }, {
        fieldName: this.$T("smdm.materiel.model.materiel.material").$D("材料"),
        fieldCode: "material",
        formRow: 40,
        formCol: 10,
      }, {
        fieldName: this.$T("smdm.materiel.model.materiel.height").$D("高度（米）"),
        fieldCode: "height",
        formRow: 50,
        formCol: 10,
      }, {
        fieldName: this.$T("smdm.materiel.model.materiel.depth").$D("深度（米）"),
        fieldCode: "depth",
        formRow: 50,
        formCol: 20,
      }, {
        fieldName: this.$T("smdm.materiel.model.materiel.width").$D("宽度（米）"),
        fieldCode: "width",
        formRow: 60,
        formCol: 10,
      }, {
        fieldName: this.$T("smdm.materiel.model.materiel.netWeight").$D("净重"),
        fieldCode: "netWeight",
        formRow: 60,
        formCol: 20,
      }, {
        fieldName: this.$T("smdm.materiel.model.materiel.grossWeight").$D("毛重"),
        fieldCode: "grossWeight",
        formRow: 70,
        formCol: 10,
      }, {
        fieldName: this.$T("smdm.materiel.model.materiel.measurement").$D("物品测量"),
        fieldCode: "measurement",
        formRow: 70,
        formCol: 20,
      }, {
        fieldName: this.$T("smdm.materiel.model.materiel.shippingMarkSize").$D("唛头尺寸"),
        fieldCode: "shippingMarkSize",
        formRow: 80,
        formCol: 10,
      }, {
        fieldName: this.$T("smdm.materiel.model.materiel.productBrand").$D("产品品牌/型号"),
        fieldCode: "productBrand",
        formRow: 80,
        formCol: 20,
      }, {
        fieldName: this.$T("hzero.common.model.common.enableFlag").$D("是否启用"),
        fieldCode: "enabledFlag",
        formRow: 90,
        formCol: 10,
        render: (val) => val ? this.$T("smbl.common.view.yes").$D("是") : this.$T("smbl.common.view.no").$D("否"),
      }, ];
    },
    baseInfoDetailColumns() {
      return [ {
        fieldName: this.$T("smdm.materielApplication.model.materiel.itemReqHeaderNum").$D("物料申请单号"),
        fieldCode: "itemReqHeaderNum",
        formRow: 10,
        formCol: 10,
      }, {
        fieldName: this.$T("smdm.materielApplication.model.materiel.createdName").$D("创建人"),
        fieldCode: "createdName",
        formRow: 20,
        formCol: 10,
      }, {
        fieldName: this.$T("smdm.materielApplication.model.materiel.creationDate").$D("创建时间"),
        fieldCode: "creationDate",
        formRow: 30,
        formCol: 10,
      }, {
        fieldName: this.$T("smdm.materialApplication.model.materialApplication.materialStatus").$D("状态"),
        fieldCode: "reqStatusMeaning",
        formRow: 40,
        formCol: 10,
      }, {
        fieldName: this.$T("smdm.materiel.model.materiel.version").$D("版本"),
        fieldCode: "versionNumber",
        formRow: 50,
        formCol: 10,
      }, {
        fieldName: this.$T("smdm.materiel.model.materiel.sourceCode").$D("数据来源"),
        fieldCode: "sourceCode",
        formRow: 60,
        formCol: 10,
      }, {
        fieldName: this.$T("smdm.materielApplication.model.materiel.itemCode").$D("物料编码"),
        fieldCode: "itemCode",
        formRow: 70,
        formCol: 10,
      }, {
        fieldName: this.$T("smdm.materielApplication.model.materiel.itemName").$D("物料名称"),
        fieldCode: "itemName",
        formRow: 80,
        formCol: 10,
      }, {
        fieldName: this.$T("smdm.materiel.model.materiel.itemNumber").$D("云平台物料编码"),
        fieldCode: "itemNumber",
        formRow: 90,
        formCol: 10,
      }, ];
    },
    organizationDetailColumns() {
      return [ {
        fieldName: this.$T("smdm.materiel.model.materiel.organizationCode").$D("库存组织编码"),
        fieldCode: "organizationCode",
        formRow: 10,
        formCol: 10,
      }, {
        fieldName: this.$T("smdm.materiel.model.materiel.plannedDelivery").$D("计划交货时间"),
        fieldCode: "plannedDelivery",
        formRow: 20,
        formCol: 10,
      }, {
        fieldName: this.$T("smdm.materiel.model.materiel.view.dimensionQc").$D("质检维度"),
        fieldCode: "dimensionQc",
        formRow: 30,
        formCol: 10,
      }, {
        fieldName: this.$T("smdm.materiel.model.materiel.organizationName").$D("库存组织描述"),
        fieldCode: "organizationName",
        formRow: 40,
        formCol: 10,
      }, {
        fieldName: this.$T("smdm.materiel.model.materiel.companyName").$D("公司"),
        fieldCode: "companyName",
        formRow: 50,
        formCol: 10,
      }, {
        fieldName: this.$T("smdm.materiel.model.materiel.inventory").$D("库房"),
        fieldCode: "multiInventoryName",
        formRow: 60,
        formCol: 10,
      }, {
        fieldName: this.$T("smdm.materiel.model.materiel.ouName").$D("业务实体"),
        fieldCode: "ouName",
        formRow: 70,
        formCol: 10,
      }, {
        fieldName: this.$T("smdm.materiel.model.materiel.minPackQuantity").$D("最小包装数量"),
        fieldType: "INPUT_NUMBER",
        editor: false,
        fieldCode: "minPackQuantity",
        formRow: 80,
        formCol: 10,
      }, {
        fieldName: this.$T("smdm.materiel.model.materiel.leadDays").$D("前置时间（天）"),
        fieldCode: "leadDays",
        formRow: 90,
        formCol: 10,
      }, ];
    },
    commodityColumns() {
      return [ {
        fieldName: this.$T("smdm.materiel.model.materiel.commodityCode").$D("税收商品编码"),
        fieldCode: "commodityCode",
        formRow: 1,
      }, {
        fieldName: this.$T("smdm.materiel.model.materiel.dutyFreeType").$D("免税类型"),
        fieldCode: "taxFreeTypeMeaning",
        formRow: 10,
        formCol: 10,
      }, {
        fieldName: this.$T("smdm.materiel.model.materiel.discountType").$D("优惠政策类型"),
        fieldCode: "preferentialMarkMeaning",
        formRow: 20,
        formCol: 10,
      }, {
        fieldName: this.$T("smdm.materiel.model.materiel.commodityName").$D("税收商品名称"),
        fieldCode: "taxItemName",
        formRow: 30,
        formCol: 10,
      }, {
        fieldName: this.$T("smdm.materiel.model.materiel.commoditySimple").$D("税收商品简称"),
        fieldCode: "taxItemSimpleName",
        formRow: 40,
        formCol: 10,
      }, {
        fieldName: this.$T("smdm.materiel.model.materiel.discountFlag").$D("是否使用优惠政策"),
        fieldCode: "preferentialMarkFlag",
        formRow: 50,
        formCol: 10,
        render: (val) => val ? this.$T("smbl.common.view.yes").$D("是") : this.$T("smbl.common.view.no").$D("否"),
      }, ];
    }
  },
  mounted() {
    this.getApprovalData();
  },
  methods: {
    showBaseInfoDetail() {
      this.baseInfoDetailPopupFlag = true;
    },
    showOrganizationDetailPopup(item) {
      this.displayOrganizationItem = item;
      this.organizationDetailPopupFlag = true;
    },
    async getApprovalData() {
      let id = this.parameters.itemReqHeaderId;
      this.$loading.show();

      let code = "SMDM_MATERIELAPPLICATION_EDIT.TABS";
      let tabsConfig = await getUICustomizeApi(code);
      this.tabsConfig = {};
      tabsConfig[code].fields.map((item) => {
        this.tabsConfig[item.fieldCode] = item.visible;
        console.log(this.tabsConfig);
      });
      let baseInfoCode = "SMDM_MATERIELAPPLICATION_EDIT.BASIC";
      let baseInfoTabConfig = await getUICustomizeApi(baseInfoCode);
      baseInfoTabConfig[baseInfoCode].fields.map((item) => {
        this.baseInfoTabsConfig[item.fieldCode] = item.visible;
      });
      let materielBaseInfo = await getItemReqsApi(id);
      let itemAttributes = await getItemAttributesApi(id);
      let itemCategoryAssign = await getItemCategoryAssignApi(id);
      let itemOrganization = await getItemOrganizationApi(id);
      let itemOrganizationUoms = await getItemOrganizationUomApi(id);
      let itemAttachment = await getItemAttachmentApi(id);
      let itemComponents = await getItemComponentsApi(id);

      this.$loading.hide();

      this.baseInfo = materielBaseInfo;
      this.customItemAttributes = itemAttributes;
      this.allotMaterialList = itemCategoryAssign;
      this.organizationList = itemOrganization.content || [];
      this.itemOrganizationUomList = itemOrganizationUoms.content;
      this.attachmentsList = itemAttachment.map((item) => ({
        ...item,
        creationDate: item.creationDate || item.uploadDate,
        fileUrl: item.fileUrl || item.attachmentUrl,
        bucketName: item.bucketName || "private-bucket",
      }));
      this.componentList = itemComponents.content;
      this.loadingfinishFlag = true;
    },
  },
};
</script>

<style lang="stylus" scoped>
.materiel-application-approval {
  .customize-card {
    background: var(--background-color-empty);
  }
  >>> .srm-list-item-card-head-left {
    max-width: 100%;
  }
  .attachment-container {
      > .srm-attachment-group .srm-attachment-group-item{
        border: none !import;
    }
  }

  .srm-header-text {
      font-weight: normal;
    }
    >>> .open-tag::before {
      display: none;
    }
    .font-weight-bold {
      font-weight: 600 !important;
    }
}
</style>