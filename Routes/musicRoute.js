var express = require('express');
var musicRouter = express.Router();

var routes = function (Album) {
    var musicController = require('../Controllers/musicController.js')(Album);

    musicRouter.route('/')
        .options(function (req, res) {
            res.set('Allow', 'GET,OPTIONS,POST');
            res.end();
        })
        .post(musicController.post)

        .get(musicController.get);

    musicRouter.use('/:albumId', function (req, res, next) {
        Album.findById(req.params.albumId, function (err, album) {
            if (err) {
                res.status(500).send(err);
            }

            else if (album) {
                req.album = album;
                next();
            }
            else {
                res.status(404).send('Album not found');
            }

        });
    });

    musicRouter.route('/:albumId')
        .get(function (req, res) {
            var response = {};

            response.items = req.album;

            response._links = {
                "self": {
                    "href": req.protocol + '://' + req.get('host') + '/api/albums/' + req.album.id
                },
                "collection": {
                    "href": req.protocol + '://' + req.get('host') + '/api/albums/'
                }
            };


            res.json(response);
        })

        .put(function (req, res) {

            var requiredFields = ['title', 'artist', 'year', 'tracks'];
            var error = false;

            for (var i = 0; i < requiredFields.length; i++) {
                if (req.body.items[requiredFields[i]] === undefined || req.body.items[requiredFields[i]] == '') {
                    error = true;
                }
            }

            if(!error) {
                req.album.title = req.body.items.title;
                req.album.artist = req.body.items.artist;
                req.album.tracks = req.body.items.tracks;
                req.album.year = req.body.items.year;

                if(req.headers['content-type'] == 'application/json') {
                    req.album.save(function (err) {
                        if (err) {
                            res.status(500).send(err);
                        }
                        else {
                            var response = {};
                            response.items = req.album;

                            response._links = {
                                "self": {
                                    "href": req.protocol + '://' + req.get('host') + '/api/albums/' + req.album.id
                                },
                                "collection": {
                                    "href": req.protocol + '://' + req.get('host') + '/api/albums/'
                                }
                            };

                            res.json(response);


                        }
                    });
                } else {
                    res.status(400).json({'message':'Headers are incorrect'});
                }
            } else {
                res.status(415).json({'message':'Unsupported format: */*'});
            }
        })

        .patch(function (req, res) {
            if (req.body._id) {
                delete req.body._id;
            }
            for (var p in req.body) {
                req.album[p] = req.body[p];
            }

            req.album.save(function (err) {
                if (err) {
                    res.status(500).send(err);
                }
                else {
                    res.json(req.album);
                }
            });
        })
        .delete(function (req, res) {
            req.album.remove(function (err) {
                if (err) {
                    res.status(500).send(err);
                }
                else {
                    res.status(204).send('Album was removed')
                }
            });
        })
        .options(function (req, res) {
            res.set('Allow', 'GET,OPTIONS,PUT,PATCH,DELETE');
            res.end();
        });

    return musicRouter;
};

module.exports = routes;
