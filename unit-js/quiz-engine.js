/* =====================================================================
   720-core — config-driven question engine (shared; vendored per unit)
   Question types: single | multi | dual-select | value-input
   Hint policies per _question-template-defaults.md:
     'always' (default) | 'after-wrong' (hidden until first incorrect attempt)

   The unit must define BEFORE this file runs (js/questions.js):
     QUESTIONS — array of question configs (see unit questions.js for shape)
   Requires in index.html: #quiz-hint-overlay (shared hint popup, outside screens).
   ===================================================================== */

'use strict';

/* Applet (יישומון) embed — iframe + fullscreen-zoom button.
   Zoom expands the SAME iframe in place (CSS class), never a second
   instance — learner input inside the applet persists across zoom.
   Toggle handler is delegated in engine.js. */
function appletEmbed(src, title) {
  return `<div class="applet-embed">
    <button class="applet-zoom-btn" type="button" data-applet-toggle="open"
      aria-label="تكبير التطبيق إلى شاشة كاملة"><svg width="21" height="21" viewBox="0 0 21 21" fill="none" aria-hidden="true"><circle cx="8.5" cy="8.5" r="6.5" stroke="currentColor" stroke-width="2"/><line x1="13.5" y1="13.5" x2="19" y2="19" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg></button>
    <button class="applet-zoom-btn applet-close-btn" type="button" data-applet-toggle="close"
      aria-label="إغلاق الشاشة الكاملة"><svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true"><line x1="2" y1="2" x2="13" y2="13" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><line x1="13" y1="2" x2="2" y2="13" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg></button>
    <iframe src="${src}" title="${title || 'التطبيق'}" loading="lazy"></iframe>
  </div>`;
}


/* Question progress stepper (סרגל שאלה) — q.step = {group, index, total}.
   07.09 — this is percent-04's approved `qprog` component (same markup, same two
   glyph SVGs, same class names). The classes are load-bearing: the CSS hides every
   svg inside a dot and re-shows exactly one by class, so a copy without
   class="qp-tick" renders a dot with no mark and a correct answer looks unanswered.
   The container keeps `qstepper` too, purely so `:has(.qstepper)` layout rules match.
   States still derive from sibling questions in the same group (a station may span
   several screens — sub-questions א/ב — and only resolves when all of them do). */
const QP_TICK = '<svg class="qp-tick" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M1.5 6.2l3 3 6-6.4" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const QP_X    = '<svg class="qp-x" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M2.5 2.5l7 7M9.5 2.5l-7 7" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>';

function quizStepperHTML(q) {
  let html = '';
  for (let i = 1; i <= q.step.total; i++) {
    const label = (q.step.labels && q.step.labels[i - 1]) || `السؤال ${i}`;
    html += `<div class="qprog-station" data-step="${i}">` +
              `<span class="qprog-dot">${QP_TICK}${QP_X}</span>` +
              `<span class="qprog-label">${label}</span>` +
            `</div>`;
    /* RTL: station i+1 sits to the LEFT of station i, so the connector between
       them fills once the RIGHT-hand (lower-numbered) station resolves. */
    if (i < q.step.total) html += `<span class="qprog-line" data-after="${i}"></span>`;
  }
  return `<div class="qprog qstepper" data-group="${q.step.group}" data-current="${q.step.index}" aria-hidden="true">${html}</div>`;
}

/* QA 14.10.26: `qq` lets a static screen that is not in QUESTIONS (the pizza
   set-up page, dslide 32) carry the same stepper; the bar is found by
   data-screen so both #qN and #sN sections work. */
function quizStepperUpdate(screen, qq) {
  const q = qq || QUESTIONS.find(x => x.screen === screen);
  if (!q || !q.step) return;
  const group = QUESTIONS.filter(x => x.step && x.step.group === q.step.group);
  const bar = document.querySelector(`.screen[data-screen="${screen}"] .qstepper`);
  if (!bar) return;
  const resolved = {};
  bar.querySelectorAll('.qprog-station').forEach(el => {
    const i = Number(el.dataset.step);
    // a step may span several screens (sub-questions א/ב) — aggregate them:
    // done only when all parts are done, correct only when all parts correct
    const sibs = group.filter(x => x.step.index === i);
    const sts = sibs.map(x => quizState[x.screen]).filter(Boolean);
    const allDone = sts.length === sibs.length && sts.every(st => st.done);
    const allCorrect = allDone && sts.every(st => st.wasCorrect);
    resolved[i] = allDone;
    el.classList.toggle('is-current', i === q.step.index);
    el.classList.toggle('is-correct', allDone && allCorrect);
    el.classList.toggle('is-wrong', allDone && !allCorrect);
  });
  bar.querySelectorAll('.qprog-line').forEach(ln => {
    ln.classList.toggle('is-done', !!resolved[Number(ln.dataset.after)]);
  });
}

/* Per-question runtime state, keyed by screen number — survives navigation */
const quizState = {};

/* 09.09 — in the client's multi-component structure each component sets
   window.PART_CONFIG = {start,end}. A builder must skip any screen outside it,
   or every component ships the whole unit. Absent PART_CONFIG, nothing changes. */
function inPart(n) {
  const p = window.PART_CONFIG;
  return !p || (n >= p.start && n <= p.end);
}

function quizBuildScreens() {
  const app = document.getElementById('app');
  const backRef = document.getElementById('quiz-hint-overlay'); // insert screens before overlay
  QUESTIONS.forEach(q => {
    quizState[q.screen] = { attempts: 0, done: false, hintUsed: false, selected: null, selectedSet: [] };
    /* state is registered for EVERY question (a component may gate on a score
       from earlier ones); only the markup is skipped outside this part. */
    /* QA 02.11.26: a question embedded in a scroll screen (`embedIn: <host>`)
       is built with its host's part, whatever its own (pseudo) number */
    if (!inPart(q.embedIn !== undefined ? q.embedIn : q.screen)) return;
    const sec = document.createElement('section');
    sec.className = 'screen quiz-screen';
    sec.dataset.screen = q.screen;
    sec.id = `q${q.screen}`;
    sec.innerHTML = `
      ${q.step ? quizStepperHTML(q) : `<div class="scq-progress">${q.label}</div>`}
      <div class="quiz-cols">
        <div class="quiz-main" data-reveal="1">
          <div class="quiz-stem">${q.stem}</div>
          ${q.popup ? `<button class="popup-trigger" type="button"
            onclick="document.getElementById('q${q.screen}-note-popup').classList.remove('hidden')">${q.popup.trigger}</button>` : ''}
          ${quizInteractionHTML(q)}
        </div>
        ${q.content ? `<div class="quiz-content" data-reveal="2"${q.content.includes('applet-embed') ? ' data-reveal-fade' : ''}>${q.content}</div>` : ''}
      </div>
      ${q.popup ? `<div class="note-popup m-popup hidden" id="q${q.screen}-note-popup" role="dialog" aria-modal="true" aria-label="${q.popup.title}">
        <div class="note-popup-panel">
          <button class="popup-x" type="button" aria-label="إغلاق"
            onclick="document.getElementById('q${q.screen}-note-popup').classList.add('hidden')"></button>
          <h3>${q.popup.title}</h3>
          <div class="note-popup-body">${q.popup.body}</div>
          <button class="hint-close-btn" type="button"
            onclick="document.getElementById('q${q.screen}-note-popup').classList.add('hidden')">رجوع</button>
        </div>
      </div>` : ''}
      <div class="quiz-feedbox" id="q${q.screen}-feedbox"></div>
      <div class="scq-bar">
        <button class="quiz-check" id="q${q.screen}-check" disabled onclick="quizCheck(${q.screen})">هل إجابتي صحيحة؟</button>
        ${!q.hint ? '' : `<button class="quiz-hint" id="q${q.screen}-hint" onclick="quizOpenHint(${q.screen})"
          ${q.hintPolicy === 'after-wrong' ? 'style="visibility:hidden"' : ''}><svg class="quiz-hint-icon" viewBox="0 0 25.9999 22.2883" fill="none" aria-hidden="true"><path d="M17.7925 2.76345C16.3676 1.37911 14.5057 0.68776 12.5488 0.815545C9.07995 1.04163 6.27286 3.9168 6.01796 7.50134C5.85646 9.77363 6.7035 11.9443 8.34374 13.4548C9.23036 14.2723 9.74016 15.465 9.74016 16.7265H11.2284H14.7733H16.2615C16.2615 15.4847 16.7919 14.2707 17.7181 13.3959C19.17 12.0263 20.0012 10.0751 20.0012 8.04361C20.0012 6.01215 19.1953 4.12486 17.7909 2.76018L17.7925 2.76345ZM13.0001 5.54524C11.6701 5.54524 10.5856 6.66582 10.5856 8.04525C10.5856 8.46956 10.2515 8.81524 9.84149 8.81524C9.43143 8.81524 9.09736 8.46956 9.09736 8.04525C9.09736 5.8172 10.8484 4.00527 13.0001 4.00527C13.4133 4.00527 13.7473 4.35094 13.7473 4.77525C13.7473 5.19957 13.4133 5.54524 13.0001 5.54524Z" fill="currentColor"/><path d="M9.73858 19.6245C9.73858 20.3289 9.99823 20.9908 10.478 21.4904L10.4938 21.5068C10.9783 22.0098 11.6242 22.2883 12.3114 22.2883H13.6888C14.3775 22.2883 15.025 22.0114 15.5111 21.5052C15.9956 21.0039 16.2631 20.3355 16.2631 19.6277V17.9895H9.73858V19.6245ZM11.2268 19.5294H14.7717V19.6277C14.7717 19.9243 14.6609 20.2077 14.4566 20.419C14.254 20.6254 13.9753 20.7483 13.6888 20.7483H12.3114C12.028 20.7483 11.7588 20.6336 11.5561 20.4305L11.5451 20.4174C11.3424 20.211 11.2268 19.9226 11.2268 19.6261V19.5311V19.5294Z" fill="currentColor"/><path d="M25.2558 7.27531H22.607C22.1954 7.27531 21.8629 7.62099 21.8629 8.0453C21.8629 8.46961 22.197 8.81529 22.607 8.81529H25.2558C25.6674 8.81529 25.9999 8.46961 25.9999 8.0453C25.9999 7.62099 25.6658 7.27531 25.2558 7.27531Z" fill="currentColor"/><path d="M4.1386 8.0453C4.1386 7.61935 3.80453 7.27531 3.39447 7.27531H0.744124C0.332481 7.27531 0 7.62099 0 8.0453C0 8.46961 0.334064 8.81529 0.744124 8.81529H3.39289C3.80453 8.81529 4.13701 8.46961 4.13701 8.0453H4.1386Z" fill="currentColor"/><path d="M20.8702 3.11398C21.0175 3.11398 21.1663 3.06811 21.2961 2.97472L23.4667 1.40198C23.804 1.15788 23.8847 0.677863 23.6488 0.328911C23.4129 -0.0200418 22.949 -0.105232 22.6118 0.140509L20.4412 1.71325C20.1039 1.95736 20.0232 2.43737 20.2591 2.78632C20.4032 3.00094 20.6343 3.11562 20.8702 3.11562V3.11398Z" fill="currentColor"/><path d="M4.70372 13.1172L2.53309 14.69C2.19586 14.9341 2.11512 15.4141 2.35102 15.763C2.49509 15.9777 2.72625 16.0923 2.96215 16.0923C3.10939 16.0923 3.25822 16.0465 3.38804 15.9531L5.55867 14.3803C5.8959 14.1362 5.97665 13.6562 5.74074 13.3073C5.50484 12.9583 5.04095 12.8731 4.70372 13.1189V13.1172Z" fill="currentColor"/><path d="M23.4668 14.6884L21.2961 13.1157C20.9589 12.8716 20.495 12.9567 20.2591 13.3041C20.0232 13.653 20.1055 14.133 20.4412 14.3771L22.6118 15.9499C22.7416 16.0449 22.8904 16.0891 23.0377 16.0891C23.272 16.0891 23.5032 15.9744 23.6488 15.7598C23.8847 15.4109 23.8024 14.9309 23.4668 14.6868V14.6884Z" fill="currentColor"/><path d="M5.55869 1.71322L3.38806 0.140478C3.05083 -0.103625 2.58694 -0.0184349 2.35104 0.328879C2.11513 0.677832 2.19746 1.15785 2.53311 1.40195L4.70374 2.97469C4.83356 3.06971 4.98239 3.11395 5.12963 3.11395C5.36395 3.11395 5.5951 2.99927 5.74076 2.78465C5.97666 2.4357 5.89434 1.95569 5.55869 1.71158V1.71322Z" fill="currentColor"/></svg>هل من تلميح؟</button>`}
        <button class="quiz-back" onclick="goTo(${typeof q.prev === 'number' ? q.prev : q.screen - 1})">رجوع</button>
      </div>`;
    app.insertBefore(sec, backRef);
  });
}

function quizInteractionHTML(q) {
  if (q.type === 'single' || q.type === 'multi') {
    const role = q.type === 'multi' ? 'checkbox' : 'radio';
    return `<div class="scq-answers" role="${q.type === 'multi' ? 'group' : 'radiogroup'}" aria-label="خيارات الإجابة">
      ${q.options.map(o => `
        <div class="scq-opt ${q.type === 'multi' ? 'is-multi' : ''}" role="${role}" aria-checked="false" tabindex="0"
             data-id="${o.id}" onclick="quizSelect(${q.screen}, this)"
             onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();quizSelect(${q.screen}, this);}">
          <span class="scq-radio ${q.type === 'multi' ? 'is-box' : ''}"></span>
          <span class="scq-opt-text">${o.html}</span>
        </div>`).join('')}
    </div>`;
  }
  /* 08.09 — 'custom' lets a unit own the interaction (drag-and-drop tables,
     bespoke widgets) while keeping everything else the engine gives a question:
     the stepper, attempts, the hint, the draggable feedback box and the bar.
     The unit supplies q.html, and calls quizCustomChange(screen, ready) as the
     learner works. Verdict and marking come from q.isCorrect / q.mark. */
  if (q.type === 'custom') return q.html;
  if (q.type === 'dropdown') {
    // sentence: array of text parts; blanks: [{pool, correct}] — blank i renders between parts[i] and parts[i+1]
    let html = '<div class="dd-sentence">';
    q.sentence.forEach((part, i) => {
      html += part;
      if (i < q.blanks.length) {
        const opts = q.blanks[i].pool.map(v => `<option value="${v}">${v}</option>`).join('');
        html += `<select class="dd-select" data-slot="${i}" onchange="quizDropdownChange(${q.screen})">
          <option value="">اختاروا</option>${opts}</select>`;
      }
    });
    return html + '</div>';
  }
  if (q.type === 'statement') {
    return `<div class="stmt-list">` + q.statements.map((s, i) => `
      <div class="stmt-row" data-row="${i}">
        <span class="stmt-text">${s.text}</span> <span class="stmt-pills"> <button type="button" class="stmt-pill" data-val="true" onclick="quizStatementPick(${q.screen}, ${i}, this)">صحيح</button> <button type="button" class="stmt-pill" data-val="false" onclick="quizStatementPick(${q.screen}, ${i}, this)">غير صحيح</button> </span>
      </div>`).join('') + `</div>`;
  }
  if (q.type === 'dual-select') {
    const opts = q.pool.map(y => `<option value="${y}">${y}</option>`).join('');
    return `<div class="dual-select-sentence">
      ${q.sentence.before}
      <select class="year-select" data-slot="0" onchange="quizDualChange(${q.screen})"><option value="">اختاروا سنة</option>${opts}</select>
      ${q.sentence.middle}
      <select class="year-select" data-slot="1" onchange="quizDualChange(${q.screen})"><option value="">اختاروا سنة</option>${opts}</select>
      ${q.sentence.after}
    </div>`;
  }
  if (q.type === 'value-input') {
    let slot = 0;
    /* 08.09 — size the box to the widest answer it will ever hold. The default
       96px fits three digits; once a V/X badge is painted inside it the text is
       inset another 36px, so `60.588` came back clipped to `0.588` after the
       answer was revealed. Producer: the learner must always be able to read
       what is in the field. */
    const answerChars = Math.max(4, ...[].concat(q.correctInputs || [], ...(q.altInputs || []))
      .map(a => String(a).length), 0);
    const boxStyle = ` style="width: calc(${answerChars}ch + 54px)"`;
    const input = (label) => `<input type="text" inputmode="numeric" class="vi-input" data-slot="${slot++}"${boxStyle} aria-label="${label || ''}" oninput="quizInputChange(${q.screen})">`;
    /* 08.09 — a single boxed value with its unit word beside it (percent-07
       uses it on every ValueInputQuestion). Placement is the project's bidi
       law, not a per-screen choice: word units and ₪ sit to the LEFT of the
       number, `%` to its right. In an RTL row the FIRST child renders
       rightmost, so the unit comes second — except `%`, which comes first. */
    if (q.valueBox) {
      const u = q.valueBox.unit || '';
      const pctSide = q.valueBox.unitSide === 'right';
      const box = input(q.valueBox.label || u);
      const unit = u ? `<span class="vb-unit">${u}</span>` : '';
      /* QA 14.10.26: `before`/`after` make the box sit INSIDE its sentence
         (dslide 49: "…אור ישתה a [ ] כוסות מים."). RTL: first child is
         rightmost, so `before` comes first. */
      if (q.valueBox.before || q.valueBox.after) {
        return `<div class="value-box-row vb-inline">` +
          (q.valueBox.before ? `<span class="vb-text">${q.valueBox.before}</span>` : '') + box +
          (q.valueBox.after ? `<span class="vb-text">${q.valueBox.after}</span>` : '') + `</div>`;
      }
      return `<div class="value-box-row">${pctSide ? unit + box : box + unit}</div>`;
    }
    if (q.ratioRows) {
      // rows of "label — [input] : [input]" (e.g. reduced-ratio answers)
      return `<div class="ratio-rows">` + q.ratioRows.map(row => {
        const cells = Array.from({ length: row.parts || 2 }, () => input(row.label));
        return `<div class="ratio-row"><span class="ratio-row-label">${row.label}</span><span class="ratio-row-cells" dir="ltr">${cells.join('<span class="vi-colon">:</span>')}</span></div>`;
      }).join('') + `</div>`;
    }
    // equation of two fractions; each cell is a fixed string or {input:true,label}
    const cell = (c) => (c && typeof c === 'object' && c.input) ? input(c.label) : c;
    const frac = (side) => `<span class="fraction vi-frac"><span class="frac-top">${cell(side.top)}</span><span class="frac-bottom">${cell(side.bottom)}</span></span>`;
    return `<div class="vi-equation" dir="ltr">${frac(q.equation.left)}<span class="vi-eq">=</span>${frac(q.equation.right)}</div>`;
  }
  return '';
}

/* ---------- selection handlers ---------- */
function quizSelect(screen, el) {
  const st = quizState[screen];
  const q = QUESTIONS.find(x => x.screen === screen);
  if (st.done) return;
  /* QA 18.10.26: a pick already marked ✓ on the retry stays as it is (2.3) */
  if (q.type === 'multi' && el.classList.contains('correct')) return;
  const opts = document.querySelectorAll(`#q${screen} .scq-opt`);
  // A new selection after a wrong attempt clears the wrong marks
  opts.forEach(o => o.classList.remove('wrong'));
  quizHideFeedback(screen);

  if (q.type === 'multi') {
    el.classList.toggle('selected');
    el.setAttribute('aria-checked', el.classList.contains('selected'));
    st.selectedSet = [...opts].filter(o => o.classList.contains('selected')).map(o => o.dataset.id);
    document.getElementById(`q${screen}-check`).disabled = st.selectedSet.length === 0;
  } else {
    opts.forEach(o => { o.classList.remove('selected'); o.setAttribute('aria-checked', 'false'); });
    el.classList.add('selected');
    el.setAttribute('aria-checked', 'true');
    st.selected = el.dataset.id;
    document.getElementById(`q${screen}-check`).disabled = false;
  }
}

function quizDualChange(screen) {
  const st = quizState[screen];
  if (st.done) return;
  quizHideFeedback(screen);
  const sels = [...document.querySelectorAll(`#q${screen} .year-select`)];
  sels.forEach(s => s.classList.remove('wrong'));
  st.selectedSet = sels.map(s => s.value);
  document.getElementById(`q${screen}-check`).disabled = st.selectedSet.some(v => !v);
}

function quizInputChange(screen) {
  document.querySelectorAll(`#q${screen} .vi-input`).forEach(i => {
    const clean = i.value.replace(/[^0-9.,]/g, '');
    if (clean !== i.value) i.value = clean;
  });
  const st = quizState[screen];
  if (st.done) return;
  quizHideFeedback(screen);
  const inputs = [...document.querySelectorAll(`#q${screen} .vi-input`)];
  inputs.forEach(i => i.classList.remove('wrong'));
  st.selectedSet = inputs.map(i => i.value.trim());
  document.getElementById(`q${screen}-check`).disabled = st.selectedSet.some(v => !v);
}

function quizCustomChange(screen, ready) {
  const st = quizState[screen];
  if (st.done) return;
  quizHideFeedback(screen);
  document.getElementById(`q${screen}-check`).disabled = !ready;
}

function quizDropdownChange(screen) {
  const st = quizState[screen];
  if (st.done) return;
  quizHideFeedback(screen);
  const sels = [...document.querySelectorAll(`#q${screen} .dd-select`)];
  sels.forEach(s => s.classList.remove('wrong'));
  st.selectedSet = sels.map(s => s.value);
  document.getElementById(`q${screen}-check`).disabled = st.selectedSet.some(v => !v);
}

function quizStatementPick(screen, row, el) {
  const st = quizState[screen];
  if (st.done) return;
  quizHideFeedback(screen);
  const rowEl = el.closest('.stmt-row');
  rowEl.classList.remove('wrong');
  rowEl.querySelectorAll('.stmt-pill').forEach(p => p.classList.remove('selected'));
  el.classList.add('selected');
  st.selectedSet = [...document.querySelectorAll(`#q${screen} .stmt-row`)].map(r =>
    r.querySelector('.stmt-pill.selected')?.dataset.val || '');
  document.getElementById(`q${screen}-check`).disabled = st.selectedSet.some(v => !v);
}

/* ---------- check / feedback ---------- */
function quizIsCorrect(q, st) {
  if (q.type === 'single') return st.selected === q.correct;
  if (q.type === 'multi') {
    return q.correctSet.length === st.selectedSet.length &&
      q.correctSet.every(id => st.selectedSet.includes(id));
  }
  if (q.type === 'dual-select') {
    const pair = [...st.selectedSet].sort();
    return JSON.stringify(pair) === JSON.stringify([...q.correctPair].sort()) &&
      st.selectedSet[0] !== st.selectedSet[1];
  }
  if (q.type === 'dropdown') {
    return st.selectedSet.every((v, i) => v === q.blanks[i].correct);
  }
  if (q.type === 'statement') {
    return st.selectedSet.every((v, i) => v === String(q.statements[i].correct));
  }
  if (q.type === 'custom') return !!q.isCorrect(quizState[q.screen]);
  if (q.type === 'value-input') {
    const matches = (arr) => st.selectedSet.length === arr.length && st.selectedSet.every((v, i) => v === arr[i]);
    return matches(q.correctInputs) || (q.altInputs || []).some(matches);
  }
  return false;
}

function quizCheck(screen) {
  const st = quizState[screen];
  const q = QUESTIONS.find(x => x.screen === screen);
  /* 08.09 — q.next / q.prev let a unit route a question somewhere other than
     the adjacent screen. percent-07 deck slide 19 is a section menu: each of
     its squares opens a section, and the section's last question returns to
     the menu rather than falling through to the next screen number. */
  if (st.done) {
    if (q.embedIn !== undefined) return;   /* inside a scroll set only the host's המשך moves on */
    goTo(typeof q.next === 'number' ? q.next : screen + 1); return;
  }

  st.attempts += 1;
  const correct = quizIsCorrect(q, st);

  st.wasCorrect = correct;
  if (correct) {
    const hintBtn = document.getElementById(`q${screen}-hint`);
    if (hintBtn) hintBtn.style.display = 'none';
    quizMarkOutcome(screen, q, true);
    quizShowFeedback(screen, 'correct', q.fb.correct);
    if (typeof q.afterFeedback === 'function') q.afterFeedback(screen, q, true);
    quizFinish(screen);
  } else if (st.attempts >= q.maxAttempts) {
    const hintBtn = document.getElementById(`q${screen}-hint`);
    if (hintBtn) hintBtn.style.display = 'none';
    /* QA 18.10.26: read BEFORE quizMarkOutcome, which rewrites the picks */
    const partial = quizAnyPartRight(q, st);
    quizMarkOutcome(screen, q, false);
    const fb = { ...q.fb.wrong };
    /* a partly-right answer gets the approved partial title (TEMPLATES.md,
       Sept QA conventions); a screen with its own bespoke title keeps it */
    if (partial && fb.title === FB_WRONG_TITLE) fb.title = FB_PARTIAL_TITLE;
    else if (partial && fb.title === FB_WRONG_TITLE_SHORT) fb.title = FB_PARTIAL_TITLE_SHORT;
    quizShowFeedback(screen, 'wrong', fb);
    if (q.type === 'value-input' || q.type === 'dropdown') quizAnswerToggleAdd(screen, q);
    /* 08.09 — anything a question wants to add INSIDE the feedback box has to
       run after quizShowFeedback, which rewrites the box's innerHTML. A custom
       question that appended its "חזרה לתשובה שלי" button from q.mark() had it
       wiped a line later. */
    if (typeof q.afterFeedback === 'function') q.afterFeedback(screen, q, false);
    quizFinish(screen);
  } else {
    /* QA 18.10.26 (2.3, producer 11.10): when part of the answer is already
       right the retry line says so — read BEFORE quizMarkRetry, which drops
       the wrong picks from st.selectedSet */
    const partial = q.fb.retryPartial && quizAnyPartRight(q, st);
    quizMarkRetry(screen, q);
    quizShowFeedback(screen, 'wrong', { title: partial ? q.fb.retryPartial : q.fb.retry, body: '' });
    if (q.hintPolicy === 'after-wrong') {
      const hb = document.getElementById(`q${screen}-hint`);
      if (hb) hb.style.visibility = 'visible';
    }
    document.getElementById(`q${screen}-check`).disabled = true; // until a new selection
  }
}

/* Did the learner get ANY part of a multi-part answer right? (2.3) */
function quizAnyPartRight(q, st) {
  if (q.type === 'custom') return !!(q.anyPartRight && q.anyPartRight());
  if (q.type === 'multi') return (st.selectedSet || []).some(id => q.correctSet.includes(id));
  if (q.type === 'dropdown') return st.selectedSet.some((v, i) => v === q.blanks[i].correct);
  if (q.type === 'value-input' && q.correctInputs.length > 1) {
    return q.correctInputs.some((v, i) => (st.selectedSet[i] || '') === v);
  }
  return false;
}

function quizMarkRetry(screen, q) {
  if (q.type === 'custom') { if (q.markRetry) q.markRetry(screen, q); return; }
  if (q.type === 'multi') {
    /* QA 18.10.26 (2.3, producer 07.10 "in general"): a partial first attempt
       keeps the picks that ARE right in the ✓ state — still checked and
       locked — and only the wrong picks go ✗ and come unchecked */
    document.querySelectorAll(`#q${screen} .scq-opt.selected`).forEach(o => {
      if (q.correctSet.includes(o.dataset.id)) {
        o.classList.add('correct');
      } else {
        o.classList.remove('selected');
        o.classList.add('wrong');
        o.setAttribute('aria-checked', 'false');
      }
    });
    quizState[screen].selectedSet = [...document.querySelectorAll(`#q${screen} .scq-opt.selected`)].map(o => o.dataset.id);
  } else if (q.type === 'single') {
    document.querySelectorAll(`#q${screen} .scq-opt.selected`).forEach(o => {
      o.classList.remove('selected');
      o.classList.add('wrong');
      o.setAttribute('aria-checked', 'false');
    });
    quizState[screen].selected = null;
    quizState[screen].selectedSet = [];
  } else if (q.type === 'dual-select') {
    document.querySelectorAll(`#q${screen} .year-select`).forEach(s => s.classList.add('wrong'));
  } else if (q.type === 'value-input') {
    document.querySelectorAll(`#q${screen} .vi-input`).forEach(i => i.classList.add('wrong'));
  } else if (q.type === 'dropdown') {
    const sels = [...document.querySelectorAll(`#q${screen} .dd-select`)];
    sels.forEach((s, i) => { if (s.value !== q.blanks[i].correct) s.classList.add('wrong'); });
  } else if (q.type === 'statement') {
    [...document.querySelectorAll(`#q${screen} .stmt-row`)].forEach((r, i) => {
      const pick = r.querySelector('.stmt-pill.selected');
      if (pick && pick.dataset.val !== String(q.statements[i].correct)) r.classList.add('wrong');
    });
  }
}

function quizMarkOutcome(screen, q, isCorrect) {
  if (q.type === 'custom') { if (q.mark) q.mark(screen, q, isCorrect); return; }
  if (q.type === 'single' || q.type === 'multi') {
    const correctIds = q.type === 'multi' ? q.correctSet : [q.correct];
    document.querySelectorAll(`#q${screen} .scq-opt`).forEach(o => {
      const inCorrect = correctIds.includes(o.dataset.id);
      const wasChosen = o.classList.contains('selected');
      o.classList.remove('selected');
      if (inCorrect) o.classList.add('correct');
      else if (wasChosen && !isCorrect) o.classList.add('wrong');
    });
  } else if (q.type === 'dual-select') {
    const sels = [...document.querySelectorAll(`#q${screen} .year-select`)];
    if (!isCorrect) sels.forEach((s, i) => { s.value = q.correctPair[i]; });
    sels.forEach(s => { s.classList.remove('wrong'); s.classList.add('correct'); s.disabled = true; });
  } else if (q.type === 'value-input') {
    const inputs = [...document.querySelectorAll(`#q${screen} .vi-input`)];
    const st = quizState[screen];
    // per-field verdict (partial answers get per-input V/X, notes 50/63)
    const altSets = [q.correctInputs, ...(q.altInputs || [])];
    const best = altSets.find(arr => arr.every((v, i) => (st.selectedSet[i] || '') === v)) ||
      altSets.reduce((a, b) =>
        b.filter((v, i) => (st.selectedSet[i] || '') === v).length >
        a.filter((v, i) => (st.selectedSet[i] || '') === v).length ? b : a, q.correctInputs);
    st.userInputs = inputs.map(i => i.value);
    st.answerKey = best;
    st.slotOk = best.map((v, i) => (st.selectedSet[i] || '') === v);
    inputs.forEach((inp, i) => {
      inp.classList.remove('wrong', 'correct');
      inp.classList.add(st.slotOk[i] ? 'mark-ok' : 'mark-bad');
      inp.classList.add(st.slotOk[i] ? 'correct' : 'wrong');
      inp.disabled = true;
    });
  } else if (q.type === 'dropdown') {
    const sels = [...document.querySelectorAll(`#q${screen} .dd-select`)];
    /* QA 18.10.26: the reveal overwrites the learner's picks, so keep them
       for the התשובה שלי / התשובה הנכונה toggle */
    const st = quizState[screen];
    st.userInputs = sels.map(s => s.value);
    st.answerKey = q.blanks.map(b => b.correct);
    st.slotOk = sels.map((s, i) => s.value === q.blanks[i].correct);
    sels.forEach((s, i) => {
      const ok = s.value === q.blanks[i].correct;
      if (!isCorrect && !ok) s.classList.add('wrong'); else s.classList.remove('wrong');
      if (!ok) s.value = q.blanks[i].correct;
      if (ok || isCorrect) s.classList.add('correct');
      s.disabled = true;
    });
  } else if (q.type === 'statement') {
    [...document.querySelectorAll(`#q${screen} .stmt-row`)].forEach((r, i) => {
      const correctVal = String(q.statements[i].correct);
      r.querySelectorAll('.stmt-pill').forEach(p => {
        p.disabled = true;
        const picked = p.classList.contains('selected');
        if (p.dataset.val === correctVal) p.classList.add('correct');
        else if (picked && !isCorrect) p.classList.add('wrong');
      });
    });
  }
}

/* magnifier zoom for content images (note 67, גורף) */
function quizImageZoomInit(scope) {
  /* QA 14.10.26: `data-zoom` opts in an image that lives outside the question
     and explanation layouts (dslide 47's photo); it skips the load-time width
     check, which reads 0 for an image on a hidden screen */
  (scope || document).querySelectorAll('.quiz-content img, .explain-content img, img[data-zoom]').forEach(img => {
    /* 09.09 — `data-no-zoom` is the per-image opt-out. Not every content image
       is worth a magnifier; percent-07 deck slide 66 stacks two small reference
       pictures the producer wants left plain. */
    if (img.closest('.img-zoom-wrap') || img.closest('.character-widget')
        || img.hasAttribute('data-no-zoom') || (!img.hasAttribute('data-zoom') && img.width < 120)) return;
    const wrap = document.createElement('span');
    wrap.className = 'img-zoom-wrap';
    img.parentNode.insertBefore(wrap, img);
    wrap.appendChild(img);
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'applet-zoom-btn img-zoom-btn';
    btn.setAttribute('aria-label', 'تكبير الصورة');
    /* the approved magnifier (template-library ZoomCloseControl, Figma
       1589:17043) — ring + handle, no "+"; same glyph as the applet zoom */
    btn.innerHTML = '<svg width="21" height="21" viewBox="0 0 21 21" fill="none" aria-hidden="true"><circle cx="8.5" cy="8.5" r="6.5" stroke="currentColor" stroke-width="2"/><line x1="13.5" y1="13.5" x2="19" y2="19" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg>';
    btn.onclick = () => quizImageZoomOpen(img.src, img.alt, img);
    wrap.appendChild(btn);
  });
}
/* QA 14.10.26: a zoom must actually ENLARGE. Open at max(natural, 1.6 × the
   size the slide shows), capped at 94% of the stage — the natural size alone
   left dslide 47's 513px photo at ×1.19 of its 430px slot. */
function quizImageZoomOpen(src, alt, fromEl) {
  let ov = document.getElementById('img-zoom-overlay');
  if (!ov) {
    ov = document.createElement('div');
    ov.id = 'img-zoom-overlay';
    /* the approved 44px close chip needs BOTH classes — `.applet-close-btn`
       alone renders a bare 19px glyph */
    ov.innerHTML = '<button type="button" class="applet-zoom-btn applet-close-btn" aria-label="إغلاق" onclick="quizImageZoomClose()">' +
      '<svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true"><line x1="2" y1="2" x2="13" y2="13" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><line x1="13" y1="2" x2="2" y2="13" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg></button>' +
      '<img alt="">';
    document.getElementById('app').appendChild(ov);
    ov.addEventListener('click', e => { if (e.target === ov) quizImageZoomClose(); });
  }
  const zi = ov.querySelector('img');
  zi.src = src;
  zi.alt = alt || '';
  zi.style.width = ''; zi.style.maxWidth = ''; zi.style.maxHeight = '';
  if (fromEl) {
    const app = document.getElementById('app');
    const scale = app.getBoundingClientRect().width / 1280 || 1;
    const shown = fromEl.getBoundingClientRect();
    const ratio = (fromEl.naturalHeight || shown.height) / (fromEl.naturalWidth || shown.width);
    let w = Math.max(fromEl.naturalWidth || 0, (shown.width / scale) * 1.6);
    w = Math.min(w, 1280 * 0.94, (710 * 0.94) / ratio);
    zi.style.width = Math.round(w) + 'px';
    zi.style.maxWidth = 'none'; zi.style.maxHeight = 'none';
  }
  ov.style.display = 'grid';
}
function quizImageZoomClose() {
  const ov = document.getElementById('img-zoom-overlay');
  if (ov) ov.style.display = 'none';
}
document.addEventListener('DOMContentLoaded', () => setTimeout(() => quizImageZoomInit(), 50));

/* show-correct-answer / my-answer toggle inside the feedback box (note 63) */
function quizAnswerToggleAdd(screen, q) {
  const box = document.getElementById(`q${screen}-feedbox`);
  const st = quizState[screen];
  if (!box || !st.answerKey) return;
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'fb-answer-toggle';
  btn.dataset.mode = 'correct';
  btn.textContent = 'إجابتي';
  /* QA 18.10.26: the dropdown reveal overwrites the picks too — same toggle */
  const fields = () => [...document.querySelectorAll(`#q${screen} ${q.type === 'dropdown' ? '.dd-select' : '.vi-input'}`)];
  const isDd = q.type === 'dropdown';
  btn.onclick = () => {
    const showMine = btn.dataset.mode === 'correct';
    fields().forEach((inp, i) => {
      inp.value = showMine ? (st.userInputs[i] || '') : st.answerKey[i];
      if (!isDd) {
        inp.classList.toggle('mark-ok', !showMine || st.slotOk[i]);
        inp.classList.toggle('mark-bad', showMine && !st.slotOk[i]);
      }
      inp.classList.toggle('correct', !showMine || st.slotOk[i]);
      inp.classList.toggle('wrong', showMine && !st.slotOk[i]);
    });
    btn.dataset.mode = showMine ? 'mine' : 'correct';
    btn.textContent = showMine ? 'الإجابة الصحيحة' : 'إجابتي';
  };
  box.appendChild(btn);
  // start by showing the correct answer (template default)
  fields().forEach((inp, i) => {
    inp.value = st.answerKey[i];
    if (!isDd) { inp.classList.add('mark-ok'); inp.classList.remove('mark-bad'); }
    inp.classList.add('correct');
    inp.classList.remove('wrong');
  });
}

/* feedback boxes are draggable so they never hide the question (notes 38/58) */
function quizFeedboxDrag(box) {
  if (box.dataset.dragWired) return;
  box.dataset.dragWired = '1';
  let sx = 0, sy = 0, ox = 0, oy = 0, dragging = false;
  box.addEventListener('pointerdown', (e) => {
    if (e.target.closest('button, a, input, select')) return;
    dragging = true;
    sx = e.clientX; sy = e.clientY;
    const t = (box.style.transform.match(/translate\((-?[\d.]+)px, (-?[\d.]+)px\)/) || [0, 0, 0]);
    ox = parseFloat(t[1]) || 0; oy = parseFloat(t[2]) || 0;
    box.setPointerCapture(e.pointerId);
    box.style.cursor = 'grabbing';
  });
  box.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    box.style.transform = `translate(${ox + e.clientX - sx}px, ${oy + e.clientY - sy}px)`;
  });
  const stop = () => { dragging = false; box.style.cursor = ''; };
  box.addEventListener('pointerup', stop);
  box.addEventListener('pointercancel', stop);
}

function quizFinish(screen) {
  const st = quizState[screen];
  st.done = true;
  quizStepperUpdate(screen);
  document.querySelectorAll(`#q${screen} .scq-opt`).forEach(o => o.classList.add('locked'));
  const check = document.getElementById(`q${screen}-check`);
  /* QA 18.10.26: the LAST question of a peak-question set (שאלת שיא) reads
     "סיימתי" after its feedback — `finishLabel` opts a question in */
  const q = QUESTIONS.find(x => x.screen === screen);
  check.textContent = (q && q.finishLabel) || 'متابعة؟';
  check.disabled = false;
  /* QA 02.11.26 (scroll set): an answered צדקתי? only disables - it never
     becomes שנמשיך?; the host screen opens the next section */
  if (q && q.embedIn !== undefined) {
    check.textContent = 'هل إجابتي صحيحة؟';
    check.disabled = true;
    if (typeof ssResolved === 'function') ssResolved(q.embedIn, screen);
  }
  const hint = document.getElementById(`q${screen}-hint`);
  if (hint) hint.disabled = true;
}

function quizShowFeedback(screen, kind, fb) {
  /* 08.09 — a screen may hold art that only enters WITH the feedback
     (percent-07 deck slide 44: "דמות עולה אחרי המשוב (נכון או טעות)").
     Mark it `.cw-after-fb hidden` in q.content and it is revealed here. */
  document.querySelectorAll(`#q${screen} .cw-after-fb[hidden]`).forEach(el => {
    el.hidden = false;
    if (typeof decorateBubbles === 'function') decorateBubbles(el.parentElement || el);
  });
  const box = document.getElementById(`q${screen}-feedbox`);
  box.className = `quiz-feedbox ${kind === 'correct' ? 'is-correct' : 'is-wrong'}`;
  box.style.transform = '';
  quizFeedboxDrag(box);
  box.innerHTML = `
    <div class="scq-fb-title">${fb.title}</div>${fb.body ? `<div class="fb-body">${fb.body}</div>` : ''}`;
}

function quizHideFeedback(screen) {
  const box = document.getElementById(`q${screen}-feedbox`);
  box.className = 'quiz-feedbox';
  box.innerHTML = '';
}

/* ---------- hint (shared overlay, populated per question) ---------- */
function quizOpenHint(screen) {
  const st = quizState[screen];
  const q = QUESTIONS.find(x => x.screen === screen);
  /* 07.09 producer: a hint reopens as often as the learner wants. Closing it
     used to latch `hintUsed` and disable the button for good. The button is
     already removed outright once the question resolves, so `done` is the
     only state that still closes it off. */
  if (st.done) return;
  const overlay = document.getElementById('quiz-hint-overlay');
  overlay.dataset.forScreen = screen;
  /* .hint-title-text, not .hint-title: the title element holds the bulb icon as
     its first child, and assigning textContent to the PARENT deletes it. */
  overlay.querySelector('.hint-title-text').textContent = 'هل تتذكرون كيف تحسبون؟';
  overlay.querySelector('.hint-body').innerHTML = q.hint.body;
  overlay.classList.remove('hidden');
}

function quizCloseHint() {
  const overlay = document.getElementById('quiz-hint-overlay');
  if (!overlay || overlay.classList.contains('hidden')) return;
  const screen = Number(overlay.dataset.forScreen);
  overlay.classList.add('hidden');
  if (quizState[screen]) {
    quizState[screen].hintUsed = true;   /* recorded for reporting, no longer a lock */
  }
}

/* resetScreenState hook — completed questions stay locked (resume-state) */
function quizResetScreenState(screen) {
  quizStepperUpdate(screen);
  const st = quizState[screen];
  if (!st || st.done) return;
  // in-progress state is left as-is on return navigation
}
