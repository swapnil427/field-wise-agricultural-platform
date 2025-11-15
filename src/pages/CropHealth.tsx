import React from 'react';
import CropDiseaseDetector from '../components/CropDiseaseDetector';

const CropHealth: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', background: '#f7fafc' }}>
      <CropDiseaseDetector />
    </div>
  );
};

export default CropHealth;
