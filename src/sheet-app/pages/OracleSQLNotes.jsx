import { useNavigate } from 'react-router-dom';

// Full-page "SQL — Complete Notes" reference, rendered exactly as the original
// standalone HTML (GitHub-dark theme, EMP / DEPT dataset). Markup is injected
// verbatim so the page matches the source 1:1; the wrapper only adds an in-app
// back button and unmount-safe scoped styles.
const NOTES_HTML = `
<style>
  .sqlnotes-root{
    --bg:#070b11;
    --panel:#0f1620;
    --panel-2:#0b111a;
    --ink:#e6edf3;
    --muted:#94a3b2;
    --line:#1d2836;
    --accent:#56d364;
    --accent-2:#79c0ff;
    --accent-3:#ffa657;
    --kw:#ff7b72;
    --str:#a5d6ff;
    --fn:#d2a8ff;
    --com:#6e7681;
    --num:#79c0ff;
    --code-bg:#05080d;
    min-height:100vh;
    background:
      radial-gradient(1100px 560px at 85% -8%, #0e1825 0%, transparent 60%),
      radial-gradient(900px 480px at -8% 8%, #0c1521 0%, transparent 55%),
      var(--bg);
    color:var(--ink);
    font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
    line-height:1.6;
    padding:44px 18px 90px;
  }
  .sqlnotes-root *{box-sizing:border-box;}
  .sqlnotes-root .wrap{max-width:960px;margin:0 auto;}

  .sqlnotes-root .masthead{
    border:1px solid var(--line);border-radius:18px;padding:36px 38px;
    background:linear-gradient(180deg,#111b28,#0b111a);margin-bottom:14px;
  }
  .sqlnotes-root .masthead .eyebrow{font-size:12px;letter-spacing:.3em;text-transform:uppercase;color:var(--accent);margin:0 0 10px;font-weight:600;}
  .sqlnotes-root .masthead h1{margin:0;font-size:42px;line-height:1.05;letter-spacing:-.6px;font-weight:800;}
  .sqlnotes-root .masthead p{margin:12px 0 0;color:var(--muted);font-size:15px;max-width:64ch;}
  .sqlnotes-root .crud{display:flex;flex-wrap:wrap;gap:8px;margin-top:18px;}
  .sqlnotes-root .crud span{font-size:12.5px;border:1px solid var(--line);background:var(--panel-2);border-radius:8px;padding:5px 11px;color:var(--accent-2);font-family:Menlo,monospace;}

  .sqlnotes-root .toc-card{border:1px solid var(--line);border-radius:16px;padding:20px 24px;background:var(--panel);margin-bottom:30px;}
  .sqlnotes-root .toc-card h3{margin:0 0 12px;font-size:13px;letter-spacing:.16em;text-transform:uppercase;color:var(--muted);}
  .sqlnotes-root .toc{display:flex;flex-wrap:wrap;gap:9px;}
  .sqlnotes-root .toc a{color:var(--ink);text-decoration:none;font-size:13px;border:1px solid var(--line);padding:6px 12px;border-radius:999px;background:var(--panel-2);transition:.15s;}
  .sqlnotes-root .toc a:hover{border-color:var(--accent);color:var(--accent);}

  .sqlnotes-root section{background:var(--panel);border:1px solid var(--line);border-radius:16px;padding:30px 34px;margin-bottom:24px;}
  .sqlnotes-root h2{font-size:26px;margin:0 0 8px;font-weight:800;letter-spacing:-.3px;display:flex;align-items:center;gap:12px;scroll-margin-top:20px;}
  .sqlnotes-root h2 .bar{display:inline-block;width:6px;height:27px;border-radius:3px;background:var(--accent);}
  .sqlnotes-root h3{font-size:18px;margin:26px 0 10px;font-weight:700;color:var(--accent-2);}
  .sqlnotes-root h4{font-size:15px;color:var(--accent-3);margin:18px 0 8px;font-weight:700;}
  .sqlnotes-root p{margin:8px 0;color:#d4dde6;}
  .sqlnotes-root .lead{color:var(--muted);font-size:14.5px;margin-top:2px;}
  .sqlnotes-root .q{color:var(--accent-3);font-weight:600;margin:22px 0 8px;padding-left:14px;border-left:3px solid var(--accent-3);}
  .sqlnotes-root .def{background:var(--panel-2);border-left:3px solid var(--accent);border-radius:0 10px 10px 0;padding:12px 16px;margin:12px 0;}
  .sqlnotes-root .def b{color:var(--accent);}
  .sqlnotes-root .note{background:var(--panel-2);border:1px dashed var(--line);border-radius:10px;padding:12px 16px;margin:14px 0;color:var(--muted);font-size:14px;}
  .sqlnotes-root .note b{color:var(--accent-2);}

  .sqlnotes-root pre{background:var(--code-bg);border:1px solid var(--line);border-radius:10px;padding:16px 18px;overflow-x:auto;margin:10px 0 4px;font-size:13.5px;line-height:1.55;}
  .sqlnotes-root code{font-family:"SF Mono",SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;}
  .sqlnotes-root .kw{color:var(--kw);font-weight:600;}
  .sqlnotes-root .fn{color:var(--fn);}
  .sqlnotes-root .str{color:var(--str);}
  .sqlnotes-root .com{color:var(--com);font-style:italic;}
  .sqlnotes-root .num{color:var(--num);}

  .sqlnotes-root .tablewrap{overflow-x:auto;margin:14px 0;border-radius:10px;border:1px solid var(--line);}
  .sqlnotes-root table{border-collapse:collapse;width:100%;font-size:13px;}
  .sqlnotes-root caption{text-align:left;font-weight:700;color:var(--accent);padding:10px 12px;background:var(--panel-2);font-size:13.5px;letter-spacing:.04em;border-bottom:1px solid var(--line);}
  .sqlnotes-root th,.sqlnotes-root td{padding:8px 12px;text-align:left;border-bottom:1px solid var(--line);white-space:nowrap;}
  .sqlnotes-root thead th{background:#0a0f17;color:var(--accent-2);font-weight:700;text-transform:uppercase;font-size:11px;letter-spacing:.05em;}
  .sqlnotes-root tbody tr:nth-child(even){background:#0a0f17;}
  .sqlnotes-root tbody tr:hover{background:#101d28;}
  .sqlnotes-root td.null{color:var(--com);font-style:italic;}
  .sqlnotes-root .hl{background:rgba(86,211,100,.14)!important;}
  .sqlnotes-root .hl-b{background:rgba(121,192,255,.14)!important;}

  .sqlnotes-root table.info td{white-space:normal;vertical-align:top;}
  .sqlnotes-root table.info td:first-child{color:var(--accent-2);font-weight:600;width:34%;}

  .sqlnotes-root .ascii{background:var(--code-bg);border:1px solid var(--line);border-radius:10px;padding:16px 18px;color:var(--accent-2);font-size:13px;white-space:pre;overflow-x:auto;font-family:"SF Mono",Menlo,Consolas,monospace;margin:12px 0;}
  .sqlnotes-root .memcells{display:flex;flex-wrap:wrap;gap:4px;margin:10px 0;}
  .sqlnotes-root .cell{width:38px;height:38px;display:flex;align-items:center;justify-content:center;border:1px solid var(--line);border-radius:6px;font-family:Menlo,monospace;font-size:13px;background:var(--panel-2);}
  .sqlnotes-root .cell.used{background:rgba(86,211,100,.16);border-color:var(--accent);color:var(--accent);}
  .sqlnotes-root .cell.free{color:var(--com);}

  .sqlnotes-root ul{margin:8px 0;padding-left:22px;}
  .sqlnotes-root li{margin:5px 0;color:#d4dde6;}
  .sqlnotes-root ol{margin:8px 0;padding-left:22px;}
  .sqlnotes-root .pill{display:inline-block;background:#101d28;border:1px solid var(--line);border-radius:6px;padding:1px 8px;font-size:12px;color:var(--accent-2);font-family:Menlo,monospace;}
  .sqlnotes-root hr{border:none;border-top:1px solid var(--line);margin:24px 0;}
  .sqlnotes-root .grid2{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
  @media(max-width:640px){.sqlnotes-root .grid2{grid-template-columns:1fr;}}
</style>

<div class="wrap">

  <header class="masthead">
    <p class="eyebrow">Structured Query Language</p>
    <h1>SQL — Complete Notes</h1>
    <p>Full course reference: datatypes, constraints, statement categories, operators, pattern matching, functions, grouping, subqueries and every join — each illustrated with the standard <span class="pill">EMP</span> / <span class="pill">DEPT</span> dataset and result tables.</p>
    <div class="crud">
      <span>C &rarr; Create / Insert</span>
      <span>R &rarr; Read / Retrieve</span>
      <span>U &rarr; Update / Modify</span>
      <span>D &rarr; Delete / Drop</span>
    </div>
  </header>

  <div class="toc-card">
    <h3>Contents</h3>
    <nav class="toc">
      <a href="#basics">Database &amp; Datatypes</a>
      <a href="#constraints">Constraints</a>
      <a href="#statements">SQL Statements</a>
      <a href="#ddl">DDL Commands</a>
      <a href="#dml">DML Commands</a>
      <a href="#tcl">TCL Commands</a>
      <a href="#dcl">DCL Commands</a>
      <a href="#tables">Sample Tables</a>
      <a href="#select">SELECT &amp; DISTINCT</a>
      <a href="#where">WHERE</a>
      <a href="#operators">Operators</a>
      <a href="#like">LIKE Patterns</a>
      <a href="#functions">Functions</a>
      <a href="#groupby">GROUP BY</a>
      <a href="#having">HAVING vs WHERE</a>
      <a href="#orderby">ORDER BY</a>
      <a href="#subquery">Subqueries</a>
      <a href="#allany">ALL / ANY</a>
      <a href="#nested">Nested</a>
      <a href="#joins">Joins</a>
    </nav>
  </div>

  <!-- ============ BASICS ============ -->
  <section id="basics">
    <h2><span class="bar"></span>Database &amp; Datatypes</h2>
    <div class="def"><b>Database</b> &mdash; a place or medium used to store data in a systematic and organised manner.</div>
    <div class="def"><b>Datatype</b> &mdash; used to identify which type of data is stored in the database.</div>

    <h3>Common datatypes</h3>
    <div class="tablewrap">
      <table class="info">
        <thead><tr><th>Datatype</th><th>Description</th></tr></thead>
        <tbody>
          <tr><td>CHAR</td><td>Fixed-length text. Reserves the full size even if unused.</td></tr>
          <tr><td>VARCHAR / VARCHAR2</td><td>Variable-length text. VARCHAR &rarr; up to 2000, VARCHAR2 &rarr; up to ~9000 (engine dependent).</td></tr>
          <tr><td>NUMBER</td><td>Numeric values.</td></tr>
          <tr><td>DATE</td><td>Date / time values.</td></tr>
          <tr><td>CLOB</td><td>Character Large Object &mdash; up to 4 GB of text.</td></tr>
          <tr><td>BLOB</td><td>Binary Large Object &mdash; up to 4 GB: images, videos, audio.</td></tr>
        </tbody>
      </table>
    </div>

    <h3>Fixed vs used memory &mdash; <span class="pill">varchar(10)</span> storing "Dingo"</h3>
    <p class="lead">A request for <span class="pill">varchar(10)</span> allocates 10 blocks; "Dingo" fills 5, the rest stay unused.</p>
    <div class="memcells">
      <div class="cell used">D</div><div class="cell used">i</div><div class="cell used">n</div><div class="cell used">g</div><div class="cell used">o</div>
      <div class="cell free">6</div><div class="cell free">7</div><div class="cell free">8</div><div class="cell free">9</div><div class="cell free">10</div>
    </div>
    <div class="note"><b>Used blocks</b> 1&ndash;5 hold the characters &middot; <b>unused blocks</b> 6&ndash;10 remain reserved. CHAR keeps all 10 reserved; VARCHAR releases the unused portion.</div>
  </section>

  <!-- ============ CONSTRAINTS ============ -->
  <section id="constraints">
    <h2><span class="bar"></span>Constraints</h2>
    <div class="def"><b>Constraints</b> are the rules given to a column for validation.</div>
    <div class="tablewrap">
      <table class="info">
        <thead><tr><th>Constraint</th><th>Meaning</th></tr></thead>
        <tbody>
          <tr><td>UNIQUE</td><td>Cannot accept duplicate / repeated values.</td></tr>
          <tr><td>NOT NULL</td><td>Cannot be left empty &mdash; a value is mandatory.</td></tr>
          <tr><td>CHECK</td><td>Accepts only values that satisfy a given condition.</td></tr>
          <tr><td>PRIMARY KEY</td><td>Uniquely identifies each row (UNIQUE + NOT NULL).</td></tr>
          <tr><td>FOREIGN KEY</td><td>Links a column to the primary key of another table.</td></tr>
        </tbody>
      </table>
    </div>
    <div class="note">In the sample below, <span class="pill">EID</span> repeating <span class="pill">1</span> violates UNIQUE/PRIMARY KEY, and the blank <span class="pill">Ename</span> on row 3 violates NOT NULL.</div>
    <div class="tablewrap">
      <table>
        <caption>Example &mdash; constraint violations</caption>
        <thead><tr><th>EID &mdash; Number(2)</th><th>Ename &mdash; Varchar(10)</th><th>Ph_No &mdash; Number(10)</th></tr></thead>
        <tbody>
          <tr><td>1</td><td>'Dingo'</td><td>9722123413</td></tr>
          <tr><td>2</td><td>'Dingi'</td><td>2233333333</td></tr>
          <tr class="hl"><td>1 &larr; duplicate</td><td class="null">(blank) &larr; NOT NULL fails</td><td>2231233</td></tr>
        </tbody>
      </table>
    </div>
  </section>

  <!-- ============ STATEMENTS ============ -->
  <section id="statements">
    <h2><span class="bar"></span>SQL Statement Categories</h2>
    <div class="grid2">
      <div class="def"><b>DDL &mdash; Data Definition Language</b><br>CREATE &middot; RENAME &middot; ALTER &middot; TRUNCATE &middot; DROP</div>
      <div class="def"><b>DML &mdash; Data Manipulation Language</b><br>INSERT &middot; UPDATE &middot; DELETE</div>
      <div class="def"><b>TCL &mdash; Transaction Control Language</b><br>COMMIT &middot; ROLLBACK &middot; SAVEPOINT</div>
      <div class="def"><b>DCL &mdash; Data Control Language</b><br>GRANT &middot; REVOKE</div>
      <div class="def"><b>DQL &mdash; Data Query Language</b><br>SELECT</div>
    </div>
  </section>

  <!-- ============ DDL ============ -->
  <section id="ddl">
    <h2><span class="bar"></span>DDL &mdash; Data Definition Language</h2>
    <p class="lead">Commands that define or change the <b>structure</b> of a table: CREATE, RENAME, ALTER, TRUNCATE, DROP.</p>

    <h3>CREATE &mdash; make a new table</h3>
    <pre><code><span class="com">-- Syntax</span>
<span class="kw">CREATE TABLE</span> table_name (
    col_name1 datatype [constraint],
    col_name2 datatype [constraint]
);

<span class="com">-- Example</span>
<span class="kw">CREATE TABLE</span> student (
    sid    <span class="fn">Number</span>(<span class="num">2</span>) <span class="kw">PRIMARY KEY</span>,
    sname  <span class="fn">Varchar</span>(<span class="num">10</span>) <span class="kw">NOT NULL</span>
);</code></pre>

    <h3>RENAME &mdash; rename an existing table</h3>
    <pre><code><span class="com">-- Syntax</span>
<span class="kw">RENAME</span> existing_table <span class="kw">TO</span> new_table;

<span class="com">-- Example</span>
<span class="kw">RENAME</span> student <span class="kw">TO</span> stud;</code></pre>

    <h3>ALTER &mdash; change table structure</h3>
    <p class="lead">ALTER handles five structural changes: add a column, modify a datatype, modify a constraint, rename a column, and drop a column.</p>

    <h4>1. Add a column</h4>
    <pre><code><span class="kw">ALTER TABLE</span> table_name
<span class="kw">ADD</span> column_name datatype [constraint];

<span class="com">-- Example</span>
<span class="kw">ALTER TABLE</span> student
<span class="kw">ADD</span> age <span class="fn">Number</span>(<span class="num">2</span>) <span class="kw">NOT NULL</span>;</code></pre>

    <h4>2. Modify a datatype</h4>
    <pre><code><span class="kw">ALTER TABLE</span> table_name
<span class="kw">MODIFY</span> column_name new_datatype;

<span class="com">-- Example</span>
<span class="kw">ALTER TABLE</span> student
<span class="kw">MODIFY</span> sname <span class="fn">char</span>(<span class="num">10</span>);</code></pre>

    <h4>3. Modify a constraint</h4>
    <pre><code><span class="kw">ALTER TABLE</span> table_name
<span class="kw">MODIFY</span> column_name new_constraint;

<span class="com">-- Example</span>
<span class="kw">ALTER TABLE</span> student
<span class="kw">MODIFY</span> sname <span class="kw">NOT NULL</span>;</code></pre>

    <h4>4. Rename a column</h4>
    <pre><code><span class="kw">ALTER TABLE</span> table_name
<span class="kw">RENAME COLUMN</span> existing_col <span class="kw">TO</span> new_col;

<span class="com">-- Example</span>
<span class="kw">ALTER TABLE</span> student
<span class="kw">RENAME COLUMN</span> sname <span class="kw">TO</span> student_name;</code></pre>

    <h4>5. Drop a column</h4>
    <pre><code><span class="kw">ALTER TABLE</span> table_name
<span class="kw">DROP COLUMN</span> column_name;

<span class="com">-- Example</span>
<span class="kw">ALTER TABLE</span> student
<span class="kw">DROP COLUMN</span> age;</code></pre>

    <h3>TRUNCATE vs DROP vs DELETE</h3>
    <div class="tablewrap">
      <table class="info">
        <thead><tr><th>Command</th><th>What it removes</th><th>Structure kept?</th><th>Recoverable?</th></tr></thead>
        <tbody>
          <tr><td>TRUNCATE</td><td>All rows (permanently)</td><td>Yes &mdash; table stays</td><td>No</td></tr>
          <tr><td>DROP</td><td>The whole table</td><td>No &mdash; table gone</td><td>Yes &mdash; via FLASHBACK</td></tr>
          <tr><td>DELETE (DML)</td><td>Selected rows</td><td>Yes &mdash; table stays</td><td>Yes &mdash; via ROLLBACK</td></tr>
        </tbody>
      </table>
    </div>

    <h4>TRUNCATE &mdash; delete all data, keep the structure</h4>
    <pre><code><span class="kw">TRUNCATE TABLE</span> table_name;

<span class="com">-- Example</span>
<span class="kw">TRUNCATE TABLE</span> student;</code></pre>

    <h4>DROP &mdash; delete the whole table (recoverable)</h4>
    <pre><code><span class="kw">DROP TABLE</span> table_name;

<span class="com">-- Example</span>
<span class="kw">DROP TABLE</span> student;</code></pre>

    <h4>FLASHBACK &mdash; recover a dropped table</h4>
    <pre><code><span class="kw">FLASHBACK TABLE</span> table_name <span class="kw">TO BEFORE DROP</span>;

<span class="com">-- Example</span>
<span class="kw">FLASHBACK TABLE</span> emp <span class="kw">TO BEFORE DROP</span>;</code></pre>

    <h4>PURGE &mdash; permanently remove (cannot flashback after this)</h4>
    <pre><code><span class="kw">PURGE TABLE</span> table_name;

<span class="com">-- Example</span>
<span class="kw">PURGE TABLE</span> emp;</code></pre>
    <div class="note"><b>Remember:</b> after a DROP the table sits in the recycle bin and FLASHBACK can restore it &mdash; but once you <span class="pill">PURGE</span>, it is gone for good.</div>
  </section>

  <!-- ============ DML ============ -->
  <section id="dml">
    <h2><span class="bar"></span>DML &mdash; Data Manipulation Language</h2>
    <p class="lead">Commands that work on the <b>data</b> inside a table: INSERT, UPDATE, DELETE. (DML changes can be undone with ROLLBACK until you COMMIT.)</p>

    <h3>INSERT &mdash; add new rows</h3>
    <h4>1. Insert values directly</h4>
    <pre><code><span class="com">-- Syntax</span>
<span class="kw">INSERT INTO</span> table_name <span class="kw">VALUES</span> (v1, v2, v3, ... vn);

<span class="com">-- Example</span>
<span class="kw">INSERT INTO</span> student <span class="kw">VALUES</span> (<span class="num">1</span>, <span class="str">'Donga'</span>, <span class="num">21</span>);</code></pre>

    <h4>2. Insert into specific columns</h4>
    <pre><code><span class="com">-- Syntax</span>
<span class="kw">INSERT INTO</span> table_name (column1, column2)
<span class="kw">VALUES</span> (value1, value2);

<span class="com">-- Example</span>
<span class="kw">INSERT INTO</span> student (sid, sname)
<span class="kw">VALUES</span> (<span class="num">2</span>, <span class="str">'Dingi'</span>);</code></pre>

    <h4>3. Insert with substitution variables (interactive)</h4>
    <pre><code><span class="com">-- The &amp; prompts you to type each value at run time</span>
<span class="kw">INSERT INTO</span> student <span class="kw">VALUES</span> (&amp;sid, <span class="str">'&amp;sname'</span>, &amp;sage);</code></pre>

    <h3>UPDATE &mdash; modify existing rows</h3>
    <pre><code><span class="com">-- Syntax</span>
<span class="kw">UPDATE</span> table_name
<span class="kw">SET</span> column_name = value
[<span class="kw">WHERE</span> &lt;condition&gt;];

<span class="com">-- Example</span>
<span class="kw">UPDATE</span> student
<span class="kw">SET</span> sname = <span class="str">'Dingi'</span>
<span class="kw">WHERE</span> sid = <span class="num">1</span>;</code></pre>
    <div class="note"><b>Caution:</b> leave out the <span class="pill">WHERE</span> clause and <b>every row</b> gets updated. The WHERE clause decides which rows change.</div>

    <h3>DELETE &mdash; remove rows</h3>
    <pre><code><span class="com">-- Syntax</span>
<span class="kw">DELETE FROM</span> table_name
[<span class="kw">WHERE</span> &lt;condition&gt;];

<span class="com">-- Example</span>
<span class="kw">DELETE FROM</span> student
<span class="kw">WHERE</span> sid = <span class="num">1</span>;</code></pre>

    <h3>DELETE vs TRUNCATE vs DROP</h3>
    <div class="tablewrap">
      <table class="info">
        <thead><tr><th>Command</th><th>Type</th><th>Removes</th><th>WHERE?</th><th>Undo</th></tr></thead>
        <tbody>
          <tr><td>DELETE</td><td>DML</td><td>Chosen rows (or all)</td><td>Yes</td><td>ROLLBACK</td></tr>
          <tr><td>TRUNCATE</td><td>DDL</td><td>All rows, keeps structure</td><td>No</td><td>Not recoverable</td></tr>
          <tr><td>DROP</td><td>DDL</td><td>Whole table</td><td>No</td><td>FLASHBACK</td></tr>
        </tbody>
      </table>
    </div>
  </section>

  <!-- ============ TCL ============ -->
  <section id="tcl">
    <h2><span class="bar"></span>TCL &mdash; Transaction Control Language</h2>
    <p class="lead">Commands that manage <b>transactions</b> &mdash; they confirm or undo the changes made by DML (INSERT, UPDATE, DELETE).</p>

    <h3>COMMIT &mdash; save changes permanently</h3>
    <div class="def"><b>COMMIT</b> makes all changes since the last commit permanent. After a commit they can no longer be rolled back.</div>
    <pre><code><span class="kw">COMMIT</span>;</code></pre>

    <h3>SAVEPOINT &mdash; set a restore point</h3>
    <div class="def"><b>SAVEPOINT</b> is a marker (restoration point) placed within a transaction so you can later roll back to it instead of undoing everything.</div>
    <pre><code><span class="com">-- Syntax</span>
<span class="kw">SAVEPOINT</span> savepoint_name;

<span class="com">-- Example</span>
<span class="kw">SAVEPOINT</span> S1;</code></pre>

    <h3>ROLLBACK &mdash; undo back to a savepoint</h3>
    <div class="def"><b>ROLLBACK</b> undoes changes, returning to a chosen savepoint (or to the last COMMIT if no savepoint is named).</div>
    <pre><code><span class="com">-- Syntax</span>
<span class="kw">ROLLBACK TO</span> savepoint_name;

<span class="com">-- Example</span>
<span class="kw">ROLLBACK TO</span> S1;</code></pre>

    <h3>How they work together</h3>
    <div class="ascii"><span style="color:var(--accent-3)">INSERT row A</span>
<span class="kw" style="color:#56d364">SAVEPOINT S1</span>  &#9664;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9488;
<span style="color:var(--accent-3)">INSERT row B</span>                     &#9474;
<span style="color:var(--accent-3)">UPDATE row C</span>                     &#9474;  ROLLBACK TO S1
        &#9474;                        &#9474;  undoes B and C,
        &#9492;&#9472;&#9472; ROLLBACK TO S1 &#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9496;  keeps row A

<span class="kw" style="color:#56d364">COMMIT</span>  &#9472;&#9472;&#9658;  everything still left is made permanent (cannot undo after this)</div>
    <div class="note"><b>In short:</b> SAVEPOINT marks a spot, ROLLBACK rewinds to it, and COMMIT locks everything in. Once you COMMIT, earlier savepoints and rollbacks no longer apply.</div>
  </section>

  <!-- ============ DCL ============ -->
  <section id="dcl">
    <h2><span class="bar"></span>DCL &mdash; Data Control Language</h2>
    <p class="lead">Commands that control <b>access permissions</b> &mdash; deciding which users can perform which operations on a table.</p>

    <h3>GRANT &mdash; give permission to another user</h3>
    <div class="def"><b>GRANT</b> gives a privilege (like SELECT, INSERT, UPDATE) on a table to another user.</div>
    <pre><code><span class="com">-- Syntax</span>
<span class="kw">GRANT</span> &lt;sql_statement&gt;
<span class="kw">ON</span> table_name
<span class="kw">TO</span> user_name;

<span class="com">-- Example</span>
<span class="kw">GRANT</span> <span class="kw">SELECT</span>
<span class="kw">ON</span> emp
<span class="kw">TO</span> HR;</code></pre>

    <h3>REVOKE &mdash; take back a granted permission</h3>
    <div class="def"><b>REVOKE</b> removes a privilege that was previously granted to a user.</div>
    <pre><code><span class="com">-- Syntax</span>
<span class="kw">REVOKE</span> &lt;sql_statement&gt;
<span class="kw">ON</span> table_name
<span class="kw">FROM</span> user_name;

<span class="com">-- Example</span>
<span class="kw">REVOKE</span> <span class="kw">SELECT</span>
<span class="kw">ON</span> emp
<span class="kw">FROM</span> HR;</code></pre>
    <div class="note"><b>Note the keyword:</b> GRANT gives a privilege <span class="pill">TO</span> a user, while REVOKE takes it <span class="pill">FROM</span> a user. That TO / FROM swap is the easy way to remember the two.</div>
  </section>

  <!-- ============ SAMPLE TABLES ============ -->
  <section id="tables">
    <h2><span class="bar"></span>Sample Tables</h2>
    <p class="lead">All queries from here on run against these two tables.</p>
    <div class="tablewrap">
      <table>
        <caption>EMP</caption>
        <thead><tr><th>empno</th><th>ename</th><th>job</th><th>mgr</th><th>hiredate</th><th>sal</th><th>comm</th><th>deptno</th></tr></thead>
        <tbody>
          <tr><td>7369</td><td>SMITH</td><td>CLERK</td><td>7902</td><td>1980-12-17</td><td>800.00</td><td class="null">NULL</td><td>20</td></tr>
          <tr><td>7499</td><td>ALLEN</td><td>SALESMAN</td><td>7698</td><td>1981-02-20</td><td>1600.00</td><td>300.00</td><td>30</td></tr>
          <tr><td>7521</td><td>WARD</td><td>SALESMAN</td><td>7698</td><td>1981-02-22</td><td>1250.00</td><td>500.00</td><td>30</td></tr>
          <tr><td>7566</td><td>JONES</td><td>MANAGER</td><td>7839</td><td>1981-04-02</td><td>2975.00</td><td class="null">NULL</td><td>20</td></tr>
          <tr><td>7654</td><td>MARTIN</td><td>SALESMAN</td><td>7698</td><td>1981-09-28</td><td>1250.00</td><td>1400.00</td><td>30</td></tr>
          <tr><td>7698</td><td>BLAKE</td><td>MANAGER</td><td>7839</td><td>1981-05-01</td><td>2850.00</td><td class="null">NULL</td><td>30</td></tr>
          <tr><td>7782</td><td>CLARK</td><td>MANAGER</td><td>7839</td><td>1981-06-09</td><td>2450.00</td><td class="null">NULL</td><td>10</td></tr>
          <tr><td>7788</td><td>SCOTT</td><td>ANALYST</td><td>7566</td><td>1982-12-09</td><td>3000.00</td><td class="null">NULL</td><td>20</td></tr>
          <tr><td>7839</td><td>KING</td><td>PRESIDENT</td><td class="null">NULL</td><td>1981-11-17</td><td>5000.00</td><td class="null">NULL</td><td>10</td></tr>
          <tr><td>7844</td><td>TURNER</td><td>SALESMAN</td><td>7698</td><td>1981-09-08</td><td>1500.00</td><td>0.00</td><td>30</td></tr>
          <tr><td>7876</td><td>ADAMS</td><td>CLERK</td><td>7788</td><td>1983-01-12</td><td>1100.00</td><td class="null">NULL</td><td>20</td></tr>
          <tr><td>7900</td><td>JAMES</td><td>CLERK</td><td>7698</td><td>1981-12-03</td><td>950.00</td><td class="null">NULL</td><td>30</td></tr>
          <tr><td>7902</td><td>FORD</td><td>ANALYST</td><td>7566</td><td>1981-12-03</td><td>3000.00</td><td class="null">NULL</td><td>20</td></tr>
          <tr><td>7934</td><td>MILLER</td><td>CLERK</td><td>7782</td><td>1982-01-23</td><td>1300.00</td><td class="null">NULL</td><td>10</td></tr>
        </tbody>
      </table>
    </div>
    <div class="tablewrap">
      <table>
        <caption>DEPT</caption>
        <thead><tr><th>deptno</th><th>dname</th><th>loc</th></tr></thead>
        <tbody>
          <tr><td>10</td><td>ACCOUNTING</td><td>NEW YORK</td></tr>
          <tr><td>20</td><td>RESEARCH</td><td>DALLAS</td></tr>
          <tr><td>30</td><td>SALES</td><td>CHICAGO</td></tr>
          <tr><td>40</td><td>OPERATIONS</td><td>BOSTON</td></tr>
        </tbody>
      </table>
    </div>
    <div class="note"><b>Two facts to remember:</b> dept 40 (OPERATIONS) has <b>no employees</b>, and every employee except <b>KING</b> has a manager. These drive the outer-join and self-join results.</div>
  </section>

  <!-- ============ SELECT ============ -->
  <section id="select">
    <h2><span class="bar"></span>SELECT &amp; DISTINCT</h2>
    <pre><code><span class="com">-- Syntax</span>
<span class="kw">SELECT</span> * / [<span class="kw">DISTINCT</span>] column_name / expression [alias]
<span class="kw">FROM</span> table_name;</code></pre>

    <p class="q">Q &mdash; Display emp name, deptno, hiredate and job.</p>
    <pre><code><span class="kw">SELECT</span> ename, deptno, hiredate, job
<span class="kw">FROM</span> emp;</code></pre>

    <h3>DISTINCT</h3>
    <div class="def"><b>DISTINCT</b> removes duplicate / repeated values from the result. It must be the <b>first</b> argument in the SELECT list.</div>
    <pre><code><span class="kw">SELECT</span> <span class="kw">DISTINCT</span> deptno
<span class="kw">FROM</span> emp;</code></pre>

    <h3>Expressions &amp; aliases</h3>
    <p class="q">Q &mdash; Display annual and half-yearly salary.</p>
    <pre><code><span class="kw">SELECT</span> ename,
       sal * <span class="num">12</span> <span class="kw">AS</span> annual_sal,
       (sal * <span class="num">12</span>) / <span class="num">2</span> <span class="kw">AS</span> half_year_sal
<span class="kw">FROM</span> emp;</code></pre>

    <p class="q">Q &mdash; Display SMITH's salary.</p>
    <pre><code><span class="kw">SELECT</span> ename, sal
<span class="kw">FROM</span> emp
<span class="kw">WHERE</span> ename = <span class="str">'SMITH'</span>;</code></pre>
  </section>

  <!-- ============ WHERE ============ -->
  <section id="where">
    <h2><span class="bar"></span>WHERE Clause</h2>
    <pre><code><span class="com">-- Syntax</span>
<span class="kw">SELECT</span> * / column_name
<span class="kw">FROM</span> table_name
<span class="kw">WHERE</span> &lt;filter_condition&gt;;</code></pre>
    <ul>
      <li>Filters the <b>records</b> (rows).</li>
      <li>Executes <b>after</b> the FROM clause.</li>
      <li>Works on individual rows, one at a time.</li>
    </ul>

    <p class="q">Q &mdash; Details of emps earning more than 1000.</p>
    <pre><code><span class="kw">SELECT</span> *
<span class="kw">FROM</span> emp
<span class="kw">WHERE</span> sal &gt; <span class="num">1000</span>;</code></pre>

    <p class="q">Q &mdash; Emp names hired after 1980.</p>
    <pre><code><span class="kw">SELECT</span> ename, hiredate
<span class="kw">FROM</span> emp
<span class="kw">WHERE</span> hiredate &gt; <span class="str">'1980-12-31'</span>;</code></pre>

    <p class="q">Q &mdash; Emp names earning more than 1000 and less than 5000.</p>
    <pre><code><span class="kw">SELECT</span> ename, sal
<span class="kw">FROM</span> emp
<span class="kw">WHERE</span> sal &gt; <span class="num">1000</span> <span class="kw">AND</span> sal &lt; <span class="num">5000</span>;</code></pre>
  </section>

  <!-- ============ OPERATORS ============ -->
  <section id="operators">
    <h2><span class="bar"></span>Operators</h2>
    <div class="tablewrap">
      <table class="info">
        <thead><tr><th>Category</th><th>Operators</th></tr></thead>
        <tbody>
          <tr><td>Arithmetic</td><td>+ &nbsp; &minus; &nbsp; * &nbsp; /</td></tr>
          <tr><td>Concatenation</td><td>||</td></tr>
          <tr><td>Comparison</td><td>= &nbsp; != (&lt;&gt;)</td></tr>
          <tr><td>Relational</td><td>&gt; &nbsp; &lt; &nbsp; &gt;= &nbsp; &lt;=</td></tr>
          <tr><td>Logical</td><td>AND &nbsp; OR &nbsp; NOT</td></tr>
          <tr><td>Special</td><td>IN, NOT IN, BETWEEN, NOT BETWEEN, IS, IS NOT, LIKE, NOT LIKE</td></tr>
          <tr><td>Subquery</td><td>ANY, ALL, EXISTS, NOT EXISTS</td></tr>
          <tr><td>Set</td><td>UNION, UNION ALL, INTERSECT, MINUS</td></tr>
        </tbody>
      </table>
    </div>

    <h3>Concatenation ( || )</h3>
    <pre><code><span class="kw">SELECT</span> <span class="str">'Mr. '</span> || ename <span class="kw">AS</span> name
<span class="kw">FROM</span> emp;
<span class="com">-- Mr. ALLEN, Mr. KING, ...</span></code></pre>

    <h3>IN &mdash; match any value in a list</h3>
    <pre><code><span class="kw">SELECT</span> *
<span class="kw">FROM</span> emp
<span class="kw">WHERE</span> deptno <span class="kw">IN</span> (<span class="num">10</span>, <span class="num">20</span>, <span class="num">30</span>, <span class="num">60</span>);</code></pre>

    <h3>NOT BETWEEN &mdash; outside a range</h3>
    <pre><code><span class="kw">SELECT</span> *
<span class="kw">FROM</span> emp
<span class="kw">WHERE</span> sal <span class="kw">NOT BETWEEN</span> <span class="num">1000</span> <span class="kw">AND</span> <span class="num">5000</span>;</code></pre>

    <h3>IS NULL &mdash; emps not getting commission</h3>
    <pre><code><span class="kw">SELECT</span> ename
<span class="kw">FROM</span> emp
<span class="kw">WHERE</span> comm <span class="kw">IS NULL</span>;</code></pre>
  </section>

  <!-- ============ LIKE ============ -->
  <section id="like">
    <h2><span class="bar"></span>LIKE &mdash; Pattern Matching</h2>
    <div class="grid2">
      <div class="def"><b>%</b> &mdash; matches <b>multiple</b> characters (zero or more).</div>
      <div class="def"><b>_</b> &mdash; matches exactly <b>one</b> character.</div>
    </div>

    <div class="tablewrap">
      <table class="info">
        <thead><tr><th>Pattern</th><th>Matches</th></tr></thead>
        <tbody>
          <tr><td><span class="pill">'A%'</span></td><td>names starting with A</td></tr>
          <tr><td><span class="pill">'%A'</span></td><td>names ending with A</td></tr>
          <tr><td><span class="pill">'%A%'</span></td><td>names containing A anywhere</td></tr>
          <tr><td><span class="pill">'_A%'</span></td><td>A as the second character</td></tr>
        </tbody>
      </table>
    </div>

    <pre><code><span class="kw">SELECT</span> *
<span class="kw">FROM</span> emp
<span class="kw">WHERE</span> ename <span class="kw">LIKE</span> <span class="str">'A%'</span>;     <span class="com">-- starts with A</span></code></pre>

    <pre><code><span class="kw">SELECT</span> *
<span class="kw">FROM</span> emp
<span class="kw">WHERE</span> ename <span class="kw">LIKE</span> <span class="str">'_A%'</span>;    <span class="com">-- A is 2nd char</span></code></pre>

    <p class="q">Q &mdash; Emps who do NOT have 'S' in their name.</p>
    <pre><code><span class="kw">SELECT</span> *
<span class="kw">FROM</span> emp
<span class="kw">WHERE</span> ename <span class="kw">NOT LIKE</span> <span class="str">'%S%'</span>;</code></pre>
  </section>

  <!-- ============ FUNCTIONS ============ -->
  <section id="functions">
    <h2><span class="bar"></span>Functions</h2>

    <h3>Single-Row Function (SRF)</h3>
    <div class="def">Number of inputs = number of outputs. One input row &rarr; one output row. e.g. <b>LENGTH()</b>, UPPER(), LOWER().</div>
    <pre><code><span class="kw">SELECT</span> <span class="fn">LENGTH</span>(ename)
<span class="kw">FROM</span> emp;</code></pre>

    <h3>Multi-Row Function (MRF) &mdash; aggregates</h3>
    <p class="lead"><span class="pill">MAX()</span> &middot; <span class="pill">MIN()</span> &middot; <span class="pill">AVG()</span> &middot; <span class="pill">SUM()</span> &middot; <span class="pill">COUNT()</span></p>
    <h4>Rules of MRF</h4>
    <ol>
      <li>MRF cannot accept NULL values.</li>
      <li>MRF cannot accept more than one argument.</li>
      <li>You cannot pass another column name alongside an MRF.</li>
      <li>MRF cannot be used in the WHERE clause.</li>
      <li><b>COUNT()</b> is the only MRF that accepts <span class="pill">*</span> as an argument.</li>
    </ol>

    <p class="q">Q &mdash; Minimum salary of a MANAGER.</p>
    <pre><code><span class="kw">SELECT</span> <span class="fn">MIN</span>(sal)
<span class="kw">FROM</span> emp
<span class="kw">WHERE</span> job = <span class="str">'MANAGER'</span>;</code></pre>

    <p class="q">Q &mdash; Maximum salary.</p>
    <pre><code><span class="kw">SELECT</span> <span class="fn">MAX</span>(sal)
<span class="kw">FROM</span> emp;</code></pre>

    <p class="q">Q &mdash; Count, min, max, avg and sum of salary for emps in depts 10/20/30, salary between 1000&ndash;5000, no commission, and 5 letters in their name.</p>
    <pre><code><span class="kw">SELECT</span> <span class="fn">COUNT</span>(*)   <span class="kw">AS</span> emp_count,
       <span class="fn">MIN</span>(sal)   <span class="kw">AS</span> min_sal,
       <span class="fn">MAX</span>(sal)   <span class="kw">AS</span> max_sal,
       <span class="fn">AVG</span>(sal)   <span class="kw">AS</span> avg_sal,
       <span class="fn">SUM</span>(sal)   <span class="kw">AS</span> total_sal
<span class="kw">FROM</span> emp
<span class="kw">WHERE</span> deptno <span class="kw">IN</span> (<span class="num">10</span>, <span class="num">20</span>, <span class="num">30</span>)
  <span class="kw">AND</span> sal <span class="kw">BETWEEN</span> <span class="num">1000</span> <span class="kw">AND</span> <span class="num">5000</span>
  <span class="kw">AND</span> comm <span class="kw">IS NULL</span>
  <span class="kw">AND</span> <span class="fn">LENGTH</span>(ename) = <span class="num">5</span>;</code></pre>

    <p class="q">Q &mdash; Sum of salary of emps who have a reporting manager.</p>
    <pre><code><span class="kw">SELECT</span> <span class="fn">SUM</span>(sal)
<span class="kw">FROM</span> emp
<span class="kw">WHERE</span> mgr <span class="kw">IS NOT NULL</span>;</code></pre>
  </section>

  <!-- ============ GROUP BY ============ -->
  <section id="groupby">
    <h2><span class="bar"></span>GROUP BY Clause</h2>
    <ul>
      <li>Executes <b>after</b> the FROM clause.</li>
      <li>Groups rows that share the same value so an aggregate can run per group.</li>
    </ul>

    <p class="q">Q &mdash; Count of emps in each department.</p>
    <pre><code><span class="kw">SELECT</span> deptno, <span class="fn">COUNT</span>(*) <span class="kw">AS</span> emp_count
<span class="kw">FROM</span> emp
<span class="kw">GROUP BY</span> deptno;</code></pre>
    <div class="tablewrap">
      <table>
        <caption>Result</caption>
        <thead><tr><th>deptno</th><th>emp_count</th></tr></thead>
        <tbody>
          <tr><td>10</td><td>3</td></tr>
          <tr><td>20</td><td>5</td></tr>
          <tr><td>30</td><td>6</td></tr>
        </tbody>
      </table>
    </div>

    <p class="q">Q &mdash; Max and min salary in each department, only emps hired in 1980.</p>
    <pre><code><span class="kw">SELECT</span> deptno, <span class="fn">MAX</span>(sal) <span class="kw">AS</span> max_sal, <span class="fn">MIN</span>(sal) <span class="kw">AS</span> min_sal
<span class="kw">FROM</span> emp
<span class="kw">WHERE</span> hiredate <span class="kw">BETWEEN</span> <span class="str">'1980-01-01'</span> <span class="kw">AND</span> <span class="str">'1980-12-31'</span>
<span class="kw">GROUP BY</span> deptno;</code></pre>
  </section>

  <!-- ============ HAVING ============ -->
  <section id="having">
    <h2><span class="bar"></span>HAVING vs WHERE</h2>
    <div class="def"><b>HAVING</b> filters <b>groups</b> after grouping; <b>WHERE</b> filters <b>rows</b> before grouping.</div>
    <div class="tablewrap">
      <table class="info">
        <thead><tr><th>WHERE</th><th>HAVING</th></tr></thead>
        <tbody>
          <tr><td>Filters rows before grouping.</td><td>Filters groups after grouping.</td></tr>
          <tr><td>Used before GROUP BY.</td><td>Used after GROUP BY.</td></tr>
          <tr><td>Aggregate functions not allowed.</td><td>Aggregate functions allowed.</td></tr>
          <tr><td>Works on individual records.</td><td>Works on groups of records.</td></tr>
          <tr><td>Usable with SELECT, UPDATE, DELETE.</td><td>Mostly with SELECT + GROUP BY.</td></tr>
          <tr><td>e.g. <span class="pill">WHERE sal &gt; 2000</span></td><td>e.g. <span class="pill">HAVING AVG(sal) &gt; 2000</span></td></tr>
        </tbody>
      </table>
    </div>

    <pre><code><span class="com">-- Syntax order</span>
<span class="kw">SELECT</span> column_name, group_function
<span class="kw">FROM</span> table_name
<span class="kw">WHERE</span> &lt;row_condition&gt;
<span class="kw">GROUP BY</span> column_name
<span class="kw">HAVING</span> &lt;group_condition&gt;;</code></pre>

    <p class="q">Q &mdash; Departments whose average salary is greater than 2000.</p>
    <pre><code><span class="kw">SELECT</span> deptno, <span class="fn">AVG</span>(sal)
<span class="kw">FROM</span> emp
<span class="kw">GROUP BY</span> deptno
<span class="kw">HAVING</span> <span class="fn">AVG</span>(sal) &gt; <span class="num">2000</span>;</code></pre>

    <p class="q">Q &mdash; Count of emps in each dept where the max salary of the dept is greater than 2000.</p>
    <pre><code><span class="kw">SELECT</span> deptno, <span class="fn">COUNT</span>(*) <span class="kw">AS</span> emp_count
<span class="kw">FROM</span> emp
<span class="kw">GROUP BY</span> deptno
<span class="kw">HAVING</span> <span class="fn">MAX</span>(sal) &gt; <span class="num">2000</span>;</code></pre>

    <p class="q">Q &mdash; Display duplicate salaries.</p>
    <pre><code><span class="kw">SELECT</span> sal, <span class="fn">COUNT</span>(*)
<span class="kw">FROM</span> emp
<span class="kw">GROUP BY</span> sal
<span class="kw">HAVING</span> <span class="fn">COUNT</span>(*) &gt; <span class="num">1</span>;</code></pre>
  </section>

  <!-- ============ ORDER BY ============ -->
  <section id="orderby">
    <h2><span class="bar"></span>ORDER BY Clause</h2>
    <div class="def"><b>ORDER BY</b> arranges records in ascending (<span class="pill">ASC</span>, default) or descending (<span class="pill">DESC</span>) order. It is the <b>last</b> clause to execute.</div>
    <pre><code><span class="com">-- Full clause order</span>
<span class="kw">SELECT</span> column / group_function
<span class="kw">FROM</span> table_name
<span class="kw">WHERE</span> &lt;row_condition&gt;
<span class="kw">GROUP BY</span> column_name
<span class="kw">HAVING</span> &lt;group_condition&gt;
<span class="kw">ORDER BY</span> column_name <span class="kw">ASC</span> / <span class="kw">DESC</span>;</code></pre>

    <p class="q">Q &mdash; Emp names in descending order.</p>
    <pre><code><span class="kw">SELECT</span> ename
<span class="kw">FROM</span> emp
<span class="kw">ORDER BY</span> ename <span class="kw">DESC</span>;</code></pre>
  </section>

  <!-- ============ SUBQUERY ============ -->
  <section id="subquery">
    <h2><span class="bar"></span>Subqueries</h2>
    <div class="def">A query written inside another query is a <b>subquery</b>.</div>

    <h4>Working principle</h4>
    <ol>
      <li>There is an outer query and an inner query.</li>
      <li>The inner query executes first and produces output.</li>
      <li>That output is passed to the outer query as input.</li>
      <li>The outer query then executes and produces the final output.</li>
      <li>So the outer query depends on the inner query.</li>
    </ol>

    <p class="q">Q &mdash; Emp names earning more than 1000 and working in deptno 30.</p>
    <pre><code><span class="kw">SELECT</span> ename
<span class="kw">FROM</span> emp
<span class="kw">WHERE</span> sal &gt; <span class="num">1000</span> <span class="kw">AND</span> deptno = <span class="num">30</span>;</code></pre>

    <p class="q">Q &mdash; Emp names getting salary less than KING.</p>
    <pre><code><span class="kw">SELECT</span> ename, sal
<span class="kw">FROM</span> emp
<span class="kw">WHERE</span> sal &lt; (
    <span class="kw">SELECT</span> sal
    <span class="kw">FROM</span> emp
    <span class="kw">WHERE</span> ename = <span class="str">'KING'</span>
);</code></pre>

    <h3>Case 1 &mdash; Indirect / unknown condition</h3>
    <p class="lead">When the comparison value isn't given directly, fetch it first with a subquery.</p>

    <p class="q">Q &mdash; Emps working in the same dept as ALLEN.</p>
    <pre><code><span class="kw">SELECT</span> ename
<span class="kw">FROM</span> emp
<span class="kw">WHERE</span> deptno = (
    <span class="kw">SELECT</span> deptno
    <span class="kw">FROM</span> emp
    <span class="kw">WHERE</span> ename = <span class="str">'ALLEN'</span>
);</code></pre>

    <p class="q">Q &mdash; Emps in dept 20 hired after SMITH.</p>
    <pre><code><span class="kw">SELECT</span> ename
<span class="kw">FROM</span> emp
<span class="kw">WHERE</span> deptno = <span class="num">20</span> <span class="kw">AND</span> hiredate &gt; (
    <span class="kw">SELECT</span> hiredate
    <span class="kw">FROM</span> emp
    <span class="kw">WHERE</span> ename = <span class="str">'SMITH'</span>
);</code></pre>

    <p class="q">Q &mdash; Details of emps earning more than WARD but less than KING.</p>
    <pre><code><span class="kw">SELECT</span> *
<span class="kw">FROM</span> emp
<span class="kw">WHERE</span> sal &gt; (
    <span class="kw">SELECT</span> sal <span class="kw">FROM</span> emp <span class="kw">WHERE</span> ename = <span class="str">'WARD'</span>
)
<span class="kw">AND</span> sal &lt; (
    <span class="kw">SELECT</span> sal <span class="kw">FROM</span> emp <span class="kw">WHERE</span> ename = <span class="str">'KING'</span>
);</code></pre>

    <p class="q">Q &mdash; Emps working in the RESEARCH dept.</p>
    <pre><code><span class="kw">SELECT</span> ename
<span class="kw">FROM</span> emp
<span class="kw">WHERE</span> deptno = (
    <span class="kw">SELECT</span> deptno
    <span class="kw">FROM</span> dept
    <span class="kw">WHERE</span> dname = <span class="str">'RESEARCH'</span>
);</code></pre>

    <h3>Case 2 &mdash; Data / condition is in another table</h3>

    <p class="q">Q &mdash; Display ADAMS' department name.</p>
    <pre><code><span class="kw">SELECT</span> dname
<span class="kw">FROM</span> dept
<span class="kw">WHERE</span> deptno = (
    <span class="kw">SELECT</span> deptno
    <span class="kw">FROM</span> emp
    <span class="kw">WHERE</span> ename = <span class="str">'ADAMS'</span>
);</code></pre>

    <p class="q">Q &mdash; Details of emps getting commission and working in SALES.</p>
    <pre><code><span class="kw">SELECT</span> *
<span class="kw">FROM</span> emp
<span class="kw">WHERE</span> comm <span class="kw">IS NOT NULL</span> <span class="kw">AND</span> deptno = (
    <span class="kw">SELECT</span> deptno
    <span class="kw">FROM</span> dept
    <span class="kw">WHERE</span> dname = <span class="str">'SALES'</span>
);</code></pre>

    <p class="q">Q &mdash; Details of emps earning less than SCOTT and working in NEW YORK.</p>
    <pre><code><span class="kw">SELECT</span> *
<span class="kw">FROM</span> emp
<span class="kw">WHERE</span> sal &lt; (
    <span class="kw">SELECT</span> sal <span class="kw">FROM</span> emp <span class="kw">WHERE</span> ename = <span class="str">'SCOTT'</span>
)
<span class="kw">AND</span> deptno = (
    <span class="kw">SELECT</span> deptno <span class="kw">FROM</span> dept <span class="kw">WHERE</span> loc = <span class="str">'NEW YORK'</span>
);</code></pre>
  </section>

  <!-- ============ ALL / ANY ============ -->
  <section id="allany">
    <h2><span class="bar"></span>ALL &amp; ANY Operators</h2>
    <p class="lead">Used with a relational operator against a subquery that returns multiple values.</p>

    <h4>ALL &mdash; must satisfy against <u>every</u> value (acts like AND)</h4>
    <div class="ascii"><span style="color:var(--accent-3)">4000 &gt; ALL [2000, 3000, 8000]</span>
            T     T     F     &#9472;&#9472;&#9658;  result = FALSE</div>

    <h4>ANY &mdash; satisfy against <u>any one</u> value (acts like OR)</h4>
    <div class="ascii"><span style="color:var(--accent-3)">4000 &gt; ANY [2000, 3000, 8000]</span>
            T     T     F     &#9472;&#9472;&#9658;  result = TRUE</div>

    <p class="q">Q &mdash; Emps earning more than every MANAGER (&gt; ALL).</p>
    <pre><code><span class="kw">SELECT</span> ename
<span class="kw">FROM</span> emp
<span class="kw">WHERE</span> sal &gt; <span class="kw">ALL</span> (
    <span class="kw">SELECT</span> sal <span class="kw">FROM</span> emp <span class="kw">WHERE</span> job = <span class="str">'MANAGER'</span>
);</code></pre>

    <p class="q">Q &mdash; Emps earning more than any one MANAGER (&gt; ANY).</p>
    <pre><code><span class="kw">SELECT</span> ename
<span class="kw">FROM</span> emp
<span class="kw">WHERE</span> sal &gt; <span class="kw">ANY</span> (
    <span class="kw">SELECT</span> sal <span class="kw">FROM</span> emp <span class="kw">WHERE</span> job = <span class="str">'MANAGER'</span>
);</code></pre>

    <h3>Types of subqueries</h3>
    <ul>
      <li><b>Single-row subquery</b> &mdash; returns only one value (use =, &gt;, &lt;).</li>
      <li><b>Multi-row subquery</b> &mdash; returns multiple values (use IN, ANY, ALL).</li>
    </ul>

    <p class="q">Q &mdash; Details of emps working in NEW YORK (single-row).</p>
    <pre><code><span class="kw">SELECT</span> *
<span class="kw">FROM</span> emp
<span class="kw">WHERE</span> deptno = (
    <span class="kw">SELECT</span> deptno <span class="kw">FROM</span> dept <span class="kw">WHERE</span> loc = <span class="str">'NEW YORK'</span>
);</code></pre>

    <p class="q">Q &mdash; Second maximum salary.</p>
    <pre><code><span class="kw">SELECT</span> <span class="fn">MAX</span>(sal)
<span class="kw">FROM</span> emp
<span class="kw">WHERE</span> sal &lt; (
    <span class="kw">SELECT</span> <span class="fn">MAX</span>(sal) <span class="kw">FROM</span> emp
);</code></pre>

    <p class="q">Q &mdash; Third maximum salary.</p>
    <pre><code><span class="kw">SELECT</span> <span class="fn">MAX</span>(sal)
<span class="kw">FROM</span> emp
<span class="kw">WHERE</span> sal &lt; (
    <span class="kw">SELECT</span> <span class="fn">MAX</span>(sal)
    <span class="kw">FROM</span> emp
    <span class="kw">WHERE</span> sal &lt; (
        <span class="kw">SELECT</span> <span class="fn">MAX</span>(sal) <span class="kw">FROM</span> emp
    )
);</code></pre>
  </section>

  <!-- ============ NESTED ============ -->
  <section id="nested">
    <h2><span class="bar"></span>Nested Subquery</h2>
    <p>A subquery written inside another subquery is a <b>nested subquery</b>. You can nest up to <b>255</b> levels.</p>

    <p class="q">Q &mdash; 4th minimum salary.</p>
    <pre><code><span class="kw">SELECT</span> <span class="fn">MIN</span>(sal)
<span class="kw">FROM</span> emp
<span class="kw">WHERE</span> sal &gt; (
    <span class="kw">SELECT</span> <span class="fn">MIN</span>(sal)
    <span class="kw">FROM</span> emp
    <span class="kw">WHERE</span> sal &gt; (
        <span class="kw">SELECT</span> <span class="fn">MIN</span>(sal)
        <span class="kw">FROM</span> emp
        <span class="kw">WHERE</span> sal &gt; (
            <span class="kw">SELECT</span> <span class="fn">MIN</span>(sal) <span class="kw">FROM</span> emp
        )
    )
);</code></pre>

    <p class="q">Q &mdash; Emp name earning the 4th maximum salary.</p>
    <pre><code><span class="kw">SELECT</span> ename, sal
<span class="kw">FROM</span> emp
<span class="kw">WHERE</span> sal = (
    <span class="kw">SELECT</span> <span class="fn">MAX</span>(sal)
    <span class="kw">FROM</span> emp
    <span class="kw">WHERE</span> sal &lt; (
        <span class="kw">SELECT</span> <span class="fn">MAX</span>(sal)
        <span class="kw">FROM</span> emp
        <span class="kw">WHERE</span> sal &lt; (
            <span class="kw">SELECT</span> <span class="fn">MAX</span>(sal)
            <span class="kw">FROM</span> emp
            <span class="kw">WHERE</span> sal &lt; (
                <span class="kw">SELECT</span> <span class="fn">MAX</span>(sal) <span class="kw">FROM</span> emp
            )
        )
    )
);</code></pre>

    <p class="q">Q &mdash; Dept name of the 3rd-hired employee.</p>
    <pre><code><span class="kw">SELECT</span> dname
<span class="kw">FROM</span> dept
<span class="kw">WHERE</span> deptno = (
    <span class="kw">SELECT</span> deptno
    <span class="kw">FROM</span> emp
    <span class="kw">WHERE</span> hiredate = (
        <span class="kw">SELECT</span> <span class="fn">MIN</span>(hiredate)
        <span class="kw">FROM</span> emp
        <span class="kw">WHERE</span> hiredate &gt; (
            <span class="kw">SELECT</span> <span class="fn">MIN</span>(hiredate)
            <span class="kw">FROM</span> emp
            <span class="kw">WHERE</span> hiredate &gt; (
                <span class="kw">SELECT</span> <span class="fn">MIN</span>(hiredate) <span class="kw">FROM</span> emp
            )
        )
    )
);</code></pre>

    <h3>Manager-chain examples</h3>

    <p class="q">Q &mdash; Emps who have a reporting manager.</p>
    <pre><code><span class="kw">SELECT</span> ename
<span class="kw">FROM</span> emp
<span class="kw">WHERE</span> mgr <span class="kw">IS NOT NULL</span>;</code></pre>

    <p class="q">Q &mdash; Display SMITH's manager.</p>
    <pre><code><span class="kw">SELECT</span> ename
<span class="kw">FROM</span> emp
<span class="kw">WHERE</span> empno = (
    <span class="kw">SELECT</span> mgr <span class="kw">FROM</span> emp <span class="kw">WHERE</span> ename = <span class="str">'SMITH'</span>
);</code></pre>

    <p class="q">Q &mdash; SMITH's manager's manager name.</p>
    <pre><code><span class="kw">SELECT</span> ename
<span class="kw">FROM</span> emp
<span class="kw">WHERE</span> empno = (
    <span class="kw">SELECT</span> mgr
    <span class="kw">FROM</span> emp
    <span class="kw">WHERE</span> empno = (
        <span class="kw">SELECT</span> mgr <span class="kw">FROM</span> emp <span class="kw">WHERE</span> ename = <span class="str">'SMITH'</span>
    )
);</code></pre>

    <p class="q">Q &mdash; Dept name of SMITH's department.</p>
    <pre><code><span class="kw">SELECT</span> dname
<span class="kw">FROM</span> dept
<span class="kw">WHERE</span> deptno = (
    <span class="kw">SELECT</span> deptno <span class="kw">FROM</span> emp <span class="kw">WHERE</span> ename = <span class="str">'SMITH'</span>
);</code></pre>
  </section>

  <!-- ============ JOINS ============ -->
  <section id="joins">
    <h2><span class="bar"></span>Joins</h2>
    <p>A join fetches/retrieves data from <b>two or more tables at the same time</b>.</p>
    <ul>
      <li>Cross Join</li>
      <li>Inner Join</li>
      <li>Outer Join &rarr; Left / Right / Full</li>
      <li>Natural Join</li>
      <li>Self Join</li>
      <li>Equi &amp; Non-Equi Join</li>
    </ul>

    <!-- CROSS -->
    <h3>1) Cross Join</h3>
    <p>Each record of table-1 merges with <b>every</b> record of table-2 (Cartesian product).</p>
    <pre><code><span class="com">-- Syntax</span>
<span class="kw">SELECT</span> column_name / exp
<span class="kw">FROM</span> table1 <span class="kw">CROSS JOIN</span> table2;

<span class="com">-- Example</span>
<span class="kw">SELECT</span> ename, dname
<span class="kw">FROM</span> emp <span class="kw">CROSS JOIN</span> dept;</code></pre>
    <div class="note"><b>Result size:</b> 14 emps &times; 4 depts = <b>56 rows</b>. Sample shown &mdash; every ename pairs with all 4 dnames.</div>
    <div class="tablewrap">
      <table>
        <caption>CROSS JOIN &mdash; sample of 56 rows</caption>
        <thead><tr><th>ename</th><th>dname</th></tr></thead>
        <tbody>
          <tr><td>SMITH</td><td>ACCOUNTING</td></tr>
          <tr><td>SMITH</td><td>RESEARCH</td></tr>
          <tr><td>SMITH</td><td>SALES</td></tr>
          <tr><td>SMITH</td><td>OPERATIONS</td></tr>
          <tr><td>ALLEN</td><td>ACCOUNTING</td></tr>
          <tr><td colspan="2" style="color:var(--com);font-style:italic;text-align:center;">&hellip; repeats for every employee (56 rows total)</td></tr>
        </tbody>
      </table>
    </div>

    <!-- INNER -->
    <h3>2) Inner Join</h3>
    <p>Returns <b>only matching</b> records based on the join condition.</p>
    <pre><code><span class="com">-- Syntax</span>
<span class="kw">SELECT</span> column_name / exp
<span class="kw">FROM</span> table1 <span class="kw">INNER JOIN</span> table2
<span class="kw">ON</span> &lt;join_condition&gt;;

<span class="com">-- Join condition:  emp.deptno = dept.deptno</span>
<span class="kw">SELECT</span> ename, dname
<span class="kw">FROM</span> dept d
<span class="kw">INNER JOIN</span> emp e
<span class="kw">ON</span> d.deptno = e.deptno;</code></pre>
    <div class="note"><b>Why dept 40 disappears:</b> OPERATIONS (40) has no employees, so no match. Result = <b>14 rows</b>.</div>
    <div class="tablewrap">
      <table>
        <caption>INNER JOIN emp &#10781; dept &mdash; 14 rows</caption>
        <thead><tr><th>ename</th><th>deptno</th><th>dname</th></tr></thead>
        <tbody>
          <tr><td>SMITH</td><td>20</td><td>RESEARCH</td></tr>
          <tr><td>ALLEN</td><td>30</td><td>SALES</td></tr>
          <tr><td>WARD</td><td>30</td><td>SALES</td></tr>
          <tr><td>JONES</td><td>20</td><td>RESEARCH</td></tr>
          <tr><td>MARTIN</td><td>30</td><td>SALES</td></tr>
          <tr><td>BLAKE</td><td>30</td><td>SALES</td></tr>
          <tr><td>CLARK</td><td>10</td><td>ACCOUNTING</td></tr>
          <tr><td>SCOTT</td><td>20</td><td>RESEARCH</td></tr>
          <tr><td>KING</td><td>10</td><td>ACCOUNTING</td></tr>
          <tr><td>TURNER</td><td>30</td><td>SALES</td></tr>
          <tr><td>ADAMS</td><td>20</td><td>RESEARCH</td></tr>
          <tr><td>JAMES</td><td>30</td><td>SALES</td></tr>
          <tr><td>FORD</td><td>20</td><td>RESEARCH</td></tr>
          <tr><td>MILLER</td><td>10</td><td>ACCOUNTING</td></tr>
        </tbody>
      </table>
    </div>

    <p class="q">Q &mdash; ename &amp; dname of those working as MANAGER.</p>
    <pre><code><span class="kw">SELECT</span> ename, dname
<span class="kw">FROM</span> dept d
<span class="kw">INNER JOIN</span> emp e
<span class="kw">ON</span> d.deptno = e.deptno
<span class="kw">WHERE</span> job = <span class="str">'MANAGER'</span>;</code></pre>
    <div class="tablewrap">
      <table>
        <caption>Result &mdash; MANAGERs only</caption>
        <thead><tr><th>ename</th><th>dname</th></tr></thead>
        <tbody>
          <tr><td>JONES</td><td>RESEARCH</td></tr>
          <tr><td>BLAKE</td><td>SALES</td></tr>
          <tr><td>CLARK</td><td>ACCOUNTING</td></tr>
        </tbody>
      </table>
    </div>

    <p class="q">Q &mdash; ename, dname &amp; deptno of those in deptno 20.</p>
    <pre><code><span class="kw">SELECT</span> ename, dname, e.deptno
<span class="kw">FROM</span> dept d
<span class="kw">INNER JOIN</span> emp e
<span class="kw">ON</span> d.deptno = e.deptno
<span class="kw">WHERE</span> e.deptno = <span class="num">20</span>;</code></pre>
    <div class="tablewrap">
      <table>
        <caption>Result &mdash; deptno 20</caption>
        <thead><tr><th>ename</th><th>dname</th><th>deptno</th></tr></thead>
        <tbody>
          <tr><td>SMITH</td><td>RESEARCH</td><td>20</td></tr>
          <tr><td>JONES</td><td>RESEARCH</td><td>20</td></tr>
          <tr><td>SCOTT</td><td>RESEARCH</td><td>20</td></tr>
          <tr><td>ADAMS</td><td>RESEARCH</td><td>20</td></tr>
          <tr><td>FORD</td><td>RESEARCH</td><td>20</td></tr>
        </tbody>
      </table>
    </div>

    <!-- OUTER -->
    <h3>3) Outer Join</h3>
    <p>Retrieves matching <b>and</b> unmatched records from one or both tables. Three types: Left, Right, Full.</p>

    <h4>Left Outer Join</h4>
    <p>Unmatched records from the <b>left</b> table + matching records from both.</p>
    <pre><code><span class="com">-- Syntax</span>
<span class="kw">SELECT</span> column_name / exp
<span class="kw">FROM</span> table1 <span class="kw">LEFT OUTER JOIN</span> table2
<span class="kw">ON</span> table1.col = table2.col;

<span class="com">-- Emp names NOT working in any department</span>
<span class="kw">SELECT</span> ename
<span class="kw">FROM</span> emp e
<span class="kw">LEFT OUTER JOIN</span> dept d
<span class="kw">ON</span> e.deptno = d.deptno
<span class="kw">WHERE</span> d.deptno <span class="kw">IS NULL</span>;</code></pre>
    <div class="note"><b>Left table = EMP.</b> Every employee has a valid deptno, so all 14 appear with no extra NULL rows. The illustrative row shows what an unmatched employee <em>would</em> look like.</div>
    <div class="tablewrap">
      <table>
        <caption>LEFT OUTER JOIN &mdash; all EMP rows kept</caption>
        <thead><tr><th>ename</th><th>dname</th></tr></thead>
        <tbody>
          <tr><td>SMITH</td><td>RESEARCH</td></tr>
          <tr><td>ALLEN</td><td>SALES</td></tr>
          <tr><td>WARD</td><td>SALES</td></tr>
          <tr><td>JONES</td><td>RESEARCH</td></tr>
          <tr><td>MARTIN</td><td>SALES</td></tr>
          <tr><td>BLAKE</td><td>SALES</td></tr>
          <tr><td>CLARK</td><td>ACCOUNTING</td></tr>
          <tr><td>SCOTT</td><td>RESEARCH</td></tr>
          <tr><td>KING</td><td>ACCOUNTING</td></tr>
          <tr><td>TURNER</td><td>SALES</td></tr>
          <tr><td>ADAMS</td><td>RESEARCH</td></tr>
          <tr><td>JAMES</td><td>SALES</td></tr>
          <tr><td>FORD</td><td>RESEARCH</td></tr>
          <tr><td>MILLER</td><td>ACCOUNTING</td></tr>
          <tr class="hl-b"><td>(emp with no dept)</td><td class="null">NULL &larr; left-only example</td></tr>
        </tbody>
      </table>
    </div>

    <h4>Right Outer Join</h4>
    <p>Unmatched records from the <b>right</b> table + matching records from both.</p>
    <pre><code><span class="com">-- Departments in which no employee is working</span>
<span class="kw">SELECT</span> dname
<span class="kw">FROM</span> emp e
<span class="kw">RIGHT OUTER JOIN</span> dept d
<span class="kw">ON</span> e.deptno = d.deptno
<span class="kw">WHERE</span> e.empno <span class="kw">IS NULL</span>;</code></pre>
    <div class="note"><b>Right table = DEPT.</b> OPERATIONS (40) has no employees but is still kept &mdash; its ename is <b>NULL</b>. Result = 14 matches + 1 unmatched dept = <b>15 rows</b>.</div>
    <div class="tablewrap">
      <table>
        <caption>RIGHT OUTER JOIN &mdash; all DEPT rows kept</caption>
        <thead><tr><th>ename</th><th>dname</th></tr></thead>
        <tbody>
          <tr><td>CLARK</td><td>ACCOUNTING</td></tr>
          <tr><td>KING</td><td>ACCOUNTING</td></tr>
          <tr><td>MILLER</td><td>ACCOUNTING</td></tr>
          <tr><td>SMITH</td><td>RESEARCH</td></tr>
          <tr><td>JONES</td><td>RESEARCH</td></tr>
          <tr><td>SCOTT</td><td>RESEARCH</td></tr>
          <tr><td>ADAMS</td><td>RESEARCH</td></tr>
          <tr><td>FORD</td><td>RESEARCH</td></tr>
          <tr><td>ALLEN</td><td>SALES</td></tr>
          <tr><td>WARD</td><td>SALES</td></tr>
          <tr><td>MARTIN</td><td>SALES</td></tr>
          <tr><td>BLAKE</td><td>SALES</td></tr>
          <tr><td>TURNER</td><td>SALES</td></tr>
          <tr><td>JAMES</td><td>SALES</td></tr>
          <tr class="hl"><td class="null">NULL</td><td>OPERATIONS &larr; right-only (no emps)</td></tr>
        </tbody>
      </table>
    </div>

    <h4>Full Outer Join</h4>
    <p>All matching <b>and</b> unmatched records from both tables.</p>
    <pre><code><span class="com">-- Oracle / SQL Server</span>
<span class="kw">SELECT</span> ename, dname
<span class="kw">FROM</span> emp
<span class="kw">FULL OUTER JOIN</span> dept
<span class="kw">ON</span> emp.deptno = dept.deptno;

<span class="com">-- MySQL has no FULL OUTER JOIN -- emulate with UNION:</span>
<span class="kw">SELECT</span> ename, dname <span class="kw">FROM</span> emp
<span class="kw">LEFT JOIN</span> dept <span class="kw">ON</span> emp.deptno = dept.deptno
<span class="kw">UNION</span>
<span class="kw">SELECT</span> ename, dname <span class="kw">FROM</span> emp
<span class="kw">RIGHT JOIN</span> dept <span class="kw">ON</span> emp.deptno = dept.deptno;</code></pre>
    <div class="note">All 14 employees matched to their dept <b>plus</b> the unmatched OPERATIONS row with a NULL ename. Result = <b>15 rows</b>.</div>
    <div class="tablewrap">
      <table>
        <caption>FULL OUTER JOIN &mdash; both sides kept</caption>
        <thead><tr><th>ename</th><th>dname</th></tr></thead>
        <tbody>
          <tr><td>SMITH</td><td>RESEARCH</td></tr>
          <tr><td>ALLEN</td><td>SALES</td></tr>
          <tr><td>WARD</td><td>SALES</td></tr>
          <tr><td>JONES</td><td>RESEARCH</td></tr>
          <tr><td>MARTIN</td><td>SALES</td></tr>
          <tr><td>BLAKE</td><td>SALES</td></tr>
          <tr><td>CLARK</td><td>ACCOUNTING</td></tr>
          <tr><td>SCOTT</td><td>RESEARCH</td></tr>
          <tr><td>KING</td><td>ACCOUNTING</td></tr>
          <tr><td>TURNER</td><td>SALES</td></tr>
          <tr><td>ADAMS</td><td>RESEARCH</td></tr>
          <tr><td>JAMES</td><td>SALES</td></tr>
          <tr><td>FORD</td><td>RESEARCH</td></tr>
          <tr><td>MILLER</td><td>ACCOUNTING</td></tr>
          <tr class="hl"><td class="null">NULL</td><td>OPERATIONS &larr; unmatched dept</td></tr>
        </tbody>
      </table>
    </div>

    <!-- NATURAL -->
    <h3>4) Natural Join</h3>
    <p>Automatically joins two tables on columns having the <b>same name and datatype</b> (here, <span class="pill">deptno</span>). No ON clause needed.</p>
    <pre><code><span class="kw">SELECT</span> ename, dname
<span class="kw">FROM</span> emp
<span class="kw">NATURAL JOIN</span> dept;</code></pre>
    <div class="note">Produces the same 14 matching rows as the inner join, but the common <span class="pill">deptno</span> column appears only once in the output.</div>

    <!-- SELF -->
    <h3>5) Self Join</h3>
    <p>A table joins with <b>itself</b> &mdash; mainly to resolve employee&ndash;manager relationships, where <span class="pill">e1.mgr</span> points to <span class="pill">e2.empno</span>.</p>
    <pre><code><span class="com">-- Q: employee name and their manager name</span>
<span class="kw">SELECT</span> e1.ename <span class="kw">AS</span> employee,
       e2.ename <span class="kw">AS</span> manager
<span class="kw">FROM</span> emp e1
<span class="kw">INNER JOIN</span> emp e2
<span class="kw">ON</span> e1.mgr = e2.empno;</code></pre>
    <div class="note"><b>How it reads:</b> alias <span class="pill">e1</span> = employee side, <span class="pill">e2</span> = manager side. KING has no manager (mgr = NULL) so he is excluded by the inner self join. Result = <b>13 rows</b>.</div>
    <div class="tablewrap">
      <table>
        <caption>SELF JOIN &mdash; employee &rarr; manager</caption>
        <thead><tr><th>employee</th><th>e1.mgr</th><th>manager</th></tr></thead>
        <tbody>
          <tr><td>SMITH</td><td>7902</td><td>FORD</td></tr>
          <tr><td>ALLEN</td><td>7698</td><td>BLAKE</td></tr>
          <tr><td>WARD</td><td>7698</td><td>BLAKE</td></tr>
          <tr><td>JONES</td><td>7839</td><td>KING</td></tr>
          <tr><td>MARTIN</td><td>7698</td><td>BLAKE</td></tr>
          <tr><td>BLAKE</td><td>7839</td><td>KING</td></tr>
          <tr><td>CLARK</td><td>7839</td><td>KING</td></tr>
          <tr><td>SCOTT</td><td>7566</td><td>JONES</td></tr>
          <tr><td>TURNER</td><td>7698</td><td>BLAKE</td></tr>
          <tr><td>ADAMS</td><td>7788</td><td>SCOTT</td></tr>
          <tr><td>JAMES</td><td>7698</td><td>BLAKE</td></tr>
          <tr><td>FORD</td><td>7566</td><td>JONES</td></tr>
          <tr><td>MILLER</td><td>7782</td><td>CLARK</td></tr>
        </tbody>
      </table>
    </div>

    <p class="q">Q &mdash; Display SMITH's manager name (self join).</p>
    <pre><code><span class="kw">SELECT</span> e2.ename
<span class="kw">FROM</span> emp e1
<span class="kw">INNER JOIN</span> emp e2
<span class="kw">ON</span> e1.mgr = e2.empno
<span class="kw">WHERE</span> e1.ename = <span class="str">'SMITH'</span>;</code></pre>
    <div class="note"><b>Tip:</b> to include KING (no manager), change the inner join to a <span class="pill">LEFT OUTER JOIN</span> &mdash; his manager column then returns NULL.</div>

    <!-- EQUI / NON-EQUI -->
    <h3>6) Equi &amp; Non-Equi Join</h3>
    <div class="grid2">
      <div class="def"><b>Equi Join</b> &mdash; join condition uses the <b>=</b> operator.</div>
      <div class="def"><b>Non-Equi Join</b> &mdash; uses <b>&lt;, &gt;, &lt;=, &gt;=, BETWEEN</b> instead of =.</div>
    </div>
    <pre><code><span class="com">-- Equi Join (old comma syntax + WHERE)</span>
<span class="kw">SELECT</span> ename, dname
<span class="kw">FROM</span> emp, dept
<span class="kw">WHERE</span> emp.deptno = dept.deptno;

<span class="com">-- Non-Equi Join (e.g. salary grade lookup)</span>
<span class="kw">SELECT</span> ename, grade
<span class="kw">FROM</span> emp, salgrade
<span class="kw">WHERE</span> sal <span class="kw">BETWEEN</span> losal <span class="kw">AND</span> hisal;</code></pre>
  </section>

  <!-- ============ VIVA ============ -->
  <section id="viva">
    <h2><span class="bar"></span>Viva / Exam Quick Points</h2>
    <div class="tablewrap">
      <table class="info">
        <thead><tr><th>Join</th><th>Returns</th></tr></thead>
        <tbody>
          <tr><td>Cross Join</td><td>Every record paired with every record (Cartesian product).</td></tr>
          <tr><td>Inner Join</td><td>Only matching records.</td></tr>
          <tr><td>Left Outer Join</td><td>All left + matching right.</td></tr>
          <tr><td>Right Outer Join</td><td>All right + matching left.</td></tr>
          <tr><td>Full Outer Join</td><td>All records from both tables.</td></tr>
          <tr><td>Natural Join</td><td>Automatic join on common column names.</td></tr>
          <tr><td>Self Join</td><td>Table joins with itself.</td></tr>
          <tr><td>Equi Join</td><td>Uses the = operator.</td></tr>
          <tr><td>Non-Equi Join</td><td>Uses &lt;, &gt;, &lt;=, &gt;=, BETWEEN.</td></tr>
        </tbody>
      </table>
    </div>
  </section>

  <hr>
  <p style="text-align:center;color:var(--com);font-size:13px;">End of notes &mdash; SQL Complete Reference &middot; EMP / DEPT dataset</p>

</div>
`;

function OracleSQLNotes() {
  const navigate = useNavigate();
  return (
    <div className="sqlnotes-root">
      <button
        onClick={() => navigate('/sheet/DBMS')}
        style={{
          position: 'fixed', top: 16, left: 16, zIndex: 50,
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'rgba(15,22,32,0.92)', color: '#e6edf3',
          border: '1px solid #1d2836', borderRadius: 10,
          padding: '8px 14px', fontSize: 13, fontWeight: 600,
          cursor: 'pointer', backdropFilter: 'blur(6px)',
        }}
      >
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to DBMS
      </button>
      <div dangerouslySetInnerHTML={{ __html: NOTES_HTML }} />
    </div>
  );
}

export default OracleSQLNotes;
