import { useState } from 'react';
import {
  calcularMapaCompleto,
  ARCANOS,
  numerosHarmonicos,
} from './numerologia.js';

// ---- Helper components ----

function Badge({ n }) {
  const isMaster = [11, 22, 33].includes(n);
  return (
    <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-lg font-bold shadow-sm
      ${isMaster ? 'bg-amber-400 text-amber-950' : 'bg-purple-600 text-white'}`}>
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
        <div className="text-gray-900 font-semibold">{arcano.nome}</div>
        <div className="text-gray-500 text-sm italic">{arcano.palavra_chave}</div>
      </div>
    </div>
  );
}

function Card({ title, children, className = '' }) {
  return (
    <div className={`bg-white border border-gray-200 rounded-2xl p-5 shadow-sm ${className}`}>
      {title && <h3 className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-3">{title}</h3>}
      {children}
    </div>
  );
}

function NumberCard({ label, numero, sublabel }) {
  return (
    <Card>
      <div className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">{label}</div>
      <div className="flex items-center gap-3">
        <Badge n={numero} />
        {sublabel && <div className="text-gray-500 text-sm">{sublabel}</div>}
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
        <div className="text-6xl mb-4 text-purple-500">✦</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Numerologia Cabalística</h1>
        <p className="text-gray-500">Descubra os números do seu destino</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">Nome Completo</label>
            <input
              type="text"
              value={nome}
              onChange={e => setNome(e.target.value)}
              placeholder="Digite seu nome completo"
              className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            />
            {erros.nome && <p className="text-red-600 text-xs mt-1">{erros.nome}</p>}
            <p className="text-gray-400 text-xs mt-1">Use o nome completo do registro civil (certidão de nascimento)</p>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">Data de Nascimento</label>
            <input
              type="text"
              value={data}
              onChange={e => setData(e.target.value)}
              placeholder="DD/MM/AAAA"
              maxLength={10}
              className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            />
            {erros.data && <p className="text-red-600 text-xs mt-1">{erros.data}</p>}
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">Tabela Numerológica</label>
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
                      ? 'bg-purple-600 border-purple-600 text-white'
                      : 'bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100'}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md"
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
      <h2 className="text-2xl font-bold text-gray-900 text-center">Mapa Completo</h2>

      <div>
        <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-3">Números Principais</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <NumberCard label="Motivação (Alma)"  numero={motivacao}    sublabel="O que move sua alma" />
          <NumberCard label="Impressão (Ego)"   numero={impressao}    sublabel="Como o mundo te vê" />
          <NumberCard label="Expressão (Nome)"  numero={expressao}    sublabel="Sua missão de vida" />
          <NumberCard label="Destino"            numero={destino}      sublabel="Caminho kármico" />
          <NumberCard label="Missão"             numero={missao}       sublabel="Propósito superior" />
          <NumberCard label="Dia Natalício"      numero={diaNatalicio} sublabel="Dom de nascimento" />
        </div>
      </div>

      {harmonia && harmonia.status !== 'desconhecido' && (
        <Card title="Harmonia Numérica — Destino × Expressão">
          <div className={`flex items-start gap-3 p-3 rounded-xl border
            ${harmonia.status === 'favoravel'    ? 'bg-green-50 border-green-200'
            : harmonia.status === 'desfavoravel' ? 'bg-red-50 border-red-200'
            : 'bg-amber-50 border-amber-200'}`}>
            <span className="text-xl shrink-0">
              {harmonia.status === 'favoravel' ? '★' : harmonia.status === 'desfavoravel' ? '▲' : '◆'}
            </span>
            <div>
              <div className={`font-semibold text-sm
                ${harmonia.status === 'favoravel'    ? 'text-green-700'
                : harmonia.status === 'desfavoravel' ? 'text-red-700'
                : 'text-amber-700'}`}>
                {harmonia.status === 'favoravel' ? 'Favorável' : harmonia.status === 'desfavoravel' ? 'Desfavorável' : 'Neutro'}
              </div>
              <div className="text-gray-600 text-sm mt-1">{harmonia.descricao}</div>
            </div>
          </div>
          <p className="text-gray-400 text-xs mt-3">
            Indica se a vibração do seu Número de Expressão está em harmonia com o Número de Destino.
          </p>
        </Card>
      )}

      <div>
        <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-3">Momento Atual (2026)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <NumberCard label="Ano Pessoal"       numero={anoPessoal}       sublabel="Tema do ano" />
          <NumberCard label="Mês Pessoal"        numero={mesPessoal}       sublabel="Tema do mês (Mai)" />
          <NumberCard label="Tendência Oculta"   numero={tendenciaOculta}  sublabel="Energia dominante" />
        </div>
      </div>

      {dividasKarmicas.length > 0 && (
        <Card title="Dívidas Kármicas">
          <div className="space-y-2">
            {dividasKarmicas.map((d, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-100 border border-red-300 text-red-700 font-bold text-sm">
                  {d.numero}
                </span>
                <div>
                  <span className="text-red-700 font-medium">{d.descricao}</span>
                  <span className="text-gray-400 text-xs ml-2">({d.campo})</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {licoesKarmicas.length > 0 && (
        <Card title="Lições Kármicas (Números Ausentes)">
          <div className="flex flex-wrap gap-2">
            {licoesKarmicas.map(n => (
              <span key={n} className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-orange-100 border border-orange-300 text-orange-600 font-bold">
                {n}
              </span>
            ))}
          </div>
          <p className="text-gray-400 text-xs mt-2">
            Estes números estão ausentes no nome e representam qualidades a desenvolver nesta encarnação.
          </p>
        </Card>
      )}

      <Card title="Resposta Subconsciente">
        <div className="flex items-center gap-3">
          <Badge n={respostaSubconsciente} />
          <div>
            <div className="text-gray-900 font-semibold">{ARCANOS[respostaSubconsciente]?.nome || ''}</div>
            <div className="text-gray-500 text-sm">{ARCANOS[respostaSubconsciente]?.palavra_chave || ''}</div>
          </div>
        </div>
        <p className="text-gray-500 text-xs mt-2">Como você reage instintivamente sob pressão ou em situações imprevistas.</p>
      </Card>

      {coresFavoritas.length > 0 && (
        <Card title="Cores Favoráveis">
          <div className="flex flex-wrap gap-2">
            {coresFavoritas.map((cor, i) => (
              <span key={i} className="bg-gray-100 border border-gray-200 rounded-full px-3 py-1 text-gray-700 text-sm">{cor}</span>
            ))}
          </div>
        </Card>
      )}

      <div>
        <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-3">Ciclos de Vida</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {ciclos.map((c, i) => (
            <Card key={i}>
              <div className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">{c.label}</div>
              <div className="flex items-center gap-3 mb-2">
                <Badge n={c.numero} />
                <div>
                  <div className="text-gray-900 font-bold">{ARCANOS[c.numero]?.nome || ''}</div>
                  <div className="text-gray-500 text-sm">{ARCANOS[c.numero]?.palavra_chave || ''}</div>
                </div>
              </div>
              <div className="text-gray-400 text-xs">{c.inicio}–{c.fim !== null ? c.fim : '∞'} anos</div>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-3">Desafios</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {desafios.map((d, i) => (
            <Card key={i}>
              <div className="text-gray-500 text-xs font-semibold mb-2">{d.label}</div>
              <div className="flex items-center gap-2">
                <Badge n={d.numero} />
                <div className="text-gray-700 text-sm">{ARCANOS[d.numero]?.nome || d.numero}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-3">Momentos Decisivos (Pínaculos)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {momentosDecisivos.map((p, i) => (
            <Card key={i}>
              <div className="text-gray-500 text-xs font-semibold mb-2">{p.label}</div>
              <div className="flex items-center gap-2 mb-1">
                <Badge n={p.numero} />
                <div className="text-gray-900 font-bold">{ARCANOS[p.numero]?.nome || p.numero}</div>
              </div>
              <div className="text-gray-500 text-sm">{ARCANOS[p.numero]?.palavra_chave || ''}</div>
              <div className="text-gray-400 text-xs mt-1">{p.inicio}–{p.fim !== null ? p.fim : '∞'} anos</div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---- Tab: Pirâmide ----

function PiramideTab({ mapa }) {
  const { piramide, letrasNome, sequenciasNegativas, arcanoDominante } = mapa;

  if (!piramide || piramide.length === 0) {
    return <p className="text-gray-600 text-center">Pirâmide não disponível.</p>;
  }

  const seqStrs = sequenciasNegativas.map(s => s.sequencia);

  function isNegativo(linhaIdx, celIdx) {
    const linha = piramide[linhaIdx];
    for (const seq of seqStrs) {
      const len = seq.length;
      for (let start = Math.max(0, celIdx - len + 1); start <= celIdx; start++) {
        if (linha.slice(start, start + len).map(String).join('') === seq) return true;
      }
    }
    return false;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 text-center">Pirâmide Cabalística</h2>

      <Card>
        <div className="overflow-x-auto">
          <div className="space-y-2 py-4">
            <div className="flex justify-center gap-1 mb-1">
              {letrasNome.map((letra, i) => (
                <div key={i} className="flex flex-col items-center" style={{ minWidth: '2rem' }}>
                  <span className="text-gray-400 text-xs font-mono">{letra}</span>
                </div>
              ))}
            </div>
            {piramide.map((linha, linhaIdx) => (
              <div key={linhaIdx} className="flex justify-center gap-1">
                {linha.map((val, celIdx) => {
                  const neg = isNegativo(linhaIdx, celIdx);
                  const isRaizCel = linhaIdx === piramide.length - 1 && linha.length === 1;
                  return (
                    <div key={celIdx} className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold
                      ${isRaizCel
                        ? 'bg-purple-600 text-white ring-2 ring-purple-300'
                        : neg
                        ? 'bg-red-100 text-red-700 border border-red-300'
                        : linhaIdx === 0
                        ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                        : 'bg-gray-100 text-gray-800 border border-gray-200'}`}>
                      {val}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-3 mt-4 text-xs text-gray-500">
          <div className="flex items-center gap-1"><div className="w-4 h-4 bg-indigo-100 border border-indigo-200 rounded"></div><span>Base (letras)</span></div>
          <div className="flex items-center gap-1"><div className="w-4 h-4 bg-gray-100 border border-gray-200 rounded"></div><span>Intermediário</span></div>
          <div className="flex items-center gap-1"><div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div><span>Sequência negativa</span></div>
          <div className="flex items-center gap-1"><div className="w-4 h-4 bg-purple-600 ring-2 ring-purple-300 rounded"></div><span>Raiz (topo)</span></div>
        </div>
      </Card>

      {arcanoDominante && (
        <Card title="Arcano Dominante (Raiz da Pirâmide)">
          <ArcanoBadge numero={arcanoDominante.numero} />
          <p className="text-gray-500 text-xs mt-3 leading-relaxed">{arcanoDominante.arcano.positivo}</p>
        </Card>
      )}

      {sequenciasNegativas.length > 0 && (
        <Card title="Sequências Negativas Detectadas">
          <div className="space-y-2">
            {sequenciasNegativas.map((s, i) => (
              <div key={i} className="flex items-start gap-3 p-2 bg-red-50 border border-red-200 rounded-lg">
                <span className="text-red-600 font-bold text-sm font-mono">{s.sequencia}</span>
                <div>
                  <div className="text-red-700 text-sm">{s.significado}</div>
                  <div className="text-gray-400 text-xs">Linha {s.posicaoLinha + 1}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {sequenciasNegativas.length === 0 && (
        <div className="text-center text-green-700 bg-green-50 border border-green-200 rounded-xl p-4">
          Nenhuma sequência negativa detectada na pirâmide.
        </div>
      )}
    </div>
  );
}

// ---- Tab: Detalhes do Mapa ----

function DetalhesMapaTab({ mapa }) {
  const numeros = [
    { label: 'Motivação (Alma)',       numero: mapa.motivacao,             sublabel: 'O que move sua alma internamente' },
    { label: 'Impressão (Ego)',        numero: mapa.impressao,             sublabel: 'Como os outros te percebem' },
    { label: 'Expressão (Nome)',       numero: mapa.expressao,             sublabel: 'Potencial de expressão e missão' },
    { label: 'Destino',                numero: mapa.destino,               sublabel: 'Caminho kármico desta vida' },
    { label: 'Missão',                 numero: mapa.missao,                sublabel: 'Propósito superior' },
    { label: 'Dia Natalício',          numero: mapa.diaNatalicio,          sublabel: 'Dom especial de nascimento' },
    { label: 'Ano Pessoal',            numero: mapa.anoPessoal,            sublabel: 'Tema do ano atual' },
    { label: 'Tendência Oculta',       numero: mapa.tendenciaOculta,       sublabel: 'Energia dominante no nome' },
    { label: 'Resposta Subconsciente', numero: mapa.respostaSubconsciente, sublabel: 'Reação instintiva sob pressão' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 text-center">Detalhes do Mapa</h2>
      <p className="text-gray-500 text-center text-sm">Interpretações dos arcanos correspondentes aos seus números pessoais</p>
      <div className="space-y-4">
        {numeros.map(({ label, numero, sublabel }) => {
          const arcano = ARCANOS[numero] || ARCANOS[1];
          const isMaster = [11, 22, 33].includes(numero);
          return (
            <Card key={label}>
              <div className="flex items-start gap-4">
                <Badge n={numero} />
                <div className="flex-1">
                  <div className="text-gray-500 text-xs uppercase tracking-wider mb-0.5">{label}</div>
                  <div className="text-gray-900 font-bold text-lg leading-tight">{arcano.nome}</div>
                  <div className="text-gray-500 text-sm italic mb-1">{arcano.palavra_chave}</div>
                  <div className="text-gray-400 text-xs mb-3">{sublabel}</div>
                  <div className="space-y-2">
                    <div>
                      <span className="text-green-600 text-xs font-semibold uppercase tracking-wider">Aspectos Positivos</span>
                      <p className="text-gray-700 text-sm mt-1 leading-relaxed">{arcano.positivo}</p>
                    </div>
                    <div>
                      <span className="text-red-600 text-xs font-semibold uppercase tracking-wider">Aspectos Desafiadores</span>
                      <p className="text-gray-700 text-sm mt-1 leading-relaxed">{arcano.negativo}</p>
                    </div>
                    {isMaster && (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mt-2">
                        <span className="text-amber-600 text-xs font-semibold">★ Número Mestre</span>
                        <p className="text-gray-600 text-xs mt-1">Vibração elevada com responsabilidade espiritual maior.</p>
                      </div>
                    )}
                    {arcano.divida_karmica && (
                      <div className="bg-red-50 border border-red-200 rounded-xl p-3 mt-2">
                        <span className="text-red-600 text-xs font-semibold">⚠ Dívida Kármica</span>
                        {arcano.nota && <p className="text-gray-600 text-xs mt-1">{arcano.nota}</p>}
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
  const numColor = n => [11,22,33].includes(n) ? 'text-purple-700 font-bold' : 'text-gray-900 font-bold';

  const FigBox = ({ title, children, className = '' }) => (
    <div className={`bg-white border border-gray-200 rounded-2xl p-4 shadow-sm ${className}`}>
      {title && <div className="text-gray-500 text-xs font-bold uppercase tracking-wider border-b border-gray-200 pb-1.5 mb-3">{title}</div>}
      {children}
    </div>
  );

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 text-center">Gráfico Numerológico</h2>

      <FigBox title={`Fig. A — ${nome.toUpperCase()}`}>
        <div className="overflow-x-auto">
          <table className="border-collapse text-center mx-auto text-xs">
            <tbody>
              <tr>
                <td className="text-right pr-2 text-gray-500 font-semibold whitespace-nowrap py-0.5">Vogais</td>
                {breakdown.flatMap((word, wi) => [
                  ...word.letras.map((l, li) => (
                    <td key={`v-${wi}-${li}`} className="border border-gray-200 w-6 h-6">
                      {l.isVogal && <span className="text-green-700 font-bold">{l.valor}</span>}
                    </td>
                  )),
                  <td key={`vs-${wi}`} className="border border-gray-300 bg-gray-100 w-8 h-6 text-green-700 font-bold px-1">{word.somaVogais || ''}</td>,
                ])}
              </tr>
              <tr>
                <td className="text-right pr-2 text-gray-500 font-semibold whitespace-nowrap py-0.5">Nome</td>
                {breakdown.flatMap((word, wi) => [
                  ...word.letras.map((l, li) => (
                    <td key={`n-${wi}-${li}`} className="border border-gray-300 w-6 h-8 font-bold text-gray-900">{l.letra}</td>
                  )),
                  <td key={`ns-${wi}`} className="border border-gray-300 bg-gray-100 w-8 h-8"></td>,
                ])}
              </tr>
              <tr>
                <td className="text-right pr-2 text-gray-500 font-semibold whitespace-nowrap py-0.5">Consoante</td>
                {breakdown.flatMap((word, wi) => [
                  ...word.letras.map((l, li) => (
                    <td key={`c-${wi}-${li}`} className="border border-gray-200 w-6 h-6">
                      {!l.isVogal && <span className="text-blue-700 font-bold">{l.valor}</span>}
                    </td>
                  )),
                  <td key={`cs-${wi}`} className="border border-gray-300 bg-gray-100 w-8 h-6 text-blue-700 font-bold px-1">{word.somaConsoantes || ''}</td>,
                ])}
              </tr>
              <tr>
                <td className="text-right pr-2 text-gray-500 font-semibold whitespace-nowrap py-0.5">TOTAL</td>
                {breakdown.flatMap((word, wi) => [
                  ...word.letras.map((_, li) => (
                    <td key={`t-${wi}-${li}`} className="border border-gray-100 w-6 h-6 bg-gray-50"></td>
                  )),
                  <td key={`ts-${wi}`} className="border border-gray-300 bg-gray-100 w-8 h-6 text-amber-700 font-bold px-1">{word.somaTotal}</td>,
                ])}
              </tr>
            </tbody>
          </table>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-4">
          {[
            { label: 'N° de Motivação', valor: motivacao },
            { label: 'N° de Impressão', valor: impressao },
            { label: 'N° de Expressão', valor: expressao },
          ].map(({ label, valor }) => (
            <div key={label} className="border border-gray-200 rounded-xl p-3 text-center bg-gray-50">
              <div className="text-gray-500 text-xs mb-1">{label}</div>
              <div className={`text-2xl ${numColor(valor)}`}>{valor}</div>
            </div>
          ))}
        </div>
      </FigBox>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FigBox title="Fig. B — Lições Kármicas">
          <div className="grid grid-cols-5 gap-1">
            {[1,2,3,4,5,6,7,8,9].map(n => (
              <div key={n} className={`h-8 flex items-center justify-center rounded border text-xs font-bold
                ${licoesKarmicas.includes(n) ? 'bg-orange-100 border-orange-300 text-orange-600' : 'bg-gray-50 border-gray-200 text-gray-300'}`}>
                {n}
              </div>
            ))}
          </div>
          <p className="text-gray-400 text-xs mt-2">Destacado = ausente no nome</p>
        </FigBox>

        <FigBox>
          <div className="text-gray-500 text-xs font-bold uppercase tracking-wider border-b border-gray-200 pb-1.5 mb-3">Fig. C — Tendências Ocultas</div>
          <div className="flex items-center gap-3 mb-4"><Badge n={tendenciaOculta} /><span className="text-gray-700 text-sm">Tendência Oculta</span></div>
          <div className="text-gray-500 text-xs font-bold uppercase tracking-wider border-b border-gray-200 pb-1.5 mb-3">Fig. D — Resp. Subconsciente</div>
          <div className="flex items-center gap-3"><Badge n={respostaSubconsciente} /><span className="text-gray-700 text-sm">Reação Instintiva</span></div>
        </FigBox>

        <FigBox title="Fig. E — Destino e Missão">
          {dividasKarmicas.length > 0 && (
            <div className="mb-3">
              <div className="text-red-600 text-xs font-semibold mb-1">Dívidas Kármicas</div>
              <div className="flex flex-wrap gap-1">
                {dividasKarmicas.map((d, i) => (
                  <span key={i} className="bg-red-50 border border-red-200 rounded px-2 py-0.5 text-red-600 text-xs font-bold">{d.numero}</span>
                ))}
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div className="border border-gray-200 rounded-xl p-3 text-center bg-gray-50">
              <div className="text-gray-500 text-xs mb-1">N° de Destino</div>
              <div className={`text-2xl ${numColor(destino)}`}>{destino}</div>
            </div>
            <div className="border border-gray-200 rounded-xl p-3 text-center bg-gray-50">
              <div className="text-gray-500 text-xs mb-1">Missão</div>
              <div className={`text-2xl ${numColor(missao)}`}>{missao}</div>
            </div>
          </div>
          <div className="border border-gray-200 rounded-xl p-3 text-center bg-gray-50 mt-3">
            <div className="text-gray-500 text-xs mb-1">Dia Natalício</div>
            <div className={`text-2xl ${numColor(diaNatalicio)}`}>{diaNatalicio}</div>
          </div>
        </FigBox>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FigBox title="Fig. F — Ciclos de Vida">
          {ciclos.map((c, i) => (
            <div key={i} className="flex items-center gap-3 mb-3 last:mb-0">
              <span className={`text-2xl w-8 ${numColor(c.numero)}`}>{c.numero}</span>
              <span className="text-gray-500 text-xs">{c.inicio}–{c.fim != null ? c.fim : '∞'} anos</span>
            </div>
          ))}
        </FigBox>
        <FigBox title="Fig. G — Momentos Decisivos">
          {momentosDecisivos.map((p, i) => (
            <div key={i} className="flex items-center gap-3 mb-3 last:mb-0">
              <span className={`text-2xl w-8 ${numColor(p.numero)}`}>{p.numero}</span>
              <span className="text-gray-500 text-xs">{p.inicio}–{p.fim != null ? p.fim : '∞'} anos</span>
            </div>
          ))}
        </FigBox>
        <FigBox title="Fig. H — Desafios">
          {desafios.map((d, i) => (
            <div key={i} className="flex items-center gap-3 mb-3 last:mb-0">
              <span className="text-2xl font-bold text-gray-900 w-8">{d.numero}</span>
              <span className="text-gray-500 text-xs">{d.label}</span>
            </div>
          ))}
        </FigBox>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FigBox title="Total de Letras em Cada Número">
          <div className="grid grid-cols-9 gap-px">
            {[1,2,3,4,5,6,7,8,9].map(n => (
              <div key={n} className="text-center">
                <div className="text-gray-400 text-xs border-b border-gray-200 pb-0.5 mb-1">{n}</div>
                <div className={`text-sm font-bold ${freqLetras[n] === 0 ? 'text-gray-200' : 'text-gray-800'}`}>
                  {freqLetras[n] === 0 ? '∅' : freqLetras[n]}
                </div>
              </div>
            ))}
          </div>
        </FigBox>
        <FigBox title="Números Harmônicos">
          <div className="flex flex-wrap gap-1.5">
            {numHarm.map(n => (
              <span key={n} className="w-8 h-8 flex items-center justify-center rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-sm font-bold">{n}</span>
            ))}
          </div>
          <p className="text-gray-400 text-xs mt-2">Baseado na Expressão ({expressao})</p>
        </FigBox>
        <FigBox title="Dias do Mês Favoráveis">
          <div className="flex flex-wrap gap-1">
            {diasFavoraveis.map(d => (
              <span key={d} className="w-7 h-7 flex items-center justify-center rounded border border-green-300 bg-green-50 text-green-700 text-xs font-bold">{d}</span>
            ))}
            {diasFavoraveis.length === 0 && <span className="text-gray-400 text-xs">Nenhum no mês atual</span>}
          </div>
          <div className="border-t border-gray-200 pt-2 mt-2 space-y-0.5">
            <div className="text-gray-500 text-xs">Ano Pessoal: <span className={numColor(anoPessoal)}>{anoPessoal}</span></div>
            <div className="text-gray-500 text-xs">Mês Pessoal: <span className={numColor(mesPessoal)}>{mesPessoal}</span></div>
            <div className="text-gray-500 text-xs">Dia Pessoal: <span className={numColor(diaPessoal)}>{diaPessoal}</span></div>
          </div>
        </FigBox>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {coresFavoritas.length > 0 && (
          <FigBox title="Cores Favoráveis">
            <div className="flex flex-wrap gap-2">
              {coresFavoritas.map((cor, i) => (
                <span key={i} className="bg-gray-100 border border-gray-200 rounded-full px-3 py-1 text-gray-700 text-sm">{cor}</span>
              ))}
            </div>
          </FigBox>
        )}
        {harmonia && harmonia.status !== 'desconhecido' && (
          <FigBox title="Harmonia Numérica (Destino × Expressão)">
            <div className={`p-3 rounded-xl border text-sm
              ${harmonia.status === 'favoravel'    ? 'bg-green-50 border-green-200 text-green-700'
              : harmonia.status === 'desfavoravel' ? 'bg-red-50 border-red-200 text-red-700'
              : 'bg-amber-50 border-amber-200 text-amber-700'}`}>
              <div className="font-bold mb-1">
                {harmonia.status === 'favoravel' ? '★ Favorável' : harmonia.status === 'desfavoravel' ? '▲ Desfavorável' : '◆ Neutro'}
              </div>
              {harmonia.descricao}
            </div>
          </FigBox>
        )}
      </div>
    </div>
  );
}

// ---- Tab: Imprimir Mapa Completo ----

function ImprimirTab({ mapa }) {
  const {
    nome, dataStr,
    motivacao, impressao, expressao, destino, missao, diaNatalicio,
    anoPessoal, mesPessoal,
    licoesKarmicas, tendenciaOculta, respostaSubconsciente,
    dividasKarmicas, coresFavoritas, ciclos, desafios, momentosDecisivos,
    harmonia, breakdown, freqLetras, diasFavoraveis,
  } = mapa;

  const numHarm = numerosHarmonicos(expressao);
  const isMaster = n => [11, 22, 33].includes(n);
  const nc = n => isMaster(n) ? 'text-purple-700' : 'text-gray-900';

  const SecTitle = ({ children }) => (
    <div className="font-bold text-xs uppercase tracking-widest text-gray-500 border-b border-gray-300 pb-1 mb-2 mt-4 first:mt-0">
      {children}
    </div>
  );

  const numerosInterpretacao = [
    { label: 'Motivação (Alma)',       numero: motivacao },
    { label: 'Impressão (Ego)',        numero: impressao },
    { label: 'Expressão (Nome)',       numero: expressao },
    { label: 'Destino',                numero: destino },
    { label: 'Missão',                 numero: missao },
    { label: 'Dia Natalício',          numero: diaNatalicio },
    { label: 'Ano Pessoal',            numero: anoPessoal },
    { label: 'Tendência Oculta',       numero: tendenciaOculta },
    { label: 'Resp. Subconsciente',    numero: respostaSubconsciente },
  ];

  return (
    <div className="space-y-6">
      {/* Botão imprimir */}
      <div className="no-print flex justify-center">
        <button
          onClick={() => window.print()}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-xl flex items-center gap-2 shadow-md transition-all"
        >
          🖨 Imprimir / Salvar PDF
        </button>
      </div>

      {/* Conteúdo imprimível */}
      <div id="print-root" className="bg-white text-black rounded-2xl p-6 sm:p-8 max-w-4xl mx-auto shadow-xl print:shadow-none print:rounded-none print:p-4">

        {/* Cabeçalho */}
        <div className="text-center border-b-2 border-gray-800 pb-4 mb-5">
          <div className="text-xs uppercase tracking-widest text-gray-500 mb-1">Gráfico Numerológico Cabalístico — ABNC</div>
          <div className="text-2xl font-bold text-gray-900">{nome.toUpperCase()}</div>
          <div className="text-gray-600 text-sm mt-1">Nascimento: {dataStr}</div>
        </div>

        {/* === PÁGINA 1: GRÁFICO === */}

        {/* Fig. A */}
        <SecTitle>Fig. A — Tabela do Nome</SecTitle>
        <div className="overflow-x-auto mb-4">
          <table className="border-collapse text-center mx-auto text-xs">
            <tbody>
              <tr>
                <td className="text-right pr-2 text-gray-500 font-semibold whitespace-nowrap py-0.5">Vogais</td>
                {breakdown.flatMap((word, wi) => [
                  ...word.letras.map((l, li) => (
                    <td key={`v-${wi}-${li}`} className="border border-gray-300 w-6 h-6">
                      {l.isVogal && <span className="font-bold text-gray-700">{l.valor}</span>}
                    </td>
                  )),
                  <td key={`vs-${wi}`} className="border border-gray-400 bg-gray-100 w-8 h-6 font-bold text-gray-800 px-1">{word.somaVogais || ''}</td>,
                ])}
              </tr>
              <tr>
                <td className="text-right pr-2 text-gray-500 font-semibold whitespace-nowrap py-0.5">Nome</td>
                {breakdown.flatMap((word, wi) => [
                  ...word.letras.map((l, li) => (
                    <td key={`n-${wi}-${li}`} className="border border-gray-400 w-6 h-8 font-bold text-gray-900">{l.letra}</td>
                  )),
                  <td key={`ns-${wi}`} className="border border-gray-400 bg-gray-100 w-8 h-8"></td>,
                ])}
              </tr>
              <tr>
                <td className="text-right pr-2 text-gray-500 font-semibold whitespace-nowrap py-0.5">Consoante</td>
                {breakdown.flatMap((word, wi) => [
                  ...word.letras.map((l, li) => (
                    <td key={`c-${wi}-${li}`} className="border border-gray-300 w-6 h-6">
                      {!l.isVogal && <span className="font-bold text-gray-700">{l.valor}</span>}
                    </td>
                  )),
                  <td key={`cs-${wi}`} className="border border-gray-400 bg-gray-100 w-8 h-6 font-bold text-gray-800 px-1">{word.somaConsoantes || ''}</td>,
                ])}
              </tr>
              <tr>
                <td className="text-right pr-2 text-gray-500 font-semibold whitespace-nowrap py-0.5">TOTAL</td>
                {breakdown.flatMap((word, wi) => [
                  ...word.letras.map((_, li) => (
                    <td key={`t-${wi}-${li}`} className="border border-gray-200 w-6 h-6 bg-gray-50"></td>
                  )),
                  <td key={`ts-${wi}`} className="border border-gray-400 bg-gray-200 w-8 h-6 font-bold text-gray-900 px-1">{word.somaTotal}</td>,
                ])}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Números principais */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { label: 'N° de Motivação', valor: motivacao },
            { label: 'N° de Impressão', valor: impressao },
            { label: 'N° de Expressão', valor: expressao },
          ].map(({ label, valor }) => (
            <div key={label} className="border-2 border-gray-300 rounded-lg p-3 text-center">
              <div className="text-gray-500 text-xs mb-1">{label}</div>
              <div className={`text-3xl font-bold ${isMaster(valor) ? 'text-purple-700' : 'text-gray-900'}`}>{valor}</div>
            </div>
          ))}
        </div>

        {/* Tabela numérica */}
        <div className="grid grid-cols-2 gap-x-8 mb-4">
          <table className="text-sm w-full">
            <tbody>
              {[
                { label: 'N° de Destino',      val: destino },
                { label: 'Missão',              val: missao },
                { label: 'Dia Natalício',       val: diaNatalicio },
                { label: 'Tendência Oculta',    val: tendenciaOculta },
                { label: 'Resp. Subconsciente', val: respostaSubconsciente },
              ].map(({ label, val }) => (
                <tr key={label} className="border-b border-gray-200">
                  <td className="py-1 pr-3 text-gray-500 text-xs font-semibold uppercase tracking-wide">{label}</td>
                  <td className={`py-1 font-bold text-lg ${isMaster(val) ? 'text-purple-700' : 'text-gray-900'}`}>{val}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <table className="text-sm w-full">
            <tbody>
              {[
                { label: 'Ano Pessoal', val: anoPessoal, sub: '2026' },
                { label: 'Mês Pessoal', val: mesPessoal, sub: 'Maio' },
              ].map(({ label, val, sub }) => (
                <tr key={label} className="border-b border-gray-200">
                  <td className="py-1 pr-3 text-gray-500 text-xs font-semibold uppercase tracking-wide">{label}</td>
                  <td className={`py-1 font-bold text-lg ${isMaster(val) ? 'text-purple-700' : 'text-gray-900'}`}>{val}</td>
                  {sub && <td className="py-1 pl-2 text-gray-400 text-xs">{sub}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Fig B + C/D + E */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="border border-gray-200 rounded-lg p-3">
            <SecTitle>Fig. B — Lições Kármicas</SecTitle>
            <div className="flex flex-wrap gap-1">
              {[1,2,3,4,5,6,7,8,9].map(n => (
                <span key={n} className={`w-7 h-7 flex items-center justify-center rounded border text-xs font-bold
                  ${licoesKarmicas.includes(n) ? 'border-orange-500 text-orange-600 bg-orange-50' : 'border-gray-200 text-gray-300'}`}>{n}</span>
              ))}
            </div>
          </div>
          <div className="border border-gray-200 rounded-lg p-3">
            <SecTitle>Fig. C/D</SecTitle>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-8 h-8 flex items-center justify-center rounded-full bg-purple-100 border-2 border-purple-300 font-bold text-purple-800">{tendenciaOculta}</span>
              <span className="text-gray-600 text-xs">Tendência Oculta</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 border-2 border-gray-300 font-bold text-gray-700">{respostaSubconsciente}</span>
              <span className="text-gray-600 text-xs">Resp. Subconsciente</span>
            </div>
          </div>
          <div className="border border-gray-200 rounded-lg p-3">
            <SecTitle>Fig. E</SecTitle>
            {dividasKarmicas.length > 0 && (
              <div className="mb-2">
                <div className="text-red-600 text-xs font-semibold mb-1">Dívidas Kármicas</div>
                <div className="flex gap-1">
                  {dividasKarmicas.map((d, i) => (
                    <span key={i} className="px-2 py-0.5 bg-red-50 border border-red-300 rounded text-red-600 text-xs font-bold">{d.numero}</span>
                  ))}
                </div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-2">
              <div className="text-center"><div className="text-gray-400 text-xs">Destino</div><div className={`text-2xl font-bold ${nc(destino)}`}>{destino}</div></div>
              <div className="text-center"><div className="text-gray-400 text-xs">Missão</div><div className={`text-2xl font-bold ${nc(missao)}`}>{missao}</div></div>
            </div>
          </div>
        </div>

        {/* Fig F + G + H */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="border border-gray-200 rounded-lg p-3">
            <SecTitle>Fig. F — Ciclos</SecTitle>
            {ciclos.map((c, i) => (
              <div key={i} className="flex items-baseline gap-2 mb-1">
                <span className={`text-xl font-bold ${nc(c.numero)}`}>{c.numero}</span>
                <span className="text-gray-400 text-xs">{c.inicio}–{c.fim != null ? c.fim : '∞'} anos</span>
              </div>
            ))}
          </div>
          <div className="border border-gray-200 rounded-lg p-3">
            <SecTitle>Fig. G — Momentos</SecTitle>
            {momentosDecisivos.map((p, i) => (
              <div key={i} className="flex items-baseline gap-2 mb-1">
                <span className={`text-xl font-bold ${nc(p.numero)}`}>{p.numero}</span>
                <span className="text-gray-400 text-xs">{p.inicio}–{p.fim != null ? p.fim : '∞'} anos</span>
              </div>
            ))}
          </div>
          <div className="border border-gray-200 rounded-lg p-3">
            <SecTitle>Fig. H — Desafios</SecTitle>
            {desafios.map((d, i) => (
              <div key={i} className="flex items-baseline gap-2 mb-1">
                <span className="text-xl font-bold text-gray-900">{d.numero}</span>
                <span className="text-gray-400 text-xs">{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Freq + Harmônicos + Dias */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="border border-gray-200 rounded-lg p-3">
            <SecTitle>Letras p/ Número</SecTitle>
            <div className="grid grid-cols-9 gap-px">
              {[1,2,3,4,5,6,7,8,9].map(n => (
                <div key={n} className="text-center">
                  <div className="text-gray-400 text-xs border-b border-gray-200 pb-0.5 mb-0.5">{n}</div>
                  <div className={`text-sm font-bold ${freqLetras[n] === 0 ? 'text-gray-200' : 'text-gray-800'}`}>
                    {freqLetras[n] === 0 ? '∅' : freqLetras[n]}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="border border-gray-200 rounded-lg p-3">
            <SecTitle>Números Harmônicos</SecTitle>
            <div className="flex flex-wrap gap-1">
              {numHarm.map(n => (
                <span key={n} className="w-7 h-7 flex items-center justify-center rounded-full border-2 border-purple-300 text-purple-700 text-xs font-bold bg-purple-50">{n}</span>
              ))}
            </div>
            <p className="text-gray-400 text-xs mt-1">Expressão: {expressao}</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-3">
            <SecTitle>Dias Favoráveis</SecTitle>
            <div className="flex flex-wrap gap-1">
              {diasFavoraveis.map(d => (
                <span key={d} className="w-7 h-7 flex items-center justify-center rounded border border-green-400 text-green-700 text-xs font-bold bg-green-50">{d}</span>
              ))}
              {diasFavoraveis.length === 0 && <span className="text-gray-400 text-xs">—</span>}
            </div>
          </div>
        </div>

        {/* Cores + Harmonia */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {coresFavoritas.length > 0 && (
            <div className="border border-gray-200 rounded-lg p-3">
              <SecTitle>Cores Favoráveis</SecTitle>
              <div className="flex flex-wrap gap-1">
                {coresFavoritas.map((cor, i) => (
                  <span key={i} className="border border-gray-300 rounded-full px-2 py-0.5 text-gray-700 text-xs">{cor}</span>
                ))}
              </div>
            </div>
          )}
          {harmonia && harmonia.status !== 'desconhecido' && (
            <div className={`border rounded-lg p-3
              ${harmonia.status === 'favoravel' ? 'border-green-300 bg-green-50' :
                harmonia.status === 'desfavoravel' ? 'border-red-300 bg-red-50' : 'border-amber-300 bg-amber-50'}`}>
              <SecTitle>Harmonia Numérica</SecTitle>
              <div className={`font-bold text-sm ${harmonia.status === 'favoravel' ? 'text-green-700' : harmonia.status === 'desfavoravel' ? 'text-red-700' : 'text-amber-700'}`}>
                {harmonia.status === 'favoravel' ? '★ Favorável' : harmonia.status === 'desfavoravel' ? '▲ Desfavorável' : '◆ Neutro'}
              </div>
              <p className="text-gray-600 text-xs mt-1">{harmonia.descricao}</p>
            </div>
          )}
        </div>

        {/* === QUEBRA DE PÁGINA === */}
        <div className="border-t-2 border-dashed border-gray-400 my-6 print:break-before-page"></div>

        {/* === PÁGINA 2: INTERPRETAÇÕES === */}
        <div className="text-center mb-5">
          <div className="text-xs uppercase tracking-widest text-gray-500 mb-1">Interpretações dos Números Pessoais</div>
          <div className="text-xl font-bold text-gray-900">{nome.toUpperCase()}</div>
        </div>

        <div className="space-y-4">
          {numerosInterpretacao.map(({ label, numero }) => {
            const arcano = ARCANOS[numero] || ARCANOS[1];
            const isM = [11, 22, 33].includes(numero);
            return (
              <div key={label} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <span className={`inline-flex items-center justify-center w-9 h-9 rounded-full text-base font-bold shrink-0 shadow-sm
                    ${isM ? 'bg-amber-400 text-amber-950' : 'bg-purple-600 text-white'}`}>
                    {numero}
                  </span>
                  <div className="flex-1">
                    <div className="text-gray-400 text-xs uppercase tracking-wider">{label}</div>
                    <div className="text-gray-900 font-bold">{arcano.nome}</div>
                    <div className="text-gray-500 text-xs italic mb-2">{arcano.palavra_chave}</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                      <div>
                        <span className="text-green-600 text-xs font-semibold uppercase">Positivo: </span>
                        <span className="text-gray-700 text-xs">{arcano.positivo}</span>
                      </div>
                      <div>
                        <span className="text-red-600 text-xs font-semibold uppercase">Desafiador: </span>
                        <span className="text-gray-700 text-xs">{arcano.negativo}</span>
                      </div>
                    </div>
                    {isM && (
                      <div className="mt-1 text-xs text-amber-600 font-semibold">★ Número Mestre — vibração elevada, nunca reduzir</div>
                    )}
                    {arcano.divida_karmica && (
                      <div className="mt-1 text-xs text-red-600 font-semibold">⚠ Dívida Kármica{arcano.nota ? ` — ${arcano.nota}` : ''}</div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Ciclos com descrição */}
        <div className="mt-5">
          <SecTitle>Ciclos de Vida — Interpretação</SecTitle>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {ciclos.map((c, i) => {
              const arcano = ARCANOS[c.numero] || ARCANOS[1];
              return (
                <div key={i} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`font-bold text-lg ${nc(c.numero)}`}>{c.numero}</span>
                    <span className="text-gray-500 text-xs font-semibold">{c.label}</span>
                  </div>
                  <div className="text-gray-400 text-xs mb-1">{c.inicio}–{c.fim != null ? c.fim : '∞'} anos</div>
                  <div className="text-gray-900 text-xs font-semibold">{arcano.nome}</div>
                  <p className="text-gray-600 text-xs mt-0.5 leading-relaxed">{arcano.positivo}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Momentos decisivos com descrição */}
        <div className="mt-5">
          <SecTitle>Momentos Decisivos — Interpretação</SecTitle>
          <div className="grid grid-cols-2 gap-3">
            {momentosDecisivos.map((p, i) => {
              const arcano = ARCANOS[p.numero] || ARCANOS[1];
              return (
                <div key={i} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`font-bold text-lg ${nc(p.numero)}`}>{p.numero}</span>
                    <span className="text-gray-500 text-xs font-semibold">{p.label}</span>
                  </div>
                  <div className="text-gray-400 text-xs mb-1">{p.inicio}–{p.fim != null ? p.fim : '∞'} anos</div>
                  <div className="text-gray-900 text-xs font-semibold">{arcano.nome}</div>
                  <p className="text-gray-600 text-xs mt-0.5 leading-relaxed">{arcano.positivo}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Rodapé */}
        <div className="text-center text-gray-400 text-xs mt-6 pt-4 border-t border-gray-200">
          Gerado por Zenaide — Numerologia Cabalística (ABNC) • {dataStr}
        </div>
      </div>
    </div>
  );
}

// ---- Tab: 9 Arcanos ----

function ArcanosNoveTab({ mapa }) {
  const { arcanos9 } = mapa;
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 text-center">Método dos 9 Arcanos</h2>
      <p className="text-gray-500 text-center text-sm">As 9 forças arquetípicas que moldam sua jornada</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {arcanos9.map((pos, i) => (
          <Card key={i} className="relative">
            <div className="absolute top-3 right-3 text-gray-200 font-bold text-3xl">{i + 1}</div>
            <div className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-3">{pos.label}</div>
            <div className="flex items-center gap-3 mb-3">
              <Badge n={pos.valor} />
              <div>
                <div className="text-gray-900 font-bold">{pos.arcano.nome}</div>
                <div className="text-gray-500 text-sm italic">{pos.arcano.palavra_chave}</div>
              </div>
            </div>
            <div className="text-gray-500 text-xs leading-relaxed">{pos.arcano.positivo}</div>
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

  function getArcanoIdx(n) {
    if (n === 33) return 22;
    return ARCANOS[n] ? n : n;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 text-center">Interpretações dos Arcanos</h2>
      <div className="space-y-2">
        {nums.map(n => {
          const arcano = ARCANOS[getArcanoIdx(n)] || {};
          const isMaster = [11, 22, 33].includes(n);
          const isOpen = aberto === n;
          return (
            <div key={n} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              <button
                className="w-full flex items-center gap-4 p-4 text-left hover:bg-gray-50 transition-colors"
                onClick={() => setAberto(isOpen ? null : n)}
              >
                <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-lg font-bold shrink-0
                  ${isMaster ? 'bg-amber-400 text-amber-950' : 'bg-purple-600 text-white'}`}>
                  {n}
                </span>
                <div className="flex-1">
                  <div className="text-gray-900 font-semibold">{arcano.nome || `Número ${n}`}</div>
                  <div className="text-gray-500 text-sm italic">{arcano.palavra_chave || ''}</div>
                </div>
                <span className="text-gray-400 text-lg">{isOpen ? '▲' : '▼'}</span>
              </button>
              {isOpen && (
                <div className="px-4 pb-4 space-y-3 border-t border-gray-100 pt-4">
                  <div>
                    <span className="text-green-600 text-xs font-semibold uppercase tracking-wider">Aspectos Positivos</span>
                    <p className="text-gray-700 text-sm mt-1">{arcano.positivo || ''}</p>
                  </div>
                  <div>
                    <span className="text-red-600 text-xs font-semibold uppercase tracking-wider">Aspectos Desafiadores</span>
                    <p className="text-gray-700 text-sm mt-1">{arcano.negativo || ''}</p>
                  </div>
                  {isMaster && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                      <span className="text-amber-600 text-xs font-semibold uppercase tracking-wider">Número Mestre</span>
                      <p className="text-gray-600 text-sm mt-1">
                        Os números mestres carregam vibração elevada e responsabilidade espiritual maior. Nunca devem ser reduzidos.
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
  { id: 'imprimir',       label: '🖨 Imprimir' },
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

  const tabsVisiveis = mapa ? TABS : TABS.filter(t => t.id === 'home' || t.id === 'interpretacoes');

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="no-print sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center gap-2 py-2">
            <span className="text-purple-600 font-bold text-sm hidden sm:block">✦</span>
            <span className="text-gray-700 text-sm font-medium hidden sm:block">Numerologia Cabalística</span>
            {mapa && <span className="text-gray-400 text-xs hidden sm:block">— {mapa.nome}</span>}
          </div>
          <nav className="flex gap-1 overflow-x-auto pb-2">
            {tabsVisiveis.map(tab => (
              <button
                key={tab.id}
                onClick={() => setTabAtiva(tab.id)}
                className={`whitespace-nowrap px-3 py-2 rounded-lg text-sm font-medium transition-all
                  ${tabAtiva === tab.id
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {erroGlobal && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
            {erroGlobal}
          </div>
        )}
        {tabAtiva === 'home'           && <HomeTab onSubmit={handleSubmit} />}
        {tabAtiva === 'mapa'           && mapa && <MapaCompletoTab mapa={mapa} />}
        {tabAtiva === 'grafico'        && mapa && <GraficoTab mapa={mapa} />}
        {tabAtiva === 'detalhes'       && mapa && <DetalhesMapaTab mapa={mapa} />}
        {tabAtiva === 'piramide'       && mapa && <PiramideTab mapa={mapa} />}
        {tabAtiva === 'arcanos9'       && mapa && <ArcanosNoveTab mapa={mapa} />}
        {tabAtiva === 'imprimir'       && mapa && <ImprimirTab mapa={mapa} />}
        {tabAtiva === 'interpretacoes' && <InterpretacoesTab />}
      </main>

      <footer className="no-print text-center py-8 text-gray-400 text-xs border-t border-gray-200 mt-4">
        <div>Zenaide — Numerologia Cabalística</div>
        {mapa && (
          <div className="mt-1">Tabela: {mapa.tabela === 'abnc' ? 'ABNC (Cabalística)' : 'Ciclo 1-9 (Pitagórica)'}</div>
        )}
      </footer>
    </div>
  );
}
