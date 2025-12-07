<script setup>
import { ref, onMounted } from 'vue'

// Dummy-Daten für Demo
const demoExams = [
  {
    id: 1,
    date: { date: '2025-12-10' },
    subject: { name: 'Mathematik', color_hex_code: '#3B82F6' },
    user_taking_exam: { id: 101, first_name: 'Max', last_name: 'Mustermann' },
  },
  {
    id: 2,
    date: { date: '2025-12-12' },
    subject: { name: 'Deutsch', color_hex_code: '#EF4444' },
    user_taking_exam: { id: 102, first_name: 'Anna', last_name: 'Schmidt' },
  },
  {
    id: 3,
    date: { date: '2025-12-12' },
    subject: { name: 'Englisch', color_hex_code: '#10B981' },
    user_taking_exam: { id: 103, first_name: 'Paul', last_name: 'Meier' },
  },
]

const today = new Date()
const nextMonth = new Date(today)
nextMonth.setDate(today.getDate() + 31)

const exams = ref([])
const groupedExams = ref({})

onMounted(() => {
  exams.value = demoExams

  exams.value.forEach((exam) => {
    const date = new Date(exam.date.date).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
    })
    const examDate = new Date(exam.date.date)

    if (!groupedExams.value[date]) {
      groupedExams.value[date] = {
        exams: [],
        showExams: examDate <= nextMonth,
      }
    }
    groupedExams.value[date].exams.push(exam)
  })
})

const toggleExams = (date) => {
  if (groupedExams.value[date]) {
    groupedExams.value[date].showExams = !groupedExams.value[date].showExams
  }
}

const personSelected = (personId) => {
  alert(`Navigiere zu User-Profil: ${personId}`) // Demo: keine echte Navigation
}
</script>

<template>
  <div
    class="sm:h-[100%] w-full bg-window_bg rounded-window shadow-window overflow-hidden flex flex-col"
  >
    <div class="px-4 pt-2 border-b border-gray-100">
      <div class="flex items-center justify-between">
        <h2 class="text-primary_text text-base font-semibold">Schularbeitstermine (Demo)</h2>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto select-none">
      <div class="p-2 space-y-2">
        <div v-for="(group, date) in groupedExams" :key="date">
          <div
            @click="toggleExams(date)"
            class="flex items-center justify-between px-2 py-2 cursor-pointer hover:bg-gray-50 transition-colors rounded-window"
          >
            <div class="flex items-center space-x-2">
              <span class="text-sm font-semibold text-primary_text">{{ date }}</span>
              <span
                class="px-2 py-0.5 text-xs font-medium text-second-accent bg-[#a38cff51] rounded-full"
              >
                {{ group.exams.length }} {{ group.exams.length > 1 ? 'Prüfungen' : 'Prüfung' }}
              </span>
            </div>
          </div>

          <div v-show="group.showExams" class="py-1">
            <div v-for="exam in group.exams" :key="exam.id" class="relative group mb-2 last:mb-0">
              <div
                class="p-3 rounded-lg transition-all"
                :style="{ backgroundColor: exam.subject.color_hex_code + '15' }"
              >
                <div class="flex items-center justify-between">
                  <div class="flex flex-col gap-1">
                    <div
                      class="text-sm font-medium"
                      :style="{ color: exam.subject.color_hex_code }"
                    >
                      {{ exam.subject.name }}
                    </div>
                    <button
                      @click.stop="personSelected(exam.user_taking_exam.id)"
                      class="text-xs text-icon_color hover:underline transition-colors flex items-center gap-1"
                    >
                      {{ exam.user_taking_exam.first_name }} {{ exam.user_taking_exam.last_name }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="Object.keys(groupedExams).length === 0"
          class="text-center text-secondary_text py-4"
        >
          Keine bevorstehenden Schularbeiten oder Prüfungen.
        </div>
      </div>
    </div>
  </div>
</template>
