import './style.css';
import './renderer/treemap-view.css';
import { createSession } from './session/session';
import { createFs } from './fs/fs';
import { loadTree, saveTree } from './fs/storage';
import { AudioEngine } from './audio/engine';
import { TreemapView } from './renderer/treemap-view';
import { parseCommand } from './commands/commands';
import { buildProfile } from './quiz/profile';
import { personalize } from './personalize/personalize';
import { QUESTIONS, type Taste } from './quiz/questions';
import { offScreen, bootScreen, loadingScreen, questionScreen } from './screens/screens';

const screen = document.getElementById('screen')!;
const cmd = document.getElementById('cmd') as HTMLInputElement;
const reply = document.getElementById('cmd-reply')!;
const app = document.getElementById('app')!;

const audio = new AudioEngine();
const session = createSession();

const fs = createFs(loadTree() ?? []);
let view: TreemapView | null = null;
const answers: Taste[] = [];
let qIndex = 0;

const persistFs = () => saveTree(fs.snapshot());

// Registrato una volta sola: ridisegna il quadro e persiste a ogni mutazione.
// (Evita l'accumulo di listener a ogni accensione.)
fs.onChange(() => { view?.render(fs.list()); persistFs(); });

function newId(): string {
  return 'n' + Math.random().toString(36).slice(2, 9);
}

function showDesktop() {
  view = new TreemapView({ audio, onSelect: () => {} });
  screen.replaceChildren(view.el);
  view.render(fs.list());
}

function nextQuestion() {
  if (qIndex >= QUESTIONS.length) { session.send('testDone'); return; }
  screen.replaceChildren(
    questionScreen(qIndex, (t) => { answers.push(t); qIndex++; nextQuestion(); }),
  );
}

session.subscribe((phase) => {
  if (phase === 'BOOTING') {
    screen.innerHTML = bootScreen();
    audio.playEvent('boot');
    setTimeout(() => session.send('booted'), 1600);
  } else if (phase === 'TEST') {
    qIndex = 0; answers.length = 0;
    nextQuestion();
  } else if (phase === 'PERSONALIZING') {
    const p = personalize(buildProfile(answers));
    document.documentElement.style.setProperty('--accent', p.accent);
    screen.innerHTML = loadingScreen('Je prépare ton univers…');
    audio.playEvent('loading');
    const existing = new Set(fs.list().map((n) => n.name));
    p.seedNodes.filter((n) => !existing.has(n.name)).forEach((n) => fs.create(n));
    persistFs();
    setTimeout(() => session.send('personalized'), 1800);
  } else if (phase === 'DESKTOP') {
    showDesktop();
  } else if (phase === 'SHUTTING_DOWN') {
    audio.playEvent('shutdown');
    app.classList.add('dissolve');
    setTimeout(() => { app.classList.remove('dissolve'); session.send('off'); }, 1400);
  } else if (phase === 'OFF') {
    screen.innerHTML = offScreen();
  }
});

function handleCommand(text: string) {
  const parsed = parseCommand(text);
  reply.textContent = '';
  if (!parsed) return;
  audio.resume();

  switch (parsed.id) {
    case 'power-on':
      if (session.phase === 'OFF') session.send('powerOn');
      break;
    case 'power-off':
      if (session.phase === 'DESKTOP') session.send('powerOff');
      break;
    case 'brightness-up':
      document.documentElement.style.setProperty('--brightness', '1.25');
      break;
    case 'brightness-down':
      document.documentElement.style.setProperty('--brightness', '0.7');
      break;
    case 'open':
      if (session.phase === 'DESKTOP' && parsed.arg) {
        if (/virus/i.test(parsed.arg)) { audio.playEvent('opera'); reply.textContent = '🦠 Fragnen ist mir Vater!'; break; }
        fs.create({ id: newId(), name: parsed.arg, type: 'documento', size: 6 });
        audio.playEvent('create');
      }
      break;
    case 'unknown':
      audio.playEvent('error');
      reply.textContent = 'MiriamOS non capisce, ma ti vuole bene.';
      break;
  }
}

cmd.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') { handleCommand(cmd.value); cmd.value = ''; }
});

screen.innerHTML = offScreen();
