import styles from "styles/components/navbar.module.scss";
import { useEffect, useRef, useState } from "react";
import debounce from "lodash.debounce";
import Image from "next/image";
import Link from "next/link";
import type { ProfileProps } from "lib/types";

export default function Navbar({ profile }: ProfileProps) {
  const [prev, setPrev] = useState<number>(0);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
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

  const handleClickOutside = (e: MouseEvent) => {
    console.log("click!", dropdownRef.current, showDropdown);
    if (
      !dropdownRef.current?.contains(e.target as any) &&
      !document.getElementById("profile-image")?.contains(e.target as any)
    ) {
      setShowDropdown(false);
    }
  };
  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () =>
      document.removeEventListener("click", handleClickOutside, true);
  }, [showDropdown]);

  return (
    <nav className={styles.navbar} ref={navRef}>
      <Link href="/">ConnectHigh</Link>
      <Image
        src={profile.image_url}
        alt={profile.display_name}
        width={48}
        height={48}
        id="profile-image"
        className={styles.profile_image}
        onClick={(e: any) => {
          setShowDropdown(!showDropdown);
        }}
      />
      {showDropdown && (
        <div ref={dropdownRef} className={styles.dropdown} id="dropdown">
          <ul>
            <li>Profile</li>
            <li>Settings</li>
          </ul>
        </div>
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
}
