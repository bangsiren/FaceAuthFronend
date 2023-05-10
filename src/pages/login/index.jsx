import React, { useEffect, useRef, useState } from 'react';
import { signIn } from '../../services/auth';
import { useNavigate } from 'react-router-dom'
import { storeToken } from '../../utils/storage';
import { toast } from 'react-toastify';

function Index(props) {
    const [videoStream, setVideoStream] = useState(null);
    const [imageData, setImageData] = useState(null);
    const [imgSrc, setImgSrc] = useState(null);
    const videoRef = useRef(null);
    const [loading, setIsLoading] = useState(false);

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

        setIsLoading(true);
        signIn(formData).then(res => {
            // console.log('RES: ', res);
            setIsLoading(false);
            setImageData(null);
            setImgSrc(null);
            if (res.data.status == true) {
                storeToken(res?.data.token);
                localStorage.setItem('name', res?.data.name)
                toast.success(res.data.message, {
                    pauseOnHover: false,
                    closeOnClick: true,
                })
                navigate('/');
            } else {
                // console.log(res);
                toast.error(res.data.message, {
                    pauseOnHover: false,
                    closeOnClick: true,
                })
            }
        }).catch(err => {
            setIsLoading(false);
            setImageData(null);
            setImgSrc(null);
            toast.error('Error', {
                pauseOnHover: false,
                closeOnClick: true,
            })
        })
    }

    return (
        <div className="main">
            {loading && <h3  className="loading" style={{textAlign: 'center',  color:  "#fff"}}>Loading.....</h3>}
            <div className="camera-container">

                <div className="camera-box">
                    <div className="videobox">
                        {!imgSrc && <video ref={videoRef} autoPlay />}
                        {imgSrc && (
                            <img src={imgSrc} style={{ width: '224px', height: '224px', borderRadius: '50%', }} />
                        )}
                    </div>
                    {!loading && <div className="buttons">
                        <button onClick={captureScreenshot} className="login-btn btn">Login</button>
                        <button onClick={() => navigate('/register')} className="register-btn btn">Register</button>
                    </div>}
                </div>
            </div>
        </div>
    );
}

export default Index;