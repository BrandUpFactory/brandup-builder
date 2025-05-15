'use client'

import { useEffect, useState } from 'react'

export default function LicensePage() {
  const [today, setToday] = useState('')

  useEffect(() => {
    const now = new Date()
    const formatted = now.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
    setToday(formatted)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-white text-[#1c2838]">
      <div className="max-w-3xl w-full text-sm leading-relaxed space-y-6">
        <h1 className="text-2xl font-bold text-center mb-4">Lizenzbedingungen</h1>

        <p>
          <strong>§ 1 Anwendungsbereich:</strong> Diese Lizenzbedingungen gelten für alle digitalen Inhalte, Vorlagen, Abschnitte („Templates“) und Layout-Komponenten, die über BrandUp Elements bereitgestellt oder erworben werden. Mit dem Erwerb oder der Nutzung eines Templates erkennt der Nutzer diese Bedingungen ausdrücklich als verbindlich an. Abweichende Regelungen bedürfen der schriftlichen Zustimmung der BrandUp Factory GmbH.
        </p>

        <p>
          <strong>§ 2 Nutzungsrechte:</strong> Mit dem Erwerb eines Templates erhält der Nutzer ein einfaches, nicht übertragbares, nicht ausschließliches Nutzungsrecht. Die Nutzung ist ausschließlich für eigene Projekte des Lizenznehmers zulässig. Die Bearbeitung, Modifikation und Integration in bestehende Projekte ist gestattet, jedoch stets unter Wahrung der Urheberrechte. Eine Weitergabe an Dritte, der Wiederverkauf, das öffentliche Zugänglichmachen oder die Vervielfältigung der Inhalte – gleich in welcher Form – ist untersagt.
        </p>

        <p>
          <strong>§ 3 Urheberrecht und Eigentumsvorbehalt:</strong> Alle Templates und Inhalte bleiben geistiges Eigentum der BrandUp Factory GmbH. Der Quellcode, die Struktur und das Design sind urheberrechtlich geschützt. Der Nutzer erwirbt mit dem Kauf keinerlei Eigentumsrechte an den zugrunde liegenden Konzepten oder grafischen Darstellungen. Jegliche Entfernung von Hinweisen auf den Urheber ist unzulässig.
        </p>

        <p>
          <strong>§ 4 Missbrauch und Vertragsverletzung:</strong> Bei einem nachgewiesenen Verstoß gegen die Lizenzbedingungen, insbesondere durch unerlaubte Vervielfältigung, Weitergabe oder kommerzielle Nutzung ohne gültige Lizenz, behält sich die BrandUp Factory GmbH das Recht vor, rechtliche Schritte einzuleiten, Schadensersatz geltend zu machen sowie die entsprechende Lizenz mit sofortiger Wirkung zu widerrufen. Darüber hinaus kann der Zugang zur Plattform dauerhaft gesperrt werden.
        </p>

        <p>
          <strong>§ 5 Gewährleistung und Haftung:</strong> Die Templates werden nach bestem Wissen erstellt und bereitgestellt. Es besteht jedoch keine Garantie für die technische Fehlerfreiheit oder uneingeschränkte Kompatibilität mit Drittanbietersystemen. Die Nutzung erfolgt auf eigene Verantwortung. Für direkte oder indirekte Schäden, insbesondere entgangenen Gewinn oder Datenverlust, haftet die BrandUp Factory GmbH nur im Falle grober Fahrlässigkeit oder Vorsatz.
        </p>

        <p>
          <strong>§ 6 Änderungen der Lizenzbedingungen:</strong> Die BrandUp Factory GmbH behält sich das Recht vor, diese Lizenzbedingungen jederzeit mit Wirkung für die Zukunft anzupassen. Über wesentliche Änderungen wird der Nutzer rechtzeitig informiert. Die weitere Nutzung nach Inkrafttreten der geänderten Bedingungen gilt als Zustimmung.
        </p>

        <p className="text-xs text-gray-500 text-right pt-4 border-t">
          Stand: {today}
        </p>
      </div>
    </div>
  )
}
