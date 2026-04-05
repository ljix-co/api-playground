import React from "react";

const PulsingIndicator: React.FC = () => {
    return (
        <div className="flex items-center justify-center p-4">
            <div className="w-8 h-8 bg-blue-500 rounded-full animate-pulse"></div>
        </div>
    );
};

export default PulsingIndicator;
