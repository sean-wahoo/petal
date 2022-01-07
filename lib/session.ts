import Redis from 'ioredis'
import { nanoid } from 'nanoid/async'
import type { SessionSuccess, SessionError, SessionData } from 'lib/types'

// TODO: find workaround for refreshing the page because apparently that matters

const updateSession = async (
  session_data: SessionData
): Promise<string | SessionError> => {
  try {
    let { user_id, email, session_id } = session_data
    session_id ||= await nanoid(24)
    const obj: any = { user_id, email }

    let data = await fetch(
      `${process.env.REDISAPIURL}/hmset/${session_id}/session_data`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.REDISTOKEN}`,
        },
        body: JSON.stringify(obj),
      }
    )
    data = await data.json()

    let exp = await fetch(
      `${process.env.REDISAPIURL}/expire/${session_id}/84600`,
      {
        headers: {
          Authorization: `Bearer ${process.env.REDISTOKEN}`,
        },
      }
    )
    exp = await exp.json()

    if ('error' in data || 'error' in exp)
      throw new Error('Session failed to initialize!')

    return session_id
  } catch (e: any) {
    console.log({ e })
    return { is_error: true, error_code: e.code, error_message: e.message }
  }
}

const getSession = async (
  session_id: string
): Promise<SessionSuccess | SessionError> => {
  let all = await fetch(`${process.env.REDISAPIURL}/hgetall/${session_id}`, {
    headers: {
      Authorization: `Bearer ${process.env.REDISTOKEN}`,
    },
  })

  const allParsed = await all.json()

  if (allParsed.result.length === 0)
    return {
      is_error: true,
      error_code: '',
      error_message: 'Invalid Session ID!',
    }

  const obj = {
    ...JSON.parse(allParsed.result[1]),
    session_id,
    is_error: false,
  }

  return obj
}

const destroySession = async (session_id: string): Promise<void> => {
  try {
    await fetch(`${process.env.REDISAPIURL}/del/${session_id}`, {
      headers: {
        Authorization: `Bearer ${process.env.REDISTOKEN}`,
      },
      body: JSON.stringify({ session_id }),
    })
  } catch (e: any) {
    console.log({ e })
  }
}

export { updateSession, getSession, destroySession }
