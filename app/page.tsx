import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col gap-6">
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

      <Link
        href="/board"
        className="inline-block w-fit rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
      >
        게시판 보러가기
      </Link>
    </div>
  );
}
