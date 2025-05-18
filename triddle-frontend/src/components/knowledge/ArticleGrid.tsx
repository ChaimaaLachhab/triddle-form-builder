"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

interface Article {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface ArticleGridProps {
  articles: Article[];
  title: string;
}

export function ArticleGrid({ articles, title }: ArticleGridProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {articles.map((article) => (
          <Link key={article.id} href={`/knowledge-base/article/${article.id}`}>
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <div>{article.icon}</div>
                  <CardTitle className="text-base">{article.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{article.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
