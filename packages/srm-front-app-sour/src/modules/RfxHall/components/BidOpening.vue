<!--<template>-->
<!--  &lt;!&ndash; 开标 &ndash;&gt;-->
<!--  <section>-->
<!--    <srm-scroll-tab>-->
<!--      &lt;!&ndash; 基础信息 &ndash;&gt;-->
<!--      <srm-scroll-tab-item :label="getLanguageDefine('basicInfo')">-->
<!--        <ul style="padding: 16px 15px;"-->
<!--            @click="openPopup('basicInfo', {code: 'SMBL.INQUIRY_HALL.BP.BASICINFO.DETAIL', columns: getColumns('basicInfoDetail'), data: headInfo})">-->
<!--          <customize-->
<!--            :data-source="headInfo"-->
<!--            :columns="getColumns('basicInfo')"-->
<!--            code="SMBL.INQUIRY_HALL.BP.BASICINFO"-->
<!--            type="list"-->
<!--            :need-padding="false"/>-->
<!--        </ul>-->
<!--      </srm-scroll-tab-item>-->
<!--      &lt;!&ndash; 开标详情 &ndash;&gt;-->
<!--      <srm-scroll-tab-item :label="getLanguageDefine('bidOpening')">-->
<!--        <srm-list :scrollable="false"-->
<!--                  height="auto"-->
<!--                  style="height: auto"-->
<!--                  :data-set="bidOpeningDataSet"-->
<!--                  :columns="getColumns('bidOpening')"-->
<!--                  customize-code="SMBL.INQUIRY_HALL.BP.BIDOPENING"-->
<!--                  @itemClick="clickItem"/>-->
<!--      </srm-scroll-tab-item>-->
<!--      <srm-scroll-tab-item v-if="headInfo.rfxStatus === 'CLOSED' || headInfo.rfxStatus === 'CHECK_PENDING' || headInfo.rfxStatus === 'FINISHED'" :label="$T('ssrc.inquiryHall.model.library.attachmentUuid').$D('附件')">-->
<!--        <div class="customize-card">-->
<!--          <customize :need-padding="true" :data-source="headInfo" :columns="getProcessAttachmentColumns" />-->
<!--        </div>-->
<!--      </srm-scroll-tab-item>-->
<!--    </srm-scroll-tab>-->

<!--    &lt;!&ndash; 详情弹框 &ndash;&gt;-->
<!--    <srm-popup :visible.sync="visibleDetailPopup"-->
<!--               :show-header="false"-->
<!--               height="100%">-->
<!--      <customize-detail-->
<!--        :need-padding="true"-->
<!--        :code="infoDetailPopup.code"-->
<!--        :data-source="infoDetailPopup.data"-->
<!--        :columns="infoDetailPopup.columns"/>-->
<!--    </srm-popup>-->
<!--    &lt;!&ndash; 过程附件弹框 &ndash;&gt;-->
<!--    <process-attachment-pop ref="processAttachComRef" />-->
<!--  </section>-->
<!--</template>-->

<!--<script>-->
<!--import { getBasicInfoApi } from "../api/BidOpening";-->
<!--import { bidOpeningDs } from "../datasource/BidOpeningDs";-->
<!--import { DataSet, $T } from "srm-mobile-ui";-->
<!--import ProcessAttachmentPop from "./commonPop/ProcessAttachmentPop";-->

<!--export default {-->
<!--  modules: [ "ssrc.queryRfq", "ssrc.inquiryHall", "smbl.common", "hipspfm.common", "ssrc.common" ],-->
<!--  name: "BidOpening",-->
<!--  components: {-->
<!--    ProcessAttachmentPop-->
<!--  },-->
<!--  props: {-->
<!--    rfxHeaderId: {-->
<!--      type: String,-->
<!--    }-->
<!--  },-->
<!--  data() {-->
<!--    return {-->
<!--      // 基础信息-->
<!--      headInfo: {},-->
<!--      // 开标信息-->
<!--      bidOpeningDataSet: new DataSet(),-->
<!--      visibleDetailPopup: false,-->
<!--      infoDetailPopup: {},-->
<!--    };-->
<!--  },-->
<!--  // 获取字段-->
<!--  computed: {-->
<!--    getColumns() {-->
<!--      return (title) => {-->
<!--        let nameList = [];-->
<!--        switch (title) {-->
<!--        case "basicInfo" :-->
<!--          nameList = [ "rfxNumHead", "sourceCategoryMeaning", "sourceMethodMeaning" ];-->
<!--          break;-->
<!--        case "basicInfoDetail" :-->
<!--          nameList = [ "rfxNum", "sourceCategoryMeaning", "sourceMethodMeaning" ];-->
<!--          break;-->
<!--        case "bidOpening" :-->
<!--          nameList = [ "realNameHead", "phone", "email" ];-->
<!--          break;-->
<!--        case "bidOpeningDetail" :-->
<!--          nameList = [ "realName", "phone", "email" ];-->
<!--          break;-->
<!--        default:-->
<!--          nameList = [ ];-->
<!--          break;-->
<!--        }-->
<!--        let columns = nameList.map((res) => ({-->
<!--          ...this.getFieldInfo(res)-->
<!--        }));-->
<!--        return columns;-->
<!--      };-->
<!--    },-->
<!--    //过程附件查看-->
<!--    getProcessAttachmentColumns() {-->
<!--      return [-->
<!--        {-->
<!--          formRow: 10,-->
<!--          fieldCode: "rfxHeaderId",-->
<!--          fieldType: "EMPTY",-->
<!--          render: (val, item) => <SrmFlex>-->
<!--            <span>{ this.$T("ssrc.inquiryHall.view.button.examine").$D("过程附件查看") }：</span>-->
<!--            <span style="color: var(&#45;&#45;color-other-default-b);"-->
<!--              on-click={(e) => {-->
<!--                e.stopPropagation();-->
<!--                this.$refs.processAttachComRef.getProcessAttachmentDetailInfo(item);-->
<!--              }}>-->
<!--              { this.$T("ssrc.inquiryHall.view.message.button.view").$D("查看") }-->
<!--            </span>-->
<!--          </SrmFlex>,-->
<!--        }-->
<!--      ];-->
<!--    },-->
<!--  },-->
<!--  async mounted() {-->
<!--    if (this.rfxHeaderId) {-->
<!--      try {-->
<!--        this.$loading.show();-->
<!--        await this.fetchData();-->
<!--      } catch (err) {-->
<!--        this.$loading.hide();-->
<!--      }-->
<!--    }-->
<!--  },-->
<!--  methods: {-->
<!--    clickItem(record) {-->
<!--      this.openPopup("bidOpening", { code: "SMBL.INQUIRY_HALL.BP.BIDOPENING.DETAIL", columns: this.getColumns("bidOpeningDetail"), data: record.data });-->
<!--    },-->
<!--    async fetchData() {-->
<!--      this.bidOpeningDataSet = new DataSet(bidOpeningDs(this.rfxHeaderId));-->
<!--      this.bidOpeningDataSet.refresh();-->
<!--      await getBasicInfoApi(this.rfxHeaderId).then((res) => {-->
<!--        this.headInfo = { ...res };-->
<!--        this.$loading.hide();-->
<!--      });-->
<!--    },-->
<!--    // 获取 多语言配置-->
<!--    getLanguageDefine(key) {-->
<!--      const languageList = {-->
<!--        "basicInfo": $T("ssrc.inquiryHall.view.inquiryHall.headerBaseInfo").$D("基础信息"),-->
<!--        "bidOpening": $T("ssrc.inquiryHall.view.inquiryHall.bidOpeningDetail").$D("开标详情"),-->
<!--      };-->
<!--      return languageList[key] || key;-->
<!--    },-->
<!--    // 获取 个性化配置-->
<!--    getCustomizeCode(code) {-->
<!--      const codeList = {-->
<!--      };-->
<!--      return codeList[code] || "";-->
<!--    },-->
<!--    openPopup(name, item) {-->
<!--      switch (name) {-->
<!--      case "":-->
<!--        break;-->
<!--      default:-->
<!--        this.visibleDetailPopup = true;-->
<!--        this.infoDetailPopup = {-->
<!--          ...item,-->
<!--        };-->
<!--        break;-->
<!--      }-->
<!--    },-->
<!--    // 获取字段-->
<!--    getFieldInfo(code) {-->
<!--      const columnList = [-->
<!--        {-->
<!--          fieldCode: "rfxNumHead",-->
<!--          fieldType: "EMPTY",-->
<!--          formRow: 1,-->
<!--          render: (val, item) =>-->
<!--            <SrmListHeader>-->
<!--              <span style="font-weight: normal !important">-->
<!--                {$T("ssrc.inquiryHall.model.inquiryHall.inquiryHallRfxNum").$D("询价单编号")}：{item.rfxNum ? item.rfxNum : "-"}-->
<!--              </span>-->
<!--            </SrmListHeader>-->
<!--        },-->
<!--        {-->
<!--          fieldCode: "rfxNum",-->
<!--          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.inquiryHallRfxNum").$D("询价单编号"),-->
<!--          formRow: 1,-->
<!--        },-->
<!--        {-->
<!--          fieldCode: "sourceCategoryMeaning",-->
<!--          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.sourceCategoryMeaning").$D("寻源类别"),-->
<!--          formRow: 2,-->
<!--        },-->
<!--        {-->
<!--          fieldCode: "sourceMethodMeaning",-->
<!--          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.sourceMethodMeaning").$D("寻源方式"),-->
<!--          formRow: 3,-->
<!--        },-->
<!--        {-->
<!--          fieldCode: "realNameHead",-->
<!--          fieldType: "EMPTY",-->
<!--          formRow: 1,-->
<!--          render: (val, item) => {-->
<!--            const openedFlag = item.openedFlag;-->
<!--            const statusType = {-->
<!--              0: "warn",-->
<!--              1: "success",-->
<!--            };-->
<!--            return <SrmListHeader>-->
<!--              <span>-->
<!--                {$T("ssrc.inquiryHall.model.inquiryHall.openBidder").$D("开标员")}：{ item.realName ? item.realName : "-"}-->
<!--              </span>-->
<!--              <SrmButton slot="right" plain rect style={{ fontWeight: "bold" }} type={statusType[openedFlag]}>-->
<!--                {item.openedFlagMeaning}-->
<!--              </SrmButton>-->
<!--            </SrmListHeader>;-->
<!--          }-->
<!--        },-->
<!--        {-->
<!--          fieldCode: "realName",-->
<!--          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.openBidder").$D("开标员"),-->
<!--          formRow: 1,-->
<!--        },-->
<!--        {-->
<!--          fieldCode: "phone",-->
<!--          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.contactMobilephone").$D("联系方式"),-->
<!--          formRow: 2,-->
<!--        },-->
<!--        {-->
<!--          fieldCode: "email",-->
<!--          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.email").$D("电子邮件"),-->
<!--          formRow: 3,-->
<!--        },-->
<!--      ];-->
<!--      return columnList.find((v) => v.fieldCode === code);-->
<!--    },-->
<!--  }-->
<!--};-->
<!--</script>-->