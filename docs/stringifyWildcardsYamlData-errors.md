# stringifyWildcardsYamlData Errors Documentation

## Overview

`stringifyWildcardsYamlData` 函數會對輸入的 YAML 資料進行驗證和規範化。當資料不符合規則時，會拋出錯誤。本文件說明所有支援偵測的錯誤類型及其規則。

## 錯誤類型

### 1. Document 類型錯誤

**錯誤訊息範例：**
```
The 'contents' property of the provided YAML document must be a YAMLMap. Received: ...
```

**說明：**
- 當 YAML 文件的 `contents` 不是 `YAMLMap` 類型時拋出
- Wildcards YAML 必須是以 Map (物件) 為根節點

---

### 2. 空文件錯誤

**錯誤訊息範例：**
```
The provided JSON contents should not be empty. null
```

**說明：**
- 當資料為 `undefined` 或 `null` 時拋出
- 可透過 `allowEmptyDocument` 選項允許空文件

---

### 3. 空根鍵錯誤

**錯誤訊息範例：**
```
The provided JSON contents must contain at least one key.
```

**說明：**
- 根物件必須包含至少一個鍵值對

---

### 4. 多根鍵錯誤

**錯誤訊息範例：**
```
The provided JSON object cannot have more than one root key. Only one root key is allowed unless explicitly allowed by the 'allowMultiRoot' option.
```

**說明：**
- 根物件只能有一個根鍵
- 可透過 `allowMultiRoot` 選項允許多個根鍵

---

### 5. 無效的 Map 語法錯誤

**錯誤訊息範例：**
```
Invalid SYNTAX. paths: [...], key: ..., node: ..., elem: ...
```

**說明：**
- Map 中存在無效的鍵值對（Pair 的 value 為 `null` 或不是有效的 Pair）
- 通常發生在 YAML 語法錯誤，如鍵後缺少值

---

### 6. Seq 元素類型錯誤

**錯誤訊息範例：**
```
Invalid SYNTAX. entry type should be 'Scalar', but got 'Map'. paths: [...], entryIndex: 0, entry: ..., nodeKey: ..., node: ...
```

**說明：**
- Sequence 中的元素必須是 Scalar (純量值，字串/數字等)
- 不允許巢狀的物件或陣列

**正確範例：**
```yaml
valid:
  - "text1"
  - "text2"
  - "text3"
```

**錯誤範例：**
```yaml
invalid:
  - "text1"
  - key: value  # 錯誤：不允許巢狀物件
  - ["nested"]  # 錯誤：不允許巢狀陣列
```

---

### 7. 無效的 Key 錯誤

**錯誤訊息範例：**
```
Invalid Key. paths: [...], key: ..., keyNodeValue: "...", keyNode: ...
```

**說明：**
- 鍵名必須符合安全鍵規則
- 可透過 `allowUnsafeKey` 選項關閉此檢查

#### 安全鍵規則 (`isSafeKey`)

鍵名只允許以下字元：
- 字母：`a-z`、`A-Z`
- 數字：`0-9`
- 特殊字元：`_`、`/`、`.`、`-`

並且**不允許**：
- 以非字母數字開頭或結尾
- 包含 `__` (雙底線)
- 包含 `..` (雙點)
- 包含 `--` (雙連字號)
- 包含 `//` (雙斜線)
- 包含連續的點、底線或連字號 (如 `._`、`/.`、`__`、`..`、`--`)
- 路徑中包含 `[._-]/` 或 `/[._-]` 的組合

**正確範例：**
```yaml
valid_keys:
  key: "value"
  my_key: "value"
  my-key: "value"
  my.key: "value"
  my/key: "value"
  category1/subcategory: "value"
```

**錯誤範例：**
```yaml
invalid_keys:
  "": "value"              # 錯誤：空鍵名
  " key": "value"          # 錯誤：以空格開頭
  "key ": "value"          # 錯誤：以空格結尾
  "__key": "value"         # 錯誤：雙底線開頭
  "key__": "value"         # 錯誤：雙底線結尾
  "..key": "value"         # 錯誤：雙點開頭
  "key..": "value"         # 錯誤：雙點結尾
  "--key": "value"         # 錯誤：雙連字號開頭
  "key--": "value"         # 錯誤：雙連字號結尾
  "//key": "value"         # 錯誤：雙斜線開頭
  "key//": "value"         # 錯誤：雙斜線結尾
  "key._": "value"         # 錯誤：包含 ._ 組合
  "key/": "value"          # 錯誤：以 / 結尾
  "/key": "value"          # 錯誤：以 / 開頭
```

#### 零寬字元檢測

如果鍵名中包含零寬字元 (zero-width characters)，錯誤訊息會額外包含：
```
Invalid Key. paths: [...], key: ..., keyNodeValue: "...", keyNode: ..., exists zero-width characters
```

零寬字元包括：
- U+200B: 零寬空格
- U+200C: 零寬不連字
- U+200D: 零寬連字
- U+FEFF: 零寬不斷行空格 (BOM)

---

### 8. Seq 元素重複錯誤

**說明：**
- Sequence 中的元素值必須唯一
- 可透過 `disableUniqueItemValues` 選項關閉此檢查

**正確範例：**
```yaml
valid:
  - "text1"
  - "text2"
  - "text3"
```

**錯誤範例：**
```yaml
invalid:
  - "text1"
  - "text1"  # 錯誤：重複的值
```

---

## 選項說明

### `allowEmptyDocument`
允許空的 YAML 文件
- 類型：`boolean`
- 預設：`false`

### `allowMultiRoot`
允許多個根鍵
- 類型：`boolean`
- 預設：`false`

### `allowUnsafeKey`
允許不安全的鍵名
- 類型：`boolean`
- 預設：`false`

### `disableUniqueItemValues`
關閉 Sequence 元素唯一性檢查
- 類型：`boolean`
- 預設：`false`

### `expandForwardSlashKeys`
將包含斜線的鍵展開為巢狀物件
- 類型：`boolean`
- 預設：`false`

**範例：**
```yaml
# 輸入
"key/subkey":
  - "value1"

# 啟用 expandForwardSlashKeys 後展開為
key:
  subkey:
    - "value1"
```

---

## 完整範例

### 正確的 YAML

```yaml
wildcards:
  colors:
    - "red"
    - "blue"
    - "green"
  characters:
    - "1girl"
    - "1boy"
  effects:
    - "blur"
    - "bokeh"
```

### 錯誤的 YAML

```yaml
# 錯誤 1：多根鍵
root1:
  - "value1"
root2:
  - "value2"

# 錯誤 2：無效的鍵名
" invalid key":
  - "value1"

# 錯誤 3：Seq 中包含非 Scalar 元素
nested:
  - "text1"
  - key: value  # 錯誤
  - ["nested"]  # 錯誤
```

---

## 參考資源

- [Dynamic Prompts 語法](https://github.com/adieyal/sd-dynamic-prompts/blob/main/docs/SYNTAX.md)
- [YAML 1.2 規格](https://yaml.org/spec/1.2/spec.html)

---

## 文檔索引

- [stringifyWildcardsYamlData 錯誤說明](./stringifyWildcardsYamlData-errors.md) (本文) - 所有錯誤類型和驗證規則
- [mergeFindSingleRoots 與 mergeWildcardsYAMLDocumentRoots](./merge-functions.md) - 合併函數使用說明
- [stringifyWildcardsYamlData 輸出格式說明](./stringifyWildcardsYamlData-format.md) - 完整的輸出格式指南

