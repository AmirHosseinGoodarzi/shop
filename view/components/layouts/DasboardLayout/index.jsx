import React, { useState } from 'react';
import styles from './DasboardLayout.module.scss';
import Sidebar from 'components/Sidebar/Sidebar';

const DasboardLayout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <div>
      <Sidebar isCollapsed={isCollapsed} />
      <main
        className={`${styles.content} ${
          isCollapsed ? styles.collapsed_sideBar : ''
        }`}
      >
        {children}
        <button
          className='bg-blue-500 text-white mx-10 p-5'
          onClick={() => {
            setIsCollapsed(!isCollapsed);
          }}
        >
          collapse
        </button>
      </main>
    </div>
  );
};

export default DasboardLayout;
