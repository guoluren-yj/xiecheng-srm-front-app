import { $T } from "srm-mobile-ui";
export default {
  data() {
    return {};
  },
  methods: {
    getHistoryScoreColumns(isBid) {
      return [
        {
          formRow: 0,
          fieldCode: "sourceNum",
          fieldType: "EMPTY",
          render: (val, record) => <SrmListHeader>
            <span>{val}</span>
            <span slot="right"
              class="statusC">{ record.teamMeaning }</span>
          </SrmListHeader>
        },
        {
          fieldCode: "sourceTitle",
          fieldName:$T("ssrc.expertScoring.model.expertScoring.sourceTitle").$D("寻源标题")
        },
        {
          fieldCode: "companyName",
          fieldName:$T("hipspfm.common.message.company").$D("公司")
        },
        {
          fieldCode: isBid ? "secondarySourceCategoryMeaning" : "sourceCategoryMeaning",
          fieldName:$T("hipspfm.expertScoring.view.message.sourceType").$D("寻源类型")
        },
        {
          fieldCode: "sourceMethodMeaning",
          fieldName:$T("ssrc.expertScoring.model.expertScoring.sourceMethod").$D("寻源方式")
        },
        {
          fieldCode: "bidOpenDate",
          fieldType: "EMPTY",
          render: (val) => <span style="font-weight:700">{this.$T("ssrc.expertScoring.model.bidHall.bidOpenDate").$D("开标时间")}:{val}</span>
        }
      ];
    },
  }
};
