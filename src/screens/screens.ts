import { QUESTIONS, type Taste } from '../quiz/questions';

export function offScreen(): string {
  return `<div class="off">MiriamOS · <span class="hint">scrivi «bonjour»</span></div>`;
}

export function bootScreen(): string {
  return `<div class="boot"><div class="logo"></div><p>MiriamOS</p></div>`;
}

export function loadingScreen(msg: string): string {
  return `<div class="loading"><div class="pulse"></div><p>${msg}</p></div>`;
}

export function questionScreen(index: number, onPick: (t: Taste) => void): HTMLElement {
  const q = QUESTIONS[index];
  const wrap = document.createElement('div');
  wrap.className = 'quiz';
  wrap.innerHTML = `<h2>Test de français (${index + 1}/${QUESTIONS.length})</h2><p>${q.prompt}</p>`;
  const opts = document.createElement('div');
  opts.className = 'quiz-opts';
  q.answers.forEach((a) => {
    const b = document.createElement('button');
    b.textContent = a.label;
    b.onclick = () => onPick(a.taste);
    opts.appendChild(b);
  });
  wrap.appendChild(opts);
  return wrap;
}
