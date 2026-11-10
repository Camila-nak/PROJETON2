// "correct" é a posição da resposta certa (começa em 0).
const QUESTIONS = [
    {
        q: "pergunta",
        options: ["<opcao>", "<opcao>", "<opcao>", "<opcao>"],
        correct: 1,
        why: "explicação bomba"
    },
    {
        q: "pergunta",
        options: ["<opcao>", "<opcao>", "<opcao>", "<opcao>"],
        correct: 1,
        why: "explicação bomba"
    },
    {
        q: "pergunta",
        options: ["<opcao1>", "<opcao2>", "<opcao3>", "<opcao4>"],
        correct: 1,
        why: "explicação bomba"
    }
];

// Atalho para pegar um elemento da página pelo id
const $ = id => document.getElementById(id);

let index = 0;        // pergunta atual
let score = 0;        // acertos
let answered = false; // já respondeu esta pergunta?

// Mostra a pergunta atual e cria os botões das alternativas
function show()
{
    const item = QUESTIONS[index];
    answered = false;

    $("count").textContent = "Pergunta " + (index + 1) + " de " + QUESTIONS.length;
    $("question").textContent = item.q;
    $("feedback").textContent = "";
    $("next").hidden = true;

    const box = $("options");
    box.innerHTML = "";

    item.options.forEach((text, i) => {
        const b = document.createElement("button");
        b.textContent = text; // textContent mostra "<h1>" como texto, sem interpretar como HTML
        b.addEventListener("click", () => choose(i));
        box.appendChild(b);
        box.appendChild(document.createElement("br"));
  });
}

// Confere a resposta escolhida
function choose(i) {
    if (answered) return; // impede responder duas vezes
    answered = true;

    const item = QUESTIONS[index];

    if (i === item.correct) {
        score++;
        $("feedback").textContent = "Certo. " + item.why;
    } else {
        $("feedback").textContent = "Errado. " + item.why;
    }

    $("next").textContent = index === QUESTIONS.length - 1 ? "Ver resultado" : "Próxima pergunta";
    $("next").hidden = false;
}

// Mostra a tela final
function finish() {
    $("quiz").hidden = true;
    $("result").hidden = false;
    $("score").textContent = score + " de " + QUESTIONS.length;
    $("message").textContent = score === QUESTIONS.length ? "Gabaritou!" : "Tente de novo para melhorar.";
}

// Botão "Próxima pergunta"
$("next").addEventListener("click", () => {
    index++;
    if (index < QUESTIONS.length) {
        show();
    } else {
        finish();
    }
});

// Botão "Jogar de novo"
$("restart").addEventListener("click", () => {
    index = 0;
    score = 0;
    $("result").hidden = true;
    $("quiz").hidden = false;
    show();
});

// Começa o quiz
show();