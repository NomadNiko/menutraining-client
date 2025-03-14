import { ExperienceEntry } from "./types";

export const experiences: ExperienceEntry[] = [
  {
    period: "Jan 2023 - Present",
    role: "Founder - Head Engineer",
    company: "iXplor Global",
    description:
      "As the Founder and Head Engineer of iXplor Global, I architected and developed a full-stack adventure booking platform that revolutionizes travel experiences through innovative technology. The platform provides a comprehensive solution for vendors and travelers, featuring advanced geospatial discovery, real-time booking management, and seamless vendor onboarding.",
    skills: [
      "Full-Stack Development",
      "Cloud Deployment",
      "Microservices Architecture",
      "Next.js",
      "React.js",
      "TypeScript",
      "Node.js",
      "Express.js",
      "MongoDB Atlas",
      "Stripe/Stripe Connect APIs",
      "Google Places API",
      "Mapbox GL JS",
      "Material-UI",
      "Tailwind CSS",
      "JWT Authentication",
      "OAuth Social Logins",
      "Render Cloud Deployment",
      "GitHub Actions CI/CD",
      "Docker Containerization",
      "Geospatial Querying",
      "AWS S3 File Storage",
      "SendGrid Email Service",
    ],
    keyPoints: [
      {
        title: "Project Inception and Market Research",
        description:
          "Conducted comprehensive market analysis of the adventure tourism and local experiences sector, identifying key pain points for both vendors and travelers. Developed a strategic product roadmap focusing on solving marketplace friction through technology-driven solutions. Created initial wireframes and user journey maps to validate core product hypotheses.",
      },
      {
        title: "Architecture and Technical Design",
        description:
          "Architected a scalable, microservices-inspired full-stack platform using Next.js 14 and Node.js. Designed a robust multi-tenant system supporting diverse business models across tours, lessons, rentals, and tickets. Implemented comprehensive role-based access control (RBAC) with granular permissions, enabling secure, flexible interactions for vendors, staff, and customers.",
      },
      {
        title: "Advanced Geospatial Discovery Platform",
        description:
          "Developed an innovative location-based discovery system integrating Google Maps Platform and Mapbox GL JS. Created custom clustering algorithms and advanced filtering mechanisms allowing users to discover local adventures with precision. Implemented real-time geospatial querying, supporting complex location-based searches with performance optimization techniques.",
      },
      {
        title: "Vendor Onboarding and Management Ecosystem",
        description:
          "Designed a comprehensive vendor lifecycle management system with multi-stage onboarding, including profile creation, document verification, and product template generation. Integrated Stripe Connect for seamless financial operations, enabling vendors to receive payments and manage their earnings. Built a vendor dashboard with real-time analytics, booking management, and performance tracking.",
      },
      {
        title: "Dynamic Booking and Availability Management",
        description:
          "Implemented a sophisticated booking engine with intelligent availability tracking, supporting complex scheduling rules. Developed role-based staff assignment capabilities, allowing vendors to manage team availability, shift scheduling, and booking allocations. Created advanced validation mechanisms to prevent double-bookings and manage capacity constraints in real-time.",
      },
      {
        title: "Payment and Financial Integration",
        description:
          "Integrated Stripe's Payment Intents and Connect platforms to support complex multi-vendor transactions. Developed a robust payment flow handling various scenarios including refunds, partial payments, and cross-border transactions. Implemented secure, PCI-compliant payment processing with detailed transaction logging and reconciliation mechanisms.",
      },
      {
        title: "Infrastructure and DevOps Implementation",
        description:
          "Established a comprehensive CI/CD pipeline using GitHub Actions for automated testing and deployment. Containerized the application using Docker for consistent development and production environments. Deployed on Render with optimized scaling strategies, implementing monitoring, logging, and error tracking. Set up robust security protocols including JWT authentication, OAuth integrations, and comprehensive input validation.",
      },
      {
        title: "User Experience and Internationalization",
        description:
          "Crafted a responsive, accessibility-focused user interface using Material-UI and Tailwind CSS. Implemented full internationalization support with i18next, supporting multiple languages and localization strategies. Developed adaptive design patterns ensuring seamless experiences across mobile and desktop platforms. Created sophisticated form management with React Hook Form and comprehensive client-side and server-side validation.",
      },
    ],
  },
  {
    period: "Jun 2017 - Oct 2019",
    role: "Lead Site Operations Engineer",
    company: "SigFig/WikiInvest Inc.",
    description:
      "As Lead Site Operations Engineer at SigFig/WikiInvest Inc., I spearheaded a team of six engineers, focusing on maintaining and enhancing the reliability, performance, and security of our production and development environments. My leadership responsibilities included team mentorship, workload distribution, and strategic planning to optimize site operations.",
    skills: [
      "Linux Server Administration",
      "Red Hat Enterprise Linux",
      "Configuration Management",
      "Team Leadership",
      "System Monitoring",
      "High Availability Systems",
      "ELK Stack",
      "Splunk",
      "Git",
      "Gerrit",
    ],
    keyPoints: [
      {
        title: "Team Leadership & Mentorship",
        description:
          "Effectively managed and mentored a team of six Site Operations Engineers, fostering a collaborative and high-performance environment. This involved setting clear objectives, providing technical guidance, and conducting performance reviews to ensure team members aligned with company goals and were equipped for success.",
      },
      {
        title: "Linux Server Administration (Red Hat)",
        description:
          "Directly responsible for the administration of critical infrastructure Red Hat Enterprise Linux servers. This included proactive monitoring, performance tuning, security hardening, and ensuring high availability for all essential services. My expertise in Red Hat Linux was crucial in maintaining a stable and robust server environment.",
      },
      {
        title: "Configuration Management with Puppet",
        description:
          "Implemented and managed system configurations using Puppet, adopting an infrastructure-as-code approach. This automation was vital for consistent and efficient server deployments, updates, and configuration changes across our infrastructure, significantly reducing manual errors and improving deployment speed.",
      },
      {
        title: "System Monitoring & Alerting",
        description:
          "Established and oversaw comprehensive system monitoring using a suite of tools including Nagios, New Relic, and Runscope. This proactive monitoring strategy allowed for early detection of system anomalies and performance bottlenecks, enabling rapid response and minimizing potential service disruptions. Configured alerts and dashboards to provide real-time insights into system health and application performance.",
      },
      {
        title: "Source Code Management",
        description:
          "Managed source code using Git and Gerrit, enforcing version control best practices within the team. Implemented efficient branching strategies, managed code merges, and utilized Gerrit for code reviews to ensure code quality and facilitate seamless collaborative development workflows.",
      },
      {
        title: "Java Application Log Management",
        description:
          "Took charge of managing and analyzing Java application logs using the ELK Stack (Elasticsearch, Logstash, Kibana) and Splunk. By centralizing and analyzing logs, provided actionable insights into application behavior, system performance, and potential issues. This was instrumental in troubleshooting complex application problems and optimizing performance.",
      },
    ],
  },
  {
    period: "Oct 2015 - May 2017",
    role: "Associate DevOps Engineer / Cloud Engineer",
    company: "Bottomline Technologies",
    description:
      "As an Associate DevOps Engineer / Cloud Engineer at Bottomline Technologies, I played a pivotal role in managing and optimizing both virtual and physical server infrastructure supporting critical digital banking applications. My responsibilities spanned various operating systems, virtualization technologies, and automation tools, contributing to the efficiency and reliability of our DevOps and cloud operations.",
    skills: [
      "Virtualization (VMware vSphere)",
      "Multi-OS Management",
      "Jenkins Administration",
      "CI/CD Pipelines",
      "Puppet",
      "Cloud Services",
      "Bash/Linux Scripting",
      "PowerShell",
      "Java Application Management",
      "Database Administration",
      "WebLogic Server",
      "SFTP Automation",
    ],
    keyPoints: [
      {
        title: "Virtual and Physical Server Farm Administration",
        description:
          "Administered extensive virtual and physical server farms using VMware vSphere. This involved virtual machine provisioning, resource management, performance monitoring, and ensuring high availability across the VMware environment. My efforts were key to optimizing resource utilization and maintaining a robust virtual infrastructure.",
      },
      {
        title: "Multi-OS Server Management",
        description:
          "Managed a heterogeneous server environment comprising Red Hat Linux, CentOS, AIX, and Sun Solaris. This required a broad skillset in system administration across different Unix-based platforms, including system configuration, security, and performance tuning tailored to each OS.",
      },
      {
        title: "Jenkins Administration for CI/CD",
        description:
          "Responsible for administering Jenkins, a critical component of our Continuous Integration and Continuous Delivery (CI/CD) pipeline. Tasks included configuring Jenkins master/slave architectures, performing system upgrades, and creating and maintaining automated job configurations. This streamlined our software release processes and enhanced deployment frequency and reliability.",
      },
      {
        title: "Configuration Management with Puppet",
        description:
          "Implemented and managed system configurations using Puppet, which was essential for maintaining infrastructure as code. This automation ensured consistency across our server environments, simplified compliance management, and facilitated rapid and repeatable deployments.",
      },
      {
        title: "System Monitoring and Performance Analysis",
        description:
          "Utilized Nagios, Oracle Enterprise Manager (OEM), and Lansweeper Scanner to monitor system health and performance. This proactive monitoring enabled identification and remediation of potential issues, ensuring optimal system uptime and performance. Configured monitoring parameters and alerts to maintain system stability and responsiveness.",
      },
      {
        title: "Source Code Management across Multiple Systems",
        description:
          "Managed source code using a variety of version control systems, including Git, Stash, CollabNet SVN, and Wush.net SVN. This required adaptability and proficiency across different VCS platforms, ensuring effective version control practices were followed across various projects and teams.",
      },
      {
        title: "Production Releases and Upgrades",
        description:
          "Played a crucial role in executing production releases and upgrades of digital banking applications using Jenkins. This involved coordinating deployments, managing release schedules, and ensuring smooth and reliable application updates with minimal downtime.",
      },
      {
        title: "SFTP Automation with GoAnywhere MFT",
        description:
          "Administered SFTP automation using GoAnywhere MFT, enhancing our secure file transfer capabilities. This involved setting up automated file transfer workflows, managing security protocols, and ensuring reliable data exchange processes.",
      },
      {
        title: "Java Application Installation and Configuration",
        description:
          "Installed, configured, and managed Java applications on WebLogic Server, leveraging WebLogic Scripting Tool (WLST) for automation. This expertise was vital for efficient application deployment, configuration management, and operational tasks within the WebLogic environment.",
      },
      {
        title: "Database Administration",
        description:
          "Performed database administration tasks for both Oracle and MySQL databases. This included database maintenance, performance tuning, backup and recovery operations, and ensuring data integrity and availability for our applications.",
      },
      {
        title: "Scripting and Automation",
        description:
          "Developed and maintained scripts using Bash, PowerShell, Capistrano, and Python to automate a wide range of tasks, from application configurations to system administration and deployment processes. These scripts significantly improved efficiency and reduced manual effort in routine operations.",
      },
      {
        title: "Application Pod/Stack Provisioning",
        description:
          "Provisioned application pods and stacks using CloudBolt and PowerCLI, automating infrastructure deployments in cloud and virtualized environments. This automation was key to rapidly scaling resources and deploying applications efficiently.",
      },
    ],
  },
  {
    period: "Apr 2013 - Oct 2015",
    role: "Service Desk Analyst / Helpdesk Technician / Operations Analyst / Jr. Linux Administrator",
    company: "Andera (now Bottomline)",
    description:
      "In my multifaceted role at Andera (now Bottomline), I served as a Service Desk Analyst, Helpdesk Technician, Operations Analyst, and Jr. Linux Administrator. This position provided a broad spectrum of responsibilities, from end-user support to system administration and vendor management, laying a strong foundation in IT operations.",
    skills: [
      "Red Hat Linux Server Administration",
      "Asset Management",
      "SAAS Application Management",
      "ShoreTel Phone Systems",
      "Ticket Triage",
      "SLA Management",
      "Vendor Management",
      "SSL/TLS & Security",
    ],
    keyPoints: [
      {
        title: "Laptop Build Out, Imaging, and Deployment",
        description:
          "Responsible for the complete lifecycle of laptop deployments, including building out new laptops, performing system imaging for standardized configurations, and deploying them to end-users. This ensured all employees had properly configured and secure systems from day one.",
      },
      {
        title: "Trouble Ticket Triage and Administration",
        description:
          "Efficiently managed and triaged incoming trouble tickets, categorizing issues, prioritizing based on severity, and assigning them to appropriate technical teams. This process ensured timely responses and resolutions, maintaining operational efficiency and user satisfaction.",
      },
      {
        title: "SaaS Application Management",
        description:
          "Managed both third-party outsourced SaaS applications and internal SaaS systems. This involved user administration, system configuration, monitoring application health, and ensuring seamless operation and accessibility for all users.",
      },
      {
        title: "ShoreTel Phone System Administration",
        description:
          "Administered the ShoreTel phone system, managing user accounts, configuring phone settings, and troubleshooting communication issues. This ensured reliable and effective communication systems for the entire organization.",
      },
      {
        title: "System Administration Tasks",
        description:
          "Performed a variety of system administration tasks across different platforms, ensuring system stability, security, and optimal performance. This included user account management, system maintenance, and basic troubleshooting across various systems.",
      },
      {
        title: "Door Card System Administration",
        description:
          "Managed door card system administration, overseeing physical access controls. This involved managing user access permissions, maintaining system security, and resolving any access-related issues.",
      },
      {
        title: "Subversion Server Management",
        description:
          "Managed Subversion servers, both internal and external facing, ensuring the integrity and availability of code repositories. This included user access control, repository maintenance, and basic troubleshooting.",
      },
      {
        title: "Asset Management",
        description:
          "Conducted comprehensive asset management, meticulously tracking IT inventory, including both hardware and software assets. This ensured accurate record-keeping, efficient resource allocation, and compliance with software licensing agreements.",
      },
      {
        title: "Vendor Management",
        description:
          "Managed relationships with various IT vendors, overseeing service delivery, managing contracts, and ensuring cost-effective solutions. This role involved vendor coordination for IT services and product procurement.",
      },
      {
        title: "Laptop Encryption Administration",
        description:
          "Administered laptop encryption solutions to secure company data, ensuring compliance with security policies and protecting sensitive information against unauthorized access.",
      },
      {
        title: "SSL Certificate and Keystore Management",
        description:
          "Installed and managed SSL certificates and keystores for SaaS custom URL branding. This was crucial for ensuring secure, branded customer experiences and maintaining trust through secure web access.",
      },
      {
        title: "Red Hat Linux Server Administration",
        description:
          "Administered Red Hat Linux servers, performing basic system administration tasks, maintenance, and troubleshooting. This experience was foundational for my subsequent roles focusing on Linux environments.",
      },
      {
        title: "Customer Issue Troubleshooting within SLAs",
        description:
          "Consistently troubleshot customer issues within defined Service Level Agreements (SLAs), ensuring timely and effective resolutions. This focus on SLA adherence was critical for maintaining customer satisfaction and meeting service delivery metrics.",
      },
      {
        title: "Limited Exposure to MySQL",
        description:
          "Gained initial exposure to MySQL database administration, performing basic tasks and developing a foundational understanding of database management principles.",
      },
    ],
  },
  {
    period: "May 2011 - Nov 2012",
    role: "System Support Analyst",
    company: "CVS Pharmacies Inc.",
    description:
      "As a System Support Analyst at CVS Pharmacies Inc., I was at the forefront of providing technical assistance to CVS personnel across the United States. My primary responsibility was to deliver efficient and effective support, ensuring minimal disruption to CVS operations and maintaining high levels of user satisfaction.",
    skills: [
      "Technical Support & Troubleshooting",
      "SLA Management",
      "Ticket Triage",
    ],
    keyPoints: [
      {
        title: "First-Level System Support",
        description:
          "Served as the first point of contact for CVS personnel nationwide, answering incoming support calls and addressing a wide array of system-related issues. This required a broad understanding of CVS systems and the ability to quickly diagnose and respond to diverse technical problems.",
      },
      {
        title: "Customer Issue Troubleshooting within SLAs",
        description:
          "Responsible for troubleshooting customer issues within defined Service Level Agreements (SLAs). My focus was on providing rapid and effective solutions, aiming for first-call resolution whenever possible to meet and exceed service delivery targets.",
      },
      {
        title: "Issue Escalation",
        description:
          "When issues could not be resolved at the first level, efficiently escalated them to specialized teams. This involved accurate documentation of problems, initial troubleshooting steps taken, and clear communication of issue details to ensure smooth and effective escalation and resolution processes.",
      },
    ],
  },
  {
    period: "Sep 2006 - Apr 2011",
    role: "Cyber System Operations",
    company: "United States Air Force",
    description:
      "During my tenure in Cyber System Operations with the United States Air Force, I gained comprehensive experience across various critical IT functions, serving in roles that spanned system administration, on-site technical support, and help desk/NOC operations. This service provided a robust foundation in IT infrastructure management, security protocols, and technical support in high-stakes environments.",
    skills: [
      "Technical Support & Troubleshooting",
      "System Monitoring",
      "Linux Server Administration",
      "Configuration Management",
    ],
    keyPoints: [
      {
        title: "System Administrator within Configuration Management",
        description:
          "For one year, served as a System Administrator specializing in configuration management. In this capacity, I was responsible for managing and maintaining systems within a strict configuration management framework. This involved ensuring system compliance with security standards, implementing configuration changes in a controlled and auditable manner, and maintaining system consistency across the infrastructure. My work was crucial in upholding system integrity and security within a highly regulated environment.",
      },
      {
        title: "On-Site Technical Support",
        description:
          "Dedicated a year to providing direct, on-site technical support to end-users. This role required hands-on troubleshooting of hardware and software issues, system setup and maintenance, and rapid problem resolution to ensure operational readiness. My on-site support was vital for maintaining user productivity and system uptime in demanding operational settings.",
      },
      {
        title: "Help Desk/NOC Technical Support",
        description:
          "For two and a half years, operated in Help Desk and Network Operations Center (NOC) technical support roles. In these positions, I was responsible for monitoring network and system performance, responding to system alerts, and providing remote technical troubleshooting and resolution. This involved using monitoring tools to detect and diagnose issues, performing initial triage, and escalating complex problems as needed. My work in the NOC was essential for maintaining continuous system availability and network stability.",
      },
    ],
  },
];
