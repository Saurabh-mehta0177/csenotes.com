"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./NotesTxtView.module.css";
import { createTopicSlug } from "@/utils/slug";

// ===================== HELPERS =====================
const stripHtml = (html) => {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").trim();
};

const fixLinks = (html) => {
  if (!html) return "";
  return html.replace(/href="([^"]+)"/g, (match, url) => {
    if (/^https?:\/\//i.test(url)) return `href="${url}"`;
    if (url.startsWith("/")) return `href="${url}"`;
    return `href="https://${url}"`;
  });
};
export default function NotesTxtView({ notes, topics, notetxtId, initialTopicIndex = 0 }){
  const router = useRouter();
  const searchParams = useSearchParams();

const topicsPerPage = 5;

const [currentPage, setCurrentPage] = useState(
  Math.floor(initialTopicIndex / topicsPerPage)
);

  const [selectedTopicIndex, setSelectedTopicIndex] = useState(initialTopicIndex || 0);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const topicRefs = useRef([]);

  const totalPages = Math.ceil(topics.length / topicsPerPage);

  // Mobile Detection
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto Scroll to Active Topic (Desktop)
  useEffect(() => {
    if (!isMobile && topics.length > 0) {
      const el = topicRefs.current[selectedTopicIndex];
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [selectedTopicIndex, isMobile]);

  const startIndex = currentPage * topicsPerPage;
  const currentTopics = topics.slice(startIndex, startIndex + topicsPerPage);

  const currentNoteTitle = notes.find((n) => n.noteId === notetxtId)?.title || "Engineering Notes";

  const handleTopicClick = (globalIndex) => {
    setSelectedTopicIndex(globalIndex);
    const page = Math.floor(globalIndex / topicsPerPage);
    setCurrentPage(page);

    if (isMobile) setIsMobileMenuOpen(false);

    const topicId = topics[globalIndex]?.topicId;
    const slug = currentNoteTitle.toLowerCase().replace(/\s+/g, "-");

    if (slug && topicId) {
    //  router.push(`/notes/${slug}?topicId=${topicId}`, { scroll: false });
    const topicSlug = createTopicSlug(topics[globalIndex]?.topicName);

router.push(`/notes/${slug}/${topicSlug}`, { scroll: false });
    }
  };

  const goNextPage = () => {
    if (currentPage < totalPages - 1) setCurrentPage((prev) => prev + 1);
  };

  const goPrevPage = () => {
    if (currentPage > 0) setCurrentPage((prev) => prev - 1);
  };

  const navigateToNote = (noteId) => {
    const note = notes.find((n) => n.noteId === noteId);
    if (note) {
      const slug = note.title.toLowerCase().replace(/\s+/g, "-");
      router.push(`/notes/${slug}`);
    }
  };

  return (
    <div className={styles.notestxtWrapper}>
      {/* Top Scroll Bar */}
      <div className={styles.topNotesScroll}>
        <div className={styles.scrollTrack}>
          {notes.map((note) => (
            <div
              key={note.noteId}
              className={`${styles.scrollNoteText} ${
                parseInt(note.noteId) === parseInt(notetxtId) ? styles.active : ""
              }`}
              onClick={() => navigateToNote(note.noteId)}
            >
              {note.title}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobile && (
        <>
          <div className={styles.mobileLeftControls}>
            <button
              className={styles.mobileHamburgerBtn}
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            >
              ☰ Topics
            </button>
          </div>

          <div className={`${styles.mobileHalfSidebar} ${isMobileMenuOpen ? styles.open : styles.closed}`}>
            <h3>Topics</h3>
            {topics.map((t, i) => (
              <div
                key={t.topicId}
                className={`${styles.mobileTopicItem} ${i === selectedTopicIndex ? styles.active : ""}`}
                onClick={() => handleTopicClick(i)}
              >
                {stripHtml(t.cleanTopicName || t.topicName)}
              </div>
            ))}
            <p className={styles.topicEnd}>End of Topics</p>
          </div>

          {isMobileMenuOpen && (
            <div className={styles.mobileSidebarOverlay} onClick={() => setIsMobileMenuOpen(false)} />
          )}
        </>
      )}

      {/* Main Layout */}
      <div className={`${styles.contentArea} ${isMobile ? styles.mobileLayout : ""}`}>
        {/* Desktop Sidebar */}
        {!isMobile && (
          <div className={styles.topicsPanel}>
            <div className={styles.topicsHeaderRow}>
              <h3>All Topics ({topics.length})</h3>
              <button className={styles.goBackBtn} onClick={() => router.push("/notes")}>
                ⬅ Go Back
              </button>
            </div>
            <ul>
              {topics.map((t, i) => (
                <li
                  key={t.topicId}
                  className={i === selectedTopicIndex ? styles.active : ""}
                  onClick={() => handleTopicClick(i)}
                >
                  {stripHtml(t.cleanTopicName || t.topicName)}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Main Content Area - 5 Topics per Page */}
        <div className={styles.topicContent}>
          <div className={styles.textControlsRow}>
            <button
              className={styles.downloadNotes}
              onClick={() => router.push(`/notes/pdf?noteId=${notetxtId}`)}
            >
              📥 Download All Topics as PDF
            </button>
          </div>

          <div className={styles.topicContentInner}>
            {currentTopics.map((topic, localIndex) => {
              const globalIndex = startIndex + localIndex;
              const isActive = globalIndex === selectedTopicIndex;

              return (
                <article
                  key={topic.topicId}
                  ref={(el) => (topicRefs.current[globalIndex] = el)}
                  className={`${styles.topicItem} ${isActive ? styles.activeTopic : ""}`}
                >
                  <h2 className={styles.topicHeading}>
                    {stripHtml(topic.cleanTopicName || topic.topicName)}
                  </h2>

                  <div
                    className={styles.topicHtmlContent}
                    dangerouslySetInnerHTML={{ __html: fixLinks(topic.content) }}
                  />
                </article>
              );
            })}
          </div>

          {/* Pagination Controls */}
          <div className={styles.topicNavButtons}>
            <div className={styles.bottomLeftControls}>
              <button
                className={styles.downloadNotes}
                onClick={() => router.push(`/notes/pdf?noteId=${notetxtId}`)}
              >
                📥 Download All Topics as PDF
              </button>
            </div>

            <div className={styles.bottomRightControls}>
              <button onClick={goPrevPage} disabled={currentPage === 0}>
                ← Previous {topicsPerPage} Topics
              </button>
              <span className={styles.pageInfo}>
                Page {currentPage + 1} of {totalPages}
              </span>
              <button onClick={goNextPage} disabled={currentPage === totalPages - 1}>
                Next {topicsPerPage} Topics →
              </button>
            </div>
          </div>
        </div>

        {!isMobile && <div className={styles.rightEmptySpace} />}
      </div>
    </div>
  );
}