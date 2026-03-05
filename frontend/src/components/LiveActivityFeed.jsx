import { useEffect, useState } from "react";

const names = [
  "Hasan Mahmud",
  "Sadia Akter",
  "Rakib Hossain",
  "Tanvir Ahmed",
  "Nusrat Jahan",
  "Mehedi Hasan",
  "Fahim Rahman",
  "Sabbir Khan",
  "Rafiul Islam",
  "Mahmudul Hasan",
  "Shakib Al Hasan",
  "Farhana Yasmin",
  "Imran Hossain",
  "Tasnia Rahman",
  "Arif Hossain",
  "Jannatul Ferdous",
  "Mamun Ahmed",
  "Sakib Mahmud",
  "Sharmin Akter",
  "Saiful Islam",
  "Mizanur Rahman",
  "Shuvo Ahmed",
  "Rashed Khan",
  "Nazmul Hossain",
  "Rumana Akter",
  "Faisal Mahmud",
  "Jahid Hasan",
  "Ritu Akter",
  "Anik Rahman",
  "Kamrul Hasan",
  "Mahbub Alam",
  "Rifat Hossain",
  "Nabila Sultana",
  "Rubel Ahmed",
  "Tania Akter",
  "Rasel Mahmud",
  "Abir Hasan",
  "Shamim Hossain",
  "Nusrat Sultana",
  "Riad Ahmed",
  "Minhaz Rahman",
  "Rasel Hossain",
  "Sumaiya Akter",
  "Rony Ahmed",
  "Sharif Mahmud",
  "Nahid Hasan",
  "Sharmin Sultana",
  "Masud Rana",
  "Zahid Hossain",
  "Farhana Akter",
  "Arman Hossain",
  "Sadman Rahman",
  "Jubayer Ahmed",
  "Nusrat Jahan Rimi",
  "Raihan Hasan",
  "Faria Sultana",
  "Sabbir Rahman",
  "Anwar Hossain",
  "Raisa Akter",
  "Morshed Alam",
  "Rifat Mahmud",
  "Shila Akter",
  "Foysal Ahmed",
  "Imtiaz Hasan",
  "Rina Sultana",
  "Mahadi Hasan",
  "Rokon Hossain",
  "Jerin Akter",
  "Tamim Rahman",
  "Ariful Islam",
  "Salma Akter",
  "Habibur Rahman",
  "Rasel Khan",
  "Naznin Akter",
  "Saad Mahmud",
  "Rakibul Islam",
  "Sultana Parvin",
  "Samiul Hasan",
  "Riad Mahmud",
  "Jannat Akter",
  "Shahin Hossain",
  "Ratul Hasan",
  "Nasima Akter",
  "Rafi Ahmed",
  "Shahadat Hossain",
  "Mim Akter",
  "Mahfuz Rahman",
  "Sohag Hossain",
  "Jannatul Islam",
  "Faruk Ahmed",
  "Shadman Hasan",
  "Shabnam Sultana",
  "Belal Hossain",
  "Rafiul Hasan",
  "Samira Akter",
  "Nasir Uddin",
  "Riadul Islam",
  "Afia Rahman",
  "Habib Mahmud",
];

const tasks = [
  "YouTube comment task",
  "Instagram like task",
  "Logo design",
  "Facebook page setup",
  "Data entry work",
  "Website bug fix",
  "YouTube video share task",
  "Instagram follow task",
  "Facebook post share task",
  "Product description writing",
  "Simple logo redesign",
  "Website testing task",
  "Landing page feedback",
  "Social media comment task",
  "Blog post writing",
  "Article proofreading",
  "Excel data formatting",
  "PowerPoint slide design",
  "Website UI review",
  "WordPress plugin setup",
  "Shopify product upload",
  "E-commerce product listing",
  "Instagram story share task",
  "Facebook group posting task",
  "Online survey participation",
  "Image background removal",
  "Photo resizing task",
  "Thumbnail design",
  "YouTube channel setup",
  "Instagram bio setup",
  "Twitter retweet task",
  "LinkedIn post share",
  "Product review writing",
  "Website speed test",
  "Google form data entry",
  "Copy paste data entry",
  "Document formatting",
  "PDF to Word conversion",
  "WordPress theme installation",
  "Landing page content writing",
  "Email template design",
  "Basic website SEO check",
  "Keyword research task",
  "Blog image upload",
  "WordPress blog posting",
  "Social media post scheduling",
  "Website link testing",
  "Simple bug reporting",
  "Website feature testing",
  "User experience feedback",
  "Mobile app testing",
  "App review writing",
  "Facebook ad setup",
  "Google ad copy writing",
  "Online research task",
  "Market research summary",
  "Product comparison research",
  "Lead generation task",
  "Email list building",
  "LinkedIn profile research",
  "Website competitor analysis",
  "Instagram hashtag research",
  "Content rewriting task",
  "Grammar correction task",
  "Short caption writing",
  "Simple translation task",
  "Video title writing",
  "YouTube tag research",
  "Image tagging task",
  "Content moderation task",
  "Forum posting task",
  "Community comment task",
  "Discord server setup",
  "Telegram group setup",
  "Website form testing",
  "Mobile responsiveness testing",
  "Browser compatibility testing",
  "WordPress comment moderation",
  "Product image upload",
  "E-commerce review moderation",
  "Basic Canva design",
  "Poster design task",
  "Flyer design task",
  "Business card design",
  "Simple banner design",
  "Ad banner design",
  "Facebook cover design",
  "Instagram post design",
  "Website icon design",
  "Favicon design",
  "Logo icon design",
  "Website content upload",
  "Blog category setup",
  "Newsletter formatting",
  "Email proofreading",
  "Website sitemap review",
  "Content tagging task",
  "Online directory submission",
  "Website meta description writing",
];

const events = [
  { type: "task", icon: "📋", color: "text-blue-600" },
  { type: "join", icon: "👤", color: "text-purple-600" },
  { type: "earn", icon: "💰", color: "text-green-600" },
  { type: "award", icon: "🏆", color: "text-orange-500" },
];

function generateEvent() {
  const event = events[Math.floor(Math.random() * events.length)];
  const name = names[Math.floor(Math.random() * names.length)];
  const task = tasks[Math.floor(Math.random() * tasks.length)];
  const amount = Math.floor(Math.random() * 300) + 50;

  let message = "";

  if (event.type === "task") {
    message = `New task posted: "${task}"`;
  }

  if (event.type === "join") {
    message = `${name} joined EarnMinute`;
  }

  if (event.type === "earn") {
    message = `${name} earned ৳${amount}`;
  }

  if (event.type === "award") {
    message = `${name} became Freelancer of the Week`;
  }

  return {
    id: Date.now() + Math.random(),
    icon: event.icon,
    color: event.color,
    message,
  };
}

function LiveActivityFeed() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newEvent = generateEvent();

      setActivities((prev) => {
        const updated = [newEvent, ...prev];
        return updated.slice(0, 5);
      });
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-md p-5 w-full max-w-sm">
      <h3 className="font-semibold text-gray-800 mb-4">
        Live Marketplace Activity
      </h3>

      <div className="space-y-3 overflow-hidden">
        {activities.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-3 bg-gray-50 rounded-lg p-3 transition-all duration-500"
          >
            <span className={`text-lg ${item.color}`}>{item.icon}</span>

            <p className="text-sm text-gray-700">{item.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LiveActivityFeed;
