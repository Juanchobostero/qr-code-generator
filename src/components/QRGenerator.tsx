import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { QrCode, Link2, ExternalLink } from 'lucide-react';

export default function QRGenerator() {
  const [url, setUrl] = useState('https://astro.build');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isValidUrl, setIsValidUrl] = useState(true);

  useEffect(() => {
    generateQRCode();
  }, [url]);

  const generateQRCode = async () => {
    try {
      const qrDataUrl = await QRCode.toDataURL(url, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      });
      setQrCodeUrl(qrDataUrl);
      setIsValidUrl(true);
    } catch (err) {
      setIsValidUrl(false);
      console.error('Error generating QR code:', err);
    }
  };

  const isValidHttpUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    setIsValidUrl(isValidHttpUrl(newUrl));
  };

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
          Enter URL to generate QR code
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Link2 className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            id="url"
            value={url}
            onChange={handleUrlChange}
            className={`block w-full pl-10 pr-12 py-3 border ${
              isValidUrl ? 'border-gray-300' : 'border-red-500'
            } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
            placeholder="https://example.com"
          />
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
            >
              <ExternalLink className="h-5 w-5 text-gray-400 hover:text-indigo-600" />
            </a>
          )}
        </div>
        {!isValidUrl && (
          <p className="mt-2 text-sm text-red-600">Please enter a valid URL</p>
        )}
      </div>

      {isValidUrl && qrCodeUrl && (
        <div className="flex flex-col items-center space-y-4">
          <div className="p-4 bg-white rounded-xl shadow-md">
            <img
              src={qrCodeUrl}
              alt="QR Code"
              className="w-64 h-64"
            />
          </div>
          <a
            href={qrCodeUrl}
            download="qrcode.png"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Download QR Code
          </a>
        </div>
      )}
    </div>
  );
}