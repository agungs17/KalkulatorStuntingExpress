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
CORS_ORIGIN= # for NODE_ENV=prod

# supabase (https://supabase.com)
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_BULK_TOKEN=

# JWT
JWT_SECRET=
JWT_UNIT_EXPIRED=12
JWT_LABEL_EXPIRED=hours
JWT_IGNORE_EXPIRATION=false

# nodemailer
EMAIL_SERVICE=gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=
EMAIL_PASSWORD= # EMAIL_PASSWORD using app passwords, if not have app passwords, click here : https://myaccount.google.com/apppasswords

# logflare (Optional)
LOGFLARE_SOURCE_TOKEN=
LOGFLARE_API_KEY=

# Upstash/Redis (Optional)
UPSTASH_REDIS_URL=
UPSTASH_REDIS_TOKEN=
```

## Step 3: Run project

```bash
# using npm
npm run dev

# OR using Yarn
yarn dev
```