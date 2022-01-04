import type { NextPage } from 'next'
import { useState } from 'react'
import styles from 'styles/layouts/login.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'

// TODO: add other login providers

const Login: NextPage = () => {
  const [visible, setVisible] = useState<boolean>(false)

  return (
    <main className={styles.login}>
      <h1>Login to ConnectHigh</h1>
      <form className={styles.login__inputArea}>
        <div className={styles.login__inputGroup}>
          <label htmlFor='email'>Email</label>
          <input type='email' id='email' className={styles.login__emailInput} />
        </div>
        <div className={styles.login__inputGroup}>
          <label htmlFor='password'>Password</label>
          <div>
            <input
              type={visible ? 'text' : 'password'}
              id='password'
              className={styles.login__passwordInput}
            />
            <FontAwesomeIcon
              icon={visible ? faEyeSlash : faEye}
              className={styles.login__showPasswordIcon}
              onClick={() => setVisible(!visible)}
            />
          </div>
        </div>
        <button className={styles.login__loginButton} type='submit'>
          Login
        </button>
      </form>
    </main>
  )
}

export default Login
