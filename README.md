# Why Travel Alone

## Introduction

Why Travel Alone is a small passion project that began as my capstone for the Brainstation June 2023 cohort. It has now evolved into an ongoing project where I can showcase my skills. In this front-end section of the project, I will demonstrate my design skills and the ability to create readable and reusable code. You can find the corresponding back-end API [here](https://github.com/JDVM/why-travel-alone-api.git).

## Technologies

- React
- JavaScript
- Axios
- SASS
- React Router DOM
- React Icons
- Knex
- MySQL

## Setup

### Front-End

1. Clone the repository: `https://github.com/JDVM/why-travel-alone.git`
2. Install dependencies: `npm ci`
3. Copy `.env.example` to `.env` and point it at the API
4. Run the application: `npm start`

Rendering errors show a "Something went wrong" page instead of a blank screen. Set `REACT_APP_SENTRY_DSN` at build time to report them, and uncaught errors, to Sentry. Reports carry the account id only: no query strings (which can hold one-time tokens), cookies, headers or console arguments. The Sentry SDK is loaded as a separate chunk only when a DSN is set.

### Back-end

1. Clone the repository: `https://github.com/JDVM/why-travel-alone-api.git`
2. Install dependencies: `npm install Knex dotenv express mysql2 cors`
3. Run the application: `node --watch server.js`

If you encounter any issues, please feel free to contact me via GitHub.

### Database Setup

- Create a database in MySQL
- Create an `.env` file using the `.env.example` file to format appropriate variables (screenshot)
- ![image](https://github.com/JDVM/why-travel-alone/assets/40014232/98f0ca2a-d367-4409-8025-fd1179156f65)
- In the terminal, run `npm run migrate` to apply the latest migration files
- Seed the database by running `npm run seed` to populate it with the latest data

### Browser tests

`e2e/` holds Playwright tests that drive a real browser through the whole app: sign-up and email confirmation, trips, invitations, privacy, password reset. They run against the full stack, started from the API repository (checked out next to this one):

```sh
cd ../why-travel-alone-api
JWT_SECRET=$(openssl rand -hex 32) TRUST_PROXY=1 docker compose --profile web up -d --build
cd ../why-travel-alone
npx playwright install chromium   # once
npm run e2e
```

Each test creates its own users (emails are read from Mailpit), so the suite needs no demo data and can run repeatedly. Any error in the browser console, including a Content-Security-Policy violation, fails the test. CI runs the suite on every pull request in both repositories, against the other repository's branch of the same name if there is one, otherwise its `main`.

### Deploying

`Dockerfile` builds the production site served by nginx, with a strict Content-Security-Policy and other security headers (`nginx/default.conf.template`):

```sh
docker build --build-arg REACT_APP_API_BASE_URL=https://api.example.com -t why-travel-alone-web .
docker run -e API_ORIGIN=https://api.example.com -p 3000:8080 why-travel-alone-web
```

The full runbook (configuration, releases, backups, monitoring and the launch checklist) is [DEPLOYMENT.md in the API repository](https://github.com/JDVM/why-travel-alone-api/blob/main/DEPLOYMENT.md).

## Features

- Trips: Add, Edit, Delete trips
- Travelers: every user is a traveler. Trip owners invite travelers, who accept or decline on the Invitations page
- Email: signup sends a link to confirm the address (a banner reminds you until you do; inviting and joining trips need it), and "Forgot your password?" emails a one-hour reset link. Resetting signs out every other session
- Privacy: draft Privacy Policy and Terms of Service (pending legal review), terms accepted at signup, explicit consent before storing special considerations, and "Your data" on the profile page to download everything or delete the account
- Fully responsive with a mobile-first design

## Lessons Learned

The biggest lesson I learned from this project is the complexity of the backend design process. During the initial project design, I was not aware of how complex the queries would need to be in order to properly retrieve the data. Learning to use different joins as part of the query showed me that all of the data doesn't have to be in a single database; it can be in multiple sources and joined together based on the needs of the query. This also showed me that spreading the data out and creating multiple relationships can be beneficial.

For the frontend, I learned a few things as well. I found that combining the `map` method with a select option is very useful. I also learned about the different types of overflow options. While the initial plan was to use a library to create the frontend, in the end, I had to scrap that idea and create the components from scratch, as I was spending too much development time trying to figure out how they worked.

## Next Steps

**Milestones:**
1. Apply a sorting function to narrow down results based on different categories.
2. Add more icons to enhance user interface.
3. Implement hotel and flight search for the site.
