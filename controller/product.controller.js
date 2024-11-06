import Product from "../model/product.model";

export const createProduct = async (req ,res)=>{
    const product = new Product(req.body);
    try{
        const doc = await product.save();
        res.status(201).json(doc);
    } catch(err){
        res.status(400).json(err);
    }
};

// export const getProduct = async (req , res) =>{
//   console.log("hgdsgdsdgukd")
//   try {
//       let {page ,limit ,search} = req.query;

//       page = parseInt(page) || 1;
//       limit = parseInt(limit) || 4;

//       let skip = (page - 1) * limit;
       
//       let searchProduct = {};
//       if(search){
//           searchProduct = {
//               productName: {
//                   $regex : search,
//                   $options: 'i'
//               }

//           }
//       }

//       console.log(page , limit ,search);
//       const totalProducts = await Product.countDocuments(searchProduct);

//       const products = await Product.find(searchProduct)
//             .skip(skip)
//             .limit(limit)
//             .sort({noOfProducts : -1});
//       console.log(products)      

//       const totalPages = Math.ceil(totalProducts / limit);   
//       console.log(totalPages);   
//       res.status(200).json({
//           data:{
//               products,
//               pagination:{
//                   totalProducts,
//                   currentPage: page,
//                   totalPages,
//                   pageSize: limit
//               }
//           }
//       });
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }

// };
export const fetchAllProducts = async (req, res) => {
  let condition = {};
  
  if (!req.query.admin) {
      condition.deleted = { $ne: true };
  }
  
  console.log('Query parameters:', req.query);

  if (req.query.category) {
    const categories = req.query.category.split(',');
    condition.category = { $in: categories };
    // console.log('Categories filter:', categories);
  }
  
  if (req.query.brand) {
    const brands = req.query.brand.split(',');
    condition.brand = { $in: brands };
    // console.log('Brands filter:', brands);
  }

  let query = Product.find(condition);
  let totalProductsQuery = Product.find(condition);
  // console.log("TOTALPRODUCTQUERY" ,totalProductsQuery)

  if (req.query._sort && req.query._order) {
    query = query.sort({ [req.query._sort]: req.query._order });
    // console.log('Sorting by:', req.query._sort, 'Order:', req.query._order);
  }

  const totalDocs = await totalProductsQuery.countDocuments().exec();

  // console.log({ totalDocs });

  if (req.query._page && req.query._limit) {
    const pageSize = parseInt(req.query._limit, 10);
    const page = parseInt(req.query._page, 10);
    query = query.skip(pageSize * (page - 1)).limit(pageSize);
    // console.log(`Pagination - Page: ${page}, Limit: ${pageSize}`);
  }
  try {
    const docs = await query.exec();
    // console.log("DOcs",docs)
    const data = {products: docs, count:totalDocs}
    res.set('X-Total-Count', totalDocs);
    res.status(200).json(data);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(400).json(err);
  }
};

export const getProductById = async(req,res)=>{
  const {_id} = req.params;

  try{
    const product = await Product.findById(_id);
    res.status(200).json(product);
  } catch(err){
    res.status(400).json(err)
  }
}


export const updateProduct = async (req, res) => {
  const { id } = req.params;

  try {
      // Find and update the product
      const product = await Product.findByIdAndUpdate(id, req.body, { new: true });

      // Check if the product was found
      if (!product) {
          return res.status(404).json({ message: "Product not found." });
      }

      // Calculate discount price
      if (product.price && product.discountPercentage !== undefined) {
          product.discountPrice = Math.round(product.price * (1 - product.discountPercentage / 100));
      } else {
          return res.status(400).json({ message: "Price and discount percentage are required." });
      }

      // Save the updated product
      const updatedProduct = await product.save();
      res.status(200).json(updatedProduct);
  } catch (err) {
      console.error(err); // Log the error for debugging
      res.status(400).json({ message: "Error updating product", error: err });
  }
};

export const getAllProduct = async (req, res) => {
  try {
      const products = await Product.find(); // Fetch all products
      res.status(200).json(products); // Return products in JSON format
  } catch (err) {
      console.error(err); // Log the error for debugging
      res.status(500).json({ message: "Internal Server Error" }); // Return a 500 status if there's an error
  }
}