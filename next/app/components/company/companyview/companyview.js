import { Suspense } from "react";
import CompanyTxtViewClient from "./CompanyTxtViewClient";
import { getAllCompanies, getCompanyQuestions } from "@/app/actions/company-actions";

export default async function CompanyTxtView({ params }) {
  // Safely resolve params (Next.js App Router)
  const { companyId, roundId } = await Promise.resolve(params);

  // Validation
  if (!companyId || !roundId) {
    return (
      <div style={{ padding: "60px 20px", textAlign: "center", fontFamily: "system-ui" }}>
        <h2>❌ Invalid Request</h2>
        <p>Company ID या Round ID missing है।</p>
        <a href="/company" style={{ color: "#0d6efd", textDecoration: "none" }}>
          ← Back to All Companies
        </a>
      </div>
    );
  }

  // Fetch data safely
  let companies = [];
  let questions = [];

  try {
    [companies, questions] = await Promise.all([
      getAllCompanies(),
      getCompanyQuestions(companyId, roundId),
    ]);
  } catch (error) {
    console.error("Error fetching company questions:", error);
  }

  // Prepare topics
  const uniqueTopics = [
    ...new Set((questions || []).map((q) => q.topic || "General")),
  ];

  const mappedTopics = uniqueTopics.map((t) => ({
    topicId: t,
    topicName: t,
    questions: (questions || [])
      .filter((q) => (q.topic || "General") === t)
      .map((q) => ({
        ...q,
        questionText: q.question || "No question text available",
        answer: q.answer || "<p>No answer available</p>",
      })),
  }));

  return (
    <Suspense fallback={<div style={{ padding: "80px", textAlign: "center" }}>Loading interview questions...</div>}>
      <CompanyTxtViewClient
        companyId={companyId}
        roundId={roundId}
        initialTopics={mappedTopics}
        initialCompanies={companies || []}
      />
    </Suspense>
  );
}
