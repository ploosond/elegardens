export interface Project {
  _id: number;
  client: string;
  title: {
    en: string;
    de: string;
  };
  category: {
    en: string;
    de: string;
  };
  tagline: {
    en: string;
    de: string;
  };
  image: string;
  about: {
    en: string;
    de: string;
  };
  challenge: {
    en: string;
    de: string;
  };
  solution: {
    en: string;
    de: string;
  };
  result: {
    en: string;
    de: string;
  };
}

const projects: Project[] = [
  {
    _id: 1,
    client: 'OKAPA',
    title: {
      en: 'An Everyday Object, Designed to the Extreme',
      de: 'Ein Alltagsobjekt, extrem gestaltet',
    },
    category: {
      en: 'Product Design',
      de: 'Produktdesign',
    },
    tagline: {
      en: 'A luxury accessory for health- and trend-conscious Gen Z.',
      de: 'Ein Luxus-Accessoire für gesundheits- und trendbewusste Gen Z.',
    },
    image: 'https://res.cloudinary.com/dl2zglwft/image/upload/cld-sample',
    about: {
      en: 'OKAPA is a startup focused on everyday wellness accessories that blend thoughtful engineering with modern aesthetics. Founded by a team of passionate designers and health enthusiasts, OKAPA aims to make wellness a seamless part of daily life. Their products are designed to be both functional and beautiful, encouraging users to integrate healthy habits into their routines effortlessly.',
      de: 'OKAPA ist ein Startup, das sich auf Wellness-Accessoires für den Alltag konzentriert, die durchdachte Technik mit modernem Design verbinden. Gegründet von einem Team leidenschaftlicher Designer und Gesundheitsbegeisterter, möchte OKAPA Wohlbefinden nahtlos in den Alltag integrieren. Ihre Produkte sind funktional und ästhetisch ansprechend gestaltet, um gesunde Gewohnheiten mühelos zu fördern.',
    },
    challenge: {
      en: 'Design an accessory that feels premium while remaining affordable, lightweight, and manufacturable at scale. The team needed to ensure the product would appeal to Gen Z consumers, who value both sustainability and style. Balancing these requirements with tight production deadlines was a major hurdle.',
      de: 'Ein Accessoire zu entwerfen, das sich hochwertig anfühlt, aber dennoch erschwinglich, leicht und in großem Maßstab herstellbar ist. Das Team musste sicherstellen, dass das Produkt für die Gen Z attraktiv ist, die Wert auf Nachhaltigkeit und Stil legt. Diese Anforderungen mit engen Produktionsfristen zu vereinen, war eine große Herausforderung.',
    },
    solution: {
      en: 'We prototyped multiple form factors, converged on a recyclable polymer shell with soft-touch finish, and designed modular components for mass assembly. User testing sessions with target customers provided valuable feedback, leading to ergonomic improvements and a more intuitive user experience. The final product is both eco-friendly and stylish, with customizable color options.',
      de: 'Wir haben mehrere Formfaktoren prototypisiert, uns auf eine recycelbare Polymerhülle mit Soft-Touch-Oberfläche geeinigt und modulare Komponenten für die Massenfertigung entwickelt. Nutzertests mit der Zielgruppe lieferten wertvolles Feedback, das zu ergonomischen Verbesserungen und einer intuitiveren Benutzererfahrung führte. Das Endprodukt ist umweltfreundlich, stilvoll und in verschiedenen Farben erhältlich.',
    },
    result: {
      en: "Reduced manufacturing cost by 18% and improved user satisfaction scores in testing; product launched to positive press. OKAPA's accessory was featured in several design magazines and quickly gained traction among influencers. Early sales exceeded expectations, and the company is now planning to expand its product line.",
      de: 'Die Herstellungskosten wurden um 18 % gesenkt und die Benutzerzufriedenheit in Tests verbessert; das Produkt wurde mit positiver Presse eingeführt. Das OKAPA-Accessoire wurde in mehreren Designmagazinen vorgestellt und fand schnell Anklang bei Influencern. Die ersten Verkaufszahlen übertrafen die Erwartungen, und das Unternehmen plant bereits die Erweiterung der Produktpalette.',
    },
  },
  {
    _id: 2,
    client: 'Master Kong',
    title: {
      en: 'An Innovation Journey in Bottled, Sugar-Free Tea',
      de: 'Eine Innovationsreise im Bereich zuckerfreier Tee in Flaschen',
    },
    category: {
      en: 'Brand & Packaging',
      de: 'Marke & Verpackung',
    },
    tagline: {
      en: 'Crafting a modern bottled tea rooted in traditional Chinese tea culture.',
      de: 'Modernen Flaschentee kreieren, verwurzelt in der traditionellen chinesischen Teekultur.',
    },
    image: 'https://res.cloudinary.com/dl2zglwft/image/upload/cld-sample',
    about: {
      en: 'Master Kong wanted a refreshed identity for a sugar-free product line to reach younger consumers. The project aimed to modernize the brand while honoring its roots in traditional Chinese tea culture. Extensive market research revealed a growing demand for healthy, convenient beverages with authentic flavors.',
      de: 'Master Kong wollte eine aufgefrischte Identität für eine zuckerfreie Produktlinie, um jüngere Verbraucher zu erreichen. Ziel des Projekts war es, die Marke zu modernisieren und gleichzeitig die Wurzeln in der traditionellen chinesischen Teekultur zu bewahren. Umfangreiche Marktforschung zeigte eine steigende Nachfrage nach gesunden, praktischen Getränken mit authentischem Geschmack.',
    },
    challenge: {
      en: 'Balance cultural heritage with contemporary shelf appeal while clearly communicating health benefits. The team needed to create packaging that would stand out in a crowded market and resonate with both traditionalists and trendsetters. Regulatory requirements for labeling and ingredient transparency added complexity.',
      de: 'Kulturelles Erbe mit modernem Regalauftritt in Einklang bringen und gleichzeitig die gesundheitlichen Vorteile klar kommunizieren. Das Team musste eine Verpackung schaffen, die sich im umkämpften Markt abhebt und sowohl Traditionalisten als auch Trendsetter anspricht. Gesetzliche Vorgaben für Kennzeichnung und Transparenz der Inhaltsstoffe erschwerten die Aufgabe zusätzlich.',
    },
    solution: {
      en: "Created a visual system combining classic tea motifs with bold, minimal packaging and clear nutrition cues. The new design features hand-drawn illustrations, vibrant colors, and easy-to-read labels. A marketing campaign highlighted the product's health benefits and cultural story, using social media influencers to reach a wider audience.",
      de: 'Wir haben ein visuelles System entwickelt, das klassische Teemotive mit mutigem, minimalistischem Verpackungsdesign und klaren Nährwertangaben kombiniert. Das neue Design umfasst handgezeichnete Illustrationen, kräftige Farben und gut lesbare Etiketten. Eine Marketingkampagne hob die gesundheitlichen Vorteile und die kulturelle Geschichte hervor und nutzte Social-Media-Influencer, um ein breiteres Publikum zu erreichen.',
    },
    result: {
      en: 'Line performed 22% above forecast in Q1 after launch and increased awareness among target demos. The product quickly became a favorite among young professionals and students, leading to expanded distribution in major cities. Master Kong received industry awards for innovation and design.',
      de: 'Die Linie schnitt im ersten Quartal nach der Einführung 22 % besser ab als prognostiziert und steigerte die Bekanntheit in der Zielgruppe. Das Produkt wurde schnell zum Favoriten bei jungen Berufstätigen und Studenten, was zu einer erweiterten Distribution in Großstädten führte. Master Kong erhielt Branchenpreise für Innovation und Design.',
    },
  },
  {
    _id: 3,
    client: 'Cornell Lab of Ornithology',
    title: {
      en: 'Using brand to bend the curve on biodiversity loss',
      de: 'Mit Markenbildung den Biodiversitätsverlust aufhalten',
    },
    category: {
      en: 'Campaign',
      de: 'Kampagne',
    },
    tagline: {
      en: 'Amplifying conservation through storytelling, identity and community engagement.',
      de: 'Naturschutz durch Storytelling, Identität und Gemeinschaft fördern.',
    },
    image: 'https://res.cloudinary.com/dl2zglwft/image/upload/cld-sample',
    about: {
      en: 'A cross-disciplinary effort to increase funding and public engagement for conservation projects. The Cornell Lab of Ornithology partnered with NGOs, scientists, and local communities to create a unified message about the importance of biodiversity. The campaign aimed to inspire action and foster a sense of shared responsibility.',
      de: 'Ein interdisziplinäres Projekt zur Steigerung der Finanzierung und öffentlichen Beteiligung an Naturschutzprojekten. Das Cornell Lab of Ornithology arbeitete mit NGOs, Wissenschaftlern und lokalen Gemeinschaften zusammen, um eine einheitliche Botschaft über die Bedeutung der Biodiversität zu vermitteln. Die Kampagne sollte zum Handeln anregen und ein Gefühl gemeinsamer Verantwortung schaffen.',
    },
    challenge: {
      en: 'Translate scientific work into emotionally resonant stories that drive donations and policy attention. The team faced the challenge of making complex research accessible and compelling to a broad audience. Overcoming skepticism and apathy required creative storytelling and strong visual identity.',
      de: 'Wissenschaftliche Arbeit in emotional ansprechende Geschichten übersetzen, die Spenden und politische Aufmerksamkeit fördern. Die Herausforderung bestand darin, komplexe Forschungsergebnisse für ein breites Publikum zugänglich und spannend zu machen. Um Skepsis und Gleichgültigkeit zu überwinden, waren kreatives Storytelling und eine starke visuelle Identität erforderlich.',
    },
    solution: {
      en: 'Developed a campaign narrative, provided brand refresh, and produced templates for partner stories. The team organized workshops, created multimedia content, and launched a social media initiative to engage supporters. Success stories from the field were highlighted to demonstrate real-world impact.',
      de: 'Entwicklung einer Kampagnenerzählung, Marken-Refresh und Vorlagen für Partnergeschichten. Das Team organisierte Workshops, erstellte multimediale Inhalte und startete eine Social-Media-Initiative, um Unterstützer zu gewinnen. Erfolgsgeschichten aus der Praxis wurden hervorgehoben, um die tatsächliche Wirkung zu zeigen.',
    },
    result: {
      en: 'Secured new partner commitments and measurable uplift in donations and social engagement. The campaign reached over 1 million people online, and several policy changes were attributed to increased public awareness. The Cornell Lab continues to build on this momentum for future projects.',
      de: 'Neue Partner gewonnen und messbaren Anstieg bei Spenden und sozialem Engagement erzielt. Die Kampagne erreichte über 1 Million Menschen online, und mehrere politische Veränderungen wurden auf das gestiegene öffentliche Bewusstsein zurückgeführt. Das Cornell Lab baut auf diesem Erfolg für zukünftige Projekte auf.',
    },
  },
];

export default projects;
