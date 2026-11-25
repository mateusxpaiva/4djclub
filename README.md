# 4DJClub

Cabine de DJ no navegador: dois decks, mixer, controladora MIDI, câmera, gravação do set em vídeo e áudio, pontuação das mixagens e B2B ao vivo entre duas casas.

> Todo mundo pode ser DJ ao menos 1 dia.

## O que tem aqui

| Caminho | O que é |
|---|---|
| `index.html` | A cabine (abre com a tela de cadastro) |
| `lista/index.html` | Página da lista de espera |
| `backend/Code.gs` | Código do Google Apps Script que grava cadastros e lista de espera numa planilha |
| `tools/mixxx2map.js` | Conversor de mapeamentos MIDI do Mixxx para o formato do 4DJClub |

## Pôr no ar

1. **GitHub Pages:** Settings › Pages › Source: *Deploy from a branch* › Branch `main` / pasta `/ (root)` › Save.
   Em 1–2 minutos a cabine fica em `https://mateusxpaiva.github.io/4djclub/` e a lista em `.../4djclub/lista/`.
2. **Planilha:** siga as instruções no topo de `backend/Code.gs`.
3. Cole o endereço `/exec` do Apps Script em `const API=''` (`index.html`) e em `const ENDPOINT=''` (`lista/index.html`), e faça commit.

Sem o passo 3 a cabine funciona normalmente; o cadastro só fica salvo no navegador de cada pessoa.

## Como testar

- Use o **Chrome no computador** (MIDI, câmera e B2B precisam dele).
- Controladoras Pioneer DDJ-FLX4, DDJ-400, DDJ-SB3 e SB2 são reconhecidas sozinhas. Para outras (ex.: XDJ-RX3), use **Assistente passo a passo** no painel MIDI.
- B2B: um cria a sala, o outro entra com o código de 5 letras.

## Cadastro (versão simples)

Nome artístico, e-mail, cidade, nível e controladora, com consentimento. Não há senha nesta versão: serve para identificar quem está testando. Próximo passo: login de verdade (ex.: Google ou link por e-mail).
