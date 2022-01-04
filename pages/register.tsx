import type { NextPage } from 'next'
import { useState } from 'react'
import styles from 'styles/layouts/register.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'

const Register: NextPage = () => {
  const [visible, setVisible] = useState<boolean>(false)
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  return (
    <main className={styles.register}>
      <h1>Register to ConnectHigh</h1>
      <form
        className={styles.register__inputArea}
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault()
          console.log({ email, password })
        }}
      >
        <div className={styles.register__inputGroup}>
          <label htmlFor='email'>Email</label>
          <input
            type='email'
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setEmail(e.currentTarget.value)
            }}
            id='email'
            className={styles.register__emailInput}
          />
        </div>
        <div className={styles.register__inputGroup}>
          <label htmlFor='password'>Password</label>
          <div>
            <input
              type={visible ? 'text' : 'password'}
              id='password'
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setPassword(e.currentTarget.value)
              }}
              className={styles.register__passwordInput}
            />

            <FontAwesomeIcon
              icon={visible ? faEyeSlash : faEye}
              className={styles.register__showPasswordIcon}
              onClick={() => setVisible(!visible)}
            />
          </div>
        </div>
        <button className={styles.register__registerButton} type='submit'>
          Register
        </button>
      </form>
    </main>
  )
}

export default Register
