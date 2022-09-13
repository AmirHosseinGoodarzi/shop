import React, { useState } from 'react';
import styles from './DasboardLayout.module.scss';
import Sidebar from 'components/Sidebar/Sidebar';
import { Bell, Cart,List } from 'react-bootstrap-icons';

const DasboardLayout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <div>
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <main className={styles.main_wrapper}>
        <nav>
          <div className={styles.toggler}>
            <List size="1.6em" onClick={() => setIsCollapsed(!isCollapsed)} />
          </div>
          <ul>
            <div className={styles.cart}>
              <Cart size="1.3rem" />
              <span>5</span>
            </div>
            <div className={styles.notification}>
              <Bell size="1.3rem" />
              <span>0</span>
            </div>
            <div className={styles.avatar}>
              <img src="/assets/images/avatars/128x128/128_15.png" alt="avatar" />
            </div>
          </ul>
        </nav>
        <div className={`${styles.content} ${isCollapsed ? styles.collapsed_sideBar : ''}`}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default DasboardLayout;
