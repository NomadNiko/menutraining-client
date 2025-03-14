import React from "react";
import { QRCodeCanvas } from "qrcode.react";

interface QRGeneratorProps {
  ticketId: string;
  transactionId: string;
}

const QRGenerator = ({ ticketId, transactionId }: QRGeneratorProps) => {
  const validationUrl = `${window.location.origin}/validation?ticketId=${ticketId}&transactionId=${transactionId}`;

  return (
    <div className="flex flex-col items-center justify-center w-full p-4 space-y-4">
      <p className="text-8 text-gray-800 text-center w-full">
      {" "}
      </p>
      <div className="flex justify-center items-center w-40 h-40 bg-slate-800 rounded-lg p-2">
        <QRCodeCanvas
          value={validationUrl}
          size={218}
          level="H"
          bgColor="#1C283A"
          fgColor="#CDDAF7"
          marginSize={4}
          imageSettings={{
            src: "/qr-logo.png",
            height: 60,
            width: 60,
            excavate: true,
            opacity: 1,
          }}
        />
      </div>
      <p className="text-8 text-gray-800 text-center w-full">
        {" "}
      </p>
    </div>
  );
};

export default QRGenerator;
