<!-- eslint-disable rulesdir/no_hips -->
<template>
  <hips-view>
    <hips-nav-bar v-if="showBackFlag" :have-border="false" class="detail-navbar">
      <div slot="left" class="left-button" @click="goBack">
        <img
          src="@/assets/4.0/icon_Navigation bar_left_default b@3x.png"
          class="image-black-default">
        {{ $T("sslm.siteInvestigateReport.view.filling.title").$D("现场考察报告填制") }}
      </div>
      <div slot="right" class="right-button">
        <span>
          <img
            class="image-black-default"
            src="@/assets/4.0/icon_Navbar_top_default_blank@3x.png"
            alt
            @click="goTop">
          <i>|</i>
          <img
            class="image-black-default"
            src="@/assets/4.0/icon_Navbar_closed_default_blank@3x.png"
            alt
            @click="goClose">
        </span>
      </div>
    </hips-nav-bar>

    <div class="tab-scroll">
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
          <div ref="headInfo" class="infoContent headInfo">
            <h3>{{ $T("sslm.siteInvestigateReport.view.tabs.basicInfo").$D("基本信息") }}</h3>
            <div v-if="JSON.stringify(headInfo) === '{}'" class="noContent">
              <span>{{ $T("smbl.common.view.basic.data.none").$D("暂无基本信息") }}</span>
            </div>
            <ul v-else @click="showDeatil">
              <li>
                <span class="has-rgb-blo"/>
                <span>{{ headInfo.evalNum }}</span>
              </li>
              <li>
                <span>{{ $T("sslm.siteInvestigateReport.modal.mange.describe").$D("考察报告描述") }}：</span>
                <span>{{ headInfo.evalDescription }}</span>
              </li>
              <li>
                <span>{{ $T("sslm.siteInvestigateReport.modal.mange.supplier").$D("供应商") }}：</span>
                <span>{{ headInfo.supplierName }}</span>
              </li>
              <li>
                <span>{{ $T("sslm.siteInvestigateReport.modal.mange.company").$D("公司") }}：</span>
                <span>{{ headInfo.companyName }}</span>
              </li>
              <li>
                <span>{{ $T("sslm.siteInvestigateReport.modal.mange.template").$D("考察模板") }}：</span>
                <span>{{ headInfo.evalTplName }}</span>
              </li>
              <li>
                <span>{{ $T("hipspfm.siteInvestigateReport.modal.mange.surveyTime").$D("考察时间") }}：</span>
                <span>{{ headInfo.evalDateFrom|CalcDate }}-{{ headInfo.evalDateTo|CalcDate }}</span>
              </li>
            </ul>
          </div>

          <div ref="lineInfo" class="infoContent lineInfo">
            <h3>{{ $T("sslm.siteInvestigateReport.view.title.scoreInfo").$D("评分信息") }}</h3>
            <div v-if="JSON.stringify(lineInfo) === '[]'" class="noContent">
              <span>{{ $T("sslm.siteInvestigateReport.view.sorce.info.none").$D("暂无评分信息") }}</span>
            </div>
            <div v-else>
              <div v-for="(item,index) in lineInfo" :key="index">
                <!-- <div v-for="(item,index) in 4" :key="index"> -->
                <div class="lineInfo-content lineInfo-first">
                  {{ item.indicatorName }}｜{{ item.indicatorCode }}
                </div>
                <div class="lineInfo-content">
                  <span>{{ $T("sslm.siteInvestigateReport.modal.mange.scoreCriteria").$D("评分标准") }}：{{ item.evalStandard }}</span>
                </div>
                <div v-if="item.indicatorType === 'SCORE'" class="lineInfo-content distance" >
                  <span>{{ $T("sslm.siteInvestigateReport.modal.mange.score").$D("得分") }}
                    <i class="require">*</i>：
                    <i class="can-input">
                      <hips-input
                        v-model="item.score"
                        class="cardNumber"
                        type="text"
                        :required="item.indicatorType === 'SCORE'"
                        @on-change="numberInputCheck(item,'score')"/>
                      <img
                        class="editImg image-gray-default"
                        src="@/assets/4.0/icon_List_editor_normal@3x.png"
                        alt>
                    </i>
                  </span>
                  <span>{{ $T("sslm.siteInvestigateReport.model.sorce.range").$D("分值范围") }}：
                    <i>{{ item.scoreFrom }}-{{ item.scoreTo }}</i>
                  </span>
                </div>
                <div v-if="['TICK', 'VETO'].includes(item.indicatorType)" class="lineInfo-content" @click="openActionSheet(item)">
                  <div v-if="item.indicatorType === 'TICK'" class="option-field">
                    <span>{{ $T("sslm.siteInvestigateReport.modal.scorer.isCriteria").$D("符合评分标准") }}<i class="require">*</i>：</span>
                    <span class="option-field-right">
                      {{ item.isStandard === 1 ? $T("hipspfm.common.status.yes").$D("是") : $T("hipspfm.common.status.no").$D("否") }} <span class="srm-icon icon-chevron-right"/>
                    </span>
                    <!-- <a-checkbox :default-checked="item.isStandard == 1" @change="onStandardChange($event,index)"/> -->
                  </div>
                  <div v-if="item.indicatorType === 'VETO'" class="option-field">
                    <span>{{ $T("sslm.siteInvestigateReport.modal.scorer.isVeto").$D("否决该项") }}<i class="require">*</i>：</span>
                    <span class="option-field-right">
                      {{ item.isVeto === 1 ? $T("hipspfm.common.status.yes").$D("是") : $T("hipspfm.common.status.no").$D("否") }} <span class="srm-icon icon-chevron-right"/>
                    </span>
                    <!-- <a-checkbox :default-checked="item.isVeto == 1" @change="onVetoChange($event,index)"/> -->
                  </div>
                </div>
                <div v-if="['OPT'].includes(item.indicatorType)" class="lineInfo-content" @click="openIndOpt(item)">
                  <div v-if="item.indicatorType === 'OPT'" class="option-field">
                    <span>{{ $T("sslm.common.model.archiveFilled.indOptName").$D("评分选项") }}<i class="require">*</i>：</span>
                    <span class="option-field-right">
                      {{ item.indOptName }} <span class="srm-icon icon-chevron-right"/>
                    </span>
                  </div>
                </div>
                <div class="lineInfo-content">
                  {{ $T("sslm.siteInvestigateReport.modal.common.gradeAttachment").$D("评分附件") }}：<srm-button plain rect @click="openGradeAttachment(item.evalLineId,item.evalHeaderId)">{{ $T("hipspfm.common.button.viewAttachments").$D("查看附件") }}</srm-button>
                </div>
                <div class="lineInfo-content">
                  <div class="option-field">
                    {{ $T("sslm.commonApplication.model.commonApplication.feedbackDescription").$D("反馈备注") }}：
                    <i class="can-input">
                      <hips-input
                        v-model="item.respRemarks"
                        class="cardRemark"
                        type="text"/>
                      <img
                        class="editImg image-gray-default"
                        src="@/assets/4.0/icon_List_editor_normal@3x.png"
                        alt>
                    </i>
                  </div>
                </div>
                <div class="footer">
                  {{ $T("sslm.siteInvestigateReport.modal.mange.weight").$D("权重") }}：{{ item.respWeight }}%
                </div>
              </div>
            </div>
          </div>

          <div ref="materielInfo" class="infoContent headInfo materielInfo">
            <h3>{{ $T("sslm.siteInvestigateReport.view.tabs.reviewMaterialCategory").$D("考察物料/品类") }}</h3>
            <div v-if="JSON.stringify(materielInfo) === '[]'" class="noContent">
              <span>{{ $T("hipspfm.workFlowSiteInspect.model.common.noReviewMaterialCategory").$D("暂无考察物料/品类信息") }}</span>
            </div>
            <div v-else >
              <ul v-for="(item,index) in materielInfo" :key="index">
                <li>
                  <span>{{ $T("sslm.siteInvestigateReport.modal.mange.materialDesc").$D("物料描述") }}：{{ item.itemName }}</span>
                </li>
                <li>
                  <span>{{ $T("sslm.siteInvestigateReport.modal.mange.materialCode").$D("物料编码") }}：{{ item.itemCode }}</span>
                </li>
                <li>
                  <span>{{ $T("sslm.siteInvestigateReport.modal.mange.categoryCode").$D("品类代码") }}：</span>
                  <span>{{ item.itemCategoryCode }}</span>
                </li>
                <li>
                  <span>{{ $T("sslm.siteInvestigateReport.modal.mange.category").$D("品类") }}：</span>
                  <span>{{ item.itemCategoryName }}</span>
                </li>
                <li>
                  <span>{{ $T("sslm.siteInvestigateReport.modal.mange.brand").$D("品牌") }}：</span>
                  <span>{{ item.brand }}</span>
                </li>
                <li>
                  <span>{{ $T("hipspfm.common.message.remark").$D("备注") }}：</span>
                  <span>{{ item.remark }}</span>
                </li>
              </ul>
            </div>
          </div>

          <div ref="groupInfo" class="infoContent headInfo groupInfo">
            <h3>{{ $T("sslm.siteInvestigateReport.view.tabs.inspectTeam").$D("考察小组") }}</h3>
            <div v-if="JSON.stringify(groupInfo) === '[]'" class="noContent">
              <span>{{ $T("hipspfm.workFlowSiteInspect.model.common.noInspectTeam").$D("暂无考察小组信息") }}</span>
            </div>
            <div v-else>
              <ul v-for="(item,index) in groupInfo" :key="index">
                <li class="groupInfo-first">
                  <span>{{ item.member }}
                    <span v-if="item.leaderFlag === 1" class="groupInfo-tip">{{ $T("sslm.siteInvestigateReport.modal.mange.leader").$D("组长") }}</span>
                  </span>
                  <span>{{ item.post }}</span>
                </li>
                <li>
                  <span>{{ $T("sslm.siteInvestigateReport.modal.mange.department").$D("部门") }}：</span>
                  <span>{{ item.department }}</span>
                </li>
                <li>
                  <span>{{ $T("sslm.commonApplication.model.supplierData.email").$D("邮箱") }}：</span>
                  <span>{{ item.email }}</span>
                </li>
                <li>
                  <span>{{ $T("sslm.commonApplication.model.supplierData.phone").$D("电话") }}：</span>
                  <span>{{ item.phone ? item.internationalTelMeaning + " | " + item.phone : "" }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部按钮 -->
    <bottom-handler
      :btn-arr="getBtnArr"/>

    <!-- 附件 -->
    <div v-drag class="fixed-file" @click="showFileList">
      <!-- <srm-upload :show-count="false" :attachment-uuid="attachmentUuid" /> -->
      <img class="fixed-file-img" src="@/assets/attached_file@3x.png" >
    </div>

    <!-- <attached-file v-model="filePopup" :attachment-uuid="attachmentUuid"/> -->
  </hips-view>
</template>

<script>
import { SrmUtil } from "srm-mobile-ui";
import {
  View,
  Popup,
  Input,
  NavBar,
  Scroll,
} from "hips";
import {
  getHeadInfoApi,
  getLineInfoApi,
  getMaterielInfoApi,
  getGroupInfoApi,
  getFileInfoApi,
  getSetLineInfoApi,
  getSaveLineInfoApi,
  fetchIndOpt,
} from "../api/index";
import BScroll from "better-scroll";
import BottomHandler from "@/components/BottomHandler";
// import AttachedFile from "@/components/File/AttachedFile";
import { numberInputCheck1 } from "@/utils/index";
import GradeAttachment from "../component/GradeAttachment";

export default {
  modules: [ "sslm.siteInvestigateReport", "hipspfm.common", "smbl.common", "hipspfm.siteInvestigateReport", "sslm.commonApplication", "hipspfm.workFlow", "hzero.common", "hipspfm.workFlowSiteInspect", "sslm.common" ],
  name: "SiteInvestigateReportDetail",
  components: {
    BottomHandler,
    // AttachedFile,
    [View.name]: View,
    [Input.name]: Input,
    [Popup.name]: Popup,
    [NavBar.name]: NavBar,
    [Scroll.name]: Scroll,
  },
  directives:{
    drag:{
      inserted:function(el) {
        function touchmoveHandle(event) {
          let x = event.targetTouches[0].clientX - 25;

          let y = event.targetTouches[0].clientY - 25;
          const innerWidth = window.innerWidth;
          const innerHeight = window.innerHeight;

          x = x < 0 ? 0 : x > innerWidth - 52 ? innerWidth - 52 : x;
          y = y < 0 ? 0 : y > innerHeight - 52 ? innerHeight - 52 : y;
          el.style.transform = `translate(${x}px, ${y}px)`;
          event.preventDefault();
        }
        // console.log(el,binding)
        el.addEventListener("touchmove", touchmoveHandle, { passive: false });
      }
    }
  },
  data() {
    return {
      headInfo:{},
      lineInfo:[],
      materielInfo:[],
      groupInfo:[],
      scroll: "",
      navIndex: 0,
      lengthArr: [],
      contentLenArr: [],
      // filePopup:false,
      attachmentUuid:[],
      show:false,
      evalHeaderId:"",
      client:{},
      msgJumpFlag:false,
      indOptList:[], // 评分选项下拉内容
      customizeUnitCode:[ "SSLM_SITEINVESTIGATE_FILLING_DETAIL.BASICINFO", "SSLM_SITEINVESTIGATE_FILLING_DETAIL.CATEGORY", "SSLM_SITEINVESTIGATEREPORT.INSPECTTEAM", "SSLM_SITEINVESTIGATEREPORT.ATTACHMENTINFO", "SSLM_SITEINVESTIGATE_FILLING_DETAIL.SCOREINFO", "CSSLM_SITEINVESTIGATE_FILLING_DETAIL.SCORER_INFO" ].join(),
    };
  },
  computed: {
    getNavArr() {
      let navArr = [
        {
          title: this.$T("sslm.siteInvestigateReport.view.tabs.basicInfo").$D(
            "基本信息"
          ),
          ref: "headInfo"
        },
        {
          title: this.$T(
            "sslm.siteInvestigateReport.view.title.scoreInfo"
          ).$D("评分信息"),
          ref: "lineInfo"
        },
        {
          title: this.$T(
            "sslm.siteInvestigateReport.view.tabs.reviewMaterialCategory"
          ).$D("考察物料/品类"),
          ref: "materielInfo"
        },
        {
          title: this.$T(
            "sslm.siteInvestigateReport.view.tabs.inspectTeam"
          ).$D("考察小组"),
          ref: "groupInfo"
        }
      ];

      return navArr;
    },
    getBtnArr() {
      const arr = [
        {
          title: this.$T("hipspfm.common.button.save").$D("保存"),
          color: "var(--color-other-default-b)",
          background: "var(--color-bg-default)",
          handler: () => {
            this.toSave();
          }
        },
        {
          title: this.$T("hipspfm.common.button.submit").$D("提交"),
          color: "var(--color-font-default-d)",
          background: "var(--color-other-default-b)",
          handler: () => {
            this.toSubmit();
          }
        }
      ];

      return arr;

    }
  },
  async mounted() {
    const { evalHeaderId, msgJumpFlag } = this.$route.query;

    this.msgJumpFlag = msgJumpFlag;
    this.evalHeaderId = evalHeaderId;
    try {
      this.$loading.show();
      await this.getHeadInfo(evalHeaderId);
      await this.getLineInfo(evalHeaderId);
      await this.getMaterielInfo(evalHeaderId);
      await this.getGroupInfo(evalHeaderId);
      await this.getFileInfo(evalHeaderId);
      this.$loading.hide();
    } catch (err) {
      this.finishLoad = true;
      this.$loading.hide();
      console.log(err, "error");
    }

    this.$nextTick(() => {
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
    //打开评分附件
    openGradeAttachment(evalLineId, evalHeaderId) {
      this.$popup({
        title: this.$T("hipspfm.common.button.viewAttachments").$D("查看附件"),
        showHeader: true,
        showClose: true,
        height: "565px",
        rounded: true,
        content: <GradeAttachment evalLineId={evalLineId} evalHeaderId={evalHeaderId}/>
      });
    },
    async getHeadInfo(evalHeaderId) {
      await getHeadInfoApi(evalHeaderId).then((res) => {
        if (res && !res.failed) {
          this.headInfo = res;
        }
      });
    },
    async getLineInfo(evalHeaderId) {
      const params = {
        completeFlag:0,
        customizeUnitCode:" SSLM_SITEINVESTIGATE_FILLING_DETAIL.SCOREINFO,SSLM_SITEINVESTIGATE_FILLING_DETAIL.SCORE_FILTER",
        page:0,
        size:1000
      };

      await getLineInfoApi(evalHeaderId, params).then((res) => {
        if (res && !res.failed) {
          this.lineInfo = res.content.map((i) => {
            i.score = i.score || i.defaultScore;
            i.isVeto = i.isVeto || 0;
            i.isStandard = i.isStandard || 0;
            return i;
          });
        }
      });
    },
    async getMaterielInfo(evalHeaderId) {
      const params = {
        page:0,
        size:1000
      };

      await getMaterielInfoApi(evalHeaderId, params).then((res) => {
        if (res && res.content) {
          this.materielInfo = res.content;
        }
      });
    },
    async getGroupInfo(evalHeaderId) {
      const params = {
        page:0,
        size:1000
      };

      await getGroupInfoApi(evalHeaderId, params).then((res) => {
        if (res && res.content) {
          this.groupInfo = res.content;
        }
      });
    },
    async getFileInfo(evalHeaderId) {
      const params = {
        page:0,
        size:1000
      };

      await getFileInfoApi(evalHeaderId, params).then((res) => {
        if (res && res.content) {
          const list = res.content || [];
          this.attachmentUuid = list.map((item) => ({ ...item, fileUrl: item.attachmentUrl, bucketName: "private-bucket" }));
        }
      });
    },
    // 获取评分选项
    async getIndOpt(indicatorId) {
      await fetchIndOpt({
        page: 0,
        size: 0,
        evalTplIndId: indicatorId,
        tenantId: SrmUtil.getTenantId(),
        lovCode:"SSLM.KPI.INDICATOR.OPT.CFG"
      }).then((res) => {
        if (res && !res.failed) {
          this.indOptList = res;
        }
      });
    },
    // showFilePop() {
    //   this.filePopup = !this.filePopup;
    // },
    showFileList() {
      this.$showFileList({
        title: this.$T("hipspfm.common.button.viewAttachments").$D("查看附件"),
        attachmentUuid: this.attachmentUuid,
        readOnly: true,
      });
    },
    openActionSheet(item) {
      const { indicatorType } = item;
      const fieldType = indicatorType === "VETO" ? "isVeto" : "isStandard";
      const title = indicatorType === "VETO" ?
        this.$T("sslm.siteInvestigateReport.modal.scorer.isVeto").$D("否决该项") :
        this.$T("sslm.siteInvestigateReport.modal.scorer.isCriteria").$D("符合评分标准");

      // eslint-disable-next-line rulesdir/no_hips
      this.$hips.actionsheet.show({
        title,
        theme: "android",
        buttons: [ {
          text: this.$T("hipspfm.common.status.yes").$D("是"),
          handler: () => {
            item[fieldType] = 1;
          }
        }, {
          text: this.$T("hipspfm.common.status.no").$D("否"),
          handler: () => {
            item[fieldType] = 0;
          }
        } ],
        cancel: {
          text: this.$T("hipspfm.common.button.cancle").$D("取消"),
        }
      });
    },
    async openIndOpt(item) {
      const { indicatorId, } = item;
      await this.getIndOpt(indicatorId);
      const buttons = this.indOptList.map((n) => ({
        text: n.meaning,
        handler:() => {
          item["evalTplIndOptId"] = n.value;
          item["indOptName"] = n.meaning;
          item["score"] = n.score;
        },
      }));

      // eslint-disable-next-line rulesdir/no_hips
      this.$hips.actionsheet.show({
        title:this.$T("sslm.common.model.archiveFilled.indOptName").$D("评分选项"),
        theme: "android",
        buttons: buttons,
        cancel: {
          text: this.$T("hipspfm.common.button.cancle").$D("取消"),
        }
      });
    },
    numberInputCheck(v, t) {
      return numberInputCheck1(v, t);
    },
    showDeatil() {
      // this.show = !this.show
      // console.log(111123123131232131312)
      this.$router.push({
        name: "SiteInvestigateReportDetailB",
        query: { headInfo:this.headInfo }
      });
    },
    // onStandardChange(e,index) {
    //   this.lineInfo[index].isStandard = e.target.checked ? 1 : 0;
    // },
    // onVetoChange(e,index) {
    //   this.lineInfo[index].isVeto = e.target.checked ? 1 : 0;
    // },
    validData() {
      let flag = true;

      this.lineInfo.map((i) => {
        if (i.indicatorType === "SCORE" && i.isVeto && !i.score) {
          flag = false;
        } else if (i.indicatorType === "OPT" && !i.indOptName) {
          flag = false;
        }
      });
      return flag;
    },
    toSave() {
      if (this.validData()) {
        const params = {
          ...this.headInfo,
          siteEvalLineResps:this.lineInfo,
          siteEvalAttLns:this.attachmentUuid,
          customizeUnitCode:this.customizeUnitCode,
        };

        getSetLineInfoApi(params).then(async (res) => {
          if (!res) {
            this.$notification.open({
              message: this.$T("smbl.common.message.acction.success").$D("操作成功"),
              description: "",
              class: "notification"
            });
            try {
              this.$loading.show();
              const evalHeaderId = this.evalHeaderId;

              await this.getHeadInfo(evalHeaderId);
              await this.getLineInfo(evalHeaderId);
              await this.getMaterielInfo(evalHeaderId);
              await this.getGroupInfo(evalHeaderId);
              await this.getFileInfo(evalHeaderId);
              this.$loading.hide();
            } catch (err) {
              this.finishLoad = true;
              this.$loading.hide();
              console.log(err, "error");
            }
          }
        });
      }
    },
    toSubmit() {
      if (this.validData()) {
        const params = {
          ...this.headInfo,
          siteEvalLineResps:this.lineInfo,
          siteEvalAttLns:this.attachmentUuid,
          customizeUnitCode:this.customizeUnitCode,
        };

        getSaveLineInfoApi(params).then((res) => {
          if (res) {
            this.$notification.open({
              message: this.$T("smbl.common.message.acction.success").$D("操作成功"),
              description: "",
              class: "notification"
            });
            if (this.msgJumpFlag) {
              // this.$dialog({
              //   showOk: false,
              //   showCancel: false,
              //   content: this.$T("smbl.common.message.operation.successful").$D("操作完成，请关闭当前页面"),
              // });
              setTimeout(() => {
                this.$router.replace({ name: "SiteInvestigateReportList" });
              }, 1000);
            } else {
              setTimeout(() => {
                this.$router.back();
              }, 1000);
            }
          }
        });
      }
    },
    // 返回
    goBack() {
      this.$router.back();
    },
    //退出子应用
    goClose() {
      try {
        // eslint-disable-next-line no-undef
        closeWebView();
      } catch (err) {
        this.$router.back();
      }
    },
    //回到顶部
    goTop() {
      this.$nextTick(() => {
        this.scroll.scrollTo(0, 0, 600, "bounce");
      });
    },
    //回到顶部
    goTopA() {
      this.$refs.headDetail.scrollTop = 0;
    },
    // 滚动事件
    handlerScroll({ x, y }) {
      this.$handlerScroll(x, y, this);
    }
  }
};
</script>

<style lang="stylus" scoped>

.detail-navbar{
  .left-button {
    display: flex;
    align-items: center;
    font-size: 16px;
    color: var(--color-font-default);
    line-height: 24px;
    font-weight: bold;

    img {
      height: 12.7px;
      width: 15.3px;
      margin-right: 10.7px;
      margin-top: 4px;
    }
  }

  .right-button {
    margin-right: 15px;
    z-index: 1;
    color: var(--color-font-default-f);

    span {
      display: flex;
      align-items: center;
      width: 77px;
      height: 32px;
      padding: 7px 10px;
      background: var(--color-bg-default);
      border: 1px solid var(--color-border-default);
      border-radius: 18px;

      i {
        margin: 0px 8px;
        position relative
        top:-1px
      }
    }

    img {
      height: 18px;
      width: 18px;
    }
  }

}

.tab-scroll{
  .contentWrap {
    height: calc(100vh - 88px);
    overflow: hidden;
  }

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
          color: var(--color-font-default-b);
          line-height: 20px;
          text-align: center;
          position: relative;
          margin-left: 20px;

          &.active {
            font-weight bold
            color:var(--color-font-default);
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

    .infoContent{
      background:var(--color-bg-default)
      font-size: 14px;
      text-align: left;
      color: var(--color-font-default);
      line-height: 20px;
      h3{
          padding 16px 15px 4px 15px
          font-size: 18px;
          font-weight: bold;
          line-height: 24px;
      }
    }
    .headInfo{
      ul{
        padding 4px 0 12px 0
        li{
          margin 8px 15px 0 15px
          isplay: flex;
          align-items: center;

          &:nth-child(1){
            margin-left 0
            font-weight bold
          }

          .has-rgb-blo{
            display inline-block
            width: 6px;
            height: 14px;
            background: var(--color-other-default-b);
            margin-right 9px
          }
        }

      }
    }

    .lineInfo{
      .require{
        color:var(--color-other-default) !important
      }
      .lineInfo-content{
        margin 12px 15px 0 15px
        .editImg{
          width 16px
          height 16px
        }
        .option-field {
          display: flex;
          justify-content: space-between;
          .option-field-right {
            display: flex;
          }
        }
        .cardNumber{
          width 70px
          height auto
          padding 0
          position static
          >>> .hips-input__error-message{
            position absolute
            left 88px
            top -6px
            width 54px
          }
        }
        .lineInfo-content-flex{
          display flex
        }
        .cardRemark{
          width 220px
          position static
          height auto
          padding 0
        }
        .can-input{
          display flex
          align-items center
        }
      }
      .distance{
        display flex
        align-items center
        span{
          width 165px
          &:nth-child(1){
            margin-right 15px
            display flex
            align-items center
          }
        }
      }
      .lineInfo-first{
        font-weight bold
      }
      .footer{
        height: 22px;
        background: var(--color-bg-default-d);
        border-radius: 2px;
        margin 12px 15px
        display inline-block
        text-align center
        font-size: 10px;
        color: var(--color-font-default-c);
        line-height: 22px;
        padding 0 8px
      }
    }

    .materielInfo,.groupInfo{
      ul{
        li{
          &:nth-child(1){
            margin-left 15px
            font-weight bold
          }
        }
      }
    }

    .groupInfo{
      .groupInfo-first{
        display flex
        align-items center
        justify-content space-between
        span:nth-child(2){
          color var(--color-font-default-b)
          font-weight normal
        }

        .groupInfo-tip{
          display inline-block
          background: var(--color-other-default-d);
          border-radius: 4px;
          font-size: 10px;
          font-weight: normal;
          color: var(--color-font-default-d);
          line-height: 12px;
          margin-left 6px;
          padding 2px
        }
      }
    }
}

.fixed-file{
      position fixed
      top 0
      left 0
      transform: translate(302px, 520px);
      z-index:100;
      width: 52px;
      height: 52px;
      background: var(--color-font-default-d);
      box-shadow: 0px 0px 4px 0px rgba(0,0,0,0.09);
      border-radius 50%
      display flex
      align-items center
      justify-content center
      .fixed-file-img{
        width 24px
        height 24px
      }
}

.headInfoDetail{
  >>> .hips-nav-bar__theme-default{
    background-color var(--color-other-default-b) !important
  }
  .detail-navbar .right-button span{
    background var(--color-other-default-b)
    border none
  }
  .left-button{
    color var(--color-font-default-d)
  }

  .lineHead{
    background var(--color-other-default-b)
    padding: 16px 15px 28px 15px
    text-align: left;
    color: var(--color-font-default-d);
    line-height: 20px;
    li{
      font-size: 16px;
      font-weight:bold
      margin-bottom 4px
    }
    p{
      font-size: 14px;
    }
  }
  .line-border{
    position: relative;
    top: -12px;
    border-radius: 12px 12px 0px 0px;
    background var(--color-bg-default)
    height 515px
  }
}

</style>
