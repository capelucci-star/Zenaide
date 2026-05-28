// ============================================================
// Numerologia Cabalística - Engine
// ============================================================

// ----- Tabelas de letras -----

const TABELA_CICLO19 = {
  A:1,B:2,C:3,D:4,E:5,F:6,G:7,H:8,I:9,
  J:1,K:2,L:3,M:4,N:5,O:6,P:7,Q:8,R:9,
  S:1,T:2,U:3,V:4,W:5,X:6,Y:7,Z:8
};

const TABELA_CICLO18 = {
  A:1,B:2,C:3,D:4,E:5,F:6,G:7,H:8,
  I:1,J:2,K:3,L:4,M:5,N:6,O:7,P:8,
  Q:1,R:2,S:3,T:4,U:5,V:6,W:7,X:8,
  Y:1,Z:2
};

// Acentos: valor base da letra + incremento, ou valor fixo
// Retorna o valor RAW (antes de redução)
const ACCENT_MAP = {
  // Agudo (+2 sobre base)
  'Á': { base:'A', bonus:2 },
  'É': { base:'E', bonus:2 },
  'Í': { base:'I', bonus:2 },
  'Ó': { base:'O', bonus:2 },
  'Ú': { base:'U', bonus:2 },
  // Til (+3 sobre base)
  'Ã': { base:'A', bonus:3 },
  'Õ': { base:'O', bonus:3 },
  // Circunflexo (+7 sobre base)
  'Â': { base:'A', bonus:7 },
  'Ê': { base:'E', bonus:7 },
  'Î': { base:'I', bonus:7 },
  'Ô': { base:'O', bonus:7 },
  'Û': { base:'U', bonus:7 },
  // Cedilha: fixo 6
  'Ç': { fixed:6 },
  // Trema: base * 2
  'Ü': { base:'U', multiply:2 },
  'À': { base:'A', multiply:2 },
};

// Conjunto de vogais (maiúsculas e minúsculas, com acentos)
const VOGAIS = new Set('AEIOUÁÉÍÓÚÃÕÂÊÎÔÛÀaeiouáéíóúãõâêîôûà');

// ----- Arcanos -----

export const ARCANOS = {
  1:  { nome:'O Mago',              palavra_chave:'Vontade',         positivo:'Iniciativa, criatividade, liderança, autoconfiança',       negativo:'Manipulação, arrogância, instabilidade' },
  2:  { nome:'A Sacerdotisa',       palavra_chave:'Intuição',        positivo:'Sensibilidade, cooperação, diplomacia, equilíbrio',        negativo:'Indecisão, dependência, insegurança' },
  3:  { nome:'A Imperatriz',        palavra_chave:'Criatividade',    positivo:'Expressão, fertilidade, alegria, abundância',             negativo:'Superficialidade, dispersão, ciúme' },
  4:  { nome:'O Imperador',         palavra_chave:'Ordem',           positivo:'Disciplina, estabilidade, organização, construção',       negativo:'Rigidez, teimosia, controle excessivo' },
  5:  { nome:'O Hierofante',        palavra_chave:'Conhecimento',    positivo:'Sabedoria, tradição, espiritualidade, ensinamento',       negativo:'Dogmatismo, conformismo, rigidez' },
  6:  { nome:'Os Amantes',          palavra_chave:'Amor',            positivo:'Harmonia, relacionamentos, responsabilidade, beleza',     negativo:'Indecisão, conflito, sacrifício' },
  7:  { nome:'O Carro',             palavra_chave:'Vitória',         positivo:'Determinação, movimento, conquista, controle',            negativo:'Precipitação, autoritarismo, instabilidade' },
  8:  { nome:'A Força',             palavra_chave:'Poder',           positivo:'Coragem, autoridade, ambição, realizações materiais',     negativo:'Abuso de poder, materialismo, frieza' },
  9:  { nome:'O Eremita',           palavra_chave:'Sabedoria',       positivo:'Introspecção, busca espiritual, humanitarismo, compaixão',negativo:'Isolamento, solidão, perfeccionismo' },
  10: { nome:'A Roda da Fortuna',   palavra_chave:'Destino',         positivo:'Mudanças, ciclos, sorte, karma positivo',                 negativo:'Imprevisibilidade, resistência a mudanças' },
  11: { nome:'A Justiça',           palavra_chave:'Equilíbrio',      positivo:'Idealismo, inspiração, iluminação, sensibilidade elevada',negativo:'Perfeccionismo excessivo, nervosismo, ilusão' },
  12: { nome:'O Enforcado',         palavra_chave:'Sacrifício',      positivo:'Rendição, perspectiva diferente, pausa necessária',       negativo:'Martírio, estagnação, sacrifício involuntário' },
  13: { nome:'A Morte',             palavra_chave:'Transformação',   positivo:'Renovação, fim de ciclo, transformação necessária',       negativo:'Resistência à mudança, perda, karma de esforço' },
  14: { nome:'A Temperança',        palavra_chave:'Moderação',       positivo:'Equilíbrio, paciência, alquimia, harmonização',          negativo:'Excesso, desequilíbrio, karma de moderação' },
  15: { nome:'O Diabo',             palavra_chave:'Materialidade',   positivo:'Paixão, prazer, força vital, alquimia pessoal',          negativo:'Apego, vícios, ilusões materiais' },
  16: { nome:'A Torre',             palavra_chave:'Ruptura',         positivo:'Libertação, revelação súbita, renovação',                negativo:'Destruição, caos, karma de humildade' },
  17: { nome:'A Estrela',           palavra_chave:'Esperança',       positivo:'Renovação, fé, inspiração, cura',                       negativo:'Ilusão, ingenuidade, desânimo' },
  18: { nome:'A Lua',               palavra_chave:'Ilusão',          positivo:'Intuição profunda, mistério, sonhos, subconsciência',    negativo:'Confusão, medos, ilusões, enganos' },
  19: { nome:'O Sol',               palavra_chave:'Sucesso',         positivo:'Alegria, vitalidade, sucesso, clareza',                  negativo:'Vaidade, arrogância, karma de poder' },
  20: { nome:'O Julgamento',        palavra_chave:'Renovação',       positivo:'Despertar, julgamento justo, chamado superior',          negativo:'Autopunição, medo do julgamento alheio' },
  21: { nome:'O Mundo',             palavra_chave:'Completude',      positivo:'Realização, integração, sucesso total, maestria',        negativo:'Estagnação, falta de conclusão, incompletude' },
  22: { nome:'O Louco',             palavra_chave:'Liberdade',       positivo:'Potencial ilimitado, salto de fé, inovação, maestria',   negativo:'Imprudência, irresponsabilidade, caos' },
};

// Dívidas kármicas
const DIVIDAS_KARMICAS = {
  13: 'Esforço e disciplina',
  14: 'Moderação e equilíbrio',
  16: 'Humildade',
  19: 'Uso ético do poder',
};

// Cores por número de expressão
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

// Sequências negativas
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

/**
 * Reduz n a 1 dígito. Preserva 11, 22, 33 se preserveMasters=true.
 */
export function reduzir(n, preserveMasters = true) {
  if (preserveMasters && (n === 11 || n === 22 || n === 33)) return n;
  while (n > 9) {
    if (preserveMasters && (n === 11 || n === 22 || n === 33)) return n;
    const digits = String(n).split('').map(Number);
    n = digits.reduce((a, b) => a + b, 0);
    if (preserveMasters && (n === 11 || n === 22 || n === 33)) return n;
  }
  return n;
}

/**
 * Reduz até 22 (para arcanos), preservando masters.
 */
export function reduzirAte22(n) {
  while (n > 22) {
    const digits = String(n).split('').map(Number);
    n = digits.reduce((a, b) => a + b, 0);
  }
  return n;
}

/**
 * Retorna valor numérico de uma letra segundo a tabela.
 * Lida com letras acentuadas.
 */
export function valorLetra(letra, tabela = 'ciclo19') {
  const tbl = tabela === 'ciclo18' ? TABELA_CICLO18 : TABELA_CICLO19;
  const upper = letra.toUpperCase();

  if (ACCENT_MAP[upper]) {
    const acc = ACCENT_MAP[upper];
    if (acc.fixed !== undefined) {
      return reduzir(acc.fixed, true);
    }
    const baseVal = tbl[acc.base] || 0;
    let raw;
    if (acc.multiply !== undefined) {
      raw = baseVal * acc.multiply;
    } else {
      raw = baseVal + acc.bonus;
    }
    return reduzir(raw, true);
  }

  return tbl[upper] || 0;
}

function isAlpha(letra) {
  return /[A-Za-zÀ-ÖØ-öø-ÿ]/.test(letra);
}

function isVogal(letra) {
  return VOGAIS.has(letra);
}

// ---- Cálculos principais ----

/**
 * Motivação (Alma) = soma das vogais
 */
export function calcularMotivacao(nome, tabela = 'ciclo19') {
  let soma = 0;
  for (const c of nome) {
    if (isVogal(c) && isAlpha(c)) {
      soma += valorLetra(c, tabela);
    }
  }
  return reduzir(soma, true);
}

/**
 * Impressão (Ego) = soma das consoantes
 */
export function calcularImpressao(nome, tabela = 'ciclo19') {
  let soma = 0;
  for (const c of nome) {
    if (isAlpha(c) && !isVogal(c)) {
      soma += valorLetra(c, tabela);
    }
  }
  return reduzir(soma, true);
}

/**
 * Expressão (Nome) = soma de todas as letras
 */
export function calcularExpressao(nome, tabela = 'ciclo19') {
  let soma = 0;
  for (const c of nome) {
    if (isAlpha(c)) {
      soma += valorLetra(c, tabela);
    }
  }
  return reduzir(soma, true);
}

/**
 * Destino = soma de todos os dígitos da data DD/MM/AAAA
 */
export function calcularDestino(dataStr) {
  const digits = dataStr.replace(/\D/g, '').split('').map(Number);
  const soma = digits.reduce((a, b) => a + b, 0);
  return reduzir(soma, true);
}

/**
 * Missão = Expressão + Destino reduzidos
 */
export function calcularMissao(expressao, destino) {
  return reduzir(expressao + destino, true);
}

/**
 * Dia Natalício = redução do dia
 */
export function calcularDiaNatalicio(dia) {
  const n = parseInt(dia, 10);
  return reduzir(n, true);
}

/**
 * Lições Kármicas = números de 1-9 ausentes no nome
 */
export function calcularLicoesKarmicas(nome, tabela = 'ciclo19') {
  const presentes = new Set();
  for (const c of nome) {
    if (isAlpha(c)) {
      const v = valorLetra(c, tabela);
      const r = reduzir(v, false); // reduce to 1-9
      presentes.add(r);
    }
  }
  const ausentes = [];
  for (let i = 1; i <= 9; i++) {
    if (!presentes.has(i)) ausentes.push(i);
  }
  return ausentes;
}

/**
 * Verifica se n é dívida kármica (13, 14, 16, 19)
 * Retorna objeto ou null
 */
export function verificarDividaKarmica(n) {
  if (DIVIDAS_KARMICAS[n]) {
    return { numero: n, descricao: DIVIDAS_KARMICAS[n] };
  }
  return null;
}

/**
 * Tendência Oculta = soma dos valores de cada letra SEM reduzir o intermediário
 * (cada letra reduzida para 1 dígito, depois soma total reduzida)
 * Na prática: mesma que expressão mas sem preservar masters internos?
 * Definição: frequência dos números no nome - qual aparece mais vezes
 */
export function calcularTendenciaOculta(nome, tabela = 'ciclo19') {
  const freq = {};
  for (const c of nome) {
    if (isAlpha(c)) {
      const v = reduzir(valorLetra(c, tabela), false);
      freq[v] = (freq[v] || 0) + 1;
    }
  }
  let maxFreq = 0;
  let tendencia = 1;
  for (const [num, count] of Object.entries(freq)) {
    if (count > maxFreq) {
      maxFreq = count;
      tendencia = parseInt(num);
    }
  }
  return tendencia;
}

/**
 * Resposta Subconsciente = 9 - quantidade de lições kármicas
 */
export function calcularRespostaSubconsciente(nome, tabela = 'ciclo19') {
  const licoes = calcularLicoesKarmicas(nome, tabela);
  return 9 - licoes.length;
}

/**
 * Pirâmide Cabalística (pirâmide invertida):
 * Linha base = valores de cada letra
 * Cada linha seguinte = soma dos pares adjacentes (reduzidos)
 * Retorna array de arrays
 */
export function calcularPiramide(nome, tabela = 'ciclo19') {
  // Remove espaços, trabalha só com letras
  const letras = nome.split('').filter(c => isAlpha(c));
  if (letras.length === 0) return [];

  // Linha base: valor de cada letra
  let linha = letras.map(c => valorLetra(c, tabela));
  const piramide = [linha];

  while (linha.length > 1) {
    const novaLinha = [];
    for (let i = 0; i < linha.length - 1; i++) {
      novaLinha.push(reduzir(linha[i] + linha[i + 1], true));
    }
    piramide.push(novaLinha);
    linha = novaLinha;
  }

  return piramide;
}

/**
 * Detecta sequências negativas na pirâmide
 * Retorna array de { sequencia, significado, posicaoLinha }
 */
export function detectarSequenciasNegativas(piramide) {
  const resultados = [];
  for (let l = 0; l < piramide.length; l++) {
    const linha = piramide[l];
    const str = linha.join('');
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

/**
 * Ciclos de vida (baseados no destino)
 * Ciclo 1: do nascimento até (36 - destino) anos
 * Ciclo 2: dura 27 anos
 * Ciclo 3: o restante da vida
 * Valores:
 *   Ciclo 1 = mês de nascimento reduzido
 *   Ciclo 2 = dia de nascimento reduzido
 *   Ciclo 3 = ano de nascimento reduzido
 */
export function calcularCiclos(dia, mes, ano) {
  const diaN = parseInt(dia, 10);
  const mesN = parseInt(mes, 10);
  const anoN = parseInt(ano, 10);

  const destino = calcularDestino(`${String(diaN).padStart(2,'0')}/${String(mesN).padStart(2,'0')}/${ano}`);

  const fimCiclo1 = 36 - destino;
  const fimCiclo2 = fimCiclo1 + 27;

  return [
    { numero: reduzir(mesN, true), inicio: 0,         fim: fimCiclo1,   label: 'Ciclo 1' },
    { numero: reduzir(diaN, true), inicio: fimCiclo1, fim: fimCiclo2,   label: 'Ciclo 2' },
    { numero: reduzir(
        String(anoN).split('').map(Number).reduce((a,b) => a+b, 0), true
      ),                           inicio: fimCiclo2, fim: null,         label: 'Ciclo 3' },
  ];
}

/**
 * Desafios
 * Desafio 1 = |Ciclo1 - Ciclo2|
 * Desafio 2 = |Ciclo2 - Ciclo3|
 * Desafio 3 (principal) = |Desafio1 - Desafio2|
 * Desafio 4 = |Ciclo1 - Ciclo3|
 */
export function calcularDesafios(dia, mes, ano) {
  const ciclos = calcularCiclos(dia, mes, ano);
  const c1 = ciclos[0].numero;
  const c2 = ciclos[1].numero;
  const c3 = ciclos[2].numero;

  const d1 = Math.abs(c1 - c2);
  const d2 = Math.abs(c2 - c3);
  const d3 = Math.abs(d1 - d2);
  const d4 = Math.abs(c1 - c3);

  return [
    { numero: d1, label: 'Desafio 1' },
    { numero: d2, label: 'Desafio 2' },
    { numero: d3, label: 'Desafio Principal (3)' },
    { numero: d4, label: 'Desafio 4' },
  ];
}

/**
 * Momentos Decisivos (Pínaculos)
 * Pináculo 1 = Ciclo1 + Ciclo2
 * Pináculo 2 = Ciclo2 + Ciclo3
 * Pináculo 3 = Pináculo1 + Pináculo2
 * Pináculo 4 = Ciclo1 + Ciclo3
 * Início: Pináculo 1 começa ao nascer, Pináculo 2 começa aos (36 - destino) anos
 */
export function calcularMomentosdecisivos(dia, mes, ano, destino) {
  const ciclos = calcularCiclos(dia, mes, ano);
  const c1 = ciclos[0].numero;
  const c2 = ciclos[1].numero;
  const c3 = ciclos[2].numero;

  const p1 = reduzir(c1 + c2, true);
  const p2 = reduzir(c2 + c3, true);
  const p3 = reduzir(p1 + p2, true);
  const p4 = reduzir(c1 + c3, true);

  const inicio_md2 = 36 - destino;
  const inicio_md3 = inicio_md2 + 9;
  const inicio_md4 = inicio_md3 + 9;

  return [
    { numero: p1, label: 'Pináculo 1', inicio: 0,          fim: inicio_md2 },
    { numero: p2, label: 'Pináculo 2', inicio: inicio_md2, fim: inicio_md3 },
    { numero: p3, label: 'Pináculo 3', inicio: inicio_md3, fim: inicio_md4 },
    { numero: p4, label: 'Pináculo 4', inicio: inicio_md4, fim: null },
  ];
}

/**
 * Ano Pessoal
 */
export function calcularAnoPessoal(dia, mes, anoAtual) {
  const soma = parseInt(dia, 10)
    + parseInt(mes, 10)
    + String(anoAtual).split('').map(Number).reduce((a, b) => a + b, 0);
  return reduzir(soma, true);
}

/**
 * Mês Pessoal
 */
export function calcularMesPessoal(anoPessoal, mesAtual) {
  return reduzir(anoPessoal + parseInt(mesAtual, 10), true);
}

/**
 * Dia Pessoal
 */
export function calcularDiaPessoal(mesPessoal, diaAtual) {
  return reduzir(mesPessoal + parseInt(diaAtual, 10), true);
}

/**
 * Dias favoráveis no mês: dias cujo número pessoal é harmônico com expressão
 */
export function calcularDiasFavoraveis(expressao, mes, ano) {
  const anoPessoal = calcularAnoPessoal(1, mes, ano); // simplificado
  const mesPessoal = calcularMesPessoal(anoPessoal, mes);
  const harmonicos = numerosHarmonicos(expressao);
  const favoraveis = [];
  for (let d = 1; d <= 31; d++) {
    const diaPessoal = calcularDiaPessoal(mesPessoal, d);
    if (harmonicos.includes(diaPessoal)) {
      favoraveis.push(d);
    }
  }
  return favoraveis;
}

/**
 * Números harmônicos de n
 */
export function numerosHarmonicos(n) {
  const tabela = {
    1:  [1, 3, 5, 9],
    2:  [2, 4, 6, 8],
    3:  [1, 3, 6, 9],
    4:  [2, 4, 6, 8],
    5:  [1, 3, 5, 7],
    6:  [2, 3, 6, 9],
    7:  [5, 7, 9],
    8:  [2, 4, 6, 8],
    9:  [1, 3, 6, 9],
    11: [2, 4, 6, 11],
    22: [4, 8, 22],
    33: [3, 6, 9, 33],
  };
  return tabela[n] || [1, 2, 3, 4, 5, 6, 7, 8, 9];
}

/**
 * Método dos 9 Arcanos
 * Retorna objeto com as 9 posições e seus arcanos
 */
export function metodo9Arcanos(nomeCompleto, dataNascimento) {
  // Divide nome completo em partes
  const partes = nomeCompleto.trim().split(/\s+/);
  const primeiroNome = partes[0] || '';
  const ultimoNome = partes[partes.length - 1] || '';

  // Data: DD/MM/AAAA
  const [diaStr, mesStr, anoStr] = dataNascimento.split('/');
  const dia = parseInt(diaStr, 10);
  const mes = parseInt(mesStr, 10);
  const ano = parseInt(anoStr, 10);

  // Valores base
  const somaVogaisPrimeiroNome = (() => {
    let s = 0;
    for (const c of primeiroNome) {
      if (isVogal(c) && isAlpha(c)) s += valorLetra(c, 'ciclo19');
    }
    return s;
  })();
  const somaConsonantesPrimeiroNome = (() => {
    let s = 0;
    for (const c of primeiroNome) {
      if (isAlpha(c) && !isVogal(c)) s += valorLetra(c, 'ciclo19');
    }
    return s;
  })();
  const somaPrimeiroNome = somaVogaisPrimeiroNome + somaConsonantesPrimeiroNome;

  const somaVogaisUltimoNome = (() => {
    let s = 0;
    for (const c of ultimoNome) {
      if (isVogal(c) && isAlpha(c)) s += valorLetra(c, 'ciclo19');
    }
    return s;
  })();

  const somaData = dia + mes + String(ano).split('').map(Number).reduce((a, b) => a + b, 0);

  // 9 Arcanos posições:
  // 1. Temperamento (vogais 1º nome)
  // 2. Destino (consoantes 1º nome)
  // 3. Cabeça (soma total 1º nome)
  // 4. Missão (vogais último nome)
  // 5. Coração (data completa)
  // 6. Sexo (dia)
  // 7. Família (mês)
  // 8. Lição de Vida (ano)
  // 9. Personalidade (soma geral)

  const somaAno = String(ano).split('').map(Number).reduce((a, b) => a + b, 0);
  const somaGeral = somaPrimeiroNome + somaVogaisUltimoNome + somaData;

  const posicoes = [
    { label: 'Temperamento',    valor: reduzirAte22(reduzir(somaVogaisPrimeiroNome, true)) },
    { label: 'Destino',         valor: reduzirAte22(reduzir(somaConsonantesPrimeiroNome, true)) },
    { label: 'Cabeça',          valor: reduzirAte22(reduzir(somaPrimeiroNome, true)) },
    { label: 'Missão',          valor: reduzirAte22(reduzir(somaVogaisUltimoNome, true)) },
    { label: 'Coração',         valor: reduzirAte22(reduzir(somaData, true)) },
    { label: 'Sexo',            valor: reduzirAte22(reduzir(dia, true)) },
    { label: 'Família',         valor: reduzirAte22(reduzir(mes, true)) },
    { label: 'Lição de Vida',   valor: reduzirAte22(reduzir(somaAno, true)) },
    { label: 'Personalidade',   valor: reduzirAte22(reduzir(somaGeral, true)) },
  ];

  return posicoes.map(p => ({
    ...p,
    arcano: ARCANOS[p.valor] || ARCANOS[reduzir(p.valor, false)] || ARCANOS[1],
  }));
}

/**
 * Mapa Completo
 */
export function calcularMapaCompleto(nome, dataStr, tabela = 'ciclo19') {
  const [diaStr, mesStr, anoStr] = dataStr.split('/');

  const motivacao    = calcularMotivacao(nome, tabela);
  const impressao    = calcularImpressao(nome, tabela);
  const expressao    = calcularExpressao(nome, tabela);
  const destino      = calcularDestino(dataStr);
  const missao       = calcularMissao(expressao, destino);
  const diaNatalicio = calcularDiaNatalicio(diaStr);

  // Ano pessoal usando hoje (2026-05-28)
  const hoje = new Date('2026-05-28');
  const anoAtual = hoje.getFullYear();
  const mesAtual = hoje.getMonth() + 1;
  const diaAtual = hoje.getDate();

  const anoPessoal = calcularAnoPessoal(diaStr, mesStr, anoAtual);
  const mesPessoal = calcularMesPessoal(anoPessoal, mesAtual);
  const diaPessoal = calcularDiaPessoal(mesPessoal, diaAtual);

  const licoesKarmicas       = calcularLicoesKarmicas(nome, tabela);
  const tendenciaOculta      = calcularTendenciaOculta(nome, tabela);
  const respostaSubconsciente= calcularRespostaSubconsciente(nome, tabela);
  const piramide             = calcularPiramide(nome, tabela);
  const sequenciasNegativas  = detectarSequenciasNegativas(piramide);
  const ciclos               = calcularCiclos(diaStr, mesStr, anoStr);
  const desafios             = calcularDesafios(diaStr, mesStr, anoStr);
  const momentosDecisivos    = calcularMomentosdecisivos(diaStr, mesStr, anoStr, destino);
  const arcanos9             = metodo9Arcanos(nome, dataStr);

  // Dívidas kármicas nos números principais
  const dividasKarmicas = [];
  const numsPrincipais = { motivacao, impressao, expressao, destino, missao, diaNatalicio };
  for (const [chave, val] of Object.entries(numsPrincipais)) {
    // Verifica a soma bruta antes da redução para dívidas
    // Dívida kármica ocorre quando a soma resulta em 13, 14, 16, 19 antes de reduzir
    const divida = verificarDividaKarmica(val);
    if (divida) dividasKarmicas.push({ ...divida, campo: chave });
  }

  const coresFavoritas = CORES_FAVORITAS[expressao] || CORES_FAVORITAS[reduzir(expressao, false)] || [];

  // Letras do nome (para pirâmide)
  const letrasNome = nome.split('').filter(c => isAlpha(c));

  // Arcanos dominantes na pirâmide (topo = raiz)
  const arcanosDominantes = [];
  if (piramide.length > 0) {
    const raiz = piramide[piramide.length - 1][0];
    const arcanoDominante = reduzirAte22(raiz);
    arcanosDominantes.push({ numero: arcanoDominante, arcano: ARCANOS[arcanoDominante] || ARCANOS[1] });
  }

  return {
    nome,
    dataStr,
    tabela,
    motivacao,
    impressao,
    expressao,
    destino,
    missao,
    diaNatalicio,
    anoPessoal,
    mesPessoal,
    diaPessoal,
    licoesKarmicas,
    tendenciaOculta,
    respostaSubconsciente,
    piramide,
    letrasNome,
    sequenciasNegativas,
    ciclos,
    desafios,
    momentosDecisivos,
    arcanos9,
    dividasKarmicas,
    coresFavoritas,
    arcanosDominantes,
    arcanos: ARCANOS,
  };
}

export { CORES_FAVORITAS, SEQUENCIAS_NEGATIVAS, DIVIDAS_KARMICAS };
