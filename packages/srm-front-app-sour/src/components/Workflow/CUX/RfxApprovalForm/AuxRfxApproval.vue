<template>
  <section v-if="loading" class="mainDetail">
    <div ref="wrapper" class="contentWrap wrapper">
      <srm-tab ref="content" class="content">
        <!-- 询价基础信息 -->
        <!-- <SrmTabPane
          :label="getLanguageDefine('询价基础信息')">
          <div ref="headInfo" class="infoContent headInfo">
            <div v-if="!headInfo.rfxHeaderId" class="noContent">
              <span>
                {{ getLanguageDefine('暂无数据') }}
              </span>
            </div>
            <ul v-else>
              <Customize
                :columns="getBaseInfoColumns"
                :data-source="headInfo" type="list" :need-padding="false"
                :code="getCustomizeCode('询价审批-询价基础信息')" />
            </ul>
          </div>
        </SrmTabPane> -->

        <!-- 采购组织及人员 -->
        <srm-tab-pane
          :label="getLanguageDefine('采购组织及人员')">
          <div ref="headInfo" class="infoContent headInfo">
            <div v-if="!headInfo.rfxHeaderId" class="noContent">
              <span>
                {{ getLanguageDefine('暂无数据') }}
              </span>
            </div>
            <template v-else >
              <ul>
                <div>
                  <li class="titel">
                    <span class="block"/>
                    <span>{{ getLanguageDefine('需求方') }}</span>
                  </li>
                  <p v-for="(f, index) in getField('需求方')" :key="index"
                     class="field">
                    <span>
                      {{ getLanguageDefine(f[0]) }}：{{ headInfo[f[1]] }}
                    </span>
                  </p>
                </div>
                <div>
                  <li class="titel">
                    <span class="block"/>
                    <span class="name-title">{{ getLanguageDefine('采购执行人') }}</span>
                  </li>
                  <!-- 个性化组件替换后的代码 -->
                  <customize
                    :columns="getPurOrganizationColumns"
                    :data-source="headInfo" type="list" :need-padding="false"
                    :code="getCustomizeCode('询价审批-采购执行人')" />
                </div>
              </ul>
            </template>
          </div>
        </srm-tab-pane>

        <!-- 标段 (分标段) -->
        <srm-tab-pane
          v-if="headInfo.projectLineSections && headInfo.projectLineSections.length > 0"
          :label="getLanguageDefine('标段')">
          <div ref="headInfo" class="infoContent headInfo">
            <ul style="padding-bottom: 0px;padding-top: 0px;">
              <div v-for="(item, index) in sectionBiding" :key="index"
                   class="card">
                <li class="name-title">
                  <span>
                    <!-- {{ `${item.sectionCode||""} - ${item.sectionName}` }} -->
                    {{ item.sectionCode ? item.sectionCode + "-" + item.sectionName : item.sectionName }}
                  </span>
                </li>
                <!-- 个性化组件替换后的代码 -->
                <customize
                  :columns="getSectionBidingColumns"
                  :data-source="item" type="list" :need-padding="false"
                  :code="getCustomizeCode('询价审批-标段')" />
              </div>
            </ul>
          </div>
        </srm-tab-pane>

        <!-- 标的物（不分标段） -->
        <srm-tab-pane
          v-else
          :label="getLanguageDefine('标的物')">
          <div ref="headInfo" class="infoContent headInfo">
            <div v-if="rfxItemLines.length === 0" class="noContent">
              <span>
                {{ getLanguageDefine('暂无数据') }}
              </span>
            </div>
            <ul style="padding-bottom: 0px;padding-top: 0px;">
              <div v-for="(item, index) in rfxItemLines" :key="index"
                   class="card">
                <li class="name-title">
                  <span>
                    <!-- {{ `${item.itemCode||""} - ${item.itemName}` }} -->
                    {{ item.itemCode ? item.itemCode + "-" + item.itemName : item.itemName }}
                  </span>
                </li>
                <customize
                  :columns="getRfxItemLinesColumns"
                  :data-source="item" type="list" :need-padding="false"
                  :code="getCustomizeCode('询价审批-标的物')" />
              </div>
            </ul>
          </div>
        </srm-tab-pane>

        <!-- 对供应商要求 -->
        <!-- <SrmTabPane
          :label="getLanguageDefine('对供应商要求')">
          <div ref="headInfo" class="infoContent headInfo">
            <div v-if="!headInfo.rfxHeaderId" class="noContent">
              <span>
                {{ getLanguageDefine('暂无数据') }}
              </span>
            </div>
            <template v-else>
              <ul :style="{'padding-bottom': supplierInfo.length > 0 ? '0px': ''}">
                <p v-for="(f, index) in getField('对供应商要求')" :key="index"
                   class="field"
                   :style="{'margin-bottom': index === 1 ? '0px !important': ''}">
                  <span>
                    {{ getLanguageDefine(f[0]) }}：{{ headInfo[f[1]] }}
                  </span>
                </p>
              </ul>
              <ul v-if="supplierInfo.length > 0" style="padding-bottom: 0px">
                <li class="titel" style="margin-bottom: 0px !important;">
                  <span class="block"/>
                  <span>{{ getLanguageDefine('供应商列表') }}</span>
                </li>
                <div v-for="(item, index) in supplierInfo" :key="index"
                     class="card">
                  <li>
                    <span>
                      {{ `${item.supplierCompanyNum} - ${item.supplierCompanyName}` }}
                    </span>
                  </li>
                  <Customize
                    :columns="getSupplierColumns"
                    :data-source="item" type="list"
                    :need-padding="false"
                    :code="getCustomizeCode('询价审批-供应商列表')" />
                </div>
              </ul>
            </template>
          </div>
        </SrmTabPane> -->

        <!-- 询价要求 -->
        <srm-tab-pane
          :label="getLanguageDefine('询价要求')">
          <div ref="headInfo" class="infoContent headInfo">
            <div v-if="!headInfo.rfxHeaderId" class="noContent">
              <span>
                {{ getLanguageDefine('暂无数据') }}
              </span>
            </div>
            <template>
              <ul>
                <div>
                  <!-- 寻源准备 -->
                  <li class="titel" style="margin-bottom: 0px !important;">
                    <span class="block"/>
                    <span>{{ getLanguageDefine('寻源准备') }}</span>
                  </li>
                  <div class="card" style="border-bottom: 0px">
                    <p class="field" style="margin-bottom: 0px !important">
                      <span>{{ getLanguageDefine('寻源类别') }}：{{ headInfo.sourceCategoryMeaning }}</span>
                    </p>
                  </div>
                </div>

                <div v-if="headInfo.qualificationType !== 'NONE'">
                  <!-- 资格预审 -->
                  <li class="titel">
                    <span class="block"/>
                    <span>{{ getLanguageDefine('资格预审') }}</span>
                  </li>
                  <div class="card" style="border-bottom: 0px;padding-top: 0px">
                    <!-- 个性化组件替换后的代码 -->
                    <customize
                      :columns="getQualificationColumns"
                      :data-source="headInfo" type="list"
                      :need-padding="false"
                      :code="getCustomizeCode('询价审批-资格预审')" />
                  </div>
                </div>

                <div>
                  <!-- 报价 -->
                  <li class="titel">
                    <span class="block"/>
                    <span>{{ getLanguageDefine('报价') }}</span>
                  </li>
                  <div class="card" style="border-bottom: 0px;padding-top: 0px">
                    <!-- 个性化组件替换后的代码 -->
                    <customize
                      :columns="getQuotationColumns"
                      :data-source="headInfo" type="list"
                      :need-padding="false"
                      :code="getCustomizeCode('询价审批-报价')" />
                  </div>
                </div>

                <div v-if="expertInfo.length > 0">
                  <!-- 专家 -->
                  <li class="titel" style="margin-bottom: 0 !important;">
                    <span class="block"/>
                    <span>{{ getLanguageDefine('专家') }}</span>
                  </li>
                  <div v-for="(item, index) in expertInfo" :key="index"
                       class="card">
                    <li>
                      <span>
                        {{ `${item.loginName} - ${item.expertName}` }}
                      </span>
                    </li>
                    <!-- 个性化组件替换后的代码 -->
                    <customize
                      :columns="getExpertColumns"
                      :data-source="item" type="list"
                      :need-padding="false"
                      :code="getCustomizeCode('询价审批-专家')" />
                  </div>
                </div>

                <div v-if="headInfo.prequalHeaderId && scoreIndic.length>0">
                  <!-- 符合性检查 -->
                  <li class="titel" style="margin-bottom: 0px !important;">
                    <span class="block"/>
                    <span>{{ getLanguageDefine('符合性检查') }}</span>
                  </li>
                  <div v-for="(item, index) in scoreIndic" :key="index"
                       class="card">
                    <li>
                      <span>
                        {{ `${item.indicateCode} - ${item.indicateName}` }}
                      </span>
                    </li>
                    <!-- 个性化组件替换后的代码 -->
                    <customize
                      :columns="getComplianceCheckColumns"
                      :data-source="item" type="list"
                      :need-padding="false"
                      :code="getCustomizeCode('询价审批-符合性检查')" />
                  </div>
                </div>

                <div v-if="indicsInfo.length > 0">
                  <!-- 评分要素 -->
                  <li class="titel" style="margin-bottom: 0px !important;">
                    <span class="block"/>
                    <span> {{ getLanguageDefine('评分要素') }} </span>
                  </li>
                  <div v-for="(item, index) in indicsInfo" :key="index"
                       class="card">
                    <li>
                      <span>
                        {{ `${item.indicateCode} - ${item.indicateName}` }}
                      </span>
                    </li>
                    <!-- 个性化组件替换后的代码 -->
                    <customize
                      :columns="getScoreColumns"
                      :data-source="item" type="list"
                      :need-padding="false"
                      :code="getCustomizeCode('询价审批-评分要素')"/>
                  </div>
                </div>

                <div v-if="technologyIndic.length > 0">
                  <!-- 评分要素 - 技术组 80% -->
                  <li class="titel" style="margin-bottom: 0px !important;">
                    <span class="block"/>
                    <span>
                      {{ getLanguageDefine('评分要素') }}
                      -
                      {{ getLanguageDefine('技术组') }}
                      {{ headInfo.technologyWeight }}%</span>
                  </li>
                  <div v-for="(item, index) in technologyIndic" :key="index"
                       class="card">
                    <li>
                      <span>
                        {{ `${item.indicateCode} - ${item.indicateName}` }}
                      </span>
                    </li>
                    <!-- 个性化组件替换后的代码 -->
                    <customize
                      :columns="getScoreColumns"
                      :data-source="item" type="list"
                      :need-padding="false"
                      :code="getCustomizeCode('询价审批-评分要素')" />
                  </div>
                </div>

                <div v-if="businessIndic.length > 0">
                  <!-- 评分要素 - 商务组 20% -->
                  <li class="titel" style="margin-bottom: 0px !important;">
                    <span class="block"/>
                    <span>
                      {{ getLanguageDefine('评分要素') }}
                      -
                      {{ getLanguageDefine('商务组') }}
                      {{ headInfo.businessWeight }}%</span>
                  </li>
                  <div v-for="(item, index) in businessIndic" :key="index"
                       class="card">
                    <li>
                      <span>
                        {{ `${item.indicateCode} - ${item.indicateName}` }}
                      </span>
                    </li>
                    <!-- 个性化组件替换后的代码 -->
                    <customize
                      :columns="getScoreColumns"
                      :data-source="item" type="list"
                      :need-padding="false"
                      :code="getCustomizeCode('询价审批-评分要素')" />
                  </div>
                </div>
              </ul>
            </template>
          </div>
        </srm-tab-pane>

        <!-- 附件 -->
        <srm-tab-pane
          :label="getLanguageDefine('附件')">
          <div ref="headInfo" class="infoContent headInfo">
            <div v-if="!headInfo.rfxHeaderId" class="noContent">
              <span>
                {{ getLanguageDefine('暂无数据') }}
              </span>
            </div>
            <div v-else class="card">
              <ul>
                <!-- 个性化组件替换后的代码 -->
                <customize
                  :columns="getAttachColumns"
                  :data-source="headInfo" type="list" :need-padding="false"
                  :code="getCustomizeCode('询价审批-附件')" />
              </ul>
            </div>
          </div>
        </srm-tab-pane>
      </srm-tab>
    </div>

    <!-- 物料 -->
    <srm-popup :visible.sync="visibleItem" title="物料" height="100%" position="right" show-back>
      <detail-pop
        :type="'item'"
        :list="list"
        :customize-info="customizeInfo"/>
    </srm-popup>

    <!-- 分配物料 / 分配标段 / 评分要素细项 / 分配专家 弹框 -->
    <srm-popup :visible.sync="visible" :title="customizeInfo.name" height="80%" rounded>
      <template v-if="customizeInfo.name === '分配物料'">
        <detail-pop
          :type="'distrItem'"
          :list="list"
          :customize-info="customizeInfo"/>
      </template>
      <template v-if="customizeInfo.name === '分配专家'">
        <detail-pop
          :type="'expert'"
          :list="list"
          :customize-info="customizeInfo"/>
      </template>
      <template v-if="customizeInfo.name === '分配标段'">
        <detail-pop
          :type="'section'"
          :list="list"
          :customize-info="customizeInfo"/>
      </template>
      <template v-if="customizeInfo.name === '评分细项'">
        <detail-pop
          :type="'score'"
          :list="list"
          :customize-info="customizeInfo"/>
      </template>
    </srm-popup>

    <!-- 阶梯报价 -->
    <srm-popup :visible.sync="visibleLadder" title="阶梯报价" height="50%" rounded>
      <detail-line-pop
        v-if="visibleLadder"
        :type="'ladder'"
        :list="lineList"
        :customize-info="customizeLineInfo"/>
    </srm-popup>

    <!-- 报价明细 -->
    <srm-popup :visible.sync="visibleQuotaion" title="报价明细" height="100%" position="right">
      <detail-line-pop
        v-if="visibleQuotaion"
        :type="'quotaion'"
        :list="lineList"
        :customize-info="customizeLineInfo"/>
    </srm-popup>

    <!-- 评分细则 -->
    <srm-popup :visible.sync="visibleIndicate" title="评分细则" height="50%" rounded>
      <div class="score-indicate">
        {{ customizeInfo.content }}
      </div>
    </srm-popup>
  </section>
</template>

<script>
// import {
//   // getRfxHeader,
//   getRfxHeaderInfoDetail,
//   getRfxItem,
//   getRfxItems,
//   getRfxExperts,
//   getRfxIndics,
//   getRfxItemLines,
//   getRfxSuppliers,
//   getScoreIndicateApi,
//   getExpertAssignedApi,
//   getQuotationDetailApi,
//   getLadderQuotationApi
// } from "../../api/RfxApproveApi";
import {
  // getRfxHeader,
  getRfxHeaderInfoDetail,
  getRfxItem,
  getRfxItems,
  getRfxExperts,
  getRfxIndics,
  getRfxItemLines,
  getRfxSuppliers,
  getScoreIndicateApi,
  getExpertAssignedApi,
  getQuotationDetailApi,
  getLadderQuotationApi
} from "./api/auxs";
import BScroll from "better-scroll";
import DetailPop from "./components/DetailPop";
import DetailLinePop from "./components/DetailLinePop";
import { formatMinutes } from "@/utils/filter";

export default {
  modules: [ "ssrc.inquiryHall", "hipspfm.common", "ssrc.priceLibraryNew", "hipspfm.expertScoring" ],
  name: "AuxRfxApproval",
  components: {
    DetailPop,
    DetailLinePop
  },
  props: {
    changeReqId: {
      type: String | Number,
      default: "",
    }
  },
  data() {
    return {
      // 基础信息 / 采购组织及人员 / 资格预审 / 报价 / 附件 / 标段
      headInfo: {},
      // 标的物(不分标段)
      rfxItemLines: [],
      // 标段(分标段)
      sectionBiding: [],
      // 对供应商的要求
      supplierInfo: [],
      // 专家
      expertInfo: [],
      // 评分要素 - 总
      indicsInfo: [],
      // 评分要素 - 技术
      technologyIndic: [],
      // 评分要素 - 商务
      businessIndic: [],
      // 符合性检查
      scoreIndic: [],
      loading:false,
      scroll: "",
      contentLenArr: [],
      customizeInfo: {},
      customizeLineInfo: {},
      list: [],
      lineList: [],
      visible: false,
      visibleItem: false,
      visibleLadder: false,
      visibleQuotaion: false,
      visibleIndicate: false,
    };
  },
  computed: {
    // 基本信息
    getBaseInfoColumns() {
      let columns = [];

      this.getField("询价基础信息").map((res) => {
        let item = {
          fieldName: res.length > 0 ? res[0] : "",
          fieldCode: res.length > 1 ? res[1] : "",
          langCode: res.length > 2 ? res[2] : "",
          fieldType: "TEXT",
        };

        if (res.length > 3 && res[3]) {
          item["formRow"] = res[3];
        }
        columns.push(item);
      });
      return columns;
    },
    // 采购执行人
    getPurOrganizationColumns() {
      let columns = [];

      this.getField("采购执行人").map((res) => {
        let item = {
          fieldName: res.length > 0 ? res[0] : "",
          fieldCode: res.length > 1 ? res[1] : "",
          langCode: res.length > 2 ? res[2] : "",
          fieldType: "TEXT",
        };

        if (res.length > 3 && res[3]) {
          item["formRow"] = res[3];
        }
        columns.push(item);
      });
      return columns;
    },
    // 标的物
    getRfxItemLines() {
      let columns = [];

      this.getField("标的物").map((res) => {
        let item = {
          fieldName: res.length > 0 ? res[0] : "",
          fieldCode: res.length > 1 ? res[1] : "",
          langCode: res.length > 2 ? res[2] : "",
          fieldType: "TEXT",
          ...this.renderByField(res[1], res[0]),
        };

        if (res.length > 3 && res[3]) {
          item["formRow"] = res[3];
        }
        columns.push(item);
      });
      return columns;
    },
    // 标段
    getSectionBidingColumns() {
      let columns = [];

      this.getField("标段").map((res) => {
        let item = {
          fieldName: res.length > 0 ? res[0] : "",
          fieldCode: res.length > 1 ? res[1] : "",
          langCode: res.length > 2 ? res[2] : "",
          fieldType: "TEXT",
          ...this.renderByField(res[1], res[0]),
        };

        if (res.length > 3 && res[3]) {
          item["formRow"] = res[3];
        }
        columns.push(item);
      });
      return columns;
    },
    // 标的物
    getRfxItemLinesColumns() {
      let columns = [];

      this.getField("标的物").map((res) => {
        let item = {
          fieldName: res.length > 0 ? res[0] : "",
          fieldCode: res.length > 1 ? res[1] : "",
          langCode: res.length > 2 ? res[2] : "",
          fieldType: "TEXT",
          ...this.renderByField(res[1], res[0]),
        };

        if (res.length > 3 && res[3]) {
          item["formRow"] = res[3];
        }
        columns.push(item);
      });
      return columns;
    },
    // 供应商列表
    getSupplierColumns() {
      let columns = [];

      this.getField("供应商列表").map((res) => {
        // 有标段
        if (this.headInfo.projectLineSections && this.headInfo.projectLineSections.length > 0) {
          if (res[0] === "分配物料") {
            return;
          }
        } else if (res[0] === "分配标段") {
          return;
        }
        let item = {
          fieldName: res.length > 0 ? res[0] : "",
          fieldCode: res.length > 1 ? res[1] : "",
          langCode: res.length > 2 ? res[2] : "",
          fieldType: "TEXT",
          ...this.renderByField(res[1], res[0]),
        };

        if (res.length > 3 && res[3]) {
          item["formRow"] = res[3];
        }
        columns.push(item);
      });
      return columns;
    },
    // 资格预审
    getQualificationColumns() {
      let columns = [];

      this.getField("资格预审").map((res) => {
        let item = {
          fieldName: res.length > 0 ? res[0] : "",
          fieldCode: res.length > 1 ? res[1] : "",
          langCode: res.length > 2 ? res[2] : "",
          fieldType: "TEXT",
          ...this.renderByField(res[1], res[0]),
        };

        if (res.length > 3 && res[3]) {
          item["formRow"] = res[3];
        }
        columns.push(item);
      });
      return columns;
    },
    // 报价
    getQuotationColumns() {
      let columns = [];

      this.getField("报价").map((res) => {
        let item = {
          fieldName: res.length > 0 ? res[0] : "",
          fieldCode: res.length > 1 ? res[1] : "",
          langCode: res.length > 2 ? res[2] : "",
          fieldType: "TEXT",
          ...this.renderByField(res[0]),
          ...this.renderByField(res[1], res[0]),
        };

        if (res.length > 3 && res[3]) {
          item["formRow"] = res[3];
        }
        columns.push(item);
      });
      return columns;
    },
    // 专家
    getExpertColumns() {
      let columns = [];

      this.getField("专家").map((res) => {
        let item = {
          fieldName: res.length > 0 ? res[0] : "",
          fieldCode: res.length > 1 ? res[1] : "",
          langCode: res.length > 2 ? res[2] : "",
          fieldType: "TEXT",
        };

        if (res.length > 3 && res[3]) {
          item["formRow"] = res[3];
        }
        columns.push(item);
      });
      return columns;
    },
    // 符合性检查
    getComplianceCheckColumns() {
      let columns = [];

      this.getField("符合性检查").map((res) => {
        let item = {
          fieldName: res.length > 0 ? res[0] : "",
          fieldCode: res.length > 1 ? res[1] : "",
          langCode: res.length > 2 ? res[2] : "",
          fieldType: "TEXT",
          ...this.renderByField(res[1], res[0]),
        };

        if (res.length > 3 && res[3]) {
          item["formRow"] = res[3];
        }
        columns.push(item);
      });
      return columns;
    },
    // 附件
    getAttachColumns() {
      let columns = [];

      this.getField("附件").map((res) => {
        let item = {
          fieldName: res.length > 0 ? res[0] : "",
          fieldCode: res.length > 1 ? res[1] : "",
          langCode: res.length > 2 ? res[2] : "",
          fieldType: "TEXT",
          render: (val, record) =>
            <SrmUpload
              showIcon={false}
              color="blue"
              descTitle={this.$T("ssrc.inquiryHall.view.message.button.view").$D("查看")}
              attachmentUuid={record[res[1]]} />
        };

        if (res.length > 3 && res[3]) {
          item["formRow"] = res[3];
        }
        columns.push(item);
      });
      return columns;
    },
    // 物料
    getItemColumns() {
      let columns = [];

      this.getField("物料").map((res) => {
        let item = {
          fieldName: res.length > 0 ? res[0] : "",
          fieldCode: res.length > 1 ? res[1] : "",
          langCode: res.length > 2 ? res[2] : "",
          fieldType: "TEXT",
          ...this.renderByField(res[1], res[0]),
        };

        if (res.length > 3 && res[3]) {
          item["formRow"] = res[3];
        }
        columns.push(item);
      });
      return columns;
    },
    // 分配物料
    getDistrItemColumns() {
      let columns = [];

      this.getField("分配物料").map((res) => {
        let item = {
          fieldName: res.length > 0 ? res[0] : "",
          fieldCode: res.length > 1 ? res[1] : "",
          langCode: res.length > 2 ? res[2] : "",
          fieldType: "TEXT",
        };

        if (res.length > 3 && res[3]) {
          item["formRow"] = res[3];
        }
        columns.push(item);
      });
      return columns;
    },
    // 评分要素
    getScoreColumns() {
      let columns = [];

      this.getField("评分要素").map((res) => {
        let item = {
          fieldName: res.length > 0 ? res[0] : "",
          fieldCode: res.length > 1 ? res[1] : "",
          langCode: res.length > 2 ? res[2] : "",
          fieldType: "TEXT",
          ...this.renderByField(res[1], res[0]),
        };

        if (res.length > 3 && res[3]) {
          item["formRow"] = res[3];
        }
        columns.push(item);
      });
      return columns;
    },
    // 评分要素细项
    getScoreDetailColumns() {
      let columns = [];

      this.getField("评分要素细项").map((res) => {
        let item = {
          fieldName: res.length > 0 ? res[0] : "",
          fieldCode: res.length > 1 ? res[1] : "",
          langCode: res.length > 2 ? res[2] : "",
          fieldType: "TEXT",
          ...this.renderByField(res[1], res[0]),
        };

        if (res.length > 3 && res[3]) {
          item["formRow"] = res[3];
        }
        columns.push(item);
      });
      return columns;
    },
    // 报价明细头
    getQuotationDetailHeadColumns() {
      let columns = [];

      this.getField("报价明细头").map((res) => {
        let item = {
          fieldName: res.length > 0 ? res[0] : "",
          fieldCode: res.length > 1 ? res[1] : "",
          langCode: res.length > 2 ? res[2] : "",
          fieldType: "TEXT",
          ...this.renderByField(res[1], res[0]),
        };

        if (res.length > 3 && res[3]) {
          item["formRow"] = res[3];
        }
        columns.push(item);
      });
      return columns;
    },
    // 报价明细
    getQuotationDetailColumns() {
      let columns = [];

      this.getField("报价明细").map((res) => {
        let item = {
          fieldName: res.length > 0 ? res[0] : "",
          fieldCode: res.length > 1 ? res[1] : "",
          langCode: res.length > 2 ? res[2] : "",
          fieldType: "TEXT",
        };

        if (res.length > 3 && res[3]) {
          item["formRow"] = res[3];
        }
        columns.push(item);
      });
      return columns;
    },
  },
  async mounted() {
    if (this.changeReqId) {
      try {
        this.$loading.show();
        await this.fetchData();
        await this.fetchRfxItem();
        await this.fetchSupplier();
        await this.fetchIndics();
        await this.fetchExpert();
        this.loading = true;
        this.$loading.hide();
      } catch (err) {
        this.$loading.hide();
      }
    }
    this.$emit("GetApprovalTitle", this.$T("ssrc.inquiryHall.title.rfx.release.approve").$D("询价单发布审批"));
    this.$nextTick(() => {
      this.scroll = new BScroll(this.$refs["wrapper"], {
        scrollY: true,
        eventPassthrough: "horizontal",
        tap: true,
        probeType: 3,
      });
      this.contentLenArr = [
        this.$refs.headInfo.offsetHeight,
      ];
      this.scroll && this.scroll.refresh();
      this.scroll.on("scroll", this.handlerScroll);
    });
  },
  methods: {
    // 获取自定义语言
    getLanguageDefine(key) {
      const languageList = {
        "询价基础信息": this.$T("ssrc.inquiryHall.view.inquiryHall.rfxBasicInfo").$D("询价基础信息"),
        "暂无数据": this.$T("hipspfm.common.view.message.title.noData").$D("暂无数据"),
        "采购组织及人员": this.$T("ssrc.inquiryHall.view.inquiryHall.purOrganizationAndStaff").$D("采购组织及人员"),
        "标的物": this.$T("ssrc.inquiryHall.view.title.rfxItemLines").$D("标的物"),
        "标段": this.$T("ssrc.inquiryHall.view.title.sectionBiding").$D("标段"),
        "对供应商要求": this.$T("ssrc.inquiryHall.view.inquiryHall.supplierWithRequest").$D("对供应商要求"),
        "询价要求": this.$T("ssrc.inquiryHall.view.inquiryHall.rfxDeamnd").$D("询价要求"),
        "资格预审": this.$T("ssrc.inquiryHall.view.message.tab.preQualification").$D("资格预审"),
        "附件": this.$T("ssrc.priceLibraryNew.model.library.attachmentUuid").$D("附件"),
        "评分要素": this.$T("ssrc.inquiryHall.view.message.tab.scoringElements").$D("评分要素"),
        "商务组": this.$T("ssrc.inquiryHall.model.inquiryHall.businessTeam").$D("商务组"),
        "技术组": this.$T("ssrc.inquiryHall.model.inquiryHall.technologyTeam").$D("技术组"),
        "符合性检查": this.$T("ssrc.inquiryHall.view.message.tab.initialReviewIndic").$D("符合性检查"),
        "报价": this.$T("ssrc.inquiryHall.view.message.tab.quotation").$D("报价"),
        "专家": this.$T("ssrc.inquiryHall.view.message.tab.professional").$D("专家"),
        "公司": this.$T("ssrc.inquiryHall.view.inquiryHall.companyName").$D("公司"),
        "需求部门": this.$T("ssrc.inquiryHall.view.inquiryHall.unitName").$D("需求部门"),
        "需求方": this.$T("ssrc.inquiryHall.view.inquiryHall.demandSide").$D("需求方"),
        "采购执行人": this.$T("ssrc.inquiryHall.view.inquiryHall.purchaseExecute").$D("采购执行人"),
        "寻源方式": this.$T("ssrc.inquiryHall.view.inquiryHall.sourceMethodMeaning").$D("寻源方式"),
        "可参与寻源供应商阶段": this.$T("ssrc.inquiryHall.view.inquiryHall.allowSourceSupplierStages").$D("可参与寻源供应商阶段"),
        "寻源类别": this.$T("ssrc.inquiryHall.view.inquiryHall.sourceCategoryMeaning").$D("寻源类别"),
        "寻源准备": this.$T("ssrc.inquiryHall.view.inquiryHall.rfxPrepare").$D("寻源准备"),
        "供应商列表": this.$T("ssrc.inquiryHall.view.tab.supplierList").$D("供应商列表"),
      };

      return languageList[key] || key;
    },
    // 获取自定义配置code
    getCustomizeCode(key) {
      const codeDefine = {
        "询价审批-询价基础信息": "SMBL.WORKFLOW.RFX_APPROVAL_NEW.BASIC",
        "询价审批-资格预审": "SMBL.WORKFLOW.RFX_APPROVAL_NEW.PREQUALIFICATION",
        "询价审批-报价": "SMBL.WORKFLOW.RFX_APPROVAL_NEW.RULE",
        "询价审批-专家": "SMBL.WORKFLOW.RFX_APPROVAL_NEW.EXPERT",
        "询价审批-物料": "SMBL.WORKFLOW.RFX_APPROVAL_NEW.ITEM",
        "询价审批-评分要素": "SMBL.WORKFLOW.RFX_APPROVAL_NEW.SCORE",
        "询价审批-采购执行人": "SMBL.WORKFLOW.RFX_APPROVAL_NEW.PURORGANDSTAFF",
        "询价审批-标的物": "SMBL.WORKFLOW.RFX_APPROVAL_NEW.RFXITEMLINES",
        "询价审批-标段": "SMBL.WORKFLOW.RFX_APPROVAL_NEW.SECTIONBIDING",
        "询价审批-供应商列表": "SMBL.WORKFLOW.RFX_APPROVAL_NEW.SUPPLIER",
        "询价审批-符合性检查": "SMBL.WORKFLOW.RFX_APPROVAL_NEW.SCOREINDIC",
        "询价审批-评分要素细项": "SMBL.WORKFLOW.RFX_APPROVAL_NEW.INDICSINFOLINE",
        "询价审批-附件": "SMBL.WORKFLOW.RFX_APPROVAL_NEW.ATTACHMENT",
      };

      return codeDefine[key] || "";
    },
    // 获取字段
    getField(key) {
      const fieldColumns = {
        "询价基础信息": [
          [ "询价单标题", "rfxTitle", "ssrc.inquiryHall.model.inquiryHall.inquiryTitle", 1 ],
          [ "预算金额", "budgetAmount", "ssrc.inquiryHall.model.inquiryHall.budgetAmount", 2 ],
          [ "寻源模版", "templateName", "ssrc.inquiryHall.model.inquiryHall.templateName", 2 ],
          [ "备注", "rfxRemark", "ssrc.inquiryHall.model.inquiryHall.rfxRemark", 3 ],
        ],
        "需求方": [
          [ "公司", "companyName", "", 1 ],
          [ "需求部门", "unitName", "", 2 ]
        ],
        "采购执行人": [
          [ "采购组织名称", "purOrganizationName", "ssrc.inquiryHall.model.inquiryHall.purOrganizationName", 1 ],
          [ "采购员", "purchaserName", "ssrc.inquiryHall.model.inquiryHall.purchaserName", 2 ],
          [ "采购联系人", "purName", "ssrc.inquiryHall.model.inquiryHall.purName", 2 ],
          [ "联系人电话", "purPhone", "ssrc.inquiryHall.model.inquiryHall.purPhone", 3 ],
          [ "联系人邮箱", "purEmail", "ssrc.inquiryHall.model.inquiryHall.purEmail", 4 ],
          [ "询价员", "rfxByName", "ssrc.inquiryHall.model.inquiryHall.rfxByName", 5 ],
          [ "核价员", "checkedByName", "ssrc.inquiryHall.model.inquiryHall.checkedByName", 5 ],
        ],
        "标的物": [
          [ "规格", "specs", "ssrc.inquiryHall.model.inquiryHall.specs", 1 ],
          [ "物料类别", "itemCategoryName", "ssrc.inquiryHall.model.inquiryHall.itemCategoryName", 1 ],
          [ "需求数量", "rfxQuantity", "ssrc.inquiryHall.model.inquiryHall.rfxQuantity", 2 ],
          [ "单位", "uomName", "ssrc.inquiryHall.model.inquiryHall.uomName", 2 ],
          [ "报价明细", "look", "ssrc.inquiryHall.model.inquiryHall.quotaionDetail", 3 ],
          [ "是否含税", "taxIncludedFlag", "ssrc.inquiryHall.model.inquiryHall.taxIncludedFlag", 4 ],
          [ "税率", "taxRate", "ssrc.inquiryHall.model.inquiryHall.taxRate", 4 ],
          [ "启用阶梯报价", "ladderInquiryFlag", "ssrc.inquiryHall.model.inquiryHall.ladderInquiryFlag", 5 ],
          [ "阶梯报价", "look2", "ssrc.inquiryHall.model.inquiryHall.ladderInquiry", 5 ],
          [ "浮动方式", "floatTypeMeaning", "ssrc.inquiryHall.model.inquiryHall.floatTypeMeaning", 6 ],
          [ "报价幅度", "quotationRange", "ssrc.inquiryHall.model.inquiryHall.quotationRange", 6 ],
          [ "询价单附件", "attachmentUuid", "ssrc.inquiryHall.model.inquiryHall.RFxAttachment", 7 ],
        ],
        "标段": [
          [ "标段预估金额", "sectionEstimatedAmount", "ssrc.inquiryHall.model.inquiryHall.sectionEstimatedAmount", 1 ],
          [ "备注", "sectionRemark", "ssrc.inquiryHall.model.inquiryHall.sectionRemark", 1 ],
          [ "物料", "look", "ssrc.inquiryHall.model.inquiryHall.item", 2 ],
          [ "附件", "sectionAttachmentUuid", "ssrc.inquiryHall.model.inquiryHall.attchment", 2 ]
        ],
        "对供应商要求": [
          [ "寻源方式", "sourceMethodMeaning", "", 1 ],
          [ "可参与寻源供应商阶段", "allowSourceSupplierStages", "", 2 ]
        ],
        "供应商列表": [
          [ "分配标段", "look", "", 3 ],
          [ "分配物料", "look1", "", 3 ],
          [ "价格系数", "priceCoefficient", "ssrc.inquiryHall.model.inquiryHall.priceCoefficient", 1 ],
          [ "生命周期阶段", "stageDescription", "ssrc.inquiryHall.model.inquiryHall.stageDescription", 1 ],
          [ "联系人", "contactName", "ssrc.inquiryHall.model.inquiryHall.contactName", 2 ],
          [ "联系方式", "contactMobilephone", "ssrc.inquiryHall.model.inquiryHall.contactMobilephone", 2 ],
          [ "电子邮箱", "contactMail", "ssrc.inquiryHall.model.inquiryHall.contactMail", 3 ],
        ],
        "寻源准备": [
          [ "寻源类别" ]
        ],
        "资格预审": [
          [ "预审截止时间", "prequalEndDate", "ssrc.inquiryHall.model.inquiryHall.prequalEndDate", 1 ],
          [ "审查方法", "reviewMethodMeaning", "ssrc.inquiryHall.model.inquiryHall.reviewMethodMeaning", 2 ],
          [ "预审小组组长", "pretrialGroupMain", "ssrc.inquiryHall.model.inquiryHall.pretrialGroupMain", 3 ],
          [ "预审小组成员", "pretrialGroupMember", "ssrc.inquiryHall.model.inquiryHall.pretrialGroupMember", 4 ],
          [ "评分细项", "look", "", 5 ],
          [ "资格预审文件", "prequalAttachmentUuid", "ssrc.inquiryHall.model.inquiryHall.prequalFile", 5 ],
          [ "备注", "rfxRemark", "ssrc.inquiryHall.model.inquiryHall.rfxRemark", 6 ],
        ],
        "报价": [
          [ "发布即开始", "startFlag", "ssrc.inquiryHall.model.inquiryHall.startFlag", 1 ],
          [ "报价运行时间", "quotRunningDuration", "ssrc.inquiryHall.model.inquiryHall.quotRunningDuration", 2 ],
          [ "密封报价", "sealedQuotationFlag", "ssrc.inquiryHall.model.inquiryHall.sealedQuotationFlag", 3 ],
          [ "报价方式", "quotationTypeMeaning", "ssrc.inquiryHall.model.inquiryHall.quotationTypeMeaning", 3 ],
          [ "币种", "currencyCode", "ssrc.inquiryHall.model.inquiryHall.currencyCode", 4 ],
          [ "允许多币种报价", "multiCurrencyFlag", "ssrc.inquiryHall.model.inquiryHall.allowMuitiCurQuo", 4 ],
          [ "报价范围", "quotationScopeMeaning", "ssrc.inquiryHall.model.inquiryHall.quotationScopeMeaning", 5 ],
          [ "付款方式", "paymentTypeName", "ssrc.inquiryHall.model.inquiryHall.paymentTypeName", 5 ],
          [ "付款条款", "paymentTermName", "ssrc.inquiryHall.model.inquiryHall.paymentTermName", 6 ],
          [ "允许修改付款方式", "paymentTermFlag", "ssrc.inquiryHall.model.inquiryHall.allowAlterPaymnetTypeTerm", 6 ],
          [ "招标文件费(元)", "bidFileExpense", "ssrc.inquiryHall.model.inquiryHall.bidFileExpense", 7 ],
          [ "保证金(元)", "bidBond", "ssrc.inquiryHall.model.inquiryHall.bidBond", 7 ],
          [ "最少报价供应商数", "minQuotedSupplier", "ssrc.inquiryHall.model.inquiryHall.minQuotedSupplier", 8 ],
          [ "是否采集", "centralPurchaseFlag", "ssrc.inquiryHall.model.inquiryHall.centralPurchaseFlag", 8 ],
          [ "允许供应商修改税率", "taxChangeFlag", "ssrc.inquiryHall.model.inquiryHall.taxChangeFlag", 9 ],
          [ "允许供应商连续报价", "continuousQuotationFlag", "ssrc.inquiryHall.model.inquiryHall.continuousQuotationFlag", 9 ],
          [ "允许供应商修改可供数量", "quantityChangeFlag", "ssrc.inquiryHall.model.inquiryHall.quantityChangeFlag", 10 ],
          [ "允许供应商自定义阶梯报价", "diyLadderQuotationFlag", "ssrc.inquiryHall.model.inquiryHall.diyLadderQuotationFlags", 11 ],
          [ "发票类型", "invoiceType", "ssrc.inquiryHall.model.inquiryHall.invoiceType", 12 ],
        ],
        "专家": [
          [ "职责", "evaluateLeaderFlagMeaning", "ssrc.inquiryHall.model.inquiryHall.evaluateLeaderFlagMeaning", 1 ],
          [ "本次评分类别", "teamMeaning", "ssrc.inquiryHall.model.inquiryHall.teamMeaning", 1 ],
          [ "专家类型", "expertCategoryMeaning", "ssrc.inquiryHall.model.inquiryHall.expertCategoryMeaning", 2 ],
          [ "联系电话", "phone", "ssrc.inquiryHall.model.inquiryHall.phone", 2 ],
          [ "邮箱", "email", "ssrc.inquiryHall.model.inquiryHall.email", 3 ],
        ],
        "符合性检查": [
          [ "要素类型", "indicateTypeMeaning", "ssrc.inquiryHall.model.inquiryHall.indicateTypeMeaning", 1 ],
          [ "必须通过", "mustApprovedFlag", "ssrc.inquiryHall.model.inquiryHall.mustApprovedFlag", 1 ],
          [ "分配专家", "look", "ssrc.inquiryHall.model.inquiryHall.assignExpert", 2 ],
        ],
        "评分要素": [
          [ "权重", "weight", "ssrc.inquiryHall.model.inquiryHall.weight", 1 ],
          [ "最低分", "minScore", "ssrc.inquiryHall.model.inquiryHall.minScore", 1 ],
          [ "最高分", "maxScore", "ssrc.inquiryHall.model.inquiryHall.maxScore", 2 ],
          [ "评分要素细项", "look", "ssrc.inquiryHall.model.inquiryHall.detailEnabledFlag", 2 ],
          [ "分配专家", "look1", "ssrc.inquiryHall.model.inquiryHall.assignExpert", 3 ],
          [ "评分细则", "look2", "ssrc.inquiryHall.model.inquiryHall.indicateRemark", 3 ],
        ],
        "评分要素细项": [
          [ "评分细则", "rfxLineItemNum", "ssrc.inquiryHall.model.inquiryHall.rfxLineItemNum" ],
          [ "最低分", "minScore", "ssrc.inquiryHall.model.inquiryHall.minScore" ],
          [ "最高分", "maxScore", "ssrc.inquiryHall.model.inquiryHall.maxScore" ],
          [ "缺省分", "defaultScore", "ssrc.inquiryHall.model.inquiryHall.defaultScore" ],
        ],
        "附件": [
          [ "商务附件", "businessAttachmentUuid", "ssrc.inquiryHall.model.inquiryHall.businessAttachments", 1 ],
          [ "技术附件", "techAttachmentUuid", "ssrc.inquiryHall.model.inquiryHall.techAttachments", 1 ],
        ],
        "物料": [
          [ "业务实体", "ouName", "ssrc.inquiryHall.model.inquiryHall.ouName", 1 ],
          [ "库存组织", "invOrganizationName", "ssrc.inquiryHall.model.inquiryHall.invOrganizationName", 2 ],
          [ "规格", "specs", "ssrc.inquiryHall.model.inquiryHall.specs", 3 ],
          [ "物料类别", "itemCategoryName", "ssrc.inquiryHall.model.inquiryHall.itemCategoryName", 3 ],
          [ "需求数量", "rfxQuantity", "ssrc.inquiryHall.model.inquiryHall.rfxQuantity", 4 ],
          [ "单位", "uomName", "ssrc.inquiryHall.model.inquiryHall.uomName", 4 ],
          [ "预估单价(含税)", "netEstimatedPrice", "ssrc.inquiryHall.model.inquiryHall.netEstimatedPrice", 5 ],
          [ "预估单价(未税)", "netPrice", "ssrc.inquiryHall.model.inquiryHall.netPrice", 5 ],
          [ "报价明细", "look", "ssrc.inquiryHall.model.inquiryHall.quotaionDetail", 6 ],
          [ "价格批量", "batchPrice", "ssrc.inquiryHall.model.inquiryHall.batchPrice", 6 ],
          [ "是否含税", "taxIncludedFlag", "ssrc.inquiryHall.model.inquiryHall.taxIncludedFlag", 7 ],
          [ "税率", "taxRate", "ssrc.inquiryHall.model.inquiryHall.taxRate", 7 ],
          [ "启用阶梯报价", "ladderInquiryFlag", "ssrc.inquiryHall.model.inquiryHall.ladderInquiryFlag", 8 ],
          [ "阶梯报价", "look2", "ssrc.inquiryHall.model.inquiryHall.ladderInquiry", 8 ],
          [ "浮动方式", "floatTypeMeaning", "ssrc.inquiryHall.model.inquiryHall.floatTypeMeaning", 9 ],
          [ "报价幅度", "quotationRange", "ssrc.inquiryHall.model.inquiryHall.quotationRange", 9 ],
          [ "报价有效期从", "quotationStartDate", "ssrc.inquiryHall.model.inquiryHall.quotationStartDate", 10 ],
          [ "报价有效期至", "quotationEndDate", "ssrc.inquiryHall.model.inquiryHall.quotationEndDate", 11 ],
          [ "询价单附件", "attachmentUuid", "ssrc.inquiryHall.model.inquiryHall.RFxAttachment", 12 ],
          [ "供应商料号", "supplierItemNumDesc", "ssrc.inquiryHall.model.inquiryHall.supplierItemNumDesc", 12 ],
        ],
        "分配物料": [
          [ "最低限价", "minLimitPrice", "ssrc.inquiryHall.model.inquiryHall.minLimitPrice", 1 ],
          [ "最高限价", "maxLimitPrice", "ssrc.inquiryHall.model.inquiryHall.maxLimitPrice", 2 ],
        ],
        "报价明细": [
          [ "数量", "configQuantity", "ssrc.inquiryHall.model.inquiryHall.configQuantity", 1 ],
          [ "单价", "configUnitPrice", "ssrc.inquiryHall.model.inquiryHall.configUnitPrice", 2 ],
          [ "总价", "configCost", "ssrc.inquiryHall.model.inquiryHall.configCost", 3 ],
          [ "备注", "remark", "ssrc.inquiryHall.model.inquiryHall.remark", 4 ],
        ],
        "报价明细头": [
          [ "附件必传", "attachmentNeedFlag", "ssrc.inquiryHall.model.inquiryHall.attachmentNeedFlag", 1 ],
          [ "允许供应商新建明细行", "allowCreateFlag", "ssrc.inquiryHall.model.inquiryHall.allowCreateFlag", 2 ],
          [ "采购方附件上传", "attachmentUuid", "ssrc.inquiryHall.model.inquiryHall.purchaseAttachmentUpload", 3 ],
        ]
      };

      return fieldColumns[key];
    },
    // 根据字段判断输出样式
    renderByField(field, attachId = "") {
      if (!field) {
        return {};
      }
      if (field.indexOf("Flag") > -1) {
        return {
          render: (val) => <span>{val ? "是" : "否"}</span>
        };
      }
      if (field.indexOf("look") > -1 || field === "look") {
        return {
          render: () => <span style="color: blue">
            {this.$T("ssrc.inquiryHall.view.message.button.view").$D("查看")}
          </span>,
          callBack: (record) => {
            this.lookSomePop(attachId, record);
          }
        };
      }
      if (field.indexOf("元") > -1) {
        return {
          render: (val) => <span>{val ? val : "免费"}</span>
        };
      }
      if (field === "报价运行时间") {
        return {
          render: (val, record) => {
            <span>{formatMinutes(record.startQuotationRunningDuration)}</span>;
          }
        };
      }
      if (field.indexOf("Uuid") > -1) {
        return {
          render: (val, record) =>
            <SrmUpload
              showIcon={false}
              color="blue"
              descTitle={this.$T("ssrc.inquiryHall.view.message.button.view").$D("查看")}
              attachmentUuid={record[attachId]} />
        };
      }
      return {};
    },
    // 基本信息
    async fetchData() {
      await getRfxHeaderInfoDetail(this.changeReqId, {}).then((res = {}) => {
        this.headInfo = res.rfxHeader || {};
        // 标段
        if (this.headInfo.projectLineSections && this.headInfo.projectLineSections.length > 0) {
          this.sectionBiding = [ ...this.headInfo.projectLineSections ];
        }
      });
      // await getRfxHeader(this.changeReqId, {
      //   "customizeUnitCode":"SSRC.INQUIRY_HALL_DETAIL.HEADER_DETAIL,SSRC.INQUIRY_HALL_DETAIL.HEADER_PREQUAL"
      // }).then((res) => {
      //   this.headInfo = res;
      //   // 标段
      //   if (this.headInfo.projectLineSections && this.headInfo.projectLineSections.length > 0) {
      //     this.sectionBiding = [ ...this.headInfo.projectLineSections ];
      //   }
      // });
    },
    // 标的物
    async fetchRfxItem() {
      await getRfxItemLines({
        page: 0,
        size: 10,
        customizeUnitCode: "SSRC.INQUIRY_HALL_DETAIL.ITEM_LINE",
        rfxHeaderId: this.changeReqId
      }).then((res) => {
        if (res && res.content.length > 0) {
          this.rfxItemLines = [ ...res.content ];
        }
      });
    },
    // 对供应商的要求
    async fetchSupplier() {
      const params = {
        page: 0,
        size: 100,
      };

      await getRfxSuppliers(this.changeReqId, params).then((res) => {
        if (res && res.content.length > 0) {
          this.supplierInfo = [ ...res.content ];
        }
      });
    },
    // 专家
    async fetchExpert() {
      await getRfxExperts(this.changeReqId).then((res) => {
        this.expertInfo = res.evaluateExpertList;
      });
    },
    // 评分要素
    async fetchIndics() {
      await getRfxIndics(this.changeReqId).then((res) => {
        this.scoreIndic = res.initialReviewIndicList;
        this.indicsInfo = res.otherIndicList;
        this.technologyIndic = res.technologyIndicList;
        this.businessIndic = res.businessIndicList;
      });
    },
    // 滚动事件
    handlerScroll({ x, y }) {
      this.$handlerScroll(x, y, this);
    },
    // 查看 XXX 弹框
    async lookSomePop(name, val = {}) {
      switch (name) {
      case "物料":
        await getRfxItem(this.changeReqId, val.projectLineSectionId).then((res) => {
          if (res && res.content.length > 0) {
            this.list = [ ...res.content ];
          } else {
            this.list = [];
          }
          this.customizeInfo = {
            getColumns: this.getItemColumns,
            code: this.getCustomizeCode("询价审批-物料")
          };
          this.visibleItem = true;
        });
        break;
      case "分配物料":
        await getRfxItems({
          rfxHeaderId: this.changeReqId,
          rfxLineSupplierId: val.rfxLineSupplierId,
        }
        ).then((res) => {
          if (res.length > 0) {
            this.list = [ ...res ];
          } else {
            this.list = [];
          }
          this.customizeInfo = {
            getColumns: this.getDistrItemColumns,
            code: "",
            name: "分配物料"
          };
          this.visible = true;
        });
        break;
      case "分配专家":
        await getExpertAssignedApi({
          page:0,
          size: 100,
          evaluateIndicId: val.evaluateIndicId,
          evaluateIndicCategory: val.evaluateIndicCategory,
          sourceHeaderId: this.changeReqId,
        }).then((res) => {
          if (res.length > 0) {
            this.list = [ ...res ];
          } else {
            this.list = [];
          }
          this.customizeInfo = {
            getColumns: "",
            code: "",
            name: "分配专家"
          };
          this.visible = true;
        });
        break;
      case "评分细则":
        this.customizeInfo = {
          content: val.indicateRemark
        };
        this.visibleIndicate = true;
        break;
      case "报价明细":
        await getQuotationDetailApi(this.changeReqId, {
          page: 0,
          size: 10,
          itemCategoryId: val.itemCategoryId,
          itemId: val.itemId,
          rfxLineItemId: val.rfxLineItemId,
          sourceFrom: "RFX"
        }).then((res) => {
          if (res && res.templateNum) {
            if (res.supQuotationDetailPage && res.supQuotationDetailPage.content && res.supQuotationDetailPage.content.length > 0) {
              this.lineList = [ ...res.supQuotationDetailPage.content ];
            } else {
              this.lineList = [];
            }
            this.customizeLineInfo = {
              getHeadColumns: this.getQuotationDetailHeadColumns,
              getColumns: this.getQuotationDetailColumns,
              HeadCode: "",
              code: "",
              name: "报价明细",
              headInfo: {
                templateNum: res.templateNum,
                templateName: res.templateName
              }
            };
            this.visibleQuotaion = true;
          }
        });
        break;
      case "分配标段":
        this.list = this.sectionBiding && this.sectionBiding.length > 0 ? [ ...this.sectionBiding ] : [];
        this.customizeInfo = {
          getColumns: "",
          code: "",
          name: "分配标段"
        };
        this.visible = true;
        break;
      case "评分细项":
        await getScoreIndicateApi(val.prequalHeaderId)
          .then((res) => {
            if (res.length > 0) {
              this.list = [ ...res ];
            } else {
              this.list = [];
            }
            this.customizeInfo = {
              getColumns: this.getScoreDetailColumns,
              code: "",
              name: "评分细项"
            };
            this.visible = true;
          });
        break;
      case "评分要素细项":
        this.list = val.children;
        this.customizeInfo = {
          getColumns: this.getScoreDetailColumns,
          code: "",
          name: "评分细项"
        };
        this.visible = true;
        break;
      case "阶梯报价":
        await getLadderQuotationApi(val.rfxLineItemId).then((res) => {
          if (res && res.content.length > 0) {
            this.lineList = [ ...res.content ];
          } else {
            this.lineList = [];
          }
          this.customizeLineInfo = {
            getColumns: [
              {
                fieldName: this.$T("").$D("价格"),
                fieldType: "EMPTY",
                fieldCode: "price",
                formRow: 1,
                render: (value, record) => {
                  if (record.ladderFrom && record.ladderTo) {
                    return <span>{`${record.ladderFrom}至${record.ladderTo}`}</span>;
                  } else if (record.ladderTo) {
                    return <span>{`0至${record.ladderTo}`}</span>;
                  }
                  return <span>{`${record.ladderFrom}以上`}</span>;
                },
              },
              {
                fieldName: this.$T("").$D("备注"),
                fieldType: "TEXT",
                fieldCode: "remark",
                formRow: 1,
              },
            ],
            code: "",
            headInfo: {
              itemCode: val.itemCode,
              itemName: val.itemName
            }
          };
          this.visibleLadder = true;
        });
        break;
      default:
        // console.log(val);
        break;
      }
    }
  },
};
</script>

<style scoped lang="stylus">
.score-indicate {
  margin: 16px 15px;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #333333;
  line-height: 20px;
}
.mainDetail {
  .contentWrap {
    font-family: PingFangSC-Medium;
    height: calc(100vh - 230px);
    overflow: hidden;

    .content {
      >>> .srm-tab-pane-title {
        background: var(--color-border-default) !important;
      }
      .headInfo {
        ul {
          padding: 12px 0 12px 15px;
          font-family: auto;
          li {
            font-family: PingFangSC-Medium;
            font-size: 14px;
            color: #333333;
            line-height: 20px;
            margin-bottom: 8px !important;
          }
          li:last-child {
            margin-bottom: 0px !important;
          }
          .titel {
            position: relative;
            font-family: PingFangSC-Semibold;
          }
          .field {
            font-weight: normal;
            font-size: 14px;
            color: #333333;
            line-height: 20px;
            margin-bottom: 8px !important;
          }
          .card {
            padding-bottom: 12px;
            padding-top: 12px;
            border-bottom: 1px solid var(--color-border-default);
            &:last-child {
              border-bottom: 0px;
            }
          }
          .block {
            width: 6px;
            height: 12px;
            border-radius: 1px;
            background-color: var(--color-other-default-b);
            position: absolute;
            left: -15px;
            top: 2px;
          }
          .field {
            font-weight: normal;
          }
        }

        >>> .customize-item {
          margin-top: 0px !important;
          margin-bottom: 8px !important;
          &:last-child  {
            margin-bottom: 0px !important;
          }
        }
        >>> .customize-item-field {
          color: var(--color-font-default);
        }
      }
    }
  }
}
</style>
