import React from 'react';
import styles from './sidebar.module.scss';

const Sidebar = ({ isCollapsed }) => {
  return (
    <div className={`${styles.wrapper} ${isCollapsed ? styles.collapsed : ''}`}>
      S
    </div>
  );
};

export default Sidebar;
