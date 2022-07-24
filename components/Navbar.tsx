import styles from "styles/components/navbar.module.scss";
import { useContext, useEffect, useRef, useState } from "react";
import debounce from "lodash.debounce";
import Image from "next/future/image";
import Link from "next/link";
import type { SessionData } from "lib/types";
import Skeleton from "react-loading-skeleton";
import Dropdown from "components/Dropdown";
import { logout } from "lib/utils";
import { SessionContext } from "components/Layout";

const Navbar = () => {
  const data = useContext(SessionContext);
  const session = data?.session as SessionData;

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

  const handleLogout = () => {
    logout(session.user_id).then(() => window.location.reload());
  };

  return (
    <nav className={styles.navbar} ref={navRef}>
      <Link href="/">Petal</Link>

      {!session ? (
        <Skeleton height={48} width={48} />
      ) : (
        <Image
          src={session.image_url as string}
          alt={session.display_name}
          width={48}
          height={48}
          id="profile-image"
          priority={true}
          className={styles.profile_image}
          onClick={() => {
            setShowDropdown(!showDropdown);
          }}
        />
      )}

      {showDropdown && (
        <Dropdown toggler={setShowDropdown}>
          <ul>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href={`/users/${session?.user_id}`}>Profile</Link>
            </li>
            <li>
              <Link href="/posts/create-post">Create Post</Link>
            </li>
            <li>Settings</li>
            <li className={styles.logout} onClick={handleLogout}>
              Logout
            </li>
          </ul>
        </Dropdown>
      )}
    </nav>
  );
};

export default Navbar;
