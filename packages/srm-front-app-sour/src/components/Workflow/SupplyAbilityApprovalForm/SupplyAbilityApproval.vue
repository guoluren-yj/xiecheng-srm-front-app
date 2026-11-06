<template>
  <div v-loading="loadingFlag" class="supply-ability-approval">
    <srm-scroll-tab>
      <srm-scroll-tab-item :label="$T('sslm.supplyAbility.view.message.base').$D('基础信息')">
        <div class="customize-card">
          <customize :need-padding="true" :columns="baseInfoColumns" :data-source="baseInfo" code="SMBL.WORKFLOW.SUPPLY_ABILITY.BASIC" />
        </div>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item :label="$T('sslm.supplyAbility.view.message.tab.MaterialTable').$D('推荐物料/品类')">
        <div v-if="!sampleList || sampleList.length === 0" class="no-content">
          <span>{{ $T("hipspfm.common.view.message.noInfo").$D("暂无信息") }}</span>
        </div>
        <div v-for="(item, index) in sampleList"
             :key="index"
             class="customize-card"
             :style="index < (sampleList.length - 1) ? 'border-bottom: 8px solid var(--split-line-color-primary);' : ''">
          <srm-flex class="card-header">
            <srm-tag fill :type="Number(item.supplyFlag) ? 'success' : 'danger'">{{ Number(item.supplyFlag) ? $T("sslm.supplyAbility.view.status.supply").$D("可供") : $T("sslm.supplyAbility.view.status.noSupply").$D("不可供") }}</srm-tag>
            <div class="content">{{ item.itemName }}</div>
          </srm-flex>
          <customize :need-padding="true" :columns="sampleColumns" :data-source="item" code="SMBL.WORKFLOW.SUPPLY_ABILITY.MATERIAL" />
        </div>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item :label="$T('sslm.supplyAbility.view.message.tab.supplierClassTable').$D('供应商分类')">
        <div v-if="!supplierList || supplierList.length === 0" class="no-content">
          <span>{{ $T("hipspfm.common.view.message.noInfo").$D("暂无信息") }}</span>
        </div>
        <div v-for="(item, index) in supplierList"
             :key="index + 1000"
             class="customize-card"
             :style="index < (supplierList.length - 1) ? 'border-bottom: 8px solid var(--split-line-color-primary);' : ''">
          <srm-flex class="card-header">
            <srm-tag fill :type="Number(item.enabledFlag) ? 'success' : 'danger'">
              {{ Number(item.enabledFlag) ? $T("sslm.supplyAbility.view.status.enable").$D("启用") : $T("sslm.supplyAbility.view.status.noEnable").$D("未启用") }}
            </srm-tag>
            <!-- <div class="status" :class="{'status-disable': !Number(item.enabledFlag)}">{{ Number(item.enabledFlag) ? $T("sslm.supplyAbility.view.status.enable").$D("启用") : $T("sslm.supplyAbility.view.status.noEnable").$D("未启用") }}</div> -->
            <div class="content">{{ item.categoryCode + "-" + item.categoryDescription }}</div>
          </srm-flex>
          <customize :need-padding="true" :columns="supplierColumns" :data-source="item" code="SMBL.WORKFLOW.SUPPLY_ABILITY.SUPPLIER_CATEGORY" />
        </div>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item :label="$T('sslm.supplyAbility.view.message.tab.attachmentInfo').$D('附件信息')">
        <div v-if="!attachmentList || attachmentList.length === 0" class="no-content">
          <span>{{ $T("hipspfm.common.view.message.noInfo").$D("暂无信息") }}</span>
        </div>
        <div v-for="(item, index) in attachmentList"
             :key="index + 2000"
             class="customize-card"
             :style="index < (attachmentList.length - 1) ? 'border-bottom: 8px solid var(--split-line-color-primary);' : ''">
          <customize :need-padding="true" :columns="attachmentColumns" :data-source="item" code="SMBL.WORKFLOW.SUPPLY_ABILITY.ATTACHMENT" />
        </div>
        <!-- 适配iPhone异形屏 -->
        <div class="safe-area-footer" />
      </srm-scroll-tab-item>
    </srm-scroll-tab>
    <srm-popup
      :title="$T('sslm.supplyAbility.view.message.tab.enclosureTable').$D('附件')"
      :visible.sync="materialAttachmentFlag"
      position="bottom"
      rounded >
      <div v-loading="materialAttachmentLoadingFlag" style="width: 100%; height: 100%">
        <div v-for="(item, index) in materialAttachmentList" :key="index" class="card">
          <customize :need-padding="true" :columns="materialAttachmentColumns" :data-source="item" code="SMBL.WORKFLOW.SUPPLY_ABILITY.MATERIAL_ATTACHMENT" />
        </div>
      </div>
    </srm-popup>
  </div>
</template>

<script>
import {
  getSupplyAbilityBaseInfo,
  getSampleListApi,
  getSupplyCategoryApi,
  getAttachmentListApi,
  getMaterialAttachmentListApi,
  getApermissionsApi,
  getCompanyIdReserveApi,
} from "./api/index.js";
import { previewFile } from "srm-mobile-ui/src/utils/index";
import { SrmUtil } from "srm-mobile-ui";
export default {
  modules: [ "sslm.supplyAbility", "sslm.commonApplication", "hipspfm.common" ],
  name: "SupplyAbilityApproval",
  props: {
    parameters: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      baseInfo: {},
      sampleList: [],
      supplierList: [],
      attachmentList: [],
      abilityLineIds: "",
      loadingFlag: false,
      materialAttachmentFlag: false, // 物料附件
      materialAttachmentLoadingFlag: false, // 物料附件的loading
      materialAttachmentList: [],
      permissionsFlag:false, // 360查询按钮权限集
    };
  },
  computed: {
    baseInfoColumns() {
      return [
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.supplierCompanyNum").$D("供应商编码"),
          fieldCode: "supplierCompanyNum",
          formRow: 10,
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.supplierCompanyName").$D("供应商名称"),
          fieldCode: "supplierCompanyName",
          formRow: 20,
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
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.companyName").$D("公司"),
          fieldCode: "companyName",
          formRow: 30,
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.createUserName").$D("创建人"),
          fieldCode: "createUserName",
          formRow: 40,
          formCol: 10,
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.creationDate").$D("创建时间"),
          fieldCode: "creationDate",
          formRow: 41,
          formCol: 10,
          render: (val) => {
            if (val.length > 10) {
              return val.slice(0, 10);
            }
            return val;
          },
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.lastUpdateUserName").$D("最后更新人"),
          fieldCode: "lastUpdateUserName",
          formRow: 50,
          formCol: 10,
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.lastUpdateDate").$D("最后更新日期"),
          fieldCode: "lastUpdateDate",
          formRow: 60,
          formCol: 10,
          render: (val) => {
            if (val.length > 10) {
              return val.slice(0, 10);
            }
            return val;
          },
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.remark").$D("备注"),
          fieldCode: "remark",
          formRow: 70,
          formCol: 10,
        },
      ];
    },
    sampleColumns() {
      return [
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.itemCode").$D("物料编码"),
          fieldCode: "itemCode",
          formRow: 10,
          formCol: 10,
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.itemCategoryCode").$D("品类代码"),
          fieldCode: "itemCategoryCode",
          formRow: 20,
          formCol: 10,
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.categoryName").$D("品类名称"),
          fieldCode: "itemCategoryName",
          formRow: 20,
          formCol: 20,
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.adapterProducts").$D("适配产品"),
          fieldCode: "adapterProducts",
          formRow: 30,
          formCol: 10,
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.countryIdMeaning").$D("服务国家"),
          fieldCode: "countryIdMeaning",
          formRow: 30,
          formCol: 20,
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.regionIdMeaning").$D("服务地区"),
          fieldCode: "regionIdMeaning",
          formRow: 40,
          formCol: 10,
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.cityIdMeaning").$D("服务城市"),
          fieldCode: "cityIdMeaning",
          formRow: 40,
          formCol: 20,
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.dateFrom").$D("有效期从"),
          fieldCode: "dateFrom",
          formRow: 50,
          formCol: 10,
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.dateTo").$D("有效期至"),
          fieldCode: "dateTo",
          formRow: 50,
          formCol: 20,
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supAbility.supplyStatus").$D("可供状态"),
          fieldCode: "supplyStatus",
          formRow: 60,
          formCol: 10,
          render: (val) => {
            if (val === "G") {
              return <div style="color: var(--color-success); font-size: 14px;">{val}</div>;
            } else if (val === "Y") {
              return <div style="color: var(--color-warn); font-size: 14px;">{val}</div>;
            }
            return <div style="color: var(--color-danger); font-size: 14px;">{val}</div>;
          },
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.psaLevel").$D("PSA评级"),
          fieldCode: "psaEvaluationLevel",
          formRow: 70,
          formCol: 10,
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.psaEvaluationScore").$D("PSA评分"),
          fieldCode: "psaEvaluationScore",
          formRow: 70,
          formCol: 20,
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.psaFinishDate").$D("PSA完成时间"),
          fieldCode: "psaFinishDate",
          formRow: 80,
          formCol: 10,
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.spaLevel").$D("SPA评级"),
          fieldCode: "spaEvaluationLevel",
          formRow: 90,
          formCol: 10,
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.spaEvaluationScore").$D("SPA评分"),
          fieldCode: "spaEvaluationScore",
          formRow: 90,
          formCol: 20,
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.spaFinishDate").$D("SPA完成时间"),
          fieldCode: "spaFinishDate",
          formRow: 100,
          formCol: 10,
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.evaluateRemark").$D("评价信息"),
          fieldCode: "evaluateRemark",
          formRow: 110,
          formCol: 10,
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.quotaRatio").$D("配额"),
          fieldCode: "quotaRatio",
          formRow: 120,
          formCol: 10,
        },
        {
          fieldName: this.$T("sslm.supplyAbility.view.message.tab.enclosureTable").$D("附件"),
          fieldCode: "attachmentUuid",
          formRow: 120,
          formCol: 20,
          render: (val, item) => <div style="font-size: 14px; font-weight: bold; color: var(--color-primary);" onclick={
            (e) => {
              e.stopPropagation();
              this.checkMaterialAttachment(item);
            }
          }>{this.$T("sslm.supplyAbility.model.supplyAbility.check").$D("查看")}</div>,
        },
      ];
    },
    supplierColumns() {
      return [
        {
          fieldName: this.$T("sslm.commonApplication.model.commonApplication.evaluationLevel").$D("分类评级"),
          fieldCode: "evaluationLevel",
          formRow: 10,
          formCol: 10,
          render: (val) => val || "-",
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.commonApplication.evaluationScore").$D("分类评分"),
          fieldCode: "evaluationScore",
          formRow: 10,
          formCol: 20,
          render: (val) => val || "-",
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.commonApplication.alterUserName").$D("变更人"),
          fieldCode: "realName",
          formRow: 20,
          formCol: 10,
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.commonApplication.alterDate").$D("变更时间"),
          fieldCode: "alterDate",
          formRow: 20,
          formCol: 20,
          render: (val) => {
            if (val.length > 10) {
              return val.slice(0, 10);
            }
            return val;
          },
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.commonApplication.alterReason").$D("变更理由"),
          fieldCode: "alterReason",
          formRow: 30,
          formCol: 10,
        },
      ];
    },
    attachmentColumns() {
      return [
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.attachmentDesc").$D("附件名称"),
          fieldCode: "attachmentDesc",
          formRow: 10,
          formCol: 10,
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.realName").$D("上传人"),
          fieldCode: "realName",
          formRow: 15,
          formCol: 10,
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.attachmentType").$D("文件类型"),
          fieldCode: "attachmentType",
          formRow: 20,
          formCol: 10,
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.effectiveDate").$D("文件生效期"),
          fieldCode: "effectiveDate",
          formRow: 30,
          formCol: 10,
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.expiryDate").$D("文件失效期"),
          fieldCode: "expiryDate",
          formRow: 40,
          formCol: 10,
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.remark").$D("备注"),
          fieldCode: "remark",
          formRow: 50,
          formCol: 10,
        },
        {
          fieldName: this.$T("sslm.supplyAbility.view.message.tab.enclosureTable").$D("附件"),
          fieldCode: "attachmentUrl",
          formRow: 60,
          formCol: 10,
          render: (val, item) => <div style="font-size: 14px; font-weight: bold; color: var(--color-primary);" onclick={
            (e) => {
              e.stopPropagation();
              this.checkAttachment(item);
            }
          }>{this.$T("sslm.supplyAbility.model.supplyAbility.check").$D("查看")}</div>,
        },
      ];
    },
    materialAttachmentColumns() {
      return [
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.attachmentDesc").$D("附件名称"),
          fieldCode: "attachmentDesc",
          formRow: 10,
          formCol: 10,
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.realName").$D("上传人"),
          fieldCode: "uploadUserName",
          formRow: 20,
          formCol: 10,
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.uploadDate").$D("上传时间"),
          fieldCode: "uploadDate",
          formRow: 30,
          formCol: 10,
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.attachmentType").$D("文件类型"),
          fieldCode: "attachmentType",
          formRow: 40,
          formCol: 10,
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.maturityDate").$D("文件到期日"),
          fieldCode: "dueDate",
          formRow: 50,
          formCol: 10,
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.remark").$D("备注"),
          fieldCode: "remark",
          formRow: 60,
          formCol: 10,
        },
        {
          fieldName: this.$T("sslm.supplyAbility.view.message.tab.enclosureTable").$D("附件"),
          fieldCode: "attachmentUrl",
          formRow: 70,
          formCol: 10,
          render: (val, item) => <div style="font-size: 14px; font-weight: bold; color: var(--color-primary);" onclick={
            (e) => {
              e.stopPropagation();
              this.checkAttachment(item);
            }
          }>{this.$T("sslm.supplyAbility.model.supplyAbility.check").$D("查看")}</div>,
        },
      ];
    },
  },
  mounted() {
    this.requestSupplyAbilityInfo();
    this.getApermissionsInfo();
  },
  methods: {
    // 获取权限集
    getApermissionsInfo() {
      const params = [];
      const permissioncode = "srm.partner.suplier-ability.supply-ability-evaluate.ps.supplier.info";
      params.push(permissioncode);
      getApermissionsApi(params).then((res) => {
        if (res && res[0] && res[0].code === permissioncode) {
          this.permissionsFlag = res[0].approve;
        }
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
        companyId,
        supplierCompanyId,
        supplierTenantId,
        spfmCompanyId,
        spfmSupplierCompanyId } = item;
      // 处理集团级跳转，无companyId情况
      if (companyId) {
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
      } else {
        const params = {
          lovCode: "SSLM.USER_AUTH.COMPANY",
          partnerCompanyId: supplierCompanyId,
          tenantId:SrmUtil.getTenantId(),
        };
        getCompanyIdReserveApi(params).then((res) => {
          if (res) {
            const newSpfmCompanyId = res[0].spfmCompanyId;
            const newCompanyId = res[0].companyId;
            // 构造跳转地址
            const detailUrl = `/SupplierLifeCycle/#/SupplierLifeCycleDetail?spfmCompanyId=${newSpfmCompanyId ? newSpfmCompanyId : ""}&spfmSupplierCompanyId=${spfmSupplierCompanyId ? spfmSupplierCompanyId : ""}&companyId=${newCompanyId ? newCompanyId : ""}&supplierCompanyId=${supplierCompanyId}&partnerTenantId=${supplierTenantId}`;
            toUrl = `${environmentUrl}/WxCover/?navigateTo=${encodeURIComponent(detailUrl)}&access_token=${SrmUtil.getUserToken()}`;
            // 跳转
            if (toUrl) {
              this.detailPopup = this.$popup({
                showHeader: true,
                showBack: true,
                content:<iframe style="height:100%;width:100%" ref="relate_data" src={toUrl}/>
              });
            }
          }
        });
      }
    },
    async requestSupplyAbilityInfo() {
      // 获取abilityLineIds
      this.loadingFlag = true;
      this.baseInfo = await getSupplyAbilityBaseInfo(this.parameters.supplyAbilityId);
      let sampleListRes = await getSampleListApi(this.parameters.supplyAbilityId, this.parameters.abilityLineIds);
      this.sampleList = sampleListRes.content;
      let supplyListRes = await getSupplyCategoryApi(this.baseInfo.supplierCompanyId, this.baseInfo.supplierTenantId);
      this.supplierList = supplyListRes.content;
      this.attachmentList = await getAttachmentListApi(this.parameters.supplyAbilityId);
      this.loadingFlag = false;
    },
    checkAttachment(item) {
      previewFile({
        bucketName: "private-bucket",
        fileUrl: item.attachmentUrl,
        fileName: item.attachmentDesc,
      });
    },
    async checkMaterialAttachment(item) {
      this.materialAttachmentList = [];
      this.materialAttachmentFlag = true;
      this.materialAttachmentLoadingFlag = true;
      let { content } = await getMaterialAttachmentListApi(item.abilityLineId);
      this.materialAttachmentList = content;
      this.materialAttachmentLoadingFlag = false;
    },
  },
};
</script>

<style lang="stylus" scoped>

.supply-ability-approval {
  width: 100%;
  min-height: 500px;

  .no-content {
    height: 78px;
    padding-left: 15px;
    span {
      position: relative;
      top: 16px;
      font-family: PingFangSC-Medium;
      font-size: 14px;
      color: var(--font-color-second);
      letter-spacing: 0;
      line-height: 22px;
    }
  }
}

.safe-area-footer {
  height: constant(safe-area-inset-bottom);
  height: env(safe-area-inset-bottom);
}

.customize-card {
  padding: 6px 0px 6px 0px;

  .card-header {
    height: 20px;
    padding: 0 15px;
    margin-bottom: 10px;
    .content {
      margin-left: 8px;
      font-size: 14px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: var(--font-color-default);
      font-size: 14px;
      font-weight: bold;
    }
  }
}

</style>