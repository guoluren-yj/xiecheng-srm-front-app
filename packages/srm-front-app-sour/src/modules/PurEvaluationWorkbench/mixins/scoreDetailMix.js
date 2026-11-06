import { dateFormat } from "@/utils/index";
import { $T } from "srm-mobile-ui";
import ButtonTabs from "../component/ButtonTabs.vue";
import { isNil } from "lodash";
import uuid from "uuid";
import SrmLineHeader from "../component/SrmLineHeader.vue";
import { isEmpty } from "lodash";

export default {
  components: { SrmLineHeader },
  data() {
    return {
      editStyle: {
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "row",
        width: "100%",
        alignItems: "center",
        paddingLeft: "4px",
        background: "#eff3fe",
      },
      disabledStyle: {
        display: "flex",
        width: "100%",
      },
    };
  },
  computed:{
    // 详情头
    getHeaderColumns() {
      return [
        {
          fieldCode: "evalDescription",
          render: (val, data) => <div style="width: 100%;">
            {data.supplierName}-{data.assessTypeMeaning}
          </div>
        },
        {
          fieldCode: "evalDate",
          render: (val, data) => `${dateFormat(data.evalDateFrom)}~${dateFormat(data.evalDateTo)}`
        }
      ];
    },
    // 评估信息Columns
    getAssessmentColumns() {
      return (lineRecord) => {
        const columns = [
          {
            fieldCode: "indicatorCode",
            fieldType: "EMPTY",
            formRow: 0,
            render: (val, record) => {
              const { siteEvalLineResp, evalResps } = record || {};
              let abandonedFlag = false;
              if (this.dimen === this.dimenTab.element) {
                abandonedFlag = isNil(evalResps) ? false : evalResps.filter((e) => e.completeFlag !== 4).length === 0;
              } else {
                abandonedFlag = siteEvalLineResp?.completeFlag === 4;
              }
              return <SrmListHeader show-open-tag={false}>
                <div style={{ display: "flex" }}>
                  <div style={{ display: "flow-root" }}>
                    <srm-tag size="small" type="primary">{record.indicatorTypeMeaning}</srm-tag>
                  </div>
                </div>
                <div slot="right">
                  {!abandonedFlag && <srm-tag size="small" type="primary">
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                      <span>{$T("sslm.purchaserEvaluationDetail.table.column.label.score").$D("得分")}</span>
                      <span style={{ fontSize: "12px", fontWeight: 600, color: "#276EF1", marginLeft: "3px", paddingTop: "1px" }}>
                        { this.dimen === this.dimenTab.element ? record.finalScore || 0 : record.respScore || 0 }
                      </span>
                    </div>
                  </srm-tag>}
                  {abandonedFlag && <srm-tag size="small" type="info">
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                      <span>
                        {$T("sslm.purchaserEvaluationDetail.table.column.label.abandon").$D("已放弃")}
                      </span>
                    </div>
                  </srm-tag>}
                </div>
              </SrmListHeader>;
            },
          },
          {
            fieldCode: "indicatorName",
            fieldType: "EMPTY",
            formRow: 1,
            render: (val, record) => <span style={{ fontSize: "14px", color: "#1D2129", lineHeight: "22px", fontWeight: 600 }}>{`${record.indicatorCode} ${record.indicatorName}`}</span>,
          },
          {
            fieldCode: "evalStandard",
            fieldType: "EMPTY",
            formRow: 2,
            visible: (val) => !isEmpty(val),
            render: (val, record) => {
              const { evalStandard } = record || {};
              return <div class="srm-line-remark">
                <div class="srm-line-content" >{ evalStandard || "" }</div>
                {this.dimen === this.dimenTab.scorer && <div class="srm-line-division"/>}
              </div>;
            },
          },
          this.dimen === this.dimenTab.element && {
            fieldCode: "respScore",
            fieldType: "EMPTY",
            render: (val, record) => <ButtonTabs basicInfo={this.basicInfo} record={record}/>,
          },
          this.dimen !== this.dimenTab.element && {
            fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.score").$D("得分"),
            fieldCode: "respScore",
            fieldType: "EMPTY",
            visible:(val, record) => record.indicatorType === "SCORE",
            render: (val, record, property) => {
              const { fieldName } = property;
              const { indicatorType, siteEvalLineResp, scoreFrom, scoreTo } = record;
              const disabledFlag = !this.isEdit || siteEvalLineResp?.completeFlag === 4 || indicatorType !== "SCORE";
              // 兼容行编辑图标样式
              return <div style={disabledFlag ? this.disabledStyle : this.editStyle }>
                <span style={{ marginRight: "8px", color:"var(--font-color-field2)" }}>{fieldName}:</span>
                <div style={{ flex: 1 }}>
                  {disabledFlag ? val || "-" :
                    <srm-input-field
                      v-model={record.respScore}
                      disabled={disabledFlag}
                      onBlur={(blurVal) => {
                        if (!isEmpty(blurVal) && blurVal > scoreTo) {
                          this.$notification.open({
                            message: this.$T("sslm.purchaserEvaluationDetail.table.message.maxScore").$D("得分不能大于最大分数"),
                            description: "",
                            class: "notification"
                          });
                          lineRecord.respScore = scoreTo;
                          return scoreTo;
                        } else if (!isEmpty(blurVal) && blurVal < scoreFrom) {
                          this.$notification.open({
                            message: this.$T("sslm.purchaserEvaluationDetail.table.message.minScore").$D("得分不能小于最小分数"),
                            description: "",
                            class: "notification"
                          });
                          lineRecord.respScore = scoreFrom;
                          return scoreFrom;
                        }
                      }}/>
                  }
                </div>
              </div>;
            },
          },
          // this.dimen !== this.dimenTab.element && {
          //   fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.score").$D("得分"),
          //   fieldCode: "respScore",
          //   fieldType: "INPUT",
          //   disabled: (val, record) => {
          //     const { indicatorType, siteEvalLineResp } = record;
          //     const disabledFlag = !this.isEdit || siteEvalLineResp?.completeFlag === 4 || indicatorType !== "SCORE";
          //     return disabledFlag;
          //   },
          //   visible:(val, record) => record.indicatorType === "SCORE",
          //   inputChange: (val, record) => {
          //     console.log("inputChange:", val, record);
          //     const { scoreFrom, scoreTo } = record || {};
          //     if (!isEmpty(val) && val > scoreTo) {
          //       this.$notification.open({
          //         message: this.$T("sslm.purchaserEvaluationDetail.table.message.maxScore").$D("得分不能大于最大分数"),
          //         description: "",
          //         class: "notification"
          //       });
          //       lineRecord.respScore = scoreTo;
          //       return scoreTo;
          //     } else if (!isEmpty(val) && val < scoreFrom) {
          //       this.$notification.open({
          //         message: this.$T("sslm.purchaserEvaluationDetail.table.message.minScore").$D("得分不能小于最小分数"),
          //         description: "",
          //         class: "notification"
          //       });
          //       lineRecord.respScore = scoreFrom;
          //       return scoreFrom;
          //     }
          //     return val;
          //   },
          // },
          this.dimen !== this.dimenTab.element && {
            fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.isVeto").$D("否决该项"),
            fieldCode: "respIsVeto",
            fieldType: "SELECT",
            lovCode: "SSLM_IS_TRUE",
            disabled: (val, record) => {
              const { siteEvalLineResp, indicatorType } = record;
              const disabledFlag = !this.isEdit || siteEvalLineResp?.completeFlag === 4 || indicatorType !== "VETO";
              return disabledFlag;
            },
            visible:(val, record) => record.indicatorType === "VETO",
            options: {
              onClear: () => {
                lineRecord.respIsVeto = null;
                lineRecord.respScore = null;
                lineRecord.respIsVetoMeaning = null;
              },
              callback: (val) => {
                const item = val.length ? val[0] : {};
                lineRecord.respIsVetoMeaning = item.meaning;
              },
            }
          },
          this.dimen !== this.dimenTab.element && {
            fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.isStandard").$D("符合评分标准"),
            fieldCode: "respIsStandard",
            fieldType: "SELECT",
            lovCode: "SSLM_IS_TRUE",
            disabled: (val, record) => {
              const { siteEvalLineResp, indicatorType } = record;
              const disabledFlag = !this.isEdit || siteEvalLineResp?.completeFlag === 4 || indicatorType !== "TICK";
              return disabledFlag;
            },
            visible:(val, record) => record.indicatorType === "TICK",
            options: {
              onClear: () => {
                lineRecord.respIsStandard = null;
                lineRecord.respScore = null;
                lineRecord.respIsStandardMeaning = null;
              },
              callback: (val) => {
                const item = val.length ? val[0] : {};
                lineRecord.respIsStandardMeaning = item.meaning;
              },
            }
          },
          this.dimen !== this.dimenTab.element && {
            fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.indOptName").$D("评分选项"),
            fieldCode: "respEvalTplIndOptId",
            fieldType: "SELECT",
            lovCode: "SSLM.KPI.INDICATOR.OPT.CFG",
            displayField:"respEvalTplIndOptName",
            disabled: (val, record) => {
              const { siteEvalLineResp, indicatorType } = record;
              const disabledFlag = !this.isEdit || siteEvalLineResp?.completeFlag === 4 || indicatorType !== "OPT";
              return disabledFlag;
            },
            visible:(val, record) => record.indicatorType === "OPT",
            options: {
              displayField: "meaning",
              valueField: "evalTplIndId",
              queryParams:{
                evalTplIndId: lineRecord?.evalTplIndId,
              },
              callback: (val) => {
                const item = val.length ? val[0] : {};
                const { score } = item;
                lineRecord.respScore = score;
              },
              onClear: () => {
                lineRecord.respScore = null;
              },
            }
          },
          this.dimen !== this.dimenTab.element && {
            fieldName: $T("hzero.common.remark").$D("备注"),
            fieldCode: "respRespRemarks",
            fieldType: this.isEdit ? "TEXT_AREA" : "TEXT",
            disabled: (val, record) => !this.isEdit || record.siteEvalLineResp?.completeFlag === 4,
          },
          this.dimen !== this.dimenTab.element && {
            fieldCode: "operation",
            formRow: 99999,
            fieldType: "EMPTY",
            render: (val, record) => {
              const { abandonFlag } = this.basicInfo || {};
              const { respScoreAttachmentCount, siteEvalLineResp } = record || {};
              const abandonedFlag = siteEvalLineResp?.completeFlag === 4;
              const showAbandonScore = this.isEdit && Boolean(abandonFlag) && !abandonedFlag;
              const showAttachment = this.isEdit && !abandonedFlag;
              return <srm-flex justify="end">
                {showAbandonScore && <srm-button
                  style={{ marginRight: "8px" }}
                  type="danger"
                  size="small"
                  bordered
                  onClick={() => this.handleAbandonScore(record)}
                >
                  { this.$T("sslm.common.view.button.giveUpScore").$D("放弃评分") }
                </srm-button>}
                <srm-button
                  style={{ marginRight: "8px" }}
                  type="primary"
                  size="small"
                  bordered
                  onClick={() => this.handleAttachment(record, !showAttachment)}
                >
                  { showAttachment ? this.$T("sslm.common.view.message.upload").$D("上传附件") : this.$T("smbl.common.message.title.viewAttachment").$D("查看附件") } {respScoreAttachmentCount}
                </srm-button>
              </srm-flex>;
            }
          },
        ].filter(Boolean);
        return columns;
      };
    },
  },
  methods:{
    // 附件回调
    handleAttachment(record, readonly) {
      // 评分附件
      if (isNil(record.respScoreAttachmentUuid)) {
        record.respScoreAttachmentUuid = uuid();
      }
      this.$attachment({
        attachments: [
          {
            attachmentUuid: record.respScoreAttachmentUuid,
            title: this.$T("smbl.common.message.title.viewAttachment").$D("查看附件"),
            readonly: readonly, // 隐藏删除按钮
            showInfo: true,
            uploadButton: readonly ? "none" : "default", // 上传按钮
          },
        ],
      });
    },
  }
};