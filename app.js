// Telegram WebApp
const tg = window.Telegram?.WebApp;
if (tg) {
  tg.ready();
  tg.expand();
  // Подстраиваем цвета под тему Telegram
  document.documentElement.style.setProperty('--bg', tg.themeParams.bg_color || '#0f0f13');
  document.documentElement.style.setProperty('--card', tg.themeParams.secondary_bg_color || '#1a1a24');
  document.documentElement.style.setProperty('--text', tg.themeParams.text_color || '#ffffff');
  document.documentElement.style.setProperty('--text-muted', tg.themeParams.hint_color || '#9ca3af');
  document.documentElement.style.setProperty('--primary', tg.themeParams.button_color || '#7c5cfc');
}

// Данные пользователя (пока локально, потом можно связать с ботом)
let balance = 1000;   // стартовый баланс для теста
let staked = 0;

// Элементы
const balanceEl = document.getElementById('balanceValue');
const stakedEl = document.getElementById('stakedValue');
const userNameEl = document.getElementById('userName');
const stakeModal = document.getElementById('stakeModal');
const unstakeModal = document.getElementById('unstakeModal');
const stakeAmountInput = document.getElementById('stakeAmount');
const unstakeAmountInput = document.getElementById('unstakeAmount');

// Имя пользователя из Telegram
if (tg?.initDataUnsafe?.user) {
  const user = tg.initDataUnsafe.user;
  userNameEl.textContent = user.first_name || 'Пользователь';
} else {
  userNameEl.textContent = 'Гость';
}

// Обновление интерфейса
function updateUI() {
  balanceEl.textContent = balance.toLocaleString('ru-RU');
  stakedEl.textContent = staked.toLocaleString('ru-RU');
}

// Открытие / закрытие модалок
document.getElementById('stakeBtn').addEventListener('click', () => {
  stakeAmountInput.value = '';
  stakeModal.classList.add('active');
});

document.getElementById('unstakeBtn').addEventListener('click', () => {
  unstakeAmountInput.value = '';
  unstakeModal.classList.add('active');
});

document.querySelectorAll('[data-close]').forEach(btn => {
  btn.addEventListener('click', () => {
    stakeModal.classList.remove('active');
    unstakeModal.classList.remove('active');
  });
});

// Закрытие по клику на фон
[stakeModal, unstakeModal].forEach(modal => {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('active');
  });
});

// Быстрые кнопки суммы
document.querySelectorAll('#stakeModal .quick-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const val = btn.dataset.amount;
    stakeAmountInput.value = val === 'all' ? balance : val;
  });
});

document.querySelectorAll('#unstakeModal .quick-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const val = btn.dataset.amount;
    unstakeAmountInput.value = val === 'all' ? staked : val;
  });
});

// Подтверждение стейка
document.getElementById('confirmStake').addEventListener('click', () => {
  const amount = parseInt(stakeAmountInput.value);

  if (!amount || amount <= 0) {
    showAlert('Введите корректное число');
    return;
  }
  if (amount > balance) {
    showAlert('Недостаточно подарков на балансе');
    return;
  }

  balance -= amount;
  staked += amount;
  updateUI();
  stakeModal.classList.remove('active');
  showAlert(`✅ Застейкано ${amount} подарков`);
  
  // Здесь потом можно отправлять данные в бота
  // sendToBot({ action: 'stake', amount });
});

// Подтверждение анстейка
document.getElementById('confirmUnstake').addEventListener('click', () => {
  const amount = parseInt(unstakeAmountInput.value);

  if (!amount || amount <= 0) {
    showAlert('Введите корректное число');
    return;
  }
  if (amount > staked) {
    showAlert('В стейкинге недостаточно подарков');
    return;
  }

  staked -= amount;
  balance += amount;
  updateUI();
  unstakeModal.classList.remove('active');
  showAlert(`✅ Забрано ${amount} подарков`);
  
  // sendToBot({ action: 'unstake', amount });
});

// Простое уведомление
function showAlert(text) {
  if (tg) {
    tg.showAlert(text);
  } else {
    alert(text);
  }
}

// Инициализация
updateUI();
