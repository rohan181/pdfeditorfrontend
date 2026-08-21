import { openDB as idbOpenDB, type DBSchema, type IDBPDatabase } from 'idb'

// Local-only work recovery for in-progress editor sessions. Everything here
// lives in the browser's IndexedDB — no session, filename, or file content
// is ever sent to a server, consistent with the rest of the app's "files
// never leave your browser" model.

export interface StoredSession {
  id: string
  filename: string
  tool: string
  lastModified: number
  fileBlob: Blob
  thumbnail?: string
}

interface FileStorageSchema extends DBSchema {
  sessions: {
    key: string
    value: StoredSession
    indexes: { lastModified: number }
  }
}

const DB_NAME = 'editpdfai-db'
const STORE_NAME = 'sessions'
const DB_VERSION = 1
const MAX_SESSIONS = 20

let dbPromise: Promise<IDBPDatabase<FileStorageSchema>> | null = null

export function openDB(): Promise<IDBPDatabase<FileStorageSchema>> {
  if (!dbPromise) {
    dbPromise = idbOpenDB<FileStorageSchema>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' })
        store.createIndex('lastModified', 'lastModified')
      },
    })
  }
  return dbPromise
}

export async function saveSession(session: StoredSession): Promise<void> {
  const db = await openDB()
  await db.put(STORE_NAME, session)
  await evictOldestBeyondLimit(db)
}

export async function getSession(id: string): Promise<StoredSession | undefined> {
  const db = await openDB()
  return db.get(STORE_NAME, id)
}

export async function getAllSessions(): Promise<StoredSession[]> {
  const db = await openDB()
  const all = await db.getAll(STORE_NAME)
  return all.sort((a, b) => b.lastModified - a.lastModified)
}

export async function deleteSession(id: string): Promise<void> {
  const db = await openDB()
  await db.delete(STORE_NAME, id)
}

export async function clearAllSessions(): Promise<void> {
  const db = await openDB()
  await db.clear(STORE_NAME)
}

export function relativeTime(ts: number): string {
  const diffSec = Math.max(0, Math.round((Date.now() - ts) / 1000))
  if (diffSec < 60) return 'just now'
  const diffMin = Math.round(diffSec / 60)
  if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? '' : 's'} ago`
  const diffHr = Math.round(diffMin / 60)
  if (diffHr < 24) return `${diffHr} hour${diffHr === 1 ? '' : 's'} ago`
  const diffDay = Math.round(diffHr / 24)
  return `${diffDay} day${diffDay === 1 ? '' : 's'} ago`
}

async function evictOldestBeyondLimit(db: IDBPDatabase<FileStorageSchema>): Promise<void> {
  const count = await db.count(STORE_NAME)
  if (count <= MAX_SESSIONS) return

  const excess = count - MAX_SESSIONS
  let cursor = await db.transaction(STORE_NAME).store.index('lastModified').openCursor()
  let evicted = 0
  const idsToDelete: string[] = []
  while (cursor && evicted < excess) {
    idsToDelete.push(cursor.value.id)
    evicted++
    cursor = await cursor.continue()
  }
  await Promise.all(idsToDelete.map(id => deleteSession(id)))
}
