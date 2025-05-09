export default function MySectionsPage() {
    return (
      <div className="p-10 h-screen overflow-hidden">
        <div className="bg-white shadow rounded-lg p-8 w-full max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-[#1c2838] mb-4">Meine Sections</h1>
          <p className="text-sm text-gray-600">
            Hier werden alle deine individuell gestalteten Sections gespeichert – bereit zum Exportieren.
          </p>
  
          {/* Platzhalter für später: */}
          <div className="mt-8 text-center text-gray-400 text-sm">
            💾 Noch keine Sections gespeichert. Beginne jetzt mit dem Builder!
          </div>
        </div>
      </div>
    );
  }
  