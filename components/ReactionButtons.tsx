"use client";

import { useState } from "react";
import { Reaction, REACTIONS } from "@/lib/types";
import { REACTION_META } from "@/lib/reactions";

export default function ReactionButtons({
  postId,
  initialCounts,
}: {
  postId: number;
  initialCounts: Record<Reaction, number>;
}) {
  const [counts, setCounts] = useState(initialCounts);
  const [pending, setPending] = useState<Reaction | null>(null);

  async function react(type: Reaction) {
    if (pending) return;
    setPending(type);
    setCounts((prev) => ({ ...prev, [type]: prev[type] + 1 }));

    const res = await fetch(`/api/posts/${postId}/reactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type }),
    });

    if (res.ok) {
      const post = await res.json();
      setCounts({
        heart: post.heart,
        joy: post.joy,
        sad: post.sad,
        thumbs_up: post.thumbs_up,
        thumbs_down: post.thumbs_down,
      });
    } else {
      setCounts((prev) => ({ ...prev, [type]: prev[type] - 1 }));
    }
    setPending(null);
  }

  return (
    <div className="flex gap-2">
      {REACTIONS.map((type) => (
        <button
          key={type}
          onClick={() => react(type)}
          disabled={pending !== null}
          className="flex items-center gap-1 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-sm hover:bg-neutral-100 disabled:opacity-60"
          title={REACTION_META[type].label}
        >
          <span>{REACTION_META[type].emoji}</span>
          <span className="text-neutral-600">{counts[type]}</span>
        </button>
      ))}
    </div>
  );
}
