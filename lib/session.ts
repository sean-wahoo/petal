import Redis from 'ioredis'
import { nanoid } from 'nanoid/async'

interface UserSessionData {
  user_id: string
  email: string
  session_id: string
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
  let all = await fetch(`${process.env.REDISAPIURL}/hgetall/${session_id}`, {
    headers: {
      Authorization: `Bearer ${process.env.REDISTOKEN}`,
    },
  })

  const allParsed = await all.json()

  const n: number = allParsed.result.length / 2
  let arr: any = []

  for (let i = 0; i < n; i++) {
    arr = [...arr, allParsed.result.splice(0, 2)]
  }
  arr.push(['session_id', session_id])

  const obj = Object.fromEntries(arr) as UserSessionData

  return obj
}

export { updateSession, getSession }
