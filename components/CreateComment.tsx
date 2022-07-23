import { JSONContent } from "@tiptap/react";
import Editor from "components/Editor";
import { CreateCommentProps } from "lib/types";
import { FormEvent, useState } from "react";
import styles from "styles/components/create_comment.module.scss";
import util_styles from "styles/utils.module.scss";
import ErrorMessage from "components/ErrorMessage";
import { resolver } from "lib/promises";
import axios from "axios";

const CreateComment: React.FC<CreateCommentProps> = ({
  session,
  parent_id,
}) => {
  const parent_type = parent_id.split("-")[0];
  const [disabled, setDisabled] = useState<boolean>(false);
  const [contentErrorMessage, setContentErrorMessage] = useState<string>("");
  const [content, setContent] = useState<JSONContent>({});

  const updateEditorContent = (json: JSONContent) => {
    const editorElement = document.querySelectorAll(
      `div[data-editor-parent_id=${parent_id}] > div.ProseMirror`
    )[0];
    setContentErrorMessage("");
    editorElement?.classList.remove(styles.invalid_content);
    setContent(json);
  };
  const checkValidity: () => boolean = () => {
    const editorElement = document.querySelectorAll(
      `div[data-editor-parent_id=${parent_id}] > div.ProseMirror`
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
        axios.post("/api/comments/leave-comment", {
          content,
          author_user_id: session?.user_id,
          parent_id,
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
      <Editor
        updateEditorContent={updateEditorContent}
        label={parent_data[parent_type].label}
        type={parent_data[parent_type].type}
        parent_id={parent_id}
      />
      {contentErrorMessage.length > 0 && (
        <ErrorMessage error_message={contentErrorMessage} />
      )}
      <button
        disabled={disabled}
        className={util_styles.accent_button}
        type="submit"
      >
        {parent_data[parent_type].button_text}
      </button>
    </form>
  );
};

export default CreateComment;
