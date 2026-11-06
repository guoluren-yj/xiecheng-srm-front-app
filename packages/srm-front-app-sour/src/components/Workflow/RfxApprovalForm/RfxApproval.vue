<template>
  <div>
    <section class="headStyle">
      <div style="display: flex; justify-content: space-between">
        <span>{{ headInfo.rfxNum }}</span>
        <span>{{ $T("ssrc.bidHall.model.bidHall.roundNumber").$D("轮次") }}：{{
          headInfo.roundNumber
        }}</span>
      </div>
      <div>
        <span>{{ headInfo.rfxTitle }}</span>
      </div>
    </section>
    <section v-if="headInfo" class="mainDetail">
      <!-- 内容区 -->
      <srm-scroll-tab class="content">
        <!-- 基础信息 -->
        <srm-scroll-tab-item
          :label="$T('ssrc.bidHall.view.message.tab.baseInfos').$D('基础信息')">
          <div class="content-item">
            <div
              v-if="JSON.stringify(!headInfo.rfxHeaderId) === '{}'"
              class="noContent">
              <span>{{
                $T("hipspfm.workFlow.view.message.noCheckPriceInfo").$D(
                  "暂无信息"
                )
              }}</span>
            </div>
            <div v-else>
              <customize
                :columns="getColumns"
                :data-source="headInfo"
                type="list"
                :need-padding="true"
                code="SMBL.WORKFLOW.RFX_APPROVAL.BASIC"/>
            </div>
          </div>
        </srm-scroll-tab-item>
        <!-- 寻源规则 -->
        <srm-scroll-tab-item
          :label="
            $T('ssrc.inquiryHall.view.message.panel.rfxRules').$D('寻源规则')
          ">
          <div class="content-item">
            <div
              v-if="JSON.stringify(!headInfo.rfxHeaderId) === '[]'"
              class="noContent">
              <span>{{
                $T("hipspfm.workFlow.view.message.noCheckPriceInfo").$D(
                  "暂无信息"
                )
              }}</span>
            </div>
            <div v-else>
              <customize
                :columns="getRfxRuleColumns"
                :data-source="headInfo"
                type="list"
                :need-padding="true"
                code="SMBL.WORKFLOW.RFX_APPROVAL.RULE"/>
            </div>
          </div>
        </srm-scroll-tab-item>
        <!-- 资格预审 -->
        <srm-scroll-tab-item
          v-if="headInfo.preQualificationFlag"
          :label="
            $T('ssrc.bidHall.view.message.tab.preQualification').$D('资格预审')
          ">
          <div class="content-item">
            <div
              v-if="JSON.stringify(!headInfo.rfxHeaderId) === '[]'"
              class="noContent">
              <span>{{
                $T("hipspfm.workFlow.view.message.noCheckPriceInfo").$D(
                  "暂无信息"
                )
              }}</span>
            </div>
            <div v-else>
              <customize
                :columns="getQualificationColumns"
                :data-source="headInfo"
                type="list"
                :need-padding="true"
                code="SMBL.WORKFLOW.RFX_APPROVAL.PREQUALIFICATION"/>
            </div>
          </div>
        </srm-scroll-tab-item>
        <!-- 专家 -->
        <srm-scroll-tab-item
          v-if="headInfo.expertScoreType === 'ONLINE'"
          :label="$T('ssrc.bidHall.view.message.tab.professional').$D('专家')">
          <div v-if="expertInfo" class="card">
            <div
              v-for="(item, key) in expertInfo"
              :key="key">
              <customize
                :columns="getExpertColumns"
                :data-source="item"
                type="list"
                :need-padding="false"
                code="SMBL.WORKFLOW.RFX_APPROVAL.EXPERT"/>
            </div>
          </div>
        </srm-scroll-tab-item>
        <!-- 评分要素 -->
        <srm-scroll-tab-item
          v-if="headInfo.expertScoreType === 'ONLINE'"
          :label="
            $T('ssrc.bidHall.view.message.tab.scoringElements').$D('评分要素')
          ">
          <div
            v-if="
              indicsInfo.businessIndicList &&
                indicsInfo.businessIndicList.length > 0
            "
            class="card">
            <div
              v-for="(item, key) in indicsInfo.businessIndicList"
              :key="key">
              <customize
                :columns="getScoreColumns('businessTeam')"
                :data-source="item"
                type="list"
                :need-padding="false"
                code="SMBL.WORKFLOW.RFX_APPROVAL.SCORE"/>
            </div>
          </div>
          <div
            v-if="
              indicsInfo.technologyIndicList &&
                indicsInfo.technologyIndicList.length > 0
            "
            class="card">
            <div
              v-for="(item, key) in indicsInfo.technologyIndicList"
              :key="key">
              <customize
                :columns="getScoreColumns('technologyTeam')"
                :data-source="item"
                type="list"
                :need-padding="false"
                code="SMBL.WORKFLOW.RFX_APPROVAL.SCORE"/>
            </div>
          </div>
          <div
            v-if="
              indicsInfo.otherIndicList && indicsInfo.otherIndicList.length > 0
            "
            class="card">
            <div
              v-for="(item, key) in indicsInfo.otherIndicList"
              :key="key">
              <customize
                :columns="getScoreColumns()"
                :data-source="item"
                type="list"
                :need-padding="false"
                code="SMBL.WORKFLOW.RFX_APPROVAL.SCORE"/>
            </div>
          </div>
        </srm-scroll-tab-item>
        <!-- 物料明细 -->
        <srm-scroll-tab-item
          :label="
            $T('hipspfm.workFlow.view.message.itemLineInfo').$D('物料明细')
          ">
          <div v-if="!itemInfo.length" class="noContent">
            <span>{{
              $T("hipspfm.common.view.message.title.noData").$D("暂无数据")
            }}</span>
          </div>
          <div v-else class="card">
            <div v-for="(item, index) in itemInfo" :key="index">
              <customize
                :columns="getItemColumns"
                :data-source="item"
                type="list"
                :need-padding="false"
                code="SMBL.WORKFLOW.RFX_APPROVAL.ITEM"/>
            </div>
          </div>
        </srm-scroll-tab-item>
        <!-- 供应商 -->
        <srm-scroll-tab-item
          :label="$T('ssrc.bidHall.modal.question.supplier').$D('供应商')">
          <div v-if="!supplierInfo.length" class="noContent">
            <span>{{
              $T("hipspfm.common.view.message.title.noData").$D("暂无数据")
            }}</span>
          </div>
          <div v-else class="card">
            <div v-for="(item, index) in supplierInfo" :key="index">
              <customize
                :columns="getSupplierColumns"
                :data-source="item"
                type="list"
                :need-padding="false"
                code="SMBL.WORKFLOW.RFX_APPROVAL.SUPPLIER"/>
            </div>
          </div>
        </srm-scroll-tab-item>
      </srm-scroll-tab>
    </section>
    <!-- 专家信息详情弹窗 -->
    <supplier-info
      v-model="expertInfoPop"
      date-type="expert"
      :experts-assign-info="expertsAssignInfo"/>
    <!-- 供应商信息详情弹窗 -->
    <supplier-info
      v-model="supplierInfoPop"
      date-type="supplier"
      :supplier-assign-info="supplierAssignInfo"/>
    <!-- 寻源小组弹窗 -->
    <rfx-member
      v-model="rfxMemberPopup"
      :rfx-header="headInfo"
      @onclose="showRfxMember"/>
  </div>
</template>

<script>
import {
  getRfxItemsOld,
  getRfxHeaderOld,
  getRfxIndicsOld,
  getRfxExpertsOld,
  getRfxSuppliersOld,
  getSupplierAssignedApiOld,
} from "./api/RfxApproveApi";
import uuid from "uuid";
import { queryDoubleUnit } from "@/utils/utils";
import RfxMember from "./components/RfxMember";
import SupplierInfo from "@/components/BidDetail/SupplierInfo";
//oldBidDetail import { getExpertAssignedApi } from "../../../common/BidDetail/api";
import { getExpertAssignedApi } from "./api";
import { getUomName, getQtyName } from "@/utils/doubleUnit";
export default {
  modules: [
    "ssrc.bidHall",
    "hipspfm.workFlow",
    "ssrc.inquiryHall",
    "ssrc.score",
    "hipspfm.common",
    "ssrc.common",
    "ssrc.bidConfirm",
    "ssrc.sourceTemplate",
    "ssrc.supplierQuotation",
    "sslm.commonApplication",
  ],
  name: "RfxApproval",
  components: {
    RfxMember,
    SupplierInfo,
  },
  filters: {},
  props: {
    parameters: {
      type: Object,
      default: () => ({}),
    },
    showFilePop: {
      type: Function,
    },
    changeReqId: {
      type: String | Number,
      default: "",
    },
  },
  data() {
    return {
      headInfo: {},
      itemInfo: [],
      supplierInfo: [],
      indicsInfo: {},
      expertInfo: {},
      lengthArr: [],
      contentLenArr: [],
      uuid: "",
      expertsAssignInfo: [],
      expertInfoPop: false,
      supplierAssignInfo: [],
      supplierInfoPop: false,
      rfxMemberPopup: false,
      doubleUnitFlag: false, // 判断是否开启双单位
    };
  },
  computed: {
    getColumns() {
      const columns = [
        {
          fieldName: this.$T("ssrc.common.model.common.company").$D("公司"),
          fieldType: "TEXT",
          fieldCode: "companyName",
          formRow: 1,
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.purceOrgName").$D(
            "采购组织名称"
          ),
          fieldType: "TEXT",
          fieldCode: "purOrganizationName",
          formRow: 2,
        },
        {
          fieldName: this.$T("ssrc.common.model.common.unitName").$D(
            "需求部门"
          ),
          fieldType: "TEXT",
          fieldCode: "unitName",
          formRow: 3,
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.createdUnitName").$D(
            "创建人部门"
          ),
          fieldType: "TEXT",
          fieldCode: "createdUnitName",
          formRow: 3,
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.purchaseAgentName").$D(
            "采购员"
          ),
          fieldType: "TEXT",
          fieldCode: "purchaserName",
          formRow: 4,
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.totalBudget").$D(
            "预算金额"
          ),
          fieldType: "INPUT_NUMBER",
          editor: false,
          precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision")),
          fieldCode: "budgetAmount",
          formRow: 4,
        },
        {
          fieldName: this.$T("ssrc.bidHall.modal.inEnquiryHall.currency").$D(
            "币种"
          ),
          fieldType: "TEXT",
          fieldCode: "currencyCodeMeaning",
          formRow: 5,
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.paymentType").$D(
            "付款方式"
          ),
          fieldType: "TEXT",
          fieldCode: "paymentTypeName",
          formRow: 5,
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.paymentTerm").$D(
            "付款条款"
          ),
          fieldType: "TEXT",
          fieldCode: "paymentTermName",
          formRow: 6,
        },
        {
          fieldName: this.$T(
            "ssrc.inquiryHall.model.inquiryHall.sourcingType"
          ).$D("寻源类型"),
          fieldType: "TEXT",
          fieldCode: "sourceTypeMeaning",
          formRow: 7,
        },
        {
          fieldName: this.$T(
            "ssrc.inquiryHall.model.inquiryHall.priceCategory"
          ).$D("价格类型"),
          fieldType: "TEXT",
          fieldCode: "priceCategoryMeaning",
          formRow: 7,
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.bidBond").$D("保证金"),
          fieldType: "TEXT",
          fieldCode: "bidBond",
          formRow: 8,
        },
        {
          fieldName: this.$T(
            "ssrc.inquiryHall.model.inquiryHall.centralPurchaseFlag"
          ).$D("是否集采"),
          fieldType: "TEXT",
          fieldCode: "centralPurchaseFlag",
          formRow: 8,
          render: (val) =>
            val ?
              this.$T("hipspfm.common.status.yes").$D("是") :
              this.$T("hipspfm.common.status.no").$D("否"),
        },
        {
          fieldName: this.$T("ssrc.bidConfirm.model.common.remark").$D("备注"),
          fieldType: "TEXT",
          fieldCode: "rfxRemark",
          formRow: 9,
        },
        {
          fieldName: this.$T(
            "ssrc.inquiryHall.model.inquiryHall.inquiryGroup"
          ).$D("寻源小组"),
          fieldType: "TEXT",
          fieldCode: "inquiryGroup",
          formRow: 9,
          render: () =>
            <span style="color: blue">{this.$T(
              "ssrc.bidHall.view.message.button.view"
            ).$D("查看")}</span>,
          callBack: () => {
            this.showRfxMember();
          },
        },
        {
          fieldName: this.$T(
            "ssrc.inquiryHall.model.inquiryHall.remarkInside"
          ).$D("备注(内部)"),
          fieldType: "TEXT",
          fieldCode: "internalRemark",
          formRow: 10,
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.techAttachments").$D(
            "技术附件"
          ),
          fieldType: "TEXT",
          fieldCode: "techAttachments",
          formRow: 11,
          render: (val, record) =>
            <SrmUpload
              showIcon={false}
              color="blue"
              descTitle={this.$T("ssrc.bidHall.view.message.button.view").$D(
                "查看"
              )}
              attachmentUuid={record.techAttachmentUuid}
            />
          ,
        },
        {
          fieldName: this.$T(
            "ssrc.bidHall.model.bidHall.businessAttachments"
          ).$D("商务附件"),
          fieldType: "TEXT",
          fieldCode: "techAttachments",
          formRow: 11,
          render: (val, record) =>
            <SrmUpload
              showIcon={false}
              color="blue"
              descTitle={this.$T("ssrc.bidHall.view.message.button.view").$D(
                "查看"
              )}
              attachmentUuid={record.businessAttachmentUuid}
            />
          ,
        },
      ];
      return columns;
    },
    getRfxRuleColumns() {
      const columns = [
        {
          fieldName: this.$T(
            "ssrc.inquiryHall.modal.inquiryHall.sourcingTemplate"
          ).$D("寻源模板"),
          fieldType: "TEXT",
          fieldCode: "templateName",
          formRow: 1,
        },
        {
          fieldName: this.$T("ssrc.common.model.common.sourcingCategory").$D(
            "寻源类别"
          ),
          fieldType: "TEXT",
          fieldCode: "sourceCategoryMeaning",
          formRow: 2,
          render: (_, record) => record.secondarySourceCategoryMeaning || record.sourceCategoryMeaning || "-"
        },
        {
          fieldName: this.$T("ssrc.common.model.common.sourcingApproach").$D(
            "寻源方式"
          ),
          fieldType: "TEXT",
          fieldCode: "sourceMethodMeaning",
          formRow: 3,
        },
        {
          fieldName: this.$T(
            "ssrc.sourceTemplate.model.template.qualificationType"
          ).$D("资格审查"),
          fieldType: "TEXT",
          fieldCode: "qualificationTypeMeaning",
          formRow: 4,
        },
        {
          fieldName: this.$T(
            "ssrc.inquiryHall.model.inquiryHall.expertEvaluation"
          ).$D("专家评分"),
          fieldType: "TEXT",
          fieldCode: "expertScoreTypeMeaning",
          formRow: 5,
        },
        {
          fieldName: this.$T(
            "ssrc.sourceTemplate.model.template.openBidOrder"
          ).$D("评标步制"),
          fieldType: "TEXT",
          fieldCode: "openBidOrderMeaning",
          formRow: 5,
        },
        {
          fieldName: this.$T(
            "ssrc.sourceTemplate.model.template.quotationType"
          ).$D("报价方式"),
          fieldType: "TEXT",
          fieldCode: "quotationTypeMeaning",
          formRow: 6,
        },
        {
          fieldName: this.$T(
            "ssrc.sourceTemplate.model.template.quotationScope"
          ).$D("报价范围"),
          fieldType: "TEXT",
          fieldCode: "quotationScopeMeaning",
          formRow: 6,
        },
        {
          fieldName: this.$T("ssrc.common.auctionDirection").$D("报价方向"),
          fieldType: "TEXT",
          fieldCode: "auctionDirectionMeaning",
          formRow: 7,
        },
        {
          fieldName: this.$T(
            "ssrc.inquiryHall.model.inquiryHall.sealedQuotation"
          ).$D("密封报价"),
          fieldType: "TEXT",
          fieldCode: "sealedQuotationFlag",
          formRow: 7,
          render: (val) =>
            val ?
              this.$T("hipspfm.common.status.yes").$D("是") :
              this.$T("hipspfm.common.status.no").$D("否"),
        },
        {
          fieldName: this.$T(
            "ssrc.inquiryHall.model.inquiryHall.minQuotedSupplier"
          ).$D("最少报价供应商数"),
          fieldType: "TEXT",
          fieldCode: "minQuotedSupplier",
          formRow: 8,
        },
      ];
      return columns;
    },
    getQualificationColumns() {
      const columns = [
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.prequalEndDate").$D(
            "预审截止时间"
          ),
          fieldType: "TEXT",
          fieldCode: "prequalEndDate",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.reviewMethod").$D(
            "审查方法"
          ),
          fieldType: "TEXT",
          fieldCode: "reviewMethodMeaning",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.qualifiedLimit").$D(
            "合格上限"
          ),
          fieldType: "TEXT",
          fieldCode: "qualifiedLimit",
        },
        {
          fieldName: this.$T(
            "ssrc.bidHall.model.bidHall.prequalFileExpense"
          ).$D("预审文件费"),
          fieldType: "TEXT",
          fieldCode: "prequalFileExpense",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.prequalLocation").$D(
            "申请提交地点"
          ),
          fieldType: "TEXT",
          fieldCode: "prequalLocation",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.prequalFile").$D(
            "资格预审文件"
          ),
          fieldType: "TEXT",
          fieldCode: "prequalFile",
          render: (val, record) =>
            <SrmUpload
              showIcon={false}
              color="blue"
              descTitle={this.$T("ssrc.bidHall.view.message.button.view").$D(
                "查看"
              )}
              attachmentUuid={record.prequalAttachmentUuid}
            />
          ,
        },
      ];
      return columns;
    },
    getExpertColumns() {
      const columns = [
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.expertName").$D("专家名称"),
          fieldType: "EMPTY",
          fieldCode: "expertName",
          render: (val, record) =>
            <SrmListHeader>
              <span>
                {this.$T("ssrc.bidHall.model.scoring.expertName").$D("姓名")}：
                {val}
              </span>
              <div slot="right">
                {record.evaluateLeaderFlagMeaning &&
                  <span class="name-tag">
                    {record.evaluateLeaderFlagMeaning}
                  </span>
                }
              </div>
            </SrmListHeader>
          ,
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.userName").$D("用户名"),
          fieldType: "TEXT",
          fieldCode: "loginName",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.expertType").$D("专家类型"),
          fieldType: "TEXT",
          fieldCode: "expertTypeMeaning",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.expertLevel").$D("专家级别"),
          fieldType: "TEXT",
          fieldCode: "expertLevelMeaning",
        },
      ];
      return columns;
    },
    getItemColumns() {
      const columns = [
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.lineNo").$D("行号"),
          fieldType: "TEXT",
          fieldCode: "rfxLineItemNum",
          formRow: 1,
        },
        {
          fieldName: this.$T("ssrc.bidHall.modal.inqueryHall.demandDate").$D(
            "需求日期"
          ),
          fieldType: "TEXT",
          fieldCode: "demandDate",
          formRow: 1,
          // eslint-disable-next-line new-cap
          render: (val) => this.$options.filters.CalcDate(val),
        },
        {
          fieldName: this.$T("ssrc.bidHall.modal.inqueryHall.itemCode").$D(
            "物料编码"
          ),
          fieldType: "TEXT",
          fieldCode: "itemCode",
          formRow: 2,
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.itemName").$D(
            "物料名称"
          ),
          fieldType: "TEXT",
          fieldCode: "itemName",
          formRow: 3,
        },
        this.doubleUnitFlag ? {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.quantity").$D(
            "需求数量"
          ),
          fieldType: "INPUT_NUMBER",
          editor: false,
          fieldCode: "secondaryQuantity",
          formRow: 4,
        } : null,
        this.doubleUnitFlag ? {
          fieldName: this.$T("ssrc.bidHall.modal.inqueryHall.unit").$D("单位"),
          fieldType: "TEXT",
          fieldCode: "secondaryUomName",
          formRow: 4,
        } : null,
        {
          fieldName: getQtyName(this.doubleUnitFlag),
          fieldType: "INPUT_NUMBER",
          editor: false,
          fieldCode: "rfxQuantity",
          formRow: 4,
        },
        {
          fieldName: getUomName(this.doubleUnitFlag),
          fieldType: "TEXT",
          fieldCode: "uomName",
          formRow: 4,
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.taxRate").$D("税率"),
          fieldType: "TEXT",
          fieldCode: "taxRate",
          formRow: 5,
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.costPrice").$D(
            "标底单价"
          ),
          fieldType: "INPUT_NUMBER",
          editor: false,
          fieldCode: "costPrice",
          formRow: 5,
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.itemCategory").$D(
            "物料类别"
          ),
          fieldType: "TEXT",
          fieldCode: "itemCategoryName",
          formRow: 6,
        },
        {
          fieldName: this.$T("ssrc.bidHall.modal.inqueryHall.businessUnit").$D(
            "业务实体"
          ),
          fieldType: "TEXT",
          fieldCode: "ouName",
          formRow: 7,
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.inventoryOrg").$D(
            "库存组织"
          ),
          fieldType: "TEXT",
          fieldCode: "invOrganizationName",
          formRow: 8,
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.prNum").$D(
            "采购申请号"
          ),
          fieldType: "TEXT",
          fieldCode: "prNum",
          formRow: 9,
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.lineNum").$D(
            "采购申请行号"
          ),
          fieldType: "TEXT",
          fieldCode: "prLineNum",
          formRow: 10,
        },
        {
          fieldName: this.$T(
            "ssrc.supplierQuotation.model.supQuo.InquiryAttachment"
          ).$D("询价单附件"),
          fieldType: "TEXT",
          fieldCode: "attachmentUuid",
          formRow: 11,
          render: (val, record) =>
            <SrmUpload
              showIcon={false}
              color="blue"
              descTitle={this.$T("ssrc.bidHall.view.message.button.view").$D(
                "查看"
              )}
              attachmentUuid={record.attachmentUuid}
            />
          ,
        },
        {
          fieldName: this.$T("ssrc.bidHall.modal.question.supplier").$D(
            "供应商"
          ),
          fieldType: "TEXT",
          fieldCode: "supplier",
          formRow: 12,
          render: () =>
            <span style="color: blue">{this.$T(
              "ssrc.bidHall.model.bidHall.viewSupplier"
            ).$D("查看供应商")}</span>,
          callBack: (record) => {
            this.getSupplierAssigned(record.rfxLineItemId);
          },
        },
      ];
      return columns;
    },
    getSupplierColumns() {
      const columns = [
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.supplierCode").$D(
            "编码"
          ),
          fieldType: "TEXT",
          fieldCode: "supplierCompanyNum",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.queryRfq.contactName").$D(
            "联系人"
          ),
          fieldType: "TEXT",
          fieldCode: "contactName",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.contactPhone").$D(
            "手机号"
          ),
          fieldType: "TEXT",
          fieldCode: "contactMobilephone",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.contactMail").$D(
            "邮箱"
          ),
          fieldType: "TEXT",
          fieldCode: "contactMail",
        },
      ];
      return columns;
    },
  },
  async mounted() {
    if (this.changeReqId) {
      try {
        this.$loading.show();
        this.doubleUnitFlag = await queryDoubleUnit({
          businessModule: "RFX",
        });
        await this.fetchData();
        await this.fetchItems();
        await this.fetchExpert();
        await this.fetchIndics();
        await this.fetchSupplier();
      } catch (err) {
        // console.log(err, "error");
      } finally {
        this.$loading.hide();
      }
    }
    this.$emit(
      "GetApprovalTitle",
      this.$T("ssrc.bidHall.title.rfx.release.approve").$D("询价单发布审批")
    );
    this.uuid = uuid();
  },
  methods: {
    getScoreColumns(type) {
      const columns = [
        {
          fieldType: "EMPTY",
          fieldCode: "businessTeam",
          render: () => {
            if (type === "businessTeam") {
              return (
                <SrmListHeader>
                  <span>
                    {this.$T("ssrc.bidHall.model.bidHall.businessTeam").$D(
                      "商务组"
                    )}
                  </span>
                  <div slot="right">
                    <span class="percent">
                      {this.$T("ssrc.score.model.score.businessWeight").$D(
                        "评分权重"
                      )}
                      : {this.indicsInfo.businessIndicList[0].businessWeight}%
                    </span>
                  </div>
                </SrmListHeader>
              );
            } else if (type === "technologyTeam") {
              return (
                <SrmListHeader>
                  <span>
                    {this.$T("ssrc.bidHall.model.bidHall.technologyTeam").$D(
                      "技术组"
                    )}
                  </span>
                  <div slot="right">
                    <span class="percent">
                      {this.$T("ssrc.score.model.score.technologyWeight").$D(
                        "评分权重"
                      )}
                      : {this.indicsInfo.businessIndicList[0].businessWeight}%
                    </span>
                  </div>
                </SrmListHeader>
              );
            }
            return null;
          },
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.indicateCode").$D(
            "要素编码"
          ),
          fieldType: "TEXT",
          fieldCode: "indicateCode",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.indicateType").$D(
            "要素类型"
          ),
          fieldType: "TEXT",
          fieldCode: "indicateTypeMeaning",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.indicateName").$D(
            "评分要素"
          ),
          fieldType: "TEXT",
          fieldCode: "indicateName",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.scoreDetails").$D(
            "评分细则"
          ),
          fieldType: "TEXT",
          fieldCode: "indicateRemark",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.minScore").$D(
            "最低分"
          ),
          fieldType: "TEXT",
          fieldCode: "minScore",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.maxScore").$D(
            "最高分"
          ),
          fieldType: "TEXT",
          fieldCode: "maxScore",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.weight").$D("权重"),
          fieldType: "TEXT",
          fieldCode: "weight",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.expertAssign").$D(
            "专家分配"
          ),
          fieldType: "TEXT",
          fieldCode: "expertAssign",
          render: (_, item) => item.assignedEvaluateExperts,
          // render: () =>
          //   <span style="color: blue">{this.$T(
          //     "ssrc.bidHall.view.message.button.view"
          //   ).$D("查看")}</span>,
          // callBack: (record) => {
          //   this.showExpertInfo(record.team, record.evaluateIndicId);
          // },
        },
      ];
      return columns;
    },
    showRfxMember() {
      this.rfxMemberPopup = !this.rfxMemberPopup;
    },
    async getSupplierAssigned(lineId) {
      await getSupplierAssignedApiOld(this.headInfo.rfxHeaderId, lineId).then(
        (res) => {
          this.supplierAssignInfo = res;
          this.supplierInfoPop = true;
        }
      );
    },
    //获取询价单专家分配信息
    async showExpertInfo(team, evaluateIndicId) {
      await getExpertAssignedApi(
        team,
        evaluateIndicId,
        this.headInfo.rfxHeaderId
      ).then((res) => {
        this.expertsAssignInfo = res;
        this.expertInfoPop = true;
      });
    },
    async fetchSupplier() {
      const params = {
        page: 0,
        size: 10,
      };
      await getRfxSuppliersOld(this.changeReqId, params).then((res) => {
        this.supplierInfo = res.content;
      });
    },
    //获取询价单专家信息
    async fetchExpert() {
      await getRfxExpertsOld(this.changeReqId).then((res) => {
        this.expertInfo = res.evaluateExpertList;
      });
    },
    async fetchIndics() {
      await getRfxIndicsOld(this.changeReqId).then((res) => {
        this.indicsInfo = res;
      });
    },
    async fetchData() {
      await getRfxHeaderOld(this.changeReqId).then((res) => {
        this.headInfo = res;
      });
    },
    async fetchItems() {
      const params = {
        page: 0,
        size: 1000,
        customizeUnitCode: "SSRC.INQUIRY_HALL_DETAIL.ITEM_LINE",
      };
      await getRfxItemsOld(this.changeReqId, params).then((res) => {
        this.itemInfo = res.content;
      });
    },
  },
};
</script>

<style scoped lang="stylus">
.headStyle {
  padding: 10px 20px 16px 20px;
  border-bottom: solid 8px var(--color-border-default);
  font-weight: bold;

  span {
    line-height: 24px;
    font-size: 16px;
    display: inline-block;
    color: var(--color-font-default);
  }
}

.name-tag {
  font-size: 10px !important;
  color: var(--color-other-default-b) !important;
  // height: 20px;
  // line-height: 20px;
  padding: 0 4px !important;
  // display: inline-block;
  background: var(--color-bg-default-c) !important;
  border-radius: 2px !important;
  margin-right: 16px !important;
  flex: none !important;

  &:nth-child(2) {
    margin-left: 12px;
  }
}

.percent {
  font-size: 16px;
  color: var(--color-other-default-c);
  text-align: right;
}

.mainDetail {
  .content {
    .card {
      box-sizing: border-box;
      padding: 16px 15px 16px 15px;
    }
  }
}

.noContent {
  text-align: center;
  padding: 20px 0;
}
</style>
