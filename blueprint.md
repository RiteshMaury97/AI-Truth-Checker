
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
- **MultiUploadBox (`src/components/MultiUploadBox.tsx`):** A component for uploading multiple files with drag-and-drop support, file previews, and removal functionality.
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

### Services

- **`services/aiService.ts`:** A service for handling API requests to the back-end for media analysis.

### TypeScript Types

- **`types/media.ts`:** Contains reusable TypeScript interfaces for the application.
  - `MediaFile`: Represents a file uploaded by the user.
  - `AnalysisResult`: Represents the result of a deepfake analysis.
  - `ReportRecord`: A composite type that links a `MediaFile` to its `AnalysisResult`.

## Current Task: AI Analysis Service

### Plan

1.  **Create the AI analysis service.**
    -   [x] Create the `services/aiService.ts` file.
    -   [x] Implement the `analyzeMedia` function to send media files to the `/api/detect` endpoint.
