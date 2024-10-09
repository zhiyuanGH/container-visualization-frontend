// src/components/ClusterGraph.tsx
import React, { useEffect, useState, useRef } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import cytoscape, { EventObjectNode } from 'cytoscape';
import klay from 'cytoscape-klay';
import { cytoscapeStylesheet } from '../styles/cytoscapeStylesheet';
import ContainerInfoModal from './ContainerInfoModal';
import { NodeDefinition, EdgeDefinition } from '../types/CytoscapeTypes';

cytoscape.use(klay);

interface ClusterGraphProps {
  data: {
    nodes: NodeDefinition[];
    edges: EdgeDefinition[];
  };
}

interface ModalData {
  containerID: string;
  stats: any;
  logs: string;
}

const ClusterGraph: React.FC<ClusterGraphProps> = ({ data }) => {
  const [elements, setElements] = useState<(NodeDefinition | EdgeDefinition)[]>([]);
  const [modalData, setModalData] = useState<ModalData | null>(null);
  const cyRef = useRef<cytoscape.Core>();

  const dockerHosts = [
    'http://192.168.116.148:8080',
    'http://192.168.116.150:8080',
  ];

  useEffect(() => {
    const validNodeIds = data.nodes.map((node) => node.data.id);
    const validEdges = data.edges.filter(
      (edge) =>
        validNodeIds.includes(edge.data.source) &&
        validNodeIds.includes(edge.data.target)
    );

    setElements([...data.nodes, ...validEdges]);

    if (cyRef.current) {
      updateEdgeBandwidthLabels();
    }
  }, [data]);

  const prevStatsRef = useRef<{ [key: string]: any }>({});

  const updateEdgeBandwidthLabels = () => {
    if (!cyRef.current) return;
  
    const currentStats: { [key: string]: any } = {};
  
    data.nodes.forEach((node) => {
      if (node.data.isInterface && node.data.stats) {
        currentStats[node.data.id] = node.data.stats;
      }
    });
  
    data.edges.forEach((edgeData) => {
      const edge = cyRef.current!.getElementById(edgeData.data.id);
      if (edge && edge.length > 0) {
        const sourceNode = edge.source();
        const targetNode = edge.target();
  
        if (!sourceNode.empty() && !targetNode.empty()) {
          const sourceIsInterface = sourceNode.data('isInterface');
          const targetIsInterface = targetNode.data('isInterface');
  
          if (sourceIsInterface && targetIsInterface) {
            const sourceID = sourceNode.data('id') as string;
            const targetID = targetNode.data('id') as string;
  
            const prevSourceStats = prevStatsRef.current[sourceID];
            const currSourceStats = currentStats[sourceID];
  
            if (prevSourceStats && currSourceStats) {
              const deltaBytesSent =
                currSourceStats.bytesSent - prevSourceStats.bytesSent;
              const deltaBytesRecv =
                currSourceStats.bytesRecv - prevSourceStats.bytesRecv;
  
              const bandwidthSent = deltaBytesSent / (5 * 1024 * 1024);
              const bandwidthRecv = deltaBytesRecv / (5 * 1024 * 1024);
  
              const bandwidth = (bandwidthSent + bandwidthRecv).toFixed(2);
  
              edge.data('label', `${bandwidth} MB/s`);
            }
          }
        }
      }
    });
  
    prevStatsRef.current = currentStats;
  };
  

  useEffect(() => {
    const interval = setInterval(() => {
      updateEdgeBandwidthLabels();
    }, 5000);

    return () => clearInterval(interval);
  }, [data]);

  const handleNodeClick = async (event: EventObjectNode) => {
    const node = event.target;
    const isContainer = node.data('isContainer');

    if (isContainer) {
      const containerID = node.data('containerID');
      const hostIdentifier = node.data('hostIdentifier');

      const hostURL = dockerHosts.find((url) =>
        url.includes(hostIdentifier)
      );
      if (!hostURL) {
        alert('Host not found');
        return;
      }

      try {
        const response = await fetch(
          `${hostURL}/api/container/${containerID}`
        );
        const data = await response.json();

        setModalData({
          containerID,
          stats: data.stats,
          logs: data.logs,
        });
      } catch (error) {
        console.error('Error fetching container details:', error);
        alert('Failed to fetch container details');
      }
    }
  };

  return (
    <div style={{ height: '80vh', width: '100%', overflowY: 'auto' }}>
      <CytoscapeComponent
        elements={elements}
        style={{ width: '100%', height: '100%' }}
        stylesheet={cytoscapeStylesheet}
        cy={(cy) => {
          cyRef.current = cy;
          cy.on('tap', 'node', handleNodeClick);
          cy.userZoomingEnabled(false);
        }}
        layout={
          {
            name: 'klay',
            nodeDimensionsIncludeLabels: true,
            fit: true,
            padding: 50,
            klay: {
              spacing: 50,
              edgeSpacingFactor: 1.2,
              direction: 'RIGHT',
              compactComponents: true,
            },
          } as any
        }
      />
      {modalData && (
        <ContainerInfoModal
          data={modalData}
          onClose={() => setModalData(null)}
        />
      )}
    </div>
  );
};

export default ClusterGraph;
