<!-- eslint-disable rulesdir/no_hips -->
<template>
  <section v-if="headInfo" class="mainDetail">
    <div ref="navWrap" class="navWrap">
      <ul class="navContent">
        <li
          v-for="(item,index) in getNavArr"
          :key="index"
          :class="{'active': navIndex === index}"
          @click="changeNav(index)">
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
                <span>{{ $T('ssrc.bidHall.model.bidHall.purceOrgName').$D('采购组织名称') }}：{{ headInfo.purOrganizationName }}</span>
              </li>
              <li>
                <span>{{ $T('ssrc.bidHall.model.bidHall.roundNumber').$D('轮次') }}：{{ headInfo.roundNumber }}</span>
                <span>{{ $T('ssrc.bidHall.model.bidHall.versionNumber').$D('版本') }}：{{ headInfo.versionNumber }}</span>
              </li>
              <li>
                <span>{{ $T('ssrc.bidHall.model.bidHall.currencyType').$D('币种') }}：{{ headInfo.currencyCode }}</span>
                <span>{{ $T('ssrc.bidHall.model.bidHall.exchangeRate').$D('汇率') }}：{{ headInfo.exchangeRate }}</span>
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
                <span>{{ $T('ssrc.bidHall.model.bidHall.sourcingTemplate').$D('寻源模版') }}：{{ headInfo.templateName }}</span>
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
          <h3>{{ $T("ssrc.bidHall.view.title.itemLine").$D("物料明细") }}</h3>
          <div v-if="JSON.stringify(materialDetail) === '[]'" class="noContent">
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
                  <span
                    class="look-btn"
                    @click.stop="getSupplierAssigned(bidHeaderId,item.bidLineItemId)">
                    {{ $T("ssrc.bidHall.model.bidHall.viewSupplier").$D("查看供应商") }}
                    <img
                      class="image-blue-default"
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
                      class="image-gray-default"
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
                    <span>{{ $T('ssrc.bidHall.modal.inqueryHall.demandDate').$D('需求日期') }}：{{ ele.demandDate|CalcDate }}</span>
                  </li>
                  <li>
                    <span>{{ $T('ssrc.bidHall.model.bidHall.quantity').$D('需求数量') }}：{{ ele.bidQuantity }}</span>
                    <span>{{ $T('ssrc.bidHall.modal.inqueryHall.unit').$D('单位') }}：{{ ele.uomName }}</span>
                  </li>
                  <li>
                    <span>{{ $T('ssrc.bidHall.model.bidHall.costPrice').$D('标底单价') }}：{{ ele.costPrice }}</span>
                    <span>{{ $T('ssrc.bidHall.model.bidHall.taxRate').$D('税率') }}：{{ ele.taxRate }}</span>
                  </li>
                  <li>
                    <span>{{ $T('ssrc.bidHall.modal.inqueryHall.businessUnit').$D('业务实体') }}：{{ ele.ouName }}</span>
                  </li>
                  <li>
                    <span>{{ $T('ssrc.bidHall.model.bidHall.inventoryOrg').$D('库存组织') }}：{{ ele.invOrganizationName }}</span>
                  </li>
                  <li>
                    <span>{{ $T('ssrc.bidHall.model.bidHall.prNum').$D('采购申请号') }}：{{ ele.prNum }}</span>
                  </li>
                  <li>
                    <span>{{ $T('ssrc.bidHall.model.bidHall.lineNum').$D('采购申请行号') }}：{{ ele.prLineNum }}</span>
                  </li>
                </ul>
              </div>
            </hips-collapse-item>
          </hips-collapse>
          <div v-else class="card">
            <ul v-for="(item,index) in materialDetail" :key="index">
              <li class="name-title">
                <div
                  class="item-name noWrap">
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
                <span>{{ $T('ssrc.bidHall.modal.inqueryHall.demandDate').$D('需求日期') }}：{{ item.demandDate|CalcDate }}</span>
              </li>
              <li>
                <span>{{ $T('ssrc.bidHall.model.bidHall.quantity').$D('需求数量') }}：{{ item.bidQuantity }}</span>
                <span>{{ $T('ssrc.bidHall.modal.inqueryHall.unit').$D('单位') }}：{{ item.uomName }}</span>
              </li>
              <li>
                <span>{{ $T('ssrc.bidHall.model.bidHall.costPrice').$D('标底单价') }}：{{ item.costPrice }}</span>
                <span>{{ $T('ssrc.bidHall.model.bidHall.taxRate').$D('税率') }}：{{ item.taxRate }}</span>
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
                  class="card-btn"
                  @click.stop="getSupplierAssigned(bidHeaderId,item.bidLineItemId)">
                  {{ $T("ssrc.bidHall.model.bidHall.viewSupplier").$D("查看供应商") }}
                  <img
                    class="image-blue-default"
                    src="@/assets/icon_list_right_highlight@3x.png">
                </span>
              </li>
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
                <span>{{ $T('ssrc.bidHall.model.bidHall.userName').$D('用户名') }}：{{ item.loginName }}</span>
              </li>
              <li>
                <span>{{ $T('ssrc.bidHall.model.bidHall.expertType').$D('专家类型') }}：{{ item.expertTypeMeaning }}</span>
                <span>{{ $T('ssrc.bidHall.model.bidHall.expertLevel').$D('专家级别') }}：{{ item.expertLevelMeaning }}</span>
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
                :style="Number(scoringElements.businessIndicList[0].businessWeight) > 40 ? 'color:var(--color-other-default-b)':''">{{ $T("ssrc.score.model.score.businessWeight").$D("评分权重") }}: {{ scoringElements.businessIndicList[0].businessWeight }}%</span>
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
                :style="Number(scoringElements.technologyIndicList[0].technologyWeight) > 40 ? 'color:var(--color-other-default-b)':''">{{ $T("ssrc.score.model.score.technologyWeight").$D("评分权重") }}: {{ scoringElements.technologyIndicList[0].technologyWeight }}%</span>
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
          <div v-if="JSON.stringify(supplierInfo) === '[]'" class="noContent">
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
                <span>{{ $T('ssrc.bidHall.view.message.tab.otherInfos').$D('其他信息') }}：{{ headInfo.remark }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div v-if="getOpenFlag(bidOpenDate)" @click.stop="showTenderPop">
      <bottom-handler :btn-arr="btnArr" />
    </div>
    <!-- 行附件弹窗 -->
    <attached-file
      v-model="filePopup"
      :attachment-uuid="attachmentUuid"
      :bucket-name="bucketName"
      :query-params="{tenantId}"/>
    <!-- 开标弹窗 -->
    <open-tender v-model="tenderPopup" :tender-arr="tenderArr" :bid-header-id="bidHeaderId" />
  </section>
</template>
<!--eslint-disable-->
<script>
// 招投标详情页
import uuid from "uuid";
import moment from "moment";
import BScroll from "better-scroll";
import OpenTender from "../../modules/TenderingHall/components/OpenTender";
import BottomHandler from "@/components/BottomHandler";
import AttachedFile from "@/components/File/AttachedFile";
import { Popup, NavBar, Input, Collapse, CollapseItem } from "hips";
//oldBidDetail import { getTenderApi } from "../../common/BidDetail/api";

import { getTenderApi } from "./api";
export default {
  modules: [ "ssrc.bidHall", "hipspfm.common", "hipspfm.bidHall", "ssrc.score" ],
  name: "BidDetailTabScroll",
  components: {
    OpenTender,
    AttachedFile,
    BottomHandler,
    [Input.name]: Input,
    [Popup.name]: Popup,
    [NavBar.name]: NavBar,
    [Collapse.name]: Collapse,
    [CollapseItem.name]: CollapseItem
  },
  props: {
    headInfo: {
      type: Object,
      default: {}
    },
    supplierInfo: Array,
    expertsInfo: Array,
    materialDetail: Array,
    scoringElements: Object,
    showExpertInfo: Function,
    getSupplierAssigned: Function
  },
  data() {
    return {
      scroll: "",
      navScroll: "",
      activeNames: [],
      filePopup: false,
      bucketName: "private-bucket",
      offsetX: 0,
      show: false,
      ouInfoPop: false,
      expertInfoPop: false,
      navIndex: 0,
      attachmentUuid: "",
      contentLenArr: [],
      lineInfoDetail: {},
      lengthArr: [],
      btnArr: [
        {
          title: this.$T("ssrc.bidHall.model.bidHall.openingBid").$D("开标"),
          color: "var(--color-other-default-b)",
          handler: () => {}
        }
      ],
      bidHeaderId: null,
      bidOpenDate: null,
      tenderArr: [],
      tenderPopup: false, // 开标弹窗
      tenantId: window.localStorage.tenantId
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
    },
    getOpenFlag(bidOpenDate) {
      return function(bidOpenDate) {
        let NowTime = moment().format("YYYY-MM-DD HH:mm:ss");
        return moment(bidOpenDate).isSameOrBefore(NowTime);
      };
    }
  },
  watch: {
    lineInfo: {
      handler() {
        this.refreshScroll();
      },
      immediate: true
    },
    activeNames: {
      handler() {
        setTimeout(() => this.refreshScroll(), 100);
      },
      deep: true
    },
    navIndex(nVal) {
      if ([ 1, 2, 3 ].includes(nVal)) {
        this.offsetX = 90 * (nVal - 1);
      }
      this.navScroll.scrollTo(-this.offsetX, 0, 200, "bounce");
    }
  },
  mounted() {
    const { sourceHeaderId, bidHeaderId, bidOpenDate } = this.$store.getters['ExpertRating/getTenderHallList'];
    console.log(bidOpenDate, bidHeaderId, 66666);

    this.bidHeaderId = bidHeaderId || sourceHeaderId;
    this.bidOpenDate = bidOpenDate;
    this.$nextTick(() => {
      this.navScroll = new BScroll(this.$refs.navWrap, {
        scrollX: true,
        click: true
      });
      this.scroll = new BScroll(this.$refs.wrapper, {
        scrollY: true,
        click: true,
        probeType: 3
      });
      this.scroll.on("scroll", this.handlerScroll);
    });
  },
  methods: {
    // 切换tab
    changeNav(index) {
      this.navIndex = index;
      const newArr = this.contentLenArr.slice(0, index);
      const offsetLen = newArr.length > 0 ? newArr.reduce((a, b) => a + b) : 0;
      this.$nextTick(() => {
        this.scroll.scrollTo(0, -offsetLen, 200, "bounce");
      });
    },
    // 打开附件弹窗
    showFilePop(attachmentUuid, mark) {
      this.attachmentUuid = attachmentUuid || uuid();
      this.filePopup = !this.filePopup;
      if (mark === "notice") {
        this.bucketName = "public-bucket";
      }
    },
    refreshScroll() {
      this.$nextTick(() => {
        this.contentLenArr = this.getNavArr.map(
          (item) => this.$refs[item.ref].offsetHeight
        );
        const oHeight = this.contentLenArr.reduce((a, b) => a + b) + 220;
        this.$refs.content.style.height = 100 / 667 * oHeight + "vh";
        this.scroll && this.scroll.refresh();
      });
    },
    // 滚动事件
    handlerScroll({ x, y }) {
      this.lengthArr.length ||
        (this.lengthArr = this.contentLenArr.reduce(
          (pre, cur) => [ ...pre, pre[pre.length - 1] - cur ],
          [ 0 ]
        ));
      let contentLenArrLength = this.contentLenArr.length;
      const index =
        this.lengthArr
          .concat(y)
          .sort((a, b) => b - a)
          .lastIndexOf(y) - 1;
      this.navIndex =
        index > contentLenArrLength - 1 ?
          contentLenArrLength - 1 :
          index < 0 ?
            0 :
            index;
    },
    //显示开标弹窗
    showTenderPop() {
      this.tenderPopup = !this.tenderPopup;
      if (this.tenderPopup === true) {
        this.getTender();
      }
    },
    // 获取开标信息
    getTender() {
      this.$loading.show();
      getTenderApi(this.bidHeaderId).then((res) => {
        this.tenderArr = res;
        this.$loading.hide();
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

// .right-icon {
// height: 16px;
// width: 16px;
// background-size: 16px 16px;
// }
// >>>.hips-cell.hips-cell--clickable.hips-thinline.hips-collapse-item__title .right-icon {
// background-image: url('../../assets/icon_list_right_grey_normal@3x.png');
// }

// >>>.hips-cell.hips-cell--clickable.hips-thinline.hips-collapse-item__title.hips-collapse-item__title--expanded .right-icon {
// background-image: url('../../assets/icon_list_down_grey_normal@3x.png');
// }
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
    background: var(--color-bg-default-d, rgba(65, 70, 96, 0.1));
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
