# Merge Functions Documentation

## Overview

`sd-wildcards-utils` 提供了兩個主要的合併函數，用於合併 YAML Wildcards 文件：

1. **`mergeWildcardsYAMLDocumentRoots`** - 簡單的根節點合併
2. **`mergeFindSingleRoots`** - 智能單根節點查找並合併

---

## mergeWildcardsYAMLDocumentRoots

### 說明

將多個 YAML Document 的根節點內容合併到第一個 Document 中。這是一個簡單的扁平合併操作，直接將所有 Document 的 `contents` items 串聯起來。

### 函數簽名

```typescript
function mergeWildcardsYAMLDocumentRoots<T extends Pick<Document<YAMLMap>, 'contents'>>(ls: [T, ...any[]]): T
```

### 參數

- `ls` - 要合併的 Document 陣列，第一個元素作為基礎目標

### 特點

- **扁平合併**：直接將所有 root items 合併到第一個 Document
- **保留註解**：合併前會處理 YAMLMap 的註解
- **就地修改**：直接修改第一個 Document，不建立新物件

### 使用範例

```typescript
import { parseWildcardsYaml, mergeWildcardsYAMLDocumentRoots, stringifyWildcardsYamlData } from 'sd-wildcards-utils';

const doc1 = parseWildcardsYaml(`
colors:
  - red
  - blue
`);

const doc2 = parseWildcardsYaml(`
shapes:
  - circle
  - square
`);

const doc3 = parseWildcardsYaml(`
textures:
  - smooth
  - rough
`);

const merged = mergeWildcardsYAMLDocumentRoots([doc1, doc2, doc3]);

console.log(stringifyWildcardsYamlData(merged));
```

**輸出結果：**
```yaml
colors:
  - red
  - blue
shapes:
  - circle
  - square
textures:
  - smooth
  - rough
```

### 實際應用場景

```typescript
// 從多個文件讀取並合併
const files = [
  './data/part1.yaml',
  './data/part2.yaml',
  './data/part3.yaml'
];

const docs = await Promise.all(
  files.map(file => parseWildcardsYaml(await readFile(file)))
);

const merged = mergeWildcardsYAMLDocumentRoots(docs);
```

---

## mergeFindSingleRoots

### 說明

智能地查找並合併單根節點的 YAML 結構。該函數會遞歸查找每個來源的「單根路徑」，並將其合併到目標文檔的對應位置。

### 函數簽名

```typescript
function mergeFindSingleRoots<T extends IWildcardsYAMLMapRoot | IWildcardsYAMLDocument>(
  doc: T,
  list: NoInfer<T>[] | NoInfer<T>
): T
```

### 參數

- `doc` - 合併目標（可以是 YAMLMap 或 Document）
- `list` - 要合併的來源列表

### deepFindSingleRootAt 的作用

在理解 `mergeFindSingleRoots` 之前，需要先了解 `deepFindSingleRootAt`：

```typescript
function deepFindSingleRootAt(
  node: ParsedNode | Document.Parsed | IWildcardsYAMLMapRoot | IWildcardsYAMLDocument,
  result?: IResultDeepFindSingleRootAt
): IResultDeepFindSingleRootAt | undefined
```

**功能：**
- 遞歸查找 YAML 結構中的「單根節點」
- 只有一個子節點的 Map 才會被視為單根節點
- 遇到 Sequence 時停止查找（因為 Sequence 是葉節點）

**返回值類型：**
```typescript
type IResultDeepFindSingleRootAt = {
  paths: readonly string[],
  key: string,
  value: IWildcardsYAMLSeq | IWildcardsYAMLMapRoot,
  parent: IWildcardsYAMLMapRoot,
  child: IWildcardsYAMLPair,
} | {
  paths: readonly string[] & { length: 0 },
  key: void,
  value: IWildcardsYAMLMapRoot,
  parent: IWildcardsYAMLDocument,
  child: void,
}
```

### 合併規則

#### 1. 路徑匹配
根據 `deepFindSingleRootAt` 找到的路徑，在目標文檔中找到對應位置。

#### 2. 節點類型合併

| 目標類型 | 來源類型 | 合併方式 |
|---------|---------|---------|
| YAMLSeq | YAMLSeq | 串聯 items |
| YAMLMap | YAMLMap | 遞歸合併子節點 |
| 其他 | 其他 | 拋出 TypeError |

#### 3. Sequence 合併
```typescript
// 目標
shapes:
  - circle
  - square

// 來源
shapes:
  - triangle
  - hexagon

// 合併結果
shapes:
  - circle
  - square
  - triangle
  - hexagon
```

#### 4. Map 合併
```typescript
// 目標
categories:
  colors:
    - red
    - blue

// 來源
categories:
  colors:
    - green
  shapes:
    - circle

// 合併結果
categories:
  colors:
    - red
    - blue
    - green
  shapes:
    - circle
```

#### 5. 深層 Map 合併
```typescript
// 目標
root:
  category1:
    sub1:
      - a
      - b

// 來源
root:
  category1:
    sub1:
      - c
    sub2:
      - x

// 合併結果
root:
  category1:
    sub1:
      - a
      - b
      - c
    sub2:
      - x
```

### 錯誤處理

#### 1. 合併目標類型錯誤
```typescript
TypeError: The merge target should be a YAMLMap or Document. doc: ...
```

#### 2. 不支援的節點類型
```typescript
TypeError: Only YAMLMap can be merged [1]. path: [...], type: ..., node: ...
```

#### 3. 類型不匹配
```typescript
TypeError: Only allow merge same node type at paths: [...], a: ..., b: ...
```

#### 4. 不支援深層合併
```typescript
TypeError: Current does not support deep merge at paths: [...], a: ..., b: ...
```

#### 5. 子 Map 合併衝突
```typescript
AggregateError: Failure when merging sub YAMLMap. Paths: [...]. Conflicting keys: [...]
```

### 使用範例

#### 基本使用

```typescript
import { parseWildcardsYaml, mergeFindSingleRoots, stringifyWildcardsYamlData } from 'sd-wildcards-utils';

const base = parseWildcardsYaml(`
wildcards:
  colors:
    - red
    - blue
`);

const addon1 = parseWildcardsYaml(`
wildcards:
  colors:
    - green
  shapes:
    - circle
`);

const addon2 = parseWildcardsYaml(`
wildcards:
  shapes:
    - square
  textures:
    - smooth
`);

const merged = mergeFindSingleRoots(base, [addon1, addon2]);

console.log(stringifyWildcardsYamlData(merged));
```

**輸出結果：**
```yaml
wildcards:
  colors:
    - red
    - blue
    - green
  shapes:
    - circle
    - square
  textures:
    - smooth
```

#### 嵌套路徑合併

```typescript
const base = parseWildcardsYaml(`
root:
  category1:
    sub1:
      - a
      - b
`);

const addon = parseWildcardsYaml(`
root:
  category1:
    sub2:
      - c
      - d
`);

const merged = mergeFindSingleRoots(base, addon);

// 結果：sub1 和 sub2 都會被合併到 category1 下
```

#### 單一來源（自動展開）

```typescript
const base = parseWildcardsYaml(`
wildcards:
  colors:
    - red
`);

const singleAddon = parseWildcardsYaml(`
wildcards:
  shapes:
    - circle
`);

const merged = mergeFindSingleRoots(base, singleAddon); // 注意：不是陣列
```

### 實際應用場景

```typescript
// 從 test/script/output/build.ts 中的實際應用
import { mergeWildcardsYAMLDocumentRoots, mergeFindSingleRoots } from 'sd-wildcards-utils';

// 1. 先合併主文件
const mainDocs = [
  parseWildcardsYaml(await readFile('data/lazy-wildcards.yaml')),
  parseWildcardsYaml(await readFile('output/mix-lazy-auto.yaml')),
];
const baseDoc = mergeWildcardsYAMLDocumentRoots(mainDocs);

// 2. 讀取子文件
const subDocs = await Promise.all(
  globSync2('sub/**/*.{yaml,yml}').map(file =>
    parseWildcardsYaml(await readFile(file))
  )
);

// 3. 智能合併子文件到對應路徑
const finalDoc = mergeFindSingleRoots(baseDoc, subDocs);
```

---

## 兩函數的比較

| 特性 | mergeWildcardsYAMLDocumentRoots | mergeFindSingleRoots |
|-----|--------------------------------|---------------------|
| **合併方式** | 扁平合併所有 root items | 智能查找路徑並合併 |
| **適用場景** | 簡單的多文件合併 | 有層級結構的合併 |
| **路徑處理** | 不處理路徑 | 自動匹配並合併到對應路徑 |
| **深層合併** | 不支援 | 支援（Map 和 Seq） |
| **複雜度** | 簡單 | 複雜但功能強大 |
| **註解保留** | 是 | 是 |

---

## 使用建議

### 何時使用 `mergeWildcardsYAMLDocumentRoots`

- 當所有文件的根節點都是平行的，無需路徑匹配
- 簡單地將多個 Wildcards 文件合併成一個
- 文件結構相對簡單的情況

```yaml
# file1.yaml
colors:
  - red
  - blue

# file2.yaml
shapes:
  - circle
  - square

# 合併後
colors:
  - red
  - blue
shapes:
  - circle
  - square
```

### 何時使用 `mergeFindSingleRoots`

- 當文件有明確的層級結構
- 需要根據路徑智能合併到對應位置
- 子文件需要合併到主文件的特定路徑下
- 需要深層遞歸合併（Map 和 Seq）

```yaml
# base.yaml
root:
  colors:
    - red

# addon.yaml
root:
  shapes:
    - circle

# 合併後
root:
  colors:
    - red
  shapes:
    - circle
```

---

## 組合使用

兩個函數可以組合使用，處理更複雜的合併場景：

```typescript
// 1. 先合併同級別的主文件
const mainMerged = mergeWildcardsYAMLDocumentRoots([
  parseWildcardsYaml(await readFile('main1.yaml')),
  parseWildcardsYaml(await readFile('main2.yaml')),
]);

// 2. 再將子文件智能合併到對應路徑
const finalDoc = mergeFindSingleRoots(
  mainMerged,
  subDocs.map(doc => parseWildcardsYaml(doc))
);
```

---

## 注意事項

1. **就地修改**：兩個函數都會直接修改第一個參數（目標文檔），不建立新物件
2. **註解處理**：合併過程會保留 YAML 的註解，但複雜的註解位置可能需要後續調整
3. **錯誤處理**：遇到類型不匹配或其他錯誤會立即拋出異常
4. **順序依賴**：後合併的內容會追加在前面，保持原始順序

---

## 參考資源

- [YAML 官方文檔](https://eemeli.org/yaml/)
- [Dynamic Prompts 語法](https://github.com/adieyal/sd-dynamic-prompts/blob/main/docs/SYNTAX.md)
- [專案 README](../README.md)
- [parseWildcardsYaml 說明](./parseWildcardsYaml.md)

---

## 文檔索引

- [parseWildcardsYaml 說明](./parseWildcardsYaml.md) - 解析函數完整指南
- [stringifyWildcardsYamlData 錯誤說明](./stringifyWildcardsYamlData-errors.md) - 所有錯誤類型和驗證規則
- [mergeFindSingleRoots 與 mergeWildcardsYAMLDocumentRoots](./merge-functions.md) (本文) - 合併函數使用說明
- [stringifyWildcardsYamlData 輸出格式說明](./stringifyWildcardsYamlData-format.md) - 完整的輸出格式指南

