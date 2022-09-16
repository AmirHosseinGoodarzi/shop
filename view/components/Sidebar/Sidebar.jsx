import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import MenuItem from './MenuItem/MenuItem';
import MultiMenuItem from './MultiMenuItem/MultiMenuItem';
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
        <div className={styles.toggler}>
          <List size="1.6em" onClick={() => setIsCollapsed(!isCollapsed)} />
        </div>
      </div>
      <ul>
        {MENU_ITEMS.map((section,index) => {
          return (
            <React.Fragment key={index}>
              <p className={styles.menu_section_header}>{section.title}</p>
              {section.items.map((item, index) => {
                if (item.children) {
                  return <MultiMenuItem
                    key={index}
                    item={item}
                    isActive={item.children.find((child) => (child.href === router.asPath))}
                  />
                }
                return <MenuItem
                  key={index}
                  href={item.href}
                  isActive={item.href === router.asPath}
                >
                  <i>
                    <HandIndexThumbFill />
                  </i>
                  <span> {item.title}</span>
                </MenuItem>
              })
              }
            </React.Fragment>)
        })}
      </ul>
    </div>
  );
};

export default Sidebar;
