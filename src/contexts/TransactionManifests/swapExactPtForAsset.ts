import { MarketInfo } from "../../config/addresses";

export const TransactionManifests = ({
  yieldAMMComponent,
  ptResource,
  ytResource,
  poolUnitResource,
  assetResource,
}: MarketInfo) => {
  const swapExactPtForAsset = ({
    accountAddress,
    inputTokenValue,
    outputTokenValue,
  }: {
    accountAddress: string;
    inputTokenValue: number;
    outputTokenValue: number;
  }) => {
    if (!accountAddress || !inputTokenValue) {
      throw new Error('Invalid transaction parameters');
    }

    return `
      CALL_METHOD
        Address("${accountAddress}")
        "withdraw"
        Address("${ptResource}")
        Decimal("${inputTokenValue}")
      ;
      TAKE_ALL_FROM_WORKTOP
        Address("${ptResource}")
        Bucket("pt_bucket")
      ;
      CALL_METHOD
        Address("${yieldAMMComponent}")
        "swap_exact_pt_for_asset"
        Bucket("pt_bucket")
      ;
      CALL_METHOD
        Address("${accountAddress}")
        "deposit_batch"
        Expression("ENTIRE_WORKTOP")
      ;
    `.trim();
  };

  const swapExactAssetForPt = ({
    accountAddress,
    inputTokenValue,
    outputTokenValue,
  }: {
    accountAddress: string;
    inputTokenValue: number;
    outputTokenValue: number;
  }) => {
    if (!accountAddress || !inputTokenValue) {
      throw new Error('Invalid transaction parameters');
    }

    return `
      CALL_METHOD
        Address("${accountAddress}")
        "withdraw"
        Address("${assetResource}")
        Decimal("${inputTokenValue}")
      ;
      TAKE_ALL_FROM_WORKTOP
        Address("${assetResource}")
        Bucket("asset_bucket")
      ;
      CALL_METHOD
        Address("${yieldAMMComponent}")
        "swap_exact_asset_for_pt"
        Bucket("asset_bucket")
      ;
      CALL_METHOD
        Address("${accountAddress}")
        "deposit_batch"
        Expression("ENTIRE_WORKTOP")
      ;
    `.trim();
  };

  const addLiquidity = ({
    accountAddress,
    ptAmount,
    assetAmount,
  }: {
    accountAddress: string;
    ptAmount: number;
    assetAmount: number;
  }) => {
    if (!accountAddress || !ptAmount || !assetAmount) {
      throw new Error('Invalid transaction parameters');
    }

    return `
      CALL_METHOD
        Address("${accountAddress}")
        "withdraw"
        Address("${ptResource}")
        Decimal("${ptAmount}")
      ;
      TAKE_ALL_FROM_WORKTOP
        Address("${ptResource}")
        Bucket("pt_bucket")
      ;
      CALL_METHOD
        Address("${accountAddress}")
        "withdraw"
        Address("${assetResource}")
        Decimal("${assetAmount}")
      ;
      TAKE_ALL_FROM_WORKTOP
        Address("${assetResource}")
        Bucket("asset_bucket")
      ;
      CALL_METHOD
        Address("${yieldAMMComponent}")
        "add_liquidity"
        Bucket("pt_bucket")
        Bucket("asset_bucket")
      ;
      CALL_METHOD
        Address("${accountAddress}")
        "deposit_batch"
        Expression("ENTIRE_WORKTOP")
      ;
    `.trim();
  };

  const removeLiquidity = ({
    accountAddress,
    poolUnits,
  }: {
    accountAddress: string;
    poolUnits: number;
  }) => {
    if (!accountAddress || !poolUnits) {
      throw new Error('Invalid transaction parameters');
    }

    return `
      CALL_METHOD
        Address("${accountAddress}")
        "withdraw"
        Address("${poolUnitResource}")
        Decimal("${poolUnits}")
      ;
      TAKE_ALL_FROM_WORKTOP
        Address("${poolUnitResource}")
        Bucket("pool_units")
      ;
      CALL_METHOD
        Address("${yieldAMMComponent}")
        "remove_liquidity"
        Bucket("pool_units")
      ;
      CALL_METHOD
        Address("${accountAddress}")
        "deposit_batch"
        Expression("ENTIRE_WORKTOP")
      ;
    `.trim();
  };

  return {
    swapExactPtForAsset,
    swapExactAssetForPt,
    addLiquidity,
    removeLiquidity,
  };
};