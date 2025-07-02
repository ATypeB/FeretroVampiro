import { validate } from "bycontract";
import { Sala, Engine, Ferramenta, Objeto } from "./Basicas.js";

import {
    Estaca,
    TeclaDePiano,
    Lanterna,
    ChaveDoCaixao
} from "./FerramentasDemo.js";

import {
    Piano,
    CaixaodeMadeira,
    LivroAntigo,
    Bilhete,
    Quadro,
    CaixaDeJoias
} from "./ObjetosDemo.js";


// Portão de Madeira, início do jogo e sala que contém a Lanterna
// Esta sala não pode ser usada com ferramentas, apenas a Lanterna é adicionada
export class Portao extends Sala {
    constructor(engine) {
        validate(engine, Engine);
        super("Portao_de_madeira", engine);
        const lanterna = new Lanterna();
        this.ferramentas.set(lanterna.nome, lanterna);
    }

    usa(ferramenta, objeto) {
        return false;
    }
}

// Sala de Quadros, sala que contém o Quadro e o Bilhete
// Esta sala pode ser usada com lanterna em Quadro e Bilhete
export class SalaDeQuadros extends Sala {
    constructor(engine) {
        validate(engine, Engine);
        super("Sala_de_Quadros", engine);
        this.objetos.set("quadro", new Quadro());
        this.objetos.set("bilhete", new Bilhete());
    }

    usa(ferramenta, objeto) {
        if (!this.engine.mochila.tem(ferramenta) || !this.objetos.has(objeto)) return false;
        return this.objetos.get(objeto).usar(this.engine.mochila.pega(ferramenta));
    }
}

// Sala do Piano, sala que contém o Piano
// Esta sala pode ser usada com a lanterna em Piano
// A Tecla de Piano pode ser usada em Piano e entrega a Estaca
export class SalaDoPiano extends Sala {
    constructor(engine) {
        validate(engine, Engine);
        super("Sala_do_Piano", engine);
        this.objetos.set("piano", new Piano(engine));
        const chave = new ChaveDoCaixao();
        this.ferramentas.set(chave.nome, chave);
    }

    usa(ferramenta, objeto) {
        if (!this.engine.mochila.tem(ferramenta) || !this.objetos.has(objeto)) return false;
        return this.objetos.get(objeto).usar(this.engine.mochila.pega(ferramenta));
    }
}

// Cozinha, sala que contém a Caixa de Joias e a Tecla de Piano
// Esta sala pode ser usada com a lanterna em Caixa de Joias
export class Cozinha extends Sala {
    constructor(engine) {
        validate(engine, Engine);
        super("Cozinha", engine);
        const tecla = new TeclaDePiano();
        this.ferramentas.set(tecla.nome, tecla);
        this.objetos.set("caixa_de_joias", new CaixaDeJoias());
    }

    usa(ferramenta, objeto) {
        if (!this.engine.mochila.tem(ferramenta) || !this.objetos.has(objeto)) return false;
        return this.objetos.get(objeto).usar(this.engine.mochila.pega(ferramenta));
    }
}

// Biblioteca, sala que contém o Livro Antigo
// Esta sala pode ser usada com a lanterna em Livro Antigo
export class Biblioteca extends Sala {
    constructor(engine) {
        validate(engine, Engine);
        super("Biblioteca", engine);
        this.objetos.set("livro", new LivroAntigo());
    }

    usa(ferramenta, objeto) {
        if (!this.engine.mochila.tem(ferramenta) || !this.objetos.has(objeto)) return false;
        return this.objetos.get(objeto).usar(this.engine.mochila.pega(ferramenta));
    }
}

// Quarto do Lorde, sala que contém o Caixão de Madeira
// Esta sala pode ser usada com a lanterna em Caixão de Madeira
// Esta sala pode ser usada com a Chave do Caixão para abrir o caixão
// Se a Estaca estiver na mochila, o jogo termina com vitória
export class QuartoDoLorde extends Sala {
    constructor(engine) {
        validate(engine, Engine);
        super("Quarto_do_Lorde", engine);
        this.objetos.set("caixao", new CaixaodeMadeira(engine));
    }

    usa(ferramenta, objeto) {
        if (!this.engine.mochila.tem(ferramenta) || !this.objetos.has(objeto)) return false;
        return this.objetos.get(objeto).usar(this.engine.mochila.pega(ferramenta));
    }
}
