# heavymetal

This project was my first full-stack Javascript application, a simple no-frills gym workout logger.
It uses an Express server, a MongoDB database (using mongoose as an ORM), and React with Javascript for the front-end.

I wrote this because the majority of apps in this category are either subscription based, or bloated with features I personally have no need for.
Heavymetal is straight to the point, and achieves the intended functionality.

# Instructions to run

To run this app you will need [MongoDB](https://www.mongodb.com/) running on your local machine.

Run `npm i` from the server and src folder.
Run `node index.js` from the server folder.
Run `npm run dev` from the src folder.

# Useage

The app will load with the calendar set to the current date. You can navigate backwards & forwards in time with the arrows, or select a specific date from the calendar for your workout.

Once you have chosen the date, navigate to the exercise management page from the sidebar and choose your exercise selection from the categories provided. You can add new exercises at the bottom with 'Create' if you wish.

Navigate back to the 'daily workout log', select the exercise you want to track and use the controls to save your sets & reps.

That's it! Everything is automatically saved to the database on interaction. 💪🏻
