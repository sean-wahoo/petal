import type { NextPage } from 'next'
import type {
  RegisterSuccess,
  RegisterError,
  ErrorMessageProps,
} from 'lib/types'
import { useState, useRef } from 'react'
import styles from 'styles/layouts/register.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import Cookies from 'universal-cookie'
import Router from 'next/router'
import ErrorMessage from 'components/ErrorMessage'

const Register: NextPage = () => {
  const [visible, setVisible] = useState<boolean>(false)
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [error, setError] = useState<ErrorMessageProps>({
    error_message: '',
    type: '',
  })

  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  const onRegisterSubmit: () => void = async () => {
    try {
      const data = await fetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })
      const res: RegisterSuccess | RegisterError = await data.json()
      if ('is_error' in res) {
        setError({ error_message: res.error_message, type: res.type })
        res.type === 'email' &&
          emailRef.current?.setCustomValidity(res.error_message)
        res.type === 'password' &&
          passwordRef.current?.setCustomValidity(res.error_message)
        return
      }
      const cookies = new Cookies()
      cookies.set('session_id', res.session_id)
      Router.reload()
    } catch (e: any) {
      setError({ ...e })
    }
  }

  return (
    <main className={styles.register}>
      <h1>Register to ConnectHigh</h1>
      <form
        className={styles.register__inputArea}
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault()
          onRegisterSubmit()
        }}
      >
        <div className={styles.register__inputGroup}>
          <label htmlFor='email'>Email</label>
          <input
            type='email'
            value={email}
            required
            onInvalid={(e: React.BaseSyntheticEvent) => {
              e.preventDefault()
              setError({
                error_message: e.target.validationMessage.replace(
                  / *\([^)]*\) */g,
                  ''
                ),
                type: 'email',
              })
            }}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setEmail(e.currentTarget.value)
              e.currentTarget.setCustomValidity(
                e.currentTarget.value.includes('.')
                  ? ''
                  : 'Please provide a valid email address'
              )
              if (error.type === 'email')
                setError({ error_message: '', type: '' })
              e.target.setCustomValidity('')
            }}
            ref={emailRef}
            placeholder='email@address.com'
            id='email'
            className={styles.register__emailInput}
          />
          {error.type === 'email' && (
            <ErrorMessage error_message={error.error_message} />
          )}
        </div>
        <div className={styles.register__inputGroup}>
          <label htmlFor='password'>Password</label>
          <div>
            <input
              type={visible ? 'text' : 'password'}
              id='password'
              required
              minLength={8}
              onInvalid={(e: React.BaseSyntheticEvent) => {
                e.preventDefault()
                setError({
                  error_message: e.target.validationMessage.replace(
                    / *\([^)]*\) */g,
                    ''
                  ),
                  type: 'password',
                })
              }}
              placeholder='super secret password'
              ref={passwordRef}
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setPassword(e.currentTarget.value)
                if (error.type === 'password') {
                  setError({ error_message: '', type: '' })
                  e.target.setCustomValidity('')
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
          {error.type === 'password' && (
            <ErrorMessage error_message={error.error_message} />
          )}
        </div>
        <button className={styles.register__registerButton} type='submit'>
          Register
        </button>
      </form>
    </main>
  )
}

export default Register
