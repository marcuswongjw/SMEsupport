# SAGE — Singapore SME Support Navigator

SAGE is a browser-based planning tool that helps Singapore SME owners translate business challenges into practical support pathways. It combines a structured diagnostic, rules-based programme guidance, the Triple-Stack model, compliance reminders, an indicative planning calculator, sector pathways and a downloadable 90-day PDF action plan.

## GitHub Pages deployment

The public site is deployed by the GitHub Actions workflow in `.github/workflows/deploy-pages.yml`. The workflow runs whenever `main` is updated and publishes the static client build in `dist/public`.

The application uses hash-based routes for GitHub Pages compatibility. Use the site navigation rather than relying on server-side routes.

## Important disclaimer

SAGE is an independent planning tool. It is not a Government service and does not provide grant approval, legal advice or a binding interpretation of scheme terms. Always verify current information through the relevant official portal before signing a contract, making payment or commencing project work.
