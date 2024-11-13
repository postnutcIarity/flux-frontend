import { useCallback } from 'react';
import { TransactionManifests } from '../contexts/TransactionManifests/swapExactPtForAsset';
import { MARKET_INFO } from '../config/addresses';
import { useSendTransaction } from './useSendTransaction';
import { useGetCommittedDetails } from './useGetCommittedDetails';

export const useSendTransactionManifest = () => {
  const transactionManifests = TransactionManifests(MARKET_INFO);
  const sendTransaction = useSendTransaction();
  const getCommittedDetails = useGetCommittedDetails();

  return useCallback(
    () => ({
      swapExactPtForAsset: async (params: {
        accountAddress: string;
        inputTokenValue: number;
        outputTokenValue: number;
      }) => {
        try {
          if (!params.accountAddress) {
            throw new Error('Wallet not connected');
          }

          if (params.inputTokenValue <= 0) {
            throw new Error('Invalid token amount');
          }

          const manifest = transactionManifests.swapExactPtForAsset(params);
          const result = await sendTransaction(manifest, 'Swap PT for Asset');
          return result.andThen((tx) => getCommittedDetails(tx.transactionIntentHash));
        } catch (error) {
          console.error('PT to LSU swap error:', error);
          throw error instanceof Error ? error : new Error('Failed to swap PT for LSU');
        }
      },

      swapExactAssetForPt: async (params: {
        accountAddress: string;
        inputTokenValue: number;
        outputTokenValue: number;
      }) => {
        try {
          if (!params.accountAddress) {
            throw new Error('Wallet not connected');
          }

          if (params.inputTokenValue <= 0) {
            throw new Error('Invalid token amount');
          }

          const manifest = transactionManifests.swapExactAssetForPt(params);
          const result = await sendTransaction(manifest, 'Swap Asset for PT');
          return result.andThen((tx) => getCommittedDetails(tx.transactionIntentHash));
        } catch (error) {
          console.error('LSU to PT swap error:', error);
          throw error instanceof Error ? error : new Error('Failed to swap LSU for PT');
        }
      },

      addLiquidity: async (params: {
        accountAddress: string;
        ptAmount: number;
        assetAmount: number;
      }) => {
        try {
          if (!params.accountAddress) {
            throw new Error('Wallet not connected');
          }

          if (params.ptAmount <= 0 || params.assetAmount <= 0) {
            throw new Error('Invalid token amounts');
          }

          const manifest = transactionManifests.addLiquidity(params);
          const result = await sendTransaction(manifest, 'Add Liquidity');
          return result.andThen((tx) => getCommittedDetails(tx.transactionIntentHash));
        } catch (error) {
          console.error('Add liquidity error:', error);
          throw error instanceof Error ? error : new Error('Failed to add liquidity');
        }
      },

      removeLiquidity: async (params: {
        accountAddress: string;
        poolUnits: number;
      }) => {
        try {
          if (!params.accountAddress) {
            throw new Error('Wallet not connected');
          }

          if (params.poolUnits <= 0) {
            throw new Error('Invalid pool units amount');
          }

          const manifest = transactionManifests.removeLiquidity(params);
          const result = await sendTransaction(manifest, 'Remove Liquidity');
          return result.andThen((tx) => getCommittedDetails(tx.transactionIntentHash));
        } catch (error) {
          console.error('Remove liquidity error:', error);
          throw error instanceof Error ? error : new Error('Failed to remove liquidity');
        }
      },

      tokenizeYield: async (params: {
        accountAddress: string;
        assetAmount: number;
      }) => {
        try {
          if (!params.accountAddress) {
            throw new Error('Wallet not connected');
          }

          if (params.assetAmount <= 0) {
            throw new Error('Invalid token amount');
          }

          const manifest = transactionManifests.tokenizeYield(params);
          const result = await sendTransaction(manifest, 'Tokenize Yield');
          return result.andThen((tx) => getCommittedDetails(tx.transactionIntentHash));
        } catch (error) {
          console.error('Tokenize yield error:', error);
          throw error instanceof Error ? error : new Error('Failed to tokenize yield');
        }
      },

      redeemTokens: async (params: {
        accountAddress: string;
        ptAmount: number;
        ytAmount: number;
      }) => {
        try {
          if (!params.accountAddress) {
            throw new Error('Wallet not connected');
          }

          if (params.ptAmount <= 0 || params.ytAmount <= 0) {
            throw new Error('Invalid token amounts');
          }

          const manifest = transactionManifests.redeemTokens(params);
          const result = await sendTransaction(manifest, 'Redeem Tokens');
          return result.andThen((tx) => getCommittedDetails(tx.transactionIntentHash));
        } catch (error) {
          console.error('Redeem tokens error:', error);
          throw error instanceof Error ? error : new Error('Failed to redeem tokens');
        }
      },
    }),
    [sendTransaction, getCommittedDetails, transactionManifests]
  );
};