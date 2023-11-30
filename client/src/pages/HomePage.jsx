import SearchBar from "../components/searchBar";
import Slideshow from "../components/slideShow";
// import CartBtn from "../components/cart";
import ProductCard from "../components/productCard";
import { useQuery } from '@apollo/client';
import { QUERY_PRODUCTS } from "../utils/queries";
import Cart from '../components/Cart/index'
import { useStoreContext } from "../utils/GlobalState";
import { idbPromise } from "../utils/helpers";
import { UPDATE_PRODUCTS } from "../utils/actions";
import { useEffect } from "react";
import CategoryMenu from "../components/CategoryMenu";


export default function HomePage() {
  

  // if (loading) {
  //   return <p>Loading...</p>;
  // }

  // if (error) {
  //   return <p>Error: {error.message}</p>;
  // }
  const [state, dispatch] = useStoreContext();

  const { currentCategory } = state;

  // const { loading, data } = useQuery(QUERY_PRODUCTS);
  const { data, loading, error } = useQuery(QUERY_PRODUCTS);

  useEffect(() => {
    if (data) {
      dispatch({
        type: UPDATE_PRODUCTS,
        products: data.products,
      });
      data.products.forEach((product) => {
        idbPromise('products', 'put', product);
      });
    } else if (!loading) {
      idbPromise('products', 'get').then((products) => {
        dispatch({
          type: UPDATE_PRODUCTS,
          products: products,
        });
      });
    }
  }, [data, loading, dispatch]);

  function filterProducts() {
    if (!currentCategory) {
      return state.products;
    }

    return state.products.filter(
      (product) => product.category._id === currentCategory
    );
  }

  // const productData = data?.products || [];

  return (
    <>
      <div>
        <SearchBar />
        <Cart />
        <Slideshow />
        <CategoryMenu/>
      </div>
      <div className='flex-container'>
        {
          filterProducts().map((product) => (
            <ProductCard
              key={product.productId}
              _id={product._id}
              productName={product.productName}
              price={product.price}
              quantity={product.quantity}
              description={product.description}
              image={product.image}
            />
          ))}
      </div>
    </>
  );
}