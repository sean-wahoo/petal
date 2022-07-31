import { JSONContent } from "@tiptap/react";
import Editor from "src/components/Editor";
import { FormEvent, useState } from "react";
import styles from "src/styles/components/create_comment.module.scss";
import util_styles from "src/styles/utils.module.scss";
import ErrorMessage from "src/components/ErrorMessage";
import { resolver } from "src/utils/promises";
import { signIn, useSession } from "next-auth/react";
import { trpc } from "src/utils/trpc";

const CreateComment = ({ parentId }: { parentId: string }) => {
  const { data: session } = useSession();
  const parent_type = parentId.split("-")[0];
  const [disabled, setDisabled] = useState<boolean>(false);
  const [contentErrorMessage, setContentErrorMessage] = useState<string>("");
  const [content, setContent] = useState<JSONContent>({});
  const leaveCommentMutation = trpc.useMutation(["comment.leaveComment"]);

  const updateEditorContent = (json: JSONContent) => {
    const editorElement = document.querySelectorAll(
      `div[data-editor-parent_id=${parentId}] > div.ProseMirror`
    )[0];
    setContentErrorMessage("");
    editorElement?.classList.remove(styles.invalid_content);
    setContent(json);
  };
  const checkValidity: () => boolean = () => {
    const editorElement = document.querySelectorAll(
      `div[data-editor-parent_id=${parentId}] > div.ProseMirror`
    )[0];
    if (Object.keys(content).length === 0 || !content?.content?.[0].content) {
      editorElement?.classList.add(styles.invalid_content);
      setContentErrorMessage("This is required!");
      return false;
    }
    return true;
  };
  const leaveComment = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (checkValidity()) {
      setDisabled(true);
      leaveCommentMutation.mutate({
        content: content as any,
        authorUserId: session?.user?.id as string,
        parentId,
      });
    }
  };
  const parent_data: any = {
    post: {
      label: "Leave a Comment",
      type: "comment",
      button_text: "Leave Comment",
    },
    comment: {
      label: "",
      type: "reply",
      button_text: "Reply",
    },
  };
  return (
    <form className={styles.create_comment} onSubmit={leaveComment}>
      {session && (
        <Editor
          updateEditorContent={updateEditorContent}
          label={parent_data[parent_type].label}
          type={parent_data[parent_type].type}
          parent_id={parentId}
        />
      )}
      {contentErrorMessage.length > 0 && (
        <ErrorMessage error_message={contentErrorMessage} />
      )}
      {session ? (
        <button
          disabled={disabled}
          className={util_styles.accent_button}
          type={session === null ? "button" : "submit"}
        >
          {parent_data[parent_type].button_text}
        </button>
      ) : (
        <button
          onClick={() => signIn()}
          type="button"
          className={util_styles.accent_button}
        >
          Sign in to leave a comment!
        </button>
      )}
    </form>
  );
};

export default CreateComment;
