import React, { useState, useEffect } from 'react';
import './MovieGenerator.css';
import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';
// Import team images
import team1 from '../img/team1.jpg';
import team2 from '../img/team2.jpg';
import team3 from '../img/team3.jpg';
import team4 from '../img/team4.jpg';
import supriyaMamImg from '../img/supriya_mam_img.jpg';
// Import icons
import { FaRobot, FaBolt, FaPalette, FaLinkedin, FaMagic, FaCode } from 'react-icons/fa';

const MovieGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [script, setScript] = useState('');
  const [loading, setLoading] = useState(false);
  const [scriptLoading, setScriptLoading] = useState(false);
  const [frames, setFrames] = useState([]);
  const [progress, setProgress] = useState(0);
  const [showAbout, setShowAbout] = useState(false);
  const [imagePrompt, setImagePrompt] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [imageUrl, setImageUrl] = useState(null); // base64 image
  const [videoUuid, setVideoUuid] = useState(null);
  const [videoStatus, setVideoStatus] = useState(null);
  const [loadingVideo, setLoadingVideo] = useState(false);

  const teamMembers = [
    {
      name: "Kalpesh Pathode",
      role: "AI & DS",
      image: team1,
      linkedin: "https://www.linkedin.com/in/kalpesh-pathode-b2a409232/"
    },
    {
      name: "Dhanashri Patil",
      role: "AI & DS",
      image: team2,
      linkedin: "https://www.linkedin.com/in/dhanashri-patil07/"
    },
    {
      name: "Harshwardhan Patil",
      role: "AI & DS",
      image: team3,
      linkedin: "https://www.linkedin.com/in/harshwardhan-patil-955706251/"
    },
    {
      name: "Sakshi Deshmukh",
      role: "AI & DS",
      image: team4,
      linkedin: "https://www.linkedin.com/in/sakshi-deshmukh-3094a32b2/"
    }
  ];

  const specialThanks = {
    name: "Prof. Supriya Balote",
    role: "Project Guide",
    image: supriyaMamImg,
    linkedin: "https://www.linkedin.com/in/sakshi-deshmukh-3094a32b2/"
  };

  console.log('API Key available:', !!process.env.REACT_APP_GEMINI_API_KEY);

  useEffect(() => {
    console.log('Environment check:');
    console.log('API Key present:', !!process.env.REACT_APP_GEMINI_API_KEY);
    console.log('API Key length:', process.env.REACT_APP_GEMINI_API_KEY?.length);
  }, []);

  if (!process.env.REACT_APP_GEMINI_API_KEY) {
    console.error('Gemini API key is not loaded!');
  } else {
    console.log('Gemini API key is loaded and has length:', process.env.REACT_APP_GEMINI_API_KEY.length);
  }

  const generateScript = async (prompt) => {
    setScriptLoading(true);
    try {
      const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        apiVersion: "v1"
      });

      // Generate detailed script for display
      const scriptPrompt = {
        contents: [{
          parts: [{
            text: `Create a detailed movie script for the following scene:
                     
Scene: ${prompt}

Format as:
SCENE DESCRIPTION:
[Detailed setting description with lighting, time of day, and atmosphere]

ACTION:
[What happens in the scene]`
          }]
        }]
      };

      // Generate concise image prompt separately
      const imagePromptRequest = {
        contents: [{
          parts: [{
            text: `Create a short, visual description (2-3 sentences) for generating a realistic photograph of this scene. Focus only on visual elements:

Scene: ${prompt}

Make it detailed but concise, focusing on:
- Main subjects
- Setting
- Lighting
- Atmosphere
- Colors`
          }]
        }]
      };

      // Generate both in parallel
      const [scriptResult, imagePromptResult] = await Promise.all([
        model.generateContent(scriptPrompt),
        model.generateContent(imagePromptRequest)
      ]);

      const scriptResponse = await scriptResult.response;
      const imagePromptResponse = await imagePromptResult.response;

      setScript(scriptResponse.text());
      setImagePrompt(imagePromptResponse.text());

    } catch (error) {
      console.error('Generation error:', error);
      alert('Failed to generate script. Please try again.');
    } finally {
      setScriptLoading(false);
    }
  };

  const handlePromptSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    await generateScript(prompt);
  };

  const handleImageGeneration = async (e) => {
    e.preventDefault();
    if (!imagePrompt.trim()) return;

    setLoading(true);
    setFrames([]);
    setProgress(0);

    try {
      // Use the optimized image prompt instead of the script
      const response = await fetch('https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_STABILITY_API_KEY}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          text_prompts: [
            {
              text: `Professional photograph, realistic, 4K, highly detailed: ${imagePrompt}`,
              weight: 1
            },
            {
              text: "cartoon, animation, illustration, drawing, low quality",
              weight: -1
            }
          ],
          cfg_scale: 7,
          height: 1024,
          width: 1024,
          steps: 30,
          samples: 1
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(errorData.message || 'Failed to generate image');
      }

      const data = await response.json();
      const imageUrl = `data:image/png;base64,${data.artifacts[0].base64}`;
      setFrames([imageUrl]);
      setImageUrl(imageUrl);
      setProgress(100);
    } catch (error) {
      console.error('Image Generation Error:', error);
      alert(`Failed to generate image: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoGeneration = async () => {
    try {
      const options = {
        method: 'POST',
        url: 'https://runwayml.p.rapidapi.com/generate/image',
        headers: {
          'x-rapidapi-key': '8009c2710amsh1abc852b5778319p127c4ejsn395fa7c31831',
          'x-rapidapi-host': 'runwayml.p.rapidapi.com',
          'Content-Type': 'application/json'
        },
        data: {
          img_prompt: imagePrompt,
          model: 'gen3',
          image_as_end_frame: false,
          flip: false,
          motion: 5,
          seed: 0,
          callback_url: '',
          time: 5
        }
      };

      const response = await axios.request(options);
      console.log(response.data);

      // Set the video URL from the response
      if (response.data && response.data.url) {
        setVideoUrl(response.data.url);
      } else {
        throw new Error('Video URL not found in response');
      }

    } catch (error) {
      console.error('Video Generation Error:', error);
      if (error.response) {
        console.error('Error Response Data:', error.response.data);
      }
      alert('Failed to generate video. Please try again.');
    }
  };

  const handleGenerateVideo = async () => {
    setLoadingVideo(true);
    setVideoStatus(null);
    setVideoUuid(null);
    setVideoUrl(null);

    try {
      const response = await fetch("https://runwayml.p.rapidapi.com/generate/video", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'x-rapidapi-host': 'runwayml.p.rapidapi.com',
          'x-rapidapi-key': '754519b185msh2801703f5ef32b8p1e84b1jsn799c6015c73e'
        },
        body: JSON.stringify({
          img_prompt: imageUrl, // base64 image
          model: "gen2",
          motion: 5,
          seed: 42,
          time: 5,
        }),
      });

      const data = await response.json();
      console.log(data)
      if (data.uuid) {
        setVideoUuid(data.uuid);
        console.log(data.uuid);
      } else {
        throw new Error("No UUID returned for video generation");
      }
    } catch (err) {
      console.error("Video generation error:", err);
      alert(`Video generation failed: ${err.message}`);
    }
  };

  useEffect(() => {
    if (!videoUuid) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`https://runwayml.p.rapidapi.com/status?uuid=${videoUuid}`, {
          method: "GET",
          headers: {
            'x-rapidapi-host': 'runwayml.p.rapidapi.com',
            'x-rapidapi-key': '8009c2710amsh1abc852b5778319p127c4ejsn395fa7c31831'
          },
        });

        const data = await res.json();
        console.log(data);
        setVideoStatus(data);

        if (data.status === "completed" && data.url) {
          setVideoUrl(data.url);
          setLoadingVideo(false);
          clearInterval(interval);
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 10000); // 10s

    return () => clearInterval(interval);
  }, [videoUuid]);

  return (
    <div className="page-container">
      <nav className="navbar">
        <div className="nav-brand">
          <FaMagic className="brand-icon" />
          <span>Cipher Cinema</span>
        </div>
        <div className="nav-links">
          <button
            className={`nav-button ${!showAbout ? 'active' : ''}`}
            onClick={() => setShowAbout(false)}
          >
            <FaCode className="nav-icon" />
            <span>Generator</span>
          </button>
          <button
            className={`nav-button ${showAbout ? 'active' : ''}`}
            onClick={() => setShowAbout(true)}
          >
            <FaRobot className="nav-icon" />
            <span>About</span>
          </button>
        </div>
      </nav>

      {!showAbout ? (
        <>
          <div className="hero-section">
            <div className="hero-content">
              <h1>Transform Your Ideas Into Reality</h1>
              <p className="hero-subtitle">Create stunning animations using the power of artificial intelligence</p>
            </div>
          </div>

          <div className="movie-generator">
            <div className="generator-card">
              <h2>Create Your Animation</h2>
              <form onSubmit={handlePromptSubmit} className="generator-form">
                <div className="input-group">
                  <label>Enter Your Prompt</label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe your animation (e.g., 'A butterfly flying through a magical garden')"
                    required
                  />
                </div>
                <button type="submit" disabled={scriptLoading}>
                  {scriptLoading ? 'Generating Script...' : 'Generate Script'}
                </button>
              </form>

              {script && (
                <div className="script-section">
                  <h3>Generated Script</h3>
                  <div className="script-display">
                    <textarea
                      value={script}
                      onChange={(e) => setScript(e.target.value)}
                      placeholder="Your generated script will appear here..."
                      readOnly
                    />
                  </div>
                  <button
                    onClick={handleImageGeneration}
                    disabled={loading}
                    className="generate-image-btn"
                  >
                    {loading ? 'Generating Image...' : 'Generate Image from Script'}
                  </button>
                </div>
              )}

              {loading && (
                <div className="loading">
                  <p>Creating your animation... {progress}% complete</p>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                  </div>
                </div>
              )}

              {frames.length > 0 && (
                <div className="animation-output">
                  <h2>Your Generated Animation</h2>
                  <div className="frames-container">
                    {frames.map((frame, index) => (
                      <img
                        key={index}
                        src={frame}
                        alt={`Generated frame ${index + 1}`}
                        className="animation-frame"
                      />
                    ))}
                  </div>
                  {imageUrl && (
                    <>
                      <button onClick={handleGenerateVideo} disabled={loadingVideo}>
                        {loadingVideo ? "Generating Video..." : "Generate Video 🎬"}
                      </button>
                    </>
                  )}
                  {videoUrl ? (
                    <video
                      src={videoUrl}
                      controls
                      autoPlay
                      style={{ width: "100%", marginTop: "20px", borderRadius: "10px" }}
                    />
                  ) : <p>Generating video...</p>}
                  <div className="animation-controls">
                    <button onClick={() => {
                      setFrames([]);
                      setPrompt('');
                      setScript('');
                      setVideoUrl('');
                    }}>
                      Create New Animation
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="features-section">
            <h2>Key Features</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">
                  <FaRobot />
                </div>
                <h3>AI-Powered</h3>
                <p>State-of-the-art AI models for stunning animations</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <FaBolt />
                </div>
                <h3>Fast Generation</h3>
                <p>Quick processing for rapid results</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <FaPalette />
                </div>
                <h3>Creative Freedom</h3>
                <p>Turn any description into a visual story</p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="about-page">
          <div className="about-header">
            <h1>Meet Our Team</h1>
            <p>The brilliant minds behind AI Video Generator</p>
          </div>

          <div className="team-section">
            <div className="core-team-grid">
              {teamMembers.map((member, index) => (
                <div key={index} className="team-card">
                  <div className="team-card-inner">
                    <div className="team-card-front">
                      <div className="member-image">
                        <img src={member.image} alt={member.name} />
                      </div>
                      <h3>{member.name}</h3>
                      <p>{member.role}</p>
                    </div>
                    <div className="team-card-back">
                      <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="social-link">
                        <FaLinkedin />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="special-thanks">
              <h2>Special Thanks To</h2>
              <div className="team-card special-card">
                <div className="team-card-inner">
                  <div className="team-card-front">
                    <div className="member-image mentor-image">
                      <img src={specialThanks.image} alt={specialThanks.name} />
                    </div>
                    <h3>{specialThanks.name}</h3>
                    <p>{specialThanks.role}</p>
                  </div>
                  <div className="team-card-back">
                    <a href={specialThanks.linkedin} target="_blank" rel="noopener noreferrer" className="social-link">
                      <FaLinkedin />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <FaMagic className="brand-icon" />
            <span>AI Video Generator</span>
          </div>
          <p>© 2025 Cipher Cinema. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default MovieGenerator;