'use client';

import React, { useState, useEffect } from 'react';
import { isValidUrl, generateShortId } from './utils/utils';
import Link from 'next/link';

export default function Home() {
  const [urlList, setUrlList] = useState([]);
  const [shortenedUrl, setShortenedUrl] = useState('');
  const [formData, setFormData] = useState({
    longUrl: '',
  });
  const [error, setError] = useState('');
  
  useEffect(() => {
    fetchUrls();
  }, []);

  const buildShortUrl = (shortId: string) => { 
    return `${process.env.NEXT_PUBLIC_BASE_URL}/${shortId}`
  }

  const fetchUrls = async () => {
    try {
      const response = await fetch('/api/urls');
      if (response.ok) {
        const data = await response.json();
        setUrlList(data);
      } else {
        console.error('Failed to fetch URLs');
      }
    } catch (error) {
      console.error('Error fetching URLs:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidUrl(formData.longUrl)) {
      setError('Bitte gib eine gültige URL ein (z.B. https://example.com)');
      return;
    }
    setError("")
    const shortId = generateShortId();
    const shortUrl = buildShortUrl(shortId);
    setShortenedUrl(shortUrl);

    try {
      const response = await fetch('/api/urls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          longUrl: formData.longUrl,
          shortUrl,
          shortId
        }),
      });

      if (response.ok) {
        setFormData({ longUrl: '' });
        fetchUrls();
      } else {
        const errorData = await response.json();
        console.error('Error:', errorData.error);
      }
    } catch (error) {
      console.error('Error creating URL:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/urls?id=${id}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        console.log(`URL with ID ${id} deleted successfully.`);
        fetchUrls();
      } else {
        const errorData = await response.json();
        console.error('Error deleting URL:', errorData.error);
      }
    } catch (error) {
      console.error('Error deleting URL:', error);
    }
  };
  

  return (
    <>
      <nav className="bg-pink-500 text-white shadow-md py-4">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="text-xl font-bold">
            <a href="#" className="hover:text-pink-200">Shortify</a>
          </div>
          <div className="space-x-4">
            <Link
              href="/signup"
              className="hover:bg-pink-600 px-4 py-2 rounded-md transition duration-200"
            >
              Registrierung
            </Link>
            <Link
              href="/login"
              className="hover:bg-pink-600 px-4 py-2 rounded-md transition duration-200"
            >
              Anmelden
            </Link>
          </div>
        </div>
      </nav>

      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
          <h1 className="text-2xl font-semibold mb-4 text-center">URL Shortener</h1>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="mb-4">
            <div className="flex">
              <input
                type="text"
                value={formData.longUrl}
                onChange={(e) =>
                  setFormData({ ...formData, longUrl: e.target.value })
                }
                placeholder="URL eingeben"
                className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <button
                type="submit"
                className="bg-pink-500 text-white px-4 py-2 rounded-r-md hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                Kürzen
              </button>
            </div>
          </form>

          {shortenedUrl && (
            <div className="text-center mt-4">
              <p className="text-xl font-semibold">Shortened URL:</p>
              <Link
                href={shortenedUrl}
                className="text-pink-500 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {shortenedUrl}
              </Link>
            </div>
          )}

          <div className="space-y-4 mt-8">
            <h2 className="text-xl font-bold">Saved URLs</h2>
            {urlList.map((url: { id: number; longUrl: string; shortUrl: string, shortId: string, views: number }) => (
              <div
                key={url.id}
                className="border p-1 rounded flex justify-between items-center"
              >
                <div>
                  <p>
                    <strong>Short URL:</strong>{' '}
                    <Link
                      href={`/${url.shortId}`}
                      target="_blank"
                      className="text-pink-500 hover:underline"
                    >
                      {url.shortUrl}
                    </Link>
                  </p>
                  <p>
                    <strong>Long URL:</strong> {url.longUrl}
                  </p>
                  </div>
                  <div className='flex items-center gap-3'>
                    <button
                      onClick={() => handleDelete(url.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 focus:outline-none"
                    >
                      Delete
                    </button>
                    <div>
                      {url.views} Views
                    </div>  
              </div>

            ))}
          </div>
        </div>
      </div>
    </>
  );
}
