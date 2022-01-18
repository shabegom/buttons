
import {App} from 'obsidian'
import {ButtonCache} from '../../types'
import {removeButtonInCurrentNote as remove} from '../../utils'

const removeMutation = (ids: string, app: App, index: ButtonCache[]) => {
  return () => {
  const buttonsToRemove = index.filter(button => ids.includes(button.id.split('-')[1]))
  buttonsToRemove.forEach(button => {
    remove(app, button.position)
  })
  }
}

export default removeMutation
