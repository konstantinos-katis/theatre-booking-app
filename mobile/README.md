# Theatre Booking App

## Περιγραφή Project

Το **Theatre Booking App** είναι μία εφαρμογή κράτησης θέσεων για θεατρικές παραστάσεις.  
Η εφαρμογή αναπτύχθηκε στο πλαίσιο του μαθήματος **Mobile & Distributed Systems** και παρουσιάζει τη λειτουργία ενός απλού κατανεμημένου συστήματος.

Το σύστημα αποτελείται από:

- **Frontend** με React Native και Expo
- **Backend REST API** με Node.js και Express
- **Βάση δεδομένων** MariaDB
- **Authentication** με JWT
- **Διαχείριση κρατήσεων** χρήστη

Ο χρήστης μπορεί να βλέπει διαθέσιμα θέατρα, παραστάσεις και ώρες παραστάσεων, να κάνει εγγραφή, σύνδεση, κράτηση και ακύρωση κράτησης.

---

## Βασικές Λειτουργίες

### Λειτουργίες Χρήστη

- Εγγραφή νέου χρήστη
- Σύνδεση χρήστη με email και password
- Δημιουργία JWT token κατά τη σύνδεση
- Αποθήκευση token στο frontend με AsyncStorage
- Προβολή κρατήσεων συνδεδεμένου χρήστη
- Αποσύνδεση χρήστη

### Λειτουργίες Θεάτρων και Παραστάσεων

- Προβολή διαθέσιμων θεάτρων
- Προβολή διαθέσιμων παραστάσεων
- Προβολή διαθέσιμων ημερομηνιών και ωρών παραστάσεων
- Εμφάνιση βασικών πληροφοριών παράστασης, όπως τίτλος, διάρκεια, ηλικιακή καταλληλότητα, αίθουσα και τιμή

### Λειτουργίες Κρατήσεων

- Δημιουργία κράτησης από συνδεδεμένο χρήστη
- Προβολή ενεργών κρατήσεων
- Ακύρωση κράτησης
- Απόκρυψη ακυρωμένων κρατήσεων από το frontend

---

## Αρχιτεκτονική Συστήματος

Η εφαρμογή ακολουθεί αρχιτεκτονική τριών επιπέδων:

```text
React Native / Expo Frontend
          |
          | HTTP Requests με Axios
          |
Node.js / Express REST API
          |
          | MariaDB Connector
          |
MariaDB Database

---

## Δομή Project

```text
theatre-booking-app/
├── backend/
│   ├── src/
│   │   ├── db.js
│   │   ├── server.js
│   │   ├── middleware/
│   │   │   └── authMiddleware.js
│   │   └── routes/
│   │       ├── authRoutes.js
│   │       ├── theatreRoutes.js
│   │       ├── showRoutes.js
│   │       └── reservationRoutes.js
│   ├── .env
│   ├── package.json
│   └── package-lock.json
│
├── mobile/
│   ├── src/
│   │   └── app/
│   │       ├── index.tsx
│   │       ├── login.tsx
│   │       ├── register.tsx
│   │       └── _layout.tsx
│   ├── package.json
│   └── package-lock.json
│
└── README.md