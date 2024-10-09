// src/components/ClusterTable.tsx
import React from 'react';
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';

interface ClusterTableProps {
  data: any;
}

const ClusterTable: React.FC<ClusterTableProps> = ({ data }) => {
  const rows: GridRowsProp = data.containers.map((container: any, index: number) => ({
    id: index,
    name: container.name,
    image: container.image,
    status: container.status,
    host: container.hostIdentifier,
    containerID: container.containerID,
  }));

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'image', headerName: 'Image', width: 200 },
    { field: 'status', headerName: 'Status', width: 150 },
    { field: 'host', headerName: 'Host', width: 200 },
  ];

  return (
    <div style={{ height: '80vh', width: '100%' }}>
      <DataGrid rows={rows} columns={columns}  />
    </div>
  );
};

export default ClusterTable;
