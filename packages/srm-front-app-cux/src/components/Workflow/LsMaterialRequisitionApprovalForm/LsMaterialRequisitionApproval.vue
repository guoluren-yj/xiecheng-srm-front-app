<template>
  <!-- 物料申请单审批 - 二开（爱学习教育集团） -->
  <section>
    <srm-scroll-tab>
      <!-- 物料申请单头信息 -->
      <srm-scroll-tab-item :label="getLanguageDefine('headInfo')">
        <!-- :customize-code="getCodeDefine('headInfo')" -->
        <srm-list :scrollable="false"
                  height="auto"
                  style="height: auto"
                  :data-set="headInfoDataSet"
                  :columns="getColumns('headInfo')"
                  @itemClick="clickHeadInfo"/>
      </srm-scroll-tab-item>
      <!-- 行信息 -->
      <srm-scroll-tab-item :label="getLanguageDefine('lineInfo')"
                           :show-title="false">
        <!-- :customize-code="getCodeDefine('lineInfo')" -->
        <div class="srm-scroll-tab-item-title line-filter">
          <!-- 标题 -->
          {{ getLanguageDefine('lineInfo') }}
          <srm-button plain rect @click="save">
            {{ $T("hzero.common.save").$D("保存") }}
          </srm-button>
        </div>
        <srm-list :scrollable="false"
                  height="auto"
                  style="height: auto"
                  :data-set="lineInfoDataSet"
                  :columns="getColumns('lineInfo')"
                  @itemClick="clickLineInfo"/>
      </srm-scroll-tab-item>
    </srm-scroll-tab>

    <!-- 弹框 -->
    <srm-popup :visible.sync="visiblePopup"
               position="right"
               :show-header="false"
               height="100%">
      <!--  :customize-code="getCodeDefine(popupData.code)""  -->
      <srm-form
        v-if="visiblePopup"
        customize-type="detail"
        :data-set="popupData.data"
        :columns="getColumns(popupData.columns)"
        :buttons="popupData.columns === 'lineInfoDetail' ? getDetailButtons : []"/>
    </srm-popup>
  </section>
</template>

<script>
import { $T, DataSet } from "srm-mobile-ui";
import { getHeadApi } from "./api";
import { commonDs, lineInfoDs } from "./dataSource/indexDs";
export default {
  modules: [ "smdm.materielApplication", "scux.common", "hipspfm.common", "hzero.common", "smbl.common" ],
  name: "LsMaterialRequisitionApproval",
  props: {
    parameters: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      headInfoDataSet: new DataSet(commonDs()),
      lineInfoDataSet: new DataSet(commonDs()),
      visiblePopup: false,
      popupData: {},
    };
  },
  computed: {
    getColumns() {
      return (name) => {
        switch (name) {
        case "headInfo":
          return [
            {
              fieldType: "EMPTY",
              fieldCode: "head",
              render: (val, item) => {
                const reqStatus = item.reqStatus;
                const statusType = {
                  SUBMITED: "warn",
                };
                return <SrmListHeader>
                  <span>
                    {item.attributeVarchar3 || "-"}
                  </span>
                  <SrmButton slot="right" plain rect style={{ fontWeight: "bold" }} type={statusType[reqStatus]}>
                    {item.reqStatusMeaning}
                  </SrmButton>
                </SrmListHeader>;
              }
            },
            {
              fieldName: $T("smdm.materielApplication.model.materiel.createdName").$D("创建人"),
              fieldCode: "createdName",
            },
            {
              fieldName: $T("smdm.materielApplication.model.materiel.creationDate").$D("创建时间"),
              fieldCode: "creationDate",
            },
            {
              fieldName: $T("smdm.materielApplication.model.materiel.version").$D("版本"),
              fieldCode: "versionNumber",
            }
          ];
        case "lineInfo":
          return [
            {
              fieldType: "EMPTY",
              fieldCode: "line",
              render: (val, item) => <SrmListHeader>
                {$T("smdm.materielApplication.model.materiel.itemReqHeaderNum").$D("物料申请单号")}：{item.itemReqHeaderNum}
              </SrmListHeader>,
              formRow: 10,
            },
            {
              fieldName: $T("smdm.materielApplication.model.materiel.itemCode").$D("物料编码"),
              fieldCode: "itemCode",
              formRow: 20,
            },
            {
              fieldName: $T("smdm.materielApplication.model.materiel.itemName").$D("物料名称"),
              fieldCode: "itemName",
              formRow: 30,
            },
            {
              fieldName: $T("smdm.materielApplication.model.materiel.itemAllOrgFlag").$D("是否下发WMS"),
              fieldCode: "attributeVarchar13",
              editor: true,
              formRow: 40,
            },
            {
              fieldName: $T("smdm.materielApplication.model.materiel.bookNum").$D("书号"),
              fieldCode: "attributeVarchar2",
              formRow: 50,
            },
            {
              fieldName: $T("smdm.materielApplication.model.materiel.barCode").$D("条形码"),
              fieldCode: "attributeVarchar1",
              formRow: 50,
            },
            {
              fieldName: $T("smdm.materielApplication.model.materiel.brand").$D("品牌型号"),
              fieldCode: "specifications",
              formRow: 60,
            },
            {
              fieldName: $T("smdm.materielApplication.model.materiel.category").$D("物料分类"),
              fieldCode: "aiXueXiItemCategoryAssignReqList",
              render: (val) => <span>{val.reduce((sum, item) => {
                sum.push(item.categoryName);
                return sum;
              }, []).join("/")}</span>,
              formRow: 70,
            }
          ];
        case "headInfoDetail":
          return [
            {
              fieldName: $T("smdm.materielApplication.model.materiel.itemReqLotNum").$D("物料申请单批次号"),
              fieldCode: "attributeVarchar3",
            },
            {
              fieldName: $T("smdm.materielApplication.model.materiel.status").$D("状态"),
              fieldCode: "reqStatusMeaning",
            },
            {
              fieldName: $T("smdm.materielApplication.model.materiel.createdName").$D("创建人"),
              fieldCode: "createdName",
            },
            {
              fieldName: $T("smdm.materielApplication.model.materiel.creationDate").$D("创建时间"),
              fieldCode: "creationDate",
            },
            {
              fieldName: $T("smdm.materielApplication.model.materiel.version").$D("版本"),
              fieldCode: "versionNumber",
            }
          ];
        case "lineInfoDetail":
          return [
            {
              fieldName: $T("smdm.materielApplication.model.materiel.itemReqHeaderNum").$D("物料申请单号"),
              fieldCode: "itemReqHeaderNum",
              formRow: 10,
            },
            {
              fieldName: $T("smdm.materielApplication.model.materiel.itemCode").$D("物料编码"),
              fieldCode: "itemCode",
              formRow: 20,
            },
            {
              fieldName: $T("smdm.materielApplication.model.materiel.itemName").$D("物料名称"),
              fieldCode: "itemName",
              formRow: 30,
            },
            {
              fieldName: $T("smdm.materielApplication.model.materiel.itemAllOrgFlag").$D("是否下发WMS"),
              fieldCode: "attributeVarchar13",
              editor: true,
              formRow: 40,
            },
            {
              fieldName: $T("smdm.materielApplication.model.materiel.bookNum").$D("书号"),
              fieldCode: "attributeVarchar2",
              formRow: 50,
            },
            {
              fieldName: $T("smdm.materielApplication.model.materiel.barCode").$D("条形码"),
              fieldCode: "attributeVarchar1",
              formRow: 50,
            },
            {
              fieldName: $T("smdm.materielApplication.model.materiel.brand").$D("品牌型号"),
              fieldCode: "specifications",
              formRow: 60,
            },
            {
              fieldName: $T("smdm.materielApplication.model.materiel.category").$D("物料分类"),
              fieldCode: "aiXueXiItemCategoryAssignReqList",
              render: (val) => <span>{val.reduce((sum, item) => {
                sum.push(item.categoryName);
                return sum;
              }, []).join("/")}</span>,
              formRow: 70,
            }
          ];
        default:
        }
      };
    },
    getDetailButtons() {
      return [
        {
          text: $T("hzero.common.save").$D("保存"),
          type: "primary",
          fill: true,
          visible: true,
          handler: () => {
            this.lineInfoDataSet.updateRecords([ this.lineInfoDataSet.current ]).then(() => {
              this.$notification.open({ message: $T("smbl.common.message.acction.success").$D("操作成功") });
              this.visiblePopup = false;
            });
          },
        },
      ];
    },
  },
  mounted() {
    // 调用接口
    this.$loading.show();
    this.lineInfoDataSet = new DataSet(lineInfoDs(this.parameters.headerId, {
      customizeUnitCode: "SMDM_MATERIELAPPLICATION_EDIT.BASIC,SMDM_MATERIELAPPLICATION_EDIT.BASE,SMDM_MATERIELAPPLICATION_EDIT.ATTRIBUTE,SMDM_MATERIELAPPLICATION_ATTRIBUTETABL.TABLE,SMDM_MATERIELAPPLICATION_ORG.TABLE,SMDM_MATERIELAPPLICATION_COMPONENTTABLE.TABLE,SMDM_MATERIELAPPLICATION_CATEGORY.LIST"
    }));
    this.lineInfoDataSet.refresh();
    getHeadApi(this.parameters.headerId, {
      customizeUnitCode: "SMDM_MATERIELAPPLICATION_EDIT.BASIC,SMDM_MATERIELAPPLICATION_EDIT.BASE,SMDM_MATERIELAPPLICATION_EDIT.ATTRIBUTE,SMDM_MATERIELAPPLICATION_ATTRIBUTETABL.TABLE,SMDM_MATERIELAPPLICATION_ORG.TABLE,SMDM_MATERIELAPPLICATION_COMPONENTTABLE.TABLE,SMDM_MATERIELAPPLICATION_CATEGORY.LIST"
    }).then((res) => {
      this.headInfoDataSet.create(res, 0);
    }).finally(() => {
      this.$loading.hide();
    });
  },
  methods: {
    clickHeadInfo() {
      this.openPopup("headInfoDetail", this.headInfoDataSet);
    },
    clickLineInfo() {
      this.openPopup("lineInfoDetail", this.lineInfoDataSet);
    },
    // 获取 多语言配置
    getLanguageDefine(key) {
      const languageList = {
        "headInfo": $T("smdm.materielApplication.view.headInfo").$D("物料申请单头信息"),
        "lineInfo": $T("smdm.materielApplication.view.lineInfo").$D("行信息"),
      };
      return languageList[key] || key;
    },
    save() {
      this.lineInfoDataSet.updateRecords([ this.lineInfoDataSet.current ]).then(() => {
        this.$notification.open({ message: $T("smbl.common.message.acction.success").$D("操作成功") });
      });
    },
    beforeApprove() {
      return new Promise((resolve, reject) => {
        this.lineInfoDataSet.updateRecords([ this.lineInfoDataSet.current ]).then(() => {
          resolve(true);
        }).catch(() => {
          reject(false);
        });
      });
    },
    // 弹框
    openPopup(name, item) {
      this.popupData = {
        data: item,
        columns: name,
        code: name,
      };
      setTimeout(() => {
        this.visiblePopup = true;
      }, 0);
    },
  }
};
</script>

<style lang="stylus" scoped>
.line-filter {
  display flex;
  justify-content space-between;

  .srm-icon {
    color var(--font-color-disable);
    font-size 20px;
  }
}
</style>