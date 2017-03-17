var musicController = function (Album) {

        var post = function (req, res) {
            var items;

            if(req.body.items !== undefined) {
                items = req.body.items;
            } else {
                items = req.body;
            }

            var album = new Album(items);
            console.log('body');
            console.log(items);
            console.log('end body');
            var requiredFields = ['title', 'artist', 'year', 'tracks'];
            var error = false;

            for (var i = 0; i < requiredFields.length; i++) {
                console.log(requiredFields[i] + ' - ' + items[requiredFields[i]]);
                if (items[requiredFields[i]] === undefined || items[requiredFields[i]] == '') {
                    error = true;
                }
            }

            if(error) {
                res.status(422).send('Vul meer gegevens in');
            } else {
                album.save();

                res.status(201).send(album);
            }
        };

        var get = function (req, res) {
                var query = {};

                // check limit
                var api_limit = parseInt((req.query.limit === undefined ? 0 : req.query.limit));
                var api_start = parseInt((req.query.start === undefined ? 0 : req.query.start));

                if (req.query.artist) {
                    query.artist = req.query.artist;
                }




                Album.find(query, function (err, albums) {
                        if (err)
                            res.status(500).send(err);
                        else
                            var response = {};

                        response.items = [];

                        for (var i in albums) {
                            var album = albums[i];
                            response.items[i] = {
                                id: album.id,
                                title: album.title,
                                artist: album.artist,
                                year: album.year,
                                tracks: album.tracks,
                                favourite: album.favourite
                            };

                            response.items[i]._links = {
                                "self": {
                                    "href": req.protocol + '://' + req.get('host') + '/api/albums/' + album.id
                                },
                                "collection": {
                                    "href": req.protocol + '://' + req.get('host') + '/api/albums/'
                                }
                            }
                        }


                        response._links = {
                            "self": {
                                "href": req.protocol + '://' + req.get('host') + '/api/albums/'
                            }
                        };




                        Album.find(query, function (err, all_albums) {

                            var total = all_albums.length;


                            var default_url = req.protocol + '://' + req.get('host') + '/api/albums';
                            var pages = (api_limit == 0 ? 1 : Math.ceil(total / api_limit));
                            var current_page = (api_limit == 0) ? 1 : Math.ceil(api_start / api_limit);
                            current_page     = (current_page == 0) ? 1 : current_page;

                            var first_url = default_url + '/?limit=' + api_limit + '&start=1';
                            var last_page = default_url + '/?limit=' + api_limit + '&start='+ (pages * api_limit);
                            var prev_page = default_url + '/?limit=' + api_limit + '&start='+ (((current_page -1 ) < 1 ? 1 : (current_page -1)) * api_limit);
                            var next_page = default_url + '/?limit=' + api_limit + '&start='+ ((( current_page == pages) ? pages : (current_page + 1)) * api_limit);


                            response.pagination = {
                                currentPage: current_page,
                                currentItems: (api_limit != 0) ? api_limit : total,
                                totalPages: pages,
                                totalItems: total,
                                _links: {
                                    first: {
                                        "rel" : "first",
                                        "page" : 1,
                                        "href" : (pages == 1) ? default_url : first_url
                                    },
                                    last: {
                                        'rel' : 'last',
                                        'page': pages,
                                        'href': (pages == 1) ? default_url : last_page
                                    },
                                    previous: {
                                        'rel' : 'previous',
                                        'page': (( current_page - 1) < 1 ? 1 : current_page -1),
                                        'href': (pages == 1) ? default_url : prev_page
                                    },
                                    next: {
                                        'rel': 'next',
                                        'page': (( current_page == pages) ? pages : current_page + 1),
                                        'href': (pages == 1) ? default_url : next_page
                                    }
                                }

                            };

                            res.json(response);
                        });

                    }
                ).limit(api_limit).skip(api_start);
            }
            ;

        return {
            post: post,
            get: get
        }

    }
    ;
module.exports = musicController;