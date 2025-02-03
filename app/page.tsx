'use client';

import React, { useState, useEffect } from 'react';
import {generateShortId } from '@/utils/utils';
import Link from 'next/link';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import UrlCard from  "@/components/UrlCard"

export default function Home() {
  const [urlList, setUrlList] = useState([]);
  const [formData, setFormData] = useState({ longUrl: '' });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      fetchUrls();
    }
  }, []);

  const buildShortUrl = (shortId: string) => `${process.env.NEXT_PUBLIC_BASE_URL}/r/${shortId}`;

  const fetchUrls = async () => {
    try {
      const storedShortIds = JSON.parse(localStorage.getItem('shortIds') || '[]');

      if (storedShortIds.length === 0) {
        setUrlList([]);
        return;
      }

      const response = await fetch(`/api/urls?shortIds=${storedShortIds.join(',')}`);
      
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

    const shortId = generateShortId();
    const shortUrl = buildShortUrl(shortId);

    try {
      const response = await fetch('/api/urls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ longUrl: formData.longUrl, shortUrl, shortId }),
      });

      if (response.ok) {
        setFormData({ longUrl: '' });


        const storedShortIds = JSON.parse(localStorage.getItem('shortIds') || '[]');
        localStorage.setItem('shortIds', JSON.stringify([...storedShortIds, shortId]));

        fetchUrls();
      } else {
        const errorData = await response.json();
        console.error('Error:', errorData.error);
      }
    } catch (error) {
      console.error('Error creating URL:', error);
    }
  };

  async function handleDelete(id: number, shortId: string) {
    try {
      const response = await fetch(`/api/urls?id=${id}`, { method: 'DELETE' });

      if (response.ok) {
        console.log(`URL with ID ${id} deleted successfully.`);
        const storedShortIds = JSON.parse(localStorage.getItem('shortIds') || '[]');
        const updatedShortIds = storedShortIds.filter((sid: string) => sid !== shortId);
        localStorage.setItem('shortIds', JSON.stringify(updatedShortIds));

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
    <div className="min-h-screen flex flex-col">
      <nav className="bg-primary text-primary-foreground p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            Shrunk
          </Link>
          <div className="space-x-4">
            <Link href="/about" className="hover:underline">
              About
            </Link>
            <Link href="/contact" className="hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-grow container mx-auto px-4 py-8">
        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Shrink Your Links</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Got a long web address? Just paste your link below, click the button and you are done!
          </p>
        </section>

        <section className="max-w-2xl mx-auto mb-12">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
            <Input  
                type="url"
                value={formData.longUrl}
                onChange={(e) => setFormData({ ...formData, longUrl: e.target.value })}
                placeholder="Enter your URL in the format http(s)://example.com"
                className="flex-grow"
                required 
              />
            <Button type="submit" className="w-full sm:w-auto">
              Shorten URL
            </Button>
          </form>
        </section>

        <section className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Your Shortened URLs</h2>
          <div className="space-y-4">
            {urlList.map((url: { id: number; longUrl: string; shortUrl: string; shortId: string; views: number }) => (
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
      </main>

      <footer className="bg-muted mt-auto py-4">
        <div className="container mx-auto text-center text-muted-foreground">
          © {new Date().getFullYear()} Shrunk. All rights reserved.
        </div>
      </footer>
    </div>
    </>
  );
}
