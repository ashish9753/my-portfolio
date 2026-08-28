import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import ThemeToggle from '../components/ThemeToggle';

const cnSections = [
  {
    title: '📘 Network Basics',
    questions: [
      {
        q: 'What is a Computer Network?',
        a: 'A Computer Network is a collection of devices (computers, phones, printers) connected together to share resources and communicate.\n\nReal Example:\nWhatsApp Message:\nYour Phone → Internet → Friend\'s Phone\n\nWithout a network, you cannot send emails, browse websites, or make video calls.'
      },
      {
        q: 'What are the Goals of a Computer Network?',
        a: '• Resource Sharing – Share printers, files, internet\n• Communication – Email, chat, video calls\n• Reliability – Multiple paths mean no single point of failure\n• Scalability – Add more devices easily\n• Cost Reduction – Shared hardware saves money\n\nReal Example: Office Wi-Fi → all employees share one internet connection.'
      },
      {
        q: 'What is the difference between PAN, LAN, MAN, and WAN?',
        a: 'PAN – Personal Area Network\n• Range: few meters\n• Example: Bluetooth connecting phone to earbuds\n\nLAN – Local Area Network\n• Range: building/campus\n• Example: College computer lab\n\nMAN – Metropolitan Area Network\n• Range: city\n• Example: City-wide cable TV network\n\nWAN – Wide Area Network\n• Range: worldwide\n• Example: The Internet itself'
      },
      {
        q: 'What is Bandwidth, Latency, and Throughput?',
        a: 'Bandwidth – Maximum data that can be sent per second\n• Example: Highway with 8 lanes → more cars per minute\n\nLatency – Time taken for data to travel from sender to receiver\n• Example: Time for your voice to reach a friend on a phone call\n\nThroughput – Actual data successfully delivered per second\n• Example: You have 100 Mbps bandwidth but due to traffic, only 60 Mbps is delivered\n\nFormula: Throughput ≤ Bandwidth'
      },
      {
        q: 'What is the difference between Peer-to-Peer and Client-Server networks?',
        a: 'Peer-to-Peer (P2P):\n• Every device acts as both client and server\n• No central server\n• Example: BitTorrent file sharing\n\nClient-Server:\n• Dedicated server provides services\n• Clients request services\n• Example: YouTube – your browser (client) requests videos from YouTube servers\n\nP2P is cheaper but less secure; Client-Server is more secure and scalable.'
      },
    ]
  },
  {
    title: '📘 Network Topologies',
    questions: [
      {
        q: 'What is Network Topology?',
        a: 'Network Topology is the arrangement/layout of devices in a network.\n\nTypes:\n• Bus\n• Star\n• Ring\n• Mesh\n• Hybrid\n\nReal Example: Just like roads connecting cities, topologies define how computers are connected.'
      },
      {
        q: 'What is Bus Topology?',
        a: 'All devices connect to a single shared cable (backbone).\n\nAdvantages:\n• Simple and cheap\n• Easy to install\n\nDisadvantages:\n• If cable breaks, entire network fails\n• Slow – only one device can send data at a time\n\nReal Example: One notice board for all students in a hallway.'
      },
      {
        q: 'What is Star Topology?',
        a: 'All devices connect to a central switch/hub.\n\nAdvantages:\n• If one cable fails, only that device is affected\n• Easy to add/remove devices\n• Fast\n\nDisadvantages:\n• If central switch fails, entire network fails\n• More cables needed\n\nReal Example: Teacher in the center communicating with all students individually.'
      },
      {
        q: 'What is Ring Topology?',
        a: 'Each device connects to exactly two others forming a circle.\n\nAdvantages:\n• Equal access for all devices\n• Performs well under heavy load\n\nDisadvantages:\n• Failure of one device breaks the ring\n• Hard to troubleshoot\n\nReal Example: Students passing notes in a circle – each passes to the next.'
      },
      {
        q: 'What is Mesh Topology?',
        a: 'Every device is connected to every other device.\n\nAdvantages:\n• Highly reliable – multiple paths exist\n• No single point of failure\n\nDisadvantages:\n• Very expensive – too many cables\n• Hard to manage\n\nReal Example: Everyone in a group has everyone else\'s phone number.\n\nFormula:\nConnections = n(n-1)/2\nFor 5 devices: 5×4/2 = 10 connections'
      },
    ]
  },
  {
    title: '📘 OSI Model',
    questions: [
      {
        q: 'What is the OSI Model?',
        a: 'OSI = Open Systems Interconnection\n\nA 7-layer framework that defines how data is transmitted over a network.\n\nMnemonic: Please Do Not Throw Sausage Pizza Away\n\nLayer 7 – Application\nLayer 6 – Presentation\nLayer 5 – Session\nLayer 4 – Transport\nLayer 3 – Network\nLayer 2 – Data Link\nLayer 1 – Physical\n\nReal Example: Like sending a parcel – you pack it (upper layers), address it (middle layers), and physically ship it (lower layers).'
      },
      {
        q: 'What does the Application Layer (Layer 7) do?',
        a: 'Provides services directly to end users and applications.\n\nProtocols: HTTP, HTTPS, DNS, FTP, SMTP, SSH\n\nReal Example:\nYou open WhatsApp and type "Hello" – the Application Layer handles your message input.\n\nKey Point: This layer does NOT mean user applications (like Chrome). It means the protocols that apps use.'
      },
      {
        q: 'What does the Presentation Layer (Layer 6) do?',
        a: 'Translates data formats, handles encryption, and compression.\n\nFunctions:\n• Data Translation (JPEG, MP4, ASCII → binary)\n• Encryption/Decryption (SSL/TLS)\n• Compression (reduces data size)\n\nReal Example:\n• Encryption: Sealing a letter in an envelope before sending\n• HTTPS uses SSL/TLS at this layer'
      },
      {
        q: 'What does the Session Layer (Layer 5) do?',
        a: 'Manages communication sessions between two devices.\n\nFunctions:\n• Establish, maintain, and terminate sessions\n• Synchronization (checkpoints for large data)\n• Session recovery after failure\n\nReal Example:\n• Video call – Session Layer keeps your call alive and recovers if network drops briefly\n• Login session on a website'
      },
      {
        q: 'What does the Transport Layer (Layer 4) do?',
        a: 'Ensures reliable end-to-end delivery between applications.\n\nProtocols: TCP (reliable), UDP (fast)\n\nFunctions:\n• Segmentation – breaks data into segments\n• Flow Control – prevents sender from overwhelming receiver\n• Error Control – ensures no data is lost\n• Port Addressing – directs data to the right application\n\nReal Example: Courier service – ensures your parcel reaches the right person; if lost, it resends.'
      },
      {
        q: 'What does the Network Layer (Layer 3) do?',
        a: 'Handles logical addressing and routing between networks.\n\nProtocols: IP, ICMP, ARP\nDevice: Router\n\nFunctions:\n• IP Addressing (gives each device a unique address)\n• Routing (finds the best path for data)\n• Fragmentation\n\nReal Example: Google Maps for your data – finds the best route from your home to the destination server.'
      },
      {
        q: 'What does the Data Link Layer (Layer 2) do?',
        a: 'Handles node-to-node delivery within the same network (MAC addressing).\n\nProtocols: Ethernet, Wi-Fi (802.11)\nDevice: Switch\n\nFunctions:\n• MAC Addressing – physical address of each device\n• Framing – packages data into frames\n• Error Detection – CRC check\n• Flow Control\n\nReal Example: Inside your apartment building – Data Link Layer knows which apartment (MAC) to deliver to.'
      },
      {
        q: 'What does the Physical Layer (Layer 1) do?',
        a: 'Transmits raw binary data (0s and 1s) over physical media.\n\nMedia: Ethernet cable, fiber optic, radio waves (Wi-Fi)\nDevices: Repeater, Hub\n\nFunctions:\n• Bit transmission\n• Signal encoding\n• Physical connectors (RJ45 port)\n\nReal Example: The actual road/wire/air that carries your data – like the delivery truck on the highway.'
      },
      {
        q: 'What is Encapsulation and Decapsulation?',
        a: 'Encapsulation (Sending):\nEach layer adds a header (and trailer) to the data.\n\nApplication → Message\nTransport → Segment (adds port numbers)\nNetwork → Packet (adds IP addresses)\nData Link → Frame (adds MAC addresses)\nPhysical → Bits (sends over wire)\n\nDecapsulation (Receiving):\nEach layer removes its header.\n\nReal Example:\n• Encapsulation = packing a gift (each layer adds wrapping)\n• Decapsulation = unwrapping the gift layer by layer'
      },
    ]
  },
  {
    title: '📘 TCP/IP Model',
    questions: [
      {
        q: 'What is the TCP/IP Model?',
        a: 'TCP/IP = Transmission Control Protocol / Internet Protocol\n\nThe practical model used by the real Internet. Has 4 layers:\n\nLayer 4 – Application (HTTP, DNS, FTP, SMTP)\nLayer 3 – Transport (TCP, UDP)\nLayer 2 – Internet (IP, ICMP, ARP)\nLayer 1 – Network Access (Ethernet, Wi-Fi)\n\nReal Example: TCP/IP is like the actual rules of driving on the road; OSI is like the theoretical driving textbook.'
      },
      {
        q: 'What is the difference between OSI and TCP/IP models?',
        a: 'OSI Model:\n• 7 layers\n• Theoretical/reference model\n• Strict separation of layers\n• Not implemented directly\n\nTCP/IP Model:\n• 4 layers\n• Practical model used on the Internet\n• OSI layers 5,6,7 merged into Application layer\n• OSI layers 1,2 merged into Network Access layer\n\nReal Example:\n• OSI = School textbook of driving rules\n• TCP/IP = How people actually drive on highways'
      },
      {
        q: 'Which protocols belong to each TCP/IP layer?',
        a: 'Application Layer:\nHTTP, HTTPS, FTP, SMTP, POP3, IMAP, DNS, SSH, Telnet\n\nTransport Layer:\nTCP, UDP\n\nInternet Layer:\nIP (IPv4, IPv6), ICMP, ARP, RARP\n\nNetwork Access Layer:\nEthernet, Wi-Fi (802.11), ARP\n\nRemember: Upper layers deal with data content; lower layers deal with transmission.'
      },
    ]
  },
  {
    title: '🌐 Protocols – Full Form, Meaning & Example',
    questions: [
      {
        q: '🌐 Application Layer Protocols',
        a: '• HTTP — HyperText Transfer Protocol — Transfers web pages — Example: opening example.com — Port 80\n\n• HTTPS — HyperText Transfer Protocol Secure — Secure, encrypted web communication — Example: online banking — Port 443\n\n• FTP — File Transfer Protocol — Transfers files between client and server — Example: uploading a website file — Ports 20/21\n\n• SFTP — SSH File Transfer Protocol — Secure file transfer over SSH — Example: securely uploading server files — Port 22\n\n• SMTP — Simple Mail Transfer Protocol — Sends outgoing email — Example: Gmail sending an email — Port 25\n\n• POP3 — Post Office Protocol Version 3 — Downloads email to one device — Example: saving server mail on a PC — Port 110\n\n• IMAP — Internet Message Access Protocol — Keeps email on the server and syncs devices — Example: same Gmail inbox on phone and laptop — Port 143\n\n• DNS — Domain Name System — Converts domain name → IP address — Example: google.com → 142.250.x.x — Port 53\n\n• DHCP — Dynamic Host Configuration Protocol — Automatically assigns IP settings — Example: Wi-Fi router gives your laptop an IP — Ports 67/68\n\n• SSH — Secure Shell — Secure encrypted remote login — Example: connecting to a Linux server — Port 22\n\n• Telnet — Teletype Network — Unencrypted remote login; obsolete and unsafe — Example: old remote server access — Port 23\n\n• SNMP — Simple Network Management Protocol — Monitors and manages network devices — Example: checking router health — Ports 161/162'
      },
      {
        q: '🚚 Transport Layer Protocols',
        a: '• TCP — Transmission Control Protocol — Reliable, connection-oriented and ordered delivery — Example: web pages, email and file downloads\n\n• UDP — User Datagram Protocol — Fast, connectionless delivery with no delivery or ordering guarantee — Example: gaming, live video and voice calls\n\nMemory: TCP = Reliable ✅ | UDP = Fast ⚡'
      },
      {
        q: '🌍 Network / Internet Layer Protocols',
        a: '• IP — Internet Protocol — Provides logical addressing and routing — Example: sending a packet to another IP address\n\n• IPv4 — Internet Protocol Version 4 — Uses 32-bit addresses — Example: 192.168.1.10\n\n• IPv6 — Internet Protocol Version 6 — Uses 128-bit addresses — Example: 2001:db8::1\n\n• ICMP — Internet Control Message Protocol — Carries error and diagnostic messages — Example: ping google.com\n\n• IGMP — Internet Group Management Protocol — Manages IPv4 multicast group membership — Example: IPTV multicast\n\n• ARP — Address Resolution Protocol — Maps IPv4 address → MAC address on a local network — Example: finding the MAC for 192.168.1.5\n\nRemember: ARP = IP → MAC'
      },
      {
        q: '🔗 Data Link Layer Protocols & Technologies',
        a: '• Ethernet — Wired LAN technology — Transfers frames using MAC addresses — Example: PC connected to a switch with a cable\n\n• PPP — Point-to-Point Protocol — Connects two endpoints directly — Example: an old dial-up or router link\n\n• HDLC — High-Level Data Link Control — Bit-oriented communication over point-to-point links — Example: router-to-router WAN link\n\n• Wi-Fi / IEEE 802.11 — Wireless LAN technology — Transfers frames over radio waves — Example: laptop connected to a wireless router'
      },
      {
        q: '🛣️ Routing Protocols',
        a: '• RIP — Routing Information Protocol — Distance-vector routing using hop count; maximum 15 hops — Example: a small network\n\n• OSPF — Open Shortest Path First — Link-state routing using shortest-path calculation — Example: enterprise internal routing\n\n• BGP — Border Gateway Protocol — Path-vector routing between autonomous systems — Example: ISP ↔ ISP Internet routing\n\n• EIGRP — Enhanced Interior Gateway Routing Protocol — Advanced distance-vector routing inside an organization — Example: Cisco-based enterprise routing'
      },
      {
        q: '🧠 One-Minute Protocol Revision',
        a: 'DNS = Find IP\nDHCP = Give IP\nARP = Map IP to MAC\nICMP = Check and report\nTCP = Reliable\nUDP = Fast\nHTTP = Web\nHTTPS = Secure web\nFTP/SFTP = Files\nSMTP = Send email\nPOP3 = Download email\nIMAP = Sync email\nSSH = Secure login\nTelnet = Unsafe old login\nSNMP = Monitor devices\nRIP = Hop count\nOSPF = Shortest path / link state\nBGP = Internet routing\n\nMost-asked examples:\n• DNS → google.com to IP\n• DHCP → router gives laptop an IP\n• ARP → IP to MAC\n• ICMP → ping\n• TCP → accurate file/web delivery\n• UDP → gaming/live calls\n• BGP → ISP-to-ISP routing'
      },
      {
        q: '🔢 Most Important Port Numbers',
        a: '20/21 = FTP\n22 = SSH and SFTP\n23 = Telnet\n25 = SMTP\n53 = DNS\n67/68 = DHCP\n80 = HTTP\n110 = POP3\n123 = NTP\n143 = IMAP\n161/162 = SNMP\n443 = HTTPS\n\nPlacement shortcut: 22 SSH, 53 DNS, 80 HTTP, 443 HTTPS'
      },
    ]
  },
  {
    title: '📘 Transport Layer (TCP & UDP)',
    questions: [
      {
        q: 'What is TCP?',
        a: 'TCP = Transmission Control Protocol\n\nFeatures:\n• Connection-Oriented (requires handshake before sending)\n• Reliable – guarantees delivery\n• Ordered – data arrives in correct sequence\n• Error Checking – detects and retransmits lost packets\n• Slower due to overhead\n\nUse Cases:\n• HTTP/HTTPS (web browsing)\n• Email (SMTP, IMAP)\n• File Transfer (FTP)\n• Any application where data accuracy matters\n\nReal Example: Courier service with tracking – you get confirmation when the parcel is delivered, and it resends if lost.'
      },
      {
        q: 'What is UDP?',
        a: 'UDP = User Datagram Protocol\n\nFeatures:\n• Connectionless (no handshake)\n• Unreliable – no guarantee of delivery\n• No ordering guarantee\n• No error recovery (only basic checksum)\n• Very fast – low overhead\n\nUse Cases:\n• Video streaming (YouTube, Netflix)\n• Online gaming\n• Voice/Video calls (Zoom, WhatsApp)\n• DNS queries\n• Live sports streaming\n\nReal Example: Live cricket stream – if you miss one frame, the stream continues. Missing a frame is better than pausing.'
      },
      {
        q: 'What is the difference between TCP and UDP?',
        a: 'TCP vs UDP:\n\nConnection: TCP=Connection-Oriented | UDP=Connectionless\nReliability: TCP=Guaranteed Delivery | UDP=No Guarantee\nOrdering: TCP=In-order | UDP=No order\nSpeed: TCP=Slower | UDP=Faster\nOverhead: TCP=High | UDP=Low\nError Recovery: TCP=Yes | UDP=No\nUse Case: TCP=HTTP,FTP,Email | UDP=Video,Gaming,DNS\n\nRule of Thumb:\n• Need accuracy? → TCP\n• Need speed? → UDP'
      },
      {
        q: 'What is the TCP Three-Way Handshake?',
        a: 'Used to establish a TCP connection before sending data.\n\nStep 1 – SYN:\nClient → Server: "Can I connect? SYN=1, Seq=100"\n\nStep 2 – SYN-ACK:\nServer → Client: "Yes! SYN=1, ACK=101, Seq=300"\n\nStep 3 – ACK:\nClient → Server: "Great, ACK=301"\nConnection established!\n\nReal Example: Like calling a friend:\n1. You dial (SYN)\n2. They say "Hello?" (SYN-ACK)\n3. You say "Hey it\'s me" (ACK)\n4. Now you can talk (data transfer)\n\nMemory: SYN → SYN-ACK → ACK'
      },
      {
        q: 'What is the TCP Four-Way Termination (Connection Close)?',
        a: 'Used to gracefully close a TCP connection.\n\nStep 1: Client → FIN (I\'m done sending)\nStep 2: Server → ACK (Noted)\nStep 3: Server → FIN (I\'m done too)\nStep 4: Client → ACK (Okay, goodbye)\n\nAfter Step 4, client waits in TIME_WAIT state before fully closing.\n\nReal Example: Ending a phone call:\n1. You: "I\'m done, bye"\n2. Friend: "Okay"\n3. Friend: "Bye from my end too"\n4. You: "Okay, goodbye!"'
      },
      {
        q: 'What is a Socket?',
        a: 'A socket is an endpoint of a two-way communication link.\n\nSocket = IP Address + Port Number\n\nExample:\n192.168.1.10:443 – This identifies a specific application on a specific device.\n\nTypes:\n• TCP Socket – Reliable, connection-oriented\n• UDP Socket – Fast, connectionless\n\nReal Example: Like a phone number with an extension.\n• IP = Phone number (reaches the building)\n• Port = Extension (reaches the specific person/department)'
      },
    ]
  },
  {
    title: '📘 Internet Layer (IP, ICMP, ARP)',
    questions: [
      {
        q: 'What is IP (Internet Protocol)?',
        a: 'IP provides logical addressing and routing across networks.\n\nFunctions:\n• Assigns unique IP addresses to devices\n• Routes packets from source to destination\n• Fragmentation – splits large packets\n\nVersions:\n• IPv4 – 32-bit, 4 billion addresses (192.168.1.1)\n• IPv6 – 128-bit, virtually unlimited (2001:db8::1)\n\nKey Point: IP is connectionless and unreliable (no delivery guarantee). TCP sits on top to add reliability.\n\nReal Example: IP address is like your home address – postal system uses it to route your mail to the right house.'
      },
      {
        q: 'What is the difference between IPv4 and IPv6?',
        a: 'IPv4:\n• 32-bit address\n• Written as: 192.168.1.1\n• ~4.3 billion addresses\n• Running out of addresses\n\nIPv6:\n• 128-bit address\n• Written as: 2001:0db8:85a3::8a2e:0370:7334\n• 340 undecillion addresses (virtually unlimited)\n• Supports auto-configuration\n• No NAT needed\n\nWhy IPv6?\nThe world ran out of IPv4 addresses (too many devices – phones, IoT, etc.).\n\nReal Example: IPv4 = a 10-digit phone number system; IPv6 = adding country codes, city codes, etc. to support billions more numbers.'
      },
      {
        q: 'What are IP Classes and Private IP Ranges?',
        a: 'IP Classes (IPv4):\nClass A: 1.0.0.0 – 126.255.255.255 (large networks)\nClass B: 128.0.0.0 – 191.255.255.255 (medium networks)\nClass C: 192.0.0.0 – 223.255.255.255 (small networks)\nClass D: 224.0.0.0 – 239.255.255.255 (multicast)\nClass E: 240.0.0.0+ (reserved/experimental)\n\nPrivate IP Ranges (not routable on Internet):\nClass A: 10.0.0.0 – 10.255.255.255\nClass B: 172.16.0.0 – 172.31.255.255\nClass C: 192.168.0.0 – 192.168.255.255\n\nReal Example: Private IPs are like internal office extensions – they work inside the building but you need the main number (public IP) to call from outside.'
      },
      {
        q: 'What is ICMP?',
        a: 'ICMP = Internet Control Message Protocol\n\nUsed for network diagnostics – reports errors and sends control messages.\n\nCommon Uses:\n• ping command – tests if a host is reachable\n• traceroute/tracert – finds the path to a destination\n• Error reporting – "Destination unreachable", "Time exceeded"\n\nReal Example:\nping google.com → sends ICMP echo request; Google replies with echo reply.\n"Are you alive?" → "Yes I am!"\n\nICMP does NOT transfer user data – it only carries control/error messages.'
      },
      {
        q: 'What is ARP?',
        a: 'ARP = Address Resolution Protocol\n\nConverts an IP address to a MAC address within the same network.\n\nHow it works:\n1. Device knows the IP (e.g., 192.168.1.5) but needs the MAC address\n2. Broadcasts: "Who has IP 192.168.1.5?"\n3. That device replies: "I do! My MAC is 00:1A:2B:3C:4D:5E"\n4. Stored in ARP cache\n\nReal Example: You know someone lives at "Flat 5, Block A" (IP) but you need their name to ring the doorbell (MAC). ARP asks everyone in the building "Who lives at Flat 5?"\n\nRARP: Reverse ARP – converts MAC to IP (older, replaced by DHCP)'
      },
      {
        q: 'What is a MAC Address?',
        a: 'MAC = Media Access Control Address\n\nPhysical hardware address assigned to a network interface card (NIC).\n\nFormat: 00:1A:2B:3C:4D:5E (48-bit, written in hex)\n\nProperties:\n• Unique to every network device\n• Assigned by manufacturer (burned-in)\n• Works at Data Link Layer (Layer 2)\n• Used within a local network (LAN)\n\nIP vs MAC:\n• IP = Logical address (changes, used for routing across networks)\n• MAC = Physical address (permanent, used within same network)\n\nReal Example:\n• IP = Your current home address (can change when you move)\n• MAC = Your Aadhaar/SSN number (permanent, unique to you)'
      },
    ]
  },
  {
    title: '📘 Network Devices',
    questions: [
      {
        q: 'What is a Hub?',
        a: 'A Hub is a basic network device that connects multiple devices in a LAN.\n\nHow it works:\n• Receives data from one port\n• Broadcasts to ALL other ports (no intelligence)\n• All devices see all data – inefficient and insecure\n\nLayer: Physical Layer (Layer 1)\n\nProblems:\n• Collisions (multiple devices sending at once)\n• No privacy (all data visible to everyone)\n• Obsolete – replaced by Switches\n\nReal Example: Like a megaphone in a room – everyone hears everything, even if it\'s meant for one person.'
      },
      {
        q: 'What is a Switch?',
        a: 'A Switch intelligently forwards data only to the intended device using MAC addresses.\n\nHow it works:\n• Learns MAC addresses of connected devices\n• Maintains a MAC Address Table\n• Sends data ONLY to the correct port\n\nLayer: Data Link Layer (Layer 2)\n\nAdvantages over Hub:\n• No collisions\n• More secure (data not broadcast to all)\n• Faster\n\nReal Example: Like a receptionist in an office – knows which room each person sits in and delivers mail directly to them, not to the entire building.'
      },
      {
        q: 'What is a Router?',
        a: 'A Router connects different networks and routes packets between them using IP addresses.\n\nHow it works:\n• Reads destination IP address\n• Looks up routing table\n• Forwards packet to the next hop\n\nLayer: Network Layer (Layer 3)\n\nFunctions:\n• Connect LAN to Internet (WAN)\n• NAT (Network Address Translation)\n• DHCP (assigns IPs to devices)\n• Firewall\n\nReal Example: Like the GPS/post office sorting center – looks at the destination address and routes your parcel through the correct path to reach another city.'
      },
      {
        q: 'What is the difference between Hub, Switch, and Router?',
        a: 'Hub:\n• Layer 1 (Physical)\n• Broadcasts to ALL devices\n• Uses: none (addresses not used)\n• Dumb device, creates collisions\n\nSwitch:\n• Layer 2 (Data Link)\n• Sends to SPECIFIC device\n• Uses: MAC Address\n• Smart, no collisions\n\nRouter:\n• Layer 3 (Network)\n• Routes between DIFFERENT networks\n• Uses: IP Address\n• Connects your home network to the Internet\n\nSimple Rule:\n• Same building → Switch\n• Different cities → Router'
      },
      {
        q: 'What is a Repeater, Bridge, Gateway, and Modem?',
        a: 'Repeater:\n• Regenerates/amplifies signal over long distances\n• Layer 1\n• Real Example: Wi-Fi range extender\n\nBridge:\n• Connects two segments of the same network\n• Layer 2 (uses MAC)\n• Filters traffic between segments\n\nGateway:\n• Connects networks using DIFFERENT protocols\n• Works at all layers\n• Example: Your home router is a gateway between LAN and Internet\n\nModem:\n• Modulates/Demodulates analog-digital signals\n• Connects your home to ISP\n• Real Example: The device your ISP provides that converts fiber/cable signals to digital data'
      },
    ]
  },
  {
    title: '📘 IP Addressing & Subnetting',
    questions: [
      {
        q: 'What is an IP Address and how is it structured?',
        a: 'An IP address is a 32-bit unique identifier for a device on a network.\n\nIPv4 Structure: 4 octets separated by dots\nExample: 192.168.1.100\n\nEach octet = 8 bits → range 0-255\nSo IP range is: 0.0.0.0 to 255.255.255.255\n\nParts:\n• Network Part – identifies the network\n• Host Part – identifies the device within the network\n\nExample: 192.168.1.100 with subnet 255.255.255.0\n• Network: 192.168.1 (first 3 octets)\n• Host: 100 (last octet)\n\nReal Example: Like a postal address – "Delhi, India" = Network; "Flat 5, Street 3" = Host'
      },
      {
        q: 'What is a Subnet Mask and CIDR?',
        a: 'Subnet Mask: Determines which part of the IP is Network and which is Host.\n\nExample:\nIP: 192.168.1.100\nMask: 255.255.255.0\n→ Network: 192.168.1.0\n→ Usable Hosts: 192.168.1.1 to 192.168.1.254\n\nCIDR (Classless Inter-Domain Routing):\nShorthand notation: 192.168.1.0/24\n/24 means first 24 bits = Network, last 8 bits = Host\n\nCommon CIDR:\n/8 → Class A\n/16 → Class B\n/24 → Class C\n/32 → Single host\n\nReal Example: /24 is like a neighborhood – all houses in "Sector 15" share the same prefix.'
      },
      {
        q: 'What is Subnetting?',
        a: 'Subnetting = dividing a large network into smaller sub-networks.\n\nBenefits:\n• Better security (isolate departments)\n• Reduced broadcast traffic\n• Efficient IP usage\n\nHost Formula: 2^n - 2\n(n = number of host bits; subtract 2 for network address and broadcast address)\n\nExample: /24 network\n• Host bits = 8\n• 2^8 - 2 = 254 usable hosts\n\nExample: /26 network\n• Host bits = 6\n• 2^6 - 2 = 62 usable hosts\n\nReal Example: Company has 1 building (one network) but divides into departments – HR on 192.168.1.0/26, IT on 192.168.1.64/26, etc.'
      },
      {
        q: 'What is NAT?',
        a: 'NAT = Network Address Translation\n\nConverts private IP addresses to a public IP for internet communication.\n\nWhy NAT?\n• IPv4 addresses are limited\n• Private IPs (192.168.x.x) cannot be used on the Internet\n• Multiple devices share ONE public IP\n\nHow it works:\n1. Your laptop (192.168.1.5) sends request to google.com\n2. Router replaces private IP with public IP (e.g., 203.0.113.5)\n3. Google responds to 203.0.113.5\n4. Router translates back to 192.168.1.5 and delivers\n\nReal Example: An apartment building has ONE main address. The security guard (NAT) knows which flat to deliver each parcel to.'
      },
    ]
  },
  {
    title: '📘 Routing & Switching',
    questions: [
      {
        q: 'What is Routing?',
        a: 'Routing is the process of finding the best path for data to travel from source to destination across multiple networks.\n\nRouters use Routing Tables to decide:\n• Which interface to forward the packet through\n• What is the next hop (next router)\n\nTypes:\n• Static Routing – manually configured routes\n• Dynamic Routing – automatically learned using routing protocols\n\nReal Example: Like Google Maps – you enter your destination (IP), and it finds the best route through multiple roads (routers) to get there.'
      },
      {
        q: 'What is the difference between Static and Dynamic Routing?',
        a: 'Static Routing:\n• Routes manually configured by admin\n• Does not adapt to network changes\n• Simple, low overhead\n• Good for small, stable networks\n\nDynamic Routing:\n• Routes automatically learned via protocols (RIP, OSPF, BGP)\n• Adapts to failures and changes\n• More overhead (protocol messages)\n• Good for large, complex networks\n\nReal Example:\n• Static = Google Maps with fixed route that never updates\n• Dynamic = Real-time Google Maps that reroutes based on traffic'
      },
      {
        q: 'What are RIP, OSPF, and BGP?',
        a: 'RIP (Routing Information Protocol):\n• Distance Vector protocol\n• Metric: Hop Count (max 15)\n• Slow convergence\n• Used in small networks\n\nOSPF (Open Shortest Path First):\n• Link State protocol\n• Uses Dijkstra\'s algorithm\n• Fast convergence\n• Used in enterprise networks\n\nBGP (Border Gateway Protocol):\n• Path Vector protocol\n• Used between different ISPs/organizations\n• Powers the entire Internet routing\n• Highly complex and scalable\n\nReal Example:\n• RIP = Counting traffic lights on each route\n• OSPF = Calculating total road distance for best path\n• BGP = How different countries route traffic between each other'
      },
      {
        q: 'What is the difference between Circuit Switching and Packet Switching?',
        a: 'Circuit Switching:\n• Dedicated path established before communication\n• Resources reserved for entire duration\n• Consistent bandwidth, no delay variation\n• Wasteful if idle\n• Example: Old telephone network (PSTN)\n\nPacket Switching:\n• Data broken into packets, each routed independently\n• No dedicated path – shares network resources\n• Efficient, handles bursts well\n• Variable delays (packets may arrive out of order)\n• Example: The Internet\n\nReal Example:\n• Circuit Switching = Booking an entire flight for yourself\n• Packet Switching = Flying cargo on multiple different planes'
      },
      {
        q: 'What is VLAN?',
        a: 'VLAN = Virtual Local Area Network\n\nLogically divides a physical network into multiple isolated networks.\n\nBenefits:\n• Security – HR cannot access Engineering network\n• Reduced broadcast traffic\n• Flexible – devices anywhere can be in same VLAN\n\nExample:\n• VLAN 10: HR Department\n• VLAN 20: Engineering\n• VLAN 30: Management\n\nAll on same physical switch, but isolated.\n\nReal Example: In an office building, different floors share the same hallways (physical network) but each department has keycard access to only their floor (VLAN).'
      },
    ]
  },
  {
    title: '📘 Reliability (Flow & Congestion Control)',
    questions: [
      {
        q: 'What is Flow Control?',
        a: 'Flow Control prevents the sender from sending data faster than the receiver can process.\n\nMethods:\n1. Stop-and-Wait:\n• Send one packet, wait for ACK, then send next\n• Simple but slow\n• Real Example: Teacher asks a question, waits for student answer, then asks next question\n\n2. Sliding Window:\n• Sender can send multiple packets (window size) before waiting for ACK\n• Much more efficient\n• Real Example: Teacher gives 5 questions at once, students answer all 5, then teacher gives next 5\n\nTCP uses Sliding Window for flow control.'
      },
      {
        q: 'What is Congestion Control?',
        a: 'Congestion Control prevents network overload when too many packets are sent.\n\nTCP Congestion Control Algorithms:\n\n1. Slow Start:\n• Begin with small window size\n• Double window size every RTT (exponential growth)\n• Until threshold or packet loss\n\n2. Congestion Avoidance:\n• After threshold, increase by 1 per RTT (linear growth)\n\n3. Fast Retransmit:\n• If 3 duplicate ACKs received → packet lost → retransmit immediately\n\n4. Fast Recovery:\n• After packet loss, don\'t go back to slow start\n\nReal Example: Traffic police controlling cars entering a highway – slow down during rush hour, speed up when clear.'
      },
      {
        q: 'What are Error Detection methods?',
        a: 'Parity Bit:\n• Adds 1 bit to make total 1s even (even parity) or odd (odd parity)\n• Detects single-bit errors only\n• Simple but weak\n\nChecksum:\n• Sum of all data segments\n• Receiver recalculates and compares\n• Used in TCP/IP\n\nCRC (Cyclic Redundancy Check):\n• Most powerful error detection\n• Divides data by a polynomial\n• Appends remainder as checksum\n• Used in Ethernet, Wi-Fi\n\nReal Example:\n• Parity = Quick spot-check on an answer sheet\n• CRC = Detailed verification with a mathematical formula\n\nNote: These DETECT errors; error CORRECTION needs more advanced codes (Hamming Code).'
      },
    ]
  },
  {
    title: '📘 Network Security',
    questions: [
      {
        q: 'What is a Firewall?',
        a: 'A Firewall monitors and filters incoming/outgoing network traffic based on rules.\n\nTypes:\n• Packet Filter – checks IP/port, simple\n• Stateful Inspection – tracks connection state\n• Application Firewall – inspects at application layer (Layer 7)\n• Next-Gen Firewall (NGFW) – deep packet inspection + IPS\n\nFunctions:\n• Block unauthorized access\n• Allow only trusted connections\n• Log traffic for monitoring\n\nReal Example: Security guard at a building entrance – checks ID (rules), allows employees in (permit), blocks strangers (deny).'
      },
      {
        q: 'What is a VPN?',
        a: 'VPN = Virtual Private Network\n\nCreates an encrypted tunnel over the public internet for secure communication.\n\nHow it works:\n1. Your data is encrypted on your device\n2. Sent through the Internet as encrypted packets\n3. Decrypted at the VPN server\n4. Forwarded to the destination\n\nBenefits:\n• Privacy – hide your real IP\n• Security – encrypted, safe on public Wi-Fi\n• Bypass geo-restrictions\n\nProtocols: OpenVPN, WireGuard, IPsec, L2TP\n\nReal Example: Like a private courier using a secret code – even if someone intercepts the package, they can\'t read it.'
      },
      {
        q: 'What is SSL/TLS?',
        a: 'SSL = Secure Sockets Layer (now deprecated)\nTLS = Transport Layer Security (current standard)\n\nProvides:\n• Encryption – data cannot be read by others\n• Authentication – verifies server identity (via certificates)\n• Integrity – data not tampered\n\nTLS Handshake:\n1. Client says "Hello" with supported cipher suites\n2. Server responds with certificate\n3. Client verifies certificate\n4. Keys exchanged → encrypted session begins\n\nUsed by HTTPS (port 443), email, VPN\n\nReal Example: Like showing your ID at a bank (authentication) and then speaking in a secret language (encryption).'
      },
      {
        q: 'What are common network attacks?',
        a: 'Phishing:\n• Fake website/email tricking users into entering credentials\n• Example: Fake "Netflix login" page\n\nDDoS (Distributed Denial of Service):\n• Thousands of systems flood a server with requests\n• Server crashes, legitimate users cannot access\n• Example: Gaming servers taken offline by DDoS attacks\n\nMan-in-the-Middle (MitM):\n• Attacker secretly intercepts communication between two parties\n• Example: Attacker on public Wi-Fi reading your bank data\n\nSQL Injection:\n• Malicious SQL code injected into input fields\n• Example: Username: admin\'--  (bypasses login)\n\nPort Scanning:\n• Attacker scans open ports to find vulnerabilities\n\nProtection: Firewall, HTTPS, VPN, 2FA, Input Validation'
      },
      {
        q: 'What is Encryption? Symmetric vs Asymmetric?',
        a: 'Encryption converts readable data into unreadable ciphertext.\n\nSymmetric Encryption:\n• Same key for encryption and decryption\n• Fast, used for large data\n• Problem: how to securely share the key?\n• Algorithms: AES, DES, 3DES\n• Example: A safe with one key\n\nAsymmetric Encryption:\n• Public Key (encrypt) + Private Key (decrypt)\n• Slow but secure key exchange\n• Used in HTTPS, SSH, SSL/TLS\n• Algorithms: RSA, ECC, Diffie-Hellman\n• Example: Padlock system – anyone can lock (public key), only you can unlock (private key)\n\nHTTPS uses Asymmetric to exchange keys, then Symmetric for actual data.'
      },
    ]
  },
  {
    title: '📘 Network Commands',
    questions: [
      {
        q: 'What does the ping command do?',
        a: 'ping tests connectivity between your device and a target host.\n\nUsage: ping google.com\n\nHow it works:\n• Sends ICMP Echo Request packets\n• Target replies with ICMP Echo Reply\n• Shows round-trip time (RTT) and packet loss\n\nOutput Meaning:\nReply from 142.250.195.46: bytes=32 time=12ms TTL=115\n• time=12ms → latency is 12 milliseconds\n• TTL → Time to Live (hops remaining)\n• Request timed out → host unreachable or blocking ICMP\n\nReal Example: "Are you there?" "Yes, and it took 12ms to hear back."'
      },
      {
        q: 'What does ipconfig / ifconfig do?',
        a: 'ipconfig (Windows) / ifconfig (Linux/Mac):\nDisplays network configuration of your device.\n\nKey Information Shown:\n• IP Address – your device\'s IP\n• Subnet Mask – your network mask\n• Default Gateway – your router\'s IP\n• DNS Servers\n• MAC Address\n\nUseful Commands:\nipconfig /all → detailed info\nipconfig /release → release DHCP IP\nipconfig /renew → get new DHCP IP\nipconfig /flushdns → clear DNS cache\n\nReal Example: Like checking your passport/ID – shows who you are (IP) and what organization you belong to (network).'
      },
      {
        q: 'What does tracert / traceroute do?',
        a: 'tracert (Windows) / traceroute (Linux):\nShows the path packets take from your device to the destination.\n\nUsage: tracert google.com\n\nHow it works:\n• Sends packets with increasing TTL (1, 2, 3...)\n• Each router decrements TTL; when TTL=0, router sends back ICMP "Time Exceeded"\n• This reveals each hop along the path\n\nOutput:\n1  192.168.1.1  (your router) – 1ms\n2  10.0.0.1    (ISP router) – 15ms\n3  216.x.x.x   (internet backbone) – 30ms\n...\n15 google.com – 45ms\n\nReal Example: Like tracking a courier at every city it passes through, from sender to receiver.'
      },
      {
        q: 'What does nslookup do?',
        a: 'nslookup (Name Server Lookup):\nQueries DNS to get IP address for a domain.\n\nUsage:\nnslookup google.com → shows IP of google.com\nnslookup 8.8.8.8 → reverse lookup (IP to domain)\n\nOutput:\nServer: 8.8.8.8 (DNS server used)\nAddress: 142.250.195.46 (IP of google.com)\n\nUseful For:\n• Troubleshooting DNS issues\n• Verifying DNS records\n• Finding mail server (MX records)\n\nnslookup -type=MX gmail.com → shows Gmail\'s mail servers\n\nReal Example: Like asking a phone directory "What number is Google?"\n\nAlternative: dig command (Linux, more detailed)'
      },
      {
        q: 'What does netstat do?',
        a: 'netstat (Network Statistics):\nDisplays active connections, ports, and network statistics.\n\nUsage:\nnetstat -an → all connections with port numbers\nnetstat -r → routing table\nnetstat -s → protocol statistics\n\nOutput Example:\nTCP  192.168.1.5:50123  142.250.195.46:443  ESTABLISHED\n(Your IP:Port → Google\'s IP:443 = Active HTTPS connection)\n\nStates:\nESTABLISHED – active connection\nLISTENING – server waiting for connections\nTIME_WAIT – connection closing\nCLOSE_WAIT – remote end closed\n\nReal Example: Like checking your phone\'s active calls list – who are you connected to right now and on which number (port).'
      },
    ]
  },
  {
    title: '📘 What Happens When You Open a Website?',
    questions: [
      {
        q: 'What happens step-by-step when you type https://google.com in a browser?',
        a: 'Step 1 – URL Parsing:\nBrowser parses "https://google.com" → protocol=HTTPS, host=google.com\n\nStep 2 – DNS Resolution:\nBrowser → DNS cache → OS cache → DNS Resolver → Root Server → TLD Server → Authoritative Server → returns 142.250.195.46\n\nStep 3 – TCP Three-Way Handshake:\nSYN → SYN-ACK → ACK\nConnection to 142.250.195.46:443 established\n\nStep 4 – TLS/SSL Handshake:\nCertificate verified → encryption keys exchanged → HTTPS session started\n\nStep 5 – HTTP GET Request:\nGET / HTTP/1.1\nHost: google.com\n\nStep 6 – Server Processes Request:\nGoogle server handles request, queries databases\n\nStep 7 – HTTP Response:\nHTTP/1.1 200 OK\nContent-Type: text/html\n...HTML, CSS, JS...\n\nStep 8 – Browser Renders Page:\nBrowser parses HTML → builds DOM → loads CSS/JS → renders page\n\nSummary: URL → DNS → TCP → TLS → HTTP → Server → Response → Browser'
      },
      {
        q: 'What is HTTP Request and Response?',
        a: 'HTTP Request:\nMethod – GET, POST, PUT, DELETE, PATCH\nURL – /api/users/123\nHeaders – Content-Type, Authorization, Cookie\nBody – (for POST/PUT) the data being sent\n\nHTTP Response:\nStatus Code – 200 OK, 404 Not Found, 500 Server Error\nHeaders – Content-Type, Set-Cookie\nBody – HTML, JSON, etc.\n\nImportant Status Codes:\n1xx – Informational\n2xx – Success (200=OK, 201=Created)\n3xx – Redirect (301=Permanent, 302=Temporary)\n4xx – Client Error (400=Bad Request, 401=Unauthorized, 403=Forbidden, 404=Not Found)\n5xx – Server Error (500=Internal Server Error, 503=Service Unavailable)\n\nReal Example: Like ordering food – Request=your order; Response=the food delivered (or "sorry we\'re out" = 404).'
      },
    ]
  },
  {
    title: '📘 Most Asked Interview Questions',
    questions: [
      { q: 'What is the OSI Model? Name all 7 layers.', a: 'Open Systems Interconnection model with 7 layers:\n7-Application, 6-Presentation, 5-Session, 4-Transport, 3-Network, 2-Data Link, 1-Physical\nMnemonic: "Please Do Not Throw Sausage Pizza Away"' },
      { q: 'What is the difference between TCP and UDP?', a: 'TCP: Reliable, connection-oriented, ordered, slower. Use: HTTP, email, FTP\nUDP: Unreliable, connectionless, faster, no ordering. Use: Video streaming, gaming, DNS' },
      { q: 'What is DNS?', a: 'Domain Name System converts human-readable domain names (google.com) to IP addresses. Port 53. Works like a phone contacts app – you search a name, it gives you the number.' },
      { q: 'What is DHCP?', a: 'Dynamic Host Configuration Protocol automatically assigns IP addresses to devices. Process: DORA (Discover, Offer, Request, Acknowledge). Like a hotel receptionist assigning room numbers.' },
      { q: 'What is ARP?', a: 'Address Resolution Protocol converts an IP address to a MAC address within the same network. Broadcasts "Who has this IP?" and the matching device replies with its MAC address.' },
      { q: 'What is the difference between Hub, Switch, and Router?', a: 'Hub: Broadcasts to all (Layer 1)\nSwitch: Sends to specific MAC address (Layer 2)\nRouter: Routes between networks using IP (Layer 3)' },
      { q: 'What is NAT?', a: 'Network Address Translation converts private IPs to a public IP for internet access. Multiple devices share one public IP. Like an apartment building having one main address.' },
      { q: 'What is a Firewall?', a: 'Monitors and filters network traffic based on rules. Blocks unauthorized access, allows trusted connections. Like a security guard at a building entrance.' },
      { q: 'What is VPN?', a: 'Virtual Private Network creates an encrypted tunnel for secure communication over public internet. Hides your real IP, encrypts data, bypasses geo-restrictions.' },
      { q: 'What is the TCP Three-Way Handshake?', a: 'Connection establishment process:\nSYN → SYN-ACK → ACK\nLike starting a phone call: "Can I connect?" → "Yes" → "Great, talking now"' },
      { q: 'What is Subnetting?', a: 'Dividing a network into smaller sub-networks. Benefits: better security, reduced broadcast traffic, efficient IP usage. Usable hosts = 2^n - 2 (n = host bits).' },
      { q: 'What is the difference between IPv4 and IPv6?', a: 'IPv4: 32-bit, ~4.3 billion addresses, format 192.168.1.1\nIPv6: 128-bit, virtually unlimited addresses, format 2001:db8::1. Created because IPv4 addresses ran out.' },
      { q: 'What is ping?', a: 'Command that tests connectivity using ICMP Echo Request/Reply. Shows round-trip time and packet loss. Usage: ping google.com' },
      { q: 'What is HTTP vs HTTPS?', a: 'HTTP: Port 80, plain text, not secure\nHTTPS: Port 443, encrypted with TLS/SSL, secure. Like postcard (HTTP) vs sealed envelope (HTTPS).' },
      { q: 'What happens when you type google.com in a browser?', a: 'URL → DNS lookup (domain to IP) → TCP Three-Way Handshake → TLS handshake (HTTPS) → HTTP GET request → Server processes → HTTP response → Browser renders page.' },
    ]
  },
];

const totalQuestions = cnSections.reduce((s, sec) => s + sec.questions.length, 0);

function CNSheet({ auth, setAuth }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [openAnswers, setOpenAnswers] = useState({});
  const [collapsedSections, setCollapsedSections] = useState(
    () => cnSections.reduce((acc, _, i) => ({ ...acc, [i]: true }), {})
  );
  const questionRefs = useRef({});

  const [lastRead, setLastRead] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cn_revision_last_read')) || null; }
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
        localStorage.setItem('cn_revision_last_read', JSON.stringify(data));
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
    localStorage.removeItem('cn_revision_last_read');
  };

  const toggleSection = (sIdx) => {
    setCollapsedSections(prev => ({ ...prev, [sIdx]: !prev[sIdx] }));
  };

  const q = searchQuery.toLowerCase().trim();
  const filteredSections = cnSections.map(sec => ({
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
                <span className="text-yellow-400">Computer Networks</span> – Questions & Answers
              </h1>
              <p className="text-xs text-gray-500">{totalQuestions} questions · {cnSections.length} sections</p>
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
            { label: 'Topics', value: cnSections.length, color: 'text-sky-400' },
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

        {/* CN Content */}
        <div className="border border-[#2a2a2a] rounded-2xl overflow-hidden">
          <div className="border-t border-[#1f1f1f] px-4 py-4 space-y-0 bg-[#0d0d0d]">
            {filteredSections.map((section, sIdx) => {
              const originalIdx = cnSections.findIndex(s => s.title === section.title);
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
                        const key = `cn-${originalIdx}-${qIdx}`;
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
                                href={`https://chatgpt.com/?q=${encodeURIComponent(`${item.q} in computer networks, explain in short.`)}`}
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
                                href={item.yt || `https://www.youtube.com/results?search_query=${encodeURIComponent(`${item.q} computer networks explained`)}`}
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
                              <div className="px-1 pb-5 pt-2">
                                {item.a ? (
                                  <p className="text-[16px] text-yellow-300/80 px-2 pb-1 leading-relaxed whitespace-pre-line">
                                    <span className="text-yellow-500 mr-1">→</span>{item.a}
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

export default CNSheet;
