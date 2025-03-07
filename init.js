import sqlite3 from "sqlite3";
import { readFile } from "fs/promises";

const dbFilePath = "./bibliotheque.db";
const sqlFilePath = "./init.sql";

async function initializeDatabase() {
    try {
        // Lire le fichier SQL
        const sql = await readFile(sqlFilePath, "utf-8");

        // Ouvrir la base de données
        const db = new sqlite3.Database(dbFilePath);

        // Exécuter le script SQL
        db.exec(sql, (err) => {
            if (err) {
                console.error("Erreur lors de l'exécution du script SQL:", err.message);
            } else {
                console.log("Base de données initialisée avec succès.");
                // Insérer des données après l'initialisation
                insertData(db);
            }
        });
    } catch (error) {
        console.error("Erreur lors de l'initialisation de la base de données:", error.message);
    }
}

function insertData(db) {
    const insertLivre =
        "INSERT INTO LIVRE (Titre, ISBN, Annee_Publication, Nb_Pages, Editeur) VALUES (?, ?, ?, ?, ?)";
    const insertAuteur =
        "INSERT INTO AUTEUR (Nom, Prenom, Date_Naissance, ID_Pays) VALUES (?, ?, ?, ?)";

    const insertEcriture = "INSERT INTO ECRITURE (ID_Auteur, ID_Livre, Role) VALUES (?, ?, ?)";
    const insertCategorie = "INSERT INTO CATEGORIE (Nom, Description) VALUES (?, ?)";
    const insertCategorieLivre =
        "INSERT INTO CATEGORIE_LIVRE (ID_Categorie, ID_Livre) VALUES (?, ?)";
    const insertMembre = "INSERT INTO MEMBRE (Nom, Prenom, Email, Adresse) VALUES (?, ?, ?, ?)";
    const insertEmprunt =
        "INSERT INTO EMPRUNT (ID_Membre, ID_Exemplaire, Date_Emprunt) VALUES (?, ?, ?)";
    const insertExemplaire =
        "INSERT INTO EXEMPLAIRE (ID_Livre, Etat, Disponibilite, Date_Acquisition) VALUES (?, ?, ?, ?)";
    const insertPays = "INSERT INTO PAYS (Nom) VALUES (?)";

    db.serialize(() => {
        // Insérer les pays
        db.run(insertPays, ["Russe-Américain"]);
        db.run(insertPays, ["Britannique"]);
        db.run(insertPays, ["Américain"]);

        // Insérer les catégories
        db.run(insertCategorie, ["Science-fiction", "Livres de science-fiction"]);
        db.run(insertCategorie, ["Fantasy", "Livres de fantasy"]);
        db.run(insertCategorie, ["Policier / Thriller", "Livres policiers et thrillers"]);

        // Insérer les auteurs
        db.run(insertAuteur, ["Asimov", "Isaac", "1920-01-02", 1]);
        db.run(insertAuteur, ["Tolkien", "J.R.R.", "1892-01-03", 2]);
        db.run(insertAuteur, ["Christie", "Agatha", "1890-09-15", 2]);
        db.run(insertAuteur, ["Herbert", "Frank", "1920-10-08", 3]);

        // Insérer les livres
        db.run(insertLivre, ["Fondation", "9782070360532", 1951, 255, "Editeur SF"]);
        db.run(insertLivre, ["Les Robots", "9782070360549", 1950, 280, "Editeur SF"]);
        db.run(insertLivre, ["Le Cycle de l’Empire", "9782070360556", 1952, 300, "Editeur SF"]);
        db.run(insertLivre, [
            "Le Seigneur des Anneaux",
            "9782266154116",
            1954,
            1200,
            "Editeur Fantasy",
        ]);
        db.run(insertLivre, ["Le Hobbit", "9782266148535", 1937, 310, "Editeur Fantasy"]);
        db.run(insertLivre, ["Le Silmarillion", "9782070309783", 1977, 365, "Editeur Fantasy"]);
        db.run(insertLivre, [
            "Le Crime de l’Orient-Express",
            "9782702436010",
            1934,
            250,
            "Editeur Policier",
        ]);
        db.run(insertLivre, ["Ils étaient dix", "9782702436027", 1939, 275, "Editeur Policier"]);
        db.run(insertLivre, ["Mort sur le Nil", "9782702436034", 1937, 320, "Editeur Policier"]);
        db.run(insertLivre, ["Dune", "9782266128759", 1965, 850, "Editeur SF"]);

        // Insérer les exemplaires
        db.run(insertExemplaire, [1, 1, true, "2025-03-06"]);
        db.run(insertExemplaire, [2, 1, true, "2025-03-06"]);
        db.run(insertExemplaire, [3, 1, true, "2025-03-06"]);
        db.run(insertExemplaire, [4, 1, true, "2025-03-06"]);
        db.run(insertExemplaire, [5, 1, true, "2025-03-06"]);
        db.run(insertExemplaire, [6, 1, true, "2025-03-06"]);
        db.run(insertExemplaire, [7, 1, true, "2025-03-06"]);
        db.run(insertExemplaire, [8, 1, true, "2025-03-06"]);
        db.run(insertExemplaire, [9, 1, true, "2025-03-06"]);
        db.run(insertExemplaire, [10, 1, true, "2025-03-06"]);

        // Insérer les membres
        db.run(insertMembre, ["Membre 1", "Prenom 1", "membre1@example.com", "Adresse 1"]);
        db.run(insertMembre, ["Membre 2", "Prenom 2", "membre2@example.com", "Adresse 2"]);
        db.run(insertMembre, ["Membre 3", "Prenom 3", "membre3@example.com", "Adresse 3"]);

        // Insérer les emprunts
        db.run(insertEmprunt, [1, 1, "2025-03-06"]);
        db.run(insertEmprunt, [2, 2, "2025-03-06"]);
        db.run(insertEmprunt, [3, 3, "2025-03-06"]);

        // Associer les auteurs aux livres
        db.run(insertEcriture, [1, 1, "Auteur"]); // Isaac Asimov - Fondation
        db.run(insertEcriture, [1, 2, "Auteur"]); // Isaac Asimov - Les Robots
        db.run(insertEcriture, [1, 3, "Auteur"]); // Isaac Asimov - Le Cycle de l’Empire
        db.run(insertEcriture, [2, 4, "Auteur"]); // J.R.R. Tolkien - Le Seigneur des Anneaux
        db.run(insertEcriture, [2, 5, "Auteur"]); // J.R.R. Tolkien - Le Hobbit
        db.run(insertEcriture, [2, 6, "Auteur"]); // J.R.R. Tolkien - Le Silmarillion
        db.run(insertEcriture, [3, 7, "Auteur"]); // Agatha Christie - Le Crime de l’Orient-Express
        db.run(insertEcriture, [3, 8, "Auteur"]); // Agatha Christie - Ils étaient dix
        db.run(insertEcriture, [3, 9, "Auteur"]); // Agatha Christie - Mort sur le Nil
        db.run(insertEcriture, [4, 10, "Auteur"]); // Frank Herbert - Dune

        // Insérer les catégories de livres
        db.run(insertCategorieLivre, [1, 1]);
        db.run(insertCategorieLivre, [1, 2]);
        db.run(insertCategorieLivre, [1, 3]);
        db.run(insertCategorieLivre, [2, 4]);
        db.run(insertCategorieLivre, [2, 5]);
        db.run(insertCategorieLivre, [2, 6]);
        db.run(insertCategorieLivre, [3, 7]);
        db.run(insertCategorieLivre, [3, 8]);
        db.run(insertCategorieLivre, [3, 9]);
        db.run(insertCategorieLivre, [1, 10]);

        console.log("Données insérées avec succès.");

        db.close((err) => {
            if (err) {
                console.error("Erreur lors de la fermeture de la base de données:", err.message);
            } else {
                console.log("Base de données fermée avec succès.");
            }
        });
    });
}

initializeDatabase();
