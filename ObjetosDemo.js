import { validate } from "bycontract";
import { Objeto, Ferramenta } from "./Basicas.js";
import { TeclaDePiano, ChaveDoCaixao, Lanterna } from "./FerramentasDemo.js";
import { Estaca } from "./FerramentasDemo.js";


// PIANO — onde está a ESTACA
// O piano pode ser usado com a Tecla de Piano para entregar a Estaca
// A Lanterna pode ser usada no Piano para indicar que falta uma tecla
export class Piano extends Objeto {
	constructor(engine) {
		super("piano", "O piano está velho e incompleto.", "Uma tecla foi inserida. Algo caiu do interior.");
		this.engine = engine;
		this.entregou = false;
	}

	usar(ferramenta) {
		validate(ferramenta, Ferramenta);
		if (ferramenta instanceof TeclaDePiano && !this.acaoOk) {
			this.acaoOk = true;
			if (!this.entregou) {
				const estaca = new Estaca();
				this.engine.salaCorrente.ferramentas.set(estaca.nome, estaca);
				this.entregou = true;
			}
			return true;
		}
		if (ferramenta instanceof Lanterna) {
			if (ferramenta.usarNoObjeto(this.nome)) {
				console.log("Falta uma tecla para soar a melodia final.");
				return true;
			}
			return false;
		}
		return false;
	}
}


// CAIXÃO — fim do jogo - pode usar lanterna ou chave do caixão
// Se a chave do caixão for usada, o caixão é aberto
// Se a estaca estiver na mochila, o vampiro é derrotado
export class CaixaodeMadeira extends Objeto {
	constructor(engine) {
		super("caixao", "O caixão está fechado. O mal repousa ali.", "O caixão foi aberto. Algo se move lá dentro...");
		this.engine = engine;
		this.aberto = false;
	}

	usar(ferramenta) {
		validate(ferramenta, Ferramenta);
		if (ferramenta instanceof Lanterna) {
			if (ferramenta.usarNoObjeto(this.nome)) {
				console.log("Está selado... mas algo afiado acabará com a maldição.");
				return true;
			}
			return false;
		}

		if (ferramenta.nome === "chave_do_caixao" && !this.aberto) {
			this.acaoOk = true;
			this.aberto = true;
			if (this.engine.mochila.tem("estaca")) {
				console.log("Você crava a estaca no coração do vampiro!");
				this.engine.indicaFimDeJogo();
			} else {
				console.log("O vampiro acorda... você não tem a estaca.");
				this.engine.indicaFimDeJogo();
			}
			return true;
		}
		return false;
	}
}

// Livro antigo — usado com a lanterna
export class LivroAntigo extends Objeto {
	constructor() {
		super("livro", "Um livro antigo com capa gasta.", "As páginas foram viradas.");
	}

	usar(ferramenta) {
		validate(ferramenta, Ferramenta);
		if (ferramenta instanceof Lanterna) {
			if (ferramenta.usarNoObjeto(this.nome)) {
				console.log("Na sombra do saber, dorme a verdade.");
				return true;
			}
		}
		return false;
	}
}

// Bilhete — usado com a lanterna
export class Bilhete extends Objeto {
	constructor() {
		super("bilhete", "Um bilhete amarelado repousa aqui.", "Você já leu o bilhete.");
	}

	usar(ferramenta) {
		validate(ferramenta, Ferramenta);
		if (ferramenta instanceof Lanterna) {
			if (ferramenta.usarNoObjeto(this.nome)) {
				console.log("O retrato dele não reflete.");
				return true;
			}
		}
		return false;
	}
}

// Quadro — usado com a lanterna
export class Quadro extends Objeto {
	constructor() {
		super("quadro", "Um quadro sombrio com olhos fundos.", "Você encara o quadro vazio.");
	}

	usar(ferramenta) {
		validate(ferramenta, Ferramenta);
		if (ferramenta instanceof Lanterna) {
			if (ferramenta.usarNoObjeto(this.nome)) {
				console.log("Olhos que seguem você… ou vigiam a entrada?");
				return true;
			}
		}
		return false;
	}
}

// Caixa de joias — usado com a lanterna
export class CaixaDeJoias extends Objeto {
	constructor() {
		super("caixa_de_joias", "Uma caixa de joias empoeirada.", "Nada aqui além de brilhos inúteis.");
	}

	usar(ferramenta) {
		validate(ferramenta, Ferramenta);
		if (ferramenta instanceof Lanterna) {
			if (ferramenta.usarNoObjeto(this.nome)) {
				console.log("Brilho não salva. Madeira, talvez.");
				return true;
			}
		}
		return false;
	}

}
