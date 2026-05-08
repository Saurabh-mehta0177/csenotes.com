import { page } from "../data/data";
import PdfViewerClient from "./PdfViewerClient";

export default async function Page({ params }) {
  const { id } = await params;

  const current = page.find(
    (p) => p.slug === id
  );

  if (!current) {
    return <div style={{ padding: 20 }}>❌ PDF not found</div>;
  }

  return (
    <PdfViewerClient
      id={current.id}
      current={current}
      page={page}
    />
  );
}