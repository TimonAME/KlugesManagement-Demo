<script setup>
import { ref, computed } from 'vue'

const selectedRole = ref('')
const subjectSearchQuery = ref('')
const selectedSubjects = ref([])
const formData = ref({
  firstName: '',
  lastName: '',
  birthDate: '',
  email: '',
  phone: '',
  address: {
    street: '',
    postalCode: '',
    city: '',
  },
  guardian: {
    firstName: '',
    lastName: '',
    birthDate: '',
    email: '',
    phone: '',
    address: {
      street: '',
      postalCode: '',
      city: '',
    },
  },
  school: '',
  class: '',
})

const subjects = [
  { id: 1, name: 'Mathematik', color: '#FF6B6B' },
  { id: 2, name: 'Deutsch', color: '#95E1D3' },
  { id: 3, name: 'Englisch', color: '#F38181' },
  { id: 4, name: 'Biologie', color: '#96CEB4' },
  { id: 5, name: 'Chemie', color: '#FFEAA7' },
  { id: 6, name: 'Physik', color: '#4ECDC4' },
  { id: 7, name: 'Geschichte', color: '#AA96DA' },
  { id: 8, name: 'Geografie', color: '#118AB2' },
  { id: 9, name: 'Sport', color: '#06D6A0' },
  { id: 10, name: 'Kunst', color: '#DDA15E' },
  { id: 11, name: 'Musik', color: '#BC6C25' },
  { id: 12, name: 'Informatik', color: '#6C63FF' },
]

const roles = [
  { name: 'Management', roleName: 'ROLE_MANAGEMENT' },
  { name: 'Standortleitung', roleName: 'ROLE_LOCATION_MANAGEMENT' },
  { name: 'Bürokraft', roleName: 'ROLE_OFFICE' },
  { name: 'Lehrkraft', roleName: 'ROLE_TEACHER' },
  { name: 'Marketing', roleName: 'ROLE_MARKETING' },
  { name: 'Schüler', roleName: 'ROLE_STUDENT' },
]

const subjectSearchResults = computed(() => {
  if (!subjectSearchQuery.value) return []
  return subjects.filter(
    (subject) =>
      subject.name.toLowerCase().includes(subjectSearchQuery.value.toLowerCase()) &&
      !selectedSubjects.value.some((selected) => selected.id === subject.id),
  )
})

const selectSubject = (subject) => {
  selectedSubjects.value.push(subject)
  subjectSearchQuery.value = ''
}

const removeSelectedSubject = (subjectId) => {
  selectedSubjects.value = selectedSubjects.value.filter((subject) => subject.id !== subjectId)
}

const handleSubmit = async () => {
  // Validierung
  if (!formData.value.firstName || !formData.value.lastName || !formData.value.email) {
    alert('Bitte füllen Sie alle Pflichtfelder aus!')
    return
  }

  if (selectedRole.value === 'ROLE_STUDENT') {
    if (
      !formData.value.guardian.firstName ||
      !formData.value.guardian.lastName ||
      !formData.value.guardian.email
    ) {
      alert('Bitte füllen Sie alle Pflichtfelder für den Erziehungsberechtigten aus!')
      return
    }
  }

  if (selectedRole.value === 'ROLE_TEACHER' && selectedSubjects.value.length === 0) {
    alert('Bitte wählen Sie mindestens ein Unterrichtsfach aus!')
    return
  }

  const payload = {
    ...formData.value,
    role: selectedRole.value,
    subjects: selectedRole.value === 'ROLE_TEACHER' ? selectedSubjects.value : undefined,
  }

  console.log('Demo: Registrierung würde folgende Daten senden:', payload)

  // Simuliere erfolgreiche Registrierung
  alert(
    `Erfolg! Benutzer "${formData.value.firstName} ${formData.value.lastName}" wurde registriert.\n\nRolle: ${roles.find((r) => r.roleName === selectedRole.value)?.name}\n\nIn der echten App würden Sie jetzt zur Benutzerliste weitergeleitet.`,
  )

  // Reset form
  resetForm()
}

const resetForm = () => {
  formData.value = {
    firstName: '',
    lastName: '',
    birthDate: '',
    email: '',
    phone: '',
    address: {
      street: '',
      postalCode: '',
      city: '',
    },
    guardian: {
      firstName: '',
      lastName: '',
      birthDate: '',
      email: '',
      phone: '',
      address: {
        street: '',
        postalCode: '',
        city: '',
      },
    },
    school: '',
    class: '',
  }
  selectedSubjects.value = []
  selectedRole.value = ''
}

// Demo: Beispieldaten füllen
const fillDemoData = () => {
  if (selectedRole.value === 'ROLE_TEACHER') {
    formData.value = {
      firstName: 'Maria',
      lastName: 'Schneider',
      birthDate: '1985-03-15',
      email: 'maria.schneider@example.com',
      phone: '+43 660 1234567',
      address: {
        street: 'Hauptstraße 42',
        postalCode: '1010',
        city: 'Wien',
      },
      guardian: {
        firstName: '',
        lastName: '',
        birthDate: '',
        email: '',
        phone: '',
        address: { street: '', postalCode: '', city: '' },
      },
      school: '',
      class: '',
    }
    selectedSubjects.value = [subjects[0], subjects[5]] // Mathematik, Physik
  } else if (selectedRole.value === 'ROLE_STUDENT') {
    formData.value = {
      firstName: 'Tim',
      lastName: 'Müller',
      birthDate: '2010-07-22',
      email: 'tim.mueller@example.com',
      phone: '+43 660 9876543',
      address: {
        street: 'Schulweg 15',
        postalCode: '1020',
        city: 'Wien',
      },
      guardian: {
        firstName: 'Peter',
        lastName: 'Müller',
        birthDate: '1978-05-10',
        email: 'peter.mueller@example.com',
        phone: '+43 660 1111111',
        address: {
          street: 'Schulweg 15',
          postalCode: '1020',
          city: 'Wien',
        },
      },
      school: 'BRG Wien',
      class: '5A',
    }
  } else {
    formData.value = {
      firstName: 'Klaus',
      lastName: 'Werner',
      birthDate: '1975-11-08',
      email: 'klaus.werner@example.com',
      phone: '+43 660 5555555',
      address: {
        street: 'Bürostraße 1',
        postalCode: '1030',
        city: 'Wien',
      },
      guardian: {
        firstName: '',
        lastName: '',
        birthDate: '',
        email: '',
        phone: '',
        address: { street: '', postalCode: '', city: '' },
      },
      school: '',
      class: '',
    }
  }
}
</script>

<template>
  <div
    class="absolute bg-window_bg rounded-window shadow-window w-[100%] h-[56px] left-0 top-0 select-none p-2"
  >
    <div class="flex items-center justify-between gap-4">
      <div class="flex items-center gap-4">
        <p class="text-secondary_text px-2">
          Wählen Sie die Rolle aus, die der Benutzer haben soll.
        </p>
        <select
          v-model="selectedRole"
          id="role"
          class="flex flex-row gap-2 items-center text-left px-4 py-2 rounded-window transition-colors bg-second_accent text-white stroke-white w-64 h-full border-none"
        >
          <option class="bg-window_bg text-secondary_text" value="" disabled selected>
            Bitte wählen...
          </option>
          <option
            class="bg-window_bg text-secondary_text"
            v-for="role in roles"
            :key="role.roleName"
            :value="role.roleName"
          >
            {{ role.name }}
          </option>
        </select>
      </div>
      <button
        v-if="selectedRole"
        @click="fillDemoData"
        class="px-4 py-2 bg-blue-500 text-white rounded-window hover:bg-blue-600 transition-colors text-sm whitespace-nowrap"
      >
        Demo-Daten füllen
      </button>
    </div>
  </div>

  <div
    class="absolute bg-window_bg rounded-window shadow-window w-[100%] h-[calc(100%-56px-8px)] left-0 bottom-0 transition-opacity duration-100"
    :class="selectedRole === '' ? 'bg-opacity-35' : 'bg-opacity-100'"
  >
    <!-- Placeholder wenn keine Rolle ausgewählt -->
    <div
      v-if="selectedRole === ''"
      class="h-full flex items-center justify-center text-gray-400 text-lg"
    >
      Bitte wählen Sie zuerst eine Rolle aus
    </div>

    <!-- Formular -->
    <form
      @submit.prevent="handleSubmit"
      class="h-full p-4 overflow-y-auto overflow-x-hidden"
      v-else
    >
      <div class="grid md:grid-cols-2 gap-6 w-full">
        <!-- Persönliche Informationen -->
        <div class="space-y-4 mb-4">
          <h2 class="text-lg font-semibold text-primary_text mb-4">Persönliche Informationen</h2>
          <div class="form-group">
            <label for="firstName" class="block text-sm font-medium text-primary_text mb-1">
              Vorname<span class="text-xl text-red-500">*</span>
            </label>
            <input
              v-model="formData.firstName"
              type="text"
              id="firstName"
              required
              class="block w-full p-2 border border-gray-300 rounded-window shadow-sm focus:ring-second-accent focus:border-second-accent"
            />
          </div>
          <div class="form-group">
            <label for="lastName" class="block text-sm font-medium text-primary_text mb-1">
              Nachname<span class="text-xl text-red-500">*</span>
            </label>
            <input
              v-model="formData.lastName"
              type="text"
              id="lastName"
              required
              class="block w-full p-2 border border-gray-300 rounded-window shadow-sm focus:ring-second-accent focus:border-second-accent"
            />
          </div>
          <div class="form-group">
            <label for="birthDate" class="block text-sm font-medium text-primary_text mb-1">
              Geburtsdatum<span class="text-xl text-red-500">*</span>
            </label>
            <input
              v-model="formData.birthDate"
              type="date"
              id="birthDate"
              required
              class="block w-full p-2 border border-gray-300 rounded-window shadow-sm focus:ring-second-accent focus:border-second-accent"
            />
          </div>
        </div>

        <!-- Kontaktinformationen -->
        <div class="space-y-4 mb-4">
          <h2 class="text-lg font-semibold text-primary_text mb-4">Kontaktinformationen</h2>
          <div class="form-group">
            <label for="email" class="block text-sm font-medium text-primary_text mb-1">
              Email<span class="text-xl text-red-500">*</span>
            </label>
            <input
              v-model="formData.email"
              type="email"
              id="email"
              required
              class="block w-full p-2 border border-gray-300 rounded-window shadow-sm focus:ring-second-accent focus:border-second-accent"
            />
          </div>
          <div class="form-group">
            <label for="phone" class="block text-sm font-medium text-primary_text mb-1">
              Telefonnummer<span class="text-xl text-red-500">*</span>
            </label>
            <input
              v-model="formData.phone"
              type="tel"
              id="phone"
              required
              class="block w-full p-2 border border-gray-300 rounded-window shadow-sm focus:ring-second-accent focus:border-second-accent"
            />
          </div>
          <div class="space-y-3">
            <label class="block text-sm font-medium text-primary_text mb-1">
              Adresse<span class="text-xl text-red-500">*</span>
            </label>
            <input
              v-model="formData.address.street"
              type="text"
              placeholder="Straße und Hausnummer"
              required
              class="block w-full p-2 border border-gray-300 rounded-window shadow-sm focus:ring-second-accent focus:border-second-accent mb-2"
            />
            <div class="grid grid-cols-2 gap-2">
              <input
                v-model="formData.address.postalCode"
                type="text"
                placeholder="PLZ"
                required
                class="block w-full p-2 border border-gray-300 rounded-window shadow-sm focus:ring-second-accent focus:border-second-accent"
              />
              <input
                v-model="formData.address.city"
                type="text"
                placeholder="Stadt"
                required
                class="block w-full p-2 border border-gray-300 rounded-window shadow-sm focus:ring-second-accent focus:border-second-accent"
              />
            </div>
          </div>
        </div>

        <!-- Erziehungsberechtigte (nur für Schüler) -->
        <div v-if="selectedRole === 'ROLE_STUDENT'" class="space-y-4 mb-4">
          <h2 class="text-lg font-semibold text-primary_text mb-4">Erziehungsberechtigte</h2>
          <div class="form-group">
            <label for="guardianFirstName" class="block text-sm font-medium text-primary_text mb-1">
              Vorname<span class="text-xl text-red-500">*</span>
            </label>
            <input
              v-model="formData.guardian.firstName"
              type="text"
              id="guardianFirstName"
              required
              class="block w-full p-2 border border-gray-300 rounded-window shadow-sm focus:ring-second-accent focus:border-second-accent"
            />
          </div>
          <div class="form-group">
            <label for="guardianLastName" class="block text-sm font-medium text-primary_text mb-1">
              Nachname<span class="text-xl text-red-500">*</span>
            </label>
            <input
              v-model="formData.guardian.lastName"
              type="text"
              id="guardianLastName"
              required
              class="block w-full p-2 border border-gray-300 rounded-window shadow-sm focus:ring-second-accent focus:border-second-accent"
            />
          </div>
          <div class="form-group">
            <label for="guardianBirthDate" class="block text-sm font-medium text-primary_text mb-1">
              Geburtsdatum<span class="text-xl text-red-500">*</span>
            </label>
            <input
              v-model="formData.guardian.birthDate"
              type="date"
              id="guardianBirthDate"
              required
              class="block w-full p-2 border border-gray-300 rounded-window shadow-sm focus:ring-second-accent focus:border-second-accent"
            />
          </div>
          <div class="form-group">
            <label for="guardianEmail" class="block text-sm font-medium text-primary_text mb-1">
              Email<span class="text-xl text-red-500">*</span>
            </label>
            <input
              v-model="formData.guardian.email"
              type="email"
              id="guardianEmail"
              required
              class="block w-full p-2 border border-gray-300 rounded-window shadow-sm focus:ring-second-accent focus:border-second-accent"
            />
          </div>
          <div class="form-group">
            <label for="guardianPhone" class="block text-sm font-medium text-primary_text mb-1">
              Telefonnummer<span class="text-xl text-red-500">*</span>
            </label>
            <input
              v-model="formData.guardian.phone"
              type="tel"
              id="guardianPhone"
              required
              class="block w-full p-2 border border-gray-300 rounded-window shadow-sm focus:ring-second-accent focus:border-second-accent"
            />
          </div>
          <div class="space-y-3">
            <label class="block text-sm font-medium text-primary_text mb-1">
              Adresse<span class="text-xl text-red-500">*</span>
            </label>
            <input
              v-model="formData.guardian.address.street"
              type="text"
              placeholder="Straße und Hausnummer"
              required
              class="block w-full p-2 border border-gray-300 rounded-window shadow-sm focus:ring-second-accent focus:border-second-accent mb-2"
            />
            <div class="grid grid-cols-2 gap-2">
              <input
                v-model="formData.guardian.address.postalCode"
                type="text"
                placeholder="PLZ"
                required
                class="block w-full p-2 border border-gray-300 rounded-window shadow-sm focus:ring-second-accent focus:border-second-accent"
              />
              <input
                v-model="formData.guardian.address.city"
                type="text"
                placeholder="Stadt"
                required
                class="block w-full p-2 border border-gray-300 rounded-window shadow-sm focus:ring-second-accent focus:border-second-accent"
              />
            </div>
          </div>
        </div>

        <!-- Schüler Informationen -->
        <div v-if="selectedRole === 'ROLE_STUDENT'" class="space-y-4 mb-4">
          <h2 class="text-lg font-semibold text-primary_text mb-4">Schüler Informationen</h2>
          <div class="form-group">
            <label for="school" class="block text-sm font-medium text-primary_text mb-1"
              >Schule</label
            >
            <input
              v-model="formData.school"
              type="text"
              id="school"
              class="block w-full p-2 border border-gray-300 rounded-window shadow-sm focus:ring-second-accent focus:border-second-accent"
            />
          </div>
          <div class="form-group">
            <label for="class" class="block text-sm font-medium text-primary_text mb-1"
              >Klasse</label
            >
            <input
              v-model="formData.class"
              type="text"
              id="class"
              class="block w-full p-2 border border-gray-300 rounded-window shadow-sm focus:ring-second-accent focus:border-second-accent"
            />
          </div>
        </div>

        <!-- Unterrichtsfächer (nur für Lehrer) -->
        <div v-if="selectedRole === 'ROLE_TEACHER'" class="space-y-4 mb-4 md:col-span-2">
          <h2 class="text-lg font-semibold text-primary_text mb-4">Unterrichtsfächer</h2>
          <div class="form-group">
            <label for="subjects" class="block text-sm font-medium text-primary_text mb-1">
              Fächer<span class="text-xl text-red-500">*</span>
            </label>
            <div class="relative">
              <input
                type="text"
                id="subjects"
                v-model="subjectSearchQuery"
                placeholder="Fach suchen..."
                class="block w-full p-2 border border-gray-300 rounded-window shadow-sm focus:ring-second-accent focus:border-second-accent"
              />
              <ul
                v-if="subjectSearchResults.length"
                class="absolute z-10 w-full bg-white border border-gray-300 rounded-window shadow-lg mt-1 max-h-48 overflow-y-auto"
              >
                <li
                  v-for="subject in subjectSearchResults"
                  :key="subject.id"
                  @click="selectSubject(subject)"
                  class="p-2 cursor-pointer hover:bg-gray-100 flex items-center gap-2"
                >
                  <span
                    class="w-3 h-3 rounded-full"
                    :style="{ backgroundColor: subject.color }"
                  ></span>
                  {{ subject.name }}
                </li>
              </ul>
            </div>
            <div v-if="selectedSubjects.length" class="flex flex-row flex-wrap gap-2 mt-2">
              <div
                v-for="subject in selectedSubjects"
                :key="subject.id"
                class="flex items-center gap-1 py-1 px-3 rounded-window text-sm font-medium"
                :style="{
                  backgroundColor: subject.color + '15',
                  color: subject.color,
                  border: `1px solid ${subject.color}40`,
                }"
              >
                <span>{{ subject.name }}</span>
                <button
                  type="button"
                  @click="removeSelectedSubject(subject.id)"
                  class="ml-1 hover:opacity-70 font-bold text-lg"
                >
                  ×
                </button>
              </div>
            </div>
            <p v-if="selectedSubjects.length === 0" class="text-sm text-gray-500 mt-1">
              Bitte wählen Sie mindestens ein Fach aus
            </p>
          </div>
        </div>
      </div>

      <!-- Submit Bereich -->
      <div class="mt-6 w-full">
        <div class="text-secondary_text mb-3">
          Felder mit einem <span class="text-xl text-red-500">*</span> müssen ausgefüllt werden
        </div>
        <div class="mb-4">
          <label class="flex items-center cursor-pointer">
            <input type="checkbox" class="mr-2 rounded-window" required />
            <span class="text-sm">
              Ich akzeptiere die
              <a
                href="#"
                class="text-main underline mx-1"
                @click.prevent="alert('Demo: AGB würden hier angezeigt')"
                >AGB</a
              >
              und die
              <a
                href="#"
                class="text-main underline ml-1"
                @click.prevent="alert('Demo: Datenschutzrichtlinien würden hier angezeigt')"
                >Datenschutzrichtlinien</a
              >.
            </span>
          </label>
        </div>
        <div class="flex gap-3">
          <button
            type="button"
            @click="resetForm"
            class="flex-1 px-6 py-3 rounded-window font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors"
          >
            Zurücksetzen
          </button>
          <button
            type="submit"
            class="flex-1 px-6 py-3 rounded-window font-semibold text-white bg-main opacity-80 hover:opacity-100 shadow-none hover:shadow-xl transition-all duration-200"
          >
            Registrieren
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped>
/* Smooth transitions */
input:focus,
select:focus {
  outline: none;
}

/* Custom scrollbar für subject dropdown */
ul::-webkit-scrollbar {
  width: 8px;
}

ul::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

ul::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

ul::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
