# OTT Streaming Platform

This is a full-stack OTT (Over-The-Top) streaming platform project.

## Features
- User authentication and management
- Movie browsing and search
- Watchlist and watch history
- Admin dashboard
- Video and thumbnail management

## Technologies Used
- **Backend:** Django, Django REST Framework
- **Frontend:** React.js
- **Database:** SQLite

## Project Structure
```
backend/
  ├── adminapp/
  ├── backend/
  ├── db.sqlite3
  ├── manage.py
frontend/
  ├── public/
  ├── src/
  ├── package.json
```

## Setup Instructions

### Backend
1. Navigate to the `backend` folder:
   ```sh
   cd backend
   ```
2. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```
3. Run migrations:
   ```sh
   python manage.py migrate
   ```
4. Start the server:
   ```sh
   python manage.py runserver
   ```

### Frontend
1. Navigate to the `frontend` folder:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the React app:
   ```sh
   npm start
   ```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
This project is licensed under the MIT License.
