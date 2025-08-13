import React, { useState, useRef } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { motion } from 'framer-motion';
import Dropzone from 'react-dropzone';
import axios from 'axios';

// Global styles
const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }

  body {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
  }
`;

// Styled components
const Container = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 40px;
  width: 100%;
  max-width: 600px;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
  border: 1px solid rgba(255, 255, 255, 0.18);
`;

const Title = styled.h1`
  color: white;
  text-align: center;
  margin-bottom: 30px;
  font-size: 2.5rem;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 25px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  color: white;
  font-weight: 500;
  font-size: 1.1rem;
`;

const Input = styled.input`
  padding: 15px;
  border-radius: 12px;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 1rem;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;

  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }

  &:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.3);
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.2);
  }
`;

const Select = styled.select`
  padding: 15px;
  border-radius: 12px;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 1rem;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.3);
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.2);
  }

  option {
    background: #667eea;
    color: white;
  }
`;

const SliderContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const Slider = styled.input`
  flex: 1;
  height: 8px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.2);
  outline: none;
  -webkit-appearance: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: white;
    cursor: pointer;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  }

  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: white;
    cursor: pointer;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  }
`;

const ValueDisplay = styled.span`
  color: white;
  font-weight: 500;
  min-width: 40px;
  text-align: center;
`;

const DropzoneContainer = styled.div`
  border: 2px dashed rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  padding: 30px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.1);

  &:hover {
    border-color: rgba(255, 255, 255, 0.5);
    background: rgba(255, 255, 255, 0.15);
  }
`;

const DropzoneText = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
`;

const PreviewImage = styled.img`
  max-width: 100%;
  max-height: 200px;
  border-radius: 12px;
  margin-top: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
`;

const Button = styled(motion.button)`
  padding: 16px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 25px rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  }
`;

const ErrorMessage = styled(motion.div)`
  background: rgba(255, 0, 0, 0.2);
  border: 1px solid rgba(255, 0, 0, 0.3);
  border-radius: 12px;
  padding: 15px;
  color: white;
  text-align: center;
  margin-bottom: 20px;
`;

const App = () => {
  const [data, setData] = useState('');
  const [position, setPosition] = useState('center');
  const [transparency, setTransparency] = useState(128);
  const [scale, setScale] = useState(25);
  const [watermark, setWatermark] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState(null);
  const [error, setError] = useState(null);
  const dropzoneRef = useRef();

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setWatermark(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('data', data);
    formData.append('position', position);
    formData.append('transparency', transparency);
    formData.append('scale', (scale / 100).toFixed(2));
    
    if (watermark) {
      formData.append('watermark', watermark);
    }
    
    try {
      const response = await axios.post('http://localhost:5000/generate', formData, {
        responseType: 'blob'
      });
      
      const imageUrl = URL.createObjectURL(response.data);
      setResultUrl(imageUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
      if (error.response && error.response.data) {
        setError(`Error: ${error.response.data.error || 'Failed to generate QR code. Please try again.'}`);
      } else {
        setError('Failed to generate QR code. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setData('');
    setPosition('center');
    setTransparency(128);
    setScale(25);
    setWatermark(null);
    setPreviewUrl(null);
    setResultUrl(null);
    setError(null);
  };

  return (
    <>
      <GlobalStyle />
      <Container
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Title>QR Code Watermarker</Title>
        
        {error && (
          <ErrorMessage
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </ErrorMessage>
        )}
        
        {!resultUrl ? (
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="data">QR Code Data</Label>
              <Input
                type="text"
                id="data"
                value={data}
                onChange={(e) => setData(e.target.value)}
                placeholder="Enter URL or text"
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Watermark Image (Optional)</Label>
              <Dropzone onDrop={onDrop} accept={{ 'image/*': [] }} ref={dropzoneRef}>
                {({ getRootProps, getInputProps }) => (
                  <DropzoneContainer {...getRootProps()}>
                    <input {...getInputProps()} />
                    <DropzoneText>
                      {previewUrl ? 'Click to change image' : 'Drag & drop an image, or click to select'}
                    </DropzoneText>
                    {previewUrl && <PreviewImage src={previewUrl} alt="Preview" />}
                  </DropzoneContainer>
                )}
              </Dropzone>
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="position">Watermark Position</Label>
              <Select
                id="position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
              >
                <option value="center">Center</option>
                <option value="top-left">Top Left</option>
                <option value="top-right">Top Right</option>
                <option value="bottom-left">Bottom Left</option>
                <option value="bottom-right">Bottom Right</option>
              </Select>
            </FormGroup>
            
            <FormGroup>
              <Label>
                Transparency: <ValueDisplay>{Math.round((transparency / 255) * 100)}%</ValueDisplay>
              </Label>
              <SliderContainer>
                <Slider
                  type="range"
                  min="0"
                  max="255"
                  value={transparency}
                  onChange={(e) => setTransparency(e.target.value)}
                />
              </SliderContainer>
            </FormGroup>
            
            <FormGroup>
              <Label>
                Size: <ValueDisplay>{scale}%</ValueDisplay>
              </Label>
              <SliderContainer>
                <Slider
                  type="range"
                  min="5"
                  max="50"
                  value={scale}
                  onChange={(e) => setScale(e.target.value)}
                />
              </SliderContainer>
            </FormGroup>
            
            <Button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? 'Generating...' : 'Generate QR Code'}
            </Button>
          </Form>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <FormGroup>
              <Label>Result</Label>
              <PreviewImage src={resultUrl} alt="Watermarked QR Code" />
            </FormGroup>
            <Button
              onClick={() => {
                const link = document.createElement('a');
                link.href = resultUrl;
                link.download = 'watermarked_qr.png';
                link.click();
              }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              Download QR Code
            </Button>
            <Button
              onClick={handleReset}
              style={{ marginTop: '15px', background: 'rgba(255, 255, 255, 0.2)' }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              Create Another
            </Button>
          </motion.div>
        )}
      </Container>
    </>
  );
};

export default App;