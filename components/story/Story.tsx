"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown } from "lucide-react";
import { AppStoreButton } from "@/components/site/AppStoreButton";
import { clamp, fitCanvas, isDark, lerp, prefersReducedMotion, runLoop, smooth } from "@/lib/coins/engine";
import { PHONE, Phone } from "./Phone";
import { CalculatorScreen, EXAMPLE, HomeScreen, PersonalisingScreen, QUESTIONS, QuestionScreen, ResultSheet, WelcomeScreen } from "./Screens";
import { StoryStage, order, type BeatId, type Env, type PersonalisePhase, type Rect } from "./stage";
import { nextKeyDate } from "@/lib/keyDates";


/** Scroll length of each beat, in viewport heights. */
const BEATS: { id: BeatId; len: number }[] = [
  { id: "hero", len: 0.35 },
  { id: "morph", len: 1.6 },
  { id: "welcome", len: 1.0 },
  // The questions share one screen and change only their content, so each gets plenty of room.
  { id: "q0", len: 1.5 },
  { id: "q1", len: 1.5 },
  { id: "q2", len: 1.7 },
  { id: "personalising", len: 1.8 },
  { id: "home", len: 1.3 },
  { id: "estimate", len: 1.6 },
  { id: "result", len: 1.3 },
];
const TOTAL = BEATS.reduce((a, b) => a + b.len, 0);
const STARTS = BEATS.reduce<number[]>((acc, b, i) => [...acc, i === 0 ? 0 : acc[i - 1] + BEATS[i - 1].len], []);
const MORPH = { start: STARTS[1], len: BEATS[1].len };

const CHAPTERS = ["Welcome", "About you", "Your picture", "Live estimate", "Results"];
const CHAPTER: Record<BeatId, number> = { hero: -1, morph: 0, welcome: 0, q0: 1, q1: 1, q2: 1, personalising: 2, home: 2, estimate: 3, result: 4 };

const CAPTIONS: Partial<Record<BeatId, { title: string; body: string }>> = {
  welcome: { title: "It begins with a hello.", body: "Two coins, a splash of green and a few friendly questions. No account to create, no forms to fill." },
  q0: { title: "Tell it what you do.", body: "Employed, self-employed, director, landlord, or a mix of them. Every answer lands on a coin, and TaxMate reshapes itself around it." },
  q1: { title: "Where you pay tax.", body: "Scotland sets its own Income Tax bands. Choose once, and every estimate follows." },
  q2: { title: "What you’d like help with.", body: "Pick up to three goals and the right tools step forward." },
  personalising: { title: "Then it gets personal.", body: "Your answers become your key dates, your Making Tax Digital status and the tools that fit you." },
  home: { title: "What matters, first.", body: "The next HMRC date that applies to you counts down on the home screen, with the tool to prepare for it one tap away." },
  estimate: { title: "The answer, before you finish.", body: "Every calculator opens with a live estimate that sharpens as you complete each section." },
  result: { title: "And where every pound goes.", body: "Results break down your tax, National Insurance and what you keep, saved privately on your device." },
};

function beatAt(pos: number): BeatId {
  let id: BeatId = "hero";
  for (let i = 0; i < BEATS.length; i++) if (pos >= STARTS[i]) id = BEATS[i].id;
  return id;
}

function useTween(target: number, ms = 650) {
  const [v, setV] = useState(target);
  const from = useRef(target);
  useEffect(() => {
    const start = performance.now(), a = from.current, dur = prefersReducedMotion() ? 0 : ms;
    let raf = 0;
    const step = (now: number) => {
      const t = dur ? Math.min(1, (now - start) / dur) : 1, e = 1 - Math.pow(1 - t, 3);
      from.current = a + (target - a) * e;
      setV(from.current);
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return v;
}

export function Story() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [beat, setBeat] = useState<BeatId>("hero");
  const [morphLate, setMorphLate] = useState(false);
  const [pickState, setPickState] = useState({ beat: "hero" as BeatId, n: 0 });
  const [tickState, setTickState] = useState({ beat: "hero" as BeatId, n: 0 });
  const picked = pickState.beat === beat ? pickState.n : 0;
  const ticks = tickState.beat === beat ? tickState.n : beat === "result" ? 3 : 0;
  const [phase, setPhase] = useState<PersonalisePhase | null>(null);
  const [keyDate, setKeyDate] = useState({ title: "Self Assessment deadline", days: 90, date: "31 January 2027", detail: "File your online return and pay the tax you owe." });
  const stageHandle = useRef<StoryStage | null>(null);
  /** The beat before this one, so the estimate only plays its ticks when arriving from above. */
  const fromBeat = useRef<BeatId>("hero");

  useEffect(() => {
    // Worked out in the visitor's browser, so a statically built page never shows a stale countdown.
    const id = requestAnimationFrame(() => setKeyDate(nextKeyDate(new Date())));
    return () => cancelAnimationFrame(id);
  }, []);

  // Timed reactions within a beat: answers being picked, sections being reviewed.
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    const at = (ms: number, fn: () => void) => timers.push(setTimeout(fn, prefersReducedMotion() ? 0 : ms));
    const qi = { q0: 0, q1: 1, q2: 2 }[beat as "q0"];
    if (qi !== undefined) {
      QUESTIONS[qi].picks.forEach((_, i) => at(750 + i * 420, () => { setPickState({ beat, n: i + 1 }); stageHandle.current?.pick(i + 1); }));
    }
    if (beat === "estimate" && fromBeat.current !== "result") [1, 2, 3].forEach((n) => at(450 + n * 650, () => setTickState({ beat, n })));
    fromBeat.current = beat;
    if (order(beat) < order("personalising")) at(0, () => setPhase(null));
    if (order(beat) > order("personalising")) at(0, () => setPhase((p) => (p === null || p === "covered" || p === "text" || p === "untext" || p === "landing" ? "done" : p)));
    return () => timers.forEach(clearTimeout);
  }, [beat]);

  useEffect(() => {
    const section = sectionRef.current!, stage = stageRef.current!, canvas = canvasRef.current!;
    const S = new StoryStage();
    stageHandle.current = S;
    S.reduce = prefersReducedMotion();
    S.onPersonalise = (p) => setPhase(p);
    if (process.env.NODE_ENV !== "production") (window as unknown as { __story: StoryStage }).__story = S;
    const root = document.documentElement;
    const q = <T extends Element>(sel: string) => stage.querySelector<T>(sel);
    const heroAnchor = q<HTMLElement>(".story-hero-anchor")!;
    const phoneWrap = q<HTMLElement>(".story-phone")!;
    const screenEl = q<HTMLElement>(".phone-screen")!;
    const heroFlood = q<HTMLElement>(".story-flood")!;
    const floodFill = q<HTMLElement>(".story-flood-fill")!;
    const phoneFlood = q<HTMLElement>(".phone-flood")!;
    const pointer = { x: 0, y: 0, active: false };
    let k = 1, lastBeat: BeatId = "hero", lastLate = false, mSmooth = 0;

    // Lay the phone out for the viewport: beside the captions on wide screens, above them on narrow ones.
    const layout = () => {
      const W = stage.clientWidth, H = stage.clientHeight, wide = W >= 960;
      if (wide) {
        k = Math.min((H - 132) / (PHONE.height + 22), ((W * 0.5) - 40) / (PHONE.width + 22), 1);
        const cx = W * 0.5 + Math.min(W * 0.25, 420) , cy = H / 2 + 26;
        phoneWrap.style.transform = `translate(${cx - (PHONE.width * k) / 2}px, ${cy - (PHONE.height * k) / 2}px) scale(${k})`;
      } else {
        const capH = Math.min(196, H * 0.25);
        k = Math.min((H - 74 - capH - 10) / (PHONE.height + 22), (W - 56) / (PHONE.width + 22), 1);
        phoneWrap.style.transform = `translate(${W / 2 - (PHONE.width * k) / 2}px, ${74}px) scale(${k})`;
        stage.style.setProperty("--cap-top", `${74 + PHONE.height * k + 18}px`);
      }
      stage.dataset.layout = wide ? "wide" : "narrow";
    };
    layout();
    const ro = new ResizeObserver(layout);
    ro.observe(stage);

    const rel = (el: Element | null): Rect | undefined => {
      if (!el) return undefined;
      const r = el.getBoundingClientRect(), s = stage.getBoundingClientRect();
      return { x: r.left - s.left, y: r.top - s.top, w: r.width, h: r.height };
    };
    const env = (m: number): Env => {
      const qid = { q0: "situation", q1: "region", q2: "goals" }[S.beat as "q0"] ?? "goals";
      return {
        width: stage.clientWidth, height: stage.clientHeight, k, m, dark: isDark(), pointer,
        hero: rel(heroAnchor), welcome: rel(q('[data-anchor="welcome"]')),
        heroSlot: rel(q(`[data-anchor="hero-${qid}"]`)), stackSlot: rel(q(`[data-anchor="stack-${qid}"]`)),
        logo: rel(q('[data-anchor="logo"]')), screen: rel(screenEl),
      };
    };

    const progress = () => {
      const r = section.getBoundingClientRect();
      return Math.max(0, -r.top / window.innerHeight);
    };

    // The intro plays once a session, from the top of the page (decided before first paint, in the layout).
    let introOn = root.dataset.intro === "1" && !S.reduce;
    S.onIntro = (p) => {
      if (p === "flood") root.dataset.intro = "flood";
      if (p === "done") {
        delete root.dataset.intro;
        try { sessionStorage.setItem("tm-intro", "1"); } catch {}
      }
    };
    const first = env(0);
    S.env = first;
    if (introOn) S.startIntro(first);
    else { S.intro.phase = "launch"; S.finishIntro(); delete root.dataset.intro; }

    const onMove = (e: PointerEvent) => {
      const s = stage.getBoundingClientRect(), x = e.clientX - s.left, y = e.clientY - s.top;
      const hit = [S.front, S.back].some((c) => c.p.s > 0.02 && c.opacity > 0.5 && Math.hypot(c.p.x - x, c.p.y - y) < 100 * c.p.s * 1.25 + 8);
      stage.style.cursor = hit ? "pointer" : "";
      loop.wake();
    };
    const onLeave = () => { pointer.active = false; };
    const onClick = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("a,button")) return;
      const s = stage.getBoundingClientRect();
      if (S.tap(e.clientX - s.left, e.clientY - s.top)) loop.wake();
    };
    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerleave", onLeave);
    stage.addEventListener("click", onClick);

    let lastDraw = 0;
    const loop = runLoop(section, (dt, time) => {
      const pos = progress();
      if (introOn && pos > 0.03) { S.finishIntro(); introOn = false; }
      if (S.intro.phase === "none") introOn = false;
      const b = beatAt(pos);
      // The shrink eases towards the scroll position rather than tracking every wheel step, so it glides.
      const mTarget = b === "hero" ? 0 : b === "morph" ? clamp((pos - MORPH.start) / MORPH.len) : 1;
      mSmooth = b === "morph" ? mSmooth + (mTarget - mSmooth) * (1 - Math.exp(-dt * 6)) : mTarget;
      if (Math.abs(mTarget - mSmooth) > 1e-4) loop.wake();
      const m = mSmooth;
      const e = env(m);
      if (b !== lastBeat) {
        // Reset each beat's own state in the same render as the change, so a screen never shows a stale frame.
        // Coming back up from the result, the calculator stays complete rather than replaying.
        setTickState({ beat: b, n: b === "result" || (b === "estimate" && lastBeat === "result") ? 3 : 0 });
        setPickState({ beat: b, n: 0 });
        lastBeat = b; S.env = e; S.setBeat(b); setBeat(b);
      }
      const late = b === "morph" && m > 0.6;
      if (late !== lastLate) { lastLate = late; setMorphLate(late); }
      S.frame(dt, e);

      // The hero's green fills the stage and is scrubbed into the phone's screen; during the intro it floods out
      // from the coins.
      const W = e.width, H = e.height, sc = e.screen!;
      // The green (and the coins, in the stage) reach the phone by 80% of the shrink; the rest is the crossfade.
      const em = smooth(e.m / 0.8);
      if (e.m < 1) {
        const f = { x: 0, y: 0, w: W, h: H, r: 0 };
        const x = lerp(f.x, sc.x, em), y = lerp(f.y, sc.y, em), w = lerp(f.w, sc.w, em), h = lerp(f.h, sc.h, em), r = lerp(f.r, PHONE.radius * k, em);
        heroFlood.style.clipPath = `inset(${y.toFixed(1)}px ${(W - x - w).toFixed(1)}px ${(H - y - h).toFixed(1)}px ${x.toFixed(1)}px round ${r.toFixed(1)}px)`;
        floodFill.style.backgroundPosition = `${x}px ${y}px`; floodFill.style.backgroundSize = `${w}px ${h}px`;
        if (S.heroFloodRadius !== null) {
          const c = S.heroFloodCentre;
          floodFill.style.clipPath = `circle(${S.heroFloodRadius.toFixed(1)}px at ${c.x.toFixed(1)}px ${c.y.toFixed(1)}px)`;
        } else floodFill.style.clipPath = "none";
        // Over the last third of the shrink, the hero's green fades away to reveal the phone's own welcome screen
        // (the same green, with its status bar, words and button) rather than swapping to it at the end.
        heroFlood.style.opacity = String(1 - smooth((e.m - 0.7) / 0.27));
      } else heroFlood.style.opacity = "0";
      stage.style.setProperty("--m", em.toFixed(4));
      phoneWrap.style.opacity = String(clamp(e.m * 1.4));

      // The phone's own green.
      let pr = 2000, pc = { x: PHONE.width / 2, y: PHONE.height / 2 };
      if (order(b) >= order("welcome")) {
        const c = S.floodCentre();
        pr = S.flood.r / k; pc = { x: (c.x - sc.x) / k, y: (c.y - sc.y) / k };
      }
      phoneFlood.style.clipPath = `circle(${pr.toFixed(1)}px at ${pc.x.toFixed(1)}px ${pc.y.toFixed(1)}px)`;
      const statusOnGreen = pr > 0 && Math.hypot(PHONE.width / 2 - pc.x, 22 - pc.y) < pr;
      screenEl.dataset.tone = statusOnGreen || b === "result" ? "dark" : "light";
      root.dataset.navTone = (b === "hero" || (b === "morph" && e.m < 0.35)) && root.dataset.intro !== "1" ? "light" : "";

      // At rest the idle bob needs only a gentle frame rate.
      if (S.isQuiet && time - lastDraw < 1 / 24) return;
      lastDraw = time;
      const { ctx } = fitCanvas(canvas);
      S.draw(ctx);
    });

    return () => {
      loop.stop(); ro.disconnect();
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerleave", onLeave);
      stage.removeEventListener("click", onClick);
      delete root.dataset.navTone;
    };
  }, []);

  const chapter = CHAPTER[beat];
  const qIndex = { q0: 0, q1: 1, q2: 2 }[beat as "q0"];
  const covered = phase !== null && order(beat) >= order("personalising");
  const homeState = beat === "estimate" ? "behind" : beat === "home" || (beat === "personalising" && covered) ? "shown" : "hidden";
  const calcState = beat === "estimate" || beat === "result" ? "shown" : "hidden";
  // The estimate counts up once, from £0 to the final figure, when the last section is reviewed.
  const amount = useTween(ticks === 3 ? EXAMPLE.final.total : 0, 1000);
  const percent = useTween((ticks / 3) * 100);

  return (
    <section ref={sectionRef} className="story" style={{ height: `${(TOTAL + 1) * 100}lvh` }} aria-label="A tour of the TaxMate app">
      {/* Where the tour's first screen (the phone's welcome) sits centred: the target of "Tour" links. */}
      <div id="tour" className="story-anchor" style={{ top: `${(MORPH.start + MORPH.len + BEATS[2].len * 0.4) * 100}lvh` }} aria-hidden />
      <div ref={stageRef} className="story-stage" data-beat={beat}>
        <div className="story-phone" style={{ opacity: 0 }}>
          <Phone tone="light">
            <div className="phone-flood" />
            <WelcomeScreen shown={beat === "welcome" || morphLate} />
            {QUESTIONS.map((qq, i) => (
              <QuestionScreen key={qq.id} q={qq} shown={qIndex === i || (i === 2 && beat === "personalising" && !covered)} picked={qIndex === i ? picked : qq.picks.length} />
            ))}
            <HomeScreen state={homeState} keyDate={keyDate} />
            <CalculatorScreen state={calcState} ticks={ticks} amount={amount} percent={percent} />
            <PersonalisingScreen shown={phase === "text"} />
            <ResultSheet shown={beat === "result"} />
          </Phone>
        </div>

        <div className="story-flood" aria-hidden><div className="story-flood-fill" /></div>
        <div className="story-hero-anchor" aria-hidden>
          <div className="story-aura" />
        </div>

        <div className="story-hero-copy">
          <h1 className="story-h1">
            Your UK tax, <em>made clearer.</em>
          </h1>
          <p className="story-lede">
            Eleven calculators for your pay, your business and the year ahead. Personalised to you, with the answer before you’ve finished typing.
          </p>
          <div className="story-ctas">
            <AppStoreButton variant="gold" />
            <a href="#tour" className="btn-glass glass press">
              Take the tour <ArrowDown className="h-4 w-4" aria-hidden />
            </a>
          </div>
        </div>

        <div className="story-captions">
          <div className="story-chapters" aria-hidden>
            {CHAPTERS.map((c, i) => (
              <span key={c} data-done={i <= chapter || undefined} data-on={i === chapter || undefined}>
                <i />
                <b>{c}</b>
              </span>
            ))}
          </div>
          <div className="story-caption-stack">
            {(Object.keys(CAPTIONS) as BeatId[]).map((id) => {
              const c = CAPTIONS[id]!;
              const on = id === beat || (id === "welcome" && beat === "morph");
              return (
                <div key={id} className="story-caption" data-on={on || undefined} data-before={order(id) < order(beat) || undefined}>
                  <p className="story-caption-kicker">{String(CHAPTER[id] + 1).padStart(2, "0")} · {CHAPTERS[CHAPTER[id]]}</p>
                  <h2 className="story-caption-title">{c.title}</h2>
                  <p className="story-caption-body">{c.body}</p>
                </div>
              );
            })}
          </div>
        </div>

        <canvas ref={canvasRef} className="story-canvas" aria-hidden />
        <a href="#after-story" className="story-skip">Skip the tour</a>
      </div>
    </section>
  );
}
