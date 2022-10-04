# projetoCloneDropBox

Projeto clone do Dropbox desenvolvido durante o [curso dde javascrip da HCode disponível na Udemy](https://www.udemy.com/course/javascript-curso-completo/), segue o [repositório original](https://github.com/hcodebr/curso-javascript-projeto-dropbox-clone) já com o HTML e CSS desenvolvidos.

## Sobre o projeto passado

O foco do projeto é colocar em prática os conhecimentos de Programação Orientada ao Objeto (POO) e o modelo de projeto Model-View-Controller (MVC) durante o desenvolvimento de um clone do Dropbox usando como ferramentas o Express (para o desenvlvimento do back-end) e o Firebase (o serviço realtime database) como banco de dados.

O projeto possui um back-end para coloca-lo no ar durante o desenvolvimento e um front-end. A arquitetura para o projeto, planejou que a conexão com database do firebase fosse feita pelo front-end ao invés do back-end.

O foco do projeto foi apenas as funcionalidades relacionadas ao upload no realtime database e storage do firebase, portanto, outras funcionalidades do dropbox não estão presentes nesse projeto.

## funcionaliadades

- [x] Criação de pastas no realtime db do firebase por meio do path;
- [x] Renderização na View por meio do path das pastas;
- [x] Upload de arquivos armazenados no serviço cloud do storage firebase sincronizado ao realtime db do firebase que faz a coordenação destes arquivos;
- [x] Rename de arquivos registrados no realtime db do firebase;
- [x] Rename de pastas no realtime db do firebase;
- [x] Delete de arquivos armazenados no serviço cloud do storage firebase e dos dados relacionados a ele no realtime db do firebase;
- [x] Delete de pastas no realtime db do firebase;
- [x] navegação, por meio do elemento <a>, nas pastas registradas no realtime db do firebase;
- [x] abrir ou fazer o download dos arquivos armazenados no serviço cloud do storage.

### observações

O storage do serviço firebase não possui um método nativo para edição dos arquivos armazenados lá. Portanto, optou-se por não implementar uma função similar a deletar o arquivo com o nome antigo e fazer seu upload, logo em seguida, com o nome novo para não consumir banda. A edição do nome ficou apenas na superfície dos dados no realtime database.

No storage os arquivos permanecem com seu nome original.

## Desafios

Foram dois os principais desafios para este projeto:

1. Refatorar a lógica do realtime db do firebase para a versão 9.9.3 do firebase, a qual seus métodos para o module do realtime db foram consideravelmente alterados em relação aos apresentados durante as aulas;

2. Refatorar a classe Controller deixando-a responsável apenas pela regra de negócio e delegando as responsabilidades de renderização à classe View e as requisições ao realtime db a classe Service DB.

## Como usar

1. Abrir o terminal na pasta app e execute o comando: `npm i bower`;
2. Após terminada a instalação do bower, execute o comando: `npm install`;
3. Crie [um app no firebase](https://firebase.google.com/) e habilite seu aplicativo para os serviços [realtime database](https://firebase.google.com/docs/database/web/start) e [storage](https://firebase.google.com/docs/storage/web/start) seguindo [essas instruções](https://firebase.google.com/docs/storage/web/start);
4. Crie no diretório `app/public/src/firebase` um arquivo `config.firebase.js` e declare um objeto com as configurações do firebaseconfig, por exemplo (preencha todos os atributos de acordo com o firebaseConfig gerado para a sua aplicação):
```
    export const firebaseConfig = {
        apiKey: "",
        authDomain: "",
        databaseURL: "",
        projectId: "",
        storageBucket: "",
        messagingSenderId: "",
        appId: "",
        measurementId: ""
    }
```
5. Por fim, execute o comando: `npm start`.

## Breves considerações quanto ao modelo de projeto desenvolvido

Ao ser implementada a classe Service DB e Storage foi adotado o modelo de projeto Repository separando da classe Controller a responsabilidade for fazer requisições ao realtime db e storage do firebase.
