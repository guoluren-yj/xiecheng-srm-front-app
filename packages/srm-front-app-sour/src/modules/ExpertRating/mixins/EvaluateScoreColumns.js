import { $T } from "srm-mobile-ui";
export default {
  data() {
    return {};
  },
  methods: {
    getEvaluateScoreColumns(isBid) {
      return [
        {
          formRow: 0,
          fieldCode: "sourceNum",
          fieldType: "EMPTY",
          render: (val, record) => <SrmListHeader>
            <span>{val}</span>
            <span slot="right"
              class={record.sourceStatus === "SCORING" ? "statusA" : "statusB"}>{ record.sourceStatusMeaning }</span>
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
          fieldCode: "teamMeaning",
          fieldName:$T("ssrc.expertScoring.model.expertScoring.teamMeaning.").$D("评分组别")
        },
        {
          fieldCode: isBid ? "secondarySourceCategoryMeaning" : "sourceCategoryMeaning",
          fieldName:$T("ssrc.expertScoring.model.expertScoring.sourceCategory").$D("寻源类别")
        },
        {
          fieldCode: "operateMeaning",
          fieldType: "EMPTY",
          render: (val, record) => <ul>
            {
              record.operates.length === 0 && <li class="footer-li operate">
                <span/>
              </li>
            }
            {
              record.operates.length === 1 && <li class="footer-li operate">
                <span style={{ padding: 0 }} onClick={() => this.toDetail(record.operates[0].value, record)}>{ record.operates[0].meaning}</span>
              </li>
            }
            {
              record.operates.length === 2 &&
              <li class="foot-li">
                <span style={{ padding: 0 }} onClick={() => this.toDetail(record.operates[0].value, record)}>{record.operates[0].meaning}</span>
                <span style={{ padding: 0 }} onClick={() => this.toDetail(record.operates[1].value, record)}>{record.operates[1].meaning}</span>
              </li>
            }
          </ul>
        }
      ];
    },
  }
};
