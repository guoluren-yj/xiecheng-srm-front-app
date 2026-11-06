<template>
  <div>
    <div class="lineinfo-detail">
      <!-- 内容区 -->
      <div class="content">
        <customize-detail :columns="getLineColumns" :data-source="itemData"
                          code="SMBL.RECEIPT_EXECUTION.COMPLETE_LIST.DETAIL"/>
        <!-- <div class="form-item">
          <div class="label">
            {{
              $T(
                "sinv.receiptExecution.model.receipt.rcvTypeName.current"
              ).$D("事务类型")
            }}
          </div>
          <div class="value">{{ itemData.rcvTypeName }}</div>
        </div>
        <div class="form-item">
          <div class="label">
            {{
              $T("sinv.receiptExecution.model.receipt.trxNum").$D("单据编号")
            }}
          </div>
          <div class="value">{{ itemData.trxNum }}</div>
        </div>
        <div class="form-item">
          <div class="label">
            {{
              $T("sinv.receiptExecution.model.receipt.trxLineNum").$D(
                "单据行号"
              )
            }}
          </div>
          <div class="value">{{ itemData.trxLineNum }}</div>
        </div>
        <div class="form-item">
          <div class="label">
            {{
              $T("sinv.receiptExecution.model.receipt.itemCode").$D("物料编码")
            }}
          </div>
          <div class="value">{{ itemData.itemCode }}</div>
        </div>
        <div class="form-item">
          <div class="label">
            {{
              $T("sinv.receiptExecution.model.receipt.itemName").$D("物料名称")
            }}
          </div>
          <div class="value">{{ itemData.itemName }}</div>
        </div>
        <div class="form-item">
          <div class="label">
            {{
              $T("sinv.receiptExecution.model.receipt.quantity").$D("单据数量")
            }}
          </div>
          <div class="value">{{ itemData.quantity }}</div>
        </div>
        <div class="form-item">
          <div class="label">
            {{
              $T("sinv.receiptExecution.model.receipt.returnQuantity").$D(
                "可退货数量"
              )
            }}
          </div>
          <div class="value">{{ itemData.leftQuantity }}</div>
        </div>

        <div v-if="itemData.subjectType == 'QUANTITY'" class="form-item">
          <div class="label">
            {{
              $T("sinv.receiptExecution.model.receipt.return.quantity").$D(
                "退回数量"
              )
            }}
          </div>
          <div class="value">
            <input
              v-model="itemData.updateQuantity"
              class="form-input"
              pattern="^((-\\d+(\\.\\d+)?)|(0+(\\.0+)?))$"
              type="number"
              @input="inputChange()">
            <img
              class="edit-icon"
              src="@/assets/ReceiptExecution/icon_List_editor_normal@3x.png"
              alt="">
          </div>
        </div>
        <div v-else class="form-item">
          <div class="label">
            {{
              $T("sinv.receiptExecution.model.receipt.return.quantity").$D(
                "退回数量"
              )
            }}
          </div>
          <div class="value">{{ itemData.updateQuantity }}</div>
        </div>

        <div class="form-item">
          <div class="label">
            {{
              $T("sinv.receiptExecution.model.receipt.moveReason").$D(
                "退回原因"
              )
            }}
          </div>
          <div class="value">
            <a-dropdown
              class="mydropdown"
              overlay-class-name="code-dropdown"
              placement="bottomLeft"
              :trigger="['click']">
              <span>{{ itemData.moveReasonMeaning }}
              </span>
              <a-menu slot="overlay">
                <a-menu-item
                  v-for="(item, key) in reasons"
                  :key="key"
                  @click="chooseReason(item)">
                  {{ item.meaning }}
                </a-menu-item>
              </a-menu>
            </a-dropdown>
            <img
              class="edit-icon"
              src="@/assets/ReceiptExecution/icon_Form_editor_Darknormal@3x.png"
              alt="">
          </div>
        </div>
        <div class="form-item">
          <div class="label">
            {{
              $T("sinv.receiptExecution.model.receipt.quantity.returned").$D(
                "已退回数量"
              )
            }}
          </div>
          <div class="value">{{ itemData.reversedQuantity }}</div>
        </div>
        <div class="form-item">
          <div class="label">
            {{
              $T(
                "sinv.receiptExecution.model.receipt.can.return.leftTaxAmount"
              ).$D("可退回金额(含税)")
            }}
          </div>
          <div class="value">{{ itemData.leftTaxAmount }}</div>
        </div>

        <div v-if="itemData.subjectType == 'AMOUNT'" class="form-item">
          <div class="label">
            {{
              $T(
                "sinv.receiptExecution.model.receipt.return.updateTaxAmount"
              ).$D("退回金额(含税)")
            }}
          </div>
          <div class="value">
            <input
              v-model="itemData.updateTaxAmount"
              class="form-input"
              pattern="^(\d{0,8}|0)([.]?|(\.\d{1,2})?)$"
              type="number"
              @input="inputChangeB()">
            <img
              class="edit-icon"
              src="@/assets/ReceiptExecution/icon_List_editor_normal@3x.png"
              alt="">
          </div>
        </div>
        <div v-else class="form-item">
          <div class="label">
            {{
              $T(
                "sinv.receiptExecution.model.receipt.return.updateTaxAmount"
              ).$D("退回金额(含税)")
            }}
          </div>
          <div class="value">{{ itemData.updateTaxAmount }}</div>
        </div>

        <div class="form-item">
          <div class="label">
            {{
              $T(
                "sinv.receiptExecution.model.receipt.return.reversedTaxAmount"
              ).$D("已退回金额(含税)")
            }}
          </div>
          <div class="value">{{ itemData.reversedTaxAmount }}</div>
        </div>
        <div class="form-item">
          <div class="label">
            {{
              $T("sinv.receiptExecution.model.receipt.not.netPrice").$D(
                "未税单价"
              )
            }}
          </div>
          <div class="value">{{ itemData.netPrice }}</div>
        </div>
        <div class="form-item">
          <div class="label">
            {{
              $T("sinv.receiptExecution.model.receipt.tax.includedPrice").$D(
                "含税单价"
              )
            }}
          </div>
          <div class="value">{{ itemData.taxIncludedPrice }}</div>
        </div>
        <div class="form-item">
          <div class="label">
            {{
              $T("sinv.receiptExecution.model.receipt.trxDate").$D(
                "实际操作日期"
              )
            }}
          </div>
          <div class="value">{{ itemData.trxDate | CalcDate }}</div>
        </div>
        <div class="form-item">
          <div class="label">
            {{
              $T("sinv.receiptExecution.model.receipt.inventoryName").$D("库房")
            }}
          </div>
          <div class="value">{{ itemData.inventoryName }}</div>
        </div>
        <div class="form-item">
          <div class="label">
            {{
              $T("sinv.receiptExecution.model.receipt.locationName").$D("库位")
            }}
          </div>
          <div class="value">{{ itemData.locationName }}</div>
        </div>
        <div class="form-item">
          <div class="label">
            {{
              $T("sinv.receiptExecution.model.receipt.organizationName").$D(
                "收货组织"
              )
            }}
          </div>
          <div class="value">{{ itemData.organizationName }}</div>
        </div>
        <div class="form-item">
          <div class="label">
            {{ $T("sinv.receiptExecution.model.receipt.uomName").$D("单位") }}
          </div>
          <div class="value">{{ itemData.uomName }}</div>
        </div>
        <div class="form-item">
          <div class="label">
            {{
              $T("sinv.receiptExecution.model.receipt.productNum").$D(
                "商品编码"
              )
            }}
          </div>
          <div class="value">{{ itemData.productNum }}</div>
        </div>
        <div class="form-item">
          <div class="label">
            {{
              $T("sinv.receiptExecution.model.receipt.dueDate").$D("妥投时间")
            }}
          </div>
          <div class="value">{{ itemData.dueDate }}</div>
        </div>
        <div class="form-item">
          <div class="label">
            {{
              $T("sinv.receiptExecution.model.receipt.supplierName").$D(
                "供应商"
              )
            }}
          </div>
          <div class="value">{{ itemData.supplierName }}</div>
        </div>
        <div class="form-item">
          <div class="label">
            {{
              $T("sinv.receiptExecution.model.receipt.companyName").$D("公司")
            }}
          </div>
          <div class="value">{{ itemData.companyName }}</div>
        </div>
        <div class="form-item">
          <div class="label">
            {{
              $T("sinv.receiptExecution.model.receipt.sourceHeaderNum").$D(
                "来源单号"
              )
            }}
          </div>
          <div class="value">{{ itemData.sourceHeaderNum }}</div>
        </div>
        <div class="form-item">
          <div class="label">
            {{
              $T("sinv.receiptExecution.model.receipt.sourceLineNum").$D(
                "来源行号"
              )
            }}
          </div>
          <div class="value">{{ itemData.sourceLineNum }}</div>
        </div>
        <div class="form-item">
          <div class="label">
            {{
              $T("sinv.receiptExecution.model.receipt.strategyCode").$D(
                "策略编号"
              )
            }}
          </div>
          <div class="value">{{ itemData.strategyCode }}</div>
        </div> -->
      </div>
    </div>

    <!-- 底部按钮 -->
    <new-bottom-handler
      :btn-arr="[
        {
          // eslint-disable-next-line vue/this-in-template
          title: this.$T('sinv.receiptExecution.model.receipt.execution').$D('执行'),
          background: '#276EF1',
          color: '#fff',
          handler: submit,
        },
      ]"/>
    <lov
      v-if="catalogPop"
      v-model="catalogPop"
      :code="cataLovCode"
      :query-params="{ lovCode: cataLovCode, tenantId,nodeConfigId,strategyLineIds }"
      :query-field="['rcvTypeCode', 'rcvTypeName']"
      @submitValue="GetCatalogValue"/>
  </div>
</template>

<script>
import NewBottomHandler from "@/components/BottomHandler";
import Lov from "@/components/Lov";
import mixin from "../mixin/index.js";
import { View, Popup, Input, NavBar, Textarea } from "hips";

export default {
  modules: [ "sinv.receiptExecution", "hipspfm.orderApproval", "hipspfm.expertScoring", "hipspfm.common" ],
  components: {
    Lov,
    NewBottomHandler,
    [View.name]: View,
    [Input.name]: Input,
    [Popup.name]: Popup,
    [NavBar.name]: NavBar,
    [Textarea.name]: Textarea,
  },
  mixins: [ mixin ],
  data() {
    return {
      itemData: {}, // 详情信息
      nowNode: {}, // 节点信息 调接口使用
      reasons: [], // 退回原因
      attachmentUuid: "",
    };
  },
  computed: {
    getLineColumns() {
      const columns = [
        {
          fieldName: this.$T("sinv.receiptExecution.model.receipt.rcvTypeName.current").$D("事务类型"),
          fieldType: "TEXT",
          fieldCode: "rcvTypeName",
        },
        {
          fieldName: this.$T("sinv.receiptExecution.model.receipt.trxNum").$D("单据编号"),
          fieldType: "TEXT",
          fieldCode: "trxNum",
        },
        {
          fieldName: this.$T("sinv.receiptExecution.model.receipt.trxLineNum").$D("单据行号"),
          fieldCode: "trxLineNum",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sinv.receiptExecution.model.receipt.itemCode").$D("物料编码"),
          fieldCode: "itemCode",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sinv.receiptExecution.model.receipt.itemName").$D("物料名称"),
          fieldCode: "itemName",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sinv.receiptExecution.model.receipt.quantity").$D("单据数量"),
          fieldCode: "quantity",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: this.$T("sinv.receiptExecution.model.receipt.returnQuantity").$D("可退货数量"),
          fieldCode: "leftQuantity",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: this.$T("sinv.receiptExecution.model.receipt.return.quantity").$D("退回数量"),
          fieldCode: "updateQuantity",
          fieldType: "INPUT_NUMBER",
          editor: (val, record) => {
            if (record.subjectType === "QUANTITY") {
              return true;
            }
            return false;
          },
          inputChange: (val, record) => {
            if (record.subjectType === "QUANTITY") {
              // const reg = /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,5})?$/;
              if (this.itemData.updateQuantity > this.itemData.leftQuantity) {
                this.itemData.updateQuantity = this.itemData.leftQuantity;
              }
              // if (this.itemData.updateQuantity && !reg.test(this.itemData.updateQuantity)) {
              //   this.itemData.updateQuantity = this.itemData.updateQuantity.slice(0,this.itemData.updateQuantity.length - 1);
              // }
              const updateTaxAmount = (this.itemData.updateQuantity * this.itemData.taxIncludedPrice * 1000000 / (this.itemData.unitPriceBatch * 1000000)).toFixed(5);
              this.$set(this.itemData, "updateTaxAmount", updateTaxAmount);
            }
          },
          precision: (val, record) => record.uomPrecision,
        },
        {
          fieldName: this.$T("sinv.receiptExecution.model.receipt.moveReason").$D("退回原因"),
          fieldCode: "moveReasonMeaning",
          fieldType: "TEXT",
          render: () => <srm-lov-field
            v-model={this.itemData.moveReason}
            display={this.itemData.moveReasonMeaning}
            code="SPUC.SINV.MOVE.REASON"
            selectType="select"
            placeholder={this.$T("sinv.receiptExecution.model.receipt.moveReason").$D("退回原因")}
            onInputChange={this.chooseReason}
          />
        },
        {
          fieldName: this.$T("sinv.receiptExecution.model.receipt.quantity.returned").$D("已退回数量"),
          fieldCode: "reversedQuantity",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: this.$T("sinv.receiptExecution.model.receipt.can.return.leftTaxAmount").$D("可退回金额(含税)"),
          fieldCode: "leftTaxAmount",
          fieldType: "INPUT_NUMBER",
          editor: false,
          precision: (val, item) => this.$options.filters.calcCurrencyPrecision(item.currencyCode, "financialPrecision")
        },
        {
          fieldName: this.$T("sinv.receiptExecution.model.receipt.return.updateTaxAmount").$D("退回金额(含税)"),
          fieldCode: "updateTaxAmount",
          fieldType: "INPUT_NUMBER",
          inputType: "number",
          editor: (val, record) => {
            if (record.subjectType === "AMOUNT") {
              return true;
            }
            return false;
          },
          inputChange: (val, record) => {
            if (record.subjectType === "AMOUNT") {
              const reg = /^(\d{0,8}|0)([.]?|(\.\d{1,2})?)$/;
              if (this.itemData.updateTaxAmount > this.itemData.leftTaxAmount) {
                this.itemData.updateTaxAmount = this.itemData.leftTaxAmount;
              }
              if (this.itemData.updateTaxAmount && !reg.test(this.itemData.updateTaxAmount)) {
                this.itemData.updateTaxAmount = this.itemData.updateTaxAmount.slice(0, this.itemData.updateTaxAmount.length - 1);
              }
              const updateQuantity = this.itemData.updateTaxAmount * this.itemData.unitPriceBatch * 1000000 / (this.itemData.taxIncludedPrice * 1000000).toFixed(record.uomPrecision);
              // const updateQuantity = Math.ceil(this.itemData.updateTaxAmount * this.itemData.unitPriceBatch * 1000000 / (this.itemData.taxIncludedPrice * 1000000)).toFixed(5);
              this.$set(this.itemData, "updateQuantity", updateQuantity);
            }
          },
          precision: (val, item) => this.$options.filters.calcCurrencyPrecision(item.currencyCode, "financialPrecision")
        },
        {
          fieldName: this.$T("sinv.receiptExecution.model.receipt.return.reversedTaxAmount").$D("已退回金额(含税)"),
          fieldCode: "reversedTaxAmount",
          fieldType: "INPUT_NUMBER",
          editor: false,
          precision: (val, item) => this.$options.filters.calcCurrencyPrecision(item.currencyCode, "financialPrecision")
        },
        {
          fieldName: this.$T("sinv.receiptExecution.model.receipt.not.netPrice").$D("未税单价"),
          fieldCode: "netPrice",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: this.$T("sinv.receiptExecution.model.receipt.tax.includedPrice").$D("含税单价"),
          fieldCode: "taxIncludedPrice",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: this.$T("sinv.receiptExecution.model.receipt.trxDate").$D("实际操作日期"),
          fieldCode: "trxDate",
          fieldType: "TEXT",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters["CalcDate"](val)
        },
        {
          fieldName: this.$T("sinv.receiptExecution.model.receipt.inventoryName").$D("库房"),
          fieldCode: "inventoryName",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sinv.receiptExecution.model.receipt.locationName").$D("库位"),
          fieldCode: "locationName",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sinv.receiptExecution.model.receipt.organizationName").$D("收货组织"),
          fieldCode: "organizationName",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sinv.receiptExecution.model.receipt.uomName").$D("单位"),
          fieldCode: "uomName",
          fieldType: "TEXT",
          render: (val, item) => Number(item.unitCodeIsShow) ? `${item.uomCode}/${item.uomNameShow}` : item.uomNameShow,
        },
        {
          fieldName: this.$T("sinv.receiptExecution.model.receipt.productNum").$D("商品编码"),
          fieldCode: "productNum",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sinv.receiptExecution.model.receipt.dueDate").$D("妥投时间"),
          fieldCode: "dueDate",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sinv.receiptExecution.model.receipt.supplierName").$D("供应商"),
          fieldCode: "supplierName",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sinv.receiptExecution.model.receipt.companyName").$D("公司"),
          fieldCode: "companyName",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sinv.receiptExecution.model.receipt.sourceHeaderNum").$D("来源单号"),
          fieldCode: "sourceHeaderNum",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sinv.receiptExecution.model.receipt.sourceLineNum").$D("来源行号"),
          fieldCode: "sourceLineNum",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sinv.receiptExecution.model.receipt.strategyCode").$D("策略编号"),
          fieldCode: "strategyCode",
          fieldType: "TEXT",
        }
      ];

      return columns;
    },
  },
  mounted() {
    const { itemData = {}, nowNode = {} } = this.$route.query;

    this.itemData = itemData;
    this.nowNode = nowNode;
  },
  methods: {
    // 控制用户输入
    inputChange() {
      const reg = /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,5})?$/;

      if (this.itemData.updateQuantity > this.itemData.leftQuantity) {
        this.itemData.updateQuantity = this.itemData.leftQuantity;
      }
      if (
        this.itemData.updateQuantity &&
        !reg.test(this.itemData.updateQuantity)
      ) {
        this.itemData.updateQuantity = this.itemData.updateQuantity.slice(
          0,
          this.itemData.updateQuantity.length - 1
        );
      }
      const updateTaxAmount = (this.itemData.updateQuantity * this.itemData.taxIncludedPrice * 1000000 / (this.itemData.unitPriceBatch * 1000000)).toFixed(5);

      this.$set(this.itemData, "updateTaxAmount", updateTaxAmount);
    },
    inputChangeB() {
      const reg = /^(\d{0,8}|0)([.]?|(\.\d{1,2})?)$/;

      if (this.itemData.updateTaxAmount > this.itemData.leftTaxAmount) {
        this.itemData.updateTaxAmount = this.itemData.leftTaxAmount;
      }
      if (this.itemData.updateTaxAmount && !reg.test(this.itemData.updateTaxAmount)) {
        this.itemData.updateTaxAmount = this.itemData.updateTaxAmount.slice(0, this.itemData.updateTaxAmount.length - 1);
      }
      const updateQuantity = Math.ceil(this.itemData.updateTaxAmount * this.itemData.unitPriceBatch * 1000000 / (this.itemData.taxIncludedPrice * 1000000)).toFixed(5);

      this.$set(this.itemData, "updateQuantity", updateQuantity);
    },
    // 执行
    async submit() {
      const val = this.itemData;
      // eslint-disable-next-line no-unused-vars
      const reg = /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,5})?$/;

      if (val.subjectType === "QUANTITY" && !val.updateQuantity && val.updateQuantity !== 0) {
        this.$notification.open({
          message: this.$T("sinv.receiptExecution.viee.require.updateQuantity").$D("退回数量必输"),
          description: "",
          class: "notification",
        });
        return;
      } else if (val.subjectType === "AMOUNT" && !val.updateTaxAmount && val.updateTaxAmount !== 0) {
        this.$notification.open({
          message: this.$T("sinv.receiptExecution.viee.require.updateTaxAmount").$D("退回金额必输"),
          description: "",
          class: "notification",
        });
        return;
      }
      const success = () => {
        this.$router.back();
      };

      await this.handleExceFun([ this.itemData ], this.nowNode, success);
    },
    chooseReason(val, data) {
      this.$set(this.itemData, "moveReason", val);
      if (data && data.length) {
        this.$set(this.itemData, "moveReasonMeaning", data[0].meaning);
      }
      this.$forceUpdate();
    },
    // 返回
    goBack() {
      this.$router.back();
    },
    //退出子应用
    goClose() {
      try {
        // eslint-disable-next-line no-undef
        closeWebView();
      } catch (err) {
        this.$router.back();
      }
    },
    //回到顶部
    goTop() {
      this.$nextTick(() => {
        this.$refs.content.scrollTop = 0;
      });
    },
  },
};
</script>

<style lang="stylus" scoped>

.line-value {
  margin-top: 8px;
  color: #1f1f1f;
  line-height: 22px;
  min-height 22px;
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  width: 100%;

  .form-input {
    width: 200px;
    height: 20px;
    border: 0; // 去除未选中状态边框
    outline: none; // 去除选中状态边框
    background-color: rgba(0, 0, 0, 0); // 透明背景
  }

  .edit-icon {
    margin-right: 15px;
    width: 20px;
    height: 20px;
  }
}

.lineinfo-detail {
  width: 100%;
  height: calc(100vh - 44px);
  overflow-y: auto;
  background-color #f0f2f5

  .btn-wrap {
    display: flex;
    padding: 16px 15px;
    position: sticky;
    background: #ffffff;
    top: 0;

    .btn {
      padding: 8px 16px;
      margin-right: 8px;
      border-radius: 16px;
      font-size: 12px;
      line-height: 16px;
      color: #ffffff;
    }

    .file-btn {
      background: #f36331;
    }
  }

  .content {
    padding-left: 15px;
    margin-bottom: 160px;

    .form-item {
      padding: 15px 15px 15px 0;
      border-bottom: 1px solid #f6f6f6;

      .label {
        color: #AFAFAF;
        font-size: 12px;
        line-height: 16px;
        font-weight bold
      }

      .value {
        margin-top: 8px;
        color: #1f1f1f;
        line-height: 22px;
        min-height 22px;
        font-size: 14px;
        display: flex;
        justify-content: space-between;

        .form-input {
          width: 200px;
          height: 20px;
          border: 0; // 去除未选中状态边框
          outline: none; // 去除选中状态边框
          background-color: rgba(0, 0, 0, 0); // 透明背景
        }

        .edit-icon {
          width: 20px;
          height: 20px;
        }
      }

      .line-text {
        height: 64px;
        margin-top: 8px;
        margin-bottom: 40px;
        background: var(--color-bg-default-b);
        border-radius: 8px;
        position: relative;

        >>> .hips-textarea {
          position: static;
          background-color: var(--color-bg-default-b) !important;
          padding: 0 !important;

          textarea:disabled, textarea[disabled] {
            -webkit-opacity: 0.22;
            opacity: 0.22;
            color: var(--color-font-default) !important;
          }
        }

        >>> .hips-textarea--disabled {
          opacity: 1;
        }

        >>> .hips-textarea__input-value {
          padding: 12px;

          textarea {
            height: 40px !important;
            font-size: 14px !important;
            color: #cbcbcb !important;
            line-height: 20px !important;
          }
        }

        .text-img {
          position: absolute;
          right: 12px;
          bottom: 12px;
          width: 20px;
          height: 20px;
        }
      }
    }

    .switch-form {
      padding: 18px 15px 18px 0;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .switch-left {
        .lable {
          color: #1f1f1f;
        }

        .tips {
          color: #276ef1;
          line-height: 16px;
          font-size: 12px;
        }
      }
    }
  }

  .mydropdown {
    flex 1
  }
}
</style>
