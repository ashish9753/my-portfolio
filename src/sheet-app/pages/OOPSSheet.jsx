import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import ThemeToggle from '../components/ThemeToggle';

const oopsSections = [
  {
    title: '📘 OOPs Basics',
    questions: [
      {
        q: 'What is OOPs (Object Oriented Programming)?',
        a: 'OOPs is a programming paradigm that organizes software around objects rather than functions.\n\nAn object contains:\n• Data (Variables / Fields)\n• Behavior (Methods / Functions)\n\nWithout OOPs:\nname = "Ashish";\nage = 21;\nsalary = 50000;\n→ Large projects become difficult to manage.\n\nOOPs provides:\n• Reusability – write once, use many times\n• Security – hide sensitive data\n• Modularity – break code into objects\n• Scalability – easy to extend\n• Maintainability – easy to update\n\nReal World Example: Think about a Car.\n• Data: Color, Brand, Speed, Price\n• Behavior: Start(), Stop(), Accelerate()\n\nThis is exactly how OOPs works – bundle data and behavior together.'
      },
      {
        q: 'What is a Class in Java?',
        a: 'A class is a blueprint/template that defines variables and methods, but occupies NO memory until objects are created.\n\nReal World Example:\n• Blueprint of a house = Class\n• The blueprint is not the actual house\n• It only defines how houses should be built\n\nJava Example:\nclass Student {\n    String name;\n    int age;\n\n    void study() {\n        System.out.println("Studying");\n    }\n}\n\nHere, Student is a class.\n• name, age → Variables (data)\n• study() → Method (behavior)\n\nKey Point: Class definition alone allocates NO memory. Memory is allocated only when an object is created.'
      },
      {
        q: 'What is an Object in Java?',
        a: 'An object is an instance of a class. Memory gets allocated only after object creation.\n\nReal World Example:\n• Blueprint → Class\n• Actual House → Object\n\nJava Example:\nStudent s1 = new Student();\n→ Now memory is allocated.\n\nFull Example:\nclass Student {\n    String name;\n    int age;\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Student s1 = new Student();\n        s1.name = "Ashish";\n        s1.age = 21;\n        System.out.println(s1.name);\n    }\n}\nOutput: Ashish\n\nKey Points:\n• new keyword allocates heap memory\n• Each object has its own copy of instance variables\n• Multiple objects can be created from one class'
      },
    ]
  },
  {
    title: '📘 Constructors & this Keyword',
    questions: [
      {
        q: 'What is a Constructor in Java?',
        a: 'A constructor is a special method used to initialize objects automatically at the time of creation.\n\nWhy Constructor?\nWithout constructor:\nStudent s = new Student();\ns.name = "Ashish"; // manual initialization needed\n\nWith constructor: initialization happens automatically.\n\nReal World Example:\nWhen buying a phone:\nPhone(Brand="Samsung", RAM="8GB")\n→ Phone gets initialized instantly.\n\nJava Example:\nclass Student {\n    String name;\n\n    Student(String name) {\n        this.name = name;\n    }\n}\nStudent s = new Student("Ashish");\nOutput: s.name = "Ashish"\n\nKey Rules:\n• Constructor name must match class name\n• No return type (not even void)\n• Called automatically with new keyword'
      },
      {
        q: 'What are the Types of Constructors?',
        a: 'Java has 3 types of constructors:\n\n1. Default Constructor (no parameters):\nclass Student {\n    Student() { // compiler creates this if none defined\n        System.out.println("Default Constructor");\n    }\n}\nStudent s = new Student();\n\n2. Parameterized Constructor:\nclass Student {\n    String name;\n    Student(String name) {\n        this.name = name;\n    }\n}\nStudent s = new Student("Ashish");\n\n3. Copy Constructor (user-defined):\nclass Student {\n    String name;\n    Student(Student s) { // copies another object\n        this.name = s.name;\n    }\n}\nStudent s1 = new Student("Ashish");\nStudent s2 = new Student(s1); // s2.name = "Ashish"\n\nNote: Java does NOT have a built-in copy constructor like C++.\nIf you define any constructor, the compiler DOES NOT provide a default one.'
      },
      {
        q: 'What is the this keyword in Java?',
        a: 'this refers to the current object instance.\n\nWhy Needed?\nclass Student {\n    String name;\n    Student(String name) {\n        name = name; // PROBLEM: both refer to the parameter!\n    }\n}\n\nCompiler gets confused: parameter name vs instance variable name.\n\nSolution:\nStudent(String name) {\n    this.name = name; // this.name = instance variable\n}\n\nReal World Example:\nYou saying:\n• "My Phone" → My = this person\n• "My Laptop" → My = this person\nSimilarly: this.name = current object\'s name.\n\nUses of this:\n1. Refer to current class instance variable: this.name = name;\n2. Call current class method: this.study();\n3. Call current class constructor (constructor chaining): this("default");\n4. Pass current object as argument: print(this);\n5. Return current object: return this;'
      },
      {
        q: 'What is Constructor Chaining?',
        a: 'Constructor Chaining is calling one constructor from another constructor.\n\nUsing this() → calls another constructor in SAME class.\nUsing super() → calls constructor from PARENT class.\n\nExample using this():\nclass Student {\n    String name;\n    int age;\n\n    Student() {\n        this("Unknown", 0); // calls parameterized constructor\n    }\n\n    Student(String name, int age) {\n        this.name = name;\n        this.age = age;\n    }\n}\n\nExample using super():\nclass Animal {\n    String type;\n    Animal(String type) {\n        this.type = type;\n    }\n}\nclass Dog extends Animal {\n    Dog() {\n        super("Mammal"); // calls Animal constructor\n    }\n}\n\nRules:\n• this() or super() must be the FIRST statement in constructor\n• You cannot use both this() and super() in same constructor\n\nReal World Example: A form that auto-fills default values when some fields are empty.'
      },
    ]
  },
  {
    title: '📘 Encapsulation',
    questions: [
      {
        q: 'What is Encapsulation in Java?',
        a: 'Encapsulation is the wrapping of data (variables) and methods together and hiding the data from direct access.\n\nWhy Needed?\nWithout encapsulation:\nsalary = -5000; // Anyone can set invalid values!\n\nWith encapsulation: data is protected and validated.\n\nReal World Example:\nATM Machine:\n• You cannot directly access the bank\'s balance\n• You must use: withdraw(), deposit(), checkBalance()\n• Implementation is hidden, interface is exposed\n\nJava Example:\nclass Employee {\n    private int salary; // hidden from outside\n\n    public void setSalary(int salary) {\n        if (salary > 0)\n            this.salary = salary;\n    }\n\n    public int getSalary() {\n        return salary;\n    }\n}\n\nBenefits:\n• Data Hiding – private fields\n• Validation – check data before setting\n• Flexibility – change internal implementation without breaking external code\n• Security – only expose what is needed\n\nHow to achieve: Use private fields + public getters/setters.'
      },
      {
        q: 'What are Getter and Setter methods?',
        a: 'Getter: A public method used to READ the value of a private field.\nSetter: A public method used to UPDATE the value of a private field.\n\nNaming Convention:\n• Getter: getFieldName()\n• Setter: setFieldName(value)\n\nJava Example:\nclass BankAccount {\n    private double balance;\n\n    // Getter\n    public double getBalance() {\n        return balance;\n    }\n\n    // Setter with validation\n    public void setBalance(double balance) {\n        if (balance >= 0)\n            this.balance = balance;\n    }\n}\n\nReal World Example:\n• checkBalance() → Getter (reads data)\n• deposit() → Setter (updates data)\n\nBoolean getter uses "is" prefix:\nprivate boolean active;\n\npublic boolean isActive() {\n    return active;\n}\n\nWhy not just make fields public?\n• Public fields can be set to invalid values directly\n• Setters allow validation and control\n• Getters allow read-only access if no setter is provided'
      },
    ]
  },
  {
    title: '📘 Inheritance',
    questions: [
      {
        q: 'What is Inheritance in Java?',
        a: 'Inheritance is a mechanism where a child class acquires the properties (fields and methods) of a parent class.\n\nKeyword: extends\n\nWhy Needed? To avoid duplicate code and achieve code reuse.\n\nReal World Example:\nAnimal → Dog\nDog already inherits: eat(), sleep() from Animal.\nDog only adds: bark()\n\nJava Example:\nclass Animal {\n    void eat() {\n        System.out.println("Eating");\n    }\n    void sleep() {\n        System.out.println("Sleeping");\n    }\n}\n\nclass Dog extends Animal {\n    void bark() {\n        System.out.println("Barking");\n    }\n}\n\nDog d = new Dog();\nd.eat();   // Inherited: Eating\nd.sleep(); // Inherited: Sleeping\nd.bark();  // Own: Barking\n\nTerminology:\n• Parent class = Base class = Super class\n• Child class = Derived class = Sub class\n\nWhat is inherited: public and protected fields/methods\nWhat is NOT inherited: constructors, private fields'
      },
      {
        q: 'What are the Types of Inheritance in Java?',
        a: '1. Single Inheritance:\nA → B\nOne parent, one child.\nclass B extends A {}\n\n2. Multilevel Inheritance:\nA → B → C\nChain of inheritance.\nclass C extends B {} // B extends A\n\n3. Hierarchical Inheritance:\n      A\n     / \\\n    B   C\nMultiple children from one parent.\nclass B extends A {}\nclass C extends A {}\n\n4. Multiple Inheritance (NOT supported via classes):\n      A   B\n       \\ /\n        C\nNot allowed: class C extends A, B {} ❌\nReason: Diamond Problem\n\nSolution: Use Interfaces\ninterface A {}\ninterface B {}\nclass C implements A, B {} ✅\n\n5. Hybrid Inheritance:\nCombination of two or more types.\nOnly possible via interfaces in Java.\n\nWhy Java doesn\'t support multiple inheritance with classes?\nDiamond Problem:\n    A (method m())\n   / \\\n  B   C (both override m())\n   \\ /\n    D → Which m() does D inherit? Ambiguity!'
      },
      {
        q: 'What is the super keyword in Java?',
        a: 'super is used to access parent class members (fields, methods, constructors) from within the child class.\n\nUses of super:\n\n1. Access parent class field:\nclass Vehicle {\n    String color = "Red";\n}\nclass Car extends Vehicle {\n    String color = "Blue";\n    void show() {\n        System.out.println(super.color); // Red (parent)\n        System.out.println(this.color);  // Blue (child)\n    }\n}\n\n2. Call parent class method:\nsuper.eat(); // calls parent\'s eat()\n\n3. Call parent class constructor:\nclass Animal {\n    Animal(String name) {\n        System.out.println("Animal: " + name);\n    }\n}\nclass Dog extends Animal {\n    Dog() {\n        super("Dog"); // must be first statement\n    }\n}\n\nReal World Example:\n• Father has a house\n• Child has a house\n• super.house → accesses father\'s house\n• this.house → accesses child\'s own house\n\nKey Rule: super() must be the FIRST statement in a constructor.'
      },
    ]
  },
  {
    title: '📘 Polymorphism',
    questions: [
      {
        q: 'What is Polymorphism in Java?',
        a: 'Polymorphism means "one thing, many forms."\n\nTypes:\n1. Compile-Time Polymorphism (Static) → Method Overloading\n2. Runtime Polymorphism (Dynamic) → Method Overriding\n\nReal World Example:\n• A teacher can be a parent, an employee, and a citizen – same person, different roles.\n• A + operator: 1+2=3 (int addition), "Hello"+"World" (string concat) – same operator, different behavior.'
      },
      {
        q: 'What is Method Overloading (Compile-Time Polymorphism)?',
        a: 'Method Overloading = Same method name, different parameters, in the SAME class.\n\nAlso called: Static Polymorphism or Early Binding (resolved at compile time).\n\nReal World Example:\nCalculator:\nadd(10, 20) → 30\nadd(10, 20, 30) → 60\nadd(10.5, 20.5) → 31.0\nSame operation, different forms.\n\nJava Example:\nclass Calculator {\n    int add(int a, int b) {\n        return a + b;\n    }\n    int add(int a, int b, int c) {\n        return a + b + c;\n    }\n    double add(double a, double b) {\n        return a + b;\n    }\n}\n\nOverloading can differ by:\n• Number of parameters\n• Type of parameters\n• Order of parameters\n\nNote: Return type ALONE cannot differentiate overloaded methods.\n\nNOT Overloading: changing only return type is a compilation error.'
      },
      {
        q: 'What is Method Overriding (Runtime Polymorphism)?',
        a: 'Method Overriding = Child class provides a DIFFERENT implementation for a method already defined in the parent class.\n\nAlso called: Dynamic Polymorphism or Late Binding (resolved at runtime).\n\nRules:\n• Same method name, same parameters, same return type\n• Must have Inheritance\n• Use @Override annotation (best practice)\n• Cannot override: static, final, or private methods\n\nReal World Example:\nAnimal Sound:\n• Animal → sound() → "Animal Sound"\n• Dog → sound() → "Bark"\n• Cat → sound() → "Meow"\n• Cow → sound() → "Moo"\nSame method, different behavior.\n\nJava Example:\nclass Animal {\n    void sound() {\n        System.out.println("Animal Sound");\n    }\n}\n\nclass Dog extends Animal {\n    @Override\n    void sound() {\n        System.out.println("Bark");\n    }\n}\n\nDog d = new Dog();\nd.sound(); // Output: Bark'
      },
      {
        q: 'What is Dynamic Method Dispatch? (Most Asked Interview Question)',
        a: 'Dynamic Method Dispatch is the mechanism where a method call to an overridden method is resolved at RUNTIME, not compile time.\n\nKey concept:\nAnimal a = new Dog(); // Parent reference, Child object\na.sound(); // Which sound() is called?\n\nOutput: Bark ← Dog\'s version called!\n\nWhy? Because method call depends on the OBJECT (Dog), not the REFERENCE (Animal).\n\nFull Example:\nclass Animal {\n    void sound() { System.out.println("Animal"); }\n}\nclass Dog extends Animal {\n    void sound() { System.out.println("Bark"); }\n}\nclass Cat extends Animal {\n    void sound() { System.out.println("Meow"); }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Animal a;\n        a = new Dog(); a.sound(); // Bark\n        a = new Cat(); a.sound(); // Meow\n    }\n}\n\nRule: Reference = Parent, Object = Child → Method called depends on OBJECT type.\n\nAlso called: Upcasting (storing child object in parent reference).\nAnimal a = new Dog(); // Upcasting'
      },
      {
        q: 'Can Constructor, Static, and Final methods be Overridden?',
        a: 'Q1: Can Constructor be Overridden?\n❌ No. Constructors are NOT inherited, so they cannot be overridden.\n\nQ2: Can Static Methods be Overridden?\n❌ No. Static methods belong to the class, not the object.\nThey are HIDDEN, not overridden.\nAnimal.sound() → parent static version\nDog.sound() → child static version\n(No dynamic dispatch for static methods)\n\nQ3: Can Final Methods be Overridden?\n❌ No. final methods cannot be overridden.\nclass Animal {\n    final void sound() { ... }\n}\nclass Dog extends Animal {\n    void sound() { } // COMPILATION ERROR\n}\n\nQ4: Can Private Methods be Overridden?\n❌ No. Private methods are not visible to child classes.\n\nSummary:\n| Method Type | Can Override? |\n|-------------|---------------|\n| Normal      | ✅ Yes        |\n| Static      | ❌ No (Hidden)|\n| Final       | ❌ No         |\n| Private     | ❌ No         |\n| Constructor | ❌ No         |'
      },
    ]
  },
  {
    title: '📘 Abstraction',
    questions: [
      {
        q: 'What is Abstraction in Java?',
        a: 'Abstraction = Showing only the functionality, hiding the implementation details.\n\nReal World Example:\nCar:\n• You use: Brake, Accelerator, Steering\n• You don\'t know: Engine Combustion, Fuel Injection, Gear mechanics\n→ Implementation is hidden. Only necessary features are exposed.\n\nOther Examples:\n• TV Remote: Press button, channel changes. HOW? Hidden.\n• ATM: Enter PIN, get cash. HOW? Hidden.\n\nWays to achieve Abstraction in Java:\n1. Abstract Class (0–100% abstraction)\n2. Interface (100% abstraction)\n\nBenefits:\n• Reduces complexity\n• Increases security\n• Easier to maintain\n• Focus on WHAT it does, not HOW'
      },
      {
        q: 'What is an Abstract Class in Java?',
        a: 'An abstract class is a class declared with the abstract keyword.\n\nKey Features:\n• Can have abstract methods (no body) AND concrete methods (with body)\n• Cannot be instantiated (cannot create object directly)\n• Child class MUST override all abstract methods\n• Can have constructors, static methods, final methods\n\nJava Example:\nabstract class Vehicle {\n    abstract void start(); // no body – must override\n\n    void stop() { // concrete method – optional to override\n        System.out.println("Vehicle stopped");\n    }\n}\n\nclass Car extends Vehicle {\n    @Override\n    void start() {\n        System.out.println("Car started");\n    }\n}\n\nCar c = new Car();\nc.start(); // Car started\nc.stop();  // Vehicle stopped\n\nVehicle v = new Vehicle(); // ERROR! Cannot instantiate abstract class\n\nWhen to use?\n• When you want to provide PARTIAL implementation\n• When related classes share some common behavior but also have their own specific behavior'
      },
      {
        q: 'What is an Interface in Java?',
        a: 'An interface is a contract – it tells classes what methods they MUST implement.\n\nKey Features:\n• All methods are abstract by default (Java 7)\n• Java 8+: can have default and static methods\n• Java 9+: can have private methods\n• All variables are public static final (constants)\n• A class can IMPLEMENT multiple interfaces\n• Cannot be instantiated\n\nReal World Example:\nUSB Charger Standard:\nAll companies (Samsung, Vivo, Oppo) must implement:\ncharge() method\nImplementation may differ, but contract is the same.\n\nJava Example:\ninterface Animal {\n    void sound(); // implicitly public abstract\n}\n\nclass Dog implements Animal {\n    @Override\n    public void sound() {\n        System.out.println("Bark");\n    }\n}\n\nMultiple Interface Implementation:\ninterface Flyable {\n    void fly();\n}\ninterface Swimmable {\n    void swim();\n}\nclass Duck implements Flyable, Swimmable {\n    public void fly() { ... }\n    public void swim() { ... }\n}'
      },
      {
        q: 'What is the difference between Abstract Class and Interface?',
        a: 'Abstract Class vs Interface:\n\nAbstract Class:\n• Keyword: abstract\n• Constructor: ✅ Yes\n• Multiple Inheritance: ❌ No (extends one class)\n• Methods: Both abstract + concrete\n• Variables: Instance variables allowed\n• Access Modifiers: Any (private, protected, public)\n• Use when: "IS-A" relationship, partial implementation needed\n\nInterface:\n• Keyword: interface\n• Constructor: ❌ No\n• Multiple Inheritance: ✅ Yes (implements multiple)\n• Methods: abstract by default (Java 8+ allows default/static)\n• Variables: public static final only (constants)\n• Access Modifiers: public only (by default)\n• Use when: "CAN-DO" relationship, full abstraction, multiple inheritance\n\nExample:\nabstract class Animal → Dog IS-A Animal ✅\ninterface Swimmable → Dog CAN swim ✅\n\nRule of Thumb:\n• Use abstract class when classes share common code\n• Use interface when you want to define a contract/capability'
      },
    ]
  },
  {
    title: '📘 Important Keywords',
    questions: [
      {
        q: 'What is the static keyword in Java?',
        a: 'static means the member belongs to the CLASS, not to any specific object.\n\nReal World Example:\nCollege Name "LPU" is the same for all students.\nInstead of each student storing it, one shared copy is enough.\n\nTypes of static members:\n1. Static Variable:\nclass Student {\n    static String college = "LPU"; // shared by all objects\n    String name; // each object has its own\n}\nStudent.college // access without object\n\n2. Static Method:\nclass MathUtils {\n    static int add(int a, int b) { return a + b; }\n}\nMathUtils.add(5, 3); // called without object\n\n3. Static Block: runs once when class is loaded\nstatic {\n    System.out.println("Class loaded!");\n}\n\n4. Static Nested Class: class within a class\n\nRules for static methods:\n• Cannot use this or super keyword\n• Can only access static fields directly\n• Cannot be overridden (can be hidden)'
      },
      {
        q: 'What is the final keyword in Java?',
        a: 'final prevents modification.\n\n1. Final Variable → Value cannot be changed:\nfinal int MAX = 100;\nMAX = 200; // COMPILATION ERROR\n\nFinal variable must be initialized either:\n• At declaration\n• In the constructor\n\nReal Example: Aadhar Number – once assigned, cannot change.\n\n2. Final Method → Cannot be overridden:\nclass Animal {\n    final void breathe() { ... }\n}\nclass Dog extends Animal {\n    void breathe() { } // ERROR! Cannot override\n}\n\n3. Final Class → Cannot be extended (inherited):\nfinal class String { ... } // String is final in Java!\nclass MyString extends String { } // ERROR!\n\nSummary:\n| Final on | Effect                    |\n|----------|---------------------------|\n| Variable | Value cannot change       |\n| Method   | Cannot be overridden      |\n| Class    | Cannot be inherited       |\n\nCommon Final classes in Java: String, Integer, System, Math'
      },
      {
        q: 'What is the difference between == and equals() in Java?',
        a: '== compares memory ADDRESS (reference).\nequals() compares CONTENT (value).\n\nExample with String:\nString a = new String("Java");\nString b = new String("Java");\n\nSystem.out.println(a == b);       // false (different objects)\nSystem.out.println(a.equals(b)); // true (same content)\n\nWhy?\n• a and b are two separate objects in heap memory\n• == checks: "Are they the same object?" → No → false\n• equals() checks: "Do they have the same value?" → Yes → true\n\nString Pool Exception:\nString x = "Java"; // stored in String pool\nString y = "Java"; // reuses same pool reference\nSystem.out.println(x == y); // true (same reference!)\n\nWith primitives:\nint p = 10;\nint q = 10;\nSystem.out.println(p == q); // true (primitives compared by value)\n\nRule:\n• Primitives: always use ==\n• Objects/Strings: always use equals()\n\nNote: == on objects checks reference, not content!'
      },
      {
        q: 'What are Access Modifiers in Java?',
        a: 'Access Modifiers control the visibility of classes, methods, and fields.\n\n4 Types:\n\n1. private:\n• Accessible only within the SAME class\n• Most restricted\nclass Student {\n    private int salary; // only Student class can access\n}\n\n2. default (no keyword):\n• Accessible within the SAME PACKAGE\nint salary; // no modifier = default\n\n3. protected:\n• Accessible within same package + child classes (even different packages)\nprotected int salary;\n\n4. public:\n• Accessible EVERYWHERE\n• Least restricted\npublic int salary;\n\nAccess Table:\n| Modifier  | Same Class | Same Package | Child Class | Anywhere |\n|-----------|------------|--------------|-------------|----------|\n| private   | ✅         | ❌           | ❌          | ❌       |\n| default   | ✅         | ✅           | ❌          | ❌       |\n| protected | ✅         | ✅           | ✅          | ❌       |\n| public    | ✅         | ✅           | ✅          | ✅       |\n\nBest Practice:\n• Fields → private\n• Getters/Setters → public\n• Utility methods → private or protected'
      },
    ]
  },
  {
    title: '📘 Object Relationships',
    questions: [
      {
        q: 'What is Association, Aggregation, and Composition?',
        a: 'These describe how objects are RELATED to each other.\n\n1. Association (Uses-A):\nGeneral relationship between two independent objects.\nBoth can exist independently.\nExample: Teacher teaches Student.\n• Teacher can exist without Student\n• Student can exist without Teacher\nclass Teacher {\n    void teach(Student s) { ... }\n}\n\n2. Aggregation (Weak HAS-A):\nOne object contains another, but both can exist independently.\nExample: Department HAS-A Student.\n• Department can exist without students\n• Student can exist without department\nclass Department {\n    List<Student> students; // students exist independently\n}\n\n3. Composition (Strong HAS-A):\nOne object OWNS another. If parent dies, child also dies.\nExample: Car HAS-A Engine.\n• Destroy Car → Engine also destroyed\n• Engine cannot exist without Car\nclass Car {\n    private Engine engine = new Engine(); // engine created inside car\n}\n\nStrength: Composition > Aggregation > Association\n\nMemory Trick:\n• Association = Uses-A (weak, no ownership)\n• Aggregation = Weak HAS-A (independent existence)\n• Composition = Strong HAS-A (dependent existence)'
      },
      {
        q: 'What is Upcasting and Downcasting in Java?',
        a: 'Upcasting: Storing a CHILD object reference into a PARENT reference.\n• Happens automatically (implicit)\n• Safe – no data loss\n\nExample:\nAnimal a = new Dog(); // Upcasting\na.sound(); // calls Dog\'s sound() – dynamic dispatch\n\nWhat can a access?\n• Only Animal (parent) methods\n• NOT Dog-specific methods (bark())\n\nDowncasting: Converting parent reference back to CHILD reference.\n• Must be done explicitly (manual cast)\n• Can throw ClassCastException if wrong\n\nExample:\nAnimal a = new Dog(); // Upcasting\nDog d = (Dog) a;      // Downcasting\nd.bark(); // Now you can access Dog-specific methods\n\nSafe Downcasting using instanceof:\nif (a instanceof Dog) {\n    Dog d = (Dog) a;\n    d.bark();\n}\n\nReal World Example:\n• Upcasting: An employee being referred to as just a "Person"\n• Downcasting: Identifying that "Person" is specifically a "Manager" to access manager-specific methods\n\nWhy Upcasting?\n• Enables polymorphism\n• Allows treating different objects uniformly via parent reference'
      },
    ]
  },
  {
    title: '📘 Special Java Concepts',
    questions: [
      {
        q: 'What is the Object class in Java?',
        a: 'The Object class is the ROOT/PARENT of all Java classes.\n\nEvery Java class implicitly extends Object.\nclass Student { } // same as: class Student extends Object { }\n\nImportant methods in Object class:\n\n1. toString() – Returns string representation of object\nStudent s = new Student("Ashish");\nSystem.out.println(s); // calls s.toString()\n// Default: "Student@1a2b3c" (class@hashcode)\n// Override to customize: return "Student{name=" + name + "}";\n\n2. equals(Object obj) – Compare objects for equality\nDefault: compares reference (==)\nOverride to compare content.\n\n3. hashCode() – Returns integer hash code\nUsed in HashMap, HashSet\nRule: If a.equals(b), then a.hashCode() == b.hashCode()\n\n4. getClass() – Returns runtime class\ns.getClass().getName(); // "Student"\n\n5. clone() – Creates a copy of the object\nImplement Cloneable interface to use.\n\nKey Point: Because Object is the parent of all classes, any class reference can hold any object.'
      },
      {
        q: 'What is an Immutable Class in Java?',
        a: 'An immutable class is one whose OBJECT\'S STATE CANNOT BE CHANGED after creation.\n\nBest Example: String class in Java.\nString s = "Java";\ns.concat("Programming");\nSystem.out.println(s); // still "Java" – original unchanged!\n\nHow to create an Immutable class:\n1. Declare class as final (prevent subclassing)\n2. Declare all fields as private final\n3. No setter methods\n4. Initialize all fields via constructor\n5. Return deep copies of mutable fields\n\nExample:\npublic final class Student {\n    private final String name;\n    private final int age;\n\n    public Student(String name, int age) {\n        this.name = name;\n        this.age = age;\n    }\n\n    public String getName() { return name; }\n    public int getAge() { return age; }\n    // No setters!\n}\n\nBenefits:\n• Thread-safe by default\n• Safe to share across threads\n• Can be used as HashMap keys safely\n\nExamples in Java: String, Integer, Long, Double, BigInteger, LocalDate'
      },
      {
        q: 'What is a Marker Interface in Java?',
        a: 'A Marker Interface is an EMPTY interface with no methods or constants.\n\nPurpose: To "mark" a class, providing metadata to the JVM or framework.\n\nCommon Marker Interfaces in Java:\n\n1. Serializable (java.io.Serializable):\nclass Student implements Serializable {}\n→ Tells JVM: "This class can be serialized (converted to byte stream)"\n\n2. Cloneable (java.lang.Cloneable):\nclass Student implements Cloneable {}\n→ Tells JVM: "This class allows object cloning via clone() method"\n\n3. Remote (java.rmi.Remote):\n→ Marks a class for remote method invocation (RMI)\n\nExample:\nimport java.io.Serializable;\nclass Student implements Serializable {\n    String name;\n    int age;\n}\n// Now Student objects can be saved to file/sent over network\n\nWhy empty?\nThe interface itself doesn\'t enforce any method.\nThe JVM checks IS-A relationship (instanceof) to decide behavior.\n\nif (obj instanceof Serializable) {\n    // allow serialization\n}\n\nNote: Java 5+ introduced Annotations (@Deprecated, @FunctionalInterface) as a modern alternative to marker interfaces.'
      },
    ]
  },
  {
    title: '📘 4 Pillars of OOPs',
    questions: [
      {
        q: 'What are the 4 Pillars of OOPs? (Most Asked Interview Question)',
        a: '4 Pillars of Object Oriented Programming:\n\n1. Encapsulation:\n• Bundling data + methods together\n• Hiding data using private fields\n• Real Example: ATM Machine – you don\'t see the internal cash mechanism\n• Achievement: private fields + public getters/setters\n\n2. Inheritance:\n• Child class acquires parent class properties\n• Promotes CODE REUSE\n• Real Example: Dog inherits eat() from Animal\n• Keyword: extends\n\n3. Polymorphism:\n• One thing, many forms\n• Overloading = Compile-time\n• Overriding = Runtime\n• Real Example: Animal.sound() → Dog says "Bark", Cat says "Meow"\n\n4. Abstraction:\n• Show WHAT, hide HOW\n• Real Example: Car pedal (you press it; you don\'t know fuel injection details)\n• Achievement: abstract class, interface\n\nQuick Table:\n| Pillar        | Meaning              | Keyword/Tool          |\n|---------------|----------------------|-----------------------|\n| Encapsulation | Data Hiding          | private + getters     |\n| Inheritance   | Code Reuse           | extends               |\n| Polymorphism  | One thing many forms | overloading/overriding|\n| Abstraction   | Hide implementation  | abstract, interface   |'
      },
      {
        q: 'Why is Java not 100% Object Oriented?',
        a: 'Java is NOT 100% Object Oriented because it has PRIMITIVE DATA TYPES that are not objects.\n\nPrimitive types in Java:\n• int\n• char\n• double\n• float\n• boolean\n• byte\n• short\n• long\n\nThese are NOT objects – they are raw values stored in stack memory.\n\nFor 100% OOP, everything must be an object (like Smalltalk).\n\nExample:\nint x = 10; // x is a primitive, not an object\n// Cannot call: x.toString() directly\n\nJava provides Wrapper classes as object equivalents:\n• int → Integer\n• char → Character\n• double → Double\n• boolean → Boolean\n\nInteger obj = Integer.valueOf(10); // now it\'s an object\nobj.toString(); // works!\n\nAutoboxing (Java 5+):\nInteger x = 10; // auto-converts int → Integer\nint y = x;      // auto-converts Integer → int (unboxing)\n\nOther reasons Java is not 100% OOP:\n• Static methods/variables belong to class, not objects\n• main() method is static (doesn\'t need an object)'
      },
    ]
  },
  {
    title: '📘 Most Asked Interview Questions',
    questions: [
      {
        q: 'What is the difference between Method Overloading and Method Overriding?',
        a: 'Overloading vs Overriding:\n\nOverloading:\n• Same class\n• Different parameter types/count\n• Compile-time (resolved at compile time)\n• No inheritance needed\n• Return type can differ\n• Example: add(int, int) and add(int, int, int)\n\nOverriding:\n• Parent + Child class\n• Same method name, same parameters\n• Runtime (resolved at runtime)\n• Inheritance required\n• Return type must be same (or covariant)\n• Example: Animal.sound() and Dog.sound()'
      },
      {
        q: 'What is the Diamond Problem in Java?',
        a: 'The Diamond Problem is an ambiguity in multiple inheritance.\n\n    A (has method m())\n   / \\\n  B   C  (both override m())\n   \\ /\n    D → Which m() does D inherit? Ambiguous!\n\nJava\'s Solution: Classes cannot extend multiple classes.\nclass D extends B, C {} // COMPILATION ERROR ❌\n\nJava allows multiple inheritance only via INTERFACES:\ninterface B { default void m() { ... } }\ninterface C { default void m() { ... } }\nclass D implements B, C {\n    @Override\n    public void m() { B.super.m(); } // must explicitly resolve\n}\n\nThe class must override the conflicting method to resolve the ambiguity.'
      },
      {
        q: 'What is the difference between Abstraction and Encapsulation?',
        a: 'Abstraction vs Encapsulation:\n\nAbstraction:\n• DESIGN level concept\n• Hides COMPLEXITY / IMPLEMENTATION\n• "What does it do?" not "How does it do it?"\n• Achieved via: abstract class, interface\n• Example: Car steering – you turn, car turns. HOW? Hidden.\n\nEncapsulation:\n• IMPLEMENTATION level concept\n• Hides DATA (fields) from direct access\n• "How is the data protected?"\n• Achieved via: private fields + public getters/setters\n• Example: ATM balance is private – you access it only via withdraw()\n\nSimple Rule:\n• Abstraction = Hiding BEHAVIOR details\n• Encapsulation = Hiding DATA details'
      },
      {
        q: 'What is the difference between Interface and Abstract Class? When to use which?',
        a: 'Use Abstract Class when:\n• Classes are closely related and share common code\n• You need constructors\n• You need non-public methods\n• You want partial implementation\n• Example: Animal abstract class with breathe() implemented, sound() abstract\n\nUse Interface when:\n• Unrelated classes need the same capability\n• You need multiple inheritance\n• You\'re defining a contract/capability (not identity)\n• You want 100% abstraction\n• Example: Serializable, Runnable – any class can implement\n\nKey Differences:\n| Feature         | Abstract Class     | Interface          |\n|-----------------|--------------------|--------------------|\n| Multiple inherit| No                 | Yes                |\n| Constructor     | Yes                | No                 |\n| Variables       | Any type           | public static final|\n| Methods         | Abstract+concrete  | Abstract (8+: default/static) |\n| Access modifiers| Any                | public only        |'
      },
      {
        q: 'What is the difference between Association, Aggregation, and Composition?',
        a: 'All three describe object relationships:\n\nAssociation (Uses-A):\n• Loosest relationship\n• No ownership\n• Both objects exist independently\n• Example: Teacher and Student\n\nAggregation (Weak HAS-A):\n• One contains another\n• Child can exist without parent\n• Example: Department has Students (students exist without department)\n\nComposition (Strong HAS-A):\n• Strongest relationship\n• Child CANNOT exist without parent\n• Parent creates and destroys child\n• Example: Car has Engine (engine destroyed when car is destroyed)\n\nStrength: Composition > Aggregation > Association'
      },
      { q: 'What are the 4 Pillars of OOPs?', a: '1. Encapsulation – Data Hiding (private fields + getters/setters)\n2. Inheritance – Code Reuse (extends keyword)\n3. Polymorphism – One thing, many forms (overloading + overriding)\n4. Abstraction – Hide implementation (abstract class + interface)' },
      { q: 'What is Dynamic Method Dispatch?', a: 'When a parent reference holds a child object, the method called depends on the actual object at runtime.\nAnimal a = new Dog();\na.sound(); // calls Dog\'s sound() not Animal\'s\nThis is runtime polymorphism / dynamic dispatch.' },
      { q: 'What is the difference between == and equals()?', a: '== compares memory address (reference)\nequals() compares content/value\nString a = new String("Java");\nString b = new String("Java");\na == b → false (different objects)\na.equals(b) → true (same content)' },
      { q: 'What is a Constructor? Can it be overridden?', a: 'Constructor is a special method to initialize objects. Same name as class, no return type.\nNO – constructors cannot be overridden because they are not inherited.' },
      { q: 'What is the difference between this and super?', a: 'this → refers to current class object\nsuper → refers to parent class object\nthis() → calls current class constructor\nsuper() → calls parent class constructor' },
      { q: 'What is the purpose of the final keyword?', a: 'final variable → cannot be changed (constant)\nfinal method → cannot be overridden\nfinal class → cannot be inherited\nExample: String class is final in Java.' },
      { q: 'What is an Immutable class? How to create one?', a: 'Object state cannot change after creation.\nSteps: final class + private final fields + no setters + initialize in constructor.\nExample: String, Integer in Java.' },
      { q: 'What is Marker Interface?', a: 'Empty interface with no methods.\nUsed to provide metadata/marking to JVM.\nExamples: Serializable, Cloneable\nIf a class implements Serializable, JVM allows its objects to be serialized.' },
      { q: 'What is Upcasting and Downcasting?', a: 'Upcasting: Child → Parent reference (implicit, safe)\nAnimal a = new Dog(); // upcasting\n\nDowncasting: Parent → Child reference (explicit, can fail)\nDog d = (Dog) a; // downcasting\nUse instanceof before downcasting to avoid ClassCastException.' },
      { q: 'What is the Object class?', a: 'Root parent of all Java classes. Every class implicitly extends Object.\nImportant methods: toString(), equals(), hashCode(), getClass(), clone()' },
    ]
  },
];

const totalQuestions = oopsSections.reduce((s, sec) => s + sec.questions.length, 0);

// ── Syntax highlighter ──────────────────────────────────────────────────────
const KW = new Set(['class','interface','enum','public','private','protected','static',
  'final','abstract','synchronized','native','transient','volatile','void','return',
  'new','this','super','extends','implements','import','package','if','else','for',
  'while','do','try','catch','finally','throw','throws','switch','case','break',
  'continue','instanceof','null','true','false']);
const PRIM = new Set(['int','double','float','boolean','char','long','byte','short']);

function highlightLine(line) {
  const tokens = [];
  let i = 0;
  while (i < line.length) {
    if (line[i] === '/' && line[i + 1] === '/') {
      tokens.push(<span key={i} style={{ color: '#6a9955' }}>{line.slice(i)}</span>);
      break;
    }
    if (line[i] === '"') {
      let j = i + 1;
      while (j < line.length && line[j] !== '"') { if (line[j] === '\\') j++; j++; }
      tokens.push(<span key={i} style={{ color: '#ce9178' }}>{line.slice(i, j + 1)}</span>);
      i = j + 1; continue;
    }
    if (line[i] === '@') {
      let j = i + 1;
      while (j < line.length && /\w/.test(line[j])) j++;
      tokens.push(<span key={i} style={{ color: '#dcdcaa' }}>{line.slice(i, j)}</span>);
      i = j; continue;
    }
    if (/[a-zA-Z_]/.test(line[i])) {
      let j = i;
      while (j < line.length && /\w/.test(line[j])) j++;
      const word = line.slice(i, j);
      let color = '#9cdcfe';
      if (KW.has(word) || PRIM.has(word)) color = '#569cd6';
      else if (/^[A-Z]/.test(word)) color = '#4ec9b0';
      tokens.push(<span key={i} style={{ color }}>{word}</span>);
      i = j; continue;
    }
    if (/[0-9]/.test(line[i])) {
      let j = i;
      while (j < line.length && /[0-9.]/.test(line[j])) j++;
      tokens.push(<span key={i} style={{ color: '#b5cea8' }}>{line.slice(i, j)}</span>);
      i = j; continue;
    }
    tokens.push(<span key={i} style={{ color: '#d4d4d4' }}>{line[i]}</span>);
    i++;
  }
  return tokens;
}

function isCodeLine(line) {
  const t = line.trim();
  if (!t) return null;
  if (/^[•→✅❌▲▼|]/.test(t)) return false;
  if (/^\d+\.\s+[A-Z]/.test(t)) return false;
  if (/^[\/\\|\-_\s<>^v]{1,12}$/.test(t)) return false; // ASCII art
  if (/^(class|interface|enum)\s/.test(t)) return true;
  if (/^(public|private|protected|static|final|abstract|synchronized)\s/.test(t)) return true;
  if (/^(void|int|double|float|boolean|char|long|byte|short)\s+\w/.test(t)) return true;
  if (/^(return|throw|new)\s/.test(t)) return true;
  if (/^(if|else)\s*[\({]/.test(t) || t === 'else {') return true;
  if (/^(for|while|do)\s*[\({]/.test(t)) return true;
  if (/^(try|catch|finally)\s*[{(]/.test(t)) return true;
  if (/^(import|package)\s+[\w.]+/.test(t)) return true;
  if (/^@\w+/.test(t)) return true;
  if (t.includes('//')) return true;
  if (t === '{' || /^\}[\s;,]*$/.test(t)) return true;
  if (/^(this|super)\s*[.({]/.test(t)) return true;
  if (/^System\./.test(t)) return true;
  if (/^[A-Z][a-zA-Z0-9]*(<[^>]*>)?\s+[a-z]\w*(\[\])?\s*[=;({]/.test(t)) return true;
  if (/^[A-Z][a-zA-Z0-9]+\s*\(\s*\)\s*\{?$/.test(t)) return true;
  if (/^[A-Z][a-zA-Z0-9]+\s*\([A-Z@]/.test(t)) return true;
  if (/^[A-Z][a-zA-Z0-9]+\.\w+/.test(t)) return true;
  if (/^[a-z_]\w*(\.\w+)+/.test(t)) return true;
  if (/^[a-z_]\w*\s*=\s*/.test(t) && t.endsWith(';')) return true;
  return false;
}

function renderAnswer(text) {
  const lines = text.split('\n');
  const segments = [];
  let i = 0;
  while (i < lines.length) {
    const lt = isCodeLine(lines[i]);
    if (lt === true) {
      const codeLines = [];
      while (i < lines.length) {
        const t = isCodeLine(lines[i]);
        if (t === true) { codeLines.push(lines[i]); i++; }
        else if (t === null && i + 1 < lines.length && isCodeLine(lines[i + 1]) === true) { codeLines.push(''); i++; }
        else break;
      }
      while (codeLines.length && codeLines[codeLines.length - 1] === '') codeLines.pop();
      if (codeLines.length) segments.push({ type: 'code', lines: codeLines });
    } else {
      const textLines = [];
      while (i < lines.length && isCodeLine(lines[i]) !== true) { textLines.push(lines[i]); i++; }
      const content = textLines.join('\n').trim();
      if (content) segments.push({ type: 'text', content });
    }
  }
  return segments.map((seg, idx) => {
    if (seg.type === 'code') {
      return (
        <div key={idx} className="my-3 rounded-lg overflow-hidden border border-[#333] shadow-lg">
          <div className="bg-[#252526] px-3 py-1.5 flex items-center justify-between">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
            </div>
            <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">Java</span>
          </div>
          <pre className="bg-[#1e1e1e] px-5 py-3 overflow-x-auto font-mono text-[13px] leading-6 m-0 whitespace-pre">
            {seg.lines.map((line, li) => <div key={li}>{highlightLine(line)}</div>)}
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
// ────────────────────────────────────────────────────────────────────────────

function OOPSSheet({ auth, setAuth }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [openAnswers, setOpenAnswers] = useState({});
  const [collapsedSections, setCollapsedSections] = useState(
    () => oopsSections.reduce((acc, _, i) => ({ ...acc, [i]: true }), {})
  );
  const questionRefs = useRef({});

  const [lastRead, setLastRead] = useState(() => {
    try { return JSON.parse(localStorage.getItem('oops_revision_last_read')) || null; }
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
        localStorage.setItem('oops_revision_last_read', JSON.stringify(data));
      }
      return { ...prev, [key]: !prev[key] };
    });
  };

  const jumpToLastRead = () => {
    if (!lastRead) return;
    const parts = lastRead.key.split('-');
    const sectionIdx = parseInt(parts[1], 10);
    setCollapsedSections(prev => ({ ...prev, [sectionIdx]: false }));
    setOpenAnswers(prev => ({ ...prev, [lastRead.key]: true }));
    setTimeout(() => {
      const el = questionRefs.current[lastRead.key];
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 80);
  };

  const clearLastRead = () => {
    setLastRead(null);
    localStorage.removeItem('oops_revision_last_read');
  };

  const toggleSection = (sIdx) => {
    setCollapsedSections(prev => ({ ...prev, [sIdx]: !prev[sIdx] }));
  };

  const q = searchQuery.toLowerCase().trim();
  const filteredSections = oopsSections.map(sec => ({
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
      {/* Header */}
      <header className="border-b border-[#1f1f1f] bg-[#0a0a0a]/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link to="/sheet" className="text-yellow-400 hover:text-yellow-300 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div>
              <h1 className="text-2xl font-bold leading-tight">
                <span className="text-yellow-400">OOPS</span> – Questions & Answers
              </h1>
              <p className="text-xs text-gray-500">{totalQuestions} questions · {oopsSections.length} sections</p>
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
        {/* Search */}
        <div className="relative">
          <svg className="w-4 h-4 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search any question or keyword..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl px-5 py-4 pl-12 pr-11 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-400/60 transition-colors text-base"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors text-lg leading-none">×</button>
          )}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Total Questions', value: totalQuestions, color: 'text-yellow-400' },
            { label: 'Revealed', value: revealedCount, color: 'text-emerald-400' },
            { label: 'Topics', value: oopsSections.length, color: 'text-sky-400' },
          ].map(s => (
            <div key={s.label} className="bg-[#111] border border-[#1f1f1f] rounded-xl p-6 text-center">
              <div className={`text-4xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-sm text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Last Read Banner */}
        {lastRead && (
          <div className="flex items-center justify-between bg-yellow-400/8 border border-yellow-400/30 rounded-xl px-4 py-3 gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-yellow-400 text-base flex-shrink-0">📍</span>
              <div className="min-w-0">
                <p className="text-xs text-gray-500 mb-0.5">Last read · {lastRead.sectionTitle}</p>
                <p className="text-sm font-medium text-white truncate">{lastRead.question}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={jumpToLastRead} className="px-3 py-1.5 bg-yellow-400 hover:bg-yellow-300 text-black text-xs font-bold rounded-lg transition-colors">Resume →</button>
              <button onClick={clearLastRead} className="text-gray-600 hover:text-gray-400 text-sm transition-colors">✕</button>
            </div>
          </div>
        )}

        {/* No results */}
        {q && filteredSections.length === 0 && (
          <div className="text-center py-16 text-gray-600">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-sm">No questions match <span className="text-gray-400">"{searchQuery}"</span></p>
            <button onClick={() => setSearchQuery('')} className="mt-3 text-yellow-400 text-xs hover:underline">Clear search</button>
          </div>
        )}

        {/* OOPS Content */}
        <div className="border border-[#2a2a2a] rounded-2xl overflow-hidden">
          <div className="border-t border-[#1f1f1f] px-4 py-4 space-y-0 bg-[#0d0d0d]">
            {filteredSections.map((section, sIdx) => {
              const originalIdx = oopsSections.findIndex(s => s.title === section.title);
              const isCollapsed = q ? false : collapsedSections[originalIdx];
              return (
                <div key={sIdx}>
                  {/* Sub-section header */}
                  <button
                    onClick={() => toggleSection(originalIdx)}
                    className="w-full flex items-center justify-between py-4 group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-yellow-400 font-bold text-lg">{section.title}</span>
                      <span className="text-sm text-gray-500 bg-[#1a1a1a] px-2.5 py-0.5 rounded-full">{section.questions.length}Q</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-px bg-[#1f1f1f] w-20 hidden sm:block" />
                      <svg className={`w-4 h-4 text-yellow-400/60 transition-transform duration-200 ${isCollapsed ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>
                  <div className="h-px bg-[#1f1f1f] mb-2" />
                  {!isCollapsed && (
                    <div>
                      {section.questions.map((item, qIdx) => {
                        const key = `oops-${originalIdx}-${qIdx}`;
                        const isOpen = openAnswers[key];
                        const isLastRead = lastRead?.key === key;
                        return (
                          <div
                            key={key}
                            ref={el => questionRefs.current[key] = el}
                            className={`border-b transition-all rounded-sm ${
                              isOpen
                                ? 'bg-yellow-400/[0.06] border-yellow-400/20'
                                : isLastRead
                                ? 'border-yellow-400/15'
                                : 'border-[#161616]'
                            }`}
                          >
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => toggleAnswer(key, item.q, section.title)}
                                className="flex-1 flex items-center justify-between px-2 py-5 text-left hover:bg-white/[0.03] transition-colors rounded"
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  {isLastRead && <span className="text-yellow-400 text-xs flex-shrink-0">📌</span>}
                                  <span className={`text-[17px] leading-snug ${isLastRead ? 'text-yellow-200' : 'text-gray-200'}`}>{item.q}</span>
                                </div>
                                <svg className={`w-3.5 h-3.5 text-gray-600 flex-shrink-0 ml-3 transition-transform duration-200 ${isOpen ? 'rotate-180 text-yellow-400' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </button>
                              {/* ChatGPT icon */}
                              <a
                                href={`https://chatgpt.com/?q=${encodeURIComponent(`${item.q} in Java OOPs, explain in short.`)}`}
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
                              {/* YouTube icon */}
                              <a
                                href={item.yt || `https://www.youtube.com/results?search_query=${encodeURIComponent(`${item.q} Java OOPs explained`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                title={item.yt ? 'Watch on YouTube' : 'Search on YouTube'}
                                className="flex-shrink-0 p-2 mr-1 text-red-500 hover:text-red-400 hover:scale-125 transition-all duration-300 rounded"
                                onClick={e => e.stopPropagation()}
                              >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                </svg>
                              </a>
                            </div>
                            {isOpen && (
                              <div className="px-3 pb-5 pt-1 space-y-1">
                                {item.a ? renderAnswer(item.a) : (
                                  <p className="text-[15px] text-gray-600 italic">Answer coming soon...</p>
                                )}
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
        </div>

        {/* Search result count */}
        {q && filteredSections.length > 0 && (
          <p className="text-xs text-gray-600 text-center pt-2">{totalVisible} result{totalVisible !== 1 ? 's' : ''} for "{searchQuery}"</p>
        )}
      </div>

      <div className="pb-10" />
      <Footer />
    </div>
  );
}

export default OOPSSheet;
