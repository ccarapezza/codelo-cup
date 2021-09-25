import React, { useState } from "react";
import QrReader from "react-qr-reader";

export default function Login() {
  const [result, setResult] = useState();
  const [error, setError] = useState();

  const handleScan = (data) => {
    if (data) {
      setResult(data);
    }
  };

  const handleError = (err) => {
    setError(err);
    console.error(err);
  };

  return (
    <div>
      {!result && (
        <QrReader
          delay={300}
          onError={handleError}
          onScan={handleScan}
          style={{ width: "100%" }}
        />
      )}
      <p>QR RESULT:{result}</p>
      <p>{JSON.stringify(error)}</p>
    </div>
  );
}
