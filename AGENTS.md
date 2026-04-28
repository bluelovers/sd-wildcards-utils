# AGENTS.md - AI 代理專案行為規範

本文檔定義了 AI 代理在 sd-wildcards-utils 專案中的行為規範與約定。

This document defines project-specific agent behavior conventions for the sd-wildcards-utils project.

## 命名規範 / Naming Conventions

### YAML 路徑命名

遵循 `.github/instructions/wildcards-path-rules.instructions.md` 中的規範：

- **Key 名稱**: 使用 Snake_case
- **路徑格式**: `__<模組名稱>/<領域>/<分類>/<項目>/prompts__`
- **檔案組織**: 參考 `docs/parseWildcardsYaml.md`

### TypeScript 命名

- **Enum**: 以 `Enum` 開頭 (PascalCase)
- **Interface**: 以 `I` 開頭 (PascalCase)
- **Type Alias**: 以 `I` 開頭 (PascalCase)

詳見 `C:\Users\User\.config\opencode\rules\typescript-naming-convention.md`

## 提交規範 / Commit Conventions

遵循 `.github/commit-convention.md`：

- **格式**: `<type>(<scope>): <description>`
- **語言**: 繁體中文
- **類型**: feat, fix, docs, style, refactor, perf, test, chore, build, ci, types, wip, dep

參考: https://www.conventioncommits.org/zh-hant

## 測試規範 / Testing Conventions

### 測試框架

- **框架**: Jest
- **快照測試**: 優先使用 `toMatchSnapshot()`
- **測試檔案**: `*.spec.ts` (Jest)
- **執行**: `yarn run test`

### 測試原則

- **Snapshot 優先**: 輸出結構複雜且穩定時使用快照測試
- **命名空間**: 測試檔案使用 `[feature].spec.ts` 格式
- **臨時目錄**: 使用 `test/temp/` 而非直接在根目錄

詳見 `C:\Users\User\.config\opencode\rules\test-file-best-practices.md`

## 檔案結構 / File Structure

```
AGENTS.md              # 本檔案 - AI 代理行為規範
```

## 常用指令 / Common Commands

```bash
# 測試
yarn run test
```

## 專案依賴 / Project Dependencies

### 主要依賴

- `yaml` - YAML 解析
- `picomatch` - Glob matching
- `@bluelovers/extract-brackets` - Brackets extraction
- `lazy-aggregate-error` - Error aggregation
- `zero-width` - Zero-width characters

### 開發依賴

- `jest` - 測試框架
- `ts-jest` - TypeScript Jest 支援
- `typescript` - TypeScript 編譯器
- `tsdx` - 函式庫建置工具

## 參考文獻 / References

- [Dynamic Prompts Wildcards Syntax](https://github.com/adieyal/sd-dynamic-prompts/blob/main/docs/SYNTAX.md)
- [Conventional Commits](https://www.conventioncommits.org/zh-hant)
- [OpenCode AGENTS.md](https://github.com/bluelovers/sd-wildcards-utils/blob/master/.github/AGENTS.md) (same file)