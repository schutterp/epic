# Node Tutorial

This is a basic web dev tutorial using *javascript, git, node, npm, html*. I am creating this for my little brother, Cody Schutte. Wish him luck on his journey to learn the secrets of the javascripts.

The name `epic` was taken from NASA's DSCOVR:EPIC (Earth Polychromatic Imaging Camera) because we are taking data from their EPIC project.

Where will this take us? Let's find out...

## First Steps

1.
```
$ pwd
> ~/project
```
2. `$ git init epic`
3. add a `.gitignore` file for node_modules directory
2. `$ cd epic`
3. `$ npm init --yes`
4. `$ npm install htmlparser2 --save`
5. `$ npm install request --save`
4. create index.js
6. `git add .`
7. `git commit -m 'my first commit'`

After creating the first little bit I start exploring. How does their app work?

It isn't making async requests like I would expect. Instead all the script tags are put in the head and they pull in both javascript and data.

I thought the `/api/images.php?dates` source looked interesting so I found out it's a list of valid dates. I then removed the query parameter and got some VERY interesting results! Turns out I can make a request for any of the valid dates and get all the data I need for each image!!! Thank you NASA!

At this point the project is going to pivot: we don't need to parse html since we can call the wonderful json apis provided to us! I'm going to now move `index.js` to a file with a more descriptive name, and start working on a different one to get the dates and use them!


Plans:
-create a lesson about getting an html page set up (static is fine)
-playground for d3 and earth map
-



## Fun other stuff to come:

-define npm run for babel... it should do the request and we could demonstrate passing options
-use trumpet
-build a web interface




Copyright (c) 2015 Ryan Schutte, Cody Schutte



Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:



The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.



THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
