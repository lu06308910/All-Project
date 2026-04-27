import {BrowserRouter, Routes, Route} from 'react-router-dom';

import Layout from './assets/pages/Layout'
import Home from './assets/pages/Home';
import Manager from './assets/manager/Manager'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout/>}>
          <Route index element={<Home/>}></Route>
        </Route>
        <Route path='manager' element={<Manager/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
