import { MarketInfo } from "../../config/addresses";

export const TransactionManifests = ({
  yieldAMMComponent,
  ptResource,
  ytResource,
  poolUnitResource,
  assetResource,
  fluxTokenizerComponent,
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
      TAKE_FROM_WORKTOP
        Address("${ptResource}")
        Decimal("${inputTokenValue}")
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
      TAKE_FROM_WORKTOP
        Address("${assetResource}")
        Decimal("${inputTokenValue}")
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
      CALL_METHOD
        Address("${accountAddress}")
        "withdraw"
        Address("${assetResource}")
        Decimal("${assetAmount}")
      ;
      TAKE_FROM_WORKTOP
        Address("${ptResource}")
        Decimal("${ptAmount}")
        Bucket("pt_bucket")
      ;
      TAKE_FROM_WORKTOP
        Address("${assetResource}")
        Decimal("${assetAmount}")
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
      TAKE_FROM_WORKTOP
        Address("${poolUnitResource}")
        Decimal("${poolUnits}")
        Bucket("pool_units_bucket")
      ;
      CALL_METHOD
        Address("${yieldAMMComponent}")
        "remove_liquidity"
        Bucket("pool_units_bucket")
      ;
      CALL_METHOD
        Address("${accountAddress}")
        "deposit_batch"
        Expression("ENTIRE_WORKTOP")
      ;
    `.trim();
  };

  const tokenizeYield = ({
    accountAddress,
    assetAmount,
  }: {
    accountAddress: string;
    assetAmount: number;
  }) => {
    if (!accountAddress || !assetAmount) {
      throw new Error('Invalid transaction parameters');
    }

    return `
      CALL_METHOD
        Address("${accountAddress}")
        "withdraw"
        Address("${assetResource}")
        Decimal("${assetAmount}")
      ;
      TAKE_ALL_FROM_WORKTOP
        Address("${assetResource}")
        Bucket("LSU Bucket")
      ;
      CALL_METHOD
        Address("${fluxTokenizerComponent}")
        "tokenize_yield"
        Bucket("LSU Bucket")
      ;
      CALL_METHOD
        Address("${accountAddress}")
        "deposit_batch"
        Expression("ENTIRE_WORKTOP")
      ;
    `.trim();
  };

  const redeemTokens = ({
    accountAddress,
    ptAmount,
    ytAmount,
  }: {
    accountAddress: string;
    ptAmount: number;
    ytAmount: number;
  }) => {
    if (!accountAddress || !ptAmount || !ytAmount) {
      throw new Error('Invalid transaction parameters');
    }

    return `
      CALL_METHOD
        Address("${accountAddress}")
        "withdraw"
        Address("${ptResource}")
        Decimal("${ptAmount}")
      ;
      CALL_METHOD
        Address("${accountAddress}")
        "withdraw"
        Address("${ytResource}")
        Decimal("${ytAmount}")
      ;
      TAKE_ALL_FROM_WORKTOP
        Address("${ptResource}")
        Bucket("PT Bucket")
      ;
      TAKE_ALL_FROM_WORKTOP
        Address("${ytResource}")
        Bucket("YT Bucket")
      ;
      CALL_METHOD
        Address("${fluxTokenizerComponent}")
        "redeem"
        Bucket("PT Bucket")
        Bucket("YT Bucket")
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
    tokenizeYield,
    redeemTokens,
  };
};