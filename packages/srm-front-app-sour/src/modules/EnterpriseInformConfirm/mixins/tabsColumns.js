// import { $T } from "srm-mobile-ui";
export default {
  data() {
    return {};
  },
  computed: {
    // 基础信息
    getBasisColumnsInfo() {
      const columns = [
        {
          formRow: 10,
          formCol: 10,
          fieldName: this.$T("sslm.enterpriseInform.model.application.applicationNum").$D("申请单号"),
          fieldCode: "changeReqNumber",
          fieldType: "TEXT"
        },
        {
          formRow: 20,
          formCol: 10,
          fieldName: this.$T("sslm.enterpriseInform.model.application.latitudeChange").$D("变更维度"),
          fieldCode: "changeLevelMeaning",
          fieldType: "TEXT"
        },
        {
          formRow: 20,
          formCol: 20,
          fieldName: this.$T("sslm.enterpriseInform.model.application.applicationState").$D("申请状态"),
          fieldCode: "reqStatusMeaning",
          fieldType: "TEXT"
        },
        {
          formRow: 30,
          formCol: 10,
          fieldName: this.$T("sslm.enterpriseInform.model.application.companyNum").$D("企业编码"),
          fieldCode: "companyNum",
          fieldType: "TEXT"
        },
        {
          formRow: 30,
          formCol: 20,
          fieldName: this.$T("sslm.enterpriseInform.model.application.companyName").$D("企业名称"),
          fieldCode: "companyName",
          fieldType: "TEXT"
        },
        {
          formRow: 40,
          formCol: 10,
          fieldName: this.$T("sslm.enterpriseInform.model.application.creator").$D("创建人"),
          fieldCode: "createUserRealName",
          fieldType: "TEXT"
        },
        {
          formRow: 50,
          formCol: 10,
          fieldName: this.$T("sslm.enterpriseInform.model.application.submitDate").$D("提交日期"),
          fieldCode: "submitDate",
          fieldType: "TEXT"
        },
        {
          formRow: 60,
          formCol: 10,
          fieldName: this.$T("sslm.enterpriseInform.model.application.creationDate").$D("创建日期"),
          fieldCode: "creationDate",
          fieldType: "TEXT"
        },
        {
          formRow: 70,
          formCol: 10,
          fieldName: this.$T("sslm.enterpriseInform.model.application.changeRemark").$D("变更备注"),
          fieldCode: "remark",
          fieldType: "TEXT"
        },
        {
          formRow: 80,
          formCol: 10,
          fieldName: this.$T("sslm.enterpriseInform.model.application.approvalOpinion").$D("审批意见"),
          fieldCode: "approvalOpinion",
          fieldType: "TEXT"
        },
      ];
      return columns;
    },
    // 登记信息
    getRegistColumnsInfo() {
      let columns = [];
      const domesticForeignRelationFlag = this.currentButtonTab === 0 ? this.domesticForeignRelationOld : this.domesticForeignRelationNew;
      // 个人
      if (domesticForeignRelationFlag === 2) {
        columns = [
          {
            formRow: 10,
            formCol: 10,
            fieldName: this.$T("sslm.enterpriseInform.view.model.companyInfo.address").$D("认证地区"),
            fieldCode: "domesticForeignRelation",
            fieldType: "TEXT",
            render:(val, record, { fieldCode }) => {
              const showVal = val === 1 ? this.$T("sslm.supplierDetail.model.suDe.companyInfo.domestic").$D("境内") : val === 0 ? this.$T("sslm.supplierDetail.model.suDe.companyInfo.overseas").$D("境外") : this.$T("sslm.supplierDetail.model.suDe.companyInfo.personal").$D("个人");
              if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
                return <srm-button type="danger" plain> {showVal} </srm-button>;
              }
              return showVal;
            }
          },
          {
            formRow: 20,
            formCol: 10,
            fieldName: this.$T("sslm.enterpriseInform.model.personal.name").$D("姓名"),
            fieldCode: "companyName",
            fieldType: "TEXT",
            render:(val, record, { fieldCode }) => {
              if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
                return <srm-button type="danger" plain> {val} </srm-button>;
              }
              return val;
            }
          },
          {
            formRow: 30,
            formCol: 10,
            fieldName: this.$T("sslm.enterpriseInform.view.model.bank.bankCountry").$D("国家/地区"),
            fieldCode: "registeredCountryName",
            fieldType: "TEXT",
            render:(val, record, { fieldCode }) => {
              if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
                return <srm-button type="danger" plain> {val} </srm-button>;
              }
              return val;
            }
          },
          {
            formRow: 40,
            formCol: 10,
            fieldName: this.$T("sslm.enterpriseInform.model.personal.registeredId").$D("省市"),
            fieldCode: "registeredRegionName",
            fieldType: "TEXT",
            render:(val, record, { fieldCode }) => {
              if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
                return <srm-button type="danger" plain> {val} </srm-button>;
              }
              return val;
            }
          },
          {
            formRow: 50,
            formCol: 10,
            fieldName: this.$T("sslm.enterpriseInform.model.personal.addressDetail").$D("联系地址"),
            fieldCode: "addressDetail",
            fieldType: "TEXT",
            render:(val, record, { fieldCode }) => {
              if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
                return <srm-button type="danger" plain> {val} </srm-button>;
              }
              return val;
            }
          },
          {
            formRow: 60,
            formCol: 10,
            fieldName: this.$T("sslm.enterpriseInform.model.personal.mobilePhone").$D("手机号"),
            fieldCode: "phone",
            fieldType: "TEXT",
            render:(val, record, { fieldCode }) => {
              const showVal = val && `${record.internationalTelMeaning}|${val}`;
              if (record[fieldCode + "Flag"] === "UPDATE" || record.internationalTelCodeFlag === "UPDATE" || record.objectFlag === "CREATE") {
                return <srm-button type="danger" plain> {showVal} </srm-button>;
              }
              return showVal;
            }
          },
          {
            formRow: 70,
            formCol: 10,
            fieldName: this.$T("sslm.enterpriseInform.model.personal.email").$D("邮箱"),
            fieldCode: "email",
            fieldType: "TEXT",
            render:(val, record, { fieldCode }) => {
              if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
                return <srm-button type="danger" plain> {val} </srm-button>;
              }
              return val;
            }
          },
        ];
      } else if (domesticForeignRelationFlag === 1) {
        // 境内
        columns = [
          {
            formRow: 10,
            formCol: 10,
            fieldName: this.$T("sslm.enterpriseInform.view.model.companyInfo.address").$D("认证地区"),
            fieldCode: "domesticForeignRelation",
            fieldType: "TEXT",
            render:(val, record, { fieldCode }) => {
              const showVal = val === 1 ? this.$T("sslm.supplierDetail.model.suDe.companyInfo.domestic").$D("境内") : val === 0 ? this.$T("sslm.supplierDetail.model.suDe.companyInfo.overseas").$D("境外") : this.$T("sslm.supplierDetail.model.suDe.companyInfo.personal").$D("个人");
              if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
                return <srm-button type="danger" plain> {showVal} </srm-button>;
              }
              return showVal;
            }
          },
          {
            formRow: 20,
            formCol: 10,
            fieldName: this.$T("sslm.enterpriseInform.view.model.companyInfo.companyName").$D("企业名称"),
            fieldCode: "companyName",
            fieldType: "TEXT",
            render:(val, record, { fieldCode }) => {
              if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
                return <srm-button type="danger" plain> {val} </srm-button>;
              }
              return val;
            }
          },
          {
            formRow: 30,
            formCol: 10,
            fieldName: this.$T("sslm.enterpriseInform.view.model.companyInfo.socialCode").$D("统一社会信用代码"),
            fieldCode: "unifiedSocialCode",
            fieldType: "TEXT",
            render:(val, record, { fieldCode }) => {
              if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
                return <srm-button type="danger" plain> {val} </srm-button>;
              }
              return val;
            }
          },
          {
            formRow: 40,
            formCol: 10,
            fieldName: this.$T("sslm.enterpriseInform.view.model.companyInfo.dunsCode").$D("邓白氏编码"),
            fieldCode: "dunsCode",
            fieldType: "TEXT",
            render:(val, record, { fieldCode }) => {
              if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
                return <srm-button type="danger" plain> {val} </srm-button>;
              }
              return val;
            }
          },
          {
            formRow: 50,
            formCol: 10,
            fieldName: this.$T("sslm.enterpriseInform.view.model.companyInfo.legalRepName").$D("法定代表人/负责人"),
            fieldCode: "legalRepName",
            fieldType: "TEXT",
            render:(val, record, { fieldCode }) => {
              if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
                return <srm-button type="danger" plain> {val} </srm-button>;
              }
              return val;
            }
          },
          {
            formRow: 60,
            formCol: 10,
            fieldName: this.$T("sslm.enterpriseInform.view.model.companyInfo.organizingCode").$D("组织机构代码"),
            fieldCode: "organizingInstitutionCode",
            fieldType: "TEXT"
          },
          {
            formRow: 70,
            formCol: 10,
            fieldName: this.$T("sslm.enterpriseInform.view.model.companyInfo.institutionalType").$D("机构类型"),
            fieldCode: "institutionalTypeMeaning",
            fieldType: "TEXT",
            render:(val, record, { fieldCode }) => {
              if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
                return <srm-button type="danger" plain> {val} </srm-button>;
              }
              return val;
            }
          },
          {
            formRow: 80,
            formCol: 10,
            fieldName: this.$T("sslm.enterpriseInform.view.model.companyInfo.companyType").$D("企业类型"),
            fieldCode: "companyTypeMeaning",
            fieldType: "TEXT",
            render:(val, record, { fieldCode }) => {
              if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
                return <srm-button type="danger" plain> {val} </srm-button>;
              }
              return val;
            }
          },
          {
            formRow: 80,
            formCol: 20,
            fieldName: this.$T("sslm.enterpriseInform.view.message.address.countryName").$D("国家/地区"),
            fieldCode: "registeredCountryName",
            fieldType: "TEXT",
            render:(val, record, { fieldCode }) => {
              if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
                return <srm-button type="danger" plain> {val} </srm-button>;
              }
              return val;
            }
          },
          {
            formRow: 90,
            formCol: 10,
            fieldName: this.$T("sslm.enterpriseInform.view.model.companyInfo.registeredRegionName").$D("注册地址"),
            fieldCode: "registeredRegionName",
            fieldType: "TEXT",
            render:(val, record, { fieldCode }) => {
              if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
                return <srm-button type="danger" plain> {val} </srm-button>;
              }
              return val;
            }
          },
          {
            formRow: 100,
            formCol: 10,
            fieldName: this.$T("sslm.enterpriseInform.view.model.address.addressDetail").$D("详细地址"),
            fieldCode: "addressDetail",
            fieldType: "TEXT",
            render:(val, record, { fieldCode }) => {
              if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
                return <srm-button type="danger" plain> {val} </srm-button>;
              }
              return val;
            }
          },
          {
            formRow: 110,
            formCol: 10,
            fieldName: this.$T("sslm.enterpriseInform.view.model.companyInfo.regCapital").$D("注册资本(万)"),
            fieldCode: "registeredCapital",
            fieldType: "TEXT",
            render:(val, record, { fieldCode }) => {
              if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
                return <srm-button type="danger" plain> {val} </srm-button>;
              }
              return val;
            }
          },
          {
            formRow: 120,
            formCol: 10,
            fieldName: this.$T("sslm.enterpriseInform.view.model.companyInfo.currencyCode").$D("注册资本币种"),
            fieldCode: "currencyName",
            fieldType: "TEXT",
            render:(val, record, { fieldCode }) => {
              if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
                return <srm-button type="danger" plain> {val} </srm-button>;
              }
              return val;
            }
          },
          {
            formRow: 130,
            formCol: 10,
            fieldName: this.$T("sslm.enterpriseInform.view.model.companyInfo.taxpayerType").$D("纳税人标识"),
            fieldCode: "taxpayerTypeMeaning",
            fieldType: "TEXT",
            render:(val, record, { fieldCode }) => {
              if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
                return <srm-button type="danger" plain> {val} </srm-button>;
              }
              return val;
            }
          },
          {
            formRow: 130,
            formCol: 20,
            fieldName: this.$T("sslm.enterpriseInform.view.message.longTerm").$D("长期"),
            fieldCode: "longTermFlag",
            fieldType: "TEXT",
            render:(val, record, { fieldCode }) => {
              const showVal = Number(val) ? this.$T("smbl.common.view.yes").$D("是") : this.$T("smbl.common.view.no").$D("否");
              if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
                return <srm-button type="danger" plain> { showVal } </srm-button>;
              }
              return showVal;
            }
          },
          {
            formRow: 140,
            formCol: 10,
            fieldName: this.$T("sslm.enterpriseInform.view.model.companyInfo.businessScope").$D("经营范围"),
            fieldCode: "businessScope",
            fieldType: "TEXT",
            render:(val, record, { fieldCode }) => {
              if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
                return <srm-button type="danger" plain> {val} </srm-button>;
              }
              return val;
            }
          },
          {
            formRow: 150,
            formCol: 10,
            fieldName: this.$T("sslm.enterpriseInform.view.model.companyInfo.buildDate").$D("成立日期"),
            fieldCode: "buildDate",
            fieldType: "TEXT",
            render:(val, record, { fieldCode }) => {
              if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
                return <srm-button type="danger" plain> {val} </srm-button>;
              }
              return val;
            }
          },
          {
            formRow: 160,
            formCol: 10,
            fieldName: this.$T("sslm.enterpriseInform.view.registInform.businessTerm").$D("营业期限"),
            fieldCode: "businessTerm",
            fieldType: "TEXT",
            render:(val, record, { fieldCode }) => {
              if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
                return <srm-button type="danger" plain> {val} </srm-button>;
              }
              return val;
            }
          },
          {
            formRow: 170,
            formCol: 10,
            fieldName: this.$T("sslm.enterpriseInform.view.model.companyInfo.licenceUrl").$D("营业执照"),
            fieldCode: "licenceUrl",
            fieldType: "TEXT",
            render:(val, record, { fieldCode }) => {
              if (val) {
                if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
                  return <SrmButton type="danger" plain onClick={() => this.preview(record.licenceFilename, record.licenceUrl)}>{this.$T("sslm.enterpriseInform.view.model.business.viewPhoto").$D("查看图片")}</SrmButton>;
                }
                return <SrmButton type="primary" plain onClick={() => this.preview(record.licenceFilename, record.licenceUrl)}>{this.$T("sslm.enterpriseInform.view.model.business.viewPhoto").$D("查看图片")}</SrmButton>;
              }
              return val;
            }
          },
        ];
      } else if (domesticForeignRelationFlag === 0) {
        // 境外
        columns = [
          {
            formRow: 10,
            formCol: 10,
            fieldName: this.$T("sslm.enterpriseInform.view.model.companyInfo.address").$D("认证地区"),
            fieldCode: "domesticForeignRelation",
            fieldType: "TEXT",
            render:(val, record, { fieldCode }) => {
              const showVal = val === 1 ? this.$T("sslm.supplierDetail.model.suDe.companyInfo.domestic").$D("境内") : val === 0 ? this.$T("sslm.supplierDetail.model.suDe.companyInfo.overseas").$D("境外") : this.$T("sslm.supplierDetail.model.suDe.companyInfo.personal").$D("个人");
              if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
                return <srm-button type="danger" plain> {showVal} </srm-button>;
              }
              return showVal;
            }
          },
          {
            formRow: 20,
            formCol: 10,
            fieldName: this.$T("sslm.enterpriseInform.view.model.companyInfo.companyName").$D("企业名称"),
            fieldCode: "companyName",
            fieldType: "TEXT",
            render:(val, record, { fieldCode }) => {
              if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
                return <srm-button type="danger" plain> {val} </srm-button>;
              }
              return val;
            }
          },
          {
            formRow: 30,
            formCol: 10,
            fieldName: this.$T("sslm.enterpriseInform.model.companyInfo.registrationNumber").$D("企业注册登记号/税号"),
            fieldCode: "registrationNumber",
            fieldType: "TEXT",
            render:(val, record, { fieldCode }) => {
              if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
                return <srm-button type="danger" plain> {val} </srm-button>;
              }
              return val;
            }
          },
          {
            formRow: 40,
            formCol: 10,
            fieldName: this.$T("sslm.enterpriseInform.view.model.companyInfo.dunsCode").$D("邓白氏编码"),
            fieldCode: "dunsCode",
            fieldType: "TEXT",
            render:(val, record, { fieldCode }) => {
              if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
                return <srm-button type="danger" plain> {val} </srm-button>;
              }
              return val;
            }
          },
          {
            formRow: 50,
            formCol: 10,
            fieldName: this.$T("sslm.enterpriseInform.view.model.companyInfo.legalRepName").$D("法定代表人/负责人"),
            fieldCode: "legalRepName",
            fieldType: "TEXT",
            render:(val, record, { fieldCode }) => {
              if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
                return <srm-button type="danger" plain> {val} </srm-button>;
              }
              return val;
            }
          },
          {
            formRow: 60,
            formCol: 10,
            fieldName: this.$T("sslm.enterpriseInform.view.message.address.countryName").$D("国家/地区"),
            fieldCode: "registeredCountryName",
            fieldType: "TEXT",
            render:(val, record, { fieldCode }) => {
              if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
                return <srm-button type="danger" plain> {val} </srm-button>;
              }
              return val;
            }
          },
          {
            formRow: 70,
            formCol: 10,
            fieldName: this.$T("sslm.enterpriseInform.view.model.companyInfo.registeredRegionName").$D("注册地址"),
            fieldCode: "registeredRegionName",
            fieldType: "TEXT",
            render:(val, record, { fieldCode }) => {
              if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
                return <srm-button type="danger" plain> {val} </srm-button>;
              }
              return val;
            }
          },
          {
            formRow: 80,
            formCol: 10,
            fieldName: this.$T("sslm.enterpriseInform.view.model.address.addressDetail").$D("详细地址"),
            fieldCode: "addressDetail",
            fieldType: "TEXT",
            render:(val, record, { fieldCode }) => {
              if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
                return <srm-button type="danger" plain> {val} </srm-button>;
              }
              return val;
            }
          },
          {
            formRow: 90,
            formCol: 10,
            fieldName: this.$T("sslm.enterpriseInform.view.model.companyInfo.regCapital").$D("注册资本(万)"),
            fieldCode: "registeredCapital",
            fieldType: "TEXT",
            render:(val, record, { fieldCode }) => {
              if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
                return <srm-button type="danger" plain> {val} </srm-button>;
              }
              return val;
            }
          },
          {
            formRow: 100,
            formCol: 10,
            fieldName: this.$T("sslm.enterpriseInform.view.model.companyInfo.currencyCode").$D("注册资本币种"),
            fieldCode: "currencyName",
            fieldType: "TEXT",
            render:(val, record, { fieldCode }) => {
              if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
                return <srm-button type="danger" plain> {val} </srm-button>;
              }
              return val;
            }
          },
          {
            formRow: 110,
            formCol: 10,
            fieldName: this.$T("sslm.enterpriseInform.view.model.companyInfo.buildDate").$D("成立日期"),
            fieldCode: "buildDate",
            fieldType: "TEXT",
            render:(val, record, { fieldCode }) => {
              if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
                return <srm-button type="danger" plain> {val} </srm-button>;
              }
              return val;
            }
          },
          {
            formRow: 120,
            formCol: 10,
            fieldName: this.$T("sslm.enterpriseInform.view.model.companyInfo.businessScope").$D("经营范围"),
            fieldCode: "businessScope",
            fieldType: "TEXT",
            render:(val, record, { fieldCode }) => {
              if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
                return <srm-button type="danger" plain> {val} </srm-button>;
              }
              return val;
            }
          },
          {
            formRow: 130,
            formCol: 10,
            fieldName: this.$T("sslm.enterpriseInform.view.model.enterpriseCertificate").$D("企业注册证书"),
            fieldCode: "licenceUrl",
            fieldType: "TEXT",
            render:(val, record, { fieldCode }) => {
              if (val) {
                if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
                  return <SrmButton type="danger" plain onClick={() => this.preview(record.licenceFilename, record.licenceUrl)}>{this.$T("sslm.enterpriseInform.view.model.business.viewPhoto").$D("查看图片")}</SrmButton>;
                }
                return <SrmButton type="primary" plain onClick={() => this.preview(record.licenceFilename, record.licenceUrl)}>{this.$T("sslm.enterpriseInform.view.model.business.viewPhoto").$D("查看图片")}</SrmButton>;
              }
              return val;
            }
          },
        ];
      }
      return columns;
    },
    // 注册业务信息
    getRegBusinessColumnsInfo() {
      const columns = [
        {
          formRow: 10,
          formCol: 10,
          fieldName: this.$T("sslm.enterpriseInform.view.model.business.serviceType").$D("经营性质"),
          fieldCode: "changeReqNumber",
          fieldType: "TEXT",
          render:(val, record) => {
            const showFlag = record.manufacturerFlagFlag === "UPDATE" ||
            record.traderFlagFlag === "UPDATE" ||
            record.servicerFlagFlag === "UPDATE" ||
            record.agentFlagFlag === "UPDATE" ||
            record.integrationFlagFlag === "UPDATE" ||
            record.contractorFlagFlag === "UPDATE";
            const showVal = <div>
              {`${
                record.manufacturerFlag === 1 ?
                  this.$T("sslm.enterpriseInform.view.model.business.manufacturer").$D("制造商") :
                  ""
              } ${
                record.traderFlag === 1 ?
                  this.$T("sslm.enterpriseInform.view.model.business.trader").$D("贸易商") :
                  ""
              } ${
                record.servicerFlag === 1 ?
                  this.$T("sslm.enterpriseInform.view.model.business.servicer").$D("服务商") :
                  ""
              } ${
                record.agentFlag === 1 ?
                  this.$T("sslm.enterpriseInform.model.business.agent").$D("代理商") :
                  ""
              } ${
                record.integrationFlag === 1 ?
                  this.$T("sslm.enterpriseInform.view.model.business.integration").$D("集成商") :
                  ""
              } ${
                record.contractorFlag === 1 ?
                  this.$T("sslm.enterpriseInform.view.model.business.contractor").$D("承包商") :
                  ""
              }`}
            </div>;
            if (showFlag) {
              return <srm-button type="danger" plain> {showVal} </srm-button>;
            }
            return showVal;
          }
        },
        {
          formRow: 10,
          formCol: 20,
          fieldName: this.$T("sslm.enterpriseInform.view.model.business.industryReqList").$D("行业类型"),
          fieldCode: "industryReqList",
          fieldType: "TEXT",
          render:(val, record) => {
            const showVal = (val || []).map(({ industryName }) => industryName).join(",");
            if (record.industryFlag === "UPDATE" || record.objectFlag === "CREATE") {
              return <srm-button type="danger" plain> {showVal} </srm-button>;
            }
            return showVal;
          }
        },
        {
          formRow: 20,
          formCol: 10,
          fieldName: this.$T("sslm.enterpriseInform.view.model.business.industryList").$D("主营品类"),
          fieldCode: "industryCategoryReqList",
          fieldType: "TEXT",
          render:(val, record) => {
            const showVal = (val || []).map(({ categoryName }) => categoryName).join(",");
            if (record.industryCategoryFlag === "UPDATE" || record.objectFlag === "CREATE") {
              return <srm-button type="danger" plain> {showVal} </srm-button>;
            }
            return showVal;
          }
        },
        {
          formRow: 20,
          formCol: 20,
          fieldName: this.$T("sslm.enterpriseInform.view.model.business.serviceAreaReqList").$D("送货服务范围"),
          fieldCode: "serviceAreaReqList",
          fieldType: "TEXT",
          render:(val, record) => {
            const showVal = (val || []).map(({ serviceAreaMeaning }) => serviceAreaMeaning).join(",");
            if (record.serviceAreaFlag === "UPDATE" || record.objectFlag === "CREATE") {
              return <srm-button type="danger" plain> {showVal} </srm-button>;
            }
            return showVal;
          }
        },
        {
          formRow: 30,
          formCol: 10,
          fieldName: this.$T("sslm.enterpriseInform.view.model.business.website").$D("公司官网"),
          fieldCode: "website",
          fieldType: "TEXT",
          render:(val, record, { fieldCode }) => {
            if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
              return <srm-button type="danger" plain> {val} </srm-button>;
            }
            return val;
          }
        },
        {
          formRow: 40,
          formCol: 10,
          fieldName: this.$T("sslm.enterpriseInform.view.model.business.logoUrl").$D("公司LOGO"),
          fieldCode: "logoUrl",
          fieldType: "TEXT",
          render:(val, record, { fieldCode }) => {
            if (val) {
              if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
                return <SrmButton type="danger" plain onClick={() => this.preview("", record.logoUrl)}>{this.$T("sslm.enterpriseInform.view.model.business.viewPhoto").$D("查看图片")}</SrmButton>;
              }
              return <SrmButton type="primary" plain onClick={() => this.preview("", record.logoUrl)}>{this.$T("sslm.enterpriseInform.view.model.business.viewPhoto").$D("查看图片")}</SrmButton>;
            }
            return val;
          }
        },
        {
          formRow: 50,
          formCol: 10,
          fieldName: this.$T("sslm.enterpriseInform.view.model.business.description").$D("公司简介"),
          fieldCode: "description",
          fieldType: "TEXT",
          render:(val, record, { fieldCode }) => {
            if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
              return <srm-button type="danger" plain> {val} </srm-button>;
            }
            return val;
          }
        },
      ];
      return columns;
    },
    // 开票信息
    getInvoiceColumnsInfo() {
      const columns = [
        {
          formRow: 10,
          formCol: 10,
          fieldName: this.$T("sslm.enterpriseInform.view.model.invoice.invoiceHeader").$D("发票头"),
          fieldCode: "invoiceHeader",
          fieldType: "TEXT",
          render:(val, record, { fieldCode }) => {
            if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
              return <srm-button type="danger" plain> {val} </srm-button>;
            }
            return val;
          }
        },
        {
          formRow: 20,
          formCol: 10,
          fieldName: this.$T("sslm.enterpriseInform.view.model.invoice.taxNumber").$D("税务登记号"),
          fieldCode: "taxRegistrationNumber",
          fieldType: "TEXT",
          render:(val, record, { fieldCode }) => {
            if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
              return <srm-button type="danger" plain> {val} </srm-button>;
            }
            return val;
          }
        },
        {
          formRow: 30,
          formCol: 10,
          fieldName: this.$T("sslm.enterpriseInform.view.model.invoice.depositBank").$D("开户行"),
          fieldCode: "depositBank",
          fieldType: "TEXT",
          render:(val, record, { fieldCode }) => {
            if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
              return <srm-button type="danger" plain> {val} </srm-button>;
            }
            return val;
          }
        },
        {
          formRow: 40,
          formCol: 10,
          fieldName: this.$T("sslm.enterpriseInform.view.model.invoice.bankAccountNum").$D("开户行帐号"),
          fieldCode: "bankAccountNum",
          fieldType: "TEXT",
          render:(val, record, { fieldCode }) => {
            if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
              return <srm-button type="danger" plain> {val} </srm-button>;
            }
            return val;
          }
        },
        {
          formRow: 50,
          formCol: 10,
          fieldName: this.$T("sslm.enterpriseInform.view.model.invoice.taxRegistrationAddress").$D("税务登记地址"),
          fieldCode: "taxRegistrationAddress",
          fieldType: "TEXT",
          render:(val, record, { fieldCode }) => {
            if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
              return <srm-button type="danger" plain> {val} </srm-button>;
            }
            return val;
          }
        },
        {
          formRow: 60,
          formCol: 10,
          fieldName: this.$T("sslm.enterpriseInform.view.model.invoice.taxPhone").$D("税务登记电话"),
          fieldCode: "taxRegistrationPhone",
          fieldType: "TEXT",
          render:(val, record, { fieldCode }) => {
            if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
              return <srm-button type="danger" plain> {val} </srm-button>;
            }
            return val;
          }
        },
        {
          formRow: 70,
          formCol: 10,
          fieldName: this.$T("sslm.common.model.invoice.taker").$D("收票人"),
          fieldCode: "receiver",
          fieldType: "TEXT",
          render:(val, record, { fieldCode }) => {
            if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
              return <srm-button type="danger" plain> {val} </srm-button>;
            }
            return val;
          }
        },
        {
          formRow: 80,
          formCol: 10,
          fieldName: this.$T("sslm.enterpriseInform.view.model.invoice.receiveMail").$D("收票人邮箱"),
          fieldCode: "receiveMail",
          fieldType: "TEXT",
          render:(val, record, { fieldCode }) => {
            if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
              return <srm-button type="danger" plain> {val} </srm-button>;
            }
            return val;
          }
        },
        {
          formRow: 90,
          formCol: 10,
          fieldName: this.$T("sslm.enterpriseInform.view.model.invoice.receivePhone").$D("收票人手机号"),
          fieldCode: "receivePhone",
          fieldType: "TEXT",
          render:(val, record, { fieldCode }) => {
            const showVal = val && `${record.internationalTelMeaning}|${val}`;
            if (record[fieldCode + "Flag"] === "UPDATE" || record.internationalTelCodeFlag === "UPDATE" || record.objectFlag === "CREATE") {
              return <srm-button type="danger" plain> {showVal} </srm-button>;
            }
            return showVal;
          }
        },
        {
          formRow: 100,
          formCol: 10,
          fieldName: this.$T("sslm.common.model.invoice.ticketAddress").$D("收票地址"),
          fieldCode: "receiveAddress",
          fieldType: "TEXT",
          render:(val, record, { fieldCode }) => {
            if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
              return <srm-button type="danger" plain> {val} </srm-button>;
            }
            return val;
          }
        },
      ];
      return columns;
    },
    // 联系人信息
    getContactColumnsInfo() {
      const columns = [
        {
          formRow: 10,
          formCol: 10,
          fieldName: this.$T("sslm.enterpriseInform.view.model.contactPerson.name").$D("姓名"),
          fieldCode: "name",
          fieldType: "TEXT",
          render:(val, record, { fieldCode }) => {
            if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
              return <srm-button type="danger" plain> {val} </srm-button>;
            }
            return val;
          }
        },
        {
          formRow: 20,
          formCol: 10,
          fieldName: this.$T("sslm.enterpriseInform.view.model.contactPerson.gender").$D("性别"),
          fieldCode: "genderMeaning",
          fieldType: "TEXT",
          render:(val, record, { fieldCode }) => {
            if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
              return <srm-button type="danger" plain> {val} </srm-button>;
            }
            return val;
          }
        },
        {
          formRow: 30,
          formCol: 10,
          fieldName: this.$T("sslm.enterpriseInform.model.personal.email").$D("邮箱"),
          fieldCode: "mail",
          fieldType: "TEXT",
          render:(val, record, { fieldCode }) => {
            if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
              return <srm-button type="danger" plain> {val} </srm-button>;
            }
            return val;
          }
        },
        {
          formRow: 40,
          formCol: 10,
          fieldName: this.$T("sslm.enterpriseInform.view.model.contactPerson.mobilephone").$D("手机号码"),
          fieldCode: "mobilephone",
          fieldType: "TEXT",
          render:(val, record, { fieldCode }) => {
            const showVal = val && `${record.internationalTelMeaning}|${val}`;
            if (record[fieldCode + "Flag"] === "UPDATE" || record.internationalTelCodeFlag === "UPDATE" || record.objectFlag === "CREATE") {
              return <srm-button type="danger" plain> {showVal} </srm-button>;
            }
            return showVal;
          }
        },
        {
          formRow: 50,
          formCol: 10,
          fieldName: this.$T("sslm.enterpriseInform.view.model.contactPerson.department").$D("部门"),
          fieldCode: "department",
          fieldType: "TEXT",
          render:(val, record, { fieldCode }) => {
            if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
              return <srm-button type="danger" plain> {val} </srm-button>;
            }
            return val;
          }
        },
        {
          formRow: 60,
          formCol: 10,
          fieldName: this.$T("sslm.enterpriseInform.view.model.contactPerson.position").$D("职位"),
          fieldCode: "position",
          fieldType: "TEXT",
          render:(val, record, { fieldCode }) => {
            if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
              return <srm-button type="danger" plain> {val} </srm-button>;
            }
            return val;
          }
        },
        {
          formRow: 70,
          formCol: 10,
          fieldName: this.$T("sslm.enterpriseInform.view.model.contactPerson.telephone").$D("固定电话"),
          fieldCode: "telephone",
          fieldType: "TEXT",
          render:(val, record, { fieldCode }) => {
            if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
              return <srm-button type="danger" plain> {val} </srm-button>;
            }
            return val;
          }
        },
        {
          formRow: 80,
          formCol: 10,
          fieldName: this.$T("sslm.enterpriseInform.view.model.contactPerson.description").$D("备注"),
          fieldCode: "description",
          fieldType: "TEXT",
          render:(val, record, { fieldCode }) => {
            if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
              return <srm-button type="danger" plain> {val} </srm-button>;
            }
            return val;
          }
        },
        {
          formRow: 90,
          formCol: 10,
          fieldName: this.$T("sslm.enterpriseInform.view.model.contactPerson.defaultFlag").$D("默认"),
          fieldCode: "defaultFlag",
          fieldType: "TEXT",
          render:(val, record, { fieldCode }) => {
            const showVal = Number(val) ? this.$T("smbl.common.view.yes").$D("是") : this.$T("smbl.common.view.no").$D("否");
            if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
              return <srm-button type="danger" plain> { showVal } </srm-button>;
            }
            return showVal;
          }
        },
        {
          formRow: 100,
          formCol: 10,
          fieldName: this.$T("sslm.enterpriseInform.view.model.contactPerson.enabledFlag").$D("启用"),
          fieldCode: "enabledFlag",
          fieldType: "TEXT",
          render:(val, record, { fieldCode }) => {
            const showVal = Number(val) ? this.$T("smbl.common.view.yes").$D("是") : this.$T("smbl.common.view.no").$D("否");
            if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
              return <srm-button type="danger" plain> { showVal } </srm-button>;
            }
            return showVal;
          }
        },
      ];
      return columns;
    },
    // 银行信息
    getBankColumnsInfo() {
      const columns = [
        {
          formRow: 10,
          formCol: 10,
          fieldName: this.$T("sslm.enterpriseInform.view.model.bank.bankCountry").$D("国家/地区"),
          fieldCode: "bankCountryName",
          fieldType: "TEXT",
          render:(val, record, { fieldCode }) => {
            if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
              return <srm-button type="danger" plain> {val} </srm-button>;
            }
            return val;
          }
        },
        {
          formRow: 20,
          formCol: 10,
          fieldName: this.$T("sslm.enterpriseInform.view.model.bank.bankCode").$D("银行代码"),
          fieldCode: "bankCode",
          fieldType: "TEXT",
          render:(val, record, { fieldCode }) => {
            if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
              return <srm-button type="danger" plain> {val} </srm-button>;
            }
            return val;
          }
        },
        {
          formRow: 30,
          formCol: 10,
          fieldName: this.$T("sslm.enterpriseInform.view.model.bank.bankName").$D("银行名称"),
          fieldCode: "bankName",
          fieldType: "TEXT",
          render:(val, record, { fieldCode }) => {
            if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
              return <srm-button type="danger" plain> {val} </srm-button>;
            }
            return val;
          }
        },
        {
          formRow: 40,
          formCol: 10,
          fieldName: this.$T("sslm.enterpriseInform.view.model.bank.bankFirm").$D("联行行号"),
          fieldCode: "bankFirm",
          fieldType: "TEXT",
          render:(val, record, { fieldCode }) => {
            if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
              return <srm-button type="danger" plain> {val} </srm-button>;
            }
            return val;
          }
        },
        {
          formRow: 50,
          formCol: 10,
          fieldName: this.$T("sslm.enterpriseInform.view.model.bank.bankBranchName").$D("开户行名称"),
          fieldCode: "bankBranchName",
          fieldType: "TEXT",
          render:(val, record, { fieldCode }) => {
            if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
              return <srm-button type="danger" plain> {val} </srm-button>;
            }
            return val;
          }
        },
        {
          formRow: 60,
          formCol: 10,
          fieldName: this.$T("sslm.enterpriseInform.view.model.bank.bankAccountName").$D("账户名称"),
          fieldCode: "bankAccountName",
          fieldType: "TEXT",
          render:(val, record, { fieldCode }) => {
            if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
              return <srm-button type="danger" plain> {val} </srm-button>;
            }
            return val;
          }
        },
        {
          formRow: 70,
          formCol: 10,
          fieldName: this.$T("sslm.enterpriseInform.view.model.bank.bankAccountNum").$D("银行账号"),
          fieldCode: "bankAccountNum",
          fieldType: "TEXT",
          render:(val, record, { fieldCode }) => {
            if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
              return <srm-button type="danger" plain> {val} </srm-button>;
            }
            return val;
          }
        },
        {
          formRow: 80,
          formCol: 10,
          fieldName: this.$T("sslm.enterpriseInform.view.model.bank.enabledFlag").$D("状态"),
          fieldCode: "enabledFlag",
          fieldType: "TEXT",
          render:(val, record, { fieldCode }) => {
            const showVal = Number(val) ? this.$T("sslm.enterpriseInform.view.model.contactPerson.enabledFlag").$D("启用") : this.$T("smbl.common.view.no").$D("否");
            if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
              return <srm-button type="danger" plain> { showVal } </srm-button>;
            }
            return showVal;
          }
        },
        {
          formRow: 90,
          formCol: 10,
          fieldName: this.$T("sslm.enterpriseInform.view.model.bank.master").$D("主账户"),
          fieldCode: "masterFlag",
          fieldType: "TEXT",
          render:(val, record, { fieldCode }) => {
            const showVal = Number(val) ? this.$T("sslm.enterpriseInform.view.model.contactPerson.enabledFlag").$D("启用") : this.$T("smbl.common.view.no").$D("否");
            if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
              return <srm-button type="danger" plain> { showVal } </srm-button>;
            }
            return showVal;
          }
        },
        {
          formRow: 100,
          formCol: 10,
          fieldName: this.$T("sslm.enterpriseInform.view.model.bank.remark").$D("备注"),
          fieldCode: "remark",
          fieldType: "TEXT",
          render:(val, record, { fieldCode }) => {
            if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
              return <srm-button type="danger" plain> {val} </srm-button>;
            }
            return val;
          }
        },
      ];
      return columns;
    },
    // 地址信息
    getAddressColumnsInfo() {
      const columns = [
        {
          formRow: 10,
          formCol: 10,
          fieldName: this.$T("sslm.enterpriseInform.view.model.address.countryName").$D("国家/地区"),
          fieldCode: "countryName",
          fieldType: "TEXT",
          render:(val, record, { fieldCode }) => {
            if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
              return <srm-button type="danger" plain> {val} </srm-button>;
            }
            return val;
          }
        },
        {
          formRow: 20,
          formCol: 10,
          fieldName: this.$T("sslm.enterpriseInform.view.model.address.regionPathName").$D("省/市/区"),
          fieldCode: "regionPathName",
          fieldType: "TEXT",
          render:(val, record, { fieldCode }) => {
            if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
              return <srm-button type="danger" plain> {val} </srm-button>;
            }
            return val;
          }
        },
        {
          formRow: 30,
          formCol: 10,
          fieldName: this.$T("sslm.enterpriseInform.view.model.address.addressDetail").$D("详细地址"),
          fieldCode: "addressDetail",
          fieldType: "TEXT",
          render:(val, record, { fieldCode }) => {
            if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
              return <srm-button type="danger" plain> {val} </srm-button>;
            }
            return val;
          }
        },
        {
          formRow: 40,
          formCol: 10,
          fieldName: this.$T("sslm.enterpriseInform.view.model.address.postCode").$D("邮政编码"),
          fieldCode: "postCode",
          fieldType: "TEXT",
          render:(val, record, { fieldCode }) => {
            if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
              return <srm-button type="danger" plain> {val} </srm-button>;
            }
            return val;
          }
        },
        {
          formRow: 50,
          formCol: 10,
          fieldName: this.$T("sslm.enterpriseInform.view.model.address.description").$D("地址备注"),
          fieldCode: "description",
          fieldType: "TEXT",
          render:(val, record, { fieldCode }) => {
            if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
              return <srm-button type="danger" plain> {val} </srm-button>;
            }
            return val;
          }
        },
        {
          formRow: 60,
          formCol: 10,
          fieldName: this.$T("sslm.enterpriseInform.view.model.address.enabledFlag").$D("状态"),
          fieldCode: "enabledFlag",
          fieldType: "TEXT",
          render:(val, record, { fieldCode }) => {
            const showVal = Number(val) ? this.$T("sslm.enterpriseInform.view.model.contactPerson.enabledFlag").$D("启用") : this.$T("smbl.common.view.no").$D("否");
            if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
              return <srm-button type="danger" plain> { showVal } </srm-button>;
            }
            return showVal;
          }
        },
      ];
      return columns;
    },
    // 财务状况
    getFinancialColumnsInfo() {
      const columns = [
        {
          formRow: 10,
          formCol: 10,
          fieldName: this.$T("sslm.enterpriseInform.view.model.financial.year").$D("年份"),
          fieldCode: "year",
          fieldType: "TEXT",
          render:(val, record, { fieldCode }) => {
            if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
              return <srm-button type="danger" plain> {val} </srm-button>;
            }
            return val;
          }
        },
        {
          formRow: 20,
          formCol: 10,
          fieldName: this.$T("sslm.enterpriseInform.view.model.financial.currencyName").$D("币种"),
          fieldCode: "currencyName",
          fieldType: "TEXT",
          render:(val, record, { fieldCode }) => {
            if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
              return <srm-button type="danger" plain> {val} </srm-button>;
            }
            return val;
          }
        },
        {
          formRow: 30,
          formCol: 10,
          fieldName: this.$T("sslm.enterpriseInform.view.model.financial.totalAssets").$D("企业总资产(万)"),
          fieldCode: "totalAssets",
          fieldType: "TEXT",
          render:(val, record, { fieldCode }) => {
            if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
              return <srm-button type="danger" plain> {val} </srm-button>;
            }
            return val;
          }
        },
        {
          formRow: 40,
          formCol: 10,
          fieldName: this.$T("sslm.enterpriseInform.view.model.financial.totalLiabilities").$D("总负债(万)"),
          fieldCode: "totalLiabilities",
          fieldType: "TEXT",
          render:(val, record, { fieldCode }) => {
            if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
              return <srm-button type="danger" plain> {val} </srm-button>;
            }
            return val;
          }
        },
        {
          formRow: 50,
          formCol: 10,
          fieldName: this.$T("sslm.enterpriseInform.view.model.financial.currentAssets").$D("流动资产(万)"),
          fieldCode: "currentAssets",
          fieldType: "TEXT",
          render:(val, record, { fieldCode }) => {
            if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
              return <srm-button type="danger" plain> {val} </srm-button>;
            }
            return val;
          }
        },
        {
          formRow: 60,
          formCol: 10,
          fieldName: this.$T("sslm.enterpriseInform.view.model.financial.liabilities").$D("流动负债(万)"),
          fieldCode: "currentLiabilities",
          fieldType: "TEXT",
          render:(val, record, { fieldCode }) => {
            const showVal = Number(val) ? this.$T("sslm.enterpriseInform.view.model.contactPerson.enabledFlag").$D("启用") : this.$T("smbl.common.view.no").$D("否");
            if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
              return <srm-button type="danger" plain> { showVal } </srm-button>;
            }
            return showVal;
          }
        },
        {
          formRow: 70,
          formCol: 10,
          fieldName: this.$T("sslm.enterpriseInform.view.model.financial.revenue").$D("营业收入(万)"),
          fieldCode: "revenue",
          fieldType: "TEXT",
          render:(val, record, { fieldCode }) => {
            if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
              return <srm-button type="danger" plain> {val} </srm-button>;
            }
            return val;
          }
        },
        {
          formRow: 80,
          formCol: 10,
          fieldName: this.$T("sslm.enterpriseInform.view.model.financial.netProfit").$D("净利润(万)"),
          fieldCode: "netProfit",
          fieldType: "TEXT",
          render:(val, record, { fieldCode }) => {
            if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
              return <srm-button type="danger" plain> {val} </srm-button>;
            }
            return val;
          }
        },
        {
          formRow: 90,
          formCol: 10,
          fieldName: this.$T("sslm.enterpriseInform.view.model.financial.assetLiabilityRatio").$D("资产负债率"),
          fieldCode: "assetLiabilityRatio",
          fieldType: "TEXT",
          render:(val, record, { fieldCode }) => {
            const showVal = val > 0 ? (val * 100).toFixed(2) : "";
            if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
              return <srm-button type="danger" plain> {showVal ? showVal + "%" : showVal} </srm-button>;
            }
            return showVal;
          }
        },
        {
          formRow: 100,
          formCol: 10,
          fieldName: this.$T("sslm.enterpriseInform.view.model.financial.currentRatio").$D("流动比率"),
          fieldCode: "currentRatio",
          fieldType: "TEXT",
          render:(val, record, { fieldCode }) => {
            const showVal = val > 0 ? (val * 100).toFixed(2) : "";
            if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
              return <srm-button type="danger" plain> {showVal ? showVal + "%" : showVal} </srm-button>;
            }
            return showVal;
          }
        },
        {
          formRow: 110,
          formCol: 10,
          fieldName: this.$T("sslm.enterpriseInform.view.model.financial.totalRatio").$D("总资产收益率"),
          fieldCode: "totalAssetsEarningsRatio",
          fieldType: "TEXT",
          render:(val, record, { fieldCode }) => {
            const showVal = val > 0 ? (val * 100).toFixed(2) : "";
            if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
              return <srm-button type="danger" plain> {showVal ? showVal + "%" : showVal} </srm-button>;
            }
            return showVal;
          }
        },
        {
          formRow: 120,
          formCol: 10,
          fieldName: this.$T("sslm.enterpriseInform.view.model.financial.remark").$D("备注"),
          fieldCode: "remark",
          fieldType: "TEXT",
          render:(val, record, { fieldCode }) => {
            if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
              return <srm-button type="danger" plain> {val} </srm-button>;
            }
            return val;
          }
        },
      ];
      return columns;
    },
    // 附件信息
    getAttachmentColumnsInfo() {
      const columns = [
        {
          formRow: 10,
          formCol: 10,
          fieldName: this.$T("sslm.enterpriseInform.view.model.attachment.attMeaning").$D("附件类型"),
          fieldCode: "attachmentMeaning",
          fieldType: "TEXT",
          render:(val, record, { fieldCode }) => {
            if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
              return <srm-button type="danger" plain> {val} </srm-button>;
            }
            return val;
          }
        },
        {
          formRow: 20,
          formCol: 10,
          fieldName: this.$T("sslm.enterpriseInform.view.model.attachment.desc").$D("附件描述"),
          fieldCode: "description",
          fieldType: "TEXT",
          render:(val, record, { fieldCode }) => {
            if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
              return <srm-button type="danger" plain> {val} </srm-button>;
            }
            return val;
          }
        },
        {
          formRow: 30,
          formCol: 10,
          fieldName: this.$T("sslm.enterpriseInform.view.model.attachment.endDate").$D("文件到期日"),
          fieldCode: "endDate",
          fieldType: "TEXT",
          render:(val, record, { fieldCode }) => {
            if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
              return <srm-button type="danger" plain> {val} </srm-button>;
            }
            return val;
          }
        },
        {
          formRow: 40,
          formCol: 10,
          fieldName: this.$T("sslm.enterpriseInform.view.model.attachment.lastUpdatedTime").$D("最后更新时间"),
          fieldCode: "uploadDate",
          fieldType: "TEXT",
          render:(val, record, { fieldCode }) => {
            if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
              return <srm-button type="danger" plain> {val} </srm-button>;
            }
            return val;
          }
        },
        {
          formRow: 50,
          formCol: 10,
          fieldName: this.$T("sslm.enterpriseInform.view.model.attachment.upload").$D("附件上传"),
          fieldCode: "attachmentUuid",
          fieldType: "UPLOAD",
          // render:(val, record, { fieldCode }) => {
          //   if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
          //     return <srm-button type="danger" plain> {val} </srm-button>;
          //   }
          //   return val;
          // }
        },
        {
          formRow: 60,
          formCol: 10,
          fieldName: this.$T("sslm.enterpriseInform.view.model.attachment.remark").$D("备注"),
          fieldCode: "remark",
          fieldType: "TEXT",
          render:(val, record, { fieldCode }) => {
            if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
              return <srm-button type="danger" plain> {val} </srm-button>;
            }
            return val;
          }
        },
      ];
      return columns;
    },
    /**
     * 平台级企业信息变更确认页签全部固定：登记信息、注册业务信息、联系人信息、地址信息、银行信息、开票信息、财务状况、附件信息
     * 租户级企业信息变更固定的：登记信息、注册业务信息、联系人信息、地址信息、银行信息、开票信息、财务状况、附件信息、供应商分类、其他信息+调查表页签
       其中：联系人信息、地址信息、银行信息、财务状况、附件信息可能会和调查表发生替换
     */
    // 供应商分类
    getSupClassColumnsInfo() {
      const columns = [
        {
          formRow: 10,
          formCol: 10,
          fieldName: this.$T("sslm.enterpriseInform.model.supplierClassify.code").$D("供应商类型分类"),
          fieldCode: "categoryCode",
          fieldType: "TEXT",
          render:(val, record, { fieldCode }) => {
            if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
              return <srm-button type="danger" plain> {val} </srm-button>;
            }
            return val;
          }
        },
        {
          formRow: 20,
          formCol: 10,
          fieldName: this.$T("sslm.enterpriseInform.model.supplierClassify.describe").$D("供应商分类描述"),
          fieldCode: "categoryDescription",
          fieldType: "TEXT",
          render:(val, record, { fieldCode }) => {
            if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
              return <srm-button type="danger" plain> {val} </srm-button>;
            }
            return val;
          }
        },
        {
          formRow: 30,
          formCol: 10,
          fieldName: this.$T("sslm.enterpriseInform.model.supplierClassify.enabledFlag").$D("是否启用"),
          fieldCode: "enabledFlag",
          fieldType: "TEXT",
          render:(val, record, { fieldCode }) => {
            const showVal = Number(val) ? this.$T("smbl.common.view.yes").$D("是") : this.$T("smbl.common.view.no").$D("否");
            if (record[fieldCode + "Flag"] === "UPDATE" || record.objectFlag === "CREATE") {
              return <srm-button type="danger" plain> { showVal } </srm-button>;
            }
            return showVal;
          }
        },
      ];
      return columns;
    },
    // 其他信息，取个性化配置字段
    getOtherColumnsInfo() {
      const columns = [
      ];
      return columns;
    },
  }
};
