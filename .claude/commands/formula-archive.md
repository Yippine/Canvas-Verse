---
name: formula-archive
description: 封存 Formula-Contract 的當前記錄到歷史目錄
---

# Formula 歷史封存工具

將當前 `FORMULA.md` 和 `.claude/formula/workflow/` 封存到歷史目錄並清空工作區。

## 執行步驟
1. 建立目錄 `.claude/formula/history/YYYYMMDD/流水號 - hash - 描述/`
   - 流水號：當日遞增序號（兩碼前補零：01, 02...）
   - hash：`git rev-parse --short HEAD`
   - 描述：git commit message
2. 移動 `FORMULA.md` 和 `.claude/formula/workflow/` 到歷史目錄
3. 建立新的 `FORMULA.md` 空文件和 `.claude/formula/workflow/` 空目錄

## 智能判斷
- 無實質內容（空 FORMULA.md 和空 workflow）時跳過封存
- 相同 git commit 已封存且內容相同時，清理工作目錄準備下階段
- 相同 git commit 但內容不同時，建立增量版本（02, 03...）
