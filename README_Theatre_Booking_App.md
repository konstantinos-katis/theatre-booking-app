# Theatre Booking App
# git hub link : https://github.com/konstantinos-katis/theatre-booking-app.git
## Περιγραφή

Το **Theatre Booking App** είναι μία εφαρμογή κράτησης θέσεων για θεατρικές παραστάσεις.  
Αποτελείται από:

- **Frontend** με React Native / Expo
- **Backend REST API** με Node.js και Express
- **Βάση δεδομένων** MariaDB
- **Authentication** με JWT
- **Σύστημα κρατήσεων** για συνδεδεμένους χρήστες

Ο χρήστης μπορεί να κάνει εγγραφή, σύνδεση, προβολή θεάτρων, προβολή παραστάσεων, προβολή διαθέσιμων ημερομηνιών/ωρών, δημιουργία κράτησης και ακύρωση κράτησης.

---

## Τεχνολογίες

### Frontend

- React Native
- Expo
- Expo Router
- TypeScript
- Axios
- AsyncStorage

### Backend

- Node.js
- Express.js
- MariaDB connector
- bcryptjs
- jsonwebtoken
- dotenv
- cors
- nodemon

### Database

- MariaDB
- DBeaver για διαχείριση της βάσης

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
│   │       ├── _layout.tsx
│   │       ├── index.tsx
│   │       ├── login.tsx
│   │       └── register.tsx
│   ├── package.json
│   └── package-lock.json
│
└── README.md
```

---

## Περιγραφή Κώδικα

### Backend

Το backend βρίσκεται στον φάκελο `backend/` και είναι υπεύθυνο για τη λειτουργία του REST API.

Υλοποιεί:

- σύνδεση με MariaDB
- εγγραφή χρήστη
- σύνδεση χρήστη
- δημιουργία JWT token
- προστατευμένα endpoints με middleware
- επιστροφή θεάτρων, παραστάσεων και showtimes
- δημιουργία και ακύρωση κρατήσεων

### `backend/src/server.js`

Το `server.js` είναι το βασικό αρχείο εκκίνησης του backend.

Εκεί:

- δημιουργείται το Express app
- ενεργοποιείται το `cors`
- ενεργοποιείται το `express.json()`
- συνδέονται τα route αρχεία
- ξεκινάει ο server στο port `5000`

Παράδειγμα:

```js
app.use(cors());
app.use(express.json());

app.use('/', authRoutes);
app.use('/', reservationRoutes);
app.use('/theatres', theatreRoutes);
app.use('/shows', showRoutes);
```

### `backend/src/db.js`

Το `db.js` είναι υπεύθυνο για τη σύνδεση με τη MariaDB.

Χρησιμοποιεί το πακέτο `mariadb` και δημιουργεί connection pool:

```js
const mariadb = require('mariadb');

const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 5
});

module.exports = pool;
```

Το connection pool επιτρέπει στο backend να εκτελεί queries στη βάση με αποδοτικό τρόπο.

### `backend/src/routes/authRoutes.js`

Περιέχει τα endpoints:

```http
POST /register
POST /login
```

Στο `/register` γίνεται:

- έλεγχος στοιχείων χρήστη
- hash του password με `bcryptjs`
- αποθήκευση χρήστη στη MariaDB

Στο `/login` γίνεται:

- έλεγχος email
- έλεγχος password
- δημιουργία JWT token

### `backend/src/middleware/authMiddleware.js`

Το middleware ελέγχει αν ένα request περιέχει έγκυρο JWT token.

Το token περνάει στο header:

```http
Authorization: Bearer <token>
```

Αν το token είναι έγκυρο, το backend αποθηκεύει τα στοιχεία του χρήστη στο:

```js
req.user
```

### `backend/src/routes/theatreRoutes.js`

Περιέχει το endpoint:

```http
GET /theatres
```

Επιστρέφει τα διαθέσιμα θέατρα από τον πίνακα `theatres`.

### `backend/src/routes/showRoutes.js`

Περιέχει τα endpoints:

```http
GET /shows
GET /shows/showtimes
```

Το `/shows` επιστρέφει παραστάσεις μαζί με πληροφορίες θεάτρου.  
Το `/shows/showtimes` επιστρέφει τις διαθέσιμες ημερομηνίες και ώρες παραστάσεων.

### `backend/src/routes/reservationRoutes.js`

Περιέχει τα endpoints:

```http
GET /user/reservations
POST /reservations
DELETE /reservations/:id
```

Το `GET /user/reservations` επιστρέφει τις κρατήσεις του συνδεδεμένου χρήστη.  
Το `POST /reservations` δημιουργεί νέα κράτηση.  
Το `DELETE /reservations/:id` ακυρώνει μία κράτηση αλλά δεν τη διαγράφει από τη βάση. Αλλάζει το `status` σε `cancelled`.

---

## Frontend

Το frontend βρίσκεται στον φάκελο `mobile/`.

Έχει υλοποιηθεί με React Native και Expo και τρέχει σε web περιβάλλον.

### `mobile/src/app/index.tsx`

Η αρχική σελίδα της εφαρμογής.

Εμφανίζει:

- κουμπιά μετάβασης σε Login και Register
- διαθέσιμα showtimes
- διαθέσιμα θέατρα
- διαθέσιμες παραστάσεις
- ενεργές κρατήσεις χρήστη
- κουμπί δημιουργίας κράτησης
- κουμπί ακύρωσης κράτησης

Επικοινωνεί με το backend μέσω Axios.

Το API URL είναι:

```ts
const API_URL = 'http://localhost:5000';
```

### `mobile/src/app/login.tsx`

Σελίδα σύνδεσης χρήστη.

Ο χρήστης εισάγει:

- email
- password

Το frontend στέλνει request:

```http
POST http://localhost:5000/login
```

Αν η σύνδεση είναι επιτυχής, το JWT token αποθηκεύεται με AsyncStorage:

```ts
await AsyncStorage.setItem('token', response.data.token);
```

### `mobile/src/app/register.tsx`

Σελίδα εγγραφής χρήστη.

Ο χρήστης εισάγει:

- name
- email
- password

Το frontend στέλνει request:

```http
POST http://localhost:5000/register
```

### `mobile/src/app/_layout.tsx`

Το `_layout.tsx` χρησιμοποιείται από το Expo Router για την πλοήγηση μεταξύ σελίδων.

Βασικές σελίδες:

```text
/
 /login
 /register
```

---

## Επικοινωνία με MariaDB

Η επικοινωνία με τη MariaDB γίνεται αποκλειστικά από το backend.

Το frontend δεν επικοινωνεί απευθείας με τη βάση.  
Το frontend στέλνει HTTP requests στο backend και το backend εκτελεί SQL queries στη MariaDB.

Η σύνδεση γίνεται μέσω του αρχείου:

```text
backend/src/db.js
```

και μέσω των μεταβλητών του αρχείου `.env`.

Παράδειγμα `.env`:

```env
PORT=5000

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mariadb_password
DB_NAME=theatre_booking_db

JWT_SECRET=theatre_booking_secret_key
```

Παράδειγμα query:

```js
const rows = await pool.query('SELECT * FROM theatres');
```

Η MariaDB χρησιμοποιείται για:

- αποθήκευση χρηστών
- αποθήκευση hashed passwords
- αποθήκευση θεάτρων
- αποθήκευση παραστάσεων
- αποθήκευση showtimes
- αποθήκευση κρατήσεων
- ενημέρωση status κρατήσεων

---

## Βάση Δεδομένων

Η βάση δεδομένων ονομάζεται:

```sql
theatre_booking_db
```

### Πίνακες

```text
users
theatres
shows
showtimes
seats
reservations
reservation_seats
```

### Περιγραφή Πινάκων

#### `users`

Αποθηκεύει τους χρήστες.

Πεδία:

- `user_id`
- `name`
- `email`
- `password_hash`
- `created_at`

#### `theatres`

Αποθηκεύει τα θέατρα.

Πεδία:

- `theatre_id`
- `name`
- `location`
- `description`

#### `shows`

Αποθηκεύει τις παραστάσεις.

Πεδία:

- `show_id`
- `theatre_id`
- `title`
- `description`
- `duration`
- `age_rating`

#### `showtimes`

Αποθηκεύει ημερομηνίες και ώρες παραστάσεων.

Πεδία:

- `showtime_id`
- `show_id`
- `show_date`
- `show_time`
- `hall`
- `base_price`

#### `reservations`

Αποθηκεύει τις κρατήσεις.

Πεδία:

- `reservation_id`
- `user_id`
- `showtime_id`
- `status`
- `total_price`
- `created_at`

#### `seats` και `reservation_seats`

Υπάρχουν για μελλοντική επέκταση ώστε να υποστηρίζεται επιλογή συγκεκριμένων θέσεων.

---

## Τρόποι Εγκατάστασης

### Προαπαιτούμενα

Πρέπει να είναι εγκατεστημένα:

- Node.js
- npm
- MariaDB Server
- DBeaver ή άλλο εργαλείο διαχείρισης βάσης
- Visual Studio Code

---

## Εγκατάσταση Backend

### 1. Μετάβαση στον φάκελο backend

```powershell
cd "C:\\Users\\Κωνσταντινος\\Desktop\\theatre-booking-app\\backend"
```

### 2. Εγκατάσταση dependencies

```powershell
& "C:\\Program Files\\nodejs\\npm.cmd" install
```

### 3. Δημιουργία αρχείου `.env`

Στον φάκελο `backend`, δημιουργήστε αρχείο `.env`:

```env
PORT=5000

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mariadb_password
DB_NAME=theatre_booking_db

JWT_SECRET=theatre_booking_secret_key
```

### 4. Εκκίνηση backend

```powershell
$env:Path = "C:\\Program Files\\nodejs;" + $env:Path
& "C:\\Program Files\\nodejs\\npm.cmd" run dev
```

Αν όλα λειτουργούν σωστά, εμφανίζεται:

```text
Server running on port 5000
```

---

## Εγκατάσταση Frontend

### 1. Μετάβαση στον φάκελο mobile

```powershell
cd "C:\\Users\\Κωνσταντινος\\Desktop\\theatre-booking-app\\mobile"
```

### 2. Εγκατάσταση dependencies

```powershell
& "C:\\Program Files\\nodejs\\npm.cmd" install
```

### 3. Εκκίνηση Expo

```powershell
$env:Path = "C:\\Program Files\\nodejs;" + $env:Path
& "C:\\Program Files\\nodejs\\npm.cmd" start
```

Μετά την εκκίνηση, πατήστε:

```text
w
```

για να ανοίξει η εφαρμογή στο web.

Συνήθως ανοίγει στη διεύθυνση:

```text
http://localhost:8081
```

---

## Εκκίνηση Ολόκληρης Εφαρμογής

Για να λειτουργεί σωστά η εφαρμογή, πρέπει να τρέχουν ταυτόχρονα backend και frontend.

### Terminal 1 — Backend

```powershell
cd "C:\\Users\\Κωνσταντινος\\Desktop\\theatre-booking-app\\backend"
$env:Path = "C:\\Program Files\\nodejs;" + $env:Path
& "C:\\Program Files\\nodejs\\npm.cmd" run dev
```

### Terminal 2 — Frontend

```powershell
cd "C:\\Users\\Κωνσταντινος\\Desktop\\theatre-booking-app\\mobile"
$env:Path = "C:\\Program Files\\nodejs;" + $env:Path
& "C:\\Program Files\\nodejs\\npm.cmd" start
```

Μετά πατήστε:

```text
w
```

---

## API Endpoints

### Public Endpoints

```http
GET /
GET /db-test
GET /theatres
GET /shows
GET /shows/showtimes
```

### Authentication Endpoints

```http
POST /register
POST /login
```

### Protected Reservation Endpoints

Τα παρακάτω χρειάζονται JWT token:

```http
GET /user/reservations
POST /reservations
DELETE /reservations/:id
```

Header:

```http
Authorization: Bearer <token>
```

---

## Παραδείγματα API Requests

### Register

```json
{
  "name": "Kostas",
  "email": "kostas@example.com",
  "password": "123456"
}
```

### Login

```json
{
  "email": "kostas@example.com",
  "password": "123456"
}
```

### Create Reservation

```json
{
  "showtimeId": 1,
  "totalPrice": 18.00
}
```

---

## Παράδειγμα Ροής Χρήστη

1. Ο χρήστης ανοίγει την εφαρμογή.
2. Βλέπει διαθέσιμα θέατρα, παραστάσεις και showtimes.
3. Πατάει Login και συνδέεται.
4. Το JWT token αποθηκεύεται στο frontend.
5. Ο χρήστης κάνει κράτηση σε διαθέσιμο showtime.
6. Η κράτηση αποθηκεύεται στη MariaDB.
7. Η κράτηση εμφανίζεται στις ενεργές κρατήσεις.
8. Ο χρήστης μπορεί να ακυρώσει την κράτηση.
9. Το backend αλλάζει το status της κράτησης σε `cancelled`.
10. Η ακυρωμένη κράτηση δεν εμφανίζεται πλέον στις ενεργές κρατήσεις.

---

## Ασφάλεια

Η εφαρμογή χρησιμοποιεί:

- hashed passwords με `bcryptjs`
- JWT token με `jsonwebtoken`
- middleware για protected routes
- `.env` για αποθήκευση ρυθμίσεων σύνδεσης

Το αρχείο `.env` δεν πρέπει να ανεβαίνει στο GitHub.

---

## Σημειώσεις

- Το backend πρέπει να τρέχει πριν το frontend.
- Η MariaDB πρέπει να είναι ενεργή.
- Το backend τρέχει στο `http://localhost:5000`.
- Το frontend τρέχει στο `http://localhost:8081`.
- Η εφαρμογή έχει δοκιμαστεί κυρίως σε web περιβάλλον μέσω Expo.
- Το project μπορεί να επεκταθεί με επιλογή συγκεκριμένων θέσεων και φίλτρα αναζήτησης.

---

## Συγγραφέας

Κωνσταντίνος
