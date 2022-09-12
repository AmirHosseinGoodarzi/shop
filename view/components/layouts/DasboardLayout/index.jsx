import React, { useState } from 'react';
import styles from './DasboardLayout.module.scss';
import Sidebar from 'components/Sidebar/Sidebar';

const DasboardLayout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <div>
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed}/>
      <main
        className={`${styles.content} ${
          isCollapsed ? styles.collapsed_sideBar : ''
        }`}
      >
        {children}
      </main>
    </div>
  );
};

export default DasboardLayout;
