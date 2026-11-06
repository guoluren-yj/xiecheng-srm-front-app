<template>
  <srm-popup
    :visible="value"
    :title="$T('ssrc.bidHall.view.title.query.bidMembers').$D('查看招标小组')"
    @onClose="$emit('input',false)">
    <ul v-if="tenderingGroupInfo.length">
      <li v-for="(item,index) in tenderingGroupInfo" :key="index">
        <customize :need-padding="true" :columns="getTenderingGroupColumns" :data-source="item"/>
      </li>
    </ul>
    <no-content v-else img-src="NoResult@3x.png" />
  </srm-popup>
</template>

<script>
import NoContent from "@/components/NoContent";
import { SrmListHeader } from "srm-mobile-ui";
export default {
  modules: [ "ssrc.bidHall", "ssrc.planToInquiry", "ssrc.inquiryHall", "smodr.frightLine" ],
  name: "TenderingGroup",
  components: {
    NoContent,
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    tenderingGroupInfo: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {};
  },
  computed:{
    getTenderingGroupColumns() {
      const columns = [
        {
          fieldCode: "rfxTitle",
          fieldType:"EMPTY",
          formRow:0,
          render:(val, record) => <SrmListHeader showOpenTag={false}>
            <span>{this.$T("ssrc.bidHall.model.bidHall.names").$D("名称")}：{ record.userName}</span>
            <span slot="right"
              class={record.passwordFlag ? "supplier-tag" : "supplier-tag active"}>{record.passwordFlag ? this.$T("ssrc.bidHall.view.enable.bid.password").$D("已启用开标密码") : this.$T("ssrc.bidHall.view.disable.bid.password").$D("未启用开标密码") }</span>
          </SrmListHeader>
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.bidRole").$D("招标角色"),
          fieldCode: "bidRoleMeaning",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.userName").$D("用户名"),
          fieldCode: "loginName",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.phone").$D("手机号"),
          fieldCode: "phone",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.email").$D("邮箱"),
          fieldCode: "email",
        },
      ];

      return columns;
    }
  },
  mounted() {},
};
</script>

<style lang="stylus" scoped>
.header {
  font-size: 18px;
  font-weight: bold;
  line-height: 32px;
}

.right-button {
  margin-right: 8px;

  img {
    margin-right: 12px;
    height: 24px;
    width: 24px;
  }
}

.sub-title {
  width: 100%;
  height: 32px;
  line-height: 32px;
  padding-left: 20px;
  font-weight: bold;
  font-size: 24px;
  color: var(--color-font-default);
}
  ul {
    li {
      border-bottom: 1px solid var(--color-border-default);
      padding: 12px 20px 4px 0;

      .supplier-detail {
        div {
          margin: 8px 0px;
          font-size: 14px;
          color: #1B1E2B;
          line-height: 20px;
        }

        .supplier-name {
          width: 335px;
          color: var(--color-font-default);
          letter-spacing: 0;
          font-family: PingFangSC-Medium;
          font-size: 14px;
          line-height: 20px;
          height: 20px;
          font-weight: bold;
        }

        .supplier-tag {
          display: inline-block;
          padding: 0 4px;
          background: var(--color-bg-default-c);
          border-radius: 2px;
          font-size: 10px;
          color: var(--color-other-default-b);
          height: 20px;
          line-height: 20px;
          margin-left: 8px;
        }

        .active {
          color: var(--color-font-default-c);
          background: var(--color-bg-default-d, rgba(65, 70, 96, 0.1));
        }
      }
    }
  }
</style>
