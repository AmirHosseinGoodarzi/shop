import React from 'react';
import Link from 'next/link';
import styles from '../sidebar.module.scss';

const MenuItem = ({ children, href, isActive }) => {
  return (
    <Link href={href}>
      <li className={`${styles.menu_item} ${isActive && styles.active}`}>
        {children}
      </li>
    </Link>
  );
};

export default MenuItem;
