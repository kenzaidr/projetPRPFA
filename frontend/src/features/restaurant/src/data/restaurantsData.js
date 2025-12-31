// Données complètes des restaurants marocains avec leurs menus
export const RESTAURANTS = [
  {
    id: 1,
    name: 'Al Fassia',
    cuisine: 'Marocain Traditionnel',
    city: 'Casablanca',
    address: 'Boulevard Zerktouni, Casablanca',
    latitude: 33.5731,
    longitude: -7.5898,
    rating: 4.8,
    reviews: 1247,
    deliveryTime: '30-45 min',
    deliveryFee: 15,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400',
    isFavorite: false,
    menu: [
      {
        category: 'Entrées',
        items: [
          { id: 1, name: 'Salade Marocaine', description: 'Salade de tomates, concombres, oignons et coriandre', price: 35 },
          { id: 2, name: 'Harira', description: 'Soupe traditionnelle aux lentilles et tomates', price: 25 },
          { id: 3, name: 'Zaalouk', description: 'Salade d\'aubergines grillées', price: 30 },
          { id: 4, name: 'Pastilla au poulet', description: 'Feuilleté sucré-salé au poulet et amandes', price: 65 },
          { id: 5, name: 'Briouates aux épinards', description: 'Feuilletés aux épinards et fromage', price: 32 }
        ]
      },
      {
        category: 'Plats Principaux',
        items: [
          { id: 6, name: 'Tajine d\'agneau aux pruneaux', description: 'Tajine traditionnel avec agneau, pruneaux et amandes', price: 95 },
          { id: 7, name: 'Couscous royal', description: 'Couscous avec agneau, poulet et merguez', price: 110 },
          { id: 8, name: 'Pastilla au poisson', description: 'Feuilleté au poisson et fruits de mer', price: 85 },
          { id: 9, name: 'Méchoui', description: 'Agneau rôti aux épices marocaines', price: 120 },
          { id: 10, name: 'Tajine de poulet aux citrons confits', description: 'Poulet mijoté avec citrons confits et olives', price: 75 },
          { id: 11, name: 'Kefta aux œufs', description: 'Boulettes de viande avec œufs et sauce tomate', price: 70 },
          { id: 12, name: 'Tajine de bœuf aux pommes', description: 'Bœuf mijoté avec pommes et miel', price: 85 }
        ]
      },
      {
        category: 'Desserts',
        items: [
          { id: 13, name: 'Pastilla au lait', description: 'Dessert traditionnel aux amandes et fleur d\'oranger', price: 40 },
          { id: 14, name: 'Briouates au miel', description: 'Feuilletés au miel et sésame', price: 35 },
          { id: 15, name: 'Chebakia', description: 'Pâtisserie au miel et sésame', price: 30 },
          { id: 16, name: 'Gâteau au miel', description: 'Gâteau traditionnel au miel et amandes', price: 45 }
        ]
      }
    ]
  },
  {
    id: 2,
    name: 'Le Jardin',
    cuisine: 'Marocain Moderne',
    city: 'Rabat',
    address: 'Avenue Allal Ben Abdellah, Rabat',
    latitude: 34.0209,
    longitude: -6.8416,
    rating: 4.6,
    reviews: 892,
    deliveryTime: '25-40 min',
    deliveryFee: 12,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
    isFavorite: false,
    menu: [
      {
        category: 'Entrées',
        items: [
          { id: 17, name: 'Salade d\'oranges à la cannelle', description: 'Oranges fraîches avec cannelle et menthe', price: 28 },
          { id: 18, name: 'Briouates aux épinards', description: 'Feuilletés aux épinards et fromage', price: 32 },
          { id: 19, name: 'Salade de betteraves', description: 'Betteraves rôties avec fromage de chèvre', price: 35 },
          { id: 20, name: 'Harira moderne', description: 'Harira revisitée avec légumes croquants', price: 28 }
        ]
      },
      {
        category: 'Plats Principaux',
        items: [
          { id: 21, name: 'Tajine de poisson', description: 'Poisson frais aux légumes et olives', price: 90 },
          { id: 22, name: 'Couscous aux légumes', description: 'Couscous végétarien aux légumes de saison', price: 65 },
          { id: 23, name: 'Tajine de poulet aux légumes', description: 'Poulet avec courgettes, carottes et pommes de terre', price: 70 },
          { id: 24, name: 'Brochettes d\'agneau', description: 'Brochettes d\'agneau marinées aux épices', price: 85 },
          { id: 25, name: 'Tajine végétarien', description: 'Tajine aux légumes et fruits secs', price: 55 }
        ]
      },
      {
        category: 'Desserts',
        items: [
          { id: 26, name: 'Mille-feuille marocain', description: 'Pâtisserie feuilletée au miel', price: 38 },
          { id: 27, name: 'Sorbet à la fleur d\'oranger', description: 'Sorbet artisanal parfumé', price: 32 },
          { id: 28, name: 'Tarte aux dattes', description: 'Tarte sucrée aux dattes et amandes', price: 50 }
        ]
      }
    ]
  },
  {
    id: 3,
    name: 'Dar Moha',
    cuisine: 'Cuisine Marocaine Gastronomique',
    city: 'Marrakech',
    address: 'Rue Dar el Bacha, Marrakech',
    latitude: 31.6295,
    longitude: -7.9811,
    rating: 4.9,
    reviews: 2156,
    deliveryTime: '35-50 min',
    deliveryFee: 20,
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400',
    isFavorite: false,
    menu: [
      {
        category: 'Entrées',
        items: [
          { id: 29, name: 'Assiette de mezze marocains', description: 'Sélection de salades et entrées traditionnelles', price: 75 },
          { id: 30, name: 'Bastilla aux fruits de mer', description: 'Feuilleté aux fruits de mer et épices', price: 85 },
          { id: 31, name: 'Salade de fenouil', description: 'Fenouil frais avec orange et olives', price: 40 },
          { id: 32, name: 'Pastilla au poulet premium', description: 'Pastilla préparée avec des ingrédients de qualité supérieure', price: 95 }
        ]
      },
      {
        category: 'Plats Principaux',
        items: [
          { id: 33, name: 'Tajine d\'agneau aux dattes', description: 'Agneau mijoté avec dattes et amandes', price: 130 },
          { id: 34, name: 'Couscous aux 7 légumes', description: 'Couscous traditionnel avec légumes variés', price: 95 },
          { id: 35, name: 'Tajine de poulet aux abricots', description: 'Poulet avec abricots secs et amandes', price: 85 },
          { id: 36, name: 'Méchoui royal', description: 'Agneau entier rôti aux herbes', price: 150 },
          { id: 37, name: 'Tajine de poisson safrané', description: 'Poisson avec safran et légumes', price: 110 },
          { id: 38, name: 'Couscous royal premium', description: 'Couscous avec agneau, poulet, merguez et légumes', price: 125 }
        ]
      },
      {
        category: 'Desserts',
        items: [
          { id: 39, name: 'Assortiment de pâtisseries', description: 'Sélection de pâtisseries marocaines', price: 55 },
          { id: 40, name: 'Crème brûlée à la fleur d\'oranger', description: 'Crème brûlée parfumée', price: 45 },
          { id: 41, name: 'Tarte aux dattes', description: 'Tarte sucrée aux dattes et amandes', price: 50 },
          { id: 42, name: 'Mhalbiya premium', description: 'Crème de riz à la fleur d\'oranger avec amandes', price: 48 }
        ]
      }
    ]
  },
  {
    id: 4,
    name: 'Café Clock',
    cuisine: 'Marocain Fusion',
    city: 'Fès',
    address: 'Derb el Magana, Fès',
    latitude: 34.0331,
    longitude: -5.0000,
    rating: 4.5,
    reviews: 634,
    deliveryTime: '20-35 min',
    deliveryFee: 10,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400',
    isFavorite: false,
    menu: [
      {
        category: 'Entrées',
        items: [
          { id: 43, name: 'Harira moderne', description: 'Harira revisitée avec légumes croquants', price: 28 },
          { id: 44, name: 'Salade de quinoa marocaine', description: 'Quinoa avec légumes et vinaigrette citron', price: 38 },
          { id: 45, name: 'Briouates au thon', description: 'Feuilletés au thon et épices', price: 30 }
        ]
      },
      {
        category: 'Plats Principaux',
        items: [
          { id: 46, name: 'Burger marocain', description: 'Burger avec kefta, fromage et légumes', price: 65 },
          { id: 47, name: 'Tajine végétarien', description: 'Tajine aux légumes et fruits secs', price: 55 },
          { id: 48, name: 'Pizza marocaine', description: 'Pizza avec merguez, olives et fromage', price: 70 },
          { id: 49, name: 'Wrap au poulet', description: 'Wrap avec poulet grillé et salade', price: 45 },
          { id: 50, name: 'Tajine de poulet fusion', description: 'Poulet avec légumes et épices modernes', price: 75 }
        ]
      },
      {
        category: 'Desserts',
        items: [
          { id: 51, name: 'Brownie aux dattes', description: 'Brownie moelleux aux dattes', price: 35 },
          { id: 52, name: 'Tiramisu marocain', description: 'Tiramisu à la fleur d\'oranger', price: 40 },
          { id: 53, name: 'Cheesecake aux amandes', description: 'Cheesecake avec amandes et miel', price: 42 }
        ]
      }
    ]
  },
  {
    id: 5,
    name: 'Restaurant Al Mounia',
    cuisine: 'Marocain Classique',
    city: 'Casablanca',
    address: '95, Rue du Prince Moulay Abdellah, Casablanca',
    latitude: 33.5731,
    longitude: -7.5898,
    rating: 4.7,
    reviews: 1834,
    deliveryTime: '30-45 min',
    deliveryFee: 15,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400',
    isFavorite: false,
    menu: [
      {
        category: 'Entrées',
        items: [
          { id: 54, name: 'Salade de tomates', description: 'Tomates fraîches avec oignons et coriandre', price: 30 },
          { id: 55, name: 'Soupe de lentilles', description: 'Soupe traditionnelle aux lentilles', price: 25 },
          { id: 56, name: 'Briouates au fromage', description: 'Feuilletés au fromage et herbes', price: 35 },
          { id: 57, name: 'Zaalouk', description: 'Salade d\'aubergines grillées', price: 30 }
        ]
      },
      {
        category: 'Plats Principaux',
        items: [
          { id: 58, name: 'Tajine de bœuf aux pommes', description: 'Bœuf mijoté avec pommes et miel', price: 85 },
          { id: 59, name: 'Couscous à la viande', description: 'Couscous avec viande d\'agneau', price: 100 },
          { id: 60, name: 'Tajine de poulet aux olives', description: 'Poulet avec olives vertes et citron', price: 75 },
          { id: 61, name: 'Rfissa', description: 'Plat traditionnel aux lentilles et poulet', price: 80 },
          { id: 62, name: 'Kefta tagine', description: 'Boulettes de viande aux épices', price: 70 }
        ]
      },
      {
        category: 'Desserts',
        items: [
          { id: 63, name: 'Mhalbiya', description: 'Crème de riz à la fleur d\'oranger', price: 35 },
          { id: 64, name: 'Sellou', description: 'Pâtisserie aux amandes et sésame', price: 40 },
          { id: 65, name: 'Gâteau aux amandes', description: 'Gâteau traditionnel aux amandes', price: 45 }
        ]
      }
    ]
  },
  {
    id: 6,
    name: 'Naranj',
    cuisine: 'Marocain & Libanais',
    city: 'Rabat',
    address: 'Avenue Mohammed V, Rabat',
    latitude: 34.0209,
    longitude: -6.8416,
    rating: 4.6,
    reviews: 1023,
    deliveryTime: '25-40 min',
    deliveryFee: 12,
    image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=400',
    isFavorite: false,
    menu: [
      {
        category: 'Entrées',
        items: [
          { id: 66, name: 'Hummus', description: 'Purée de pois chiches à l\'huile d\'olive', price: 32 },
          { id: 67, name: 'Moutabal', description: 'Purée d\'aubergines grillées', price: 35 },
          { id: 68, name: 'Fatayer aux épinards', description: 'Petits chaussons aux épinards', price: 30 },
          { id: 69, name: 'Taboulé', description: 'Salade de persil, tomates et boulgour', price: 28 }
        ]
      },
      {
        category: 'Plats Principaux',
        items: [
          { id: 70, name: 'Shawarma marocain', description: 'Viande marinée avec légumes et sauce', price: 75 },
          { id: 71, name: 'Tajine de poisson', description: 'Poisson aux légumes et citron', price: 85 },
          { id: 72, name: 'Kebab d\'agneau', description: 'Brochettes d\'agneau grillées', price: 90 },
          { id: 73, name: 'Mansaf', description: 'Plat de riz avec agneau et yaourt', price: 95 },
          { id: 74, name: 'Couscous libanais', description: 'Couscous avec viande et légumes', price: 88 }
        ]
      },
      {
        category: 'Desserts',
        items: [
          { id: 75, name: 'Baklava', description: 'Pâtisserie aux noix et miel', price: 38 },
          { id: 76, name: 'Knafeh', description: 'Gâteau au fromage et sirop', price: 42 },
          { id: 77, name: 'Mhalbiya', description: 'Crème de riz à la fleur d\'oranger', price: 35 }
        ]
      }
    ]
  }
];

export default RESTAURANTS;
