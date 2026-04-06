import Link from 'next/link';

// ─── Types ───────────────────────────────────────────────────────────────────

interface ArticleItem {
  handle: string;
  title: string;
  excerpt: string;
  image: { url: string } | null;
  publishedAt?: string;
}

interface HomeBlogNewsProps {
  journalArticles: ArticleItem[];
  newsArticles: ArticleItem[];
  labels: {
    journalHeading: string;
    newsHeading: string;
    viewAll: string;
    readMore: string;
  };
}

// ─── Scoped CSS ──────────────────────────────────────────────────────────────

const scopedCss = `
.hbn-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:24px}
.hbn-img img{transition:transform .65s cubic-bezier(.25,.46,.45,.94)}
.hbn-card:hover .hbn-img img{transform:scale(1.04)}
.hbn-card:hover .hbn-title,.hbn-card:hover .hbn-read{opacity:.6}
.hbn-link:hover{opacity:.6}
@media(min-width:768px){
  .hbn-section{padding-left:64px;padding-right:64px}
  .hbn-grid{grid-template-columns:repeat(4,1fr);gap:32px}
}
`;

// ─── Article Card ────────────────────────────────────────────────────────────

function ArticleCard({
  article,
  basePath,
  readMoreLabel,
  priority,
}: {
  article: ArticleItem;
  basePath: string;
  readMoreLabel: string;
  priority?: boolean;
}) {
  const href = `${basePath}/${article.handle}`;
  const imgUrl = article.image?.url;

  return (
    <article className="hbn-card">
      <Link href={href} style={{ textDecoration: 'none', display: 'block' }}>
        {/* 3:4 image */}
        <div
          className="hbn-img"
          style={{
            position: 'relative',
            aspectRatio: '3/4',
            overflow: 'hidden',
            marginBottom: 16,
            backgroundColor: '#d5ccc3',
          }}
        >
          {imgUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imgUrl}
              alt={article.title}
              loading={priority ? 'eager' : 'lazy'}
              draggable={false}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'top',
              }}
            />
          )}
        </div>

        {/* Title */}
        <h3
          className="hbn-title"
          style={{
            fontFamily: 'var(--font-cormorant), "Cormorant", serif',
            fontWeight: 300,
            fontSize: 17,
            color: '#1a1a1a',
            letterSpacing: '0.04em',
            lineHeight: 1.4,
            marginBottom: 8,
            transition: 'opacity 0.2s',
          }}
        >
          {article.title}
        </h3>

        {/* Excerpt */}
        {article.excerpt && (
          <p
            style={{
              fontFamily: 'var(--font-montserrat), "Montserrat", sans-serif',
              fontWeight: 400,
              fontSize: 13,
              color: '#555555',
              lineHeight: 1.75,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              marginBottom: 16,
            }}
          >
            {article.excerpt}
          </p>
        )}

        {/* Read More */}
        <span
          className="hbn-read"
          style={{
            fontFamily: 'var(--font-montserrat), "Montserrat", sans-serif',
            fontSize: 11,
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            color: '#555555',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            transition: 'opacity 0.2s',
          }}
        >
          {readMoreLabel}
          <span style={{ display: 'inline-block', width: 20, height: 1, backgroundColor: '#555555' }} />
        </span>
      </Link>
    </article>
  );
}

// ─── Section ─────────────────────────────────────────────────────────────────

function Section({
  heading,
  viewAllLabel,
  viewAllHref,
  articles,
  basePath,
  readMoreLabel,
}: {
  heading: string;
  viewAllLabel: string;
  viewAllHref: string;
  articles: ArticleItem[];
  basePath: string;
  readMoreLabel: string;
}) {
  if (articles.length === 0) return null;

  return (
    <div style={{ marginBottom: 60 }}>
      {/* Section header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          marginBottom: 32,
          borderBottom: '1px solid rgba(0,0,0,0.1)',
          paddingBottom: 16,
        }}
      >
        <h3
          style={{
            fontFamily: 'var(--font-cormorant), "Cormorant", serif',
            fontWeight: 300,
            fontSize: 20,
            color: '#1a1a1a',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            margin: 0,
          }}
        >
          {heading}
        </h3>
        <Link
          href={viewAllHref}
          className="hbn-link"
          style={{
            fontFamily: 'var(--font-montserrat), "Montserrat", sans-serif',
            fontSize: 11,
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            color: '#555555',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            transition: 'opacity 0.2s',
          }}
        >
          {viewAllLabel}
          <span style={{ display: 'inline-block', width: 20, height: 1, backgroundColor: '#555555' }} />
        </Link>
      </div>

      {/* Article grid */}
      <div className="hbn-grid">
        {articles.slice(0, 4).map((article, idx) => (
          <ArticleCard
            key={article.handle}
            article={article}
            basePath={basePath}
            readMoreLabel={readMoreLabel}
            priority={idx === 0}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function HomeBlogNews({
  journalArticles,
  newsArticles,
  labels,
}: HomeBlogNewsProps) {
  if (journalArticles.length === 0 && newsArticles.length === 0) return null;

  return (
    <section
      className="hbn-section"
      style={{
        backgroundColor: '#E8DFD6',
        paddingTop: 80,
        paddingBottom: 30,
        paddingLeft: 30,
        paddingRight: 30,
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: scopedCss }} />

      {/* Top label */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 56 }}>
        <p
          style={{
            fontFamily: 'var(--font-montserrat), "Montserrat", sans-serif',
            fontSize: 11,
            color: '#555555',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            marginBottom: 12,
          }}
        >
          EDITORIAL
        </p>
        <h2
          style={{
            fontFamily: 'var(--font-cormorant), "Cormorant", serif',
            fontWeight: 300,
            fontSize: 22,
            color: '#1a1a1a',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            margin: 0,
          }}
        >
          INSIDE VIONIS·XY
        </h2>
        <div
          style={{ width: 40, height: 1, backgroundColor: '#1a1a1a', opacity: 0.25, marginTop: 20 }}
        />
      </div>

      {/* Journal section */}
      <Section
        heading={labels.journalHeading}
        viewAllLabel={labels.viewAll}
        viewAllHref="/blog"
        articles={journalArticles}
        basePath="/blog"
        readMoreLabel={labels.readMore}
      />

      {/* News section */}
      <Section
        heading={labels.newsHeading}
        viewAllLabel={labels.viewAll}
        viewAllHref="/news"
        articles={newsArticles}
        basePath="/news"
        readMoreLabel={labels.readMore}
      />
    </section>
  );
}
