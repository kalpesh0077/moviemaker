import React, { useEffect, useState } from 'react';

const ImageGenerator = () => {
  const [imageBase64, setImageBase64] = useState(null);
  const [uuid, setUuid] = useState(null);
  const [statusData, setStatusData] = useState(null);
  const [error, setError] = useState(null);
  const [uploadPreview, setUploadPreview] = useState(null);

  // Convert uploaded image to base64
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageBase64(reader.result); // base64 data
      setUploadPreview(reader.result); // show preview
    };
    reader.readAsDataURL(file);
  };

  // Step 1: Send generation request when imageBase64 is ready
  useEffect(() => {
    if (!imageBase64) return;

    setError(null);
    setStatusData(null);
    setUuid(null);

    fetch('https://runwayml.p.rapidapi.com/generate/image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-rapidapi-host': 'runwayml.p.rapidapi.com',
        'x-rapidapi-key': '96b97ed9a5msh108499e07b1e85cp1be6bejsnf12c982523e7'
      },
      body: JSON.stringify({
        img_prompt: imageBase64,
        model: 'gen3',
        image_as_end_frame: false,
        flip: false,
        motion: 5,
        seed: 0,
        callback_url: '',
        time: 5
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.uuid) {
          setUuid(data.uuid);
        } else {
          setError('❌ UUID not found in response');
        }
      })
      .catch(err => {
        console.error('Initial request error:', err);
        setError(err.message);
      });
  }, [imageBase64]);

  // Step 2: Poll status every 10s using uuid
  useEffect(() => {
    if (!uuid) return;

    const interval = setInterval(() => {
      fetch(`https://runwayml.p.rapidapi.com/status?uuid=${uuid}`, {
        method: 'GET',
        headers: {
          'x-rapidapi-host': 'runwayml.p.rapidapi.com',
          'x-rapidapi-key': '96b97ed9a5msh108499e07b1e85cp1be6bejsnf12c982523e7'
        }
      })
        .then(res => res.json())
        .then(data => {
          if (data.progress !== undefined) {
            setStatusData(data); // only update if progress is present
          }
        })
        .catch(err => {
          console.error('Polling error:', err);
          setError(err.message);
        });
    }, 10000); // 10 seconds

    return () => clearInterval(interval); // cleanup
  }, [uuid]);

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h2>🎨 RunwayML Image Generator + Tracker</h2>

      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {uploadPreview && (
        <img src={uploadPreview} alt="Preview" style={{ width: '100%', marginTop: 10, borderRadius: 10 }} />
      )}

      {error && <p style={{ color: 'red' }}>❌ Error: {error}</p>}
      {uuid && <p>🆔 UUID: {uuid}</p>}

      {!uuid && imageBase64 && <p>📤 Sending generation request...</p>}
      {!statusData && uuid && <p>⏳ Polling status... waiting for progress updates</p>}

      {statusData && (
        <pre style={{ backgroundColor: '#eef', padding: '10px', borderRadius: '8px' }}>
          {JSON.stringify(statusData, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default ImageGenerator;
