'use client'

import { useState } from 'react';
import { isValidUrl, generateShortId } from './utils/utils';

export default function Home() {
  const [url, setUrl] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState('');
  const [error, setError] = useState('');

  const [existingShortLinks, setExistingShortLinks] = useState<string[]>([]);

  const handleSubmit = () => {
    if (!isValidUrl(url)) {
      setError('Gib eine valide URL ein');
      setShortenedUrl('');
      return;
    }

    setError('');
    
    let shortId = generateShortId();
    while (existingShortLinks.includes(shortId)) {
      shortId = generateShortId(); 
    }

    setExistingShortLinks([...existingShortLinks, shortId]);

    const shortLink = `HOSTER/${shortId}`;

    setShortenedUrl(shortLink);
  };

  return (
    <>
      {/* Navbar */}
      <nav className="bg-pink-500 text-white shadow-md py-4">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="text-xl font-bold">
            <a href="#" className="hover:text-pink-200">URL Shortener</a>
          </div>
          <div className="space-x-4">
            <a
              href="/signup"
              className="hover:bg-pink-600 px-4 py-2 rounded-md transition duration-200"
            >
              Sign Up
            </a>
            <a
              href="/login"
              className="hover:bg-pink-600 px-4 py-2 rounded-md transition duration-200"
            >
              Login
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-semibold mb-4 text-center">URL Shortener</h1>


          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form
            onSubmit={(e) => {
              e.preventDefault(); 
              handleSubmit(); 
            }}
            className="mb-4"
          >
            <div className="flex">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="URL eingeben"
                className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <button
                type="submit" // Specify the button type as "submit"
                className="bg-pink-500 text-white px-4 py-2 rounded-r-md hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                Kürzen
              </button>
            </div>
          </form>

          {/* Display the Shortened URL */}
          {shortenedUrl && (
            <div className="text-center mt-4">
              <p className="text-xl font-semibold">Shortened URL:</p>
              <a href={shortenedUrl} className="text-pink-500 hover:underline" target="_blank" rel="noopener noreferrer">
                {shortenedUrl}
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
