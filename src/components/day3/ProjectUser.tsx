import { Component } from 'react';
import './ProductList.css';

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

interface ProductListState {
  products: Product[];
  loading: boolean;
  error: string | null;
  categories: string[];
  selectedCategory: string;
}

class ProductList extends Component<object, ProductListState> {
  private controller: AbortController | null = null;

  state: ProductListState = {
    products: [],
    loading: true,
    error: null,
    categories: [],
    selectedCategory: 'all'
  };

  async componentDidMount() {
    try {
      this.controller = new AbortController();
      await Promise.all([
        this.fetchProducts(),
        this.fetchCategories()
      ]);
    } catch (error) {
      console.error('Error in componentDidMount:', error);
    }
  }

  componentWillUnmount() {
    if (this.controller) {
      this.controller.abort();
      console.log('🧹 Cleanup: API requests aborted');
      this.controller = null;
    }
  }

  fetchProducts = async () => {
    try {
      const response = await fetch('https://fakestoreapi.com/products', {
        signal: this.controller?.signal
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: Product[] = await response.json();
      this.setState({ 
        products: data, 
        loading: false,
        error: null
      });
    } catch (err) {
      if (err instanceof Error) {
        if (err.name !== 'AbortError') {
          this.setState({ 
            error: `Failed to fetch products: ${err.message}`, 
            loading: false 
          });
        }
      } else {
        this.setState({ 
          error: 'An unknown error occurred', 
          loading: false 
        });
      }
    }
  };

  fetchCategories = async () => {
    try {
      const response = await fetch('https://fakestoreapi.com/products/categories', {
        signal: this.controller?.signal
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: string[] = await response.json();
      this.setState({ 
        categories: ['all', ...data],
        error: null
      });
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        console.error('Failed to fetch categories:', err);
        this.setState({ 
          error: `Failed to fetch categories: ${err.message}`
        });
      }
    }
  };

  handleCategoryChange = (category: string) => {
    this.setState({ selectedCategory: category });
  };

  renderRatingStars = (rating: number): string => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return '★'.repeat(fullStars) + 
           (hasHalfStar ? '⭐' : '') + 
           '☆'.repeat(emptyStars);
  };

  render() {
    const { products, loading, error, categories, selectedCategory } = this.state;

    if (loading) return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Loading amazing products...</p>
      </div>
    );

    if (error) return (
      <div className="error-container">
        <h3>❌ Oops! Something went wrong</h3>
        <p>{error}</p>
        <button onClick={this.fetchProducts}>Try Again</button>
      </div>
    );

    const filteredProducts = selectedCategory === 'all'
      ? products
      : products.filter(product => product.category === selectedCategory);

    return (
      <div className="product-list">
        <h1>Featured Products</h1>
        
        <div className="category-filter">
          {categories.map(category => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => this.handleCategoryChange(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        <div className="products-container">
          {filteredProducts.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <img src={product.image} alt={product.title} />
                <div className="hover-info">
                  <p>{product.description}</p>
                </div>
              </div>
              <div className="product-details">
                <h3>{product.title}</h3>
                <div className="rating">
                  <span className="stars">{this.renderRatingStars(product.rating.rate)}</span>
                  <span className="count">({product.rating.count} reviews)</span>
                </div>
                <p className="category">{product.category}</p>
                <p className="price">${product.price.toFixed(2)}</p>
                <button className="add-to-cart">Add to Cart</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default ProductList;
