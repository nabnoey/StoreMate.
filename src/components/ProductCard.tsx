    type Props = {
  name: string;
  price: number;
  description: string;
  image: string;
};

const ProductCard = ({name,price,description,image}:Props) => {

  return (
    
    <div>
        
        <div className="card bg-white text-black w-85 shadow-sm">
  <figure>
    <img
      src={image}
      alt="Shoes" />
  </figure>
  <div className="card-body">
    <h2 className="card-title">{name}</h2>
    <p>Price: ${price}</p>
    <p>{description}</p>
    <div className="card-actions justify-end">
      <button className="btn btn-primary">Buy Now</button>
    </div>
  </div>
</div></div>
  )
}

export default ProductCard