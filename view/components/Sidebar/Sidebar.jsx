import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import MenuItem from './MenuItem/MenuItem';
import styles from './sidebar.module.scss';
import MENU_ITEMS from './MENU_ITEMS.json';
import { HandIndexThumbFill, List } from 'react-bootstrap-icons';

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const router = useRouter();
  return (
    <div className={`${styles.wrapper} ${isCollapsed ? styles.collapsed : ''}`}>
      <div id={styles.header}>
        <div id={styles.logo}>
          <Link href="/">
            <h3>Logo</h3>
          </Link>
        </div>
        <div id={styles.toggler}>
          <List size="1.6em" onClick={() => setIsCollapsed(!isCollapsed)} />
        </div>
      </div>
      <ul>
        {MENU_ITEMS.map((section) =>
          section.items.map((item, index) => (
            <MenuItem
              key={index}
              href={item.href}
              isActive={item.href === router.asPath}
            >
              <i>
                <HandIndexThumbFill />
              </i>
              <span> {item.title}</span>
            </MenuItem>
          ))
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
