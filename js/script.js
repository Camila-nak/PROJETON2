// "correct" é a posição da resposta certa (começa em 0).
const QUESTIONS = [
    // ---------- PARTE 1: LEIS BRASILEIRAS ----------
    {
        q: "Qual é o nome da lei, também chamada de “Estatuto da Pessoa com Deficiência”, que garante direitos iguais e inclusão para PCDs no Brasil?",
        options: [
            "Lei Maria da Penha",
            "Estatuto do Idoso",
            "Lei Brasileira de Inclusão (Lei nº 13.146/2015)",
            "Código de Defesa do Consumidor"
        ],
        correct: 2,
        why: "A Lei Brasileira de Inclusão reúne os direitos das pessoas com deficiência em áreas como saúde, educação, trabalho, transporte e lazer. Seu objetivo é garantir que elas tenham as mesmas oportunidades que qualquer outra pessoa."
    },
    {
        q: "Segundo a lei, o que as empresas com 100 ou mais funcionários devem fazer em relação às pessoas com deficiência?",
        options: [
            "Reservar de 2% a 5% das vagas para PCDs",
            "Contratar PCDs apenas se quiserem",
            "Reservar metade das vagas para PCDs",
            "Nada, a lei não obriga contratação"
        ],
        correct: 0,
        why: "É a chamada “Lei de Cotas” (Lei nº 8.213/91). Quanto maior a empresa, maior a porcentagem de vagas reservadas, que vai de 2% a 5%. Isso ajuda a garantir que PCDs tenham acesso ao mercado de trabalho."
    },
    {
        q: "Ao chegar a um banco, uma pessoa com deficiência tem direito a:",
        options: [
            "Esperar na fila comum como todo mundo",
            "Ser atendida só com a presença de um acompanhante",
            "Ser atendida somente em dias específicos da semana",
            "Atendimento prioritário"
        ],
        correct: 3,
        why: "A Lei nº 10.048/2000 garante atendimento prioritário a pessoas com deficiência em bancos, repartições públicas, empresas e outros serviços. Isso evita longas esperas que podem ser difíceis para essas pessoas."
    },
    {
        q: "Recusar a matrícula de um aluno em uma escola por causa da sua deficiência é:",
        options: [
            "Um direito da escola, caso ela não queira receber o aluno",
            "Crime, previsto em lei",
            "Permitido se os pais concordarem",
            "Permitido em escolas particulares"
        ],
        correct: 1,
        why: "A lei proíbe qualquer escola, pública ou particular, de negar matrícula por causa de deficiência. Quem faz isso comete crime e pode ser punido. Todos têm direito à educação, e a escola é quem deve se adaptar ao aluno."
    },
    {
        q: "O que é o BPC (Benefício de Prestação Continuada)?",
        options: [
            "Uma aposentadoria que só vale para quem contribuiu por 35 anos ao INSS",
            "Um bônus pago pelas empresas aos funcionários com deficiência",
            "Um benefício de um salário mínimo mensal para pessoas com deficiência de baixa renda, mesmo sem contribuição ao INSS",
            "Um desconto no imposto de renda"
        ],
        correct: 2,
        why: "O BPC é pago pelo governo a pessoas com deficiência cuja família tem baixa renda e que não conseguem se sustentar sozinhas. Não é preciso ter contribuído para o INSS para receber."
    },

    // ---------- PARTE 2: ÉTICA E CONVIVÊNCIA SOCIAL ----------
    {
        q: "Qual é o termo mais adequado para se referir a alguém com deficiência?",
        options: [
            "Portador de deficiência",
            "Pessoa com deficiência",
            "Deficiente",
            "Pessoa especial"
        ],
        correct: 1,
        why: "“Pessoa com deficiência” é o termo usado na lei e recomendado pelas próprias pessoas com deficiência. A palavra “portador” é considerada ultrapassada, porque a deficiência não é algo que se carrega, e sim uma característica da pessoa. Colocar a pessoa em primeiro lugar mostra respeito."
    },
    {
        q: "Você vê uma pessoa cega esperando para atravessar a rua. Qual é a melhor atitude?",
        options: [
            "Perguntar se ela precisa de ajuda antes de agir",
            "Segurá-la pelo braço e puxá-la para atravessar",
            "Ignorar, pois ela deve saber se virar sozinha",
            "Gritar para chamar a atenção dela"
        ],
        correct: 0,
        why: "Nem toda pessoa cega precisa de ajuda o tempo todo. Perguntar primeiro respeita a autonomia dela. Se ela aceitar, ela mesma pode dizer como prefere ser ajudada."
    },
    {
        q: "Ao conversar com uma pessoa cadeirante que está acompanhada de outra pessoa, você deve:",
        options: [
            "Falar apenas com o acompanhante",
            "Falar com o acompanhante e fazer perguntas sobre ela",
            "Evitar a conversa para não constranger",
            "Falar diretamente com a pessoa cadeirante"
        ],
        correct: 3,
        why: "A pessoa com deficiência é quem deve ser ouvida e respondida. Falar apenas com o acompanhante passa a ideia de que ela não consegue se expressar, o que é desrespeitoso."
    },
    {
        q: "O que fazer antes de empurrar ou encostar na cadeira de rodas de alguém?",
        options: [
            "Nada, a cadeira é um objeto como qualquer outro",
            "Empurrar rápido para ajudar a pessoa a chegar mais depressa",
            "Pedir licença e perguntar se a pessoa quer ajuda",
            "Apoiar o braço nela enquanto conversa"
        ],
        correct: 2,
        why: "A cadeira de rodas faz parte do espaço pessoal de quem a usa, como se fosse uma extensão do corpo. Tocar ou empurrar sem pedir pode assustar e invadir a privacidade da pessoa."
    },
    {
        q: "Um motorista sem credencial para PCD ou idoso estaciona “só por um minutinho” em uma vaga reservada. Isso é:",
        options: [
            "Aceitável, se for rápido",
            "Infração de trânsito e falta de respeito",
            "Permitido se o estacionamento estiver vazio",
            "Permitido se ele ligar o pisca-alerta"
        ],
        correct: 1,
        why: "As vagas reservadas existem porque quem precisa delas tem dificuldade de se locomover por distâncias maiores. Ocupá-las sem direito é infração de trânsito e prejudica quem realmente precisa, mesmo que seja por pouco tempo."
    },
    {
        q: "O que significa “capacitismo”?",
        options: [
            "Preconceito contra pessoas com deficiência, achando que são menos capazes",
            "Um tipo de deficiência física",
            "Uma técnica de reabilitação",
            "O nome de uma lei de inclusão"
        ],
        correct: 0,
        why: "Capacitismo é discriminar ou tratar alguém como incapaz só porque tem deficiência. Isso aparece em frases como “coitadinho” ou na ideia de que a pessoa não consegue estudar, trabalhar ou ter uma vida independente."
    },
    {
        q: "Uma pessoa que “parece saudável” usa uma vaga preferencial ou fila prioritária. O que devemos pensar?",
        options: [
            "Que ela está mentindo",
            "Que deve ser denunciada imediatamente",
            "Que provavelmente está tentando se aproveitar",
            "Que nem toda deficiência é visível, então não devemos julgar"
        ],
        correct: 3,
        why: "Existem deficiências e condições que não são aparentes, como a deficiência auditiva, o autismo, algumas doenças crônicas e a baixa visão. Julgar pela aparência pode constranger quem tem direito ao atendimento."
    },
    {
        q: "O lema “Nada sobre nós, sem nós” significa que:",
        options: [
            "Pessoas com deficiência devem ficar longe das decisões",
            "Só especialistas devem decidir sobre os direitos das PCDs",
            "Pessoas com deficiência devem participar das decisões que afetam a vida delas",
            "Quem não tem deficiência não pode opinar sobre o assunto"
        ],
        correct: 2,
        why: "O lema defende que leis, projetos e políticas para PCDs devem ser feitos com a participação delas. Ninguém conhece melhor suas necessidades do que elas mesmas."
    },
    {
        q: "Quem se beneficia de rampas, elevadores e calçadas niveladas?",
        options: [
            "Todas as pessoas: cadeirantes, idosos, gestantes, pais com carrinho de bebê e muitos outros",
            "Apenas cadeirantes",
            "Apenas idosos",
            "Ninguém além de quem tem deficiência"
        ],
        correct: 0,
        why: "A acessibilidade ajuda muito mais gente do que parece. Pensar espaços que funcionem para todos se chama “desenho universal”, e deixa a cidade melhor para qualquer pessoa."
    },
    {
        q: "O que é a Libras?",
        options: [
            "Um código universal de gestos usado no mundo todo",
            "A Língua Brasileira de Sinais, uma língua oficial com gramática própria",
            "Uma mímica criada para facilitar a comunicação",
            "Uma técnica usada apenas em escolas"
        ],
        correct: 1,
        why: "A Libras é reconhecida por lei (Lei nº 10.436/2002) como a língua da comunidade surda brasileira. Ela tem gramática e estrutura próprias, e não é um código universal, já que cada país tem a sua língua de sinais."
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

    // Marca os botões: a certa fica verde e, se errou, a escolhida fica vermelha
    const buttons = $("options").querySelectorAll("button");
    buttons[item.correct].classList.add("correct");
    buttons[item.correct].textContent = "✓ " + buttons[item.correct].textContent; // símbolo para quem não distingue as cores
    if (i !== item.correct) {
        buttons[i].classList.add("wrong");
        buttons[i].textContent = "✗ " + buttons[i].textContent;
    }

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