<!-- eslint-disable rulesdir/no_hips -->
<template>
  <section v-if="loading" class="mainDetail">
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
          <div class="detail-info">
            <ul>
              <li>
                <span>{{ $T('spcm.purchaseRequisitionCreation.model.pcName').$D('协议名称') }}：</span>
                <span>{{ headInfo.pcName }}</span>
              </li>
              <li>
                <span>{{ $T('spcm.purchaseRequisitionCreation.model.pcNum').$D('协议编号') }}：</span>
                <span>{{ headInfo.pcNum }}</span>
              </li>
              <li>
                <span>{{ $T('hipspfm.common.message.createTime').$D('创建日期') }}：</span>
                <span>{{ headInfo.creationDate }}</span>
              </li>
              <li>
                <span>{{ $T('spcm.common.model.common.amount').$D('协议总额') }}：</span>
                <span>{{ headInfo.taxIncludeAmount|CalcMoney }}</span>
              </li>
              <li>
                <span>{{ $T('entity.organization.class.createName').$D('创建人') }}：</span>
                <span>{{ headInfo.createByRealName }}</span>
              </li>
              <li>
                <span>{{ $T('spcm.common.model.companyName').$D('公司') }}：</span>
                <span>{{ headInfo.companyName }}</span>
              </li>
              <li>
                <span>{{ $T("scux.ProjectCodeProgramCode.view.projectCode").$D("Project Code") }}：</span>
                <span>{{ headInfo.attributeVarchar10 }}</span>
              </li>
              <li>
                <span>{{ $T("scux.ProjectCodeProgramCode.view.programCode").$D("Program Code") }}：</span>
                <span>{{ headInfo.attributeVarchar11 }}</span>
              </li>
              <li>
                <span>{{ $T('spcm.common.model.supplierCompanyId').$D('供应商') }}：</span>
                <span>{{ headInfo.supplierCompanyName }}</span>
              </li>
              <li>
                <span>{{ $T('spcm.common.model.companyOrgName').$D('公司组织') }}：</span>
                <span>{{ headInfo.companyOrgName }}</span>
              </li>

              <li>
                <span>{{ $T('spcm.common.model.costAnchDepDesc').$D('费用挂靠部门') }}：</span>
                <span>{{ headInfo.costAnchDepDesc }}</span>
              </li>
              <li>
                <span>{{ $T('hipspfm.workFlowAgrement.model.workFlowAgrement.overseasProcurement').$D('是否涉及境外采购') }}：</span>
                <span>{{ headInfo.overseasProcurement?$T("hipspfm.common.status.yes").$D("是"):$T('hipspfm.common.status.no').$D('否') }}</span>
              </li>
              <li>
                <span>{{ $T('spcm.common.model.common.pcKindCode').$D('协议性质') }}：</span>
                <span>{{ headInfo.pcKindCodeMeaning }}</span>
              </li>

              <li>
                <span>{{ $T('spcm.common.model.common.pcType').$D('协议类型') }}：</span>
                <span>{{ headInfo.pcTypeName }}</span>
              </li>
              <li>
                <span>{{ $T('spcm.common.model.common.pcTemplateId').$D('协议模版') }}：</span>
                <span>{{ headInfo.templateName }}</span>
              </li>
              <li>
                <span>{{ $T('spcm.common.model.startDateActive').$D('协议起始日期') }}：</span>
                <span>{{ headInfo.startDateActive|CalcDate }}</span>
              </li>
              <li>
                <span>{{ $T('spcm.common.model.endDateActive').$D('协议终止日期') }}：</span>
                <span>{{ headInfo.endDateActive|CalcDate }}</span>
              </li>
              <li>
                <span>{{ $T('spcm.common.model.mainPcNum').$D('主协议') }}：</span>
                <span>{{ headInfo.mainPcNum }}</span>
              </li>
              <li>
                <span>{{ $T('spcm.common.archiveCode').$D('归档码') }}：</span>
                <span>{{ headInfo.archiveCode }}</span>
              </li>
              <li>
                <span>{{ $T('spcm.common.model.ouName').$D('业务实体') }}：</span>
                <span>{{ headInfo.ouName }}</span>
              </li>
              <li>
                <span>{{ $T('hipspfm.workFlowAgrement.model.workFlowAgrement.remark').$D('备注') }}：</span>
                <span>{{ headInfo.remark }}</span>
              </li>
            </ul>
          </div>
        </div>
        <!-- 协议标的 -->
        <div ref="lineInfo" class="infoContent">
          <h3>{{ $T("spcm.common.view.message.title.contractSubject").$D("协议标的") }}</h3>
          <div v-for="(item,index) in lineInfo" :key="index" class="card-info">
            <div class="card" @click="showLineInfoDetail(item)">
              <div>
                <span class="code noWrap">
                  <span/>
                  {{ item.itemName }}
                </span>
                <span class="line-num">
                  <span>{{ $T('spcm.common.model.common.lineNumber').$D('行号') }}：{{ item.displayLineNum }}</span>
                </span>
              </div>
              <ul>
                <li>
                  <span>{{ $T('spcm.common.model.common.itemCode').$D('物品编码') }}：{{ item.itemCode }}</span>
                </li>
                <li>
                  <span>{{ $T('hipspfm.workFlowAgrement.model.workFlowAgrement.quantity').$D('数量') }}：{{ item.quantity }}</span>
                  <span>{{ $T('spcm.common.model.common.noTaxPrice').$D('不含税单价') }}：{{ item.unitPrice|CalcMoney }}</span>
                </li>
                <li>
                  <span>{{ $T('spcm.common.model.common.needByDate').$D('交付日期') }}：{{ item.deliverDate|CalcDate }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <!-- 协议阶段 -->
        <div ref="phaseInfo" class="infoContent">
          <h3>{{ $T("spcm.common.view.message.title.contractStage").$D("协议阶段") }}</h3>
          <div v-if="JSON.stringify(agreementPhaseInfo) === '[]'" class="noContent">
            <span>{{ $T("hipspfm.common.view.message.title.noData").$D("暂无数据") }}</span>
          </div>
          <div v-for="(item,index) in agreementPhaseInfo" v-else :key="index" class="detail-info">
            <div class="sub-title">{{ `${item.stageName}-${item.stageCode}` }}</div>
            <ul>
              <li>
                <span>{{ $T('spcm.common.model.common.stageCode').$D('阶段编码') }}：</span>
                <span>{{ item.stageCode }}</span>
              </li>
              <li>
                <span>{{ $T('spcm.common.model.common.termId').$D('付款条款') }}：</span>
                <span>{{ item.termName }}</span>
              </li>
              <li>
                <span>{{ $T('spcm.common.model.common.costQuantity').$D('费用') }}：</span>
                <span>{{ item.costQuantity|CalcMoney }}</span>
              </li>
              <li>
                <span>{{ $T('spcm.common.model.common.milestoneTime').$D('里程碑时间') }}：</span>
                <span>{{ item.milestoneTime }}</span>
              </li>
            </ul>
          </div>
        </div>
        <!-- 伙伴信息 -->
        <div ref="partnerInfo" class="infoContent">
          <h3>{{ $T("spcm.common.view.message.title.partnerInformation").$D("伙伴信息") }}</h3>
          <div v-for="(item,index) in agreementPartnerInfo" :key="index" class="card-info">
            <div class="card" @click="showPartnerInfo(item)">
              <div>
                <span class="code noWrap">
                  <span/>
                  {{ item.companyName }}
                </span>
                <span class="line-num">
                  <span>{{ item.partnerTypeName }}</span>
                </span>
              </div>
              <ul>
                <li>
                  <span>{{ $T('entity.company.companyCode').$D('公司编码') }}：{{ item.companyNum }}</span>
                </li>
                <li>
                  <span>{{ $T('spcm.common.model.common.legalRepName').$D('代表人') }}：{{ item.legalRepName }}</span>
                  <span>{{ $T('spcm.common.model.common.telNum').$D('联系电话') }}：{{ item.telNum }}</span>
                </li>
                <li>
                  <span>{{ $T('spcm.common.model.common.address').$D('地址') }}：{{ item.address }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <!-- 业务条款 -->
        <div ref="businessInfo" class="infoContent">
          <h3>{{ $T("spcm.common.view.message.title.businessTermsInformation").$D("业务条款") }}</h3>
          <div v-if="JSON.stringify(agreementProcurementInfo) === '[]'" class="noContent">
            <span>{{ $T("hipspfm.common.view.message.title.noData").$D("暂无数据") }}</span>
          </div>
          <div
            v-for="(item,index) in agreementProcurementInfo"
            v-else
            :key="index"
            class="detail-info">
            <div class="sub-title">{{ `${item.termTypeName}-${item.termTypeCode}` }}</div>
            <ul>
              <li>
                <span>{{ $T('spcm.purchaseRequisitionCreation.model.termContent').$D('条款内容') }}：</span>
                <span>{{ item.termContent }}</span>
              </li>
              <li>
                <span>{{ $T('spcm.purchaseRequisitionCreation.model.termRemark').$D('条款说明') }}：</span>
                <span>{{ item.remark }}</span>
              </li>
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
            <img src="@/assets/back@3x.png" class="image-black-default" >
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
        <div class="lineBody">
          <li>
            <span>{{ $T("spcm.common.model.common.MaterialClassify").$D("物料分类") }}：</span>
            <span>{{ lineInfoDetail.categoryName }}</span>
          </li>
          <li>
            <span>{{ $T("spcm.common.model.specifications").$D("规格") }}：</span>
            <span>{{ lineInfoDetail.specifications }}</span>
          </li>
          <li>
            <span>{{ $T("spcm.common.model.common.model").$D("型号") }}：</span>
            <span>{{ lineInfoDetail.model }}</span>
          </li>
          <li>
            <span>{{ $T("spcm.common.model.common.unit:").$D("单位") }}：</span>
            <span>{{ lineInfoDetail.uomName }}</span>
          </li>
          <li>
            <span>{{ $T("spcm.common.model.common.quantity").$D("数量") }}：</span>
            <span>{{ lineInfoDetail.quantity }}</span>
          </li>

          <li>
            <span>{{ $T("spcm.common.model.common.currencyCode").$D("币种") }}：</span>
            <span>{{ lineInfoDetail.currencyCode }}</span>
          </li>
          <li>
            <span>{{ $T("hipspfm.workFlowAgrement.model.workFlowAgrement.unitPrice").$D("预估单价(不含税)") }}：</span>
            <span>{{ lineInfoDetail.unitPrice|CalcMoney }}</span>
          </li>
          <li>
            <span>{{ $T("spcm.common.model.common.lineAmount").$D("行金额(不含税)") }}：</span>
            <span>{{ lineInfoDetail.lineAmount|CalcMoney }}</span>
          </li>
          <li>
            <span>{{ $T("spcm.common.model.common.needByDate").$D("交付日期") }}：</span>
            <span>{{ lineInfoDetail.deliverDate|CalcDate }}</span>
          </li>
          <li>
            <span>{{ $T("spcm.common.model.common.purchaser").$D("采购员") }}：</span>
            <span>{{ lineInfoDetail.agentName }}</span>
          </li>
          <li>
            <span>{{ $T("spcm.common.model.keeperUserName").$D("保管人") }}：</span>
            <span>{{ lineInfoDetail.keeperUserName }}</span>
          </li>
          <li>
            <span>{{ $T("spcm.common.model.accepterUserName").$D("验收人") }}：</span>
            <span>{{ lineInfoDetail.accepterUserName }}</span>
          </li>
          <li>
            <span>{{ $T("spcm.common.model.expBearDep").$D("费用承担部门") }}：</span>
            <span>{{ lineInfoDetail.expBearDep }}</span>
          </li>
          <li>
            <span>{{ $T("hipspfm.workFlowAgrement.model.workFlowAgrement.address").$D("存放地点") }}：</span>
            <span>{{ lineInfoDetail.address }}</span>
          </li>
          <li>
            <span>{{ $T("spcm.common.model.projectCode").$D("项目编码") }}：</span>
            <span>{{ lineInfoDetail.projectNum }}</span>
          </li>
          <li>
            <span>{{ $T("hipspfm.workFlowAgrement.model.workFlowAgrement.remark").$D("备注") }}：</span>
            <span>{{ lineInfoDetail.remark }}</span>
          </li>
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
            <img src="@/assets/back@3x.png" class="image-black-default" >
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
        <div class="lineBody">
          <li>
            <span>{{ $T("spcm.common.model.common.partnerTypeName").$D("伙伴类型") }}：</span>
            <span>{{ partnerInfo.partnerTypeName }}</span>
          </li>
          <li>
            <span>{{ $T("spcm.common.model.common.partnerTypeCode").$D("伙伴类型编码") }}：</span>
            <span>{{ partnerInfo.partnerTypeCode }}</span>
          </li>
          <li>
            <span>{{ $T("spcm.common.model.common.legalRepName").$D("代表人") }}：</span>
            <span>{{ partnerInfo.legalRepName }}</span>
          </li>
          <li>
            <span>{{ $T("spcm.common.model.common.telNum").$D("联系电话") }}：</span>
            <span>{{ partnerInfo.telNum }}</span>
          </li>
          <li>
            <span>{{ $T("spcm.common.model.common.address").$D("地址") }}：</span>
            <span>{{ partnerInfo.address }}</span>
          </li>
          <li>
            <span>{{ $T("spcm.common.model.common.bankName").$D("开户行名称") }}：</span>
            <span>{{ partnerInfo.bankName }}</span>
          </li>
          <li>
            <span>{{ $T("spcm.common.model.common.bankAccountName").$D("账户名称") }}：</span>
            <span>{{ partnerInfo.bankAccountName }}</span>
          </li>
          <li>
            <span>{{ $T("spcm.common.model.common.bankAccountNum").$D("银行账号") }}：</span>
            <span>{{ partnerInfo.bankAccountNum }}</span>
          </li>
          <li>
            <span>{{ $T("spcm.common.model.common.remark").$D("说明") }}：</span>
            <span>{{ partnerInfo.remark }}</span>
          </li>

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
import {
  getAgreementApi,
  getAgreementPhaseApi,
  getAgreementDetailApi,
  getAgreementPartnerApi,
  getAgreementProcurementApi
} from "./api/Hyt";

export default {
  modules: [ "spcm.common", "hipspfm.workFlowAgrement", "spcm.purchaseRequisitionCreation", "hipspfm.common", "entity.organization", "entity.company", "scux.ProjectCodeProgramCode" ],
  name: "YHLAgreementApproval",
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
      scroll: "",
      loading: false,
      show: false,
      navScroll: "",
      attachmentUuid: "",
      filePopup: false,
      navIndex: 0,
      operateType: "",
      operatesPop: false,
      contentLenArr: [],
      lineInfoDetail: {},
      partnerInfo: {},
      partnerInfoFlag: false
    };
  },
  computed: {
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
    lineInfo: {
      handler() {
        this.$nextTick(() => {});
      },
      immediate: true
    },
  },
  created() {
    console.log(this.lineInfo, "协议表的");
    console.log(this.agreementPhaseInfo, "协议阶段");
  },
  async mounted() {
    if (this.changeReqId) {
      try {
        this.$loading.show();
        await this.getAgreementDetail();
        await this.getAgreement();
        await this.getAgreementPhase();
        await this.getAgreementProcurement();
        await this.getAgreementPartner();
        this.loading = true;
        this.$loading.hide();
      } catch (err) {
        this.$loading.hide();
        console.log(err, "error");
      }
    }
    this.$emit(
      "GetApprovalTitle",
      this.$T("hipspfm.workFlowAgrement.view.title.agrementApproval").$D(
        "协议审批"
      )
    );
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
      const params = {
        customizeUnitCode: "SPCM.PURCHASE_CONTRACT_MAINTAIN.DETAIL"
      };
      await getAgreementDetailApi(this.changeReqId, params).then((res) => {
        this.headInfo = res || {};
        let attachmentUuid = this.headInfo.attachmentUuid || uuid();
        this.$emit("GetAttachmentUuid", attachmentUuid);
      });
    },
    //获取协议标的信息
    async getAgreement() {
      const params = {
        customizeUnitCode: "SPCM.PURCHASE_CONTRACT_MAINTAIN.SUBJECT",
        page: 0,
        size: 10
      };
      await getAgreementApi(this.changeReqId, params).then((res) => {
        this.lineInfo = res.content;
      });
    },
    //获取协议阶段详情信息
    async getAgreementPhase() {
      const params = {
        customizeUnitCode: "SPCM.PURCHASE_CONTRACT_MAINTAIN.STAGE",
        page: 0,
        size: 10
      };
      await getAgreementPhaseApi(this.changeReqId, params).then((res) => {
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
      // eslint-disable-next-line no-unused-vars
      const params = {
        customizeUnitCode: "SPCM.PURCHASE_CONTRACT_MAINTAIN.PARTNER",
        page: 0,
        size: 10
      };
      await getAgreementPartnerApi(this.changeReqId).then((res) => {
        this.agreementPartnerInfo = res;
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
        .materiel-name {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          width: 235px;
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
    color: var(--color-font-default);
    text-align: center;
    line-height: 26px;
    font-weight: bold;
  }

  .lineHead {
    padding: 8px 20px 12px;
    background-color: var(--color-font-default-d);
    font-family: 'PingFangSC-Medium';
    color: var(--color-font-default);
    font-size: 16px;
    line-height: 24px;
    border-bottom: 8px solid var(--color-border-default);

    li {
      padding: 0;
      margin-bottom: 9px;
      height: 24px;
      display: flex;
      color: var(--color-font-default-e);
    }

    p {
      span {
        color: var(--color-font-default);
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

    li {
      display: flex;
      padding: 20px 20px 11px 0;
      margin-bottom: 2px;
      margin-left: 20px;
      border-bottom: 1px solid var(--color-border-default);

      &:nth-of-type(1) {
        padding-top: 20px;
      }

      span {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: var(--color-font-default);
        line-height: 22px;

        &:nth-child(1) {
          width: 122px;
        }

        &:nth-child(2) {
          color: var(--color-font-default-b);
          display: inline-block;
          width: 213px;
          text-align: left;
          word-wrap: break-word;
          word-break: break-all;

          img {
            width: 12px;
            height: 12px;
            float: right;
            margin-top: 4px;
          }
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
    color: var(--color-font-default);
    font-weight: bold;
    background: var(--color-bg-default-b);
    border-top: 1px solid var(--color-border-default);
  }

  ul {
    padding-left: 20px;

    li {
      display: flex;
      border-bottom: 1px solid var(--color-border-default);
      padding: 16px 20px 16px 0;

      &:last-child {
        border-bottom: none;
      }

      span {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: var(--color-font-default);
        line-height: 22px;

        img {
          width: 16px;
          height: 16px;
          float: right;
        }
      }

      span:nth-child(1) {
        width: 126px;
      }

      span:nth-child(2) {
        width: 209px;
        color: var(--color-font-default-b);
      }

      span.fileBtn {
        color: var(--color-other-default-b);
      }
    }

    .edit-wrap {
      align-items: center;
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
        color: var(--color-font-default);
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
          color: var(--color-font-default-e);
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
        color: var(--color-font-default);

        &:first-child, &:last-child {
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
</style>
