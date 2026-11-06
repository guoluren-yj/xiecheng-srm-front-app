<template>
  <div style="min-height: 500px;">
    <section v-if="loading" class="mainDetail">
      <div ref="wrapper" class="contentWrap wrapper">
        <div ref="content" class="content">
          <srm-scroll-tab class="content">
            <srm-scroll-tab-item :label="$T('hipspfm.workFlowDemand.view.title.demandHeadInfo').$D('需求头信息')" code="demandHeadInfo">
              <div ref="headInfo" class="infoContent headInfo">
                <div v-if="JSON.stringify(headInfo) == '{}'" class="noContent">
                  <span>{{ $T("hipspfm.workFlowDemand.view.title.noDemandHeadInfo").$D("暂无需求头信息") }}</span>
                </div>
                <ul v-else>
                  <li>
                    <span>{{ $T("sprm.common.model.common.title").$D("标题") }}：</span>
                    <span>{{ headInfo.title }}</span>
                    <srm-tooltip
                      v-if="headInfo.title"
                      placement="left"
                      :title="headInfo.title">
                      <img src="@/assets/icon_more@3x.png" class="moreInfo image-blue-default" >
                    </srm-tooltip>
                  </li>
                  <li>
                    <span>{{ $T("sprm.common.model.common.prNum").$D("申请编号") }}：</span>
                    <span>{{ headInfo.displayPrNum }}</span>
                  </li>
                  <li>
                    <span>{{ $T("sprm.common.model.common.creationTime").$D("创建日期") }}：</span>
                    <span>{{ headInfo.creationDate }}</span>
                  </li>
                  <li>
                    <span>{{ $T("sprm.common.model.common.amount").$D("申请总额") }}：</span>
                    <span>{{ headInfo.amount|| headInfo.CalcMoney || headInfo.CalcMicrometer }}</span>
                  </li>
                  <li>
                    <span>{{ $T("sprm.common.model.common.applicant").$D("申请人") }}：</span>
                    <span>{{ headInfo.prRequestedName }}</span>
                  </li>
                  <li>
                    <span>{{ $T("sprm.common.model.common.contactTelNum").$D("联系方式") }}：</span>
                    <span>{{ headInfo.contactTelNum }}</span>
                  </li>
                  <li>
                    <span>{{ $T("sprm.common.model.common.prSourcePlatform").$D("单据来源") }}：</span>
                    <span>{{ headInfo.prSourcePlatformMeaning }}</span>
                  </li>
                  <li>
                    <span>{{ $T("entity.company.tag").$D("公司") }}：</span>
                    <span>{{ headInfo.companyName }}</span>
                  </li>
                  <li>
                    <span>{{ $T("sprm.common.model.common.companyTeam").$D("公司组织") }}：</span>
                    <span>{{ headInfo.parentUnitName }}</span>
                  </li>
                  <li>
                    <span>{{ $T("sprm.common.model.common.department").$D("部门") }}：</span>
                    <span>{{ headInfo.unitName }}</span>
                  </li>
                  <li>
                    <span>{{ $T("sprm.common.model.common.sqType").$D("申请类型") }}：</span>
                    <span>{{ headInfo.prTypeName }}</span>
                  </li>
                  <li>
                    <span>{{ $T("entity.organization.class.purchase").$D("采购组织") }}：</span>
                    <span>{{ headInfo.purchaseOrgName }}</span>
                  </li>
                  <li>
                    <span>{{ $T("hipspfm.workFlowCata.model.common.manufacturer").$D("生产商") }}：</span>
                    <span>{{ headInfo.attributeVarchar1 }}</span>
                  </li>
                  <li>
                    <span>{{ $T("hipspfm.workFlowCata.model.common.model").$D("车型") }}：</span>
                    <span>{{ headInfo.attributeVarchar2 }}</span>
                  </li>
                  <li>
                    <span>{{ $T("hipspfm.workFlowCata.model.common.customerName").$D("客户名") }}：</span>
                    <span>{{ headInfo.attributeVarchar3 }}</span>
                  </li>
                  <li>
                    <span>{{ $T("").$D("Project Code") }}：</span>
                    <span>{{ headInfo.attributeVarchar4 }}</span>
                  </li>
                  <li>
                    <span>{{ $T("").$D("Program Code") }}：</span>
                    <span>{{ headInfo.attributeVarchar5 }}</span>
                  </li>
                  <li>
                    <span>{{ $T("hipspfm.workFlowCata.model.common.startDate").$D("量产开始日期") }}：</span>
                    <span>{{ headInfo.attributeDate1 || headInfo.CalcDate }}</span>
                  </li>
                  <li>
                    <span>{{ $T("hipspfm.workFlowCata.model.common.endDate").$D("量产结束日期") }}：</span>
                    <span>{{ headInfo.attributeDate2 || headInfo.CalcDate }}</span>
                  </li>
                  <li>
                    <span>{{ $T("sprm.common.model.common.buyType").$D("采购品类") }}：</span>
                    <span>{{ headInfo.categoryName }}</span>
                  </li>
                  <li>
                    <span>{{ $T("entity.organization.class.ouFlag").$D("业务实体") }}：</span>
                    <span>{{ headInfo.ouName }}</span>
                  </li>
                  <li>
                    <span>{{ $T("sprm.common.model.common.moneyPart").$D("费用挂靠部门") }}：</span>
                    <span>{{ headInfo.expenseUnitName }}</span>
                  </li>
                  <li>
                    <span>{{ $T("sprm.common.model.common.departmentMan").$D("部门验收人") }}：</span>
                    <span>{{ headInfo.accepterUserName }}</span>
                  </li>
                  <li>
                    <span>{{ $T("sprm.common.model.common.techFlag").$D("是否需要技术指导") }}：</span>
                    <span>{{ headInfo.techGuidanceFlag ? $T("hipspfm.common.status.yes").$D("是"):$T("hipspfm.common.status.no").$D("否") }}</span>
                  </li>
                  <li>
                    <span>{{ $T("sprm.common.model.common.techloMan").$D("技术负责人") }}：</span>
                    <span>{{ headInfo.techDirectorUserName }}</span>
                  </li>
                  <li>
                    <span>{{ $T("sprm.common.model.common.applyExplain").$D("申请说明") }}：</span>
                    <span>{{ headInfo.remark }}</span>
                  </li>
                </ul>
              </div>
            </srm-scroll-tab-item>
            <srm-scroll-tab-item :label="$T('hipspfm.workFlowDemand.view.title.demandLineInfo').$D('需求行信息')" code="demandLineInfo">
              <div ref="lineInfo" class="infoContent lineInfo">
                <srm-list
                  class="scoll-list"
                  :scrollable="false"
                  :columns="getLineColumns"
                  :data-set="prLineDataSet"
                  @itemClick="showLineInfoDetail" />
                <!-- <div v-if="JSON.stringify(lineInfo) == '[]'" class="noContent">
                  <span>{{ $T("hipspfm.workFlowDemand.view.title.noDemandLineInfo").$D("暂无需求行信息") }}</span>
                </div>
                <div v-else>
                  <div v-for="(item,index) in lineInfo" :key="index" @click="showLineInfoDetail(item)">
                    <div class="headCompany">
                      <span class="block"/>
                      <span class="code">
                        <span class="materiel-name">{{ item.itemName }}</span>
                        <span>{{ $T("sprm.common.model.common.lineNumber").$D("行号") }}：{{ item.lineNum }}</span>
                      </span>
                    </div>
                    <ul>
                      <li>
                        <span
                          class="materialCode">{{ $T("sprm.common.model.common.itemCode").$D("物料编码") }}: {{ item.itemCode }}</span>
                      </li>
                      <li>
                        <span>{{ $T("sprm.common.model.common.quantity").$D("数量") }}: {{ item.quantity }}</span>
                        <span>{{ $T("sprm.common.model.common.enteredTaxIncludedPrice").$D("含税单价") }}: {{ item.taxIncludedUnitPrice|CalcMoney|CalcMicrometer }}</span>
                      </li>
                    </ul>
                    <div class="footInfo">
                      <span>{{ $T("sprm.common.model.common.needDate").$D("需求日期") }}:</span>
                      <span>{{ item.neededDate|CalcDate }}</span>
                    </div>
                  </div>
                </div> -->
              </div>
            </srm-scroll-tab-item>
          </srm-scroll-tab>
        </div>
      </div>
      <!-- 行信息详情弹窗 -->
      <hips-popup v-model="show" class="FullPop" style="height: 100%;width:100%" position="bottom">
        <section class="lineInfoDetail">
          <hips-nav-bar slot="header" :have-border="false">
            <div slot="left" class="left-button" @click="closeLineInfoDetail">
              <img class="image-gray-default" src="@/assets/Comp/icon_close_normal@3x.png" alt >
            </div>
            <div
              slot="center"
              class="header">
              {{ $T("sprm.purchaseRequisitionInquiry.view.title.requirementDetail").$D("需求明细") }}
            </div>
          </hips-nav-bar>
          <div class="lineHead">
            <li>
              <span>
                <span>{{ $T("sprm.common.model.common.lineNumber").$D("行号") }}: {{ lineInfoDetail.lineNum }}</span>
              </span>
            </li>
            <p>
              <span>{{ $T("sprm.common.model.common.itemCode").$D("物料编码") }}：</span>
              <span>{{ lineInfoDetail.itemCode }}</span>
            </p>
            <p>
              <span>{{ $T("sprm.common.model.common.itemName").$D("物料名称") }}：</span>
              <span>{{ lineInfoDetail.itemName }}</span>
            </p>
          </div>
          <div class="lineBody">
            <li>
              <span>{{ $T("sprm.common.model.common.invOrganizationId").$D("库存组织") }}：</span>
              <span>{{ lineInfoDetail.invOrganizationName }}</span>
            </li>
            <li>
              <span>{{ $T("sprm.common.model.common.categoryName").$D("物料分类") }}：</span>
              <span>{{ lineInfoDetail.categoryName }}</span>
            </li>
            <li>
              <span>{{ $T("sprm.common.model.common.standards").$D("规格") }}：</span>
              <span>{{ lineInfoDetail.itemModel }}</span>
            </li>
            <li>
              <span>{{ $T("sprm.common.model.common.itemModel").$D("型号") }}：</span>
              <span>{{ lineInfoDetail.itemSpecs }}</span>
            </li>
            <li>
              <span>{{ $T("sprm.common.model.common.class").$D("属性") }} ：</span>
              <span>{{ lineInfoDetail.itemPropertiesMeaning }}</span>
            </li>
            <li>
              <span>{{ $T("sprm.common.model.common.uomName").$D("单位") }}：</span>
              <span>{{ lineInfoDetail.uomCode }}/{{ lineInfoDetail.uomName }}</span>
            </li>
            <li>
              <span>{{ $T("sprm.common.model.common.quantity").$D("数量") }}：</span>
              <span>{{ lineInfoDetail.quantity }}</span>
            </li>
            <li>
              <span>{{ $T("sprm.common.model.common.currencyCode").$D("币种") }}：</span>
              <span>{{ lineInfoDetail.currencyCode }}</span>
            </li>
            <li>
              <span>{{ $T("sprm.common.model.common.taxIncludedUnitPrice").$D("预估单价(含税)") }}：</span>
              <span>{{ lineInfoDetail.taxIncludedUnitPrice|| lineInfoDetail.CalcMoney || lineInfoDetail.CalcMicrometer }}</span>
            </li>
            <li>
              <span>{{ $T("sprm.common.model.common.lineAmount").$D("行金额") }}：</span>
              <span>{{ lineInfoDetail.taxIncludedLineAmount || lineInfoDetail.CalcMoney || lineInfoDetail/CalcMicrometer }}</span>
            </li>
            <li>
              <span>{{ $T('hipspfm.workFlowCata.model.common.application').$D('应用') }}：</span>
              <span>{{ lineInfoDetail.attributeVarchar1 }}</span>
            </li>
            <li>
              <span>{{ $T('hipspfm.workFlowCata.model.common.materialScience').$D('材料') }}：</span>
              <span>{{ lineInfoDetail.attributeVarchar2 }}</span>
            </li>
            <li>
              <span>{{ $T('hipspfm.workFlowCata.model.common.surfaceTreatment').$D('表面处理') }}：</span>
              <span>{{ lineInfoDetail.attributeVarchar3 }}</span>
            </li>
            <li>
              <span>{{ $T('hipspfm.workFlowCata.model.common.annualConsumption').$D('年用量') }}：</span>
              <span>{{ lineInfoDetail.attributeVarchar4 }}</span>
            </li>
            <li>
              <span>{{ $T('hipspfm.workFlowCata.model.common.requirements').$D('测试/验收要求') }}：</span>
              <span>{{ lineInfoDetail.attributeVarchar5 }}</span>
            </li>
            <li>
              <span>{{ $T('hipspfm.workFlowCata.model.common.standard').$D('包装标准') }}：</span>
              <span>{{ lineInfoDetail.attributeVarchar6 }}</span>
            </li>
            <li>
              <span>{{ $T('hipspfm.workFlowCata.model.common.productNumber').$D('供应商/客户产品编号') }}：</span>
              <span>{{ lineInfoDetail.attributeVarchar7 }}</span>
            </li>
            <li>
              <span>{{ $T('entity.supplier.name').$D('供应商名称') }}：</span>
              <span>{{ lineInfoDetail.attributeVarchar11 }}</span>
            </li>
            <li>
              <span>{{ $T('hipspfm.workFlowCata.model.common.category').$D('类别代码') }}：</span>
              <span>{{ lineInfoDetail.attributeVarchar8 }}</span>
            </li>
            <li>
              <span>{{ $T('hipspfm.workFlowCata.model.common.categoryName').$D('类别名称') }}：</span>
              <span>{{ lineInfoDetail.attributeVarchar10 }}</span>
            </li>
            <li>
              <span>{{ $T('sprm.common.model.sumProject').$D('总账科目代码') }}：</span>
              <span>{{ lineInfoDetail.attributeVarchar9 }}</span>
            </li>
            <li>
              <span>{{ $T("sprm.common.model.common.needDate").$D("需求日期") }}：</span>
              <span>{{ lineInfoDetail.neededDate || lineInfoDetail.CalcDate }}</span>
            </li>
            <li>
              <span>{{ $T("sprm.purchaseReqInquiry.model.common.supplierCompanyId").$D("建议供应商") }}：</span>
              <span>{{ lineInfoDetail.supplierCompanyName }}</span>
            </li>
            <li>
              <span>{{ $T("sprm.common.model.common.purchaseAgentName").$D("采购员") }}：</span>
              <span>{{ lineInfoDetail.agentName }}</span>
            </li>
            <li>
              <span>{{ $T("sprm.common.model.common.keepMan").$D("保管人") }}：</span>
              <span>{{ lineInfoDetail.keeperUserName }}</span>
            </li>
            <li>
              <span>{{ $T("sprm.common.model.common.takeman").$D("验收人") }}：</span>
              <span>{{ lineInfoDetail.accepterUserName }}</span>
            </li>
            <li>
              <span>{{ $T("sprm.purchaseReqInquiry.model.common.moneyPayPart").$D("费用承担部门") }}：</span>
              <span>{{ lineInfoDetail.expBearDep }}</span>
            </li>
            <li>
              <span>{{ $T("sprm.common.model.common.interRoom").$D("存放地点") }}：</span>
              <span>{{ lineInfoDetail.address }}</span>
            </li>
            <li>
              <span>{{ $T("sprm.common.model.common.projectNum").$D("项目编码") }}：</span>
              <span>{{ lineInfoDetail.promisedDate }}</span>
            </li>
            <li>
              <span>{{ $T("slm.supplyAbility.model.supplyAbility.remark").$D("备注") }}：</span>
              <span>{{ lineInfoDetail.remark }}</span>
            </li>
            <li>
              <span>{{ $T("entity.attachment.tag").$D("附件") }}：</span>
              <span
                style="color: var(--color-other-default-b);"
                @click="showFilePop(lineInfoDetail.attachmentUuid||uuid)">
                {{ $T("hipspfm.common.button.viewAttachments").$D("查看附件") }}
                <img
                  src="@/assets/icon_screenlist_right_normal@3x.png"
                  alt>
              </span>
            </li>
            <div class="line-div">
              <span class="line-block"/>
            </div>
          </div>
        </section>
      </hips-popup>
      <!-- <div id="FootButton" class="invite" >
        <span @click="openActionSheet">{{ $T('').$D('更多操作') }}</span>
        <span @click="operateType='refuse';operatesPop = true">{{ $T('').$D('审批拒绝') }}</span>
        <span  @click="operateType='approvel';operatesPop = true">{{ $T('').$D('审批通过') }}</span>
      </div> -->
      <!-- <ToDoOperates :type="operateType" v-model="operatesPop" /> -->
    </section>
  </div>
</template>

<script>
import uuid from "uuid";
import { Popup, NavBar } from "hips";
import { DataSet } from "srm-mobile-ui";
import {
  getDemandOrderHeadInfoApi,
} from "./api";
import { purchaseRequisitionLineDS } from "./datasource/PurchaseRequisitionLineDS";

export default {
  modules: [ "hipspfm.workFlowDemand", "hipspfm.common", "sprm.common", "entity.organization", "hipspfm.workFlowCata", "sprm.purchaseRequisitionInquiry", "sprm.purchaseReqInquiry", "slm.supplyAbility", "entity.company", "entity.supplier", "entity.attachment" ],
  name: "YHLDemandApproval",
  components: {
    [Popup.name]: Popup,
    [NavBar.name]: NavBar
  },
  props: {
    changeReqId: {
      type: String | Number,
      default: ""
    },
    showFilePop: {
      type: Function
    }
    // lineInfo: Array
  },
  data() {
    return {
      headInfo: {},
      lineInfo: [],
      loading: false,
      scroll: "",
      show: false,
      navIndex: 0,
      uuid: "",
      contentLenArr: [],
      lineInfoDetail: {},
      prLineDataSet:  new DataSet(purchaseRequisitionLineDS(this.changeReqId)), // 行信息
    };
  },
  computed: {
    getLineColumns() {
      const columns = [
        {
          fieldName: this.$T("sprm.common.model.common.itemName").$D("物料名称"),
          fieldType: "EMPTY",
          fieldCode: "itemName",
          render: (val, item) => <srm-list-header>
            <span>{val || "-"}</span>
            <span slot="right">{item.displayLineNum}</span>
          </srm-list-header>,
        },
        {
          fieldName: this.$T("sprm.common.model.common.itemCode").$D("物料编码"),
          fieldType: "TEXT",
          fieldCode: "itemCode",
        },
        {
          fieldName: this.$T("sprm.common.model.common.quantity").$D("数量"),
          fieldType: "TEXT",
          fieldCode: "quantity",
        },
        {
          fieldName: this.$T("sprm.common.model.common.enteredTaxIncludedPrice").$D("预估单价（含税）"),
          fieldType: "TEXT",
          fieldCode: "taxIncludedUnitPrice",
          editor: false,
          render: (val, item) => item.taxIncludedUnitPrice || item.CalcMoney || item.CalcMicrometer,
        },
        {
          fieldName: this.$T("sprm.common.model.common.needDate").$D("需求日期"),
          fieldType: "TEXT",
          fieldCode: "neededDate",
          render: (val, item) => item.neededDate || item.CalcDate,
        },
      ];

      return columns;
    },
  },
  watch: {},
  async mounted() {
    if (this.changeReqId) {
      try {
        this.$loading.show();
        await this.getDemandOrderHeader();
        await this.getDemandOrderLine();
        this.loading = true;
        this.$loading.hide();
      } catch (err) {
        this.$loading.hide();
        console.log(err, "error");
      }
    }
    this.$emit(
      "GetApprovalTitle",
      this.$T("hipspfm.workFlowDemand.view.title.demandApproval").$D("需求审批")
    );
    this.uuid = uuid();
  },
  methods: {
    // 获取需求头信息
    async getDemandOrderHeader() {
      const params = {
        customizeUnitCode: "SRPM.PURCHAE_REQUISITION_QUERY.DETAIL.HEADER"
      };
      await getDemandOrderHeadInfoApi(this.changeReqId, params).then((res) => {
        this.headInfo = res || {};
        let attachmentUuid = this.headInfo.attachmentUuid || uuid();
        this.$emit("GetAttachmentUuid", attachmentUuid);
      });
    },
    //获取需求行信息
    async getDemandOrderLine() {
      this.prLineDataSet.refresh().then(() => {
        this.lineInfo = this.prLineDataSet.data;
      });
    },
    // 显示行信息详情
    showLineInfoDetail(record) {
      this.lineInfoDetail = { ...record.data };
      setTimeout(() => {
        this.show = true;
      }, 150);
    },
    closeLineInfoDetail() {
      this.show = false;
    },
    // 更多操作
    openActionSheet() {
      this.$hips.actionsheet.show({
        theme: "android",
        title: "",
        subTitle: "",
        buttons: [
          {
            text: this.$T("hipspfm.common.action.delegate").$D("转交"),
            handler: (index) => {
              // console.log(`Forward ${index}`)
              this.$hips.actionsheet.hide();
              this.operateType = "transfer";
              // setTimeout(()=>{
              this.operatesPop = true;
              // },100)
            }
          },
          {
            text: this.$T("hipspfm.common.action.addSign").$D("加签"),
            handler: (index) => {
              this.$hips.actionsheet.hide();
              this.operateType = "signature";
              this.operatesPop = true;
            }
          },
          {
            text: this.$T("hipspfm.common.action.approveAndAddSign").$D(
              "同意并加签"
            ),
            handler: (index) => {
              this.$hips.actionsheet.hide();
              this.$hips.actionsheet.hide();
              this.operateType = "approvelSignature";
              this.operatesPop = true;
            }
          }
        ],
        cancel: {
          text: this.$T("hipspfm.common.button.cancle").$D("取消"),
          handler: () => {
            console.log("Cancel");
          }
        }
      });
    }
    // 补录信息
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
  overflow visible;

  .navWrap {
    width: 100%;
    height: 44px;
    overflow: hidden;
    position: relative;
    z-index: 999;

    .navContent {
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
    overflow visible;
    // height: calc(100vh - 260px);

    .content {
      .headInfo {
        ul {
          padding-left: 20px;
        }

        & ul li {
          margin-bottom: 8px;
          padding: 9px 10px 14px 0;
          border-bottom: 1px solid var(--color-border-default);
          display: flex;
          align-items: baseline;

          span {
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: var(--color-font-default);
            line-height: 22px;
          }

          span:nth-child(1) {
            flex: 0 1 126px;
          }

          span:nth-child(2) {
            flex: 0 1 209px;
            color: var(--color-font-default-b);
          }
        }

        & ul li:nth-child(1) {
          padding: 20px 20px 11px 0;

          span:nth-child(1) {
            flex: 0 1 126px;
          }
        }

        & ul li:nth-child(1) span:nth-child(2) {
          flex: 0 1 190.7px;
          word-break: break-word;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
        }

        & ul li:nth-last-child(1) {
          border-bottom: 0;
          margin-bottom: 1px;
        }
      }

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

        .footInfo {
          padding: 12px 15px 12px 20px;
          border-bottom: 8px solid var(--color-border-default);
          font-family: PingFangSC-Medium;
          color: var(--color-font-default);
          font-size: 14px;
          display: flex;
          line-height: 22px;
          font-weight: 600;

          span:nth-child(1) {
            width: 80px;
          }
        }

        .headCompany {
          display: flex;
          flex-direction: row;
          padding-bottom: 10px;
          margin: 16px 0 0 15px;
          border-bottom: 1px solid var(--color-border-default);
          padding-right: 15px;

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
    }
  }
}

.lineInfoDetail {
  background: var(--color-bg-default);
  height: 100%;
  display: flex;
  flex-direction: column;

  .header {
    font-family: PingFangSC-Medium;
    font-size: 18px;
    color: var(--color-font-default);
    text-align: center;
    line-height: 26px;
    font-weight: 700;
    padding: 9px 0;
  }

  .left-button {
    // margin-left: 20px;
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
    overflow: auto;

    ul {
      padding: 20px 20px 11px 20px;
    }

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

    .line-div {
      height: 34px;
      display: flex;
      justify-content: center;

      .line-block {
        width: 35.7%;
        height: 6px;
        // border-radius:100px;
        // background-color : #000000;
        position: relative;
        bottom: -18px;
      }
    }
  }
}
</style>
