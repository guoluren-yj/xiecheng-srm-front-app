<script>
import {
  getBasicInfoApi,
  saveAttachmentApi,
  saveFilledApi,
  submitFilledApi,
} from "../api/index";
import { queryCustomize } from "@/utils/api";
import { reportBasicDS } from "../datasource/ReportBasicDS";
import { reviewMaterDS } from "../datasource/ReviewMaterDS";
import { inspectTeamDS } from "../datasource/InspectTeamDS";
import { scoreInfoDataSet } from "../datasource/ScoreInfoDataSet";
import { scorePeopleDataSet } from "../datasource/ScorePeopleDataSet";
import { attachmentDS } from "../datasource/AttachmentDS";
import ScorerMaintainView from "../components/ScorerMaintainView";
import ScorerAttchmentView from "../components/ScorerAttchmentView";
import { DataSet, SrmUtil } from "srm-mobile-ui";
// import dynamicTable from "../mixins/dynamicTable";
export default {
  modules: [ "sslm.siteInvestigateReport", "smbl.common", "sslm.commonApplication", "sslm.common", "hzero.common", "sslm.common" ],
  name: "SiteInvestigationReportFilled",
  components: {
    ScorerMaintainView,
    ScorerAttchmentView,
  },
  // mixins: [ dynamicTable ],
  data() {
    return {
      navTitle: null,
      evalHeaderId: null,
      siteLocationVisible: 0, // 个性化默认隐藏
      basicInfo: {},
      editable: {
        basicInfo: false,
        matercategory: false,
        inspectTeam: false,
        attachment: true,
        scoreInfo: true,
      },
      // basicInfoDetailFlag: false,
      basicDataSet: null,
      // 物料/品类
      reviewMaterDataSet: null,
      // 考察小组
      inspectTeamDataSet: null,
      // 评分人汇总信息
      scorePeopleDataSet: null,
      // 评分信息
      scoreInfoDataSet: null,
      scorerEditPopFlag: false,
      scorerInfoIds: [],
      targetLineId: null,
      selectedEvalLineId: null,
      scoreAttEditFlag: false,
      // 编号记录
      localLineNum: {
        materLineNum: 0,
        inspectTeamLineNum: 0,
      },
      // 附件
      attachmentDataSet: null,
      msgJumpFlag:false,
    };
  },
  computed: {
    // 底部按钮
    bottomButtons() {
      return [
        {
          title: this.$T("smbl.common.view.save").$D("保存"),
          handler:async() => {
            if (!this.scoreInfoDataSet.validate()) {
              return;
            }
            // 配置表数据获取及必输校验
            /**
            const dynamicTableObj = this.$refs.dynamicTable.getDynamicTableData() || {};
            const { checkDataFlag, dynamicTableList } = dynamicTableObj;
            if (!checkDataFlag) {
              return;
            }
            const modelDatas = dynamicTableList.filter((e) => [ "create", "update" ].includes(e._itemStatus)).map((e) => {
              // eslint-disable-next-line no-unused-vars
              const { dataId, _defaultValueInitialize, _itemStatus, _status, ...other } = e;
              return other;
            }) || [];
            const needRefreshModelDatasFlag = modelDatas && modelDatas.length > 0 || false; */
            let siteEvalAttLns = [];
            (this.attachmentDataSet.records || []).forEach((record) => {
              let attData = {
                ...record.data,
              };
              if (attData.insideFlag !== 0 && attData.insideFlag !== "0" && attData.insideFlag !== 1 && attData.insideFlag !== "1") {
                attData.insideFlag = null;
              }
              siteEvalAttLns.push(attData);
            });
            this.basicInfo.siteEvalAttLns = siteEvalAttLns;
            let siteEvalLineResps = [];
            (this.scoreInfoDataSet.records || []).forEach((record) => {
              siteEvalLineResps.push({
                ...record.data,
              });
            });
            // 评分人汇总信息
            const siteEvalRespHeader = this.scorePeopleDataSet.records[0].data || {};
            this.basicInfo.siteEvalLineResps = siteEvalLineResps;
            this.basicInfo.siteEvalRespHeader = siteEvalRespHeader;
            // this.basicInfo.modelDatas = modelDatas;
            this.$loading.show();
            // 判断接口返回的siteLocation是否有值
            const siteLocation = this.scorePeopleDataSet.current &&
                this.scorePeopleDataSet.current.getField("siteLocation") &&
                this.scorePeopleDataSet.current.getField("siteLocation").getValue();
            if (this.siteLocationVisible && !siteLocation) {
              const location = await this.$geoLocation().then((res) => res).catch(() => false);
              if (location) {
                const { province = "", city = "", addr = "" } = location;
                const address = `${province} ${city} ${addr}`;
                this.scorePeopleDataSet.current.set("siteLocation", address);
              }
            }
            saveFilledApi(this.basicInfo).then((res) => {
              this.$loading.hide();
              if (!res.failed) {
                // 刷新界面
                // this.basicDataSet = null;
                // this.reviewMaterDataSet = null;
                // this.inspectTeamDataSet = null;
                // this.attachmentDataSet = null;
                // this.scoreInfoDataSet = null;
                this.localLineNum.materLineNum = 0;
                this.localLineNum.inspectTeamLineNum = 0;
                this.requestData();
                // 刷新配置表数据
                /** if (needRefreshModelDatasFlag) {
                  this.$refs.dynamicTable.refreshData();
                } */
                this.$notification.open({
                  message: this.$T("smbl.common.message.save.success").$D("保存成功"),
                  description: "",
                  class: "notification"
                });
              }
            }).catch(() => {
              this.$loading.hide();
            });
          },
        },
        {
          title: this.$T("sslm.commonApplication.view.button.submit").$D("提交"),
          fill: true,
          handler: () => {
            if (!this.scoreInfoDataSet.validate()) {
              return;
            }
            let siteEvalAttLns = [];
            (this.attachmentDataSet.records || []).forEach((record) => {
              let attData = {
                ...record.data,
              };
              if (attData.insideFlag !== 0 && attData.insideFlag !== "0" && attData.insideFlag !== 1 && attData.insideFlag !== "1") {
                attData.insideFlag = null;
              }
              siteEvalAttLns.push(attData);
            });
            this.basicInfo.siteEvalAttLns = siteEvalAttLns;
            let siteEvalLineResps = [];
            (this.scoreInfoDataSet.records || []).forEach((record) => {
              siteEvalLineResps.push({
                ...record.data,
              });
            });
            // 评分人汇总信息
            const siteEvalRespHeader = this.scorePeopleDataSet.records[0].data || {};
            this.basicInfo.siteEvalRespHeader = siteEvalRespHeader;
            this.basicInfo.siteEvalLineResps = siteEvalLineResps;
            this.$loading.show();
            submitFilledApi(this.basicInfo).then((res) => {
              if (!res.failed) {
                if (this.msgJumpFlag) {
                  setTimeout(() => {
                    this.$router.replace({ name: "SiteInvestigationReportManage" });
                  }, 1000);
                } else {
                  this.$router.back();
                }
              }
            }).finally(() => {
              this.$loading.hide();
            });
          },
        }
      ];
    },
    // 基础信息
    getBasicInfoColumns() {
      return [ {
        fieldCode: "evalNum",
      }, {
        fieldCode: "realName",
      }, {
        fieldCode: "creationDate",
      }, {
        fieldCode: "evalDescription",
      }, {
        fieldCode: "evalType",
      }, {
        fieldCode: "evalDateFrom",
      }, {
        fieldCode: "evalDateTo",
      }, {
        fieldCode: "supplierCompanyId",
      }, {
        fieldCode: "supplierContactor",
      } ];
    },
    // 基础信息-详情
    getBasicInfoDetailColumns() {
      return [ {
        fieldCode: "evalNum",
      }, {
        fieldCode: "evalDescription",
      }, {
        fieldCode: "evalStatusMeaning",
      }, {
        fieldCode: "creationDate",
      }, {
        fieldCode: "realName",
      }, {
        fieldCode: "unitId",
      }, {
        fieldCode: "companyId",
      }, {
        fieldCode: "ouId",
      }, {
        fieldCode: "invOrganizationId",
      }, {
        fieldCode: "inventoryId",
      }, {
        fieldCode: "evalType",
      }, {
        fieldCode: "evalTplId",
      }, {
        fieldCode: "weightedFlag",
      }, {
        fieldCode: "evalDateFrom",
      }, {
        fieldCode: "evalDateTo",
      }, {
        fieldCode: "supplierCompanyId",
      }, {
        fieldCode: "supplierContactor",
      }, {
        fieldCode: "supplierContactMail",
      }, {
        fieldCode: "supplierContactPhone",
      }, {
        fieldCode: "needFeedbackFlag",
      }, {
        fieldCode: "callSuppliersFlag",
      }, {
        fieldCode: "supplierType",
      }, {
        fieldCode: "investigationType",
      }, {
        fieldCode: "supplierOverview",
      }, {
        fieldCode: "supplierRegisteredAddress",
      }, {
        fieldCode: "evalAddress",
      }, {
        fieldCode: "evalRemark",
      }, {
        fieldCode: "backRemark",
      } ];
    },
    // 考察物料/品类
    getMatersColumns() {
      return [ {
        fieldCode: "header",
        fieldType: "EMPTY",
        render: (val, item) => {
          let index = item.localLineNum;
          if (index < 10) {
            index = "0" + String(index);
          } else {
            index = String(index);
          }
          return <srm-list-header show-open-tag={false}>
            {
              this.$T("smbl.common.model.lineNumber").$D("行号") + "：" + index
            }
          </srm-list-header>;
        },
      }, {
        fieldCode: "itemId",
      }, {
        fieldCode: "itemName",
      }, {
        fieldCode: "itemCategoryId",
      }, {
        fieldCode: "itemCategoryName",
      }, {
        fieldCode: "brand",
      }, {
        fieldCode: "remark",
      } ];
    },
    // 考察物料编辑按钮
    reviewMaterButtons() {
      return [ {
        text: this.$T("smbl.common.button.delete").$D("删除"),
        type: "danger",
        bordered: true,
        size: "small",
        visible: true,
        disabled: (records) => !records.length,
        callback: () => {
          this.reviewMaterDataSet.removeSelect();
          this.setFirstReponse(this.reviewMaterDataSet, false);
        }
      }, ];
    },
    // 考察小组
    getInspectTeamColumns() {
      return [ {
        fieldCode: "header",
        fieldType: "EMPTY",
        render: (val, item) => {
          let index = item.localLineNum;
          if (index < 10) {
            index = "0" + String(index);
          } else {
            index = String(index);
          }
          return <srm-list-header show-open-tag={false}>
            {
              this.$T("smbl.common.model.lineNumber").$D("行号") + "：" + index
            }
          </srm-list-header>;
        },
      }, {
        fieldCode: "userId",
      }, {
        fieldCode: "member",
      }, {
        fieldCode: "department",
      }, {
        fieldCode: "post",
      }, {
        fieldCode: "phone",
      }, {
        fieldCode: "email",
      }, {
        fieldCode: "leaderFlag",
      } ];
    },
    // 考察小组编辑按钮
    inspectTeamButtons() {
      return [ {
        text: this.$T("smbl.common.button.delete").$D("删除"),
        type: "danger",
        bordered: true,
        size: "small",
        visible: true,
        disabled: (records) => !records.length,
        callback: () => {
          this.inspectTeamDataSet.removeSelect();
          this.setFirstReponse(this.inspectTeamDataSet, false);
        }
      }, ];
    },
    // 评分人汇总信息
    getscorePeopleColumns() {
      return [ {
        fieldCode: "respUserName",
        formRow: 10,
      }, {
        fieldCode: "userDepartmentName",
        formRow: 20,
      }, {
        fieldCode: "sumScore",
        formRow: 30,
      }, {
        fieldCode: "siteLocation",
        formRow: 40,
      } ];
    },
    // 评分信息
    getScoreInfoColumns() {
      return [ {
        fieldCode: "indicatorCode",
        formRow: 10,
      }, {
        fieldCode: "indicatorName",
        formRow: 20,
      }, {
        fieldCode: "scoreTypeMeaning",
        formRow: 30,
      }, {
        fieldCode: "evalStandard",
        formRow: 40,
      }, {
        fieldCode: "indicatorTypeMeaning",
        formRow: 50,
        formCol: 10,
      }, {
        fieldCode: "supplierScore",
        formRow: 50,
        formCol: 20,
      }, {
        fieldCode: "supplierRemarks",
        formRow: 60,
      }, {
        fieldCode: "attachmentUuid",
        formRow: 69,
        formCol: 10,
      }, {
        fieldCode: "completeFlag",
        formRow: 80,
        formCol: 10,
        render: (val) => {
          if (val === 1) {
            return this.$T("sslm.siteInvestigateReport.modal.mange.completed").$D("已完成");
          } else if (val === 2) {
            return this.$T("sslm.siteInvestigateReport.model.mange.back").$D("退回");
          }
          return this.$T("sslm.siteInvestigateReport.modal.mange.unfinished").$D("未完成");
        },
      }, {
        fieldCode: "evalWeight",
        formRow: 80,
        formCol: 20,
      }, {
        fieldCode: "score",
        formRow: 90,
        formCol: 10,
      }, {
        fieldCode: "scoreFrom",
        formRow: 90,
        formCol: 20,
      }, {
        fieldCode: "scoreTo",
        formRow: 100,
        formCol: 10,
      }, {
        fieldCode: "defaultScore",
        formRow: 100,
        formCol: 20,
      }, {
        fieldCode: "isStandard",
        formRow: 120,
        formCol: 10,
      }, {
        fieldCode: "isVeto",
        formRow: 130,
        formCol: 10,
      }, {
        fieldCode: "indOptName",
        formRow: 140,
        formCol: 10,
      }, {
        fieldCode: "uploadAttachment",
        fieldType: "EMPTY",
        formRow: 150,
        render: (val, item) =>
          <srm-flex>
            <span>{this.$T("sslm.siteInvestigateReport.modal.common.gradeAttachment").$D("评分附件")}：</span>
            <srm-button plain={true} onClick={() => {
              this.selectedEvalLineId = item.evalLineId;
              this.scoreAttEditFlag = true;
            }}>{this.$T("sslm.common.view.message.upload").$D("上传附件")}</srm-button>
          </srm-flex>
        ,
      }, {
        fieldCode: "respRemarks",
        formRow: 160,
      } ];
    },
    // 评分信息-按钮（批量维护）
    scorerButtons() {
      return [ {
        text: this.$T("sslm.siteInvestigateReport.view.button.batchMaintenGrader").$D("批量维护"),
        bordered: true,
        size: "small",
        visible: true,
        fill: true,
        disabled: (records) => !records.length,
        callback: (records) => {
          let idsAry = [];
          records.forEach((e) => {
            let ids = this.getNoChildScoreInfoIds(e.data);
            idsAry.push(...ids);
          });
          this.scorerInfoIds = idsAry;
          this.targetLineId = null;
          this.scorerEditPopFlag = true;
        }
      }, ];
    },
    // 附件信息-按钮
    attachmentButtons() {
      return [ {
        text: this.$T("smbl.common.button.delete").$D("删除"),
        type: "danger",
        bordered: true,
        size: "mid",
        visible: true,
        disabled: (records) => !records.length,
        callback: () => {
          this.attachmentDataSet.removeSelect();
          this.setFirstReponse(this.attachmentDataSet, false);
        }
      }, ];
    },
    // 考察结果
    getInspectResultColumns() {
      return [ {
        fieldCode: "finalScore",
      }, {
        fieldCode: "grade",
      }, {
        fieldCode: "resultsFlag",
      }, {
        fieldCode: "opinion",
      }, {
        fieldCode: "informUserIds",
      }, {
        fieldCode: "resultLinkUuid",
      }, ];
    },
    // 附件
    getAttachmentColumns() {
      return [ {
        fieldCode: "lnEvalStatusMeaning",
      }, {
        fieldCode: "attachmentlType",
      }, {
        fieldCode: "attachmentDesc",
      }, {
        fieldCode: "attachmentSize",
      }, {
        fieldCode: "uploadDate",
      }, {
        fieldCode: "uploadUserName",
      }, {
        fieldCode: "insideFlag",
      }, {
        fieldCode: "remark",
      }, {
        fieldCode: "attachmentUrl",
        fieldType: "EMPTY",
        render: (val, item, v, record) => <srm-flex justify="end" style="padding: 14px 15px 2px 15px; height: 44px; border-top: 1px solid var(--split-line-color-primary);">
          {this.editable.attachment && item.lnEvalStatus === this.basicInfo.evalStatus ? <srm-button class="att-button" size="mid" bordered type="danger" onClick={() => {
            this.attachmentDataSet.removeRecords([ record ]);
          }}>{this.$T("smbl.common.button.delete").$D("删除")}</srm-button> : null}
          <srm-button class="att-button" size="mid" bordered onClick={() => {
            this.$downloadFile(item.attachmentUrl, SrmUtil.getDefaultBucketName(), "sslm-report");
          }}>{this.$T("smbl.common.view.button.download").$D("下载")}</srm-button>
          <srm-button class="att-button" size="mid" bordered onClick={() => {
            SrmUtil.previewFile({
              fileName: item.attachmentDesc,
              fileUrl: item.attachmentUrl,
              bucketName: SrmUtil.getDefaultBucketName(),
            });
          }}>{this.$T("hzero.common.preview").$D("预览")}</srm-button>
          { this.editable.attachment && item.lnEvalStatus === this.basicInfo.evalStatus ? item.localEditable ? <srm-button class="att-button" size="mid" bordered onClick={() => {
            // this.attachmentDataSet.submit();
            this.saveAttachmentAction(item);
            item.localEditable = false;
          }}>{this.$T("smbl.common.button.save").$D("保存")}</srm-button> :
            <srm-button class="att-button" size="mid" bordered onClick={() => {
              item.localEditable = true;
            }}>{this.$T("smbl.common.view.button.edit").$D("编辑")}</srm-button> : null}
        </srm-flex>,
      } ];
    }
  },
  beforeMount() {
    // 解析参数
    let params = this.$route.query;
    this.navTitle = params.evalNum;
    this.msgJumpFlag = params.msgJumpFlag;
    this.evalHeaderId = params.evalHeaderId;
    // 请求数据
    this.requestData();
    // 请求个性化
    this.queryCustomize();
  },
  methods: {
    async requestData() {
      // 基本信息
      this.$loading.show();
      let headInfo = await getBasicInfoApi(this.evalHeaderId);
      this.$loading.hide();
      this.navTitle = this.navTitle || headInfo.evalNum;
      this.basicInfo = headInfo;
      this.basicInfo.needFeedbackFlag = String(this.basicInfo.needFeedbackFlag);
      this.basicInfo.callSuppliersFlag = String(this.basicInfo.callSuppliersFlag);
      if (!this.basicDataSet) {
        this.basicDataSet = new DataSet(reportBasicDS(headInfo, "FILLED"));
      }
      this.basicDataSet.create(headInfo, 0);

      // 考察物料
      if (!this.reviewMaterDataSet) {
        this.reviewMaterDataSet = new DataSet(reviewMaterDS(this.evalHeaderId, this.localLineNum, "FILLED", headInfo));
      }
      this.reviewMaterDataSet.refresh();
      this.reviewMaterDataSet.events.afterQuery = (ds, datas) => {
        // 延时是因为执行时ds.records无法获取，临时方案
        setTimeout(() => {
          ds.records.forEach((r) => {
            const itemCategoryId = r.getField("itemCategoryId");
            // itemCategoryId.options.queryParams.itemId = itemIdValue;
            itemCategoryId.setLovParam({ itemId: r.data.itemId });
            const itemId = r.getField("itemId");
            // itemId.options.queryParams.categoryId = r.data.itemCategoryId;
            itemId.setLovParam({ categoryId: r.data.itemCategoryId });
          });
        }, 0);
        datas.forEach((e) => {
          e.evalStatus = headInfo.evalStatus;
          this.localLineNum.materLineNum = this.localLineNum.materLineNum + 1;
          e.localLineNum = this.localLineNum.materLineNum;
        });
      };
      // 考察小组
      if (!this.inspectTeamDataSet) {
        this.inspectTeamDataSet = new DataSet(inspectTeamDS(this.evalHeaderId, this.localLineNum, "FILLED"));
      }
      this.inspectTeamDataSet.refresh();
      this.inspectTeamDataSet.events.afterQuery = (ds, datas) => {
        datas.forEach((e) => {
          e.evalStatus = headInfo.evalStatus;
          e.leaderFlagMeaning = e.leaderFlag ? this.$T("smbl.common.view.yes").$D("是") : this.$T("smbl.common.view.no").$D("否");
          e.leaderFlag = String(e.leaderFlag);// 如果是数字1、0，转为字符串；如果为null，展示空
          this.localLineNum.inspectTeamLineNum = this.localLineNum.inspectTeamLineNum + 1;
          e.localLineNum = this.localLineNum.inspectTeamLineNum;
        });
      };
      // 评分人汇总信息
      if (!this.scorePeopleDataSet) {
        this.scorePeopleDataSet = new DataSet(scorePeopleDataSet(this.evalHeaderId));
      }
      this.scorePeopleDataSet.refresh();
      // 评分信息
      if (!this.scoreInfoDataSet) {
        this.scoreInfoDataSet = new DataSet(scoreInfoDataSet(this.evalHeaderId, false, this.editable.scoreInfo));
        this.scoreInfoDataSet.queryParameter = {
          completeFlag: 0,
          customizeUnitCode: "SSLM_SITEINVESTIGATE_FILLING_DETAIL.SCOREINFO,SSLM_SITEINVESTIGATE_FILLING_DETAIL.SCORE_FILTER"
        };
        this.scoreInfoDataSet.transport.read = {
          url: `/sslm/v1/${SrmUtil.getTenantId()}/site-eval-lines/${this.evalHeaderId}/evaluating`,
          method: "get",
        };
      }
      this.scoreInfoDataSet.refresh();
      // 附件
      if (!this.attachmentDataSet) {
        this.attachmentDataSet = new DataSet(attachmentDS(this.evalHeaderId));
      }
      this.attachmentDataSet.refresh();
    },
    async queryCustomize() {
      // 判断个性化是否配置为显示
      const customizeRes = await queryCustomize({ unitCode:"SMBL.SITE_INVESTIGATE_REPORT.FILL.SCORE_PEOPLE_INFO" });
      const { fields = [] } = customizeRes["SMBL.SITE_INVESTIGATE_REPORT.FILL.SCORE_PEOPLE_INFO"] || {};
      const siteLocationVisible = (fields.find((field) => field.fieldCode === "siteLocation") || {}).visible;
      this.siteLocationVisible = siteLocationVisible;
    },
    showBasicInfoDetail() {
      // this.basicInfoDetailFlag = true;
      this.$popup({
        title: this.$T("sslm.siteInvestigateReport.view.tabs.basicInfo").$D("基本信息"),
        showHeader: true,
        showClose: true,
        showBack: false,
        height: "100vh",
        position: "bottom",
        content:<div>
          {this.basicDataSet && <srm-form customize-type="detail" data-set={this.basicDataSet} columns={this.getBasicInfoDetailColumns} customize-code="SMBL.SITE_INVESTIGATE_REPORT.FILLE.BASIC_INFO.DETAIL"/>}
        </div>
      });
    },
    // 物料/品类
    reviewMaterialSaveAction() {
      this.setFirstReponse(this.reviewMaterDataSet, false);
      if (this.reviewMaterDataSet.validate()) {
        this.$loading.show();
        this.reviewMaterDataSet.submitRecords(this.reviewMaterDataSet.records);
        this.$loading.hide();
      }
    },
    reviewMaterialEditAction() {
      this.setFirstReponse(this.reviewMaterDataSet, !this.reviewMaterDataSet.editFlag);
    },
    reviewMaterialCreatAction() {
      this.localLineNum.materLineNum = this.localLineNum.materLineNum + 1;
      this.reviewMaterDataSet.create({ localLineNum: this.localLineNum.materLineNum }, 0);
    },
    reviewMaterialCancelAction() {
      this.setFirstReponse(this.reviewMaterDataSet, false);
    },
    // 考察小组
    inspectTeamSaveAction() {
      this.setFirstReponse(this.inspectTeamDataSet, false);
      if (this.inspectTeamDataSet.validate()) {
        this.$loading.show();
        this.inspectTeamDataSet.submitRecords(this.inspectTeamDataSet.records);
        this.$loading.hide();
      }
    },
    inspectTeamEditAction() {
      this.setFirstReponse(this.inspectTeamDataSet, !this.inspectTeamDataSet.editFlag);
    },
    inspectTeamCreatAction() {
      this.localLineNum.inspectTeamLineNum = this.localLineNum.inspectTeamLineNum + 1;
      this.inspectTeamDataSet.create({ localLineNum: this.localLineNum.inspectTeamLineNum }, 0);
    },
    inspectTeamCancelAction() {
      this.setFirstReponse(this.inspectTeamDataSet, false);
    },
    // 评分人维护
    scorerEditAction() {
      this.setFirstReponse(this.scoreInfoDataSet, true);
    },
    scorerEditCancelAction() {
      this.setFirstReponse(this.scoreInfoDataSet, false);
    },
    getNoChildScoreInfoIds(scoreInfo) {
      let ids = [];
      if (scoreInfo.children && scoreInfo.children.length) {
        scoreInfo.children.forEach((element) => {
          let subIds = this.getNoChildScoreInfoIds(element);
          ids.push(...subIds);
        });
      } else {
        ids.push(scoreInfo.evalLineId);
      }
      return ids;
    },
    scorerInfoItemEdit(item) {
      this.scorerInfoIds = [ item.evalLineId ];
      this.targetLineId = item.evalLineId;
      this.scorerEditPopFlag = true;
    },
    maintainChildrenAction(item) {
      this.$router.push({
        path: "/SiteInvestiogationScoreInfoChildren",
        query: {
          indicatorCode: item.indicatorCode,
          evalHeaderId: this.evalHeaderId,
          subIndicatorCode: item.indicatorCode,
          canAttEdit: "true",
          evalStatus: this.basicInfo.evalStatus,
        },
      });
    },
    // 附件
    attachmentEditAction() {
      this.setFirstReponse(this.attachmentDataSet, true);
    },
    attachmentCreatAction() {
      this.$attachment({
        attachments: [ { directory: "sslm-report", readonly:true } ],
        //监听文件变化
        onFileListChange: () => {
        },
        onFileUpload: (e) => {
          this.attachmentDataSet.create({
            localEditable: true,
            attachmentDesc: e.fileName + "." + e.extension,
            attachmentSize: e.fileSize,
            attachmentUrl: e.fileUrl,
            uploadDate: e.creationDate,
            uploadUserId: SrmUtil.getUserInfo().id,
            uploadUserName: SrmUtil.getUserInfo().realName,
            evalHeaderId: this.evalHeaderId,
            createdBy: SrmUtil.getUserInfo().id,
            lnEvalStatusMeaning: this.basicInfo.evalStatusMeaning,
            lnEvalStatus: this.basicInfo.evalStatus,
            insideFlag: "0",
            insideFlagMeaning: this.$T("smbl.common.view.no").$D("否"),
          }, 0);
        }
      });

    },
    attachmentCancelAction() {
      this.setFirstReponse(this.attachmentDataSet, false);
    },
    async saveAttachmentAction(item) {
      this.$loading.show();
      let res = await saveAttachmentApi([ item ]);
      if (!res.failed) {
        let newItem = res[0];
        // eslint-disable-next-line no-unused-vars
        for (let key in newItem) {
          item[key] = newItem[key];
        }
        if (newItem.insideFlag === 0 || newItem.insideFlag === 1 || newItem.insideFlag === "0" || newItem.insideFlag === "1") {
          item.insideFlag = String(newItem.insideFlag);
        } else {
          item.insideFlag = null;
        }
      }
      this.$loading.hide();
    },
    setFirstReponse(dataSet, editFlag) {
      this.reviewMaterDataSet.editFlag = this.reviewMaterDataSet === dataSet && editFlag;
      this.inspectTeamDataSet.editFlag = this.inspectTeamDataSet === dataSet && editFlag;
      this.scoreInfoDataSet.editFlag = this.scoreInfoDataSet === dataSet && editFlag;
      this.attachmentDataSet.editFlag = this.attachmentDataSet === dataSet && editFlag;
    }
  },
  render() {
    return <div>
      <div class="site-investigation-report-detail-maintain">
        <nav-head title={this.navTitle}/>
        <srm-scroll-tab>
          <srm-scroll-tab-item label={this.$T("sslm.siteInvestigateReport.view.tabs.basicInfo").$D("基本信息")}>
            <div>
              { this.basicDataSet && <srm-form customize-type="list" data-set={this.basicDataSet} columns={this.getBasicInfoColumns} customize-code="SMBL.SITE_INVESTIGATE_REPORT.FILL.BASIC_INFO"/>}
            </div>
            <srm-flex justify="end" align="center" class="basic-more-button">
              <srm-button fill onClick={() => this.showBasicInfoDetail()}> { this.$T("sslm.siteInvestigateReport.view.buttom.moreDetail").$D("更多详情") }</srm-button>
            </srm-flex>
          </srm-scroll-tab-item>
          <srm-scroll-tab-item label={this.$T("sslm.siteInvestigateReport.view.tabs.reviewMaterialCategory").$D("考察物料/品类")} style="position: relative;">
            { this.reviewMaterDataSet && !this.reviewMaterDataSet.editFlag && this.editable.matercategory &&
              <srm-flex justify="end" class="review-material-buttons">
                <srm-button class="button" style="font-size: 16px;" plain onClick={() => this.reviewMaterialSaveAction()}>{ this.$T("smbl.common.button.save").$D("保存") }</srm-button>
                <div class="button srm-icon icon-edit" onClick={() => this.reviewMaterialEditAction()}/>
                <div class="button srm-icon icon-plus" onClick={() => this.reviewMaterialCreatAction()}/>
              </srm-flex>}
            {
              this.reviewMaterDataSet && this.reviewMaterDataSet.editFlag && this.editable.matercategory && <srm-flex justify="end" class="review-material-buttons">
                <srm-button class="button" style="font-size: 16px;" plain onClick={() => this.reviewMaterialCancelAction()}>{ this.$T("smbl.common.view.button.cancel").$D("取消") }</srm-button>
              </srm-flex>
            }
            { this.reviewMaterDataSet && <srm-list data-set={this.reviewMaterDataSet} scrollable={false} columns={this.getMatersColumns} show-bottom-bar={false} customize-code="SMBL.SITE_INVESTIGATE_REPORT.FILL.INVESTIGATE_MATERIAL"/>}
          </srm-scroll-tab-item>
          <srm-scroll-tab-item label={this.$T("sslm.siteInvestigateReport.view.tabs.inspectTeam").$D("考察小组")} style="position: relative;">
            { this.inspectTeamDataSet && !this.inspectTeamDataSet.editFlag && this.editable.inspectTeam &&
              <srm-flex justify="end" class="review-material-buttons">
                <srm-button class="button" style="font-size: 16px;" plain onClick={() => this.inspectTeamSaveAction()}>{ this.$T("smbl.common.button.save").$D("保存") }</srm-button>
                <div class="button srm-icon icon-edit" onClick={() => this.inspectTeamEditAction()}/>
                <div class="button srm-icon icon-plus" onClick={() => this.inspectTeamCreatAction()}/>
              </srm-flex>
            }
            { this.inspectTeamDataSet && this.inspectTeamDataSet.editFlag && this.editable.inspectTeam &&
              <srm-flex justify="end" class="review-material-buttons">
                <srm-button class="button" style="font-size: 16px;" plain onClick={() => this.inspectTeamCancelAction()}>{ this.$T("smbl.common.view.button.cancel").$D("取消") }</srm-button>
              </srm-flex>
            }
            { this.inspectTeamDataSet && <srm-list data-set={this.inspectTeamDataSet} scrollable={false} columns={this.getInspectTeamColumns} show-bottom-bar={false} customize-code="SMBL.SITE_INVESTIGATE_REPORT.FILL.INSPECT_TEAM"/>}
          </srm-scroll-tab-item>
          <srm-scroll-tab-item label={this.$T("sslm.siteInvestigateReport.view.tabs.attachmentInfo").$D("附件信息")} style="position: relative;">
            { this.attachmentDataSet && !this.attachmentDataSet.editFlag && this.editable.attachment &&
              <srm-flex justify="end" class="review-material-buttons">
                <div class="button srm-icon icon-plus" onClick={() => this.attachmentCreatAction()}/>
              </srm-flex>
            }
            { this.attachmentDataSet && this.attachmentDataSet.editFlag && this.editable.attachment &&
              <srm-flex justify="end" class="review-material-buttons">
                <srm-button class="button" style="font-size: 16px;" plain onClick={() => this.attachmentCancelAction()}>{ this.$T("smbl.common.view.button.cancel").$D("取消") }</srm-button>
              </srm-flex>
            }
            { this.attachmentDataSet && <srm-list data-set={this.attachmentDataSet} scrollable={false} columns={this.getAttachmentColumns} show-bottom-bar={false} customize-code="SMBL.SITE_INVESTIGATE_REPORT.FILL.ATTACHMENT" /> }
          </srm-scroll-tab-item>
          <srm-scroll-tab-item label={this.$T("sslm.siteInvestigateReport.view.title.scorerInfo").$D("评分人汇总信息")} style="position: relative;">
            {this.scorePeopleDataSet && <srm-list data-set={this.scorePeopleDataSet} scrollable={false} columns={this.getscorePeopleColumns} show-bottom-bar={false} customize-code="SMBL.SITE_INVESTIGATE_REPORT.FILL.SCORE_PEOPLE_INFO"/>}
          </srm-scroll-tab-item>
          <srm-scroll-tab-item label={this.$T("sslm.siteInvestigateReport.view.title.scoreInfo").$D("评分信息")} style="position: relative;">
            { this.scoreInfoDataSet && <srm-list data-set={this.scoreInfoDataSet} scrollable={false} columns={this.getScoreInfoColumns} show-bottom-bar={false} customize-code="SMBL.SITE_INVESTIGATE_REPORT.FILL.SCORE_INFO"/>}
          </srm-scroll-tab-item>
          <div class="bottom-space-view" />
        </srm-scroll-tab>
        {[ "MANUAL_EVALUATING" ].includes(this.basicInfo.evalStatus) && <srm-bottom-handler btn-arr={this.bottomButtons}/>}
        {
          // 基本信息-详情弹框
          // <srm-popup visible={this.basicInfoDetailFlag} height="100%" title={this.$T("sslm.siteInvestigateReport.view.tabs.basicInfo").$D("基本信息")}>
          //   {this.basicDataSet && <srm-form customize-type="detail" data-set={this.basicDataSet} columns={this.getBasicInfoDetailColumns} customize-code="SMBL.SITE_INVESTIGATE_REPORT.FILLE.BASIC_INFO.DETAIL"/>}
          // </srm-popup>
        }
        {this.reviewMaterDataSet && <srm-list-bottom-bar style="height: 72px" data-set={this.reviewMaterDataSet} buttons={this.reviewMaterButtons}/>}
        {this.inspectTeamDataSet && <srm-list-bottom-bar style="height: 72px" data-set={this.inspectTeamDataSet} buttons={this.inspectTeamButtons}/>}
        {this.scoreInfoDataSet && <srm-list-bottom-bar style="height: 72px" data-set={this.scoreInfoDataSet} buttons={this.scorerButtons}/>}
        {this.attachmentDataSet && <srm-list-bottom-bar style="height: 72px" data-set={this.attachmentDataSet} buttons={this.attachmentButtons}/>}
        {
          // 评分人
        }
        <scorer-maintain-view v-model={this.scorerEditPopFlag} info-ids={this.scorerInfoIds} eval-header-id={this.evalHeaderId} target-line-id={this.targetLineId}/>
        {
          // 评分附件上传
        }
        <scorer-attchment-view v-model={this.scoreAttEditFlag} eval-line-id={this.selectedEvalLineId} eval-header-id={this.evalHeaderId}/>
      </div>
    </div>;
  }
};
</script>

<style lang="stylus" scoped>
.site-investigation-report-detail-maintain {
  width: 100vw;
  height: 100vh;
}

.bottom-button-space {
    width: 100%;
    padding-bottom: calc(72px + constant(safe-area-inset-bottom));
    padding-bottom: calc(72px + env(safe-area-inset-bottom));
  }
.customize-card {
  padding-top: 6px;
  padding-bottom: 6px;
  background-color: var(--background-color-empty);
}
.basic-more-button {
  border-top: 1px solid var(--split-line-color-primary);
  width: 100%;
  height: 44px;
  padding-right: 15px;
}
.review-material-buttons {
  position: absolute;
  height: 54px;
  top: 0px;
  right: 15px;
  z-index: 1;
  .button {
    font-size: 20px;
    color: var(--font-color-disable);
    margin-left: 12px;
    >>> .srm-button-primary {
      color: var(--font-color-disable);
    }
  }
}

.bottom-space-view {
  height: 110px;
  height: calc(110px + constant(safe-area-inset-bottom));
  height: calc(110px + env(safe-area-inset-bottom));
}

.att-button {
  margin-left: 8px;
}
</style>
