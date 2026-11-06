<!-- eslint-disable rulesdir/no_hips -->
<template>
  <section v-if="headInfo" class="mainDetail">
    <div ref="navWrap" class="navWrap">
      <ul class="navContent">
        <li
          v-for="(item,index) in getNavArr"
          :key="index"
          :class="{'active': navIndex === index}"
          @click="$changeNav(index)">
          {{ item.title }}
        </li>
      </ul>
    </div>
    <div ref="wrapper" class="contentWrap wrapper">
      <div ref="content" class="content">
        <!-- 协议信息 -->
        <div ref="headInfo" class="infoContent">
          <h3>{{ $T("spcm.common.view.message.title.contractHeaderInformation").$D("协议信息") }}</h3>
          <div class="card-personalized">
            <!-- 个性化组件替换后的代码 -->
            <customize :columns="getAgreementInfoColumns" :data-source="headInfo" code="SMBL.WORKFLOW.AGREEMENT_APPROVAL.AGREEMENT_INFO"/>
          </div>
        </div>
        <!-- 协议标的 -->
        <div ref="lineInfo" class="infoContent">
          <h3>{{ $T("spcm.common.view.message.title.contractSubject").$D("协议标的") }}</h3>
          <div v-if="JSON.stringify(lineInfo) === '[]'" class="noContent">
            <span>{{ $T("hipspfm.common.view.message.title.noData").$D("暂无数据") }}</span>
          </div>
          <div v-for="(item,index) in lineInfo" :key="index" class="card-personalized">
            <div @click="showLineInfoDetail(item)">
              <div class="card-first-between">
                <span class="line-code open-tag">
                  {{ item.itemName }}
                </span>
                <span class="line-num">
                  <span>{{ $T('spcm.common.model.common.lineNumber').$D('行号') }}：{{ item.displayLineNum }}</span>
                </span>
              </div>
              <!-- 个性化组件替换后的代码 -->
              <customize :columns="getSubjectInfoColumns" :data-source="item" code="SMBL.WORKFLOW.AGREEMENT_APPROVAL.SUBJECT_INFO"/>
            </div>
          </div>
        </div>
        <!-- 协议阶段 -->
        <div ref="phaseInfo" class="infoContent">
          <h3>{{ $T("spcm.common.view.message.title.contractStage").$D("协议阶段") }}</h3>
          <div v-if="JSON.stringify(agreementPhaseInfo) === '[]'" class="noContent">
            <span>{{ $T("hipspfm.common.view.message.title.noData").$D("暂无数据") }}</span>
          </div>
          <div v-for="(item,index) in agreementPhaseInfo" :key="index" class="card-personalized">
            <div class="card-first-single">{{ `${item.stageName}-${item.stageCode}` }}</div>
            <!-- 个性化组件替换后的代码 -->
            <customize :columns="getStageInfoColumns" :data-source="item" code="SMBL.WORKFLOW.AGREEMENT_APPROVAL.STAGE_INFO"/>
          </div>
        </div>
        <!-- 伙伴信息 -->
        <div ref="partnerInfo" class="infoContent">
          <h3>{{ $T("spcm.common.view.message.title.partnerInformation").$D("伙伴信息") }}</h3>
          <div v-if="JSON.stringify(agreementPartnerInfo) === '[]'" class="noContent">
            <span>{{ $T("hipspfm.common.view.message.title.noData").$D("暂无数据") }}</span>
          </div>
          <div v-for="(item,index) in agreementPartnerInfo" :key="index" class="card-personalized">
            <div @click="showPartnerInfo(item)">
              <div class="card-first-between">
                <span class="line-code open-tag">
                  {{ item.companyName }}
                </span>
                <span class="line-num">
                  {{ item.partnerTypeName }}
                </span>
              </div>
              <!-- 个性化组件替换后的代码 -->
              <customize :columns="getPartnerInfoColumns" :data-source="item" code="SMBL.WORKFLOW.AGREEMENT_APPROVAL.PARTNER_INFO"/>
            </div>
          </div>
        </div>
        <!-- 业务条款 -->
        <div ref="businessInfo" class="infoContent">
          <h3>{{ $T("spcm.common.view.message.title.businessTermsInformation").$D("业务条款") }}</h3>
          <div v-if="JSON.stringify(agreementProcurementInfo) === '[]'" class="noContent">
            <span>{{ $T("hipspfm.common.view.message.title.noData").$D("暂无数据") }}</span>
          </div>
          <div v-for="(item,index) in agreementProcurementInfo" :key="index" class="detail-info">
            <div class="sub-title">{{ `${item.termTypeName}-${item.termTypeCode}` }}</div>
            <ul>
              <!-- 个性化组件替换后的代码 -->
              <customize :columns="getTermInfoColumns" :data-source="item" code="SMBL.WORKFLOW.AGREEMENT_APPROVAL.TERM_INFO"/>
              <!-- <li>
                <span>{{ $T('spcm.purchaseRequisitionCreation.model.termContent').$D('条款内容') }}：</span>
                <span>{{ item.termContent }}</span>
              </li>
              <li>
                <span>{{ $T('spcm.purchaseRequisitionCreation.model.termRemark').$D('条款说明') }}：</span>
                <span>{{ item.remark }}</span>
              </li> -->
            </ul>
          </div>
        </div>
      </div>
    </div>
    <!-- 标的信息详情弹窗 -->
    <hips-popup v-model="show" class="FullPop" style="height: 100%;width:100%" position="bottom">
      <section class="lineInfoDetail">
        <hips-nav-bar slot="header" :have-border="false">
          <div slot="left" class="left-button" @click="closeLineInfoDetail">
            <img src="@/assets/back@3x.png" alt >
          </div>
          <div
            slot="center"
            class="header">
            {{ $T("spcm.common.view.message.title.subjectInformation").$D("标的明细") }}
          </div>
        </hips-nav-bar>
        <div class="lineHead">
          <li>
            <span>
              <span>{{ $T("spcm.common.model.common.lineNumber").$D("行号") }}: {{ lineInfoDetail.displayLineNum }}</span>
            </span>
          </li>
          <p>
            <span>{{ $T("spcm.common.model.common.itemCode").$D("物料编码") }}：</span>
            <span>{{ lineInfoDetail.itemCode }}</span>
          </p>
          <p>
            <span>{{ $T("spcm.common.model.common.itemName").$D("物料名称") }}：</span>
            <span>{{ lineInfoDetail.itemName }}</span>
          </p>
        </div>
        <div class="card-personalized">
          <!-- 个性化组件替换后的代码 -->
          <customize-detail :columns="getSubjectDetailInfoColumns" :data-source="lineInfoDetail" code="SMBL.WORKFLOW.AGREEMENT_APPROVAL.SUBJECT_DETAIL_INFO"/>
          <div class="no-more"/>
        </div>
      </section>
    </hips-popup>

    <!-- 伙伴信息详情弹窗 -->
    <hips-popup
      v-model="partnerInfoFlag"
      class="FullPop"
      style="height: 100%;width:100%"
      position="bottom">
      <section class="lineInfoDetail">
        <hips-nav-bar slot="header" :have-border="false">
          <div slot="left" class="left-button" @click="closePartnerInfo">
            <img src="@/assets/back@3x.png" alt >
          </div>
          <div
            slot="center"
            class="header">
            {{ $T("spcm.common.view.message.title.partnerInformation").$D("伙伴信息") }}
          </div>
        </hips-nav-bar>
        <div class="lineHead">
          <p>
            <span>{{ $T("entity.company.companyCode").$D("公司编码") }}：</span>
            <span>{{ partnerInfo.companyNum }}</span>
          </p>
          <p>
            <span>{{ $T("entity.company.companyName").$D("公司名称") }}：</span>
            <span>{{ partnerInfo.companyName }}</span>
          </p>
        </div>
        <div class="card-personalized">
          <!-- 个性化组件替换后的代码 -->
          <customize-detail :columns="getPartnerDetailInfoColumns" :data-source="partnerInfo" code="SMBL.WORKFLOW.AGREEMENT_APPROVAL.PARTNER_DETAIL_INFO"/>
          <div class="no-more"/>
        </div>
      </section>
    </hips-popup>

    <attached-file v-model="filePopup" :attachment-uuid="attachmentUuid" />
  </section>
</template>

<script>
import uuid from "uuid";
import BScroll from "better-scroll";
import { Popup, NavBar, Input } from "hips";
import AttachedFile from "@/components/File/AttachedFile";
// import {
//   getAgreementPhaseApi,
//   getAgreementPartnerApi,
//   getAgreementProcurementApi
// } from "../api/Hyt";
// import { getAgreementApi, getAgreementDetailApi } from "../api/Jin";
import {
  getAgreementPhaseApi,
  getAgreementPartnerApi,
  getAgreementProcurementApi,
  getAgreementApi,
  getAgreementDetailApi
} from "./api/jin";
export default {
  modules: [ "hipspfm.common", "spcm.common", "hipspfm.workFlowAgrement", "sqam.inquiryHall", "spcm.purchaseRequisitionCreation", "entity.organization", "small.common", "entity.company", "smbl.common" ],
  name: "JinAgreementApproval",
  components: {
    AttachedFile,
    [Popup.name]: Popup,
    [NavBar.name]: NavBar,
    [Input.name]: Input
  },
  props: {
    changeReqId: {
      type: String | Number,
      default: ""
    },
    showFilePop: {
      type: Function
    }
  },
  data() {
    return {
      headInfo: {},
      lineInfo: [],
      agreementPhaseInfo: [],
      agreementPartnerInfo: [],
      agreementProcurementInfo: [],
      // loading: false,
      show: false,
      scroll: "",
      navScroll: "",
      contentLenArr: [],
      lengthArr: [],
      attachmentUuid: "",
      filePopup: false,
      offsetX: 0,
      navIndex: 0,
      operateType: "",
      operatesPop: false,
      lineInfoDetail: {},
      partnerInfo: {},
      partnerInfoFlag: false,
      moreAttribute1Meaning: ""
    };
  },
  computed: {
    getAgreementInfoColumns() {
      const columns = [
        {
          fieldName: this.$T("spcm.purchaseRequisitionCreation.model.pcName").$D("协议名称"),
          fieldCode: "pcName",
        },
        {
          fieldName: this.$T("spcm.purchaseRequisitionCreation.model.pcNum").$D("协议编号"),
          fieldCode: "pcNum",
        },
        {
          fieldName: this.$T("hipspfm.common.message.createTime").$D("创建时间"),
          fieldCode: "creationDate",
        },
        {
          fieldName: this.$T("spcm.common.model.common.amount").$D("协议总额"),
          fieldCode: "taxIncludeAmount",
          render: (val) =>
            // eslint-disable-next-line
             this.$options.filters["CalcMoney"](val)
        },
        {
          fieldName: this.$T("entity.organization.class.createName").$D("创建人"),
          fieldCode: "createByRealName",
        },
        {
          fieldName: this.$T("spcm.common.model.companyName").$D("公司"),
          fieldCode: "companyName",
        },
        {
          fieldName: this.$T("spcm.common.model.supplierCompanyId").$D("供应商"),
          fieldCode: "supplierCompanyName",
        },
        {
          fieldName: this.$T("spcm.common.model.common.pcKindCode").$D("协议性质"),
          fieldCode: "pcKindCodeMeaning",
        },
        {
          fieldName: this.$T("spcm.common.model.common.pcType").$D("协议类型"),
          fieldCode: "pcTypeName",
        },
        {
          fieldName: this.$T("spcm.common.model.common.pcTemplateId").$D("协议模版"),
          fieldCode: "templateName",
        },
        {
          fieldName: this.$T("spcm.common.model.agentName").$D("采购员"),
          fieldCode: "purchaseAgentName",
        },
        {
          fieldName: this.$T("spcm.common.model.common.checkType").$D("验收类型"),
          fieldCode: "acceptTypeMeaning",
        },
        {
          fieldName: this.$T("spcm.common.model.model.signedEffect").$D("签署即生效"),
          fieldCode: "signEffectFlag",
          render: (val) =>
            // eslint-disable-next-line eqeqeq
            val == 1 ? this.$T("hipspfm.common.status.yes").$D("是") : this.$T("hipspfm.common.status.no").$D("否")
        },
        {
          fieldName: this.$T("spcm.common.model.effectiveTime").$D("有效时长"),
          fieldCode: "effectiveTime",
          render: (val) => {
            if (val) {
              return val + this.$T("smbl.common.view.day").$D("天");
            }
            return val;
          }
        },
        {
          fieldName: this.$T("spcm.common.model.startDateActive").$D("协议起始日期"),
          fieldCode: "startDateActive",
          render: (val) =>
            // eslint-disable-next-line
             this.$options.filters["CalcDate"](val)
        },
        {
          fieldName: this.$T("spcm.common.model.endDateActive").$D("协议终止日期"),
          fieldCode: "endDateActive",
          render: (val) =>
            // eslint-disable-next-line
             this.$options.filters["CalcDate"](val)
        },
        {
          fieldName: this.$T("spcm.common.model.mainPcNum").$D("主协议"),
          fieldCode: "mainPcNum",
        },
        {
          fieldName: this.$T("spcm.common.bussinisModel").$D("业务模式"),
          fieldCode: "attribute1Meaning",
          render: (val) => {
            if (typeof this.headInfo.attribute1Meaning === "string") {
              return val;
            }
            return this.moreAttribute1Meaning;
          }
        },
        {
          fieldName: this.$T("spcm.common.model.quotationModel").$D("报价单业务模式"),
          fieldCode: "attributeVarchar1Meaning",
        },
        {
          fieldName: this.$T("spcm.common.model.salesScope").$D("销售范围"),
          fieldCode: "attribute3",
        },
        {
          fieldName: this.$T("hipspfm.workFlowAgrement.model.workFlowAgrement.remark").$D("备注"),
          fieldCode: "remark",
        },
      ];

      return columns;
    },
    getSubjectInfoColumns() {
      const columns = [
        {
          fieldName: this.$T("spcm.common.model.common.itemCode").$D("物品编码"),
          fieldCode: "itemCode",
        },
        {
          fieldName: this.$T("hipspfm.workFlowAgrement.model.workFlowAgrement.quantity").$D("数量"),
          fieldCode: "quantity",
        },
        {
          fieldName: this.$T("spcm.common.model.common.noTaxPrice").$D("不含税单价"),
          fieldCode: "unitPrice",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters["CalcMoney"](val)
        },
        {
          fieldName: this.$T("spcm.common.model.common.needByDate").$D("交付日期"),
          fieldCode: "deliverDate",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters["CalcDate"](val)
        },
      ];

      return columns;
    },
    getStageInfoColumns() {
      const columns = [
        {
          fieldName: this.$T("spcm.common.model.common.stageCode").$D("阶段编码"),
          fieldCode: "stageCode",
        },
        {
          fieldName: this.$T("spcm.common.model.common.termId").$D("付款条款"),
          fieldCode: "termName",
        },
        {
          fieldName: this.$T("spcm.common.model.common.costQuantity").$D("费用"),
          fieldCode: "costQuantity",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters["CalcMoney"](val)
        },
        {
          fieldName: this.$T("spcm.common.model.common.milestoneTime").$D("里程碑时间"),
          fieldCode: "milestoneTime",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters["CalcDate"](val)
        },
      ];

      return columns;
    },
    getPartnerInfoColumns() {
      const columns = [
        {
          fieldName: this.$T("entity.company.companyCode").$D("公司编码"),
          fieldCode: "companyNum",
        },
        {
          fieldName: this.$T("spcm.common.model.common.legalRepName").$D("代表人"),
          fieldCode: "legalRepName",
        },
        {
          fieldName: this.$T("spcm.common.model.common.telNum").$D("联系方式"),
          fieldCode: "telNum",
        },
        {
          fieldName: this.$T("spcm.common.model.common.address").$D("地址"),
          fieldCode: "address",
        },
      ];

      return columns;
    },
    getTermInfoColumns() {
      const columns = [
        {
          fieldName: this.$T("spcm.purchaseRequisitionCreation.model.termContent").$D("条款内容"),
          fieldCode: "termContent",
        },
        {
          fieldName: this.$T("spcm.purchaseRequisitionCreation.model.termRemark").$D("条款说明"),
          fieldCode: "remark",
        }
      ];

      return columns;
    },
    getSubjectDetailInfoColumns() {
      const columns = [
        {
          fieldName: this.$T("spcm.common.model.common.MaterialClassify").$D("物料分类"),
          fieldCode: "categoryName",
        },
        {
          fieldName: this.$T("spcm.common.model.specifications").$D("规格"),
          fieldCode: "specifications",
        },
        {
          fieldName: this.$T("spcm.common.model.common.model").$D("型号"),
          fieldCode: "model",
        },
        {
          fieldName: this.$T("spcm.common.model.common.unit").$D("单位"),
          fieldCode: "uomName",
        },
        {
          fieldName: this.$T("spcm.common.model.common.quantity").$D("数量"),
          fieldCode: "quantity",
        },
        {
          fieldName: this.$T("spcm.common.model.common.taxRate").$D("税率"),
          fieldCode: "taxRate",
        },
        {
          fieldName: this.$T("spcm.common.model.common.unitPriceBatch").$D("价格批量"),
          fieldCode: "unitPriceBatch",
        },
        {
          fieldName: this.$T("small.common.model.smallOrderQuantity").$D("最小起订量"),
          fieldCode: "attribute5",
        },
        {
          fieldName: this.$T("small.common.model.priceType").$D("价格类型"),
          fieldCode: "attribute1Meaning",
        },
        {
          fieldName: this.$T("spcm.common.currencyCode").$D("原币币种"),
          fieldCode: "currencyCode",
        },
        {
          fieldName: this.$T("spcm.common.model.common.purchaseCurrencyCode").$D("本币币种"),
          fieldCode: "purchaseCurrencyCode",
        },
        {
          fieldName: this.$T("spcm.common.model.common.exchangeRate").$D("汇率(本币:原币)"),
          fieldCode: "exchangeRate",
        },
        {
          fieldName: this.$T("spcm.common.model.common.purchasePriceTax").$D("进价(含税)"),
          fieldCode: "taxIncludedUnitPrice",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters["CalcMoney"](val)
        },
        {
          fieldName: this.$T("spcm.common.model.common.purchaseTaxIncludedPrice").$D("本币含税单价"),
          fieldCode: "purchaseTaxIncludedPrice",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters["CalcMoney"](val)
        },
        {
          fieldName: this.$T("spcm.common.model.common.purchasePriceNoTax").$D("进价(不含税)"),
          fieldCode: "unitPrice",
        },
        {
          fieldName: this.$T("spcm.common.model.common.PlatformForTax").$D("平台售价(含税)"),
          fieldCode: "attribute4",
        },
        {
          fieldName: this.$T("spcm.common.model.common.PlatformForNoTax").$D("平台售价(不含税)"),
          fieldCode: "attribute7",
        },
        {
          fieldName: this.$T("spcm.common.model.common.commissionRatio").$D("佣金比例"),
          fieldCode: "attribute10",
        },
        {
          fieldName: this.$T("spcm.common.model.common.taxIncludedLineAmount").$D("原币含税行金额"),
          fieldCode: "taxIncludedLineAmount",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters["CalcMoney"](val)
        },
        {
          fieldName: this.$T("spcm.common.model.common.purchaseTaxLineAmount").$D("本币含税行金额"),
          fieldCode: "purchaseTaxLineAmount",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters["CalcMoney"](val)
        },
        {
          fieldName: this.$T("spcm.common.model.uncludedTaxLineAmount").$D("原币不含税行金额"),
          fieldCode: "lineAmount",
        },
        {
          fieldName: this.$T("spcm.common.model.common.taxAmount").$D("原币税额"),
          fieldCode: "taxAmount",
        },
        {
          fieldName: this.$T("spcm.common.model.common.needByDate").$D("交付日期"),
          fieldCode: "deliverDate",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters["CalcDate"](val)
        },
        {
          fieldName: this.$T("spcm.common.model.common.export.itemPropertiesMeaning").$D("属性"),
          fieldCode: "itemPropertiesMeaning",
        },
        {
          fieldName: this.$T("hipspfm.workFlowAgrement.model.workFlowAgrement.remark").$D("备注"),
          fieldCode: "remark",
        }
      ];

      return columns;
    },
    getPartnerDetailInfoColumns() {
      const columns = [
        {
          fieldName: this.$T("spcm.common.model.common.partnerTypeName").$D("伙伴类型"),
          fieldCode: "partnerTypeName",
        },
        {
          fieldName: this.$T("spcm.common.model.common.partnerTypeCode").$D("伙伴类型编码"),
          fieldCode: "partnerTypeCode",
        },
        {
          fieldName: this.$T("spcm.common.model.common.legalRepName").$D("代表人"),
          fieldCode: "legalRepName",
        },
        {
          fieldName: this.$T("spcm.common.model.contractname").$D("联系人"),
          fieldCode: "contacts",
        },
        {
          fieldName: this.$T("spcm.common.model.common.telNum").$D("联系方式"),
          fieldCode: "telNum",
        },
        {
          fieldName: this.$T("spcm.common.model.common.faxes").$D("传真"),
          fieldCode: "faxes",
        },
        {
          fieldName: this.$T("spcm.common.model.common.address").$D("地址"),
          fieldCode: "address",
        },
        {
          fieldName: this.$T("spcm.common.model.common.bankName").$D("开户行名称"),
          fieldCode: "bankName",
        },
        {
          fieldName: this.$T("spcm.common.model.common.bankAccountName").$D("账户名称"),
          fieldCode: "bankAccountName",
        },
        {
          fieldName: this.$T("spcm.common.model.common.bankAccountNum").$D("银行账号"),
          fieldCode: "bankAccountNum",
        },
        {
          fieldName: this.$T("spcm.common.model.common.remark").$D("说明"),
          fieldCode: "remark",
        }
      ];

      return columns;
    },
    getNavArr() {
      return [
        {
          title: this.$T(
            "spcm.common.view.message.title.contractHeaderInformation"
          ).$D("协议信息"),
          ref: "headInfo"
        },
        {
          title: this.$T("spcm.common.view.message.title.contractSubject").$D(
            "协议标的"
          ),
          ref: "lineInfo"
        },
        {
          title: this.$T("spcm.common.view.message.title.contractStage").$D(
            "协议阶段"
          ),
          ref: "phaseInfo"
        },
        {
          title: this.$T(
            "spcm.common.view.message.title.partnerInformation"
          ).$D("伙伴信息"),
          ref: "partnerInfo"
        },
        {
          title: this.$T(
            "spcm.common.view.message.title.businessTermsInformation"
          ).$D("业务条款"),
          ref: "businessInfo"
        }
      ];
    }
  },
  watch: {
    navIndex(nVal) {
      if ([ 1, 2, 3, 4, 5 ].includes(nVal)) {
        this.offsetX = 90 * (nVal - 1);
      }
      this.navScroll.scrollTo(-this.offsetX, 0, 200, "bounce");
    }
  },
  async mounted() {
    if (this.changeReqId) {
      try {
        this.$loading.show();
        await this.getAgreementDetail();
        await this.getAgreement();
        await this.getAgreementPhase();
        await this.getAgreementPartner();
        await this.getAgreementProcurement();
        // this.loading = true;
        this.$loading.hide();
      } catch (err) {
        this.$loading.hide();
        console.log(err, "error");
      }
    }
    this.$emit("GetApprovalTitle", this.$T("hipspfm.workFlowAgrement.view.title.agrementApproval").$D("协议审批"));
    this.$nextTick(() => {
      this.navScroll = new BScroll(this.$refs.navWrap, {
        scrollX: true,
        click: true
      });
      this.scroll = new BScroll(this.$refs.wrapper, {
        scrollY: true,
        eventPassthrough: "horizontal",
        tap: true,
        probeType: 3
      });
      this.$refreshScroll();
      this.scroll.on("scroll", this.handlerScroll);
    });
  },
  methods: {
    // 显示表的信息详情
    showLineInfoDetail(data) {
      this.lineInfoDetail = data;
      setTimeout(() => {
        this.show = true;
      }, 200);
    },
    // 显示伙伴信息详情
    showPartnerInfo(data) {
      this.partnerInfo = data;
      setTimeout(() => {
        this.partnerInfoFlag = true;
      }, 200);
    },
    closeLineInfoDetail() {
      this.show = false;
    },
    closePartnerInfo() {
      this.partnerInfoFlag = false;
    },
    // 滚动事件
    handlerScroll({ x, y }) {
      this.$handlerScroll(x, y, this);
    },
    // 获取协议审批详情信息
    async getAgreementDetail() {
      await getAgreementDetailApi(this.changeReqId).then((res) => {
        this.headInfo = res || {};
        if (typeof this.headInfo.attribute1Meaning === "object") {
          this.moreAttribute1Meaning = Object.values(
            this.headInfo.attribute1Meaning
          ).join("/");
        }
        let attachmentUuid = this.headInfo.attachmentUuid || uuid();

        let purchaserAttachmentUuid = this.headInfo.purchaserAttachmentUuid || uuid();

        let supplierAttachmentUuid = this.headInfo.supplierAttachmentUuid || uuid();
        // this.$emit("GetAttachmentUuid", attachmentUuid);

        let FileArr = [
          {
            title: this.$T("spcm.common.view.btn.purchaserAttachment").$D("采购方附件"),
            attachmentUuid: purchaserAttachmentUuid,
            readOnly: true
          },
          {
            title: this.$T("spcm.common.view.message.comContractAttachment").$D("协议附件"),
            attachmentUuid: attachmentUuid,
            readOnly: true
          },
          {
            title: this.$T("sqam.inquiryHall.model.inquiryHall.supplierUuid").$D("供应商附件"),
            attachmentUuid: supplierAttachmentUuid,
            readOnly: true
          },
        ];

        this.$emit("GetAttachmentFileArr", FileArr);
      });
    },
    //获取协议标的信息
    async getAgreement() {
      await getAgreementApi(this.changeReqId).then((res) => {
        this.lineInfo = res.content;
      });
    },
    //获取协议阶段详情信息
    async getAgreementPhase() {
      await getAgreementPhaseApi(this.changeReqId).then((res) => {
        this.agreementPhaseInfo = res.content;
      });
    },
    //获取采购协议业务条款信息
    async getAgreementProcurement() {
      await getAgreementProcurementApi(this.changeReqId).then((res) => {
        this.agreementProcurementInfo = res.content;
      });
    },
    //获取伙伴信息
    async getAgreementPartner() {
      await getAgreementPartnerApi(this.changeReqId).then((res) => {
        this.agreementPartnerInfo = res;
      });
    }
  }
};
</script>

<style lang="stylus" scoped>
.blackFont {
  color: var(--color-font-default, #1b1e2b);
}

.closeFont {
  color: var(--color-font-default-c) !important;
  border-color: var(--color-font-default-c) !important;
}

.mainDetail {
  .navWrap {
    width: 100%;
    height: 44px;
    overflow: hidden;
    position: relative;
    z-index: 999;

    .navContent {
      width: 150%;
      height: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: center;

      li {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: var(--color-font-default-b);
        letter-spacing: 0;
        text-align: center;
        line-height: 24px;
        text-align: center;
        position: relative;
        margin-left: 20px;

        &.active {
          font-size: 16px;
          color: var(--color-font-default, #1b1e2b);
        }

        &.active::before {
          position: absolute;
          left: 0;
          bottom: -10px;
          width: 100%;
          height: 2px;
          background-color: var(--color-other-default-b);
          content: '';
        }
      }
    }
  }

  .contentWrap {
    font-family: PingFangSC-Medium;
    height: calc(100vh - 137px);
    overflow: hidden;

    .content {
      .infoContent {
        h3 {
          padding: 20px 53px 12px 15px;
          font-family: PingFangSC-Medium;
          font-size: 18px;
          color: var(--color-font-default, #1b1e2b);
          line-height: 26px;
          font-weight: 700;
          background: var(--color-bg-default-b);
        }

        .input-edit {
          margin-top: 18px;
          width: 16px;
          height: 16px;
        }
      }
    }
  }
}

.lineInfoDetail {
  background: #FAFBFC;
  height: 100%;

  .header {
    font-size: 18px;
    color: var(--color-font-default, #1b1e2b);
    text-align: center;
    line-height: 26px;
    font-weight: bold;
  }

  .lineHead {
    padding: 8px 20px 12px;
    background-color: var(--color-font-default-d);
    font-family: 'PingFangSC-Medium';
    color: var(--color-font-default, #1b1e2b);
    font-size: 16px;
    line-height: 24px;
    border-bottom: 8px solid #F0F2F5;

    li {
      padding: 0;
      margin-bottom: 9px;
      height: 24px;
      display: flex;
      color: #C6CAD6;
    }

    p {
      span {
        color: var(--color-font-default, #1b1e2b);
        line-height: 24px;
        font-size: 16px;
        font-weight: 600;
      }
    }
  }

  .lineHead :nth-child(2) {
    margin-bottom: 8px;
  }

  .lineBody {
    background-color: var(--color-font-default-d);
    height: calc(100vh - 160px);
    overflow: auto;

    ul {
      padding-left: 5.333vw;

      li {
        border-bottom: 1px solid var(--color-border-default);
        display: flex;
        flex-direction: column;
        padding: 13px 20px 11px 0;

        span:nth-child(1) {
          font-family: PingFangSC-Medium;
          font-size: 12px;
          color: var(--color-font-default-b);
          line-height: 20px;
          margin-bottom: 8px;
          word-break: break-all;
        }

        span:nth-child(2) {
          font-family: PingFangSC-Regular;
          font-size: 16px;
          color: var(--color-font-default);
          line-height: 24px;
          min-height: 24px;
          word-break: break-all;
        }
      }
    }
  }
}

.detail-info {
  .sub-title {
    width: 100%;
    padding: 16px 20px;
    line-height: 22px;
    font-size: 14px;
    color: var(--color-font-default, #1b1e2b);
    font-weight: bold;
    background: #FBFCFE;
    border-top: 1px solid var(--color-border-default);
  }

  ul {
    padding-left: 5.333vw;

    li {
      border-bottom: 1px solid var(--color-border-default);
      display: flex;
      flex-direction: column;
      padding: 13px 20px 11px 0;

      span:nth-child(1) {
        font-family: PingFangSC-Medium;
        font-size: 12px;
        color: var(--color-font-default-b);
        line-height: 20px;
        margin-bottom: 8px;
        word-break: break-all;
      }

      span:nth-child(2) {
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: var(--color-font-default);
        line-height: 24px;
        min-height: 24px;
        word-break: break-all;
      }
    }

    .language-attachment {
      img {
        width: 16px;
        height: 16px;
        margin-top: 4px;
        float: right;
      }
    }
  }
}

.card-info {
  .card {
    padding-left: 20px;
    color: #666666;
    background: var(--color-bg-default);
    border-bottom: 8px solid var(--color-border-default);

    div {
      display: flex;
      justify-content: space-between;
      height: 50px;
      line-height: 50px;
      padding-right: 20px;
      border-bottom: 1px solid var(--color-border-default);

      .code {
        text-align: left;
        font-size: 16px;
        color: var(--color-font-default, #1b1e2b);
        font-weight: bold;

        span {
          display: inline-block;
          width: 6px;
          height: 14px;
          background: var(--color-other-default-b);
          border-radius: 1px;
          margin-right: 8px;
        }
      }

      .noWrap {
        width: 260px;
      }

      .head-num, .line-num {
        span {
          font-size: 14px;
          color: #C6CAD6;
        }
      }
    }

    ul {
      padding-right: 20px;

      li {
        display: flex;
        justify-content: space-between;
        line-height: 32px;
        height: 32px;
        margin-top: 2px;
        font-size: 14px;
        color: var(--color-font-default, #1b1e2b);

        &:first-child, &:last-child {
          margin-top: 8px;
        }

        > span {
          flex: 1;
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: var(--color-font-default, #1b1e2b);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;

          .fileBtn {
            color: var(--color-other-default-b);
          }
        }

        > span:nth-child(odd) {
          text-align: left;
        }

        &:last-child {
          height: 46px;
          line-height: 46px;
          border-top: 1px solid var(--color-border-default);

          span:nth-child(1) {
            font-weight: bold;
          }

          span:nth-child(2) {
            color: var(--color-other-default);
          }
        }
      }
    }
  }
}

.invite {
  width: 100%;
  background: var(--color-bg-default);
  position: fixed;
  bottom: 0;
  padding: 0 !important;
  line-height: 49px;
  height: calc(49px + constant(safe-area-inset-bottom));
  height: calc(49px + env(safe-area-inset-bottom));
  font-size: 18px;
  color: var(--color-other-default-b);
  box-shadow: 0 -2px 12px 0 rgba(27, 30, 43, 0.05);
  display: flex;

  span {
    width: 100%;
    text-align: center;
  }
}

.card-personalized {
  width: 100%;
  color: #666666;
  padding 12px 15px;
  background: var(--color-bg-default);

  .card-first-single{
    text-align: left;
    font-size: 16px;
    color: var(--color-font-default, #1b1e2b);
    font-weight: bold;
    padding: 12px 0;
  }

  .card-first-between{
    display: flex;
    justify-content: space-between;
    padding: 12px 0;

    .line-code {
      text-align: left;
      font-size: 16px;
      color: var(--color-font-default, #1b1e2b);
      font-weight: bold;
    }

    .line-num {
      font-size: 14px;
      color: #C6CAD6;
    }
  }
}
</style>
