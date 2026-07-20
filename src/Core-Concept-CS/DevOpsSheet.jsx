import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../sheet-app/components/Footer';
import ThemeToggle from '../sheet-app/components/ThemeToggle';

const osSections = [
	{
		title: 'File and Directory Operations',
		questions: [
			{ q: 'pwd', fullForm: 'Print Working Directory', meaning: 'Show current working directory path', use: ['pwd'] },
			{ q: 'ls', fullForm: 'List', meaning: 'List files and directories', use: ['ls', 'ls -l', 'ls -a'] },
			{ q: 'cd', fullForm: 'Change Directory', meaning: 'Move between directories', use: ['cd folder_name', 'cd ..', 'cd ~'] },
			{ q: 'touch', fullForm: 'No exact full form', meaning: 'Create empty file or update timestamp', use: ['touch file.txt'] },
			{ q: 'mkdir', fullForm: 'Make Directory', meaning: 'Create a new directory', use: ['mkdir my_folder'] },
			{ q: 'rmdir', fullForm: 'Remove Directory', meaning: 'Delete empty directory', use: ['rmdir empty_folder'] },
			{ q: 'rm', fullForm: 'Remove', meaning: 'Delete files/directories', use: ['rm file.txt', 'rm -r folder'] },
			{ q: 'cp', fullForm: 'Copy', meaning: 'Copy files or directories', use: ['cp source.txt target.txt', 'cp -r src_dir dest_dir'] },
			{ q: 'mv', fullForm: 'Move', meaning: 'Move or rename files/directories', use: ['mv old.txt new.txt', 'mv file.txt /tmp/'] },
			{ q: 'find', fullForm: 'No full form', meaning: 'Search for files and directories', use: ['find . -name "*.js"'] },
			{ q: 'tree', fullForm: 'No full form', meaning: 'Show directory structure as a tree', use: ['tree', 'tree -L 2'] },
			{ q: 'ln', fullForm: 'Link', meaning: 'Create links between files', use: ['ln file.txt hardlink', 'ln -s file.txt softlink'] }
		]
	},
	{
		title: 'File Viewing and Manipulation',
		questions: [
			{ q: 'cat', fullForm: 'Concatenate', meaning: 'Display and combine file contents', use: ['cat file.txt'] },
			{ q: 'more / less', fullForm: 'No full form', meaning: 'View file page by page', use: ['more file.txt', 'less file.txt'] },
			{ q: 'head / tail', fullForm: 'No full form', meaning: 'Show beginning/end of file', use: ['head -n 10 file.txt', 'tail -n 10 file.txt', 'tail -f app.log'] },
			{ q: 'grep', fullForm: 'Global Regular Expression Print', meaning: 'Search text patterns in files', use: ['grep "error" app.log', 'grep -R "TODO" .'] },
			{ q: 'sed', fullForm: 'Stream Editor', meaning: 'Perform text transformations', use: ['sed "s/old/new/g" file.txt'] },
			{ q: 'awk', fullForm: 'Aho Weinberger Kernighan', meaning: 'Pattern scanning and text processing', use: ['awk "{print $1}" file.txt'] },
			{ q: 'sort', fullForm: 'No full form', meaning: 'Sort lines in text files', use: ['sort file.txt', 'sort -r file.txt'] },
			{ q: 'wc', fullForm: 'Word Count', meaning: 'Count lines/words/chars/bytes', use: ['wc file.txt', 'wc -l file.txt', 'wc -w file.txt'] }
		]
	},
	{
		title: 'User and Permissions',
		questions: [
			{ q: 'useradd / userdel', fullForm: 'No exact full form', meaning: 'Add or delete user accounts', use: ['sudo useradd alice', 'sudo userdel alice'] },
			{ q: 'passwd', fullForm: 'Password', meaning: 'Change user password', use: ['passwd', 'sudo passwd alice'] },
			{ q: 'groupadd / groupdel', fullForm: 'No exact full form', meaning: 'Add or delete user groups', use: ['sudo groupadd devops', 'sudo groupdel devops'] },
			{ q: 'id', fullForm: 'No full form', meaning: 'Display user and group IDs', use: ['id', 'id username'] },
			{ q: 'chmod', fullForm: 'Change Mode', meaning: 'Change file permissions', use: ['chmod 644 file.txt', 'chmod +x script.sh'] },
			{ q: 'chown', fullForm: 'Change Owner', meaning: 'Change file ownership', use: ['sudo chown user:group file.txt'] },
			{ q: 'chgrp', fullForm: 'Change Group', meaning: 'Change file group ownership', use: ['sudo chgrp developers file.txt'] },
			{ q: 'sudo', fullForm: 'Superuser Do', meaning: 'Run command with elevated privileges', use: ['sudo apt update', 'sudo systemctl restart nginx'] }
		]
	},
	{
		title: 'Process and System Management',
		questions: [
			{ q: 'ps', fullForm: 'Process Status', meaning: 'List running processes', use: ['ps', 'ps aux'] },
			{ q: 'top', fullForm: 'No exact full form', meaning: 'Live process monitor', use: ['top'] },
			{ q: 'kill', fullForm: 'No full form', meaning: 'Terminate process by PID', use: ['kill PID', 'kill -9 PID'] },
			{ q: 'systemctl', fullForm: 'System Control', meaning: 'Manage systemd services', use: ['systemctl status nginx', 'sudo systemctl restart nginx'] },
			{ q: 'df', fullForm: 'Disk Free', meaning: 'Show filesystem space usage', use: ['df -h'] },
			{ q: 'du', fullForm: 'Disk Usage', meaning: 'Show directory/file size usage', use: ['du -h', 'du -sh folder'] },
			{ q: 'free', fullForm: 'No full form', meaning: 'Display RAM usage', use: ['free -h'] },
			{ q: 'uptime', fullForm: 'No full form', meaning: 'Show how long system has been running', use: ['uptime'] },
			{ q: 'nice', fullForm: 'No full form', meaning: 'Start process with custom priority', use: ['nice -n 10 command'] }
		]
	},
	{
		title: 'Networking',
		questions: [
			{ q: 'ifconfig / ip', fullForm: 'Interface Configuration / IP utility', meaning: 'Display and configure network interfaces', use: ['ifconfig', 'ip a'] },
			{ q: 'netstat', fullForm: 'Network Statistics', meaning: 'Show network connections and stats', use: ['netstat -tulnp'] },
			{ q: 'ss', fullForm: 'Socket Statistics', meaning: 'Show socket information', use: ['ss -tulnp'] },
			{ q: 'ping', fullForm: 'Packet Internet Groper', meaning: 'Test network connectivity', use: ['ping google.com'] },
			{ q: 'traceroute', fullForm: 'Trace Route', meaning: 'Show path packets take to host', use: ['traceroute google.com'] },
			{ q: 'telnet', fullForm: 'Teletype Network', meaning: 'Connect to remote host/port', use: ['telnet host 80'] },
			{ q: 'ssh', fullForm: 'Secure Shell', meaning: 'Secure remote login', use: ['ssh user@server_ip'] },
			{ q: 'scp', fullForm: 'Secure Copy', meaning: 'Securely copy files between hosts', use: ['scp file.txt user@server:/path'] },
			{ q: 'curl / wget', fullForm: 'Client URL / Web Get', meaning: 'Download or request internet resources', use: ['curl -I https://example.com', 'wget https://example.com/file.zip'] }
		]
	},
	{
		title: 'Logs and Troubleshooting',
		questions: [
			{ q: 'journalctl', fullForm: 'Journal Control', meaning: 'View systemd logs', use: ['journalctl -xe', 'journalctl -u nginx'] },
			{ q: 'tail / grep (log files)', fullForm: 'No full form', meaning: 'Inspect and filter logs for troubleshooting', use: ['tail -f /var/log/syslog', 'grep "ERROR" /var/log/app.log'] },
			{ q: 'dmesg', fullForm: 'Display Message', meaning: 'Show kernel ring buffer messages', use: ['dmesg | tail'] },
			{ q: 'strace', fullForm: 'System Trace', meaning: 'Trace system calls/signals of process', use: ['strace -p PID'] },
			{ q: 'lsof', fullForm: 'List Open Files', meaning: 'List open files and processes', use: ['lsof -i :3000'] },
			{ q: 'nc', fullForm: 'Netcat', meaning: 'Read/write across network connections', use: ['nc -zv localhost 80'] },
			{ q: 'tcpdump', fullForm: 'No full form', meaning: 'Capture and analyze network packets', use: ['sudo tcpdump -i any port 80'] }
		]
	},
	{
		title: 'Package Management',
		questions: [
			{ q: 'yum / dnf', fullForm: 'Yellowdog Updater Modified / Dandified YUM', meaning: 'Manage packages on RHEL-based systems', use: ['sudo yum install nginx', 'sudo dnf install nginx'] },
			{ q: 'rpm', fullForm: 'RPM Package Manager', meaning: 'Manage RPM packages directly', use: ['rpm -qa', 'sudo rpm -ivh package.rpm'] },
			{ q: 'yum list / dnf list', fullForm: 'No full form', meaning: 'List installed/available packages', use: ['yum list installed', 'dnf list installed'] },
			{ q: 'yum install / dnf install', fullForm: 'No full form', meaning: 'Install packages', use: ['sudo yum install git', 'sudo dnf install git'] },
			{ q: 'yum remove / dnf remove', fullForm: 'No full form', meaning: 'Remove packages', use: ['sudo yum remove git', 'sudo dnf remove git'] },
			{ q: 'yum update / dnf update', fullForm: 'No full form', meaning: 'Update packages', use: ['sudo yum update', 'sudo dnf update'] },
			{ q: 'yum search / dnf search', fullForm: 'No full form', meaning: 'Search package repositories', use: ['yum search nginx', 'dnf search nginx'] }
		]
	},
	{
		title: 'Text Processing and Manipulation',
		questions: [
			{ q: 'awk', fullForm: 'Aho Weinberger Kernighan', meaning: 'Pattern-based text processing', use: ['awk "{print $2}" file.txt'] },
			{ q: 'sed', fullForm: 'Stream Editor', meaning: 'Edit/transform text streams', use: ['sed "s/foo/bar/g" file.txt'] },
			{ q: 'cut', fullForm: 'No exact full form', meaning: 'Extract sections from each line', use: ['cut -d "," -f1 file.csv'] },
			{ q: 'join', fullForm: 'No full form', meaning: 'Join two files on common field', use: ['join file1.txt file2.txt'] },
			{ q: 'split', fullForm: 'No full form', meaning: 'Split a file into chunks', use: ['split -l 1000 bigfile.txt part_'] },
			{ q: 'paste', fullForm: 'No full form', meaning: 'Merge lines from files', use: ['paste file1.txt file2.txt'] },
			{ q: 'rev', fullForm: 'Reverse', meaning: 'Reverse each line character-wise', use: ['rev file.txt'] },
			{ q: 'uniq', fullForm: 'Unique', meaning: 'Remove adjacent duplicate lines', use: ['sort file.txt | uniq'] },
			{ q: 'diff', fullForm: 'Difference', meaning: 'Compare files line by line', use: ['diff file1.txt file2.txt'] }
		]
	},
	{
		title: 'Compression and Archiving',
		questions: [
			{ q: 'tar', fullForm: 'Tape Archive', meaning: 'Archive and optionally compress files', use: ['tar -cvf archive.tar folder/', 'tar -xvf archive.tar'] },
			{ q: 'gzip / gunzip', fullForm: 'GNU zip / GNU unzip', meaning: 'Compress/decompress with gzip', use: ['gzip file.txt', 'gunzip file.txt.gz'] },
			{ q: 'bzip2 / bunzip2', fullForm: 'Burrows-Wheeler zip / unzip', meaning: 'Compress/decompress with bzip2', use: ['bzip2 file.txt', 'bunzip2 file.txt.bz2'] },
			{ q: 'zip / unzip', fullForm: 'No full form', meaning: 'Create/extract ZIP archives', use: ['zip -r archive.zip folder/', 'unzip archive.zip'] },
			{ q: 'xz / unxz', fullForm: 'LZMA2-based compressor', meaning: 'Compress/decompress with xz', use: ['xz file.txt', 'unxz file.txt.xz'] }
		]
	},
	{
		title: 'Monitoring and Resource Usage',
		questions: [
			{ q: 'iotop', fullForm: 'Input/Output Top', meaning: 'Monitor per-process disk I/O', use: ['sudo iotop'] },
			{ q: 'atop', fullForm: 'Advanced Top', meaning: 'Advanced system/process monitor', use: ['atop'] },
			{ q: 'vmstat', fullForm: 'Virtual Memory Statistics', meaning: 'Report memory/CPU/process stats', use: ['vmstat', 'vmstat 1 5'] },
			{ q: 'sar', fullForm: 'System Activity Report', meaning: 'Collect/report system activity', use: ['sar -u 1 5'] },
			{ q: 'nmon', fullForm: 'Nigel Monitor', meaning: 'Performance monitoring tool', use: ['nmon'] },
			{ q: 'iftop', fullForm: 'Interface Top', meaning: 'Monitor real-time network bandwidth', use: ['sudo iftop'] }
		]
	},
	{
		title: 'Users and Groups',
		questions: [
			{ q: 'who', fullForm: 'No full form', meaning: 'Show logged-in users', use: ['who'] },
			{ q: 'w', fullForm: 'No full form', meaning: 'Show logged-in users and activity', use: ['w'] },
			{ q: 'last', fullForm: 'No full form', meaning: 'Show login history', use: ['last'] },
			{ q: 'whoami', fullForm: 'Who Am I', meaning: 'Display current username', use: ['whoami'] },
			{ q: 'su', fullForm: 'Substitute User', meaning: 'Switch user / become root', use: ['su -', 'su username'] },
			{ q: 'groups', fullForm: 'No full form', meaning: 'List user group memberships', use: ['groups', 'groups username'] },
			{ q: 'newgrp', fullForm: 'New Group', meaning: 'Change effective group ID', use: ['newgrp developers'] },
			{ q: 'id', fullForm: 'No full form', meaning: 'Display user and group information', use: ['id', 'id username'] },
			{ q: 'chpasswd', fullForm: 'Change Password', meaning: 'Batch update passwords', use: ['echo "user:pass" | sudo chpasswd'] }
		]
	},
	{
		title: 'Disk and Filesystem Operations',
		questions: [
			{ q: 'mount / umount', fullForm: 'Mount / Unmount', meaning: 'Attach or detach filesystems', use: ['sudo mount /dev/sdb1 /mnt/data', 'sudo umount /mnt/data'] },
			{ q: 'fdisk', fullForm: 'Fixed Disk', meaning: 'Disk partitioning utility', use: ['sudo fdisk -l'] },
			{ q: 'parted / gparted', fullForm: 'Partition Editor', meaning: 'Manage partitions (CLI/GUI)', use: ['sudo parted /dev/sdb print'] },
			{ q: 'mkfs', fullForm: 'Make Filesystem', meaning: 'Create filesystem on partition', use: ['sudo mkfs.ext4 /dev/sdb1'] },
			{ q: 'du', fullForm: 'Disk Usage', meaning: 'Display directory space usage', use: ['du -sh /var/log'] },
			{ q: 'ncdu', fullForm: 'NCurses Disk Usage', meaning: 'Interactive disk usage analyzer', use: ['ncdu /'] },
			{ q: 'sync', fullForm: 'Synchronize', meaning: 'Flush cached writes to disk', use: ['sync'] },
			{ q: 'badblocks', fullForm: 'No full form', meaning: 'Check storage for bad blocks', use: ['sudo badblocks -sv /dev/sdb'] },
			{ q: 'quota', fullForm: 'No full form', meaning: 'Manage/view disk quota limits', use: ['quota -v username'] },
			{ q: 'df', fullForm: 'Disk Free', meaning: 'Display filesystem free/used space', use: ['df -h'] },
			{ q: 'system-config-firewall', fullForm: 'System Config Firewall', meaning: 'Configure firewall settings', use: ['sudo system-config-firewall'] }
		]
	}
];

const totalOSQuestions = osSections.reduce((s, sec) => s + sec.questions.length, 0);
const totalQuestions = totalOSQuestions;

function DevOpsSheet({ auth, setAuth }) {
	const navigate = useNavigate();
	const [searchQuery, setSearchQuery] = useState('');
	const [openAnswers, setOpenAnswers] = useState({});
	const [osOpen, setOsOpen] = useState(false);
	const [linuxOpen, setLinuxOpen] = useState(false);
	const [collapsedSections, setCollapsedSections] = useState(
		() => osSections.reduce((acc, _, i) => ({ ...acc, [i]: true }), {})
	);
	const questionRefs = useRef({});

	const [lastRead, setLastRead] = useState(() => {
		try { return JSON.parse(localStorage.getItem('devops_revision_last_read')) || null; }
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
				localStorage.setItem('devops_revision_last_read', JSON.stringify(data));
			}
			return { ...prev, [key]: !prev[key] };
		});
	};

	const jumpToLastRead = () => {
		if (!lastRead) return;
		const parts = lastRead.key.split('-');
		const sectionIdx = parseInt(parts[1], 10);
		setOsOpen(true);
		setLinuxOpen(true);
		setCollapsedSections(prev => ({ ...prev, [sectionIdx]: false }));
		setOpenAnswers(prev => ({ ...prev, [lastRead.key]: true }));
		setTimeout(() => {
			const el = questionRefs.current[lastRead.key];
			if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
		}, 80);
	};

	const clearLastRead = () => {
		setLastRead(null);
		localStorage.removeItem('devops_revision_last_read');
	};

	const q = searchQuery.toLowerCase().trim();
	const filteredSections = osSections.map(sec => ({
		...sec,
		questions: q
			? sec.questions.filter(item =>
				[
					item.q,
					item.a || '',
					item.fullForm || '',
					item.meaning || '',
					(item.use || []).join(' ')
				].join(' ').toLowerCase().includes(q)
			)
			: sec.questions,
	})).filter(sec => sec.questions.length > 0);

	const totalVisible = filteredSections.reduce((s, sec) => s + sec.questions.length, 0);

	const examplesByQuestion = {
		'pwd': ['pwd', '# /home/ashish'],
		'ls': ['ls', '# project1  notes.txt'],
		'cd': ['cd project1', 'pwd', '# /home/ashish/project1'],
		'touch': ['touch file.txt', 'ls', '# file.txt'],
		'mkdir': ['mkdir test', 'ls', '# file.txt  test'],
		'rmdir': ['rmdir test', 'ls', '# file.txt'],
		'rm': ['rm file.txt', 'ls', '# (empty)'],
		'cp': ['touch a.txt', 'cp a.txt b.txt', 'ls', '# a.txt  b.txt'],
		'mv': ['mv a.txt new.txt', 'ls', '# new.txt  b.txt'],
		'find': ['find . -name "new.txt"', '# ./new.txt'],
		'tree': ['tree', '# .', '# ├── new.txt', '# └── b.txt'],
		'ln': ['ln -s new.txt link.txt', 'ls', '# new.txt  b.txt  link.txt'],
		'cat': ['cat new.txt', '# (empty)'],
		'more / less': ['less new.txt', '# (opens file viewer)'],
		'head / tail': ['head -n 1 new.txt', '# first line', 'tail -n 1 new.txt', '# last line'],
		'grep': ['grep "hello" new.txt', '# hello world'],
		'sed': ["sed 's/hello/hi/g' new.txt", '# hi world'],
		'awk': ["awk '{print $1}' new.txt", '# hello'],
		'sort': ['sort file.txt', '# sorted lines'],
		'wc': ['wc file.txt', '# 5  20  100 file.txt'],
		'useradd / userdel': ['sudo useradd ashish'],
		'passwd': ['sudo passwd ashish'],
		'id': ['id', '# uid=1000 gid=1000'],
		'chmod': ['chmod 755 new.txt'],
		'chown': ['sudo chown ashish new.txt'],
		'ps': ['ps', '# PID CMD'],
		'top': ['top', '# (live processes)'],
		'kill': ['kill 1234'],
		'systemctl': ['sudo systemctl start nginx'],
		'df': ['df -h', '# disk usage'],
		'du': ['du -sh .', '# 10M .'],
		'free': ['free -m', '# memory usage'],
		'uptime': ['uptime', '# 2 hours'],
		'ifconfig / ip': ['ip a', '# network info'],
		'netstat': ['netstat -tuln', '# show open ports'],
		'ss': ['ss -l', '# socket stats'],
		'ping': ['ping google.com', '# replies'],
		'traceroute': ['traceroute google.com', '# route path'],
		'telnet': ['telnet example.com 80', '# connected'],
		'ssh': ['ssh user@192.168.1.1'],
		'scp': ['scp file.txt user@host:/home/'],
		'curl / wget': ['curl https://example.com', 'wget https://example.com/file.zip', '# downloading...'],
		'journalctl': ['journalctl'],
		'dmesg': ['dmesg'],
		'strace': ['strace ls', '# system calls'],
		'lsof': ['lsof -i :80'],
		'nc': ['nc -l 1234', '# listening'],
		'tcpdump': ['tcpdump -i eth0', '# packets'],
		'rpm': ['rpm -ivh file.rpm', '# installed'],
		'yum list / dnf list': ['dnf list installed', '# packages list'],
		'yum search / dnf search': ['dnf search nginx', '# search result'],
		'yum install / dnf install': ['sudo yum install nginx'],
		'yum remove / dnf remove': ['sudo yum remove nginx'],
		'yum update / dnf update': ['sudo yum update'],
		'cut': ['cut -d " " -f1 file.txt'],
		'join': ['join file1.txt file2.txt', '# merged output'],
		'split': ['split -l 5 file.txt', '# xaa, xab files created'],
		'paste': ['paste file1.txt file2.txt', '# merged lines'],
		'rev': ['rev file.txt', '# reversed lines'],
		'uniq': ['uniq file.txt'],
		'diff': ['diff a.txt b.txt'],
		'tar': ['tar -cvf file.tar folder/'],
		'gzip / gunzip': ['gzip file.txt', 'gunzip file.txt.gz', '# file.txt'],
		'bzip2 / bunzip2': ['bunzip2 file.txt.bz2', '# file.txt'],
		'zip / unzip': ['zip file.zip file.txt', 'unzip file.zip', '# extracted files'],
		'xz / unxz': ['xz file.txt', '# file.txt.xz', 'unxz file.txt.xz', '# file.txt'],
		'vmstat': ['vmstat'],
		'iotop': ['iotop'],
		'atop': ['atop', '# system stats'],
		'sar': ['sar', '# activity report'],
		'nmon': ['nmon', '# monitor UI'],
		'iftop': ['iftop', '# network usage'],
		'who': ['who', '# logged users'],
		'w': ['w', '# user activity'],
		'last': ['last', '# login history'],
		'whoami': ['whoami', '# ashish'],
		'su': ['su root'],
		'groups': ['groups', '# group list'],
		'newgrp': ['newgrp devs', '# switched group'],
		'chpasswd': ['echo "user:1234" | chpasswd', '# password updated'],
		'mount / umount': ['mount /dev/sdb1 /mnt', 'umount /mnt']
		,
		'fdisk': ['fdisk -l', '# partitions list'],
		'parted / gparted': ['parted /dev/sdb', '# partition tool'],
		'mkfs': ['mkfs.ext4 /dev/sdb1', '# filesystem created'],
		'ncdu': ['ncdu', '# disk analyzer UI'],
		'sync': ['sync', '# data written to disk'],
		'badblocks': ['badblocks /dev/sdb', '# check errors'],
		'quota': ['quota -u user', '# usage info.']
	};

	const getExamples = (question) => examplesByQuestion[String(question || '').toLowerCase()] || [];

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
								<span className="text-yellow-400">DevOps</span> Guide
							</h1>
							<p className="text-xs text-gray-500">{totalQuestions} questions · {osSections.length} sections</p>
						</div>
					</div>
					<div className="flex items-center gap-3">
						<ThemeToggle />
            <span className="text-gray-400 text-sm hidden sm:block">{auth.user?.username}</span>
						<button
							onClick={handleLogout}
							className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-sm rounded-lg transition-colors"
						>
							Logout
						</button>
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
						{ label: 'Topics', value: osSections.length, color: 'text-sky-400' },
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

				{/* ── ROADMAP MODULE ── */}
				<div className="border border-[#2a2a2a] rounded-2xl overflow-hidden bg-[#0d0d0d]">
					<div className="px-6 py-5 bg-[#111] border-b border-[#1f1f1f] flex items-center justify-between gap-4">
						<div>
							<p className="text-xl font-bold text-yellow-400">🗺️ DevOps Roadmap Module</p>
							<p className="text-xs text-gray-500 mt-0.5">Quick access to your roadmap PDF</p>
						</div>
						<a
							href="https://drive.google.com/file/d/1AhfO_hhII-IVwhiiq1T_UCzp_lQMoDUt/view?usp=sharing"
							target="_blank"
							rel="noopener noreferrer"
							className="px-4 py-2 rounded-lg bg-yellow-400 text-black text-sm font-bold hover:bg-yellow-300 transition-colors"
						>
							Open Roadmap PDF
						</a>
					</div>
				</div>

				{/* ── OPERATING SYSTEM MODULE ── */}
				<div className="border border-[#2a2a2a] rounded-2xl overflow-hidden">
					<button
						onClick={() => setOsOpen(prev => !prev)}
						className="w-full flex items-center justify-between px-6 py-5 bg-[#111] hover:bg-[#161616] transition-colors group"
					>
						<div className="flex items-center gap-4">
							<span className="text-2xl">🖥️</span>
							<div className="text-left">
								<p className="text-xl font-bold text-emerald-400">Operating System</p>
								<p className="text-xs text-gray-500 mt-0.5">{osSections.length} sections · {totalOSQuestions} questions</p>
							</div>
						</div>
						<div className="flex items-center gap-3">
							<span className="text-xs text-gray-600 bg-[#1a1a1a] px-3 py-1 rounded-full border border-[#2a2a2a]">{totalOSQuestions}Q</span>
							<svg className={`w-5 h-5 text-emerald-400/70 transition-transform duration-300 ${osOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
							</svg>
						</div>
					</button>

					{(osOpen || q) && (
					<div className="border-t border-[#1f1f1f] px-4 py-4 bg-[#0d0d0d]">
						{/* ── LINUX SUB-MODULE ── */}
						<div className="border border-[#2a2a2a] rounded-xl overflow-hidden">
							<button
								onClick={() => setLinuxOpen(prev => !prev)}
								className="w-full flex items-center justify-between px-5 py-4 bg-[#0f0f0f] hover:bg-[#161616] transition-colors"
							>
								<div className="flex items-center gap-4">
									<span className="text-2xl">🐧</span>
									<div className="text-left">
										<p className="text-lg font-bold text-emerald-400">Linux</p>
										<p className="text-xs text-gray-500 mt-0.5">{osSections.length} sections · {totalOSQuestions} questions</p>
									</div>
								</div>
								<div className="flex items-center gap-3">
									<span className="text-xs text-gray-600 bg-[#1a1a1a] px-3 py-1 rounded-full border border-[#2a2a2a]">{totalOSQuestions}Q</span>
									<svg className={`w-5 h-5 text-emerald-400/70 transition-transform duration-300 ${linuxOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
									</svg>
								</div>
							</button>

							{(linuxOpen || q) && (
								<div className="border-t border-[#1f1f1f] px-4 py-4 space-y-0 bg-[#0d0d0d]">
									{filteredSections.map((section, sIdx) => {
										const originalIdx = osSections.findIndex(s => s.title === section.title);
										const isCollapsed = q ? false : collapsedSections[originalIdx];
										return (
											<div key={sIdx}>
										<button
											onClick={() => setCollapsedSections(prev => ({ ...prev, [originalIdx]: !prev[originalIdx] }))}
											className="w-full flex items-center justify-between py-4 group"
										>
											<div className="flex items-center gap-3">
												<span className="text-emerald-400 font-bold text-lg">{section.title}</span>
												<span className="text-sm text-gray-500 bg-[#1a1a1a] px-2.5 py-0.5 rounded-full">{section.questions.length}Q</span>
											</div>
											<div className="flex items-center gap-2">
												<div className="flex-1 h-px bg-[#1f1f1f] w-20 hidden sm:block" />
												<svg className={`w-4 h-4 text-emerald-400/60 transition-transform duration-200 ${isCollapsed ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
													const isLastReadItem = lastRead?.key === key;
													return (
														<div
															key={key}
															ref={el => questionRefs.current[key] = el}
															className={`border-b transition-all rounded-sm ${
																isOpen
																	? 'bg-emerald-400/[0.06] border-emerald-400/20'
																	: isLastReadItem
																	? 'border-emerald-400/15'
																	: 'border-[#161616]'
															}`}
														>
															<div className="flex items-center gap-1">
																<button
																	onClick={() => toggleAnswer(key, item.q, section.title)}
																	className="flex-1 flex items-center justify-between px-2 py-5 text-left hover:bg-white/[0.03] transition-colors rounded"
																>
																	<div className="flex items-center gap-2 min-w-0">
																		{isLastReadItem && <span className="text-emerald-400 text-xs flex-shrink-0">📌</span>}
																		<span className={`text-[17px] leading-snug ${isLastReadItem ? 'text-emerald-200' : 'text-gray-200'}`}>{item.q}</span>
																	</div>
																	<svg className={`w-3.5 h-3.5 text-gray-600 flex-shrink-0 ml-3 transition-transform duration-200 ${isOpen ? 'rotate-180 text-emerald-400' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
																		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
																	</svg>
																</button>
																{/* ChatGPT icon */}
																<a
																	href={`https://chatgpt.com/?q=${encodeURIComponent(`${item.q} in Linux/DevOps, explain me and how to use with example.`)}`}
																	target="chatgpt_reuse_window"
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
																<div className="px-1 pb-5 pt-2">
																	{(item.fullForm || item.meaning || item.use) ? (
																		<div className="space-y-2 px-2 pb-1">
																			<p className="text-[15px] leading-relaxed">
																				<span className="text-yellow-400 font-semibold">Full form:</span>{' '}
																				<span className="text-yellow-200">{item.fullForm || 'No full form'}</span>
																			</p>
																			<p className="text-[15px] leading-relaxed">
																				<span className="text-cyan-400 font-semibold">Meaning:</span>{' '}
																				<span className="text-cyan-200">{item.meaning || 'Not available'}</span>
																			</p>
																			<div>
																				<p className="text-[15px]">
																					<span className="text-emerald-400 font-semibold">Use:</span>
																				</p>
																				<div className="mt-1 bg-[#101215] border border-emerald-400/20 rounded-lg p-3 space-y-1">
																					{(item.use || []).map((line, lineIdx) => {
																						const commentIndex = line.indexOf('#');
																						const commandPart = commentIndex >= 0 ? line.slice(0, commentIndex).trimEnd() : line;
																						const commentPart = commentIndex >= 0 ? line.slice(commentIndex) : '';
																						return (
																							<p key={lineIdx} className="font-mono text-[14px] leading-relaxed">
																								<span className="text-fuchsia-300">{commandPart}</span>
																								{commentPart && <span className="text-gray-500"> {commentPart}</span>}
																							</p>
																						);
																					})}
																				</div>
																			</div>
																			{getExamples(item.q).length > 0 && (
																				<div>
																					<p className="text-[15px] mt-2">
																						<span className="text-sky-400 font-semibold">Examples:</span>
																					</p>
																					<div className="mt-1 bg-[#0f1622] border border-sky-400/20 rounded-lg p-3 space-y-1">
																						{getExamples(item.q).map((line, idx) => (
																							<p key={idx} className={`font-mono text-[14px] leading-relaxed ${line.trim().startsWith('#') ? 'text-gray-400' : 'text-sky-300'}`}>
																								{line}
																							</p>
																						))}
																					</div>
																				</div>
																			)}
																		</div>
																	) : item.a ? (
																		<p className="text-[16px] text-emerald-300/80 px-2 pb-1 leading-relaxed">
																			<span className="text-emerald-500 mr-1">→</span>{item.a}
																		</p>
																	) : (
																		<p className="text-[15px] text-gray-600 italic px-2 pb-1">Answer coming soon...</p>
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
					)}
				</div>
					</div>
				)}
				</div>

			</div>

			<div className="pb-10" />
			<Footer />
		</div>
	);
}

export default DevOpsSheet;