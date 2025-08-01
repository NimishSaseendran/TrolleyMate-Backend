const Category = require('../Model/categoryModel');

// Create a new category
exports.createCategory = async (req, res) => {
    try {
        const { categoryName, categorySlug, categoryDescription, tags, isActive } = req.body;

        if (!categoryName || categoryName.trim() === '') {
            return res.status(400).json({ message: 'Category name is required' });
        }

        const newCategory = new Category({
            categoryName,
            categorySlug: categorySlug || categoryName.toLowerCase().replace(/\s+/g, '-'),
            categoryDescription,
            categoryImage: req.file ? req.file.path : null, // uploaded file path
            tags: tags ? JSON.parse(tags) : [], // if tags sent as JSON string
            isActive: typeof isActive !== 'undefined' ? isActive === 'true' : true
        });

        const savedCategory = await newCategory.save();

        res.status(201).json({
            message: 'Category created successfully',
            data: savedCategory,
        });
    } catch (err) {
        console.error('Error creating category:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.getAllCategories = async (req, res) => {
    try {
        const skipCount = parseInt(req.query.skipCount) || 0;
        const pageLimit = parseInt(req.query.pageLimit) || 10;

        const [categories, total] = await Promise.all([
            Category.find()
                .sort({ createdAt: -1 })
                .skip(skipCount)
                .limit(pageLimit),
            Category.countDocuments()
        ]);

        res.status(200).json({
            success: true,
            message: 'Categories fetched successfully',
            data: categories,
            total,
            skipCount,
            pageLimit
        });
    } catch (error) {
        console.error('Error fetching categories with pagination:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
        });
    }
};