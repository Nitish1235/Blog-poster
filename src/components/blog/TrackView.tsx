"use client";

import { useEffect } from "react";

interface TrackViewProps {
  postId: string;
}

/**
 * Component to track post views
 * Automatically tracks when the component mounts
 */
export function TrackView({ postId }: TrackViewProps) {
  useEffect(() => {
    // Track view
    const trackView = async () => {
      try {
        await fetch("/api/analytics/track-view", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ post_id: postId }),
        });
      } catch (error) {
        // Silently fail - analytics shouldn't break the page
        console.error("Failed to track view:", error);
      }
    };

    trackView();
  }, [postId]);

  return null;
}
