// NOTE: Required packages are defined in package.json

import SAML from 'saml2-js';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  // SAML response should come as POST from IdP
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // ========================================
    // Service Provider Configuration
    // (Must match login.js exactly)
    // ========================================
    const sp = new SAML.ServiceProvider({
      entity_id: process.env.SAML_ISSUER,
      assert_endpoint: process.env.SAML_CALLBACK_URL,
      nameid_format: 'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress',
      sign_get_request: false,
      allow_unencrypted_assertion: false,
    });

    // ========================================
    // Identity Provider Configuration
    // (Must match login.js exactly)
    // ========================================
    const idp = new SAML.IdentityProvider({
      sso_login_url: process.env.SAML_ENTRY_POINT,
      sso_logout_url: process.env.SAML_LOGOUT_URL,
      certificates: [process.env.SAML_CERTIFICATE],
    });

    // ========================================
    // Validate & Parse SAML Response
    // ========================================
    // The SAMLResponse is Base64 encoded XML sent by the IdP
    const samlResponse = req.body.SAMLResponse;

    if (!samlResponse) {
      return res.status(400).json({ error: 'No SAML response received' });
    }

    return new Promise((resolve) => {
      sp.post_assert(
        idp,
        { body: { SAMLResponse: samlResponse } },
        async (err, saml_response) => {
          if (err) {
            console.error('SAML Validation Error:', err);
            return resolve(
              res.status(401).json({ error: 'SAML validation failed' })
            );
          }

          try {
            // ========================================
            // Extract User Information from SAML
            // ========================================
            const userEmail = saml_response.user.email;
            const userName = saml_response.user.name || 'Unknown';

            console.log(`User authenticated: ${userEmail}`);

            // ========================================
            // Create JWT Token
            // ========================================
            const token = jwt.sign(
              {
                email: userEmail,
                name: userName,
                iat: Math.floor(Date.now() / 1000),
                // Token expires in 8 hours
                exp: Math.floor(Date.now() / 1000) + 8 * 60 * 60,
              },
              process.env.JWT_SECRET,
              { algorithm: 'HS256' }
            );

            // ========================================
            // TODO: ENGINEERING TEAM - Store Token in Redis/Database
            // This allows:
            // 1. Track active sessions
            // 2. Force logout all sessions if needed
            // 3. Revoke specific sessions
            //
            // Example Redis storage (you need to set this up):
            // await redisClient.set(
            //   `session:${token}`,
            //   JSON.stringify({ email: userEmail, name: userName }),
            //   'EX',
            //   8 * 60 * 60 // 8 hour expiration
            // );
            // ========================================

            // ========================================
            // Set Secure Cookie
            // ========================================
            res.setHeader(
              'Set-Cookie',
              `session-token=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${8 * 60 * 60}`
            );

            // Redirect to homepage (user is now authenticated)
            res.redirect(302, '/');
            resolve();
          } catch (tokenError) {
            console.error('Token Creation Error:', tokenError);
            res
              .status(500)
              .json({ error: 'Failed to create session token' });
            resolve();
          }
        }
      );
    });
  } catch (error) {
    console.error('SAML Callback Error:', error);
    res.status(500).json({ error: 'Authentication callback failed' });
  }
}
