import type { NextPage } from 'next'
import type { LoginSuccess, LoginError, ErrorMessageProps } from 'lib/types'
import { useState, useRef } from 'react'
import styles from 'styles/layouts/login.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import Cookies from 'universal-cookie'
import Router from 'next/router'
import ErrorMessage from 'components/ErrorMessage'

// TODO: add other login providers

const Login: NextPage = () => {
  const [visible, setVisible] = useState<boolean>(false)
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [error, setError] = useState<ErrorMessageProps>({
    error_message: '',
    type: '',
  })

  const onLoginSubmit: () => void = async () => {
    try {
      const data = await fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })

      const res: LoginSuccess | LoginError = await data.json()
      if ('is_error' in res) {
        setError({ error_message: res.error_message, type: res.type })
      }
      const cookies = new Cookies()
      cookies.set('session_id', res.session_id)
      'is_error' in res || Router.reload()
    } catch (e: any) {
      setError({ ...e })
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
              if (error.type === 'email')
                setError({ error_message: '', type: '' })
            }}
            placeholder='email@address.com'
            id='email'
            className={styles.login__emailInput}
          />
          {error.type === 'email' && (
            <ErrorMessage error_message={error.error_message} />
          )}
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
                if (error.type === 'password') {
                  setError({ error_message: '', type: '' })
              }}
              className={styles.login__passwordInput}
            />
            <FontAwesomeIcon
              icon={visible ? faEyeSlash : faEye}
              className={styles.login__showPasswordIcon}
              onClick={() => setVisible(!visible)}
            />
          </div>
          {error.type === 'password' && (
            <ErrorMessage error_message={error.error_message} />
          )}
        </div>
        <button className={styles.login__loginButton} type='submit'>
          Login
        </button>
      </form>
    </main>
  )
}

export default Login
