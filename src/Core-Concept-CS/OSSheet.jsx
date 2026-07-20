import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../sheet-app/components/Footer';
import ThemeToggle from '../sheet-app/components/ThemeToggle';

const osSections = [
  {
    title: '📘 OS Basics',
    questions: [
      {
        q: 'What is an Operating System?',
        a: `An OS is system software that manages hardware/software resources and provides services to programs.

Key roles:
• Interface between user and hardware
• Resource manager (CPU, memory, I/O)
• Security and access control

Real World Analogy: OS is like an office manager. Employees (programs) don't directly touch printers (hardware) — they request through the manager (OS).

Examples: Windows, Linux, macOS, Android`,
      },
      {
        q: 'What is Kernel?',
        a: `Kernel is the core of the OS that directly interacts with hardware.

Types:
• Monolithic Kernel – all OS services in kernel space (Linux). Fast, but a crash can crash everything.
• Microkernel – only essential services in kernel (Minix, QNX). Stable, slower.
• Hybrid Kernel – combination (Windows, macOS).

Flow:
User App → System Call → Kernel → Hardware`,
      },
      {
        q: 'What is a System Call?',
        a: `A System Call lets a user-level program request a kernel-level service.

Types:
• Process Control – fork(), exit(), wait()
• File Operations – open(), read(), write(), close()
• Device Management – ioctl()
• Communication – pipe(), shmget()

How it works:
1. Program calls library function (e.g. printf)
2. Library converts it to a system call (write)
3. CPU switches User Mode → Kernel Mode
4. Kernel executes the service
5. Returns result, CPU switches back to User Mode`,
      },
      {
        q: 'User Mode vs Kernel Mode',
        a: `User Mode:
• Restricted hardware access
• Runs user applications
• A crash only affects that one process

Kernel Mode (Privileged):
• Full hardware access
• Runs OS code
• A crash can crash the entire system

Mode switch happens via System Calls (software interrupt / trap).`,
      },
    ],
  },
  {
    title: '📘 Process Management',
    questions: [
      {
        q: 'What is a Process?',
        a: `A Process is a program in execution — the active instance of a program loaded into memory.

Components in memory:
• Code Section – compiled instructions
• Data Section – global/static variables
• Heap – dynamically allocated memory
• Stack – local variables, function call frames

Program vs Process:
• Program: passive (file on disk)
• Process: active (executing on CPU)`,
      },
      {
        q: 'What are Process States?',
        a: `A process moves through 5 states:

New → Ready → Running → Waiting → Terminated

• New: process being created
• Ready: in ready queue, waiting for CPU
• Running: instructions executing on CPU
• Waiting/Blocked: waiting for I/O or event
• Terminated: process finished

Transitions:
• New → Ready: admitted by scheduler
• Ready → Running: CPU assigned (dispatched)
• Running → Waiting: I/O request made
• Waiting → Ready: I/O completed
• Running → Ready: preempted (time slice expired)
• Running → Terminated: process exits`,
      },
      {
        q: 'What is PCB?',
        a: `Process Control Block (PCB): OS data structure storing all info needed to manage a process.

Contents:
• Process ID (PID) – unique identifier
• Process State – New/Ready/Running/Waiting/Terminated
• Program Counter – address of next instruction
• CPU Registers – saved during context switch
• Scheduling Info – priority, queue pointers
• Memory Info – page tables
• Accounting – CPU time used
• I/O Status – list of open files`,
      },
      {
        q: 'What is Context Switching?',
        a: `Saving the state of a running process and loading the state of the next process.

Steps:
1. Save registers of P1 into P1's PCB
2. Update P1 state: Running → Ready
3. Load registers of P2 from P2's PCB
4. Update P2 state: Ready → Running
5. Jump to P2's program counter

Context switch is pure overhead — no useful work done.
More context switches = more overhead.`,
      },
    ],
  },
  {
    title: '📘 Threads',
    questions: [
      {
        q: 'What is a Thread?',
        a: `A Thread is the smallest unit of CPU execution — lightweight process within a process.

All threads in a process share:
• Code section
• Data section (globals)
• Open files and signals

Each thread has its own:
• Thread ID
• Program Counter
• Registers
• Stack

Example: Browser = 1 process with many threads:
• Thread 1 renders the page
• Thread 2 handles network
• Thread 3 handles user input`,
      },
      {
        q: 'Process vs Thread',
        a: `Process:
• Heavyweight – separate memory space
• Slow to create and switch
• Communicate via IPC (pipes, shared memory)
• Crash in one process doesn't affect others

Thread:
• Lightweight – shares memory within process
• Fast to create and switch
• Communicate via shared memory directly
• Crash in one thread can crash the whole process`,
      },
    ],
  },
  {
    title: '📘 CPU Scheduling',
    questions: [
      {
        q: 'Key Scheduling Terms',
        a: `CPU Scheduling decides which process in the Ready Queue gets the CPU next.

Key Terms:
• AT  = Arrival Time – when process enters ready queue
• BT  = Burst Time – total CPU time needed
• CT  = Completion Time – when process finishes
• TAT = Turnaround Time = CT − AT
• WT  = Waiting Time = TAT − BT
• Response Time = first CPU time − AT

Goals: maximize CPU utilization, minimize TAT and WT.`,
      },
      {
        q: 'FCFS – First Come First Serve (Full Example)',
        a: `Non-Preemptive. Processes execute in arrival order.

Given:
\`\`\`
Process   AT   BT
P1         0    4
P2         1    3
P3         2    5
P4         3    2
\`\`\`
Step-by-step:
• t=0: P1 arrives → runs
• t=4: P1 done. P2,P3,P4 waiting → P2 next (arrived first)
• t=7: P2 done → P3
• t=12: P3 done → P4
• t=14: P4 done

Gantt Chart:
\`\`\`
| P1   | P2  | P3     | P4  |
0      4     7       12    14
\`\`\`
Calculations  (CT → TAT = CT−AT → WT = TAT−BT):
\`\`\`
Process   AT   BT   CT   TAT   WT
P1         0    4    4     4    0
P2         1    3    7     6    3
P3         2    5   12    10    5
P4         3    2   14    11    8

Avg TAT = (4+6+10+11) / 4 = 7.75 ms
Avg WT  = (0+3+5+8)   / 4 = 4.0  ms
\`\`\`
Disadvantage: Convoy Effect — short jobs wait behind long ones.`,
      },
      {
        q: 'SJF – Shortest Job First (Full Example)',
        a: `Non-Preemptive. Pick the process with smallest Burst Time from ready queue.

Given:
\`\`\`
Process   AT   BT
P1         0    6
P2         2    4
P3         4    2
P4         6    3
\`\`\`
Step-by-step:
• t=0: Only P1 available → run P1 (BT=6)
• t=6: P2(4), P3(2), P4(3) available → pick P3 (shortest)
• t=8: P2(4), P4(3) available → pick P4
• t=11: Only P2 → run P2

Gantt Chart:
\`\`\`
| P1     | P3  | P4   | P2    |
0        6     8     11      15
\`\`\`
Calculations:
\`\`\`
Process   AT   BT   CT   TAT   WT
P1         0    6    6     6    0
P2         2    4   15    13    9
P3         4    2    8     4    2
P4         6    3   11     5    2

Avg TAT = (6+13+4+5) / 4 = 7.0  ms
Avg WT  = (0+9+2+2)  / 4 = 3.25 ms
\`\`\`
SJF gives minimum average WT among non-preemptive algorithms.
Preemptive SJF = SRTF (Shortest Remaining Time First).`,
      },
      {
        q: 'Round Robin – Full Example (q = 2)',
        a: `Preemptive. Each process gets CPU for at most q ms, then goes to back of queue.

Given (q = 2 ms):
\`\`\`
Process   AT   BT
P1         0    5
P2         1    3
P3         2    4
\`\`\`
Execution trace:
\`\`\`
t=0:  P1 runs 2ms  → P1 remaining=3   Queue: [P2,P3,P1]
t=2:  P2 runs 2ms  → P2 remaining=1   Queue: [P3,P1,P2]
t=4:  P3 runs 2ms  → P3 remaining=2   Queue: [P1,P2,P3]
t=6:  P1 runs 2ms  → P1 remaining=1   Queue: [P2,P3,P1]
t=8:  P2 runs 1ms  → P2 done ✓        Queue: [P3,P1]
t=9:  P3 runs 2ms  → P3 done ✓        Queue: [P1]
t=11: P1 runs 1ms  → P1 done ✓
\`\`\`
Gantt Chart:
\`\`\`
| P1 | P2 | P3 | P1 | P2 | P3 | P1 |
0    2    4    6    8    9   11   12
\`\`\`
Calculations:
\`\`\`
Process   AT   BT   CT   TAT   WT
P1         0    5   12    12    7
P2         1    3    9     8    5
P3         2    4   11     9    5

Avg TAT = (12+8+9) / 3 = 9.67 ms
Avg WT  = (7+5+5)  / 3 = 5.67 ms
\`\`\`
Larger q → behaves like FCFS. Smaller q → more context switches.`,
      },
      {
        q: 'Priority Scheduling',
        a: `CPU assigned to the process with highest priority (lowest number = highest priority).

Example:
\`\`\`
Process   AT   BT   Priority
P1         0    4       3
P2         1    2       1    ← highest priority
P3         2    3       2
\`\`\`
Non-Preemptive execution:
• t=0: Only P1 available → run P1
• t=4: P2(pri=1), P3(pri=2) → pick P2
• t=6: P3 → run P3
\`\`\`
| P1    | P2  | P3   |
0       4     6      9
\`\`\`
Problem: Starvation — low-priority processes may never get CPU.
Solution: Aging — gradually increase priority of waiting processes.`,
      },
    ],
  },
  {
    title: '📘 Deadlocks',
    questions: [
      {
        q: 'What is Deadlock? Four Conditions.',
        a: `Deadlock: A set of processes are blocked forever, each waiting for a resource held by another.

Example:
P1 holds Resource A, waiting for Resource B
P2 holds Resource B, waiting for Resource A
→ Neither can proceed. Deadlock!

Four Necessary Conditions (ALL must hold simultaneously):
1. Mutual Exclusion – resource used by only one process at a time
2. Hold and Wait – process holds resources while waiting for more
3. No Preemption – resources can't be forcibly taken; must be voluntarily released
4. Circular Wait – P1 waits for P2, P2 waits for P3 … Pn waits for P1`,
      },
      {
        q: "Banker's Algorithm – Full Example",
        a: `Determines if a resource allocation leads to a SAFE STATE.

Setup: 5 processes, 3 resource types (A/B/C). Total = (10, 5, 7)
\`\`\`
         Allocation    Max        Need = Max − Alloc
         A  B  C      A  B  C    A  B  C
P0       0  1  0      7  5  3    7  4  3
P1       2  0  0      3  2  2    1  2  2
P2       3  0  2      9  0  2    6  0  0
P3       2  1  1      2  2  2    0  1  1
P4       0  0  2      4  3  3    4  3  1
\`\`\`
Available = Total − Sum(Alloc) = (10,5,7) − (7,2,5) = (3,3,2)

Safety Algorithm — find safe execution order:
\`\`\`
Work = (3,3,2)
Step 1: P1 Need(1,2,2) ≤ Work(3,3,2) ✓
        Work = (3,3,2)+(2,0,0) = (5,3,2)
Step 2: P3 Need(0,1,1) ≤ Work(5,3,2) ✓
        Work = (5,3,2)+(2,1,1) = (7,4,3)
Step 3: P4 Need(4,3,1) ≤ Work(7,4,3) ✓
        Work = (7,4,3)+(0,0,2) = (7,4,5)
Step 4: P0 Need(7,4,3) ≤ Work(7,4,5) ✓
        Work = (7,4,5)+(0,1,0) = (7,5,5)
Step 5: P2 Need(6,0,0) ≤ Work(7,5,5) ✓
        Work = (7,5,5)+(3,0,2) = (10,5,7)
\`\`\`
Safe Sequence: P1 → P3 → P4 → P0 → P2 ✓  System is SAFE.`,
      },
      {
        q: 'Deadlock Prevention vs Avoidance vs Detection',
        a: `Prevention – eliminate one of the 4 necessary conditions:
• No Hold and Wait: request ALL resources before starting
• Allow Preemption: release held resources if blocked
• No Circular Wait: impose ordering on resource types

Avoidance – grant resources only if system stays safe:
• Banker's Algorithm (requires advance knowledge of max needs)

Detection & Recovery – allow deadlock, detect, then break it:
• Detection: Resource Allocation Graph cycle detection
• Recovery: kill a process, or preempt a resource

Comparison:
• Prevention: conservative, poor resource utilization
• Avoidance: needs prior knowledge, has overhead
• Detection: allows deadlock, then pays recovery cost`,
      },
    ],
  },
  {
    title: '📘 Memory Management',
    questions: [
      {
        q: 'What is Virtual Memory?',
        a: `Virtual Memory lets a process use more memory than physical RAM by using disk as extension.

How it works:
• Each process has its own full virtual address space
• Page Table maps virtual pages → physical frames
• Pages not in RAM are stored on disk (swap space)
• On access, if page not in RAM → Page Fault → load from disk

Benefits:
• Programs can be larger than physical RAM
• Memory isolation between processes (security)
• Better multiprogramming

Demand Paging: only load pages when actually accessed.`,
      },
      {
        q: 'What is Paging?',
        a: `Paging divides logical memory into fixed-size Pages and physical memory into same-sized Frames.

• Page Size = Frame Size (typically 4 KB)
• OS maintains a Page Table per process: Page# → Frame#
• Logical Address  = Page Number + Offset
• Physical Address = Frame Number + Offset

Advantages:
• No external fragmentation (fixed-size blocks)
• Easy per-page memory protection

Disadvantages:
• Internal fragmentation (last page may be partially empty)
• Page table overhead (TLB speeds up translation)`,
      },
      {
        q: 'What is a Page Fault?',
        a: `Page Fault: process accesses a page NOT currently in RAM (it is on disk).

Steps on Page Fault:
1. Access page → Page Table shows "not in RAM"
2. CPU generates Page Fault trap → switches to OS
3. OS checks if access is valid
4. OS finds a free frame (or evicts a page)
5. OS loads required page from disk into frame
6. OS updates Page Table
7. Restart the faulting instruction

Thrashing: process spends more time on page faults than useful work.
Cause: too many processes, too little RAM per process.
Solution: reduce multiprogramming degree, use Working Set model.`,
      },
    ],
  },
  {
    title: '📘 Page Replacement',
    questions: [
      {
        q: 'FIFO Page Replacement – Full Example',
        a: `Replace the page that has been in memory the LONGEST.

Reference String: 7 0 1 2 0 3 0 4 2 3 0 3 2    Frames: 3
\`\`\`
Ref:  7   0   1   2   0   3   0   4   2   3   0   3   2
F1:   7   7   7   2   2   2   2   4   4   4   0   0   0
F2:   -   0   0   0   0   3   3   3   2   2   2   2   2
F3:   -   -   1   1   1   1   0   0   0   3   3   3   3
      F   F   F   F   H   F   F   F   F   F   F   H   H
\`\`\`
Total Page Faults = 10,  Hits = 3

Replacement order: when all frames full, evict the one that arrived FIRST (queue).

Disadvantage: Belady's Anomaly — more frames can cause MORE faults!`,
      },
      {
        q: 'LRU Page Replacement – Full Example',
        a: `Replace the page that was LEAST RECENTLY USED.

Same Reference String: 7 0 1 2 0 3 0 4 2 3 0 3 2    Frames: 3
\`\`\`
Ref:  7   0   1   2   0   3   0   4   2   3   0   3   2
F1:   7   7   7   2   2   2   0   0   0   3   3   3   2
F2:   -   0   0   0   0   3   3   3   2   2   2   2   2
F3:   -   -   1   1   1   1   1   4   4   4   0   0   0
      F   F   F   F   H   F   H   F   F   F   F   H   F
\`\`\`
Total Page Faults = 9,  Hits = 4

LRU uses recent past to predict near future.
LRU is NEVER affected by Belady's Anomaly.
LRU > FIFO in most cases.`,
      },
      {
        q: 'Optimal Page Replacement',
        a: `Replace the page that will NOT be used for the LONGEST TIME in the future.

Same Reference String: 7 0 1 2 0 3 0 4 2 3 0 3 2    Frames: 3
\`\`\`
Ref:  7   0   1   2   0   3   0   4   2   3   0   3   2
F1:   7   7   7   2   2   2   2   2   2   2   2   2   2
F2:   -   0   0   0   0   0   0   4   4   4   0   0   0
F3:   -   -   1   1   1   3   3   3   3   3   3   3   3
      F   F   F   F   H   F   H   F   H   H   F   H   H
\`\`\`
Total Page Faults = 7  (theoretical minimum)

Optimal is NOT implementable (requires future knowledge).
It is used as a BENCHMARK only.

Ranking:  Optimal (7) < LRU (9) < FIFO (10)`,
      },
      {
        q: "What is Belady's Anomaly?",
        a: `In FIFO, adding MORE frames can cause MORE page faults — counter-intuitive!

Classic example: Reference String  1 2 3 4 1 2 5 1 2 3 4 5
\`\`\`
3 Frames →  9 page faults
4 Frames → 10 page faults  ← MORE faults with MORE memory!
\`\`\`
Only FIFO suffers from Belady's Anomaly.
Stack algorithms (LRU, Optimal) are NEVER affected.
(Stack property: pages with n+1 frames ⊇ pages with n frames)`,
      },
    ],
  },
  {
    title: '📘 Synchronization',
    questions: [
      {
        q: 'Critical Section & Race Condition',
        a: `Critical Section: code segment that accesses shared resources (variables, files).

Race Condition: outcome depends on execution order when multiple threads access shared data concurrently.

Example of Race Condition:
\`\`\`
// Shared: counter = 5
// Thread 1 and Thread 2 both run:
counter = counter + 1;   // NOT atomic!

// CPU: LOAD counter → ADD 1 → STORE counter
// Both threads LOAD 5, both get 6, both STORE 6
// Result: counter = 6  instead of  7  ← Race Condition!
\`\`\`
Requirements to solve Critical Section problem:
• Mutual Exclusion – only one process in CS at a time
• Progress – if CS is free, a waiting process enters
• Bounded Waiting – process enters CS within finite time`,
      },
      {
        q: 'What is Mutex?',
        a: `Mutex (Mutual Exclusion Lock): allows only ONE thread to access a resource at a time.

Operations:
• lock()   – grab the mutex (blocks if already held)
• unlock() – release the mutex
\`\`\`
mutex m = UNLOCKED;

// Thread 1:
lock(m);           // acquire lock
  counter++;       // critical section — safe!
unlock(m);         // release lock

// Thread 2 calls lock(m) → BLOCKS until Thread 1 unlocks
\`\`\`
Key properties:
• Only the thread that locked can unlock (ownership)
• Blocked threads queue up; one is woken on unlock
• Prevents race conditions on shared data`,
      },
      {
        q: 'What is Semaphore?',
        a: `Semaphore: integer variable accessed via two atomic operations.

• wait(S) / P(S)  → S--. If S < 0, BLOCK the process.
• signal(S) / V(S) → S++. If blocked processes exist, wake one.
\`\`\`
semaphore S = 1;   // Binary semaphore (acts like mutex)

// Process A:
wait(S);           // S becomes 0
  // critical section
signal(S);         // S becomes 1 again

// Process B calls wait(S) while S=0 → BLOCKS
\`\`\`
Types:
• Binary Semaphore (0 or 1) – same as mutex
• Counting Semaphore (0 to N) – manage N identical resources

Difference from Mutex:
• Mutex has OWNERSHIP – only locker can unlock
• Semaphore has NO OWNERSHIP – any process can signal`,
      },
    ],
  },
  {
    title: '📘 Classical Problems',
    questions: [
      {
        q: 'Producer Consumer Problem',
        a: `Producer generates data into a shared bounded buffer.
Consumer removes data from it.
Problem: don't overfill; don't read empty buffer.

Solution using Semaphores:
\`\`\`
semaphore empty = N;   // N = buffer size, free slots
semaphore full  = 0;   // items currently in buffer
semaphore mutex = 1;   // mutual exclusion on buffer

// Producer:
while (true) {
    produce_item();
    wait(empty);       // wait for a free slot
    wait(mutex);       // lock the buffer
      buffer[in] = item;
      in = (in + 1) % N;
    signal(mutex);     // unlock the buffer
    signal(full);      // notify consumer: item added
}

// Consumer:
while (true) {
    wait(full);        // wait for an item
    wait(mutex);       // lock the buffer
      item = buffer[out];
      out = (out + 1) % N;
    signal(mutex);     // unlock the buffer
    signal(empty);     // notify producer: slot freed
    consume_item();
}
\`\`\`
Rule: wait(mutex) must come AFTER wait(empty/full) to avoid deadlock.`,
      },
      {
        q: 'Readers Writers Problem',
        a: `Multiple readers can read simultaneously.
A writer needs EXCLUSIVE access.

Solution (Reader Preference):
\`\`\`
semaphore rw_mutex = 1;  // exclusive access for writers
semaphore mutex   = 1;   // protect read_count
int read_count    = 0;   // active readers

// Writer:
wait(rw_mutex);
  // write the data
signal(rw_mutex);

// Reader:
wait(mutex);
  read_count++;
  if (read_count == 1)
    wait(rw_mutex);    // first reader blocks writers
signal(mutex);

  // read the data

wait(mutex);
  read_count--;
  if (read_count == 0)
    signal(rw_mutex);  // last reader allows writers
signal(mutex);
\`\`\`
Problem: Writers may starve if readers keep arriving.
Solution: Writers Preference variant.`,
      },
      {
        q: 'Dining Philosophers Problem',
        a: `5 philosophers at a round table. 5 forks — one between each pair.
A philosopher needs BOTH adjacent forks to eat.
Problem: if all pick left fork simultaneously → Deadlock!
\`\`\`
semaphore fork[5] = {1,1,1,1,1};

// Philosopher i:
while (true) {
    think();
    wait(fork[i]);            // pick left fork
    wait(fork[(i+1) % 5]);   // pick right fork
    eat();
    signal(fork[i]);
    signal(fork[(i+1) % 5]);
}
// ALL pick left fork → ALL block → DEADLOCK!
\`\`\`
Solutions:
• Allow max 4 philosophers at a time (break circular wait)
• Odd philosophers: left first; Even: right first
• One philosopher picks in reverse order (asymmetric)`,
      },
    ],
  },
  {
    title: '📘 Disk Scheduling',
    questions: [
      {
        q: 'FCFS & SSTF Disk Scheduling',
        a: `Disk Head starts at position 53.
Request Queue: 98, 183, 37, 122, 14, 124, 65, 67

FCFS — service in arrival order:
\`\`\`
Path: 53→98→183→37→122→14→124→65→67

Total Movement = |98-53|+|183-98|+|37-183|+|122-37|
               + |14-122|+|124-14|+|65-124|+|67-65|
               = 45+85+146+85+108+110+59+2
               = 640 cylinders
\`\`\`
SSTF — pick request CLOSEST to current head:
\`\`\`
Path: 53→65→67→37→14→98→122→124→183

Total Movement = 12+2+30+23+84+24+2+59
               = 236 cylinders
\`\`\`
SSTF is much better but can cause starvation for far requests.`,
      },
      {
        q: 'SCAN & C-SCAN Algorithm',
        a: `SCAN (Elevator): head moves in one direction, services all requests, then reverses.

Head=53, moving toward higher. Queue: 98,183,37,122,14,124,65,67
\`\`\`
Path: 53→65→67→98→122→124→183→(reverse)→37→14

Movement = (183-53) + (183-14)
         = 130 + 169
         = 299 cylinders
\`\`\`
C-SCAN (Circular SCAN):
Head moves in ONE direction only, then jumps back to start (no servicing on return).
\`\`\`
Path: 53→65→67→98→122→124→183→0→14→37

More uniform wait time than SCAN.
\`\`\`
Comparison:
\`\`\`
Algorithm   Movement   Starvation
FCFS          640        No
SSTF          236        Yes (far requests)
SCAN          299        No
C-SCAN       ~300        No (most uniform)
\`\`\``,
      },
    ],
  },
  {
    title: '📘 File System',
    questions: [
      {
        q: 'File Allocation Methods',
        a: `1. Contiguous Allocation:
• File stored in consecutive disk blocks
• Fast sequential & direct access
• External fragmentation — free space scatters
• Hard to grow files
• Example: CD-ROM

2. Linked Allocation:
• Each block has a pointer to the next (linked list)
• No external fragmentation
• Slow random access (must traverse the list)
• Example: FAT (File Allocation Table)

3. Indexed Allocation:
• One index block holds all pointers to data blocks
• Fast direct access O(1)
• Overhead for small files
• Limited file size (bounded by index block)
• Example: Unix inode (multi-level indexing for large files)`,
      },
      {
        q: 'What is an Inode?',
        a: `inode (index node): Unix/Linux data structure storing file metadata.

inode stores:
• File size
• Owner (UID, GID)
• Permissions (rwxrwxrwx)
• Timestamps (created, modified, accessed)
• Number of hard links
• Pointers to data blocks

inode does NOT store: file name (stored in directory entry) or file content.

Multi-level indexing:
• 12 direct pointers → 12 × 4KB = 48 KB
• 1 single indirect   → + ~4 MB
• 1 double indirect   → + ~4 GB
• 1 triple indirect   → + ~4 TB`,
      },
    ],
  },
];

const totalQuestions = osSections.reduce((s, sec) => s + sec.questions.length, 0);

// ── OS Block Highlighter ────────────────────────────────────────────────────
const OS_KW = new Set([
  'wait','signal','lock','unlock','acquire','release',
  'while','if','else','do','for','return','true','false','NULL',
  'semaphore','mutex','int','bool','void',
  'produce_item','consume_item','think','eat','UNLOCKED',
]);

function highlightOSLine(line) {
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
    // Process names P0–P9
    if (line[i] === 'P' && /[0-9]/.test(line[i + 1] || '')) {
      let j = i + 1;
      while (j < line.length && /[0-9]/.test(line[j])) j++;
      tokens.push(<span key={i} style={{ color: '#4ec9b0' }}>{line.slice(i, j)}</span>);
      i = j; continue;
    }
    // Pipe — Gantt chart divider
    if (line[i] === '|') {
      tokens.push(<span key={i} style={{ color: '#569cd6' }}>|</span>);
      i++; continue;
    }
    if (line[i] === '✓') { tokens.push(<span key={i} style={{ color: '#28c840' }}>✓</span>); i++; continue; }
    if (line[i] === '→' || line[i] === '←' || line[i] === '⊇') {
      tokens.push(<span key={i} style={{ color: '#dcdcaa' }}>{line[i]}</span>);
      i++; continue;
    }
    if (/[a-zA-Z_]/.test(line[i])) {
      let j = i;
      while (j < line.length && /\w/.test(line[j])) j++;
      const word = line.slice(i, j);
      let color = '#d4d4d4';
      if (OS_KW.has(word)) color = '#569cd6';
      else if (/^[A-Z_][A-Z0-9_]+$/.test(word) && word.length > 1) color = '#dcdcaa';
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

function renderOSAnswer(text) {
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
      return (
        <div key={idx} className="my-3 rounded-lg overflow-hidden border border-[#333] shadow-lg">
          <div className="bg-[#252526] px-3 py-1.5 flex items-center justify-between">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
            </div>
            <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">OS</span>
          </div>
          <pre className="bg-[#1e1e1e] px-5 py-3 overflow-x-auto font-mono text-[13px] leading-6 m-0 whitespace-pre">
            {seg.lines.map((line, li) => <div key={li}>{highlightOSLine(line)}</div>)}
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

function OSSheet({ auth, setAuth }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [openAnswers, setOpenAnswers] = useState({});
  const [collapsedSections, setCollapsedSections] = useState(
    () => osSections.reduce((acc, _, i) => ({ ...acc, [i]: true }), {})
  );
  const questionRefs = useRef({});

  const [lastRead, setLastRead] = useState(() => {
    try { return JSON.parse(localStorage.getItem('os_revision_last_read')) || null; }
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
        localStorage.setItem('os_revision_last_read', JSON.stringify(data));
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
    localStorage.removeItem('os_revision_last_read');
  };

  const toggleSection = (sIdx) => {
    setCollapsedSections(prev => ({ ...prev, [sIdx]: !prev[sIdx] }));
  };

  const q = searchQuery.toLowerCase().trim();
  const filteredSections = osSections.map(sec => ({
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
            <Link to="/sheet" className="text-yellow-400 hover:text-yellow-300 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div>
              <h1 className="text-2xl font-bold leading-tight">
                <span className="text-yellow-400">Operating System</span> – Questions & Answers
              </h1>
              <p className="text-xs text-gray-500">{totalQuestions} questions · {osSections.length} sections</p>
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
            className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl px-5 py-4 pl-12 pr-11 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-400/60 transition-colors text-base"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors text-lg leading-none">×</button>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Total Questions', value: totalQuestions, color: 'text-yellow-400' },
            { label: 'Revealed', value: revealedCount, color: 'text-emerald-400' },
            { label: 'Topics', value: osSections.length, color: 'text-sky-400' },
          ].map(s => (
            <div key={s.label} className="bg-[#111] border border-[#1f1f1f] rounded-xl p-6 text-center">
              <div className={`text-4xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-sm text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

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

        {q && filteredSections.length === 0 && (
          <div className="text-center py-16 text-gray-600">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-sm">No questions match <span className="text-gray-400">"{searchQuery}"</span></p>
            <button onClick={() => setSearchQuery('')} className="mt-3 text-yellow-400 text-xs hover:underline">Clear search</button>
          </div>
        )}

        <div className="border border-[#2a2a2a] rounded-2xl overflow-hidden">
          <div className="border-t border-[#1f1f1f] px-4 py-4 space-y-0 bg-[#0d0d0d]">
            {filteredSections.map((section, sIdx) => {
              const originalIdx = osSections.findIndex(s => s.title === section.title);
              const isCollapsed = q ? false : collapsedSections[originalIdx];
              return (
                <div key={sIdx}>
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
                        const key = `os-${originalIdx}-${qIdx}`;
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
                              <a
                                href={`https://chatgpt.com/?q=${encodeURIComponent(`${item.q} in operating system, explain in short.`)}`}
                                target="_blank" rel="noopener noreferrer" title="Ask ChatGPT"
                                className="flex-shrink-0 p-2 mr-1 text-gray-500 hover:text-gray-300 hover:scale-125 transition-all duration-300 rounded animate-spin [animation-duration:6s]"
                                onClick={e => e.stopPropagation()}
                              >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.648zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.843-3.371 2.019-1.168a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.4-.679zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.496 4.496 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.603 1.497v2.999l-2.597 1.5-2.603-1.495z"/>
                                </svg>
                              </a>
                              <a
                                href={item.yt || `https://www.youtube.com/results?search_query=${encodeURIComponent(`${item.q} operating system explained`)}`}
                                target="_blank" rel="noopener noreferrer"
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
                                {item.a ? renderOSAnswer(item.a) : (
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

        {q && filteredSections.length > 0 && (
          <p className="text-xs text-gray-600 text-center pt-2">{totalVisible} result{totalVisible !== 1 ? 's' : ''} for "{searchQuery}"</p>
        )}
      </div>

      <div className="pb-10" />
      <Footer />
    </div>
  );
}

export default OSSheet;
