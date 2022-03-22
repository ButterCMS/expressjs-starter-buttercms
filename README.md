![recommended node version](https://img.shields.io/badge/node-v16-green)

# ExpressJS + ButterCMS Starter Project

This ExpressJS starter project fully integrates with dynamic sample content from your ButterCMS account, including main menu, pages, blog posts, categories, and tags, all with a beautiful, custom theme with already-implemented search functionality. All of the included sample content is automatically created in your account dashboard when you sign up for a free trial of ButterCMS.

[View our live demo hosted at Vercel](https://expressjs-starter-buttercms.vercel.app/), or you can click a button below to deploy your own copy of our starter project to the provider of your choice.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FButterCMS%2Fexpressjs-starter-buttercms&env=EXPRESSJS_BUTTER_CMS_API_KEY&envDescription=Your%20ButterCMS%20API%20Token&envLink=https%3A%2F%2Fbuttercms.com%2Fsettings%2F&project-name=expressjs-starter-buttercms&repo-name=expressjs-starter-buttercms&redirect-url=https%3A%2F%2Fbuttercms.com%2Fonboarding%2Fvercel-starter-deploy-callback%2F&production-deploy-hook=Deploy%20Triggered%20from%20ButterCMS&demo-title=ButterCMS%20Express%20Starter&demo-description=Fully%20integrated%20with%20your%20ButterCMS%20account&demo-url=https%3A%2F%2Fexpressjs-starter-buttercms.vercel.app%2F&demo-image=https://cdn.buttercms.com/r0tGK8xFRti2iRKBJ0eY&repository-name=expressjs-starter-buttercms)

[![Deploy with Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/ButterCMS/expressjs-starter-buttercms&env%5BEXPRESS_BUTTER_CMS_API_KEY%5D=check%20https://buttercms.com/settings)


## 1. Installation

First, clone the repo and install the dependencies by running `npm install`

```bash
git clone https://github.com/ButterCMS/expressjs-starter-buttercms.git
cd expressjs-starter-buttercms
npm install
```

### 2. Set API Token

To fetch your ButterCMS content, add your API token as an environment variable.

```bash
$ echo 'EXPRESS_BUTTER_CMS_API_KEY=<Your API Token>' >> .env
```

### 3. Run local server

To view the app in the browser, you'll need to run the local development server:

```bash
$ npm run dev
```

Congratulations! Your starter project is now live. To view your project, point your browser to http://localhost:3000/.

## 4. Deploy on Vercel

Deploy your Express JS app using Vercel, the creators of Next.js, or with Heroku. With the click of a button, you'll create a copy of your starter project in your Git provider account, instantly deploy it, and institute a full content workflow connected to your ButterCMS account. Smooth.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FButterCMS%2Fexpressjs-starter-buttercms&env=EXPRESS_BUTTER_CMS_API_KEY&envDescription=Your%20ButterCMS%20API%20Token&envLink=https%3A%2F%2Fbuttercms.com%2Fsettings%2F&project-name=expressjs-starter-buttercms&repo-name=expressjs-starter-buttercms&redirect-url=https%3A%2F%2Fbuttercms.com%2Fonboarding%2Fvercel-starter-deploy-callback%2F&production-deploy-hook=Deploy%20Triggered%20from%20ButterCMS&demo-title=ButterCMS%20Expressjs%20Starter&demo-description=Fully%20integrated%20with%20your%20ButterCMS%20account&demo-url=https%3A%2F%2Fexpressjs-starter-buttercms.vercel.app%2F&demo-image=https://cdn.buttercms.com/r0tGK8xFRti2iRKBJ0eY&repository-name=expressjs-starter-buttercms)

[![Deploy with Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/ButterCMS/expressjs-starter-buttercms&env%5BEXPRESS_BUTTER_CMS_API_KEY%5D=check%20https://buttercms.com/settings)

### 5. Webhooks

The ButterCMS webhook settings are located at https://buttercms.com/webhooks/
### 6. Previewing Draft Changes

By default, your starter project is set up to allow previewing of draft changes saved in your ButterCMS.com account. To disable this functionality, set the following value in your .env file: EXPRESS_BUTTER_CMS_PREVIEW=false
