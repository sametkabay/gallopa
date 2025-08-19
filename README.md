# 🐎 Gallopa - Horse Racing Simulation

Interactive horse racing simulation application developed with Vue 3, TypeScript, and Vuetify.

## 📋 Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [Development](#development)
- [Contributing](#contributing)

## 🎯 About the Project

Gallopa is a web application that provides a realistic horse racing simulation. You can organize races with 6 rounds using 20 different horses, track their performance, and view race results.

### 🏇 Core Features

- **20 Different Horses**: Each horse has unique color, name, and performance values
- **6 Round Races**: Distances ranging from 1200m to 2200m
- **Real-time Simulation**: Live race tracking
- **Performance System**: Movement calculation based on horse condition values
- **Speed Control**: 3 different race speeds (Medium, Fast, Very Fast)
- **Result Tracking**: Detailed result list for each round

## ✨ Features

### 🐴 Horse System
- **20 Unique Horses**: Thunderbolt, Silver Arrow, Black Beauty, Golden Star, and more
- **Color Diversity**: Chestnut, Gray, Black, Palomino, Light Blue, and more
- **Condition System**: Random performance value between 1-100
- **Visual Representation**: Each horse has its own color code

### 🏁 Racing System
- **6 Rounds**: Each round has different distance (1200m - 2200m)
- **10 Horses**: 10 horses race in each round
- **Random Selection**: Horses are randomly distributed to rounds
- **Real-time**: Live race simulation

### 🎮 Control System
- **Start/Pause**: Start and pause the race
- **Reset**: Reset the entire race
- **Speed Control**: 3 different race speeds
- **Round Transition**: Automatic round progression

### 📊 Result System
- **Live Tracking**: Position tracking during the race
- **Final Rankings**: Final results for each round
- **Horse Selection**: Select horses to view detailed information
- **Performance Analysis**: Performance based on condition values

## 🛠 Technology Stack

### Frontend
- **Vue 3**: Modern reactive framework
- **TypeScript**: Type safety
- **Vuetify 3**: Material Design UI framework
- **Vuex 4**: State management
- **Composition API**: Modern Vue 3 syntax

### Build Tools
- **Vite**: Fast build tool
- **Vue TSC**: TypeScript compiler
- **Auto Import**: Automatic component import

### Development
- **ESLint**: Code quality
- **Prettier**: Code formatting
- **Hot Reload**: Automatic refresh during development

## 📁 Project Structure

```
gallopa/
├── public/                 # Static files
│   ├── grass.jpg          # Race track background
│   ├── horse100.jpg       # Horse images
│   └── racehorse.json     # Lottie animation
├── src/
│   ├── components/        # Vue components
│   │   ├── arena.vue      # Race arena
│   │   ├── horse-list.vue # Horse list
│   │   ├── horse.vue      # Single horse component
│   │   ├── info-box.vue   # Info box
│   │   ├── line.vue       # Race line
│   │   └── round-list.vue # Round list
│   ├── model/             # TypeScript models
│   │   ├── horse.ts       # Horse model
│   │   ├── round.ts       # Round model
│   │   └── speed.ts       # Speed constants
│   ├── store/             # Vuex store
│   │   ├── index.ts       # Main store
│   │   ├── horse-list.ts  # Horse list data
│   │   ├── round-list.ts  # Round list data
│   │   └── untils.ts      # Utility functions
│   ├── types/             # Type definitions
│   ├── App.vue            # Main application component
│   ├── main.ts            # Application entry point
│   └── style.css          # Global styles
├── package.json           # Project dependencies
├── vite.config.ts         # Vite configuration
└── tsconfig.json          # TypeScript configuration
```

## 🚀 Installation

### Requirements
- Node.js 16+ 
- npm or yarn

### Steps

1. **Clone the project**
```bash
git clone <repository-url>
cd gallopa
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Start development server**
```bash
npm run dev
# or
yarn dev
```

4. **Open in browser**
```
http://localhost:5173
```

## 🎮 Usage

### Starting a Race
1. **Horse Selection**: Select a horse from the left panel
2. **Speed Setting**: Choose Medium, Fast, or Very Fast
3. **Start**: Click "Start Round X" button
4. **Watch**: Track the race live

### Controls
- **Start/Pause**: Start and pause the race
- **Reset**: Reset the entire race
- **Speed Control**: Change race speed (only before race starts)

### Result Tracking
- **Live Position**: Track horse positions during the race
- **Final Results**: Final rankings for each round
- **Horse Details**: Select horses to view condition values

## 🔧 Development

### Script Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Build preview
npm run preview
```

### Code Standards

- **TypeScript**: Strict mode enabled
- **Vue 3**: Composition API usage
- **Vuetify**: Material Design components
- **Naming**: kebab-case file names, camelCase variables

### State Management

Vuex store structure:
- **State**: Application state
- **Getters**: Computed values
- **Mutations**: State changes
- **Actions**: Async operations

### Component Structure

Each component:
- TypeScript type definitions
- Composition API
- Scoped CSS
- Vuetify components

## 🤝 Contributing

1. **Fork** the project
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Vue.js team
- Vuetify team
- Vite team
- All contributors

---

**Gallopa** - Horse racing simulation developed with modern web technologies 🐎
