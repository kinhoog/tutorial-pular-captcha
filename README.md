# Tutorial de pular o CAPTCHA

Landing page estática para uso interno da clínica. O site orienta a instalação e o uso da extensão aprovada para auxiliar na validação de CAPTCHA, com sete etapas em imagens e um tutorial completo em vídeo.

**Site publicado:** https://kinhoog.github.io/tutorial-pular-captcha/

**Navegador recomendado:** Microsoft Edge.

## Tecnologias utilizadas

- HTML5;
- CSS moderno;
- JavaScript puro;
- hospedagem estática pelo GitHub Pages.

O projeto não exige npm, instalação de dependências, backend ou acesso à internet para funcionar localmente.

## Estrutura do projeto

```text
Captcha tutorial/
├── index.html
├── style.css
├── script.js
├── README.md
├── .gitignore
├── .nojekyll
├── Hero.mp4
├── Tutorial.mp4
├── Imagem 1 - Clicar no ícone das extensões.png
├── Imagem 2 - Clicar em gerenciar extensões.png
├── Imagem 3 - Clicar em Encontre mais extensões e temas na Chrome Web Store.png
├── Imagem 4 - Buscar por Captcha e clicar no primeiro.png
├── Imagem 5 - Clicar em Usar no Chrome.png
├── Imagem 6 - Clicar em Adicionar Extensão.png
├── Imagem 7 - Se apareceu isso é porque deu certo.png
├── Instruções após as imagens.txt
└── assets/
    ├── images/
    │   ├── passo-01-extensoes.png
    │   ├── passo-02-gerenciar-extensoes.png
    │   ├── passo-03-web-store.png
    │   ├── passo-04-pesquisar-captcha.png
    │   ├── passo-05-usar-no-chrome.png
    │   ├── passo-06-adicionar-extensao.png
    │   └── passo-07-instalacao-concluida.png
    └── videos/
        ├── Hero.mp4
        └── Tutorial.mp4
```

Os arquivos dentro de `assets/` são as cópias utilizadas pelo site. Os materiais originais permanecem na raiz da pasta.

A cópia `assets/videos/Tutorial.mp4` foi preparada com fast start para iniciar
mais rapidamente em hospedagem estática. Essa reorganização não removeu o áudio,
não alterou os codecs e não modificou o arquivo original da raiz.

## Como abrir o site

### Opção mais simples

1. Abra a pasta `Captcha tutorial`.
2. Clique duas vezes em `index.html`.
3. Se o Windows perguntar qual aplicativo utilizar, escolha o Microsoft Edge.

O site funciona diretamente pelo endereço local `file://`.

### Com servidor local opcional

Um servidor local reproduz de forma mais próxima o comportamento de uma hospedagem estática. Se o Python estiver instalado:

```powershell
python -m http.server 8000
```

Execute o comando em um terminal aberto na raiz da pasta `Captcha tutorial`.

Depois, abra:

```text
http://localhost:8000
```

Para encerrar o servidor, volte ao terminal e pressione `Ctrl + C`.

## Como substituir as sete imagens

1. Prepare a nova captura em PNG.
2. Mantenha a área importante visível, sem recortes.
3. Substitua somente a cópia correspondente dentro de `assets/images/`.
4. Preserve exatamente o nome do arquivo:

| Etapa | Arquivo utilizado |
|---|---|
| 1 | `passo-01-extensoes.png` |
| 2 | `passo-02-gerenciar-extensoes.png` |
| 3 | `passo-03-web-store.png` |
| 4 | `passo-04-pesquisar-captcha.png` |
| 5 | `passo-05-usar-no-chrome.png` |
| 6 | `passo-06-adicionar-extensao.png` |
| 7 | `passo-07-instalacao-concluida.png` |

Se a imagem tiver outro formato, converta-a de verdade para PNG. Não altere apenas a extensão do nome.

Depois da troca, abra o site e confira o marcador. Como o ponto de clique pode mudar, talvez seja necessário ajustar suas coordenadas.

## Como substituir o `Hero.mp4`

1. Preserve o arquivo original em outro local ou mantenha uma cópia de segurança.
2. Coloque o novo vídeo em `assets/videos/Hero.mp4`.
3. Use preferencialmente:
   - contêiner MP4;
   - vídeo H.264;
   - pixel format `yuv420p`;
   - proporção 16:9;
   - fast start habilitado.
4. Abra o site no Edge e confirme que o vídeo:
   - inicia automaticamente;
   - está sem som;
   - repete em loop;
   - não mostra controles;
   - não corta o conteúdo no desktop nem no celular.

O mesmo `Hero.mp4` é utilizado em computadores, tablets e celulares. Não é necessário criar uma versão mobile.

Mesmo que o arquivo possua áudio, o hero permanece silencioso porque o elemento de vídeo utiliza `muted`.

## Como substituir o `Tutorial.mp4`

1. Preserve o arquivo original.
2. Coloque o novo vídeo em `assets/videos/Tutorial.mp4`.
3. Não remova o áudio.
4. Use preferencialmente:
   - contêiner MP4;
   - vídeo H.264;
   - pixel format `yuv420p`;
   - áudio AAC;
   - fast start habilitado.
5. Abra a seção “Como utilizar a extensão” e teste:
   - reprodução e pausa;
   - avanço e retrocesso;
   - volume e áudio;
   - tela cheia;
   - botão “Reiniciar vídeo”;
   - indicador de duração.

## Como verificar e otimizar os vídeos

Se o `ffprobe` estiver disponível, execute:

```powershell
ffprobe -hide_banner "assets/videos/Hero.mp4"
ffprobe -hide_banner "assets/videos/Tutorial.mp4"
```

Procure por `Video: h264`, `yuv420p` e, no tutorial, `Audio: aac`.

Se um vídeo não reproduzir corretamente no Edge ou no Chrome, crie uma nova cópia otimizada. Nunca converta por cima do original.

Exemplo para o hero:

```powershell
ffmpeg -i "Hero-original.mp4" -c:v libx264 -pix_fmt yuv420p -movflags +faststart -an "assets/videos/Hero.mp4"
```

Exemplo para o tutorial, preservando o áudio:

```powershell
ffmpeg -i "Tutorial-original.mp4" -c:v libx264 -pix_fmt yuv420p -c:a aac -movflags +faststart "assets/videos/Tutorial.mp4"
```

Depois da conversão, repita os testes no Edge e no Chrome.

## Como alterar os textos

Abra `index.html` em um editor de texto.

Os blocos principais estão organizados nesta ordem:

1. Hero;
2. Introdução;
3. Passo a passo;
4. Orientações após a instalação;
5. Tutorial em vídeo;
6. Dúvidas e problemas comuns;
7. Aviso institucional;
8. Rodapé.

Altere somente o texto entre as tags HTML. Preserve atributos como `id`, `href`, `aria-*`, `data-*`, `src` e `class`, pois eles controlam navegação, acessibilidade e interações.

## Como alterar as cores

Abra `style.css`. As cores principais ficam no início do arquivo, dentro de `:root`.

Exemplo:

```css
:root {
    --color-navy-950: #061c31;
    --color-blue-600: #1a73e8;
    --color-turquoise-500: #13b7aa;
    --color-page: #eef4f8;
}
```

Ao alterar as cores, mantenha contraste suficiente entre texto e fundo. Confira principalmente botões, avisos, navegação e estados de foco.

## Como ajustar a posição dos marcadores

Cada captura possui duas variáveis CSS diretamente no `index.html`:

```html
<div
    class="tutorial-image"
    style="--marker-x: 52.5%; --marker-y: 12.8%;"
>
```

- `--marker-x` controla a posição horizontal.
- `--marker-y` controla a posição vertical.
- `0%` representa o início da imagem.
- `100%` representa o final da imagem.

Posições atuais:

| Etapa | `--marker-x` | `--marker-y` | Alvo |
|---|---:|---:|---|
| 1 | `52.5%` | `12.8%` | Ícone de extensões |
| 2 | `31%` | `86%` | Gerenciar extensões |
| 3 | `12.7%` | `34.4%` | Link da Chrome Web Store |
| 4 | `50.6%` | `21%` | Primeiro resultado da busca |
| 5 | `83.8%` | `45.2%` | Botão “Usar no Chrome” |
| 6 | `53.5%` | `59.5%` | Botão “Adicionar extensão” |
| 7 | `35%` | `42%` | Mensagem de instalação concluída |

Faça ajustes pequenos, salve o arquivo e atualize a página. Teste tanto no computador quanto em uma tela estreita.

## Como testar no Microsoft Edge

1. Clique com o botão direito em `index.html`.
2. Selecione **Abrir com > Microsoft Edge**.
3. Confirme:
   - autoplay silencioso e loop do hero;
   - ausência de controles no hero;
   - funcionamento do menu e dos links internos;
   - abertura e fechamento de todas as imagens;
   - controles, áudio e tela cheia do tutorial;
   - abertura e fechamento das perguntas;
   - ausência de rolagem horizontal.
4. Pressione `F12` e confira a guia **Console**. Não devem existir erros.

O Microsoft Edge é o navegador recomendado para o uso do procedimento.

## Como testar no Google Chrome

Repita a mesma verificação no Chrome. O site e os vídeos são compatíveis, mas o procedimento de validação pode apresentar oscilações nesse navegador.

## Como testar em celular e em 360 px

### Pelo computador

1. Abra o site no Microsoft Edge.
2. Pressione `F12`.
3. Ative o modo de dispositivo móvel com `Ctrl + Shift + M`.
4. Informe uma largura de `360` pixels.
5. Atualize a página.
6. Confirme:
   - o hero utiliza toda a largura disponível e mantém 16:9;
   - personagem, logotipo SOC e reCAPTCHA não são cortados;
   - título e aviso aparecem abaixo do vídeo;
   - o menu compacto abre e fecha;
   - os cards não ultrapassam a tela;
   - as imagens mantêm proporção;
   - botões possuem área confortável para toque;
   - o tutorial ocupa 100% da largura do card.

### Em um celular real

Use o servidor local opcional e conecte o computador e o celular à mesma rede. Descubra o endereço IP local do computador com:

```powershell
ipconfig
```

No celular, abra o endereço no formato:

```text
http://IP-DO-COMPUTADOR:8000
```

O Firewall do Windows pode solicitar autorização para a rede local.

## Como publicar no GitHub Pages

1. Crie um repositório no GitHub.
2. Envie todo o conteúdo da pasta `Captcha tutorial` para a raiz do repositório.
3. Confirme que `index.html`, `style.css`, `script.js` e a pasta `assets` foram enviados.
4. No GitHub, abra **Settings > Pages**.
5. Em **Build and deployment**, selecione **Deploy from a branch**.
6. Escolha a branch principal, normalmente `main`, e a pasta `/ (root)`.
7. Salve e aguarde a publicação.

Todos os caminhos do projeto são relativos, por isso funcionam em um endereço de subpasta do GitHub Pages.

Antes de compartilhar o link, confira:

- letras maiúsculas e minúsculas nos nomes dos arquivos;
- presença de todos os arquivos de `assets/images` e `assets/videos`;
- reprodução dos dois vídeos;
- abertura das sete imagens no modal;
- funcionamento dos links internos.

## Checklist rápido após qualquer alteração

- [ ] `Hero.mp4` continua sendo o primeiro elemento visual.
- [ ] Hero com autoplay, sem som, em loop e sem controles.
- [ ] Sete imagens na ordem correta.
- [ ] Marcadores alinhados aos alvos.
- [ ] Modal fecha pelo botão, pela tecla `Escape` e pelo fundo.
- [ ] Tutorial com controles, áudio, volume e tela cheia.
- [ ] Links internos funcionando.
- [ ] Menu compacto funcionando em 360 px.
- [ ] Nenhum caminho absoluto do Windows no código.
- [ ] Nenhum erro no Console do Edge ou do Chrome.
- [ ] Arquivos originais preservados.
