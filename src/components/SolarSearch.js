import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './SolarSearch.css';

const SolarSearch = () => {
  let { searchTerm } = useParams();
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        let url = `http://localhost:2000/search/${searchTerm}`;

        // Check if there is a brand parameter
        if (searchTerm) {
          url += `?brand=${searchTerm}`;
        }

        let response = await fetch(url);
        response = await response.json();
        setData(response);
      } catch (error) {
        console.error('Error performing Solr search:', error);
      }
    }
    fetchData();
  }, [searchTerm]);

  return (
    <div>
      <div className="results-box">
        <Link to="/products" className="btn back-button"> Back</Link>
        <div className="search-query-box">
          <h3><p className="search-query-text">{`Results for: ${searchTerm}`}</p></h3>
        </div>
      </div>
      <div className="image-grid">
        {data.map((category) => (
          <div key={category.CD_ID} className="image-container">
            <img
              src={`/images/product${category.CD_ID}.jpg`}
              alt={category.PD_NAME}
              className="product-image"
            />
            <div className="image-details">
              <p className="overlay-text">{category.PD_NAME}</p>
              <p className="overlay-text">{category.BRAND}</p>
              <p className="overlay-text">MRP: {category.MRP}</p>
              <p className="overlay-text">Discount: {category.DISCOUNT}</p>
            </div>
            <div className="image-overlay">
              <div className="overlay-content">
                <p className="overlay-text">{category.CD}</p>
                <p className="overlay-text">Stock: {category.STOCK}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SolarSearch;
