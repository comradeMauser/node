const colors = require('colors')
const Product = require('../models/product.js')


// /admin/products ==> GET
exports.getProducts = (req, res, next) => {
    Product.find()
        // .select("title price -_id")
        // .populate("userId", "userName")
        .then(products => {
            // console.log(products)
            res.render("admin/products",
                {
                    prods: products,
                    pageTitle: "Admin Panel",
                    path: '/admin/products',
                    isAuthenticated: req.session.isLoggedIn
                })
        }).catch(err => console.log(`getProducts error: ${err}`.brightRed))
}

// /admin/edit-product ==> GET
exports.getAddProduct = (req, res, next) => {
    res.render("admin/edit-product",
        {
            pageTitle: 'Add Product',
            path: '/admin/add-product', //used for highlighting on navigation panel only
            editing: false,
            isAuthenticated: req.session.isLoggedIn
        })
}

// /admin/add-product ==> POST
exports.postAddProduct = (req, res, next) => {
    const title = req.body.title
    const price = req.body.price
    const imageUrl = req.body.imageUrl
    const description = req.body.description
    const product = new Product({
        title,
        price,
        imageUrl,
        description,
        userId: req.session.user // or req.user._id
    })
    product.save()
        .then(result => {
            console.log("product created".brightBlue)
            res.redirect('/admin/products')
        })
        .catch(err => console.log(`postAddProduct error: ${err}`.brightRed))
}

// /admin/edit-product ==> GET
exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit // /edit-product/:productId?edit=true
    if (!editMode) {
        return res.redirect('/')
    }

    const productId = req.params.productId
    Product.findById(productId)
        .then(product => {
            console.log(product)
            if (!product) {
                console.log("Err: product not found")
                res.redirect('/')
            }
            res.render("admin/edit-product",
                {
                    pageTitle: 'edit Product',
                    path: '/admin/products', // used for highlighting on navigation panel only
                    editing: editMode,
                    product,
                    isAuthenticated: req.session.isLoggedIn
                })
        })
}

// /admin/edit-product ==> POST
exports.postEditProduct = (req, res, next) => {
    const productId = req.body.productId

    const updatedTitle = req.body.title
    const updatedPrice = req.body.price
    const updatedImageUrl = req.body.imageUrl
    const updatedDescription = req.body.description

    Product.findById(productId)
        .then(product => {
            product.title = updatedTitle
            product.price = updatedPrice
            product.imageUrl = updatedImageUrl
            product.description = updatedDescription
            return product.save()
        })
        .then(result => {
            res.redirect('/admin/products')
            console.log(`update success`.brightBlue)
        })
        .catch(err => console.log(`update failure: ${err}`.brightRed))
}

// /admin/delete-product ==> POST
exports.postDeleteProduct = (req, res, next) => {
    const productId = req.body.productId
    Product.findByIdAndDelete(productId)
        .then(result => {
            console.log(`DESTROY DESTROY DESTROY!!!`.rainbow)
            res.redirect('/admin/products')

        })
        .catch(err => console.log(`destroing failed`.brightRed))
}