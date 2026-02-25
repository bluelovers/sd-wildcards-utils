---
applyTo: "data/**/*.yaml"
---
# Wildcards YAML 路徑規則 / Wildcards YAML Path Rules

本文檔定義了本專案中 Wildcards YAML 檔案的路徑結構規範。

This document defines the path structure conventions for Wildcards YAML files in this project.

## 參考文獻 / References

- [Dynamic Prompts Wildcards Syntax](https://github.com/adieyal/sd-dynamic-prompts/blob/main/docs/SYNTAX.md)

---

## 概述 / Overview

本專案使用 YAML 格式來組織 Stable Diffusion 的 wildcards 提示詞。路徑結構分為兩大類：

1. **結構化路徑** - 具有明確層級規範的路徑
2. **鬆散路徑** - 結構較為彈性的路徑

---

## 一、結構化路徑規則 / Structured Path Rules

### 1.1 路徑格式

結構化路徑遵循以下格式：

```
__<模組名稱>/<領域區分>/<分類>/<項目名稱>/<子項目>__
```

### 1.2 模組名稱 / Module Names

| 模組名稱 | 說明 | 範例 |
|---------|------|------|
| `lazy-wildcards` | 主要 wildcards 模組 | `__lazy-wildcards/subject/...` |
| `lazy-model-yaml` | 模型相關的 wildcards | `__lazy-model-yaml/subject/...` |
| `mix-lazy-auto` | 自動混合的 wildcards | `__mix-lazy-auto/color-anything__` |

### 1.3 領域區分 / Domain Categories

#### 1.3.1 `subject` - 主體相關

放置與圖像主體相關的 wildcards，包含：

| 子分類 | 說明 | 範例路徑 |
|--------|------|----------|
| `costume-elem` | 服裝元素 | `__lazy-wildcards/subject/costume-elem/denim-texture/prompts__` |
| `costume-*` | 服裝相關 | `__lazy-wildcards/subject/costume-anything/...` |
| `env-bg` | 環境背景 | `__lazy-wildcards/subject/env-bg/...` |
| `env-elem-creatures` | 環境生物元素 | `__lazy-wildcards/subject/env-elem-creatures/chinese_zodiac/prompts__` |
| `style-*` | 風格相關 | `__lazy-wildcards/subject/style-artist/...` |
| `action` | 動作姿勢 | `__lazy-wildcards/subject/action/...` |

**注意**：`subject` 基本上包含除了 `cosplay-char` 和 `cosplay-others` 以外的所有主體相關內容。

#### 1.3.2 `cosplay-char` - 角色扮演（特定角色）

放置基於特定角色的 wildcards，包含：

| 來源類型 | 說明 | 範例路徑 |
|---------|------|----------|
| 動畫 | 動畫角色 | `__lazy-wildcards/cosplay-char/acn/char-cosplay-anime/...` |
| 漫畫 | 漫畫角色 | `__lazy-wildcards/cosplay-char/acn/char-cosplay-comic/...` |
| 遊戲 | 遊戲角色 | `__lazy-wildcards/cosplay-char/game/char-cosplay-game/...` |
| Vtuber | 虛擬主播 | `__lazy-wildcards/cosplay-char/vtuber/giwi/prompts__` |
| 真人 | 真人角色 | `__lazy-wildcards/cosplay-char/char-cosplay-real/...` |
| 創作角色 | 原創角色 | `__lazy-wildcards/cosplay-char/char-cosplay-ip-oc/...` |
| 神話 | 神話角色 | `__lazy-wildcards/cosplay-char/char-cosplay-mythology/...` |
| 超級英雄 | 超級英雄角色 | `__lazy-wildcards/cosplay-char/char-cosplay-superhero/...` |

#### 1.3.3 `cosplay-others` - 角色扮演（其他）

放置非人類角色的 wildcards，包含：

| 類型 | 說明 | 範例路徑 |
|------|------|----------|
| 機器人 | 機器人、機甲 | `__lazy-wildcards/cosplay-others/gundam/zeon-zeong/prompts__` |
| 怪獸 | 怪獸、生物 | `__lazy-wildcards/cosplay-others-creatures/...` |
| Medabots | Medabots 系列 | `__lazy-wildcards/cosplay-others/Medabots/...` |
| Battle_robot | 戰鬥機器人 | `__lazy-wildcards/cosplay-others/Battle_robot/...` |

#### 1.3.4 `cosplay-others-creatures` - 其他生物

放置真實或虛構生物的 wildcards：

| 類型 | 說明 | 範例路徑 |
|------|------|----------|
| real-like | 真實生物 | `__lazy-wildcards/cosplay-others-creatures/real-like/cat/...` |

### 1.4 必要欄位 / Required Fields

每個項目**必須**包含 `prompts` 欄位作為主要入口：

```yaml
lazy-wildcards:
  subject:
    costume-elem:
      denim-texture:
        prompts:  # 必要欄位
          - >-
            __lazy-wildcards/subject/costume-elem/denim-texture/costume-elem-main__
            {, {1-$$__lazy-wildcards/subject/costume-elem/denim-texture/costume-elem__}|}
        costume-elem-main:
          - denim texture
        costume-elem:
          - blue denim
          - distressed denim
```

### 1.5 完整路徑範例 / Complete Path Examples

```
# subject 相關
__lazy-wildcards/subject/costume-elem/denim-texture/prompts__
__lazy-wildcards/subject/env-elem-creatures/chinese_zodiac/prompts__
__lazy-wildcards/subject/style-artist/van_gogh/prompts__

# cosplay-char 相關
__lazy-wildcards/cosplay-char/vtuber/giwi/prompts__
__lazy-wildcards/cosplay-char/game/char-cosplay-game-miHoYo/prompts__

# cosplay-others 相關
__lazy-wildcards/cosplay-others/gundam/zeon-zeong/prompts__
__lazy-wildcards/cosplay-others/Medabots/Metabee/prompts__

# lazy-model-yaml 相關
__lazy-model-yaml/subject/env-bg-anything/model-VisualVisions-*/prompts__
__lazy-model-yaml/subject/env-bg-anything/model-user-CreAi-urban-cuban/prompts__
```

---

## 二、鬆散路徑規則 / Loose Path Rules

### 2.1 概述

鬆散路徑沒有嚴格的層級規範，主要用於工具函數和通用資源。

### 2.2 `utils` 工具路徑

```
__lazy-wildcards/utils/<功能名稱>__
__lazy-wildcards/utils/fn/<函數名稱>__
```

#### 範例

```yaml
# 基礎顏色
__lazy-wildcards/utils/color-base__

# 場景工具
__lazy-wildcards/utils/scenery__
__lazy-wildcards/utils/scenery-no-humans__

# 函數式 wildcards
__lazy-wildcards/utils/fn/inspired__
__lazy-wildcards/utils/fn/style-of__
__lazy-wildcards/utils/fn/pattern__
__lazy-wildcards/utils/fn/style-inspired(v=lego)__
__lazy-wildcards/utils/fn/made-of(v=victorian)__
```

### 2.3 `mix-lazy-auto` 混合路徑

```
__mix-lazy-auto/<功能名稱>__
```

#### 範例

```yaml
__mix-lazy-auto/color-anything__
```

---

## 三、YAML 檔案結構 / YAML File Structure

### 3.1 檔案組織

YAML 檔案應按照路徑層級組織：

```
data/
├── lazy-wildcards.yaml          # 主入口檔案
├── mix-lazy-auto.yaml           # 混合 wildcards
└── sub/
    ├── subject/                  # subject 領域
    │   ├── costume/              # 服裝分類
    │   │   └── elem/
    │   │       └── costume-fabric.yaml
    │   └── env-bg/               # 環境背景分類
    │       └── elem/
    │           └── creatures/
    │               └── env-creatures.yaml
    ├── char-cosplay/             # cosplay-char 領域
    │   ├── char-cosplay-vtuber.yaml
    │   └── other/
    │       └── char-other.yaml   # cosplay-others
    └── utils/
        └── utils.yaml            # 工具函數
```

### 3.2 YAML 結構規範

#### 3.2.1 基本結構

```yaml
<模組名稱>:
  <領域區分>:
    <分類>:
      <項目名稱>:
        prompts:                  # 必要：主要提示詞入口
          - "提示詞內容"
        <子項目>:                 # 可選：輔助提示詞
          - "輔助內容"
```

#### 3.2.2 完整範例

```yaml
lazy-wildcards:
  subject:
    costume-elem:
      denim-texture:
        prompts:
          - >-
            (__lazy-wildcards/subject/costume-elem/denim-texture/prompts-no-weight__{0.3:::{1.2|1.3|1.4}|})
        prompts-no-weight:
          - >-
            __lazy-wildcards/subject/costume-elem/denim-texture/costume-elem-main__
            {, {1-$$__lazy-wildcards/subject/costume-elem/denim-texture/costume-elem__}|}
        costume-elem-main:
          - denim texture
        costume-elem:
          - blue denim
          - distressed denim
          - faded denim
          - ripped denim
```

### 3.3 常見子項目名稱 / Common Sub-item Names

| 子項目名稱 | 用途說明 |
|-----------|---------|
| `prompts` | 主要提示詞入口（必要） |
| `prompts-no-weight` | 無權重版本的提示詞 |
| `main-trigger-words` | 主要觸發詞 |
| `costume` | 服裝相關 |
| `costume-elem` | 服裝元素 |
| `costume-ethnicity` | 種族特徵 |
| `costume-weapon` | 武器配件 |
| `action` | 動作 |
| `action-pose` | 動作姿勢 |
| `env` | 環境元素 |
| `env-bg` | 背景環境 |
| `env-elem` | 環境元素 |
| `env-elem-creatures` | 環境生物 |
| `style` | 風格 |
| `style-main` | 主要風格 |
| `style-artist` | 藝術家風格 |
| `expressions` | 表情 |
| `fn` | 函數式模板 |

---

## 四、路徑命名規範 / Path Naming Conventions

### 4.1 命名規則

1. **使用小寫字母**：所有路徑組件使用小寫字母
2. **使用連字符**：多個單詞之間使用 `-` 連接
3. **避免特殊字元**：僅使用字母、數字和連字符
4. **底線使用**：在特殊情況下可使用 `_`（如 `env-elem-creatures`）

### 4.2 範例

```
# 正確 ✓
__lazy-wildcards/subject/costume-elem/denim-texture/prompts__
__lazy-wildcards/cosplay-char/vtuber/giwi/prompts__

# 錯誤 ✗
__lazy-wildcards/subject/CostumeElem/denim_texture/prompts__
__lazy-wildcards/cosplay-char/VTuber/GiWi/prompts__
```

---

## 五、特殊語法 / Special Syntax

### 5.1 萬用字元 / Wildcards

使用 `*` 作為萬用字元：

```yaml
# 匹配所有 curtain 相關項目
__lazy-wildcards/subject/costume-elem/curtain-*/prompts__

# 匹配所有 VisualVisions 模型
__lazy-model-yaml/subject/env-bg-anything/model-VisualVisions-*/prompts__
```

### 5.2 函數式呼叫 / Function-like Calls

支援帶參數的函數式呼叫：

```yaml
# 帶變數的函數
__lazy-wildcards/utils/fn/style-inspired(v=lego)__
__lazy-wildcards/utils/fn/made-of(v=victorian)__
__lazy-wildcards/subject/costume-elem/sleeves-single-clothes/fn/prefix(v=sarashi)__

# 帶顏色變數
__lazy-wildcards/cosplay-char/dc_comics/supergirl/fn/style(c=!__lazy-wildcards/utils/color-base__)__
```

### 5.3 動態提示語法 / Dynamic Prompts Syntax

參考 [Dynamic Prompts Syntax](https://github.com/adieyal/sd-dynamic-prompts/blob/main/docs/SYNTAX.md)：

```yaml
# 隨機選擇
{option1|option2|option3}

# 帶權重
{1-2$$option1|option2}

# 權重範圍
{0.3:::weight1|weight2}

# 變數替換
${v=value}
${c=!__lazy-wildcards/utils/color-base__}
```

---

## 六、檔案與路徑對照表 / File and Path Mapping

### 6.1 YAML 檔案對應

| YAML 檔案路徑 | 產生的 Wildcards 路徑前綴 |
|--------------|-------------------------|
| `data/lazy-wildcards.yaml` | `__lazy-wildcards/...` |
| `data/mix-lazy-auto.yaml` | `__mix-lazy-auto/...` |
| `data/sub/subject/**/*.yaml` | `__lazy-wildcards/subject/...` |
| `data/sub/char-cosplay/**/*.yaml` | `__lazy-wildcards/cosplay-char/...` 或 `__lazy-wildcards/cosplay-others/...` |
| `data/others/lazy-model-yaml/**/*.yaml` | `__lazy-model-yaml/...` |

### 6.2 路徑層級對應

```
YAML 檔案: data/sub/subject/costume/elem/costume-fabric.yaml

YAML 結構:
lazy-wildcards:           # 模組名稱
  subject:                # 領域區分
    costume-elem:         # 分類
      denim-texture:      # 項目名稱
        prompts:          # 子項目

對應路徑:
__lazy-wildcards/subject/costume-elem/denim-texture/prompts__
```

---

## 七、最佳實踐 / Best Practices

### 7.1 組織建議

1. **相關項目群組化**：將相關的 wildcards 放在同一個分類下
2. **適當的層級深度**：避免過深或過淺的層級結構
3. **一致的命名**：使用一致的命名風格和術語

### 7.2 可重用性

1. **使用 `prompts` 和 `prompts-no-weight`**：提供有權重和無權重兩種版本
2. **模組化設計**：將常用元素提取為獨立的子項目
3. **函數式模板**：使用 `fn` 子項目建立可重用的模板

### 7.3 維護性

1. **添加註釋**：在 YAML 中使用 `#` 添加說明註釋
2. **引用來源**：標註參考資源連結（如 Civitai 模型連結）
3. **分類清晰**：確保每個項目都有明確的分類

---

## 八、快速參考 / Quick Reference

### 結構化路徑模板

```
__lazy-wildcards/subject/<分類>/<項目>/prompts__
__lazy-wildcards/cosplay-char/<來源>/<角色>/prompts__
__lazy-wildcards/cosplay-others/<類型>/<項目>/prompts__
__lazy-model-yaml/subject/<分類>/<模型>/prompts__
```

### 鬆散路徑模板

```
__lazy-wildcards/utils/<功能>__
__lazy-wildcards/utils/fn/<函數>__
__mix-lazy-auto/<功能>__
```
