/*
 * @Date: 2024-08-12 16:01:19
 * @Author: LXM <xiaomei.lv@going-link.com>
 * @Version: 0.0.1
 * @Copyright: Copyright (c) 2021, Hand
 */
import { $T, DataSet, SrmUtil } from "srm-mobile-ui";
import { getBasicDs } from "../datasource/getBasicDS";
import { getAttachmentDs } from "../datasource/getAttachmentDS";
import { getScoreResultDs } from "../datasource/getScoreResultDS";
import { getScoreDetailDS, scoreDetailColumns } from "../datasource/getScoreDetailDS";
import { getScoreInfoDs } from "../datasource/getScoreInfoDs.js";
import { getScoreStatusDs, scoreStatusColumns, getSystemStatusDs, systemStatusColumns } from "../datasource/getScoreStatusDS";
import { getRelegationDs, getRelegationColumns, getRectificationDs, getRectificationColumns } from "../datasource/getExecutionDocumentDS";

export default {
  props:{
    parameters:{
      type:Object,
    }
  },
  data() {
    const { evalHeaderId, submitUserId, evalGranularity } = this.parameters;
    return {
      evalHeaderId,
      submitUserId,
      evalGranularity,
      basicDs: new DataSet(getBasicDs({ evalHeaderId })),
      attachmentDs: new DataSet(getAttachmentDs({ evalHeaderId })),
      scoreResultDs: new DataSet(getScoreResultDs({ evalHeaderId })),
      relegationDs: new DataSet(getRelegationDs()),
      rectificationDs: new DataSet(getRectificationDs()),
      scoreDetailDs: new DataSet(getScoreDetailDS()),
      scoreStatusDs: new DataSet(getScoreStatusDs()),
      systemStatusDs: new DataSet(getSystemStatusDs()),
      scoreInfoDs: new DataSet(getScoreInfoDs({ evalHeaderId })),
    };
  },
  methods:{
    // 查看执行单据
    handleExecutionDocument(data) {
      const { evalLineId, supplierId } = data;
      this.relegationDs.addPathParameter("evalLineId", evalLineId);
      this.relegationDs.refresh();
      this.rectificationDs.addPathParameter("evalHeaderId", this.evalHeaderId);
      this.rectificationDs.addPathParameter("supplierId", supplierId);
      this.rectificationDs.refresh();
      this.$popup({
        title: $T("sslm.common.model.field.executionDocument").$D("执行单据"),
        showHeader: true,
        showClose: false,
        position: "right",
        headerAlign: "center",
        showBack: true,
        content:
        <div class="execution-document">
          <div class="execution-document-title">{$T("sslm.common.view.title.supplierRelegationDocs").$D("供应商升降级单据")}</div>
          <srmList scrollable={false} dataSet={this.relegationDs} columns={getRelegationColumns()}/>
          <div class="execution-document-title">{$T("sslm.common.view.title.qualityRectification").$D("质量整改")}</div>
          <srmList scrollable={false} dataSet={this.rectificationDs} columns={getRectificationColumns(this)}/>
        </div>
        ,
      });
    },
    //查看评分详情
    async handleScoreDetail(data) {
      const { evalLineId } = data;
      const evalRespRule = this.basicDs.current.get("evalRespRule");
      this.scoreDetailDs.addPathParameter("evalLineId", evalLineId);
      this.scoreDetailDs.addPathParameter("evalRespRule", evalRespRule);
      await this.scoreDetailDs.refresh();
      // 判断指标是否有系统计算指标
      const systemDataFlag = this.scoreDetailDs.records.some((record) => record.get("scoreType") === "SYSTEM");
      this.$popup({
        title: $T("sslm.supplierDocManage.model.evalDocManage.scoreDetail").$D("评分明细"),
        showHeader: true,
        showClose: false,
        position: "right",
        headerAlign: "center",
        showBack: true,
        content:
        <SrmList scrollable={false} dataSet={this.scoreDetailDs} columns={scoreDetailColumns(this, "parent", systemDataFlag)}/>
        ,
      });
    },
    // 查看下级指标
    handleChildIndicators(data) {
      const dataSource = data.children;
      // 判断指标是否有系统计算指标
      const systemDataFlag = dataSource.some((item) => item.scoreType === "SYSTEM");
      this.$popup({
        title: $T("sslm.common.model.field.childIndicators").$D("下级指标"),
        showHeader: true,
        showClose: false,
        position: "right",
        headerAlign: "center",
        showBack: true,
        content:
        dataSource.map((n) =>
          <div>
            <Customize
              needPadding
              dataSource={n}
              columns={scoreDetailColumns(this, "child", systemDataFlag)}/>
            <div style={{ height:"2px", background:"#f6f6f6" }}/>
          </div>
        )
        ,
      });
    },
    // 查看得分状态
    hanldeScoreStatus(data) {
      const { evalDtlId, scoreType } = data;
      const isSystem = scoreType === "SYSTEM";
      const statusDs = isSystem ? this.systemStatusDs : this.scoreStatusDs;
      const statusColumns = isSystem ? systemStatusColumns : scoreStatusColumns;
      statusDs.addPathParameter("evalDtlId", evalDtlId);
      statusDs.refresh();
      this.$popup({
        title: $T("sslm.supplierDocManage.model.docManage.evaluationStatusTitle")
          .$D("评分完成情况"),
        showHeader: true,
        showClose: false,
        position: "right",
        headerAlign: "center",
        showBack: true,
        content:<srmList scrollable={false} dataSet={statusDs} columns={statusColumns}/>
        ,
      });
    },
    // 系统计算-参数值查询
    handleParamQuery(data) {
      const { evalDtlId } = data;
      this.systemStatusDs.addPathParameter("evalDtlId", evalDtlId);
      this.systemStatusDs.refresh();
      this.$popup({
        title: $T("sslm.common.view.title.paramQuery").$D("参数值查询"),
        showHeader: true,
        showClose: false,
        position: "right",
        headerAlign: "center",
        showBack: true,
        content:<srmList scrollable={false} dataSet={this.systemStatusDs} columns={systemStatusColumns}/>
        ,
      });
    },
    // 质量整改跳转
    async toReformDetail(data) {
      let toUrl;
      // 环境域名
      const environmentUrl = window.location.origin;
      const { problemHeaderId } = data;
      // 构造跳转地址
      const detailUrl = `/appCpra/#/QIReportInitiatedDetail?problemHeaderId=${problemHeaderId}`;
      toUrl = `${environmentUrl}/WxCover/?navigateTo=${encodeURIComponent(detailUrl)}&access_token=${SrmUtil.getUserToken()}`;
      if (toUrl) {
        this.detailPopup = this.$popup({
          title: this.$T("smbl.common.view.detail").$D("详情"),
          showHeader: true,
          showBack: true,
          content:<iframe style="height:100%;width:100%" ref="relate_data" src={toUrl}/>
        });
      }
    },
  }
};