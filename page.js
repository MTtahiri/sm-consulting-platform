import React, { useState, useEffect, useMemo } from 'react';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  ViewColumnsIcon,
  Squares2X2Icon,
  ListBulletIcon,
  ArrowDownTrayIcon,
  StarIcon,
  MapPinIcon,
  ClockIcon,
  EyeIcon,
  HeartIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

// Page principale des candidats
const CandidatesPage = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' ou 'list'
  const [currentPage, setCurrentPage] = useState(1);
  const candidatesPerPage = 20;

  // États des filtres
  const [filters, setFilters] = useState({
    search: '',
    role: 'all',
    experience: 'all',
    location: 'all',
    skills: [],
    availability: 'all',
    minTJM: '',
    maxTJM: '',
    minScore: 0,
    contractType: 'all'
  });

  const [sortBy, setSortBy] = useState('score');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showFilters, setShowFilters] = useState(false);

  // Génération de données mockées (195 candidats)
  useEffect(() => {
    const generateMockCandidates = () => {
      const roles = [
        'Développeur Frontend', 'Développeur Backend', 'Développeur Full Stack',
        'DevOps Engineer', 'Data Engineer', 'Data Scientist', 'Architect Solution',
        'Tech Lead', 'Product Manager', 'Scrum Master', 'QA Engineer', 'UI/UX Designer'
      ];

      const locations = ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice', 'Nantes', 'Bordeaux', 'Remote'];
      const contractTypes = ['CDI', 'CDD', 'Freelance', 'Stage', 'Alternance'];
      
      const skillSets = {
        'Développeur Frontend': ['React', 'Vue.js', 'Angular', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 'Sass'],
        'Développeur Backend': ['Node.js', 'Python', 'Java', 'PHP', 'C#', 'Ruby', 'Go', 'Spring Boot'],
        'Développeur Full Stack': ['React', 'Node.js', 'MongoDB', 'Express', 'Vue.js', 'MySQL', 'JavaScript'],
        'DevOps Engineer': ['Docker', 'Kubernetes', 'AWS', 'Jenkins', 'Terraform', 'Ansible', 'GitLab CI'],
        'Data Engineer': ['Python', 'Spark', 'Airflow', 'Kafka', 'Hadoop', 'SQL', 'NoSQL', 'GCP'],
        'Data Scientist': ['Python', 'R', 'TensorFlow', 'PyTorch', 'Pandas', 'Scikit-learn', 'Jupyter'],
        'UI/UX Designer': ['Figma', 'Sketch', 'Adobe XD', 'Photoshop', 'Illustrator', 'Prototyping']
      };

      const firstNames = [
        'Alexandre', 'Marie', 'Pierre', 'Sophie', 'Jean', 'Camille', 'Antoine', 'Julie',
        'Nicolas', 'Sarah', 'Thomas', 'Emma', 'David', 'Laura', 'Maxime', 'Clara',
        'Julien', 'Léa', 'Benjamin', 'Manon', 'Romain', 'Chloé', 'Lucas', 'Inès'
      ];

      const lastNames = [
        'Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Richard', 'Petit',
        'Durand', 'Leroy', 'Moreau', 'Simon', 'Laurent', 'Lefebvre', 'Michel',
        'Garcia', 'David', 'Bertrand', 'Roux', 'Vincent', 'Fournier', 'Morel'
      ];

      const mockCandidates = [];

      for (let i = 1; i <= 195; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const role = roles[Math.floor(Math.random() * roles.length)];
        const location = locations[Math.floor(Math.random() * locations.length)];
        const experience = Math.floor(Math.random() * 15) + 1;
        const skills = skillSets[role] || ['JavaScript', 'HTML', 'CSS'];
        const selectedSkills = skills.slice(0, Math.floor(Math.random() * 4) + 3);
        
        mockCandidates.push({
          id: `rec${i.toString().padStart(3, '0')}`,
          nom: `${firstName} ${lastName}`,
          email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
          role,
          experience,
          localisation: location,
          competences: selectedSkills.join(', '),
          skillsArray: selectedSkills,
          tjm: Math.floor(Math.random() * 800) + 300,
          score: Math.floor(Math.random() * 40) + 60, // Score entre 60 et 100
          disponible: Math.random() > 0.4, // 60% disponibles
          rating: Math.round((Math.random() * 2 + 3) * 10) / 10, // Entre 3.0 et 5.0
          typeContrat: contractTypes[Math.floor(Math.random() * contractTypes.length)],
          dateAjout: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          certifications: Math.random() > 0.7 ? 'AWS Certified, Scrum Master' : '',
          specialites: selectedSkills.slice(0, 2).join(', ')
        });
      }

      return mockCandidates;
    };

    setTimeout(() => {
      setCandidates(generateMockCandidates());
      setLoading(false);
    }, 1500);
  }, []);

  // Filtrage des candidats
  const filteredCandidates = useMemo(() => {
    let filtered = candidates.filter(candidate => {
      const matchesSearch = !filters.search || 
        candidate.nom.toLowerCase().includes(filters.search.toLowerCase()) ||
        candidate.competences.toLowerCase().includes(filters.search.toLowerCase()) ||
        candidate.role.toLowerCase().includes(filters.search.toLowerCase());

      const matchesRole = filters.role === 'all' || candidate.role === filters.role;
      
      const matchesExperience = filters.experience === 'all' || 
        (filters.experience === 'junior' && candidate.experience <= 3) ||
        (filters.experience === 'middle' && candidate.experience > 3 && candidate.experience <= 7) ||
        (filters.experience === 'senior' && candidate.experience > 7);

      const matchesLocation = filters.location === 'all' || candidate.localisation === filters.location;

      const matchesSkills = filters.skills.length === 0 || 
        filters.skills.every(skill => candidate.skillsArray.includes(skill));

      const matchesAvailability = filters.availability === 'all' ||
        (filters.availability === 'available' && candidate.disponible) ||
        (filters.availability === 'unavailable' && !candidate.disponible);

      const matchesTJM = (!filters.minTJM || candidate.tjm >= parseInt(filters.minTJM)) &&
        (!filters.maxTJM || candidate.tjm <= parseInt(filters.maxTJM));

      const matchesScore = candidate.score >= filters.minScore;

      const matchesContract = filters.contractType === 'all' || candidate.typeContrat === filters.contractType;

      return matchesSearch && matchesRole && matchesExperience && matchesLocation && 
             matchesSkills && matchesAvailability && matchesTJM && matchesScore && matchesContract;
    });

    // Tri
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'nom') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [candidates, filters, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredCandidates.length / candidatesPerPage);
  const paginatedCandidates = filteredCandidates.slice(
    (currentPage - 1) * candidatesPerPage,
    currentPage * candidatesPerPage
  );

  // Ajout/suppression de compétences dans le filtre
  const toggleSkillFilter = (skill) => {
    setFilters(prev => ({
      ...prev,
      skills: prev.skills.includes(skill) 
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  // Export des résultats filtrés
  const exportResults = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Nom,Role,Experience,Localisation,Competences,TJM,Score,Disponible,Rating\n"
      + filteredCandidates.map(c => 
          `${c.nom},${c.role},${c.experience},${c.localisation},"${c.competences}",${c.tjm},${c.score},${c.disponible ? 'Oui' : 'Non'},${c.rating}`
        ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `candidats_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Chargement des 195 candidats...</p>
          <div className="mt-2 w-64 bg-gray-200 rounded-full h-2 mx-auto">
            <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{width: '75%'}}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec navigation */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Candidats IT</h1>
              <p className="text-sm text-gray-500">{filteredCandidates.length} profils trouvés sur {candidates.length}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={exportResults}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                Exporter
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Barre de recherche et contrôles */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Barre de recherche */}
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Rechercher par nom, compétences, rôle..."
                />
              </div>
            </div>

            {/* Contrôles */}
            <div className="flex items-center space-x-4">
              {/* Tri */}
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortBy(field);
                  setSortOrder(order);
                }}
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
              >
                <option value="score-desc">Score décroissant</option>
                <option value="score-asc">Score croissant</option>
                <option value="nom-asc">Nom A-Z</option>
                <option value="nom-desc">Nom Z-A</option>
                <option value="experience-desc">Expérience décroissante</option>
                <option value="tjm-desc">TJM décroissant</option>
                <option value="rating-desc">Note décroissante</option>
              </select>

              {/* Mode d'affichage */}
              <div className="flex rounded-md shadow-sm">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 text-sm font-medium border rounded-l-md ${
                    viewMode === 'grid'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <Squares2X2Icon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 text-sm font-medium border rounded-r-md ${
                    viewMode === 'list'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <ListBulletIcon className="w-4 h-4" />
                </button>
              </div>

              {/* Filtres */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`inline-flex items-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium ${
                  showFilters
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                <FunnelIcon className="w-4 h-4 mr-2" />
                Filtres
              </button>
            </div>
          </div>
        </div>

        {/* Panel de filtres */}
        {showFilters && (
          <div className="bg-white p-6 rounded-lg shadow-sm mb-8 border-l-4 border-blue-500">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Filtres avancés</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Rôle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rôle</label>
                <select
                  value={filters.role}
                  onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="all">Tous les rôles</option>
                  <option value="Développeur Frontend">Frontend</option>
                  <option value="Développeur Backend">Backend</option>
                  <option value="Développeur Full Stack">Full Stack</option>
                  <option value="DevOps Engineer">DevOps</option>
                  <option value="Data Engineer">Data Engineer</option>
                  <option value="Data Scientist">Data Scientist</option>
                  <option value="UI/UX Designer">UI/UX Designer</option>
                </select>
              </div>

              {/* Expérience */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Expérience</label>
                <select
                  value={filters.experience}
                  onChange={(e) => setFilters(prev => ({ ...prev, experience: e.target.value }))}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="all">Tous niveaux</option>
                  <option value="junior">Junior (0-3 ans)</option>
                  <option value="middle">Confirmé (4-7 ans)</option>
                  <option value="senior">Senior (8+ ans)</option>
                </select>
              </div>

              {/* Localisation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Localisation</label>
                <select
                  value={filters.location}
                  onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="all">Toutes</option>
                  <option value="Paris">Paris</option>
                  <option value="Lyon">Lyon</option>
                  <option value="Marseille">Marseille</option>
                  <option value="Toulouse">Toulouse</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>

              {/* Disponibilité */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Disponibilité</label>
                <select
                  value={filters.availability}
                  onChange={(e) => setFilters(prev => ({ ...prev, availability: e.target.value }))}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="all">Tous</option>
                  <option value="available">Disponibles</option>
                  <option value="unavailable">Non disponibles</option>
                </select>
              </div>

              {/* TJM */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">TJM (€/jour)</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={filters.minTJM}
                    onChange={(e) => setFilters(prev => ({ ...prev, minTJM: e.target.value }))}
                    placeholder="Min"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    value={filters.maxTJM}
                    onChange={(e) => setFilters(prev => ({ ...prev, maxTJM: e.target.value }))}
                    placeholder="Max"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Score */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Score minimum: {filters.minScore}/100
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={filters.minScore}
                  onChange={(e) => setFilters(prev => ({ ...prev, minScore: parseInt(e.target.value) }))}
                  className="block w-full"
                />
              </div>
            </div>

            {/* Compétences populaires */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Compétences</label>
              <div className="flex flex-wrap gap-2">
                {['React', 'Vue.js', 'Angular', 'Node.js', 'Python', 'Java', 'AWS', 'Docker', 'Kubernetes', 'MongoDB'].map(skill => (
                  <button
                    key={skill}
                    onClick={() => toggleSkillFilter(skill)}
                    className={`px-3 py-1 rounded-full text-sm font-medium border ${
                      filters.skills.includes(skill)
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    {skill}
                    {filters.skills.includes(skill) && (
                      <XCircleIcon className="w-4 h-4 ml-1 inline" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions de filtre */}
            <div className="mt-6 flex justify-between">
              <button
                onClick={() => setFilters({
                  search: '',
                  role: 'all',
                  experience: 'all',
                  location: 'all',
                  skills: [],
                  availability: 'all',
                  minTJM: '',
                  maxTJM: '',
                  minScore: 0,
                  contractType: 'all'
                })}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Réinitialiser les filtres
              </button>
              <div className="text-sm text-gray-600">
                {Object.values(filters).filter(v => v !== 'all' && v !== '' && v !== 0 && (!Array.isArray(v) || v.length > 0)).length} filtre(s) actif(s)
              </div>
            </div>
          </div>
        )}

        {/* Résultats */}
        {viewMode === 'grid' ? (
          <CandidateGrid candidates={paginatedCandidates} />
        ) : (
          <CandidateList candidates={paginatedCandidates} />
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Affichage de {((currentPage - 1) * candidatesPerPage) + 1} à {Math.min(currentPage * candidatesPerPage, filteredCandidates.length)} sur {filteredCandidates.length} résultats
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Précédent
              </button>
              
              {/* Pages */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNumber;
                if (totalPages <= 5) {
                  pageNumber = i + 1;
                } else if (currentPage <= 3) {
                  pageNumber = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + i;
                } else {
                  pageNumber = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      currentPage === pageNumber
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Suivant
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Composant Grid pour l'affichage en cartes
const CandidateGrid = ({ candidates }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {candidates.map(candidate => (
        <CandidateCard key={candidate.id} candidate={candidate} />
      ))}
    </div>
  );
};

// Composant List pour l'affichage en liste
const CandidateList = ({ candidates }) => {
  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidat</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Compétences</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TJM</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {candidates.map(candidate => (
              <CandidateListItem key={candidate.id} candidate={candidate} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Composant carte candidat
const CandidateCard = ({ candidate }) => {
  const getScoreColor = (score) => {
    if (score >= 85) return 'text-green-600 bg-green-100';
    if (score >= 70) return 'text-blue-600 bg-blue-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getExperienceLevel = (years) => {
    if (years <= 3) return { label: 'Junior', color: 'bg-green-100 text-green-800' };
    if (years <= 7) return { label: 'Confirmé', color: 'bg-blue-100 text-blue-800' };
    return { label: 'Senior', color: 'bg-purple-100 text-purple-800' };
  };

  const expLevel = getExperienceLevel(candidate.experience);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-12 w-12 bg-gray-300 rounded-full flex items-center justify-center"></div>