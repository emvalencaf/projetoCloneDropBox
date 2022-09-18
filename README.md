# projetoCloneDropBox

[EM DESENVOLVIMENTO] Projeto clone do Dropbox desenvolvido durante o [curso dde javascrip da HCode disponível na Udemy](https://www.udemy.com/course/javascript-curso-completo/), segue o [repositório original](https://github.com/hcodebr/curso-javascript-projeto-dropbox-clone) já com o HTML e CSS desenvolvidos.

## Sobre o projeto passado

O foco do projeto é colocar em prática os conhecimentos de Programação Orientada ao Objeto (POO) e o modelo de projeto Model-View-Controller (MVC) durante o desenvolvimento de um clone do Dropbox usando como ferramentas o Express (para o desenvlvimento do back-end) e o Firebase (o serviço realtime database) como banco de dados.

O projeto possui um back-end para coloca-lo no ar durante o desenvolvimento e um front-end. A arquitetura para o projeto, planejou que a conexão com database do firebase fosse feita pelo front-end ao invés do back-end.

## funcionaliadades

- [x] Criação de pastas no realtime db do firebase por meio do path;
- [x] Renderização na View por meio do path das pastas;
- [x] Upload de arquivos na pasta ./upload da raiz do servidor sincronizado ao POST ao realtime db do firebase que faz a coordenação destes arquivos;
- [x] Rename de arquivos na pasta ./upload da raiz do servidor e atualização aos dados relativos a ele no realtime db do firebase;
- [x] Rename de pastas no realtime db do firebase;
- [x] Delete de arquivos na pasta ./upload da raiz do servidor e dos dados relacionados a ele no realtime db do firebase;
- [x] Delete de pastas no realtime db do firebase;
- [x] navegação, por meio do elemento <a>, nas pastas registradas no realtime db do firebase;
- [x] abrir ou fazer o download dos arquivos na pasta ./upload da raiz do servidor

## Desafios

Foram dois os principais desafios para este projeto:

1. Refatorar a lógica do realtime db do firebase para a versão 9.9.3 do firebase, a qual seus métodos para o module do realtime db foram consideravelmente alterados em relação aos apresentados durante as aulas;

2. Refatorar a classe Controller deixando-a responsável apenas pela regra de negócio e delegando as responsabilidades de renderização à classe View e as requisições ao realtime db a classe Service DB.

### Breves considerações

Ao ser implementada a classe Service DB foi adotado o modelo de projeto Repository separando da classe Controller a responsabilidade for fazer requisições ao realtime db do firebase.
