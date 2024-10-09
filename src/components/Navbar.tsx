// src/components/Navbar.tsx
import React from 'react';
import { AppBar, Toolbar, Typography, Switch } from '@mui/material';

interface NavbarProps {
  view: string;
  onToggleView: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ view, onToggleView }) => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Docker Cluster Visualization
        </Typography>
        <Typography variant="body1">
          {view === 'graph' ? 'Graph View' : 'Table View'}
        </Typography>
        <Switch checked={view === 'table'} onChange={onToggleView} />
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
