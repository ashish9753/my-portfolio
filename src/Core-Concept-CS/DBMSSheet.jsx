import { useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../sheet-app/components/Footer';

// ─── ER Symbol Card ──────────────────────────────────────────────────────────
function ERSymCard({ svg, label, sub, color = 'text-teal-300' }) {
  return (
    <div className="flex items-center gap-4 py-3 border-b border-[#1e1e1e] last:border-0">
      <div className="flex-shrink-0 flex items-center justify-center rounded-xl bg-[#0d0d0d] border border-[#2a2a2a]" style={{ width: 110, height: 58 }}>
        {svg}
      </div>
      <div>
        <p className={`text-sm font-bold leading-tight ${color}`}>{label}</p>
        <p className="text-xs text-gray-500 mt-1 leading-snug">{sub}</p>
      </div>
    </div>
  );
}

function ERCardShell({ title, children }) {
  return (
    <div className="my-3 rounded-xl overflow-hidden border border-[#333] shadow-lg">
      <div className="bg-[#252526] px-3 py-1.5 flex items-center justify-between">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        </div>
        <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">{title}</span>
      </div>
      <div className="bg-[#141414] px-4 pb-2">{children}</div>
    </div>
  );
}

function EntitySymbolsChart() {
  const S = '#4ec9b0', F = '#0a2520', T = '#a8d8cb';
  return (
    <ERCardShell title="Entity & Attribute Symbols">
      <ERSymCard color="text-teal-300" label="Entity — Rectangle"
        sub="Any real-world object you want to store data about. Example: Student, Teacher, Course."
        svg={<svg viewBox="0 0 110 58" width={110} height={58}>
          <rect x="10" y="12" width="90" height="34" rx="3" fill={F} stroke={S} strokeWidth="2.5"/>
          <text x="55" y="34" fill={T} fontSize="14" textAnchor="middle" fontFamily="monospace">Student</text>
        </svg>}
      />
      <ERSymCard color="text-teal-300" label="Weak Entity — Double Rectangle"
        sub="Depends on another entity to exist. Has no own primary key. Example: Dependent (of Employee)."
        svg={<svg viewBox="0 0 110 58" width={110} height={58}>
          <rect x="6" y="8" width="98" height="42" rx="3" fill={F} stroke={S} strokeWidth="2.5"/>
          <rect x="11" y="13" width="88" height="32" rx="2" fill="none" stroke={S} strokeWidth="1.5"/>
          <text x="55" y="34" fill={T} fontSize="13" textAnchor="middle" fontFamily="monospace">Dependent</text>
        </svg>}
      />
      <ERSymCard color="text-teal-300" label="Attribute — Oval / Ellipse"
        sub="A property of an entity. Example: Student has Name, Age, City."
        svg={<svg viewBox="0 0 110 58" width={110} height={58}>
          <ellipse cx="55" cy="29" rx="48" ry="22" fill={F} stroke={S} strokeWidth="2.5"/>
          <text x="55" y="34" fill={T} fontSize="13" textAnchor="middle" fontFamily="monospace">Name</text>
        </svg>}
      />
      <ERSymCard color="text-teal-300" label="Key Attribute — Underlined Oval"
        sub="The primary key. Uniquely identifies every row. Example: RollNo for Student."
        svg={<svg viewBox="0 0 110 58" width={110} height={58}>
          <ellipse cx="55" cy="29" rx="48" ry="22" fill={F} stroke={S} strokeWidth="2.5"/>
          <text x="55" y="32" fill={T} fontSize="13" textAnchor="middle" fontFamily="monospace" textDecoration="underline">RollNo</text>
        </svg>}
      />
      <ERSymCard color="text-teal-300" label="Multi-Valued — Double Oval"
        sub="Stores multiple values. Example: PhoneNumbers (a student can have many numbers)."
        svg={<svg viewBox="0 0 110 58" width={110} height={58}>
          <ellipse cx="55" cy="29" rx="48" ry="22" fill={F} stroke={S} strokeWidth="2.5"/>
          <ellipse cx="55" cy="29" rx="36" ry="13" fill="none" stroke={S} strokeWidth="1.5"/>
          <text x="55" y="33" fill={T} fontSize="11" textAnchor="middle" fontFamily="monospace">PhoneNo</text>
        </svg>}
      />
      <ERSymCard color="text-teal-300" label="Derived — Dashed Oval"
        sub="Calculated from another attribute. Example: Age is derived from Date of Birth."
        svg={<svg viewBox="0 0 110 58" width={110} height={58}>
          <ellipse cx="55" cy="29" rx="48" ry="22" fill={F} stroke={S} strokeWidth="2.5" strokeDasharray="6,3"/>
          <text x="55" y="34" fill={T} fontSize="13" textAnchor="middle" fontFamily="monospace">Age</text>
        </svg>}
      />
    </ERCardShell>
  );
}

function RelationSymbolsChart() {
  const S = '#569cd6', F = '#0a1020', T = '#9cdcfe';
  return (
    <ERCardShell title="Relationship & Cardinality Symbols">
      <ERSymCard color="text-sky-300" label="Relationship — Diamond"
        sub="Shows how two entities are connected. Example: Student Enrolls in Course, Teacher Teaches Course."
        svg={<svg viewBox="0 0 110 58" width={110} height={58}>
          <polygon points="55,5 105,29 55,53 5,29" fill={F} stroke={S} strokeWidth="2.5"/>
          <text x="55" y="33" fill={T} fontSize="12" textAnchor="middle" fontFamily="monospace">Enrolls</text>
        </svg>}
      />
      <ERSymCard color="text-sky-300" label="Identifying Relationship — Double Diamond"
        sub="Connects a Weak Entity to its owner. Example: Dependent is identified through Employee."
        svg={<svg viewBox="0 0 110 58" width={110} height={58}>
          <polygon points="55,5 105,29 55,53 5,29" fill={F} stroke={S} strokeWidth="2.5"/>
          <polygon points="55,11 96,29 55,47 14,29" fill="none" stroke={S} strokeWidth="1.5"/>
          <text x="55" y="33" fill={T} fontSize="11" textAnchor="middle" fontFamily="monospace">Has</text>
        </svg>}
      />
      <ERSymCard color="text-sky-300" label="Single Line — Partial Participation"
        sub="Not every entity has to be in this relationship. Example: Not every Employee manages a Department."
        svg={<svg viewBox="0 0 110 58" width={110} height={58}>
          <line x1="8" y1="29" x2="102" y2="29" stroke={S} strokeWidth="3"/>
        </svg>}
      />
      <ERSymCard color="text-sky-300" label="Double Line — Total Participation"
        sub="Every entity MUST be in this relationship. Example: Every Student must enroll in at least one Course."
        svg={<svg viewBox="0 0 110 58" width={110} height={58}>
          <line x1="8" y1="24" x2="102" y2="24" stroke={S} strokeWidth="3"/>
          <line x1="8" y1="34" x2="102" y2="34" stroke={S} strokeWidth="3"/>
        </svg>}
      />
    </ERCardShell>
  );
}

// ─── DBMS Theory Q&A Data ────────────────────────────────────────────────────
const dbmsSections = [
  {
    title: '📘 DBMS Basics',
    questions: [
      {
        q: 'What is DBMS? What are its advantages?',
        a: `DBMS (Database Management System) is software used to store, manage, retrieve, and organize data efficiently.

Examples: MySQL, Oracle, PostgreSQL, MongoDB, SQL Server

Real-Life Example — College Management System:
\`\`\`
Roll No   Name     Branch
101       Ashish   CSE
102       Rahul    IT
\`\`\`
Instead of storing data in files, DBMS stores it in organized databases.

Advantages of DBMS:
• Reduces Data Redundancy – duplicate data is minimized
• Data Consistency – if data changes, it updates everywhere
• Data Security – only authorized users can access data
• Data Sharing – multiple users can access simultaneously (e.g. ATM)
• Backup & Recovery – data can be restored after failure`,
      },
      {
        q: 'DBMS vs File System',
        a: `\`\`\`
Feature            DBMS                  File System
Redundancy         Less (controlled)     High (data repeated)
Security           Access control        Limited
Data Integrity     Enforced (constraints)Not enforced
Concurrent Access  Yes (multi-user)      Limited
Backup & Recovery  Built-in              Manual / difficult
Query Language     SQL                   None
\`\`\`
Key Insight: File system stores data in raw files with no structure enforcement. DBMS adds a management layer with rules, queries, and access control.`,
      },
      {
        q: 'What are the types of Data Models?',
        a: `A Data Model defines how data is organized and related.

A. Hierarchical Model — Tree structure (one parent, many children):
\`\`\`
College
 ├── CSE
 │    └── Student1
 └── IT
      └── Student2
\`\`\`
B. Network Model — Many-to-Many relationships (graph structure).

C. Relational Model — Data in Tables (most widely used):
\`\`\`
ID   Name
 1   Ashish
 2   Rahul
\`\`\`
D. Object-Oriented Model — Data as objects (used in OODBs).`,
      },
    ],
  },
  {
    title: '📘 Architecture & Concepts',
    questions: [
      {
        q: 'Schema vs Instance',
        a: `Schema — the STRUCTURE of the database (the blueprint). Fixed design.
\`\`\`
Student(ID, Name, Branch)   ← schema (structure, no data)
\`\`\`
Instance — the ACTUAL DATA stored at a point in time. Changes frequently.
\`\`\`
ID   Name     Branch
101  Ashish   CSE      ← instance (current snapshot of data)
102  Rahul    IT
\`\`\`
Analogy:
• Schema = blueprint of a house (fixed structure)
• Instance = people living in the house (changes over time)`,
      },
      {
        q: 'Three-Level Architecture & Data Independence',
        a: `Three levels separate how data is stored from how users see it.

1. Physical Level (Internal) — HOW data is physically stored on disk.
   Example: B+ tree files, heap files on hard disk.

2. Logical Level (Conceptual) — WHAT data is stored and relationships.
   Example: Student(ID, Name, Branch) — full database schema.

3. View Level (External) — WHAT a specific user sees.
   Example: Student portal shows only marks, not salary.

Data Independence — change one level without affecting another:
• Physical Independence: move HDD → SSD without changing application
• Logical Independence: add a new column without affecting user views`,
      },
      {
        q: 'What are DBMS Users?',
        a: `• Database Administrator (DBA) — manages the entire database: creates schemas, manages access, backup, performance tuning.

• Application Developer — writes code that uses the database (e.g. backend APIs).

• End User — uses the application without knowing SQL.
  Example: student using a college portal to check marks.

• Naive Users — casual users (e.g. bank teller using a form).
• Sophisticated Users — write their own SQL queries (analysts).`,
      },
    ],
  },
  {
    title: '📘 Keys in DBMS',
    questions: [
      {
        q: 'All Types of Keys in DBMS',
        a: `Given table:
\`\`\`
RollNo   Email              Name     Phone
101      a@mail.com         Ashish   9876543210
102      r@mail.com         Rahul    9123456789
\`\`\`
1. Super Key — any set of attributes that UNIQUELY identifies a row.
   Examples: {RollNo}, {Email}, {RollNo, Name}, {RollNo, Email, Name}

2. Candidate Key — MINIMAL super key (no redundant attribute).
   Examples: {RollNo}, {Email}  ← removing any attribute breaks uniqueness

3. Primary Key — ONE candidate key chosen to identify rows.
   Rule: Unique + NOT NULL.
   Example: RollNo (chosen as primary key)

4. Alternate Key — candidate keys NOT chosen as primary key.
   Example: Email (it can uniquely identify but RollNo was chosen)

5. Unique Key — similar to Primary Key but ALLOWS ONE NULL value. Can have multiple unique keys per table.
   Example: Email column is unique (no duplicates), but one student may not have email (NULL allowed once).
\`\`\`
-- Primary Key: RollNo → Unique + NOT NULL
-- Unique Key:  Email  → Unique + NULL allowed (once)

CREATE TABLE student (
    RollNo INT PRIMARY KEY,
    Email  VARCHAR(100) UNIQUE,   -- Unique Key
    Name   VARCHAR(50)  NOT NULL
);
\`\`\`
Difference:
• Primary Key → Unique + NOT NULL, only ONE per table
• Unique Key  → Unique + ONE NULL allowed, MULTIPLE per table

6. Composite Key — key made of TWO OR MORE columns.
   Example: (StudentID + CourseID) together uniquely identify enrollment.

7. Foreign Key — attribute in one table that REFERENCES primary key of another.
\`\`\`
Student Table        Marks Table
ID   Name            ID   Marks
101  Ashish          101  90    ← ID here is Foreign Key → references Student.ID
\`\`\``,
      },
    ],
  },
  {
    title: '📘 ER Model',
    questions: [
      {
        q: 'What is Entity & Attribute? — Theory + Symbols',
        render: () => (
          <div className="space-y-3 px-1 pb-2">
            <div className="text-[15px] text-yellow-300/80 leading-relaxed space-y-2">
              <p>An <span className="text-yellow-300 font-semibold">Entity</span> is any real-world thing we want to store data about in our database.</p>
              <p>An <span className="text-yellow-300 font-semibold">Attribute</span> is a property or detail of that entity — it describes the entity.</p>
              <div className="bg-[#111] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm space-y-2">
                <p>📦 <span className="text-teal-300 font-semibold">Student</span> is an entity → its attributes: <span className="text-gray-200">RollNo, Name, PhoneNumbers, Age</span></p>
                <p>📦 <span className="text-teal-300 font-semibold">Course</span> is an entity → its attributes: <span className="text-gray-200">CourseID, CourseName, Credits</span></p>
                <p>📦 <span className="text-teal-300 font-semibold">Teacher</span> is an entity → its attributes: <span className="text-gray-200">TeacherID, Name, Salary, Experience</span></p>
              </div>
              <p className="text-sm text-gray-400">Each shape below is a symbol used in ER diagrams to draw these entities and attributes on paper.</p>
            </div>
            <EntitySymbolsChart />
          </div>
        ),
      },
      {
        q: 'What is a Relationship? — Cardinality + Symbols',
        render: () => (
          <div className="space-y-3 px-1 pb-2">
            <div className="text-[15px] text-yellow-300/80 leading-relaxed space-y-2">
              <p>A <span className="text-yellow-300 font-semibold">Relationship</span> shows how two entities are connected to each other.</p>
              <p><span className="text-yellow-300 font-semibold">Cardinality</span> tells us the count — how many of one entity relates to how many of another.</p>
              <div className="bg-[#111] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm space-y-2">
                <p>🔗 <span className="text-sky-300 font-semibold">1:1</span> One-to-One &nbsp;— One person has one Aadhaar card</p>
                <p>🔗 <span className="text-sky-300 font-semibold">1:M</span> One-to-Many &nbsp;— One teacher teaches many students</p>
                <p>🔗 <span className="text-sky-300 font-semibold">M:N</span> Many-to-Many — Many students enroll in many courses</p>
              </div>
              <p className="text-sm text-gray-400">A <span className="text-yellow-300">Diamond</span> shape in ER diagrams represents a relationship. The lines connecting it show participation rules.</p>
            </div>
            <RelationSymbolsChart />
          </div>
        ),
      },
      {
        q: 'ER Diagram Example — Student Enrolls in Course',
        a: `Problem: "Students enroll in courses. Each course is taught by one teacher."

Step 1 — Identify ENTITIES:
  Student,  Course,  Teacher

Step 2 — List ATTRIBUTES for each:
\`\`\`
Student  →  ◉RollNo,  Name,  ══PhoneNo══,  - -Age- -
Course   →  ◉CourseID,  CourseName,  Credits
Teacher  →  ◉TeacherID,  Name,  Salary
\`\`\`
Step 3 — Identify RELATIONSHIPS + Cardinality:
\`\`\`
Student  ═══(M:N)═══ Enrolls  ───── Course
Course   ──────(M:1)─── TaughtBy ── Teacher
\`\`\`
Step 4 — Full ER Diagram:
\`\`\`
  ◉RollNo  ◯Name  ══PhoneNo══  ◯Age(derived)
      |      |         |            |
  ╔══════════════════════╗
  ║       Student        ║ ══════(M)─── Enrolls ───(N)══════ ┌──────────────┐
  ╚══════════════════════╝                                     │    Course    │
                                                              └──────────────┘
                                                               ◉CourseID  ◯Credits
                                                                     |(M)
                                                                 TaughtBy
                                                                     |(1)
                                                              ┌──────────────┐
                                                              │   Teacher    │
                                                              └──────────────┘
                                                              ◉TeacherID  ◯Salary
\`\`\`
Step 5 — Convert to Tables (M:N becomes its own table):
\`\`\`
Student(RollNo, Name, PhoneNo, Age)
Course(CourseID, CourseName, Credits, TeacherID)
Teacher(TeacherID, Name, Salary)
Enrollment(RollNo, CourseID, EnrollDate)   ← new table for M:N
\`\`\`
Key Rule: When cardinality is M:N, always create a SEPARATE table with both keys.`,
      },
    ],
  },
  {
    title: '📘 Normalization',
    questions: [
      {
        q: 'What is Normalization? Problems without it.',
        a: `Normalization is the process of organizing a database to reduce redundancy and improve data integrity.

Goals:
• Eliminate duplicate data
• Prevent anomalies
• Ensure data consistency

Problems WITHOUT Normalization:
• Insertion Anomaly — can't insert data without unrelated data
  (e.g. can't add a new course unless a student enrolls)
• Update Anomaly — changing one piece of data requires multiple row updates
  (e.g. department name stored in every student row)
• Deletion Anomaly — deleting a row accidentally removes other useful data
  (e.g. deleting the last student in a dept removes the dept info)

Normal Forms: 1NF → 2NF → 3NF → BCNF (each builds on the previous)`,
      },
      {
        q: '1NF – First Normal Form',
        a: `Rule: Each column must have ATOMIC (indivisible) values. No repeating groups.

❌ Violates 1NF — multiple values in one cell:
\`\`\`
ID   Name     Courses
101  Ashish   Math, Physics, Chemistry
\`\`\`
✅ After 1NF — one value per cell:
\`\`\`
ID   Name     Course
101  Ashish   Math
101  Ashish   Physics
101  Ashish   Chemistry
\`\`\`
Each cell has a single, atomic value. No repeating groups allowed.`,
      },
      {
        q: '2NF – Second Normal Form',
        a: `Rules: Must be in 1NF + Remove Partial Dependency.
Partial Dependency: a non-key attribute depends on PART of a composite key.

❌ Violates 2NF — StudentName depends only on StudentID (not full key):
\`\`\`
StudentID   CourseID   StudentName   Grade
101         C01        Ashish        A       ← StudentName depends only on StudentID
101         C02        Ashish        B         (partial dependency!)
\`\`\`
✅ After 2NF — split into two tables:
\`\`\`
Student(StudentID, StudentName)    Enrollment(StudentID, CourseID, Grade)
101  Ashish                        101  C01  A
102  Rahul                         101  C02  B
\`\`\`
Now every non-key attribute depends on the FULL primary key.`,
      },
      {
        q: '3NF & BCNF',
        a: `3NF — Must be in 2NF + Remove Transitive Dependency.
Transitive Dependency: non-key A → non-key B → non-key C (A → C is transitive).

❌ Violates 3NF — DeptName depends on DeptID, which depends on StudentID:
\`\`\`
StudentID   DeptID   DeptName
101         D01      CSE        ← DeptName depends on DeptID, not StudentID (transitive!)
102         D02      IT
\`\`\`
✅ After 3NF — remove transitive dependency:
\`\`\`
Student(StudentID, DeptID)    Department(DeptID, DeptName)
101  D01                      D01  CSE
102  D02                      D02  IT
\`\`\`
─────────────────────────────────────────────────────────
BCNF (Boyce-Codd Normal Form) — Stricter version of 3NF.
Rule: For every functional dependency X → Y, X must be a CANDIDATE KEY.

BCNF handles edge cases that 3NF misses when there are multiple overlapping candidate keys.
If table is in 3NF, it is usually also in BCNF (unless there are overlapping candidate keys).`,
      },
    ],
  },
  {
    title: '📘 Transaction & ACID',
    questions: [
      {
        q: 'What is a Transaction?',
        a: `A Transaction is a set of operations executed as a SINGLE UNIT — either all succeed or all fail.

Example — Bank Transfer (A sends ₹1000 to B):
\`\`\`
BEGIN TRANSACTION;
  A = A - 1000;   -- debit A
  B = B + 1000;   -- credit B
COMMIT;           -- save changes
\`\`\`
If system crashes after debiting A but before crediting B → ROLLBACK undoes everything.

States of a Transaction:
Active → Partially Committed → Committed (success)
Active → Failed → Aborted (rolled back)`,
      },
      {
        q: 'ACID Properties',
        a: `ACID ensures reliable database transactions.

A — Atomicity: ALL or NOTHING.
   If any step fails, entire transaction is rolled back.
   Example: Money deducted from A but not added to B → rollback both.

C — Consistency: Database moves from one VALID state to another.
   Example: Total money before and after transfer must remain the same.

I — Isolation: Concurrent transactions don't interfere with each other.
   Example: Two users booking the last seat — only one succeeds.

D — Durability: Once committed, data is PERMANENT even after system crash.
   Achieved via: write-ahead logging (WAL), checkpoints.`,
      },
    ],
  },
  {
    title: '📘 Concurrency Control',
    questions: [
      {
        q: 'Locking & Two-Phase Locking (2PL)',
        a: `Locking controls access to data during concurrent transactions.

Shared Lock (S-Lock) — Read-only. Multiple transactions can hold S-Lock simultaneously.
Exclusive Lock (X-Lock) — Read + Write. Only ONE transaction can hold it. No other lock allowed.
\`\`\`
Operation    S-Lock Held   X-Lock Held
Request S    ✓ Allowed     ✗ Wait
Request X    ✗ Wait        ✗ Wait
\`\`\`
Two-Phase Locking (2PL) — guarantees serializability:
• Growing Phase — acquire locks, release NONE
• Shrinking Phase — release locks, acquire NONE

Once a transaction releases even one lock, it cannot acquire new locks.

Schedule Types:
• Serial Schedule — T1 fully runs, then T2 (no overlap)
• Concurrent Schedule — T1 and T2 operations interleaved
• Conflict Serializable — concurrent schedule equivalent to some serial schedule`,
      },
      {
        q: 'Deadlock in DBMS',
        a: `Deadlock: two transactions wait FOREVER for each other's locked resources.

Example:
\`\`\`
T1 holds Resource A, waiting for Resource B
T2 holds Resource B, waiting for Resource A
→ Neither can proceed. DEADLOCK!
\`\`\`
Four Conditions (ALL must hold):
• Mutual Exclusion – resource used by only one transaction at a time
• Hold and Wait – transaction holds resources while waiting for more
• No Preemption – resources can't be forcibly taken
• Circular Wait – T1 waits for T2, T2 waits for T1

Solutions:
• Prevention – break one of the 4 conditions (e.g. request all resources at once)
• Avoidance – use Wait-Die / Wound-Wait schemes
• Detection & Recovery – detect cycle in wait-for graph → abort one transaction`,
      },
    ],
  },
  {
    title: '📘 Recovery & Storage',
    questions: [
      {
        q: 'Recovery System & Checkpoint',
        a: `Recovery System restores the database to a consistent state after a crash.

Log File — records every transaction operation:
\`\`\`
<T1, Start>
<T1, A, 5000, 4000>   -- (transaction, attribute, old value, new value)
<T1, Commit>
\`\`\`
On crash:
• REDO: re-apply committed transactions (they may not have hit disk)
• UNDO: rollback uncommitted transactions (incomplete work)

Checkpoint — a saved consistent snapshot of the database.
• Reduces recovery time (only redo/undo transactions after last checkpoint)
• Without checkpoints: must scan entire log from the beginning`,
      },
      {
        q: 'Indexing, B+ Tree & Hashing',
        a: `Indexing — technique to speed up data retrieval (like a book's index).
Without index: full table scan (O(n))
With index: direct access (O(log n) or O(1))

B+ Tree Index — most common database index structure:
• All data stored in LEAF nodes (linked list for range queries)
• Internal nodes store only keys for navigation
• Advantages: fast search, insert, delete; great for range queries

Hashing — maps a key directly to a storage location:
\`\`\`
Hash(RollNo = 101) → bucket address 5 → record stored at slot 5
\`\`\`
• Best for EQUALITY queries (WHERE id = 101)
• NOT good for range queries (WHERE id BETWEEN 100 AND 200)

RAID (Redundant Array of Independent Disks):
• RAID 0: striping → performance, no redundancy
• RAID 1: mirroring → redundancy, no extra capacity
• RAID 5: striping + parity → balance of performance & fault tolerance`,
      },
    ],
  },
  {
    title: '📘 Interview Questions',
    questions: [
      {
        q: 'DBMS vs RDBMS',
        a: `\`\`\`
Feature            DBMS                  RDBMS
Data Storage       Any format            Tables (rows & columns)
Relationships      Not mandatory         Primary/Foreign Keys enforce links
Normalization      Not required          Supported
ACID Properties    May not support       Fully supported
Examples           XML DB, File DB       MySQL, PostgreSQL, Oracle
\`\`\`
RDBMS is a type of DBMS that stores data in RELATIONAL tables and enforces relationships between them.`,
      },
      {
        q: 'OLTP vs OLAP & Data Warehouse',
        a: `\`\`\`
Feature      OLTP                       OLAP
Purpose      Day-to-day operations      Analysis & reporting
Queries      Simple, fast               Complex, slow
Data         Current (real-time)        Historical (years of data)
Operations   INSERT, UPDATE, DELETE      Mostly SELECT
Examples     ATM, booking, banking      BI dashboards, reports
\`\`\`
Data Warehouse — large centralized repository for OLAP analysis.
Example: Company stores 10 years of sales data for trend analysis.

ETL Process: Extract (from OLTP) → Transform (clean/format) → Load (into warehouse).`,
      },
      {
        q: 'Most Asked DBMS Interview Questions (Quick List)',
        a: `1.  What is DBMS? → Software to store, manage, retrieve data.
2.  DBMS vs RDBMS? → RDBMS stores data in tables with relationships.
3.  What is normalization? → Process to remove redundancy & anomalies.
4.  1NF, 2NF, 3NF, BCNF? → Progressive rules to structure tables.
5.  Primary Key? → Unique + NOT NULL identifier for each row.
6.  Foreign Key? → Links two tables via primary key reference.
7.  ACID? → Atomicity, Consistency, Isolation, Durability.
8.  What is a transaction? → Set of operations that execute as one unit.
9.  What is deadlock? → Two transactions wait forever for each other.
10. Deadlock conditions? → Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait.
11. What is indexing? → Speed up search using B+ Tree or Hash structure.
12. OLTP vs OLAP? → Operations (fast, current) vs Analysis (complex, historical).
13. What is ER model? → Entity-Relationship diagram for database design.
14. Data independence? → Changing one level doesn't affect others.
15. Concurrency control? → Manage simultaneous transactions without conflict.`,
      },
    ],
  },
];

// ─── SQL Commands Data (existing) ────────────────────────────────────────────
const sqlSections = [
  {
    title: 'Step 1: Database Basics',
    items: [
      {
        q: '1. What is a Database?',
        a: 'A Database is a collection of data stored digitally so it can be accessed, searched, updated, and managed easily.',
        bullets: ['Student records', 'Employee details', 'Bank accounts'],
        tip: 'A software used to manage a database is called a DBMS, such as MySQL, Oracle, or PostgreSQL.',
      },
      {
        q: '2. Types of Database',
        a: 'Databases are commonly divided into relational and non-relational databases.',
        table: {
          headers: ['Type', 'How data is stored', 'Query Style', 'Examples'],
          rows: [
            ['Relational Database', 'Tables with rows and columns', 'SQL', 'MySQL, Oracle, SQL Server'],
            ['Non-Relational Database', 'Documents, key-value, graph', 'NoSQL', 'MongoDB, Redis'],
          ],
        },
      },
      {
        q: '3. What is SQL?',
        a: 'SQL (Structured Query Language) is used to interact with relational databases — Create, Read, Update, Delete.',
        table: {
          headers: ['Type', 'Full Form', 'Commands'],
          rows: [
            ['DDL', 'Data Definition Language', 'CREATE, ALTER, DROP'],
            ['DML', 'Data Manipulation Language', 'INSERT, UPDATE, DELETE'],
            ['DQL', 'Data Query Language', 'SELECT'],
            ['DCL', 'Data Control Language', 'GRANT, REVOKE'],
            ['TCL', 'Transaction Control Language', 'COMMIT, ROLLBACK'],
          ],
        },
      },
    ],
  },
  {
    title: 'Step 2: Create Database & Table',
    items: [
      {
        q: '4. Create, Use, Drop Database',
        a: 'These commands create a database, select it for work, and permanently delete it.',
        code: `CREATE DATABASE college;

USE college;

DROP DATABASE college;`,
        tip: 'DROP DATABASE permanently deletes the database and all its tables.',
      },
      {
        q: '5. Create Table',
        a: 'CREATE TABLE defines the table name, columns, datatypes, and constraints.',
        code: `CREATE TABLE student (
    rollno  INT          PRIMARY KEY,
    name    VARCHAR(50)  NOT NULL,
    marks   INT,
    city    VARCHAR(20)  DEFAULT 'Unknown'
);`,
      },
      {
        q: '6. SQL Datatypes',
        a: 'Datatypes tell SQL what kind of value a column can store.',
        table: {
          headers: ['Datatype', 'Meaning'],
          rows: [
            ['INT', 'Integer numbers'],
            ['VARCHAR(n)', 'Variable length string up to n chars'],
            ['CHAR(n)', 'Fixed size string'],
            ['FLOAT / DECIMAL', 'Decimal values'],
            ['DATE', 'Date values (YYYY-MM-DD)'],
            ['BOOLEAN', 'True or false'],
          ],
        },
      },
    ],
  },
  {
    title: 'Step 3: Insert & Read Data',
    items: [
      {
        q: '7. INSERT Data',
        a: 'INSERT INTO adds new rows into a table.',
        code: `INSERT INTO student (rollno, name, marks, city)
VALUES
    (101, 'Ashish', 90, 'Indore'),
    (102, 'Rahul',  85, 'Delhi'),
    (103, 'Riya',   95, 'Mumbai'),
    (104, 'Aman',   70, 'Pune');`,
      },
      {
        q: '8. SELECT Query',
        a: 'SELECT fetches data from a table.',
        code: `-- All columns
SELECT * FROM student;

-- Specific columns
SELECT name, marks FROM student;

-- With condition
SELECT * FROM student
WHERE marks > 80;`,
      },
      {
        q: '9. WHERE Clause & Operators',
        a: 'WHERE filters rows by condition. Combine with operators for powerful queries.',
        code: `-- Comparison: =  !=  >  <  >=  <=
SELECT * FROM student WHERE marks >= 90;

-- AND: both conditions true
SELECT * FROM student
WHERE marks > 80 AND city = 'Delhi';

-- OR: either condition true
SELECT * FROM student
WHERE city = 'Delhi' OR city = 'Mumbai';

-- BETWEEN: inclusive range
SELECT * FROM student WHERE marks BETWEEN 80 AND 95;

-- IN: match list of values
SELECT * FROM student WHERE city IN ('Delhi', 'Mumbai');

-- LIKE: pattern match  %=any chars  _=one char
SELECT * FROM student WHERE name LIKE 'A%';`,
      },
    ],
  },
  {
    title: 'Step 4: Sort, Filter, Aggregate',
    items: [
      {
        q: '10. ORDER BY & LIMIT',
        a: 'ORDER BY sorts results. LIMIT controls how many rows are returned.',
        code: `-- Sort by marks descending
SELECT * FROM student ORDER BY marks DESC;

-- Sort ascending (default)
SELECT * FROM student ORDER BY name ASC;

-- Top 3 students
SELECT * FROM student
ORDER BY marks DESC
LIMIT 3;`,
      },
      {
        q: '11. Aggregate Functions',
        a: 'Aggregate functions perform calculations across multiple rows.',
        table: {
          headers: ['Function', 'What it does'],
          rows: [
            ['COUNT(*)', 'Total number of rows'],
            ['MAX(col)', 'Maximum value'],
            ['MIN(col)', 'Minimum value'],
            ['SUM(col)', 'Total sum'],
            ['AVG(col)', 'Average value'],
          ],
        },
        code: `SELECT COUNT(*) FROM student;       -- total students
SELECT MAX(marks) FROM student;    -- highest marks
SELECT MIN(marks) FROM student;    -- lowest marks
SELECT AVG(marks) FROM student;    -- average marks
SELECT SUM(marks) FROM student;    -- total marks`,
      },
      {
        q: '12. GROUP BY & HAVING',
        a: 'GROUP BY groups same values. HAVING filters grouped results (like WHERE but for groups).',
        code: `-- Count students per city
SELECT city, COUNT(*)
FROM student
GROUP BY city;

-- Cities where average marks > 85
SELECT city, AVG(marks)
FROM student
GROUP BY city
HAVING AVG(marks) > 85;`,
        tip: 'WHERE filters before grouping. HAVING filters after grouping.',
      },
    ],
  },
  {
    title: 'Step 5: Update, Delete, Alter',
    items: [
      {
        q: '13. UPDATE & DELETE',
        a: 'UPDATE modifies existing rows. DELETE removes selected rows.',
        code: `-- Update marks for one student
UPDATE student
SET marks = 95
WHERE rollno = 101;

-- Update multiple columns
UPDATE student
SET marks = 88, city = 'Pune'
WHERE rollno = 102;

-- Delete one student
DELETE FROM student WHERE rollno = 101;

-- Delete all rows (table stays)
TRUNCATE TABLE student;`,
        tip: 'Always use WHERE with UPDATE and DELETE, or you will affect every row.',
      },
      {
        q: '14. ALTER TABLE',
        a: 'ALTER TABLE changes the structure of an existing table.',
        code: `-- Add a column
ALTER TABLE student ADD age INT;

-- Drop a column
ALTER TABLE student DROP COLUMN age;

-- Rename the table
ALTER TABLE student RENAME TO students;

-- Modify a column type
ALTER TABLE student MODIFY marks FLOAT;`,
      },
    ],
  },
  {
    title: 'Step 6: Keys & Constraints',
    items: [
      {
        q: '15. Constraints in SQL',
        a: 'Constraints enforce rules on column data.',
        table: {
          headers: ['Constraint', 'Meaning'],
          rows: [
            ['NOT NULL', 'Column cannot be empty'],
            ['UNIQUE', 'No duplicate values allowed'],
            ['PRIMARY KEY', 'Unique + NOT NULL — identifies each row'],
            ['FOREIGN KEY', 'Links to primary key of another table'],
            ['DEFAULT', 'Sets a default value if none provided'],
            ['CHECK', 'Validates a condition before insert/update'],
          ],
        },
        code: `CREATE TABLE student (
    rollno  INT          PRIMARY KEY,
    name    VARCHAR(50)  NOT NULL,
    email   VARCHAR(100) UNIQUE,
    age     INT          CHECK(age >= 18),
    city    VARCHAR(20)  DEFAULT 'Unknown'
);`,
      },
      {
        q: '16. Foreign Key',
        a: 'A Foreign Key creates a link between two tables using the primary key of the referenced table.',
        code: `CREATE TABLE department (
    dept_id   INT         PRIMARY KEY,
    dept_name VARCHAR(50)
);

CREATE TABLE student (
    rollno  INT PRIMARY KEY,
    name    VARCHAR(50),
    dept_id INT,
    FOREIGN KEY (dept_id) REFERENCES department(dept_id)
);`,
        tip: 'A student cannot have a dept_id that does not exist in the department table.',
      },
    ],
  },
  {
    title: 'Step 7: Joins',
    items: [
      {
        q: '17. INNER JOIN',
        a: 'Returns only rows that have MATCHING values in BOTH tables.',
        code: `SELECT student.name, department.dept_name
FROM student
INNER JOIN department
ON student.dept_id = department.dept_id;`,
      },
      {
        q: '18. LEFT, RIGHT & FULL JOIN',
        a: 'LEFT JOIN: all from left + matches from right. RIGHT JOIN: opposite. FULL JOIN: all from both.',
        code: `-- LEFT JOIN: all students, even if no department
SELECT s.name, d.dept_name
FROM student s
LEFT JOIN department d ON s.dept_id = d.dept_id;

-- RIGHT JOIN: all departments, even if no students
SELECT s.name, d.dept_name
FROM student s
RIGHT JOIN department d ON s.dept_id = d.dept_id;

-- FULL JOIN (MySQL: simulate with UNION)
SELECT s.name, d.dept_name FROM student s
LEFT JOIN department d ON s.dept_id = d.dept_id
UNION
SELECT s.name, d.dept_name FROM student s
RIGHT JOIN department d ON s.dept_id = d.dept_id;`,
      },
      {
        q: '19. SELF JOIN & UNION',
        a: 'SELF JOIN joins a table with itself. UNION combines results of two SELECT queries.',
        code: `-- SELF JOIN: find employee and their manager
SELECT e.name AS Employee, m.name AS Manager
FROM employee e
JOIN employee m ON e.manager_id = m.id;

-- UNION: combine student and teacher names (no duplicates)
SELECT name FROM student
UNION
SELECT name FROM teacher;

-- UNION ALL: include duplicates
SELECT name FROM student
UNION ALL
SELECT name FROM teacher;`,
      },
    ],
  },
  {
    title: 'Step 8: Advanced SQL',
    items: [
      {
        q: '20. Subqueries',
        a: 'A subquery is a query nested inside another query.',
        code: `-- Students scoring above average
SELECT name
FROM student
WHERE marks > (SELECT AVG(marks) FROM student);

-- Students in same city as Ashish
SELECT name FROM student
WHERE city = (SELECT city FROM student WHERE name = 'Ashish');`,
      },
      {
        q: '21. Views',
        a: 'A View is a virtual table based on a SELECT query. It does not store data itself.',
        code: `-- Create a view of top students
CREATE VIEW top_students AS
SELECT name, marks
FROM student
WHERE marks > 90;

-- Use the view like a table
SELECT * FROM top_students;

-- Drop the view
DROP VIEW top_students;`,
        tip: 'Views help simplify complex queries and restrict access to sensitive columns.',
      },
    ],
  },
  {
    title: 'Step 9: Practice & Interview',
    items: [
      {
        q: '22. Full Practice Setup',
        a: 'Run this complete setup, then practice queries on the student table.',
        code: `CREATE DATABASE college;
USE college;

CREATE TABLE student (
    rollno INT PRIMARY KEY,
    name   VARCHAR(50),
    marks  INT,
    grade  VARCHAR(2),
    city   VARCHAR(20)
);

INSERT INTO student (rollno, name, marks, grade, city)
VALUES
    (101, 'Ashish', 90, 'A', 'Indore'),
    (102, 'Rahul',  85, 'B', 'Delhi'),
    (103, 'Riya',   95, 'A', 'Mumbai'),
    (104, 'Aman',   70, 'C', 'Pune');`,
      },
      {
        q: '23. DELETE vs TRUNCATE vs DROP',
        a: 'Three different ways to remove data at different levels.',
        table: {
          headers: ['Command', 'Removes', 'Table Structure', 'Rollback?', 'Type'],
          rows: [
            ['DELETE', 'Selected rows (WHERE)', 'Stays', 'Yes (DML)', 'DML'],
            ['TRUNCATE', 'All rows', 'Stays', 'No (DDL)', 'DDL'],
            ['DROP', 'All data + table', 'Gone', 'No (DDL)', 'DDL'],
          ],
        },
      },
      {
        q: '24. WHERE vs HAVING',
        a: 'WHERE filters individual rows. HAVING filters grouped results after GROUP BY.',
        code: `-- WHERE: filter before grouping
SELECT * FROM student WHERE marks > 80;

-- HAVING: filter after grouping
SELECT city, AVG(marks)
FROM student
GROUP BY city
HAVING AVG(marks) > 85;`,
        table: {
          headers: ['WHERE', 'HAVING'],
          rows: [
            ['Used before GROUP BY', 'Used after GROUP BY'],
            ['Filters individual rows', 'Filters grouped rows'],
            ['Cannot use aggregate functions', 'Can use aggregate functions'],
          ],
        },
      },
    ],
  },
];

// ─── SQL Syntax Highlighter ───────────────────────────────────────────────────
const SQL_KW = new Set([
  'SELECT','FROM','WHERE','INSERT','INTO','VALUES','UPDATE','SET','DELETE',
  'CREATE','DROP','ALTER','TABLE','DATABASE','USE','ADD','COLUMN','RENAME','TO',
  'JOIN','INNER','LEFT','RIGHT','FULL','OUTER','SELF','CROSS','ON',
  'GROUP','BY','ORDER','HAVING','LIMIT','UNION','ALL','DISTINCT','AS',
  'AND','OR','NOT','IN','BETWEEN','LIKE','IS','NULL',
  'PRIMARY','KEY','FOREIGN','REFERENCES','DEFAULT','CHECK','UNIQUE','CASCADE',
  'COMMIT','ROLLBACK','TRUNCATE','SAVEPOINT','GRANT','REVOKE',
  'VIEW','INDEX','IF','EXISTS','CONSTRAINT','WITH','ASC','DESC',
  'BEGIN','TRANSACTION','AUTO_INCREMENT','SHOW','DESCRIBE',
]);
const SQL_FUNC = new Set(['COUNT','MAX','MIN','AVG','SUM','NOW','COALESCE','UPPER','LOWER','LENGTH','CONCAT','SUBSTR']);
const SQL_TYPE = new Set(['INT','INTEGER','VARCHAR','CHAR','FLOAT','DECIMAL','DATE','DATETIME','TIMESTAMP','BOOLEAN','BOOL','TEXT','BIGINT','SMALLINT']);

function highlightSQLLine(line) {
  const commentIdx = line.indexOf('--');
  const main = commentIdx >= 0 ? line.slice(0, commentIdx) : line;
  const comment = commentIdx >= 0 ? line.slice(commentIdx) : null;
  const tokens = [];
  let i = 0;
  while (i < main.length) {
    if (main[i] === "'") {
      let j = i + 1;
      while (j < main.length && main[j] !== "'") j++;
      tokens.push(<span key={i} style={{ color: '#ce9178' }}>{main.slice(i, j + 1)}</span>);
      i = j + 1; continue;
    }
    if (/[a-zA-Z_]/.test(main[i])) {
      let j = i;
      while (j < main.length && /\w/.test(main[j])) j++;
      const word = main.slice(i, j);
      const up = word.toUpperCase();
      let color = '#d4d4d4';
      if (SQL_KW.has(up)) color = '#569cd6';
      else if (SQL_FUNC.has(up)) color = '#dcdcaa';
      else if (SQL_TYPE.has(up)) color = '#4ec9b0';
      tokens.push(<span key={i} style={{ color }}>{word}</span>);
      i = j; continue;
    }
    if (/[0-9]/.test(main[i])) {
      let j = i;
      while (j < main.length && /[0-9.]/.test(main[j])) j++;
      tokens.push(<span key={i} style={{ color: '#b5cea8' }}>{main.slice(i, j)}</span>);
      i = j; continue;
    }
    tokens.push(<span key={i} style={{ color: '#d4d4d4' }}>{main[i]}</span>);
    i++;
  }
  if (comment) tokens.push(<span key="cmt" style={{ color: '#6a9955' }}>{comment}</span>);
  return tokens;
}

function CodeBlock({ code }) {
  return (
    <div className="my-3 rounded-lg overflow-hidden border border-[#333] shadow-lg">
      <div className="bg-[#252526] px-3 py-1.5 flex items-center justify-between">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        </div>
        <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">SQL</span>
      </div>
      <pre className="bg-[#1e1e1e] px-5 py-3 overflow-x-auto font-mono text-[13px] leading-6 m-0 whitespace-pre">
        {code.split('\n').map((line, li) => <div key={li}>{highlightSQLLine(line)}</div>)}
      </pre>
    </div>
  );
}

function DataTable({ table }) {
  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-[#2a2a2a] bg-[#0b0b0b]">
      {table.caption && (
        <div className="border-b border-[#222] px-4 py-2 text-sm font-semibold text-gray-300">{table.caption}</div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px] text-left text-sm">
          <thead className="bg-white/[0.04] text-gray-300">
            <tr>{table.headers.map(h => <th key={h} className="px-4 py-3 font-semibold">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-[#202020]">
            {table.rows.map((row, ri) => (
              <tr key={ri} className="hover:bg-white/[0.03]">
                {row.map((cell, ci) => <td key={ci} className="px-4 py-3 text-gray-300">{cell}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AnswerContent({ item }) {
  return (
    <div className="px-3 pb-5 pt-1 space-y-2">
      <p className="text-[15px] leading-relaxed text-yellow-300/80">{item.a}</p>
      {item.bullets && (
        <ul className="grid gap-2 sm:grid-cols-2 mt-2">
          {item.bullets.map(point => (
            <li key={point} className="rounded-lg border border-yellow-400/20 bg-yellow-400/10 px-3 py-2 text-sm text-yellow-300">
              {point}
            </li>
          ))}
        </ul>
      )}
      {item.table && <DataTable table={item.table} />}
      {item.code && <CodeBlock code={item.code} />}
      {item.tip && (
        <div className="rounded-xl border border-yellow-400/20 bg-yellow-400/10 px-4 py-3 text-sm text-yellow-300 leading-relaxed mt-2">
          <span className="font-bold">Remember: </span>{item.tip}
        </div>
      )}
    </div>
  );
}

// ─── DBMS Theory renderer (backtick-delimited blocks) ─────────────────────────
function renderDBMSAnswer(text) {
  const lines = text.split('\n');
  const segments = [];
  let i = 0;
  while (i < lines.length) {
    if (lines[i].trim() === '```') {
      i++;
      const blockLines = [];
      while (i < lines.length && lines[i].trim() !== '```') { blockLines.push(lines[i]); i++; }
      i++;
      if (blockLines.length) segments.push({ type: 'block', lines: blockLines });
    } else {
      const textLines = [];
      while (i < lines.length && lines[i].trim() !== '```') { textLines.push(lines[i]); i++; }
      const content = textLines.join('\n').trim();
      if (content) segments.push({ type: 'text', content });
    }
  }
  return segments.map((seg, idx) => {
    if (seg.type === 'block') {
      const isSQL = seg.lines.some(l => /\b(SELECT|INSERT|CREATE|UPDATE|DELETE|FROM|WHERE|TABLE|DATABASE)\b/i.test(l));
      return (
        <div key={idx} className="my-3 rounded-lg overflow-hidden border border-[#333] shadow-lg">
          <div className="bg-[#252526] px-3 py-1.5 flex items-center justify-between">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
            </div>
            <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">{isSQL ? 'SQL' : 'Example'}</span>
          </div>
          <pre className="bg-[#1e1e1e] px-5 py-3 overflow-x-auto font-mono text-[13px] leading-6 m-0 whitespace-pre">
            {seg.lines.map((line, li) => (
              <div key={li}>{isSQL ? highlightSQLLine(line) : <span style={{ color: '#d4d4d4' }}>{line}</span>}</div>
            ))}
          </pre>
        </div>
      );
    }
    return (
      <div key={idx} className="text-[15px] text-yellow-300/80 leading-relaxed whitespace-pre-line">
        {seg.content}
      </div>
    );
  });
}
// ─────────────────────────────────────────────────────────────────────────────

const totalDbmsQ = dbmsSections.reduce((s, sec) => s + sec.questions.length, 0);
const totalSqlNotes = sqlSections.reduce((s, sec) => s + sec.items.length, 0);
const totalNotes = totalDbmsQ + totalSqlNotes;

function DBMSSheet({ auth, setAuth }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Both panels closed by default
  const [dbmsOpen, setDbmsOpen] = useState(false);
  const [sqlOpen, setSqlOpen] = useState(false);

  const [openAnswers, setOpenAnswers] = useState({});
  const [collapsedDbms, setCollapsedDbms] = useState(
    () => dbmsSections.reduce((acc, _, i) => ({ ...acc, [i]: true }), {})
  );
  const [collapsedSql, setCollapsedSql] = useState(
    () => sqlSections.reduce((acc, _, i) => ({ ...acc, [i]: true }), {})
  );
  const questionRefs = useRef({});

  const [lastRead, setLastRead] = useState(() => {
    try { return JSON.parse(localStorage.getItem('dbms_sql_last_read')) || null; }
    catch { return null; }
  });

  const revealedCount = Object.values(openAnswers).filter(Boolean).length;

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
    const [, panel, sIdx] = lastRead.key.split('-');
    const sectionIdx = parseInt(sIdx, 10);
    if (panel === 'dbms') {
      setDbmsOpen(true);
      setCollapsedDbms(prev => ({ ...prev, [sectionIdx]: false }));
    } else {
      setSqlOpen(true);
      setCollapsedSql(prev => ({ ...prev, [sectionIdx]: false }));
    }
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

  const q = searchQuery.toLowerCase().trim();

  const filteredDbms = useMemo(() => dbmsSections.map(sec => ({
    ...sec,
    questions: q ? sec.questions.filter(item =>
      item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q)
    ) : sec.questions,
  })).filter(sec => sec.questions.length > 0), [q]);

  const filteredSql = useMemo(() => sqlSections.map(sec => ({
    ...sec,
    items: q ? sec.items.filter(item =>
      JSON.stringify(item).toLowerCase().includes(q)
    ) : sec.items,
  })).filter(sec => sec.items.length > 0), [q]);

  const totalVisible = filteredDbms.reduce((s, sec) => s + sec.questions.length, 0)
    + filteredSql.reduce((s, sec) => s + sec.items.length, 0);

  const noResults = q && filteredDbms.length === 0 && filteredSql.length === 0;

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
                <span className="text-yellow-400">DBMS</span> – Theory & SQL Notes
              </h1>
              <p className="text-xs text-gray-500">{totalDbmsQ} theory Q&A · {totalSqlNotes} SQL notes · {dbmsSections.length + sqlSections.length} sections</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-gray-400 sm:block">{auth.user?.username}</span>
            <button onClick={handleLogout} className="rounded-lg bg-red-600 px-3 py-1.5 text-sm transition-colors hover:bg-red-700">Logout</button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-6 py-8 sm:px-10 lg:px-16">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Total Topics', value: totalNotes, color: 'text-yellow-400' },
            { label: 'Revealed', value: revealedCount, color: 'text-emerald-400' },
            { label: 'Sections', value: dbmsSections.length + sqlSections.length, color: 'text-sky-400' },
          ].map(s => (
            <div key={s.label} className="bg-[#111] border border-[#1f1f1f] rounded-xl p-6 text-center">
              <div className={`text-4xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-sm text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <svg className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search theory, SQL command, or keyword..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-[#2a2a2a] bg-[#141414] px-5 py-4 pl-12 pr-11 text-base text-white placeholder-gray-600 transition-colors focus:border-yellow-400/60 focus:outline-none"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-lg leading-none text-gray-500 hover:text-gray-300">×</button>
          )}
        </div>

        {/* Last read banner */}
        {lastRead && (
          <div className="flex items-center justify-between gap-3 rounded-xl border border-yellow-400/30 bg-yellow-400/[0.08] px-4 py-3">
            <div className="min-w-0 flex items-center gap-2">
              <span className="text-yellow-400 flex-shrink-0">📍</span>
              <div className="min-w-0">
                <p className="mb-0.5 text-xs text-gray-500">Last read · {lastRead.sectionTitle}</p>
                <p className="truncate text-sm font-medium text-white">{lastRead.question}</p>
              </div>
            </div>
            <div className="flex flex-shrink-0 items-center gap-2">
              <button onClick={jumpToLastRead} className="rounded-lg bg-yellow-400 px-3 py-1.5 text-xs font-bold text-black hover:bg-yellow-300">Resume →</button>
              <button onClick={clearLastRead} className="text-sm text-gray-600 hover:text-gray-400">✕</button>
            </div>
          </div>
        )}

        {noResults && (
          <div className="py-16 text-center text-gray-600">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-sm">No results for <span className="text-gray-400">"{searchQuery}"</span></p>
            <button onClick={() => setSearchQuery('')} className="mt-3 text-xs text-yellow-400 hover:underline">Clear search</button>
          </div>
        )}

        {/* ── DBMS Theory Accordion ── */}
        <section className="overflow-hidden rounded-2xl border border-[#2a2a2a]">
          <button
            onClick={() => setDbmsOpen(p => !p)}
            className="group flex w-full items-center justify-between bg-[#111] px-6 py-5 transition-colors hover:bg-[#161616]"
          >
            <div className="flex items-center gap-4 text-left">
              <span className="grid h-11 w-11 place-items-center rounded-xl border border-yellow-400/25 bg-yellow-400/10 text-sm font-black text-yellow-300">DB</span>
              <div>
                <p className="text-xl font-bold text-yellow-400">DBMS Theory – Q&A</p>
                <p className="mt-0.5 text-xs text-gray-500">{dbmsSections.length} sections · {totalDbmsQ} questions</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-full border border-[#2a2a2a] bg-[#1a1a1a] px-3 py-1 text-xs text-gray-500">{totalDbmsQ} topics</span>
              <svg className={`h-5 w-5 text-yellow-400/70 transition-transform duration-300 ${dbmsOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>

          {(dbmsOpen || (q && filteredDbms.length > 0)) && (
            <div className="border-t border-[#1f1f1f] bg-[#0d0d0d] px-4 py-4 space-y-0">
              {filteredDbms.map((section, sIdx) => {
                const origIdx = dbmsSections.findIndex(s => s.title === section.title);
                const isCollapsed = q ? false : collapsedDbms[origIdx];
                return (
                  <div key={sIdx}>
                    <button onClick={() => setCollapsedDbms(p => ({ ...p, [origIdx]: !p[origIdx] }))} className="w-full flex items-center justify-between py-4 group">
                      <div className="flex items-center gap-3">
                        <span className="text-yellow-400 font-bold text-lg">{section.title}</span>
                        <span className="text-sm text-gray-500 bg-[#1a1a1a] px-2.5 py-0.5 rounded-full">{section.questions.length}Q</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-px w-20 bg-[#1f1f1f] hidden sm:block" />
                        <svg className={`w-4 h-4 text-yellow-400/60 transition-transform duration-200 ${isCollapsed ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </button>
                    <div className="h-px bg-[#1f1f1f] mb-2" />
                    {!isCollapsed && (
                      <div>
                        {section.questions.map((item, qIdx) => {
                          const key = `dbms-${origIdx}-${qIdx}`;
                          const isOpen = openAnswers[key];
                          const isLastRead = lastRead?.key === key;
                          return (
                            <div key={key} ref={el => questionRefs.current[key] = el}
                              className={`border-b transition-all rounded-sm ${isOpen ? 'bg-yellow-400/[0.06] border-yellow-400/20' : isLastRead ? 'border-yellow-400/15' : 'border-[#161616]'}`}>
                              <div className="flex items-center gap-1">
                                <button onClick={() => toggleAnswer(key, item.q, section.title)}
                                  className="flex-1 flex items-center justify-between px-2 py-5 text-left hover:bg-white/[0.03] transition-colors rounded">
                                  <div className="flex items-center gap-2 min-w-0">
                                    {isLastRead && <span className="text-yellow-400 text-xs flex-shrink-0">📌</span>}
                                    <span className={`text-[17px] leading-snug ${isLastRead ? 'text-yellow-200' : 'text-gray-200'}`}>{item.q}</span>
                                  </div>
                                  <svg className={`w-3.5 h-3.5 text-gray-600 flex-shrink-0 ml-3 transition-transform duration-200 ${isOpen ? 'rotate-180 text-yellow-400' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                </button>
                                <a href={`https://chatgpt.com/?q=${encodeURIComponent(`${item.q} in DBMS, explain with example`)}`}
                                  target="_blank" rel="noopener noreferrer" title="Ask ChatGPT"
                                  className="flex-shrink-0 p-2 mr-1 text-gray-500 hover:text-gray-300 hover:scale-125 transition-all duration-300 rounded animate-spin [animation-duration:6s]"
                                  onClick={e => e.stopPropagation()}>
                                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.648zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.843-3.371 2.019-1.168a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.4-.679zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.496 4.496 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.603 1.497v2.999l-2.597 1.5-2.603-1.495z"/>
                                  </svg>
                                </a>
                                <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(`${item.q} DBMS explained`)}`}
                                  target="_blank" rel="noopener noreferrer" title="Search on YouTube"
                                  className="flex-shrink-0 p-2 mr-1 text-red-500 hover:text-red-400 hover:scale-125 transition-all duration-300 rounded"
                                  onClick={e => e.stopPropagation()}>
                                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                  </svg>
                                </a>
                              </div>
                              {isOpen && (
                                <div className="px-3 pb-5 pt-1 space-y-1">
                                  {item.render ? item.render() : renderDBMSAnswer(item.a)}
                                </div>
                              )}
                            </div>
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

        {/* ── SQL Commands Accordion ── */}
        <section className="overflow-hidden rounded-2xl border border-[#2a2a2a]">
          <button
            onClick={() => setSqlOpen(p => !p)}
            className="group flex w-full items-center justify-between bg-[#111] px-6 py-5 transition-colors hover:bg-[#161616]"
          >
            <div className="flex items-center gap-4 text-left">
              <span className="grid h-11 w-11 place-items-center rounded-xl border border-yellow-400/25 bg-yellow-400/10 text-sm font-black text-yellow-300">SQL</span>
              <div>
                <p className="text-xl font-bold text-yellow-400">SQL Commands & Practice</p>
                <p className="mt-0.5 text-xs text-gray-500">{sqlSections.length} sections · {totalSqlNotes} notes</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-full border border-[#2a2a2a] bg-[#1a1a1a] px-3 py-1 text-xs text-gray-500">{totalSqlNotes} topics</span>
              <svg className={`h-5 w-5 text-yellow-400/70 transition-transform duration-300 ${sqlOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>

          {(sqlOpen || (q && filteredSql.length > 0)) && (
            <div className="border-t border-[#1f1f1f] bg-[#0d0d0d] px-4 py-4 space-y-0">
              {filteredSql.map((section, sIdx) => {
                const origIdx = sqlSections.findIndex(s => s.title === section.title);
                const isCollapsed = q ? false : collapsedSql[origIdx];
                return (
                  <div key={sIdx}>
                    <button onClick={() => setCollapsedSql(p => ({ ...p, [origIdx]: !p[origIdx] }))} className="w-full flex items-center justify-between py-4 group">
                      <div className="flex items-center gap-3">
                        <span className="text-yellow-400 font-bold text-lg">{section.title}</span>
                        <span className="text-sm text-gray-500 bg-[#1a1a1a] px-2.5 py-0.5 rounded-full">{section.items.length} notes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-px w-20 bg-[#1f1f1f] hidden sm:block" />
                        <svg className={`w-4 h-4 text-yellow-400/60 transition-transform duration-200 ${isCollapsed ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </button>
                    <div className="h-px bg-[#1f1f1f] mb-2" />
                    {!isCollapsed && (
                      <div>
                        {section.items.map((item, iIdx) => {
                          const key = `sql-${origIdx}-${iIdx}`;
                          const isOpen = openAnswers[key];
                          const isLastRead = lastRead?.key === key;
                          return (
                            <article key={key} ref={el => questionRefs.current[key] = el}
                              className={`border-b transition-all rounded-sm ${isOpen ? 'bg-yellow-400/[0.06] border-yellow-400/20' : isLastRead ? 'border-yellow-400/15' : 'border-[#161616]'}`}>
                              <div className="flex items-center gap-1">
                                <button onClick={() => toggleAnswer(key, item.q, section.title)}
                                  className="flex flex-1 items-center justify-between rounded px-2 py-5 text-left transition-colors hover:bg-white/[0.03]">
                                  <div className="flex min-w-0 items-center gap-2">
                                    {isLastRead && <span className="text-yellow-400 text-xs flex-shrink-0">📌</span>}
                                    <span className={`text-[17px] leading-snug ${isLastRead ? 'text-yellow-200' : 'text-gray-200'}`}>{item.q}</span>
                                  </div>
                                  <svg className={`ml-3 h-3.5 w-3.5 flex-shrink-0 text-gray-600 transition-transform duration-200 ${isOpen ? 'rotate-180 text-yellow-400' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                </button>
                                <a href={`https://chatgpt.com/?q=${encodeURIComponent(`${item.q} in SQL DBMS, explain with example`)}`}
                                  target="_blank" rel="noopener noreferrer" title="Ask ChatGPT"
                                  className="mr-1 flex-shrink-0 rounded p-2 text-gray-500 hover:text-gray-300 hover:scale-125 transition-all duration-300 animate-spin [animation-duration:6s]"
                                  onClick={e => e.stopPropagation()}>
                                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.648zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.843-3.371 2.019-1.168a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.4-.679zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.496 4.496 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.603 1.497v2.999l-2.597 1.5-2.603-1.495z"/>
                                  </svg>
                                </a>
                                <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(`${item.q} SQL explained`)}`}
                                  target="_blank" rel="noopener noreferrer" title="Search on YouTube"
                                  className="mr-1 flex-shrink-0 rounded p-2 text-red-500 hover:text-red-400 hover:scale-125 transition-all duration-300"
                                  onClick={e => e.stopPropagation()}>
                                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                  </svg>
                                </a>
                              </div>
                              {isOpen && <AnswerContent item={item} />}
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

        {q && !noResults && (
          <p className="pt-2 text-center text-xs text-gray-600">{totalVisible} result{totalVisible !== 1 ? 's' : ''} for "{searchQuery}"</p>
        )}
      </main>

      <div className="pb-10" />
      <Footer />
    </div>
  );
}

export default DBMSSheet;
