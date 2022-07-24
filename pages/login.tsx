import type { NextPage } from "next";
import type { ErrorMessageProps, LoginResponse } from "lib/types";
import { resolver } from "lib/promises";
import { useState, useRef } from "react";
import styles from "styles/layouts/login.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Cookies from "universal-cookie";
import Router from "next/router";
import ErrorMessage from "components/ErrorMessage";
import Link from "next/link";
import Layout from "components/Layout";
import { encodeSessionToken } from "lib/session";

// TODO: add other login providers

const Login: NextPage = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<ErrorMessageProps>({
    message: "",
    type: "",
  });
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const onLoginSubmit: () => void = async () => {
    const [data, error]: LoginResponse[] = await resolver(
      fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
      })
    );
    console.log({ data, error });
    if (error || !data) {
      setError({ message: error.message, type: error.type });
      error.type === "email" &&
        emailRef.current?.setCustomValidity(error.message);
      error.type === "password" &&
        passwordRef.current?.setCustomValidity(error.message);
      return;
    }
    const cookies = new Cookies();
    const token = await encodeSessionToken(data);
    cookies.set("session_token", token);
    // Router.reload();
  };

  return (
    <Layout title="Petal - Login" is_auth={false}>
      <main className={styles.login}>
        <h1>Login to Petal</h1>
        <form
          className={styles.login__inputArea}
          onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            onLoginSubmit();
          }}
        >
          <div className={styles.login__inputGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              value={email}
              required
              onInvalid={(e: React.BaseSyntheticEvent) => {
                e.preventDefault();
                setError({
                  message: e.target.validationMessage.replace(
                    / *\([^)]*\) */g,
                    ""
                  ),
                  type: "email",
                });
              }}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setEmail(e.currentTarget.value);
                e.currentTarget.setCustomValidity(
                  e.currentTarget.value.includes(".")
                    ? ""
                    : "Please provide a valid email address"
                );
                if (error.type === "email") setError({ message: "", type: "" });
              }}
              placeholder="email@address.com"
              id="email"
              ref={emailRef}
              className={styles.login__emailInput}
            />
            {error.type === "email" && <ErrorMessage message={error.message} />}
          </div>
          <div className={styles.login__inputGroup}>
            <label htmlFor="password">Password</label>
            <div>
              <input
                type={visible ? "text" : "password"}
                onInvalid={(e: React.BaseSyntheticEvent) => {
                  e.preventDefault();
                  setError({
                    message: e.target.validationMessage.replace(
                      / *\([^)]*\) */g,
                      ""
                    ),
                    type: "password",
                  });
                }}
                id="password"
                value={password}
                required
                placeholder="super secret password"
                minLength={8}
                ref={passwordRef}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setPassword(e.currentTarget.value);
                  if (error.type === "password") {
                    setError({ message: "", type: "" });
                    e.target.setCustomValidity("");
                  }
                }}
                className={styles.login__passwordInput}
              />
              <FontAwesomeIcon
                icon={visible ? faEyeSlash : faEye}
                className={styles.login__showPasswordIcon}
                onClick={() => setVisible(!visible)}
              />
            </div>
            {error.type === "password" && (
              <ErrorMessage message={error.message} />
            )}
          </div>
          <button className={styles.login__loginButton} type="submit">
            Login
          </button>
          <h4 className={styles.login__linkText}>
            Need to <Link href="/register">Register?</Link>
          </h4>
        </form>
      </main>
    </Layout>
  );
};

export default Login;
