// Centralized theme constants for the TODO App
// See docs/ui-guidelines.md for the complete design system

export const colors = {
  // Primary palette
  primary: '#1976d2',
  secondary: '#ff9800',
  background: '#f5f5f5',
  text: '#212121',
  completedTask: '#9e9e9e',

  // Priority badge colors
  priority: {
    P1: '#f44336', // red
    P2: '#ff9800', // orange
    P3: '#7A7A7A', // gray
  },

  // Priority selector colors
  prioritySelector: {
    selected: '#07F3E6', // blue
    selectedHover: '#06d9cf',
    unselected: '#7A7A7A', // gray
    unselectedHover: '#666',
  },

  // Additional UI colors
  error: '#f44336',
  white: '#fff',
  black: '#000',
};

export const spacing = {
  unit: 8, // 8px grid system
};

export default {
  colors,
  spacing,
};
