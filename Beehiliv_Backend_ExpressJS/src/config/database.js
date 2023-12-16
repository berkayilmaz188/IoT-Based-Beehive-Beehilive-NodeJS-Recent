const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost/beehiliv",
    {useUnifiedTopology:true,
     useNewUrlParser:true
    })
.then(()=> console.log('veritabanina baglanildi.'))
.catch(hata =>console.log(`veritabani baglanti hatasi: ${hata}`));
