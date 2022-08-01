import Layout from "src/components/Layout";
import { NextPage } from "next";
import styles from "src/styles/layouts/create_post.module.scss";
import Editor from "src/components/Editor";
import { JSONContent } from "@tiptap/react";
import { FormEvent, useRef, useState } from "react";
import ErrorMessage from "src/components/ErrorMessage";
import { resolver } from "src/utils/promises";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { trpc } from "src/utils/trpc";

const CreatePostPage = () => {
  const { data: session } = useSession();

  const titleRef = useRef(null);
  const [content, setContent] = useState<JSONContent>({});
  const [title, setTitle] = useState<string>("");
  const [contentErrorMessage, setContentErrorMessage] = useState<string>("");
  const [disabled, setDisabled] = useState<boolean>(false);
  const router = useRouter();
  const createPostMutation = trpc.useMutation(["post.createPost"]);

  const updateEditorContent = (json: JSONContent) => {
    const editorElement = document.querySelector("div.ProseMirror");
    setContentErrorMessage("");
    editorElement?.classList.remove(styles.invalid_content);
    setContent(json);
  };

  const checkValidity: () => boolean = () => {
    const editorElement = document.querySelector("div.ProseMirror");
    if (Object.keys(content).length === 0 || !content?.content?.[0].content) {
      editorElement?.classList.add(styles.invalid_content);
      setContentErrorMessage("This is required!");
      return false;
    }
    return true;
  };
  const submitNewPost = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (checkValidity()) {
      setDisabled(true);
      createPostMutation.mutate({
        title,
        content,
      });
      if (createPostMutation.data && createPostMutation.status === "success")
        router.push(`/posts/${createPostMutation.data.postId}`);
      else console.error(createPostMutation.error);
    }
  };

  return (
    <Layout title="Petal - Create Post">
      <main className={styles.create_post}>
        <form onSubmit={submitNewPost}>
          <label htmlFor="title-input">Post Title</label>
          <input
            type="text"
            id="title-input"
            onChange={(e) => setTitle(e.currentTarget.value.trim())}
            placeholder="An eye-catching title!"
            ref={titleRef}
            required
          />
          <Editor
            updateEditorContent={updateEditorContent}
            label="Post Content"
            type="post"
          />
          {contentErrorMessage.length > 0 && (
            <ErrorMessage error_message={contentErrorMessage} />
          )}
          <button disabled={disabled} type="submit">
            Create Post
          </button>
        </form>
      </main>
    </Layout>
  );
};

export default CreatePostPage;
