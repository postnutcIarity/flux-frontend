import { formatMaturityDate } from './formatMaturityDate';

export function extractEntityFields(entityState: any) {
  if (!entityState || entityState.kind !== 'Tuple') {
    console.warn("Unexpected entity state format:", entityState);
    return null;
  }

  // Extracting the fields as before
  const poolComponent = entityState.fields.find((field: any) => field.field_name === 'pool_component')?.value;
  const yieldTokenizerComponent = entityState.fields.find((field: any) => field.field_name === 'yield_tokenizer_component')?.value;
  const marketFee = entityState.fields.find((field: any) => field.field_name === 'market_fee');
  const marketState = entityState.fields.find((field: any) => field.field_name === 'market_state');
  const marketInfo = entityState.fields.find((field: any) => field.field_name === 'market_info');
  const marketIsActive = entityState.fields.find((field: any) => field.field_name === 'market_is_active')?.value;

  // Extracting maturity_date components from marketInfo
  let maturityDate = '';
  if (marketInfo) {
    const maturityDateField = marketInfo.fields[0]; // Assuming 'maturity_date' is always the first field
    if (maturityDateField && maturityDateField.fields) {
      const dateComponents = maturityDateField.fields.reduce((acc: any, component: any) => {
        acc[component.field_name] = component.value;
        return acc;
      }, {});

      // Use the utility function to format the date
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
    maturityDate, // Add formatted maturity date to return
  };
}
