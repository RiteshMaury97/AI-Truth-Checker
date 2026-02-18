
# Project Blueprint

## Overview

A Next.js application for detecting deepfakes in images and videos. The application provides a simple interface for users to upload a file and view the analysis results.

## Design and Features

### Styling

- **Framework:** Tailwind CSS
- **Global Styles:** `src/styles/globals.css`
- **PostCSS:** `postcss.config.js`
- **Tailwind Config:** `tailwind.config.js`

### Components

- **Navbar (`src/components/Navbar.tsx`):** The main navigation bar for the application.
- **Footer (`src/components/Footer.tsx`):** The footer for the application.
- **FileUpload (`src/components/FileUpload.tsx`):** A component for uploading files and displaying analysis results.
- **Member (`src/components/Member.tsx`):** A component for displaying team members.
- **InfoCard (`src/components/InfoCard.tsx`):** A component for displaying information in a card format.
- **Hero (`src/components/Hero.tsx`):** The hero section for the landing page.

### Pages

- **Homepage (`src/app/page.tsx`):** The main landing page of the application.
- **Detection (`src/app/detection/page.tsx`):** The page for uploading files and viewing analysis results.
- **Report (`src/app/report/page.tsx`):** The page for viewing detailed analysis reports.
- **About (`src/app/about/page.tsx`):** The page for information about the application and its creators.

### API Routes

- **`/api/detect` (`src/app/api/detect/route.ts`):** The API endpoint for analyzing uploaded files.

## Current Task: Refine Landing Page

### Plan

1.  **Create the `Hero` component.**
    -   [x] Create the `Hero.tsx` file in the `src/components` directory.
    -   [x] Add a title, subtitle, and buttons for "Upload Media" and "Learn More."
    -   [x] Apply a dark AI theme with a gradient background.
2.  **Update the home page.**
    -   [x] Replace the content of `src/app/page.tsx` with the new `Hero` component.
3.  **Refine the `Hero` component.**
    -   [x] Make the hero section full-screen to remove whitespace.
    -   [x] Remove the container from the main layout to allow the hero section to be full-width.
    -   [x] Verify that all other pages have their own container.
