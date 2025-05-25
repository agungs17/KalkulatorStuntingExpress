# Getting Started

This project create by [**Express.js**](https://expressjs.com)

## Step 1: Install dependency

```bash
# using npm
npm install

# OR using Yarn
yarn install
```

## Step 2: Setup ENV

```bash
PORT=3000
NODE_ENV=dev # dev/prod
LOGGING=true # true/false

# im used to deploy vercel (https://vercel.com)
BASE_URL=

# supabase (https://supabase.com)
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=

# JWT
JWT_SECRET=

# nodemailer (if use email sender set BASE_URL)
EMAIL_SERVICE=gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=
EMAIL_PASSWORD= # EMAIL_PASSWORD using app passwords, if not have app passwords, click here : https://myaccount.google.com/apppasswords
```

## Step 3: Run project

```bash
# using npm
npm run dev

# OR using Yarn
yarn dev
```