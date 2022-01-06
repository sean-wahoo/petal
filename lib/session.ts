import Redis from 'ioredis'
import { nanoid } from 'nanoid/async'

interface UserSessionData {
  user_id: string
  email: string
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

const getSession = async (session_id: string): Promise<UserSessionData> => {
  let keys = await fetch(`${process.env.REDISAPIURL}/hkeys/${session_id}`, {
    headers: {
      Authorization: `Bearer ${process.env.REDISTOKEN}`,
    },
  })
  let vals = await fetch(`${process.env.REDISAPIURL}/hvals/${session_id}`, {
    headers: {
      Authorization: `Bearer ${process.env.REDISTOKEN}`,
    },
  })

  const keysParsed = await keys.json()
  const valsParsed = await vals.json()

  let arr = []
  for (let i = 0; i < keysParsed.result.length; i++) {
    arr.push([keysParsed.result[i], valsParsed.result[i]])
  }

  const obj: UserSessionData = Object.fromEntries(arr)

  return obj
}

export { updateSession, getSession }
