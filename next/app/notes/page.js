import NotesTxtList from "@/app/components/notes/notestxtlist/notestxtlist";

export const metadata = {
  title: "Free CSE Notes PDF Download | B.Tech Computer Science Engineering Notes (All Semesters)",
  description:
    "Download free B.Tech Computer Science Engineering (CSE) notes, PYQs, handwritten study material and semester-wise PDFs. Covers DSA, Operating System, DBMS, TOC, Software Engineering and more for exam and placement preparation.",

  keywords: [
    "CSE notes PDF",
    "free BTech notes",
    "computer science engineering notes",
    "DSA notes PDF",
    "DBMS notes PDF",
    "Operating System notes",
    "TOC notes",
    "software engineering notes",
    "engineering study material",
    "PYQs BTech"
  ],

  openGraph: {
    title: "Free CSE Notes PDF Download – All Subjects | CSENOTES",
    description:
      "Download high-quality, semester-wise Computer Science Engineering notes, PYQs and study material for exams and placements.",
    url: "https://csenotes.com/notes",
    siteName: "CSENOTES",
    type: "website",
    images: [
      {
        url: "https://csenotes.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Free CSE Notes PDF Download"
      }
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Free CSE Notes PDF Download | CSENOTES",
    description:
      "Download free B.Tech CSE notes, PYQs and study material for all semesters.",
    images: ["https://csenotes.com/og-image.jpg"],
  },

  alternates: {
    canonical: "https://csenotes.com/notes",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function Page() {
  return <NotesTxtList />;
}