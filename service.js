
const axios = require('axios')
const BaseUrl = 'https://api.themoviedb.org';
const postfix = 'api_key=137227488dcb8c9205aa03261aa55e74'


async function getTreading(media) {
    let response = await axios.get(`${BaseUrl}/3/trending/${media}/day?${postfix}`);
    let genres = await axios.get(`${BaseUrl}/3/genre/${media}/list?${postfix}`);
    // https://api.themoviedb.org/3/genre/movie/list?api_key={}&language=en-US
    genres = genres.data.genres;
    results = response.data.results.map((item) => {
        if (!item.poster_path || item.poster_path == null) {
            item.poster_path = '/static/placeholder1.jpeg'
        }
        else {
            item.poster_path = 'https://image.tmdb.org/t/p/w500' + item.poster_path
        }
        let category = item.title ? 'movie' : 'tv';
        let image_url = item.poster_path ? 'https://image.tmdb.org/t/p/w185' + item.poster_path : 'https://cinemaone.net/images/movie_placeholder.png'
        let title = item.title || item.name;
        let date = item.release_date || item.first_air_date
        let year = date ? date.substring(0, 4) : 'Not given';
        let vote_average = Math.round((parseFloat(item.vote_average) / 10 * 5) * 100) / 100;
        let vote_count = item.vote_count;
        let genres_str = item.genre_ids.map(id => {
            let genre = genres.find(obj => obj.id === id)
            if (!genre) {
                return ''
            }
            return genre.name
        }).join(", ")
        let spoken_languages = item.spoken_languages;
        return {
            id: item.id,
            poster_path: image_url,
            title: title,
            category,
            year,
            vote_average,
            vote_count,
            genres_str,
            overview: item.overview,
            spoken_languages
        }
    })
    return results;
}

async function getPlaying(media) {
    let response = await axios.get(`${BaseUrl}/3/${media}/now_playing?${postfix}&language=en-US&page=1`);
    let movies = response.data.results.filter((item) => {
        return !!item.poster_path
    }).map((item) => {
        item.poster_path = 'https://image.tmdb.org/t/p/w1280/' + item.backdrop_path
        return {
            id: item.id,
            poster_path: item.poster_path,
            title: item.title || item.name,
        }
    })
    movies = movies.slice(0, 5);
    return movies;
}

async function getMedia(media, type) {
  
    let response = await axios.get(`${BaseUrl}/3/${media}/${type}?${postfix}&language=en-US&page=1`);
    results = response.data.results.map((item) => {
        if (!item.poster_path || item.poster_path == null) {
            item.poster_path = '/static/placeholder1.jpeg'
        }
        else {
            item.poster_path = 'https://image.tmdb.org/t/p/w500' + item.poster_path
        }
        return {
            id: item.id,
            poster_path: item.poster_path,
            title: item.title || item.name,
        }
    })
    return results;
}


async function getMediaDetails(media, id) {
    console.log(`${BaseUrl}/3/${media}/${id}?${postfix}&language=en-US&page=1`)
    let response = await axios.get(`${BaseUrl}/3/${media}/${id}?${postfix}&language=en-US&page=1`);
    let item = response.data
    if (!item.backdrop_path || item.backdrop_path == null) {
        item.poster_path = '/static/placeholder1.jpeg'
    }
    else {
        item.poster_path = 'https://image.tmdb.org/t/p/w1280' + item.backdrop_path;
    }
    let genres_str = item.genres.map(genre => {
        return genre.name
    }).join(", ")
    let vote_average = Math.round((parseFloat(item.vote_average) / 10 * 5) * 100) / 100;
    if (media === 'movie') {
        results = {
            id: item.id,
            title: item.title,
            media,
            genres: item.genres,
            spoken_languages: item.spoken_languages.map(item => item.english_name),
            date: item.release_date,
            runtime: item.runtime,
            overview: item.overview,
            vote_average,
            tagline: item.tagline,
            poster_path: item.poster_path,
            genres_str
        }
    } else {
        results = {
            id: item.id,
            title: item.name,
            media,
            genres: item.genres,
            spoken_languages: item.spoken_languages.map(item => item.english_name),
            date: item.first_air_date,
            runtime: item.episode_run_time,
            overview: item.overview,
            vote_average,
            tagline: item.tagline,
            poster_path: item.poster_path,
            genres_str
        }
    }
    return results;
}

async function getReivews(media, id) {
    let response = await axios.get(`${BaseUrl}/3/${media}/${id}/reviews?${postfix}&language=en-US&page=1`);
    
    results = response.data.results.map((item) => {
        if (!item.author_details.avatar_path || item.author_details.avatar_path == null) {

            item.avatar_path = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHnPmUvFLjjmoYWAbLTEmLLIRCPpV_OgxCVA&usqp=CAU'
        }
        else {
            if (item.author_details.avatar_path.includes('secure'))
                item.avatar_path = item.author_details.avatar_path.slice(1, item.author_details.avatar_path.length);
            else
                item.avatar_path = 'https://image.tmdb.org/t/p/original' + item.author_details.avatar_path
        }
        console.log(item)
        return {
            author: item.author,
            content: item.content,
            created_at: new Date(item.created_at).toDateString(),
            url: item.url,
            rating: item.author_details.rating || 0,
            avatar_path: item.avatar_path,
        }
    })
    results = results.slice(0, 10);
    return results;
}

async function getCasts(media, id) {
    let response = await axios.get(`${BaseUrl}/3/${media}/${id}/credits?${postfix}&language=en-US&page=1`);
    results = response.data.cast.filter(item => {
        return !!item.profile_path
    }).map((item) => {
        item.profile_path = 'https://image.tmdb.org/t/p/w500/' + item.profile_path
        return {
            id: item.id,
            name: item.name,
            character: item.character,
            profile_path: item.profile_path,
        }
    })
    return results;
}

async function getExtra(type, media, id) {
    let response = await axios.get(`${BaseUrl}/3/${media}/${id}/${type}?${postfix}&language=en-US&page=1`);
    results = response.data.results.map((item) => {
        if (!item.poster_path || item.poster_path == null) {
            item.poster_path = '/static/placeholder2.jpeg'
        }
        else {
            item.poster_path = 'https://image.tmdb.org/t/p/w500' + item.poster_path
        }
        return {
            id: item.id,
            poster_path: item.poster_path,
            title: item.title || item.name,
        }
    })
    return results;
}

module.exports = {
    getTreading,
    getPlaying,
    getMedia,
    getMediaDetails,
    getReivews,
    getCasts,
    getExtra,
}