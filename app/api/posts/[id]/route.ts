import { NextResponse } from "next/server";
import db, { Post } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const post = db.prepare("SELECT * FROM posts WHERE id = ?").get(id) as
    | Post
    | undefined;

  if (!post) {
    return NextResponse.json({ error: "글을 찾을 수 없습니다." }, { status: 404 });
  }

  return NextResponse.json(post);
}
