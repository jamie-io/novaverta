package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	_ "github.com/mattn/go-sqlite3"
)

type Product struct {
	ID       int     `json:"id"`
	Name     string  `json:"name"`
	Category int     `json:"category"`
	Price    float32 `json:"price"`
	Stock    int     `json:"stock"`
	Descr    string  `json:"description"`
}

// HTTP handler for /product
func getProductByID(w http.ResponseWriter, r *http.Request) {
	db, err := sql.Open("sqlite3", "./DB/mainDB.db")
	if err != nil {
		http.Error(w, "Database connection failed", http.StatusInternalServerError)
		return
	}
	defer db.Close()

	id := r.URL.Query().Get("product")
	if id == "" {
		http.Error(w, "Missing product ID", http.StatusBadRequest)
		return
	}
	fmt.Println("Getting Product with ID: ", id)
	var p Product
	query := "SELECT id, p_name, p_category, p_price, p_stock, p_desc FROM Products WHERE id = ?"
	err = db.QueryRow(query, id).Scan(&p.ID, &p.Name, &p.Category, &p.Price, &p.Stock, &p.Descr)
	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "Product not found", http.StatusNotFound)
		} else {
			http.Error(w, "Database query error", http.StatusInternalServerError)
		}
		return
	}

	fmt.Print(p)

	// Convert product to JSON
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(p)
}

// Create and initialize the database
func createDB(db *sql.DB) {
	_, err := db.Exec("PRAGMA foreign_keys = ON;")
	if err != nil {
		log.Fatal("Failed to enable foreign keys:", err)
	}

	// Create Categories table
	categoryStmt := `
	CREATE TABLE IF NOT EXISTS Categories (
		id INTEGER NOT NULL UNIQUE PRIMARY KEY AUTOINCREMENT,
		c_name TEXT NOT NULL
	);`
	_, err = db.Exec(categoryStmt)
	if err != nil {
		log.Fatal("Error creating Categories table:", err)
	} else {
		log.Println("Successfully created table Categories!")
	}

	// Create Products table with a foreign key reference to Categories
	productStmt := `
	CREATE TABLE IF NOT EXISTS Products (
		id INTEGER NOT NULL UNIQUE PRIMARY KEY AUTOINCREMENT,
		p_name TEXT NOT NULL,
		p_category INTEGER NOT NULL,
		p_price REAL NOT NULL,
		p_stock INTEGER,
		p_desc TEXT,
		FOREIGN KEY (p_category) REFERENCES Categories(id) ON DELETE CASCADE
	);`
	_, err = db.Exec(productStmt)
	if err != nil {
		log.Fatal("Error creating Products table:", err)
	} else {
		log.Println("Successfully created table Products!")
	}

	insertTestData(db)
}

func insertTestData(db *sql.DB) {
	// Insert Categories
	_, err := db.Exec(`
		INSERT INTO Categories (c_name) VALUES 
		('Electronics'),
		('Books'),
		('Clothing'),
		('Home & Kitchen')
	`)
	if err != nil {
		log.Fatal("Error inserting test categories:", err)
	}

	// Insert Products
	_, err = db.Exec(`
		INSERT INTO Products (p_name, p_category, p_price, p_stock, p_desc) VALUES
		('Smartphone', 1, 699.99, 15, 'Latest model smartphone with 5G support'),
		('Laptop', 1, 1199.99, 8, 'High-performance laptop with 16GB RAM and 512GB SSD'),
		('Headphones', 1, 199.99, 25, 'Noise-cancelling wireless headphones'),
		('Science Fiction Book', 2, 19.99, 50, 'Bestselling sci-fi novel with an engaging story'),
		('T-Shirt', 3, 14.99, 100, 'Comfortable cotton t-shirt available in multiple colors'),
		('Blender', 4, 49.99, 20, 'Powerful kitchen blender with multiple speed settings')
	`)
	if err != nil {
		log.Fatal("Error inserting test products:", err)
	} else {
		log.Println("Test data inserted successfully!")
	}
}

func getProductsAll(w http.ResponseWriter, r *http.Request) {

	db, err := sql.Open("sqlite3", "./DB/mainDB.db")
	if err != nil {
		http.Error(w, "Database connection failed", http.StatusInternalServerError)
		return
	}
	defer db.Close()

	var p_array []Product
	query := "SELECT * FROM Products"
	err = db.QueryRow(query).Scan()
	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "Product not found", http.StatusNotFound)
		} else {
			http.Error(w, "Database query error", http.StatusInternalServerError)
		}
		return
	}
	fmt.Print(p_array)
}

func main() {
	db, err := sql.Open("sqlite3", "./DB/mainDB.db")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	createDB(db)

	// Start HTTP server
	port := "42069"
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Welcome to the webshop!")
	})
	http.HandleFunc("/product", getProductByID)
	http.HandleFunc("/productsAll", getProductsAll)

	fmt.Println("Starting HTTP server at:", port)
	err = http.ListenAndServe(":"+port, nil)
	if err != nil {
		log.Fatal(err)
	}
}
