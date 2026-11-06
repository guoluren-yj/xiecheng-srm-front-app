<template>
  <div ref="priceExecute" class="price-execute-approval">
    <srm-scroll-tab>
      <srm-scroll-tab-item
        :label="$T('scux.supBidApplication.view.rfxSplitNumtitle.baseInfo').$D('基本信息')">
        <div v-if="JSON.stringify(headerInfo) === '{}'" class="noContent">
          <span>{{ $T("hipspfm.workFlow.view.message.noBasicInfo").$D("暂无基本信息") }}</span>
        </div>
        <div v-else style="padding-top: 16px;">
          <customize
            class="textarea-head"
            :columns="getHeaderColumns()"
            :need-padding="true"
            type="list"
            :data-source="headerInfo"/>
        </div>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        :label="$T('scux.supBidApplication.view.title.supBidManage').$D('供应商标的详情')">
        <srm-list
          :data-set="lineInfoDataSet"
          :columns="lineColumns"/>
      </srm-scroll-tab-item>
    </srm-scroll-tab>
  </div>
</template>

<script>
import { DataSet } from "srm-mobile-ui";
import { lineInfoDs } from "./dataSource/lineDs";
import { getBaseInfoApi, getSupplierEval, getText } from "./api";

export default {
  modules: [ "scux.supBidApplication", "hipspfm.workFlow", "smodr.frightLine" ],
  name: "XxjtSupplierApplicationApproval",
  props: {
    changeReqId: {
      type: String || Number,
      default: "",
    },
  },
  data() {
    return {
      headerInfo: {},
      lineInfo: {},
      lineInfoDataSet: new DataSet(lineInfoDs()),
    };
  },
  computed: {
    getHeaderColumns() {
      return () => [
        {
          fieldName: this.$T("scux.supBidApplication.model.supBidApplication.supplierCompanyName").$D("供应商名称"),
          fieldCode: "supplierCompanyIdMeaning",
          formRow: 1,
          render: (val) => <srm-list-header show-open-tag={true}>
            <span>{ val }</span>
          </srm-list-header>
        },
        {
          fieldName: this.$T("scux.supBidApplication.model.supBidApplication.supplierCompanyNum").$D("供应商编码"),
          fieldCode: "supplierCompanyNum",
          formRow: 2,
          render: (val, record) => <a style={{ color: "#276EF1" }} onClick={() => this.jumpTo360(record)}>{val}</a>,
        },
        {
          fieldName: this.$T("scux.supBidApplication.model.supBidApplication.createdByMeaning").$D("创建人"),
          fieldCode: "createdByMeaning",
          formRow: 3,
        },
        {
          fieldName: this.$T("scux.supBidApplication.model.supBidApplication.creationDate").$D("创建日期"),
          fieldCode: "creationDate",
          formRow: 4,
        },
        {
          fieldName: this.$T("scux.supBidApplication.model.supBidApplication.lastUpdateUserMeaning").$D("最后更新人"),
          fieldCode: "lastUpdateUserMeaning",
          formRow: 5,
        },
        {
          fieldName: this.$T("scux.supBidApplication.model.supBidApplication.lastUpdateTime").$D("最后更新日期"),
          fieldCode: "lastUpdateTime",
          formRow: 6,
        },
        {
          fieldName: this.$T("scux.supBidApplication.model.supBidApplication.companyName").$D("公司"),
          fieldCode: "ouIdMeaning",
          formRow: 7,
        },
        {
          fieldName: this.$T("scux.supBidApplication.model.supBidApplication.unitName").$D("部门"),
          fieldCode: "unitIdMeaning",
          formRow: 8,
        },
        {
          fieldName: this.$T("scux.supBidApplication.model.supBidApplication.commitmentContent").$D("承诺书"),
          fieldCode: "commitmentContent",
          fieldType: "TEXT_AREA",
          // editor: true,
          render: (val) =>
            <div calss="area-style"><srm-textarea readonly>{val}</srm-textarea></div>
        },
      ];
    },
    lineColumns() {
      return [
        {
          fieldName: this.$T("scux.supBidApplication.model.supBidApplication.targetCode").$D("标的编码"),
          fieldCode: "targetCode",
          render: (val, record) => <srm-list-header show-open-tag={true}>
            <a onClick={() => this.jumpToBid(record)}>{ val }</a>
          </srm-list-header>
        },
        {
          fieldName: this.$T("scux.supBidApplication.model.supBidApplication.targetName").$D("标的名称"),
          fieldCode: "targetCodeMeaning",
        },
        {
          fieldName: this.$T("scux.supBidApplication.model.supBidApplication.targetClass").$D("标的分级"),
          fieldCode: "targetClassMeaning",
        },
        {
          fieldName: this.$T("scux.supBidApplication.model.supBidApplication.supplyArea").$D("供货区域"),
          fieldCode: "supplyAreaName",
        },
        {
          fieldName: this.$T("scux.supBidApplication.model.supBidApplication.validityDateTo").$D("有限期至"),
          fieldCode: "validityDateTo",
        },
        {
          fieldName: this.$T("scux.supBidApplication.model.supBidApplication.supplierTargetStatus").$D("状态"),
          fieldCode: "supplierTargetStatusMeaning",
        },
        {
          fieldName: this.$T("scux.supBidApplication.model.supBidApplication.approveStatusMeaning").$D("审批状态"),
          fieldCode: "approveStatusMeaning",
        },
        {
          fieldName: this.$T("scux.supBidApplication.model.supBidApplication.supplierOneTimeFlag").$D("一次性供应商"),
          fieldCode: "supplierOneTimeFlagMeaning",
        },
        {
          fieldName: this.$T("scux.supBidApplication.model.supBidApplication.developmentFlag").$D("研发/新工艺"),
          fieldCode: "developmentFlagMeaning",
        },
        {
          fieldName: this.$T("scux.supBidApplication.model.supBidApplication.contactName").$D("联系人姓名"),
          fieldCode: "contactName",
        },
        {
          fieldName: this.$T("scux.supBidApplication.model.supBidApplication.enterpriseType").$D("企业类型"),
          fieldCode: "enterpriseTypeMeaning",
        },
        {
          fieldName: this.$T("scux.supBidApplication.model.supBidApplication.brand").$D("品牌"),
          fieldCode: "brandName",
        },
        {
          fieldName: this.$T("scux.supBidApplication.model.supBidApplication.jumpReport").$D("鑫智链现场考察报告"),
          render: (val, record) => <a style={{ color: "#276EF1" }} onClick={() => this.jumpToReport(record)}>{this.$T("smodr.frightLine.model.check").$D(
            "查看"
          )}</a>,
        },
        {
          fieldName: this.$T("scux.supBidApplication.model.supBidApplication.scoringAttachments").$D("考察报告及评分附件"),
          fieldCode: "scoringAttachment",
          render: (val, record) => val && <srm-upload
            attachment-uuid={record.scoringAttachment}
            show-count={true}
            show-icon={false}
            title={this.$T("scux.supBidApplication.model.supBidApplication.scoringAttachments").$D("考察报告及评分附件")}
            desc-title={this.$T("smodr.frightLine.model.check").$D(
              "查看"
            )}
          />,
        },
        {
          fieldName: this.$T("scux.supBidApplication.model.supBidApplication.descriptionAttachment").$D("情况说明附件"),
          fieldCode: "descriptionAttachment",
          render: (val, record) => val && <srm-upload
            attachment-uuid={record.descriptionAttachment}
            show-count={true}
            show-icon={false}
            title={this.$T("scux.supBidApplication.model.supBidApplication.descriptionAttachment").$D("情况说明附件")}
            desc-title={this.$T("smodr.frightLine.model.check").$D(
              "查看"
            )}
          />,
        },
        {
          fieldName: this.$T("scux.supBidApplication.model.supBidApplication.appraiseAttachment").$D("履约评价附件"),
          fieldCode: "appraiseAttachment",
          render: (val, record) => val && <srm-upload
            attachment-uuid={record.appraiseAttachment}
            show-count={true}
            show-icon={false}
            title={this.$T("scux.supBidApplication.model.supBidApplication.appraiseAttachment").$D("履约评价附件")}
            desc-title={this.$T("smodr.frightLine.model.check").$D(
              "查看"
            )}
          />,
        },
        {
          fieldName: this.$T("scux.supBidApplication.model.supBidApplication.othersAttachment").$D("其他附件"),
          fieldCode: "othersAttachment",
          render: (val, record) => val && <srm-upload
            attachment-uuid={record.othersAttachment}
            show-count={true}
            show-icon={false}
            title={this.$T("scux.supBidApplication.model.supBidApplication.othersAttachment").$D("其他附件")}
            desc-title={this.$T("smodr.frightLine.model.check").$D(
              "查看"
            )}
          />,
        },
      ];
    },
  },
  async mounted() {
    let applyHeaderId = this.changeReqId;
    const headText = await getBaseInfoApi(applyHeaderId);
    const commentText = await getText();
    this.headerInfo = {
      ...headText.content[0],
      commitmentContent: commentText.content[0].commitmentContent,
    };
    this.lineInfoDataSet.addPathParameter("applyHeaderId", applyHeaderId);
    this.lineInfoDataSet.refresh();
    this.$emit(
      "GetApprovalTitle",
      this.$T("scux.supBidApplication.view.title.bidApplicationApproval").$D(
        "供应商标的申请审批"
      ),
    );
  },
  methods: {
    jumpTo360(record) {
      const {
        spfmCompanyId,
        spfmPartnerCompanyId,
        tenantId,
        supplierCompanyId,
        partnerTenantId,
        ownerCompanyId
      } = record;
      this.$router.push({
        path: "/appSour/SupplierLifeCycleDetail",
        query: {
          spfmCompanyId,
          tenantId,
          companyId: ownerCompanyId,
          supplierCompanyId,
          partnerTenantId,
          spfmSupplierCompanyId: spfmPartnerCompanyId,
        }
      });
    },
    jumpToReport(record) {
      const { targetCode, supplierCompanyId } = record;
      getSupplierEval(targetCode, supplierCompanyId).then((res) => {
        if (res && res?.evalHeaderId) {
          const { evalNum, evalHeaderId } = res;
          this.$router.push({
            path: "/appSour/SiteInvestigationReportDetailMaintain",
            query: {
              evalNum,
              evalHeaderId,
              viewFlag: true,
            },
          });
        } else {
          this.$notification.open({ message: this.$T("scux.supBidApplication.message.noHeaderId").$D("该标的暂无现场考察报告") });
        }
      });
    },
    jumpToBid(record) {
      const { targetCode, targetInfoId } = record;
      this.$router.push({
        path: "/appCux/XxjtBidApplication",
        query: {
          targetCode,
          targetInfoId,
        },
      });
    }
  },
};
</script>

<style scoped lang="stylus">
.price-execute-approval {
  width: 100%;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  >>> .srm-line-tab {
    height: 100%;
  }
  >>> .srm-line-tab-content {
    background-color: var(--color-border-default);
  }

  >>> .srm-tab-pane {
    background-color: var(--color-border-default);
  }
  >>> .srm-tab-pane-title {
    background-color: var(--color-border-default);
  }
  >>> .customize-item .srm-field-wrapper {
    background-color: #ffffff !important;
  }
  >>> .textarea-head {
  .srm-textarea {
      height: 450px !important;
      line-height: 1.5 !important;
    }
  }
}
</style>