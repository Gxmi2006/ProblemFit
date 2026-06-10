# Custom Domain Setup

## Frontend Domain

1. Buy or claim a domain such as `.me`, `.tech`, `.dev`, or `.app`.
2. Add the domain in Vercel, Netlify, or GitHub Pages.
3. Follow the host instructions for DNS records.
4. Rebuild the frontend with `VITE_API_BASE_URL` pointing to the backend domain.

## Backend Domain

1. Add a custom domain in Render, Heroku, DigitalOcean, or Azure.
2. Configure DNS records from the provider.
3. Set `FRONTEND_ORIGIN` in backend environment to the frontend URL.
4. Confirm `GET /api/health` returns `status: ok`.

## Security Notes

- Keep all keys in environment variables.
- Do not commit `.env`.
- Use HTTPS-only provider domains for production.
- Restrict MongoDB Atlas network access for production deployments.
