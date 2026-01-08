# DJ PIMPIM - Official Entertainment Platform

A high-performance, high-contrast entertainment website featuring a Mustard/Black industrial aesthetic. The system consists of a **React (Vite/Tailwind)** frontend and a **Spring Boot** backend.

## 🚀 Features

*   **Dual Theme Engine:** 
    *   **Day Mode:** Mustard Background with Black typography.
    *   **Night Mode:** Black Background with Mustard accents.
*   **Dynamic Content:** Tour dates, Merchandise store, and Music discography managed via API.
*   **Admin Dashboard:** Restricted area to upload events, tracks, and merch.
*   **Media Integration:** Supports YouTube and Spotify embeds.

---

## 🛠️ Prerequisites

Before running the project, ensure you have the following installed:

1.  **Node.js** (v18+) - For the frontend.
2.  **Java JDK** (v17+) - For the Spring Boot backend.
3.  **MySQL Database** - For storing data.
4.  **Cloudflare R2 (or S3 compatible storage)** - For image hosting (configured in your backend).

---

## 💻 Local Setup Guide

### 1. Backend Setup (Spring Boot)

1.  Navigate to your backend directory.
2.  Open `src/main/resources/application.properties`.
3.  Update your Database and Cloudflare R2 credentials:
    ```properties
    # Database
    spring.datasource.url=jdbc:mysql://localhost:3306/music_db
    spring.datasource.username=root
    spring.datasource.password=your_password

    # File Storage (R2/S3)
    r2.access-key=YOUR_ACCESS_KEY
    r2.secret-key=YOUR_SECRET_KEY
    r2.bucket=YOUR_BUCKET_NAME
    r2.endpoint=YOUR_CLOUDFLARE_ENDPOINT
    ```
4.  Run the application:
    ```bash
    ./mvnw spring-boot:run
    ```
    *The backend should now be running on `http://localhost:8080`.*

### 2. Frontend Setup (React)

1.  Navigate to the frontend directory.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
4.  Open your browser to `http://localhost:5173`.

---

## ⚙️ Customization & Configuration

Here is how to modify specific parts of the application:

### 1. Changing API Endpoints
The frontend reads the backend URL from a Vite environment variable.

*   **File:** `services/api.ts`
*   **Line:** ~4
*   **Action:** Set `VITE_API_BASE_URL` in `.env.local` (local dev) or in your hosting provider's environment variables (production).
    ```typescript
    // Example values
    // VITE_API_BASE_URL=http://localhost:8080/api
    // VITE_API_BASE_URL=https://music-0o1i.onrender.com/api
    ```

### 2. Social Media Links
To update the Instagram and YouTube links in the **Footer**.

*   **File:** `components/Layout.tsx`
*   **Search for:** `href="#"` inside the `<footer>` section.
*   **Action:** Replace `#` with your actual profile URLs.

### 3. Ticket Vendor Links
The "TICKETS" button on the Tour page currently triggers a redirect alert or login prompt.

*   **File:** `pages/Tour.tsx`
*   **Function:** `handleBook()`
*   **Action:** You can modify this to redirect to the specific `ticketLink` returned from the database:
    ```typescript
    const handleBook = (link: string) => {
        if (!isAuthenticated) requestLogin();
        else window.open(link, '_blank');
    };
    ```

### 4. Hero Image & Backgrounds
The main landing page image.

*   **File:** `pages/Home.tsx`
*   **Search for:** `img src="..."` inside the Hero Section.
*   **Action:** Replace the `picsum.photos` URL with your own asset path or a hosted image URL.

### 5. Theme Colors
To change the signature "Mustard" color.

*   **Files:** `tailwind.config.ts` + `index.css`
*   **Action:** Update `colors.brand-accent` in `tailwind.config.ts` and the matching hard-coded CSS values in `index.css` (background/scrollbar/selection).

### 6. Map Integration
The Tour page links to Google Maps using coordinates.

*   **File:** `pages/Tour.tsx`
*   **Logic:** It constructs a URL using `LocationLatitude` and `LocationLongitude`.
*   **Action:** If you prefer to search by Venue Name instead of coordinates, change the `href` construction:
    ```typescript
    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.venueName + ' ' + event.location)}`}
    ```

---

## 🔐 Admin Access

The current frontend uses a simulated authentication flow for demonstration purposes.

1.  Click **LOGIN** in the navbar.
2.  Select **ADMIN ACCESS**.
3.  Go to **DASHBOARD** (appears in nav) to access forms for:
    *   Creating Events
    *   Uploading Merchandise
    *   Adding Tracks

*Note: In a production environment, you should integrate JWT authentication in `context/AuthContext.tsx` to communicate with your Spring Security endpoints.*
