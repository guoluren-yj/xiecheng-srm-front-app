import { SrmButton, SrmFlex, SrmUtil } from "srm-mobile-ui";
// import uuid from "uuid";
export default {
  data() {
    return {};
  },
  methods: {
    //基本信息
    getRfxColumns() {
      return [
        {
          formRow: 0,
          fieldCode: "customHeader",
          fieldType: "EMPTY",
          render: (val, item) => <SrmListHeader>
            <span>{item.rfxNum}</span>
            <span slot="right">{item.rfxStatusMeaning}</span>
          </SrmListHeader>
        },
        {
          fieldName: this.$T("ssrc.queryRfq.model.queryRfq.inquiryTitle").$D("询价单标题"),
          fieldCode: "rfxTitle",
          fieldType: "TEXT",
          defaultValue: "",
        },
        {
          fieldName: this.$T("ssrc.queryRfq.model.queryRfq.company").$D("公司"),
          fieldCode: "companyName",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.startTime").$D("开始时间"),
          fieldCode: "quotationStartDate",
        },
        {
          fieldName: this.$T("ssrc.queryRfq.model.queryRfq.quotationDeadline").$D("报价截止时间"),
          fieldCode: "quotationEndDate",
        },
        {
          fieldName: this.$T("ssrc.queryRfq.model.queryRfq.creater").$D("创建人"),
          fieldCode: "createByName",
        },
        {
          formRow: 1000,
          fieldCode: "customBottom",
          fieldType: "EMPTY",
          render: (val, item) => {
            const getUserId = SrmUtil.getUserInfo().id;
            const flag = (item.rfxStatus === "CHECK_PENDING" ||
                    item.rfxStatus === "CHECK_REJECTED" ||
                    item.rfxStatus === "ROUND_QUOTATION") &&
                    item.checkedBy === getUserId;
            if (flag) {
              return <SrmFlex justify="end" ><SrmButton fill onClick={ () => this.goToPricing(item) }> { this.$T("ssrc.inquiryHall.view.message.title.checkPrice").$D("核价")} </SrmButton></SrmFlex>;
            }
          }
        }
      ];
    },
    getBidColumns() {
      return [
        {
          formRow: 0,
          fieldCode: "customHeader",
          fieldType: "EMPTY",
          render: (val, item) => <SrmListHeader>
            <span>{item.rfxNum}</span>
            <span slot="right">{item.rfxStatusMeaning}</span>
          </SrmListHeader>
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.Title").$D("招标书标题"),
          fieldCode: "rfxTitle",
          fieldType: "TEXT",
          defaultValue: "",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inEnquiryHall.companyName").$D("公司"),
          fieldCode: "companyName",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.quotationStartTime").$D("投标开始时间"),
          fieldCode: "quotationStartDate",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.quotationDeadline").$D("投标截止时间"),
          fieldCode: "quotationEndDate",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.createdBy").$D("创建人"),
          fieldCode: "createdByName",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.implementation").$D("执行情况"),
          fieldCode: "implementation",
          render:(val, record) => {
            if (
              [
                "NOT_START", // 未开始
                "RELEASE_APPROVING", // 发布审批中
                "CHECK_APPROVING", // 核价审批中/定标审批中
                "PRE_EVALUATION_APPROVING", // 候选人审批中
                "RELEASE_REJECTED", // 发布审批拒绝
                "CHECK_REJECTED", // 核价审批拒绝/定标审批拒绝
                "PRE_EVALUATION_PENDING_REJECT", // 候选人审批拒绝
                "IN_PREQUAL", // 资格预审中
                "PENDING_PREQUAL", // 待预审审批
                "IN_QUOTATION", // 报价中/投标中
                "LACK_QUOTED", // 报价响应不足/投标响应不足
                "OPEN_BID_PENDING", // 待开标
                "OPENED", // 已开标
                "ROUND_QUOTATION", // 多轮报价
                "PRETRIAL_PENDING", // 待初审
                "CHECKING", // 核价中
                "SCORING", // 评分中
                "PAUSED", // 暂停
                "FINISHED", // 完成
                "CHECK_PENDING", // 待核价/待定标
              ].includes(record.rfxStatus)) {
              return <srm-flex>
                <srm-button type="primary" plain rect onClick={() => this.toImplementation(record)}>{this.$T("ssrc.inquiryHall.model.inquiryHall.implementation").$D("执行情况")}</srm-button>
              </srm-flex>;
            }
          }
        },
        // {
        //   formRow: 1000,
        //   fieldCode: "customBottom",
        //   fieldType: "EMPTY",
        //   render: (val, item) => {
        //     const getUserId = JSON.parse(window.localStorage.getItem("userInfo")).id;
        //     const flag = (item.rfxStatus === "CHECK_PENDING" ||
        //             item.rfxStatus === "CHECK_REJECTED" ||
        //             item.rfxStatus === "ROUND_QUOTATION") &&
        //             item.checkedBy === getUserId;
        //     if (flag) {
        //       return <SrmFlex justify="end" ><SrmButton fill onClick={ () => this.goToPricing(item) }> { this.$T("ssrc.inquiryHall.view.message.title.checkPrice").$D("核价")} </SrmButton></SrmFlex>;
        //     }
        //   }
        // }
      ];
    },
  }
};
