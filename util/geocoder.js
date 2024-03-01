module.exports.fetchLocation = async (location) => {
    const query = encodeURIComponent(location);
    const countryCodes = 'us';

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}&countrycodes=${countryCodes}`;
    try {
        const response = await fetch(url, {
            headers: {
                'Referer': 'https://cycling-matchmaker.com',
                'User-Agent': 'CyclingMatchmaker/1.0'
            }
        });
        const data = await response.json();
        return data[0];
    } catch (error) {
        console.error('Error fetching location:', error);
    }
}