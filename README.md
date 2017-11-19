# ProgettoLW
## Descrizione:
Il gruppo si pone l'obiettivo di  sviluppare un sito web in cui l'utente inserisce in input n esami  (data, voto, CFU, i dati vengono salvati in localStorage e su di un Database) per vedere il suo andamento nel tempo su di un grafico , il confronto tra la sua media e quella degli altri studenti e i CFU rimanenti da conseguire.

## Collaboratori
*Michele Anselmi* @Mikyxello   
*Raoul Nuccetelli* @rsoul   
*Antonio Federico*



# To do 

### Funzionalità e modifiche da implementare:
* implementare media ponderata e media aritmetica nel tab esami sostenuti (tramite ciclo for che scorre tra gli esami in localstorage o con variabile definita?)
* implementare [loading bar](https://getbootstrap.com/docs/4.0/components/progress/) (cfu ottenuti /cfu da ottenere per laurearsi x 100)
* redesign aggiunta esami ed eventi calendario nei rispettivi tab tramite bottone che spawna un [pop-over](https://getbootstrap.com/docs/4.0/components/alerts/) under
* implementare [alert system di bootstrap](https://getbootstrap.com/docs/4.0/components/alerts/) invece delle caselle di alert html5 che necessitano di reload della pagina
* animare le caselle di input in caso di succesful input
* implementare visualizzazione a pagine (1,2,3,4...) degli esami/eventi per non andare troppo in basso con la pagina (https://v4-alpha.getbootstrap.com/components/pagination/)
* implementare inserimento idoneità (esame senza voto)
* migliorare edit di exam/event inserendo automaticamente i valori dell'elemento da modificare disattivando il codice/nome (NON MODIFICABILI, KEYS)
* Una volta rilasciata la versione stabile e finale, ricordarsi di minify tutti i file per un piccolo boost nella performance della web app
* Animare la progress bar ed il testo di esso attraverso la funzione getProgress()

### Bugs to squash:

- <del>Immettere troppi esami fa fare collapse tra la barra di selezione della pagina e il footer</del>
- **Priority** Immettere troppi esami (n>20) fa formattare male il graph
* La form  di immissione di esame/evento permette l'inserimento di script malevoli ([XSS](https://www.acunetix.com/websitesecurity/cross-site-scripting/))

### Raoul:
- login
- registrazione
- requisiti per RC: rest,oauth,ecc..

# Notes



**Good job so far!**