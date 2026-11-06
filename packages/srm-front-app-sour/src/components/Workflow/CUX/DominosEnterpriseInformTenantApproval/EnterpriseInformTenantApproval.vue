<template>
  <div class="detail-wrap">
    <srm-scroll-tab class="content">
      <srm-blank size="1px" theme="fill"/>
      <!-- <change-type-btn :btn-params="changeTypeParam" @onChangeType="handleChangeType" /> -->
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
        <div v-else-if="item.key === 'basicInfo'">
          <customize
            need-padding
            :data-set="tabItemDs[item.key]"
            :columns="tabItemColumns[item.key]"
            :data-source="supplierFormObj[item.key]"
            :code="item.code"/>
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
  </div>
</template>

<script>
import { $T } from "srm-mobile-ui";
import { DataSet } from "srm-mobile-ui";
import { isArray } from "lodash";
import ChangeTypeBtn from "./ChangeTypeBtn.vue";
import { getTabItemList } from "./utils/utils";
import { dealConfigData, investigateForm } from "./utils/investigate";
import { getBasicInfoDS } from "./datasource/getBasicInfoDS";
import { getContactDS, getContactColums } from "./datasource/getContactDS";
import { getAddressDS, getAddressColums, approveSave } from "./datasource/getAddressDS";
import { getBankDS, getBankColums } from "./datasource/getBankDS";
import { getFinanceInfoDS, getFinanceInfoColums } from "./datasource/getFinanceInfoDS";
import { getAttachmentDS, getAttachmentColums } from "./datasource/getAttachmentDS";
import { getSupplierClassifyDS, getSupplierClassifyColums } from "./datasource/getSupplierClassifyDS";
import { getInvestigateDS, getInvestigateColums } from "./datasource/getInvestigateDS";
import { getBasicsColumns, getRegisterColums, getBusinessColums, getInvoiceColums, getOtherInfoColumns } from "./utils/getFormColums";
import {
  fetchSupplierBasicInfo,
  fetchInvestigateConfig,
  fetchProserviceFiles,
} from "./api";
export default {
  modules: [ "sslm.common", "hzero.common", "sslm.supplierDetail", "sslm.supplierInform", "sslm.enterpriseInform", "spfm.enterprise", "ssrc.supplyInfoChange", "hipspfm.common", "spfm.bank", "sslm.supplyAbility", "spfm.importErp", "smbl.common", "sslm.commonApplication" ],
  name: "EnterpriseInformTenantApproval",
  components: {
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
      attributeLongtext1: '',
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
      isAllPlatform: false,
    };
  },
  async mounted() {
    this.$loading.show();
    const { changeReqId, partnerTenantId, pageType = "" } = this.parameters;
    const allPlatform = pageType === "confirm";
    this.isAllPlatform = allPlatform;
    let investigateConfig = {};
    if (!this.isAllPlatform) {
      // 租户级变更-查询调查表配置
      if (changeReqId && changeReqId) {
        investigateConfig = await fetchInvestigateConfig({ changeReqId, partnerTenantId, }).then((res) => {
          if (res && !res.failed) {
            return res;
          }
          return {};
        });
      }
    }
    // 查询申申请头信息
    let headerInfo = {};
    const headerRes = await fetchSupplierBasicInfo({
      changeReqId,
      key: "basicInfo",
    });
    if (headerRes && !headerRes.failed) {
      headerInfo = headerRes;
      this.supplierFormObj.basicInfo = headerRes;
      this.attributeLongtext1 = headerRes.attributeLongtext1;
    }
    const { domesticForeignRelation } = headerInfo;
    const allTab = getTabItemList(investigateConfig.investigateConfigHeaders || [], this.isAllPlatform);
    this.allTabList = allTab;
    this.formTabItemList = allTab;
    this.configList = dealConfigData(investigateConfig);
    const investigateColumnsObj = {};
    this.configList.forEach((config) => {
      investigateColumnsObj[config.configName] = getInvestigateColums(config, false, this.queryProserviceAttachment);
    });
    this.tabItemDs = this.createDs();
    this.tabItemColumns = {
      basicInfo: getBasicsColumns(this.getAttributeLongtext1),
      comBasicReq: getRegisterColums(domesticForeignRelation, this.handlePreview, false, allPlatform),
      comBusinessReqDTO: getBusinessColums(this.handlePreview, false, allPlatform, domesticForeignRelation),
      comContactsReqs: getContactColums(allPlatform),
      comAddressReqs: getAddressColums(),
      comBankAccReqs: getBankColums(allPlatform),
      supInvoiceReq: getInvoiceColums(),
      financialInfo: getFinanceInfoColums(),
      supAttachmentReqs: getAttachmentColums(),
      supChangeCate: getSupplierClassifyColums(),
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
    getAttributeLongtext1(val) {
      this.attributeLongtext1 = val;
    },
    // 生成ds
    createDs() {
      const investigateDsObj = {};
      this.configList.forEach((config) => {
        if (config.type === "LIST") {
          investigateDsObj[config.configName] = new DataSet(getInvestigateDS(config));
        }
      });
      return {
        basicInfo: new DataSet(getBasicInfoDS()),
        comContactsReqs:new DataSet(getContactDS()),
        comAddressReqs:new DataSet(getAddressDS()),
        comBankAccReqs:new DataSet(getBankDS()),
        financialInfo: new DataSet(getFinanceInfoDS()),
        supAttachmentReqs: new DataSet(getAttachmentDS()),
        supChangeCate: new DataSet(getSupplierClassifyDS()),
        ...investigateDsObj,
      };
    },
    // handleBasicInfoClick() {
    //   // 检查 tabItemDs.basicInfo 是否存在并且有 toData 方法
    //   console.log('attributeLongtext1', this.attributeLongtext1);
    // },
    // 预览附件
    handlePreview(val) {
      const downApi = "/hfle/v1/files/redirect-url";
      this.previewImg = this.buildImgUrl(val, "private-bucket", downApi);
      this.$previewImage([ this.previewImg ], { showClose: true });
    },
    // 查询供应商基础信息
    querySupplierBasicInfo(changeType = "") {
      const { newFirmChangeInsertFlag } = this.supplierFormObj.basicInfo || {};
      const { changeReqId, partnerTenantId } = this.parameters;
      const params = {
        changeReqId,
        dataSource: 1,
        changeType,
        purchaseTenantId: partnerTenantId,
        routerParams: this.parameters,
        desensitize: false,
        isAllPlatform: this.isAllPlatform,
      };
      const tabItemList = [];
      this.formTabItemList.forEach((item) => {
        tabItemList.push(item);
      });
      tabItemList.filter((t) => t.key !== "basicInfo").forEach((item) => {
        fetchSupplierBasicInfo({
          ...params,
          key: item.key,
          newFirmChangeInsertFlag,
        }).then((res) => {
          if (item.type === "LIST") {
            const ds = this.tabItemDs[item.key];
            ds.setData(res);
          } else if (item.tabSource === "investigate") {
            // 调查表的表单后端返回的是两个数组，取下标为1的那个数据
            this.supplierFormObj[item.key] = isArray(res) ? res[1][0] : {};
          } else if (this.isAllPlatform) {
            this.supplierFormObj[item.key] = {};
            // 平台确认审批取值不一样
            if (item.platformDataKey) {
              this.supplierFormObj[item.key] = res[item.platformDataKey];
            }
          } else {
            this.supplierFormObj[item.key] = res;
          }
          this.$forceUpdate();
        });
      });
    },
    // 查看产品及服务附件
    queryProserviceAttachment(record) {
      const params = {
        investgProserviceId: record.investgProserviceId,
      };
      fetchProserviceFiles(params).then((response) => {
        if (response) {
          const dataSource = response;
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
    async handleChangeType(value) {
      if (this.changeTypeParam.activeAllBtn !== value) {
        const changeFlag = !value;
        this.changeTypeParam.activeAllBtn = value;
        const { configNames = [], domesticForeignRelation } = this.supplierFormObj?.basicInfo || {};
        // ds重新new,不然变更前后数据无法切换
        this.tabItemDs = this.createDs();
        let changeTabs = this.allTabList;
        // 仅展示变更
        if (!value) {
          changeTabs = this.allTabList.filter((n) => (configNames || []).includes(n.changeKey));
        }
        this.formTabItemList = changeTabs;
        // 处理所有表单列配置
        const investigateFormColumnsObj = {};
        this.configList.forEach((config) => {
          if (investigateForm.includes(config.configName)) {
            investigateFormColumnsObj[config.configName] = getInvestigateColums(config, changeFlag, this.queryProserviceAttachment);
          }
        });
        this.tabItemColumns = {
          ...this.tabItemColumns,
          comBasicReq: getRegisterColums(domesticForeignRelation, this.handlePreview, changeFlag, this.isAllPlatform),
          comBusinessReqDTO: getBusinessColums(this.handlePreview, changeFlag, this.isAllPlatform, domesticForeignRelation),
          supInvoiceReq: getInvoiceColums(changeFlag),
          supChangeOther: getOtherInfoColumns(changeFlag),
          ...investigateFormColumnsObj,
        };
        this.$loading.show();
        await this.querySupplierBasicInfo(value ? "" : "MODIFY");
        this.$loading.hide();
      }
    },
    // 审批前保存
    // 审批前调用保存
    beforeApprove(approveResult) {
      return new Promise(async (resolve, reject) => {
        if (approveResult === 'Approved') {
          const { changeReqId } = this.parameters;
          const _attributeLongtext1 = this.attributeLongtext1;
          console.log('attributeLongtext1', _attributeLongtext1);
          if (!_attributeLongtext1) {
            // this.$message.error('请填写变更原因');
            this.$notification.open({
              message: '请填写变更原因',
              description: "",
              class: "notification"
            });
            reject(false);
            return;
          } else {
            const saveParams = {
              changeReqId,
              attributeLongtext1: _attributeLongtext1,
            };
            const res = await approveSave(saveParams);
            if (res && res.failed) {
              this.$notification.open({
                message: res.message,
                description: "",
                class: "notification"
              });
              reject();
              return false;
            } else {
               resolve(true);
            };
          }
        } else {
          resolve(true);
        }
      });
    },
  },
};
</script>

<style lang="stylus" scoped>
.detail-wrap {

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
