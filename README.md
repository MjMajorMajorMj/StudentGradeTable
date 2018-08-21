# Student Grade Table

The Student Grade Table is a web application that allows the user to manage students and their respective grades via CRUD (Create, Read, Update, Delete) functionality. The app utilizes Bootstrap 4 for the clean design and mobile responsiveness, JavaScript for front-end functionality, PHP 7 for back-end APIs, and MySQL for database storage.
You may test it on [the live demo]. 

## Features

  - Create new students, read the data of about a thousand entries, update any student's name, course name, and/or grade, and delete any entry
  - Responsive design allows for ease of usage from both desktop and mobile access
  - Pagination functionality to reduce performance issues on the browser (the current database holds about a thousand entries)
  - Find students and courses with the search function which includes the ability to search for multiple terms

## Planned Features
  - Login system for both teachers and students. Teachers will be able to create, read, update, and delete respective assigned students. Students will only be able to read their own respective entries.
  - Dropdown menu with suggested results for the search bar.
  - Full-text index for the MySQL table to enable natural language searching
  - A dark/night theme, because why not?

## Personal Insight
> The Student Grade Table is a personal achievement of mine because it my first major solo project. I worked on two other web applications ([Peaky Finder] and [Food Nation]) but those are group projects.

> In the beginning, the Student Grade Table was a project to understand API interaction. Soon after, I've learned to migrate from the external API and database to create my own.

> More features were soon added. As the database started to scale from a handful of students to about one thousand, the issue regarding browser performance arised, and from that issue came the pagination feature.

> One other lesson I learned is when developing web applications, one must account for the small (but important) details. For example, in the early versions of this app, clicking on the delete button would simply delete the student. Now, doing so would display two buttons (or a modal on the mobile version), asking the user whether to confirm the deletion. This feature is a safeguard against accidental deletions caused by the user.

> All in all, the Student Grade Table didn't just force me to develop better programming skills but also better habits and considerations regarding web development. As I continue to work on this web application, my skills and habits will continue to grow.

## Contributions
If you want to contribute, great! Shoot me a message towards [my email] or [my portfolio] and we'll working something out. I'd perfer short but concise commits (easier to track in my opinion).

   [the live demo]: <https://sgt.aaroncpark.com/>
   [Peaky Finder]: <http://peakyfinder.com>
   [Food Nation]: <http://http://foodnation.aaroncpark.com/>
   [my email]: <http://aaroncpark@protonmail.com>
   [my portfolio]: <https://aaroncpark.com/>
