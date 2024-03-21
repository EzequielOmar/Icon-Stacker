import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./Navbar.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faBars } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  return (
    <header className={styles.header}>
      <nav className={styles.navbar}>
        <div className={styles.logoContainer}>
          <Link href="/">
            <Image src="/logo.svg" alt="logo" width={40} height={50} />
            <h1 className={styles.brand}>Icon Stacker</h1>
          </Link>
        </div>
        <div
          className={`${styles.linksContainer} ${isMenuOpen ? styles.active : ""}`}
        >
          <ul className={styles.navLinks}>
            <li>
              <Link href="/">Test 1</Link>
            </li>
            <li>
              <Link href="/">Test 2</Link>
            </li>
            <li>
              <Link href="/">Test 3</Link>
            </li>
          </ul>
          <ul className={styles.authLinks}>
            <li>
              <Link href="/signin">
                <FontAwesomeIcon icon={faUser} width="15"/>
                <span>Signin</span>
              </Link>
            </li>
          </ul>
        </div>
        <div className={styles.hamburgerMenu} onClick={toggleMenu}>
          <FontAwesomeIcon icon={faBars} />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
