import { JSONContent } from "@tiptap/react";
import Editor from "components/Editor";
import { FormEvent, useState } from "react";
import styles from "styles/components/create_comment.module.scss";
import util_styles from "styles/utils.module.scss";
import ErrorMessage from "components/ErrorMessage";
import { resolver } from "lib/promises";
import { signIn, useSession } from "next-auth/react";

const CreateComment = ({ parentId }: { parentId: string }) => {
  const { data: session } = useSession();
  const parent_type = parentId.split("-")[0];
  const [disabled, setDisabled] = useState<boolean>(false);
  const [contentErrorMessage, setContentErrorMessage] = useState<string>("");
  const [content, setContent] = useState<JSONContent>({});

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
      const [data, error] = await resolver(
        fetch("/api/comments/leave-comment", {
          method: "POST",
          body: JSON.stringify({
            content,
            authorUserId: session?.user?.id,
            parentId,
          }),
        })
      );
      if (error) console.error({ error });
      if (data) {
        window.location.reload();
      }
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
