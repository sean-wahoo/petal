import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { CommentProps, RateProps, SessionData } from "lib/types";
import { getFormattedTimestamp } from "lib/utils";
import styles from "styles/components/comment.module.scss";
import RateButtons from "components/RateButtons";
import { useEffect, useMemo, useState } from "react";
import CreateComment from "components/CreateComment";
import Skeleton from "react-loading-skeleton";

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
  session = useMemo(() => session, [session]);
  comment = useMemo(() => comment, [comment]);
  useEffect(() => {
    if (!loading) {
      editor?.commands?.setContent(comment?.content as any);
    }
  }, [comment, loading]);

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
        {!loading && (
          <RateButtons
            comment_id={comment?.comment_id}
            user_id={session?.user_id as string}
            rate_info={comment?.rated_comment as RateProps[]}
          />
        )}
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
          return (
            <Comment
              key={i}
              loading={false}
              comment={reply}
              session={session}
            />
          );
        })}
    </div>
  );
};

export default Comment;
