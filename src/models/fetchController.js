var fetchModel = require('../models/starfetch');
module.exports = {

    fetchData: function(req, res) {

        fetchModel.fetchData(function(data) {
            res.render('star', { userData: data });
        })
    }
}