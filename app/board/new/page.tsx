"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        content,
        author_name: authorName,
        author_email: authorEmail,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "글을 올리는 중 문제가 생겼어요.");
      setSubmitting(false);
      return;
    }

    const post = await res.json();
    router.push(`/board/${post.id}`);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-pop text-2xl">글쓰기</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="title" className="text-sm font-medium">
            제목
          </label>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="content" className="text-sm font-medium">
            내용
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
            required
          />
        </div>

        <div className="flex gap-4">
          <div className="flex flex-1 flex-col gap-1">
            <label htmlFor="author_name" className="text-sm font-medium">
              이름
            </label>
            <input
              id="author_name"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
              required
            />
          </div>
          <div className="flex flex-1 flex-col gap-1">
            <label htmlFor="author_email" className="text-sm font-medium">
              이메일
            </label>
            <input
              id="author_email"
              type="email"
              value={authorEmail}
              onChange={(e) => setAuthorEmail(e.target.value)}
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
              required
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-fit rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-50"
        >
          {submitting ? "올리는 중..." : "올리기"}
        </button>
      </form>
    </div>
  );
}
