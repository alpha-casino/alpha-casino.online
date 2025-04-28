// Переменные
let user = JSON.parse(localStorage.getItem('casinoUser')) || null;
let balance = user ? user.balance : (localStorage.getItem('casinoBalance') ? parseInt(localStorage.getItem('casinoBalance')) : 500);
let musicPlaying = false;
const symbols = ['🍒', '🍋', '🍉', '🍇', '💎', '🔔', '⭐', '7️⃣', '🍀'];
const slots = [
  document.getElementById('slot1'),
  document.getElementById('slot2'),
  document.getElementById('slot3'),
  document.getElementById('slot4'),
  document.getElementById('slot5')
];
const music = new Audio('background-music.mp3');
music.loop = true;
music.volume = 0.2;

// Инициализация сайта
window.onload = () => {
  showSplashScreen();
};

// Splash Screen
function showSplashScreen() {
  const splash = document.getElementById('splashScreen');
  setTimeout(() => {
    splash.style.opacity = '0';
    setTimeout(() => {
      splash.style.display = 'none';
      startupCheck(); // После исчезновения Splash проверяем состояние
    }, 500);
  }, 2500);
}

// Проверка состояния сайта
function startupCheck() {
  user = JSON.parse(localStorage.getItem('casinoUser')) || null;
  balance = user ? user.balance : (localStorage.getItem('casinoBalance') ? parseInt(localStorage.getItem('casinoBalance')) : 500);

  if (!user || balance <= 0 || isCorruptData()) {
    localStorage.clear();
    setTimeout(() => {
      openRegistration(); // Открываем окно регистрации
    }, 300);
  } else {
    updateUserInfo();
    updateBalanceDisplay();
    setupMusicControl();
    startJackpotTimer();
    enableSpinButton();
  }
}

// Проверка битых данных
function isCorruptData() {
  const savedUser = JSON.parse(localStorage.getItem('casinoUser'));
  return !savedUser || !savedUser.name || !savedUser.email || !savedUser.wallet;
}

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

// Обновить баланс на сайте
function updateBalanceDisplay() {
  document.getElementById('balance').innerText = balance;
  localStorage.setItem('casinoBalance', balance);
  if (balance <= 0) {
    disableSpinButton();
  } else {
    enableSpinButton();
  }
}

// Отключить/включить кнопку спина
function disableSpinButton() {
  document.getElementById('spinButton').disabled = true;
}
function enableSpinButton() {
  document.getElementById('spinButton').disabled = false;
}

// Обновить отображение ставки
function updateBetDisplay() {
  const bet = parseInt(document.getElementById('betAmount').value);
  document.getElementById('betDisplay').innerText = bet;
}

// Старт вращения слотов
function startSpin() {
  const bet = parseInt(document.getElementById('betAmount').value);
  if (bet > balance) {
    alert('Недостатньо коштів для ставки!');
    return;
  }

  balance -= bet;
  updateBalanceDisplay();
  disableSpinButton();

  let running = [true, true, true, true, true];
  let stopDelays = [1200, 1700, 2200, 2700, 3200];

  for (let i = 0; i < slots.length; i++) {
    spinSlot(i);
    setTimeout(() => { running[i] = false; }, stopDelays[i]);
  }

  function spinSlot(index) {
    function animate() {
      if (running[index]) {
        slots[index].innerText = symbols[Math.floor(Math.random() * symbols.length)];
        slots[index].style.transform = `rotate(${Math.random() * 30 - 15}deg)`;
        requestAnimationFrame(animate);
      } else {
        slots[index].style.transform = 'rotate(0deg)';
      }
    }
    animate();
  }

  setTimeout(() => {
    checkWin(bet);
  }, Math.max(...stopDelays) + 500);
}

// Проверка выигрыша
function checkWin(bet) {
  const results = slots.map(slot => slot.innerText);
  const allSame = results.every(symbol => symbol === results[0]);

  if (allSame) {
    let multiplier = Math.floor(Math.random() * 6) + 5;
    let winAmount = bet * multiplier;
    balance += winAmount;
    updateBalanceDisplay();
    celebrateWin(winAmount);
  } else {
    updateBalanceDisplay();
  }
  enableSpinButton();
}

// Празднование выигрыша
function celebrateWin(amount) {
  flashScreen('white');
  vibrateWin();
  launchFireworks();
  showCrown();
  showWinMessage(amount);
}

// Эффект вибрации
function vibrateWin() {
  if (navigator.vibrate) {
    navigator.vibrate([300, 200, 300]);
  }
}

// Эффект салюта
function launchFireworks() {
  for (let i = 0; i < 25; i++) {
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

// Показ короны при выигрыше
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
  setTimeout(() => { document.body.removeChild(crown); }, 2000);
}

// Мигалка экрана
function flashScreen(color) {
  const flash = document.createElement('div');
  flash.style.position = 'fixed';
  flash.style.top = '0';
  flash.style.left = '0';
  flash.style.width = '100%';
  flash.style.height = '100%';
  flash.style.backgroundColor = color;
  flash.style.opacity = '0.6';
  flash.style.zIndex = '9999';
  flash.style.animation = 'flash 0.5s forwards';
  document.body.appendChild(flash);
  setTimeout(() => { document.body.removeChild(flash); }, 500);
}

// Показ сообщения о выигрыше
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
  setTimeout(() => { document.body.removeChild(msg); }, 3000);
}

// Модалки
function recharge() {
  document.getElementById('paymentModal').style.display = 'flex';
}

function confirmRecharge() {
  document.getElementById('confirmationMessage').innerText = 'Очікуємо зарахування...';
}

function copyWallet() {
  const walletText = document.getElementById('walletAddressText').innerText;
  navigator.clipboard.writeText(walletText).then(() => {
    alert('Адрес скопійовано!');
  });
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
    alert('Реєстрація успішна! Вам нараховано бонус 100 грн!');
    balance += 100;
    updateBalanceDisplay();
  } else {
    alert('Будь ласка, заповніть всі поля!');
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
    alert('Невірні дані!');
  }
}

function logout() {
  localStorage.removeItem('casinoUser');
  localStorage.setItem('casinoBalance', 500);
  user = null;
  balance = 500;
  updateBalanceDisplay();
  document.getElementById('authButtons').style.display = 'none';
  document.getElementById('user-info').innerText = '';
  alert('Ви вийшли з акаунта.');
}

function openProfile() {
  if (user) {
    document.getElementById('profileNameDisplay').innerText = `Нікнейм: ${user.name}`;
    document.getElementById('profileEmailDisplay').innerText = `Email: ${user.email}`;
    document.getElementById('profileWalletDisplay').innerText = `Гаманець: ${user.wallet}`;
    document.getElementById('profileBalanceDisplay').innerText = `Баланс: ${balance} грн`;
    document.getElementById('profileModal').style.display = 'flex';
  }
}

function closeModal() {
  document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
}

// Таймер джекпота
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
