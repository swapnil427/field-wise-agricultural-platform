import React from 'react';
import CommunityChat from '../components/CommunityChat';

const Community: React.FC = () => {
  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '2rem' 
    }}>
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '2rem' 
      }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: 'bold', 
          marginBottom: '0.5rem' 
        }}>
          Community Hub
        </h1>
        <p style={{ color: '#666' }}>
          Connect with fellow farmers, share knowledge, and get expert advice
        </p>
      </div>

      <CommunityChat />

      <div style={{ 
        marginTop: '2rem', 
        padding: '1rem', 
        border: '1px solid #ddd', 
        borderRadius: '8px',
        backgroundColor: '#f8f9fa'
      }}>
        <h3 style={{ marginBottom: '1rem' }}>Community Guidelines</h3>
        <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
          <li>Be respectful and helpful to all community members</li>
          <li>Share accurate and helpful information</li>
          <li>Help fellow farmers with their questions</li>
          <li>Report spam, abuse, or inappropriate content</li>
          <li>Use private chat for personal discussions</li>
          <li>Keep discussions relevant to agriculture</li>
        </ul>
      </div>
    </div>
  );
};

export default Community;
