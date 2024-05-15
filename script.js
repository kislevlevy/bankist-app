'use strict';

//////////////////////////////////////////////////////////////////
// Accounts:
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const account5 = {
  owner: 'Kislev Levy',
  movements: [9000, -594, -7000, 8000, -6000, 12598, -8000],
  interestRate: 1,
  pin: '2070',
};

const account6 = {
  owner: 'Sin Levy',
  movements: [
    870000, -8706.9, -960, -1250, -5469.3, -653.6, -863.5, -2560.11, 8000,
  ],
  interestRate: 1,
  pin: '0245',
};

const account7 = {
  owner: 'Nir Levy',
  movements: [430, -500, 1000, -300, 700, -259, 50, -896, 90],
  interestRate: 1,
  pin: '0346',
};

const accounts = [
  account1,
  account2,
  account3,
  account4,
  account5,
  account6,
  account7,
];

//////////////////////////////////////////////////////////////////
// Elements:
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//////////////////////////////////////////////////////////////////
// From Here Kislev Levy Code Start:
// (if you read this send me this emoji === '🕵️' )
//////////////////////////////////////////////////////////////////

// Display Movements:
const displayMovements = function (account, sort = false) {
  containerMovements.innerHTML = '';

  //Sort Logic:
  const movements = sort
    ? account.movements.slice().sort((a, b) => a - b)
    : account.movements;

  // Display Movements Logic:
  movements.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__value">${mov}₪</div>
    </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// Display Blance:
const calcDisplayBlance = function (account) {
  account.balance = account.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${account.balance}₪`;
};

// Display Summery:
const calcDisplaySummery = function (account) {
  // Income Summery:
  const income = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${income}₪`;

  // Diposit Summery:
  const outcome = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(outcome)}₪`;

  // Intrest Summery:
  const interest = account.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * account.interestRate) / 100)
    .filter(mov => mov >= 1)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = `${interest}₪`;
};

// Currencies 'API':
const currencies = new Map([
  ['USD', 'United States dollar', '$'],
  ['EUR', 'Euro', '€'],
  ['GBP', 'Pound sterling', '£'],
  ['ILS', 'Israeli New Shekel', '₪'],
]);

// Movements Practice:
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const EURtoNIS = 3.92;

// Create Username:
const createUsername = function (accounts) {
  accounts.forEach(
    account =>
      (account.username = account.owner
        .toLowerCase()
        .split(' ')
        .map(name => name[0])
        .join(''))
  );
};
createUsername(accounts);

// Update UI:
const updateUI = function (account) {
  displayMovements(account);
  calcDisplayBlance(account);
  calcDisplaySummery(account);
};

//////////////////////////////////////////////////////////////////
// Event Handlers:

// Login Button Logic:
let currentAccount;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  if (currentAccount?.pin == inputLoginPin.value) {
    // Console Log Conformation:
    console.log('Loged In!');

    // Welcome Message:
    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(' ')[0]
    }`;

    //UI Opacity Change:
    containerApp.style.opacity = 100;

    // Update UI:
    updateUI(currentAccount);

    // Clear Input:
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    inputLoginUsername.blur();
  }
});

// Transfer Money Logic:
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const transferAmount = Number(inputTransferAmount.value);
  const reciverAccount = accounts.find(
    account => account.username === inputTransferTo.value
  );

  // Logic:
  if (
    transferAmount > 0 &&
    transferAmount <= currentAccount.balance &&
    reciverAccount &&
    reciverAccount !== currentAccount
  ) {
    // Mooving Money Oporation:
    reciverAccount.movements.push(transferAmount);
    currentAccount.movements.push(-transferAmount);
    updateUI(currentAccount);

    // Message:
    console.log(`Transferring ${transferAmount}₪ to ${reciverAccount.owner}`);
  }

  // Clear Input:
  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferAmount.blur();
  inputTransferTo.blur();
});

// Loan Logic:
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
  }

  // Clear Input:
  inputLoanAmount.value = '';
  inputLoanAmount.blur();
});

// Close Account Logic:
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    currentAccount.username == inputCloseUsername.value &&
    currentAccount.pin == inputClosePin.value
  ) {
    // Delete Account
    const index = accounts.findIndex(
      acc => acc.username == currentAccount.username
    );
    accounts.splice(index, 1);

    // Log Out Oporation:
    containerApp.style.opacity = 0;
    labelWelcome.textContent = 'Log in to get started';
  }

  // Clear Input:
  inputClosePin.value = inputCloseUsername.value = '';
  inputClosePin.blur();
  inputCloseUsername.blur();
});

// Sort Logic:
let sortState = true;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, sortState);
  sortState = !sortState;
});

//////////////////////////////////////////////////////////////////
// Challenge No' 4:
//////////////////////////////////////////////////////////////////

// Data:
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

// 1.
console.log('1.');
dogs.forEach(dog => (dog.recommendedFood = dog.weight ** 0.75 * 28));
console.log('____________________________________');

// 2.
console.log('2.');
const isRecommendedPortion = function (dog) {
  if (
    dog.curFood >= dog.recommendedFood * 0.9 &&
    dog.curFood <= dog.recommendedFood * 1.1
  )
    return 'okay';
  if (dog.curFood < dog.recommendedFood * 0.9) return 'too little';
  if (dog.curFood > dog.recommendedFood * 1.1) return 'too much';
};

const sarahResult = isRecommendedPortion(
  dogs.find(dog => dog.owners.includes('Sarah'))
);
console.log(`Sarah's dog is eating ${sarahResult}`);
console.log('____________________________________');

// 3.
console.log('3.');
const ownersEatTooMuch = [];
const ownersEatTooLittle = [];
const ownersEatOkay = [];

dogs.forEach(function (dog) {
  if (isRecommendedPortion(dog) === 'too little')
    ownersEatTooLittle.push(...dog.owners);
  if (isRecommendedPortion(dog) === 'too much')
    ownersEatTooMuch.push(...dog.owners);
  if (isRecommendedPortion(dog) === 'okay') ownersEatOkay.push(...dog.owners);
});
console.log('____________________________________');

// 4.
console.log('4.');
console.log(`${ownersEatTooMuch.join(' and ')}'s dogs eat too much!`);
console.log(`${ownersEatTooLittle.join(' and ')}'s dogs eat too little!`);
console.log('____________________________________');

// 5.
console.log('5.');
console.log(dogs.some(dog => dog.curFood === dog.recommendedFood));
console.log('____________________________________');

// 6.
console.log('6.');
console.log(ownersEatOkay.length > 0);
console.log('____________________________________');

// 7.
console.log('7.');
//did that already hahaha
console.log('____________________________________');

// 8.
console.log('8.');
const dogsCopy = dogs
  .slice()
  .sort((dogA, dogB) => dogA.recommendedFood - dogB.recommendedFood);
console.log(dogsCopy);
console.log('____________________________________');

const convertToTitleCase = function (title) {
  const exptiopns = [
    'and',
    'as',
    'but',
    'for',
    'if',
    'nor',
    'or',
    'so',
    'yet',
    'as',
    'at',
    'by',
    'for',
    'in',
    'of',
    'off',
    'on',
    'per',
    'to',
    'up',
    'via',
    'a',
    'an',
    'the',
  ];
  return title
    .toLowerCase()
    .split(' ')
    .map(value =>
      exptiopns.includes(value)
        ? value
        : value[0].toUpperCase() + value.slice(1)
    )
    .join(' ');
};

console.log(convertToTitleCase('this iS D A NICE title'));
