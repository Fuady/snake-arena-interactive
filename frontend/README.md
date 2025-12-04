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
- Step 4: Create and Use Codespace
```sh
    # Create a new codespace
    gh codespace create
    # Note the ID that's generated (e.g., expert-doodle-wr7wg9p5gqcgggw)
```
- Step 5: Connect via SSH
```sh
    gh codespace ssh -c expert-doodle-wr7wg9p5gqcgggw
```
- Step 6: get the SSH config
```sh
    gh codespace ssh --config -c expert-doodle-wr7wg9p5gqcgggw
```
Add the output to `~/.ssh/config`

- Step 7: Use with Antigravity
    - Connect to codespace using Antigravity's SSH remote mode
    - Open the project folder in `/workspaces/`

- Step 8: Stop Codespace When Done
```sh
    gh cs stop -c expert-doodle-wr7wg9p5gqcgggw
```

## Links

If you want to access the backend directly in your browser, use one of these URLs:

- [API Documentation](http://localhost:3000/api-docs/)
- [Health Check](http://localhost:3000/health)
- [Leaderboard](http://localhost:3000/api/v1/leaderboard)

For the frontend application, use:

- [Frontend](http://localhost:8080)

## Integrating Backend with Frontend

```sh
   Make frontend use backend. use OpenAPI

   How can I run both frontend and backend at the same time? Let's use concurrently instead of our own script
```

## Database support
Our backend uses a mock database. Let's use a real one now

```sh
   now for backend let's use postgres and sqlite database (via sqlalchemy)

   let's also add some integration tests (using sqlite) to make sure things work put the integration test in a separate folder tests_integration
```

## Checking the database
Here are the most useful methods:

1. Prisma Studio (Recommended - Visual Interface)
The easiest way to view and edit your database:

```sh
cd backend
npm run prisma:studio
```

This will open a web interface (usually at `http://localhost:5555`) where you can:

- View all tables and data
- Add, edit, or delete records
- Run queries
- See relationships between tables

2. SQLite Command Line
Directly query the database using SQLite CLI:

```sh
cd backend
sqlite3 dev.db
```
Then you can run SQL commands:

```sql
-- List all tables
.tables

-- View table schema
.schema users

-- Query data
SELECT * FROM users;
SELECT * FROM leaderboard_entries ORDER BY score DESC LIMIT 10;
SELECT * FROM game_sessions WHERE isActive = 1;

-- Exit
.quit
```

3. VS Code SQLite Extension
If you have the SQLite extension installed in VS Code:

1. Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`)
2. Type "SQLite: Open Database"
3. Select `backend/dev.db`
4. You can then explore tables in the sidebar


4. Programmatically via Prisma
You can also query the database programmatically:

```sh
cd backend
npx tsx
```

Then in the REPL:

```typescript
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// Get all users
await prisma.user.findMany()

// Get leaderboard
await prisma.leaderboardEntry.findMany({ orderBy: { score: 'desc' }, take: 10 })

// Get active sessions
await prisma.gameSession.findMany({ where: { isActive: true } })
```

5. Check Database Files
View which database files exist:

```sh
ls -lh backend/*.db
```

You should see:

- `dev.db` - Development database
- `test.db` - Test database (created during tests)

Quick Database Status Check
Here's a quick command to see what's in your database:

```sh
cd backend && sqlite3 dev.db "SELECT 'Users: ' || COUNT(*) FROM users UNION ALL SELECT 'Leaderboard Entries: ' || COUNT(*) FROM leaderboard_entries UNION ALL SELECT 'Active Sessions: ' || COUNT(*) FROM game_sessions WHERE isActive = 1;"
```
My recommendation: Use Prisma Studio (`npm run prisma:studio`) - it's the most user-friendly way to explore your database!