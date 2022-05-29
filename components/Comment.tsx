import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { CommentProps, SessionData } from "lib/types";
import { getFormattedTimestamp } from "lib/utils";
import styles from "styles/components/comment.module.scss";
import RateButtons from "components/RateButtons";
import { useEffect, useState } from "react";
import CreateComment from "./CreateComment";
import Skeleton from "react-loading-skeleton";

const Comment: React.FC<{
  loading: boolean;
  comment?: CommentProps;
  session: SessionData;
}> = ({ comment, session }) => {
  const [replyActive, setReplyActive] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(!comment);
  const editor = useEditor({
    editable: false,
    content: comment?.content,
    extensions: [StarterKit],
  });
  useEffect(() => {
    setLoading(!comment);
  }, [comment]);
  useEffect(() => {
    if (loading) {
      editor?.commands?.setContent(comment?.content as any);
    }
  }, [comment]);

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
        <RateButtons
          loading={!comment}
          onUp={() => console.log("up")}
          onDown={() => console.log("down")}
        />
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
        comment.replies.map((reply) => {
          return <Comment loading={false} comment={reply} session={session} />;
        })}
    </div>
  );
};

export default Comment;
