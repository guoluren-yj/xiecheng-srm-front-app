import {
  getHeaderApi,
  getHeaderLineApi,
  getLineApi,
  getLovApi
} from "./api/JiaLan_DemandContactApproval";
import { dateFormat } from "@/utils/index";

export default {
  props: {
    changeReqId: {
      type: String | Number,
      default: "",
    },
    // 移动表单url携带的参数键值对
    parameters: {
      type: Object,
    }
  },
  data() {
    return {
      title: "需求联络单审批",
      initLoading: false,
      loading: false,
      headInfo: {}, // 头信息
      headLinesInfo: [], // 头-行信息
      linesInfo: [], // 行信息
      type: "", // 流程表单类型 5种 One(只读)/Two(编辑头)/Three(编辑行)/Four(可编辑)/Five(编辑头行)
      liaisonType: "", // 单据类型 5种 10(专柜)/20(撤柜/移柜)/30(定制柜)/40(图文/美妆柜)/50(物流运输柜)
    };
  },
  async mounted() {
    if (this.changeReqId) {
      try {
        this.initLoading = true;
        await this.fetchData();
        await this.fatchLine();
        await this.getLovInterface();
        this.loading = true;
      } catch (err) {
        this.initLoading = false;
      } finally {
        this.initLoading = false;
      }
    }
    this.$emit("GetApprovalTitle", this.getLanguageDefine(this.title));
    if (this.parameters) {
      this.type = this.parameters.type;
    }
  },
  methods: {
    // 头信息
    async fetchData() {
      await getHeaderApi(this.changeReqId, {
        page: 0,
        size: 1000,
      }).then((res) => {
        if (res && !res.failed) {
          this.headInfo = { ...res };
          this.liaisonType = this.headInfo.liaisonType;
          if (this.liaisonType === "10") {
            // 头行信息
            getHeaderLineApi(this.changeReqId, {}).then((r) => {
              if (r && !r.failed) {
                this.headLinesInfo = [ ...r ];
              }
            });
          }
        }
      });
    },
    // 行信息
    async fatchLine() {
      await getLineApi(this.changeReqId, {
        page: 0,
        size: 1000,
        liaisonType: this.liaisonType
      }).then((res) => {
        this.linesInfo = [ ...res ];
      });
    },
    // 调用独立值集
    async getLovInterface() {
      await Promise.all([
        getLovApi(this.getLovCode("维修品类")),
        getLovApi(this.getLovCode("维修项目")),
        getLovApi(this.getLovCode("异常原因")),
        getLovApi(this.getLovCode("备注")),
        getLovApi(this.getLovCode("执行部门")),
      ]).then(([ m1, m2, m3, m4, m5 ]) => {
        this.headLinesInfo.map((res) => {
          res["repairCategoryMeaning"] = m1.find((v) => v.value === res["repairCategory"]) ? m1.find((v) => v.value === res["repairCategory"]).meaning : "";
          res["repairItemMeaning"] = m2.find((v) => v.value === res["repairItem"]) ? m2.find((v) => v.value === res["repairItem"]).meaning : "";
          res["repairReasonMeaning"] = m3.find((v) => v.value === res["repairReason"]) ? m3.find((v) => v.value === res["repairReason"]).meaning : "";
          res["detailCommentsMeaning"] = m4.find((v) => v.value === res["detailComments"]) ? m4.find((v) => v.value === res["detailComments"]).meaning : "";
        });
        this.headInfo["liaisonUnitMeaning"] = m5.find((v)=> v.value === this.headInfo["liaisonUnit"]) ? m5.find((v) => v.value === this.headInfo["liaisonUnit"]).meaning : "";
        this.headInfo["measurementMeaning"] = [ "0", "1" ].includes(this.headInfo["measurementFlag"]) ? this.headInfo["measurementFlag"] === "1" ? "是" : "否" : "";
        this.headInfo["assetMeaning"] = [ "0", "1" ].includes(this.headInfo["assetFlag"]) ? this.headInfo["assetFlag"] === "1" ? "是" : "否" : "";
      });
    },
    // 获取 多语言配置
    getLanguageDefine(key) {
      const languageList = {
        "暂无数据": this.$T("hipspfm.common.view.message.title.noData").$D("暂无数据"),
        "需求联络单审批": this.$T("scux.demandContactFrom.view.title.demandContactApproval").$D("需求联络单审批"),
        "需求联络单头信息": this.$T("scux.demandContactFrom.view.title.baseInfo").$D("需求联络单头信息"),
        "需求联络单行信息": this.$T("scux.demandContactFrom.view.title.lineInfo").$D("需求联络单行信息"),
        "查看详情": this.$T("hzero.common.button.details").$D("查看详情"),
      };
      return languageList[key] || `scux.demandContactFrom.model.${key}`;
    },
    // 获取 lov值集
    getLovCode(key) {
      const lovList = {
        "单位": "SMDM.DUAL_UOM",
        "税率": "SMDM.TAX",
        "币种": "SMDM.CURRENCY",
        "物料编码": "SCUX.JALA.ITEM_CU",
        "公司": "SPFM.USER_AUTH.COMPANY",
        "品牌": "SCUX.JALA.LIAISON.BRAND",
        "供应商": "SPFM.TENANT_SUPPLIER",
        "备注": "SCUX.JALA.LIAISON.REPAIR.NOTE",
        "库存组织": "SCUX.JALA.INV_ORGANIZATION",
        "物料分类": "SCUX.JALA.REQ_CATEGORY_CODE",
        "维修品类": "SCUX.JALA.LIAISON.REPAIR.TYPE",
        "维修项目": "SCUX.JALA.LIAISON.REPAIR.ITEM",
        "异常原因": "SCUX.JALA.LIAISON.REPAIR.REASON",
        "执行部门": "SCUX.JALA.LIAISON.UNIT",
        "业务类型": "SCUX.JALA.REQ.BUSINESS_TYPE",
        "区域执行主管": "LOV_EMPLOYEE",
        "大区": "SCUX.JALA.REGION",
        "费用归属部门": "SCUX.JALA.COST_CENTER",
        "是否测量": "SPCM.ENABLED_FLAG",
        "是否计入固定资产": "SPCM.ENABLED_FLAG",
      };
      return lovList[key] || "";
    },
    changeFieldCallBack(obj, field, lineNum = -1) {
      if (field === "companyId") {
        this.headInfo["companyId"] = obj.companyId;
        this.headInfo["companyName"] = obj.companyName;
      }
      if (field === "supplierCompanyId") {
        this.headInfo["supplierCompanyId"] = obj.companyId;
        this.headInfo["supplierCompanyName"] = obj.companyName;
        this.headInfo["supplierCompanyCode"] = obj.companyNum;
      }
      if (field === "madeSupplierCompanyId") {
        this.headInfo["madeSupplierCompanyId"] = obj.companyId;
        this.headInfo["madeSupplierCompanyName"] = obj.companyName;
      }
      if (field === "employeeId") {
        this.headInfo["employeeId"] = obj.employeeId;
        this.headInfo["employeeName"] = obj.employeeName;
        this.headInfo["employeeNum"] = obj.employeeNum;
      }
      if (field === "costUnitId") {
        this.headInfo["costUnitId"] = obj.costId;
        this.headInfo["costUnitName"] = obj.costName;
      }
      if (field === "brandMeaning") {
        this.headInfo["brand"] = obj.value;
        this.headInfo["brandMeaning"] = obj.meaning;
      }
      if (field === "regionMeaning") {
        this.headInfo["region"] = obj.value;
        this.headInfo["regionMeaning"] = obj.meaning;
      }
      if (field === "businessTypeMeaning") {
        this.headInfo["businessType"] = obj.value;
        this.headInfo["businessTypeMeaning"] = obj.meaning;
      }
      if (field === "measurementFlag") {
        this.headInfo["measurementFlag"] = obj.value;
        this.headInfo["measurementMeaning"] = obj.meaning;
      }
      if (field === "assetFlag") {
        this.headInfo["assetFlag"] = obj.value;
        this.headInfo["assetMeaning"] = obj.meaning;
      }
      if (lineNum < 0) {
        return;
      }
      if (field === "itemId") {
        this.linesInfo[lineNum]["itemId"] = obj.itemId;
        this.linesInfo[lineNum]["itemCode"] = obj.itemCode;
        this.linesInfo[lineNum]["itemName"] = obj.itemName;
      }
      if (field === "organizationId") {
        this.linesInfo[lineNum]["organizationId"] = obj.organizationId;
        this.linesInfo[lineNum]["organizationName"] = obj.organizationName;
      }
      if (field === "categoryId") {
        this.linesInfo[lineNum]["categoryId"] = obj.categoryId;
        this.linesInfo[lineNum]["categoryName"] = obj.categoryName;
        this.linesInfo[lineNum]["categoryCode"] = obj.categoryCode;
      }
      if (field === "uomId") {
        this.linesInfo[lineNum]["uomId"] = obj.uomId;
        this.linesInfo[lineNum]["uomName"] = obj.uomName;
      }
      if (field === "taxId") {
        this.linesInfo[lineNum]["taxId"] = obj.taxId;
        this.linesInfo[lineNum]["taxRate"] = obj.taxRate;
      }
      if (field === "currencyId") {
        this.linesInfo[lineNum]["currencyId"] = obj.currencyId;
        this.linesInfo[lineNum]["currencyName"] = obj.currencyName;
      }
    },
    // 获取字段
    getFieldInfo(name, lineNum) {
      let columnList = [
        // 头信息
        {
          fieldName: "liaisonNum",
          fieldCode: "liaisonNum",
          langCode: this.getLanguageDefine("liaisonNum") || "需求联络单号",
          fieldType: "EMPTY",
          render: (val) => {
            return (
              <div class="first-item">
                <span class="block" />
                <span class="text">{val}</span>
              </div>
            );
          }
        },
        {
          fieldName: "标题",
          fieldCode: "title",
          langCode: this.getLanguageDefine("title") || "标题",
          fieldType: "INPUT",
          required: true,
        },
        {
          fieldName: "需求类型",
          fieldCode: "liaisonTypeMeaning",
          langCode: this.getLanguageDefine("liaisonTypeMeaning"),
          fieldType: "TEXT",
          required: true,
        },
        {
          fieldName: "需求联络单号",
          fieldCode: "liaisonNum",
          langCode: this.getLanguageDefine("liaisonNum"),
          fieldType: "TEXT",
        },
        {
          fieldName: "申请人",
          fieldCode: "reqByName",
          langCode: this.getLanguageDefine("reqByName"),
          fieldType: "TEXT",
        },
        {
          fieldName: "申请日期",
          fieldCode: "applicationTime",
          langCode: this.getLanguageDefine("applicationTime"),
          fieldType: "TEXT",
          render: (val)=>{
            return (
              <span>{dateFormat(val)}</span>
            );
          }
        },
        {
          fieldName: "申请部门",
          fieldCode: "unitName",
          langCode: this.getLanguageDefine("unitName"),
          fieldType: "TEXT",
        },
        {
          fieldName: "创建人",
          fieldCode: "realName",
          langCode: this.getLanguageDefine("realName"),
          fieldType: "TEXT",
        },
        {
          fieldName: "创建时间",
          fieldCode: "creationDate",
          langCode: this.getLanguageDefine("creationDate"),
          fieldType: "TEXT",
          render: (val)=>{
            return (
              <span>{dateFormat(val)}</span>
            );
          }
        },
        {
          fieldName: "公司",
          fieldCode: "companyId",
          langCode: this.getLanguageDefine("companyName"),
          fieldType: "LOV",
          displayField: "companyName",
          lovCode: this.getLovCode("公司"),
          options: {
            multiple: false,
            queryField: "companyName", // 查询
            displayField: "companyName", // 主键
            subDisplayField: "companyNum",
            valueField: "companyId",
            inputChange: this.changeFieldCallBack,
            lineNum: lineNum,
            callback: function ([ item ]) {
              this.inputChange(item, this.valueField, this.lineNum);
            },
          },
          required: true,
        },
        {
          fieldName: "业务实体",
          fieldCode: "ouName",
          langCode: this.getLanguageDefine("ouName"),
          fieldType: "TEXT",
        },
        {
          fieldName: "采购组织",
          fieldCode: "purOrganizationName",
          langCode: this.getLanguageDefine("purOrganizationName"),
          fieldType: "TEXT",
        },
        {
          fieldName: "采购员",
          fieldCode: "ouName",
          langCode: this.getLanguageDefine("purchaseAgentName"),
          fieldType: "TEXT",
        },
        {
          fieldName: "品牌",
          fieldCode: "brand",
          langCode: this.getLanguageDefine("brandMeaning"),
          fieldType: "SELECT",
          displayField: "brandMeaning",
          lovCode: this.getLovCode("品牌"),
          options: {
            valueField: "brandMeaning",
            inputChange: this.changeFieldCallBack,
            lineNum: lineNum,
            callback: function ([ item ]) {
              this.inputChange(item, this.valueField, this.lineNum);
            },
          },
          required: true,
        },
        {
          fieldName: "供应商",
          fieldCode: "supplierCompanyId",
          langCode: this.getLanguageDefine("supplierCompanyName"),
          fieldType: "LOV",
          displayField: "supplierCompanyName",
          lovCode: this.getLovCode("供应商"),
          options: {
            multiple: false,
            queryField: "companyName", // 查询
            displayField: "companyName", // 主键
            subDisplayField: "companyNum",
            valueField: "supplierCompanyId",
            inputChange: this.changeFieldCallBack,
            lineNum: lineNum,
            callback: function ([ item ]) {
              this.inputChange(item, this.valueField, this.lineNum);
            },
          },

        },
        {
          fieldName: "进柜/交货时间",
          fieldCode: "deliverDate",
          langCode: this.getLanguageDefine("deliverDate1"),
          fieldType: "DATE",
          required: true,
          render: (val)=>{
            return (
              <span>{dateFormat(val)}</span>
            );
          }
        },
        {
          fieldName: "柜台编码",
          fieldCode: "deliverNum",
          langCode: this.getLanguageDefine("deliverNum"),
          fieldType: "INPUT",
          required: true,
        },
        {
          fieldName: "柜台/道具版本",
          fieldCode: "deliverVersion",
          langCode: this.getLanguageDefine("deliverVersion"),
          fieldType: "INPUT",
          required: true,
        },
        {
          fieldName: "柜型",
          fieldCode: "deliverRange",
          langCode: this.getLanguageDefine("deliverRange"),
          fieldType: "INPUT",
          required: true,
        },
        {
          fieldName: "柜地面积/延米",
          fieldCode: "deliverSpec",
          langCode: this.getLanguageDefine("deliverSpec"),
          fieldType: "INPUT",
          required: true,
        },
        {
          fieldName: "制作供应商",
          fieldCode: "madeSupplierCompanyId",
          langCode: this.getLanguageDefine("madeSupplierCompanyName"),
          fieldType: "LOV",
          displayField: "madeSupplierCompanyName",
          lovCode: this.getLovCode("制作供应商"),
          options: {
            multiple: false,
            queryField: "companyName", // 查询
            displayField: "companyName", // 主键
            subDisplayField: "companyNum",
            valueField: "madeSupplierCompanyId",
            inputChange: this.changeFieldCallBack,
            lineNum: lineNum,
            callback: function ([ item ]) {
              this.inputChange(item, this.valueField, this.lineNum);
            },
          },
          required: true,
        },
        {
          fieldName: "要求完成日期",
          fieldCode: "finishDate",
          langCode: this.getLanguageDefine("finishDate"),
          fieldType: "DATE",
          render: (val)=>{
            return (
              <span>{dateFormat(val)}</span>
            );
          }
        },
        {
          fieldName: "实际交货时间",
          fieldCode: "finishDate",
          langCode: this.getLanguageDefine("finishDateTrue"),
          fieldType: "DATE",
          render: (val)=>{
            return (
              <span>{dateFormat(val)}</span>
            );
          }
        },
        {
          fieldName: "实际完成时间",
          fieldCode: "finishDate",
          langCode: this.getLanguageDefine("finishDateTrueNew"),
          fieldType: "DATE",
          render: (val)=>{
            return (
              <span>{dateFormat(val)}</span>
            );
          }
        },
        {
          fieldName: "异常处理方式",
          fieldCode: "exceptionProcess",
          langCode: this.getLanguageDefine("exceptionProcess"),
          fieldType: "INPUT",
        },
        {
          fieldName: "区域执行主管",
          fieldCode: "employeeId",
          langCode: this.getLanguageDefine("employeeName"),
          fieldType: "LOV",
          displayField: "employeeName",
          lovCode: this.getLovCode("区域执行主管"),
          options: {
            multiple: false,
            queryField: "name", // 查询
            displayField: "name", // 主键
            subDisplayField: "employeeNum",
            valueField: "employeeId",
            inputChange: this.changeFieldCallBack,
            lineNum: lineNum,
            callback: function ([ item ]) {
              this.inputChange(item, this.valueField, this.lineNum);
            },
          },
          required: true,
        },
        {
          fieldName: "维修明细表",
          fieldCode: "serviceAttachmentUuid",
          render: (val) => {
            return (
              <SrmUpload
                color="blue"
                attachmentUuid={val}
                canUpload={![ "One" ].includes(this.type)}
                canDelete={![ "One" ].includes(this.type)}
                showIcon={false}
                descTitle={this.$T("hipspfm.common.button.uploadAttachment").$D("上传附件")} />
            );
          }
        },
        {
          fieldName: "备注说明",
          fieldCode: "comments",
          langCode: this.getLanguageDefine("comments"),
          fieldType: "TEXT_AREA",

        },
        {
          fieldName: "审批意见",
          fieldCode: "approveRemark",
          langCode: this.getLanguageDefine("approveRemark"),
          fieldType: "TEXT_AREA",
        },
        {
          fieldName: "柜台验收单",
          fieldCode: "attachmentUuid",
          render: (val) => {
            return (
              <SrmUpload
                color="blue"
                attachmentUuid={val}
                canUpload={![ "One" ].includes(this.type)}
                canDelete={![ "One" ].includes(this.type)}
                showIcon={false}
                descTitle={this.$T("hipspfm.common.button.uploadAttachment").$D("上传附件")} />
            );
          }
        },
        {
          fieldName: "相关流程链接",
          fieldCode: "processUrl",
          langCode: this.getLanguageDefine("processUrl"),
          fieldType: "TEXT_AREA",
        },
        {
          fieldName: "业务类型",
          fieldCode: "businessType",
          langCode: this.getLanguageDefine("businessTypeMeaning"),
          fieldType: "SELECT",
          displayField: "businessTypeMeaning",
          lovCode: this.getLovCode("业务类型"),
          options: {
            valueField: "businessTypeMeaning",
            inputChange: this.changeFieldCallBack,
            lineNum: lineNum,
            callback: function ([ item ]) {
              this.inputChange(item, this.valueField, this.lineNum);
            },
          },
          required: true,
        },
        {
          fieldName: "大区",
          fieldCode: "region",
          langCode: this.getLanguageDefine("regionMeaning"),
          fieldType: "SELECT",
          displayField: "regionMeaning",
          lovCode: this.getLovCode("大区"),
          options: {
            valueField: "regionMeaning",
            inputChange: this.changeFieldCallBack,
            lineNum: lineNum,
            callback: function ([ item ]) {
              this.inputChange(item, this.valueField, this.lineNum);
            },
          },
          required: true,
        },
        {
          fieldName: "地区",
          fieldCode: "area",
          langCode: this.getLanguageDefine("area"),
          fieldType: "INPUT",
          required: true,
        },
        {
          fieldName: "城市",
          fieldCode: "city",
          langCode: this.getLanguageDefine("city"),
          fieldType: "INPUT",
          required: true,
        },
        {
          fieldName: "撤柜/移柜时间",
          fieldCode: "deliverDate",
          langCode: this.getLanguageDefine("deliverDate2"),
          fieldType: "DATE",
          required: true,
          render: (val)=>{
            return (
              <span>{dateFormat(val)}</span>
            );
          }
        },
        {
          fieldName: "预计进柜时间",
          fieldCode: "deliverDate",
          langCode: this.getLanguageDefine("deliverDate3"),
          fieldType: "DATE",
          required: true,
          render: (val)=>{
            return (
              <span>{dateFormat(val)}</span>
            );
          }
        },
        {
          fieldName: "费用归属部门",
          fieldCode: "costUnitId",
          langCode: this.getLanguageDefine("costUnitName"),
          fieldType: "LOV",
          displayField: "costUnitName",
          lovCode: this.getLovCode("费用归属部门"),
          options: {
            multiple: false,
            queryField: "costName", // 查询
            displayField: "costName", // 主键
            subDisplayField: "costCode",
            valueField: "costUnitId",
            inputChange: this.changeFieldCallBack,
            lineNum: lineNum,
            callback: function ([ item ]) {
              this.inputChange(item, this.valueField, this.lineNum);
            },
          },
          required: true,
        },
        {
          fieldName: "执行部门",
          fieldCode: "liaisonUnit",
          langCode: this.getLanguageDefine("liaisonUnitMeaning"),
          fieldType: "SELECT",
          displayField: "liaisonUnitMeaning",
          lovCode: this.getLovCode("执行部门"),
          options: {
            valueField: "liaisonUnitMeaning",
            inputChange: this.changeFieldCallBack,
            lineNum: lineNum,
            callback: function ([ item ]) {
              this.inputChange(item, this.valueField, this.lineNum);
            },
          },
          required: true,
        },
        {
          fieldName: "地区执行费用",
          fieldCode: "areaCost",
          langCode: this.getLanguageDefine("areaCost"),
          fieldType: "INPUT",
        },
        {
          fieldName: "柜台信息备注",
          fieldCode: "comments",
          langCode: this.getLanguageDefine("counterComment"),
          fieldType: "TEXT_AREA",

        },
        {
          fieldName: "商场图片/平面图纸",
          fieldCode: "serviceAttachmentUuid",
          render: (val) => {
            return (
              <SrmUpload
                color="blue"
                attachmentUuid={val}
                canUpload={![ "One" ].includes(this.type)}
                canDelete={![ "One" ].includes(this.type)}
                showIcon={false}
                descTitle={this.$T("hipspfm.common.button.uploadAttachment").$D("上传附件")} />
            );
          }
        },
        {
          fieldName: "是否测量",
          fieldCode: "measurementFlag",
          langCode: this.getLanguageDefine("measurementMeaning"),
          fieldType: "SELECT",
          displayField: "measurementMeaning",
          lovCode: this.getLovCode("是否测量"),
          options: {
            valueField: "measurementFlag",
            inputChange: this.changeFieldCallBack,
            lineNum: lineNum,
            callback: function ([ item ]) {
              this.inputChange(item, this.valueField, this.lineNum);
            },
          },

        },
        {
          fieldName: "商签时间",
          fieldCode: "signDate",
          langCode: this.getLanguageDefine("signDate"),
          fieldType: "DATE",
          render: (val)=>{
            return (
              <span>{dateFormat(val)}</span>
            );
          }
        },
        {
          fieldName: "验收单",
          fieldCode: "checkAttachmentUuid",
          render: (val) => {
            return (
              <SrmUpload
                color="blue"
                attachmentUuid={val}
                canUpload={![ "One" ].includes(this.type)}
                canDelete={![ "One" ].includes(this.type)}
                showIcon={false}
                descTitle={this.$T("hipspfm.common.button.uploadAttachment").$D("上传附件")} />
            );
          }
        },
        {
          fieldName: "最终版图纸",
          fieldCode: "finalAttachmentUuid",
          render: (val) => {
            return (
              <SrmUpload
                color="blue"
                attachmentUuid={val}
                canUpload={![ "One" ].includes(this.type)}
                canDelete={![ "One" ].includes(this.type)}
                showIcon={false}
                descTitle={this.$T("hipspfm.common.button.uploadAttachment").$D("上传附件")} />
            );
          }
        },
        {
          fieldName: "是否计入固定资产",
          fieldCode: "assetFlag",
          langCode: this.getLanguageDefine("assetMeaning"),
          fieldType: "SELECT",
          displayField: "assetMeaning",
          lovCode: this.getLovCode("是否计入固定资产"),
          options: {
            valueField: "assetFlag",
            inputChange: this.changeFieldCallBack,
            lineNum: lineNum,
            callback: function ([ item ]) {
              this.inputChange(item, this.valueField, this.lineNum);
            },
          },

        },
        {
          fieldName: "固定资产编号",
          fieldCode: "assetNum",
          langCode: this.getLanguageDefine("assetNum"),
          fieldType: "INPUT",

        },
        {
          fieldName: "是否入库",
          fieldCode: "haveStorage",
          langCode: this.getLanguageDefine("haveStorageMeaning"),
          fieldType: "SELECT",
          displayField: "haveStorageMeaning",
          lovCode: this.getLovCode("是否入库"),
          options: {
            valueField: "haveStorageMeaning",
            inputChange: this.changeFieldCallBack,
            lineNum: lineNum,
            callback: function ([ item ]) {
              this.inputChange(item, this.valueField, this.lineNum);
            },
          },

        },
        {
          fieldName: "成本中心编码",
          fieldCode: "costCenterId",
          langCode: this.getLanguageDefine("costCenterNum"),
          fieldType: "LOV",
          displayField: "costCenterNum",
          lovCode: this.getLovCode("成本中心编码"),
          options: {
            multiple: false,
            queryField: "costCenterNum", // 查询
            displayField: "costCenterNum", // 主键
            subDisplayField: "costCenterName",
            valueField: "costCenterId",
            inputChange: this.changeFieldCallBack,
            lineNum: lineNum,
            callback: function ([ item ]) {
              this.inputChange(item, this.valueField, this.lineNum);
            },
          },

        },
        {
          fieldName: "成本中心名称",
          fieldCode: "costCenterName",
          langCode: this.getLanguageDefine("costCenterName"),
          fieldType: "INPUT",

        },
        {
          fieldName: "运输需求类别",
          fieldCode: "transportType",
          langCode: this.getLanguageDefine("transportTypeMeaning"),
          fieldType: "SELECT",
          displayField: "transportTypeMeaning",
          lovCode: this.getLovCode("运输需求类别"),
          options: {
            valueField: "transportTypeMeaning",
            inputChange: this.changeFieldCallBack,
            lineNum: lineNum,
            callback: function ([ item ]) {
              this.inputChange(item, this.valueField, this.lineNum);
            },
          },

        },
        // 头行信息
        {
          fieldName: "维修品类",
          fieldCode: "repairCategory",
          langCode: this.getLanguageDefine("repairCategoryMeaning"),
          fieldType: "SELECT",
          displayField: "repairCategoryMeaning",
          lovCode: this.getLovCode("维修品类"),
          options: {
            multiple: false,
            valueField: "repairCategoryMeaning",
            inputChange: this.changeFieldCallBack,
            lineNum: lineNum,
            callback: function ([ item ]) {
              this.inputChange(item, this.valueField, this.lineNum);
            },
          },

        },
        {
          fieldName: "维修项目",
          fieldCode: "repairItem",
          langCode: this.getLanguageDefine("repairItemMeaning"),
          fieldType: "SELECT",
          displayField: "repairItemMeaning",
          lovCode: this.getLovCode("维修项目"),
          options: {
            multiple: false,
            valueField: "repairItemMeaning",
            inputChange: this.changeFieldCallBack,
            lineNum: lineNum,
            callback: function ([ item ]) {
              this.inputChange(item, this.valueField, this.lineNum);
            },
          },

        },
        {
          fieldName: "维修内容",
          fieldCode: "repairContent",
          langCode: this.getLanguageDefine("repairContent"),
          fieldType: "INPUT",

        },
        {
          fieldName: "数量1",
          fieldCode: "repairQuantity",
          langCode: this.getLanguageDefine("repairQuantity"),
          fieldType: "INPUT_NUMBER",

        },
        {
          fieldName: "事件描述",
          fieldCode: "repairDesc",
          langCode: this.getLanguageDefine("repairDesc"),
          fieldType: "TEXT_AREA",

        },
        {
          fieldName: "异常原因",
          fieldCode: "repairReason",
          langCode: this.getLanguageDefine("repairReasonMeaning"),
          fieldType: "SELECT",
          displayField: "repairReasonMeaning",
          lovCode: this.getLovCode("异常原因"),
          options: {
            multiple: false,
            valueField: "repairReasonMeaning",
            inputChange: this.changeFieldCallBack,
            lineNum: lineNum,
            callback: function ([ item ]) {
              this.inputChange(item, this.valueField, this.lineNum);
            },
          },

        },
        {
          fieldName: "附件",
          fieldCode: "detailAttachmentUuid",
          fieldType: "UPLOAD",
          render: (val) => {
            return (
              <SrmUpload
                color="blue"
                attachmentUuid={val}
                canUpload={![ "One" ].includes(this.type)}
                canDelete={![ "One" ].includes(this.type)}
                showIcon={false}
                descTitle={this.$T("hipspfm.common.button.uploadAttachment").$D("上传附件")} />
            );
          }
        },
        {
          fieldName: "上传附件",
          fieldCode: "attachmentUuid",
          render: (val) => {
            return (
              <SrmUpload
                color="blue"
                attachmentUuid={val}
                canUpload={![ "One" ].includes(this.type)}
                canDelete={![ "One" ].includes(this.type)}
                showIcon={false}
                descTitle={this.$T("hipspfm.common.button.uploadAttachment").$D("上传附件")} />
            );
          }
        },
        {
          fieldName: "备注1",
          fieldCode: "detailComments",
          langCode: this.getLanguageDefine("detailCommentsMeaning"),
          fieldType: "SELECT",
          displayField: "detailCommentsMeaning",
          lovCode: this.getLovCode("备注"),
          options: {
            multiple: false,
            valueField: "detailCommentsMeaning",
            inputChange: this.changeFieldCallBack,
            lineNum: lineNum,
            callback: function ([ item ]) {
              this.inputChange(item, this.valueField, this.lineNum);
            },
          },

        },
        // 行信息
        {
          fieldName: "lineNum",
          langCode: "行号",
          fieldType: "EMPTY",
          render: (val, record) => {
            return (
              <div class="first-item"
                onClick={() => {
                  this.openDetailPop("line", record);
                }}>
                <span class="block" />
                <span class="text">{lineNum + 1}</span>
              </div>
            );
          }
        },
        {
          fieldName: "itemName",
          fieldCode: "itemName",
          langCode: this.getLanguageDefine("itemName"),
          fieldType: "EMPTY",
          render: (val, record) => {
            return (
              <div class="first-item"
                onClick={() => {
                  this.openDetailPop("line", record);
                }}>
                <span class="block" />
                <span class="text">{`${val}(${record["itemCode"] ? record["itemCode"] : ""})`}</span>
              </div>
            );
          }
        },
        {
          fieldName: "库存组织",
          fieldCode: "organizationId",
          langCode: this.getLanguageDefine("organizationName"),
          fieldType: "LOV",
          displayField: "organizationName",
          lovCode: this.getLovCode("库存组织"),
          options: {
            multiple: false,
            queryField: "organizationName", // 查询
            displayField: "organizationName", // 主键
            subDisplayField: "organizationCode",
            valueField: "organizationId",
            inputChange: this.changeFieldCallBack,
            lineNum: lineNum,
            callback: function ([ item ]) {
              this.inputChange(item, this.valueField, this.lineNum);
            },
          },

          required: true,
        },
        {
          fieldName: "物料编码",
          fieldCode: "itemId",
          langCode: this.getLanguageDefine("itemCode"),
          fieldType: "LOV",
          displayField: "itemCode",
          lovCode: this.getLovCode("物料编码"),
          options: {
            multiple: false,
            queryField: "itemCode", // 查询
            displayField: "itemCode", // 主键
            subDisplayField: "itemName",
            valueField: "itemId",
            inputChange: this.changeFieldCallBack,
            lineNum: lineNum,
            callback: function ([ item ]) {
              this.inputChange(item, this.valueField, this.lineNum);
            },
          },

        },
        {
          fieldName: "物料名称",
          fieldCode: "itemName",
          langCode: this.getLanguageDefine("itemName"),
          fieldType: "INPUT",

          required: true,
        },
        {
          fieldName: "物料分类",
          fieldCode: "categoryId",
          langCode: this.getLanguageDefine("categoryName"),
          fieldType: "LOV",
          displayField: "categoryName",
          lovCode: this.getLovCode("物料分类"),
          options: {
            multiple: false,
            queryField: "categoryName", // 查询
            displayField: "categoryName", // 主键
            subDisplayField: "categoryCode",
            valueField: "categoryId",
            inputChange: this.changeFieldCallBack,
            lineNum: lineNum,
            callback: function ([ item ]) {
              this.inputChange(item, this.valueField, this.lineNum);
            },
          },

          required: true,
        },
        {
          fieldName: "单位",
          fieldCode: "uomId",
          langCode: this.getLanguageDefine("uomName"),
          fieldType: "LOV",
          displayField: "uomName",
          lovCode: this.getLovCode("单位"),
          options: {
            multiple: false,
            queryField: "uomName", // 查询
            displayField: "uomName", // 主键
            subDisplayField: "uomCode",
            valueField: "uomId",
            inputChange: this.changeFieldCallBack,
            lineNum: lineNum,
            callback: function ([ item ]) {
              this.inputChange(item, this.valueField, this.lineNum);
            },
          },

          required: true,
        },
        {
          fieldName: "数量2",
          fieldCode: "quantity",
          langCode: this.getLanguageDefine("quantity"),
          fieldType: "INPUT_NUMBER",
          required: true,
        },
        {
          fieldName: "需求日期",
          fieldCode: "needByDate",
          langCode: this.getLanguageDefine("needByDate"),
          fieldType: "DATE",
          required: true,
          render: (val)=>{
            return (
              <span>{dateFormat(val)}</span>
            );
          }
        },
        {
          fieldName: "税率",
          fieldCode: "taxRate",
          langCode: this.getLanguageDefine("taxRate"),
          fieldType: "INPUT",
          // fieldType: "LOV",
          // displayField: "taxRate",
          // lovCode: this.getLovCode("税率"),
          // options: {
          //   multiple: false,
          //   queryField: "taxRate", // 查询
          //   displayField: "taxRate", // 主键
          //   subDisplayField: "description",
          //   valueField: "taxId",
          //   inputChange: this.changeFieldCallBack,
          //   lineNum: lineNum,
          //   callback: function([ item ]) {
          //     this.inputChange(item, this.valueField, this.lineNum);
          //   },
          // },
        },
        {
          fieldName: "币种",
          fieldCode: "currencyId",
          langCode: this.getLanguageDefine("currencyName"),
          fieldType: "LOV",
          displayField: "currencyName",
          lovCode: this.getLovCode("币种"),
          options: {
            multiple: false,
            queryField: "currencyName", // 查询
            displayField: "currencyName", // 主键
            subDisplayField: "currencyCode",
            valueField: "currencyId",
            inputChange: this.changeFieldCallBack,
            lineNum: lineNum,
            callback: function ([ item ]) {
              this.inputChange(item, this.valueField, this.lineNum);
            },
          },
        },
        {
          fieldName: "预估价格（含税）",
          fieldCode: "taxIncludedPrice",
          langCode: this.getLanguageDefine("taxIncludedPrice"),
          fieldType: "INPUT_NUMBER",
        },
        {
          fieldName: "备注2",
          fieldCode: "lineComments",
          langCode: this.getLanguageDefine("lineComments"),
          fieldType: "TEXT_AREA",

        },
        {
          fieldName: "storeNum",
          fieldCode: "storeNum",
          langCode: this.getLanguageDefine("storeNum"),
          fieldType: "EMPTY",
          render: (val, record) => {
            return (
              <div class="first-item"
                onClick={() => {
                  this.openDetailPop("line", record);
                }}>
                <span class="block" />
                <span class="text">{`${val}`}</span>
              </div>
            );
          }
        },
        {
          fieldName: "店铺编码",
          fieldCode: "storeNum",
          fieldType: "TEXT",
          langCode: this.getLanguageDefine("storeNum"),
        },
        {
          fieldName: "商场名称",
          fieldCode: "shopName",
          fieldType: "INPUT",
          langCode: this.getLanguageDefine("shopName"),

          required: true,
        },
        {
          fieldName: "商场地址",
          fieldCode: "shopAddress",
          fieldType: "INPUT",
          langCode: this.getLanguageDefine("shopAddress"),
          required: true,
        },
        {
          fieldName: "销售联系人",
          fieldCode: "contact",
          fieldType: "INPUT",
          langCode: this.getLanguageDefine("saleContact"),
          required: true,
        },
        {
          fieldName: "销售联系方式",
          fieldCode: "phone",
          fieldType: "INPUT_NUMBER",
          langCode: this.getLanguageDefine("salePhone"),
          required: true,
        },
        {
          fieldName: "销售联系人行",
          fieldCode: "saleContact",
          fieldType: "INPUT",
          langCode: this.getLanguageDefine("saleContact"),
          required: true,
        },
        {
          fieldName: "销售联系方式行",
          fieldCode: "salePhone",
          fieldType: "INPUT_NUMBER",
          langCode: this.getLanguageDefine("salePhone"),
          required: true,
        },
        {
          fieldName: "提货地址",
          fieldCode: "pickUpAddress",
          fieldType: "TEXT",
          langCode: this.getLanguageDefine("pickUpAddress"),
        },
        {
          fieldName: "柜台制作供应商",
          fieldCode: "madeSupplierCompanyName",
          fieldType: "TEXT",
          langCode: this.getLanguageDefine("madeSupplierCompanyName"),
        },
        {
          fieldName: "提货地址省份",
          fieldCode: "pickUpProvince",
          fieldType: "TEXT",
          langCode: this.getLanguageDefine("pickUpProvince"),
        },
        {
          fieldName: "提货地址城市",
          fieldCode: "pickUpCity",
          fieldType: "TEXT",
          langCode: this.getLanguageDefine("pickUpCity"),
        },
        {
          fieldName: "送达地址",
          fieldCode: "pickToAddress",
          fieldType: "TEXT",
          langCode: this.getLanguageDefine("pickToAddress"),
        },
        {
          fieldName: "送达地址省份",
          fieldCode: "pickToProvince",
          fieldType: "TEXT",
          langCode: this.getLanguageDefine("pickToProvince"),
        },
        {
          fieldName: "送达地址城市",
          fieldCode: "pickToCity",
          fieldType: "TEXT",
          langCode: this.getLanguageDefine("pickToCity"),
        },
        {
          fieldName: "预计进场时间",
          fieldCode: "pickToDate",
          fieldType: "TEXT",
          langCode: this.getLanguageDefine("pickToDate"),
        },
        {
          fieldName: "预计提货时间",
          fieldCode: "pickUpDate",
          fieldType: "TEXT",
          langCode: this.getLanguageDefine("pickUpDate"),
        },
        {
          fieldName: "联系人",
          fieldCode: "contact",
          fieldType: "INPUT",
          langCode: this.getLanguageDefine("contact"),
          required: true,
        },
        {
          fieldName: "联系方式",
          fieldCode: "phone",
          fieldType: "INPUT_NUMBER",
          langCode: this.getLanguageDefine("phone"),
          required: true,
        },
        {
          fieldName: "物料运输类型",
          fieldCode: "logisticsTypeMeaning",
          fieldType: "TEXT",
          langCode: this.getLanguageDefine("logisticsTypeMeaning"),
        },
        {
          fieldName: "车型/零担车型",
          fieldCode: "logisticsCarTypeMeaning",
          fieldType: "TEXT",
          langCode: this.getLanguageDefine("logisticsCarTypeMeaning"),
        },
        {
          fieldName: "车位（米/立方数）",
          fieldCode: "parkingCubic",
          fieldType: "TEXT",
          langCode: this.getLanguageDefine("parkingCubic"),
        },
        {
          fieldName: "总立方数",
          fieldCode: "totalCubic",
          fieldType: "TEXT",
          langCode: this.getLanguageDefine("totalCubic"),
        },
        {
          fieldName: "上海周边提货/送货（数量）",
          fieldCode: "shRangePickUpQuantity",
          fieldType: "TEXT",
          langCode: this.getLanguageDefine("shRangePickUpQuantity"),
        },
        {
          fieldName: "外埠提货/送货（数量）",
          fieldCode: "wbRangePickUpQuantity",
          fieldType: "TEXT",
          langCode: this.getLanguageDefine("wbRangePickUpQuantity"),
        },
        {
          fieldName: "市内短驳（车型）",
          fieldCode: "cityCarTypeMeaning",
          fieldType: "TEXT",
          langCode: this.getLanguageDefine("cityCarTypeMeaning"),
        },
        {
          fieldName: "市内短驳（数量）",
          fieldCode: "cityQuantity",
          fieldType: "TEXT",
          langCode: this.getLanguageDefine("cityQuantity"),
        },
        {
          fieldName: "押车（车型）",
          fieldCode: "truckCarTypeMeaning",
          fieldType: "TEXT",
          langCode: this.getLanguageDefine("truckCarTypeMeaning"),
        },
        {
          fieldName: "押车（数量）",
          fieldCode: "truckQuantity",
          fieldType: "TEXT",
          langCode: this.getLanguageDefine("truckQuantity"),
        },
        {
          fieldName: "旧柜报废（车型）",
          fieldCode: "defectCarTypeMeaning",
          fieldType: "TEXT",
          langCode: this.getLanguageDefine("defectCarTypeMeaning"),
        },
        {
          fieldName: "旧柜报废（数量）",
          fieldCode: "defectQuantity",
          fieldType: "TEXT",
          langCode: this.getLanguageDefine("defectQuantity"),
        },
        {
          fieldName: "仓储（车型）",
          fieldCode: "warehouseCarTypeMeaning",
          fieldType: "TEXT",
          langCode: this.getLanguageDefine("warehouseCarTypeMeaning"),
        },
        {
          fieldName: "仓储（数量）",
          fieldCode: "warehouseQuantity",
          fieldType: "TEXT",
          langCode: this.getLanguageDefine("warehouseQuantity"),
        },
        {
          fieldName: "放空费（车型）",
          fieldCode: "emptyCarTypeMeaning",
          fieldType: "TEXT",
          langCode: this.getLanguageDefine("emptyCarTypeMeaning"),
        },
        {
          fieldName: "放空费（数量）",
          fieldCode: "emptyQuantity",
          fieldType: "TEXT",
          langCode: this.getLanguageDefine("emptyQuantity"),
        },
        {
          fieldName: "包装箱市内来回运输（数量）",
          fieldCode: "pickingQuantity",
          fieldType: "TEXT",
          langCode: this.getLanguageDefine("pickingQuantity"),
        },
        {
          fieldName: "多地点提货/送货（数量）",
          fieldCode: "deliverQuantity",
          fieldType: "TEXT",
          langCode: this.getLanguageDefine("deliverQuantity"),
        },
        {
          fieldName: "申请交货日期",
          fieldCode: "reqDeliverDate",
          fieldType: "TEXT",
          langCode: this.getLanguageDefine("reqDeliverDate"),
        },
        {
          fieldName: "确认交货日期",
          fieldCode: "confirmDeliverDate",
          fieldType: "TEXT",
          langCode: this.getLanguageDefine("confirmDeliverDate"),
        },
        {
          fieldName: "收货联系",
          fieldCode: "receiveContact",
          fieldType: "TEXT",
          langCode: this.getLanguageDefine("receiveContact"),
        },
        {
          fieldName: "收货地址",
          fieldCode: "receiveAddress",
          fieldType: "TEXT",
          langCode: this.getLanguageDefine("receiveAddress"),
        },
        {
          fieldName: "成本中心",
          fieldCode: "costCenter",
          fieldType: "TEXT",
          langCode: this.getLanguageDefine("costCenter"),
        },
        {
          fieldName: "内部订单号",
          fieldCode: "innerOrderNum",
          fieldType: "TEXT",
          langCode: this.getLanguageDefine("innerOrderNum"),
        },
        {
          fieldName: "查看详情",
          fieldType: "EMPTY",
          render: () => {
            return (
              <SrmFlex direction="row" align="center" justify="center" >
                <span class="lookSomePop"
                  onClick={() => {
                    this.openDetailPop("header", this.headInfo);
                  }}>
                  {this.getLanguageDefine("查看详情")}
                </span>
              </SrmFlex>
            );
          }
        }
      ];
      return columnList.find((v) => v.fieldName === name);
    }
  },
  // 获取字段配置
  computed: {
    // 头
    getHeadColumns() {
      return (lineNum = -1) => {
        let columns = [];
        // 流程表单：One只读
        let nameList = [ "liaisonNum", "标题", "需求类型", "申请人", "申请日期", "申请部门", "创建人", "创建时间", "业务实体", "采购组织", "采购员", "查看详情" ];
        // 流程表单：Two编辑头
        if ([ "Two" ].includes(this.type)) {
          if ([ "30" ].includes(this.liaisonType)) {
            nameList = [ "liaisonNum", "标题", "需求类型", "申请人", "申请日期", "申请部门", "创建人", "创建时间", "业务实体", "采购组织", "采购员",
              "商签时间", "固定资产编号", "查看详情" ];
          }
        }
        // 流程表单：Four可编辑（专柜、撤柜、定制柜）
        if ([ "Four" ].includes(this.type)) {
          if ([ "10" ].includes(this.liaisonType)) {
            nameList = [ "标题", "公司", "品牌", "供应商", "进柜/交货时间", "柜台编码", "柜台/道具版本", "商场名称", "商场地址", "联系人", "联系方式", "制作供应商",
              "要求完成日期", "异常处理方式", "区域执行主管", "维修明细表", "备注说明", "柜台验收单", "查看详情" ];
          }
          if ([ "20" ].includes(this.liaisonType)) {
            nameList = [ "标题", "公司", "品牌", "供应商", "相关流程链接", "业务类型", "柜台编码", "柜台/道具版本", "大区", "地区", "城市", "商场名称", "商场地址",
              "销售联系人", "销售联系方式", "撤柜/移柜时间", "费用归属部门", "执行部门", "地区执行费用", "商场图片/平面图纸", "柜台信息备注", "区域执行主管", "实际完成时间",
              "上传附件", "查看详情" ];
          }
          if ([ "30" ].includes(this.liaisonType)) {
            nameList = [ "标题", "公司", "品牌", "供应商", "相关流程链接", "区域执行主管", "业务类型", "柜台编码", "柜台/道具版本", "费用归属部门", "柜型", "柜地面积/延米",
              "备注说明", "上传附件", "商场名称", "商场地址", "销售联系人", "销售联系方式", "预计进柜时间", "是否测量", "商签时间", "验收单", "最终版图纸", "商场图片/平面图纸",
              "实际交货时间", "是否计入固定资产", "固定资产编号", "查看详情" ];
          }
        }
        if ([ "Five" ].includes(this.type)) {
          if ([ "10", "20", "30" ].includes(this.liaisonType)) {
            nameList = [ "liaisonNum", "标题", "需求类型", "申请人", "申请日期", "申请部门", "创建人", "创建时间", "业务实体", "采购组织", "采购员", "供应商", "审批意见",
              "查看详情" ];
            if ([ "30" ].includes(this.liaisonType)) {
              nameList = [ "liaisonNum", "标题", "需求类型", "申请人", "申请日期", "申请部门", "创建人", "创建时间", "业务实体", "采购组织", "采购员", "供应商", "审批意见",
                "是否测量", "是否计入固定资产", "查看详情" ];
            }
          }
        }
        columns = nameList.map((res) => {
          return this.getFieldInfo(res, lineNum);
        });
        if ([ "One", "Three" ].includes(this.type)) {
          columns = columns.reduce((init, res) => {
            res["disabled"] = true;
            init.push(res);
            return init;
          }, []);
        }
        // 流程表单：Two编辑头 （定制柜：商签时间、固定资产编号可编辑）
        if ([ "Two" ].includes(this.type)) {
          columns = columns.reduce((init, res) => {
            if (![ "商签时间", "固定资产编号" ].includes(res["fieldName"])) {
              res["disabled"] = true;
            }
            init.push(res);
            return init;
          }, []);
        }
        // 流程表单：Five编辑部分（供应商、审批意见可编辑, 定制柜：是否测量、是否计入固定资产）
        if ([ "Five" ].includes(this.type)) {
          columns = columns.reduce((init, res) => {
            if (![ "供应商", "审批意见", "是否测量", "是否计入固定资产" ].includes(res["fieldName"])) {
              res["disabled"] = true;
            }
            init.push(res);
            return init;
          }, []);
        }
        return columns;
      };
    },
    // 头 - 行
    getHeadLineColumns() {
      return (lineNum = -1) => {
        let columns = [];
        let nameList = [ "维修品类", "维修项目", "维修内容", "数量1", "事件描述", "异常原因", "附件", "备注1" ];
        columns = nameList.map((res) => {
          return this.getFieldInfo(res, lineNum);
        });
        // 流程表单：One只读
        if ([ "One" ].includes(this.type)) {
          columns = columns.reduce((init, res) => {
            res["disabled"] = true;
            init.push(res);
            return init;
          }, []);
        }
        return columns;
      };
    },
    // 行
    getLineColumns() {
      return (lineNum = -1) => {
        let columns = [];
        let nameList = [];
        if ([ "10", "20", "30", "40" ].includes(this.liaisonType)) {
          nameList = [ "itemName", "库存组织", "物料分类", "单位", "数量2", "需求日期", "税率", "币种", "预估价格（含税）" ];
        } else {
          nameList = [ "storeNum", "商场名称", "销售联系人行", "销售联系方式行", "提货地址", "柜台制作供应商", "提货地址省份" ];
        }
        // 流程表单：Four可编辑（专柜、撤柜、定制柜）
        if ([ "Four" ].includes(this.type)) {
          if ([ "10", "20", "30" ].includes(this.liaisonType)) {
            nameList = [ "lineNum", "库存组织", "物料编码", "物料名称", "物料分类", "单位", "数量2", "需求日期", "税率", "币种", "预估价格（含税）", "备注2" ];
          }
        }
        columns = nameList.map((res) => {
          return this.getFieldInfo(res, lineNum);
        });
        // 流程表单：行只读
        if ([ "One", "Two", "Five" ].includes(this.type)) {
          columns = columns.reduce((init, res) => {
            res["disabled"] = true;
            init.push(res);
            return init;
          }, []);
        }
        // 流程表单：Three 编辑行 （定制柜：数量可编辑）
        if ([ "Three" ].includes(this.type)) {
          columns = columns.reduce((init, res) => {
            if (res["fieldName"] !== "数量2") {
              res["disabled"] = true;
            }
            init.push(res);
            return init;
          }, []);
        }
        return columns;
      };
    },
    // 详情
    getDetailColumns() {
      return (name = "") => {
        let columns = [];
        let nameList = [];
        if (name === "header") {
          if (this.liaisonType === "10") {
            nameList = [ "标题", "需求类型", "需求联络单号", "申请人", "申请日期", "申请部门", "创建人", "创建时间", "公司",
              "业务实体", "采购组织", "品牌", "供应商", "采购员", "进柜/交货时间", "柜台编码", "柜台/道具版本", "商场名称",
              "商场地址", "联系人", "联系方式", "制作供应商", "要求完成日期", "异常处理方式", "区域执行主管", "维修明细表",
              "备注说明", "审批意见", "柜台验收单" ];
          }
          if (this.liaisonType === "20") {
            nameList = [ "标题", "需求类型", "需求联络单号", "申请人", "申请日期", "申请部门", "创建人", "创建时间", "公司",
              "业务实体", "采购组织", "品牌", "供应商", "采购员", "相关流程链接", "业务类型", "柜台编码", "柜台/道具版本", "大区",
              "地区", "城市", "商场名称", "商场地址", "销售联系人", "销售联系方式", "撤柜/移柜时间", "费用归属部门", "执行部门",
              "地区执行费用", "商场图片/平面图纸", "柜台信息备注", "区域执行主管", "实际完成时间", "上传附件", "审批意见" ];
          }
          if (this.liaisonType === "30") {
            nameList = [ "标题", "需求类型", "需求联络单号", "申请人", "申请日期", "申请部门", "创建人", "创建时间", "公司",
              "业务实体", "采购组织", "品牌", "供应商", "采购员", "相关流程链接", "区域执行主管", "业务类型", "柜台编码", "柜台/道具版本",
              "费用归属部门", "柜型", "柜地面积/延米", "备注说明", "审批意见", "上传附件", "商场名称", "商场地址", "销售联系人", "销售联系方式",
              "预计进柜时间", "是否测量", "商签时间", "验收单", "最终版图纸", "商场图片/平面图纸", "实际交货时间", "是否计入固定资产", "固定资产编号" ];
          }
          if (this.liaisonType === "40") {
            nameList = [ "标题", "需求类型", "需求联络单号", "申请人", "申请日期", "申请部门", "创建人", "创建时间", "公司",
              "业务实体", "采购组织", "品牌", "供应商", "采购员", "是否入库", "备注说明", "上传附件" ];
          }
          if (this.liaisonType === "50") {
            nameList = [ "标题", "需求类型", "需求联络单号", "申请人", "申请日期", "申请部门", "创建人", "创建时间", "公司",
              "业务实体", "采购组织", "品牌", "供应商", "采购员", "成本中心编码", "成本中心名称", "运输需求类别", "备注说明", "上传附件" ];
          }
        }
        if (name === "headerLine") {
          if (this.liaisonType === "10") {
            nameList = [ "维修品类", "维修项目", "维修内容", "数量1", "事件描述", "异常原因", "上传附件", "备注1" ];
          }
        }
        if (name === "line") {
          if ([ "10", "20", "30" ].includes(this.liaisonType)) {
            nameList = [ "库存组织", "物料编码", "物料名称", "物料分类", "单位", "数量2", "需求日期", "税率", "币种", "预估价格（含税）", "备注2" ];
          }
          if (this.liaisonType === "40") {
            nameList = [ "库存组织", "物料编码", "物料名称", "物料分类", "单位", "数量2", "需求日期", "税率", "币种", "预估价格（含税）", "备注2", "申请交货日期", "确认交货日期", "收货联系", "收货地址", "成本中心", "内部订单号" ];
          }
          if (this.liaisonType === "50") {
            nameList = [ "店铺编码", "商场名称", "销售联系人行", "销售联系方式行", "提货地址", "柜台制作供应商", "提货地址省份",
              "提货地址城市", "送达地址", "送达地址省份", "送达地址城市", "预计进场时间", "预计提货时间", "联系人", "联系方式",
              "物料运输类型", "车型/零担车型", "车位（米/立方数）", "总立方数", "上海周边提货/送货（数量）", "外埠提货/送货（数量）",
              "市内短驳（车型）", "市内短驳（数量）", "押车（车型）", "押车（数量）", "旧柜报废（车型）", "旧柜报废（数量）",
              "仓储（车型）", "仓储（数量）", "放空费（车型）", "放空费（数量）", "包装箱市内来回运输（数量）", "多地点提货/送货（数量）",
              "备注2" ];
          }
        }
        columns = nameList.map((res) => {
          return { ...this.getFieldInfo(res, -1), disabled: true };
        });
        columns = columns.reduce((init, res) => {
          if ([ "DATE", "INPUT", "INPUT_NUMBER" ].includes(res.fieldType)) {
            res["fieldType"] = "TEXT";
          }
          init.push(res);
          return init;
        }, []);
        return columns;
      };
    }
  }
};