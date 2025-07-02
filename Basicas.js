import { validate } from "bycontract";
import promptsync from 'prompt-sync';
const prompt = promptsync({ sigint: true });

// Class Ferramenta representa uma ferramenta que pode ser usada em objetos
export class Ferramenta {
    #nome;
    constructor(nome) {
        validate(nome, "String");
        this.#nome = nome;
    }
    get nome() {
        return this.#nome;
    }
    usar() {
       return true;
   }
}

// Class Mochila representa uma mochila que guarda ferramentas
export class Mochila {
    #ferramentas;
    #capacidade;
    constructor(capacidade = 3) {
        this.#ferramentas = [];
        this.#capacidade = capacidade;
    }

//guarda uma ferramenta na mochila
    guarda(ferramenta) {
        validate(ferramenta, Ferramenta);
        if (this.#ferramentas.length >= this.#capacidade) {
            console.log("Mochila cheia! Não é possível guardar mais ferramentas.");
            return false;
        }
        this.#ferramentas.push(ferramenta);
        return true;
    }
// encontra e retorna uma ferramenta pelo nome, sem removê-la da mochila
    pega(nomeFerramenta) {
        validate(arguments, ["String"]);
        return this.#ferramentas.find(f => f.nome === nomeFerramenta);
    }
// verifica se a ferramenta está na mochila
    tem(nomeFerramenta) {
        validate(arguments, ["String"]);
        return this.#ferramentas.some(f => f.nome === nomeFerramenta);
    }
// retorna uma string com o nome de todas as ferramentas na mochila
    inventario() {
        return this.#ferramentas.map(obj => obj.nome).join(", ");
    }
// descarta algo da mochila
    descarta(nomeFerramenta, salaCorrente) {
        validate(arguments, ["String", Sala]);
        const index = this.#ferramentas.findIndex(f => f.nome === nomeFerramenta);
        if (index === -1) {
            console.log("Ferramenta não encontrada na mochila.");
            return false;
        }
        const [ferramenta] = this.#ferramentas.splice(index, 1);
        salaCorrente.ferramentas.set(ferramenta.nome, ferramenta);
        console.log(`Ferramenta ${ferramenta.nome} descartada na sala ${salaCorrente.nome}.`);
        return true;
    }
}

//Class Objeto representa um objeto que pode ser usado com ferramentas
export class Objeto {
    #nome;
    #descricaoAntesAcao;
    #descricaoDepoisAcao;
    #acaoOk;

    constructor(nome, descricaoAntesAcao, descricaoDepoisAcao) {
        validate(arguments, ["String", "String", "String"]);
        this.#nome = nome;
        this.#descricaoAntesAcao = descricaoAntesAcao;
        this.#descricaoDepoisAcao = descricaoDepoisAcao;
        this.#acaoOk = false;
    }

    get nome() {
        return this.#nome;
    }

    get acaoOk() {
        return this.#acaoOk;
    }

    set acaoOk(valor) {
        validate(valor, "Boolean");
        this.#acaoOk = valor;
    }

    get descricao() {
        return this.acaoOk ? this.#descricaoDepoisAcao : this.#descricaoAntesAcao;
    }

    usar(ferramenta, objeto) {
        return false;
    }
}


// Class Engine representa o motor do jogo, que controla a lógica do jogo e a interação com o usuário
export class Engine {
    #mochila;
    #salaCorrente;
    #fim;

    constructor() {
        this.#mochila = new Mochila();
        this.#salaCorrente = null;
        this.#fim = false;
        this.criaCenario();
    }

    get mochila() {
        return this.#mochila;
    }

    get salaCorrente() {
        return this.#salaCorrente;
    }

    set salaCorrente(sala) {
        validate(sala, Sala);
        this.#salaCorrente = sala;
    }

    // Método que indica o fim do jogo
    indicaFimDeJogo() {
        this.#fim = true;
    }

    criaCenario() {}

    // Método que inicia o loop de interação com o usuário
    joga() {
        let novaSala = null;
        let acao = "";
        let tokens = null;

        while (!this.#fim) {
            console.log("-------------------------");
            console.log(this.salaCorrente.textoDescricao());
            acao = prompt("O que você deseja fazer? ");
            tokens = acao.split(" ");
             if (!tokens[0]) {
                 console.log("Comando inválido. Nenhum comando foi digitado.");
                 continue;
            }
            switch (tokens[0]) {
                case "fim":
                    this.#fim = true;
                    break;
                case "descartar":
                      if (!tokens[1]) {
                   console.log("Comando inválido. Use: descartar <ferramenta>");
                    break;
                   }
                   if (!this.#mochila.tem(tokens[1])) {
                  console.log("Ferramenta " + tokens[1] + " não está na mochila.");
                    break;
                    }
                     this.#mochila.descarta(tokens[1], this.#salaCorrente);
                    break;   
                case "ajuda":
                    console.log("Comandos disponíveis:");
                    console.log("---------------------");
                    console.log("- pegar <ferramenta> - Pega uma ferramenta da sala atual");
                    console.log("- usar <ferramenta> <objeto> - Usa uma ferramenta em um objeto na sala atual");
                    console.log("- entrar <sala> - Entra em outra sala do jogo");
                    console.log("- descartar <ferramenta> - Remove uma ferramenta da mochila e a deixa na sala atual");
                    console.log("- inventario - Mostra as ferramentas na mochila");
                    console.log("- ajuda - Mostra esta mensagem de ajuda");
                    console.log("- fim - Encerra o jogo");
                    break;
                case "pegar":
                    if (!tokens[1]) {
                        console.log("Comando inválido. Use: pegar <ferramenta>");
                        break;
                    }
                    if (this.salaCorrente.pega(tokens[1])) {
                        console.log("Ok! " + tokens[1] + " guardado!");
                    } else {
                        if (this.salaCorrente.objetos.has(tokens[1])) {
                        console.log("Não é possível pegar " + tokens[1] + " pois é um objeto. Tente usar uma ferramenta em " + tokens[1] + ".");
                            }   else {    
                                console.log("Ferramenta " + tokens[1] + " não encontrada.");}
                    }
                    break;
                case "inventario":
                    if (this.#mochila.inventario() === "") {
                        console.log("Sua mochila está vazia.");
                    }
                    else {
                    console.log("Ferramentas disponíveis: " + this.#mochila.inventario());
                    }
                    break;
                case "usar":
                    if (!tokens[1] || !tokens[2]) {
                        console.log("Comando inválido. Use: usar <ferramenta> <objeto>");
                        break;
                    }
                    if (!this.#mochila.tem(tokens[1])) {
                        console.log("Ferramenta " + tokens[1] + " não encontrada na mochila.");
                        break;
                    }
                    if (this.salaCorrente.usa(tokens[1], tokens[2])) {
                        console.log("Item utilizado com sucesso!");
                        if (this.#fim == true && this.mochila.tem("estaca")) {
                            console.log("Parabéns, você venceu o mal!");
                        } else if (this.#fim == true && !this.mochila.tem("estaca")) {
                            console.log("Foi sua última noite. Fim de jogo.");
                        }
                            
                    } else {
                        console.log("Não é possível usar " + tokens[1] + " sobre " + tokens[2] + " nesta sala.");
                    }
                    break;
                case "entrar":
                    if (tokens.length < 2) {
                        console.log("Comando inválido. Use: entrar <sala>");
                        break;
                    }
                    novaSala = this.salaCorrente.sai(tokens[1]);
                    if (novaSala == null) {
                        console.log("Sala desconhecida ...");
                    } else {
                        this.#salaCorrente = novaSala;
                    }
                    break;
                default:
                    console.log("Comando desconhecido: " + tokens[0]);
                    break;
            }
        }
        console.log("Jogo encerrado!");
    }
}

//Class Sala representa uma sala do jogo, que contém objetos, ferramentas e acessos a outras salas
export class Sala {
    #nome;
    #objetos;
    #ferramentas;
    #portas;
    #engine;

    constructor(nome, engine) {
        validate(arguments, ["String", Engine]);
        this.#nome = nome;
        this.#objetos = new Map();
        this.#ferramentas = new Map();
        this.#portas = new Map();
        this.#engine = engine;
    }

    get nome() {
        return this.#nome;
    }

    get objetos() {
        return this.#objetos;
    }

    get ferramentas() {
        return this.#ferramentas;
    }

    get portas() {
        return this.#portas;
    }

    get engine() {
        return this.#engine;
    }

    // Método que retorna uma lista de objetos disponíveis na sala, formatada como "nome: descrição"
    objetosDisponiveis() {
        return [...this.#objetos.values()].map(obj => obj.nome + ": " + obj.descricao);
    }
    // Método que retorna uma lista de ferramentas disponíveis na sala, formatada como "nome"
    ferramentasDisponiveis() {
        return [...this.#ferramentas.values()].map(f => f.nome);
    }
    // Método que retorna uma lista de portas disponíveis na sala, formatada como "nome"
    portasDisponiveis() {
        return [...this.#portas.values()].map(sala => sala.nome);
    }

    // Método que remove uma ferramenta da sala e a adiciona à mochila
    pega(nomeFerramenta) {
        validate(nomeFerramenta, "String");
        let ferramenta = this.#ferramentas.get(nomeFerramenta);
        if (ferramenta != null) {
            this.#engine.mochila.guarda(ferramenta);
            this.#ferramentas.delete(nomeFerramenta);
            return true;
        } else {
            return false;
        }
    }

    // Método que muda a sala corrente para outra sala, se a porta estiver conectada
    sai(porta) {
        validate(porta, "String");
        return this.#portas.get(porta);
    }

    // Método que retorna uma descrição textual da sala, incluindo objetos, ferramentas e portas
    textoDescricao() {
        let descricao = `Você está em ${this.nome}\n`;
        descricao += this.objetos.size === 0 ? "Não há objetos na sala\n" : "OBJETOS: \n" + this.objetosDisponiveis().join("\n") + "\n" + "\n";
        descricao += this.ferramentas.size === 0 ? "Não há ferramentas na sala\n" : "FERRAMENTAS: \n" + this.ferramentasDisponiveis().join("\n")+ "\n" + "\n";
        descricao += "PORTAS: " + this.portasDisponiveis().join(", ") + "\n";
        return descricao;
    }

    usa(ferramenta, objeto) {
        return false;
    }
}
