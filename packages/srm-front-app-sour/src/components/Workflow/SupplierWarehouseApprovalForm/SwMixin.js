import { $T, DataSet } from "srm-mobile-ui";

import {
  getHeaderCompareApi,
  getContactCompareApi,
  getAddressCompareApi,
  getBankAccountCompareApi,
  getPurchaseHeaderCompareApi,
  getPurchaseLineCompareApi,
  getAttachmentCompareApi,
} from "./api/SupplierWarehouseApproval";
import { getHeaderInfoDS, getContactDS, getAddressDS, getBankAccountDS, getPurchaseLineDS, getAttachmentDS } from "./datasource/getAllTabDS";
import { yesOrNoRenderer } from "@/utils/renderer.js";
import { masterRender, defaultContactRender, enableRender } from "@/components/utils/render";
import { previewFile } from "srm-mobile-ui/src/utils/index";
import { renderFieldNode, getRedFlag } from "./utils/utils";
import { renderUpdateTag } from "@/utils/sslmUtils";

export default {
  props: {
    // changeReqId: {
    //   type: String | Number,
    //   default: "",
    // },
    // 移动表单url携带的参数键值对
    parameters: {
      type: Object,
      default: () => {},
    }
  },
  data() {
    return {
      title: $T("sslm.supplierWarehouse.view.title.simpleSupplierWarehouse").$D("简易供应商入库及变更"),
      initLoading: false,
      loading: false,
      // contactList: [],
      // addressList: [],
      // bankAccountList: [],
      purchaseHeaderInfo: {},
      // purchaseLineList: [],
      // attachmentList: [],
      extSupplierReqId: this.parameters.extSupplierReqId,
      allTabData: {}, // 所有数据
      changeTabData: {}, // 仅变更数据
      notChangeTab: {}, // 未变更的页签
      updateSupplierFlag: false, // 单据变更供应商类型
      tabTableDsList:{}, // ds集合
    };
  },
  async mounted() {
    if (this.extSupplierReqId) {
      this.tabTableDsList = this.createDs();
      try {
        this.initLoading = true;
        // 先查询头信息
        const headInfo = await this.fetchData();
        const { reqTypeCode } = headInfo || {};
        // 如果是变更类型单据，需查询变更前后所有数据， 用于页签标红和隐藏
        const updateSupplier = reqTypeCode === "SUP_UPDATE_REQ";

        this.updateSupplierFlag = updateSupplier;
        this.changeTypeParam.showBtnComp = updateSupplier;

        const params = {
          fetchOnlyChangeData: updateSupplier,
        };
        await Promise.all(
          [
            this.fetchContact(params),
            this.fetchAddress(params),
            this.fetchBankAccount(params),
            this.fetchPurchaseHeader(),
            this.fetchPurchaseLine(params),
            this.fetchAttachment(params),
          ]
        );
        this.loading = true;

      } catch (err) {
        this.initLoading = false;
      } finally {
        this.initLoading = false;

      }
    }
    this.$emit("GetApprovalTitle", this.getLanguageDefine(this.title));
  },
  methods: {
    // 生成ds
    createDs() {
      return {
        headerDs:new DataSet(getHeaderInfoDS()),
        contactDs:new DataSet(getContactDS()),
        addressDs:new DataSet(getAddressDS()),
        bankAccountDs:new DataSet(getBankAccountDS()),
        purchaseLineDs:new DataSet(getPurchaseLineDS()),
        attachmentDs:new DataSet(getAttachmentDS()),
      };
    },
    async fetchData() {
      let headInfo = {};
      await getHeaderCompareApi({
        customizeUnitCode: "SSLM.EASY_SUPPLIER_WAREHOUSE.BASIC_INFO",
        extSupplierReqId: this.extSupplierReqId,
        compare: 2,
      }).then((res) => {
        headInfo = { ...res };
        this.tabTableDsList.headerDs.setData([ { ...res } ]);
        const changeFlag = [ "CREATE", "UPDATE" ].includes(res.objectFlag);
        if (!changeFlag) {
          this.notChangeTab.headInfo = true;
        }
      });
      return headInfo;
    },
    async fetchContact(param = {}) {
      const { fetchOnlyChangeData } = param;
      const commonParam = {
        extSupplierReqId: this.extSupplierReqId,
        customizeUnitCode: "SSLM.EASY_SUPPLIER_WAREHOUSE.CONTACT_INFO",
        page: 0,
        size: 0,
      };
      if (fetchOnlyChangeData) {
        getContactCompareApi({
          ...commonParam,
          showOnlyChange: true,
        }).then((res) => {
          if (res && !res.failed) {
            this.changeTabData.contact = [ ...res ];
            const changeFlag = res.some((i) =>
              [ "CREATE", "UPDATE", "DELETE" ].includes(i.objectFlag)
            );
            if (!changeFlag) {
              this.notChangeTab.contact = true;
            }
          }
        });
      }
      await getContactCompareApi({
        ...commonParam,
        compare: 2,
      }).then((res) => {
        if (res && res.content && res.content.length > 0) {
          const contactList = [ ...res.content ];
          this.tabTableDsList.contactDs.setData(contactList);
          this.allTabData.contact = contactList;
        }
      });
    },
    async fetchAddress(param = {}) {
      const { fetchOnlyChangeData } = param;
      const commonParam = {
        extSupplierReqId: this.extSupplierReqId,
        customizeUnitCode: "SSLM.EASY_SUPPLIER_WAREHOUSE.ADDRESS_INFO",
        page: 0,
        size: 0,
      };
      if (fetchOnlyChangeData) {
        getAddressCompareApi({
          ...commonParam,
          showOnlyChange: true,
        }).then((res) => {
          if (res && !res.failed) {
            this.changeTabData.address = [ ...res ];
            const changeFlag = res.some((i) =>
              [ "CREATE", "UPDATE", "DELETE" ].includes(i.objectFlag)
            );
            if (!changeFlag) {
              this.notChangeTab.address = true;
            }
          }
        });
      }
      await getAddressCompareApi({
        ...commonParam,
        compare: 2,
      }).then((res) => {
        if (res && res.content && res.content.length > 0) {
          const addressList = [ ...res.content ];
          this.tabTableDsList.addressDs.setData(addressList);
          this.allTabData.address = addressList;
        }
      });
    },
    async fetchBankAccount(param = {}) {
      const { fetchOnlyChangeData } = param;
      const commonParam = {
        extSupplierReqId: this.extSupplierReqId,
        customizeUnitCode: "SSLM.EASY_SUPPLIER_WAREHOUSE.BANK_ACCOUNT",
        page: 0,
        size: 0,
      };
      if (fetchOnlyChangeData) {
        await getBankAccountCompareApi({
          ...commonParam,
          showOnlyChange: true,
        }).then((res) => {
          if (res && !res.failed) {
            this.changeTabData.bank = [ ...res ];
            const changeFlag = res.some((i) =>
              [ "CREATE", "UPDATE", "DELETE" ].includes(i.objectFlag)
            );
            if (!changeFlag) {
              this.notChangeTab.bank = true;
            }
          }
        });
      }
      await getBankAccountCompareApi({ ...commonParam, compare: 2 }).then((res) => {
        if (res && res.content && res.content.length > 0) {
          const bankAccountList = [ ...res.content ];
          this.tabTableDsList.bankAccountDs.setData(bankAccountList);
          this.allTabData.bank = bankAccountList;
        }
      });
    },
    async fetchPurchaseHeader() {
      const commonParam = {
        extSupplierReqId: this.extSupplierReqId,
        customizeUnitCode: "SSLM.EASY_SUPPLIER_WAREHOUSE.PURCHASE_HEADER",
        compare: 2,
      };
      this.purchaseHeaderInfo = {};
      await getPurchaseHeaderCompareApi(commonParam).then((res) => {
        if (res) {
          this.purchaseHeaderInfo = { ...res };
          const changeFlag = [ "CREATE", "UPDATE", "DELETE" ].includes(res.objectFlag);
          if (!changeFlag) {
            this.notChangeTab.purchaseHeader = true;
          }
        }
      });
    },
    async fetchPurchaseLine(param = {}) {
      const { fetchOnlyChangeData } = param;
      const commonParam = {
        extSupplierReqId: this.extSupplierReqId,
        customizeUnitCode: "SSLM.EASY_SUPPLIER_WAREHOUSE.PURCHASE_LINE",
        page: 0,
        size: 0,
      };
      if (fetchOnlyChangeData) {
        getPurchaseLineCompareApi({ ...commonParam, showOnlyChange: true }).then((res) => {
          if (res && !res.failed) {
            this.changeTabData.purchaseLine = [ ...res ];
            const changeFlag = res.some((i) =>
              [ "CREATE", "UPDATE", "DELETE" ].includes(i.objectFlag)
            );
            if (!changeFlag) {
              this.notChangeTab.purchaseLine = true;
            }
          }
        });
      }
      await getPurchaseLineCompareApi({ ...commonParam, compare: 2 }).then((res) => {
        if (res && res.content && res.content.length > 0) {
          const purchaseLineList = [ ...res.content ];
          this.tabTableDsList.purchaseLineDs.setData(purchaseLineList);
          this.allTabData.purchaseLine = [ ...res.content ];
        }
      });
    },
    async fetchAttachment(param = {}) {
      const { fetchOnlyChangeData } = param;
      const commonParam = {
        extSupplierReqId: this.extSupplierReqId,
        customizeUnitCode: "SSLM.EASY_SUPPLIER_WAREHOUSE.ATTACHMENT",
        page: 0,
        size: 0,
      };
      if (fetchOnlyChangeData) {
        getAttachmentCompareApi({ ...commonParam, showOnlyChange: true }).then((res) => {
          if (res && !res.failed) {
            this.changeTabData.attachment = [ ...res ];
            const changeFlag = res.some((i) =>
              [ "CREATE", "UPDATE", "DELETE" ].includes(i.objectFlag)
            );
            if (!changeFlag) {
              this.notChangeTab.attachment = true;
            }
          }
        });
      }
      await getAttachmentCompareApi({ ...commonParam, compare: 2 }).then((res) => {
        if (res && res.content && res.content.length > 0) {
          const attachmentList = [ ...res.content ];
          this.tabTableDsList.attachmentDs.setData(attachmentList);
          this.allTabData.attachment = [ ...res.content ];
        }
      });
    },
    // 获取 多语言配置
    getLanguageDefine(key) {
      const languageList = {
        "noData": this.$T("hipspfm.common.view.message.title.noData").$D("暂无数据"),
        "simpleSupplierWarehouse": this.$T("sslm.supplierWarehouse.view.title.simpleSupplierWarehouse").$D("简易供应商入库及变更"),
        "supplierBaseInfo": this.$T("sslm.supplierWarehouse.view.warehous.supplierBaseInfo").$D("供应商基础信息"),
        "contact": this.$T("sslm.supplierWarehouse.view.warehous.contact").$D("联系人"),
        "address": this.$T("sslm.supplierWarehouse.view.warehous.address").$D("地址"),
        "bankAccount": this.$T("sslm.supplierWarehouse.view.warehous.bankAccount").$D("银行账户"),
        "attachment": this.$T("sslm.supplierWarehouse.view.warehous.attachment").$D("附件"),
        "updateAfter": this.$T("sslm.supplierWarehouse.model.title.updateAfter").$D("变更后"),
        "updateBefore": this.$T("sslm.supplierWarehouse.model.title.updateBefore").$D("变更前"),
        "default": this.$T("sslm.supplierWarehouse.view.warehous.default").$D("默认"),
        "enable": this.$T("sslm.supplierWarehouse.model.warehouse.enable").$D("启用"),
        "unEnable": this.$T("sslm.supplierWarehouse.model.warehouse.unEnable").$D("未启用"),
        "mainBankAccount": this.$T("sslm.supplierWarehouse.model.warehouse.mainBankAccount").$D("主账户"),
        "purchaseHeader": this.$T("sslm.supplierInform.view.fixCatalog.purchaseHeaderInform").$D("采购/财务头信息"),
        "purchaseLine": this.$T("sslm.supplierInform.view.fixCatalog.purchaseLineInform").$D("采购/财务行信息"),
        "purchaseInfo": this.$T("sslm.supplierInform.view.fixCatalog.purchaseInform").$D("采购/财务信息"),
      };
      return languageList[key] || `sslm.supplierWarehouse.model.warehouse.${key}`;
    },
    // 获取 标准个性化配置
    getCustomizeCode(key) {
      const codeList = {
        "simpleSupplierWarehouse-supplierBaseInfo": "SMBL.WORKFLOW.SUPPLIER_WAREHOUSE_APPROVAL.BASIC",
        "simpleSupplierWarehouse-contact": "SMBL.WORKFLOW.SUPPLIER_WAREHOUSE_APPROVAL.CONTACT",
        "simpleSupplierWarehouse-address": "SMBL.WORKFLOW.SUPPLIER_WAREHOUSE_APPROVAL.ADDRESS",
        "simpleSupplierWarehouse-bankAccount": "SMBL.WORKFLOW.SUPPLIER_WAREHOUSE_APPROVAL.BANK",
        "simpleSupplierWarehouse-attachment": "SMBL.WORKFLOW.SUPPLIER_WAREHOUSE_APPROVAL.ATTACH",
        "simpleSupplierWarehouse-purchaseHeader": "SMBL.WORKFLOW.SUPPLIER_WAREHOUSE_APPROVAL.PURCHASE_HEADER",
        "simpleSupplierWarehouse-purchaseLine": "SMBL.WORKFLOW.SUPPLIER_WAREHOUSE_APPROVAL.PURCHASE_LINE",
      };
      return codeList[key] || "";
    },
    // 查看单个附件
    showOneAttachment(fileUrl, item) {
      previewFile({
        bucketName: "private-bucket",
        fileUrl: fileUrl,
        fileName: item.description,
      });
    },
    // 获取头信息弹窗字段
    getHeaderModalInfo() {
      const col = [
        {
          fieldName: $T("sslm.supplierWarehouse.model.warehouse.applyNum").$D("申请单号"),
          fieldCode: "reqNumber",
          fieldType: "TEXT",
          formRow: 1,
        },
        // {
        //   fieldName: $T("sslm.supplierWarehouse.model.warehouse.applyStatus").$D("申请状态"),
        //   fieldCode: "reqStatusMeaning",
        //   fieldType: "TEXT",
        //   formRow: 2,
        // },
        {
          fieldName: $T("sslm.supplierWarehouse.model.warehouse.creationTime").$D("创建时间"),
          fieldCode: "creationDate",
          fieldType: "TEXT",
          formRow: 3,
        },
        {
          fieldName: $T("sslm.supplierWarehouse.model.warehouse.applicant").$D("申请人"),
          fieldCode: "creator",
          fieldType: "TEXT",
          formRow: 4,
        },
        {
          fieldName: $T("sslm.supplierWarehouse.model.warehouse.unitName").$D("创建人部门"),
          fieldCode: "unitName",
          fieldType: "TEXT",
          formRow: 4,
        },
        {
          fieldName: $T("sslm.supplierWarehouse.model.warehouse.reqTypeCodeMeaning").$D("单据类型"),
          fieldCode: "reqTypeCodeMeaning",
          fieldType: "TEXT",
          formRow: 5,
          visible: (val, item) => !this.changeTypeParam.activeAll ? getRedFlag({ name: "reqTypeCode", record:item }) : true,
        },
        {
          fieldName: $T("sslm.supplierWarehouse.model.warehouse.supplierNum").$D("供应商编码"),
          fieldCode: "supplierNum",
          fieldType: "TEXT",
          formRow: 6,
        },
        {
          fieldName: $T("sslm.supplierWarehouse.model.warehouse.supplierName").$D("供应商名称"),
          fieldCode: "supplierName",
          fieldType: "TEXT",
          formRow: 7,
        },
        {
          fieldName: $T("sslm.supplierWarehouse.model.warehouse.supplierType").$D("供应商类型"),
          fieldCode: "supplierTypeCode",
          fieldType: "TEXT",
          formRow: 7,
          render:(val, item) => renderFieldNode({ name: "supplierTypeCode", record:item, code:"supplierTypeCodeMeaning", needRed: false }),
          visible: (val, item) => !this.changeTypeParam.activeAll ? getRedFlag({ name: "supplierTypeCode", record:item }) : true,
        },
        {
          fieldName: $T("sslm.supplierWarehouse.model.warehouse.idNumber").$D("证件号码"),
          fieldCode: "idNum",
          fieldType: "TEXT",
          formRow: 8,
        },
        {
          fieldName: $T("sslm.supplierWarehouse.model.warehouse.passport").$D("护照"),
          fieldCode: "passport",
          fieldType: "TEXT",
          formRow: 9,
        },
        {
          fieldName: $T("sslm.supplierWarehouse.model.warehouse.unifiedSocialCode").$D("统一社会信用代码"),
          fieldCode: "unifiedSocialCode",
          fieldType: "TEXT",
          formRow: 10,
        },
        {
          fieldName: $T("sslm.supplierWarehouse.model.warehouse.organizingInstitutionCode").$D("组织机构代码"),
          fieldCode: "organizingInstitutionCode",
          fieldType: "TEXT",
          formRow: 11,
        },
        {
          fieldName: $T("sslm.supplierWarehouse.model.warehouse.dunsCode").$D("邓白氏编码"),
          fieldCode: "dunsCode",
          fieldType: "TEXT",
          formRow: 12,
        },
        {
          fieldName: $T("sslm.supplierWarehouse.model.warehouse.businessRegisteNum").$D("商业注册登记号/税号"),
          fieldCode: "businessRegistrationNumber",
          fieldType: "TEXT",
          formRow: 13,
        },
        {
          fieldName: $T("sslm.supplierWarehouse.model.warehouse.desc").$D("说明"),
          fieldCode: "remark",
          fieldType: "TEXT",
          formRow: 14,
        },
        {
          fieldName: $T("sslm.supplierWarehouse.model.warehouse.externalSystem").$D("来源系统"),
          fieldCode: "externalSystem",
          fieldType: "TEXT",
          formRow: 15,
          visible: (val, item) => !this.changeTypeParam.activeAll ? getRedFlag({ name: "externalSystemName", record:item }) : true,
        },
        // {
        //   fieldName: $T("sslm.supplierWarehouse.model.warehouse.enabledFlag").$D("启用"),
        //   fieldCode: "enabledFlag",
        //   fieldType: "TEXT",
        //   formRow: 17,
        //   render:(val, item) => renderFieldNode({ name: "enabledFlag", record:item, code:"enabledFlagMeaning", needRed: this.updateSupplierFlag }),
        //   visible: (val, item) => !this.changeTypeParam.activeAll ? getRedFlag({ name: "enabledFlag", record:item }) : true,
        // },
      ].map((n) => ({
        visible: (val, item, field) => !this.changeTypeParam.activeAll ? getRedFlag({ name: field.fieldCode, record:item }) : true,
        ...n,
      }));
      return col;
    },
    // 获取采购财务行信息弹窗字段
    getPurchaseLineModalInfo() {
      const col = [
        {
          fieldName: this.$T("sslm.supplierInform.model.supplierInform.organizationCode").$D("采购组织"),
          fieldCode: "organizationCode",
        },
        {
          fieldName: this.$T("sslm.supplierInform.model.supplierInform.organizationName").$D("采购组织名称"),
          fieldCode: "organizationName",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sslm.supplierInform.model.supplierInform.purchaseAgent").$D("采购员"),
          fieldCode: "purchaseAgentId",
          fieldType: "TEXT",
          render:(val, item) => renderFieldNode({ name: "purchaseAgentId", record:item, code:"purchaseAgentName", needRed: false }),
        },
        {
          fieldName: this.$T("sslm.supplierInform.model.supplierInform.termName").$D("付款条款"),
          fieldCode: "termId",
          fieldType: "TEXT",
          render:(val, item) => renderFieldNode({ name: "termId", record:item, code:"termName", needRed: false }),
        },
        {
          fieldName: this.$T("sslm.supplierInform.model.supplierInform.payMethod").$D("付款方式"),
          fieldCode: "typeCode",
          fieldType: "TEXT",
          render:(val, item) => renderFieldNode({ name: "typeCode", record:item, code:"typeName", needRed: false }),
        },
        {
          fieldName: this.$T("spfm.importErp.model.importErp.internationalCondition").$D("国贸条件"),
          fieldCode: "tradeTerms",
          fieldType: "TEXT",
          render:(val, item) => renderFieldNode({ name: "tradeTerms", record:item, code:"tradeTermsMeaning", needRed: false }),
        },
        {
          fieldName: this.$T("spfm.importErp.model.importErp.internationalSite").$D("国贸地点"),
          fieldCode: "tradeTermsSite",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sslm.supplierInform.model.supplierInform.currencyCode").$D("订单货币"),
          fieldCode: "currencyCode",
          fieldType: "TEXT",
          render:(val, item) => renderFieldNode({ name: "currencyCode", record:item, code:"currencyName", needRed: false }),
        },
        {
          fieldName: this.$T("sslm.supplierInform.model.supplierInform.controlAccount").$D("统驭科目"),
          fieldCode: "reconciliationAccount",
          fieldType: "TEXT",
          render:(val, item) => renderFieldNode({ name: "reconciliationAccount", record:item, code:"reconciliationAccountMeaning", needRed: false }),
        },
        {
          fieldName: this.$T("sslm.supplierInform.model.supplierInform.sortNumber").$D("排序码"),
          fieldCode: "sortNumber",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sslm.supplierInform.model.purchase.frozenFlag").$D("采购冻结"),
          fieldCode: "frozenFlag",
          fieldType: "TEXT",
          render: (val) => <span>
            {yesOrNoRenderer(val)}
          </span>
        },
      ];
      return col;
    },
  },
  computed: {
    getColumns() {
      return (name) => {
        switch (name) {
        case "supplierBaseInfo":
          return [
            {
              fieldName: $T("sslm.supplierWarehouse.model.warehouse.applyNum").$D("申请单号"),
              fieldCode: "reqNumber",
              fieldType: "TEXT",
              formRow: 1,
              render: (val, item) => {
                const needRed = this.updateSupplierFlag;
                return (
                  <SrmListHeader showOpenTag={false}>
                    <span style={{ fontWeight:400 }}>{renderFieldNode({ name: "reqNumber", record:item, needRed })}</span>
                    <span slot="right">
                      {item.reqStatusMeaning ?
                        <SrmTag
                          type="success"
                          style={{ marginRight: "8px" }}
                        >
                          {item.reqStatusMeaning}
                        </SrmTag> :
                        ""
                      }
                      <span style="margin-right: 8px">{enableRender(item.enabledFlag)}</span>
                      <span class="srm-icon icon-chevron-right" style={{ fontSize:"16px", color: "#333" }}/>
                    </span>
                  </SrmListHeader>
                );
              },
            },
            // {
            //   fieldName: $T("sslm.supplierWarehouse.model.warehouse.applyStatus").$D("申请状态"),
            //   fieldCode: "reqStatusMeaning",
            //   fieldType: "TEXT",
            //   formRow: 2,
            //   render:(val, item) => renderFieldNode({ name: "reqStatus", record:item, code:"reqStatusMeaning", needRed: this.updateSupplierFlag }),
            //   visible: (val, item) => !this.changeTypeParam.activeAll ? getRedFlag({ name: "reqStatus", record:item }) : true,
            // },
            {
              fieldName: $T("sslm.supplierWarehouse.model.warehouse.creationTime").$D("创建时间"),
              fieldCode: "creationDate",
              fieldType: "TEXT",
              formRow: 3,
            },
            {
              fieldName: $T("sslm.supplierWarehouse.model.warehouse.applicant").$D("申请人"),
              fieldCode: "creator",
              fieldType: "TEXT",
              formRow: 4,
            },
            {
              fieldName: $T("sslm.supplierWarehouse.model.warehouse.unitName").$D("创建人部门"),
              fieldCode: "unitName",
              fieldType: "TEXT",
              formRow: 4,
            },
            {
              fieldName: $T("sslm.supplierWarehouse.model.warehouse.reqTypeCodeMeaning").$D("单据类型"),
              fieldCode: "reqTypeCodeMeaning",
              fieldType: "TEXT",
              formRow: 5,
              render:(val, item) => renderFieldNode({ name: "reqTypeCode", record:item, code:"reqTypeCodeMeaning", needRed: this.updateSupplierFlag }),
              visible: (val, item) => !this.changeTypeParam.activeAll ? getRedFlag({ name: "reqTypeCode", record:item }) : true,
            },
            {
              fieldName: $T("sslm.supplierWarehouse.model.warehouse.supplierNum").$D("供应商编码"),
              fieldCode: "supplierNum",
              fieldType: "TEXT",
              formRow: 6,
            },
            {
              fieldName: $T("sslm.supplierWarehouse.model.warehouse.supplierName").$D("供应商名称"),
              fieldCode: "supplierName",
              fieldType: "TEXT",
              formRow: 7,
            },
            {
              fieldName: $T("sslm.supplierWarehouse.model.warehouse.supplierType").$D("供应商类型"),
              fieldCode: "supplierTypeCode",
              fieldType: "TEXT",
              formRow: 7,
              render:(val, item) => renderFieldNode({ name: "supplierTypeCode", record:item, code:"supplierTypeCodeMeaning", needRed: this.updateSupplierFlag }),
              visible: (val, item) => !this.changeTypeParam.activeAll ? getRedFlag({ name: "supplierTypeCode", record:item }) : true,
            },
            {
              fieldName: $T("sslm.supplierWarehouse.model.warehouse.idNumber").$D("证件号码"),
              fieldCode: "idNum",
              fieldType: "TEXT",
              formRow: 8,
            },
            {
              fieldName: $T("sslm.supplierWarehouse.model.warehouse.passport").$D("护照"),
              fieldCode: "passport",
              fieldType: "TEXT",
              formRow: 9,
            },
            {
              fieldName: $T("sslm.supplierWarehouse.model.warehouse.unifiedSocialCode").$D("统一社会信用代码"),
              fieldCode: "unifiedSocialCode",
              fieldType: "TEXT",
              formRow: 10,
            },
            {
              fieldName: $T("sslm.supplierWarehouse.model.warehouse.organizingInstitutionCode").$D("组织机构代码"),
              fieldCode: "organizingInstitutionCode",
              fieldType: "TEXT",
              formRow: 11,
            },
            {
              fieldName: $T("sslm.supplierWarehouse.model.warehouse.dunsCode").$D("邓白氏编码"),
              fieldCode: "dunsCode",
              fieldType: "TEXT",
              formRow: 12,
            },
            {
              fieldName: $T("sslm.supplierWarehouse.model.warehouse.businessRegisteNum").$D("商业注册登记号/税号"),
              fieldCode: "businessRegistrationNumber",
              fieldType: "TEXT",
              formRow: 13,
            },
            {
              fieldName: $T("sslm.supplierWarehouse.model.warehouse.desc").$D("说明"),
              fieldCode: "remark",
              fieldType: "TEXT",
              formRow: 14,
            },
            {
              fieldName: $T("sslm.supplierWarehouse.model.warehouse.externalSystem").$D("来源系统"),
              fieldCode: "externalSystem",
              fieldType: "TEXT",
              formRow: 15,
              render:(val, item) => renderFieldNode({ name: "externalSystemName", record:item, needRed: this.updateSupplierFlag }),
              visible: (val, item) => !this.changeTypeParam.activeAll ? getRedFlag({ name: "externalSystemName", record:item }) : true,
            },
            // {
            //   fieldName: $T("sslm.supplierWarehouse.model.warehouse.enabledFlag").$D("启用"),
            //   fieldCode: "enabledFlag",
            //   fieldType: "TEXT",
            //   formRow: 17,
            //   render:(val, item) => renderFieldNode({ name: "enabledFlag", record:item, code:"enabledFlagMeaning", needRed: this.updateSupplierFlag }),
            //   visible: (val, item) => !this.changeTypeParam.activeAll ? getRedFlag({ name: "enabledFlag", record:item }) : true,
            // },
          ].map((n) => ({
            render: (val, item, field) => renderFieldNode({ name: field.fieldCode, record:item, needRed: this.updateSupplierFlag }),
            visible: (val, item, field) => !this.changeTypeParam.activeAll ? getRedFlag({ name: field.fieldCode, record:item }) : true,
            ...n,
          }));
        case "contact":
          return [
            {
              fieldName: "contactHead",
              fieldType: "EMPTY",
              formRow: 1,
              render: (val, item) => {
                const needRed = this.updateSupplierFlag;
                const updateTag = needRed ? renderUpdateTag(item) : null;
                return (
                  <SrmListHeader showOpenTag={false}>
                    <span style={{ fontWeight:600 }}>{renderFieldNode({ name: "name", record:item, needRed })}</span>
                    <span slot="right">
                      {item.defaultFlag ?
                        <span style="margin-right: 8px">
                          {defaultContactRender(item.defaultFlag)}
                        </span> :
                        ""
                      }
                      <span style="margin-right: 8px">{enableRender(item.enabledFlag)}</span>
                      {updateTag}
                    </span>
                  </SrmListHeader>
                );
              },
            },
            {
              fieldName: $T("sslm.supplierWarehouse.model.warehouse.idTypeMeaning").$D("证件类型"),
              fieldCode: "idTypeMeaning",
              fieldType: "TEXT",
              formRow: 2,
              render:(val, item) => renderFieldNode({ name: "idType", record:item, code:"idTypeMeaning", needRed: this.updateSupplierFlag }),
            },
            {
              fieldName: $T("sslm.supplierWarehouse.model.warehouse.idNumber").$D("证件号码"),
              fieldCode: "idNumber",
              fieldType: "TEXT",
              formRow: 3,
            },
            {
              fieldName: $T("sslm.supplierWarehouse.model.warehouse.department").$D("部门"),
              fieldCode: "department",
              fieldType: "TEXT",
              formRow: 4,
            },
            {
              fieldName: $T("sslm.supplierWarehouse.model.warehouse.position").$D("职务"),
              fieldCode: "position",
              fieldType: "TEXT",
              formRow: 4,
            },
            {
              fieldName: $T("sslm.supplierWarehouse.model.warehouse.contactTypeMeaning").$D("联系人类型"),
              fieldCode: "contactTypeMeaning",
              fieldType: "TEXT",
              formRow: 5,
              render:(val, item) => renderFieldNode({ name: "contactType", record:item, code:"contactTypeMeaning", needRed: this.updateSupplierFlag }),
            },
            {
              fieldName: $T("sslm.supplierWarehouse.model.warehouse.mobilephone").$D("移动电话"),
              fieldCode: "mobilephone",
              fieldType: "TEXT",
              formRow: 6,
              render: (val, record) =>
                val ? <span
                  style={ this.updateSupplierFlag && (record["mobilephoneFlag"] === "UPDATE" || record["objectFlag"] === "CREATE") ? { "color": "red" } : "" }>
                  {val ? `${record.internationalTelMeaning} | ${val}` : ""}</span> : <span>-</span>
            },
            {
              fieldName: $T("sslm.supplierWarehouse.model.warehouse.mail").$D("邮箱"),
              fieldCode: "mail",
              fieldType: "TEXT",
              formRow: 7,
            },
            {
              fieldName: $T("sslm.supplierWarehouse.model.warehouse.officePhone").$D("办公电话"),
              fieldCode: "officePhone",
              fieldType: "TEXT",
              formRow: 8,
            },
            {
              fieldName: $T("sslm.supplierWarehouse.model.warehouse.remark").$D("备注"),
              fieldCode: "remark",
              fieldType: "TEXT",
              formRow: 9,
            },
          ].map((n) => ({
            render: (val, item, field) => renderFieldNode({ name: field.fieldCode, record:item, needRed: this.updateSupplierFlag }),
            ...n, }));
        case "address":
          return [
            {
              fieldName: $T("sslm.supplierWarehouse.model.warehouse.countryIdMeaning").$D("国家/地区"),
              fieldCode: "countryIdMeaning",
              // fieldType: "EMPTY",
              formRow: 1,
              render: (val, item) => {
                const needRed = this.updateSupplierFlag;
                const updateTag = needRed ? renderUpdateTag(item) : null;
                return (
                  <SrmListHeader showOpenTag={false}>
                    <span style={{ fontWeight:400 }}>{renderFieldNode({ name: "countryIdMeaning", record:item, code: "countryIdMeaning", needRed })}</span>
                    <span slot="right">
                      <span style="margin-right: 8px">{enableRender(item.enabledFlag)}</span>
                      {updateTag}
                    </span>
                  </SrmListHeader>
                );
              },
            },
            {
              fieldName: $T("sslm.supplierWarehouse.model.warehouse.regionPathName").$D("省/市/区"),
              fieldCode: "regionPathName",
              fieldType: "TEXT",
              formRow: 2,
            },
            {
              fieldName: $T("sslm.supplierWarehouse.model.warehouse.detailedAddress").$D("详细地址"),
              fieldCode: "addressDetail",
              fieldType: "TEXT",
              formRow: 3,
            },
            {
              fieldName: $T("sslm.supplierWarehouse.model.warehouse.postCode").$D("邮政编码"),
              fieldCode: "postCode",
              fieldType: "TEXT",
              formRow: 5,
            },
            {
              fieldName: $T("sslm.supplierWarehouse.model.warehouse.remark").$D("备注"),
              fieldCode: "remark",
              fieldType: "TEXT",
              formRow: 6,
            },
          ].map((n) => ({ render: (val, item, field) => renderFieldNode({ name: field.fieldCode, record:item, needRed: this.updateSupplierFlag }), ...n, }));
        case "bankAccount":
          return [
            {
              fieldCode: "countryName",
              fieldName: $T("spfm.bank.model.bank.bankCountry").$D("国家/地区"),
              // fieldType: "EMPTY",
              formRow: 1,
              render: (val, item) => {
                const needRed = this.updateSupplierFlag;
                const updateTag = needRed ? renderUpdateTag(item) : null;
                return (
                  <SrmListHeader showOpenTag={false} class="sslm-bank-field-header" >
                    <span style={{ fontWeight:400 }}>{renderFieldNode({ name: "countryId", record:item, code: "countryName", needRed })}</span>
                    <span slot="right">
                      {item.masterFlag ?
                        <span style="margin-right: 8px">
                          {masterRender(item.masterFlag)}
                        </span> :
                        ""
                      }
                      <span style="margin-right: 8px">{enableRender(item.enabledFlag)}</span>
                      {updateTag}
                    </span>
                  </SrmListHeader>
                );
              },
            },
            {
              fieldName: $T("sslm.supplierWarehouse.model.warehouse.bankCode").$D("银行代码"),
              fieldCode: "bankCode",
              fieldType: "TEXT",
              formRow: 2,
            },
            {
              fieldName: $T("sslm.supplierWarehouse.model.warehouse.bankName").$D("银行名称"),
              fieldCode: "bankName",
              fieldType: "TEXT",
              formRow: 3,
            },
            {
              fieldName: $T("sslm.supplierWarehouse.model.warehouse.bankFirm").$D("联行行号"),
              fieldCode: "bankFirm",
              fieldType: "TEXT",
              formRow: 4,
            },
            {
              fieldName: $T("sslm.supplierWarehouse.model.warehouse.bankBranchName").$D("开户行名称"),
              fieldCode: "bankBranchName",
              fieldType: "TEXT",
              formRow: 5,
            },
            {
              fieldName: $T("sslm.supplierWarehouse.model.warehouse.bankAccountName").$D("账号名称"),
              fieldCode: "bankAccountName",
              fieldType: "TEXT",
              formRow: 6,
            },
            {
              fieldName: $T("sslm.supplierWarehouse.model.warehouse.bankAccount").$D("银行账户"),
              fieldCode: "bankAccountNum",
              fieldType: "TEXT",
              formRow: 7,
            },
            {
              fieldName: $T("sslm.supplierWarehouse.model.warehouse.remark").$D("备注"),
              fieldCode: "remark",
              fieldType: "TEXT",
              formRow: 8,
            },
          ].map((n) => ({ render: (val, item, field) => renderFieldNode({ name: field.fieldCode, record:item, needRed: this.updateSupplierFlag }), ...n, }));
        case "purchaseHeader":
          return [
            {
              fieldName: this.$T("spfm.importErp.model.importErp.planGroups").$D("计划组"),
              fieldCode: "programmeGroups",
              textMeaning: "programmeGroupsMeaning",
              fieldType: "TEXT",
              // render:(val, item) => renderFieldNode({ name: "programmeGroups", record:item, code:"programmeGroupsMeaning", needRed: this.updateSupplierFlag }),
            },
            {
              fieldName: this.$T("sslm.supplierInform.model.supplierInform.schemeGroup").$D("方案组"),
              fieldCode: "schemeGroup",
              fieldType: "TEXT",
            },
            {
              fieldName: this.$T("sslm.supplierInform.model.supplierInform.accountGroup").$D("账户组"),
              fieldCode: "accountGroup",
              fieldType: "TEXT",
              textMeaning: "accountGroupMeaning",
              // render:(val, item) => renderFieldNode({ name: "accountGroup", record:item, code:"accountGroupMeaning", needRed: this.updateSupplierFlag }),
            },
            {
              fieldName: this.$T("sslm.supplierInform.model.supplierInform.controlAccount").$D("统驭科目"),
              fieldCode: "reconciliationAccount",
              fieldType: "TEXT",
              textMeaning: "reconciliationAccountMeaning",
              // render:(val, item) => renderFieldNode({ name: "reconciliationAccount", record:item, code:"reconciliationAccountMeaning", needRed: this.updateSupplierFlag }),
            },
            {
              fieldName: this.$T("sslm.supplierInform.model.supplierInform.erpCompanyCode").$D("erp公司代码"),
              fieldCode: "ouId",
              fieldType: "TEXT",
              textMeaning: "ouCode",
              // render:(val, item) => renderFieldNode({ name: "ouId", record:item, code:"ouCode", needRed: this.updateSupplierFlag }),
            },
            {
              fieldName: this.$T("spfm.importErp.model.importErp.termName").$D("付款条款"),
              fieldCode: "termId",
              fieldType: "TEXT",
              textMeaning: "termIdMeaning",
            },
            {
              fieldName: this.$T("sslm.supplierInform.model.supplierInform.accountFlag").$D("记账冻结"),
              fieldCode: "frozenFlag",
              fieldType: "TEXT",
              render: (val, item) => {
                const redFlag = getRedFlag({ name: "frozenFlag", record:item });
                return <span style={{ color: this.updateSupplierFlag && redFlag && "red" }}>
                  {yesOrNoRenderer(val)}
                </span>;
              }
            },
            {
              fieldName: this.$T("spfm.importErp.model.importErp.paymentFreezeCode").$D("付款冻结代码"),
              fieldCode: "paymentFrozen",
              fieldType: "TEXT",
              textMeaning: "paymentFrozenMeaning",
            },
          ].map((n) => {
            const { textMeaning = "", ...other } = n;
            return {
              render: (val, item, field) => renderFieldNode({ name: field.fieldCode, record:item, code: textMeaning, needRed: this.updateSupplierFlag }),
              visible: (val, item, field) => !this.changeTypeParam.activeAll ? getRedFlag({ name: field.fieldCode, record:item }) : true,
              ...other,
            };
          });
        case "purchaseLine":
          return [
            {
              fieldName: this.$T("sslm.supplierInform.model.supplierInform.organizationCode").$D("采购组织"),
              fieldCode: "organizationCode",
              // fieldType: "EMPTY",
              render: (val, item) => {
                const needRed = this.updateSupplierFlag;
                const updateTag = needRed ? renderUpdateTag(item) : null;
                return (
                  <SrmListHeader showOpenTag={false}>
                    <span style={{ fontWeight:400 }}>{renderFieldNode({ name: "organizationCode", record:item, needRed })}</span>
                    <span slot="right">
                      {updateTag}
                      <span class="srm-icon icon-chevron-right" style={{ fontSize:"16px", marginLeft: "8px", color: "#333" }}/>
                    </span>
                  </SrmListHeader>
                );
              },
            },
            {
              fieldName: this.$T("sslm.supplierInform.model.supplierInform.organizationName").$D("采购组织名称"),
              fieldCode: "organizationName",
              fieldType: "TEXT",
            },
            {
              fieldName: this.$T("sslm.supplierInform.model.supplierInform.purchaseAgent").$D("采购员"),
              fieldCode: "purchaseAgentId",
              fieldType: "TEXT",
              render:(val, item) => renderFieldNode({ name: "purchaseAgentId", record:item, code:"purchaseAgentName", needRed: this.updateSupplierFlag }),
            },
            {
              fieldName: this.$T("sslm.supplierInform.model.supplierInform.termName").$D("付款条款"),
              fieldCode: "termId",
              fieldType: "TEXT",
              render:(val, item) => renderFieldNode({ name: "termId", record:item, code:"termName", needRed: this.updateSupplierFlag }),
            },
            {
              fieldName: this.$T("sslm.supplierInform.model.supplierInform.payMethod").$D("付款方式"),
              fieldCode: "typeCode",
              fieldType: "TEXT",
              render:(val, item) => renderFieldNode({ name: "typeCode", record:item, code:"typeName", needRed: this.updateSupplierFlag }),
            },
            {
              fieldName: this.$T("spfm.importErp.model.importErp.internationalCondition").$D("国贸条件"),
              fieldCode: "tradeTerms",
              fieldType: "TEXT",
              render:(val, item) => renderFieldNode({ name: "tradeTerms", record:item, code:"tradeTermsMeaning", needRed: this.updateSupplierFlag }),
            },
            {
              fieldName: this.$T("spfm.importErp.model.importErp.internationalSite").$D("国贸地点"),
              fieldCode: "tradeTermsSite",
              fieldType: "TEXT",
            },
            {
              fieldName: this.$T("sslm.supplierInform.model.supplierInform.currencyCode").$D("订单货币"),
              fieldCode: "currencyCode",
              fieldType: "TEXT",
              render:(val, item) => renderFieldNode({ name: "currencyCode", record:item, code:"currencyName", needRed: this.updateSupplierFlag }),
            },
            {
              fieldName: this.$T("sslm.supplierInform.model.supplierInform.controlAccount").$D("统驭科目"),
              fieldCode: "reconciliationAccount",
              fieldType: "TEXT",
              render:(val, item) => renderFieldNode({ name: "reconciliationAccount", record:item, code:"reconciliationAccountMeaning", needRed: this.updateSupplierFlag }),
            },
            {
              fieldName: this.$T("sslm.supplierInform.model.supplierInform.sortNumber").$D("排序码"),
              fieldCode: "sortNumber",
              fieldType: "TEXT",
            },
            {
              fieldName: this.$T("sslm.supplierInform.model.purchase.frozenFlag").$D("采购冻结"),
              fieldCode: "frozenFlag",
              fieldType: "TEXT",
              render: (val, item) => {
                const redFlag = getRedFlag({ name: "frozenFlag", record:item });
                return <span style={{ color: this.updateSupplierFlag && redFlag && "red" }}>
                  {yesOrNoRenderer(val)}
                </span>;
              }
            },
          ].map((n) => ({ render: (val, item, field) => renderFieldNode({ name: field.fieldCode, record:item, needRed: this.updateSupplierFlag }), ...n, }));
        case "attachment":
          return [
            {
              fieldName: $T("sslm.supplierWarehouse.model.warehouse.description").$D("附件名称"),
              fieldCode: "description",
              formRow: 1,
              fieldType: "EMPTY",
              render: (val, item) => {
                const needRed = this.updateSupplierFlag;
                const updateTag = needRed ? renderUpdateTag(item) : null;
                return (
                  <SrmListHeader showOpenTag={false}>
                    <span style={{ fontWeight:600 }}>{renderFieldNode({ name: "description", record:item, needRed })}</span>
                    <span slot="right">
                      {updateTag}
                    </span>
                  </SrmListHeader>
                );
              },
            },
            {
              fieldName: $T("sslm.supplierWarehouse.model.warehouse.attachmentSize").$D("附件大小（MB）"),
              fieldCode: "fileSize",
              fieldType: "TEXT",
              formRow: 2,
              render: (val, item) => {
                const redFlag = getRedFlag({ name: "fileSize", record:item });
                return <span style={{ color: this.updateSupplierFlag && redFlag && "red" }}>
                  {val ? (Number(val) / 1024 / 1024).toFixed(3) : "-"}
                </span>;
              }
            },
            {
              fieldName: $T("sslm.supplierWarehouse.model.warehouse.creationDate").$D("上传时间"),
              fieldCode: "creationDate",
              fieldType: "TEXT",
              formRow: 3,
            },
            {
              fieldName: $T("sslm.supplierWarehouse.model.warehouse.uploadUser").$D("上传人"),
              fieldCode: "uploader",
              fieldType: "TEXT",
              formRow: 4,
            },
            {
              fieldName: $T("sslm.supplierWarehouse.model.warehouse.attachmentRemark").$D("附件备注"),
              fieldCode: "remark",
              fieldType: "TEXT",
              formRow: 4,
            },
            {
              fieldName: $T("sslm.supplierWarehouse.model.warehouse.attachment").$D("附件"),
              fieldCode: "attachmentUrl",
              fieldType: "TEXT",
              formRow: 5,
              render:(val, record) => val ? <srm-button style="font-size: 12px;font-weight:400" plain onClick={() => this.showOneAttachment(val, record)}>
                {$T("hzero.common.button.viewAttachment").$D("查看附件")}(1)</srm-button> : "-",
            },
          ].map((n) => ({ render: (val, item, field) => renderFieldNode({ name: field.fieldCode, record:item, needRed: this.updateSupplierFlag }), ...n, }));
        default:
          break;
        }
      };
    },
  }
};