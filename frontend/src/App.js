import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './home';
import Register from './register';
import Login from './login';

function App() {

  return (
    <div className="App">
      <BrowserRouter>
    <Routes>
    <Route path='/' element={<Home/>}></Route>
      <Route path='/register' element={<Register/>}></Route>
      <Route path='/login' element={<Login/>}></Route>
    </Routes>
  </BrowserRouter>
    </div>
  );
}

export default App;
