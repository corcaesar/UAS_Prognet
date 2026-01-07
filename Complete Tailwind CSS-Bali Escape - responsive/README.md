# Bali Escape - Responsive Web App

This is a responsive web application for exploring Bali's hidden gems, built with Tailwind CSS, Alpine.js, and Node.js.

## Prerequisites

- Node.js installed on your machine.

## Installation

1.  Clone the repository or download the source code.
2.  Navigate to the project directory in your terminal.
3.  Install the dependencies:

    ```bash
    npm install
    ```

## Running the Application

1.  Start the server:

    ```bash
    node server.js
    ```

2.  Open your browser and go to:

    ```
    http://localhost:3000
    ```

## Features

-   **User Authentication**: Register and Login with role-based access (User/Admin).
-   **Explore Gems**: Browse destinations filtered by category, area, and price.
-   **Submit a Gem**: Users can submit their own hidden gems with image uploads.
-   **Admin Dashboard**: Admins can view, approve, or reject submitted gems.
-   **User Profile**: Users can view their submissions and edit their profile.
-   **Responsive Design**: Optimized for both desktop and mobile devices.

## Technologies Used

-   **Frontend**: HTML, Tailwind CSS, Alpine.js
-   **Backend**: Node.js, Express.js
-   **Database**: SQLite (via Sequelize ORM)
-   **File Uploads**: Multer

## Notes

-   Uploaded images are stored in the `src/uploads` directory.
-   The database file `database.sqlite` will be created automatically upon the first run.
