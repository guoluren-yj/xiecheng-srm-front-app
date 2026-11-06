/* eslint-disable valid-jsdoc */
/**
 * 调查表组件mixin
 * 组件使用：
 * 1、页面引入调查表minxin文件
 * 2、替换调查表组件mixin中 investigateTemplateId、investgHeaderId 的取值
 * 3、渲染调查表<srm-scroll-tab></srm-scroll-tab>对应页签
 */
import { DataSet, SrmUtil } from "srm-mobile-ui";
import { camelCase, snakeCase } from "lodash";
import {
  getInvestigateConfigPreview,
  getInvestgListApi,
} from "../api";
export default {
  data() {
    return {
      investigateTemplateId: "",
      investgHeaderId: "",
      config: [], // 调查表配置
      investigateConfig: {}, // 调查表配置
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
    };
  },
  mounted() {
    this.investigateTemplateId = this.parameters.investigateTemplateId;
    this.investgHeaderId = this.parameters.investgHeaderId;
    // 存在调查表id时，查询调查表
    if (this.investgHeaderId && this.investigateTemplateId) {
      this.fetchConfig();
    }
  },
  methods: {
    fetchConfig() {
      this.investigateConfigLoading = true;
      const params = {
        investigateTemplateId: this.investigateTemplateId,
        investgHeaderId: this.investgHeaderId
      };
      getInvestigateConfigPreview(params).then((res = {}) => {
        const investigateConfigHeaders = res.investigateConfigHeaders || [];
        // 获取调查表配置
        this.config = this.dealConfigData(res);
        const newInvestigateConfigHeaders = [];
        for (let i = 0; i < investigateConfigHeaders.length; i++) {
          let header = investigateConfigHeaders[i];
          // const next = i < investigateConfigHeaders.length - 1 && investigateConfigHeaders[i + 1];
          // 目前仅【产品及服务】【联系人及地址】存在分组
          // if (header.configName === "sslmInvestgProservice" && next.configName === "sslmInvestgSupplierCate") {
          //   header = {
          //     configDescription: header.configDescription, //产品及服务
          //     children: [ header, next ]
          //   };
          //   i++;
          // }
          // if (header.configName === "sslmInvestgContact" && next.configName === "sslmInvestgAddress") {
          //   header = {
          //     configDescription: this.$T("sslm.supplierDetail.view.sslmInvestgContact").$D("联系人及地址"),
          //     children: [ header, next ]
          //   };
          //   i++;
          // }
          newInvestigateConfigHeaders.push(header);
          res.investigateConfigHeaders = newInvestigateConfigHeaders;
        }
        this.investigateConfig = res;
      }).finally(() => {
        this.investigateConfigLoading = false;
      });
    },
    /**
     * 处理config
     */
    dealConfigData(config) {
      const { configIgnore = "" } = this;
      const configHeaders = {};
      const configLines = {};
      const headers = [];
      // 处理头 处理 tab
      config.investigateConfigHeaders && config.investigateConfigHeaders.forEach((header) => {
        if (header.configName !== configIgnore) {
          configHeaders[header.investgCfHeaderId] = header;
          configHeaders[header.investgCfHeaderId].lines = [];
          headers.push(header);
        }
      });

      // 处理行 处理字段
      config.investigateConfigLines && config.investigateConfigLines.forEach((line) => {
        configLines[line.investgCfLineId] = line;
        configLines[line.investgCfLineId].fieldCode = line.fieldCode;
        const lines =
        configHeaders[line.investgCfHeaderId] && configHeaders[line.investgCfHeaderId].lines;
        if (lines) {
          lines.push(line);
          configLines[line.investgCfLineId].props = [];
        }
      });

      // 处理属性
      config.investigateConfigComponents && config.investigateConfigComponents.forEach((componentProp) => {
        const props =
        configLines[componentProp.investgCfLineId] &&
        configLines[componentProp.investgCfLineId].props;
        if (props) {
          props.push(componentProp);
        }
      });
      return headers;
    },
    openDetailPopup(dataSet, columns) {
      this.$popup({
        title: this.$T("smbl.common.message.detailInfo").$D("明细信息详情"),
        showHeader: true,
        showClose: false,
        position: "right",
        headerAlign: "center",
        showBack: true,
        content: <SrmForm
          style="padding: 0 15px;"
          customizeType="detail"
          columns={columns}
          dataSet={dataSet}
          class="sslm-investg-modal-form"
        />,
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
    getCustomColumns(investgCfHeaderId, showArrow = false) {
      return this.investigateConfig.investigateConfigLines
        .filter((e) => e.investgCfHeaderId === investgCfHeaderId)
        .map((e, index) => {
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

          if (index === 0 && showArrow) {
            const booleanType = [ "Checkbox", "Switch" ].includes(e.componentType);
            return {
              fieldCode: camelCase(e.fieldCode),
              fieldName: e.fieldDescription,
              editor: false,
              render: (val) => <SrmListHeader showOpenTag={false}>
                <span style={{ fontWeight:400 }}>{
                  booleanType ?
                    Number(val) ? this.$T("smbl.common.view.yes").$D("是") : this.$T("smbl.common.view.no").$D("否") :
                    val
                }</span>
                <span slot="right" >
                  <span class="srm-icon icon-chevron-right" style={{ fontSize:"16px", color: "#333" }}/>
                </span>
              </SrmListHeader>,
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
    checkUploadUrlType(investgCfLineId, investigateConfigComponents) {
      const investigateConfig = investigateConfigComponents.filter((e) => e.investgCfLineId === investgCfLineId && e.attributeName === "isAttachmentUrl");
      return investigateConfig[0] ? investigateConfig[0].attributeValue : false;
      // attributeValue
    },
    renderBasic(config) {
      const { investgCfHeaderId } = config;
      const noArrowcolumns = this.getCustomColumns(investgCfHeaderId);
      const showArrow = noArrowcolumns.length > 10;
      const columns = showArrow ? this.getCustomColumns(investgCfHeaderId, showArrow) : noArrowcolumns;
      !this.basicDS && (this.basicDS = this.getDefaultDataSet("/sslm/v1/{tenantId}/investigate-basics", columns));
      this.basicDS.addQueryParameter("investgHeaderId", this.investgHeaderId);
      return <SrmForm
        dataSet={this.basicDS}
        nativeOnClick={() => showArrow ? this.openDetailPopup(this.basicDS, noArrowcolumns) : null}
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
      if (!this.financesBranchesDS) {
        this.financesBranchesDS = this.getDefaultDataSet("/sslm/v1/{tenantId}/investigate-finances-branchs", columns);
        this.financesBranchesDS.events.afterQuery = (ds, data) => {
          data && data.forEach((e) => {
            e.mobilephone = `${e.internationalTelMeaning}|${e.mobilephone}`;
          });
        };
      }
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
          data && data.forEach((e) => {
            e.mobilephone = `${e.internationalTelMeaning}|${e.mobilephone}`;
          });
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
          data && data.forEach((e) => {
            e.regionId = e.regionPathName;
          });
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
      return <srm-list
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
          data && data.forEach((e) => {
            e.attachmentType = e.attachmentTypeMeaning;
          });
        };
      }
      this.attachmentsDS.addQueryParameter("investgHeaderId", this.investgHeaderId);
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
      return <SrmForm
        dataSet={this[`${configName}DS`]}
        nativeOnClick={() => columns.length > 10 ? this.openDetailPopup(this[`${configName}DS`], columns) : null}
        columns={columns.slice(0, 10)}/>;
    },
  }
};

