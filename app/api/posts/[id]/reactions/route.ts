import { NextRequest, NextResponse } from "next/server";
import db, { Post, REACTIONS, Reaction } from "@/lib/db";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const type = body.type as Reaction;

  if (!REACTIONS.includes(type)) {
    return NextResponse.json({ error: "알 수 없는 공감입니다." }, { status: 400 });
  }

  const existing = db.prepare("SELECT id FROM posts WHERE id = ?").get(id);
  if (!existing) {
    return NextResponse.json({ error: "글을 찾을 수 없습니다." }, { status: 404 });
  }

  // type is validated against the REACTIONS allowlist above, safe to interpolate as a column name
  db.prepare(`UPDATE posts SET ${type} = ${type} + 1 WHERE id = ?`).run(id);

  const post = db.prepare("SELECT * FROM posts WHERE id = ?").get(id) as Post;
  return NextResponse.json(post);
}
