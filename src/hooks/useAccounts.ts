import { useCallback, useEffect, useState } from 'react'
import { useDappToolkit } from './useDappToolkit'
import { Account } from '@radixdlt/radix-dapp-toolkit'
import { State } from '@radixdlt/babylon-gateway-api-sdk'
import { switchMap, map } from 'rxjs'
import {
  FungibleResource,
  NonFungibleResource,
  transformFungibleTokens,
  transformNonFungibleTokens,
} from '../transformers/addTokens'
import { useGateway } from './useGateway'

export type AccountWithTokens = Account &
  Account & { fungibleTokens: Record<string, FungibleResource> } & {
    nonFungibleTokens: Record<string, NonFungibleResource[]>
  }

export type AccountState = {
  accounts: AccountWithTokens[]
  status: 'pending' | 'success' | 'error'
  hasLoaded: boolean
  isConnected: boolean
}

const useWithTokens = (stateApi: State) => {
  return useCallback(
    (accounts: Account[]) =>
      stateApi
        .getEntityDetailsVaultAggregated(
          accounts.map((account) => account.address)
        )
        .then((data) =>
          Promise.all(
            data.map((item) =>
              transformFungibleTokens(item?.fungible_resources)
                .then((fungibleTokens) => ({
                  ...accounts.find(
                    (account) => account.address === item.address
                  )!,
                  fungibleTokens,
                }))
                .then((values) =>
                  transformNonFungibleTokens(item?.non_fungible_resources).then(
                    (nonFungibleTokens) => ({
                      ...values,
                      nonFungibleTokens,
                    })
                  )
                )
            )
          )
        ),
    [stateApi]
  )
}

export const useAccounts = () => {
  const dAppToolkit = useDappToolkit()
  const gatewayApi = useGateway()
  const [state, setState] = useState<AccountState>({ 
    accounts: [], 
    status: 'pending', 
    hasLoaded: false,
    isConnected: false
  })

  const withTokens = useWithTokens(gatewayApi.state)

  useEffect(() => {
    const subscription = dAppToolkit.walletApi.walletData$
      .pipe(
        map((walletData) => {
          setState(prev => ({
            ...prev,
            isConnected: walletData.connected,
            status: 'pending'
          }))
          return walletData.accounts
        }),
        switchMap((accounts) => {
          return withTokens(accounts)
            .then((accounts: any[]) => {
              setState({
                accounts,
                status: 'success',
                hasLoaded: true,
                isConnected: true
              })
            })
            .catch(() => {
              setState({ 
                accounts: [], 
                status: 'error', 
                hasLoaded: true,
                isConnected: false
              })
            })
        })
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [dAppToolkit, withTokens])

  return {
    state,
    refresh: useCallback(() => {
      setState((prev) => ({ ...prev, status: 'pending' }))
      return withTokens(state.accounts)
        .then((accounts: any) => {
          setState({ 
            accounts, 
            status: 'success', 
            hasLoaded: true,
            isConnected: true 
          })
        })
        .catch(() => {
          setState({ 
            accounts: [], 
            status: 'error', 
            hasLoaded: true,
            isConnected: false 
          })
        })
    }, [state.accounts, withTokens]),
  }
}