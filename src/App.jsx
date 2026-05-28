import { useState } from 'react';
import {
  calcularMapaCompleto,
  ARCANOS,
  numerosHarmonicos,
} from './numerologia.js';

// ---- Helper components ----

function Badge({ n }) {
  const masters = [11, 22, 33];
  const isMaster = masters.includes(n);
  return (
    <span
      className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-lg font-bold shadow
        ${isMaster ? 'bg-yellow-400 text-purple-950' : 'bg-purple-600 text-white'}`}
    >
      {n}
    </span>
  );
}

function ArcanoBadge({ numero }) {
  const arcano = ARCANOS[numero] || ARCANOS[1];
  return (
    <div className="flex items-center gap-3">
      <Badge n={numero} />
      <div>
        <div className="text-white font-semibold">{arcano.nome}</div>
        <div className="text-purple-300 text-sm italic">{arcano.palavra_chave}</div>
      </div>
    </div>
  );
}

function Card({ title, children, className = '' }) {
  return (
    <div className={`bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 ${className}`}>
      {title && <h3 className="text-purple-200 text-xs font-semibold uppercase tracking-wider mb-3">{title}</h3>}
      {children}
    </div>
  );
}

function NumberCard({ label, numero, sublabel }) {
  return (
    <Card>
      <div className="text-purple-300 text-xs font-semibold uppercase tracking-wider mb-2">{label}</div>
      <div className="flex items-center gap-3">
        <Badge n={numero} />
        {sublabel && <div className="text-purple-400 text-sm">{sublabel}</div>}
      </div>
    </Card>
  );
}

// ---- Tab: Home ----

function HomeTab({ onSubmit }) {
  const [nome, setNome] = useState('');
  const [data, setData] = useState('');
  const [tabela, setTabela] = useState('abnc');
  const [erros, setErros] = useState({});

  function validate() {
    const novosErros = {};
    if (!nome.trim()) {
      novosErros.nome = 'O nome é obrigatório.';
    } else if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(nome)) {
      novosErros.nome = 'Use apenas letras e espaços.';
    }
    if (!data.trim()) {
      novosErros.data = 'A data é obrigatória.';
    } else if (!/^\d{2}\/\d{2}\/\d{4}$/.test(data)) {
      novosErros.data = 'Use o formato DD/MM/AAAA.';
    } else {
      const [d, m, a] = data.split('/').map(Number);
      if (d < 1 || d > 31 || m < 1 || m > 12 || a < 1900 || a > 2100) {
        novosErros.data = 'Data inválida.';
      }
    }
    return novosErros;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const novosErros = validate();
    setErros(novosErros);
    if (Object.keys(novosErros).length === 0) {
      onSubmit(nome.trim(), data.trim(), tabela);
    }
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="text-center mb-10">
        <div className="text-6xl mb-4">✦</div>
        <h1 className="text-4xl font-bold text-white mb-2">Numerologia Cabalística</h1>
        <p className="text-purple-300">Descubra os números do seu destino</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-purple-200 text-sm font-medium mb-2">
              Nome Completo
            </label>
            <input
              type="text"
              value={nome}
              onChange={e => setNome(e.target.value)}
              placeholder="Digite seu nome completo"
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
            />
            {erros.nome && (
              <p className="text-red-400 text-xs mt-1">{erros.nome}</p>
            )}
            <p className="text-purple-400/70 text-xs mt-1">
              Use o nome completo do registro civil (certidão de nascimento)
            </p>
          </div>

          <div>
            <label className="block text-purple-200 text-sm font-medium mb-2">
              Data de Nascimento
            </label>
            <input
              type="text"
              value={data}
              onChange={e => setData(e.target.value)}
              placeholder="DD/MM/AAAA"
              maxLength={10}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
            />
            {erros.data && (
              <p className="text-red-400 text-xs mt-1">{erros.data}</p>
            )}
          </div>

          <div>
            <label className="block text-purple-200 text-sm font-medium mb-2">
              Tabela Numerológica
            </label>
            <div className="flex gap-3">
              {[
                { value: 'abnc', label: 'ABNC (Cabalística)' },
                { value: 'ciclo19', label: 'Ciclo 1-9 (Pitagórica)' },
              ].map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setTabela(opt.value)}
                  className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all border
                    ${tabela === opt.value
                      ? 'bg-purple-600 border-purple-400 text-white'
                      : 'bg-white/5 border-white/20 text-purple-300 hover:bg-white/10'}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-purple-900/50"
          >
            ✦ Gerar Mapa Cabalístico
          </button>
        </form>
      </Card>
    </div>
  );
}

// ---- Tab: Mapa Completo ----

function MapaCompletoTab({ mapa }) {
  const {
    motivacao, impressao, expressao, destino, missao,
    diaNatalicio, anoPessoal, mesPessoal,
    licoesKarmicas, tendenciaOculta, respostaSubconsciente,
    dividasKarmicas, coresFavoritas, ciclos, desafios, momentosDecisivos,
    harmonia,
  } = mapa;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white text-center">Mapa Completo</h2>

      {/* Números principais */}
      <div>
        <h3 className="text-purple-300 text-sm font-semibold uppercase tracking-wider mb-3">Números Principais</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <NumberCard label="Motivação (Alma)" numero={motivacao} sublabel="O que move sua alma" />
          <NumberCard label="Impressão (Ego)" numero={impressao} sublabel="Como o mundo te vê" />
          <NumberCard label="Expressão (Nome)" numero={expressao} sublabel="Sua missão de vida" />
          <NumberCard label="Destino" numero={destino} sublabel="Caminho kármico" />
          <NumberCard label="Missão" numero={missao} sublabel="Propósito superior" />
          <NumberCard label="Dia Natalício" numero={diaNatalicio} sublabel="Dom de nascimento" />
        </div>
      </div>

      {/* Harmonia Numérica */}
      {harmonia && harmonia.status !== 'desconhecido' && (
        <Card title="Harmonia Numérica — Destino × Expressão">
          <div className={`flex items-start gap-3 p-3 rounded-xl border
            ${harmonia.status === 'favoravel'
              ? 'bg-green-500/10 border-green-500/30'
              : harmonia.status === 'desfavoravel'
              ? 'bg-red-500/10 border-red-500/30'
              : 'bg-yellow-500/10 border-yellow-500/30'}`}
          >
            <span className={`text-2xl shrink-0
              ${harmonia.status === 'favoravel' ? '⭐' : harmonia.status === 'desfavoravel' ? '⚠️' : '◈'}`}>
              {harmonia.status === 'favoravel' ? '★' : harmonia.status === 'desfavoravel' ? '▲' : '◆'}
            </span>
            <div>
              <div className={`font-semibold text-sm
                ${harmonia.status === 'favoravel'
                  ? 'text-green-300'
                  : harmonia.status === 'desfavoravel'
                  ? 'text-red-300'
                  : 'text-yellow-300'}`}>
                {harmonia.status === 'favoravel'
                  ? 'Favorável'
                  : harmonia.status === 'desfavoravel'
                  ? 'Desfavorável'
                  : 'Neutro'}
              </div>
              <div className="text-white/70 text-sm mt-1">{harmonia.descricao}</div>
            </div>
          </div>
          <p className="text-purple-400 text-xs mt-3">
            Indica se a vibração do seu Número de Expressão está em harmonia com o Número de Destino.
          </p>
        </Card>
      )}

      {/* Números pessoais */}
      <div>
        <h3 className="text-purple-300 text-sm font-semibold uppercase tracking-wider mb-3">Momento Atual (2026)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <NumberCard label="Ano Pessoal" numero={anoPessoal} sublabel="Tema do ano" />
          <NumberCard label="Mês Pessoal" numero={mesPessoal} sublabel="Tema do mês (Mai)" />
          <NumberCard label="Tendência Oculta" numero={tendenciaOculta} sublabel="Energia dominante" />
        </div>
      </div>

      {/* Dívidas kármicas */}
      {dividasKarmicas.length > 0 && (
        <Card title="Dívidas Kármicas">
          <div className="space-y-2">
            {dividasKarmicas.map((d, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-500/30 border border-red-400/50 text-red-300 font-bold text-sm">
                  {d.numero}
                </span>
                <div>
                  <span className="text-red-300 font-medium">{d.descricao}</span>
                  <span className="text-purple-400 text-xs ml-2">({d.campo})</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Lições kármicas */}
      {licoesKarmicas.length > 0 && (
        <Card title="Lições Kármicas (Números Ausentes)">
          <div className="flex flex-wrap gap-2">
            {licoesKarmicas.map(n => (
              <span
                key={n}
                className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-orange-500/20 border border-orange-400/40 text-orange-300 font-bold"
              >
                {n}
              </span>
            ))}
          </div>
          <p className="text-purple-400 text-xs mt-2">
            Estes números estão ausentes no nome e representam qualidades a desenvolver nesta encarnação.
          </p>
        </Card>
      )}

      {/* Resposta Subconsciente */}
      <Card title="Resposta Subconsciente">
        <div className="flex items-center gap-3">
          <Badge n={respostaSubconsciente} />
          <div>
            <div className="text-white">{ARCANOS[respostaSubconsciente]?.nome || ''}</div>
            <div className="text-purple-300 text-sm">{ARCANOS[respostaSubconsciente]?.palavra_chave || ''}</div>
          </div>
        </div>
        <p className="text-white/60 text-xs mt-2">
          Como você reage instintivamente sob pressão ou em situações imprevistas.
        </p>
      </Card>

      {/* Cores favoritas */}
      {coresFavoritas.length > 0 && (
        <Card title="Cores Favoráveis">
          <div className="flex flex-wrap gap-2">
            {coresFavoritas.map((cor, i) => (
              <span
                key={i}
                className="bg-white/10 border border-white/20 rounded-full px-3 py-1 text-white text-sm"
              >
                {cor}
              </span>
            ))}
          </div>
        </Card>
      )}

      {/* Ciclos */}
      <div>
        <h3 className="text-purple-300 text-sm font-semibold uppercase tracking-wider mb-3">Ciclos de Vida</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {ciclos.map((c, i) => (
            <Card key={i}>
              <div className="text-purple-300 text-xs font-semibold uppercase tracking-wider mb-2">{c.label}</div>
              <div className="flex items-center gap-3 mb-2">
                <Badge n={c.numero} />
                <div>
                  <div className="text-white font-bold">{ARCANOS[c.numero]?.nome || ''}</div>
                  <div className="text-purple-300 text-sm">{ARCANOS[c.numero]?.palavra_chave || ''}</div>
                </div>
              </div>
              <div className="text-purple-400 text-xs">
                {c.inicio}–{c.fim !== null ? c.fim : '∞'} anos
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Desafios */}
      <div>
        <h3 className="text-purple-300 text-sm font-semibold uppercase tracking-wider mb-3">Desafios</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {desafios.map((d, i) => (
            <Card key={i}>
              <div className="text-purple-300 text-xs font-semibold mb-2">{d.label}</div>
              <div className="flex items-center gap-2">
                <Badge n={d.numero} />
                <div className="text-white text-sm">{ARCANOS[d.numero]?.nome || d.numero}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Momentos Decisivos */}
      <div>
        <h3 className="text-purple-300 text-sm font-semibold uppercase tracking-wider mb-3">Momentos Decisivos (Pínaculos)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {momentosDecisivos.map((p, i) => (
            <Card key={i}>
              <div className="text-purple-300 text-xs font-semibold mb-2">{p.label}</div>
              <div className="flex items-center gap-2 mb-1">
                <Badge n={p.numero} />
                <div className="text-white font-bold">{ARCANOS[p.numero]?.nome || p.numero}</div>
              </div>
              <div className="text-purple-300 text-sm">{ARCANOS[p.numero]?.palavra_chave || ''}</div>
              <div className="text-purple-400 text-xs mt-1">
                {p.inicio}–{p.fim !== null ? p.fim : '∞'} anos
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---- Tab: Pirâmide ----

function PiramideTab({ mapa }) {
  const { piramide, letrasNome, sequenciasNegativas, arcanosDominantes, nome } = mapa;

  if (!piramide || piramide.length === 0) {
    return <p className="text-white text-center">Pirâmide não disponível.</p>;
  }

  const seqStrs = sequenciasNegativas.map(s => s.sequencia);

  function celulaTem(linha, idx, seq) {
    // Verifica se os próximos len(seq) dígitos a partir de idx formam a sequência
    const chars = seq.split('');
    for (let k = 0; k < chars.length; k++) {
      if (linha[idx + k] === undefined) return false;
      if (String(linha[idx + k]) !== chars[k]) return false;
    }
    return true;
  }

  function isNegativo(linhaIdx, celIdx) {
    const linha = piramide[linhaIdx];
    for (const seq of seqStrs) {
      const len = seq.length;
      // A célula faz parte de uma sequência negativa?
      for (let start = Math.max(0, celIdx - len + 1); start <= celIdx; start++) {
        const substr = linha.slice(start, start + len).map(String).join('');
        if (substr === seq) return true;
      }
    }
    return false;
  }

  const isRaiz = piramide.length > 1 && piramide[piramide.length - 1].length === 1;
  const raizVal = isRaiz ? piramide[piramide.length - 1][0] : null;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white text-center">Pirâmide Cabalística</h2>

      <Card>
        <div className="overflow-x-auto">
          <div className="space-y-2 py-4">
            {/* Letras acima da base */}
            <div className="flex justify-center gap-1 mb-1">
              {letrasNome.map((letra, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center"
                  style={{ minWidth: '2rem' }}
                >
                  <span className="text-purple-300 text-xs font-mono">{letra}</span>
                </div>
              ))}
            </div>

            {/* Pirâmide da base ao topo */}
            {piramide.map((linha, linhaIdx) => (
              <div
                key={linhaIdx}
                className="flex justify-center gap-1"
              >
                {linha.map((val, celIdx) => {
                  const neg = isNegativo(linhaIdx, celIdx);
                  const isRaizCel = linhaIdx === piramide.length - 1 && linha.length === 1;
                  return (
                    <div
                      key={celIdx}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold
                        ${isRaizCel
                          ? 'bg-purple-600 text-white ring-2 ring-purple-400'
                          : neg
                          ? 'bg-red-500/40 text-red-200 border border-red-500/60'
                          : linhaIdx === 0
                          ? 'bg-indigo-800/60 text-indigo-200 border border-indigo-600/40'
                          : 'bg-white/10 text-white border border-white/20'
                        }`}
                    >
                      {val}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Legenda */}
        <div className="flex flex-wrap gap-3 mt-4 text-xs text-purple-300">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-indigo-800/60 border border-indigo-600/40 rounded"></div>
            <span>Base (letras)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-white/10 border border-white/20 rounded"></div>
            <span>Intermediário</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-red-500/40 border border-red-500/60 rounded"></div>
            <span>Sequência negativa</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-purple-600 ring-2 ring-purple-400 rounded"></div>
            <span>Raiz (topo)</span>
          </div>
        </div>
      </Card>

      {/* Arcanos dominantes */}
      {arcanosDominantes.length > 0 && (
        <Card title="Arcanos Dominantes">
          <div className="space-y-3">
            {arcanosDominantes.map((item, i) => (
              <div key={i}>
                <ArcanoBadge numero={item.numero} />
                <p className="text-white/60 text-xs mt-2 ml-13">{item.arcano.positivo}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Sequências negativas */}
      {sequenciasNegativas.length > 0 && (
        <Card title="Sequências Negativas Detectadas">
          <div className="space-y-2">
            {sequenciasNegativas.map((s, i) => (
              <div key={i} className="flex items-start gap-3 p-2 bg-red-500/10 border border-red-500/20 rounded-lg">
                <span className="text-red-400 font-bold text-sm font-mono">{s.sequencia}</span>
                <div>
                  <div className="text-red-300 text-sm">{s.significado}</div>
                  <div className="text-purple-400 text-xs">Linha {s.posicaoLinha + 1}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {sequenciasNegativas.length === 0 && (
        <div className="text-center text-green-300 bg-green-500/10 border border-green-500/20 rounded-xl p-4">
          Nenhuma sequência negativa detectada na pirâmide.
        </div>
      )}
    </div>
  );
}

// ---- Tab: Detalhes do Mapa ----

function DetalhesMapaTab({ mapa }) {
  const numeros = [
    { label: 'Motivação (Alma)',         numero: mapa.motivacao,             sublabel: 'O que move sua alma internamente' },
    { label: 'Impressão (Ego)',          numero: mapa.impressao,             sublabel: 'Como os outros te percebem' },
    { label: 'Expressão (Nome)',         numero: mapa.expressao,             sublabel: 'Potencial de expressão e missão' },
    { label: 'Destino',                  numero: mapa.destino,               sublabel: 'Caminho kármico desta vida' },
    { label: 'Missão',                   numero: mapa.missao,                sublabel: 'Propósito superior' },
    { label: 'Dia Natalício',            numero: mapa.diaNatalicio,          sublabel: 'Dom especial de nascimento' },
    { label: 'Ano Pessoal',              numero: mapa.anoPessoal,            sublabel: 'Tema do ano atual' },
    { label: 'Tendência Oculta',         numero: mapa.tendenciaOculta,       sublabel: 'Energia dominante no nome' },
    { label: 'Resposta Subconsciente',   numero: mapa.respostaSubconsciente, sublabel: 'Reação instintiva sob pressão' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white text-center">Detalhes do Mapa</h2>
      <p className="text-purple-300 text-center text-sm">
        Interpretações dos arcanos correspondentes aos seus números pessoais
      </p>
      <div className="space-y-4">
        {numeros.map(({ label, numero, sublabel }) => {
          const arcano = ARCANOS[numero] || ARCANOS[1];
          const isMaster = [11, 22, 33].includes(numero);
          return (
            <Card key={label}>
              <div className="flex items-start gap-4">
                <Badge n={numero} />
                <div className="flex-1">
                  <div className="text-purple-300 text-xs uppercase tracking-wider mb-0.5">{label}</div>
                  <div className="text-white font-bold text-lg leading-tight">{arcano.nome}</div>
                  <div className="text-purple-300 text-sm italic mb-1">{arcano.palavra_chave}</div>
                  <div className="text-purple-400 text-xs mb-3">{sublabel}</div>
                  <div className="space-y-2">
                    <div>
                      <span className="text-green-400 text-xs font-semibold uppercase tracking-wider">Aspectos Positivos</span>
                      <p className="text-white/80 text-sm mt-1 leading-relaxed">{arcano.positivo}</p>
                    </div>
                    <div>
                      <span className="text-red-400 text-xs font-semibold uppercase tracking-wider">Aspectos Desafiadores</span>
                      <p className="text-white/80 text-sm mt-1 leading-relaxed">{arcano.negativo}</p>
                    </div>
                    {isMaster && (
                      <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-xl p-3 mt-2">
                        <span className="text-yellow-400 text-xs font-semibold">★ Número Mestre</span>
                        <p className="text-white/70 text-xs mt-1">
                          Vibração elevada com responsabilidade espiritual maior. Nunca deve ser reduzido nas interpretações.
                        </p>
                      </div>
                    )}
                    {arcano.divida_karmica && (
                      <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mt-2">
                        <span className="text-red-400 text-xs font-semibold">⚠ Dívida Kármica</span>
                        {arcano.nota && <p className="text-white/70 text-xs mt-1">{arcano.nota}</p>}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ---- Tab: Gráfico Numerológico ----

function GraficoTab({ mapa }) {
  const {
    nome, motivacao, impressao, expressao, destino, missao,
    diaNatalicio, anoPessoal, mesPessoal, diaPessoal,
    licoesKarmicas, tendenciaOculta, respostaSubconsciente,
    dividasKarmicas, coresFavoritas, ciclos, desafios, momentosDecisivos,
    harmonia, breakdown, freqLetras, diasFavoraveis,
  } = mapa;

  const numHarm = numerosHarmonicos(expressao);
  const isMaster = n => [11, 22, 33].includes(n);
  const numColor = n => isMaster(n) ? 'text-yellow-400' : 'text-white';

  const FigBox = ({ title, children, className = '' }) => (
    <div className={`bg-white/10 border border-white/20 rounded-2xl p-4 ${className}`}>
      {title && (
        <div className="text-purple-300 text-xs font-bold uppercase tracking-wider border-b border-white/10 pb-1.5 mb-3">
          {title}
        </div>
      )}
      {children}
    </div>
  );

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white text-center">Gráfico Numerológico</h2>

      {/* Fig. A — Tabela do nome */}
      <FigBox title={`Fig. A — ${nome.toUpperCase()}`}>
        <div className="overflow-x-auto">
          <table className="border-collapse text-center mx-auto text-xs">
            <tbody>
              {/* Vogais */}
              <tr>
                <td className="text-right pr-2 text-purple-300 font-semibold whitespace-nowrap py-0.5">Vogais</td>
                {breakdown.flatMap((word, wi) => [
                  ...word.letras.map((l, li) => (
                    <td key={`v-${wi}-${li}`} className="border border-white/10 w-6 h-6">
                      {l.isVogal && <span className="text-green-300 font-bold">{l.valor}</span>}
                    </td>
                  )),
                  <td key={`vs-${wi}`} className="border border-white/30 bg-purple-950/50 w-8 h-6 text-green-300 font-bold px-1">
                    {word.somaVogais || ''}
                  </td>,
                ])}
              </tr>
              {/* Letras */}
              <tr>
                <td className="text-right pr-2 text-purple-300 font-semibold whitespace-nowrap py-0.5">Nome</td>
                {breakdown.flatMap((word, wi) => [
                  ...word.letras.map((l, li) => (
                    <td key={`n-${wi}-${li}`} className="border border-white/30 w-6 h-8 font-bold text-white">
                      {l.letra}
                    </td>
                  )),
                  <td key={`ns-${wi}`} className="border border-white/30 bg-purple-950/50 w-8 h-8"></td>,
                ])}
              </tr>
              {/* Consoantes */}
              <tr>
                <td className="text-right pr-2 text-purple-300 font-semibold whitespace-nowrap py-0.5">Consoante</td>
                {breakdown.flatMap((word, wi) => [
                  ...word.letras.map((l, li) => (
                    <td key={`c-${wi}-${li}`} className="border border-white/10 w-6 h-6">
                      {!l.isVogal && <span className="text-blue-300 font-bold">{l.valor}</span>}
                    </td>
                  )),
                  <td key={`cs-${wi}`} className="border border-white/30 bg-purple-950/50 w-8 h-6 text-blue-300 font-bold px-1">
                    {word.somaConsoantes || ''}
                  </td>,
                ])}
              </tr>
              {/* Totais por palavra */}
              <tr>
                <td className="text-right pr-2 text-purple-300 font-semibold whitespace-nowrap py-0.5">TOTAL</td>
                {breakdown.flatMap((word, wi) => [
                  ...word.letras.map((_, li) => (
                    <td key={`t-${wi}-${li}`} className="border border-white/10 w-6 h-6 bg-white/5"></td>
                  )),
                  <td key={`ts-${wi}`} className="border border-white/30 bg-purple-950/50 w-8 h-6 text-yellow-300 font-bold px-1">
                    {word.somaTotal}
                  </td>,
                ])}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Três números principais */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          {[
            { label: 'N° de Motivação', valor: motivacao },
            { label: 'N° de Impressão', valor: impressao },
            { label: 'N° de Expressão', valor: expressao },
          ].map(({ label, valor }) => (
            <div key={label} className="border border-white/20 rounded-xl p-3 text-center">
              <div className="text-purple-300 text-xs mb-1">{label}</div>
              <div className={`text-2xl font-bold ${numColor(valor)}`}>{valor}</div>
            </div>
          ))}
        </div>
      </FigBox>

      {/* Fig. B + C/D + E */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Fig. B */}
        <FigBox title="Fig. B — Lições Kármicas">
          <div className="grid grid-cols-5 gap-1">
            {[1,2,3,4,5,6,7,8,9].map(n => (
              <div key={n} className={`h-8 flex items-center justify-center rounded border text-xs font-bold
                ${licoesKarmicas.includes(n)
                  ? 'bg-orange-500/30 border-orange-400/50 text-orange-300'
                  : 'bg-white/5 border-white/10 text-white/30'}`}>
                {n}
              </div>
            ))}
          </div>
          <p className="text-purple-400 text-xs mt-2">Destacado = ausente no nome</p>
        </FigBox>

        {/* Fig. C + D */}
        <FigBox>
          <div className="text-purple-300 text-xs font-bold uppercase tracking-wider border-b border-white/10 pb-1.5 mb-3">
            Fig. C — Tendências Ocultas
          </div>
          <div className="flex items-center gap-3 mb-4">
            <Badge n={tendenciaOculta} />
            <span className="text-white text-sm">Tendência Oculta</span>
          </div>
          <div className="text-purple-300 text-xs font-bold uppercase tracking-wider border-b border-white/10 pb-1.5 mb-3">
            Fig. D — Resp. Subconsciente
          </div>
          <div className="flex items-center gap-3">
            <Badge n={respostaSubconsciente} />
            <span className="text-white text-sm">Reação Instintiva</span>
          </div>
        </FigBox>

        {/* Fig. E */}
        <FigBox title="Fig. E — Destino e Missão">
          {dividasKarmicas.length > 0 && (
            <div className="mb-3">
              <div className="text-red-400 text-xs font-semibold mb-1">Dívidas Kármicas</div>
              <div className="flex flex-wrap gap-1">
                {dividasKarmicas.map((d, i) => (
                  <span key={i} className="bg-red-500/20 border border-red-500/30 rounded px-2 py-0.5 text-red-300 text-xs font-bold">
                    {d.numero}
                  </span>
                ))}
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div className="border border-white/20 rounded-xl p-3 text-center">
              <div className="text-purple-300 text-xs mb-1">N° de Destino</div>
              <div className={`text-2xl font-bold ${numColor(destino)}`}>{destino}</div>
            </div>
            <div className="border border-white/20 rounded-xl p-3 text-center">
              <div className="text-purple-300 text-xs mb-1">Missão</div>
              <div className={`text-2xl font-bold ${numColor(missao)}`}>{missao}</div>
            </div>
          </div>
          <div className="border border-white/20 rounded-xl p-3 text-center mt-3">
            <div className="text-purple-300 text-xs mb-1">Dia Natalício</div>
            <div className={`text-2xl font-bold ${numColor(diaNatalicio)}`}>{diaNatalicio}</div>
          </div>
        </FigBox>
      </div>

      {/* Fig. F + G + H */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FigBox title="Fig. F — Ciclos de Vida">
          {ciclos.map((c, i) => (
            <div key={i} className="flex items-center gap-3 mb-3 last:mb-0">
              <span className={`text-2xl font-bold w-8 ${numColor(c.numero)}`}>{c.numero}</span>
              <span className="text-purple-300 text-xs">{c.inicio}–{c.fim != null ? c.fim : '∞'} anos</span>
            </div>
          ))}
        </FigBox>

        <FigBox title="Fig. G — Momentos Decisivos">
          {momentosDecisivos.map((p, i) => (
            <div key={i} className="flex items-center gap-3 mb-3 last:mb-0">
              <span className={`text-2xl font-bold w-8 ${numColor(p.numero)}`}>{p.numero}</span>
              <span className="text-purple-300 text-xs">{p.inicio}–{p.fim != null ? p.fim : '∞'} anos</span>
            </div>
          ))}
        </FigBox>

        <FigBox title="Fig. H — Desafios">
          {desafios.map((d, i) => (
            <div key={i} className="flex items-center gap-3 mb-3 last:mb-0">
              <span className="text-2xl font-bold text-white w-8">{d.numero}</span>
              <span className="text-purple-300 text-xs">{d.label}</span>
            </div>
          ))}
        </FigBox>
      </div>

      {/* Total de Letras + Números Harmônicos + Dias Favoráveis */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FigBox title="Total de Letras em Cada Número">
          <div className="grid grid-cols-9 gap-px">
            {[1,2,3,4,5,6,7,8,9].map(n => (
              <div key={n} className="text-center">
                <div className="text-purple-400 text-xs border-b border-white/10 pb-0.5 mb-1">{n}</div>
                <div className={`text-sm font-bold ${freqLetras[n] === 0 ? 'text-white/20' : 'text-white'}`}>
                  {freqLetras[n] === 0 ? '∅' : freqLetras[n]}
                </div>
              </div>
            ))}
          </div>
        </FigBox>

        <FigBox title="Números Harmônicos">
          <div className="flex flex-wrap gap-1.5">
            {numHarm.map(n => (
              <span key={n} className="w-8 h-8 flex items-center justify-center rounded-full bg-green-500/20 border border-green-500/30 text-green-300 text-sm font-bold">
                {n}
              </span>
            ))}
          </div>
          <p className="text-purple-400 text-xs mt-2">Baseado na Expressão ({expressao})</p>
        </FigBox>

        <FigBox title="Dias do Mês Favoráveis">
          <div className="flex flex-wrap gap-1">
            {diasFavoraveis.map(d => (
              <span key={d} className="w-7 h-7 flex items-center justify-center rounded border border-green-500/30 bg-green-500/10 text-green-300 text-xs font-bold">
                {d}
              </span>
            ))}
            {diasFavoraveis.length === 0 && (
              <span className="text-purple-400 text-xs">Nenhum no mês atual</span>
            )}
          </div>
          <div className="border-t border-white/10 pt-2 mt-2 space-y-0.5">
            <div className="text-purple-300 text-xs">Ano Pessoal: <span className={`font-bold ${numColor(anoPessoal)}`}>{anoPessoal}</span></div>
            <div className="text-purple-300 text-xs">Mês Pessoal: <span className={`font-bold ${numColor(mesPessoal)}`}>{mesPessoal}</span></div>
            <div className="text-purple-300 text-xs">Dia Pessoal: <span className={`font-bold ${numColor(diaPessoal)}`}>{diaPessoal}</span></div>
          </div>
        </FigBox>
      </div>

      {/* Cores + Harmonia */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {coresFavoritas.length > 0 && (
          <FigBox title="Cores Favoráveis">
            <div className="flex flex-wrap gap-2">
              {coresFavoritas.map((cor, i) => (
                <span key={i} className="bg-white/10 border border-white/20 rounded-full px-3 py-1 text-white text-sm">
                  {cor}
                </span>
              ))}
            </div>
          </FigBox>
        )}

        {harmonia && harmonia.status !== 'desconhecido' && (
          <FigBox title="Harmonia Numérica (Destino × Expressão)">
            <div className={`p-3 rounded-xl border text-sm
              ${harmonia.status === 'favoravel'    ? 'bg-green-500/10 border-green-500/20 text-green-300'  :
                harmonia.status === 'desfavoravel' ? 'bg-red-500/10 border-red-500/20 text-red-300'        :
                'bg-yellow-500/10 border-yellow-500/20 text-yellow-300'}`}>
              <div className="font-bold mb-1">
                {harmonia.status === 'favoravel' ? '★ Favorável' :
                 harmonia.status === 'desfavoravel' ? '▲ Desfavorável' : '◆ Neutro'}
              </div>
              {harmonia.descricao}
            </div>
          </FigBox>
        )}
      </div>
    </div>
  );
}

// ---- Tab: 9 Arcanos ----

const POSICOES_LABELS = [
  'Temperamento', 'Destino', 'Cabeça', 'Missão', 'Coração',
  'Sexo', 'Família', 'Lição de Vida', 'Personalidade'
];

function ArcanosNoveTab({ mapa }) {
  const { arcanos9 } = mapa;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white text-center">Método dos 9 Arcanos</h2>
      <p className="text-purple-300 text-center text-sm">
        As 9 forças arquetípicas que moldam sua jornada
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {arcanos9.map((pos, i) => (
          <Card key={i} className="relative">
            <div className="absolute top-3 right-3 text-purple-500/40 font-bold text-3xl">{i + 1}</div>
            <div className="text-purple-300 text-xs font-semibold uppercase tracking-wider mb-3">
              {pos.label}
            </div>
            <div className="flex items-center gap-3 mb-3">
              <Badge n={pos.valor} />
              <div>
                <div className="text-white font-bold">{pos.arcano.nome}</div>
                <div className="text-purple-300 text-sm italic">{pos.arcano.palavra_chave}</div>
              </div>
            </div>
            <div className="text-white/60 text-xs leading-relaxed">{pos.arcano.positivo}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ---- Tab: Interpretações ----

function InterpretacoesTab() {
  const [aberto, setAberto] = useState(null);
  const nums = [1,2,3,4,5,6,7,8,9,11,22,33];

  const masterNums = [11, 22, 33];

  // Map number to arcano index (11->11, 22->22, 33 uses Louco=22 as closest)
  function getArcanoIdx(n) {
    if (n === 33) return 22; // O Louco como maestria
    if (ARCANOS[n]) return n;
    return n;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white text-center">Interpretações dos Arcanos</h2>

      <div className="space-y-3">
        {nums.map(n => {
          const idx = getArcanoIdx(n);
          const arcano = ARCANOS[idx] || {};
          const isMaster = masterNums.includes(n);
          const isOpen = aberto === n;

          return (
            <div
              key={n}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden"
            >
              <button
                className="w-full flex items-center gap-4 p-4 text-left hover:bg-white/5 transition-colors"
                onClick={() => setAberto(isOpen ? null : n)}
              >
                <span
                  className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-lg font-bold shrink-0
                    ${isMaster ? 'bg-yellow-400 text-purple-950' : 'bg-purple-600 text-white'}`}
                >
                  {n}
                </span>
                <div className="flex-1">
                  <div className="text-white font-semibold">{arcano.nome || `Número ${n}`}</div>
                  <div className="text-purple-300 text-sm italic">{arcano.palavra_chave || ''}</div>
                </div>
                <span className="text-purple-400 text-lg">{isOpen ? '▲' : '▼'}</span>
              </button>

              {isOpen && (
                <div className="px-4 pb-4 space-y-3 border-t border-white/10 pt-4">
                  <div>
                    <span className="text-green-400 text-xs font-semibold uppercase tracking-wider">Aspectos Positivos</span>
                    <p className="text-white/80 text-sm mt-1">{arcano.positivo || ''}</p>
                  </div>
                  <div>
                    <span className="text-red-400 text-xs font-semibold uppercase tracking-wider">Aspectos Desafiadores</span>
                    <p className="text-white/80 text-sm mt-1">{arcano.negativo || ''}</p>
                  </div>
                  {isMaster && (
                    <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-xl p-3">
                      <span className="text-yellow-400 text-xs font-semibold uppercase tracking-wider">Número Mestre</span>
                      <p className="text-white/70 text-sm mt-1">
                        Os números mestres carregam vibração elevada e responsabilidade espiritual maior.
                        Nunca devem ser reduzidos nas interpretações principais.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---- Main App ----

const TABS = [
  { id: 'home',           label: '✦ Início' },
  { id: 'mapa',           label: '🗺 Mapa' },
  { id: 'grafico',        label: '📊 Gráfico' },
  { id: 'detalhes',       label: '📖 Detalhes' },
  { id: 'piramide',       label: '△ Pirâmide' },
  { id: 'arcanos9',       label: '✦ 9 Arcanos' },
  { id: 'interpretacoes', label: '📚 Arcanos' },
];

export default function App() {
  const [tabAtiva, setTabAtiva] = useState('home');
  const [mapa, setMapa] = useState(null);
  const [erroGlobal, setErroGlobal] = useState('');

  function handleSubmit(nome, dataStr, tabela) {
    try {
      const resultado = calcularMapaCompleto(nome, dataStr, tabela);
      setMapa(resultado);
      setTabAtiva('mapa');
      setErroGlobal('');
    } catch (e) {
      setErroGlobal('Erro ao calcular o mapa: ' + e.message);
    }
  }

  const tabsVisiveis = mapa
    ? TABS
    : TABS.filter(t => t.id === 'home' || t.id === 'interpretacoes');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-indigo-900 to-purple-900">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-purple-950/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center gap-2 py-2">
            <span className="text-purple-300 text-sm font-medium hidden sm:block">Numerologia Cabalística</span>
            {mapa && (
              <span className="text-purple-500 text-xs hidden sm:block">— {mapa.nome}</span>
            )}
          </div>
          <nav className="flex gap-1 overflow-x-auto pb-2">
            {tabsVisiveis.map(tab => (
              <button
                key={tab.id}
                onClick={() => setTabAtiva(tab.id)}
                className={`whitespace-nowrap px-3 py-2 rounded-lg text-sm font-medium transition-all
                  ${tabAtiva === tab.id
                    ? 'bg-purple-600 text-white'
                    : 'text-purple-300 hover:text-white hover:bg-white/10'}`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {erroGlobal && (
          <div className="mb-6 bg-red-500/20 border border-red-500/40 rounded-xl p-4 text-red-300 text-sm">
            {erroGlobal}
          </div>
        )}

        {tabAtiva === 'home' && (
          <HomeTab onSubmit={handleSubmit} />
        )}

        {tabAtiva === 'mapa' && mapa && (
          <MapaCompletoTab mapa={mapa} />
        )}

        {tabAtiva === 'grafico' && mapa && (
          <GraficoTab mapa={mapa} />
        )}

        {tabAtiva === 'detalhes' && mapa && (
          <DetalhesMapaTab mapa={mapa} />
        )}

        {tabAtiva === 'piramide' && mapa && (
          <PiramideTab mapa={mapa} />
        )}

        {tabAtiva === 'arcanos9' && mapa && (
          <ArcanosNoveTab mapa={mapa} />
        )}

        {tabAtiva === 'interpretacoes' && (
          <InterpretacoesTab />
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-purple-500 text-xs">
        <div>Zenaide — Numerologia Cabalística</div>
        {mapa && (
          <div className="mt-1">
            Tabela: {mapa.tabela === 'abnc' ? 'ABNC (Cabalística)' : 'Ciclo 1-9 (Pitagórica)'}
          </div>
        )}
      </footer>
    </div>
  );
}
