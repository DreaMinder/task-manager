# Vue.js Task Manager

Demo: [demo.module-5.com](http://demo.module-5.com/)

#### Features:
  - Kanban cards
  - Todo lists inside cards
  - Notes and comments inside cards
  - Premission control (admin and common users)
  - Task-tables with dates and statuses inside cards
  - Card duplication across boards
  - Move to trash feature
  - I18n (eng, rus, ukr)
  - Material design
  - Card events
  - Card tags

#### TODO:
  - Move frontend to Nuxt.js
  - Switch from REST to GraphQL
  - Implement lots of features
  - Switch to serverless
  - Fix XSS

#### Quick start:
1. Install MongoDB
2. Install server deps and start in dev mode
```sh
$ cd server
$ npm i
$ npm start
```
3. Install client deps and start in dev mode
```sh
$ cd client
$ npm i
$ npm start
```
4. Somehow create a demo-user (no seeds yet)

#### FAQ:
*Q: No tests, no eslint, no env vars?*

A: Yep. Trying to keep it as simple as possible, so any part could be quickly rewritten.

*Q: What do you expect from community?*

A: I expect that people would use it not only to learn but also to implement custom task managers for their own projects. If it would be so, code quality will rise and new features will be implemented.

*Q: Why do this project exsists?*

A: Team of my co-workers have been using trello. It was fine except lack of some specific features. So I implemented this project and now they use it. Also it was my master degree project.

*Q: Why OpenSource?*

A: I realised that it still pretty much far away from commercial use. People asked me to share the code, so here it is.
