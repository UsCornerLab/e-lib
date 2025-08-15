export interface ArticleSection {
  type: "paragraph" | "heading" | "image" | "quote" | "list";
  content?: string;
  url?: string;
  alt?: string;
  caption?: string;
  attribution?: string;
  items?: string[];
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: ArticleSection[];
  publishedAt: string;
  updatedAt?: string;
  category: string;
  tags: string[];
  author?: string;
  authorTitle?: string;
  authorImage?: string;
  featuredImage?: string;
  imageAlt?: string;
  imageCaption?: string;
  readingTime: number;
}

const newsArticles: Article[] = [
  {
    id: "1",
    title: "Summer Reading Program Kicks Off Next Month",
    slug: "summer-reading-program-kicks-off",
    excerpt:
      "Join our annual summer reading program with prizes, events, and activities for all ages.",
    content: [
      {
        type: "paragraph",
        content:
          "The Public Library is excited to announce the launch of our annual Summer Reading Program, starting June 1st and running through August 31st. This year's theme, 'Reading Takes You Everywhere,' encourages readers of all ages to explore new worlds, cultures, and ideas through books.",
      },
      {
        type: "paragraph",
        content:
          "The program is designed for participants of all ages, from young children to adults. Everyone can join in the fun and earn prizes for reading books and participating in library activities throughout the summer.",
      },
      {
        type: "heading",
        content: "How to Participate",
      },
      {
        type: "paragraph",
        content:
          "Registration opens on May 15th. You can sign up online through our website or in person at any library branch. Once registered, you'll receive a reading log to track your progress and information about upcoming events.",
      },
      {
        type: "list",
        items: [
          "Read books of your choice and log your reading time",
          "Attend special events and programs throughout the summer",
          "Complete reading challenges to earn additional prizes",
          "Share your reading experiences with other participants",
        ],
      },
      {
        type: "image",
        url: "/images/summer-reading.jpg",
        alt: "Children reading books at a library table",
        caption: "Participants from last year's Summer Reading Program",
      },
      {
        type: "heading",
        content: "Special Events",
      },
      {
        type: "paragraph",
        content:
          "Throughout the summer, we'll host a variety of special events for program participants, including author visits, storytelling sessions, craft workshops, and educational presentations. Check our events calendar for the full schedule.",
      },
      {
        type: "quote",
        content:
          "Last year's Summer Reading Program was our most successful yet, with over 1,200 participants reading a combined total of more than 15,000 books. We're hoping to exceed those numbers this year!",
        attribution: "Jane Smith, Library Director",
      },
      {
        type: "heading",
        content: "Prizes and Incentives",
      },
      {
        type: "paragraph",
        content:
          "Participants can earn prizes based on the number of books read or hours spent reading. Prizes include bookmarks, stickers, books, and gift certificates to local businesses. All participants who complete the program will be entered into a grand prize drawing at the end of the summer.",
      },
      {
        type: "paragraph",
        content:
          "The Summer Reading Program is made possible through the generous support of the Friends of the Library and our community sponsors. We look forward to seeing you at the library this summer!",
      },
    ],
    publishedAt: "2023-05-28T14:30:00Z",
    category: "programs",
    tags: ["summer reading", "events", "children", "teens", "adults"],
    author: "Emily Johnson",
    authorTitle: "Head Librarian",
    authorImage: "/images/emily-johnson.jpg",
    featuredImage: "/images/news1.jpg",
    imageAlt: "Children reading books at a library table",
    imageCaption: "Get ready for a summer of reading adventures!",
    readingTime: 5,
  },
  {
    id: "2",
    title: "Library Renovation Project Completed",
    slug: "library-renovation-project-completed",
    excerpt:
      "Our west wing renovation is complete, featuring new study rooms and improved accessibility.",
    content: [
      {
        type: "paragraph",
        content:
          "We are thrilled to announce the completion of our west wing renovation project. After six months of construction, the newly renovated space is now open to the public, offering enhanced facilities and services for our community.",
      },
      {
        type: "paragraph",
        content:
          "The renovation project, which began in November 2022, focused on improving accessibility, creating more study and meeting spaces, and updating our technology infrastructure. The project was funded through a combination of municipal funds and a generous grant from the National Library Foundation.",
      },
      {
        type: "image",
        url: "/images/renovation-complete.jpg",
        alt: "Newly renovated library west wing with modern furniture and bright lighting",
        caption:
          "The newly renovated west wing features modern furniture and improved lighting",
      },
      {
        type: "heading",
        content: "New Features and Improvements",
      },
      {
        type: "list",
        items: [
          "Six new private study rooms equipped with smart screens and video conferencing capabilities",
          "Expanded children's area with interactive learning stations",
          "Improved accessibility with wider aisles, adjustable-height desks, and a new elevator",
          "Enhanced Wi-Fi coverage and more charging stations throughout the space",
          "Energy-efficient lighting and climate control systems",
        ],
      },
      {
        type: "quote",
        content:
          "This renovation represents our commitment to creating a modern library that meets the evolving needs of our community. We've created spaces that support learning, collaboration, and accessibility for all.",
        attribution: "Robert Chen, Library Board President",
      },
      {
        type: "heading",
        content: "Grand Reopening Celebration",
      },
      {
        type: "paragraph",
        content:
          "To celebrate the completion of the renovation, we're hosting a grand reopening celebration on Saturday, May 20th from 10:00 AM to 4:00 PM. The event will feature tours of the new space, demonstrations of the new technology, refreshments, and activities for all ages.",
      },
      {
        type: "paragraph",
        content:
          "We invite all community members to join us for this special occasion and explore the new and improved facilities. No registration is required, and all activities are free.",
      },
      {
        type: "paragraph",
        content:
          "We would like to thank our patrons for their patience during the construction period and the temporary disruptions to our services. We believe the improved facilities will greatly enhance your library experience for years to come.",
      },
    ],
    publishedAt: "2023-05-15T10:15:00Z",
    category: "announcements",
    tags: ["renovation", "facilities", "accessibility", "technology"],
    author: "Michael Thompson",
    authorTitle: "Facilities Manager",
    featuredImage: "/images/news2.jpg",
    imageAlt: "Newly renovated library west wing",
    readingTime: 4,
  },
  {
    id: "3",
    title: "New Digital Resources Available",
    slug: "new-digital-resources-available",
    excerpt:
      "We've added new e-books, audiobooks, and online learning resources to our digital collection.",
    content: [
      {
        type: "paragraph",
        content:
          "The Public Library is pleased to announce the expansion of our digital resources collection with the addition of several new platforms and thousands of new titles. These resources are available free of charge to all library cardholders.",
      },
      {
        type: "paragraph",
        content:
          "In response to the growing demand for digital materials, we've invested in expanding our e-book and audiobook collections, as well as adding new online learning platforms to support lifelong learning for our community members.",
      },
      {
        type: "heading",
        content: "New E-book and Audiobook Titles",
      },
      {
        type: "paragraph",
        content:
          "We've added over 5,000 new e-book and audiobook titles to our collection, including bestsellers, classics, and specialized content across various genres and subjects. These titles are available through our existing platforms, OverDrive and Libby, as well as our new partnership with Hoopla Digital.",
      },
      {
        type: "image",
        url: "/images/digital-resources.jpg",
        alt: "Person using a tablet to access digital library resources",
        caption: "Access thousands of e-books and audiobooks from your device",
      },
      {
        type: "heading",
        content: "New Online Learning Platforms",
      },
      {
        type: "paragraph",
        content:
          "We're excited to introduce two new online learning platforms to our digital resources collection: LinkedIn Learning and Mango Languages.",
      },
      {
        type: "list",
        items: [
          "LinkedIn Learning (formerly Lynda.com) offers over 16,000 courses in business, technology, and creative skills taught by industry experts.",
          "Mango Languages provides interactive language learning courses for over 70 languages, including ESL courses in 21 languages.",
        ],
      },
      {
        type: "quote",
        content:
          "Our expanded digital collection reflects our commitment to providing accessible, diverse, and high-quality resources to our community, regardless of where or when they choose to use the library.",
        attribution: "Sarah Williams, Digital Resources Librarian",
      },
      {
        type: "heading",
        content: "How to Access These Resources",
      },
      {
        type: "paragraph",
        content:
          "All of these digital resources can be accessed through our website using your library card number and PIN. We've also created step-by-step guides for using each platform, which are available on our website or in print at the library.",
      },
      {
        type: "paragraph",
        content:
          "If you need assistance with accessing or using any of our digital resources, please don't hesitate to contact our reference desk or schedule a one-on-one technology help session with a librarian.",
      },
      {
        type: "paragraph",
        content:
          "We hope you enjoy exploring these new resources and welcome your feedback as we continue to develop our digital collection.",
      },
    ],
    publishedAt: "2023-05-10T09:45:00Z",
    category: "resources",
    tags: ["digital", "e-books", "audiobooks", "online learning"],
    author: "Sarah Williams",
    authorTitle: "Digital Resources Librarian",
    authorImage: "/images/sarah-williams.jpg",
    featuredImage: "/images/news3.jpg",
    imageAlt:
      "Digital devices displaying e-books and online learning platforms",
    readingTime: 6,
  },
  {
    id: "4",
    title: "Local Author Series Begins Next Week",
    slug: "local-author-series-begins",
    excerpt:
      "Join us for our new monthly series featuring talented authors from our community.",
    content: [
      {
        type: "paragraph",
        content:
          "The Public Library is proud to announce the launch of our new Local Author Series, a monthly program featuring readings, discussions, and book signings with talented authors from our community. The series begins next week and will continue on the first Thursday of each month.",
      },
      {
        type: "paragraph",
        content:
          "This initiative aims to celebrate and promote local literary talent while providing community members with the opportunity to engage directly with authors and learn about their creative processes.",
      },
      {
        type: "heading",
        content: "Inaugural Event: An Evening with Rebecca Martinez",
      },
      {
        type: "paragraph",
        content:
          "Our inaugural event will feature Rebecca Martinez, whose debut novel 'The Forgotten Garden' has received critical acclaim and was recently longlisted for the National Book Award. Martinez will read excerpts from her novel, discuss her writing journey, and answer questions from the audience.",
      },
      {
        type: "image",
        url: "/images/rebecca-martinez.jpg",
        alt: "Author Rebecca Martinez smiling with her book",
        caption:
          "Rebecca Martinez will kick off our Local Author Series on June 1st",
      },
      {
        type: "paragraph",
        content:
          "The event will take place on Thursday, June 1st, from 6:30 PM to 8:00 PM in the library's main reading room. Light refreshments will be served, and copies of 'The Forgotten Garden' will be available for purchase and signing.",
      },
      {
        type: "heading",
        content: "Upcoming Featured Authors",
      },
      {
        type: "paragraph",
        content:
          "We're excited to announce the first three authors in our series. Mark your calendars for these upcoming events:",
      },
      {
        type: "list",
        items: [
          "June 1: Rebecca Martinez (Fiction) - 'The Forgotten Garden'",
          "July 6: Dr. James Wilson (Non-fiction) - 'Urban Ecosystems: A New Perspective'",
          "August 3: Maria Gonzalez (Poetry) - 'Whispers of the City'",
        ],
      },
      {
        type: "quote",
        content:
          "Our community is home to so many talented writers whose work deserves recognition. This series is our way of supporting local authors while enriching our community's cultural life.",
        attribution: "David Park, Events Coordinator",
      },
      {
        type: "heading",
        content: "Registration Information",
      },
      {
        type: "paragraph",
        content:
          "All events in the Local Author Series are free and open to the public. While registration is not required, we encourage you to reserve your seat through our website or by calling the library, as space may be limited.",
      },
      {
        type: "paragraph",
        content:
          "If you're a local author interested in being featured in our series, please submit your information through the form on our website. We're particularly interested in featuring diverse voices and genres in our programming.",
      },
    ],
    publishedAt: "2023-05-25T11:20:00Z",
    category: "events",
    tags: ["authors", "readings", "local", "books", "community"],
    author: "David Park",
    authorTitle: "Events Coordinator",
    featuredImage: "/images/local-author.jpg",
    imageAlt: "Author reading to an audience at a library event",
    readingTime: 4,
  },
  {
    id: "5",
    title: "Library Launches New Community Outreach Program",
    slug: "library-launches-community-outreach",
    excerpt:
      "Our new mobile library service will bring books and resources to underserved areas of the community.",
    content: [
      {
        type: "paragraph",
        content:
          "The Public Library is proud to announce the launch of our new Community Outreach Program, designed to extend library services beyond our physical buildings and reach community members who may face barriers to accessing our resources.",
      },
      {
        type: "paragraph",
        content:
          "The centerpiece of this initiative is our new Mobile Library, a specially equipped vehicle that will bring books, technology, and programming to underserved areas of our community. The Mobile Library will begin its regular schedule next month, with stops at senior centers, community centers, schools, and neighborhoods with limited public transportation.",
      },
      {
        type: "image",
        url: "/images/mobile-library.jpg",
        alt: "The new mobile library vehicle parked outside the main library building",
        caption:
          "Our new Mobile Library will bring resources directly to community members",
      },
      {
        type: "heading",
        content: "Services Offered",
      },
      {
        type: "paragraph",
        content:
          "The Mobile Library will offer a variety of services, including book borrowing and returns, library card registration, technology access, and programming for all ages. The vehicle is equipped with a collection of approximately 2,500 books, Wi-Fi access, laptops and tablets for on-site use, and a small programming space.",
      },
      {
        type: "list",
        items: [
          "Book borrowing and returns",
          "Library card registration and renewal",
          "Wi-Fi access and computer use",
          "Printing and scanning services",
          "Storytimes and educational programs",
          "Technology assistance and training",
        ],
      },
      {
        type: "heading",
        content: "Schedule and Locations",
      },
      {
        type: "paragraph",
        content:
          "The Mobile Library will operate Tuesday through Saturday, with a regular schedule of stops throughout the community. The full schedule will be available on our website and printed schedules will be distributed at all library locations and community partner sites.",
      },
      {
        type: "paragraph",
        content:
          "Initial locations include Oakridge Senior Center, Westside Community Center, Parkview Elementary School, Meadowbrook Apartments, and Riverside Park. Additional locations will be added based on community needs and feedback.",
      },
      {
        type: "quote",
        content:
          "Our mission is to serve all members of our community, regardless of their circumstances. The Mobile Library allows us to remove barriers to access and bring the joy and benefits of the library directly to people where they live, learn, and gather.",
        attribution: "Maria Rodriguez, Outreach Services Manager",
      },
      {
        type: "heading",
        content: "Community Partnerships",
      },
      {
        type: "paragraph",
        content:
          "This initiative was made possible through partnerships with local organizations and businesses, as well as a grant from the National Library Foundation. We would like to thank our sponsors and partners for their support in making this program a reality.",
      },
      {
        type: "paragraph",
        content:
          "We are actively seeking additional community partners to help identify needs, coordinate services, and spread the word about this new resource. If your organization is interested in partnering with us or requesting a Mobile Library visit, please contact our Outreach Services department.",
      },
    ],
    publishedAt: "2023-05-18T13:45:00Z",
    category: "community",
    tags: ["outreach", "mobile library", "accessibility", "community service"],
    author: "Maria Rodriguez",
    authorTitle: "Outreach Services Manager",
    authorImage: "/images/maria-rodriguez.jpg",
    featuredImage: "/images/mobile-library-banner.jpg",
    imageAlt:
      "Mobile library vehicle with library staff helping community members",
    readingTime: 5,
  },
];

export function getArticleById(id: string): Article | undefined {
  return newsArticles.find((article) => article.id === id);
}

export function getRelatedArticles(
  currentId: string,
  category: string,
  limit = 3
): Article[] {
  // First get articles in the same category
  const sameCategory = newsArticles.filter(
    (article) => article.id !== currentId && article.category === category
  );

  // If we have enough articles in the same category, return them
  if (sameCategory.length >= limit) {
    return sameCategory.slice(0, limit);
  }

  // Otherwise, add other recent articles to fill up to the limit
  const otherArticles = newsArticles.filter(
    (article) => article.id !== currentId && article.category !== category
  );

  return [...sameCategory, ...otherArticles].slice(0, limit);
}

export function getAllArticles(): Article[] {
  return newsArticles;
}

export function getRecentArticles(limit = 3): Article[] {
  // Sort by published date (newest first) and take the specified number
  return [...newsArticles]
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
    .slice(0, limit);
}

export function getArticlesByCategory(category: string): Article[] {
  return newsArticles.filter((article) => article.category === category);
}
