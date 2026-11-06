<template>
  <div style="height: 100vh">
    <div class="detail-wrap create-receive-detail-scroll-el " >
      <srm-form class="lng-srm-from-search" :data-set="distributorSearchDs" :columns="getSearchColumns" />
      <srm-detail-head>
        <srm-form v-if="distributorHeaderDs" :data-set="distributorHeaderDs" :columns="getHeaderColumns" />
      </srm-detail-head>
      <srm-scroll-tab>
        <srm-scroll-tab-item :key="0" :label="$T('scux.lngQualificationList.view.title.distributorHeader').$D('登记信息')">
          <srm-form style="padding:0 15px 10px 15px;margin-bottom: 0px;" :data-set="distributorHeaderDs" :columns="getDistributor"/>
        </srm-scroll-tab-item>
        <srm-scroll-tab-item :key="1" :label="$T('scux.lngQualificationList.view.title.distributorSuppliercapcity').$D('供货能力清单')">
          <srm-list
            :scrollable="false"
            :data-set="distributorSuppliercapcityDs"
            :columns="getSuppliercapcity"/>
        </srm-scroll-tab-item>
        <srm-scroll-tab-item :key="2" :label="$T('scux.lngQualificationList.view.title.distributorAttachment').$D('附件信息(企业认证)')">
          <srm-list
            :scrollable="false"
            :data-set="distributorAttachmentDs"
            :columns="getAttachment"/>
        </srm-scroll-tab-item>
      </srm-scroll-tab>
    </div>
  </div>
</template>

<script>
import { DataSet, $T } from "srm-mobile-ui";
import { CalcDate } from "@/utils/filter";
import { distributorHeader, distributorAttachment, distributorSuppliercapcity, distributorSearch } from "../datasource/index";
import { renderYesOrNo } from "../utils/index";
import { fetchMaterialQualification, fetchLovParams } from "../api/index";

export default {
  modules: [ "scux.lngQualificationList", "hzero.common" ],
  name: "Distributor",
  props: {
    params: {
      type: Object,
    },
  },
  data() {
    return {
      distributorSearchDs: new DataSet(distributorSearch()),
      distributorHeaderDs: new DataSet(distributorHeader()),
      distributorAttachmentDs: new DataSet(distributorAttachment()),
      distributorSuppliercapcityDs: new DataSet(distributorSuppliercapcity()),
    };
  },
  computed: {
    getSearchColumns() {
      return [ {
        fieldCode: "companyId",
        inputChange:(val) => {
          if (val && val[0]) {
            this.handleFetchDistributor({ supplierCompanyId: this.params.supplierCompanyId, companyId: val[0].companyId });
          }
        },
      } ];
    },
    getHeaderColumns() {
      return [ {
        fieldCode: "companyName",
        fieldType: "EMPTY",
        formRow:0,
        render: (val) =>
          <span> {val}</span>
      }, {
        fieldCode: "companyNum",
      }, {
        fieldCode: "processDate",
      }, {
        fieldCode: "lastUpdateDate",
      }, ];
    },
    getDistributor() {
      return [ {
        fieldCode: "companyName",
        fieldType: "EMPTY",
        formRow:0,
        render: (val) => <SrmListHeader>
          <span> {val}</span>
        </SrmListHeader>,
      }, {
        fieldCode: "companyTypeMeaning",
      }, {
        fieldCode: "shortName",
      }, {
        fieldCode: "registeredCountryName",
      }, {
        fieldCode: "buildDate",
      }, {
        fieldCode: "legalRepName",
      }, {
        fieldCode: "longTermFlag",
      }, {
        fieldCode: "taxpayerTypeMeaning",
      }, {
        fieldCode: "businessScope",
      }, ];
    },
    getSuppliercapcity() {
      return [ {
        fieldCode: "itemCode",
        fieldType: "EMPTY",
        formRow:0,
        render: (val) => <SrmListHeader>
          <span> {val}</span>
        </SrmListHeader>,
      }, {
        fieldCode: "itemName",
      }, {
        fieldCode: "itemCategoryName",
      }, {
        fieldCode: "itemCategoryCode",
      }, {
        fieldCode: "supplyFlag",
        render: (val) => renderYesOrNo(val),
      }, ];
    },
    getAttachment() {
      return [ {
        fieldType: "EMPTY",
        formRow:0,
        render: () => <SrmListHeader>
          <span> {$T("scux.lngQualificationList.model.attachmentUuidDesc").$D("附件描述")}</span>
        </SrmListHeader>,
      }, {
        fieldCode: "attachmentTypeMeaning",
      }, {
        fieldCode: "attachmentUuid",
        render: (val, item) => val && <srm-upload
          desc-title={$T("scux.lngQualificationList.view.message.button.view").$D("查看")}
          show-icon={false}
          show-count={true}
          color={ "#276EF1" }
          attachment-uuid={item.attachmentUuid}/>,
      }, {
        fieldCode: "endDate",
      }, {
        fieldCode: "uploadDate",
        render: (val) =>
          // eslint-disable-next-line
          CalcDate(val),
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
    const { supplierCompanyId } = this.params || {};
    fetchLovParams({ lovCode: "SSLM.USER_AUTH.COMPANY", supplierCompanyId: this.params.supplierCompanyId, tenantId: localStorage.getItem("organizationId") }).then((res) => {
      if (res && !res.failed) {
        this.distributorSearchDs.create({
          "companyId": res[0].companyId,
          "companyIdMeaning": res[0].companyName
        }, 0);
        this.handleFetchDistributor({ supplierCompanyId, companyId: res[0].companyId });
      }
    });
  },
  methods: {
    // 明细数据查询
    async handleFetchDistributor(paramsProps) {
      try {
        this.$loading.show();
        const response = await fetchMaterialQualification(paramsProps);
        if (response && !response.failed) {
          const { basic, attachmentList, supplierAbilities } = response;
          this.distributorHeaderDs.reset();
          this.distributorHeaderDs.setData([ basic ]);
          this.distributorHeaderDs.locate(0);
          this.distributorAttachmentDs.reset();
          this.distributorAttachmentDs.setData(attachmentList);
          this.distributorSuppliercapcityDs.reset();
          this.distributorSuppliercapcityDs.setData(supplierAbilities);
        }
      } finally {
        this.$loading.hide();
      }
    }
  },
};
</script>
<style scoped>
.lng-srm-from-search {
  min-height: 0px;
}
</style>
