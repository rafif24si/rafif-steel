import React from 'react';
import { useParams } from 'react-router-dom';
import ErrorPage from '../components/ErrorPages';

const ErrorDisplay = () => {
  const { code } = useParams();

  // KOMENTAR DEMO: Mengatur konten dinamis (judul, pesan, animasi Lottie) berdasarkan kode error HTTP (seperti 400, 401, 403, 404) yang ditangkap dari URL parameters.
  // Konfigurasi dinamis sesuai desain Meta-Lost Figma
  const dataError = {
    '400': {
      title: "Corrupted Command",
      message: "Oops, the request was malformed. Something about this just doesn't compute.",
      animasi: "https://embed.lottiefiles.com/animation/107000",
      buttonText: "Retry Command"
    },
    '401': {
      title: "Unauthorized Entry",
      message: "Credentials required. Confirm you are who you say you are.",
      animasi: "https://embed.lottiefiles.com/animation/107001",
      buttonText: "Back To Access"
    },
    '403': {
      title: "Forbidden Destination",
      message: "Access denied. We have been expecting you... but not here.",
      animasi: "https://embed.lottiefiles.com/animation/107002",
      buttonText: "Back To Safety"
    },
    '404': {
      title: "Lost In Metaverse",
      message: "Oops, it seems you follow backlink",
      animasi: "https://embed.lottiefiles.com/animation/106540",
      buttonText: "Back To Home"
    }
  };

  const currentError = dataError[code] || dataError['404'];
  const displayCode = dataError[code] ? code : '404';

  return (
    <ErrorPage 
      kodeError={displayCode} 
      title={currentError.title}
      message={currentError.message} 
      urlAnimasi={currentError.animasi} 
      buttonText={currentError.buttonText}
    />
  );
};

export default ErrorDisplay;