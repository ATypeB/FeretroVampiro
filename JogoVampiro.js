import { Engine } from "./Basicas.js";
import {
    Portao,
    SalaDeQuadros,
    SalaDoPiano,
    Cozinha,
    Biblioteca,
    QuartoDoLorde
} from "./SalasDemo.js";

// Class principal do jogo, herda de Engine
export class JogoVampiro extends Engine {
    constructor() {
        super();
        console.log("Bem-vindo ao jogo: O Féretro da Terra Nativa!");
        console.log("-------------------------------------------");
        console.log("Você, como caçador de monstros, foi encubido da missão de dar um fim ao lorde vampiro que repousa em seu féretro,");
        console.log("em um castelo distante da civilização, restando apenas vagar por entre seus corredores buscando a única fraqueza de seu inimigo:")
        console.log("A estaca de madeira!");
        console.log("-------------------------------------------");
        console.log("Use a lanterna para iluminar os objetos e encontrar a estaca.");
        console.log("-------------------------------------------");
        console.log("Se precisar de ajuda, digite 'ajuda'.");
        console.log("Boa sorte!");
    }

    //Método para criar o cenário do jogo
    criaCenario() {
        // Criar salas
        const portao = new Portao(this);
        const quadros = new SalaDeQuadros(this);
        const piano = new SalaDoPiano(this);
        const cozinha = new Cozinha(this);
        const biblioteca = new Biblioteca(this);
        const quarto = new QuartoDoLorde(this);

        // Conectar salas e montar mapa do jogo
        portao.portas.set(quadros.nome, quadros);
        quadros.portas.set(portao.nome, portao);

        quadros.portas.set(piano.nome, piano);
        piano.portas.set(quadros.nome, quadros);

        piano.portas.set(cozinha.nome, cozinha);
        cozinha.portas.set(piano.nome, piano);

        quadros.portas.set(biblioteca.nome, biblioteca);
        biblioteca.portas.set(quadros.nome, quadros);

        biblioteca.portas.set(quarto.nome, quarto);
        quarto.portas.set(biblioteca.nome, biblioteca);

        // Sala inicial
        this.salaCorrente = portao;
    }
}
