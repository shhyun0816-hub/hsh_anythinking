import Link from "next/link";
import db, { Post, REACTIONS } from "@/lib/db";
import { REACTION_META, formatDate } from "@/lib/reactions";

export const dynamic = "force-dynamic";

export default function BoardPage() {
  const posts = db
    .prepare("SELECT * FROM posts ORDER BY created_at DESC, id DESC")
    .all() as Post[];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">게시판</h1>
        <Link
          href="/board/new"
          className="rounded-md bg-neutral-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-neutral-700"
        >
          글쓰기
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="rounded-lg border border-dashed border-neutral-300 p-8 text-center text-sm text-neutral-500">
          아직 아무 글도 없어요. 첫 글을 남겨보세요.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {posts.map((post) => (
            <li
              key={post.id}
              className="rounded-lg border border-neutral-200 bg-white p-4"
            >
              <Link href={`/board/${post.id}`} className="block">
                <h2 className="font-semibold hover:underline">{post.title}</h2>
                <p className="mt-1 line-clamp-2 text-sm text-neutral-600">
                  {post.content}
                </p>
                <div className="mt-2 flex items-center justify-between text-xs text-neutral-400">
                  <span>
                    {post.author_name} · {formatDate(post.created_at)}
                  </span>
                  <span className="flex gap-2">
                    {REACTIONS.map((type) =>
                      post[type] > 0 ? (
                        <span key={type}>
                          {REACTION_META[type].emoji} {post[type]}
                        </span>
                      ) : null
                    )}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
