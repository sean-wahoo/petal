import styles from "styles/components/navbar.module.scss";
import { useEffect, useRef, useState } from "react";
import debounce from "lodash.debounce";
import Image from "next/image";
import Link from "next/link";
import type { ProfileProps } from "lib/types";
import { upload } from "lib/bucket";
import { updateSession } from "lib/session";
export default function Navbar({ profile }: ProfileProps) {
  const [prev, setPrev] = useState<number>(0);
  const navRef = useRef(null);
  console.log(profile);
  useEffect(() => {
    window.addEventListener(
      "scroll",
      debounce(
        () => {
          const yPos = window.scrollY;
          document
            .querySelector("nav")
            ?.classList.toggle(styles.hidden, yPos > prev);

          setPrev(yPos);
        },
        1000,
        { leading: true, trailing: false }
      )
    );
  }, [prev]);

  console.log({ profile });

  return (
    <nav className={`${styles.navbar}`} ref={navRef}>
      <Link href="/">ConnectHigh</Link>
      <Image
        src={profile.image_url}
        alt={profile.display_name}
        width={48}
        height={48}
        className={styles.profile_image}
      />
      <form>
        <input
          type="file"
          accept="image/*"
          onChange={async (e: any) => {
            const file = e.target.files[0];
            const [data, error] = await upload(
              file,
              "profile_images",
              profile.user_id
            );
            if (error || !data) {
              console.log("whoops", { error });
              return;
            }
            console.log({ data });
            updateSession({
              ...profile,
              email: data.email,
              image_url: data.image_url,
            });
          }}
        />
      </form>
    </nav>
  );
}
