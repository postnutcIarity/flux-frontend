export function formatMaturityDate(dateComponents: any) {
    const { year, month, day_of_month, hour, minute, second } = dateComponents;
  
    return `${year}-${String(month).padStart(2, '0')}-${String(day_of_month).padStart(2, '0')}:${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`;
  }
  