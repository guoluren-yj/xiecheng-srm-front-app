<template>
  <div class="detail-wrap">
    <srm-scroll-tab class="content" customize-code="SMBL.WORKFLOW.SUPPLIER_INFO_CHANGE_NEW.TBAS">
      <srm-blank size="1px" theme="fill"/>
      <!-- <srm-flex style="height: 40px">
        <srm-button
          style="margin-left: 16px"
          :class="changeStatus ? 'srm-button-on-change':'srm-button-no-change'"
          @click="buttonswitchChange(1)">
          {{ $T('sslm.supplierInform.view.title.afterChange').$D('变更后') }}
        </srm-button>
        <srm-button
          style="margin-left: 8px"
          :class="changeStatus? 'srm-button-no-change':'srm-button-on-change'"
          @click="buttonswitchChange(0)">
          {{ $T('sslm.supplierInform.view.title.beforeChange').$D('变更前') }}
        </srm-button>
      </srm-flex> -->
      <!-- <change-type-btn :btn-params="changeTypeParam" @onChangeType="handleChangeType" /> -->
      <ai-tip-section
        v-if="supplierFormObj.basicInfo&&supplierFormObj.basicInfo.aiApproveStatus"
        key="aiTipSection"
        :ai-approve-status="supplierFormObj.basicInfo?supplierFormObj.basicInfo.aiApproveStatus:null"
        :ai-review-params="supplierFormObj.basicInfo?supplierFormObj.basicInfo.aiApproveDTOList:null" />
      <srm-scroll-tab-item
        v-for="(item) in formTabItemList"
        :key="item.key"
        :label="item.label"
        :code="item.key">
        <div v-if="item.type === 'LIST'">
          <srm-list
            class="sslm-list-item"
            :scrollable="false"
            :data-set="tabItemDs[item.key]"
            :columns="tabItemColumns[item.key]"
            :customize-code="item.code"/>
        </div>
        <div v-else-if="item.type === 'COMBIN'">
          <div v-for="(combinItem, combinIndex) in item.combinList" :key="combinIndex">
            <div v-if="combinItem.type === 'FORM'">
              <h2 v-if="combinItem.label">{{ combinItem.label }}</h2>
              <customize
                need-padding
                :columns="tabItemColumns[combinItem.key]"
                :data-source="supplierFormObj[combinItem.key]"
                :code="combinItem.code"/>
              <div class="combin-divider"/>
            </div>
            <h2 v-if="combinItem.type === 'LIST' && combinItem.label">{{ combinItem.label }}</h2>
            <srm-list
              v-if="combinItem.type === 'LIST'"
              class="combin-list-item"
              :scrollable="false"
              :data-set="tabItemDs[combinItem.key]"
              :columns="tabItemColumns[combinItem.key]"
              :customize-code="combinItem.code"/>
          </div>
        </div>
        <div v-else>
          <customize
            need-padding
            :columns="tabItemColumns[item.key]"
            :data-source="supplierFormObj[item.key]"
            :code="item.code"/>
        </div>
      </srm-scroll-tab-item>
    </srm-scroll-tab>
    <!-- OU层信息pop -->
    <srm-popup
      :visible.sync="isOuPop"
      :title="$T('ssrc.supplyInfoChange.view.title.ouInfo').$D('OU层信息')"
      height="100%"
      position="right"
      show-back>
      <srm-list
        :scrollable="false"
        :data-set="tabItemDs.ouMessage"
        :columns="tabItemColumns.ouMessage"
        customize-code="SMBL.WORKFLOW.SUPPLIER_INFO_CHANGE_NEW.OU"/>
    </srm-popup>
  </div>
</template>

<script>
import { SrmUtil, $T } from "srm-mobile-ui";
import { DataSet } from "srm-mobile-ui";
import { isArray } from "lodash";
import ChangeTypeBtn from "./ChangeTypeBtn.vue";
import { getTabItemList } from "./utils/utils";
import AiTipSection from "@/components/AiTipSection/AiTipSection.vue";
import { dealConfigData, investigateForm } from "./utils/investigate";
import { getContactDS, getContactColums } from "./datasource/getContactDS";
import { getAddressDS, getAddressColums } from "./datasource/getAddressDS";
import { getBankDS, getBankColums } from "./datasource/getBankDS";
import { getAttachmentDS, getAttachmentColums } from "./datasource/getAttachmentDS";
import { getSupplyAbilityDS, getSupplyAbilityColums } from "./datasource/getSupplyAbilityDS";
import { getSupplierClassifyDS, getSupplierClassifyColums } from "./datasource/getSupplierClassifyDS";
import { getPurchaseLineDS, getPurchaseLineColums } from "./datasource/getPurchaseFinanceDS";
import { getLocationDS, getLocationColumns, getOuDS, getOuColumns } from "./datasource/getLocationInfoDS";
import { getInvestigateDS, getInvestigateColums } from "./datasource/getInvestigateDS";
import { getBasicsColumns, getRegisterColums, getBusinessColums, getInvoiceColums, getPurchaseHeaderColumns, getOtherInfoColumns } from "./utils/getFormColums";
import {
  fetchSupplierBasicInfo,
  fetchInvestigateConfig,
} from "./api";
export default {
  modules: [ "sslm.common", "hzero.common", "sslm.supplierDetail", "sslm.supplierInform", "sslm.enterpriseInform", "spfm.enterprise", "ssrc.supplyInfoChange", "hipspfm.common", "spfm.bank", "sslm.supplyAbility", "spfm.importErp", "smbl.common", "sslm.commonApplication" ],
  name: "SupplierInfoApprovalNew",
  components: {
    AiTipSection,
    // ChangeTypeBtn,
  },
  props: {
    parameters: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      allTabList: [], // 全量页签
      changeStatus: 1,
      supplierInfoObj:{}, // 存储全量变更前后数据
      supplierFormObj:{}, // 表单当前数据源
      isOuPop: false, // ou层弹框显隐
      formTabItemList:[], // 需渲染的页签
      tabItemDs:{}, // 表格ds
      tabItemColumns:{}, // 全量Columns
      configList:[], // 调查表配置
      changeTypeParam: { // 全部、仅变更按钮
        activeAllBtn: true,
        handleChangeType: this.handleChangeType,
      },
    };
  },
  async mounted() {
    this.$loading.show();
    // 查询调查表配置
    let investigateConfig = {};
    const { investgHeaderId, investigateTemplateId, } = this.parameters;
    if (investigateTemplateId && investgHeaderId) {
      investigateConfig = await fetchInvestigateConfig({ investgHeaderId, investigateTemplateId, }).then((res) => {
        if (res && !res.failed) {
          return res;
        }
        return {};
      });
    }
    const allTab = getTabItemList(investigateConfig.investigateConfigHeaders || []);
    this.allTabList = allTab;
    this.formTabItemList = allTab;
    this.configList = dealConfigData(investigateConfig);
    const investigateColumnsObj = {};
    this.configList.forEach((config) => {
      investigateColumnsObj[config.configName] = getInvestigateColums(config);
    });
    this.tabItemDs = this.createDs();
    this.tabItemColumns = {
      basicInfo: getBasicsColumns(),
      comBusinessReqDTO: getBusinessColums(this.handlePreview),
      comContactsReqs: getContactColums(),
      comAddressReqs: getAddressColums(),
      comBankAccReqs: getBankColums(),
      supInvoiceReq: getInvoiceColums(),
      supAttachmentReqs: getAttachmentColums(),
      supChangeAbilityLn: getSupplyAbilityColums(this.queryAbilityAttachment),
      supChangeCate: getSupplierClassifyColums(),
      supChangeSync:getPurchaseHeaderColumns(),
      supChangeSyncPf: getPurchaseLineColums(),
      supChangeEbsAdds: getLocationColumns(this.getOuList),
      ouMessage: getOuColumns(),
      supChangeOther: getOtherInfoColumns(),
      ...investigateColumnsObj,
    };
    await this.querySupplierBasicInfo();
    this.$loading.hide();
  },
  beforeMount() {
    this.$emit(
      "InitMountNode", {
        headerButtonRight: <ChangeTypeBtn btnParams={this.changeTypeParam} />,
        bottomTextTip: $T("sslm.common.view.message.changeBtnTips").$D("变更的内容用红色字体标识，可点击切换仅查看变更内容"),
      }
    );
  },
  methods: {
    // 生成ds
    createDs() {
      const investigateDsObj = {};
      this.configList.forEach((config) => {
        if (config.type === "LIST") {
          investigateDsObj[config.configName] = new DataSet(getInvestigateDS(config));
        }
      });
      return {
        comContactsReqs:new DataSet(getContactDS()),
        comAddressReqs:new DataSet(getAddressDS()),
        comBankAccReqs:new DataSet(getBankDS()),
        supAttachmentReqs: new DataSet(getAttachmentDS()),
        supChangeAbilityLn: new DataSet(getSupplyAbilityDS()),
        supChangeCate: new DataSet(getSupplierClassifyDS()),
        supChangeSyncPf: new DataSet(getPurchaseLineDS()),
        supChangeEbsAdds: new DataSet(getLocationDS()),
        ouMessage: new DataSet(getOuDS()),
        ...investigateDsObj,
      };
    },
    // 预览附件
    handlePreview(val) {
      const downApi = "/hfle/v1/files/redirect-url";
      this.previewImg = this.buildImgUrl(val, "private-bucket", downApi);
      this.$previewImage([ this.previewImg ], { showClose: true });
    },
    // async buttonswitchChange(val) {
    //   this.changeStatus = val;
    //   // ds重新new,不然变更前后数据无法切换
    //   this.tabItemDs = this.createDs();
    //   const tabItemList = [];
    //   this.formTabItemList.forEach((item) => {
    //     if (item.type === "COMBIN") {
    //       item.combinList.forEach((n) => {
    //         tabItemList.push(n);
    //       });
    //     } else {
    //       tabItemList.push(item);
    //     }
    //   });
    //   tabItemList.forEach((item) => {
    //     const key = val ? item.newKey : item.oldKey;
    //     if (item.type === "FORM") {
    //       this.supplierFormObj[item.key] = this.supplierInfoObj[key];
    //     } else {
    //       this.tabItemDs[item.key].setData(this.supplierInfoObj[key]);
    //     }
    //   });
    //   // 单独处理ou层数据，因为ou层不在最外层list中
    //   if (val) {
    //     this.tabItemDs.ouMessage.setData(this.supplierInfoObj.newOu);
    //   } else {
    //     this.tabItemDs.ouMessage.setData(this.supplierInfoObj.oldOu);
    //   }
    // },
    // 查询供应商基础信息
    querySupplierBasicInfo(changeType = "") {
      const { changeReqId } = this.parameters;
      const params = {
        changeReqId,
        dataSource: 2,
        changeType,
        partnerTenantId: SrmUtil.getTenantId(),
      };
      const tabItemList = [];
      this.formTabItemList.forEach((item) => {
        if (item.type === "COMBIN") {
          item.combinList.forEach((n) => {
            tabItemList.push(n);
          });
        } else {
          tabItemList.push(item);
        }
      });
      const investigateFormKey = this.configList.filter((n) => n.type === "FORM").map((m) => m.configName);
      const investigateTableKey = this.configList.filter((n) => n.type === "LIST").map((m) => m.configName);
      tabItemList.forEach((item) => {
        fetchSupplierBasicInfo({
          ...params,
          key: item.key,
          // isNewMenu:1,
        }).then((res) => {
          // 表单返回的是数组套数组的格式
          const formArray = [ "supChangeSync", "supChangeOther", ...investigateFormKey ];
          // 表格返回的是两个数组的格式
          const tableArray = [ "supChangeAbilityLn", "supChangeCate", "supChangeSyncPf", "supChangeEbsAdds", ...investigateTableKey, ];
          let newData = {};
          const dataKey = `${item.newKey}`;
          // 调查表页签和平台页签分开
          const data = res[dataKey] ? res[dataKey] : res;
          if (investigateFormKey.includes(item.key)) {
            // 调查表表单
            if (isArray(data)) {
              newData = data[1][0];
            } else {
              newData = data;
            }
          } else if (investigateTableKey.includes(item.key)) {
            // 调查表表格
            // 调查表供应商分类单处理
            if (item.key === "sslmInvestgSupplierCate") {
              newData = res.newFirmChangeCates;
            } else if (isArray(data)) {
              newData = data[1];
            } else {
              newData = data;
            }
          } else if (formArray.includes(item.key)) {
            if (isArray(data)) {
              newData = data[0];
            } else {
              newData = res;
            }
          } else if (tableArray.includes(item.key)) {
            if (data) {
              newData = data;
            } else {
              newData = res;
            }
          } else {
            newData = res; // 头信息不对比
          }
          this.supplierInfoObj[item.newKey] = newData;
          if (item.type === "LIST") {
            const ds = this.tabItemDs[item.key];
            ds.setData(newData);
          } else {
            this.supplierFormObj[item.key] = newData;
          }
          // 只有查询全部时会有申请单基础信息
          if (item.key === "basicInfo") {
            const domesticForeignRelation = res.domesticForeignRelation;
            const isSubdomainsRegister = res.isSubdomainsRegister;
            this.tabItemColumns.comBasicReq = getRegisterColums(domesticForeignRelation, isSubdomainsRegister, this.handlePreview);
          }
          this.$forceUpdate();
        });
      });
    },
    // 查看供货能力清单附件
    queryAbilityAttachment(record) {
      const params = {
        key:"supChangeAbilityLnAtts",
        abilityLineId: record.abilityLineId,
        compareFlag: this.changeStatus ? 2 : 1,
      };
      fetchSupplierBasicInfo(params).then((response) => {
        if (response) {
          const key = this.changeStatus ? "newSupChangeAbilityLnAtts" : "oldSupChangeAbilityLnAtts";
          const dataSource = response[key];
          this.$showFileList({
            fileList: dataSource.map((e) => ({
              fileUrl: e.attachmentUrl,
              fileName: e.attachmentDesc,
              fileSize: e.attachmentSize,
              creationDate: e.creationDate,
              bucketName: "private-bucket",
            }))
          });
        }
      });
    },
    // 获取ou层信息
    getOuList(record) {
      this.isOuPop = true;
      const { changeReqId } = this.parameters;
      const params = {
        key: "ouMessage",
        changeReqId,
        supChangeAddId:record.supChangeAddId,
      };
      fetchSupplierBasicInfo(params).then((res) => {
        if (res) {
          this.supplierInfoObj.newOu = res[1];
          this.supplierInfoObj.oldOu = res[0];
          this.tabItemDs.ouMessage.setData(res[1]);
        }
      });
    },
    async handleChangeType(value) {
      if (this.changeTypeParam.activeAllBtn !== value) {
        const changeFlag = !value;
        this.changeTypeParam.activeAllBtn = value;
        const { configNames = [], domesticForeignRelation, isSubdomainsRegister } = this.supplierFormObj?.basicInfo || {};
        // ds重新new,不然变更前后数据无法切换
        this.tabItemDs = this.createDs();
        let changeTabs = this.allTabList;
        // 仅展示变更
        if (!value) {
          changeTabs = this.allTabList.filter((n) => (configNames || []).includes(n.key));
        }
        this.formTabItemList = changeTabs;
        // 处理所有表单列配置
        const investigateFormColumnsObj = {};
        this.configList.forEach((config) => {
          if (investigateForm.includes(config.configName)) {
            investigateFormColumnsObj[config.configName] = getInvestigateColums(config, changeFlag);
          }
        });
        this.tabItemColumns = {
          ...this.tabItemColumns,
          comBasicReq: getRegisterColums(domesticForeignRelation, isSubdomainsRegister, this.handlePreview, changeFlag),
          comBusinessReqDTO: getBusinessColums(this.handlePreview, changeFlag),
          supInvoiceReq: getInvoiceColums(changeFlag),
          supChangeSync:getPurchaseHeaderColumns(changeFlag),
          supChangeOther: getOtherInfoColumns(changeFlag),
          ...investigateFormColumnsObj,
        };
        this.$loading.show();
        await this.querySupplierBasicInfo(value ? "" : "MODIFY");
        this.$loading.hide();
      }
    },
  },
};
</script>

<style lang="stylus" scoped>
.detail-wrap {

  .srm-button-on-change {
  background: #EFF3FE;
  font-size: 12px;
  color: #276EF1;
  line-height: 16px;
  font-weight: 500;
}

.srm-button-no-change {
  background: rgba(255,255,255,0.00);
  font-size: 12px;
  color: #AFAFAF;
  line-height: 16px;
  font-weight: 500;
}
  .combin-divider{
    border-bottom:solid 1px #EEE;
  }
  .combin-list-item{
   >>> .srm-list-item-card{
    padding-bottom: 0;
    border-bottom-width:0;
    .customize{
      padding-bottom: 16px;
      border-bottom:solid 1px #EEE;
    }
   }
  }
  .sslm-list-item{
    >>> .srm-list-item-card-head{
      .srm-list-item-card-head-left{
        max-width: 50%;
      }
      .srm-list-item-card-head-right{
        max-width: 50%;
      }
    }
  }
}
</style>
