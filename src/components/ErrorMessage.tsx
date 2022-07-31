import React from "react";
import styles from "src/styles/components/error_message.module.scss";

const ErrorMessage: React.FC<{ error_message: string }> = ({
  error_message,
}) => {
  return (
    <div className={styles.error_container}>
      <h5 className={styles.error_message}>{error_message}</h5>
    </div>
  );
};

export default ErrorMessage;
