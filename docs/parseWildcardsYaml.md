# parseWildcardsYaml 說明

## Overview

`parseWildcardsYaml` 函數用於將 Stable Diffusion wildcards YAML 源代碼解析為 YAML Document 物件。它提供了完整的解析、驗證和規範化功能。

---

## 函數簽名

```typescript
export function parseWildcardsYaml<Contents extends YAMLMap = IWildcardsYAMLMapRoot, Strict extends boolean = true>(
  source: IParseWildcardsYamlInputSource,
  opts?: IOptionsParseDocument
): Contents extends ParsedNode
  ? IWildcardsYAMLDocumentParsed<Contents, Strict>
  : IWildcardsYAMLDocument<Contents, Strict>
```

### 泛型參數

| 參數 | 類型 | 預設值 | 說明 |
|------|------|--------|------|
| `Contents` | `YAMLMap` | `IWildcardsYAMLMapRoot` | YAML Map 節點類型 |
| `Strict` | `boolean` | `true` | 是否使用嚴格模式 |

### 參數

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| `source` | `IParseWildcardsYamlInputSource` | 是 | YAML 源代碼（string 或 Uint8Array） |
| `opts` | `IOptionsParseDocument` | 否 | 解析選項 |

### 返回值

根據泛型參數返回不同類型：

- **Parsed 模式** (`Strict extends true`): `IWildcardsYAMLDocumentParsed<Contents, Strict>`
- **非 Parsed 模式**: `IWildcardsYAMLDocument<Contents, Strict>`

---

## 輸入來源

### 1. 字串輸入

```typescript
import { parseWildcardsYaml } from 'sd-wildcards-utils';

const yamlString = `
wildcards:
  colors:
    - red
    - blue
    - green
`;

const doc = parseWildcardsYaml(yamlString);
```

### 2. Uint8Array 輸入

```typescript
import { parseWildcardsYaml } from 'sd-wildcards-utils';
import { readFileSync } from 'fs';

const buffer = readFileSync('wildcards.yaml');
const doc = parseWildcardsYaml(buffer);
```

### 3. 空值處理

```typescript
// 當 allowEmptyDocument: true 時，允許空字串或 null
const doc1 = parseWildcardsYaml('', { allowEmptyDocument: true });
const doc2 = parseWildcardsYaml(null, { allowEmptyDocument: true });
```

---

## 解析選項

### IOptionsParseDocument

```typescript
interface IOptionsParseDocument extends ParseOptions, 
                                 DocumentOptions, 
                                 SchemaOptions, 
                                 IOptionsSharedWildcardsYaml {
  toStringDefaults?: IOptionsStringify;
}
```

### 解析選項

| 選項 | 類型 | 預設值 | 說明 |
|------|------|--------|------|
| `prettyErrors` | boolean | `true` | 格式化錯誤訊息 |
| `expandForwardSlashKeys` | boolean | `true` | 將斜線鍵展開為巢狀物件 |
| `allowEmptyDocument` | boolean | `false` | 允許空文檔 |
| `allowMultiRoot` | boolean | `false` | 允許多個根鍵 |

### 共用選項（IOptionsSharedWildcardsYaml）

| 選項 | 類型 | 預設值 | 說明 |
|------|------|--------|------|
| `minifyPrompts` | boolean | `false` | 壓縮提示內容 |
| `allowUnsafeKey` | boolean | `false` | 允許不安全的鍵名 |
| `disableUniqueItemValues` | boolean | `false` | 關閉元素唯一性檢查 |
| `disableUnsafeQuote` | boolean | `false` | 關閉不安全引號檢查 |
| `allowParameterizedTemplatesImmediate` | boolean | `false` | 允許立即參數化模板 |

### toStringDefaults

此選項控制文檔轉換為字串時的預設行為：

```typescript
const doc = parseWildcardsYaml(yamlString, {
  toStringDefaults: {
    lineWidth: 80,
    blockQuote: true,
    collectionStyle: 'block'
  }
});

// 使用 toString() 時會應用這些選項
const output = doc.toString();
```

---

## 功能說明

### 1. 展開斜線鍵（expandForwardSlashKeys）

當 `expandForwardSlashKeys: true` 時，包含斜線的鍵會被展開為巢狀物件：

**輸入 YAML：**
```yaml
"colors/red":
  - value1
"colors/blue":
  - value2
```

**解析後的結構：**
```typescript
{
  colors: {
    red: ['value1'],
    blue: ['value2']
  }
}
```

---

### 2. 驗證

函數會自動驗證解析後的 YAML 資料，確保符合 wildcards 格式規則。

**驗證項目：**
- Document 類型必須是 YAMLMap
- 根節點必須至少包含一個鍵
- 所有鍵名必須符合安全規則（除非 `allowUnsafeKey: true`）
- Sequence 元素必須是 Scalar 類型
- Sequence 元素不能重複（除非 `disableUniqueItemValues: true`）
- Map 語法必須正確

**驗證失敗範例：**
```typescript
// 會拋出 SyntaxError
try {
  const doc = parseWildcardsYaml(`
" unsafe key":
  - value
`);
} catch (error) {
  console.error(error); // SyntaxError: Invalid KEY [UNSAFE_KEY]
}
```

---

## 使用範例

### 基本使用

```typescript
import { parseWildcardsYaml } from 'sd-wildcards-utils';

const yamlString = `
wildcards:
  colors:
    - red
    - blue
  shapes:
    - circle
    - square
`;

const doc = parseWildcardsYaml(yamlString);

// 存取內容
console.log(doc.contents); // YAMLMap 節點

// 存取特定路徑
const colors = doc.getIn(['wildcards', 'colors']);
console.log(colors); // YAMLSeq 節點

// 轉換為 JSON
const json = doc.toJSON();
console.log(json);
// {
//   wildcards: {
//     colors: ['red', 'blue'],
//     shapes: ['circle', 'square']
//   }
// }
```

### 使用選項

```typescript
import { parseWildcardsYaml } from 'sd-wildcards-utils';

const doc = parseWildcardsYaml(yamlString, {
  allowEmptyDocument: true,
  expandForwardSlashKeys: true,
  allowUnsafeKey: false,
  minifyPrompts: true,
  toStringDefaults: {
    lineWidth: 0,
    blockQuote: true
  }
});
```

### 與 stringifyWildcardsYamlData 配合使用

```typescript
import { parseWildcardsYaml, stringifyWildcardsYamlData } from 'sd-wildcards-utils';

const inputYaml = `
wildcards:
  colors:
    - "red , blue"
    - "green"
`;

// 解析
const doc = parseWildcardsYaml(inputYaml);

// 修改內容
doc.setIn(['wildcards', 'colors', 0], 'red, blue');

// 格式化輸出
const output = stringifyWildcardsYamlData(doc);
console.log(output);
```

**輸出：**
```yaml
wildcards:
  colors:
    - red, blue
    - green
```

---

## Document 物件

### IWildcardsYAMLDocument

```typescript
interface IWildcardsYAMLDocument<Contents extends YAMLMap, Strict extends boolean> {
  options: Document["options"] & IOptionsParseDocument;
  contents: Strict extends true ? Contents | null : Contents;
  
  toJSON<T = IRecordWildcards>(jsonArg?: string | null, onAnchor?: ToJSOptions['onAnchor']): T;
}
```

### 主要屬性和方法

| 屬性/方法 | 類型 | 說明 |
|-----------|------|------|
| `contents` | `Contents \| null` | YAML 內容 |
| `options` | `IOptionsParseDocument` | 文檔選項 |
| `toJSON()` | `Function` | 轉換為 JSON 物件 |
| `toString()` | `Function` | 轉換為 YAML 字串 |
| `getIn(path)` | `Function` | 根據路徑獲取節點 |
| `setIn(path, value)` | `Function` | 根據路徑設置節點 |
| `deleteIn(path)` | `Function` | 根據路徑刪除節點 |
| `has(path)` | `Function` | 檢查路徑是否存在 |

---

## 錯誤處理

### 常見錯誤類型

#### 1. 解析錯誤

```typescript
// YAML 語法錯誤
const doc = parseWildcardsYaml(`
key:
  - value
  - unclosed string
`);
// 拋出: YAMLException
```

#### 2. 驗證錯誤

```typescript
// 不安全的鍵名
const doc = parseWildcardsYaml(`
"  invalid key":
  - value
`);
// 拋出: SyntaxError: Invalid KEY [UNSAFE_KEY]
```

#### 3. Document 類型錯誤

```typescript
// Document 內容不是 Map
const doc = parseWildcardsYaml(`
- item1
- item2
`);
// 拋出: SyntaxError: The 'contents' property of provided YAML document must be a YAMLMap
```

---

## 高級用法

### 自訂驗證

```typescript
import { parseWildcardsYaml } from 'sd-wildcards-utils';

const doc = parseWildcardsYaml(yamlString, {
  allowUnsafeKey: false,  // 強制檢查鍵名安全
  disableUniqueItemValues: true  // 允許重複元素
});
```

### 處理空文檔

```typescript
const doc = parseWildcardsYaml('', {
  allowEmptyDocument: true
});

console.log(doc.contents); // null
console.log(doc.toString()); // 空字串
```

### 與其他函數配合

```typescript
import {
  parseWildcardsYaml,
  normalizeDocument,
  stringifyWildcardsYamlData
} from 'sd-wildcards-utils';

// 解析
const doc = parseWildcardsYaml(yamlString);

// 規範化
normalizeDocument(doc);

// 輸出
const output = stringifyWildcardsYamlData(doc);
```

---

## 性能考慮

1. **重複解析**：如果需要多次使用同一 YAML，解析一次後緩存 Document 物件
2. **展開鍵**：`expandForwardSlashKeys` 會增加解析時間，只在需要時啟用
3. **驗證**：生產環境中建議保留驗證，確保資料完整性

---

## 與原生 YAML parse 的差異

| 特性 | `parseDocument` (yaml 套件) | `parseWildcardsYaml` |
|------|---------------------------|---------------------|
| 鍵名驗證 | ❌ | ✅ |
| 展開斜線鍵 | ❌ | ✅ |
| 值類型驗證 | ❌ | ✅ |
| 元素唯一性檢查 | ❌ | ✅ |
| 自動規範化 | ❌ | ✅ |
| Wildcards 語法支援 | ❌ | ✅ |

---

## 注意事項

1. **就地修改**：`parseWildcardsYaml` 返回的 Document 物件可以被就地修改
2. **嚴格模式**：預設使用嚴格模式，`contents` 可以是 `null`
3. **選項合併**：選項會與預設值合併，不會覆蓋未提供的選項
4. **錯誤拋出**：驗證失敗會立即拋出錯誤，不會返回部分結果
5. **展開順序**：斜線鍵展開在驗證之前進行

---

## 完整範例

```typescript
import { parseWildcardsYaml, stringifyWildcardsYamlData } from 'sd-wildcards-utils';

// 輸入 YAML
const yamlString = `
wildcards:
  colors/primary:
    - "red , blue"
    - "green , yellow"
  colors/secondary:
    - "purple"
    - "orange"
  effects:
    - "blur"
    - "bokeh"
`;

// 解析（展開斜線鍵）
const doc = parseWildcardsYaml(yamlString, {
  expandForwardSlashKeys: true,
  prettyErrors: true
});

// 存取展開後的結構
const primaryColors = doc.getIn(['wildcards', 'colors', 'primary']);
console.log(primaryColors); // ['red, blue', 'green, yellow']

// 修改內容
doc.setIn(['wildcards', 'effects'], ['blur', 'bokeh', 'grain']);

// 格式化輸出
const output = stringifyWildcardsYamlData(doc);
console.log(output);
```

**輸出：**
```yaml
wildcards:
  colors:
    primary:
      - red, blue
      - green, yellow
    secondary:
      - purple
      - orange
  effects:
    - blur
    - bokeh
    - grain
```

---

## 參考資源

- [YAML 套件文檔](https://eemeli.org/yaml/)
- [Dynamic Prompts 語法](https://github.com/adieyal/sd-dynamic-prompts/blob/main/docs/SYNTAX.md)
- [stringifyWildcardsYamlData 錯誤說明](./stringifyWildcardsYamlData-errors.md)
- [stringifyWildcardsYamlData 輸出格式說明](./stringifyWildcardsYamlData-format.md)

---

## 文檔索引

- [stringifyWildcardsYamlData 錯誤說明](./stringifyWildcardsYamlData-errors.md) - 所有錯誤類型和驗證規則
- [mergeFindSingleRoots 與 mergeWildcardsYAMLDocumentRoots](./merge-functions.md) - 合併函數使用說明
- [parseWildcardsYaml 說明](./parseWildcardsYaml.md) (本文) - 解析函數完整指南
- [stringifyWildcardsYamlData 輸出格式說明](./stringifyWildcardsYamlData-format.md) - 完整的輸出格式指南
