import styles from "styles/components/navbar.module.scss";
import { useEffect, useRef, useState } from "react";
import debounce from "lodash.debounce";
import Image from "next/image";
import Link from "next/link";
import type { SessionData } from "lib/types";
import Cookies from "universal-cookie";
import Skeleton from "react-loading-skeleton";
import Dropdown from "./Dropdown";

const Navbar: React.FC<{ session: SessionData }> = ({ session }) => {
  const [prev, setPrev] = useState<number>(0);
  const [imageRef, setImageRef] = useState<any>(null)
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
    const cookies = new Cookies();
    cookies.remove("session_payload", { path: "/" });
    window.location.reload();
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
      {/* <form>
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
            updateSession({
              ...profile,
              email: data.email,
              image_url: data.image_url,
            });
          }}
        />
      </form> */}
    </nav>
  );
};

export default Navbar;
