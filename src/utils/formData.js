import { toISODateString } from '@maincomponents/Inputs/DateInput';

export const createFormData = data => {
  const formData = new FormData();
  console.log('Hello world');
  Object.entries(data).forEach(([key, value]) => {
    if (value instanceof File || key === 'invoice' || key === 'iqamaDocument') {
      return;
    } else if (value instanceof Date) {
      formData.append(key, toISODateString(value)); // ✅ Correct: preserves exact date
    } else if (value !== undefined && value !== null) {
      formData.append(key, value.toString());
    }
  });

  return formData;
};
