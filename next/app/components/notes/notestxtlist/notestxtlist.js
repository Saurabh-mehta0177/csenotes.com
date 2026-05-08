import Link from "next/link";
import API_BASE_URL from "@/app/config";
import styles from "./NotesTxtList.module.css";
import { createSlug } from "@/utils/slug";
import Script from "next/script";

export const metadata = {
  title: "Free CSE Notes & PDF Download – All Subjects | CSENOTES",
  description: "Download free B.Tech CSE engineering notes, previous year questions (PYQs), summaries and study material for all semesters. DSA, OS, DBMS, TOC, Software Engineering and more.",
  alternates: { canonical: "https://csenotes.com/notes" },
  keywords: "CSE notes, engineering notes, B.Tech notes, free notes PDF, DSA notes, OS notes, DBMS notes, PYQs, semester notes",
};

// Server-side fetch with ISR (Best for SEO)
async function getNotes() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/txtnotes`, {
      next: { revalidate: 3600 },   // 1 hour cache → SEO friendly + fast
    });

    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("Error fetching notes:", err);
    return [];
  }
}

export default async function NotesTxtList() {
  const notes = await getNotes();

  if (!notes.length) {
    return (
      <div className={styles["notes-page-wrapper"]}>
        <div className={styles["notes-container"]}>
          <h1 className={styles["page-title"]}>
            <span className={styles["title-icon"]}>📚</span> Free CSE Engineering Notes
          </h1>
          <p className={styles["page-subtitle"]}>No notes available at the moment. Please check back later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles["notes-page-wrapper"]}>
      <div className={styles["notes-container"]}>
        
        {/* ✅ Proper H1 - Most Important for SEO */}
        <div className={styles["page-header"]}>
          <h2 className={styles["page-title"]}>
            <span className={styles["title-icon"]}>📚</span> 
            Free CSE Engineering Notes &amp; Study Material
            <span className={styles["notes-count"]}>({notes.length})</span>
          </h2>

          {/* ✅ SEO Rich Descriptive Content */}
          <div className={styles["page-subtitle"]}>
            <p>
              Download high-quality <strong>B.Tech CSE notes</strong>, previous year questions (PYQs), 
              summaries and complete study material for all semesters. 
              Subjects include DSA, Operating System, DBMS, Theory of Computation, Software Engineering, 
              Data Mining, Big Data and more.
            </p>
            <p>
              All notes are handpicked, well-organized and created to help students understand concepts 
              clearly and prepare better for exams and placements.
            </p>
          </div>
        </div>

        {/* Notes Grid */}
        <div className={styles["notes-grid"]}>
          {notes.map((note, index) => (
            <Link
              key={note.noteId}
              href={`/notes/${createSlug(note.title)}`}
              className={styles["note-card"]}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className={styles["note-image-wrapper"]}>
                <img
                  src={
                    note.imageUrl?.trim()
                      ? note.imageUrl
                      : "https://via.placeholder.com/300x180/4A6572/FFFFFF?text=Notes"
                  }
                  alt={`${note.title} - Free CSE Notes PDF`}
                  className={styles["note-image"]}
                  loading="lazy"
                />
                <div className={styles["note-overlay"]}>
                  <span className={styles["view-text"]}>View Notes →</span>
                </div>
              </div>

              <div className={styles["note-content"]}>
                <h2 className={styles["note-title"]}>{note.title}</h2>
                <div className={styles["note-footer"]}>
                  <span className={styles["note-action"]}>Explore Full Notes</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* JSON-LD Schema - ItemList (Good for SEO) */}
      <Script
        id="notes-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Free CSE Engineering Notes",
            "url": "https://csenotes.com/notes",
            "numberOfItems": notes.length,
            "itemListElement": notes.map((note, i) => ({
              "@type": "ListItem",
              "position": i + 1,
              "url": `https://csenotes.com/notes/${createSlug(note.title)}`,
              "name": note.title,
            })),
          }),
        }}
      />
    </div>
  );
}