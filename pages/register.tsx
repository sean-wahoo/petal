import type { NextPage } from 'next'
import styles from 'styles/layouts/register.module.scss'

const Register: NextPage = () => {
  return (
    <main className={styles.register}>
      <h1>Register to ConnectHigh</h1>
      <form className={styles.register__inputArea}>
        <div className={styles.register__inputGroup}>
          <label htmlFor='email'>Email</label>
          <input
            type='email'
            id='email'
            className={styles.register__emailInput}
          />
        </div>
        <div className={styles.register__inputGroup}>
          <label htmlFor='password'>Password</label>
          <input
            type='password'
            id='password'
            className={styles.register__passwordInput}
          />
        </div>
        <button className={styles.register__registerButton} type='submit'>
          Register
        </button>
      </form>
    </main>
  )
}

export default Register
