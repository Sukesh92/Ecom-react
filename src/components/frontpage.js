import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import './frontpage.css';

const CategoryTable = () => {
    const [category, setCategory] = useState([]);

    useEffect(() => {
        fetch("http://localhost:2000/category") // Use the correct endpoint (e.g., /category)
            .then((response) => response.json())
            .then((data) => setCategory(data))
            .catch((error) => console.log(error));
    }, []);

    const handleImageClick = (categoryName) => {
        // Perform actions when the image is clicked
        console.log(`Image clicked for category: ${categoryName}`);
        // You can navigate or do other actions here
    };

    return (
        <div>
            <div className="black-upper-box">
                <div className="container">
                    <div className="d-flex justify-content-between">
                        <h1 className="text-white">A to Z STORE</h1>
                        <Link to="/products" className="btn btn-primary" id="allbu">
                            View All Products
                        </Link>
                    </div>
                </div>
            </div>

            <div className="container mt-5">

                <div className="d-flex">
                    <div className="category-list">
                        {category.map((category) => (
                            <div key={category.CD_ID} className="category-item">
                                <Link to={`/products/category/${encodeURIComponent(category.CATEGORY_NAME)}`}>
                                    <img
                                        src={`/images/${category.CATEGORY_NAME}.jpg`}
                                        alt={category.CATEGORY_NAME}
                                        onClick={() => handleImageClick(category.CATEGORY_NAME)}
                                    />
                                </Link>
                                <p>
                                    <Link to={`/products/category/${encodeURIComponent(category.CATEGORY_NAME)}`}>
                                        {category.CATEGORY_NAME}
                                    </Link>
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryTable;
