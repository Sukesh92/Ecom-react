
import { BrowserRouter as Router,Route,Routes } from 'react-router-dom';
import './App.css';
import { Navigate } from 'react-router-dom';
import SolarSearch from './components/SolarSearch';
import CategoryTable from './components/frontpage';
import Products from './components/Products';
import CategoryProducts from './components/CategoryProducts';



function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Navigate to ="/category" />}/>
        <Route path="/category" element={<CategoryTable/>} />
        <Route path="/products" element={<Products/>} />
        <Route path="/products/category/:category" element={<CategoryProducts/>} />
        <Route path="/SolarSearch/:searchTerm" element={<SolarSearch/>}/>
      </Routes>
    </Router>
  );
}

export default App;