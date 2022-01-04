import type { NextPage } from 'next'
import styles from 'styles/layouts/login.module.scss'

const Login: NextPage = () => {
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
          <input
            type='password'
            id='password'
            className={styles.login__passwordInput}
          />
        </div>
        <button className={styles.login__loginButton} type='submit'>
          Login
        </button>
      </form>
    </main>
  )
}

export default Login
