import { readFile, writeFile } from 'fs/promises'
import { readGUID, saveGUID } from '../../ui/main-process-proxy'
import { uuid } from '../uuid'

/** The localStorage key for the stats GUID. */
const StatsGUIDKey = 'stats-guid'

let cachedGUID: string | null = null

/** Get the stats GUID for the Renderer process. */
export async function getRendererGUID(): Promise<string> {
  if (!cachedGUID) {
    let guid = localStorage.getItem(StatsGUIDKey)
    if (guid) {
      await saveGUID(guid)
      localStorage.removeItem(StatsGUIDKey)
    } else {
      guid = await readGUID()
    }

    cachedGUID = guid
  }

  return cachedGUID
}

/** Get the stats GUID for the Main process. */
export async function getMainGUID(): Promise<string> {
  if (!cachedGUID) {
    let guid = await readGUIDFile()

    if (guid === '') {
      guid = uuid()
      await saveGUIDFile(guid)
    }

    cachedGUID = guid
  }

  return cachedGUID
}

export async function readGUIDFile(): Promise<string> {
  let guid = ''

  try {
    guid = await readFile('.guid', 'utf8')
  } catch (e) {
    guid = uuid()
    await saveGUIDFile(guid)
  }

  return guid
}

export async function saveGUIDFile(guid: string) {
  await writeFile('.guid', guid, 'utf8')
}
