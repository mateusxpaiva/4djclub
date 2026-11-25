/**
 * 4DJClub — backend simples (Google Planilhas + Apps Script)
 *
 * Recebe três tipos de envio, todos num só endereço:
 *   tipo=espera   → aba "Lista de espera"  (página /lista)
 *   tipo=cadastro → aba "Usuários"         (tela de entrada da cabine)
 *   tipo=acesso   → atualiza "Último acesso" e "Acessos" do usuário
 *
 * Como instalar:
 *  1. Crie uma planilha nova no Google e abra Extensões › Apps Script.
 *  2. Apague o que estiver lá, cole este arquivo e salve.
 *  3. Implantar › Nova implantação › App da Web
 *       Executar como: Eu  ·  Quem pode acessar: Qualquer pessoa
 *  4. Copie o endereço que termina em /exec e cole:
 *       - em `const API=''` no index.html (cabine)
 *       - em `const ENDPOINT=''` no lista/index.html (lista de espera)
 *  Ao mudar este código depois, use Implantar › Gerenciar implantações › editar › Nova versão
 *  (assim o endereço continua o mesmo).
 */
const ABAS = {
  espera:   { nome: 'Lista de espera', cab: ['Data', 'Nome', 'E-mail', 'WhatsApp', 'Cidade', 'Nível', 'Controladora', 'Instagram', 'Consentimento', 'Origem'] },
  usuarios: { nome: 'Usuários',        cab: ['Criado em', 'Nome artístico', 'E-mail', 'Cidade', 'Nível', 'Controladora', 'Consentimento', 'Último acesso', 'Acessos'] }
};

function doPost(e) {
  const p = (e && e.parameter) || {};
  if (p.website) return ok_();                                        // robô (campo escondido preenchido)
  const email = String(p.email || '').trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return ok_();
  const tipo = String(p.tipo || 'espera');

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    if (tipo === 'cadastro') cadastro_(p, email);
    else if (tipo === 'acesso') acesso_(p, email);
    else espera_(p, email);
  } finally {
    lock.releaseLock();
  }
  return ok_();
}

function doGet() { return ContentService.createTextOutput('4DJClub backend: ok'); }

function espera_(p, email) {
  if (p.consent !== 'sim') return;
  const sh = aba_(ABAS.espera);
  if (linha_(sh, email) > 0) return;                                  // já está na lista
  sh.appendRow([new Date(), limpa_(p.nome, 80), email, limpa_(p.whats, 20), limpa_(p.cidade, 60),
    limpa_(p.nivel, 40), limpa_(p.controladora, 40), limpa_(p.insta, 40), 'sim', limpa_(p.origem, 40)]);
}

function cadastro_(p, email) {
  if (p.consent !== 'sim') return;
  const sh = aba_(ABAS.usuarios);
  const r = linha_(sh, email), agora = new Date();
  const dados = [limpa_(p.dj, 40), email, limpa_(p.cidade, 60), limpa_(p.nivel, 40), limpa_(p.controladora, 40), 'sim'];
  if (r > 0) {
    sh.getRange(r, 2, 1, dados.length).setValues([dados]);
    sh.getRange(r, 8).setValue(agora);
  } else {
    sh.appendRow([agora].concat(dados, [agora, 1]));
  }
}

function acesso_(p, email) {
  const sh = aba_(ABAS.usuarios);
  const r = linha_(sh, email);
  if (r < 1) return;                                                  // só conta quem tem cadastro
  sh.getRange(r, 8).setValue(new Date());
  const c = sh.getRange(r, 9);
  c.setValue((Number(c.getValue()) || 0) + 1);
}

function aba_(def) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName(def.nome) || ss.insertSheet(def.nome);
  if (sh.getLastRow() === 0) { sh.appendRow(def.cab); sh.setFrozenRows(1); sh.getRange(1, 1, 1, def.cab.length).setFontWeight('bold'); }
  return sh;
}

// Linha do e-mail (coluna C nas duas abas) ou 0 se não existir.
function linha_(sh, email) {
  const n = sh.getLastRow();
  if (n < 2) return 0;
  const col = sh.getRange(2, 3, n - 1, 1).getValues();
  for (let i = 0; i < col.length; i++) if (String(col[i][0]).toLowerCase() === email) return i + 2;
  return 0;
}

// Corta o tamanho e impede que um texto vire fórmula na planilha.
function limpa_(v, max) {
  let s = String(v == null ? '' : v).trim().slice(0, max);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}

function ok_() { return ContentService.createTextOutput('ok'); }
