// src/types/index.ts
export interface NodeData {
    id: string;
    label: string;
    parent?: string;
    isNetwork?: boolean;
    isContainer?: boolean;
    hostIdentifier?: string;
    containerID?: string;
    // Add other properties as needed
  }
  
  export interface EdgeData {
    source: string;
    target: string;
    label?: string;
    // Add other properties as needed
  }
  
  export interface ClusterData {
    nodes: { data: NodeData }[];
    edges: { data: EdgeData }[];
    containers: any[];
  }
  