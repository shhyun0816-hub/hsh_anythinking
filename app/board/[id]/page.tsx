import { notFound } from "next/navigation";
import db, { Comment, Post } from "@/lib/db";
import { formatDate } from "@/lib/reactions";
import ReactionButtons from "@/components/ReactionButtons";
import CommentForm from "@/components/CommentForm";

export const dynamic = "force-dynamic";

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = db.prepare("SELECT * FROM posts WHERE id = ?").get(id) as
    | Post
    | undefined;

  if (!post) {
    notFound();
  }

  const comments = db
    .prepare("SELECT * FROM comments WHERE post_id = ? ORDER BY created_at ASC, id ASC")
    .all(post.id) as Comment[];

  return (
    <article className="flex flex-col gap-4">
      <div>
        <h1 className="font-pop text-2xl">{post.title}</h1>
        <p className="mt-1 text-xs text-neutral-400">
          {post.author_name} · {formatDate(post.created_at)}
        </p>
      </div>

      <p className="whitespace-pre-wrap leading-relaxed text-neutral-800">
        {post.content}
      </p>

      <ReactionButtons
        postId={post.id}
        initialCounts={{
          heart: post.heart,
          joy: post.joy,
          sad: post.sad,
          thumbs_up: post.thumbs_up,
          thumbs_down: post.thumbs_down,
        }}
      />

      <section className="mt-4 flex flex-col gap-4 border-t border-neutral-200 pt-4">
        <h2 className="font-pop text-lg">댓글 {comments.length}</h2>

        {comments.length > 0 && (
          <ul className="flex flex-col gap-3">
            {comments.map((comment) => (
              <li
                key={comment.id}
                className="rounded-lg border border-neutral-200 bg-white p-3"
              >
                <p className="whitespace-pre-wrap text-sm text-neutral-800">
                  {comment.content}
                </p>
                <p className="mt-1 text-xs text-neutral-400">
                  {comment.author_name} · {formatDate(comment.created_at)}
                </p>
              </li>
            ))}
          </ul>
        )}

        <CommentForm postId={post.id} />
      </section>
    </article>
  );
}
