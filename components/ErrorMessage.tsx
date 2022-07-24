import { ErrorMessageProps } from "lib/types";
import React from "react";
import styles from "styles/components/error_message.module.scss";

export default function ErrorMessage(props: ErrorMessageProps) {
  const { message } = props;
  return (
    <div className={styles.error_container}>
      <h5 className={styles.message}>{message}</h5>
    </div>
  );
}
