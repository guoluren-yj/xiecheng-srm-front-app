<!-- 伽蓝纯二开的供应商免现场评审功能- -->
<template>
  <div class="detail-wrap">
    <!-- 内容区 -->
    <!-- 供应商免现场评审申请审批 -->
    <srm-button-group>
      <srm-button fill>
        <srm-upload
          :attachment-uuid="attachmentUuid"
          :show-count="false"
          :show-icon="false"
          :desc-title="
            $T('scux.commercialTermsPre.model.annexUuid').$D('相关附件')
          "/>
      </srm-button>
    </srm-button-group>
    <div class="content-item">
      <div
        class="no-onnSite-review-approval">
        <div class="content">
          <!-- 个性化组件替换后的代码 -->
          <customize-detail
            :columns="getNoOnSiteReviewApprovalInfoColumns"
            :data-source="noOnSiteReviewApprovalInfo"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getNoSiteReviewInfoApi } from "./api/NoOnSiteReview";
import { SrmButton, SrmTag } from "srm-mobile-ui";
import SrmButtonGroup from "@/components/V5/SrmButtonGroup";

export default {
  modules: [ "scux.noOnSiteReviewApp", "scux.commercialTermsPre" ],
  name: "NoOnSiteReviewApproval",
  components: {
    SrmButtonGroup,
    SrmButton,
    // eslint-disable-next-line vue/no-unused-components
    SrmTag
  },
  props: {
    changeReqId: {
      type: String | Number,
      default: "",
    },
  },
  data() {
    return {
      noSiteReviewId: "",
      noOnSiteReviewApprovalInfo: {},
      attachmentUuid: "", //当前传入的文件uuid
    };
  },
  computed: {
    //供应商免现场评审申请审批
    getNoOnSiteReviewApprovalInfoColumns() {
      const columns = [
        {
          fieldName: this.$T("scux.noOnSiteReviewApp.model.outSiteReviewNum").$D("申请编号"),
          fieldCode: "outSiteReviewNum",
          formRow:10
        },
        {
          fieldName: this.$T("scux.noOnSiteReviewApp.model.unitName").$D("提报部门"),
          fieldCode: "unitName",
          formRow:20
        },
        {
          fieldName: this.$T("scux.noOnSiteReviewApp.model.realName").$D("提报人"),
          fieldCode: "realName",
          formRow:30,
        },
        {
          fieldName: this.$T("scux.noOnSiteReviewApp.model.creationDate").$D("提报日期"),
          fieldCode: "creationDate",
          formRow:40,
        },
        {
          fieldName: this.$T("scux.noOnSiteReviewApp.model.companyTypeMeaning").$D("企业性质"),
          fieldCode: "companyTypeMeaning",
          required:1,
          formRow:50,
        },
        {
          fieldName: this.$T("scux.noOnSiteReviewApp.model.itemCategoryName").$D("拟采购品类"),
          fieldCode: "itemCategoryName",
          required:1,
          render: (val) => {
            const itemCategoryNameList = val.split(",");
            return (
              <div>
                {itemCategoryNameList
                  .filter((i) => Boolean(i))
                  .map((v) =>
                    <SrmTag size="mid" fill type="info">
                      {v}
                    </SrmTag>
                  )}
              </div>
            );
          },
          formRow:60,
        },
        {
          fieldName: this.$T("scux.noOnSiteReviewApp.model.supplierCompanyName").$D("供应商名称"),
          fieldCode: "supplierCompanyName",
          required:1,
          formRow:70,
        },
        {
          fieldName: this.$T("scux.noOnSiteReviewApp.model.outSiteReviewAttribute").$D("免现场评审属性"),
          fieldCode: "outSiteReviewAttributeMeaning",
          required:1,
          formRow:80,
        },
        {
          fieldName: this.$T("scux.noOnSiteReviewApp.model.reviewNum").$D("预审单号"),
          fieldCode: "reviewNum",
          formRow:90,
        },
        {
          fieldName: this.$T("scux.noOnSiteReviewApp.model.planPartnerTime").$D("计划合作时间"),
          fieldCode: "planPartnerTime",
          formRow:100,
        },
        {
          fieldName: this.$T("scux.noOnSiteReviewApp.model.mainPartnerComments").$D("供应商化妆品主要客户"),
          fieldCode: "mainPartnerComments",
          required:1,
          formRow:110,
        },
        {
          fieldName: this.$T("scux.noOnSiteReviewApp.model.outSiteReviewComments").$D("申请免现场评审原因"),
          fieldCode: "outSiteReviewComments",
          required:1,
          formRow:120,
        },
        {
          fieldName: this.$T("scux.noOnSiteReviewApp.model.comments").$D("备注说明"),
          fieldCode: "comments",
          required:1,
          formRow:130,
        },
      ];

      return columns;
    },
  },
  mounted() {
    this.noSiteReviewId = this.changeReqId;
    this.getNoSiteReviewInfo();
    this.$emit(
      "GetApprovalTitle",
      this.$T("scux.noOnSiteReviewApp.view.title.noOnSiteReviewAppoval").$D(
        "供应商免现场评审申请审批"
      )
    );
  },
  methods: {
    //获取供应商免评审申请信息
    getNoSiteReviewInfo() {
      getNoSiteReviewInfoApi(this.noSiteReviewId).then((res) => {
        this.noOnSiteReviewApprovalInfo = res;
        this.attachmentUuid = res.attachmentUuid;
      });
    },
  },
};
</script>

<style scoped lang="stylus">
>>> .customize-detail .form-item .value {
  justify-content: start;
}

>>> .srm-tag-mid {
  margin-right: 12px;
}

>>> .srm-tag-fill-info {
  background: #f6f6f6;
  color: #333;
}

>>> .file-title {
  font-size: 14px;
  font-family: PingFangSC, PingFangSC-Medium;
  font-weight: 500;
  color: var(--color-font-default-d);
}

>>> .navWrap .navContent li.active:before {
  display: none;
}

>>> .navWrap .navContent li {
  font-size: 14px;
  font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  color: #afafaf;
}

>>> .navWrap .navContent li.active {
  font-size: 18px;
  font-family: PingFangSC, PingFangSC-Medium;
  font-weight: 500;
  color: #1f1f1f;
}
>>> .srm-upload-title{
  color:#fff;
}
.detail-wrap {
  height: calc(100vh - 250px);
  overflow: auto;

  .no-onnSite-review-approval {
    width: 100%;
    overflow-y: auto;
    background: #F0F2F5;

    .content {
      padding-left: 15px;
    }
  }
}
</style>
