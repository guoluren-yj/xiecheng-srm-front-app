<script>
import { DataSet, SrmUtil } from "srm-mobile-ui";
import { camelCase, snakeCase } from "lodash";
import {
  getInvestigateConfigPreview,
  getInvestigateDetail,
  getInvestgProcessApi,
  getInvestgListApi,
} from "./api";
import validateReference from "./mixins/validateReference";
import HistoryRecordTiled from "@/components/HistoryRecordTiled";
import AiTipSection from "@/components/AiTipSection/AiTipSection.vue";
import CompanyInformation from "../CUX/InvestigationApprovalForm/components/CompanyInformation";

export default {
  modules: [ "sslm.investigCorrelat", "smbl.common", "smbl.workFlow", "sslm.common", "sslm.supplierReview", "sslm.supplierDetail", "sslm.investigationApproval", "hipspfm.common", "cux.investigate", "entity.company", "spfm.enterprise", "spfm.disposeInvite", "spfm.companySearch", "hzero.common", "spfm.certificationApproval", "entity.attachment", "spfm.certificateAuthority" ],
  name: "InvestigationApprovalForm",
  components: { HistoryRecordTiled, CompanyInformation, AiTipSection },
  mixins: [ validateReference ],
  props: {
    parameters: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      investgHeaderId:"",
      investigateTemplateId:"",
      investigateDetail: {},
      investigateConfigLoading: false,
      investigateConfig: {},
      investigateConfigRenderMap: {
        sslmInvestgBasic: this.renderBasic, //基本信息
        sslmInvestgBusiness: this.renderBusiness, //业务信息
        sslmInvestgProservice: this.renderProService, //产品及服务
        sslmInvestgSupplierCate: this.renderSupplierCate, //供应商分类
        sslmInvestgFin: this.renderFinances, //近三年财务状况
        sslmInvestgFinBranch: this.renderFinancesBranches, //分支机构
        sslmInvestgAuth: this.renderAuthes, //资质信息
        sslmInvestgContact: this.renderContacts, //联系人信息
        sslmInvestgAddress: this.renderAddresses, //地址信息
        sslmInvestgBankAccount: this.renderBankAccounts, //开户行信息
        sslmInvestgCustomer: this.renderCustomers, //主要客户情况
        sslmInvestgSubSupplier: this.renderSubSuppliers, //分供方情况
        sslmInvestgEquipment: this.renderEquipments, //设备信息
        sslmInvestgRd: this.renderRds, //研发能力
        sslmInvestgProduce: this.renderProduces, //生产能力
        sslmInvestgQa: this.renderQas, //质保能力
        sslmInvestgCustservice: this.renderCustservices, //售后服务
        sslmInvestgAttachment: this.renderAttachments, //附件信息
        sslmInvestgReserve1: this.renderInvestgReserveTable, //预留表格1
        sslmInvestgReserve2: this.renderInvestgReserveTable, //预留表格2
        sslmInvestgReserve3: this.renderInvestgReserveForm, //预留表单1
        sslmInvestgReserve4: this.renderInvestgReserveForm, //预留表单2
        sslmInvestgReserve5: this.renderInvestgReserveTable, //预留表格3
        sslmInvestgReserve6: this.renderInvestgReserveTable, //预留表格4
        sslmInvestgReserve7: this.renderInvestgReserveTable, //预留表格5
        sslmInvestgReserve8: this.renderInvestgReserveTable, //预留表格6
        sslmInvestgReserve9: this.renderInvestgReserveTable, //预留表格7
        sslmInvestgReserve10: this.renderInvestgReserveForm, //预留表单3
        sslmInvestgReserve11: this.renderInvestgReserveForm, //预留表单4
        sslmInvestgReserve12: this.renderInvestgReserveForm, //预留表单5
        sslmInvestgReserve13: this.renderInvestgReserveForm, //预留表单6
        sslmInvestgReserve14: this.renderInvestgReserveForm, //预留表单7
      },
      basicInfo: null,
      componentMap: {
        Input: "INPUT",
        InputNumber: "INPUT_NUMBER",
        ValueList: "SELECT",
        Lov: "LOV",
        Checkbox: "TEXT",
        Switch: "TEXT",
        TextArea: "INPUT", // 多行文本转为输入框，不然样式有问题
      },
      basicDS: null,
      businessDS: null,
      proServiceDS: null,
      supplierCateDS: null,
      financesDS: null,
      financesBranchesDS: null,
      authesDS: null,
      contactsDS: null,
      addressesDS: null,
      bankAccountsDS: null,
      customersDS: null,
      subSuppliersDS: null,
      equipmentsDS: null,
      rdsDS: null,
      producesDS: null,
      qasDS: null,
      custservicesDS: null,
      attachmentsDS: null,
      sslmInvestgReserve1DS: null,
      sslmInvestgReserve2DS: null,
      sslmInvestgReserve3DS: null,
      sslmInvestgReserve4DS: null,
      sslmInvestgReserve5DS: null,
      sslmInvestgReserve6DS: null,
      sslmInvestgReserve7DS: null,
      sslmInvestgReserve8DS: null,
      sslmInvestgReserve9DS: null,
      sslmInvestgReserve10DS: null,
      sslmInvestgReserve11DS: null,
      sslmInvestgReserve12DS: null,
      sslmInvestgReserve13DS: null,
      sslmInvestgReserve14DS: null,
      // 操作记录
      operationRecord: [],
    };
  },
  computed: {
    // 海亮标准二开
    isHaiLiangCux() {
      return SrmUtil.getTenantNum() === "SRM-HAILIANG"; // 诸暨海亮供应链管理有限公司
    },
  },
  mounted() {
    this.investgHeaderId = this.parameters.investgHeaderId;
    this.investigateTemplateId = this.parameters.investigateTemplateId;
    // console.log("传参：", this.investgHeaderId, this.investigateTemplateId);
    this.fetchDetail();
    this.fetchConfig();
  },
  methods: {
    async getInvestgProcessInfo() {
      const params = {
        investgHeaderId: this.investgHeaderId,
        organizationId: SrmUtil.getTenantId(),
        page: 0,
        size: 10,
      };
      await getInvestgProcessApi(params).then((res) => {
        this.operationRecord = res.content || [];
      });
    },
    getInvestigateDetailColumns() {
      return [ {
        formRow: 10,
        fieldCode: "companyName",
        fieldName: this.$T("sslm.common.view.company.companyName").$D("公司名称"),
      }, {
        formRow: 20,
        fieldCode: "supplierZhOrEnCompanyNum",
        fieldName: this.$T("sslm.common.model.supplierName").$D("供应商名称"),
      }, {
        formRow: 30,
        fieldCode: "investigateTemplateName",
        fieldName: this.$T("sslm.common.model.investigate.template.name").$D("调查表模板名称"),
      }, {
        formRow: 40,
        fieldCode: "createUserRealName",
        fieldName: this.$T("sslm.common.view.creator.name").$D("创建人"),
      }, {
        formRow: 40,
        fieldCode: "unitName",
        fieldName: this.$T("sslm.common.view.creator.unitName").$D("创建人部门"),
      }, {
        formRow: 50,
        fieldCode: "releaseDate",
        fieldName: this.$T("sslm.supplierReview.model.supplierReview.processDate").$D("发布日期"),
      }, {
        formRow: 60,
        fieldCode: "submitDate",
        fieldName: this.$T("sslm.common.view.message.submitDate").$D("提交时间"),
      }, {
        formRow: 70,
        fieldCode: "remark",
        fieldName: this.$T("sslm.common.model.investigate.remark").$D("调查说明"),
      }, {
        formRow: 80,
        fieldCode: "partnerRemark",
        fieldName: this.$T("sslm.common.model.feedback.remark").$D("反馈备注"),
      },
      this.isHaiLiangCux && {
        formRow: 90,
        fieldCode: "supCertification",
        fieldName: this.$T("cux.investigate.model.investigate.supplierCertificationInfo").$D("供应商认证信息"),
        // eslint-disable-next-line arrow-body-style
        render: (val, record) => {
          return <srm-button plain onClick={(e) => {
            e.stopPropagation();
            this.viewIsupCertification(record);
          }}>
            { this.$T("smbl.common.view.button.view").$D("查看") }
          </srm-button>;
        }
      } ].filter(Boolean);
    },
    viewIsupCertification(record) {
      this.$popup({
        title: this.$T("cux.investigate.model.investigate.supplierCertificationInfo").$D("供应商认证信息"),
        showHeader: true,
        showClose: false,
        position: "right",
        headerAlign: "start",
        showBack: true,
        content: <CompanyInformation basicInfo={record}/>
      });
    },
    fetchDetail() {
      this.$loading.show();
      getInvestigateDetail(this.investgHeaderId).then((res) => {
        this.investigateDetail = res || {};
      }).finally(() => {
        this.$loading.hide();
      });
      this.getInvestgProcessInfo();
    },
    fetchConfig() {
      this.investigateConfigLoading = true;
      getInvestigateConfigPreview(this.investigateTemplateId).then((res = {}) => {
        const investigateConfigHeaders = res.investigateConfigHeaders || [];
        // 获取配置
        this.config = this.dealConfigData(res);
        const newInvestigateConfigHeaders = [];
        for (let i = 0; i < investigateConfigHeaders.length; i++) {
          let header = investigateConfigHeaders[i];
          const next = i < investigateConfigHeaders.length - 1 && investigateConfigHeaders[i + 1];
          // 目前仅【产品及服务】【联系人及地址】存在分组
          if (header.configName === "sslmInvestgProservice" && next.configName === "sslmInvestgSupplierCate") {
            header = {
              configDescription: header.configDescription, //产品及服务
              children: [ header, next ]
            };
            i++;
          }
          if (header.configName === "sslmInvestgContact" && next.configName === "sslmInvestgAddress") {
            header = {
              configDescription: this.$T("sslm.supplierDetail.view.sslmInvestgContact").$D("联系人及地址"),
              children: [ header, next ]
            };
            i++;
          }
          newInvestigateConfigHeaders.push(header);
          res.investigateConfigHeaders = newInvestigateConfigHeaders;
        }
        this.investigateConfig = res;
      }).finally(() => {
        this.investigateConfigLoading = false;
      });
    },
    checkUploadUrlType(investgCfLineId, investigateConfigComponents) {
      const investigateConfig = investigateConfigComponents.filter((e) => e.investgCfLineId === investgCfLineId && e.attributeName === "isAttachmentUrl");
      return investigateConfig[0] ? investigateConfig[0].attributeValue : false;
      // attributeValue
    },
    getCustomColumns(investgCfHeaderId) {
      return this.investigateConfig.investigateConfigLines
        .filter((e) => e.investgCfHeaderId === investgCfHeaderId)
        .map((e) => {
          let isUploadUrlFlag = false;
          // 校验是否开启url上传模式
          if (e.componentType === "Upload") {
            isUploadUrlFlag = this.checkUploadUrlType(e.investgCfLineId, this.investigateConfig.investigateConfigComponents);
          }
          if (isUploadUrlFlag) {
            return {
              fieldCode: camelCase(e.fieldCode),
              fieldName: e.fieldDescription,
              render: (val, item) =>
                <span style="color: var(--color-other-default-b);"
                  on-click={(n) => {
                    n.stopPropagation();
                    // eslint-disable-next-line no-undef
                    let attachmentList = item.attachment;
                    this.$showFileList({
                      fileList: attachmentList.map((attachment) => ({
                        fileUrl: attachment.attachmentUrl,
                        fileName: attachment.attachmentDesc,
                        fileSize: attachment.attachmentSize,
                        creationDate: attachment.creationDate,
                        bucketName: "private-bucket",
                      }))
                    });
                  }}>
                  { this.$T("hipspfm.common.message.title.viewAttachment").$D("附件查看") }
                </span>,
            };
          }
          return {
            fieldCode: camelCase(e.fieldCode),
            fieldType: this.componentMap[e.componentType] || snakeCase(e.componentType).toUpperCase(),
            fieldName: e.fieldDescription,
            editor: false,
            render: [ "Checkbox", "Switch" ].includes(e.componentType) ? (val) => {
              if (Number(val)) {
                return this.$T("smbl.common.view.yes").$D("是");
              }
              return this.$T("smbl.common.view.no").$D("否");
            } : null,
          };

        });
    },
    getDefaultDataSet(queryUrl, columns) {
      const config = {
        autoQuery: true,
        selection: Infinity,
        pageSize: 10,
        editable: false,
        enableQuery: false,
        showTotalCount: false,
        queryParameter: { tenantId: SrmUtil.getTenantId() },
        pathParameter: { tenantId: SrmUtil.getTenantId() },
        fields: columns,
        events: {},
        transport: {
          read: {
            url: queryUrl,
            method: "get",
          },
        },
      };
      return new DataSet(config);
    },
    openDetailPopup(dataSet, columns) {
      this.$popup({
        title: this.$T("smbl.common.message.detailInfo").$D("明细信息详情"),
        showHeader: true,
        showClose: false,
        position: "right",
        headerAlign: "start",
        showBack: true,
        content: <SrmForm
          style="padding: 0 15px;"
          customizeType="detail"
          columns={columns}
          dataSet={dataSet}/>,
      });
    },
    renderBasic(config) {
      const { investgCfHeaderId } = config;
      const columns = this.getCustomColumns(investgCfHeaderId);
      !this.basicDS && (this.basicDS = this.getDefaultDataSet("/sslm/v1/{tenantId}/investigate-basics", columns));
      this.basicDS.addQueryParameter("investgHeaderId", this.investgHeaderId);
      this.validateReferenceRange(this.basicDS.data, "sslmInvestgBasic");
      return <SrmForm
        dataSet={this.basicDS}
        nativeOnClick={() => columns.length > 10 ? this.openDetailPopup(this.basicDS, columns) : null}
        columns={columns.slice(0, 10)}/>;
    },
    renderBusiness(config) {
      const { investgCfHeaderId } = config;
      const columns = this.getCustomColumns(investgCfHeaderId);
      !this.businessDS && (this.businessDS = this.getDefaultDataSet("/sslm/v1/{tenantId}/investigate-businesses", columns));
      this.businessDS.addQueryParameter("investgHeaderId", this.investgHeaderId);
      this.validateReferenceRange(this.businessDS.data, "sslmInvestgBusiness");
      return <SrmForm
        dataSet={this.businessDS}
        nativeOnClick={() => columns.length > 10 ? this.openDetailPopup(this.businessDS, columns) : null}
        columns={columns.slice(0, 10)}/>;
    },
    renderProService(config) {
      const { investgCfHeaderId } = config;
      const columns = this.getCustomColumns(investgCfHeaderId);
      !this.proServiceDS && (this.proServiceDS = this.getDefaultDataSet("/sslm/v1/{tenantId}/investigate-proservices/page", columns));
      this.proServiceDS.addQueryParameter("investgHeaderId", this.investgHeaderId);
      this.validateReferenceRange(this.proServiceDS.data, "sslmInvestgProservice");
      return <SrmList
        scrollable={false}
        dataSet={this.proServiceDS}
        onItemClick={() => columns.length > 10 ? this.openDetailPopup(this.proServiceDS, columns) : null}
        columns={columns.slice(0, 10)}/>;
    },
    renderSupplierCate(config) {
      const { investgCfHeaderId } = config;
      const columns = this.getCustomColumns(investgCfHeaderId);
      !this.supplierCateDS && (this.supplierCateDS = this.getDefaultDataSet("/sslm/v1/{tenantId}/investg-supplier-cates", columns));
      this.supplierCateDS.addQueryParameter("investgHeaderId", this.investgHeaderId);
      this.validateReferenceRange(this.supplierCateDS.data, "sslmInvestgSupplierCate");
      return <SrmList
        scrollable={false}
        dataSet={this.supplierCateDS}
        onItemClick={() => columns.length > 10 ? this.openDetailPopup(this.supplierCateDS, columns) : null}
        columns={columns.slice(0, 10)}/>;
    },
    renderFinances(config) {
      const { investgCfHeaderId } = config;
      const columns = this.getCustomColumns(investgCfHeaderId);
      !this.financesDS && (this.financesDS = this.getDefaultDataSet("/sslm/v1/{tenantId}/investigate-finances", columns));
      this.financesDS.addQueryParameter("investgHeaderId", this.investgHeaderId);
      this.validateReferenceRange(this.financesDS.data, "sslmInvestgFin");
      return <SrmList
        scrollable={false}
        dataSet={this.financesDS}
        onItemClick={() => columns.length > 10 ? this.openDetailPopup(this.financesDS, columns) : null}
        columns={columns.slice(0, 10)}/>;
    },
    renderFinancesBranches(config) {
      const { investgCfHeaderId } = config;
      const columns = this.getCustomColumns(investgCfHeaderId);
      if (!this.financesBranchesDS) {
        this.financesBranchesDS = this.getDefaultDataSet("/sslm/v1/{tenantId}/investigate-finances-branchs", columns);
        this.financesBranchesDS.events.afterQuery = (ds, data) => {
          data && data.forEach((e) => {
            e.mobilephone = `${e.internationalTelMeaning}|${e.mobilephone}`;
          });
        };
      }
      this.financesBranchesDS.addQueryParameter("investgHeaderId", this.investgHeaderId);
      this.validateReferenceRange(this.financesBranchesDS.data, "sslmInvestgFinBranch");
      return <SrmList
        scrollable={false}
        dataSet={this.financesBranchesDS}
        onItemClick={() => columns.length > 10 ? this.openDetailPopup(this.financesBranchesDS, columns) : null}
        columns={columns.slice(0, 10)}/>;
    },
    renderAuthes(config) {
      const { investgCfHeaderId } = config;
      const columns = this.getCustomColumns(investgCfHeaderId);
      !this.authesDS && (this.authesDS = this.getDefaultDataSet("/sslm/v1/{tenantId}/investigate-authes", columns));
      this.authesDS.addQueryParameter("investgHeaderId", this.investgHeaderId);
      this.validateReferenceRange(this.authesDS.data, "sslmInvestgAuth");
      return <SrmList
        scrollable={false}
        dataSet={this.authesDS}
        onItemClick={() => columns.length > 10 ? this.openDetailPopup(this.authesDS, columns) : null}
        columns={columns.slice(0, 10)}/>;
    },
    renderContacts(config) {
      const { investgCfHeaderId } = config;
      const columns = this.getCustomColumns(investgCfHeaderId);
      if (!this.contactsDS) {
        this.contactsDS = this.getDefaultDataSet("/sslm/v1/{tenantId}/investigate-contacts", columns);
        this.contactsDS.events.afterQuery = (ds, data) => {
          data && data.forEach((e) => {
            e.mobilephone = `${e.internationalTelMeaning}|${e.mobilephone}`;
            e.genderMeaning = e.genderMeaning || e.gender || "-";
          });
        };
      }
      this.contactsDS.addQueryParameter("investgHeaderId", this.investgHeaderId);
      this.validateReferenceRange(this.contactsDS.data, "sslmInvestgContact");
      return <SrmList
        scrollable={false}
        dataSet={this.contactsDS}
        onItemClick={() => columns.length > 10 ? this.openDetailPopup(this.contactsDS, columns) : null}
        columns={columns.slice(0, 10)}/>;
    },
    renderAddresses(config) {
      const { investgCfHeaderId } = config;
      const columns = this.getCustomColumns(investgCfHeaderId);
      if (!this.addressesDS) {
        this.addressesDS = this.getDefaultDataSet("/sslm/v1/{tenantId}/investigate-addresses", columns);
        this.addressesDS.events.afterQuery = (ds, data) => {
          data && data.forEach((e) => {
            e.regionId = e.regionPathName;
          });
        };
      }
      this.addressesDS.addQueryParameter("investgHeaderId", this.investgHeaderId);
      this.validateReferenceRange(this.addressesDS.data, "sslmInvestgAddress");
      return <SrmList
        scrollable={false}
        dataSet={this.addressesDS}
        onItemClick={() => columns.length > 10 ? this.openDetailPopup(this.addressesDS, columns) : null}
        columns={columns.slice(0, 10)}/>;
    },
    renderBankAccounts(config) {
      const { investgCfHeaderId } = config;
      const columns = this.getCustomColumns(investgCfHeaderId);
      !this.bankAccountsDS && (this.bankAccountsDS = this.getDefaultDataSet("/sslm/v1/{tenantId}/investigate-bank-accounts", columns));
      this.bankAccountsDS.addQueryParameter("investgHeaderId", this.investgHeaderId);
      this.validateReferenceRange(this.bankAccountsDS.data, "sslmInvestgBankAccount");
      return <SrmList
        scrollable={false}
        dataSet={this.bankAccountsDS}
        onItemClick={() => columns.length > 10 ? this.openDetailPopup(this.bankAccountsDS, columns) : null}
        columns={columns.slice(0, 10)}/>;
    },
    renderCustomers(config) {
      const { investgCfHeaderId } = config;
      const columns = this.getCustomColumns(investgCfHeaderId);
      !this.customersDS && (this.customersDS = this.getDefaultDataSet("/sslm/v1/{tenantId}/investigate-customers", columns));
      this.customersDS.addQueryParameter("investgHeaderId", this.investgHeaderId);
      this.validateReferenceRange(this.customersDS.data, "sslmInvestgCustomer");
      return <SrmList
        scrollable={false}
        dataSet={this.customersDS}
        onItemClick={() => columns.length > 10 ? this.openDetailPopup(this.customersDS, columns) : null}
        columns={columns.slice(0, 10)}/>;
    },
    renderSubSuppliers(config) {
      const { investgCfHeaderId } = config;
      const columns = this.getCustomColumns(investgCfHeaderId);
      !this.subSuppliersDS && (this.subSuppliersDS = this.getDefaultDataSet("/sslm/v1/{tenantId}/investigate-sub-suppliers", columns));
      this.subSuppliersDS.addQueryParameter("investgHeaderId", this.investgHeaderId);
      this.validateReferenceRange(this.subSuppliersDS.data, "sslmInvestgSubSupplier");
      return <SrmList
        scrollable={false}
        dataSet={this.subSuppliersDS}
        onItemClick={() => columns.length > 10 ? this.openDetailPopup(this.subSuppliersDS, columns) : null}
        columns={columns.slice(0, 10)}/>;
    },
    renderEquipments(config) {
      const { investgCfHeaderId } = config;
      const columns = this.getCustomColumns(investgCfHeaderId);
      !this.equipmentsDS && (this.equipmentsDS = this.getDefaultDataSet("/sslm/v1/{tenantId}/investigate-equipments", columns));
      this.equipmentsDS.addQueryParameter("investgHeaderId", this.investgHeaderId);
      this.validateReferenceRange(this.equipmentsDS.data, "sslmInvestgEquipment");
      return <SrmList
        scrollable={false}
        dataSet={this.equipmentsDS}
        onItemClick={() => columns.length > 10 ? this.openDetailPopup(this.equipmentsDS, columns) : null}
        columns={columns.slice(0, 10)}/>;
    },
    renderRds(config) {
      const { investgCfHeaderId } = config;
      const columns = this.getCustomColumns(investgCfHeaderId);
      !this.rdsDS && (this.rdsDS = this.getDefaultDataSet("/sslm/v1/{tenantId}/investigate-rds", columns));
      this.rdsDS.addQueryParameter("investgHeaderId", this.investgHeaderId);
      this.validateReferenceRange(this.rdsDS.data, "sslmInvestgRd");
      return <SrmForm
        dataSet={this.rdsDS}
        nativeOnClick={() => columns.length > 10 ? this.openDetailPopup(this.rdsDS, columns) : null}
        columns={columns.slice(0, 10)}/>;
    },
    renderProduces(config) {
      const { investgCfHeaderId } = config;
      const columns = this.getCustomColumns(investgCfHeaderId);
      !this.producesDS && (this.producesDS = this.getDefaultDataSet("/sslm/v1/{tenantId}/investigate-produces", columns));
      this.producesDS.addQueryParameter("investgHeaderId", this.investgHeaderId);
      this.validateReferenceRange(this.producesDS.data, "sslmInvestgProduce");
      return <SrmForm
        dataSet={this.producesDS}
        nativeOnClick={() => columns.length > 10 ? this.openDetailPopup(this.producesDS, columns) : null}
        columns={columns.slice(0, 10)}/>;
    },
    renderQas(config) {
      const { investgCfHeaderId } = config;
      const columns = this.getCustomColumns(investgCfHeaderId);
      !this.qasDS && (this.qasDS = this.getDefaultDataSet("/sslm/v1/{tenantId}/investigate-qas", columns));
      this.qasDS.addQueryParameter("investgHeaderId", this.investgHeaderId);
      this.validateReferenceRange(this.qasDS.data, "sslmInvestgQa");
      return <SrmForm
        dataSet={this.qasDS}
        nativeOnClick={() => columns.length > 10 ? this.openDetailPopup(this.qasDS, columns) : null}
        columns={columns.slice(0, 10)}/>;
    },
    renderCustservices(config) {
      const { investgCfHeaderId } = config;
      const columns = this.getCustomColumns(investgCfHeaderId);
      !this.custservicesDS && (this.custservicesDS = this.getDefaultDataSet("/sslm/v1/{tenantId}/investigate-custservices", columns));
      this.custservicesDS.addQueryParameter("investgHeaderId", this.investgHeaderId);
      this.validateReferenceRange(this.custservicesDS.data, "sslmInvestgCustservice");
      return <SrmForm
        dataSet={this.custservicesDS}
        nativeOnClick={() => columns.length > 10 ? this.openDetailPopup(this.custservicesDS, columns) : null}
        columns={columns.slice(0, 10)}/>;
    },
    renderAttachments(config) {
      const { investgCfHeaderId } = config;
      const columns = this.getCustomColumns(investgCfHeaderId);
      if (!this.attachmentsDS) {
        this.attachmentsDS = this.getDefaultDataSet("/sslm/v1/{tenantId}/investigate-attachments", columns);
        this.attachmentsDS.events.afterQuery = (ds, data) => {
          data && data.forEach((e) => {
            e.attachmentType = e.attachmentTypeMeaning;
          });
        };
      }
      this.attachmentsDS.addQueryParameter("investgHeaderId", this.investgHeaderId);
      this.validateReferenceRange(this.attachmentsDS.data, "sslmInvestgAttachment");
      return <SrmList
        scrollable={false}
        dataSet={this.attachmentsDS}
        columns={columns}/>;
    },
    renderInvestgReserveTable(config) {
      const { investgCfHeaderId, configName } = config;
      const columns = this.getCustomColumns(investgCfHeaderId);
      if (!this[`${configName}DS`]) {
        this[`${configName}DS`] = this.getDefaultDataSet(getInvestgListApi(configName), columns);
      }
      this[`${configName}DS`].addQueryParameter("investgHeaderId", this.investgHeaderId);
      this.validateReferenceRange(this[`${configName}DS`].data, configName);
      return <SrmList
        dataSet={this[`${configName}DS`]}
        nativeOnClick={() => columns.length > 10 ? this.openDetailPopup(this[`${configName}DS`], columns) : null}
        columns={columns.slice(0, 10)}/>;
    },
    renderInvestgReserveForm(config) {
      const { investgCfHeaderId, configName } = config;
      const columns = this.getCustomColumns(investgCfHeaderId);
      if (!this[`${configName}DS`]) {
        this[`${configName}DS`] = this.getDefaultDataSet(getInvestgListApi(configName), columns);
      }
      this[`${configName}DS`].addQueryParameter("investgHeaderId", this.investgHeaderId);
      this.validateReferenceRange(this[`${configName}DS`].data, configName);
      return <SrmForm
        dataSet={this[`${configName}DS`]}
        nativeOnClick={() => columns.length > 10 ? this.openDetailPopup(this[`${configName}DS`], columns) : null}
        columns={columns.slice(0, 10)}/>;
    },
  },
  render() {
    return <div style="height: calc(100vh - 250px)">
      <SrmScrollTab contentScroll>
        <AiTipSection
          v-if={this.investigateDetail.aiApproveStatus}
          aiApproveStatus={this.investigateDetail.aiApproveStatus}
          aiReviewParams={this.investigateDetail.aiApproveDTOList} />
        <SrmScrollTabItem label={this.$T("sslm.supplierDetail.view.message.title.questionInfo").$D("调查表信息")}>
          <Customize
            need-padding
            code="SMBL.WORKFLOW.INVESTIGATION_APPROVAL.QUESTION_INFO"
            dataSource={this.investigateDetail}
            columns={this.getInvestigateDetailColumns()}/>
        </SrmScrollTabItem>
        {
          this.investigateConfig.investigateConfigHeaders &&
        this.investigateConfig.investigateConfigHeaders
          .filter((e) => this.investigateConfigRenderMap[e.configName] || e.children)
          .map((header, index) => <SrmScrollTabItem
            key={index}
            label={header.configDescription || "-"}>
            {
              header.children ? header.children.map((child, childIndex) => [ <SrmFlex class={ childIndex === 0 ? "sub-title-first" : "sub-title"} align="center">{child.configDescription || "-"}</SrmFlex>,
                [
                  child.remark && <SrmFlex class="reference-remark" align="center" direction="column">{
                    <SrmFlex> { child.remark } </SrmFlex>
                  }</SrmFlex>,
                  this.referenceRangeMessage[child.configName] && this.referenceRangeMessage[child.configName].length > 0 && <SrmFlex class="reference-title" align="center" direction="column">{
                    this.referenceRangeMessage[child.configName].map((e) => <SrmFlex> {e} </SrmFlex>)
                  }</SrmFlex>,
                  this.investigateConfigRenderMap[child.configName](child)
                ] ]) :
                this.investigateConfigRenderMap[header.configName] ?
                  [
                    header.remark && <SrmFlex class="reference-remark" align="center" direction="column">{
                      <SrmFlex> { header.remark } </SrmFlex>
                    }</SrmFlex>,
                    this.referenceRangeMessage[header.configName] && this.referenceRangeMessage[header.configName].length > 0 && <SrmFlex class="reference-title" align="center" direction="column">{
                      this.referenceRangeMessage[header.configName].map((e) => <SrmFlex> {e} </SrmFlex>)
                    }</SrmFlex>,
                    this.investigateConfigRenderMap[header.configName](header)
                  ] : ""
            }
          </SrmScrollTabItem>
          )
        }
        {/**
        <SrmScrollTabItem label={this.$T("smbl.common.message.OperationRecord").$D("操作记录")}>
          <history-record-tiled
            action-data={this.operationRecord}
            remark-label={this.$T("smbl.common.view.title.operationRemark").$D("操作说明")}
            operator-field-name="processUserName"
            operation-meaning-field-name="processStatusMeaning"/>
        </SrmScrollTabItem>
         */}
      </SrmScrollTab>
    </div>;
  }
};
</script>

<style scoped lang="stylus">

.sub-title-first {
  height 36px;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #333333;
  line-height: 16px;
  padding-left 15px;
  border-bottom #F6F6F6 solid 1px;
  font-weight: 600;
}

.sub-title {
  height 36px;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #333333;
  line-height: 16px;
  padding-left 15px;
  border-bottom #F6F6F6 solid 1px;
  border-top #F6F6F6 solid 2px;
  font-weight: 600;
}

.reference-title {
  font-size: 12px;
  color: #E11900;
  line-height: 16px;
  font-weight: 500;
  padding: 10px 15px;
  background: #FFEFED;
}

.reference-remark {
  font-size: 12px;
  color: #276EF1;
  line-height: 16px;
  font-weight: 500;
  padding: 10px 15px;
  background: #EFF3FE ;
}

.approve-remark-box {
  padding 0 15px 0 10px;

  h5 {
    color: #1B1E2B;
    line-height: 20px;
    font-weight: bold;
    margin-left 5px;
  }
}
</style>
