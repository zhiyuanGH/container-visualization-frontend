// src/components/ContainerInfoModal.tsx
import React from 'react';
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Divider,
  Grid,
  Paper,
  LinearProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';

interface ContainerInfoModalProps {
  data: {
    containerID: string;
    stats: any;
    logs: string;
  };
  onClose: () => void;
}

// Styled components using Material-UI's styled API
const ModalBox = styled(Box)(({ theme }) => ({
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  maxWidth: '800px',
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[5],
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  outline: 'none',
}));

const CloseButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute' as 'absolute',
  right: theme.spacing(2),
  top: theme.spacing(2),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(1),
}));

const LogsContainer = styled(Paper)(({ theme }) => ({
  maxHeight: '200px',
  overflowY: 'auto',
  backgroundColor: theme.palette.grey[100],
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
}));

const MonoTypography = styled(Typography)(({ theme }) => ({
  wordWrap: 'break-word',
  fontFamily: 'monospace',
}));

const ContainerInfoModal: React.FC<ContainerInfoModalProps> = ({ data, onClose }) => {
  // Extract relevant stats
  const cpuUsage = data.stats?.cpu_stats?.cpu_usage?.total_usage;
  const systemCpuUsage = data.stats?.cpu_stats?.system_cpu_usage;
  const cpuPercent =
    cpuUsage && systemCpuUsage
      ? ((cpuUsage / systemCpuUsage) * 100).toFixed(2)
      : 'N/A';

  const memUsage = data.stats?.memory_stats?.usage;
  const memLimit = data.stats?.memory_stats?.limit;
  const memPercent =
    memUsage && memLimit ? ((memUsage / memLimit) * 100).toFixed(2) : 'N/A';
  const memUsageMB = memUsage
    ? (memUsage / 1024 / 1024).toFixed(2)
    : 'N/A';
  const memLimitMB = memLimit
    ? (memLimit / 1024 / 1024).toFixed(2)
    : 'N/A';

  return (
    <Modal open={true} onClose={onClose}>
      <ModalBox>
        <Typography variant="h6" component="h2">
          Container Details
        </Typography>
        <CloseButton aria-label="close" onClick={onClose}>
          <CloseIcon />
        </CloseButton>

        <Divider />

        <SectionTitle variant="subtitle1">
          Basic Information
        </SectionTitle>
        <MonoTypography variant="body2">
          <strong>ID:</strong> {data.containerID}
        </MonoTypography>
        {/* Add other basic info if available */}

        <Divider style={{ marginTop: 16, marginBottom: 16 }} />

        <SectionTitle variant="subtitle1">
          Resource Usage
        </SectionTitle>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2">
              <strong>CPU Usage:</strong>{' '}
              {cpuPercent !== 'N/A' ? `${cpuPercent}%` : 'N/A'}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={cpuPercent !== 'N/A' ? parseFloat(cpuPercent) : 0}
              style={{ marginBottom: 8 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2">
              <strong>Memory Usage:</strong> {memUsageMB} MB / {memLimitMB} MB
            </Typography>
            <LinearProgress
              variant="determinate"
              value={memPercent !== 'N/A' ? parseFloat(memPercent) : 0}
              style={{ marginBottom: 8 }}
            />
            <Typography variant="body2">
              <strong>Memory Usage %:</strong>{' '}
              {memPercent !== 'N/A' ? `${memPercent}%` : 'N/A'}
            </Typography>
          </Grid>
        </Grid>

        <Divider style={{ marginTop: 16, marginBottom: 16 }} />

        <SectionTitle variant="subtitle1">
          Recent Logs
        </SectionTitle>
        <LogsContainer variant="outlined">
          <Typography variant="body2" component="pre">
            {data.logs ? data.logs : 'No logs available.'}
          </Typography>
        </LogsContainer>
      </ModalBox>
    </Modal>
  );
};

export default ContainerInfoModal;
