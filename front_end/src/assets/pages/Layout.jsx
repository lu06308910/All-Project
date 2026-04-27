import { Link, Outlet } from 'react-router-dom';
import Footer from './Footer';

function Layout() {
  return (
    <div>
      <div className='category'>
        <div><Link to="/">카테고리</Link></div>
        <div><Link to="/">카테고리</Link></div>
        <div><Link to="/">카테고리</Link></div>
        <div><Link to="/">방명록</Link></div>
        <div><Link to="/">정보</Link></div>
      </div>
      <Outlet />
      <Footer/>
    </div>
  );
}

export default Layout;