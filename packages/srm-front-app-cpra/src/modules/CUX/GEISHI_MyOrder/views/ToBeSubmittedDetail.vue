<template>
  <!-- 订单工作台 -->
  <div class="detail-container">
    <srm-scroll-tab :margin-bottom="74" :content-scroll="false" :position="'relative'">
      <!-- 订单基础信息 -->
      <srm-scroll-tab-item :label="getLanguageDefine('basicInfo')">
        <srm-list :scrollable="false" height="auto" style="height: auto" :data-set="basicInfoDataSet"
          :columns="getColumns('basicInfo')" />
      </srm-scroll-tab-item>
      <!-- 采购方及采买组织信息 -->
      <srm-scroll-tab-item :label="getLanguageDefine('organization')">
        <srm-list :scrollable="false" height="auto" style="height: auto" :data-set="basicInfoDataSet"
          :columns="getColumns('organization')" />
      </srm-scroll-tab-item>
      <!-- 订单明细信息 -->
      <srm-scroll-tab-item :label="getLanguageDefine('detailInfo')">
        <div style="margin-top: 10px; padding: 0 4vw;">
          <!-- 明细行按钮-批量编辑 -->
          <srm-button :disabled="detailInfoDataSet.selected.length === 0" size="mid" type="primary"
            @click="handleEditorAll">{{ $T("sodr.workspace.view.title.editor.all").$D("批量编辑") }}</srm-button>
        </div>
        <srm-list :scrollable="false" height="auto" style="height: auto" :show-bottom-bar="false"
          :data-set="detailInfoDataSet" :columns="getColumns('detailInfo')" />
      </srm-scroll-tab-item>
      <!-- 收货/收单信息 -->
      <!-- <srm-scroll-tab-item v-if="['CATALOGUE','E-COMMERCE'].includes(headerInfo.poSourcePlatform)" :label="getLanguageDefine('receiptInfo')">
        <receipt-info
          :customize-detail-code="getCodeDefine('receiptDetailInfo')"
          :data-source="headerInfo"/>
      </srm-scroll-tab-item> -->
      <!-- 开票信息 -->
      <!-- <srm-scroll-tab-item v-if="['E-COMMERCE'].includes(headerInfo.poSourcePlatform)" :label="getLanguageDefine('billingInfo')">
        <billing-info
          :customize-detail-code="getCodeDefine('billingDetailInfo')"
          :data-source="headerInfo"/>
      </srm-scroll-tab-item> -->
      <!-- 附件 -->
      <!-- <srm-scroll-tab-item :label="getLanguageDefine('attachInfo')">
        <attachment-info :data-set="basicInfoDataSet" :config="{ readOnly: [false, false, true] }" />
      </srm-scroll-tab-item> -->
      <!-- 操作记录 -->
      <!-- <srm-scroll-tab-item
        v-if="type !== 'add'"
        :label="getLanguageDefine('operationRecord')">
        <div class="record-container">
          <history-record-tiled
            :action-data="operatingData"
            :remark-label="$T('sodr.common.view.tab.operationRecord').$D('操作说明')"
            operation-meaning-field-name="processTypeMeaning"
            process-remark-field-name="processRemark"
            operator-field-name="processUserName"
            process-date-field-name="processedDate"/>
        </div>
      </srm-scroll-tab-item> -->
      <div style="height: 74px;" />
    </srm-scroll-tab>
    <!-- 详情弹框 -->
    <srm-popup :visible.sync="visiblePopup" :position="'right'" :show-header="false" :height="'100%'">
      <srm-form v-if="visiblePopup" customize-type="detail" :data-set="popupData.data"
        :columns="getColumns(popupData.columns)" />
    </srm-popup>
    <!-- BOM弹框 -->
    <srm-popup :visible.sync="visibleBom" :position="'right'" :title="$T('sodr.workspace.view.title.bom').$D('外协BOM')"
      :height="'100%'">
      <bom v-if="visibleBom" :data-source="bomData" />
    </srm-popup>
    <!-- 底部按钮-保存-提交-删除 -->
    <srm-bottom-handler :btn-arr="getButtons" type="tooltip" />
  </div>
</template>

<script>
import { getDynamicLabel } from "../../../../utils";
import Bom from "@/modules/OrderWorkbench/components/Bom";
import { isNil, isEmpty } from "lodash";
import { SrmUtil } from "srm-mobile-ui";
import OrderWorkbenchReleasedMethod from "@/modules/CUX_PART/Method/OrderWorkbenchReleasedMethod";
import { DataSet, $T, SrmBottomHandler } from "srm-mobile-ui";
import { throttle } from "lodash";
import { basicInfoDs, lineDs, detailsFormData } from "../dataSource/index";
import { queryOrderControlConfig, newSave, saveWarn, fetchDelete, submitValidate, submitDetail, addNewSubmitDetail } from "../api/index";
import { associatedPcAndAmountCheck, handleBudgetVerification } from "../store/utiles";
export default {
  modules: ["sodr.workspace", "sodr.common", "hipspfm.common", "hzero.common", "smbl.common", "sprm.common", "sinv.receiptWorkbench", "sinv.receiptExecution", "sinv.receipWorkbench"],
  name: "ToBeSubmittedDetail",
  components: {
    SrmBottomHandler,
    Bom
  },
  extends: OrderWorkbenchReleasedMethod,
  props: {
    parameters: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      poHeaderId: null,
      basicInfoDataSet: new DataSet(basicInfoDs()), // 订单基础信息
      // organizationInfoDs: new DataSet(basicInfoDs()), // 采购组织
      detailInfoDataSet: new DataSet(lineDs()), // 订单明细信息
      operatingData: [], // 操作记录
      visiblePopup: false,
      visibleBom: false,
      popupData: {},
      bomData: {},
      isDoubleUnit: false,
    };
  },
  computed: {
    getButtons() {
      return [ {
        size: "small",
        name: "save",
        type: "success",
        handler: () => {
          this.handleSaveOrSubmit("save", this);
        },
        text: this.$T("sodr.workspace.view.option.save").$D("保存"),
      }, {
        size: "small",
        name: "submit",
        type: "primary",
        handler: () => {
          this.handleSaveOrSubmit("submit", this);
        },
        text: this.$T("sodr.workspace.view.option.submit").$D("提交"),
      }, {
        size: "small",
        name: "delete",
        type: "danger",
        handler: () => {
          this.handleDelete(this);
        },
        text: this.$T("sodr.workspace.view.option.delete").$D("删除"),
      }];
    },
    headerInfo() {
      return this.basicInfoDataSet.current && this.basicInfoDataSet.current?.toData() || {};
    },
  },
  beforeMount() {
    this.type = this.$route.query.type || this.parameters.type;
    this.poHeaderId =
      this.$route.query.poHeaderId || this.parameters.poHeaderId || "";
  },
  mounted() {
    // 编辑/详情
    if (this.poHeaderId) {
      this.init();
    } else {
      this.showPage = false;
      this.$notification.open({
        message: $T("hzero.common.notification.noShow.tips").$D(
          "该单据当前状态不可查看"
        )
      });
    }
  },
  methods: {
    // 处理精度 currency默认为10, quantity默认为6
    getPrecision(precision) {
      const _default = 10;
      const _precision = !isNil(precision) ? Number(precision) : _default;
      return _precision;
    },
    async init() {
      try {
        this.getPoHeader();
        this.getPoLine();
        // this.getActionsRecord();
        // await this.queryDoubleUomConfig();
      } catch (error) {
        this.$notification.open({
          message: error,
        });
      }
    },
    //返回上一页
    goBack() {
      this.$router.back();
    },
    // // 获取业务规则定义-双单位配置
    // async queryDoubleUomConfig() {
    //   await queryDoubleUomConfigApi().then((res) => {
    //     if (res) {
    //       this.isDoubleUnit = Number(res);
    //     }
    //   });
    // },
    boolRender(val) {
      return Number(val) === 1 ? this.$T("hipspfm.common.status.yes").$D("是") : this.$T("hipspfm.common.status.no").$D("否");
    },
    // 多语言配置
    getLanguageDefine(key) {
      const languageList = {
        basicInfo: $T("sodr.workspace.view.panel.orderBasicInfo").$D("订单基础信息"),
        organization: $T("sodr.workspace.view.panel.organization").$D(
          "交易方及采买组织信息"
        ),
        detailInfo: $T("sodr.workspace.view.panel.detailInfo").$D("订单明细信息"),
        receiptInfo: $T("sodr.workspace.view.panel.receiptInfo").$D("收货/收单信息"),
        billingInfo: $T("sodr.workspace.view.panel.billingInfo").$D("开票信息"),
        attachInfo: $T("sodr.workspace.model.common.attachmentUuid").$D("附件"),
        operationRecord: $T("sodr.workspace.view.title.operationHistory").$D("操作记录"),
      };
      return languageList[key] || key;
    },
    // 查询头信息
    async getPoHeader() {
      this.basicInfoDataSet.addPathParameter("poHeaderId", this.poHeaderId);
      this.basicInfoDataSet.setQueryParameter({
        camp: 1,
        poEntryPoint: "PO_MAINTAIN_DETAIL",
        customizeUnitCode: "SODR.WORKSPACE_PURCHASEREQUEST_DETAIL.BASICINFO,SODR.WORKSPACE_PURCHASEREQUEST_DETAIL.ORGANIZATIONINFO,SODR.WORKSPACE_PURCHASEREQUEST_DETAIL.ATTACHMENTINFO,SODR.WORKSPACE_PURCHASEREQUEST_DETAIL.ATTACHMENTINFO_EXTERNAL,SODR.WORKSPACE_PURCHASEREQUEST_DETAIL.PAYMENTTERMINFO",
      });
      await this.basicInfoDataSet.refresh();
      // const { orderTypeCode } = this.basicInfoDataSet.current?.toData() || {};
      // this.basicInfoDataSet.current.setField("attributeVarchar3Meaning", orderTypeCode !== "KJ" ? "否" : null);
      // this.basicInfoDataSet.current.setField("attributeVarchar3", orderTypeCode !== "KJ" ? "0" : null);
    },
    // 查询行信息
    async getPoLine() {
      this.detailInfoDataSet.addPathParameter("poHeaderId", this.poHeaderId);
      this.detailInfoDataSet.setQueryParameter({
        camp: 2,
        sortType: 0,
        customizeUnitCode: "SODR.WORKSPACE_PURCHASEREQUEST_DETAIL.DETAILINFO,SODR.WORKSPACE_PURCHASEREQUEST_DETAIL.DETAILINFO_FILTER",
      });
      this.detailInfoDataSet.refresh();
    },
    // 操作记录查询
    // async getActionsRecord() {
    //   const res = await getActionsRecordApi(this.poHeaderId);
    //   if (res && !res.failed && isArray(res.content)) {
    //     this.operatingData = getRecord(res.content);
    //   }
    // },
    // 点击tab块
    clickDetailInfo(name) {
      switch (name) {
        case "basicInfo":
          this.openDetailPopup("basicInfoDetail", this.basicInfoDataSet);
          break;
        case "organization":
          this.openDetailPopup("organizationDetail", this.basicInfoDataSet);
          break;
        case "detailInfo":
          this.openDetailPopup("detailInfoDetail", this.detailInfoDataSet);
          break;
        default:
          break;
      }
    },
    // 查看BOM
    openBom(record) {
      this.visibleBom = true;
      this.bomData = record;
    },
    // 详情弹框
    async openDetailPopup(name, item) {
      this.popupData = {
        data: item,
        columns: name,
        code: name
      };
      this.visiblePopup = true;
    },
    getColumns(name) {
      switch (name) {
      case "basicInfo":
        return [
          {
            fieldCode: "displayPoNum",
            fieldType: "EMPTY",
            // fieldName: $T("sodr.workspace.model.common.displayPoNum").$D("订单编号"),
            render: (val, item) =>
              <SrmListHeader>
                <span>{item.displayPoNum || "-"}</span>
              </SrmListHeader>,
          },
          {
            fieldCode: "attributeVarchar17",
            fieldName: $T("sodr.workspace.model.common.attributeVarchar17").$D("订单名称"),
            fieldType: "INPUT",
            required: (val, item) => item.orderTypeCode !== "KJ",
          },
          {
            fieldCode: "poTypeId",
            fieldName: $T("sodr.workspace.model.common.poTypeId").$D("订单类型"),
            fieldType: "LOV",
            lovCode: "SPUC_ORDER_TYPE",
            required: true,
            displayField: "poTypeDesc",
            options: {
              displayField: "orderTypeName",
              valueField: "orderTypeId",
              callback: async (val, valueField, displayField, ds) => {
                if (val && val[0]) {
                  // if (val[0].orderTypeCode !== "KJ") {
                  //   ds.current.setField("attributeVarchar3Meaning", "否");
                  //   ds.current.setField("attributeVarchar3", "0");
                  // } else {
                  //   ds.current.setField("attributeVarchar3Meaning", null);
                  //   ds.current.setField("attributeVarchar3", null);
                  // }
                  const stageIdList = await queryOrderControlConfig({
                    poTypeId: val[0]?.orderTypeId,
                    companyId: val[0].companyId,
                  });
                  ds.current.setField("stageIdList", stageIdList);
                  ds.current.setField("orderTypeCode", val[0].orderTypeCode);
                  ds.current.setField("poTypeCode", val[0].orderTypeCode);
                  ds.current.setField("poTypeDesc", val[0].orderTypeName);
                  ds.current.setField("returnOrderFlag", val[0].returnOrderFlag);
                  ds.current.setField("fixedAssetsFlag", val[0].fixedAssetsFlag);
                }
              },
              onClear: (ds) => {
                ds.current.setField("orderTypeCode", null);
                ds.current.setField("poTypeCode", null);
                ds.current.setField("poTypeDesc", null);
                ds.current.setField("returnOrderFlag", null);
                ds.current.setField("fixedAssetsFlag", null);
              }
            }
          },
          {
            fieldCode: "attributeVarchar3",
            fieldName: $T("sodr.workspace.model.common.attributeVarchar3").$D(
              "是否进行电子签章"
            ),
            fieldType: "SELECT",
            lovCode: "HPFM.FLAG.NEW",
            editor: false,
            defaultValue: {
              value: "0",
              meaning: "否",
            },
          },
          {
            fieldCode: "amount",
            fieldName: $T("sodr.workspace.model.common.amounts").$D("总金额(不含税)"),
            fieldType: "INPUT_NUMBER",
            editor: false,
          },
          {
            fieldCode: "taxIncludeAmount",
            fieldName: $T("sodr.workspace.model.common.amountTaxInclude").$D("总金额(含税)"),
            fieldType: "INPUT_NUMBER",
            editor: false,
          },
          {
            fieldCode: "quantityTotal",
            fieldName: $T("sodr.workspace.model.common.quantityTotal").$D("总数量"),
            fieldType: "INPUT_NUMBER",
            editor: false,
          },
          {
            fieldCode: "currencyCode",
            fieldName: $T("sodr.workspace.model.common.currencyCode").$D("币种"),
          },
          {
            fieldCode: "creationDate",
            fieldName: $T("sodr.workspace.model.common.creationTime").$D(
              "创建时间"
            ),
          },
          {
            fieldCode: "termsId",
            fieldName: $T("sodr.workspace.model.common.termsId").$D(
              "付款条款"
            ),
            fieldType: "LOV",
            lovCode: "SMDM.PAYMENT.TERM",
            displayField: "termsName",
            required: true,
            options: {
              displayField: "termName",
              valueField: "termId",
              callback: (val, valueField, displayField, ds) => {
                if (val && val[0]) {
                  ds.current.setField("termsName", val[0].termName);
                }
              },
              onClear: (ds) => {
                ds.current.setField("termsName", null);
              }
            }
          },
          {
            fieldCode: "attributeVarchar16",
            fieldName: $T("sodr.workspace.model.common.attributeVarchar16").$D(
              "盖章类型"
            ),
            fieldType: "SELECT",
            lovCode: "GS-HT-GZLX",
            required: (val, item) => item.orderTypeCode !== "KJ",
          },
          {
            fieldCode: "remark",
            fieldName: $T("sodr.workspace.model.common.remark").$D(
              "备注"
            ),
            maxLength: 480,
            fieldType: "TEXT_AREA",
          },
          {
            fieldCode: "attributeVarchar2",
            fieldName: $T("sodr.workspace.model.common.attributeVarchar2New").$D(
              "预付类型"
            ),
            fieldType: "SELECT",
            lovCode: "GAISHI-PO-YF",
            required: true,
          },
          {
            fieldCode: "attributeDate11",
            fieldName: $T("sodr.workspace.model.common.attributeDate11").$D(
              "合同开始时间"
            ),
            fieldType: "DATE_PICKER",
            required: (val, item) => item.orderTypeCode !== "KJ",
          },
          {
            fieldCode: "attributeDate10",
            fieldName: $T("sodr.workspace.model.common.attributeDate10").$D(
              "结束日期"
            ),
            fieldType: "DATE_PICKER",
            required: (val, item) => item.orderTypeCode !== "KJ",
          },
          {
            fieldCode: "attributeTinyint1",
            fieldName: $T("sodr.workspace.model.common.attributeTinyint1").$D(
              "标准模板"
            ),
            fieldType: "SELECT",
            lovCode: "HPFM.FLAG_XF",
            defaultValue: {
              value: "0",
              meaning: "是",
            },
          },
          {
            fieldCode: "attributeVarchar15",
            fieldName: $T("sodr.workspace.model.common.attributeVarchar15").$D(
              "合同流程类型"
            ),
            fieldType: "SELECT",
            lovCode: "GS-HT-LCLX",
            required: (val, item) => item.orderTypeCode !== "KJ",
          },
          {
            fieldCode: "attributeVarchar18",
            fieldName: $T("sodr.workspace.model.common.attributeVarchar18").$D(
              "合同类型"
            ),
            fieldType: "SELECT",
            lovCode: "PO-HTLX",
            required: (val, item) => item.orderTypeCode !== "KJ",
          },
          {
            fieldCode: "attributeVarchar11",
            fieldName: $T("sodr.workspace.model.common.attributeVarchar11").$D(
              "是否含税"
            ),
            fieldType: "SELECT",
            lovCode: "HPFM.FLAG.NEW",
            required: (val, item) => item.orderTypeCode !== "KJ",
            defaultValue: {
              value: "1",
              meaning: "是",
            },
          },
          {
            fieldCode: "attributeVarchar12",
            fieldName: $T("sodr.workspace.model.common.attributeVarchar12New").$D(
              "是否价外税"
            ),
            fieldType: "SELECT",
            lovCode: "HPFM.FLAG.NEW",
            required: (val, item) => item.orderTypeCode !== "KJ",
            defaultValue: {
              value: "1",
              meaning: "是",
            },
          },
          {
            fieldCode: "attributeLongtext10",
            fieldName: $T("sodr.workspace.model.common.attributeLongtext10").$D(
              "合同说明"
            ),
            fieldType: "INPUT",
            required: (val, item) => item.orderTypeCode !== "KJ",
          },
          {
            fieldCode: "attributeVarchar13",
            fieldName: $T("sodr.workspace.model.common.attributeVarchar13").$D(
              "验收方式"
            ),
            fieldType: "SELECT",
            lovCode: "GS-PO-YSLX",
            required: true,
          },
          {
            fieldCode: "attributeVarchar19",
            fieldName: $T("sodr.workspace.model.common.attributeVarchar19").$D(
              "附件"
            ),
            fieldType: "UPLOAD",
            showCount: true,
            bucketName: "private-bucket",
            canUpload: true,
            required: (val, item) => {
              console.log("val", val);
              
              return item.orderTypeCode !== "KJ";
            },
          },
          {
            fieldCode: "attributeLongtext1",
            fieldName: $T("sodr.workspace.model.common.attributeLongtext1").$D(
              "合同重要条款"
            ),
            fieldType: "TEXT_AREA",
            required: (val, item) => item.orderTypeCode !== "KJ",
          },
          {
            fieldCode: "attributeVarchar9",
            fieldName: $T("sodr.workspace.model.common.attributeVarchar9.NEW").$D(
              "框架合同"
            ),
            fieldType: "LOV",
            lovCode: "SPCM.FRAMEWORK_CONTRACT",
          },
          {
            fieldCode: "attributeVarchar1",
            fieldName: $T("sodr.workspace.model.common.attributeVarchar1").$D(
              "付款比例"
            ),
            fieldType: "INPUT_NUMBER",
            required: true,
          },
          {
            fieldCode: "attributeDate12",
            fieldName: $T("sodr.workspace.model.common.attributeDate12").$D(
              "可销毁日期"
            ),
            fieldType: "DATE_PICKER",
            required: (val, item) => item.orderTypeCode !== "KJ",
          },
          {
            fieldCode: "attributeVarchar4",
            fieldName: $T("sodr.workspace.model.common.attributeVarchar4").$D(
              "档案密级"
            ),
            fieldType: "SELECT",
            lovCode: "GS-HT-DAMJ",
            required: (val, item) => item.orderTypeCode !== "KJ",
          },
          {
            fieldCode: "attributeVarchar5",
            fieldName: $T("sodr.workspace.model.common.attributeVarchar5").$D(
              "币种"
            ),
            fieldType: "LOV",
            lovCode: "SSTA.CURRENCY",
            required: (val, item) => item.orderTypeCode !== "KJ",
          },
          {
            fieldCode: "attributeBigint1",
            fieldName: $T("sodr.workspace.model.common.attributeBigint1").$D(
              "合同份数"
            ),
            fieldType: "INPUT_NUMBER",
            required: (val, item) => item.orderTypeCode !== "KJ",
          },
        ];
      case "organization":
        return [
          {
            fieldCode: "companyName",
            // fieldType: "LOV",
            // lovCode: "SPFM.USER_AUTH.COMPANY",
            // required: true,
            fieldName: $T("sodr.workspace.model.common.company").$D("公司"),
            // disabled: (val, item) => item.unSaveEnable === 0,
            // options: {
            //   displayField: "companyName",
            //   valueField: "companyId",
            //   callback: (val, valueField, displayField, ds) => {
            //     if (val && val[0]) {
            //       ds.current.setField("companyName", val[0].companyName);
            //     }
            //   },
            //   onClear: (ds) => {
            //     ds.current.setField("companyName", null);
            //   }
            // }
          },
          {
            fieldCode: "supplierName",
            // fieldType: "LOV",
            // lovCode: "SODR.AUTH_SUPPLIER_LIFE_CYCLE",
            // required: true,
            fieldName: $T("sodr.workspace.model.common.supplier").$D("供应商"),
            // disabled: (val, item) => item.unSaveEnable === 0,
            // displayField: "supplierName",
            // options: {
            //   displayField: "supplierName",
            //   subDisplayField: "supplierName",
            //   queryParams: (val, item) => {
            //     const stageIds = this.basicInfoDataSet.current.get("stageIdList");
            //     const stageIdList = stageIds && stageIds.split(",");
            //     return {
            //       userId: SrmUtil.getUserInfo().id,
            //       tenantId: SrmUtil.getTenantId(),
            //       pageSource: "SODR",
            //       supplierLovFlag: true,
            //       companyId: item.companyId,
            //       stageIdList,
            //       organizationId: window.localStorage.organizationId,
            //     };
            //   },
            //   callback: (val, valueField, displayField, ds) => {
            //     if (val && val[0]) {
            //       ds.current.setField("displaySupplierName", val[0].displaySupplierName);
            //       ds.current.setField("supplierCompanyId", val[0].supplierCompanyId);
            //       ds.current.setField("supplierCompanyName", val[0].supplierCompanyName);
            //       ds.current.setField("supplierId", val[0].supplierId);
            //       ds.current.setField("supplierCode", val[0].supplierCode);
            //       ds.current.setField("supplierTenantId", val[0].supplierTenantId);
            //     }
            //   },
            //   onClear: (ds) => {
            //     ds.current.setField("displaySupplierName", null);
            //     ds.current.setField("supplierCompanyId", null);
            //     ds.current.setField("supplierCompanyName", null);
            //     ds.current.setField("supplierId", null);
            //     ds.current.setField("supplierCode", null);
            //     ds.current.setField("supplierTenantId", null);
            //   }
            // }
          },
          {
            fieldCode: "ouName",
            // fieldType: "LOV",
            // lovCode: "SPFM.USER_AUTH.OU",
            // required: true,
            fieldName: $T("sodr.workspace.model.common.ouId").$D("业务实体"),
            // disabled: (val, item) => item.unSaveEnable === 0,
            // options: {
            //   displayField: "ouName",
            //   valueField: "ouId",
            //   queryParams: (val, item) => {
            //     return {
            //       tenantId: SrmUtil.getTenantId(),
            //       companyId: item.companyId,
            //       organizationId: window.localStorage.organizationId,
            //     };
            //   },
            //   callback: (val, valueField, displayField, ds) => {
            //     if (val && val[0]) {
            //       ds.current.setField("ouCode", val[0].ouCode);
            //       ds.current.setField("ouName", val[0].ouName);
            //     }
            //   },
            //   onClear: (ds) => {
            //     ds.current.setField("ouCode", null);
            //     ds.current.setField("ouName", null);
            //   }
            // }
          },
          {
            fieldCode: "purchaseOrgName",
            // fieldType: "LOV",
            // lovCode: "SPFM.USER_AUTH.PUR_OUID_ORG",
            // required: true,
            fieldName: $T("sodr.workspace.model.common.purchaseOrgId").$D("采购组织"),
            // disabled: (val, item) => item.unSaveEnable === 0,
            // displayField: "purchaseOrgName",
            // options: {
            //   displayField: "organizationName",
            //   queryParams: (val, item) => {
            //     return {
            //       ouId: item.ouId,
            //       organizationId: window.localStorage.organizationId,
            //     };
            //   },
            //   callback: (val, valueField, displayField, ds) => {
            //     if (val && val[0]) {
            //       ds.current.setField("purchaseOrgId", [{...val[0], purchaseOrgName: val[0].organizationName}]);
            //       ds.current.setField("purchaseOrgCode", val[0].organizationCode);
            //       ds.current.setField("purchaseOrgName", val[0].organizationName);
            //     }
            //   },
            //   onClear: (ds) => {
            //     ds.current.setField("purchaseOrgCode", null);
            //     ds.current.setField("purchaseOrgName", null);
            //   }
            // }
          },
          {
            fieldCode: "agentName",
            // fieldType: "LOV",
            // lovCode: "SPFM.USER_AUTH.PUR_ORG_AGENT",
            // required: true,
            fieldName: $T("sodr.workspace.model.common.agentId").$D("采购员"),
            // disabled: (val, item) => item.unSaveEnable === 0 && item.purchaseOrgId,
            // displayField: "agentName",
            // options: {
            //   displayField: "purchaseAgentName",
            //   queryParams: (val, item) => {
            //     return {
            //       purchaseOrgId: item.purchaseOrgId,
            //       organizationId: window.localStorage.organizationId,
            //     };
            //   },
            //   callback: (val, valueField, displayField, ds) => {
            //     if (val && val[0]) {
            //       ds.current.setField("agentName", val[0].purchaseAgentName);
            //     }
            //   },
            //   onClear: (ds) => {
            //     ds.current.setField("agentName", null);
            //   }
            // }
          },
        ];
      case "detailInfo":
        return [
          {
            formRow: 10,
            fieldCode: "displayLineNum",
            fieldName: $T("sodr.workspace.model.common.displayLineNum").$D("行号"),
          },
          {
            formRow: 20,
            fieldCode: "itemCode",
            fieldType: "LOV",
            fieldName: $T("sodr.workspace.model.common.itemCode").$D("物料编码"),
            lovCode: "SPUC.ITEM_PRICE_CODE",
            // disabled: (val, item) => !isNil(item.prLineItemId),
            options: {
              displayField: "itemCode",
              queryParams: (val, item) => {
                const { supplierCompanyId, companyId, companyNum, orderTypeCode, ouId, ouCode, returnOrderFlag } = this.basicInfoDataSet.current?.toData() || {};
                return {
                  tenantId: SrmUtil.getTenantId(),
                  supplierCompanyId,
                  companyId,
                  companyCode: companyNum,
                  ouId,
                  ouCode,
                  priceShieldFlag: item.returnedFlag !== 1 && returnOrderFlag !== 1 ? item.tieredPricingFlag : null,
                  organizationId: window.localStorage.organizationId,
                  orderTypeCode,
                  invOrganizationId: item.organizationId,
                };
              },
              callback: (val, valueField, displayField, ds) => {
                if (val && val[0]) {
                  ds.current.setField("itemCode", val[0].itemCode);
                  ds.current.setField("itemName", val[0].itemName);
                }
              },
              onClear: (ds) => {
                ds.current.setField("itemCode", null);
                ds.current.setField("itemName", null);
              }
            }
          },
          {
            formRow: 30,
            fieldCode: "itemName",
            required: true,
            fieldType: "INPUT",
            // disabled: (val, item) => item.prLineItemId || item.itemId,
            fieldName: $T("sodr.workspace.model.common.itemName").$D("物料名称"),
          },
          {
            formRow: 40,
            fieldCode: "attributeVarchar10",
            fieldType: "INPUT",
            fieldName: $T("sodr.workspace.model.common.attributeVarchar10").$D("存货代码"),
          },
          {
            formRow: 50,
            fieldCode: "quantity",
            fieldType: "INPUT_NUMBER",
            min: 0,
            max: "99999999999999999999.9999999999",
            fieldName: getDynamicLabel(this.isDoubleUnit, "quantity"),
            precision: (val, record) => Number(this.getPrecision(record.secondaryUomPrecision)),
          },
          {
            formRow: 60,
            fieldCode: "specifications",
            fieldName: $T("sodr.workspace.model.common.specifications").$D("规格"),
          },
          {
            formRow: 60,
            fieldCode: "uomId",
            fieldType: "LOV",
            fieldName: $T("sodr.workspace.model.common.uomId").$D("基本单位"),
            lovCode: "SMDM.UOM",
            required: true,
            // disabled: (val, item) => {
            //   const { doubleUnitEnabled } = this.basicInfoDataSet.current?.toData() || {};
            //   return doubleUnitEnabled || (item.itemId || (item.priceLibraryId && item.uomId));
            // },
            options: {
              displayField: "uomName",
              callback: (val, valueField, displayField, ds) => {
                if (val && val[0]) {
                  ds.current.setField("uomName", val[0].uomName);
                  ds.current.setField("uomCode", val[0].uomCode);
                  ds.current.setField("uomCodeAndName", val[0].uomCodeAndName);
                  ds.current.setField("uomPrecision", val[0].uomPrecision);
                }
              },
              onClear: (ds) => {
                ds.current.setField("uomName", null);
                ds.current.setField("uomCode", null);
                ds.current.setField("uomCodeAndName", null);
                ds.current.setField("uomPrecision", null);
              }
            }
          },
          {
            formRow: 70,
            fieldCode: "needByDate",
            fieldType: "DATE_PICKER",
            fieldName: $T("sodr.workspace.model.common.needByDate").$D("需求日期"),
          },
          {
            formRow: 80,
            fieldCode: "unitPrice",
            fieldName: $T("sodr.workspace.model.common.unitPrice").$D("单价(不含税)"),
          },
          {
            formRow: 80,
            fieldCode: "enteredTaxIncludedPrice",
            fieldName: $T("sodr.workspace.model.common.enteredTaxIncludedPrice").$D("单价(含税)"),
          },
          {
            formRow: 90,
            fieldCode: "taxRate",
            fieldName: $T("sodr.workspace.model.common.taxRate").$D("税率"),
          },
          {
            formRow: 90,
            fieldCode: "currencyCode",
            fieldName: $T("sodr.workspace.model.common.currencyCode").$D("币种"),
          },
          {
            formRow: 100,
            fieldCode: "categoryName",
            fieldName: $T("sodr.workspace.model.common.categoryName").$D("物料分类"),
          },
          {
            formRow: 100,
            fieldCode: "invOrganizationName",
            fieldName: $T("sodr.workspace.model.common.invOrganizationName").$D("库存组织"),
          },
          {
            formRow: 110,
            fieldCode: "displayPrNumAndDisplayPrLineNum",
            fieldName: $T("sodr.workspace.model.common.displayPrNumAndDisplayPrLineNum").$D("采购申请号-行号"),
          },
          {
            formRow: 110,
            fieldCode: "prRequestedName",
            fieldName: $T("sodr.workspace.model.common.prRequestedName").$D("申请人"),
          },
          {
            formRow: 120,
            fieldCode: "receiveToleranceQuantityTypeMeaning",
            fieldType: "SELECT",
            lovCode: "SMDM.ALLOW_EXCESS_ORDER_TYPE",
            required: (val, item) => item.receiveToleranceQuantity && !item.receiveToleranceQuantityType,
            fieldName: $T("sodr.workspace.model.common.receiveToleranceQuantityType").$D("接收允差类型"),
            options: {
              callback: async (val, valueField, displayField, ds) => {
                if (val && val[0]) {
                  ds.current.setField("receiveToleranceQuantityType", val[0].value);
                }
              },
              onClear: (ds) => {
                ds.current.setField("receiveToleranceQuantityType", null);
              },
            },
          },
          {
            formRow: 130,
            fieldCode: "receiveToleranceQuantity",
            fieldType: "INPUT_NUMBER",
            max: "99999999999999999999.9999999999",
            required: (val, item) => item.receiveToleranceQuantity && !item.receiveToleranceQuantityType,
            fieldName: $T("sodr.workspace.model.common.receiveToleranceQuantity").$D("接收允差（%）"),
          },
        ].filter((i) => i);
      default:
        return [];
      }
    },
    // 批量编辑弹窗
    handleEditorAll() {
      const detailsFormDs = new DataSet(detailsFormData()); // 批量编辑弹窗
      detailsFormDs.create({});
      this.editorPopup = this.$popup({
        title: this.$T("sodr.workspace.view.title.editor.all").$D("批量编辑"),
        showHeader: true,
        showClose: true,
        rounded: false,
        height: "100vh",
        content: <div style="display: flex; flex-direction: column;height: 100%">
          <div style="flex: 1;overflow: auto;">
            <srm-form data-set={detailsFormDs} customize-type="detail" columns={[
              {
                fieldCode: "needByDate",
              },
              {
                fieldCode: "taxId",
              },
              {
                fieldCode: "receiveToleranceQuantityType",
              },
              {
                fieldCode: "receiveToleranceQuantity",
              },
            ]}></srm-form>
          </div>
          <div style=" margin-top: auto;justify-content: space-between; height: 7vh; padding: 6px 15px; align-items: center; font-weight: bold; font-size: 16px; color: var(--font-color-default);">
            <srm-button
              fill
              full-width
              style="margin-left: 2px;"
              type="primary"
              size="large"
              onClick={() => this.handleEditorConfirm(this.detailInfoDataSet.selected, detailsFormDs)}
            >
              {$T("sodr.workspace.model.myOrder.button.confirm").$D("确认")}
            </srm-button>
          </div>
        </div>,
      });
    },
    // 批量编辑弹窗 - 确认
    handleEditorConfirm(selected, detailsFormDs) {
      const validateFlag = detailsFormDs.validate();
      if (validateFlag) {
        const { needByDate, taxRate, receiveToleranceQuantityType, receiveToleranceQuantity, receiveToleranceQuantityTypeMeaning } = detailsFormDs.current?.toData() || {};
        selected.forEach((record) => {
          record.setField("needByDate", needByDate);
          record.setField("taxRate", taxRate);
          record.setField("receiveToleranceQuantityType", receiveToleranceQuantityType);
          record.setField("receiveToleranceQuantityTypeMeaning", receiveToleranceQuantityTypeMeaning);
          record.setField("receiveToleranceQuantity", receiveToleranceQuantity);
        });
        this.editorPopup.onClose();
      } else {
        this.$notification.open({ message: this.$T("sodr.workspace.view.message.myOrder.not.null").$D("请填写必填项") });
      }
    },
    // 数据处理
    getValues() {
      const poHeaderDetailDTO = this.basicInfoDataSet.toData()[0];
      const poLineDetailDTOs = this.detailInfoDataSet.toData();
      const values = {
        poHeaderDetailDTO: { ...poHeaderDetailDTO, poWorkbenchFlag: 1 },
        poLineDetailDTOs,
      };
      return values;
    },
    // 头删除
    handleDelete(_this) {
      const headerData = _this.basicInfoDataSet.toData();
      _this.$dialog({
        closable: true,
        content: $T("sodr.workspace.gaishi.view.message.delete.header").$D("确定要删除该订单吗？"),
        async onOk() {
          _this.$loading.show();
          const res = await fetchDelete(headerData);
          if (res && res.failed) {
            _this.$notification.open({
              message: res.message || $T("sodr.workspace.gaishi.gaishi.view.message.receivedOrder.error").$D("接口报错，请检查！"),
            });
            _this.$loading.hide();
            return;
          }
          _this.$notification.open({
            message: $T("sodr.workspace.gaishi.view.message.myOrder.success").$D(
              "数据操作成功!"
            ),
          });
          _this.$loading.hide();
          _this.$router.push({
            name: "OrderWorkbenchList",
          });
        },
      });

    },
    // 头保存和提交
    async handleSaveOrSubmit(type, _this) {
      _this.$loading.show();
      let { poHeaderDetailDTO, poLineDetailDTOs } = _this.getValues();
      const customizeUnitCode = String([
        "SODR.WORKSPACE_PURCHASEREQUEST_DETAIL.BASICINFO",
        "SODR.WORKSPACE_PURCHASEREQUEST_DETAIL.ORGANIZATIONINFO",
        "SODR.WORKSPACE_PURCHASEREQUEST_DETAIL.DETAILINFO",
        "SODR.WORKSPACE_PURCHASEREQUEST_DETAIL.ATTACHMENTINFO",
        "SODR.WORKSPACE_PURCHASEREQUEST_DETAIL.ATTACHMENTINFO_EXTERNAL",
        "SODR.WORKSPACE_PURCHASEREQUEST_DETAIL.PAYMENTTERMINFO",
        "SODR.WORKSPACE_PURCHASEREQUEST_DETAIL.COSTINFORMATION",
      ]);
      // if (!validateLineCalculate({ data: detailInfoDs, type: 'c7n' })) return;
      const validateList = [ _this.basicInfoDataSet, _this.detailInfoDataSet ];
      const status = await validateList.map((i) => i.validate());
      if (status.findIndex((i) => !i) === -1) {
        if (type === "save") {
          const payload = {
            data: { poHeaderDetailDTO, poLineDetailDTOs },
            customizeUnitCode,
          };
          const callback = async () => {
            const res = await newSave(payload);
            if (res && !res.failed) {
              _this.$notification.open({
                message: $T("sodr.workspace.view.message.myOrder.success").$D(
                  "数据操作成功!"
                ),
              });
              console.log(777);
              _this.$loading.hide();
              _this.basicInfoDataSet.refresh();
              _this.detailInfoDataSet.refresh();
              if (res.errorMsg) {
                _this.$dialog({
                  closable: true,
                  content: res.errorMsg,
                });
              }
              if (res.maintainErrorMsg) {
                _this.$dialog({
                  closable: true,
                  content: res.maintainErrorMsg,
                });
              }
            } else {
              console.log(888);
              _this.$loading.hide();
            }
          };
          const ras = await saveWarn(payload);
          if (ras?.failed) {
            console.log(999);
            _this.$loading.hide();
            return false;
          }
          if (ras?.value) {
            _this.$dialog({
              closable: true,
              content: ras.message,
              onOk() {
                throttle(callback, 1500, { trailing: false });
              },
            });
          } else {
            await callback();
          }
        } else {
          const associatedPcAndAmountCheckRes = await associatedPcAndAmountCheck(1, [
            { ...poHeaderDetailDTO, poLineExpVOList: poLineDetailDTOs, saveFlag: 1 },
          ], _this);
          if (!associatedPcAndAmountCheckRes) {
            console.log(121212);
            _this.$loading.hide();
            return;
          }
          const budgetVerificationData = [
            {
              ...poHeaderDetailDTO,
              saveFlag: 1,
              viewCode: "PENDING_DETAIL_VIEW",
              poLineExpVOList: poLineDetailDTOs,
            },
          ];
          const res = await submitValidate({ poHeaderDetailDTO, poLineDetailDTOs });
          if (res && !res.failed) {
            const handleSubmit = async () => {
              const response = await submitDetail({
                data: { poHeaderDetailDTO, poLineDetailDTOs },
                customizeUnitCode,
              });
              if (response && !response.failed) {
                _this.$loading.hide();
                _this.$notification.open({
                  message: $T("sodr.workspace.view.message.myOrder.success").$D(
                    "数据操作成功!"
                  ),
                });
                _this.$router.push({
                  name: "OrderWorkbenchList",
                });
              } else {
                _this.$loading.hide();
              }
            };
            const addNewSubmit = async () => {
              const ras = await addNewSubmitDetail({ poHeaderDetailDTO, poLineDetailDTOs });
              if (res && !res.failed) {
                if (ras.value) {
                  _this.$dialog({
                    closable: true,
                    content: <div
                      // eslint-disable-next-line
                        dangerouslySetInnerHTML={{ __html: res && res.message }}
                    />,
                    onCancel() {
                      return false;
                    }
                  });
                }
                const budgetVerificationRes = await handleBudgetVerification(budgetVerificationData, () => {}, _this);
                if (!budgetVerificationRes) {
                  _this.$loading.hide();
                  return;
                }
                await handleSubmit();
              }
            };
            if (res && !res.failed && res.result) {
              _this.$dialog({
                closable: true,
                content: res && !res.failed && res.result,
                onCancel() {
                  _this.$loading.hide();
                  return false;
                },
              });
            }
            await addNewSubmit();
          }
        }
      } else {
        _this.$notification.open({ message: this.$T("sodr.workspace.view.message.myOrder.not.null").$D("请填写必填项") });
        _this.$loading.hide();
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
.approval-detail-bottom {
  height 72px;
  width 100%;
  margin-bottom: constant(safe-area-inset-top);
  margin-bottom: env(safe-area-inset-top);
  background: var(--background-color-empty-second);
}

>>> .srm-scroll-tab-item-title {
  display: flex;
  justify-content: space-between !important;

}

.line-filter {
  .list-tool-tab {
    width: 100px;
    justify-content flex-end;
  }
  .srm-icon {
    color var(--font-color-disable);
    font-size 20px;
    margin-left: 10px;
  }
}
</style>
