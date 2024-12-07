import * as path from 'node:path';
import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

// Language pack
let Locale;

export async function init() {
    if (!await Avatar.lang.addPluginPak("jeux")) {
        return error('jeux: unable to load language pak files');
    }
}

const playAudio = (audioPath) => {
    return new Promise((resolve, reject) => {
        Avatar.play(audioPath, (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
};

const speak = (message, client) => {
    return new Promise((resolve) => {
        Avatar.speak(message, client, () => resolve());
    });
};

export async function action(data, callback) {
    try {
        Locale = await Avatar.lang.getPak("jeux", data.language);
        if (!Locale) {
            throw new Error(`jeux: Unable to find the '${data.language}' language pak.`);
        }

        const tblActions = {

            blackjack: () => blackjack(data.client),

            jeuxcarte: async function () {
                let valeur = ["le 2", "le 3", "le 4", "le 5", "le 6", "le 7", "le 8", "le 9", "le 10", "le valet", "la dame", "le roi", "l'asse"];
                let couleur = ["coeur", "carreau", "trèfle", "pique"];

                let tts_valeur = valeur[Math.floor(Math.random() * valeur.length)];
                let tts_couleur = couleur[Math.floor(Math.random() * couleur.length)];

                const audioPath = path.join(__dirname, 'medias/carte.mp3');
                playAudio(audioPath);
		
				// Attendre la fin de l'audio avant de vocaliser (durée estimée ici à 3 secondes)
				setTimeout(() => {
					speak(`${Locale.get('message.choix')} ${tts_valeur} ${Locale.get('message.liaison')} ${tts_couleur}`);
				}, 5000);
            },

            jeux1de: function() { 
				var valeur = ["1","2","3","4","5","6"];
				var tts_valeur = valeur[Math.floor(Math.random() * valeur.length)];
                playAudio(__dirname + '/medias/de.mp3', data.client);
                        
                setTimeout(() => {
                    speak(Locale.get('message.resultat') + tts_valeur, data.client);
                }, 4000); 
			},

            jeux2de: function() {
				var valeurde1 = ["1","2","3","4","5","6"];
				var valeurde2 = ["1","2","3","4","5","6"];
				var tts_valeurde1 = valeurde1[Math.floor(Math.random() * valeurde1.length)];
				var tts_valeurde2 = valeurde2[Math.floor(Math.random() * valeurde2.length)];
				playAudio(__dirname + '/medias/de.mp3', data.client)
				
                setTimeout(() => {
                    speak(Locale.get('message.resultat') + tts_valeurde1 + Locale.get('message.jeux2dede1') + tts_valeurde2 + Locale.get('message.jeux2dede2'), data.client);
                }, 4000);
			},

            jeuxpileface: function() {
                Avatar.askme(Locale.get('message.pilefaceaskme'), data.client, 
                    {
                        "pile": "pile",
                        "battery": "pile",
                        "face": "face",
                        "head": "face",
                        "annuler": "done",
                        "non": "done",
                        "done": "done",
                        "retour": "done"
                    }
                    , 0, function(answer, end) {
                        if (answer === 'done') {
                            end(data.client); // Termine la session si l'utilisateur annule ou revient en arrière.
                            return;
                        }
                        
                        // Génération aléatoire de "pile" ou "face"
                        let randomValue = Math.random();
                        let resultat = randomValue < 0.5 ? "pile" : "face";
                        console.log(`Random Value: ${randomValue}, Result: ${resultat}`);
                        console.log(`Answer: ${answer}`);
                        
                        // Vérifie si le choix de l'utilisateur correspond au résultat
                        playAudio(__dirname + '/medias/piece.mp3', data.client); // Joue le son de la pièce
                        
                        setTimeout(() => {
                            if (answer === resultat) {
                                speak(`${Locale.get('message.win')} ${resultat}`, data.client);
                            } else {
                                speak(`${Locale.get('message.lose')} ${resultat}`, data.client);
                            }
                        }, 3000);
            
                        // Termine la session après la réponse
                        end(data.client);
                    }
                );
            }
        };


        if (!tblActions[data.action.command]) {
            throw new Error(`Commande inconnue : ${data.action.command}`);
        }

        info("jeux:", data.action.command, L.get("plugin.from"), data.client);

        await tblActions[data.action.command]();

    } catch (err) {
        if (data.client) Avatar.Speech.end(data.client);
        if (err.message) error(err.message);
    } finally {
        setTimeout(() => {
            callback();
        }, 25000);
    }
}

const blackjack = async (client) => {
    const jouer = async () => {
        const valeur = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "valet", "dame", "roi", "asse"];
        const couleur = ["coeur", "carreau", "trèfle", "pique"];
        const points = {
            "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9, "10": 10,
            "valet": 10, "dame": 10, "roi": 10, "asse": 11,
        };
        let deck = [];
        let mainJoueur = [];
        let totalPointsJoueur = 0;
        let mainCroupier = [];
        let totalPointsCroupier = 0;

        const initialiserDeck = () => {
            deck = [];
            valeur.forEach((v) => {
                couleur.forEach((c) => {
                    deck.push({ valeur: v, couleur: c, points: points[v] });
                });
            });
            for (let i = deck.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [deck[i], deck[j]] = [deck[j], deck[i]];
            }
        };

        const tirerCarte = () => {
            if (deck.length === 0) throw new Error(Locale.get('message.deckempty'));
            return deck.pop();
        };

        const calculerPoints = (main) => {
            let total = 0;
            let asCount = 0;
            main.forEach((carte) => {
                total += carte.points;
                if (carte.valeur === "asse") asCount++;
            });
            while (total > 21 && asCount > 0) {
                total -= 10;
                asCount--;
            }
            return total;
        };

        const demanderAction = async () => {
            Avatar.askme(Locale.get('message.tirerrester'), client,
                {
                    "*": "generic",
                    "non": "done",
                    "no": "done",
                    "stay": "done",
                    "rester": "done",
                    "tirer": "continue",
                    "oui": "continue",
                    "pull": "continue"
                },
                20,
                async (response, end) => {
                    end(client);
                    if (response === "continue") {
                        const nouvelleCarte = tirerCarte();
                        mainJoueur.push(nouvelleCarte);
                        totalPointsJoueur = calculerPoints(mainJoueur);

                        await speak(`${Locale.get('message.joueurtirermain')} ${nouvelleCarte.valeur} ${Locale.get('message.liaison')} ${nouvelleCarte.couleur} ${Locale.get('message.joueurtirerpoint')} ${totalPointsJoueur}.`, client);
                        info(`${Locale.get('message.joueurtirermain')} ${nouvelleCarte.valeur} ${Locale.get('message.liaison')} ${nouvelleCarte.couleur} ${Locale.get('message.joueurtirerpoint')} ${totalPointsJoueur}.`);

                        if (totalPointsJoueur > 21) {
                            await speak(Locale.get('message.over21'), client);
                        } else if (totalPointsJoueur === 21) {
                            await speak(Locale.get('message.win21'), client);
                            await jouerCroupier();
                        } else {
                            await demanderAction();
                        }
                    } else {
                        await speak(`${Locale.get('message.stand')} ${totalPointsJoueur}.`, client);
                        await jouerCroupier();
                    }
                }
            );
        };

        const jouerCroupier = async () => {
            await speak(Locale.get('message.croupiertour'), client);
            while (totalPointsCroupier < 17) {
                const nouvelleCarte = tirerCarte();
                mainCroupier.push(nouvelleCarte);
                totalPointsCroupier = calculerPoints(mainCroupier);
                await speak(`${Locale.get('message.croupiernewval')} ${nouvelleCarte.valeur} ${Locale.get('message.liaison')} ${nouvelleCarte.couleur} ${Locale.get('message.croupiernewpoint')} ${totalPointsCroupier}`, client);
                info(`${Locale.get('message.croupiernewval')} ${nouvelleCarte.valeur} ${Locale.get('message.liaison')} ${nouvelleCarte.couleur} ${Locale.get('message.croupiernewpoint')} ${totalPointsCroupier}`, client);
            }

            if (totalPointsCroupier > 21 || totalPointsJoueur > totalPointsCroupier) {
                await speak(Locale.get('message.joueurwin'), client);
            } else if (totalPointsJoueur < totalPointsCroupier) {
                await speak(Locale.get('message.croupierwin'), client);
            } else {
                await speak(Locale.get('message.gametie'), client);
            }
        };

        await speak(Locale.get('message.welcome'), client);
        initialiserDeck();
        mainJoueur.push(tirerCarte(), tirerCarte());
        mainCroupier.push(tirerCarte());
        totalPointsJoueur = calculerPoints(mainJoueur);
        totalPointsCroupier = calculerPoints(mainCroupier);

        const cartesJoueur = mainJoueur.map((carte) => `${carte.valeur} ${Locale.get('message.liaison')} ${carte.couleur}`).join(Locale.get('message.and'));
        const carteCroupierVisible = `${mainCroupier[0].valeur} ${Locale.get('message.liaison')} ${mainCroupier[0].couleur}`;

        await speak(`${Locale.get('message.joueurmain')} ${cartesJoueur} ${Locale.get('message.joueurpoint')} ${totalPointsJoueur}`, client);
        info("jeux:", `${Locale.get('message.joueurmain')} ${cartesJoueur}. ${Locale.get('message.joueurpoint')} ${totalPointsJoueur}.`);
        await speak(`${Locale.get('message.croupiermain')} ${carteCroupierVisible}.`, client);
        info("jeux:", `${Locale.get('message.croupiermain')} ${carteCroupierVisible}.`);

        if (totalPointsJoueur === 21) {
            await speak(Locale.get('message.win21'), client);
        } else {
            await demanderAction();
        }
    };

    await jouer();
};