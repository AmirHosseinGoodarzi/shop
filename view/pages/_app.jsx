import 'styles/globals.scss';
//============== images & icons ==============
//=============== components =================
import MainLayout from 'components/layouts/MainLayout';
//============== libraries ===================


function MyApp({ Component, pageProps }) {
  return (
    <MainLayout>
      <Component {...pageProps} />
    </MainLayout>
  );
}

export default MyApp;
