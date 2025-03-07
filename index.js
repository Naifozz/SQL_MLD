import sqlite3 from "sqlite3";
import { open } from "sqlite";

async function runQueries() {
    const db = await open({
        filename: "./bibliotheque.db",
        driver: sqlite3.Database,
    });

    try {
        await db.run("UPDATE LIVRE SET Titre = ? WHERE ID_Livre = ?", ["Nouveau Titre", 1]);
        console.log("Titre du livre modifié.");

        await db.run("PRAGMA foreign_keys = OFF;");
        await db.run("DELETE FROM ECRITURE WHERE ID_Livre = ?", [1]);
        await db.run("DELETE FROM CATEGORIE_LIVRE WHERE ID_Livre = ?", [1]);
        await db.run("DELETE FROM EXEMPLAIRE WHERE ID_Livre = ?", [1]);
        await db.run("DELETE FROM LIVRE WHERE ID_Livre = ?", [1]);
        await db.run("PRAGMA foreign_keys = ON;");
        console.log("Livre supprimé.");

        await db.run("UPDATE AUTEUR SET ID_Pays = ? WHERE ID_Auteur = ?", [3, 1]);
        console.log("Nationalité de l'auteur mise à jour.");

        const livresAuteur = await db.all(
            `
            SELECT L.Titre
            FROM LIVRE L
            JOIN ECRITURE E ON L.ID_Livre = E.ID_Livre
            WHERE E.ID_Auteur = ?
        `,
            [1]
        );
        console.log("Livres de l'auteur spécifique:", livresAuteur);

        const livresCategorie = await db.all(
            `
            SELECT L.Titre
            FROM LIVRE L
            JOIN CATEGORIE_LIVRE CL ON L.ID_Livre = CL.ID_Livre
            JOIN CATEGORIE C ON CL.ID_Categorie = C.ID_Categorie
            WHERE C.Nom = ?
        `,
            ["Science-fiction"]
        );
        console.log("Livres de la catégorie donnée:", livresCategorie);

        const auteursBritanniques = await db.all(`
            SELECT A.Nom, A.Prenom
            FROM AUTEUR A
            JOIN PAYS P ON A.ID_Pays = P.ID_Pays
            WHERE P.Nom = 'Britannique'
        `);
        console.log("Auteurs britanniques:", auteursBritanniques);

        const livresAuteursCategories = await db.all(`
            SELECT L.Titre, A.Nom AS Auteur, C.Nom AS Categorie
            FROM LIVRE L
            JOIN ECRITURE E ON L.ID_Livre = E.ID_Livre
            JOIN AUTEUR A ON E.ID_Auteur = A.ID_Auteur
            JOIN CATEGORIE_LIVRE CL ON L.ID_Livre = CL.ID_Livre
            JOIN CATEGORIE C ON CL.ID_Categorie = C.ID_Categorie
        `);
        console.log("Livres avec leurs auteurs et catégories:", livresAuteursCategories);

        const nombreLivresParCategorie = await db.all(`
            SELECT C.Nom AS Categorie, COUNT(L.ID_Livre) AS NombreDeLivres
            FROM CATEGORIE C
            JOIN CATEGORIE_LIVRE CL ON C.ID_Categorie = CL.ID_Categorie
            JOIN LIVRE L ON CL.ID_Livre = L.ID_Livre
            GROUP BY C.ID_Categorie
        `);
        console.log("Nombre de livres par catégorie:", nombreLivresParCategorie);

        const auteurPlusDeLivres = await db.get(`
            SELECT A.Nom, A.Prenom, COUNT(E.ID_Livre) AS NombreDeLivres
            FROM AUTEUR A
            JOIN ECRITURE E ON A.ID_Auteur = E.ID_Auteur
            GROUP BY A.ID_Auteur
            ORDER BY NombreDeLivres DESC
            LIMIT 1
        `);
        console.log("Auteur ayant écrit le plus de livres:", auteurPlusDeLivres);
    } catch (error) {
        console.error("Erreur lors de l'exécution des requêtes:", error.message);
    } finally {
        await db.close();
    }
}

runQueries();
