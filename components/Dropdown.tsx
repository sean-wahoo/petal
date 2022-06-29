import styles from "styles/components/dropdown.module.scss"
import { forwardRef, useEffect, useRef } from "react";

const Dropdown = ({ children, toggler }: any, ref: any) => {
  const parent = ref ? ref : document.getElementById('profile-image');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const handleClickOutside = (e: MouseEvent) => {
    if (
      !dropdownRef.current?.contains(e.target as any) &&
      (parent === ref ? !parent?.current?.contains(e.target as any) : !parent?.contains(e.target as any))
    ) {
      toggler(false);
    }
  };
  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () =>
      document.removeEventListener("click", handleClickOutside, true);
  }, [parent]);

  return (
    <div ref={dropdownRef} className={styles.dropdown} id="dropdown">
      {children}
    </div>
  )
}
export default forwardRef(Dropdown)
