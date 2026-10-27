// REMEDIACION: SQL Injection - Usar consultas parametrizadas en lugar de interpolacion directa
const username = "admin";
// Antes (VULNERABLE): const queryString = `SELECT * FROM Users WHERE username='${username}'`;
// Despues (SEGURO): Se usa consulta parametrizada
const queryString = "SELECT * FROM Users WHERE username = ?";
const queryParams = [username];

// REMEDIACION: XSS - Sanitizar la entrada del usuario antes de renderizar en HTML
function sanitizeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}
const userInput = '<script>alert("XSS");</script>';
const html = `<div>${sanitizeHtml(userInput)}</div>`;

// REMEDIACION: CSRF - Verificar token CSRF antes de procesar la solicitud
// app.post('/change-password', csrfProtection, (req, res) => {
//   const csrfToken = req.body._csrf;
//   const newPassword = req.body.newPassword;
//   // Ahora se verifica el token CSRF mediante el middleware csrfProtection
// });

// REMEDIACION: Deserializacion - Validar y tipar los datos antes de usarlos
// Antes (VULNERABLE): const data = JSON.parse(req.body);
// Despues (SEGURO): Validar el schema de los datos
function safeJsonParse(body: string): Record<string, unknown> | null {
  try {
    const data = JSON.parse(body);
    if (typeof data !== 'object' || data === null) return null;
    return data as Record<string, unknown>;
  } catch {
    return null;
  }
}

// REMEDIACION: Credenciales - Usar variables de entorno en lugar de hardcodear
const dbPassword = process.env['DB_PASSWORD'] || '';
const config = {
  dbUsername: process.env['DB_USERNAME'] || '',
  dbPassword: process.env['DB_PASSWORD'] || '',
  apiKey: process.env['API_KEY'] || '',
};

// REMEDIACION: No exponer credenciales en logs
console.log('Error: credenciales no validas');
