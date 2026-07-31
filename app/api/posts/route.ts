import { NextRequest, NextResponse } from "next/server";
import db, { Post } from "@/lib/db";

export async function GET() {
  const posts = db
    .prepare("SELECT * FROM posts ORDER BY created_at DESC, id DESC")
    .all() as Post[];
  return NextResponse.json(posts);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const title = String(body.title ?? "").trim();
  const content = String(body.content ?? "").trim();
  const authorName = String(body.author_name ?? "").trim();
  const authorEmail = String(body.author_email ?? "").trim();

  if (!title || !content || !authorName || !authorEmail) {
    return NextResponse.json(
      { error: "제목, 내용, 이름, 이메일을 모두 입력해주세요." },
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

  const result = db
    .prepare(
      "INSERT INTO posts (title, content, author_name, author_email) VALUES (?, ?, ?, ?)"
    )
    .run(title, content, authorName, authorEmail);

  const post = db
    .prepare("SELECT * FROM posts WHERE id = ?")
    .get(result.lastInsertRowid) as Post;

  return NextResponse.json(post, { status: 201 });
}
