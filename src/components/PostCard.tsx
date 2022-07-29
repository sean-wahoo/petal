import styles from "styles/components/post_card.module.scss";
import { PostProps, RateProps } from "src/lib/types";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useRef, useState } from "react";
import { getFormattedTimestamp } from "src/lib/utils";
import Link from "next/link";
import RateButtons from "src/components/RateButtons";
import Skeleton from "react-loading-skeleton";
import { useSession } from "next-auth/react";

export const LoadingPostCard = () => {
  return (
    <article className={styles.post_card}>
      <header className={styles.header}>
        <h3>
          <Skeleton width={256} />
        </h3>
        <h6>
          <Skeleton width={256} />
        </h6>
      </header>

      <main className={`${styles.content}`}>
        <h3>
          <Skeleton count={3} className={styles.post_data_loading} />
        </h3>
      </main>
    </article>
  );
};

export default function PostCard({ post }: { post: PostProps }) {
  const [seeMoreButton, setSeeMoreButton] = useState<boolean>(false);
  const parentRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();

  const isOverflown = (child: any, parent: any) => {
    return child?.clientHeight > parent?.clientHeight;
  };
  useEffect(() => {
    const editorElement = document.getElementById(`editor-${post?.postId}`);
    const editorParent = document.getElementById(`parent-${post?.postId}`);
    if (isOverflown(editorElement, editorParent)) {
      setSeeMoreButton(true);
    }
  }, [isOverflown]);

  const editor = useEditor({
    editable: false,
    content: post?.content,
    extensions: [StarterKit],
  });

  return (
    <article className={styles.post_card}>
      <header className={styles.header}>
        <h3>
          <Link href={`/posts/${post?.postId}`}>{post?.title}</Link>
        </h3>

        <h6>
          {" "}
          by <Link href={`/users/${post?.author.id}`}>
            {post?.author.name}
          </Link>{" "}
          · {getFormattedTimestamp(post?.createdAt as string)}
        </h6>
      </header>

      <main
        id={`parent-${post?.postId}`}
        ref={parentRef}
        className={`${styles.content}`}
      >
        {seeMoreButton && <span className={styles.overflow_shadow} />}
        <Link href={`/posts/${post?.postId}`}>
          <EditorContent id={`editor-${post?.postId}`} editor={editor} />
        </Link>

        {seeMoreButton && (
          <Link href={`/posts/${post?.postId}`}>
            <button className={styles.show_more} type="button">
              See More
            </button>
          </Link>
        )}
      </main>

      <footer className={styles.footer}>
        <RateButtons
          postId={post?.postId}
          id={session?.user?.id as string}
          rateInfo={post?.ratedPost as RateProps[]}
        />
      </footer>
    </article>
  );
}
