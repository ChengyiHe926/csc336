const express = require('express');
const router = express.Router();
const axios = require('axios')
const imdbService = require('../service');

const BaseUrl = 'https://api.themoviedb.org';
const postfix = 'api_key=97588ddc4a26e3091152aa0c9a40de22'


router.get('/search', async (req, res) => {
    let category = req.query.category
    let query = req.query.query
    query = query.replace(/\s/g, '%20')
    let results = []
    try {
        let response = await axios.get(`${BaseUrl}/3/search/${category}?query=${query}&language=en-US&${postfix}`)
        results = response.data.results.map((item) => {
            if (!item.poster_path || item.poster_path == null) {
                item.poster_path = '/static/placeholder1.jpeg'
            }
            else {
                item.poster_path = 'https://image.tmdb.org/t/p/w500' + item.poster_path
            }
            let category = item.title ? 'movie' : 'tv';
            let image_url = item.poster_path ? item.poster_path : 'https://cinemaone.net/images/movie_placeholder.png'
            let title = item.title || item.name;
            let date = item.release_date || item.first_air_date
            let year = date ? date.substring(0, 4) : 'Not given';
            let vote_average = item.vote_average ? Math.round((parseFloat(item.vote_average) / 10 * 5) * 100) / 100 : 0;
            let vote_count = item.vote_count || 0;
            let spoken_languages = item.spoken_languages;
            return {
                id: item.id,
                poster_path: image_url,
                title: title,
                category,
                year,
                vote_average,
                vote_count,
                genres_str: '',
                overview: item.overview,
                spoken_languages
            }
        })
    } catch (err) {
        console.log(err)
        return res.json({ results })
    }
    res.json({ results })
})

router.get('/person/:id', async (req, res) => {
    let id = req.params.id
    let results = {}

    try {
        let response = await axios.get(`${BaseUrl}/3/person/${id}?${postfix}&language=en-US&page=1`);
        let item = response.data
        console.log(item)
        results = {
            birthday: item.birthday,
            gender: item.gender,
            name: item.name,
            homepage: item.homepage,
            also_known_as: item.also_known_as,
            biography: item.biography,
            known_for_department: item.known_for_department,
            place_of_birth: item.place_of_birth,
            profile_path: 'https://image.tmdb.org/t/p/w500' + item.profile_path
        }
    } catch (err) {
        return res.json({ results })
    }
    return res.json({ results })
})

router.get('/details/:type/:id', async (req, res) => {
    let item = {}
    try {
        item = await imdbService.getMediaDetails(req.params.type, req.params.id);
    } catch (err) {
        return res.json({})
    }
    return res.json(item);
})



module.exports = router;