import Link from 'next/link';
import React from 'react';

const Home = () => {
  return (
    <div>
      <h1>صفحه اصل</h1>
      <hr />
      <ul>
        <li className="my-5">
          <Link href="/dashboard">داشبورد</Link>
        </li>
      </ul>
    </div>
  );
};

export default Home;
