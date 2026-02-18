
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

### Pages

- **Homepage (`src/app/page.tsx`):** The main landing page of the application.
- **Detection (`src/app/detection/page.tsx`):** The page for uploading files and viewing analysis results.
- **Report (`src/app/report/page.tsx`):** The page for viewing detailed analysis reports.
- **About (`src/app/about/page.tsx`):** The page for information about the application and its creators.

### API Routes

- **`/api/detect` (`src/app/api/detect/route.ts`):** The API endpoint for analyzing uploaded files.

## Current Task: Improve UI and Add New Pages

### Plan

1.  **Improve the styling of existing components.**
    -   [x] Add modern styling to the `Navbar` component.
    -   [x] Add modern styling to the `Footer` component.
    -   [x] Add modern styling to the `FileUpload` component, including a drag-and-drop feature.
2.  **Create new pages.**
    -   [x] Create the `Detection` page (`src/app/detection/page.tsx`).
    -   [x] Create the `Report` page (`src/app/report/page.tsx`).
    -   [x] Create the `About` page (`src/app/about/page.tsx`).
3.  **Enhance the `About` page.**
    -   [x] Create a new `Member` component for the "Meet the Team" section.
    -   [x] Add sections for "Our Mission," "Our Technology," and "Meet the Team."
    -   [x] Add professional-looking icons and styling.
    -   [x] Add a link to the `About` page in the `Navbar`.
4.  **Enhance the `Report` page.**
    -   [x] Create a new `InfoCard` component for displaying information.
    -   [x] Add sections for "File Information" and "Analysis Details."
    -   [x] Add a "Download Report" button.
