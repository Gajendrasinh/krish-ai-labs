import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import ChatWidget from './ChatWidget';

export default function Layout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
