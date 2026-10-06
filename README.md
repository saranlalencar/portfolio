# Portfólio — Estudante de Ciência da Computação (IFCE — Campus Maracanaú)

Portfólio pessoal de página única, com página de detalhe para cada projeto.
Foi construído para **contar uma história** — quem é, o que estuda, como evolui,
o que constrói e como pensa — e não apenas para listar tecnologias.

> **Estado atual:** a estrutura está completa e funcional. Vários conteúdos ainda
> são **placeholders** (nome, links, descrições dos projetos, tecnologias...).
> Nada foi inventado: onde falta informação, o site mostra explicitamente um
> marcador de pendência. Veja [O que ainda precisa ser preenchido](#o-que-ainda-precisa-ser-preenchido).

---

## Sumário

- [Objetivo](#objetivo)
- [Stack e justificativa](#stack-e-justificativa)
- [Identidade visual](#identidade-visual)
  - [Sistema decorativo](#sistema-decorativo)
  - [Tema claro e escuro](#tema-claro-e-escuro)
- [Executar localmente](#executar-localmente)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Como editar o conteúdo](#como-editar-o-conteúdo)
  - [Dados pessoais](#dados-pessoais)
  - [LinkedIn, e-mail e GitHub](#linkedin-e-mail-e-github)
  - [Currículo em PDF](#currículo-em-pdf)
  - [Adicionar um projeto](#adicionar-um-projeto)
  - [Screenshots dos projetos](#screenshots-dos-projetos)
  - [Tecnologias](#tecnologias)
  - [Trajetória, formação e processo](#trajetória-formação-e-processo)
- [Como funcionam os placeholders](#como-funcionam-os-placeholders)
- [Acessibilidade](#acessibilidade)
- [Performance](#performance)
- [SEO e Open Graph](#seo-e-open-graph)
- [Build e deploy](#build-e-deploy)
- [Decisões de arquitetura](#decisões-de-arquitetura)
- [O que ainda precisa ser preenchido](#o-que-ainda-precisa-ser-preenchido)

---

## Objetivo

Apresentar uma estudante de Ciência da Computação para recrutadores e
oportunidades de estágio, deixando claro em poucos segundos:

1. quem é a profissional;
2. o que estuda;
3. que tipo de software desenvolve;
4. qual é o projeto principal (**ERP para Transportadora**);
5. quais tecnologias utiliza;
6. como entrar em contato.

Por isso a seção de projetos vem antes da de tecnologias, e o projeto principal
abre a seção já com o tratamento de destaque.

A narrativa da página segue esta ordem:

```
Quem sou → O que estudo → Como evoluo → O que construo
        → Com o que construo → Como penso → Formação → Contato
```

Não existe seção de "Experiência profissional" com empregos fictícios. O
conceito adotado é **"Projetos & Desenvolvimento"**, que apresenta a trajetória
sem tentar mascarar a ausência de experiência formal.

---

## Stack e justificativa

| Ferramenta       | Versão | Por quê                                                                                        |
| ---------------- | ------ | ---------------------------------------------------------------------------------------------- |
| **React**        | 19     | Componentização e ecossistema; facilita crescer o portfólio sem reescrever nada.                 |
| **TypeScript**   | 5.8    | O conteúdo é tipado (`src/types/content.ts`): errar o formato de um projeto vira erro de compilação. |
| **Vite**         | 6      | Dev server instantâneo, build enxuto, zero configuração desnecessária.                            |
| **Tailwind CSS** | 4      | Sistema de espaçamento/tipografia consistente direto no markup, com tokens próprios em `@theme`.  |

**Dependências de runtime: apenas `react` e `react-dom`.** Tudo o mais foi
implementado à mão, de propósito:

| Em vez de              | Usamos                                                        | Motivo                                                                  |
| ---------------------- | ------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Framer Motion / AOS    | `IntersectionObserver` em `src/hooks/useReveal.ts`             | Scroll reveal ocupa ~30 linhas; a biblioteca custaria dezenas de KB.     |
| Lucide / React Icons   | SVG inline em `src/components/ui/Icons.tsx`                    | São ~13 ícones. Herdam `currentColor` e não pesam no bundle.             |
| React Router           | Rota por hash em `src/hooks/useProjectRoute.ts`                | Mantém o site 100% estático, sem rewrite no servidor, e o link continua compartilhável. |
| `clsx` / `classnames`  | `src/lib/cn.ts` (4 linhas)                                     | Não vale uma dependência.                                               |

---

## Identidade visual

**Paleta "Jardim Noturno"** — definida em `src/styles/index.css`, no bloco
`@theme`. Foi derivada de duas referências guardadas em **`/fotos`**:

| Referência            | O que ela deu ao projeto                                                 |
| --------------------- | ------------------------------------------------------------------------ |
| O lago noturno        | céu periwinkle carregado de nuvens, luz de lua âmbar, colinas índigo em camadas |
| A mesa na mata        | folhagem verde-teal escura, madeira quente, creme do notebook, cogumelo vermelho |
| O gato ao sol         | a paleta inteira do **tema diurno**: parede turquesa, capim verde-amarelado, pedra clara e o azul-violeta que virou o texto |
| As três raposas       | a personagem diurna: focinho de frente e bochechas separadas (do gráfico do rosto), laranja-avermelhado com contorno quase preto e "meias" pretas nas pernas (da raposa no bosque), pose sentada com a cauda em arco e ponta creme (da raposa na grama) |

Daí vem a divisão do tema noturno: **o céu é periwinkle, a luz é âmbar e o chão
é verde-teal profundo**. Nada de cinza neutro nem de oliva apagado.

| Token                    | Cor       | Uso                                        | Contraste sobre `#101F1A` |
| ------------------------ | --------- | ------------------------------------------ | ------------------------- |
| `--color-night`          | `#101F1A` | Fundo principal — folhagem escura          | —                         |
| `--color-night-2`        | `#172C26` | Fundo alternado entre seções               | —                         |
| `--color-surface`        | `#1E3A31` | Cartões, painéis, menus                    | —                         |
| `--color-fg`             | `#EFE9D8` | Títulos e texto principal (creme)          | 13,6:1                    |
| `--color-sand`           | `#F0DCAE` | Creme quente da luz da lua                 | 12,3:1                    |
| `--color-muted`          | `#B5CDB5` | Texto secundário (verde claro)             | 10,0:1                    |
| `--color-subtle`         | `#8CAF93` | Rótulos e metadados                        | 7,1:1                     |
| `--color-accent`         | `#58B87A` | **CTAs, links, estados ativos**            | 7,0:1                     |
| `--color-accent-strong`  | `#8AD79C` | Hover e destaques secundários              | 10,0:1                    |
| `--color-moss`           | `#2F6B45` | Verde de mata — vegetação                  | uso decorativo            |
| `--color-iris`           | `#8E96D6` | Periwinkle — o céu da referência           | 5,6:1                     |
| `--color-indigo`         | `#3D4A80` | Índigo — colinas distantes e silhuetas     | uso decorativo            |
| `--color-gold`           | `#EFCE8C` | Âmbar — a luz da lua                       | 11,4:1                    |
| `--color-wood`           | `#A0703F` | Madeira quente — poleiro e detalhes        | **só decorativo**         |
| `--color-berry`          | `#C0392B` | Vermelho de cogumelo — **só decorativo**   | nunca em UI               |

Além desses, dois tons derivados servem só para traços: `--color-line` (`#2B4E42`)
e `--color-line-strong` (`#3D6455`) — misturas do fundo com o verde da paleta,
nunca cinza neutro.

**Por que essa paleta:**

- **Nunca preto puro nem branco puro.** O fundo é a folhagem escura da segunda
  referência; o texto é o creme do notebook dela, com 13,6:1 de contraste e sem
  o brilho agressivo do branco absoluto.
- **O verde é o único elemento interativo.** CTA, link, seção ativa e foco usam
  `#58B87A`; o verde claro é reservado ao hover. Isso torna óbvio o que é
  clicável sem precisar de mais nenhuma cor.
- **O periwinkle é o céu, não informação.** Nuvens, brilhos difusos, a lua e as
  colinas distantes — nunca em texto de interface.
- **O âmbar é a luz.** Lua, estrelas, filetes de topo de cartão, olhos da coruja
  e o selo "em desenvolvimento". Nunca como cor dominante.
- **Madeira e vermelho são exclusivamente decorativos** (o poleiro da coruja e a
  tampa do cogumelo). Nunca em interface — o vermelho, em especial, não pode
  competir com a leitura de erro/alerta.
- **Status nunca depende só de cor:** o selo sempre traz o rótulo textual e o
  formato do marcador muda por status.
- **Todos os pares de texto passam de 5,6:1** — a maioria acima de 7:1.

**Tipografia:** duas famílias, sem terceira fonte de apoio.

| Papel                                    | Família                | Onde                                            |
| ---------------------------------------- | ---------------------- | ----------------------------------------------- |
| Editorial (`--font-display`)             | **Cormorant Garamond** | `h1`, `h2`, títulos de projeto, numerais do processo, frase do hero |
| Interface e leitura (`--font-sans`)      | **Manrope**            | corpo, `h3`/`h4`, botões, rótulos, metadados    |

A serifada dá personalidade e ar editorial; a sans mantém a legibilidade e o tom
contemporâneo. Rótulos em caixa alta usam a classe `.meta` (Manrope + tracking)
no lugar de uma fonte monoespaçada — duas famílias bastam para o sistema.

> **Atenção ao editar:** Cormorant Garamond usa algarismos *old-style* por padrão
> ("01" sai parecido com "OI"). Numerais serifados devem receber a classe
> `.numeral`, que força algarismos altos.

### Sistema decorativo

Tudo é vetorial e gerado em CSS/SVG — **nenhuma imagem, nenhuma requisição extra**.

| Elemento             | Onde vive                                  | Papel                                                        |
| -------------------- | ------------------------------------------ | ------------------------------------------------------------ |
| Sprites em pixel art | `src/components/decor/PixelSprite.tsx`     | estrela, folha, broto, flor, lua, cogumelo, pinheiro, semente, galho e os dois quadros de cada personagem (coruja e raposa) |
| Céu, nuvens, lua/sol | `src/components/decor/NightSky.tsx`        | estrelas e nuvens com posição por semente fixa (nunca `Math.random()`) |
| Paisagem             | `src/components/decor/HorizonScene.tsx`    | linha do horizonte no hero e a cena completa antes do rodapé  |
| Ornamentos de seção  | `src/components/decor/Ornament.tsx`        | atmosfera de fundo, divisores, campos de estrela              |

Regras que o código respeita (e que devem ser mantidas ao evoluir o site):

1. **Pixel art só como ornamento — e como a personagem do hero.** Nunca em
   botões, textos, menus, cartões de projeto ou formulários: a interface
   principal permanece contemporânea.
2. **Decoração nunca disputa com o conteúdo.** Todo ornamento é `aria-hidden`,
   `pointer-events-none` e vive em `-z-10` ou com opacidade baixa. A única
   exceção é a lua/sol do hero, que virou um controle de verdade (troca o tema)
   e por isso é um `<button>` com rótulo acessível.
3. **A área de projetos muda de tom.** Do cartão de destaque em diante não há
   estrelas nem sprites: o projeto é apresentado como produto de software. A
   identidade permanece só na paleta, na tipografia e no espaçamento.
4. **Nada pisca.** O brilho das estrelas nunca chega a zero, as animações são
   lentas e todas desaparecem sob `prefers-reduced-motion`.
5. **A textura é quase imperceptível** (grão de 4,5% de opacidade em `body::after`),
   só para que as áreas escuras não pareçam chapadas.

A assinatura visual do portfólio é a **paisagem noturna na transição para o
rodapé** — colinas, pinheiros, lua e estrelas, todos desenhados à mão em SVG e
pixel art originais. Nenhum asset, personagem, sprite ou tipografia de franquia
existente foi reproduzido.

### Tema claro e escuro

O site tem **duas versões**: noturna (padrão) e diurna.

**O interruptor é a própria marca.** O símbolo ao lado do nome, no topo à
esquerda, mostra uma lua no tema noturno e um sol no diurno — clicar nele troca
o tema. Como a marca é fixa, o controle está disponível em qualquer ponto da
página, inclusive no mobile. A lua grande do hero faz a mesma coisa, para quem
notar ela primeiro.

Na navbar, símbolo e nome são **dois controles separados** no DOM: o símbolo é um
`<button>` que troca o tema, o nome é um link para o topo. Nunca um botão dentro
de um link.

| Aspecto              | Como funciona                                                                 |
| -------------------- | ----------------------------------------------------------------------------- |
| Padrão               | respeita `prefers-color-scheme` do sistema; sem preferência, abre no noturno   |
| Persistência         | `localStorage['portfolio-tema']`                                              |
| Sem piscar           | um script inline no `index.html` aplica o tema **antes da primeira pintura**   |
| Estado compartilhado | `src/lib/theme.ts` — store mínimo lido por `useSyncExternalStore` (sem Context)|
| Transição            | cross-fade de 260 ms pela **API de View Transitions** (o navegador funde dois retratos da página no compositor); onde a API não existe, a troca é instantânea; sob reduced motion, não há transição |
| Personagem           | **coruja** à noite, **raposa** de dia — a coruja é noturna, então quem aparece no tronco ao amanhecer é outro bicho |
| Barra do navegador   | a `<meta name="theme-color">` acompanha o tema                                 |

**Como os temas são definidos.** Nenhum componente sabe qual tema está ativo:
o tema diurno apenas **substitui os valores dos mesmos tokens**, no bloco
`:root[data-theme='light']` de `src/styles/index.css`. Por isso os nomes dos
tokens devem ser lidos como **slots**, não como cores literais:

| Token               | Significado real   | Noturno   | Diurno    |
| ------------------- | ------------------ | --------- | --------- |
| `--color-night`     | fundo da página    | `#101F1A` | `#EDF2E6` |
| `--color-night-2`   | fundo alternado    | `#172C26` | `#DEE9D3` |
| `--color-surface`   | cartões e painéis  | `#1E3A31` | `#F6FAF5` |
| `--color-fg`        | texto principal    | `#EFE9D8` | `#2C2C42` |
| `--color-accent`    | CTAs e links       | `#58B87A` | `#3E6B24` |
| `--color-iris`      | céu                | `#8E96D6` | `#2F8FA3` |
| `--color-hill-far`  | colina distante    | `#3D4A80` | `#A9C596` |
| `--color-hill-near` | colina próxima     | `#233145` | `#8FB570` |

Ou seja: `bg-night` quer dizer "fundo da página" — escuro à noite, claro de dia.
Os verdes escurecem no tema claro para manter o contraste (todos os pares de
texto seguem acima de 4,9:1).

**Cada tema tem a sua referência em `/fotos`:** o tema noturno vem do lago sob a
lua e da mesa na mata; o diurno vem da cena do gato ao sol — parede turquesa,
capim verde-amarelado e pedra clara. O texto principal do modo claro usa
exatamente o azul-violeta do gato, em vez de preto.

Três grupos de cor **não** seguem essa troca simples:

- **`--color-cream`** é fixo nos dois temas. É o branco das ilustrações (disco
  facial da coruja, pétalas, lua). Se acompanhasse o tema, a coruja ficaria de
  rosto marrom durante o dia.
- **A coruja e a raposa têm paleta própria e fixa.** São personagens, não
  interface: o índigo da coruja e o laranja da raposa não mudam com o tema — o
  que muda é a cena ao redor delas. Uma é o contraponto cromático da outra.
- **`--color-aura-*` e `--color-wash-*`** mudam de *papel*: à noite são luz de
  lua e verdes sobre índigo; de dia, luz de sol e relva sob céu azul. A cena do
  hero inverte junto — o azul sai de baixo (sombra profunda) e vai para cima
  (céu).

As estrelas não somem no tema claro: ficam a 22% de opacidade e passam a ler
como poeira de pólen na luz.

---

## Executar localmente

Pré-requisitos: **Node.js 18+** e npm.

```bash
npm install     # instala as dependências
npm run dev     # http://localhost:5173
```

Outros comandos:

```bash
npm run build      # verifica os tipos (tsc) e gera dist/
npm run preview    # serve dist/ localmente, para conferir o build
npm run typecheck  # só a checagem de tipos
npm run og         # regenera public/og-image.png
```

---

## Estrutura de pastas

```
portfolio/
├── index.html                  # SEO estático, fontes, favicon, fallback sem JS
├── fotos/                      # referências visuais da paleta (não vão para o build)
├── public/
│   ├── favicon.svg
│   ├── og-image.png            # gerado por scripts/generate-og.mjs
│   └── robots.txt
├── scripts/
│   └── generate-og.mjs         # gera a imagem Open Graph (só stdlib do Node)
└── src/
    ├── main.tsx                # ponto de entrada
    ├── App.tsx                 # composição das seções + rota do detalhe
    ├── data/                   # ★ TODO O CONTEÚDO EDITÁVEL VIVE AQUI
    │   ├── profile.ts          #   nome, bio, links, currículo
    │   ├── projects.ts         #   projetos (cartões + páginas de detalhe)
    │   ├── skills.ts           #   tecnologias por categoria
    │   ├── journey.ts          #   linha do tempo
    │   ├── education.ts        #   formação
    │   ├── process.ts          #   etapas do "como construo"
    │   ├── navigation.ts       #   itens da navbar
    │   └── index.ts            #   ponto único de importação
    ├── types/content.ts        # contratos de todo o conteúdo
    ├── sections/               # uma seção da página por arquivo
    │   ├── Hero.tsx  About.tsx  Journey.tsx  Projects.tsx
    │   └── Skills.tsx  Process.tsx  Education.tsx  Contact.tsx
    ├── components/
    │   ├── decor/              # pixel art, céu noturno, paisagem, ornamentos
    │   ├── layout/             # Navbar, Footer
    │   ├── hero/               # HeroMedia — foto/animação da primeira tela
    │   ├── projects/           # cartões, filtros e página de detalhe
    │   └── ui/                 # Button, Badge, Pending, Reveal, Section...
    ├── hooks/                  # useReveal, useActiveSection, useFocusTrap...
    ├── lib/                    # cn, placeholder, scroll, seo, theme
    └── styles/index.css        # tokens da paleta, tipografia e estilos base
```

**Regra da arquitetura:** componentes nunca contêm texto de conteúdo. Tudo o que
é informação pessoal está em `src/data/`. Trocar o conteúdo nunca exige mexer em
componente.

---

## Como editar o conteúdo

### Dados pessoais

Arquivo: **`src/data/profile.ts`**

```ts
export const profile: Profile = {
  name: '[INSERIR NOME]',        // ← troque pelo nome real
  shortName: '',                 // nome curto da navbar (vazio = usa `name`)
  role: 'Estudante de Ciência da Computação',
  institution: 'IFCE — Campus Maracanaú',
  tagline: 'Construindo soluções através do código.',
  heroSummary: '...',            // 1–2 linhas exibidas no hero
  bio: ['parágrafo 1', 'parágrafo 2'],   // seção "Sobre mim"
  currentlyExploring: ['...'],   // chips de "Atualmente estou explorando"
  location: '[INSERIR CIDADE / ESTADO]',
  photoUrl: null,                // avatar pequeno da seção "Sobre"
  heroMedia: { src: null, alt: '...' },  // ← foto/animação da primeira tela
  contact: { heading: 'Vamos construir algo?', message: '...' },
  links: { ... },
  seo: { ... },
}
```

- A **bio** é um array: cada item vira um parágrafo.
- **Avatar da seção "Sobre":** coloque o arquivo em `public/` e informe
  `photoUrl: '/foto.jpg'`. Com `null`, aparece a marca do portfólio — nunca uma
  foto genérica de banco de imagens.

#### Foto ou animação da primeira tela

A coluna direita do hero é um **espaço reservado** com moldura fixa. Só o que
está dentro dela muda:

| `heroMedia.src`      | O que aparece                                              |
| -------------------- | ---------------------------------------------------------- |
| `null` (atual)       | **a cena animada da coruja** (descrita abaixo)              |
| `'/foto.jpg'`        | a foto, em `object-cover` (aceita `.png`, `.webp`, `.gif`)  |
| `'/animacao.mp4'`    | vídeo silencioso em laço (aceita `.webm`, `.ogv`)           |

```ts
heroMedia: {
  src: '/foto.jpg',
  alt: 'Retrato de <nome>, em plano médio',   // descrição para leitores de tela
},
```

A moldura, o formato 4:5, a vinheta, o anel orbital e os detalhes em pixel art
ao redor **não mudam** — trocar a mídia não exige mexer em nenhum componente.
Pode ser o mesmo arquivo de `photoUrl`. Se `alt` continuar como placeholder e o
nome já estiver preenchido, a alternativa vira "Foto de <nome>"; com vídeo,
`prefers-reduced-motion` desliga o autoplay e exibe controles.

A cena animada **não é um placeholder**: ela é o conteúdo definitivo dessa área
até existir uma mídia real, e por isso não aparece marcada como pendente.

**A cena** (`src/components/hero/HeroMedia.tsx`) é uma **coruja em pixel art**
num jardim noturno — ave noturna, coerente com a identidade e com o gesto de
estudar de madrugada. O que se move:

| Elemento            | Movimento                                                        |
| ------------------- | ---------------------------------------------------------------- |
| Personagem          | pisca (dois quadros trocados com `steps(1)`, ~0,3 s a cada 7 s) e se ajeita no tronco — coruja no tema noturno, raposa no diurno |
| Aurora              | cinco manchas desfocadas em verde folha, verde claro e azul-periwinkle, com durações de 22 s a 38 s em sentidos alternados — as cores se remisturam continuamente |
| Vaga-lumes          | onze pontos que vagueiam nos dois eixos e acendem/apagam em ritmos diferentes |
| Esporos             | sete partículas que sobem da vegetação e se dissolvem             |
| Vegetação           | duas camadas (fundo e frente) balançando em velocidades distintas |
| Anéis orbitais      | dois traços pontilhados girando em sentidos opostos (72 s e 104 s)|

Os quadros ficam em `src/components/decor/PixelSprite.tsx` (`coruja`,
`coruja-piscando`, `raposa`, `raposa-piscando`), como matrizes de caracteres —
cada letra é uma cor. A moldura tem 400 px, e cada personagem ocupa a fração
que **iguala o tamanho do pixel das duas**: a coruja é 26×30 em 56% da largura
(~8,6 px por célula) e a raposa, 36×34 em 70% (~7,8 px). Assim a grade parece a
mesma nos dois temas, e ambas terminam com cerca de 260 px de altura. Para trocar o animal, basta desenhar outra matriz no mesmo
formato e apontar `SceneAnimal` para ela. Sob `prefers-reduced-motion` **tudo
congela**: o animal fica de olhos abertos e a cena permanece legível, sem
nenhum movimento.

### LinkedIn, e-mail e GitHub

Ainda em `src/data/profile.ts`, no objeto `links`:

```ts
links: {
  linkedin: 'https://www.linkedin.com/in/seu-usuario',
  email: 'seu.email@exemplo.com',     // só o endereço, sem "mailto:"
  github: 'https://github.com/seu-usuario',
  resume: '/curriculo.pdf',
},
```

Esses valores alimentam **de uma vez só** a navbar, o hero, a seção de contato,
o rodapé e o JSON-LD de SEO.

> Enquanto o valor for um placeholder, o item **não vira link** — aparece como um
> elemento inerte marcado como pendente. Assim o site nunca publica link quebrado.

**Não há formulário de contato**, por decisão de projeto: um formulário sem
backend dá a impressão de funcionar e perde mensagens. Se quiser um no futuro,
será necessário um serviço externo (Formspree, Web3Forms, Resend) ou uma função
serverless — e aí o formulário entra em `src/sections/Contact.tsx`.

### Currículo em PDF

1. Coloque o arquivo em `public/curriculo.pdf`.
2. Em `src/data/profile.ts`, ajuste `links.resume: '/curriculo.pdf'`.

Os três botões "Baixar currículo" (navbar, hero e contato) passam a funcionar
com o atributo `download`. Enquanto isso, eles aparecem como pendentes.

### Adicionar um projeto

Arquivo: **`src/data/projects.ts`**. Basta acrescentar um objeto ao array
`projects` — o cartão, o filtro e a página de detalhe aparecem sozinhos.

```ts
{
  slug: 'meu-projeto',            // vira a URL: #projeto/meu-projeto
  title: 'Meu Projeto',
  category: 'frontend',           // frontend | backend | mobile | sistemas | academicos | outros
  categoryLabel: 'Aplicação Web', // rótulo livre mostrado no cartão
  status: 'em-desenvolvimento',   // em-desenvolvimento | concluido | planejado | pausado
  featured: false,                // true = cartão grande de destaque (use em um só)
  period: '2026',
  summary: 'Uma ou duas linhas.',
  problem: '...', context: '...', objective: '...', solution: '...',
  features: ['...'], technologies: ['...'],
  architecture: '...', challenges: ['...'], learnings: ['...'], evolution: ['...'],
  screenshots: [{ src: '/screenshots/meu-projeto-1.png', alt: 'Tela inicial' }],
  links: { repository: 'https://github.com/...', demo: 'https://...' },
}
```

**Filtros:** aparecem automaticamente quando houver **4 projetos ou mais**
(constante `FILTER_THRESHOLD`) **e** mais de uma categoria em uso. Categorias sem
projeto nunca são exibidas. Com os dois projetos atuais, o filtro fica oculto de
propósito — seria ruído.

### Screenshots dos projetos

1. Crie `public/screenshots/` e coloque as imagens lá.
2. Referencie em `screenshots: [{ src: '/screenshots/arquivo.png', alt: 'descrição da tela' }]`.

Com `src: null`, aparece uma moldura tracejada identificada como pendente. O
`alt` é obrigatório para leitores de tela — descreva o que a tela mostra.
Prefira PNG/WebP com largura de ~1600px; as imagens já usam `loading="lazy"`.

### Tecnologias

Arquivo: **`src/data/skills.ts`**. As cinco categorias do brief já existem —
Frontend, Backend, Banco de dados, Ferramentas e Outros — mas as listas nascem
**vazias de propósito**: nenhuma tecnologia foi confirmada ainda.

```ts
{
  id: 'frontend',
  label: 'Frontend',
  hint: 'Interfaces e experiência do usuário',
  items: [
    { name: 'TypeScript', level: 'Uso em projetos', description: 'Tipagem estática no front e no back.' },
    { name: 'Angular', level: 'Estudando' },
  ],
}
```

- `level` é **opcional** e textual: `'Estudando'`, `'Uso em projetos'` ou `'Confortavel'`.
- **Não existem barras de progresso** ("Java 95%") — transmitem uma precisão que
  não existe e recrutadores técnicos desconfiam delas.
- Categoria que não for usar? Remova o objeto do array.

### Trajetória, formação e processo

| Seção                   | Arquivo                 | Observação                                                                 |
| ----------------------- | ----------------------- | -------------------------------------------------------------------------- |
| Minha trajetória        | `src/data/journey.ts`   | Cada objeto é um marco. `state`: `atual`, `concluido` ou `planejado`.       |
| Formação                | `src/data/education.ts` | `details` = pares rótulo/valor; `groups` = listas (disciplinas, cursos...). |
| Como construo           | `src/data/process.ts`   | Texto conceitual — ajuste para soar como você.                             |
| Itens da navbar         | `src/data/navigation.ts`| O `id` precisa bater com o `id` da `<section>`. Trajetória e Processo ficam fora do menu de propósito (cinco destinos); para exibi-las, acrescente o item ao array. |

---

## Como funcionam os placeholders

Convenção única do projeto: **qualquer texto no formato `[ALGUMA COISA]`** é
tratado como conteúdo pendente (`src/lib/placeholder.ts`).

Onde aparece um placeholder, a interface:

- exibe uma etiqueta tracejada, com um marcador próprio e o `title`
  "Conteúdo pendente de preenchimento" (não depende só de cor para se distinguir);
- **não** transforma o valor em link (`SmartLink` vira um elemento inerte com
  `aria-disabled`);
- nunca finge ser conteúdo final.

Para preencher, basta substituir o texto entre colchetes pelo conteúdo real —
nenhum componente precisa ser alterado.

---

## Acessibilidade

- HTML semântico: `header`, `nav`, `main`, `section`, `article`, `footer`,
  listas de verdade (`ul`/`ol`/`dl`) e hierarquia de headings sem saltos.
- Link "Pular para o conteúdo" como primeiro elemento focável.
- Navegação por teclado completa; foco sempre visível (`:focus-visible` com anel
  na cor de destaque).
- Menu mobile e detalhe do projeto: `aria-expanded`/`aria-controls`,
  `role="dialog"` + `aria-modal`, **focus trap**, fechamento por `Esc`, retorno
  do foco ao elemento anterior e `inert` no restante da página.
- Seção ativa na navbar comunicada por `aria-current` — não só pela cor.
- Status ("Em desenvolvimento", pendências) sempre acompanhado de texto, nunca
  apenas de cor ou forma.
- `prefers-reduced-motion` respeitado globalmente: animações, transições e o
  scroll suave são desligados.
- Todas as imagens têm `alt`; decorações têm `aria-hidden="true"`.

## Performance

Build de produção medido (`npm run build`):

| Arquivo | Bruto | Gzip |
| ------- | ----- | ---- |
| JS      | 254 kB | **75 kB** |
| CSS     | 47 kB  | **8,7 kB** |
| HTML    | 3,4 kB | 1,3 kB |

- **Duas dependências de runtime** (react + react-dom). Nada de bibliotecas de
  animação, ícones ou utilitários.
- Zero imagens de layout: a decoração toda é CSS/SVG.
- `IntersectionObserver` desconecta após revelar, e o listener de scroll usa
  `requestAnimationFrame` com `{ passive: true }`.
- `loading="lazy"` + `decoding="async"` nas imagens de conteúdo.
- Fontes com `preconnect` e `display=swap`.
- `backdrop-blur` só na navbar e no cabeçalho do detalhe (é caro em GPU).
- Animações restritas a `opacity` e `transform` — sem reflow.

## SEO e Open Graph

- `title`, `meta description`, `canonical`, Open Graph e Twitter Card estáticos
  em `index.html` (é o que os rastreadores leem antes de executar JavaScript).
- `src/lib/seo.ts` completa em runtime com o nome real assim que ele for
  preenchido e absolutiza as URLs de imagem/canonical.
- JSON-LD `schema.org/Person` gerado **apenas com dados já preenchidos**.
- `public/robots.txt` liberado; há uma linha comentada para o `sitemap.xml`.

**Imagem Open Graph:** `public/og-image.png` (1200×630) é um placeholder de marca
gerado por `npm run og` — céu noturno verde com estrelas, colinas e o símbolo do
portfólio, desenhado pixel a pixel só com a biblioteca padrão do Node (sem
dependência de imagem). Não tem texto justamente para não exibir um nome
inventado. Rode `npm run og` de novo se mudar a paleta; substitua por uma imagem
definitiva quando quiser.

Depois de publicar, troque as URLs relativas por absolutas em `index.html`:

```html
<meta property="og:image" content="https://seu-dominio.com/og-image.png" />
<link rel="canonical" href="https://seu-dominio.com/" />
```

---

## Build e deploy

```bash
npm run build     # gera dist/
npm run preview   # confere o resultado localmente
```

O resultado é um site **estático** — funciona em qualquer hospedagem, sem
configuração de servidor (o detalhe do projeto usa rota por hash, então não
existe rota 404 no servidor para reescrever).

### Vercel (recomendado)

1. Suba o projeto para um repositório no GitHub.
2. Em [vercel.com](https://vercel.com) → **Add New → Project** → importe o repositório.
3. A Vercel detecta o Vite sozinho:
   - Framework: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. **Deploy.** Cada `git push` publica automaticamente.

O `vercel.json` na raiz já fixa o framework, o comando de build e os cabeçalhos:
cache imutável de um ano para `/assets/*` (os arquivos têm hash no nome),
cache de um dia para favicon/OG/robots e `X-Content-Type-Options` +
`Referrer-Policy` em todas as respostas. Nenhuma regra de *rewrite* é necessária:
o detalhe do projeto usa rota por hash, então só existe uma URL real (`/`).

**Domínio próprio:** Vercel → projeto → *Settings → Domains* → adicione o
domínio e aponte o DNS. Depois disso, troque as URLs relativas por absolutas
conforme a seção de SEO acima.

### Alternativas

- **Netlify:** build `npm run build`, publish `dist`.
- **GitHub Pages:** publique a pasta `dist`. Se o site ficar em um subcaminho
  (`usuario.github.io/portfolio`), acrescente `base: '/portfolio/'` em
  `vite.config.ts`.

---

## Decisões de arquitetura

**Conteúdo separado da apresentação.** `src/data/` é a única fonte de verdade e
`src/types/content.ts` garante o formato em tempo de compilação. Se um campo
obrigatório de projeto for esquecido, `npm run build` acusa.

**Detalhe do projeto como camada sobreposta com rota por hash.** Uma biblioteca
de rotas traria dependência, rewrite no servidor e um segundo modelo mental. A
camada atual mantém link compartilhável (`#projeto/erp-transportadora`), botão
"voltar" do navegador funcionando, foco preso enquanto aberta e site 100%
estático. Se um dia o portfólio precisar de páginas de verdade (blog, estudos de
caso indexáveis), o caminho natural é migrar para Next.js ou Astro — a camada de
dados vem junto sem alteração.

**Cartão inteiro clicável sem aninhar elementos interativos.** O título do
projeto é um `<button>` com pseudo-elemento esticado (`after:inset-0`): a área de
clique é o cartão todo, mas existe **um** controle no DOM, com nome acessível
correto.

**Filtros que aparecem só quando fazem sentido.** Filtro com dois itens é ruído
de interface. A regra está em `FILTER_THRESHOLD`.

---

## O que ainda precisa ser preenchido

Marcadores que o site exibe hoje como pendentes:

| Onde                             | Arquivo                 | Placeholder                                             |
| -------------------------------- | ----------------------- | ------------------------------------------------------- |
| Nome (hero, navbar, rodapé, SEO) | `src/data/profile.ts`   | `[INSERIR NOME]`                                        |
| LinkedIn                         | `src/data/profile.ts`   | `[INSERIR LINK DO LINKEDIN]`                            |
| E-mail                           | `src/data/profile.ts`   | `[INSERIR E-MAIL]`                                      |
| GitHub                           | `src/data/profile.ts`   | `[INSERIR LINK DO GITHUB]`                              |
| Currículo (PDF)                  | `src/data/profile.ts`   | `[INSERIR CURRÍCULO]`                                   |
| Cidade / estado                  | `src/data/profile.ts`   | `[INSERIR CIDADE / ESTADO]`                             |
| Foto/animação da primeira tela   | `src/data/profile.ts`   | `heroMedia.src: null` (até lá, a composição animada)    |
| "Atualmente estou explorando"    | `src/data/profile.ts`   | `[ADICIONAR TEMA OU TECNOLOGIA EM ESTUDO]`              |
| Datas da trajetória              | `src/data/journey.ts`   | `[ADICIONAR DATA]`, `[ADICIONAR FUTURAMENTE]`           |
| Tecnologias (todas as categorias)| `src/data/skills.ts`    | listas vazias                                           |
| ERP para Transportadora          | `src/data/projects.ts`  | resumo, problema, contexto, objetivo, solução, funcionalidades, tecnologias, arquitetura, desafios, aprendizados, evolução, telas, links |
| Projeto Angular                  | `src/data/projects.ts`  | idem (a única tecnologia confirmada é **Angular**, que veio do nome do projeto) |
| Análise de Combustíveis — ANP    | `src/data/projects.ts`  | período, problema, contexto, objetivo, desafios, aprendizados, evolução, tela e link de demonstração (resumo, solução, funcionalidades, tecnologias e arquitetura vieram do próprio repositório) |
| Período e previsão de conclusão  | `src/data/education.ts` | `[ADICIONAR PERÍODO]`, `[ADICIONAR PREVISÃO DE CONCLUSÃO]` |
| Disciplinas, atividades, cursos  | `src/data/education.ts` | `[ADICIONAR ...]`                                       |

**Nada nessa lista foi preenchido com dados inventados.** Empregos, clientes,
certificações, números, depoimentos e tecnologias não informadas ficaram de fora
de propósito.

O texto que **já é definitivo** (e pode ser ajustado à vontade): a bio
provisória fornecida, a frase do hero (`Construindo soluções através do código.`),
o título e o texto da seção de contato (`profile.contact`) e as seis etapas de
"Como construo".
