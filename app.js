const express = require('express')
const app = express()
const port = process.env.PORT || 8081;
const apiRoute = require('./routes/imdb')
const imdbService = require('./service')
const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.use('/static', express.static('public'));

// home page
app.get('/', async (req, res) => {
  let username = req.cookies.username;
  let movies = await imdbService.getPlaying('movie');
  let trendingMovies = await imdbService.getTreading('movie');
  let trendingTvs = await imdbService.getTreading('tv');
  let popularMoives = await imdbService.getMedia('movie', 'popular');
  let popularTVs = await imdbService.getMedia('tv', 'popular');
  trendingMovies = trendingMovies.slice(0, 5);
  trendingTvs = trendingTvs.slice(0, 5);
  popularMoives = popularMoives.slice(0, 5);
  popularTVs = popularTVs.slice(0, 5);
  return res.render('index', { movies, trendingMovies, trendingTvs, popularMoives, popularTVs, username });
})

app.get('/trending/:type', async (req, res) => {
  let username = req.cookies.username;
  let items = await imdbService.getTreading(req.params.type);
  return res.render('allMedia', { items, title: 'Trending ' + req.params.type, type: req.params.type, username });
})

app.get('/popular/:type', async (req, res) => {
  let username = req.cookies.username;

  let items = await imdbService.getTreading(req.params.type);
  return res.render('allMedia', { items, title: 'Popular ' + req.params.type, type: req.params.type, username });
})

app.get('/search', async (req, res) => {
  let username = req.cookies.username;
  return res.render('search', { username });
})

app.get('/favorate', async (req, res) => {
  let username = req.cookies.username;
  return res.render('favorate', { username });
})

app.get('/login', (req, res) => {
  let username = req.cookies.username;
  return res.render('login', { username });
})

app.post('/login', (req, res) => {
  res.cookie('username', req.body.username);
  res.redirect('/');
})

app.get('/logout', (req, res) => {
  res.clearCookie('username');
  res.redirect('/');
})


app.get('/details/:type/:id', async (req, res) => {
  let username = req.cookies.username;
  let item = await imdbService.getMediaDetails(req.params.type, req.params.id);
  let reviews = await imdbService.getReivews(req.params.type, req.params.id);
  let casts = (await imdbService.getCasts(req.params.type, req.params.id)).slice(0, 10);
  let similar = (await imdbService.getExtra('similar', req.params.type, req.params.id)).slice(0, 5);
  let recommendations = (await imdbService.getExtra('recommendations', req.params.type, req.params.id)).slice(0, 5);
  return res.render('mediaDetails', { item, reviews, casts, similar, recommendations, type: req.params.type, username });
})

app.use('/api/', apiRoute);

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`)
})