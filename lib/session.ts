import Redis from 'ioredis'
import { nanoid } from 'nanoid/async'

// TODO: find workaround for refreshing the page because apparently that matters

interface UserSessionData {
  user_id: string
  email: string
  session_id: string
  isError: boolean
}

interface SessionErrorData {
  isError: boolean
  message: string
}

const updateSession = async (
  user_id: string,
  email: string,
  session_id?: string
): Promise<string> => {
  const redis = new Redis(process.env.REDISURL)
  session_id ||= await nanoid(24)
  redis.hmset(session_id, { user_id, email })
  redis.expire(session_id, 84600)
  return session_id
}

const getSession = async (
  session_id: string
): Promise<UserSessionData | SessionErrorData> => {
  let all = await fetch(`${process.env.REDISAPIURL}/hgetall/${session_id}`, {
    headers: {
      Authorization: `Bearer ${process.env.REDISTOKEN}`,
    },
  })

  const allParsed = await all.json()
  console.log({ session_id, allParsed })

  if (allParsed.result.length === 0)
    return { isError: true, message: 'Invalid Session ID!' }

  const n: number = allParsed.result.length / 2
  let arr: any = []

  for (let i = 0; i < n; i++) {
    arr = [...arr, allParsed.result.splice(0, 2)]
  }
  arr.push(['session_id', session_id], ['isError', false])

  console.log(arr)
  const obj = Object.fromEntries(arr) as UserSessionData

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
