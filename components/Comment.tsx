import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { CommentProps, SessionData } from "lib/types";
import { getApiUrl, getFormattedTimestamp } from "lib/utils";
import styles from "styles/components/comment.module.scss";
import RateButtons from "components/RateButtons";
import { useCallback, useEffect, useMemo, useState } from "react";
import CreateComment from "components/CreateComment";
import Skeleton from "react-loading-skeleton";
import { resolver } from "lib/promises";
import axios from "axios";
import { useSession } from "lib/useSession";

const Comment: React.FC<{
  loading: boolean;
  comment?: CommentProps;
  session: SessionData;
}> = ({ comment, session, loading }) => {
  const [replyActive, setReplyActive] = useState<boolean>(false);
  const editor = useEditor({
    editable: false,
    content: comment?.content,
    extensions: [StarterKit],
  });
  session = useMemo(() => session, [session])
  comment = useMemo(() => comment, [comment])
  useEffect(() => {
    if (!loading) {
      editor?.commands?.setContent(comment?.content as any);
    }
  }, [comment, loading]);
  const current_user_rate_data = useMemo(() => comment?.rated_comment.find(rate => {
    return rate.user_rate_id === session?.user_id;
  }), [comment, session])

  const onUp = useCallback(async () => {
    const [_, error] = await resolver(axios.post(`${getApiUrl()}/api/rates/comment-rate`, {
      rate_kind: 'up',
      user_rate_id: session?.user_id,
      comment_rate_id: comment?.comment_id,
      remove_rate: current_user_rate_data?.rate_kind === 'up'
    }))
    if (error) console.log({ error })
  }, [loading, comment])
  const onDown = useCallback(async () => {
    const [_, error] = await resolver(axios.post(`${getApiUrl()}/api/rates/comment-rate`, {
      rate_kind: 'down',
      user_rate_id: session?.user_id,
      comment_rate_id: comment?.comment_id,
      remove_rate: current_user_rate_data?.rate_kind === 'down'
    }))
    if (error) console.log({ error })
  }, [loading, comment])

  return (
    <div className={styles.comment}>
      <header className={styles.header}>
        {!loading ? (
          <h6>
            by {comment?.author?.display_name} ·{" "}
            {getFormattedTimestamp(comment?.created_at as string)}
          </h6>
        ) : (
          <h6>
            <Skeleton />
          </h6>
        )}
      </header>
      {!loading ? (
        <EditorContent editor={editor} />
      ) : (
        <h3>
          <Skeleton />
        </h3>
      )}
      <footer>
        {!loading && <RateButtons
          onUp={() => onUp()}
          onDown={() => onDown()}
          loading={loading}
          isUp={current_user_rate_data?.rate_kind === 'up'}
          isDown={current_user_rate_data?.rate_kind === 'down'}
          numUps={comment?.rated_comment.filter(rate => rate.rate_kind === 'up').length}
          numDowns={comment?.rated_comment.filter(rate => rate.rate_kind === 'down').length}
        />
        }
        <h5
          onClick={() => setReplyActive(!replyActive)}
          className={replyActive ? styles.active : ""}
        >
          Reply
        </h5>
      </footer>
      {replyActive && (
        <CreateComment
          session={session}
          parent_id={comment?.comment_id as string}
        />
      )}
      {!!comment?.replies?.length &&
        comment.replies.map((reply, i) => {
          return <Comment key={i} loading={false} comment={reply} session={session} />;
        })}
    </div>
  );
};

export default Comment;
