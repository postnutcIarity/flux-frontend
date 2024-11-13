import { useCallback } from 'react';
import { TransactionManifests } from '../contexts/TransactionManifests/swapExactPtForAsset';
import { MARKET_INFO } from '../config/addresses';
import { useSendTransaction } from './useSendTransaction';
import { useGetCommittedDetails } from './useGetCommittedDetails';
import { ResultAsync } from 'neverthrow';

interface SwapParams {
  accountAddress: string;
  inputTokenValue: number;
  outputTokenValue: number;
}

interface LiquidityParams {
  accountAddress: string;
  ptAmount: number;
  assetAmount: number;
}

export const useSendTransactionManifest = () => {
  const transactionManifests = TransactionManifests(MARKET_INFO);
  const sendTransaction = useSendTransaction();
  const getCommittedDetails = useGetCommittedDetails();

  const handleTransaction = async (
    manifest: string,
    message: string
  ) => {
    const result = await ResultAsync.fromPromise(
      sendTransaction(manifest, message),
      (error: any) => new Error(error?.message || 'Transaction failed')
    );

    if (result.isErr()) {
      throw result.error;
    }

    const { transactionIntentHash } = result.value;
    
    const details = await ResultAsync.fromPromise(
      getCommittedDetails(transactionIntentHash),
      (error: any) => new Error(error?.message || 'Failed to get transaction details')
    );

    if (details.isErr()) {
      throw details.error;
    }

    return details.value;
  };

  return useCallback(
    () => ({
      swapExactPtForAsset: async (params: SwapParams) => {
        try {
          if (!params.accountAddress) {
            throw new Error('Wallet not connected');
          }

          if (params.inputTokenValue <= 0) {
            throw new Error('Invalid input amount');
          }

          const manifest = transactionManifests.swapExactPtForAsset(params);
          return await handleTransaction(manifest, 'Swap PT for LSU');
        } catch (error) {
          console.error('PT to LSU swap error:', error);
          throw error instanceof Error ? error : new Error('Swap failed');
        }
      },

      swapExactAssetForPt: async (params: SwapParams) => {
        try {
          if (!params.accountAddress) {
            throw new Error('Wallet not connected');
          }

          if (params.inputTokenValue <= 0) {
            throw new Error('Invalid input amount');
          }

          const manifest = transactionManifests.swapExactAssetForPt(params);
          return await handleTransaction(manifest, 'Swap LSU for PT');
        } catch (error) {
          console.error('LSU to PT swap error:', error);
          throw error instanceof Error ? error : new Error('Swap failed');
        }
      },

      addLiquidity: async (params: LiquidityParams) => {
        try {
          if (!params.accountAddress) {
            throw new Error('Wallet not connected');
          }

          if (params.ptAmount <= 0 || params.assetAmount <= 0) {
            throw new Error('Invalid liquidity amounts');
          }

          const manifest = transactionManifests.addLiquidity(params);
          return await handleTransaction(manifest, 'Add Liquidity');
        } catch (error) {
          console.error('Add liquidity error:', error);
          throw error instanceof Error ? error : new Error('Failed to add liquidity');
        }
      }
    }),
    [sendTransaction, getCommittedDetails, transactionManifests]
  );
};