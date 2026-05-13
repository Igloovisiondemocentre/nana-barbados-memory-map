# GitHub Pages Deployment

GitHub Pages can host the static memory map and 360 Google Street View embeds.
It cannot safely host the embedded OpenAI chatbot by itself because Pages has no
serverless runtime for keeping `OPENAI_API_KEY` secret. On GitHub Pages the chat
panel falls back to the full BODA GPT link unless you later point
`VITE_BODA_CHAT_ENDPOINT` at a separate backend.

## One-Time Local Setup

Install Git and GitHub CLI first:

```powershell
winget install --id Git.Git -e
winget install --id GitHub.cli -e
```

Close and reopen PowerShell, then authenticate:

```powershell
gh auth login
```

## Create And Push The Repository

Run these commands from the project root:

```powershell
git init
git add .
git commit -m "Prepare Nana Barbados memory map for GitHub Pages"
gh repo create nana-barbados-memory-map --private --source=. --remote=origin --push
$repo = gh repo view --json nameWithOwner -q ".nameWithOwner"
```

For a public site, use `--public` instead of `--private`.

## Add The Google Maps Secret

The 360 views need the Google key at build time:

```powershell
gh secret set VITE_GOOGLE_MAPS_API_KEY --repo $repo
```

Paste the Google Maps browser key when prompted.

In Google Cloud, allow this referrer:

```text
https://OWNER.github.io/nana-barbados-memory-map/*
```

Make sure the key has Maps Embed API enabled.

## Enable GitHub Pages

In GitHub:

Run:

```powershell
gh api --method POST "repos/$repo/pages" -f build_type=workflow
gh workflow run "Deploy GitHub Pages" --repo $repo
```

If the first command says Pages already exists, that is fine. In the GitHub UI,
the equivalent setting is Settings > Pages > Source > GitHub Actions.

The site URL will be:

```text
https://OWNER.github.io/nana-barbados-memory-map/
```

## Push Updates

```powershell
git add .
git commit -m "Update Nana Barbados memory map"
git push origin main
```

## Optional Chatbot Backend Later

If you host the chatbot function somewhere else, set this repository secret and
remove or change `VITE_DEPLOY_TARGET=github-pages` in the workflow:

```powershell
gh secret set VITE_BODA_CHAT_ENDPOINT --repo OWNER/nana-barbados-memory-map
```
