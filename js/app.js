document.addEventListener("DOMContentLoaded", () => {
  if (deliveryDate) deliveryDate.value = todayInput();
  if (salaryDate) salaryDate.value = todayInput();
  if (taxDate) taxDate.value = todayInput();
  autoLogin();
});
