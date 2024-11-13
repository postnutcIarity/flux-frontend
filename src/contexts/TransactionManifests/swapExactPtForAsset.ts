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

  // Return an object containing the defined function
  return {
    swapExactPtForAsset,
  };
};
