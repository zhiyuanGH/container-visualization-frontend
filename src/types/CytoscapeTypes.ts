// src/types/CytoscapeTypes.ts
import cytoscape from 'cytoscape';

export interface NodeDataDefinition extends cytoscape.ElementDataDefinition {
  id: string; // 'id' is required
  parent?: string;
  [field: string]: any;
}

export interface NodeDefinition {
  data: NodeDataDefinition;
  position?: cytoscape.Position;
  group?: 'nodes';
  classes?: string;
  selected?: boolean;
  selectable?: boolean;
  locked?: boolean;
  grabbable?: boolean;
  pannable?: boolean;
}

export interface EdgeDataDefinition extends cytoscape.ElementDataDefinition {
  id: string; // 'id' is required
  source: string;
  target: string;
  [field: string]: any;
}

export interface EdgeDefinition {
  data: EdgeDataDefinition;
  position?: cytoscape.Position;
  group?: 'edges';
  classes?: string;
  selected?: boolean;
  selectable?: boolean;
  locked?: boolean;
  grabbable?: boolean;
  pannable?: boolean;
}
