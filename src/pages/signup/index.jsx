import React, { useEffect, useRef, useState } from 'react';
import { signIn, signUp } from '../../services/auth';
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';

function Index(props) {
    const [videoStream, setVideoStream] = useState(null);
    const [imageData, setImageData] = useState(null);
    const [imgSrc, setImgSrc] = useState(null);
    const videoRef = useRef(null);
    const [loading, setIsLoading] = useState(false);
    const [name, setName] = useState("");

    const navigate = useNavigate();
  
    // Start the video stream when the component mounts
    React.useEffect(() => {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          setVideoStream(stream);
          videoRef.current.srcObject = stream;
        })
        .catch(err => console.error('Error accessing user media:', err));
    }, []);
  
    // Capture a screenshot of the video stream
    const captureScreenshot = () => {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const context = canvas.getContext('2d');
        context.drawImage(videoRef.current, 0, 0);
        const data = canvas.toDataURL();
        // setImgSrc(data);
        // canvas.toBlob(blob => {
        //   const formData = new FormData();
        //   formData.append('image', blob);
        //   setImageData(formData);
        // }, 'image/jpeg', 0.9);

        const byteString = atob(data.split(",")[1]); // Remove data:image/jpeg;base64, from the string
        const mimeString = data.split(",")[0].split(":")[1].split(";")[0]; // Extract MIME type
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const uintArray = new Uint8Array(arrayBuffer);

        for (let i = 0; i < byteString.length; i++) {
        uintArray[i] = byteString.charCodeAt(i);
        }

        const blob = new Blob([uintArray], { type: mimeString });
        const formData = new FormData();
        // console.log('BLOB: ', blob)
        formData.append('image', blob, 'test.png')

        

        if(name.length < 2) {
            setImageData(null);
            setImgSrc(null);
            toast.error("Invalid Name", {
                pauseOnHover: false,
                closeOnClick: true,
            })
            // alert('input name');
            return;
        }

        setIsLoading(true);
        signUp(name, formData).then(res => {
            console.log('RES: ', res);
            if(res.data.status) {
                toast.success(res.data.message, {
                    pauseOnHover: false,
                    closeOnClick: true,
                })
            }else {
                toast.error(res.data.message, {
                    pauseOnHover: false,
                    closeOnClick: true,
                })
            }

            setIsLoading(false);
            setImageData(null);
            setImgSrc(null);
            setName('')
        }).catch(err => {
            setIsLoading(false);
            setImageData(null);
            setImgSrc(null);
            toast.error('Error', {
                pauseOnHover: false,
                closeOnClick: true,
            })
            // console.log('Error: ', err);
        })
      }

    return (
        <div className="camera-container">
               {loading && <h3 style={{textAlign: 'center', color: "#fff"}}>Loading...</h3>}
           <div className="camera-box">
                <div className="videobox">
                    {!imgSrc && <video ref={videoRef} autoPlay />}
                    {imgSrc && (
                        <img src={imgSrc} style={{ width: '224px', height: '224px', borderRadius: '50%',  }} />
                    )}
                </div>
               {!loading && <div className="buttons">
                    <input type="text" placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)} className="name-input" />
                    <button onClick={captureScreenshot} className="register-btn btn">Register</button>
                    <button onClick={() => navigate('/login')} className="login-btn btn">Login</button>
                </div>}
           </div>
        </div>
    );
}

export default Index;