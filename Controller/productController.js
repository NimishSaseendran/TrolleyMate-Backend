const Product = require('../Model/productModel');
const xlsx = require('xlsx');
const fs = require('fs');

exports.getAllProducts = async (req, res) => {
    try {
        const { pkProductId } = req.query;

        // ✅ If pkProductId is provided, return that single product
        if (pkProductId) {
            const product = await Product.findOne({ _id: pkProductId });

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found',
                });
            }

            return res.status(200).json({
                success: true,
                data: product,
            });
        }

        // ✅ Else: fetch paginated list of products
        const skipCount = parseInt(req.query.skipCount) || 0;
        const pageLimit = parseInt(req.query.pageLimit) || 10;

        const totalCount = await Product.countDocuments();
        const products = await Product.find()
            .sort({ dateAddedDate: -1 })
            .skip(skipCount)
            .limit(pageLimit);

        res.status(200).json({
            success: true,
            total: totalCount,
            skipCount,
            pageLimit,
            data: products,
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching products',
        });
    }
};

exports.getSearchedProduct = async (req, res) => {
    try {
        const { searchTerm = '', skipCount = 0, pageLimit = 10 } = req.query;

        // Step 1: Get ALL products (or you can limit to a big number if too many)
        let allProducts = await Product.find().sort({ dateAddedDate: -1 });

        // Step 2: If searchTerm exists, filter in-memory
        if (searchTerm.trim()) {
            const searchWords = searchTerm.trim().toLowerCase().split(/\s+/);

            allProducts = allProducts.filter(product => {
                const nameWords = product.strName?.toLowerCase().split(/\s+/) || [];
                return searchWords.every((word, index) =>
                    nameWords[index]?.startsWith(word)
                );
            });
        }

        // Step 3: Pagination after filtering
        const total = allProducts.length;
        const paginated = allProducts.slice(Number(skipCount), Number(skipCount) + Number(pageLimit));

        return res.status(200).json({
            success: true,
            total,
            skipCount: Number(skipCount),
            pageLimit: Number(pageLimit),
            data: paginated
        });

    } catch (error) {
        console.error('Error in getSearchedProduct:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while searching products'
        });
    }
};


exports.addProduct = async (req, res) => {
    try {
        const productData = req.body;

        // If image is uploaded, set image path
        if (req.file) {
            productData.strImage = `/uploads/${req.file.filename}`;
        }

        const newProduct = new Product(productData);
        const savedProduct = await newProduct.save();

        res.status(201).json({
            message: 'Product added successfully',
            product: savedProduct
        });
    } catch (error) {
        console.error('Error adding product:', error.message);
        res.status(500).json({
            message: 'Failed to add product',
            error: error.message
        });
    }
};

exports.bulkUploadProducts = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Read the Excel file
        const workbook = xlsx.readFile(req.file.path);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = xlsx.utils.sheet_to_json(sheet);

        // Format arrTags (if needed) and assign pkProductId
        const products = jsonData.map(row => {
            if (typeof row.arrTags === 'string') {
                row.arrTags = row.arrTags.split(',').map(tag => tag.trim());
            }
            return row;
        });

        const inserted = await Product.insertMany(products);

        // Clean up uploaded file
        fs.unlinkSync(req.file.path);

        res.status(201).json({
            message: `${inserted.length} products uploaded successfully.`,
            products: inserted
        });

    } catch (error) {
        console.error('Bulk upload error:', error);
        res.status(500).json({ message: 'Bulk upload failed', error: error.message });
    }
};

exports.updateProductById = async (req, res) => {
    try {
        const { pkProductId } = req.params;

        // If file uploaded, replace strImage with file path
        if (req.file) {
            req.body.strImage = `/uploads/${req.file.filename}`;
        }

        const updatedProduct = await Product.findOneAndUpdate(
            { _id: pkProductId },
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        res.json({ success: true, message: 'Product updated successfully', data: updatedProduct });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
