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
                  <span>{{ $T("ssrc.common.model.common.unitName").$D("需求部门") }}：{{ headInfo.unitName }}</span>
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
                  <span>{{ $T("ssrc.inquiryHall.model.inquiryHall.centralPurchaseFlag").$D("是否集采") }}：{{ headInfo.centralPurchaseFlag?$T("hipspfm.common.status.yes").$D("是"):$T('hzero.common.no').$D("否") }}</span>
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
                  <span>{{ $T("ssrc.inquiryHall.model.inquiryHall.startFlag").$D("发布即开始") }}：{{ headInfo.startFlag === 1 ? $T("hipspfm.common.status.yes").$D("是"):$T('hzero.common.no').$D("否") }}</span>
                </li>
                <li>
                  <span>{{ $T("ssrc.inquiryHall.model.inquiryHall.quotationStartTime").$D("报价开始时间") }}：{{ headInfo.quotationStartDate }}</span>
                </li>
                <li>
                  <span>{{ $T("ssrc.inquiryHall.model.inquiryHall.quotationDeadline").$D("报价截止时间") }}：{{ headInfo.quotationEndDate }}</span>
                </li>
                <li>
                  <span>{{ $T("ssrc.inquiryHall.model.inquiryHall.quotRunningDuration").$D("报价运行时间") }}：{{ headInfo.startQuotationRunningDuration|formatMinutes }}</span>
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
                  <span>{{ $T("ssrc.inquiryHall.model.inquiryHall.sealedQuotation").$D("密封报价") }}：{{ headInfo.sealedQuotationFlag? $T("hipspfm.common.status.yes").$D("是"): $T("hipspfm.common.status.no").$D("否") }}</span>
                </li>
                <li>
                  <span>{{ $T("ssrc.inquiryHall.model.inquiryHall.minQuotedSupplier").$D("最少报价供应商数") }}：{{ headInfo.minQuotedSupplier }}</span>
                </li>
                <li>
                  <span>{{ $T("ssrc.inquiryHall.model.inquiryHall.validDateInputTypeMeaning").$D("报价有效期") }}：{{ headInfo.validDateInputTypeMeaning }}</span>
                </li>
                <li>
                  <span>{{ $T("ssrc.inquiryHall.model.inquiryHall.subjectMatterRuleMeaning").$D("标书规则") }}：{{ headInfo.subjectMatterRuleMeaning }}</span>
                </li>
                <li>
                  <span>{{ $T("ssrc.sourceTemplate.model.template.taxChangeFlag").$D("允许供应商修改税率") }}：{{ headInfo.taxChangeFlag? $T("hipspfm.common.status.yes").$D("是") : $T("hipspfm.common.status.no").$D("否") }}</span>
                </li>
                <li>
                  <span>{{ $T("ssrc.sourceTemplate.model.template.quantityChangeFlag").$D("允许供应商修改可供数量") }}：{{ headInfo.quantityChangeFlag ? $T("hipspfm.common.status.yes").$D("是"): $T("hipspfm.common.status.no").$D("否") }}</span>
                </li>
                <li>
                  <span>{{ $T("ssrc.sourceTemplate.model.template.continuousQuotationFlag").$D("允许供应商连续报价") }}：{{ headInfo.continuousQuotationFlag ? $T("hipspfm.common.status.yes").$D("是"): $T("hipspfm.common.status.no").$D("否") }}</span>
                </li>
                <li>
                  <span>{{ $T("ssrc.sourceTemplate.model.template.diyLadderQuotationFlag").$D("允许供方自定义阶梯报价") }}：{{ headInfo.diyLadderQuotationFlag ? $T("hipspfm.common.status.yes").$D("是"): $T("hipspfm.common.status.no").$D("否") }}</span>
                </li>
                <li>
                  <span>{{ $T("ssrc.inquiryHall.model.inquiryHall.allowMuitiCurQuo").$D("允许多币种报价") }}：{{ headInfo.multiCurrencyFlag?$T("hipspfm.common.status.yes").$D("是"):$T("hipspfm.common.status.no").$D("否") }}</span>
                  <span>{{ $T("ssrc.inquiryHall.model.inquiryHall.allowAlterPaymnetTypeTerm").$D("允许修改付款条款方式") }}：{{ headInfo.paymentTermFlag ? $T("hipspfm.common.status.yes").$D("是"): $T("hipspfm.common.status.no").$D("否") }}</span>
                </li>
              </ul>
            </div>
          </div>
          <!-- 资格预审 -->
          <div v-if="headInfo.preQualificationFlag" ref="qualificationInfo" class="infoContent headInfo last-no-border">
            <h3>{{ $T("ssrc.bidHall.view.message.tab.preQualification").$D("资格预审") }}</h3>
            <div v-if="!headInfo.rfxHeaderId" class="noContent">
              <span>{{ $T("hipspfm.workFlow.view.message.noCheckPriceInfo").$D("暂无信息") }}</span>
            </div>
            <div v-else>
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
            <div v-if="!expertInfo.length" class="noContent">
              <span>{{ $T("hipspfm.common.view.message.title.noData").$D("暂无数据") }}</span>
            </div>
            <div class="card">
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
            <div v-if="!indicsInfo" class="noContent">
              <span>{{ $T("hipspfm.common.view.message.title.noData").$D("暂无数据") }}</span>
            </div>
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
            <div v-if="!itemInfo" class="noContent">
              <span>{{ $T("hipspfm.common.view.message.title.noData").$D("暂无数据") }}</span>
            </div>
            <div v-else class="card">
              <ul v-for="(item,index) in itemInfo" :key="index">
                <li>
                  <span>{{ $T('ssrc.bidHall.model.bidHall.lineNo').$D('行号') }}：{{ item.rfxLineItemNum }}</span>
                  <span>{{ $T('sodr.common.model.common.applicationType').$D('申请类型') }}：{{ item.itemPropertiesMeaning }}</span>
                </li>
                <li>
                  <span>{{ $T('ssrc.bidHall.modal.inqueryHall.itemCode').$D('物料编码') }}：{{ item.itemCode }}</span>
                  <span>{{ $T('ssrc.bidHall.modal.inqueryHall.demandDate').$D('需求日期') }}：{{ item.demandDate|CalcDate }}</span>
                </li>
                <li>
                  <span>{{ $T('ssrc.bidHall.model.bidHall.itemName').$D('物料名称') }}：{{ item.itemName }}</span>
                </li>
                <li>
                  <span>{{ $T('ssrc.bidHall.model.bidHall.quantity').$D('需求数量') }}：{{ item.rfxQuantity }}</span>
                  <span>{{ $T('ssrc.bidHall.modal.inqueryHall.unit').$D('单位') }}：{{ item.uomName }}</span>
                </li>
                <li>
                  <span>{{ $T('ssrc.bidHall.model.bidHall.taxRate').$D('税率%') }}：{{ item.taxRate }}</span>
                  <span>{{ $T('ssrc.bidHall.model.bidHall.costPrice').$D('标的单价') }}：{{ item.referencePrice }}</span>
                </li>
                <li>
                  <span>{{ $T('ssrc.bidHall.model.bidHall.itemCategory').$D('物料类别') }}：{{ item.itemCategoryName }}</span>
                  <span>{{ $T('ssrc.bidHall.model.platformPrice.flag').$D('是否平台售价') }}：{{ item.platformPriceFlagMeaning }}</span>
                </li>
                <li>
                  <span>{{ $T('ssrc.common.startTime').$D('开始时间') }}：{{ item.quotationStartDate }}</span>
                </li>
                <li>
                  <span>{{ $T('ssrc.common.endTime').$D('结束时间') }}：{{ item.quotationEndDate }}</span>
                </li>
                <li>
                  <span>{{ $T('ssrc.inquiryHall.model.inquiryHall.commonName').$D('通用名') }}：{{ item.commonName }}</span>
                </li>
                <li>
                  <span>{{ $T('ssrc.bidHall.model.store.info').$D('门店信息') }}：{{ item.invOrganizationName }}</span>
                </li>
                <li>
                  <span>{{ $T('ssrc.bidHall.model.bidHall.specifications').$D('规格') }}：{{ item.specs }}</span>
                  <span>{{ $T('ssrc.bidHall.model.bidHall.model').$D('型号') }}：{{ item.model }}</span>
                </li>
                <li>
                  <span>{{ $T('ssrc.inquiryHall.model.inquiryHall.needSample').$D('需要样品') }}：{{ item.sampleRequestedFlag?$T('hzero.common.yes').$D("是"):$T('hzero.common.no').$D("否") }}</span>
                  <span>{{ $T('ssrc.bidHall.model.bidHall.quotationDetails').$D('报价明细') }}：
                    <span v-if="item.quotationDetailFlag" class="font-blue" @click="showQuotationDetail(item)" >
                      {{ $T('ssrc.bidHall.model.bidHall.quotationDetails').$D('报价明细') }}
                    </span>
                  </span>
                </li>
                <li>
                  <span>{{ $T('ssrc.inquiryHall.model.inquiryHall.drawingNum').$D('图号') }}：{{ item.drawingNum }}</span>
                  <span>{{ $T('ssrc.inquiryHall.model.inquiryHall.drawingVersion').$D('图纸版本') }}：{{ item.drawingVersionNumber }}</span>
                </li>
                <li>
                  <span>{{ $T('ssrc.inquiryHall.model.inquiryHall.surfaceFlag').$D('表面处理') }}：{{ item.surfaceFlag?$T('hzero.common.yes').$D("是"):$T('hzero.common.no').$D("否") }}</span>
                  <span>{{ $T('ssrc.inquiryHall.model.inquiryHall.supplierItemNumDesc').$D('供应商料号') }}：{{ item.supplierItemNum }}</span>
                </li>
                <li>
                  <span>{{ $T('ssrc.inquiryHall.model.inquiryHall.supplierItemNumDesc').$D('供应商料号描述') }}：{{ item.supplierItemNumDesc }}</span>
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
              </ul>
            </div>
          </div>
          <!-- 供应商 -->
          <div ref="supplierInfo" class="infoContent last-no-border">
            <h3>{{ $T("ssrc.bidHall.modal.question.supplier").$D("供应商") }}</h3>
            <div class="card">
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

    <quotation-detail
      v-if="quotationDetailPop"
      v-model="quotationDetailPop"
      :supplier-quotation-detail="quotationDetail"
      :is-rfx-approval="true"/>
  </div>
</template>

<script>
import {
  getRfxExperts,
  getRfxHeader,
  getRfxIndics,
  getRfxItems,
  getRfxSuppliers,
  getSupplierAssignedApi
} from "./api/RfxApproveApi";
import uuid from "uuid";
import BScroll from "better-scroll";
import RfxMember from "./components/RfxMember";
import { Collapse, CollapseItem, NavBar } from "hips";
import SupplierInfo from "@/components/BidDetail/SupplierInfo";
import QuotationDetail from "./components/Quotation";
//oldBidDetail import { getExpertAssignedApi } from "../../../common/BidDetail/api";
import { getExpertAssignedApi } from "./api/index.js";
export default {
  modules: [ "ssrc.bidHall", "hipspfm.workFlow", "ssrc.common", "ssrc.inquiryHall", "hipspfm.common", "ssrc.bidConfirm", "ssrc.sourceTemplate", "ssrc.score", "sodr.common", "hzero.common", "ssrc.supplierQuotation" ],
  name: "JinRfxApproval",
  components: {
    QuotationDetail,
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
      expertInfo: [],
      scroll: "",
      navIndex: 0,
      lengthArr: [],
      contentLenArr: [],
      uuid: "",
      expertsAssignInfo: [],
      expertInfoPop: false,
      supplierAssignInfo: [],
      supplierInfoPop: false,
      rfxMemberPopup: false,
      quotationDetailPop:false,
      quotationDetail:{},
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
  watch: {},
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
    this.navScroll = new BScroll(this.$refs.navWrap, {
      scrollX: true,
      click: true
    });
    this.$nextTick(() => {
      this.scroll = new BScroll(this.$refs.wrapper, {
        scrollY: true,
        eventPassthrough: "horizontal",
        tap: true,
        probeType: 3
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
    //获取招投标专家分配信息
    async showExpertInfo(team, evaluateIndicId) {
      await getExpertAssignedApi(
        team,
        evaluateIndicId,
        this.headInfo.rfxHeaderId
      ).then((res) => {
        this.expertsAssignInfo = res || [];
        this.expertInfoPop = true;
      });
    },
    async fetchSupplier() {
      const params = {
        page: 0,
        size: 10
      };
      await getRfxSuppliers(this.changeReqId, params).then((res) => {
        this.supplierInfo = res.content;
      });
    },
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
      await getRfxHeader(this.changeReqId).then((res) => {
        this.headInfo = res;
      });
    },
    async fetchItems() {
      const params = {
        page: 0,
        size: 1000,
        rfxHeaderId: this.changeReqId,
        customizeUnitCode: "SSRC.INQUIRY_HALL_DETAIL.ITEM_LINE"
      };
      await getRfxItems(this.changeReqId, params).then((res) => {
        this.itemInfo = res.content || [];
      });
    },
    showQuotationDetail(data) {
      this.quotationDetail = data;
      this.quotationDetailPop = !this.quotationDetailPop;
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

  // border-bottom: 8px solid #F0F2F5;
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
        color: #C6CAD6;
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
  color: #1B1E2B;
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
  border-bottom: solid 8px #F0F2F5;
  font-weight: bold;

  span {
    line-height: 24px;
    font-size: 16px;
    display: inline-block;
    color: #1B1E2B;
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
          color: #1B1E2B;
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
          color: #1B1E2B;
          line-height: 26px;
          font-weight: 700;
          background: #F5f6fa;
        }

        .footInfo {
          padding: 12px 15px 12px 20px;
          border-bottom: 8px solid #F0F2F5;
          font-family: PingFangSC-Medium;
          color: #1B1E2B;
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
          border-bottom: 1px solid #F5F6FA;
          padding: 14px 20px 11px 0px;

          .block {
            width: 6px;
            height: 14px;
            border-radius: 1px;
            background-color: #00CFC2;
            margin: 4px 10px 0 0;
          }

          .code {
            flex: 1;
            font-size: 16px;
            color: #1B1E2B;
            line-height: 24px;
            display: flex;
            justify-content: space-between;
            font-weight: 600;

            span:nth-child(2) {
              font-family: PingFangSC-Medium;
              font-size: 14px;
              color: #C6CAD6;
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
            border-bottom: 1px solid #F5F6FA;
          }

          li {
            display: flex;
            align-items: center;
            padding: 12px 20px 0 0;

            span {
              flex: 1;
              font-family: PingFangSC-Regular;
              font-size: 14px;
              color: #1B1E2B;
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
            color: #00CFC2;
            line-height: 18px;
            padding: 0px 4px;
            display: inline-block;
            border: 1px solid #00CFC2;
            border-radius: 2px;
            margin-right: 8px;
          }

          span:nth-child(2) {
            font-size: 14px;
            color: #1B1E2B;
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
          background: #FCFCFC;
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
