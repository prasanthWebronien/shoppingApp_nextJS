import { useState, useEffect } from "react";

const useCurrentLocation = () => {
    const [locationw, setLocation] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!("geolocation" in navigator)) {
            setError("Geolocation is not supported by your browser.");
            return;
        }

        const getPosition = () => {
            return new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(
                    resolve,
                    reject,
                    {
                        timeout: 5000,  // 5 seconds timeout
                        enableHighAccuracy: true,
                        maximumAge: 0,
                    }
                );
            });
        };

        const fetchLocation = async () => {
            try {
                const position = await getPosition();
                setLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
            } catch (err) {
                setError(err.message || "Failed to get location.");
            }
        };

        fetchLocation();
    }, []);

    return { locationw, error };
};

export default useCurrentLocation;
