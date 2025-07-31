<template>
  <div class="flex flex-col space-y-2">
    <label :for="label" class="font-semibold text-sm">
      {{ label }}
    </label>

    <div>
      <div
        class="flex items-center rounded-md bg-white px-4 py-2 outline-1 -outline-offset-1 outline-stone-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600"
      >

        <input
          :value="modelValue"
          ref="inputRef"
          :id="label"
          type="text"
          :name="label"
          :placeholder="placeholder"
          class="block min-w-0 grow text-base text-stone-900 placeholder:text-stone-400 focus:outline-none sm:text-sm/6"
          @input="updateInput"
          @blur="closeDropdown"
        />

        <div class="relative grid shrink-0 grid-cols-1 ml-2">
          <div
            class="cursor-pointer flex items-center gap-1 text-stone-700"
            @click.stop="toggleDropdown"
          >
            {{ unitLabel || 'Sans Unité' }}
            <svg
              viewBox="0 0 16 16"
              fill="currentColor"
              aria-hidden="true"
              class="pointer-events-none size-4 text-stone-500"
            >
              <path
                d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
                clip-rule="evenodd"
                fill-rule="evenodd"
              />
            </svg>
          </div>

          <ul
            v-if="open"
            class="absolute right-0 z-100 mt-1 w-max min-w-full bg-white border border-stone-300 rounded-md shadow max-h-60 overflow-y-auto"
          >
            <li
              v-for="(option, index) in options"
              :key="option.id"
              @mousedown.prevent="selectOption(index)"
              class="px-4 py-2 cursor-pointer hover:bg-indigo-50"
            >
              {{ option.label }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps<{
  label: string;
  placeholder: string;
  modelValue: number | string;
  unit: string;
  options: Array<{ value: string; label: string; id: number }>;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void;
  (e: 'update:unit', value: string): void;
}>();

const inputRef = ref<HTMLInputElement | null>(null);
const open = ref(false);

const unitLabel = computed(() => {
  return props.options.find((opt) => opt.value === props.unit)?.label || '';
});

function updateInput(event: Event) {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
}

function selectOption(index: number) {
  const selected = props.options[index];
  if (selected) {
    emit('update:unit', selected.value);
    open.value = false;
  }
}

function toggleDropdown() {
  open.value = !open.value;
}

function closeDropdown() {
  // Optionnel : fermer le dropdown avec un délai pour permettre le clic sur un élément
  setTimeout(() => {
    open.value = false;
  }, 100);
}

function handleKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    open.value = false;
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown);
});
</script>
