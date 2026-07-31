import { notFound } from "next/navigation";
import db, { Post } from "@/lib/db";
import { formatDate } from "@/lib/reactions";
import ReactionButtons from "@/components/ReactionButtons";

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
    </article>
  );
}
