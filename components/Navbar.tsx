import styles from 'styles/components/navbar.module.scss'
import { useEffect, useRef, useState } from 'react'
import debounce from 'lodash.debounce'
import Image from 'next/image'
import Link from 'next/link'
import type { ProfileProps } from 'lib/types'
import { upload } from 'lib/bucket'
export default function Navbar({ profile }: ProfileProps) {
  const [prev, setPrev] = useState<number>(0)
  const navRef = useRef(null)
  useEffect(() => {
    window.addEventListener(
      'scroll',
      debounce(
        () => {
          const yPos = window.scrollY
          document
            .querySelector('nav')
            ?.classList.toggle(styles.hidden, yPos > prev)

          setPrev(yPos)
        },
        1000,
        { leading: true, trailing: false }
      )
    )
  }, [prev])

  return (
    <nav className={`${styles.navbar}`} ref={navRef}>
      <Link href='/'>ConnectHigh</Link>
      <Image
        src={profile.image_url}
        alt={profile.display_name}
        width={48}
        height={48}
        className={styles.profile_image}
      />
      <form>
        <input
          type='file'
          accept='image/*'
          onChange={async (e: any) => {
            const file = e.target.files[0]
            upload(file, 'profile_images', profile.user_id)
          }}
        />
      </form>
    </nav>
  )
}
