import { useSearchParams } from "react-router-dom"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "../../redux/store"
import { search } from "../../redux/products/productReducer"
import ProductCard from "../../components/user/ProductCard"

const SearchPage = () => {
  const [searchParams] = useSearchParams()
  const keyword = searchParams.get("keyword") || ""

  const dispatch = useDispatch<AppDispatch>()

  const searchResult = useSelector((state: RootState) => state.products.searchResult)

  useEffect(() => {
    if (keyword.trim() !== "") {
      dispatch(search(keyword))
    }
  }, [keyword, dispatch])

  return (
    <div id="search-page-container" className="w-full mt-10 px-28">
      <h2 id="search-title" className="text-3xl font-bold mb-6 text-black">
        ผลการค้นหา: {keyword}
      </h2>

      {searchResult.length === 0 ? (
        <p id="search-empty-message" className="text-gray-500 text-center text-[24px] mt-18">
          ไม่พบสินค้าที่คุณค้นหา
        </p>
      ) : (
        <div id="search-results-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {searchResult.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchPage