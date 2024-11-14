import BigNumber from 'bignumber.js';

// Configure BigNumber
BigNumber.config({
  DECIMAL_PLACES: 18,
  ROUNDING_MODE: BigNumber.ROUND_DOWN,
  EXPONENTIAL_AT: [-50, 50]
});

interface MarketState {
  total_pt: string;
  total_asset: string;
  scalar_root: string;
  last_ln_implied_rate: string;
}

interface MarketFee {
  fee_rate: string;
  reserve_fee_percent: string;
}

interface MarketCompute {
  rate_scalar: BigNumber;
  rate_anchor: BigNumber;
}

const PERIOD_SIZE = 31536000; // 365 days in seconds
const ONE = new BigNumber(1);

export const getTimeToExpiry = (maturityDate: string): number => {
  try {
    if (!maturityDate) {
      console.warn('No maturity date provided, using default');
      return PERIOD_SIZE;
    }

    const maturity = new Date(maturityDate).getTime() / 1000;
    const now = Date.now() / 1000;
    const timeToExpiry = Math.max(0, Math.floor(maturity - now));

    return timeToExpiry || PERIOD_SIZE;
  } catch (error) {
    console.error('Error calculating time to expiry:', error);
    return PERIOD_SIZE;
  }
};

const logProportion = (proportion: BigNumber): BigNumber => {
  try {
    if (proportion.isLessThanOrEqualTo(0) || proportion.isGreaterThanOrEqualTo(1)) {
      throw new Error('Proportion must be between 0 and 1');
    }
    return new BigNumber(
      Math.log(proportion.dividedBy(ONE.minus(proportion)).toNumber())
    );
  } catch (error) {
    console.error('Error in logProportion:', error);
    throw error;
  }
};

const calcProportion = (
  netPtAmount: BigNumber,
  totalPt: BigNumber,
  totalAsset: BigNumber
): BigNumber => {
  try {
    const numerator = totalPt.minus(netPtAmount);
    const denominator = totalPt.plus(totalAsset);
    if (denominator.isZero()) {
      throw new Error('Denominator cannot be zero');
    }
    return numerator.dividedBy(denominator);
  } catch (error) {
    console.error('Error in calcProportion:', error);
    throw error;
  }
};

const calcRateScalar = (
  scalarRoot: string,
  timeToExpiry: number
): BigNumber => {
  try {
    if (timeToExpiry <= 0) {
      throw new Error('Time to expiry must be positive');
    }
    return new BigNumber(scalarRoot)
      .multipliedBy(PERIOD_SIZE)
      .dividedBy(timeToExpiry);
  } catch (error) {
    console.error('Error in calcRateScalar:', error);
    throw error;
  }
};

const calcExchangeRateFromImpliedRate = (
  lnImpliedRate: BigNumber,
  timeToExpiry: number
): BigNumber => {
  try {
    const rt = lnImpliedRate
      .multipliedBy(timeToExpiry)
      .dividedBy(PERIOD_SIZE);
    return new BigNumber(Math.exp(rt.toNumber()));
  } catch (error) {
    console.error('Error in calcExchangeRateFromImpliedRate:', error);
    throw error;
  }
};

const calcRateAnchor = (
  lastLnImpliedRate: string,
  proportion: BigNumber,
  timeToExpiry: number,
  rateScalar: BigNumber
): BigNumber => {
  try {
    const lastExchangeRate = calcExchangeRateFromImpliedRate(
      new BigNumber(lastLnImpliedRate),
      timeToExpiry
    );

    const lnProportion = logProportion(proportion);
    const newExchangeRate = lnProportion.dividedBy(rateScalar);

    return lastExchangeRate.minus(newExchangeRate);
  } catch (error) {
    console.error('Error in calcRateAnchor:', error);
    throw error;
  }
};

const calcExchangeRate = (
  proportion: BigNumber,
  rateAnchor: BigNumber,
  rateScalar: BigNumber
): BigNumber => {
  try {
    const lnProportion = logProportion(proportion);
    const exchangeRate = lnProportion
      .dividedBy(rateScalar)
      .plus(rateAnchor);

    if (exchangeRate.isLessThanOrEqualTo(ONE)) {
      throw new Error('Exchange rate must be greater than 1');
    }

    return exchangeRate;
  } catch (error) {
    console.error('Error in calcExchangeRate:', error);
    throw error;
  }
};

const calcFee = (
  feeRate: BigNumber,
  timeToExpiry: number,
  netPtAmount: BigNumber,
  exchangeRate: BigNumber,
  preFeeAmount: BigNumber
): BigNumber => {
  try {
    const feeExchangeRate = calcExchangeRateFromImpliedRate(
      feeRate,
      timeToExpiry
    );

    if (netPtAmount.isGreaterThan(0)) {
      const postFeeExchangeRate = exchangeRate.dividedBy(feeExchangeRate);
      if (postFeeExchangeRate.isLessThanOrEqualTo(ONE)) {
        throw new Error('Post-fee exchange rate must be greater than 1');
      }
      return preFeeAmount.multipliedBy(ONE.minus(feeExchangeRate));
    } else {
      return preFeeAmount
        .multipliedBy(ONE.minus(feeExchangeRate))
        .dividedBy(feeExchangeRate)
        .negated();
    }
  } catch (error) {
    console.error('Error in calcFee:', error);
    throw error;
  }
};

export const computeMarket = (
  marketState: MarketState,
  timeToExpiry: number
): MarketCompute => {
  try {
    const defaultState = {
      total_pt: '100',
      total_asset: '100',
      scalar_root: '0.1',
      last_ln_implied_rate: '0.1'
    };

    const state = {
      total_pt: marketState?.total_pt || defaultState.total_pt,
      total_asset: marketState?.total_asset || defaultState.total_asset,
      scalar_root: marketState?.scalar_root || defaultState.scalar_root,
      last_ln_implied_rate: marketState?.last_ln_implied_rate || defaultState.last_ln_implied_rate
    };

    const normalizedTimeToExpiry = Math.max(timeToExpiry, 1);

    const proportion = calcProportion(
      new BigNumber(0),
      new BigNumber(state.total_pt),
      new BigNumber(state.total_asset)
    );

    const rateScalar = calcRateScalar(
      state.scalar_root,
      normalizedTimeToExpiry
    );

    const rateAnchor = calcRateAnchor(
      state.last_ln_implied_rate,
      proportion,
      normalizedTimeToExpiry,
      rateScalar
    );

    return {
      rate_scalar: rateScalar,
      rate_anchor: rateAnchor
    };
  } catch (error) {
    console.error('Error in computeMarket:', error);
    throw error;
  }
};

export const calcTrade = (
  netPtAmount: BigNumber,
  timeToExpiry: number,
  marketState: MarketState,
  marketCompute: MarketCompute,
  marketFee: MarketFee
): {
  netAmount: BigNumber;
  preFeeExchangeRate: BigNumber;
  totalFees: BigNumber;
  netAssetFeeToReserve: BigNumber;
  tradingFees: BigNumber;
} => {
  try {
    const defaultState = {
      total_pt: '100',
      total_asset: '100'
    };

    const defaultFee = {
      fee_rate: '0.01',
      reserve_fee_percent: '0.5'
    };

    const state = {
      total_pt: marketState?.total_pt || defaultState.total_pt,
      total_asset: marketState?.total_asset || defaultState.total_asset
    };

    const fee = {
      fee_rate: marketFee?.fee_rate || defaultFee.fee_rate,
      reserve_fee_percent: marketFee?.reserve_fee_percent || defaultFee.reserve_fee_percent
    };

    const normalizedTimeToExpiry = Math.max(timeToExpiry, 1);

    const proportion = calcProportion(
      netPtAmount,
      new BigNumber(state.total_pt),
      new BigNumber(state.total_asset)
    );

    const preFeeExchangeRate = calcExchangeRate(
      proportion,
      marketCompute.rate_anchor,
      marketCompute.rate_scalar
    );

    const preFeeAmount = netPtAmount
      .dividedBy(preFeeExchangeRate)
      .negated();

    const totalFees = calcFee(
      new BigNumber(fee.fee_rate),
      normalizedTimeToExpiry,
      netPtAmount,
      preFeeExchangeRate,
      preFeeAmount
    );

    const netAssetFeeToReserve = totalFees
      .multipliedBy(new BigNumber(fee.reserve_fee_percent));

    const tradingFees = totalFees.minus(netAssetFeeToReserve);

    let netAmount = preFeeAmount.minus(tradingFees);

    if (netAmount.isLessThan(0)) {
      netAmount = netAmount.plus(netAssetFeeToReserve).abs();
    } else {
      netAmount = netAmount.minus(netAssetFeeToReserve);
    }

    return {
      netAmount,
      preFeeExchangeRate,
      totalFees,
      netAssetFeeToReserve,
      tradingFees,
    };
  } catch (error) {
    console.error('Error in calcTrade:', error);
    throw error;
  }
};