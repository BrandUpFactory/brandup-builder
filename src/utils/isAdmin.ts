import { User } from '@supabase/supabase-js'

// Liste der Admin-Email-Adressen
const ADMIN_EMAILS = [
  "meyer@brandupfactory.com"
  // Hier deine E-Mail-Adresse eintragen
]

/**
 * Prüft, ob ein Benutzer Admin-Rechte hat
 * @param user Supabase User-Objekt
 * @returns boolean
 */
export default function isAdmin(user: User | null): boolean {
  if (!user || !user.email) {
    return false
  }
  
  // Prüfen, ob die E-Mail-Adresse in der Liste der Admin-E-Mails steht
  return ADMIN_EMAILS.includes(user.email.toLowerCase())
}