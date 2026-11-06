<template>
  <div class="supplier-category-alter">
    <srm-scroll-tab>
      <srm-scroll-tab-item :label="$T('sslm.supplierCategoryAlter.view.title.dividerBasic').$D('基础信息')">
        <div class="customize-card">
          <customize :columns="getBaseInfoColumns"
                     :need-padding="true"
                     :data-source="baseInfo"
                     code="SMBL.WORKFLOW.SUPPLIER_CATEGORY_ALTER.HEAD"/>
        </div>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item :label="$T('sslm.supplierCategoryAlter.view.title.tabCurrentCtg').$D('当前供应商分类')">
        <srm-list v-if="supplierCategoryDataSet"
                  :scrollable="false"
                  :data-set="supplierCategoryDataSet"
                  customize-code="SMBL.WORKFLOW.SUPPLIER_CATEGORY_ALTER.ALTER_LINE"
                  :columns="getSupplierCategotyColumns"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item :label="$T('sslm.supplierCategoryAlter.view.title.tabAttachment').$D('附件')">
        <div class="customize-card">
          <customize :columns="getAttachmentColumns"
                     :need-padding="true"
                     :data-source="attachments" />
        </div>
      </srm-scroll-tab-item>
    </srm-scroll-tab>
  </div>
</template>

<script>
import { DataSet, SrmUtil } from "srm-mobile-ui";
import supplierCategoryDatasource from "./datasource/SupplierCategoryDatasource";
export default {
  modules: [ "sslm.supplierCategoryAlter", "smbl.common", "sslm.common" ],
  name: "SupplierCategoryAlterApproval",
  props: {
    parameters: {
      type: Object,
      default: null,
    }
  },
  data() {
    return {
      baseInfo: {},
      supplierCategoryDataSet: null,
      attachments: { list: [] },
    };
  },
  computed: {
    // 基础信息Columns
    getBaseInfoColumns() {
      return [ {
        fieldName: this.$T("sslm.supplierCategoryAlter.model.supply.categoryAlterNumbe").$D("申请单编号"),
        fieldType: "TEXT",
        fieldCode: "categoryAlterNumber",
        formRow: 10,
      }, {
        fieldName: this.$T("sslm.supplierCategoryAlter.model.supplierCategoryAlter.realName").$D("创建人"),
        fieldType: "TEXT",
        fieldCode: "realName",
        formRow: 20,
      }, {
        fieldName: this.$T("sslm.supplierCategoryAlter.model.supplierCategoryAlter.creationDate").$D("创建时间"),
        fieldType: "TEXT",
        fieldCode: "creationDate",
        formRow: 30,
      }, {
        fieldName: this.$T("sslm.supplierCategoryAlter.model.supply.supplyCompanyName").$D("供应商名称"),
        fieldType: "TEXT",
        fieldCode: "supplierZhOrEnCompanyNum",
        formRow: 40,
      }, {
        fieldName: this.$T("sslm.supplierCategoryAlter.model.supplier.supplierCompanyNum").$D("供应商编码"),
        fieldType: "TEXT",
        fieldCode: "supplierCompanyNum",
        formRow: 50,
      }, {
        fieldName: this.$T("sslm.supplierCategoryAlter.model.supplierCategoryAlter.processStatus").$D("状态"),
        fieldType: "TEXT",
        fieldCode: "processStatusMeaning",
        formRow: 60,
      }, {
        fieldType: "EMPTY",
        fieldCode: "alterReason",
        formRow: 70,
        render: (val) => this.$T("sslm.supplierCategoryAlter.model.supplierCategoryAlter.alterReason").$D("变更理由") + "：" + (val || "-"),
      }, {
        fieldType: "EMPTY",
        fieldCode: "remark",
        formRow: 80,
        render: (val) => this.$T("sslm.supplierCategoryAlter.model.supplierCategoryAlter.remark").$D("备注") + "：" + (val || "-"),
      }, ];
    },
    // 供应商分类Columns
    getSupplierCategotyColumns() {
      return [ {
        fieldName: this.$T("sslm.supplierCategoryAlter.model.category.categoryCode").$D("供应商分类代码"),
        fieldType: "TEXT",
        fieldCode: "categoryCode",
        formRow: 10,
      }, {
        fieldName: this.$T("sslm.supplierCategoryAlter.model.category.categoryDescription").$D("供应商分类描述"),
        fieldType: "TEXT",
        fieldCode: "categoryDescription",
        formRow: 20,
      }, {
        fieldName: this.$T("sslm.supplierCategoryAlter.model.category.evaluationLevel").$D("评级"),
        fieldType: "TEXT",
        fieldCode: "evaluationLevel",
        formRow: 30,
        formCol: 10,
      }, {
        fieldName: this.$T("sslm.supplierCategoryAlter.model.category.evaluationScore").$D("评分"),
        fieldType: "TEXT",
        fieldCode: "evaluationScore",
        formRow: 30,
        formCol: 20,
      }, {
        fieldName: this.$T("sslm.supplierCategoryAlter.model.category.operationTypeLineMeaning").$D("操作类型"),
        fieldType: "TEXT",
        fieldCode: "operationTypeMeaning",
        formRow: 40,
        formCol: 10,
      }, {
        fieldName: this.$T("sslm.supplierCategoryAlter.model.category.enabledFlagMeaning").$D("状态"),
        fieldType: "TEXT",
        fieldCode: "enabledFlag",
        formRow: 40,
        formCol: 20,
        render: (val) => val ? this.$T("smbl.common.view.enable").$D("启用") : this.$T("smbl.common.view.disabled").$D("禁用"),
      }, {
        fieldName: this.$T("sslm.supplierCategoryAlter.model.category.alterReasonLine").$D("变更理由"),
        fieldType: "EMPTY",
        fieldCode: "alterReason",
        formRow: 50,
        formCol: 10,
        render: (val) => this.$T("sslm.supplierCategoryAlter.model.category.alterReasonLine").$D("变更理由") + "：" + (val || "-"),
      }, ];
    },
    // 附件Columns
    getAttachmentColumns() {
      return [ {
        fieldName: this.$T("smbl.common.view.attachment").$D("附件"),
        fieldType: "TEXT",
        fieldCode: "list",
        render: (val) => <srm-upload
          descTitle={this.$T("sslm.common.view.message.view").$D("查看")}
          type="primary"
          attachmentUuid={val}
          showCount={false}
          showIcon={false}/>,
      }, ];
    },
  },
  beforeMount() {
    this.supplierCategoryDataSet = new DataSet(supplierCategoryDatasource(this.parameters.categoryAlterId));
    this.supplierCategoryDataSet.refresh();

    this.supplierCategoryDataSet.events.afterQuery = (ds, dataList) => {
      // 请求原始数据结构
      // {
      //  categoryAlterAttachmentLine: [],   -- 附件列表
      //  supplierCategoryAlter: {...},   -- 基础信息
      //  supplierCategoryAlterLinePage: {content:[...],page: 0, ...}, -- 供应商分类（分页）
      //  supplierCategoryAlterLines: Any,   -- 未知信息
      // }
      let data = dataList.length && dataList[0];
      // 获取基础信息、附件
      // if (Object.keys(this.baseInfo).length === 0) {
      this.baseInfo = data.supplierCategoryAlter;
      data.categoryAlterAttachmentLine.map((item) => {
        item.creationDate = item.creationDate || item.lastUpdateDate || item.uploadDate;
        item.fileUrl = item.fileUrl || item.attachmentUrl;
        item.bucketName = item.bucketName || SrmUtil.getDefaultBucketName();
      });
      this.attachments.list = data.categoryAlterAttachmentLine;
      // }
      // 获取总数目
      ds.totalCount = data.supplierCategoryAlterLinePage.totalElements;
      // 获取供应商分类
      let supplierCategoryAlterLinePage = data.supplierCategoryAlterLinePage || {};
      let supplierCategoryContent = supplierCategoryAlterLinePage.content || [];
      supplierCategoryContent.forEach((e, index) => {
        if (index === 0) {
          dataList[index] = e;
        } else {
          dataList.push(e);
        }
      });
      // 修正是否有下一页
      this.$nextTick(() => {
        ds.paging = true;
        ds.hasMore = supplierCategoryAlterLinePage.number < supplierCategoryAlterLinePage.totalPages - 1;
      });
    };
  },
  methods: {
  }
};
</script>

<style lang="stylus" scoped>
.supplier-category-alter {
  width: 100%;

  .customize-card {
    padding: 6px 0px 6px 0px;
  }
}
</style>