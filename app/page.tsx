'use client';

import React, { useState, useEffect } from 'react';
import {generateShortId } from '@/utils/utils';
import UrlForm from '@/components/UrlForm';
import UrlList from '@/components/UrlList';
import buildShortUrl from '@/utils/utils';

export default function Home() {
  const [urlList, setUrlList] = useState([]);
  const [formData, setFormData] = useState({ longUrl: '' });

  async function fetchUrls() {
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

  async function handleSubmit(e: React.FormEvent){
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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      fetchUrls();
    }
  }, []);

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow container mx-auto px-4 py-8">
          <section className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Shorten Your Links</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Got a long web address? Paste your link below to shawten it!
            </p>
          </section>
          <UrlForm formData={formData} setFormData={setFormData} handleSubmit={handleSubmit} />
          <UrlList urlList={urlList} handleDelete={handleDelete} />
        </main>
      </div>
    </>
  );
}