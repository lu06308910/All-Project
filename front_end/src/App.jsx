import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Top from './assets/pages/Top';
import Home from './assets/pages/Home';
import Login from './assets/pages/login';
import Member from './assets/pages/member';

import Manager from './assets/manager/Manager';
import AllRroduct from './assets/product/allproduct';

import Space from './assets/product/space';
import Qna from './assets/qna/Qna';
import QnaWrite from './assets/qna/QnaWrite';
import NoticeList from './assets/qna/NoticeList';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        {/* top 레이아웃 역할 하며 항상 표시됨 */}
        <Route path='/' element={<Top />}>

          {/* 기본으로 보여줄 페이지 */}
          <Route index element={<Home />}></Route>

          {/* 앞으로 추가될 페이지는 여기에 계속 Route 추가해주시면 됨 */}
          <Route path='/login' element={<Login/>}></Route>
          <Route path='/member/signup' element={<Member/>}></Route>
          <Route path='/allproduct' element={<AllRroduct />}></Route>
          <Route path='/spaceproduct' element={<Space />}></Route>
          <Route path='/qna' element={<Qna />}></Route>
          <Route path='/qna/write' element={<QnaWrite />}></Route>
          <Route path='/qna/noticelist' element={<NoticeList />}></Route>


        </Route>
        <Route path='manager' element={<Manager />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
