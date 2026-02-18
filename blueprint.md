# Blueprint

## Overview

This application is a media analysis tool that allows users to upload images, videos, and audio files for analysis. It provides a dashboard to view the analysis results. The application is built with Next.js and uses MongoDB for data storage.

## Features

*   **File Upload:** Users can upload media files through a drag-and-drop interface.
*   **Media Analysis:** The application analyzes the uploaded media files using the OpenAI API to determine if they are real or fake.
*   **Dashboard:** A dashboard displays the analysis results in a card-based layout, grouped by date. Each card shows the file name, media type, a preview of the file (using the ImageKit URL), the fabrication percentage, the result status, and the analysis date.
*   **Theme Switcher:** Users can switch between light and dark modes.
*   **MongoDB Integration:** The application uses MongoDB to store media upload and analysis report data.
*   **Separate Collections:** The media uploads and analysis reports are stored in separate collections, linked by an `ObjectId` reference.
*   **Dashboard API:** A dedicated API endpoint (`/api/dashboard/reports`) provides the dashboard with enriched and sorted analysis data.
*   **Date-wise Grouping (Backend):** The API now groups analysis reports by date.

## Project Structure

*   **/app:** Contains the application's routes and pages.
*   **/components:** Contains reusable React components.
*   **/lib:** Contains utility functions, including the MongoDB client.
*   **/public:** Contains static assets.
*   **/services:** Contains the media analysis service and the ImageKit service.
*   **/types:** Contains TypeScript type definitions.

## Current Plan

*   **Dashboard Report Card:** The `ReportCard` component has been updated to display the media type, in addition to the other report details.
