import type { NextPage } from 'next'
import { useState } from 'react'
import styles from 'styles/layouts/login.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import Cookies from 'universal-cookie'
import Router from 'next/router'

// TODO: add other login providers

const Login: NextPage = () => {
  const [visible, setVisible] = useState<boolean>(false)
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  interface SuccessLogin {
    user_id: string
    session_id: string
  }

  interface FailureLogin {
    error_code: string
    error_message: string
  }

  const onLoginSubmit: () => void = async () => {
    try {
      const data = await fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })
      if (data.status === 500) throw new Error('Request Failed')
      console.log(data)
      const res: SuccessLogin & FailureLogin = await data.json()
      const cookies = new Cookies()
      cookies.set('session_id', res.session_id)
      Router.reload()
    } catch (e: any) {
      console.log({ e })
    }
  }

  return (
    <main className={styles.login}>
      <h1>Login to ConnectHigh</h1>
      <form
        className={styles.login__inputArea}
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault()
          onLoginSubmit()
        }}
      >
        <div className={styles.login__inputGroup}>
          <label htmlFor='email'>Email</label>
          <input
            type='email'
            value={email}
            required
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setEmail(e.currentTarget.value)
              e.currentTarget.setCustomValidity(
                e.currentTarget.value.includes('.')
                  ? ''
                  : 'Please provide a valid email address'
              )
            }}
            placeholder='email@address.com'
            id='email'
            className={styles.login__emailInput}
          />
        </div>
        <div className={styles.login__inputGroup}>
          <label htmlFor='password'>Password</label>
          <div>
            <input
              type={visible ? 'text' : 'password'}
              id='password'
              value={password}
              required
              placeholder='super secret password'
              minLength={8}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setPassword(e.currentTarget.value)
              }}
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
