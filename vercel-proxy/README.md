Vercel Proxy - Node.js version of PHP proxy
------------------------------------------
Files:
  - api/index.js     : serverless handler for Vercel
  - package.json     : minimal dependencies
  - vercel.json      : Vercel config (nodejs20.x runtime)
  - README.md        : this file

Deploy steps (quick):
  1) Install Vercel CLI (optional): npm i -g vercel
  2) Login: vercel login
  3) cd into this project folder
  4) npm install
  5) vercel deploy --prod

Test locally (optional):
  - You can run a quick local dev server with vercel dev (if CLI installed)
    or use node to run a simple express wrapper.
