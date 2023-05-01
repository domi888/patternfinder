const express = require('express')
const app = express()
const cors = require('cors');
const port = 3000
const fs = require('fs');

const dbService = require('./dbService');



app.use(cors());
app.use(express.json());
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/img', express.static(__dirname + 'public/img'))

app.get('', (req, res) =>{
    res.sendFile(__dirname + '/views/pattern.html');
});
app.get('/pattern.html', (req, res) =>{
    res.sendFile(__dirname + '/views/pattern.html');
});
app.get('/probability.html', (req, res) =>{
    res.sendFile(__dirname + '/views/probability.html');
});
app.get('/news.html', (req, res) =>{
    res.sendFile(__dirname + '/views/news.html');
});

//get
app.get('/name/:id', (request, response) =>{
    const db = dbService.getDbServiceInstance();

    const result = db.getAllData("SELECT * FROM coinnames WHERE name = '"+request.params.id+"';");
    result.then(data => response.json({data: data[0].name}))
    .catch(err => response.json({data: 'not_found'}));
})
app.get('/news/:id', (request, response) =>{
    const db = dbService.getDbServiceInstance();

    const result = db.getAllData("SELECT link FROM coinnames, news WHERE coinnames.nameId = news.nameId AND coinnames.name = '"+request.params.id+"';");
    result.then(data => response.json({data: data[0].link}))
    .catch(err => console.log(err));
})
app.get('/purchase/:id', (request, response) =>{
    const db = dbService.getDbServiceInstance();

    const result = db.getAllData("SELECT purchase_link FROM purchase, news, coinnames WHERE purchase.newsId = news.id AND news.id = coinnames.nameId and coinnames.name = '"+request.params.id+"';");
    result.then(data => response.json({data: data[0].purchase_link}))
    .catch(err => console.log(err));
})
app.get('/coin/:id', (request, response) =>{
    const db = dbService.getDbServiceInstance();

    const result = db.getAllData("SELECT value, date FROM coins, coinnames WHERE coins.nameId = coinnames.nameId and name = '"+request.params.id+"';");

    result.then(data => response.json({data: data}))
    .catch(err => console.log(err));
})
app.get('/get_shots', (request, response) =>{
    let scrn = "{ \"schreenshot\": \"";
    fs.readFile('screenshots.json', 'utf-8', function(err, result){
        if(err)console.log(err);//handle error
        scrn+=JSON.parse(result)["schreenshot"]+"\" }";

        fs.writeFile('screenshots.json', scrn, (err) => {
            if (err) console.log(err);
            else{
                response.send(scrn);
            }
        });
    });
})
app.patch('/patch_shot/:id', (request, response) =>{
    let scrn = "{ \"schreenshot\": \"";
    let number_needed_to_replace = request.params.id.split('$').length-1;
    let replaced_param_id = request.params.id;
    for(let i = 0; i < number_needed_to_replace; i++){
        replaced_param_id = replaced_param_id.replace('$', '/');
    }

    fs.readFile('screenshots.json', 'utf-8', function(err, result){
        let urls = JSON.parse(result)["schreenshot"].split(';');

        for(let i = 0; i < urls.length-1; i++){
            if(!urls[i].includes(replaced_param_id)){
                scrn+=urls[i]+';';
            }
            else{
                scrn += urls[i].split('<')[0]+"<"+request.body.nickname+">;";
            }
        }
        if(err)console.log(err);//handle error
        scrn+="\" }";

        fs.writeFile('screenshots.json', scrn, (err) => {
            if (err) response.send('failed');
            else{
                response.send('success');
            }
        });
    });
})
app.delete('/delete_shot/:id', (request, response) =>{
    let scrn = "{ \"schreenshot\": \"";
    let number_needed_to_replace = request.params.id.split('$').length-1;
    let replaced_param_id = request.params.id;
    for(let i = 0; i < number_needed_to_replace; i++){
        replaced_param_id = replaced_param_id.replace('$', '/');
    }
    fs.readFile('screenshots.json', 'utf-8', function(err, result){
        let urls = JSON.parse(result)["schreenshot"].split(';');
        for(let i = 0; i < urls.length-1; i++){
            if(!urls[i].includes(replaced_param_id)){
                scrn+=urls[i]+';';
            }
        }
        if(err)console.log(err);//handle error
        scrn+="\" }";

        fs.writeFile('screenshots.json', scrn, (err) => {
            if (err) response.send('failed');
            else{
                response.send('success');
            }
        });
    });
})
//post
app.post('/post_shot',(request,response) => {
    let scrn = "{ \"schreenshot\": \"";
    let only_the_base_of_url = request.body.url2.split("<")[0];
    fs.readFile('screenshots.json', 'utf-8', function(err, result){
        if(err)console.log(err);//handle error
        scrn+=JSON.parse(result)["schreenshot"]+request.body.url2+';'+"\" }";

        fs.writeFile('screenshots.json', scrn, (err) => {
            if (err) console.log(err);
            else{
                response.send(scrn);
                setTimeout(function(){
                    fs.readFile('screenshots.json', 'utf-8', function(err, result){
                        if(err)console.log(err);//handle error
                        let scrn_=JSON.parse(result)["schreenshot"];
                        
                        let myArray = scrn_.split(';')
                        let new_scrn = "{ \"schreenshot\": \"";
                        for(let i = 0; i < myArray.length-1; i++){
                            if(!myArray[i].includes(only_the_base_of_url)){
                                new_scrn+=myArray[i]+";";
                            }
                        }
                        new_scrn += "\" }";

                        fs.writeFile('screenshots.json', new_scrn, (err) => {
                            if (err) console.log(err);
                        });
                    });
            
                }, 25000)
            }
        });

    });

});





app.listen(port, () => console.info("Listening on port "+port))