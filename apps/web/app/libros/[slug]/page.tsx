import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ShoppingCart, BookOpen } from "lucide-react";
import { getBook, safe, type Book } from "@/lib/api";
import { BookReader } from "@/components/BookReader";
import { BookReadingPanel } from "@/components/BookProgress";

export const dynamic = "force-dynamic";

export default async function BookDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const book = await safe<Book | null>(getBook(slug), null);
  if (!book) notFound();

  return (
    <main className="mx-auto max-w-4xl px-8 py-10">
      <Link
        href="/libros"
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-ink"
      >
        <ArrowLeft size={15} /> Volver a libros
      </Link>

      <div className="mt-5 flex flex-col gap-5 sm:flex-row">
        {book.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={book.coverUrl}
            alt={book.title}
            className="h-48 w-32 shrink-0 self-start rounded-md border border-line object-cover shadow-card"
          />
        ) : null}
        <div className="min-w-0">
        <h1 className="text-2xl font-semibold">{book.title}</h1>
        <p className="mt-1 text-muted">
          {book.author}
          {book.publisher ? ` · ${book.publisher}` : ""}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="tag capitalize">{book.level}</span>
          <span className="tag capitalize">{book.audience}</span>
          {book.pages && <span className="tag">{book.pages} págs.</span>}
          {book.tags.map((t) => (
            <span key={t} className="tag">
              {t}
            </span>
          ))}
        </div>
        {book.summary && (
          <p className="mt-4 text-sm text-muted">{book.summary}</p>
        )}
        <div className="mt-5 flex flex-wrap gap-2">
          {book.buyUrl && (
            <a
              href={book.buyUrl}
              target="_blank"
              className="inline-flex items-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark"
            >
              <ShoppingCart size={15} /> Comprar
            </a>
          )}
          {book.fileUrl && (
            <a
              href={book.fileUrl}
              target="_blank"
              className="inline-flex items-center gap-2 rounded-md border border-line px-4 py-2 text-sm hover:bg-canvas"
            >
              <BookOpen size={15} /> Abrir en pestaña
            </a>
          )}
        </div>
        </div>
      </div>

      <div className="mt-6">
        <BookReadingPanel bookSlug={book.slug} pages={book.pages} />
      </div>

      {book.fileUrl && (
        <section className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
            Lector
          </h2>
          <div className="mt-3">
            <BookReader url={book.fileUrl} />
          </div>
        </section>
      )}
    </main>
  );
}
