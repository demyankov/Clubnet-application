export const formatPhoneNumber = (phone: string): string => {
  return `+${phone.replace(/[^\d]/g, '')}`;
};
