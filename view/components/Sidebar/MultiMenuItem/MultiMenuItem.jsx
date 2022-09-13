import React, { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../sidebar.module.scss';
import { Badge3dFill, BadgeAd } from 'react-bootstrap-icons';
import MenuItem from '../MenuItem/MenuItem';

const MultiMenuItem = ({ item, isActive }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(isActive);
  return (
    <li className={`${styles.multi_menu_item} ${isActive && styles.active}`}>
      <div className={styles.title} onClick={() => setIsOpen(!isOpen)}>
        <i><BadgeAd /></i>
        {item.title}</div>
      <ul className={isOpen && styles.isOpen}>
        {item.children.map((child, index) => {
          return <MenuItem
            key={index}
            href={child.href}
            isActive={child.href === router.asPath}
          >
            <i><Badge3dFill /></i>
            <span> {child.title}</span>
          </MenuItem>
        })}
      </ul>
    </li>
  );
};

export default MultiMenuItem;
