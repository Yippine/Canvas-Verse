# Canvas-Verse Database Schema Overview

**Version:** 1.0.0 (Phase 0.4)
**Database:** SQLite (Development) / PostgreSQL (Production)
**ORM:** Prisma 6.19.0
**Status:** Active and Verified

---

## Entity-Relationship Diagram

```
┌─────────────┐         ┌──────────────┐        ┌──────────────┐
│    User     │◄────────│   Session    │        │    Canvas    │
├─────────────┤      1:N │──────────────│   1:N  ├──────────────┤
│ id (PK)     │         │ id (PK)      │◄───────│ id (PK)      │
│ email (UQ)  │         │ userId (FK)  │        │ title        │
│ name        │         │ expiresAt    │        │ type (IDX)   │
│ createdAt   │         │              │        │ code         │
│ updatedAt   │         │              │        │ description  │
└─────────────┘         └──────────────┘        │ tags         │
                                                 │ userId (FK)  │
                                                 │ isPublic     │
                                                 │ views (IDX)  │
                                                 │ createdAt    │
                                                 │ updatedAt    │
                                                 └──────────────┘

FK Relationships:
  - User.id (1) ─── (N) Session.userId [CASCADE]
  - User.id (1) ─── (N) Canvas.userId [CASCADE]

Indexes:
  - users.email [UNIQUE]
  - sessions.userId [INDEX]
  - canvases.userId, createdAt, type [INDEXES]
```

---

## Data Models

### User Model

**Table Name:** `users`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String | PRIMARY KEY, UNIQUE | Auto-generated unique identifier (cuid) |
| email | String | UNIQUE, NOT NULL | User email for authentication |
| name | String | NULLABLE | User display name |
| createdAt | DateTime | NOT NULL, DEFAULT | Account creation timestamp |
| updatedAt | DateTime | NOT NULL, DEFAULT | Last update timestamp |

**Relations:**
- `sessions`: One-to-Many with Session (CASCADE delete)
- `canvases`: One-to-Many with Canvas (CASCADE delete)

**CFDS Analysis:**
- **Code:** Authentication integration, session validation
- **Files:** User profile information
- **Data:** Email, name, account metadata
- **State:** Active sessions, created/updated timestamps

**Sample Data:**
```json
{
  "id": "cm58xyz123abc",
  "email": "user@example.com",
  "name": "John Doe",
  "createdAt": "2025-11-24T00:00:00Z",
  "updatedAt": "2025-11-24T00:00:00Z"
}
```

---

### Session Model

**Table Name:** `sessions`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String | PRIMARY KEY | Session identifier (from Lucia Auth) |
| userId | String | FOREIGN KEY, NOT NULL | Reference to User |
| expiresAt | DateTime | NOT NULL | Session expiration time |

**Indexes:**
- `userId` - For efficient user session lookups

**Relations:**
- `user`: Many-to-One with User (required, CASCADE delete)

**Compatibility:**
- Lucia Auth (@lucia-auth/adapter-prisma)
- Standard session management pattern

**CFDS Analysis:**
- **Code:** Session validation, authentication logic
- **Data:** Session tokens, user reference
- **State:** Expiration time tracking

**Sample Data:**
```json
{
  "id": "session_xyz789",
  "userId": "cm58xyz123abc",
  "expiresAt": "2025-12-24T00:00:00Z"
}
```

---

### Canvas Model

**Table Name:** `canvases`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String | PRIMARY KEY, UNIQUE | Auto-generated unique identifier (cuid) |
| title | String | NOT NULL | Canvas/document title |
| type | String | NOT NULL, INDEX | Content type (canvas, code-snippet, formula, etc.) |
| code | String | NOT NULL | Main content or code |
| description | String | NULLABLE | Detailed description |
| tags | String | NOT NULL | JSON array of tags (e.g., "[\"react\", \"design\"]") |
| userId | String | FOREIGN KEY, NOT NULL, INDEX | Reference to User |
| isPublic | Boolean | NOT NULL, DEFAULT false | Public visibility flag |
| views | Int | NOT NULL, DEFAULT 0 | View counter |
| createdAt | DateTime | NOT NULL, DEFAULT | Creation timestamp |
| updatedAt | DateTime | NOT NULL, DEFAULT | Last update timestamp |

**Indexes:**
- `userId` - For filtering canvases by user
- `createdAt` - For chronological sorting
- `type` - For content type filtering

**Relations:**
- `user`: Many-to-One with User (required, CASCADE delete)

**CFDS Analysis:**
- **Code:** Canvas rendering logic, content processing
- **Files:** Canvas document storage
- **Data:** Metadata (title, type, description, tags)
- **State:** Visibility, view count, timestamps

**Sample Data:**
```json
{
  "id": "canvas_abc123def456",
  "title": "React Component Library",
  "type": "code-snippet",
  "code": "import React from 'react';\n...",
  "description": "Custom UI component collection",
  "tags": "[\"react\", \"components\", \"typescript\"]",
  "userId": "cm58xyz123abc",
  "isPublic": true,
  "views": 142,
  "createdAt": "2025-11-24T00:00:00Z",
  "updatedAt": "2025-11-24T00:00:00Z"
}
```

---

## Relationships & Constraints

### Referential Integrity

**User → Session**
- Type: One-to-Many
- Foreign Key: Session.userId → User.id
- On Delete: CASCADE
- Semantics: Deleting a user automatically deletes all their sessions

**User → Canvas**
- Type: One-to-Many
- Foreign Key: Canvas.userId → User.id
- On Delete: CASCADE
- Semantics: Deleting a user automatically deletes all their canvases

### Unique Constraints

- `users.email` - Ensures email uniqueness across users
- `users.id` - Primary key uniqueness
- `sessions.id` - Session identifier uniqueness
- `canvases.id` - Canvas identifier uniqueness

### Performance Indexes

| Index | Table | Columns | Purpose |
|-------|-------|---------|---------|
| users_email_key | users | email | Unique email lookup |
| sessions_userId_idx | sessions | userId | User session retrieval |
| canvases_userId_idx | canvases | userId | User canvas retrieval |
| canvases_createdAt_idx | canvases | createdAt | Chronological sorting |
| canvases_type_idx | canvases | type | Content type filtering |

---

## Query Patterns

### Common Queries

**Get User by Email:**
```typescript
const user = await prisma.user.findUnique({
  where: { email: "user@example.com" },
  include: { sessions: true, canvases: true }
});
```

**Get User's Sessions:**
```typescript
const sessions = await prisma.session.findMany({
  where: { userId: userId },
  orderBy: { expiresAt: 'desc' }
});
```

**Get User's Canvases:**
```typescript
const canvases = await prisma.canvas.findMany({
  where: { userId: userId },
  orderBy: { createdAt: 'desc' }
});
```

**Get Public Canvases by Type:**
```typescript
const publicCanvases = await prisma.canvas.findMany({
  where: {
    isPublic: true,
    type: "code-snippet"
  },
  orderBy: { views: 'desc' },
  take: 10
});
```

**Create Canvas:**
```typescript
const canvas = await prisma.canvas.create({
  data: {
    title: "My Canvas",
    type: "canvas",
    code: "...",
    tags: JSON.stringify(["tag1", "tag2"]),
    userId: userId
  }
});
```

**Clean Up Expired Sessions:**
```typescript
const deleted = await prisma.session.deleteMany({
  where: { expiresAt: { lt: new Date() } }
});
```

---

## Data Constraints & Validation

### Field-Level Rules

| Field | Validation | Notes |
|-------|-----------|-------|
| User.email | Email format, Unique | Pre-migration validation |
| User.name | String, Optional | Allow null for anonymous users |
| Session.id | Non-empty string | From Lucia Auth |
| Canvas.title | Non-empty string | Required for all canvases |
| Canvas.type | Enum-like values | canvas, code-snippet, formula, etc. |
| Canvas.code | Non-empty string | Must have content |
| Canvas.tags | Valid JSON array | Stored as JSON string |
| Canvas.views | Integer >= 0 | Counter field |

### Business Rules

1. **User Creation:** Email must be unique and valid
2. **Session Management:** Sessions expire based on expiresAt timestamp
3. **Canvas Ownership:** Canvas can only belong to one user
4. **Cascade Deletion:** User deletion removes all related sessions and canvases
5. **Public Visibility:** Only canvases with isPublic=true are visible to others
6. **View Tracking:** View counter incremented on canvas access

---

## Migration History

### Migration: 20251123154329_init

**Status:** Applied
**Date:** 2025-11-23T15:43:29Z
**Changes:**
- Created users table with 5 fields
- Created sessions table with 3 fields and userId foreign key
- Created canvases table with 11 fields and userId foreign key
- Created unique constraint on users.email
- Created 5 indexes for performance optimization

**SQL Generated:** 47 lines
**File:** `apps/server/prisma/migrations/20251123154329_init/migration.sql`

---

## Database Configuration

### Development Environment
```env
DATABASE_URL="file:./dev.db"
```
- SQLite file-based database
- Located at: `apps/server/prisma/dev.db`
- Size: ~57 KB (empty schema)
- Best for: Local development and testing

### Production Environment (Future)
```env
DATABASE_URL="postgresql://user:password@host:5432/canvas_verse"
```
- PostgreSQL for production
- Migration path already supported via Prisma
- Just update DATABASE_URL and run migrations

---

## Type Safety

### TypeScript Integration

All models are exported from @prisma/client:

```typescript
import { PrismaClient, User, Session, Canvas, Prisma } from '@prisma/client';

// Fully typed data access
const user: User = await prisma.user.findUnique({ where: { email: "..." } });
const sessions: Session[] = await prisma.session.findMany({ where: { userId: user.id } });
```

### Type Definitions Generated

- `User` - User model type
- `Session` - Session model type
- `Canvas` - Canvas model type
- `Prisma.UserCreateInput` - User creation input
- `Prisma.CanvasUpdateInput` - Canvas update input
- ... and more (auto-generated)

---

## Performance Considerations

### Indexing Strategy

| Index | Selectivity | Read Optimization | Use Cases |
|-------|------------|-------------------|-----------|
| email (UNIQUE) | Very High | Direct user lookup | Authentication |
| userId (sessions) | Medium | User session retrieval | Session queries |
| userId (canvases) | Medium | User canvas retrieval | Canvas queries |
| createdAt (canvases) | Medium | Timeline queries | Recent content |
| type (canvases) | Low | Content filtering | Type-based searches |

### Query Optimization Tips

1. **Batch Operations:** Use `findMany` with pagination
2. **Select Specific Fields:** Only fetch needed columns
3. **Use Indexes:** Filter by indexed fields first
4. **Avoid N+1:** Use `include` or `select` for relations
5. **Pagination:** Always limit result sets

---

## Backup & Recovery

### Database File
- Location: `apps/server/prisma/dev.db`
- Backup: Simple file copy before migrations
- Recovery: Restore file and run `prisma migrate resolve`

### Migration Rollback
```bash
# List migrations
pnpm prisma migrate status

# Rollback to previous state (dev only)
# Delete migration folder and dev.db, then re-run initial migration
```

---

## Future Enhancements

1. **Soft Deletes:** Add `deletedAt` field for recoverable deletions
2. **Audit Logging:** Track who modified what and when
3. **Relationships:** Add Canvas collaboration, sharing, and versioning
4. **Indexing:** Add composite indexes for common query patterns
5. **Partitioning:** Partition large tables by user or date

---

## References

- Prisma Documentation: https://www.prisma.io/docs/
- Lucia Auth: https://lucia-auth.com/
- SQLite: https://www.sqlite.org/
- PostgreSQL: https://www.postgresql.org/

---

**Last Updated:** 2025-11-24
**Schema Version:** 1.0.0
**Status:** Active and Verified
