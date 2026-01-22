import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';

dotenv.config();
connectDB();

const seedData = async () => {
    try {
        await User.deleteMany(); // Caution: Deletes all users

        const users = [
            {
                name: "Marie Dubois",
                email: "marie@example.com",
                password: "password123",
                role: "senior",
                skills: [
                    { name: "Pâtisserie Française", description: "Apprenez à faire des éclairs et des tartelettes maison.", price: 50, category: "Cuisine" },
                    { name: "Tricot pour débutants", description: "Les bases du tricot : point mousse, point jersey.", price: 30, category: "Artisanat" }
                ]
            },
            {
                name: "Thomas Bernard",
                email: "thomas@example.com",
                password: "password123",
                role: "youth",
                skills: [
                    { name: "Dépannage Informatique", description: "Je répare vos problèmes d'imprimante et nettoie votre PC.", price: 40, category: "Informatique" },
                    { name: "Initiation Instagram", description: "Comprendre les réseaux sociaux pour rester connecté.", price: 30, category: "Informatique" }
                ]
            },
            {
                name: "Fatima Benali",
                email: "fatima@example.com",
                password: "password123",
                role: "senior",
                skills: [
                    { name: "Jardinage & Potager", description: "Secrets pour des tomates savoureuses sans pesticides.", price: 45, category: "Jardinage" }
                ]
            },
            {
                name: "Jean Moulin",
                email: "jean@example.com",
                password: "password123",
                role: "senior",
                skills: [
                    { name: "Menuiserie de base", description: "Réparer une chaise, poser une étagère.", price: 60, category: "Bricolage" }
                ]
            }
        ];

        await User.insertMany(users);
        console.log('Données importées avec succès !');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

seedData();
