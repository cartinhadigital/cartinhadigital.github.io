import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

/* =========================================================
   ✦ EDITE AQUI ✦
   Tudo o que você precisa mudar para personalizar a carta
   está nas constantes COLORS, AUDIO, TEXT e MEMORIES abaixo.
   ========================================================= */

// 🎨 Cores (formato hexadecimal). Mude livremente.
const COLORS = {
  bg: "#f3e7d9",
  bg2: "#f7d4d4",
  envelope: "#f3a6a6",        // vermelho pastel
  envelopeShadow: "#c97676",
  paper: "#fdf6ec",
  paperEdge: "#ead9bf",
  ink: "#5b3a29",
  accent: "#e26a6a",
};

// 🔊 Áudios — coloque os arquivos na pasta /public e use o caminho "/nome.mp3"
//    Deixe string vazia "" para desativar.
const AUDIO = {
  // Toca uma vez quando a carta é aberta:
  openSfx: "/abrir.mp3",
  // Toca em loop como música de fundo:
  music: "",
};

// ✍️ Textos da carta. Pode escrever quanto quiser — o papel se estica sozinho.
const TEXT = {
  hint: "toque no envelope para abrir",
  salutation: "Para você, minha moreninha,",
  body: `Como você sabe, eu não sou muito bom com cartas mas essa vai do fundo do meu coração, assim como minha primeira carta.

Hoje é dia 10 de junho e eu estou aqui digitando uma carta para minha moreninha que eu tanto amo, e pra ser sincero estou bastante ansioso pra te entregar tudo pronto para ver como você vai reagir...

Se você soubesse o tanto que sou apaixonado por ti, sua mente entraria em colapso, sabia? Tudo que eu faço nos dias de hoje é basicamente por você, você é minha motivação e minha vontade de vencer, eu quero tanto crescer junto com você e ter nossa família...
Eu posso até vez ou outra parecer que não quero isso, mas eu digo pra você que eu realmente quero isso, eu quero um menininho ou uma menininha com o cabelo que eu tanto amo nesse mundo...

Saiba que você também é tudo que eu sempre quis, eu sempre te quis e mal sabia o quão eu precisava de você diariamente, o quanto eu precisava me sentir amado verdadeiramente... E eu me sinto amado verdadeiramente por você.

Eu queria que essa carta nunca acabasse, do mesmo jeito que eu queria que o tempo com você nunca acabasse. Por mim eu escreveria linhas infinitas contando tudo o que eu sinto por você...

Quero te dar um recado: eu te amo. Hoje, amanhã, e em todos os pequenos dias entre eles.`,
  signature: "— seu, sempre",
  memoriesTitle: "algumas das nossas memórias",
  footerNote: "feito só pra você, minha cacheadinha ♡",
};

type Extra =
  | { type: "list"; title: string; items: string[] }
  | { type: "promise"; title: string; text: string }
  | { type: "gift"; title: string; text: string }
  | { type: "quote"; text: string };

// 📜 Itens extras dentro da carta (opcional). Adicione/remova à vontade.
const EXTRAS: Extra[] = [
  {
    type: "list",
    title: "pequenas coisas que eu amo em você",
    items: [
      "amo o jeito que você me trás segurança",
      "como você lembra de todos os detalhes",
      "eu amo você quando você é você mesma",
      "o seu cheiro",
      "o seu cabelo",
    ],
  },
  {
    type: "promise",
    title: "minha promessa",
    text: "te escolher todos os dias, mesmo nos dias mais difíceis, mesmo quando tudo estiver pesado, porque no fim é você que eu quero pra minha vida.",
  },
  {
    type: "gift",
    title: "um presentinho escondido aqui ♡",
    text: "abra esta carta sempre que precisar lembrar do quanto é amada.",
  },
];

/* =========================================================
   📸 MEMÓRIAS — É SÓ COPIAR E COLAR UMA LINHA NO FORMATO ABAIXO
   ---------------------------------------------------------
   Foto:  { type: "photo", date: "data ou título", caption: "legenda", image: "/foto.jpg" },
   Nota:  { type: "note",  quote: "frase entre aspas." },
   ---------------------------------------------------------
   • Para usar uma foto, coloque o arquivo em /public e use "/nome.jpg"
     (ou cole uma URL de imagem da internet).
   • Se "image" ficar vazio "", aparece um quadrinho com cor sólida bonita.
   ========================================================= */
type Memory =
  | { type: "photo"; date: string; caption: string; image: string }
  | { type: "note"; quote: string };

const MEMORIES: Memory[] = [
  { type: "photo", date: "amor a primeira vista", caption: "o dia em que tudo começou.", image: "/1.jpg" },
  { type: "note",  quote: "“Quando eu te conheci, algo no fundo me dizia que era você.”" },
  { type: "photo", date: "primeiro encontro",       caption: "a primeira vez que a gente se encontrou", image: "/2.jpg" },
  { type: "note",  quote: "“Quando eu te vi pela primeira vez eu tive a oportunidade de me apaixonar mais uma vez.”" },
  { type: "photo", date: "segundo encontro",  caption: "aqui faltava pouco para eu ir te visitar pela primeira vez...", image: "/3.jpg" },
  { type: "note",  quote: "“nunca irei negar o quão ansioso eu estava pra ir te ver.”" },
  { type: "photo", date: "primeira visita",  caption: "o dia que fui te visitar pela primeira vez", image: "/4.jpg" },
  { type: "note",  quote: "“desse dia eu jamais vou esquecer, eu fui recebido por você que estava tão linda que eu lembro de cada detalhe... Ali eu tive a certeza que eu ia me casar com você algum dia.”" },
  { type: "photo", date: "a aliança",  caption: "um homem quando ama uma mulher...", image: "/5.jpg" },
  { type: "note",  quote: "“um homem quando ama uma mulher coloca uma aliança no dedo dela e eu coloquei e ainda coloquei tim maia de fundo, sempre vou lembrar desse dia.”" },
  { type: "photo", date: "segunda ida na praia",  caption: "esse dia foi incrível e você estava tão linda.", image: "/6.jpg" },
  { type: "note",  quote: "“sei que você nunca vai esquecer desse dia assim como eu nunca vou esquecer.”" },
  { type: "photo", date: "felicidade genuína",  caption: "vai dizer que esse cara da foto não é feliz ao seu lado?", image: "/7.jpg" },
  { type: "note",  quote: "“essas são apenas algumas de nossas diversas memórias que temos, sabe o que elas tem em comum? o meu amor por todas... Eu te amo minha princesa, feliz dia dos namorados. ❤️”" },
  
  // Cole aqui mais quantas quiser ↓
  // { type: "photo", date: "...", caption: "...", image: "/foto2.jpg" },
  // { type: "note",  quote: "..." },
];

/* =========================================================
   ⛔ Daqui pra baixo é só código — não precisa mexer.
   ========================================================= */

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Uma carta pra minha moreninha" },
      { name: "description", content: "Uma cartinha feita com carinho — toque no envelope e veja." },
      { property: "og:title", content: "Uma carta pra você" },
      { property: "og:description", content: "Uma cartinha feita com carinho." },
    ],
  }),
  component: LetterPage,
});

function LetterPage() {
  const [opened, setOpened] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const [closing, setClosing] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const sfxRef = useRef<HTMLAudioElement | null>(null);
  const musicRef = useRef<HTMLAudioElement | null>(null);
  const memoriesRef = useRef<HTMLDivElement | null>(null);

  const cssVars = {
    ["--bg-color"]: COLORS.bg,
    ["--bg-color-2"]: COLORS.bg2,
    ["--envelope-color"]: COLORS.envelope,
    ["--envelope-shadow"]: COLORS.envelopeShadow,
    ["--paper-color"]: COLORS.paper,
    ["--paper-edge"]: COLORS.paperEdge,
    ["--ink-color"]: COLORS.ink,
    ["--accent"]: COLORS.accent,
  } as React.CSSProperties;

  useEffect(() => {
    if (!showLetter || !memoriesRef.current) return;
    const items = memoriesRef.current.querySelectorAll(".memory");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [showLetter]);

  const fadeIn = (audio: HTMLAudioElement, target: number, ms: number) => {
    const steps = 30;
    let i = 0;
    const id = window.setInterval(() => {
      i++;
      audio.volume = Math.min(target, (target * i) / steps);
      if (i >= steps) window.clearInterval(id);
    }, ms / steps);
  };

  const openLetter = () => {
    if (opened) return;
    setOpened(true);

    if (sfxRef.current && AUDIO.openSfx) {
      try {
        sfxRef.current.currentTime = 0;
        sfxRef.current.volume = 1;
        sfxRef.current.play().catch(() => {});
      } catch {}
    }
    if (musicRef.current && AUDIO.music) {
      musicRef.current.volume = 0;
      musicRef.current
        .play()
        .then(() => {
          setMusicOn(true);
          fadeIn(musicRef.current!, 0.55, 1800);
        })
        .catch(() => {});
    }

    window.setTimeout(() => setShowLetter(true), 900);
  };

  const closeLetter = () => {
    // Anima a saída da carta, depois volta a fechar o envelope.
    setClosing(true);
    if (musicRef.current && !musicRef.current.paused) {
      musicRef.current.pause();
      setMusicOn(false);
    }
    window.setTimeout(() => {
      setShowLetter(false);
      setOpened(false);
      setClosing(false);
      window.scrollTo({ top: 0 });
    }, 900);
  };

  const toggleMusic = () => {
    const m = musicRef.current;
    if (!m || !AUDIO.music) return;
    if (m.paused) {
      m.play().catch(() => {});
      setMusicOn(true);
    } else {
      m.pause();
      setMusicOn(false);
    }
  };

  return (
    <div className="letter-root" style={cssVars}>
      <style>{styles}</style>

      <Floaties />

      {showLetter && (
        <div className="letter-toolbar">
          {AUDIO.music && (
            <button
              className="icon-btn"
              onClick={toggleMusic}
              aria-label="Ativar ou desativar música"
            >
              {musicOn ? "♪" : "♬"}
            </button>
          )}
          <button
            className="icon-btn"
            onClick={closeLetter}
            aria-label="Fechar carta"
            title="Fechar carta"
          >
            ✕
          </button>
        </div>
      )}

      {/* Tela 1: envelope */}
      <div
        className={`stage ${opened ? "opened" : ""}`}
        style={{ display: showLetter || closing ? "none" : "flex" }}
      >
        <div className="hint">{TEXT.hint}</div>
        <div
          className={`envelope-wrap ${opened ? "opened" : ""}`}
          role="button"
          aria-label="Abrir carta"
          onClick={openLetter}
        >
          <div className="envelope">
            <div className="letter-preview" />
            <div className="pocket" />
            <div className="flap" />
          </div>
        </div>
        <div className="hint subtle">feito com carinho</div>
      </div>

      {/* Tela 2: carta + memórias */}
      <div className={`letter-screen ${showLetter && !closing ? "show" : ""} ${closing ? "closing" : ""}`}>
        <article className="paper">
          <div className="salutation">{TEXT.salutation}</div>
          <div className="body-text">{TEXT.body}</div>

          {EXTRAS.map((ex, i) => {
            if (ex.type === "list") {
              return (
                <div key={i} className="extra extra-list">
                  <div className="extra-title">{ex.title}</div>
                  <ul>
                    {ex.items.map((it, j) => (
                      <li key={j}>{it}</li>
                    ))}
                  </ul>
                </div>
              );
            }
            if (ex.type === "promise") {
              return (
                <div key={i} className="extra extra-promise">
                  <div className="extra-title">{ex.title}</div>
                  <p>{ex.text}</p>
                </div>
              );
            }
            if (ex.type === "gift") {
              return (
                <div key={i} className="extra extra-gift">
                  <div className="extra-title">{ex.title}</div>
                  <p>{ex.text}</p>
                </div>
              );
            }
            return (
              <div key={i} className="extra extra-quote">
                <p>“{ex.text}”</p>
              </div>
            );
          })}

          <div className="signature">
            {TEXT.signature} <span className="heart">♥</span>
          </div>
        </article>

        <div className="divider"><span>{TEXT.memoriesTitle}</span></div>

        <div className="memories" ref={memoriesRef}>
          {MEMORIES.map((m, i) =>
            m.type === "photo" ? (
              <div key={i} className="memory">
                <div
                  className="photo"
                  style={m.image ? { backgroundImage: `url(${m.image})` } : undefined}
                />
                <div className="date">{m.date}</div>
                <div className="caption">{m.caption}</div>
              </div>
            ) : (
              <div key={i} className="memory note">
                <div className="quote">{m.quote}</div>
              </div>
            )
          )}
        </div>

        <button className="close-bottom" onClick={closeLetter}>
          fechar carta ✿
        </button>

        <div className="footer">{TEXT.footerNote}</div>
      </div>

      <audio ref={sfxRef} src={AUDIO.openSfx || undefined} preload="auto" />
      <audio ref={musicRef} src={AUDIO.music || undefined} loop preload="auto" />
    </div>
  );
}

function Floaties() {
  const symbols = ["♥", "✿", "❀", "♡"];
  const items = Array.from({ length: 14 });
  return (
    <div className="floaties" aria-hidden="true">
      {items.map((_, i) => (
        <span
          key={i}
          className="floaty"
          style={{
            left: `${(i * 37) % 100}%`,
            fontSize: `${10 + ((i * 5) % 14)}px`,
            animationDuration: `${12 + ((i * 3) % 14)}s`,
            animationDelay: `${(i * 2) % 14}s`,
          }}
        >
          {symbols[i % symbols.length]}
        </span>
      ))}
    </div>
  );
}

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=Caveat:wght@400;600&display=swap');

.letter-root, .letter-root * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
.letter-root {
  position: fixed; inset: 0;
  font-family: 'Cormorant Garamond', serif;
  background: radial-gradient(circle at 50% 30%, var(--bg-color) 0%, var(--bg-color-2) 100%);
  color: var(--ink-color);
  overflow: hidden;
  overscroll-behavior: none;
}

.floaties { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
.floaty {
  position: absolute; bottom: -20px; opacity: 0;
  color: var(--accent);
  animation: floatUp linear infinite;
}
@keyframes floatUp {
  0%   { transform: translateY(0) rotate(0deg);   opacity: 0; }
  10%  { opacity: 0.7; }
  100% { transform: translateY(-110vh) rotate(360deg); opacity: 0; }
}

.stage {
  position: fixed; inset: 0;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 28px; z-index: 2;
  transition: opacity .8s ease;
}
.stage.opened { opacity: 0; }
.hint {
  font-family: 'Caveat', cursive;
  font-size: 20px; opacity: .75;
  animation: breathe 3s ease-in-out infinite;
  text-align: center; padding: 0 24px;
}
.hint.subtle { font-size: 16px; opacity: .5; }
@keyframes breathe { 0%,100% { opacity:.55; transform: translateY(0); } 50% { opacity:.95; transform: translateY(-3px); } }

.envelope-wrap {
  position: relative;
  width: min(78vw, 320px);
  aspect-ratio: 3 / 2;
  cursor: pointer;
  animation: hover 4s ease-in-out infinite;
  transition: transform .6s cubic-bezier(.2,.8,.2,1), opacity .6s ease;
}
.envelope-wrap.opened { transform: scale(.9); opacity: 0; transition-delay: .9s; }
@keyframes hover { 0%,100% { transform: translateY(0);} 50% { transform: translateY(-8px);} }

.envelope {
  position: absolute; inset: 0;
  background: var(--envelope-color);
  border-radius: 8px;
  box-shadow:
    0 18px 36px -12px rgba(150,60,60,.35),
    inset 0 -2px 0 rgba(0,0,0,.06),
    inset 0 2px 0 rgba(255,255,255,.25);
  overflow: hidden;
}
.envelope::before {
  content: '';
  position: absolute; inset: 0;
  background:
    linear-gradient(to bottom right, transparent calc(50% - 1px), color-mix(in oklab, var(--envelope-shadow) 55%, transparent) 50%, transparent calc(50% + 1px)) no-repeat,
    linear-gradient(to bottom left,  transparent calc(50% - 1px), color-mix(in oklab, var(--envelope-shadow) 55%, transparent) 50%, transparent calc(50% + 1px)) no-repeat;
  background-size: 50% 100%, 50% 100%;
  background-position: 0 0, 100% 0;
  pointer-events: none;
  z-index: 5;
  opacity: .9;
}
.flap {
  position: absolute; top: 0; left: 0; right: 0; height: 100%;
  background: var(--envelope-color);
  clip-path: polygon(0 0, 100% 0, 50% 50%);
  transform-origin: top center;
  transition: transform 1s cubic-bezier(.6,.05,.3,1);
  z-index: 6;
  filter: brightness(1.05);
  box-shadow: 0 2px 0 rgba(0,0,0,.04);
}
.flap::after {
  content:''; position:absolute; inset:0;
  background: linear-gradient(180deg, rgba(255,255,255,.22), rgba(0,0,0,.06));
  clip-path: inherit;
}
.pocket {
  position: absolute; inset: 0;
  background: var(--envelope-color);
  clip-path: polygon(0 0, 0 100%, 100% 100%, 100% 0, 50% 50%);
  z-index: 4;
  box-shadow: inset 0 2px 4px rgba(0,0,0,.06);
}
.letter-preview {
  position: absolute;
  left: 10%; right: 10%; top: 14%; height: 72%;
  background: var(--paper-color);
  border: 1px solid var(--paper-edge);
  border-radius: 3px;
  z-index: 3;
  transform: translateY(0);
  transition: transform 1s cubic-bezier(.6,.05,.3,1) .2s;
  box-shadow: 0 4px 10px rgba(0,0,0,.08);
}
.envelope-wrap.opened .flap { transform: rotateX(180deg); }
.envelope-wrap.opened .letter-preview { transform: translateY(-62%); }

.letter-screen {
  position: fixed; inset: 0;
  background: radial-gradient(circle at 50% 20%, var(--bg-color) 0%, var(--bg-color-2) 100%);
  overflow-y: auto; overflow-x: hidden;
  z-index: 5; opacity: 0; pointer-events: none;
  transition: opacity 1s ease;
  -webkit-overflow-scrolling: touch;
}
.letter-screen.show { opacity: 1; pointer-events: auto; }
.letter-screen.closing { opacity: 0; pointer-events: none; transition: opacity .8s ease; }
.letter-screen.closing .paper { transform: translateY(20px) scale(.98); opacity: 0; transition: opacity .6s ease, transform .8s ease; }

.paper {
  margin: 28px 18px 24px;
  background: var(--paper-color);
  border: 1px solid var(--paper-edge);
  border-radius: 6px;
  padding: 32px 24px;
  box-shadow: 0 20px 40px -12px rgba(80,40,20,.25), 0 2px 0 rgba(255,255,255,.6) inset;
  background-image: repeating-linear-gradient(180deg, transparent 0 31px, rgba(180,120,80,.10) 31px 32px);
  background-position: 0 32px;
  position: relative;
  transform: translateY(20px) scale(.98);
  opacity: 0;
  transition: opacity 1s ease .2s, transform 1s ease .2s;
  /* O papel cresce com o conteúdo — sem altura fixa */
  min-height: 200px;
  word-wrap: break-word;
  overflow-wrap: break-word;
}
.letter-screen.show .paper { opacity: 1; transform: translateY(0) scale(1); }
.paper::before {
  content:''; position: absolute; left: 50%; top: -8px;
  width: 60px; height: 18px;
  background: rgba(200,160,120,.25);
  transform: translateX(-50%) rotate(-3deg);
  border-radius: 2px;
}
.paper > * { line-height: 32px; }
.salutation { font-family: 'Caveat', cursive; font-size: 26px; margin: 0 0 32px; }
.body-text  { font-size: 17px; white-space: pre-line; margin: 0; }
.signature  { font-family: 'Caveat', cursive; font-size: 24px; text-align: right; margin-top: 32px; }
.heart { display:inline-block; color: var(--accent); animation: beat 1.6s ease-in-out infinite; }
@keyframes beat { 0%,100%{ transform: scale(1);} 50%{ transform: scale(1.18);} }

.extra { margin-top: 32px; }
.extra-title {
  font-family: 'Caveat', cursive;
  font-size: 22px;
  color: var(--accent);
  margin-bottom: 0;
}
.extra-list ul { list-style: none; padding: 0; margin: 0; }
.extra-list li { font-size: 17px; position: relative; padding-left: 22px; }
.extra-list li::before {
  content: '♡'; position: absolute; left: 2px; top: 0;
  color: var(--accent); font-size: 14px;
}
.extra-promise p,
.extra-gift p { font-size: 17px; margin: 0; font-style: italic; }
.extra-gift {
  border-top: 1px dashed color-mix(in oklab, var(--accent) 40%, transparent);
  border-bottom: 1px dashed color-mix(in oklab, var(--accent) 40%, transparent);
}
.extra-quote p {
  font-family: 'Caveat', cursive; font-size: 22px;
  text-align: center; margin: 0;
}

.divider {
  display: flex; align-items: center; gap: 12px;
  margin: 18px 22px 6px;
  opacity: .65;
  font-family: 'Caveat', cursive; font-size: 20px;
}
.divider::before, .divider::after {
  content:''; flex:1; height:1px;
  background: linear-gradient(90deg, transparent, rgba(91,58,41,.35), transparent);
}

.memories { padding: 6px 18px 24px; display: flex; flex-direction: column; gap: 22px; }
.memory {
  background: var(--paper-color);
  border: 1px solid var(--paper-edge);
  border-radius: 4px;
  padding: 12px 12px 16px;
  box-shadow: 0 12px 24px -10px rgba(80,40,20,.25);
  transform: rotate(-1.2deg);
  opacity: 0; translate: 0 16px;
  transition: opacity .8s ease, translate .8s ease;
  max-width: 86%;
  align-self: flex-start;
}
.memory.in { opacity: 1; translate: 0 0; }
.memory:nth-child(even) { transform: rotate(1.5deg); align-self: flex-end; }
.memory .photo {
  width: 100%; aspect-ratio: 4 / 5;
  background: #d8c5ad center/cover no-repeat;
  border-radius: 2px;
}
.memory .date { font-family: 'Caveat', cursive; font-size: 18px; margin-top: 10px; opacity: .8; }
.memory .caption { font-size: 16px; line-height: 1.5; margin-top: 4px; font-style: italic; }
.memory.note { padding: 18px 16px; }
.memory.note .quote { font-family: 'Caveat', cursive; font-size: 22px; line-height: 1.4; }

.close-bottom {
  display: block;
  margin: 12px auto 0;
  padding: 10px 22px;
  background: var(--paper-color);
  border: 1px solid var(--paper-edge);
  border-radius: 999px;
  font-family: 'Caveat', cursive;
  font-size: 20px;
  color: var(--ink-color);
  cursor: pointer;
  box-shadow: 0 8px 18px -10px rgba(80,40,20,.3);
  transition: transform .2s ease;
}
.close-bottom:active { transform: scale(.96); }

.footer {
  text-align: center; padding: 14px 24px 60px;
  font-family: 'Caveat', cursive; font-size: 20px; opacity: .7;
}

.letter-toolbar {
  position: fixed; top: 14px; right: 14px; z-index: 10;
  display: flex; gap: 8px;
}
.icon-btn {
  background: rgba(255,255,255,.6);
  backdrop-filter: blur(6px);
  border: 1px solid rgba(91,58,41,.15);
  color: var(--ink-color);
  border-radius: 999px;
  width: 38px; height: 38px;
  display: flex; align-items: center; justify-content: center;
  font-size: 16px; cursor: pointer;
  transition: transform .15s ease, background .15s ease;
}
.icon-btn:active { transform: scale(.92); }
`;
