const express = require('express')
const app = express()
const cors = require('cors')


app.use(cors())
app.use(express.json())

let ingrediants = [
    {
      id: 1,
      title: "Egg",
      date: "11 AED",
      important: true
    },
    {
      id: 2,
      title: "Milk",
      date: "10 AED",
      important: false
    },
    {
      id: 3,
      title: "Bread",
      price: "5 AED",
      important: true
    }
  ]

  const ingrediantsNames = (ingrediants) => {
    let str = '';
    let isFirst = true ;
    ingrediants.forEach(element => {
      if(isFirst){
        str += `${element.title}`;
        isFirst = false ; 
      }else{
        str += `,${element.title}`;
      }
    });
    console.log(str);
    return str;
  }

app.get('/', (req, res) => {
  let str = '';
  const arr = [];
  ingrediants.forEach(element =>{
    str += `<h6>${JSON.stringify(element)}<h6>`;
    arr.push(element.title);
  });
  str += `<br></br>`;
  res.send(str)
})

app.get('/recipe', (req, res) => {
  httprequest(ingrediantsNames(ingrediants)).then((data) => {
    const response = {
        statusCode: 200,
        body: JSON.stringify(data),
    };
  res.send(response.body);
});
});

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

const http = require('https')

function httprequest(ingrediantsNames) {
     return new Promise((resolve, reject) => {
        const options = {
            host: 'api.spoonacular.com',
            path: `/recipes/findByIngredients?ingredients=${ingrediantsNames}&number=3&limitLicense=true&apiKey=f8b0575972ad42c08abf59be2b9031e9`,
            port: 443,
            method: 'GET'
        };
        const req = http.request(options, (res) => {
          if (res.statusCode < 200 || res.statusCode >= 300) {
                return reject(new Error('statusCode=' + res.statusCode));
            }
            var body = [];
            res.on('data', function(chunk) {
                body.push(chunk);
            });
            res.on('end', function() {
                try {
                    body = JSON.parse(Buffer.concat(body).toString());
                } catch(e) {
                    reject(e);
                }
                resolve(body);
            });
        });
        req.on('error', (e) => {
          reject(e.message);
        });
        // send the request
       req.end();
    });
}
