import type { NextPage } from "next";
import type { ErrorMessageProps, RegisterResponse } from "lib/types";
import { useState, useRef } from "react";
import styles from "styles/layouts/register.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Cookies from "universal-cookie";
import Router from "next/router";
import ErrorMessage from "components/ErrorMessage";
import Link from "next/link";
import Layout from "components/Layout";
import { resolver } from "lib/promises";
import axios from "axios";
import { decodeSessionToken, encodeSessionToken } from "lib/session";

const Register: NextPage = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<ErrorMessageProps>({
    error_message: "",
    type: "",
  });

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const onRegisterSubmit: () => void = async () => {
    const [data, error]: RegisterResponse[] = await resolver(
      axios.post("/api/auth/register", { email, password })
    );
    if (error || !data) {
      setError({ error_message: error.error_message, type: error.type });
      error.type === "email" &&
        emailRef.current?.setCustomValidity(error.error_message);
      error.type === "password" &&
        passwordRef.current?.setCustomValidity(error.error_message);
      return;
    }
    const cookies = new Cookies();
    const token = encodeSessionToken(data);
    cookies.set("session_payload", token);
    const session = decodeSessionToken(token);
    Router.reload();
  };

  return (
    <Layout title="Petal - Register" is_auth={false}>
      <main className={styles.register}>
        <h1>Register to Petal</h1>
        <form
          className={styles.register__inputArea}
          onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            onRegisterSubmit();
          }}
        >
          <div className={styles.register__inputGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              value={email}
              required
              onInvalid={(e: React.BaseSyntheticEvent) => {
                e.preventDefault();
                setError({
                  error_message: e.target.validationMessage.replace(
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
                if (error.type === "email")
                  setError({ error_message: "", type: "" });
              }}
              ref={emailRef}
              placeholder="email@address.com"
              id="email"
              className={styles.register__emailInput}
            />
            {error.type === "email" && (
              <ErrorMessage error_message={error.error_message} />
            )}
          </div>
          <div className={styles.register__inputGroup}>
            <label htmlFor="password">Password</label>
            <div>
              <input
                type={visible ? "text" : "password"}
                id="password"
                required
                minLength={8}
                onInvalid={(e: React.BaseSyntheticEvent) => {
                  e.preventDefault();
                  setError({
                    error_message: e.target.validationMessage.replace(
                      / *\([^)]*\) */g,
                      ""
                    ),
                    type: "password",
                  });
                }}
                placeholder="super secret password"
                ref={passwordRef}
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setPassword(e.currentTarget.value);
                  if (error.type === "password") {
                    setError({ error_message: "", type: "" });
                    e.target.setCustomValidity("");
                  }
                }}
                className={styles.register__passwordInput}
              />
              <FontAwesomeIcon
                icon={visible ? faEyeSlash : faEye}
                className={styles.register__showPasswordIcon}
                onClick={() => setVisible(!visible)}
              />
            </div>
            {error.type === "password" && (
              <ErrorMessage error_message={error.error_message} />
            )}
          </div>
          <button className={styles.register__registerButton} type="submit">
            Register
          </button>
          <h4 className={styles.register__linkText}>
            Need to <Link href="/login">Login?</Link>
          </h4>
        </form>
      </main>
    </Layout>
  );
};

export default Register;
