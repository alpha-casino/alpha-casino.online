// 🎰 Альфа Казино — ПОЛНЫЙ ФИНАЛЬНЫЙ JAVASCRIPT С BIG WIN И ВСЕЙ ИГРОВОЙ ЛОГИКОЙ

// Переменные
let user = JSON.parse(localStorage.getItem('casinoUser')) || null;
let balance = user ? user.balance : 500;
let musicPlaying = false;
let music = document.getElementById('bgMusic');

const symbols = ['🍒','🍋','🍉','🍇','💎','🔔','⭐','7️⃣','🍀'];
const slots = [
  document.getElementById('slot1'),
  document.getElementById('slot2'),
  document.getElementById('slot3'),
  document.getElementById('slot4'),
  document.getElementById('slot5')
];

window.onload = () => {
  showSplashScreen();
};

function showSplashScreen() {
  const splash = document.getElementById('splashScreen');
  setTimeout(() => {
    splash.style.opacity = '0';
    setTimeout(() => {
      splash.style.display = 'none';
      startupCheck();
    }, 500);
  }, 2500);
}

function startupCheck() {
  updateBalanceDisplay();
  updateUserInfo();
  setupMusicControl();
  startJackpotTimer();
  if (user) {
    document.getElementById('headerButtons').style.display = 'none';
    document.getElementById('authButtons').style.display = 'flex';
  } else if (balance <= 0) {
    openRegistration();
  }
}

function setupMusicControl() {
  document.addEventListener('click', () => {
    if (!musicPlaying) {
      music.play().catch(() => {});
      musicPlaying = true;
    }
  }, { once: true });

  document.getElementById('musicControl').addEventListener('click', () => {
    if (musicPlaying) music.pause(); else music.play().catch(() => {});
    musicPlaying = !musicPlaying;
  });
}

function updateUserInfo() {
  if (user) {
    document.getElementById('user-info').innerText = `Вітаємо, ${user.name}!`;
  }
}

function updateBalanceDisplay() {
  document.getElementById('balance').innerText = balance;
  if (user) {
    user.balance = balance;
    localStorage.setItem('casinoUser', JSON.stringify(user));
  } else {
    localStorage.setItem('casinoBalance', balance);
  }
}

function updateBetDisplay() {
  const bet = document.getElementById('betAmount').value;
  document.getElementById('betDisplay').innerText = bet;
}

function startSpin() {
  const bet = parseInt(document.getElementById('betAmount').value);
  if (balance < bet) return alert('Недостатньо коштів!');
  balance -= bet;
  updateBalanceDisplay();
  document.getElementById('spinButton').disabled = true;

  const spinIntervals = [];
  const results = [];

  slots.forEach((slot, i) => {
    let interval = setInterval(() => {
      slot.innerText = symbols[Math.floor(Math.random() * symbols.length)];
    }, 100);
    spinIntervals.push(interval);
  });

  slots.forEach((slot, i) => {
    setTimeout(() => {
      clearInterval(spinIntervals[i]);
      const finalSymbol = symbols[Math.floor(Math.random() * symbols.length)];
      slot.innerText = finalSymbol;
      results[i] = finalSymbol;

      if (i === slots.length - 1) {
        setTimeout(() => {
          checkWin(results, bet);
          document.getElementById('spinButton').disabled = false;
        }, 300);
      }
    }, 1000 + i * 700);
  });
}

function checkWin(results, bet) {
  const win = results.every(symbol => symbol === results[0]);
  if (win) {
    const multiplier = Math.floor(Math.random() * 5 + 5);
    const prize = bet * multiplier;
    balance += prize;
    updateBalanceDisplay();
    celebrateWin(prize);
  }
}

function celebrateWin(amount) {
  const flash = document.createElement('div');
  flash.style.position = 'fixed';
  flash.style.top = '0';
  flash.style.left = '0';
  flash.style.width = '100%';
  flash.style.height = '100%';
  flash.style.backgroundColor = 'gold';
  flash.style.opacity = '0.8';
  flash.style.zIndex = '9999';
  document.body.appendChild(flash);
  setTimeout(() => document.body.removeChild(flash), 500);

  if (navigator.vibrate) navigator.vibrate([300, 200, 300]);

  const crown = document.createElement('div');
  crown.innerText = '👑';
  crown.style.position = 'fixed';
  crown.style.top = '20%';
  crown.style.left = '50%';
  crown.style.transform = 'translateX(-50%)';
  crown.style.fontSize = '6em';
  crown.style.zIndex = '10000';
  document.body.appendChild(crown);
  setTimeout(() => document.body.removeChild(crown), 2000);

  const bigWin = document.createElement('div');
  bigWin.innerText = 'BIG WIN!';
  bigWin.style.position = 'fixed';
  bigWin.style.top = '40%';
  bigWin.style.left = '50%';
  bigWin.style.transform = 'translate(-50%, -50%)';
  bigWin.style.fontSize = '4em';
  bigWin.style.color = '#ff0000';
  bigWin.style.fontWeight = 'bold';
  bigWin.style.zIndex = '10001';
  bigWin.style.animation = 'bigwin 1s ease infinite alternate';
  document.body.appendChild(bigWin);
  setTimeout(() => document.body.removeChild(bigWin), 3000);

  alert(`Вітаємо! Ви виграли ${amount} грн!`);
}

function openRegistration() {
  document.getElementById('registrationModal').style.display = 'flex';
}

function openLogin() {
  document.getElementById('loginModal').style.display = 'flex';
}

function completeRegistration() {
  const name = document.getElementById('profileName').value;
  const email = document.getElementById('emailAddress').value;
  const password = document.getElementById('profilePassword').value;
  const wallet = document.getElementById('walletAddress').value;
  if (!name || !email || !password || !wallet) return alert('Заповніть всі поля!');
  user = { name, email, password, wallet, balance };
  localStorage.setItem('casinoUser', JSON.stringify(user));
  document.getElementById('headerButtons').style.display = 'none';
  document.getElementById('authButtons').style.display = 'flex';
  updateUserInfo();
  closeModal();
  alert('Реєстрація успішна! Вам нараховано бонус 100 грн.');
  balance += 100;
  updateBalanceDisplay();
}

function login() {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  const saved = JSON.parse(localStorage.getItem('casinoUser'));
  if (saved && saved.email === email && saved.password === password) {
    user = saved;
    balance = user.balance;
    updateBalanceDisplay();
    document.getElementById('headerButtons').style.display = 'none';
    document.getElementById('authButtons').style.display = 'flex';
    updateUserInfo();
    closeModal();
  } else {
    alert('Невірні дані!');
  }
}

function logout() {
  user = null;
  localStorage.removeItem('casinoUser');
  balance = 500;
  updateBalanceDisplay();
  document.getElementById('headerButtons').style.display = 'flex';
  document.getElementById('authButtons').style.display = 'none';
  document.getElementById('user-info').innerText = '';
  alert('Ви вийшли з акаунта.');
}

function openProfile() {
  if (!user) return;
  document.getElementById('profileNameDisplay').innerText = `Нікнейм: ${user.name}`;
  document.getElementById('profileEmailDisplay').innerText = `Email: ${user.email}`;
  document.getElementById('profileWalletDisplay').innerText = `Гаманець: ${user.wallet}`;
  document.getElementById('profileBalanceDisplay').innerText = `Баланс: ${balance} грн`;
  document.getElementById('profileModal').style.display = 'flex';
}

function recharge() {
  document.getElementById('paymentModal').style.display = 'flex';
}

function confirmRecharge() {
  const usdt = parseFloat(document.getElementById('usdtAmount').value);
  if (!isNaN(usdt) && usdt > 0) {
    const uah = usdt * 39;
    balance += uah;
    updateBalanceDisplay();
    alert(`Баланс поповнено на ${uah} грн`);
    closeModal();
  } else {
    alert('Введіть коректну суму');
  }
}

function withdraw() {
  document.getElementById('withdrawModal').style.display = 'flex';
}

function confirmWithdraw() {
  const amount = parseFloat(document.getElementById('withdrawAmount').value);
  const wallet = document.getElementById('withdrawWallet').value;
  if (!wallet || isNaN(amount) || amount <= 0) return alert('Введіть дані правильно');
  if (amount > balance) return alert('Недостатньо коштів на балансі');
  balance -= amount;
  updateBalanceDisplay();
  alert(`Заявка на виведення ${amount} грн на ${wallet} надіслана!`);
  closeModal();
}

function copyWallet() {
  const wallet = document.getElementById('walletAddressText').innerText;
  navigator.clipboard.writeText(wallet).then(() => alert('Адрес скопійовано!'));
}

function calculateUAH() {
  const usdt = parseFloat(document.getElementById('usdtAmount').value);
  if (!isNaN(usdt)) {
    document.getElementById('uahResult').innerText = `≈ ${usdt * 39} грн`;
  } else {
    document.getElementById('uahResult').innerText = '';
  }
}

function closeModal() {
  document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
}

function startJackpotTimer() {
  let min = 30, sec = 0;
  setInterval(() => {
    if (sec === 0) {
      if (min === 0) {
        min = 30;
        alert('🎉 Джекпот оновлено!');
      } else {
        min--; sec = 59;
      }
    } else {
      sec--;
    }
    document.getElementById('jackpotTimer').innerText = `Джекпот через: ${min}:${sec < 10 ? '0' : ''}${sec}`;
  }, 1000);
}
