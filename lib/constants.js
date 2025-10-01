// lib/constants.js - Constantes de l'application
export const ROLES = [
  'Développeur Frontend',
  'Développeur Backend',
  'Développeur Full Stack',
  'DevOps Engineer',
  'Data Engineer',
  'Data Scientist',
  'Architect Solution',
  'Tech Lead',
  'Product Manager',
  'Scrum Master',
  'QA Engineer',
  'UI/UX Designer'
];

export const EXPERIENCE_LEVELS = [
  { value: 'junior', label: 'Junior (0-2 ans)', min: 0, max: 2 },
  { value: 'middle', label: 'Confirmé (3-5 ans)', min: 3, max: 5 },
  { value: 'senior', label: 'Senior (6-10 ans)', min: 6, max: 10 },
  { value: 'expert', label: 'Expert (10+ ans)', min: 10, max: 99 }
];

export const LOCATIONS = [
  'Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice', 'Nantes', 
  'Montpellier', 'Strasbourg', 'Bordeaux', 'Lille', 'Remote'
];

export const CONTRACT_TYPES = [
  'CDI', 'CDD', 'Freelance', 'Stage', 'Alternance', 'Interim'
];

export const POPULAR_SKILLS = [
  'JavaScript', 'TypeScript', 'React', 'Vue.js', 'Angular', 'Node.js',
  'Python', 'Java', 'PHP', 'C#', 'Go', 'Ruby',
  'MySQL', 'PostgreSQL', 'MongoDB', 'Redis',
  'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes',
  'Jenkins', 'GitLab CI', 'Terraform'
];

export const SCORING_WEIGHTS = {
  EXPERIENCE: 0.3,
  SKILLS: 0.25,
  CERTIFICATIONS: 0.2,
  AVAILABILITY: 0.15,
  REVIEWS: 0.1
};

export default {
  ROLES,
  EXPERIENCE_LEVELS,
  LOCATIONS,
  CONTRACT_TYPES,
  POPULAR_SKILLS,
  SCORING_WEIGHTS
};