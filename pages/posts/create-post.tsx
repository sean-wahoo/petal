import Layout from "components/Layout";
import { CreatePostPageProps } from "lib/types";
import { handleMiddlewareErrors, session_check } from "lib/utils";
import { GetServerSideProps, NextPage } from "next";
import styles from "styles/layouts/create_post.module.scss";
import Editor from "components/Editor";
import { JSONContent } from "@tiptap/react";
import { FormEvent, useRef, useState } from "react";
import ErrorMessage from "components/ErrorMessage";
import { resolver } from "lib/promises";
import axios from "axios";
import { useRouter } from "next/router";

const CreatePostPage: NextPage<CreatePostPageProps> = ({ session }) => {
  const titleRef = useRef(null);
  const [content, setContent] = useState<JSONContent>({});
  const [title, setTitle] = useState<string>("");
  const [contentErrorMessage, setContentErrorMessage] = useState<string>("");
  const [disabled, setDisabled] = useState<boolean>(false);
  const router = useRouter();

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
      const [data, error] = await resolver(
        axios.post("/api/posts/create-post", {
          title,
          content,
          author_user_id: session.user_id,
        })
      );
      if (error) throw error;
      if (data) {
        router.push(`/posts/${data.post.post_id}`);
      }
    }
  };

  return (
    <Layout session_data={session} title="Petal - Create Post" is_auth={true}>
      <main className={styles.create_post}>
        <form onSubmit={(e) => submitNewPost(e)}>
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const [session, error] = await session_check(context.req, context.res);
    if (error) return error;

    return {
      props: { session },
    };
  } catch (e: any) {
    return handleMiddlewareErrors(e.response.data.error_message, context);
  }
};

export default CreatePostPage;
