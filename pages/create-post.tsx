import Layout from "components/Layout";
import { CreatePostPageProps } from "lib/types";
import { session_check } from "lib/utils";
import { GetServerSideProps, NextPage } from "next";
import styles from "styles/layouts/create_post.module.scss";
import Editor from "components/Editor";
import { JSONContent } from "@tiptap/react";
import { FormEvent, useRef, useState } from "react";
import ErrorMessage from "components/ErrorMessage";
import { resolver } from "lib/promises";
import axios from "axios";

const CreatePostPage: NextPage<CreatePostPageProps> = ({ session }) => {
  const titleRef = useRef(null);
  const [content, setContent] = useState<JSONContent>({});
  const [title, setTitle] = useState<string>("");
  const [contentErrorMessage, setContentErrorMessage] = useState<string>("");

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
      const [data, error] = await resolver(
        axios.post("/api/posts/create-post", { title, content })
      );
      console.log({ data, error });
    }
  };

  return (
    <Layout session_data={session} title="Create Post - Petal" is_auth={true}>
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
          <Editor updateEditorContent={updateEditorContent} />
          {contentErrorMessage.length > 0 && (
            <ErrorMessage error_message={contentErrorMessage} />
          )}
          <button type="submit">Create Post</button>
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
    if (e.response.data.error_message === "user-not-found") {
      return {
        notFound: true,
      };
    }
  }
};

export default CreatePostPage;
