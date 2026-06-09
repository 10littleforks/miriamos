export type CommandId =
  | 'power-on' | 'power-off' | 'brightness-up' | 'brightness-down'
  | 'open' | 'unknown';

export interface ParsedCommand {
  id: CommandId;
  arg?: string;
}

interface Rule {
  id: CommandId;
  test: RegExp;
  /** estrae l'argomento dal match, se presente */
  arg?: (m: RegExpMatchArray) => string;
}

const RULES: Rule[] = [
  { id: 'power-on', test: /^(bonjour|bonsoir)$/i },
  { id: 'power-off', test: /^merci au revoir$/i },
  { id: 'brightness-up', test: /^volumus maxima$/i },
  { id: 'brightness-down', test: /^volumus minima$/i },
  { id: 'open', test: /^alò mora\s+(.+)$/i, arg: (m) => m[1].trim() },
];

export function parseCommand(input: string): ParsedCommand | null {
  const text = input.trim().replace(/\s+/g, ' ');
  if (!text) return null;
  for (const rule of RULES) {
    const m = text.match(rule.test);
    if (m) return { id: rule.id, arg: rule.arg?.(m) };
  }
  return { id: 'unknown' };
}
