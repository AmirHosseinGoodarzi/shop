import React, { useState } from 'react';
import styles from './DasboardLayout.module.scss';
import Sidebar from 'components/Sidebar/Sidebar';
import { Bell, Cart, List } from 'react-bootstrap-icons';

const DasboardLayout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);

  return (
    <div>
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <main className={styles.main_wrapper}>
        <nav>
          <div className={styles.toggler}>
            <List size="1.6em" onClick={() => setIsCollapsed(!isCollapsed)} />
          </div>
          <ul className={styles.options_list}>
            <div className={styles.cart}>
              <Cart size="1.3rem" />
              <span className={styles.counter}>5</span>
            </div>
            <div className={styles.notification}>
              <div
                onClick={() => setShowNotificationMenu(!showNotificationMenu)}
              >
                <Bell size="1.3rem" />
                <span className={styles.counter}>0</span>
              </div>
              {showNotificationMenu && (
                <div className={styles.notification_menu}>
                  <ul>
                    <li>
                      <i>
                        <Bell size="1.3rem" />
                      </i>
                      <span>پروفایل</span>
                    </li>
                    <li>
                      <i>
                        <Bell size="1.3rem" />
                      </i>
                      <span>خروج</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
            <div className={styles.avatar}>
              <img
                src="/assets/images/avatars/128x128/128_15.png"
                alt="avatar"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              />
              {showProfileMenu && (
                <div className={styles.avatar_menu}>
                  <ul>
                    <li>
                      <i>
                        <Bell size="1.3rem" />
                      </i>
                      <span>پروفایل</span>
                    </li>
                    <li>
                      <i>
                        <Bell size="1.3rem" />
                      </i>
                      <span>خروج</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </ul>
        </nav>
        <div
          className={`${styles.content} ${
            isCollapsed ? styles.collapsed_sideBar : ''
          }`}
        >
          {children}
        </div>
      </main>
    </div>
  );
};

export default DasboardLayout;
