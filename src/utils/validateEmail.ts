/**
 * =====================================================
 *  validateEmail.ts
 * =====================================================
 * Función utilitaria para validar correos electrónicos.
 * Se puede usar en formularios o validaciones directas.
 * =====================================================
 */

/**
 * Valida si un correo electrónico tiene el formato correcto
 * @param email string — correo a validar
 * @returns boolean — true si es válido, false si no
 */
export function validateEmail(email: string): boolean {
  // Expresión regular para formato de email (RFC 5322 básico)
  const regex =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email.trim());
}
