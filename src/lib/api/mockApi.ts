// Mock API functions that simulate async data fetching
import {
  mockUsers,
  mockPatients,
  mockMedications,
  mockAppointments,
  mockHealthStats,
  mockMessages,
  mockNotes,
  mockHealthTips,
  type User,
  type Patient,
  type Medication,
  type Appointment,
  type HealthStat,
  type Message,
  type Note,
  type HealthTip,
} from './mockData';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Auth API
export const authApi = {
  login: async (email: string, password: string): Promise<User | null> => {
    await delay(500);
    const user = mockUsers.find(u => u.email === email);
    if (user && password === 'password123') {
      return user;
    }
    return null;
  },
  
  getCurrentUser: async (): Promise<User | null> => {
    await delay(200);
    const storedUser = localStorage.getItem('pulsecare_user');
    if (storedUser) {
      return JSON.parse(storedUser);
    }
    return null;
  },
  
  logout: async (): Promise<void> => {
    await delay(200);
    localStorage.removeItem('pulsecare_user');
  },
};

// Patients API
export const patientsApi = {
  getAll: async (): Promise<Patient[]> => {
    await delay(300);
    return mockPatients;
  },
  
  getById: async (id: string): Promise<Patient | undefined> => {
    await delay(200);
    return mockPatients.find(p => p.id === id);
  },
  
  update: async (id: string, data: Partial<Patient>): Promise<Patient> => {
    await delay(300);
    const index = mockPatients.findIndex(p => p.id === id);
    if (index !== -1) {
      mockPatients[index] = { ...mockPatients[index], ...data };
      return mockPatients[index];
    }
    throw new Error('Patient not found');
  },
  
  create: async (data: Omit<Patient, 'id' | 'createdAt'>): Promise<Patient> => {
    await delay(300);
    const newPatient: Patient = {
      ...data,
      id: `patient-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    mockPatients.push(newPatient);
    return newPatient;
  },
};

// Medications API
export const medicationsApi = {
  getAll: async (): Promise<Medication[]> => {
    await delay(300);
    return mockMedications;
  },
  
  create: async (data: Omit<Medication, 'id'>): Promise<Medication> => {
    await delay(300);
    const newMed: Medication = {
      ...data,
      id: `med-${Date.now()}`,
    };
    mockMedications.push(newMed);
    return newMed;
  },
  
  delete: async (id: string): Promise<void> => {
    await delay(200);
    const index = mockMedications.findIndex(m => m.id === id);
    if (index !== -1) {
      mockMedications.splice(index, 1);
    }
  },
};

// Appointments API
export const appointmentsApi = {
  getAll: async (): Promise<Appointment[]> => {
    await delay(300);
    return mockAppointments;
  },
  
  getByPatientId: async (patientId: string): Promise<Appointment[]> => {
    await delay(200);
    return mockAppointments.filter(a => a.patientId === patientId);
  },
  
  create: async (data: Omit<Appointment, 'id'>): Promise<Appointment> => {
    await delay(300);
    const newAppointment: Appointment = {
      ...data,
      id: `apt-${Date.now()}`,
    };
    mockAppointments.push(newAppointment);
    return newAppointment;
  },
  
  update: async (id: string, data: Partial<Appointment>): Promise<Appointment> => {
    await delay(300);
    const index = mockAppointments.findIndex(a => a.id === id);
    if (index !== -1) {
      mockAppointments[index] = { ...mockAppointments[index], ...data };
      return mockAppointments[index];
    }
    throw new Error('Appointment not found');
  },
  
  delete: async (id: string): Promise<void> => {
    await delay(200);
    const index = mockAppointments.findIndex(a => a.id === id);
    if (index !== -1) {
      mockAppointments.splice(index, 1);
    }
  },
};

// Health Stats API
export const healthStatsApi = {
  getAll: async (): Promise<HealthStat[]> => {
    await delay(300);
    return mockHealthStats;
  },
  
  create: async (data: Omit<HealthStat, 'id'>): Promise<HealthStat> => {
    await delay(300);
    const newStat: HealthStat = {
      ...data,
      id: `stat-${Date.now()}`,
    };
    mockHealthStats.push(newStat);
    return newStat;
  },
};

// Messages API
export const messagesApi = {
  getAll: async (): Promise<Message[]> => {
    await delay(300);
    return mockMessages;
  },
  
  markAsRead: async (id: string): Promise<void> => {
    await delay(200);
    const message = mockMessages.find(m => m.id === id);
    if (message) {
      message.read = true;
    }
  },
  
  getUnreadCount: async (): Promise<number> => {
    await delay(100);
    return mockMessages.filter(m => !m.read).length;
  },
};

// Notes API
export const notesApi = {
  getAll: async (): Promise<Note[]> => {
    await delay(300);
    return mockNotes;
  },
  
  create: async (data: Omit<Note, 'id'>): Promise<Note> => {
    await delay(300);
    const newNote: Note = {
      ...data,
      id: `note-${Date.now()}`,
    };
    mockNotes.push(newNote);
    return newNote;
  },
  
  update: async (id: string, data: Partial<Note>): Promise<Note> => {
    await delay(300);
    const index = mockNotes.findIndex(n => n.id === id);
    if (index !== -1) {
      mockNotes[index] = { ...mockNotes[index], ...data };
      return mockNotes[index];
    }
    throw new Error('Note not found');
  },
  
  delete: async (id: string): Promise<void> => {
    await delay(200);
    const index = mockNotes.findIndex(n => n.id === id);
    if (index !== -1) {
      mockNotes.splice(index, 1);
    }
  },
};

// Health Tips API
export const healthTipsApi = {
  getAll: async (): Promise<HealthTip[]> => {
    await delay(300);
    return mockHealthTips;
  },
  
  getRandom: async (): Promise<HealthTip> => {
    await delay(200);
    const randomIndex = Math.floor(Math.random() * mockHealthTips.length);
    return mockHealthTips[randomIndex];
  },
  
  getByCategory: async (category: HealthTip['category']): Promise<HealthTip[]> => {
    await delay(200);
    return mockHealthTips.filter(t => t.category === category);
  },
};
