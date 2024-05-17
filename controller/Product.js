const {Product} = require('../model/Product');


exports.createproduct= async(req,res)=>{
    const product = new Product(req.body);
    try{
        const doc= await product.save();
        res.status(201).json(doc);
    }catch(err){
        res.status(400).json(err);
    }
}

exports.fetchAllProducts= async(req,res)=>{
    // filter ={category:["smartphones"]}
    // sort = {_sort:"price",_order="desc"}
    // pagination = {_page:1,_limit=10}
    let query = Product.find({deleted:{ $ne: true }});
    let totalProductsQuery= Product.find({deleted:{$ne:true}});

    if(req.query.category){
        query = query.find({ category: req.query.category });
        totalProductsQuery = totalProductsQuery.find({ category: req.query.category });
    }
    if(req.query.brand){
        query = query.find({ brand: req.query.brand });
        totalProductsQuery = totalProductsQuery.find({ brand: req.query.brand });
    }
    if(req.query._sort && req.query._order){
        query = query.sort({ [req.query._sort]: req.query._order });
    }

    const totalDocs= await totalProductsQuery.count().exec();

    if(req.query._page && req.query._limit){
        const pageSize= req.query._limit;
        const page = req.query._page;
        query = query.skip(pageSize * (page - 1)).limit(pageSize);
    }
    

    try{
        const doc= await query.exec();
        res.set('X-Total-Count',totalDocs);
        res.status(200).json(doc);
    }catch(err){
        res.status(400).json(err);
    }
}

exports.fetchProductById= async(req,res)=>{
    try{
        const doc= await Product.findById(req.params.id).exec();
        res.status(200).json(doc);
    }catch(err){
        res.status(400).json(err);
    }
}

exports.updateProduct= async(req,res)=>{
    try{
        // console.log(req.params.id);
        const doc= await Product.findByIdAndUpdate(req.params.id, req.body, {new:true} );
        res.status(200).json(doc);
    }catch(err){
        res.status(400).json(err);
    }
}