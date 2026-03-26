from database import breed_collection

breeds = [
    {
        "name": "Gir Cow",
        "category": "Cattle",
        "origin": "Gujarat, India",
        "milk_yield": "10–15 L/day",
        "features": ["Curved horns", "Disease resistant", "Red coat"]
    },
    {
        "name": "Sahiwal Cow",
        "category": "Cattle",
        "origin": "Punjab, India",
        "milk_yield": "8–12 L/day",
        "features": ["Docile nature", "Brownish-red coat"]
    },
    {
        "name": "Murrah Buffalo",
        "category": "Buffalo",
        "origin": "Haryana, India",
        "milk_yield": "12–18 L/day",
        "features": ["High fat milk", "Jet black color"]
    },
    {
        "name": "Jaffarabadi Buffalo",
        "category": "Buffalo",
        "origin": "Gujarat, India",
        "milk_yield": "10–14 L/day",
        "features": ["Massive body", "Heavy horns"]
    }
]

breed_collection.insert_many(breeds)
print("Breed data inserted successfully")
