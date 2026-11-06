<template>
  <div class="mall-request-wrapper">
    <srm-scroll-tab ref="scrollTab">
      <srm-scroll-tab-item :label="$T('smodr.orderDetail.view.baseInfo').$D('基本信息')">
        <!-- 固定顶部提示框 -->
        <notice-bar :text="$T('smodr.apply.view.tips').$D('因受商品数量、收货地址、拆单规则等影响，本阶段无法估算准确的附加费金额，故当前总金额不包含此部分，请以转单后订单金额为准')"/>

        <div>
          <customize style="padding-top: 10px" need-padding :columns="getBasicColumns()" :data-source="basicData" code="SMBL.WORKFLOW.MALL_REQUEST.BASIC"/>
        </div>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item :label="$T('smodr.orderDetail.model.productInfo').$D('商品信息')">
        <srm-list :data-set="skuDataSet" :columns="getSkuColumns()" customize-code="SMBL.WORKFLOW.MALL_REQUEST.SKU" @itemClick="showSkuPop"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item :label="$T('smodr.orderDetail.model.accessory').$D('附件')">
        <div class="attachment-card">
          <srm-flex class="attachment-container">
            <span class="icon srm-icon icon-other" />
            <srm-attachment-button :attachments="getAttachment" :title="$T('smodr.orderDetail.model.accessoryCheckList').$D('查看附件列表')" :show-total="true"/>
          </srm-flex>
          <span class="right-icon srm-icon icon-chevron-right"/>
        </div>
      </srm-scroll-tab-item>
    </srm-scroll-tab>
    <!-- 弹框 -->
    <srm-popup :visible.sync="visible" show-header :title="$T('smodr.orderDetail.view.batchInfoDetail').$D('审批详情')" position="right">
      <customize-detail
        :need-padding="true"
        :data-source="popupData.data"
        :columns="popupData.columns"
        :code="popupData.code"/>
    </srm-popup>
  </div>
</template>
<script>
import { $T, DataSet } from "srm-mobile-ui";
// eslint-disable-next-line rulesdir/check_modules
import skuDs from "./datasource/ZYT_skuDs";
import { getBasicDataApi } from "@/components/Workflow/MallRequestApproveForm/api";
import OtherForm from "@/components/Workflow/MallRequestApproveForm/OtherForm";
import NoticeBar from "../../../NoticeBar.vue";
import { fetchOrderBudgetApi } from "./api/ZYT_index";

export default {
  modules: [ "smbl.common", "hzero.common", "smodr.orderDetail", "hipspfm.common", "smodr.apply" ],
  name: "MallRequestApprove",
  components: { NoticeBar },
  props: {
    parameters: {
      type: Object,
      default: null,
    }
  },
  data() {
    return {
      basicData: {},
      skuDataSet: new DataSet(skuDs(this)),
      requestNum: null,
      popupData: {},
      visible: false,
      colorList : [
        { colorType: "success", matchList: [ "APPROVED", "CONVERSION_COMPLETED", "SUBMITTED" ] },
        { colorType: "danger", matchList: [ "REJECTED", "RETURNED" ] },
        { colorType: "info", matchList: [ "CANCELED", "WITHDRAWN" ] },
        { colorType: "primary", matchList: [] },
      ],
      budgetData: []
    };
  },
  computed: {
    getAttachment() {
      return [ {
        attachmentUuid: this.basicData && this.basicData.attachmentUuid,
        title: this.$T("smodr.apply.model.accessoryCheckList").$D("查看附件列表"),
        uploadButton: "fixed",
        readonly:true
      } ];
    },
  },
  beforeMount() {
    this.requestId = this.parameters.requestId;
  },
  async mounted() {
    await this.getBasicData();
    await this.fetchBudget();
    this.skuDataSet?.addQueryParameter("requestId", this.requestId);
    this.skuDataSet?.refresh();
  },
  methods: {
    updateNotice() {
      // this.$refs.scrollTab
      this.$nextTick(() => {
        this.$refs.scrollTab.$refs.srmScroll.resize();
      });
    },
    async getBasicData() {
      await getBasicDataApi({ requestId: this.requestId }).then((res) => {
        if (res && !res.failed) {
          this.basicData = res;
        }
      });
    },
    async fetchBudget() {
      const { basicData } = this;
      if (basicData && basicData.attributeVarchar6 === "1") {
        const params = {
          documentType: "EXP_REQUISITION",
          businessCode: basicData.attributeVarchar16,
          from: "MALL_REQUEST",
        };
        await fetchOrderBudgetApi(params).then((res) => {
          if (res && !res.failed) {
            this.budgetData = res;
          }
        });
      }
    },
    renderColor(status = "") {
      const newList = this.colorList.map((i) => {
        if (i.matchList.includes(status)) {
          return i?.colorType;
        } if (i.matchList.length === 0) {
          return i?.colorType;
        }
        return null;
      }).find((item) => Boolean(item));
      return newList;
    },
    getBasicColumns() {
      return [
        {
          formRow: 10,
          fieldCode: "requestCode",
          fieldName: $T("smodr.apply.model.applyCode").$D("商城申请编码"),
          fieldType: "EMPTY",
          render: (val, record) =>
            <SrmListHeader show-open-tag={false} style="width: 100% !">
              <span>{$T("smodr.apply.model.applyCode").$D("商城申请编码")}：</span>{record.requestCode ? record.requestCode : "-"}
              <div slot="right">
                <srm-tag size="small" type={this.renderColor(record.requestStatus)}>
                  {record.requestStatusMeaning}
                </srm-tag>
              </div>
            </SrmListHeader>
        },
        {
          fieldCode: "requestTypeMeaning",
          fieldName: $T("smodr.apply.model.requestType").$D("申请类型"),
          formRow: 20,
          seq:10
        },
        {
          fieldCode: "sourceFromMeaning",
          fieldName: $T("smodr.apply.model.billSource").$D("单据来源"),
          formRow: 30,
          seq:10
        },
        {
          fieldCode: "currencyName",
          fieldName: $T("smodr.apply.model.currency").$D("币种"),
          formRow: 30,
          seq:20
        },
        {
          fieldCode: "requestAmountMeaning",
          fieldName: $T("smodr.apply.model.allAmount").$D("总金额(含税)"),
          formRow: 40,
          seq:10
        },
        {
          fieldCode: "handleByName",
          fieldName: $T("smodr.apply.model.handleByName").$D("受理人"),
          formRow: 50,
          seq:10
        },
        {
          fieldCode: "createdByName",
          fieldName: $T("smodr.apply.model.creationPeople").$D("创建人"),
          formRow: 50,
          seq:20
        },
        {
          fieldCode: "requestDate",
          fieldName: $T("smodr.apply.model.requestDate").$D("申请时间"),
          formRow: 60,
          seq:10
        },
        {
          fieldCode: "remark",
          fieldName: $T("smodr.apply.model.remark").$D("备注"),
          formRow: 70,
          seq:10
        },
      ];
    },
    getSkuColumns() {
      return [
        {
          formRow: 1,
          fieldCode: "header",
          fieldType: "EMPTY",
          render: (val, record) => <SrmListHeader show-open-tag>
            <span>{$T("smodr.apply.model.skuCode").$D("商品编码")}：</span>{record.skuCode}
            <div slot="right">
              <srm-tag size="small" type={this.renderColor(record.lineStatus)}>
                {record.lineStatusMeaning}
              </srm-tag>
            </div>
          </SrmListHeader>
        },
        {
          fieldCode: "skuName",
          fieldName: $T("smodr.apply.model.skuName").$D("商品名称"),
          formRow: 20,
          seq:10
        },
        {
          fieldCode: "lineNum",
          fieldName: $T("smodr.apply.model.lineNum").$D("行号"),
          formRow: 30,
          seq:10
        },
        {
          fieldCode: "skuTypeMeaning",
          fieldName:$T("smodr.apply.model.skuTypeMeaning").$D("商品类型"),
          formRow: 30,
          seq:15
        },
        {
          fieldCode: "quantityMeaning",
          fieldName: $T("smodr.apply.model.quantityMeaning").$D("数量"),
          formRow: 30,
          seq:20
        },
        {
          fieldCode: "uomName",
          fieldName: $T("smodr.apply.model.uomName").$D("单位"),
          formRow: 40,
          seq:10
        },
        {
          fieldCode: "currencyName",
          fieldName: $T("smodr.apply.model.currencyName").$D("币种"),
          formRow: 40,
          seq:20
        },
        {
          fieldCode: "unitPriceMeaning",
          fieldName: $T("smodr.apply.model.unitPriceMeaning").$D("预估单价（含税）"),
          formRow: 50,
          seq:10
        },
        {
          fieldCode: "per",
          formRow: 60,
          seq:10
        },
        {
          fieldCode: "amountMeaning",
          fieldName: $T("smodr.apply.model.amountMeaning").$D("预估行金额（含税）"),
          formRow: 60,
          seq:10
        },
        {
          fieldCode: "neededDate",
          fieldName: $T("smodr.apply.model.neededDate").$D("需求日期"),
          formRow: 70,
          seq:10
        },
        {
          fieldCode: "requestByName",
          fieldName: $T("smodr.apply.model.requestByName").$D("实际需求人"),
          formRow: 70,
          seq:20
        },
        {
          fieldCode: "attachmentUuid",
          fieldName: $T("smodr.apply.model.attachmentUuid").$D("附件"),
          formRow: 80,
          seq:10
        },
      ];
    },
    showSkuPop(record) {
      this.openPopup(this.getSkuDetailColumns(), record.data, "SMBL.WORKFLOW.MALL_REQUEST.BASIC_DETAIL");
    },
    openPopup(columns, item, code) {
      this.popupData["data"] = item;
      this.popupData["columns"] = columns;
      this.popupData["code"] = code;
      this.visible = true;
    },
    handlePop(record = {}) {
      const dimValueDTO = record.dimValueDTO || {};
      const newlist = (
      dimValueDTO?.headerCustomizedList?.slice()?.filter((i) => i.mappingHeadFlag !== 1) || []).concat(dimValueDTO?.lineCustomizedList?.slice() || []);
      this.$popup({
        title: $T("smodr.apply.model.otherInfo").$D("其他信息"),
        headerAlign: "start",
        showHeader: true,
        showClose: false,
        position: "right",
        showBack: true,
        content: <OtherForm
          list={newlist}/>,
      });
    },
    getSkuDetailColumns() {
      return [
        {
          formRow: 10,
          fieldCode: "skuCode",
          fieldType: "TEXT",
          fieldName: $T("smodr.apply.model.skuCode").$D("商品编码"),
        },
        {
          formRow: 20,
          fieldCode: "skuName",
          fieldType: "TEXT",
          fieldName: $T("smodr.apply.model.skuName").$D("商品名称"),
        },
        {
          formRow: 30,
          fieldCode: "lineNum",
          fieldType: "TEXT",
          fieldName: $T("smodr.apply.model.lineCode").$D("行号"),
        },
        {
          formRow: 40,
          fieldCode: "skuTypeMeaning",
          fieldType: "TEXT",
          fieldName: $T("smodr.apply.model.skuType").$D("商品类型"),
        },
        {
          formRow: 50,
          fieldCode: "sourceTypeMeaning",
          fieldType: "TEXT",
          fieldName: $T("smodr.apply.model.source").$D("来源渠道"),
        },
        {
          formRow: 60,
          fieldCode: "agreementBusinessTypeMeaning",
          fieldType: "TEXT",
          fieldName: $T("smodr.apply.model.agreeType").$D("协议类型"),
        },
        {
          formRow: 70,
          fieldCode: "itemCode",
          fieldType: "TEXT",
          fieldName: $T("smodr.apply.model.itemCode").$D("物料编码"),
        },
        {
          formRow: 80,
          fieldCode: "itemName",
          fieldType: "TEXT",
          fieldName: $T("smodr.apply.model.itemName").$D("物料名称"),
        },
        {
          formRow: 90,
          fieldCode: "quantityMeaning",
          fieldType: "TEXT",
          fieldName: $T("smodr.apply.model.quantity").$D("数量"),
        },
        {
          formRow: 100,
          fieldCode: "uomName",
          fieldType: "TEXT",
          fieldName: $T("smodr.apply.model.uomName").$D("单位"),
        },
        {
          formRow: 110,
          fieldCode: "taxRate",
          fieldType: "TEXT",
          fieldName: $T("smodr.apply.model.tax").$D("税率"),
        },
        {
          formRow: 120,
          fieldCode: "currencyName",
          fieldType: "TEXT",
          fieldName: $T("smodr.apply.model.currency").$D("币种"),
        },
        {
          formRow: 130,
          fieldCode: "unitPriceMeaning",
          fieldType: "TEXT",
          fieldName: $T("smodr.apply.model.priceTax").$D("预估单价(含税)"),
        },
        {
          formRow: 140,
          fieldCode: "nakedUnitPriceMeaning",
          fieldType: "TEXT",
          fieldName: $T("smodr.apply.model.skuCode").$D("预估单价(不含税)"),
        },
        {
          formRow: 150,
          fieldCode: "amountMeaning",
          fieldType: "TEXT",
          fieldName: $T("smodr.apply.model.amountTax").$D("预估行金额(含税)"),
        },
        {
          formRow: 160,
          fieldCode: "nakedUnitPriceMeaning",
          fieldType: "TEXT",
          fieldName: $T("smodr.apply.model.priceNoTax").$D("预估行金额(不含税)"),
        },
        {
          formRow: 170,
          fieldCode: "neededDate",
          fieldType: "TEXT",
          fieldName: $T("smodr.apply.model.needDate").$D("需求日期"),
        },
        {
          formRow: 180,
          fieldCode: "requestByName",
          fieldType: "TEXT",
          fieldName: $T("smodr.apply.model.realRequestName").$D("实际需求人"),
        },
        {
          formRow: 190,
          fieldCode: "productAttributeMeaning",
          fieldType: "TEXT",
          fieldName: $T("smodr.apply.model.productAttributeMeaning").$D("销售规格"),
        },
        {
          formRow: 200,
          fieldCode: "purchaseCompanyName",
          fieldType: "TEXT",
          fieldName: $T("smodr.apply.model.purchase").$D("采购方"),
        },
        {
          formRow: 210,
          fieldCode: "supplierCompanyName",
          fieldType: "TEXT",
          fieldName: $T("smodr.apply.model.supplier").$D("供应商"),
        },
        {
          formRow: 220,
          fieldCode: "unitName",
          fieldType: "TEXT",
          fieldName: $T("smodr.apply.model.unit").$D("部门"),
        },
        {
          formRow: 230,
          fieldCode: "ouName",
          fieldType: "TEXT",
          fieldName: $T("smodr.apply.model.ouName").$D("业务实体"),
        },
        {
          formRow: 240,
          fieldCode: "purOrganizationName",
          fieldType: "TEXT",
          fieldName: $T("smodr.apply.model.purchaseOrg").$D("采购组织"),
        },
        {
          formRow: 250,
          fieldCode: "invOrganizationName",
          fieldType: "TEXT",
          fieldName: $T("smodr.apply.model.invorg").$D("库存组织"),
        },
        {
          formRow: 260,
          fieldCode: "receiveContactName",
          fieldType: "TEXT",
          fieldName: $T("smodr.apply.model.contacter").$D("收货人"),
        },
        {
          formRow: 270,
          fieldCode: "receiveMobilePhone",
          fieldType: "TEXT",
          fieldName: $T("smodr.apply.model.contactPhone").$D("收货联系方式"),
        },
        {
          formRow: 280,
          fieldCode: "receiveFullAddress",
          fieldType: "TEXT",
          fieldName: $T("smodr.apply.model.address").$D("收货地址"),
        },
        {
          formRow: 290,
          fieldCode: "remark",
          fieldType: "TEXT",
          fieldName: $T("smodr.apply.model.remark").$D("备注"),
        },
        {
          formRow: 300,
          fieldCode: "otherInfo",
          fieldType: "TEXT",
          fieldName: $T("smodr.apply.model.otherInfo").$D("其他信息"),
          render:(val, record) =>
            <SrmButton onClick={() => this.handlePop(record)} plain rect style={{ fontSize: "16px" }}>{this.$T("hipspfm.common.button.view").$D("查看")}</SrmButton>
        },
        {
          formRow: 310,
          fieldCode: "attachmentUuid",
          fieldType: "TEXT",
          fieldName: $T("smodr.apply.model.attachmentUuid").$D("附件"),
          render:(val, record) =>
            <SrmUpload showIcon={false} color="blue"
              descTitle={this.$T("hipspfm.common.button.viewAttachments").$D("查看附件")}
              attachmentUuid={record.attachmentUuid}/>
        },
      ];
    }
  }
};
</script>
<style lang="stylus" scoped>
>>>.srm-form{
  min-height 0px;
}

.comparedScopePopStyle{
  >>> .srm-list-search-line {
    height: 0px;
    padding: 0px;
  }
}
>>> .srm-list-item-card-head-left{
  max-width: 100% !important;
}
.attachment-card {
  position: relative;
  height: 54px;
  border-bottom: 1px solid var(--color-border-default);
  >>> .srm-upload {
    position: absolute;
    height: 100%;
    width: 100%;
  }
  .right-icon {
    position: absolute;
    right: 15px;
    top: 15px;
    color: var(--font-color-disable);
    font-size: 20px;
  }
  .attachment-container {
    pointer-events: none;
    height: 100%;
    .icon {
      color: var(--color-warn);
      margin-left: 15px;
      font-size: 28px;
    }
    .title {
      margin-left: 8px;
    }
    .attachment-type {
      margin-left: 8px;
    }
  }
}
</style>
