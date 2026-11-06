<template>
  <div class="supplier-container">
    <hips-nav-bar slot="header" :have-border="false" class="supplier-header">
      <div slot="center" class="supplier-center">{{ $T("hipspfm.common.message.select").$D("选择") }}{{ $T(title).$D(title) }}</div>
      <div slot="right" class="cancel" @click="showSupplierPop">
        <img class="image-gray-default" src="@/assets/Comp/icon_screenlist_delete_normal@3x.png" alt="">
      </div>
    </hips-nav-bar>
    <hips-search
      v-model="supplierInput"
      class="supplier-search"
      :placeholder="$T('hipspfm.common.message.pleaseEnter').$D('请输入')+$T(title).$D(title)+$T('hipspfm.common.message.nameQuery').$D('名称查询')"
      show-clear-button
      enter-key
      search-icon-position="left"
      @on-search="handleSearch"
      @on-change="handleInputChange"/>
    <!-- 可滚动 -->
    <div v-if="supplierArr.length != 0" class="scroll-wrap">
      <hips-scroll
        ref="scroll"
        :data="[supplierArr]"
        :scroll-options="scrollOption"
        @pulling-down="getSupplierRefresh()"
        @pulling-up="getSupplierMore($refs.scroll)">
        <div class="supplier-list">
          <hips-checkbox-group
            v-model="supplierValue"
            :checkbox-border="false"
            max="1">
            <hips-checkbox
              v-for="(item,index) in supplierArr"
              :key="index"
              :option="JSON.stringify(item)">
              <!-- 供应商 -->
              <div v-if="item.supplierName">
                <i style="fontSize: 16px;">{{ item.supplierName }}</i>
                <span class="supplier-code">{{ item.supplierNum }}</span>
              </div>
              <div v-else-if="item.supplierCompanyName">
                <i style="fontSize: 16px;">{{ item.supplierCompanyName }}</i>
                <span class="supplier-code">{{ item.supplierCompanyId }}</span>
              </div>
              <!-- 申请人 -->
              <div v-else-if="item.name" >
                <i style="fontSize: 16px;">{{ item.name }}</i>
                <span class="supplier-code">{{ item.employeeNum }}</span>
              </div>
              <!-- 客户 -->
              <div v-else-if="item.companyName" >
                <i style="fontSize: 16px;">{{ item.companyName }}</i>
                <span class="supplier-code">{{ item.companyNum }}</span>
              </div>
              <!-- 调查表模板 -->
              <div v-else-if="item.templateCode">
                <i style="fontSize: 16px;">{{ item.templateName }}</i>
                <span class="supplier-code">{{ item.templateCode }}</span>
              </div>
              <!-- 供应商分类 -->
              <div v-else-if="item.categoryDescription">
                <i style="fontSize: 16px;">{{ item.categoryDescription }}</i>
                <span class="supplier-code">{{ item.categoryCode }}</span>
              </div>
              <!-- 默认 -->
              <div v-else>
                <i style="fontSize: 16px;"/>
                <span class="supplier-code"/>
              </div>
            </hips-checkbox>
          </hips-checkbox-group>
        </div>
      </hips-scroll>
    </div>
    <div v-else-if="supplierArr.length===0&&!supplierLoading" class="scroll-wrap noContent" >
      <img class="image-gray-default" src="@/assets/NoResult@3x.png" alt >
      <p>{{ $T("hipspfm.common.validation.noQueryResults").$D("无筛选结果") }}</p>
    </div>
    <!-- 可滚动 -->
    <div class="supplier-confirm" @click="confirmSupplier">
      <span>{{ $T("hipspfm.common.button.confirm").$D("确认") }}</span>
    </div>
  </div>
</template>

<script>
import
{
  View,
  NavBar,
  Tabs,
  Tab,
  Search,
  Scroll,
  Popup,
  Icon,
  Switch,
  Checkbox,
  CheckboxGroup,
} from "hips";
export default {
  modules: [ "hipspfm.common" ],
  name: "SelectSupplier",
  components: {
    [View.name]: View,
    [NavBar.name]: NavBar,
    [Tabs.name]: Tabs,
    [Tab.name]: Tab,
    [Search.name]: Search,
    [Scroll.name]: Scroll,
    [Switch.name]: Switch,
    [Popup.name]: Popup,
    [Icon.name]: Icon,
    [Checkbox.name]: Checkbox,
    [CheckboxGroup.name]: CheckboxGroup,
  },
  props: {
    "showSupplierPop":{
      type: Function,
    },
    "supplierArr":{
      type: Array,
    },
    "getSupplierRefresh":{
      type: Function
    },
    "getSupplierMore": {
      type: Function
    },
    "getSupplier": {
      type: Function
    },
    "title": {
      type: String,
      default: "hipspfm.common.message.supplier"
    },
    "clearFlag": {
      type: Boolean,
      default: false,
    },
    "supplierLoading": {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      supplierInput: "", //供应商输入
      supplierValue: [], //供应商选中的值
    };
  },
  watch:{
    clearFlag(nValue) {
      if (nValue) {
        this.supplierValue = [];
      }
    }
  },
  methods: {
    //搜索供应商
    handleSearch() {
      this.getSupplier(this.supplierInput);
    },
    //监听供应商改变
    handleInputChange() {
      if (!this.supplierInput.length) {
        this.getSupplier(this.supplierInput);
      }
    },
    //确认供应商选择
    confirmSupplier() {
      console.log(this.supplierValue);
      this.$emit("GetSupplier", this.supplierValue);
      this.showSupplierPop();
    },
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
  .supplier-search {
    padding: 0px 20px;
    margin-top: 6px;
    margin-bottom:6px;
    >>> .hips-search__input {
      border: 1px solid #C6CAD6;
      border-radius: 16px;
      background-color: #0000;
    }
    >>> .hips-input__input-value input{
      font-size:16px
      line-height:23px;
      padding-left: 16px;
      margin: 5px 0px;
      background-color: #0000;
      font-size: 16px;
    }
  }
  .scroll-wrap {
    height: calc(100% - 26vw);
    .supplier-list {
      margin-top: 8px;
      font-size: 16px;
      .supplier-code {
        font-size: 12px;
        color:var(--color-font-default-b);
        margin-left: 5px;
      }
    }
  }
  .supplier-confirm {
    width: 100%;
    height: 49px;
    line-height: 49px;
    background:var(--color-bg-default);
    border-top:1px solid var(--color-border-default);
    text-align: center;
    font-size: 18px;
    color: var(--color-other-default-b);
    z-index: 1000;
    position absolute;
    bottom: 0;
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
</style>
