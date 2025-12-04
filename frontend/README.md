# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/5e7702c8-79bd-4acb-8e11-252bd5b4ab72

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/5e7702c8-79bd-4acb-8e11-252bd5b4ab72) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/5e7702c8-79bd-4acb-8e11-252bd5b4ab72) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

## How to run the test

```sh
    npx vitest
```

## Check

## Step by step to crate a fulstack webapps using ai

**Create a frontend**

```sh
create the snake game with two models: pass-through and walls. prepare to make it multiplayers - we will have this functionality: leaderboard and watching (me following other players that currently play). add mockups for that and also for log in. everything should be interactive - I can log in, sign up, see my username when I'm logged in, see leaderboard, see other people play (in this case just implement some playing logic yourself as if somebody is playing) make sure that all the logic is covered with tests

don't implement backend, so everything is mocked. But centralize all the calls to the backend in one place

create the test file to test the apps
```

**Connecting Antigravity to Codespaces**

- Step 1: Install GitHub CLI
    - Download from [GitHub CLI](https://github.com/cli/cli/releases)
- Step 2: Install Antigravity
    - Download from [Antigravity](https://antigravity.dev/)
- Step 3: Connect Antigravity to GitHub
    - Authenticate
    ```sh
    # Authenticate with GitHub using SSH
    gh auth login
# Select: SSH protocol and your existing SSH key for GitHub
# Follow the remaining prompts

    # authenticate for codespaces
    gh auth refresh -h github.com -s codespace
    ```
- Step 4: