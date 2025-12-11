// import { useState } from 'react';
// import axios from 'axios';
// import './StationSearch.css';

// const StationSearch = () => {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [searchResults, setSearchResults] = useState([]);
//   const [selectedStation, setSelectedStation] = useState(null);
//   const [restaurants, setRestaurants] = useState([]);
//   const [selectedRestaurant, setSelectedRestaurant] = useState(null);
//   const [restaurantMenu, setRestaurantMenu] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const searchStations = async () => {
//     if (!searchQuery.trim()) return;

//     setLoading(true);
//     setError('');
//     try {
//       // Try multiple search approaches
//       let location = null;

//       // First try: direct geocode with station name
//       try {
//         const geocodeResponse = await axios.get(
//           `${import.meta.env.VITE_API_URL}/geocode?address=${encodeURIComponent(searchQuery.trim())}`
//         );

//         if (geocodeResponse.data.results && geocodeResponse.data.results.length > 0) {
//           location = geocodeResponse.data.results[0].geometry.location;
//         }
//       } catch (geocodeErr) {
//         console.log('Direct geocode failed, trying with railway station suffix');
//       }

//       // Second try: geocode with "railway station" suffix
//       if (!location) {
//         try {
//           const geocodeResponse = await axios.get(
//             `${import.meta.env.VITE_API_URL}/geocode?address=${encodeURIComponent(searchQuery.trim() + ' railway station')}`
//           );

//           if (geocodeResponse.data.results && geocodeResponse.data.results.length > 0) {
//             location = geocodeResponse.data.results[0].geometry.location;
//           }
//         } catch (geocodeErr) {
//           console.log('Railway station geocode failed, trying with station suffix');
//         }
//       }

//       // Third try: geocode with just "station" suffix
//       if (!location) {
//         try {
//           const geocodeResponse = await axios.get(
//             `${import.meta.env.VITE_API_URL}/geocode?address=${encodeURIComponent(searchQuery.trim() + ' station')}`
//           );

//           if (geocodeResponse.data.results && geocodeResponse.data.results.length > 0) {
//             location = geocodeResponse.data.results[0].geometry.location;
//           }
//         } catch (geocodeErr) {
//           console.log('Station geocode failed');
//         }
//       }

//       if (location) {
//         // Get stations with restaurants near this location
//         const stationsResponse = await axios.get(
//           `${import.meta.env.VITE_API_URL}/stations-with-restaurants?lat=${location.lat}&lng=${location.lng}&stationLimit=5&restaurantRadius=800`
//         );

//         const stations = stationsResponse.data.stations || [];
//         if (stations.length > 0) {
//           setSearchResults(stations);
//         } else {
//           setError('No train stations found in this area. Try a different location or city name.');
//         }
//       } else {
//         // Fallback: Show realistic sample data for demonstration
//         console.log('API not available, showing realistic sample data');

//         // Filter sample data based on search query
//         const allSampleStations = [
//           {
//             station: {
//               name: 'Colombo Fort Railway Station',
//               vicinity: 'Colombo Fort, Colombo',
//               location: { lat: 6.9271, lng: 79.8612 }
//             },
//             restaurants: [
//               {
//                 name: 'Ministry of Crab',
//                 vicinity: 'Colombo Fort',
//                 rating: 4.5,
//                 user_ratings_total: 1200,
//                 opening_hours: { open_now: true }
//               },
//               {
//                 name: 'The Dutch Hospital',
//                 vicinity: 'Colombo Fort',
//                 rating: 4.2,
//                 user_ratings_total: 800,
//                 opening_hours: { open_now: true }
//               },
//               {
//                 name: 'Nandos Colombo',
//                 vicinity: 'Colombo Fort',
//                 rating: 4.0,
//                 user_ratings_total: 650,
//                 opening_hours: { open_now: false }
//               },
//               {
//                 name: 'Pizza Hut Colombo Fort',
//                 vicinity: 'Colombo Fort',
//                 rating: 3.8,
//                 user_ratings_total: 450,
//                 opening_hours: { open_now: true }
//               },
//               {
//                 name: 'KFC Colombo Fort',
//                 vicinity: 'Colombo Fort',
//                 rating: 3.9,
//                 user_ratings_total: 320,
//                 opening_hours: { open_now: true }
//               }
//             ]
//           },
//           {
//             station: {
//               name: 'Maradana Railway Station',
//               vicinity: 'Maradana, Colombo',
//               location: { lat: 6.9271, lng: 79.8612 }
//             },
//             restaurants: [
//               {
//                 name: 'Pizza Hut Maradana',
//                 vicinity: 'Maradana',
//                 rating: 3.8,
//                 user_ratings_total: 450,
//                 opening_hours: { open_now: true }
//               },
//               {
//                 name: 'KFC Maradana',
//                 vicinity: 'Maradana',
//                 rating: 3.9,
//                 user_ratings_total: 320,
//                 opening_hours: { open_now: true }
//               }
//             ]
//           },
//           {
//             station: {
//               name: 'Jaffna Railway Station',
//               vicinity: 'Jaffna',
//               location: { lat: 9.6615, lng: 80.0255 }
//             },
//             restaurants: [
//               {
//                 name: 'Hotel Rolex Jaffna',
//                 vicinity: 'Jaffna Town',
//                 rating: 4.1,
//                 user_ratings_total: 420,
//                 opening_hours: { open_now: true }
//               },
//               {
//                 name: 'Rio Ice Cream Jaffna',
//                 vicinity: 'Jaffna',
//                 rating: 4.3,
//                 user_ratings_total: 385,
//                 opening_hours: { open_now: true }
//               },
//               {
//                 name: 'Jaffna Food Court',
//                 vicinity: 'Jaffna',
//                 rating: 3.9,
//                 user_ratings_total: 295,
//                 opening_hours: { open_now: true }
//               },
//               {
//                 name: 'Seafood Paradise Jaffna',
//                 vicinity: 'Jaffna',
//                 rating: 4.2,
//                 user_ratings_total: 340,
//                 opening_hours: { open_now: false }
//               },
//               {
//                 name: 'Pizza Corner Jaffna',
//                 vicinity: 'Jaffna Town',
//                 rating: 3.8,
//                 user_ratings_total: 265,
//                 opening_hours: { open_now: true }
//               }
//             ]
//           },
//           {
//             station: {
//               name: 'Navatkuli Railway Station',
//               vicinity: 'Navatkuli, Jaffna',
//               location: { lat: 9.7167, lng: 80.0833 }
//             },
//             restaurants: [
//               {
//                 name: 'Navatkuli Food Corner',
//                 vicinity: 'Navatkuli',
//                 rating: 3.8,
//                 user_ratings_total: 95,
//                 opening_hours: { open_now: true }
//               },
//               {
//                 name: 'Northern Spice Navatkuli',
//                 vicinity: 'Navatkuli',
//                 rating: 4.0,
//                 user_ratings_total: 120,
//                 opening_hours: { open_now: true }
//               }
//             ]
//           },
//           {
//             station: {
//               name: 'Kaithady Railway Station',
//               vicinity: 'Kaithady, Jaffna',
//               location: { lat: 9.7000, lng: 80.0667 }
//             },
//             restaurants: [
//               {
//                 name: 'Kaithady Restaurant',
//                 vicinity: 'Kaithady',
//                 rating: 3.9,
//                 user_ratings_total: 85,
//                 opening_hours: { open_now: true }
//               },
//               {
//                 name: 'Jaffna Curry House Kaithady',
//                 vicinity: 'Kaithady',
//                 rating: 4.1,
//                 user_ratings_total: 145,
//                 opening_hours: { open_now: false }
//               }
//             ]
//           },
//           {
//             station: {
//               name: 'Chavakachcheri Railway Station',
//               vicinity: 'Chavakachcheri, Jaffna',
//               location: { lat: 9.6833, lng: 80.1333 }
//             },
//             restaurants: [
//               {
//                 name: 'KFC Chavakachcheri',
//                 vicinity: 'Chavakachcheri Town',
//                 rating: 3.9,
//                 user_ratings_total: 285,
//                 opening_hours: { open_now: true }
//               },
//               {
//                 name: 'Lovely Hotel Chavakachcheri',
//                 vicinity: 'Chavakachcheri',
//                 rating: 4.1,
//                 user_ratings_total: 195,
//                 opening_hours: { open_now: true }
//               },
//               {
//                 name: 'NKD Restaurant Chavakachcheri',
//                 vicinity: 'Chavakachcheri',
//                 rating: 4.0,
//                 user_ratings_total: 145,
//                 opening_hours: { open_now: true }
//               },
//               {
//                 name: 'KBC Food Court Chavakachcheri',
//                 vicinity: 'Chavakachcheri',
//                 rating: 3.8,
//                 user_ratings_total: 220,
//                 opening_hours: { open_now: false }
//               },
//               {
//                 name: 'Jaffna Curry House Chavakachcheri',
//                 vicinity: 'Chavakachcheri',
//                 rating: 4.2,
//                 user_ratings_total: 175,
//                 opening_hours: { open_now: true }
//               },
//               {
//                 name: 'Northern Spice Chavakachcheri',
//                 vicinity: 'Chavakachcheri',
//                 rating: 3.7,
//                 user_ratings_total: 135,
//                 opening_hours: { open_now: true }
//               }
//             ]
//           },
//           {
//             station: {
//               name: 'Meesalai Railway Station',
//               vicinity: 'Meesalai, Jaffna',
//               location: { lat: 9.6667, lng: 80.1500 }
//             },
//             restaurants: [
//               {
//                 name: 'Meesalai Restaurant',
//                 vicinity: 'Meesalai',
//                 rating: 3.8,
//                 user_ratings_total: 75,
//                 opening_hours: { open_now: true }
//               },
//               {
//                 name: 'Coastal Kitchen Meesalai',
//                 vicinity: 'Meesalai',
//                 rating: 4.2,
//                 user_ratings_total: 95,
//                 opening_hours: { open_now: false }
//               }
//             ]
//           },
//           {
//             station: {
//               name: 'Sangaththanai Railway Station',
//               vicinity: 'Sangaththanai, Jaffna',
//               location: { lat: 9.6500, lng: 80.1667 }
//             },
//             restaurants: [
//               {
//                 name: 'Sangaththanai Food Hub',
//                 vicinity: 'Sangaththanai',
//                 rating: 3.9,
//                 user_ratings_total: 60,
//                 opening_hours: { open_now: true }
//               }
//             ]
//           },
//           {
//             station: {
//               name: 'Kodikamam Railway Station',
//               vicinity: 'Kodikamam, Jaffna',
//               location: { lat: 9.6333, lng: 80.1833 }
//             },
//             restaurants: [
//               {
//                 name: 'Kodikamam Eatery',
//                 vicinity: 'Kodikamam',
//                 rating: 3.7,
//                 user_ratings_total: 45,
//                 opening_hours: { open_now: true }
//               }
//             ]
//           },
//           {
//             station: {
//               name: 'Mirusuvil Railway Station',
//               vicinity: 'Mirusuvil, Jaffna',
//               location: { lat: 9.6167, lng: 80.2000 }
//             },
//             restaurants: [
//               {
//                 name: 'Mirusuvil Restaurant',
//                 vicinity: 'Mirusuvil',
//                 rating: 3.8,
//                 user_ratings_total: 55,
//                 opening_hours: { open_now: true }
//               }
//             ]
//           },
//           {
//             station: {
//               name: 'Eluthumadduval Railway Station',
//               vicinity: 'Eluthumadduval, Jaffna',
//               location: { lat: 9.6000, lng: 80.2167 }
//             },
//             restaurants: [
//               {
//                 name: 'Eluthumadduval Food Corner',
//                 vicinity: 'Eluthumadduval',
//                 rating: 3.6,
//                 user_ratings_total: 40,
//                 opening_hours: { open_now: true }
//               }
//             ]
//           },
//           {
//             station: {
//               name: 'Kilinochchi Railway Station',
//               vicinity: 'Kilinochchi',
//               location: { lat: 9.3961, lng: 80.3982 }
//             },
//             restaurants: [
//               {
//                 name: 'Hotel Swiss Kilinochchi',
//                 vicinity: 'Kilinochchi Town',
//                 rating: 3.9,
//                 user_ratings_total: 185,
//                 opening_hours: { open_now: true }
//               },
//               {
//                 name: 'Northern Restaurant Kilinochchi',
//                 vicinity: 'Kilinochchi',
//                 rating: 4.0,
//                 user_ratings_total: 145,
//                 opening_hours: { open_now: true }
//               },
//               {
//                 name: 'Kilinochchi Food Corner',
//                 vicinity: 'Kilinochchi',
//                 rating: 3.7,
//                 user_ratings_total: 120,
//                 opening_hours: { open_now: true }
//               },
//               {
//                 name: 'Vanni Curry House',
//                 vicinity: 'Kilinochchi Town',
//                 rating: 4.1,
//                 user_ratings_total: 95,
//                 opening_hours: { open_now: false }
//               }
//             ]
//           },
//           {
//             station: {
//               name: 'Anaiyiravu Railway Station',
//               vicinity: 'Anaiyiravu, Kilinochchi',
//               location: { lat: 9.4167, lng: 80.3833 }
//             },
//             restaurants: [
//               {
//                 name: 'Anaiyiravu Restaurant',
//                 vicinity: 'Anaiyiravu',
//                 rating: 3.6,
//                 user_ratings_total: 45,
//                 opening_hours: { open_now: true }
//               }
//             ]
//           },
//           {
//             station: {
//               name: 'Palai Railway Station',
//               vicinity: 'Palai, Kilinochchi',
//               location: { lat: 9.4333, lng: 80.3667 }
//             },
//             restaurants: [
//               {
//                 name: 'Palai Food Corner',
//                 vicinity: 'Palai',
//                 rating: 3.8,
//                 user_ratings_total: 65,
//                 opening_hours: { open_now: true }
//               }
//             ]
//           },
//           {
//             station: {
//               name: 'Paranthan Railway Station',
//               vicinity: 'Paranthan, Kilinochchi',
//               location: { lat: 9.4500, lng: 80.3500 }
//             },
//             restaurants: [
//               {
//                 name: 'Paranthan Eatery',
//                 vicinity: 'Paranthan',
//                 rating: 3.7,
//                 user_ratings_total: 55,
//                 opening_hours: { open_now: true }
//               },
//               {
//                 name: 'Northern Kitchen Paranthan',
//                 vicinity: 'Paranthan',
//                 rating: 3.9,
//                 user_ratings_total: 80,
//                 opening_hours: { open_now: false }
//               }
//             ]
//           },
//           {
//             station: {
//               name: 'Ariviyalnagar Railway Station',
//               vicinity: 'Ariviyalnagar, Kilinochchi',
//               location: { lat: 9.4667, lng: 80.3333 }
//             },
//             restaurants: [
//               {
//                 name: 'Ariviyalnagar Restaurant',
//                 vicinity: 'Ariviyalnagar',
//                 rating: 3.8,
//                 user_ratings_total: 50,
//                 opening_hours: { open_now: true }
//               }
//             ]
//           },
//           {
//             station: {
//               name: 'Murugandy Railway Station',
//               vicinity: 'Murugandy, Kilinochchi',
//               location: { lat: 9.4833, lng: 80.3167 }
//             },
//             restaurants: [
//               {
//                 name: 'Murugandy Food Hub',
//                 vicinity: 'Murugandy',
//                 rating: 3.9,
//                 user_ratings_total: 70,
//                 opening_hours: { open_now: true }
//               }
//             ]
//           },
//           {
//             station: {
//               name: 'Kandy Railway Station',
//               vicinity: 'Kandy',
//               location: { lat: 7.2906, lng: 80.6337 }
//             },
//             restaurants: [
//               {
//                 name: 'Queens Hotel Kandy',
//                 vicinity: 'Kandy',
//                 rating: 4.4,
//                 user_ratings_total: 890,
//                 opening_hours: { open_now: true }
//               },
//               {
//                 name: 'Cafe Kandy',
//                 vicinity: 'Kandy Town',
//                 rating: 4.1,
//                 user_ratings_total: 320,
//                 opening_hours: { open_now: true }
//               },
//               {
//                 name: 'Sri Lankan Curry House',
//                 vicinity: 'Kandy',
//                 rating: 4.2,
//                 user_ratings_total: 450,
//                 opening_hours: { open_now: false }
//               }
//             ]
//           },
//           {
//             station: {
//               name: 'Galle Railway Station',
//               vicinity: 'Galle',
//               location: { lat: 6.0329, lng: 80.2168 }
//             },
//             restaurants: [
//               {
//                 name: 'Galle Fort Hotel',
//                 vicinity: 'Galle Fort',
//                 rating: 4.6,
//                 user_ratings_total: 1200,
//                 opening_hours: { open_now: true }
//               },
//               {
//                 name: 'Seafood Paradise Galle',
//                 vicinity: 'Galle',
//                 rating: 4.3,
//                 user_ratings_total: 380,
//                 opening_hours: { open_now: true }
//               }
//             ]
//           },
//           {
//             station: {
//               name: 'Anuradhapura Railway Station',
//               vicinity: 'Anuradhapura',
//               location: { lat: 8.3114, lng: 80.4037 }
//             },
//             restaurants: [
//               {
//                 name: 'Ancient City Restaurant',
//                 vicinity: 'Anuradhapura',
//                 rating: 3.9,
//                 user_ratings_total: 220,
//                 opening_hours: { open_now: true }
//               },
//               {
//                 name: 'Sri Lankan Traditional Food',
//                 vicinity: 'Anuradhapura Town',
//                 rating: 4.0,
//                 user_ratings_total: 180,
//                 opening_hours: { open_now: false }
//               }
//             ]
//           },
//           {
//             station: {
//               name: 'Trincomalee Railway Station',
//               vicinity: 'Trincomalee',
//               location: { lat: 8.5874, lng: 81.2152 }
//             },
//             restaurants: [
//               {
//                 name: 'Trinco Seafood',
//                 vicinity: 'Trincomalee',
//                 rating: 4.2,
//                 user_ratings_total: 290,
//                 opening_hours: { open_now: true }
//               },
//               {
//                 name: 'Beach View Restaurant',
//                 vicinity: 'Trincomalee',
//                 rating: 4.1,
//                 user_ratings_total: 340,
//                 opening_hours: { open_now: true }
//               }
//             ]
//           }
//         ];

//         // Filter stations based on search query
//         const query = searchQuery.toLowerCase();
//         const filteredStations = allSampleStations.filter(station =>
//           station.station.name.toLowerCase().includes(query) ||
//           station.station.vicinity.toLowerCase().includes(query)
//         );

//         // If no matches, show all stations
//         const sampleStations = filteredStations.length > 0 ? filteredStations : allSampleStations.slice(0, 3);

//         setSearchResults(sampleStations);
//         setError(''); // Clear error since we're showing sample data
//       }
//     } catch (err) {
//       console.error('Search error:', err);
//       // Show sample data as fallback
//       const sampleStations = [
//         {
//           station: {
//             name: 'Colombo Fort Railway Station',
//             vicinity: 'Colombo Fort, Colombo',
//             location: { lat: 6.9271, lng: 79.8612 }
//           },
//           restaurants: [
//             {
//               name: 'Ministry of Crab',
//               vicinity: 'Colombo Fort',
//               rating: 4.5,
//               user_ratings_total: 1200,
//               opening_hours: { open_now: true }
//             },
//             {
//               name: 'The Dutch Hospital',
//               vicinity: 'Colombo Fort',
//               rating: 4.2,
//               user_ratings_total: 800,
//               opening_hours: { open_now: true }
//             }
//           ]
//         },
//         {
//           station: {
//             name: 'Jaffna Railway Station',
//             vicinity: 'Jaffna',
//             location: { lat: 9.6615, lng: 80.0255 }
//           },
//           restaurants: [
//             {
//               name: 'Jaffna Restaurant',
//               vicinity: 'Jaffna Town',
//               rating: 4.1,
//               user_ratings_total: 280,
//               opening_hours: { open_now: true }
//             },
//             {
//               name: 'Seafood Corner Jaffna',
//               vicinity: 'Jaffna',
//               rating: 4.3,
//               user_ratings_total: 195,
//               opening_hours: { open_now: true }
//             }
//           ]
//         }
//       ];
//       setSearchResults(sampleStations);
//       setError('ℹ️ Showing sample restaurant data. Configure Google Maps API for live data from food delivery apps.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const selectStation = (station) => {
//     setSelectedStation(station);
//     setRestaurants(station.restaurants || []);
//     setSelectedRestaurant(null); // Reset restaurant selection
//     setRestaurantMenu([]);
//   };

//   const selectRestaurant = async (restaurant) => {
//     setSelectedRestaurant(restaurant);
//     setLoading(true);

//     try {
//       // Try to find if this restaurant exists in TrainFood system
//       const response = await axios.get(
//         `${import.meta.env.VITE_API_URL}/restaurants/search?name=${encodeURIComponent(restaurant.name)}`
//       );

//       if (response.data && response.data.length > 0) {
//         // Restaurant exists in TrainFood - get its menu
//         const trainFoodRestaurant = response.data[0];
//         const menuResponse = await axios.get(
//           `${import.meta.env.VITE_API_URL}/products?restaurant=${trainFoodRestaurant._id}`
//         );
//         setRestaurantMenu(menuResponse.data || []);
//       } else {
//         // Restaurant not in TrainFood system - show sample menu
//         setRestaurantMenu([
//           {
//             _id: 'sample-1',
//             name: 'Chicken Fried Rice',
//             price: 450,
//             description: 'Delicious fried rice with chicken and vegetables',
//             category: 'Rice Dishes',
//             image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=250&fit=crop&crop=center'
//           },
//           {
//             _id: 'sample-2',
//             name: 'Fish Curry with Rice',
//             price: 520,
//             description: 'Traditional Sri Lankan fish curry served with rice',
//             category: 'Curry Dishes',
//             image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=250&fit=crop&crop=center'
//           },
//           {
//             _id: 'sample-3',
//             name: 'Vegetable Kottu',
//             price: 380,
//             description: 'Chopped roti with mixed vegetables and spices',
//             category: 'Kottu Dishes',
//             image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=250&fit=crop&crop=center'
//           },
//           {
//             _id: 'sample-4',
//             name: 'String Hoppers with Curry',
//             price: 420,
//             description: 'Steamed rice noodles with fish curry and sambol',
//             category: 'Traditional',
//             image: 'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=400&h=250&fit=crop&crop=center'
//           },
//           {
//             _id: 'sample-5',
//             name: 'Chicken Biryani',
//             price: 480,
//             description: 'Aromatic basmati rice with tender chicken and spices',
//             category: 'Rice Dishes',
//             image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&h=250&fit=crop&crop=center'
//           },
//           {
//             _id: 'sample-6',
//             name: 'Dhal Curry with Rice',
//             price: 350,
//             description: 'Lentil curry with basmati rice and papadum',
//             category: 'Vegetarian',
//             image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=250&fit=crop&crop=center'
//           }
//         ]);
//       }
//     } catch (err) {
//       console.error('Error fetching menu:', err);
//       // Show sample menu as fallback
//       setRestaurantMenu([
//         {
//           _id: 'sample-1',
//           name: 'Chicken Fried Rice',
//           price: 450,
//           description: 'Delicious fried rice with chicken and vegetables',
//           category: 'Rice Dishes',
//           image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=250&fit=crop&crop=center'
//         },
//         {
//           _id: 'sample-2',
//           name: 'Fish Curry with Rice',
//           price: 520,
//           description: 'Traditional Sri Lankan fish curry served with rice',
//           category: 'Curry Dishes',
//           image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=250&fit=crop&crop=center'
//         },
//         {
//           _id: 'sample-3',
//           name: 'Vegetable Kottu',
//           price: 380,
//           description: 'Chopped roti with mixed vegetables and spices',
//           category: 'Kottu Dishes',
//           image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=250&fit=crop&crop=center'
//         }
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const addToCart = (product) => {
//     // This would integrate with the existing cart system
//     alert(`Added ${product.name} to cart! (Integration with cart system needed)`);
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter') {
//       searchStations();
//     }
//   };

//   return (
//     <div className="station-search">
//       <div className="search-header">
//         <h2>🍽️ Find Restaurants Near Train Stations</h2>
//         <p>Search for train stations to discover nearby restaurants</p>
//         {error && error.includes('sample data') && (
//           <p style={{ fontSize: '0.9rem', color: '#666', fontStyle: 'italic' }}>
//             Note: Google Maps API needs proper configuration for live data
//           </p>
//         )}
//       </div>

//       <div className="search-input-section">
//         <div className="search-input-group">
//           <input
//             type="text"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             onKeyPress={handleKeyPress}
//             placeholder="Enter train station name (e.g., Colombo Fort, Jaffna, Kaithady, Kilinochchi, Paranthan)"
//             className="station-search-input"
//           />
//           <button
//             onClick={searchStations}
//             disabled={loading || !searchQuery.trim()}
//             className="search-button"
//           >
//             {loading ? '🔍 Searching...' : '🔍 Search'}
//           </button>
//         </div>
//       </div>

//       {error && (
//         <div className="error-message">
//           ⚠️ {error}
//         </div>
//       )}

//       {searchResults.length > 0 && (
//         <div className="stations-list">
//           <h3>📍 Select a Station</h3>
//           <div className="stations-grid">
//             {searchResults.map((stationData, index) => (
//               <div
//                 key={index}
//                 className={`station-card ${selectedStation?.station.place_id === stationData.station.place_id ? 'selected' : ''}`}
//                 onClick={() => selectStation(stationData)}
//               >
//                 <div className="station-info">
//                   <h4>🚆 {stationData.station.name}</h4>
//                   <p className="station-address">{stationData.station.vicinity}</p>
//                   <p className="restaurant-count">
//                     🍽️ {stationData.restaurants.length} restaurants nearby
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {selectedStation && restaurants.length > 0 && (
//         <div className="restaurants-section">
//           <h3>🍴 Restaurants near {selectedStation.station.name}</h3>
//           <div className="restaurants-grid">
//             {restaurants.map((restaurant, index) => (
//               <div key={index} className="restaurant-card" onClick={() => selectRestaurant(restaurant)}>
//                 <div className="restaurant-header">
//                   <h4>{restaurant.name}</h4>
//                   {restaurant.rating && (
//                     <div className="rating">
//                       ⭐ {restaurant.rating} ({restaurant.user_ratings_total || 0} reviews)
//                     </div>
//                   )}
//                 </div>
//                 <p className="restaurant-address">{restaurant.vicinity}</p>
//                 {restaurant.opening_hours && (
//                   <p className="restaurant-status">
//                     {restaurant.opening_hours.open_now ? '🟢 Open now' : '🔴 Closed'}
//                   </p>
//                 )}
//                 <div className="restaurant-actions">
//                   <button
//                     className="view-menu-btn"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       selectRestaurant(restaurant);
//                     }}
//                   >
//                     🍽️ View Menu
//                   </button>
//                   <button
//                     className="view-on-map-btn"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       const url = `https://www.google.com/maps/search/?api=1&query=${restaurant.location.lat},${restaurant.location.lng}&query_place_id=${restaurant.place_id}`;
//                       window.open(url, '_blank');
//                     }}
//                   >
//                     🗺️ View on Map
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {selectedRestaurant && (
//         <div className="restaurant-menu-section">
//           <div className="menu-header">
//             <button
//               className="back-btn"
//               onClick={() => setSelectedRestaurant(null)}
//             >
//               ← Back to Restaurants
//             </button>
//             <h3>🍽️ {selectedRestaurant.name} - Menu</h3>
//             <p className="restaurant-info">
//               📍 {selectedRestaurant.vicinity} •
//               {selectedRestaurant.rating && ` ⭐ ${selectedRestaurant.rating}`}
//               {selectedRestaurant.opening_hours && ` • ${selectedRestaurant.opening_hours.open_now ? '🟢 Open' : '🔴 Closed'}`}
//             </p>
//           </div>

//           {loading ? (
//             <div className="loading-menu">Loading menu...</div>
//           ) : (
//             <div className="menu-items">
//               {restaurantMenu.map((item) => (
//                 <div key={item._id} className="menu-item">
//                   <div className="menu-item-header">
//                     <div className="item-info">
//                         <div className="item-image-container">
//                           <img src={item.image} alt={item.name} className="item-image" />
//                         </div>
//                         <div className="item-details">
//                           <h4>{item.name}</h4>
//                           <p className="item-description">{item.description}</p>
//                           <p className="item-price">Rs. {item.price}</p>
//                         </div>
//                       </div>
//                     <button
//                       className="add-to-cart-btn"
//                       onClick={() => addToCart(item)}
//                     >
//                       Add to Cart
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       )}

//       {selectedStation && restaurants.length === 0 && (
//         <div className="no-restaurants">
//           <p>😔 No restaurants found near {selectedStation.station.name}</p>
//           <p>Try selecting a different station or check back later.</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default StationSearch;

import { useState } from 'react';
import axios from 'axios';
import './StationSearch.css';

const StationSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [restaurantMenu, setRestaurantMenu] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchStations = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError('');
    try {
      let location = null;

      // 1) Direct geocode
      try {
        const geocodeResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/maps/geocode?address=${encodeURIComponent(searchQuery.trim())}`
        );

        if (geocodeResponse.data.results && geocodeResponse.data.results.length > 0) {
          location = geocodeResponse.data.results[0].geometry.location;
        }
      } catch {
        console.log('Direct geocode failed, trying with railway station suffix');
      }

      // 2) Geocode with "railway station"
      if (!location) {
        try {
          const geocodeResponse = await axios.get(
            `${import.meta.env.VITE_API_URL}/maps/geocode?address=${encodeURIComponent(searchQuery.trim() + ' railway station')}`
          );

          if (geocodeResponse.data.results && geocodeResponse.data.results.length > 0) {
            location = geocodeResponse.data.results[0].geometry.location;
          }
        } catch {
          console.log('Railway station geocode failed, trying with station suffix');
        }
      }

      // 3) Geocode with "station"
      if (!location) {
        try {
          const geocodeResponse = await axios.get(
            `${import.meta.env.VITE_API_URL}/maps/geocode?address=${encodeURIComponent(searchQuery.trim() + ' station')}`
          );

          if (geocodeResponse.data.results && geocodeResponse.data.results.length > 0) {
            location = geocodeResponse.data.results[0].geometry.location;
          }
        } catch {
          console.log('Station geocode failed');
        }
      }

      if (location) {
        // Get stations with restaurants from backend
        const stationsResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/maps/stations-with-restaurants?lat=${location.lat}&lng=${location.lng}&stationLimit=5&restaurantRadius=800`
        );

        const stations = stationsResponse.data.stations || [];
        if (stations.length > 0) {
          setSearchResults(stations);
        } else {
          setError('No train stations found in this area. Try a different location or city name.');
        }
      } else {
        // Fallback sample data (unchanged from your code)
        console.log('API not available, showing realistic sample data');

        const allSampleStations = [/* ... sample data as in your original code ... */];

        const query = searchQuery.toLowerCase();
        const filteredStations = allSampleStations.filter(station =>
          station.station.name.toLowerCase().includes(query) ||
          station.station.vicinity.toLowerCase().includes(query)
        );

        const sampleStations = filteredStations.length > 0 ? filteredStations : allSampleStations.slice(0, 3);

        setSearchResults(sampleStations);
        setError('');
      }
    } catch (err) {
      console.error('Search error:', err);

      const sampleStations = [/* ... your shorter fallback sample data ... */];
      setSearchResults(sampleStations);
      setError('ℹ️ Showing sample restaurant data. Configure Google Maps API for live data from food delivery apps.');
    } finally {
      setLoading(false);
    }
  };

  const selectStation = (station) => {
    setSelectedStation(station);
    setRestaurants(station.restaurants || []);
    setSelectedRestaurant(null);
    setRestaurantMenu([]);
  };

  const selectRestaurant = async (restaurant) => {
    setSelectedRestaurant(restaurant);
    setLoading(true);

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/restaurants/search?name=${encodeURIComponent(restaurant.name)}`
      );

      if (response.data && response.data.length > 0) {
        const trainFoodRestaurant = response.data[0];
        const menuResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/products?restaurant=${trainFoodRestaurant._id}`
        );
        setRestaurantMenu(menuResponse.data || []);
      } else {
        setRestaurantMenu([/* ... sample menu items as in your code ... */]);
      }
    } catch (err) {
      console.error('Error fetching menu:', err);
      setRestaurantMenu([/* ... sample menu items as in your code ... */]);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    alert(`Added ${product.name} to cart! (Integration with cart system needed)`);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchStations();
    }
  };

  // JSX render unchanged except for code above
  return (
    <div className="station-search">
      {/* ... your existing JSX ... */}
    </div>
  );
};

export default StationSearch;