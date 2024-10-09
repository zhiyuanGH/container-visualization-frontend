// src/styles/cytoscapeStylesheet.ts
import { Stylesheet } from 'cytoscape';

export const cytoscapeStylesheet: Stylesheet[] = [
  // General node style
  {
    selector: 'node',
    style: {
      'label': 'data(label)',
      'text-valign': 'center',
      'text-halign': 'center',
      'background-color': '#2496ED', // Docker Blue
      'color': '#FFFFFF',
      'shape': 'round-rectangle',
      'font-size': '12px',
      'text-wrap': 'wrap',
      'text-max-width': '80px',
      'width': 'label', // Auto-size based on label
      'height': 'label',
    },
  },
  // Host node style (parent nodes)
  {
    selector: ':parent',
    style: {
      'background-color': '#F0F8FF', // Alice Blue
      'background-opacity': 0.5,
      'border-color': '#2496ED',
      'border-width': 2,
      'label': 'data(label)',
      'text-valign': 'top',
      'text-halign': 'center',
      'padding-top': '20px',
      'padding-left': '20px',
      'padding-bottom': '20px',
      'padding-right': '20px',
      'color': '#000000', // Black text
    },
  },
  // Network node style
  {
    selector: 'node[?isNetwork]',
    style: {
      'shape': 'hexagon',
      'background-color': '#1E90FF', // Dodger Blue
      'label': 'data(label)',
      'text-valign': 'center',
      'text-halign': 'center',
      'color': '#FFFFFF',
      'width': '60px',
      'height': '60px',
    },
  },
  // Network interface node style
  {
    selector: 'node[?isInterface]',
    style: {
      'shape': 'ellipse',
      'background-color': '#FFD700', // Gold
      'label': 'data(label)',
      'text-valign': 'center',
      'text-halign': 'center',
      'color': '#000000',
      'width': '60px',
      'height': '60px',
    },
  },
  // Container node style
  {
    selector: 'node[?isContainer]',
    style: {
      'shape': 'rectangle',
      'background-color': '#00A6FB', // Lighter blue
      'label': 'data(label)',
      'text-valign': 'center',
      'text-halign': 'center',
      'color': '#FFFFFF',
      'width': '70px',
      'height': '35px',
    },
  },
  // Edge style with labels
  {
    selector: 'edge',
    style: {
      'curve-style': 'bezier',
      'width': 2,
      'line-color': '#A9A9A9', // Dark gray
      'target-arrow-shape': 'triangle',
      'target-arrow-color': '#A9A9A9',
      'label': 'data(label)',
      'font-size': '10px',
      'text-rotation': 'autorotate',
      'text-margin-y': -10,
      'color': '#000000',
    },
  },
];
