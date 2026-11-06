import { DataSet, SrmUtil } from "srm-mobile-ui";
import uuid from "uuid";
import attachmentDS from "../datasource/attachmentDS";
import manageDS from "../datasource/manageDS";

export default {
  data() {
    return {
      attachmentDataSet: new DataSet(attachmentDS()),
      headerDataSet: new DataSet(manageDS()),
      abandonFlag: false,
      kpiMethod: {},
      indicatorType: {},
    };
  },
  beforeMount() {
    const { evalHeaderId } = this.$route.query;
    this.evalHeaderId = evalHeaderId;
    this.lineDataSet.addPathParameter("evalHeaderId", this.evalHeaderId);
    this.lineDataSet.addPathParameter("tenantId", SrmUtil.getTenantId());
    this.lineDataSet.addQueryFieldParameter("supplierId", "evalHeaderId", this.evalHeaderId);
    SrmUtil.getValueSetBatch({ kpiMethod: "SSLM.KPI_EVAL_METHOD", indicatorType: "SSLM.KPI_INDICATOR_TYPE" }, this);
  },
  methods: {
    lineDataSetBeforeUpdate(ds, data) {
      const headerData = this.headerDataSet.current.data;
      headerData.kpiEvalDetailLineDTOPage.content = data;
      return headerData;
    },
    lineDataSetBeforeSubmit(ds, data) {
      const headerData = this.headerDataSet.current.data;
      headerData.kpiEvalDetailLineDTOPage.content = data;
      return headerData;
    },
    lineDataSetAfterQuery(ds, data) {
      this.headerDataSet.setData(data || []);
      this.headerDataSet.locate(0);
      this.abandonFlag = this.headerDataSet.current.get("abandonFlag");
      this.lineDataSet.editFlag = true;
      this.$nextTick(() => {
        // 修正是否有下一页
        // 获取当前ds加载数据页码
        const currentPage = ds.currentPage || 0;
        // 获取总页码
        const totalPages = data[0] && data[0].kpiEvalDetailLineDTOPage ? data[0].kpiEvalDetailLineDTOPage.totalPages : 0;
        // 是否分页标识
        const ispaging = currentPage < totalPages - 1;
        // 设置分页参数
        this.lineDataSet.paging = ispaging;
        this.lineDataSet.hasMore = ispaging;
        // 构造ds返回数据
        this.lineDataSet.records.forEach((record) => {
          const evalTplIndOptId = record.getField("evalTplIndOptId");
          evalTplIndOptId.addLovParam("evalTplIndId", record.get("evalTplIndId"));
          const scorerAttachmentUuid = record.get("scorerAttachmentUuid");
          if (!scorerAttachmentUuid) {
            record.setField("scorerAttachmentUuid", uuid());
          }
        });
      });
      return data[0] && data[0].kpiEvalDetailLineDTOPage && data[0].kpiEvalDetailLineDTOPage.content || [];
    },
    openHeaderAttachment(readonly = false) {
      const evalHeaderId = this.headerDataSet.current.get("evalHeaderId");
      const userInfo = SrmUtil.getUserInfo();
      const userId = userInfo.id;
      const username = userInfo.realName;
      const columns = [
        { fieldCode: "attachmentName", fieldType: "EMPTY", render: (val) => <SrmListHeader>{val}</SrmListHeader> },
        { fieldCode: "uploadUserName", },
        { fieldCode: "uploadTime", },
        { fieldCode: "remark", },
      ];
      const buttons = [
        "delete",
        {
          text: this.$T("smbl.common.button.save").$D("保存"),
          visible: true,
          callback: () => {
            this.attachmentDataSet.update();
          },
        },
        {
          text: this.$T("smbl.common.button.create").$D("创建"),
          fill: true,
          visible: true,
          callback: () => {
            this.$attachment({
              attachments: [ { directory: "sslm-supplyAbility", readonly: true, } ],
              onFileUpload: (file) => this.attachmentDataSet.create({
                attachmentName: `${file.fileName}.${file.extension}`,
                attachmentUrl: file.fileUrl,
                evalHeaderId: evalHeaderId,
                uploadUserId: userId,
                uploadUserName: username,
              }, 0),
            });
          },
        },
      ];
      this.attachmentDataSet.addQueryParameter("evalHeaderId", evalHeaderId);
      this.attachmentDataSet.addQueryParameter("uploadUserId", userId);
      this.attachmentDataSet.editFlag = !readonly;
      this.$popup({
        title: this.$T("sslm.common.model.evaluation.appraisalAttachment").$D("考评附件"),
        height: "70%",
        rounded: true,
        showHeader: true,
        showClose: true,
        content: <SrmList
          dataSet={this.attachmentDataSet}
          columns={columns}
          buttons={buttons}
        />
      });
    },
  },
};
