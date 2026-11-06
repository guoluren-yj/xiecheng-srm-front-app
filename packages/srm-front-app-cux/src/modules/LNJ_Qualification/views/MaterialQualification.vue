<template>
  <div style="height: 100vh">
    <div class="detail-wrap create-receive-detail-scroll-el " >
      <srm-scroll-tab>
        <srm-scroll-tab-item :label="keyComponent === 'materialQualification' ? $T('scux.lngQualificationList.view.title.itemInfo').$D('物料信息') : $T('scux.lngQualificationList.view.title.baseInfo').$D('基本信息')">
          <srm-form style="padding:0 15px 10px 15px;margin-bottom: 0px;" :data-set="materialHeaderDataDs" :columns="getItemInfoColumns"/>
        </srm-scroll-tab-item>
        <srm-scroll-tab-item :label="keyComponent === 'materialQualification' ? $T('scux.lngQualificationList.view.title.material.accessories').$D('原料附件') : $T('scux.lngQualificationList.view.title.certificate').$D('资质证明')">
          <srm-list
            :scrollable="false"
            :data-set="materialAccessoriesDataDs"
            :columns="getLMaterialAccessoriesColumns"/>
        </srm-scroll-tab-item>
      </srm-scroll-tab>
    </div>
  </div>
</template>

<script>
import { DataSet, $T } from "srm-mobile-ui";
import { materialQualificationList, materialAccessoriesData, manufacturerList } from "../datasource/index";
import { fetchMaterialQualification } from "../api/index";

export default {
  modules: [ "scux.lngQualificationList" ],
  name: "MaterialQualification",
  props: {
    params: {
      type: Object,
    },
    keyComponent: {
      type: String,
    },
  },
  data() {
    return {
      materialHeaderDataDs: new DataSet(this.keyComponent === "materialQualification" ? materialQualificationList() : manufacturerList()),
      materialAccessoriesDataDs: new DataSet(materialAccessoriesData()),
    };
  },
  computed: {
    getItemInfoColumns() {
      return this.keyComponent === "materialQualification" ? [ {
        fieldCode: "itemCode",
      }, {
        fieldCode: "itemName",
      }, {
        fieldCode: "itemCategoryName",
      }, {
        fieldCode: "specifications",
      }, {
        fieldCode: "sellByDate",
      }, {
        fieldCode: "reserveName",
      }, ] : [ {
        fieldCode: "supplierCompanyNum",
        fieldType: "EMPTY",
        formRow:0,
        render: (val) => <SrmListHeader>
          <span> {val}</span>
        </SrmListHeader>,
      }, {
        fieldCode: "reserveName",
      }, {
        fieldCode: "supplierCompanyName",
      }, ];
    },
    getLMaterialAccessoriesColumns() {
      return [ {
        fieldCode: "name",
      }, {
        fieldCode: "attachmentUuid",
        render: (val, item) => val && <srm-upload
          desc-title={$T("scux.lngQualificationList.view.message.button.view").$D("查看")}
          show-icon={false}
          show-count={true}
          color={ "#276EF1" }
          attachment-uuid={item.attachmentUuid}/>,
      }, {
        fieldCode: "validDate",
      }, ];
    },
  },
  mounted() {
    this.handleFetchMaterialQualification();
  },
  methods: {
    // 明细数据查询
    async handleFetchMaterialQualification() {
      try {
        this.$loading.show();
        const response = await fetchMaterialQualification(this.params || {});
        if (response && !response.failed) {
          const { file, ...otherData } = response;
          this.materialHeaderDataDs.setData([ otherData ]);
          this.materialHeaderDataDs.locate(0);
          this.materialAccessoriesDataDs.setData(file);
        }
      } finally {
        this.$loading.hide();
      }
    }
  },
};
</script>
