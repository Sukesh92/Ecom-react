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
            setCategories(data.results);
        }))
    }, [categoryName, currentPage, productsPerPage]);

    useEffect(() => {
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

    const totalPages = Math.ceil(categories.length / productsPerPage);
    const maxPagesToShow = 7;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (totalPages <= maxPagesToShow) {
        startPage = 1;
        endPage = totalPages;
    } else {
        if (endPage - startPage + 1 < maxPagesToShow) {
            startPage = endPage - maxPagesToShow + 1;
        }
    }

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const goToHome = () => {
        navigate('/category');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/SolarSearch/${encodeURIComponent(searchTerm)}`);
        console.log(searchTerm);
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
                    {Array.from({ length: endPage - startPage + 1 }).map((_, index) => (
                        <button
                            key={startPage + index}
                            onClick={() => paginate(startPage + index)}
                            disabled={currentPage === startPage + index}
                            className='pagination-button'
                        >
                            {startPage + index}
                        </button>
                    ))}
                    <button onClick={nextPage} disabled={currentPage === totalPages} className='pagination-button next'>
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Products;
