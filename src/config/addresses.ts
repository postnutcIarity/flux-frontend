// Market component addresses on the Radix network
export const MARKET_ADDRESSES = {
    LSULP: 'component_tdx_2_1czuxwr7zax9wdk4dfc4n8lcqyankk39my5vfzymx4uu55gm5sv8vcr',
    // Add more market addresses here as needed
  } as const;
  
  export type MarketKey = keyof typeof MARKET_ADDRESSES;