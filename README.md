# **Röstningsapplikation**

En enkel och interaktiv röstningsapplikation byggd med HTML, CSS och JavaScript. Applikationen har tre huvudsakliga sidor:

1. **Röstsida** – Användare kan rösta på ett av flera alternativ.
2. **Resultatsida** – Visa resultaten av röstningen i ett stapeldiagram.
3. **Adminsida** – Administratören kan hantera röstningsalternativ, låsa/öppna röstningen och nollställa röster.

---

## **Funktioner**

### **Röstsida**
- Användare kan rösta på ett av flera alternativ.
- En användare kan endast rösta en gång (enligt lagring i Local Storage).
- Omröstningen är låst om administratören stänger den.

### **Resultatsida**
- Visar ett stapeldiagram som uppdateras automatiskt var femte sekund.
- Stapeldiagrammet är byggt med Chart.js.
- Responsiv design och anpassad layout.

### **Adminsida**
- Administratören kan:
  - **Låsa/öppna röstningen.**
  - **Nollställa röster.**
  - **Redigera befintliga alternativ.**
  - **Lägga till nya alternativ.**
  - **Ta bort alternativ.**
- Adminsidan är lösenordsskyddad.

---

## **Teknikstack**
- **Frontend:** HTML, CSS, JavaScript
- **Diagrambibliotek:** [Chart.js](https://www.chartjs.org/)

---

## **Användning**
**Starta applikationen**  
- Öppna index.html i din webbläsare för att börja använda applikationen.
**Adminsidan**  
- Gå till adminsidan genom att öppna admin.html.
- Logga in med standardlösenordet
- Utför administrativa åtgärder som att nollställa röster, låsa röstningen eller redigera alternativen.

---

## **Projektstruktur**
```
.
├── index.html         # Röstsidan  
├── results.html       # Resultatsidan  
├── admin.html         # Adminsidan  
├── app.js             # Huvudlogik för applikationen  
├── styles.css         # CSS för applikationen  
├── README.md          # Dokumentation  
```

---
## **Framtida Förbättringar**
- Implementera en backend för centraliserad datalagring och säker hantering av användardata.
- Lägg till fler funktioner för autentisering och rollbaserad åtkomstkontroll.






