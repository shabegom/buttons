# Spacebook

[![Netlify Status](https://api.netlify.com/api/v1/badges/68791233-b2d6-4a86-8c42-e654e112a157/deploy-status)](https://app.netlify.com/sites/spacebook-app/deploys)

Create your own spacebook and customize it to your needs. Spacebooks are speedy to set up, free, and 100% open source. Spacebooks are modern notebooks you can use to create documentation, sketch out new ideas, build a simple website, or whatever suits your fancy. 

---

<p align="center">
<strong><big>Demo and documentation:</big></strong><br /> 
</p>

<p align="center">
<strong>https://spacebook.app</strong> <br />
</>

<p align="center">
🙋 💥 👩🏽‍🚀 🚀 👨‍🚀 🛰️
</p>

---

## Contributing

If you want to contribute or make fixes to spacebook, it is best to fork this repository directly and submit pull requests against it. If you spot a typo on the demo/documentation site, you can also open a fork directly from the edit button on the top of each page.

## Install spacebook

If you want to quickly install for local testing follow the instructions below:

### Requirements

You must be running **Node version 12 or higher** due to the Tailwind 2.0 release. I recommend using NVM to easily manage your Node versions if you need to switch back and forth between older versions.

- [Node](https://nodejs.org/)
- [NVM](https://github.com/nvm-sh/nvm) (optional)

**To find your current node version:**

```
node --version
```

### Step one

```
git clone https://github.com/broeker/spacebook
```

### Step two

Install the site and run an initial build command:

```
cd spacebook

npm install

npm run build (only necessary the first time!)
```

_If you get errors here, double check your node version!_

### Step three

Now spin up your local server to see your site!

```
npm run start
```

This command will start a local server and you'll be able to work on your site with hot reloads and some nice Browsersync features. 💥

--- 
