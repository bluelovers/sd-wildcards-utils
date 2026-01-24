# stringifyWildcardsYamlData 輸出格式說明

## Overview

`stringifyWildcardsYamlData` 函數會對輸入的 YAML 資料進行格式化和規範化後輸出。本文件詳細說明輸出格式、預設選項以及各種格式化規則。

---

## 輸入來源

`stringifyWildcardsYamlData` 支援多種輸入來源：

### 1. JSON 物件（IRecordWildcards）

```typescript
import { stringifyWildcardsYamlData } from 'sd-wildcards-utils';

const yamlData = {
  colors: ['red', 'blue', 'green'],
  shapes: ['circle', 'square', 'triangle']
};

const output = stringifyWildcardsYamlData(yamlData);
```

### 2. YAML Document

```typescript
import { parseWildcardsYaml, stringifyWildcardsYamlData } from 'sd-wildcards-utils';

const yamlString = `
colors:
  - red
  - blue
  - green
shapes:
  - circle
  - square
  - triangle
`;

const doc = parseWildcardsYaml(yamlString);
const output = stringifyWildcardsYamlData(doc);
```

### 3. YAML 原始 Document（來自 yaml 套件）

```typescript
import { parseDocument } from 'yaml';
import { stringifyWildcardsYamlData } from 'sd-wildcards-utils';

const doc = parseDocument(yamlString);
const output = stringifyWildcardsYamlData(doc);
```

---

## YAML 檔案輸入的格式變化

### 完整處理流程

當輸入是 YAML Document 時，`stringifyWildcardsYamlData` 會執行以下步驟：

1. **規範化 Document** (`normalizeDocument`)
2. **格式化 Scalar 值** (`formatPrompts`)
3. **轉換為字串** (`doc.toString(opts)`)

### 流程圖

```
YAML Document 輸入
    ↓
normalizeDocument (規範化)
    ↓
_visitNormalizeScalar (遍歷並格式化每個 Scalar)
    ↓
  - 移除不必要的引號
  - 呼叫 formatPrompts
    ↓
doc.toString (轉換為 YAML 字串)
    ↓
最終 YAML 字串輸出
```

---

## YAML 檔案輸入格式變化範例

### 範例 1：引號處理

**輸入 YAML：**
```yaml
colors:
  - "red"
  - 'blue'
  - green
shapes:
  - "circle"
  - 'square'
  - triangle
```

**輸出 YAML：**
```yaml
colors:
  - red
  - blue
  - green
shapes:
  - circle
  - square
  - triangle
```

**說明：** 不必要的引號被自動移除，所有字串轉為 `PLAIN` 類型

---

### 範例 2：多行字串格式化

**輸入 YAML：**
```yaml
prompts:
  - |
    (silhouette:1.2), jianying,
    1girl, nude,
    (in river), splash
  - >-
    (silhouette:1.2), jianying,
    1girl, nude
  - "plain text"
  - "text with: colon"
```

**輸出 YAML：**
```yaml
prompts:
  - (silhouette:1.2), jianying, 1girl, nude, (in river), splash
  - (silhouette:1.2), jianying, 1girl, nude
  - plain text
  - "text with: colon"
```

**說明：**
- 區塊引號 (`|`、`>-`) 被展開並格式化
- 連續空格和多行空白被處理
- 不需要的引號被移除
- 包含特殊字元的字串保留引號

---

### 範例 3：空格和標點清理

**輸入 YAML：**
```yaml
items:
  - "red , blue , green"
  - "red,,blue..."
  - "red    blue   green"
  - "red, blue, green,"
  - "red\n\n\nblue"
```

**輸出 YAML：**
```yaml
items:
  - red, blue, green
  - red, blue
  - red blue green
  - red, blue, green
  - red
  - blue
```

**說明：**
- 標點後空格被標準化
- 重複標點被移除
- 連續空格被壓縮
- 結尾標點被移除
- 多行空白被合併

---

### 範例 4：動態提示格式化

**輸入 YAML：**
```yaml
prompts:
  - "{  key = value }"
  - "{  1-3  ::  red, blue, green  }"
  - "{  |  2  ::  text  }"
  - "  (  text:1.2  )  ,  other"
  - "  {  red | blue | green  }  "
```

**輸出 YAML（標準格式）：**
```yaml
prompts:
  - {key = value}
  - {1-3::red, blue, green}
  - {|2::text}
  - (text:1.2), other
  - {red|blue|green}
```

**輸出 YAML（Minify 格式）：**
```yaml
prompts:
- {key=value}
- {1-3::red,blue,green}
- {|2::text}
- (text:1.2),other
- {red|blue|green}
```

---

### 範例 5：零寬字元和非斷行空格

**輸入 YAML：**
```yaml
items:
  - "red\u200Bblue"
  - "red\u00A0blue"
  - "red\u200C\u200Dblue"
```

**輸出 YAML：**
```yaml
items:
  - redblue
  - red blue
  - redblue
```

**說明：** 零寬字元被移除，非斷行空格（NBSP）轉換為一般空格

---

### 範例 6：註解保留

**輸入 YAML：**
```yaml
# 這是顏色分類
colors:
  - red    # 紅色
  - blue   # 藍色
  - green  # 綠色

# 這是形狀分類
shapes:
  - circle   # 圓形
  - square   # 方形
  - triangle # 三角形
```

**輸出 YAML：**
```yaml
# 這是顏色分類
colors:
  - red    # 紅色
  - blue   # 藍色
  - green  # 綠色

# 這是形狀分類
shapes:
  - circle   # 圓形
  - square   # 方形
  - triangle # 三角形
```

**說明：** YAML 註解會被完整保留在輸出中

---

### 範例 7：複雜嵌套結構

**輸入 YAML：**
```yaml
categories:
  colors:
    primary:
      - "red , blue"
      - "green, yellow,"
    secondary:
      - "purple"
      - "orange"
  shapes:
    basic:
      - "circle"
      - "square"
    complex:
      - "star"
      - "hexagon"
prompts:
  - |
    (silhouette:1.2), jianying,
    1girl, nude,
    (in river), splash
  - "  {red|blue|green}  "
  - "__wildcards/prompts/hair__"
```

**輸出 YAML：**
```yaml
categories:
  colors:
    primary:
      - red, blue
      - green, yellow
    secondary:
      - purple
      - orange
  shapes:
    basic:
      - circle
      - square
    complex:
      - star
      - hexagon
prompts:
  - (silhouette:1.2), jianying, 1girl, nude, (in river), splash
  - {red|blue|green}
  - __wildcards/prompts/hair__
```

---

## 預設輸出格式

### 基本結構

```typescript
import { stringifyWildcardsYamlData } from 'sd-wildcards-utils';

const yamlData = {
  colors: ['red', 'blue', 'green'],
  shapes: ['circle', 'square', 'triangle']
};

const output = stringifyWildcardsYamlData(yamlData);
console.log(output);
```

**輸出結果：**
```yaml
colors:
  - red
  - blue
  - green
shapes:
  - circle
  - square
  - triangle
```

---

## 預設格式選項

`defaultOptionsStringify` 函數定義的預設選項：

```typescript
{
  blockQuote: true,           // 使用區塊引號
  defaultKeyType: 'PLAIN',    // 鍵使用純量格式
  defaultStringType: 'PLAIN', // 字串使用純量格式
  collectionStyle: 'block',   // 集合使用區塊樣式
  uniqueKeys: true,           // 鍵值唯一性檢查
}
```

### 說明

| 選項 | 值 | 說明 |
|-----|----|-----|
| `blockQuote` | `true` | 多行字串使用區塊引號 (`>-\|`) |
| `defaultKeyType` | `'PLAIN'` | 鍵預設不使用引號 |
| `defaultStringType` | `'PLAIN'` | 字串預設不使用引號 |
| `collectionStyle` | `'block'` | 使用區塊樣式（每個元素一行） |
| `uniqueKeys` | `true` | 同層級鍵值唯一性檢查 |

---

## Minify 格式選項

`defaultOptionsStringifyMinify` 函數提供壓縮格式：

```typescript
{
  lineWidth: 0,         // 不限制行寬
  minifyPrompts: true, // 壓縮提示內容
}
```

### 使用範例

```typescript
import { stringifyWildcardsYamlData, defaultOptionsStringifyMinify } from 'sd-wildcards-utils';

const yamlData = {
  colors: ['red, blue', 'green, yellow'],
  shapes: ['circle', 'square', 'triangle']
};

// 標準格式
const standardOutput = stringifyWildcardsYamlData(yamlData);

// 壓縮格式
const minifiedOutput = stringifyWildcardsYamlData(yamlData, defaultOptionsStringifyMinify());
```

**標準輸出：**
```yaml
colors:
  - red, blue
  - green, yellow
shapes:
  - circle
  - square
  - triangle
```

**壓縮輸出：**
```yaml
colors:
- red,blue
- green,yellow
shapes:
- circle
- square
- triangle
```

---

## 字串格式化規則

### 1. 移除零寬字元

```typescript
// 輸入
"red\u200Bblue"  // 包含零寬空格 (U+200B)

// 輸出
"redblue"
```

### 2. 非斷行空格轉換

```typescript
// 輸入
"red\u00A0blue"  // \u00A0 為非斷行空格 (NBSP)

// 輸出
"red blue"
```

### 3. 移除重複標點

```typescript
// 輸入
"red,,blue..."

// 輸出
"red,blue"
```

### 4. 標點符號後空格處理

```typescript
// 輸入
"red , blue , green"

// 輸出
"red, blue, green"
```

### 5. 移除結尾標點

```typescript
// 輸入
"red, blue, green,"

// 輸出
"red, blue, green"
```

### 6. 連續空格壓縮

```typescript
// 輸入
"red    blue   green"

// 輸出
"red blue green"
```

### 7. 多行空白處理

```typescript
// 輸入
"red\n\n\nblue"

// 輸出
"red\nblue"
```

---

## 動態提示格式化

### 變數賦值格式化

當 `minifyPrompts` 開啟時，動態變數賦值會被格式化：

```typescript
// 輸入
"{ key = value }"
"  {  count  =  5  }  "

// 輸出（minifyPrompts: true）
"{key=value}"
"{count=5}"
```

### 選項格式化

```typescript
// 輸入
"{  1  ::  red, blue, green  }"
"{  1.5-2.0  ::  text  }"

// 輸出（minifyPrompts: true）
"{1::red,blue,green}"
"{1.5-2.0::text}"
```

### 管道格式化

```typescript
// 輸入
"{  |  2  ::  text  }"

// 輸出（minifyPrompts: true）
"{|2::text}"
```

---

## 引號處理規則

### 自動移除不必要的引號

當字串不需要引號時（即為安全的純量字串），會自動轉換為 `PLAIN` 類型：

```typescript
// 輸入
key: "simple text"
key2: 'simple text'

// 輸出
key: simple text
key2: simple text
```

### 需要引號的情況

當字串包含特殊字元時會保留引號：

```typescript
// 輸入
key: "text with: colon"
key2: "text with [brackets]"
key3: "{value}"

// 輸出（引號保留）
key: "text with: colon"
key2: "text with [brackets]"
key3: "{value}"
```

### 不安全的引號檢測

當 `disableUnsafeQuote` 為 `false` 時，會檢測並拋出錯誤：

```typescript
// 輸入（錯誤範例）
key: "text with 'single' quote"

// 拋出錯誤
// SyntaxError: Invalid SYNTAX [UNSAFE_QUOTE]. key: value, node: ...
```

---

## Sequence 格式化

### 標準格式

```typescript
// 輸入
const data = {
  items: [
    "item1",
    "item2",
    "item3"
  ]
};

// 輸出
items:
  - item1
  - item2
  - item3
```

### Minify 格式

```typescript
// 輸入（同上）
// 輸出（minifyPrompts: true）
items:
- item1
- item2
- item3
```

### 長字串處理

```typescript
// 輸入
const data = {
  items: [
    "very long text that might need to be wrapped into multiple lines for better readability"
  ]
};

// 輸出（標準格式，使用區塊引號）
items:
  - >-
    very long text that might need to be wrapped into multiple lines
    for better readability

// 輸出（minify 格式，單行）
items:
- very long text that might need to be wrapped into multiple lines for better readability
```

---

## Map 格式化

### 標準格式

```typescript
// 輸入
const data = {
  category1: {
    sub1: ['a', 'b'],
    sub2: ['c', 'd']
  },
  category2: {
    sub1: ['e', 'f']
  }
};

// 輸出
category1:
  sub1:
    - a
    - b
  sub2:
    - c
    - d
category2:
  sub1:
    - e
    - f
```

### Minify 格式

```typescript
// 輸出（minify）
category1:
  sub1:
  - a
  - b
  sub2:
  - c
  - d
category2:
  sub1:
  - e
  - f
```

---

## 空值處理

### 空字串

```typescript
// 輸入
{
  empty: "",
  space: " "
}

// 輸出
empty: ""
space: " "
```

當 `allowScalarValueIsEmptySpace` 為 `true` 時，純空格字串會被保留。

### 空 Sequence

```typescript
// 輸入
{
  empty: []
}

// 輸出
empty: []
```

---

## Wildcards 語法格式化

### 基本引用

```typescript
// 輸入
"  __wildcards/path__  "

// 輸出
"__wildcards/path__"
```

### 選項語法

```typescript
// 輸入
"  {  1-3  ::  red, blue, green  }  "

// 輸出（標準格式）
"{1-3::red, blue, green}"

// 輸出（minify 格式）
"{1-3::red,blue,green}"
```

### 權重語法

```typescript
// 輸入
"  (  text:1.2  )  ,  other"

// 輸出
"(text:1.2), other"
```

### 交替語法

```typescript
// 輸入
"  {  red | blue | green  }  "

// 輸出（標準格式）
"{red|blue|green}"
```

---

## 完整範例

### 標準格式輸出

```typescript
import { stringifyWildcardsYamlData } from 'sd-wildcards-utils';

const yamlData = {
  colors: {
    primary: ["red, blue", "green, yellow"],
    secondary: ["purple", "orange"]
  },
  shapes: {
    basic: ["circle", "square", "triangle"],
    complex: ["star", "hexagon"]
  },
  prompts: [
    "(silhouette:1.2), jianying, 1girl, nude",
    "{red|blue|green} background",
    "__wildcards/prompts/hair__",
    "{1.5-2.0::detailed, high quality}"
  ]
};

const output = stringifyWildcardsYamlData(yamlData);
```

**輸出結果：**
```yaml
colors:
  primary:
    - red, blue
    - green, yellow
  secondary:
    - purple
    - orange
shapes:
  basic:
    - circle
    - square
    - triangle
  complex:
    - star
    - hexagon
prompts:
  - (silhouette:1.2), jianying, 1girl, nude
  - {red|blue|green} background
  - __wildcards/prompts/hair__
  - {1.5-2.0::detailed, high quality}
```

### Minify 格式輸出

```typescript
import { stringifyWildcardsYamlData, defaultOptionsStringifyMinify } from 'sd-wildcards-utils';

const output = stringifyWildcardsYamlData(yamlData, defaultOptionsStringifyMinify());
```

**輸出結果：**
```yaml
colors:
  primary:
  - red,blue
  - green,yellow
  secondary:
  - purple
  - orange
shapes:
  basic:
  - circle
  - square
  - triangle
  complex:
  - star
  - hexagon
prompts:
- (silhouette:1.2),jianying,1girl,nude
- {red|blue|green}background
- __wildcards/prompts/hair__
- {1.5-2.0::detailed,high quality}
```

---

## 格式化選項總覽

### IOptionsStringify

```typescript
interface IOptionsStringify extends IOptionsSharedWildcardsYaml {
  blockQuote?: boolean;           // 區塊引號
  defaultKeyType?: string;         // 鍵類型
  defaultStringType?: string;     // 字串類型
  lineWidth?: number;             // 行寬限制（0 = 不限制）
  minContentWidth?: number;       // 最小內容寬度
  collectionStyle?: string;       // 集合樣式（'block' | 'flow'）
  indentSeq?: boolean;           // 縮排 Sequence
  doubleQuotedMinMultiLineLength?: number; // 雙引號最小多行長度
  uniqueKeys?: boolean;           // 鍵值唯一性
}
```

### IOptionsSharedWildcardsYaml

```typescript
interface IOptionsSharedWildcardsYaml {
  minifyPrompts?: boolean;                    // 壓縮提示內容
  allowEmptyDocument?: boolean;               // 允許空文件
  allowUnsafeKey?: boolean;                   // 允許不安全的鍵
  disableUniqueItemValues?: boolean;           // 關閉元素唯一性檢查
  disableUnsafeQuote?: boolean;               // 關閉不安全引號檢查
  expandForwardSlashKeys?: boolean;           // 展開斜線鍵
  allowParameterizedTemplatesImmediate?: boolean; // 允許立即參數化模板
}
```

---

## 自定義格式範例

### 自訂縮排和行寬

```typescript
const output = stringifyWildcardsYamlData(yamlData, {
  lineWidth: 80,
  blockQuote: true,
  collectionStyle: 'block'
});
```

### Flow 樣式（單行格式）

```typescript
const output = stringifyWildcardsYamlData(yamlData, {
  collectionStyle: 'flow'
});
```

**輸出：**
```yaml
colors: { primary: ["red, blue", "green, yellow"], secondary: ["purple", "orange"] }
```

### 關閉自動格式化

```typescript
const output = stringifyWildcardsYamlData(yamlData, {
  minifyPrompts: false,
  disableUniqueItemValues: true
});
```

---

## YAML 檔案輸入與 JSON 物件輸入的差異

### JSON 物件輸入

```typescript
const jsonData = {
  items: [
    "red , blue , green",
    "text with: colon"
  ]
};

const output = stringifyWildcardsYamlData(jsonData);
```

**輸出：**
```yaml
items:
  - red, blue, green
  - "text with: colon"
```

**說明：**
- 直接格式化字串內容
- 應用所有格式化規則

### YAML Document 輸入

```typescript
const yamlString = `
items:
  - "red , blue , green"
  - "text with: colon"
`;

const doc = parseWildcardsYaml(yamlString);
const output = stringifyWildcardsYamlData(doc);
```

**輸出：**
```yaml
items:
  - red, blue, green
  - "text with: colon"
```

**說明：**
- 先執行 `normalizeDocument` 進行規範化
- 移除不必要的引號
- 然後再格式化字串內容
- 最終輸出與 JSON 物件輸入相同

---

## 注意事項

1. **就地修改**：當輸入是 `Document` 時，會先對其進行規範化，然後再轉換為字串
2. **格式化順序**：
   - 移除零寬字元
   - 標準化空格和標點
   - 格式化動態提示（如果啟用 `minifyPrompts`）
   - 移除不必要的引號
3. **錯誤處理**：不符合規則的字串會拋出 `SyntaxError`
4. **註解保留**：YAML 註解會被保留在輸出中
5. **YAML Document vs JSON 物件**：
   - YAML Document 會先經過 `normalizeDocument` 處理
   - JSON 物件直接進行格式化
   - 最終輸出結果通常一致

---

## 參考資源

- [YAML 格式化選項](https://eemeli.org/yaml/#stringify)
- [Dynamic Prompts 語法](https://github.com/adieyal/sd-dynamic-prompts/blob/main/docs/SYNTAX.md)
- [stringifyWildcardsYamlData 錯誤說明](./stringifyWildcardsYamlData-errors.md)
