# SAML/SSO Authentication Setup Guide

## Step 1: Install Required Dependencies

The dependencies are already listed in `package.json`. Simply run:

```bash
npm install
```

This will install:
- `saml2-js` - SAML authentication library
- `jsonwebtoken` - JWT token creation and validation
- `cookie` - Cookie parsing utilities

## Step 2: Update Vercel Configuration

Create or update `vercel.json` in the root directory:

```json
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/$1"
    }
  ],
  "env": [
    "SAML_ISSUER",
    "SAML_ENTRY_POINT",
    "SAML_CALLBACK_URL",
    "SAML_LOGOUT_URL",
    "SAML_CERTIFICATE",
    "JWT_SECRET"
  ]
}
```

## Step 3: Set Environment Variables in Vercel Dashboard

1. Go to your Vercel project dashboard
2. Go to **Settings → Environment Variables**
3. Add each variable from `.env.example` with values from your company's IT/engineering team

## Step 4: Get Required Information from Your Engineering Team

HMI IT team needs to provide:

1. **SAML_ISSUER** - A unique identifier for your app (e.g., "ps-main-site")
2. **SAML_ENTRY_POINT** - The Azure AD / Okta login URL
3. **SAML_LOGOUT_URL** - The logout endpoint
4. **SAML_CERTIFICATE** - The public certificate (PEM format)
5. **JWT_SECRET** - You can generate this: `openssl rand -base64 32`

## Step 5: Test Locally

1. Fill in all values (get from your engineering team)
2. Run: `npm run dev`
3. Visit `http://localhost:3000`
4. You should be redirected to your company's login page
5. Login with your company credentials + DUO approval
6. You should be redirected back to your site

## File Structure

Your project should now have:

```
middleware.js (in root)
.env.local (local development only - add to .gitignore)
vercel.json

api/
  login.js
  callback.js
  logout.js
```

## Security Checklist

- [ ] SAML certificate is valid (not expired)
- [ ] All environment variables are set in Vercel dashboard
- [ ] JWT_SECRET is a strong random string
- [ ] Cookies are HttpOnly and Secure
- [ ] SAML_CALLBACK_URL matches what's registered with your IdP
- [ ] Tested in staging environment first

## DUO Integration

DUO should just work because:
- HMI SSO system already has DUO configured
- When users login, DUO authentication happens automatically
- Your code doesn't need to handle DUO directly - the IdP handles it

## Notes for Engineering Team

- **Token Storage**: Currently tokens are only stored in user's cookie. For full logout / session revocation, implement Redis / database storage (see `api/callback.js` comments)
- **Token Verification**: The middleware currently assumes tokens are valid if they exist. Implement token verification to check expiration and revocation status
- **User Authorization**: Add role/permission checking based on user email or AD groups
- **Logging**: Add monitoring/logging to track authentication events

## Deployment

Once tested locally:

1. Push code to your git repository
2. Vercel deploys automatically
3. Verify environment variables are set in production
4. Test login flow on production domain
