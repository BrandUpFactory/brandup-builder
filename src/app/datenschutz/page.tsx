'use client'

import Link from 'next/link'

export default function DatenschutzPage() {
  return (
    <div className="min-h-screen bg-white py-16 px-4 sm:px-6 lg:px-8 w-full max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-[#1c2838] mb-4">Datenschutzerklärung</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Der Schutz deiner Daten ist uns wichtig. Hier erfährst du, wie wir mit deinen Daten umgehen.
        </p>
      </div>

      <div className="prose prose-lg max-w-none text-gray-600">
        <h2 className="text-2xl font-bold text-[#1c2838] mb-4">1. Verantwortliche Stelle</h2>
        <p>
          Verantwortlich für die Erhebung, Verarbeitung und Nutzung deiner personenbezogenen Daten im Sinne der Datenschutz-Grundverordnung (DSGVO) ist:
        </p>
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <p className="mb-1"><strong>BrandUp Factory GmbH</strong></p>
          <p className="mb-1">Musterstraße 123</p>
          <p className="mb-1">12345 Musterstadt</p>
          <p className="mb-1">Deutschland</p>
          <p className="mb-1">E-Mail: datenschutz@brandupfactory.com</p>
        </div>

        <h2 className="text-2xl font-bold text-[#1c2838] mb-4">2. Erhebung und Speicherung personenbezogener Daten</h2>
        <p>
          Wenn du unsere Website besuchst oder unsere Dienste nutzt, erheben wir folgende Daten:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li>IP-Adresse</li>
          <li>Datum und Uhrzeit der Anfrage</li>
          <li>Zeitzonendifferenz zur Greenwich Mean Time (GMT)</li>
          <li>Inhalt der Anforderung (konkrete Seite)</li>
          <li>Zugriffsstatus/HTTP-Statuscode</li>
          <li>Jeweils übertragene Datenmenge</li>
          <li>Website, von der die Anforderung kommt</li>
          <li>Browser, Sprache und Version der Browsersoftware</li>
          <li>Betriebssystem und dessen Oberfläche</li>
        </ul>
        <p>
          Bei der Registrierung eines Kontos erheben wir zusätzlich:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li>E-Mail-Adresse</li>
          <li>Name (optional)</li>
          <li>Passwort (verschlüsselt)</li>
        </ul>

        <h2 className="text-2xl font-bold text-[#1c2838] mb-4">3. Zweck der Datenverarbeitung</h2>
        <p>
          Wir verarbeiten deine Daten für folgende Zwecke:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li>Bereitstellung unserer Website und Dienste</li>
          <li>Verbesserung unserer Angebote</li>
          <li>Beantwortung deiner Anfragen</li>
          <li>Verhinderung von Missbrauch</li>
          <li>Wenn du zugestimmt hast: Zusendung von Newslettern und Marketinginformationen</li>
        </ul>

        <h2 className="text-2xl font-bold text-[#1c2838] mb-4">4. Rechtsgrundlage</h2>
        <p>
          Die Rechtsgrundlage für die Verarbeitung deiner Daten ist:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li>Deine Einwilligung (Art. 6 Abs. 1 lit. a DSGVO)</li>
          <li>Die Erfüllung eines Vertrages mit dir (Art. 6 Abs. 1 lit. b DSGVO)</li>
          <li>Die Erfüllung rechtlicher Verpflichtungen (Art. 6 Abs. 1 lit. c DSGVO)</li>
          <li>Unser berechtigtes Interesse (Art. 6 Abs. 1 lit. f DSGVO)</li>
        </ul>

        <h2 className="text-2xl font-bold text-[#1c2838] mb-4">5. Weitergabe von Daten</h2>
        <p>
          Eine Übermittlung deiner persönlichen Daten an Dritte zu anderen als den im Folgenden aufgeführten Zwecken findet nicht statt.
        </p>
        <p className="mb-6">
          Wir geben deine persönlichen Daten nur an Dritte weiter, wenn:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li>Du deine ausdrückliche Einwilligung dazu erteilt hast (Art. 6 Abs. 1 lit. a DSGVO)</li>
          <li>Die Weitergabe zur Erfüllung eines Vertrages mit dir erforderlich ist (Art. 6 Abs. 1 lit. b DSGVO)</li>
          <li>Die Weitergabe zur Erfüllung einer rechtlichen Verpflichtung erforderlich ist (Art. 6 Abs. 1 lit. c DSGVO)</li>
          <li>Die Weitergabe zur Wahrung berechtigter Interessen erforderlich ist (Art. 6 Abs. 1 lit. f DSGVO)</li>
        </ul>

        <h2 className="text-2xl font-bold text-[#1c2838] mb-4">6. Cookies</h2>
        <p className="mb-6">
          Wir verwenden auf unserer Webseite Cookies. Hierbei handelt es sich um kleine Dateien, die dein Browser automatisch erstellt und die auf deinem Endgerät gespeichert werden, wenn du unsere Seite besuchst. Cookies richten auf deinem Endgerät keinen Schaden an, enthalten keine Viren, Trojaner oder sonstige Schadsoftware.
        </p>
        <p className="mb-6">
          Die meisten Browser akzeptieren Cookies automatisch. Du kannst deinen Browser jedoch so konfigurieren, dass keine Cookies auf deinem Computer gespeichert werden oder stets ein Hinweis erscheint, bevor ein neues Cookie angelegt wird.
        </p>

        <h2 className="text-2xl font-bold text-[#1c2838] mb-4">7. Deine Rechte</h2>
        <p>
          Du hast das Recht:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li>Gemäß Art. 15 DSGVO Auskunft über deine von uns verarbeiteten personenbezogenen Daten zu verlangen</li>
          <li>Gemäß Art. 16 DSGVO unverzüglich die Berichtigung unrichtiger oder Vervollständigung deiner bei uns gespeicherten personenbezogenen Daten zu verlangen</li>
          <li>Gemäß Art. 17 DSGVO die Löschung deiner bei uns gespeicherten personenbezogenen Daten zu verlangen</li>
          <li>Gemäß Art. 18 DSGVO die Einschränkung der Verarbeitung deiner personenbezogenen Daten zu verlangen</li>
          <li>Gemäß Art. 20 DSGVO deine personenbezogenen Daten, die du uns bereitgestellt hast, in einem strukturierten, gängigen und maschinenlesebaren Format zu erhalten oder die Übermittlung an einen anderen Verantwortlichen zu verlangen</li>
          <li>Gemäß Art. 7 Abs. 3 DSGVO deine einmal erteilte Einwilligung jederzeit gegenüber uns zu widerrufen</li>
          <li>Gemäß Art. 77 DSGVO dich bei einer Aufsichtsbehörde zu beschweren</li>
        </ul>

        <h2 className="text-2xl font-bold text-[#1c2838] mb-4">8. Änderung der Datenschutzerklärung</h2>
        <p className="mb-6">
          Wir behalten uns vor, diese Datenschutzerklärung anzupassen, damit sie stets den aktuellen rechtlichen Anforderungen entspricht oder um Änderungen unserer Leistungen in der Datenschutzerklärung umzusetzen, z.B. bei der Einführung neuer Services.
        </p>
        <p>
          Für deinen erneuten Besuch gilt dann die neue Datenschutzerklärung. Die aktuelle Version wurde im Mai 2025 erstellt.
        </p>

        <h2 className="text-2xl font-bold text-[#1c2838] mb-4">9. Kontakt</h2>
        <p>
          Bei Fragen zur Erhebung, Verarbeitung oder Nutzung deiner personenbezogenen Daten, bei Auskünften, Berichtigung, Sperrung oder Löschung von Daten sowie Widerruf erteilter Einwilligungen wende dich bitte an:
        </p>
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <p className="mb-1"><strong>BrandUp Factory GmbH</strong></p>
          <p className="mb-1">Datenschutzbeauftragter</p>
          <p className="mb-1">Musterstraße 123</p>
          <p className="mb-1">12345 Musterstadt</p>
          <p className="mb-1">Deutschland</p>
          <p>E-Mail: datenschutz@brandupfactory.com</p>
        </div>
      </div>

      <div className="mt-12 text-center">
        <Link href="/" className="inline-flex items-center px-6 py-3 rounded-lg bg-[#1c2838] text-white font-medium transition hover:bg-[#1c2838]/90 shadow-md hover:shadow-lg">
          Zurück zur Startseite
        </Link>
      </div>
    </div>
  )
}