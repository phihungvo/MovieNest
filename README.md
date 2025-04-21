# 🎬 MovieNest Project
Deploy product: http://14.225.204.231/
- Admin account:
  
  ```python
   admin@example.com
  ```
- Admin password:
  
    ```python
  admin_example
    ```
## 🌐 Overview

**MovieNest** is a full-stack movie management system, consisting of two main parts: **Backend API** and **Frontend UI**. The project is designed to provide users with an efficient way to search, manage, and explore movie information. It simulates the structure of a real-world movie platform and serves as a learning project for full-stack development.

✨ The primary goals of this project are :
- 🚀 To practice building a complete web application.
- 🛠️ To apply popular technologies such as **Java Spring Boot** and **ReactJS**.
- 🌱 To build a scalable foundation that can be extended into a real system.

---

## ⚙️ Technologies Used

### Backend
- **Java 21**
- **Spring Boot**
- **Spring Data JPA**
- **Spring Security**
- **MySQL**
- **MapStruct**
- **Lombok**
- **Maven**

### Frontend
- **ReactJS**
- **Axios**
- **React Router**
- **AntDesign**

## 📌 Main Features 

### 1. Movie Management
- Create, update, delete, and search movies.
- Paginate movie lists.
- Filter movies by genre, release date, and rating.
- View detailed movie information.

### 2. Genre Management
- Add, update, delete genres.
- Link genres when creating or updating movies.

### 3. Trailer Management
- Add trailers for each movie.
- View trailers associated with specific movies.

### 4. Actor Management
- Manage actors and link to movies.

### 5. Comment Feature
- Allow users to comment on movies.

### 6. Pagination & Search
- Search movies by title.
- Filter movies by genre and release date.
- Paginate movie and trailer data.

## 🌟 Future Features (Planned)

### 1. Rating & Review
- Users can rate movies (1-10 stars).
- Users can write reviews and comments about movies.
- View the list of ratings & reviews for each movie.

### 2. Favorite Movies
- Allow users to save their favorite movies.
- Provide API to retrieve the user's favorite movie list.

### 3. Admin Dashboard - Statistics
- Display the number of movies by genre.
- Show movies with the highest and lowest ratings.
- Display total counts of trailers, genres, and users.

### 4. Import Movies from TMDB API
- Add a feature to automatically import movie data from The Movie Database (TMDB) API.

### 5. Watchlist & Watch History
- Allow users to add movies to their Watchlist.
- Save and view the history of watched movies.

## Upcoming Feature

| Feature                          | Description                                                      |
|----------------------------------|---------------------------------------------------------------|
| **Rating & Review**             | Allow users to rate and review movies.                         |
| **Favorite Movies**             | Save favorite movies to the user’s profile.                    |
| **Watchlist**                   | Add movies to a personal watchlist.                            |
| **TMDB API Integration**        | Sync movie data from The Movie Database (TMDB) API.            |
| **Admin Dashboard**             | Display statistics about movies, trailers, genres, ratings.    |
| **Watch History**               | Record and display users' movie watch history.                 |


## Movie Ticket & Purchase System 💸

| Feature                        | Description                                                         |
|-------------------------------|---------------------------------------------------------------------|
| **Buy Movie Tickets**        | Users can select showtime, seat, and purchase tickets for specific movies. |
| **Purchase Movies**          | Users can buy digital copies of movies to watch anytime.            |
| **Order History**            | Users can view their past ticket orders or purchased movies.        |
| **Payment Integration**      | (Optional) Integrate with mock payment gateways (VNPay, PayPal, etc.). |
| **E-Ticket Generation**      | Generate QR code or order number after successful payment.          |
