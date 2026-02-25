const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Course = require('./models/Course');
const bcrypt = require('bcryptjs');

dotenv.config();

const users = [
    {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123', // Will be hashed
        role: 'admin'
    },
    {
        name: 'Student User',
        email: 'student@example.com',
        password: 'password123', // Will be hashed
        role: 'student'
    }
];

const courses = [
    {
        title: 'Basic Computers',
        slug: 'basic-computers',
        description: 'Learn the fundamentals of using a computer, file management, and internet basics.',
        category: 'Basics',
        level: 'Beginner',
        price: 0,
        thumbnail: 'https://www.pexels.com/photo/a-man-is-sitting-at-a-desk-with-a-computer-monitor-19238352/',
        modules: [
            { title: 'Introduction', lessons: [{ title: 'What is a Computer?', content: 'A computer is an electronic device...', type: 'text', duration: '5 mins' }] },
            { title: 'OS Basics', lessons: [{ title: 'Windows Navigation', content: 'How to use the start menu...', type: 'text', duration: '10 mins' }] }
        ]
    },
    {
        title: 'MS Office Mastery',
        slug: 'ms-office',
        description: 'Master Word, Excel, and PowerPoint for professional work.',
        category: 'Office Tools',
        level: 'Beginner',
        price: 0,
        thumbnail: 'https://dummyimage.com/600x400/007bff/ffffff&text=MS+Office',
        modules: [
            { title: 'MS Word', lessons: [{ title: 'Formatting Text', content: 'Use bold, italics...', type: 'text', duration: '15 mins' }] },
            { title: 'MS Excel', lessons: [{ title: 'Formulas & Functions', content: 'SUM, AVERAGE...', type: 'text', duration: '20 mins' }] }
        ]
    },
    {
        title: 'HTML & Web Design Mastery',
        slug: 'html-mastery',
        description: 'Complete HTML5 & CSS3 course with 20+ Practice Projects, PDF Notes, and Professional Templates.',
        category: 'Frontend',
        level: 'Beginner',
        price: 0,
        thumbnail: 'https://images.pexels.com/photos/1591060/pexels-photo-1591060.jpeg?auto=compress&cs=tinysrgb&w=600',
        modules: [
            {
                title: 'HTML5 Foundations',
                lessons: [
                    {
                        title: 'Introduction to HTML5',
                        content: `### Welcome to HTML Mastery
HTML (HyperText Markup Language) is the backbone of every website.

#### Key Topics:
- History of HTML
- Environment Setup (VS Code)
- Document Structure (Doctype, Head, Body)
- Basic Tags (h1-h6, p, br, hr)

**Download PDF Notes:** [HTML Introduction - Ashok Technologies](https://github.com/marriashok/ashoktechnolgies/raw/main/materials/html_intro.pdf)`,
                        type: 'text',
                        duration: '20 mins'
                    },
                    {
                        title: 'HTML Elements & Attributes',
                        content: `### Elements and Attributes
Learn how to use attributes like src, href, alt, and id.

#### Example:
\`\`\`html
<a href="https://google.com" target="_blank">Google Search</a>
<img src="logo.png" alt="Company Logo" width="100">
\`\`\``,
                        type: 'text',
                        duration: '30 mins'
                    }
                ]
            },
            {
                title: 'Advanced HTML Features',
                lessons: [
                    {
                        title: 'Forms and Validations',
                        content: `### Advanced Forms
Master form controls, inputs, and validation.

#### PDF Material:
[Complete Form Guide PDF](https://github.com/marriashok/ashoktechnolgies/raw/main/materials/html_forms.pdf)`,
                        type: 'text',
                        duration: '45 mins'
                    },
                    {
                        title: 'Semantic HTML5',
                        content: `### Why Semantic HTML?
Using <header>, <footer>, <main>, <article>, <section> for better SEO and accessibility.`,
                        type: 'text',
                        duration: '25 mins'
                    }
                ]
            },
            {
                title: '20 Practice Projects (Hands-on)',
                lessons: [
                    {
                        title: 'Project List 1-10',
                        content: `### HTML Practice Projects (Beginner)
1. **Personal Portfolio Page** - A basic page about yourself.
2. **Recipe Blog** - Using lists and images.
3. **Contact Form** - Advanced form validation.
4. **Registration Page** - Using all input types.
5. **Event Landing Page** - A single page with anchor links.
6. **Product Catalog** - Tables and descriptive lists.
7. **Business Card** - CSS properties on HTML elements.
8. **Survey Form** - Collecting user data.
9. **News Article Page** - Semantic structure.
10. **Tribute Page** - Honoring a personality.

**Project Source Code:** [Download Starter Files](https://github.com/marriashok/ashoktechnolgies/tree/main/projects)`,
                        type: 'text',
                        duration: '120 mins'
                    },
                    {
                        title: 'Project List 11-20',
                        content: `### HTML Practice Projects (Intermediate)
11. **Pricing Table** - Comparing different plans.
12. **Login/Signup System UI** - Front-end only.
13. **Restaurant Menu** - Organizing items with categories.
14. **Photography Portfolio** - Gallery and grid.
15. **Technical Documentation Page** - Clear navigation.
16. **Landing Page with Video** - Video and audio tags.
17. **Simple Calculator UI** - Grid layout.
18. **To-Do List Interface** - Clean and functional.
19. **Newsletter Subscription** - Integrated forms.
20. **Full Agency Website** - Combining everything learned.`,
                        type: 'text',
                        duration: '180 mins'
                    }
                ]
            },
            {
                title: 'Reference Materials',
                lessons: [
                    {
                        title: 'Complete HTML Cheat Sheet',
                        content: `### Quick Reference
Download the ultimate HTML cheat sheet for quick reference during coding.

[Download PDF Cheat Sheet](https://github.com/marriashok/ashoktechnolgies/raw/main/materials/html_cheatsheet.pdf)`,
                        type: 'text',
                        duration: '5 mins'
                    }
                ]
            }
        ]
    },
    {
        title: 'JavaScript Essentials',
        slug: 'javascript',
        description: 'The programming language of the web.',
        category: 'Programming',
        level: 'Intermediate',
        price: 0,
        thumbnail: 'https://dummyimage.com/600x400/007bff/ffffff&text=JavaScript',
        modules: [
            {
                title: 'JavaScript Basics',
                lessons: [
                    {
                        title: 'Variables & Data Types',
                        content: `
### Variables
Variables are containers for storing data.

#### Declaring Variables:
- \`let\`: Block-scoped variable (can be reassigned).
- \`const\`: Block-scoped constant (cannot be reassigned).
- \`var\`: Function-scoped (legacy).

#### Example:
\`\`\`javascript
let name = "John";
const pi = 3.14;
let isStudent = true;

console.log(name, pi, isStudent);
\`\`\`
                        `,
                        type: 'text',
                        duration: '15 mins'
                    },
                    {
                        title: 'Functions',
                        content: `
### Functions
Functions are blocks of code designed to perform a particular task.

#### Arrow Functions (ES6):
Arrow functions provide a shorter syntax.

#### Example:
\`\`\`javascript
// Traditional Function
function add(a, b) {
    return a + b;
}

// Arrow Function
const multiply = (x, y) => x * y;

console.log(add(5, 3));      // Output: 8
console.log(multiply(4, 2)); // Output: 8
\`\`\`
                        `,
                        type: 'text',
                        duration: '20 mins'
                    }
                ]
            },
            {
                title: 'DOM & Events',
                lessons: [
                    {
                        title: 'DOM Manipulation',
                        content: `
### Document Object Model (DOM)
The DOM allows JavaScript to change values of HTML elements.

#### Selecting Elements:
- \`document.getElementById('id')\`
- \`document.querySelector('.class')\`

#### Example:
\`\`\`javascript
// Change text of an element
const header = document.querySelector('h1');
header.innerText = "Hello World!";

// Change style
header.style.color = "blue";
\`\`\`
                        `,
                        type: 'text',
                        duration: '25 mins'
                    }
                ]
            }
        ]
    },
    {
        title: 'React.js Frontend Development',
        slug: 'react-js',
        description: 'Build modern single-page applications with React.',
        category: 'Frontend',
        level: 'Intermediate',
        price: 0,
        thumbnail: 'https://dummyimage.com/600x400/007bff/ffffff&text=React.js',
        modules: [
            {
                title: 'Components',
                lessons: [
                    {
                        title: 'Functional Components',
                        content: `
### Creating Components
Components are the building blocks of React applications.

#### Example:
\`\`\`jsx
const Welcome = ({ name }) => {
  return <h1>Hello, {name}</h1>;
};
\`\`\`
                        `,
                        type: 'text',
                        duration: '15 mins'
                    }
                ]
            },
            {
                title: 'Hooks',
                lessons: [
                    {
                        title: 'useState Hook',
                        content: `
### Managing State
useState allows you to add state to functional components.

#### Example:
\`\`\`jsx
import { useState } from 'react';

const Counter = () => {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
};
\`\`\`
                        `,
                        type: 'text',
                        duration: '20 mins'
                    }
                ]
            }
        ]
    },
    {
        title: 'Python for Beginners',
        slug: 'python',
        description: 'Learn Python programming language from scratch.',
        category: 'Programming',
        level: 'Beginner',
        price: 0,
        thumbnail: 'https://dummyimage.com/600x400/007bff/ffffff&text=Python',
        modules: [
            {
                title: 'Python Fundamentals',
                lessons: [
                    {
                        title: 'Syntax & Indentation',
                        content: `
### Python Syntax
Python relies on indentation (whitespace) to define scope, such as loops and functions.

#### Example:
\`\`\`python
if 5 > 2:
    print("Five is greater than two!")
    
# Correct Indentation is crucial
def my_function():
    print("Hello from a function")
\`\`\`
                        `,
                        type: 'text',
                        duration: '10 mins'
                    },
                    {
                        title: 'Control Flow',
                        content: `
### If...Else and Loops
Control the flow of your program.

#### Example:
\`\`\`python
# If-Else
x = 10
if x > 5:
    print("x is large")
else:
    print("x is small")

# For Loop
fruits = ["apple", "banana", "cherry"]
for x in fruits:
    print(x)
\`\`\`
                        `,
                        type: 'text',
                        duration: '20 mins'
                    }
                ]
            },
            {
                title: 'Data Structures',
                lessons: [
                    {
                        title: 'Lists & Dictionaries',
                        content: `
### Lists
Ordered, changeable collections.
\`\`\`python
mylist = ["apple", "banana", "cherry"]
print(mylist[1]) # banana
\`\`\`

### Dictionaries
Key-value pairs.
\`\`\`python
thisdict = {
  "brand": "Ford",
  "model": "Mustang",
  "year": 1964
}
print(thisdict["brand"]) # Ford
\`\`\`
                        `,
                        type: 'text',
                        duration: '25 mins'
                    }
                ]
            }
        ]
    },
    {
        title: 'Node.js Backend Development',
        slug: 'node-js',
        description: 'Build scalable backend API services.',
        category: 'Backend',
        level: 'Advanced',
        price: 0,
        thumbnail: 'https://dummyimage.com/600x400/007bff/ffffff&text=Node.js',
        modules: [
            {
                title: 'Introduction to Node.js',
                lessons: [
                    {
                        title: 'Setting up a Server',
                        content: `
### Creating a Web Server
Node.js uses the 'http' module or frameworks like Express to create servers.

#### Simple HTTP Server:
\`\`\`javascript
const http = require('http');

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});
\`\`\`
                        `,
                        type: 'text',
                        duration: '20 mins'
                    }
                ]
            },
            {
                title: 'Express Framework',
                lessons: [
                    {
                        title: 'Routing with Express',
                        content: `
### Express Routing
Express simplifies server creation and routing.

#### Basic Routes:
\`\`\`javascript
const express = require('express');
const app = express();

// GET Route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// POST Route
app.post('/api/users', (req, res) => {
  res.send('Create User');
});

app.listen(3000);
\`\`\`
                        `,
                        type: 'text',
                        duration: '25 mins'
                    }
                ]
            }
        ]
    },
    {
        title: 'SQL & Databases',
        slug: 'sql-databases',
        description: 'Master Relational Database Management Systems.',
        category: 'Database',
        level: 'Intermediate',
        price: 0,
        thumbnail: 'https://dummyimage.com/600x400/007bff/ffffff&text=SQL',
        modules: [
            {
                title: 'Introduction to SQL',
                lessons: [
                    {
                        title: 'What is a Database?',
                        content: `
### Database Basics
A database is an organized collection of data, so that it can be easily accessed and managed.

#### Key Concepts:
- **Table**: Data is stored in rows and columns.
- **Row (Record)**: A single entry in a table.
- **Column (Field)**: A specific attribute of the data.

#### Example Table: \`Students\`
| ID | Name | Age | Course |
|----|------|-----|--------|
| 1  | John | 20  | CS     |
| 2  | Mary | 21  | IT     |
                        `,
                        type: 'text',
                        duration: '10 mins'
                    },
                    {
                        title: 'Basic SQL Commands',
                        content: `
### SQL Commands
SQL (Structured Query Language) is used to communicate with databases.

#### 1. SELECT
Retrieves data from a database.
\`\`\`sql
SELECT * FROM Users;
SELECT name, email FROM Users WHERE age > 18;
\`\`\`

#### 2. INSERT
Inserts new data into a database.
\`\`\`sql
INSERT INTO Users (name, email) VALUES ('John Doe', 'john@example.com');
\`\`\`

#### 3. UPDATE
Updates existing data.
\`\`\`sql
UPDATE Users SET age = 21 WHERE name = 'John Doe';
\`\`\`

#### 4. DELETE
Deletes data from a database.
\`\`\`sql
DELETE FROM Users WHERE id = 1;
\`\`\`
                        `,
                        type: 'text',
                        duration: '25 mins'
                    }
                ]
            },
            {
                title: 'Advanced Queries',
                lessons: [
                    {
                        title: 'Joins',
                        content: `
### SQL Joins
Joins are used to combine rows from two or more tables, based on a related column between them.

#### Types of Joins:
1. **INNER JOIN**: Returns records that have matching values in both tables.
2. **LEFT JOIN**: Returns all records from the left table, and the matched records from the right table.
3. **RIGHT JOIN**: Returns all records from the right table, and the matched records from the left table.

#### Example:
\`\`\`sql
SELECT Orders.OrderID, Customers.CustomerName
FROM Orders
INNER JOIN Customers ON Orders.CustomerID = Customers.CustomerID;
\`\`\`
                        `,
                        type: 'text',
                        duration: '30 mins'
                    },
                    {
                        title: 'Aggregation',
                        content: `
### Aggregate Functions
Used to perform checks or calculations on a set of values.

#### Common Functions:
- \`COUNT()\`: Returns the number of rows.
- \`SUM()\`: Returns the total sum of a numeric column.
- \`AVG()\`: Returns the average value.

#### Example:
\`\`\`sql
SELECT COUNT(id) FROM Products;
SELECT AVG(price) FROM Products WHERE category = 'Electronics';
\`\`\`
                        `,
                        type: 'text',
                        duration: '20 mins'
                    }
                ]
            }
        ]
    },
    {
        title: 'Full Stack Development',
        slug: 'full-stack',
        description: 'Become a complete developer (MERN Stack).',
        category: 'Full Stack',
        level: 'Advanced',
        price: 0,
        thumbnail: 'https://dummyimage.com/600x400/007bff/ffffff&text=Full+Stack',
        modules: [
            { title: 'Architecture', lessons: [{ title: 'Client-Server', content: 'REST API communication...', type: 'text', duration: '20 mins' }] },
            { title: 'Deployment', lessons: [{ title: 'CI/CD', content: 'GitHub Actions...', type: 'text', duration: '25 mins' }] }
        ]
    },
    {
        title: 'Angular - All Versions',
        slug: 'angular-complete',
        description: 'Master Angular from v2 to the latest versions.',
        category: 'Frontend',
        level: 'Advanced',
        price: 0,
        thumbnail: 'https://dummyimage.com/600x400/007bff/ffffff&text=Angular',
        modules: [
            { title: 'Angular Basics', lessons: [{ title: 'Components & Modules', content: 'Learn about @Component and NgModule...', type: 'text', duration: '30 mins' }] }
        ]
    },
    {
        title: 'React Native Mobile App Development',
        slug: 'react-native',
        description: 'Build native mobile apps for iOS and Android using React.',
        category: 'Mobile',
        level: 'Intermediate',
        price: 0,
        thumbnail: 'https://dummyimage.com/600x400/007bff/ffffff&text=React+Native',
        modules: [
            { title: 'Mobile UI', lessons: [{ title: 'View, Text, Image', content: 'Core components of React Native...', type: 'text', duration: '20 mins' }] }
        ]
    },
    {
        title: 'Next.js 14 Full Course',
        slug: 'next-js',
        description: 'The React Framework for the Web. Learn App Router, SSR, and more.',
        category: 'Full Stack',
        level: 'Advanced',
        price: 0,
        thumbnail: 'https://dummyimage.com/600x400/007bff/ffffff&text=Next.js',
        modules: [
            { title: 'App Router', lessons: [{ title: 'File-based Routing', content: 'How page.js and layout.js work...', type: 'text', duration: '25 mins' }] }
        ]
    },
    {
        title: 'Vue.js Progressive Framework',
        slug: 'vue-js',
        description: 'Learn Vue 3 and the Composition API.',
        category: 'Frontend',
        level: 'Intermediate',
        price: 0,
        thumbnail: 'https://dummyimage.com/600x400/007bff/ffffff&text=Vue.js',
        modules: [
            { title: 'Vue Basics', lessons: [{ title: 'Directives (v-if, v-for)', content: 'Conditional rendering in Vue...', type: 'text', duration: '20 mins' }] }
        ]
    },
    {
        title: 'Oracle PL/SQL Programming',
        slug: 'plsql',
        description: 'Learn procedural language for SQL.',
        category: 'Database',
        level: 'Advanced',
        price: 0,
        thumbnail: 'https://dummyimage.com/600x400/007bff/ffffff&text=PLSQL',
        modules: [
            { title: 'PL/SQL Blocks', lessons: [{ title: 'Procedures & Functions', content: 'Writing re-usable database logic...', type: 'text', duration: '30 mins' }] }
        ]
    }
];

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

const importData = async () => {
    await connectDB();
    try {
        await Course.deleteMany();
        await User.deleteMany();

        // Hash passwords
        for (let user of users) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
        }

        await User.insertMany(users);
        console.log('Users Imported');

        await Course.insertMany(courses);
        console.log('Courses Imported');

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

importData();
