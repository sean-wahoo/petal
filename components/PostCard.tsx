import styles from "styles/components/post_card.module.scss";
import { PostCardProps } from "lib/types";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useRef, useState } from "react";
import { getFormattedTimestamp } from "lib/utils";
import Link from "next/link";
import RateButtons from "./RateButtons";

export default function PostCard({ post }: PostCardProps) {
  const [seeMoreButton, setSeeMoreButton] = useState<boolean>(false);
  const parentRef = useRef<HTMLDivElement>(null);

  const isOverflown = (child: any, parent: any) => {
    return child.clientHeight > parent.clientHeight;
  };
  useEffect(() => {
    const editorElement = document.getElementById(`editor-${post.post_id}`);
    const editorParent = document.getElementById(`parent-${post.post_id}`);
    if (isOverflown(editorElement, editorParent)) {
      setSeeMoreButton(true);
    }
  }, [isOverflown]);

  const handleUp = async (post_id: string) => {};
  const handleDown = async (post_id: string) => {};

  const editor = useEditor({
    editable: false,
    content: post.content,
    extensions: [StarterKit],
  });
  return (
    <article className={styles.post_card}>
      <header className={styles.header}>
        <h3>
          <Link href={`/posts/${post.post_id}`}>{post.title}</Link>
        </h3>
        <h6>
          {" "}
          by{" "}
          <Link href={`/users/${post.author.user_id}`}>
            {post.author.display_name}
          </Link>{" "}
          · {getFormattedTimestamp(post.created_at)}
        </h6>
      </header>

      <main
        id={`parent-${post.post_id}`}
        ref={parentRef}
        className={`${styles.content}`}
      >
        {seeMoreButton && <span className={styles.overflow_shadow} />}
        <Link href={`/posts/${post.post_id}`}>
          <EditorContent id={`editor-${post.post_id}`} editor={editor} />
        </Link>
        {seeMoreButton && (
          <Link href={`/posts/${post.post_id}`}>
            <button className={styles.show_more} type="button">
              See More
            </button>
          </Link>
        )}
      </main>

      <footer className={styles.footer}>
        <RateButtons
          onUp={() => handleUp(post.post_id)}
          onDown={() => handleDown(post.post_id)}
        />
      </footer>
    </article>
  );
}
