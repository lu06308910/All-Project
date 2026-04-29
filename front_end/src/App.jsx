import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Top from './assets/pages/Top'
import Home from './assets/pages/Home';
import Manager from './assets/manager/Manager'
import AllRroduct from './assets/product/allproduct';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        {/* top 레이아웃 역할 하며 항상 표시됨 */}
        <Route path='/' element={<Top />}>

          {/* 기본으로 보여줄 페이지 */}
          <Route index element={<Home />}></Route>

          {/* 앞으로 추가될 페이지는 여기에 계속 Route 추가해주시면 됨 */}
          <Route path='/allproduct' element={<AllRroduct />}></Route>
        </Route>
        <Route path='manager' element={<Manager />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
