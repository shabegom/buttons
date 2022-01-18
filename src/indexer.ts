import {App} from 'obsidian'
import { ButtonCache } from './types'

const buildIndex = (app: App): ButtonCache[] => {
  console.time('indexer')
  const files = app.vault.getMarkdownFiles()
  const index = files.reduce((acc, file) => {
    const {sections} = app.metadataCache.getFileCache(file)
    if (sections) {
      const buttons = sections.filter(section => section.id && section.id.includes('button'))
      buttons.forEach(button => {
        acc.push({
          file,
          id: button.id,
          location: button.position
        })
      })
    }
    return acc
  }, [])
  console.timeEnd('indexer')
  return index
  }


export {buildIndex}
