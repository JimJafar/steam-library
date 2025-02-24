type Metadata = {
  id: number;
  metacriticUrl?: string;
  metacriticScore?: number;
  steamScore?: number;
  steamReviewCount?: number;
  onMac: boolean;
  onDeck: string;
  igdbScore?: number;
  igdbGenres?: string[];
  igdbTimeToBeat?: {
    normally: number;
    hastily: number;
    completely: number;
  };
  igdbUrl?: string;
};

export default Metadata;
