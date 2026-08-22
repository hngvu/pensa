export function generateRank(prev: string | undefined, next: string | undefined): string {
  const minChar = 97; // 'a'
  const maxChar = 122; // 'z'
  
  let p = prev || '';
  let n = next || '';
  
  if (!p && !n) return 'm';
  
  let pos = 0;
  while (true) {
    let pChar = pos < p.length ? p.charCodeAt(pos) : minChar - 1;
    let nChar = pos < n.length ? n.charCodeAt(pos) : maxChar + 1;
    
    if (pChar === nChar) {
      pos++;
      continue;
    }
    
    if (nChar - pChar > 1) {
      const mid = Math.floor((pChar + nChar) / 2);
      return p.slice(0, pos) + String.fromCharCode(mid);
    }
    
    p = p.padEnd(pos + 2, 'a');
    n = n.padEnd(pos + 2, 'z');
    pos++;
  }
}
