export function getSilverCoins() {
  return parseInt(localStorage.getItem('silverCoins') || '0', 10);
}

export function addSilverCoins(amount) {
  const current = getSilverCoins();
  localStorage.setItem('silverCoins', String(current + amount));
  return current + amount;
}

export function spendSilverCoins(amount) {
  const current = getSilverCoins();
  if (current < amount) return false;
  localStorage.setItem('silverCoins', String(current - amount));
  return true;
}
