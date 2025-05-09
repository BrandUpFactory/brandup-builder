'use client'

import { useEffect } from 'react'

export default function LicensePage() {
  useEffect(() => {
    // Nur auf Desktop: Scrollen deaktivieren
    if (typeof window !== 'undefined' && window.innerWidth >= 768) {
      document.body.style.overflow = 'hidden'
    }

    // Beim Verlassen wieder aktivieren
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [])

  return (
    <div className="flex items-start justify-center min-h-screen pt-[10vh] px-4 bg-white">
      <div className="max-w-3xl w-full text-sm text-black leading-relaxed">
        <h1 className="text-2xl font-semibold mb-6 text-center">Lizenz & Nutzungsbedingungen</h1>

        <p className="mb-4">
          Alle Komponenten, Codes, Snippets und Designs, die über <strong>BrandUp Elements</strong> zur Verfügung gestellt werden, sind urheberrechtlich geschützt gemäß §2 UrhG (Urheberrechtsgesetz). Die Rechte zur Nutzung dieser Inhalte werden ausschließlich über eine gültige, erworbene Lizenz erteilt.
        </p>

        <p className="mb-4">
          Eine Lizenz ist stets projektgebunden und darf nicht weiterverkauft, unterlizenziert oder in anderen, nicht lizenzierten Projekten verwendet werden. Jegliche Nutzung ohne gültige Lizenz stellt eine Verletzung der Urheberrechte dar und kann zivil- und strafrechtlich verfolgt werden (§97 UrhG).
        </p>

        <p className="mb-4">
          Sollten Elemente aus BrandUp Elements ohne gültige Lizenz in einem Live-Shop, Kundenprojekt oder sonstigen digitalen Produkt nachgewiesen werden, behalten wir uns rechtliche Schritte ausdrücklich vor – darunter die Geltendmachung von Unterlassungsansprüchen, Schadenersatz sowie einstweilige Verfügungen.
        </p>

        <p className="mb-4">
          Durch die Nutzung unserer Inhalte erklärst du dich mit diesen Bedingungen einverstanden. Änderungen am Quellcode sind nur im Rahmen der lizenzierten Instanz erlaubt. Eine kommerzielle Weitergabe oder Verwertung ist ausdrücklich untersagt.
        </p>

        <p className="mb-4 font-medium">
          Hinweis: Bei jeder Lizenz wird eine technische Prüfspur hinterlegt. Verstöße können auch im Nachhinein eindeutig zugeordnet werden.
        </p>

        <p className="mb-4">
          Fragen zu deiner Lizenz, ein Lizenz-Upgrade oder eine Meldung zur Verdachtsprüfung kannst du jederzeit an uns richten:
          <br />
          <a
            href="mailto:info@brandupelements.com"
            className="text-[#8db5d8] underline font-medium"
          >
            info@brandupelements.com
          </a>
        </p>

        <p className="text-xs text-gray-500 mt-6">
          Stand: {new Date().toLocaleDateString('de-DE')}
        </p>
      </div>
    </div>
  )
}
