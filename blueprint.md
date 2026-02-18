
# Project Blueprint

## Overview

A Next.js application for detecting deepfakes in images and videos. The application provides a simple interface for users to upload a file and view the analysis results.

## Design and Features

### Styling

- **Framework:** Tailwind CSS
- **Global Styles:** `src/styles/globals.css`
- **PostCSS:** `postcss.config.js`
- **Tailwind Config:** `tailwind.config.js`

### Features

- **Dark/Light Mode:** The application now supports a dark and light mode theme, with a theme switcher in the navigation bar.
- **Sample Files:** A section on the homepage provides sample files for users to try the analysis feature.
- **FAQ:** A frequently asked questions section has been added to the homepage to provide users with more information about the application.
- **API Integration:** The frontend is now integrated with the back-end API for media analysis.

### Components

- **Navbar (`src/components/Navbar.tsx`):** The main navigation bar for the application.
- **Footer (`src/components/Footer.tsx`):** The footer for the application.
- **MultiUploadBox (`src/components/MultiUploadBox.tsx`):** A component for uploading multiple files with drag-and-drop support, file previews, and removal functionality.
- **Member (`src/components/Member.tsx`):** A component for displaying team members.
- **InfoCard (`src/components/InfoCard.tsx`):** A component for displaying information in a card format.
- **Hero (`src/components/Hero.tsx`):** The hero section for the landing page.
- **ThemeProvider (`src/components/ThemeProvider.tsx`):** A component for managing the application's theme.
- **ThemeSwitcher (`src/components/ThemeSwitcher.tsx`):** A component for switching between dark and light mode.
- **SampleFiles (`src/components/SampleFiles.tsx`):** A component for displaying sample files.
- **FAQ (`src/components/FAQ.tsx`):** A component for displaying frequently asked questions.
- **ScannerAnimation (`src/components/ScannerAnimation.tsx`):** A component for displaying a scanning animation during analysis.

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

## Current Task: Integrate AI Analysis Service

### Plan

1.  **Integrate the `aiService` with the `HomePage` component.**
    -   [x] Update the `handleDetection` function to call the `analyzeMedia` service for each uploaded file.
    -   [x] Use `Promise.all` to handle multiple API requests concurrently.
    -   [x] Update the component's state with the analysis results returned from the API.
    -   [x] Add error handling to gracefully manage API errors.
2.  **Update the project blueprint.**
    -   [x] Update the `blueprint.md` file to reflect the integration of the AI analysis service.
3.  **Lint the project.**
    -   [x] Run `npm run lint` to check for any new warnings or errors.
