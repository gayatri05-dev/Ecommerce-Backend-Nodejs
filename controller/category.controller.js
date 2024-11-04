import Category from "../model/Category";

// Get all categories
export const getCategory = async (req, res) => {
    try {
        const categories = await Category.find({}).exec();
        res.status(200).json(categories);
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({ message: "Internal Server Error" }); // Use 500 for server errors
    }
};

// Add a new category
export const addCategory = async (req, res) => {
    const category = new Category(req.body);

    // // Optionally validate the incoming data here
    // if (!category.name) { // Assuming 'name' is a required field
    //     return res.status(400).json({ message: "Category name is required." });
    // }

    try {
        const doc = await category.save();
        res.status(201).json(doc);
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(400).json({ message: "Error saving category", error: err }); // Provide more context
    }
};
