import {
  getRfxHeaderInfoDetail,
  getRfxHeaderDetail,
  getRfxExperts,
  getRfxIndics,
} from "../api";
import { formatMinutes } from "@/utils/filter";
import { DataSet, $T } from "srm-mobile-ui";
import { sectionDs, expertInfoDs, scoreIndicDs, indicsInfoDs, technologyIndicDs, businessIndicDs } from "../datasource/ds";
import { getSourceCategoryName, getDocumentTypeName, getQuotationName, yesOrNoRenderer } from "../utils/utils";
import { getUomName, getQtyName } from "@/utils/doubleUnit";

export default {
  props: {
    changeReqId: {
      type: String | Number,
      default: "",
    },
    parameters: {
      type: Object,
      default: {},
    }
  },
  data () {
    return {
      initLoading: true,
      loading: false,
      bidFlag: false, // false-询价 true-新招标
      // 基础信息 / 采购组织及人员 / 资格预审 / 报价 / 附件 / 标段
      headInfo: {},
      // 标段
      sectionDataSet: {},
      // 专家
      expertInfoDataSet: {},
      // 评分要素 - 总
      indicsInfoDataSet: {},
      // 评分要素 - 技术
      technologyIndicDataSet: {},
      // 评分要素 - 商务
      businessIndicDataSet: {},
      /** ********* 协鑫二开新增价格要素-勿动!!! *********** */
      priceIndicDataSet: new DataSet(businessIndicDs()),
      // 符合性检查
      scoreIndicDataSet: {},
      // 要素数据 勿动
      scoreIndicData: {},
    };
  },
  beforeMount () {
    this.bidFlag = this.getBidFlag();
  },
  async mounted () {
    if (this.changeReqId) {
      try {
        this.initLoading = true;
        await this.fetchData();
        await this.fetchIndics();
        await this.fetchExpert();
        await this.fetchDetail();
        this.loading = true;
      } catch (err) {
        this.initLoading = false;
      } finally {
        this.initLoading = false;
      }
    }
  },
  methods: {
    getBidFlag () {
      const { secondarySourceCategory = "" } = this.parameters;
      return secondarySourceCategory === "NEW_BID"; // RFQ-询价 NEW_BID-招标
    },
    // 基本信息
    async fetchData () {
      await getRfxHeaderInfoDetail(this.changeReqId, {}).then((res = {}) => {
        this.headInfo = res.rfxHeader || {};
        // 标段
        if (this.headInfo.projectLineSections && this.headInfo.projectLineSections.length > 0) {
          this.sectionDataSet = new DataSet(sectionDs());
          this.sectionDataSet.setData([ ...this.headInfo.projectLineSections ]);
        }
      });
    },
    // 详情
    async fetchDetail () {
      await getRfxHeaderDetail(this.changeReqId).then((res) => {
        if (res && res.length > 0) {
          this.headInfo["pretrialGroupMember"] = [];
          this.headInfo["pretrialGroupMain"] = "";
          res.map((v) => {
            if (v.leaderFlag === 1) {
              this.headInfo["pretrialGroupMain"] = v.realName;
            } else {
              this.headInfo["pretrialGroupMember"].push(v.realName);
            }
          });
          this.headInfo["pretrialGroupMember"] = this.headInfo["pretrialGroupMember"].join(",");
        }
      });
    },
    // 专家
    async fetchExpert () {
      await getRfxExperts(this.changeReqId).then((res) => {
        this.expertInfoDataSet = new DataSet(expertInfoDs());
        this.expertInfoDataSet.setData([ ...res.evaluateExpertList ]);
      });
    },
    // 评分要素
    async fetchIndics () {
      await getRfxIndics(this.changeReqId).then((res) => {
        this.scoreIndicData = res || {};
        this.scoreIndicDataSet = new DataSet(scoreIndicDs());
        this.scoreIndicDataSet.setData([ ...res.initialReviewIndicList ]);
        this.indicsInfoDataSet = new DataSet(indicsInfoDs());
        this.indicsInfoDataSet.setData([ ...res.otherIndicList ]);
        this.technologyIndicDataSet = new DataSet(technologyIndicDs());
        this.technologyIndicDataSet.setData([ ...res.technologyIndicList ]);
        this.businessIndicDataSet = new DataSet(businessIndicDs());

        this.loadBusinessData(res);
      });
    },
    loadBusinessData(data = []) {
      if (this.over$loadBusinessData && typeof this.over$loadBusinessData === "function") {
        const response = this.over$loadBusinessData();
        return response;
      }
      this.businessIndicDataSet.setData([ ...data.businessIndicList ]);
    },
    // 获取 多语言配置
    getLanguageDefine (key) {
      const languageList = {
        "noContent": $T("hipspfm.common.view.message.title.noData").$D("暂无数据"),
        "refBasicInfo": $T("ssrc.inquiryHall.view.inquiryHall.rfxBasicInfoRFX", [ getSourceCategoryName(this.bidFlag) ]).$D("{sourceCategoryName}基础信息"),
        "purOrganizationAndStaff": $T("ssrc.inquiryHall.view.inquiryHall.purOrganizationAndStaff").$D("采购组织及人员"),
        "section": $T("ssrc.inquiryHall.view.title.sectionBiding").$D("标段"),
        "sectionItem": $T("ssrc.inquiryHall.view.title.sectionItem").$D("标的物"),
        "supplierWithRequest": $T("ssrc.inquiryHall.view.inquiryHall.supplierWithRequest").$D("对供应商要求"),
        "attachment": $T("ssrc.priceLibraryNew.model.library.attachmentUuid").$D("附件"),
        "rfxDeamnd": $T("ssrc.inquiryHall.view.inquiryHall.rfxDeamndRFX", [ getSourceCategoryName(this.bidFlag) ]).$D("{sourceCategoryName}要求"),
      };
      return languageList[key] || key;
    },
    // 获取 个性化配置
    getCustomizeCode (code) {
      const codeList = {
        "demandPublishApproval-refBasicInfo": "SMBL.WORKFLOW.RFX_APPROVAL_NEW.BASIC",
        "demandPublishApproval-demandSide": "SMBL.WORKFLOW.RFX_APPROVAL_NEW.DEMANDSIDE",
        "demandPublishApproval-procureExec": "SMBL.WORKFLOW.RFX_APPROVAL_NEW.PURORGANDSTAFF",
        "demandPublishApproval-section": "SMBL.WORKFLOW.RFX_APPROVAL_NEW.SECTIONBIDING",
        "demandPublishApproval-sectionItem": "SMBL.WORKFLOW.RFX_APPROVAL_NEW.RFXITEMLINES",
        "demandPublishApproval-supplierRequireHead": "SMBL.WORKFLOW.RFX_APPROVAL_NEW.SUPPLIER_HEAD",
        "demandPublishApproval-supplierListHead": "",
        "demandPublishApproval-supplierList": "SMBL.WORKFLOW.RFX_APPROVAL_NEW.SUPPLIER",
        "demandPublishApproval-rfxPrepare": "SMBL.WORKFLOW.RFX_APPROVAL_NEW.RFXPREPARE",
        "demandPublishApproval-preQualification": "SMBL.WORKFLOW.RFX_APPROVAL_NEW.PREQUALIFICATION",
        "demandPublishApproval-quotation": "SMBL.WORKFLOW.RFX_APPROVAL_NEW.RULE",
        "demandPublishApproval-expertHead": "",
        "demandPublishApproval-expert": "SMBL.WORKFLOW.RFX_APPROVAL_NEW.EXPERT",
        "demandPublishApproval-initialReviewIndic": "SMBL.WORKFLOW.RFX_APPROVAL_NEW.SCOREINDIC",
        "demandPublishApproval-initialReviewIndicHead": "",
        "demandPublishApproval-scoringElementsHead": "",
        "demandPublishApproval-scoringElements": "SMBL.WORKFLOW.RFX_APPROVAL_NEW.SCORE",
        "demandPublishApproval-scoringTechnicalGroupHead": "",
        "demandPublishApproval-scoringBusinessGroupHead": "",
        "demandPublishApproval-attachment": "SMBL.WORKFLOW.RFX_APPROVAL_NEW.ATTACHMENT",
        "item": "SMBL.WORKFLOW.RFX_APPROVAL_NEW.ITEM",
        "scoringElement": "SMBL.WORKFLOW.RFX_APPROVAL_NEW.INDICSINFOLINE",
        "quotationDetailHead": "",
        "quotationDetail": "",
        "ladderQuotationHead": "",
        "ladderQuotation": "",
        "allocatedExpert": "",
        "allocatedItem": "",
        "allocatedLot": "",
      };
      return codeList[code] || "";
    },
    // 获取字段
    getFieldInfo (name) {
      let columnList = [
        {
          fieldCode: "rfxTitle",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.inquiryTitleRFX", [ getDocumentTypeName(this.bidFlag) ]).$D("{documentTypeName}标题"),
          formRow: 10,
        },
        {
          fieldCode: "budgetAmount",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.budgetAmount").$D("预算金额"),
          fieldType: "INPUT_NUMBER",
          editor: false,
          precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision")),
          formRow: 20,
        },
        {
          fieldCode: "templateName",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.templateName").$D("寻源模版"),
          formRow: 20,
        },
        {
          fieldCode: "remark",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.remark").$D("备注"),
          formRow: 30,
        },
        {
          fieldCode: "demandSideHead",
          fieldType: "EMPTY",
          render: () =>
            <SrmListHeader>
              {$T("ssrc.inquiryHall.view.inquiryHall.demandSide").$D("需求方")}
            </SrmListHeader>
        },
        {
          fieldCode: "companyName",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.companyName").$D("公司"),
        },
        {
          fieldCode: "unitName",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.unitName").$D("需求部门"),
        },
        {
          fieldCode: "procureExecHead",
          fieldType: "EMPTY",
          formRow: 0,
          render: () =>
            <SrmListHeader>
              {$T("ssrc.inquiryHall.view.inquiryHall.purchaseExecute").$D("采购执行人")}
            </SrmListHeader>
        },
        {
          fieldCode: "purOrganizationName",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.purOrganizationName").$D("采购组织名称"),
          formRow: 10,
        },
        {
          fieldCode: "purchaserName",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.purchaserName").$D("采购员"),
          formRow: 20,
        },
        {
          fieldCode: "purName",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.purName").$D("采购联系人"),
          formRow: 20,
        },
        {
          fieldCode: "purPhone",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.purPhone").$D("联系人电话"),
          render: (val, item) => <span>{`${item.internationalTelCodeMeaning} | ${val}`}</span>,
          formRow: 30,
        },
        {
          fieldCode: "purEmail",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.purEmail").$D("联系人邮箱"),
          formRow: 40,
        },
        {
          fieldCode: "rfxByName",
          fieldName: this.bigFlag ? $T("ssrc.common.view.message.BIDCreator").$D("招标员") : $T("ssrc.common.view.message.RfxCreator").$D("询价员"),
          formRow: 50,
        },
        {
          fieldCode: "checkedByName",
          fieldName: this.bidFlag ? $T("ssrc.inquiryHall.model.inquiryHall.BIDcheckPricer").$D("定标员") : $T("ssrc.inquiryHall.model.inquiryHall.RFXcheckPricer").$D("核价员"),
          formRow: 50,
        },
        {
          fieldCode: "sectionItemHead",
          fieldType: "EMPTY",
          formRow: 1,
          render: (val, item) => <div style="font-size: 12px;color: #333333;font-weight: 600;">
            {item.itemName}
          </div>,
        },
        {
          fieldCode: "rfxLineItemNum",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.itemNum").$D("行号"),
          formRow: 5,
        },
        {
          fieldCode: "itemCode",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.itemCode").$D("物料编码"),
          formRow: 5,
        },
        {
          fieldCode: "specs",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.specs").$D("规格"),
          formRow: 10,
        },
        {
          fieldCode: "itemCategoryName",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.itemCategory").$D("物料类别"),
          formRow: 10,
        },
        {
          fieldCode: "secondaryQuantity",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.rfxQuantity").$D("需求数量"),
          fieldType: "INPUT_NUMBER",
          editor: false,
          formRow: 20,
        },
        {
          fieldCode: "secondaryUomName",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.uomName").$D("单位"),
          formRow: 20,
        },
        {
          fieldCode: "rfxQuantity",
          fieldName: getQtyName(this.doubleUnitFlag),
          fieldType: "INPUT_NUMBER",
          editor: false,
          formRow: 20,
        },
        {
          fieldCode: "uomName",
          fieldName: getUomName(this.doubleUnitFlag),
          formRow: 20,
        },
        {
          fieldCode: "quotationDetailBtn",
          // fieldType: "EMPTY",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.quotationDetail").$D("报价明细"),
          render: (val, item) => <srm-flex>
            {/*<span>{ $T("ssrc.inquiryHall.model.inquiryHall.quotationDetail").$D("报价明细") }：</span>*/}
            {
              item.quotationDetailFlag === 1 ? <span style="color: var(--color-other-default-b);" on-click={(e) => {
                e.stopPropagation();
                this.lookSomePop("quotationDetail", item);
              }}>
                {$T("ssrc.inquiryHall.view.message.button.view").$D("查看")}
              </span> : "-"
            }
          </srm-flex>,
          formRow: 30,
        },
        {
          fieldType: "EMPTY",
          fieldCode: "quotationDetailHead",
          formRow: 0,
          render: (val, item) =>
            <div style="font-size: 14px;color: #333333;font-weight: 600;">
              {item.templateNum}-{item.templateName}
            </div>
        },
        {
          fieldCode: "attachmentNeedFlag",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.attachmentNeedFlag").$D("附件必传"),
          render: (val) => <span>{val === 1 ? $T("hipspfm.common.status.yes").$D("是") : $T("hipspfm.common.status.no").$D("否")}</span>,
        },
        {
          fieldCode: "allowCreateFlag",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.allowCreateFlag").$D("允许供应商新建明细行"),
          render: (val) => <span>{val === 1 ? $T("hipspfm.common.status.yes").$D("是") : $T("hipspfm.common.status.no").$D("否")}</span>,
        },
        {
          fieldCode: "demandSideLine",
          fieldType: "EMPTY",
          formRow: 0,
          render: (val, item) =>
            <div style="font-size: 14px;color: #333333;font-weight: 600;">
              {item.configCode}-{item.configName}
            </div>
        },
        {
          fieldCode: "configQuantity",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.configQuantity").$D("数量"),
          fieldType: "INPUT_NUMBER",
          editor: false,
          formRow: 10,
        },
        {
          fieldCode: "configUnitPrice",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.configUnitPrice").$D("单价"),
          fieldType: "INPUT_NUMBER",
          editor: false,
          formRow: 10,
        },
        {
          fieldCode: "configCost",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.configCost").$D("总价"),
          formRow: 20,
        },
        {
          fieldCode: "taxIncludedFlag",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.taxIncludedFlag").$D("是否含税"),
          render: (val) => <span>{val === 1 ? $T("hipspfm.common.status.yes").$D("是") : $T("hipspfm.common.status.no").$D("否")}</span>,
          formRow: 40,
        },
        {
          fieldCode: "taxRate",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.taxRateCode").$D("税率"),
          formRow: 40,
        },
        {
          fieldCode: "ladderInquiryFlag",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.isLadderInquiryFlag").$D("启用阶梯报价"),
          render: (val) => <span>{val === 1 ? $T("hipspfm.common.status.yes").$D("是") : $T("hipspfm.common.status.no").$D("否")}</span>,
          formRow: 50,
        },
        {
          fieldCode: "ladderQuotationBtn",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.ladderQuotation").$D("阶梯报价"),
          // fieldType: "EMPTY",
          render: (val, item) => <srm-flex>
            {/*<span>{ $T("ssrc.inquiryHall.model.inquiryHall.ladderQuotation").$D("阶梯报价") }：</span>*/}
            {
              item.ladderInquiryFlag === 1 ? <span style="color: var(--color-other-default-b);"
                on-click={(e) => {
                  e.stopPropagation();
                  this.lookSomePop("ladderQuotation", item);
                }}>
                {$T("ssrc.inquiryHall.view.message.button.view").$D("查看")}
              </span> : "-"
            }
          </srm-flex>,
          formRow: 50,
        },
        {
          fieldType: "EMPTY",
          fieldCode: "ladderQuotationHead",
          formRow: 0,
          render: (val, item) =>
            <div style="font-size: 14px;color: #333333;font-weight: 600;">
              {item.itemCode}-{item.itemName}
            </div>
        },
        {
          fieldType: "EMPTY",
          fieldCode: "priceHead",
          formRow: 10,
          render: (value, record) => {
            if (record.ladderFrom && record.ladderTo) {
              return <span>{`${record.ladderFrom}至${record.ladderTo}`}</span>;
            } else if (record.ladderTo) {
              return <span>{`0至${record.ladderTo}`}</span>;
            }
            return <span>{`${record.ladderFrom}以上`}</span>;
          },
        },
        {
          fieldCode: "floatTypeMeaning",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.floatTypeMeaning").$D("浮动方式"),
          formRow: 60,
        },
        {
          fieldCode: "quotationRange",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.quotationRange").$D("报价幅度"),
          formRow: 60,
        },
        {
          fieldCode: "attachmentUuid",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.attachmentUuidRfxBid", [ getDocumentTypeName(this.bidFlag) ]).$D("{documentTypeName}附件"),
          fieldType: "UPLOAD",
          showCount: true,
          formRow: 70,
        },
        // {
        //   fieldCode: "attachmentUuid",
        //   fieldName: $T("ssrc.inquiryHall.model.inquiryHall.purchaseAttachmentUuid").$D("采购方附件上传"),
        //   fieldType: "UPLOAD",
        //   showCount: true,
        // },
        {
          fieldCode: "sectionEstimatedAmount",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.sectionEstimatedAmount").$D("标段预估金额"),
          fieldType: "INPUT_NUMBER",
          editor: false,
          precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision")),
          formRow: 10,
        },
        {
          fieldCode: "sectionRemark",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.remark").$D("备注"),
          formRow: 10,
        },
        {
          fieldCode: "itemBtn",
          fieldType: "EMPTY",
          render: (val, item) => <srm-flex>
            <span>{$T("ssrc.inquiryHall.model.inquiryHall.item").$D("物料")}：</span>
            {
              <span style="color: var(--color-other-default-b);"
                on-click={(e) => {
                  e.stopPropagation();
                  this.lookSomePop("item", item);
                }}>
                {$T("ssrc.inquiryHall.view.message.button.view").$D("查看")}
              </span>
            }
          </srm-flex>,
          formRow: 20,
        },
        {
          fieldCode: "sectionAttachmentUuid",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.sectionAttachmentUuid").$D("附件"),
          fieldType: "UPLOAD",
          showCount: true,
        },
        {
          fieldCode: "sourceMethodMeaning",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.sourceMethodMeaning").$D("寻源方式"),
          formRow: 10,
        },
        {
          fieldCode: "allowSourceSupplierStages",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.allowSourceSupplierStages").$D("可参与寻源供应商阶段"),
          formRow: 20,
        },
        {
          fieldCode: "supplierListHead",
          fieldType: "EMPTY",
          formRow: 3,
          render: () =>
            <SrmListHeader>
              {$T("ssrc.inquiryHall.view.tab.supplierList").$D("供应商列表")}
            </SrmListHeader>
        },
        {
          fieldCode: "supplierCompanyName",
          fieldType: "EMPTY",
          formRow: 1,
          render: (val, item) =>
            <div style="font-size: 12px;color: #333333;font-weight: 600;">
              {item.supplierCompanyName}
            </div>
        },
        {
          fieldCode: "supplierCompanyNum",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.supplierCompanyCode").$D("供应商编码"),
          formRow: 5,
        },
        {
          fieldCode: "priceCoefficient",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.priceCoefficient").$D("价格系数"),
          formRow: 10,
        },
        {
          fieldCode: "stageDescription",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.stageDescription").$D("生命周期阶段"),
          formRow: 10,
        },
        {
          fieldCode: "contactName",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.contactName").$D("联系人"),
          formRow: 20,
        },
        {
          fieldCode: "contactMobilephone",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.contactMobilephone").$D("联系方式"),
          formRow: 20,
        },
        {
          fieldCode: "contactMail",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.contactMail").$D("电子邮箱"),
          formRow: 30,
        },
        {
          fieldCode: "allocatedLotBtn",
          fieldType: "EMPTY",
          render: (val, item) => <srm-flex>
            <span>{$T("ssrc.inquiryHall.model.inquiryHall.allocatedLot").$D("分配标段")}：</span>
            {
              <span style="color: var(--color-other-default-b);"
                on-click={(e) => {
                  e.stopPropagation();
                  this.lookSomePop("allocatedLot", item);
                }}>
                {$T("ssrc.inquiryHall.view.message.button.view").$D("查看")}
              </span>
            }
          </srm-flex>,
          formRow: 30,
        },
        {
          fieldCode: "allocatedItemBtn",
          fieldType: "EMPTY",
          render: (val, item) => <srm-flex>
            <span>{$T("ssrc.inquiryHall.model.inquiryHall.allocatedItem").$D("分配物料")}：</span>
            {
              <span style="color: var(--color-other-default-b);"
                on-click={(e) => {
                  e.stopPropagation();
                  this.lookSomePop("allocatedItem", item);
                }}>
                {$T("ssrc.inquiryHall.view.message.button.view").$D("查看")}
              </span>
            }
          </srm-flex>,
          formRow: 30,
        },
        {
          fieldCode: "rfxPrepareHead",
          fieldType: "EMPTY",
          formRow: 10,
          render: () =>
            <SrmListHeader>
              {$T("ssrc.inquiryHall.view.inquiryHall.rfxPrepare").$D("寻源准备")}
            </SrmListHeader>
        },
        { // 询价
          fieldCode: "sourceCategoryMeaning",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.sourceCategoryMeaning").$D("寻源类别"),
          formRow: 20,
          render: (_, record) => record.secondarySourceCategoryMeaning || record.sourceCategoryMeaning || "-"
        },
        { // 招标
          fieldCode: "secondarySourceCategoryMeaning",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.sourceCategoryMeaning").$D("寻源类别"),
          formRow: 20,
        },
        {
          fieldCode: "preQualificationHead",
          fieldType: "EMPTY",
          formRow: 10,
          render: () =>
            <SrmListHeader>
              {$T("ssrc.inquiryHall.view.message.tab.preQualification").$D("资格预审")}
            </SrmListHeader>
        },
        {
          fieldCode: "prequalEndDate",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.prequalEndDate").$D("预审截止时间"),
          formRow: 20,
        },
        {
          fieldCode: "reviewMethodMeaning",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.reviewMethodMeaning").$D("审查方法"),
          formRow: 30,
        },
        {
          fieldCode: "pretrialGroupMain",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.pretrialGroupMain").$D("预审小组组长"),
          formRow: 40,
        },
        {
          fieldCode: "pretrialGroupMember",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.pretrialGroupMember").$D("预审小组成员"),
          formRow: 50,
        },
        // {
        //   fieldCode: "enableScoreFlag",
        //   fieldName: $T("ssrc.inquiryHall.model.inquiryHall.enableScoreFlag").$D("启用评分细项"),
        // },
        {
          fieldCode: "look",
          fieldType: "EMPTY",
          render: (val, item) => <srm-flex>
            <span>{$T("ssrc.inquiryHall.model.inquiryHall.scoringItem").$D("评分细项")}：</span>
            {
              <span style="color: var(--color-other-default-b);"
                on-click={(e) => {
                  e.stopPropagation();
                  this.lookSomePop("scoringItem", item);
                }}>
                {$T("ssrc.inquiryHall.view.message.button.view").$D("查看")}
              </span>
            }
          </srm-flex>,
          formRow: 60,
        },
        {
          fieldCode: "prequalAttachmentUuid",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.prequalAttachmentUuid").$D("资格预审文件"),
          fieldType: "UPLOAD",
          showCount: true,
          formRow: 60,
        },
        // {
        //   fieldCode: "",
        //   fieldName: $T("ssrc.inquiryHall.model.inquiryHall.").$D("资质要求"),
        // },
        {
          fieldCode: "rfxRemark",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.remark").$D("备注"),
          formRow: 70,
        },
        {
          fieldCode: "quotationHead",
          fieldType: "EMPTY",
          fieldName: $T("ssrc.inquiryHall.view.message.tab.quotationRfxBid", [ getQuotationName(this.bidFlag) ]).$D("{this.getQuotationName}"),
          formRow: 10,
          render: () =>
            <SrmListHeader>
              {$T("ssrc.inquiryHall.view.message.tab.quotationRfxBid", [ getQuotationName(this.bidFlag) ]).$D("{this.getQuotationName}")}
            </SrmListHeader>
        },
        {
          fieldCode: "startFlag",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.startFlag").$D("发布即开始"),
          render: (val) => <span>{val === 1 ? $T("hipspfm.common.status.yes").$D("是") : $T("hipspfm.common.status.no").$D("否")}</span>,
          formRow: 20,
        },
        {
          fieldCode: "startQuotationRunningDuration",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.commonQuotRunningDuration", [ getQuotationName(this.bidFlag) ]).$D("{this.getQuotationName}运行时间"),
          formRow: 30,
          render: (val, record) => record.sourceCategory === "RFA" ? formatMinutes(record.quotationRunningDuration) : formatMinutes(val),
        },
        {
          fieldCode: "quotationRunningDuration",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.biddingRunningTime").$D("竞价运行时间"),
          formRow: 30,
          render: (val) => formatMinutes(val),
        },
        {
          fieldCode: "quotationEndDateDuration",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.commonqQotationDeadline", [ getQuotationName(this.bidFlag) ]).$D("{quotationName}截止时间"),
          formRow: 30,
          render: (val, record) => record.quotationEndDate,
        },
        {
          fieldCode: "quotationStartDateDuration",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.commonQuotationStartTime", [ getQuotationName(this.bidFlag) ]).$D("{quotationName}开始时间"),
          formRow: 30,
          render: (val, record) => record.quotationStartDate,
        },
        {
          fieldCode: "sealedQuotationFlag",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.sealedQuotationFlag").$D("密封报价"),
          render: (val) => <span>{val === 1 ? $T("hipspfm.common.status.yes").$D("是") : $T("hipspfm.common.status.no").$D("否")}</span>,
          formRow: 40,
        },
        {
          fieldCode: "quotationTypeMeaning",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.quotationTypeMeaning").$D("报价方式"),
          formRow: 40,
        },
        {
          fieldCode: "currencyCode",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.currencyCode").$D("币种"),
          formRow: 50,
        },
        {
          fieldCode: "multiCurrencyFlag",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.allowMuitiCurQuo").$D("允许多币种报价"),
          render: (val) => yesOrNoRenderer(val),
          formRow: 50,
        },
        {
          fieldCode: "quotationScopeMeaning",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.quotationScopeMeaning").$D("报价范围"),
          formRow: 60,
        },
        {
          fieldCode: "paymentTypeName",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.paymentTypeName").$D("付款方式"),
          formRow: 60,
        },
        {
          fieldCode: "paymentTermName",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.paymentTermName").$D("付款条款"),
          formRow: 70,
        },
        {
          fieldCode: "paymentTermFlag",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.allowAlterPaymentTypeTerm").$D("允许修改付款方式"),
          formRow: 70,
          render: (val) => yesOrNoRenderer(val),
        },
        {
          fieldCode: "bidFileExpense",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.bidFileExpense").$D("招标文件费(元)"),
          formRow: 80,
          render: (val) => val === 0 ? $T("ssrc.common.view.gratis").$D("免费") : `${val ? val : "-"}`
        },
        {
          fieldCode: "bidBond",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.bidBond").$D("保证金(元)"),
          formRow: 80,
          render: (val) => val === 0 ? $T("ssrc.common.view.gratis").$D("免费") : `${val ? val : "-"}`
        },
        {
          fieldCode: "minQuotedSupplier",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.minQuotedSupplier").$D("最少报价供应商数"),
          formRow: 90,
        },
        {
          fieldCode: "centralPurchaseFlag",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.centralPurFlag").$D("是否集采"),
          render: (val) => <span>{val === 1 ? $T("hipspfm.common.status.yes").$D("是") : $T("hipspfm.common.status.no").$D("否")}</span>,
          formRow: 90,
        },
        {
          fieldCode: "taxChangeFlag",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.taxChangeFlag").$D("允许供应商修改税率"),
          render: (val) => <span>{val === 1 ? $T("hipspfm.common.status.yes").$D("是") : $T("hipspfm.common.status.no").$D("否")}</span>,
          formRow: 100,
        },
        {
          fieldCode: "continuousQuotationFlag",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.continuousQuotationFlag").$D("允许供应商连续报价"),
          render: (val) => <span>{val === 1 ? $T("hipspfm.common.status.yes").$D("是") : $T("hipspfm.common.status.no").$D("否")}</span>,
          formRow: 100,
        },
        {
          fieldCode: "quantityChangeFlag",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.quantityChangeFlag").$D("允许供应商修改可供数量"),
          // fieldType: "INPUT_NUMBER",
          editor: false,
          render: (val) => yesOrNoRenderer(val),
          formRow: 110,
        },
        {
          fieldCode: "diyLadderQuotationFlag",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.diyLadderQuotationFlag").$D("允许供应商自定义阶梯报价"),
          render: (val) => <span>{val === 1 ? $T("hipspfm.common.status.yes").$D("是") : $T("hipspfm.common.status.no").$D("否")}</span>,
          formRow: 120,
        },
        {
          fieldCode: "invoiceType",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.invoiceType").$D("发票类型"),
          formRow: 130,
        },
        {
          fieldCode: "professionalHead",
          fieldType: "EMPTY",
          formRow: 10,
          render: () =>
            <SrmListHeader>
              {$T("ssrc.inquiryHall.view.message.tab.professional").$D("专家")}
            </SrmListHeader>
        },
        {
          fieldCode: "evaluateLeaderFlagMeaning",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.evaluateLeaderFlagMeaning").$D("职责"),
          formRow: 20,
        },
        {
          fieldCode: "teamMeaning",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.teamMeaning").$D("本次评分类别"),
          formRow: 20,
        },
        {
          fieldCode: "expertCategoryMeaning",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.expertCategoryMeaning").$D("专家类型"),
          formRow: 30,
        },
        {
          fieldCode: "expertName",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.expertName").$D("专家姓名"),
          fieldType: "EMPTY",
          formRow: 30,
          render: (val, item) => <div style="font-size: 12px;color: #333333;font-weight: 600;">
            {item.expertName}
          </div>
        },
        {
          fieldCode: "phone",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.contactMobile").$D("联系电话"),
          render: (val, item) => <span>{`${item.internationalTelCodeMeaning} | ${val}`}</span>,
          formRow: 40,
        },
        {
          fieldCode: "email",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.emailOne").$D("邮箱"),
          formRow: 50,
        },
        {
          fieldCode: "initialReviewIndicHead",
          fieldType: "EMPTY",
          formRow: 10,
          render: () =>
            <SrmListHeader>
              {$T("ssrc.inquiryHall.view.message.tab.initialReviewIndic").$D("符合性检查")}
            </SrmListHeader>
        },
        {
          fieldCode: "indicateTypeMeaning",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.indicateTypeMeaning").$D("要素类型"),
        },
        {
          fieldCode: "passFlag",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.passFlag").$D("必须通过"),
          render: (val) => <span>{val === 1 ? $T("hipspfm.common.status.yes").$D("是") : $T("hipspfm.common.status.no").$D("否")}</span>,
        },
        {
          fieldCode: "scoringElements",
          fieldType: "EMPTY",
          fieldName: $T("ssrc.inquiryHall.view.message.tab.scoringElements").$D("评分要素"),
          formRow: 10,
          render: () =>
            <SrmListHeader>
              {$T("ssrc.inquiryHall.view.message.tab.scoringElements").$D("评分要素")}
            </SrmListHeader>
        },
        {
          fieldCode: "scoringTechnicalGroupHead",
          fieldType: "EMPTY",
          formRow: 10,
          render: (val, item) =>
            <SrmListHeader>
              {`${$T("ssrc.inquiryHall.view.message.tab.scoringElements").$D("评分要素")}-${$T("ssrc.inquiryHall.view.message.tab.technicalGroup").$D("技术组")}: ${item.technologyWeight}%`}
            </SrmListHeader>
        },
        {
          fieldCode: "scoringBusinessGroupHead",
          fieldType: "EMPTY",
          formRow: 10,
          render: (val, item) =>
            <SrmListHeader>
              {`${$T("ssrc.inquiryHall.view.message.tab.scoringElements").$D("评分要素")}-${$T("ssrc.inquiryHall.view.message.tab.businessGroup").$D("商务组")}: ${item.businessWeight}%`}
            </SrmListHeader>
        },
        /** ********* 协鑫二开新增价格要素-勿动!!! *********** */
        {
          fieldCode: "scoringPriceGroupHead",
          fieldType: "EMPTY",
          formRow: 10,
          render: (val, item) =>
            <SrmListHeader>
              {`${$T("ssrc.inquiryHall.view.message.tab.scoringElements").$D("评分要素")}-${$T("ssrc.inquiryHall.view.message.tab.priceGroup").$D("价格组")}: ${item.attributeDecimal1}%`}
            </SrmListHeader>
        },
        {
          fieldCode: "scoringElementsHead",
          fieldType: "EMPTY",
          formRow: 20,
          render: (val, item) => <div style="font-size: 12px;color: #333333;font-weight: 600;">
            {`${$T("ssrc.inquiryHall.view.message.tab.scoringElements").$D("评分要素")}-${item.indicateName}`}
          </div>
        },
        // {
        //   fieldCode: "calculateTypeMeaning",
        //   fieldName: $T("ssrc.inquiryHall.model.inquiryHall.calculateType").$D("计算方式"),
        // },
        // {
        //   fieldCode: "scoreTypeMeaning",
        //   fieldName: $T("ssrc.inquiryHall.model.inquiryHall.scoreType").$D("评分类型"),
        // },
        // {
        //   fieldCode: "detailEnabledFlag",
        //   fieldName: $T("ssrc.inquiryHall.model.inquiryHall.detailEnabledFlag").$D("启用评分要素细项"),
        //   render: (val) => <span>{val === 1 ? $T("hipspfm.common.status.yes").$D("是") : $T("hipspfm.common.status.no").$D("否")}</span>,
        // },
        // {
        //   fieldCode: "scoringRubric",
        //   fieldName: $T("ssrc.inquiryHall.model.inquiryHall.scoringRubric").$D("评分细则"),
        // },
        {
          fieldCode: "indicateCode",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.indicateCode").$D("要素编码"),
          formRow: 25,
        },
        {
          fieldCode: "weight",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.weight").$D("权重"),
          formRow: 30,
        },
        {
          fieldCode: "minScore",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.minScore").$D("最低分"),
          formRow: 30,
        },
        {
          fieldCode: "maxScore",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.maxScore").$D("最高分"),
          formRow: 40,
        },
        {
          fieldCode: "look",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.scoringElement").$D("评分要素细项"),
          render: (val, item) => <srm-flex>
            {item.detailEnabledFlag === 1 ?
              <span style="color: var(--color-other-default-b);"
                on-click={(e) => {
                  e.stopPropagation();
                  this.lookSomePop("scoringElement", item);
                }}>
                {$T("ssrc.inquiryHall.view.message.button.view").$D("查看")}
              </span> : "-"
            }
          </srm-flex>,
          formRow: 40,
        },
        {
          fieldCode: "allocatedExpertBtn",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.allocatedExpert").$D("分配专家"),
          // fieldType: "EMPTY",
          render: (_, item) => item.assignedEvaluateExperts,
          // render: (val, item) => <srm-flex>
          //   <span>{ $T("ssrc.inquiryHall.model.inquiryHall.allocatedExpert").$D("分配专家") }：</span>
          //   {
          //     <span style="color: var(--color-other-default-b);"
          //       on-click={(e) => {
          //         e.stopPropagation();
          //         this.lookSomePop("allocatedExpert", item);
          //       }}>
          //       { $T("ssrc.inquiryHall.view.message.button.view").$D("查看") }
          //     </span>
          //   }
          // </srm-flex>,
          formRow: 50,
        },
        {
          fieldCode: "scoringRubricBtn",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.scoringRubric").$D("评分细则"),
          render: (val, item) =>
            <span style="color: var(--color-other-default-b);"
              on-click={(e) => {
                e.stopPropagation();
                this.lookSomePop("scoringRubric", item);
              }}>
              {$T("ssrc.inquiryHall.view.message.button.view").$D("查看")}
            </span>,
          formRow: 60,
        },
        { // 评分要素细项里面的评分细则 因为已经有一个remark 故而这里采用一个别名
          fieldCode: "indicateRemark",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.scoringRubric").$D("评分细则"),
          render: (_, item) => <span>{item.remark || "-"}</span>
        },
        {
          fieldCode: "businessAttachmentUuid",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.businessAttachmentUuid").$D("商务附件"),
          fieldType: "UPLOAD",
          showCount: true,
          formRow: 10,
        },
        {
          fieldCode: "techAttachmentUuid",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.techAttachmentUuid").$D("技术附件"),
          fieldType: "UPLOAD",
          showCount: true,
          formRow: 20,
        },
        {
          fieldCode: "allocatedExpertHead",
          fieldType: "EMPTY",
          formRow: 10,
          render: (val, item) =>
            <div style="display: flex;">
              {
                item.assignFlag ? <p class="distr">{$T("hipspfm.expertScoring.view.message.assigned").$D("已分配")}</p> : ""
              }
              <span>
                {item.loginName}-{item.expertName}
              </span>
            </div>
        },
        {
          fieldCode: "allocatedItemHead",
          fieldType: "EMPTY",
          formRow: 10,
          render: (val, item) =>
            <div style="display: flex;">
              {
                item.inviteFlag ? <p class="distr">{$T("hipspfm.expertScoring.view.message.assigned").$D("已分配")}</p> : ""
              }
              <span>
                {item.itemCode}-{item.itemName}
              </span>
            </div>
        },
        {
          fieldCode: "minLimitPrice",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.minLimitPrice").$D("最低限价"),
          formRow: 20,
        },
        {
          fieldCode: "maxLimitPrice",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.maxLimitPrice").$D("最高限价"),
          formRow: 20,
        },
        {
          fieldCode: "allocatedLotHead",
          fieldType: "EMPTY",
          formRow: 10,
          render: (val, item) =>
            <div style="display: flex;">
              <p class="distr">{$T("hipspfm.expertScoring.view.message.assigned").$D("已分配")}</p>
              <span>
                {item.sectionCode}-{item.sectionName}
              </span>
            </div>
        },
        {
          fieldCode: "scoringIndicateElementHead",
          fieldType: "EMPTY",
          formRow: 0,
          render: (val, item) =>
            <div style="font-size: 14px;color: #333333;font-weight: 600;">
              {item.indicateCode}-{item.indicateName}
            </div>
        },
        {
          fieldCode: "defaultScore",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.defaultScore").$D("缺省分"),
          formRow: 30,
        },
        {
          fieldCode: "itemHead",
          fieldType: "EMPTY",
          formRow: 0,
          render: (val, item) =>
            <div style="font-size: 14px;color: #333333;font-weight: 600;">
              {item.rfxLineItemNum}: {item.itemCode}-{item.itemName}
            </div>
        },
        {
          fieldCode: "ouName",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.ouName").$D("业务实体"),
          formRow: 20,
        },
        {
          fieldCode: "invOrganizationName",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.invOrganizationName").$D("库存组织"),
          formRow: 30,
        },
        {
          fieldCode: "netEstimatedPrice",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.netEstimatedPrice").$D("预估单价(未税)"),
          fieldType: "INPUT_NUMBER",
          editor: false,
          formRow: 60,
        },
        {
          fieldCode: "netPrice",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.netPriceMeaning").$D("预估单价(未税)"),
          fieldType: "INPUT_NUMBER",
          editor: false,
          formRow: 60,
        },
        {
          fieldCode: "batchPrice",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.batchPrice").$D("价格批量"),
          formRow: 70,
        },
        {
          fieldCode: "quotationStartDate",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.quotationStartDate").$D("报价有效期从"),
          formRow: 110,
        },
        {
          fieldCode: "quotationEndDate",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.quotationEndDate").$D("报价有效期至"),
          formRow: 120,
        },
        {
          fieldCode: "supplierItemNumDesc",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.supplierItemNumDesc").$D("供应商料号"),
          formRow: 130,
        },
      ];
      return columnList.find((v) => v.fieldCode === name);
    },
  },
  // 获取字段
  computed: {
    getColumns () {
      return (title) => {
        let nameList = [];
        const roundQuotationRule = this.headInfo.roundQuotationRule;
        const autoRoundQuotationFlag =
          roundQuotationRule === "AUTO" ||
          roundQuotationRule === "AUTO_CHECK" ||
          roundQuotationRule === "AUTO_SCORE";
        const biddingPriceFlag = this.headInfo.sourceCategory === "RFA"; // 竞价标识
        switch (title) {
        case "refBasicInfo":
          nameList = [ "rfxTitle", "budgetAmount", "templateName", "rfxRemark" ];
          break;
        case "refBasicInfoDetail":
          nameList = [ "rfxTitle", "budgetAmount", "templateName", "rfxRemark" ];
          break;
        case "demandSide":
          nameList = [ "companyName", "unitName" ];
          break;
        case "procureExec":
          nameList = [ "purOrganizationName", "purchaserName", "purName", "purPhone", "purEmail", "rfxByName", "checkedByName" ];
          break;
        case "section":
          nameList = [ "sectionEstimatedAmount", "sectionRemark", "itemBtn", "sectionAttachmentUuid" ];
          break;
        case "sectionItem":
          nameList = [ "sectionItemHead", "rfxLineItemNum", "itemCode", "specs", "itemCategoryName", this.doubleUnitFlag ? "secondaryQuantity" : "", this.doubleUnitFlag ? "secondaryUomName" : "", "rfxQuantity", "uomName", "quotationDetailBtn", "taxIncludedFlag", "taxRate", "ladderInquiryFlag", "ladderQuotationBtn", "floatTypeMeaning", "quotationRange", "attachmentUuid", "batchPrice" ].filter(Boolean);
          break;
        case "supplierRequireHead":
          nameList = [ "sourceMethodMeaning", "allowSourceSupplierStages" ];
          break;
        case "supplierListHead":
          nameList = [ "supplierListHead" ];
          break;
        case "supplierList":
          nameList = [ "supplierCompanyName", "supplierCompanyNum", "priceCoefficient", "stageDescription", "contactName", "contactMobilephone", "contactMail", this.headInfo.projectLineSections && this.headInfo.projectLineSections.length > 0 ? "allocatedLotBtn" : "allocatedItemBtn" ];
          break;
        case "rfxPrepare":
          nameList = [ this.bidFlag ? "secondarySourceCategoryMeaning" : "sourceCategoryMeaning" ];
          break;
        case "preQualification":
          nameList = [ "prequalEndDate", "reviewMethodMeaning", "pretrialGroupMain", "pretrialGroupMember", "look", "prequalAttachmentUuid", "rfxRemark" ];
          break;
        case "quotation":
          nameList = [ "startFlag", this.headInfo.quotationEndDateFlag && !biddingPriceFlag && this.headInfo.startFlag && !autoRoundQuotationFlag && (this.headInfo.quotationRunningDurationFlag === 1 ? "quotationEndDateDuration" : "startQuotationRunningDuration"), !this.headInfo.startFlag && !autoRoundQuotationFlag && "quotationStartDateDuration", this.headInfo.quotationEndDateFlag && !this.headInfo.startFlag && !autoRoundQuotationFlag && "quotationEndDateDuration", biddingPriceFlag && (this.headInfo.quotationRunningDurationFlag === 1 ? "quotationEndDateDuration" : "quotationRunningDuration"), "sealedQuotationFlag", "quotationTypeMeaning", "currencyCode", "multiCurrencyFlag", "quotationScopeMeaning", "paymentTypeName", "paymentTermName", "paymentTermFlag", "bidFileExpense", "bidBond", "minQuotedSupplier", "centralPurchaseFlag", "taxChangeFlag", "continuousQuotationFlag", "quantityChangeFlag", "diyLadderQuotationFlag", "invoiceType" ].filter(Boolean);
          break;
        case "expertHead":
          nameList = [ "professionalHead" ];
          break;
        case "expert":
          nameList = [ "evaluateLeaderFlagMeaning", "teamMeaning", "expertCategoryMeaning", "expertName", "phone", "email" ];
          break;
        case "initialReviewIndicHead":
          nameList = [ "initialReviewIndicHead" ];
          break;
        case "initialReviewIndic":
          nameList = [ "indicateTypeMeaning", "passFlag", "allocatedExpertBtn" ];
          break;
        case "scoringElementsHead":
          nameList = [ "scoringElements" ];
          break;
        case "scoringTechnicalGroupHead":
          nameList = [ "scoringTechnicalGroupHead" ];
          break;
        case "scoringBusinessGroupHead":
          nameList = [ "scoringBusinessGroupHead" ];
          break;
        case "scoringElements":
          nameList = [ "scoringElementsHead", "indicateCode", "weight", "minScore", "maxScore", "look", "allocatedExpertBtn", "scoringRubricBtn" ];
          break;
          /** ********* 协鑫二开新增价格要素-勿动!!! *********** */
        case "scoringPriceGroupHead":
          nameList = [ "scoringPriceGroupHead" ];
          break;
        case "attachment":
          nameList = [ "businessAttachmentUuid", "techAttachmentUuid" ];
          break;
        case "ladderQuotationHead":
          nameList = [ "ladderQuotationHead" ];
          break;
        case "ladderQuotation":
          nameList = [ "priceHead", "remark" ];
          break;
        case "quotationDetailHead":
          nameList = [ "quotationDetailHead", "attachmentNeedFlag", "allowCreateFlag", "attachmentUuid" ];
          break;
        case "quotationDetail":
          nameList = [ "demandSideLine", "configQuantity", "configUnitPrice", "configCost", "remark" ];
          break;
        case "allocatedExpert":
          nameList = [ "allocatedExpertHead" ];
          break;
        case "allocatedItem":
          nameList = [ "allocatedItemHead", "minLimitPrice", "maxLimitPrice" ];
          break;
        case "allocatedLot":
          nameList = [ "allocatedLotHead" ];
          break;
        case "scoringElement":
          nameList = [ "scoringIndicateElementHead", "indicateRemark", "minScore", "maxScore", "defaultScore" ];
          break;
        case "item":
          nameList = [ "itemHead", "ouName", "invOrganizationName", "specs", "itemCategoryName", this.doubleUnitFlag ? "secondaryQuantity" : "", this.doubleUnitFlag ? "secondaryUomName" : "", "rfxQuantity", "uomName", "netEstimatedPrice", "netPrice", "quotationDetailBtn", "batchPrice", "taxIncludedFlag", "taxRate", "ladderInquiryFlag", "ladderQuotationBtn", "floatTypeMeaning", "quotationRange", "quotationStartDate", "quotationEndDate", "attachmentUuid", "supplierItemNumDesc" ].filter(Boolean);
          break;
        default:
          nameList = [];
          break;
        }
        let columns = nameList.map((res) => {
          if (title === "quotationDetailHead" && res === "attachmentUuid") {
            return {
              ...this.getFieldInfo(res),
              fieldName: $T("ssrc.inquiryHall.model.inquiryHall.purchaseAttachmentUuid").$D("采购方附件上传"),
            };
          }
          return {
            ...this.getFieldInfo(res)
          };
        });
        return columns;
      };
    },
  }
};
