import { Link, Outlet } from 'react-router-dom';
import Footer from './Footer';

function Layout() {
  
  return (
    <div>
      <div className='category'>
        <div><Link to="/">모든 상품</Link></div>
        <div><Link to="/">공간별</Link></div>
        <div><Link to="/">문의사항</Link></div>
        <div><Link to="/">마이페이지</Link></div>
        <div><Link to="/manager">관리자페이지</Link></div>
      </div>
      <Outlet />
      <Footer/>
    </div>
  );
}

export default Layout;