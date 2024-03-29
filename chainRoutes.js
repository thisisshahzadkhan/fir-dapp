var block = require('./schema');
var sha256 = require('js-sha256');

module.exports = function(app, auth) {
    //get list
    app.get('/firlist', (req, res) => {
        block.find({}, function(err, dbres) {
            if (err) console.log(err);
            else {
                res.render('showfir', { dbres })
                    // console.log(dbres);
                    // res.json({ 'FIRs': dbres });
            }
        });
    });

    //fir by firnumber
    app.post('/firlistbynumber', (req, res) => {
        block.find({ firNumber: req.body.firNumber }, function(err, dbres) {
            if (err) console.log(err);
            else {
                console.log(dbres);
                res.json({ FIR: dbres });
            }
        });
    });

    //fir by caseTitle
    app.post('/firlistbycasetitle', (req, res) => {
        block.find({ caseTitle: req.body.caseTitle }, function(err, dbres) {
            if (err) console.log(err);
            else {
                console.log(dbres);
                res.json({ FIR: dbres });
            }
        });
    });

    app.get('/addfir', auth, (req, res) => {
        res.render('addfir');
    });
    app.post('/addFIR', auth, (req, res) => {
        block.find({}, function(err, dbres) {
            if (err) console.log(err);
            else {
                var previousHashTemp, firNumberTemp;
                if (dbres.length === 0) {
                    previousHashTemp = 'genesis';
                    firNumberTemp = 0;
                } else {
                    previousHashTemp = dbres[dbres.length - 1].hash;
                    firNumberTemp = (dbres[dbres.length - 1].firNumber);
                    firNumberTemp++;
                    console.log(firNumberTemp);
                }
                var timeStampTemp = new Date().toGMTString();
                var hashTemp = sha256(previousHashTemp +
                    req.body.caseTitle +
                    firNumberTemp +
                    req.body.officerId +
                    timeStampTemp +
                    req.body.location +
                    req.body.complaint +
                    req.body.victims +
                    req.body.accused +
                    req.body.witness +
                    req.body.offenseSections);
                console.log(hashTemp);
                //create new chain
                block.create(new block({
                    previousHash: previousHashTemp,
                    hash: hashTemp,
                    caseTitle: req.body.caseTitle,
                    firNumber: firNumberTemp,
                    timestamp: timeStampTemp,
                    location: req.body.location,
                    complaint: req.body.complaint,
                    victims: req.body.victims,
                    accused: req.body.accused,
                    witness: req.body.witness,
                    offenseSections: req.body.offenseSections
                }), function(err, dbres) {
                    //console.log(err);
                    console.log(dbres);
                    res.json({ msg: dbres });
                });

            }
        });
    });
}