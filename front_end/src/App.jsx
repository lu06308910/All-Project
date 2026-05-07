import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Top from './assets/pages/Top';
import Home from './assets/pages/Home';
import Login from './assets/pages/login';
import Member from './assets/pages/member';
import FindMember from './assets/pages/findmember';
import Mypage from './assets/pages/mypage';
import AddProduct from './assets/pages/AddProduct';

import Manager from './assets/manager/Manager';
import AllRroduct from './assets/product/allproduct';
import ProductDetail from './assets/product/ProductDetail';
import CategoryProduct from './assets/product/CategoryProduct';

import Space from './assets/product/space';
import Sale from './assets/product/sale';
import Qna from './assets/qna/Qna';
import QnaWrite from './assets/qna/QnaWrite';
import NoticeList from './assets/qna/NoticeList';
import NoticeView from './assets/qna/NoticeView';
import Basket from './assets/buy/Basket';
import Parchase from './assets/buy/Parchase';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        {/* top 레이아웃 역할 하며 항상 표시됨 */}
        <Route path='/' element={<Top />}>

          {/* 기본으로 보여줄 페이지 */}
          <Route index element={<Home />}></Route>

          {/* 앞으로 추가될 페이지는 여기에 계속 Route 추가해주시면 됨 */}
          <Route path='/login' element={<Login />}></Route>
          <Route path='/member/signup' element={<Member />}></Route>
          <Route path='/member/findmember' element={<FindMember />}></Route>
          <Route path='/mypage' element={<Mypage />}></Route>
          <Route path='/mypage/addproduct' element={<AddProduct />}></Route>
          <Route path='/allproduct' element={<AllRroduct />}></Route>
          <Route path='/productDetail' element={<ProductDetail />}></Route>
          <Route path='/spaceproduct' element={<Space />}></Route>
          <Route path='/sale' element={<Sale />}></Route>
          <Route path='/categoryproduct' element={<CategoryProduct />}></Route>
          <Route path='/qna' element={<Qna />}></Route>
          <Route path='/qna/write' element={<QnaWrite />}></Route>
          <Route path='/qna/noticelist' element={<NoticeList />}></Route>
          <Route path='/qna/noticeview' element={<NoticeView />}></Route>
          <Route path='/basket' element={<Basket />}></Route>
          <Route path='/parchase' element={<Parchase />}></Route>
        </Route>
        
      </Routes>
    </BrowserRouter>
  )
}

export default App
