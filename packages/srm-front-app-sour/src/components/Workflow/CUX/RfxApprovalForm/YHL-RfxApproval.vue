<template>
  <div>
    <section class="headStyle">
      <div style="display: flex;justify-content: space-between">
        <span>{{ headInfo.rfxNum }}</span>
        <span>{{ $T("ssrc.bidHall.model.bidHall.roundNumber").$D("轮次") }}：{{ headInfo.roundNumber }}</span>
      </div>
      <div>
        <span>{{ headInfo.rfxTitle }}</span>
      </div>
    </section>
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
          <!-- 基础信息 -->
          <div ref="headInfo" class="infoContent headInfo last-no-border">
            <h3>{{ $T("ssrc.bidHall.view.message.tab.baseInfos").$D("基础信息") }}</h3>
            <div v-if="!headInfo.rfxHeaderId" class="noContent">
              <span>{{ $T("hipspfm.workFlow.view.message.noCheckPriceInfo").$D("暂无信息") }}</span>
            </div>
            <div v-else>
              <ul>
                <li>
                  <span>{{ $T("ssrc.common.model.common.company").$D("公司") }}：{{ headInfo.companyName }}</span>
                </li>
                <li>
                  <span>{{ $T("ssrc.bidHall.model.bidHall.purceOrgName").$D("采购组织名称") }}：{{ headInfo.purOrganizationName }}</span>
                </li>
                <li>
                  <span>{{ $T("ssrc.bidHall.model.bidHall.attributeBigint16Meaning").$D("申请类型") }}：{{ headInfo.attributeBigint16Meaning }}</span>
                </li>
                <li>
                  <span>Project Code：{{ headInfo.attributeVarchar1 }}</span>
                </li>
                <li>
                  <span>Program Code：{{ headInfo.attributeVarchar2 }}</span>
                </li>
                <li>
                  <span>{{ $T("ssrc.common.model.common.unitName").$D("需求部门") }}：{{ headInfo.unitName }}</span>
                </li>
                <li>
                  <span>{{ $T("ssrc.bidHall.model.bidHall.createdUnitName").$D("创建人部门") }}：{{ headInfo.createdUnitName }}</span>
                </li>
                <li>
                  <span>{{ $T("ssrc.bidHall.model.bidHall.purchaseAgentName").$D("采购员") }}：{{ headInfo.purchaserName }}</span>
                  <span>{{ $T("ssrc.bidHall.model.bidHall.totalBudget").$D("预算金额") }}：{{ headInfo.budgetAmount }}</span>
                </li>
                <li>
                  <span>{{ $T("ssrc.bidHall.modal.inEnquiryHall.currency").$D("币种") }}：{{ headInfo.currencyCodeMeaning }}</span>
                  <span>{{ $T("ssrc.bidHall.model.bidHall.paymentType").$D("付款方式") }}：{{ headInfo.paymentTypeName }}</span>
                </li>
                <li>
                  <span>{{ $T("ssrc.bidHall.model.bidHall.paymentTerm").$D("付款条款") }}：{{ headInfo.paymentTermName }}</span>
                </li>
                <li>
                  <span>{{ $T("ssrc.inquiryHall.model.inquiryHall.sourcingType").$D("寻源类型") }}：{{ headInfo.sourceTypeMeaning }}</span>
                  <span>{{ $T("ssrc.inquiryHall.model.inquiryHall.priceCategory").$D("价格类型") }}：{{ headInfo.priceCategoryMeaning }}</span>
                </li>
                <li>
                  <span>{{ $T("ssrc.bidHall.model.bidHall.bidBond").$D("保证金") }}：{{ headInfo.bidBond }}</span>
                  <span>{{ $T("ssrc.inquiryHall.model.inquiryHall.centralPurchaseFlag").$D("是否集采") }}：{{ headInfo.centralPurchaseFlag?$T("hipspfm.common.status.yes").$D("是"):$T("hipspfm.common.status.no").$D("否") }}</span>
                </li>
                <li>
                  <span>{{ $T("ssrc.bidConfirm.model.common.remark").$D("备注") }}：{{ headInfo.rfxRemark }}</span>
                  <span>
                    {{ $T("ssrc.inquiryHall.model.inquiryHall.inquiryGroup").$D("寻源小组") }}：
                    <span
                      class="font-blue"
                      @click="showRfxMember">{{ $T('ssrc.bidHall.view.message.button.view').$D('查看') }}</span>
                  </span>
                </li>
                <li>
                  <span>{{ $T("ssrc.inquiryHall.model.inquiryHall.remarkInside").$D("备注（内部）") }}：{{ headInfo.internalRemark }}</span>
                </li>
                <li>
                  <span>
                    {{ $T("ssrc.bidHall.model.bidHall.techAttachments").$D("技术附件") }}：
                    <span
                      class="font-blue"
                      @click="showFilePop(headInfo.techAttachmentUuid)">{{ $T('ssrc.bidHall.view.message.button.view').$D('查看') }}</span>
                  </span>
                  <span>
                    {{ $T("ssrc.bidHall.model.bidHall.businessAttachments").$D("商务附件") }}：
                    <span
                      class="font-blue"
                      @click="showFilePop(headInfo.businessAttachmentUuid)">{{ $T('ssrc.bidHall.view.message.button.view').$D('查看') }}</span>
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <!-- 寻源规则 -->
          <div ref="rfxRuleInfo" class="infoContent headInfo last-no-border">
            <h3>{{ $T("ssrc.inquiryHall.view.message.panel.rfxRules").$D("寻源规则") }}</h3>
            <div v-if="!headInfo.rfxHeaderId" class="noContent">
              <span>{{ $T("hipspfm.workFlow.view.message.noCheckPriceInfo").$D("暂无信息") }}</span>
            </div>
            <div v-else>
              <ul>
                <li>
                  <span>{{ $T("ssrc.inquiryHall.modal.inquiryHall.sourcingTemplate").$D("寻源模板") }}：{{ headInfo.templateName }}</span>
                </li>
                <li>
                  <span>{{ $T("ssrc.common.model.common.sourcingCategory").$D("寻源类别") }}：{{ headInfo.sourceCategoryMeaning }}</span>
                </li>
                <li>
                  <span>{{ $T("ssrc.common.model.common.sourcingApproach").$D("寻源方式") }}：{{ headInfo.sourceMethodMeaning }}</span>
                </li>
                <li>
                  <span>{{ $T("ssrc.sourceTemplate.model.template.qualificationType").$D("资格审查") }}：{{ headInfo.qualificationTypeMeaning }}</span>
                </li>
                <li>
                  <span>{{ $T("ssrc.inquiryHall.model.inquiryHall.expertEvaluation").$D("专家评分") }}：{{ headInfo.expertScoreTypeMeaning }}</span>
                  <span>{{ $T("ssrc.sourceTemplate.model.template.openBidOrder").$D("评标步制") }}：{{ headInfo.openBidOrderMeaning }}</span>
                </li>
                <li>
                  <span>{{ $T("ssrc.sourceTemplate.model.template.quotationType").$D("报价方式") }}：{{ headInfo.quotationTypeMeaning }}</span>
                  <span>{{ $T("ssrc.sourceTemplate.model.template.quotationScope").$D("报价范围") }}：{{ headInfo.quotationScopeMeaning }}</span>
                </li>
                <li>
                  <span>{{ $T("ssrc.common.auctionDirection").$D("报价方向") }}：{{ headInfo.auctionDirectionMeaning }}</span>
                  <span>{{ $T("ssrc.inquiryHall.model.inquiryHall.sealedQuotation").$D("密封报价") }}：{{ headInfo.sealedQuotationFlag?$T("hipspfm.common.status.yes").$D("是"):$T("hipspfm.common.status.no").$D("否") }}</span>
                </li>
                <li>
                  <span>{{ $T("ssrc.inquiryHall.model.inquiryHall.minQuotedSupplier").$D("最少报价供应商数") }}：{{ headInfo.minQuotedSupplier }}</span>
                </li>
              </ul>
            </div>
          </div>
          <!-- 资格预审 -->
          <div
            v-if="headInfo.prequalEndDate"
            ref="qualificationInfo"
            class="infoContent headInfo last-no-border">
            <h3>{{ $T("ssrc.bidHall.view.message.tab.preQualification").$D("资格预审") }}</h3>
            <div>
              <ul>
                <li>
                  <span>{{ $T("ssrc.bidHall.model.bidHall.prequalEndDate").$D("预审截止时间") }}：{{ headInfo.prequalEndDate }}</span>
                </li>
                <li>
                  <span>{{ $T("ssrc.bidHall.model.bidHall.reviewMethod").$D("审查方法") }}：{{ headInfo.reviewMethodMeaning }}</span>
                  <span>{{ $T("ssrc.bidHall.model.bidHall.qualifiedLimit").$D("合格上限") }}：{{ headInfo.qualifiedLimit }}</span>
                </li>
                <li>
                  <span>{{ $T("ssrc.bidHall.model.bidHall.prequalFileExpense").$D("预审文件费") }}：{{ headInfo.prequalFileExpense }}</span>
                </li>
                <li>
                  <span>{{ $T("ssrc.bidHall.model.bidHall.prequalLocation").$D("申请提交地点") }}：{{ headInfo.prequalLocation }}</span>
                </li>
                <li>
                  <span>
                    {{ $T("ssrc.bidHall.model.bidHall.prequalFile").$D("资格预审文件") }}：
                    <span
                      class="font-blue"
                      @click="showFilePop(headInfo.prequalAttachmentUuid)">{{ $T('ssrc.bidHall.view.message.button.view').$D('查看') }}</span>
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <!-- 专家 -->
          <div
            v-if="headInfo.expertScoreType === 'ONLINE'"
            ref="expertInfo"
            class="infoContent last-no-border">
            <h3>{{ $T("ssrc.bidHall.view.message.tab.professional").$D("专家") }}</h3>
            <div v-if="expertInfo" class="card">
              <ul v-for="(item,index) in expertInfo" :key="index">
                <li class="name-title">
                  <span>{{ $T('ssrc.bidHall.model.scoring.expertName').$D('姓名') }}：{{ item.expertName }}</span>
                  <span
                    v-if="item.evaluateLeaderFlagMeaning"
                    class="name-tag">{{ item.evaluateLeaderFlagMeaning }}</span>
                </li>
                <li>
                  <span>{{ $T('ssrc.bidHall.model.bidHall.userName').$D('账户') }}：{{ item.loginName }}</span>
                </li>
                <li>
                  <span>{{ $T('ssrc.bidHall.model.bidHall.expertType').$D('类型') }}：{{ item.expertTypeMeaning }}</span>
                  <span>{{ $T('ssrc.bidHall.model.bidHall.expertLevel').$D('级别') }}：{{ item.expertLevelMeaning }}</span>
                </li>
              </ul>
            </div>
          </div>
          <!-- 评分要素 -->
          <div
            v-if="headInfo.expertScoreType === 'ONLINE'"
            ref="indicsInfo"
            class="infoContent last-no-border">
            <h3>{{ $T("ssrc.bidHall.view.message.tab.scoringElements").$D("评分要素") }}</h3>
            <div
              v-if="indicsInfo.businessIndicList && indicsInfo.businessIndicList.length>0"
              class="card">
              <div class="sub-single-title">
                <span>{{ $T("ssrc.bidHall.model.bidHall.businessTeam").$D("商务组") }}</span>
                <span
                  class="percent">{{ $T("ssrc.score.model.score.businessWeight").$D("评分权重") }}: {{ indicsInfo.businessIndicList[0].businessWeight }}%</span>
              </div>
              <ul v-for="(item,index) in indicsInfo.businessIndicList" :key="index">
                <li>
                  <span>{{ $T('ssrc.bidHall.model.bidHall.indicateCode').$D('要素编码') }}：{{ item.indicateCode }}</span>
                  <span>{{ $T('ssrc.bidHall.model.bidHall.indicateType').$D('要素类型') }}：{{ item.indicateTypeMeaning }}</span>
                </li>
                <li>
                  <span>{{ $T('ssrc.bidHall.model.bidHall.indicateName').$D('评分要素') }}：{{ item.indicateName }}</span>
                </li>
                <li>
                  <span>{{ $T('ssrc.bidHall.model.bidHall.scoreDetails').$D('评分细则') }}：{{ item.indicateRemark }}</span>
                </li>
                <li>
                  <span>{{ $T('ssrc.bidHall.model.bidHall.minScore').$D('最低分') }}：{{ item.minScore }}</span>
                  <span>{{ $T('ssrc.bidHall.model.bidHall.maxScore').$D('最高分') }}：{{ item.maxScore }}</span>
                </li>
                <li>
                  <span>{{ $T('ssrc.bidHall.model.bidHall.weight').$D('权重') }}：{{ item.weight }}</span>
                  <span>
                    {{ $T('ssrc.bidHall.model.bidHall.expertAssign').$D('专家分配') }}：
                    <span
                      class="font-blue"
                      @click="showExpertInfo(item.team, item.evaluateIndicId)">{{ $T('ssrc.bidHall.view.message.button.view').$D('查看') }}</span>
                  </span>
                </li>
              </ul>
            </div>
            <div
              v-if="indicsInfo.technologyIndicList && indicsInfo.technologyIndicList.length>0"
              class="card">
              <div class="sub-single-title">
                <span>{{ $T("ssrc.bidHall.model.bidHall.technologyTeam").$D("技术组") }}</span>
                <span
                  class="percent">{{ $T("ssrc.score.model.score.technologyWeight").$D("评分权重") }}: {{ indicsInfo.technologyIndicList[0].technologyWeight }}%</span>
              </div>
              <ul v-for="(item,index) in indicsInfo.technologyIndicList" :key="index">
                <li>
                  <span>{{ $T('ssrc.bidHall.model.bidHall.indicateCode').$D('要素编码') }}：{{ item.indicateCode }}</span>
                  <span>{{ $T('ssrc.bidHall.model.bidHall.indicateType').$D('要素类型') }}：{{ item.indicateTypeMeaning }}</span>
                </li>
                <li>
                  <span>{{ $T('ssrc.bidHall.model.bidHall.indicateName').$D('评分要素') }}：{{ item.indicateName }}</span>
                </li>
                <li>
                  <span>{{ $T('ssrc.bidHall.model.bidHall.scoreDetails').$D('评分细则') }}：{{ item.indicateRemark }}</span>
                </li>
                <li>
                  <span>{{ $T('ssrc.bidHall.model.bidHall.minScore').$D('最低分') }}：{{ item.minScore }}</span>
                  <span>{{ $T('ssrc.bidHall.model.bidHall.maxScore').$D('最高分') }}：{{ item.maxScore }}</span>
                </li>
                <li>
                  <span>{{ $T('ssrc.bidHall.model.bidHall.weight').$D('权重') }}：{{ item.weight }}</span>
                  <span>
                    {{ $T('ssrc.bidHall.model.bidHall.expertAssign').$D('专家分配') }}：
                    <span
                      class="font-blue"
                      @click="showExpertInfo(item.team, item.evaluateIndicId)">{{ $T('ssrc.bidHall.view.message.button.view').$D('查看') }}</span>
                  </span>
                </li>
              </ul>
            </div>
            <div
              v-if="indicsInfo.otherIndicList && indicsInfo.otherIndicList.length>0"
              class="card">
              <ul v-for="(item,index) in indicsInfo.otherIndicList" :key="index">
                <li>
                  <span>{{ $T('ssrc.bidHall.model.bidHall.indicateCode').$D('要素编码') }}：{{ item.indicateCode }}</span>
                  <span>{{ $T('ssrc.bidHall.model.bidHall.indicateType').$D('要素类型') }}：{{ item.indicateTypeMeaning }}</span>
                </li>
                <li>
                  <span>{{ $T('ssrc.bidHall.model.bidHall.indicateName').$D('评分要素') }}：{{ item.indicateName }}</span>
                </li>
                <li>
                  <span>{{ $T('ssrc.bidHall.model.bidHall.scoreDetails').$D('评分细则') }}：{{ item.indicateRemark }}</span>
                </li>
                <li>
                  <span>{{ $T('ssrc.bidHall.model.bidHall.minScore').$D('最低分') }}：{{ item.minScore }}</span>
                  <span>{{ $T('ssrc.bidHall.model.bidHall.maxScore').$D('最高分') }}：{{ item.maxScore }}</span>
                </li>
                <li>
                  <span>{{ $T('ssrc.bidHall.model.bidHall.weight').$D('权重') }}：{{ item.weight }}</span>
                  <span>
                    {{ $T('ssrc.bidHall.model.bidHall.expertAssign').$D('专家分配') }}：
                    <span
                      class="font-blue"
                      @click="showExpertInfo(item.team, item.evaluateIndicId)">{{ $T('ssrc.bidHall.view.message.button.view').$D('查看') }}</span>
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <!-- 物料明细 -->
          <div ref="itemInfo" class="infoContent last-no-border">
            <h3>{{ $T("hipspfm.workFlow.view.message.itemLineInfo").$D("物料明细") }}</h3>
            <div v-if="!itemInfo.length" class="noContent">
              <span>{{ $T("hipspfm.common.view.message.title.noData").$D("暂无数据") }}</span>
            </div>
            <div v-else class="card">
              <ul v-for="(item,index) in itemInfo" :key="index">
                <li>
                  <span>{{ $T('ssrc.bidHall.model.bidHall.lineNo').$D('行号') }}：{{ item.rfxLineItemNum }}</span>
                  <span>{{ $T('ssrc.bidHall.modal.inqueryHall.demandDate').$D('需求日期') }}：{{ item.demandDate|CalcDate }}</span>
                </li>
                <li>
                  <span>{{ $T('ssrc.bidHall.modal.inqueryHall.itemCode').$D('物料编码') }}：{{ item.itemCode }}</span>
                </li>
                <li>
                  <span>{{ $T('ssrc.bidHall.model.bidHall.itemName').$D('物料名称') }}：{{ item.itemName }}</span>
                </li>
                <li>
                  <span>{{ $T('ssrc.bidHall.model.bidHall.needNum').$D('需求数量') }}：{{ item.rfxQuantity }}</span>
                  <span>{{ $T('ssrc.bidHall.modal.inqueryHall.unit').$D('单位') }}：{{ item.uomName }}</span>
                </li>
                <li>
                  <span>{{ $T('ssrc.bidHall.model.bidHall.taxRate').$D('税率%') }}：{{ item.taxRate }}</span>
                  <span>{{ $T('ssrc.queryRfx.model.queryRfq.costPrice').$D('成本单价') }}：{{ item.costPrice }}</span>
                </li>
                <li>
                  <span>{{ $T('ssrc.bidHall.model.bidHall.itemCategory').$D('物料类别') }}：{{ item.itemCategoryName }}</span>
                </li>
                <li>
                  <span>{{ $T('ssrc.bidHall.modal.inqueryHall.businessUnit').$D('业务实体') }}：{{ item.ouName }}</span>
                </li>
                <li>
                  <span>{{ $T('ssrc.bidHall.model.bidHall.inventoryOrg').$D('库存组织') }}：{{ item.invOrganizationName }}</span>
                </li>
                <li>
                  <span>{{ $T('ssrc.bidHall.model.bidHall.prNum').$D('采购申请号') }}：{{ item.prNum }}</span>
                </li>
                <li>
                  <span>{{ $T('ssrc.bidHall.model.bidHall.lineNum').$D('采购申请行号') }}：{{ item.prLineNum }}</span>
                  <span
                    class="font-blue"
                    @click.stop="getSupplierAssigned(item.rfxLineItemId)">{{ $T("ssrc.bidHall.model.bidHall.viewSupplier").$D("查看供应商") }}</span>
                </li>
                <li>
                  <span>{{ $T("hipspfm.workFlowCata.model.common.manufacturer").$D("生产商") }}：{{ item.attributeVarchar11 }}</span>
                  <span>{{ $T("hipspfm.workFlowCata.model.common.model").$D("车型") }}：{{ item.attributeVarchar12 }}</span>
                </li>
                <li>
                  <span>{{ $T("hipspfm.workFlowCata.model.common.customerName").$D("客户名") }}：{{ item.attributeVarchar13 }}</span>
                </li>
                <li>
                  <span>{{ $T("hipspfm.workFlowCata.model.common.startDate").$D("量产开始日期") }}：{{ item.attributeDate1 | CalcDate }}</span>
                </li>
                <li>
                  <span>{{ $T("hipspfm.workFlowCata.model.common.endDate").$D("量产结束日期") }}：{{ item.attributeDate2 | CalcDate }}</span>
                </li>
                <li>
                  <span>{{ $T('hipspfm.workFlowCata.model.common.application').$D('应用') }}：{{ item.attributeVarchar1 }}</span>
                  <span>
                    {{ $T('hipspfm.workFlowCata.model.common.materialScience').$D('材料') }}：
                    <span>{{ item.attributeVarchar2 }}</span>
                  </span>
                </li>
                <li>
                  <span>{{ $T('hipspfm.workFlowCata.model.common.surfaceTreatment').$D('表面处理') }}：{{ item.attributeVarchar3 }}</span>
                  <span>{{ $T('hipspfm.workFlowCata.model.common.annualConsumption').$D('年用量') }}：{{ item.attributeVarchar4 }}</span>
                </li>
                <li>
                  <span>{{ $T('hipspfm.workFlowCata.model.common.requirements').$D('测试/验收要求') }}：{{ item.attributeVarchar5 }}</span>
                  <span>{{ $T('hipspfm.workFlowCata.model.common.standard').$D('包装标准') }}：{{ item.attributeVarchar6 }}</span>
                </li>
                <li>
                  <span>{{ $T('hipspfm.workFlowCata.model.common.productNumber').$D('供应商/客户产品编号') }}：{{ item.attributeVarchar7 }}</span>
                </li>
                <li>
                  <span>{{ $T('entity.supplier.name').$D('供应商名称') }}：{{ item.attributeVarchar14 }}</span>
                </li>
                <li>
                  <span>{{ $T('hipspfm.workFlowCata.model.common.category').$D('类别代码') }}：{{ item.attributeVarchar8 }}</span>
                  <span>{{ $T('hipspfm.workFlowCata.model.common.categoryName').$D('类别名称') }}：{{ item.attributeVarchar10 }}</span>
                </li>
                <li>
                  <span>{{ $T('sprm.common.model.sumProject').$D('总账科目代码') }}：</span>
                  <span>{{ item.attributeVarchar9 }}</span>
                </li>
              </ul>
            </div>
          </div>
          <!-- 供应商 -->
          <div ref="supplierInfo" class="infoContent last-no-border">
            <h3>{{ $T("ssrc.bidHall.modal.question.supplier").$D("供应商") }}</h3>
            <div v-if="!supplierInfo.length" class="noContent">
              <span>{{ $T("hipspfm.common.view.message.title.noData").$D("暂无数据") }}</span>
            </div>
            <div v-else class="card">
              <ul v-for="(item,index) in supplierInfo" :key="index">
                <li class="name-title">
                  <span>{{ item.supplierCompanyName }}</span>
                  <span class="name-tag">{{ item.stageDescription }}</span>
                </li>
                <li>
                  <span>{{ $T('ssrc.bidHall.model.bidHall.supplierCode').$D('编码') }}：{{ item.supplierCompanyNum }}</span>
                </li>
                <li>
                  <span>{{ $T('ssrc.bidHall.model.queryRfq.contactName').$D('联系人') }}：{{ item.contactName }}</span>
                  <span>{{ $T('ssrc.bidHall.model.bidHall.contactPhone').$D('手机号') }}：{{ item.contactMobilephone }}</span>
                </li>
                <li>
                  <span>{{ $T('ssrc.bidHall.model.bidHall.contactMail').$D('邮箱') }}：{{ item.contactMail }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- 专家信息详情弹窗 -->
    <supplier-info v-model="expertInfoPop" date-type="expert" :experts-assign-info="expertsAssignInfo" />
    <!-- 供应商信息详情弹窗 -->
    <supplier-info
      v-model="supplierInfoPop"
      date-type="supplier"
      :supplier-assign-info="supplierAssignInfo"/>
    <!-- 寻源小组弹窗 -->
    <rfx-member v-model="rfxMemberPopup" :rfx-header="headInfo" @onclose="showRfxMember"/>
  </div>
</template>

<script>
import {
  getRfxItems,
  getRfxHeader,
  getRfxIndics,
  getRfxExperts,
  getRfxSuppliers,
  getSupplierAssignedApi
} from "./api/RfxApproveApi";
import uuid from "uuid";
import BScroll from "better-scroll";
import RfxMember from "./components/RfxMember";
import { Collapse, CollapseItem, NavBar } from "hips";
import SupplierInfo from "@/components/BidDetail/SupplierInfo";
//oldBidDetail import { getExpertAssignedApi } from "../../../common/BidDetail/api";
import { getExpertAssignedApi } from "./api/index.js";

export default {
  modules: [ "ssrc.bidHall", "hipspfm.workFlow", "ssrc.common", "ssrc.inquiryHall", "ssrc.bidConfirm", "ssrc.sourceTemplate", "ssrc.score", "hipspfm.common", "ssrc.queryRfx", "hipspfm.workFlowCata", "sprm.common", "entity.supplier" ],
  name: "RfxApproval",
  components: {
    RfxMember,
    SupplierInfo,
    [NavBar.name]: NavBar,
    [Collapse.name]: Collapse,
    [CollapseItem.name]: CollapseItem
  },
  filters: {},
  props: {
    changeReqId: {
      type: String | Number,
    },
    showFilePop: {
      type: Function
    }
  },
  data() {
    return {
      headInfo: {},
      itemInfo: [],
      supplierInfo: [],
      indicsInfo: {},
      expertInfo: {},
      scroll: "",
      navIndex: 0,
      lengthArr: [],
      contentLenArr: [],
      uuid: "",
      expertsAssignInfo: [],
      expertInfoPop: false,
      supplierAssignInfo: [],
      supplierInfoPop: false,
      rfxMemberPopup: false
    };
  },
  computed: {
    getNavArr() {
      let navArr = [
        {
          title: this.$T("ssrc.bidHall.view.tab.baseInfos").$D("基础信息"),
          ref: "headInfo"
        },
        {
          title: this.$T("ssrc.bidHall.view.message.panel.rfxRules").$D("寻源规则"),
          ref: "rfxRuleInfo"
        }
      ];
      if (this.headInfo.preQualificationFlag) {
        navArr.push({
          title: this.$T("ssrc.bidHall.view.tab.preQualification").$D(
            "资格预审"
          ),
          ref: "qualificationInfo"
        });
      }
      if (this.headInfo.expertScoreType === "ONLINE") {
        navArr.push(
          {
            title: this.$T("ssrc.bidHall.view.message.tab.professional").$D(
              "专家"
            ),
            ref: "expertInfo"
          },
          {
            title: this.$T("ssrc.bidHall.view.tab.scoringElements").$D(
              "评分要素"
            ),
            ref: "indicsInfo"
          }
        );
      }
      navArr.push(
        {
          title: this.$T("ssrc.bidHall.view.message.tab.itemDetails").$D(
            "物料明细"
          ),
          ref: "itemInfo"
        },
        {
          title: this.$T("ssrc.bidHall.view.message.tab.supplierList").$D(
            "供应商列表"
          ),
          ref: "supplierInfo"
        }
      );
      return navArr;
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
        await this.fetchData();
        await this.fetchItems();
        await this.fetchExpert();
        await this.fetchIndics();
        await this.fetchSupplier();
      } catch (err) {
        console.log(err, "error");
      } finally {
        this.$loading.hide();
      }
    }
    this.$emit("GetApprovalTitle", this.$T("ssrc.inquiryHall.title.rfx.release.approve").$D("询价单发布审批"));
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
        // bounce: false    //关闭回弹效果
      });
      this.$refreshScroll();
      this.scroll.on("scroll", this.handlerScroll);
    });
    this.uuid = uuid();
  },
  methods: {
    showRfxMember() {
      this.rfxMemberPopup = !this.rfxMemberPopup;
    },
    async getSupplierAssigned(lineId) {
      await getSupplierAssignedApi(this.headInfo.rfxHeaderId, lineId).then(
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
      await getRfxSuppliers(this.changeReqId).then((res) => {
        this.supplierInfo = res.content;
      });
    },
    //获取询价单专家信息
    async fetchExpert() {
      await getRfxExperts(this.changeReqId).then((res) => {
        this.expertInfo = res.evaluateExpertList;
      });
    },
    async fetchIndics() {
      await getRfxIndics(this.changeReqId).then((res) => {
        this.indicsInfo = res;
      });
    },
    async fetchData() {
      const params = {
        customizeUnitCode:
          "SSRC.INQUIRY_HALL_DETAIL.HEADER_DETAIL,SSRC.INQUIRY_HALL_DETAIL.HEADER_PREQUAL"
      };
      await getRfxHeader(this.changeReqId, params).then((res) => {
        this.headInfo = res;
      });
    },
    async fetchItems() {
      const params = {
        customizeUnitCode: "SSRC.INQUIRY_HALL_DETAIL.ITEM_LINE",
        page: 0,
        size: 10
      };
      await getRfxItems(this.changeReqId, params).then((res) => {
        this.itemInfo = res.content;
      });
    },
    // 滚动事件
    handlerScroll({ x, y }) {
      this.$handlerScroll(x, y, this);
    }
  }
};
</script>

<style scoped lang="stylus">
.card {
  width: 100%;
  padding: 0 20px;
  color: #666666;
  background: var(--color-bg-default);

  // border-bottom: 8px solid var(--color-border-default);
  div {
    display: flex;
    justify-content: space-between;
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid var(--color-border-default);

    .code {
      display: flex;
      align-items: center;
      text-align: left;
      font-size: 16px;
      color: var(--color-font-default);
      font-weight: bold;

      .tag {
        display: inline-block;
        width: 6px;
        height: 14px;
        background: var(--color-other-default-b);
        border-radius: 1px;
        margin-right: 8px;
      }

      .place-holder {
        display: inline-block;
        width: 30px;
        height: 100%;
      }

      .item-name {
        display: inline-block;
        // line-height: 24px;
      }
    }

    .noWrap {
      width: 260px;
    }

    .head-num, .line-num {
      span {
        font-size: 14px;
        color: var(--color-font-default-e);
      }
    }
  }

  .sub-single-title {
    font-size: 16px;
    color: var(--color-font-default);
    font-weight: bold;
    height: 54px;
    line-height: 54px;

    .percent {
      font-size: 16px;
      color: var(--color-other-default-c);
      text-align: right;
    }
  }

  ul {
    padding-bottom: 12px;

    li {
      display: flex;
      justify-content: space-between;
      line-height: 32px;
      height: 32px;
      margin-top: 2px;
      font-size: 14px;
      color: var(--color-font-default);

      &:first-child {
        margin-top: 8px;
      }

      > span {
        flex: 1;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: var(--color-font-default);
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
    }

    .name-title {
      display: block;
      position: relative;

      span:first-child {
        font-size: 14px;
        color: var(--color-font-default);
        line-height: 22px;
        font-weight: bold;
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
    }

    .name-title:before {
      content: '';
      display: inline-block;
      width: 6px;
      height: 14px;
      background: var(--color-other-default-b);
      position: absolute;
      left: -20px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}

.blackFont {
  color: var(--color-font-default);
}

.right-icon {
  display: flex;
  align-items: center;

  img {
    width: 16px;
    height: 16px;
    transition: all 0.3s;
  }

  background-size: 16px;
}

>>> .hips-collapse-item__title .right-icon img {
  -webkit-transform: rotateZ(0) !important;
  transform: rotateZ(0) !important;
}

>>> .hips-collapse-item__title--expanded .right-icon img {
  -webkit-transform: rotateZ(90deg) !important;
  transform: rotateZ(90deg) !important;
}

.closeFont {
  color: #414660 !important;
  border-color: #414660 !important;
}

.font-blue {
  color: var(--color-other-default-b) !important;
}

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

.mainDetail {
  .navWrap {
    width: 100%;
    height: 44px;
    // overflow: hidden;
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
        color: #82879E;
        letter-spacing: 0;
        text-align: center;
        line-height: 24px;
        text-align: center;
        position: relative;
        margin-left: 20px;

        &.active {
          font-size: 16px;
          color: var(--color-font-default);
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
      .moreInfo {
        align-self: flex-end;
        width: 18.3px;
        height: 18.3px;
      }

      .infoContent {
        .materiel-name {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          width: 220px;
        }

        .materialCode {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        h3 {
          padding: 20px 53px 12px 20px;
          font-family: PingFangSC-Medium;
          font-size: 18px;
          color: var(--color-font-default);
          line-height: 26px;
          font-weight: 700;
          background: var(--color-bg-default-b);
        }

        .footInfo {
          padding: 12px 15px 12px 20px;
          border-bottom: 8px solid var(--color-border-default);
          font-family: PingFangSC-Medium;
          color: var(--color-font-default);
          font-size: 14px;
          line-height: 22px;
          font-weight: 600;

          span:nth-child(1) {
            width: auto;
          }

          span:nth-child(2) {
            word-break: break-all;
          }
        }

        .headCompany {
          display: flex;
          flex-direction: row;
          margin: 0px 0 3px 20px;
          border-bottom: 1px solid var(--color-border-default);
          padding: 14px 20px 11px 0px;

          .block {
            width: 6px;
            height: 14px;
            border-radius: 1px;
            background-color: var(--color-other-default-b);
            margin: 4px 10px 0 0;
          }

          .code {
            flex: 1;
            font-size: 16px;
            color: var(--color-font-default);
            line-height: 24px;
            display: flex;
            justify-content: space-between;
            font-weight: 600;

            span:nth-child(2) {
              font-family: PingFangSC-Medium;
              font-size: 14px;
              color: var(--color-font-default-e);
              text-align: right;
              line-height: 22px;
              font-weight: bold;
            }
          }
        }
      }

      .headInfo {
        ul {
          padding-left: 20px;

          li:nth-last-child(1) {
            padding-bottom: 13px;
            border-bottom: 1px solid var(--color-border-default);
          }

          li {
            display: flex;
            align-items: center;
            padding: 12px 20px 0 0;

            span {
              flex: 1;
              font-family: PingFangSC-Regular;
              font-size: 14px;
              color: var(--color-font-default);
              line-height: 22px;
            }
          }
        }
      }

      .lineInfo {
        >>> .hips-cell {
          padding: 17px 20px 13px 20px;
          position: static;
        }

        font-family: PingFangSC-Medium;

        .collapse-title-a {
          margin-bottom: 4px;

          span:nth-child(1) {
            font-size: 10px;
            color: var(--color-other-default-b);
            line-height: 18px;
            padding: 0px 4px;
            display: inline-block;
            border: 1px solid var(--color-other-default-b);
            border-radius: 2px;
            margin-right: 8px;
          }

          span:nth-child(2) {
            font-size: 14px;
            color: var(--color-font-default);
            display: inline;
            line-height: 22px;
            font-weight: 700;
            word-break: break-all;
          }
        }

        .collapse-title-b {
          height: 20px;

          span {
            background: rgba(65, 70, 96, 0.1);
            border-radius: 2px;
            padding: 1px 4px;
            margin-right: 8px;
            display: inline-block;
            font-size: 10px;
            color: #414660;
            line-height: 18px;
            word-break: break-all;
          }
        }

        .collapse-info {
          background: var(--color-bg-default);
        }
      }

      .last-no-border {
        div:nth-last-child(1) {
          .footInfo {
            border: none !important;
          }
        }
      }
    }
  }
}
</style>
