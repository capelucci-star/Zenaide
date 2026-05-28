// ============================================================
// Numerologia Cabalística - Engine (ABNC - Academia Brasileira de Numerologia Cabalística)
// ============================================================

// ----- Tabela ABNC (gematria hebraica adaptada ao português) -----
// Verificada com exemplos oficiais da ABNC:
// VIDAL PEREIRA DA SILVA → Mot:8, Imp:5, Exp:22
// ZENAIDE APARECIDA CAPELUCCI → Mot:7, Imp:8, Exp:6
const TABELA_ABNC = {
  A:1, B:2, C:3, D:4, E:5, F:6, G:7, H:8,
  I:1, J:1, K:2, L:3, M:4, N:5, O:7, P:8,
  Q:1, R:2, S:3, T:4, U:6, V:6, W:6, X:5,
  Y:1, Z:7
};

// Tabela alternativa ciclo 1-9 (pythagorica adaptada)
const TABELA_CICLO19 = {
  A:1,B:2,C:3,D:4,E:5,F:6,G:7,H:8,I:9,
  J:1,K:2,L:3,M:4,N:5,O:6,P:7,Q:8,R:9,
  S:1,T:2,U:3,V:4,W:5,X:6,Y:7,Z:8
};

function getTabelaObj(tabela) {
  if (tabela === 'ciclo19') return TABELA_CICLO19;
  return TABELA_ABNC; // 'abnc' é o padrão
}

// ----- Acentos -----
// Regras: agudo=+2, til=+3, circunflexo=+7, cedilha=fixo6, trema=*2, grave=*2
const ACCENT_MAP = {
  'Á': { base:'A', bonus:2 },  'É': { base:'E', bonus:2 },
  'Í': { base:'I', bonus:2 },  'Ó': { base:'O', bonus:2 },  'Ú': { base:'U', bonus:2 },
  'Ã': { base:'A', bonus:3 },  'Õ': { base:'O', bonus:3 },
  'Â': { base:'A', bonus:7 },  'Ê': { base:'E', bonus:7 },
  'Î': { base:'I', bonus:7 },  'Ô': { base:'O', bonus:7 },  'Û': { base:'U', bonus:7 },
  'Ç': { fixed:6 },
  'Ü': { base:'U', multiply:2 },
  'À': { base:'A', multiply:2 },
};

const VOGAIS = new Set('AEIOUÁÉÍÓÚÃÕÂÊÎÔÛÀaeiouáéíóúãõâêîôûà');

// ----- Arcanos -----
export const ARCANOS = {
  1:  { nome:'O Mago',              palavra_chave:'Criatividade, início, habilidade',
        positivo:'Capacidade de falar, atuar e escrever. Habilidade, diplomacia, astúcia, vontade, energia e poder. Início de novos projetos com sucesso.',
        negativo:'Manipulação, astúcia mal-dirigida, início sem conclusão, dispersão de energias.' },
  2:  { nome:'A Papisa (Sacerdotisa)', palavra_chave:'Intuição, mistério, ciência oculta',
        positivo:'Percepção espiritual e benéfica. Segredo, mistério, ciência, intuição, percepção das próprias necessidades espirituais.',
        negativo:'Superficialidade, segredos prejudiciais, ilusão, conhecimento mal utilizado.' },
  3:  { nome:'A Imperatriz',        palavra_chave:'Fertilidade, abundância, maternidade',
        positivo:'Abundância material e espiritual. Fertilidade, criação, maternidade, proteção, riqueza, beleza, harmonia e prazer.',
        negativo:'Excesso de materialismo, vaidade, dependência emocional, estagnação.' },
  4:  { nome:'O Imperador',         palavra_chave:'Autoridade, ordem, estrutura',
        positivo:'Poder, autoridade, vontade, estabilidade, liderança, realização. Capacidade de organizar e construir estruturas sólidas.',
        negativo:'Autoritarismo, rigidez, tirania, dificuldade de delegar, bloqueio emocional.' },
  5:  { nome:'O Papa (Hierofante)', palavra_chave:'Espiritualidade, ensinamento, tradição',
        positivo:'Bondade, aliança espiritual, misericórdia, inspiração divina, ensinamento, religiosidade, vocação.',
        negativo:'Dogmatismo, dependência de aprovação externa, conformismo, falsa espiritualidade.' },
  6:  { nome:'Os Amantes',          palavra_chave:'Escolha, amor, relacionamento',
        positivo:'Amor, relacionamento harmonioso, decisão correta, atração, beleza, prova superada com êxito.',
        negativo:'Indecisão, conflito entre razão e emoção, infidelidade, escolha equivocada.' },
  7:  { nome:'O Carro',             palavra_chave:'Vitória, determinação, triunfo',
        positivo:'Triunfo bem merecido. Ser humano equilibrado e bem-sucedido que soube decidir corretamente. Providência, auxílio, vitória.',
        negativo:'Arrogância após vitória, descontrole, conquista sem ética, fuga da realidade.' },
  8:  { nome:'A Justiça',           palavra_chave:'Equilíbrio, retidão, equidade',
        positivo:'Justiça, equidade, retidão, equilíbrio, plenitude. Parada para pensar e analisar a situação.',
        negativo:'Julgamento severo, inflexibilidade, lentidão, bloqueio por excesso de análise.' },
  9:  { nome:'O Eremita',           palavra_chave:'Sabedoria, introspecção, prudência',
        positivo:'Prudência, discernimento, sabedoria acumulada, introspecção produtiva, guia espiritual, iluminação interior.',
        negativo:'Isolamento excessivo, pessimismo, frieza emocional, recusa de ajuda.' },
  10: { nome:'A Roda do Destino',   palavra_chave:'Transformação, ciclos, karma',
        positivo:'Mudança de ciclo favorável, fortuna, evolução, oportunidade, karma positivo se vivido com consciência.',
        negativo:'Imprevisibilidade, instabilidade, mudança brusca indesejada, karma negativo.' },
  11: { nome:'A Força',             palavra_chave:'Coragem, domínio, virtude',
        positivo:'Força moral e espiritual, coragem, domínio das paixões, virtude, disposição anímica, magnetismo pessoal.',
        negativo:'Força mal direcionada, impulsividade, brutalidade, domínio pelo medo.' },
  12: { nome:'O Dependurado',       palavra_chave:'Sacrifício, fé, ideal espiritual',
        positivo:'Sacrifício consciente por ideal elevado, fé profunda, inversão de valores que traz crescimento, entrega espiritual.',
        negativo:'Martírio desnecessário, passividade, vitimismo, estagnação por não agir.' },
  13: { nome:'A Morte',             palavra_chave:'Transformação, fim de ciclo, renovação',
        positivo:'Transformação necessária, fim de um ciclo para início de outro melhor, renovação, desprendimento.',
        negativo:'Resistência à mudança, perdas dolorosas, encerramento abrupto, medo do novo.',
        divida_karmica: true, nota: 'Não significa morte literal. É o arcano da grande transformação.' },
  14: { nome:'A Temperança',        palavra_chave:'Equilíbrio, moderação, paciência',
        positivo:'Moderação, equilíbrio entre opostos, paciência, adaptação, harmonia, combinação de energias distintas.',
        negativo:'Excesso ou falta, imoderação, desequilíbrio emocional, falta de paciência.',
        divida_karmica: true },
  15: { nome:'O Diabo',             palavra_chave:'Magnetismo, força emocional, provação',
        positivo:'Grande magnetismo pessoal, força emocional intensa, poder de atração, determinação, liderança carismática.',
        negativo:'Vícios, apego excessivo ao material, manipulação, abuso de poder, obsessão.',
        nota: 'Em espíritos missionários, indica grande poder atuando para o bem.' },
  16: { nome:'A Torre',             palavra_chave:'Ruptura, revelação, mudança brusca',
        positivo:'Libertação de estruturas falsas, revelação da verdade, reconstrução sobre bases sólidas.',
        negativo:'Catástrofe, queda súbita, destruição de projetos, orgulho derrubado.',
        divida_karmica: true },
  17: { nome:'A Estrela',           palavra_chave:'Esperança, simplicidade, pureza',
        positivo:'Esperança, simplicidade, pureza, sensibilidade poética, renovação após tempestade, inspiração, fé serena.',
        negativo:'Ingenuidade, idealismo excessivo, vulnerabilidade, fuga da realidade.' },
  18: { nome:'A Lua',               palavra_chave:'Ilusão, instinto, subconsciente',
        positivo:'Intuição profunda, acesso ao inconsciente, sensibilidade, criatividade onírica, evolução pela superação do medo.',
        negativo:'Ilusão, engano, mentira, medos ocultos, instabilidade emocional, falta de clareza.' },
  19: { nome:'O Sol',               palavra_chave:'Sucesso, alegria, clareza',
        positivo:'Sucesso material e espiritual, alegria, clareza, vitalidade, conquista, realização, reconhecimento.',
        negativo:'Vaidade, arrogância, exposição excessiva, dependência de aprovação.',
        divida_karmica: true },
  20: { nome:'O Julgamento',        palavra_chave:'Renovação, chamado, renascimento',
        positivo:'Renovação profunda, chamado superior, despertar espiritual, renascimento, julgamento justo de si mesmo.',
        negativo:'Julgamento severo dos outros, recusa de evolução, adiamento de decisões importantes.' },
  21: { nome:'O Mundo',             palavra_chave:'Completude, realização, totalidade',
        positivo:'Completude, realização plena, sucesso em todas as áreas, síntese da jornada, integração perfeita.',
        negativo:'Estagnação após conquista, dificuldade de recomeçar, excesso de perfecionismo.' },
  22: { nome:'O Louco',             palavra_chave:'Decisão, coragem, potencial infinito',
        positivo:'Coragem de começar do zero, intuição pura, potencial ilimitado, espontaneidade, fé no caminho.',
        negativo:'Imprudência, falta de planejamento, ingenuidade perigosa, recusa de responsabilidades.',
        nota: 'Na numerologia cabalística, 22 também é Número Mestre (Grande Construtor).' },
};

// Dívidas kármicas
const DIVIDAS_KARMICAS = {
  13: 'Esforço e disciplina',
  14: 'Moderação e equilíbrio',
  16: 'Humildade',
  19: 'Uso ético do poder',
};

// Harmonia Numérica (ABNC) — compatibilidade Destino × Expressão
const HARMONIA_NUMERICA = {
  1:  { favoravel:[3,5,9],             desfavoravel:[6],             neutro:[1,2,4,7,8] },
  2:  { favoravel:[2,4,6,7],           desfavoravel:[5,9],           neutro:[1,3,8] },
  3:  { favoravel:[1,3,5,6],           desfavoravel:[4,7,8],         neutro:[2,9] },
  4:  { favoravel:[2,6,8],             desfavoravel:[3,5,7,9],       neutro:[1,4] },
  5:  { favoravel:[1,3,5,7,9],         desfavoravel:[2,6,8],         neutro:[] },
  6:  { favoravel:[2,3,4,8,9],         desfavoravel:[1,5,7],         neutro:[6] },
  7:  { favoravel:[2,5,7],             desfavoravel:[3,4,6,8,9],     neutro:[1] },
  8:  { favoravel:[4,6],               desfavoravel:[3,5,7,8,9],     neutro:[1,2] },
  9:  { favoravel:[1,5,6,9],           desfavoravel:[2,4,7,8],       neutro:[3] },
  11: { favoravel:[1,3,5,7,9,11],      desfavoravel:[2,4,6,8],       neutro:[22] },
  22: { favoravel:[1,2,3,4,5,6,7,8,9,22], desfavoravel:[],          neutro:[11] },
};

// Cores favoritas por número de expressão
const CORES_FAVORITAS = {
  1:  ['Vermelho','Amarelo','Laranja','Dourado'],
  2:  ['Creme','Verde claro','Branco','Prata'],
  3:  ['Amarelo','Rosa','Lilás','Laranja'],
  4:  ['Azul','Cinza','Marrom','Verde escuro'],
  5:  ['Prata','Cinza claro','Turquesa','Multicolor'],
  6:  ['Rosa','Azul claro','Verde','Índigo'],
  7:  ['Violeta','Roxo','Branco','Prata'],
  8:  ['Preto','Roxo escuro','Marrom','Bronze'],
  9:  ['Dourado','Vermelho','Cobre','Laranja'],
  11: ['Prata','Branco pérola','Lilás'],
  22: ['Dourado','Azul royal','Verde esmeralda'],
  33: ['Dourado','Branco','Rosa dourado'],
};

// Sequências negativas na pirâmide
const SEQUENCIAS_NEGATIVAS = {
  111: 'desafios de autoafirmação/liderança',
  222: 'dificuldades de cooperação/passividade excessiva',
  333: 'bloqueios de comunicação/criatividade',
  444: 'obstáculos financeiros/materiais',
  555: 'instabilidade/excesso de mudanças',
  666: 'conflitos familiares/responsabilidade excessiva',
  777: 'isolamento/excesso de introspecção',
  888: 'dificuldades com poder/dinheiro',
  999: 'dificuldade de fechamento de ciclos',
};

// ---- Funções utilitárias ----

export function reduzir(n, preserveMasters = true) {
  if (n <= 0) return n;
  if (preserveMasters && (n === 11 || n === 22 || n === 33)) return n;
  while (n > 9) {
    if (preserveMasters && (n === 11 || n === 22 || n === 33)) return n;
    n = String(n).split('').reduce((a, d) => a + Number(d), 0);
    if (preserveMasters && (n === 11 || n === 22 || n === 33)) return n;
  }
  return n;
}

export function reduzirAte22(n) {
  while (n > 22) {
    n = String(n).split('').reduce((a, d) => a + Number(d), 0);
  }
  return n;
}

export function valorLetra(letra, tabela = 'abnc') {
  const tbl = getTabelaObj(tabela);
  const upper = letra.toUpperCase();

  if (ACCENT_MAP[upper]) {
    const acc = ACCENT_MAP[upper];
    if (acc.fixed !== undefined) return reduzir(acc.fixed, true);
    const baseVal = tbl[acc.base] || 0;
    const raw = acc.multiply !== undefined ? baseVal * acc.multiply : baseVal + acc.bonus;
    return reduzir(raw, true);
  }
  return tbl[upper] || 0;
}

function isAlpha(c) {
  return /[A-Za-zÀ-ÖØ-öø-ÿ]/.test(c);
}

function isVogal(c) {
  return VOGAIS.has(c);
}

// Método ABNC: soma palavra por palavra (cada parte do nome é reduzida separadamente)
// Verificado com exemplos da ABNC:
// VIDAL PEREIRA DA SILVA: Exp=22 (VIDAL:15→6, PEREIRA:24→6, DA:5, SILVA:14→5 → 6+6+5+5=22)
function somarPorPalavra(nome, tabela, filtro) {
  const palavras = nome.trim().split(/\s+/);
  let total = 0;
  for (const palavra of palavras) {
    let soma = 0;
    for (const c of palavra) {
      if (isAlpha(c) && filtro(c)) soma += valorLetra(c, tabela);
    }
    if (soma > 0) total += reduzir(soma, true);
  }
  return reduzir(total, true);
}

// ---- Cálculos do Triângulo Básico ----

export function calcularMotivacao(nome, tabela = 'abnc') {
  return somarPorPalavra(nome, tabela, c => isVogal(c));
}

export function calcularImpressao(nome, tabela = 'abnc') {
  return somarPorPalavra(nome, tabela, c => !isVogal(c));
}

export function calcularExpressao(nome, tabela = 'abnc') {
  return somarPorPalavra(nome, tabela, () => true);
}

export function calcularDestino(dataStr) {
  const digits = dataStr.replace(/\D/g, '').split('').map(Number);
  return reduzir(digits.reduce((a, b) => a + b, 0), true);
}

export function calcularMissao(expressao, destino) {
  return reduzir(expressao + destino, true);
}

export function calcularDiaNatalicio(dia) {
  return reduzir(parseInt(dia, 10), true);
}

// ---- Karma ----

export function calcularLicoesKarmicas(nome, tabela = 'abnc') {
  const presentes = new Set();
  for (const c of nome) {
    if (isAlpha(c)) {
      presentes.add(reduzir(valorLetra(c, tabela), false));
    }
  }
  return Array.from({ length: 9 }, (_, i) => i + 1).filter(n => !presentes.has(n));
}

export function verificarDividaKarmica(n) {
  if (DIVIDAS_KARMICAS[n]) return { numero: n, descricao: DIVIDAS_KARMICAS[n] };
  return null;
}

export function calcularTendenciaOculta(nome, tabela = 'abnc') {
  const freq = {};
  for (const c of nome) {
    if (isAlpha(c)) {
      const v = reduzir(valorLetra(c, tabela), false);
      freq[v] = (freq[v] || 0) + 1;
    }
  }
  let max = 0, tendencia = 1;
  for (const [num, count] of Object.entries(freq)) {
    if (count > max) { max = count; tendencia = Number(num); }
  }
  return tendencia;
}

export function calcularRespostaSubconsciente(nome, tabela = 'abnc') {
  return 9 - calcularLicoesKarmicas(nome, tabela).length;
}

// ---- Pirâmide Invertida (Triângulo da Vida) ----
// Pares adjacentes são somados SEM preservar números mestres (conforme ABNC)

export function calcularPiramide(nome, tabela = 'abnc') {
  const letras = nome.split('').filter(c => isAlpha(c));
  if (letras.length === 0) return [];

  let linha = letras.map(c => valorLetra(c, tabela));
  const piramide = [linha];

  while (linha.length > 1) {
    const novaLinha = [];
    for (let i = 0; i < linha.length - 1; i++) {
      // Na pirâmide: NÃO preservar números mestres nas somas intermediárias
      novaLinha.push(reduzir(linha[i] + linha[i + 1], false));
    }
    piramide.push(novaLinha);
    linha = novaLinha;
  }

  return piramide;
}

export function detectarSequenciasNegativas(piramide) {
  const resultados = [];
  for (let l = 0; l < piramide.length; l++) {
    const str = piramide[l].join('');
    for (const seq of Object.keys(SEQUENCIAS_NEGATIVAS)) {
      if (str.includes(seq)) {
        resultados.push({
          sequencia: seq,
          significado: SEQUENCIAS_NEGATIVAS[seq],
          posicaoLinha: l,
        });
      }
    }
  }
  return resultados;
}

// ---- Harmonia Numérica ----

export function calcularHarmonia(destino, expressao) {
  const destinoBase = reduzir(destino, false);
  const expBase = reduzir(expressao, false);
  const h = HARMONIA_NUMERICA[destino] || HARMONIA_NUMERICA[destinoBase];
  if (!h) return { status: 'desconhecido' };

  const inList = (list) => list.includes(expressao) || list.includes(expBase);
  if (inList(h.favoravel))    return { status: 'favoravel',    descricao: 'Harmonia favorável — vibração positiva entre Destino e Expressão.' };
  if (inList(h.desfavoravel)) return { status: 'desfavoravel', descricao: 'Harmonia desfavorável — requer esforço consciente para equilibrar as energias.' };
  if (inList(h.neutro))       return { status: 'neutro',       descricao: 'Harmonia neutra — pode ser positiva ou negativa conforme o nível de consciência.' };
  return { status: 'desconhecido', descricao: '' };
}

// ---- Ciclos e Desafios ----

export function calcularCiclos(dia, mes, ano) {
  const destino = calcularDestino(`${String(dia).padStart(2,'0')}/${String(mes).padStart(2,'0')}/${ano}`);
  const fimC1 = 36 - destino;
  const fimC2 = fimC1 + 27;
  const somaAno = String(ano).split('').map(Number).reduce((a, b) => a + b, 0);

  return [
    { numero: reduzir(Number(mes), true), inicio: 0,     fim: fimC1, label: 'Ciclo 1 (Infância/Juventude)' },
    { numero: reduzir(Number(dia), true), inicio: fimC1, fim: fimC2, label: 'Ciclo 2 (Maturidade)' },
    { numero: reduzir(somaAno, true),     inicio: fimC2, fim: null,  label: 'Ciclo 3 (Sabedoria)' },
  ];
}

export function calcularDesafios(dia, mes, ano) {
  const ciclos = calcularCiclos(dia, mes, ano);
  const [c1, c2, c3] = ciclos.map(c => c.numero);
  const d1 = Math.abs(c1 - c2);
  const d2 = Math.abs(c2 - c3);
  const d3 = Math.abs(d1 - d2);
  const d4 = Math.abs(c1 - c3);
  return [
    { numero: d1, label: 'Desafio 1' },
    { numero: d2, label: 'Desafio 2' },
    { numero: d3, label: 'Desafio Principal' },
    { numero: d4, label: 'Desafio Tardio' },
  ];
}

export function calcularMomentosdecisivos(dia, mes, ano, destino) {
  const ciclos = calcularCiclos(dia, mes, ano);
  const [c1, c2, c3] = ciclos.map(c => c.numero);
  const p1 = reduzir(c1 + c2, true);
  const p2 = reduzir(c2 + c3, true);
  const p3 = reduzir(p1 + p2, true);
  const p4 = reduzir(c1 + c3, true);
  const i2 = 36 - destino;
  return [
    { numero: p1, label: 'Pináculo 1', inicio: 0,    fim: i2 },
    { numero: p2, label: 'Pináculo 2', inicio: i2,   fim: i2 + 9 },
    { numero: p3, label: 'Pináculo 3', inicio: i2+9, fim: i2 + 18 },
    { numero: p4, label: 'Pináculo 4', inicio: i2+18,fim: null },
  ];
}

// ---- Ciclo Pessoal ----

export function calcularAnoPessoal(dia, mes, anoAtual) {
  const somaAno = String(anoAtual).split('').map(Number).reduce((a, b) => a + b, 0);
  return reduzir(Number(dia) + Number(mes) + somaAno, true);
}

export function calcularMesPessoal(anoPessoal, mesAtual) {
  return reduzir(anoPessoal + Number(mesAtual), true);
}

export function calcularDiaPessoal(mesPessoal, diaAtual) {
  return reduzir(mesPessoal + Number(diaAtual), true);
}

// ---- Harmonia de dias ----

export function numerosHarmonicos(n) {
  const tabela = {
    1:[1,3,5,9], 2:[2,4,6,7], 3:[1,3,5,6], 4:[2,6,8],
    5:[1,3,5,7,9], 6:[2,3,4,8,9], 7:[2,5,7], 8:[4,6],
    9:[1,5,6,9], 11:[1,3,5,7,9,11], 22:[1,2,3,4,5,6,7,8,9,22],
  };
  return tabela[n] || [n];
}

export function calcularDiasFavoraveis(expressao, mes, ano) {
  const anoPessoal = calcularAnoPessoal(1, mes, ano);
  const mesPessoal = calcularMesPessoal(anoPessoal, mes);
  const harmonicos = numerosHarmonicos(expressao);
  const favoraveis = [];
  for (let d = 1; d <= 31; d++) {
    if (harmonicos.includes(calcularDiaPessoal(mesPessoal, d))) favoraveis.push(d);
  }
  return favoraveis;
}

// ---- Método dos 9 Arcanos (Carlos Rosa / Árvore da Vida) ----

export function metodo9Arcanos(nomeCompleto, dataNascimento) {
  const nome = nomeCompleto.toUpperCase().replace(/\s+/g, '');
  const [diaStr, mesStr, anoStr] = dataNascimento.split('/');
  const dia = parseInt(diaStr, 10);
  const mes = parseInt(mesStr, 10);
  const ano = parseInt(anoStr, 10);

  // Atribuição sequencial única de valores às letras
  const valoresAtribuidos = {};
  let contador = 1;
  const valoresLetras = [];

  for (const letra of nome) {
    if (!valoresAtribuidos[letra]) { valoresAtribuidos[letra] = contador++; }
    valoresLetras.push(valoresAtribuidos[letra]);
  }

  const freq = {};
  for (const l of nome) freq[l] = (freq[l] || 0) + 1;

  const somaData = dia + mes + String(ano).split('').map(Number).reduce((a, b) => a + b, 0);
  const temperamento = reduzirAte22(somaData);

  const qtdLetras = nome.length;
  const destino9 = reduzirAte22(qtdLetras);

  const triplas = Object.entries(freq).filter(([, c]) => c >= 3).map(([l]) => (valoresAtribuidos[l] || 0) * 3);
  const cabeca = reduzirAte22(triplas.length > 0 ? triplas.reduce((a, b) => a + b, 0) : qtdLetras);

  const duplas = Object.entries(freq).filter(([, c]) => c === 2).map(([l]) => (valoresAtribuidos[l] || 0) * 2);
  const missao9 = reduzirAte22(duplas.length > 0 ? duplas.reduce((a, b) => a + b, 0) : 0);

  const unicas = Object.entries(freq).filter(([, c]) => c === 1).map(([l]) => valoresAtribuidos[l] || 0);
  const coracao = reduzirAte22(unicas.reduce((a, b) => a + b, 0));

  const sexo    = reduzirAte22(cabeca + missao9 + coracao);
  const familia = reduzirAte22(cabeca + missao9 + coracao + sexo);
  const licaoVida = reduzirAte22(Math.max(...valoresLetras));
  const personalidade = reduzirAte22(destino9 + cabeca + missao9 + coracao + sexo + familia + licaoVida);

  const posicoes = [
    { label: 'Temperamento',        descricao: 'Personalidade da encarnação atual. Como você age e reage no dia a dia.', valor: temperamento },
    { label: 'Destino',             descricao: 'Principais eventos e caminhos que serão mostrados ao longo da vida.',    valor: destino9 },
    { label: 'Cabeça',              descricao: 'Razão e raciocínio. Como você pensa e processa informações.',            valor: cabeca },
    { label: 'Missão',              descricao: 'Foco pessoal de vida. O que você veio realizar nesta encarnação.',       valor: missao9 },
    { label: 'Coração',             descricao: 'Emocional e sentimento. O que move seu mundo interior.',                 valor: coracao },
    { label: 'Sexo / Perfil Anímico',descricao: 'Perfil anímico-magnético. Sua energia de atração e relacionamento.',   valor: sexo },
    { label: 'Família / Sociedade', descricao: 'Perfil de atuação na sociedade e no ambiente familiar.',                valor: familia },
    { label: 'Lição de Vida',       descricao: 'Objetivo de aprendizado na presente encarnação.',                       valor: licaoVida },
    { label: 'Personalidade Espiritual', descricao: 'Caráter espiritual. Influência profunda sobre o Temperamento.',   valor: personalidade },
  ];

  return posicoes.map(p => ({ ...p, arcano: ARCANOS[p.valor] || ARCANOS[reduzir(p.valor, false)] || ARCANOS[1] }));
}

// ---- Mapa Completo ----

export function calcularMapaCompleto(nome, dataStr, tabela = 'abnc') {
  const [diaStr, mesStr, anoStr] = dataStr.split('/');

  const motivacao    = calcularMotivacao(nome, tabela);
  const impressao    = calcularImpressao(nome, tabela);
  const expressao    = calcularExpressao(nome, tabela);
  const destino      = calcularDestino(dataStr);
  const missao       = calcularMissao(expressao, destino);
  const diaNatalicio = calcularDiaNatalicio(diaStr);
  const harmonia     = calcularHarmonia(destino, expressao);

  const hoje = new Date('2026-05-28');
  const anoPessoal  = calcularAnoPessoal(diaStr, mesStr, hoje.getFullYear());
  const mesPessoal  = calcularMesPessoal(anoPessoal, hoje.getMonth() + 1);
  const diaPessoal  = calcularDiaPessoal(mesPessoal, hoje.getDate());

  const licoesKarmicas        = calcularLicoesKarmicas(nome, tabela);
  const tendenciaOculta       = calcularTendenciaOculta(nome, tabela);
  const respostaSubconsciente = calcularRespostaSubconsciente(nome, tabela);
  const piramide              = calcularPiramide(nome, tabela);
  const sequenciasNegativas   = detectarSequenciasNegativas(piramide);
  const ciclos                = calcularCiclos(diaStr, mesStr, anoStr);
  const desafios              = calcularDesafios(diaStr, mesStr, anoStr);
  const momentosDecisivos     = calcularMomentosdecisivos(diaStr, mesStr, anoStr, destino);
  const arcanos9              = metodo9Arcanos(nome, dataStr);

  // Detecta dívidas kármicas nas somas brutas (antes da redução) dos números principais
  const dividasKarmicas = [];
  for (const [campo, val] of Object.entries({ motivacao, impressao, expressao, destino, missao })) {
    const d = verificarDividaKarmica(val);
    if (d) dividasKarmicas.push({ ...d, campo });
  }

  const coresFavoritas = CORES_FAVORITAS[expressao] || CORES_FAVORITAS[reduzir(expressao, false)] || [];
  const letrasNome = nome.split('').filter(c => isAlpha(c));
  const breakdown = calcularBreakdownNome(nome, tabela);
  const freqLetras = calcularFrequenciaLetras(nome, tabela);
  const diasFavoraveis = calcularDiasFavoraveis(expressao, hoje.getMonth() + 1, hoje.getFullYear());

  let arcanoDominante = null;
  if (piramide.length > 0) {
    const raiz = piramide[piramide.length - 1][0];
    arcanoDominante = { numero: raiz, arcano: ARCANOS[reduzirAte22(raiz)] || ARCANOS[1] };
  }

  return {
    nome, dataStr, tabela,
    motivacao, impressao, expressao, destino, missao, diaNatalicio,
    harmonia,
    anoPessoal, mesPessoal, diaPessoal,
    licoesKarmicas, tendenciaOculta, respostaSubconsciente,
    piramide, letrasNome, sequenciasNegativas,
    ciclos, desafios, momentosDecisivos,
    arcanos9, dividasKarmicas, coresFavoritas, arcanoDominante,
    breakdown, freqLetras, diasFavoraveis,
    arcanos: ARCANOS,
  };
}

export function calcularBreakdownNome(nome, tabela = 'abnc') {
  const palavras = nome.trim().split(/\s+/);
  return palavras.map(palavra => {
    const letras = [];
    for (const c of palavra) {
      if (isAlpha(c)) {
        const upper = c.toUpperCase();
        letras.push({ letra: upper, valor: valorLetra(upper, tabela), isVogal: isVogal(upper) });
      }
    }
    const sv = letras.filter(l => l.isVogal).reduce((a, l) => a + l.valor, 0);
    const sc = letras.filter(l => !l.isVogal).reduce((a, l) => a + l.valor, 0);
    const st = letras.reduce((a, l) => a + l.valor, 0);
    return {
      palavra: palavra.toUpperCase(),
      letras,
      somaVogais:      sv > 0 ? reduzir(sv, true) : 0,
      somaConsoantes:  sc > 0 ? reduzir(sc, true) : 0,
      somaTotal:       st > 0 ? reduzir(st, true) : 0,
    };
  });
}

export function calcularFrequenciaLetras(nome, tabela = 'abnc') {
  const freq = {};
  for (let i = 1; i <= 9; i++) freq[i] = 0;
  for (const c of nome) {
    if (isAlpha(c)) {
      const v = reduzir(valorLetra(c, tabela), false);
      if (v >= 1 && v <= 9) freq[v]++;
    }
  }
  return freq;
}

export { CORES_FAVORITAS, SEQUENCIAS_NEGATIVAS, DIVIDAS_KARMICAS, HARMONIA_NUMERICA };
