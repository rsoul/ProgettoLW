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
* implementare eliminazione esame o evento del calendario:
  * tramite bottone posizionato nella rispettiva tab che spawna [pop-over](https://getbootstrap.com/docs/4.0/components/popovers/) under con form che prende in input id esame/evento da eliminare
  * tramite creazione di column con icona per eliminare l'esame n
* implementare visualizzazione a pagine (1,2,3,4...) degli esami/eventi per non andare troppo in basso con la pagina (https://v4-alpha.getbootstrap.com/components/pagination/) per evitare di sovrapporrere il footer (oppure mandare giù il footer per non collidere con la tabella)
* implementare select di università e corsi per la registrazione !!!!!!
* implementare bottone di modifica insieme al remove per calendario e esami !!!!!!
* implementare inserimento idoneità (esame senza voto)
* migliorare edit in modo da avere campi precompilati con i valori dell'esame da modificare (CODICE esame NON MODIFICABILE E NOME evento NON MODIFICABILE)


### Raoul:
- login
- registrazione
- requisiti per RC: rest,oauth,ecc..

# Notes



**Good job so far!**