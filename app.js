document.addEventListener('DOMContentLoaded', function () {
    console.log('DOMContentLoaded event fired!');

    let globalToken;

    // Fetch the token from your server
    fetchToken()
        .then(token => {
            globalToken = token; // Set the global token variable
            return fetchArtistDetails(token);
        })
        .then(fetchTopSongs)
        .then(renderSongs)
        .catch(handleError);

    const mockData = [
        { name: 'Song 1', artists: [{ name: 'Artist 1' }] },
        { name: 'Song 2', artists: [{ name: 'Artist 2' }] },
    ];

    renderSongs(mockData);

    function fetchToken() {
        return fetch('http://127.0.0.1/get_token')
            .then(response => response.json())
            .then(data => {
                console.log('Token data:', data);
                return data.access_token;
            });
    }

    function fetchArtistDetails(token) {
        return fetch(`http://127.0.0.1/search_artist?token=${globalToken}&artist_name=ACDC`)
            .then(response => response.json())
            .then(artistData => {
                console.log('Artist details:', artistData);
                return artistData.id;
            });
    }

    function fetchTopSongs(artistId) {
        return fetch(`http://127.0.0.1/get_top_songs?token=${globalToken}&artist_id=${artistId}`)
            .then(response => response.json())
            .then(data => {
                console.log('Top songs data:', data);
                return data || [];
            });
    }

    function renderSongs(tracks) {
        const songList = document.getElementById('song-list');
        console.log('Rendering songs:', tracks);

        tracks.forEach(song => {
            const listItem = document.createElement('li');
            listItem.textContent = `${song.name} - ${song.artists[0].name}`;
            songList.appendChild(listItem);
            console.log('Added song:', song);
        });
    }

    function handleError(error) {
        console.error('Error:', error);
    }
});
