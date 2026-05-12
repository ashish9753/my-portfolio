import { useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../sheet-app/components/Footer';

const sqlSections = [
  {
    title: 'Step 1: Database Basics',
    accent: 'yellow',
    items: [
      {
        q: '1. What is a Database?',
        a: 'A Database is a collection of data stored digitally so it can be accessed, searched, updated, and managed easily.',
        bullets: ['Student records', 'Employee details', 'Bank accounts'],
        tip: 'A software used to manage a database is called a DBMS, such as MySQL, Oracle, or PostgreSQL.'
      },
      {
        q: '2. Types of Database',
        a: 'Databases are commonly divided into relational and non-relational databases.',
        table: {
          headers: ['Type', 'How data is stored', 'Uses', 'Examples'],
          rows: [
            ['Relational Database', 'Tables with rows and columns', 'SQL', 'MySQL, Oracle, SQL Server'],
            ['Non-Relational Database', 'Documents, key-value, graph, or other formats', 'NoSQL query style', 'MongoDB']
          ]
        }
      },
      {
        q: '3. What is SQL?',
        a: 'SQL means Structured Query Language. It is used to interact with relational databases.',
        bullets: ['Create data', 'Read data', 'Update data', 'Delete data'],
        table: {
          headers: ['CRUD Operation', 'Meaning'],
          rows: [
            ['Create', 'Insert new data'],
            ['Read', 'Fetch data'],
            ['Update', 'Modify data'],
            ['Delete', 'Remove data']
          ]
        }
      },
      {
        q: '4. Database Structure',
        a: 'A database contains tables. A table contains rows and columns.',
        table: {
          caption: 'Student Table',
          headers: ['RollNo', 'Name', 'Marks'],
          rows: [
            ['101', 'Ashish', '90'],
            ['102', 'Rahul', '85']
          ]
        },
        bullets: ['Row = complete student data', 'Column = single field such as Name or Marks']
      }
    ]
  },
  {
    title: 'Step 2: Create Database and Table',
    accent: 'yellow',
    items: [
      {
        q: '5. Create, Use, and Delete Database',
        a: 'These commands create a database, select it for work, and delete it when it is no longer needed.',
        code: `CREATE DATABASE college;

USE college;

DROP DATABASE college;`,
        tip: 'DROP DATABASE permanently deletes the database and its tables, so use it carefully.'
      },
      {
        q: '6. Create Table',
        a: 'CREATE TABLE defines the table name, columns, datatypes, and constraints.',
        code: `CREATE TABLE table_name (
    column_name datatype constraint
);

CREATE TABLE student (
    rollno INT PRIMARY KEY,
    name VARCHAR(50),
    marks INT
);`
      },
      {
        q: '7. SQL Datatypes',
        a: 'Datatypes tell SQL what kind of value a column can store.',
        table: {
          headers: ['Datatype', 'Meaning'],
          rows: [
            ['INT', 'Integer numbers'],
            ['VARCHAR(n)', 'Variable length string'],
            ['CHAR(n)', 'Fixed size string'],
            ['FLOAT', 'Decimal values'],
            ['DATE', 'Date values'],
            ['BOOLEAN', 'True or false']
          ]
        },
        code: `name VARCHAR(50)`,
        tip: 'VARCHAR(50) means the name column can store up to 50 characters.'
      },
      {
        q: '8. Types of SQL Commands',
        a: 'SQL commands are grouped by their purpose.',
        table: {
          headers: ['Type', 'Full Form', 'Commands'],
          rows: [
            ['DDL', 'Data Definition Language', 'CREATE, ALTER, DROP'],
            ['DML', 'Data Manipulation Language', 'INSERT, UPDATE, DELETE'],
            ['DQL', 'Data Query Language', 'SELECT'],
            ['DCL', 'Data Control Language', 'GRANT, REVOKE'],
            ['TCL', 'Transaction Control Language', 'COMMIT, ROLLBACK']
          ]
        }
      }
    ]
  },
  {
    title: 'Step 3: Insert and Read Data',
    accent: 'yellow',
    items: [
      {
        q: '9. Insert Data',
        a: 'INSERT INTO adds new rows into a table.',
        code: `INSERT INTO table_name
(column1, column2)
VALUES
(value1, value2);

INSERT INTO student
(rollno, name, marks)
VALUES
(101, 'Ashish', 90),
(102, 'Rahul', 85);`
      },
      {
        q: '10. SELECT Query',
        a: 'SELECT is used to fetch data from a table.',
        code: `-- Select all columns
SELECT * FROM student;

-- Select specific columns
SELECT name, marks FROM student;`
      },
      {
        q: '11. WHERE Clause',
        a: 'WHERE applies a condition and returns only matching rows.',
        code: `SELECT * FROM table_name
WHERE condition;

SELECT * FROM student
WHERE marks > 80;`
      }
    ]
  },
  {
    title: 'Step 4: Conditions and Operators',
    accent: 'yellow',
    items: [
      {
        q: '12. Comparison Operators',
        a: 'Comparison operators compare column values with a given value.',
        table: {
          headers: ['Operator', 'Meaning'],
          rows: [
            ['=', 'Equal'],
            ['!=', 'Not equal'],
            ['>', 'Greater than'],
            ['<', 'Smaller than'],
            ['>=', 'Greater than or equal'],
            ['<=', 'Smaller than or equal']
          ]
        },
        code: `SELECT * FROM student
WHERE marks >= 90;`
      },
      {
        q: '13. Logical Operators',
        a: 'Logical operators combine or reverse conditions.',
        code: `-- AND: both conditions must be true
SELECT * FROM student
WHERE marks > 80 AND city = 'Delhi';

-- OR: any one condition can be true
SELECT * FROM student
WHERE city = 'Delhi' OR city = 'Mumbai';

-- NOT: reverses the condition
SELECT * FROM student
WHERE NOT city = 'Delhi';`
      },
      {
        q: '14. BETWEEN Operator',
        a: 'BETWEEN checks if a value lies inside a range.',
        code: `SELECT * FROM student
WHERE marks BETWEEN 80 AND 90;`
      },
      {
        q: '15. IN Operator',
        a: 'IN checks whether a value exists inside a list.',
        code: `SELECT * FROM student
WHERE city IN ('Delhi', 'Mumbai');`
      }
    ]
  },
  {
    title: 'Step 5: Filtering, Sorting, and Calculations',
    accent: 'yellow',
    items: [
      {
        q: '16. LIMIT Clause',
        a: 'LIMIT controls how many rows are returned.',
        code: `SELECT * FROM student
LIMIT 3;`,
        tip: 'This shows only the first 3 rows.'
      },
      {
        q: '17. ORDER BY Clause',
        a: 'ORDER BY sorts the result in ascending or descending order.',
        code: `-- Ascending
SELECT * FROM student
ORDER BY marks ASC;

-- Descending
SELECT * FROM student
ORDER BY marks DESC;`
      },
      {
        q: '18. Aggregate Functions',
        a: 'Aggregate functions perform calculations on rows.',
        table: {
          headers: ['Function', 'Work'],
          rows: [
            ['COUNT()', 'Count rows'],
            ['MAX()', 'Maximum value'],
            ['MIN()', 'Minimum value'],
            ['SUM()', 'Total value'],
            ['AVG()', 'Average value']
          ]
        },
        code: `-- Average marks
SELECT AVG(marks)
FROM student;

-- Maximum marks
SELECT MAX(marks)
FROM student;`
      },
      {
        q: '19. GROUP BY',
        a: 'GROUP BY groups same data together, then aggregate functions can calculate group-wise results.',
        code: `-- Count students city-wise
SELECT city, COUNT(*)
FROM student
GROUP BY city;`
      },
      {
        q: '20. HAVING Clause',
        a: 'HAVING applies a condition after GROUP BY. It filters grouped results.',
        code: `SELECT city, MAX(marks)
FROM student
GROUP BY city
HAVING MAX(marks) > 90;`
      }
    ]
  },
  {
    title: 'Step 6: Modify and Delete Data',
    accent: 'yellow',
    items: [
      {
        q: '21. UPDATE Query',
        a: 'UPDATE modifies existing rows in a table.',
        code: `UPDATE table_name
SET column = value
WHERE condition;

UPDATE student
SET marks = 95
WHERE rollno = 101;`,
        tip: 'Always use WHERE with UPDATE unless you really want to update every row.'
      },
      {
        q: '22. DELETE Query',
        a: 'DELETE removes selected rows from a table.',
        code: `DELETE FROM student
WHERE rollno = 101;`,
        tip: 'Without WHERE, DELETE can remove all rows from the table.'
      },
      {
        q: '26. TRUNCATE',
        a: 'TRUNCATE deletes all table data, but the table structure remains.',
        code: `TRUNCATE TABLE student;`
      }
    ]
  },
  {
    title: 'Step 7: Keys, Constraints, and ALTER TABLE',
    accent: 'yellow',
    items: [
      {
        q: '23. Keys in SQL',
        a: 'Keys identify rows and connect tables.',
        table: {
          headers: ['Key', 'Meaning', 'Example'],
          rows: [
            ['Primary Key', 'Unique, cannot be NULL, identifies each row', 'rollno INT PRIMARY KEY'],
            ['Foreign Key', 'Connects one table to another table', 'FOREIGN KEY (dept_id) REFERENCES department(id)']
          ]
        }
      },
      {
        q: '24. Constraints',
        a: 'Constraints are rules applied to columns.',
        table: {
          headers: ['Constraint', 'Meaning'],
          rows: [
            ['NOT NULL', 'Cannot be empty'],
            ['UNIQUE', 'No duplicate values'],
            ['PRIMARY KEY', 'Unique plus not null'],
            ['FOREIGN KEY', 'Connects tables'],
            ['DEFAULT', 'Sets default value'],
            ['CHECK', 'Applies a condition']
          ]
        },
        code: `age INT CHECK(age >= 18)`
      },
      {
        q: '25. ALTER TABLE',
        a: 'ALTER TABLE changes the structure of an existing table.',
        code: `-- Add column
ALTER TABLE student
ADD age INT;

-- Drop column
ALTER TABLE student
DROP COLUMN age;

-- Rename table
ALTER TABLE student
RENAME TO students;

-- Modify column
ALTER TABLE student
MODIFY age VARCHAR(3);`
      }
    ]
  },
  {
    title: 'Step 8: Joins and Set Operations',
    accent: 'yellow',
    items: [
      {
        q: '27. What are Joins in SQL?',
        a: 'Joins combine rows from two or more tables using a related column.',
        tip: 'Example relation: student.id can match course.id.'
      },
      {
        q: '28. INNER JOIN',
        a: 'INNER JOIN returns only matching records from both tables.',
        code: `SELECT *
FROM student
INNER JOIN course
ON student.id = course.id;`
      },
      {
        q: '29. LEFT JOIN',
        a: 'LEFT JOIN returns all rows from the left table and matching rows from the right table.',
        code: `SELECT *
FROM student
LEFT JOIN course
ON student.id = course.id;`
      },
      {
        q: '30. RIGHT JOIN',
        a: 'RIGHT JOIN returns all rows from the right table and matching rows from the left table.',
        code: `SELECT *
FROM student
RIGHT JOIN course
ON student.id = course.id;`
      },
      {
        q: '31. FULL JOIN',
        a: 'FULL JOIN returns all rows from both tables. MySQL commonly simulates it using LEFT JOIN, UNION, and RIGHT JOIN.',
        code: `SELECT *
FROM student
LEFT JOIN course
ON student.id = course.id
UNION
SELECT *
FROM student
RIGHT JOIN course
ON student.id = course.id;`
      },
      {
        q: '32. SELF JOIN',
        a: 'SELF JOIN joins a table with itself. It is useful for hierarchy data like employee and manager.',
        code: `SELECT a.name, b.name
FROM employee a
JOIN employee b
ON a.manager_id = b.id;`
      },
      {
        q: '33. UNION',
        a: 'UNION combines the results of multiple SELECT statements.',
        bullets: ['Both SELECT queries must return the same number of columns', 'Column datatypes should be similar'],
        code: `SELECT name FROM student
UNION
SELECT name FROM teacher;`
      }
    ]
  },
  {
    title: 'Step 9: Advanced SQL',
    accent: 'yellow',
    items: [
      {
        q: '34. Sub Queries',
        a: 'A sub query is a query written inside another query.',
        code: `SELECT column_name
FROM table_name
WHERE column_name > (
    SELECT AVG(column_name)
    FROM table_name
);

-- Students scoring above average
SELECT name
FROM student
WHERE marks > (
    SELECT AVG(marks)
    FROM student
);`
      },
      {
        q: '35. SQL Views',
        a: 'A View is a virtual table created from a SELECT query.',
        code: `CREATE VIEW top_students AS
SELECT name, marks
FROM student
WHERE marks > 90;

SELECT * FROM top_students;`,
        tip: 'Views help you save commonly used SELECT queries.'
      }
    ]
  },
  {
    title: 'Step 10: Interview Questions',
    accent: 'yellow',
    items: [
      {
        q: '36. Difference between DELETE, DROP, and TRUNCATE',
        a: 'These commands remove data at different levels.',
        table: {
          headers: ['Command', 'Deletes Data', 'Deletes Table'],
          rows: [
            ['DELETE', 'Yes, selected rows', 'No'],
            ['TRUNCATE', 'Yes, all rows', 'No'],
            ['DROP', 'Yes', 'Yes']
          ]
        }
      },
      {
        q: 'Difference between WHERE and HAVING',
        a: 'WHERE filters normal rows before grouping. HAVING filters grouped rows after GROUP BY.',
        table: {
          headers: ['WHERE', 'HAVING'],
          rows: [
            ['Before grouping', 'After grouping'],
            ['Works on normal rows', 'Works on grouped rows']
          ]
        }
      },
      {
        q: 'Difference between Primary Key and Foreign Key',
        a: 'Primary Key identifies a row. Foreign Key connects tables.',
        table: {
          headers: ['Primary Key', 'Foreign Key'],
          rows: [
            ['Unique', 'Can repeat'],
            ['Cannot be NULL', 'Can be NULL'],
            ['Identifies a row', 'Connects tables']
          ]
        }
      }
    ]
  },
  {
    title: 'Step 11: Full Practice',
    accent: 'yellow',
    items: [
      {
        q: '37. Full Practice Table',
        a: 'Run this complete setup first, then practice queries on the student table.',
        code: `CREATE DATABASE college;

USE college;

CREATE TABLE student (
    rollno INT PRIMARY KEY,
    name VARCHAR(50),
    marks INT,
    grade VARCHAR(2),
    city VARCHAR(20)
);

INSERT INTO student
(rollno, name, marks, grade, city)
VALUES
(101, 'Ashish', 90, 'A', 'Indore'),
(102, 'Rahul', 85, 'B', 'Delhi'),
(103, 'Riya', 95, 'A', 'Mumbai'),
(104, 'Aman', 70, 'C', 'Pune');`
      },
      {
        q: '38. Practice Queries',
        a: 'These are the most useful starter queries for practice.',
        code: `-- Students with marks greater than 80
SELECT * FROM student
WHERE marks > 80;

-- Students from Delhi
SELECT * FROM student
WHERE city = 'Delhi';

-- Highest marks
SELECT MAX(marks)
FROM student;

-- Sort by marks descending
SELECT * FROM student
ORDER BY marks DESC;

-- Count students city-wise
SELECT city, COUNT(*)
FROM student
GROUP BY city;`
      }
    ]
  }
];

const accentStyles = {
  yellow: {
    text: 'text-yellow-400',
    border: 'border-yellow-400/25',
    bg: 'bg-yellow-400/[0.07]',
    soft: 'bg-yellow-400/10 text-yellow-300 border-yellow-400/20'
  }
};

const totalNotes = sqlSections.reduce((sum, section) => sum + section.items.length, 0);

const getSearchText = (item) => JSON.stringify(item).toLowerCase();

function DataTable({ table }) {
  return (
    <div className="mt-4 overflow-hidden rounded-xl border border-[#2a2a2a] bg-[#0b0b0b]">
      {table.caption && (
        <div className="border-b border-[#222] px-4 py-2 text-sm font-semibold text-gray-300">
          {table.caption}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead className="bg-white/[0.04] text-gray-300">
            <tr>
              {table.headers.map(header => (
                <th key={header} className="px-4 py-3 font-semibold">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#202020]">
            {table.rows.map((row, rowIdx) => (
              <tr key={rowIdx} className="hover:bg-white/[0.03]">
                {row.map((cell, cellIdx) => (
                  <td key={`${rowIdx}-${cellIdx}`} className="px-4 py-3 text-gray-300">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CodeBlock({ code, accent }) {
  const styles = accentStyles[accent] || accentStyles.yellow;

  return (
    <div className={`mt-4 overflow-hidden rounded-xl border ${styles.border} bg-[#050505]`}>
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
        <span className={`text-xs font-bold uppercase tracking-wide ${styles.text}`}>SQL</span>
        <span className="text-[11px] text-gray-600">Example</span>
      </div>
      <pre className="overflow-x-auto p-4 text-sm leading-relaxed text-gray-100">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function AnswerContent({ item, accent }) {
  const styles = accentStyles[accent] || accentStyles.yellow;

  return (
    <div className="px-3 pb-5 pt-1">
      <p className="text-[15px] leading-relaxed text-gray-300">{item.a}</p>

      {item.bullets && (
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {item.bullets.map(point => (
            <li
              key={point}
              className={`rounded-lg border px-3 py-2 text-sm ${styles.soft}`}
            >
              {point}
            </li>
          ))}
        </ul>
      )}

      {item.table && <DataTable table={item.table} />}
      {item.code && <CodeBlock code={item.code} accent={accent} />}

      {item.tip && (
        <div className={`mt-4 rounded-xl border px-4 py-3 text-sm leading-relaxed ${styles.soft}`}>
          <span className="font-bold">Remember: </span>{item.tip}
        </div>
      )}
    </div>
  );
}

function DBMSSheet({ auth, setAuth }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [sqlOpen, setSqlOpen] = useState(true);
  const [openAnswers, setOpenAnswers] = useState({});
  const [collapsedSections, setCollapsedSections] = useState(
    () => sqlSections.reduce((acc, _, i) => ({ ...acc, [i]: i !== 0 }), {})
  );
  const questionRefs = useRef({});

  const [lastRead, setLastRead] = useState(() => {
    try { return JSON.parse(localStorage.getItem('dbms_sql_last_read')) || null; }
    catch { return null; }
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuth({ isAuthenticated: false, user: null, token: null });
    navigate('/login');
  };

  const toggleAnswer = (key, question, sectionTitle) => {
    setOpenAnswers(prev => {
      const isOpening = !prev[key];
      if (isOpening) {
        const data = { key, question, sectionTitle };
        setLastRead(data);
        localStorage.setItem('dbms_sql_last_read', JSON.stringify(data));
      }
      return { ...prev, [key]: !prev[key] };
    });
  };

  const jumpToLastRead = () => {
    if (!lastRead) return;
    const parts = lastRead.key.split('-');
    const sectionIdx = parseInt(parts[1], 10);
    setSqlOpen(true);
    setCollapsedSections(prev => ({ ...prev, [sectionIdx]: false }));
    setOpenAnswers(prev => ({ ...prev, [lastRead.key]: true }));
    setTimeout(() => {
      const el = questionRefs.current[lastRead.key];
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 80);
  };

  const clearLastRead = () => {
    setLastRead(null);
    localStorage.removeItem('dbms_sql_last_read');
  };

  const toggleSection = (sectionIdx) => {
    setCollapsedSections(prev => ({ ...prev, [sectionIdx]: !prev[sectionIdx] }));
  };

  const q = searchQuery.toLowerCase().trim();
  const filteredSections = useMemo(() => (
    sqlSections.map(section => ({
      ...section,
      items: q ? section.items.filter(item => getSearchText(item).includes(q)) : section.items
    })).filter(section => section.items.length > 0)
  ), [q]);

  const revealedCount = Object.values(openAnswers).filter(Boolean).length;
  const totalVisible = filteredSections.reduce((sum, section) => sum + section.items.length, 0);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <header className="sticky top-0 z-50 border-b border-[#1f1f1f] bg-[#0a0a0a]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 sm:px-10 lg:px-16">
          <div className="flex items-center gap-3">
            <Link to="/sheet" className="text-yellow-400 transition-colors hover:text-yellow-300">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div>
              <h1 className="text-2xl font-bold leading-tight">
                <span className="text-yellow-400">DBMS</span> SQL Notes
              </h1>
              <p className="text-xs text-gray-500">{totalNotes} notes - {sqlSections.length} sections - beginner friendly examples</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-gray-400 sm:block">{auth.user?.username}</span>
            <button onClick={handleLogout} className="rounded-lg bg-red-600 px-3 py-1.5 text-sm transition-colors hover:bg-red-700">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-8 px-6 py-8 sm:px-10 lg:px-16">
        <section className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="rounded-2xl border border-yellow-400/20 bg-[#101010] p-6">
            <div className="mb-4 inline-flex rounded-full border border-yellow-400/20 bg-yellow-400/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-yellow-300">
              Module 1: SQL Commands
            </div>
            <h2 className="text-3xl font-bold leading-tight text-white">
              Learn DBMS from database basics to joins, views, and practice queries.
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-gray-400">
              Each topic has simple meaning, colorful quick points, tables, and runnable SQL examples so revision stays easy and practical.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 lg:grid-cols-1">
            {[
              { label: 'Notes', value: totalNotes, color: 'text-yellow-400' },
              { label: 'Opened', value: revealedCount, color: 'text-sky-400' },
              { label: 'Sections', value: sqlSections.length, color: 'text-amber-400' }
            ].map(stat => (
              <div key={stat.label} className="rounded-xl border border-[#1f1f1f] bg-[#111] p-4 text-center">
                <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="mt-1 text-xs text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        <div className="relative">
          <svg className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search SQL command, keyword, or example..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-[#2a2a2a] bg-[#141414] px-5 py-4 pl-12 pr-11 text-base text-white placeholder-gray-600 transition-colors focus:border-yellow-400/70 focus:outline-none"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-lg leading-none text-gray-500 transition-colors hover:text-gray-300">
              x
            </button>
          )}
        </div>

        {lastRead && (
          <div className="flex items-center justify-between gap-3 rounded-xl border border-yellow-400/30 bg-yellow-400/[0.08] px-4 py-3">
            <div className="min-w-0">
              <p className="mb-0.5 text-xs text-gray-500">Last read - {lastRead.sectionTitle}</p>
              <p className="truncate text-sm font-medium text-white">{lastRead.question}</p>
            </div>
            <div className="flex flex-shrink-0 items-center gap-2">
              <button onClick={jumpToLastRead} className="rounded-lg bg-yellow-400 px-3 py-1.5 text-xs font-bold text-black transition-colors hover:bg-yellow-300">
                Resume
              </button>
              <button onClick={clearLastRead} className="text-sm text-gray-600 transition-colors hover:text-gray-400">
                x
              </button>
            </div>
          </div>
        )}

        {q && filteredSections.length === 0 && (
          <div className="py-16 text-center text-gray-600">
            <p className="text-sm">No DBMS note matches <span className="text-gray-400">"{searchQuery}"</span></p>
            <button onClick={() => setSearchQuery('')} className="mt-3 text-xs text-yellow-400 hover:underline">Clear search</button>
          </div>
        )}

        <section className="overflow-hidden rounded-2xl border border-[#2a2a2a]">
          <button
            onClick={() => setSqlOpen(prev => !prev)}
            className="group flex w-full items-center justify-between bg-[#111] px-6 py-5 transition-colors hover:bg-[#161616]"
          >
            <div className="flex items-center gap-4 text-left">
              <span className="grid h-11 w-11 place-items-center rounded-xl border border-yellow-400/25 bg-yellow-400/10 text-lg font-black text-yellow-300">
                SQL
              </span>
              <div>
                <p className="text-xl font-bold text-yellow-400">SQL Commands and DBMS Notes</p>
                <p className="mt-0.5 text-xs text-gray-500">{sqlSections.length} sections - {totalNotes} notes</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-full border border-[#2a2a2a] bg-[#1a1a1a] px-3 py-1 text-xs text-gray-500">{totalNotes} topics</span>
              <svg className={`h-5 w-5 text-yellow-400/70 transition-transform duration-300 ${sqlOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>

          {(sqlOpen || q) && (
            <div className="space-y-0 border-t border-[#1f1f1f] bg-[#0d0d0d] px-4 py-4">
              {filteredSections.map(section => {
                const originalIdx = sqlSections.findIndex(s => s.title === section.title);
                const isCollapsed = q ? false : collapsedSections[originalIdx];
                const styles = accentStyles[section.accent] || accentStyles.yellow;

                return (
                  <div key={section.title}>
                    <button
                      onClick={() => toggleSection(originalIdx)}
                      className="group flex w-full items-center justify-between py-4"
                    >
                      <div className="flex items-center gap-3 text-left">
                        <span className={`text-lg font-bold ${styles.text}`}>{section.title}</span>
                        <span className="rounded-full bg-[#1a1a1a] px-2.5 py-0.5 text-sm text-gray-500">{section.items.length} notes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="hidden h-px w-20 bg-[#1f1f1f] sm:block" />
                        <svg className={`h-4 w-4 ${styles.text} opacity-70 transition-transform duration-200 ${isCollapsed ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </button>
                    <div className="mb-2 h-px bg-[#1f1f1f]" />

                    {!isCollapsed && (
                      <div>
                        {section.items.map((item, itemIdx) => {
                          const key = `sql-${originalIdx}-${itemIdx}`;
                          const isOpen = openAnswers[key];
                          const isLastRead = lastRead?.key === key;

                          return (
                            <article
                              key={key}
                              ref={el => questionRefs.current[key] = el}
                              className={`rounded-sm border-b transition-all ${
                                isOpen
                                  ? `${styles.bg} ${styles.border}`
                                  : isLastRead
                                  ? styles.border
                                  : 'border-[#161616]'
                              }`}
                            >
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => toggleAnswer(key, item.q, section.title)}
                                  className="flex flex-1 items-center justify-between rounded px-2 py-5 text-left transition-colors hover:bg-white/[0.03]"
                                >
                                  <div className="flex min-w-0 items-center gap-2">
                                    {isLastRead && <span className={`flex-shrink-0 text-xs ${styles.text}`}>Last</span>}
                                    <span className={`text-[17px] leading-snug ${isLastRead ? styles.text : 'text-gray-200'}`}>{item.q}</span>
                                  </div>
                                  <svg className={`ml-3 h-3.5 w-3.5 flex-shrink-0 text-gray-600 transition-transform duration-200 ${isOpen ? `rotate-180 ${styles.text}` : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                </button>

                                <a
                                  href={`https://chatgpt.com/?q=${encodeURIComponent(`${item.q} in DBMS SQL, explain with simple example`)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title="Ask ChatGPT"
                                  className="mr-1 flex-shrink-0 rounded p-2 text-red-400 transition-all duration-300 hover:scale-125 hover:text-red-300"
                                  onClick={e => e.stopPropagation()}
                                >
                                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.648zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.843-3.371 2.019-1.168a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.4-.679zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.496 4.496 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.603 1.497v2.999l-2.597 1.5-2.603-1.495z" />
                                  </svg>
                                </a>

                                <a
                                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(`${item.q} DBMS SQL explained`)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title="Search on YouTube"
                                  className="mr-1 flex-shrink-0 rounded p-2 text-red-500 transition-all duration-300 hover:scale-125 hover:text-red-400"
                                  onClick={e => e.stopPropagation()}
                                >
                                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                  </svg>
                                </a>
                              </div>

                              {isOpen && <AnswerContent item={item} accent={section.accent} />}
                            </article>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {q && filteredSections.length > 0 && (
          <p className="pt-2 text-center text-xs text-gray-600">{totalVisible} result{totalVisible !== 1 ? 's' : ''} for "{searchQuery}"</p>
        )}
      </main>

      <div className="pb-10" />
      <Footer />
    </div>
  );
}

export default DBMSSheet;
