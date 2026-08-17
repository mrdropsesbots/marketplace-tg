import { Routes, Route } from 'react-router-dom'
import Header from './components/Header.jsx'
import BottomNav from './components/BottomNav.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Home from './pages/Home.jsx'
import ProductPage from './pages/ProductPage.jsx'
import AddProduct from './pages/AddProduct.jsx'
import Favorites from './pages/Favorites.jsx'
import Profile from './pages/Profile.jsx'
import AdminModeration from './pages/AdminModeration.jsx'
import Search from './pages/Search.jsx'
import Chats from './pages/Chats.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/search" element={<Search />} />
        <Route path="/add-product" element={<ProtectedRoute><AddProduct /></ProtectedRoute>} />
        <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/chats" element={<ProtectedRoute><Chats /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute adminOnly><AdminModeration /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <BottomNav />
    </>
  )
}
