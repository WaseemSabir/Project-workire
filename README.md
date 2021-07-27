# Project-workire
The workire application is a single page client application that uses RestFul Api calls for data and view rendering. The client application is built with Angular JS Framework whereas the Data and API calls are handled by Django Rest Framework. PostgreSQL is used as database which is deployed on AWS. Angular Universal is used for server side rendering, it pre renders the page to HTML on the server side which can helps in performance, and latency issues; and also highly improves the search engine optimization. 

The project is develepment phase, but you can run it on localhost:

Requiremnets:<br>
    &emsp; Angular Cli (11.8.0)<br>
    &emsp; Python (3.8.6)<br>

To run Server APP:<br>
    &emsp; cd Server-app<br>
    &emsp; pip3 -r requirements.txt<br>
    &emsp; Python3 manage.py runserver<br>
    
To serve Client Application:<br>
    &emsp; cd Client-app && npm install<br>
    &emsp; npm run build:ssr && npm run serve:ssr<br>
