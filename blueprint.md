
# Blueprint

## Overview

This application is a media analysis tool that allows users to upload images, videos, and audio files for analysis. It provides a dashboard to view the analysis results. The application is built with Next.js and uses MongoDB for data storage.

## Features

*   **File Upload:** Users can upload media files through a drag-and-drop interface.
*   **Media Analysis:** The application analyzes the uploaded media files using a mock detection service to determine if they are real or fake.
*   **Dashboard:** A dashboard displays the analysis results in a card-based layout. Each card shows the file name, the fabrication percentage, the result, and an explanation.
*   **MongoDB Integration:** The application uses MongoDB to store analysis reports.
*   **API Routes:** The application has API routes for detecting deepfakes (`/api/detect`) and for retrieving analysis reports (`/api/reports`).

## Project Structure

*   **/app:** Contains the application's routes and pages.
*   **/components:** Contains reusable React components.
*   **/lib:** Contains utility functions, including the MongoDB client.
*   **/public:** Contains static assets.
*   **/services:** Contains the media analysis service.
*   **/types:** Contains TypeScript type definitions.

## Current Plan

*   **Dashboard Implementation:** Implemented a new dashboard page to display analysis reports from the database.
*   **Database Integration:** Connected the application to a MongoDB database to store and retrieve analysis reports.
