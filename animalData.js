const animalData = [
    // INSECTS & BUGS
    {
        name: "Earwig",
        category: "insect",
        difficulty: "hard",
        poopDescription: "Tiny dark pellets, almost like pepper grains",
        poopShape: "dots",
        poopColor: "#2c1810",
        poopSize: 2,
        funFact: "Earwig frass (poop) is so tiny it looks like coffee grounds! They're actually great composters.",
        hint: "This tiny insect has pincers on its rear end"
    },
    {
        name: "Caterpillar",
        category: "insect",
        difficulty: "hard",
        poopDescription: "Small green or brown pellets called frass",
        poopShape: "cylinder",
        poopColor: "#4a5d23",
        poopSize: 3,
        funFact: "Caterpillar poop is called 'frass' and gardeners love it as fertilizer!",
        hint: "Future butterfly that munches on leaves all day"
    },
    {
        name: "Cricket",
        category: "insect",
        difficulty: "hard",
        poopDescription: "Tiny black specks, like poppy seeds",
        poopShape: "dots",
        poopColor: "#1a1a1a",
        poopSize: 1,
        funFact: "Cricket poop is dry and odorless - that's why they make good pets!",
        hint: "This insect chirps at night"
    },
    {
        name: "Beetle",
        category: "insect",
        difficulty: "hard",
        poopDescription: "Small cylindrical pellets, often found in wood",
        poopShape: "cylinder",
        poopColor: "#3e2723",
        poopSize: 2,
        funFact: "Some beetle larvae poop is rectangular and used to build protective cases!",
        hint: "Hard-shelled insect, some species can lift 850 times their weight"
    },

    // BIRDS
    {
        name: "Pigeon",
        category: "bird",
        difficulty: "easy",
        poopDescription: "White and black splatter, liquid consistency",
        poopShape: "splat",
        poopColor: "#ffffff",
        poopSize: 15,
        funFact: "Pigeon poop is white because birds don't pee - the white part is their urine!",
        hint: "City bird that bobs its head when walking"
    },
    {
        name: "Seagull",
        category: "bird",
        difficulty: "medium",
        poopDescription: "Large white splatter, often with dark center",
        poopShape: "splat",
        poopColor: "#f5f5f5",
        poopSize: 25,
        funFact: "Seagull poop is so acidic it can damage car paint!",
        hint: "Coastal bird known for stealing french fries"
    },
    {
        name: "Owl",
        category: "bird",
        difficulty: "medium",
        poopDescription: "White wash down trees, plus pellets with bones",
        poopShape: "pellet",
        poopColor: "#d4d4d4",
        poopSize: 20,
        funFact: "Owls also cough up pellets with bones and fur - not poop but equally interesting!",
        hint: "Nocturnal bird that can turn its head 270 degrees"
    },
    {
        name: "Parrot",
        category: "bird",
        difficulty: "medium",
        poopDescription: "Green and white twisted rope-like dropping",
        poopShape: "twist",
        poopColor: "#90ee90",
        poopSize: 12,
        funFact: "Parrot poop color changes based on their fruit diet!",
        hint: "Colorful talking bird"
    },
    {
        name: "Chicken",
        category: "bird",
        difficulty: "easy",
        poopDescription: "Brown and white paste, sometimes with white cap",
        poopShape: "blob",
        poopColor: "#8b6f47",
        poopSize: 18,
        funFact: "Chicken poop is so nitrogen-rich it needs to be composted before using as fertilizer!",
        hint: "Farm bird that lays eggs"
    },

    // FARM ANIMALS
    {
        name: "Cow",
        category: "farm",
        difficulty: "easy",
        poopDescription: "Large flat patty, like a pancake",
        poopShape: "patty",
        poopColor: "#5d4e37",
        poopSize: 80,
        funFact: "Cow patties can be dried and used as fuel in many countries!",
        hint: "Large farm animal that says 'moo'"
    },
    {
        name: "Horse",
        category: "farm",
        difficulty: "easy",
        poopDescription: "Round balls in a pile, like large marbles",
        poopShape: "balls",
        poopColor: "#6b4423",
        poopSize: 40,
        funFact: "Horse poop doesn't smell as bad as other animals because they're herbivores with efficient digestion!",
        hint: "Animal that people ride, known for galloping"
    },
    {
        name: "Pig",
        category: "farm",
        difficulty: "easy",
        poopDescription: "Soft logs, similar to large dog poop",
        poopShape: "log",
        poopColor: "#7a5c3a",
        poopSize: 35,
        funFact: "Pigs are so clean they designate a bathroom area away from where they eat and sleep!",
        hint: "Pink farm animal that loves mud"
    },
    {
        name: "Sheep",
        category: "farm",
        difficulty: "medium",
        poopDescription: "Small round pellets, like chocolate chips",
        poopShape: "pellets",
        poopColor: "#4a3c28",
        poopSize: 8,
        funFact: "Sheep poop pellets are naturally fertilizer-coated and great for gardens!",
        hint: "Woolly farm animal that says 'baa'"
    },
    {
        name: "Goat",
        category: "farm",
        difficulty: "medium",
        poopDescription: "Small oval pellets, like black beans",
        poopShape: "beans",
        poopColor: "#3e2f1f",
        poopSize: 6,
        funFact: "Goat pellets are so dry they can be used immediately as fertilizer without composting!",
        hint: "Farm animal known for eating everything and climbing"
    },
    {
        name: "Llama",
        category: "farm",
        difficulty: "medium",
        poopDescription: "Bean-shaped pellets in communal piles",
        poopShape: "beans",
        poopColor: "#5c4a3a",
        poopSize: 10,
        funFact: "Llamas have communal dung piles - the whole herd uses the same bathroom spot!",
        hint: "South American animal that might spit at you"
    },

    // REPTILES
    {
        name: "Alligator",
        category: "reptile",
        difficulty: "medium",
        poopDescription: "White and brown log with bones visible",
        poopShape: "log",
        poopColor: "#8fbc8f",
        poopSize: 45,
        funFact: "Alligator poop often contains fish scales and bones, and smells surprisingly fruity!",
        hint: "Large reptile with powerful jaws, found in swamps"
    },
    {
        name: "Snake",
        category: "reptile",
        difficulty: "medium",
        poopDescription: "Long tube with white urate cap",
        poopShape: "tube",
        poopColor: "#654321",
        poopSize: 25,
        funFact: "Snakes poop infrequently - sometimes only once a month after a big meal!",
        hint: "Legless reptile that slithers"
    },
    {
        name: "Iguana",
        category: "reptile",
        difficulty: "hard",
        poopDescription: "Dark pellet with white urate attached",
        poopShape: "pellet",
        poopColor: "#3a5f3a",
        poopSize: 15,
        funFact: "Iguana poop in pools is a major problem in Florida - they love to poop while swimming!",
        hint: "Large lizard with spines along its back"
    },
    {
        name: "Turtle",
        category: "reptile",
        difficulty: "medium",
        poopDescription: "Brown log or pellets, often in water",
        poopShape: "log",
        poopColor: "#5d4a2a",
        poopSize: 20,
        funFact: "Sea turtle poop helps maintain healthy seagrass beds and coral reefs!",
        hint: "Reptile with a shell home"
    },
    {
        name: "Gecko",
        category: "reptile",
        difficulty: "hard",
        poopDescription: "Tiny brown pellet with white tip",
        poopShape: "pellet",
        poopColor: "#4a3929",
        poopSize: 3,
        funFact: "Gecko poop is so small it's often mistaken for mouse droppings!",
        hint: "Small lizard that can walk on ceilings"
    },

    // WILD ANIMALS
    {
        name: "Elephant",
        category: "wild",
        difficulty: "easy",
        poopDescription: "Huge round balls, basketball-sized",
        poopShape: "boulder",
        poopColor: "#8b7355",
        poopSize: 100,
        funFact: "Elephants poop up to 300 pounds a day! Their dung spreads seeds across the savanna.",
        hint: "Largest land animal with a trunk"
    },
    {
        name: "Tiger",
        category: "wild",
        difficulty: "medium",
        poopDescription: "Large segmented logs with hair visible",
        poopShape: "log",
        poopColor: "#5c4033",
        poopSize: 50,
        funFact: "Tigers mark territory with their poop and it smells distinctly musky!",
        hint: "Striped big cat from Asia"
    },
    {
        name: "Giraffe",
        category: "wild",
        difficulty: "medium",
        poopDescription: "Small pellets that scatter when dropped from height",
        poopShape: "pellets",
        poopColor: "#6b5d4f",
        poopSize: 12,
        funFact: "Giraffe poop falls 6 feet and scatters on impact - natural fertilizer spreading!",
        hint: "Tallest animal with a long neck"
    },
    {
        name: "Hippo",
        category: "wild",
        difficulty: "medium",
        poopDescription: "Spray of diarrhea-like consistency",
        poopShape: "spray",
        poopColor: "#4a3f36",
        poopSize: 70,
        funFact: "Hippos spin their tails while pooping to spread it around - it's called 'muck-spreading'!",
        hint: "Large African animal that loves water"
    },
    {
        name: "Rhino",
        category: "wild",
        difficulty: "medium",
        poopDescription: "Large boluses in middens (poop piles)",
        poopShape: "bolus",
        poopColor: "#5e4a3a",
        poopSize: 60,
        funFact: "Rhinos use communal dung piles called middens as message boards for other rhinos!",
        hint: "Animal with a horn on its nose"
    },
    {
        name: "Koala",
        category: "wild",
        difficulty: "hard",
        poopDescription: "Eucalyptus-scented pellets",
        poopShape: "pellets",
        poopColor: "#4a5d3a",
        poopSize: 8,
        funFact: "Baby koalas eat their mother's special poop called 'pap' to get digestive bacteria!",
        hint: "Australian marsupial that eats eucalyptus"
    },
    {
        name: "Panda",
        category: "wild",
        difficulty: "medium",
        poopDescription: "Green logs full of bamboo pieces",
        poopShape: "log",
        poopColor: "#5a6b3b",
        poopSize: 40,
        funFact: "Pandas poop 40 times a day because bamboo is so hard to digest!",
        hint: "Black and white bear from China"
    },
    {
        name: "Wombat",
        category: "wild",
        difficulty: "hard",
        poopDescription: "Cube-shaped pellets",
        poopShape: "cube",
        poopColor: "#5d4e37",
        poopSize: 20,
        funFact: "Wombats have cube-shaped poop! Scientists think it's to mark territory without rolling away.",
        hint: "Australian animal that digs burrows"
    },

    // COMMON ANIMALS
    {
        name: "Dog",
        category: "common",
        difficulty: "easy",
        poopDescription: "Brown logs, varies by size",
        poopShape: "log",
        poopColor: "#654321",
        poopSize: 25,
        funFact: "Dogs prefer to poop aligned with Earth's magnetic field - facing north or south!",
        hint: "Man's best friend"
    },
    {
        name: "Cat",
        category: "common",
        difficulty: "easy",
        poopDescription: "Small dark logs, usually buried",
        poopShape: "log",
        poopColor: "#3e2817",
        poopSize: 12,
        funFact: "Cats bury their poop as an instinct to hide from predators!",
        hint: "Pet that purrs and uses a litter box"
    },
    {
        name: "Rabbit",
        category: "common",
        difficulty: "easy",
        poopDescription: "Round pellets like cocoa puffs",
        poopShape: "pellets",
        poopColor: "#4a3c28",
        poopSize: 5,
        funFact: "Rabbits eat some of their own poop (cecotropes) to re-digest nutrients!",
        hint: "Hopping animal with long ears"
    },
    {
        name: "Mouse",
        category: "common",
        difficulty: "medium",
        poopDescription: "Tiny rice-grain shaped pellets",
        poopShape: "rice",
        poopColor: "#2c2416",
        poopSize: 2,
        funFact: "Mice poop up to 80 droppings per day!",
        hint: "Tiny rodent that squeaks"
    },
    {
        name: "Rat",
        category: "common",
        difficulty: "medium",
        poopDescription: "Dark capsule-shaped pellets",
        poopShape: "capsule",
        poopColor: "#1a1410",
        poopSize: 5,
        funFact: "Rat droppings can indicate their diet - greenish means poison consumption!",
        hint: "Larger rodent, often found in cities"
    },
    {
        name: "Squirrel",
        category: "common",
        difficulty: "medium",
        poopDescription: "Small round pellets, lighter than rat poop",
        poopShape: "pellets",
        poopColor: "#5c4a3a",
        poopSize: 4,
        funFact: "Squirrel poop is rounder and lighter colored than rat poop due to their nut diet!",
        hint: "Bushy-tailed animal that climbs trees"
    },
    {
        name: "Deer",
        category: "common",
        difficulty: "medium",
        poopDescription: "Pile of oval pellets",
        poopShape: "pellets",
        poopColor: "#3e2f1f",
        poopSize: 10,
        funFact: "Deer poop changes from pellets to clumps when they eat fresh green vegetation!",
        hint: "Forest animal with antlers"
    },
    {
        name: "Fox",
        category: "common",
        difficulty: "medium",
        poopDescription: "Twisted rope with pointed ends",
        poopShape: "twist",
        poopColor: "#4a3929",
        poopSize: 20,
        funFact: "Fox poop often has a musky smell and contains berry seeds or fur!",
        hint: "Cunning canine with a bushy tail"
    },
    {
        name: "Raccoon",
        category: "common",
        difficulty: "medium",
        poopDescription: "Tubular with blunt ends, often in latrines",
        poopShape: "tube",
        poopColor: "#3e2f1f",
        poopSize: 18,
        funFact: "Raccoons create communal toilets called latrines, often on roofs or decks!",
        hint: "Masked bandit that washes its food"
    },
    {
        name: "Bat",
        category: "common",
        difficulty: "hard",
        poopDescription: "Sparkly black crumbles (from insect wings)",
        poopShape: "crumble",
        poopColor: "#1a1a1a",
        poopSize: 3,
        funFact: "Bat guano sparkles because of all the insect wings! It's valuable as fertilizer.",
        hint: "Only flying mammal, hangs upside down"
    }
];

// Helper function to get animals by difficulty
function getAnimalsByDifficulty(difficulty) {
    if (difficulty === 'all') return animalData;
    return animalData.filter(animal => animal.difficulty === difficulty);
}

// Helper function to get random animals
function getRandomAnimals(count, difficulty = 'all') {
    const available = getAnimalsByDifficulty(difficulty);
    const shuffled = [...available].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

// Helper function to get wrong choices
function getWrongChoices(correctAnimal, count, difficulty = 'all') {
    const available = getAnimalsByDifficulty(difficulty)
        .filter(animal => animal.name !== correctAnimal.name);
    const shuffled = [...available].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}