<!-- eslint-disable rulesdir/no_hips -->
<template>
  <hips-popup v-model="value"
              style="height:76%;width:100%"
              position="bottom"
              class="top-boder-radius"
              :overlay-on-click-close="false"
              @click-overlay="closePop">
    <div class="supplier-container">
      <hips-nav-bar slot="header" :have-border="false" class="supplier-header">
        <div slot="center" class="supplier-center">{{ title }}</div>
        <div slot="right" class="cancel" @click="$emit('input',false)">
          <img class="image-gray-default" src="@/assets/icon_screenlist_delete_normal@3x.png" alt="">
        </div>
      </hips-nav-bar>
      <!-- 搜索组件 -->
      <div class="supplier-search">
        <searchs
          v-model="lovParams.searchValue"
          :handle-search="handleSearch"
          :handle-input-change="handleInputChange"
          :placeholder="$T('hipspfm.common.message.pleaseEnter').$D('请输入')+queryFieldsName[2]+$T('hipspfm.common.message.search').$D('查询')"/>
      </div>
      <!-- 列表 -->
      <div v-if="listData.length" class="scroll-wrap">
        <hips-scroll
          ref="lovScroll"
          :data="[listData]"
          :scroll-options="loadMoreFlag?scrollOption:{}"
          @pulling-down="loadRefresh"
          @pulling-up="loadMore">
          <div class="supplier-list">
            <hips-checkbox-group
              v-model="checkedValue"
              :checkbox-border="false"
              :max="multiple?'Infinity':1">
              <hips-checkbox
                v-for="(item,index) in listData"
                :key="index"
                :option="{value: item}">
                <!-- <div>
                  <i style="fontSize: 16px;">{{ item[queryFields[1]] }}</i>
                  <span class="supplier-code">{{ item[queryFields[0]] }}</span>
                </div> -->
                <div class="info">
                  <div class="info-title">{{ item[queryFields[1]] }}</div>
                  <div class="info-detail">
                    <span>{{ $T("ssrc.supplierQuotation.model.supQuo.taxRate").$D("税率（%）") }}：{{ item[queryFields[2]] }}%</span>
                    <span>{{ $T("hipspfm.supplierQuotation.model.supplierQuotation.taxCode").$D("税种代码") }}：{{ item[queryFields[0]] }}</span>
                  </div>
                </div>
              </hips-checkbox>
            </hips-checkbox-group>
          </div>
        </hips-scroll>
      </div>
      <!-- 空白页 -->
      <div v-else-if="!listData.length&&!loading" class="scroll-wrap noContent">
        <img src="@/assets/NoResult@3x.png" alt >
        <p>{{ $T("hipspfm.common.message.noScreenResults").$D("无筛选结果") }}</p>
      </div>
      <!-- 底部确认 -->
      <div class="supplier-confirm" @click="submitValue">
        <span>{{ $T("hipspfm.common.button.confirm").$D("确认") }}</span>
      </div>
    </div>
  </hips-popup>
</template>

<script>

import
{
  View,
  NavBar,
  Scroll,
  Popup,
  Checkbox,
  CheckboxGroup,
} from "hips";
import { http } from "srm-mobile-ui";
import { queryStr } from "@/utils";
import Searchs from "@/components/Searchs";
export default {
  modules: [ "hipspfm.common", "ssrc.supplierQuotation", "hipspfm.supplierQuotation" ],
  name: "Lov",
  components: {
    Searchs,
    [View.name]: View,
    [NavBar.name]: NavBar,
    [Scroll.name]: Scroll,
    [Popup.name]: Popup,
    [Checkbox.name]: Checkbox,
    [CheckboxGroup.name]: CheckboxGroup,
  },
  props: {
    "code": {
      type: String,
      default: "",
    },
    "clearFlag": {
      type: Boolean,
      default: false,
    },
    "value": {
      type: Boolean,
      default: false,
    },
    //是否开启多选
    "multiple": {
      type: Boolean,
      default: false,
    },
    //是否开启上拉加载/下拉刷新
    "loadMoreFlag": {
      type: Boolean,
      default: true,
    },
    "queryParams": {
      type: Object,
      default: () => ({}),
    },
    // 是否反转名称和编码顺序
    "reverse":{
      type: Boolean,
      default:false,
    },
    // 是否需要刷新
    "refresh": {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      title: "",
      loading: false,
      listData: [], //LOV接口的值
      TotalCount: 0, //数据总数
      checkedValue: [], //LOV选中的值
      lovSearchUrl: "", //LOV搜索地址
      queryFields: [], //LOV搜索查找字段
      queryFieldsName: [], //LOV搜索查找字段名
      lovParams: { //LOV筛选条件
        page: 0,
        size: 10,
        searchValue: "",
      },
      // scrollOption: {
      //   pullDownRefresh: {
      //     threshold: 60,
      //     stop: 40,
      //     txt: "刷新成功",
      //   },
      //   pullUpLoad: {
      //     txt: {
      //       more: "上拉加载更多",
      //       noMore: "已经到底啦~",
      //     },
      //   },
      // },
    };
  },
  watch:{
    clearFlag() {
      if (this.clearFlag) {
        this.checkedValue = [];
      }
    },
    refresh(val) {
      if (val) {
        this.loadRefresh();
      }
    }
  },
  async mounted() {
    const lovInfo = await this.getLovInfo();
    if (this.reverse) {
      lovInfo.queryFields = lovInfo.queryFields.reverse();
    }
    this.title = lovInfo.title;
    this.lovSearchUrl = lovInfo.queryUrl.replace(/\{organizationId\}/g, window.localStorage.organizationId);
    this.queryFields = lovInfo.queryFields.map((item) => item.field);
    this.queryFieldsName = lovInfo.queryFields.map((item) => item.label);
    this.fetchData();
  },
  methods: {
    // 获取Lov配置信息
    getLovInfo() {
      const url = `hpfm/v1/lov-view/info?viewCode=${this.code}`;
      return http.get(url);
    },
    // 获取Lov数据信息
    // eslint-disable-next-line no-unused-vars
    getLovList({ page, size, searchValue }) {
      const joinSymbol = this.lovSearchUrl.includes("?") ? "&" : "?";
      const url = `${this.lovSearchUrl}${joinSymbol}page=${page}&size=10&${this.queryFields[2]}=${searchValue}&${queryStr(this.queryParams)}`;
      return http.get(url);
    },
    //搜索供应商
    handleSearch() {
      this.lovParams.page = 0;
      this.listData = [];
      this.fetchData();
    },
    //监听供应商改变
    handleInputChange() {
      if (!this.lovParams.searchValue.length) {
        this.handleSearch();
      }
    },
    //确认选择值
    submitValue() {
      this.$emit("input", false);
      this.$emit("submitValue", this.checkedValue);
    },
    // 获取Lov数据
    fetchData() {
      this.loading = true;
      this.$loading.show();
      this.getLovList(this.lovParams).then((res) => {
        this.loading = false;
        this.$loading.hide();
        this.listData = [ ...this.listData, ...res.content ];
        this.TotalCount = res.totalElements;
      });
    },
    // LOV下拉刷新
    async loadRefresh() {
      this.listData = [];
      this.lovParams.page = 0;
      await this.fetchData();
    },
    //LOV上拉加载
    async loadMore() {
      if (this.listData.length < this.TotalCount) {
        this.lovParams.page++;
        await this.fetchData();
      } else {
        this.$nextTick(() => {
          this.$refs.lovScroll.forceUpdate();
        });
      }
    },
    closePop() {
      this.$emit("input", false);
    }
  },
};
</script>

<style lang="stylus" scoped>
.supplier-container {
  position relative
  height: 100%;
  .supplier-header {
    height: 48px;
    .supplier-center {
      font-size: 18px;
      line-height 26px;
      color:var(--color-font-default);
    }
    .cancel {
      color:var(--color-font-default-b);
      margin-right: 22.8px;
    }
  }
  .supplier-search{
    margin-top: 6px;
  }
  .scroll-wrap {
    padding-bottom: 50px;
    height: calc(100% - 26vw);
    .supplier-list {
      margin-top: 8px;
      font-size: 16px;
      .supplier-code {
        font-size: 12px;
        color:var(--color-font-default-b);
        margin-left: 5px;
      }

      .info{
        width: 88%;
        .info-title{
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 16px;
          line-height: 24px;
          margin-bottom: 2px;
        }
        .info-detail{
          span{
            font-size: 14px;
            line-height: 22px;
          }
          span:nth-child(1){
            display: inline-block;
            width: 80px;
          }
          span:nth-child(2){
            color:var(--color-font-default-b);
          }
        }
      }
    }
  }
  .noContent{
      display:flex;
      flex-direction: column;
      align-items: center;
      img{
        margin-top:40px;
        width:200px;
        height:200px;
      }
      p{
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: var(--color-font-default-e);
        letter-spacing: 0;
        text-align: center;
        line-height: 22px;
      }
    }
  .supplier-confirm {
    width: 100%;
    height: 49px;
    line-height: 49px;
    background:var(--color-bg-default);
    text-align: center;
    font-size: 18px;
    color: var(--color-other-default-b);
    z-index: 1000;
    position absolute;
    bottom: 0;
  }
}
</style>
