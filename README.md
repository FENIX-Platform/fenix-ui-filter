[![Stories in Ready](https://badge.waffle.io/FENIX-Platform/fenix-ui-filter.png?label=ready&title=Ready)](https://waffle.io/FENIX-Platform/fenix-ui-filter)
Fenix UI Skeleton
=======
Basic structure for Fenix Platform UI projects

#Base Project Structure

```
├── config/             Custom configurations, json file for each modules/lib
├── i18n/               Internationalization, json file for each language
├── node_modules/       Files from repositories, filled by npm install
├── tests/              Unit testing scripts
├── scripts/            Bash scripts, db deploy or additional customized tasks
├── docs/               Project documentation, Markdown files
│  
├── src                 Sources directory, contains all source code and css
│   ├── css
│   │   ├── fonts/
│   │   ├── icons/
│   │   ├── images/
│   │   └── main.css
│   │  
│   ├── fenix_modules/  Fenix modules, source version of fenix modules
│   └── lib/            Common libs, jquery, requirejs, bootstrap
│  
├── dist                Compressed version of /src directory
│   ├── css
│   │   ├── fonts/
│   │   ├── icons/
│   │   ├── images/
│   │   └── main.css
│   │  
│   ├── fenix_modules/  Fenix modules, compressed version of fenix modules
│   └── lib             Common libs, jquery, requirejs, bootstrap
│       └── main.js     Concatenated lib files
│  
├── index.html          Landing page of Project
├── main.js             Landing page js controller
│  
├── Gruntfile.js        Configuration of deploy tasks
└── package.json        Description of Project, deps, common configuration

```

#Requirements

* [NodeJS](http://nodejs.org/)
* [Grunt](http://gruntjs.com/)
* [NPM](https://npmjs.org/)


#Deploy

```bash
npm install             Download soruce from remote repositories
grunt                   Deploy

grunt clean             Clean project structure

grunt docs              Generate documentation by jsdocs

```
