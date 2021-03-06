# PTO_Angular #
Website for Centerville PTO
Built using the angular material library

## Screenshots
![Home Desktop](https://github.com/WhiteAbeLincoln/PTO_Angular/raw/master/pictures/home.png)
<img src="https://github.com/WhiteAbeLincoln/PTO_Angular/raw/master/pictures/new_article-m.png" alt="Article Mobile" height="500px"/>
<img src="https://github.com/WhiteAbeLincoln/PTO_Angular/raw/master/pictures/new_download-m.png" alt="Download Mobile" height="500px"/>
<img src="https://github.com/WhiteAbeLincoln/PTO_Angular/raw/master/pictures/downloads-m.png" alt="Create Download Mobile" height="500px"/>

See more in the [pictures directory](https://github.com/WhiteAbeLincoln/PTO_Angular/tree/master/pictures/)

## Authors
+ Abraham White
+ Ali Abiba
+ Chudi Archimalo
+ Ashley Roselius

## Building

1. Download and install [node](http://nodejs.org/) and npm.
2. Open the command prompt and change directories to the project directory e.g. `cd PTO_Angular`
3. Install [grunt](http://gruntjs.com/) using `npm install -g grunt-cli`.
4. Install [bower](http://bower.io/) using `npm install -g bower`
2. Install dependencies with `npm install`.
3. Change directory to public `cd public`
4. Install bower components `bower install`
5. Install build dependencies `npm install`
6. Run grunt build script `grunt build`
7. import the mysql database from `PTO_Angular/pto.sql` (run from the command line `mysql -u root -p < pto.sql`)

## Running

1. Install [pm2](https://www.npmjs.com/package/pm2) (`npm install -g pm2`)
2. Optionally make pm2 stay alive over server restarts (`pm2 startup`)
3. Edit the www.sh file to contain your mysql server specific variables
4. Start the server using `pm2 start ./www.sh` from the root project directory
5. The default username for the admin account. u: Admin p: C3nterv!llePTO

## Attribution
+ Google [material design icons](https://github.com/google/material-design-icons/)
    - [license](https://github.com/google/material-design-icons/blob/master/LICENSE) (CC BY 4.0)
