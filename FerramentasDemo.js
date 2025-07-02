import { Ferramenta } from "./Basicas.js";

// Ferramenta que vence o jogo, Estaca
export class Estaca extends Ferramenta {
	constructor() {
		super("estaca");
	}
}

// Ferramenta que abre o caixão, chave do caixão
export class ChaveDoCaixao extends Ferramenta {
	constructor() {
		super("chave_do_caixao");
	}
}

// Ferramenta usada no piano, tecla de piano
export class TeclaDePiano extends Ferramenta {
	constructor() {
		super("tecla_de_piano");
	}
}

// Ferramenta usada uma vez em cada objeto, lanterna
export class Lanterna extends Ferramenta {
	#objetosUsados;

	constructor() {
		super("lanterna");
		this.#objetosUsados = new Set(); // registra quais objetos já foram iluminados
	}

	// Método que usa a lanterna em um objeto. Dispara um aviso se já foi usada nesse objeto. Se não, registra o uso.
	usarNoObjeto(objetoNome) {
		if (this.#objetosUsados.has(objetoNome)) {
			console.log("A lanterna já foi usada nesse objeto.");
			return false;
		}
		this.#objetosUsados.add(objetoNome);
		return true;
	}
}
