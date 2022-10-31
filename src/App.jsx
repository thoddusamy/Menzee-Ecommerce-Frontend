import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './Pages/Login';
import Register from './Pages/Register';
import GetEmail from './Pages/GetEmail';
import ForgetPassword from './Pages/ForgetPassword';
import Dashboard from './Pages/Dashboard';
import Cart from './Pages/Cart';
import Payment from './Pages/Payment';
import VerifyOTP from './Pages/VerifyOTP';
import { DataProvider } from './ContextApi';
import SetProfilePic from './Components/SetProfilePic';
import Wishlist from './Pages/Wishlist'
import DetailsPage from './Pages/DetailsPage';
import Tshirts from './Components/Tshirts';
import Tracks from './Components/Tracks';
import Shorts from './Components/Shorts';
import Address from './Pages/Address';
import OrderSummary from './Pages/OrderSummary';
import MyOrders from './Pages/MyOrders';
import OrderPlaced from './Pages/OrderPlaced';
import UpdateAddress from './Pages/UpdateAddress';

function App() {
  return (
    <div className='App'>
      <DataProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/verifyotp' element={<VerifyOTP />} />
            <Route path='/getmail' element={<GetEmail />} />
            <Route path='/forgetpassword/:id/:token' element={<ForgetPassword />} />
            <Route path='/dashboard' element={<Dashboard />}>
              <Route path='/dashboard/tshirts' element={<Tshirts />} />
              <Route path='/dashboard/tracks' element={<Tracks />} />
              <Route path='/dashboard/shorts' element={<Shorts />} />
              <Route path='/dashboard/details/:id' element={<DetailsPage />} />
              <Route path='/dashboard/setpic' element={<SetProfilePic />} />
              <Route path='/dashboard/wishlist' element={<Wishlist />} />
              <Route path='/dashboard/myorders' element={<MyOrders />} />
              <Route path='/dashboard/cart/:cart' element={<Cart />} />
              <Route path='/dashboard/address/:address' element={<Address />} />
              <Route path='/dashboard/updateaddress/:updateaddress' element={<UpdateAddress />} />
              <Route path='/dashboard/summary/:summary' element={<OrderSummary />} />
              <Route path='/dashboard/payment/:payment' element={<Payment />} />
              <Route path='/dashboard/orderplaced/:orderplaced' element={<OrderPlaced />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </div>
  );
}

export default App;
