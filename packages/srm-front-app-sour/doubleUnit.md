双单位最新逻辑 以含税单价 可供数量两个字段为例
新增字段 validQuotationSecPrice validQuotationSecQuantity 原字段 validQuotationPrice validQuotationQuantity
双单位未开启, 保留原字段 validQuotationPrice(含税单价) 和 validQuotationQuantity(可供数量) ，
            隐藏 validQuotationSecPrice(含税单价) 和 validQuotationSecQuantity(可供数量)
双单位开启 显示 validQuotationPrice(基本含税单价) validQuotationQuantity(基本可供数量) 
              validQuotationSecPrice(含税单价) validQuotationSecQuantity(可供数量)

1.根据doubleUnitFlag定位到页面
2.原
```js
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.taxIncludePrice").$D("含税单价"),
          fieldCode: "validQuotationSecPrice",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        this.doubleUnitFlag ? {
          fieldName: this.$T("ssrc.common.model.supQuo.basicUnitPriceTax").$D("基本单价(含税)"),
          fieldCode: "validQuotationPrice",
          fieldType: "INPUT_NUMBER",
          editor: false,
        }: null,
```
改为
```js
     this.doubleUnitFlag ? {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.taxIncludePrice").$D("含税单价"),
          fieldCode: "validQuotationSecPrice",
          fieldType: "INPUT_NUMBER",
          editor: false,
        } : null,
        {
          fieldName: getPriceName(this.doubleUnitFlag),
          fieldCode: "validQuotationPrice",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
```
3. 引入对应名称，例如: 在@/utils/doubleUnit文件中查找
import { getPriceName, getNetPriceName, getAvailableQtyName } from "@/utils/doubleUnit";