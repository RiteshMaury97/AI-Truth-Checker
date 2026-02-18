# Blueprint

## Overview

This application is a media analysis tool that allows users to upload images, videos, and audio files for analysis. It provides a dashboard to view the analysis results.

## Features

*   **File Upload:** Users can upload media files through a drag-and-drop interface.
*   **Media Analysis:** The application analyzes the uploaded media files to determine if they are real or fake.
*   **Dashboard:** A dashboard displays the analysis results, including overall statistics and a table of all analyzed files.
*   **Theme Switcher:** Users can switch between light and dark modes.

## Project Structure

*   **/app:** Contains the application's routes and pages.
*   **/components:** Contains reusable React components.
*   **/lib:** Contains utility functions, including the MongoDB client.
*   **/public:** Contains static assets, including uploaded media files.
*   **/services:** Contains the media analysis service.
*   **/types:** Contains TypeScript type definitions.

## Current Plan

*   **Integrate MongoDB:** Add MongoDB to store and manage uploaded media files.
*   **Create API Route:** Create a new API route to handle file uploads and save metadata to MongoDB.
*   **Update Frontend:** Modify the frontend to send uploaded files to the new API route.
*   **Update Dashboard:** Update the dashboard to fetch and display data from MongoDB.
