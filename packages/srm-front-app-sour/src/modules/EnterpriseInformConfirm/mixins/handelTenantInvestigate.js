import { getInvestigateConfig, getInvestigateInfoApi } from "../api";
import { camelCase, snakeCase } from "lodash";
import { commonDs } from "../datasource/tabsInfoDS";
import { DataSet } from "srm-mobile-ui";

/*
 * @处理租户级审批，替换调查表页签数据
 * @Author: ZLH
 * @Date: 2022-07-07 16:06:21
 * @LastEditors: ZLH
 * @LastEditTime: 2022-07-14 15:38:17
 * @Description: file content
 */

// 调查表接口配置表
const urls = {
  sslmInvestgBasic: "basics",
  sslmInvestgBusiness: "business",
  sslmInvestgProservice: "proservices",
  sslmInvestgFin: "finances",
  sslmInvestgFinBranch: "finances-branchs",
  sslmInvestgAuth: "authes",
  sslmInvestgContact: "contacts",
  sslmInvestgAddress: "addresses",
  sslmInvestgBankAccount: "bank-accounts",
  sslmInvestgCustomer: "customers",
  sslmInvestgSubSupplier: "sub-suppliers",
  sslmInvestgEquipment: "equipments",
  sslmInvestgRd: "rds",
  sslmInvestgProduce: "produces",
  sslmInvestgQa: "qas",
  sslmInvestgCustservice: "custservices",
  sslmInvestgAttachment: "attachments",
  sslmInvestgReserve1: "reserve1",
  sslmInvestgReserve2: "reserve2",
  sslmInvestgReserve3: "reserve3",
  sslmInvestgReserve4: "reserve4",
  sslmInvestgReserve5: "reserve5",
  sslmInvestgReserve6: "reserve6",
  sslmInvestgReserve7: "reserve7",
  sslmInvestgReserve8: "reserve8",
  sslmInvestgReserve9: "reserve9",
  sslmInvestgReserve10: "reserve10",
  sslmInvestgReserve11: "reserve11",
  sslmInvestgReserve12: "reserve12",
  sslmInvestgReserve13: "reserve13",
  sslmInvestgReserve14: "reserve14",
};

export default {
  data() {
    return {
      // 可被替换的平台tab页签
      replaceTabsCodes: {
        sslmInvestgContact:"sslmInvestgContact", // 联系人页签
        sslmInvestgAddress:"sslmInvestgAddress", // 地址信息页签
        sslmInvestgBankAccount:"sslmInvestgBankAccount", // 开户行信息页签
        sslmInvestgAttachment:"sslmInvestgAttachment", // 附件信息页签
        sslmInvestgFin:"sslmInvestgFin", // 财务状况页签
      },
      // 平台tab页签是否显示标识
      sslmInvestgContactFlag:true, // 联系人信息
      sslmInvestgAddressFlag:true, // 地址信息
      sslmInvestgBankAccountFlag:true, // 开户行信息
      sslmInvestgAttachmentFlag:true, // 附件信息
      sslmInvestgFinFlag:true,
      // 调查表信息
      investigateConfig: {},
      investigateConfigComponents:[],
      investigateConfigHeaders:[], // 调查表页签信息
      investigateConfigLines:[], // 调查表字段配置信息
      investigateDatas:{}, // 所有调查表页签数据集合
      // 调查表所有页签
      investigateConfigRenderMap: {
        sslmInvestgBasic:this.renderTabPage,
        sslmInvestgContact: this.renderTabPage, //联系人信息
        sslmInvestgBusiness: this.renderTabPage, //业务信息
        sslmInvestgProservice: this.renderTabPage, //产品及服务
        sslmInvestgSupplierCate: this.renderTabPage, //供应商分类
        sslmInvestgFin: this.renderTabPage, //近三年财务状况
        sslmInvestgFinBranch: this.renderTabPage, //分支机构
        sslmInvestgAuth: this.renderTabPage, //资质信息
        sslmInvestgAddress: this.renderTabPage, //地址信息
        sslmInvestgBankAccount: this.renderTabPage, //开户行信息
        sslmInvestgCustomer: this.renderTabPage, //主要客户情况
        sslmInvestgSubSupplier: this.renderTabPage, //分供方情况
        sslmInvestgEquipment: this.renderTabPage, //设备信息
        sslmInvestgRd: this.renderTabPage, //研发能力
        sslmInvestgProduce: this.renderTabPage, //生产能力
        sslmInvestgQa: this.renderTabPage, //质保能力
        sslmInvestgCustservice: this.renderTabPage, //售后服务
        sslmInvestgAttachment: this.renderTabPage, //附件信息
        sslmInvestgReserve1: this.renderTabPage, //预留表格1
        sslmInvestgReserve2: this.renderTabPage, //预留表格2
        sslmInvestgReserve3: this.renderTabPage, //预留表单1
        sslmInvestgReserve4: this.renderTabPage, //预留表单2
        sslmInvestgReserve5: this.renderTabPage, //预留表格3
        sslmInvestgReserve6: this.renderTabPage, //预留表格4
        sslmInvestgReserve7: this.renderTabPage, //预留表格5
        sslmInvestgReserve8: this.renderTabPage, //预留表格6
        sslmInvestgReserve9: this.renderTabPage, //预留表格7
        sslmInvestgReserve10: this.renderTabPage, //预留表单3
        sslmInvestgReserve11: this.renderTabPage, //预留表单4
        sslmInvestgReserve12: this.renderTabPage, //预留表单5
        sslmInvestgReserve13: this.renderTabPage, //预留表单6
        sslmInvestgReserve14: this.renderTabPage, //预留表单7
      },
      // componentMap: {
      //   Input: "INPUT",
      //   InputNumber: "INPUT_NUMBER",
      //   ValueList: "SELECT",
      //   Lov: "LOV",
      //   Checkbox: "TEXT",
      //   Switch: "TEXT",
      // },
      componentMap: {
        DATE_PICKER:"TEXT",
        DatePicker:"TEXT",
        Input: "TEXT",
        InputNumber: "TEXT",
        ValueList: "TEXT",
        Lov: "TEXT",
        Checkbox: "TEXT",
        Switch: "TEXT",
        TextArea: "TEXT",
      },
      // 调查表页签数据
      tabsDs:{
        sslmInvestgBasic: new DataSet(commonDs()), // 基本信息
        sslmInvestgContact: new DataSet(commonDs()), //联系人信息
        sslmInvestgBusiness: new DataSet(commonDs()), //业务信息
        sslmInvestgProservice: new DataSet(commonDs()), //产品及服务
        sslmInvestgSupplierCate: new DataSet(commonDs()), //供应商分类
        sslmInvestgFin: new DataSet(commonDs()), //近三年财务状况
        sslmInvestgFinBranch: new DataSet(commonDs()), //分支机构
        sslmInvestgAuth: new DataSet(commonDs()), //资质信息
        sslmInvestgAddress: new DataSet(commonDs()), //地址信息
        sslmInvestgBankAccount: new DataSet(commonDs()), //开户行信息
        sslmInvestgCustomer: new DataSet(commonDs()), //主要客户情况
        sslmInvestgSubSupplier: new DataSet(commonDs()), //分供方情况
        sslmInvestgEquipment: new DataSet(commonDs()), //设备信息
        sslmInvestgRd: new DataSet(commonDs()), //研发能力
        sslmInvestgProduce: new DataSet(commonDs()), //生产能力
        sslmInvestgQa: new DataSet(commonDs()), //质保能力
        sslmInvestgCustservice: new DataSet(commonDs()), //售后服务
        sslmInvestgAttachment: new DataSet(commonDs()), //附件信息
        sslmInvestgReserve1: new DataSet(commonDs()), //预留表格1
        sslmInvestgReserve2: new DataSet(commonDs()), //预留表格2
        sslmInvestgReserve3: new DataSet(commonDs()), //预留表单1
        sslmInvestgReserve4: new DataSet(commonDs()), //预留表单2
        sslmInvestgReserve5: new DataSet(commonDs()), //预留表格3
        sslmInvestgReserve6: new DataSet(commonDs()), //预留表格4
        sslmInvestgReserve7: new DataSet(commonDs()), //预留表格5
        sslmInvestgReserve8: new DataSet(commonDs()), //预留表格6
        sslmInvestgReserve9: new DataSet(commonDs()), //预留表格7
        sslmInvestgReserve10: new DataSet(commonDs()), //预留表单3
        sslmInvestgReserve11: new DataSet(commonDs()), //预留表单4
        sslmInvestgReserve12: new DataSet(commonDs()), //预留表单5
        sslmInvestgReserve13: new DataSet(commonDs()), //预留表单6
        sslmInvestgReserve14: new DataSet(commonDs()), //预留表单7
      },
    };
  },
  methods: {
    // 获取调查表配置
    async fetchConfig() {
      const params = {
        changeReqId: this.changeReqId,
        partnerTenantId: this.partnerTenantId,
      };
      await getInvestigateConfig(params).then((res = {}) => {
        this.investigateConfig = res;
        this.investigateConfigHeaders = res.investigateConfigHeaders || [];
        // 获取调查表中所有页签编码
        const investigateConfigHeadersTabs = res.investigateConfigHeaders.map((e) => e.configName) || [];
        this.sslmInvestgContactFlag = !investigateConfigHeadersTabs.includes(this.replaceTabsCodes.sslmInvestgContact);
        this.sslmInvestgAddressFlag = !investigateConfigHeadersTabs.includes(this.replaceTabsCodes.sslmInvestgAddress);
        this.sslmInvestgBankAccountFlag = !investigateConfigHeadersTabs.includes(this.replaceTabsCodes.sslmInvestgBankAccount);
        this.sslmInvestgAttachmentFlag = !investigateConfigHeadersTabs.includes(this.replaceTabsCodes.sslmInvestgAttachment);
        this.sslmInvestgFinFlag = !investigateConfigHeadersTabs.includes(this.replaceTabsCodes.sslmInvestgFin);

        // console.log("sslmInvestgBankAccountFlag:", this.sslmInvestgBankAccountFlag);
        // console.log("sslmInvestgAddressFlag:", this.sslmInvestgAddressFlag);
        // console.log("sslmInvestgContactFlag:", this.sslmInvestgContactFlag);
        // console.log("sslmInvestgAttachmentFlag:", this.sslmInvestgAttachmentFlag);
        // console.log("sslmInvestgFinFlag:", this.sslmInvestgFinFlag);

      });
    },
    // 校验上传链接类型
    checkUploadUrlType(investgCfLineId, investigateConfigComponents) {
      const investigateConfig = investigateConfigComponents.filter((e) => e.investgCfLineId === investgCfLineId && e.attributeName === "isAttachmentUrl");
      return investigateConfig[0] ? investigateConfig[0].attributeValue : false;
    },
    // 构造调查表colums
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
            render: (val, record, { fieldCode }) => {
              // 地区字段单独处理
              if (fieldCode === "regionId") {
                const showVal = record[`${fieldCode}Meaning`];
                if (record[fieldCode + "StateFlag"] !== "original" || record.firmChangeBeanStateFlag === "insert") {
                  return <srm-button type="danger" plain> {showVal} </srm-button>;
                }
                return showVal;
              }
              if ([ "Lov", "ValueList" ].includes(e.componentType)) {
                const showVal = record[`${fieldCode}Meaning`];
                if (record[fieldCode + "StateFlag"] !== "original" || record.firmChangeBeanStateFlag === "insert") {
                  return <srm-button type="danger" plain> {showVal} </srm-button>;
                }
                return showVal;
              }
              if ([ "Checkbox", "Switch" ].includes(e.componentType)) {
                const showVal = Number(val) ? this.$T("smbl.common.view.yes").$D("是") : this.$T("smbl.common.view.no").$D("否");
                if (record[fieldCode + "StateFlag"] !== "original" || record.firmChangeBeanStateFlag === "insert") {
                  return <srm-button type="danger" plain> {showVal} </srm-button>;
                }
                return showVal;
              }
              if (record[fieldCode + "StateFlag"] !== "original" || record.firmChangeBeanStateFlag === "insert") {
                return <srm-button type="danger" plain> {val} </srm-button>;
              }
              return record[`${fieldCode}Meaning`] || val;
            },
          };

        });
    },
    // 调查表接口获取数据
    getInvestgApiInfo(investgType) {
      const params = {
        changeReqId: this.changeReqId,
        partnerTenantId: this.partnerTenantId,
      };
      getInvestigateInfoApi(urls[investgType], params).then((res) => {
        this.tabsDs[investgType].reset();
        if (res) {
          this.investigateDatas[investgType] = res;
          // 初始化调查表页签数据,默认给变更后信息
          if (this.currentButtonTab === 0) {
            this.tabsDs[investgType].setData(res[0]);
            this.tabsDs[investgType].locate(0);
          } else {
            this.tabsDs[investgType].setData(res[1]);
            this.tabsDs[investgType].locate(0);
          }
        }
      });
    },
    // 渲染调查表返回的tabs数据
    renderTabPage(config) {
      const { investgCfHeaderId, configName } = config;
      this.getInvestgApiInfo(configName);
      const columns = this.getCustomColumns(investgCfHeaderId);
      return <SrmList
        scrollable={false}
        dataSet={this.tabsDs[configName]}
        // onItemClick={() => columns.length > 10 ? this.openDetailPopup(this.tabsDs[configName], columns) : null}
        columns={columns}/>;
    },
  }
};
