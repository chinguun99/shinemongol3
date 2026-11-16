
const $ = id => document.getElementById(id);

function showPage(id) {
  document.querySelectorAll(".page").forEach(page => {
    page.classList.remove("active");
  });

  $(id).classList.add("active");
  $("navigation").classList.remove("open");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function toggleMenu() {
  $("navigation").classList.toggle("open");
}

// Local storage
function getData(key, fallback = []) {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
}

function saveData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// NEWS
let news = getData("sm3_news", [
  {
    title: "Student Hub-д тавтай морил!",
    content: "Энд сургуулийн мэдээ, сонирхолтой тоглоом, хичээлийн материал хуваалцана.",
    date: "Анхны мэдээлэл"
  }
]);

function renderNews() {
  const html = news.map(item => `
    <article class="news-item">
      <h3>${escapeHTML(item.title)}</h3>
      <p>${escapeHTML(item.content)}</p>
      <small>${escapeHTML(item.date)}</small>
    </article>
  `).join("");

  $("newsList").innerHTML = html || "<p>Одоогоор мэдээ алга.</p>";
  $("homeNews").innerHTML = html;
}

function addNews() {
  const title = $("newsTitle").value.trim();
  const content = $("newsContent").value.trim();

  if (!title || !content) {
    alert("Гарчиг болон мэдээллээ оруулна уу.");
    return;
  }

  news.unshift({
    title,
    content,
    date: new Date().toLocaleDateString("mn-MN")
  });

  saveData("sm3_news", news);
  $("newsTitle").value = "";
  $("newsContent").value = "";
  renderNews();
}

// COMMUNITY
let posts = getData("sm3_posts");

function renderPosts() {
  $("posts").innerHTML = posts.map(post => `
    <article class="news-item">
      <strong>${escapeHTML(post.name)}</strong>
      <p>${escapeHTML(post.content)}</p>
      <small>${escapeHTML(post.date)}</small>
    </article>
  `).join("") || "<p>Одоогоор нийтлэл алга.</p>";
}

function addPost() {
  const name = $("postName").value.trim();
  const content = $("postText").value.trim();

  if (!name || !content) {
    alert("Нэр болон бичвэрээ оруулна уу.");
    return;
  }

  posts.unshift({
    name,
    content,
    date: new Date().toLocaleString("mn-MN")
  });

  saveData("sm3_posts", posts);
  $("postText").value = "";
  renderPosts();
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

// GAMES
const games = [
  { id:"ttt", name:"Tic Tac Toe", emoji:"⭕", category:"1-3", desc:"Найзтайгаа X ба O тогло." },
  { id:"memory", name:"Memory Match", emoji:"🧠", category:"1-3", desc:"Ижил зургуудыг хослуул." },
  { id:"words", name:"Word Scramble", emoji:"🔤", category:"4-6", desc:"Холилдсон үгийг зөв болго." },
  { id:"math", name:"Math Puzzle", emoji:"➗", category:"4-6", desc:"Сонирхолтой бодлого бод." },
  { id:"riddle", name:"Brain Teasers", emoji:"🧩", category:"7-9", desc:"Логик таавар таа." },
  { id:"science", name:"Science Quiz", emoji:"🔬", category:"7-9", desc:"Шинжлэх ухааны асуултууд." },
  { id:"code", name:"Coding Challenge", emoji:"💻", category:"10-12", desc:"Программчлалын логик." },
  { id:"geography", name:"World Explorer", emoji:"🌍", category:"10-12", desc:"Дэлхийн газарзүйгээ шалга." }
];

function renderGames(category = "all") {
  const filtered = category === "all"
    ? games
    : games.filter(game => game.category === category);

  $("gameGrid").innerHTML = filtered.map(game => `
    <article class="game-card" onclick="openGame('${game.id}')">
      <div class="emoji">${game.emoji}</div>
      <h3>${game.name}</h3>
      <p>${game.desc}</p>
      <small>Анги: ${game.category.replace("-", "–")}</small>
    </article>
  `).join("");
}

function filterGames(category, button) {
  document.querySelectorAll(".filter").forEach(btn => {
    btn.classList.remove("active");
  });

  button.classList.add("active");
  renderGames(category);
}

// GAME: TIC TAC TOE
function ticTacToe() {
  let board = Array(9).fill("");
  let turn = "X";
  const area = $("gameArea");

  area.innerHTML = `
    <h2>⭕ Tic Tac Toe</h2>
    <p id="gameStatus">X-ийн ээлж</p>
    <div class="board" id="ticBoard"></div>
    <button class="primary" onclick="ticTacToe()">Дахин эхлүүлэх</button>
  `;

  function draw() {
    $("ticBoard").innerHTML = board.map((cell, i) => `
      <button onclick="move(${i})">${cell}</button>
    `).join("");
  }

  window.move = function(i) {
    if (board[i] || winner()) return;

    board[i] = turn;
    draw();

    if (winner()) {
      $("gameStatus").textContent = turn + " яллаа! 🎉";
    } else if (board.every(Boolean)) {
      $("gameStatus").textContent = "Тэнцлээ!";
    } else {
      turn = turn === "X" ? "O" : "X";
      $("gameStatus").textContent = turn + "-ийн ээлж";
    }
  };

  function winner() {
    const lines = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];

    return lines.some(([a,b,c]) =>
      board[a] && board[a] === board[b] && board[b] === board[c]
    );
  }

  draw();
}

// GAME: MEMORY
function memoryGame() {
  const symbols = ["🐱","🐶","🐸","🦊","🐼","🦁","🐱","🐶","🐸","🦊","🐼","🦁"]
    .sort(() => Math.random() - .5);

  let opened = [];
  let matched = [];
  let locked = false;

  $("gameArea").innerHTML = `
    <h2>🧠 Memory Match</h2>
    <p>Ижил дүрсүүдийг олж хослуулаарай!</p>
    <div class="memory-board" id="memoryBoard"></div>
    <p id="memoryStatus">Амжилт хүсье!</p>
    <button class="primary" onclick="memoryGame()">Дахин эхлүүлэх</button>
  `;

  function draw() {
    $("memoryBoard").innerHTML = symbols.map((symbol, i) => `
      <button onclick="flip(${i})">
        ${matched.includes(i) || opened.includes(i) ? symbol : "❔"}
      </button>
    `).join("");
  }

  window.flip = function(i) {
    if (locked || opened.includes(i) || matched.includes(i)) return;

    opened.push(i);
    draw();

    if (opened.length === 2) {
      locked = true;

      if (symbols[opened[0]] === symbols[opened[1]]) {
        matched.push(...opened);
        opened = [];
        locked = false;
        draw();

        if (matched.length === symbols.length) {
          $("memoryStatus").textContent = "Бүх хосоо оллоо! 🎉";
        }
      } else {
        setTimeout(() => {
          opened = [];
          locked = false;
          draw();
        }, 800);
      }
    }
  };

  draw();
}

// GAME: WORD SCRAMBLE
function wordGame() {
  const questions = [
    ["OOLHCI", "СУРГУУЛЬ"],
    ["LTIAC", "CAT"],
    ["OOKB", "BOOK"],
    ["REWTA", "WATER"],
    ["THMEMA", "MATH"]
  ];

  let index = Math.floor(Math.random() * questions.length);
  let question = questions[index];

  $("gameArea").innerHTML = `
    <h2>🔤 Word Scramble</h2>
    <p>Зөв үгийг бүтээ: <strong>${question[0]}</strong></p>
    <input id="wordAnswer" placeholder="Хариугаа бичнэ үү">
    <button class="primary" onclick="checkWord()">Шалгах</button>
    <p id="wordResult"></p>
    <button onclick="wordGame()">Өөр үг үзэх</button>
  `;

  window.checkWord = function() {
    const answer = $("wordAnswer").value.trim().toUpperCase();
    $("wordResult").textContent =
      answer === question[1] ? "Зөв байна! 🎉" : "Дахин оролдоорой!";
  };
}

// GAME: MATH
function mathGame() {
  const a = Math.floor(Math.random() * 20) + 1;
  const b = Math.floor(Math.random() * 20) + 1;
  const answer = a + b;

  $("gameArea").innerHTML = `
    <h2>➗ Math Puzzle</h2>
    <h1>${a} + ${b} = ?</h1>
    <input type="number" id="mathAnswer" placeholder="Хариу">
    <button class="primary" onclick="checkMath(${answer})">Шалгах</button>
    <p id="mathResult"></p>
    <button onclick="mathGame()">Шинэ бодлого</button>
  `;
}

function checkMath(answer) {
  $("mathResult").textContent =
    Number($("mathAnswer").value) === answer
      ? "Маш сайн! 🎉"
      : "Дахиад бодоод үзээрэй.";
}

// GAME: RIDDLES
function riddleGame() {
  const questions = [
    ["Өдөр бүр ирдэг ч хэзээ ч хүрч ирдэггүй зүйл юу вэ?", "Маргааш"],
    ["Нүдтэй ч харж чаддаггүй зүйл юу вэ?", "Зүү"],
    ["Хэдий их авах тусам улам томордог зүйл юу вэ?", "Нүх"]
  ];

  const q = questions[Math.floor(Math.random() * questions.length)];

  $("gameArea").innerHTML = `
    <h2>🧩 Brain Teasers</h2>
    <p>${q[0]}</p>
    <input id="riddleAnswer" placeholder="Хариугаа бич">
    <button class="primary" onclick="checkRiddle('${q[1]}')">Шалгах</button>
    <p id="riddleResult"></p>
    <button onclick="riddleGame()">Өөр таавар</button>
  `;
}

function checkRiddle(answer) {
  const result = $("riddleAnswer").value.trim().toLowerCase();
  $("riddleResult").textContent =
    result === answer.toLowerCase()
      ? "Зөв! 🎉"
      : "Дахиад бодоод үзээрэй.";
}

// GAME: SCIENCE / GEOGRAPHY / CODING
const quizzes = {
  science: [
    ["Усны химийн томьёо юу вэ?", ["CO2", "H2O", "O2"], 1],
    ["Нар ямар төрлийн од вэ?", ["Шар од", "Цагаан од", "Улаан од"], 0],
    ["Ургамал фотосинтез хийхэд юу ашигладаг вэ?", ["Нарны гэрэл", "Дуу", "Соронз"], 0]
  ],
  geography: [
    ["Монгол Улсын нийслэл аль вэ?", ["Дархан", "Улаанбаатар", "Эрдэнэт"], 1],
    ["Хамгийн том далай аль вэ?", ["Атлантын", "Энэтхэгийн", "Номхон"], 2],
    ["Япон аль тивд оршдог вэ?", ["Ази", "Европ", "Африк"], 0]
  ],
  code: [
    ["HTML юунд ашиглагддаг вэ?", ["Веб хуудасны бүтэц", "Хөгжим", "Зураг засах"], 0],
    ["JavaScript-ийн үндсэн өгөгдлийн төрөл аль вэ?", ["Boolean", "Window", "Screen"], 0],
    ["CSS юунд ашиглагддаг вэ?", ["Дизайн", "Өгөгдлийн сан", "Сервер"], 0]
  ]
};

function quizGame(type) {
  const list = quizzes[type];
  let index = Math.floor(Math.random() * list.length);
  const q = list[index];

  $("gameArea").innerHTML = `
    <h2>${type === "science" ? "🔬 Science Quiz" : type === "code" ? "💻 Coding Challenge" : "🌍 World Explorer"}</h2>
    <h3>${q[0]}</h3>
    <div id="quizOptions"></div>
    <p id="quizResult"></p>
    <button onclick="quizGame('${type}')">Дараагийн асуулт</button>
  `;

  $("quizOptions").innerHTML = q[1].map((option, i) => `
    <button class="primary" onclick="answerQuiz(${i},${q[2]})">${option}</button>
  `).join("");
}

function answerQuiz(selected, correct) {
  $("quizResult").textContent =
    selected === correct ? "Зөв хариуллаа! 🎉" : "Буруу байна. Дахин оролдоорой!";
}

function openGame(id) {
  const game = {
    ttt: ticTacToe,
    memory: memoryGame,
    words: wordGame,
    math: mathGame,
    riddle: riddleGame,
    science: () => quizGame("science"),
    geography: () => quizGame("geography"),
    code: () => quizGame("code")
  };

  if (game[id]) {
    game[id]();
    $("gameArea").scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

// INITIALIZE
renderNews();
renderPosts();
renderGames();
