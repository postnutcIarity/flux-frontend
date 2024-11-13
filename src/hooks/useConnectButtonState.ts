import { useEffect, useState } from 'react'
import { useDappToolkit } from './useDappToolkit'
import { useAccounts } from './useAccounts'

export const useConnectButtonState = () => {
  const dAppToolkit = useDappToolkit()
  const { state: accountState } = useAccounts()
  const [state, setState] = useState<'pending' | 'success' | 'error' | 'default'>('default')

  useEffect(() => {
    const subscription = dAppToolkit.buttonApi.status$.subscribe((buttonState) => {
      setState(buttonState)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [dAppToolkit])

  // Return success if the account is connected, otherwise return the button state
  return accountState.isConnected ? 'success' : state
}