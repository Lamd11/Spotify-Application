document.addEventListener('DOMContentLoaded', function () {
    console.log('DOMContentLoaded event fired!');
    
    // Fetch the token from your server
    fetch('http://10.0.0.192/get_token')
        .then(response => response.json())
        .then(data => {
            console.log('Token data:', data);
            const token = data.access_token;

            // Fetch artist details using the obtained token
            fetch(`http://10.0.0.192/search_artist?token=${token}&artist_name=ACDC`)
                .then(response => response.json())
                .then(artistData => {
                    const artistId = artistData.id;

                    // Fetch top songs using the obtained token and artist ID
                    fetch(`http://10.0.0.192/get_top_songs?token=${token}&artist_id=${artistId}`)
                        .then(response => response.json())
                        .then(data => {
                            console.log('Top songs data:', data);
                            
                            // Call the render function
                            renderSongs(data || []);
                        })
                        .catch(error => console.error('Error fetching top songs:', error));
                })
                .catch(error => console.error('Error fetching artist details:', error));
        })
        .catch(error => console.error('Error fetching token:', error));


    const mockData = [
        { name: 'Song 1', artists: [{ name: 'Artist 1' }] },
        { name: 'Song 2', artists: [{ name: 'Artist 2' }] },
    ];
    
    renderSongs(mockData);   
    // Function to render songs
    function renderSongs(tracks) {
        const songList = document.getElementById('song-list');
        // Update the HTML content with the top songs
        console.log('Rendering songs:', tracks);

        tracks.forEach(song => {
            const listItem = document.createElement('li');
            listItem.textContent = `${song.name} - ${song.artists[0].name}`;
            songList.appendChild(listItem);
            console.log('Added song:', song); // Log each added song
        });
    }
});


