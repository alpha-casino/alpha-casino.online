// Переменные
let user = JSON.parse(localStorage.getItem('casinoUser')) || null;
let balance = user ? user.balance : 500;
let musicPlaying = false;
const slots = document.getElementById('slots');
const musicControl = document.getElementById('musicControl');
const music = new Audio('background-music.mp3');
music.loop = true;
music.volume = 0.2;

// Инициализация
updateBalanceDisplay();
setupMusicControl();
startJackpotTimer();
updateUserInfo();

// Управление музыкой
function setupMusicControl() {
  document.addEventListener('click', () => {
    if (!musicPlaying) {
      music.play();
      musicPlaying = true;
    }
  }, { once: true });

  musicControl.addEventListener('click', () => {
    if (musicPlaying) {
      music.pause();
    } else {
      music.play();
    }
    musicPlaying = !musicPlaying;
  });
}

// Обновить баланс на странице
function updateBalanceDisplay() {
  document.getElementById('balance').innerText = balance;
}

// Крутка слота
function spin() {
  const bet = parseInt(document.getElementById('betAmount').value);
  if (bet > balance) {
    alert('Недостатньо коштів для ставки!');
    return;
  }

  balance -= bet;
  updateBalanceDisplay();
  slots.classList.add('spinning');
  navigator.vibrate(50);

  setTimeout(() => {
    slots.classList.remove('spinning');
    const symbols = ['🍒', '🍋', '🔔', '⭐', '💎'];
    const s1 = symbols[Math.floor(Math.random() * symbols.length)];
    const s2 = symbols[Math.floor(Math.random() * symbols.length)];
    const s3 = symbols[Math.floor(Math.random() * symbols.length)];
    slots.innerText = `${s1}${s2}${s3}`;

    if (s1 === s2 && s2 === s3) {
      let multiplier = Math.floor(Math.random() * 9) + 2;
      let winAmount = bet * multiplier;
      balance += winAmount;
      updateBalanceDisplay();
      celebrateWin(winAmount);
    } else if (balance <= 0) {
      setTimeout(() => {
        if (user) {
          recharge();
        } else {
          openRegistration();
        }
      }, 500);
    }
  }, 1500);
}

// Победа: вибрация + мигание + салют
function celebrateWin(amount) {
  flashScreen('white');
  vibrateWin();
  launchFireworks();
  showCrown();
  showWinMessage(amount);
}

// Вибрация победы
function vibrateWin() {
  if (navigator.vibrate) {
    navigator.vibrate([300, 200, 300]);
  }
}

// Салют
function launchFireworks() {
  for (let i = 0; i < 20; i++) {
    const firework = document.createElement('div');
    firework.className = 'firework';
    firework.style.left = `${Math.random() * 100}%`;
    firework.style.top = `${Math.random() * 80}%`;
    firework.style.width = '10px';
    firework.style.height = '10px';
    firework.style.background = 'gold';
    firework.style.borderRadius = '50%';
    firework.style.position = 'absolute';
    firework.style.animation = 'explode 1s ease-out forwards';
    document.body.appendChild(firework);
    setTimeout(() => document.body.removeChild(firework), 1000);
  }
}

// Корона при выигрыше
function showCrown() {
  const crown = document.createElement('div');
  crown.innerText = '👑';
  crown.style.position = 'absolute';
  crown.style.top = '20%';
  crown.style.left = '50%';
  crown.style.transform = 'translateX(-50%)';
  crown.style.fontSize = '6em';
  crown.style.zIndex = '999';
  document.body.appendChild(crown);
  setTimeout(() => {
    document.body.removeChild(crown);
  }, 2000);
}

// Мигание экрана
function flashScreen(color) {
  const flash = document.createElement('div');
  flash.style.position = 'fixed';
  flash.style.top = '0';
  flash.style.left = '0';
  flash.style.width = '100%';
  flash.style.height = '100%';
  flash.style.backgroundColor = color;
  flash.style.opacity = '0.7';
  flash.style.zIndex = '9999';
  flash.style.animation = 'flash 0.5s forwards';
  document.body.appendChild(flash);
  setTimeout(() => document.body.removeChild(flash), 500);
}

// Сообщение о выигрыше
function showWinMessage(amount) {
  const msg = document.createElement('div');
  msg.style.position = 'fixed';
  msg.style.top = '30%';
  msg.style.left = '50%';
  msg.style.transform = 'translate(-50%, -50%)';
  msg.style.background = '#4caf50';
  msg.style.padding = '20px 40px';
  msg.style.borderRadius = '20px';
  msg.style.color = '#fff';
  msg.style.fontSize = '2em';
  msg.style.zIndex = '999';
  msg.innerText = `Вітаємо! Ви виграли ${amount} грн!`;
  document.body.appendChild(msg);
  setTimeout(() => {
    document.body.removeChild(msg);
  }, 3000);
}

// Модалки
function recharge() {
  document.getElementById('paymentModal').style.display = 'flex';
}

function confirmRecharge() {
  document.getElementById('confirmationMessage').innerText = 'Очікуємо зарахування на баланс.';
}

function openRegistration() {
  document.getElementById('registrationModal').style.display = 'flex';
}

function completeRegistration() {
  const name = document.getElementById('profileName').value.trim();
  const email = document.getElementById('emailAddress').value.trim();
  const password = document.getElementById('profilePassword').value.trim();
  const wallet = document.getElementById('walletAddress').value.trim();

  if (name && email && password && wallet) {
    user = { name, email, password, wallet, balance };
    localStorage.setItem('casinoUser', JSON.stringify(user));
    document.getElementById('authButtons').style.display = 'flex';
    updateUserInfo();
    closeModal();
    alert('Акаунт створено успішно!');
  } else {
    alert('Будь ласка, заповніть усі поля!');
  }
}

function login() {
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();
  const savedUser = JSON.parse(localStorage.getItem('casinoUser'));

  if (savedUser && savedUser.email === email && savedUser.password === password) {
    user = savedUser;
    balance = user.balance;
    updateBalanceDisplay();
    document.getElementById('authButtons').style.display = 'flex';
    updateUserInfo();
    closeModal();
    alert('Вхід успішний!');
  } else {
    alert('Невірні дані для входу!');
  }
}

function logout() {
  localStorage.removeItem('casinoUser');
  user = null;
  balance = 500;
  updateBalanceDisplay();
  document.getElementById('authButtons').style.display = 'none';
  document.getElementById('user-info').innerText = '';
  alert('Ви вийшли з акаунта!');
}

function openProfile() {
  if (user) {
    document.getElementById('profileNameDisplay').innerText = `Нікнейм: ${user.name}`;
    document.getElementById('profileEmailDisplay').innerText = `Email: ${user.email}`;
    document.getElementById('profileWalletDisplay').innerText = `Гаманець USDT: ${user.wallet}`;
    document.getElementById('profileBalanceDisplay').innerText = `Баланс: ${balance} грн`;
    document.getElementById('profileModal').style.display = 'flex';
  }
}

function closeModal() {
  document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
}

// Перевод USDT ➔ грн
function calculateUAH() {
  const usdt = parseFloat(document.getElementById('usdtAmount').value);
  if (!isNaN(usdt)) {
    const uah = usdt * 42;
    document.getElementById('uahResult').innerText = `Ви отримаєте ${uah} грн.`;
  } else {
    document.getElementById('uahResult').innerText = '';
  }
}

// Таймер Джекпота
let minutes = 30;
let seconds = 0;

function startJackpotTimer() {
  setInterval(() => {
    if (seconds === 0) {
      if (minutes === 0) {
        minutes = 30;
        seconds = 0;
        flashScreen('gold');
      } else {
        minutes--;
        seconds = 59;
      }
    } else {
      seconds--;
    }
    document.getElementById('jackpotTimer').innerText = `Джекпот через: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }, 1000);
}

// Отображение инфы о пользователе
function updateUserInfo() {
  if (user) {
    document.getElementById('user-info').innerText = `Ви увійшли як ${user.name}`;
  }
}

// Копирование адреса кошелька
function copyWallet() {
  const walletText = document.getElementById('walletAddressText').innerText;
  navigator.clipboard.writeText(walletText).then(() => {
    alert('Адресу скопійовано!');
  });
}
