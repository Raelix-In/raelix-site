# Raelix website

Source for [raelix.in](https://raelix.in), the landing page for Raelix: software development, automation and project rescue.

## Stack

Plain HTML, CSS and vanilla JavaScript. No build step, no dependencies. Font: Schibsted Grotesk (Google Fonts).

## Files

| File | Purpose |
|---|---|
| `index.html` | The whole page: hero, services, project rescue, process, FAQ, enquiry form |
| `styles.css` | All styling and responsive rules |
| `main.js` | Enquiry form validation and submission |
| `favicon.svg` | Site icon |
| `robots.txt`, `sitemap.xml` | Search engine files |
| `vercel.json` | Clean URLs and security headers |

## Enquiry form

The form posts to [FormSubmit](https://formsubmit.co) and delivers to `hello@raelix.in`. The first submission sends an activation email to that inbox. Click the confirmation link once, and enquiries arrive after that. If the request fails, the page shows a prefilled `mailto:` link as a fallback.

To change the recipient, edit `ENDPOINT` and `EMAIL` at the top of `main.js`.

## Run locally

Open `index.html` in a browser, or serve the folder:

```
npx serve .
```

## Deploy

Hosted on Vercel (project `raelix-site`), domain `raelix.in`. Every push to `main` deploys to production once the repository is connected to the Vercel project.

## Editing content

All copy lives in `index.html`. The brand colours and spacing are CSS variables at the top of `styles.css`.
