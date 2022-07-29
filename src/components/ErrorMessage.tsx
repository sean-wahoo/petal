import { ErrorMessageProps } from "src/lib/types";
import React from "react";
import styles from "styles/components/error_message.module.scss";

export default function ErrorMessage(props: ErrorMessageProps) {
  const { error_message } = props;
  return (
    <div className={styles.error_container}>
      <h5 className={styles.error_message}>{error_message}</h5>
    </div>
  );
}
