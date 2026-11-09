/**
 * 个人主页的全部内容配置 / Your homepage content
 * ------------------------------------------------------------
 * 只需修改此文件即可更新资料，不需要修改 HTML。
 * 当前所有人物资料、论文和经历均为示例，请在发布前替换。
 * 字符串使用引号；每个数组项目之间保留逗号。完整说明见 docs/修改指南.md。
 */
window.SITE_DATA = {
  profile: {
    name: "WanxinZhang",
    nativeName: "张万鑫", // 不显示中文名时填 ""
    initials: "YN", // 未设置头像时显示的缩写
    role: "Student",
    department: "School of Computer Science and Artificial Intelligence, Changzhou University",
    affiliation: "CCZU",
    location: "Changzhou, Jiangsu, China",
    email: "zwx8282520@126.com",
    avatar: "assets/self.png", // 例如 "assets/avatar.jpg"；留空显示默认图案
    cv: "", // 例如 "assets/cv.pdf"；留空隐藏简历按钮
    note: "Always happy to exchange ideas and explore new collaborations.", // 留空可隐藏
    links: [
      { label: "Email", icon: "mail", href: "zwx8282520@126.com" },
      { label: "CSDN", icon: "scholar", href: "https://blog.csdn.net/zwx82520?type=blog" },
      { label: "GitHub", icon: "github", href: "https://github.com/star-zwx" },
      // 可添加 { label: "ORCID", icon: "external", href: "https://orcid.org/你的编号" }
    ],
  },

  about: {
    title: "A curious mind.\nA world to explore.", // \n 表示换行
    paragraphs: [
      "Hello! I am a researcher interested in the intersection of **brain-computer interfaces, machine learning, and intelligent systems**. My research focuses on EEG signal processing, brain dynamics analysis, and machine learning approaches for understanding and decoding human brain activity",

"My work explores how signal processing, deep learning, and interpretable AI can be integrated to develop more accurate, reliable, and explainable models for neural signal analysis. I am particularly interested in EEG microstate analysis, brain-state decoding, domain adaptation, and intelligent methods for investigating neurological and cognitive processes.",

"Beyond algorithm development, I enjoy translating research ideas into practical applications, including real-time brain-computer interaction, embedded intelligent systems, and human-centered computing. I am passionate about exploring new ideas, conducting experiments, and building intelligent technologies that bridge the gap between neuroscience and artificial intelligence.",
    ],
    news: [
  {
    date: "2026.11",
    text: "Exploring intelligent EEG analysis and brain-computer interface technologies, with a focus on interpretable machine learning and neural signal decoding."
  },
  {
    date: "2026.09",
    text: "Investigating EEG microstate-based domain adaptation methods for robust cross-subject and cross-dataset brain-state classification."
  },
  {
    date: "2026.07",
    text: "Developing real-time EEG acquisition and brain-computer interaction systems integrating signal processing, machine learning, and embedded technologies."
  },
  {
    date: "2025.10",
    text: "Completed the development of a portable ECG monitoring and acquisition system based on the RK3506 embedded Linux platform."
  }
], // 整个数组填 [] 可隐藏 Lately 栏目
  },

  research: {
    intro: "A few questions and directions that keep me thinking.",
    items: [
      { icon: "network", title: "Machine learning", description: "Learning meaningful representations from complex, real-world data." },
      { icon: "human", title: "Human-centered AI", description: "Building intelligent systems that work thoughtfully with people." },
      { icon: "science", title: "Open science", description: "Making research reproducible, accessible, and useful to others." },
    ],
  },

  publications: {
    note: "A selection of recent work. * Equal contribution.",
    items: [
      {
        id: "example-learning-2026", // 唯一标识，不要和其他论文重复
        year: 2026,
        title: "Analysis of EEG microstate transition patterns and multi-instance learning-based recognition model for depression",
        authors: ["wanxin zhang", "wenjie li", "xuemei fan"],
        venue: "", // 示例论文，请替换成真实成果
        venueShort: "",
        summary: "This paper presents a novel approach for analyzing EEG microstate transition patterns and developing a multi-instance learning-based recognition model for depression. The proposed method leverages the temporal dynamics of EEG microstates to extract meaningful features that can be used for accurate classification of depressive states. Experimental results demonstrate the effectiveness of the approach in distinguishing between depressed and non-depressed individuals, highlighting its potential for clinical applications in mental health assessment.",
        illustration: "network", // network / layers / dots；也可用 image 指定论文图片
        image: "", // 例如 "assets/paper-1.png"；留空使用内置示意图
        links: [
          // { label: "Paper", href: "https://arxiv.org/abs/真实编号" },
          // { label: "Code", href: "https://github.com/用户名/仓库名" },
          // { label: "Project", href: "https://你的项目网址" },
        ], // 仅显示已配置的真实链接
        bibtex: "", // 粘贴真实 BibTeX 后显示 Cite 按钮；多行内容可使用反引号包围
      },
      
    ], // 尚无论文可填 []，页面会显示简洁的待更新提示
  },

  experience: [
    { period: "2024— Present", title: "student. in CCZU", institution: "changzhou University", detail: "Research in machine learning and human-centered computing.", current: true },
    
    { period: "2020 — 2024", title: "student. in TGPU", institution: "TianGong University", detail: "An early foundation in computing, mathematics, and asking questions." },
  ],

  contact: "I’m open to research conversations, interesting questions, and opportunities to collaborate.",
  footer: {
    updated: "November 2026", // 资料更新后手动修改，例如 "December 2026"
  },
};
