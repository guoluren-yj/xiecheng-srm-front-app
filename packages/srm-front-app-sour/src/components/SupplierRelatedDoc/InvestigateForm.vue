<script>
import { DataSet, SrmUtil } from "srm-mobile-ui";
import { camelCase, snakeCase } from "lodash";
import {
  getInvestigateConfigPreview,
  getInvestigateDetail,
} from "./api/SupplierLifecircleManagement";

export default {
  modules: [ "sslm.supplierDetail", "sslm.common", "sslm.supplierReview", "smbl.common" ],
  name: "InvestigateForm",
  props: {
    investgHeaderId: {
      type: String | Number,
    },
    investigateTemplateId: {
      type: String | Number,
    }
  },
  data() {
    return {
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
      },
      basicInfo: null,
      componentMap: {
        Input: "INPUT",
        InputNumber: "INPUT_NUMBER",
        ValueList: "SELECT",
        Lov: "LOV",
        Checkbox: "TEXT",
        Switch: "TEXT",
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
    };
  },
  mounted() {
    this.fetchDetail();
    this.fetchConfig();
  },
  methods: {
    getInvestigateDetailColumns() {
      return [ {
        formRow: 1,
        fieldCode: "companyName",
        fieldName: this.$T("sslm.common.view.company.companyName").$D("公司名称"),
      }, {
        formRow: 2,
        fieldCode: "supplierZhOrEnCompanyNum",
        fieldName: this.$T("sslm.common.model.supplierName").$D("供应商名称"),
      }, {
        formRow: 3,
        fieldCode: "investigateTemplateName",
        fieldName: this.$T("sslm.common.model.investigate.template.name").$D("调查表模板名称"),
      }, {
        formRow: 4,
        fieldCode: "createUserRealName",
        fieldName: this.$T("sslm.common.view.creator.name").$D("创建人"),
      }, {
        formRow: 4,
        fieldCode: "unitName",
        fieldName: this.$T("sslm.common.view.creator.unitName").$D("创建人部门"),
      }, {
        formRow: 5,
        fieldCode: "releaseDate",
        fieldName: this.$T("sslm.supplierReview.model.supplierReview.processDate").$D("发布日期"),
      }, {
        formRow: 6,
        fieldCode: "submitDate",
        fieldName: this.$T("sslm.common.view.message.submitDate").$D("提交时间"),
      }, {
        formRow: 8,
        fieldCode: "remark",
        fieldName: this.$T("sslm.common.model.investigate.remark").$D("调查说明"),
      }, {
        formRow: 9,
        fieldCode: "partnerRemark",
        fieldName: this.$T("sslm.common.model.feedback.remark").$D("反馈备注"),
      }, ];
    },
    fetchDetail() {
      this.$loading.show();
      getInvestigateDetail(this.investgHeaderId).then((res) => {
        this.investigateDetail = res || {};
      }).finally(() => {
        this.$loading.hide();
      });
    },
    fetchConfig() {
      this.investigateConfigLoading = true;
      getInvestigateConfigPreview(this.investigateTemplateId).then((res = {}) => {
        const investigateConfigHeaders = res.investigateConfigHeaders || [];
        const newInvestigateConfigHeaders = [];
        for (let i = 0; i < investigateConfigHeaders.length; i++) {
          let header = investigateConfigHeaders[i];
          const next = i < investigateConfigHeaders.length - 1 && investigateConfigHeaders[i + 1];
          if (header.configName === "sslmInvestgProservice" && next.configName === "sslmInvestgSupplierCate") {
            header = {
              configDescription: header.configDescription,
              children: [ header, next ]
            };
            i++;
          }
          if (header.configName === "sslmInvestgFin" && next.configName === "sslmInvestgFinBranch") {
            header = {
              configDescription: this.$T("sslm.supplierDetail.view.sslmInvestgFin").$D("财务状况"),
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
          if (header.configName === "sslmInvestgCustomer" && next.configName === "sslmInvestgSubSupplier") {
            header = {
              configDescription: this.$T("sslm.supplierDetail.view.sslmInvestgCustomer").$D("合作伙伴"),
              children: [ header, next ]
            };
            i++;
          }
          if (header.configName === "sslmInvestgRd" && next.configName === "sslmInvestgProduce") {
            header = {
              configDescription: this.$T("sslm.supplierDetail.view.sslmInvestgRd").$D("研发和生产"),
              children: [ header, next ]
            };
            i++;
          }
          if (header.configName === "sslmInvestgQa" && next.configName === "sslmInvestgCustservice") {
            header = {
              configDescription: this.$T("sslm.supplierDetail.view.sslmInvestgQa").$D("质保与售后"),
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
    getCustomColumns(investgCfHeaderId) {
      return this.investigateConfig.investigateConfigLines
        .filter((e) => e.investgCfHeaderId === investgCfHeaderId)
        .map((e) => ({
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
        }));
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
      return <SrmList
        scrollable={false}
        dataSet={this.financesDS}
        onItemClick={() => columns.length > 10 ? this.openDetailPopup(this.financesDS, columns) : null}
        columns={columns.slice(0, 10)}/>;
    },
    renderFinancesBranches(config) {
      const { investgCfHeaderId } = config;
      const columns = this.getCustomColumns(investgCfHeaderId);
      !this.financesBranchesDS && (this.financesBranchesDS = this.getDefaultDataSet("/sslm/v1/{tenantId}/investigate-finances-branchs", columns));
      this.financesBranchesDS.addQueryParameter("investgHeaderId", this.investgHeaderId);
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
          data && data.forEach((e) => e.mobilephone = `${e.internationalTelMeaning}|${e.mobilephone}`);
        };
      }
      this.contactsDS.addQueryParameter("investgHeaderId", this.investgHeaderId);
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
          data && data.forEach((e) => e.regionId = e.regionPathName);
        };
      }
      this.addressesDS.addQueryParameter("investgHeaderId", this.investgHeaderId);
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
          data && data.forEach((e) => e.attachmentType = e.attachmentTypeMeaning);
        };
      }
      this.attachmentsDS.addQueryParameter("investgHeaderId", this.investgHeaderId);
      return <SrmList
        scrollable={false}
        dataSet={this.attachmentsDS}
        columns={columns}/>;
    },
  },
  render() {
    return <SrmScrollTab contentScroll>
      <SrmScrollTabItem label={this.$T("sslm.supplierDetail.view.message.title.questionInfo").$D("调查表信息")}>
        <Customize
          style="padding: 4px 15px 16px 15px; min-height: 200px"
          code="SMBL.WORKFLOW.INVESTIGATION_APPROVAL_DETAIL.HEADER"
          dataSource={this.investigateDetail}
          columns={this.getInvestigateDetailColumns()}/>
      </SrmScrollTabItem>
      {
        this.investigateConfig.investigateConfigHeaders &&
        this.investigateConfig.investigateConfigHeaders.map((header, index) => <SrmScrollTabItem
          key={index}
          label={header.configDescription || "-"}>
          {
            header.children ? header.children.map((child) => [ <SrmFlex class="sub-title" align="center">{child.configDescription || "-"}</SrmFlex>,
              this.investigateConfigRenderMap[child.configName](child) ]) : this.investigateConfigRenderMap[header.configName](header)
          }
        </SrmScrollTabItem>)
      }
    </SrmScrollTab>;
  }
};
</script>

<style scoped lang="stylus">
>>> .srm-form {
  padding: 4px 15px 16px 15px;
  min-height: 200px;
  margin: 0;
}

>>> .srm-list-item-card {
  .customize {
    .customize-item {
      margin-top 12px !important;
    }
  }
}

.sub-title {
  height 36px;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #333333;
  line-height: 16px;
  padding-left 15px;
  border-bottom #F6F6F6 solid 1px;
}
</style>
