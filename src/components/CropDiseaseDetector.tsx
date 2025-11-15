import React, { useState } from 'react';

interface AnalysisResult {
  confidence: number;
  detectedDisease: {
    name: string;
    severity: string;
    urgency: string;
    symptoms: string[];
    causes: string[];
    treatment: string[];
    aiAnalysis?: string;
  };
  recommendations: string[];
  preventiveMeasures: string[];
  nextSteps: string[];
  analysisMethod: string;
  processingTime: string;
}

const CropDiseaseDetector: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [cropType, setCropType] = useState('wheat');
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const cropTypes = [
    { value: 'wheat', label: '🌾 Wheat' },
    { value: 'rice', label: '🌾 Rice' },
    { value: 'tomato', label: '🍅 Tomato' },
    { value: 'corn', label: '🌽 Corn' },
    { value: 'potato', label: '🥔 Potato' },
    { value: 'cotton', label: '🌿 Cotton' },
    { value: 'soybean', label: '🫘 Soybean' },
    { value: 'sugarcane', label: '🎋 Sugarcane' }
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError('File size must be less than 10MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }

      setSelectedFile(file);
      setError(null);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    console.log('🔬 Starting crop disease analysis...', {
      file: selectedFile.name,
      cropType,
      symptoms
    });

    try {
      const formData = new FormData();
      formData.append('cropImage', selectedFile);
      formData.append('cropType', cropType);
      formData.append('symptoms', symptoms);

      const response = await fetch('http://localhost:8081/api/crop-disease/analyze', {
        method: 'POST',
        body: formData
      });

      console.log('📡 Analysis response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Analysis result received:', data);

      if (data.success && data.analysis) {
        setResult(data.analysis);
      } else {
        throw new Error('Analysis failed - no results received');
      }

    } catch (err: any) {
      console.error('❌ Analysis error:', err);
      setError(`Analysis failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setSelectedFile(null);
    setPreview(null);
    setSymptoms('');
    setResult(null);
    setError(null);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem 1rem'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '2rem',
          color: 'white'
        }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: '700',
            margin: '0 0 0.5rem 0',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}>
            🔬 Crop Disease Detector
          </h1>
          <p style={{ 
            fontSize: '1.1rem', 
            opacity: 0.9
          }}>
            Upload crop images for instant AI-powered disease analysis and treatment recommendations
          </p>
        </div>

        {/* Upload Section */}
        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{
            margin: '0 0 1.5rem 0',
            color: '#2c3e50',
            fontSize: '1.3rem'
          }}>
            📸 Upload Crop Image
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: preview ? '1fr 1fr' : '1fr',
            gap: '2rem',
            alignItems: 'start'
          }}>
            {/* Upload Area */}
            <div>
              <div style={{
                border: '2px dashed #e1e8ed',
                borderRadius: '10px',
                padding: '2rem',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                background: '#f8f9fa'
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = '#667eea';
                e.target.style.background = '#f0f4ff';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = '#e1e8ed';
                e.target.style.background = '#f8f9fa';
              }}
              onClick={() => document.getElementById('file-input')?.click()}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📷</div>
                <p style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: '#2c3e50' }}>
                  Click to upload crop image
                </p>
                <p style={{ margin: '0', fontSize: '0.9rem', color: '#7f8c8d' }}>
                  Supports JPG, PNG, GIF up to 10MB
                </p>
              </div>
              
              <input
                id="file-input"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />

              {/* Crop Type Selection */}
              <div style={{ marginTop: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '600',
                  color: '#2c3e50'
                }}>
                  Select Crop Type:
                </label>
                <select
                  value={cropType}
                  onChange={(e) => setCropType(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e1e8ed',
                    borderRadius: '10px',
                    fontSize: '1rem',
                    background: 'white'
                  }}
                >
                  {cropTypes.map((crop) => (
                    <option key={crop.value} value={crop.value}>
                      {crop.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Symptoms Input */}
              <div style={{ marginTop: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '600',
                  color: '#2c3e50'
                }}>
                  Describe Symptoms (Optional):
                </label>
                <textarea
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="e.g., yellow spots on leaves, wilting, brown patches..."
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e1e8ed',
                    borderRadius: '10px',
                    fontSize: '1rem',
                    resize: 'vertical',
                    minHeight: '100px',
                    fontFamily: 'inherit'
                  }}
                />
              </div>
            </div>

            {/* Preview */}
            {preview && (
              <div>
                <h4 style={{ margin: '0 0 1rem 0', color: '#2c3e50' }}>Image Preview:</h4>
                <img
                  src={preview}
                  alt="Crop preview"
                  style={{
                    width: '100%',
                    maxHeight: '300px',
                    objectFit: 'cover',
                    borderRadius: '10px',
                    border: '2px solid #e1e8ed'
                  }}
                />
                <div style={{
                  marginTop: '1rem',
                  fontSize: '0.9rem',
                  color: '#7f8c8d'
                }}>
                  File: {selectedFile?.name}<br/>
                  Size: {selectedFile ? (selectedFile.size / 1024 / 1024).toFixed(2) : 0} MB
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            marginTop: '2rem',
            justifyContent: 'center'
          }}>
            <button
              onClick={analyzeImage}
              disabled={!selectedFile || loading}
              style={{
                background: (!selectedFile || loading) 
                  ? '#bdc3c7' 
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '15px',
                padding: '1rem 2rem',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: (!selectedFile || loading) ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                if (selectedFile && !loading) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(102,126,234,0.4)';
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              {loading ? '🔄 Analyzing...' : '🔬 Analyze Image'}
            </button>
            
            <button
              onClick={reset}
              style={{
                background: 'white',
                color: '#667eea',
                border: '2px solid #667eea',
                borderRadius: '15px',
                padding: '1rem 2rem',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#667eea';
                e.target.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'white';
                e.target.style.color = '#667eea';
              }}
            >
              🔄 Reset
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            background: '#fee',
            border: '2px solid #fcc',
            color: '#c33',
            padding: '1rem',
            borderRadius: '10px',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span style={{ fontSize: '1.5rem' }}>⚠️</span>
            <div>
              <strong>Analysis Error:</strong><br/>
              {error}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '3rem',
            textAlign: 'center',
            marginBottom: '2rem',
            boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
          }}>
            <div style={{
              fontSize: '3rem',
              marginBottom: '1rem',
              animation: 'spin 2s linear infinite'
            }}>
              🔬
            </div>
            <h3 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>
              Analyzing Your Crop...
            </h3>
            <p style={{ color: '#7f8c8d', margin: '0' }}>
              Our AI is examining the image for diseases and pest issues
            </p>
          </div>
        )}

        {/* Results */}
        {result && (
          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '2rem',
            boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{
              margin: '0 0 1.5rem 0',
              color: '#2c3e50',
              fontSize: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              🔍 Analysis Results
              <span style={{
                background: '#e8f5e8',
                color: '#27ae60',
                padding: '0.25rem 0.75rem',
                borderRadius: '15px',
                fontSize: '0.8rem'
              }}>
                {Math.round(result.confidence * 100)}% Confidence
              </span>
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.5rem'
            }}>
              {/* Disease Information */}
              <div style={{
                background: '#f8f9fa',
                padding: '1.5rem',
                borderRadius: '10px',
                border: '2px solid #e1e8ed'
              }}>
                <h4 style={{
                  margin: '0 0 1rem 0',
                  color: '#2c3e50',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  🦠 Detected Issue
                </h4>
                <div style={{
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  color: '#e74c3c',
                  marginBottom: '0.5rem'
                }}>
                  {result.detectedDisease.name}
                </div>
                <div style={{
                  display: 'flex',
                  gap: '0.5rem',
                  marginBottom: '1rem'
                }}>
                  <span style={{
                    background: result.detectedDisease.severity === 'High' ? '#fee' : 
                               result.detectedDisease.severity === 'Medium' ? '#fff3cd' : '#e8f5e8',
                    color: result.detectedDisease.severity === 'High' ? '#c33' : 
                          result.detectedDisease.severity === 'Medium' ? '#856404' : '#27ae60',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '12px',
                    fontSize: '0.8rem'
                  }}>
                    {result.detectedDisease.severity} Severity
                  </span>
                </div>
                <div style={{
                  fontSize: '0.9rem',
                  color: '#2c3e50',
                  fontWeight: '600',
                  marginBottom: '0.5rem'
                }}>
                  {result.detectedDisease.urgency}
                </div>
              </div>

              {/* Symptoms */}
              <div style={{
                background: '#f8f9fa',
                padding: '1.5rem',
                borderRadius: '10px',
                border: '2px solid #e1e8ed'
              }}>
                <h4 style={{
                  margin: '0 0 1rem 0',
                  color: '#2c3e50',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  🔍 Symptoms
                </h4>
                <ul style={{ margin: '0', paddingLeft: '1.5rem' }}>
                  {result.detectedDisease.symptoms.map((symptom, index) => (
                    <li key={index} style={{
                      marginBottom: '0.5rem',
                      color: '#2c3e50'
                    }}>
                      {symptom}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Treatment */}
              <div style={{
                background: '#f8f9fa',
                padding: '1.5rem',
                borderRadius: '10px',
                border: '2px solid #e1e8ed'
              }}>
                <h4 style={{
                  margin: '0 0 1rem 0',
                  color: '#2c3e50',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  💊 Treatment Plan
                </h4>
                <ol style={{ margin: '0', paddingLeft: '1.5rem' }}>
                  {result.detectedDisease.treatment.map((treatment, index) => (
                    <li key={index} style={{
                      marginBottom: '0.5rem',
                      color: '#2c3e50'
                    }}>
                      {treatment}
                    </li>
                  ))}
                </ol>
              </div>

              {/* Prevention */}
              <div style={{
                background: '#f8f9fa',
                padding: '1.5rem',
                borderRadius: '10px',
                border: '2px solid #e1e8ed'
              }}>
                <h4 style={{
                  margin: '0 0 1rem 0',
                  color: '#2c3e50',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  🛡️ Prevention
                </h4>
                <ul style={{ margin: '0', paddingLeft: '1.5rem' }}>
                  {result.preventiveMeasures.map((measure, index) => (
                    <li key={index} style={{
                      marginBottom: '0.5rem',
                      color: '#2c3e50'
                    }}>
                      {measure}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Next Steps */}
              <div style={{
                background: '#f0f4ff',
                padding: '1.5rem',
                borderRadius: '10px',
                border: '2px solid #667eea'
              }}>
                <h4 style={{
                  margin: '0 0 1rem 0',
                  color: '#2c3e50',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  📋 Next Steps
                </h4>
                <ol style={{ margin: '0', paddingLeft: '1.5rem' }}>
                  {result.nextSteps.map((step, index) => (
                    <li key={index} style={{
                      marginBottom: '0.5rem',
                      color: '#2c3e50'
                    }}>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Analysis Info */}
            <div style={{
              marginTop: '1.5rem',
              padding: '1rem',
              background: '#f8f9fa',
              borderRadius: '8px',
              fontSize: '0.9rem',
              color: '#7f8c8d',
              textAlign: 'center'
            }}>
              Analysis Method: {result.analysisMethod} • 
              Processed: {new Date(result.processingTime).toLocaleString()}
            </div>
          </div>
        )}

        {/* Debug Info */}
        <div style={{
          textAlign: 'center',
          marginTop: '1rem',
          color: 'white',
          opacity: 0.8,
          fontSize: '0.8rem'
        }}>
          🔬 Server: http://localhost:8081 • Status: {loading ? 'Analyzing...' : result ? 'Analysis Complete' : 'Ready'}
        </div>
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default CropDiseaseDetector;
