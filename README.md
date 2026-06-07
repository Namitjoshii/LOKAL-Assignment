🎵 Lokal Music Player

A modern music player built with React Native, Expo, TypeScript, and Zustand.

The application allows users to discover artists, browse songs, play music, manage playback, and navigate seamlessly through a clean mobile-first interface.

📖 Overview

This project was built to explore how a real-world music application handles:

Audio playback
State management
Navigation
API integration
Queue management
Background playback
Component architecture

While building the application, one of the biggest challenges was managing audio state across multiple screens.

A song can be started from an Artist screen, controlled from the Mini Player, and continued inside the Full Player.

Instead of passing data through multiple layers of components (prop drilling), I used Zustand to maintain a centralized audio store that can be accessed anywhere in the application.

✨ Features
🎤 Artist Discovery
Browse artists fetched from API
Artist detail screens
Artist song listings
🎵 Audio Playback
Play Songs
Pause Songs
Resume Playback
Seek Through Tracks
Progress Tracking
⏭️ Queue Navigation
Previous Track
Next Track
Continuous Playback

The currently loaded artist song list acts as the playback queue.

🔀 Shuffle Mode
Random song playback
One-tap shuffle support
🔁 Repeat Mode
Replay current song automatically after completion
📱 Mini Player
Persistent mini-player
Quick play/pause controls
One-tap access to full player screen
📑 Additional Sections
Favourites
Playlists
Settings

These sections are structured and prepared for future expansion.

🏗️ Tech Stack
Frontend
React Native
Expo
TypeScript
State Management
Zustand
Navigation
React Navigation
Bottom Tabs
Native Stack Navigation
Audio Playback
Expo AV
Networking
Axios
Backend API
JioSaavn API Wrapper
🏛️ Architecture
API Layer
    ↓
Service Layer
    ↓
Zustand Store
    ↓
Screens
    ↓
Audio Player

The application follows a layered architecture that separates networking, state management, and presentation logic.

This makes the codebase easier to maintain and scale.

📂 Project Structure
src
│
├── components
│   ├── AlbumsContent.tsx
│   ├── ArtistsContent.tsx
│   ├── MiniPlayer.tsx
│   ├── SongCard.tsx
│   └── SuggestedContent.tsx
│
├── navigation
│   └── AppNavigator.tsx
│
├── screens
│   ├── HomeScreen.tsx
│   ├── SearchScreen.tsx
│   ├── ArtistScreen.tsx
│   ├── AlbumScreen.tsx
│   ├── PlayerScreen.tsx
│   ├── FavouritesScreen.tsx
│   ├── PlaylistsScreen.tsx
│   └── SettingsScreen.tsx
│
├── services
│   ├── saavnApi.ts
│   ├── songService.ts
│   ├── artistService.ts
│   └── albumService.ts
│
├── store
│   └── playerStore.ts
│
├── types
│   └── song.ts
│
└── utils
    └── decodeHtml.ts
🧩 Folder Responsibilities
Components

Contains reusable UI elements used throughout the application.

Examples:

Artist Cards
Album Cards
Song Cards
Mini Player

These components help keep screens clean and reduce code duplication.

Screens

Responsible for rendering complete application views.

Examples:

Home Screen
Artist Screen
Album Screen
Player Screen

Each screen focuses on presentation and user interaction.

Services

All API communication is isolated inside the services layer.

Examples:

Artist Search
Song Search
Album Fetching
Artist Song Fetching

Separating API logic from UI components keeps the codebase more maintainable.

Store

The global audio state is managed using Zustand.

The store manages:

Current Song
Audio Instance
Playback Status
Queue
Shuffle State
Repeat State
Recently Played Songs

One reason for choosing Zustand was to avoid prop drilling.

Without a global store, song data would need to be passed through multiple screens and components.

With Zustand, any component can directly access playback state whenever needed.

🎵 Audio Playback Flow
When a song is selected
Previous audio instance is unloaded
New audio source is loaded
Song starts playing immediately
Global state updates
Recently played list updates
When playback finishes
Repeat Enabled
Current Song Ends
        ↓
Replay Same Song
Repeat Disabled
Current Song Ends
        ↓
Play Next Song From Queue
🔀 Shuffle Logic

When shuffle mode is enabled:

Current Queue
      ↓
Random Song Selection
      ↓
Playback

A random track is selected from the active queue whenever the user moves to the next track.

📱 Mini Player

The mini player remains accessible across navigation flows.

Benefits:

Playback controls remain available
User can continue browsing content
Fast access to full player screen

This provides a music-app-like experience similar to modern streaming applications.

🧹 Utility Functions
decodeHtml.ts

The music API occasionally returns HTML encoded strings.

Examples:

Arijit Singh &amp; Shreya Ghoshal
Rock &#039;n Roll

Displaying these values directly would create a poor user experience.

To solve this, a custom utility function was introduced that decodes HTML entities before rendering.

Output becomes:

Arijit Singh & Shreya Ghoshal
Rock 'n Roll

Although small, this significantly improves text rendering consistency throughout the application.

🚀 Performance Decisions
Zustand Instead of Prop Drilling

Rather than passing song information through:

Home
 ↓
Artist
 ↓
Player
 ↓
Mini Player

a centralized Zustand store was used.

This reduces complexity and keeps components loosely coupled.

Service Layer Separation

Networking logic was separated from UI components.

Benefits:

Cleaner Screens
Easier Debugging
Better Scalability
Improved Maintainability
📸 Screens Included
Home Screen
Artist Screen
Album Screen
Music Player
Mini Player
Favourites
Playlists
Settings
🔮 Future Improvements

Potential future enhancements include:

Offline Downloads
Playlist Management
Persistent Favourites
Dark Mode
Search Suggestions
Recently Played Screen
Audio Quality Settings
Lyrics Integration
📚 Learnings

Building this project helped me gain practical experience with:

React Native Architecture
Zustand State Management
Audio Playback Systems
API Integration
Mobile Navigation Patterns
EAS Build System
Android Deployment
Application Debugging

One of the biggest takeaways was understanding how quickly a simple music player becomes a state management problem once features like mini players, queues, repeat modes, and playback persistence are introduced.

👨‍💻 Author

Namit Joshi

Built using React Native, Expo, TypeScript, Zustand, and a lot of debugging sessions.

If you are reviewing this project, thank you for your time and feedback.



## ☕ Final Note

If you've reached this section, you've probably spent more time reading this README than I spent getting my first APK to install successfully.

Thank you for checking out the project. 🚀

