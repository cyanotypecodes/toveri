import { proxy, useSnapshot, subscribe } from 'valtio'
import { addComputed, devtools, subscribeKey } from 'valtio/utils'

const objectMap = (obj: object, fn: Function) => {
  return Object.entries(obj).reduce((accObj, [key, value], index) => {
    return { ...accObj, [key]: fn(key, value, index) }
  }, {})
}

interface Props {
  state: object
  computedState?: object
  actions: object
  config?: {
    devTools: {
      stateName: string
    }
    persist: {
      name: string
      onLoad: () => any
      onSave: () => 'lo'
    }
  }
  subscriptions: { subscribeTo?: any; callback: any }[]
}

// Create an abstracted interface for a Valtio proxy store.
export const createStore = (props: Props) => {
  const state = proxy({
    ...props.state,
  })

  if (props?.config?.devTools.stateName) {
    devtools(state, props.config.devTools.stateName || 'State')
  }

  const actions = objectMap(props.actions, fn => {
    return (props: Parameters<typeof fn>[0]) => fn({ state, actions }, props)
  })

  // General form.
  const store: {
    state: typeof state
    actions: typeof actions
  } = { state, actions }

  props.subscriptions.forEach(sub => {
    const subscribedState = sub.subscribeTo({ state })
    if (
      !Array.isArray(subscribedState) &&
      typeof subscribedState === 'object'
    ) {
      subscribe(subscribedState, () => sub.callback(store))
      return
    }
    subscribeKey(subscribedState[0], subscribedState[1], () =>
      sub.callback(store)
    )
  })

  // Add computedState to store.
  for (const key in props.computedState) {
    addComputed(state, {
      [key]: () => props.computedState[key](store),
    })
  }

  // For consumption in React.
  const useStore = () => {
    return { state: useSnapshot(state), actions }
  }

  return [store, useStore]
}
