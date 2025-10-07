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

// Page principale des projets
const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' ou 'list'
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 20;

  // États des filtres
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    status: 'all',
    client: 'all',
    technologies: [],
    minBudget: '',
    maxBudget: '',
    minDuration: '',
    maxDuration: ''
  });

  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showFilters, setShowFilters] = useState(false);

  // Génération de données mockées (45 projets)
  useEffect(() => {
    const generateMockProjects = () => {
      const categories = [
        'Développement Web', 'Application Mobile', 'E-commerce', 'Data Analytics',
        'Cloud Migration', 'DevOps', 'UI/UX Design', 'Transformation Digitale'
      ];

      const clients = [
        'BNP Paribas', 'Carrefour', 'LVMH', 'Sanofi', 'Air France', 'Renault',
        'Orange', 'Total Energies', 'Société Générale', 'AXA'
      ];

      const technologies = [
        'React', 'Vue.js', 'Angular', 'Node.js', 'Python', 'Java', 'AWS', 'Azure',
        'Docker', 'Kubernetes', 'MongoDB', 'PostgreSQL', 'Firebase', 'Flutter'
      ];

      const statuses = ['En cours', 'Terminé', 'En attente', 'Annulé'];

      const mockProjects = [];

      for (let i = 1; i <= 45; i++) {
        const category = categories[Math.floor(Math.random() * categories.length)];
        const client = clients[Math.floor(Math.random() * clients.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const selectedTech = technologies.slice(0, Math.floor(Math.random() * 5) + 3);
        
        mockProjects.push({
          id: `proj${i.toString().padStart(3, '0')}`,
          titre: `Projet ${category} - ${client}`,
          description: `Développement d'une solution ${category.toLowerCase()} pour ${client} visant à optimiser leurs processus métier.`,
          categorie: category,
          client,
          budget: Math.floor(Math.random() * 200000) + 50000,
          duree: Math.floor(Math.random() * 18) + 3,
          technologies: selectedTech.join(', '),
          technologiesArray: selectedTech,
          statut: status,
          dateDebut: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          dateFin: status === 'Terminé' ? new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : null,
          equipe: Math.floor(Math.random() * 8) + 2,
          progression: status === 'Terminé' ? 100 : Math.floor(Math.random() * 90) + 10
        });
      }

      return mockProjects;
    };

    setTimeout(() => {
      setProjects(generateMockProjects());
      setLoading(false);
    }, 1500);
  }, []);

  // Filtrage des projets
  const filteredProjects = useMemo(() => {
    let filtered = projects.filter(project => {
      const matchesSearch = !filters.search || 
        project.titre.toLowerCase().includes(filters.search.toLowerCase()) ||
        project.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        project.technologies.toLowerCase().includes(filters.search.toLowerCase());

      const matchesCategory = filters.category === 'all' || project.categorie === filters.category;
      const matchesStatus = filters.status === 'all' || project.statut === filters.status;
      const matchesClient = filters.client === 'all' || project.client === filters.client;

      const matchesTechnologies = filters.technologies.length === 0 || 
        filters.technologies.every(tech => project.technologiesArray.includes(tech));

      const matchesBudget = (!filters.minBudget || project.budget >= parseInt(filters.minBudget)) &&
        (!filters.maxBudget || project.budget <= parseInt(filters.maxBudget));

      const matchesDuration = (!filters.minDuration || project.duree >= parseInt(filters.minDuration)) &&
        (!filters.maxDuration || project.duree <= parseInt(filters.maxDuration));

      return matchesSearch && matchesCategory && matchesStatus && matchesClient && 
             matchesTechnologies && matchesBudget && matchesDuration;
    });

    // Tri
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      if (sortBy === 'date') {
        aValue = new Date(a.dateDebut);
        bValue = new Date(b.dateDebut);
      } else if (sortBy === 'titre') {
        aValue = a.titre.toLowerCase();
        bValue = b.titre.toLowerCase();
      } else if (sortBy === 'budget') {
        aValue = a.budget;
        bValue = b.budget;
      } else {
        aValue = a[sortBy];
        bValue = b[sortBy];
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [projects, filters, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * projectsPerPage,
    currentPage * projectsPerPage
  );

  // Ajout/suppression de technologies dans le filtre
  const toggleTechnologyFilter = (tech) => {
    setFilters(prev => ({
      ...prev,
      technologies: prev.technologies.includes(tech) 
        ? prev.technologies.filter(t => t !== tech)
        : [...prev.technologies, tech]
    }));
  };

  // Export des résultats filtrés
  const exportResults = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Titre,Categorie,Client,Budget,Duree,Technologies,Statut,Progression,Date Début\n"
      + filteredProjects.map(p => 
          `${p.titre},${p.categorie},${p.client},${p.budget},${p.duree},"${p.technologies}",${p.statut},${p.progression},${p.dateDebut}`
        ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `projets_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Chargement des 45 projets...</p>
          <div className="mt-2 w-64 bg-gray-200 rounded-full h-2 mx-auto">
            <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* PLUS DE HEADER ICI - il vient du layout */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête de page */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Projets IT</h1>
              <p className="text-sm text-gray-500">{filteredProjects.length} projets trouvés sur {projects.length}</p>
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
                  placeholder="Rechercher par titre, description, technologies..."
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
                <option value="date-desc">Date récente</option>
                <option value="date-asc">Date ancienne</option>
                <option value="titre-asc">Titre A-Z</option>
                <option value="titre-desc">Titre Z-A</option>
                <option value="budget-desc">Budget décroissant</option>
                <option value="budget-asc">Budget croissant</option>
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
              {/* Catégorie */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="all">Toutes les catégories</option>
                  <option value="Développement Web">Développement Web</option>
                  <option value="Application Mobile">Application Mobile</option>
                  <option value="E-commerce">E-commerce</option>
                  <option value="Data Analytics">Data Analytics</option>
                  <option value="Cloud Migration">Cloud Migration</option>
                  <option value="DevOps">DevOps</option>
                  <option value="UI/UX Design">UI/UX Design</option>
                </select>
              </div>

              {/* Statut */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="En cours">En cours</option>
                  <option value="Terminé">Terminé</option>
                  <option value="En attente">En attente</option>
                  <option value="Annulé">Annulé</option>
                </select>
              </div>

              {/* Client */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Client</label>
                <select
                  value={filters.client}
                  onChange={(e) => setFilters(prev => ({ ...prev, client: e.target.value }))}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="all">Tous les clients</option>
                  <option value="BNP Paribas">BNP Paribas</option>
                  <option value="Carrefour">Carrefour</option>
                  <option value="LVMH">LVMH</option>
                  <option value="Sanofi">Sanofi</option>
                  <option value="Air France">Air France</option>
                </select>
              </div>

              {/* Budget */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Budget (€)</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={filters.minBudget}
                    onChange={(e) => setFilters(prev => ({ ...prev, minBudget: e.target.value }))}
                    placeholder="Min"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    value={filters.maxBudget}
                    onChange={(e) => setFilters(prev => ({ ...prev, maxBudget: e.target.value }))}
                    placeholder="Max"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Durée */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Durée (mois)</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={filters.minDuration}
                    onChange={(e) => setFilters(prev => ({ ...prev, minDuration: e.target.value }))}
                    placeholder="Min"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    value={filters.maxDuration}
                    onChange={(e) => setFilters(prev => ({ ...prev, maxDuration: e.target.value }))}
                    placeholder="Max"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Technologies populaires */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Technologies</label>
              <div className="flex flex-wrap gap-2">
                {['React', 'Vue.js', 'Angular', 'Node.js', 'Python', 'Java', 'AWS', 'Docker', 'Kubernetes', 'MongoDB'].map(tech => (
                  <button
                    key={tech}
                    onClick={() => toggleTechnologyFilter(tech)}
                    className={`px-3 py-1 rounded-full text-sm font-medium border ${
                      filters.technologies.includes(tech)
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    {tech}
                    {filters.technologies.includes(tech) && (
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
                  category: 'all',
                  status: 'all',
                  client: 'all',
                  technologies: [],
                  minBudget: '',
                  maxBudget: '',
                  minDuration: '',
                  maxDuration: ''
                })}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Réinitialiser les filtres
              </button>
              <div className="text-sm text-gray-600">
                {Object.values(filters).filter(v => v !== 'all' && v !== '' && (!Array.isArray(v) || v.length > 0)).length} filtre(s) actif(s)
              </div>
            </div>
          </div>
        )}

        {/* Résultats */}
        {viewMode === 'grid' ? (
          <ProjectGrid projects={paginatedProjects} />
        ) : (
          <ProjectList projects={paginatedProjects} />
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Affichage de {((currentPage - 1) * projectsPerPage) + 1} à {Math.min(currentPage * projectsPerPage, filteredProjects.length)} sur {filteredProjects.length} résultats
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
const ProjectGrid = ({ projects }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map(project => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
};

// Composant List pour l'affichage en liste
const ProjectList = ({ projects }) => {
  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Projet</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durée</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progression</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {projects.map(project => (
              <ProjectListItem key={project.id} project={project} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Composant carte projet
const ProjectCard = ({ project }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Terminé': return 'bg-green-100 text-green-800';
      case 'En cours': return 'bg-blue-100 text-blue-800';
      case 'En attente': return 'bg-yellow-100 text-yellow-800';
      case 'Annulé': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-green-600';
    if (progress >= 50) return 'bg-blue-600';
    if (progress >= 30) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{project.titre}</h3>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.statut)}`}>
              {project.statut}
            </span>
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <HeartIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>

        {/* Métriques */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-500">Budget</p>
            <p className="text-sm font-semibold text-gray-900">{project.budget.toLocaleString()} €</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Durée</p>
            <p className="text-sm font-semibold text-gray-900">{project.duree} mois</p>
          </div>
        </div>

        {/* Barre de progression */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Progression</span>
            <span>{project.progression}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${getProgressColor(project.progression)}`}
              style={{ width: `${project.progression}%` }}
            ></div>
          </div>
        </div>

        {/* Technologies */}
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-2">Technologies</p>
          <div className="flex flex-wrap gap-1">
            {project.technologiesArray.slice(0, 3).map((tech, index) => (
              <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-50 text-blue-700">
                {tech}
              </span>
            ))}
            {project.technologiesArray.length > 3 && (
              <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-50 text-gray-600">
                +{project.technologiesArray.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center text-sm text-gray-500">
            <ClockIcon className="w-4 h-4 mr-1" />
            {project.dateDebut}
          </div>
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            Voir détails
          </button>
        </div>
      </div>
    </div>
  );
};

// Composant ligne de liste projet
const ProjectListItem = ({ project }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Terminé': return 'bg-green-100 text-green-800';
      case 'En cours': return 'bg-blue-100 text-blue-800';
      case 'En attente': return 'bg-yellow-100 text-yellow-800';
      case 'Annulé': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-green-600';
    if (progress >= 50) return 'bg-blue-600';
    if (progress >= 30) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div>
          <div className="text-sm font-medium text-gray-900">{project.titre}</div>
          <div className="text-sm text-gray-500">{project.categorie}</div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{project.client}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{project.budget.toLocaleString()} €</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{project.duree} mois</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.statut)}`}>
          {project.statut}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
            <div 
              className={`h-2 rounded-full ${getProgressColor(project.progression)}`}
              style={{ width: `${project.progression}%` }}
            ></div>
          </div>
          <span className="text-sm text-gray-600">{project.progression}%</span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button className="text-blue-600 hover:text-blue-900 mr-4">Éditer</button>
        <button className="text-red-600 hover:text-red-900">Supprimer</button>
      </td>
    </tr>
  );
};

export default ProjectsPage;