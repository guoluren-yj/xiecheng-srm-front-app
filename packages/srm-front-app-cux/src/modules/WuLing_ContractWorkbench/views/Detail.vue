<template>
  <!-- 采购申请工作台 -->
  <div class="detail-container">
    <srm-scroll-tab>
      <srm-scroll-tab-item
        key="basicInfo"
        :label="getLanguageDefine('basicInfo')"
        code="basicInfo">
        <srm-form
          :data-set="commonDataSet"
          :columns="getColumns('basicInfo')"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        key="partnerInfo"
        :label="getLanguageDefine('partnerInfo')"
        code="partnerInfo">
        <srm-list
          :scrollable="false"
          height="auto"
          style="height: auto"
          :data-set="partnerDataSet"
          :columns="getColumns('partnerInfo')"/>
      </srm-scroll-tab-item>
      <!-- 附件 -->
      <srm-scroll-tab-item
        key="attachInfo"
        :label="getLanguageDefine('attachInfo')"
        code="attachInfo">
        <srm-form
          :style="{marginBottom: '79px'}"
          :data-set="commonDataSet"
          :columns="getColumns('attachInfo')"/>
      </srm-scroll-tab-item>
    </srm-scroll-tab>

    <!-- 详情按钮 -->
    <srm-bottom-handler v-show="getButtons.length > 0" :btn-arr="getButtons" type="default" />
  </div>
</template>

<script>
import { DataSet, $T } from "srm-mobile-ui";
import { commonDs, partnerDs } from "../datasource/indexDs";
import { batchSilentSignatureApi } from "../api";

export default {
  modules: [
    "spcm.workspace",
    "spcm.common",
    "scux.spcm",
    "sprm.common",
    "hzero.common",
    "sodr.common",
  ],
  name: "WuLingContractWorkbenchDetail",
  data() {
    return {
      commonDataSet: null, // 基础信息
      partnerDataSet: null, // 伙伴信息
      headerInfo: {},
      prHeaderId: null,
      isChapter: false,
      popupData: {},
      visiblePopup: false,
    };
  },
  computed: {
    getButtons() {
      if (
        this.isChapter &&
        [ "APPROVED", "CONFIRMED", "PURCHASER_SIGN_CONTRACT" ].includes(
          this.commonDataSet?.current?.get("pcStatusCode")
        )
      ) {
        return [
          {
            text: this.$T("scux.spcm.button.workspace.wuling.cuxSign").$D(
              "签署"
            ),
            fill: true,
            handler: () => {
              this.signConract();
            },
          },
        ];
      }
      return [];
    },
  },
  beforeMount() {
    const {
      pcHeaderId,
      companyId,
      isChapter = false,
    } = this.$route.query || {};
    this.pcHeaderId = pcHeaderId || "";
    this.isChapter = isChapter;
    this.commonDataSet = new DataSet(
      commonDs({ pcHeaderId, companyId, isChapter })
    );
    this.partnerDataSet = new DataSet(partnerDs({ pcHeaderId }));
  },
  methods: {
    signConract() {
      this.$loading.show();
      batchSilentSignatureApi([ this.commonDataSet?.current?.toData() || {} ]).then((res) => {
        if (res && res.failed) {
          this.$notification.open({ message: res.message });
        } else {
          this.$notification.open({ message: $T("hzero.common.notification.success").$D("操作成功") });
          this.$router.replace({
            name: "WuLing_ContractWorkbench",
          });
        }
      }).finally(() => {
        this.$loading.hide();
      });
    },
    getColumns(name) {
      const attachmentTitleStyle = {
        fontSize: "14px",
        lineHeight: "20px",
        fontWeight: 600,
      };
      switch (name) {
      case "basicInfo":
        return [
          {
            fieldCode: "pcNum",
            fieldType: "EMPTY",
            render: (val, item) =>
              <SrmListHeader>
                <span>{item.pcNum || "-"}</span>
              </SrmListHeader>,
            formRow: 10,
          },
          {
            fieldCode: "pcName",
            fieldName: $T(
              "scux.spcm.view.button.workspace.wuling.cuxContractName"
            ).$D("合同名称"),
            fieldType: "TEXT",
          },
          {
            fieldCode: "companyName",
            fieldName: $T("spcm.workspace.model.companyName").$D("公司"),
            fieldType: "TEXT",
          },
          {
            fieldCode: "supplierCompanyName",
            fieldName: $T("spcm.workspace.supplierCompanyName").$D("供应商"),
            fieldType: "TEXT",
          },
          {
            fieldCode: "purchaseDepartment",
            fieldName: $T(
              "scux.spcm.view.workspace.wuling.puchaseDepartment"
            ).$D("采购科室"),
            fieldType: "TEXT",
          },
          {
            fieldCode: "purchaseAgentName",
            fieldName: $T("spcm.common.model.common.agentName").$D("采购员"),
            fieldType: "TEXT",
          },
          {
            fieldCode: "taxIncludeAmount",
            fieldName: $T(
              "scux.spcm.view.workspace.wuling.contractAmount"
            ).$D("合同金额"),
            fieldType: "TEXT",
          },
          {
            fieldCode: "purchaseCurrencyCode",
            fieldName: $T("spcm.common.model.common.currencyName").$D("币种"),
            fieldType: "TEXT",
          },
          {
            fieldCode: "pcTypeName",
            fieldName: $T(
              "scux.spcm.view.workspace.wuling.cuxContractType"
            ).$D("合同类别"),
            fieldType: "TEXT",
          },
          {
            fieldCode: "signDate",
            fieldName: $T(
              "scux.spcm.view.workspace.wuling.cuxNewApprovlDate"
            ).$D("最新审批日期"),
            fieldType: "TEXT",
          },

          {
            fieldCode: "pcSourceCodeMeaning",
            fieldName: $T("spcm.common.model.prSourcePlatformMeaning").$D(
              "来源平台"
            ),
            fieldType: "TEXT",
          },
        ];
      case "partnerInfo":
        return [
          {
            fieldCode: "partnerTypeName",
            fieldName: $T("spcm.common.model.common.partnerTypeName").$D(
              "伙伴类型名称"
            ),
            fieldType: "TEXT",
          },
          {
            fieldCode: "companyName",
            fieldName: $T("spcm.common.model.common.companyName").$D(
              "公司名称"
            ),
            fieldType: "TEXT",
          },
          {
            fieldCode: "legalRepName",
            fieldName: $T("spcm.common.model.common.legalRepName").$D(
              "代表人"
            ),
            fieldType: "TEXT",
          },
          {
            fieldCode: "unifiedSocialCode",
            fieldName: $T("spcm.common.model.common.unifiedSocialCode").$D(
              "统一社会信用代码"
            ),
            fieldType: "TEXT",
          },
          {
            fieldCode: "contacts",
            fieldName: $T("spcm.common.model.common.contacts").$D("联系人"),
            fieldType: "TEXT",
          },
          {
            fieldCode: "telNum",
            fieldName: $T("spcm.common.model.common.telNum").$D("联系电话"),
            fieldType: "TEXT",
          },
          {
            fieldCode: "bankName",
            fieldName: $T("spcm.common.model.common.bankName").$D(
              "开户行名称"
            ),
            fieldType: "TEXT",
          },
          {
            fieldCode: "bankAccountName",
            fieldName: $T("spcm.common.model.common.bankAccountName").$D(
              "账户名称"
            ),
            fieldType: "TEXT",
          },
          {
            fieldCode: "bankAccountNum",
            fieldName: $T("spcm.common.model.common.bankAccountNum").$D(
              "银行账号"
            ),
            fieldType: "TEXT",
          },
        ];
      case "attachInfo":
        return [
          {
            fieldType: "EMPTY",
            fieldCode: "purchaserAttachment",
            render: () =>
              <span style={attachmentTitleStyle}>
                {$T("spcm.common.view.btn.purchaserAttachment").$D(
                  "采购方附件"
                )}
              </span>
            ,
          },
          {
            fieldType: "EMPTY",
            fieldCode: "purchaserAttachmentUuid",
            render: (val) =>
              <SrmFlex
                class="attachment"
                justify="between"
                nativeOnClick={() => {
                  this.$attachment({
                    attachments: [
                      {
                        attachmentUuid: val,
                        title: $T(
                          "spcm.common.view.btn.purchaserAttachment"
                        ).$D("采购方附件"),
                        displayType: "list",
                        readonly: true,
                        showInfo: true,
                        uploadButton: "none",
                      },
                    ],
                  });
                }}
              >
                <SrmFlex>
                  <span class="srm-icon icon-other" />
                  <srm-button type="brown" plain>
                    {$T("spcm.common.view.btn.purchaserAttachment").$D(
                      "采购方附件"
                    )}
                  </srm-button>
                </SrmFlex>
                <span class="srm-icon icon-chevron-right" />
              </SrmFlex>
            ,
          },
          {
            fieldType: "EMPTY",
            fieldCode: "attachment",
            render: () =>
              <span style={attachmentTitleStyle}>
                {$T("spcm.common.view.message.title.attachment.tag").$D(
                  "附件"
                )}
              </span>
            ,
          },
          {
            fieldType: "EMPTY",
            fieldCode: "attachmentUuid",
            render: (val) =>
              <SrmFlex
                class="attachment"
                justify="between"
                nativeOnClick={() => {
                  this.$attachment({
                    attachments: [
                      {
                        attachmentUuid: val,
                        title: $T(
                          "spcm.common.view.message.comContractAttachment"
                        ).$D("协议附件"),
                        displayType: "list",
                        readonly: true,
                        showInfo: true,
                        uploadButton: "none",
                      },
                    ],
                  });
                }}
              >
                <SrmFlex>
                  <span class="srm-icon icon-other" />
                  <srm-button type="brown" plain>
                    {$T("spcm.common.view.message.comContractAttachment").$D(
                      "协议附件"
                    )}
                  </srm-button>
                </SrmFlex>
                <span class="srm-icon icon-chevron-right" />
              </SrmFlex>
            ,
          },
          {
            fieldType: "EMPTY",
            fieldCode: "supplierAttachmentUuid",
            render: (val) =>
              <SrmFlex
                class="attachment"
                justify="between"
                nativeOnClick={() => {
                  this.$attachment({
                    attachments: [
                      {
                        attachmentUuid: val,
                        title: $T(
                          "sodr.common.model.common.supplierAttachmentId"
                        ).$D("供应商附件"),
                        displayType: "list",
                        readonly: true,
                        showInfo: true,
                        uploadButton: "none",
                      },
                    ],
                  });
                }}
              >
                <SrmFlex>
                  <span class="srm-icon icon-other" />
                  <srm-button type="brown" plain>
                    {$T("sodr.common.model.common.supplierAttachmentId").$D(
                      "供应商附件"
                    )}
                  </srm-button>
                </SrmFlex>
                <span class="srm-icon icon-chevron-right" />
              </SrmFlex>
            ,
          },
        ];
      default:
        return [];
      }
    },
    // 获取 多语言配置
    getLanguageDefine(key) {
      const languageList = {
        basicInfo: $T("scux.spcm.view.title.wuling.cuxContractBasicInfo").$D(
          "合同基础信息"
        ),
        partnerInfo: $T("spcm.common.view.message.partnerInformation").$D(
          "伙伴信息"
        ),
        attachInfo: $T("spcm.common.view.message.title.attachment.tag").$D(
          "附件"
        ),
      };
      return languageList[key] || key;
    },
    // 点击 tab 块
    clickDetailInfo() {
      this.openDetailPopup("basicInfoDetail", this.commonDataSet);
    },
    // 详情弹框
    async openDetailPopup(name, item) {
      this.popupData = {
        data: item,
        columns: name,
        code: name,
      };
      this.visiblePopup = true;
    },
  },
};
</script>

<style lang="stylus" scoped>

.bottom-button {
  height: 72px;
  border-top: 1px solid #f0f2f5;
}
.attachment {
  height 28px;
  font-size 14px;
  color #333333;
  line-height 20px;

  .icon-other {
    font-size 28px;
    color #FEBF43;
    margin-right 8px;
  }

  .icon-chevron-right {
    font-size 16px;
    color val(--color-font-default-b);
  }
  >>> .srm-button-primary {
    color #333 !important;
  }
}

>>> .srm-scroll-tab-item-title {
  display: flex;
  justify-content: space-between !important;

}
</style>
