-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_canvases" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "tags" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "isExample" BOOLEAN NOT NULL DEFAULT false,
    "views" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "canvases_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_canvases" ("code", "createdAt", "description", "id", "isPublic", "tags", "title", "type", "updatedAt", "userId", "views") SELECT "code", "createdAt", "description", "id", "isPublic", "tags", "title", "type", "updatedAt", "userId", "views" FROM "canvases";
DROP TABLE "canvases";
ALTER TABLE "new_canvases" RENAME TO "canvases";
CREATE INDEX "canvases_userId_idx" ON "canvases"("userId");
CREATE INDEX "canvases_createdAt_idx" ON "canvases"("createdAt");
CREATE INDEX "canvases_type_idx" ON "canvases"("type");
CREATE INDEX "canvases_isExample_idx" ON "canvases"("isExample");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
