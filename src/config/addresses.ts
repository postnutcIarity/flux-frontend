// Market component addresses on the Radix network
export const MARKET_ADDRESSES = {
    LSULP: 'component_tdx_2_1czuxwr7zax9wdk4dfc4n8lcqyankk39my5vfzymx4uu55gm5sv8vcr',
    // Add more market addresses here as needed
  } as const;
  
  export type MarketKey = keyof typeof MARKET_ADDRESSES;

  export const MARKET_INFO = {
    assetResource: 'resource_tdx_2_1t45l9ku3r5mwxazht2qutmhhk3660hqqvxkkyl8rxs20n9k2zv0w7t',
    ptResource: 'resource_tdx_2_1tkw4wd6hzj84xts0zm59ck60nemps356vjzfcpfa8vf80zflxtd4sc',
    ytResource: 'resource_tdx_2_1nfmp4mzkcujusf26gq5s6ytkel3pazmr06pflq4jqcnhemyw2zfk2p',
    poolUnitResource: 'resource_tdx_2_1t4lwm0xrc0ydmg0dsrjhkj8pv4vzkj28m3e9ugpxxevtav6ytjpdrk',
    yieldAMMComponent: 'component_tdx_2_1czuxwr7zax9wdk4dfc4n8lcqyankk39my5vfzymx4uu55gm5sv8vcr',
  } as const;
  
  // Define MarketInfo as the inferred type of MARKET_INFO
  export type MarketInfo = typeof MARKET_INFO;
  