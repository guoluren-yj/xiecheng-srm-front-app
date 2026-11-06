<template>
  <div class="content">
    <div v-for="(li,index) in msg" :key="index" @click.stop="showMore(li)">
      <customize :need-padding="true" :columns="getColumns(li,index)" :data-source="li" />
    </div>
  </div>
</template>

<script>
export default {
  modules: [ "hzero.common", "ssrc.inquiryHall" ],
  name: "QuotationDetailLineO",
  components: {
  },
  props: {
    msg: {
      type: Array | Object
    },
    allowCreateFlag: {
      type: Number
    },
    deleteDetail:{
      type: Function,
    },
    leftTimeFlag: {
      type: Boolean,
    }
  },
  data() {
    return {};
  },
  computed:{
    receiveMsg() {
      return this.msg;
    },
    getColumns() {
      return (li, key) => {
        const columns = [
          {
            fieldName: this.$T("ssrc.inquiryHall.view.quotationDetail.name").$D("明细名称"),
            fieldCode: "configName",
            fieldType:"INPUT",
            editable:(val, record) => record.status === "add" && record.editFlag,
          },
          {
            fieldName: this.$T("ssrc.inquiryHall.view.quotationDetail.code").$D("明细编码"),
            fieldCode: "configCode",
            fieldType:"INPUT_NUMBER",
            editor:(val, record) => record.status === "add" && record.editFlag
          },
        ];
        // eslint-disable-next-line no-unused-vars
        if (Object.keys(li).length > 0) {
          // eslint-disable-next-line no-unused-vars
          for (let item of li.quotationColumns) {
            columns.push({
              fieldName: item.columnName,
              fieldCode: "supQuotationColumnValue",
              editable:Boolean(li.editFlag),
              fieldType:item.columnCode !== "Price" && item.columnCode !== "Quantity" ? "INPUT" : "INPUT_NUMBER",
              required:this.leftTimeFlag ? item.quotationColumnValue ? item.quotationColumnValue === "REQUIRED" : item.requiredFlag === 1 : false,
            },);
          }
        }
        columns.push({
          fieldCode:"editContainer",
          fieldType:"EMPTY",
          render:() => <div class="edit-container">
            {this.allowCreateFlag && li.createFlag === 1 &&
              <span
                class="bg-red"
                onClick={() => this.deleteDetail(key, this.msg)}>{this.$T("ssrc.inquiryHall.view.detete.quotationDetail").$D("删除明细")}</span>
            }
            {li.editFlag &&
        <span class="bg-blue" onClick={() => this.showEdit(key, 0, "ok")}>{this.$T("hzero.common.button.ok").$D("确定")}</span>
            }
            {!li.editFlag && this.leftTimeFlag &&
              <img
                src={require("@/assets/icon_form_editor_normal@3x.png")}
                onClick={() => this.showEdit(key, 1, "edit")}/>
            }
          </div>
        });
        return columns;
      };
    },
  },
  methods: {
    showMore(li) {
      li.showMoreFlag = !li.showMoreFlag;
      this.$forceUpdate();
    },
    showEdit(index, editFlag, status) {
      let flag = 0;
      if (status === "ok") {
        this.receiveMsg[index].editFlag = 1;
        // eslint-disable-next-line no-unused-vars
        for (let item of this.msg[index].quotationColumns) {
          if (item.quotationColumnValue === "REQUIRED" && !item.supQuotationColumnValue) {
            this.$notification.open({
              message: this.$T("hzero.common.validation.requireInput", [ item.columnName ]).$D("请输入{name}"),
              description: "",
              key,
              class: "notification"
            });
            flag = 0;
            break;
          } else {
            flag = 1;
          }
        }
        if (flag) {
          this.receiveMsg[index].editFlag = 0;
        }
      } else if (status === "edit") {
        this.receiveMsg[index].editFlag = 1;
      } else {
        this.receiveMsg[index].editFlag = 0;
      }
      this.$forceUpdate();
    },
    // deleteDetail(index) {
    //   this.msg.splice(index, 1);
    // }
  }
};
</script>

<style lang="stylus" scoped>

.bg-red {
  background: var(--color-other-default);
}

.bg-blue {
  background: var(--color-other-default-b);
}

.content {
  transition: all 0.5s ease-in-out;
  -webkit-transition: all 0.5s ease-in-out;
}

.noShow {
  opacity: 0;
  max-height: 0;
  display: none;
}

.showContent {
  opacity: 1;
  display: block;
}

.line-body > .content > ul:not(:last-child) {
  border-bottom: 8px solid var(--color-border-default);
}

.line-body {
  width:100%;
  overflow-y: auto;

  ul {
    padding: 0;
    background: var(--color-bg-default-i);

    li {
      margin: 12px 15px;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: var(--color-font-default, #1b1e2b);
      display: flex;
      line-height: 20px;

      span {
        flex: 1;
      }
    }
  }

  .number {
    margin-right: 5px;
  }

  .edit-container {
    width:100%;
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    margin: 12px 15px;

    img {
      height: 28px;
      width: 28px;
    }

    span {
      font-family: PingFangSC-Medium;
      font-size: 14px;
      color: #FFFFFF;
      line-height: 20px;
      padding: 4px 8px;
      border-radius: 2px;

      &:nth-child(1) {
        margin-left: 12px;
      }
    }
  }
}
</style>
