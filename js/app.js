const searchInput = document.getElementById("search-input");
const suggestionsDiv = document.getElementById("suggestions");
const pointsDiv = document.getElementById("points");
const missionDiv = document.getElementById("mission");
const historyDiv = document.getElementById("history");
const progressBarFill = document.querySelector(".progress-bar-fill");
const currentLevelSpan = document.getElementById("current-level"); // Para atualizar o nível na interface

let totalPoints = 0;
let currentLevel = 1;
let pointsToNextLevel = 100; // Pontos necessários para o próximo nível
let history = [];
let currentMission = "";
let usedMissions = new Set(); // Para armazenar missões já utilizadas

// Função para gerar nova missão, garantindo que não se repita
function generateMission() {
    if (usedMissions.size === missions.length) {
        usedMissions.clear(); // Se todas as missões forem usadas, reinicia o conjunto
    }

    let randomMission;
    do {
        randomMission = missions[Math.floor(Math.random() * missions.length)];
    } while (usedMissions.has(randomMission.answer)); // Garante que a missão não se repita

    usedMissions.add(randomMission.answer); // Marca a missão como usada
    currentMission = randomMission.answer.toLowerCase(); // Armazena a resposta correta
    missionDiv.textContent = randomMission.question;
}

// Função para verificar se a resposta da missão está correta
function checkMissionAnswer(input) {
    if (input.toLowerCase() === currentMission) {
        showSuccessAnimation(); // Animação de sucesso
        playSuccessSound(); // Som de sucesso
        updatePoints(20); // Ganha 20 pontos ao acertar a missão
        if (totalPoints >= currentLevel * pointsToNextLevel) {
            levelUp(); // Subir de nível
        } else {
            generateMission(); // Gera nova missão ao completar uma
        }
    }
}

// Função para adicionar animação ao acertar a missão
function showSuccessAnimation() {
    const animationElement = document.createElement('div');
    animationElement.classList.add('success-animation');
    animationElement.textContent = "Missão Completa!";
    document.body.appendChild(animationElement);

    setTimeout(() => {
        animationElement.remove();
    }, 2000); // Remove a animação após 2 segundos
}

// Função para tocar um som ao acertar a missão
function playSuccessSound() {
    const audio = new Audio('/sounds/sucesso.mp3'); // Certifique-se de ter um arquivo de som
    audio.play();
}

// Função para subir de nível
function levelUp() {
    currentLevel++;
    totalPoints = 0; // Reseta os pontos ao subir de nível
    pointsDiv.textContent = totalPoints;
    currentLevelSpan.textContent = currentLevel; // Atualiza o nível na interface
    progressBarFill.style.width = "0%"; // Reseta a barra de progresso
    alert(`Parabéns! Você subiu para o nível ${currentLevel}.`);
    generateMission(); // Gera uma nova missão
}

// Função para adicionar entradas ao histórico de pesquisa
function updateHistory(termo) {
    if (!history.includes(termo)) {
        history.push(termo);
        const historyElement = document.createElement("p");
        historyElement.textContent = termo;
        historyDiv.appendChild(historyElement);
    }
}

// Função para atualizar pontos e progresso
function updatePoints(points) {
    totalPoints += points;
    pointsDiv.textContent = totalPoints;
    updateProgress();
}

// Função para atualizar o progresso
function updateProgress() {
    if (totalPoints >= currentLevel * pointsToNextLevel) {
        levelUp(); // Caso os pontos atinjam o necessário para o próximo nível
    } else {
        // Atualizando barra de progresso
        const progressPercentage = (totalPoints / (currentLevel * pointsToNextLevel)) * 100;
        progressBarFill.style.width = `${progressPercentage}%`;
    }
}

// Função para exibir as dicas com base no que foi digitado
searchInput.addEventListener("input", function() {
    const termo = searchInput.value.toLowerCase();
    suggestionsDiv.innerHTML = "";

    if (termo in dicas) {
        dicas[termo].forEach(dica => {
            const dicaElement = document.createElement("p");
            dicaElement.textContent = dica;
            suggestionsDiv.appendChild(dicaElement);
        });
        updateHistory(termo);
    } else {
        suggestionsDiv.textContent = "Nenhuma dica encontrada para este termo.";
    }

    // Verificar se o que foi digitado é a resposta correta da missão
    checkMissionAnswer(termo);
});

// Gera a primeira missão quando a página carrega
generateMission();
