import { formatMaturityDate } from './formatMaturityDate';  // Assuming the formatter is in this file

export function extractEntityFields(entityState: any) {
  // Check if the entityState is in the expected format
  if (!entityState || entityState.kind !== 'Tuple') {
    console.warn("Unexpected entity state format:", entityState);
    return null;
  }

  // Helper function to find a field by its name
  const findFieldValue = (fieldName: string) => {
    const field = entityState.fields.find((field: any) => field.field_name === fieldName);
    return field ? field.value : undefined;
  };

  // Extract basic fields
  const poolComponent = findFieldValue('pool_component');
  const yieldTokenizerComponent = findFieldValue('yield_tokenizer_component');
  const marketIsActive = findFieldValue('market_is_active');

  // Extract complex fields (like marketFee, marketState, and marketInfo)
  const marketFee = entityState.fields.find((field: any) => field.field_name === 'market_fee');
  const marketState = entityState.fields.find((field: any) => field.field_name === 'market_state');
  const marketInfo = entityState.fields.find((field: any) => field.field_name === 'market_info');

  // Extract maturityDate from marketInfo
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

  // Return an object with all the extracted data
  return {
    poolComponent,
    yieldTokenizerComponent,
    marketIsActive,
    marketFee,
    marketState,
    marketInfo,
    maturityDate,  // Include formatted maturity date
  };
}
