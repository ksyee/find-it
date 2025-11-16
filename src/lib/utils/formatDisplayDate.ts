const formatDisplayDate = (dateString?: string | null): string => {
  if (!dateString) {
    return '-';
  }

  const onlyDigits = dateString.replace(/\D/g, '');

  if (onlyDigits.length !== 8) {
    return dateString;
  }

  const year = onlyDigits.slice(0, 4);
  const month = onlyDigits.slice(4, 6);
  const day = onlyDigits.slice(6, 8);

  return `${year}.${month}.${day}`;
};

export default formatDisplayDate;
