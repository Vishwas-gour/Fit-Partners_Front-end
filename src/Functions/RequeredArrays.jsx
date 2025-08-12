// FOR FILTERING SHOES
const brands = ["Nike", "Adidas", "Puma", "Reebok", "Jordan", "Under Armour", "New Balance", "Skechers", "Asics", "Fila", "Converse", "Vans", "Woodland", "Red Tape", "Campus", "Bata"];
const categories = ["Running", "Casual", "Formal", "Sneakers", "Sports", "Hiking", "Training", "Walking", "Sandals", "Loafers", "Boots", "Slip-ons"];
const genders = ["Men", "Women", "Unisex", "Kids"];
const materials = ["Leather", "Mesh", "Canvas", "Synthetic", "Suede", "Knit", "Rubber", "Foam", "Nylon", "Polyester"];

const weights = ["250", "300", "400", "600", "900", "2000"];
const discounts = ["10", "20", "30", "40", "50"];
const prices = ["100-500", "500-1000", "1000-2000", "2000-5000", "5000-10000", "10000+"];
const colors = ["Black", "White", "Red", "Blue", "Green", "Yellow", "Pink", "Purple", "Gray", "Brown", "Orange", "Tan", "Navy", "Maroon", "Teal", "Olive", "Gold", "Silver"];
const sizes = [ "4","5", "6", "7", "8", "9", "10", "11"];
const ratings = ["1", "2", "3", "4"];
const shoeStatus = ["PLACED", "ON_THE_WAY","DELIVERED", "RETURN", "CANCLE"]

// FOR RATITN SHOE 
const ratingArray = [1, 2, 3, 4, 5]; // for product ratign 


// FOR UPLOADING SHOES 


const stepLabels = {
    1: "Basic Details", 2: "Category & Type", 3: "Sizes & Colors", 4: "Images",
};

export { brands, discounts, weights, prices, colors, sizes, categories, genders, shoeStatus, materials, ratings, ratingArray };
export { stepLabels }