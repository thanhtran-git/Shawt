"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, Trash2, Copy, Check } from "lucide-react"
import Link from "next/link"

interface UrlCardProps {
    id: number;
    shortUrl: string;
    longUrl: string;
    views: number;
    handleDelete: (id: number, shortId: string) => void;
  }

export default function UrlCard({ id, shortUrl, longUrl, views, handleDelete }: UrlCardProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(shortUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000) 
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="flex-grow space-y-2">
            <div className="flex items-center space-x-2">
              <span className="font-semibold">Short URL:</span>
                <Link href={shortUrl} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
                    {shortUrl}
                </Link>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold">Original URL:</span>
              <span className="text-muted-foreground truncate max-w-xs">{longUrl}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 text-muted-foreground">
              <Eye size={18} />
              <span>{views}</span>
            </div>
            <Button variant="outline" size="icon" onClick={handleCopy}>
              {copied ? <Check size={18} /> : <Copy size={18} />}
            </Button>
            <Button variant="outline" size="icon" onClick={()=>handleDelete(id, shortUrl)}>
              <Trash2 size={18} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}