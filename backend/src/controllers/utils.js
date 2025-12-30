export const addDays = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + Number(days));
  return d;
};