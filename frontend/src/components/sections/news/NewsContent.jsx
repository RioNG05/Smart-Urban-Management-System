export default function NewsContent({ article }) {
  return (
    <article className="news-article">
      <div className="news-breadcrumb">Home / News / Market</div>

      <h1 className="news-title">{article.title}</h1>

      <div className="news-meta">
        <span>Author: {article.author}</span>
        <span>{article.date}</span>
      </div>

      <div className="news-hero">
        <img src={article.image} alt={article.title} />
      </div>

      <div className="news-body">
        {article.content.split("\n").map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </article>
  );
}
