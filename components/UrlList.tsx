// components/UrlList.tsx
import UrlCard from "./UrlCard";

interface UrlListProps {
  urlList: { id: number; longUrl: string; shortUrl: string; shortId: string; views: number }[];
  handleDelete: (id: number, shortId: string) => Promise<void>;
}

function UrlList({ urlList, handleDelete }: UrlListProps) {
  if (urlList.length === 0) return null;
  return (
    <section className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Your Shortened URLs</h2>
      <div className="space-y-4">
        {urlList.map((url) => (
          <UrlCard
            key={url.id}
            id={url.id}
            shortUrl={url.shortUrl}
            longUrl={url.longUrl}
            views={url.views}
            handleDelete={handleDelete}
          />
        ))}
      </div>
    </section>
  );
};

export default UrlList;