import Link from "next/link";
import db, { Post, REACTIONS } from "@/lib/db";
import { REACTION_META, formatDate } from "@/lib/reactions";

export const dynamic = "force-dynamic";

export default function Home() {
  const posts = db
    .prepare("SELECT * FROM posts ORDER BY created_at DESC, id DESC")
    .all() as Post[];

  return (
    <div className="flex flex-col gap-8">
      <section>
        <h1 className="font-pop text-3xl">아무생각</h1>
        <p className="mt-3 leading-relaxed text-neutral-700">
          순간순간 하고 있는 일, 문득 떠오르는 생각, 듣고 있는 노래 같은 걸
          아무렇게나 적어두는 게시판이에요. 누구나 이름과 이메일만 남기면
          자유롭게 글을 올릴 수 있어요.
        </p>
      </section>

      <section className="rounded-lg border border-neutral-200 bg-white p-5">
        <h2 className="font-semibold">이런 곳이에요</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-neutral-700">
          <li>로그인이나 회원가입 없이 누구나 글을 쓸 수 있어요.</li>
          <li>글에는 하트, 기쁨, 슬픔, 엄지척, 엄지다운으로 공감을 남길 수 있어요.</li>
          <li>관리자나 알림 기능은 따로 없어요. 그냥 조용히 적어두는 공간이에요.</li>
        </ul>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between border-t border-neutral-200 pt-6">
          <h2 className="font-pop text-2xl">게시판</h2>
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
                  <h3 className="font-semibold hover:underline">{post.title}</h3>
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
      </section>
    </div>
  );
}
