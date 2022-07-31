import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { getFormattedTimestamp } from "src/utils/helpers";
import styles from "src/styles/components/comment.module.scss";
import RateButtons from "src/components/RateButtons";
import { useState } from "react";
import CreateComment from "src/components/CreateComment";
import Skeleton from "react-loading-skeleton";
import { useSession } from "next-auth/react";

interface CommentProps {
  commentId: string;
  parentId: string;
  author: {
    id: string;
    name: string;
  };
  ups: number;
  downs: number;
  content?: object;
  createdAt: Date;
  replies: CommentProps[];
  ratedComment: {
    rateKind: string;
    userRateId: string;
  }[];
}

export const LoadingComment = () => {
  return (
    <div className={styles.comment}>
      <header className={styles.header}>
        <h6>
          <Skeleton />
        </h6>
      </header>
      <h3>
        <Skeleton />
      </h3>
    </div>
  );
};

const Comment: React.FC<{ comment: CommentProps }> = ({ comment }) => {
  const { data: session } = useSession();
  const [replyActive, setReplyActive] = useState<boolean>(false);
  const editor = useEditor({
    editable: false,
    content: comment.content,
    extensions: [StarterKit],
  });
  return (
    <div className={styles.comment}>
      <header className={styles.header}>
        <h6>
          by {comment.author.name} ·{" "}
          {getFormattedTimestamp(comment.createdAt.toString())}
        </h6>
      </header>
      <EditorContent editor={editor} />
      <footer>
        <RateButtons
          commentId={comment.commentId}
          id={session?.user?.id as string}
          rateInfo={comment.ratedComment}
        />
        {session && (
          <h5
            onClick={() => setReplyActive(!replyActive)}
            className={replyActive ? styles.active : ""}
          >
            Reply
          </h5>
        )}
      </footer>
      {replyActive && <CreateComment parentId={comment.commentId} />}
      {comment?.replies?.length > 0 &&
        comment.replies.map((reply, i) => {
          return <Comment key={i} comment={reply} />;
        })}
    </div>
  );
};

export default Comment;
