import { MarketInfo } from "../../config/addresses";

export const TransactionManifests = ({
  yieldAMMComponent,
  ptResource,
  ytResource,
  poolUnitResource,
  assetResource,
}: MarketInfo) => {
  // Define swapExactPtForAsset function
  const swapExactPtForAsset = ({
    accountAddress,
    inputTokenValue,
    outputTokenValue,
  }: {
    accountAddress: string;
    inputTokenValue: number;
    outputTokenValue: number;
  }) => {
    const transactionManifest = `
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
    `;
    console.log(transactionManifest);
    return transactionManifest;
  };

  // Define swapExactAssetForPt function
  const swapExactAssetForPt = ({
    accountAddress,
    inputTokenValue,
    outputTokenValue,
  }: {
    accountAddress: string;
    inputTokenValue: number;
    outputTokenValue: number;
  }) => {
    const transactionManifest = `
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
        Decimal("${outputTokenValue}")
      ;
      CALL_METHOD
        Address("${accountAddress}")
        "deposit_batch"
        Expression("ENTIRE_WORKTOP")
      ;
    `;
    // Note to change the outputTokenValue at some point.
    console.log(transactionManifest);
    return transactionManifest;
  };


  const addLiquidity = ({
    accountAddress,
    inputPTTokenValue,
    inputAssetTokenValue,
  }: {
    accountAddress: string;
    inputPTTokenValue: number;
    inputAssetTokenValue: number;
  }) => {
    const transactionManifest = `
    CALL_METHOD
        Address("${accountAddress}")
        "withdraw"
        Address("${ptResource}")
        Decimal("${inputPTTokenValue}")
    ;
    CALL_METHOD
        Address("${accountAddress}")
        "withdraw"
        Address("${assetResource}")
        Decimal("${inputAssetTokenValue}")
    ;
    TAKE_FROM_WORKTOP
        Address("${ptResource}")
        Decimal("${inputPTTokenValue}")
        Bucket("pt_bucket")
    ;
    TAKE_FROM_WORKTOP
        Address("${assetResource}")
        Decimal("${inputAssetTokenValue}")
        Bucket("asset_bucket")
    ;
    CALL_METHOD
        Address("component_tdx_${yieldAMMComponent}")
        "add_liquidity"
        Bucket("pt_bucket")
        Bucket("asset_bucket")
    ;
    CALL_METHOD
        Address("${accountAddress}")
        "deposit_batch"
        Expression("ENTIRE_WORKTOP")
    ;
    `;
    console.log(transactionManifest);
    return transactionManifest;
  };

  const removeLiquidity = ({
    accountAddress,
    inputTokenValue,
    outputTokenValue,
  }: {
    accountAddress: string;
    inputTokenValue: number;
    outputTokenValue: number;
  }) => {
    const transactionManifest = `
    CALL_METHOD
        Address("${accountAddress}")
        "withdraw"
        Address("${poolUnitResource}")
        Decimal("${inputTokenValue}")
    ;
    TAKE_FROM_WORKTOP
        Address("${poolUnitResource}")
        Decimal("${inputTokenValue}")
        Bucket("pool_unit")
    ;
    CALL_METHOD
        Address("${yieldAMMComponent}")
        "remove_liquidity"
        Bucket("pool_unit")
    ;
    CALL_METHOD
        Address("${accountAddress}")
        "deposit_batch"
        Expression("ENTIRE_WORKTOP")
    ;
    `;
    console.log(transactionManifest);
    return transactionManifest;
  };

  const tokenizeAsset = ({
    accountAddress,
    inputTokenValue,
    outputTokenValue,
  }: {
    accountAddress: string;
    inputTokenValue: number;
    outputTokenValue: number;
  }) => {
    const transactionManifest = `
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
    `;
    console.log(transactionManifest);
    return transactionManifest;
  };

  // Return an object containing both functions
  return {
    swapExactPtForAsset,
    swapExactAssetForPt,
  };
};
