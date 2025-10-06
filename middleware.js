// middleware.js - MIDDLEWARE PERMISSIF
export function middleware(request) {
  console.log("🔓 Middleware - Autorisation de:", request.nextUrl.pathname);
  // Laisser passer toutes les requêtes
  return;
}

// Ne s'applique à aucune route - effet: désactive le middleware
export const config = {
  matcher: []
}
