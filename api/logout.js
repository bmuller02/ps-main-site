export default function handler(req, res) {
  // ========================================
  // Logout Handler
  // Clears the user's session and redirects
  // ========================================

  try {

    // Clear the session cookie by setting Max-Age to 0
    res.setHeader('Set-Cookie', 'session-token=; Path=/; Max-Age=0; HttpOnly; Secure');
    
    // For now, just redirect to the homepage after logout
    res.redirect(302, '/');
  } catch (error) {
    console.error('Logout Error:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
}
