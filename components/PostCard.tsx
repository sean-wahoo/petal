import styles from "styles/components/post_card.module.scss";
import { PostCardProps, RateProps } from "lib/types";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useRef, useState } from "react";
import { getFormattedTimestamp } from "lib/utils";
import Link from "next/link";
import RateButtons from "components/RateButtons";
import Skeleton from "react-loading-skeleton";
import { useSession } from "lib/useSession";

export default function PostCard({ post, loading }: PostCardProps) {
  const [seeMoreButton, setSeeMoreButton] = useState<boolean>(false);
  const parentRef = useRef<HTMLDivElement>(null);
  const { session } = useSession();

  const isOverflown = (child: any, parent: any) => {
    return child?.clientHeight > parent?.clientHeight;
  };
  useEffect(() => {
    const editorElement = document.getElementById(`editor-${post?.post_id}`);
    const editorParent = document.getElementById(`parent-${post?.post_id}`);
    if (isOverflown(editorElement, editorParent)) {
      setSeeMoreButton(true);
    }
  }, [isOverflown]);

  const editor = useEditor({
    editable: false,
    content: post?.content,
    extensions: [StarterKit],
  });

  useEffect(() => {
    if (!loading) {
      editor?.commands?.setContent(post?.content as any);
    }
  }, [post]);

  return (
    <article className={styles.post_card}>
      <header className={styles.header}>
        {loading ? (
          <h3>
            <Skeleton width={256} />
          </h3>
        ) : (
          <h3>
            <Link href={`/posts/${post?.post_id}`}>{post?.title}</Link>
          </h3>
        )}

        {loading ? (
          <h6>
            <Skeleton width={256} />
          </h6>
        ) : (
          <h6>
            {" "}
            by{" "}
            <Link href={`/users/${post?.author.user_id}`}>
              {post?.author.display_name}
            </Link>{" "}
            · {getFormattedTimestamp(post?.created_at as string)}
          </h6>
        )}
      </header>

      <main
        id={`parent-${post?.post_id}`}
        ref={parentRef}
        className={`${styles.content}`}
      >
        {seeMoreButton && <span className={styles.overflow_shadow} />}
        {loading ? (
          <h3>
            <Skeleton count={3} className={styles.post_data_loading} />
          </h3>
        ) : (
          <Link href={`/posts/${post?.post_id}`}>
            <EditorContent id={`editor-${post?.post_id}`} editor={editor} />
          </Link>
        )}

        {seeMoreButton && (
          <Link href={`/posts/${post?.post_id}`}>
            <button className={styles.show_more} type="button">
              See More
            </button>
          </Link>
        )}
      </main>

      <footer className={styles.footer}>
        {loading || (
          <RateButtons
            post_id={post?.post_id}
            user_id={session?.user_id as string}
            rate_info={post?.rated_post as RateProps[]}
          />
        )}
      </footer>
    </article>
  );
}
