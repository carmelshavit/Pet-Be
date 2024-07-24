import {express} from 'express';
import {app} from express();


app.get('/users', (req, res) => {
    res.status(200).send('hello');
})

module.export = {
    app
}
