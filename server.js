import express from 'express'
import mongoose from 'mongoose';
import UrlShortner from './models/shortnerModels.js';

const dbURI = 'mongodb+srv://olamide:olamide@urldb.btspb.mongodb.net/URL_API?retryWrites=true&w=majority&appName=URLDB';

mongoose.connect(dbURI)
    .then(()=>console.log('connected to db'))
    .catch(err=>console.error('not connected to db'));

const app =  express()
app.use(express.urlencoded({extended: true}))
app.set('view engine', 'ejs')

app.listen(process.env.PORT || 5000);

app.get('/', async (req, res)=>{
    const shortUrls = await UrlShortner.find()
    res.render('index', {shortUrls})

})

app.post("/shortUrls", async (req, res) => {
    try {
        await UrlShortner.create({ full: req.body.fullUrl });
        res.redirect("/");
    } catch (error) {
        console.error("Error creating short URL:", error);
        res.status(500).send("Internal Server Error");
    }
});


app.get('/:shortUrl', async (req, res)=> {

   const shortUrl = await UrlShortner.findOne({short : req.params.shortUrl})

   if(shortUrl == null) return res.sendStatus(404)

    shortUrl.clicks++
    shortUrl.save()

    res.redirect(shortUrl.full)
})