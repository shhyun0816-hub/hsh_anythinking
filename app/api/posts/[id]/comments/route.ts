import { NextRequest, NextResponse } from "next/server";
import db, { Comment } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const comments = db
    .prepare("SELECT * FROM comments WHERE post_id = ? ORDER BY created_at ASC, id ASC")
    .all(id) as Comment[];

  return NextResponse.json(comments);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const authorName = String(body.author_name ?? "").trim();
  const authorEmail = String(body.author_email ?? "").trim();
  const content = String(body.content ?? "").trim();

  if (!authorName || !authorEmail || !content) {
    return NextResponse.json(
      { error: "이름, 이메일, 댓글 내용을 모두 입력해주세요." },
      { status: 400 }
    );
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(authorEmail)) {
    return NextResponse.json(
      { error: "이메일 형식이 올바르지 않습니다." },
      { status: 400 }
    );
  }

  const post = db.prepare("SELECT id FROM posts WHERE id = ?").get(id);
  if (!post) {
    return NextResponse.json({ error: "글을 찾을 수 없습니다." }, { status: 404 });
  }

  const result = db
    .prepare(
      "INSERT INTO comments (post_id, author_name, author_email, content) VALUES (?, ?, ?, ?)"
    )
    .run(id, authorName, authorEmail, content);

  const comment = db
    .prepare("SELECT * FROM comments WHERE id = ?")
    .get(result.lastInsertRowid) as Comment;

  return NextResponse.json(comment, { status: 201 });
}
