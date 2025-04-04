'use client'

import React from "react"
import DataTable from "react-data-table-component"
import { useEffect, useState } from "react"

interface User {
    id: number;
    name: string;
    email: string;
    Age: number;
}


const TablePage = () => {

    const data2 = [
        {
            "id": 1,
            "name": "Laptop",
            "description": "14-inch laptop with 8GB RAM and 512GB SSD.",
            "price": 899.99,
            "category": "Electronics",
            "availability": true,
            "brand": "TechBrand",
            "rating": 4.5,
            "image_url": "https://example.com/images/laptop.jpg"
        },
        {
            "id": 2,
            "name": "Smartphone",
            "description": "Latest model with 6.5-inch display, 128GB storage, and 48MP camera.",
            "price": 599.99,
            "category": "Electronics",
            "availability": true,
            "brand": "PhoneCo",
            "rating": 4.3,
            "image_url": "https://example.com/images/smartphone.jpg"
        },
        {
            "id": 3,
            "name": "Wireless Headphones",
            "description": "Noise-cancelling, over-ear headphones with 30-hour battery life.",
            "price": 129.99,
            "category": "Accessories",
            "availability": false,
            "brand": "SoundWave",
            "rating": 4.7,
            "image_url": "https://example.com/images/headphones.jpg"
        },
        {
            "id": 4,
            "name": "Bluetooth Speaker",
            "description": "Portable Bluetooth speaker with 360-degree sound and waterproof design.",
            "price": 79.99,
            "category": "Audio",
            "availability": true,
            "brand": "EchoSound",
            "rating": 4.2,
            "image_url": "https://example.com/images/speaker.jpg"
        },
        {
            "id": 5,
            "name": "Gaming Monitor",
            "description": "27-inch 144Hz refresh rate gaming monitor with ultra-thin bezel.",
            "price": 349.99,
            "category": "Electronics",
            "availability": true,
            "brand": "GameVision",
            "rating": 4.8,
            "image_url": "https://example.com/images/monitor.jpg"
        },
        {
            "id": 6,
            "name": "Coffee Maker",
            "description": "12-cup coffee maker with programmable settings and auto-shutoff.",
            "price": 49.99,
            "category": "Home Appliances",
            "availability": true,
            "brand": "BrewMaster",
            "rating": 4.1,
            "image_url": "https://example.com/images/coffeemaker.jpg"
        },
        {
            "id": 7,
            "name": "Fitness Tracker",
            "description": "Waterproof fitness tracker with heart rate monitoring and sleep tracking.",
            "price": 99.99,
            "category": "Health & Fitness",
            "availability": true,
            "brand": "FitTrack",
            "rating": 4.4,
            "image_url": "https://example.com/images/fitnesstracker.jpg"
        },
        {
            "id": 8,
            "name": "Electric Toothbrush",
            "description": "Rechargeable electric toothbrush with 3 cleaning modes and smart timer.",
            "price": 39.99,
            "category": "Health & Personal Care",
            "availability": true,
            "brand": "CleanTech",
            "rating": 4.6,
            "image_url": "https://example.com/images/toothbrush.jpg"
        }
    ];

    const columns = [
        {
            name: 'Name',
            selector: (row: User) => row.name,
            sortable: true
        },
        {
            name: 'Email',
            selector: (row: User) => row.email,
            sortable: true
        },
        {
            name: 'Age',
            selector: (row: User) => row.Age,
            sortable: true
        }
    ];

    const data: User[] = [
        {
            id: 1,
            name: 'Prasanth',
            email: 'pk3@gmail.com',
            Age: 27
        },
        {
            id: 2,
            name: 'Karthick',
            email: 'kp23@gmail.com',
            Age: 25
        },
        {
            id: 3,
            name: 'Anbu',
            email: 'anbu3@gmail.com',
            Age: 24
        }, {
            id: 4,
            name: 'Prasanth',
            email: 'pk3@gmail.com',
            Age: 27
        },
        {
            id: 5,
            name: 'Karthick',
            email: 'kp23@gmail.com',
            Age: 25
        },
        {
            id: 6,
            name: 'Anbu',
            email: 'anbu3@gmail.com',
            Age: 24
        },
        {
            id: 7,
            name: 'Prasanth',
            email: 'pk3@gmail.com',
            Age: 27
        },
        {
            id: 8,
            name: 'Karthick',
            email: 'kp23@gmail.com',
            Age: 25
        },
        {
            id: 9,
            name: 'Anbu',
            email: 'anbu3@gmail.com',
            Age: 24
        }, {
            id: 10,
            name: 'Prasanth',
            email: 'pk3@gmail.com',
            Age: 27
        },
        {
            id: 11,
            name: 'Karthick',
            email: 'kp23@gmail.com',
            Age: 25
        },
        {
            id: 12,
            name: 'Anbu',
            email: 'anbu3@gmail.com',
            Age: 24
        }
    ];
    
    useEffect(() => {
        setFilteredData(data);
    }, [])
    

    const [filterText, setFilertText] = useState('');
    const [filteredData, setFilteredData] = useState<User []>([]);

    const handleFilter = (filterText: string) => {

        const filteredData = data.filter(user => {
            return (
              user.name.toLowerCase().includes(filterText.toLowerCase()) ||
              user.email.toLowerCase().includes(filterText.toLowerCase()) ||
              user.Age.toString().includes(filterText)
            );
          });

          setFilteredData(filteredData);
   
    }


    return (
        <div className="h-[100-dvh w-full]">
            <div className="text-end pt-5 pr-2">
                <input type="text" className="border border-gary-1 p-2 rounded-lg" onChange={(e) => handleFilter(e.target.value)} value={filterText} />
            </div>
            <DataTable
                columns={columns}
                data={filteredData}
                selectableRows
                fixedHeader
                pagination
            ></DataTable>
        </div>
    )
}

export default TablePage;


