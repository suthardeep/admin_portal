import { Product, ProductRequest } from "../types/product";

export const productRequests: ProductRequest[] = [
  {
    sku: 238474,
    name: "OnePlus 7Pro",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1510552776732-03e61cf4b144?q=80&auto=format&fit=crop&w=100",
    basePrice: 49.9,
    requestDate: "2024-01-15",
    vendor: "Tech Solutions Inc"
  },
  {
    sku: 659854,
    name: "Magic Mouse",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b7f1?q=80&auto=format&fit=crop&w=100",
    basePrice: 79.99,
    requestDate: "2024-01-14",
    vendor: "Apple Distributors"
  },
  {
    sku: 854763,
    name: "Wooden Chair",
    category: "Home Decor",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&auto=format&fit=crop&w=100",
    basePrice: 129.99,
    requestDate: "2024-01-13",
    vendor: "Furniture Wholesale"
  },
  {
    sku: 652354,
    name: "Air Jordan",
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&auto=format&fit=crop&w=100",
    basePrice: 189.99,
    requestDate: "2024-01-12",
    vendor: "Sneaker Hub"
  },
  {
    sku: 152456,
    name: "Nintendo Switch",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1580910051074-3eb694886b09?q=80&auto=format&fit=crop&w=100",
    basePrice: 299.99,
    requestDate: "2024-01-11",
    vendor: "Gaming World"
  },
  {
    sku: 152207,
    name: "Apple Watch",
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1543165796-5426273eaab3?q=80&auto=format&fit=crop&w=100",
    basePrice: 399.99,
    requestDate: "2024-01-10",
    vendor: "Smart Tech Co"
  },
  {
    sku: 63528,
    name: "Samsung Note 10",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&auto=format&fit=crop&w=100",
    basePrice: 449.99,
    requestDate: "2024-01-09",
    vendor: "Mobile Traders"
  },
  {
    sku: 32280,
    name: "Designer Sunglasses",
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&auto=format&fit=crop&w=100",
    basePrice: 159.99,
    requestDate: "2024-01-08",
    vendor: "Fashion Imports"
  },
  {
    sku: 478392,
    name: "Gaming Laptop",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1588872657840-218e412ee62e?q=80&auto=format&fit=crop&w=100",
    basePrice: 899.99,
    requestDate: "2024-01-07",
    vendor: "Tech Solutions Inc"
  },
  {
    sku: 891234,
    name: "Wireless Headphones",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&auto=format&fit=crop&w=100",
    basePrice: 149.99,
    requestDate: "2024-01-06",
    vendor: "Audio Pro"
  },
  {
    sku: 567890,
    name: "Mechanical Keyboard",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&auto=format&fit=crop&w=100",
    basePrice: 89.99,
    requestDate: "2024-01-05",
    vendor: "Gaming World"
  },
  {
    sku: 345678,
    name: "Coffee Table",
    category: "Home Decor",
    image: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?q=80&auto=format&fit=crop&w=100",
    basePrice: 199.99,
    requestDate: "2024-01-04",
    vendor: "Furniture Wholesale"
  },
  {
    sku: 234567,
    name: "Smart Speaker",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1543512214-318c7553f230?q=80&auto=format&fit=crop&w=100",
    basePrice: 79.99,
    requestDate: "2024-01-03",
    vendor: "Smart Tech Co"
  },
  {
    sku: 123456,
    name: "Leather Backpack",
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&auto=format&fit=crop&w=100",
    basePrice: 119.99,
    requestDate: "2024-01-02",
    vendor: "Fashion Imports"
  },
  {
    sku: 987654,
    name: "Desk Lamp",
    category: "Home Decor",
    image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&auto=format&fit=crop&w=100",
    basePrice: 45.99,
    requestDate: "2024-01-01",
    vendor: "Furniture Wholesale"
  }
];



export const products : Product [] = [
  {
    sku: 238474,
    name: "OnePlus 7Pro",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1510552776732-03e61cf4b144?q=80&auto=format&fit=crop&w=100",
    basePrice: 49.9,
    lastUpdate: "2024-01-15",
  },
  {
    sku: 659854,
    name: "Magic Mouse",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b7f1?q=80&auto=format&fit=crop&w=100",
    basePrice: 79.99,
    lastUpdate: "2024-01-14",
  },
  {
    sku: 854763,
    name: "Wooden Chair",
    category: "Home Decor",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&auto=format&fit=crop&w=100",
    basePrice: 129.99,
    lastUpdate: "2024-01-13",
  },
  {
    sku: 652354,
    name: "Air Jordan",
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&auto=format&fit=crop&w=100",
    basePrice: 189.99,
    lastUpdate: "2024-01-12",
  },
  {
    sku: 152456,
    name: "Nintendo Switch",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1580910051074-3eb694886b09?q=80&auto=format&fit=crop&w=100",
    basePrice: 299.99,
    lastUpdate: "2024-01-11",
  },
  {
    sku: 152207,
    name: "Apple Watch",
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1543165796-5426273eaab3?q=80&auto=format&fit=crop&w=100",
    basePrice: 399.99,
    lastUpdate: "2024-01-10",
  },
  {
    sku: 63528,
    name: "Samsung Note 10",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&auto=format&fit=crop&w=100",
    basePrice: 449.99,
    lastUpdate: "2024-01-09",
  },
  {
    sku: 32280,
    name: "Designer Sunglasses",
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&auto=format&fit=crop&w=100",
    basePrice: 159.99,
    lastUpdate: "2024-01-08",
  },
  {
    sku: 478392,
    name: "Gaming Laptop",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1588872657840-218e412ee62e?q=80&auto=format&fit=crop&w=100",
    basePrice: 899.99,
    lastUpdate: "2024-01-07",
  },
  {
    sku: 891234,
    name: "Wireless Headphones",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&auto=format&fit=crop&w=100",
    basePrice: 149.99,
    lastUpdate: "2024-01-06",
  },
  {
    sku: 567890,
    name: "Mechanical Keyboard",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&auto=format&fit=crop&w=100",
    basePrice: 89.99,
    lastUpdate: "2024-01-05",
  },
  {
    sku: 345678,
    name: "Coffee Table",
    category: "Home Decor",
    image: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?q=80&auto=format&fit=crop&w=100",
    basePrice: 199.99,
    lastUpdate: "2024-01-04",
  },
  {
    sku: 234567,
    name: "Smart Speaker",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1543512214-318c7553f230?q=80&auto=format&fit=crop&w=100",
    basePrice: 79.99,
    lastUpdate: "2024-01-03",
  },
  {
    sku: 123456,
    name: "Leather Backpack",
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&auto=format&fit=crop&w=100",
    basePrice: 119.99,
    lastUpdate: "2024-01-02",
  },

];
