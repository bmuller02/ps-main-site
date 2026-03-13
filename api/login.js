// NOTE: Required packages are defined in package.json

import SAML from 'saml2-js';

export default function handler(req, res) {
  try {
    // ========================================
    // SAML Service Provider Configuration
    // ========================================
    const sp = new SAML.ServiceProvider({
      entity_id: process.env.SAML_ISSUER,
      assert_endpoint: process.env.SAML_CALLBACK_URL,
      nameid_format: 'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress',
      sign_get_request: false,
      allow_unencrypted_assertion: false,
    });

    // ========================================
    // SSO Identity ProviderConfiguration
    // ========================================
    const idp = new SAML.IdentityProvider({
      sso_login_url: process.env.SAML_ENTRY_POINT,
      sso_logout_url: process.env.SAML_LOGOUT_URL,
      certificates: [process.env.SAML_CERTIFICATE],
    });

    // ========================================
    // Generate SAML Authentication Request
    // ========================================
    const authn_request = sp.create_login_request_url(idp, {});

    // Redirect user to company login page
    res.redirect(302, authn_request);
  } catch (error) {
    console.error('SAML Login Error:', error);
    res.status(500).json({ error: 'Authentication initiation failed' });
  }
}
