import React, { useState } from 'react';
import { GraduationCap, Search } from 'lucide-react';
import Chat from './components/Chat';

interface Course {
  id: string;
  subject: string;
  code: string;
  professor: string;
  campus: string;
  schedule: string;
  rating: number;
}

const courses: Course[] = [
  { id: '10001', subject: 'Matemáticas I', code: 'MAT101', professor: 'Juan Pérez', campus: 'Santo Domingo', schedule: '08AM a 10AM ( Presencial )', rating: 5 },
  { id: '10002', subject: 'Física I', code: 'FIS101', professor: 'Ana Gómez', campus: 'Santiago', schedule: '10AM a 12PM ( Presencial )', rating: 5 },
  { id: '10003', subject: 'Química I', code: 'QUI101', professor: 'Carlos López', campus: 'Santo Domingo', schedule: '13:00 a 15:00 ( en línea )', rating: 5 },
  { id: '10004', subject: 'Biología', code: 'BIO101', professor: 'Marta Ruiz', campus: 'Santiago', schedule: '03PM a 05PM ( Presencial )', rating: 5 },
  { id: '10005', subject: 'Historia', code: 'HIS101', professor: 'Luis Fernández', campus: 'Santo Domingo', schedule: '09AM a 11AM ( En línea )', rating: 5 },
  { id: '10006', subject: 'Geografía', code: 'GEO101', professor: 'Sofía Hernández', campus: 'Santiago', schedule: '11AM a 01PM ( Presencial )', rating: 5 },
  { id: '10007', subject: 'Literatura', code: 'LIT101', professor: 'Pedro Morales', campus: 'Santo Domingo', schedule: '14:00 a 16:00 ( en línea )', rating: 5 },
  { id: '10008', subject: 'Economía', code: 'ECO101', professor: 'Laura Gómez', campus: 'Santiago', schedule: '04PM a 06PM ( Presencial )', rating: 5 },
  { id: '10009', subject: 'Estadística', code: 'EST101', professor: 'Ricardo Martínez', campus: 'Santo Domingo', schedule: '08AM a 10AM ( En línea )', rating: 5 },
  { id: '10010', subject: 'Programación I', code: 'PROG101', professor: 'Elena Torres', campus: 'Santiago', schedule: '10AM a 12PM ( Presencial )', rating: 5 },
];

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCampus, setSelectedCampus] = useState('Todos los campus');

  const filteredCourses = courses.filter(course => {
    const matchesSearch = 
      course.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.professor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.id.includes(searchTerm);
    
    const matchesCampus = selectedCampus === 'Todos los campus' || course.campus === selectedCampus;
    
    return matchesSearch && matchesCampus;
  });

  const renderStars = (rating: number) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Programación Docente UASD 2024-20</h1>
            </div>
            <nav className="flex space-x-8">
              <a href="#" className="text-blue-600 hover:text-blue-800">Inicio</a>
              <a href="#" className="text-blue-600 hover:text-blue-800">Virtual</a>
              <a href="#" className="text-blue-600 hover:text-blue-800">Semipresencial</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Search Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              placeholder="Buscar Materia o Profesor"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="block w-48 pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 sm:text-sm rounded-md"
            value={selectedCampus}
            onChange={(e) => setSelectedCampus(e.target.value)}
          >
            <option>Todos los campus</option>
            <option>Santo Domingo</option>
            <option>Santiago</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comisión Reguladora del Consumidor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asignatura</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profesor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campus</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Horario</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Calificación</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCourses.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{course.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{course.subject} ( {course.code} )</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.professor}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.campus}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.schedule}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-400">{renderStars(course.rating)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center mt-6 space-x-2">
          <button className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200">&lt;</button>
          <button className="px-3 py-1 rounded-md bg-blue-600 text-white">1</button>
          <button className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200">2</button>
          <button className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200">3</button>
          <button className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200">4</button>
          <button className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200">5</button>
          <button className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200">&gt;</button>
        </div>
      </div>
      
      <Chat />
    </div>
  );
}

export default App;