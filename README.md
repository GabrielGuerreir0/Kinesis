# Kinesis

Aplicativo de sono e bem-estar para celular. O painel mostra sono, recuperação e dispositivos vestíveis, e o restante do app cuida de conta, perfil, autorizações e um vídeo curto gravado no aparelho.

Tudo fica neste aparelho. Não há servidor, login remoto nem envio de arquivo para a rede. A interface está em português.

## Stack

| Peça | Versão |
| --- | --- |
| Expo SDK | 58 |
| React | 19.3 |
| React Native | 0.88 |
| Expo Router | rotas em `src/app/` |
| Estado | Zustand |
| Sessão | `expo-secure-store` (no navegador, `localStorage`) |
| Preferências e perfil | AsyncStorage |
| Ícones | `react-icons` desenhados com `react-native-svg` |

TypeScript estrito. O alias `@/` aponta para `src/`.

## Requisitos

- Node.js com npm
- Para o celular: [Expo Go](https://expo.dev/go) no mesmo Wi-Fi da máquina, ou um emulador
- Para o navegador: qualquer browser moderno

No Windows, o PowerShell não aceita `&&`. Encadeie comandos com `;`.

## Como rodar

Na pasta do projeto:

```bash
npm install
npx expo start
```

O Metro abre um QR code. No Expo Go, escaneie o QR. No terminal, `w` abre o navegador.

Atalhos do `package.json`:

```bash
npx expo start --android
npx expo start --ios
npx expo start --web
```

Se a porta 8081 estiver ocupada, o Expo pergunta se pode usar outra (por exemplo 8082). Cada porta é outra origem: no navegador, a conta e o tema de `localhost:8081` não aparecem em `localhost:8082`.

Mudou `metro.config.js` ou instalou um módulo nativo? Pare o servidor e rode `npx expo start` de novo. Troca de cor, texto e tela entra no recarregamento normal.

Conferir os tipos:

```bash
npx tsc --noEmit
```

## Conta deste aparelho

Na primeira abertura o app cria uma conta local:

| Campo | Valor |
| --- | --- |
| Nome | Atleta |
| E-mail | voce@kinesis.app |
| Senha | kinesis |

O login só compara e-mail e senha com o que está salvo aqui. Senha trocada em **Perfil** ou em **Recuperar senha** substitui a senha inicial; ela não volta sozinha.

**Sair** apaga só a sessão. Nome, foto, senha, tema e autorizações continuam no aparelho. O diálogo pede confirmação.

## Telas

Fora da conta:

- `/login` — entrar
- `/recuperar-senha` — nova senha para o e-mail já salvo neste aparelho

Dentro da conta:

| Rota | O que é |
| --- | --- |
| `/` | Painel: resumo de sono e envio de vídeo |
| `/gravar` | Gravar um vídeo, revisar e enviar |
| `/perfil` | Foto, nome, e-mail, telefone e senha |
| `/configuracoes` | Aparência, termos, câmera e Bluetooth |
| `/configuracoes/termos` | Texto local de uso |
| `/configuracoes/camera` | Autorizar a câmera e ver a prévia |
| `/configuracoes/bluetooth` | Autorizar ou revogar o Bluetooth |

Sem sessão, qualquer rota interna volta para o login. Com sessão, login e recuperação voltam para o painel.

## Navegação

O cabeçalho das telas principais tem a foto à esquerda e o menu à direita.

- A foto abre **Perfil**.
- O menu sobe da base da tela, no estilo de uma folha inferior. Não é um menu lateral.
- Itens: **Painel** e **Gravar vídeo**. No pé da folha: **Configurações** e **Sair**.
- Toque na área escurecida fecha a folha.
- A barra de status do sistema (hora, rede, bateria, sinal e notificações) fica oculta o tempo todo. No Android, os botões de navegação do sistema somem só durante a abertura.

## Painel

Duas abas:

- **Resumo** — métricas fictícias de sono (duração, sono profundo, qualidade, recuperação), gráfico da semana, gráfico de recuperação e tabela de dispositivos (Halo Ring, Band L2, Pulse K1, Faixa Noite). Os números não vêm de um sensor de verdade. A linha de Bluetooth só reflete a autorização salva no aparelho.
- **Enviar vídeo** — escolher um vídeo da galeria ou abrir a câmera, revisar duração e tamanho, e enviar.

## Vídeo

O envio é local. O app guarda o nome, a duração, o tamanho e o horário em `kinesis.video.last`. O arquivo não sai do aparelho.

Limites:

- no máximo **30 segundos**
- no máximo **20 MB**

Depois do envio a tela mostra **Enviado com sucesso** ou **Erro ao enviar**. Se o motivo for o limite, o detalhe aparece junto (passa de 30 segundos ou de 20 MB). Duração ou tamanho ilegíveis também contam como erro.

Na gravação nativa a câmera grava sem microfone. No navegador, a gravação usa o seletor de câmera do sistema; a duração máxima de 30 segundos vale na checagem do app, não como trava do browser.

## Perfil

A edição de dados pessoais não fica em Configurações. Ela fica em **Perfil**, aberta pela foto do cabeçalho.

A foto pode ser trocada pela galeria, tirada na hora ou removida. A imagem é salva em JPEG no armazenamento local do perfil.

Nome precisa de pelo menos 2 caracteres. E-mail precisa ter formato válido. Senha nova precisa de pelo menos 6 caracteres.

## Configurações

- **Aparência** — Sistema, Claro ou Escuro. Sistema acompanha o aparelho e muda se o sistema mudar. Claro e Escuro ficam fixos. A escolha fica em `kinesis.theme`. O padrão é Sistema.
- **Termos de uso** — texto resumido, só neste app.
- **Câmera** — pede a permissão do sistema e, se autorizada, mostra a prévia. Se o sistema bloqueou o pedido, o botão abre os ajustes.
- **Bluetooth** — autorização local para sensores. Não emparelha um dispositivo de verdade. Revogar desfaz a escolha.

## Aparência

Verde esmeralda, com cartões claros ou escuros e botões preenchidos.

| Papel | Claro | Escuro |
| --- | --- | --- |
| Fundo | `#F2F6F4` | `#07110D` |
| Cartão | `#FFFFFF` | `#12211B` |
| Destaque | `#0B7A5A` | `#149E6B` |
| Texto sobre o destaque | `#FFFFFF` | `#FFFFFF` |

A abertura nativa e o ícone adaptativo do Android usam `#0B7A5A`. As telas leem a paleta na hora da renderização (`useColors` / `useThemedStyles` em `src/hooks/useColors.ts`), então trocar o tema repinta a interface. Um `StyleSheet` criado uma vez no topo do arquivo não acompanharia o tema.

## Abertura

Ao abrir, uma tela cheia em esmeralda anima anéis, o nome **Kinesis** e a palavra **Descanso**, e então some. Ela espera a sessão carregar e segura no mínimo cerca de 1,6 s antes do fade.

No Expo Go, `SplashScreen.setOptions` pode avisar no console. O aviso não impede o uso. O Expo Go também mostra o ícone do app no lugar da imagem nativa de splash; a animação em JavaScript é a abertura que a pessoa vê.

## Onde os dados ficam

| Chave | Conteúdo | Onde |
| --- | --- | --- |
| `kinesis.profile` | nome, e-mail, telefone, foto, se a senha ainda é a inicial | AsyncStorage |
| `kinesis.bluetooth` | autorização de Bluetooth | AsyncStorage |
| `kinesis.theme` | `system`, `light` ou `dark` | AsyncStorage |
| `kinesis.video.last` | metadados do último vídeo aceito | AsyncStorage |
| `kinesis.password` | senha | SecureStore, ou `localStorage` na web |
| `kinesis.session` | sessão aberta (`1`) | SecureStore, ou `localStorage` na web |

Apagar os dados do app, ou o armazenamento do site no navegador, recria a conta inicial na próxima abertura.

## Pastas

```
Kinesis/
  app.json              configuração Expo, permissões, splash e tema do sistema
  index.ts              entrada: gestos, Reanimated e Expo Router
  metro.config.js       desvia os ícones do react-icons para o shim nativo
  assets/               ícone e imagens do Expo
  scripts/              ajuste de aviso do drawer no postinstall
  src/app/              rotas
    _layout.tsx         sessão, tema, splash e rotas protegidas
    login.tsx
    recuperar-senha.tsx
    (app)/              área logada
      index.tsx         painel
      gravar.tsx
      perfil.tsx
      configuracoes/
  src/components/       botões, cartões, menu, splash, tema
  src/hooks/            login, perfil, vídeo, câmera, Bluetooth, tema
  src/store/            sessão, segredo e preferência de tema
  src/theme/            paletas e estilo de cartão
  src/data/wearables.ts números fictícios do painel
  src/video/limits.ts   30 s, 20 MB e leitura de duração
  src/shims/iconBase.tsx desenha os ícones com react-native-svg
```

A lógica de formulário, envio e permissão fica nos hooks. As telas montam o que a pessoa vê.

## Ícones

`react-icons` desenha SVG de navegador. No Android isso quebra. O Metro troca `iconBase` da biblioteca por `src/shims/iconBase.tsx`, que usa `react-native-svg`. Os nomes usados no app estão em `src/components/AppIcon.tsx`.

## Limitações

- Os gráficos e a tabela de dispositivos são dados fixos de demonstração.
- O Bluetooth não procura nem conecta um sensor. Só registra se a pessoa autorizou.
- O vídeo “enviado” não sobe para lugar nenhum. Só a ficha (nome, duração, tamanho, horário) é salva.
- A câmera de vídeo não grava áudio.
- Não há conta em nuvem. Dois aparelhos não compartilham perfil.
- A barra de status permanece oculta em todo o app.
- No Expo Go, o aviso de `SplashScreen.setOptions` pode aparecer e a splash nativa não usa a arte configurada.
