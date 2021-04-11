# toveri 🌐
A simple global state management solution for React and vanilla JS. Toveri is a wrapper around [Valtio](https://github.com/pmndrs/valtio) with an API similar to redux-toolkit.

[**DEMO**](https://codesandbox.io/s/new)


### Create your store

Actions can be asynchronous or synchronous, just mutate the store state when you are ready. 

```javascript
import { createStore } from 'toveri'

const [useStore] = createStore({
  state: {
    count: 1
  },
  computedState: {
    doubleCount: ({ state }) => state.count * 2
  },
  actions: {
    increment: ({ state }) => state.count++,
    decrementAsync: async ({ state }) => {
       await new Promise(res => setTimeout(res, 1000));
       state.count--
    },
    reset: ({ state }) => (state.count = 1),
  }
})
```

### Use the store hook in your react components

```javascript
import { useStore } from './store'

const MyComponent = () => {
  const { state, actions } = useStore()
  return (
    <div>
      <p>{state.count}</p>
      <button onClick={actions.increment}>Increment</button>
      <button onClick={actions.decrementAsync}>Decrement Async</button>
    </div>
  )
}
```
