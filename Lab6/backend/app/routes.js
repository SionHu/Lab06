// app/routes.js
module.exports = function(app, passport) {
	var favicon = require('serve-favicon');
	app.use(favicon('favicon.ico'));
    //our user information
	var userInfo = require('./models/userinfo');
    //our post information(foreigin key email)
    var postInfo = require('./models/post');

    // =====================================
    // HOME PAGE (with account info) =======
    // =====================================
    app.get('/', function(req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });

	// =====================================
    // ACCOUNT (with login links) ==========
    // =====================================
	app.get('/account', canEnter, function(req,res){
		res.render('account.ejs'); // load the account.ejs file
	});
	
    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    
	app.get('/login', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') }); 
    });
    // process the login form
    // app.post('/login', do all our passport stuff here);

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // process the signup form
    // app.post('/signup', do all our passport stuff here);

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
		//console.log(req.body.fname);
		//console.log(req.body.lname);
        var userinfo = {'fname' : "",
                        'lname' : "",
                        'phoneno' : "",
                        'bio'     : "Hey"
        };
        userInfo.findOne({'email' : req.user.local.email}, function(err, userin, next){
            if(err) return handleError(err);
            if(!userin) {
                console.log("no info yet");
                res.render('profile.ejs', {
                user : req.user,
                userinfo : userinfo
            // get the user out of session and pass to template
            //check if there is a userinfo in the db
                });
            }
            else {
                console.log('find info');
                console.log(userin.bio);
                userinfo.fname = userin.fname;
                userinfo.lname = userin.lname;
                userinfo.phoneno = userin.phoneno;
                userinfo.bio = userin.bio;
                res.render('profile.ejs', {
                user : req.user,
                userinfo : userinfo
                // get the user out of session and pass to template
                //check if there is a userinfo in the db
                });
            } 
        });

        //console.log(userinfo.fname);
        
    });

    app.post('/profile', isLoggedIn, function(req, res) {
        var userinfo = {'email' : req.user.local.email,
                        'fname' : req.body.fname,
                        'lname' : req.body.lname,
                        'phoneno' : req.body.phoneno,
                        'bio'     : req.body.bio,
        };

        //insert whatever
        userInfo.findOne({'email' : req.user.local.email}, function(err, userin){
            if(err) return handleError(err);
            if(!userin){
                var newUserinfo = new userInfo();
                newUserinfo.email = userinfo.email;
                newUserinfo.fname = userinfo.fname;
                newUserinfo.lname = userinfo.lname;
                newUserinfo.phoneno = userinfo.phoneno;
                newUserinfo.bio = userinfo.bio;
                newUserinfo.save(function(err){
                    if(err)
                        throw err;
                    else
                        console.log('store in db successfully');
                })
            }
            else{
                userInfo.update({'email' : req.user.local.email}, {$set : {'fname' : req.body.fname,
                        'lname' : req.body.lname,
                        'phoneno' : req.body.phoneno,
                        'bio'     : req.body.bio,}}, function(err){
                            if(err) handleError(err);
                        });
            }
        });

        res.render('profile.ejs' , {
            user : req.user,
            //check to see if there is anything to and update
            userinfo : userinfo
        });
    });


	//get the request of creating a renting post
    app.get('/post', isLoggedIn, function(req, res) {
        res.render('post.ejs');
    });

    //after finish the post. We can find up the new post update in our history list 
    app.post('/post', isLoggedIn, function(req, res){
        res.render('post.ejs');
    });

	// process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
	
	// process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
	
    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};
	 
	 
function suserinfo(req, res) {
	console.log(req.body.fname);
	console.log(req.body.lname);
}
	 
// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
	console.log("no auth");
    res.redirect('/login');
}

function canEnter(req, res, next) {
	if(req.isAuthenticated())
		res.redirect('/profile');
	else
		return next();
}
