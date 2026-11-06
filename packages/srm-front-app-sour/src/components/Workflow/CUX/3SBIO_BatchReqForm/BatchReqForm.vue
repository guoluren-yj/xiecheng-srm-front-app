<template>
  <srm-scroll-tab>
    <!-- 基础信息 -->
    <srm-scroll-tab-item :label="$T('scux.smdm.model.materielApplication.bulkOrderConsolidation.baseInfo').$D('基础信息')"
                         code="baseInfoTab">
      <srm-list :data-set="headerDs" :columns="getColumns('base')" />
    </srm-scroll-tab-item>
    <!-- 物料申请单 -->
    <srm-scroll-tab-item
      :label="$T('scux.smdm.model.materielApplication.bulkOrderConsolidation.materialInfo').$D('物料申请单')"
      code="materialInfoTab">
      <srm-list :data-set="listDs" :scrollable="false" :columns="getColumns('line')" />
    </srm-scroll-tab-item>
  </srm-scroll-tab>
</template>

<script>
import { DataSet, SrmListHeader, SrmButton } from "srm-mobile-ui";

import MaterielApplicationApproval from "@/components/Workflow/MaterielApplicationApprovalForm/MaterielApplicationApproval";

import { headerDS, lineDS, popupCategoryDS } from "./store/ds";
import { getBasicInfoApi } from "./api";

export default {
  modules: [ "scux.smdm", "smdm.materielApplication", "smdm.materialApplication", "smdm.materiel", "hzero.common", "smbl.common", "sslm.common", "sprm.common" ],
  name: "BatchReqForm",
  props: {
    changeReqId: {
      type: String | Number,
      default: "",
    },
  },
  data() {
    return {
      plNum: this.changeReqId, // 单据头id
      headerDs: new DataSet(headerDS()),
      listDs: new DataSet(lineDS()),
    };
  },
  mounted() {
    this.fetchHeaderData();
    this.listDs.addQueryParameter("plNum", this.plNum);
    this.listDs.refresh();
  },
  methods: {
    // 查询头数据
    fetchHeaderData() {
      getBasicInfoApi({
        plNum: this.plNum,
        page: 0,
        size: 10,
        customizeUnitCode:
          "SMDM_MATERIELAPPLICATION_LIST.MATERIEL_LIST",
      }).then((res) => {
        if (res && !res.failed) {
          this.headerDs.setData([ res.headerInfo ]);
        }
        console.log(this.headerDs.toData(), "11212");
      });
    },
    // 打开所属品类弹框
    handleOpenCategoryModal(record) {
      const categoryDs = new DataSet(popupCategoryDS());
      const { itemCategoryAssignReqList } = record || {};
      if (itemCategoryAssignReqList && itemCategoryAssignReqList.length) {
        categoryDs.setData(itemCategoryAssignReqList);
      } else {
        categoryDs.setData([]);
      }
      this.$popup({
        title: this.$T("scux.smdm.model.materielApplication.bulkOrderConsolidation.categoryToWhich").$D("所属品类"),
        showHeader: true,
        showBack: true,
        content: <srmList dataSet={categoryDs} scrollable={false} columns={this.getColumns("popupCategory")} />,
      });
    },
    // 关闭所属品类弹框
    handleCloseCategoryModal() {
      this.categoryDs.setData([]);
    },
    // 打开详情弹框
    handleGoDetail(itemReqHeaderId) {
      this.$popup({
        title: this.$T("scux.smdm.model.materielApplication.bulkOrderConsolidation.materialDetail").$D("物料详情明细"),
        showHeader: true,
        showBack: true,
        content: <MaterielApplicationApproval parameters={{ itemReqHeaderId }} />,
      });
    },
    // 基础信息列
    getColumns(type) {
      switch (type) {
      case "base":
        return [
          {
            fieldType: "EMPTY",
            fieldCode: "plNum",
            render: () => "",
          },
          {
            fieldCode: "plNum",
            fieldName: this.$T("scux.smdm.model.materielApplication.bulkOrderConsolidation.bulkOrderNumber")
              .$D("批量申请单号"),
            fieldType: "TEXT",
          },
          {
            fieldCode: "creator",
            fieldName: this
              .$T("scux.smdm.model.materielApplication.bulkOrderConsolidation.createdByName")
              .$D("创建人"),
            fieldType: "TEXT",
          },
          {
            fieldCode: "creatorCompany",
            fieldName: this
              .$T("scux.smdm.model.materielApplication.bulkOrderConsolidation.createdByCompany")
              .$D("创建人所属公司"),
            fieldType: "TEXT",
          },
          {
            fieldCode: "apartment",
            fieldName: this
              .$T("scux.smdm.model.materielApplication.bulkOrderConsolidation.userDepartment")
              .$D("使用部门"),
            fieldType: "TEXT",
          },
          {
            fieldCode: "createTime",
            fieldName: this
              .$T("scux.smdm.model.materielApplication.bulkOrderConsolidation.creationTime")
              .$D("创建时间"),
            fieldType: "TEXT",
          },
        ];
      case "line":
        return [
          {
            fieldType: "EMPTY",
            fieldCode: "itemName",
            formRow: 10,
            formCol: 10,
            render: (val) =>
              <SrmListHeader>
                <span>{val}</span>
              </SrmListHeader>
            ,
          },
          {
            fieldName: this.$T("smdm.materielApplication.model.materiel.itemReqHeaderNum").$D("物料申请单号"),
            fieldCode: "itemReqHeaderNum",
            fieldType: "TEXT",
            render: (text, record) =>
              <SrmButton plain rect onClick={() => this.handleGoDetail(record.itemReqHeaderId)}>
                {text}
              </SrmButton>
            ,
          },
          {
            fieldName: this.$T("scux.smdm.model.materielApplication.bulkOrderConsolidation.primaryUomName").$D("采购单位"),
            fieldCode: "uomName",
            fieldType: "TEXT",
          },
          {
            fieldName: this.$T("scux.smdm.model.materielApplication.bulkOrderConsolidation.specifications").$D("包装规格"),
            fieldCode: "specifications",
            fieldType: "TEXT",
          },
          {
            fieldName: this.$T("smdm.materielApplication.model.materiel.model").$D("型号"),
            fieldCode: "model",
            fieldType: "TEXT",
          },
          {
            fieldName: this.$T("scux.smdm.model.materielApplication.bulkOrderConsolidation.brand").$D("品牌"),
            fieldCode: "brand",
            fieldType: "TEXT",
          },
          {
            fieldName: this.$T("scux.smdm.model.materielApplication.bulkOrderConsolidation.category").$D("所属品类"),
            fieldCode: "category",
            fieldType: "TEXT",
            render: (_, record) =>
              <SrmButton size="small" onClick={() => this.handleOpenCategoryModal(record)}>
                {this.$T("hzero.common.button.view").$D("查看")}
              </SrmButton>
            ,
          },
          {
            fieldName: this.$T("scux.smdm.model.materielApplication.bulkOrderConsolidation.clothCover").$D("帐套"),
            fieldType: "TEXT",
            fieldCode: "attributeVarchar20Meaning",
          },
          {
            fieldName: this.$T("scux.smdm.model.materielApplication.bulkOrderConsolidation.ArtNo").$D("货号"),
            fieldCode: "attributeVarchar5",
            fieldType: "TEXT",
          },
        ];
      case "popupCategory":
        return [
          {
            fieldType: "EMPTY",
            fieldCode: "categoryId",
            render: () => "",
          },
          {
            fieldCode: "categoryCode",
            fieldName: this.$T("smdm.materiel.model.materiel.categoryCode").$D("品类代码"),
          },
          {
            fieldCode: "categoryName",
            fieldName: this.$T("smdm.materiel.model.materiel.categoryName").$D("品类名称"),
          },
        ];
      default:
        return [];
      }
    },
  }
};
</script>

<style lang="stylus" scoped>
</style>