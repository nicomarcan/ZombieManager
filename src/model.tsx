  export type LocationsBoard = {
    locationsById: Map<string, Location>;
    zombiesById: Map<string, Zombie>;
    locationsOrder: number[];
  }

  export type Zombie = { 
    _id: string;
    name: string;
    locationId: string;
  }

  export type Location = { 
    _id: string;
    title: string;
    description: string;
    zombieIds?: string[];
    pictures: File[];
  }

