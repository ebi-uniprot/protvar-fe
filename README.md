# Installation

> This installation guide is based on the steps required for an
> unix-powered machine with latest updates installed and in clean
> configuration. You may require more or different steps if you are
> using any other operating system.

### Downloading The Source Code

You can either download or clone the repository via *Github*. If you have `git` CLI already installed, you just need to navigate to your projects' directory and simply execute the following command in your command-line:

`git clone https://github.com/ebi-uniprot/pepvep-fe.git`

This should create a directory named `pepvep-fe` in the current directory -- you can check the current working directory by typing `pwd` in the command-line and pressing return/enter key. 

### Installing JavaScript Dependencies

Now that you have the source code on your local machine, you would need to follow a few steps in order to get it running. Starting with JavaScript dependencies; Our preferred package manager is `yarn`, however, you may use `NPM` or others in your discretion.

> You would need to have a recent version of *Node.JS*, as well as 
> a package manager e.g. *Yarn* or *NPM*, installed before you can continue.

To install JavaScript dependencies, first make sure you are in the root directory of your `pepvep-fe` project -- this directory should contain a file named `package.json`, then type `yarn install` in the command-line and press return. This should download and install the required
JavaScript packages -- this may take a few minutes to finish. 

> If the installation was unsuccessful due to any permission/access
> denied related errors -- especially if you are using `NPM`, check your
> package manager's online documentation. [This page](https://docs.npmjs.com/getting-started/fixing-npm-permissions) explains the 
> problem and solution for `NPM` users.


# Usage

Run `yarn start` and go to [http://localhost:3000](http://localhost:3000) if it didn't open automatically.

# Test
For end to end testing this project is using [playwright](https://playwright.dev/)

## Playwright
1. `yarn create playwright test` (for very 1st time)
2. `yarn test:e2e` will run test with out browser get opened
3. `yarn test:e2e --headed` will open browser
4. `yarn test:e2e --project "Desktop Chrome"` will run tests for only single project
5. `yarn test:e2e --project "Desktop Chrome" --headed` can combine different options