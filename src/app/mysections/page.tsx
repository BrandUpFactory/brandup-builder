"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/clients";
import { Session, User } from "@supabase/supabase-js";
import Link from "next/link";

interface SectionEntry {
  id: number;
  title: string;
  template_id: string;
  created_at: string;
}

export default function MySectionsPage() {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [sections, setSections] = useState<SectionEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event: string, session: Session | null) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchSections = async () => {
      const { data, error } = await supabase
        .from("sections")
        .select("id, title, template_id, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setSections(data);
      }
      setLoading(false);
    };

    fetchSections();
  }, [user]);

  return (
    <div className="p-10 h-screen overflow-hidden">
      <div className="bg-white shadow rounded-lg p-8 w-full max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-[#1c2838] mb-4">Meine Sections</h1>
        <p className="text-sm text-gray-600">
          Hier werden alle deine individuell gestalteten Sections gespeichert – bereit zum Exportieren.
        </p>

        <div className="mt-8">
          {loading ? (
            <p className="text-center text-gray-400">Lade...</p>
          ) : sections.length === 0 ? (
            <div className="text-center text-gray-400 text-sm">
              💾 Noch keine Sections gespeichert. Beginne jetzt mit dem Builder!
            </div>
          ) : (
            <ul className="space-y-4">
              {sections.map((section) => (
                <li key={section.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-semibold text-[#1c2838] text-sm">{section.title}</h2>
                      <p className="text-xs text-gray-500">{section.template_id} – {new Date(section.created_at).toLocaleDateString()}</p>
                    </div>
                    <Link
                      href={`/editor/${section.template_id}?id=${section.id}`}
                      className="bg-[#1c2838] text-white px-4 py-1.5 text-xs rounded-full hover:opacity-90 transition"
                    >
                      Bearbeiten
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}