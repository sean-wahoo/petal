import styles from "styles/components/navbar.module.scss";
import { useEffect, useRef, useState } from "react";
import debounce from "lodash.debounce";
import Image from "next/future/image";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import Dropdown from "src/components/Dropdown";
import { signIn, signOut, useSession } from "next-auth/react";
import { Session } from "next-auth";

const Navbar = () => {
  const { data: session } = useSession();
  const [prev, setPrev] = useState<number>(0);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const navRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const dbFunc = debounce(
      () => {
        const yPos = window.scrollY;
        document
          .querySelector("nav")
          ?.classList.toggle(styles.hidden, yPos > prev);

        setPrev(yPos);
      },
      1000,
      { leading: true, trailing: false }
    );
    window.addEventListener("scroll", dbFunc);
    return () => removeEventListener("scroll", dbFunc);
  }, [prev]);

  const profileImageArea = (session: Session | null) => {
    switch (session) {
      case undefined: {
        return <Skeleton height={48} width={48} />;
      }
      case null: {
        return (
          <div onClick={() => signIn()} className={styles.image_login_area}>
            Login
          </div>
        );
      }
      default: {
        return (
          <Image
            src={session.user?.image as string}
            alt={session.user?.name as string}
            width={48}
            height={48}
            id="profile-image"
            priority={true}
            className={styles.profile_image}
            onClick={() => {
              setShowDropdown(!showDropdown);
            }}
          />
        );
      }
    }
  };

  return (
    <nav className={styles.navbar} ref={navRef}>
      <Link className={styles.home_link} href="/">
        Petal
      </Link>
      {profileImageArea(session)}

      {showDropdown && (
        <Dropdown toggler={setShowDropdown}>
          <ul>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href={`/users/${session?.user?.id}`}>Profile</Link>
            </li>
            <li>
              <Link href="/posts/create-post">Create Post</Link>
            </li>
            <li>Settings</li>
            <li className={styles.logout} onClick={() => signOut()}>
              Logout
            </li>
          </ul>
        </Dropdown>
      )}
    </nav>
  );
};

export default Navbar;
