[![Workire logo](https://workire.com/assets/logo-black.png)](https://github.com/WaseemSabir/Project-workire)

# Workire

This is the source code for a production application, deployed at [workire](https://workire.com), with a 90+ Performance, Accessibility, Best Practice and SEO rating with lighthouse.

## Basic Dependencies

The application is CRUD Restful App, with the Client Application built in Angular Framework and the server application is built using Django Rest Framework, and following basic dependcies:

```bash
npm             # v7.19.1 For Javascript Package management
Angular Cli     # v11.8.0
Python          # v3.8.6
```

Other than javascript libraries, the front end also uses Html and CSS with some styling using bootstrap and angular material ui.

## Quickstart

Install the bundles and follow along to get the app running on your machine.

Clone the Repo and go into main folder.

```bash
git clone https://github.com/WaseemSabir/Project-workire.git
cd Project-workire
```

To install the dependencies for Client Application, run following commands:

```bash
cd Client-app
npm install
```

You can serve the application as bundle or serve the pages with Server-side rendering:

```bash
ng serve        # To serve bundled javascript application
npm run dev:ssr     # Enable Server side rendering
```

To serve the Server application, head back to the main folder and run following commands:

```bash
cd Server-app
pip3 install -r requirements.txt
Python3 manage.py runserver
```

It is recommended that you should create a virtual python enviorment before installing these depencies, you can get more information on how to use virtual enviorment [here](https://uoa-eresearch.github.io/eresearch-cookbook/recipe/2014/11/26/python-virtual-env/) if you are not familiar.

For the server application to work, you will also need to set .env in project folder inside server-app with your django and database secrets.

## License
It is not allowed to use any code from the repo for any production or bussiness purposes without [Author](https://github.com/WaseemSabir)'s permission.
