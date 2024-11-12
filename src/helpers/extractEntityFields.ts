import { formatMaturityDate } from './formatMaturityDate';

export function extractEntityFields(entityState: any) {
  if (!entityState || entityState.kind !== 'Tuple') {
    console.warn("Unexpected entity state format:", entityState);
    return null;
  }

  const poolComponent = entityState.fields.find((field: any) => field.field_name === 'pool_component')?.value;
  const yieldTokenizerComponent = entityState.fields.find((field: any) => field.field_name === 'yield_tokenizer_component')?.value;
  const marketFee = entityState.fields.find((field: any) => field.field_name === 'market_fee');
  const marketState = entityState.fields.find((field: any) => field.field_name === 'market_state');
  const marketInfo = entityState.fields.find((field: any) => field.field_name === 'market_info');
  const marketIsActive = entityState.fields.find((field: any) => field.field_name === 'market_is_active')?.value;

  // Extract implied rate from market state
  let impliedRate = null;
  if (marketState?.fields?.[3]?.field_name === 'last_ln_implied_rate') {
    const rateValue = marketState.fields[3].value;
    // Ensure the rate is a valid number
    impliedRate = !isNaN(parseFloat(rateValue)) ? parseFloat(rateValue) : null;
    
    // Log both raw and exponentiated values
    if (impliedRate !== null) {
      console.group('Implied Rate Details');
      console.log('Raw ln(rate):', impliedRate);
      console.log('Exponentiated rate:', Math.exp(impliedRate));
      console.log('Percentage:', (Math.exp(impliedRate) - 1) * 100 + '%');
      console.groupEnd();
    }
  }

  // Extract maturity date
  let maturityDate = '';
  if (marketInfo) {
    const maturityDateField = marketInfo.fields[0];
    if (maturityDateField && maturityDateField.fields) {
      const dateComponents = maturityDateField.fields.reduce((acc: any, component: any) => {
        acc[component.field_name] = component.value;
        return acc;
      }, {});
      maturityDate = formatMaturityDate(dateComponents);
    }
  }

  return {
    poolComponent,
    yieldTokenizerComponent,
    marketFee,
    marketState,
    marketInfo,
    marketIsActive,
    maturityDate,
    impliedRate,
  };
}