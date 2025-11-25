---
name: formula-restore
description: 從歷史記錄恢復指定的 Formula-Contract 工作流程
---

# Formula 歷史恢復工具

從 `.claude/formula/history/` 恢復指定歷史記錄到當前工作目錄。

## 參數格式

```bash
/formula-restore [日期] [流水號] [hash] [描述關鍵字]
```

- **日期** (YYYYMMDD): `20250925`
- **流水號** (兩碼): `01`、`02`
- **hash** (短hash): `a1b2c3d`
- **描述關鍵字**: `"Add user login"`

## 使用範例

```bash
/formula-restore 20250925           # 當日最新
/formula-restore 20250925 02        # 當日第2個
/formula-restore a1b2c3d            # 指定hash
/formula-restore "Add user login"   # 描述匹配
```

## 執行邏輯

1. 搜尋匹配目錄
2. 多個結果時列出選項
3. 檢測當前工作狀態，有內容時自動執行 `/formula-archive`
4. 復原 `FORMULA.md` 和 `.claude/formula/workflow/`

## 目錄結構

```
.claude/formula/history/
└── 20250925/
    └── 01 - a1b2c3d - Add user login/
        ├── FORMULA.md
        └── workflow/
```

## 原則

不刪除歷史記錄，保持完整歷史。
