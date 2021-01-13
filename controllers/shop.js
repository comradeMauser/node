const Product = require('../models/product.js')
const Cart = require('../models/cart')

// for all products
exports.getProducts = (req, res, next) => {
    Product.fetchAll(products => {
        res.render("shop/product-list",
            {
                prods: products,
                pageTitle: "All products",
                path: '/products',
            })
    })
}

//for single product
exports.getProduct = (req, res, next) => {
    const productId = req.params.productId
    Product.findById(productId, product => {
        res.render('shop/product-details',
            {
                product: product,
                pageTitle: product.title,
                path: '/products/:productId'
            })
    })
}

//for main page
exports.getIndex = (req, res, next) => {
    Product.fetchAll(products => {
        res.render("shop/index",
            {
                prods: products,
                pageTitle: "Main",
                path: '/shop',
            })
    })
}

// will return cart items
exports.getCart = (req, res, next) => {
    Cart.getCart(cart => {
        Product.fetchAll(products => {
            const cartProducts = []
            for (product of products) {
                const cartProductData = cart.products.find(prod => prod.id === product.id)
                if (cartProductData) {
                    cartProducts.push({productData: product, qty: cartProductData.qty})
                }
            }
            res.render("shop/cart",
                {
                    pageTitle: "Cart",
                    path: '/cart',
                    products: cartProducts
                })
        })
    })
}

// adding product/updating cart
exports.postCart = (req, res, next) => {
    const productId = req.body.productId
    Product.findById(productId, (product) => {
        Cart.addProduct(productId, product.price)
    })
    res.redirect('/products')
}

//deleting product from cart
exports.postDeleteCartProd = (req, res, next) => {
    const productId = req.body.productId
    Product.findById(productId, product => {
        Cart.deleteProduct(productId, product.price)
        res.redirect('/cart')
    })
}

// 3ambI4ka - plug
exports.getCheckout = (req, res, next) => {
    res.render("shop/checkout",
        {
            pageTitle: "Checkout",
            path: '/checkout',
        })
}

// 3ambI4ka - plug
exports.getOrders = (req, res, next) => {
    res.render("shop/orders",
        {
            pageTitle: "Orders",
            path: '/orders',
        })
}