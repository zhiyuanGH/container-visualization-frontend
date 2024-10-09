// src/App.tsx
import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import ClusterGraph from './components/ClusterGraph';
import ClusterTable from './components/ClusterTable';

import { NodeDefinition, EdgeDefinition } from './types/CytoscapeTypes';

function App() {
  const [view, setView] = useState<'graph' | 'table'>('graph');
  const [data, setData] = useState<{
    nodes: NodeDefinition[];
    edges: EdgeDefinition[];
    containers: any[];
  }>({ nodes: [], edges: [], containers: [] });

  const dockerHosts = [
    'http://192.168.116.148:8080/api/cluster',
    'http://192.168.116.150:8080/api/cluster',
    // Add more hosts as needed
  ];

  useEffect(() => {
    fetchClusterData();
    const interval = setInterval(fetchClusterData, 5000); // Fetch data every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchClusterData = async () => {
    const allNodes: NodeDefinition[] = [];
    const allEdges: EdgeDefinition[] = [];
    const allContainers: any[] = [];

    await Promise.all(
      dockerHosts.map(async (hostURL) => {
        try {
          const response = await fetch(hostURL);
          const clusterData = await response.json();

          const hostIdentifier = new URL(hostURL).hostname;

          // Adjust nodes
          const nodes: NodeDefinition[] = clusterData.nodes.map((node: any) => {
            if (!node.data || !node.data.id) {
              console.warn('Node data or id is undefined', node);
              return null;
            }
            const newNode: NodeDefinition = { data: { ...node.data } };
            const originalID = node.data.containerID || node.data.id;

            // Adjust node ID
            newNode.data.id = `${hostIdentifier}_${node.data.id}`;

            // Adjust parent ID
            if (node.data.parent) {
              newNode.data.parent = `${hostIdentifier}_${node.data.parent}`;
            } else {
              newNode.data.parent = `${hostIdentifier}_localhost`;
            }

            // Set flags for styling
            if (node.data.isNetwork) newNode.data.isNetwork = true;
            if (node.data.isInterface) newNode.data.isInterface = true;

            if (node.data.isContainer) {
              newNode.data.isContainer = true;
              newNode.data.hostIdentifier = hostIdentifier;
              newNode.data.containerID = originalID;

              // Collect container data for the table
              allContainers.push({
                name: node.data.label,
                image: node.data.image,
                status: node.data.status,
                hostIdentifier,
                containerID: originalID,
              });
            }

            // Include stats if available
            if (node.data.stats) {
              newNode.data.stats = node.data.stats;
            }

            return newNode;
          }).filter(Boolean); // Remove nulls

          // Adjust edges
          const edges: EdgeDefinition[] = clusterData.edges.map((edge: any) => {
            if (!edge.data || !edge.data.id) {
              console.warn('Edge data or id is undefined', edge);
              return null;
            }
            const newEdge: EdgeDefinition = { data: { ...edge.data } };
            // Adjust source and target IDs
            newEdge.data.source = `${hostIdentifier}_${edge.data.source}`;
            newEdge.data.target = `${hostIdentifier}_${edge.data.target}`;
            // Adjust edge ID
            newEdge.data.id = `${hostIdentifier}_${edge.data.id}`;
            return newEdge;
          }).filter(Boolean); // Remove nulls

          // Add host node
          nodes.push({
            data: {
              id: `${hostIdentifier}_localhost`,
              label: hostIdentifier,
            },
          } as NodeDefinition);

          allNodes.push(...nodes);
          allEdges.push(...edges);
        } catch (error) {
          console.error(`Error fetching data from ${hostURL}:`, error);
        }
      })
    );

    // Connect host interfaces between hosts
    // Include interfaces named 'ens33' or 'eth0'
    const hostInterfaces = allNodes.filter(
      (node) =>
        node.data.isInterface &&
        (node.data.id.endsWith('_ens33') )
    );


    // Create edges between host interfaces
    for (let i = 0; i < hostInterfaces.length; i++) {
      for (let j = i + 1; j < hostInterfaces.length; j++) {
        const sourceInterface = hostInterfaces[i];
        const targetInterface = hostInterfaces[j];

        if (!sourceInterface.data || !sourceInterface.data.id) {
          console.warn('Source interface data or id is undefined', sourceInterface);
          continue;
        }
        if (!targetInterface.data || !targetInterface.data.id) {
          console.warn('Target interface data or id is undefined', targetInterface);
          continue;
        }

        // Create an edge between the interfaces
        allEdges.push({
          data: {
            id: `${sourceInterface.data.id}-${targetInterface.data.id}`,
            source: sourceInterface.data.id,
            target: targetInterface.data.id,
            label: 'Inter-host Connection',
          },
        } as EdgeDefinition);
      }
    }

    setData({ nodes: allNodes, edges: allEdges, containers: allContainers });
  };

  const toggleView = () => {
    setView((prevView) => (prevView === 'graph' ? 'table' : 'graph'));
  };

  return (
    <div>
      <Navbar view={view} onToggleView={toggleView} />
      {view === 'graph' ? (
        <ClusterGraph data={data} />
      ) : (
        <ClusterTable data={data} />
      )}
    </div>
  );
}

export default App;
