CREATE TABLE `LIVRE` (
  `ID_Livre` integer PRIMARY KEY AUTOINCREMENT,
  `Titre` varchar(255) NOT NULL,
  `ISBN` varchar(255) UNIQUE,
  `Annee_Publication` integer,
  `Nb_Pages` integer,
  `Editeur` varchar(255)
);

CREATE TABLE `AUTEUR` (
  `ID_Auteur` integer PRIMARY KEY AUTOINCREMENT,
  `Nom` varchar(255) NOT NULL,
  `Prenom` varchar(255),
  `Date_Naissance` date,
  `ID_Pays` integer
);

CREATE TABLE `PAYS`(
  `ID_Pays` integer PRIMARY KEY AUTOINCREMENT,
  `Nom` varchar(255)
);

CREATE TABLE `ECRITURE` (
  `ID_Auteur` integer,
  `ID_Livre` integer,
  `Role` varchar(255),
  PRIMARY KEY (`ID_Auteur`, `ID_Livre`),
  FOREIGN KEY (`ID_Auteur`) REFERENCES `AUTEUR` (`ID_Auteur`),
  FOREIGN KEY (`ID_Livre`) REFERENCES `LIVRE` (`ID_Livre`)
);

CREATE TABLE `MEMBRE` (
  `ID_Membre` integer PRIMARY KEY AUTOINCREMENT,
  `Nom` varchar(255) NOT NULL,
  `Prenom` varchar(255) NOT NULL,
  `Email` varchar(255) UNIQUE,
  `Adresse` varchar(255),
  `Date_Inscription` timestamp DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `EMPRUNT` (
  `ID_Emprunt` integer PRIMARY KEY AUTOINCREMENT,
  `ID_Membre` integer NOT NULL,
  `ID_Exemplaire` integer NOT NULL,
  `Date_Emprunt` date DEFAULT (CURRENT_DATE),
  `Date_Retour_Prevue` date NOT NULL,
  `Date_Retour_Effective` date,
  FOREIGN KEY (`ID_Membre`) REFERENCES `MEMBRE` (`ID_Membre`),
  FOREIGN KEY (`ID_Exemplaire`) REFERENCES `EXEMPLAIRE` (`ID_Exemplaire`)
);

CREATE TABLE `CATEGORIE` (
  `ID_Categorie` integer PRIMARY KEY AUTOINCREMENT,
  `Nom` varchar(255) NOT NULL,
  `Description` varchar(255)
);

CREATE TABLE `CATEGORIE_LIVRE` (
  `ID_Categorie` integer,
  `ID_Livre` integer,
  PRIMARY KEY (`ID_Categorie`, `ID_Livre`),
  FOREIGN KEY (`ID_Categorie`) REFERENCES `CATEGORIE` (`ID_Categorie`),
  FOREIGN KEY (`ID_Livre`) REFERENCES `LIVRE` (`ID_Livre`)
);

CREATE TABLE `EXEMPLAIRE` (
  `ID_Exemplaire` integer PRIMARY KEY AUTOINCREMENT,
  `ID_Livre` integer NOT NULL,
  `Etat` integer NOT NULL,
  `Disponibilite` boolean NOT NULL DEFAULT 0,
  `Date_Acquisition` date,
  FOREIGN KEY (`ID_Livre`) REFERENCES `LIVRE` (`ID_Livre`)
);

CREATE INDEX `LIVRE_index_0` ON `LIVRE` (`Titre`);