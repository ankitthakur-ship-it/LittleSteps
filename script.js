const Q = [
  ["If you point at something across the room, does your child look at it?", 0],
  ["Does your child usually respond when you call their name?", 0],
  [
    "Does your child play pretend, like feeding a doll or using a toy phone?",
    0,
  ],
  ["Does your child point with one finger to ask for something?", 0],
  ["Does your child point to show you something interesting?", 0],
  ["Does your child look at your face when you talk or play together?", 0],
  ["Does your child copy you, like waving or making a silly face?", 0],
  ["Does your child get unusually upset by everyday sounds?", 1],
];
const PAIRS = [
  ["🙂", "🔷"],
  ["🔶", "😊"],
  ["😄", "⭐"],
  ["🔺", "🙂"],
  ["😊", "⬛"],
  ["⬡", "😀"],
];
const S = { age: "", ans: [], pl: [], name: null, seen: 0 };
let first = 1;
const T = (h) => {
  const t = document.getElementById("tool");
  t.innerHTML = `<div class="scr">${h}</div>`;
  if (first) first = 0;
  else t.scrollIntoView({ behavior: "smooth", block: "start" });
};
const bar = (p) => `<div class="bar"><i style="width:${p}%"></i></div>`;

function intro() {
  T(
    `<div style="text-align:center;padding-top:30px"><div class="fp"><svg xmlns="http://www.w3.org/2000/svg" viewBox="12 9 62 68"><defs><linearGradient id="fpg" gradientUnits="userSpaceOnUse" x1="14" y1="14" x2="70" y2="74"><stop offset="0" stop-color="#34c8a0"/><stop offset="1" stop-color="#0a84ff"/></linearGradient></defs><g fill="url(#fpg)"><ellipse cx="26" cy="62" rx="8" ry="12"/><circle cx="18" cy="44" r="3"/><circle cx="24" cy="41" r="3"/><circle cx="30" cy="41" r="3"/><circle cx="36" cy="44" r="3"/><ellipse cx="58" cy="36" rx="8" ry="12"/><circle cx="50" cy="18" r="3"/><circle cx="56" cy="15" r="3"/><circle cx="62" cy="15" r="3"/><circle cx="68" cy="18" r="3"/></g></svg></div><h2>Ready when you are</h2><p>Find a quiet moment with your child nearby.</p><button class="btn" onclick="age()">Begin</button></div>`,
  );
}
function age() {
  T(`${bar(4)}<div class="lbl">Step 1 · About your child</div><h2>How old is your child?</h2><p>Designed for 16 to 30 months.</p>
<select id="a"><option value="">Choose age</option>${[...Array(15)].map((_, i) => `<option>${i + 16} months</option>`).join("")}<option>Older or younger</option></select>
<button class="btn" onclick="S.age=a.value;ask(0)">Continue</button>`);
}
function ask(i) {
  if (i >= Q.length) {
    S.seen = 0;
    return play(0);
  }
  T(`${bar(10 + i * 6)}<div class="lbl">Part 1 · Question ${i + 1} of ${Q.length}</div><h2 style="font-size:24px">${Q[i][0]}</h2>
<p style="font-size:14px">Think about what you usually see, not the best day.</p>
<div class="row"><button class="btn g" onclick="rep(${i},1)">Yes</button><button class="btn g" onclick="rep(${i},0)">Not really</button></div>
${i ? `<button class="btn t" style="margin-top:8px" onclick="ask(${i - 1})">‹ Back</button>` : ""}`);
}
function rep(i, y) {
  S.ans[i] = (Q[i][1] ? y : !y) ? 1 : 0;
  ask(i + 1);
}
function play(i) {
  if (i == 0 && !S.seen) {
    S.seen = 1;
    S.pl = [];
    return T(
      `${bar(58)}<div class="lbl">Part 2 · Play</div><h2>Tap-and-play</h2><p>Hand the screen to your child or sit together. Each round shows two pictures. Let them tap the one they like. There are no right answers.</p><button class="btn" onclick="play(0)">Start playing</button>`,
    );
  }
  if (i >= PAIRS.length) return nameIntro();
  const p = PAIRS[i],
    pr = Math.random() < 0.5 ? [p[1], p[0]] : p,
    t0 = performance.now();
  T(
    `${bar(60 + i * 4)}<div class="lbl">Round ${i + 1} of ${PAIRS.length}</div><h2>Which one do you like?</h2><div class="pair">${pr.map((e) => `<div class="glass pick" onclick="tap(${i},'${e}',${t0})">${e}</div>`).join("")}</div>`,
  );
}
function tap(i, e, t0) {
  S.pl[i] = { social: /[🙂😊😄😀]/u.test(e), rt: performance.now() - t0 };
  play(i + 1);
}
let t1 = 0,
  to;
function nameIntro() {
  t1 = 0;
  T(`${bar(86)}<div class="lbl">Part 3 · Name moment</div><h2>Say their name</h2><p>Step back from the screen. While your child plays, say their name once from a few steps away. Click the circle the moment they look at you.</p>
<div class="glass big" id="b" onclick="nm()">Ready</div><div id="x" style="text-align:center"></div><div style="text-align:center"><button class="btn t" onclick="S.name=null;result()">Skip this part</button></div>`);
}
function nm() {
  const b = document.getElementById("b");
  if (!t1) {
    t1 = performance.now();
    b.textContent = "They looked!";
    b.style.color = "#0a84ff";
    to = setTimeout(() => {
      document.getElementById("x").innerHTML =
        `<button class="btn g" onclick="S.name=99;result()">No response</button>`;
    }, 4000);
  } else {
    S.name = (performance.now() - t1) / 1000;
    clearTimeout(to);
    result();
  }
}
function result() {
  const risk = S.ans.reduce((a, b) => a + b, 0),
    n = S.pl.length,
    soc = S.pl.filter((p) => p.social).length;
  const qH = risk >= 3,
    pH = n >= 4 && soc <= 2,
    nH = S.name !== null && S.name > 3,
    c = [qH, pH, nH].filter(Boolean).length;
  const it = (h, t, a, b) =>
    `<div class="glass res"><div class="dot" style="background:var(${h ? "--mid" : "--ok"})"></div><div><b>${t}</b><span>${h ? b : a}</span></div></div>`;
  T(`${bar(100)}<div class="lbl">Your summary</div><h2>${c ? "A few things worth talking through" : "Nothing stood out today"}</h2>
<p>${c ? "These notes don’t mean anything is wrong. They’re a useful starting point for a conversation with your pediatrician." : "Your child’s responses were in a common range today. Keep enjoying play together."}</p>
${it(qH, "Everyday behaviors", "Your answers describe common toddler behaviors.", `${risk} of ${Q.length} behaviors are worth mentioning to a doctor.`)}
${it(pH, "Play preferences", `They chose faces ${soc} of ${n} times.`, `They chose faces ${soc} of ${n} times, a little less than most toddlers.`)}
${S.name === null ? `<div class="glass res"><div class="dot" style="background:var(--chip)"></div><div><b>Name moment</b><span>Skipped. You can try again any time.</span></div></div>` : it(nH, "Responding to name", "They turned to their name quickly.", "They were slower to respond, or didn’t respond, this time.")}
<div class="glass note"><b>Please remember:</b> this is not a diagnosis. If you have any concerns, talk to your pediatrician whatever these results say. Early support helps.</div>
<div class="row"><button class="btn" onclick="print()">Save or print</button><button class="btn g" onclick="Object.assign(S,{ans:[],pl:[],name:null,seen:0});intro()">Start over</button></div>`);
}
intro();
