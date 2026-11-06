<!--eslint-disable-->
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
        <!-- 基础信息 -->
        <div ref="headInfo" class="infoContent">
          <h3>{{ $T("ssrc.bidHall.view.tab.baseInfos").$D("基础信息") }}</h3>
          <div class="card">
            <ul>
              <li class="name-title">
                <span>{{ headInfo.companyName }}</span>
              </li>
              <li>
                <span>{{ $T('ssrc.bidHall.model.bidHall.bidNum').$D('招标编号') }}：{{ headInfo.bidNum }}</span>
              </li>
              <li>
                <span>{{ $T('ssrc.bidHall.model.bidHall.bidTitle').$D('招标事项') }}：{{ headInfo.bidTitle }}</span>
              </li>
              <li>
                <span>{{ $T('ssrc.bidHall.model.bidHall.quotationType').$D('报价方式') }}：{{ headInfo.quotationTypeMeaning }}</span>
                <span>{{ $T('ssrc.bidHall.model.bidHall.bidType').$D('招标类型') }}：{{ headInfo.bidTypeMeaning }}</span>
              </li>
              <li>
                <span>{{ $T('ssrc.bidHall.model.bidHall.sourceMethod').$D('寻源方式') }}：{{ headInfo.sourceMethodMeaning }}</span>
                <span>{{ $T('ssrc.bidHall.model.bidHall.sourceStage').$D('招标阶段') }}：{{ headInfo.sourceStageMeaning }}</span>
              </li>
              <li>
                <span>{{ $T('ssrc.bidHall.model.bidHall.subjectMatterRule').$D('标的规则') }}：{{ headInfo.subjectMatterRuleMeaning }}</span>
                <span>{{ $T('ssrc.bidHall.model.bidHall.maxBidNumber').$D('最大中标数') }}：{{ headInfo.maxBidNumber }}</span>
              </li>
              <li>
                <span>{{ $T('ssrc.bidHall.model.bidHall.purchaseOrgName').$D('采购组织名称') }}：{{ headInfo.purOrganizationName }}</span>
              </li>
              <li>
                <span>{{ $T('ssrc.bidHall.model.bidHall.sourcingTemplate').$D('寻源模版') }}：{{ headInfo.templateName }}</span>
              </li>
              <li>
                <span>{{ $T('ssrc.bidHall.model.bidHall.quotationStartDate').$D('投标开始时间') }}：{{ headInfo.quotationStartDate }}</span>
              </li>
              <li>
                <span>{{ $T('ssrc.bidHall.model.bidHall.quotationEndDate').$D('投标截止时间') }}：{{ headInfo.quotationEndDate }}</span>
              </li>
              <li>
                <span>{{ $T('ssrc.bidHall.model.bidHall.bidOpenDate').$D('开标时间') }}：{{ headInfo.bidOpenDate }}</span>
              </li>
              <li>
                <span>{{ $T('ssrc.bidHall.model.bidHall.clarifyEndTime').$D('澄清截止时间') }}：{{ headInfo.clarifyEndTime }}</span>
              </li>
              <li>
                <span>{{ $T('ssrc.bidHall.model.bidHall.purchaseAgentName').$D('采购员') }}：{{ headInfo.purchaserName }}</span>
              </li>
              <li>
                <span>{{ $T('ssrc.bidHall.model.bidHall.paymentType').$D('付款方式') }}：{{ headInfo.attributeVarchar5 }}</span>
              </li>
              <li>
                <span>{{ $T('ssrc.bidHall.model.bidHall.paymentTerm').$D('付款条款') }}：{{ headInfo.attributeVarchar6 }}</span>
              </li>
              <li>
                <span>{{ $T('ssrc.bidHall.model.bidHall.totalBudget').$D('预算金额') }}：{{ headInfo.totalBudget }}</span>
                <span>
                  {{ $T('ssrc.bidHall.view.message.modal.bidMembers').$D('招标小组') }}：
                  <span
                    class="fileBtn"
                    @click="getTenderingGroup">{{ $T('hipspfm.common.button.view').$D('查看') }}</span>
                </span>
              </li>
              <li>
                <span>
                  {{ $T('ssrc.bidHall.model.bidHall.businessAttachments').$D('商务附件') }}：
                  <span
                    class="fileBtn"
                    @click="showFilePop(headInfo.businessAttachmentUuid)">{{ $T('hipspfm.common.button.viewAttachments').$D('查看附件') }}</span>
                </span>
                <span>
                  {{ $T('ssrc.bidHall.model.bidHall.techAttachments').$D('技术附件') }}：
                  <span
                    class="fileBtn"
                    @click="showFilePop(headInfo.techAttachmentUuid)">{{ $T('hipspfm.common.button.viewAttachments').$D('查看附件') }}</span>
                </span>
              </li>
            </ul>
          </div>
        </div>
        <!-- 物料明细 -->
        <div ref="lineInfo" class="infoContent">
          <h3>{{ $T("ssrc.bidHall.view.message.tab.itemDetails").$D("物料明细") }}</h3>
          <div v-if="JSON.stringify(materialDetail) == '[]'" class="noContent">
            <span>{{ $T("hipspfm.common.view.message.title.noData").$D("暂无数据") }}</span>
          </div>
          <hips-collapse
            v-if="headInfo.subjectMatterRule==='PACK'"
            v-model="activeNames"
            class="collapse-thine">
            <hips-collapse-item v-for="(item,index) in materialDetail" :key="index" :name="index">
              <div slot="title">
                <div class="line-head">
                  <span class="line-name noWrap">{{ item.sectionName }}</span>
                  <span class="look-btn" @click.stop="getSupplierAssigned(item.bidLineItemId)">
                    {{ $T("ssrc.bidHall.model.bidHall.viewSupplier").$D("查看供应商") }}
                    <img
                      src="@/assets/icon_list_right_highlight@3x.png">
                  </span>
                </div>
                <div class="line-body">
                  <div>
                    <span
                      class="line-code">{{ $T("ssrc.bidHall.model.bidHall.sectionPacNum").$D("标段/包编号") }}:{{ item.sectionNum }}</span>
                    <span
                      class="line-number">{{ $T("ssrc.bidHall.model.bidHall.lineNo").$D("行号") }}:{{ item.bidLineItemNum }}</span>
                  </div>
                  <span class="line-prompt">
                    {{ activeNames&&activeNames.join('').includes(index)?
                      $T("hipspfm.bidHall.view.button.hide").$D("收起"):
                      $T("hipspfm.bidHall.view.button.show").$D("展开")
                    }}
                    <img
                      :src="activeNames&&activeNames.join('').includes(index)?
                        require('@/assets/icon_list_down_grey_normal@3x.png'):
                        require('@/assets/icon_list_right_grey_normal@3x.png')">
                  </span>
                </div>
              </div>
              <div slot="right-icon" class="right-icon"/>
              <div v-for="(ele,i) in item.children" :key="i" class="card">
                <ul>
                  <li class="name-title">
                    <span>{{ $T('ssrc.bidHall.model.bidHall.itemName').$D('物料名称') }}：{{ ele.itemName }}</span>
                  </li>
                  <li>
                    <span>{{ $T('ssrc.bidHall.model.bidHall.itemCategory').$D('物料类别') }}：{{ ele.itemCategoryName }}</span>
                  </li>
                  <li>
                    <span>{{ $T('ssrc.bidHall.modal.inqueryHall.itemCode').$D('物料编码') }}：{{ ele.itemCode }}</span>
                  </li>
                  <li>
                    <span>{{ $T('ssrc.common.model.deliveryDate').$D('交期') }}：{{ ele.demandDate|CalcDate }}</span>
                  </li>
                  <li>
                    <span>{{ $T('ssrc.common.model.guaranteePeriod').$D('质保期') }}：{{ ele.attributeVarchar2 }}</span>
                  </li>
                  <li>
                    <span>{{ $T('ssrc.bidHall.model.bidHall.needNum').$D('需求数量') }}：{{ ele.bidQuantity }}</span>
                    <span>{{ $T('ssrc.bidHall.modal.inqueryHall.unit').$D('单位') }}：{{ ele.uomName }}</span>
                  </li>
                  <li>
                    <span>{{ $T('ssrc.bidHall.model.bidHall.costPrice').$D('标底单价') }}：{{ ele.costPrice }}</span>
                    <span>{{ $T('ssrc.bidHall.model.bidHall.taxRate').$D('税率%') }}：{{ ele.taxRate }}</span>
                  </li>
                  <li>
                    <span>{{ $T('ssrc.common.model.projectNo').$D('项目号') }}：{{ ele.attributeBigint1 }}</span>
                  </li>
                  <li>
                    <span>{{ $T('ssrc.common.model.projectName').$D('项目名称') }}：{{ ele.attributeVarchar1 }}</span>
                  </li>
                  <li>
                    <span>{{ $T('ssrc.common.model.purchaseRequest').$D('采购申请') }}：{{ ele.attributeVarchar3 }}</span>
                  </li>
                  <li>
                    <span>{{ $T('ssrc.bidHall.modal.inqueryHall.businessUnit').$D('业务实体') }}：{{ ele.ouName }}</span>
                  </li>
                  <li>
                    <span>{{ $T('ssrc.bidHall.model.bidHall.inventoryOrg').$D('库存组织') }}：{{ ele.invOrganizationName }}</span>
                  </li>
                  <!-- <li>
                    <span>{{ $T('ssrc.bidHall.model.bidHall.prNum').$D('采购申请号') }}：{{ ele.prNum }}</span>
                  </li> -->
                  <!-- <li>
                    <span>{{ $T('ssrc.bidHall.model.bidHall.lineNum').$D('采购申请行号') }}：{{ ele.prLineNum }}</span>
                  </li> -->
                </ul>
              </div>
            </hips-collapse-item>
          </hips-collapse>
          <div v-else class="card">
            <ul v-for="(item,index) in materialDetail" :key="index">
              <li class="name-title">
                <div
                  class="item-name">
                  {{ $T('ssrc.bidHall.model.bidHall.itemName').$D('物料名称') }}：{{ item.itemName }}
                </div>
                <div
                  class="item-num">
                  {{ $T('ssrc.bidHall.model.bidHall.lineNo').$D('行号') }}：{{ item.bidLineItemNum }}
                </div>
              </li>
              <li>
                <span>{{ $T('ssrc.bidHall.model.bidHall.itemCategory').$D('物料类别') }}：{{ item.itemCategoryName }}</span>
              </li>
              <li>
                <span>{{ $T('ssrc.bidHall.modal.inqueryHall.itemCode').$D('物料编码') }}：{{ item.itemCode }}</span>
              </li>
              <li>
                <span>{{ $T('ssrc.common.model.deliveryDate').$D('交期') }}：{{ item.demandDate|CalcDate }}</span>
              </li>
              <li>
                <span>{{ $T('ssrc.common.model.guaranteePeriod').$D('质保期') }}：{{ item.attributeVarchar2 }}</span>
              </li>
              <li>
                <span>{{ $T('ssrc.bidHall.model.bidHall.needNum').$D('需求数量') }}：{{ item.bidQuantity }}</span>
                <span>{{ $T('ssrc.bidHall.modal.inqueryHall.unit').$D('单位') }}：{{ item.uomName }}</span>
              </li>
              <li>
                <span>{{ $T('ssrc.bidHall.model.bidHall.costPrice').$D('标底单价') }}：{{ item.costPrice }}</span>
                <span>{{ $T('ssrc.bidHall.model.bidHall.taxRate').$D('税率%') }}：{{ item.taxRate }}</span>
              </li>
              <li>
                <span>{{ $T('ssrc.common.model.projectNo').$D('项目号') }}：{{ item.attributeBigint1 }}</span>
              </li>
              <li>
                <span>{{ $T('ssrc.common.model.projectName').$D('项目名称') }}：{{ item.attributeVarchar1 }}</span>
              </li>
              <li>
                <span>{{ $T('ssrc.common.model.purchaseRequest').$D('采购申请') }}：{{ item.attributeVarchar3 }}</span>
              </li>
              <li>
                <span>{{ $T('ssrc.bidHall.modal.inqueryHall.businessUnit').$D('业务实体') }}：{{ item.ouName }}</span>
              </li>
              <li>
                <span>{{ $T('ssrc.bidHall.model.bidHall.inventoryOrg').$D('库存组织') }}：{{ item.invOrganizationName }}</span>
                <span class="card-btn" @click.stop="getSupplierAssigned(item.bidLineItemId)">
                  {{ $T("ssrc.bidHall.model.bidHall.viewSupplier").$D("查看供应商") }}
                  <img
                    src="@/assets/icon_list_right_highlight@3x.png">
                </span>
              </li>
              <!-- <li>
                <span>{{ $T('ssrc.bidHall.model.bidHall.prNum').$D('采购申请号') }}：{{ item.prNum }}</span>
              </li> -->
              <!-- <li>
                <span>{{ $T('ssrc.bidHall.model.bidHall.lineNum').$D('采购申请行号') }}：{{ item.prLineNum }}</span>
                <span class="card-btn" @click.stop="getSupplierAssigned(item.bidLineItemId)">
                  {{ $T("ssrc.bidHall.model.bidHall.viewSupplier").$D("查看供应商") }}
                  <img
                    src="@/assets/icon_list_right_highlight@3x.png"
                  />
                </span>
              </li> -->
            </ul>
          </div>
        </div>
        <!-- 资格预审 -->
        <div v-if="headInfo.preQualificationFlag" ref="placeInfo" class="infoContent">
          <h3>{{ $T("ssrc.bidHall.view.tab.preQualification").$D("资格预审") }}</h3>
          <div class="card">
            <ul>
              <li>
                <span>{{ $T('ssrc.bidHall.model.bidHall.prequalEndDate').$D('预审截止时间') }}：{{ headInfo.prequalEndDate }}</span>
              </li>
              <li>
                <span>{{ $T('ssrc.bidHall.model.bidHall.reviewMethod').$D('审查方法') }}：{{ headInfo.reviewMethodMeaning }}</span>
                <span>{{ $T('ssrc.bidHall.model.bidHall.qualifiedLimit').$D('合格上限') }}：{{ headInfo.qualifiedLimit }}</span>
              </li>
              <li class="wrap">
                <span>{{ $T('ssrc.bidHall.model.bidHall.prequalLocation').$D('申请提交地点') }}：{{ headInfo.prequalLocation }}</span>
              </li>
              <li>
                <span>
                  {{ $T('ssrc.bidHall.model.bidHall.prequalFile').$D('资格预审文件') }}：
                  <span
                    class="fileBtn"
                    @click="showFilePop(headInfo.prequalAttachmentUuid)">{{ $T('ssrc.bidHall.view.message.button.view').$D('查看') }}</span>
                </span>
              </li>
            </ul>
          </div>
        </div>
        <!-- 专家 -->
        <div v-if="headInfo.expertScoreType === 'ONLINE'" ref="expertsInfo" class="infoContent">
          <h3>{{ $T("ssrc.bidHall.view.tab.professional").$D("专家") }}</h3>
          <div v-if="expertsInfo" class="card">
            <ul v-for="(item,index) in expertsInfo" :key="index">
              <li class="name-title">
                <span>{{ $T('ssrc.bidHall.model.scoring.expertName').$D('姓名') }}：{{ item.expertName }}</span>
                <div
                  v-if="item.evaluateLeaderFlagMeaning"
                  class="name-tag">
                  {{ item.evaluateLeaderFlagMeaning }}
                </div>
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
          <div v-else class="noContent">
            <span>{{ $T("hipspfm.common.view.message.title.noData").$D("暂无数据") }}</span>
          </div>
        </div>
        <!-- 评分要素 -->
        <div v-if="headInfo.expertScoreType === 'ONLINE'" ref="indicsInfo" class="infoContent">
          <h3>{{ $T("ssrc.bidHall.view.tab.scoringElements").$D("评分要素") }}</h3>
          <div
            v-if="scoringElements&&(JSON.stringify(scoringElements.businessIndicList) === '[]'&&JSON.stringify(scoringElements.technologyIndicList) === '[]'&&JSON.stringify(scoringElements.otherIndicList) === '[]')"
            class="noContent">
            <span>{{ $T("hipspfm.common.view.message.title.noData").$D("暂无数据") }}</span>
          </div>
          <div
            v-if="scoringElements&&JSON.stringify(scoringElements.businessIndicList) !== '[]'"
            class="card">
            <div class="sub-single-title">
              <div>{{ $T("ssrc.bidHall.model.bidHall.businessTeam").$D("商务组") }}</div>
              <span
                class="percent"
                :style="Number(scoringElements.businessIndicList&&scoringElements.businessIndicList[0].businessWeight) > 40 ? 'color:var(--color-other-default-b)':''">{{ $T("ssrc.score.model.score.businessWeight").$D("评分权重") }}: {{ scoringElements.businessIndicList&&scoringElements.businessIndicList[0].businessWeight }}%</span>
            </div>
            <ul v-for="(item,index) in scoringElements.businessIndicList" :key="index">
              <li class="name-title">
                <span>{{ $T('ssrc.bidHall.model.bidHall.indicateType').$D('要素类型') }}：{{ item.indicateTypeMeaning }}</span>
              </li>
              <li>
                <span>{{ $T('ssrc.bidHall.model.bidHall.indicateCode').$D('要素编码') }}：{{ item.indicateCode }}</span>
              </li>
              <li>
                <span>{{ $T('ssrc.bidHall.model.bidHall.maxScore').$D('最高分') }}：{{ item.maxScore }}</span>
                <span>{{ $T('ssrc.bidHall.model.bidHall.minScore').$D('最低分') }}：{{ item.minScore }}</span>
              </li>
              <li>
                <span>{{ $T('ssrc.bidHall.model.bidHall.weight').$D('权重') }}：{{ item.weight }}</span>
                <span>
                  {{ $T('ssrc.bidHall.model.bidHall.expertAssign').$D('专家分配') }}：
                  <span
                    class="fileBtn"
                    @click="showExpertInfo(item.team, item.evaluateIndicId)">{{ $T('ssrc.bidHall.view.message.button.view').$D('查看') }}</span>
                </span>
              </li>
              <li>
                <span>{{ $T('ssrc.bidHall.model.bidHall.indicateName').$D('评分要素') }}：{{ item.indicateName }}</span>
              </li>
              <li class="wrap">
                <span>{{ $T('ssrc.bidHall.model.bidHall.remark').$D('评分细则') }}：{{ item.indicateRemark }}</span>
              </li>
            </ul>
          </div>
          <div
            v-if="scoringElements&&JSON.stringify(scoringElements.technologyIndicList) !== '[]'"
            class="card">
            <div class="sub-single-title">
              <div>{{ $T("ssrc.bidHall.model.bidHall.technologyTeam").$D("技术组") }}</div>
              <span
                class="percent"
                :style="Number(scoringElements.technologyIndicList&&scoringElements.technologyIndicList[0].technologyWeight) > 40 ? 'color:var(--color-other-default-b)':''">{{ $T("ssrc.score.model.score.technologyWeight").$D("评分权重") }}: {{ scoringElements.technologyIndicList&&scoringElements.technologyIndicList[0].technologyWeight }}%</span>
            </div>
            <ul v-for="(item,index) in scoringElements.technologyIndicList" :key="index">
              <li class="name-title">
                <span>{{ $T('ssrc.bidHall.model.bidHall.indicateType').$D('要素类型') }}：{{ item.indicateTypeMeaning }}</span>
              </li>
              <li>
                <span>{{ $T('ssrc.bidHall.model.bidHall.indicateCode').$D('要素编码') }}：{{ item.indicateCode }}</span>
              </li>
              <li>
                <span>{{ $T('ssrc.bidHall.model.bidHall.maxScore').$D('最高分') }}：{{ item.maxScore }}</span>
                <span>{{ $T('ssrc.bidHall.model.bidHall.minScore').$D('最低分') }}：{{ item.minScore }}</span>
              </li>
              <li>
                <span>{{ $T('ssrc.bidHall.model.bidHall.weight').$D('权重') }}：{{ item.weight }}</span>
                <span>
                  {{ $T('ssrc.bidHall.model.bidHall.expertAssign').$D('专家分配') }}：
                  <span
                    class="fileBtn"
                    @click="showExpertInfo(item.team, item.evaluateIndicId)">{{ $T('ssrc.bidHall.view.message.button.view').$D('查看') }}</span>
                </span>
              </li>
              <li>
                <span>{{ $T('ssrc.bidHall.model.bidHall.indicateName').$D('评分要素') }}：{{ item.indicateName }}</span>
              </li>
              <li class="wrap">
                <span>{{ $T('ssrc.bidHall.model.bidHall.remark').$D('评分细则') }}：{{ item.indicateRemark }}</span>
              </li>
            </ul>
          </div>
          <div
            v-if="scoringElements&&JSON.stringify(scoringElements.otherIndicList) !== '[]'"
            class="card">
            <ul v-for="(item,index) in scoringElements.otherIndicList" :key="index">
              <li class="name-title">
                <span>{{ $T('ssrc.bidHall.model.bidHall.indicateType').$D('要素类型') }}：{{ item.indicateTypeMeaning }}</span>
              </li>
              <li>
                <span>{{ $T('ssrc.bidHall.model.bidHall.indicateCode').$D('要素编码') }}：{{ item.indicateCode }}</span>
              </li>
              <li>
                <span>{{ $T('ssrc.bidHall.model.bidHall.maxScore').$D('最高分') }}：{{ item.maxScore }}</span>
                <span>{{ $T('ssrc.bidHall.model.bidHall.minScore').$D('最低分') }}：{{ item.minScore }}</span>
              </li>
              <li>
                <span>{{ $T('ssrc.bidHall.model.bidHall.weight').$D('权重') }}：{{ item.weight }}</span>
                <span>
                  {{ $T('ssrc.bidHall.model.bidHall.expertAssign').$D('专家分配') }}：
                  <span
                    class="fileBtn"
                    @click="showExpertInfo(item.team, item.evaluateIndicId)">{{ $T('ssrc.bidHall.view.message.button.view').$D('查看') }}</span>
                </span>
              </li>
              <li>
                <span>{{ $T('ssrc.bidHall.model.bidHall.indicateName').$D('评分要素') }}：{{ item.indicateName }}</span>
              </li>
              <li class="wrap">
                <span>{{ $T('ssrc.bidHall.model.bidHall.remark').$D('评分细则') }}：{{ item.indicateRemark }}</span>
              </li>
            </ul>
          </div>
        </div>
        <!-- 供应商 -->
        <div ref="supplierInfo" class="infoContent">
          <h3>{{ $T("ssrc.bidHall.view.message.tab.supplierList").$D("供应商列表") }}</h3>
          <div v-if="JSON.stringify(supplierInfo) == '[]'" class="noContent">
            <span>{{ $T("hipspfm.common.view.message.title.noData").$D("暂无数据") }}</span>
          </div>
          <div class="card">
            <ul v-for="(item,index) in supplierInfo" :key="index">
              <li class="name-title">
                <div class="item-name noWrap">{{ item.supplierCompanyName }}</div>
                <div v-if="item.stageDescription" class="name-tag">{{ item.stageDescription }}</div>
              </li>
              <li>
                <span>{{ $T('ssrc.bidHall.model.bidHall.supplierCode').$D('编码') }}：{{ item.supplierCompanyNum }}</span>
              </li>
              <li class="wrap">
                <span>{{ $T('ssrc.bidHall.model.bidHall.contacts').$D('联系人') }}：{{ item.contactName }}</span>
                <span>{{ $T('ssrc.bidHall.model.bidHall.contactPhone').$D('手机号') }}：{{ item.contactMobilephone }}</span>
              </li>
              <li>
                <span>{{ $T('ssrc.bidHall.model.bidHall.contactMail').$D('邮箱') }}：{{ item.contactMail }}</span>
              </li>
            </ul>
          </div>
        </div>
        <!-- 招标公告 -->
        <div ref="biddingNotice" class="infoContent">
          <h3>{{ $T("ssrc.bidHall.view.tab.tenderNotice").$D("招标公告") }}</h3>
          <div class="card">
            <ul>
              <li>
                <span>{{ $T('ssrc.bidHall.model.bidHall.noticeNum').$D('编号') }}：{{ headInfo.noticeNum }}</span>
              </li>
              <li>
                <span>{{ $T('ssrc.bidHall.model.bidHall.noticeStatus').$D('状态') }}：{{ headInfo.noticeStatusMeaning }}</span>
                <span>
                  {{ $T('ssrc.bidHall.model.bidHall.noticeAttachment').$D('附件') }}：
                  <span
                    class="fileBtn"
                    @click="showFilePop(headInfo.noticeAttachmentUuid,'notice')">{{ $T('ssrc.bidHall.view.message.button.view').$D('查看') }}</span>
                </span>
              </li>
              <li class="wrap">
                <span>{{ $T('ssrc.bidHall.view.message.tab.otherInfos').$D('物料信息') }}：{{ headInfo.remark }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <!-- 行附件弹窗 -->
    <attached-file
      v-model="filePopup"
      :attachment-uuid="attachmentUuid"
      :bucket-name="bucketName"
      :query-params="{tenantId}"/>
    <!-- 专家信息详情弹窗 -->
    <supplier-info v-model="expertInfoPop" date-type="expert" :experts-assign-info="expertsAssignInfo" />
    <!-- 供应商信息详情弹窗 -->
    <supplier-info
      v-model="supplierInfoPop"
      date-type="supplier"
      :supplier-assign-info="supplierAssignInfo"/>
    <tendering-group v-model="tenderPop" :tendering-group-info="tenderingGroupInfo" />
  </section>
</template>

<script>
// 招投标详情页
import uuid from "uuid";
import BScroll from "better-scroll";
import AttachedFile from "@/components/File/AttachedFile";
import SupplierInfo from "../../../BidDetail/SupplierInfo";
import TenderingGroup from "./components/TenderingGroup";
import { Popup, NavBar, Input, Collapse, CollapseItem } from "hips";
//oldBidDetail import {
//   getExpertAssignedApi,
//   getBiddingSupplierApi,
//   getBiddingHeadInfoApi,
//   getSupplierAssignedApi,
//   getBiddingExpertsInfoApi,
//   getBiddingMaterialDetailApi,
//   getBiddingScoringElementsApi
// } from "../../../../common/BidDetail/api";
//oldBidDetail import { getTenderingGroupApi } from "../../api/Jin";
import { getExpertAssignedApi,
  getBiddingSupplierApi,
  getBiddingHeadInfoApi,
  getSupplierAssignedApi,
  getBiddingExpertsInfoApi,
  getBiddingMaterialDetailApi,
  getBiddingScoringElementsApi,
  getTenderingGroupApi } from "./api";
export default {
  modules: [ "ssrc.bidHall", "hipspfm.workFlow", "hipspfm.common", "hipspfm.bidHall", "ssrc.common", "ssrc.score", "hipspfm.expertScoring", "ssrc.planToInquiry", "ssrc.inquiryHall", "smodr.frightLine" ],
  name: "BiddingBillsApproval",
  components: {
    SupplierInfo,
    AttachedFile,
    TenderingGroup,
    [Input.name]: Input,
    [Popup.name]: Popup,
    [NavBar.name]: NavBar,
    [Collapse.name]: Collapse,
    [CollapseItem.name]: CollapseItem
  },
  props: {
    changeReqId: {
      type: String | Number,
      default: ""
    }
  },
  data() {
    return {
      headInfo: {}, // 头信息
      materialDetail: [],
      supplierInfo: [],
      expertsInfo: {},
      scoringElements: {},
      expertsAssignInfo: [], //专家分配信息
      supplierAssignInfo: [], //专家分配信息
      operationArr: [], //操作记录
      scroll: "",
      navScroll: "",
      activeNames: [],
      filePopup: false,
      bucketName: "private-bucket",
      offsetX: 0,
      show: false,
      ouInfoPop: false,
      supplierInfoPop: false,
      expertInfoPop: false,
      navIndex: 0,
      attachmentUuid: "",
      contentLenArr: [],
      lengthArr: [],
      tenantId: window.localStorage.tenantId,
      tenderPop: false,
      tenderingGroupInfo: []
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
          title: this.$T("ssrc.bidHall.view.message.tab.itemDetails").$D(
            "物料明细"
          ),
          ref: "lineInfo"
        }
      ];
      if (this.headInfo.preQualificationFlag) {
        navArr.push({
          title: this.$T("ssrc.bidHall.view.tab.preQualification").$D(
            "资格预审"
          ),
          ref: "placeInfo"
        });
      }
      if (this.headInfo.expertScoreType === "ONLINE") {
        navArr.push(
          {
            title: this.$T("ssrc.bidHall.view.message.tab.professional").$D(
              "专家"
            ),
            ref: "expertsInfo"
          },
          {
            title: this.$T("ssrc.bidHall.view.tab.scoringElements").$D(
              "评分要素"
            ),
            ref: "indicsInfo"
          }
        );
      }
      navArr.push({
        title: this.$T("ssrc.bidHall.view.message.tab.supplierList").$D(
          "供应商列表"
        ),
        ref: "supplierInfo"
      });
      if (
        this.headInfo.sourceMethod && this.headInfo.sourceMethod === "OPEN" ||
        this.headInfo.sourceMethod === "ALL_OPEN"
      ) {
        navArr.push({
          title: this.$T("ssrc.bidHall.view.tab.tenderNotice").$D("招标公告"),
          ref: "biddingNotice"
        });
      }
      return navArr;
    }
  },
  watch: {
    navIndex(nVal) {
      if ([ 1, 2, 3 ].includes(nVal)) {
        this.offsetX = 90 * (nVal - 1);
      }
      this.navScroll.scrollTo(-this.offsetX, 0, 200, "bounce");
    }
  },
  async mounted() {
    if (this.changeReqId) {
      try {
        this.$loading.show();
        await this.getBiddingHeadInfo();
        await this.getBiddingMaterialDetail();
        await this.getBiddingSupplier();
        await this.getBiddingExpertsInfo();
        await this.getBiddingScoringElements();
        this.$loading.hide();
      } catch (err) {
        this.$loading.hide();
        console.log(err, "error");
      }
    }
    this.$emit(
      "GetApprovalTitle",
      this.$T("hipspfm.workFlow.view.message.title.biddingBillsApproval").$D(
        "招标书发布审批"
      )
    );
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
  },
  methods: {
    // 打开附件弹窗
    showFilePop(attachmentUuid, mark) {
      this.attachmentUuid = attachmentUuid || uuid();
      this.filePopup = !this.filePopup;
      if (mark === "notice") {
        this.bucketName = "public-bucket";
      }
    },
    // 滚动事件
    handlerScroll({ x, y }) {
      this.$handlerScroll(x, y, this);
    },
    // 获取招标单发布审批头信息
    async getBiddingHeadInfo() {
      const params = {
        customizeUnitCode: "SSRC.BID_HALL_DETAIL.HEADER,SSRC.BID_HALL_DETAIL.OTHER.INFO"
      };
      await getBiddingHeadInfoApi(this.changeReqId, params).then((res) => {
        this.headInfo = res;
        console.log("header-cux", res);
      });
    },
    //获取招投标物料明细信息
    async getBiddingMaterialDetail() {
      //晶科二开
      const params = {
        page:0,
        size:10000,
        customizeUnitCode:"SSRC.BID_HALL_DETAIL.ITEM_LINE_NONE",
        path:"/pub/ssrc/bid-hall/bid-detail/:bidId"
      };
      await getBiddingMaterialDetailApi(this.changeReqId, params).then((res) => {
        this.materialDetail = res;
        console.log("materialDetail-cux", this.materialDetail);
      });
    },
    //获取招投标供应商信息
    async getBiddingSupplier() {
      await getBiddingSupplierApi(this.changeReqId).then(
        ({ content = [] } = res) => {
          console.log("supplier", content);
          this.supplierInfo = content;
        }
      );
    },
    //获取招投标专家信息
    async getBiddingExpertsInfo() {
      await getBiddingExpertsInfoApi(this.changeReqId).then((res) => {
        this.expertsInfo = res.evaluateExpertList;
      });
    },
    //获取招投标专家分配信息
    async showExpertInfo(team, evaluateIndicId) {
      await getExpertAssignedApi(team, evaluateIndicId, this.changeReqId).then(
        (res) => {
          this.expertsAssignInfo = res;
          this.expertInfoPop = true;
          console.log(res, "expertsAssignInfo......1111111111");
        }
      );
    },
    //获取招投标供应商分配信息
    async getSupplierAssigned(bidLineItemId) {
      await getSupplierAssignedApi(this.changeReqId, bidLineItemId).then(
        (res) => {
          this.supplierAssignInfo = res;
          this.supplierInfoPop = true;
          console.log(this.supplierAssignInfo, "supplierAssignInfo......");
        }
      );
    },
    //获取招标小组信息
    async getTenderingGroup() {
      await getTenderingGroupApi(this.changeReqId).then((res) => {
        this.tenderingGroupInfo = res;
        this.tenderPop = true;
        console.log("zzzz", res);
      });
    },
    // 获取招投标评分要素信息
    async getBiddingScoringElements() {
      await getBiddingScoringElementsApi(this.changeReqId).then((res) => {
        console.log("scoringElements", res);
        this.scoringElements = res;
      });
    }
  }
};
</script>

<style scoped  lang="stylus">
.blackFont {
  color: var(--color-font-default);
}

.closeFont {
  color: var(--color-font-default-c) !important;
  border-color: var(--color-font-default-c) !important;
}

.mainDetail {
  .navWrap {
    width: 100%;
    height: 44px;
    // overflow-x: auto;
    position: relative;
    z-index: 999;

    &::-webkit-scrollbar {
      display: none;
    }

    .navContent {
      width: 200%;
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
      .infoContent {
        h3 {
          padding: 20px 20px 12px;
          font-size: 18px;
          color: var(--color-font-default);
          line-height: 26.1px;
          font-weight: 700;
          background: var(--color-bg-default-b);
        }
      }

      .noContent {
        height: 78px;
        padding-left: 20px;

        span {
          position: relative;
          top: 16px;
          font-family: PingFangSC-Medium;
          font-size: 14px;
          color: var(--color-font-default-b);
          letter-spacing: 0;
          line-height: 22px;
        }
      }
    }
  }
}

>>> .hips-cell {
  padding: 14px 20px;
}

.collapse-thine {
  >>> .hips-cell {
    position: static;
    border-bottom: 1px solid var(--color-border-default);
  }

  >>> .hips-collapse-item:not(:last-child) {
    border-bottom: 8px solid var(--color-border-default);
  }
}

.wrap {
  height: auto !important;
  line-height: 24px !important;
}

.line-head {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .line-name {
    font-size: 16px;
    color: var(--color-font-default);
    line-height: 24px;
    font-weight: bold;
    display: inline-block;
    // width: 245px;
  }

  .look-btn {
    display: flex;
    align-items: center;
    margin-left: 15px;
    font-size: 12px;
    color: var(--color-other-default-b);
    line-height: 20px;

    img {
      height: 16px;
      width: 16px;
    }
  }
}

.line-body {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .line-code {
    height: 20px;
    line-height: 20px;
    display: inline-block;
    padding: 0 4px;
    font-size: 10px;
    color: var(--color-font-default-c);
    border-radius: 2px;
    background: var(--color-bg-default-d);
  }

  .line-number {
    height: 20px;
    line-height: 20px;
    display: inline-block;
    margin-left: 8px;
    padding: 0 4px;
    font-size: 10px;
    color: var(--color-other-default-b);
    line-height: 18px;
    border-radius: 2px;
    background: var(--color-bg-default-c);
  }

  .line-prompt {
    display: flex;
    align-items: center;
    font-size: 12px;
    color: var(--color-font-default-b);
    text-align: right;
    line-height: 20px;

    img {
      height: 16px;
      width: 16px;
    }
  }
}

.card:not(:last-child) {
  border-bottom: 2.133vw solid var(--color-border-default);
}

.card {
  width: 100%;
  color: #666666;
  background: var(--color-bg-default);

  .card-btn {
    font-size: 12px;
    color: var(--color-other-default-b);
    float: right;
    text-align: right;

    img {
      height: 16px;
      width: 16px;
      vertical-align: middle;
    }
  }

  div {
    display: flex;
    justify-content: space-between;
    height: 50px;
    line-height: 50px;

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
    padding: 0 20px;
    font-size: 16px;
    color: var(--color-font-default);
    font-weight: bold;
    line-height: 24px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid var(--color-border-default);

    .percent {
      font-size: 16px;
      color: var(--color-other-default-c);
      text-align: right;
    }
  }

  ul {
    padding: 0 5.333vw 8px 5.333vw;

    li {
      display: flex;
      line-height: 32px;
      // height: 32px;
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

        // overflow: hidden;
        // text-overflow: ellipsis;
        // white-space: nowrap;
        .fileBtn {
          color: var(--color-other-default-b);
        }
      }

      > span:nth-child(1) {
        text-align: left;
      }
    }

    .name-title {
      // display: block;
      display: flex;
      align-items: center;
      position: relative;

      // border-bottom:1px solid var(--color-border-default);
      span:first-child {
        font-size: 14px;
        color: var(--color-font-default);
        line-height: 22px;
        font-weight: bold;
      }

      .name-tag {
        font-size: 10px;
        color: var(--color-other-default-b);
        height: 20px;
        line-height: 20px;
        padding: 0 4px;
        display: inline-block;
        background: var(--color-bg-default-c);
        border-radius: 2px;
        margin-right: 8px;

        &:nth-child(2) {
          margin-left: 12px;
        }
      }

      .item-name {
        line-height: 22px;
        padding: 14px 0;
        font-weight: 700;
        width: 84%;
      }

      .item-num {
        height: 20px;
        margin-left: 8px;
        padding: 0 4px;
        font-size: 10px;
        color: var(--color-other-default-b);
        line-height: 20px;
        border-radius: 2px;
        background: var(--color-bg-default-c);
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
</style>
