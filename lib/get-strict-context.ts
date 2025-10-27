import React from 'react'

type ContextTuple<T> = [React.Provider<T | undefined>, () => T]

export function getStrictContext<T>(name = 'Context'): ContextTuple<T> {
  const ctx = React.createContext<T | undefined>(undefined)

  function useCtx(): T {
    const c = React.useContext(ctx)
    if (c === undefined) {
      throw new Error(`${name} must be used within a ${name}.Provider`)
    }
    return c
  }

  return [ctx.Provider, useCtx]
}

export default getStrictContext
