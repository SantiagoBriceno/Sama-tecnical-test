export const recipeConsultOptions = {
  relations: ['author', 'author.credentials'],
  select: {
    id: true,
    title: true,
    description: true,
    created_at: true,
    author: {
      credentials: {
        username: true,
      },
      lastLogin: true,
    },
  },
};

export const recipeDetailsConsultOptions = {
  relations: [
    'author',
    'author.credentials',
    'ingredients',
    'steps',
    'collaborators',
    'collaborators.user',
    'collaborators.user.credentials',
  ],
  select: {
    id: true,
    title: true,
    description: true,
    created_at: true,
    author: {
      credentials: {
        username: true,
      },
      lastLogin: true,
    },
    ingredients: {
      id: true,
      name: true,
      quantity: true,
      unit: true,
    },
    steps: {
      id: true,
      stepNumber: true,
      instruction: true,
    },
    collaborators: {
      id: true,
      user: {
        lastLogin: true,
        credentials: {
          username: true,
        },
      },
    },
  },
};

export type InputRecipeFields = 'title' | 'description' | 'ingredients' | 'steps';