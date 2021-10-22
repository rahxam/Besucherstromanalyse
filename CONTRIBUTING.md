# Contribute

## Project Setup

### Initial setup

1. Setup Business Application Studio
2. Clone Respository
3. Open repository folder: `cd timerecording`
4. Install dependencies: `npm run install`

> windows user with local VSCode must use git-bash or wsl
> for git-bash run ```npm config set script-shell "C:\\Program Files\\Git\\bin\\bash.exe"```

### Start development server with in memory database

**Not all features are supported with in memory sqlite database!**

1. Start backend watch server in first terminal with in memory database: `npm run watch`
2. To access the frontend and backend use your email adress and 1234 as password

### Start development server with sqlite database

**Not all features are supported with sqlite database!**

1. Start backend watch server in first terminal with sqlite database: `npm run watch:sqlite`
2. Create `default-env.json` in `app` folder with credentials for XSUAA Service
3. Start approuter in second terminal: `cd app && npm run start`
4. To access the frontend and backend use your email adress and S-User password
5. You can use the database explorer (*View > SQLTools*) with following setting
   - Type: SQLite
   - Connection Name: Any Name
   - Database File: `timerecording/sqlite.db`
6. To reset the database delete the databse file: `rm sqlite.db`

### Start development server with HANA database

**If the schema was changed you have to deploy the database first with: `npm run deploy:hana`**

1. Create `default-env.json` in repository folder with credentials for SCP Cloud Foundry Services
2. Copy `default-env.json` to folder `app`
3. Start backend watch server in first terminal with in memory database: `npm run watch:hana`
4. Start approuter in second terminal: `cd app && npm run start`
5. To access the frontend and backend use your email adress and S-User password
6. You can use the database explorer (*View > SQLTools*) with following setting
   - Type: HANA
   - Connection Name: Any Name
   - Connection Method: Server and Port
   - Server host: Use VCAP_SERVICE>hana>credentials>host of `default-env.json`
   - Port: Use VCAP_SERVICE>hana>credentials>port of `default-env.json`
   - User: Use VCAP_SERVICE>hana>credentials>user of `default-env.json` (NOT hdi_user)
   - Password: Use VCAP_SERVICE>hana>credentials>password of `default-env.json` (NOT hdi_password)
7. You can use the full featured [HANA Database Explorer](https://hana-cockpit.cfapps.eu10.hana.ondemand.com/hrtt/sap/hana/cst/catalog/cockpit-index.html) of SAP Cloud Platform Cockpit

### Start Mockserver

1. Start watch server in additional terminal with: `npm run watch:mockserver`

## Business Application Studio

### Initial Setup

1. Open [Business Application Studio](https://xxx.eu10cf.applicationstudio.cloud.sap) and login with your mail and S-User Password
2. Create a new Development Space of type `SAP Cloud Business Application`
3. Create a new workspace for example `projects`

### Install Extension

1. Find URL of vsix file
2. Press F1
3. Deploy Plugin by Id aufrufen
4. Insert URL and hit Enter

### Reopen Port Preview

1. Press F1
2. Type `Ports:Preview`
3. Press ENTER
4. Select Port

## Github-Workflow

### Clone Repository

1. Open a Terminal
2. Clone git repository `git clone https://github.com/quadrio/xxxx.git`
3. Set your username: `git config --global user.name "FIRST_NAME LAST_NAME"`
4. Set your email address: `git config --global user.email "MY_NAME@itelligence.de"`

### Update local repository

1. Open a terminal
2. Run: `git pull`

### Start a new Feature / Fix a Bug

For details check <https://guides.github.com/introduction/flow/>

1. Create a new Branch: `git checkout -b my-new-branch`
2. Add specific or all changes to commit: `git add .`
3. Commit your changes: `npm run commit`
4. Push your branch into Github: `git push origin my-new-branch`

### Finish a feature

1. Wait for the CI/CD Pipeline to finish
2. Go to [Github](https://github.com/quadrio/xxx) an create a merge request for your branch into the main branch

## CI/CD Pipeline (Github Actions)

After each commit a CI/CD pipeline is started. All steps are executed in a docker container. The docker image is build in a seperate [Github repository](https://github.com/quadrio/xxx-docker-node-image) once a week. The image includes the CF CLI with the multiapps plugin and node version 10.

### For all Branches

#### Stage install-dependencies

**Runs only if dependency in package-lock.json was changed**

1. Installs all npm packages and uploads them into the cache

#### Stage test

##### Job ui test

1. eslint checks for frontend are run locally
2. Unit tests for frontend are run locally

##### Job backend test

1. eslint checks for backend are run locally
2. Unit tests for backend are run locally
3. API tests for backend with sample data are run locally

##### Job integration test

1. mta file is created with sample data
2. New SCP CF Space is created and mta file is created
3. Integration tests are run in SAP Cloud Platform CF

### For main branch

#### Stage versioning

1. Current version is read from `package.json`
2. Based on last commit messages a new major or minor version is created and written to `package.json` and `mta.yaml`
3. `CHANGELOG.md` is updated with commit messages
4. A Git Tag is created and pushed into the repository

#### Stage build

1. MTA file is created without sample data
2. MTA file is uploaded into artifact repository

#### Stage development deployment

1. MTA file is deployed to NUBO Time Recording Development Space

#### Stage destroy-integration-deployment

1. Integration Test Space in SCP CF is deleted

#### Stage test deployment

1. MTA file is downloaded from artifact repository
2. MTA file is deployed to NUBO Time Recording Test Space with blue-green deployment and automatic release

#### Stage production idle deployment

1. MTA file is downloaded from artifact repository
2. MTA file is deployed to NUBO Time Recording Production Space with blue-green deployment

#### Stage production idle smoke test

1. Some basic tests are done against the new productive version

#### Stage production release

1. The productive idle version is release as live version
2. The old productive live version is deleted

#### Stage production smoke test

1. Some basic tests are done against the new productive version

### For not main branches

No special handling

## Tests

Run all tests with `npm run test:all`

### Backend

#### Eslint

`npm run lint`

#### Mocha

`npm run test`

#### Troubleshoot

Follow this guideline to trouble-shoot failing ui tests.

- Check the CI-LOG
- Make sure local demo-data is up to date
- Add the string 'it.only.(..)' to the it
- Boot a cap instance with debug.
- Run `npm run test`. Only parts marked with .only will be executed, requesting the already running backend with debug session.
- check Troubleshoot - CI

### Frontent

For compatibility reasons with the business application studio. All UI tests and their dependencies are in their own npm package located in "test".

#### Eslint

`cd app && npm run lint`

#### Tests

Currently it is not possible to execute in business application studio.
> headless: `cd app/test && npm run test:ci`

If you want to run one `describe`/`it` statement ADD anywhere in the description the word `#dev`.
> with display: `cd app/test && npm run test:dev`

#### Troubleshoot

Follow this guideline to trouble-shoot failing ui tests.

- Check the CI-LOG
- Check, if there is a screenshot available in the artifacts '/artifacts/browse/app/test/allure-report/data/attachments/' .png files. You can also download the entire report and view it locale with any localhost server.
- If integration test. Run the test manual e.g. login with the test-user to the cf app instance. [find the open-live-environment button](https://github.com/quadrio/xxx/-/environments) within one hour of last pipeline run.
- Add the string '#dev' to the it description and run  `cd app/test && npm run test:dev` local
  - you can also add ```browser.pause(9999)``` or ```browser.debug()``` in the spec files to stop execution at any point
  - Make sure local demo-data is up to date
- If integration test. You can debug a hana base application instance
  - select stop on exception
  - run test local against this hana instance. see comment in wdio.conf.base.js to test towards and remote url.
- check Troubleshoot - CI

## Troubleshoot - CI

- delete all package-lock.json and rerun ```npm i```
  - clear all ci runner caches [button in header toolbar](https://github.com/quadrio/xxx/-/pipelines)
  - commit your new lock files and push.
- Especially if error occurs in sap npm modules. Update all npm dependencies
  - you can use <https://www.npmjs.com/package/npm-check-updates>
  - redo clear all ci runner caches.
  - commit & push update package.json and lock files

## Test Data

Generate Test Data:
`npm run data:dev`

## Deployment

### Deploy from SAP Business Application Studio

 1. Create file `mta_local.mtaext` with content (only one of besucherstrom-dev/besucherstrom-test/besucherstrom):

    ```yaml
      _schema-version: "3.1"
      ID: besucherstrom-conf
      extends: besucherstrom
      parameters:
        MTA_ENV: besucherstrom-dev/besucherstrom-test/besucherstrom
    ```

 2. Set cloud foundry target to correct space f.e. `cf target -o xxxx -s besucherstrom`
 3. Build and deploy WITHOUT test data: `npm run build-deploy:prod` or WITH test data: `npm run build-deploy:dev`

### DB Auto Undeployment

 1. Set cloud foundry target to correct space f.e. `cf target -o xxxx -s besucherstrom`
 2. Build and deploy `npm run deploy:hana`
 3. Add flag `--auto-undeploy` to start script in `gen/db/package.json` once it is generated and before deployment start

## Code Style Guide

### Domain Modeling

Stick to the [SAP CAP Guide](https://cap.cloud.sap/docs/guides/domain-models#naming-conventions)

- Start entity and type names with capital letters
- Use plural form for entities - for example, Authors
- Use singular form for types - for example, Genre
- Start elements with a lowercase letter - for example, name
- Don’t repeat contexts → e.g. Author.name instead of Author.authorName
- Prefer one-word names → e.g. address instead of addressInformation
- Use ID for technical primary keys → see also Use Canonic Primary Keys
- Prefer Single-Purposed Services \
   We strongly recommend designing your services for single use cases. Services in CAP are cheap, so there’s no need to save on them. [Refer to CAP Guide](https://cap.cloud.sap/docs/guides/providing-services#prefer-single-purposed-services)

### File Structure

- Where to Implement Services? \
    The easiest way to add service implementations is to simply place equally named .js files next to the .cds files containing the respective service definitions. In addition to direct siblings you can place them into relative subdirectories ./lib or ./handlers, allowing layouts like that:

    ```text
    srv/
      # all in one
      foo-srv.cds
      foo-srv.js
      bar-srv.cds
      bar-srv.js```

pip install pre-commit
curl <https://pre-commit.com/install-local.py> | python -

run `pre-commit install`

cf install-plugin multiapps
