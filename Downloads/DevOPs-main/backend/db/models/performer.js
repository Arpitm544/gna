const mongoose = require('mongoose');

// Main performer categories enum
const PerformerCategoryEnum = {
  ARTIST: 'Artist',
  COMEDIAN: 'Comedian',
  DANCER: 'Dancer',
  ENTERTAINER: 'Entertainer',
  EVENT_SERVICE: 'Event Service',
  KIDS_ENTERTAINMENT: 'Kids Entertainment',
  MAGICIAN: 'Magician',
  MUSICIAN: 'Musician',
  SPEAKER_TRAINER: 'Speaker/Trainer',
  SPECIAL_PERFORMER: 'Special Performer',
  TRADITIONAL_PERFORMER: 'Traditional Performer'
};

// Comprehensive subcategories enum
const PerformerSubCategoryEnum = {
  // Artist subcategories
  LIVE_PAINTERS: 'Live Painters',
  SKETCH_ARTISTS: 'Sketch Artists',
  CALLIGRAPHERS: 'Calligraphers',
  HENNA_ARTISTS: 'Henna Artists',
  
  // Comedian subcategories (based on style field in the original schema)
  STAND_UP: 'Stand-up',
  IMPROV: 'Improv',
  OBSERVATIONAL: 'Observational',
  DARK_HUMOR: 'Dark Humor',
  
  // Dancer subcategories
  CLASSICAL: 'Classical',
  HIP_HOP: 'Hip Hop',
  CONTEMPORARY: 'Contemporary',
  FOLK_DANCE: 'Folk',
  STREET_DANCE: 'Street',
  FLASH_MOB: 'Flash Mob',
  CHOREOGRAPHERS: 'Choreographers',
  
  // Entertainer subcategories
  COMEDIANS: 'Stand-up Comedians',
  MAGICIANS: 'Magicians',
  CLOWNS: 'Clowns',
  PUPPETEERS: 'Puppeteers',
  STORYTELLERS: 'Storytellers',
  
  // Event Service subcategories
  PHOTOGRAPHERS: 'Photographers',
  VIDEOGRAPHERS: 'Videographers',
  EVENT_HOSTS: 'Event Hosts/MCs',
  EVENT_PLANNERS: 'Event Planners',
  DECORATORS: 'Decorators',
  LIGHTING_SOUND_TECHNICIANS: 'Lighting and Sound Technicians',
  
  // Kids Entertainment subcategories
  BALLOON_ARTISTS: 'Balloon Artists',
  FACE_PAINTERS: 'Face Painters',
  MASCOTS_CHARACTER_ACTORS: 'Mascots and Character Actors',
  
  // Magician subcategories (based on specialties field in the original schema)
  CARD_MAGIC: 'Card Magic',
  ILLUSION: 'Illusion',
  MENTALISM: 'Mentalism',
  CLOSE_UP: 'Close-up Magic',
  
  // Musician subcategories
  CLASSICAL_SINGER: 'Classical',
  POP_SINGER: 'Pop',
  JAZZ_SINGER: 'Jazz',
  ROCK_SINGER: 'Rock',
  FOLK_SINGER: 'Folk',
  GUITARISTS: 'Guitarists',
  PIANISTS: 'Pianists',
  VIOLINISTS: 'Violinists',
  DRUMMERS: 'Drummers',
  ROCK_BANDS: 'Rock Bands',
  JAZZ_BANDS: 'Jazz Bands',
  ACOUSTIC_BANDS: 'Acoustic Bands',
  DJS: 'DJs',
  
  // Speaker/Trainer subcategories
  MOTIVATIONAL_SPEAKERS: 'Motivational Speakers',
  CORPORATE_TRAINERS: 'Corporate Trainers',
  WORKSHOP_CONDUCTORS: 'Workshop Conductors',
  
  // Special Performer subcategories
  FIRE_PERFORMERS: 'Fire Performers',
  ACROBATS: 'Acrobats',
  AERIAL_ARTISTS: 'Aerial Artists',
  STUNT_PERFORMERS: 'Stunt Performers',
  CIRCUS_PERFORMERS: 'Circus Performers',
  
  // Traditional Performer subcategories
  FOLK_SINGERS: 'Folk Singers',
  PUPPET_SHOW_ARTISTS: 'Puppet Show Artists',
  BHARATANATYAM: 'Bharatanatyam',
  KATHAK: 'Kathak',
  STREET_PLAY_ARTISTS: 'Street Play Artists'
};

// Category to subcategory mapping for validation
const CategoryToSubcategoryMap = {
  [PerformerCategoryEnum.ARTIST]: [
    PerformerSubCategoryEnum.LIVE_PAINTERS,
    PerformerSubCategoryEnum.SKETCH_ARTISTS,
    PerformerSubCategoryEnum.CALLIGRAPHERS,
    PerformerSubCategoryEnum.HENNA_ARTISTS
  ],
  [PerformerCategoryEnum.COMEDIAN]: [
    PerformerSubCategoryEnum.STAND_UP,
    PerformerSubCategoryEnum.IMPROV,
    PerformerSubCategoryEnum.OBSERVATIONAL,
    PerformerSubCategoryEnum.DARK_HUMOR
  ],
  [PerformerCategoryEnum.DANCER]: [
    PerformerSubCategoryEnum.CLASSICAL,
    PerformerSubCategoryEnum.HIP_HOP,
    PerformerSubCategoryEnum.CONTEMPORARY,
    PerformerSubCategoryEnum.FOLK_DANCE,
    PerformerSubCategoryEnum.STREET_DANCE,
    PerformerSubCategoryEnum.FLASH_MOB,
    PerformerSubCategoryEnum.CHOREOGRAPHERS
  ],
  [PerformerCategoryEnum.ENTERTAINER]: [
    PerformerSubCategoryEnum.COMEDIANS,
    PerformerSubCategoryEnum.MAGICIANS,
    PerformerSubCategoryEnum.CLOWNS,
    PerformerSubCategoryEnum.PUPPETEERS,
    PerformerSubCategoryEnum.STORYTELLERS
  ],
  [PerformerCategoryEnum.EVENT_SERVICE]: [
    PerformerSubCategoryEnum.PHOTOGRAPHERS,
    PerformerSubCategoryEnum.VIDEOGRAPHERS,
    PerformerSubCategoryEnum.EVENT_HOSTS,
    PerformerSubCategoryEnum.EVENT_PLANNERS,
    PerformerSubCategoryEnum.DECORATORS,
    PerformerSubCategoryEnum.LIGHTING_SOUND_TECHNICIANS
  ],
  [PerformerCategoryEnum.KIDS_ENTERTAINMENT]: [
    PerformerSubCategoryEnum.CLOWNS,
    PerformerSubCategoryEnum.BALLOON_ARTISTS,
    PerformerSubCategoryEnum.FACE_PAINTERS,
    PerformerSubCategoryEnum.MASCOTS_CHARACTER_ACTORS
  ],
  [PerformerCategoryEnum.MAGICIAN]: [
    PerformerSubCategoryEnum.CARD_MAGIC,
    PerformerSubCategoryEnum.ILLUSION,
    PerformerSubCategoryEnum.MENTALISM,
    PerformerSubCategoryEnum.CLOSE_UP
  ],
  [PerformerCategoryEnum.MUSICIAN]: [
    PerformerSubCategoryEnum.CLASSICAL_SINGER,
    PerformerSubCategoryEnum.POP_SINGER,
    PerformerSubCategoryEnum.JAZZ_SINGER,
    PerformerSubCategoryEnum.ROCK_SINGER,
    PerformerSubCategoryEnum.FOLK_SINGER,
    PerformerSubCategoryEnum.GUITARISTS,
    PerformerSubCategoryEnum.PIANISTS,
    PerformerSubCategoryEnum.VIOLINISTS,
    PerformerSubCategoryEnum.DRUMMERS,
    PerformerSubCategoryEnum.ROCK_BANDS,
    PerformerSubCategoryEnum.JAZZ_BANDS,
    PerformerSubCategoryEnum.ACOUSTIC_BANDS,
    PerformerSubCategoryEnum.DJS
  ],
  [PerformerCategoryEnum.SPEAKER_TRAINER]: [
    PerformerSubCategoryEnum.MOTIVATIONAL_SPEAKERS,
    PerformerSubCategoryEnum.CORPORATE_TRAINERS,
    PerformerSubCategoryEnum.WORKSHOP_CONDUCTORS
  ],
  [PerformerCategoryEnum.SPECIAL_PERFORMER]: [
    PerformerSubCategoryEnum.FIRE_PERFORMERS,
    PerformerSubCategoryEnum.ACROBATS,
    PerformerSubCategoryEnum.AERIAL_ARTISTS,
    PerformerSubCategoryEnum.STUNT_PERFORMERS,
    PerformerSubCategoryEnum.CIRCUS_PERFORMERS
  ],
  [PerformerCategoryEnum.TRADITIONAL_PERFORMER]: [
    PerformerSubCategoryEnum.FOLK_SINGERS,
    PerformerSubCategoryEnum.PUPPET_SHOW_ARTISTS,
    PerformerSubCategoryEnum.BHARATANATYAM,
    PerformerSubCategoryEnum.KATHAK,
    PerformerSubCategoryEnum.STREET_PLAY_ARTISTS
  ]
};

// Consolidated Performer Schema
const PerformerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
  category: {
    type: String,
    enum: Object.values(PerformerCategoryEnum),
    required: true
  },
  subCategory: {
    type: String,
    enum: Object.values(PerformerSubCategoryEnum),
    required: true
  },
  // For performers like comedians and magicians that had array fields
  specialties: {
    type: [String],
    default: []
  },
  experience: {
    type: Number,
    required: true
  },
  pricing: {
    type: Number,
    required: true
  },
  availability: {
    type: Object,
    default: {}
  },
  rating: {
    type: Number,
    default: 0
  },
  bio: {
    type: String
  }
});

// Custom validator to ensure subcategory matches category
PerformerSchema.pre('validate', function(next) {
  const validSubcategories = CategoryToSubcategoryMap[this.category] || [];
  if (!validSubcategories.includes(this.subCategory)) {
    this.invalidate('subCategory', `Invalid subcategory '${this.subCategory}' for category '${this.category}'`);
  }
  next();
});

const Performer = mongoose.model("performers", PerformerSchema);

module.exports = {
  Performer,
  PerformerCategoryEnum,
  PerformerSubCategoryEnum,
  CategoryToSubcategoryMap
};
