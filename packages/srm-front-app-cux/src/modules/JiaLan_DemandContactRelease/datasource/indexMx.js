import { closeWebView } from "srm-mobile-ui/src/utils/jsBridge";
import { dateFormat } from "@/utils/index";
import { getHeaderApi,getLineApi,getHeaderLineApi,getLovApi } from "../api";

export default {
  data() {
    return {
      changeReqId: "",
      headInfo: {},
      headFields: [],
      headLineFields: [],
      lineFields: [],
      loading: false,
      visible: false,
      detailInfo: {},
      customizeInfo: {},
      lovObj: {},
    };
  },
  computed: {
    getHeaderColumns() {
      let columns = [];
      this.headFields.map((res)=>{
        let item = {
          fieldType: res.length > 0 && res[0] === "EMPTY" ? "EMPTY" : "TEXT",
          fieldName: res.length > 0 ? res[0] : "",
          fieldCode: res.length > 1 ? res[1] : "",
          langCode: res.length > 2 ? res[2] : "",
          ...this.renderByField(res[1], res[0]),
          ...this.getEditField(res[0], res[1]),
        };
        if (res.length > 3 && res[3]) {
          item["formRow"] = res[3];
        }
        columns.push(item);
      });
      return columns;
    },
    getHeaderDetailColumn() {
      let columns = [];
      this.headFieldsDetail.map((res)=>{
        let item = {
          fieldType: "TEXT",
          fieldName: res.length > 0 ? res[0] : "",
          fieldCode: res.length > 1 ? res[1] : "",
          langCode: res.length > 2 ? res[2] : "",
          ...this.renderByField(res[1], res[0]),
        };
        if (res.length > 3 && res[3]) {
          item["formRow"] = res[3];
        }
        columns.push(item);
      });
      return columns;
    },
    getHeaderLineColumns() {
      let columns = [];
      this.headLineFields.map((res)=>{
        let item = {
          fieldType: res.length > 0 && res[0] === "EMPTY" ? "EMPTY" : "TEXT",
          fieldName: res.length > 0 ? res[0] : "",
          fieldCode: res.length > 1 ? res[1] : "",
          langCode: res.length > 2 ? res[2] : "",
          ...this.renderByField(res[1], res[0]),
          ...this.getEditField(res[0], res[1]),
        };
        if (res.length > 3 && res[3]) {
          item["formRow"] = res[3];
        }
        columns.push(item);
      });
      return columns;
    },
    getLineColumns() {
      return (lineNum) =>{
        let columns = [];
        this.lineFields.map((res)=>{
          let item = {
            fieldType: res.length > 0 && res[0] === "EMPTY" ? "EMPTY" : "TEXT",
            fieldName: res.length > 0 ? res[0] : "",
            fieldCode: res.length > 1 ? res[1] : "",
            langCode: res.length > 2 ? res[2] : "",
            ...this.renderByField(res[1], res[0]),
            ...this.getEditField(res[0], res[1], "line", lineNum),
          };
          if (res.length > 3 && res[3]) {
            item["formRow"] = res[3];
          }
          columns.push(item);
        });
        return columns;
      };
    },
  },
  async mounted() {
    this.changeReqId = this.$route.query.id;
    await this.fetchData();
    await this.ferchHeadLine();
    await this.fatchLine();
    this.getLovInterface(); // await
    this.loading = true;
  },
  methods: {
    // 返回
    goBack() {
      try {
        closeWebView();
      } catch (err) {
        this.$router.back();
      }
    },
    // 退出子应用
    goClose() {
      try {
        closeWebView();
      } catch (err) {
        this.$router.back();
      }
    },
    // 获取自定义语言
    getLanguageDefine(key) {
      const languageList = {
      };

      return languageList[key] || key;
    },
    // 获取字段
    getField(liaisonType) {
      let basicHeadFieldsDetail = [
        [ "标题", "title", "", 10, ],
        [ "需求类型", "liaisonTypeMeaning", "", 20, ],
        [ "申请部门", "unitName", "", 30, ],
        [ "申请人", "reqByName", "", 40, ],
        [ "申请日期", "applicationTime", "", 40, ],
        [ "创建人", "realName", "", 50, ],
        [ "创建时间", "creationDate", "", 50, ],
        [ "品牌", "brandMeaning", "", 60, ],
        [ "公司", "companyName", "", 70, ],
        [ "业务实体", "ouName", "", 80, ],
        [ "供应商", "supplierCompanyName", "", 90, ],
        [ "采购员", "purchaseAgentName", "", 100, ],
        [ "采购组织", "purOrganizationName", "", 100, ],
      ];
      let basicLineFields = [
        [ "库存组织", "organizationName", "", 10, ],
        [ "物料名称", "itemName", "", 20, ],
        [ "物料分类", "categoryName", "", 20, ],
        [ "单位", "uomName", "", 30, ],
        [ "数量", "quantity", "", 30, ],
        [ "税率", "taxRate", "", 40, ],
        [ "币种", "currencyName", "", 40, ],
        [ "预估价格（含税）", "taxIncludedPrice", "", 50, ],
        [ "需求日期", "needByDate", "", 50, ],
        [ "备注", "lineComments", "", 60, ],
      ];

      if (liaisonType === "10") {
        // 专柜
        this.headFields = [
          [ "EMPTY", "liaisonNum", "", 1 ],
          ...basicHeadFieldsDetail,
          [ "进柜/交货时间", "deliverDate", "", 150, ],
          [ "柜台编码", "deliverNum", "", 160, ],
          [ "柜台/道具版本", "deliverVersion", "", 160, ],
          [ "商场名称", "shopName", "", 180, ],
          [ "商场地址", "shopAddress", "", 190, ],
          [ "联系人", "contact", "", 200, ],
          [ "联系方式", "phone", "", 200, ],
          [ "区域执行主管", "employeeName", "", 250, ],
          [ "维修明细表", "serviceAttachmentUuid", "", 260, ],
          [ "柜台验收单", "attachmentUuid", "", 260, ],
          [ "EMPTY", "查看详情", "", ],
        ];
        this.headLineFields = [
          [ "维修品类", "repairCategoryMeaning", "", 1 ],
          [ "维修项目", "repairItemMeaning", "", 20, ],
          [ "维修内容", "repairContent", "", 30, ],
          [ "数量", "repairQuantity", "", 40, ],
          [ "事件描述", "repairDesc", "", 50, ],
          [ "异常原因", "repairReasonMeaning", "", 60, ],
          [ "附件", "detailAttachmentUuid", "", 70, ],
          [ "备注", "detailCommentsMeaning", "", 80, ],
        ];
        this.headFieldsDetail = [
          ...basicHeadFieldsDetail,
          [ "需求联络单号", "liaisonNum", "", 30, ],
          [ "进柜/交货时间", "deliverDate", "", 150, ],
          [ "柜台编码", "deliverNum", "", 160, ],
          [ "柜台/道具版本", "deliverVersion", "", 160, ],
          [ "商场名称", "shopName", "", 180, ],
          [ "商场地址", "shopAddress", "", 190, ],
          [ "联系人", "contact", "", 200, ],
          [ "联系方式", "phone", "", 210, ],
          [ "制作供应商", "madeSupplierCompanyName", "", 220, ],
          [ "要求完成日期", "finishDate", "", 230, ],
          [ "异常处理方式", "exceptionProcess", "", 240, ],
          [ "区域执行主管", "employeeName", "", 250, ],
          [ "维修明细表", "serviceAttachmentUuid", "", 260, ],
          [ "备注说明", "comments", "", 270, ],
          [ "审批意见", "approveRemark", "", 280, ],
          [ "柜台验收单", "attachmentUuid", "", 290, ],
        ];
        this.lineFields = [
          [ "EMPTY", "itemCode", "", 1 ],
          ...basicLineFields,
        ];
      }
      if (liaisonType === "20") {
        // 撤柜/移柜/推广活动
        this.headFields = [
          [ "EMPTY", "liaisonNum", "", 1 ],
          ...basicHeadFieldsDetail,
          [ "柜台编码", "deliverNum", "", 180, ],
          [ "柜台/道具版本", "deliverVersion", "", 180, ],
          [ "商场名称", "shopName", "", 230, ],
          [ "商场地址", "shopAddress", "", 240, ],
          [ "销售联系人", "contact", "", 250, ],
          [ "销售联系方式", "phone", "", 250, ],
          [ "区域执行主管", "employeeName", "", 260, ],
          [ "实际完成时间", "finishDate", "", 260, ],
          [ "商场图片/平面图纸", "serviceAttachmentUuid", "", 310, ],
          [ "附件", "attachmentUuid", "", 320, ],
          [ "EMPTY", "查看详情", "", ],
        ];
        this.headFieldsDetail = [
          ...basicHeadFieldsDetail,
          [ "相关流程链接", "processUrl", "", 150, ],
          [ "业务类型", "businessTypeMeaning", "", 170, ],
          [ "柜台编码", "deliverNum", "", 180, ],
          [ "柜台/道具版本", "deliverVersion", "", 180, ],
          [ "大区", "regionMeaning", "", 200, ],
          [ "地区", "area", "", 210, ],
          [ "城市", "city", "", 210, ],
          [ "商场名称", "shopName", "", 230, ],
          [ "商场地址", "shopAddress", "", 240, ],
          [ "销售联系人", "contact", "", 250, ],
          [ "销售联系方式", "phone", "", 260, ],
          [ "撤柜/移柜时间", "deliverDate", "", 270, ],
          [ "费用归属部分", "costUnitName", "", 280, ],
          [ "执行部门", "liaisonUnitMeaning", "", 290, ],
          [ "地区执行费用", "areaCost", "", 290, ],
          [ "商场图片/平面图纸", "serviceAttachmentUuid", "", 310, ],
          [ "柜台信息备注", "comments", "", 320, ],
          [ "区域执行主管", "employeeName", "", 330, ],
          [ "实际完成时间", "finishDate", "", 330, ],
          [ "附件", "attachmentUuid", "", 350, ],
          [ "审批意见", "approveRemark", "", 360, ],
        ];
        this.lineFields = [
          [ "EMPTY", "itemCode", "", 1 ],
          ...basicLineFields,
        ];
      }
      if (liaisonType === "30") {
        // 定制柜
        this.headFields = [
          [ "EMPTY", "liaisonNum", "", 1 ],
          ...basicHeadFieldsDetail,
          [ "区域执行主管", "employeeName", "", 160, ],
          [ "柜台编码", "deliverNum", "", 180, ],
          [ "柜台/道具版本", "deliverVersion", "", 180, ],
          [ "柜型", "deliverRange", "", 210, ],
          [ "柜地面积/延米", "deliverSpec", "", 210, ],
          [ "附件", "attachmentUuid", "", 250, ],
          [ "是否测量", "measurementFlag", "", 260, ],
          [ "是否计入固定资产", "assetFlag", "", 270, ],
          [ "验收单", "checkAttachmentUuid", "", 330, ],
          [ "最终版图纸", "finalAttachmentUuid", "", 330, ],
          [ "商场照片/平面图纸", "serviceAttachmentUuid", "", 350, ],
          [ "EMPTY", "查看详情", "", ],
        ];
        this.headFieldsDetail = [
          ...basicHeadFieldsDetail,
          [ "相关流程链接", "processUrl", "", 150, ],
          [ "区域执行主管", "employeeName", "", 160, ],
          [ "业务类型", "businessTypeMeaning", "", 170, ],
          [ "柜台编码", "deliverNum", "", 180, ],
          [ "柜台/道具版本", "deliverVersion", "", 180, ],
          [ "费用归属部分", "costUnitName", "", 200, ],
          [ "柜型", "deliverRange", "", 210, ],
          [ "柜地面积/延米", "deliverSpec", "", 220, ],
          [ "备注说明", "comments", "", 230, ],
          [ "审批意见", "approveRemark", "", 240, ],
          [ "附件", "attachmentUuid", "", 250, ],
          [ "商场名称", "shopName", "", 260, ],
          [ "商场地址", "shopAddress", "", 270, ],
          [ "销售联系人", "contact", "", 280, ],
          [ "销售联系方式", "phone", "", 290, ],
          [ "预计进柜时间", "deliverDate", "", 300, ],
          [ "是否测量", "measurementFlag", "", 310, ],
          [ "商签时间", "signDate", "", 320, ],
          [ "验收单", "checkAttachmentUuid", "", 330, ],
          [ "最终版图纸", "finalAttachmentUuid", "", 340, ],
          [ "商场照片/平面图纸", "serviceAttachmentUuid", "", 350, ],
          [ "实际交货时间", "finishDate", "", 360, ],
          [ "是否计入固定资产", "assetFlag", "", 370, ],
          [ "固定资产编号", "assetNum", "", 380, ],
        ];
        this.lineFields = [
          [ "EMPTY", "itemCode", "", 1 ],
          ...basicLineFields,
        ];
      }
      if (liaisonType === "40") {
        // 图文/美妆柜
        this.headFields = [
          [ "EMPTY", "liaisonNum", "", 1 ],
          ...basicHeadFieldsDetail,
          [ "是否入库", "haveStorageMeaning", "", 150 ],
          [ "备注说明", "comments", "", 160, ],
          [ "附件", "attachmentUuid", "", 190, ],
          // ['EMPTY', '查看详情', '', ]
        ];
        this.headFieldsDetail = [
          ...basicHeadFieldsDetail,
          [ "是否入库", "haveStorageMeaning", "", 150 ],
          [ "备注说明", "comments", "", 160, ],
          [ "附件", "attachmentUuid", "", 190, ],
        ];
        this.lineFields = [
          [ "EMPTY", "itemCode", "", 1 ],
          ...basicLineFields,
        ];
        this.lineFieldsDetail = [
          ...basicLineFields,
          [ "申请交货日期", "reqDeliverDate", "", 110 ],
          [ "确认交货日期", "confirmDeliverDate", "", 120 ],
          [ "收货联系", "receiveContact", "", 130 ],
          [ "收货地址", "receiveAddress", "", 140 ],
          [ "成本中心", "costCenter", "", 150 ],
          [ "内部订单号", "innerOrderNum", "", 160 ],
        ];
      }
      if (liaisonType === "50") {
        // 物流运输(柜台)
        this.headFields = [
          [ "EMPTY", "liaisonNum", "", 1 ],
          ...basicHeadFieldsDetail,
          [ "成本中心编码", "costCenterNum", "", 150, ],
          [ "成本中心名称", "costCenterName", "", 160, ],
          [ "运输需求类别", "transportTypeMeaning", "", 170, ],
          [ "备注说明", "comments", "", 180, ],
          [ "附件", "attachmentUuid", "", 190, ],
          // ['EMPTY', '查看详情', '', ],
        ];
        this.headFieldsDetail = [
          ...basicHeadFieldsDetail,
          [ "成本中心编码", "costCenterNum", "", 150, ],
          [ "成本中心名称", "costCenterName", "", 160, ],
          [ "运输需求类别", "transportTypeMeaning", "", 170, ],
          [ "备注说明", "comments", "", 180, ],
          [ "附件", "attachmentUuid", "", 190, ],
        ];
        this.lineFields = [
          [ "店铺编码", "storeNum", "", 10, ],
          [ "商场名称", "shopName", "", 20, ],
          [ "销售联系人", "saleContact", "", 30, ],
          [ "销售联系人方式", "salePhone", "", 40, ],
          [ "提货地址", "pickUpAddress", "", 50, ],
          [ "柜台制作供应商", "madeSupplierCompanyName", "", 60, ],
          [ "提货地址省份", "pickUpProvince", "", 70, ],
          [ "提货地址城市", "pickUpCity", "", 80, ],
          [ "送达地址", "pickToAddress", "", 90, ],
          [ "送达地址省份", "pickToProvince", "", 100, ],
          [ "送达地址城市", "pickToCity", "", 110, ],
          [ "预计进场时间", "pickToDate", "", 120, ],
          [ "预计提货时间", "pickUpDate", "", 130, ],
          [ "联系人", "contact", "", 140, ],
          [ "联系方式", "phone", "", 150, ],
          [ "物料运输类型", "logisticsTypeMeaning", "", 160, ],
          [ "车型/零担车型", "logisticsCarTypeMeaning", "", 170, ],
          [ "车位（米/立方数）", "parkingCubic", "", 180, ],
          [ "总立方数", "totalCubic", "", 190, ],
          [ "上海周边提货/送货（数量）", "shRangePickUpQuantity", "", 200, ],
          [ "外埠提货/送货（数量）", "wbRangePickUpQuantity", "", 210, ],
          [ "市内短驳（车型）", "cityCarTypeMeaning", "", 220, ],
          [ "市内短驳（数量）", "cityQuantity", "", 230, ],
          [ "押车（车型）", "truckCarTypeMeaning", "", 240, ],
          [ "押车（数量）", "truckQuantity", "", 250, ],
          [ "旧柜报废（车型）", "defectCarTypeMeaning", "", 260, ],
          [ "旧柜报废（数量）", "defectQuantity", "", 270, ],
          [ "仓储（车型）", "warehouseCarTypeMeaning", "", 280, ],
          [ "仓储（数量）", "warehouseQuantity", "", 290, ],
          [ "放空费（车型）", "emptyCarTypeMeaning", "", 300, ],
          [ "放空费（数量）", "emptyQuantity", "", 310, ],
          [ "包装箱市内来回运输（数量）", "pickingQuantity", "", 320, ],
          [ "多地点提货/送货（数量）", "deliverQuantity", "", 330, ],
          [ "备注", "lineComments", "", 340, ],
        ];
      }
      if (liaisonType === "60") {
        // 包材类型 没有审批流
      }
    },
    // 根据字段判断输出样式
    renderByField(field) {
      if (!field) {
        return {};
      }
      if (field.indexOf("Date") > -1 || field.indexOf("Time") > -1) {
        return {
          render: (val) => {
            return <span>{dateFormat(val)}</span>;
          }
        };
      }
      if (field.indexOf("Uuid") > -1) {
        return {
          render: (val) => {
            return (
              <SrmUpload
                showIcon={false}
                attachmentUuid={val}
                canUpload={false}
                canDelete={false}
                color="blue"
                descTitle={this.$T("ssrc.inquiryHall.view.message.button.view").$D("查看")}/>
            );
          }
        };
      }
      if (field.indexOf("Rate") > -1) {
        return {
          render: (val) => {
            return <span class="text">{val === 0 ? 0 : val ? `${val}%` : ""}</span>;
          },
        };
      }
      if ([ "liaisonNum","itemCode","storeNum" ].includes(field)) {
        return {
          render: (val, record) => {
            return (
              <div class="first-item">
                <span class="block"/>
                <span class="text">{record[field]}</span>
              </div>
            );
          },
        };
      }
      if (field.indexOf("Flag") > -1) {
        return {
          render: (val)=>{
            return (
              <span class="text">{[ 0,1,"0","1" ].includes(val) ? val ? "是" : "否" : ""}</span>
            );
          }
        };
      }
      if (field === "查看详情") {
        return {
          render: ()=>{
            return (
              <SrmFlex direction="row" align="center" justify="center" >
                <span onClick={()=>{
                  this.lookSomePop("header");
                }}
                class="lookSomePop">
                  {field}
                </span>
              </SrmFlex>
            );
          }
        };
      }
    },
    // 编辑字段返回
    getEditField(label, name, flag = "", lineNum = "") {
      if (name === "supplierCompanyName") {
        return {
          fileName: label,
          fieldType: "LOV",
          displayField: name,
          fieldCode: "supplierCompanyId",
          lovCode: "SPFM.TENANT_SUPPLIER",
          options: {
            multiple: false,
            subDisplayField: "companyNum",
            queryField: "companyName",
            valueField: "supplierCompanyId",
            callback: this.callbackFieldVal,
          },
          required: true,
        };
      }
      if (name === "detailAttachmentUuid") {
        return {
          render: (val) => {
            return <SrmUpload
              color="blue"
              attachmentUuid={val}
              canUpload={true}
              showIcon={false}
              title={"相关附件（限图片格式）"}
              descTitle={this.$T("hipspfm.common.button.uploadAttachment").$D("上传附件")} />;
          }
        };
      }
      if (name === "measurementFlag") {
        return {
          fieldType: "SELECT",
          lovCode: "HPFM.FLAG",
          required: true,
        };
      }
      if (name === "assetFlag") {
        return {
          fieldType: "SELECT",
          lovCode: "HPFM.FLAG",
          required: true,
        };
      }
      if (this.headInfo.liaisonType === "50") {
        if (name === "attachmentUuid") {
          return {
            render: (val) => {
              return <SrmUpload
                color="blue"
                attachmentUuid={val}
                canUpload={true}
                showIcon={false}
                title={"附件"}
                descTitle={this.$T("hipspfm.common.button.uploadAttachment").$D("上传附件")} />;
            }
          };
        }
        if (name === "title") {
          return {
            fieldType: "INPUT",
            required: true,
          };
        }
        if (name === "companyName") {
          return {
            fieldType: "LOV",
            displayField: name,
            fieldCode: "companyId",
            lovCode: "SPFM.USER_AUTH.COMPANY",
            options: {
              multiple: false,
              subDisplayField: "companyNum",
              queryField: "companyName",
              valueField: "companyId",
              callback: this.callbackFieldVal,
            },
            required: true,
          };
        }
        if (name === "brandMeaning") {
          return {
            fieldType: "SELECT",
            fieldCode: "brand",
            lovCode: "SCUX.JALA.LIAISON.BRAND",
            callbackFieldVal: this.callbackFieldVal,
            options: {
              callback: (item)=>{
                this.callbackFieldVal(item, "brandMeaning");
              },
            },
            required: true,
          };
        }
        if (name === "costCenterNum") {
          return {
            fieldType: "LOV",
            fieldCode: "costCenterNum",
            displayField: "costCenterNum",
            lovCode: "SCUX.JALA.COST_CENTER",
            options: {
              multiple: false,
              displayField: "costCode", // 主要展示内容
              subDisplayField: "costName",
              queryField: "costCode",
              valueField: "costCenterNum",
              callback: this.callbackFieldVal,
            },
            required: true,
          };
        }
        if (name === "costCenterName") {
          return {
            fieldType: "INPUT",
            required: true,
          };
        }
        if (name === "transportTypeMeaning") {
          return {
            fieldType: "SELECT",
            fieldCode: "transportType",
            lovCode: "SCUX.JALA.TRANSPORT_TYPE",
            callbackFieldVal: this.callbackFieldVal,
            options: {
              callback: (item)=>{
                this.callbackFieldVal(item, "transportTypeMeaning");
              },
            },
          };
        }
        if (name === "comments") {
          return {
            fieldType: "INPUT",
          };
        }
        if (flag === "line") {
          if (name === "madeSupplierCompanyName") {
            return {
              fileName: label,
              fieldType: "LOV",
              displayField: "madeSupplierCompanyName",
              fieldCode: "madeSupplierCompanyId",
              lovCode: "SPFM.TENANT_SUPPLIER",
              options: {
                multiple: false,
                subDisplayField: "companyNum",
                queryField: "companyName",
                valueField: "madeSupplierCompanyId",
                callback: (item, valueField) => {
                  this.callbackFieldVal(item, valueField, lineNum);
                },
              },
            };
          }
          if (name === "pickToDate" || name === "pickUpDate") {
            return {
              fieldType: "DATE",
            };
          }
          if (name === "logisticsTypeMeaning") {
            return {
              fieldType: "SELECT",
              fieldCode: "logisticsType",
              lovCode: "SCUX.JALA.REQ.LOGISTICSTYPE",
              callbackFieldVal: this.callbackFieldVal,
              options: {
                callback: (item)=>{
                  this.callbackFieldVal(item, "logisticsType", lineNum);
                },
              },
            };
          }
          if (name === "logisticsCarTypeMeaning") {
            return {
              fieldType: "SELECT",
              fieldCode: "logisticsCarType",
              lovCode: "SCUX.JALA.REQ.LOGISTICSCARTYPE",
              callbackFieldVal: this.callbackFieldVal,
              options: {
                callback: (item)=>{
                  this.callbackFieldVal(item, "logisticsCarTypeMeaning");
                },
              },
            };
          }
          if (name === "cityCarTypeMeaning") {
            return {
              fieldType: "SELECT",
              fieldCode: "cityCarType",
              lovCode: "SCUX.JALA.REQ.CITYCARTYPE",
              callbackFieldVal: this.callbackFieldVal,
              options: {
                callback: (item)=>{
                  this.callbackFieldVal(item, "cityCarTypeMeaning", lineNum);
                },
              },
            };
          }
          if (name === "truckCarTypeMeaning") {
            return {
              fieldType: "SELECT",
              fieldCode: "truckCarType",
              lovCode: "SCUX.JALA.REQ.TRUCKCARTYPE",
              callbackFieldVal: this.callbackFieldVal,
              options: {
                callback: (item)=>{
                  this.callbackFieldVal(item, "truckCarTypeMeaning", lineNum);
                },
              },
            };
          }
          if (name === "defectCarTypeMeaning") {
            return {
              fieldType: "SELECT",
              fieldCode: "defectCarType",
              lovCode: "SCUX.JALA.REQ.DEFECTCARTYPE",
              callbackFieldVal: this.callbackFieldVal,
              options: {
                callback: (item)=>{
                  this.callbackFieldVal(item, "defectCarTypeMeaning", lineNum);
                },
              },
            };
          }
          if (name === "warehouseCarTypeMeaning") {
            return {
              fieldType: "SELECT",
              fieldCode: "warehouseCarType",
              lovCode: "SCUX.JALA.REQ.WAREHOUSECARTYPE",
              callbackFieldVal: this.callbackFieldVal,
              options: {
                callback: (item)=>{
                  this.callbackFieldVal(item, "warehouseCarTypeMeaning", lineNum);
                },
              },
            };
          }
          if (name === "emptyCarTypeMeaning") {
            return {
              fieldType: "SELECT",
              fieldCode: "emptyCarType",
              lovCode: "SCUX.JALA.REQ.EMPTYCARTYPE",
              callbackFieldVal: this.callbackFieldVal,
              options: {
                callback: (item)=>{
                  this.callbackFieldVal(item, "emptyCarTypeMeaning", lineNum);
                },
              },
            };
          }
          return {
            fieldType: "INPUT",
          };
        }
      }
    },
    callbackFieldVal([ val ], valueField, lineNum = -1) {
      if (valueField === "supplierCompanyId" && val && val.companyId) {
        this.headInfo.supplierCompanyId = val.companyId;
        this.headInfo.supplierCompanyName = val.companyName;
        this.headInfo.supplierCompanyCode = val.companyNum;
      }
      if (valueField === "costCenterNum" && val && val.costCode) {
        this.headInfo.costCenterNum = val.costCode;
        this.headInfo.costCenterName = val.costName;
      }
      if (valueField === "companyId" && val && val.companyId) {
        this.headInfo.companyId = val.companyId;
        this.headInfo.companyName = val.companyName;
      }
      if (valueField === "brandMeaning" && val && val.value) {
        this.headInfo.brand = val.value;
        this.headInfo.brandMeaning = val.meaning;
      }
      if (valueField === "transportTypeMeaning" && val && val.value) {
        this.headInfo.transportType = val.value;
        this.headInfo.transportTypeMeaning = val.meaning;
      }
      if (lineNum > -1) {
        if (valueField === "madeSupplierCompanyId" && val && val.companyId) {
          this.linesInfo[lineNum]["madeSupplierCompanyId"] = val.companyId;
          this.linesInfo[lineNum]["madeSupplierCompanyName"] = val.companyName;
        }
      }
    },
    lookSomePop(flag) {
      if (flag === "header") {
        this.detailInfo = { ...this.headInfo };
        this.customizeInfo = {
          name: "头信息",
          getColumns: this.getHeaderDetailColumn,
          code: "",
        };
        this.visible = true;
      }
    },
    closSomePop() {
      this.visible = false;
    },
    // 头信息
    async fetchData() {
      await getHeaderApi(this.changeReqId, {
        page: 0,
        size: 1000,
      }).then((res)=> {
        this.headInfo = { ...res };
        this.getField(this.headInfo.liaisonType);
      });
    },
    // 获取专柜-行信息
    async ferchHeadLine() {
      if (this.headInfo.liaisonType === "10") {
        await getHeaderLineApi(this.changeReqId, {}).then((item)=>{
          this.headInfoLines = [ ...item ];
        });
      }
    },
    // 行信息
    async fatchLine() {
      await getLineApi(this.changeReqId, {
        page: 0,
        size: 1000,
        liaisonType: this.headInfo.liaisonType
      }).then((res)=> {
        this.linesInfo = [ ...res ];
      });
    },
    // 调用独立值集
    async getLovInterface() {
      if (this.headInfo.liaisonType === "10") {
        await getLovApi("SCUX.JALA.LIAISON.REPAIR.TYPE").then((res)=> {
          this.lovObj["repairCategory"] = res;
        });
        await getLovApi("SCUX.JALA.LIAISON.REPAIR.ITEM").then((res)=> {
          this.lovObj["repairItem"] = res;
        });
        await getLovApi("SCUX.JALA.LIAISON.REPAIR.REASON").then((res)=> {
          this.lovObj["repairReason"] = res;
        });
        await getLovApi("SCUX.JALA.LIAISON.REPAIR.NOTE").then((res)=> {
          this.lovObj["detailComments"] = res;
        });
        this.headInfoLines && this.headInfoLines.length > 0 && this.headInfoLines.map((res)=>{
          let m1 = this.lovObj["repairCategory"].find((v)=>v.value === res.repairCategory);
          let m2 = this.lovObj["repairItem"].find((v)=>v.value === res.repairItem);
          let m3 = this.lovObj["repairReason"].find((v)=>v.value === res.repairReason);
          let m4 = this.lovObj["detailComments"].find((v)=>v.value === res.detailComments);

          res["repairCategoryMeaning"] = m1 ? m1.meaning : "";
          res["repairItemMeaning"] = m2 ? m2.meaning : "";
          res["repairReasonMeaning"] = m3 ? m3.meaning : "";
          res["detailCommentsMeaning"] = m4 ? m4.meaning : "";
        });
      }
      await getLovApi("SCUX.JALA.LIAISON.UNIT").then((res)=> {
        this.lovObj["liaisonUnit"] = res;
        let m = res.find((v)=>v.value === this.headInfo.liaisonUnit);
        this.headInfo["liaisonUnitMeaning"] = m ? m.meaning : "";
      });
      if (this.headInfo.liaisonType === "50") {
        await getLovApi("SCUX.JALA.REQ.LOGISTICSTYPE").then((res)=> {
          this.lovObj["logisticsType"] = res;
        });
        await getLovApi("SCUX.JALA.REQ.LOGISTICSCARTYPE").then((res)=> {
          this.lovObj["logisticsCarType"] = res;
        });
        await getLovApi("SCUX.JALA.REQ.CITYCARTYPE").then((res)=> {
          this.lovObj["cityCarType"] = res;
        });
        await getLovApi("SCUX.JALA.REQ.TRUCKCARTYPE").then((res)=> {
          this.lovObj["truckCarType"] = res;
        });
        await getLovApi("SCUX.JALA.REQ.DEFECTCARTYPE").then((res)=> {
          this.lovObj["defectCarType"] = res;
        });
        await getLovApi("SCUX.JALA.REQ.WAREHOUSECARTYPE").then((res)=> {
          this.lovObj["warehouseCarType"] = res;
        });
        await getLovApi("SCUX.JALA.REQ.EMPTYCARTYPE").then((res)=> {
          this.lovObj["emptyCarType"] = res;
        });
        this.linesInfo && this.linesInfo.length > 0 && this.linesInfo.map((res)=>{
          let m1 = this.lovObj["logisticsType"].find((v)=>v.value === res.logisticsType);
          let m2 = this.lovObj["logisticsCarType"].find((v)=>v.value === res.logisticsCarType);
          let m3 = this.lovObj["cityCarType"].find((v)=>v.value === res.cityCarType);
          let m4 = this.lovObj["truckCarType"].find((v)=>v.value === res.truckCarType);
          let m5 = this.lovObj["defectCarType"].find((v)=>v.value === res.defectCarType);
          let m6 = this.lovObj["warehouseCarType"].find((v)=>v.value === res.warehouseCarType);
          let m7 = this.lovObj["emptyCarType"].find((v)=>v.value === res.emptyCarType);

          res["logisticsTypeMeaning"] = m1 ? m1.meaning : "";
          res["logisticsCarTypeMeaning"] = m2 ? m2.meaning : "";
          res["cityCarTypeMeaning"] = m3 ? m3.meaning : "";
          res["truckCarTypeMeaning"] = m4 ? m4.meaning : "";
          res["defectCarTypeMeaning"] = m5 ? m5.meaning : "";
          res["warehouseCarTypeMeaning"] = m6 ? m6.meaning : "";
          res["emptyCarTypeMeaning"] = m7 ? m7.meaning : "";
        });
      }
      this.headInfo = { ...this.headInfo };
    },
  }
};
