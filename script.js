// 🎰 Альфа Казино — ОБНОВЛЕННЫЙ SCRIPT С ХРАНЕНИЕМ НЕСКОЛЬКИХ ПОЛЬЗОВАТЕЛЕЙ

let currentUser = JSON.parse(localStorage.getItem('casinoCurrentUser')) || null;
let balance = currentUser ? currentUser.balance : 500;
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
  if (currentUser) {
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
  if (currentUser) {
    document.getElementById('user-info').innerText = `Вітаємо, ${currentUser.name}!`;
  }
}

function updateBalanceDisplay() {
  document.getElementById('balance').innerText = balance;
  if (currentUser) {
    currentUser.balance = balance;
    localStorage.setItem('casinoCurrentUser', JSON.stringify(currentUser));

    let users = JSON.parse(localStorage.getItem('casinoUsers')) || [];
    users = users.map(u => u.email === currentUser.email ? currentUser : u);
    localStorage.setItem('casinoUsers', JSON.stringify(users));
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

  let users = JSON.parse(localStorage.getItem('casinoUsers')) || [];

  if (users.some(u => u.email === email)) {
    return alert('Користувач з таким email вже існує!');
  }

  const newUser = { name, email, password, wallet, balance: 600 };
  users.push(newUser);
  localStorage.setItem('casinoUsers', JSON.stringify(users));
  localStorage.setItem('casinoCurrentUser', JSON.stringify(newUser));

  currentUser = newUser;
  balance = 600;

  document.getElementById('headerButtons').style.display = 'none';
  document.getElementById('authButtons').style.display = 'flex';
  updateUserInfo();
  closeModal();
  alert('Реєстрація успішна! Вам нараховано бонус 100 грн.');
  updateBalanceDisplay();
}

function login() {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  const users = JSON.parse(localStorage.getItem('casinoUsers')) || [];

  const found = users.find(u => u.email === email && u.password === password);

  if (found) {
    currentUser = found;
    balance = found.balance;
    localStorage.setItem('casinoCurrentUser', JSON.stringify(currentUser));
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
  currentUser = null;
  localStorage.removeItem('casinoCurrentUser');
  balance = 500;
  updateBalanceDisplay();
  document.getElementById('headerButtons').style.display = 'flex';
  document.getElementById('authButtons').style.display = 'none';
  document.getElementById('user-info').innerText = '';
  alert('Ви вийшли з акаунта.');
}

function openProfile() {
  if (!currentUser) return;
  document.getElementById('profileNameDisplay').innerText = `Нікнейм: ${currentUser.name}`;
  document.getElementById('profileEmailDisplay').innerText = `Email: ${currentUser.email}`;
  document.getElementById('profileWalletDisplay').innerText = `Гаманець: ${currentUser.wallet}`;
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

function openGame(game) {
  const titles = {
    baccarat: "Баккара",
    blackjack: "Блэкджек",
    craps: "Крэпс",
    roulette: "Рулетка",
    poker: "Покер",
    wheel: "Колесо Фортуни"
  };

  document.getElementById('gameTitle').innerText = titles[game] || "Гра";
  document.getElementById('gameContent').innerHTML = `
    <p><em>${titles[game]} в розробці.</em></p>
    <p>Незабаром буде доступна повноцінна версія гри ${titles[game].toUpperCase()} 🎲</p>
  `;
  document.getElementById('gameModal').style.display = 'flex';
}
// =============== ГРИ =============== //

function openGame(game) {
  const modal = document.getElementById('gameModal');
  const titleEl = document.getElementById('gameTitle');
  const contentEl = document.getElementById('gameContent');

  const gameData = {
    baccarat: {
      title: "Баккара",
      html: `
        <p>Ваша ставка: <input type="number" id="baccarat-bet" value="100"> грн</p>
        <button onclick="startBaccarat()">Роздати карти</button>
        <div id="baccarat-result"></div>
      `
    },
    blackjack: {
      title: "Блэкджек",
      html: `
        <p>Ваші карти: <span id="playerCards"></span></p>
        <p>Сума: <span id="playerSum"></span></p>
        <p>Карти дилера: <span id="dealerCards"></span></p>
        <p>Сума дилера: <span id="dealerSum"></span></p>
        <button onclick="hit()">Взяти</button>
        <button onclick="stand()">Зупинитись</button>
        <div id="blackjackResult"></div>
      `
    },
    craps: {
      title: "Крэпс",
      html: `
        <button onclick="rollCraps()">Кинути кубики</button>
        <p>Результат: <span id="crapsResult">-</span></p>
      `
    },
    roulette: {
      title: "Рулетка",
      html: `
        <p>Обирайте: <button onclick="spinRoulette('red')">Червоне</button>
        <button onclick="spinRoulette('black')">Чорне</button></p>
        <p>Випало: <span id="rouletteResult">-</span></p>
      `
    },
    poker: {
      title: "Покер",
      html: `
        <p>Ваші карти: <span id="pokerCards"></span></p>
        <button onclick="dealPoker()">Роздати</button>
      `
    },
    wheel: {
      title: "Колесо Фортуни",
      html: `
        <button onclick="spinWheel()">Обертати колесо</button>
        <p>Випало: <span id="wheelResult">-</span></p>
      `
    }
  };

  const data = gameData[game];
  if (data) {
    titleEl.innerText = data.title;
    contentEl.innerHTML = data.html;
    modal.style.display = 'flex';
    if (game === 'blackjack') initBlackjack();
  }
}

// === БАККАРА ===
function startBaccarat() {
  const player = Math.floor(Math.random() * 10 + 1);
  const banker = Math.floor(Math.random() * 10 + 1);
  let result = `Гравець: ${player}, Банкір: ${banker} — `;
  if (player > banker) result += "Перемога гравця!";
  else if (banker > player) result += "Перемога банкіра!";
  else result += "Нічия!";
  document.getElementById('baccarat-result').innerText = result;
}

// === БЛЭКДЖЕК ===
let blackjackPlayer = [], blackjackDealer = [];
function initBlackjack() {
  blackjackPlayer = [drawCard(), drawCard()];
  blackjackDealer = [drawCard()];
  updateBlackjackDisplay();
}
function drawCard() {
  const ranks = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];
  const card = ranks[Math.floor(Math.random() * ranks.length)];
  return card;
}
function calculateSum(cards) {
  let sum = 0, aces = 0;
  for (let c of cards) {
    if (['J','Q','K'].includes(c)) sum += 10;
    else if (c === 'A') { sum += 11; aces++; }
    else sum += parseInt(c);
  }
  while (sum > 21 && aces > 0) { sum -= 10; aces--; }
  return sum;
}
function updateBlackjackDisplay() {
  document.getElementById('playerCards').innerText = blackjackPlayer.join(', ');
  document.getElementById('dealerCards').innerText = blackjackDealer.join(', ');
  document.getElementById('playerSum').innerText = calculateSum(blackjackPlayer);
  document.getElementById('dealerSum').innerText = calculateSum(blackjackDealer);
}
function hit() {
  blackjackPlayer.push(drawCard());
  updateBlackjackDisplay();
  if (calculateSum(blackjackPlayer) > 21) {
    document.getElementById('blackjackResult').innerText = "Перебір! Ви програли.";
  }
}
function stand() {
  while (calculateSum(blackjackDealer) < 17) {
    blackjackDealer.push(drawCard());
  }
  updateBlackjackDisplay();
  const playerSum = calculateSum(blackjackPlayer);
  const dealerSum = calculateSum(blackjackDealer);
  let result;
  if (playerSum > 21) result = "Ви програли!";
  else if (dealerSum > 21 || playerSum > dealerSum) result = "Ви виграли!";
  else if (playerSum < dealerSum) result = "Ви програли!";
  else result = "Нічия!";
  document.getElementById('blackjackResult').innerText = result;
}

// === КРЭПС ===
function rollCraps() {
  const die1 = Math.floor(Math.random()*6)+1;
  const die2 = Math.floor(Math.random()*6)+1;
  const total = die1 + die2;
  let result = `🎲 ${die1} + ${die2} = ${total} — `;
  if ([7,11].includes(total)) result += "Перемога!";
  else if ([2,3,12].includes(total)) result += "Програш!";
  else result += "Повторіть спробу.";
  document.getElementById('crapsResult').innerText = result;
}

// === РУЛЕТКА ===
function spinRoulette(choice) {
  const num = Math.floor(Math.random()*36)+1;
  const color = (num % 2 === 0) ? 'black' : 'red';
  const win = (choice === color);
  document.getElementById('rouletteResult').innerText = `${num} (${color}) — ${win ? 'Ви виграли!' : 'Програш'}`;
}

// === ПОКЕР ===
function dealPoker() {
  const suits = ['♠','♥','♦','♣'];
  const ranks = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];
  let hand = [];
  while (hand.length < 5) {
    const card = ranks[Math.floor(Math.random()*ranks.length)] + suits[Math.floor(Math.random()*suits.length)];
    if (!hand.includes(card)) hand.push(card);
  }
  document.getElementById('pokerCards').innerText = hand.join(', ');
}

// === КОЛЕСО ФОРТУНИ ===
function spinWheel() {
  const sectors = ['100', '200', '0', 'x2', '500', '0', 'x3', '1000'];
  const result = sectors[Math.floor(Math.random()*sectors.length)];
  document.getElementById('wheelResult').innerText = `Ви виграли: ${result}`;
}
