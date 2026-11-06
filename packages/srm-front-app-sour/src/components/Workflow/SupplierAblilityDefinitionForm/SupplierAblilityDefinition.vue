<template>
  <div>
    <srm-scroll-tab>
      <!-- 基础信息 -->
      <srm-scroll-tab-item :label="$T('sslm.supplyAbility.view.message.base').$D('基础信息')">
        <srm-list :scrollable="false"
                  height="auto"
                  style="height: auto"
                  :data-set="basisDs"
                  :columns="getBasisColumns"
                  customize-code="SMBL.WORKFLOW.SUPPLIER_ABLILITY_DEFINITION.BASIC_INFO"
                  @itemClick="goToBasisDetail"/>
      </srm-scroll-tab-item>
      <!-- 扩展品类/物料信息 -->
      <srm-scroll-tab-item :label="$T('sslm.supplyAbility.view.title.expandedCategory').$D('扩展品类/物料')">
        <srm-list :scrollable="false"
                  height="auto"
                  style="height: auto"
                  :data-set="expandedCategoryDs"
                  :columns="getExpandedCategoryColumns"
                  customize-code="SMBL.WORKFLOW.SUPPLIER_ABLILITY_DEFINITION.CATEGORY_INFO"
                  @itemClick="goToExpandedCategoryDetail"/>
      </srm-scroll-tab-item>
    </srm-scroll-tab>
  </div>
</template>
<script>
import { getBasisInfoApi, getAttachmentsApi, getApermissionsApi } from "./api";
// import { dateFormat } from "@/utils/index";
import { commonDs, } from "./datasource";
import { DataSet, SrmUtil } from "srm-mobile-ui";
export default {
  modules: [ "ssrc.projectSetup", "ssrc.bidHall", "sslm.supplyAbility", "sslm.common", "sslm.supplierReview", "smbl.common", "hipspfm.common" ],
  name: "SupplierAblilityDefinition",
  props: {
    parameters: {
      type: Object,
      default: null,
    }
  },
  data() {
    return {
      sourceProjectId:"", // 单据头id
      basisDs: new DataSet(commonDs()),
      expandedCategoryDs: new DataSet(commonDs()),
      permissionsFlag:false, // 360查询按钮权限集
    };
  },
  computed:{
    // 基础信息
    getBasisColumns() {
      return [
        {
          formRow:0,
          fieldCode: "expandNum",
          fieldType:"EMPTY",
          render:(val, record) => <SrmListHeader showOpenTag={true}>
            <span>{val}</span>
            <span slot="right">{record.supplyAbilityExpandStatusMeaning}</span>
          </SrmListHeader>
        },
        {
          fieldName: this.$T("sslm.common.view.company.sourceCompanyNames").$D("来源公司"),
          fieldType: "TEXT",
          fieldCode: "sourceCompanyNames",
        },
        {
          fieldName: this.$T("sslm.supplierReview.model.supplierReview.companyName").$D("公司名称"),
          fieldType: "TEXT",
          fieldCode: "companyName",
        },
        {
          fieldName: this.$T("sslm.supplierReview.model.supplierReview.supplierCompanyNum").$D("供应商编码"),
          fieldType: "TEXT",
          fieldCode: "supplierCompanyNum",
        },
        {
          fieldName: this.$T("sslm.supplierReview.model.supplierReview.supplierCompanyName").$D("供应商名称"),
          fieldType: "TEXT",
          fieldCode: "supplierCompanyName",
          render:(val, record) => {
            if (this.permissionsFlag) {
              return <srm-button plain={true} onClick={(e) => {
                e.stopPropagation();
                this.toSupplierDetail(record);
              }}>
                { val }
              </srm-button>;
            }
            return val;
          }
        },
        {
          fieldName: this.$T("sslm.supplierReview.model.supplierReview.realName").$D("创建人"),
          fieldType: "TEXT",
          fieldCode: "createdUserName",
        },
        {
          fieldName: this.$T("sslm.common.creationDate").$D("创建时间"),
          fieldType: "TEXT",
          fieldCode: "creationDate",
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.lastUpdateUserName").$D("最后更新人"),
          fieldType: "TEXT",
          fieldCode: "lastUpdatedUserName",
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.lastUpdateTime").$D("最后更新时间"),
          fieldType: "TEXT",
          fieldCode: "lastUpdateDate",
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.remark").$D("备注"),
          fieldType: "TEXT",
          fieldCode: "remark",
        },
      ];
    },
    // 基础详情信息
    getBasisDetailColumns() {
      return [
        {
          fieldName: this.$T("sslm.common.modal.application.number").$D("申请单号"),
          fieldType: "TEXT",
          fieldCode: "expandNum",
        },
        {
          fieldName: this.$T("sslm.common.modal.application.status").$D("申请状态"),
          fieldType: "TEXT",
          fieldCode: "supplyAbilityExpandStatusMeaning",
        },
        {
          fieldName: this.$T("sslm.common.view.company.sourceCompanyNames").$D("来源公司"),
          fieldType: "TEXT",
          fieldCode: "sourceCompanyNames",
        },
        {
          fieldName: this.$T("sslm.supplierReview.model.supplierReview.companyName").$D("公司名称"),
          fieldType: "TEXT",
          fieldCode: "companyName",
        },
        {
          fieldName: this.$T("sslm.supplierReview.model.supplierReview.supplierCompanyNum").$D("供应商编码"),
          fieldType: "TEXT",
          fieldCode: "supplierCompanyNum",
        },
        {
          fieldName: this.$T("sslm.supplierReview.model.supplierReview.supplierCompanyName").$D("供应商名称"),
          fieldType: "TEXT",
          fieldCode: "supplierCompanyName",
          render:(val, record) => {
            if (this.permissionsFlag) {
              return <srm-button plain={true} onClick={(e) => {
                e.stopPropagation();
                this.toSupplierDetail(record);
              }}>
                { val }
              </srm-button>;
            }
            return val;
          }
        },
        {
          fieldName: this.$T("sslm.supplierReview.model.supplierReview.realName").$D("创建人"),
          fieldType: "TEXT",
          fieldCode: "createdUserName",
        },
        {
          fieldName: this.$T("sslm.common.creationDate").$D("创建时间"),
          fieldType: "TEXT",
          fieldCode: "creationDate",
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.lastUpdateUserName").$D("最后更新人"),
          fieldType: "TEXT",
          fieldCode: "lastUpdatedUserName",
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.lastUpdateTime").$D("最后更新时间"),
          fieldType: "TEXT",
          fieldCode: "lastUpdateDate",
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.remark").$D("备注"),
          fieldType: "TEXT",
          fieldCode: "remark",
        },
      ];
    },
    // 扩展品类/物料信息
    getExpandedCategoryColumns() {
      return [
        {
          formRow:10,
          formCol:10,
          fieldCode: "itemCode",
          fieldType:"EMPTY",
          render:(val) => <SrmListHeader showOpenTag={true}>
            <span>{this.$T("sslm.supplyAbility.model.supplyAbility.itemCode").$D("物料编码") }：{val}</span>
          </SrmListHeader>
        },
        {
          formRow:20,
          formCol:10,
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.itemName").$D("物料描述"),
          fieldType: "TEXT",
          fieldCode: "itemName",
        },
        {
          formRow:30,
          formCol:10,
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.itemCategoryCode").$D("品类代码"),
          fieldType: "TEXT",
          fieldCode: "itemCategoryCode",
        },
        {
          formRow:40,
          formCol:10,
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.categoryName").$D("品类名称"),
          fieldType: "TEXT",
          fieldCode: "itemCategoryName",
        },
        {
          formRow:50,
          formCol:10,
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.supplyFlag").$D("是否可供"),
          fieldType: "TEXT",
          fieldCode: "supplyFlag",
          render: (val) => {
            if (val) {
              return this.$T("smbl.common.message.yes").$D("是");
            }
            return this.$T("smbl.common.message.no").$D("否");
          },
        },
        {
          formRow:50,
          formCol:20,
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.quotaRatio").$D("配额"),
          fieldType: "TEXT",
          fieldCode: "quotaRatio",
        },
        {
          formRow:60,
          formCol:10,
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.adapterProducts").$D("适配产品"),
          fieldType: "TEXT",
          fieldCode: "adapterProducts",
        },
        {
          formRow:60,
          formCol:20,
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.countryIdMeaning").$D("服务国家"),
          fieldType: "TEXT",
          fieldCode: "countryIdMeaning",
        },
        {
          formRow:70,
          formCol:10,
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.regionIdMeaning").$D("服务地区"),
          fieldType: "TEXT",
          fieldCode: "regionIdMeaning",
        },
        {
          formRow:70,
          formCol:20,
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.cityIdMeaning").$D("服务城市"),
          fieldType: "TEXT",
          fieldCode: "cityIdMeaning",
        },
        {
          formRow:80,
          formCol:10,
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.dateFrom").$D("有效期从"),
          fieldType: "TEXT",
          fieldCode: "dateFrom",
        },
        {
          formRow:90,
          formCol:10,
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.dateTo").$D("有效期至"),
          fieldType: "TEXT",
          fieldCode: "dateTo",
        },
        {
          formRow:100,
          formCol:10,
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.inventoryOrganization").$D("库存组织"),
          fieldType: "TEXT",
          fieldCode: "inventoryOrganizationIdMeaning",
        },
        {
          formRow:110,
          formCol:10,
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.purchasingOrganization").$D("采购组织"),
          fieldType: "TEXT",
          fieldCode: "purchaseOrganizationName",
        },
        {
          formRow:120,
          formCol:10,
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.manufacturer").$D("生产厂家"),
          fieldType: "TEXT",
          fieldCode: "manufacturer",
        },
        {
          formRow:130,
          formCol:10,
          fieldName: this.$T("sslm.supplyAbility.view.message.tab.enclosureTable").$D("附件"),
          fieldType: "TEXT",
          fieldCode: "sourceProjectNum",
          render: (val, item) =>
            <span style="color: var(--color-other-default-b);"
              on-click={(n) => {
                n.stopPropagation();
                this.showFileList(item);
              }}>
              { this.$T("hipspfm.common.message.title.viewAttachment").$D("附件查看") }
            </span>,
        },
        {
          formRow:130,
          formCol:20,
          fieldName: this.$T("sslm.common.view.creator.name").$D("创建人"),
          fieldType: "TEXT",
          fieldCode: "createdUserName",
        },
        {
          formRow:140,
          formCol:10,
          fieldName: this.$T("sslm.common.creationDate").$D("创建时间"),
          fieldType: "TEXT",
          fieldCode: "creationDate",
        },
        {
          formRow:150,
          formCol:10,
          fieldName: this.$T("sslm.common.remark").$D("备注"),
          fieldType: "TEXT",
          fieldCode: "remark",
        },
      ];
    },
    // 扩展品类/物料详情信息
    getExpandedCategoryDetailColumns() {
      return [
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.itemCode").$D("物料编码"),
          fieldType: "TEXT",
          fieldCode: "itemCode",
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.itemName").$D("物料描述"),
          fieldType: "TEXT",
          fieldCode: "itemName",
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.itemCategoryCode").$D("品类代码"),
          fieldType: "TEXT",
          fieldCode: "itemCategoryCode",
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.categoryName").$D("品类名称"),
          fieldType: "TEXT",
          fieldCode: "itemCategoryName",
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.supplyFlag").$D("是否可供"),
          fieldType: "TEXT",
          fieldCode: "supplyFlag",
          render: (val) => {
            if (val) {
              return this.$T("smbl.common.message.yes").$D("是");
            }
            return this.$T("smbl.common.message.no").$D("否");
          },
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.quotaRatio").$D("配额"),
          fieldType: "TEXT",
          fieldCode: "quotaRatio",
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.adapterProducts").$D("适配产品"),
          fieldType: "TEXT",
          fieldCode: "adapterProducts",
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.countryIdMeaning").$D("服务国家"),
          fieldType: "TEXT",
          fieldCode: "countryIdMeaning",
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.regionIdMeaning").$D("服务地区"),
          fieldType: "TEXT",
          fieldCode: "regionIdMeaning",
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.cityIdMeaning").$D("服务城市"),
          fieldType: "TEXT",
          fieldCode: "cityIdMeaning",
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.dateFrom").$D("有效期从"),
          fieldType: "TEXT",
          fieldCode: "dateFrom",
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.dateTo").$D("有效期至"),
          fieldType: "TEXT",
          fieldCode: "dateTo",
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.inventoryOrganization").$D("库存组织"),
          fieldType: "TEXT",
          fieldCode: "inventoryOrganizationIdMeaning",
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.purchasingOrganization").$D("采购组织"),
          fieldType: "TEXT",
          fieldCode: "purchaseOrganizationName",
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.manufacturer").$D("生产厂家"),
          fieldType: "TEXT",
          fieldCode: "manufacturer",
        },
        {
          fieldName: this.$T("sslm.supplyAbility.view.message.tab.enclosureTable").$D("附件"),
          fieldType: "TEXT",
          fieldCode: "sourceProjectNum",
          render: (val, item) =>
            <span style="color: var(--color-other-default-b);"
              on-click={(n) => {
                n.stopPropagation();
                this.showFileList(item);
              }}>
              { this.$T("hipspfm.common.message.title.viewAttachment").$D("附件查看") }
            </span>,
        },
        {
          fieldName: this.$T("sslm.common.view.creator.name").$D("创建人"),
          fieldType: "TEXT",
          fieldCode: "createdUserName",
        },
        {
          fieldName: this.$T("sslm.common.creationDate").$D("创建时间"),
          fieldType: "TEXT",
          fieldCode: "creationDate",
        },
        {
          fieldName: this.$T("sslm.common.remark").$D("备注"),
          fieldType: "TEXT",
          fieldCode: "remark",
        },
      ];
    },
  },
  mounted() {
    this.sourceProjectId = this.parameters.requisitionId;
    this.getApermissionsInfo();
    this.fetchData(this.sourceProjectId);
  },
  methods: {
    //扩展品类/物料信息信息详细页面
    goToExpandedCategoryDetail(item = {}) {
      const { data } = item;
      this.detailPopup = this.$popup({
        showBack: true,
        content: <CustomizeDetail
          code="SMBL.WORKFLOW.SUPPLIER_ABLILITY_DEFINITION.CATEGORY_DETAIL_INFO"
          style="padding: 0 15px"
          dataSource={data}
          columns={this.getExpandedCategoryDetailColumns}
        />,
      });
    },
    //基础信息详细页面
    goToBasisDetail(item = {}) {
      const { data } = item;
      this.detailPopup = this.$popup({
        showBack: true,
        content: <CustomizeDetail
          code="SMBL.WORKFLOW.SUPPLIER_ABLILITY_DEFINITION.BASIC_DETAIL_INFO"
          style="padding: 0 15px"
          dataSource={data}
          columns={this.getBasisDetailColumns}
        />,
      });
    },
    // 跳转360查询页面
    toSupplierDetail(item) {
      let toUrl;
      // 环境域名
      const environmentUrl = window.location.origin;
      // const environmentUrl = "https://mobile.dev.isrm.going-link.com";
      // 参数
      const {
        // tenantId,
        companyId,
        supplierCompanyId,
        supplierTenantId,
        spfmCompanyId,
        spfmSupplierCompanyId } = item;
      // 构造跳转地址
      const detailUrl = `/SupplierLifeCycle/#/SupplierLifeCycleDetail?spfmCompanyId=${spfmCompanyId ? spfmCompanyId : ""}&spfmSupplierCompanyId=${spfmSupplierCompanyId ? spfmSupplierCompanyId : ""}&companyId=${companyId}&supplierCompanyId=${supplierCompanyId}&partnerTenantId=${supplierTenantId}`;
      toUrl = `${environmentUrl}/WxCover/?navigateTo=${encodeURIComponent(detailUrl)}&access_token=${SrmUtil.getUserToken()}`;
      // 跳转
      if (toUrl) {
        this.detailPopup = this.$popup({
          showHeader: true,
          showBack: true,
          content:<iframe style="height:100%;width:100%" ref="relate_data" src={toUrl}/>
        });
      }
    },
    // 初始化数据
    fetchData(sourceProjectId) {
      getBasisInfoApi(sourceProjectId).then((res) => {
        this.subjectMatterRule = res.subjectMatterRule;
        // 基础信息
        this.basisDs.setData([ res ] || []);
        // 扩展品类/物料信息
        this.expandedCategoryDs.setData(res.supplyAbilityExpandLines || []);
      });
    },
    getApermissionsInfo() {
      const params = [];
      const permissioncode = "srm.partner.suplier-ability.supply-ability-define.ps.expand.supplier.info";
      params.push(permissioncode);
      getApermissionsApi(params).then((res) => {
        if (res && res[0] && res[0].code === permissioncode) {
          this.permissionsFlag = res[0].approve;
        }
      });
    },
    async showFileList(item) {
      let attachmentList = [];
      const params = {
        supplyAbilityExpandLineId:item.abilityExpandLineId,
        syncCountFlag:"N",
        page: 0,
        size: 100000,
      };
      await getAttachmentsApi(params).then((res) => {
        if (res && res.content) {
          attachmentList = res.content;
        }
      });
      this.$showFileList({
        fileList: attachmentList.map((attachment) => ({
          fileUrl: attachment.attachmentUrl,
          fileName: attachment.attachmentDesc,
          fileSize: attachment.attachmentSize,
          creationDate: attachment.creationDate,
          bucketName: "private-bucket",
        }))
      });
    }
  }
};
</script>

<style lang="stylus" scoped>
</style>