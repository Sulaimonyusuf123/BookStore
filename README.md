# Book Store Application

A responsive React application for browsing and viewing book details. This application features a clean, mobile-responsive UI, SEO-friendly pages, and smooth loading states with an Express.js and Node.js backend.

## Features

- 📱 Fully responsive design that works on all device sizes
- 🔍 SEO-optimized book detail pages
- ⚡ Loading spinners for better user experience
- 🔄 Dynamic routing with React Router
- 📊 Express.js API with proper error handling
- 🗄️ RESTful backend architecture

## Screenshots

(Add screenshots of your application here)

## Technologies Used

### Frontend
- React.js
- React Router for navigation
- Axios for API requests
- Tailwind CSS for styling
- React Helmet for SEO

### Backend
- Node.js
- Express.js
- MongoDB

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14.0.0 or later)
- npm or yarn
- MongoDB

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/book-store.git
cd book-store
```

2. Install frontend dependencies:
```bash
# In the root directory (frontend)
npm install
# or with yarn
yarn install
```

3. Install backend dependencies:
```bash
# Navigate to the backend directory
cd backend
npm install
```

4. Start the backend server:
```bash
# In the backend directory
node app.js
# or if you're using nodemon
nodemon app.js
```

5. Start the frontend development server:
```bash
# In the root directory
npm run dev
# or with yarn
yarn start
```

## Environment Setup

### Frontend
Create a `.env` file in the root (frontend) directory:
```
REACT_APP_API_URL=http://localhost:3009/api
```

### Backend
Create a `.env` file in the backend directory:
```
PORT=3009
DB_URI=your_database_connection_string
NODE_ENV=development
```

## Project Structure

```
book-store/
├── public/
├── src/                 # Frontend code
│   ├── components/
│   │   ├── BookDetail.js
│   │   ├── Home.js
│   │   └── AddEditBooks
│   ├── App.js
│   └── index.js
├── backend/             # Express & Node.js backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   ├── server.js        # Entry point for backend
│   └── package.json
├── .env
├── package.json         # Frontend package.json
└── README.md
```

## API Endpoints

The Express backend exposes the following RESTful API endpoints:

- `GET /api/books` - Get all books
- `GET /api/books/:id` - Get a specific book by ID
- `POST /api/books` - Create a new book
- `PUT /api/books/:id` - Update a book
- `DELETE /api/books/:id` - Delete a book

## Deployment

### Frontend
To build the React application for production:

```bash
npm run build
# or with yarn
yarn build
```

The build artifacts will be stored in the `build/` directory.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Acknowledgments

- Thanks to all contributors
- Express.js and Node.js communities
- React community
