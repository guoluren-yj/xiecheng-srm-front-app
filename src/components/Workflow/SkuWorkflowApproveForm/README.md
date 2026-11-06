# SkuWorkflowApprove 数据逻辑说明

## 一、整体架构

```
SkuWorkflowApprove.vue（主组件）
├── api/index.js          — 两个接口
├── datasource/formDs.js  — DataSet 字段定义
└── datasource/colors.js  — 标签颜色映射
```

## 二、接口

| 接口 | 说明 |
|------|------|
| `fetchInfoWorkflowApprove` | GET `/skus/spu-detail-approve/{skuTemporaryId}`，返回 `{ ...spu字段, skuList: [...] }` |
| `fetchTypeSpecs` | GET `/skus/query-category-attrs/{categoryId}`，返回分类属性模板 `[{ attrId, attrName, baseAttrFlag, operationType }]` |

## 三、数据加载流程（loadData）

```
1. 调用 fetchInfoWorkflowApprove(params) 获取 res
2. res.skuList 中找到当前 skuId 对应的 skuData
3. 从 res 提取 SPU 级别字段：customFlag, sourceFrom, supplierCompanyName, categoryNamePath, catalogName
4. 各模块加载数据：
   ├── 基本信息头部（basicDS）：{ ...skuData, ...spuBase }
   ├── 基础信息（baseInfoDS）：{ ...skuData, ...spuBase }
   ├── 价格信息（priceDS）：skuData.skuSalesInfos[] 逐条 create
   ├── 商品属性（basicAttrDS/saleAttrDS/specsAttrDS）：见下方详解
   └── 物料信息（itemDS）：{ ...skuData }
```

## 四、数据来源区分（关键）

接口返回两层数据：

```
res = {
  // === SPU 级别（顶层） ===
  supplierCompanyName,   // 供应商
  categoryNamePath,      // 平台分类
  catalogName,           // 商城目录
  customFlag,            // 定制品（覆盖 SKU 级别）
  sourceFrom,            // 来源（覆盖 SKU 级别）
  categoryId,            // 分类 ID（用于请求属性模板）

  // === SKU 级别（skuList[0]） ===
  skuList: [{
    skuTitle,            // 副标题
    skuImageList,        // 图片列表
    labels,              // 标签
    introduction,        // 商品描述（HTML）
    brandName, model, packingList,  // 基本属性固定字段（可能为空，值在 skuAttrList 中）
    itemCode, itemName, itemCategoryCode, itemCategoryName,  // 物料信息
    skuAttrList: [],     // 已有值的属性列表
    skuAttrExtendList: [], // 扩展属性列表
    skuSalesInfos: [],   // 价格信息列表
  }]
}
```

**基础信息**中 `supplierCompanyName/categoryNamePath/catalogName` 取 SPU 级别，其余取 SKU 级别。

**价格信息**全部来自 SKU 级别 `skuSalesInfos`。

## 五、商品属性（最复杂）

### 5.1 数据结构

属性数据分布在三个地方：

| 数据源 | 说明 | 示例 |
|--------|------|------|
| `skuAttrList` | 已有值的属性，通过 attrId 与 specsData 匹配 | `[{ attrId, attrType, attributeCode, attributeName, description: "阿萨德" }]` |
| `skuAttrExtendList` | 扩展属性，自带 attrType 和值 | `[{ attrType: 1, attrName: "111", attrValue: "2" }]` |
| `specsData`（fetchTypeSpecs 返回） | 分类属性模板，提供 attrName 和 baseAttrFlag | `[{ attrId, attrName, baseAttrFlag, operationType }]` |

### 5.2 属性分组（attrType）

| attrType | 分组 | 说明 |
|----------|------|------|
| 1 | 销售属性 | 动态属性 |
| 2 | 基本属性 | 固定字段（品牌/型号/包装规格）+ 动态属性 |
| 3 | 规格属性 | 动态属性 |

### 5.3 getAttrsByType 方法

```
遍历 specsData（属性模板）：
  对每个模板属性 f：
    在 skuAttrList 中查找 attrId === f.attrId 的属性
    取 attrType = attr.attrType || (f.baseAttrFlag ? 2 : 0)
    如果 attrType 匹配：
      多选规格属性（attrType!==1 && operationType===0）→ attrValues = [值数组]
      其他 → attrValues = attr[0]（单个属性对象）
    push { ...f, attrValues }

再追加 skuAttrExtendList 中匹配 attrType 的属性（自带 attrValue 字段）
```

### 5.4 buildFields 取值逻辑

对 getAttrsByType 返回的每个属性取 val：

```
1. attr.attrValues 是数组 → join(',')
2. attr.attrValues 是对象 → 取 .attrValueName || .description || .attrValue
3. 都没有 → 取 attr.attrValue || attr.attrValueName || attr.description
```

然后 `formatAttrValue(attributeCode, val)` 做特殊格式化。

### 5.5 品牌/型号去重（baseIsSale）

```
baseIsSale(code)：检查 skuAttrList 中 attributeCode === code 且 attrType === 1
```

- 固定字段品牌/型号：`show = !baseIsSale`（不是销售属性才显示）
- 动态属性中品牌/型号：`show = baseIsSale`（是销售属性才显示）

保证品牌/型号只在一处出现。

### 5.6 固定字段值回退（getAttrListValue）

skuData 顶层的 `brandName`/`model` 可能为空，回退到 `skuAttrList` 中查找：

```
getAttrListValue(code)：
  在 skuAttrList 中找 attributeCode === code 的记录
  取值：attrValueName || description || attrValue
```

### 5.7 属性值特殊格式化（formatAttrValue）

| attributeCode | 规则 | 示例 |
|---------------|------|------|
| 000000000008 | + '%' | 13 → 13% |
| 000000000006 | 去逗号 | 1,2,3 → 123 |
| 000000000007 | 逗号换 x，末尾 + mm | 10,20,30 → 10 x 20 x 30 mm |

## 六、弹窗数据加载

弹窗用 `setData(数组)` 加载多条记录到 `srm-list`：

- **阶梯价格**：每次创建新 DataSet，`setData(data)`
- **送货区域**：每次创建新 DataSet，`setData(data)`（避免累积）
- **采买组织**：每次创建新 DataSet，`setData(data)`（避免累积）
- **商品描述**：HtmlView 组件 + `:key` 强制重建 + `mounted` 写 iframe

## 七、采购方/供应商区分

```
isSup = window.location.href.includes('-sup')
```

差异：`priceLibNumber` 仅 `!isSup`（采购方）显示。

## 八、srm-form vs srm-list

| 组件 | 数据加载 | 适用场景 |
|------|----------|----------|
| srm-form | `create(单条对象)` | 单条记录多字段表单展示 |
| srm-list | `setData(数组)` | 多条记录列表展示 |
