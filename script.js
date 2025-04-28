// Переменные
let user = JSON.parse(localStorage.getItem('casinoUser')) || null;
let balance = user ? user.balance : (localStorage.getItem('casinoBalance') ? parseInt(localStorage.getItem('casinoBalance')) : 500);
let musicPlaying = false;
const symbols = ['🍒', '🍋', '🍉', '🍇', '💎', '🔔', '⭐', '7️⃣', '🍀'];
let running = [false, false, false, false, false];
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

// Инициализация
updateBalanceDisplay();
setupMusicControl();
startJackpotTimer();
checkZeroBalanceOnLoad();
updateUserInfo();

// Музыка
function setupMusicControl() {
  const musicControl = document.getElementById('musicControl');
  if (!musicControl) return;

  function toggleMusic() {
    if (musicPlaying) {
      music.pause();
    } else {
      music.play();
    }
    musicPlaying = !musicPlaying;
  }

  document.addEventListener('click', () => {
    if (!musicPlaying) {
      music.play();
      musicPlaying = true;
    }
  }, { once: true });

  document.addEventListener('touchstart', () => {
    if (!musicPlaying) {
      music.play();
      musicPlaying = true;
    }
  }, { once: true });

  musicControl.addEventListener('click', toggleMusic);
  musicControl.addEventListener('touchstart', toggleMusic);
}

// Обновить баланс
function updateBalanceDisplay() {
  if (isNaN(balance) || balance < 0) {
    balance = 0;
  }
  document.getElementById('balance').innerText = balance;
  if (user) {
    user.balance = balance;
    localStorage.setItem('casinoUser', JSON.stringify(user));
  } else {
    localStorage.setItem('casinoBalance', balance);
  }

  if (balance <= 0) {
    disableSpinButton();
  } else {
    enableSpinButton();
  }
}

// Кнопки
function disableSpinButton() {
  document.getElementById('spinButton').disabled = true;
}

function enableSpinButton() {
  document.getElementById('spinButton').disabled = false;
}

// Проверка баланса при загрузке
function checkZeroBalanceOnLoad() {
  if (balance <= 0) {
    if (!user) {
      openRegistration();
    } else {
      recharge();
    }
  }
}

// Крутка слотов
function startSpin() {
  const bet = parseInt(document.getElementById('betAmount').value);
  if (isNaN(bet) || bet > balance || bet <= 0) {
    alert('Недостатньо коштів або некоректна ставка!');
    return;
  }

  balance -= bet;
  updateBalanceDisplay();
  disableSpinButton();

  running = [true, true, true, true, true];
  const stopDelays = [1500, 2000, 2500, 3000, 3500];

  for (let i = 0; i < slots.length; i++) {
    spinSlot(i);
    setTimeout(() => { running[i] = false; }, stopDelays[i]);
  }

  setTimeout(() => {
    checkWin(bet);
  }, Math.max(...stopDelays) + 500);
}

function spinSlot(index) {
  function animate() {
    if (running[index]) {
      slots[index].innerText = symbols[Math.floor(Math.random() * symbols.length)];
      requestAnimationFrame(animate);
    }
  }
  animate();
}

// Проверка выигрыша
function checkWin(bet) {
  const results = slots.map(slot => slot.innerText);
  const allSame = results.every(symbol => symbol === results[0]);

  if (allSame) {
    let multiplier = Math.floor(Math.random() * 5) + 5;
    let winAmount = bet * multiplier;
    balance += winAmount;
    updateBalanceDisplay();
    celebrateWin(winAmount);
  }

  if (balance <= 0) {
    if (!user) {
      openRegistration();
    } else {
      recharge();
    }
  }
  enableSpinButton();
}

// Эффекты при выигрыше
function celebrateWin(amount) {
  flashScreen('white');
  vibrateWin();
  launchFireworks();
  showCrown();
  showWinMessage(amount);
}

function vibrateWin() {
  if (navigator.vibrate) {
    navigator.vibrate([300, 200, 300]);
  }
}

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
  setTimeout(() => document.body.removeChild(crown), 2000);
}

function showWinMessage(amount) {
  const msg = document.createElement('div');
  msg.style.position = 'fixed';
  msg.style.top = '30%';
  msg.style.left = '50%';
  msg.style.transform = 'translate(-50%, -50%)';
  msg.style.background: '#4caf50';
  msg.style.padding: '20px 40px';
  msg.style.borderRadius: '20px';
  msg.style.color: '#fff';
  msg.style.fontSize: '2em';
  msg.style.zIndex: '999';
  msg.innerText = `Вітаємо! Ви виграли ${amount} грн!`;
  document.body.appendChild(msg);
  setTimeout(() => document.body.removeChild(msg), 3000);
}

// Модалки
function recharge() {
  document.getElementById('paymentModal').style.display = 'flex';
}

function openRegistration() {
  document.getElementById('registrationModal').style.display = 'flex';
}

function openLogin() {
  document.getElementById('loginModal').style.display = 'flex';
}

function openProfile() {
  alert('Профіль ще в розробці.');
}

function closeModal() {
  document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
}

function completeRegistration() {
  const name = document.getElementById('profileName').value.trim();
  const email = document.getElementById('emailAddress').value.trim();
  const wallet = document.getElementById('walletAddress').value.trim();

  if (name && email && wallet) {
    user = { name, email, wallet, balance };
    localStorage.setItem('casinoUser', JSON.stringify(user));
    closeModal();
    alert('Акаунт створено! Тепер поповніть баланс.');
    recharge();
    document.getElementById('profileButton').style.display = 'inline-block';
  } else {
    alert('Будь ласка, заповніть усі поля!');
  }
}

function login() {
  const email = document.getElementById('loginEmail').value.trim();
  if (user && email === user.email) {
    closeModal();
    alert('Вхід успішний!');
    document.getElementById('profileButton').style.display = 'inline-block';
  } else {
    alert('Невірний email!');
  }
}

function logout() {
  localStorage.removeItem('casinoUser');
  user = null;
  balance = 500;
  updateBalanceDisplay();
  alert('Ви вийшли з акаунта.');
  document.getElementById('profileButton').style.display = 'none';
}

function copyWallet() {
  const walletText = document.getElementById('walletAddressText').innerText;
  navigator.clipboard.writeText(walletText).then(() => {
    alert('Адресу скопійовано!');
  });
}

function calculateUAH() {
  const usdt = parseFloat(document.getElementById('usdtAmount').value);
  if (!isNaN(usdt)) {
    const uah = usdt * 42;
    document.getElementById('uahResult').innerText = `Отримаєте ${uah} грн.`;
  } else {
    document.getElementById('uahResult').innerText = '';
  }
}

function confirmRecharge() {
  const usdtAmount = parseFloat(document.getElementById('usdtAmount').value);
  if (!isNaN(usdtAmount) && usdtAmount > 0) {
    const uah = usdtAmount * 42;
    balance += uah;
    updateBalanceDisplay();
    closeModal();
    alert(`Баланс поповнено на ${uah} грн!`);
  } else {
    alert('Введіть коректну суму USDT!');
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
