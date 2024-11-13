import { useCallback } from 'react'
import { TransactionManifests } from '../contexts/TransactionManifests/swapExactPtForAsset'
import { MARKET_INFO } from '../config/addresses'
import { useSendTransaction } from './useSendTransaction'
import { NonFungibleResource } from '../transformers/addTokens'
import { useGetCommittedDetails } from './useGetCommittedDetails'
// import { AccountWithMemberCard } from '../helpers/hasMemberCard'

export const useSendTransactionManifest = () => {
  const transactionManifests = TransactionManifests(MARKET_INFO)
  const sendTransaction = useSendTransaction()
  const getCommittedDetails = useGetCommittedDetails()

  return useCallback(
    () => ({
      swapExactPtForAsset: (input: {
        accountAddress: string
        inputTokenValue: number
        outputTokenValue: number
        // change?: number
      }) =>
        sendTransaction(
          transactionManifests.swapExactPtForAsset(input),
          
        ).andThen(({ transactionIntentHash }) =>
            getCommittedDetails(transactionIntentHash)
        ),
    }),

    [sendTransaction, getCommittedDetails, transactionManifests]
  )
}
