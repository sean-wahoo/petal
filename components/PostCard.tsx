import styles from "styles/components/post_card.module.scss";
import { PostCardProps } from "lib/types";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useMemo, useRef, useState } from "react";
import { getApiUrl, getFormattedTimestamp } from "lib/utils";
import Link from "next/link";
import RateButtons from "components/RateButtons";
import Skeleton from "react-loading-skeleton";
import { resolver } from "lib/promises";
import axios from "axios";
import { useSession } from "lib/useSession";

export default function PostCard({ session, post, loading }: PostCardProps) {
  const [seeMoreButton, setSeeMoreButton] = useState<boolean>(false);
  const parentRef = useRef<HTMLDivElement>(null);
  const { session } = useSession()

  const isOverflown = (child: any, parent: any) => {
    return child.clientHeight > parent.clientHeight;
  };
  const current_user_rate_data = useMemo(() => {
    return post?.rated_post.find(rate => rate.user_rate_id === session?.user_id);
  }, [post, session]);
  !loading &&
    useEffect(() => {
      const editorElement = document.getElementById(`editor-${post?.post_id}`);
      const editorParent = document.getElementById(`parent-${post?.post_id}`);
      if (isOverflown(editorElement, editorParent)) {
        setSeeMoreButton(true);
      }
    }, [isOverflown]);

  const onUp = async () => {
    const session = useSession()
    const [data, error] = await resolver(axios.post(`${getApiUrl()}/api/rates/post-rate`, {
      rate_kind: 'up',
      user_rate_id: session?.user_id,
      post_rate_id: post?.post_id,
      remove_rate: current_user_rate_data?.rate_kind === 'up'
    }))
    if (error) console.error(error)
  }
  const onDown = async () => {
    const session = useSession()
    const [data, error] = await resolver(axios.post(`${getApiUrl()}/api/rates/post-rate`, {
      rate_kind: 'down',
      user_rate_id: session?.user_id,
      post_rate_id: post?.post_id,
      remove_rate: current_user_rate_data?.rate_kind === 'down'
    }))
    if (error) console.error(error)
    console.log({ data })
  }

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
        {loading ||
          <RateButtons
            loading={loading}
            onUp={() => onUp()}
            onDown={() => onDown()}
            isUp={current_user_rate_data?.rate_kind === 'up'}
            isDown={current_user_rate_data?.rate_kind === 'down'}
            numUps={post?.rated_post.filter(rate => rate.rate_kind === 'up').length}
            numDowns={post?.rated_post.filter(rate => rate.rate_kind === 'down').length}
          />
        }
      </footer>
    </article>
  );
}
