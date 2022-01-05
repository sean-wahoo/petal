import type { NextPage } from 'next'
import { useState } from 'react'
import styles from 'styles/layouts/register.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import Cookies from 'universal-cookie'
import Router from 'next/router'

const Register: NextPage = () => {
  const [visible, setVisible] = useState<boolean>(false)
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  interface SuccessRegister {
    user_id: string
    session_id: string
  }

  interface FailureRegister {
    error_code: string
    error_message: string
  }

  const onRegisterSubmit: () => void = async () => {
    try {
      const data = await fetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })
      console.log(data)
      if (data.status === 500) throw new Error('Request Failed')
      const res: SuccessRegister & FailureRegister = await data.json()
      console.log({ res })
      const cookies = new Cookies()
      cookies.set('session_id', res.session_id)
      Router.reload()
    } catch (e: any) {
      console.log({ e })
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
            className={styles.register__emailInput}
          />
        </div>
        <div className={styles.register__inputGroup}>
          <label htmlFor='password'>Password</label>
          <div>
            <input
              type={visible ? 'text' : 'password'}
              id='password'
              required
              minLength={8}
              placeholder='super secret password'
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
