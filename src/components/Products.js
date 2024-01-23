import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Products.css';


const Products = () => {
    const [categories, setCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(10);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [searchTerm, setSearchResults] = useState([]);
    const { categoryName } = useParams();
    const navigate = useNavigate();
    useEffect(() => {
        fetch("http://localhost:2000/products", {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        }).then((res) => res.json().then((data) => {
            // Clear existing categories and set new ones
            setCategories(data.results);
        }))
    }, [categoryName, currentPage, productsPerPage]);


    useEffect(() => {
        // Update the URL only if a category is selected
        if (selectedCategory) {
            let url = `/products/category/${selectedCategory.toLowerCase()}`;
            url += `?page=${currentPage}`;
            navigate(url);
        }
    }, [navigate, currentPage, selectedCategory]);

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
    };

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = categories.slice(indexOfFirstProduct, indexOfLastProduct);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    const nextPage = () => {
        if (currentPage < Math.ceil(categories.length / productsPerPage)) {
            setCurrentPage((prev) => prev + 1);
        }
    };
    const goToHome = () => {
        navigate('/category');
    };
    const handleSearch = (e) => {
        // Perform Solr search
    e.preventDefault()
    navigate(`/SolarSearch/${encodeURIComponent(searchTerm)}`)
        console.log(searchTerm)
      };

    return (
        <div>
            <div className="upper-box">
                <button className="btn btn-primary" onClick={goToHome}>Home</button>
                <div className="search-container">
                    <input
                        className="form-control"
                        type="text"
                        placeholder="Search..."
                        value={searchTerm} onChange={(e)=>setSearchResults(e.target.value)}
                    />
                    <button className="btn btn-primary" onClick={handleSearch}>Search</button>
                </div>
            </div>
            <div className="container">
                <div className="mb-3">
                    <label htmlFor="categoryDropdown" className="form-label">Select Category:</label>
                    <select
                        id="categoryDropdown"
                        className="form-select"
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                    >
                        <option value="">--All Categories--</option>
                        <option value="Clothing">Clothing</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Dairy Products">DiaryProducts</option>
                        <option value="Kitchen Appliances">Kitchen</option>
                        <option value="Groceries">Groceries</option>
                        <option value="Cosmetics">Cosmetics</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.Category}>
                                {category.Category}
                            </option>
                        ))}
                    </select>
                </div>

                <table className="table">
                    <thead className="thead-dark">
                        <tr>
                            <th>CD</th>
                            <th>PD_ID</th>
                            <th>PD_NAME</th>
                            <th>BRAND</th>
                            <th>MRP</th>
                            <th>DISCOUNT</th>
                            <th>STOCK</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentProducts.map((category) => (
                            <tr key={category.id}>
                                <td>{category.CD}</td>
                                <td>{category.PD_ID}</td>
                                <td>{category.PD_NAME}</td>
                                <td>{category.BRAND}</td>
                                <td>{category.MRP}</td>
                                <td>{category.DISCOUNT}</td>
                                <td>{category.STOCK}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className='pagination-container'>
                    <button onClick={prevPage} disabled={currentPage === 1} className='pagination-button prev'>
                        Prev
                    </button>
                    {Array.from({ length: Math.ceil(categories.length / productsPerPage) }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => paginate(index + 1)}
                            disabled={currentPage === index + 1}
                            className='pagination-button'
                        >
                            {index + 1}
                        </button>
                    ))}
                    <button onClick={nextPage} disabled={currentPage === Math.ceil(categories.length / productsPerPage)} className='pagination-button next'>
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Products;