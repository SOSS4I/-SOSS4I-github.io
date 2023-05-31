// Variáveis globais
let participants = [];
let drawnNumbers = [];
let winner = null;
let drawInterval;

// Função para adicionar participante
function addParticipant() {
  const participantName = document.getElementById("participantName").value;
  if (participantName.trim() === "") {
    alert("Por favor, insira um nome para o participante.");
    return;
  }

  if (participants.length >= 6) {
    alert("O limite máximo de participantes foi atingido.");
    return;
  }

  participants.push({
    name: participantName,
    numbers: generateUniqueNumbers(),
    complete: false,
  });

  updateParticipantTables();
  document.getElementById("participantName").value = "";
}

// Função para gerar números únicos para a tabela de cada participante
function generateUniqueNumbers() {
  const numbers = [];
  while (numbers.length < 24) {
    const randomNumber = Math.floor(Math.random() * 75) + 1;
    if (!numbers.includes(randomNumber)) {
      numbers.push(randomNumber);
    }
  }
  return numbers;
}

// Função para atualizar as tabelas de participantes exibidas na tela
function updateParticipantTables() {
  const boardContainer = document.getElementById("boardContainer");
  boardContainer.innerHTML = "";

  participants.forEach((participant, index) => {
    const boardDiv = document.createElement("div");
    boardDiv.classList.add("board");

    const boardTitle = document.createElement("h3");
    boardTitle.textContent = participant.name;
    boardDiv.appendChild(boardTitle);

    const boardTable = document.createElement("table");
    participant.numbers.forEach((number, i) => {
      if (i % 6 === 0) {
        const row = document.createElement("tr");
        boardTable.appendChild(row);
      }
      const row = boardTable.lastElementChild;
      const cell = document.createElement("td");
      cell.textContent = number;
      row.appendChild(cell);
    });

    boardDiv.appendChild(boardTable);
    boardContainer.appendChild(boardDiv);
  });
}

// Função para iniciar o jogo
function startGame() {
  if (participants.length === 0) {
    alert("Por favor, adicione pelo menos um participante.");
    return;
  }

  document.getElementById("bingoBoard").removeChild(document.querySelector("#bingoBoard button"));
  document.getElementById("bingoBoard").style.marginBottom = "0";

  document.getElementById("drawnNumbers").style.display = "block";

  document.getElementById("participantName").disabled = true;
  document.getElementById("participantName").placeholder = "Jogo em andamento";

  document.getElementById("boardContainer").style.pointerEvents = "none";
  document.getElementById("boardContainer").style.opacity = "0.5";

  document.getElementById("winnerName").textContent = "";

  drawInterval = setInterval(drawNumber, 50); // Sorteia um número a cada 50 milissegundos
}

// Função para sortear um número e atualizar a lista de números sorteados
function drawNumber() {
  if (winner) {
    alert("O jogo já foi encerrado. Reinicie para jogar novamente.");
    clearInterval(drawInterval);
    return;
  }

  let randomNumber;
  do {
    randomNumber = Math.floor(Math.random() * 75) + 1;
  } while (drawnNumbers.includes(randomNumber));

  drawnNumbers.push(randomNumber);
  updateDrawnNumbersList();
  updateParticipantTables();

  checkForWinner();
}

// Função para atualizar a lista de números sorteados exibida na tela
function updateDrawnNumbersList() {
  const drawnList = document.getElementById("drawnList");
  const numberDiv = document.createElement("div");
  numberDiv.textContent = drawnNumbers[drawnNumbers.length - 1];
  drawnList.appendChild(numberDiv);

  participants.forEach((participant) => {
    if (participant.complete) return; // Ignora participantes que já completaram suas tabelas

    const boardDivs = document.querySelectorAll(".board");
    const boardIndex = participants.indexOf(participant);
    const boardTable = boardDivs[boardIndex].querySelector("table");

    participant.numbers.forEach((number, i) => {
      const cells = boardTable.getElementsByTagName("td");
      for (let i = 0; i < cells.length; i++) {
        if (cells[i].textContent == number) {
          cells[i].classList.add("marked");
        }
      }
    });

    const remainingNumbers = participant.numbers.filter((number) => !drawnNumbers.includes(number));
    if (remainingNumbers.length === 0) {
      participant.complete = true;
      boardTable.classList.add("completed");
    }
  });
}

// Função para verificar se algum participante ganhou
function checkForWinner() {
  participants.forEach((participant) => {
    if (participant.complete) {
      winner = participant;
      document.getElementById("winnerName").textContent = participant.name;
      clearInterval(drawInterval);
    }
  });

  if (!winner && drawnNumbers.length === 75) {
    alert("Todos os números foram sorteados. O jogo terminou em empate.");
    clearInterval(drawInterval);
  }
}

// Função para reiniciar o jogo
function restartGame() {
  location.reload();
}
