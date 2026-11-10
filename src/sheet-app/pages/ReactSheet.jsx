import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import ThemeToggle from '../components/ThemeToggle';

const revisionSections = [
  {
    "title": "1. React Basics (1-20)",
    "questions": [
      {
        "q": "What is React?",
        "a": "React is a JavaScript library used to build fast, interactive, and reusable user interfaces using components."
      },
      {
        "q": "Who developed React?",
        "a": "React was developed by Facebook (now Meta) and released publicly in 2013."
      },
      {
        "q": "What is an SPA?",
        "a": "SPA stands for Single Page Application. It loads a single HTML page and updates content dynamically without reloading the entire page."
      },
      {
        "q": "What is a component?",
        "a": "A component is a reusable, independent piece of UI. For example, Navbar, Footer, Login Form, and Cards."
      },
      {
        "q": "What are the types of components in React?",
        "a": "Traditionally, there are two types: Functional Components Class Components Modern React primarily uses functional components."
      },
      {
        "q": "What is a functional component?",
        "a": "A functional component is a JavaScript function that returns JSX to display UI."
      },
      {
        "q": "What is JSX?",
        "a": "JSX stands for JavaScript XML. It allows us to write HTML-like syntax inside JavaScript."
      },
      {
        "q": "Why do we use JSX?",
        "a": "JSX makes UI code easier to read, write, and maintain by combining JavaScript logic with HTML-like syntax."
      },
      {
        "q": "What are props in React?",
        "a": "Props are read-only data passed from a parent component to a child component."
      },
      {
        "q": "What is state in React?",
        "a": "State is data managed inside a component. When state changes, React re-renders the component when necessary."
      },
      {
        "q": "Difference between props and state?",
        "a": "Props	State Passed from parent	Managed by component Read-only	Updated using setters or dispatch Used to share data	Used to manage dynamic data"
      },
      {
        "q": "What is the Virtual DOM?",
        "a": "Virtual DOM is a lightweight, in-memory representation of the actual DOM that React uses to calculate UI updates."
      },
      {
        "q": "Why does React use Virtual DOM?",
        "a": "It helps React efficiently calculate which parts of the UI need updating instead of manually updating the entire DOM."
      },
      {
        "q": "What is a key in React?",
        "a": "A key is a unique identifier given to list elements so React can identify which items were added, removed, or updated. users.map(user => <p key={user.id}>{user.name}</p>)"
      },
      {
        "q": "What is React Fragment?",
        "a": "Fragment allows us to group multiple elements without adding an extra DOM element."
      },
      {
        "q": "What is event handling in React?",
        "a": "Event handling allows us to respond to user actions such as clicks, typing, and form submissions."
      },
      {
        "q": "What is conditional rendering?",
        "a": "Conditional rendering means displaying UI elements based on a condition."
      },
      {
        "q": "How do you render lists in React?",
        "a": "We use JavaScript methods like map() to render multiple elements."
      },
      {
        "q": "What is a controlled component?",
        "a": "A controlled component is a form element whose value is managed by React state."
      },
      {
        "q": "What is an uncontrolled component?",
        "a": "An uncontrolled component manages its own value through the DOM. We access its value using useRef."
      }
    ]
  },
  {
    "title": "2. React Hooks (21-45)",
    "questions": [
      {
        "q": "What are Hooks in React?",
        "a": "Hooks are special functions that allow functional components to use React features like state, context, refs, and lifecycle-related functionality."
      },
      {
        "q": "What is useState?",
        "a": "useState is a React Hook used to create and manage state in functional components."
      },
      {
        "q": "What is the syntax of useState?",
        "a": "Here, count is the state variable, and setCount updates it."
      },
      {
        "q": "What is useEffect?",
        "a": "useEffect is used to synchronize a component with external systems, such as API calls, subscriptions, and timers."
      },
      {
        "q": "When does useEffect run?",
        "a": "It depends on the dependency array: No array: After every committed render. Empty array []: After the initial mount. [value]: After mounting and when value changes."
      },
      {
        "q": "What is a dependency array?",
        "a": "A dependency array tells React when an effect needs to run again based on changes in specified values."
      },
      {
        "q": "What happens when we pass an empty dependency array?",
        "a": "The effect runs after the initial mount. In development StrictMode, React may run an additional setup and cleanup cycle."
      },
      {
        "q": "What is a cleanup function?",
        "a": "A cleanup function is returned from useEffect to remove subscriptions, clear timers, or clean up other external resources. console.log(\"Running\"); }, 1000); }, []);"
      },
      {
        "q": "What is useContext?",
        "a": "useContext allows components to access shared data without passing props through every intermediate component."
      },
      {
        "q": "What is useRef?",
        "a": "useRef stores a mutable value that persists between renders without causing a re-render when updated. It can also access DOM elements."
      },
      {
        "q": "What is useMemo?",
        "a": "useMemo caches the result of an expensive calculation between renders until its dependencies change."
      },
      {
        "q": "What is useCallback?",
        "a": "useCallback caches a function reference between renders until its dependencies change. console.log(\"Clicked\"); }, []);"
      },
      {
        "q": "What is a custom Hook?",
        "a": "A custom Hook is a reusable JavaScript function that starts with use and can use other Hooks. Example: useFetch(), useAuth()."
      },
      {
        "q": "What are the Rules of Hooks?",
        "a": ""
      },
      {
        "q": "Why do we use Hooks?",
        "a": "Hooks allow functional components to manage state, handle side effects, reuse logic, and access React features without class components."
      },
      {
        "q": "Are state updates asynchronous?",
        "a": "State updates are scheduled by React and are not immediately reflected in the current render. React may batch multiple updates together."
      },
      {
        "q": "What is batching in React?",
        "a": "Batching means React groups multiple state updates into fewer renders to improve performance."
      },
      {
        "q": "What causes a re-render in React?",
        "a": "Common reasons include: State changes. Parent component re-renders. Context value changes. External store updates."
      },
      {
        "q": "What causes an infinite loop in useEffect?",
        "a": "An infinite loop can happen when an effect updates state and that update changes one of its dependencies repeatedly."
      },
      {
        "q": "Can we use multiple useEffect Hooks?",
        "a": "Yes. We can use multiple useEffect Hooks to separate different side effects and make code easier to maintain."
      },
      {
        "q": "What is useLayoutEffect?",
        "a": "useLayoutEffect runs after DOM updates but before the browser paints the screen. It is useful for measuring DOM elements and applying layout-related changes."
      },
      {
        "q": "Difference between useEffect and useLayoutEffect?",
        "a": "useEffect	useLayoutEffect Generally runs after browser paint	Runs before browser paint Does not block painting	Can block painting API calls and subscriptions	DOM measurement and layout"
      },
      {
        "q": "What is useReducer?",
        "a": "useReducer manages complex state logic using a reducer function and dispatch actions."
      },
      {
        "q": "What is dispatch?",
        "a": "Dispatch is a function used to send an action to a reducer to update the state."
      },
      {
        "q": "What is initial state?",
        "a": "Initial state is the starting value of a component's state or reducer state."
      }
    ]
  },
  {
    "title": "3. React Routing and Forms (46-65)",
    "questions": [
      {
        "q": "What is React Router?",
        "a": "React Router is a library used to manage navigation and routing between different pages in a React application."
      },
      {
        "q": "What is BrowserRouter?",
        "a": "BrowserRouter uses the browser's History API to manage navigation without full-page reloads."
      },
      {
        "q": "What is a Route?",
        "a": "A Route defines which component should render for a particular URL path."
      },
      {
        "q": "What is Link in React Router?",
        "a": "Link is used to navigate between routes without refreshing the entire page."
      },
      {
        "q": "What is useNavigate?",
        "a": "useNavigate is a React Router Hook used for programmatic navigation."
      },
      {
        "q": "What is dynamic routing?",
        "a": "Dynamic routing allows routes to accept dynamic parameters."
      },
      {
        "q": "How are forms handled in React?",
        "a": "Forms are commonly handled using controlled components with useState, onChange, and onSubmit."
      },
      {
        "q": "What does onChange do?",
        "a": "onChange handles changes in form elements, such as typing in an input field."
      },
      {
        "q": "What does onSubmit do?",
        "a": "onSubmit handles form submission and executes the specified function."
      },
      {
        "q": "Why do we use preventDefault()?",
        "a": "preventDefault() prevents the browser's default form submission behavior, such as reloading the page. e.preventDefault();"
      },
      {
        "q": "What is form validation?",
        "a": "Form validation checks whether user input meets required conditions, such as valid email, password length, and required fields."
      },
      {
        "q": "What is Formik?",
        "a": "Formik is a React library that simplifies form state management, validation, and submission."
      },
      {
        "q": "What is React Hook Form?",
        "a": "React Hook Form is a library that manages forms efficiently with minimal re-renders and simpler validation."
      },
      {
        "q": "How do you handle form errors in React?",
        "a": "We store validation errors in state or use libraries like React Hook Form with Yup or Zod to display error messages."
      },
      {
        "q": "What is lifting state up?",
        "a": "Lifting state up means moving shared state to the nearest common parent component so multiple child components can access and update it."
      },
      {
        "q": "What is prop drilling?",
        "a": "Prop drilling means passing data through multiple intermediate components to reach a deeply nested child component."
      },
      {
        "q": "How can we avoid prop drilling?",
        "a": "We can avoid prop drilling using Context API, Redux, or other state management solutions."
      },
      {
        "q": "What are nested routes?",
        "a": "Nested routes are routes defined inside another route, allowing shared layouts and parent-child page structures."
      },
      {
        "q": "How do you redirect in React Router?",
        "a": "We can use useNavigate() for programmatic navigation or the Navigate component for declarative redirects."
      },
      {
        "q": "What is lazy loading in React?",
        "a": "Lazy loading loads components only when they are needed, reducing the initial JavaScript bundle size."
      }
    ]
  },
  {
    "title": "4. Advanced React (66-85)",
    "questions": [
      {
        "q": "What is Redux?",
        "a": "Redux is a state management library used to manage shared application state in a predictable way."
      },
      {
        "q": "What is a Redux Store?",
        "a": "A Redux Store is a centralized place that holds the application's global state."
      },
      {
        "q": "What is an Action in Redux?",
        "a": "An action is a plain JavaScript object that describes what happened in the application."
      },
      {
        "q": "What is a Reducer?",
        "a": "A reducer is a pure function that takes the current state and an action and returns the next state."
      },
      {
        "q": "What does dispatch do in Redux?",
        "a": "Dispatch sends an action to the Redux store so the reducer can calculate the next state."
      },
      {
        "q": "What is Redux Middleware?",
        "a": "Middleware allows us to handle additional logic between dispatching an action and reaching the reducer, such as API calls and logging."
      },
      {
        "q": "Difference between Context API and Redux?",
        "a": "Context API	Redux Built into React	External library Good for simple shared state	Suitable for complex global state Less setup	More structured Basic state sharing	Advanced state management tools"
      },
      {
        "q": "What is memoization?",
        "a": "Memoization is an optimization technique that stores previous results to avoid unnecessary recalculations."
      },
      {
        "q": "What is React.memo?",
        "a": "React.memo is a higher-order component that skips re-rendering a component when its props are unchanged (using shallow comparison by default). export default React.memo(User);"
      },
      {
        "q": "What is code splitting?",
        "a": "Code splitting divides a large JavaScript bundle into smaller chunks that can be loaded when required."
      },
      {
        "q": "What is Suspense?",
        "a": "Suspense displays fallback UI, such as a loading message, while waiting for supported content like a lazy-loaded component."
      },
      {
        "q": "What is an Error Boundary?",
        "a": "An Error Boundary catches rendering errors in its child component tree and displays fallback UI instead of crashing the entire application. It is generally implemented using class components."
      },
      {
        "q": "What is StrictMode?",
        "a": "StrictMode adds development-only checks and may run logic extra times to reveal unsafe side effects. It does not affect production output."
      },
      {
        "q": "What are Portals in React?",
        "a": "Portals allow us to render components outside their parent DOM hierarchy while keeping them within the same React tree. Example: Modals and tooltips. createPortal(<Modal />, document.getElementById(\"modal-root\"));"
      },
      {
        "q": "What are Refs in React?",
        "a": "Refs provide access to DOM elements or mutable values without triggering a re-render."
      },
      {
        "q": "What is forwardRef?",
        "a": "forwardRef is a React API used to pass a ref from a parent component to a child component. In React 19, ref can also be passed as a regular prop."
      },
      {
        "q": "What is a Higher-Order Component (HOC)?",
        "a": "A Higher-Order Component is a function that takes a component and returns an enhanced component."
      },
      {
        "q": "What are Render Props?",
        "a": "Render Props is a pattern where a component shares functionality with another component through a function prop that returns JSX."
      },
      {
        "q": "What is debouncing?",
        "a": "Debouncing delays function execution until the user stops triggering an event for a specified time. Example: Search API calls after the user stops typing."
      },
      {
        "q": "What is throttling?",
        "a": "Throttling limits how frequently a function can execute within a specified time interval. Example: Handling scroll and resize events."
      }
    ]
  },
  {
    "title": "5. React Interview Focus (86-100)",
    "questions": [
      {
        "q": "Why do we use React?",
        "a": "We use React to build reusable, interactive, component-based user interfaces efficiently."
      },
      {
        "q": "What are the advantages of React?",
        "a": "Reusable components. Virtual DOM reconciliation. Large ecosystem. One-way data flow. Easy integration with APIs and libraries."
      },
      {
        "q": "What are the disadvantages of React?",
        "a": "Requires additional libraries for routing and state management. Frequent ecosystem changes. JSX can be difficult for beginners. SEO needs additional configuration for client-rendered applications."
      },
      {
        "q": "Difference between Virtual DOM and Real DOM?",
        "a": "Virtual DOM	Real DOM In-memory representation	Actual browser DOM Lightweight representation	Browser-managed structure Used for reconciliation	Displays actual UI Updates are calculated by React	DOM changes are applied by the browser"
      },
      {
        "q": "Why are keys important in React?",
        "a": "Keys help React identify list elements between renders, improving reconciliation and preventing incorrect UI updates."
      },
      {
        "q": "What is state immutability?",
        "a": "State immutability means creating a new object or array instead of directly modifying the existing state."
      },
      {
        "q": "What are React best practices?",
        "a": "Use reusable components. Keep components small. Use proper keys. Avoid unnecessary re-renders. Follow Hooks rules. Handle errors properly. Keep API logic organized."
      },
      {
        "q": "How should a React project be structured?",
        "a": "A common structure is: src/ ├── components/ ├── pages/ ├── hooks/ ├── context/ ├── services/ ├── assets/ ├── utils/ ├── App.jsx └── main.jsx"
      },
      {
        "q": "How do you optimize React performance?",
        "a": "Use React.memo. Use useMemo and useCallback when beneficial. Implement lazy loading. Use proper keys. Avoid unnecessary state updates. Use pagination or virtualization for large lists."
      },
      {
        "q": "How do you call an API in React?",
        "a": "We can use fetch() or Axios inside useEffect or through an event handler or data-fetching library. fetch(\"https://api.example.com/users\") .then(res => res.json()) .then(data => setUsers(data)) .catch(err => console.log(err)); }, []);"
      },
      {
        "q": "What is Axios?",
        "a": "Axios is a JavaScript HTTP client used to send API requests like GET, POST, PUT, and DELETE."
      },
      {
        "q": "How are environment variables used in React?",
        "a": "Environment variables store configuration values like API URLs. In Vite: VITE_API_URL=https://api.example.com Access using: import.meta.env.VITE_API_URL Note: Frontend environment variables are exposed to users after building. Never store secret keys in them."
      },
      {
        "q": "What is a production build?",
        "a": "A production build is an optimized version of the application prepared for deployment. It includes optimizations like minification and bundling."
      },
      {
        "q": "How is a React application deployed?",
        "a": "We create a production build and deploy it using platforms like Vercel, Netlify, AWS, or a VPS with Nginx. For Vite: npm run build"
      },
      {
        "q": "Difference between React and Angular?",
        "a": "React	Angular JavaScript UI library	Full-fledged framework Developed by Meta	Developed by Google Uses JSX	Uses HTML templates Flexible architecture	More structured architecture Uses external routing libraries	Provides built-in routing"
      }
    ]
  },
  {
    title: '6. Important Practical React Questions',
    questions: [
      { q: 'What is reconciliation?', a: 'Reconciliation is the process React uses to compare UI trees and determine the updates needed for the DOM.' },
      { q: 'What is hydration?', a: 'Hydration attaches React behavior and event handlers to HTML that was rendered on the server.' },
      { q: 'What is SSR?', a: 'Server-Side Rendering generates HTML on the server before sending it to the browser.' },
      { q: 'What is CSR?', a: 'Client-Side Rendering builds and updates the UI in the browser using JavaScript.' },
      { q: 'What is React Fiber?', a: 'React Fiber is React’s internal architecture for scheduling and managing rendering work.' },
      { q: 'What is Strict Mode used for?', a: 'Strict Mode helps find potential problems during development by adding extra checks.' },
      { q: 'What is a synthetic event?', a: 'A synthetic event is React’s cross-browser wrapper around native browser events.' },
      { q: 'What is stale state?', a: 'Stale state means using a state value from an older render instead of the latest value.' },
      { q: 'What is a functional state update?', a: 'A functional state update calculates the next value from the previous value, for example setCount(previous => previous + 1).' },
      { q: 'What is React Query?', a: 'React Query is a library for fetching, caching, and synchronizing server state.' },
    ]
  },
  {
    title: '7. Important Practical Code Snippets',
    questions: [
      { q: 'Functional state update example', a: 'Use the previous state value when the next state depends on it.' },
      { q: 'API call with async/await example', a: 'Fetch data inside an effect, handle errors, and update state with the response.' },
      { q: 'Search debouncing example', a: 'Delay the search until the user pauses typing, and clear the timer when the search value changes.' },
      { q: 'Conditional loading example', a: 'Show loading or error UI first, then render the data after the request succeeds.' },
      { q: 'Protected route example', a: 'Render protected content only for an authenticated user; otherwise navigate to the login page. The backend must still validate authorization.' },
    ]
  }
];

const totalQuestions = revisionSections.reduce((s, sec) => s + sec.questions.length, 0);

// Practical examples for concepts that are easiest to understand through code.
const reactExamples = {
  'Component?': `function Welcome() {
  return <h1>Hello!</h1>;
}`,
  'Functional component?': `const Button = () => <button>Click me</button>;`,
  'JSX?': `const name = "Ashish";
const heading = <h1>Hello, {name}</h1>;`,
  'Props?': `function Welcome({ name }) {
  return <h1>Hello, {name}</h1>;
}

<Welcome name="Ashish" />`,
  'State?': `const [count, setCount] = useState(0);

<button onClick={() => setCount(count + 1)}>
  Count: {count}
</button>`,
  'Key in React?': `users.map(user => (
  <UserCard key={user.id} user={user} />
))`,
  'React Fragment?': `return (
  <>
    <h1>Title</h1>
    <p>Description</p>
  </>
);`,
  'Event handling?': `const handleClick = () => alert("Saved!");

return <button onClick={handleClick}>Save</button>;`,
  'Conditional rendering?': `{isLoggedIn ? <Dashboard /> : <Login />}`,
  'Lists in React?': `const fruits = ["Apple", "Mango"];

return fruits.map(fruit => <li key={fruit}>{fruit}</li>);`,
  'Controlled component?': `const [name, setName] = useState("");

<input value={name} onChange={e => setName(e.target.value)} />`,
  'Uncontrolled component?': `const inputRef = useRef(null);

<input ref={inputRef} />
<button onClick={() => console.log(inputRef.current.value)}>
  Read value
</button>`,
  'useState?': `const [name, setName] = useState("Ashish");
setName("Rahul");`,
  'Syntax?': `const [state, setState] = useState(initialValue);`,
  'useEffect?': `useEffect(() => {
  document.title = "Count: " + count;
}, [count]);`,
  'Empty array?': `useEffect(() => {
  console.log("Component mounted");
}, []);`,
  'Cleanup function?': `useEffect(() => {
  const id = setInterval(loadData, 1000);
  return () => clearInterval(id);
}, []);`,
  'useContext?': `const theme = useContext(ThemeContext);
return <div className={theme}>Hello</div>;`,
  'useRef?': `const inputRef = useRef(null);

<input ref={inputRef} />
<button onClick={() => inputRef.current.focus()}>Focus</button>`,
  'useMemo?': `const total = useMemo(
  () => calculateTotal(items),
  [items]
);`,
  'useCallback?': `const handleSave = useCallback(() => {
  saveUser(userId);
}, [userId]);`,
  'Custom hook?': `function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}`,
  'Are state updates asynchronous?': `setCount(current => current + 1);
setCount(current => current + 1);
// Correctly increases count by 2`,
  'What is useReducer?': `const [state, dispatch] = useReducer(reducer, { count: 0 });

dispatch({ type: "increment" });`,
  'What is React Router?': `<BrowserRouter>
  <Routes>
    <Route path="/about" element={<About />} />
  </Routes>
</BrowserRouter>`,
  'What is Link?': `<Link to="/about">About</Link>`,
  'What is useNavigate?': `const navigate = useNavigate();
navigate("/dashboard");`,
  'What is dynamic routing?': `<Route path="/users/:id" element={<User />} />

const { id } = useParams();`,
  'What does onSubmit do?': `function handleSubmit(event) {
  event.preventDefault();
  console.log("Submitted");
}

<form onSubmit={handleSubmit}>...</form>`,
  'What is lifting state up?': `function Parent() {
  const [name, setName] = useState("");
  return <Child name={name} setName={setName} />;
}`,
  'How can prop drilling be avoided?': `const user = useContext(UserContext);
return <p>{user.name}</p>;`,
  'What are nested routes?': `<Route path="dashboard" element={<Dashboard />}>
  <Route path="profile" element={<Profile />} />
</Route>

// Dashboard renders <Outlet />`,
  'How do you redirect in React Router?': `navigate("/login");

// Or during rendering:
return <Navigate to="/login" replace />;`,
  'What is lazy loading?': `const Settings = lazy(() => import("./Settings"));

<Suspense fallback={<p>Loading...</p>}>
  <Settings />
</Suspense>`,
  'What is an action?': `const action = {
  type: "cart/itemAdded",
  payload: { id: 1, name: "Book" }
};`,
  'What is a reducer?': `function reducer(state, action) {
  if (action.type === "increment") {
    return { count: state.count + 1 };
  }
  return state;
}`,
  'What is React.memo?': `const UserCard = React.memo(function UserCard({ user }) {
  return <p>{user.name}</p>;
});`,
  'What are portals?': `return createPortal(
  <Modal />,
  document.getElementById("modal-root")
);`,
  'What is debouncing?': `clearTimeout(timer);
timer = setTimeout(() => search(query), 400);`,
  'What is throttling?': `// Run at most once every 200ms
const onScroll = throttle(handleScroll, 200);`,
  'What is state immutability?': `// Wrong: user.name = "Rahul";
// Correct: create a new object
setUser(current => ({ ...current, name: "Rahul" }));`,
  'How do you call an API in React?': `useEffect(() => {
  fetch("/api/users")
    .then(response => response.json())
    .then(setUsers)
    .catch(setError);
}, []);`,
  'What is Axios?': `const { data } = await axios.get("/api/users");
setUsers(data);`,
  'How are environment variables used?': `const apiUrl = import.meta.env.VITE_API_URL;`,

  'Functional state update example': `setCount(prev => prev + 1);`,
  'API call with async/await example': `useEffect(() => {
  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.log(error);
    }
  };

  fetchUsers();
}, []);`,
  'Search debouncing example': `useEffect(() => {
  const timer = setTimeout(() => fetchUsers(search), 500);
  return () => clearTimeout(timer);
}, [search]);`,
  'Conditional loading example': `if (loading) return <p>Loading...</p>;
if (error) return <p>Something went wrong</p>;

return <UserList users={users} />;`,
  'Protected route example': `function ProtectedRoute({ children }) {
  return isAuthenticated ? children : <Navigate to="/login" />;
}`,
};

function getReactExample(question) {
  const normalize = value => value.toLowerCase().replace(/^what (?:is|are) /, '').replace(/[?.,()]/g, '').replace(/^a /, '').replace(/\s+/g, ' ').trim();
  const target = normalize(question);
  const entry = Object.entries(reactExamples).find(([label]) => normalize(label) === target);
  return entry?.[1];
}

function ReactExample({ code }) {
  return (
    <div className="my-3 rounded-lg overflow-hidden border border-[#333] shadow-lg">
      <div className="bg-[#252526] px-3 py-1.5 flex items-center justify-between">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        </div>
        <span className="text-[10px] text-gray-500 font-mono tracking-widest">EXAMPLE</span>
      </div>
      <pre className="bg-[#1e1e1e] px-5 py-3 overflow-x-auto font-mono text-[13px] leading-6 m-0 whitespace-pre text-cyan-200">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function ReactSheet({ auth, setAuth }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [openAnswers, setOpenAnswers] = useState({});
  const [collapsedSections, setCollapsedSections] = useState(
    () => revisionSections.reduce((acc, _, i) => ({ ...acc, [i]: true }), {})
  );
  const questionRefs = useRef({});

  const [lastRead, setLastRead] = useState(() => {
    try { return JSON.parse(localStorage.getItem('react_revision_last_read')) || null; }
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
        localStorage.setItem('react_revision_last_read', JSON.stringify(data));
      }
      return { ...prev, [key]: !prev[key] };
    });
  };

  const jumpToLastRead = () => {
    if (!lastRead) return;
    const sectionIdx = parseInt(lastRead.key.split('-')[0], 10);
    setCollapsedSections(prev => ({ ...prev, [sectionIdx]: false }));
    setOpenAnswers(prev => ({ ...prev, [lastRead.key]: true }));
    setTimeout(() => {
      const el = questionRefs.current[lastRead.key];
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 80);
  };

  const clearLastRead = () => {
    setLastRead(null);
    localStorage.removeItem('react_revision_last_read');
  };

  const toggleSection = (sIdx) => {
    setCollapsedSections(prev => ({ ...prev, [sIdx]: !prev[sIdx] }));
  };

  const q = searchQuery.toLowerCase().trim();
  const filteredSections = revisionSections.map(sec => ({
    ...sec,
    questions: q
      ? sec.questions.filter(item =>
          item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q)
        )
      : sec.questions,
  })).filter(sec => sec.questions.length > 0);

  const totalVisible = filteredSections.reduce((s, sec) => s + sec.questions.length, 0);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <header className="border-b border-[#1f1f1f] bg-[#0a0a0a]/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link to="/sheet" className="text-cyan-400 hover:text-cyan-300 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div>
              <h1 className="text-2xl font-bold leading-tight">
                <span className="text-cyan-400">ReactJS</span> Revision
              </h1>
              <p className="text-xs text-gray-500">{totalQuestions} questions · {revisionSections.length} sections</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <span className="text-gray-400 text-sm hidden sm:block">{auth.user?.username}</span>
            <button onClick={handleLogout} className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-sm rounded-lg transition-colors">Logout</button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 py-8 space-y-8">
        <div className="relative">
          <svg className="w-4 h-4 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search any question or keyword..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl px-5 py-4 pl-12 pr-11 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-400/60 transition-colors text-base"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors text-lg leading-none">x</button>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Total Questions', value: totalQuestions, color: 'text-cyan-400' },
            { label: 'Revealed', value: revealedCount, color: 'text-emerald-400' },
            { label: 'Topics', value: revisionSections.length, color: 'text-sky-300' },
          ].map(s => (
            <div key={s.label} className="bg-[#111] border border-[#1f1f1f] rounded-xl p-6 text-center">
              <div className={`text-4xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-sm text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {lastRead && (
          <div className="flex items-center justify-between bg-cyan-400/8 border border-cyan-400/30 rounded-xl px-4 py-3 gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-cyan-400 text-base flex-shrink-0">📍</span>
              <div className="min-w-0">
                <p className="text-xs text-gray-500 mb-0.5">Last read · {lastRead.sectionTitle}</p>
                <p className="text-sm font-medium text-white truncate">{lastRead.question}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={jumpToLastRead} className="px-3 py-1.5 bg-cyan-400 hover:bg-cyan-300 text-black text-xs font-bold rounded-lg transition-colors">Resume →</button>
              <button onClick={clearLastRead} className="text-gray-600 hover:text-gray-400 text-sm transition-colors">✕</button>
            </div>
          </div>
        )}

        {q && filteredSections.length === 0 && (
          <div className="text-center py-16 text-gray-600">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-sm">No questions match <span className="text-gray-400">"{searchQuery}"</span></p>
            <button onClick={() => setSearchQuery('')} className="mt-3 text-cyan-400 text-xs hover:underline">Clear search</button>
          </div>
        )}

        {filteredSections.map((section, sIdx) => {
          const originalIdx = revisionSections.findIndex(s => s.title === section.title);
          const isCollapsed = q ? false : collapsedSections[originalIdx];
          return (
            <div key={sIdx}>
              <button
                onClick={() => toggleSection(originalIdx)}
                className="w-full flex items-center justify-between py-4 group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-cyan-400 font-bold text-lg">{section.title}</span>
                  <span className="text-sm text-gray-500 bg-[#1a1a1a] px-2.5 py-0.5 rounded-full">{section.questions.length}Q</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-px bg-[#1f1f1f] w-20 hidden sm:block" />
                  <svg className={`w-4 h-4 text-cyan-400/60 transition-transform duration-200 ${isCollapsed ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              <div className="h-px bg-[#1f1f1f] mb-2" />

              {!isCollapsed && (
                <div>
                  {section.questions.map((item, qIdx) => {
                    const key = `${originalIdx}-${qIdx}`;
                    const isOpen = openAnswers[key];
                    const isLastRead = lastRead?.key === key;
                    return (
                      <div
                        key={key}
                        ref={el => questionRefs.current[key] = el}
                        className={`border-b transition-all rounded-sm ${
                          isOpen
                            ? 'bg-cyan-400/[0.06] border-cyan-400/20'
                            : isLastRead
                            ? 'border-cyan-400/15'
                            : 'border-[#161616]'
                        }`}
                      >
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => toggleAnswer(key, item.q, section.title)}
                            className="flex-1 flex items-center justify-between px-2 py-5 text-left hover:bg-white/[0.03] transition-colors rounded"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              {isLastRead && <span className="text-cyan-400 text-xs flex-shrink-0">📌</span>}
                              <span className={`text-[17px] leading-snug ${isLastRead ? 'text-cyan-200' : 'text-gray-200'}`}>{item.q}</span>
                            </div>
                            <svg className={`w-3.5 h-3.5 text-gray-600 flex-shrink-0 ml-3 transition-transform duration-200 ${isOpen ? 'rotate-180 text-cyan-400' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          <a
                            href={`https://chatgpt.com/?q=${encodeURIComponent(`${item.q} in short.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Ask ChatGPT"
                            className="flex-shrink-0 p-2 mr-1 text-red-400 hover:text-red-300 hover:scale-125 transition-all duration-300 rounded animate-spin [animation-duration:6s]"
                            onClick={e => e.stopPropagation()}
                          >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.648zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.843-3.371 2.019-1.168a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.4-.679zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.496 4.496 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.603 1.497v2.999l-2.597 1.5-2.603-1.495z"/>
                            </svg>
                          </a>
                        </div>
                        {isOpen && (
                          <div className="px-3 pb-5 pt-2">
                            <p className="text-[16px] text-cyan-300/80 px-2 pb-1 leading-relaxed">
                              <span className="text-cyan-500 mr-1">Answer:</span>{item.a}
                            </p>
                            {getReactExample(item.q) && <ReactExample code={getReactExample(item.q)} />}
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

        {q && filteredSections.length > 0 && (
          <p className="text-xs text-gray-600 text-center pt-2">{totalVisible} result{totalVisible !== 1 ? 's' : ''} for "{searchQuery}"</p>
        )}
      </div>

      <div className="pb-10" />
      <Footer />
    </div>
  );
}

export default ReactSheet;
