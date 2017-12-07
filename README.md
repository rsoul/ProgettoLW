# ProgettoLW
## Descrizione:
Il gruppo si pone l'obiettivo di  sviluppare un sito web in cui l'utente inserisce in input n esami  (data, voto, CFU, i dati vengono salvati in localStorage e su di un Database) per vedere il suo andamento nel tempo su di un grafico , il confronto tra la sua media e quella degli altri studenti e i CFU rimanenti da conseguire.

## Collaboratori
*Michele Anselmi* @Mikyxello   
*Raoul Nuccetelli* @rsoul   
*Antonio Federico*


# To do 

### Funzionalità e modifiche da implementare:

* **implementato (SOLO IN DASHBOARD)** implementare [alert system di bootstrap](https://getbootstrap.com/docs/4.0/components/alerts/) invece delle caselle di alert html5  
* Una volta rilasciata la versione stabile e finale, ricordarsi di minify tutti i file per un piccolo boost nella performance della web app
* inserire nel grafico il bar chart voto medio ottenuto dagli studenti
* Probabile implementazione tramite database in locale (per implementare Register/Login e conseguente trasferimento Exams/Calendar in DB Relazionale MySQL)


## Bugs to squash:
- **Priority** Immettere troppi esami (n>20) fa formattare male il graph
* La form  di immissione di esame/evento permette l'inserimento di script malevoli ([XSS](https://www.acunetix.com/websitesecurity/cross-site-scripting/))

### Raoul:
- login
- registrazione
- requisiti per RC: rest,oauth,ecc..

### Completed 
* <del>Se si aggiunge un evento con time vuoto la pagina si aggiorna automaticamente</del>
* <del>Se si chiude l'alert con la X non si riapre</del>
- <del>Avendo 0 esami in carriera l'etichetta percentuale esami completati fa collision con la progress bar</del>
- <del>Immettere troppi esami fa fare collapse tra la barra di selezione della pagina e il footer</del>
* <del>Animare la progress bar ed il testo di esso attraverso la funzione getProgress()</del>
* <del>modificare il grafico con valore massimo 31 e valore minimo 18 (fisso, non variabile dai valori inseriti)</del>
* <del>Inserire nel grafico la curva variazione della media dell'utente nel tempo </del> 
* <del> Aggiungere pagina contatti</del>
* <del>Nonostante la casella di alert sia invisibile occupa lo spazio e shifta le tab di parecchi pixel</del>
 * <del>Quando l'evento innesca la comparsa della casella il campo edit non si chiude ergo</del>
   * <del>*implementato o inseriamo la casella di alert in quella di edit/inserimento degli esami*</del>
   * <del>*o lasciamo la casella dov'è e implementiamo la chiusura della casella di edit/inserimento degli esami in caso di errore*</del>
* <del>migliorare edit di exam/event inserendo automaticamente i valori dell'elemento da modificare disattivando il codice/nome (NON MODIFICABILI, KEYS)</del>
* <del>implementare media ponderata e media aritmetica nel tab esami sostenuti (tramite ciclo for che scorre tra gli esami in localstorage o con variabile definita?)</del>
* <del>implementare [loading bar](https://getbootstrap.com/docs/4.0/components/progress/) (cfu ottenuti /cfu da ottenere per laurearsi x 100)</del>
* <del>implementare inserimento idoneità (esame senza voto)</del>
* <del>implementare visualizzazione a pagine degli esami/eventi per non intralciare il footer con [pagination di bootstrap](https://v4-alpha.getbootstrap.com/components/pagination/)</del>
* <del>Facendo hover su di un punto della curva esami dati il popover dovrebbe mostrare il nome dell'esame e non la data</del>
* <del>**Priority** Se non si hanno inizializzati i local storage si verifica un "bug" se non si aggiorna la pagina</del>
* <del>Implementare riordino dati tramite freccetta</del>
* <del>Visualizzazione da alcuni dispositivi troppo grande, modificare dimensioni tabelle</del>
* <del>animare le caselle di input in caso di succesful input</del>
**Good job so far!**